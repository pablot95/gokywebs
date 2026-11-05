const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493417524194';
const MARCA = 'MAJ';
const POR_PAGINA = 16;
const TOPE_LINEA = 200;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'pintadas', nombre: 'Figuras pintadas', img: 'images/p-mariposa-pastel.webp' },
  { id: 'para-pintar', nombre: 'Figuras para pintar', img: 'images/p-buho-blanco.webp' },
  { id: 'velas', nombre: 'Velas', img: 'images/p-vela-pilar.webp' },
  { id: 'sahumerios', nombre: 'Sahumerios', img: 'images/p-varillas.webp' },
];
const COLORES = [
  { id: 'blanco', nombre: 'Yeso natural', hex: '#F1EEE8' },
  { id: 'celeste', nombre: 'Celeste', hex: '#A8C6D8' },
  { id: 'rosa', nombre: 'Rosa', hex: '#E2B9B4' },
  { id: 'salvia', nombre: 'Salvia', hex: '#B4C2A6' },
  { id: 'pastel', nombre: 'Pasteles', hex: 'conic-gradient(#E9B9C3 0 25%, #A9CDE0 0 50%, #EADB9A 0 75%, #CDB9E0 0)' },
];
const AROMAS = [
  { id: 'vainilla', nombre: 'Vainilla' },
  { id: 'coco', nombre: 'Coco' },
  { id: 'lavanda', nombre: 'Lavanda' },
  { id: 'flores-blancas', nombre: 'Flores blancas' },
  { id: 'limon-jengibre', nombre: 'Limón y jengibre' },
  { id: 'sandalo', nombre: 'Sándalo' },
  { id: 'mirra', nombre: 'Mirra' },
  { id: 'palo-santo', nombre: 'Palo santo' },
  { id: 'copal', nombre: 'Copal' },
  { id: 'canela', nombre: 'Canela' },
  { id: 'sin-aroma', nombre: 'Sin aroma' },
];
const PRECIOS = [
  { id: 'hasta-3000', nombre: 'Hasta $3.000', min: null, max: 3000 },
  { id: '3000-a-8000', nombre: '$3.000 a $8.000', min: 3001, max: 8000 },
  { id: 'mas-8000', nombre: 'Más de $8.000', min: 8001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];

const PRODUCTOS = [
  { id: 'buho-pintado', nombre: 'Búho pintado a mano', cat: 'pintadas', foto: 'buho', colores: ['celeste', 'rosa', 'salvia'], precio: 10900, mayor: { desde: 6, precio: 8700 }, rango: 1,
    ficha: ['Pintado a mano', '18 cm de alto', '3 colores'],
    desc: 'El búho tallado, pintado de un solo color en tonos suaves que combinan con cualquier ambiente. Por mayor podés combinar colores.',
    claves: ['buho', 'lechuza', 'ave', 'pajaro', 'pintado', 'color', 'deco', 'regalo'] },
  { id: 'vela-vaso', nombre: 'Vela aromática en vaso', cat: 'velas', img: 'p-vela-vaso.webp', aromas: ['vainilla', 'lavanda', 'flores-blancas', 'limon-jengibre'], precio: 11800, mayor: { desde: 6, precio: 9400 }, rango: 2,
    ficha: ['200 g', 'Vaso de vidrio', '4 aromas'],
    desc: 'Vela en vaso de vidrio grueso. Cuando se termina, el vaso queda para usar como portalápices o maceta chica.',
    claves: ['vela', 'vaso', 'aromatica', 'perfumada', 'velon', 'regalo'] },
  { id: 'mariposa-pintada', nombre: 'Mariposa pintada en pasteles', cat: 'pintadas', foto: 'mariposa', colores: ['pastel'], precio: 6900, mayor: { desde: 6, precio: 5400 }, rango: 3,
    ficha: ['Pintada a mano', '14 cm de ancho', 'Se apoya sola'],
    desc: 'Mariposa pintada a mano en rosa, celeste, amarillo y lila, con puntitos en los bordes. Cada una sale apenas distinta.',
    claves: ['mariposa', 'pintada', 'colores', 'pastel', 'infantil', 'deco', 'regalo'] },
  { id: 'varillas', nombre: 'Sahumerios en varilla · caja x 20', cat: 'sahumerios', img: 'p-varillas.webp', aromas: ['sandalo', 'mirra', 'palo-santo', 'lavanda', 'copal'], precio: 1900, mayor: { desde: 12, precio: 1300 }, unidad: 'cajas', rango: 4,
    ficha: ['20 varillas', 'Sobre de papel madera', '5 aromas'],
    desc: 'Caja de 20 varillas en sobre de papel madera. Por mayor podés combinar aromas: cuentan todas las cajas juntas.',
    claves: ['sahumerio', 'sahumerios', 'incienso', 'varilla', 'varillas', 'aroma', 'caja'] },
  { id: 'buho-pintar', nombre: 'Búho tallado para pintar', cat: 'para-pintar', foto: 'buho', colores: ['blanco'], precio: 6800, mayor: { desde: 6, precio: 5200 }, rango: 5,
    ficha: ['Yeso natural', '18 cm de alto', 'Base plana'],
    desc: 'Búho de plumas talladas en relieve, con base plana para que quede firme en un estante. Viene en yeso natural, listo para pintar con acrílicos.',
    claves: ['buho', 'lechuza', 'ave', 'pajaro', 'blanco', 'pintar', 'manualidad'] },
  { id: 'conos', nombre: 'Conos de sahumerio · caja x 10', cat: 'sahumerios', img: 'p-conos.webp', aromas: ['sandalo', 'mirra', 'palo-santo', 'canela'], precio: 2300, mayor: { desde: 12, precio: 1600 }, unidad: 'cajas', rango: 6,
    ficha: ['10 conos', 'Para usar sobre un plato', '4 aromas'],
    desc: 'Conos para encender sobre un plato de cerámica o un sahumador. Por mayor podés combinar aromas en el mismo pedido.',
    claves: ['cono', 'conos', 'sahumerio', 'incienso', 'aroma', 'caja'] },
  { id: 'elefante-pintar', nombre: 'Elefante hindú para pintar', cat: 'para-pintar', foto: 'elefante', colores: ['blanco'], precio: 7400, mayor: { desde: 6, precio: 5700 }, rango: 7,
    ficha: ['Yeso natural', '15 cm de alto', 'Manto en relieve'],
    desc: 'Elefante con la trompa en alto y el manto bordado en relieve: los detalles se lucen con un lavado de color o con dorado.',
    claves: ['elefante', 'trompa', 'hindu', 'suerte', 'blanco', 'pintar', 'manualidad'] },
  { id: 'vela-pilar', nombre: 'Vela pilar rústica', cat: 'velas', img: 'p-vela-pilar.webp', aromas: ['vainilla', 'coco', 'sin-aroma'], precio: 8400, mayor: { desde: 6, precio: 6600 }, rango: 8,
    ficha: ['7 × 9 cm', 'Textura rústica', 'Con o sin aroma'],
    desc: 'Vela pilar de superficie rústica, en tono marfil. Se sostiene sola sobre un plato o una bandeja.',
    claves: ['vela', 'pilar', 'rustica', 'marfil', 'velon', 'centro de mesa'] },
  { id: 'placa-pintada', nombre: 'Placa floral pintada en rosa', cat: 'pintadas', foto: 'placa', colores: ['rosa'], precio: 9200, mayor: { desde: 6, precio: 7400 }, rango: 9,
    ficha: ['Pintada a mano', '20 × 20 cm', 'Terminación mate'],
    desc: 'Placa floral pintada en rosa empolvado, con terminación mate que deja ver cada relieve. Para colgar o apoyar en un estante.',
    claves: ['placa', 'cuadro', 'flor', 'relieve', 'rosa', 'pared', 'deco'] },
  { id: 'corazon-pintar', nombre: 'Corazón colgante para pintar', cat: 'para-pintar', foto: 'corazon', colores: ['blanco'], precio: 2900, mayor: { desde: 12, precio: 2100 }, rango: 10,
    ficha: ['Yeso natural', '10 cm', 'Con orificio para colgar'],
    desc: 'Corazón con arabescos y una flor en relieve, con orificio para colgar con una cinta. Un clásico para souvenirs de bautismos, cumpleaños y casamientos.',
    claves: ['corazon', 'colgante', 'souvenir', 'souvenirs', 'bautismo', 'casamiento', 'cumpleanos', 'pintar'] },
  { id: 'mariposa-pintar', nombre: 'Mariposa para pintar', cat: 'para-pintar', foto: 'mariposa', colores: ['blanco'], precio: 3600, mayor: { desde: 12, precio: 2600 }, rango: 11,
    ficha: ['Yeso natural', '14 cm de ancho', 'Se apoya sola'],
    desc: 'Mariposa con las alas delineadas en relieve, para pintar sección por sección. Se apoya sola sobre una repisa o una mesa.',
    claves: ['mariposa', 'blanco', 'pintar', 'infantil', 'manualidad', 'souvenir'] },
  { id: 'placa-pintar', nombre: 'Placa floral para pintar', cat: 'para-pintar', foto: 'placa', colores: ['blanco'], precio: 5900, mayor: { desde: 6, precio: 4500 }, rango: 12,
    ficha: ['Yeso natural', '20 × 20 cm', 'Relieve profundo'],
    desc: 'Placa cuadrada con una flor central y hojas en relieve profundo. Para colgar en la pared o apoyar en un estante.',
    claves: ['placa', 'cuadro', 'flor', 'relieve', 'blanco', 'pintar', 'pared'] },
  { id: 'corazon-pintado', nombre: 'Corazón colgante pintado', cat: 'pintadas', foto: 'corazon', colores: ['rosa', 'celeste'], precio: 4800, mayor: { desde: 12, precio: 3600 }, rango: 13,
    ficha: ['Pintado a mano', '10 cm', 'Con orificio para colgar'],
    desc: 'El corazón con arabescos, pintado a mano en rosa o celeste. Listo para colgar con una cinta o para entregar como souvenir.',
    claves: ['corazon', 'colgante', 'souvenir', 'souvenirs', 'bautismo', 'pintado', 'rosa', 'celeste'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const colorDe = id => COLORES.find(c => c.id === id) || COLORES[0];
const fondoColor = id => colorDe(id).hex;
const opsDe = p => (p?.colores?.length ? p.colores : p?.aromas?.length ? p.aromas : []);
const tipoVar = p => (p?.colores?.length ? 'color' : p?.aromas?.length ? 'aroma' : '');
const unidadDe = p => p?.unidad || 'u.';

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, ...(p.ficha || []),
    ...(p.colores || []).map(c => nombreDe(COLORES, c)), ...(p.aromas || []).map(a => nombreDe(AROMAS, a)),
    ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), aroma = lista(f.aroma), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.some(c => (p.colores || []).includes(c))) return false;
    if (aroma.length && !aroma.some(a => (p.aromas || []).includes(a))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.precio < f.precioMin) return false;
    if (f.precioMax != null && p.precio > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, p.precio); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const varValida = (p, v) => { const ops = opsDe(p); return ops.includes(v) ? v : ops[0] || 'U'; };
const imgDe = (p, v) => (p.colores?.length ? `images/p-${p.foto}-${varValida(p, v)}.webp` : `images/${p.img}`);
const altDe = (p, v) => {
  if (tipoVar(p) !== 'color') return p.nombre;
  const c = varValida(p, v);
  if (c === 'blanco') return `${p.nombre}, en yeso natural`;
  if (c === 'pastel') return `${p.nombre}, pintada a mano en tonos pastel`;
  return `${p.nombre}, en ${nombreDe(COLORES, c).toLowerCase()}`;
};
const detalleVar = (p, v) => {
  const t = tipoVar(p);
  const vv = varValida(p, v);
  if (t === 'aroma') return `Aroma ${nombreDe(AROMAS, vv).toLowerCase()}`;
  if (t === 'color') return vv === 'blanco' ? 'Yeso natural' : vv === 'pastel' ? 'Pintada en pasteles' : `Color ${nombreDe(COLORES, vv).toLowerCase()}`;
  return '';
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const unidadesDe = (id, items) => items.filter(i => i.id === id).reduce((s, i) => s + i.qty, 0);
const esMayor = (p, unidades) => !!p?.mayor && unidades >= p.mayor.desde;
const precioUnit = (p, unidades) => (esMayor(p, unidades) ? p.mayor.precio : p.precio);

const guardar = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };

const Cart = {
  KEY: 'majvelas_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { guardar(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = null, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    let sumadas = n;
    if (existing) { const antes = existing.qty; existing.qty = Math.min(existing.qty + n, TOPE_LINEA); sumadas = existing.qty - antes; }
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return sumadas;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    const items = this.get();
    return items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnit(p, unidadesDe(p.id, items)) * i.qty : s; }, 0);
  },
  subtotalMenor() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
  ahorro() { return this.subtotalMenor() - this.total(); },
  sync() {
    const limpias = [];
    let changed = false;
    this.get().forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const MODO_KEY = 'majvelas_modo';
let modo = (() => { try { return localStorage.getItem(MODO_KEY) === 'mayor' ? 'mayor' : 'menor'; } catch { return 'menor'; } })();
const cantInicial = p => (modo === 'mayor' && p?.mayor ? p.mayor.desde : 1);

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1, sm = false) => `<div class="stepper${sm ? ' stepper--sm' : ''}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function swatchesHTML(p, v) {
  if ((p.colores || []).length < 2) return '';
  const sel = varValida(p, v);
  return `<span class="swatches" role="group" aria-label="Color de ${esc(p.nombre)}">${p.colores.map(c => `<button type="button" class="swatch" data-color="${esc(c)}" aria-pressed="${c === sel}" aria-label="${esc(nombreDe(COLORES, c))}" title="${esc(nombreDe(COLORES, c))}"><i style="--c:${fondoColor(c)}"></i></button>`).join('')}</span>`;
}
function aromasHTML(p, v) {
  if (!(p.aromas || []).length) return '';
  const sel = varValida(p, v);
  return `<div class="aromas-sel" role="group" aria-label="Aroma de ${esc(p.nombre)}">${p.aromas.map(a => `<button type="button" class="aroma-btn" data-aroma="${esc(a)}" aria-pressed="${a === sel}">${esc(nombreDe(AROMAS, a))}</button>`).join('')}</div>`;
}
function selectVarHTML(p, v) {
  const ops = opsDe(p);
  if (ops.length < 2) return detalleVar(p, v) ? `<span class="fila-var">${tipoVar(p) === 'color' ? `<i class="dot" style="--c:${fondoColor(varValida(p, v))}" aria-hidden="true"></i>` : ''}${esc(detalleVar(p, v))}</span>` : '';
  const sel = varValida(p, v);
  const lista = tipoVar(p) === 'color' ? COLORES : AROMAS;
  return `<label class="fila-var"><span>${tipoVar(p) === 'color' ? 'Color' : 'Aroma'}</span><select data-var aria-label="${tipoVar(p) === 'color' ? 'Color' : 'Aroma'} de ${esc(p.nombre)}">${ops.map(o => `<option value="${esc(o)}"${o === sel ? ' selected' : ''}>${esc(nombreDe(lista, o))}</option>`).join('')}</select></label>`;
}
function badgeHTML(p) {
  if (p.cat === 'pintadas') return '<span class="prod__badge prod__badge--pintada">Pintada a mano</span>';
  if (p.cat === 'para-pintar') return '<span class="prod__badge">Para pintar</span>';
  if (p.aromas?.length > 1) return `<span class="prod__badge">${p.aromas.length} aromas</span>`;
  return '';
}
function preciosHTML(p) {
  const m = p.mayor;
  if (!m) return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
  if (modo === 'mayor') return `<p class="precio">${formatearPrecio(m.precio)} <small>c/u</small></p><p class="precio-alt"><span class="pill-mayor">desde ${m.desde} ${unidadDe(p)}</span>suelto ${formatearPrecio(p.precio)}</p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p><p class="precio-alt"><span class="pill-mayor">${m.desde} o más</span><b>${formatearPrecio(m.precio)}</b> c/u</p>`;
}
function tablaPreciosHTML(p) {
  const m = p.mayor;
  return `<div class="tabla-precios"><span class="${modo === 'menor' ? 'is-activa' : ''}">Por menor<b>${formatearPrecio(p.precio)}</b></span><span class="${modo === 'mayor' ? 'is-activa' : ''}">${m.desde} o más<b>${formatearPrecio(m.precio)}</b></span></div>`;
}
function celdasPrecioHTML(p) {
  const m = p.mayor;
  return `<p class="celda-precio celda-menor${modo === 'menor' ? ' is-activa' : ''}"><b>${formatearPrecio(p.precio)}</b><small>por menor</small></p><p class="celda-precio celda-mayor${modo === 'mayor' ? ' is-activa' : ''}"><b>${formatearPrecio(m.precio)}</b><small>desde ${m.desde} ${unidadDe(p)}</small></p>`;
}

function cardHTML(p, estilo = 'repisa', anim = '') {
  const v = varValida(p, null);
  const animAttr = anim ? ` ${anim}` : '';
  const id = esc(p.id);
  const img = `<img class="prod__img" src="${esc(imgDe(p, v))}" alt="${esc(altDe(p, v))}" width="1000" height="1000" decoding="async">`;
  const nombre = `<h3 class="prod__nombre"><button type="button" data-qv="${id}">${esc(p.nombre)}</button></h3>`;
  const agregar = `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
  const comprar = `<button type="button" class="prod__comprar" data-comprar="${id}">Comprar ahora ${ICO.flecha}</button>`;
  if (estilo === 'fila-lista') {
    return `<article class="prod prod--lista-row" data-id="${id}" data-v="${esc(v)}"${animAttr}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${img}</button></div>
  <div class="prod__info">${nombre}<p class="prod__ficha">${esc(p.ficha.slice(0, 2).join(' · '))}</p>${selectVarHTML(p, v)}</div>
  ${celdasPrecioHTML(p)}
  <div class="celda-acc">${stepperHTML(cantInicial(p), true)}<button type="button" class="btn-mas" data-sumar="${id}" aria-label="Agregar ${esc(p.nombre)} al pedido">${ICO.mas}</button></div>
</article>`;
  }
  if (estilo === 'fila') {
    return `<article class="prod prod--fila" data-id="${id}" data-v="${esc(v)}"${animAttr}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${img}</button></div>
  <div class="prod__info">
    <p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>
    ${nombre}
    <p class="prod__ficha">${esc(p.ficha.join(' · '))}</p>
    ${aromasHTML(p, v)}
    <div class="precios" data-precios>${preciosHTML(p)}</div>
    <div class="prod__pie"><div class="prod-actions">${stepperHTML(cantInicial(p))}${agregar}</div>${comprar}</div>
  </div>
</article>`;
  }
  const lista = estilo === 'lista';
  const acciones = p.aromas?.length
    ? `<div class="prod-actions"><button type="button" class="btn btn--cta btn--sm prod-add" data-qv="${id}">Elegir aroma</button></div>`
    : `<div class="prod-actions">${stepperHTML(cantInicial(p))}${agregar}</div>${lista ? '' : comprar}`;
  return `<article class="prod prod--${lista ? 'lista' : 'repisa'}" data-id="${id}" data-v="${esc(v)}"${animAttr}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${img}</button>${badgeHTML(p)}${swatchesHTML(p, v)}</div>
  <div class="prod__info">
    ${lista ? '' : `<p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>`}
    ${nombre}
    <p class="prod__ficha">${esc(p.ficha.slice(0, 2).join(' · '))}</p>
    <div class="precios" data-precios>${lista ? tablaPreciosHTML(p) : preciosHTML(p)}</div>
    <div class="prod__pie">${acciones}</div>
  </div>
</article>`;
}

function refrescarCard(card) {
  const p = getProducto(card.dataset.id);
  if (!p) return;
  const precios = card.querySelector('[data-precios]');
  if (card.classList.contains('prod--lista-row')) {
    card.querySelector('.celda-menor')?.classList.toggle('is-activa', modo === 'menor');
    card.querySelector('.celda-mayor')?.classList.toggle('is-activa', modo === 'mayor');
  } else if (precios) {
    precios.innerHTML = card.classList.contains('prod--lista') ? tablaPreciosHTML(p) : preciosHTML(p);
  }
  const out = card.querySelector('[data-qty]');
  if (out) out.textContent = cantInicial(p);
}

function cambiarFoto(img, src, alt) {
  if (!img || img.getAttribute('src') === src) return;
  if (reduceMotion) { img.src = src; img.alt = alt; return; }
  img.classList.add('cambiando');
  const pre = new window.Image();
  pre.onload = pre.onerror = () => { img.src = src; img.alt = alt; requestAnimationFrame(() => img.classList.remove('cambiando')); };
  pre.src = src;
}

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = n ? total : 'Tu pedido'; });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'unidad', 'unidades')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineasDetalle() {
  const items = Cart.get();
  const vistos = new Set();
  return items.map(i => {
    const p = getProducto(i.id);
    if (!p) return null;
    const u = unidadesDe(p.id, items);
    const mayor = esMayor(p, u);
    const unit = precioUnit(p, u);
    const primera = !vistos.has(p.id);
    vistos.add(p.id);
    const falta = p.mayor && !mayor && primera ? p.mayor.desde - u : 0;
    return { i, p, mayor, unit, falta, subtotal: unit * i.qty, varias: opsDe(p).length > 1 };
  }).filter(Boolean);
}
function resumenHTML() {
  const sub = Cart.subtotalMenor();
  const ahorro = Cart.ahorro();
  return `${ahorro > 0 ? `<p><span>Subtotal por menor</span><span>${formatearPrecio(sub)}</span></p><p class="ahorro"><span>Ahorro por mayor</span><span>−${formatearPrecio(ahorro)}</span></p>` : ''}<p class="total"><span>Total</span><output>${formatearPrecio(Cart.total())}</output></p>`;
}
function textoPedido() {
  const lineas = lineasDetalle().map(({ i, p, mayor, unit, subtotal }) => {
    const det = detalleVar(p, i.v);
    return `• ${i.qty} × ${p.nombre}${det ? ` (${det.toLowerCase()})` : ''} — ${formatearPrecio(unit)} c/u${mayor ? ' por mayor' : ''} = ${formatearPrecio(subtotal)}`;
  });
  const ahorro = Cart.ahorro();
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}${ahorro > 0 ? `\nAhorro por mayor: ${formatearPrecio(ahorro)}` : ''}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(d, k) {
  const { i, p, mayor, unit, falta, subtotal } = d;
  const key = `${esc(p.id)}|${esc(i.v)}`;
  const det = detalleVar(p, i.v);
  const dot = tipoVar(p) === 'color' ? `<i class="dot" style="--c:${fondoColor(varValida(p, i.v))}" aria-hidden="true"></i>` : '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(imgDe(p, i.v))}" alt="" width="1000" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${dot}${det ? `${esc(det)} · ` : ''}${formatearPrecio(unit)} c/u${mayor ? ' <span class="pill-mayor">por mayor</span>' : ''}</p>
    ${falta > 0 ? `<p class="linea__falta">Sumá ${falta} más${d.varias ? ' (combinables)' : ''} y pagás ${formatearPrecio(p.mayor.precio)} c/u</p>` : ''}
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(subtotal)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const resumen = drawer.querySelector('[data-drawer-resumen]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const det = lineasDetalle();
    const n = Cart.count();
    cuenta.textContent = n ? `· ${plural(n, 'unidad', 'unidades')}` : '';
    vacio.hidden = det.length > 0;
    foot.hidden = det.length === 0;
    lista.hidden = det.length === 0;
    lista.innerHTML = det.map((d, k) => lineaHTML(d, k)).join('');
    resumen.innerHTML = resumenHTML();
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${window.CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  pintar();
}

function initPedidoPanel() {
  const body = document.querySelector('[data-pedido-body]');
  if (!body) return;
  const pintar = () => {
    const det = lineasDetalle();
    if (!det.length) {
      body.innerHTML = `<p class="pedido__vacio">Todavía no sumaste nada. Elegí cantidades en la lista: cuando llegás al mínimo de un producto, se aplica el precio por mayor.</p><div class="pedido__acc"><a class="btn btn--ghost btn--sm" href="${CATALOGO_URL}">Ver toda la tienda</a></div>`;
      return;
    }
    body.innerHTML = `<div class="pedido__lineas">${det.map(({ i, p, mayor, unit, falta, subtotal, varias }) => {
      const det2 = detalleVar(p, i.v);
      const nota = falta > 0 ? `<small class="falta">Sumá ${falta} más${varias ? ' (combinables)' : ''} y baja a ${formatearPrecio(p.mayor.precio)} c/u</small>` : `<small>${det2 ? `${esc(det2)} · ` : ''}${formatearPrecio(unit)} c/u${mayor ? ' por mayor' : ''}</small>`;
      return `<div class="pedido__linea"><span>${i.qty} × ${esc(p.nombre)}</span><b>${formatearPrecio(subtotal)}</b>${nota}</div>`;
    }).join('')}</div>
<div class="resumen">${resumenHTML()}</div>
<div class="pedido__acc"><button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button><a class="btn btn--ghost btn--block" href="${esc(wspHref(textoPedido()))}" target="_blank" rel="noopener">${ICO.wsp}Enviar por WhatsApp</a><button type="button" class="btn btn--ghost btn--sm btn--block" data-abrir-carrito>Editar cantidades</button></div>`;
  };
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) { showToast(`Llegaste al máximo de ${TOPE_LINEA} para «${p.nombre}»`); return 0; }
  const det = opsDe(p).length > 1 ? ` (${detalleVar(p, v).toLowerCase()})` : '';
  const u = unidadesDe(p.id, Cart.get());
  const extra = esMayor(p, u) ? ' · ya tiene precio por mayor' : '';
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${det}${extra}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function setModo(m, { persistir = true, refrescar = true } = {}) {
  modo = m === 'mayor' ? 'mayor' : 'menor';
  if (persistir) guardar(MODO_KEY, modo);
  document.querySelectorAll('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('[data-modo-explica]').forEach(el => {
    el.textContent = modo === 'mayor'
      ? 'Por mayor: las cantidades arrancan en el mínimo de cada producto y ves primero el precio por mayor.'
      : 'Por menor desde una unidad. Cada producto muestra también su precio por mayor.';
  });
  if (!refrescar) return;
  document.querySelectorAll('.prod[data-id]').forEach(refrescarCard);
  pintarEscaleras();
  if (qvEstado) refrescarQv();
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const ab = e.target.closest('[data-abrir-carrito]');
    if (ab) { window.abrirCarrito?.(ab); return; }
    const md = e.target.closest('[data-modo]');
    if (md) { setModo(md.dataset.modo); return; }
    if (e.target.closest('[data-ir-mayor]')) { setModo('mayor'); return; }
    if (e.target.closest('#quickView')) return;
    const sw = e.target.closest('.swatch[data-color]');
    if (sw) {
      const card = sw.closest('[data-id]');
      const p = card && getProducto(card.dataset.id);
      if (!p) return;
      const v = varValida(p, sw.dataset.color);
      card.dataset.v = v;
      card.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === sw)));
      cambiarFoto(card.querySelector('.prod__img'), imgDe(p, v), altDe(p, v));
      return;
    }
    const ar = e.target.closest('.aroma-btn[data-aroma]');
    if (ar) {
      const card = ar.closest('[data-id]');
      const p = card && getProducto(card.dataset.id);
      if (!p) return;
      card.dataset.v = varValida(p, ar.dataset.aroma);
      card.querySelectorAll('.aroma-btn').forEach(b => b.setAttribute('aria-pressed', String(b === ar)));
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out) out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const p = getProducto(s ? s.dataset.sumar : c.dataset.comprar);
      const n = sumar(p?.id, cont?.dataset.v || null, cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out && p) out.textContent = cantInicial(p);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: qv.closest('[data-id]')?.dataset.v || null });
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('select[data-var]');
    if (!sel) return;
    const card = sel.closest('[data-id]');
    const p = card && getProducto(card.dataset.id);
    if (!p) return;
    const v = varValida(p, sel.value);
    card.dataset.v = v;
    if (tipoVar(p) === 'color') cambiarFoto(card.querySelector('.prod__img'), imgDe(p, v), altDe(p, v));
  });
}

let qvEstado = null;
function qvPreciosHTML(p) {
  const m = p.mayor;
  return `<div class="qv__precio${modo === 'menor' ? ' is-activa' : ''}">Por menor<b>${formatearPrecio(p.precio)}</b>c/u</div><div class="qv__precio${modo === 'mayor' ? ' is-activa' : ''}">Desde ${m.desde} ${unidadDe(p)}<b>${formatearPrecio(m.precio)}</b>c/u por mayor</div>`;
}
function refrescarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  const box = modal.querySelector('[data-qv-precios]');
  if (box) box.innerHTML = qvPreciosHTML(p);
  const out = modal.querySelector('.qv__grid [data-qty]');
  if (out) out.textContent = cantInicial(p);
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  qvEstado = { id: p.id, v: vv };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const t = tipoVar(p);
  let variantes = '';
  if (t === 'color' && p.colores.length > 1) {
    variantes = `<p class="qv__var-t">Color: <span data-qv-var>${esc(nombreDe(COLORES, vv))}</span></p><div class="colores" role="group" aria-label="Color">${p.colores.map(c => `<button type="button" class="color-btn" data-color="${esc(c)}" aria-pressed="${c === vv}"><i style="--c:${fondoColor(c)}"></i><span>${esc(nombreDe(COLORES, c))}</span></button>`).join('')}</div>`;
  } else if (t === 'aroma') {
    variantes = `<p class="qv__var-t">Aroma: <span data-qv-var>${esc(nombreDe(AROMAS, vv))}</span></p>${aromasHTML(p, vv)}`;
  }
  const d = p.mayor.desde;
  const cantidades = `<div class="cantidades"><span>Cantidad rápida</span>${[1, d, d * 2].map(n => `<button type="button" class="cant-btn" data-cant="${n}">${n} ${n === 1 ? (p.unidad === 'cajas' ? 'caja' : 'unidad') : unidadDe(p)}</button>`).join('')}</div>`;
  const nota = p.cat === 'para-pintar'
    ? `<p class="qv__nota">¿La querés pintada? <a href="${esc(wspHref(`Hola! Me interesa «${p.nombre}» de ${MARCA} pintado. ¿Qué colores tienen?`))}" target="_blank" rel="noopener">Consultá colores por WhatsApp</a>.</p>`
    : '';
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <figure class="qv__foto"><img src="${esc(imgDe(p, vv))}" alt="${esc(altDe(p, vv))}" width="1000" height="1000"></figure>
  <div class="qv__info">
    <p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>
    <h2>${esc(p.nombre)}</h2>
    <ul class="qv__ficha">${p.ficha.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    <div class="qv__precios" data-qv-precios>${qvPreciosHTML(p)}</div>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${variantes}
    ${cantidades}
    <div class="qv__acciones">${stepperHTML(cantInicial(p))}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    ${nota}
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(imgDe(r, null))}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { qvEstado = null; if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const col = e.target.closest('.color-btn[data-color], .aroma-btn[data-aroma]');
    if (col) {
      const v = varValida(p, col.dataset.color || col.dataset.aroma);
      qvEstado.v = v;
      cont.querySelectorAll('.color-btn, .aroma-btn').forEach(b => b.setAttribute('aria-pressed', String(b === col)));
      const tv = cont.querySelector('[data-qv-var]');
      if (tv) tv.textContent = nombreDe(tipoVar(p) === 'color' ? COLORES : AROMAS, v);
      if (tipoVar(p) === 'color') cambiarFoto(cont.querySelector('.qv__foto img'), imgDe(p, v), altDe(p, v));
      return;
    }
    const cant = e.target.closest('[data-cant]');
    if (cant) { cont.querySelector('[data-qty]').textContent = Math.min(parseInt(cant.dataset.cant, 10) || 1, TOPE_LINEA); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = sumar(p.id, qvEstado.v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = cantInicial(p);
      if (comprar && n) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(imgDe(p, null), location.href).href, brand: { '@type': 'Brand', name: MARCA }, category: catDe(p.cat).nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { return; }
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
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['color', 'aroma', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="1000" height="1000"><span><b>${esc(c.nombre)}</b><small>${plural(r.n, 'producto', 'productos')} · desde ${formatearPrecio(r.desde)}</small></span></a></li>`;
    }).join('');
  });
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.textContent = `${plural(r.n, 'producto', 'productos')} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    const p = getProducto(el.dataset.desde);
    if (p) el.textContent = formatearPrecio(p.precio);
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

const ANIM = {
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
};
function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 16) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'repisa';
    const anim = ANIM[cont.dataset.anim] || ANIM.subir;
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const esLista = cont.tagName === 'UL';
    const claseLi = estilo === 'repisa' ? 'rail-item' : 'item';
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const todos = productosPorIds(ids);
    const pintar = (tab = '') => {
      let prods = todos;
      if (tab) { const [k, v] = tab.split(':'); prods = todos.filter(p => p[k] === v); }
      prods = prods.slice(0, limite);
      cont.innerHTML = prods.map(p => (esLista ? `<li class="${claseLi}" ${anim}>${cardHTML(p, estilo)}</li>` : cardHTML(p, estilo, anim))).join('');
      if (verTodo) {
        const [k, v] = tab ? tab.split(':') : [];
        verTodo.href = tab ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
      }
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function pintarEscaleras() {
  document.querySelectorAll('[data-escalera]').forEach(ul => {
    const ids = ul.dataset.escalera.split(',').map(s => s.trim());
    const ya = ul.dataset.pintada === '1';
    ul.innerHTML = productosPorIds(ids).map(p => {
      const d = p.mayor.desde;
      const anim = ya ? '' : ' data-animate="subir" style="opacity:0;transform:translateY(24px)"';
      return `<li class="escalon"${anim}><span class="escalon__n">${esc(p.nombre)}</span><span class="escalon__p${modo === 'menor' ? ' is-activa' : ''}">1 a ${d - 1} ${unidadDe(p)}<b>${formatearPrecio(p.precio)} c/u</b></span>${ICO.flecha}<span class="escalon__p${modo === 'mayor' ? ' is-activa' : ''}">${d} o más<b>${formatearPrecio(p.mayor.precio)} c/u</b></span></li>`;
    }).join('');
    if (ya) ul.querySelectorAll('.escalon').forEach(li => li.classList.add('in'));
    ul.dataset.pintada = '1';
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    const paso = () => {
      const it = track?.querySelector('.rail-item');
      return it ? it.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 0) : vp.clientWidth * 0.8;
    };
    const sync = () => {
      if (!prev || !next) return;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
    let down = false, moved = false, x0 = 0, s0 = 0, pointerId = null;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId;
    });
    vp.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { return; }
      }
      if (moved) { vp.scrollLeft = s0 - dx; e.preventDefault(); }
    });
    const end = () => {
      if (!down) return;
      down = false;
      try { vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
      if (moved) {
        const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
        vp.addEventListener('click', kill, { capture: true, once: true });
        setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 80);
      }
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
  });
}

function initLupa() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.foto__btn').forEach(b => {
    const img = b.querySelector('img');
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      img.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`);
      img.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const vacioWsp = document.querySelector('[data-vacio-wsp]');
  const estilo = MODELO === '2' ? 'lista' : 'repisa';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const COLORES_F = COLORES.filter(c => PRODUCTOS.some(p => (p.colores || []).includes(c.id)));
  const AROMAS_F = AROMAS.filter(a => PRODUCTOS.some(p => (p.aromas || []).includes(a.id)));
  const GRUPOS = { cat: CATEGORIAS, aroma: AROMAS_F, color: COLORES_F };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    aroma: valida(params.get('aroma'), AROMAS_F),
    color: valida(params.get('color'), COLORES_F),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${grupo === 'color' ? `<i class="dot" style="--c:${fondoColor(item.id)}" aria-hidden="true"></i>` : ''}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const usados = Object.keys(GRUPOS).filter(k => e[k].length);
    if (usados.length === 1 && usados[0] === 'cat' && e.cat.length === 2 && e.cat.includes('pintadas') && e.cat.includes('para-pintar')) return 'Figuras de yeso';
    if (usados.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.aroma.length === 1) return `Aroma ${nombreDe(AROMAS, e.aroma[0]).toLowerCase()}`;
    if (e.color.length === 1) return e.color[0] === 'blanco' ? 'En yeso natural' : `En ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Toda la tienda';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Tienda'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo, ANIM.subir)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (!mostrados && vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola! Busqué «${e.q}» en la tienda de ${MARCA} y no lo encontré. ¿Lo tienen?` : `Hola! Vengo de la tienda de ${MARCA} y quiero hacer una consulta.`);
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  const headerQ = document.querySelector('.buscador--header input');
  if (headerQ && e.q) headerQ.value = e.q;
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  const arco = hero.querySelector('.hero-arco');
  if (arco) tl.fromTo(arco, { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 16px 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 16px 16px)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.ficha-modo .hero__logo', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.3);
  desde('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.12);
  desde('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero__tel', { y: 12, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.8);
  desde('.hero-circulo', { scale: 0.92, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.5);
  desde('.hero-sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  desde('.ficha-modo > :not(.hero__logo)', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.45);
}

function initModo() {
  setModo(modo, { persistir: false, refrescar: false });
}

[
  initPreviews, pintarEscaleras, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initNav, initDrawer,
  initPedidoPanel, initVistaRapida, initCompras, initRail, initLupa, initModo, initFloats, initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); } catch (err) { console.error(err); }
updateCartBadge();
