/* Gianina Giselle Real — GR Consultora en Criminología y Prevención */

/* --------------------------- Anti-copia (disuasivo) ---------------------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------- Navegación ----------------------------- */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
    navigation.classList.remove('is-open');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navigation?.classList.contains('is-open')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
    navigation.classList.remove('is-open');
    menuButton?.focus();
  }
});

/* ---------------------------------- FAQ ---------------------------------- */
document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach((openItem) => {
      if (openItem !== item) openItem.removeAttribute('open');
    });
  });
});

/* ------------------- Entradas: reveals, cortinas y trazos ---------------- */
const makeObserver = (className, threshold) => (
  'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(className);
          obs.unobserve(entry.target);
        });
      }, { threshold, rootMargin: '0px 0px -8% 0px' })
    : null
);

const observeAll = (selector, className, threshold) => {
  const observer = makeObserver(className, threshold);
  document.querySelectorAll(selector).forEach((el) => {
    if (observer && !reduced) observer.observe(el);
    else el.classList.add(className);
  });
};

observeAll('.reveal', 'is-visible', 0.12);
observeAll('.frame', 'is-visible', 0.2);
observeAll('.seam, .card-arc, .quote-arc, .closing-arc', 'is-drawn', 0.1);

/* --------------- Momento firma: el emblema se arma en el hero ------------ */
const stages = [...document.querySelectorAll('.hero [data-stage]')];
const heroArcs = [...document.querySelectorAll('.hero-arc')];

const playHero = () => {
  stages.forEach((el) => {
    const step = Number(el.dataset.stage) || 1;
    if (reduced) { el.classList.add('is-in'); return; }
    setTimeout(() => el.classList.add('is-in'), 120 + step * 145);
  });
  heroArcs.forEach((arc, i) => {
    if (reduced) { arc.classList.add('is-drawn'); return; }
    setTimeout(() => arc.classList.add('is-drawn'), 260 + i * 320);
  });
};

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(playHero).catch(playHero);
} else {
  window.addEventListener('load', playHero);
}
setTimeout(playHero, 1400); // red de seguridad si las fuentes tardan

/* ---------------------- Hilo dorado guiado por el scroll ----------------- */
const threadFill = document.getElementById('threadFill');
if (threadFill && !reduced) {
  let ticking = false;
  const paint = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    threadFill.style.height = (progress * 100).toFixed(2) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  }, { passive: true });
  window.addEventListener('resize', paint, { passive: true });
  paint();
}

/* ----------------------------------- Año --------------------------------- */
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
