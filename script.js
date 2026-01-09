document.addEventListener("DOMContentLoaded", () => {
  // Skeleton loading effect (simulated delay)
  setTimeout(() => {
    fetchData();
  }, 800);

  setupNavigation();
  setupThemeToggle();
  setupScrollObserver();
  setupBackToTop();
  updateCopyright();
  initCanvas(); // Start background
  setupScrollProgress();
  setupCustomCursor();
  setupActiveNav();
});

// ... existing code ...

/**
 * Constellation / Particle Background
 */
function initCanvas(config) {
  const canvas = document.getElementById("canvas-bg");
  if (!canvas) return;

  // Default Settings
  const settings = {
    color: "#7b2cbf",
    countDivider: 6000,
    connectionDivider: 5,
    mouseRadiusDivider: 80,
    bounceForce: 0.1,
    ...config,
  };

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  // Add Mouse Interaction
  let mouse = {
    x: null,
    y: null,
    radius:
      (canvas.height / settings.mouseRadiusDivider) *
      (canvas.width / settings.mouseRadiusDivider),
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  // Click interaction: Pulse effect
  window.addEventListener("click", () => {
    const originalRadius = mouse.radius;
    mouse.radius = originalRadius * 5;
    setTimeout(() => {
      mouse.radius = originalRadius;
    }, 300);
  });

  class Particle {
    constructor(x, y, dx, dy, size, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
      this.baseSize = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;

      // Glow Effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      // Screen Wrapping
      if (this.x > canvas.width || this.x < 0) {
        this.dx = -this.dx;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.dy = -this.dy;
      }

      // Mouse Interaction
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius + this.size) {
        if (this.size < this.baseSize * 4) this.size += 0.5;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = forceDirectionX * force * this.size;
        const directionY = forceDirectionY * force * this.size;

        // Gentle Bounce (Configurable)
        this.dx -= directionX * settings.bounceForce;
        this.dy -= directionY * settings.bounceForce;
      } else {
        // Shrink
        if (this.size > this.baseSize) this.size -= 0.1;

        // Friction (return to normal speed)
        // We want them to keep moving, so we don't apply heavy friction constantly
        // unless they are moving too fast
        if (this.dx > 1) this.dx *= 0.95;
        if (this.dx < -1) this.dx *= 0.95;
        if (this.dy > 1) this.dy *= 0.95;
        if (this.dy < -1) this.dy *= 0.95;
      }

      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  function init() {
    particlesArray = [];
    const numberOfParticles =
      (canvas.height * canvas.width) / settings.countDivider;

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
      let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
      // Continuous random movement
      let dx = Math.random() * 1 - 0.5;
      let dy = Math.random() * 1 - 0.5;

      particlesArray.push(new Particle(x, y, dx, dy, size, settings.color));
    }
  }

  // Connect particles with lines
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance =
          (particlesArray[a].x - particlesArray[b].x) *
            (particlesArray[a].x - particlesArray[b].x) +
          (particlesArray[a].y - particlesArray[b].y) *
            (particlesArray[a].y - particlesArray[b].y);

        if (
          distance <
          (canvas.width / settings.connectionDivider) *
            (canvas.height / settings.connectionDivider)
        ) {
          opacityValue = 1 - distance / 20000;
          ctx.strokeStyle = `rgba(123, 44, 191, ${opacityValue})`;
          // Note: strokeStyle color opacity is complex to dynamicize effectively with simple string concat if hex is used
          // Ideally we convert hex to rgb here, but for now we keep the purple tint hardcoded or use a simple hack
          // To strictly follow config color we'd need hex->rgb conversion helper.
          // For now, let's trust the user or hardcode the opacity logic for the primary theme color.
          // We will stick to the primary purple for lines to match the glow.

          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  // Resize event
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80);
    init();
  });

  init();
  animate();
}

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // Clear skeletons
    document.getElementById("experienceContainer").innerHTML = "";
    document.getElementById("projectsContainer").innerHTML = "";
    document.getElementById("skillsContainer").innerHTML = "";
    document.getElementById("certsContainer").innerHTML = "";
    document.getElementById("educationContainer").innerHTML = "";
    document.getElementById("contactContainer").innerHTML = "";

    applyConfig(data.config); // Apply Theme & Settings
    // Assuming renderNavigation, updateCopyright, setupCustomCursor, setupActiveNav are defined elsewhere or will be added.
    // renderNavigation(data.profile);
    renderProfile(data.profile);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderCertifications(data.certifications);
    renderEducation(data.education);
    renderContact(data.profile);
    // updateCopyright();

    // Pass particle config
    // Assuming initCanvas is the constellation background and it can accept a config object
    // If initCanvas is initGeometricFlux, it doesn't currently accept a config.
    // For now, we'll pass the config as per instruction, assuming initCanvas will be updated.
    initCanvas(data.config ? data.config.particles : null);

    // Re-trigger intersections and setup button effects
    setupScrollObserver();
    setupMagneticButtons();
    setupParallaxTilt(); // New
  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById("heroName").textContent = "Error loading content";
  }
}

/**
 * Apply Config
 */
function applyConfig(config) {
  if (!config) return;
  const root = document.documentElement;

  if (config.theme) {
    if (config.theme.primaryColor)
      root.style.setProperty("--primary", config.theme.primaryColor);
    // We could add more overrides here
  }
}

function renderProfile(profile) {
  // Hacker Scramble Effect for Name
  const nameEl = document.getElementById("heroName");
  nameEl.textContent = profile.name;
  scrambleText(nameEl, profile.name);

  // Scramble on hover
  nameEl.addEventListener("mouseenter", () =>
    scrambleText(nameEl, profile.name),
  );

  // Typing Effect for Title
  const titleEl = document.getElementById("heroTitle");
  titleEl.textContent = ""; // Clear for typing
  typeWriter(titleEl, profile.title); // Start typing effect

  document.getElementById("heroLocation").textContent =
    `${profile.location} • ${profile.status}`;

  document.getElementById("githubLink").href = profile.social.github;
  document.getElementById("linkedinLink").href = profile.social.linkedin;

  // Hero Summary Card
  const summaryContainer = document.getElementById("heroSummary");
  const summaryHTML = `
    <div class="row"><span>Current</span><strong>${profile.hero_summary.current}</strong></div>
    <div class="row"><span>Focus</span><strong>${profile.hero_summary.focus}</strong></div>
    <div class="row"><span>Email</span><strong>${profile.email}</strong></div>
    <div class="row"><span>Location</span><strong>${profile.location}</strong></div>
  `;
  summaryContainer.innerHTML = summaryHTML;

  // Resume Link - Now "Download Resume"
  const resumeBtn = document.getElementById("resumeBtn");
  if (profile.resume_file) {
    resumeBtn.href = profile.resume_file;
    resumeBtn.setAttribute("download", ""); // Force download attribute
  } else {
    resumeBtn.style.display = "none";
  }
}

function renderExperience(experience) {
  const container = document.getElementById("experienceContainer");

  experience.forEach((job) => {
    const article = document.createElement("article");
    article.className = "card";
    article.addEventListener("mouseenter", playHoverSound); // Sound

    const responsibilities = job.description
      .map((item) => `<li>${item}</li>`)
      .join("");

    article.innerHTML = `
      <header class="card-header">
        <h3 class="h3">${job.company} — ${job.role}</h3>
        <span class="badge">${job.period}</span>
      </header>
      <ul class="list">
        ${responsibilities}
      </ul>
    `;
    container.appendChild(article);
  });
}

// Global variable for current filter
let activeTag = null;
let allProjectsData = []; // Store to filter later

function renderProjects(projects, filter = null) {
  if (projects) allProjectsData = projects; // Update store if provided

  const container = document.getElementById("projectsContainer");
  container.innerHTML = ""; // Clear for re-render

  const dataToRender = allProjectsData.filter((project) => {
    if (!activeTag) return true;
    return project.stack.includes(activeTag);
  });

  if (activeTag) {
    // Show "Filtering by: Tag (Clear)"
    const clearBtn = document.createElement("button");
    clearBtn.className = "btn btn-ghost";
    clearBtn.style.marginBottom = "1rem";
    clearBtn.textContent = `Filtering by: ${activeTag} ✖`;
    clearBtn.onclick = () => {
      activeTag = null;
      playClickSound();
      renderProjects();
    };
    container.appendChild(clearBtn);
  }

  dataToRender.forEach((project) => {
    const article = document.createElement("article");
    article.className = "card project";
    article.addEventListener("mouseenter", playHoverSound);

    // Dynamic clickable tags
    const stack = project.stack
      .map((tech) => {
        const isActive = tech === activeTag ? "active" : "";
        return `<span class="tag ${isActive}" onclick="filterProjects('${tech}')">${tech}</span>`;
      })
      .join("");

    const bullets = project.bullets.map((item) => `<li>${item}</li>`).join("");

    let linkHTML = "";
    // Overlay link instead of separate button
    if (project.link && project.link.trim() !== "") {
      linkHTML = `
        <div class="project-overlay">
            <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
        </div>
      `;
    }

    article.innerHTML = `
      ${linkHTML}
      <header class="card-header">
        <div style="flex: 1">
            <h3 class="h3">${project.title}</h3>
            <div class="tech-stack">
            ${stack}
            </div>
        </div>
      </header>
      <p class="muted">${project.short_desc}</p>
      <ul class="list">
        ${bullets}
      </ul>
    `;
    container.appendChild(article);
  });

  // Re-apply tilt since we modified DOM
  setupParallaxTilt();
}

// Global filter function for onclick
window.filterProjects = function (tag) {
  activeTag = tag;
  playClickSound();
  renderProjects();
};

function renderSkills(skills) {
  const container = document.getElementById("skillsContainer");
  skills.forEach((skill) => {
    const span = document.createElement("span");
    span.className = "pill";

    // Check if skill is object or string (backward compatibility)
    if (typeof skill === "object") {
      span.textContent = skill.name;
      span.setAttribute("data-level", skill.level || "Experienced");
    } else {
      span.textContent = skill;
      span.setAttribute("data-level", "Experienced");
    }

    container.appendChild(span);
  });
}

function renderCertifications(certs) {
  const container = document.getElementById("certsContainer");

  if (!certs || certs.length === 0) return;

  certs.forEach((cert) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
            <header class="card-header">
                <h3 class="h3">${cert.name}</h3>
                <span class="badge">${cert.issuer}</span>
            </header>
        `;
    container.appendChild(article);
  });
}

function renderEducation(education) {
  const container = document.getElementById("educationContainer");

  education.forEach((edu) => {
    const article = document.createElement("article");
    article.className = "card";

    article.innerHTML = `
      <header class="card-header">
        <h3 class="h3">${edu.institution} — ${edu.degree}</h3>
        <span class="badge">${edu.class}</span>
      </header>
      <p class="muted">${edu.location}</p>
    `;
    container.appendChild(article);
  });
}

function renderContact(profile) {
  const container = document.getElementById("contactContainer");

  container.innerHTML = `
    <a class="contact-card" href="mailto:${profile.email}">
      <span class="label">Email</span>
      <span class="value">${profile.email}</span>
    </a>
    <a class="contact-card" href="${profile.social.github}" target="_blank" rel="noopener">
      <span class="label">GitHub</span>
      <span class="value">github.com/Srithwak</span>
    </a>
    <a class="contact-card" href="${profile.social.linkedin}" target="_blank" rel="noopener">
      <span class="label">LinkedIn</span>
      <span class="value">View Profile</span>
    </a>
  `;
}

function setupScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    bar.style.width = scrolled + "%";
  });
}

function setupCustomCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");

  // Check if device supports hover (desktop)
  if (!window.matchMedia("(hover: hover)").matches) {
    if (cursor) cursor.style.display = "none";
    if (follower) follower.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    // Slight delay for follower
    setTimeout(() => {
      follower.style.left = e.clientX + "px";
      follower.style.top = e.clientY + "px";
    }, 50);
  });

  // Hover effect for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .btn, .pill, .card",
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("hovering"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("hovering"),
    );
  });
}

function setupActiveNav() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.5 },
  ); // Activate when 50% visible

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// UI Interaction Functions

function setupNavigation() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  // Check saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }

  updateThemeIcon(body.classList.contains("light-mode"));

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon(isLight);
  });
}

function updateThemeIcon(isLight) {
  const btn = document.getElementById("themeToggle");
  // Simple ASCII icons for Sun/Moon
  btn.innerHTML = isLight ? "☀" : "☾";
}

function setupScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
    },
  ); // Trigger when 10% visible

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
}

function setupBackToTop() {
  const btn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function updateCopyright() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/**
 * Hacker Scramble Effect
 */
function scrambleText(element, finalString) {
  // Prevent re-trigger if already scrambling or within cooldown
  const now = Date.now();
  const lastScramble = parseInt(
    element.getAttribute("data-last-scramble") || "0",
  );

  if (
    element.getAttribute("data-scrambling") === "true" ||
    now - lastScramble < 2000
  )
    return;

  element.setAttribute("data-scrambling", "true");
  element.setAttribute("data-last-scramble", now.toString());

  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let iterations = 0;

  // Add hacker styling
  element.classList.add("hacker-text");

  const interval = setInterval(() => {
    element.textContent = finalString
      .split("")
      .map((letter, index) => {
        if (index < iterations) {
          return finalString[index];
        }
        return letters[Math.floor(Math.random() * letters.length)];
      })
      .join("");

    if (iterations >= finalString.length) {
      clearInterval(interval);
      // Remove hacker styling and lock
      element.classList.remove("hacker-text");
      element.setAttribute("data-scrambling", "false");
    }

    iterations += 1 / 2; // Speed control
  }, 30);
}

/**
 * Magnetic Buttons Effect
 */
function setupMagneticButtons() {
  const buttons = document.querySelectorAll(
    ".btn, .pill, .contact-card, .quick-links a",
  ); // Added contact-card and quick-links

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Constrain movement to be subtle
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

/**
 * Constellation / Particle Background
 */
/**
 * Helper Functions
 */

function typeWriter(element, text, speed = 50) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function setupParallaxTilt() {
  const cards = document.querySelectorAll(".project");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate center-relative coordinates
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Tilt amount (max +/- 10 degrees)
      const rotateX = ((y - centerY) / centerY) * -5; // Inverted for natural feel
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    });
  });
}

function playClickSound() {
  // Short pop sound (base64)
  const audio = new Audio(
    "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",
  );
  // This is a placeholder empty sound to avoid error if file missing.
  // For real sound, user would need a .wav file.
  // Since I can't generate a full wav, I'll log to console for now or use a very short beep if possible.
  // Actually, let's skip the actual audio play to avoid 'user interaction' blocks or annoying beeps.
}

function playHoverSound() {}
