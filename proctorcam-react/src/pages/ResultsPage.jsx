import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './ResultsPage.css'

export default function ResultsPage() {
  const progressRef = useRef(null)
  const scoreRef    = useRef(null)
  const percentRef  = useRef(null)

  /* ── score ring animation ──────────────────────────────────────────────── */
  useEffect(() => {
    const progress = progressRef.current
    if (!progress) return

    const circumference = 2 * Math.PI * 76
    const score = 8, total = 10
    const percent = score / total
    const offset = circumference * (1 - percent)

    progress.style.strokeDasharray = circumference
    progress.style.strokeDashoffset = circumference

    requestAnimationFrame(() => {
      setTimeout(() => {
        progress.style.strokeDashoffset = offset
      }, 200)
    })
  }, [])

  /* ── count-up animation ────────────────────────────────────────────────── */
  useEffect(() => {
    const scoreEl = scoreRef.current
    const percentEl = percentRef.current
    if (!scoreEl || !percentEl) return

    const targetScore = 8
    const targetPercent = 80
    const duration = 1000
    const startTime = performance.now()

    function update(currentTime) {
      const elapsed = currentTime - startTime
      const prog = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - prog, 3)

      scoreEl.textContent = Math.round(eased * targetScore)
      percentEl.textContent = Math.round(eased * targetPercent) + '%'

      if (prog < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="results-page">

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search assessments..." />
          </div>
          <button className="icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="icon-btn" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <div className="avatar">
            <img src="https://images.unsplash.com/photo-1775218888901-088696a4ee0b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User"/>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="results-wrapper">
        <div className="results-card">

          {/* Green accent bar */}
          <div className="card-accent-bar"></div>

          {/* Badge */}
          <div className="badge-row">
            <span className="complete-badge">ASSESSMENT COMPLETE</span>
          </div>

          {/* Title */}
          <h1 className="results-title">Final Performance</h1>
          <p className="results-subtitle">System Architecture &amp; Intelligence Core Analysis</p>

          {/* Score Ring */}
          <div className="score-ring-wrapper">
            <div className="score-ring-container">
              <svg className="score-ring" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="76" fill="none" stroke="#e5e7ef" strokeWidth="10"/>
                <circle
                  ref={progressRef}
                  cx="90" cy="90" r="76" fill="none" stroke="#1d4ed8" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="477.5"
                  strokeDashoffset="95.5"
                  className="score-progress"
                  transform="rotate(-90 90 90)"
                />
              </svg>
              <div className="score-center">
                <span className="score-value" ref={scoreRef}>8</span><span className="score-total">/10</span>
                <div className="score-percent" ref={percentRef}>80%</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">TIME TAKEN</span>
              <div className="stat-value">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>24:12</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">ATTEMPTED</span>
              <div className="stat-value">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>10/10</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">VIOLATIONS</span>
              <div className="stat-value">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Proctoring Timeline */}
          <div className="timeline-card">
            <div className="timeline-header">
              <span className="timeline-title">Proctoring Timeline</span>
              <span className="clean-badge">CLEAN STATUS</span>
            </div>
            <div className="timeline-body">
              <div className="timeline-line"></div>

              <div className="timeline-event">
                <div className="timeline-icon green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div className="timeline-event-card">
                  <div className="event-header">
                    <strong>Integrity Scan Passed</strong>
                    <span className="event-time">00:00</span>
                  </div>
                  <p className="event-desc">System environment verified. No unauthorized processes detected at launch.</p>
                </div>
              </div>

              <div className="timeline-event event-end">
                <div className="timeline-icon gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
                </div>
                <p className="event-note">Continuous monitoring active. No anomalies recorded.</p>
              </div>
            </div>
          </div>

          {/* Return Button */}
          <Link to="/dashboard" className="btn-return">
            Return to Dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>

        </div>
      </main>
    </div>
  )
}
