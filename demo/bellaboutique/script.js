const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 5;
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

const WSP = '5491130885724';
const MARCA = 'Bella boutique';
const CATEGORIAS = [
  { id: 'analogico', nombre: 'Analógico', titulo: 'Relojes analógicos', bajada: 'Agujas y marcas: la lectura de siempre', img: 'images/c-analogico.webp' },
  { id: 'digital', nombre: 'Digital', titulo: 'Relojes digitales', bajada: 'Números en pantalla, la hora al segundo', img: 'images/c-digital.webp' },
  { id: 'analogico-digital', nombre: 'Analógico-digital', titulo: 'Relojes analógico-digitales', bajada: 'Agujas y pantalla en la misma esfera', img: 'images/c-analogico-digital.webp' },
];
const ESTILOS = [
  { id: 'robusto', nombre: 'Robustos', titulo: 'Relojes robustos' },
  { id: 'translucido', nombre: 'Translúcidos', titulo: 'Relojes translúcidos' },
  { id: 'clasico', nombre: 'Clásicos', titulo: 'Relojes clásicos' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro', titulo: 'Relojes negros' },
  { id: 'humo', nombre: 'Gris humo', titulo: 'Relojes gris humo' },
  { id: 'gris', nombre: 'Gris', titulo: 'Relojes grises' },
];
const PRECIOS = [
  { id: 'hasta80', nombre: 'Hasta $80.000', min: 0, max: 80000 },
  { id: '80a150', nombre: '$80.000 a $150.000', min: 80000, max: 150000 },
  { id: 'mas150', nombre: 'Más de $150.000', min: 150000, max: null },
];
const PRODUCTOS = [
  { id: 'gshock-plata', rango: 1, cat: 'analogico-digital', estilo: 'robusto', color: 'negro', real: true, marca: 'G-Shock', nombre: 'G-Shock negro con esfera plateada', nota: 'Foto real: en la muñeca y en su lata', precio: 229900, descuento: 0, img: 'images/p-gshock-plata.webp', alt: 'Reloj G-Shock negro con esfera plateada dentro de su lata hexagonal', imgs: [{ src: 'images/p-gshock-plata.webp', alt: 'Reloj G-Shock negro con esfera plateada dentro de su lata hexagonal' }, { src: 'images/g-plata-muneca.webp', alt: 'El mismo G-Shock de esfera plateada puesto en la muñeca' }, { src: 'images/g-plata-lata.webp', alt: 'El G-Shock de esfera plateada visto de frente en su lata' }], desc: 'Caja y malla de resina negra, con la esfera plateada, dos subesferas y las pantallas digitales a la vista. Las fotos son de Bella boutique: el reloj en la muñeca y en su lata.', ficha: ['Caja y malla de resina negra', 'Esfera plateada con agujas y pantallas digitales', 'Bisel con las inscripciones G-SHOCK y PROTECTION', 'En las fotos, con su lata hexagonal'], claves: ['g-shock', 'gshock', 'g shock', 'casio', 'plateado', 'cromado', 'plata', 'foto real'] },
  { id: 'gshock-humo', rango: 2, cat: 'analogico-digital', estilo: 'translucido', color: 'humo', real: true, marca: 'G-Shock', nombre: 'G-Shock negro humo translúcido', nota: 'Foto real: en la mano, en la muñeca y en su lata', precio: 219900, descuento: 0, img: 'images/p-gshock-humo.webp', alt: 'Reloj G-Shock negro humo translúcido dentro de su lata', imgs: [{ src: 'images/p-gshock-humo.webp', alt: 'Reloj G-Shock negro humo translúcido dentro de su lata' }, { src: 'images/g-humo-muneca.webp', alt: 'El mismo G-Shock translúcido puesto en la muñeca' }, { src: 'images/g-humo-mano.webp', alt: 'El G-Shock translúcido sostenido en la palma de la mano' }, { src: 'images/g-humo-caja.webp', alt: 'El G-Shock translúcido en su caja, con la etiqueta de la marca' }], desc: 'Caja y malla translúcidas en negro humo, con la esfera analógica y la pantalla digital en el mismo frente. Las fotos son de Bella boutique: en la mano, en la muñeca y en su lata.', ficha: ['Caja y malla translúcidas en negro humo', 'Esfera analógica con pantalla digital', 'Pulsadores a los costados de la caja', 'En las fotos, con su lata y la etiqueta G-Shock'], claves: ['g-shock', 'gshock', 'g shock', 'casio', 'transparente', 'humo', 'foto real'] },
  { id: 'tactico', rango: 3, cat: 'analogico-digital', estilo: 'robusto', color: 'negro', nombre: 'Analógico-digital táctico negro', nota: 'Dos subesferas y pantalla digital', precio: 119900, descuento: 0, etiqueta: 'Nuevo', img: 'images/p-tactico.webp', alt: 'Reloj analógico-digital negro de caja robusta con dos subesferas y pantalla LCD', desc: 'Caja de resina negra con relieves, dos subesferas, pantalla digital abajo y agujas claras que se leen de un vistazo.', ficha: ['Caja y malla de resina negra', 'Dos subesferas y pantalla digital', 'Corona y pulsadores metálicos', 'Agujas y marcas claras sobre fondo negro'], claves: ['tactico', 'deportivo', 'militar', 'ana-digi', 'cronografo'] },
  { id: 'octogonal', rango: 4, cat: 'analogico', estilo: 'robusto', color: 'negro', nombre: 'Analógico negro bisel octogonal', nota: 'Segundero rojo y tornillos a la vista', precio: 94000, descuento: 15, img: 'images/p-octogonal.webp', alt: 'Reloj analógico negro de bisel octogonal con segundero rojo, dentro de un estuche', desc: 'Bisel octogonal con tornillos a la vista, esfera negra con marcas claras y un segundero rojo que le da el único toque de color.', ficha: ['Bisel octogonal con tornillos a la vista', 'Segundero rojo sobre esfera negra', 'Malla de resina negra', 'En la foto, en un estuche con almohadilla'], claves: ['octogonal', 'tornillos', 'rojo', 'estuche', 'regalo'] },
  { id: 'humo', rango: 5, cat: 'analogico', estilo: 'translucido', color: 'humo', nombre: 'Analógico humo translúcido', nota: 'Caja y malla en gris humo', precio: 89900, descuento: 0, img: 'images/p-humo.webp', alt: 'Reloj analógico de caja y malla translúcidas en gris humo con esfera negra', desc: 'Caja grande y malla translúcidas en gris humo, con la esfera negra, agujas claras y hebilla metálica.', ficha: ['Caja y malla translúcidas en gris humo', 'Esfera negra con agujas y marcas claras', 'Corona metálica a la derecha', 'Hebilla metálica'], claves: ['transparente', 'translucido', 'humo', 'gris'] },
  { id: 'cuadrado', rango: 6, cat: 'digital', estilo: 'clasico', color: 'negro', nombre: 'Digital cuadrado negro mate', nota: 'Pantalla LCD con hora y segundos', precio: 54900, descuento: 0, img: 'images/p-cuadrado.webp', alt: 'Reloj digital de caja cuadrada negra mate con pantalla LCD y pulsadores metálicos', desc: 'Caja cuadrada de resina negra mate, pantalla LCD grande con hora y segundos, y cuatro pulsadores metálicos.', ficha: ['Caja cuadrada de resina negra mate', 'Pantalla LCD con hora y segundos', 'Cuatro pulsadores metálicos', 'Malla de resina con relieve'], claves: ['cuadrado', 'lcd', 'retro', 'mate'] },
  { id: 'doble', rango: 7, cat: 'analogico-digital', estilo: 'robusto', color: 'gris', nombre: 'Analógico-digital doble pantalla', nota: 'Dos pantallas sobre la esfera', precio: 129900, descuento: 0, img: 'images/p-doble.webp', alt: 'Reloj analógico-digital gris oscuro con dos pantallas digitales sobre la esfera', desc: 'Caja gris oscuro de bisel facetado, con dos pantallas digitales sobre la esfera y malla de resina con textura.', ficha: ['Dos pantallas digitales sobre la esfera', 'Caja gris oscuro con bisel facetado', 'Malla de resina con textura', 'Agujas y marcas claras'], claves: ['doble pantalla', 'ana-digi', 'deportivo', 'gris oscuro'] },
  { id: 'clasico', rango: 8, cat: 'digital', estilo: 'clasico', color: 'negro', nombre: 'Digital clásico negro', nota: 'Perfil bajo y caja rectangular', precio: 39900, descuento: 0, img: 'images/p-clasico.webp', alt: 'Reloj digital clásico de resina negra con pantalla LCD rectangular', desc: 'El digital de siempre: caja rectangular de perfil bajo, pantalla LCD con hora y segundos y malla de resina negra.', ficha: ['Caja y malla de resina negra', 'Pantalla LCD con hora y segundos', 'Pulsadores metálicos a los costados', 'Perfil bajo y caja rectangular'], claves: ['clasico', 'retro', 'lcd', 'simple'] },
  { id: 'robusto', rango: 9, cat: 'analogico', estilo: 'robusto', color: 'negro', nombre: 'Analógico robusto negro', nota: 'Agujas y marcas claras', precio: 109900, descuento: 0, img: 'images/p-robusto.webp', alt: 'Reloj analógico negro de caja robusta con agujas y marcas claras', desc: 'Caja robusta de resina negra con bisel atornillado, agujas anchas y marcas claras que se leen de un vistazo.', ficha: ['Caja robusta de resina negra', 'Agujas y marcas claras sobre esfera negra', 'Corona estriada y bisel con tornillos', 'Malla de resina negra'], claves: ['robusto', 'deportivo', 'grande', 'negro'] },
  { id: 'translucido', rango: 10, cat: 'analogico', estilo: 'translucido', color: 'gris', nombre: 'Analógico translúcido gris', nota: 'Esfera negra y agujas plateadas', precio: 74900, descuento: 0, img: 'images/p-translucido.webp', alt: 'Reloj analógico de caja y malla translúcidas grises sobre un soporte de acrílico', desc: 'Caja y malla translúcidas en gris, esfera negra con agujas plateadas y una corona metálica.', ficha: ['Caja y malla translúcidas en gris', 'Esfera negra con agujas plateadas', 'Corona metálica', 'En la foto, sobre un soporte de acrílico'], claves: ['transparente', 'translucido', 'gris', 'fino'] },
  { id: 'acero', rango: 11, cat: 'digital', estilo: 'clasico', color: 'gris', nombre: 'Digital bisel acero gris', nota: 'Bisel gris metalizado', precio: 69900, descuento: 0, img: 'images/p-acero.webp', alt: 'Reloj digital de caja cuadrada con bisel gris metalizado sobre un pedestal de piedra', desc: 'Caja cuadrada con bisel gris metalizado, pantalla LCD con hora y segundos y malla de resina negra.', ficha: ['Bisel gris metalizado', 'Pantalla LCD con hora y segundos', 'Malla de resina negra', 'En la foto, sobre un pedestal de piedra'], claves: ['acero', 'metal', 'cuadrado', 'lcd', 'gris'] },
  { id: 'malla-repuesto', rango: 99, cat: 'digital', estilo: 'clasico', color: 'negro', nombre: 'Malla de repuesto', nota: 'Oculto', precio: 9900, descuento: 0, visible: false, img: 'images/p-clasico.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['malla'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, p.marca, catDe(p.cat)?.nombre, nombreDe(ESTILOS, p.estilo), nombreDe(COLORES, p.color),
    ...(p.ficha || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), estilo = lista(f.estilo), color = lista(f.color), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (estilo.length && !estilo.includes(p.estilo)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const detalleDe = p => `${catDe(p.cat).nombre} · ${nombreDe(COLORES, p.color)}`;

const Cart = {
  KEY: 'bellaboutique_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

const SVG = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  camara: SVG('<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"/><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>'),
  analogico: SVG('<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/>'),
  digital: SVG('<path d="M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6z"/><path d="M9 18v3h6v-3"/><path d="M9 6v-3h6v3"/><path d="M9.5 12h1"/><path d="M13.5 12h1"/>'),
  'analogico-digital': SVG('<path d="M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6z"/><path d="M9 18v3h6v-3"/><path d="M9 6v-3h6v3"/><path d="M12 9v3l2 1"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const c = catDe(p.cat);
  const etq = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : p.real ? `<span class="prod__real">${ICO.camara}Foto real</span>` : p.etiqueta ? `<span class="prod__etq">${esc(p.etiqueta)}</span>` : '';
  return `<article class="prod${p.real ? ' prod--real' : ''}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"></button><span class="prod__tipo">${ICO[c.id] || ''}${esc(c.nombre)}</span>${etq}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(nombreDe(ESTILOS, p.estilo))} · ${esc(nombreDe(COLORES, p.color))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions"><button type="button" class="btn btn--tinta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'reloj', 'relojes')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="1000" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleDe(p))}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-id="${esc(p.id)}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-id="${esc(p.id)}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${esc(p.id)}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
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
    cuenta.textContent = n ? plural(n, 'reloj', 'relojes') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const id = paso.dataset.id;
      const it = Cart.get().find(x => x.id === id);
      if (it) Cart.setQty(id, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-id="${id}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, qty);
  if (!n) { showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`); return 0; }
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      sumar(id, 1, b);
      if (c) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { estilo: p.estilo, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const fotos = p.imgs?.length ? p.imgs : [{ src: p.img, alt: p.alt }];
  const thumbs = fotos.length > 1 ? `<ul class="qv__thumbs">${fotos.map((f, k) => `<li><button type="button" class="qv__thumb${k === 0 ? ' on' : ''}" data-qv-foto="${k}" aria-label="Ver la foto ${k + 1} de ${fotos.length}" aria-pressed="${k === 0 ? 'true' : 'false'}"><img src="${esc(f.src)}" alt="" width="1000" height="1000"></button></li>`).join('')}</ul>` : '';
  const datos = [['Pantalla', c.nombre], ['Estilo', nombreDe(ESTILOS, p.estilo)], ['Color', nombreDe(COLORES, p.color)]];
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(fotos[0].src)}" alt="${esc(fotos[0].alt)}" width="1000" height="1000">${p.real ? `<span class="prod__real">${ICO.camara}Foto real</span>` : ''}</figure>
    ${thumbs}
  </div>
  <div class="qv__info">
    <p class="qv__cat">${ICO[c.id] || ''}${esc(c.nombre)}${p.marca ? ` · ${esc(p.marca)}` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    ${precioHTML(p)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--tinta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__datos">${datos.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div><p class="qv__label">Lo que se ve en ${fotos.length > 1 ? 'las fotos' : 'la foto'}</p><ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por el reloj «${p.nombre}» de ${MARCA}. ¿Me pasás medidas y más fotos?`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Pedir medidas y más fotos por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      const f = (p.imgs || [])[Number(foto.dataset.qvFoto)];
      const img = cont.querySelector('[data-qv-img]');
      if (f && img) { img.src = f.src; img.alt = f.alt; }
      cont.querySelectorAll('[data-qv-foto]').forEach(b => { const on = b === foto; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      return;
    }
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
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
      else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  };
  if (p.marca) ld.brand = { '@type': 'Brand', name: p.marca };
  s.textContent = JSON.stringify(ld);
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
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
  const otros = ['estilo', 'color', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="720" height="540"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'reloj', 'relojes')}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initVistaPrevia() {
  const cont = document.querySelector('[data-prev]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'subir' })).join('');
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
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
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initVisor() {
  const img = document.querySelector('[data-visor-img]');
  const thumbs = [...document.querySelectorAll('[data-visor-i]')];
  if (!img || !thumbs.length) return;
  const n = document.querySelector('[data-visor-n]');
  const d = document.querySelector('[data-visor-d]');
  const qv = document.querySelector('[data-visor-qv]');
  thumbs.forEach(t => t.addEventListener('click', () => {
    thumbs.forEach(x => { const on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    img.classList.remove('cambia');
    void img.offsetWidth;
    img.src = t.dataset.src; img.width = Number(t.dataset.w); img.height = Number(t.dataset.h); img.alt = t.dataset.alt;
    if (!reduceMotion) img.classList.add('cambia');
    if (n) n.textContent = t.dataset.n;
    if (d) d.textContent = t.dataset.d;
    if (qv) qv.dataset.qv = t.dataset.pid;
  }));
}

function initReloj() {
  const lcds = [...document.querySelectorAll('[data-reloj]')];
  const agujas = [...document.querySelectorAll('[data-aguja]')];
  if (!lcds.length && !agujas.length) return;
  let fmt = null;
  try { fmt = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); } catch (err) { void err; }
  const dos = v => String(v).padStart(2, '0');
  const tick = () => {
    const ahora = new Date();
    let dia, hh, mm, ss;
    if (fmt) {
      const p = Object.fromEntries(fmt.formatToParts(ahora).map(x => [x.type, x.value]));
      dia = p.weekday; hh = p.hour; mm = p.minute; ss = p.second;
    } else {
      dia = ahora.toLocaleDateString('es-AR', { weekday: 'short' }); hh = dos(ahora.getHours()); mm = dos(ahora.getMinutes()); ss = dos(ahora.getSeconds());
    }
    dia = String(dia).replace('.', '').slice(0, 3).toUpperCase();
    lcds.forEach(el => {
      el.querySelector('[data-dia]').textContent = dia;
      el.querySelector('[data-hora]').textContent = `${dos(hh)}:${dos(mm)}`;
      el.querySelector('[data-seg]').textContent = dos(ss);
    });
    const h = Number(hh) % 12, m = Number(mm), s = Number(ss);
    const grados = { h: (h + m / 60) * 30, m: (m + s / 60) * 6, s: s * 6 };
    agujas.forEach(a => a.setAttribute('transform', `rotate(${grados[a.dataset.aguja].toFixed(2)} 60 60)`));
  };
  tick();
  setInterval(tick, 1000);
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
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, estilo: ESTILOS, color: COLORES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    estilo: valida(params.get('estilo'), ESTILOS),
    color: valida(params.get('color'), COLORES),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = panel.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('estilo')) return ESTILOS.find(x => x.id === e.estilo[0])?.titulo || '';
    if (solo('color')) return COLORES.find(x => x.id === e.color[0])?.titulo || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los relojes';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, relojes de pulsera`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'reloj' : 'relojes'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
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
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
}

function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
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
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desdeA('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  desdeA('.hero__regla', { scaleX: 0, duration: 1.1, transformOrigin: '0% 50%', clearProps: 'transform' }, 0.45);
  desdeA('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.lcd', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.hero-ficha', { y: 30, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.4);
  desdeA('.esfera', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

initVistaPrevia();
initRail();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initRails();
initVisor();
initReloj();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
initProductoUrl();
Cart.sync();
updateCartBadge();
