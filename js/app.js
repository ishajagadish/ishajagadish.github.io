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
    const count = Math.floor((window.innerWidth * window.innerHeight) / 11000);

    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.2,
        v: Math.random() * 0.14 + 0.02,
        a: Math.random() * 0.46 + 0.2
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
      ctx.fillStyle = `rgba(220, 94, 165, ${star.a})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initClock() {
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

function initRotator() {
  const node = document.getElementById("rotator");
  if (!node) return;

  const lines = [
    "Building. Learning. Shipping.",
    "AI agents + full-stack systems.",
    "Research informed. Product minded."
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % lines.length;
    node.textContent = lines[idx];
  }, 2600);
}

function initFocusChipShuffle() {
  const grid = document.getElementById("focusChips");
  if (!grid) return;

  setInterval(() => {
    const chips = Array.from(grid.children);
    if (chips.length < 2) return;

    const first = chips[0];
    grid.appendChild(first);
  }, 2400);
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

function initHeroParallax() {
  const scene = document.getElementById("orbitScene");
  if (!scene) return;

  const layers = scene.querySelectorAll(".orbit-layer, .photo-shell, .float-card");

  const reset = () => {
    layers.forEach((layer) => {
      layer.style.transform = "";
    });
  };

  scene.addEventListener("mousemove", (event) => {
    const rect = scene.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((layer, idx) => {
      const depth = (idx + 1) * 4;
      const x = px * depth;
      const y = py * depth;
      if (layer.classList.contains("photo-shell")) {
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${-px * 10}deg) rotateX(${py * 8}deg)`;
      } else {
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    });
  });

  scene.addEventListener("mouseleave", reset);
}

function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  window.addEventListener(
    "mousemove",
    (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

function initSignalBars() {
  const bars = Array.from(document.querySelectorAll("#signalBars span"));
  if (!bars.length) return;

  const randomize = () => {
    bars.forEach((bar) => {
      const level = Math.floor(Math.random() * 50) + 35;
      bar.style.setProperty("--level", `${level}%`);
    });
  };

  setInterval(randomize, 900);
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

initStarsBackground();
initScrollProgress();
initClock();
initRotator();
initFocusChipShuffle();
attachTilt();
initHeroParallax();
initCursorGlow();
initSignalBars();
initReveal();
setYear();
