/* ============================================================
   main.js — Reads data.json and renders all dynamic sections
   ============================================================ */

/* ── Load data ─────────────────────────────────────────────── */
fetch('./data.json?v=' + new Date().getTime())
  .then(res => res.json())
  .then(data => {
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderArticles(data.articles);
  })
  .catch(err => console.error('Could not load data.json:', err));

/* ══════════════════════════════════════════
   SKILLS
══════════════════════════════════════════ */
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = skills.map(skill => `
    <div class="skill-item">
      <div class="skill-icon" ${skill.color ? `style="color:${skill.color}"` : ''}>
        ${skill.icon}
      </div>
      <div class="skill-name">${skill.name}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════ */
function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  timeline.innerHTML = experience.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot ${item.active ? 'active' : ''}"></div>
      <div class="timeline-card">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-role">${item.role}</div>
        <div class="timeline-company">${item.company}</div>
        <div class="timeline-desc">${item.description}</div>
        <div class="tag-list">
          ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(project => {
    const isLive = project.status === 'live';

    return `
      <div class="project-card">
        ${buildProjectPreview(project)}
        <div class="project-info">
          <div class="project-title">${project.title}</div>
          <div class="project-desc">${project.description}</div>

          <div class="tag-list" style="margin-bottom:16px;">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>

          ${isLive ? `
            <div class="project-links">
              ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank"><i class="fa-brands fa-github"></i> Code</a>` : ''}
              ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* Website-style Preview */
function buildProjectPreview(project) {
  const disabled = project.status === "coming-soon";

  return `
    <div class="project-preview ${disabled ? "disabled-preview" : ""}">

      <div class="mini-browser">

        <div class="browser-top">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="mini-navbar">
          <div class="mini-logo">${project.title.split(" ")[0]}</div>

          <div class="mini-links">
            <span>Home</span>
            <span>About</span>
            <span>Projects</span>
          </div>
        </div>

        <div class="mini-hero">

          <div class="hero-title-mini">
            ${project.title}
          </div>

          <div class="hero-text-mini">
            ${project.description}
          </div>

          <div class="hero-buttons">
            <div class="btn-green"></div>
            <div class="btn-outline"></div>
          </div>

        </div>

      </div>

      ${disabled ? `
      <div class="coming-overlay">
        <div class="coming-soon-badge">
          Coming Soon
        </div>
      </div>
      ` : ""}

    </div>
  `;
}

/* ══════════════════════════════════════════
   ARTICLES
══════════════════════════════════════════ */
function renderArticles(articles) {
  const grid = document.getElementById('articles-grid');
  const section = document.getElementById('articles');

  if (!grid || !section) return;

  if (!articles || articles.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';

  grid.innerHTML = articles.map(article => `
    <a class="article-card" href="${article.url}" target="_blank">
      <div class="article-date">${formatDate(article.date)}</div>
      <div class="article-title">${article.title}</div>
      <div class="article-summary">${article.summary}</div>

      <div class="tag-list" style="margin-top:12px;">
        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>

      <div class="article-read-more">
        Read more <i class="fa-solid fa-arrow-right"></i>
      </div>
    </a>
  `).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/* ══════════════════════════════════════════
   UI
══════════════════════════════════════════ */

const typeLines = [
  'Learning by building, not just watching.',
  'Operating Systems Engineer.',
  'Currently: C++ • SQL • Web Dev'
];

let tl = 0;
let tc = 0;
let deleting = false;

function type() {
  const el = document.getElementById('tagline');
  if (!el) return;

  const line = typeLines[tl];

  if (!deleting) {
    el.innerHTML = line.slice(0, tc + 1) + '<span class="cursor">|</span>';
    tc++;

    if (tc === line.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }

  } else {

    el.innerHTML = line.slice(0, tc - 1) + '<span class="cursor">|</span>';
    tc--;

    if (tc === 0) {
      deleting = false;
      tl = (tl + 1) % typeLines.length;
    }
  }

  setTimeout(type, deleting ? 40 : 75);
}

function runCode() {
  document.getElementById('about-output').classList.toggle('visible');
}

function toggleTheme() {
  document.body.classList.toggle('light');

  document.getElementById('theme-icon').className =
    document.body.classList.contains('light')
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
}

function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}

function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  type();
  initScrollObserver();
});
