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

const WSP = '5493424349979';
const NEGOCIO = 'Distribuidora El Rebusque';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'promos', nombre: 'Promos para eventos', corto: 'Promos', bajada: 'Hamburguesas y panes en combos de 12 y de 24, con el precio armado.', img: 'images/promo-super-parrilleras.webp' },
  { id: 'pollo', nombre: 'Pollo supercongelado', corto: 'Pollo', bajada: 'Pata muslo, supremas y carne mecanizada, en la caja cerrada de fábrica.', img: 'images/p-supremas.webp' },
  { id: 'hamburguesas', nombre: 'Hamburguesas y panchos', corto: 'Hamburguesas', bajada: 'Medallones y parrilleras por caja, y salchichas para panchos.', img: 'images/p-medallones.webp' },
  { id: 'huevos', nombre: 'Huevos', corto: 'Huevos', bajada: 'Huevo blanco N°1 y N°3, de a dos maples.', img: 'images/cat-huevos.webp' },
  { id: 'pastas', nombre: 'Pastas Quiero', corto: 'Pastas', bajada: 'Fideos frescos, ñoquis, ravioles, sorrentinos y discos para empanadas.', img: 'images/p-fusilli.webp' },
  { id: 'panes', nombre: 'Panes y prepizzas', corto: 'Panes', bajada: 'Pan de hamburguesa, pan de molde, prepizzas y pan rallado.', img: 'images/p-pan-hamburguesa.webp' },
  { id: 'snacks', nombre: 'Snacks', corto: 'Snacks', bajada: 'Chizitos, bizcochos y grisines por kilo.', img: 'images/p-chizitos.webp' },
];
const FRIO = {
  super: { nombre: 'Supercongelado', corto: '−18 °C' },
  refri: { nombre: 'Refrigerado', corto: 'Refrigerado' },
  ambiente: { nombre: 'Seco', corto: 'Seco' },
};
const RANGOS = {
  hasta5: { nombre: 'Hasta $5.000', max: 5000 },
  '5a20': { nombre: '$5.000 a $20.000', min: 5001, max: 20000 },
  mas20: { nombre: 'Más de $20.000', min: 20001 },
};
const ORDENES = { destacados: 'Más pedidos', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const OP = (v, precio, cant = 0, u = '') => ({ v, precio, cant, u });

const PRODUCTOS = [
  { id: 'promo-finas', nombre: '12 hamburguesas finas + 12 panes El Abasto', marca: 'Burmit · El Abasto', cat: 'promos', frio: 'super', evento: true,
    ops: [OP('12 + 12', 9000, 12, 'u'), OP('24 + 24', 16000, 24, 'u')], descuento: 0, stock: 40, rango: 1,
    img: 'images/promo-finas.webp', flyer: 'images/promo-finas.webp', alt: 'Flyer de la promo de 12 hamburguesas finas Burmit y 12 panes El Abasto',
    desc: 'Hamburguesas finas Burmit con panes de hamburguesa El Abasto. Llevando 24 de cada uno, el combo sale $16.000.',
    tags: ['hamburguesa', 'pan', 'combo', 'evento', 'cumpleaños', 'burmit', 'abasto', 'finas'] },
  { id: 'promo-super-parrilleras', nombre: '12 hamburguesas súper parrilleras + 12 panes El Abasto', marca: 'Bursit · El Abasto', cat: 'promos', frio: 'super', evento: true,
    ops: [OP('12 + 12', 14000, 12, 'u'), OP('24 + 24', 25000, 24, 'u')], descuento: 0, stock: 40, rango: 2,
    img: 'images/promo-super-parrilleras.webp', flyer: 'images/promo-super-parrilleras.webp', alt: 'Flyer de la promo de 12 hamburguesas súper parrilleras Bursit y 12 panes El Abasto',
    desc: 'Hamburguesas súper parrilleras Bursit, gruesas para la parrilla, con panes El Abasto. Llevando 24 de cada uno, el combo sale $25.000.',
    tags: ['hamburguesa', 'pan', 'combo', 'evento', 'parrilla', 'bursit', 'abasto', 'parrilleras'] },
  { id: 'promo-hamburguesones', nombre: '12 hamburguesones + 12 panes de hamburguesón Quiero', marca: 'Quiero', cat: 'promos', frio: 'super', evento: true,
    ops: [OP('12 + 12', 19000, 12, 'u')], descuento: 0, stock: 25, rango: 3,
    img: 'images/promo-hamburguesones.webp', flyer: 'images/promo-hamburguesones.webp', alt: 'Flyer de la promo de 12 hamburguesones y 12 panes Quiero',
    desc: 'Hamburguesones grandes con los panes para súper hamburguesa de Quiero, del tamaño justo para el medallón.',
    tags: ['hamburguesa', 'hamburguesones', 'pan', 'combo', 'evento', 'quiero'] },
  { id: 'promo-cerdo', nombre: '12 hamburguesas de cerdo de 82 g + 12 panes El Abasto', marca: 'Burmit · El Abasto', cat: 'promos', frio: 'super', evento: true,
    ops: [OP('12 + 12', 12000, 12, 'u'), OP('24 + 24', 22000, 24, 'u')], descuento: 0, stock: 30, rango: 4,
    img: 'images/promo-cerdo.webp', flyer: 'images/promo-cerdo.webp', alt: 'Flyer de la promo de 12 hamburguesas de cerdo Burmit y 12 panes del Abasto',
    desc: 'Hamburguesas de cerdo Burmit de 82 g con panes El Abasto. Por 24 de cada uno, el combo sale $22.000.',
    tags: ['hamburguesa', 'cerdo', 'pan', 'combo', 'evento', 'burmit', 'abasto'] },
  { id: 'promo-premium', nombre: '12 hamburguesas premium Burmit + 12 panes El Abasto', marca: 'Burmit · El Abasto', cat: 'promos', frio: 'super', evento: true,
    ops: [OP('12 + 12', 18000, 12, 'u')], descuento: 0, stock: 20, rango: 5,
    img: 'images/promo-premium.webp', flyer: 'images/promo-premium.webp', alt: 'Flyer de la promo de 12 hamburguesas premium Burmit y 12 panes El Abasto',
    desc: 'Hamburguesas premium Burmit con panes El Abasto. Promo por tiempo limitado.',
    tags: ['hamburguesa', 'premium', 'pan', 'combo', 'evento', 'burmit', 'abasto'] },
  { id: 'pata-muslo', nombre: 'Pata muslo de pollo supercongelada', marca: '', cat: 'pollo', frio: 'super', evento: true,
    ops: [OP('Cajón de 15 kg', 43000, 15, 'kg')], descuento: 0, stock: 18, rango: 6,
    img: 'images/p-pata-muslo.webp', flyer: 'images/oferta-pata-muslo.webp', alt: 'Pata muslo de pollo cruda',
    desc: 'Pata muslo entera de pollo, supercongelada, en el cajón cerrado de 15 kg. Precio de oferta por cajón.',
    nota: 'Se entrega en la caja cerrada de fábrica: no fraccionamos supercongelados.',
    tags: ['pollo', 'pata', 'muslo', 'patamuslo', 'cajon', 'congelado', 'asado', 'parrilla'] },
  { id: 'supremas-soychu', nombre: 'Supremas de pollo Soychú', marca: 'Soychú', cat: 'pollo', frio: 'super',
    ops: [OP('Bolsa de 5 kg', 35000, 5, 'kg')], descuento: 0, stock: 22, rango: 7,
    img: 'images/p-supremas.webp', flyer: 'images/oferta-supremas.webp', alt: 'Caja abierta con supremas de pollo congeladas en bolsa',
    desc: 'Supremas de pollo marinadas y congeladas, en bolsa cerrada de 5 kg. Para milanesas, a la plancha o al horno.',
    nota: 'Se entrega en la bolsa cerrada de fábrica: no fraccionamos supercongelados.',
    tags: ['pollo', 'suprema', 'pechuga', 'milanesa', 'congelado', 'soychu'] },
  { id: 'medallones-burmit', nombre: 'Medallones de carne Burmit de 57 g', marca: 'Burmit', cat: 'hamburguesas', frio: 'super', evento: true,
    ops: [OP('Caja de 90 u.', 40000, 90, 'u')], descuento: 0, stock: 15, rango: 8,
    img: 'images/p-medallones.webp', alt: 'Caja abierta con medallones de carne apilados en bolsas',
    desc: 'Medallones de carne de 57 g, en caja cerrada de 90 unidades. Rinden para un evento grande o para el mostrador del local.',
    tags: ['hamburguesa', 'medallon', 'carne', 'caja', 'burmit', 'evento'] },
  { id: 'parrilleras-bursit', nombre: 'Hamburguesas parrilleras Bursit', marca: 'Bursit', cat: 'hamburguesas', frio: 'super', evento: true,
    ops: [OP('Caja de 36 u.', 25000, 36, 'u'), OP('Caja de 60 u.', 45000, 60, 'u')], descuento: 0, stock: 14, rango: 9,
    img: 'images/p-hamburguesas-parrilleras.webp', alt: 'Pila de hamburguesas crudas junto a panes',
    desc: 'Hamburguesas parrilleras Bursit, gruesas para la parrilla o la plancha. En caja cerrada de 36 o de 60 unidades.',
    tags: ['hamburguesa', 'parrilla', 'parrilleras', 'caja', 'bursit', 'evento'] },
  { id: 'huevo-blanco', nombre: 'Huevo blanco', marca: '', cat: 'huevos', frio: 'ambiente',
    ops: [OP('N°3 mediano · 2 maples', 9200, 60, 'u'), OP('N°1 grande · 2 maples', 11000, 60, 'u')], descuento: 0, stock: 30, rango: 10,
    img: 'images/p-huevo-blanco.webp', flyer: 'images/oferta-huevos.webp', alt: 'Huevos blancos en un maple de cartón',
    desc: 'Huevo blanco fresco, de a dos maples de 30 (60 huevos). El N°1 es el tamaño grande; el N°3, el mediano.',
    tags: ['huevo', 'huevos', 'maple', 'blanco', 'docena', 'avicola'] },
  { id: 'fusilli-quiero', nombre: 'Fideos frescos fusilli Quiero', marca: 'Pastas Quiero', cat: 'pastas', frio: 'refri',
    ops: [OP('Paquete de 500 g', 1900, 0.5, 'kg')], descuento: 0, stock: 60, rango: 11,
    img: 'images/p-fusilli.webp', alt: 'Bolsa transparente llena de fideos fusilli',
    desc: 'Fusilli frescos de Pastas Quiero, listos en 10 minutos. Paquete de 500 g.',
    tags: ['fideos', 'fusilli', 'tirabuzon', 'pasta', 'fresca', 'quiero'] },
  { id: 'carne-mecanizada', nombre: 'Carne mecanizada de pollo', marca: '', cat: 'pollo', frio: 'super',
    ops: [OP('Bloque de 10 kg', 32000, 10, 'kg')], descuento: 0, stock: 10, rango: 12,
    img: 'images/p-carne-mecanizada.webp', alt: 'Carne picada en un bol de vidrio',
    desc: 'Carne mecanizada en bloque supercongelado de 10 kg, para elaborar hamburguesas, albóndigas y rellenos.',
    nota: 'Se entrega en el bloque cerrado de fábrica: no fraccionamos supercongelados.',
    tags: ['carne', 'mecanizada', 'pollo', 'bloque', 'congelado', 'elaboracion', 'hamburguesas'] },
  { id: 'salchichas-don-otto', nombre: 'Salchichas cocidas sin piel Don Otto', marca: 'Don Otto', cat: 'hamburguesas', frio: 'refri', evento: true,
    ops: [OP('Paquete de 6 (190 g)', 1100, 6, 'u')], descuento: 0, stock: 80, rango: 13,
    img: 'images/p-salchichas.webp', alt: 'Dos salchichas sobre hielo',
    desc: 'Salchichas cocidas sin piel, listas para panchos y súper panchos. Paquete de 6 unidades, 190 g.',
    tags: ['salchicha', 'salchichas', 'pancho', 'panchos', 'viena', 'don otto', 'evento'] },
  { id: 'ravioles-quiero', nombre: 'Ravioles de carne con espinaca Quiero', marca: 'Pastas Quiero', cat: 'pastas', frio: 'refri',
    ops: [OP('Paquete', 2600)], descuento: 0, stock: 40, rango: 14,
    img: 'images/p-ravioles.webp', alt: 'Ravioles frescos sobre una tabla enharinada',
    desc: 'Ravioles de carne con espinaca de Pastas Quiero. Caseros, rendidores y listos en minutos.',
    tags: ['ravioles', 'pasta', 'rellena', 'carne', 'espinaca', 'quiero'] },
  { id: 'sorrentinos-quiero', nombre: 'Sorrentinos de jamón y queso Quiero', marca: 'Pastas Quiero', cat: 'pastas', frio: 'refri',
    ops: [OP('Paquete', 3600)], descuento: 0, stock: 35, rango: 15,
    img: 'images/p-sorrentinos.webp', alt: 'Pasta rellena redonda sobre una tabla enharinada',
    desc: 'Sorrentinos rellenos de jamón y queso, de Pastas Quiero.',
    tags: ['sorrentinos', 'pasta', 'rellena', 'jamon', 'queso', 'quiero'] },
  { id: 'chizitos-pena', nombre: 'Chizitos Copetín Peña', marca: 'Copetín Peña', cat: 'snacks', frio: 'ambiente', evento: true,
    ops: [OP('Bolsa de 1 kg', 5500, 1, 'kg')], descuento: 0, stock: 50, rango: 16,
    img: 'images/p-chizitos.webp', alt: 'Bolsa grande de chizitos junto a una bolsa de papas fritas',
    desc: 'Chizitos en bolsa de 1 kg, para la picada del evento o para fraccionar en el kiosco.',
    nota: 'La bolsa de papas de la foto no está incluida.',
    tags: ['chizitos', 'snack', 'picada', 'cumpleaños', 'kiosco', 'pena'] },
  { id: 'noquis-quiero', nombre: 'Ñoquis de sémola Quiero', marca: 'Pastas Quiero', cat: 'pastas', frio: 'refri',
    ops: [OP('Paquete', 1900)], descuento: 0, stock: 45,
    img: 'images/p-noquis.webp', alt: 'Ñoquis crudos sobre una mesa enharinada',
    desc: 'Ñoquis de sémola de Pastas Quiero. Para el 29 o para cualquier día de la semana.',
    tags: ['noquis', 'ñoquis', 'pasta', 'semola', 'quiero', '29'] },
  { id: 'discos-empanadas-quiero', nombre: 'Discos criollos para empanadas Quiero', marca: 'Pastas Quiero', cat: 'pastas', frio: 'refri', evento: true,
    ops: [OP('5 paquetes', 6000, 5, 'paq'), OP('10 paquetes', 11000, 10, 'paq')], descuento: 0, stock: 40,
    img: 'images/p-discos-empanadas.webp', alt: 'Empanadas crudas repulgadas sobre una bandeja enharinada',
    desc: 'Masa criolla tradicional para empanadas, al horno o para freír. Llevando 10 paquetes, cada uno sale $1.100.',
    tags: ['tapas', 'discos', 'empanadas', 'masa', 'horno', 'freir', 'quiero', 'evento'] },
  { id: 'pan-hamburguesa-abasto', nombre: 'Pan de hamburguesa El Abasto', marca: 'El Abasto', cat: 'panes', frio: 'ambiente', evento: true,
    ops: [OP('Paquete de 12', 3600, 12, 'u')], descuento: 0, stock: 50,
    img: 'images/p-pan-hamburguesa.webp', alt: 'Bolsa con doce panes de hamburguesa con sésamo',
    desc: 'Panes de hamburguesa con sésamo, en bolsa de 12. Los mismos de las promos con hamburguesas.',
    tags: ['pan', 'panes', 'hamburguesa', 'sesamo', 'abasto', 'evento'] },
  { id: 'prepizzas', nombre: 'Prepizzas', marca: '', cat: 'panes', frio: 'ambiente', evento: true,
    ops: [OP('Paquete de 2', 1900, 2, 'u'), OP('Bulto de 10 paquetes', 17500, 10, 'paq')], descuento: 0, stock: 30,
    img: 'images/p-prepizzas.webp', alt: 'Pila de prepizzas en una bolsa transparente',
    desc: 'Prepizzas listas para cubrir y hornear. Por paquete o por bulto de 10 paquetes, para la pizzería o el evento.',
    tags: ['prepizza', 'pizza', 'masa', 'bulto', 'evento'] },
  { id: 'pan-mil-semillas-quiero', nombre: 'Pan Quiero Mil Semillas', marca: 'Quiero', cat: 'panes', frio: 'ambiente', nuevo: true,
    ops: [OP('Paquete de 400 g', 2900, 0.4, 'kg')], descuento: 0, stock: 24,
    img: 'images/p-pan-semillas.webp', alt: 'Pan con semillas cortado en rodajas',
    desc: 'Pan de molde con semillas, de Quiero. Paquete de 400 g.',
    tags: ['pan', 'molde', 'semillas', 'integral', 'quiero', 'nuevo'] },
  { id: 'pan-rallado', nombre: 'Pan rallado', marca: '', cat: 'panes', frio: 'ambiente',
    ops: [OP('Bolsa de 15 kg', 23500, 15, 'kg')], descuento: 0, stock: 12,
    img: 'images/p-pan-rallado.webp', alt: 'Pan rallado visto de cerca',
    desc: 'Pan rallado para milanesas y rebozados, en bolsa de 15 kg: la presentación para rotiserías y cocinas.',
    tags: ['pan rallado', 'rebozador', 'milanesas', 'bolsa', 'rotiseria'] },
  { id: 'bizcochos-abasto', nombre: 'Bizcochos El Abasto', marca: 'El Abasto', cat: 'snacks', frio: 'ambiente',
    ops: [OP('Bolsa de 1 kg', 6800, 1, 'kg')], descuento: 0, stock: 30,
    img: 'images/p-bizcochos.webp', alt: 'Bizcochos redondos apilados',
    desc: 'Bizcochos crujientes en bolsa de 1 kg, para el mate o para fraccionar.',
    tags: ['bizcochos', 'galletitas', 'mate', 'abasto', 'kilo'] },
  { id: 'grisines-abasto', nombre: 'Grisines El Abasto', marca: 'El Abasto', cat: 'snacks', frio: 'ambiente', evento: true,
    ops: [OP('Bolsa de 1 kg', 6800, 1, 'kg')], descuento: 0, stock: 30,
    img: 'images/p-grisines.webp', alt: 'Grisines con semillas en un vaso',
    desc: 'Grisines naturales en bolsa de 1 kg, para la picada o la panera.',
    tags: ['grisines', 'palitos', 'picada', 'abasto', 'kilo', 'evento'] },
  { id: 'pan-dulce-quiero', nombre: 'Pan dulce Quiero premium', marca: 'Quiero', cat: 'panes', frio: 'ambiente', visible: false,
    ops: [OP('400 g', 4000)], descuento: 0, stock: 0,
    img: 'images/p-pan-semillas.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), frio = lista(f.frio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (frio.length && !frio.includes(p.frio)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.evento && !p.evento) return false;
    if (f.conFlyer === true && !p.flyer) return false;
    if (f.conFlyer === false && p.flyer) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, p.marca, cat?.nombre, p.desc, FRIO[p.frio]?.nombre,
      ...p.ops.map(op => op.v), ...(p.tags || []), p.evento ? 'eventos fiesta' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
      if (palabras.every(w => textoDe(p).includes(w))) {
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
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];

const Cart = {
  KEY: 'distribuidoraelrebusque_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  caja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>',
  copo: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20"/><path d="m4.9 7 14.2 10"/><path d="m4.9 17 14.2-10"/><path d="m9 4 3 2 3-2"/><path d="m9 20 3-2 3 2"/></svg>',
  ubicacion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
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

const unidadTxt = op => (op.u === 'kg' ? 'el kg' : op.u === 'paq' ? 'c/paquete' : 'c/u');
const unitTxt = (p, op) => (op.cant && op.cant !== 1 ? `${formatearPrecio(precioOp(p, op) / op.cant)} ${unidadTxt(op)}` : '');
function mejorUnit(p) {
  const con = p.ops.filter(op => op.cant && op.cant !== 1);
  if (!con.length) return null;
  const m = con.reduce((a, b) => (precioOp(p, b) / b.cant < precioOp(p, a) / a.cant ? b : a));
  if (con.length === 1 && p.ops.length === 1) return { base: unitTxt(p, m), det: '' };
  return { base: unitTxt(p, m), det: ` llevando ${m.v.toLowerCase()}` };
}
const resumenVar = p => p.ops.map(op => op.v).join(' · ');
const metaDe = p => p.marca || CATEGORIAS.find(c => c.id === p.cat)?.corto || '';
const frioBadge = p => (p.frio === 'super' ? `<span class="badge badge--frio">${ICO.copo}−18 °C</span>` : p.frio === 'refri' ? '<span class="badge badge--refri">Refrigerado</span>' : '');
const stepperHTML = () => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function cardHTML(p, { anim = true, promo = false } = {}) {
  const varias = p.ops.length > 1 && new Set(p.ops.map(op => op.precio)).size > 1;
  const base = Math.min(...p.ops.map(op => op.precio));
  const tags = [];
  if (p.descuento > 0) tags.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (promo && p.cat !== 'promos') tags.push('<span class="badge badge--oferta">Oferta</span>');
  else if (!promo) { const f = frioBadge(p); if (f) tags.push(f); }
  if (p.nuevo) tags.push('<span class="badge">Nuevo</span>');
  else if (p.stock > 0 && p.stock <= 3) tags.push('<span class="badge">Últimas unidades</span>');
  const unit = mejorUnit(p);
  const sinStock = !(p.stock > 0);
  const img = promo && p.flyer ? p.flyer : p.img;
  const clase = `pcard${p.cat === 'promos' || promo ? ' pcard--promo' : ''}${promo ? ' pcard--flyer' : ''}`;
  return `<article class="${clase}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(img)}" alt="${esc(promo && p.flyer ? `Flyer: ${p.nombre}` : p.alt)}" width="800" height="${promo ? 1000 : 800}"></div>
    ${tags.length ? `<div class="pcard__tags">${tags.slice(0, 2).join('')}</div>` : ''}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__var">${esc(resumenVar(p))}</p>
    <p class="pcard__precio">${varias ? '<span class="desde">desde</span>' : ''}<span>${formatearPrecio(precioDesde(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}${unit ? `<span class="pcard__unit">${esc(unit.base)}${unit.det ? `<span class="pcard__unit-det">${esc(unit.det)}</span>` : ''}</span>` : ''}</p>
    <div class="prod-actions">
      ${stepperHTML()}
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
</article>`;
}

const precioFilaHTML = (p, op) => `<b>${formatearPrecio(precioOp(p, op))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}${unitTxt(p, op) ? `<small>${esc(unitTxt(p, op))}</small>` : ''}`;
function filaHTML(p, { anim = true } = {}) {
  const sinStock = !(p.stock > 0);
  const op = p.ops[0];
  const pres = p.ops.length > 1
    ? `<label class="fila__pres"><span class="sr-only">Presentación de ${esc(p.nombre)}</span><select data-fila-op>${p.ops.map((o, i) => `<option value="${i}">${esc(o.v)} · ${formatearPrecio(precioOp(p, o))}</option>`).join('')}</select></label>`
    : `<span class="fila__una">${esc(op.v)}</span>`;
  const frio = FRIO[p.frio];
  return `<article class="fila fila--${esc(p.frio)}" data-id="${esc(p.id)}"${anim ? ' data-animate="izq" style="opacity:0;transform:translateX(-40px)"' : ''}>
  <button type="button" class="fila__foto" data-quick="${esc(p.id)}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="160" height="160"></button>
  <div class="fila__info">
    <p class="fila__meta"><span class="fila__frio">${p.frio === 'super' ? ICO.copo : ''}${esc(frio?.nombre || '')}</span>${esc(metaDe(p))}</p>
    <h3 class="fila__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a>${p.nuevo ? '<span class="fila__badge">Nuevo</span>' : ''}</h3>
    ${pres}
  </div>
  <div class="fila__precio" data-fila-precio>${precioFilaHTML(p, op)}</div>
  <div class="fila__acc">
    ${stepperHTML()}
    <button type="button" class="fila__add" data-fila-add aria-label="${sinStock ? 'Sin stock' : 'Sumar al pedido'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.mas}<span>${sinStock ? 'Sin stock' : 'Sumar'}</span></button>
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
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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

function initCatsMenu(catActual = '') {
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    const lista = box.querySelector('[data-cats-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    lista.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    function cerrar() { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-n-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.nCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { conFlyer: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false, promo: true })}</div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initFolleto() {
  const cont = document.querySelector('[data-folleto]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { conFlyer: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => `<div class="folleto__item${i === 0 ? ' folleto__item--grande' : ''}" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">${cardHTML(p, { anim: false, promo: true })}</div>`).join('');
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { conFlyer: false }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initListaHome() {
  const cont = document.querySelector('[data-lista-home]');
  if (!cont) return;
  const tabs = [...document.querySelectorAll('[data-lista-tab]')];
  const todo = document.querySelector('[data-lista-todo]');
  const resto = document.querySelector('[data-lista-resto]');
  const pintar = cat => {
    const filtros = cat ? { cat } : { conFlyer: false };
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: 8 });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => filaHTML(p)).join('');
    const n = Tienda.contar(cat ? filtros : {});
    const c = CATEGORIAS.find(x => x.id === cat);
    if (todo) {
      todo.href = `${URL_CATALOGO}${cat ? '?cat=' + cat : ''}`;
      const t = todo.querySelector('span');
      if (t) t.textContent = c ? `Ver toda la lista de ${c.corto.toLowerCase()}` : 'Ver la lista completa';
    }
    if (resto) resto.textContent = n > items.length ? `Mostrando ${items.length} de ${n} productos.` : `${n} ${n === 1 ? 'producto' : 'productos'} en ${c ? c.corto.toLowerCase() : 'la lista'}.`;
    revelarNuevos(cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.listaTab || '');
  }));
  pintar('');
}

function cerrarPickers() {
  document.querySelectorAll('.picker').forEach(pk => pk.remove());
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = 'Elegí la presentación';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v)}${unitTxt(p, op) ? `<small>${esc(unitTxt(p, op))}</small>` : ''}</span><b>${formatearPrecio(precioOp(p, op))}</b></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

function sumarAlCarrito(p, qty, v, comprar) {
  Cart.add(p, qty, v);
  const op = opDe(p, v);
  const detalle = p.ops.length > 1 ? ` (${op.v})` : '';
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${detalle} al pedido`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const item = step.closest('.pcard, .fila');
      const p = item ? getProducto(item.dataset.id) : null;
      const max = p?.stock || 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const fadd = e.target.closest('[data-fila-add]');
    if (fadd) {
      const fila = fadd.closest('.fila');
      const p = getProducto(fila?.dataset.id);
      if (!p) return;
      const op = p.ops[Number(fila.querySelector('[data-fila-op]')?.value || 0)] || p.ops[0];
      const n = fila.querySelector('[data-qty]');
      sumarAlCarrito(p, parseInt(n?.textContent, 10) || 1, op.v, false);
      if (n) n.textContent = '1';
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
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
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-fila-op]');
    if (!sel) return;
    const fila = sel.closest('.fila');
    const p = getProducto(fila?.dataset.id);
    const box = fila?.querySelector('[data-fila-precio]');
    if (p && box) box.innerHTML = precioFilaHTML(p, p.ops[Number(sel.value)] || p.ops[0]);
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
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1, foto: 0 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = 0; qvEstado.qty = 1; qvEstado.foto = 0;
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(op => precioOp(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const fotos = [{ src: p.img, alt: p.alt, tipo: p.cat === 'promos' ? 'flyer' : 'foto' }];
  if (p.flyer && p.flyer !== p.img) fotos.push({ src: p.flyer, alt: `Flyer de la oferta: ${p.nombre}`, tipo: 'flyer' });
  const f = fotos[qvEstado.foto] || fotos[0];
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  const frio = FRIO[p.frio];
  const unit = unitTxt(p, op);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__media qv__media--${f.tipo}"><img src="${esc(f.src)}" alt="${esc(f.alt)}" width="800" height="${f.tipo === 'flyer' ? 1000 : 800}"></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((x, i) => `<button type="button" class="qv__thumb" data-qv-foto="${i}" aria-pressed="${i === qvEstado.foto}" aria-label="${i ? 'Ver el flyer de la oferta' : 'Ver la foto del producto'}"><img src="${esc(x.src)}" alt="" width="120" height="120"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span>${formatearPrecio(precioOp(p, op))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}${unit ? `<small>${esc(unit)}</small>` : ''}</p>
      ${p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">Elegí la presentación</p><div class="qv__ops" role="radiogroup" aria-label="Elegí la presentación">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b><span>${formatearPrecio(precioOp(p, o))}${unitTxt(p, o) ? ` · ${esc(unitTxt(p, o))}` : ''}</span></button>`).join('')}</div></div>` : `<p class="qv__pres">${esc(op.v)}</p>`}
      <p class="qv__frio qv__frio--${esc(p.frio)}">${p.frio === 'super' ? ICO.copo : ICO.caja}<span><b>${esc(frio?.nombre || '')}</b>${p.frio === 'super' ? ' · se conserva a −18 °C, en caja cerrada' : p.frio === 'refri' ? ' · conservar en heladera' : ' · se conserva en lugar fresco y seco'}</span></p>
      <p class="qv__stock">${ICO.check}${esc(stock)} · entrega o retiro a coordinar</p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${p.stock > 0 ? '' : ' disabled'}>${ICO.carrito}Agregar al pedido</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.nota ? `<p class="qv__nota">${ICO.info}<span>${esc(p.nota)}</span></p>` : ''}
      <a class="qv__wsp" href="${wspLink(`Hola ${NEGOCIO}! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}¿Dudas? Preguntanos por WhatsApp</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (document.getElementById('cartDrawer')?.hidden !== false) document.body.classList.remove('no-scroll');
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
    const fotoBtn = e.target.closest('[data-qv-foto]');
    if (fotoBtn) {
      qvEstado.foto = Number(fotoBtn.dataset.qvFoto);
      pintarQV();
      qv.querySelector(`[data-qv-foto="${qvEstado.foto}"]`)?.focus();
      return;
    }
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const comprar = add.hasAttribute('data-qv-comprar');
      Cart.add(p, qvEstado.qty, p.ops[qvEstado.op].v);
      if (comprar) { cerrarQV(); abrirCarrito(); }
      else showToast(`Sumaste ${qvEstado.qty > 1 ? qvEstado.qty + ' × ' : ''}${p.nombre}${p.ops.length > 1 ? ` (${p.ops[qvEstado.op].v})` : ''} al pedido`);
    }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

function itemsCarrito() { return Cart.get().filter(i => getProducto(i.id)); }
function mensajePedido() {
  const lineas = itemsCarrito().map(i => {
    const p = getProducto(i.id); const op = opDe(p, i.v);
    return `- ${i.qty} × ${p.nombre}${p.ops.length > 1 || op.v !== 'Paquete' ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * i.qty)}`;
  }).join('\n');
  return `Hola ${NEGOCIO}! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos la entrega?`;
}
function lineasHTML(items) {
  return `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="56" height="56">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(op.v)} · ${formatearPrecio(precioOp(p, op))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
}
function pieHTML() {
  const hayFrio = itemsCarrito().some(i => getProducto(i.id)?.frio === 'super');
  return `<p class="total-fila"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="nota-entrega">${hayFrio ? ICO.copo : ICO.ubicacion}${hayFrio ? 'Los supercongelados van en su caja cerrada. Entrega o retiro a coordinar' : 'Entrega o retiro a coordinar por WhatsApp'}</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(mensajePedido())}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function manejarLineas(e, cont, alQuitar) {
  if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
  const linea = e.target.closest('[data-linea]');
  if (!linea) return;
  const id = linea.dataset.linea, v = linea.dataset.v;
  const step = e.target.closest('[data-linea-step]');
  if (step) {
    const it = Cart.get().find(i => i.id === id && i.v === v);
    if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
    [...cont.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest('[data-linea-quitar]')) {
    Cart.remove(id, v);
    alQuitar?.();
  }
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
  const items = itemsCarrito();
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.caja}<p class="cart-vacio__tit">Tu pedido está vacío</p><p>Sumá las promos para tu evento o lo que necesitás reponer en el local.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = lineasHTML(items);
  foot.innerHTML = pieHTML();
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    manejarLineas(e, dr, () => dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true }));
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function initPedido() {
  const panel = document.querySelector('[data-pedido]');
  if (!panel) return;
  const lineas = panel.querySelector('[data-pedido-lineas]');
  const pie = panel.querySelector('[data-pedido-pie]');
  const n = panel.querySelector('[data-pedido-n]');
  const render = () => {
    const items = itemsCarrito();
    if (n) n.textContent = items.length ? `${Cart.count()} ${Cart.count() === 1 ? 'bulto' : 'bultos'}` : 'Vacío';
    if (!items.length) {
      lineas.innerHTML = '<div class="pedido__vacio"><b>Todavía no sumaste nada</b><span>Elegí la presentación, la cantidad y tocá «Sumar»: el pedido se arma acá.</span></div>';
      pie.hidden = true;
      return;
    }
    lineas.innerHTML = lineasHTML(items);
    pie.innerHTML = pieHTML();
    pie.hidden = false;
  };
  panel.addEventListener('click', e => manejarLineas(e, panel, () => panel.querySelector('.pedido__head')?.focus?.()));
  document.addEventListener('cart:updated', render);
  render();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = n ? formatearPrecio(Cart.total()) : 'Tu pedido'; });
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

function combinar(p, n) {
  const ops = p.ops.filter(op => op.cant > 0).sort((a, b) => b.cant - a.cant);
  const grande = ops[0];
  const chica = ops[ops.length - 1];
  let mejor = null;
  for (let g = 0; g <= Math.ceil(n / grande.cant); g++) {
    const faltan = Math.max(0, n - g * grande.cant);
    const c = grande === chica ? 0 : Math.ceil(faltan / chica.cant);
    if (grande === chica && faltan > 0) continue;
    const total = g * precioOp(p, grande) + c * precioOp(p, chica);
    const unidades = g * grande.cant + c * chica.cant;
    if (!mejor || total < mejor.total || (total === mejor.total && unidades < mejor.unidades)) mejor = { g, c, total, unidades, grande, chica };
  }
  return mejor;
}
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
function initEvento() {
  const box = document.querySelector('[data-evento]');
  if (!box) return;
  const rango = box.querySelector('#evInvitados');
  const salida = box.querySelector('[data-ev-invitados]');
  const total = box.querySelector('[data-ev-total]');
  const detalle = box.querySelector('[data-ev-detalle]');
  const combo = box.querySelector('[data-ev-combo]');
  const sobra = box.querySelector('[data-ev-sobra]');
  const btn = box.querySelector('[data-ev-add]');
  const opciones = box.querySelector('[data-ev-promos]');
  if (!rango || !btn || !opciones) return;
  const { items: promos } = Tienda.consultar({ filtros: { cat: 'promos' }, orden: 'destacados', limite: 8 });
  promos.forEach(cachear);
  opciones.innerHTML = promos.map((p, i) => `<label class="ev__promo"><input type="radio" name="ev-promo" value="${esc(p.id)}"${i === 1 ? ' checked' : ''}><span><b>${esc(p.nombre.replace(/ \+ 12 panes.*$/, '').replace(/^12 /, ''))}</b><small>${esc(p.ops.map(op => `${op.v}: ${formatearPrecio(precioOp(p, op))}`).join(' · '))}</small></span></label>`).join('');
  let plan = null;
  const pintar = () => {
    const inv = Number(rango.value);
    const porPersona = Number(box.querySelector('input[name="ev-por"]:checked')?.value || 2);
    const p = getProducto(box.querySelector('input[name="ev-promo"]:checked')?.value || promos[0]?.id);
    if (!p) return;
    const n = inv * porPersona;
    plan = { p, ...combinar(p, n) };
    salida.textContent = `${inv} invitados`;
    total.textContent = formatearPrecio(plan.total);
    detalle.textContent = `Para ${inv} invitados a ${plural(porPersona, 'hamburguesa', 'hamburguesas')} cada uno necesitás ${n} hamburguesas y ${n} panes.`;
    const partes = [];
    if (plan.g) partes.push(`${plural(plan.g, 'promo', 'promos')} de ${plan.grande.v}`);
    if (plan.c) partes.push(`${plural(plan.c, 'promo', 'promos')} de ${plan.chica.v}`);
    combo.textContent = `Te conviene: ${partes.join(' y ')}.`;
    const extra = plan.unidades - n;
    sobra.textContent = extra > 0 ? `Llevás ${plan.unidades} de cada uno: te sobran ${extra} por si alguien repite.` : `Llevás ${plan.unidades} de cada uno, justo lo que necesitás.`;
    btn.textContent = `Sumar al pedido · ${formatearPrecio(plan.total)}`;
  };
  box.addEventListener('change', pintar);
  rango.addEventListener('input', pintar);
  btn.addEventListener('click', () => {
    if (!plan) return;
    if (plan.g) Cart.add(plan.p, plan.g, plan.grande.v);
    if (plan.c) Cart.add(plan.p, plan.c, plan.chica.v);
    showToast(`Sumaste ${plan.g + plan.c} ${plan.g + plan.c === 1 ? 'promo' : 'promos'} para el evento al pedido`);
  });
  pintar();
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-31.6333, -60.7];
    const tactil = window.matchMedia('(pointer: coarse)').matches;
    const map = L.map(el, { center: centro, zoom: 13, scrollWheelZoom: false, dragging: !tactil, tap: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
    const icon = L.divIcon({ className: 'pin-caja', html: '<span></span>', iconSize: [28, 28], iconAnchor: [14, 14] });
    L.marker(centro, { icon, keyboard: false, title: NEGOCIO }).addTo(map);
    window.addEventListener('load', () => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 1600);
  } catch (e) { console.warn(e); }
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const vista = grid.dataset.vista === 'lista' ? 'lista' : 'grilla';
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(params.get('cat'), catIds),
    frio: valido(params.get('frio'), FRIO),
    precio: valido(params.get('precio'), RANGOS),
    evento: params.get('evento') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const tituloEl = document.querySelector('[data-cat-titulo]');
  const tituloBase = tituloEl?.dataset.base || 'Todo el catálogo';

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todo', corto: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.corto)} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas')}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-frio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos'], ...Object.entries(FRIO).map(([k, v]) => [k, v.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-frio" value="${k}" data-filtro="frio"><span>${esc(n)}</span><span class="opt__n" data-cuenta-frio="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('select[data-filtro="frio"]').forEach(s => { s.innerHTML = `<option value="">Toda conservación</option>${Object.entries(FRIO).map(([k, v]) => `<option value="${k}">${esc(v.nombre)}</option>`).join('')}`; });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  document.querySelectorAll('select[data-filtro="precio"]').forEach(s => { s.innerHTML = `<option value="">Cualquier precio</option>${Object.entries(RANGOS).map(([k, r]) => `<option value="${k}">${esc(r.nombre)}</option>`).join('')}`; });

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.frio && sin !== 'frio') f.frio = estado.frio;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.evento && sin !== 'evento') f.evento = true;
    return f;
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === estado[f];
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f]));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-cat]').forEach(el => { const id = el.dataset.cuentaCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-frio]').forEach(el => { const id = el.dataset.cuentaFrio; el.textContent = Tienda.contar({ ...filtrosDe('frio'), ...(id ? { frio: id } : {}) }); });
    const activos = ['cat', 'frio', 'precio'].filter(k => estado[k]).length + (estado.evento ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const frio = FRIO[estado.frio];
    const titulo = cat ? `${cat.nombre}${frio ? ` · ${frio.nombre}` : ''}` : frio ? frio.nombre : estado.evento ? 'Para eventos' : tituloBase;
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Pastas y panes Quiero, huevos, pollo y hamburguesas supercongeladas, panchos, snacks y promos para eventos.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !frio && !estado.evento; miga.textContent = titulo; }
    document.title = `${titulo} — ${NEGOCIO}`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'frio', 'precio', 'q', 'orden', 'evento', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.frio) u.searchParams.set('frio', estado.frio);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.evento) u.searchParams.set('evento', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
    const sp = new URLSearchParams(u.search); sp.delete('producto');
    document.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => { a.href = a.getAttribute('href').split('?')[0] + (sp.toString() ? `?${sp}` : ''); });
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (vista === 'lista' ? filaHTML(p) : cardHTML(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) { estado[b.dataset.filtro] = b.dataset.valor || ''; aplicar(); return; }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.frio = ''; estado.precio = ''; estado.evento = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (params.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn, .buscador-grande', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero__nota, .buscador-sugeridos', { y: 14, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
  paso('.sello', { scale: 0.92, rotate: -24, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.75);
  paso('.etiqueta-wrap', { y: 46, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.35);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-6 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initCuentas,
  initRail,
  initFolleto,
  initPreview,
  initListaHome,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initPedido,
  initFloats,
  initEvento,
  initMapa,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
