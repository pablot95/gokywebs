const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493471677622';
const TALLES_ROPA = ['S', 'M', 'L', 'XL'];
const TALLES_CALZADO = [36, 37, 38, 39, 40, 41, 42, 43];

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const talleDe = p => p.cat === 'calzado' ? TALLES_CALZADO : TALLES_ROPA;

const CATEGORIAS = [
  { id: 'hombre', nombre: 'Hombre', pie: 'Camisas, pantalones y sacos', img: 'images/cat-hombre-4x5.webp' },
  { id: 'mujer', nombre: 'Mujer', pie: 'Blusas, vestidos y pantalones', img: 'images/cat-mujer-4x5.webp' },
  { id: 'calzado', nombre: 'Calzado', pie: 'Zapatillas, botas y tacos', img: 'images/cat-calzado-4x5.webp' },
  { id: 'accesorios', nombre: 'Accesorios', pie: 'Carteras, cinturones y relojes', img: 'images/mosaico-mix-1x1.webp' }
];

const PRODUCTOS = [
  { id: 'p01', nombre: 'Camisa Blanca Clásica', cat: 'hombre', rol: 'top', genero: 'hombre', ocasion: ['oficina', 'casual'], material: 'Popelina de algodón', tono: 'Blanco', precio: 62900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 14, img: null, etiquetas: ['camisa', 'blanca', 'oficina'], desc: 'Camisa de corte recto en popelina de algodón, cuello clásico y puño abotonado. La base de cualquier look formal.' },
  { id: 'p02', nombre: 'Bomber de Cuero Negro', cat: 'hombre', rol: 'top', genero: 'hombre', ocasion: ['casual', 'noche'], material: 'Cuero', tono: 'Negro', precio: 148900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 5, img: 'images/mosaico-mix-1x1.webp', etiquetas: ['bomber', 'cuero', 'negro'], desc: 'Campera bomber de cuero genuino con cierre frontal y puños elastizados. La pieza que sube cualquier look casual.' },
  { id: 'p03', nombre: 'Pantalón de Vestir Negro', cat: 'hombre', rol: 'bottom', genero: 'hombre', ocasion: ['oficina', 'noche'], material: 'Paño', tono: 'Negro', precio: 71900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 12, img: null, etiquetas: ['pantalon', 'negro', 'vestir'], desc: 'Pantalón de vestir de pinza simple en paño con caída perfecta. Combina con camisa o remera por igual.' },
  { id: 'p04', nombre: 'Remera Básica Blanca', cat: 'hombre', rol: 'top', genero: 'hombre', ocasion: ['casual'], material: 'Jersey de algodón', tono: 'Blanco', precio: 28900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 20, img: null, etiquetas: ['remera', 'blanca', 'basica'], desc: 'Remera de algodón peinado con cuello redondo, corte recto. La básica que nunca falta en el placard.' },
  { id: 'p05', nombre: 'Jean Slim Negro', cat: 'hombre', rol: 'bottom', genero: 'hombre', ocasion: ['casual'], material: 'Denim', tono: 'Negro', precio: 64900, descuento: 15, talles: ['S', 'M', 'L', 'XL'], stock: 9, img: null, etiquetas: ['jean', 'negro', 'slim'], desc: 'Jean de corte slim en denim negro lavado, elastizado para mayor comodidad. Versátil de día y de noche.' },
  { id: 'p06', nombre: 'Saco Sport Gris', cat: 'hombre', rol: 'top', genero: 'hombre', ocasion: ['oficina', 'noche'], material: 'Paño', tono: 'Gris', precio: 132900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 4, img: null, etiquetas: ['saco', 'gris', 'sport'], desc: 'Saco sport de dos botones en paño gris, entretela liviana. Suma formalidad sin perder comodidad.' },

  { id: 'p07', nombre: 'Blusa de Seda Marfil', cat: 'mujer', rol: 'top', genero: 'mujer', ocasion: ['oficina', 'noche'], material: 'Seda', tono: 'Marfil', precio: 69900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 10, img: 'images/cat-mujer-4x5.webp', etiquetas: ['blusa', 'seda', 'marfil'], desc: 'Blusa de seda con mangas abullonadas y cuello camisero. La pieza que eleva cualquier pantalón de vestir.' },
  { id: 'p08', nombre: 'Pantalón Palazzo Negro', cat: 'mujer', rol: 'bottom', genero: 'mujer', ocasion: ['oficina', 'noche'], material: 'Crepe', tono: 'Negro', precio: 68900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 11, img: null, etiquetas: ['pantalon', 'palazzo', 'negro'], desc: 'Pantalón de pierna ancha en crepe fluido con pinzas al frente. Estiliza y acompaña el movimiento.' },
  { id: 'p09', nombre: 'Vestido Camisero Negro', cat: 'mujer', rol: 'top', genero: 'mujer', ocasion: ['noche', 'oficina'], material: 'Viscosa', tono: 'Negro', precio: 89900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 6, img: null, etiquetas: ['vestido', 'negro', 'camisero'], desc: 'Vestido camisero con cinturón a tono y botonadura completa. Se usa solo o abierto sobre un pantalón.' },
  { id: 'p10', nombre: 'Remera Rayada Marina', cat: 'mujer', rol: 'top', genero: 'mujer', ocasion: ['casual'], material: 'Algodón', tono: 'Rayas', precio: 32900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 16, img: null, etiquetas: ['remera', 'rayas', 'casual'], desc: 'Remera a rayas marinas en algodón peinado, corte relajado. El básico francés que combina con todo.' },
  { id: 'p11', nombre: 'Jean Recto Azul', cat: 'mujer', rol: 'bottom', genero: 'mujer', ocasion: ['casual'], material: 'Denim', tono: 'Azul', precio: 61900, descuento: 0, talles: ['S', 'M', 'L', 'XL'], stock: 13, img: null, etiquetas: ['jean', 'azul', 'recto'], desc: 'Jean de tiro alto y pierna recta en denim azul medio. El corte que no pasa de moda.' },
  { id: 'p12', nombre: 'Pañuelo Estampado Floral', cat: 'mujer', rol: 'accesorio', genero: 'mujer', ocasion: ['casual', 'oficina', 'noche'], material: 'Satén', tono: 'Floral', precio: 24900, descuento: 0, talles: [], stock: 15, img: 'images/mundo-ella-1x1.webp', etiquetas: ['pañuelo', 'floral', 'seda'], desc: 'Pañuelo de satén con estampa floral en negro y dorado. Anuda al cuello, al bolso o al pelo.' },

  { id: 'p13', nombre: 'Zapatillas Blancas Urbanas', cat: 'calzado', rol: 'shoe', genero: 'unisex', ocasion: ['casual'], material: 'Cuero', tono: 'Blanco', precio: 89900, descuento: 0, talles: TALLES_CALZADO, stock: 18, img: null, etiquetas: ['zapatillas', 'blancas', 'urbanas'], desc: 'Zapatilla urbana de cuero blanco con suela de goma. El básico que combina con jean, pantalón o vestido.' },
  { id: 'p14', nombre: 'Botas de Cuero Negras', cat: 'calzado', rol: 'shoe', genero: 'unisex', ocasion: ['casual', 'noche'], material: 'Cuero', tono: 'Negro', precio: 118900, descuento: 0, talles: [36, 37, 38, 39, 40, 41, 42], stock: 7, img: 'images/cat-calzado-4x5.webp', etiquetas: ['botas', 'negras', 'cuero'], desc: 'Bota de caña corta en cuero negro con taco de 6 cm y cierre lateral. Firme para caminar todo el día.' },
  { id: 'p15', nombre: 'Sandalias de Tiras Negras', cat: 'calzado', rol: 'shoe', genero: 'mujer', ocasion: ['noche'], material: 'Cuero', tono: 'Negro', precio: 74900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 8, img: null, etiquetas: ['sandalias', 'negras', 'tiras'], desc: 'Sandalia de tiras finas con taco aguja de 9 cm. La que se guarda para la salida de noche.' },
  { id: 'p16', nombre: 'Mocasines de Cuero Marrón', cat: 'calzado', rol: 'shoe', genero: 'hombre', ocasion: ['oficina', 'casual'], material: 'Cuero', tono: 'Marrón', precio: 96900, descuento: 0, talles: [39, 40, 41, 42, 43], stock: 9, img: null, etiquetas: ['mocasines', 'marron', 'cuero'], desc: 'Mocasín de cuero marrón con costura a mano y piso de cuero. El clásico que nunca pasa de moda.' },
  { id: 'p17', nombre: 'Zapatillas Negras Deportivas', cat: 'calzado', rol: 'shoe', genero: 'unisex', ocasion: ['casual'], material: 'Textil y goma', tono: 'Negro', precio: 82900, descuento: 10, talles: TALLES_CALZADO, stock: 11, img: null, etiquetas: ['zapatillas', 'negras', 'deportivas'], desc: 'Zapatilla deportiva de mesh y goma con amortiguación media. Para el día entero sin resignar estilo.' },
  { id: 'p18', nombre: 'Botines de Vestir Negros', cat: 'calzado', rol: 'shoe', genero: 'hombre', ocasion: ['oficina', 'noche'], material: 'Cuero', tono: 'Negro', precio: 104900, descuento: 0, talles: [39, 40, 41, 42, 43, 44], stock: 6, img: null, etiquetas: ['botines', 'vestir', 'negros'], desc: 'Botín de vestir en cuero negro liso con cordones y piso de cuero. La opción formal para el traje.' },

  { id: 'p19', nombre: 'Cartera Estructurada Negra', cat: 'accesorios', rol: 'accesorio', genero: 'mujer', ocasion: ['oficina', 'noche'], material: 'Cuero', tono: 'Negro', precio: 118900, descuento: 0, talles: [], stock: 7, img: 'images/hero-16x9.webp', etiquetas: ['cartera', 'negra', 'cuero'], desc: 'Cartera estructurada de cuero con manija corta y broche dorado. Entra lo justo y necesario, nada más.' },
  { id: 'p20', nombre: 'Cinturón de Cuero Negro', cat: 'accesorios', rol: 'accesorio', genero: 'hombre', ocasion: ['oficina', 'casual'], material: 'Cuero', tono: 'Negro', precio: 34900, descuento: 0, talles: [], stock: 20, img: null, etiquetas: ['cinturon', 'negro', 'cuero'], desc: 'Cinturón de cuero liso con hebilla metálica. El que se usa todos los días sin pensarlo.' },
  { id: 'p21', nombre: 'Reloj Análogo Cuero', cat: 'accesorios', rol: 'accesorio', genero: 'hombre', ocasion: ['oficina', 'casual'], material: 'Cuero y acero', tono: 'Negro', precio: 89900, descuento: 0, talles: [], stock: 8, img: null, etiquetas: ['reloj', 'cuero', 'analogo'], desc: 'Reloj de malla de cuero negro y caja de acero. Esfera simple, sin nada de más.' },
  { id: 'p22', nombre: 'Lentes de Sol Negros', cat: 'accesorios', rol: 'accesorio', genero: 'unisex', ocasion: ['casual'], material: 'Acetato', tono: 'Negro', precio: 46900, descuento: 0, talles: [], stock: 14, img: null, etiquetas: ['lentes', 'sol', 'negros'], desc: 'Anteojos de sol de acetato negro con marco rectangular y protección UV400.' }
];

const Cart = {
  KEY: 'bertbucce_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle: talle || null, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === (talle || null)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
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

const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function placaHTML(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const dato = p.cat === 'calzado' ? `${p.talles[0]}<small>a ${p.talles[p.talles.length - 1]}</small>` : esc(p.tono);
  return `<span class="placa" aria-hidden="true">
      <span class="placa__dato">${dato}</span>
      <span class="placa__cat">${esc(cat ? cat.nombre : '')}</span>
    </span>`;
}

function medioHTML(p) {
  if (!p.img) return placaHTML(p);
  return `<img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1500" loading="lazy">`;
}

/* ---------- Categorías ---------- */

function initCategorias() {
  const tarjetas = document.getElementById('colecciones');
  if (!tarjetas) return;
  tarjetas.innerHTML = CATEGORIAS.slice(0, 3).map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<button type="button" class="coleccion" data-cat="${c.id}" data-animate style="opacity:0;transform:translateY(28px)">
      <span class="coleccion__foto"><img src="${c.img}" alt="${esc(c.nombre)}" width="960" height="1200" loading="lazy"></span>
      <span class="coleccion__txt">
        <span>
          <span class="coleccion__nom">${esc(c.nombre)}</span>
          <span class="coleccion__n">${esc(c.pie)} · ${n} piezas</span>
        </span>
        <span class="coleccion__ir">${ICONO_FLECHA}</span>
      </span>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', e => {
      if (el.tagName === 'A') e.preventDefault();
      aplicarCategoria(el.dataset.cat);
    });
  });
}

function aplicarCategoria(cat) {
  document.querySelectorAll('input[data-f="cat"]').forEach(inp => { inp.checked = inp.value === cat; });
  estado.pagina = 1;
  renderCatalogo();
  const c = CATEGORIAS.find(x => x.id === cat);
  if (c) showToast(`Catálogo filtrado: ${c.nombre}`);
  setTimeout(() => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, 0);
}

function aplicarGenero(genero) {
  document.querySelectorAll('input[data-f="cat"]').forEach(inp => { inp.checked = inp.value === genero; });
  estado.pagina = 1;
  renderCatalogo();
}

/* ---------- Catálogo ---------- */

const POR_PAGINA = 16;
const estado = { q: '', orden: 'destacados', pagina: 1 };

function leerFiltros(grupo) {
  return [...document.querySelectorAll(`input[data-f="${grupo}"]:checked`)].map(i => i.value);
}

function filtrar() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const cats = leerFiltros('cat');
  const talles = leerFiltros('talle');
  const ocasiones = leerFiltros('ocasion');
  const precios = leerFiltros('precio');

  let lista = PRODUCTOS.filter(p => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (talles.length && !talles.some(t => p.talles.map(String).includes(t))) return false;
    if (ocasiones.length && !ocasiones.some(o => p.ocasion.includes(o))) return false;
    if (precios.length) {
      const v = precioFinal(p);
      const ok = precios.some(r => (r === 'bajo' && v < 60000) || (r === 'medio' && v >= 60000 && v <= 100000) || (r === 'alto' && v > 100000));
      if (!ok) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.cat, p.material, p.tono, p.desc, p.etiquetas.join(' '), CATEGORIAS.find(c => c.id === p.cat)?.nombre].join(' '));
      if (!q.every(t => texto.includes(t))) return false;
    }
    return true;
  });

  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));

  return lista;
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 5) badges.push(`<span class="badge badge--ink">Quedan ${p.stock}</span>`);
  const talles = p.talles.length ? `<p class="prod__talles">Talles ${talleDe(p)[0]} a ${talleDe(p)[talleDe(p).length - 1]}</p>` : `<p class="prod__talles">Talle único</p>`;

  return `<article class="prod" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(26px)">
    <div style="position:relative">
      ${badges.length ? `<div class="prod__badges">${badges.join('')}</div>` : ''}
      <button type="button" class="prod__foto" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${medioHTML(p)}
        <span class="prod__ver">Ver la ficha</span>
      </button>
    </div>
    <div class="prod__body">
      <span class="prod__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h3 class="prod__nom">${esc(p.nombre)}</h3>
      <div class="prod__precios">
        <span class="prod__precio${p.descuento > 0 ? ' prod__precio--off' : ''}">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      ${talles}
      <div class="prod__actions">
        <span class="stepper">
          <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
          <span data-qty="${p.id}">1</span>
          <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
        </span>
        <button type="button" class="prod-add" data-ver="${p.id}">${p.talles.length ? 'Elegir talle' : 'Ver ficha'}</button>
      </div>
    </div>
  </article>`;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const lista = filtrar();
  const visibles = lista.slice(0, estado.pagina * POR_PAGINA);

  grid.classList.toggle('is-vacio', lista.length === 0);
  if (!lista.length) {
    grid.innerHTML = `<div class="vacio">
      <h3>No encontramos piezas con esa combinación</h3>
      <p>Probá con menos filtros o escribinos y te decimos qué tenemos en el local.</p>
      <button type="button" class="btn btn--linea btn--sm" id="vacio-limpiar"><span>Limpiar filtros</span></button>
    </div>`;
    document.getElementById('vacio-limpiar')?.addEventListener('click', limpiarFiltros);
  } else {
    grid.innerHTML = visibles.map(cardHTML).join('');
  }

  const cont = document.getElementById('contador');
  if (cont) cont.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'pieza' : 'piezas'} en el catálogo`;

  const vermas = document.getElementById('vermas');
  if (vermas) {
    const quedan = lista.length - visibles.length;
    vermas.hidden = quedan <= 0;
    if (quedan > 0) vermas.querySelector('span').textContent = `Ver ${Math.min(quedan, POR_PAGINA)} piezas más`;
  }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function limpiarFiltros() {
  document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
  const buscador = document.getElementById('q');
  if (buscador) buscador.value = '';
  estado.q = '';
  estado.pagina = 1;
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  estado.orden = 'destacados';
  renderCatalogo();
}

function initFiltrosTalle() {
  const cont = document.getElementById('filtros-talles');
  if (!cont) return;
  const todos = [...TALLES_ROPA, ...TALLES_CALZADO.map(String)];
  cont.innerHTML = todos.map(t => `<label class="filtro-op filtro-op--talle">
      <input type="checkbox" data-f="talle" value="${t}" class="sr-only">
      <span class="talle-chip" aria-hidden="true">${t}</span>
    </label>`).join('');
  cont.querySelectorAll('input[data-f="talle"]').forEach(inp => {
    inp.addEventListener('change', () => { inp.nextElementSibling.setAttribute('aria-pressed', String(inp.checked)); });
  });
}

function initCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;

  document.querySelectorAll('input[data-f]').forEach(inp => {
    inp.addEventListener('change', () => { estado.pagina = 1; renderCatalogo(); });
  });

  const form = document.getElementById('form-buscar');
  const input = document.getElementById('q');
  if (form && input) {
    form.addEventListener('submit', e => { e.preventDefault(); estado.q = input.value; estado.pagina = 1; renderCatalogo(); });
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = input.value; estado.pagina = 1; renderCatalogo(); }, 220);
    });
  }

  const orden = document.getElementById('orden');
  orden?.addEventListener('change', () => { estado.orden = orden.value; estado.pagina = 1; renderCatalogo(); });

  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vermas')?.addEventListener('click', () => { estado.pagina++; renderCatalogo(); });

  grid.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = grid.querySelector(`[data-qty="${step.dataset.id}"]`);
      if (!span) return;
      const p = getProducto(step.dataset.id);
      const val = Math.max(1, Math.min(parseInt(span.textContent, 10) + parseInt(step.dataset.step, 10), p?.stock ?? 99));
      span.textContent = val;
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });

  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros');
  const cerrar = document.getElementById('filtros-cerrar');
  if (toggle && panel) {
    const cerrarPanel = () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const abierto = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
      document.body.classList.toggle('no-scroll', abierto);
      if (abierto) panel.querySelector('input')?.focus();
    });
    cerrar?.addEventListener('click', cerrarPanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  }

  initFiltrosTalle();
  renderCatalogo();
}

/* ---------- Vista rápida ---------- */

let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const back = document.getElementById('modal-backdrop');
  if (!p || !back) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const talles = p.talles;

  back.querySelector('.modal__grid').innerHTML = `
    <div class="modal__foto">${medioHTML(p)}</div>
    <div class="modal__info">
      <span class="modal__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h2 id="modal-titulo-txt">${esc(p.nombre)}</h2>
      <div class="modal__precio">
        <b>${formatearPrecio(final)}</b>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
      </div>
      <p>${esc(p.desc)}</p>
      ${talles.length ? `<div class="modal__talles">
        <span>Elegí tu talle</span>
        <div class="modal__talles-fila" data-talles-modal="${p.id}">
          ${talles.map((t, i) => `<button type="button" class="talle-chip" data-talle-modal="${t}" aria-pressed="${i === 0}">${t}</button>`).join('')}
        </div>
      </div>` : ''}
      <dl class="modal__ficha">
        <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
        <div><dt>Color</dt><dd>${esc(p.tono)}</dd></div>
        <div><dt>En el local</dt><dd>${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}</dd></div>
      </dl>
      <div class="modal__acc">
        <button type="button" class="btn btn--cta" data-modal-add="${p.id}"><span>Agregar al carrito</span></button>
        <a class="btn btn--linea" href="${wsp(`Hola Bertbucce, me interesa ${p.nombre} (${formatearPrecio(final)}). ¿Está disponible?`)}" target="_blank" rel="noopener"><span>Consultar</span></a>
      </div>
      ${relacionados.length ? `<div class="modal__tambien">
        <p>También te puede interesar</p>
        <div class="modal__mini">
          ${relacionados.map(r => `<button type="button" class="mini" data-ver="${r.id}">
            <span class="mini__foto">${medioHTML(r)}</span>
            <span>${esc(r.nombre)}</span>
          </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;

  const talleRow = back.querySelector(`[data-talles-modal="${p.id}"]`);
  let talleElegido = talles[0] || null;
  talleRow?.addEventListener('click', e => {
    const btn = e.target.closest('[data-talle-modal]');
    if (!btn) return;
    talleElegido = /^\d+$/.test(btn.dataset.talleModal) ? Number(btn.dataset.talleModal) : btn.dataset.talleModal;
    talleRow.querySelectorAll('.talle-chip').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  });
  back.querySelector('[data-modal-add]')?.addEventListener('click', () => {
    Cart.add(p, talleElegido, 1);
    showToast(`${p.nombre}${talleElegido ? ` (talle ${talleElegido})` : ''} está en el carrito`);
  });

  back.hidden = false;
  requestAnimationFrame(() => back.classList.add('open'));
  document.body.classList.add('no-scroll');
  back.querySelector('.modal__cerrar')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back || back.hidden) return;
  back.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { back.hidden = true; }, 320);
  ultimoFoco?.focus();
}

function initModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back) return;
  back.addEventListener('click', e => {
    if (e.target === back) { cerrarModal(); return; }
    if (e.target.closest('.modal__cerrar')) { cerrarModal(); return; }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !back.hidden) cerrarModal();
    if (e.key === 'Tab' && !back.hidden) trapFoco(e, back.querySelector('.modal'));
  });
}

function trapFoco(e, cont) {
  if (!cont) return;
  const focusables = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const primero = focusables[0];
  const ultimo = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- Carrito ---------- */

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function renderCarrito() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-total');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <h3>Todavía no elegiste nada</h3>
      <p>Empezá por «Armá tu look» o mirá el catálogo completo.</p>
      <button type="button" class="btn btn--linea btn--sm" data-cerrar-drawer><span>Ver el catálogo</span></button>
    </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `<div class="linea">
        <span class="linea__foto">${medioHTML(p)}</span>
        <span>
          <span class="linea__nom">${esc(p.nombre)}</span>
          <span class="linea__precio">${i.talle ? `Talle ${i.talle} · ` : ''}${i.qty} × ${formatearPrecio(precioFinal(p))}</span>
        </span>
        <span class="linea__acc">
          <button type="button" class="linea__quitar" data-quitar-id="${p.id}" data-quitar-talle="${i.talle ?? ''}" aria-label="Quitar ${esc(p.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg></button>
        </span>
      </div>`;
    }).join('');
  }
  if (foot) foot.textContent = formatearPrecio(Cart.total());
  const finalizar = document.getElementById('finalizar');
  if (finalizar) finalizar.disabled = !items.length;
}

function abrirDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  ultimoFoco = document.activeElement;
  drawer.removeAttribute('inert');
  back.classList.add('open');
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('button')?.focus();
}

function cerrarDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  back.classList.remove('open');
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initCarrito() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirDrawer));
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-cerrar')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) cerrarDrawer();
    if (e.key === 'Tab' && drawer.classList.contains('open')) trapFoco(e, drawer);
  });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    const quitar = e.target.closest('[data-quitar-id]');
    if (quitar) { Cart.remove(quitar.dataset.quitarId, quitar.dataset.quitarTalle || null); return; }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { renderCarrito(); updateCartBadge(); });
  renderCarrito();
  updateCartBadge();
}

/* ---------- Componente: Armá tu look ---------- */

const RECETAS = {
  casual: { nombre: 'Look casual', roles: ['top', 'bottom', 'shoe'] },
  oficina: { nombre: 'Look de oficina', roles: ['top', 'bottom', 'shoe', 'accesorio'] },
  noche: { nombre: 'Look de noche', roles: ['top', 'bottom', 'shoe', 'accesorio'] }
};

const look = { genero: 'mujer', ocasion: 'oficina', piezas: [] };

function piezaPara(rol, genero, ocasion) {
  const candidatos = PRODUCTOS.filter(p => p.rol === rol && (p.genero === genero || p.genero === 'unisex') && p.ocasion.includes(ocasion) && p.stock > 0);
  if (!candidatos.length) return null;
  return candidatos.slice().sort((a, b) => precioFinal(a) - precioFinal(b))[0];
}

function calcularLook() {
  const receta = RECETAS[look.ocasion];
  if (!receta) return [];
  const vistos = new Set();
  return receta.roles.map(rol => {
    const p = piezaPara(rol, look.genero, look.ocasion);
    if (!p || vistos.has(p.id)) return null;
    vistos.add(p.id);
    return p;
  }).filter(Boolean);
}

function renderLookBuilder() {
  const lista = document.getElementById('look-lista');
  const total = document.getElementById('look-total');
  const titulo = document.getElementById('look-titulo');
  const wspBtn = document.getElementById('look-wsp');
  const addBtn = document.getElementById('look-add');
  if (!lista) return;

  look.piezas = calcularLook();
  const suma = look.piezas.reduce((s, p) => s + precioFinal(p), 0);
  const genLabel = look.genero === 'hombre' ? 'él' : 'ella';

  lista.innerHTML = look.piezas.map(p => `<li>
      <span class="look-builder__rol">${esc(p.rol === 'top' ? 'arriba' : p.rol === 'bottom' ? 'abajo' : p.rol === 'shoe' ? 'calzado' : 'extra')}</span>
      <span>${esc(p.nombre)}</span>
      <span class="look-builder__precio">${formatearPrecio(precioFinal(p))}</span>
    </li>`).join('') || '<li><span></span><span>No encontramos piezas para esa combinación todavía.</span><span></span></li>';

  if (titulo) titulo.textContent = `${RECETAS[look.ocasion].nombre} para ${genLabel}`;
  if (total) total.textContent = formatearPrecio(suma);
  if (addBtn) addBtn.disabled = !look.piezas.length;
  if (wspBtn) {
    const detalle = look.piezas.map(p => p.nombre).join(', ');
    wspBtn.href = wsp(`Hola Bertbucce, quiero armar el ${RECETAS[look.ocasion].nombre.toLowerCase()} (${genLabel}): ${detalle || 'sin piezas encontradas'}. Total estimado ${formatearPrecio(suma)}.`);
  }
}

function initLookBuilder() {
  const cont = document.getElementById('look-builder');
  if (!cont) return;

  cont.querySelectorAll('[data-genero]').forEach(btn => {
    btn.addEventListener('click', () => {
      look.genero = btn.dataset.genero;
      cont.querySelectorAll('[data-genero]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderLookBuilder();
    });
  });
  cont.querySelectorAll('[data-ocasion]').forEach(btn => {
    btn.addEventListener('click', () => {
      look.ocasion = btn.dataset.ocasion;
      cont.querySelectorAll('[data-ocasion]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderLookBuilder();
    });
  });
  document.getElementById('look-add')?.addEventListener('click', () => {
    if (!look.piezas.length) return;
    look.piezas.forEach(p => Cart.add(p, p.talles[0] || null, 1));
    showToast(`Sumamos ${look.piezas.length} piezas al carrito`);
    abrirDrawer();
  });
  renderLookBuilder();
}

/* ---------- Momento propio: Dos mundos, Él / Ella ---------- */

function initMundos() {
  const seccion = document.getElementById('mundos');
  const escena = document.getElementById('mundos-escena');
  if (!seccion || !escena) return;

  const track = document.getElementById('mundos-track');
  const marco = document.getElementById('mundos-marco');
  const ladoElla = document.getElementById('mundos-ella');
  const barra = document.getElementById('mundos-barra');
  const nHombre = document.getElementById('mundos-n-hombre');
  const nMujer = document.getElementById('mundos-n-mujer');

  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  const totalHombre = PRODUCTOS.filter(p => p.genero === 'hombre' || p.genero === 'unisex').length;
  const totalMujer = PRODUCTOS.filter(p => p.genero === 'mujer' || p.genero === 'unisex').length;

  const medir = () => {
    const alto = (track || seccion).offsetHeight - escena.offsetHeight;
    const r = (track || seccion).getBoundingClientRect();
    let avance = alto <= 0 ? 0 : Math.min(Math.max((OFF - r.top) / alto, 0), 1);
    marco.style.setProperty('--linea', `${(avance * 100).toFixed(2)}%`);
    if (barra) barra.style.width = `${(avance * 100).toFixed(2)}%`;
    if (nHombre) nHombre.textContent = String(Math.round(totalHombre * (1 - avance * 0.4)));
    if (nMujer) nMujer.textContent = String(Math.round(totalMujer * (0.6 + avance * 0.4)));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; medir(); });
  };

  requestAnimationFrame(medir);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  document.getElementById('mundos-el')?.addEventListener('click', () => {
    aplicarGenero('hombre');
    showToast('Catálogo filtrado: Hombre');
    setTimeout(() => document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 0);
  });
  document.getElementById('mundos-ellacta')?.addEventListener('click', () => {
    aplicarGenero('mujer');
    showToast('Catálogo filtrado: Mujer');
    setTimeout(() => document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 0);
  });
}

/* ---------- Texto que se lee con el scroll ---------- */

function initLectura() {
  const bloque = document.querySelector('.lectura');
  if (!bloque) return;
  const palabras = bloque.textContent.trim().split(/\s+/);
  bloque.innerHTML = palabras.map(p => `<span>${esc(p)}</span>`).join(' ');
  const spans = [...bloque.querySelectorAll('span')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }

  let ticking = false;
  const medir = () => {
    const r = bloque.getBoundingClientRect();
    const inicio = window.innerHeight * .86;
    const fin = window.innerHeight * .34;
    const avance = Math.min(Math.max((inicio - r.top) / (inicio - fin), 0), 1);
    const hasta = Math.round(avance * spans.length);
    spans.forEach((s, n) => s.classList.toggle('on', n < hasta));
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; medir(); });
  };
  medir();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ---------- Form del cierre ---------- */

function initForm() {
  const form = document.getElementById('form-cierre');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const error = form.querySelector('.error');
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valor = input.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) {
      error.textContent = 'Escribinos un correo con formato válido.';
      input.focus();
      return;
    }
    error.textContent = '';
    const txt = btn.querySelector('span').textContent;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = txt;
      form.reset();
      input.removeAttribute('aria-invalid');
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- Nav ---------- */

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

/* ---------- Buscador del header ---------- */

function initBuscarHeader() {
  const btn = document.getElementById('btn-buscar');
  const input = document.getElementById('q');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => input.focus(), reduceMotion ? 0 : 450);
  });
}

/* ---------- Reveals ---------- */

let revealsListos = false;

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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

/* ---------- Flotantes ---------- */

function initFloats() {
  const wspBtn = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wspBtn?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ---------- Hero: zoom decorativo ---------- */

function initHero() {
  if (typeof gsap === 'undefined') return;
  const foto = document.querySelector('[data-hero-foto] img');
  if (foto) gsap.fromTo(foto, { scale: 1.06 }, { scale: 1, duration: 1.5, ease: 'power2.out' });

  if (typeof ScrollTrigger !== 'undefined' && foto && !reduceMotion) {
    gsap.to(foto, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: foto.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
    });
  }
}

/* ---------- Arranque ---------- */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

initCategorias();
initCatalogo();
initLookBuilder();
initModal();
initCarrito();
initMundos();
initLectura();
initForm();
initReveals();
initNav();
initBuscarHeader();
initFloats();
if (!reduceMotion) initHero();
