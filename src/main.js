/* ==========================================================================
   TOSS THE UNSURE — Main Application Orchestrator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let coin3D = null;
  let activeTab = 'assessment';

  // Diagnostic mode state
  let currentQuestions = [];
  let questionIndex = 0;
  let recordedAnswers = [];

  // DOM Element References
  const flipBtn = document.getElementById('flip-btn');
  const btnText = flipBtn.querySelector('.btn-text');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Diagnostic DOM elements
  const progressDots = document.getElementById('progress-dots');
  const qCounter = document.getElementById('q-counter');
  const qText = document.getElementById('q-text');
  const qAnswerInput = document.getElementById('q-answer');
  const qNextBtn = document.getElementById('q-next-btn');
  const qValidation = document.getElementById('q-validation');
  const ctaWrapper = document.getElementById('cta-wrapper');

  // Decide For Me DOM elements
  const optionAInput = document.getElementById('option-a');
  const optionBInput = document.getElementById('option-b');

  // Result Modal elements
  const resultModal = document.getElementById('result-modal');
  const closeResultBtn = document.getElementById('close-result-btn');
  const decisionFactorBox = document.getElementById('decision-factor-box');
  const evaluatedOptionsText = document.getElementById('evaluated-options-text');
  const questionFactorBox = document.getElementById('question-factor-box');
  const recordedFactorText = document.getElementById('recorded-factor-text');

  // History Drawer elements
  const historyDrawer = document.getElementById('history-drawer');
  const historyToggleBtn = document.getElementById('history-toggle-btn');
  const closeHistoryBtn = document.getElementById('close-history-btn');

  // Audio Toggle element
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  // 1. Initialize 3D Engine after Intro or directly
  const init3D = () => {
    if (!coin3D) {
      coin3D = new Coin3DEngine('canvas-container');
      coin3D.init();
    }
  };

  // Start Intro Controller
  const intro = new IntroController(() => {
    init3D();
  });
  intro.init();

  // 2. Tab Navigation
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClick();
      const targetTab = btn.getAttribute('data-tab');
      activeTab = targetTab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');

      if (targetTab === 'assessment' && currentQuestions.length === 0) {
        startAssessment();
      }
    });
  });

  // 3. Diagnostic Questionnaire Logic
  function startAssessment() {
    currentQuestions = getRandomQuestions(5);
    questionIndex = 0;
    recordedAnswers = [];
    if (qValidation) qValidation.style.display = 'none';
    if (qAnswerInput) qAnswerInput.classList.remove('error');
    if (ctaWrapper) ctaWrapper.style.display = 'none';
    renderQuestion();
  }

  // Initialize diagnostic questions on load
  startAssessment();

  function renderQuestion() {
    if (qValidation) qValidation.style.display = 'none';
    if (qAnswerInput) qAnswerInput.classList.remove('error');

    if (questionIndex >= currentQuestions.length) {
      // All 5 questions answered successfully
      qText.textContent = "All 5 diagnostic calibration questions completed! Fate is ready for your toss.";
      qAnswerInput.style.display = 'none';
      qNextBtn.style.display = 'none';
      qCounter.textContent = "Calibration Complete (5/5)";

      // Reveal the FLIP THE COIN button
      if (ctaWrapper) {
        ctaWrapper.style.display = 'block';
        ctaWrapper.style.opacity = '1';
      }
    } else {
      qAnswerInput.style.display = 'block';
      qNextBtn.style.display = 'inline-block';
      if (ctaWrapper) ctaWrapper.style.display = 'none'; // Keep hidden Q1-Q4

      qText.textContent = currentQuestions[questionIndex];
      qAnswerInput.value = '';
      qAnswerInput.focus();

      qCounter.textContent = `Question ${questionIndex + 1} of 5`;

      if (questionIndex === 4) {
        qNextBtn.innerHTML = 'SUBMIT FINAL ANSWER &rarr;';
      } else {
        qNextBtn.innerHTML = 'NEXT QUESTION &rarr;';
      }
    }

    // Render progress dots
    progressDots.innerHTML = currentQuestions.map((_, idx) => {
      let cls = 'dot';
      if (idx < questionIndex) cls += ' done';
      else if (idx === questionIndex) cls += ' active';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  function handleAnswerSubmit() {
    const val = qAnswerInput.value.trim();

    // Validate non-empty input
    if (!val) {
      if (qValidation) qValidation.style.display = 'block';
      if (qAnswerInput) {
        qAnswerInput.classList.add('error');
        qAnswerInput.focus();
      }
      return; // Do NOT advance
    }

    // Valid answer provided
    audioEngine.playClick();
    if (qValidation) qValidation.style.display = 'none';
    if (qAnswerInput) qAnswerInput.classList.remove('error');

    recordedAnswers.push(val);
    questionIndex++;
    renderQuestion();
  }

  qNextBtn.addEventListener('click', handleAnswerSubmit);

  qAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  });

  qAnswerInput.addEventListener('input', () => {
    if (qAnswerInput.value.trim().length > 0) {
      if (qValidation) qValidation.style.display = 'none';
      qAnswerInput.classList.remove('error');
    }
  });

  // 4. Main CTA Flip Button Handler
  flipBtn.addEventListener('click', () => {
    if (!coin3D || coin3D.isFlipping) return;

    audioEngine.playClick();

    // Disable button during flip
    flipBtn.disabled = true;
    btnText.textContent = "FLIPPING THE FATE...";

    // Context details
    let flipModeLabel = 'INSTANT TOSS';
    let detailContext = null;

    if (activeTab === 'assessment') {
      flipModeLabel = '5-QUESTION DIAGNOSTIC';
      if (currentQuestions.length > 0 && recordedAnswers.length > 0) {
        detailContext = `Q: "${currentQuestions[0]}" -> A: "${recordedAnswers[0]}"`;
      } else {
        detailContext = "Diagnostic calibration logged";
      }
    } else if (activeTab === 'decide') {
      flipModeLabel = 'DECIDE FOR ME';
      const optA = optionAInput.value.trim() || 'Option A';
      const optB = optionBInput.value.trim() || 'Option B';
      detailContext = `Evaluated: "${optA}" vs "${optB}"`;
    }

    // Trigger 3D Coin Flip
    coin3D.flip(() => {
      // Re-enable button
      flipBtn.disabled = false;
      btnText.textContent = "FLIP THE COIN";

      // Play victory/reveal chime
      audioEngine.playReveal();

      // Log to history tracker
      historyTracker.addRecord(flipModeLabel, detailContext);

      // Open Result Modal
      openResultModal(activeTab, detailContext);
    });
  });

  // 5. Open & Close Result Modal
  function openResultModal() {
    const errorUserAnswer = document.getElementById('error-user-answer');
    if (errorUserAnswer) {
      const userAns = (recordedAnswers && recordedAnswers.length > 0) ? recordedAnswers[recordedAnswers.length - 1] : 'sdfgh';
      errorUserAnswer.textContent = userAns;
    }

    resultModal.classList.remove('hidden');
  }

  closeResultBtn.addEventListener('click', () => {
    audioEngine.playClick();
    resultModal.classList.add('hidden');
    if (activeTab === 'assessment') {
      startAssessment(); // Reset questions for next flip
    }
  });

  // 6. History Drawer Handlers
  historyToggleBtn.addEventListener('click', () => {
    audioEngine.playClick();
    historyDrawer.classList.toggle('hidden');
  });

  closeHistoryBtn.addEventListener('click', () => {
    audioEngine.playClick();
    historyDrawer.classList.add('hidden');
  });

  // 7. Audio Toggle Handler
  audioToggleBtn.addEventListener('click', () => {
    const isEnabled = audioEngine.toggle();
    if (isEnabled) {
      soundIconOn.style.display = 'block';
      soundIconOff.style.display = 'none';
      audioEngine.playClick();
    } else {
      soundIconOn.style.display = 'none';
      audioEngine.playClick();
      soundIconOff.style.display = 'block';
    }
  });
});
