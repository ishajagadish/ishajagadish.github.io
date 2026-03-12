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

function rotateNowText() {
  const node = document.getElementById("rotator");
  if (!node) return;

  const lines = [
    "AI agents, product thinking, fast execution.",
    "Research, teaching, and building in parallel.",
    "Focused on impact at startup and global scale."
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % lines.length;
    node.textContent = lines[i];
  }, 3000);
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

      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

attachTilt();
startClock();
rotateNowText();
setYear();
