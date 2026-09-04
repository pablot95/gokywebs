document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const WSP = '5491125652289';

const COLORES = {
  petroleo: { nombre: 'Petróleo', corto: 'Petróleo', hex: '#14708C' },
  marino:   { nombre: 'Azul marino', corto: 'Marino', hex: '#1E3A5F' },
  verde:    { nombre: 'Verde quirófano', corto: 'Verde', hex: '#0E7A54' },
  fucsia:   { nombre: 'Fucsia', corto: 'Fucsia', hex: '#C2185B' },
  negro:    { nombre: 'Negro', corto: 'Negro', hex: '#14161A' },
  francia:  { nombre: 'Azul francia', corto: 'Francia', hex: '#4B62C4' },
  bordo:    { nombre: 'Bordó', corto: 'Bordó', hex: '#5A2A2E' },
  grafito:  { nombre: 'Grafito', corto: 'Grafito', hex: '#3A4048' },
};

const TIPOS = [
  { id: 'ambo', nombre: 'Ambos' },
  { id: 'casaca', nombre: 'Casacas' },
  { id: 'pantalon', nombre: 'Pantalones' },
  { id: 'chaqueta', nombre: 'Chaquetas' },
];

const CATEGORIAS = [
  { n: '01', nombre: 'Mujer', filtro: 'genero:mujer', img: 'images/ambo-mujer-azul.webp', w: 1400, h: 1750, alt: 'Ambo de mujer color petróleo con escote en V' },
  { n: '02', nombre: 'Hombre', filtro: 'genero:hombre', img: 'images/ambo-hombre-azul.webp', w: 1400, h: 1750, alt: 'Ambo de hombre azul marino con cuello mao' },
  { n: '03', nombre: 'Casacas', filtro: 'tipo:casaca', img: 'images/detalle-bolsillo.webp', w: 1400, h: 1400, alt: 'Detalle del bolsillo de una casaca azul francia' },
  { n: '04', nombre: 'Línea Negra', filtro: 'color:negro', img: 'images/ambo-negro.webp', w: 1200, h: 1500, alt: 'Casaca negra de la línea premium de Neo' },
];

const PRODUCTOS = [
  { id: 'neo-01', nombre: 'Ambo Neo Clásico', codigo: 'NEO-AC-PET', tipo: 'ambo', genero: 'mujer', color: 'petroleo', precio: 98900, descuento: 0, destacado: true, badge: '',
    img: 'images/ambo-mujer-azul.webp', w: 1400, h: 1750, alt: 'Ambo Neo Clásico color petróleo, escote en V, para mujer',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '5 (3 casaca, 2 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'El corte que más sale del mostrador. Escote en V, bolsillo de pecho con divisor para lapiceras y dos bajos con refuerzo. La tela tiene recuperación real: al final del turno sigue en su lugar.' },

  { id: 'neo-02', nombre: 'Casaca Neo Escote V', codigo: 'NEO-CV-PET', tipo: 'casaca', genero: 'mujer', color: 'petroleo', precio: 52900, descuento: 0, destacado: true, badge: '',
    img: 'images/det-bolsillo-petroleo.webp', w: 1000, h: 1250, alt: 'Casaca Neo escote en V color petróleo con bolsillo de pecho',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '3', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'La casaca sola, para combinar con el pantalón que ya tenés. Aberturas laterales de 6 cm para que el movimiento no tire de la costura.' },

  { id: 'neo-03', nombre: 'Ambo Neo Cuello Mao', codigo: 'NEO-AM-MAR', tipo: 'ambo', genero: 'hombre', color: 'marino', precio: 102900, descuento: 0, destacado: true, badge: '',
    img: 'images/ambo-hombre-azul.webp', w: 1400, h: 1750, alt: 'Ambo Neo cuello mao azul marino para hombre',
    tela: 'Arciel antifluido 100% poliéster', gramaje: '175 g/m²', bolsillos: '5 (3 casaca, 2 pantalón)', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Cuello mao con botonera al hombro: se saca sin pasarlo por la cara. Tela antifluido, la que se pide para consultorio y guardia.' },

  { id: 'neo-04', nombre: 'Casaca Neo Cuello Mao', codigo: 'NEO-CM-MAR', tipo: 'casaca', genero: 'hombre', color: 'marino', precio: 54900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-cuello-mao.webp', w: 1000, h: 1250, alt: 'Detalle del cuello mao y la botonera de una casaca azul marino',
    tela: 'Arciel antifluido 100% poliéster', gramaje: '175 g/m²', bolsillos: '3', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Botonera oculta al hombro y bolsillo de pecho con presilla para el lapicero. El cuello mantiene la forma después de sesenta lavados.' },

  { id: 'neo-05', nombre: 'Pantalón Neo Jogger', codigo: 'NEO-PJ-MAR', tipo: 'pantalon', genero: 'hombre', color: 'marino', precio: 51900, descuento: 0, destacado: true, badge: '',
    img: 'images/det-pantalon-marino.webp', w: 1000, h: 1250, alt: 'Pantalón Neo jogger azul marino con cordón y bolsillos laterales',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '4', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Cintura con elástico y cordón plano, puño abajo. Los dos bolsillos laterales entran un celular de seis pulgadas sin que se caiga al agacharte.' },

  { id: 'neo-06', nombre: 'Ambo Neo Quirófano', codigo: 'NEO-AQ-VER', tipo: 'ambo', genero: 'mujer', color: 'verde', precio: 96900, descuento: 12, destacado: true, badge: '',
    img: 'images/ambo-mujer-verde.webp', w: 1200, h: 1500, alt: 'Ambo Neo verde quirófano con escote en V para mujer',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '5 (3 casaca, 2 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'El verde de quirófano de toda la vida, en la tela nueva. Cuello en V amplio y ruedo recto que no se enrosca al lavarlo.' },

  { id: 'neo-07', nombre: 'Casaca Neo Quirófano', codigo: 'NEO-CQ-VER', tipo: 'casaca', genero: 'unisex', color: 'verde', precio: 49900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-escote-v.webp', w: 1000, h: 1250, alt: 'Detalle del escote en V de una casaca verde quirófano',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '3', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Molde unisex de hombro caído: le entra igual de bien a una talle S que a un XXL. La más pedida para equipos que compran por cantidad.' },

  { id: 'neo-08', nombre: 'Ambo Neo Color', codigo: 'NEO-ACO-FUC', tipo: 'ambo', genero: 'mujer', color: 'fucsia', precio: 104900, descuento: 0, destacado: true, badge: 'Nuevo',
    img: 'images/ambo-rosa.webp', w: 1200, h: 1500, alt: 'Ambo Neo color fucsia con escote en V para mujer',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '6 (3 casaca, 3 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Fucsia teñido en hilo: no destiñe ni pasa a rosa viejo. La versión premium de la tela, con más elastano y un bolsillo interno extra.' },

  { id: 'neo-09', nombre: 'Casaca Neo Stretch', codigo: 'NEO-CS-FUC', tipo: 'casaca', genero: 'mujer', color: 'fucsia', precio: 56900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-tela-fucsia.webp', w: 1000, h: 1250, alt: 'Detalle de la tela stretch de una casaca fucsia',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '3', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Seis por ciento de elastano: es la más elástica del catálogo. Entallada en la cintura, sin apretar en los hombros.' },

  { id: 'neo-10', nombre: 'Ambo Neo Línea Negra', codigo: 'NEO-ALN-NEG', tipo: 'ambo', genero: 'mujer', color: 'negro', precio: 128900, descuento: 0, destacado: true, badge: 'Nuevo',
    img: 'images/ambo-negro.webp', w: 1200, h: 1500, alt: 'Ambo Neo Línea Negra, casaca negra de tela premium',
    tela: 'Bengalina técnica 92% poliéster / 8% spandex', gramaje: '195 g/m²', bolsillos: '6 (3 casaca, 3 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'La línea premium: bengalina más pesada, costura reforzada al doble y pantalón jogger de molde propio. Es el ambo que se compra una vez.' },

  { id: 'neo-11', nombre: 'Ambo Neo Antifluido', codigo: 'NEO-AA-FRA', tipo: 'ambo', genero: 'unisex', color: 'francia', precio: 118900, descuento: 0, destacado: true, badge: '',
    img: 'images/detalle-bolsillo.webp', w: 1400, h: 1400, alt: 'Detalle del bolsillo de un ambo antifluido azul francia',
    tela: 'Antifluido 100% poliéster con tratamiento repelente', gramaje: '185 g/m²', bolsillos: '5 (3 casaca, 2 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'El tratamiento repelente aguanta cuarenta lavados certificados. Para odontología, veterinaria y todo lo que salpica.' },

  { id: 'neo-12', nombre: 'Casaca Neo Cruzada', codigo: 'NEO-CC-BOR', tipo: 'casaca', genero: 'mujer', color: 'bordo', precio: 58900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-bordo.webp', w: 1000, h: 1250, alt: 'Casaca Neo cruzada color bordó con ajuste de cordón en la cintura',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '3', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Cruzada al costado con cordón regulable en la cintura: se ajusta al cuerpo sin quedar apretada. La favorita de estética y spa.' },

  { id: 'neo-13', nombre: 'Casaca Neo Antifluido', codigo: 'NEO-CA-FRA', tipo: 'casaca', genero: 'unisex', color: 'francia', precio: 54900, descuento: 0, destacado: false, badge: '',
    img: 'images/detalle-bolsillo.webp', w: 1400, h: 1400, alt: 'Casaca antifluido azul francia con bolsillo bajo reforzado',
    tela: 'Antifluido 100% poliéster con tratamiento repelente', gramaje: '185 g/m²', bolsillos: '3', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'La casaca del ambo antifluido, sola. Bolsillos bajos con refuerzo en la boca, que es donde siempre se descose primero.' },

  { id: 'neo-14', nombre: 'Chaqueta Neo Botonera', codigo: 'NEO-CHB-GRA', tipo: 'chaqueta', genero: 'hombre', color: 'grafito', precio: 57900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-grafito.webp', w: 1000, h: 1250, alt: 'Chaqueta Neo grafito con botonera al frente y bolsillo de pecho',
    tela: 'Arciel antifluido 100% poliéster', gramaje: '175 g/m²', bolsillos: '3', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Botonera al frente, cuello camisero bajo. Se abre entera: la que conviene si trabajás entrando y saliendo del consultorio.' },

  { id: 'neo-15', nombre: 'Pantalón Neo Recto', codigo: 'NEO-PR-PET', tipo: 'pantalon', genero: 'unisex', color: 'petroleo', precio: 48900, descuento: 0, destacado: false, badge: '',
    swatch: true, alt: 'Muestra de la tela Arciel en color petróleo del Pantalón Neo Recto',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '4', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'El corte recto clásico, sin puño. Cintura con elástico completo y cordón: no necesita cinto ni se afloja a media jornada.' },

  { id: 'neo-16', nombre: 'Chaqueta Neo Línea Negra', codigo: 'NEO-CHN-NEG', tipo: 'chaqueta', genero: 'unisex', color: 'negro', precio: 74900, descuento: 0, destacado: false, badge: '',
    img: 'images/ambo-negro.webp', w: 1200, h: 1500, alt: 'Chaqueta Neo Línea Negra en bengalina técnica',
    tela: 'Bengalina técnica 92% poliéster / 8% spandex', gramaje: '195 g/m²', bolsillos: '4', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'La chaqueta de la Línea Negra: bengalina pesada, cierre metálico y dos bolsillos internos. Abriga sin ser un buzo.' },

  { id: 'neo-17', nombre: 'Chaqueta Neo Mao', codigo: 'NEO-CHM-MAR', tipo: 'chaqueta', genero: 'hombre', color: 'marino', precio: 62900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-cuello-mao.webp', w: 1000, h: 1250, alt: 'Chaqueta Neo con cuello mao azul marino y botonera',
    tela: 'Arciel antifluido 100% poliéster', gramaje: '175 g/m²', bolsillos: '4', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Cuello mao alto y botonera hasta abajo. La versión abierta de la casaca mao, para usar arriba del ambo.' },

  { id: 'neo-18', nombre: 'Pantalón Neo Jogger', codigo: 'NEO-PJ-FUC', tipo: 'pantalon', genero: 'mujer', color: 'fucsia', precio: 52900, descuento: 10, destacado: false, badge: '',
    swatch: true, alt: 'Muestra de la tela premium en color fucsia del Pantalón Neo Jogger',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '4', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Jogger de tiro medio en la tela premium. Combina con cualquier casaca de la línea sin que se note la diferencia de color.' },

  { id: 'neo-19', nombre: 'Ambo Neo Stretch', codigo: 'NEO-AS-VER', tipo: 'ambo', genero: 'unisex', color: 'verde', precio: 99900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-escote-v.webp', w: 1000, h: 1250, alt: 'Ambo Neo Stretch verde quirófano, detalle del escote',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '6 (3 casaca, 3 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    desc: 'El verde de siempre con la tela premium: seis por ciento de elastano y un bolsillo interno extra en el pantalón.' },

  { id: 'neo-20', nombre: 'Ambo Neo Jogger', codigo: 'NEO-AJ-PET', tipo: 'ambo', genero: 'mujer', color: 'petroleo', precio: 107900, descuento: 15, destacado: false, badge: '',
    img: 'images/ambo-mujer-azul.webp', w: 1400, h: 1750, alt: 'Ambo Neo Jogger color petróleo para mujer',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '165 g/m²', bolsillos: '6 (3 casaca, 3 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Mismo tono petróleo del clásico, con pantalón jogger de puño. El combo que más se lleva para turnos de doce horas.' },

  { id: 'neo-21', nombre: 'Pantalón Neo Cargo', codigo: 'NEO-PC-MAR', tipo: 'pantalon', genero: 'unisex', color: 'marino', precio: 56900, descuento: 0, destacado: false, badge: '',
    img: 'images/det-pantalon-marino.webp', w: 1000, h: 1250, alt: 'Pantalón Neo cargo azul marino con bolsillos laterales',
    tela: 'Arciel antifluido 100% poliéster', gramaje: '175 g/m²', bolsillos: '6', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Seis bolsillos, dos de ellos cargo con tapa. Para quien lleva encima medio consultorio y no quiere colgarse una riñonera.' },

  { id: 'neo-22', nombre: 'Casaca Neo Ergo', codigo: 'NEO-CE-FUC', tipo: 'casaca', genero: 'mujer', color: 'fucsia', precio: 61900, descuento: 0, destacado: false, badge: '',
    img: 'images/ambo-rosa.webp', w: 1200, h: 1500, alt: 'Casaca Neo Ergo fucsia con corte entallado',
    tela: 'Arciel premium 94% poliéster / 6% spandex', gramaje: '180 g/m²', bolsillos: '4', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Corte ergonómico con pinzas en la espalda y un bolsillo más que la Stretch. Marca la cintura sin restar movilidad en el hombro.' },

  { id: 'neo-23', nombre: 'Ambo Neo Esencial', codigo: 'NEO-AE-VER', tipo: 'ambo', genero: 'mujer', color: 'verde', precio: 92900, descuento: 0, destacado: false, badge: '',
    img: 'images/ambo-mujer-verde.webp', w: 1200, h: 1500, alt: 'Ambo Neo Esencial verde quirófano para mujer',
    tela: 'Arciel 96% poliéster / 4% spandex', gramaje: '160 g/m²', bolsillos: '4 (2 casaca, 2 pantalón)', talles: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'La entrada a la línea: misma tela, un bolsillo menos y ruedo simple. Para el segundo o tercer ambo del placard.' },

  { id: 'neo-24', nombre: 'Ambo Neo Antifluido Hombre', codigo: 'NEO-AAH-MAR', tipo: 'ambo', genero: 'hombre', color: 'marino', precio: 121900, descuento: 0, destacado: false, badge: '',
    img: 'images/ambo-hombre-azul.webp', w: 1400, h: 1750, alt: 'Ambo Neo antifluido azul marino para hombre',
    tela: 'Antifluido 100% poliéster con tratamiento repelente', gramaje: '185 g/m²', bolsillos: '5 (3 casaca, 2 pantalón)', talles: ['S', 'M', 'L', 'XL', 'XXL'],
    desc: 'Molde masculino con hombro más ancho y largo modular. Tratamiento repelente certificado a cuarenta lavados.' },
];

const TALLES_ORDEN = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const colorNombre = c => COLORES[c]?.nombre || '';
const colorHex = c => COLORES[c]?.hex || '#999';
const colorCorto = c => COLORES[c]?.corto || '';
const modeloCorto = p => p.nombre.split(' ').slice(2).join(' ') || p.nombre;
const mediaHTML = p => p.swatch
  ? `<span class="swatch" style="--sw:${colorHex(p.color)}" role="img" aria-label="${esc(p.alt)}"><span class="swatch-code">${esc(p.codigo)}</span><span class="swatch-nom">Muestra de tela · ${esc(colorNombre(p.color))}</span></span>`
  : `<img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" decoding="async">`;
const tipoNombre = t => TIPOS.find(x => x.id === t)?.nombre || '';

const Cart = {
  KEY: 'neo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const t = talle || producto.talles[Math.floor(producto.talles.length / 2)];
    const existing = items.find(i => i.id === producto.id && i.talle === t);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, talle: t, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Wish = {
  KEY: 'neo_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const ids = this.get();
    const i = ids.indexOf(id);
    if (i >= 0) ids.splice(i, 1); else ids.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    return i < 0;
  },
};

const Vistos = {
  KEY: 'neo_vistos',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  push(id) {
    const ids = this.get().filter(x => x !== id);
    ids.unshift(id);
    localStorage.setItem(this.KEY, JSON.stringify(ids.slice(0, 8)));
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

/* ── card de producto ─────────────────────────────────── */
function cardHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="tag tag--sig">-${p.descuento}%</span>`);
  if (p.badge) badges.push(`<span class="tag tag--off">${esc(p.badge)}</span>`);
  return `
  <article class="prod" data-id="${p.id}" data-flip-id="${p.id}" data-animate style="opacity:0;transform:translateY(46px)">
    <div class="prod-media">
      ${mediaHTML(p)}
      <span class="prod-trace" aria-hidden="true"></span>
      ${badges.length ? `<div class="prod-badges">${badges.join('')}</div>` : ''}
      <button type="button" class="prod-wish${Wish.has(p.id) ? ' on' : ''}" data-wish="${p.id}" aria-label="Guardar ${esc(p.nombre)} en favoritos" aria-pressed="${Wish.has(p.id)}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.4l8.8-8.7a5 5 0 0 0 0-7.1z"/></svg>
      </button>
      <button type="button" class="prod-quick" data-quick="${p.id}">Vista rápida</button>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(tipoNombre(p.tipo))} · ${esc(colorNombre(p.color))}</span>
      <h3 class="prod-nom">${esc(p.nombre)}</h3>
      <p class="prod-spec">${esc(p.codigo)} · ${esc(p.bolsillos.split(' ')[0])} bolsillos · ${esc(p.talles[0])}–${esc(p.talles[p.talles.length - 1])}</p>
      <p class="prod-precio">
        <strong>${formatearPrecio(fin)}</strong>
        ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        ${opts.buy === false ? '' : `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar</button>`}
      </div>
    </div>
  </article>`;
}

function leerQty(card) {
  const n = parseInt(card.querySelector('[data-qty]')?.textContent || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function bindCards(cont) {
  cont.querySelectorAll('[data-stepper]').forEach(st => {
    if (st.dataset.bound) return;
    st.dataset.bound = '1';
    st.addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const out = st.querySelector('[data-qty]');
      const v = Math.max(1, Math.min(99, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
      out.textContent = v;
    });
  });
  cont.querySelectorAll('[data-add]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => {
      const p = getProducto(b.dataset.add);
      if (!p) return;
      Cart.add(p, leerQty(b.closest('.prod')));
      showToast('Sumado al pedido. El talle se confirma antes de despachar.');
    });
  });
  cont.querySelectorAll('[data-buy]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => {
      const p = getProducto(b.dataset.buy);
      if (!p) return;
      Cart.add(p, leerQty(b.closest('.prod')));
      abrirDrawer();
    });
  });
  cont.querySelectorAll('[data-quick]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => abrirModal(b.dataset.quick, b));
  });
  cont.querySelectorAll('[data-wish]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => {
      const on = Wish.toggle(b.dataset.wish);
      document.querySelectorAll(`[data-wish="${b.dataset.wish}"]`).forEach(x => {
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      showToast(on ? 'Guardado en favoritos' : 'Sacado de favoritos');
    });
  });
}

/* ── categorías ───────────────────────────────────────── */
function initCategorias() {
  const cont = document.getElementById('cats-grid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => `
    <a class="cat" href="#tienda" data-goto-filtro="${c.filtro}" data-animate style="opacity:0;transform:translateY(40px) scale(.94)">
      <div class="cat-media"><img src="${c.img}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}" decoding="async"></div>
      <div class="cat-body">
        <span class="cat-n">${c.n}</span>
        <h3>${esc(c.nombre)}</h3>
        <span class="cat-go">Ver <i></i></span>
      </div>
    </a>`).join('');
}

/* ── rail de destacados ───────────────────────────────── */
function initRail() {
  const track = document.getElementById('rail-track');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, { buy: false })).join('');
  bindCards(track);
}

function initRailControles() {
  const vp = document.getElementById('rail-vp');
  const track = document.getElementById('rail-track');
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  if (!vp || !track) return;

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  initRailDrag(vp);

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

/* ── catálogo ─────────────────────────────────────────── */
const PASO = 16;
const filtros = { q: '', tipo: '', genero: '', color: '', talle: '' };
let visibles = PASO;

function filtrar() {
  const q = normalizar(filtros.q).trim();
  const terminos = q ? q.split(/\s+/) : [];
  return PRODUCTOS.filter(p => {
    if (filtros.tipo && p.tipo !== filtros.tipo) return false;
    if (filtros.genero && p.genero !== filtros.genero) return false;
    if (filtros.color && p.color !== filtros.color) return false;
    if (filtros.talle && !p.talles.includes(filtros.talle)) return false;
    if (!terminos.length) return true;
    const heno = normalizar([p.nombre, p.codigo, tipoNombre(p.tipo), colorNombre(p.color), p.genero, p.tela, p.desc].join(' '));
    return terminos.every(t => heno.includes(t));
  });
}

function renderCatalogo({ append = false, flip = false } = {}) {
  const grid = document.getElementById('catalogo-grid');
  const vacio = document.getElementById('catalogo-vacio');
  const masWrap = document.querySelector('.catalogo-mas');
  const res = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = filtrar();
  const hayFiltro = !!(filtros.q || filtros.tipo || filtros.genero || filtros.color || filtros.talle);

  if (append) {
    const desde = grid.querySelectorAll('.prod').length;
    const nuevos = lista.slice(desde, visibles);
    if (nuevos.length) {
      grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
      bindCards(grid);
      revelarNuevos(grid);
    }
  } else {
    const estado = (flip && typeof Flip !== 'undefined' && !reduceMotion && grid.querySelectorAll('.prod').length)
      ? Flip.getState(grid.querySelectorAll('.prod')) : null;
    grid.innerHTML = lista.slice(0, visibles).map(p => cardHTML(p)).join('');
    bindCards(grid);
    if (estado) {
      grid.querySelectorAll('.prod').forEach(el => el.classList.add('in'));
      Flip.from(estado, {
        duration: .5, ease: 'power2.out', stagger: .015, absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .45, stagger: .04 }),
      });
    } else {
      revelarNuevos(grid);
    }
  }

  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  masWrap.hidden = lista.length <= visibles;
  if (limpiar) limpiar.hidden = !hayFiltro;
  if (res) {
    res.textContent = lista.length === 0
      ? 'Sin resultados'
      : `${lista.length} ${lista.length === 1 ? 'prenda' : 'prendas'}${hayFiltro ? ' con estos filtros' : ' en el catálogo'}`;
  }

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarFiltro(clave, valor) {
  filtros[clave] = valor;
  visibles = PASO;
  sincronizarControles();
  renderCatalogo({ flip: true });
}

function sincronizarControles() {
  document.querySelectorAll('#chips-tipo .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.tipo === filtros.tipo)));
  const g = document.getElementById('f-genero'); if (g) g.value = filtros.genero;
  const c = document.getElementById('f-color'); if (c) c.value = filtros.color;
  const t = document.getElementById('f-talle'); if (t) t.value = filtros.talle;
  const q = document.getElementById('q'); if (q && q.value !== filtros.q) q.value = filtros.q;
}

function initCatalogo() {
  const chipsTipo = document.getElementById('chips-tipo');
  if (chipsTipo) {
    chipsTipo.innerHTML = TIPOS.map(t => `<button type="button" class="chip" data-tipo="${t.id}" aria-pressed="false">${esc(t.nombre)}</button>`).join('');
    chipsTipo.addEventListener('click', e => {
      const b = e.target.closest('[data-tipo]');
      if (!b) return;
      aplicarFiltro('tipo', filtros.tipo === b.dataset.tipo ? '' : b.dataset.tipo);
    });
  }

  const selColor = document.getElementById('f-color');
  if (selColor) {
    const usados = [...new Set(PRODUCTOS.map(p => p.color))];
    selColor.insertAdjacentHTML('beforeend', usados.map(c => `<option value="${c}">${esc(colorNombre(c))}</option>`).join(''));
    selColor.addEventListener('change', () => aplicarFiltro('color', selColor.value));
  }
  const selTalle = document.getElementById('f-talle');
  if (selTalle) {
    selTalle.insertAdjacentHTML('beforeend', TALLES_ORDEN.map(t => `<option value="${t}">${t}</option>`).join(''));
    selTalle.addEventListener('change', () => aplicarFiltro('talle', selTalle.value));
  }
  const selGenero = document.getElementById('f-genero');
  selGenero?.addEventListener('change', () => aplicarFiltro('genero', selGenero.value));

  const q = document.getElementById('q');
  let tid;
  q?.addEventListener('input', () => {
    clearTimeout(tid);
    tid = setTimeout(() => aplicarFiltro('q', q.value), 180);
  });

  const reset = () => {
    filtros.q = ''; filtros.tipo = ''; filtros.genero = ''; filtros.color = ''; filtros.talle = '';
    visibles = PASO;
    sincronizarControles();
    renderCatalogo({ flip: true });
  };
  document.getElementById('limpiar')?.addEventListener('click', reset);
  document.getElementById('vacio-limpiar')?.addEventListener('click', reset);

  document.getElementById('ver-mas')?.addEventListener('click', () => {
    visibles += PASO;
    renderCatalogo({ append: true });
  });

  renderCatalogo();
}

function irAlCatalogo(filtroStr) {
  const [clave, valor] = String(filtroStr || '').split(':');
  filtros.q = ''; filtros.tipo = ''; filtros.genero = ''; filtros.color = ''; filtros.talle = '';
  if (clave && valor && clave in filtros) filtros[clave] = valor;
  visibles = PASO;
  const drawer = document.getElementById('filtros-drawer');
  if (drawer && clave && valor) drawer.open = true;
  sincronizarControles();
  renderCatalogo({ flip: true });
  const dest = document.getElementById('tienda');
  if (dest) window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initFiltroLinks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-goto-filtro]');
    if (!a) return;
    e.preventDefault();
    irAlCatalogo(a.dataset.gotoFiltro);
  });
}

/* ── vista rápida ─────────────────────────────────────── */
let modalPrev = null;
let modalTalle = '';

function abrirModal(id, origen) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  const inner = document.getElementById('modal-inner');
  if (!p || !modal || !inner) return;

  modalPrev = origen || document.activeElement;
  modalTalle = p.talles[Math.floor(p.talles.length / 2)];
  const fin = precioFinal(p);
  const vistos = Vistos.get().filter(x => x !== p.id).map(getProducto).filter(Boolean).slice(0, 3);
  const relacionados = vistos.length >= 3 ? vistos
    : vistos.concat(PRODUCTOS.filter(x => x.id !== p.id && x.color === p.color && !vistos.includes(x)).slice(0, 3 - vistos.length));

  inner.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">
        ${mediaHTML(p)}
        <span class="media-code">${esc(p.codigo)}</span>
      </div>
      <div class="modal-body">
        <span class="lbl"><i class="sig" aria-hidden="true"></i>${esc(tipoNombre(p.tipo))} · ${esc(colorNombre(p.color))}</span>
        <h3 id="modal-tit">${esc(p.nombre)}</h3>
        <p class="modal-desc">${esc(p.desc)}</p>
        <p class="modal-precio">
          <strong>${formatearPrecio(fin)}</strong>
          ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="tag tag--sig">-${p.descuento}%</span>` : ''}
        </p>
        <dl class="modal-ficha">
          <div><dt>Tela</dt><dd>${esc(p.tela)}</dd></div>
          <div><dt>Gramaje</dt><dd>${esc(p.gramaje)}</dd></div>
          <div><dt>Bolsillos</dt><dd>${esc(p.bolsillos)}</dd></div>
          <div><dt>Género</dt><dd>${esc(p.genero)}</dd></div>
        </dl>
        <div class="modal-talles">
          <span class="lbl">Talle</span>
          <div class="chips chips--filtro chips--talle" id="modal-talles" role="group" aria-label="Elegí el talle">
            ${p.talles.map(t => `<button type="button" class="chip" data-talle="${t}" aria-pressed="${t === modalTalle}">${t}</button>`).join('')}
          </div>
        </div>
        <div class="modal-acciones">
          <button type="button" class="btn btn--primary" id="modal-add">Agregar al carrito</button>
          <button type="button" class="btn btn--ghost" id="modal-buy">Comprar ahora</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `
    <div class="modal-vistos">
      <span class="lbl"><i class="sig" aria-hidden="true"></i>También te puede servir</span>
      <div class="modal-vistos-row">
        ${relacionados.map(r => `
          <button type="button" class="mini" data-quick="${r.id}">
            <span class="mini-media">${mediaHTML(r)}</span>
            <span class="mini-nom">${esc(r.nombre)}</span>
            <span class="mini-precio">${formatearPrecio(precioFinal(r))}</span>
          </button>`).join('')}
      </div>
    </div>` : ''}`;

  const talles = inner.querySelector('#modal-talles');
  talles?.addEventListener('click', e => {
    const b = e.target.closest('[data-talle]');
    if (!b) return;
    modalTalle = b.dataset.talle;
    talles.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.talle === modalTalle)));
  });
  inner.querySelector('#modal-add')?.addEventListener('click', () => {
    Cart.add(p, 1, modalTalle);
    showToast(`${p.nombre} talle ${modalTalle}, al pedido.`);
  });
  inner.querySelector('#modal-buy')?.addEventListener('click', () => {
    Cart.add(p, 1, modalTalle);
    cerrarModal();
    abrirDrawer();
  });
  inner.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => abrirModal(b.dataset.quick, modalPrev)));

  Vistos.push(p.id);
  backdrop.hidden = false;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { backdrop.classList.add('open'); modal.classList.add('open'); });
  modal.querySelector('#modal-add')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; backdrop.hidden = true; }, 280);
  modalPrev?.focus?.();
}

function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', cerrarModal);
}

/* ── drawer del carrito ───────────────────────────────── */
let drawerPrev = null;

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const totalEl = document.getElementById('drawer-total');
  const wsp = document.getElementById('drawer-wsp');
  if (!body) return;
  const items = Cart.get();

  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-vacio">
        <span class="folio">[ 00 ]</span>
        <h3>Todavía no elegiste nada</h3>
        <p>Empezá por los más elegidos o armá el ambo completo en dos toques.</p>
        <a class="btn btn--primary btn--wide" href="#tienda" data-cerrar-drawer>Ver el catálogo</a>
      </div>`;
    foot.hidden = true;
    body.querySelector('[data-cerrar-drawer]')?.addEventListener('click', cerrarDrawer);
    return;
  }

  foot.hidden = false;
  body.innerHTML = items.map((i, idx) => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
      <div class="drawer-item enter" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <div class="drawer-media">${mediaHTML(p)}</div>
        <div>
          <p class="drawer-nom">${esc(p.nombre)}</p>
          <p class="drawer-var">${esc(colorNombre(p.color))} · Talle ${esc(i.talle)}</p>
          <div class="drawer-row">
            <div class="stepper">
              <button type="button" data-menos="${p.id}|${i.talle}" aria-label="Quitar uno">−</button>
              <span>${i.qty}</span>
              <button type="button" data-mas="${p.id}|${i.talle}" aria-label="Agregar uno">+</button>
            </div>
            <strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong>
          </div>
          <div class="drawer-row" style="margin-top:8px">
            <button type="button" class="drawer-del" data-del="${p.id}|${i.talle}">Quitar</button>
          </div>
        </div>
      </div>`;
  }).join('');

  totalEl.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? `- ${p.nombre} (${colorNombre(p.color)}, talle ${i.talle}) x${i.qty}` : '';
    }).filter(Boolean).join('\n');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Neo, quiero confirmar este pedido:\n${detalle}\nTotal: ${formatearPrecio(Cart.total())}`)}`;
  }

  body.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => {
    const [id, talle] = b.dataset.menos.split('|');
    const it = Cart.get().find(x => x.id === id && x.talle === talle);
    if (it && it.qty <= 1) Cart.remove(id, talle); else Cart.setQty(id, talle, (it?.qty || 1) - 1);
  }));
  body.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => {
    const [id, talle] = b.dataset.mas.split('|');
    const it = Cart.get().find(x => x.id === id && x.talle === talle);
    Cart.setQty(id, talle, (it?.qty || 1) + 1);
  }));
  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const [id, talle] = b.dataset.del.split('|');
    Cart.remove(id, talle);
  }));
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d) return;
  drawerPrev = document.activeElement;
  renderDrawer();
  bd.hidden = false; d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { bd.classList.add('open'); d.classList.add('open'); });
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 380);
  drawerPrev?.focus?.();
}

function initDrawer() {
  document.getElementById('cart-btn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('checkout')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => {
    if (!document.getElementById('drawer')?.hidden) renderDrawer();
  });
}

/* ── bloque interactivo: armá tu ambo ─────────────────── */
const ARMADO = { casaca: 'neo-02', pantalon: 'neo-05', talle: 'M' };

function initArmado() {
  const cCas = document.getElementById('chips-casaca');
  const cPan = document.getElementById('chips-pantalon');
  const cTal = document.getElementById('chips-talle');
  if (!cCas || !cPan || !cTal) return;

  const casacas = PRODUCTOS.filter(p => p.tipo === 'casaca').slice(0, 5);
  const pantalones = PRODUCTOS.filter(p => p.tipo === 'pantalon');

  const chip = (p, grupo) => `
    <button type="button" class="chip" data-grupo="${grupo}" data-id="${p.id}" aria-pressed="${ARMADO[grupo] === p.id}">
      <span class="chip-sw" style="background:${colorHex(p.color)}"></span>${esc(modeloCorto(p))} ${esc(colorCorto(p.color))}
    </button>`;

  cCas.innerHTML = casacas.map(p => chip(p, 'casaca')).join('');
  cPan.innerHTML = pantalones.map(p => chip(p, 'pantalon')).join('');
  cTal.innerHTML = TALLES_ORDEN.map(t => `<button type="button" class="chip" data-grupo="talle" data-id="${t}" aria-pressed="${ARMADO.talle === t}">${t}</button>`).join('');

  [cCas, cPan, cTal].forEach(cont => cont.addEventListener('click', e => {
    const b = e.target.closest('[data-grupo]');
    if (!b) return;
    ARMADO[b.dataset.grupo] = b.dataset.id;
    cont.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.id === b.dataset.id)));
    renderArmado();
  }));

  document.getElementById('armado-add')?.addEventListener('click', () => {
    const c = getProducto(ARMADO.casaca), p = getProducto(ARMADO.pantalon);
    if (!c || !p) return;
    Cart.add(c, 1, ARMADO.talle);
    Cart.add(p, 1, ARMADO.talle);
    showToast(`Conjunto talle ${ARMADO.talle} agregado: casaca + pantalón.`);
  });
  document.getElementById('armado-ver')?.addEventListener('click', () => {
    const c = getProducto(ARMADO.casaca);
    irAlCatalogo(c ? `color:${c.color}` : '');
  });

  renderArmado();
}

function renderArmado() {
  const c = getProducto(ARMADO.casaca), p = getProducto(ARMADO.pantalon);
  if (!c || !p) return;
  const t = ARMADO.talle;
  const figC = document.getElementById('pieza-casaca');
  const figP = document.getElementById('pieza-pantalon');
  const specs = document.getElementById('armado-specs');
  const razon = document.getElementById('armado-razon');
  const total = document.getElementById('armado-total');

  const pintar = (fig, prod, rol) => {
    const slot = fig.querySelector('[data-media]');
    const nuevo = mediaHTML(prod);
    if (slot.dataset.clave !== prod.id) {
      slot.dataset.clave = prod.id;
      slot.innerHTML = nuevo;
      if (!reduceMotion) {
        slot.style.opacity = '0';
        requestAnimationFrame(() => { slot.style.transition = 'opacity .26s'; slot.style.opacity = '1'; });
      }
    }
    fig.querySelector('figcaption').textContent = `${rol} · ${prod.nombre}`;
  };
  pintar(figC, c, 'Arriba');
  pintar(figP, p, 'Abajo');

  const disponible = c.talles.includes(t) && p.talles.includes(t);
  const mismaTela = c.tela === p.tela;
  razon.textContent = disponible
    ? (mismaTela
        ? `Las dos piezas son de la misma tela (${c.tela.split(' ').slice(0, 2).join(' ')}), así que el tono y la caída van a coincidir.`
        : `Combinación de dos telas: ${c.gramaje} arriba y ${p.gramaje} abajo. Sirve si querés la casaca más liviana que el pantalón.`)
    : `El talle ${t} no está en curva para esta combinación. Escribinos y lo confirmamos por WhatsApp antes de despachar.`;

  specs.innerHTML = `
    <div><dt>Casaca</dt><dd>${esc(c.nombre)} · ${esc(colorNombre(c.color))}</dd></div>
    <div><dt>Pantalón</dt><dd>${esc(p.nombre)} · ${esc(colorNombre(p.color))}</dd></div>
    <div><dt>Talle</dt><dd>${esc(t)}${disponible ? '' : ' · a confirmar'}</dd></div>
    <div><dt>Bolsillos</dt><dd>${esc(c.bolsillos.split(' ')[0])} + ${esc(p.bolsillos.split(' ')[0])}</dd></div>`;

  total.textContent = formatearPrecio(precioFinal(c) + precioFinal(p));
}

/* ── sticky chapters del editorial ────────────────────── */
function initStage() {
  const stage = document.getElementById('stage');
  const visual = document.getElementById('stage-visual');
  const code = document.getElementById('stage-code');
  if (!stage || !visual) return;
  const pasos = [...document.querySelectorAll('#pasos li')];
  const imgs = [...visual.querySelectorAll('img')];
  const titulos = ['Consultorio', 'Veterinaria', 'Detalle de costura'];
  if (!pasos.length) return;

  let activo = -1;
  const setPaso = i => {
    if (i === activo) return;
    activo = i;
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    imgs.forEach((im, n) => im.classList.toggle('is-on', n === i));
    if (code) code.textContent = `0${i + 1} / ${titulos[i] || ''}`;
  };
  setPaso(0);

  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(() => {
    const centro = window.innerHeight * 0.55;
    let mejor = 0, dist = Infinity;
    pasos.forEach((li, n) => {
      const r = li.getBoundingClientRect();
      const d = Math.abs((r.top + r.height / 2) - centro);
      if (d < dist) { dist = d; mejor = n; }
    });
    setPaso(mejor);
  }, { threshold: [0, .2, .5, .8, 1], rootMargin: '-10% 0px -35% 0px' });
  pasos.forEach(li => io.observe(li));

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const centro = window.innerHeight * 0.55;
      let mejor = 0, dist = Infinity;
      pasos.forEach((li, n) => {
        const rr = li.getBoundingClientRect();
        const d = Math.abs((rr.top + rr.height / 2) - centro);
        if (d < dist) { dist = d; mejor = n; }
      });
      setPaso(mejor);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── texto que se lee con el scroll ───────────────────── */
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ── reveals ──────────────────────────────────────────── */
let revealsListos = false;

function initReveals() {
  document.querySelectorAll('.sec-head').forEach(h => {
    if (h.hasAttribute('data-animate')) return;
    h.setAttribute('data-animate', '');
    h.style.opacity = '0';
    h.style.transform = 'translateY(22px)';
  });

  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.closest('.hero'));
  revealsListos = true;
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
  if (!revealsListos) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    return;
  }
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (!nuevos.length) return;
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.06, 0.5)}s`; });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  nuevos.forEach(el => io.observe(el));
  requestAnimationFrame(() => {
    nuevos.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
    });
  });
}

/* ── hero ─────────────────────────────────────────────── */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const items = [...hero.querySelectorAll('[data-animate]'), document.querySelector('.hero-plate')].filter(Boolean);
  const mostrar = () => items.forEach(el => el.classList.add('in'));
  if (reduceMotion) { mostrar(); return; }
  items.forEach((el, i) => { el.style.transitionDelay = `${(0.08 + i * 0.09).toFixed(2)}s`; });
  setTimeout(mostrar, 60);
  window.addEventListener('load', mostrar);
}

/* ── nav ──────────────────────────────────────────────── */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.masthead');
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

/* ── flotantes ────────────────────────────────────────── */
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ── escape global y anclas ───────────────────────────── */
function initGlobales() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal')?.hidden) { cerrarModal(); return; }
    if (!document.getElementById('drawer')?.hidden) { cerrarDrawer(); return; }
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-goto-filtro')) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const dest = document.getElementById(id);
    if (!dest) return;
    e.preventDefault();
    window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 12, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const modal = document.getElementById('modal');
  const drawer = document.getElementById('drawer');
  const trap = cont => e => {
    if (e.key !== 'Tab' || cont.hidden) return;
    const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  if (modal) document.addEventListener('keydown', trap(modal));
  if (drawer) document.addEventListener('keydown', trap(drawer));
}

/* ── devolución de la demo ────────────────────────────── */
const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });
}

/* ── arranque ─────────────────────────────────────────── */
initCategorias();
initRail();
initCatalogo();
initArmado();
initReveals();
initHero();
initNav();
initRailControles();
initModal();
initDrawer();
initFloats();
initFiltroLinks();
initStage();
initLeeScroll();
initGlobales();
initFeedbackFloat();
updateCartBadge();
