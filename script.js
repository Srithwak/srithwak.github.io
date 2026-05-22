/* =============================================
   RITHWAK SOMEPALLI — PORTFOLIO ENGINE
   =============================================
   Fetches data from /data/ folder and populates
   the DOM dynamically. All content is editable
   via external JSON and TXT files.
   ============================================= */

(function () {
  'use strict';

  const BASE = './data/';

  // ── Utility: Fetch JSON ──
  async function fetchJSON(path) {
    const res = await fetch(`${BASE}${path}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  }

  // ── Utility: Fetch Text ──
  async function fetchText(path) {
    const res = await fetch(`${BASE}${path}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.text();
  }

  // ── Utility: Safe Query ──
  function $(selector) {
    return document.querySelector(selector);
  }

  // ── Apply Colors from Config ──
  function applyColors(colors, theme) {
    const activeColors = colors[theme] || colors.dark || colors;
    const root = document.documentElement.style;
    root.setProperty('--primary', activeColors.primary);
    root.setProperty('--primary-dark', activeColors.primaryDark);
    root.setProperty('--neutral', activeColors.neutral);
    root.setProperty('--surface', activeColors.surface);
    if (activeColors.background) root.setProperty('--bg', activeColors.background);
    if (activeColors.backgroundAlt) root.setProperty('--bg-alt', activeColors.backgroundAlt);
    if (activeColors.textPrimary) root.setProperty('--text-primary', activeColors.textPrimary);
    if (activeColors.textSecondary) root.setProperty('--text-secondary', activeColors.textSecondary);
    if (activeColors.cardBg) root.setProperty('--card-bg', activeColors.cardBg);
    if (activeColors.cardBorder) root.setProperty('--card-border', activeColors.cardBorder);
    if (activeColors.glassBg) root.setProperty('--glass-bg', activeColors.glassBg);
    if (activeColors.glassBorder) root.setProperty('--glass-border', activeColors.glassBorder);
  }

  // ── Populate Hero / Intro ──
  function populateHero(introData, config) {
    // Line 1: greeting (e.g., "Hi, Rithwak here and I'm a...")
    const greetingEl = $('#hero-greeting');
    if (greetingEl && introData.greeting) {
      // Highlight the name
      const fullName = config.meta.name; // "Rithwak Somepalli"
      const firstName = fullName.split(' ')[0]; // "Rithwak"
      greetingEl.innerHTML = introData.greeting.replace(
        firstName,
        `<span class="name-highlight">${firstName}</span>`
      );
    }

    // Line 2: main headline
    const headlineEl = $('#hero-headline');
    if (headlineEl && introData.headline) {
      // Make key words accent-colored for visual punch
      // Find the first clause and style keywords
      headlineEl.innerHTML = styleHeadline(introData.headline);
    }

    // Line 3: tagline
    const taglineEl = $('#hero-tagline');
    if (taglineEl && introData.tagline) {
      taglineEl.textContent = introData.tagline;
    }
  }

  function styleHeadline(text) {
    // Bold the role-like phrases, dim the connector words
    const connectors = ['that', 'with', 'and', 'from', 'to', 'the', 'in', 'for'];
    const words = text.split(' ');
    return words.map(word => {
      const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (connectors.includes(clean)) {
        return `<span class="dim">${word}</span>`;
      }
      return word;
    }).join(' ');
  }



  // ── Populate Experience ──
  function populateExperience(experiences) {
    const container = $('#experience-list');
    if (!container) return;

    container.innerHTML = experiences.map(exp => `
      <div class="experience-card reveal">
        <div class="exp-header">
          <div>
            <div class="exp-role">${exp.role}</div>
            <div class="exp-company">${exp.company}</div>
          </div>
          <div class="exp-meta">
            <div class="exp-dates">${exp.dates}</div>
            <div class="exp-location">${exp.location}</div>
          </div>
        </div>
        <div class="exp-bullets">
          ${exp.bullets.map(b => `<div class="exp-bullet">${b}</div>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ── Populate Projects ──
  function populateProjects(projects) {
    const grid = $('#projects-grid');
    if (!grid) return;

    grid.innerHTML = projects.map((proj, i) => `
      <div class="project-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="project-title">${proj.title}</div>
        <div class="project-dates">${proj.dates}</div>
        <div class="project-tech">
          ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-desc">${proj.description}</div>
        <div class="project-bullets">
          ${proj.bullets.map(b => `<div class="project-bullet">${b}</div>`).join('')}
        </div>
        ${proj.link ? `<a class="project-link" href="${proj.link}" target="_blank" rel="noopener">View Project →</a>` : ''}
      </div>
    `).join('');
  }

  const ICON_MAP = {
    engineering: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    `,
    ai: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2.5"></circle>
        <circle cx="5" cy="18" r="2.5"></circle>
        <circle cx="19" cy="18" r="2.5"></circle>
        <line x1="12" y1="7.5" x2="5" y2="15.5"></line>
        <line x1="12" y1="7.5" x2="19" y2="15.5"></line>
        <line x1="7.5" y1="18" x2="16.5" y2="18"></line>
      </svg>
    `,
    security: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    `,
    growth: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    `
  };

  // ── Populate About ──
  function populateAbout(aboutData) {
    const grid = $('#about-grid');
    if (!grid) return;

    grid.innerHTML = aboutData.map((card, i) => {
      const svgIcon = ICON_MAP[card.icon] || card.icon;
      return `
        <div class="about-card reveal reveal-delay-${(i % 4) + 1}">
          <div class="about-card-header">
            <div class="about-icon">${svgIcon}</div>
            <div class="about-card-title" style="color: ${card.color}">${card.title}</div>
          </div>
          <div class="about-bullets">
            ${card.bullets.map(b => `<div class="about-bullet">${b}</div>`).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Populate Skills Marquee ──
  function populateSkills(skills) {
    const marquee = $('#skills-marquee');
    if (!marquee) return;

    // Flatten all skill categories into one array
    const allSkills = [];
    for (const category of Object.keys(skills)) {
      if (category === 'Certifications') continue;
      skills[category].forEach(skill => allSkills.push(skill));
    }

    // Double the list for seamless loop
    const chips = allSkills.map(s => `<div class="skill-chip">${s}</div>`).join('');
    marquee.innerHTML = chips + chips;
  }

  // ── Populate Contact ──
  function populateContact(config) {
    const emailEl = $('#contact-email');
    if (emailEl) {
      emailEl.href = `mailto:${config.contact.email}`;
      emailEl.textContent = config.contact.email;
    }

    const socialEl = $('#contact-social');
    if (socialEl) {
      const links = [];

      if (config.contact.github) {
        links.push(`
          <a class="social-link" href="${config.contact.github}" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
        `);
      }

      if (config.contact.linkedin) {
        links.push(`
          <a class="social-link" href="${config.contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        `);
      }

      socialEl.innerHTML = links.join('');
    }

    const copyrightEl = $('#footer-copyright');
    if (copyrightEl) {
      const year = new Date().getFullYear();
      copyrightEl.textContent = `© ${year} ${config.meta.copyright}`;
    }
  }

  // ── Intersection Observer for Scroll Reveals ──
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Navbar Scroll Effect ──
  function initNavbar() {
    const navbar = $('#navbar');
    const navToggle = $('#nav-toggle');
    const navLinks = $('#nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('.section[id]');
    const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
          a.classList.add('active');
        }
      });
    });

    // Mobile toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      // Close menu on link click
      navAnchors.forEach(a => {
        a.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    }
  }

  // ── Cursor Glow Effect ──
  function initCursorGlow() {
    const glow = $('#cursor-glow');
    if (!glow) return;

    // Only on desktop
    if (window.matchMedia('(max-width: 768px)').matches) {
      glow.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // ── Theme Switcher ──
  function initTheme(config) {
    const toggleBtn = $('#theme-toggle');
    if (!toggleBtn) return;

    // Get initial theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    let currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

    // Set theme attribute on document element
    document.documentElement.setAttribute('data-theme', currentTheme);
    applyColors(config.colors, currentTheme);

    toggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', currentTheme);
      applyColors(config.colors, currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // ── Main Init ──
  async function init() {
    try {
      // Fetch all data in parallel
      const [config, introData, experiences, projects, aboutData] = await Promise.all([
        fetchJSON('config.json'),
        fetchJSON('intro.json'),
        fetchJSON('experience.json'),
        fetchJSON('projects.json'),
        fetchJSON('about.json'),
      ]);

      // Init theme switcher and apply initial theme
      initTheme(config);

      // Update page meta
      document.title = config.meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = config.meta.description;

      // Populate all sections
      populateHero(introData, config);
      populateExperience(experiences);
      populateProjects(projects);
      populateAbout(aboutData);
      populateSkills(config.skills);
      populateContact(config);

      // Init interactions
      initNavbar();
      initCursorGlow();

      // Wait for the loader progress animation to finish (1.4s + 0.3s delay = ~1.7s total)
      // Then fade out the overlay and reveal page content
      const loaderDuration = 1800; // ms — matches CSS loader-progress + delay
      setTimeout(() => {
        const overlay = $('#loading-overlay');
        if (overlay) {
          overlay.classList.add('fade-out');
          // Wait for overlay fade-out animation to end
          overlay.addEventListener('animationend', () => {
            overlay.style.display = 'none';
            document.body.classList.add('loaded');
            // Init scroll reveal after hero animations kick off
            setTimeout(initScrollReveal, 200);
          }, { once: true });
        }
      }, loaderDuration);

    } catch (err) {
      console.error('Portfolio init error:', err);
      // Still hide loader on error
      const overlay = $('#loading-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
      document.body.classList.add('loaded');
      setTimeout(initScrollReveal, 100);
    }
  }

  // Fire when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
