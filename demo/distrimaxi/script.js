document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493543537149';

const CATEGORIAS = [
  { id: 'gaseosas', nombre: 'Gaseosas y refrescos', bajada: 'Colas, lima-limón, naranja y pomelo', img: 'images/gaseosas-y-refrescos_1254x1254.webp' },
  { id: 'cervezas', nombre: 'Cervezas', bajada: 'Rubias, IPA, negras y sin alcohol', img: 'images/cervezas_1254x1254.webp' },
  { id: 'aguas', nombre: 'Aguas y sodas', bajada: 'Con gas, sin gas, saborizadas y sifón', img: 'images/agua-mineral_1254x1254.webp' },
  { id: 'energizantes', nombre: 'Energizantes e isotónicas', bajada: 'Latas de 250 y 473 y bebidas deportivas', img: 'images/bebidas-energizantes_1254x1254.webp' },
  { id: 'jugos', nombre: 'Jugos y frutales', bajada: 'Exprimidos, néctares y multifruta', img: 'images/jugos-y-bebidas-frutales_1254x1254.webp' },
  { id: 'vinos', nombre: 'Vinos y aperitivos', bajada: 'Tintos, blancos, rosados y fernet', img: 'images/vinos_1254x1254.webp' }
];

const IMG = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.img]));

const PRODUCTOS = [
  { id: 'gas-01', nombre: 'Gaseosa cola 2,25 L descartable', cat: 'gaseosas', envase: 'Descartable', formato: '2,25 L', unidadesPorBulto: 6, precioBulto: 15600, precioUnidad: 2990, descuento: 0, stockBultos: 48, destacado: true, desc: 'La cola de 2,25 litros que se lleva la mitad del mostrador. Bulto cerrado de 6 botellas, la medida que más rota en kioscos y rotiserías.', tags: ['cola', 'pet', 'familiar'] },
  { id: 'gas-02', nombre: 'Gaseosa cola 1,5 L retornable', cat: 'gaseosas', envase: 'Retornable', formato: '1,5 L', unidadesPorBulto: 8, precioBulto: 13900, precioUnidad: 2150, descuento: 0, stockBultos: 36, destacado: false, desc: 'Envase retornable de vidrio: te retiramos el casco vacío en la entrega siguiente sin cargo administrativo.', tags: ['cola', 'casco', 'vidrio'] },
  { id: 'gas-03', nombre: 'Gaseosa lima-limón 2,25 L', cat: 'gaseosas', envase: 'Descartable', formato: '2,25 L', unidadesPorBulto: 6, precioBulto: 14800, precioUnidad: 2850, descuento: 8, stockBultos: 30, destacado: false, desc: 'Lima-limón clásica en formato familiar. Acompaña bien la venta de fernet y aperitivos.', tags: ['lima', 'limon', 'familiar'] },
  { id: 'gas-04', nombre: 'Gaseosa naranja 2,25 L', cat: 'gaseosas', envase: 'Descartable', formato: '2,25 L', unidadesPorBulto: 6, precioBulto: 14800, precioUnidad: 2850, descuento: 0, stockBultos: 28, destacado: false, desc: 'Naranja bien dulce, la que más piden las familias los fines de semana.', tags: ['naranja', 'familiar'] },
  { id: 'gas-05', nombre: 'Gaseosa cola lata 354 ml', cat: 'gaseosas', envase: 'Lata', formato: '354 ml', unidadesPorBulto: 24, precioBulto: 22900, precioUnidad: 1190, descuento: 0, stockBultos: 52, destacado: true, desc: 'Bulto de 24 latas frías. El formato de heladera de mostrador, con la mejor rotación por metro cuadrado.', tags: ['lata', 'cola', 'individual'] },
  { id: 'gas-06', nombre: 'Gaseosa pomelo 1,5 L', cat: 'gaseosas', envase: 'Descartable', formato: '1,5 L', unidadesPorBulto: 8, precioBulto: 13200, precioUnidad: 2050, descuento: 0, stockBultos: 24, destacado: false, desc: 'Pomelo rosado en 1,5 litros, el clásico de barra para cortar aperitivos.', tags: ['pomelo', 'aperitivo'] },

  { id: 'cer-01', nombre: 'Cerveza rubia lager 1 L retornable', cat: 'cervezas', envase: 'Retornable', formato: '1 L', unidadesPorBulto: 12, precioBulto: 28800, precioUnidad: 2690, descuento: 0, stockBultos: 60, destacado: true, desc: 'El litro de rubia lager en cajón retornable de 12. La bebida que más sale del depósito, semana tras semana.', tags: ['rubia', 'lager', 'litro', 'casco'] },
  { id: 'cer-02', nombre: 'Cerveza rubia lata 473 ml', cat: 'cervezas', envase: 'Lata', formato: '473 ml', unidadesPorBulto: 24, precioBulto: 33600, precioUnidad: 1590, descuento: 5, stockBultos: 44, destacado: true, desc: 'Lata alta de 473 en bulto de 24. Entra fría a la cámara y sale fría al camión.', tags: ['rubia', 'lata', 'alta'] },
  { id: 'cer-03', nombre: 'Cerveza IPA 500 ml vidrio', cat: 'cervezas', envase: 'Vidrio', formato: '500 ml', unidadesPorBulto: 12, precioBulto: 38400, precioUnidad: 3590, descuento: 0, stockBultos: 20, destacado: false, desc: 'IPA de perfil lupulado para bares y cervecerías que quieren salir de la rubia estándar.', tags: ['ipa', 'artesanal', 'lupulo'] },
  { id: 'cer-04', nombre: 'Cerveza negra stout 500 ml', cat: 'cervezas', envase: 'Vidrio', formato: '500 ml', unidadesPorBulto: 12, precioBulto: 37200, precioUnidad: 3490, descuento: 0, stockBultos: 18, destacado: false, desc: 'Stout de cuerpo tostado. Rota fuerte de mayo a agosto en la zona de sierras.', tags: ['negra', 'stout', 'invierno'] },
  { id: 'cer-05', nombre: 'Cerveza rubia porrón 340 ml', cat: 'cervezas', envase: 'Vidrio', formato: '340 ml', unidadesPorBulto: 24, precioBulto: 31200, precioUnidad: 1490, descuento: 0, stockBultos: 38, destacado: false, desc: 'El porrón de 340 en bulto de 24, formato de barra y de after office.', tags: ['porron', 'rubia', 'bar'] },
  { id: 'cer-06', nombre: 'Cerveza sin alcohol lata 473 ml', cat: 'cervezas', envase: 'Lata', formato: '473 ml', unidadesPorBulto: 24, precioBulto: 29900, precioUnidad: 1390, descuento: 0, stockBultos: 22, destacado: false, desc: 'Sin alcohol, para la mesa que maneja. Cada vez más pedida en almuerzos de semana.', tags: ['sin alcohol', 'lata'] },

  { id: 'agu-01', nombre: 'Agua mineral sin gas 2 L', cat: 'aguas', envase: 'Descartable', formato: '2 L', unidadesPorBulto: 6, precioBulto: 7800, precioUnidad: 1490, descuento: 0, stockBultos: 70, destacado: true, desc: 'Agua mineral sin gas de 2 litros. El bulto de 6 es la base de cualquier pedido de verano.', tags: ['agua', 'sin gas', 'mineral'] },
  { id: 'agu-02', nombre: 'Agua mineral con gas 2 L', cat: 'aguas', envase: 'Descartable', formato: '2 L', unidadesPorBulto: 6, precioBulto: 8100, precioUnidad: 1550, descuento: 0, stockBultos: 46, destacado: false, desc: 'La misma mineral, con gas. Va junto a la sin gas en casi todos los pedidos de restaurante.', tags: ['agua', 'con gas'] },
  { id: 'agu-03', nombre: 'Agua saborizada 1,5 L', cat: 'aguas', envase: 'Descartable', formato: '1,5 L', unidadesPorBulto: 6, precioBulto: 9600, precioUnidad: 1850, descuento: 10, stockBultos: 34, destacado: false, desc: 'Saborizada de pomelo y manzana. La opción liviana que se lleva el público joven.', tags: ['saborizada', 'liviana'] },
  { id: 'agu-04', nombre: 'Soda sifón 1,5 L retornable', cat: 'aguas', envase: 'Retornable', formato: '1,5 L', unidadesPorBulto: 8, precioBulto: 8800, precioUnidad: 1290, descuento: 0, stockBultos: 40, destacado: false, desc: 'Sifón retornable de toda la vida. Cambio de casco en la misma visita del reparto.', tags: ['soda', 'sifon', 'casco'] },
  { id: 'agu-05', nombre: 'Agua mineral 500 ml', cat: 'aguas', envase: 'Descartable', formato: '500 ml', unidadesPorBulto: 12, precioBulto: 8400, precioUnidad: 850, descuento: 0, stockBultos: 66, destacado: false, desc: 'La botellita de 500 para heladera de mostrador. Bulto de 12, rotación diaria.', tags: ['agua', 'individual', 'chica'] },

  { id: 'ene-01', nombre: 'Energizante lata 250 ml', cat: 'energizantes', envase: 'Lata', formato: '250 ml', unidadesPorBulto: 24, precioBulto: 38400, precioUnidad: 1890, descuento: 0, stockBultos: 32, destacado: true, desc: 'La lata chica de 250 en bulto de 24. Rota fuerte cerca de gimnasios, boliches y estaciones de servicio.', tags: ['energizante', 'lata', 'chica'] },
  { id: 'ene-02', nombre: 'Energizante lata 473 ml', cat: 'energizantes', envase: 'Lata', formato: '473 ml', unidadesPorBulto: 12, precioBulto: 32400, precioUnidad: 3090, descuento: 0, stockBultos: 26, destacado: false, desc: 'Formato grande de energizante, el que se lleva la previa del fin de semana.', tags: ['energizante', 'grande'] },
  { id: 'ene-03', nombre: 'Bebida isotónica 500 ml', cat: 'energizantes', envase: 'Descartable', formato: '500 ml', unidadesPorBulto: 12, precioBulto: 18000, precioUnidad: 1690, descuento: 0, stockBultos: 30, destacado: false, desc: 'Isotónica de reposición para deportistas. Buena salida en la zona de trekking y ciclismo.', tags: ['isotonica', 'deporte'] },
  { id: 'ene-04', nombre: 'Bebida isotónica 1,5 L', cat: 'energizantes', envase: 'Descartable', formato: '1,5 L', unidadesPorBulto: 6, precioBulto: 16200, precioUnidad: 3090, descuento: 0, stockBultos: 18, destacado: false, desc: 'Formato familiar de isotónica, pensado para clubes y torneos de fin de semana.', tags: ['isotonica', 'familiar', 'club'] },
  { id: 'ene-05', nombre: 'Energizante sin azúcar 250 ml', cat: 'energizantes', envase: 'Lata', formato: '250 ml', unidadesPorBulto: 24, precioBulto: 38400, precioUnidad: 1890, descuento: 0, stockBultos: 21, destacado: false, desc: 'La versión sin azúcar del energizante de 250. Se pide cada vez más junto al clásico.', tags: ['energizante', 'sin azucar'] },

  { id: 'jug-01', nombre: 'Jugo de naranja exprimido 1 L', cat: 'jugos', envase: 'Descartable', formato: '1 L', unidadesPorBulto: 6, precioBulto: 12600, precioUnidad: 2390, descuento: 0, stockBultos: 25, destacado: true, desc: 'Exprimido de naranja en botella de litro, con cadena de frío desde el depósito hasta tu heladera.', tags: ['naranja', 'exprimido', 'frio'] },
  { id: 'jug-02', nombre: 'Jugo multifruta 1 L', cat: 'jugos', envase: 'Descartable', formato: '1 L', unidadesPorBulto: 6, precioBulto: 11400, precioUnidad: 2190, descuento: 0, stockBultos: 22, destacado: false, desc: 'Mezcla de frutas para desayunos y meriendas. Buena salida en cafeterías y hospedajes.', tags: ['multifruta', 'desayuno'] },
  { id: 'jug-03', nombre: 'Néctar de durazno 1 L', cat: 'jugos', envase: 'Descartable', formato: '1 L', unidadesPorBulto: 6, precioBulto: 10800, precioUnidad: 2050, descuento: 0, stockBultos: 26, destacado: false, desc: 'Néctar de durazno, el sabor que no falla con chicos. Va siempre con el multifruta.', tags: ['durazno', 'nectar'] },
  { id: 'jug-04', nombre: 'Jugo de manzana 200 ml', cat: 'jugos', envase: 'Descartable', formato: '200 ml', unidadesPorBulto: 24, precioBulto: 16800, precioUnidad: 850, descuento: 0, stockBultos: 30, destacado: false, desc: 'Botellita de 200 para viandas y kioscos escolares. Bulto de 24 unidades.', tags: ['manzana', 'chico', 'escolar'] },

  { id: 'vin-01', nombre: 'Vino tinto malbec 750 ml', cat: 'vinos', envase: 'Vidrio', formato: '750 ml', unidadesPorBulto: 6, precioBulto: 23400, precioUnidad: 4490, descuento: 0, stockBultos: 34, destacado: false, desc: 'Malbec de todos los días en caja de 6. El tinto que más se pide para carta de restaurante.', tags: ['tinto', 'malbec', 'vino'] },
  { id: 'vin-02', nombre: 'Vino blanco chardonnay 750 ml', cat: 'vinos', envase: 'Vidrio', formato: '750 ml', unidadesPorBulto: 6, precioBulto: 21600, precioUnidad: 4150, descuento: 0, stockBultos: 24, destacado: false, desc: 'Blanco fresco para servir frío. Sube fuerte de noviembre a febrero.', tags: ['blanco', 'chardonnay', 'vino'] },
  { id: 'vin-03', nombre: 'Vino rosado 750 ml', cat: 'vinos', envase: 'Vidrio', formato: '750 ml', unidadesPorBulto: 6, precioBulto: 20400, precioUnidad: 3950, descuento: 12, stockBultos: 16, destacado: false, desc: 'Rosado liviano, el que se lleva la mesa de tarde en las sierras.', tags: ['rosado', 'vino', 'verano'] },
  { id: 'vin-04', nombre: 'Fernet 750 ml', cat: 'vinos', envase: 'Vidrio', formato: '750 ml', unidadesPorBulto: 6, precioBulto: 59400, precioUnidad: 10900, descuento: 0, stockBultos: 28, destacado: true, desc: 'En Córdoba no es un aperitivo, es una categoría. Caja de 6 botellas de 750.', tags: ['fernet', 'aperitivo', 'cordoba'] }
].map(p => ({ ...p, img: IMG[p.cat] }));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const MODO_KEY = 'distrimaxi_modo';
let MODO = (() => { try { return localStorage.getItem(MODO_KEY) === 'unidad' ? 'unidad' : 'bulto'; } catch { return 'bulto'; } })();

const precioBase = (p, modo) => (modo === 'unidad' ? p?.precioUnidad : p?.precioBulto) ?? 0;
const precioFinal = (p, modo) => {
  const base = precioBase(p, modo);
  return p?.descuento > 0 ? Math.round(base * (1 - p.descuento / 100)) : base;
};
const maxQty = (p, modo) => (modo === 'unidad' ? 99 : Math.max(1, p?.stockBultos ?? 99));
const etiquetaModo = modo => (modo === 'unidad' ? 'Por unidad' : 'Por bulto');

const Cart = {
  KEY: 'distrimaxi_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, modo, qty = 1) {
    if (!producto) return;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.modo === modo);
    const tope = maxQty(producto, modo);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, modo, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, modo, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.modo === modo);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, maxQty(p, modo)));
    this.save(items);
  },
  remove(id, modo) { this.save(this.get().filter(i => !(i.id === id && i.modo === modo))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p, i.modo) * i.qty : s;
    }, 0);
  }
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

let revealIO = null;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  aplicarStagger(document);
  if (!('IntersectionObserver' in window) || reduceMotion) {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    return;
  }
  revealIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealIO.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => revealIO.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    document.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); revealIO.unobserve(el); }
    });
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function aplicarStagger(root) {
  if (reduceMotion) return;
  root.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.63)}s`;
    });
  });
}

function revealScan(root) {
  if (!root) return;
  aplicarStagger(root);
  const els = [...root.querySelectorAll('[data-animate]:not(.in)')];
  if (!els.length) return;
  if (!revealIO || reduceMotion) { els.forEach(el => el.classList.add('in')); return; }
  els.forEach(el => revealIO.observe(el));
  requestAnimationFrame(() => {
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); revealIO.unobserve(el); }
    });
  });
}

function cardHTML(p, opts = {}) {
  const modo = MODO;
  const precio = precioFinal(p, modo);
  const base = precioBase(p, modo);
  const tieneOff = p.descuento > 0;
  const porUnidadEnBulto = Math.round(precioFinal(p, 'bulto') / p.unidadesPorBulto);
  const sub = modo === 'bulto'
    ? `Bulto x${p.unidadesPorBulto} · ${formatearPrecio(porUnidadEnBulto)} c/u`
    : `Suelto · bulto x${p.unidadesPorBulto} ${formatearPrecio(precioFinal(p, 'bulto'))}`;
  return `
  <article class="card" data-animate style="opacity:0;transform:translateY(26px)" data-id="${esc(p.id)}">
    <button type="button" class="card-media" data-open="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">
      <span class="card-badges">
        <span class="badge badge-env">${esc(p.envase)}</span>
        ${tieneOff ? `<span class="badge badge-off">-${p.descuento}%</span>` : ''}
      </span>
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
    </button>
    <div class="card-body">
      <span class="card-cat">${esc(getCategoria(p.cat)?.nombre || '')}</span>
      <h3 class="card-nom">${esc(p.nombre)}</h3>
      <div class="card-precio">
        <span class="precio-main">${formatearPrecio(precio)}</span>
        ${tieneOff ? `<s class="precio-old">${formatearPrecio(base)}</s>` : ''}
      </div>
      <span class="card-sub">${esc(sub)}</span>
      <div class="card-acc">
        <div class="stepper">
          <button type="button" data-step="-1" data-id="${esc(p.id)}" aria-label="Quitar uno">−</button>
          <span data-qty="${esc(p.id)}">1</span>
          <button type="button" data-step="1" data-id="${esc(p.id)}" aria-label="Agregar uno">+</button>
        </div>
        <button type="button" class="btn-add" data-add="${esc(p.id)}">Agregar<span> al carrito</span></button>
      </div>
      <button type="button" class="btn-buy" data-buy="${esc(p.id)}">Comprar ahora</button>
    </div>
  </article>`;
}

const PASO = 12;
let visibles = PASO;
let filtroCat = 'todos';
let filtroEnvase = 'todos';
let busqueda = '';

function productosFiltrados() {
  const q = normalizar(busqueda).split(/\s+/).filter(Boolean);
  return PRODUCTOS.filter(p => {
    if (filtroCat !== 'todos' && p.cat !== filtroCat) return false;
    if (filtroEnvase !== 'todos' && p.envase !== filtroEnvase) return false;
    if (!q.length) return true;
    const heno = normalizar([p.nombre, p.envase, p.formato, getCategoria(p.cat)?.nombre, ...(p.tags || [])].join(' '));
    return q.every(t => heno.includes(t));
  });
}

function renderDestacados() {
  const grid = document.getElementById('gridDestacados');
  if (!grid) return;
  const dest = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  grid.innerHTML = dest.map((p, i) => cardHTML(p, { eager: i < 4 })).join('');
  revealScan(grid);
}

function renderCatalogo() {
  const grid = document.getElementById('gridCatalogo');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!grid) return;
  const lista = productosFiltrados();
  const slice = lista.slice(0, visibles);
  grid.innerHTML = slice.map(p => cardHTML(p)).join('');
  if (res) res.textContent = `${lista.length} ${lista.length === 1 ? 'referencia' : 'referencias'}`;
  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  if (verMas) verMas.style.display = lista.length > visibles ? '' : 'none';
  revealScan(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderTodo() {
  renderDestacados();
  renderCatalogo();
  renderCarrito();
}

function initChips() {
  const cCat = document.getElementById('chipsCat');
  const cEnv = document.getElementById('chipsEnvase');
  if (cCat) {
    cCat.innerHTML = `<button type="button" class="chip is-on" data-cat="todos">Todos</button>` +
      CATEGORIAS.map(c => `<button type="button" class="chip" data-cat="${esc(c.id)}">${esc(c.nombre)}</button>`).join('');
    cCat.addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      filtroCat = btn.dataset.cat;
      cCat.querySelectorAll('.chip').forEach(b => b.classList.toggle('is-on', b === btn));
      visibles = PASO;
      renderCatalogo();
    });
  }
  if (cEnv) {
    const envases = [...new Set(PRODUCTOS.map(p => p.envase))];
    cEnv.innerHTML = `<button type="button" class="chip is-on" data-env="todos">Todos</button>` +
      envases.map(v => `<button type="button" class="chip" data-env="${esc(v)}">${esc(v)}</button>`).join('');
    cEnv.addEventListener('click', e => {
      const btn = e.target.closest('[data-env]');
      if (!btn) return;
      filtroEnvase = btn.dataset.env;
      cEnv.querySelectorAll('.chip').forEach(b => b.classList.toggle('is-on', b === btn));
      visibles = PASO;
      renderCatalogo();
    });
  }
}

function limpiarFiltros() {
  filtroCat = 'todos'; filtroEnvase = 'todos'; busqueda = ''; visibles = PASO;
  const input = document.getElementById('buscador');
  if (input) input.value = '';
  document.querySelectorAll('#chipsCat .chip').forEach(b => b.classList.toggle('is-on', b.dataset.cat === 'todos'));
  document.querySelectorAll('#chipsEnvase .chip').forEach(b => b.classList.toggle('is-on', b.dataset.env === 'todos'));
  renderCatalogo();
}

function initCatalogoUI() {
  const input = document.getElementById('buscador');
  let t = null;
  input?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { busqueda = input.value; visibles = PASO; renderCatalogo(); }, 180);
  });
  document.getElementById('verMas')?.addEventListener('click', () => { visibles += PASO; renderCatalogo(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vaciarBusqueda')?.addEventListener('click', limpiarFiltros);
  const ft = document.getElementById('filtrosToggle');
  const fp = document.getElementById('filtrosPanel');
  ft?.addEventListener('click', () => {
    const open = fp.classList.toggle('open');
    ft.setAttribute('aria-expanded', String(open));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function initModoPrecio() {
  document.querySelectorAll('.pm-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const modo = btn.dataset.modo;
      if (modo === MODO) return;
      MODO = modo;
      try { localStorage.setItem(MODO_KEY, MODO); } catch {}
      document.querySelectorAll('.pm-opt').forEach(b => {
        const on = b.dataset.modo === MODO;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      renderTodo();
      showToast(MODO === 'bulto' ? 'Precios por bulto cerrado' : 'Precios por unidad suelta');
    });
  });
  document.querySelectorAll('.pm-opt').forEach(b => {
    const on = b.dataset.modo === MODO;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function getQty(desde) {
  const scope = desde?.closest('.card-body, .modal-acc');
  const el = scope?.querySelector('[data-qty]');
  return Math.max(1, parseInt(el?.textContent || '1', 10) || 1);
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const id = step.dataset.id;
      const span = step.parentElement?.querySelector('[data-qty]');
      if (!span) return;
      const p = getProducto(id);
      const next = Math.max(1, Math.min((parseInt(span.textContent, 10) || 1) + Number(step.dataset.step), maxQty(p, MODO)));
      span.textContent = String(next);
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, MODO, getQty(add));
      showToast(`${p.nombre} — sumado al pedido`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, MODO, getQty(buy));
      abrirDrawer();
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) { abrirModal(open.dataset.open); }
  });
}

let ultimoFoco = null;
function trapFocus(cont, e) {
  const f = cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirDrawer() {
  const d = document.getElementById('cartDrawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d) return;
  ultimoFoco = document.activeElement;
  renderCarrito();
  d.classList.add('open'); b?.classList.add('open');
  d.removeAttribute('inert'); d.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll'); document.documentElement.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('cartDrawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d) return;
  d.classList.remove('open'); b?.classList.remove('open');
  d.setAttribute('inert', ''); d.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll'); document.documentElement.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function renderCarrito() {
  const badge = document.getElementById('cartBadge');
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const items = Cart.get();
  if (badge) {
    const n = Cart.count();
    badge.textContent = String(n);
    badge.classList.remove('bump');
    void badge.offsetWidth;
    if (n > 0) badge.classList.add('bump');
  }
  if (!body || !foot) return;
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>
      <h3>Todavía no cargaste nada</h3>
      <p>Sumá bultos desde el catálogo y armamos el pedido para el próximo reparto.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver el catálogo</button>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const precio = precioFinal(p, i.modo);
    const detalle = i.modo === 'bulto' ? `Bulto x${p.unidadesPorBulto}` : 'Unidad suelta';
    return `<div class="cart-line">
      <div class="cart-line-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="120" height="120" loading="lazy" decoding="async"></div>
      <div>
        <h4>${esc(p.nombre)}</h4>
        <span class="cart-line-modo">${esc(detalle)}</span>
        <div class="stepper">
          <button type="button" data-cstep="-1" data-id="${esc(p.id)}" data-modo="${esc(i.modo)}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-cstep="1" data-id="${esc(p.id)}" data-modo="${esc(i.modo)}" aria-label="Sumar">+</button>
        </div>
      </div>
      <div class="cart-line-right">
        <span class="cart-line-precio">${formatearPrecio(precio * i.qty)}</span>
        <button type="button" class="cart-remove" data-cdel="${esc(p.id)}" data-modo="${esc(i.modo)}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  foot.innerHTML = `
    <div class="cart-total"><span>Total del pedido</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>
    <a class="btn btn-ghost" id="pedidoWsp" href="#" target="_blank" rel="noopener">Mandar el pedido por WhatsApp</a>`;
  const wsp = document.getElementById('pedidoWsp');
  if (wsp) wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensajePedido())}`;
}

function mensajePedido() {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const det = i.modo === 'bulto' ? `${i.qty} bulto(s) x${p.unidadesPorBulto}` : `${i.qty} unidad(es) suelta(s)`;
    return `• ${p.nombre} — ${det} — ${formatearPrecio(precioFinal(p, i.modo) * i.qty)}`;
  }).filter(Boolean);
  return `Hola Distri Maxi, quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal estimado: ${formatearPrecio(Cart.total())}`;
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('cart:updated', renderCarrito);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); return; }
    const cs = e.target.closest('[data-cstep]');
    if (cs) {
      const items = Cart.get();
      const it = items.find(i => i.id === cs.dataset.id && i.modo === cs.dataset.modo);
      if (it) Cart.setQty(cs.dataset.id, cs.dataset.modo, it.qty + Number(cs.dataset.cstep));
      return;
    }
    const cd = e.target.closest('[data-cdel]');
    if (cd) { Cart.remove(cd.dataset.cdel, cd.dataset.modo); return; }
    if (e.target.closest('#finalizar')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  document.addEventListener('keydown', e => {
    const d = document.getElementById('cartDrawer');
    if (!d?.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trapFocus(d, e);
  });
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modalProducto');
  const back = document.getElementById('modalBackdrop');
  const cont = document.getElementById('modalIn');
  if (!p || !modal || !cont) return;
  ultimoFoco = document.activeElement;
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;
  const precio = precioFinal(p, MODO);
  const base = precioBase(p, MODO);
  const porUnidadEnBulto = Math.round(precioFinal(p, 'bulto') / p.unidadesPorBulto);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1254" height="1254" decoding="async"></div>
      <div class="modal-info">
        <p class="modal-cat">${esc(getCategoria(p.cat)?.nombre || '')}</p>
        <h3>${esc(p.nombre)}</h3>
        <p class="modal-desc">${esc(p.desc)}</p>
        <div class="modal-precio">
          <span class="precio-main">${formatearPrecio(precio)}</span>
          ${p.descuento > 0 ? `<s class="precio-old">${formatearPrecio(base)}</s>` : ''}
          <span class="card-sub">${MODO === 'bulto' ? 'el bulto cerrado' : 'la unidad suelta'}</span>
        </div>
        <span class="card-sub">Comprando el bulto, cada unidad te queda en ${formatearPrecio(porUnidadEnBulto)}.</span>
        <dl class="modal-specs">
          <div><dt>Envase</dt><dd>${esc(p.envase)}</dd></div>
          <div><dt>Formato</dt><dd>${esc(p.formato)}</dd></div>
          <div><dt>Unidades por bulto</dt><dd>${p.unidadesPorBulto}</dd></div>
          <div><dt>Bultos en depósito</dt><dd>${p.stockBultos}</dd></div>
        </dl>
        <div class="modal-acc">
          <div class="stepper">
            <button type="button" data-step="-1" data-id="${esc(p.id)}" aria-label="Quitar uno">−</button>
            <span data-qty="${esc(p.id)}">1</span>
            <button type="button" data-step="1" data-id="${esc(p.id)}" aria-label="Agregar uno">+</button>
          </div>
          <button type="button" class="btn-add" data-add="${esc(p.id)}">Agregar al carrito</button>
          <button type="button" class="btn-buy" data-buy="${esc(p.id)}">Comprar ahora</button>
        </div>
        ${rel.length ? `<div class="modal-relacionados">
          <h4>Del mismo pasillo</h4>
          <div class="rel-row">${rel.map(r => `<button type="button" class="rel-card" data-open="${esc(r.id)}">
            <img src="${esc(r.img)}" alt="${esc(r.nombre)}" width="320" height="200" loading="lazy" decoding="async">
            <span>${esc(r.nombre)}</span></button>`).join('')}</div>
        </div>` : ''}
      </div>
    </div>`;
  modal.classList.add('open'); back?.classList.add('open');
  modal.removeAttribute('inert'); modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll'); document.documentElement.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}
function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  const back = document.getElementById('modalBackdrop');
  if (!modal) return;
  modal.classList.remove('open'); back?.classList.remove('open');
  modal.setAttribute('inert', ''); modal.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) {
    document.body.classList.remove('no-scroll'); document.documentElement.classList.remove('no-scroll');
  }
  ultimoFoco?.focus();
}
function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    const m = document.getElementById('modalProducto');
    if (!m?.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trapFocus(m, e);
  });
}

function initPasillos() {
  const rail = document.getElementById('railPasillos');
  if (!rail) return;
  rail.innerHTML = CATEGORIAS.map(c => `
    <li class="rail-item">
      <button type="button" class="rail-card" data-pasillo="${esc(c.id)}">
        <div class="rail-media"><img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="1254" height="1254" loading="lazy" decoding="async"></div>
        <div class="rail-info"><h3>${esc(c.nombre)}</h3><span>${esc(c.bajada)}</span></div>
      </button>
    </li>`).join('');

  let down = false, startX = 0, startScroll = 0, moved = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft;
    rail.classList.add('dragging');
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    if (moved) rail.scrollLeft = startScroll - dx;
  });
  const soltar = () => { down = false; rail.classList.remove('dragging'); };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointerleave', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
    const card = e.target.closest('[data-pasillo]');
    if (!card) return;
    irAPasillo(card.dataset.pasillo);
  }, true);
  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const atStart = rail.scrollLeft <= 0;
    const atEnd = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });
}

function irAPasillo(cat) {
  filtroCat = cat; visibles = PASO; busqueda = '';
  const input = document.getElementById('buscador');
  if (input) input.value = '';
  document.querySelectorAll('#chipsCat .chip').forEach(b => b.classList.toggle('is-on', b.dataset.cat === cat));
  renderCatalogo();
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initFooterJump() {
  document.querySelectorAll('[data-jump]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); irAPasillo(a.dataset.jump); });
  });
}

function construirCajon() {
  const g = document.getElementById('crateCells');
  if (!g) return;
  const COLS = 6, ROWS = 4;
  const x0 = 20, y0 = 44, w = 320, h = 178;
  const cw = w / COLS, ch = h / ROWS;
  const colores = ['#2563eb', '#16a34a', '#7fb3ff', '#4ade80'];
  let html = '';
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS, row = Math.floor(i / COLS);
    const cx = x0 + col * cw + cw / 2;
    const cy = y0 + row * ch;
    html += `<rect class="crate-cell" x="${(x0 + col * cw + 3).toFixed(2)}" y="${(cy + 2).toFixed(2)}" width="${(cw - 6).toFixed(2)}" height="${(ch - 4).toFixed(2)}" rx="3"/>`;
  }
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS, row = Math.floor(i / COLS);
    const cx = x0 + col * cw + cw / 2;
    const baseY = y0 + row * ch + ch - 4;
    const c = colores[(col + row) % colores.length];
    html += `<g class="crate-bot" transform="translate(${cx.toFixed(2)},${baseY.toFixed(2)})">
      <rect x="-8" y="-26" width="16" height="24" rx="3" fill="${c}"/>
      <rect x="-3" y="-33" width="6" height="8" fill="${c}"/>
      <rect x="-4.5" y="-36" width="9" height="4" rx="1.5" fill="#ffffff" opacity=".9"/>
    </g>`;
  }
  html += `<g class="crate-frost">${[...Array(9)].map((_, i) => {
    const cx = 34 + i * 36, cy = 30 + (i % 3) * 8;
    return `<circle cx="${cx}" cy="${cy}" r="${2.2 + (i % 3) * 0.8}" fill="#ffffff" opacity=".55"/>`;
  }).join('')}</g>`;
  g.innerHTML = html;
}

function setPasoActivo(idx) {
  const lis = document.querySelectorAll('#pasos li');
  lis.forEach((li, i) => li.classList.toggle('is-on', i === idx));
}

function initCajon() {
  const stage = document.getElementById('pedido');
  const countEl = document.getElementById('crateCount');
  if (!stage || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.crate-bot').forEach(b => { b.style.opacity = 1; });
    if (countEl) countEl.textContent = '24';
    return;
  }

  const pasoDe = pr => (pr < 0.3 ? 0 : pr < 0.55 ? 1 : pr < 0.78 ? 2 : 3);
  const pintar = pr => {
    const unidades = Math.round(Math.min(1, pr / 0.55) * 24);
    if (countEl) countEl.textContent = String(unidades);
    setPasoActivo(pasoDe(pr));
  };

  const armarTimeline = tl => {
    tl.to('.crate-bot', { opacity: 1, y: 0, duration: 0.55, stagger: { each: 0.02, from: 'start' }, ease: 'power1.out' }, 0)
      .to('.crate-frost', { opacity: 1, duration: 0.12 }, 0.56)
      .to('.crate-lip', { fill: '#16a34a', duration: 0.12 }, 0.58)
      .to('#truck', { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.74)
      .to('.crate-svg', { x: '-6%', duration: 0.2, ease: 'power1.inOut' }, 0.78);
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.set('.crate-bot', { opacity: 0, y: 14 });
    gsap.set('#truck', { opacity: 0, x: 40 });
    gsap.set('.crate-frost', { opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => pintar(self.progress)
      }
    });
    armarTimeline(tl);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    gsap.set('.crate-bot', { opacity: 0, y: 14 });
    gsap.set('#truck', { opacity: 0, x: 40 });
    gsap.set('.crate-frost', { opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => pintar(self.progress)
      }
    });
    armarTimeline(tl);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.crate-bot', { opacity: 1, y: 0 });
    gsap.set('.crate-frost', { opacity: 1 });
    gsap.set('#truck', { opacity: 1, x: 0 });
    if (countEl) countEl.textContent = '24';
    setPasoActivo(0);
    return () => {};
  });
}

function initContadores() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  els.forEach(el => {
    const fin = Number(el.dataset.count) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es-AR'); }
    });
  });
}

function initHeroEntrada() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const cut = document.querySelector('.hero-cut');
  const plate = document.querySelector('.hero-plate');
  if (plate) gsap.from(plate, { scaleY: 0.72, transformOrigin: '50% 100%', opacity: 0, duration: 1.1, ease: 'power3.out' });
  if (cut) gsap.from(cut, { y: 46, rotate: -4, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.12 });
  gsap.from('.hero-tag', { opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)', delay: 0.65 });
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-cut', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
    gsap.to('.cierre-word span', { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const host = document.querySelector('.site-header') || document.body;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; host.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const esMobile = () => window.matchMedia('(max-width: 768px)').matches;
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const sync = () => { if (esMobile()) { if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); } else { nav.removeAttribute('inert'); close(); } };
  sync();
  window.addEventListener('resize', sync);
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  initModoPrecio();
  initChips();
  initCatalogoUI();
  renderDestacados();
  renderCatalogo();
  initPasillos();
  initFooterJump();
  initAccionesProducto();
  initDrawer();
  initModal();
  renderCarrito();
  construirCajon();
  initReveals();
  initNav();
  initWspFloat();
  initCajon();
  initContadores();
  initHeroEntrada();
});
