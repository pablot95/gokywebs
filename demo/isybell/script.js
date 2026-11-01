const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493492703495';
const MARCA = 'Isybell';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'cabina', nombre: 'Cosmética de cabina', uno: 'Cabina', bajada: 'Limpieza, hidratación y masajes', img: 'images/p-gel-limpieza.webp' },
  { id: 'gabinete', nombre: 'Accesorios de gabinete', uno: 'Gabinete', bajada: 'Máscaras, envases y toallas', img: 'images/p-kit-mascaras.webp' },
  { id: 'unas', nombre: 'Uñas', uno: 'Uñas', bajada: 'Semipermanente, limas y pulidores', img: 'images/p-esmaltes.webp' },
  { id: 'mirada', nombre: 'Pestañas y cejas', uno: 'Pestañas y cejas', bajada: 'Extensiones, pinzas y perfilado', img: 'images/p-pestanas.webp' },
  { id: 'peluqueria', nombre: 'Peluquería', uno: 'Peluquería', bajada: 'Secado, cepillos y peines', img: 'images/p-secador.webp' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: null, max: 10000 },
  { id: '10a20', nombre: '$10.000 a $20.000', min: 10001, max: 20000 },
  { id: 'mas20', nombre: 'Más de $20.000', min: 20001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  cabina: 'cosmetica cabina facial corporal limpieza hidratacion hidratante crema gel emulsion masaje masajes aceite piel cosmiatria tratamiento tratamientos',
  gabinete: 'gabinete accesorios mascara mascaras bowl bol espatula pincel pinceles potes pote envases envase frasco fraccionar toalla toallas algodon',
  unas: 'unas manicura pedicura pies manos esmalte esmaltes semipermanente semi lima limas pulidor nail nails',
  mirada: 'pestanas extensiones pelo a pelo lifting cejas perfilado mirada lash brow',
  peluqueria: 'peluqueria pelo cabello brushing capilar',
};

const Tienda = crearTienda([
  { id: 'gel-limpieza', nombre: 'Gel de limpieza facial de cabina 500 ml', cat: 'cabina', precio: 18900, descuento: 0, stock: 14, alta: 30, rango: 1, tag: 'nuevo',
    img: 'images/p-gel-limpieza.webp', galeria: ['images/hero-insumos.webp'],
    alt: 'Envase blanco de 500 ml con válvula y collar de bambú, junto a una emulsión y una crema',
    desc: 'Gel suave para la limpieza facial en cabina, antes de cualquier tratamiento. Envase de 500 ml con válvula dosificadora.',
    datos: [['Presentación', '500 ml con válvula'], ['Uso', 'Limpieza previa al tratamiento'], ['Piel', 'Todo tipo de piel']] },
  { id: 'semipermanente', nombre: 'Esmalte semipermanente 10 ml', cat: 'unas', variante: { nombre: 'Tono', opciones: ['Rosa viejo', 'Nude rosado', 'Durazno'] }, precio: 5900, descuento: 0, stock: 40, alta: 29, rango: 2,
    img: 'images/p-esmalte.webp', galeria: ['images/p-esmaltes.webp'],
    alt: 'Frasco de esmalte semipermanente color nude rosado con tapa negra',
    desc: 'Esmalte semipermanente de 10 ml para curar en cabina con lámpara UV o LED. Elegí el tono antes de sumarlo al carrito.',
    datos: [['Presentación', '10 ml'], ['Secado', 'Lámpara UV o LED'], ['Tonos', 'Rosa viejo, nude rosado y durazno']] },
  { id: 'aceite-masajes', nombre: 'Aceite neutro para masajes 1 L', cat: 'cabina', precio: 12900, descuento: 0, stock: 18, alta: 26, rango: 3,
    img: 'images/p-aceite-masajes.webp', galeria: ['images/p-toallas.webp'],
    alt: 'Frasco ámbar con válvula negra junto a tres toallas blancas enrolladas sobre una bandeja',
    desc: 'Aceite neutro para masajes corporales y descontracturantes. Frasco de 1 litro con válvula, para usar en camilla.',
    datos: [['Presentación', '1 litro con válvula'], ['Uso', 'Masajes corporales'], ['Aroma', 'Neutro']] },
  { id: 'emulsion', nombre: 'Emulsión hidratante 250 ml', cat: 'cabina', precio: 14500, descuento: 0, stock: 10, alta: 25, rango: 4,
    img: 'images/p-emulsion.webp',
    alt: 'Envase de emulsión hidratante con válvula y collar de bambú',
    desc: 'Emulsión liviana para cerrar los tratamientos faciales y para el masaje final. Se absorbe rápido y no deja la piel grasa.',
    datos: [['Presentación', '250 ml con válvula'], ['Uso', 'Cierre de tratamientos'], ['Textura', 'Liviana']] },
  { id: 'pestanas', nombre: 'Pestañas pelo a pelo, bandeja de 12 líneas', cat: 'mirada', variante: { nombre: 'Curva', opciones: ['Curva C', 'Curva D'] }, precio: 8400, descuento: 0, stock: 25, alta: 28, rango: 5,
    img: 'images/p-pestanas.webp',
    alt: 'Dos bandejas de pestañas para extensiones pelo a pelo y cajas apiladas',
    desc: 'Bandeja de 12 líneas mixtas para extensiones pelo a pelo, de 8 a 14 mm. Elegí la curva que trabajás.',
    datos: [['Contenido', '12 líneas de 8 a 14 mm'], ['Grosor', '0,15 mm'], ['Curva', 'C o D']] },
  { id: 'kit-mascaras', nombre: 'Kit para máscaras: bowl, espátula y 2 pinceles', cat: 'gabinete', precio: 9800, descuento: 10, stock: 12, alta: 27, rango: 6,
    img: 'images/p-kit-mascaras.webp',
    alt: 'Bowl blanco, espátula de silicona y dos pinceles para máscaras sobre una piedra clara',
    desc: 'Todo para preparar y aplicar máscaras en cabina: bowl, espátula de silicona y dos pinceles de cerda suave.',
    datos: [['Contenido', 'Bowl, espátula y 2 pinceles'], ['Pinceles', 'Cerda sintética suave'], ['Uso', 'Máscaras faciales y corporales']] },
  { id: 'kit-cejas', nombre: 'Kit de perfilado de cejas', cat: 'mirada', precio: 10500, descuento: 0, stock: 11, alta: 24, rango: 7,
    img: 'images/p-kit-cejas.webp',
    alt: 'Bandeja con dos cepillos para cejas, tijera y pinza en verde salvia',
    desc: 'Dos cepillos, tijera curva y pinza de punta recta en su bandeja, para el perfilado y el diseño de cejas.',
    datos: [['Contenido', '2 cepillos, tijera y pinza'], ['Bandeja', 'Incluida'], ['Uso', 'Perfilado y diseño']] },
  { id: 'secador', nombre: 'Secador profesional 2200 W', cat: 'peluqueria', precio: 89900, descuento: 0, stock: 4, alta: 23, rango: 8,
    img: 'images/p-secador.webp',
    alt: 'Secador de pelo profesional negro con boquilla, junto a un cepillo y un peine',
    desc: 'Secador profesional de 2200 W con dos velocidades, botón de aire frío y boquilla concentradora para el brushing.',
    datos: [['Potencia', '2200 W'], ['Velocidades', '2 y aire frío'], ['Incluye', 'Boquilla concentradora']] },
  { id: 'potes', nombre: 'Potes y frasco para fraccionar (set de 4)', cat: 'gabinete', precio: 7600, descuento: 0, stock: 20, alta: 20, rango: 9,
    img: 'images/p-potes.webp',
    alt: 'Potes y frasco de vidrio esmerilado con tapas blancas sobre una piedra clara',
    desc: 'Set de envases de vidrio esmerilado para fraccionar cremas y lociones: dos potes de 50 g, uno de 100 g y un frasco de 100 ml con válvula.',
    datos: [['Contenido', '3 potes y 1 frasco'], ['Material', 'Vidrio esmerilado'], ['Tapa', 'Blanca, a rosca']] },
  { id: 'trio-semipermanente', nombre: 'Trío de semipermanentes: rosa viejo, nude y durazno', cat: 'unas', precio: 17700, descuento: 10, stock: 9, alta: 22, rango: 10,
    img: 'images/p-esmaltes.webp',
    alt: 'Tres esmaltes semipermanentes en rosa viejo, nude rosado y durazno, con una lima y un bloque pulidor',
    desc: 'Los tres tonos de semipermanente juntos: rosa viejo, nude rosado y durazno, de 10 ml cada uno.',
    datos: [['Contenido', '3 esmaltes de 10 ml'], ['Tonos', 'Rosa viejo, nude rosado y durazno'], ['Secado', 'Lámpara UV o LED']] },
  { id: 'crema-nutritiva', nombre: 'Crema nutritiva de cabina 250 g', cat: 'cabina', precio: 16800, descuento: 0, stock: 8, alta: 21, rango: 11,
    img: 'images/p-crema.webp',
    alt: 'Pote de vidrio abierto con crema blanca nutritiva',
    desc: 'Crema nutritiva de textura rica para masajes faciales y para pieles secas. Pote de 250 g para usar en cabina.',
    datos: [['Presentación', '250 g'], ['Uso', 'Masaje facial'], ['Piel', 'Seca o deshidratada']] },
  { id: 'pinzas', nombre: 'Pinzas para extensiones (set de 3)', cat: 'mirada', precio: 13200, descuento: 0, stock: 5, alta: 19, rango: 12,
    img: 'images/p-pinzas.webp',
    alt: 'Tres pinzas de acero para extensiones de pestañas: recta, curva y en L',
    desc: 'Set de tres pinzas de acero inoxidable para aislar y colocar extensiones: recta, curva y en L.',
    datos: [['Contenido', 'Recta, curva y en L'], ['Material', 'Acero inoxidable'], ['Uso', 'Aislado y colocación']] },
  { id: 'lima-pulidor', nombre: 'Lima 100/180 y bloque pulidor', cat: 'unas', precio: 2900, descuento: 0, stock: 30, alta: 18, rango: 13,
    img: 'images/p-lima-pulidor.webp',
    alt: 'Lima de uñas gris y bloque pulidor rosa',
    desc: 'Lima de doble grano 100/180 para dar forma y bloque pulidor para preparar la uña antes del semipermanente.',
    datos: [['Lima', 'Grano 100/180'], ['Bloque', 'Pulidor'], ['Uso', 'Manos y pies']] },
  { id: 'toallas', nombre: 'Toallas de mano de algodón (pack de 3)', cat: 'gabinete', precio: 11400, descuento: 0, stock: 9, alta: 17, rango: 14,
    img: 'images/p-toallas.webp',
    alt: 'Tres toallas blancas de algodón enrolladas sobre una bandeja de piedra',
    desc: 'Pack de tres toallas de mano de algodón blanco, para camilla, lavacabezas o manicura.',
    datos: [['Contenido', '3 toallas'], ['Material', 'Algodón'], ['Color', 'Blanco']] },
  { id: 'cepillo-peine', nombre: 'Cepillo térmico, peine y 4 pinzas de sección', cat: 'peluqueria', precio: 15600, descuento: 0, stock: 13, alta: 16, rango: 15,
    img: 'images/p-cepillo-peine.webp',
    alt: 'Cepillo térmico redondo, peine de corte y pinzas de sección negras sobre una mesada',
    desc: 'Cepillo térmico redondo para el brushing, peine de corte y cuatro pinzas para separar mechones.',
    datos: [['Contenido', 'Cepillo, peine y 4 pinzas'], ['Cepillo', 'Térmico redondo'], ['Uso', 'Brushing y corte']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, ETIQUETAS[p.cat] || '', ...((p.variante && p.variante.opciones) || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => ((p.variante && p.variante.opciones) || []).length > 1;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'isybell_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const enCarrito = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const libre = Math.max(0, (producto.stock ?? 99) - enCarrito);
    const suma = Math.min(qty, libre);
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === (v || ''));
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: v || '', qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === (v || '')); if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i !== it && i.id === id).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otros)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
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
function abrirCapa(el, { alCerrar, alTeclear } = {}) {
  const previo = document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else if (alTeclear && alTeclear(e)) return;
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 380);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  if (p.tag === 'nuevo') b.push('<span class="badge badge--nuevo">Nuevo</span>');
  else if (p.stock > 0 && p.stock <= 5) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
function precioHTML(p, clase = 'precio') {
  return p.descuento > 0
    ? `<p class="${clase} precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`
    : `<p class="${clase}">${formatearPrecio(p.precio)}</p>`;
}
function etiquetaCard(p) {
  const uno = CATEGORIAS.find(c => c.id === p.cat)?.uno || '';
  const n = conVar(p) ? p.variante.opciones.length : 0;
  const extra = n ? `${n} ${p.variante.nombre === 'Tono' ? 'tonos' : 'curvas'}` : '';
  return [uno, extra].filter(Boolean).join(' · ');
}

function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const clases = estilo === 'vitrina' ? 'prod prod--vitrina' : 'prod prod--ficha';
  const accion = conVar(p)
    ? `<button type="button" class="btn btn--ghost btn--sm prod-add" data-qv="${esc(p.id)}">Elegir ${esc(p.variante.nombre.toLowerCase())}</button>`
    : `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output aria-live="polite">1</output><button type="button" data-paso="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div><button type="button" class="btn btn--cta btn--sm prod-add" data-add="${esc(p.id)}">Agregar</button>`;
  return `<article class="${clases}" data-id="${esc(p.id)}"${anim}>
  <button type="button" class="prod__media" data-qv="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">${badgesHTML(p)}<img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async">${precioHTML(p, 'precio precio--foto')}</button>
  <div class="prod__body">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, 'precio precio--linea')}
    <div class="prod-actions">${accion}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre}${i.v ? ` (${i.v})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola Isybell! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? `${n} ${n === 1 ? 'producto' : 'productos'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => {
      const p = getProducto(i.id);
      if (!p) return '';
      const otros = items.filter(x => x !== i && x.id === i.id).reduce((s, x) => s + x.qty, 0);
      const tope = (p.stock ?? 99) - otros;
      const clave = esc(claveLinea(i.id, i.v));
      return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="76" height="76">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p>${i.v ? `<p class="linea__var">${esc(i.v)}</p>` : ''}</div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar uno"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p></div>
  </div>
</li>`;
    }).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { const k = q.dataset.quitar.indexOf('|'); Cart.remove(q.dataset.quitar.slice(0, k), q.dataset.quitar.slice(k + 1)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const k = b.dataset.linea.indexOf('|');
      const id = b.dataset.linea.slice(0, k), v = b.dataset.linea.slice(k + 1);
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = () => { pintar(); abrirCapa(drawer); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', window.abrirCarrito));
  pintar();
}

function initCompras() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-id]');
      const p = card ? getProducto(card.dataset.id) : null;
      const out = st.querySelector('output');
      const max = Math.max(1, p?.stock ?? 99);
      const n = Math.max(1, Math.min(max, Number(out.textContent) + Number(paso.dataset.paso)));
      out.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const out = add.closest('.prod-actions')?.querySelector('output');
      const qty = Number(out?.textContent || 1);
      const sumo = Cart.add(p, qty);
      if (sumo) {
        showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre} al carrito`);
        if (out) { out.textContent = 1; const st = out.closest('[data-stepper]'); st.querySelector('[data-paso="-1"]').disabled = true; st.querySelector('[data-paso="1"]').disabled = (p.stock ?? 99) <= 1; }
      } else showToast('Ya tenés en el carrito todas las unidades disponibles');
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const fotos = [p.img, ...(p.galeria || [])];
  qvEstado = { id: p.id, v: '', qty: 1 };
  const max = Math.max(1, p.stock ?? 99);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const opciones = conVar(p) ? p.variante.opciones : [];
  const varNom = conVar(p) ? p.variante.nombre : '';
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(fotos[0])}" alt="${esc(p.alt)}" width="1000" height="1000" data-qv-foto></div>
    ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, k) => `<button type="button" data-qv-thumb="${esc(f)}" aria-pressed="${k === 0}" aria-label="Ver foto ${k + 1}"><img src="${esc(f)}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv__info">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${opciones.length ? `<div class="qv__var"><p>${esc(varNom)}: <span data-qv-elegida>elegí una opción</span></p><div class="chips" role="group" aria-label="${esc(varNom)}">${opciones.map(o => `<button type="button" class="chip" data-qv-op="${esc(o)}" aria-pressed="false">${esc(o)}</button>`).join('')}</div><p class="qv__error" data-qv-error hidden>Elegí ${varNom === 'Tono' ? 'el tono' : 'la curva'} para sumarlo al carrito.</p></div>` : ''}
    <dl class="qv__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="qv__acciones">
      <div class="stepper"><button type="button" data-qv-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar uno"${max <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__stock">${p.stock === 1 ? 'Queda 1 sola unidad' : p.stock <= 5 ? `Quedan ${p.stock} unidades` : `Hay ${p.stock} disponibles`}</p>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede servir</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const ponerCant = (p, n) => {
    const max = Math.max(1, p.stock ?? 99);
    qvEstado.qty = Math.max(1, Math.min(max, n));
    modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
    modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
    modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= max;
  };
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const th = e.target.closest('[data-qv-thumb]');
    if (th) {
      modal.querySelector('[data-qv-foto]').src = th.dataset.qvThumb;
      modal.querySelectorAll('[data-qv-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th)));
      return;
    }
    const op = e.target.closest('[data-qv-op]');
    if (op) {
      qvEstado.v = op.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === op)));
      modal.querySelector('[data-qv-elegida]').textContent = qvEstado.v;
      modal.querySelector('[data-qv-error]').hidden = true;
      return;
    }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { ponerCant(p, qvEstado.qty + Number(paso.dataset.qvPaso)); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (conVar(p) && !qvEstado.v) {
        modal.querySelector('[data-qv-error]').hidden = false;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const sumo = Cart.add(p, qvEstado.qty, conVar(p) ? qvEstado.v : '');
      if (!sumo) { showToast('Ya tenés en el carrito todas las unidades disponibles'); return; }
      if (comprar) { cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(); }
      else showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre}${qvEstado.v ? ` (${qvEstado.v.toLowerCase()})` : ''} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || v === false || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v === true ? '1' : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  const actual = new URLSearchParams(location.search).get('cat');
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${PAGINA === 'catalogo' && actual === c.id ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="48" height="48"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const hover = window.matchMedia('(hover: hover) and (min-width: 961px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (hover.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen.split(',') });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 8) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    cont.innerHTML = productosPorIds(idsDe(cont, 'data-preview')).map(p => cardHTML(p, cont.dataset.estilo || 'ficha')).join('');
  });
}

function initEspecialidades() {
  const box = document.querySelector('[data-esp]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panel = box.querySelector('[data-esp-panel]');
  const pintar = (tab, animar) => {
    const c = CATEGORIAS.find(x => x.id === tab.dataset.cat);
    if (!c) return;
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    const items = Tienda.consultar({ filtros: { cat: c.id }, limite: 3 }).items;
    const r = Tienda.resumen({ cat: c.id });
    const intro = `<a class="esp__intro esp__intro--${4 - items.length}" href="${CATALOGO_URL}?cat=${c.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <span class="esp__txt"><span class="esp__num" aria-hidden="true">${String(r.n).padStart(2, '0')}</span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small><span class="esp__ver">Ver los ${r.n} productos ${ICO.flecha}</span></span>
</a>`;
    panel.innerHTML = intro + items.map(p => cardHTML(p, 'vitrina', animar)).join('');
    if (animar) revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => pintar(t, true));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(k + d + tabs.length) % tabs.length];
      n.focus(); pintar(n, true);
    });
  });
  pintar(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], true);
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
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => (arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id));
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    oferta: params.get('oferta') === '1',
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'oferta' && e.oferta) f.oferta = true;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) =>
    `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cats]').innerHTML = CATEGORIAS.map(c => opcion('checkbox', 'cat', c, e.cat.includes(c.id), Tienda.contar({ ...filtros('cat'), cat: c.id }))).join('');
    panel.querySelector('[data-f-oferta]').innerHTML = opcion('checkbox', 'oferta', { id: '1', nombre: 'Con descuento' }, e.oferta, Tienda.contar({ ...filtros('oferta'), oferta: true }));
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...(e.oferta ? [{ k: 'oferta', id: '1', t: 'Con descuento' }] : []),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = e.cat.length + (e.oferta ? 1 : 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const unaCat = e.cat.length === 1 ? CATEGORIAS.find(c => c.id === e.cat[0]) : null;
    if (titulo) titulo.textContent = unaCat ? unaCat.nombre : e.cat.length > 1 ? e.cat.map(id => nombreDe(CATEGORIAS, id)).join(' · ') : 'Insumos de estética';
    if (miga) { miga.hidden = !unaCat; miga.textContent = unaCat ? unaCat.nombre : ''; }
    document.title = `${unaCat ? unaCat.nombre : 'Catálogo'} — Isybell | Insumos de estética en Rafaela`;
  }
  function sincronizarUrl() {
    setParam('cat', e.cat); setParam('oferta', e.oferta); setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
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
    else if (g === 'oferta') e.oferta = inp.checked;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { e.cat = []; e.oferta = false; e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (k === 'cat') e.cat = e.cat.filter(x => x !== v);
      else if (k === 'oferta') e.oferta = false;
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => { if (mq.matches) abrirPanel(); inputQ.focus(); }, 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
  else if (prod) setParam('producto', null);
}

const EQUIPOS = {
  multifuncion: 'Equipo multifunción corporal y facial',
  laser: 'Láser diodo para depilación',
  hifu: 'HIFU facial y corporal',
  dermapen: 'Dermapen para microneedling',
};
function fechaLinda(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? `${Number(m[3])}/${Number(m[2])}` : '';
}
function initAlquiler() {
  const form = document.querySelector('[data-alquiler]');
  if (!form) return;
  const prev = form.querySelector('[data-alq-preview]');
  const btn = form.querySelector('[data-alq-wsp]');
  const fecha = form.querySelector('[data-alq-fecha]');
  const lugar = form.querySelector('[data-alq-lugar]');
  try {
    const hoy = new Date();
    fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  } catch { }
  const est = { equipo: 'multifuncion', plazo: 'Por semana' };
  const marcar = (attr, val) => form.querySelectorAll(`[${attr}]`).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)));
  const pintar = () => {
    const f = fechaLinda(fecha.value);
    const donde = String(lugar.value || '').replace(/[<>]/g, '').trim().slice(0, 40);
    const msg = `Hola Isybell! Quiero consultar por el alquiler del ${EQUIPOS[est.equipo]}, ${est.plazo.toLowerCase()}${f ? `, desde el ${f}` : ''}. Lo usaría en ${donde || 'Rafaela'}. ¿Está disponible y qué precio tiene?`;
    prev.textContent = msg;
    btn.href = wspHref(msg);
    marcar('data-alq-equipo', est.equipo);
    marcar('data-alq-plazo', est.plazo);
  };
  form.addEventListener('click', e => {
    const eq = e.target.closest('[data-alq-equipo]');
    if (eq) { est.equipo = eq.dataset.alqEquipo; pintar(); return; }
    const pl = e.target.closest('[data-alq-plazo]');
    if (pl) { est.plazo = pl.dataset.alqPlazo; pintar(); }
  });
  document.querySelectorAll('[data-elegir-equipo]').forEach(b => b.addEventListener('click', () => {
    est.equipo = b.dataset.elegirEquipo; pintar();
    form.querySelector(`[data-alq-equipo="${est.equipo}"]`)?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }));
  form.addEventListener('input', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  pintar();
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const fotos = [...document.querySelectorAll('[data-foto]')];
  if (!visor || !fotos.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const tit = visor.querySelector('[data-visor-tit]');
  const txt = visor.querySelector('[data-visor-txt]');
  const cuenta = visor.querySelector('[data-visor-cuenta]');
  const wsp = visor.querySelector('[data-visor-wsp]');
  let i = 0;
  const ir = k => {
    i = (k + fotos.length) % fotos.length;
    const f = fotos[i];
    const im = f.querySelector('img');
    img.src = im.getAttribute('src');
    img.alt = im.getAttribute('alt');
    img.width = Number(im.getAttribute('width')); img.height = Number(im.getAttribute('height'));
    tit.textContent = f.dataset.titulo;
    txt.textContent = f.dataset.texto;
    cuenta.textContent = `${i + 1} / ${fotos.length}`;
    wsp.href = wspHref(`Hola Isybell! Quiero pedir un turno para ${f.dataset.servicio}.`);
  };
  fotos.forEach((f, k) => f.addEventListener('click', e => {
    const rail = f.closest('.rail-vp');
    if (rail && rail.dataset.arrastrado === '1') return;
    e.preventDefault();
    f.focus({ preventScroll: true });
    ir(k);
    abrirCapa(visor, { alTeclear: ev => { if (ev.key === 'ArrowRight') { ir(i + 1); return true; } if (ev.key === 'ArrowLeft') { ir(i - 1); return true; } return false; } });
    setTimeout(() => visor.querySelector('.visor__cerrar')?.focus(), 60);
  }));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) { cerrarCapa(visor); return; }
    if (e.target.closest('[data-visor-prev]')) ir(i - 1);
    if (e.target.closest('[data-visor-next]')) ir(i + 1);
  });
}

function initRails() {
  document.querySelectorAll('[data-rail-box]').forEach(box => {
    const vp = box.querySelector('.rail-vp');
    if (!vp) return;
    const track = vp.querySelector('.rail-track');
    const prev = box.querySelector('[data-rail-prev]');
    const next = box.querySelector('[data-rail-next]');
    const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
    const flechas = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();
    let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId; vp.dataset.arrastrado = '0';
    });
    vp.addEventListener('pointermove', e => {
      if (!activo) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { }
      }
      if (moved) vp.scrollLeft = s0 - dx;
    });
    const end = () => {
      if (!activo) return;
      activo = false;
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      if (moved) {
        vp.dataset.arrastrado = '1';
        setTimeout(() => { vp.dataset.arrastrado = '0'; }, 60);
      }
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
    vp.addEventListener('click', e => { if (vp.dataset.arrastrado === '1') { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function initMapa() {
  document.querySelectorAll('[data-mapa]').forEach(el => {
    if (typeof L === 'undefined') { el.closest('[data-mapa-box]')?.setAttribute('data-sin-mapa', ''); return; }
    const centro = L.latLng(-31.2503, -61.4867);
    const corrido = el.hasAttribute('data-mapa-corrido');
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: false });
    mapa.setView(centro, 14);
    L.control.zoom({ position: 'topleft' }).addTo(mapa);
    mapa.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 900, color: '#2E7D55', weight: 1, fillColor: '#6ED49A', fillOpacity: 0.16 }).addTo(mapa);
    L.circleMarker(centro, { radius: 9, color: '#FFFFFF', weight: 3, fillColor: '#1D3A2F', fillOpacity: 1 }).addTo(mapa).bindTooltip('Isybell · Rafaela (dirección a confirmar)');
    const ajustar = () => {
      mapa.invalidateSize();
      mapa.setView(centro, 14, { animate: false });
      if (corrido && window.innerWidth >= 961) mapa.panBy([-Math.round(el.clientWidth * 0.2), 0], { animate: false });
    };
    window.addEventListener('load', ajustar);
    if ('ResizeObserver' in window) new window.ResizeObserver(ajustar).observe(el);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desde('.sigla b', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.1);
  desde('.sigla i', { opacity: 0, x: -6, duration: 0.9, stagger: 0.06 }, 0.45);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-badge', { y: 14, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75);
  desde('.hero__alquiler', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

[initPreviews, initEspecialidades, initResumenes, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initNav, initDrawer, initVistaRapida, initCompras, initAlquiler, initGaleria, initRails, initMapa, initFloats, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (err) { void err; } });
Cart.syncStock();
updateCartBadge();
