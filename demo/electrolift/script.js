document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'f12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.ctrlKey && key === 'u')) event.preventDefault();
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const modelBar = document.querySelector('.gw-modelos');
const whatsAppFloat = document.querySelector('.wsp-float');

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
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 850) closeMenu();
  });
}

let scrollTimer;
let scrollTicking = false;

function updateScrollUI() {
  if (whatsAppFloat) whatsAppFloat.classList.toggle('visible', window.scrollY > 600);
  if (modelBar) {
    modelBar.classList.add('gw-modelos--scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => modelBar.classList.remove('gw-modelos--scrolling'), 120);
  }
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
if (whatsAppFloat) whatsAppFloat.classList.toggle('visible', window.scrollY > 600);

const animated = [...document.querySelectorAll('[data-animate]')];
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  animated.forEach(item => item.classList.add('in'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 70px 0px' });
  animated.forEach(item => observer.observe(item));
  const revealVisible = () => {
    animated.forEach(item => {
      if (!item.classList.contains('in') && item.getBoundingClientRect().top < window.innerHeight + 70) {
        item.classList.add('in');
        observer.unobserve(item);
      }
    });
  };
  window.addEventListener('load', revealVisible, { once: true });
  window.addEventListener('resize', revealVisible, { passive: true });
  revealVisible();
}
