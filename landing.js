/* ══════════════════════════════════════
   ProctorAI – script.js
   ══════════════════════════════════════ */

// ── 1. Scroll-reveal: feature cards & stat items ─────────────────────────────
const revealTargets = document.querySelectorAll('.feature-card, .stat-item');

const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
revealTargets.forEach(el => revealObserver.observe(el));

// ── 2. Animated counters ──────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return;
  const isDecimal = target % 1 !== 0;
  const dur = 1800, fps = 60, steps = (dur / 1000) * fps;
  let frame = 0;

  const tick = () => {
    frame++;
    const eased = 1 - Math.pow(1 - frame / steps, 3);
    const val   = target * eased;
    el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val).toString();
    if (frame < steps) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : String(target);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const n = e.target.querySelector('.stat-n[data-target]');
      if (n) animateCounter(n);
      counterObs.unobserve(e.target);
    }
  }),
  { threshold: 0.3 }
);
document.querySelectorAll('.stat-item').forEach(el => counterObs.observe(el));

// ── 3. Navbar shadow on scroll ────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 32px rgba(0,0,0,0.5)'
    : 'none';
}, { passive: true });

// ── 4. Feature card mouse-tracking glow ──────────────────────────────────────
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(0,200,255,0.06) 0%, #0f1420 55%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── 5. Button ripple effect ───────────────────────────────────────────────────
if (!document.getElementById('ripple-kf')) {
  const s = document.createElement('style');
  s.id = 'ripple-kf';
  s.textContent = `@keyframes ripple{to{transform:scale(3);opacity:0}}`;
  document.head.appendChild(s);
}

document.querySelectorAll('.btn-primary, .btn-ghost, .btn-portal').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r    = this.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement('span');
    Object.assign(span.style, {
      position: 'absolute', borderRadius: '50%',
      width: `${size}px`, height: `${size}px`,
      left: `${e.clientX - r.left - size / 2}px`,
      top:  `${e.clientY - r.top  - size / 2}px`,
      background: 'rgba(255,255,255,0.12)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none',
    });
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  });
});

// ── 6. Parallax – hero visual subtle float ────────────────────────────────────
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx * 10;
    const dy = (e.clientY - cy) / cy * 6;
    heroVisual.style.transform = `translate(${dx}px, ${dy}px)`;
  }, { passive: true });
}