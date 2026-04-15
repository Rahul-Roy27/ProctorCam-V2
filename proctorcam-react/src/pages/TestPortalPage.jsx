import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TestPortalPage.css';

export default function TestPortalPage() {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const proceedToTest = async () => {
    console.log("clicked");

    try {
      const el = document.documentElement;

      if (el.requestFullscreen) {
        await el.requestFullscreen();
      }

      navigate("/test/active");
    } catch (err) {
      console.log("Fullscreen failed:", err);
      navigate("/test/active");
    }
  };

  return (
    <div className="portal-page">
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-proctor">Proctor</span><span className="logo-ai">AI</span>
          </div>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/test" className="active">Test</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search assessments..." />
          </div>
          <button className="icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </button>
          <button className="icon-btn" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </button>
          <div className="avatar">
            <img src="https://images.unsplash.com/photo-1775218888901-088696a4ee0b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User" />
          </div>
        </div>
      </nav>

      <main className="portal-content">
        <div className="portal-card">

          <div className="portal-header">
            <div className="shield-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="11" r="3" fill="#2563eb" /></svg>
            </div>
            <span className="portal-label">ASSESSMENT PORTAL</span>
            <h1 className="portal-title">Lab Assessment - 3</h1>
          </div>

          <div className="stats-grid">
            <div className="stat-box bg-gray">
              <span className="stat-name">QUESTIONS</span>
              <span className="stat-val text-dark">10</span>
            </div>
            <div className="stat-box bg-gray">
              <span className="stat-name">DURATION</span>
              <span className="stat-val text-dark">30 Mins</span>
            </div>
            <div className="stat-box bg-green-light border-green">
              <span className="stat-name text-green-dark">CORRECT</span>
              <span className="stat-val text-green">+4</span>
            </div>
            <div className="stat-box bg-red-light border-red">
              <span className="stat-name text-red-dark">WRONG</span>
              <span className="stat-val text-red">-1</span>
            </div>
          </div>

          <div className="instructions-section">
            <h3 className="inst-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              General Instructions
            </h3>
            <ul className="inst-list">
              <li>Ensure you are in a quiet, well-lit room for the duration of the test.</li>
              <li>Multiple browser tabs or application switching will trigger a proctoring violation.</li>
              <li>The test will automatically submit when the timer expires.</li>
              <li>Do not refresh the page or click back during the assessment.</li>
            </ul>
          </div>

          <div className="alert-box">
            <div className="alert-icon-wrap">
              <div className="cam-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
              </div>
            </div>
            <div className="alert-text">
              <h4>Webcam Permission Required</h4>
              <p>Your video and audio will be recorded and analyzed by AI for identity verification and anti-cheating protocols.</p>
            </div>
          </div>

          <button className="btn-start" onClick={handleStartClick}>
            Start Test
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </main>

      {/* ── PROCTORING FOOTER ── */}
      <div className="proctoring-footer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <span>PROCTORING ALERT</span>
      </div>

      {/* ── WARNING MODAL ── */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal">
            <div className="modal-header">
              <div className="modal-icon text-red">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <h3>Ready to Begin?</h3>
            </div>
            <div className="modal-body">
              <p>Once you click <strong>Proceed</strong>, the proctoring environment will immediately lock your browser and start tracking.</p>
              <ul>
                <li>If you leave the test window, a violation will be recorded.</li>
                <li>Ensure your face is clearly visible in the webcam at all times.</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowWarning(false)}>Cancel</button>
              <button className="btn-proceed" onClick={proceedToTest}>Proceed</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
