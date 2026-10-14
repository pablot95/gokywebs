document.documentElement.classList.add('js');

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'f12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.ctrlKey && key === 'u')) event.preventDefault();
});

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    nav.hidden = true;
    document.body.classList.remove('no-scroll');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) {
      close();
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && !nav.hidden) close();
  });
}

function initPlanDialog() {
  const dialog = document.querySelector('#plan-dialog');
  const selectedPlan = document.querySelector('#dialog-plan');
  const whatsapp = document.querySelector('#dialog-whatsapp');
  if (!dialog || !selectedPlan || !whatsapp) return;
  let openingButton = null;
  const updateLink = () => {
    const method = dialog.querySelector('input[name="payment"]:checked')?.value || 'transferencia';
    const message = `Hola Moni, me interesa la membresía ${selectedPlan.textContent} de RevoDigital. Quisiera confirmar el programa, el precio actual y cómo pagar con ${method}.`;
    whatsapp.href = `https://wa.me/5491125148369?text=${encodeURIComponent(message)}`;
  };
  document.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', () => {
      openingButton = button;
      selectedPlan.textContent = button.dataset.plan;
      dialog.querySelector('input[value="transferencia"]').checked = true;
      updateLink();
      dialog.showModal();
      document.body.classList.add('no-scroll');
      dialog.querySelector('.dialog-close').focus();
    });
  });
  dialog.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener('change', updateLink));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    openingButton?.focus();
  });
}

function initReveals() {
  const elements = [...document.querySelectorAll('[data-animate]')];
  if (!elements.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(element => element.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 40px 0px', threshold: 0 });
  elements.forEach(element => observer.observe(element));
  window.addEventListener('load', () => {
    elements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add('in');
    });
  }, { once: true });
}

initModelBarScroll();
initMobileMenu();
initPlanDialog();
initReveals();
