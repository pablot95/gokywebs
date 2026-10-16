'use strict';

const WSP = '5491168313093';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  { id: 'tortas', nombre: 'Tortas', img: 'images/cat-tortas.webp' },
  { id: 'pastafrolas', nombre: 'Pastafrolas', img: 'images/cat-pastafrolas.webp' },
  { id: 'cookies', nombre: 'Cookies', img: 'images/cat-cookies.webp' },
  { id: 'alfajores', nombre: 'Alfajores', img: 'images/cat-alfajores.webp' },
  { id: 'pasteleria', nombre: 'Pastelería', img: 'images/cat-pasteleria.webp' },
  { id: 'panes', nombre: 'Panes', img: 'images/cat-panes.webp' },
  { id: 'dulces', nombre: 'Dulces caseros', img: 'images/cat-mermeladas.webp' },
  { id: 'infusiones', nombre: 'Infusiones', img: 'images/cat-te.webp' },
  { id: 'mesas', nombre: 'Mesas dulces', img: 'images/cat-mesa-dulce.webp' },
];
const PRECIOS = [
  { id: 'hasta-8', nombre: 'Hasta $8.000', max: 8000 },
  { id: '8-15', nombre: '$8.000 a $15.000', min: 8000, max: 15000 },
  { id: 'mas-15', nombre: 'Más de $15.000', min: 15000 },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' },
  { id: 'nuevos', nombre: 'Más nuevos' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const T_TORTA = [
  { id: '18', nombre: '18 cm', nota: '8 a 10 porciones', precio: 38000 },
  { id: '24', nombre: '24 cm', nota: '14 a 16 porciones', precio: 52000 },
];
const T_TORTA_FLORES = [
  { id: '18', nombre: '18 cm', nota: '8 a 10 porciones', precio: 45000 },
  { id: '24', nombre: '24 cm', nota: '14 a 16 porciones', precio: 62000 },
];
const T_PASTAFROLA = [
  { id: 'mediana', nombre: 'Mediana', nota: '22 cm', precio: 16000 },
  { id: 'grande', nombre: 'Grande', nota: '28 cm', precio: 22000 },
];

const Tienda = crearTienda([
  { id: 'torta-frutillas', nombre: 'Torta de frutillas y crema', cat: 'tortas', precio: 38000, opciones: T_TORTA, descuento: 0, stock: 6, alta: 10, rango: 1,
    img: 'images/p-torta-frutillas.webp', escena: 'images/tortas.webp', alt: 'Torta cubierta de crema con frutillas frescas, copos de crema y un borde de crocante rojo',
    desc: 'Torta cubierta de crema, con frutillas frescas y copos de crema arriba y un borde de crocante de frutilla. El relleno lo elegís cuando coordinamos el pedido.', tags: 'cumpleanos crema frutilla' },
  { id: 'pastafrola', nombre: 'Pastafrola de frutos rojos', cat: 'pastafrolas', precio: 16000, opciones: T_PASTAFROLA, descuento: 0, stock: 10, alta: 8, rango: 2,
    img: 'images/p-pastafrola.webp', escena: 'images/pastafrola.webp', alt: 'Pastafrola entera con enrejado dorado y dulce de frutos rojos',
    desc: 'Masa dulce casera, dulce de frutos rojos y el enrejado de siempre, con un toque de azúcar por arriba.', tags: 'tarta frutos rojos merienda' },
  { id: 'caja-cookies', nombre: 'Caja de 4 cookies corazón', cat: 'cookies', precio: 14000, descuento: 0, stock: 12, alta: 12, rango: 3,
    img: 'images/p-caja-cookies.webp', escena: 'images/cookies.webp', alt: 'Plato con cuatro cookies corazón decoradas con glasé rojo y blanco',
    desc: 'Cuatro cookies de manteca con forma de corazón, decoradas a mano con glasé rojo y blanco: lunares, flores, ramitas y puntilla.', tags: 'regalo decoradas glase corazon san valentin' },
  { id: 'mesa-dulce', nombre: 'Mesa dulce para cumpleaños', cat: 'mesas', precio: 0, medida: true, descuento: 0, stock: 99, alta: 20, rango: 4,
    img: 'images/p-mesa-dulce.webp', escena: 'images/cookies.webp', alt: 'Mesa dulce con torta de flores, pastafrola, tartaletas, alfajores y cookies corazón',
    desc: 'Torta principal, pastafrolas, tartaletas, cookies decoradas y alfajores para el cumpleaños. La armamos según la fecha, la cantidad de invitados y lo que más te guste.', tags: 'cumpleanos evento fiesta mesa dulce candy bar' },
  { id: 'alfajores-docena', nombre: 'Alfajores de maicena (docena)', cat: 'alfajores', precio: 14500, descuento: 0, stock: 15, alta: 6, rango: 5,
    img: 'images/p-alfajores-docena.webp', escena: 'images/alfajores.webp', alt: 'Alfajores de maicena apilados con dulce de leche y coco rallado',
    desc: 'Doce alfajores de maicena con dulce de leche y coco rallado en el borde.', tags: 'maicena dulce de leche coco' },
  { id: 'hogaza', nombre: 'Hogaza de masa madre (1 kg)', cat: 'panes', precio: 9500, descuento: 0, stock: 8, alta: 5, rango: 6,
    img: 'images/p-hogaza.webp', escena: 'images/panes.webp', alt: 'Hogaza redonda de masa madre con harina por arriba y cortes dorados',
    desc: 'Pan de masa madre de fermentación lenta, con corteza crocante y miga aireada.', tags: 'pan masa madre campo' },
  { id: 'trio-dulces', nombre: 'Trío de dulces caseros', cat: 'dulces', precio: 20500, descuento: 10, stock: 9, alta: 9, rango: 7,
    img: 'images/p-trio-dulces.webp', escena: 'images/mermeladas.webp', alt: 'Tres frascos de mermelada casera de frutilla, durazno y frutos del bosque',
    desc: 'Los tres dulces de la casa: frutilla, durazno y frutos del bosque, en frascos de vidrio de 400 g.', tags: 'mermelada regalo frasco' },
  { id: 'medialunas', nombre: 'Medialunas de manteca (docena)', cat: 'pasteleria', precio: 12000, descuento: 0, stock: 20, alta: 4, rango: 8,
    img: 'images/p-medialunas.webp', escena: 'images/pasteleria.webp', alt: 'Medialuna de manteca hojaldrada y dorada',
    desc: 'Doce medialunas de manteca, hojaldradas y bien doradas.', tags: 'facturas desayuno merienda' },
  { id: 'torta-flores', nombre: 'Torta de cumpleaños con flores', cat: 'tortas', precio: 45000, opciones: T_TORTA_FLORES, descuento: 0, stock: 5, alta: 18, rango: 9,
    img: 'images/p-torta-flores.webp', escena: 'images/mesa-dulce.webp', alt: 'Torta blanca de crema con frutillas y flores rojas y blancas arriba',
    desc: 'Torta cubierta de crema con frutillas y flores arriba, pensada para el centro de la mesa del cumpleaños. Las flores van según la temporada.', tags: 'cumpleanos flores crema frutilla' },
  { id: 'danesas', nombre: 'Danesas de crema y frambuesas (x4)', cat: 'pasteleria', precio: 11800, descuento: 0, stock: 4, alta: 13, rango: 10,
    img: 'images/p-danesas.webp', escena: 'images/pasteleria.webp', alt: 'Danesa hojaldrada con crema pastelera y frambuesas en el centro',
    desc: 'Masa hojaldrada con crema pastelera y frambuesas frescas en el centro.', tags: 'facturas frambuesa crema' },
  { id: 'pastafrola-porciones', nombre: 'Pastafrola en porciones (x6)', cat: 'pastafrolas', precio: 14500, descuento: 0, stock: 10, alta: 7,
    img: 'images/p-pastafrola-porciones.webp', escena: 'images/pastafrola.webp', alt: 'Pastafrola de frutos rojos cortada en porciones',
    desc: 'Seis porciones de pastafrola de frutos rojos, listas para la merienda o para llevar al trabajo.', tags: 'tarta porcion merienda' },
  { id: 'cookie-lunares', nombre: 'Cookie corazón de lunares', cat: 'cookies', precio: 3800, descuento: 0, stock: 30, alta: 3,
    img: 'images/p-cookie-lunares.webp', escena: 'images/cookies.webp', alt: 'Cookie corazón con glasé rojo y lunares blancos',
    desc: 'Cookie de manteca con glasé rojo, lunares blancos y borde de puntilla.', tags: 'decorada glase corazon' },
  { id: 'cookie-flores', nombre: 'Cookie corazón con flores', cat: 'cookies', precio: 3800, descuento: 0, stock: 30, alta: 2,
    img: 'images/p-cookie-flores.webp', escena: 'images/cookies.webp', alt: 'Cookie corazón con glasé blanco y flores rojas pintadas a mano',
    desc: 'Cookie de manteca con glasé blanco, flores rojas y tallos verdes pintados a mano.', tags: 'decorada glase corazon flores' },
  { id: 'cookie-ramitas', nombre: 'Cookie corazón con ramitas', cat: 'cookies', precio: 3800, descuento: 0, stock: 30, alta: 1,
    img: 'images/p-cookie-ramitas.webp', escena: 'images/cookies.webp', alt: 'Cookie corazón con glasé rojo y ramitas blancas',
    desc: 'Cookie de manteca con glasé rojo y ramitas blancas dibujadas a mano.', tags: 'decorada glase corazon' },
  { id: 'cookie-puntilla', nombre: 'Cookie corazón de puntilla', cat: 'cookies', precio: 3800, descuento: 0, stock: 30, alta: 17,
    img: 'images/p-cookie-puntilla.webp', escena: 'images/cookies.webp', alt: 'Cookie corazón con glasé blanco, borde de puntilla y un corazón rojo',
    desc: 'Cookie de manteca con glasé blanco, borde de puntilla y un corazoncito rojo.', tags: 'decorada glase corazon' },
  { id: 'galletitas-rellenas', nombre: 'Galletitas de manteca rellenas (x6)', cat: 'cookies', precio: 6900, descuento: 0, stock: 14, alta: 11,
    img: 'images/p-galletitas-rellenas.webp', escena: 'images/te.webp', alt: 'Galletitas de manteca rellenas, una mordida, sobre la mesa del té',
    desc: 'Galletitas de manteca tiernas y doraditas, rellenas de a dos. Ideales para el té.', tags: 'te merienda manteca' },
  { id: 'alfajores-media', nombre: 'Alfajores de maicena (media docena)', cat: 'alfajores', precio: 7800, descuento: 0, stock: 15, alta: 14,
    img: 'images/p-alfajores-media.webp', escena: 'images/alfajores.webp', alt: 'Alfajor de maicena con dulce de leche y coco rallado',
    desc: 'Seis alfajores de maicena con dulce de leche y coco rallado en el borde.', tags: 'maicena dulce de leche coco' },
  { id: 'alfajor-sable', nombre: 'Alfajores sablé con dulce de leche (x6)', cat: 'alfajores', precio: 9900, descuento: 0, stock: 10, alta: 16,
    img: 'images/p-alfajor-sable.webp', escena: 'images/pasteleria.webp', alt: 'Alfajor sablé relleno de dulce de leche con azúcar impalpable',
    desc: 'Tapas sablé bien mantecosas, mucho dulce de leche y azúcar impalpable por arriba.', tags: 'dulce de leche sable' },
  { id: 'pan-campo', nombre: 'Pan de campo (½ kg)', cat: 'panes', precio: 5500, descuento: 0, stock: 10, alta: 15,
    img: 'images/p-pan-campo.webp', escena: 'images/panes.webp', alt: 'Pan de campo cortado al medio con miga aireada',
    desc: 'Pan de campo con corteza dorada y harina por arriba. Va entero o en rodajas.', tags: 'pan campo' },
  { id: 'pan-integral', nombre: 'Pan integral en rodajas', cat: 'panes', precio: 6800, descuento: 0, stock: 10, alta: 21,
    img: 'images/p-pan-integral.webp', escena: 'images/panes.webp', alt: 'Rodajas de pan integral sobre una tabla',
    desc: 'Pan integral cortado en rodajas, listo para tostar en el desayuno.', tags: 'pan integral desayuno tostadas' },
  { id: 'mermelada-frutilla', nombre: 'Mermelada de frutilla (400 g)', cat: 'dulces', precio: 7500, descuento: 0, stock: 12, alta: 19,
    img: 'images/p-mermelada-frutilla.webp', escena: 'images/mermeladas.webp', alt: 'Frasco de mermelada casera de frutilla con frutillas al lado',
    desc: 'Dulce casero de frutillas con pedacitos de fruta, en frasco de vidrio de 400 g.', tags: 'mermelada frasco frutilla' },
  { id: 'mermelada-durazno', nombre: 'Dulce de durazno (400 g)', cat: 'dulces', precio: 7500, descuento: 0, stock: 12, alta: 22,
    img: 'images/p-mermelada-durazno.webp', escena: 'images/mermeladas.webp', alt: 'Frasco de dulce de durazno casero',
    desc: 'Dulce casero de durazno, suave y brillante, en frasco de vidrio de 400 g.', tags: 'mermelada frasco durazno' },
  { id: 'mermelada-bosque', nombre: 'Mermelada de frutos del bosque (400 g)', cat: 'dulces', precio: 8200, descuento: 0, stock: 8, alta: 23,
    img: 'images/p-mermelada-bosque.webp', escena: 'images/mermeladas.webp', alt: 'Frasco de mermelada casera de frutos del bosque con frambuesas',
    desc: 'Dulce casero de frutos del bosque, intenso y con semillitas, en frasco de vidrio de 400 g.', tags: 'mermelada frasco frambuesa arandano' },
  { id: 'croissant-chocolate', nombre: 'Croissants con chocolate (x4)', cat: 'pasteleria', precio: 9800, descuento: 0, stock: 12, alta: 24,
    img: 'images/p-croissant-chocolate.webp', escena: 'images/pasteleria.webp', alt: 'Croissant hojaldrado enrollado con chocolate adentro',
    desc: 'Masa hojaldrada enrollada con barritas de chocolate adentro.', tags: 'facturas chocolate' },
  { id: 'rolls-canela', nombre: 'Rolls de canela glaseados (x4)', cat: 'pasteleria', precio: 10500, descuento: 0, stock: 10, alta: 25,
    img: 'images/p-rolls-canela.webp', escena: 'images/pasteleria.webp', alt: 'Roll de canela con glaseado blanco',
    desc: 'Rolls de masa tierna con canela y azúcar, terminados con glaseado.', tags: 'facturas canela' },
  { id: 'tartaletas', nombre: 'Tartaletas de frutilla (x6)', cat: 'pasteleria', precio: 13500, descuento: 0, stock: 8, alta: 26,
    img: 'images/p-tartaletas.webp', escena: 'images/mesa-dulce.webp', alt: 'Plato con tartaletas de crema y una frutilla entera arriba',
    desc: 'Tartaletas de masa sablé con crema y una frutilla entera arriba.', tags: 'tarta frutilla cumpleanos' },
  { id: 'pasteleria-surtida', nombre: 'Bandeja de pastelería surtida (x8)', cat: 'pasteleria', precio: 16500, descuento: 10, stock: 6, alta: 27,
    img: 'images/p-pasteleria-surtida.webp', escena: 'images/pasteleria.webp', alt: 'Bandeja con medialunas, croissants con chocolate, roll de canela, danesa y alfajor',
    desc: 'Dos de cada una: medialunas, croissants con chocolate, rolls de canela y danesas. Un poco de todo para compartir.', tags: 'facturas surtidas compartir desayuno' },
  { id: 'te-frutos-rojos', nombre: 'Té negro con frutos rojos (100 g)', cat: 'infusiones', precio: 6500, descuento: 0, stock: 15, alta: 28,
    img: 'images/p-te-frutos-rojos.webp', escena: 'images/te.webp', alt: 'Taza de té con flores rojas pintadas y galletitas al lado',
    desc: 'Blend de té negro en hebras con frutos rojos deshidratados. Rinde unas 40 tazas.', tags: 'te hebras blend infusion' },
  { id: 'merienda', nombre: 'Merienda para dos', cat: 'infusiones', precio: 13900, descuento: 0, stock: 8, alta: 29,
    img: 'images/p-merienda.webp', escena: 'images/te.webp', alt: 'Taza de té con galletitas de manteca rellenas y una tetera al fondo',
    desc: 'Té negro con frutos rojos (50 g) y seis galletitas de manteca rellenas, para una tarde de té en casa.', tags: 'te regalo merienda combo' },
  { id: 'budin-limon', nombre: 'Budín de limón', cat: 'pasteleria', precio: 8500, descuento: 0, stock: 0, alta: 0, visible: false,
    img: 'images/p-pasteleria-surtida.webp', alt: 'Próximamente', desc: 'Próximamente.' },
], {
  tope: 100,
  texto: p => [p.nombre, nombreDe(CATEGORIAS, p.cat), p.desc, p.tags, p.medida ? 'a medida presupuesto' : ''].join(' '),
});

function crearTienda(coleccion, { tope = 100, texto = p => p.nombre } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm(texto(p))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => (p.opciones?.length ? Math.min(...p.opciones.map(o => o.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(desde(p) * (1 - p.descuento / 100)) : desde(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.destacado === true && !p.rango) return false;
    if ((f.precioMin != null || f.precioMax != null) && p.medida) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const t = indice.get(p.id) || '';
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const conPrecio = (a, b) => (a.medida ? 1 : 0) - (b.medida ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => conPrecio(a, b) || final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => conPrecio(a, b) || final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conOpciones = p => (p.opciones || []).length > 0;
const opcionDe = (p, v) => (p.opciones || []).find(o => o.id === v) || null;
const precioBase = (p, v) => opcionDe(p, v)?.precio ?? (conOpciones(p) ? Math.min(...p.opciones.map(o => o.precio)) : p.precio);
const precioFinal = (p, v) => {
  const b = precioBase(p, v);
  return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b;
};
const cache = new Map();
const getProducto = id => {
  if (!cache.has(id)) cache.set(id, Tienda.obtener(id));
  return cache.get(id);
};
function nombreDe(arr, id) { return arr.find(x => x.id === id)?.nombre || ''; }
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const msgMedida = p => `¡Hola CM Dulces! Quiero consultar por una ${p.nombre.toLowerCase()}. Es para el día … y somos … invitados.`;

const Cart = {
  KEY: 'cmdulces_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mas: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  carrito: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle class="i-dot" cx="9.5" cy="20" r="1.5"/><circle class="i-dot" cx="17.5" cy="20" r="1.5"/></svg>',
  tamano: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/></svg>',
  basura: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>',
  cerrar: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  wsp: '<svg class="i i-fill" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  if (p.medida) return '<p class="precio precio--medida">Presupuesto a medida</p>';
  const desdeTxt = conOpciones(p) ? '<small>desde</small>' : '';
  if (p.descuento > 0) return `<p class="precio precio--off">${desdeTxt}<span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(precioBase(p))}</s></p>`;
  return `<p class="precio">${desdeTxt}<span>${formatearPrecio(precioFinal(p))}</span></p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.medida) b.push('<span class="badge badge--medida">A medida</span>');
  else if (p.alta >= 24) b.push('<span class="badge">Nuevo</span>');
  if (!p.medida && p.stock > 0 && p.stock <= 4) b.push('<span class="badge">Últimas de la semana</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" inputmode="numeric" min="1" max="${max}" value="${valor}" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function accionesHTML(p, compacta) {
  if (p.medida) {
    return `<div class="prod-actions"><a class="btn btn--dark prod-add" href="${wspHref(msgMedida(p))}" target="_blank" rel="noopener" aria-label="Consultar por ${esc(p.nombre)} por WhatsApp">${ICON.wsp}<span class="prod-add__txt">Consultar</span></a></div>`;
  }
  if (conOpciones(p)) {
    return `<div class="prod-actions"><button type="button" class="btn btn--cta prod-add" data-quick="${p.id}" aria-label="Elegir tamaño de ${esc(p.nombre)}">${ICON.tamano}<span class="prod-add__txt">Elegir tamaño</span></button></div>`;
  }
  if (compacta) {
    return `<div class="prod-actions"><button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span class="prod-add__txt">Agregar</span></button></div>`;
  }
  return `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="btn btn--cta prod-add prod-add--ico" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span class="prod-add__txt">Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
}
function cardHTML(p, { animar = true, compacta = false } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card${compacta ? ' card--compacta' : ''}"${anim} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">${badgesHTML(p)}<span class="card__ver">Ver detalle</span></button>
    <div class="card__info">
      <p class="card__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      ${accionesHTML(p, compacta)}
    </div>
  </article>`;
}

let revealsListos = false;
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

function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
let overlaysAbiertos = 0;
function bloquearScroll(on) {
  overlaysAbiertos = Math.max(0, overlaysAbiertos + (on ? 1 : -1));
  document.body.classList.toggle('no-scroll', overlaysAbiertos > 0);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  const header = document.querySelector('.site-header');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll(false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll(true);
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function catActual() {
  if (PAGINA !== 'catalogo') return [];
  const v = new URLSearchParams(location.search).get('cat') || '';
  return v.split(',').filter(id => CATEGORIAS.some(c => c.id === id));
}
function initCatsMenu() {
  const box = document.querySelector('[data-nav-cats]');
  const panel = document.getElementById('catsPanel');
  if (!box || !panel) return;
  const btn = box.querySelector('.nav-cats__btn');
  const activas = catActual();
  panel.innerHTML = CATEGORIAS.map(c => {
    const n = Tienda.contar({ cat: c.id });
    const cur = activas.length === 1 && activas[0] === c.id ? ' aria-current="page"' : '';
    return `<a class="cat-link" href="${CATALOGO_URL}?cat=${c.id}"${cur}><img src="${c.img}" alt="" width="44" height="44"><span class="cat-link__nombre">${esc(c.nombre)}</span><span class="cat-link__n">${n}</span></a>`;
  }).join('') + `<a class="cat-link cat-link--todo" href="${CATALOGO_URL}">Ver todo el catálogo${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 961px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
  box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.09, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero1__card > .vichy-cinta'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.2, clearProps: 'transform' }, 0)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker'), { y: 22, opacity: 0, duration: 1 }, 0.38)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.48)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, rotation: -12, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.mesas__foto--cuadrada img');
  if (foto) {
    gsap.set(foto, { height: '110%', top: '-5%', position: 'relative' });
    gsap.fromTo(foto, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.mesas', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  document.querySelectorAll('.sello__in').forEach(s => {
    gsap.to(s, { rotation: 28, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 16;
  const syncFlechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });
  syncFlechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, killClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { e.preventDefault(); vp.scrollLeft = startLeft - dx; }
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      killClick = true;
      setTimeout(() => { killClick = false; }, 60);
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (killClick) { e.preventDefault(); e.stopPropagation(); killClick = false; } }, true);
}

let railIds = [];
function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catCount });
    el.textContent = n === 1 ? '1 opción' : `${n} opciones`;
  });
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = total; });

  const track = document.getElementById('railTrack');
  if (track) {
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    railIds = items.map(p => p.id);
    track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { animar: false, compacta: true })}</div>`).join('');
  }
  const grid = document.getElementById('prevGrid');
  if (grid) {
    const { items } = Tienda.consultar({ filtros: { excluir: railIds }, orden: 'nuevos', limite: 8 });
    grid.innerHTML = items.map(p => cardHTML(p, { compacta: true })).join('');
  }
}

function cartaItemHTML(p) {
  let accion;
  if (p.medida) accion = `<a class="carta-add" href="${wspHref(msgMedida(p))}" target="_blank" rel="noopener" aria-label="Consultar por ${esc(p.nombre)} por WhatsApp">${ICON.wsp}</a>`;
  else if (conOpciones(p)) accion = `<button type="button" class="carta-add" data-quick="${p.id}" aria-label="Elegir tamaño de ${esc(p.nombre)}">${ICON.mas}</button>`;
  else accion = `<button type="button" class="carta-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.mas}</button>`;
  return `<div class="carta-item" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <button type="button" class="carta-item__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="84" height="84" decoding="async"></button>
    <h3 class="carta-item__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
    <p class="carta-item__desc">${esc(p.desc)}</p>
    <div class="carta-item__lado">${precioHTML(p)}${accion}</div>
  </div>`;
}
function initCarta() {
  const tabs = document.getElementById('cartaTabs');
  const panel = document.getElementById('cartaPanel');
  const ver = document.getElementById('cartaVer');
  const nota = document.getElementById('cartaNota');
  if (!tabs || !panel) return;
  const cats = CATEGORIAS.filter(c => Tienda.contar({ cat: c.id }) > 0);
  const inicial = cats.reduce((a, c) => (Tienda.contar({ cat: c.id }) > Tienda.contar({ cat: a.id }) ? c : a), cats[0]);
  tabs.innerHTML = cats.map(c => `<button type="button" class="carta-tab" role="tab" id="tab-${c.id}" aria-selected="${c === inicial}" aria-controls="cartaPanel" tabindex="${c === inicial ? 0 : -1}" data-carta="${c.id}"><img src="${c.img}" alt="" width="40" height="40">${esc(c.nombre)}</button>`).join('');
  const pintar = (id, primera) => {
    const { items } = Tienda.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 6 });
    const total = Tienda.contar({ cat: id });
    const nombre = nombreDe(CATEGORIAS, id);
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = items.map(cartaItemHTML).join('');
    if (ver) { ver.href = `${CATALOGO_URL}?cat=${id}`; ver.querySelector('span').textContent = total > items.length ? `Ver las ${total} opciones de ${nombre.toLowerCase()}` : `Ver ${nombre.toLowerCase()} en el catálogo`; }
    if (nota) nota.textContent = id === 'mesas' ? 'Las mesas dulces se presupuestan por WhatsApp según la fecha y los invitados.' : 'Los pedidos se coordinan por WhatsApp para retirar o recibir.';
    if (!primera) {
      panel.classList.remove('cambia'); void panel.offsetWidth; panel.classList.add('cambia');
      revelarNuevos(panel);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  };
  const elegir = (btn, foco) => {
    tabs.querySelectorAll('.carta-tab').forEach(b => { const on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    if (foco) btn.focus();
    btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    pintar(btn.dataset.carta, false);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-carta]'); if (b && b.getAttribute('aria-selected') !== 'true') elegir(b, false); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const lista = [...tabs.querySelectorAll('.carta-tab')];
    const i = lista.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? lista.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + lista.length) % lista.length;
    elegir(lista[j], true);
  });
  pintar(inicial.id, true);
  const activa = tabs.querySelector('[aria-selected="true"]');
  if (activa) {
    const r = activa.getBoundingClientRect(), rt = tabs.getBoundingClientRect();
    if (r.right > rt.right) tabs.scrollLeft += r.left - rt.left - 16;
  }
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const LUGARES = {
  pedidos: { nombre: 'Pedidos por WhatsApp y por la web', nota: 'Te respondemos y te confirmamos el pedido.' },
  retiro: { nombre: 'Retiro de pedidos', nota: 'La dirección te la pasamos al confirmar.' },
  feria: { nombre: 'Feria de emprendedores', nota: 'Cuál nos toca, lo avisamos en Instagram.' },
};
const SEMANA = {
  0: [],
  1: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'retiro', d: 16, h: 19 }],
  2: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'retiro', d: 16, h: 19 }],
  3: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'retiro', d: 16, h: 19 }],
  4: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'retiro', d: 16, h: 19 }],
  5: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'retiro', d: 16, h: 19 }],
  6: [{ l: 'pedidos', d: 9, h: 19 }, { l: 'feria', d: 10, h: 18 }],
};
function ahoraAR() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia: dia < 0 ? new Date().getDay() : dia, hora: (parseInt(val('hour'), 10) % 24) + parseInt(val('minute'), 10) / 60 };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), hora: d.getHours() + d.getMinutes() / 60 };
  }
}
function estadoAhora() {
  const { dia, hora } = ahoraAR();
  const hoy = SEMANA[dia] || [];
  const feria = hoy.find(t => t.l === 'feria' && hora >= t.d && hora < t.h);
  if (feria) return { abierto: true, texto: `Ahora estamos en la feria, hasta las ${feria.h} h` };
  const pedidos = hoy.find(t => t.l === 'pedidos' && hora >= t.d && hora < t.h);
  if (pedidos) return { abierto: true, texto: `Hoy tomamos pedidos hasta las ${pedidos.h} h` };
  const antes = hoy.find(t => t.l === 'pedidos' && hora < t.d);
  if (antes) return { abierto: false, texto: `Hoy tomamos pedidos desde las ${antes.d} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const t = (SEMANA[d] || []).find(x => x.l === 'pedidos');
    if (t) return { abierto: false, texto: `Volvemos a tomar pedidos ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${t.d} h` };
  }
  return { abierto: false, texto: 'Pedidos por WhatsApp' };
}
function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoAhora();
    els.forEach(el => {
      el.querySelector('.punto')?.classList.toggle('abierto', e.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = e.texto;
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}
function accionDia(d) {
  const dia = DIAS[d];
  if ((SEMANA[d] || []).some(t => t.l === 'feria')) return { txt: `Preguntar en qué feria están el ${dia}`, msg: `¡Hola CM Dulces! ¿En qué feria van a estar el ${dia}?` };
  if ((SEMANA[d] || []).some(t => t.l === 'retiro')) return { txt: `Coordinar un retiro para el ${dia}`, msg: `¡Hola CM Dulces! Quiero hacer un pedido para retirar el ${dia}.` };
  return { txt: 'Dejar mi pedido para el lunes', msg: '¡Hola CM Dulces! Les dejo un pedido para el lunes: ' };
}
function initAgenda() {
  const dias = document.getElementById('dias');
  const panel = document.getElementById('diaPanel');
  if (!dias || !panel) return;
  const { dia: hoy } = ahoraAR();
  const orden = [1, 2, 3, 4, 5, 6, 0];
  dias.innerHTML = orden.map(d => `<button type="button" class="dia${d === hoy ? ' dia--hoy' : ''}" data-dia="${d}" aria-pressed="${d === hoy}" aria-controls="diaPanel" aria-label="${DIAS[d]}${d === hoy ? ' (hoy)' : ''}">${DIAS_CORTOS[d]}<small>${d === hoy ? 'Hoy' : (SEMANA[d] || []).length ? `${(SEMANA[d] || [])[0].d}-${Math.max(...SEMANA[d].map(t => t.h))} h` : 'Cerrado'}</small></button>`).join('');
  const pintar = (d, animar) => {
    const turnos = SEMANA[d] || [];
    const a = accionDia(d);
    const titulo = d === hoy ? `Hoy, <em>${DIAS[d]}</em>` : `El <em>${DIAS[d]}</em>`;
    const lista = turnos.length
      ? `<ul class="turnos">${turnos.map(t => `<li class="turno"><span class="turno__hora">${t.d} a ${t.h} h</span><span class="turno__lugar">${esc(LUGARES[t.l].nombre)}<span class="turno__nota">${esc(LUGARES[t.l].nota)}</span></span></li>`).join('')}</ul>`
      : '<p class="dia-panel__vacio">Los domingos descansamos. Igual podés dejarnos tu pedido por WhatsApp y te respondemos el lunes.</p>';
    panel.innerHTML = `<p class="dia-panel__t">${titulo}</p>${lista}<a class="btn btn--cta" href="${wspHref(a.msg)}" target="_blank" rel="noopener">${ICON.wsp}${esc(a.txt)}</a>`;
    if (animar) { panel.classList.remove('cambia'); void panel.offsetWidth; panel.classList.add('cambia'); }
  };
  dias.addEventListener('click', e => {
    const b = e.target.closest('[data-dia]');
    if (!b) return;
    dias.querySelectorAll('[data-dia]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(+b.dataset.dia, true);
  });
  pintar(hoy, false);
}

const QV = { p: null, v: '', foto: 0, opener: null };
function qvHTML(p) {
  const fotos = [p.img, p.escena].filter(Boolean);
  const rel = Tienda.consultar({ filtros: { cat: p.cat === 'mesas' ? ['tortas', 'pasteleria'] : p.cat, excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  const opcionesHTML = conOpciones(p) ? `<div class="qv__grupo"><p class="qv__label" id="qvOpLabel">Tamaño</p><div class="chips" id="qvOpciones" role="group" aria-labelledby="qvOpLabel">${p.opciones.map(o => `<button type="button" class="chip" data-op="${o.id}" aria-pressed="${QV.v === o.id}">${esc(o.nombre)}<small>${esc(o.nota)} · ${formatearPrecio(precioFinal(p, o.id))}</small></button>`).join('')}</div></div>` : '';
  const compra = p.medida
    ? `<div class="qv__medida"><p><strong>¿Cómo la pedimos?</strong> Escribinos con la fecha del cumpleaños y cuántos invitados son: te pasamos una propuesta con precio.</p><a class="btn btn--cta" href="${wspHref(msgMedida(p))}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a></div>`
    : `${opcionesHTML}<div class="qv__grupo"><p class="qv__label">Cantidad</p>${stepperHTML(p.stock)}</div>
      <div class="qv__compra">
        <button type="button" class="btn btn--cta" data-qv-add>${ICON.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button>
      </div>
      <p class="qv__stock">${p.stock <= 4 ? `Quedan ${p.stock} para esta semana.` : 'Lo preparamos a pedido.'} La entrega o el retiro los coordinamos por WhatsApp.</p>`;
  return `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__foto"><img id="qvImg" src="${fotos[QV.foto] || p.img}" alt="${esc(p.alt)}" width="800" height="800"></div>
      ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, i) => `<button type="button" class="qv__mini" data-qv-foto="${i}" aria-pressed="${i === QV.foto}" aria-label="Ver foto ${i + 1}"><img src="${f}" alt="" width="68" height="68"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precio" id="qvPrecio">${qvPrecioHTML(p)}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${compra}
    </div>
  </div>
  ${rel.length ? `<div class="qv__rel"><p class="qv__rel-t">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="rel" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="64" height="64"><span><span class="rel__n">${esc(r.nombre)}</span><span class="rel__p">${r.medida ? 'A medida' : (conOpciones(r) ? 'desde ' : '') + formatearPrecio(precioFinal(r))}</span></span></button>`).join('')}</div></div>` : ''}`;
}
function qvPrecioHTML(p) {
  if (!conOpciones(p) || !QV.v) return precioHTML(p);
  if (p.descuento > 0) return `<p class="precio precio--off"><span>${formatearPrecio(precioFinal(p, QV.v))}</span><s>${formatearPrecio(precioBase(p, QV.v))}</s></p>`;
  return `<p class="precio"><span>${formatearPrecio(precioFinal(p, QV.v))}</span></p>`;
}
function ldProducto(p) {
  let el = document.getElementById('ldProducto');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ldProducto'; document.head.appendChild(el); }
  const base = location.href.split(/[?#]/)[0].replace(/[^/]*$/, '');
  const data = { '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: base + p.img, brand: { '@type': 'Brand', name: 'CM Dulces' } };
  if (!p.medida) data.offers = { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' };
  el.textContent = JSON.stringify(data);
}
function abrirQV(id, opener) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  const yaAbierto = !qv.hidden;
  QV.p = p; QV.v = ''; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  document.getElementById('qvContenido').innerHTML = qvHTML(p);
  ldProducto(p);
  if (!yaAbierto) {
    qv.hidden = false;
    bloquearScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('abierto')));
  }
  const panel = qv.querySelector('.qv__panel');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 320);
  bloquearScroll(false);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  QV.opener?.focus?.({ preventScroll: true });
}
function cantidadDe(cont) {
  const input = cont?.querySelector('[data-stepper] input');
  const v = parseInt(input?.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 1;
}
function qvAgregar(comprar) {
  const p = QV.p;
  if (!p || p.medida) return;
  if (conOpciones(p) && !QV.v) {
    const chips = document.getElementById('qvOpciones');
    if (chips) {
      chips.classList.remove('sacudir'); void chips.offsetWidth; chips.classList.add('sacudir', 'falta');
      chips.querySelector('.chip')?.focus();
    }
    showToast('Elegí un tamaño para seguir.');
    return;
  }
  const qty = Math.min(cantidadDe(document.getElementById('qvContenido')), p.stock || 99);
  Cart.add(p, qty, QV.v);
  if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
  else showToast(`Sumaste ${p.nombre}${QV.v ? ` (${opcionDe(p, QV.v).nombre})` : ''} al carrito.`);
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarQV(); return; }
    const chip = e.target.closest('[data-op]');
    if (chip) {
      QV.v = chip.dataset.op;
      const chips = chip.parentElement;
      chips.classList.remove('falta');
      chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      document.getElementById('qvPrecio').innerHTML = qvPrecioHTML(QV.p);
      return;
    }
    const mini = e.target.closest('[data-qv-foto]');
    if (mini) {
      QV.foto = +mini.dataset.qvFoto;
      const fotos = [QV.p.img, QV.p.escena].filter(Boolean);
      document.getElementById('qvImg').src = fotos[QV.foto];
      qv.querySelectorAll('[data-qv-foto]').forEach(m => m.setAttribute('aria-pressed', String(m === mini)));
      return;
    }
    if (e.target.closest('[data-qv-add]')) { qvAgregar(false); return; }
    if (e.target.closest('[data-qv-buy]')) { qvAgregar(true); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) abrirQV(rel.dataset.qvRel);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirQV(slug, document.getElementById('grid'));
}

let carritoOpener = null;
function lineaHTML(i, nueva) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = opcionDe(p, i.v);
  return `<div class="linea${nueva ? ' entra' : ''}" data-linea="${i.id}" data-v="${esc(i.v || '')}">
    <img src="${p.img}" alt="" width="76" height="76">
    <div>
      <p class="linea__n">${esc(p.nombre)}</p>
      <p class="linea__v">${op ? `${esc(op.nombre)} · ` : ''}${formatearPrecio(precioFinal(p, i.v))} c/u</p>
      <div class="linea__acc">${stepperHTML(p.stock, i.qty)}<button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></div>
    </div>
    <p class="linea__p">${formatearPrecio(precioFinal(p, i.v) * i.qty)}</p>
  </div>`;
}
let lineasPrevias = new Set();
function renderCarrito() {
  const lista = document.getElementById('cartLista');
  const pie = document.getElementById('cartPie');
  if (!lista || !pie) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const n = items.reduce((s, i) => s + i.qty, 0);
  const cartN = document.getElementById('cartN');
  if (cartN) cartN.textContent = n ? `(${n})` : '';
  if (!items.length) {
    lista.innerHTML = `<div class="carrito-vacio"><span class="carrito-vacio__plato" aria-hidden="true"></span><p class="carrito-vacio__t">Tu plato está vacío</p><p>Elegí algo rico de la tienda y lo sumamos a tu pedido.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Ver los productos</a></div>`;
    pie.hidden = true;
    lineasPrevias = new Set();
    return;
  }
  pie.hidden = false;
  const claves = items.map(i => `${i.id}|${i.v || ''}`);
  lista.innerHTML = items.map((i, k) => lineaHTML(i, !lineasPrevias.has(claves[k]))).join('');
  lineasPrevias = new Set(claves);
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const resumen = items.map(i => { const p = getProducto(i.id); const op = opcionDe(p, i.v); return `• ${i.qty} × ${p.nombre}${op ? ` (${op.nombre})` : ''}`; }).join('\n');
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = wspHref(`¡Hola CM Dulces! Tengo este pedido en el carrito:\n${resumen}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cuándo lo puedo retirar?`);
}
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d || !d.hidden) return;
  carritoOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  d.querySelector('.drawer__panel').focus({ preventScroll: true });
}
function cerrarCarrito() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 400);
  bloquearScroll(false);
  carritoOpener?.focus?.({ preventScroll: true });
}
function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cart-cerrar]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v || '';
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, v); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.step));
    }
  });
  d.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    const linea = e.target.closest('[data-linea]');
    if (input && linea) Cart.setQty(linea.dataset.linea, linea.dataset.v || '', parseInt(input.value, 10) || 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(d.querySelector('.drawer__panel'), e);
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-step]');
    if (step && !step.closest('#drawer')) {
      const input = step.parentElement.querySelector('input');
      const max = parseInt(input.max, 10) || 99;
      input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQV(quick.dataset.quick, quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = add.closest('.card');
      Cart.add(p, cantidadDe(card));
      const input = card?.querySelector('[data-stepper] input');
      if (input) input.value = 1;
      showToast(`Sumaste ${p.nombre} al carrito.`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, cantidadDe(buy.closest('.card')));
      abrirCarrito();
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input || input.closest('#drawer')) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
  document.addEventListener('cart:updated', updateCartBadge);
}

function initGaleria() {
  const lb = document.getElementById('lb');
  const items = [...document.querySelectorAll('.foto-item')];
  if (!lb || !items.length) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  let i = 0, opener = null;
  const pintar = () => {
    const it = items[i];
    img.src = it.dataset.foto;
    img.alt = it.querySelector('img')?.alt || '';
    cap.textContent = it.dataset.cap || '';
  };
  const abrir = (k, from) => {
    i = k; opener = from; pintar();
    lb.hidden = false; bloquearScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('abierto')));
    lb.querySelector('[data-lb-cerrar]').focus();
  };
  const cerrar = () => {
    if (lb.hidden) return;
    lb.classList.remove('abierto');
    setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 300);
    bloquearScroll(false);
    opener?.focus({ preventScroll: true });
  };
  const mover = d => { i = (i + d + items.length) % items.length; pintar(); };
  items.forEach((it, k) => it.addEventListener('click', () => abrir(k, it)));
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-lb-cerrar]') || e.target === lb) cerrar();
    else if (e.target.closest('[data-lb-prev]')) mover(-1);
    else if (e.target.closest('[data-lb-next]')) mover(1);
  });
  lb.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else atraparFoco(lb, e);
  });
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('grid');
  const form = document.getElementById('filtros');
  if (!grid || !form) return;
  const buscar = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const verMas = document.getElementById('verMas');
  const masInfo = document.getElementById('masInfo');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const activos = document.getElementById('activos');
  const migaCat = document.getElementById('migaCat');
  const h1 = document.getElementById('h1');
  const nFiltros = document.getElementById('nFiltros');

  const qs = new URLSearchParams(location.search);
  const valida = (v, arr) => (v || '').split(',').filter(id => arr.some(x => x.id === id));
  const estado = {
    cat: valida(qs.get('cat'), CATEGORIAS),
    precio: PRECIOS.some(x => x.id === qs.get('precio')) ? qs.get('precio') : '',
    oferta: qs.get('oferta') === '1',
    q: (qs.get('q') || '').slice(0, 60),
    orden: ORDENES.some(o => o.id === qs.get('orden')) ? qs.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;

  ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('');
  ordenSel.value = estado.orden;
  buscar.value = estado.q;

  const filtrosDe = (sin = {}) => {
    const r = PRECIOS.find(x => x.id === estado.precio);
    return {
      cat: sin.cat ? [] : estado.cat,
      precioMin: sin.precio ? null : r?.min ?? null,
      precioMax: sin.precio ? null : r?.max ?? null,
      oferta: sin.oferta ? false : estado.oferta,
      q: estado.q,
    };
  };

  function pintarFiltros() {
    document.getElementById('fCat').innerHTML = CATEGORIAS.map(c => `<label class="opcion"><input type="checkbox" data-f="cat" value="${c.id}"${estado.cat.includes(c.id) ? ' checked' : ''}><span>${esc(c.nombre)}</span><span class="opcion__n" data-n-cat="${c.id}"></span></label>`).join('');
    document.getElementById('fPrecio').innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(r => `<label class="opcion"><input type="radio" name="precio" value="${r.id}"${estado.precio === r.id ? ' checked' : ''}><span>${r.nombre}</span></label>`).join('');
    form.querySelector('[data-f="oferta"]').checked = estado.oferta;
  }
  function pintarConteos() {
    CATEGORIAS.forEach(c => {
      const el = form.querySelector(`[data-n-cat="${c.id}"]`);
      if (el) el.textContent = Tienda.contar({ ...filtrosDe({ cat: true }), cat: [c.id] });
    });
    const nOf = form.querySelector('[data-n-oferta]');
    if (nOf) nOf.textContent = Tienda.contar({ ...filtrosDe({ oferta: true }), oferta: true });
  }
  function pintarCabecera(total) {
    const cats = estado.cat.map(id => nombreDe(CATEGORIAS, id));
    const una = estado.cat.length === 1;
    h1.textContent = una ? cats[0] : 'Todo lo de la casa';
    migaCat.hidden = !una;
    migaCat.textContent = una ? cats[0] : '';
    document.title = `${una ? cats[0] : 'Catálogo'} — CM Dulces`;
    contador.innerHTML = total === 1 ? '<strong>1</strong> producto' : `<strong>${total}</strong> productos`;
    document.querySelectorAll('.cat-link').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (una && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarActivos() {
    const chips = [];
    estado.cat.forEach(id => chips.push({ t: nombreDe(CATEGORIAS, id), quitar: () => { estado.cat = estado.cat.filter(x => x !== id); } }));
    if (estado.precio) chips.push({ t: nombreDe(PRECIOS, estado.precio), quitar: () => { estado.precio = ''; } });
    if (estado.oferta) chips.push({ t: 'Con descuento', quitar: () => { estado.oferta = false; } });
    if (estado.q) chips.push({ t: `«${estado.q}»`, quitar: () => { estado.q = ''; buscar.value = ''; } });
    activos.innerHTML = chips.map((c, i) => `<button type="button" class="activo" data-activo="${i}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)}${ICON.cerrar}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
    activos._chips = chips;
    const n = chips.length - (estado.q ? 1 : 0);
    nFiltros.hidden = n === 0;
    nFiltros.textContent = n;
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'precio', 'oferta', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.oferta) u.searchParams.set('oferta', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    const filtros = filtrosDe();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const pagina = Tienda.consultar({ filtros, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = pagina.cursor;
    grid.insertAdjacentHTML('beforeend', pagina.items.map(p => cardHTML(p)).join(''));
    mostrados += pagina.items.length;
    const total = Tienda.contar(filtros);
    vacio.hidden = total > 0;
    verMas.hidden = !cursor;
    masInfo.textContent = total ? `Estás viendo ${mostrados} de ${total}` : '';
    if (reiniciar) pintarCabecera(total);
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() {
    pintarActivos();
    pintarConteos();
    syncURL();
    pintar(true);
  }

  pintarFiltros();
  pintarActivos();
  pintarConteos();
  syncURL();
  pintar(true);

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.f === 'cat') estado.cat = [...form.querySelectorAll('[data-f="cat"]:checked')].map(i => i.value);
    else if (t.name === 'precio') estado.precio = t.value;
    else if (t.dataset.f === 'oferta') estado.oferta = t.checked;
    else return;
    aplicar();
  });
  form.addEventListener('submit', e => e.preventDefault());
  ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; aplicar(); });
  let tq = 0;
  buscar.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260);
  });
  buscar.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(tq); estado.q = buscar.value.trim().slice(0, 60); aplicar(); } });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => {
    Object.assign(estado, { cat: [], precio: '', oferta: false, q: '' });
    buscar.value = '';
    pintarFiltros();
    aplicar();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const chip = e.target.closest('[data-activo]');
    if (chip && activos._chips) {
      activos._chips[+chip.dataset.activo]?.quitar();
      pintarFiltros();
      aplicar();
    }
  });
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: true }), 300);
  initFiltrosDrawer(form);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.getElementById('abrirFiltros');
  if (!abrirBtn) return;
  const fondo = document.createElement('div');
  fondo.className = 'filtros-fondo';
  document.body.appendChild(fondo);
  const mq = window.matchMedia('(max-width: 900px)');
  const abrir = () => {
    form.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    form.classList.add('abierto'); fondo.classList.add('abierto');
    abrirBtn.setAttribute('aria-expanded', 'true'); bloquearScroll(true);
    form.querySelector('input')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!form.classList.contains('abierto')) return;
    form.classList.remove('abierto'); fondo.classList.remove('abierto');
    abrirBtn.setAttribute('aria-expanded', 'false'); bloquearScroll(false);
    abrirBtn.focus({ preventScroll: true });
  };
  abrirBtn.addEventListener('click', abrir);
  fondo.addEventListener('click', cerrar);
  form.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', e => {
    if (!form.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(form, e);
  });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

function syncModelosLink() {
  if (PAGINA !== 'catalogo') return;
  const q = location.search;
  document.querySelectorAll('.gw-modelos__btn').forEach(a => {
    const base = a.getAttribute('href').split('?')[0];
    a.setAttribute('href', base + q);
  });
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

initModelBarScroll();
syncModelosLink();
initCatsMenu();
initNav();
initEstado();
initHome();
initCarta();
initAgenda();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initRail();
initQV();
initCarrito();
initFloats();
initAcciones();
initGaleria();
updateCartBadge();
