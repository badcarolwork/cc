/* ============================================
   CAROL CHAW PORTFOLIO — main.js
   ============================================ */


/* ── UTILS ────────────────────────────────── */
const isMobile = window.matchMedia('(hover: none)').matches;


/* ── THEME TOGGLE ─────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
let isDark = true;

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? '' : 'light');
  themeBtn.textContent = isDark ? '☀ light' : '☾ dark';
});


/* ── CUSTOM CURSOR ────────────────────────── */
if (!isMobile) {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    // ring lags behind cursor for smooth trailing effect
    ringX += (e.clientX - ringX) * 0.15;
    ringY += (e.clientY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  });

  // expand ring on interactive elements
  const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-tag');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
  });
}


/* ── PARTICLE BACKGROUND ──────────────────── */
const bgCanvas  = document.getElementById('bg-canvas');
const bgCtx     = bgCanvas.getContext('2d');
let canvasW, canvasH;
let mouseX = 0;
let mouseY = 0;

function resizeBgCanvas() {
  canvasW = bgCanvas.width  = window.innerWidth;
  canvasH = bgCanvas.height = window.innerHeight;
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x  = Math.random() * canvasW;
    this.y  = Math.random() * canvasH;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.a  = Math.random() * 0.5 + 0.1;
  }

  draw() {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(139, 124, 248, ${this.a})`;
    bgCtx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvasW || this.y < 0 || this.y > canvasH) {
      this.reset();
    }
  }
}

const particles = Array.from({ length: 70 }, () => new Particle());

function animateParticles() {
  bgCtx.clearRect(0, 0, canvasW, canvasH);

  particles.forEach(p => {
    // connect to mouse
    const dxMouse = p.x - mouseX;
    const dyMouse = p.y - mouseY;
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    if (distMouse < 150) {
      bgCtx.beginPath();
      bgCtx.moveTo(p.x, p.y);
      bgCtx.lineTo(mouseX, mouseY);
      bgCtx.strokeStyle = `rgba(139, 124, 248, ${0.07 * (1 - distMouse / 150)})`;
      bgCtx.lineWidth = 0.5;
      bgCtx.stroke();
    }

    // connect nearby particles
    particles.forEach(p2 => {
      const dx2 = p.x - p2.x;
      const dy2 = p.y - p2.y;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (dist2 < 90) {
        bgCtx.beginPath();
        bgCtx.moveTo(p.x, p.y);
        bgCtx.lineTo(p2.x, p2.y);
        bgCtx.strokeStyle = `rgba(139, 124, 248, ${0.04 * (1 - dist2 / 90)})`;
        bgCtx.lineWidth = 0.3;
        bgCtx.stroke();
      }
    });

    p.draw();
    p.update();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ── TYPED TEXT ───────────────────────────── */
const typedEl  = document.getElementById('typed');
const phrases  = [
  'Senior Frontend Engineer',
  'Creative Ad Tech Specialist',
  'React.js Developer',
  'Rich Media Expert',
  'Prompt Engineer · AI Tools',
  'APAC Market Specialist',
];
let phraseIndex   = 0;
let charIndex     = 0;
let isDeleting    = false;
let waitFrames    = 0;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (waitFrames > 0) {
    waitFrames--;
    setTimeout(typeLoop, 50);
    return;
  }

  if (!isDeleting) {
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting  = true;
      waitFrames  = 50;
    }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
      waitFrames   = 8;
    }
    setTimeout(typeLoop, 40);
  }
}
setTimeout(typeLoop, 1400);


/* ── SCROLL REVEAL ────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── TIMELINE REVEAL ──────────────────────── */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 140);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item, .timeline-earlier')
  .forEach(el => timelineObserver.observe(el));


/* ── PROJECT CARD TILT ────────────────────── */
if (!isMobile) {
  document.querySelectorAll('.project-card').forEach(card => {

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;

      card.style.setProperty('--rx', `${-cy * 8}deg`);
      card.style.setProperty('--ry', `${cx  * 8}deg`);
      card.style.setProperty('--mx', `${(e.clientX - rect.left) / rect.width  * 100}%`);
      card.style.setProperty('--my', `${(e.clientY - rect.top)  / rect.height * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
