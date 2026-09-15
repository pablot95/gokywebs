const WA = '5493496549220';
const ENVIO_GRATIS_DESDE = 120000;
const PAGE_SIZE = 12;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'dama', nombre: 'Dama', desc: 'Prendas y básicos', img: 'images/maniqui-elegante-en-boutique_1-1.webp' },
  { id: 'caballeros', nombre: 'Caballeros', desc: 'Casual y trabajo', img: 'images/vestimenta-masculina-en-exhibicion_1-1.webp' },
  { id: 'ninos', nombre: 'Niños', desc: 'De bebé a 12 años', img: 'images/moda-infantil-en-boutique_1-1.webp' },
  { id: 'calzado', nombre: 'Calzado', desc: 'Para toda la familia', img: 'images/zapatos-elegantes-en-boutique_1-1.webp' },
  { id: 'blanco', nombre: 'Blanco', desc: 'Sábanas, toallas y más', img: 'images/cama-acogedora-con-detalles-azules_1-1.webp' },
  { id: 'marroquineria', nombre: 'Marroquinería', desc: 'Carteras y accesorios', img: 'images/recorte-bolso.webp', contain: true },
  { id: 'lanas', nombre: 'Lanas', desc: 'Ovillos e hilados', img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp' },
];

const PRODUCTOS = [
  { id: 'blazer-lino-crema', nombre: 'Blazer de Lino Crema', cat: 'dama', precio: 89900, descuento: 0, nuevo: true, destacado: true, img: 'images/maniqui-elegante-en-boutique_1-1.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Blazer entallado de lino con forrería liviana. El comodín que levanta cualquier conjunto, de la oficina al evento.', tags: 'saco blazer lino mujer elegante' },
  { id: 'vestido-fibrana-flores', nombre: 'Vestido de Fibrana Floreado', cat: 'dama', precio: 52900, descuento: 15, destacado: true, img: 'images/mujer-eligiendo-ropa-en-boutique_9-16.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Vestido midi de fibrana con estampa floral azul, mangas cortas y cintura elastizada. Fresco y favorecedor.', tags: 'vestido flores fibrana verano mujer' },
  { id: 'jean-wide-leg', nombre: 'Jean Wide Leg Celeste', cat: 'dama', precio: 64900, descuento: 0, img: 'images/mujer-eligiendo-ropa-en-boutique_9-16.webp', talles: ['38', '40', '42', '44', '46'], desc: 'Jean tiro alto de pierna amplia en lavado celeste. Calce cómodo que estiliza, del 38 al 46.', tags: 'jean pantalon wide denim mujer' },
  { id: 'remera-modal-marino', nombre: 'Remera de Modal Marino', cat: 'dama', precio: 24900, descuento: 0, img: 'images/mujer-eligiendo-ropa-en-boutique_9-16.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Remera básica de modal con caída suave y escote redondo. El básico que se lleva de a tres.', tags: 'remera basico modal mujer marino azul' },
  { id: 'camisa-voile-blanca', nombre: 'Camisa de Voile Blanca', cat: 'dama', precio: 38900, descuento: 0, img: 'images/maniqui-elegante-en-boutique_1-1.webp', talles: ['S', 'M', 'L', 'XL'], desc: 'Camisa liviana de voile con botones nacarados. Transparencia justa, elegancia total.', tags: 'camisa blanca voile mujer' },
  { id: 'campera-gabardina-marino', nombre: 'Campera de Gabardina Marino', cat: 'caballeros', precio: 112900, descuento: 0, destacado: true, img: 'images/vestimenta-masculina-en-exhibicion_1-1.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Campera de gabardina con interior matelaseado y cierre reforzado. Abriga sin abultar.', tags: 'campera abrigo gabardina hombre marino' },
  { id: 'chomba-pique-arena', nombre: 'Chomba Piqué Arena', cat: 'caballeros', precio: 32900, descuento: 0, img: 'images/vestimenta-masculina-en-exhibicion_1-1.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Chomba de piqué peinado color arena. Cuello firme que no se deforma con los lavados.', tags: 'chomba polo pique hombre' },
  { id: 'pantalon-chino-beige', nombre: 'Pantalón Chino Beige', cat: 'caballeros', precio: 54900, descuento: 0, img: 'images/vestimenta-masculina-en-exhibicion_1-1.webp', talles: ['38', '40', '42', '44', '46', '48'], desc: 'Chino de gabardina elastizada corte recto. De lunes a domingo, queda bien siempre.', tags: 'pantalon chino gabardina hombre beige' },
  { id: 'camisa-oxford-celeste', nombre: 'Camisa Oxford Celeste', cat: 'caballeros', precio: 44900, descuento: 10, img: 'images/vestimenta-masculina-en-exhibicion_1-1.webp', talles: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Camisa Oxford clásica en celeste, puño regulable y bolsillo al tono. Planchado fácil.', tags: 'camisa oxford celeste hombre' },
  { id: 'vestido-nena-floreado', nombre: 'Vestido de Nena Floreado', cat: 'ninos', precio: 28900, descuento: 0, nuevo: true, destacado: true, img: 'images/moda-infantil-en-boutique_1-1.webp', talles: ['2', '4', '6', '8', '10', '12'], desc: 'Vestido de algodón con estampa de flores y volados en la falda. Para que gire y gire.', tags: 'vestido nena niña flores infantil' },
  { id: 'conjunto-bebe-pique', nombre: 'Conjunto de Bebé Piqué', cat: 'ninos', precio: 21900, descuento: 0, img: 'images/moda-infantil-en-boutique_1-1.webp', talles: ['0-3m', '3-6m', '6-12m', '12-18m'], desc: 'Conjunto de dos piezas en piqué suave con botones a presión. Regalo infalible para recién nacidos.', tags: 'bebe conjunto ajuar pique infantil' },
  { id: 'buzo-frisa-nino', nombre: 'Buzo de Frisa Niño', cat: 'ninos', precio: 19900, descuento: 20, img: 'images/moda-infantil-en-boutique_1-1.webp', talles: ['4', '6', '8', '10', '12'], desc: 'Buzo de frisa invisible con capucha y bolsillo canguro. Aguanta plaza, escuela y siesta.', tags: 'buzo frisa niño abrigo infantil' },
  { id: 'stilettos-gamuza-azul', nombre: 'Stilettos de Gamuza Azul', cat: 'calzado', precio: 84900, descuento: 0, nuevo: true, destacado: true, img: 'images/recorte-zapatos.webp', contain: true, talles: ['35', '36', '37', '38', '39', '40'], desc: 'Stilettos de gamuza azul con taco block de 7 cm y plantilla acolchada. Elegancia que se banca la fiesta entera.', tags: 'zapatos stilettos taco gamuza azul mujer fiesta' },
  { id: 'zapatillas-urbanas-blancas', nombre: 'Zapatillas Urbanas Blancas', cat: 'calzado', precio: 74900, descuento: 0, destacado: true, img: 'images/zapatos-elegantes-en-boutique_1-1.webp', talles: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], desc: 'Zapatillas urbanas de cuero sintético blanco, suela liviana. Combinan con absolutamente todo.', tags: 'zapatillas blancas urbanas unisex' },
  { id: 'sandalias-yute-suela', nombre: 'Sandalias de Yute Suela', cat: 'calzado', precio: 58900, descuento: 0, img: 'images/zapatos-elegantes-en-boutique_1-1.webp', talles: ['35', '36', '37', '38', '39', '40'], desc: 'Sandalias con plataforma de yute trenzado y tiras de cuero suela. El verano en los pies.', tags: 'sandalias yute plataforma mujer verano' },
  { id: 'mocasines-cuero-suela', nombre: 'Mocasines de Cuero Suela', cat: 'calzado', precio: 79900, descuento: 10, img: 'images/zapatos-elegantes-en-boutique_1-1.webp', talles: ['39', '40', '41', '42', '43', '44'], desc: 'Mocasines de cuero vacuno color suela con costura artesanal. Cómodos desde el primer uso.', tags: 'mocasines cuero hombre zapatos' },
  { id: 'sabanas-queen-200', nombre: 'Juego de Sábanas Queen 200 hilos', cat: 'blanco', precio: 68900, descuento: 0, destacado: true, img: 'images/cama-acogedora-con-detalles-azules_1-1.webp', talles: ['1 plaza', '2 plazas', 'Queen', 'King'], varLabel: 'Medida', desc: 'Juego de sábanas de algodón peinado 200 hilos: ajustable, encimera y dos fundas. Suavidad de hotel.', tags: 'sabanas juego algodon queen king blanco' },
  { id: 'acolchado-reversible-azul', nombre: 'Acolchado Reversible Azul', cat: 'blanco', precio: 94900, descuento: 0, img: 'images/cama-acogedora-con-detalles-azules_1-1.webp', talles: ['1 plaza', '2 plazas', 'Queen', 'King'], varLabel: 'Medida', desc: 'Acolchado doble faz azul y crudo con relleno siliconado. Dos frentes, el doble de dormitorio.', tags: 'acolchado edredon reversible azul blanco' },
  { id: 'toallon-toalla-algodon', nombre: 'Set Toallón + Toalla de Algodón', cat: 'blanco', precio: 29900, descuento: 15, img: 'images/rincon-boutique-de-dormitorio-acogedor_4-5.webp', talles: null, desc: 'Set de toallón y toalla 100% algodón de 500 g/m². Secado rápido y colores que no destiñen.', tags: 'toalla toallon algodon baño blanco set' },
  { id: 'manta-pie-de-cama', nombre: 'Manta Pie de Cama Tejida', cat: 'blanco', precio: 46900, descuento: 0, img: 'images/rincon-boutique-de-dormitorio-acogedor_4-5.webp', talles: null, desc: 'Manta tejida con flecos para pie de cama. El detalle que hace que el dormitorio parezca de revista.', tags: 'manta pie de cama tejida deco blanco' },
  { id: 'cartera-hobo-crema', nombre: 'Cartera Hobo Crema', cat: 'marroquineria', precio: 79900, descuento: 0, destacado: true, img: 'images/recorte-bolso.webp', contain: true, talles: null, desc: 'Cartera hobo de ecocuero con herrajes dorados y borlas laterales. Amplia, liviana y con cierre de seguridad.', tags: 'cartera bolso hobo crema mujer marroquineria' },
  { id: 'bandolera-cuero-suela', nombre: 'Bandolera de Cuero Suela', cat: 'marroquineria', precio: 49900, descuento: 0, img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp', talles: null, desc: 'Bandolera de cuero color suela con correa regulable y bolsillo trasero. Tamaño justo para salir liviana.', tags: 'bandolera cartera cuero suela mujer' },
  { id: 'billetera-dama-cuero', nombre: 'Billetera de Dama en Cuero', cat: 'marroquineria', precio: 27900, descuento: 0, img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp', talles: null, desc: 'Billetera de cuero con doce tarjeteros, monedero y cierre. Ordenada por dentro, linda por fuera.', tags: 'billetera cuero dama mujer marroquineria' },
  { id: 'ovillo-merino-100', nombre: 'Ovillo Merino x 100 g', cat: 'lanas', precio: 8900, descuento: 0, img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp', talles: ['Crudo', 'Azul', 'Rosa', 'Gris'], varLabel: 'Color', desc: 'Lana merino semigruesa de 100 g, suave y sin picazón. Ideal para sweaters y gorros de invierno.', tags: 'lana merino ovillo tejido crochet dos agujas' },
  { id: 'pack-6-ovillos-acrilico', nombre: 'Pack 6 Ovillos Acrílico', cat: 'lanas', precio: 21900, descuento: 10, img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp', talles: null, desc: 'Pack de seis ovillos acrílicos surtidos en la paleta que elijas. Rinde mantas enteras.', tags: 'lana acrilico pack ovillos tejido mayorista' },
  { id: 'mohair-premium-50', nombre: 'Mohair Premium x 50 g', cat: 'lanas', precio: 11900, descuento: 0, nuevo: true, img: 'images/bolso-y-lanas-en-boutique-acogedora_1-1.webp', talles: ['Natural', 'Celeste', 'Rosa viejo'], varLabel: 'Color', desc: 'Mohair de fibra extra suave con brillo natural. Para tejidos aireados con terminación de boutique.', tags: 'mohair lana premium tejido suave' },
];

const DESTACADOS_IDS = ['blazer-lino-crema', 'campera-gabardina-marino', 'vestido-nena-floreado', 'stilettos-gamuza-azul', 'sabanas-queen-200', 'cartera-hobo-crema', 'vestido-fibrana-flores', 'zapatillas-urbanas-blancas'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'emmel_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate], .h-anim').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function stRefresh() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initHero() {
  const els = document.querySelectorAll('.h-anim');
  const tag = document.querySelector('.hero .hang-tag');
  if (typeof gsap === 'undefined' || reduceMotion) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero .eyebrow.h-anim', { opacity: 1, y: 0, duration: .7 }, .1)
    .to('.hero h1', { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1 }, .18)
    .to('.scene-panel', { opacity: 1, scale: 1, duration: 1 }, .25)
    .to('.hero-sub', { opacity: 1, y: 0, duration: .8 }, .42)
    .to('.scene-bolso', { opacity: 1, y: 0, rotate: 0, duration: 1.15, ease: 'back.out(1.4)' }, .5)
    .to('.hero-ctas', { opacity: 1, y: 0, duration: .8 }, .58)
    .to('.scene-zapatos', { opacity: 1, y: 0, rotate: -6, duration: .9 }, .72)
    .to('.hero-chips', { opacity: 1, y: 0, duration: .7 }, .74)
    .to('.hang-tag', { opacity: 1, y: 0, duration: .7, onComplete: () => tag?.classList.add('in-sway') }, .85)
    .to('.scene-stamp', { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)' }, .95);
}

function initScrollFx() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const over = document.getElementById('oversizedMayor');
  if (over) {
    gsap.fromTo(over, { xPercent: -6 }, {
      xPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '#mayorista', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  gsap.utils.toArray('.parallax').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -9 }, {
      yPercent: 9, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(max-width: 768px)');
  const syncInert = () => {
    if (mq.matches && !nav.classList.contains('open')) nav.setAttribute('inert', '');
    else if (!mq.matches) nav.removeAttribute('inert');
  };
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    syncInert();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  mq.addEventListener('change', syncInert);
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) { moved = true; vp.classList.add('dragging'); vp.setPointerCapture?.(pointerId); }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.getElementById('railCategorias');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  track.innerHTML = CATEGORIAS.map(c => {
    const count = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `
    <button type="button" class="cat-card" data-cat="${c.id}" aria-label="Ver ${esc(c.nombre)} en el catálogo">
      <div class="cat-media"><img src="${c.img}" alt="" width="600" height="750" loading="lazy" class="${c.contain ? 'contain' : ''}"></div>
      <div class="cat-info">
        <div><h3>${esc(c.nombre)}</h3><p>${esc(c.desc)} · ${count} productos</p></div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
      </div>
    </button>`;
  }).join('');
  track.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => filtrarDesdeAfuera(card.dataset.cat));
  });
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
  initRailDrag(vp);
}

const filtros = { q: '', cat: 'all', orden: 'relevancia', ofertas: false };
let visibles = PAGE_SIZE;
let catalogoInicial = true;

function productosFiltrados() {
  let lista = [...PRODUCTOS];
  if (filtros.cat !== 'all') lista = lista.filter(p => p.cat === filtros.cat);
  if (filtros.ofertas) lista = lista.filter(p => p.descuento > 0);
  if (filtros.q) {
    const q = norm(filtros.q).split(/\s+/).filter(Boolean);
    lista = lista.filter(p => {
      const hay = norm(`${p.nombre} ${p.tags} ${getCategoria(p.cat)?.nombre || ''} ${p.desc} ${(p.talles || []).join(' ')}`);
      return q.every(w => hay.includes(w));
    });
  }
  if (filtros.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  if (filtros.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  return lista;
}

function badgeHtml(p) {
  if (p.descuento > 0) return `<span class="badge badge-desc">-${p.descuento}%</span>`;
  if (p.nuevo) return `<span class="badge badge-nuevo">Nuevo</span>`;
  return '';
}

function precioHtml(p) {
  if (p.descuento > 0) {
    return `<span class="precio precio-oferta">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`;
  }
  return `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function cardHtml(p, anim = false, delay = 0) {
  const cat = getCategoria(p.cat);
  return `
  <article class="card${anim ? ' anim' : ''}"${anim ? ` style="animation-delay:${delay}s"` : ''} data-id="${p.id}">
    <div class="card-media" data-open="${p.id}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}">
      ${badgeHtml(p)}
      <img src="${p.img}" alt="${esc(p.nombre)}" width="600" height="600" loading="lazy" class="${p.contain ? 'contain' : ''}">
      <span class="ver-detalle">Vista rápida</span>
    </div>
    <div class="card-body">
      <p class="card-cat">${esc(cat?.nombre || '')}</p>
      <h3 class="card-nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="card-precio">${precioHtml(p)}</div>
      <div class="card-acciones">
        <div class="qty-row">
          <div class="qty" data-qty="1">
            <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
            <output aria-live="polite">1</output>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </div>
  </article>`;
}

function bindCardEvents(scope) {
  scope.querySelectorAll('.qty [data-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.closest('.qty');
      let v = parseInt(box.dataset.qty, 10) + parseInt(btn.dataset.step, 10);
      v = Math.max(1, Math.min(v, 99));
      box.dataset.qty = v;
      box.querySelector('output').textContent = v;
    });
  });
  scope.querySelectorAll('[data-open]').forEach(el => {
    const openIt = () => abrirModal(el.dataset.open);
    el.addEventListener('click', openIt);
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); } });
    }
  });
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProducto(btn.dataset.add);
      if (!p) return;
      const qty = parseInt(btn.closest('.card')?.querySelector('.qty')?.dataset.qty || '1', 10);
      if (p.talles?.length) { abrirModal(p.id, qty); return; }
      Cart.add(p, null, qty);
      showToast('¡Agregado! Tu carrito te espera.');
    });
  });
  scope.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProducto(btn.dataset.buy);
      if (!p) return;
      const qty = parseInt(btn.closest('.card')?.querySelector('.qty')?.dataset.qty || '1', 10);
      if (p.talles?.length) { abrirModal(p.id, qty, true); return; }
      Cart.add(p, null, qty);
      abrirDrawer();
    });
  });
}

function renderDestacados() {
  const grid = document.getElementById('destacadosGrid');
  if (!grid) return;
  const lista = DESTACADOS_IDS.map(getProducto).filter(Boolean);
  grid.innerHTML = lista.map(p => cardHtml(p)).join('');
  grid.querySelectorAll('.card').forEach((card, i) => {
    card.setAttribute('data-animate', 'up');
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
  });
  bindCardEvents(grid);
}

function renderChips() {
  const wrap = document.getElementById('chipsCat');
  if (!wrap) return;
  const chips = [{ id: 'all', nombre: 'Todo' }, ...CATEGORIAS];
  wrap.innerHTML = chips.map(c => `<button type="button" data-chip="${c.id}" class="${filtros.cat === c.id ? 'activo' : ''}">${esc(c.nombre)}</button>`).join('');
  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.cat = btn.dataset.chip;
      visibles = PAGE_SIZE;
      renderChips();
      renderCatalogo(true);
    });
  });
}

function renderCatalogo(animar = false) {
  const grid = document.getElementById('catalogoGrid');
  const info = document.getElementById('resultadosInfo');
  const vacio = document.getElementById('sinResultados');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiarFiltros');
  if (!grid) return;
  const lista = productosFiltrados();
  const mostrar = lista.slice(0, visibles);
  const hayFiltros = filtros.q || filtros.cat !== 'all' || filtros.ofertas || filtros.orden !== 'relevancia';
  grid.innerHTML = mostrar.map((p, i) => cardHtml(p, animar && !reduceMotion, Math.min(i * 0.06, 0.6))).join('');
  if (catalogoInicial) {
    catalogoInicial = false;
    grid.querySelectorAll('.card').forEach(card => {
      card.setAttribute('data-animate', 'up');
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
    });
  }
  bindCardEvents(grid);
  if (info) {
    info.textContent = lista.length === 0 ? '' :
      lista.length === 1 ? '1 producto encontrado' :
      `${lista.length} productos${mostrar.length < lista.length ? ` · mostrando ${mostrar.length}` : ''}`;
  }
  if (vacio) vacio.hidden = lista.length > 0;
  if (verMas) verMas.hidden = mostrar.length >= lista.length;
  if (limpiar) limpiar.hidden = !hayFiltros;
  stRefresh();
}

function filtrarDesdeAfuera(cat) {
  filtros.cat = cat;
  filtros.q = '';
  const buscador = document.getElementById('buscador');
  if (buscador) buscador.value = '';
  visibles = PAGE_SIZE;
  renderChips();
  renderCatalogo(true);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function limpiarTodo() {
  filtros.q = ''; filtros.cat = 'all'; filtros.orden = 'relevancia'; filtros.ofertas = false;
  visibles = PAGE_SIZE;
  const buscador = document.getElementById('buscador');
  const orden = document.getElementById('orden');
  const ofertas = document.getElementById('soloOfertas');
  if (buscador) buscador.value = '';
  if (orden) orden.value = 'relevancia';
  if (ofertas) ofertas.checked = false;
  renderChips();
  renderCatalogo(true);
}

function initFiltros() {
  const buscador = document.getElementById('buscador');
  const orden = document.getElementById('orden');
  const ofertas = document.getElementById('soloOfertas');
  const verMas = document.getElementById('verMas');
  let t;
  buscador?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      filtros.q = buscador.value.trim();
      visibles = PAGE_SIZE;
      renderCatalogo(true);
    }, 220);
  });
  orden?.addEventListener('change', () => { filtros.orden = orden.value; visibles = PAGE_SIZE; renderCatalogo(true); });
  ofertas?.addEventListener('change', () => { filtros.ofertas = ofertas.checked; visibles = PAGE_SIZE; renderCatalogo(true); });
  verMas?.addEventListener('click', () => { visibles += PAGE_SIZE; renderCatalogo(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarTodo);
  document.getElementById('btnLimpiarVacio')?.addEventListener('click', limpiarTodo);
  document.querySelectorAll('.hero-chips [data-cat]').forEach(btn => {
    btn.addEventListener('click', () => filtrarDesdeAfuera(btn.dataset.cat));
  });
}

function trapFocus(container, e) {
  const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let drawerReturnFocus = null;

function renderDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const itemsWrap = document.getElementById('drawerItems');
  const total = document.getElementById('drawerTotal');
  const count = document.getElementById('cartCount');
  const envioBar = document.getElementById('envioBar');
  const envioTexto = document.getElementById('envioTexto');
  const envioProgress = document.getElementById('envioProgress');
  const btnWsp = document.getElementById('btnPedidoWsp');
  if (!drawer || !itemsWrap) return;
  const items = Cart.get();
  drawer.classList.toggle('vacio', items.length === 0);
  if (count) {
    count.textContent = Cart.count();
    count.classList.remove('bump');
    void count.offsetWidth;
    if (!reduceMotion) count.classList.add('bump');
  }
  itemsWrap.innerHTML = items.map((i, idx) => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
    <div class="drawer-item" style="animation-delay:${Math.min(idx * 0.06, 0.4)}s">
      <div class="drawer-item-img"><img src="${p.img}" alt="${esc(p.nombre)}" width="72" height="72" class="${p.contain ? 'contain' : ''}"></div>
      <div class="drawer-item-info">
        <h3>${esc(p.nombre)}</h3>
        ${i.talle ? `<p class="talle">${esc(p.varLabel || 'Talle')}: ${esc(i.talle)}</p>` : ''}
        <p class="precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>
      <div class="drawer-item-side">
        <div class="qty">
          <button type="button" data-dstep="-1" data-id="${p.id}" data-talle="${esc(i.talle ?? '')}" aria-label="Restar cantidad">−</button>
          <output>${i.qty}</output>
          <button type="button" data-dstep="1" data-id="${p.id}" data-talle="${esc(i.talle ?? '')}" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="quitar" data-remove="${p.id}" data-talle="${esc(i.talle ?? '')}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  itemsWrap.querySelectorAll('[data-dstep]').forEach(btn => {
    btn.addEventListener('click', () => {
      const talle = btn.dataset.talle === '' ? null : btn.dataset.talle;
      const it = Cart.get().find(x => x.id === btn.dataset.id && x.talle === talle);
      if (it) Cart.setQty(btn.dataset.id, talle, it.qty + parseInt(btn.dataset.dstep, 10));
    });
  });
  itemsWrap.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const talle = btn.dataset.talle === '' ? null : btn.dataset.talle;
      Cart.remove(btn.dataset.remove, talle);
    });
  });
  const t = Cart.total();
  if (total) total.textContent = formatearPrecio(t);
  if (envioBar && envioTexto && envioProgress) {
    const falta = ENVIO_GRATIS_DESDE - t;
    const pct = Math.min(100, Math.round(t / ENVIO_GRATIS_DESDE * 100));
    envioBar.classList.toggle('logrado', falta <= 0);
    envioTexto.innerHTML = falta > 0
      ? `Te faltan <strong>${formatearPrecio(falta)}</strong> para el <strong>envío gratis</strong> en la zona`
      : `<strong>¡Tenés envío gratis en la zona! 🎉</strong>`;
    envioProgress.style.width = pct + '%';
  }
  if (btnWsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `• ${p.nombre}${i.talle ? ` (${p.varLabel || 'Talle'} ${i.talle})` : ''} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
    }).filter(Boolean).join('\n');
    const msg = `Hola EMMEL, quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(t)}\n¿Me confirmán stock y envío?`;
    btnWsp.href = waLink(msg);
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  drawerReturnFocus = document.activeElement;
  drawer.classList.add('open');
  drawer.removeAttribute('inert');
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (drawerReturnFocus?.focus) drawerReturnFocus.focus();
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('btnIrCatalogo')?.addEventListener('click', () => {
    cerrarDrawer();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.getElementById('btnFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  const drawer = document.getElementById('cartDrawer');
  document.addEventListener('keydown', e => {
    if (!drawer?.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trapFocus(drawer, e);
  });
  document.addEventListener('cart:updated', renderDrawer);
}

let modalReturnFocus = null;
let modalTalle = null;
let modalQty = 1;

function getVistos() {
  try { return JSON.parse(localStorage.getItem('emmel_vistos')) || []; } catch { return []; }
}

function pushVisto(id) {
  const vistos = getVistos().filter(v => v !== id);
  vistos.unshift(id);
  localStorage.setItem('emmel_vistos', JSON.stringify(vistos.slice(0, 8)));
}

function miniCardHtml(p) {
  return `
  <button type="button" class="mini-card" data-mini="${p.id}">
    <div class="mini-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="200" height="200" loading="lazy" class="${p.contain ? 'contain' : ''}"></div>
    <p>${esc(p.nombre)}</p>
    <span>${formatearPrecio(precioFinal(p))}</span>
  </button>`;
}

function abrirModal(id, qtyInicial = 1, comprarDirecto = false) {
  const p = getProducto(id);
  const modal = document.getElementById('modalProducto');
  const bd = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  if (!p || !modal || !bd || !body) return;
  const cat = getCategoria(p.cat);
  modalTalle = p.talles?.length ? p.talles[0] : null;
  modalQty = qtyInicial;
  const vistosPrevios = getVistos().filter(v => v !== id).map(getProducto).filter(Boolean);
  pushVisto(id);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  body.innerHTML = `
  <div class="modal-grid">
    <div class="modal-media">
      ${badgeHtml(p)}
      <img src="${p.img}" alt="${esc(p.nombre)}" width="800" height="800" class="${p.contain ? 'contain' : ''}">
    </div>
    <div class="modal-info">
      <p class="card-cat">${esc(cat?.nombre || '')}</p>
      <h2>${esc(p.nombre)}</h2>
      <div class="modal-precio">${precioHtml(p)}</div>
      <p class="modal-desc">${esc(p.desc)}</p>
      ${p.talles?.length ? `
      <div class="variantes">
        <h3>${esc(p.varLabel || 'Talle')}</h3>
        <div class="variantes-chips" id="modalTalles">
          ${p.talles.map((t, i) => `<button type="button" data-talle="${esc(t)}" class="${i === 0 ? 'activo' : ''}">${esc(t)}</button>`).join('')}
        </div>
      </div>` : ''}
      <div class="modal-acciones">
        <div class="qty" id="modalQtyBox">
          <button type="button" data-mstep="-1" aria-label="Restar cantidad">−</button>
          <output aria-live="polite">${modalQty}</output>
          <button type="button" data-mstep="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add" id="modalAdd">Agregar al carrito</button>
        <button type="button" class="btn-buy modal-buy" id="modalBuy">Comprar ahora</button>
      </div>
    </div>
  </div>
  ${relacionados.length ? `
  <div class="relacionados">
    <h3>También te puede interesar</h3>
    <div class="relacionados-grid">${relacionados.map(miniCardHtml).join('')}</div>
  </div>` : ''}
  ${vistosPrevios.length ? `
  <div class="vistos">
    <h3>Vistos recientemente</h3>
    <div class="vistos-strip">${vistosPrevios.map(miniCardHtml).join('')}</div>
  </div>` : ''}`;
  body.querySelectorAll('#modalTalles [data-talle]').forEach(btn => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('#modalTalles button').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      modalTalle = btn.dataset.talle;
    });
  });
  body.querySelectorAll('[data-mstep]').forEach(btn => {
    btn.addEventListener('click', () => {
      modalQty = Math.max(1, Math.min(modalQty + parseInt(btn.dataset.mstep, 10), 99));
      body.querySelector('#modalQtyBox output').textContent = modalQty;
    });
  });
  body.querySelector('#modalAdd')?.addEventListener('click', () => {
    Cart.add(p, modalTalle, modalQty);
    showToast('¡Agregado! Tu carrito te espera.');
    cerrarModal();
  });
  body.querySelector('#modalBuy')?.addEventListener('click', () => {
    Cart.add(p, modalTalle, modalQty);
    cerrarModal();
    abrirDrawer();
  });
  body.querySelectorAll('[data-mini]').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.mini));
  });
  if (!modal.classList.contains('open')) {
    modalReturnFocus = document.activeElement;
    modal.classList.add('open');
    modal.removeAttribute('inert');
    bd.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  modal.scrollTop = 0;
  document.getElementById('modalClose')?.focus();
  if (comprarDirecto) body.querySelector('#modalBuy')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || !bd) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (modalReturnFocus?.focus) modalReturnFocus.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  const modal = document.getElementById('modalProducto');
  document.addEventListener('keydown', e => {
    if (!modal?.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trapFocus(modal, e);
  });
  const params = new URLSearchParams(location.search);
  const slug = params.get('producto');
  if (slug && getProducto(slug)) abrirModal(slug);
}

document.addEventListener('DOMContentLoaded', () => {
  renderDestacados();
  renderChips();
  renderCatalogo();
  initFiltros();
  initRail();
  initNav();
  initDrawer();
  initModal();
  initWspFloat();
  initHero();
  initScrollFx();
  initReveals();
  renderDrawer();
});
