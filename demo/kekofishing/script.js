const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
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

const WSP = '5493435080517';
const MARCA = 'Kekofishing';
const CATEGORIAS = [
  { id: 'canas', nombre: 'Cañas', titulo: 'Cañas de pesca', bajada: 'Spinning, para rotativo y de viaje', img: 'images/p-cana-spinning-roja.webp' },
  { id: 'reels', nombre: 'Reels', titulo: 'Reels', bajada: 'Frontales y rotativos', img: 'images/p-reel-frontal-grafito.webp' },
  { id: 'fundas', nombre: 'Fundas', titulo: 'Fundas para cañas', bajada: 'Para guardar y llevar tus cañas', img: 'images/p-funda-negra.webp' },
];
const TIPOS = [
  { id: 'frontal', nombre: 'Frontal', largo: 'Equipo frontal (spinning)', titulo: 'Reel frontal', aporta: 'El más fácil para arrancar: lanza liviano, casi no se enreda y sirve para casi todo, desde la costa o embarcado.', puntos: ['Va debajo de la caña', 'Se usa con cañas spinning', 'Ideal si recién empezás'] },
  { id: 'rotativo', nombre: 'Rotativo', largo: 'Equipo rotativo (baitcasting)', titulo: 'Reel rotativo', aporta: 'Más control en el lance y más fuerza para piezas grandes. Pide un poco de práctica con el freno.', puntos: ['Va arriba de la caña', 'Se usa con cañas para rotativo, con gatillo', 'Para señuelos y peces de porte'] },
];
const MARCAS = [
  { id: 'marine', nombre: 'Marine' },
  { id: 'sumax', nombre: 'Sumax' },
];
const PRECIOS = [
  { id: 'hasta40', nombre: 'Hasta $40.000', min: 0, max: 40000 },
  { id: '40a90', nombre: '$40.000 a $90.000', min: 40000, max: 90000 },
  { id: 'mas90', nombre: 'Más de $90.000', min: 90000, max: null },
];
const PRODUCTOS = [
  { id: 'marine-intruder-12000ds', rango: 1, cat: 'reels', tipo: 'rotativo', marca: 'marine', nombre: 'Reel rotativo Marine Intruder 12000 DS', corto: 'Intruder 12000 DS', pres: 'Rotativo de perfil bajo · Nuevo en caja', precio: 129900, descuento: 0, img: 'images/p-marine-intruder.webp', propia: true, alt: 'Reel rotativo Marine Intruder 12000 DS negro con detalles rojos, sobre su caja', gancho: 'Rotativo de perfil bajo con detalles en rojo', desc: 'Reel rotativo de perfil bajo de Marine, línea Intruder 12000 DS, nuevo en su caja. Antes de comprar te confirmamos por WhatsApp la mano de la manivela.', ficha: [['Tipo', 'Rotativo (baitcasting)'], ['Marca', 'Marine'], ['Modelo', 'Intruder 12000 DS'], ['Manivela', 'A confirmar por WhatsApp']], claves: ['reel', 'rotativo', 'baitcasting', 'perfil bajo', 'intruder', '12000', 'marine', 'dorado'] },
  { id: 'sumax-sahara-fsh-701c', rango: 2, cat: 'canas', tipo: 'rotativo', marca: 'sumax', nombre: 'Caña Sumax Sahara FSH-701C', corto: 'Sahara FSH-701C', pres: 'Para rotativo · Mango de corcho', precio: 74900, descuento: 0, img: 'images/p-sumax-sahara.webp', propia: true, alt: 'Caña Sumax Sahara FSH-701C negra con letras doradas y mango de corcho, delante de sus fundas', gancho: 'La Sahara con mango de corcho y letras doradas', desc: 'Caña Sumax de la línea Sahara, código FSH-701C, con mango de corcho. Viene con su funda. Largo y acción te los confirmamos por WhatsApp.', ficha: [['Tipo', 'Para reel rotativo'], ['Marca', 'Sumax'], ['Código', 'FSH-701C'], ['Mango', 'Corcho']], claves: ['caña', 'cana', 'sahara', 'sumax', 'fsh', '701c', 'corcho', 'rotativo', 'casting'] },
  { id: 'reel-frontal-plata-3000', rango: 3, cat: 'reels', tipo: 'frontal', marca: null, nombre: 'Reel frontal 3000 plateado', corto: 'Frontal 3000', pres: 'Tamaño 3000 · Carrete de aluminio', precio: 64900, descuento: 0, img: 'images/p-reel-frontal-plata.webp', propia: false, alt: 'Reel frontal plateado con carrete de aluminio y manija negra', gancho: 'Liviano y parejo para costa y embarcado', desc: 'Reel frontal tamaño 3000 con carrete de aluminio y manija con perilla de goma. Va bien con cañas spinning de 1,80 a 2,40 m.', ficha: [['Tipo', 'Frontal (spinning)'], ['Tamaño', '3000'], ['Carrete', 'Aluminio'], ['Marca', 'A confirmar']], claves: ['reel', 'frontal', 'spinning', 'plateado', '3000', 'costa'] },
  { id: 'marine-brisa', rango: 4, cat: 'reels', tipo: 'rotativo', marca: 'marine', nombre: 'Reel rotativo Marine Brisa', corto: 'Brisa', pres: 'Con alarma de salida de línea', precio: 109900, descuento: 0, img: 'images/p-marine-brisa.webp', propia: true, alt: 'Reel rotativo Marine Brisa negro con carrete dorado, sobre su caja', gancho: 'Carrete dorado y alarma de salida de línea', desc: 'Reel rotativo Marine Brisa, negro con carrete dorado. Según su caja, trae alarma de salida de línea (line out alarm), que suena cuando el pez saca hilo.', ficha: [['Tipo', 'Rotativo (baitcasting)'], ['Marca', 'Marine'], ['Modelo', 'Brisa'], ['Alarma', 'Salida de línea']], claves: ['reel', 'rotativo', 'baitcasting', 'brisa', 'alarma', 'marine', 'dorado'] },
  { id: 'cana-spinning-roja-180', rango: 5, cat: 'canas', tipo: 'frontal', marca: null, nombre: 'Caña spinning negra y roja 1,80 m', corto: 'Spinning 1,80 m', pres: '1,80 m · 2 tramos · Mango de goma EVA', precio: 39900, descuento: 0, img: 'images/p-cana-spinning-roja.webp', propia: false, alt: 'Caña spinning negra con detalles rojos y mango de goma EVA', gancho: 'Corta y manejable para arroyos y costa', desc: 'Caña spinning de 1,80 m en dos tramos, con mango de goma EVA y detalles rojos. Pensada para reels frontales chicos y medianos.', ficha: [['Tipo', 'Spinning (para frontal)'], ['Largo', '1,80 m'], ['Tramos', '2'], ['Mango', 'Goma EVA']], claves: ['caña', 'cana', 'spinning', 'frontal', 'roja', 'eva', 'corta', 'costa'] },
  { id: 'funda-negra-correa', rango: 6, cat: 'fundas', tipo: null, marca: null, nombre: 'Funda para caña con correa, negra', corto: 'Funda con correa', pres: 'Hasta 1,90 m · Con correa al hombro', precio: 24900, descuento: 0, img: 'images/p-funda-negra.webp', propia: false, alt: 'Funda negra acolchada para caña con correa al hombro', gancho: 'Acolchada, con cierre y correa al hombro', desc: 'Funda acolchada negra para llevar la caña armada o en tramos, con cierre largo, manija y correa regulable al hombro.', ficha: [['Largo', 'Hasta 1,90 m'], ['Cierre', 'Largo'], ['Correa', 'Al hombro, regulable'], ['Color', 'Negra']], claves: ['funda', 'bolso', 'estuche', 'correa', 'negra', 'acolchada'] },
  { id: 'reel-frontal-dorado-5000', rango: 7, cat: 'reels', tipo: 'frontal', marca: null, nombre: 'Reel frontal 5000 negro y dorado', corto: 'Frontal 5000', pres: 'Tamaño 5000 · Para embarcado', precio: 94900, descuento: 0, img: 'images/p-reel-frontal-dorado.webp', propia: false, alt: 'Reel frontal negro con detalles dorados y manija con perilla dorada', gancho: 'Más capacidad de hilo para el río grande', desc: 'Reel frontal tamaño 5000, negro con detalles dorados, con más capacidad de hilo para pescar embarcado en el río.', ficha: [['Tipo', 'Frontal (spinning)'], ['Tamaño', '5000'], ['Uso', 'Embarcado'], ['Marca', 'A confirmar']], claves: ['reel', 'frontal', 'spinning', 'dorado', 'negro', '5000', 'embarcado', 'rio'] },
  { id: 'cana-viaje-verde', rango: 8, cat: 'canas', tipo: 'rotativo', marca: null, nombre: 'Caña de viaje en tramos, verde militar', corto: 'Caña de viaje', pres: 'En tramos · Mango con gatillo', precio: 59900, descuento: 0, img: 'images/p-cana-viaje-verde.webp', propia: true, alt: 'Mano sosteniendo una caña desarmada en tramos, con mango negro con gatillo y detalles verde militar', gancho: 'Se desarma en tramos y entra en cualquier bolso', desc: 'Caña para rotativo que se desarma en varios tramos, con mango con gatillo y detalles verde militar. Ideal para llevar en la moto o en la mochila.', ficha: [['Tipo', 'Para reel rotativo'], ['Armado', 'En tramos'], ['Mango', 'Con gatillo'], ['Color', 'Verde militar y negro']], claves: ['caña', 'cana', 'viaje', 'tramos', 'verde', 'militar', 'rotativo', 'gatillo', 'mochila'] },
  { id: 'marine-rotativo-plata', rango: 9, cat: 'reels', tipo: 'rotativo', marca: 'marine', nombre: 'Reel rotativo Marine gris plata', corto: 'Rotativo gris plata', pres: 'Rotativo de perfil bajo', precio: 119900, descuento: 0, img: 'images/p-marine-plata.webp', propia: true, alt: 'Reel rotativo Marine gris plata sobre su caja negra', gancho: 'Cuerpo gris plata y manivela larga', desc: 'Reel rotativo de perfil bajo de Marine, con cuerpo gris plata y manivela larga. El modelo exacto te lo confirmamos por WhatsApp.', ficha: [['Tipo', 'Rotativo (baitcasting)'], ['Marca', 'Marine'], ['Modelo', 'A confirmar'], ['Color', 'Gris plata']], claves: ['reel', 'rotativo', 'baitcasting', 'plata', 'gris', 'marine'] },
  { id: 'cana-corcho-240', rango: 10, cat: 'canas', tipo: 'frontal', marca: null, nombre: 'Caña spinning con mango de corcho 2,40 m', corto: 'Spinning 2,40 m', pres: '2,40 m · 2 tramos · Corcho', precio: 54900, descuento: 0, img: 'images/p-cana-corcho.webp', propia: false, alt: 'Caña spinning fina con mango de corcho', gancho: 'Larga y sensible para lances lejanos', desc: 'Caña spinning de 2,40 m en dos tramos, con mango de corcho. Larga para lanzar lejos desde la costa y sentir bien el pique.', ficha: [['Tipo', 'Spinning (para frontal)'], ['Largo', '2,40 m'], ['Tramos', '2'], ['Mango', 'Corcho']], claves: ['caña', 'cana', 'spinning', 'frontal', 'corcho', 'larga', 'costa'] },
  { id: 'funda-sumax-sahara', rango: 11, cat: 'fundas', tipo: null, marca: 'sumax', nombre: 'Funda Sumax Sahara para caña', corto: 'Funda Sahara', pres: 'Negra con letras doradas', precio: 19900, descuento: 0, img: 'images/p-funda-sumax.webp', propia: true, alt: 'Fundas negras Sumax Sahara con letras doradas, paradas contra la pared', gancho: 'La funda de la línea Sahara', desc: 'Funda negra de la línea Sahara de Sumax, con letras doradas. Te confirmamos el largo según la caña que tengas.', ficha: [['Marca', 'Sumax'], ['Línea', 'Sahara'], ['Color', 'Negra y dorada'], ['Largo', 'A confirmar']], claves: ['funda', 'sahara', 'sumax', 'negra', 'estuche'] },
  { id: 'reel-frontal-grafito-4000', rango: 12, cat: 'reels', tipo: 'frontal', marca: null, nombre: 'Reel frontal 4000 grafito', corto: 'Frontal 4000', pres: 'Tamaño 4000 · Carrete calado', precio: 74900, descuento: 0, img: 'images/p-reel-frontal-grafito.webp', propia: false, alt: 'Reel frontal grafito con carrete calado plateado', gancho: 'El punto medio entre costa y embarcado', desc: 'Reel frontal tamaño 4000 en grafito, con carrete calado plateado. Una medida que sirve para casi todas las pescas del río.', ficha: [['Tipo', 'Frontal (spinning)'], ['Tamaño', '4000'], ['Carrete', 'Calado'], ['Marca', 'A confirmar']], claves: ['reel', 'frontal', 'spinning', 'grafito', '4000'] },
  { id: 'sumax-sahara-corcho', rango: 13, cat: 'canas', tipo: 'rotativo', marca: 'sumax', nombre: 'Caña Sumax Sahara, mango de corcho entero', corto: 'Sahara corcho entero', pres: 'Para rotativo · Corcho claro', precio: 79900, descuento: 0, img: 'images/p-sumax-sahara-corcho.webp', propia: true, alt: 'Mano sosteniendo una caña Sumax Sahara con mango largo de corcho claro, delante de sus fundas', gancho: 'Mango largo de corcho claro', desc: 'Caña Sumax de la línea Sahara con mango largo de corcho claro. Viene con su funda. Largo y acción te los confirmamos por WhatsApp.', ficha: [['Tipo', 'Para reel rotativo'], ['Marca', 'Sumax'], ['Línea', 'Sahara'], ['Mango', 'Corcho entero']], claves: ['caña', 'cana', 'sahara', 'sumax', 'corcho', 'rotativo'] },
  { id: 'cana-spinning-oliva-210', rango: 14, cat: 'canas', tipo: 'frontal', marca: null, nombre: 'Caña spinning verde oliva 2,10 m', corto: 'Spinning 2,10 m', pres: '2,10 m · 2 tramos · Goma EVA', precio: 46900, descuento: 0, img: 'images/p-cana-oliva.webp', propia: false, alt: 'Caña spinning negra con detalles verde oliva y mango de goma EVA', gancho: 'La medida que más se usa en costa', desc: 'Caña spinning de 2,10 m en dos tramos, con detalles verde oliva y mango de goma EVA.', ficha: [['Tipo', 'Spinning (para frontal)'], ['Largo', '2,10 m'], ['Tramos', '2'], ['Mango', 'Goma EVA']], claves: ['caña', 'cana', 'spinning', 'frontal', 'oliva', 'verde', 'eva', 'costa'] },
  { id: 'cana-dos-tramos-270', rango: 15, cat: 'canas', tipo: 'frontal', marca: null, nombre: 'Caña de 2 tramos negra y dorada 2,70 m', corto: 'Caña 2,70 m', pres: '2,70 m · 2 tramos · Mango largo', precio: 62900, descuento: 0, img: 'images/p-cana-dos-tramos.webp', propia: false, alt: 'Caña larga negra con detalles dorados y mango de goma', gancho: 'Más largo para lanzar desde la barranca', desc: 'Caña de 2,70 m en dos tramos, negra con detalles dorados y mango largo para lanzar con las dos manos.', ficha: [['Tipo', 'Spinning (para frontal)'], ['Largo', '2,70 m'], ['Tramos', '2'], ['Mango', 'Largo, goma EVA']], claves: ['caña', 'cana', 'spinning', 'frontal', 'larga', 'dorada', 'barranca'] },
  { id: 'funda-oliva', rango: 16, cat: 'fundas', tipo: null, marca: null, nombre: 'Funda para caña verde oliva', corto: 'Funda oliva', pres: 'Hasta 1,80 m · Tela liviana', precio: 14900, descuento: 0, img: 'images/p-funda-oliva.webp', propia: false, alt: 'Funda de tela verde oliva para caña, con cierre', gancho: 'Liviana, para guardar la caña en casa', desc: 'Funda de tela liviana verde oliva con cierre, para guardar la caña y que no se raye en el viaje.', ficha: [['Largo', 'Hasta 1,80 m'], ['Material', 'Tela liviana'], ['Cierre', 'Sí'], ['Color', 'Verde oliva']], claves: ['funda', 'estuche', 'oliva', 'verde', 'tela'] },
  { id: 'prueba-oculto', rango: 99, cat: 'reels', tipo: 'frontal', marca: null, nombre: 'Producto oculto de prueba', corto: 'Oculto', pres: '—', precio: 1, descuento: 0, img: 'images/p-reel-frontal-plata.webp', propia: false, alt: '', gancho: '', desc: '', ficha: [], claves: [], visible: false },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más buscados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const marcaDe = p => nombreDe(MARCAS, p.marca);
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
    p.nombre, p.pres, p.gancho, p.desc, marcaDe(p), catDe(p.cat).nombre, catDe(p.cat).titulo, p.tipo ? nombreDe(TIPOS, p.tipo) : '', ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const ordenes = new Map();

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), marca = lista(f.marca), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (marca.length && !marca.includes(p.marca)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
    const voces = indice.get(p.id) || [];
    const empieza = w => voces.some(v => v.startsWith(w));
    return palabras.every(w => empieza(w) || (w.length > 4 && w.endsWith('s') && empieza(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && empieza(w.slice(0, -2))));
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
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenes.has(o)) ordenes.set(o, [...visibles].sort(comparador(o)));
    return ordenes.get(o);
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
  KEY: 'kekofishing_cart',
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

function textoPedido(items = Cart.get()) {
  let total = 0;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    return `• ${i.qty} × ${p.nombre} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  return `¡Hola Kekofishing! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}\n¿Cómo seguimos?`;
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  camara: SVG('<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"/><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>'),
  anzuelo: SVG('<path d="M14 3v11a4 4 0 1 1 -8 0v-2l2 2"/><path d="M14 3m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
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
  const otros = ['tipo', 'marca', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="1000" height="1000"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')}</small></span></a></li>`;
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
const precioHTML = p => {
  const fin = precioFinal(p);
  if (p.descuento > 0) return `<p class="precio precio--oferta"><span class="precio__v">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__etq">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(fin)}</span></p>`;
};
const etiquetaDe = p => (p.tipo ? (p.cat === 'reels' ? nombreDe(TIPOS, p.tipo) : `Para ${nombreDe(TIPOS, p.tipo).toLowerCase()}`) : catDe(p.cat).nombre.replace(/s$/, ''));
const detDe = p => marcaDe(p) || catDe(p.cat).nombre;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(28px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(18px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver ficha</span></button><span class="prod__tipo">${esc(etiquetaDe(p))}</span>${p.propia ? `<span class="prod__real">${ICO.camara}Foto real</span>` : ''}</div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(detDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
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

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="1000" height="1000"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(p.pres)}</p>
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
  drawer.addEventListener('click', e => { if (e.target.closest('[data-drawer-cerrar]')) cerrarCapa(drawer, { devolverFoco: !e.target.closest('a') }); });
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
  let rel = [];
  if (p.tipo) rel = Tienda.consultar({ filtros: { tipo: p.tipo, cat: p.cat === 'reels' ? 'canas' : 'reels', excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const t = TIPOS.find(x => x.id === p.tipo);
  const relT = p.tipo ? (p.cat === 'reels' ? `Cañas para ${t.nombre.toLowerCase()}` : p.cat === 'canas' ? `Reels ${t.nombre.toLowerCase()}s para esta caña` : 'También te puede interesar') : 'También te puede interesar';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></figure>
    <p class="qv__nota-foto">${p.propia ? `${ICO.camara}Foto real del producto, sacada por Kekofishing.` : 'Imagen ilustrativa: el modelo exacto te lo confirmamos por WhatsApp.'} Precio de muestra.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}${t ? `<span>${esc(t.largo)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Kekofishing! Quería consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por este producto</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>${esc(relT)}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto"><img src="${esc(r.img)}" alt="" width="1000" height="1000"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    ...(p.marca ? { brand: { '@type': 'Brand', name: marcaDe(p) } } : {}),
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo,
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

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'subir' })).join('');
}
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'producto', 'productos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
  document.querySelectorAll('[data-tipo-n]').forEach(el => { el.textContent = plural(Tienda.contar({ tipo: el.dataset.tipoN }), 'producto', 'productos'); });
}

function miniHTML(p) {
  return `<li class="mini"${ANIMS.fila}>
    <button type="button" class="mini__foto" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="1000" height="1000"></button>
    <div class="mini__txt"><p class="mini__k">${esc(catDe(p.cat).nombre)}</p><h4>${esc(p.nombre)}</h4>${precioHTML(p)}</div>
    <button type="button" class="btn btn--cta btn--sm mini__add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
  </li>`;
}
function initGuia() {
  const box = document.querySelector('[data-guia]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-tipo]')];
  const panel = box.querySelector('[data-guia-panel]');
  let actual = tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.tipo || tabs[0]?.dataset.tipo;
  const pintar = () => {
    const t = TIPOS.find(x => x.id === actual);
    if (!t) return;
    tabs.forEach(b => { const on = b.dataset.tipo === actual; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    const reels = Tienda.consultar({ filtros: { tipo: t.id, cat: 'reels' }, limite: 2 }).items;
    const canas = Tienda.consultar({ filtros: { tipo: t.id, cat: 'canas' }, limite: 2 }).items;
    const total = Tienda.contar({ tipo: t.id });
    panel.setAttribute('aria-labelledby', `tab-${t.id}`);
    panel.innerHTML = `<div class="guia-ficha"${ANIMS.fila}>
      <p class="guia-ficha__k">${ICO.anzuelo}${esc(t.largo)}</p>
      <h3>${esc(t.titulo)}</h3>
      <p class="guia-ficha__t">${esc(t.aporta)}</p>
      <ul class="guia-ficha__puntos">${t.puntos.map(x => `<li>${ICO.check}<span>${esc(x)}</span></li>`).join('')}</ul>
    </div>
    <ul class="guia-prods">${[...reels, ...canas].map(miniHTML).join('')}</ul>
    <a class="link-flecha guia-mas" href="${CATALOGO_URL}?tipo=${esc(t.id)}"><span>Ver los ${total} productos para equipo ${esc(t.nombre.toLowerCase())}</span> ${ICO.flecha}</a>`;
    revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[data-tipo]');
    if (!t || t.dataset.tipo === actual) return;
    actual = t.dataset.tipo;
    pintar();
  });
  box.addEventListener('keydown', e => {
    const t = e.target.closest('[data-tipo]');
    if (!t) return;
    const k = tabs.indexOf(t);
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (k + 1) % tabs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    actual = tabs[n].dataset.tipo;
    pintar();
    tabs[n].focus();
  });
  pintar();
}

function initPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('filtrosActivos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS, marca: MARCAS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    tipo: valida(params.get('tipo'), TIPOS),
    marca: valida(params.get('marca'), MARCAS),
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
    if (solo('tipo')) return `Para equipo ${(TIPOS.find(x => x.id === e.tipo[0])?.nombre || '').toLowerCase()}`;
    if (solo('marca')) return `Productos ${MARCAS.find(x => x.id === e.marca[0])?.nombre || ''}`;
    if (e.cat.length === 1 && e.tipo.length === 1 && !e.marca.length && !e.precio.length && e.cat[0] === 'reels') return `Reels ${(TIPOS.find(x => x.id === e.tipo[0])?.nombre || '').toLowerCase()}s`;
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
    document.title = `${t || 'Catálogo'} — ${MARCA}, artículos de pesca`;
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
  desdeA('.hero1__sol', { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__foto', { y: 34, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.08);
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.hero2__banda', { clipPath: 'inset(0 0 100% 0 round 18px)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.3);
  const hilo = hero.querySelector('.sedal__hilo');
  if (hilo) {
    const L = hilo.getTotalLength ? hilo.getTotalLength() : 900;
    gsap.set(hilo, { strokeDasharray: L, strokeDashoffset: L });
    tl.to(hilo, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', onComplete: () => gsap.set(hilo, { clearProps: 'strokeDasharray,strokeDashoffset' }) }, 0.45);
  }
  desdeA('.boya', { y: -46, opacity: 0, duration: 1.3, ease: 'bounce.out', clearProps: 'transform,opacity' }, 1.05);
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { x: -24, opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1.2, clearProps: 'clipPath,transform,opacity' }, 0.2);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.4);
  desdeA('.hero-buscar', { y: 18, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.5);
  desdeA('.hero-chips li', { y: 12, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.62);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  desdeA('.hero__datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.hero__placa', { scale: 0.92, rotate: -10, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero2__24', { x: 20, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
  desdeA('.hero__ficha', { y: 26, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

[initPrecios, initRail, initDestacados, initCategoriasCuenta, initMenuCategorias, initCatalogo, initGuia, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
