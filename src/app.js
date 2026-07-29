/**
 * app.js — Sogoian Personality Assessment
 *
 * UI controller. Manages screen transitions, quiz state,
 * question rendering, score accumulation, and result card download.
 *
 * Dependencies (must be loaded before this script):
 *   - src/questions.js  → QUESTIONS[]
 *   - src/engine.js     → ARCHETYPES[], accumulateScore(), findClosestArchetype()
 *   - html2canvas (CDN, loaded with defer — checked at call time)
 */

'use strict';

// ── STATE ─────────────────────────────────────────────────────────────────────

const state = {
  currentIndex: 0,
  selectedVectors: [],   // array of chosen answer vectors, one per question
  isTransitioning: false // guard against rapid input during screen transitions
};

// ── DOM REFERENCES ────────────────────────────────────────────────────────────

const screens = {
  landing: document.getElementById('screen-landing'),
  quiz:    document.getElementById('screen-quiz'),
  result:  document.getElementById('screen-result')
};

const el = {
  btnStart:        document.getElementById('btn-start'),
  btnDownload:     document.getElementById('btn-download'),
  btnRestart:      document.getElementById('btn-restart'),

  progressBar:     document.getElementById('progress-bar'),
  progressLabel:   document.getElementById('progress-label'),
  progressTrack:   document.querySelector('.quiz__progress-track'),

  questionText:    document.getElementById('question-text'),
  optionsContainer: document.getElementById('options-container'),

  resultCard:        document.getElementById('result-card'),
  resultArchetypeName: document.getElementById('result-archetype-name'),
  resultImage:       document.getElementById('result-image'),
  resultAnalysis:    document.getElementById('result-analysis')
};

// ── SCREEN TRANSITIONS ────────────────────────────────────────────────────────

/**
 * Transitions from one screen to another with a fade animation.
 * @param {HTMLElement} from
 * @param {HTMLElement} to
 * @param {Function} [onAfterHide] — Optional callback run after `from` is hidden.
 */
function transitionTo(from, to, onAfterHide) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  from.classList.add('screen--exiting');

  // Match the CSS --transition-base duration (240ms)
  setTimeout(() => {
    from.classList.remove('screen--active', 'screen--exiting');
    from.style.display = 'none';

    if (typeof onAfterHide === 'function') onAfterHide();

    to.style.display = '';
    to.classList.add('screen--active', 'screen--entering');

    // Remove the entering class after the animation completes (400ms)
    setTimeout(() => {
      to.classList.remove('screen--entering');
      state.isTransitioning = false;
    }, 420);

  }, 250);
}

// ── QUIZ LOGIC ────────────────────────────────────────────────────────────────

/**
 * Resets state and begins the assessment from question 1.
 */
function startQuiz() {
  state.currentIndex = 0;
  state.selectedVectors = [];

  transitionTo(screens.landing, screens.quiz, () => {
    renderQuestion(0);
  });
}

/**
 * Renders the question and options for the given index.
 * @param {number} index — 0-based question index into QUESTIONS[].
 */
function renderQuestion(index) {
  const question = QUESTIONS[index];

  // Update progress
  const questionNumber = index + 1;
  const progressPercent = (index / QUESTIONS.length) * 100;

  el.progressBar.style.width = `${progressPercent}%`;
  el.progressLabel.textContent = `QUERY ${String(questionNumber).padStart(2, '0')} / ${QUESTIONS.length}`;
  el.progressTrack.setAttribute('aria-valuenow', questionNumber);

  // Update question text with a brief fade
  el.questionText.style.transition = 'none';
  el.optionsContainer.style.transition = 'none';
  el.questionText.style.opacity = '0';
  el.optionsContainer.style.opacity = '0';

  requestAnimationFrame(() => {
    el.questionText.textContent = question.text;

    // Build option buttons
    el.optionsContainer.innerHTML = '';
    for (const option of question.options) {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', `Option ${option.label}: ${option.text}`);
      btn.dataset.vector = JSON.stringify(option.vector);

      const labelSpan = document.createElement('span');
      labelSpan.className = 'option-label';
      labelSpan.setAttribute('aria-hidden', 'true');
      labelSpan.textContent = option.label;

      const textSpan = document.createElement('span');
      textSpan.className = 'option-text';
      textSpan.textContent = option.text;

      btn.appendChild(labelSpan);
      btn.appendChild(textSpan);

      btn.addEventListener('click', () => handleOptionSelect(btn, option.vector));
      el.optionsContainer.appendChild(btn);
    }

    // Fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.questionText.style.transition = 'opacity 200ms ease';
        el.optionsContainer.style.transition = 'opacity 200ms ease';
        el.questionText.style.opacity = '1';
        el.optionsContainer.style.opacity = '1';
      });
    });
  });
}

/**
 * Handles an answer selection: records the vector, advances the quiz.
 * @param {HTMLButtonElement} selectedBtn
 * @param {number[]} vector
 */
function handleOptionSelect(selectedBtn, vector) {
  // Visual feedback — mark selected, disable all options
  const allOptions = el.optionsContainer.querySelectorAll('.option-btn');
  allOptions.forEach(btn => {
    btn.classList.add('disabled');
    btn.setAttribute('aria-disabled', 'true');
  });
  selectedBtn.classList.add('selected');
  selectedBtn.classList.remove('disabled');

  // Record the answer
  state.selectedVectors.push(vector);
  state.currentIndex++;

  const delay = 380; // brief pause so the selected state is visible

  if (state.currentIndex < QUESTIONS.length) {
    setTimeout(() => renderQuestion(state.currentIndex), delay);
  } else {
    setTimeout(() => finishQuiz(), delay);
  }
}

/**
 * Calculates the result and transitions to the result screen.
 */
function finishQuiz() {
  // Fill progress bar to 100% before transitioning
  el.progressBar.style.width = '100%';
  el.progressLabel.textContent = `QUERY ${QUESTIONS.length} / ${QUESTIONS.length}`;

  const scoreVector = accumulateScore(state.selectedVectors);
  const archetype = findClosestArchetype(scoreVector);

  transitionTo(screens.quiz, screens.result, () => {
    populateResult(archetype);
  });
}

// ── RESULT POPULATION ─────────────────────────────────────────────────────────

/**
 * Populates the result card with the matched archetype's data.
 * @param {object} archetype — An archetype object from ARCHETYPES[].
 */
function populateResult(archetype) {
  el.resultArchetypeName.textContent = archetype.name.toUpperCase();
  el.resultAnalysis.textContent = archetype.analysis;

  el.resultImage.src = archetype.image;
  el.resultImage.alt = `${archetype.name} — archetype illustration`;

  // Scroll result container to top
  screens.result.scrollTo({ top: 0, behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── CANVAS DOWNLOAD ───────────────────────────────────────────────────────────

/**
 * Captures #result-card using html2canvas and triggers a PNG download.
 * Falls back gracefully if html2canvas is unavailable.
 */
function downloadResult() {
  if (typeof html2canvas !== 'function') {
    // CDN failed to load — prompt user to save manually
    el.btnDownload.textContent = 'RIGHT-CLICK THE CARD TO SAVE';
    el.btnDownload.disabled = true;
    return;
  }

  const originalText = el.btnDownload.textContent;
  el.btnDownload.textContent = 'RENDERING...';
  el.btnDownload.disabled = true;

  html2canvas(el.resultCard, {
    backgroundColor: '#141414',
    scale: 2,              // 2x resolution for crisp mobile/retina output
    useCORS: true,
    logging: false
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        el.btnDownload.textContent = 'EXPORT FAILED';
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'my-sogoian-result.png';
      anchor.click();
      URL.revokeObjectURL(url);

      el.btnDownload.textContent = 'DOWNLOADED';
      setTimeout(() => {
        el.btnDownload.textContent = originalText;
        el.btnDownload.disabled = false;
      }, 2500);
    }, 'image/png');
  }).catch(() => {
    el.btnDownload.textContent = 'EXPORT FAILED';
    el.btnDownload.disabled = false;
  });
}

// ── RESTART ───────────────────────────────────────────────────────────────────

/**
 * Resets the UI and returns to the landing screen.
 */
function restartAssessment() {
  // Reset result card
  el.resultArchetypeName.textContent = '';
  el.resultAnalysis.textContent = '';
  el.resultImage.src = '';
  el.resultImage.alt = '';
  el.btnDownload.textContent = 'DOWNLOAD RESULT';
  el.btnDownload.disabled = false;

  // Reset quiz state
  state.currentIndex = 0;
  state.selectedVectors = [];
  el.progressBar.style.width = '0%';
  el.progressLabel.textContent = 'QUERY 01 / 25';
  el.progressTrack.setAttribute('aria-valuenow', 0);
  el.optionsContainer.innerHTML = '';
  el.questionText.textContent = '';

  transitionTo(screens.result, screens.landing);
}

// ── EVENT LISTENERS ───────────────────────────────────────────────────────────

el.btnStart.addEventListener('click', startQuiz);
el.btnDownload.addEventListener('click', downloadResult);
el.btnRestart.addEventListener('click', restartAssessment);

// Keyboard: allow Enter/Space to activate focused option buttons
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const focused = document.activeElement;
    if (focused && focused.classList.contains('option-btn') && !focused.classList.contains('disabled')) {
      e.preventDefault();
      focused.click();
    }
  }
});
