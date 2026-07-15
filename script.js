// ==========================================================================
// Header scrolled state + scrubber progress/playhead
// ==========================================================================
const header = document.getElementById('siteHeader');
const scrubberFill = document.getElementById('scrubberFill');
const scrubberHead = document.getElementById('scrubberHead');
const marks = document.querySelectorAll('.mark');
const sections = ['about', 'portfolio', 'skills', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

let ticking = false;

function updateOnScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrubberFill.style.width = progress + '%';
  scrubberHead.style.left = progress + '%';

  header.classList.toggle('scrolled', scrollTop > 12);

  // active section marker
  let currentId = null;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom > 140) currentId = sec.id;
  });
  marks.forEach(m => m.classList.toggle('active', m.dataset.target === currentId));

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}, { passive: true });

updateOnScroll();

// ==========================================================================
// Mobile menu toggle
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ==========================================================================
// Scroll-triggered reveal animations
// ==========================================================================
const revealEls = document.querySelectorAll('.reveal-line, .reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Hero content reveals immediately (already in view on load)
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-line').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 120);
  });
});

// ==========================================================================
// Lightbox for work gallery
// ==========================================================================
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('imgTarget');
const closeModal = document.querySelector('.close-modal');

document.querySelectorAll('.work-item img').forEach(image => {
  image.addEventListener('click', () => {
    modal.classList.add('active');
    modalImg.src = image.src;
    modalImg.alt = image.alt;
  });
});

closeModal.addEventListener('click', () => modal.classList.remove('active'));

modal.addEventListener('click', (e) => {
  if (e.target !== modalImg && e.target !== closeModal) {
    modal.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.classList.remove('active');
});
