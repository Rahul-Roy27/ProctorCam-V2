import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { startProctoring } from "../ai/proctoring";
import './TestPage.css'

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function TestPage() {
  const navigate = useNavigate()
  const warningCount = useRef(0);

  /* ── state ─────────────────────────────────────────────────────────────── */
  const [currentQuestion, setCurrentQuestion] = useState(3)
  const [questionStates, setQuestionStates] = useState([1, 1, 1, 2, 0, 0, 0, 0, 0, 0])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [markedForReview, setMarkedForReview] = useState({})
  const [totalSeconds, setTotalSeconds] = useState(42 * 60 + 15)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Starting...");
  const canvasRef = useRef(null);
  const totalQuestions = 10

  useEffect(() => {
    localStorage.removeItem("proctoring_logs");
    warningCount.current = 0;
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;

      if (!isFullscreen) {
        showToast("⚠️ You exited fullscreen. Auto-submitting test.");
        autoSubmitTest();
      }
    };



    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let hiddenStart = null;

    const handleVisibility = () => {
      if (document.hidden) {
        hiddenStart = Date.now();
        showToast("⚠️ Tab switch detected!", true);
      } else {
        const duration = Date.now() - hiddenStart;

        if (hiddenStart && duration > 1000) {
          showToast("⚠️ You returned after leaving the tab", true);
        }

        hiddenStart = null;
      }
    };

    const handleBlur = () => {
      showToast("⚠️ Window lost focus (Alt+Tab detected)", true);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    let cleanup; // ✅ MUST exist here

    if (videoRef.current) {
      cleanup = startProctoring(videoRef.current, canvasRef.current, showToast, setStatus);
    }

    return () => {
      if (cleanup) cleanup(); // ✅ now valid
    };
  }, []);

  /* ── timer ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setTotalSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const autoSubmitTest = () => {
    navigate("/results");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const timerPercent = (totalSeconds / (60 * 60)) * 100
  const isUrgent = totalSeconds <= 300

  /* ── navigation ────────────────────────────────────────────────────────── */
  const goToQuestion = useCallback((n) => {
    if (n < 1 || n > totalQuestions) return
    setCurrentQuestion(prev => {
      setQuestionStates(qs => {
        const next = [...qs]
        if (selectedOptions[prev] !== undefined) next[prev - 1] = 1
        return next
      })
      return n
    })
  }, [selectedOptions, totalQuestions])

  /* ── option selection ──────────────────────────────────────────────────── */
  const selectOption = useCallback((value) => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestion]: value }))
    setQuestionStates(qs => {
      const next = [...qs]
      next[currentQuestion - 1] = 1
      return next
    })
  }, [currentQuestion])

  /* ── mark for review ───────────────────────────────────────────────────── */
  const toggleMarkForReview = useCallback(() => {
    setMarkedForReview(prev => {
      const next = { ...prev, [currentQuestion]: !prev[currentQuestion] }
      showToast(next[currentQuestion] ? 'Marked for review' : 'Review mark removed')
      return next
    })
  }, [currentQuestion])

  const captureSnapshot = () => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.7);
  };

  /* ── toast ─────────────────────────────────────────────────────────────── */
  const toastTimeout = useRef(null)
  const showToast = (msg, isWarning = false) => {
    setToast(msg);

    if (isWarning) {
      const logs = JSON.parse(localStorage.getItem("proctoring_logs") || "[]");

      const warning = {
        id: logs.length + 1,
        type: "warning",
        message: msg,
        timestamp: Date.now(),
        snapshot: captureSnapshot()
      };
      logs.push(warning);

      localStorage.setItem("proctoring_logs", JSON.stringify(logs));
    }

    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
    console.log(warningCount.current)
    // only count REAL warnings
    if (isWarning) {
      warningCount.current += 1;

      console.log("Warning:", warningCount.current);

      if (warningCount.current >= 3) {
        showToast("🚨 Too many violations. Auto-submitting test.");
        setTimeout(() => {
          autoSubmitTest();
        }, 500);
      }
    }
  };

  /* ── modal ─────────────────────────────────────────────────────────────── */
  const showWarningHistory = () => {
    const logs = JSON.parse(localStorage.getItem("proctoring_logs") || "[]");

    if (logs.length === 0) {
      setModal({
        title: 'Warning History',
        message: 'No warnings recorded in this session.',
        showConfirm: false
      });
      return;
    }

    const formatted = logs
      .map((log, i) => {
        const time = new Date(log.timestamp).toLocaleTimeString();

        return `${i + 1}. ${log.message} (${time})`;
      })
      .join("\n");

    setModal({
      title: 'Warning History',
      message: formatted,
      showConfirm: false
    });
  };

  const submitTest = () => {
    const answered = questionStates.filter(s => s === 1).length
    const unanswered = totalQuestions - answered
    setModal({
      title: 'Submit Test?',
      message: `You have answered ${answered} out of ${totalQuestions} questions. ${unanswered > 0 ? `${unanswered} question(s) are unanswered.` : ''} Are you sure you want to submit your test?`,
      showConfirm: true
    })
  }

  const confirmSubmit = () => {
    setModal(null)
    navigate('/results')
  }

  /* ── palette state helper ──────────────────────────────────────────────── */
  const getPaletteClass = (i) => {
    const qNum = i + 1
    if (qNum === currentQuestion) return 'state-active'
    if (markedForReview[qNum]) return 'state-marked'
    if (questionStates[i] === 1) return 'state-answered'
    return 'state-not-visited'
  }

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="test-page">

      {/* ── MAIN LAYOUT ── */}
      <div className="main-layout">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">

          {/* Question Header */}
          <div className="question-header">
            <div className="question-meta">
              <span className="exam-tag">Assessment - 2</span>
              <h2 className="subject-title">Physics: Mechanics &amp; Dynamics</h2>
            </div>
            <div className="question-badge">Q{currentQuestion} of {totalQuestions}</div>
          </div>

          {/* Question Card */}
          <div className="question-card">
            <p className="question-text">
              A block of mass 5kg is placed on a smooth horizontal surface. A horizontal force F = 2t (where t is in
              seconds) is applied to it. At what time t will the block lose contact with the surface if the surface starts
              accelerating upwards with 2m/s²?
            </p>

            {/* Diagram */}
            <div className="diagram-wrapper">
              <div className="diagram-box">
                <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" className="physics-svg">
                  <line x1="40" y1="115" x2="260" y2="115" stroke="#5bb8e0" strokeWidth="3" />
                  {[40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map(x => (
                    <line key={x} x1={x} y1="118" x2={x + 15} y2="133" stroke="#5bb8e0" strokeWidth="1.5" />
                  ))}
                  <rect x="118" y="77" width="64" height="38" rx="3" fill="#e08a30" />
                  <defs>
                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#e0e0e0" />
                    </marker>
                    <marker id="arrow-up" markerWidth="8" markerHeight="8" refX="3" refY="6" orient="auto">
                      <path d="M0,8 L6,8 L3,0 z" fill="#e0e0e0" />
                    </marker>
                  </defs>
                  <line x1="200" y1="96" x2="240" y2="96" stroke="#e0e0e0" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="248" y="100" fill="#e0e0e0" fontSize="13" fontFamily="DM Sans, sans-serif">F</text>
                  <line x1="60" y1="110" x2="60" y2="75" stroke="#e0e0e0" strokeWidth="2" markerEnd="url(#arrow-up)" />
                  <text x="63" y="72" fill="#e0e0e0" fontSize="11" fontFamily="DM Sans, sans-serif">a</text>
                </svg>
              </div>
            </div>

            {/* Options */}
            <div className="options-list">
              {[
                { value: 'A', text: 't = 5.0 seconds' },
                { value: 'B', text: 't = 2.5 seconds' },
                { value: 'C', text: 't = 3.0 seconds' },
                { value: 'D', text: 't = 4.0 seconds' },
              ].map(opt => {
                const isSelected = selectedOptions[currentQuestion] === opt.value
                return (
                  <div
                    key={opt.value}
                    className={`option-item${isSelected ? ' selected' : ''}`}
                    onClick={() => selectOption(opt.value)}
                  >
                    <span className={`option-label${isSelected ? ' selected-label' : ''}`}>{opt.value}</span>
                    <span className="option-text">{opt.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-nav">
            <button className="btn-secondary" onClick={() => goToQuestion(currentQuestion - 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </button>
            <button className="btn-warning" onClick={showWarningHistory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Warning History
            </button>
            <button
              className="btn-review"
              onClick={toggleMarkForReview}
              style={markedForReview[currentQuestion] ? { background: '#fde68a', borderColor: '#f59e0b' } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Mark for Review
            </button>
            <button className="btn-primary-test" onClick={() => goToQuestion(currentQuestion + 1)}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">

          {/* Timer */}
          <div className="timer-card">
            <div className={`timer-display${isUrgent ? ' urgent' : ''}`}>{formatTime(totalSeconds)}</div>
            <div className="timer-label">TIME REMAINING</div>
            <div className="timer-bar-wrap">
              <div
                className={`timer-bar${isUrgent ? ' urgent' : ''}`}
                style={{ width: `${Math.max(0, Math.min(100, timerPercent))}%` }}
              ></div>
            </div>
          </div>

          {/* Live Feed */}
          <div className="livefeed-image">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="live-video"
            />

            {/* NEW: overlay canvas */}
            <canvas
              ref={canvasRef}
              className="face-overlay"
            />

            <div className="confidence-badge">{status}</div>
          </div>

          {/* Question Palette */}
          <div className="palette-card">
            <div className="palette-title">QUESTION PALETTE</div>
            <div className="palette-grid">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i}
                  className={`palette-btn ${getPaletteClass(i)}`}
                  onClick={() => goToQuestion(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="palette-legend">
              <div className="legend-item"><span className="legend-dot answered"></span><span>ANSWERED</span></div>
              <div className="legend-item"><span className="legend-dot marked"></span><span>MARKED</span></div>
              <div className="legend-item"><span className="legend-dot not-visited"></span><span>NOT VISITED</span></div>
              <div className="legend-item"><span className="legend-dot active"></span><span>ACTIVE</span></div>
            </div>
          </div>

          {/* Submit */}
          <button className="btn-submit" onClick={submitTest}>SUBMIT TEST</button>
        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast-msg">{toast}</div>
      )}

      {/* ── MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="modal">
            <h3>{modal.title}</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{modal.message}</pre>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)}>Close</button>
              {modal.showConfirm && (
                <button className="modal-confirm" onClick={confirmSubmit}>Submit Test</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
