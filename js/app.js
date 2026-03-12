import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  tick();
  setInterval(tick, 1000);
}

function initHero3D() {
  const canvas = document.getElementById("heroCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4.7);

  const keyLight = new THREE.DirectionalLight(0xff9ad4, 1.6);
  keyLight.position.set(2.4, 2.6, 3.8);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffd6ec, 1.05);
  fillLight.position.set(-2.8, -1.2, 1.3);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.42));

  const group = new THREE.Group();
  scene.add(group);

  const coreGeometry = new THREE.IcosahedronGeometry(1.04, 1);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff8fcd,
    metalness: 0.15,
    roughness: 0.24,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.95
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  const edgeGeometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.38, 1));
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xde3fa2, transparent: true, opacity: 0.56 });
  const shell = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  group.add(shell);

  const ringMaterialA = new THREE.MeshBasicMaterial({ color: 0xff6bbd, transparent: true, opacity: 0.62 });
  const ringMaterialB = new THREE.MeshBasicMaterial({ color: 0xffb7df, transparent: true, opacity: 0.72 });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.03, 24, 180), ringMaterialA);
  ringA.rotation.set(Math.PI / 2.7, 0.2, 0.5);
  group.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.027, 18, 160), ringMaterialB);
  ringB.rotation.set(0.55, 0.34, 0.18);
  group.add(ringB);

  const particleCount = 650;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const radius = THREE.MathUtils.randFloat(2.4, 7.0);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xff98d4,
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false
    })
  );
  scene.add(particles);

  let targetX = 0;
  let targetY = 0;

  window.addEventListener("pointermove", (event) => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    targetX = nx * 0.7;
    targetY = -ny * 0.35;
  });

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener("resize", resize);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clock = new THREE.Clock();
  const renderLoop = () => {
    const elapsed = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;
      core.rotation.y = elapsed * 0.45;
      core.rotation.x = elapsed * 0.2;
      shell.rotation.y = -elapsed * 0.26;
      shell.rotation.x = elapsed * 0.14;
      ringA.rotation.z += 0.004;
      ringB.rotation.x += 0.003;
      particles.rotation.y = elapsed * 0.032;
      particles.rotation.x = Math.sin(elapsed * 0.22) * 0.05;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  };

  renderLoop();
}

function initStarsBackground() {
  const canvas = document.getElementById("starsCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const stars = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.length = 0;
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);

    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.2,
        v: Math.random() * 0.15 + 0.04,
        a: Math.random() * 0.5 + 0.2
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
      star.y += star.v;
      if (star.y > window.innerHeight + 2) {
        star.y = -2;
        star.x = Math.random() * window.innerWidth;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(232, 113, 183, ${star.a})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function attachTilt() {
  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    if (card.dataset.tiltBound === "true") return;
    card.dataset.tiltBound = "true";

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

startClock();
initStarsBackground();
initHero3D();
attachTilt();
setYear();
