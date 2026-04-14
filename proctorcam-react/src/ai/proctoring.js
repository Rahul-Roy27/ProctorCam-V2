import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
export function startProctoring(video, canvas, showToast, setStatus) {

    let noFaceStart = null;
    let multipleFaceStart = null;
    let lastFaceWidth = null;
    let stream = null;
    let camera = null;
    let lastFace = null;

    let noFaceSent = false;
    let multiFaceSent = false;
    let model = null;
    let lastRun = 0;

    const THRESHOLD_TIME = 2000;

    async function loadModel() {
        model = await cocoSsd.load();
    }

    loadModel();

    async function startCamera() {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            }
        });
        video.srcObject = stream;
    }

    startCamera();

    const faceDetection = new FaceDetection({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
        model: "short",
        minDetectionConfidence: 0.5
    });

    faceDetection.onResults(async (results) => {
        const faces = results.detections || [];
        const now = Date.now();

        // run every 500ms
        if (model && video.readyState === 4 && now - lastRun > 500) {
            lastRun = now;

            const predictions = await model.detect(video);

            predictions.forEach(p => {
                if (p.class === "cell phone" && p.score > 0.6) {
                    showToast("📱 Phone detected!",true);
                    sendEvent("phone_detected");
                }
            });
        }

        let faceWidth = 0;

        const ctx = canvas.getContext("2d");

        // match canvas size to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (faces.length > 0) {
            const box = faces[0].boundingBox;

            // 1. draw face box
            const x = box.xCenter - box.width / 2;
            const y = box.yCenter - box.height / 2;

            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 3;

            ctx.strokeRect(
                x * canvas.width,
                y * canvas.height,
                box.width * canvas.width,
                box.height * canvas.height
            );

            // 2. reuse same detection data
            faceWidth = box.width;
        } else {
            faceWidth = 0;
        }

        // 🔥 movement detection
        if (faceWidth && lastFaceWidth) {
            const change = Math.abs(faceWidth - lastFaceWidth);

            if (change > 0.08) {
                showToast("⚠️ Sudden face change",true);
                sendEvent("suspicious_movement");
            }
        }

        if (faces.length > 0) {
            const box = faces[0].boundingBox;

            const currentFace = {
                x: box.xCenter,
                y: box.yCenter,
                width: box.width
            };

            if (lastFace) {
                const dx = Math.abs(currentFace.x - lastFace.x);
                const dy = Math.abs(currentFace.y - lastFace.y);
                const dw = Math.abs(currentFace.width - lastFace.width);

                // 🎯 movement detection
                if (dx > 0.05 || dy > 0.05) {
                    showToast("⚠️ Head moved suspiciously",true);
                    sendEvent("head_movement");
                }

                // 🎯 distance change
                if (dw > 0.08) {
                    showToast("⚠️ Moving too close/far",true);
                    sendEvent("distance_change");
                }
            }

            lastFace = currentFace;
        }

        if (faceWidth > 0.35) {
            showToast("⚠️ Face too close",true);
            sendEvent("face_too_close");
        }

        lastFaceWidth = faceWidth;

        // ✅ React-friendly status update
        if (faces.length === 0) {
            setStatus("❌ No face detected");
        } else if (faces.length === 1) {
            setStatus("🟢 Normal");
        } else {
            setStatus("⚠️ Multiple faces detected");
        }

        // NO FACE
        if (faces.length === 0) {
            if (!noFaceStart) noFaceStart = now;

            if (now - noFaceStart > THRESHOLD_TIME && !noFaceSent) {
                sendEvent("no_face");
                showToast("No face detected!",true);
                noFaceSent = true;
            }
        } else {
            noFaceStart = null;
            noFaceSent = false;
        }

        // MULTIPLE FACES
        if (faces.length > 1) {
            if (!multipleFaceStart) multipleFaceStart = now;

            if (now - multipleFaceStart > THRESHOLD_TIME && !multiFaceSent) {
                sendEvent("multiple_faces");
                showToast("Multiple faces detected!",true);
                multiFaceSent = true;
            }
        } else {
            multipleFaceStart = null;
            multiFaceSent = false;
        }
    });

    camera = new Camera(video, {
        onFrame: async () => {
            await faceDetection.send({ image: video });
        },
        width: 640,
        height: 480
    });

    camera.start();

    async function sendEvent(type) {
        try {
            await fetch("http://localhost:5000/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event: type,
                    timestamp: Date.now()
                })
            });
        } catch {
            console.log("Backend not running yet");
        }
    }

    return () => {
        if (camera) {
            camera.stop();
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        console.log("Camera stopped ✅");
    };

}