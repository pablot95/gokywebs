const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
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

const WSP = '5491158796220';
const MARCA = 'Strength Joyas';
const CATEGORIAS = [
  { id: 'dorado', nombre: 'Acero dorado', titulo: 'Joyas de acero dorado', bajada: 'Cadenas, aros, pulseras y anillos', img: 'images/p-argollas.webp' },
  { id: 'plateado', nombre: 'Acero plateado', titulo: 'Joyas de acero plateado', bajada: 'Medallas y cadenas', img: 'images/c-plateado.webp' },
  { id: 'quirurgico', nombre: 'Acero quirúrgico', titulo: 'Joyas de acero quirúrgico', bajada: 'Esclavas y anillos', img: 'images/p-alianza.webp' },
  { id: 'personalizadas', nombre: 'Con tu nombre', titulo: 'Cadenas con tu nombre', bajada: 'Chapitas y medallas grabadas', img: 'images/p-chapita.webp' },
];
const TIPOS = [
  { id: 'cadenas', nombre: 'Cadenas y dijes', uno: 'Cadena' },
  { id: 'pulseras', nombre: 'Pulseras', uno: 'Pulsera' },
  { id: 'aros', nombre: 'Aros', uno: 'Aros' },
  { id: 'anillos', nombre: 'Anillos', uno: 'Anillo' },
  { id: 'conjuntos', nombre: 'Conjuntos', uno: 'Conjunto' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: 0, max: 10000 },
  { id: '10a16', nombre: '$10.000 a $16.000', min: 10000, max: 16000 },
  { id: 'mas16', nombre: 'Más de $16.000', min: 16000, max: null },
];
const LETRAS = [{ id: 'cursiva', nombre: 'Cursiva' }, { id: 'imprenta', nombre: 'Imprenta' }];
const PRODUCTOS = [
  { id: 'chapita-nombre', rango: 1, cats: ['personalizadas', 'dorado'], tipo: 'cadenas', nombre: 'Cadena con chapita y nombre', nota: 'Chapita rectangular grabada, acero dorado', precio: 18900, descuento: 0, etiqueta: 'Con tu nombre', img: 'images/p-chapita.webp', alt: 'Cadena dorada con chapita rectangular para grabar un nombre', desc: 'Cadena fina de acero dorado con chapita rectangular grabada con el nombre que elijas, en letra cursiva o de imprenta.', ficha: ['Acero dorado', 'Chapita rectangular', 'Nombre de hasta 12 letras', 'Cursiva o imprenta'], claves: ['nombre', 'grabada', 'personalizada', 'chapa', 'barra', 'regalo'], grabado: { max: 12, label: 'Nombre a grabar', ph: 'Sofía', x: 50.3, y: 82.4, fs: 3 } },
  { id: 'corazon', rango: 2, cats: ['dorado'], tipo: 'cadenas', nombre: 'Cadena con corazón inflado', nota: 'Dije de corazón, acero dorado', precio: 16500, descuento: 0, etiqueta: 'Nuevo', img: 'images/p-corazon.webp', alt: 'Cadena dorada con dije de corazón inflado', desc: 'Cadena fina de acero dorado con dije de corazón inflado y alargue para regular el largo.', ficha: ['Acero dorado', 'Dije de corazón', 'Cadena con alargue', 'Cierre de mosquetón'], claves: ['corazon', 'dije', 'collar', 'amor', 'regalo'] },
  { id: 'pulsera-estrella', rango: 3, cats: ['dorado'], tipo: 'pulseras', nombre: 'Pulsera con dije estrella', nota: 'Eslabones finos, acero dorado', precio: 11900, descuento: 0, etiqueta: 'Nuevo', img: 'images/p-estrella.webp', alt: 'Pulsera dorada de eslabones con un dije de estrella', desc: 'Pulsera de eslabones finos de acero dorado con un dije de estrella y alargue regulable.', ficha: ['Acero dorado', 'Dije de estrella', 'Eslabones finos', 'Largo regulable'], claves: ['estrella', 'pulsera', 'dije', 'eslabones'] },
  { id: 'trio-anillos', rango: 4, cats: ['dorado'], tipo: 'anillos', nombre: 'Trío de anillos finos', nota: 'Liso, trenzado y facetado', precio: 14900, descuento: 15, img: 'images/p-trio.webp', alt: 'Tres anillos dorados finos: uno liso, uno trenzado y uno facetado', desc: 'Set de tres anillos finos de acero dorado para usar juntos o por separado: uno liso, uno trenzado y uno facetado.', ficha: ['Acero dorado', 'Tres anillos por set', 'Liso, trenzado y facetado', 'Para combinar'], claves: ['anillos', 'set', 'trenzado', 'facetado', 'combo'] },
  { id: 'conjunto-rombo', rango: 5, cats: ['dorado'], tipo: 'conjuntos', nombre: 'Conjunto rombo: collar y aros', nota: 'Collar con dije y aros a juego', precio: 21900, descuento: 10, img: 'images/p-conjunto.webp', alt: 'Collar dorado con dije de rombo y aros pasantes a juego', desc: 'Conjunto de acero dorado: collar fino con dije de rombo y aros pasantes del mismo diseño.', ficha: ['Acero dorado', 'Collar con dije de rombo', 'Aros pasantes a juego', 'Ideal para regalar'], claves: ['conjunto', 'rombo', 'collar', 'aros', 'set', 'regalo'] },
  { id: 'medalla-inicial', rango: 6, cats: ['personalizadas', 'plateado'], tipo: 'cadenas', nombre: 'Medalla redonda con inicial', nota: 'Medalla grabada, acero plateado', precio: 14900, descuento: 0, etiqueta: 'Con tu nombre', img: 'images/p-medalla.webp', alt: 'Cadena plateada con medalla redonda para grabar una inicial', desc: 'Cadena de acero plateado con medalla redonda grabada con una o dos iniciales.', ficha: ['Acero plateado', 'Medalla redonda', 'Una o dos iniciales', 'Cursiva o imprenta'], claves: ['medalla', 'inicial', 'grabada', 'personalizada', 'plata'], grabado: { max: 2, label: 'Inicial a grabar', ph: 'S', x: 50, y: 86.2, fs: 6.4, tono: 'plata' } },
  { id: 'argollas', rango: 7, cats: ['dorado'], tipo: 'aros', nombre: 'Argollas gruesas', nota: 'Aros de argolla, acero dorado', precio: 12900, descuento: 0, img: 'images/p-argollas.webp', alt: 'Argollas gruesas doradas sobre fondo marfil', desc: 'Argollas gruesas de acero dorado con cierre a presión, para todos los días.', ficha: ['Acero dorado', 'Argolla gruesa', 'Cierre a presión', 'Por par'], claves: ['argollas', 'aros', 'arito', 'gruesas', 'hoops'] },
  { id: 'esclava', rango: 8, cats: ['quirurgico'], tipo: 'pulseras', nombre: 'Esclava de eslabones', nota: 'Eslabón rectangular, acero quirúrgico', precio: 17900, descuento: 0, img: 'images/p-esclava.webp', alt: 'Esclava de eslabones rectangulares de acero quirúrgico', desc: 'Esclava de eslabones rectangulares de acero quirúrgico, con cierre de mosquetón.', ficha: ['Acero quirúrgico', 'Eslabón rectangular', 'Cierre de mosquetón', 'Unisex'], claves: ['esclava', 'pulsera', 'eslabones', 'hombre', 'unisex', 'plateada'] },
  { id: 'collar-rombo', rango: 9, cats: ['dorado'], tipo: 'cadenas', nombre: 'Collar con dije rombo', nota: 'Cadena fina, acero dorado', precio: 13900, descuento: 0, img: 'images/p-collar-rombo.webp', alt: 'Collar dorado de cadena fina con un dije de rombo', desc: 'Collar de cadena fina de acero dorado con un dije de rombo liso.', ficha: ['Acero dorado', 'Dije de rombo', 'Cadena fina', 'Cierre de mosquetón'], claves: ['rombo', 'collar', 'dije', 'cadena'] },
  { id: 'anillo-liso', rango: 10, cats: ['dorado'], tipo: 'anillos', nombre: 'Anillo liso fino', nota: 'Media caña, acero dorado', precio: 6900, descuento: 0, img: 'images/p-anillo-liso.webp', alt: 'Anillo dorado liso y fino sobre una base negra', desc: 'Anillo liso y fino de acero dorado, para usar solo o combinado con otros.', ficha: ['Acero dorado', 'Liso y fino', 'Para combinar', 'Consultá tu medida'], claves: ['anillo', 'liso', 'fino', 'alianza'] },
  { id: 'alianza', rango: 11, cats: ['quirurgico'], tipo: 'anillos', nombre: 'Anillo alianza', nota: 'Alianza clásica, acero quirúrgico', precio: 8900, descuento: 0, img: 'images/p-alianza.webp', alt: 'Anillo alianza de acero quirúrgico sobre mármol', desc: 'Anillo alianza clásico de acero quirúrgico, con terminación pulida.', ficha: ['Acero quirúrgico', 'Alianza clásica', 'Terminación pulida', 'Consultá tu medida'], claves: ['alianza', 'anillo', 'plateado', 'unisex', 'hombre'] },
  { id: 'prueba-oculto', rango: 99, cats: ['dorado'], tipo: 'cadenas', nombre: 'Producto de prueba', nota: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-corazon.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const OPCIONES_ENVIO = {
  encuentro: { nombre: 'Punto de encuentro en Quilmes', det: 'Lo coordinamos por WhatsApp' },
  sucursal: { nombre: 'Correo a sucursal', det: 'Retirás en la sucursal más cercana' },
  domicilio: { nombre: 'Correo a domicilio', det: 'Te llega a tu casa' },
};
const ZONAS = [
  { id: 'quilmes', nombre: 'Quilmes y alrededores', desde: 1876, hasta: 1889, tarifas: { encuentro: 0, domicilio: 4900 } },
  { id: 'amba', nombre: 'CABA y Gran Buenos Aires', desde: 1000, hasta: 1999, tarifas: { encuentro: 0, sucursal: 4900, domicilio: 5900 } },
  { id: 'interior', nombre: 'Interior del país', desde: 2000, hasta: 9999, tarifas: { sucursal: 6400, domicilio: 7900 } },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};
const lineaDe = p => catDe(p.cats.find(c => c !== 'personalizadas') || p.cats[0]).nombre;
const detalleDe = p => `${p.grabado ? 'Con tu nombre' : TIPOS.find(t => t.id === p.tipo)?.uno || ''} · ${lineaDe(p)}`;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, ...p.cats.map(c => `${catDe(c).nombre} ${catDe(c).titulo}`), nombreDe(TIPOS, p.tipo),
    ...(p.ficha || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), precio = lista(f.precio), excluir = lista(f.excluir), sinCat = lista(f.sinCat);
    if (cat.length && !p.cats.some(c => cat.includes(c))) return false;
    if (sinCat.length && p.cats.some(c => sinCat.includes(c))) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
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
const limpiarNombre = (s, max) => String(s ?? '').replace(/[^\p{L}\p{N} .'&-]/gu, '').replace(/\s+/g, ' ').replace(/^\s+/, '').slice(0, max);
const claveDe = i => `${i.id}|${i.grabado || ''}|${i.letra || ''}`;
const varianteTexto = (p, i) => (p?.grabado && i.grabado ? `Grabado «${i.grabado}», ${nombreDe(LETRAS, i.letra).toLowerCase() || 'cursiva'}` : '');

const Cart = {
  KEY: 'strengthjoyas_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, { grabado = '', letra = '' } = {}, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const linea = producto.grabado ? { id: producto.id, grabado, letra: letra || 'cursiva' } : { id: producto.id, grabado: '', letra: '' };
    const k = claveDe(linea);
    const existing = items.find(i => claveDe(i) === k);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ ...linea, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => claveDe(i) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveDe(i) !== k)); },
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
      let grabado = '', letra = '';
      if (p.grabado) {
        grabado = limpiarNombre(i.grabado, p.grabado.max).trim();
        letra = LETRAS.some(l => l.id === i.letra) ? i.letra : 'cursiva';
        if (!grabado) { changed = true; return; }
      }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const linea = { id: p.id, grabado, letra, qty };
      const previa = limpias.find(x => claveDe(x) === claveDe(linea));
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || grabado !== (i.grabado || '') || letra !== (i.letra || '')) changed = true;
      limpias.push(linea);
    });
    if (changed) this.save(limpias);
  },
};

const Envio = {
  KEY: 'strengthjoyas_envio',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      const z = v && ZONAS.find(x => x.id === v.zona);
      if (!z || !/^\d{4}$/.test(v.cp) || !(v.opcion in z.tarifas)) return null;
      return { cp: v.cp, zona: z.id, opcion: v.opcion };
    } catch { return null; }
  },
  set(v) { try { localStorage.setItem(this.KEY, JSON.stringify(v)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('envio:updated')); },
  zonaDe(cp) { const n = parseInt(cp, 10); return ZONAS.find(z => n >= z.desde && n <= z.hasta) || null; },
  precio() { const e = this.get(); return e ? ZONAS.find(z => z.id === e.zona).tarifas[e.opcion] : 0; },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  lapiz: SVG('<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
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
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  subir24: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(48px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const badge = p.etiqueta ? `<span class="prod__badge${p.grabado ? ' prod__badge--nombre' : ''}">${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  const agregar = p.grabado
    ? `<button type="button" class="btn btn--cta btn--sm prod-add" data-elegir="${esc(p.id)}" aria-label="Escribir el nombre y agregar ${esc(p.nombre)} al carrito">${ICO.lapiz}<span>Personalizar</span></button>`
    : `<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900" decoding="async"></button>${badge}${off}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(detalleDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions">${agregar}</div>
    <button type="button" class="prod__comprar" ${p.grabado ? 'data-elegir-comprar' : 'data-comprar'}="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'joya', 'joyas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const v = varianteTexto(p, i);
    return `• ${i.qty} × ${p.nombre}${v ? ` (${v})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const e = Envio.get();
  const envio = e ? `\nEnvío: ${OPCIONES_ENVIO[e.opcion].nombre} (CP ${e.cp}) — ${Envio.precio() ? formatearPrecio(Envio.precio()) : 'sin costo'}` : '';
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}${envio}\nTotal: ${formatearPrecio(Cart.total() + (e ? Envio.precio() : 0))}\n¿Cómo coordinamos el pago?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = esc(claveDe(i));
  const v = varianteTexto(p, i);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="900" height="900">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    ${v ? `<p class="linea__var">${esc(v)}</p>` : `<p class="linea__var">${esc(lineaDe(p))}</p>`}
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${key}" aria-label="Restar una de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${key}" aria-label="Sumar una de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
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
  const envioBox = drawer.querySelector('[data-drawer-envio]');
  const sub = drawer.querySelector('[data-drawer-sub]');
  const envLinea = drawer.querySelector('[data-drawer-envio-linea]');
  const envNombre = drawer.querySelector('[data-drawer-envio-nombre]');
  const envPrecio = drawer.querySelector('[data-drawer-envio-precio]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'joya', 'joyas') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    envioBox.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    const e = Envio.get();
    sub.textContent = formatearPrecio(Cart.total());
    envLinea.hidden = !e;
    if (e) { envNombre.textContent = OPCIONES_ENVIO[e.opcion].nombre; envPrecio.textContent = Envio.precio() ? formatearPrecio(Envio.precio()) : 'Sin costo'; }
    total.textContent = formatearPrecio(Cart.total() + (e ? Envio.precio() : 0));
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => claveDe(x) === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const id = q.dataset.quitar.split('|')[0];
    const p = getProducto(id);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('envio:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function grabadoHTML(g, texto, letra, clase) {
  return `<span class="grabado ${clase}${g.tono === 'plata' ? ' grabado--plata' : ''}${letra === 'imprenta' ? ' grabado--imprenta' : ''}" data-grabado aria-hidden="true" style="left:${g.x}%;top:${g.y}%;--gfs:${g.fs}cqi">${esc(texto || g.ph)}</span>`;
}
function opcionesHTML(p, pref) {
  const g = p.grabado;
  if (!g) return '';
  return `<div class="grabar grabar--mini">
  <label class="grabar__campo"><span>${esc(g.label)}</span><input id="${pref}-grabado" type="text" maxlength="${g.max}" placeholder="${esc(g.ph)}" autocomplete="off" spellcheck="false" data-grabado-input></label>
  <p class="grabar__ayuda">Hasta ${g.max === 1 ? 'una letra' : `${g.max} ${g.max === 2 ? 'letras' : 'letras y espacios'}`}</p>
  <fieldset class="opciones grabar__letra"><legend>Letra</legend><div class="opciones__fila">${LETRAS.map((l, i) => `<label class="op-chip"><input type="radio" name="${pref}-letra" value="${l.id}"${i === 0 ? ' checked' : ''}><span class="op-chip__${l.id}">${l.nombre}</span></label>`).join('')}</div></fieldset>
</div>`;
}
function leerOpciones(cont, p) {
  if (!p.grabado) return { grabado: '', letra: '', error: '', foco: null };
  const inp = cont.querySelector('[data-grabado-input]');
  const grabado = limpiarNombre(inp?.value, p.grabado.max).trim();
  const letra = cont.querySelector('input[name$="-letra"]:checked')?.value || 'cursiva';
  const error = grabado ? '' : (p.grabado.max <= 2 ? 'Escribí la inicial que va en la medalla.' : 'Escribí el nombre que va en la chapita.');
  return { grabado, letra, error, foco: error ? inp : null };
}
function mostrarError(el, r) {
  if (!el) return;
  el.textContent = r.error;
  el.hidden = !r.error;
  r.foco?.focus();
}
function avisoSumado(p, opciones, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${opciones.grabado ? ` con «${opciones.grabado}»` : ''} al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
function vivoGrabado(cont, p) {
  const inp = cont.querySelector('[data-grabado-input]');
  if (!inp || !p?.grabado) return;
  const pintar = () => {
    const limpio = limpiarNombre(inp.value, p.grabado.max);
    if (limpio !== inp.value) inp.value = limpio;
    const letra = cont.querySelector('input[name$="-letra"]:checked')?.value || 'cursiva';
    cont.querySelectorAll('[data-grabado]').forEach(s => {
      s.textContent = limpio.trim() || p.grabado.ph;
      s.classList.toggle('grabado--imprenta', letra === 'imprenta');
      s.classList.toggle('grabado--vacio', !limpio.trim());
    });
  };
  inp.addEventListener('input', pintar);
  cont.addEventListener('change', e => { if (e.target.matches('input[type="radio"]')) pintar(); });
  pintar();
}

let sheetEstado = null;
function abrirSheet(id, modo, previo) {
  const sheet = document.getElementById('grabarSheet');
  const p = getProducto(id);
  if (!sheet || !p) return;
  sheetEstado = { id: p.id, modo, previo };
  sheet.querySelector('[data-sheet-body]').innerHTML = `<div class="sh">
  <div class="sh__prod"><figure class="sh__foto"><img src="${esc(p.img)}" alt="" width="900" height="900">${grabadoHTML(p.grabado, '', 'cursiva', 'grabado--ficha')}</figure><div><b>${esc(p.nombre)}</b>${precioHTML(p)}</div></div>
  ${opcionesHTML(p, 'sh')}
  <p class="opciones__error" data-sheet-error role="alert" hidden></p>
  <button type="button" class="btn btn--cta btn--block sh__ok" data-sheet-ok>${modo === 'comprar' ? `Comprar ahora ${ICO.flecha}` : `${ICO.carrito}Agregar al carrito`}</button>
  <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Otro diseño o una fecha? Preguntanos</span></a>
</div>`;
  sheet.setAttribute('aria-label', `Personalizá: ${p.nombre}`);
  vivoGrabado(sheet.querySelector('.sh'), p);
  abrirCapa(sheet, { previo });
  setTimeout(() => sheet.querySelector('[data-grabado-input]')?.focus(), 80);
}
function initSheet() {
  const sheet = document.getElementById('grabarSheet');
  if (!sheet) return;
  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-sheet-cerrar]')) { cerrarCapa(sheet); return; }
    if (!e.target.closest('[data-sheet-ok]') || !sheetEstado) return;
    const p = getProducto(sheetEstado.id);
    const cont = sheet.querySelector('.sh');
    const r = leerOpciones(cont, p);
    if (r.error) { mostrarError(cont.querySelector('[data-sheet-error]'), r); return; }
    const n = Cart.add(p, r, 1);
    const { modo, previo } = sheetEstado;
    if (modo === 'comprar') {
      cerrarCapa(sheet, { devolverFoco: false });
      window.abrirCarrito?.(previo);
      return;
    }
    cerrarCapa(sheet);
    avisoSumado(p, r, n);
    bump(previo);
  });
  sheet.addEventListener('input', e => {
    if (e.target.matches('[data-grabado-input]')) { const er = sheet.querySelector('[data-sheet-error]'); if (er) er.hidden = true; }
  });
  sheet.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('[data-grabado-input]')) { e.preventDefault(); sheet.querySelector('[data-sheet-ok]')?.click(); }
  });
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView') || e.target.closest('#grabarSheet')) return;
    const s = e.target.closest('[data-elegir]');
    const c = e.target.closest('[data-elegir-comprar]');
    if (s || c) {
      e.preventDefault();
      abrirSheet(s ? s.dataset.elegir : c.dataset.elegirComprar, s ? 'agregar' : 'comprar', s || c);
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, {}, Cart.add(p, {}, 1));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, {}, 1);
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
  let rel = Tienda.consultar({ filtros: { tipo: p.tipo, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cats, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto${p.grabado ? ' qv__foto--grabado' : ''}"><img data-qv-img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900">${p.grabado ? grabadoHTML(p.grabado, '', 'cursiva', 'grabado--ficha') : ''}</figure>
    <p class="qv__nota-foto">Foto ilustrativa${p.grabado ? ' · el nombre se ve sobre la foto mientras lo escribís' : ''}</p>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(p.grabado ? `Con tu nombre · ${lineaDe(p)}` : `${lineaDe(p)} · ${nombreDe(TIPOS, p.tipo)}`)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    ${precioHTML(p)}
    ${opcionesHTML(p, 'qv')}
    <p class="opciones__error" data-qv-error role="alert" hidden></p>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas? Preguntanos por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  vivoGrabado(modal.querySelector('.qv__grid'), p);
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
  modal.addEventListener('input', e => {
    if (e.target.matches('[data-grabado-input]')) { const er = modal.querySelector('[data-qv-error]'); if (er) er.hidden = true; }
  });
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
      const r = leerOpciones(cont, p);
      if (r.error) { mostrarError(cont.querySelector('[data-qv-error]'), r); return; }
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, r, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, r, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: nombreDe(TIPOS, p.tipo), brand: { '@type': 'Brand', name: MARCA },
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
  const otros = ['tipo', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span></a></li>`;
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

const NOVEDADES = { filtros: { sinCat: 'personalizadas' }, limite: 8 };
function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar(NOVEDADES).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const n = Tienda.contar({});
  cont.innerHTML = Tienda.consultar({ ...NOVEDADES, limite: 5 }).items.map(p => cardHTML(p)).join('')
    + `<a class="mosaico__todo" href="${CATALOGO_URL}"${ANIMS.subir}><span class="mosaico__n">${n}</span><b>joyas en el catálogo</b><small>Cadenas con nombre, aros, pulseras, anillos y conjuntos.</small><em>Ver todo el catálogo ${ICO.flecha}</em></a>`;
}

function initGrabar() {
  const form = document.querySelector('[data-grabar]');
  if (!form) return;
  const p = getProducto('chapita-nombre');
  if (!p) return;
  const sec = form.closest('section');
  const inp = form.querySelector('input[name="nombre"]');
  const cuenta = form.querySelector('[data-grabar-cuenta]');
  const err = form.querySelector('[data-grabar-error]');
  const precio = form.querySelector('[data-grabar-precio]');
  if (precio) precio.innerHTML = `<span>Cadena con chapita</span>${precioHTML(p)}`;
  const pintar = () => {
    const limpio = limpiarNombre(inp.value, p.grabado.max);
    if (limpio !== inp.value) inp.value = limpio;
    const letra = form.querySelector('input[name="letra"]:checked')?.value || 'cursiva';
    sec.querySelectorAll('[data-grabado]').forEach(s => {
      s.textContent = limpio.trim() || 'Tu nombre';
      s.classList.toggle('grabado--imprenta', letra === 'imprenta');
      s.classList.toggle('grabado--vacio', !limpio.trim());
    });
    if (cuenta) cuenta.textContent = String(limpio.length);
    if (err && limpio.trim()) err.hidden = true;
  };
  inp.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const grabado = limpiarNombre(inp.value, p.grabado.max).trim();
    if (!grabado) { err.textContent = 'Escribí el nombre que va en la chapita.'; err.hidden = false; inp.focus(); return; }
    const letra = form.querySelector('input[name="letra"]:checked')?.value || 'cursiva';
    const n = Cart.add(p, { grabado, letra }, 1);
    avisoSumado(p, { grabado }, n);
    bump(form.querySelector('button[type="submit"]'));
  });
  pintar();
}

function envioResHTML(e, pref) {
  const z = ZONAS.find(x => x.id === e.zona);
  return `<p class="calc__zona">${esc(z.nombre)} · CP ${esc(e.cp)}</p><div class="calc__ops" role="radiogroup" aria-label="Opciones de envío">${Object.keys(z.tarifas).map(k => `<label class="calc__op"><input type="radio" name="${pref}-envio" value="${k}"${e.opcion === k ? ' checked' : ''}><span><b>${esc(OPCIONES_ENVIO[k].nombre)}</b><small>${esc(OPCIONES_ENVIO[k].det)}</small></span><em>${z.tarifas[k] ? formatearPrecio(z.tarifas[k]) : 'Sin costo'}</em></label>`).join('')}</div>`;
}
function initEnvio() {
  const forms = [...document.querySelectorAll('[data-envio-form]')];
  if (!forms.length) return;
  const pintar = () => {
    const e = Envio.get();
    const foco = document.activeElement?.closest?.('[data-envio-res]');
    forms.forEach((f, idx) => {
      const res = f.parentElement.querySelector('[data-envio-res]');
      const inp = f.querySelector('[data-envio-cp]');
      if (e && document.activeElement !== inp) inp.value = e.cp;
      if (!res) return;
      res.hidden = !e;
      res.innerHTML = e ? envioResHTML(e, `envio${idx}`) : '';
      if (foco === res) res.querySelector('input:checked')?.focus();
    });
  };
  forms.forEach(f => {
    const inp = f.querySelector('[data-envio-cp]');
    const err = f.querySelector('[data-envio-error]');
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 4); if (err) err.hidden = true; });
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      const cp = inp.value.replace(/\D/g, '').slice(0, 4);
      const z = cp.length === 4 ? Envio.zonaDe(cp) : null;
      if (!z) { err.textContent = 'Escribí los 4 números de tu código postal (por ejemplo, 1878).'; err.hidden = false; inp.focus(); return; }
      const previa = Envio.get();
      const opcion = previa && previa.opcion in z.tarifas ? previa.opcion : Object.keys(z.tarifas)[0];
      Envio.set({ cp, zona: z.id, opcion });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
    f.parentElement.addEventListener('change', ev => {
      if (!ev.target.matches('[data-envio-res] input[type="radio"]')) return;
      const e = Envio.get();
      if (e) Envio.set({ ...e, opcion: ev.target.value });
    });
  });
  document.addEventListener('envio:updated', pintar);
  pintar();
}

function initOpinar() {
  document.querySelectorAll('[data-opinar]').forEach(form => {
    const err = form.querySelector('[data-opinar-error]');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('input', () => { if (err) err.hidden = true; form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid')); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = form.elements.nombre, texto = form.elements.texto;
      const falta = !nombre.value.trim() ? nombre : !texto.value.trim() ? texto : null;
      if (falta) {
        falta.setAttribute('aria-invalid', 'true');
        err.textContent = falta === nombre ? 'Contanos tu nombre para firmar la opinión.' : 'Escribí tu opinión antes de enviarla.';
        err.hidden = false; falta.focus(); return;
      }
      const txt = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false; btn.textContent = txt;
        form.reset();
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      }, 800);
    });
  });
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
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    tipo: valida(params.get('tipo'), TIPOS),
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
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`
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
    if (solo('tipo')) return TIPOS.find(x => x.id === e.tipo[0])?.nombre || '';
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
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'joya' : 'joyas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  desdeA('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desdeA('.hero__sello', { scale: 0.92, opacity: 0, rotate: -12, duration: 1.2, clearProps: 'transform,opacity' }, 0.1);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.15);
  desdeA('.hero-eyebrow .chapa path, .hero-eyebrow .chapa rect', { strokeDashoffset: 60, duration: 1.4, stagger: 0.08, ease: 'power2.out' }, 0.25);
  desdeA('h1', { y: 30, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.2, clearProps: 'clipPath' }, 0.25);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.5);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62);
  desdeA('.sellos li', { y: 18, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img, .hero2__fondo img').forEach(el => {
    gsap.to(el, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initRail, initMosaico, initGrabar, initEnvio, initOpinar, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initSheet, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
