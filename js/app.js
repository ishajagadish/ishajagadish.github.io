const githubUsername = "ishajagadish";

const fallbackProjects = [
  {
    name: "smart-financial-parser",
    description:
      "Normalizes messy financial transaction datasets into clean, readable reports.",
    language: "Python",
    stars: 0,
    url: "https://github.com/ishajagadish/smart-financial-parser"
  },
  {
    name: "synopsys2021",
    description:
      "3-step neural network pipeline for Parkinson's progression prediction.",
    language: "Jupyter Notebook",
    stars: 0,
    url: "https://github.com/ishajagadish/synopsys2021"
  },
  {
    name: "inrix-hackathon",
    description:
      "Neural network for road congestion prediction using SegmentSpeed API data.",
    language: "Python",
    stars: 0,
    url: "https://github.com/ishajagadish/inrix-hackathon"
  },
  {
    name: "flights-app",
    description:
      "CLI airline reservation system in Java + PostgreSQL with transaction safety.",
    language: "Java",
    stars: 0,
    url: "https://github.com/ishajagadish/flights-app"
  },
  {
    name: "ciphers-project",
    description:
      "Object-oriented Java cipher suite with substitution and multi-cipher flows.",
    language: "Java",
    stars: 0,
    url: "https://github.com/ishajagadish/ciphers-project"
  },
  {
    name: "wordjumble",
    description: "Interactive word jumble game for casual play and language practice.",
    language: "JavaScript",
    stars: 0,
    url: "https://github.com/ishajagadish/wordjumble"
  }
];

function truncate(text, max = 110) {
  if (!text) {
    return "No description yet.";
  }
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = projects
    .slice(0, 6)
    .map(
      (project) => `
      <article class="project-card tilt-card" data-tilt>
        <h3>${project.name}</h3>
        <p>${truncate(project.description)}</p>
        <div class="meta">
          <span>${project.language || "Code"}</span>
          <span>★ ${project.stars ?? 0}</span>
        </div>
        <a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">Open project</a>
      </article>
    `
    )
    .join("");

  attachTilt();
}

async function loadGitHub() {
  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`),
      fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
    ]);

    if (!userRes.ok || !repoRes.ok) {
      throw new Error("GitHub fetch failed");
    }

    const user = await userRes.json();
    const repos = await repoRes.json();

    const clean = repos
      .filter((repo) => !repo.fork && repo.name !== `${githubUsername}.github.io`)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url
      }));

    document.getElementById("statRepos").textContent = String(user.public_repos ?? 0);
    document.getElementById("statFollowers").textContent = String(user.followers ?? 0);

    renderProjects(clean.length ? clean : fallbackProjects);
  } catch (error) {
    renderProjects(fallbackProjects);
  }
}

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
    "Shipping, learning, iterating.",
    "Designing with playful precision.",
    "Focused on ML + product impact."
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % lines.length;
    node.textContent = lines[i];
  }, 2800);
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
loadGitHub();
