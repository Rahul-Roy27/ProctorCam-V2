import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

/* ─── tiny SVG helpers ─── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
  </svg>
)

/* ══════════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const heroVisualRef = useRef(null)
  const featureRefs   = useRef([])
  const statRefs      = useRef([])
  const [showLoginModal, setShowLoginModal] = useState(false)

  /* ── scroll-reveal ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const targets = [...featureRefs.current, ...statRefs.current].filter(Boolean)
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  /* ── animated counters ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const counterObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const n = e.target.querySelector('.stat-n[data-target]')
          if (n) animateCounter(n)
          counterObs.unobserve(e.target)
        }
      }),
      { threshold: 0.3 }
    )
    statRefs.current.filter(Boolean).forEach(el => counterObs.observe(el))
    return () => counterObs.disconnect()
  }, [])

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target)
    if (isNaN(target)) return
    const isDecimal = target % 1 !== 0
    const dur = 1800, fps = 60, steps = (dur / 1000) * fps
    let frame = 0
    const tick = () => {
      frame++
      const eased = 1 - Math.pow(1 - frame / steps, 3)
      const val = target * eased
      el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val).toString()
      if (frame < steps) requestAnimationFrame(tick)
      else el.textContent = isDecimal ? target.toFixed(1) : String(target)
    }
    requestAnimationFrame(tick)
  }

  /* ── navbar shadow ─────────────────────────────────────────────────────────── */
  const navRef = useRef(null)
  useEffect(() => {
    const handler = () => {
      if (navRef.current)
        navRef.current.style.boxShadow = window.scrollY > 10
          ? '0 4px 32px rgba(0,0,0,0.5)' : 'none'
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* ── parallax hero-visual float ────────────────────────────────────────────── */
  useEffect(() => {
    const el = heroVisualRef.current
    if (!el) return
    const handler = e => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx * 10
      const dy = (e.clientY - cy) / cy * 6
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  /* ── feature card mouse-tracking glow ──────────────────────────────────────── */
  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    card.style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(0,200,255,0.06) 0%, #0f1420 55%)`
  }, [])

  const handleCardMouseLeave = useCallback((e) => {
    e.currentTarget.style.background = ''
  }, [])

  /* ── button ripple ─────────────────────────────────────────────────────────── */
  const ripple = useCallback((e) => {
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    const size = Math.max(r.width, r.height)
    const span = document.createElement('span')
    Object.assign(span.style, {
      position: 'absolute', borderRadius: '50%',
      width: `${size}px`, height: `${size}px`,
      left: `${e.clientX - r.left - size / 2}px`,
      top: `${e.clientY - r.top - size / 2}px`,
      background: 'rgba(255,255,255,0.12)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none',
    })
    btn.style.position = 'relative'
    btn.style.overflow = 'hidden'
    btn.appendChild(span)
    span.addEventListener('animationend', () => span.remove())
  }, [])

  /* ── ref collector helper ──────────────────────────────────────────────────── */
  const setFeatureRef = (i) => (el) => { featureRefs.current[i] = el }
  const setStatRef    = (i) => (el) => { statRefs.current[i] = el }

  /* ── feature data ──────────────────────────────────────────────────────────── */
  const features = [
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
      title: 'Live Face Monitoring',
      desc: 'Continuous eye-tracking and facial landmark analysis ensures the student remains focused and verified throughout the session.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M9 8h6M9 12h4" strokeLinecap="round"/></svg>,
      title: 'Tab Switch Detection',
      desc: 'Instant alerts if the user exits the browser window or attempts to toggle applications. Smart focus-lock technology.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
      title: '3 Strike Auto Submit',
      desc: 'Configurable integrity thresholds. Automatic exam termination and submission upon repeated suspicious behavior detected by AI.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>,
      title: 'Enterprise Security',
      desc: 'SOC2 certified infrastructure with end-to-end encryption. Full audit logs and compliance reporting for every session.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3" strokeLinecap="round"/></svg>,
      title: 'Real-time Alerts',
      desc: 'Proctor dashboards receive live flags with timestamps. AI confidence scores surface the most critical incidents first.',
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title: 'Behavioral Analytics',
      desc: 'Post-exam reports with heatmaps, attention timelines, and anomaly breakdowns—built for academic integrity officers.',
    },
  ]

  /* ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="landing-page">

      {/* ── NAVBAR ── */}
      <nav className="navbar" ref={navRef}>
        <div className="nav-left">
          <div className="nav-logo">
            <div className="logo-shield"><ShieldIcon /></div>
            ProctorAI
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Docs</a>
            <a href="#">Enterprise</a>
          </div>
        </div>
        <div className="nav-right">
          <button className="btn-portal" onClick={(e) => { ripple(e); setShowLoginModal(true); }} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            AI POWERED EXAM PROCTORING
          </div>
          <h1 className="hero-title">
            Exams That<br/>
            <span className="accent">Can't Be<br/>Cheated</span>
          </h1>
          <p className="hero-sub">
            Enterprise-grade behavioral analysis and real-time monitoring
            designed for high-stakes digital certification.
          </p>
          <div className="hero-ctas">
            <a href="#" className="btn-primary" onClick={ripple}>Get Started Free</a>
            <a href="#" className="btn-ghost" onClick={ripple}><span className="play-tri">▶</span>View Demo</a>
          </div>
          <div className="trust-row">
            <span>✓ SOC2 Certified</span>
            <span>✓ 150+ Institutions</span>
            <span>✓ 2M+ Exams Taken</span>
          </div>
        </div>

        <div className="hero-visual" ref={heroVisualRef}>
          <div className="grid-bg"></div>
          <div className="scan-ring r1"></div>
          <div className="scan-ring r2"></div>
          <div className="scan-ring r3"></div>
          <div className="scan-ring r4"></div>
          <div className="eye-wrap">
            <div className="eye-outer"></div>
            <div className="eye-mid"></div>
            <div className="eye-core"></div>
            <div className="eye-pulse"></div>
          </div>
          <div className="bracket tl"></div>
          <div className="bracket tr"></div>
          <div className="bracket bl"></div>
          <div className="bracket br"></div>
          <div className="scan-line"></div>
          <div className="hud-tag top">BIOMETRIC SCAN ACTIVE</div>
          <div className="hud-tag btm">IDENTITY VERIFIED ✓</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-eyebrow">CORE CAPABILITIES</div>
        <h2 className="section-title">Bulletproof Integrity Layer</h2>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              data-i={i}
              ref={setFeatureRef(i)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="ficon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat-item" ref={setStatRef(0)}>
            <div className="stat-num-row">
              <span className="stat-n" data-target="99.9">0</span>
              <span className="stat-sfx">%</span>
            </div>
            <span className="stat-lbl">ACCURACY</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item" ref={setStatRef(1)}>
            <div className="stat-num-row">
              <span className="stat-n" data-target="150">0</span>
              <span className="stat-sfx">+</span>
            </div>
            <span className="stat-lbl">INSTITUTIONS</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item" ref={setStatRef(2)}>
            <div className="stat-num-row">
              <span className="stat-n" data-target="2">0</span>
              <span className="stat-sfx">M+</span>
            </div>
            <span className="stat-lbl">EXAMS TAKEN</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item" ref={setStatRef(3)}>
            <div className="stat-num-row">
              <span className="stat-n stat-txt">SOC2</span>
            </div>
            <span className="stat-lbl">CERTIFIED</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <h2 className="cta-title">Ready to eliminate cheating?</h2>
        <p className="cta-sub">Join 150+ institutions trusting ProctorAI for their high-stakes assessments.</p>
        <div className="hero-ctas" style={{ justifyContent: 'center', marginBottom: 0 }}>
          <a href="#" className="btn-primary" onClick={ripple}>Get Started Free</a>
          <a href="#" className="btn-ghost" onClick={ripple}>Talk to Sales</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-shield sm"><ShieldIcon /></div>
              ProctorAI
            </div>
            <p>Precision architecture for<br/>high-stakes digital assessment.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></a>
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col"><h4>Product</h4><a href="#">Features</a><a href="#">Pricing</a><a href="#">Changelog</a><a href="#">Roadmap</a></div>
            <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Team</a><a href="#">Careers</a><a href="#">Blog</a></div>
            <div className="footer-col"><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">Cookies</a></div>
            <div className="footer-col"><h4>Developers</h4><a href="#">Documentation</a><a href="#">API Reference</a><a href="#">Status</a><a href="#">Support</a></div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 ProctorAI. Precision Architecture.</span>
          <span>All rights reserved.</span>
        </div>
      </footer>

      {/* ── LOGIN MODAL ── */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal-content">
            <div className="modal-header">
              <h3>Select Login Type</h3>
              <button className="btn-close" onClick={() => setShowLoginModal(false)}>✕</button>
            </div>
            <div className="login-options">
              <Link to="/dashboard" className="login-option student">
                <div className="lo-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                <div className="lo-text">
                  <span className="lo-title">Login as Student</span>
                  <span className="lo-sub">Access your assessments and dashboard</span>
                </div>
              </Link>
              <Link to="/admin" className="login-option admin" onClick={() => setShowLoginModal(false)}>
                <div className="lo-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg></div>
                <div className="lo-text">
                  <span className="lo-title">Login as Admin</span>
                  <span className="lo-sub">Manage exams, reports, and proctoring logs</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
