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
  function applyColors(colors) {
    const root = document.documentElement.style;
    root.setProperty('--primary', colors.primary);
    root.setProperty('--primary-dark', colors.primaryDark);
    root.setProperty('--neutral', colors.neutral);
    root.setProperty('--surface', colors.surface);
    if (colors.background) root.setProperty('--bg', colors.background);
    if (colors.backgroundAlt) root.setProperty('--bg-alt', colors.backgroundAlt);
    if (colors.textPrimary) root.setProperty('--text-primary', colors.textPrimary);
    if (colors.textSecondary) root.setProperty('--text-secondary', colors.textSecondary);
    if (colors.cardBg) root.setProperty('--card-bg', colors.cardBg);
    if (colors.cardBorder) root.setProperty('--card-border', colors.cardBorder);
    if (colors.glassBg) root.setProperty('--glass-bg', colors.glassBg);
    if (colors.glassBorder) root.setProperty('--glass-border', colors.glassBorder);
  }

  // ── Populate Hero / Intro ──
  function populateHero(introData, config) {
    // Line 1: greeting (e.g., "Hi, Rithwak here and I'm a...")
    const greetingEl = $('#hero-greeting');
    if (greetingEl && introData.greeting) {
      // Highlight the name
      const name = config.meta.name.split(' ')[0]; // "Rithwak"
      greetingEl.innerHTML = introData.greeting.replace(
        name,
        `<span class="name-highlight">${name}</span>`
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

  // ── Populate About ──
  function populateAbout(aboutData) {
    const grid = $('#about-grid');
    if (!grid) return;

    grid.innerHTML = aboutData.map((card, i) => `
      <div class="about-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="about-card-header">
          <div class="about-icon">${card.icon}</div>
          <div class="about-card-title" style="color: ${card.color}">${card.title}</div>
        </div>
        <div class="about-bullets">
          ${card.bullets.map(b => `<div class="about-bullet">${b}</div>`).join('')}
        </div>
      </div>
    `).join('');
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

      // Apply theme colors
      applyColors(config.colors);

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

      // Small delay for paint, then reveal and start scroll observer
      requestAnimationFrame(() => {
        const overlay = $('#loading-overlay');
        if (overlay) overlay.classList.add('hidden');

        // Init scroll reveal after content is in DOM
        setTimeout(initScrollReveal, 100);
      });

    } catch (err) {
      console.error('Portfolio init error:', err);
      // Still hide loader on error
      const overlay = $('#loading-overlay');
      if (overlay) overlay.classList.add('hidden');
    }
  }

  // Fire when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
