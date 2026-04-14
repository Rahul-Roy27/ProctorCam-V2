// ===== STATE =====
const state = {
  currentQuestion: 3,
  totalQuestions: 10,
  totalSeconds: 42 * 60 + 15,
  // 0: not-visited, 1: answered, 2: marked
  questionStates: [1, 1, 1, 2, 0, 0, 0, 0, 0, 0],
  selectedOptions: {},
  markedForReview: {}
};

// ===== TIMER =====
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimer() {
  const display = document.getElementById('timer');
  const bar = document.getElementById('timerBar');
  if (state.totalSeconds > 0) state.totalSeconds--;

  display.textContent = formatTime(state.totalSeconds);

  const pct = (state.totalSeconds / (60 * 60)) * 100; // assume 60min total
  bar.style.width = Math.max(0, Math.min(100, pct)) + '%';

  if (state.totalSeconds <= 300) {
    display.classList.add('urgent');
    bar.classList.add('urgent');
  }
}

setInterval(updateTimer, 1000);

// ===== PALETTE =====
function renderPalette() {
  const grid = document.getElementById('palette');
  grid.innerHTML = '';
  for (let i = 1; i <= state.totalQuestions; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i;
    const idx = i - 1;

    if (i === state.currentQuestion) {
      btn.classList.add('state-active');
    } else if (state.markedForReview[i]) {
      btn.classList.add('state-marked');
    } else if (state.questionStates[idx] === 1) {
      btn.classList.add('state-answered');
    } else if (state.questionStates[idx] === 0) {
      btn.classList.add('state-not-visited');
    }

    btn.addEventListener('click', () => goToQuestion(i));
    grid.appendChild(btn);
  }
}

function goToQuestion(n) {
  if (n < 1 || n > state.totalQuestions) return;
  // Mark previous as answered if selected
  if (state.selectedOptions[state.currentQuestion] !== undefined) {
    state.questionStates[state.currentQuestion - 1] = 1;
  }
  state.currentQuestion = n;
  renderPalette();
  updateQuestionBadge();
  restoreSelection();
}

function updateQuestionBadge() {
  document.querySelector('.question-badge').textContent =
    `Q${state.currentQuestion} of ${state.totalQuestions}`;
}

// ===== OPTION SELECTION =====
function selectOption(el) {
  document.querySelectorAll('.option-item').forEach(o => {
    o.classList.remove('selected');
    o.querySelector('.option-label').classList.remove('selected-label');
  });
  el.classList.add('selected');
  el.querySelector('.option-label').classList.add('selected-label');
  state.selectedOptions[state.currentQuestion] = el.dataset.value;
  state.questionStates[state.currentQuestion - 1] = 1;
  renderPalette();
}

function restoreSelection() {
  document.querySelectorAll('.option-item').forEach(o => {
    o.classList.remove('selected');
    o.querySelector('.option-label').classList.remove('selected-label');
  });
  const saved = state.selectedOptions[state.currentQuestion];
  if (saved) {
    const el = document.querySelector(`.option-item[data-value="${saved}"]`);
    if (el) {
      el.classList.add('selected');
      el.querySelector('.option-label').classList.add('selected-label');
    }
  }
}

// ===== NAVIGATION =====
function navigate(direction) {
  goToQuestion(state.currentQuestion + direction);
}

// ===== MARK FOR REVIEW =====
function markForReview() {
  const q = state.currentQuestion;
  state.markedForReview[q] = !state.markedForReview[q];
  const btn = document.querySelector('.btn-review');
  if (state.markedForReview[q]) {
    btn.style.background = '#fde68a';
    btn.style.borderColor = '#f59e0b';
    showToast('Marked for review');
  } else {
    btn.style.background = '';
    btn.style.borderColor = '';
    showToast('Review mark removed');
  }
  renderPalette();
}

// ===== WARNING HISTORY =====
function toggleWarningHistory() {
  showModal(
    'Warning History',
    'No warnings have been recorded for this session. Your proctoring session is currently active and monitoring behavior in real time.',
    false
  );
}

// ===== SUBMIT =====
function submitTest() {
  const answered = state.questionStates.filter(s => s === 1).length;
  const unanswered = state.totalQuestions - answered;
  showModal(
    'Submit Test?',
    `You have answered ${answered} out of ${state.totalQuestions} questions. ${unanswered > 0 ? `${unanswered} question(s) are unanswered.` : ''} Are you sure you want to submit your test?`,
    true
  );
}

// ===== MODAL =====
let modalElement = null;

function showModal(title, message, showConfirm) {
  if (modalElement) modalElement.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">
        <button class="modal-cancel" onclick="closeModal()">Close</button>
        ${showConfirm ? `<button class="modal-confirm" onclick="confirmSubmit()">Submit Test</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  modalElement = overlay;

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  if (modalElement) {
    modalElement.remove();
    modalElement = null;
  }
}

function confirmSubmit() {
  closeModal();
  showToast('Test submitted successfully!');
}

// ===== TOAST =====
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1d2e;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: fadeIn 0.2s ease;
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// ===== PROCTORING ALERT =====
// Simulate occasional alerts
let alertVisible = true;
function toggleProctoringAlert() {
  const alert = document.getElementById('proctoringAlert');
  alertVisible = !alertVisible;
  alert.style.display = alertVisible ? 'flex' : 'none';
}
// Simulate alert flashing every 8s
setInterval(() => {
  const alert = document.getElementById('proctoringAlert');
  alert.style.opacity = '0';
  alert.style.transition = 'opacity 0.3s';
  setTimeout(() => {
    alert.style.opacity = '1';
  }, 400);
}, 8000);

// ===== INIT =====
renderPalette();