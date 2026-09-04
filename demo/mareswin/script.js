const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491161248274';

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TALLES = ['XS', 'S', 'M', 'L', 'XL'];

const CATEGORIAS = [
  { id: 'bikinis', nombre: 'Bikinis', img: 'images/prod-estampa-coral-1200x1500.webp' },
  { id: 'enterizas', nombre: 'Enterizas', img: 'images/prod-enteriza-azul-1200x1500.webp' },
  { id: 'tiro-alto', nombre: 'Tiro alto', img: 'images/prod-tiro-alto-1200x1500.webp' },
  { id: 'bandeau', nombre: 'Bandeau', img: 'images/prod-animal-print-1200x1500.webp' },
];

const IMGS = {
  coral: 'images/prod-estampa-coral-1200x1500.webp',
  lisos: 'images/prod-lisos-duo-1200x1500.webp',
  animal: 'images/prod-animal-print-1200x1500.webp',
  tiroAlto: 'images/prod-tiro-alto-1200x1500.webp',
  azul: 'images/prod-enteriza-azul-1200x1500.webp',
  blanca: 'images/prod-enteriza-blanca-1200x1500.webp',
  negra: 'images/prod-enteriza-negra-1200x1500.webp',
};

const PRODUCTOS = [
  { id: 'bk-coral', nombre: 'Bikini Coral', cat: 'bikinis', estampa: 'estampada', precio: 34500, descuento: 0, img: IMGS.coral, nuevo: true, destacado: true, alt: 'Bikini triangulita con estampa multicolor', desc: 'Triangulita con tiras regulables y bombacha colaless. Lycra doble con protección UV, se seca rápido y no transparenta mojada.', talles: { XS: 3, S: 5, M: 6, L: 4, XL: 2 } },
  { id: 'en-bahia', nombre: 'Enteriza Bahía', cat: 'enterizas', estampa: 'lisa', precio: 47000, descuento: 0, img: IMGS.azul, nuevo: false, destacado: true, alt: 'Malla enteriza azul de espalda cruzada', desc: 'Enteriza deportiva de espalda cruzada, pensada para nadar de verdad. Tela con lycra alta y forro completo adelante.', talles: { XS: 3, S: 4, M: 5, L: 4, XL: 3 } },
  { id: 'bk-marea', nombre: 'Bikini Marea', cat: 'bikinis', estampa: 'lisa', precio: 32000, descuento: 0, img: IMGS.lisos, nuevo: false, destacado: true, alt: 'Bikini liso naranja de corte clásico', desc: 'Liso de corte clásico, con frunce en la bombacha que acompaña la cadera. El básico que se combina con todo.', talles: { XS: 4, S: 6, M: 7, L: 5, XL: 3 } },
  { id: 'ta-orilla', nombre: 'Tiro Alto Orilla', cat: 'tiro-alto', estampa: 'lisa', precio: 38000, descuento: 0, img: IMGS.tiroAlto, nuevo: true, destacado: true, alt: 'Conjunto de tiro alto en rosa pastel', desc: 'Conjunto de top corto y bombacha de tiro alto en rosa pastel. Cobertura completa, sin que se te vaya nada.', talles: { XS: 3, S: 5, M: 6, L: 4, XL: 3 } },
  { id: 'bn-cebra', nombre: 'Bandeau Cebra', cat: 'bandeau', estampa: 'animal', precio: 33500, descuento: 0, img: IMGS.animal, nuevo: true, destacado: true, alt: 'Bandeau con estampa cebra y bombacha tiro alto', desc: 'Bandeau con elástico interno y varilla al centro para que no se corra. Se puede usar con o sin tiras.', talles: { XS: 3, S: 5, M: 5, L: 4, XL: 2 } },
  { id: 'en-espuma', nombre: 'Enteriza Espuma', cat: 'enterizas', estampa: 'lisa', precio: 49500, descuento: 0, img: IMGS.blanca, nuevo: true, destacado: true, alt: 'Malla enteriza blanca con escote en V', desc: 'Enteriza blanca con escote en V y forro doble para que no transparente. Espalda descubierta con tiras cruzadas.', talles: { XS: 2, S: 4, M: 5, L: 3, XL: 1 } },
  { id: 'en-noche', nombre: 'Enteriza Noche', cat: 'enterizas', estampa: 'lisa', precio: 45000, descuento: 0, img: IMGS.negra, nuevo: false, destacado: true, alt: 'Malla enteriza negra de breteles finos', desc: 'La negra clásica, breteles finos regulables y espalda baja. La que sirve para todo y nunca sobra en el bolso.', talles: { XS: 4, S: 6, M: 7, L: 5, XL: 4 } },
  { id: 'bk-arrecife', nombre: 'Bikini Arrecife', cat: 'bikinis', estampa: 'estampada', precio: 36500, descuento: 15, img: IMGS.coral, nuevo: false, destacado: true, alt: 'Bikini estampado con corpiño triangular', desc: 'Corpiño triangular con copa removible y bombacha tiro medio. La estampa va impresa por sublimación: no se despinta con el cloro.', talles: { XS: 2, S: 4, M: 5, L: 3, XL: 0 } },
  { id: 'en-delta', nombre: 'Enteriza Delta', cat: 'enterizas', estampa: 'lisa', precio: 52000, descuento: 0, img: IMGS.azul, nuevo: true, destacado: false, alt: 'Malla enteriza azul con escote deportivo', desc: 'Escote alto y breteles anchos: la que elegís cuando querés moverte sin acomodarte nada.', talles: { XS: 2, S: 3, M: 4, L: 3, XL: 2 } },
  { id: 'bk-laguna', nombre: 'Bikini Laguna', cat: 'bikinis', estampa: 'lisa', precio: 33000, descuento: 0, img: IMGS.lisos, nuevo: true, destacado: false, alt: 'Bikini liso fucsia con bombacha alta', desc: 'Corpiño con nudo al frente y bombacha de tiro medio-alto. Tela lisa mate, sin brillo.', talles: { XS: 3, S: 4, M: 4, L: 4, XL: 2 } },
  { id: 'ta-brisa', nombre: 'Tiro Alto Brisa', cat: 'tiro-alto', estampa: 'lisa', precio: 39500, descuento: 0, img: IMGS.tiroAlto, nuevo: false, destacado: false, alt: 'Conjunto de tiro alto en blanco', desc: 'Top con banda inferior ancha y bombacha tiro alto. La banda no se enrolla al mover los brazos.', talles: { XS: 2, S: 4, M: 5, L: 4, XL: 2 } },
  { id: 'bn-duna', nombre: 'Bandeau Duna', cat: 'bandeau', estampa: 'animal', precio: 34000, descuento: 0, img: IMGS.animal, nuevo: false, destacado: false, alt: 'Bandeau animal print en tonos tierra', desc: 'Animal print en tonos tierra, con bombacha de tiro alto y cobertura completa atrás.', talles: { XS: 2, S: 3, M: 4, L: 4, XL: 3 } },
  { id: 'en-perla', nombre: 'Enteriza Perla', cat: 'enterizas', estampa: 'lisa', precio: 51000, descuento: 15, img: IMGS.blanca, nuevo: false, destacado: false, alt: 'Malla enteriza clara con detalle en el escote', desc: 'Base clara con frunce lateral que estiliza. Forro completo y copa removible.', talles: { XS: 1, S: 3, M: 4, L: 3, XL: 2 } },
  { id: 'en-faro', nombre: 'Enteriza Faro', cat: 'enterizas', estampa: 'lisa', precio: 46500, descuento: 0, img: IMGS.negra, nuevo: false, destacado: false, alt: 'Malla enteriza negra con escote cuadrado', desc: 'Escote cuadrado y breteles anchos. Corte que favorece y aguanta el uso diario en la pileta.', talles: { XS: 2, S: 4, M: 5, L: 4, XL: 3 } },
  { id: 'bk-caracola', nombre: 'Bikini Caracola', cat: 'bikinis', estampa: 'estampada', precio: 35500, descuento: 0, img: IMGS.coral, nuevo: false, destacado: false, alt: 'Bikini con estampa de flores en tonos cálidos', desc: 'Estampa floral sobre base clara, con detalle de argollas en las tiras. Bombacha de cobertura media.', talles: { XS: 2, S: 3, M: 5, L: 3, XL: 1 } },
  { id: 'bn-sal', nombre: 'Bandeau Sal', cat: 'bandeau', estampa: 'lisa', precio: 31000, descuento: 0, img: IMGS.lisos, nuevo: false, destacado: true, alt: 'Bandeau liso de color sólido', desc: 'Bandeau liso, sin tiras, con frunce al centro. El que menos marca al broncearse.', talles: { XS: 4, S: 5, M: 6, L: 3, XL: 2 } },
  { id: 'ta-cala', nombre: 'Tiro Alto Cala', cat: 'tiro-alto', estampa: 'lisa', precio: 37000, descuento: 10, img: IMGS.tiroAlto, nuevo: false, destacado: false, alt: 'Conjunto de tiro alto en tono claro', desc: 'Tiro alto de corte alto en la pierna. Ideal si buscás cobertura pero no querés una enteriza.', talles: { XS: 1, S: 3, M: 4, L: 3, XL: 2 } },
  { id: 'bk-nautica', nombre: 'Bikini Náutica', cat: 'bikinis', estampa: 'estampada', precio: 37500, descuento: 20, img: IMGS.coral, nuevo: false, destacado: true, alt: 'Bikini con estampa geométrica en varios colores', desc: 'Estampa geométrica y corpiño con aro liviano que sostiene sin marcar. Última temporada de esta estampa.', talles: { XS: 1, S: 3, M: 4, L: 2, XL: 0 } },
  { id: 'bn-boya', nombre: 'Bandeau Boya', cat: 'bandeau', estampa: 'lisa', precio: 32500, descuento: 10, img: IMGS.lisos, nuevo: false, destacado: false, alt: 'Bandeau liso con bombacha a juego', desc: 'Conjunto bandeau liso con bombacha clásica. Tela con buen recupero: no se afloja después del primer uso.', talles: { XS: 2, S: 4, M: 5, L: 3, XL: 1 } },
  { id: 'ta-reflejo', nombre: 'Tiro Alto Reflejo', cat: 'tiro-alto', estampa: 'lisa', precio: 40500, descuento: 0, img: IMGS.tiroAlto, nuevo: false, destacado: false, alt: 'Conjunto de tiro alto con top deportivo', desc: 'Top tipo deportivo con buen sostén y bombacha alta. La que eligen las que hacen aquagym.', talles: { XS: 2, S: 3, M: 5, L: 4, XL: 3 } },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const stockTalle = (p, t) => (p?.talles?.[t] ?? 0);
const primerTalle = p => TALLES.find(t => stockTalle(p, t) > 0) || null;
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

const Cart = {
  KEY: 'mareswin_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    if (!producto || !talle) return;
    const tope = stockTalle(producto, talle);
    if (tope <= 0) return;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, stockTalle(p, talle) || 1));
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

function cardHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const talle = opts.talle && stockTalle(p, opts.talle) > 0 ? opts.talle : primerTalle(p);
  const hayStock = !!talle;
  const badges = [
    p.nuevo ? '<span class="badge badge-nuevo">Nuevo</span>' : '',
    p.descuento > 0 ? `<span class="badge badge-off">-${p.descuento}%</span>` : '',
  ].join('');
  const disponibles = TALLES.filter(t => stockTalle(p, t) > 0);
  const tag = opts.tag || 'li';
  const anim = opts.animar === false ? '' : ' data-animate style="transform:translateY(26px) scale(.96);opacity:0"';
  return `<${tag} class="prod-card"${anim}>
    <div class="prod-top">
      <img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1500">
      <span class="prod-badges">${badges}</span>
      <button type="button" class="prod-open" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><span class="prod-ver">Ver detalle</span></button>
    </div>
    <div class="prod-info">
      <span class="prod-cat">${esc(nombreCat(p.cat))}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <div class="prod-precios">
        <span class="prod-precio">${formatearPrecio(fin)}</span>
        ${p.descuento > 0 ? `<s class="prod-precio-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <span class="prod-talles">${disponibles.length ? 'Talles ' + disponibles.join(' · ') : 'Sin stock por ahora'}</span>
      <div class="prod-actions">
        ${hayStock ? `<div class="stepper" data-stepper="${esc(p.id)}">
          <button type="button" data-step="-1" aria-label="Restar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}" data-talle="${esc(talle)}">Agregar</button>`
      : '<span class="prod-sin">Reponemos pronto</span>'}
      </div>
    </div>
  </${tag}>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!cont) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (!revealsListos) return;
  nuevos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<li data-animate style="transform:translateY(24px) scale(.96);opacity:0">
      <a class="cat-card" href="#tienda" data-cat-link="${esc(c.id)}">
        <img src="${esc(c.img)}" alt="Categoría ${esc(c.nombre)}" width="1200" height="1500">
        <span class="cat-card-txt">
          <span class="cat-card-nombre">${esc(c.nombre)}</span>
          <span class="cat-card-n">${n} modelos</span>
        </span>
      </a>
    </li>`;
  }).join('');
  grid.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
    aplicarFiltroCategoria(a.dataset.catLink);
  }));
}

function initRailRender() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p)).join('');
}

let filtroCat = 'todo';
let filtroTalle = 'todo';
let visibles = 16;

function productosFiltrados(cat = filtroCat, talle = filtroTalle, texto = null) {
  const q = normalizar(texto ?? document.getElementById('buscar')?.value ?? '').trim();
  return PRODUCTOS.filter(p => {
    if (cat !== 'todo' && p.cat !== cat) return false;
    if (talle !== 'todo' && stockTalle(p, talle) <= 0) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, nombreCat(p.cat), p.estampa, p.desc].join(' '));
    return q.split(/\s+/).every(w => heno.includes(w));
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('catalogoVacio');
  const verMas = document.getElementById('verMas');
  const conteo = document.getElementById('tiendaConteo');
  const titulo = document.getElementById('tiendaTitulo');
  if (!grid) return;
  const lista = productosFiltrados();
  grid.innerHTML = lista.slice(0, visibles).map(p => cardHTML(p, { talle: filtroTalle !== 'todo' ? filtroTalle : null })).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  if (verMas) verMas.hidden = lista.length <= visibles;
  if (conteo) conteo.textContent = lista.length === 1 ? '1 modelo' : `${lista.length} modelos`;
  if (titulo) titulo.textContent = filtroCat === 'todo' ? 'Mallas y bikinis' : nombreCat(filtroCat);
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function pintarFiltros() {
  document.querySelectorAll('#filtroCat .fchip').forEach(b => {
    const on = b.dataset.cat === filtroCat;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  document.querySelectorAll('#filtroTalle .fchip').forEach(b => {
    const on = b.dataset.talle === filtroTalle;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function aplicarFiltroCategoria(cat) {
  filtroCat = cat;
  visibles = 16;
  pintarFiltros();
  renderCatalogo();
}

function initCatalogo() {
  const fc = document.getElementById('filtroCat');
  const ft = document.getElementById('filtroTalle');
  if (fc) {
    fc.innerHTML = [{ id: 'todo', nombre: 'Todo' }, ...CATEGORIAS].map(c =>
      `<button type="button" class="fchip${c.id === 'todo' ? ' is-on' : ''}" data-cat="${esc(c.id)}" aria-pressed="${c.id === 'todo'}">${esc(c.nombre)}</button>`).join('');
    fc.addEventListener('click', e => {
      const b = e.target.closest('.fchip');
      if (!b) return;
      filtroCat = b.dataset.cat; visibles = 16; pintarFiltros(); renderCatalogo();
    });
  }
  if (ft) {
    ft.innerHTML = ['todo', ...TALLES].map(t =>
      `<button type="button" class="fchip${t === 'todo' ? ' is-on' : ''}" data-talle="${esc(t)}" aria-pressed="${t === 'todo'}">${t === 'todo' ? 'Todos los talles' : t}</button>`).join('');
    ft.addEventListener('click', e => {
      const b = e.target.closest('.fchip');
      if (!b) return;
      filtroTalle = b.dataset.talle; visibles = 16; pintarFiltros(); renderCatalogo();
    });
  }
  document.getElementById('buscar')?.addEventListener('input', () => { visibles = 16; renderCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { visibles += 16; renderCatalogo(); });
  const limpiar = () => {
    filtroCat = 'todo'; filtroTalle = 'todo'; visibles = 16;
    const b = document.getElementById('buscar'); if (b) b.value = '';
    pintarFiltros(); renderCatalogo();
  };
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);
  renderCatalogo();
}

let probCorte = 'bikinis';
let probEstampa = 'estampada';
let probTalle = 'M';

function rankearProbador(corte, estampa, talle, cuantos = 3) {
  return PRODUCTOS.map(p => {
    let score = 0;
    if (p.cat === corte) score += 3;
    if (p.estampa === estampa) score += 2;
    if (stockTalle(p, talle) > 0) score += 2;
    if (p.destacado) score += 0.4;
    return { p, score };
  }).sort((a, b) => b.score - a.score).slice(0, cuantos);
}

function renderProbador() {
  const lista = document.getElementById('perchoLista');
  const razon = document.getElementById('perchoRazon');
  if (!lista) return;
  const ranking = rankearProbador(probCorte, probEstampa, probTalle);

  const nombreEstampa = { lisa: 'lisa', estampada: 'estampada', animal: 'animal print' }[probEstampa] || probEstampa;
  if (razon) razon.textContent = `${nombreCat(probCorte)} · ${nombreEstampa} · talle ${probTalle}`;

  lista.innerHTML = ranking.map(({ p }) =>
    `<li class="percha">${cardHTML(p, { talle: probTalle, tag: 'div', animar: false })}</li>`).join('');
}

function initProbador() {
  const setChips = (wrap, attr, cb) => {
    const cont = document.getElementById(wrap);
    if (!cont) return;
    cont.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      cont.querySelectorAll('.chip').forEach(c => {
        const on = c === b;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cb(b.dataset[attr]);
      renderProbador();
    });
  };
  setChips('chipsCorte', 'corte', v => { probCorte = v; });
  setChips('chipsEstampa', 'estampa', v => { probEstampa = v; });
  setChips('chipsTalle', 'talle', v => { probTalle = v; });

  document.getElementById('probadorVerTodo')?.addEventListener('click', () => {
    filtroCat = probCorte;
    filtroTalle = probTalle;
    visibles = 16;
    const b = document.getElementById('buscar'); if (b) b.value = '';
    pintarFiltros();
    renderCatalogo();
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  renderProbador();
}

let modalTalle = null;
let ultimoFoco = null;

function trapFoco(cont, e) {
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function abrirModal(id) {
  const p = getProducto(id);
  const bd = document.getElementById('modalBackdrop');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!p || !bd || !cuerpo) return;
  ultimoFoco = document.activeElement;
  modalTalle = primerTalle(p);
  const fin = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cuerpo.innerHTML = `<div class="modal-grid">
    <div class="modal-media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1500"></div>
    <div class="modal-info">
      <p class="modal-cat">${esc(nombreCat(p.cat))}</p>
      <h3>${esc(p.nombre)}</h3>
      <div class="modal-precios">
        <span class="modal-precio">${formatearPrecio(fin)}</span>
        ${p.descuento > 0 ? `<s class="prod-precio-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-talles">
        <p class="modal-talles-tit">Elegí tu talle</p>
        <div class="talle-chips" id="modalTalles" role="group" aria-label="Talles disponibles">
          ${TALLES.map(t => {
            const s = stockTalle(p, t);
            return `<button type="button" class="tchip${t === modalTalle ? ' is-on' : ''}" data-t="${t}"${s > 0 ? '' : ' disabled'} aria-pressed="${t === modalTalle}">${t}</button>`;
          }).join('')}
        </div>
      </div>
      <div class="modal-acciones">
        <button type="button" class="btn btn-line" id="modalAdd"${modalTalle ? '' : ' disabled'}>Agregar al carrito</button>
        <button type="button" class="btn btn-cta" id="modalBuy"${modalTalle ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="modal-relacionados">
        <p class="modal-rel-tit">También te puede interesar</p>
        <div class="modal-rel-grid">
          ${rel.map(r => `<button type="button" class="rel-card" data-ver="${esc(r.id)}">
            <img src="${esc(r.img)}" alt="${esc(r.alt)}" width="1200" height="1500">
            <span>${esc(r.nombre)}</span>
          </button>`).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>`;
  const tit = document.getElementById('modalTitulo');
  if (tit) tit.textContent = p.nombre;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();

  cuerpo.querySelector('#modalTalles')?.addEventListener('click', e => {
    const b = e.target.closest('.tchip');
    if (!b || b.disabled) return;
    modalTalle = b.dataset.t;
    cuerpo.querySelectorAll('.tchip').forEach(c => {
      const on = c === b;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
  cuerpo.querySelector('#modalAdd')?.addEventListener('click', () => {
    Cart.add(p, modalTalle);
    showToast(`¡Agregado! ${p.nombre}, talle ${modalTalle}`);
  });
  cuerpo.querySelector('#modalBuy')?.addEventListener('click', () => {
    Cart.add(p, modalTalle);
    cerrarModal();
    abrirDrawer();
  });
}

function cerrarModal() {
  const bd = document.getElementById('modalBackdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  if (document.getElementById('cartDrawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <p class="drawer-vacio-tit">Todavía no elegiste nada</p>
      <p>Tu carrito está más vacío que la pileta en julio.</p>
      <button type="button" class="btn btn-cta" id="drawerVerTienda">Ver la tienda</button>
    </div>`;
    if (foot) foot.hidden = true;
    body.querySelector('#drawerVerTienda')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<article class="ci">
      <div class="ci-media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1500"></div>
      <div>
        <p class="ci-nombre">${esc(p.nombre)}</p>
        <p class="ci-talle">Talle ${esc(i.talle)}</p>
        <p class="ci-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>
      <div class="ci-acc">
        <div class="stepper">
          <button type="button" data-ci="-1" data-id="${esc(i.id)}" data-talle="${esc(i.talle)}" aria-label="Restar uno">−</button>
          <span>${i.qty}</span>
          <button type="button" data-ci="1" data-id="${esc(i.id)}" data-talle="${esc(i.talle)}" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="ci-del" data-del="${esc(i.id)}" data-talle="${esc(i.talle)}">Quitar</button>
      </div>
    </article>`;
  }).join('');
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${p.nombre} (talle ${i.talle}) x${i.qty}` : '';
    }).filter(Boolean);
    const msg = `Hola MARE SWIN, quiero pedir:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
}

function abrirDrawer() {
  const bd = document.getElementById('drawerBackdrop');
  const dr = document.getElementById('cartDrawer');
  if (!dr || !bd) return;
  ultimoFoco = document.activeElement;
  renderDrawer();
  bd.hidden = false; dr.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const bd = document.getElementById('drawerBackdrop');
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  bd.hidden = true; dr.hidden = true;
  if (document.getElementById('modalBackdrop')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initTienda() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver && !document.getElementById('railVp')?.classList.contains('dragging')) { abrirModal(ver.dataset.ver); return; }

    const step = e.target.closest('[data-step]');
    if (step) {
      const wrap = step.closest('.stepper');
      const span = wrap?.querySelector('[data-qty]');
      if (span) {
        const val = Math.max(1, Math.min(20, parseInt(span.textContent, 10) + parseInt(step.dataset.step, 10)));
        span.textContent = val;
      }
      return;
    }

    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const talle = add.dataset.talle;
      const qty = parseInt(add.closest('.prod-actions')?.querySelector('[data-qty]')?.textContent || '1', 10);
      Cart.add(p, talle, qty);
      showToast(`¡Agregado! ${p?.nombre || ''}, talle ${talle}`);
      return;
    }

    const ci = e.target.closest('[data-ci]');
    if (ci) {
      const items = Cart.get();
      const it = items.find(i => i.id === ci.dataset.id && i.talle === ci.dataset.talle);
      if (it) Cart.setQty(ci.dataset.id, ci.dataset.talle, it.qty + parseInt(ci.dataset.ci, 10));
      return;
    }

    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del, del.dataset.talle); }
  });

  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', e => { if (e.target.id === 'modalBackdrop') cerrarModal(); });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modalBackdrop')?.hidden === false) { cerrarModal(); return; }
      if (document.getElementById('cartDrawer')?.hidden === false) cerrarDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('modalBackdrop');
    const drawer = document.getElementById('cartDrawer');
    if (modal && !modal.hidden) trapFoco(modal, e);
    else if (drawer && !drawer.hidden) trapFoco(drawer, e);
  });

  document.addEventListener('cart:updated', () => { updateCartBadge(); renderDrawer(); });
  updateCartBadge();
}

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');

  let down = false, startX = 0, startLeft = 0, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) setTimeout(() => vp.classList.remove('dragging'), 40);
    else vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  const paso = () => {
    const card = vp.querySelector('.prod-card');
    if (!card) return vp.clientWidth * 0.8;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card.getBoundingClientRect().width + gap;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function initReveals() {
  revealsListos = true;
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initCategorias();
initRailRender();
initCatalogo();
initProbador();
initReveals();
initTienda();
initRail();
initNav();
initFloats();
initLeeScroll();
initFeedbackFloat();
initAnio();

if (typeof globalThis !== 'undefined' && globalThis.__GKY_TEST__) {
  globalThis.__GKY_API__ = {
    PRODUCTOS, CATEGORIAS, TALLES, Cart, precioFinal, normalizar, stockTalle, primerTalle,
    productosFiltrados, rankearProbador, formatearPrecio,
  };
}
