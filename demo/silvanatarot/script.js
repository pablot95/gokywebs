const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

const bookingButtons = document.querySelectorAll('[data-service]');
const bookingLink = document.querySelector('#booking-link');

bookingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    bookingButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const message = `Hola Silvana, quiero consultar por ${button.dataset.service}`;
    if (bookingLink) bookingLink.href = `https://wa.me/5492914486095?text=${encodeURIComponent(message)}`;
  });
});

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach((openItem) => {
      if (openItem !== item) openItem.removeAttribute('open');
    });
  });
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
