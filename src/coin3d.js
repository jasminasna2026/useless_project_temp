/* ==========================================================================
   TOSS THE UNSURE — Three.js 3D Ambivalent Coin Engine
   ========================================================================== */

class Coin3DEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coinGroup = null;
    this.coinMesh = null;
    this.particlesGroup = null;

    this.isFlipping = false;
    this.mouseX = 0;
    this.mouseY = 0;

    this.onFlipComplete = null;
  }

  init() {
    if (!this.container) return;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070c, 0.035);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 11);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting setup
    this.setupLights();

    // 5. Create Background Particles
    this.createBackgroundParticles();

    // 6. Create 3D Coin Mesh
    this.createCoin();

    // 7. Event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 8. Start render loop
    this.animate();
  }

  setupLights() {
    // Key directional light (gold tint)
    const dirLight = new THREE.DirectionalLight(0xffe8ba, 2.2);
    dirLight.position.set(5, 8, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x1a233a, 1.2);
    this.scene.add(ambientLight);

    // Cyan rim point light
    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 15);
    cyanLight.position.set(-6, -2, 4);
    this.scene.add(cyanLight);

    // Gold rim point light
    const goldLight = new THREE.PointLight(0xd8be84, 2.5, 15);
    goldLight.position.set(6, -3, 3);
    this.scene.add(goldLight);
  }

  // Create high-res canvas texture for "UNSURE" coin faces
  generateFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Background radial metallic gradient
    const gradient = ctx.createRadialGradient(512, 512, 50, 512, 512, 500);
    gradient.addColorStop(0, '#f5e4b8');
    gradient.addColorStop(0.5, '#d8be84');
    gradient.addColorStop(0.85, '#997433');
    gradient.addColorStop(1, '#57411b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Outer reeded border ring
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#423112';
    ctx.beginPath();
    ctx.arc(512, 512, 480, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#fcedc7';
    ctx.beginPath();
    ctx.arc(512, 512, 465, 0, Math.PI * 2);
    ctx.stroke();

    // Inner decorative dash ring
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6e5424';
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.arc(512, 512, 430, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Institute Header Text
    ctx.font = 'bold 34px Cinzel, Georgia, serif';
    ctx.fillStyle = '#423112';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GLOBAL INSTITUTE FOR COIN FLIP VERIFICATION', 512, 220);

    // Core Text: "UNSURE"
    ctx.font = '900 130px Cinzel, Georgia, serif';
    ctx.letterSpacing = '12px';
    
    // Shadow / Emboss effect
    ctx.fillStyle = '#ffffff';
    ctx.fillText('UNSURE', 514, 514);

    ctx.fillStyle = '#302209';
    ctx.fillText('UNSURE', 510, 510);

    ctx.fillStyle = '#5c451b';
    ctx.fillText('UNSURE', 512, 512);

    // Bottom Subtext
    ctx.font = 'bold 28px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#423112';
    ctx.fillText('AMBIVALENCE CERTIFIED • 0.00%', 512, 800);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }

  createCoin() {
    this.coinGroup = new THREE.Group();
    this.scene.add(this.coinGroup);

    // Generate texture for BOTH sides
    const faceTexture = this.generateFaceTexture();

    // Side rim material (reeded metallic pattern)
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xcbb074,
      metalness: 0.9,
      roughness: 0.25,
    });

    // Face material (top & bottom)
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: faceTexture,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Cylinder materials: [side, top, bottom]
    const materials = [sideMaterial, faceMaterial, faceMaterial];

    // Cylinder geometry: radiusTop=2.2, radiusBottom=2.2, height=0.36, radialSegments=64
    const geometry = new THREE.CylinderGeometry(2.2, 2.2, 0.36, 64);
    
    this.coinMesh = new THREE.Mesh(geometry, materials);
    this.coinMesh.castShadow = true;
    this.coinMesh.receiveShadow = true;

    // Initial position & slight tilt
    this.coinGroup.add(this.coinMesh);
    this.coinGroup.position.set(0, 0, 0);

    // Default resting rotation (face visible or slight angle)
    this.coinMesh.rotation.x = Math.PI * 0.15;
    this.coinMesh.rotation.y = Math.PI * 0.1;
  }

  createBackgroundParticles() {
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);

    const geometry = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    this.particlesGroup.add(particles);
  }

  onMouseMove(e) {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // PARABOLIC 3D FLIP ENGINE (Lands vertically on edge!)
  flip(onComplete) {
    if (this.isFlipping) return;
    this.isFlipping = true;
    this.onFlipComplete = onComplete;

    audioEngine.playFlip();

    const startTime = performance.now();
    const duration = 2400; // 2.4 seconds flip

    const startY = 0;
    const peakY = 5.2; // High upward launch

    // Initial rotations
    const startRotX = this.coinMesh.rotation.x;
    const startRotY = this.coinMesh.rotation.y;
    const startRotZ = this.coinMesh.rotation.z;

    // We want the coin to end up EXACTLY standing vertically on its edge!
    // For a cylinder standing on edge, rotation around Z (or X) = Math.PI / 2 (90 degrees).
    const targetRotX = Math.PI * 0.5; // 90 degrees vertical edge standing
    const targetRotY = Math.PI * 12;  // 6 full 360-degree spins
    const targetRotZ = Math.PI * 8;   // 4 full rolls

    const animateFlip = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Easing functions
      const easeOutQuad = (t) => t * (2 - t);
      const easeInQuad = (t) => t * t;

      // Parabolic arc for height (Y position)
      if (progress < 0.5) {
        // Launch phase
        const p = progress / 0.5;
        this.coinMesh.position.y = startY + peakY * easeOutQuad(p);
      } else {
        // Drop phase
        const p = (progress - 0.5) / 0.5;
        this.coinMesh.position.y = peakY * (1 - easeInQuad(p));
      }

      // Smooth tumble rotations
      this.coinMesh.rotation.x = startRotX + (targetRotX - startRotX) * progress;
      this.coinMesh.rotation.y = startRotY + (targetRotY - startRotY) * progress;
      this.coinMesh.rotation.z = startRotZ + (targetRotZ - startRotZ) * progress;

      // Camera dynamic subtle zoom
      this.camera.position.z = 11 - Math.sin(progress * Math.PI) * 2;

      if (progress < 1) {
        requestAnimationFrame(animateFlip);
      } else {
        // Impact landing on edge!
        this.coinMesh.position.y = 0;
        this.coinMesh.rotation.x = targetRotX;
        this.coinMesh.rotation.y = 0;
        this.coinMesh.rotation.z = 0;

        audioEngine.playLanding();

        // Perform subtle landing micro-wobble damping
        this.animateMicroWobble(() => {
          this.isFlipping = false;
          if (this.onFlipComplete) this.onFlipComplete();
        });
      }
    };

    requestAnimationFrame(animateFlip);
  }

  // Micro-wobble when landing vertically on edge to demonstrate realistic balance physics
  animateMicroWobble(onFinish) {
    const startTime = performance.now();
    const duration = 600;

    const wobble = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      const decay = Math.exp(-p * 5); // Exponential damping
      const frequency = 25;

      this.coinMesh.rotation.z = Math.sin(p * frequency) * 0.18 * decay;
      this.coinMesh.rotation.y = Math.cos(p * frequency) * 0.12 * decay;

      if (p < 1) {
        requestAnimationFrame(wobble);
      } else {
        this.coinMesh.rotation.z = 0;
        this.coinMesh.rotation.y = 0;
        if (onFinish) onFinish();
      }
    };

    requestAnimationFrame(wobble);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Subtle idle floating & mouse parallax when not flipping
    if (!this.isFlipping && this.coinGroup) {
      const time = performance.now() * 0.001;
      
      // Floating oscillation
      this.coinGroup.position.y = Math.sin(time * 1.5) * 0.15;

      // Mouse tilt parallax interpolation
      this.coinGroup.rotation.y += (this.mouseX * 0.3 - this.coinGroup.rotation.y) * 0.05;
      this.coinGroup.rotation.x += (-this.mouseY * 0.2 - this.coinGroup.rotation.x) * 0.05;

      // Background particles rotate
      if (this.particlesGroup) {
        this.particlesGroup.rotation.y = time * 0.02;
        this.particlesGroup.rotation.x = time * 0.01;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
