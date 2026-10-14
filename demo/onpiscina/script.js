document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'f12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.ctrlKey && key === 'u')) event.preventDefault();
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const modelBar = document.querySelector('.gw-modelos');
const whatsAppFloat = document.getElementById('wsp-float');
const modal = document.getElementById('gallery-modal');
const galleryButtons = [...document.querySelectorAll('.gallery-item')];
let lastFocused = null;
let galleryIndex = 0;

function closeMenu() {
  if (!menuButton || !menu) return;
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('no-scroll');
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', open);
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 850) closeMenu();
  });
}

function showGallery(index) {
  if (!modal || !galleryButtons.length) return;
  galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[galleryIndex];
  const img = button.querySelector('img');
  modal.querySelector('#gallery-large').src = img.src;
  modal.querySelector('#gallery-large').alt = img.alt;
  modal.querySelector('#gallery-title').textContent = button.querySelector('.gallery-caption span').textContent;
  if (modal.hidden) lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('.gallery-close').focus();
}

function closeGallery() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

if (modal) {
  galleryButtons.forEach((button, index) => button.addEventListener('click', () => showGallery(index)));
  modal.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', closeGallery));
  modal.querySelector('#gallery-prev').addEventListener('click', () => showGallery(galleryIndex - 1));
  modal.querySelector('#gallery-next').addEventListener('click', () => showGallery(galleryIndex + 1));
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowRight') showGallery(galleryIndex + 1);
    if (event.key === 'ArrowLeft') showGallery(galleryIndex - 1);
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

let barTimer;
let ticking = false;
function updateScrollUI() {
  if (whatsAppFloat && window.scrollY > 600) whatsAppFloat.classList.add('visible');
  if (modelBar) {
    modelBar.classList.add('gw-modelos--scrolling');
    clearTimeout(barTimer);
    barTimer = setTimeout(() => modelBar.classList.remove('gw-modelos--scrolling'), 120);
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
if (whatsAppFloat && window.scrollY > 600) whatsAppFloat.classList.add('visible');

const reveals = [...document.querySelectorAll('[data-animate]')];
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 70px 0px' });
  reveals.forEach(el => observer.observe(el));
  const revealVisible = () => reveals.forEach(el => {
    if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight + 70 && el.getBoundingClientRect().bottom > -70) {
      el.classList.add('in');
      observer.unobserve(el);
    }
  });
  window.addEventListener('load', revealVisible, { once: true });
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible, { passive: true });
  revealVisible();
}
