const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
document.documentElement.classList.add('js');

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

const WSP = '5493513853279';
const MARCA = 'LUX-CAR';
const CATEGORIAS = [
  { id: 'desengrasantes', paso: '01', nombre: 'Desengrasantes', titulo: 'Desengrasantes de motor', bajada: 'Para el motor y las partes con grasa', img: 'images/p-desengrasante.webp' },
  { id: 'lavado', paso: '02', nombre: 'Shampoos y lavado', titulo: 'Shampoos y lavado', bajada: 'Cinco shampoos y guante de microfibra', img: 'images/p-shampoo-azul.webp' },
  { id: 'secado', paso: '03', nombre: 'Secado y microfibra', titulo: 'Secado y microfibra', bajada: 'Toallas y paños para secar sin marcas', img: 'images/p-toalla.webp' },
  { id: 'brillo', paso: '04', nombre: 'Brillo y protección', titulo: 'Brillo y protección', bajada: 'Dressing, Black Shine y Carnauba', img: 'images/p-carnauba.webp' },
];
const USOS = [
  { id: 'motor', nombre: 'Motor' },
  { id: 'carroceria', nombre: 'Carrocería y pintura' },
  { id: 'cubiertas', nombre: 'Cubiertas y plásticos' },
  { id: 'interior', nombre: 'Interior' },
];
const PRECIOS = [
  { id: 'hasta7', nombre: 'Hasta $7.000', min: 0, max: 7000 },
  { id: '7a9', nombre: '$7.000 a $9.000', min: 7000, max: 9000 },
  { id: 'mas9', nombre: 'Más de $9.000', min: 9000, max: null },
];
const PRODUCTOS = [
  { id: 'desengrasante-motor', rango: 1, cat: 'desengrasantes', usos: ['motor'], nombre: 'Desengrasante de motor', pres: '1 L con gatillo', uso: 'Saca la grasa y el aceite del motor', precio: 6900, descuento: 0, etiqueta: 'Con gatillo', img: 'images/p-desengrasante.webp', alt: 'Botella con gatillo de desengrasante de motor, líquido ámbar y etiqueta negra con filete rojo', desc: 'Desengrasante para el motor y las piezas con grasa o aceite. Viene con gatillo para aplicarlo justo donde hace falta y enjuagarlo después.', ficha: ['Presentación de 1 L', 'Con gatillo pulverizador', 'Usar con el motor frío', 'Enjuagar con poca presión'], claves: ['desengrasante', 'motor', 'grasa', 'aceite', 'gatillo', 'spray', 'limpiador'] },
  { id: 'dressing-siliconado', rango: 2, cat: 'brillo', usos: ['interior', 'cubiertas'], nombre: 'Dressing Siliconado', pres: '1 L', uso: 'Renueva plásticos, gomas y tablero', precio: 7900, descuento: 0, img: 'images/p-dressing.webp', alt: 'Botella de Dressing Siliconado con líquido cremoso y etiqueta negra con filetes rojos', desc: 'Dressing con siliconas para devolverles el color a los plásticos, las gomas y el tablero. Se aplica con aplicador o paño de microfibra.', ficha: ['Presentación de 1 L', 'Plásticos, gomas y tablero', 'Aplicar con aplicador', 'Uso interior y exterior'], claves: ['dressing', 'siliconado', 'silicona', 'plasticos', 'tablero', 'gomas', 'interior', 'renovador'] },
  { id: 'black-shine', rango: 3, cat: 'brillo', usos: ['cubiertas'], nombre: 'Black Shine', pres: '1 L con gatillo', uso: 'Negro brillante para las cubiertas', precio: 8500, descuento: 0, etiqueta: 'Con gatillo', img: 'images/p-black-shine.webp', alt: 'Botella con gatillo de Black Shine, líquido oscuro y etiqueta negra con filetes rojos', desc: 'Para dejar las cubiertas y los plásticos exteriores con un negro profundo y brillante. Se pulveriza y se distribuye con aplicador.', ficha: ['Presentación de 1 L', 'Con gatillo pulverizador', 'Cubiertas y plásticos exteriores', 'Distribuir con aplicador'], claves: ['black', 'shine', 'cubiertas', 'neumaticos', 'gomas', 'negro', 'brillo', 'ruedas'] },
  { id: 'carnauba-liquida', rango: 4, cat: 'brillo', usos: ['carroceria'], nombre: 'Carnauba Líquida', pres: '1 L', uso: 'Brillo y protección para la pintura', precio: 9500, descuento: 0, img: 'images/p-carnauba.webp', alt: 'Botella de Carnauba Líquida con líquido blanco y etiqueta negra con filetes rojos', desc: 'Cera de carnauba en formato líquido para darle brillo a la pintura y dejarla protegida. Se aplica con el auto limpio y seco, y se retira con microfibra.', ficha: ['Presentación de 1 L', 'Cera de carnauba líquida', 'Con el auto limpio y seco', 'Retirar con microfibra'], claves: ['carnauba', 'cera', 'liquida', 'pintura', 'brillo', 'proteccion', 'encerado'] },
  { id: 'toalla-secado', rango: 5, cat: 'secado', usos: ['carroceria'], nombre: 'Toalla de secado de microfibra', pres: 'Felpa larga', uso: 'Seca toda la carrocería sin marcas', precio: 9900, descuento: 0, img: 'images/p-toalla.webp', alt: 'Toalla de microfibra azul marino de felpa larga, doblada sobre una superficie gris', desc: 'Toalla grande de microfibra de felpa larga: absorbe el agua de una pasada y se apoya y arrastra sin frotar la pintura.', ficha: ['Microfibra de felpa larga', 'Gran absorción', 'Lavable', 'Para la carrocería y los vidrios'], claves: ['toalla', 'secado', 'microfibra', 'secar', 'felpa', 'paño'] },
  { id: 'guante-lavado', rango: 6, cat: 'lavado', usos: ['carroceria'], nombre: 'Guante de lavado de microfibra', pres: 'Chenille', uso: 'Lava sin arrastrar la tierra', precio: 7900, descuento: 0, img: 'images/p-guante.webp', alt: 'Guante de lavado de microfibra chenille azul marino con puño elastizado', desc: 'Guante de microfibra chenille para lavar con shampoo: los flecos atrapan la tierra y la sueltan en el balde. Tiene puño elastizado.', ficha: ['Microfibra chenille', 'Puño elastizado', 'Lavable', 'Para usar con balde y shampoo'], claves: ['guante', 'lavado', 'microfibra', 'chenille', 'manopla', 'lavar'] },
  { id: 'panos-microfibra-x3', rango: 7, cat: 'secado', usos: ['carroceria', 'interior'], nombre: 'Paños de microfibra x3', pres: 'Pack x3', uso: 'Para repasar, secar y limpiar el interior', precio: 8900, descuento: 10, etiqueta: 'Pack x3', img: 'images/p-panos.webp', alt: 'Tres paños de microfibra azul marino doblados y apilados', desc: 'Tres paños de microfibra para repasar la carrocería, retirar la cera y limpiar el tablero y los vidrios.', ficha: ['Tres paños', 'Microfibra de pelo corto', 'Lavables', 'Carrocería, interior y vidrios'], claves: ['paño', 'paños', 'microfibra', 'pack', 'interior', 'vidrios', 'repasar'] },
  { id: 'aplicadores-x2', rango: 8, cat: 'brillo', usos: ['carroceria', 'cubiertas', 'interior'], nombre: 'Aplicadores de microfibra x2', pres: 'Pack x2', uso: 'Para aplicar cera, dressing y Black Shine', precio: 4500, descuento: 0, etiqueta: 'Pack x2', img: 'images/p-aplicadores.webp', alt: 'Dos aplicadores redondos de microfibra azul marino', desc: 'Dos aplicadores redondos de microfibra para distribuir la Carnauba, el Dressing o el Black Shine de forma pareja.', ficha: ['Dos aplicadores', 'Redondos, de microfibra', 'Lavables', 'Para cera, dressing y Black Shine'], claves: ['aplicador', 'aplicadores', 'microfibra', 'pad', 'esponja', 'cera'] },
  { id: 'shampoo-azul', rango: 9, cat: 'lavado', usos: ['carroceria'], nombre: 'Shampoo azul', pres: '1 L', uso: 'Para el lavado de todos los días', precio: 5900, descuento: 0, color: '#2F5DB8', img: 'images/p-shampoo-azul.webp', alt: 'Botella de shampoo para autos con líquido azul y etiqueta negra con filetes rojos', desc: 'Shampoo para el lavado de todos los días de la carrocería. Se diluye en el balde y se usa con guante de microfibra.', ficha: ['Presentación de 1 L', 'Lavado de rutina', 'Se diluye en el balde', 'Usar a la sombra'], claves: ['shampoo', 'champu', 'lavado', 'carroceria', 'azul', 'lavar'] },
  { id: 'shampoo-desengrasante', rango: 10, cat: 'lavado', usos: ['carroceria'], nombre: 'Shampoo + Desengrasante', pres: '1 L', uso: 'Lava y desengrasa en un paso', precio: 6500, descuento: 0, color: '#6B3FA8', img: 'images/p-shampoo-desengrasante.webp', alt: 'Botella de shampoo con desengrasante, líquido violeta y etiqueta negra con filetes rojos', desc: 'Para cuando el auto viene con barro o grasa del camino: lava y desengrasa la carrocería en un solo paso.', ficha: ['Presentación de 1 L', 'Lava y desengrasa', 'Para suciedad pesada', 'Se diluye en el balde'], claves: ['shampoo', 'desengrasante', 'barro', 'grasa', 'violeta', 'lavado'] },
  { id: 'shampoo-espumante', rango: 11, cat: 'lavado', usos: ['carroceria'], nombre: 'Shampoo Espumante', pres: '1 L', uso: 'Mucha espuma para lavar con balde', precio: 6200, descuento: 0, color: '#3D9A46', img: 'images/p-shampoo-espumante.webp', alt: 'Botella de shampoo espumante con líquido verde y etiqueta negra con filetes rojos', desc: 'Shampoo de mucha espuma: cubre la carrocería y ayuda a que el guante se deslice sin arrastrar la tierra.', ficha: ['Presentación de 1 L', 'Mucha espuma', 'Para balde y guante', 'Se diluye en el balde'], claves: ['shampoo', 'espumante', 'espuma', 'verde', 'lavado', 'foam'] },
  { id: 'shampoo-ph-neutro', rango: 12, cat: 'lavado', usos: ['carroceria'], nombre: 'Shampoo pH Neutro', pres: '1 L', uso: 'Cuida la cera que ya tiene el auto', precio: 6800, descuento: 0, color: '#C24A86', img: 'images/p-shampoo-ph-neutro.webp', alt: 'Botella de shampoo pH neutro con líquido rosa y etiqueta negra con filetes rojos', desc: 'Shampoo de pH neutro, suave con la pintura: lava sin sacar la cera ni la protección que ya tiene el auto.', ficha: ['Presentación de 1 L', 'pH neutro', 'Cuida la cera aplicada', 'Se diluye en el balde'], claves: ['shampoo', 'ph', 'neutro', 'rosa', 'suave', 'cera', 'lavado'] },
  { id: 'shampoo-rojo', rango: 13, cat: 'lavado', usos: ['carroceria'], nombre: 'Shampoo rojo', pres: '1 L', uso: 'Lavado diario, en su versión roja', precio: 5900, descuento: 0, color: '#B8333A', img: 'images/p-shampoo-rojo.webp', alt: 'Botella de shampoo para autos con líquido rojo y etiqueta negra con filetes rojos', desc: 'Shampoo para el lavado diario de la carrocería, en su versión roja. Se diluye en el balde y se usa con guante de microfibra.', ficha: ['Presentación de 1 L', 'Lavado de rutina', 'Se diluye en el balde', 'Usar a la sombra'], claves: ['shampoo', 'champu', 'lavado', 'carroceria', 'rojo', 'lavar'] },
  { id: 'prueba-oculto', rango: 99, cat: 'lavado', usos: ['carroceria'], nombre: 'Producto de prueba', pres: '-', uso: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-shampoo-azul.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
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
const detalleDe = p => `${catDe(p.cat).nombre} · ${p.pres}`;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.pres, p.uso, p.desc, catDe(p.cat).nombre, catDe(p.cat).titulo, ...(p.usos || []).map(u => nombreDe(USOS, u)),
    ...(p.ficha || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (uso.length && !(p.usos || []).some(u => uso.includes(u))) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && texto.includes(w.slice(0, -2))));
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

const Cart = {
  KEY: 'luxcar_demo_cart',
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
      if (qty !== i.qty || Object.keys(i).length !== 2) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  gota: SVG('<path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z"/>'),
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
  const otros = ['uso', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="800" height="1000"><span><b><i>${c.paso}</i>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span></a></li>`;
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

const stepperHTML = (n = 1, cls = '') => `<div class="stepper${cls}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const badge = p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"></button>${badge}${off}</div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(detalleDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__uso">${esc(p.uso)}</p>
    ${precioHTML(p, false)}
    <div class="prod-actions">${stepperHTML(1, ' stepper--card')}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
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
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `• ${i.qty} × ${p.nombre} (${p.pres}) — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  return `Hola LUX-CAR! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="800" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleDe(p))}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${id}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => x.id === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
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

function avisoSumado(p, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = el => {
  const out = el.closest('[data-cant]')?.querySelector('[data-qty]');
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, TOPE_LINEA));
  if (out) out.textContent = '1';
  return n;
};

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-cant] [data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, Cart.add(p, cantDe(ag)));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantDe(cm));
      window.abrirCarrito?.(cm);
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
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { uso: p.usos, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000"></figure>
    <p class="qv__nota-foto">Foto ilustrativa. Presentación y precio de muestra.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(`${catDe(p.cat).paso} · ${catDe(p.cat).nombre}`)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(`${p.uso} · ${p.pres}`)}</p>
    ${precioHTML(p)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <a class="qv__wsp" href="${esc(wspHref(`Hola LUX-CAR! Tengo una consulta sobre «${p.nombre}».`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con el uso? Preguntanos</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>Para el mismo lavado</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="800" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
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
      const n = Cart.add(p, cantDe(cont.querySelector('[data-cant]')));
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

const DESTACADOS = { limite: 8 };
function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar(DESTACADOS).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar(DESTACADOS).items.map(p => cardHTML(p)).join('');
}
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = plural(n, 'producto', 'productos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

const SHAMPOOS = ['shampoo-azul', 'shampoo-desengrasante', 'shampoo-espumante', 'shampoo-ph-neutro', 'shampoo-rojo'];
const SH_X = [21.25, 36, 50.75, 65.2, 79.6];
function initShampoos() {
  const sec = document.querySelector('[data-shampoos]');
  if (!sec) return;
  const ficha = sec.querySelector('[data-sh-ficha]');
  const foto = sec.querySelector('.sh__foto');
  const foco = sec.querySelector('.sh__foco');
  const pintar = id => {
    const p = getProducto(id);
    if (!p) return;
    const i = SHAMPOOS.indexOf(id);
    foto.style.setProperty('--sel', String(i));
    foco?.style.setProperty('--fx', `${SH_X[i]}%`);
    sec.querySelectorAll('input[name="sh"]').forEach(r => { r.checked = r.value === id; });
    ficha.innerHTML = `<p class="sh__n"><span style="--sw:${esc(p.color)}"></span>${String(i + 1).padStart(2, '0')} / 05</p>
      <h3 class="sh__nombre">${esc(p.nombre)}</h3>
      <p class="sh__uso">${esc(p.uso)}</p>
      <p class="sh__desc">${esc(p.desc)}</p>
      <div class="sh__pie" data-cant>${precioHTML(p)}<div class="sh__acc">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div></div>
      <button type="button" class="link-flecha" data-qv="${esc(p.id)}">Ver el detalle ${ICO.flecha}</button>`;
    if (!reduceMotion) { ficha.classList.remove('cambia'); void ficha.offsetWidth; ficha.classList.add('cambia'); }
  };
  sec.addEventListener('change', e => { if (e.target.matches('input[name="sh"]')) pintar(e.target.value); });
  sec.addEventListener('click', e => {
    const b = e.target.closest('[data-sh]');
    if (b) pintar(b.dataset.sh);
  });
  pintar(SHAMPOOS[0]);
}

const PASOS = {
  desengrasantes: { verbo: 'Desengrasá', titulo: 'Arrancá por el motor', tip: 'Con el motor frío, tapá las partes eléctricas, aplicá el desengrasante, dejalo actuar unos minutos y enjuagá con poca presión.' },
  lavado: { verbo: 'Lavá', titulo: 'Lavá la carrocería', tip: 'A la sombra y con la chapa fría: shampoo en el balde, guante de microfibra y de arriba hacia abajo.' },
  secado: { verbo: 'Secá', titulo: 'Secá sin marcas', tip: 'Apoyá la toalla y arrastrala sin frotar. Con los paños repasás los marcos, los vidrios y el tablero.' },
  brillo: { verbo: 'Protegé', titulo: 'Terminá con brillo', tip: 'Carnauba en la pintura, Black Shine en las cubiertas y Dressing en los plásticos, siempre con aplicador.' },
};
function initPasos() {
  const sec = document.querySelector('[data-pasos]');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('[role="tab"]')];
  const panel = sec.querySelector('[role="tabpanel"]');
  const pintar = (id, foco = false) => {
    const c = catDe(id);
    const info = PASOS[c.id];
    tabs.forEach(t => {
      const on = t.dataset.paso === c.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${c.id}`);
    const prods = Tienda.consultar({ filtros: { cat: c.id }, limite: 8 }).items;
    panel.innerHTML = `<div class="pasos__txt"${ANIMS.fila}>
        <p class="pasos__num" aria-hidden="true">${c.paso}</p>
        <h3>${esc(info.titulo)}</h3>
        <p>${esc(info.tip)}</p>
        <a class="link-flecha" href="${CATALOGO_URL}?cat=${c.id}">Ver ${prods.length === 1 ? 'el producto' : `los ${prods.length}`} en la tienda ${ICO.flecha}</a>
      </div>
      <ul class="pasos__lista">${prods.map(p => `<li class="fila"${ANIMS.fila}>
        <button type="button" class="fila__foto" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="800" height="1000"></button>
        <div class="fila__txt"><p class="fila__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></p><p class="fila__uso">${esc(`${p.uso} · ${p.pres}`)}</p></div>
        <p class="fila__precio">${formatearPrecio(precioFinal(p))}</p>
        <button type="button" class="btn btn--cta btn--sm fila__add prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
      </li>`).join('')}</ul>`;
    revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.paso));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); pintar(tabs[e.key === 'Home' ? 0 : tabs.length - 1].dataset.paso, true); return; }
      if (!d) return;
      e.preventDefault();
      pintar(tabs[(i + d + tabs.length) % tabs.length].dataset.paso, true);
    });
  });
  pintar((tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]).dataset.paso);
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
  const GRUPOS = { cat: CATEGORIAS, uso: USOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    uso: valida(params.get('uso'), USOS),
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
  const opcion = (grupo, item, marcado, n) => (grupo === 'cat' && MODELO === '2'
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><b>${esc(item.paso)}</b><span>${esc(item.nombre)}</span><small>${n}</small></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('uso')) return `Para ${(USOS.find(x => x.id === e.uso[0])?.nombre || '').toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los productos';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Productos'} — ${MARCA}, limpieza del automotor`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
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
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => hero.classList.add('is-listo') });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('.hero1__banda', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.3, clearProps: 'transform' }, 0);
  desdeA('.hero1__foto', { y: 48, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.05);
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desdeA('.hero2__banda', { y: 60, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, 0.25);
  desdeA('.hero1__toalla', { x: -36, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.35);
  desdeA('.hero-logo', { scale: 0.92, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.4);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.15);
  desdeA('h1', { y: 36, opacity: 0, duration: 1.1 }, 0.25);
  desdeA('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero__tag', { y: 18, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.85);
  desdeA('.hero__datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero1__foto img, .hero2__banda img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }));
}

[initRail, initDestacados, initCategoriasCuenta, initShampoos, initPasos, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails, initFaq,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
