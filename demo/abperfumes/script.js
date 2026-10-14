'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'arabes', nombre: 'Perfumes árabes', corto: 'Árabes' },
  { id: 'nicho', nombre: 'Perfumes de nicho', corto: 'Nicho' },
  { id: 'sets', nombre: 'Sets y regalos', corto: 'Sets' },
];
const FORMATOS = [
  { id: '5', nombre: 'Decant 5 ml', dato: 'Para conocer la fragancia' },
  { id: '10', nombre: 'Decant 10 ml', dato: 'Para usarla seguido' },
  { id: 'frasco', nombre: 'Frasco original', dato: 'Tu favorito, entero' },
];
const FAMILIAS = [
  { id: 'ambar', nombre: 'Ámbar y especias' },
  { id: 'amaderados', nombre: 'Amaderados y oud' },
  { id: 'dulces', nombre: 'Dulces y gourmand' },
  { id: 'frescos', nombre: 'Frescos y cítricos' },
  { id: 'florales', nombre: 'Florales y almizcles' },
];
const PARA = [
  { id: 'masculino', nombre: 'Masculino' },
  { id: 'femenino', nombre: 'Femenino' },
  { id: 'unisex', nombre: 'Unisex' },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' },
  { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const VISTAS = ['5', '10', 'frasco'];
const POR_PAGINA = 16;
const WSP = '5493571344297';

const slug = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sinTildes = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const nombreDe = (lista, id) => lista.find(x => x.id === id)?.nombre ?? '';

const Tienda = (() => {
  const TOPE = 100;
  const COLECCION = [
    { id: 'khamrah', nombre: 'Khamrah', casa: 'Lattafa', cat: 'arabes', familia: 'dulces', para: 'unisex', conc: 'Eau de Parfum', ml: 100, precios: { 5: 10900, 10: 18900, frasco: 89900 }, stock: { 5: 40, 10: 30, frasco: 6 }, img: 'p-khamrah', galeria: 'd-decants-01', rango: 1, alta: 20260918, badge: 'Más pedido',
      notas: { salida: 'Canela, nuez moscada y bergamota', corazon: 'Dátiles, praliné y tuberosa', fondo: 'Vainilla, haba tonka, benjuí y mirra' },
      desc: 'Dulce y especiado: canela y dátiles sobre un fondo de praliné y vainilla. Abriga como pocos.' },
    { id: 'baccarat-rouge-540', nombre: 'Baccarat Rouge 540', casa: 'Maison Francis Kurkdjian', cat: 'nicho', familia: 'florales', para: 'unisex', conc: 'Eau de Parfum', ml: 70, precios: { 5: 42900, 10: 79900, frasco: 689900 }, stock: { 5: 24, 10: 16, frasco: 2 }, img: 'p-baccarat', galeria: 'd-decants-04', rango: 2, alta: 20260910, badge: 'Más pedido',
      notas: { salida: 'Azafrán y jazmín', corazon: 'Ámbar gris y amberwood', fondo: 'Resina de abeto y cedro' },
      desc: 'Azafrán y jazmín sobre ámbar gris y cedro. Aireado, brillante y muy reconocible.' },
    { id: 'asad', nombre: 'Asad', casa: 'Lattafa', cat: 'arabes', familia: 'ambar', para: 'masculino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 9900, 10: 16900, frasco: 74900 }, stock: { 5: 36, 10: 28, frasco: 5 }, img: 'p-asad', galeria: 'd-decants-01', rango: 3, alta: 20260915,
      notas: { salida: 'Pimienta negra, ananá y tabaco', corazon: 'Café, iris y pachulí', fondo: 'Ámbar, vainilla, benjuí y ládano' },
      desc: 'Pimienta negra y tabaco sobre un fondo de ámbar y vainilla. Intenso, para la noche.' },
    { id: 'naxos', nombre: 'Naxos', casa: 'Xerjoff', cat: 'nicho', familia: 'ambar', para: 'unisex', conc: 'Eau de Parfum', ml: 100, precios: { 5: 36900, 10: 67900, frasco: 729900 }, stock: { 5: 20, 10: 14, frasco: 2 }, img: 'p-naxos', galeria: 'd-decants-04', rango: 4, alta: 20260905,
      notas: { salida: 'Lavanda, bergamota y limón', corazon: 'Miel, canela, cashmeran y jazmín', fondo: 'Hoja de tabaco, haba tonka y vainilla' },
      desc: 'Lavanda, miel y canela sobre hoja de tabaco y vainilla. Dulce, sofisticado y con carácter.' },
    { id: '9pm', nombre: '9PM', casa: 'Afnan', cat: 'arabes', familia: 'dulces', para: 'masculino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 10900, 10: 18900, frasco: 84900 }, stock: { 5: 34, 10: 26, frasco: 4 }, img: 'p-9pm', galeria: 'd-decants-01', rango: 5, alta: 20260912, badge: 'Más pedido',
      notas: { salida: 'Manzana, canela, lavanda y bergamota', corazon: 'Flor de azahar y lirio del valle', fondo: 'Vainilla, haba tonka, ámbar y pachulí' },
      desc: 'Manzana, canela y lavanda sobre vainilla y ámbar. Dulce y nocturno, para salir.' },
    { id: 'aventus', nombre: 'Aventus', casa: 'Creed', cat: 'nicho', familia: 'frescos', para: 'masculino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 39900, 10: 74900, frasco: 789900 }, stock: { 5: 22, 10: 15, frasco: 2 }, img: 'p-aventus', galeria: 'd-decants-04', rango: 6, alta: 20260902,
      notas: { salida: 'Ananá, bergamota, grosella negra y manzana', corazon: 'Abedul, pachulí, jazmín y rosa', fondo: 'Almizcle, musgo de roble, ámbar gris y vainilla' },
      desc: 'Ananá, grosella negra y abedul ahumado sobre almizcle y musgo de roble. El frutal amaderado de referencia.' },
    { id: 'yara', nombre: 'Yara', casa: 'Lattafa', cat: 'arabes', familia: 'dulces', para: 'femenino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 9900, 10: 16900, frasco: 69900 }, stock: { 5: 38, 10: 30, frasco: 6 }, img: 'p-yara', galeria: 'd-decants-01', rango: 7, alta: 20260908,
      notas: { salida: 'Orquídea, heliotropo y mandarina', corazon: 'Acorde gourmand y frutas tropicales', fondo: 'Vainilla, almizcle y sándalo' },
      desc: 'Cremoso y frutal, con orquídea y heliotropo sobre vainilla. Suave, envolvente y fácil de llevar.' },
    { id: 'club-de-nuit-intense', nombre: 'Club de Nuit Intense Man', casa: 'Armaf', cat: 'arabes', familia: 'amaderados', para: 'masculino', conc: 'Eau de Toilette', ml: 105, precios: { 5: 10900, 10: 18900, frasco: 94900 }, stock: { 5: 30, 10: 22, frasco: 4 }, img: 'p-club-de-nuit', galeria: 'd-decants-01', rango: 8, alta: 20261001,
      notas: { salida: 'Limón, ananá, grosella negra y bergamota', corazon: 'Abedul, jazmín y rosa', fondo: 'Almizcle, ámbar gris, pachulí y vainilla' },
      desc: 'Ananá y abedul ahumado sobre almizcle. Fresco al salir y amaderado cuando se asienta en la piel.' },
    { id: 'odyssey-mandarin-sky', nombre: 'Odyssey Mandarin Sky', casa: 'Armaf', cat: 'arabes', familia: 'frescos', para: 'masculino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 10900, 10: 18900, frasco: 86900 }, stock: { 5: 28, 10: 20, frasco: 4 }, img: 'p-odyssey', galeria: 'd-decants-01', alta: 20261014, badge: 'Recién llegado',
      notas: { salida: 'Mandarina y naranja amarga', corazon: 'Haba tonka y caramelo', fondo: 'Ámbar y maderas' },
      desc: 'Mandarina y naranja sobre haba tonka y caramelo. Cítrico, dulce y alegre.' },
    { id: 'oud-for-greatness', nombre: 'Oud for Greatness', casa: 'Initio', cat: 'nicho', familia: 'amaderados', para: 'unisex', conc: 'Eau de Parfum', ml: 90, precios: { 5: 38900, 10: 71900, frasco: 699900 }, stock: { 5: 18, 10: 12, frasco: 2 }, img: 'p-oud-greatness', galeria: 'd-decants-04', alta: 20261012, badge: 'Recién llegado',
      notas: { salida: 'Azafrán, nuez moscada y lavanda', corazon: 'Oud', fondo: 'Pachulí y almizcle' },
      desc: 'Azafrán, nuez moscada y lavanda sobre un oud intenso con pachulí y almizcle.' },
    { id: 'set-descubrimiento-arabe', nombre: 'Set descubrimiento árabe', casa: 'Ab perfumes', cat: 'sets', familia: 'dulces', para: 'unisex', conc: 'Set de decants', precios: { set: 39900 }, stock: { set: 12 }, img: 'p-set-arabe', galeria: 'd-decants-01', alta: 20261010, presentacion: 'Set de 4 decants de 5 ml', presentacionCorta: '4 decants × 5 ml',
      contenido: ['Lattafa Khamrah 5 ml', 'Lattafa Asad 5 ml', 'Afnan 9PM 5 ml', 'Armaf Club de Nuit Intense Man 5 ml'],
      desc: 'Cuatro decants de 5 ml para empezar por los árabes: Khamrah, Asad, 9PM y Club de Nuit Intense Man.' },
    { id: 'hawas-for-him', nombre: 'Hawas for Him', casa: 'Rasasi', cat: 'arabes', familia: 'frescos', para: 'masculino', conc: 'Eau de Parfum', ml: 100, precios: { 5: 11900, 10: 20900, frasco: 99900 }, stock: { 5: 30, 10: 22, frasco: 3 }, img: 'p-hawas', galeria: 'd-decants-01', alta: 20261008,
      notas: { salida: 'Manzana, bergamota, limón y canela', corazon: 'Notas acuáticas, cardamomo, ciruela y azahar', fondo: 'Ámbar gris, almizcle, maderas y pachulí' },
      desc: 'Manzana, bergamota y notas marinas sobre ámbar gris. Fresco y acuático, para los días de calor.' },
    { id: 'angels-share', nombre: "Angels' Share", casa: 'Kilian', cat: 'nicho', familia: 'dulces', para: 'unisex', conc: 'Eau de Parfum', ml: 50, precios: { 5: 37900, 10: 69900, frasco: 589900 }, stock: { 5: 18, 10: 12, frasco: 2 }, img: 'p-angels-share', galeria: 'd-decants-04', alta: 20261007,
      notas: { salida: 'Coñac', corazon: 'Canela, haba tonka y roble', fondo: 'Praliné, vainilla y sándalo' },
      desc: 'Coñac, canela y haba tonka sobre praliné y vainilla. Gourmand, cálido y licoroso.' },
    { id: 'amber-oud-gold', nombre: 'Amber Oud Gold Edition', casa: 'Al Haramain', cat: 'arabes', familia: 'ambar', para: 'unisex', conc: 'Eau de Parfum', ml: 120, precios: { 5: 12900, 10: 22900, frasco: 129900 }, stock: { 5: 26, 10: 18, frasco: 3 }, img: 'p-amber-oud', galeria: 'd-decants-01', alta: 20261006,
      notas: { salida: 'Bergamota y notas verdes', corazon: 'Melón y ananá', fondo: 'Ámbar, almizcle, vainilla y maderas' },
      desc: 'Melón, ananá y bergamota sobre ámbar y almizcle. Dulce, luminoso y con mucha presencia.' },
    { id: 'set-descubrimiento-nicho', nombre: 'Set descubrimiento nicho', casa: 'Ab perfumes', cat: 'sets', familia: 'ambar', para: 'unisex', conc: 'Set de decants', precios: { set: 104900 }, stock: { set: 8 }, img: 'p-set-nicho', galeria: 'd-decants-04', alta: 20261004, presentacion: 'Set de 3 decants de 5 ml', presentacionCorta: '3 decants × 5 ml',
      contenido: ['Parfums de Marly Layton 5 ml', 'Xerjoff Naxos 5 ml', 'Maison Francis Kurkdjian Baccarat Rouge 540 5 ml'],
      desc: 'Tres decants de 5 ml para probar nicho antes de ir por un frasco: Layton, Naxos y Baccarat Rouge 540.' },
    { id: 'badee-al-oud', nombre: "Bade'e Al Oud Oud for Glory", casa: 'Lattafa', cat: 'arabes', familia: 'amaderados', para: 'unisex', conc: 'Eau de Parfum', ml: 100, precios: { 5: 10900, 10: 18900, frasco: 79900 }, stock: { 5: 30, 10: 24, frasco: 4 }, img: 'p-badee-al-oud', galeria: 'd-decants-01', alta: 20261003,
      notas: { salida: 'Azafrán, nuez moscada y lavanda', corazon: 'Oud y pachulí', fondo: 'Oud, almizcle y pachulí' },
      desc: 'Azafrán y lavanda sobre oud y pachulí. Un oud amaderado, oscuro y elegante.' },
    { id: 'layton', nombre: 'Layton', casa: 'Parfums de Marly', cat: 'nicho', familia: 'ambar', para: 'masculino', conc: 'Eau de Parfum', ml: 125, precios: { 5: 32900, 10: 59900, frasco: 649900 }, stock: { 5: 22, 10: 16, frasco: 1 }, img: 'p-layton', galeria: 'd-decants-04', alta: 20260928,
      notas: { salida: 'Manzana, lavanda, bergamota y mandarina', corazon: 'Geranio, violeta y jazmín', fondo: 'Vainilla, cardamomo, pimienta, pachulí y guayaco' },
      desc: 'Manzana y lavanda con vainilla, cardamomo y guayaco. Especiado, elegante y versátil.' },
    { id: 'ana-abiyedh', nombre: 'Ana Abiyedh', casa: 'Lattafa', cat: 'arabes', familia: 'florales', para: 'unisex', conc: 'Eau de Parfum', ml: 60, precios: { 5: 8900, 10: 14900, frasco: 49900 }, stock: { 5: 34, 10: 26, frasco: 5 }, img: 'p-ana-abiyedh', galeria: 'd-decants-01', alta: 20260925,
      notas: { salida: 'Bergamota y limón', corazon: 'Almizcle blanco y lirio', fondo: 'Almizcle, ámbar y maderas' },
      desc: 'Almizcle blanco con lirio y un toque cítrico. Limpio y suave, para todos los días.' },
    { id: 'set-dulces-ambarados', nombre: 'Set dulces y ambarados', casa: 'Ab perfumes', cat: 'sets', familia: 'dulces', para: 'unisex', conc: 'Set de decants', precios: { set: 109900 }, stock: { set: 6 }, img: 'p-set-dulces', galeria: 'd-decants-04', alta: 20260920, presentacion: 'Set de 3 decants de 10 ml', presentacionCorta: '3 decants × 10 ml',
      contenido: ['Lattafa Khamrah 10 ml', 'Al Haramain Amber Oud Gold Edition 10 ml', "Kilian Angels' Share 10 ml"],
      desc: "Tres decants de 10 ml de perfil dulce: Khamrah, Amber Oud Gold Edition y Angels' Share. Para regalar o regalarte." },
  ];

  const INDICE = new Map(COLECCION.map(p => [p.id, sinTildes([
    p.nombre, p.casa, nombreDe(CATEGORIAS, p.cat), nombreDe(FAMILIAS, p.familia), p.para, p.conc, p.desc,
    ...(p.notas ? Object.values(p.notas) : []), ...(p.contenido || []), p.cat === 'sets' ? 'decants regalo' : 'decant',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), familia = lista(f.familia), para = lista(f.para), casa = lista(f.casa), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (familia.length && !familia.includes(p.familia)) return false;
    if (para.length && !para.includes(p.para)) return false;
    if (casa.length && !casa.includes(slug(p.casa))) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.q) {
      const palabras = sinTildes(f.q).split(/\s+/).filter(Boolean);
      const texto = INDICE.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  const precioOrden = (p, vista) => p.precios[vista] ?? p.precios.set ?? p.precios[5];
  function comparador(orden, vista) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioOrden(a, vista) - precioOrden(b, vista) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioOrden(b, vista) - precioOrden(a, vista) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }

  function consultar({ filtros = {}, orden = 'destacados', vista = '5', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || POR_PAGINA, 1), TOPE);
    const ordenados = COLECCION.filter(p => coincide(p, filtros)).sort(comparador(orden, vista));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return COLECCION.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = COLECCION.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  function casas() {
    const m = new Map();
    COLECCION.forEach(p => {
      const id = slug(p.casa);
      m.set(id, { id, nombre: p.casa, n: (m.get(id)?.n || 0) + 1 });
    });
    return [...m.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }
  return { TOPE, consultar, contar, obtener, casas };
})();

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Tienda.obtener(id);
const formatosDe = p => Object.keys(p.precios).sort((a, b) => VISTAS.indexOf(a) - VISTAS.indexOf(b));
const formatoParaVista = (p, vista) => (p.precios[vista] != null ? vista : formatosDe(p)[0]);
const precioDe = (p, f) => p?.precios?.[f] ?? 0;
const stockDe = (p, f) => p?.stock?.[f] ?? 99;
const nombreFormato = (p, f) => (f === 'set' ? p.presentacion : f === 'frasco' ? `Frasco ${p.ml} ml` : `Decant ${f} ml`);
const cortoFormato = (p, f) => (f === 'set' ? p.presentacionCorta : f === 'frasco' ? 'Frasco' : `${f} ml`);
const badgeDe = p => p.badge || (p.stock?.frasco === 1 ? 'Último frasco' : '');
const altDe = p => (p.cat === 'sets' ? `${p.nombre}: ${p.presentacion.toLowerCase()}` : `${p.nombre} de ${p.casa}, perfume ${p.cat === 'arabes' ? 'árabe' : 'de nicho'}`);

const Cart = {
  KEY: 'abperfumes_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, formato, qty = 1) {
    const items = this.get();
    const max = stockDe(producto, formato);
    const existing = items.find(i => i.id === producto.id && i.formato === formato);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, formato, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, formato, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.formato === formato); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, stockDe(p, formato))); this.save(items);
  },
  remove(id, formato) { this.save(this.get().filter(i => !(i.id === id && i.formato === formato))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.formato) * i.qty : s; }, 0); },
};

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
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CAT_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

const ICONO_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONO_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

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

const estadoInicial = tipo => ({
  subir: 'opacity:0;transform:translateY(36px)',
  der: 'opacity:0;transform:translateX(56px)',
  escala: 'opacity:0;transform:translateY(20px) scale(.92)',
}[tipo] || 'opacity:0;transform:translateY(36px)');
const animAttr = tipo => (tipo ? ` data-animate="${tipo}" style="${estadoInicial(tipo)}"` : '');
const urlProducto = id => `${CAT_URL}?producto=${encodeURIComponent(id)}`;

function stepperHTML() {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">−</button><span class="stepper__n" data-qty aria-live="polite">1</span><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>`;
}
function tamanosHTML(p, f) {
  const fmts = formatosDe(p);
  if (fmts.length < 2) return `<p class="tamanos tamanos--fijo">${esc(p.presentacionCorta)}</p>`;
  return `<div class="tamanos" role="group" aria-label="Tamaño de ${esc(p.nombre)}">${fmts.map(x => `<button type="button" class="tamano" data-tamano="${x}" aria-pressed="${x === f}">${esc(cortoFormato(p, x))}</button>`).join('')}</div>`;
}

function cardM1(p, vista, anim = 'subir') {
  const f = formatoParaVista(p, vista);
  const badge = badgeDe(p);
  const url = urlProducto(p.id);
  return `<article class="prod"${animAttr(anim)} data-id="${esc(p.id)}" data-formato="${f}">
  <a class="prod__media" href="${url}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="images/${p.img}.webp" alt="${esc(altDe(p))}" width="560" height="700">${badge ? `<span class="badge">${esc(badge)}</span>` : ''}</a>
  <div class="prod__body">
    <p class="prod__casa">${esc(p.casa)}</p>
    <h3 class="prod__nombre"><a href="${url}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${tamanosHTML(p, f)}
    <p class="prod__precio" data-precio>${formatearPrecio(precioDe(p, f))}</p>
    <div class="prod-actions">${stepperHTML()}<button type="button" class="btn btn--cta prod-add" data-add>${ICONO_CARRITO}<span>Agregar</span><span class="sr-only"> al carrito</span></button></div>
    <button type="button" class="prod__ahora" data-buy>Comprar ahora</button>
  </div>
</article>`;
}

function cardM2(p, vista, anim = 'subir', clase = '') {
  const f = formatoParaVista(p, vista);
  const badge = badgeDe(p);
  return `<article class="vcard${clase ? ' ' + clase : ''}"${animAttr(anim)} data-id="${esc(p.id)}" data-formato="${f}">
  <a class="vcard__media" href="${urlProducto(p.id)}" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)} de ${esc(p.casa)}"><img src="images/${p.img}.webp" alt="${esc(altDe(p))}" width="560" height="700"></a>
  ${badge ? `<span class="badge">${esc(badge)}</span>` : ''}
  <div class="vcard__info">
    <p class="vcard__casa">${esc(p.casa)}</p>
    <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
    <p class="vcard__precio"><span data-formato-txt>${esc(nombreFormato(p, f))}</span> <strong data-precio>${formatearPrecio(precioDe(p, f))}</strong></p>
  </div>
  <button type="button" class="vcard__add" data-add aria-label="Agregar ${esc(p.nombre)} al carrito">${ICONO_CARRITO}</button>
</article>`;
}

const cardPara = (p, vista, anim, clase) => (MODELO === '2' ? cardM2(p, vista, anim, clase) : cardM1(p, vista, anim));

function actualizarCard(card, f) {
  const p = getProducto(card.dataset.id);
  if (!p || p.precios[f] == null) return;
  card.dataset.formato = f;
  card.querySelectorAll('[data-tamano]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tamano === f)));
  const precio = card.querySelector('[data-precio]');
  if (precio) precio.textContent = formatearPrecio(precioDe(p, f));
  const txt = card.querySelector('[data-formato-txt]');
  if (txt) txt.textContent = nombreFormato(p, f);
  const qty = card.querySelector('[data-qty]');
  if (qty && +qty.textContent > stockDe(p, f)) qty.textContent = stockDe(p, f);
}

function agregarDesdeCard(card, abrir) {
  const p = getProducto(card.dataset.id);
  if (!p) return;
  const f = card.dataset.formato || formatoParaVista(p, '5');
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  Cart.add(p, f, qty);
  if (abrir) abrirCarrito(card.querySelector('[data-buy]'));
  else showToast(`Sumaste ${p.nombre} (${nombreFormato(p, f).toLowerCase()}) al carrito`);
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

function initRailFlechas(rail) {
  const vp = rail.querySelector('.rail-vp');
  const track = rail.querySelector('.rail-track');
  const prev = rail.querySelector('[data-rail="prev"]');
  const next = rail.querySelector('[data-rail="next"]');
  if (!vp || !track) return;
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initDestacados() {
  const res = () => Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  const rail = document.getElementById('railDestacados');
  if (rail) {
    rail.innerHTML = res().map(p => `<div class="rail-item">${cardM1(p, '5', 'der')}</div>`).join('');
    initRailDrag(rail.closest('.rail-vp'));
    initRailFlechas(rail.closest('.rail'));
  }
  const mosaico = document.getElementById('mosaicoDestacados');
  if (mosaico) {
    mosaico.innerHTML = res().map((p, i) => cardM2(p, '5', 'subir', i === 0 ? 'vcard--grande' : i === 7 ? 'vcard--ancha' : '')).join('');
  }
}

function initNovedades() {
  const items = () => Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
  const grid = document.getElementById('gridNovedades');
  if (grid) grid.innerHTML = items().map(p => cardM1(p, '5', 'subir')).join('');
  const rail = document.getElementById('railNovedades');
  if (rail) {
    rail.innerHTML = items().map(p => `<div class="rail-item">${cardM2(p, '5', 'der')}</div>`).join('');
    initRailDrag(rail.closest('.rail-vp'));
    initRailFlechas(rail.closest('.rail'));
  }
}

function initMega() {
  const panel = document.getElementById('megaCats');
  const btn = document.querySelector('[data-mega-btn]');
  if (!panel || !btn) return;
  const casas = Tienda.casas();
  panel.innerHTML = `<div class="mega__cols">
    <div class="mega__col"><p class="mega__tit">Líneas</p><ul>${CATEGORIAS.map(c => `<li><a href="${CAT_URL}?cat=${c.id}" data-mega-cat="${c.id}">${esc(c.nombre)}<span class="mega__n">${Tienda.contar({ cat: [c.id] })}</span></a></li>`).join('')}</ul></div>
    <div class="mega__col"><p class="mega__tit">Tamaños</p><ul>${FORMATOS.map(f => `<li><a href="${CAT_URL}?formato=${f.id}" data-mega-formato="${f.id}">${esc(f.nombre)}<small>${esc(f.dato)}</small></a></li>`).join('')}</ul></div>
    <div class="mega__col mega__col--casas"><p class="mega__tit">Casas</p><ul>${casas.map(c => `<li><a href="${CAT_URL}?casa=${c.id}" data-mega-casa="${c.id}">${esc(c.nombre)}<span class="mega__n">${c.n}</span></a></li>`).join('')}</ul></div>
  </div>
  <a class="mega__todo" href="${CAT_URL}">Ver todo el catálogo<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>`;
  const item = btn.closest('.has-mega');
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; item.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); item.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; };
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? cerrar() : abrir()));
  item.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  item.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  item.addEventListener('focusout', e => { if (hoverMq.matches && !item.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (hoverMq.matches && !item.contains(e.target)) cerrar(); });
  hoverMq.addEventListener('change', cerrar);
}

function marcarNavActiva(estado) {
  const cat = estado?.cat?.length === 1 ? estado.cat[0] : null;
  document.querySelectorAll('[data-mega-cat]').forEach(a => {
    if (cat && a.dataset.megaCat === cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-nav-cat]').forEach(a => {
    if (PAGINA === 'catalogo' && cat && a.dataset.navCat === cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    if (!desktopMq.matches) window.scrollTo(0, 0);
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
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

function initRotador() {
  const rot = document.querySelector('[data-rotador]');
  if (!rot) return;
  const msgs = [...rot.querySelectorAll('.rotador__msg')];
  const dots = [...rot.querySelectorAll('[data-dot]')];
  if (msgs.length < 2) return;
  let i = 0, timer = 0;
  const ir = n => {
    i = (n + msgs.length) % msgs.length;
    msgs.forEach((m, k) => { m.classList.toggle('activo', k === i); m.setAttribute('aria-hidden', String(k !== i)); });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  };
  const auto = () => { window.clearInterval(timer); if (!reduceMotion) timer = window.setInterval(() => ir(i + 1), 5200); };
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); auto(); }));
  rot.addEventListener('mouseenter', () => window.clearInterval(timer));
  rot.addEventListener('mouseleave', auto);
  rot.addEventListener('focusin', () => window.clearInterval(timer));
  rot.addEventListener('focusout', auto);
  ir(0); auto();
}

function initCalc() {
  const calc = document.getElementById('calc');
  if (!calc) return;
  const atom = calc.querySelector('#calcAtom');
  const dias = calc.querySelector('#calcDias');
  const reco = calc.querySelector('[data-reco]');
  const cta = calc.querySelector('[data-reco-cta]');
  const ML_POR_ATOMIZACION = 0.1;
  const duracion = semanas => {
    if (semanas < 2) { const d = Math.max(1, Math.round(semanas * 7)); return `${d} ${d === 1 ? 'día' : 'días'}`; }
    if (semanas < 9) return `${Math.round(semanas)} semanas`;
    if (semanas < 104) { const m = Math.round(semanas / 4.345); return `${m} ${m === 1 ? 'mes' : 'meses'}`; }
    return 'más de 2 años';
  };
  const pintar = () => {
    const a = +atom.value, d = +dias.value;
    calc.querySelector('output[for="calcAtom"]').textContent = a;
    calc.querySelector('output[for="calcDias"]').textContent = d;
    const mlSemana = a * d * ML_POR_ATOMIZACION;
    const semanas = ml => ml / mlSemana;
    const tiles = { 5: semanas(5), 10: semanas(10), frasco: semanas(100) };
    Object.entries(tiles).forEach(([k, v]) => { const el = calc.querySelector(`[data-dura="${k}"]`); if (el) el.textContent = duracion(v); });
    let f, texto;
    if (tiles[5] >= 4) { f = '5'; texto = `Un decant de 5 ml te dura ${duracion(tiles[5])}: tiempo de sobra para probarlo en tu piel antes de elegir.`; }
    else if (tiles[10] >= 4) { f = '10'; texto = `Lo usás seguido: el decant de 10 ml te acompaña ${duracion(tiles[10])}.`; }
    else { f = 'frasco'; texto = `Usás bastante perfume: si ya es tu favorito, el frasco de 100 ml te rinde ${duracion(tiles.frasco)}.`; }
    calc.querySelectorAll('[data-dura-tile]').forEach(t => t.classList.toggle('recomendado', t.dataset.duraTile === f));
    if (reco) reco.textContent = texto;
    if (cta) {
      cta.href = `${CAT_URL}?formato=${f}`;
      cta.querySelector('span').textContent = f === 'frasco' ? 'Ver frascos originales' : `Ver decants de ${f} ml`;
    }
  };
  atom.addEventListener('input', pintar);
  dias.addEventListener('input', pintar);
  pintar();
}

let panelActivo = null;
let panelDisparador = null;
const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
function abrirPanel(panel, disparador) {
  if (!panel) return;
  if (panelActivo && panelActivo !== panel) cerrarPanel(true);
  panelActivo = panel;
  panelDisparador = disparador || document.activeElement;
  panel.hidden = false;
  void panel.offsetWidth;
  panel.classList.add('abierto');
  document.body.classList.add('no-scroll');
  const foco = panel.querySelector('[data-foco]') || panel.querySelector(FOCUSABLES);
  foco?.focus({ preventScroll: true });
}
function cerrarPanel(silencioso) {
  const panel = panelActivo;
  if (!panel) return;
  panelActivo = null;
  panel.classList.remove('abierto');
  document.body.classList.remove('no-scroll');
  if (panel.dataset.siempreVisible === undefined) setTimeout(() => { if (!panel.classList.contains('abierto')) panel.hidden = true; }, 400);
  if (!silencioso) panelDisparador?.focus?.({ preventScroll: true });
  if (panel.id === 'quickView' && PAGINA === 'catalogo') {
    const u = new URL(location.href);
    if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); window.history.replaceState(null, '', u); }
  }
}
document.addEventListener('keydown', e => {
  if (!panelActivo) return;
  if (e.key === 'Escape') { e.preventDefault(); cerrarPanel(); return; }
  if (e.key !== 'Tab') return;
  const f = [...panelActivo.querySelectorAll(FOCUSABLES)].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
document.addEventListener('click', e => {
  if (e.target.closest('[data-cerrar]') && panelActivo?.contains(e.target)) cerrarPanel();
});

function abrirCarrito(disparador) {
  renderCarrito();
  abrirPanel(document.getElementById('cartDrawer'), disparador);
}

function renderCarrito() {
  const lista = document.getElementById('cartItems');
  const pie = document.getElementById('cartFoot');
  if (!lista) return;
  const items = Cart.get();
  const conteo = document.querySelector('[data-cart-count-text]');
  if (conteo) conteo.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    lista.innerHTML = `<div class="carrito-vacio"><p class="carrito-vacio__tit">Tu carrito todavía no huele a nada</p><p>Elegí una fragancia en decant de 5 o 10 ml, o directo el frasco.</p><a class="btn btn--cta" href="${CAT_URL}">Ir al catálogo</a></div>`;
    if (pie) pie.hidden = true;
    return;
  }
  if (pie) pie.hidden = false;
  lista.innerHTML = `<ul class="linea-lista">${items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<li class="linea" data-linea="${esc(i.id)}" data-formato="${esc(i.formato)}">
      <img src="images/${p.img}.webp" alt="" width="560" height="700">
      <div class="linea__info">
        <p class="linea__casa">${esc(p.casa)}</p>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__formato">${esc(nombreFormato(p, i.formato))} · ${formatearPrecio(precioDe(p, i.formato))}</p>
        <div class="linea__acciones"><div class="stepper stepper--chico"><button type="button" data-linea-step="-1" aria-label="Restar uno">−</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">+</button></div><button type="button" class="linea__quitar" data-linea-quitar>Quitar</button></div>
      </div>
      <p class="linea__total">${formatearPrecio(precioDe(p, i.formato) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function initCarrito() {
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrirCarrito(b)));
  const lista = document.getElementById('cartItems');
  lista?.addEventListener('click', e => {
    const li = e.target.closest('[data-linea]');
    if (!li) return;
    const id = li.dataset.linea, f = li.dataset.formato;
    const it = Cart.get().find(x => x.id === id && x.formato === f);
    if (e.target.closest('[data-linea-step]')) Cart.setQty(id, f, (it?.qty || 1) + (+e.target.closest('[data-linea-step]').dataset.lineaStep));
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(id, f);
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (panelActivo?.id === 'cartDrawer') renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

function initCardsEventos() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.ctrlKey && !e.metaKey) { e.preventDefault(); abrirVistaRapida(quick.dataset.quick, quick); return; }
    const card = e.target.closest('.prod, .vcard');
    if (!card) return;
    const tam = e.target.closest('[data-tamano]');
    if (tam) { actualizarCard(card, tam.dataset.tamano); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const n = card.querySelector('[data-qty]');
      const p = getProducto(card.dataset.id);
      const max = stockDe(p, card.dataset.formato);
      n.textContent = Math.max(1, Math.min(max, (+n.textContent || 1) + (+step.dataset.step)));
      return;
    }
    if (e.target.closest('[data-add]')) { agregarDesdeCard(card, false); return; }
    if (e.target.closest('[data-buy]')) agregarDesdeCard(card, true);
  });
}

function abrirVistaRapida(id, disparador) {
  const p = getProducto(id);
  const qv = document.getElementById('quickView');
  const cont = document.getElementById('qvContent');
  if (!p || !qv || !cont) return;
  const vistaActual = estadoCatalogo?.vista || '5';
  let f = formatoParaVista(p, vistaActual);
  const fmts = formatosDe(p);
  const relacionados = Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  const wspMsg = encodeURIComponent(`Hola Ab perfumes! Quiero consultar por ${p.casa === 'Ab perfumes' ? '' : p.casa + ' '}${p.nombre}.`);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__gal">
      <div class="qv__foto"><img src="images/${p.img}.webp" alt="${esc(altDe(p))}" width="560" height="700" data-qv-main></div>
      <div class="qv__thumbs">
        <button type="button" class="qv__thumb" aria-pressed="true" data-qv-img="${p.img}" aria-label="Ver foto del perfume"><img src="images/${p.img}.webp" alt="" width="560" height="700"></button>
        <button type="button" class="qv__thumb" aria-pressed="false" data-qv-img="${p.galeria}" aria-label="Ver cómo son los decants"><img src="images/${p.galeria}.webp" alt="" width="560" height="700"></button>
      </div>
    </div>
    <div class="qv__info">
      <p class="qv__casa">${esc(p.casa)} · ${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h2 class="qv__nombre" id="qvTitulo">${esc(p.nombre)}</h2>
      <p class="qv__meta">${esc(nombreDe(FAMILIAS, p.familia))} · ${esc(nombreDe(PARA, p.para))} · ${esc(p.conc)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.notas ? `<dl class="piramide"><div><dt>Salida</dt><dd>${esc(p.notas.salida)}</dd></div><div><dt>Corazón</dt><dd>${esc(p.notas.corazon)}</dd></div><div><dt>Fondo</dt><dd>${esc(p.notas.fondo)}</dd></div></dl>` : ''}
      ${p.contenido ? `<ul class="qv__contenido">${p.contenido.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      <fieldset class="qv__formatos"><legend>${fmts.length > 1 ? 'Elegí el tamaño' : 'Presentación'}</legend>
        ${fmts.map(x => `<label class="opcion"><input type="radio" name="qvFormato" value="${x}"${x === f ? ' checked' : ''}><span class="opcion__nombre">${esc(nombreFormato(p, x))}</span><span class="opcion__precio">${formatearPrecio(precioDe(p, x))}</span></label>`).join('')}
      </fieldset>
      <div class="qv__comprar">${stepperHTML()}<button type="button" class="btn btn--cta" data-qv-add>${ICONO_CARRITO}<span>Agregar al carrito</span></button></div>
      <button type="button" class="btn btn--ghost btn--block" data-qv-buy>Comprar ahora</button>
      <p class="qv__envio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>Envíos a todo el país y servicio puerta a puerta. <a href="https://wa.me/${WSP}?text=${wspMsg}" target="_blank" rel="noopener">Consultar por WhatsApp</a></p>
    </div>
  </div>
  ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${relacionados.map(r => `<a class="mini" href="${urlProducto(r.id)}" data-quick="${esc(r.id)}"><img src="images/${r.img}.webp" alt="" width="560" height="700"><span class="mini__casa">${esc(r.casa)}</span><span class="mini__nombre">${esc(r.nombre)}</span><span class="mini__precio">desde ${formatearPrecio(precioDe(r, formatosDe(r)[0]))}</span></a>`).join('')}</div></div>` : ''}`;
  qv.setAttribute('aria-label', `${p.nombre} de ${p.casa}`);
  const qty = cont.querySelector('[data-qty]');
  cont.querySelectorAll('input[name="qvFormato"]').forEach(r => r.addEventListener('change', () => { f = r.value; qty.textContent = Math.min(+qty.textContent, stockDe(p, f)); }));
  cont.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { qty.textContent = Math.max(1, Math.min(stockDe(p, f), (+qty.textContent || 1) + (+b.dataset.step))); }));
  cont.querySelectorAll('[data-qv-img]').forEach(b => b.addEventListener('click', () => {
    cont.querySelector('[data-qv-main]').src = `images/${b.dataset.qvImg}.webp`;
    cont.querySelectorAll('[data-qv-img]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  cont.querySelector('[data-qv-add]').addEventListener('click', () => {
    Cart.add(p, f, +qty.textContent || 1);
    showToast(`Sumaste ${p.nombre} (${nombreFormato(p, f).toLowerCase()}) al carrito`);
  });
  cont.querySelector('[data-qv-buy]').addEventListener('click', e => {
    Cart.add(p, f, +qty.textContent || 1);
    cerrarPanel(true);
    abrirCarrito(e.currentTarget);
  });
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: `${p.casa} ${p.nombre}`, brand: { '@type': 'Brand', name: p.casa }, image: `https://gokywebs.com/demo/abperfumes/images/${p.img}.webp`, description: p.desc, offers: fmts.map(x => ({ '@type': 'Offer', name: nombreFormato(p, x), price: precioDe(p, x), priceCurrency: 'ARS', availability: stockDe(p, x) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })) });
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    window.history.replaceState(null, '', u);
  }
  abrirPanel(qv, disparador);
  cont.scrollTop = 0;
  qv.querySelector('.qv__panel')?.scrollTo?.(0, 0);
}

let estadoCatalogo = null;

function leerEstadoURL() {
  const u = new URLSearchParams(location.search);
  const valida = (clave, ids) => (u.get(clave) || '').split(',').map(s => s.trim()).filter(v => ids.includes(v));
  const casasIds = Tienda.casas().map(c => c.id);
  const vista = VISTAS.includes(u.get('formato')) ? u.get('formato') : '5';
  const orden = ORDENES.some(o => o.id === u.get('orden')) ? u.get('orden') : 'destacados';
  return {
    cat: valida('cat', CATEGORIAS.map(c => c.id)),
    familia: valida('familia', FAMILIAS.map(f => f.id)),
    para: valida('para', PARA.map(p => p.id)),
    casa: valida('casa', casasIds),
    q: (u.get('q') || '').slice(0, 60),
    orden,
    vista,
  };
}

function escribirEstadoURL(e) {
  const u = new URL(location.href);
  ['cat', 'familia', 'para', 'casa'].forEach(k => { if (e[k].length) u.searchParams.set(k, e[k].join(',')); else u.searchParams.delete(k); });
  if (e.q) u.searchParams.set('q', e.q); else u.searchParams.delete('q');
  if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden); else u.searchParams.delete('orden');
  if (e.vista !== '5') u.searchParams.set('formato', e.vista); else u.searchParams.delete('formato');
  u.searchParams.delete('buscar');
  window.history.replaceState(null, '', u);
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const contador = document.getElementById('contador');
  const pieTexto = document.getElementById('pieTexto');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('catVacio');
  const buscador = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const titulo = document.getElementById('catTitulo');
  const bajada = document.getElementById('catBajada');
  const miga = document.getElementById('catMiga');
  const activos = document.getElementById('chipsActivos');
  estadoCatalogo = leerEstadoURL();
  const e = estadoCatalogo;
  let cursor = null;
  let mostrados = 0;

  const grupos = {
    cat: CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre })),
    familia: FAMILIAS,
    para: PARA,
    casa: Tienda.casas().map(c => ({ id: c.id, nombre: c.nombre })),
  };
  document.querySelectorAll('[data-grupo]').forEach(box => {
    const g = box.dataset.grupo;
    const chips = box.dataset.estilo === 'chips';
    box.innerHTML = grupos[g].map(o => {
      const n = Tienda.contar({ [g]: [o.id] });
      return chips
        ? `<label class="chip-f"><input type="checkbox" data-f="${g}" value="${o.id}"><span>${esc(o.nombre)}</span></label>`
        : `<label class="chk"><input type="checkbox" data-f="${g}" value="${o.id}"><span class="chk__txt">${esc(o.nombre)}</span><span class="chk__n">${n}</span></label>`;
    }).join('');
  });
  if (ordenSel) ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}">${esc(o.nombre)}</option>`).join('');

  const filtros = () => ({ cat: e.cat, familia: e.familia, para: e.para, casa: e.casa, q: e.q });
  const sincronizarControles = () => {
    document.querySelectorAll('input[data-f]').forEach(inp => { inp.checked = e[inp.dataset.f].includes(inp.value); });
    document.querySelectorAll('[data-vista]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === e.vista)));
    if (buscador && buscador.value !== e.q) buscador.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
  };
  const textoTitulo = () => {
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.casa.length === 1) return Tienda.casas().find(c => c.id === e.casa[0])?.nombre || 'Catálogo';
    if (e.familia.length === 1) return nombreDe(FAMILIAS, e.familia[0]);
    return 'Catálogo de perfumes';
  };
  const pintarCabecera = () => {
    const t = textoTitulo();
    if (titulo) titulo.textContent = t;
    document.title = `${t} — Ab perfumes`;
    if (bajada) bajada.textContent = e.vista === 'frasco' ? 'Mirando precios de frasco original. Cada perfume también viene en decant de 5 y 10 ml.' : `Mirando precios de decant de ${e.vista} ml. Cambiá el tamaño cuando quieras, en cada fragancia o arriba.`;
    if (miga) {
      miga.textContent = t;
      const extra = document.getElementById('catMigaExtra');
      if (extra) extra.hidden = t === 'Catálogo de perfumes';
    }
    marcarNavActiva(e);
    if (activos) {
      const chips = [];
      ['cat', 'familia', 'para', 'casa'].forEach(k => e[k].forEach(v => chips.push({ k, v, n: (grupos[k].find(o => o.id === v) || {}).nombre })));
      if (e.q) chips.push({ k: 'q', v: e.q, n: `“${e.q}”` });
      activos.innerHTML = chips.map(c => `<button type="button" class="chip-activo" data-quitar="${c.k}" data-valor="${esc(c.v)}">${esc(c.n)}${ICONO_X}<span class="sr-only"> (quitar filtro)</span></button>`).join('') + (chips.length ? '<button type="button" class="link-limpiar" data-limpiar>Limpiar filtros</button>' : '');
      activos.hidden = !chips.length;
    }
  };
  const cargar = reiniciar => {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const total = Tienda.contar(filtros());
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, vista: e.vista, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardPara(p, e.vista, 'subir')).join(''));
    cursor = res.cursor;
    mostrados += res.items.length;
    if (contador) contador.textContent = `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
    if (pieTexto) pieTexto.textContent = total ? `Mostrando ${mostrados} de ${total}` : '';
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = total > 0;
    grid.hidden = total === 0;
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { pintarCabecera(); escribirEstadoURL(e); sincronizarControles(); cargar(true); };

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const k = inp.dataset.f;
    e[k] = inp.checked ? [...new Set([...e[k], inp.value])] : e[k].filter(v => v !== inp.value);
    aplicar();
  });
  document.querySelectorAll('[data-vista]').forEach(b => b.addEventListener('click', () => {
    e.vista = b.dataset.vista;
    if (e.orden.startsWith('precio')) { aplicar(); return; }
    pintarCabecera(); escribirEstadoURL(e); sincronizarControles();
    grid.querySelectorAll('.prod, .vcard').forEach(card => {
      const p = getProducto(card.dataset.id);
      if (p) actualizarCard(card, formatoParaVista(p, e.vista));
    });
  }));
  ordenSel?.addEventListener('change', () => { e.orden = ordenSel.value; aplicar(); });
  let t = 0;
  buscador?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  buscador?.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas?.addEventListener('click', () => cargar(false));
  document.addEventListener('click', ev => {
    const q = ev.target.closest('[data-quitar]');
    if (q) {
      const k = q.dataset.quitar;
      if (k === 'q') e.q = ''; else e[k] = e[k].filter(v => v !== q.dataset.valor);
      aplicar();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      e.cat = []; e.familia = []; e.para = []; e.casa = []; e.q = '';
      aplicar();
    }
  });
  const filtrosPanel = document.getElementById('filtros');
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', () => abrirPanel(filtrosPanel, b)));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrarPanel()));

  pintarCabecera();
  sincronizarControles();
  cargar(true);
  const params = new URLSearchParams(location.search);
  if (params.has('buscar') || params.has('q')) buscador?.focus({ preventScroll: true });
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li, .rotador'), { y: 14, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amt = parseFloat(el.dataset.parallax) || 4;
    gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
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

function initVistaRapidaDesdeURL() {
  if (PAGINA === 'catalogo') return;
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

initMega();
initDestacados();
initNovedades();
initCatalogo();
initReveals();
initNav();
initRotador();
initCalc();
initCardsEventos();
initCarrito();
initFloats();
updateCartBadge();
initHeroMotion();
initParallax();
initModelBarScroll();
initVistaRapidaDesdeURL();
