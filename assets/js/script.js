const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const menuButton = document.querySelector("#menuButton");
const mobilePanel = document.querySelector("#mobilePanel");
const themeButton = document.querySelector("#themeButton");
const commandButton = document.querySelector("#commandButton");
const commandPalette = document.querySelector("#commandPalette");
const commandInput = document.querySelector("#commandInput");
const commandList = document.querySelector("#commandList");
const toast = document.querySelector("#toast");

const labModes = {
  launch: {
    kicker: "Launch Pod",
    title: "From idea to production-ready product.",
    body: "UX planning, frontend build, backend APIs, deployment, and post-launch tuning for a crisp first release.",
    items: ["Clickable prototype and user flow", "Production web app or website", "Hosting, analytics, and handoff"],
  },
  scale: {
    kicker: "Scale Pod",
    title: "Make your systems faster, sturdier, and easier to extend.",
    body: "Architecture review, performance tuning, infrastructure cleanup, and codebase improvements for growing teams.",
    items: ["System audit and risk map", "Cloud and database optimization", "Monitoring and release workflows"],
  },
  automate: {
    kicker: "Automation Pod",
    title: "Turn repetitive operations into reliable workflows.",
    body: "We connect your tools, remove manual steps, and create simple dashboards for work that used to disappear in inboxes.",
    items: ["Workflow discovery", "API and no-code integrations", "Alerts, approvals, and reports"],
  },
  secure: {
    kicker: "Secure Pod",
    title: "Design networks and operations with trust built in.",
    body: "Connectivity, access control, backup planning, and operational guardrails for teams that need dependable systems.",
    items: ["Network topology planning", "Access and device policy", "Backup and recovery checklist"],
  },
};

const commands = [
  { label: "View services", detail: "Six delivery lines", target: "#services" },
  { label: "Open StackLab", detail: "Interactive pod selector", target: "#lab" },
  { label: "See process", detail: "Delivery stages", target: "#process" },
  { label: "Contact BananaStack", detail: "Start a project", target: "#contact" },
];

function setScrollState() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.dataset.elevated = scrollTop > 24 ? "true" : "false";
}

function toggleMenu(force) {
  const shouldOpen = typeof force === "boolean" ? force : !body.classList.contains("menu-open");
  body.classList.toggle("menu-open", shouldOpen);
  menuButton.setAttribute("aria-expanded", String(shouldOpen));
  mobilePanel.setAttribute("aria-hidden", String(!shouldOpen));
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("bananastack-theme", theme);
}

function togglePalette(force) {
  const shouldOpen = typeof force === "boolean" ? force : !body.classList.contains("palette-open");
  body.classList.toggle("palette-open", shouldOpen);
  commandPalette.setAttribute("aria-hidden", String(!shouldOpen));
  if (shouldOpen) {
    renderCommands("");
    window.setTimeout(() => commandInput.focus(), 20);
  }
}

function renderCommands(query) {
  const normalized = query.trim().toLowerCase();
  const filtered = commands.filter((command) => {
    return `${command.label} ${command.detail}`.toLowerCase().includes(normalized);
  });

  commandList.innerHTML = filtered
    .map(
      (command) => `
        <button class="command-item" type="button" data-target="${command.target}">
          <span>${command.label}</span>
          <small>${command.detail}</small>
        </button>
      `
    )
    .join("");
}

function goToTarget(target) {
  togglePalette(false);
  if (target.startsWith("http")) {
    window.open(target, "_blank", "noopener,noreferrer");
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateLab(mode) {
  const data = labModes[mode];
  document.querySelector("#labKicker").textContent = data.kicker;
  document.querySelector("#labTitle").textContent = data.title;
  document.querySelector("#labBody").textContent = data.body;
  document.querySelector("#labList").innerHTML = data.items.map((item) => `<li>${item}</li>`).join("");
}

function updateEstimate() {
  const size = Number(document.querySelector("#sizeRange").value);
  const automation = Number(document.querySelector("#autoRange").value);
  const infra = Number(document.querySelector("#infraRange").value);
  const score = size * 1.4 + automation * 1.1 + infra * 1.2;
  const weeks = score < 8 ? "3-5 weeks" : score < 13 ? "6-8 weeks" : "9-12 weeks";
  const text =
    score < 8
      ? "Focused launch with a lean website, light integrations, and clear handoff."
      : score < 13
        ? "Balanced build with app delivery, deployment setup, and automation planning."
        : "Full stack engagement with deeper automation, infrastructure work, and support planning.";
  document.querySelector("#estimateWeeks").textContent = weeks;
  document.querySelector("#estimateText").textContent = text;
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function wireTiltCards() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = ((y / rect.height) - 0.5) * -7;
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function wireMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function runCanvas() {
  const canvas = document.querySelector("#networkCanvas");
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let lastFrame = 0;

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = reducedMotion ? 18 : Math.min(48, Math.max(24, Math.floor(width / 28)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.8 + 0.8,
    }));
  }

  function drawLine(a, b, distance, maxDistance) {
    context.strokeStyle = `rgba(255, 213, 77, ${0.2 * (1 - distance / maxDistance)})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
  }

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    if (now - lastFrame < 33) return;
    lastFrame = now;

    context.clearRect(0, 0, width, height);
    const maxDistance = width < 700 ? 72 : 110;

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.fillStyle = "rgba(255, 213, 77, 0.72)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
        if (distance < maxDistance) drawLine(particle, next, distance, maxDistance);
      }

      if (pointer.active) {
        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        if (pointerDistance < 150) drawLine(particle, pointer, pointerDistance, 150);
      }
    });

  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resize();
  animate();
}

menuButton.addEventListener("click", () => toggleMenu());
mobilePanel.addEventListener("click", (event) => {
  if (event.target.matches("a")) toggleMenu(false);
});

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "light" ? "dark" : "light");
});

commandButton.addEventListener("click", () => togglePalette());
commandPalette.addEventListener("click", (event) => {
  if (event.target === commandPalette) togglePalette(false);
});
commandInput.addEventListener("input", () => renderCommands(commandInput.value));
commandList.addEventListener("click", (event) => {
  const item = event.target.closest(".command-item");
  if (item) goToTarget(item.dataset.target);
});

document.addEventListener("keydown", (event) => {
  const paletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (paletteShortcut) {
    event.preventDefault();
    togglePalette();
  }
  if (event.key === "Escape") {
    togglePalette(false);
    toggleMenu(false);
  }
});

document.querySelectorAll(".lab-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".lab-tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    updateLab(tab.dataset.mode);
  });
});

document.querySelectorAll(".estimator-panel input").forEach((input) => {
  input.addEventListener("input", updateEstimate);
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  toast.classList.add("show");
  event.currentTarget.reset();
  window.setTimeout(() => toast.classList.remove("show"), 3600);
});

window.addEventListener("scroll", setScrollState, { passive: true });

const savedTheme = localStorage.getItem("bananastack-theme");
if (savedTheme) setTheme(savedTheme);
setScrollState();
updateEstimate();
renderCommands("");
revealOnScroll();
wireTiltCards();
wireMagneticButtons();
runCanvas();
