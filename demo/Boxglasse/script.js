const intro = document.getElementById("intro");
const introBtn = document.getElementById("introBtn");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const form = document.querySelector(".contact-form");

introBtn?.addEventListener("click", () => {
  intro?.classList.add("is-hidden");
  document.body.classList.remove("intro-open");
});

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

form?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("nombre") || "";
  const service = data.get("servicio") || "servicio";
  const details = data.get("mensaje") || "";
  const message = `Hola BOXGLASSE, soy ${name}. Quiero consultar por: ${service}. ${details}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
});

function initAnimations() {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".hero__img", {
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    y: 110
  });

  gsap.from(".hero__content > *", {
    y: 34,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out"
  });

  document.querySelectorAll(".service-card, .steps article, .gallery-grid img").forEach(element => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: "top 82%" },
      y: 46,
      opacity: 0,
      duration: 0.75,
      ease: "power2.out"
    });
  });

  document.querySelectorAll(".section-heading, .sticky-copy, .urgent__inner, .gallery-copy, .contact-grid > *").forEach(element => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: "top 84%" },
      y: 42,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out"
    });
  });
}

initAnimations();

/* ── Lightbox ── */
const galleryImgs  = [...document.querySelectorAll('.gallery-grid img')];
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose= document.getElementById('lightboxClose');
const lightboxBg   = document.getElementById('lightboxBackdrop');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let lbIdx = 0;

function lbOpen(idx) {
  lbIdx = idx;
  lightboxImg.src = galleryImgs[idx].src;
  lightboxImg.alt = galleryImgs[idx].alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function lbClose() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

galleryImgs.forEach((img, idx) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => lbOpen(idx));
});

lightboxClose.addEventListener('click', lbClose);
lightboxBg.addEventListener('click', lbClose);
lightboxNext.addEventListener('click', () => lbOpen((lbIdx + 1) % galleryImgs.length));
lightboxPrev.addEventListener('click', () => lbOpen((lbIdx - 1 + galleryImgs.length) % galleryImgs.length));

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')     lbClose();
  if (e.key === 'ArrowRight') lbOpen((lbIdx + 1) % galleryImgs.length);
  if (e.key === 'ArrowLeft')  lbOpen((lbIdx - 1 + galleryImgs.length) % galleryImgs.length);
});
