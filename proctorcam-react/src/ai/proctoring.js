export function startProctoring(video, showToast, setStatus) {

    let noFaceStart = null;
    let multipleFaceStart = null;
    let lastFaceWidth = null;
    let stream = null;
    let camera = null;

    let noFaceSent = false;
    let multiFaceSent = false;

    const THRESHOLD_TIME = 2000;

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

    faceDetection.onResults((results) => {
        const faces = results.detections || [];
        const now = Date.now();

        let faceWidth = 0;

        if (faces.length > 0) {
            faceWidth = faces[0].boundingBox.width;
        }

        // 🔥 movement detection
        if (faceWidth && lastFaceWidth) {
            const change = Math.abs(faceWidth - lastFaceWidth);

            if (change > 0.08) {
                showToast("⚠️ Sudden face change");
                sendEvent("suspicious_movement");
            }
        }

        if (faceWidth > 0.35) {
            showToast("⚠️ Face too close");
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
                showToast("No face detected!");
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
                showToast("Multiple faces detected!");
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