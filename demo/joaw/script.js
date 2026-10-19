const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5492302669086';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_TALLE = 'joaw_talle';

const CATEGORIAS = [
  { id: 'camisas', nombre: 'Camisas', bajada: 'Sobrecamisa de gabardina y camisa de lino, para usar abiertas o abrochadas.', img: 'images/p-sobrecamisa.webp' },
  { id: 'remeras', nombre: 'Remeras y buzos', bajada: 'La remera básica y los buzos de frisa que se usan toda la semana.', img: 'images/p-remera.webp' },
  { id: 'abrigos', nombre: 'Tejidos y abrigos', bajada: 'El sweater trenzado y la rompeviento para la media estación.', img: 'images/p-sweater.webp' },
  { id: 'pantalones', nombre: 'Pantalones', bajada: 'Jean recto y pantalón sastrero, del talle 36 al 48.', img: 'images/p-jean.webp' },
];
const COLORES = {
  'Azul marino': '#26324F', Crudo: '#ECE3D2', Blanco: '#F6F5F2', 'Azul índigo': '#33476E', Beige: '#D6C6AC',
  Petróleo: '#1E6E73', 'Gris oscuro': '#4A4B4F', Celeste: '#A9C3E2', 'Verde oliva': '#5E6440',
};
const RANGOS = {
  hasta45: { nombre: 'Hasta $45.000', max: 45000 },
  '45a60': { nombre: '$45.000 a $60.000', min: 45001, max: 60000 },
  mas60: { nombre: 'Más de $60.000', min: 60001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Lo último', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const T_ARRIBA = ['S', 'M', 'L', 'XL'];
const T_JEAN = ['38', '40', '42', '44', '46', '48'];
const T_SASTRERO = ['36', '38', '40', '42', '44', '46'];
const T_PANTALON = ['36', '38', '40', '42', '44', '46', '48'];
const GRUPOS_TALLE = [['Camisas, buzos y abrigos', T_ARRIBA], ['Pantalones', T_PANTALON]];
const tl = (lista, stocks) => lista.map((v, i) => ({ v, stock: stocks[i] ?? 0 }));

const MEDIDAS = {
  arriba: { col: 'Contorno de pecho', filas: [['S', 88, 96], ['M', 96, 104], ['L', 104, 112], ['XL', 112, 120]] },
  abajo: { col: 'Contorno de cintura', filas: [['36', 70, 74], ['38', 74, 78], ['40', 78, 82], ['42', 82, 86], ['44', 86, 90], ['46', 90, 94], ['48', 94, 98]] },
};

const PRODUCTOS = [
  { id: 'sobrecamisa-gabardina', nombre: 'Sobrecamisa de gabardina', cat: 'camisas', precio: 58900, color: 'Azul marino', tipo: 'arriba', ops: tl(T_ARRIBA, [3, 6, 5, 2]), rango: 1, alta: 9,
    img: 'images/p-sobrecamisa.webp', alt: 'Sobrecamisa de gabardina azul marino con bolsillo en el pecho, colgada en una percha de madera',
    desc: 'Gabardina de algodón con bolsillo al pecho y botones al tono. Se usa abierta sobre una remera o abrochada como camisa.', tags: ['sobrecamisa', 'camisa', 'gabardina', 'azul', 'marino', 'overshirt'] },
  { id: 'sweater-trenzado', nombre: 'Sweater trenzado', cat: 'abrigos', precio: 64900, color: 'Crudo', tipo: 'arriba', ops: tl(T_ARRIBA, [2, 4, 4, 1]), rango: 2, alta: 8,
    img: 'images/p-sweater.webp', alt: 'Sweater tejido con trenzas en color crudo, extendido sobre una superficie clara',
    desc: 'Tejido de punto con trenzas al frente, cuello redondo y puños elastizados. Abriga sin pesar.', tags: ['sweater', 'pulover', 'tejido', 'trenzado', 'crudo', 'blanco'] },
  { id: 'remera-basica', nombre: 'Remera básica de algodón', cat: 'remeras', precio: 22900, color: 'Blanco', tipo: 'arriba', ops: tl(T_ARRIBA, [8, 12, 10, 6]), rango: 3, alta: 7,
    img: 'images/p-remera.webp', alt: 'Remera blanca de manga corta y cuello redondo, extendida',
    desc: 'Jersey de algodón con cuello redondo y manga corta. La base de cualquier combinación.', tags: ['remera', 'basica', 'blanca', 'algodon', 'manga corta'] },
  { id: 'jean-recto', nombre: 'Jean recto clásico', cat: 'pantalones', precio: 52900, color: 'Azul índigo', tipo: 'abajo', ops: tl(T_JEAN, [1, 3, 5, 4, 2, 0]), rango: 4, alta: 6,
    img: 'images/p-jean.webp', alt: 'Jean de corte recto en azul índigo, extendido',
    desc: 'Denim de cinco bolsillos, tiro medio y pierna recta. Lavado índigo que va con todo.', tags: ['jean', 'denim', 'azul', 'indigo', 'recto', 'pantalon'] },
  { id: 'buzo-cuello-redondo', nombre: 'Buzo de frisa cuello redondo', cat: 'remeras', precio: 42900, color: 'Petróleo', tipo: 'arriba', ops: tl(T_ARRIBA, [3, 6, 6, 3]), rango: 5, alta: 5,
    img: 'images/p-buzo.webp', alt: 'Buzo de frisa color petróleo con cuello redondo, extendido',
    desc: 'Frisa de algodón con cuello redondo, puños y cintura con elástico. Calce relajado.', tags: ['buzo', 'frisa', 'petroleo', 'verde', 'azul', 'cuello redondo'] },
  { id: 'pantalon-sastrero', nombre: 'Pantalón sastrero de pierna ancha', cat: 'pantalones', precio: 49900, color: 'Beige', tipo: 'abajo', ops: tl(T_SASTRERO, [2, 4, 3, 3, 1, 0]), rango: 6, alta: 4,
    img: 'images/p-sastrero.webp', alt: 'Pantalón sastrero beige de pierna ancha con pinzas, colgado en una percha',
    desc: 'Tiro alto, pinzas al frente y pierna ancha que cae derecha. Para la oficina o con zapatillas.', tags: ['pantalon', 'sastrero', 'beige', 'pierna ancha', 'vestir'] },
  { id: 'campera-rompeviento', nombre: 'Campera rompeviento', cat: 'abrigos', precio: 74900, color: 'Verde oliva', tipo: 'arriba', ops: tl(T_ARRIBA, [1, 2, 3, 1]), rango: 7, alta: 3,
    img: 'images/p-rompeviento.webp', alt: 'Campera rompeviento verde oliva con cuello alto y cierre, colgada en una percha',
    desc: 'Tela liviana con cuello alto, cierre completo, bolsillos laterales y puños con elástico. Para la media estación.', tags: ['campera', 'rompeviento', 'verde', 'oliva', 'abrigo'] },
  { id: 'camisa-lino', nombre: 'Camisa de lino manga corta', cat: 'camisas', precio: 46900, color: 'Celeste', tipo: 'arriba', ops: tl(T_ARRIBA, [2, 5, 4, 0]), rango: 8, alta: 2,
    img: 'images/p-camisa-lino.webp', alt: 'Camisa de lino celeste de manga corta con bolsillo, extendida',
    desc: 'Lino liviano con bolsillo al pecho y botones al tono. Fresca para los días de calor.', tags: ['camisa', 'lino', 'celeste', 'manga corta', 'verano'] },
  { id: 'buzo-capucha', nombre: 'Buzo con capucha y cierre', cat: 'remeras', precio: 54900, color: 'Gris oscuro', tipo: 'arriba', ops: tl(T_ARRIBA, [0, 3, 4, 2]), alta: 10,
    img: 'images/p-buzo-capucha.webp', alt: 'Buzo gris oscuro con capucha y cierre completo, doblado',
    desc: 'Frisa de algodón con cierre completo, capucha con cordón y puños con elástico.', tags: ['buzo', 'campera', 'capucha', 'cierre', 'gris', 'frisa', 'hoodie'] },
  { id: 'borrador-chaleco', nombre: 'Chaleco (borrador)', cat: 'abrigos', precio: 1, color: 'Crudo', tipo: 'arriba', ops: tl(T_ARRIBA, [0, 0, 0, 0]), alta: 0, visible: false,
    img: 'images/p-sweater.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioFinal = p => p.precio;
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const coloresDe = p => (p.color ? [p.color] : []);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), talles = lista(f.talles), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.catNo && p.cat === f.catNo) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (talles.length && !p.ops.some(o => talles.includes(o.v) && o.stock > 0)) return false;
    if (colores.length && !coloresDe(p).some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
    textoBusqueda.set(p.id, norm([p.nombre, catDe(p.cat)?.nombre, p.desc, ...coloresDe(p), ...p.ops.map(o => o.v), ...(p.tags || [])].join(' ')));
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

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const stockDe = (p, v) => p.ops.find(o => o.v === v)?.stock || 0;
const varTexto = (p, v) => [coloresDe(p)[0], `talle ${v}`].filter(Boolean).join(' · ');
const leerTalle = () => { try { return localStorage.getItem(KEY_TALLE) || ''; } catch { return ''; } };
const guardarTalle = t => { try { if (t) localStorage.setItem(KEY_TALLE, t); else localStorage.removeItem(KEY_TALLE); } catch (e) { void e; } };

const Cart = {
  KEY: 'joaw_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v) || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return Math.min(qty, max);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function swatchesHTML(p) {
  return `<span class="swatches" aria-hidden="true">${coloresDe(p).map(c => `<i style="--sw:${COLORES[c] || '#ccc'}"></i>`).join('')}</span>`;
}
function tallesHTML(p) {
  return p.ops.map(o => (o.stock > 0 ? `<span>${esc(o.v)}</span>` : `<del aria-label="Talle ${esc(o.v)} sin stock">${esc(o.v)}</del>`)).join('');
}

function cardHTML(p, { anim = true } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  let badge = '';
  if (sinStock) badge = '<span class="pcard__badge pcard__badge--sin">Sin stock</span>';
  else if (stockTotal(p) <= 7) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200"></a>
    ${badge}
    <a class="pcard__wsp" href="${wspLink(`Hola JOAW! Quiero consultar por: ${p.nombre}`)}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp: ${esc(p.nombre)}">${ICO.wsp}</a>
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <div class="pcard__fila"><h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3><p class="pcard__precio"><b>${formatearPrecio(precioFinal(p))}</b></p></div>
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(p.color)} · ${esc(catDe(p.cat)?.nombre)}</span></p>
    <p class="pcard__talles" aria-label="Talles">${tallesHTML(p)}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span>${esc(c.nombre)}</span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
  document.querySelectorAll('[data-total-prendas]').forEach(el => { el.textContent = `Ver las ${Tienda.contar({})} prendas`; });
}

function initPorTalle() {
  const panel = document.querySelector('[data-talla]');
  const grid = document.querySelector('[data-por-talle]');
  if (!panel || !grid) return;
  const todos = new Set([...T_ARRIBA, ...T_PANTALON]);
  const guardado = leerTalle();
  const estado = { talle: todos.has(guardado) ? guardado : '', cat: '' };
  const cuenta = panel.querySelector('[data-talla-cuenta]');
  const ver = document.querySelector('[data-talla-ver]');
  const nota = document.querySelector('[data-por-talle-nota]');
  const opsBtn = (v, extra = '') => `<button type="button" class="talla__op${extra}" data-talla-op="${esc(v)}" aria-pressed="false">${esc(v)}</button>`;
  panel.querySelector('[data-talla-ops="arriba"]').innerHTML = T_ARRIBA.map(v => opsBtn(v)).join('');
  panel.querySelector('[data-talla-ops="abajo"]').innerHTML = T_PANTALON.map(v => opsBtn(v)).join('');
  panel.querySelector('[data-talla-cats]').innerHTML = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS].map(c => `<button type="button" class="talla__op talla__op--cat" data-talla-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`).join('');

  const pintar = () => {
    panel.querySelectorAll('[data-talla-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tallaOp === estado.talle)));
    panel.querySelectorAll('[data-talla-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tallaCat === estado.cat)));
    const filtros = { stock: true };
    if (estado.talle) filtros.talles = [estado.talle];
    if (estado.cat) filtros.cat = estado.cat;
    const total = Tienda.contar(filtros);
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: 8 });
    items.forEach(cachear);
    const cat = catDe(estado.cat);
    const que = cat ? cat.nombre.toLowerCase() : 'prendas';
    if (cuenta) cuenta.innerHTML = estado.talle ? `<b>${total}</b> ${total === 1 && !cat ? 'prenda' : que} con stock en talle <b>${esc(estado.talle)}</b>` : `<b>${total}</b> ${que} con stock. Elegí tu talle para filtrar.`;
    if (nota) nota.textContent = estado.talle ? `Mostrando ${cat ? cat.nombre.toLowerCase() : 'lo que hay'} en talle ${estado.talle}.` : 'Mostrando toda la colección. Elegí tu talle arriba y la lista se acomoda.';
    if (items.length) grid.innerHTML = items.map(p => cardHTML(p)).join('');
    else {
      const sugerencia = cat?.id === 'pantalones' ? 'Los pantalones van del 36 al 48.' : estado.talle && T_PANTALON.includes(estado.talle) ? 'Las camisas, buzos y abrigos van del S al XL.' : 'Probá con otro talle o escribinos y te avisamos cuándo entra.';
      grid.innerHTML = `<div class="cat-vacio por-talle__vacio" data-animate="subir" style="opacity:0;transform:translateY(24px)"><p class="cat-vacio__tit">No hay ${esc(que)} en talle ${esc(estado.talle)} por ahora</p><p>${esc(sugerencia)}</p><div class="cat-vacio__acc"><button type="button" class="btn btn--line" data-talla-cat="">Ver todo en mi talle</button><a class="btn btn--line" href="${wspLink(`Hola JOAW! Busco ${que} en talle ${estado.talle}`)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a></div></div>`;
    }
    grid.classList.toggle('catalogo-grid--vacio', !items.length);
    if (ver) {
      const u = new URLSearchParams();
      if (estado.cat) u.set('cat', estado.cat);
      if (estado.talle) u.set('talle', estado.talle);
      ver.href = `${URL_CATALOGO}${u.toString() ? '?' + u.toString() : ''}`;
      ver.querySelector('span').textContent = estado.talle ? `Ver todo en talle ${estado.talle}` : 'Ver toda la colección';
    }
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  document.addEventListener('click', e => {
    const op = e.target.closest('[data-talla-op]');
    if (op) {
      estado.talle = estado.talle === op.dataset.tallaOp ? '' : op.dataset.tallaOp;
      guardarTalle(estado.talle);
      pintar();
      return;
    }
    const c = e.target.closest('[data-talla-cat]');
    if (c) { estado.cat = c.dataset.tallaCat; pintar(); }
  });
  document.addEventListener('joaw:talle', e => {
    if (!todos.has(e.detail)) return;
    estado.talle = e.detail;
    pintar();
  });
  pintar();
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí tu talle: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">Elegí tu talle</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="Talle ${esc(o.v)}${o.stock > 0 ? '' : ', sin stock'}">${esc(o.v)}</button>`).join('')}</div>${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  const mio = leerTalle();
  (pk.querySelector(`.picker__op[data-picker-op="${CSS.escape(mio)}"]:not([disabled])`) || pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast('Ese talle no tiene stock por ahora.'); return; }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre} (talle ${v}) al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      abrirPicker(card, p, add.hasAttribute('data-comprar') ? 'comprar' : 'agregar');
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, opBtn.dataset.pickerOp, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const hayOverlay = () => ['qv', 'cartDrawer', 'guia'].some(id => { const el = document.getElementById(id); return el && !el.hidden && el.classList.contains('open'); });

const qvEstado = { p: null, talle: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  const mio = leerTalle();
  qvEstado.talle = stockDe(p, mio) > 0 ? mio : '';
  qvEstado.qty = 1;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: p.color,
    brand: { '@type': 'Brand', name: 'JOAW' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: relacionados } = Tienda.consultar({ filtros: { catNo: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  relacionados.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const op = p.ops.find(o => o.v === qvEstado.talle);
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? 'Elegí un talle para ver la disponibilidad' : op.stock <= 2 ? `Quedan ${op.stock} en talle ${op.v}` : `Talle ${op.v} en stock`;
  const consulta = `Hola JOAW! Quiero consultar por: ${p.nombre}${qvEstado.talle ? ` (talle ${qvEstado.talle})` : ''}`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200"></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><b>${formatearPrecio(precioFinal(p))}</b></p>
      <p class="qv__color-fijo">${swatchesHTML(p)}Color: ${esc(p.color)}</p>
      <div class="qv__var"><p class="qv__var-tit"><span>Talle${qvEstado.talle ? `: <b>${esc(qvEstado.talle)}</b>` : ''}</span><button type="button" class="btn-guia" data-abrir-guia="${esc(p.tipo)}">${ICO.regla}<span>Guía de talles</span></button></p><div class="qv__ops" role="radiogroup" aria-label="Talle">${p.ops.map(o => `<button type="button" class="qv__op" role="radio" aria-checked="${o.v === qvEstado.talle}" data-qv-talle="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${esc(o.v)}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>Elegí un talle para sumarlo al carrito.</p></div>
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="qv__wsp" href="${wspLink(consulta)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : '¿Dudas con el talle o el color? Consultanos por WhatsApp'}</span></a>
      <details class="qv__det" open><summary>${ICO.info}Detalle de la prenda</summary><p>${esc(p.desc)}</p></details>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-tit">Para combinar</p><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const talleBtn = e.target.closest('[data-qv-talle]');
    if (talleBtn) {
      qvEstado.talle = talleBtn.dataset.qvTalle;
      const max = stockDe(p, qvEstado.talle) || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      pintarQV();
      qv.querySelector(`[data-qv-talle="${CSS.escape(qvEstado.talle)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = stockDe(p, qvEstado.talle) || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.talle) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { const n = Cart.add(p, qvEstado.qty, qvEstado.talle); if (!n) { showToast('Ese talle no tiene stock por ahora.'); return; } cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, qvEstado.talle, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoGuia = null;
function talleSegun(tipo, cm) {
  const filas = MEDIDAS[tipo].filas;
  if (cm < filas[0][1]) return { talle: filas[0][0], nota: 'menor' };
  const f = filas.find(([, min, max]) => cm >= min && cm < max);
  if (f) return { talle: f[0], nota: '' };
  return { talle: filas[filas.length - 1][0], nota: 'mayor' };
}
function abrirGuia(origen, tipo) {
  const g = document.getElementById('guia');
  if (!g) return;
  focoGuia = origen || document.activeElement;
  g.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add('open')));
  g.querySelector('.guia__panel').scrollTop = 0;
  const campo = g.querySelector(tipo === 'abajo' ? '#calcCintura' : '#calcPecho');
  (campo || g.querySelector('.guia__close'))?.focus({ preventScroll: true });
}
function cerrarGuia() {
  const g = document.getElementById('guia');
  if (!g || g.hidden) return;
  g.classList.remove('open');
  setTimeout(() => { g.hidden = true; if (!hayOverlay()) document.body.classList.remove('no-scroll'); }, 320);
  if (focoGuia && document.contains(focoGuia)) focoGuia.focus({ preventScroll: true });
}
function initGuia() {
  const g = document.getElementById('guia');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-abrir-guia]');
    if (b) { e.preventDefault(); abrirGuia(b, b.dataset.abrirGuia); }
  });
  if (!g) return;
  const tbody = (tipo, actual) => MEDIDAS[tipo].filas.map(([t, min, max]) => `<tr${t === actual ? ' class="es-actual"' : ''}><th scope="row">${t}</th><td>${min} a ${max} cm</td></tr>`).join('');
  const pintarTablas = (actual = '') => {
    g.querySelector('[data-tabla="arriba"]').innerHTML = tbody('arriba', actual);
    g.querySelector('[data-tabla="abajo"]').innerHTML = tbody('abajo', actual);
  };
  pintarTablas(leerTalle());
  const form = g.querySelector('[data-calc]');
  const res = g.querySelector('[data-calc-res]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const pecho = parseFloat(form.querySelector('#calcPecho').value.replace(',', '.'));
    const cintura = parseFloat(form.querySelector('#calcCintura').value.replace(',', '.'));
    const okP = pecho >= 60 && pecho <= 160;
    const okC = cintura >= 50 && cintura <= 150;
    if (!okP && !okC) {
      res.hidden = false;
      res.innerHTML = '<p class="calc__res-tit">Cargá al menos una medida</p><p>El contorno de pecho para camisas, buzos y abrigos, o la cintura para pantalones, en centímetros.</p>';
      form.querySelector('#calcPecho').focus();
      return;
    }
    const arriba = okP ? talleSegun('arriba', pecho) : null;
    const abajo = okC ? talleSegun('abajo', cintura) : null;
    const partes = [];
    if (arriba) partes.push(`camisas, buzos y abrigos en talle <b>${arriba.talle}</b>`);
    if (abajo) partes.push(`pantalones en talle <b>${abajo.talle}</b>`);
    const extremos = [arriba, abajo].filter(x => x && x.nota);
    const principal = (arriba || abajo).talle;
    guardarTalle(principal);
    pintarTablas(principal);
    document.dispatchEvent(new CustomEvent('joaw:talle', { detail: principal }));
    const talles = [arriba?.talle, abajo?.talle].filter(Boolean).join(',');
    const msg = `Hola JOAW! Quiero ayuda con el talle. Mis medidas: ${okP ? `pecho ${pecho} cm` : ''}${okP && okC ? ', ' : ''}${okC ? `cintura ${cintura} cm` : ''}`;
    res.hidden = false;
    res.innerHTML = `<p class="calc__res-tit">Te recomendamos ${partes.join(' y ')}</p>
      <p>${extremos.length ? 'Tu medida queda fuera de la tabla: escribinos y vemos juntos qué prenda te queda mejor.' : 'Si estás entre dos talles, elegí el más grande para un calce relajado.'}</p>
      <div class="calc__res-acc"><a class="btn btn--cta" href="${URL_CATALOGO}?talle=${encodeURIComponent(talles)}">Ver prendas en mi talle ${ICO.flecha}</a><a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a></div>`;
  });
  g.addEventListener('click', e => { if (e.target.closest('[data-cerrar-guia]')) cerrarGuia(); });
  g.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarGuia(); return; }
    atraparFoco(g.querySelector('.guia__panel'), e);
  });
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí tu talle en cualquier prenda y sumala acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver a la colección</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(varTexto(p, i.v))} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${varTexto(p, i.v)}): ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola JOAW! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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
  sync();
}

const HORARIO = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [10, 13] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function estadoAtencion(fecha = new Date()) {
  const ar = new Date(fecha.getTime() - 3 * 3600e3);
  const dia = ar.getUTCDay();
  const hora = ar.getUTCHours() + ar.getUTCMinutes() / 60;
  const hoy = HORARIO[dia];
  if (hoy && hora >= hoy[0] && hora < hoy[1]) return { abierto: true, dia, texto: `Ahora estamos atendiendo, hasta las ${hoy[1]} h` };
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    const h = HORARIO[d];
    if (!h || (i === 0 && hora >= h[0])) continue;
    const cuando = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, dia, texto: `Fuera de horario: te respondemos ${cuando} desde las ${h[0]} h` };
  }
  return { abierto: false, dia, texto: 'Fuera de horario' };
}
function initAtencion() {
  const est = estadoAtencion();
  document.querySelectorAll('[data-estado]').forEach(el => {
    el.textContent = est.texto;
    el.classList.toggle('is-abierto', est.abierto);
  });
  document.querySelectorAll('[data-dias]').forEach(li => {
    li.classList.toggle('es-hoy', li.dataset.dias.split(',').map(Number).includes(est.dia));
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return { cat: '' };
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const todosTalles = new Set(GRUPOS_TALLE.flatMap(g => g[1]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    talles: new Set(lista('talle').filter(t => todosTalles.has(t))),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la colección')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-talle-opciones]').forEach(cont => {
    cont.innerHTML = GRUPOS_TALLE.map(([nombre, talles]) => `<div class="tgrupo"><p class="tgrupo__tit">${esc(nombre)}</p><div class="tgrupo__ops">${talles.map(t => `<label class="talle-op"><input type="checkbox" value="${esc(t)}" data-f="talle"><span>${esc(t)}</span></label>`).join('')}</div></div>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.talles.size && sin !== 'talle') f.talles = [...estado.talles];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.talles.forEach(t => chips.push(['talle', t, `Talle ${t}`]));
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="talle"]').forEach(el => { el.checked = estado.talles.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    const enPanel = estado.colores.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-talle-opciones]') ? estado.talles.size : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : estado.orden === 'nuevos' ? 'Lo último' : 'Toda la colección';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Camisas, remeras, buzos, tejidos y pantalones que combinan entre sí. Elegí tu talle en cada prenda y sumala al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && estado.orden !== 'nuevos'; miga.textContent = titulo; }
    document.title = `${titulo} — JOAW`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'talle', 'color', 'precio', 'q', 'orden', 'stock'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.talles.size) u.searchParams.set('talle', [...estado.talles].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'prenda' : 'prendas'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.precio = ''; estado.stock = false; estado.q = '';
    estado.talles.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'talle' ? estado.talles : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      if (multi.dataset.f === 'talle') guardarTalle(estado.talles.size === 1 ? [...estado.talles][0] : leerTalle());
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'talle') estado.talles.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  document.addEventListener('joaw:talle', e => {
    if (!todosTalles.has(e.detail)) return;
    estado.talles = new Set([e.detail]);
    aplicar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero__percha', { rotation: -4, y: -18, opacity: 0, duration: 1.6, ease: 'elastic.out(1, 0.75)', clearProps: 'transform,opacity' }, 0.15);
  paso('.eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.talla', { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero__etq', { y: -24, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initVistaPrevia,
  initPorTalle,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : { cat: '' }; initMenuTienda(sel.cat); },
  initTarjetas,
  initQV,
  initGuia,
  initCarrito,
  initFloats,
  initAtencion,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
