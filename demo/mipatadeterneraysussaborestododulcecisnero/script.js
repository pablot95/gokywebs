const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493476398119';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'salados', nombre: 'Salados', img: 'images/cat-salados.webp' },
  { id: 'dulces', nombre: 'Dulces', img: 'images/cat-dulces.webp' },
];
const SUBS = [
  { id: 'pata', cat: 'salados', nombre: 'Pata de ternera' },
  { id: 'bocaditos', cat: 'salados', nombre: 'Bocaditos' },
  { id: 'calientes', cat: 'salados', nombre: 'Calientes' },
  { id: 'tortas', cat: 'dulces', nombre: 'Tortas y tartas' },
  { id: 'bocados', cat: 'dulces', nombre: 'Bocados dulces' },
];
const OCASIONES = { cumple: 'Cumpleaños', fiesta: 'Casamientos y 15', empresa: 'Reuniones de trabajo', merienda: 'Merienda' };
const PRECIOS = { 'hasta-20': [0, 20000], '20-40': [20001, 40000], 'mas-40': [40001, Infinity] };
const MAX_LINEA = 30;

const PRODUCTOS = [
  { id: 'pata-de-ternera', nombre: 'Pata de ternera con pancitos', cat: 'salados', sub: 'pata', pres: 'Para 30, 50 u 80 personas', precio: 189000, variantes: [{ id: '30', nombre: 'Para 30 personas · 60 pancitos', corto: '30 personas', personas: 30, precio: 189000 }, { id: '50', nombre: 'Para 50 personas · 100 pancitos', corto: '50 personas', personas: 50, precio: 279000 }, { id: '80', nombre: 'Para 80 personas · 160 pancitos', corto: '80 personas', personas: 80, precio: 419000 }], ocasiones: ['cumple', 'fiesta', 'empresa'], rango: 1, img: 'p-pata', alt: 'Pata de ternera asada con romero, feteada, con pancitos alrededor', corto: 'La estrella de la casa', desc: 'Pata de ternera asada con romero y especias, con sus pancitos para armar los sándwiches. Elegí el tamaño según la cantidad de invitados.', ficha: [['Incluye', 'Pata de ternera y pancitos'], ['Rinde', '2 pancitos por persona'], ['Se sirve', 'Tibia o a temperatura ambiente']] },
  { id: 'sandwiches-de-miga', nombre: 'Sándwiches de miga de jamón y queso', cat: 'salados', sub: 'bocaditos', pres: '24 unidades', unidades: 24, precio: 26400, ocasiones: ['cumple', 'fiesta', 'empresa', 'merienda'], rango: 2, img: 'p-miga', alt: 'Sándwiches de miga triples de jamón y queso apilados en una fuente blanca', corto: 'Triples, en pan de miga blanco', desc: 'Sándwiches de miga triples de jamón y queso, en pan de miga blanco sin corteza. Un clásico que no puede faltar en ningún evento.', ficha: [['Presentación', 'Bandeja de 24 unidades'], ['Se sirve', 'Frío'], ['Rinde', '8 a 12 personas']] },
  { id: 'empanadas-de-carne', nombre: 'Empanadas de carne', cat: 'salados', sub: 'calientes', pres: '12 unidades', unidades: 12, precio: 19800, ocasiones: ['cumple', 'fiesta', 'empresa'], rango: 3, img: 'p-empanadas', alt: 'Empanadas de carne horneadas con repulgue sobre una fuente blanca', corto: 'Horneadas, con repulgue', desc: 'Empanadas de carne horneadas, jugosas y bien doradas. Se sirven calientes o tibias.', ficha: [['Presentación', '12 unidades'], ['Se sirve', 'Caliente'], ['Rinde', '6 a 12 personas']] },
  { id: 'mini-hamburguesas', nombre: 'Mini hamburguesas con cheddar', cat: 'salados', sub: 'calientes', pres: '12 unidades', unidades: 12, precio: 26400, ocasiones: ['cumple', 'fiesta'], rango: 4, img: 'p-hamburguesas', alt: 'Mini hamburguesas con cheddar, lechuga y tomate en pan con sésamo', corto: 'Con cheddar, lechuga y tomate', desc: 'Hamburguesas chicas en pan de sésamo con cheddar, lechuga y tomate. Se comen en dos bocados, ideales para cumpleaños y fiestas.', ficha: [['Presentación', '12 unidades'], ['Se sirve', 'Caliente'], ['Rinde', '6 a 12 personas']] },
  { id: 'fosforitos', nombre: 'Fosforitos de jamón y queso', cat: 'salados', sub: 'bocaditos', pres: '24 unidades', unidades: 24, precio: 19200, ocasiones: ['cumple', 'fiesta', 'empresa', 'merienda'], rango: 5, img: 'p-fosforitos', alt: 'Fosforitos de hojaldre dorados en una fuente de vidrio', corto: 'Hojaldre relleno, bien dorado', desc: 'Bocaditos de hojaldre rellenos de jamón y queso, horneados hasta dorar. Van tibios o a temperatura ambiente.', ficha: [['Presentación', '24 unidades'], ['Se sirve', 'Tibio o frío'], ['Rinde', '8 a 12 personas']] },
  { id: 'cazuelitas-de-pollo', nombre: 'Cazuelitas de pollo', cat: 'salados', sub: 'calientes', pres: '10 porciones', unidades: 10, precio: 34000, ocasiones: ['fiesta', 'empresa'], rango: 6, img: 'p-cazuelas', alt: 'Cazuela de pollo con papas y perejil en un plato hondo blanco', corto: 'Pollo con papas, en porción individual', desc: 'Cazuela de pollo con papas y verduras, en porciones individuales. Un plato caliente para las fiestas con cena.', ficha: [['Presentación', '10 porciones individuales'], ['Se sirve', 'Caliente'], ['Rinde', '10 personas']] },
  { id: 'mini-panchos', nombre: 'Mini panchos de frankfurt', cat: 'salados', sub: 'calientes', pres: '24 unidades', unidades: 24, precio: 21600, ocasiones: ['cumple'], rango: 7, img: 'p-panchos', alt: 'Panchos de frankfurt con salsa en pan blando sobre una bandeja', corto: 'Salchicha de frankfurt en pan blando', desc: 'Panchitos de salchicha de frankfurt en pan blando, listos para servir. Los preferidos de los chicos en los cumpleaños.', ficha: [['Presentación', '24 unidades'], ['Se sirve', 'Caliente'], ['Rinde', '8 a 12 personas']] },
  { id: 'pizzetitas', nombre: 'Pizzetitas de muzzarella', cat: 'salados', sub: 'bocaditos', pres: '24 unidades', unidades: 24, precio: 18000, ocasiones: ['cumple', 'merienda', 'empresa'], rango: 8, img: 'p-pizzetitas', alt: 'Pizzetitas con salsa de tomate, muzzarella y orégano en una fuente', corto: 'Salsa, muzzarella y orégano', desc: 'Pizzetas chicas con salsa de tomate, muzzarella y orégano. Se sirven tibias y combinan con cualquier mesa salada.', ficha: [['Presentación', '24 unidades'], ['Se sirve', 'Tibio'], ['Rinde', '8 a 12 personas']] },
  { id: 'torta-decorada', nombre: 'Torta decorada', cat: 'dulces', sub: 'tortas', pres: '15 o 25 porciones', precio: 42000, variantes: [{ id: '15', nombre: '15 porciones · 1,5 kg', corto: '15 porciones', precio: 42000 }, { id: '25', nombre: '25 porciones · 2,5 kg', corto: '25 porciones', precio: 68000 }], ocasiones: ['cumple', 'fiesta'], rango: 9, img: 'p-torta', alt: 'Torta alta cubierta de crema con copos y granas de colores sobre una base dorada', corto: 'Rellena y cubierta con crema', desc: 'Torta de bizcochuelo rellena y cubierta con crema, decorada para tu evento. Contanos el motivo y los colores por WhatsApp.', ficha: [['Tamaños', '15 o 25 porciones'], ['Relleno', 'Lo elegís al confirmar'], ['Decoración', 'Según el motivo del evento']] },
  { id: 'torta-rogel', nombre: 'Torta rogel', cat: 'dulces', sub: 'tortas', pres: '20 porciones', unidades: 20, precio: 46000, ocasiones: ['cumple', 'fiesta', 'merienda'], rango: 10, img: 'p-rogel', alt: 'Torta rogel de capas finas con dulce de leche y merengue tostado', corto: 'Capas finas, dulce de leche y merengue', desc: 'Capas finas y crocantes con dulce de leche, coronadas con merengue tostado.', ficha: [['Presentación', 'Torta entera'], ['Rinde', '20 porciones'], ['Se sirve', 'A temperatura ambiente']] },
  { id: 'tarta-de-frutillas', nombre: 'Tarta de frutillas', cat: 'dulces', sub: 'tortas', pres: '12 porciones', unidades: 12, precio: 32000, ocasiones: ['cumple', 'merienda'], rango: 11, img: 'p-tarta', alt: 'Tarta de frutillas frescas sobre crema pastelera con masa dorada', corto: 'Crema pastelera y frutillas frescas', desc: 'Base de masa dulce con crema pastelera y frutillas frescas. Fresca y liviana para cerrar la mesa dulce.', ficha: [['Presentación', 'Tarta entera'], ['Rinde', '12 porciones'], ['Se sirve', 'Fría']] },
  { id: 'alfajores-de-maicena', nombre: 'Alfajores de maicena', cat: 'dulces', sub: 'bocados', pres: '12 unidades', unidades: 12, precio: 9600, ocasiones: ['cumple', 'merienda', 'empresa'], rango: 12, img: 'p-alfajores', alt: 'Alfajores de maicena rellenos de dulce de leche con coco rallado en el borde', corto: 'Dulce de leche y coco rallado', desc: 'Tapitas de maicena que se deshacen, rellenas con dulce de leche y con coco rallado en el borde.', ficha: [['Presentación', '12 unidades'], ['Relleno', 'Dulce de leche'], ['Rinde', '6 a 12 personas']] },
  { id: 'brownies', nombre: 'Brownies', cat: 'dulces', sub: 'bocados', pres: '12 porciones', unidades: 12, precio: 14400, ocasiones: ['cumple', 'merienda', 'empresa'], rango: 13, img: 'p-brownies', alt: 'Cuadrados de brownie de chocolate con costra brillante en una fuente blanca', corto: 'Chocolate, húmedos por dentro', desc: 'Brownies de chocolate con la costra crocante arriba y húmedos por dentro, cortados en cuadrados.', ficha: [['Presentación', '12 cuadrados'], ['Se sirve', 'A temperatura ambiente'], ['Rinde', '6 a 12 personas']] },
  { id: 'lemon-pie', nombre: 'Lemon pie', cat: 'dulces', sub: 'tortas', pres: '12 porciones', unidades: 12, precio: 30000, visible: false, ocasiones: ['merienda'], rango: 99, img: 'p-tarta', alt: '', corto: '', desc: '', ficha: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const varianteDe = (p, v) => (p?.variantes ? p.variantes.find(x => x.id === v) || null : null);
const precioFinal = (p, v) => (varianteDe(p, v)?.precio ?? p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = id => SUBS.find(s => s.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), ocasion = lista(f.ocasion), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (ocasion.length && !ocasion.some(o => p.ocasiones.includes(o))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      if (p.precio < min || p.precio > max) return false;
    }
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.pres, catDe(p.cat)?.nombre, subDe(p.sub)?.nombre, p.corto, p.desc,
      ...(p.ficha || []).map(f => f[1]), ...(p.ocasiones || []).map(o => OCASIONES[o]), ...(p.variantes || []).map(v => v.nombre),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const PERFILES = {
  coctel: { nombre: 'Cumpleaños o reunión', salado: 10, dulce: 2, pata: true, mix: { 'sandwiches-de-miga': 0.3, 'empanadas-de-carne': 0.2, pizzetitas: 0.2, fosforitos: 0.15, 'mini-hamburguesas': 0.15 }, mixDulce: { 'alfajores-de-maicena': 0.4, brownies: 0.4, 'torta-rogel': 0.2 } },
  fiesta: { nombre: 'Fiesta con cena', salado: 14, dulce: 3, pata: true, mix: { 'sandwiches-de-miga': 0.25, 'empanadas-de-carne': 0.2, 'mini-hamburguesas': 0.2, fosforitos: 0.15, pizzetitas: 0.2 }, mixDulce: { 'alfajores-de-maicena': 0.35, brownies: 0.35, 'torta-rogel': 0.3 } },
  merienda: { nombre: 'Merienda o mesa dulce', salado: 4, dulce: 6, pata: false, mix: { 'sandwiches-de-miga': 0.6, pizzetitas: 0.4 }, mixDulce: { 'alfajores-de-maicena': 0.35, brownies: 0.35, 'torta-rogel': 0.3 } },
};

function calcularPedido(invitados, momento, conPata, obtener) {
  const perfil = PERFILES[momento] || PERFILES.coctel;
  const inv = Math.min(Math.max(Math.round(Number(invitados) || 0), 10), 300);
  const items = [];
  let pancitos = 0;
  if (conPata) {
    const pata = obtener('pata-de-ternera');
    if (pata) {
      const tam = pata.variantes.map(v => v.personas).sort((a, b) => a - b);
      const mayor = tam[tam.length - 1];
      const elegidas = {};
      let resto = inv;
      while (resto > mayor) { elegidas[mayor] = (elegidas[mayor] || 0) + 1; resto -= mayor; }
      const ultima = tam.find(t => t >= resto) ?? mayor;
      elegidas[ultima] = (elegidas[ultima] || 0) + 1;
      Object.keys(elegidas).map(Number).sort((a, b) => b - a).forEach(t => {
        const v = pata.variantes.find(x => x.personas === t);
        items.push({ id: pata.id, v: v.id, qty: elegidas[t] });
        pancitos += elegidas[t] * t * 2;
      });
    }
  }
  const saladoTotal = perfil.salado * inv;
  const saladoResto = Math.max(0, saladoTotal - (conPata ? inv * 2 : 0));
  const repartir = (mix, total) => Object.entries(mix).forEach(([id, frac]) => {
    const p = obtener(id);
    if (!p || !p.unidades) return;
    const qty = Math.ceil((total * frac) / p.unidades);
    if (qty > 0) items.push({ id, v: '', qty: Math.min(qty, MAX_LINEA) });
  });
  repartir(perfil.mix, saladoResto);
  const dulceTotal = perfil.dulce * inv;
  repartir(perfil.mixDulce, dulceTotal);
  const total = items.reduce((s, it) => { const p = obtener(it.id); return p ? s + precioFinal(p, it.v) * it.qty : s; }, 0);
  return { invitados: inv, momento: perfil.nombre, items, bocadosSalados: saladoTotal, bocadosDulces: dulceTotal, pancitos, total };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const foto = (p, chica) => `images/${p.img}${chica ? '-480' : ''}.webp`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const Cart = {
  KEY: 'mipatadeternera_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, MAX_LINEA);
    else items.push({ id: producto.id, v, qty: Math.min(qty, MAX_LINEA) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_LINEA)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
  limpiar() {
    const items = this.get();
    const validos = items.filter(i => { const p = getProducto(i.id); return p && (!p.variantes || varianteDe(p, i.v)); });
    if (validos.length !== items.length) this.save(validos);
  },
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

const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const WSP_ICO = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"></use></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(44px)"';
const waConsulta = p => wa(`¡Hola! Quiero consultar por ${p.nombre} (${p.pres}) para un evento.`);
const etiquetaCat = p => [catDe(p.cat)?.nombre, subDe(p.sub)?.nombre].filter(Boolean).join(' · ');

function precioHTML(p) {
  if (p.variantes) return `<p class="precio"><small>desde</small><span>${formatearPrecio(p.precio)}</span></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${MAX_LINEA}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>`;

function cardV(p, anim = true) {
  const acc = p.variantes
    ? `<button type="button" class="btn btn--cta btn--sm prod-elegir" data-open="${p.id}">Elegir tamaño</button>`
    : `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}">Agregar</button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
  return `<article class="pcard"${anim ? ` ${ANIM_SUBIR}` : ''}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${foto(p, true)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="(min-width: 1100px) 290px, (min-width: 641px) 30vw, 48vw" alt="${esc(p.alt)}" width="480" height="480"></button>
    <div class="pcard__body">
      <p class="pcard__cat">${esc(etiquetaCat(p))}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pcard__pres">${esc(p.pres)}</p>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}

function cardFila(p) {
  const acc = p.variantes
    ? `<button type="button" class="btn btn--cta btn--sm" data-open="${p.id}">Elegir tamaño</button>`
    : `${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}">Agregar</button>`;
  return `<article class="pfila" ${ANIM_SUBIR}>
    <button type="button" class="pfila__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${foto(p, true)}" alt="${esc(p.alt)}" width="480" height="480"></button>
    <div class="pfila__info">
      <h3 class="pfila__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pfila__desc">${esc(p.corto)}</p>
      <p class="pfila__pres">${esc(p.pres)}</p>
    </div>
    ${precioHTML(p)}
    <div class="pfila__acc">${acc}</div>
  </article>`;
}

function dtileHTML(p, grande) {
  const add = p.variantes
    ? `<button type="button" class="dtile__add" data-open="${p.id}" aria-label="Elegir tamaño de ${esc(p.nombre)}">${ico('plus')}</button>`
    : `<button type="button" class="dtile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('plus')}</button>`;
  return `<article class="dtile${grande ? ' dtile--grande' : ''}" ${ANIM_SUBIR}>
    <button type="button" class="dtile__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${foto(p, !grande)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="${grande ? '(min-width: 761px) 50vw, 100vw' : '(min-width: 761px) 25vw, 50vw'}" alt="${esc(p.alt)}" width="480" height="480"></button>
    <div class="dtile__info">
      <div><p class="dtile__nombre">${esc(p.nombre)}</p><p class="dtile__pres">${esc(p.pres)}</p>${precioHTML(p)}</div>
      ${add}
    </div>
  </article>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-drop__btn')?.focus();
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

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const u = new URLSearchParams(location.search);
  const catActual = u.get('cat');
  const subActual = u.get('sub');
  lista.innerHTML = CATEGORIAS.map(c => {
    const actualCat = enCatalogo && catActual === c.id && !subActual;
    const subs = SUBS.filter(s => s.cat === c.id).map(s => `<li><a href="${base}?cat=${c.id}&amp;sub=${s.id}"${enCatalogo && subActual === s.id ? ' aria-current="page"' : ''}>${esc(s.nombre)}<small>${Tienda.contar({ sub: s.id })}</small></a></li>`).join('');
    return `<div class="drop-grupo"><a class="drop-grupo__tit" href="${base}?cat=${c.id}"${actualCat ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="46" height="46"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a><ul>${subs}</ul></div>`;
  }).join('');
  const desktop = window.matchMedia('(min-width: 901px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = Tienda.contar({ cat: el.dataset.cuentaCat }); });
  document.querySelectorAll('[data-cuenta-sub]').forEach(el => { el.textContent = Tienda.contar({ sub: el.dataset.cuentaSub }); });
  document.querySelectorAll('[data-cuenta-oca]').forEach(el => { el.textContent = Tienda.contar({ ocasion: el.dataset.cuentaOca }); });
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  const items = Tienda.consultar({ filtros: { cat: 'salados' }, orden: 'destacados', limite: 8 }).items;
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardV(p, false)}</div>`).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 260) + 18;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; startScroll = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId !== e.pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
    vp.classList.remove('dragging');
    if (moved) vp.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

function initBento() {
  const cont = document.querySelector('[data-bento]');
  if (!cont) return;
  const ids = cont.dataset.bento.split(',');
  const items = Tienda.consultar({ filtros: { ids, cat: 'dulces' }, orden: 'ids', limite: 5 }).items;
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => dtileHTML(p, i === 0)).join('');
}

function initCarta() {
  const cont = document.querySelector('[data-carta]');
  if (!cont) return;
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const pintar = (cat, revelar) => {
    const items = Tienda.consultar({ filtros: { cat }, orden: 'destacados', limite: 8 }).items;
    items.forEach(cachear);
    cont.innerHTML = items.map(cardFila).join('');
    cont.setAttribute('aria-labelledby', `tab-${cat}`);
    if (revelar) { revelarNuevos(cont); refrescarST(); }
  };
  const activar = (tab, foco) => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    if (foco) tab.focus();
    pintar(tab.dataset.tab, true);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
    });
  });
  pintar('salados', false);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const esM2 = document.body.dataset.modelo === '2';
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = root.querySelector('[data-filtros-fondo]');
  const cuentaRes = root.querySelector('[data-cuenta-res]');
  const nFiltros = root.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const migaSep = document.querySelector('[data-miga-sep]');
  const chips = root.querySelector('[data-chips-cat]');
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), sub: SUBS.map(s => s.id), ocasion: Object.keys(OCASIONES) };
  const estado = { cat: [], sub: [], ocasion: [], precio: '', q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.sub = listaURL('sub');
  estado.ocasion = listaURL('ocasion');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';

  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="">Todo <small>${Tienda.contar({})}</small></button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  }

  const filtrosDe = () => ({ cat: estado.cat, sub: estado.sub, ocasion: estado.ocasion, precio: estado.precio });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.sub.length) p.set('sub', estado.sub.join(','));
    if (estado.ocasion.length) p.set('ocasion', estado.ocasion.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    try { window.history.replaceState(null, '', s ? `?${s}` : location.pathname); } catch { /* file:// */ }
  };
  const sincronizarUI = () => {
    filtrosEl.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    filtrosEl.querySelectorAll('input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    chips?.querySelectorAll('[data-chip]').forEach(b => {
      const v = b.dataset.chip;
      b.setAttribute('aria-pressed', String(v ? estado.cat.length === 1 && estado.cat[0] === v : !estado.cat.length));
    });
    const n = (esM2 ? 0 : estado.cat.length) + estado.sub.length + estado.ocasion.length + (estado.precio ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    const nombreMiga = estado.sub.length === 1 ? subDe(estado.sub[0])?.nombre : estado.cat.length === 1 ? catDe(estado.cat[0])?.nombre : '';
    migaCat.hidden = !nombreMiga;
    migaSep.hidden = !nombreMiga;
    migaCat.textContent = nombreMiga || '';
    if (nombreMiga) migaCat.setAttribute('aria-current', 'page'); else migaCat.removeAttribute('aria-current');
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (esM2 ? cardFila(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'opción' : 'opciones'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'opción' : 'opciones'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    estado.cat = b.dataset.chip ? [b.dataset.chip] : [];
    estado.sub = estado.sub.filter(s => !estado.cat.length || estado.cat.includes(subDe(s)?.cat));
    aplicar();
  });
  root.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], sub: [], ocasion: [], precio: '', q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const esDrawer = () => esM2 || window.matchMedia('(max-width: 1024px)').matches;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    filtrosEl.setAttribute('role', 'dialog');
    filtrosEl.setAttribute('aria-modal', 'true');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    filtrosEl.removeAttribute('role');
    filtrosEl.removeAttribute('aria-modal');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  root.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  root.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => { if (!esDrawer()) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const FECHA_KEY = 'mipatadeternera_fecha';
const leerFecha = () => { try { return localStorage.getItem(FECHA_KEY) || ''; } catch { return ''; } };
function fechaTexto(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

function lineaHTML(item, p) {
  const v = varianteDe(p, item.v);
  const key = `${p.id}|${item.v || ''}`;
  return `<div class="linea">
    <div class="linea__foto"><img src="${foto(p, true)}" alt="" width="480" height="480"></div>
    <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(v ? v.nombre : p.pres)}</p></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p, item.v) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper"><button type="button" data-linea-step="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${MAX_LINEA}" value="${item.qty}" data-linea-input="${key}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= MAX_LINEA ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${key}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const fecha = fechaTexto(leerFecha());
  if (!items.length) return wa('¡Hola! Vi la web de Mi pata de ternera y sus sabores y quiero consultar por un evento.');
  const lineas = items.map(({ i, p }) => { const v = varianteDe(p, i.v); return `• ${i.qty} × ${p.nombre} (${v ? v.nombre : p.pres}) — ${formatearPrecio(precioFinal(p, i.v) * i.qty)}`; });
  return wa(`¡Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${fecha ? `\nFecha del evento: ${fecha}` : ''}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas], [data-panel-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-key="${activo.dataset.key}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const vacio = !items.length;
  const lineas = items.map(({ i, p }) => lineaHTML(i, p)).join('');
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu pedido está vacío</p><small>Elegí de la carta lo que quieras para tu evento y sumalo con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver a la carta</a></div>`
      : lineas;
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  const panel = document.querySelector('[data-panel-lineas]');
  if (panel) {
    panel.innerHTML = vacio ? '<p class="pedido__vacio">Todavía no sumaste nada. Elegí de la carta con «Agregar» y tu pedido aparece acá.</p>' : lineas;
    document.querySelector('[data-panel-pie]').hidden = vacio;
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (selector && enLineas) (enLineas.querySelector(selector) || enLineas.querySelector('button:not([disabled])'))?.focus();
}

function initFecha() {
  const inputs = document.querySelectorAll('[data-fecha-evento]');
  if (!inputs.length) return;
  const hoy = new Date();
  const min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const actual = leerFecha();
  inputs.forEach(i => { i.min = min; i.value = actual >= min ? actual : ''; });
  document.addEventListener('change', e => {
    const i = e.target.closest('[data-fecha-evento]');
    if (!i) return;
    const v = i.value && i.value >= min ? i.value : '';
    try { localStorage.setItem(FECHA_KEY, v); } catch { /* sin almacenamiento */ }
    inputs.forEach(x => { if (x !== i) x.value = v; });
    const msg = mensajePedido();
    document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const variantes = p.variantes
    ? `<fieldset class="variantes"><legend>Elegí el tamaño</legend>${p.variantes.map((v, i) => `<label class="variante"><input type="radio" name="qvVariante" value="${v.id}"${i === 0 ? ' checked' : ''}><span>${esc(v.nombre)}<b>${formatearPrecio(v.precio)}</b></span></label>`).join('')}</fieldset>`
    : '';
  const precio = p.variantes ? `<p class="precio" data-qv-precio><span>${formatearPrecio(p.variantes[0].precio)}</span></p>` : precioHTML(p);
  return `<figure class="qv__foto"><img src="${foto(p)}" alt="${esc(p.alt)}" width="900" height="900"></figure>
  <div class="qv__info">
    <p class="pcard__cat">${esc(etiquetaCat(p))}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="pcard__pres">${esc(p.pres)}</p>
    ${precio}
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="ficha-dl">${p.ficha.map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    ${variantes}
    <div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al carrito</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${foto(r, true)}" alt="" width="480" height="480"></span><b>${esc(r.nombre)}</b><small>${r.variantes ? 'desde ' : ''}${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  const body = qv.querySelector('[data-qv-body]');
  body.innerHTML = qvHTML(p);
  qv.querySelector('.qv__panel').setAttribute('aria-label', `Detalle: ${p.nombre}`);
  body.querySelectorAll('input[name="qvVariante"]').forEach(r => r.addEventListener('change', () => {
    const v = varianteDe(p, r.value);
    const pr = body.querySelector('[data-qv-precio] span');
    if (v && pr) pr.textContent = formatearPrecio(v.precio);
  }));
  document.getElementById('ldProducto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ldProducto';
  const precios = p.variantes ? p.variantes.map(v => v.precio) : [p.precio];
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(foto(p), location.href).href, description: p.desc,
    category: etiquetaCat(p),
    offers: p.variantes
      ? { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: Math.min(...precios), highPrice: Math.max(...precios), offerCount: precios.length, availability: 'https://schema.org/InStock' }
      : { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: 'https://schema.org/InStock' },
  });
  document.head.appendChild(ld);
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  document.getElementById('ldProducto')?.remove();
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || MAX_LINEA;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu pedido está vacío: sumá algo de la carta primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initCalculadora() {
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const inv = document.getElementById('calcInv');
  const rango = form.querySelector('[data-calc-rango]');
  const pata = form.querySelector('[data-calc-pata]');
  const tit = document.querySelector('[data-calc-tit]');
  const sub = document.querySelector('[data-calc-sub]');
  const lista = document.querySelector('[data-calc-lista]');
  const total = document.querySelector('[data-calc-total]');
  const wsp = document.querySelector('[data-calc-wsp]');
  const sumar = document.querySelector('[data-calc-sumar]');
  let ultimo = null;
  let pataTocada = false;
  const momento = () => form.querySelector('input[name="calcMomento"]:checked')?.value || 'coctel';
  const leer = () => Math.min(Math.max(Math.round((parseInt(inv.value, 10) || 10) / 5) * 5, 10), 300);
  const pintar = () => {
    const n = leer();
    const r = calcularPedido(n, momento(), pata.checked, getProducto);
    ultimo = r;
    tit.textContent = `Para ${r.invitados} invitados`;
    sub.textContent = `Unos ${r.bocadosSalados.toLocaleString('es-AR')} bocados salados${r.pancitos ? ` (incluidos ${r.pancitos.toLocaleString('es-AR')} pancitos de la pata)` : ''} y ${r.bocadosDulces.toLocaleString('es-AR')} dulces.`;
    lista.innerHTML = r.items.map(it => {
      const p = getProducto(it.id);
      const v = varianteDe(p, it.v);
      return `<li><span class="calc__qty">${it.qty} ×</span><span class="calc__item"><b>${esc(p.nombre)}</b><small>${esc(v ? v.nombre : p.pres)}</small></span><span class="calc__sub">${formatearPrecio(precioFinal(p, it.v) * it.qty)}</span></li>`;
    }).join('');
    total.textContent = formatearPrecio(r.total);
    const detalle = r.items.map(it => { const p = getProducto(it.id); const v = varianteDe(p, it.v); return `• ${it.qty} × ${p.nombre} (${v ? v.corto : p.pres})`; }).join('\n');
    wsp.href = wa(`¡Hola! Usé la calculadora de la web para un evento de ${r.invitados} invitados (${r.momento}). Me sugirió:\n${detalle}\nTotal estimado: ${formatearPrecio(r.total)}\n¿Lo vemos juntos?`);
    refrescarST();
  };
  const fijar = n => { inv.value = n; rango.value = n; pintar(); };
  form.querySelectorAll('[data-calc-step]').forEach(b => b.addEventListener('click', () => fijar(Math.min(Math.max(leer() + Number(b.dataset.calcStep), 10), 300))));
  rango.addEventListener('input', () => { inv.value = rango.value; pintar(); });
  inv.addEventListener('change', () => fijar(leer()));
  inv.addEventListener('input', () => { const v = parseInt(inv.value, 10); if (v >= 10 && v <= 300) { rango.value = v; pintar(); } });
  pata.addEventListener('change', () => { pataTocada = true; pintar(); });
  form.querySelectorAll('input[name="calcMomento"]').forEach(r => r.addEventListener('change', () => {
    if (!pataTocada) pata.checked = PERFILES[momento()].pata;
    pintar();
  }));
  sumar.addEventListener('click', () => {
    if (!ultimo || !ultimo.items.length) return;
    ultimo.items.forEach(it => { const p = getProducto(it.id); if (p) Cart.add(p, it.qty, it.v || ''); });
    showToast(`Sumaste el cálculo para ${ultimo.invitados} invitados a tu pedido`);
  });
  pintar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const lat = parseFloat(el.dataset.lat);
    const lng = parseFloat(el.dataset.lng);
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: '', html: '<div class="mapa-pin"><span>M</span></div>', iconSize: [44, 44], iconAnchor: [4, 44], popupAnchor: [18, -40] });
    L.marker([lat, lng], { icon: icono, title: 'Gaboto 384, Oliveros' }).addTo(mapa).bindPopup('Gaboto 384, Oliveros (CP 2206)');
    window.addEventListener('load', () => mapa.invalidateSize());
  } catch { /* el mapa no frena el resto de la página */ }
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.como__foto img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.closest('.como'), start: 'top bottom', end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * -6).toFixed(2)}%`; },
    });
  });
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const [id, v = ''] = t.dataset.key.split('|');
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (it) Cart.setQty(id, v, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const [id, v = ''] = t.dataset.quitar.split('|');
      const p = getProducto(id);
      Cart.remove(id, v);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} de tu pedido`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p) return;
    let v = '';
    if (p.variantes) {
      const elegido = t.closest('.qv__info')?.querySelector('input[name="qvVariante"]:checked');
      if (!elegido) { abrirProducto(p.id, t); return; }
      v = elegido.value;
    }
    const st = t.closest('.pcard, .pfila, .qv__comprar')?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    Cart.add(p, qty, v);
    const nombre = v ? `${p.nombre} (${varianteDe(p, v).corto})` : p.nombre;
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${nombre} a tu pedido`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const lin = e.target.closest('[data-linea-input]');
    if (lin) {
      const [id, v = ''] = lin.dataset.lineaInput.split('|');
      Cart.setQty(id, v, parseInt(lin.value, 10) || 1);
      return;
    }
    const inp = e.target.closest('[data-stepper] input');
    if (inp) syncStepper(inp.closest('[data-stepper]'));
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id, null);
}

initCuentas();
initNavDrop();
initRail();
initBento();
initCarta();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initFloats();
Cart.limpiar();
updateCartBadge();
renderCarrito();
initFecha();
initDelegacion();
initCalculadora();
initMapa();
initParallax();
initHeroMotion();
abrirDesdeURL();
