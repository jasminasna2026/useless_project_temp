/* ==========================================================================
   TOSS THE UNSURE — Cinematic Opening Intro Controller
   ========================================================================== */

class IntroController {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.overlay = document.getElementById('intro-overlay');
    this.progressBar = document.getElementById('intro-bar');
    this.percentText = document.getElementById('intro-percent');
    this.statusText = document.getElementById('intro-status');
    this.skipBtn = document.getElementById('skip-intro-btn');
    this.videoEl = document.getElementById('intro-video');
    this.canvasEl = document.getElementById('intro-canvas');

    this.progress = 0;
    this.interval = null;
    this.isCompleted = false;

    this.statusMessages = [
      "INITIALIZING QUANTUM UNCERTAINTY CORE...",
      "CALIBRATING DUAL 'UNSURE' METALLIC FACES...",
      "SYNCING THREE.JS WEBGL RENDER ENGINE...",
      "ESTABLISHING ZERO RESOLUTION PARAMETERS...",
      "VERIFYING AMBIVALENCE PROTOCOLS...",
      "SYSTEM READY FOR FLIP AUTHORIZATION."
    ];
  }

  init() {
    this.setupCanvas();

    // Check if video exists and can play
    let videoPlaying = false;
    if (this.videoEl) {
      this.videoEl.addEventListener('error', () => {
        this.videoEl.style.display = 'none';
      });
      const playPromise = this.videoEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.videoEl.style.display = 'block';
          videoPlaying = true;
        }).catch(() => {
          this.videoEl.style.display = 'none';
        });
      }
    }

    // Skip button binding
    this.skipBtn.addEventListener('click', () => {
      audioEngine.playClick();
      this.complete();
    });

    // Simulate progress animation over ~2.8 seconds
    const duration = 2800;
    const stepTime = 50;
    const increment = 100 / (duration / stepTime);

    this.interval = setInterval(() => {
      this.progress += increment + (Math.random() * 2 - 1);
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.interval);
        setTimeout(() => this.complete(), 300);
      }

      // Update UI
      const currentPct = Math.min(100, Math.floor(this.progress));
      this.progressBar.style.width = `${currentPct}%`;
      this.percentText.textContent = `${currentPct}%`;

      const msgIndex = Math.min(
        this.statusMessages.length - 1,
        Math.floor((currentPct / 100) * this.statusMessages.length)
      );
      this.statusText.textContent = this.statusMessages[msgIndex];
    }, stepTime);
  }

  setupCanvas() {
    if (!this.canvasEl) return;
    const ctx = this.canvasEl.getContext('2d');
    let width = (this.canvasEl.width = window.innerWidth);
    let height = (this.canvasEl.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = this.canvasEl.width = window.innerWidth;
      height = this.canvasEl.height = window.innerHeight;
    });

    // Animated cybernetic grid & floating dust
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      if (this.isCompleted) return;
      ctx.fillStyle = '#030408';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(216, 190, 132, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & draw particles
      particles.forEach(p => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = height;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    render();
  }

  complete() {
    if (this.isCompleted) return;
    this.isCompleted = true;
    if (this.interval) clearInterval(this.interval);

    this.overlay.classList.add('fade-out');
    document.body.classList.remove('loading');

    setTimeout(() => {
      this.overlay.style.display = 'none';
      if (this.onComplete) this.onComplete();
    }, 800);
  }
}
