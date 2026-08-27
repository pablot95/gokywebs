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

const filterButtons = document.querySelectorAll('.filter-button');
const courseCards = document.querySelectorAll('.course-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    courseCards.forEach((card) => {
      card.classList.toggle('is-hidden', selected !== 'all' && card.dataset.category !== selected);
    });
  });
});

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item?.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((faq) => {
      faq.classList.remove('is-open');
      const trigger = faq.querySelector('button');
      trigger?.setAttribute('aria-expanded', 'false');
      const symbol = trigger?.querySelector('b');
      if (symbol) symbol.textContent = '+';
    });
    if (item && !wasOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      const symbol = button.querySelector('b');
      if (symbol) symbol.textContent = '−';
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
