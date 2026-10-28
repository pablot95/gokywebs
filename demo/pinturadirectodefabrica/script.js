const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491163592586';
const MARCA = 'Pintura Directo de Fábrica';
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
  { id: 'latex', nombre: 'Látex', bajada: 'Interior, exterior, premium y lavables.', img: 'images/p-latex-interior.webp',
    texto: 'Látex acrílico para interior y exterior, premium, superlavable y ultralavable, de 1 a 20 litros y en más de 400 colores.' },
  { id: 'esmaltes', nombre: 'Esmaltes sintéticos', bajada: 'Para metal y madera, brillante o satinado.', img: 'images/p-esmalte-brillante.webp',
    texto: 'Esmalte sintético brillante y satinado para rejas, puertas, aberturas y muebles, en la carta de colores.' },
  { id: 'membranas', nombre: 'Membranas', bajada: 'Techos y terrazas sin filtraciones.', img: 'images/p-membrana-techos.webp',
    texto: 'Membranas líquidas para impermeabilizar techos, terrazas y medianeras.' },
  { id: 'pisos', nombre: 'Pisos y piscinas', bajada: 'Alto tránsito, piscinas y demarcación.', img: 'images/p-piscinas.webp',
    texto: 'Pintura para piscinas, pintura de alto tránsito para pisos y pintura termoplástica para demarcar.' },
  { id: 'maderas', nombre: 'Barniz marino', bajada: 'Maderas al exterior, protegidas.', img: 'images/p-barniz.webp',
    texto: 'Barniz marino para proteger aberturas, decks y muebles de madera al exterior.' },
  { id: 'preparacion', nombre: 'Masilla y fijador', bajada: 'Para preparar la pared antes de pintar.', img: 'images/p-masilla.webp',
    texto: 'Masilla para emparejar y fijador sellador para que la pintura agarre y rinda más.' },
];
const USOS = [
  { id: 'interior', nombre: 'Interiores' }, { id: 'exterior', nombre: 'Exteriores' }, { id: 'techos', nombre: 'Techos y terrazas' },
  { id: 'pisos', nombre: 'Pisos' }, { id: 'piscinas', nombre: 'Piscinas' }, { id: 'metal', nombre: 'Metal' }, { id: 'madera', nombre: 'Madera' },
];
const PRESENTACIONES = ['0,5 L', '1 L', '4 L', '10 L', '20 L', '1 kg', '4 kg', '10 kg', '25 kg'];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Desde menos de $10.000', min: null, max: 10000 },
  { id: '10a25', nombre: 'Desde $10.000 a $25.000', min: 10001, max: 25000 },
  { id: 'mas25', nombre: 'Desde más de $25.000', min: 25001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  latex: 'latex pintura pared paredes acrilico', esmaltes: 'esmalte sintetico rejas puertas aberturas hierro',
  membranas: 'membrana impermeabilizante techo filtraciones humedad', pisos: 'piso pisos piscina pileta demarcacion',
  maderas: 'barniz madera deck', preparacion: 'masilla enduido fijador sellador preparacion',
  interior: 'interior adentro dormitorio living cocina', exterior: 'exterior frente afuera fachada',
  techos: 'techo techos terraza azotea', pisos_uso: 'garage cochera vereda', piscinas: 'pileta piletas piscina',
  metal: 'metal hierro rejas', madera: 'madera puertas muebles',
};
const L4 = (a, b, c, d) => [{ id: '1l', n: '1 L', precio: a }, { id: '4l', n: '4 L', precio: b }, { id: '10l', n: '10 L', precio: c }, { id: '20l', n: '20 L', precio: d }];

const Tienda = crearTienda([
  { id: 'latex-interior', nombre: 'Látex acrílico interior', cat: 'latex', uso: ['interior'], ops: L4(6900, 21500, 46900, 84900), colores: 'carta',
    descuento: 0, stock: 40, rango: 1, tag: 'Más pedido', img: 'images/p-latex-interior.webp',
    alt: 'Balde de látex blanco abierto con la tapa verde agua apoyada al costado',
    desc: 'Látex acrílico mate para paredes y cielorrasos de interior. Buen poder cubritivo y secado rápido.', rinde: '10 a 12 m² por litro y por mano', secado: '1 hora al tacto · 2 a 3 h entre manos' },
  { id: 'latex-exterior', nombre: 'Látex acrílico exterior', cat: 'latex', uso: ['exterior', 'interior'], ops: L4(8200, 26900, 58900, 104900), colores: 'carta',
    descuento: 0, stock: 32, rango: 2, img: 'images/p-latex-exterior.webp',
    alt: 'Balde blanco de 20 litros con tapa y manija azules',
    desc: 'Látex acrílico para frentes y paredes exteriores. Resiste la lluvia y el sol sin descascararse.', rinde: '8 a 10 m² por litro y por mano', secado: '1 hora al tacto · 3 h entre manos' },
  { id: 'latex-premium', nombre: 'Látex premium interior/exterior', cat: 'latex', uso: ['interior', 'exterior'], ops: L4(10500, 34900, 76900, 139900), colores: 'carta',
    descuento: 0, stock: 20, rango: 4, tag: 'Premium', img: 'images/p-latex-premium.webp',
    alt: 'Balde blanco con tapa y manija azul marino',
    desc: 'La línea de más cuerpo: cubre en menos manos, deja una terminación pareja y sirve adentro y afuera.', rinde: '12 a 14 m² por litro y por mano', secado: '1 hora al tacto · 3 h entre manos' },
  { id: 'latex-superlavable', nombre: 'Látex superlavable', cat: 'latex', uso: ['interior'], ops: L4(9400, 31200, 68500, 124900), colores: 'carta',
    descuento: 10, stock: 24, rango: 3, img: 'images/p-latex-superlavable.webp',
    alt: 'Balde blanco con tapa y manija verde agua',
    desc: 'Para pasillos, cocinas y cuartos de chicos: se limpia con un trapo húmedo sin perder el color.', rinde: '10 a 12 m² por litro y por mano', secado: '1 hora al tacto · 3 h entre manos' },
  { id: 'latex-ultralavable', nombre: 'Látex ultralavable', cat: 'latex', uso: ['interior'], ops: L4(11900, 39500, 86900, 159900), colores: 'carta',
    descuento: 0, stock: 16, rango: 6, img: 'images/p-latex-ultralavable.webp',
    alt: 'Balde blanco con tapa y manija violeta',
    desc: 'La más resistente al lavado: aguanta el uso diario en locales, consultorios y escuelas.', rinde: '10 a 12 m² por litro y por mano', secado: '2 horas al tacto · 4 h entre manos' },
  { id: 'esmalte-brillante', nombre: 'Esmalte sintético brillante', cat: 'esmaltes', uso: ['metal', 'madera', 'exterior'], colores: 'carta',
    ops: [{ id: '05l', n: '0,5 L', precio: 7400 }, { id: '1l', n: '1 L', precio: 12900 }, { id: '4l', n: '4 L', precio: 44900 }],
    descuento: 0, stock: 30, rango: 5, img: 'images/p-esmalte-brillante.webp',
    alt: 'Lata metálica de esmalte con tapa azul',
    desc: 'Esmalte sintético de alto brillo para rejas, portones, puertas y muebles. Protege del óxido y de la humedad.', rinde: '12 m² por litro y por mano', secado: '6 horas al tacto · 12 h entre manos' },
  { id: 'esmalte-satinado', nombre: 'Esmalte sintético satinado', cat: 'esmaltes', uso: ['metal', 'madera', 'interior'], colores: 'carta',
    ops: [{ id: '05l', n: '0,5 L', precio: 7900 }, { id: '1l', n: '1 L', precio: 13800 }, { id: '4l', n: '4 L', precio: 47900 }],
    descuento: 0, stock: 22, rango: 9, img: 'images/p-esmalte-satinado.webp',
    alt: 'Lata metálica de esmalte con tapa verde agua',
    desc: 'La misma protección que el brillante, con un acabado suave que disimula imperfecciones en puertas y muebles.', rinde: '12 m² por litro y por mano', secado: '6 horas al tacto · 12 h entre manos' },
  { id: 'membrana-techos', nombre: 'Membrana líquida para techos', cat: 'membranas', uso: ['techos', 'exterior'], colores: ['Blanco', 'Rojo teja', 'Gris', 'Verde'],
    ops: [{ id: '4l', n: '4 L', precio: 24900 }, { id: '10l', n: '10 L', precio: 55900 }, { id: '20l', n: '20 L', precio: 99900 }],
    descuento: 0, stock: 26, rango: 7, tag: 'Más pedido', img: 'images/p-membrana-techos.webp',
    alt: 'Balde blanco con tapa verde agua junto a una muestra de membrana gris',
    desc: 'Forma una capa elástica que sella fisuras y frena las filtraciones en techos y terrazas.', rinde: '1 litro por m² en dos o tres manos', secado: '4 horas al tacto · 24 h entre manos' },
  { id: 'membrana-fibrada', nombre: 'Membrana líquida fibrada', cat: 'membranas', uso: ['techos', 'exterior'], colores: ['Blanco', 'Rojo teja', 'Gris'],
    ops: [{ id: '4l', n: '4 L', precio: 29900 }, { id: '10l', n: '10 L', precio: 66900 }, { id: '20l', n: '20 L', precio: 119900 }],
    descuento: 0, stock: 14, rango: 11, img: 'images/p-membrana-fibrada.webp',
    alt: 'Balde blanco con tapa roja junto a una muestra de membrana gris',
    desc: 'Con fibras de refuerzo para techos con más movimiento o fisuras grandes. Más cuerpo por mano.', rinde: '1,2 litros por m² en dos o tres manos', secado: '4 horas al tacto · 24 h entre manos' },
  { id: 'piscinas', nombre: 'Pintura para piscinas', cat: 'pisos', uso: ['piscinas', 'exterior'], colores: ['Celeste', 'Azul', 'Blanco'],
    ops: [{ id: '4l', n: '4 L', precio: 33900 }, { id: '10l', n: '10 L', precio: 76900 }, { id: '20l', n: '20 L', precio: 142900 }],
    descuento: 0, stock: 12, rango: 8, img: 'images/p-piscinas.webp',
    alt: 'Lata metálica abierta con pintura celeste junto a un azulejo pintado',
    desc: 'Pintura para el interior de piletas de material. Aguanta el agua, el cloro y el sol de todo el verano.', rinde: '6 a 8 m² por litro y por mano', secado: '4 horas al tacto · 7 días antes de llenar' },
  { id: 'pisos-alto-transito', nombre: 'Pintura de alto tránsito para pisos', cat: 'pisos', uso: ['pisos', 'interior', 'exterior'], colores: ['Gris', 'Verde', 'Rojo óxido', 'Negro'], ops: L4(9900, 32900, 72900, 132900),
    descuento: 0, stock: 18, rango: 10, img: 'images/p-pisos.webp',
    alt: 'Lata metálica con tapa gris junto a una placa pintada de gris brillante',
    desc: 'Para garajes, cocheras, veredas y depósitos. Resiste el paso de gente y de autos.', rinde: '8 a 10 m² por litro y por mano', secado: '4 horas al tacto · 48 h para tránsito de autos' },
  { id: 'termoplastica', nombre: 'Pintura termoplástica para demarcación', cat: 'pisos', uso: ['pisos', 'exterior'], colores: ['Blanco', 'Amarillo'],
    ops: [{ id: '25kg', n: '25 kg', precio: 89900 }],
    descuento: 0, stock: 10, rango: 14, img: 'images/p-termoplastica.webp',
    alt: 'Lata metálica con pintura amarilla junto a una placa pintada de amarillo',
    desc: 'Para demarcar estacionamientos, sendas y calles internas. Se aplica en caliente y queda lista en minutos.', rinde: 'Según el ancho y el espesor de la línea', secado: 'Pocos minutos para habilitar el tránsito' },
  { id: 'barniz-marino', nombre: 'Barniz marino', cat: 'maderas', uso: ['madera', 'exterior'], colores: ['Natural', 'Cedro', 'Caoba'],
    ops: [{ id: '1l', n: '1 L', precio: 14900 }, { id: '4l', n: '4 L', precio: 52900 }],
    descuento: 10, stock: 16, rango: 12, img: 'images/p-barniz.webp',
    alt: 'Lata metálica junto a una tabla de madera barnizada',
    desc: 'Protege la madera al exterior del sol y la lluvia, con un brillo que realza la veta.', rinde: '12 a 14 m² por litro y por mano', secado: '6 horas al tacto · 12 h entre manos' },
  { id: 'masilla', nombre: 'Masilla para paredes', cat: 'preparacion', uso: ['interior'], colores: null,
    ops: [{ id: '1kg', n: '1 kg', precio: 4900 }, { id: '4kg', n: '4 kg', precio: 15900 }, { id: '10kg', n: '10 kg', precio: 34900 }],
    descuento: 0, stock: 34, rango: 13, img: 'images/p-masilla.webp',
    alt: 'Pote de masilla blanca abierto con una espátula de mango azul',
    desc: 'Para tapar agujeros, emparejar fisuras y dejar la pared lisa antes de pintar. Se lija fácil.', rinde: 'Según el estado de la pared', secado: '2 a 4 horas antes de lijar' },
  { id: 'fijador-sellador', nombre: 'Fijador sellador', cat: 'preparacion', uso: ['interior', 'exterior'], colores: null, ops: L4(5900, 18900, 41900, 76900),
    descuento: 0, stock: 28, rango: 15, img: 'images/p-fijador.webp',
    alt: 'Bidón plástico translúcido con tapa azul',
    desc: 'Se aplica antes del látex: fija el polvo, sella la pared y hace que la pintura rinda más.', rinde: '10 a 14 m² por litro', secado: '2 horas antes de pintar' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tag || '', ETIQUETAS[p.cat] || '', CATEGORIAS.find(c => c.id === p.cat)?.nombre || '',
    ...(p.uso || []).map(u => `${u} ${ETIQUETAS[u] || ''} ${USOS.find(x => x.id === u)?.nombre || ''}`),
    ...p.ops.map(o => `${o.n} ${o.n.replace(' ', '')} ${o.n.replace(' L', ' litros').replace(' kg', ' kilos')}`),
    Array.isArray(p.colores) ? p.colores.join(' ') : p.colores === 'carta' ? 'colores carta 400 color tono' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => {
    const min = Math.min(...p.ops.map(o => o.precio));
    return p.descuento > 0 ? Math.round(min * (1 - p.descuento / 100)) : min;
  };
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), pres = lista(f.pres), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (uso.length && !(p.uso || []).some(u => uso.includes(u))) return false;
    if (pres.length && !p.ops.some(o => pres.includes(o.n))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.carta && p.colores !== 'carta') return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
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
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, desde(p)); } });
    return { n, desde: n ? min : 0 };
  }
  function facetas(filtros = {}) {
    const uso = {}, pres = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.uso || []).forEach(x => { uso[x] = (uso[x] || 0) + 1; });
      p.ops.forEach(o => { pres[o.n] = (pres[o.n] || 0) + 1; });
    });
    return { uso, pres };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const opDe = (p, op) => p?.ops?.find(o => o.id === op) || null;
const conDescuento = (p, n) => (p.descuento > 0 ? Math.round(n * (1 - p.descuento / 100)) : n);
const precioOp = (p, op) => conDescuento(p, (opDe(p, op) || p.ops[0]).precio);
const precioLista = (p, op) => (opDe(p, op) || p.ops[0]).precio;
const desdeDe = p => conDescuento(p, Math.min(...p.ops.map(o => o.precio)));
const variasOps = p => p.ops.length > 1;
const conCarta = p => p.colores === 'carta';
const colorDefault = p => (conCarta(p) ? 'Blanco' : Array.isArray(p.colores) ? p.colores[0] : '');
const lineaTxt = (p, op, color) => [opDe(p, op)?.n || p.ops[0].n, color].filter(Boolean).join(' · ');

const FAMILIAS = [
  { id: 'blancos', nombre: 'Blancos y cremas', pre: 'BL', h: [40, 44, 48, 52, 36, 32, 28, 56, 60, 200, 210, 120, 90], f: [[38, 96], [42, 93], [46, 90], [50, 86]],
    nombres: { 0: 'Blanco tiza', 2: 'Marfil', 15: 'Crema', 30: 'Vainilla', 22: 'Blanco hielo' } },
  { id: 'grises', nombre: 'Grises', pre: 'GR', h: [210, 215, 220, 200, 190, 40, 35, 30, 25, 60, 90, 150, 180], f: [[8, 84], [9, 70], [10, 55], [12, 38]],
    nombres: { 0: 'Gris perla', 18: 'Gris cemento', 28: 'Gris plomo', 41: 'Grafito' } },
  { id: 'azules', nombre: 'Azules y celestes', pre: 'AZ', h: [195, 200, 205, 210, 214, 218, 222, 226, 230, 234, 238, 190, 186], f: [[55, 86], [52, 72], [55, 56], [58, 38]],
    nombres: { 1: 'Celeste cielo', 17: 'Azul acero', 33: 'Azul francia', 47: 'Azul noche' } },
  { id: 'verdes', nombre: 'Verdes', pre: 'VE', h: [80, 90, 100, 110, 120, 130, 140, 150, 160, 168, 176, 70, 60], f: [[35, 84], [32, 68], [35, 52], [38, 34]],
    nombres: { 2: 'Verde salvia', 9: 'Verde agua', 24: 'Verde oliva', 45: 'Verde inglés' } },
  { id: 'amarillos', nombre: 'Amarillos y naranjas', pre: 'AM', h: [55, 52, 49, 46, 43, 40, 37, 34, 31, 28, 25, 22, 19], f: [[80, 86], [78, 72], [75, 60], [70, 48]],
    nombres: { 1: 'Amarillo pastel', 18: 'Mostaza', 36: 'Naranja', 9: 'Damasco' } },
  { id: 'rojos', nombre: 'Rojos y rosas', pre: 'RO', h: [350, 354, 358, 2, 6, 10, 14, 340, 334, 328, 322, 316, 345], f: [[60, 88], [55, 74], [55, 58], [55, 42]],
    nombres: { 0: 'Rosa viejo', 18: 'Coral', 32: 'Rojo colonial', 51: 'Bordó' } },
  { id: 'tierras', nombre: 'Tierras y marrones', pre: 'TI', h: [15, 18, 21, 24, 27, 30, 33, 36, 39, 12, 9, 42, 45], f: [[30, 80], [32, 64], [35, 48], [38, 32]],
    nombres: { 5: 'Arena', 22: 'Terracota', 20: 'Ocre', 44: 'Chocolate' } },
  { id: 'violetas', nombre: 'Violetas y lilas', pre: 'VI', h: [250, 256, 262, 268, 274, 280, 286, 292, 298, 244, 238, 304, 310], f: [[30, 86], [28, 72], [30, 56], [32, 40]],
    nombres: { 3: 'Lavanda', 18: 'Lila', 35: 'Violeta', 47: 'Ciruela' } },
];
function hslHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
const CARTA = FAMILIAS.flatMap(fam => fam.f.flatMap(([s, l], fila) => fam.h.map((h, col) => {
  const i = fila * 13 + col;
  const codigo = `${fam.pre}-${fila + 1}${String(col + 1).padStart(2, '0')}`;
  return { codigo, familia: fam.id, hex: hslHex(h, s, l), nombre: fam.nombres[i] || '', claro: l >= 62 };
})));
const colorPorCodigo = c => CARTA.find(x => x.codigo === c) || null;
const colorTxt = c => (c.nombre ? `${c.nombre} (${c.codigo})` : `Tono ${c.codigo}`);

const Cart = {
  KEY: 'pinturadirectodefabrica_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  igual(i, id, op, color) { return i.id === id && (i.op || '') === op && (i.color || '') === color; },
  add(producto, qty = 1, op = '', color = '') {
    const items = this.get();
    const opId = opDe(producto, op)?.id || producto.ops[0].id;
    const existing = items.find(i => this.igual(i, producto.id, opId, color));
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op: opId, color, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, color, qty) {
    const items = this.get(); const it = items.find(i => this.igual(i, id, op, color)); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op, color) { this.save(this.get().filter(i => !this.igual(i, id, op, color))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.op) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'pinturadirectodefabrica_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  balde: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.5 12a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7Z"/><path d="M4 8h16M7 8a5 5 0 0 1 10 0"/></svg>',
  paleta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 10-10c0 2.5-2 3.5-4 3.5h-2a2 2 0 0 0-1.5 3.3c.6.7.4 3.2-2.5 3.2Z"/><circle cx="7.5" cy="10.5" r="1.3"/><circle cx="12" cy="7" r="1.3"/><circle cx="16.5" cy="10.5" r="1.3"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ESTADO = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(52px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

function precioHTML(p, op = '') {
  const elegido = op && opDe(p, op);
  const final = elegido ? precioOp(p, op) : desdeDe(p);
  const lista = elegido ? precioLista(p, op) : Math.min(...p.ops.map(o => o.precio));
  const desdeTxt = !elegido && variasOps(p) ? '<span class="precio__desde">desde</span>' : '';
  return `<p class="precio">${desdeTxt}<span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(final)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(lista)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  if (p.stock <= 10) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function coloresMiniHTML(p) {
  if (conCarta(p)) return `<span class="prod__colores" title="Más de 400 colores"><span class="chips-mini" aria-hidden="true"><i style="background:#E9DCC4"></i><i style="background:#8FB3D9"></i><i style="background:#9BB58E"></i><i style="background:#C9735F"></i></span>+400 colores</span>`;
  if (Array.isArray(p.colores)) return `<span class="prod__colores">${p.colores.length} ${p.colores.length === 1 ? 'color' : 'colores'}</span>`;
  return '';
}
function opsSelectHTML(p) {
  if (!variasOps(p)) return `<span class="prod__pres">${esc(p.ops[0].n)}</span>`;
  return `<label class="var-sel"><span class="sr-only">Presentación de ${esc(p.nombre)}</span><select data-op>${p.ops.map((o, k) => `<option value="${o.id}"${k === p.ops.length - 1 ? ' selected' : ''}>${esc(o.n)}</option>`).join('')}</select></label>`;
}
const opInicial = p => p.ops[p.ops.length - 1].id;

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const op = opInicial(p);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver detalle</span></div>`;
  return `<article class="prod" data-prod="${p.id}">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <div class="prod__precio-fila" data-precio>${precioHTML(p, op)}</div>
      ${coloresMiniHTML(p)}
      <div class="prod__acciones">${opsSelectHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function filaHTML(p) {
  const nombre = esc(p.nombre);
  const op = opInicial(p);
  const colorSel = conCarta(p)
    ? `<label class="var-sel var-sel--color"><span class="sr-only">Color de ${nombre}</span><select data-color><option value="Blanco">Blanco</option><option value="__carta">Elegir de la carta…</option></select></label>`
    : Array.isArray(p.colores) ? `<label class="var-sel var-sel--color"><span class="sr-only">Color de ${nombre}</span><select data-color>${p.colores.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label>` : '';
  return `<article class="fila" data-prod="${p.id}">
    <a class="fila__foto prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="400" height="400" decoding="async"></a>
    <div class="fila__info">
      <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}${p.descuento > 0 ? ` · <span class="fila__off">-${p.descuento}%</span>` : ''}</p>
      <h3 class="fila__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p class="fila__rinde">Rinde ${esc(p.rinde)}</p>
    </div>
    <div class="fila__pres" role="group" aria-label="Presentación de ${nombre}">${p.ops.map(o => `<button type="button" class="pres" data-pres="${o.id}" aria-pressed="${o.id === op}"><span class="pres__n">${esc(o.n)}</span><span class="pres__p">${formatearPrecio(precioOp(p, o.id))}</span></button>`).join('')}</div>
    <div class="fila__acciones prod__acciones">${colorSel}${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al pedido: ${nombre}"><span class="lbl-long">Agregar al pedido</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-nec"><p class="cats-nec__tit">Para pintar</p>${USOS.map(u => `<a href="${CATALOGO_URL}?uso=${u.id}">${esc(u.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todos los productos ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
  if (!btn || !form) return;
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const q = sel => [...hero.querySelectorAll(sel)];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  if (q('.pincel').length) tl.from(q('.pincel'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.3, stagger: 0.12, clearProps: 'transform' }, 0.05);
  if (q('.abanico__varilla').length) tl.from(q('.abanico__varilla'), { rotate: 0, opacity: 0, duration: 1.2, stagger: 0.05, clearProps: 'transform,opacity' }, 0.2);
  tl.from(q('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(q('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(q('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.42)
    .from(q('.hero-ctas > *, .hero-buscar'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(q('.hero-chips a, .rotulo'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.7);
}

function initHome() {
  if (PAGINA !== 'home') return;
  const lista = document.getElementById('destacadosLista');
  if (lista) {
    lista.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
      .map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catN });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function initListaFabrica() {
  const cont = document.getElementById('listaFabrica');
  const tabs = document.getElementById('listaTabs');
  if (!cont || !tabs) return;
  const panel = document.getElementById('listaPanel');
  const pestanas = [{ id: '', nombre: 'Más pedidos' }, ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre }))];
  tabs.innerHTML = pestanas.map((t, k) => `<button type="button" class="tab" role="tab" id="tab-${t.id || 'top'}" aria-selected="${k === 0}" aria-controls="listaPanel" tabindex="${k === 0 ? 0 : -1}" data-tab="${t.id}">${esc(t.nombre)}${t.id ? `<small>${Tienda.contar({ cat: t.id })}</small>` : ''}</button>`).join('');
  const verTodo = document.getElementById('listaVerTodo');
  const pintar = (cat, primera) => {
    const res = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: 8 });
    cont.innerHTML = res.items.map(p => `<li ${primera ? ESTADO.subir : ''}>${filaHTML(p)}</li>`).join('');
    panel?.setAttribute('aria-labelledby', `tab-${cat || 'top'}`);
    if (verTodo) {
      verTodo.href = cat ? `${CATALOGO_URL}?cat=${cat}` : CATALOGO_URL;
      verTodo.querySelector('span').textContent = cat ? `Ver todo ${nombreDe(CATEGORIAS, cat).toLowerCase()}` : 'Ver la lista completa';
    }
    if (!primera) refrescarTriggers();
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    tabs.querySelectorAll('[data-tab]').forEach(x => { x.setAttribute('aria-selected', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    pintar(b.dataset.tab, false);
  });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const todos = [...tabs.querySelectorAll('[data-tab]')];
    const i = todos.indexOf(document.activeElement);
    if (i < 0) return;
    const sig = todos[(i + (e.key === 'ArrowRight' ? 1 : -1) + todos.length) % todos.length];
    sig.focus(); sig.click();
  });
  pintar('', true);
}

const Picker = { familia: 'azules', codigo: 'AZ-205', q: '' };
function swatchesHTML(familia, q, sel) {
  const nq = q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const lista = nq ? CARTA.filter(c => c.codigo.toLowerCase().includes(nq) || c.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(nq) || c.hex.toLowerCase().includes(nq)).slice(0, 52) : CARTA.filter(c => c.familia === familia);
  if (!lista.length) return `<p class="carta__vacio">No hay un tono con «${esc(q)}». Probá con un código como AZ-214 o un nombre como arena.</p>`;
  return lista.map(c => `<button type="button" class="sw${c.claro ? ' sw--claro' : ''}" style="--sw:${c.hex}" data-sw="${c.codigo}" aria-pressed="${c.codigo === sel}" aria-label="${esc(colorTxt(c))}"><span class="sw__cod" aria-hidden="true">${c.codigo}</span></button>`).join('');
}
function famsHTML(activa) {
  return FAMILIAS.map(f => {
    const muestra = CARTA.find(c => c.familia === f.id && c.codigo.endsWith('-305'))?.hex || '#ccc';
    return `<button type="button" class="fam" data-fam="${f.id}" aria-pressed="${f.id === activa}"><i style="background:${muestra}" aria-hidden="true"></i>${esc(f.nombre)}</button>`;
  }).join('');
}
function initCarta() {
  const box = document.getElementById('carta');
  if (!box) return;
  const fams = box.querySelector('[data-fams]');
  const grid = box.querySelector('[data-swatches]');
  const buscar = box.querySelector('[data-carta-buscar]');
  const muestra = box.querySelector('[data-muestra]');
  const nombre = box.querySelector('[data-muestra-nombre]');
  const cod = box.querySelector('[data-muestra-cod]');
  const fam = box.querySelector('[data-muestra-fam]');
  const wsp = box.querySelector('[data-muestra-wsp]');
  const pintarMuestra = () => {
    const c = colorPorCodigo(Picker.codigo);
    if (!c) return;
    muestra.style.setProperty('--muestra', c.hex);
    muestra.classList.toggle('muestra--clara', c.claro);
    nombre.textContent = c.nombre || `Tono ${c.codigo}`;
    cod.textContent = `${c.codigo} · ${c.hex}`;
    fam.textContent = nombreDe(FAMILIAS, c.familia);
    if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por el color ${colorTxt(c)} de la carta.`);
  };
  const pintar = () => {
    fams.innerHTML = famsHTML(Picker.q ? '' : Picker.familia);
    grid.innerHTML = swatchesHTML(Picker.familia, Picker.q, Picker.codigo);
    pintarMuestra();
  };
  fams.addEventListener('click', e => {
    const b = e.target.closest('[data-fam]');
    if (!b) return;
    Picker.familia = b.dataset.fam; Picker.q = ''; buscar.value = '';
    const primero = CARTA.find(c => c.familia === Picker.familia && c.nombre);
    if (primero) Picker.codigo = primero.codigo;
    pintar();
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-sw]');
    if (!b) return;
    Picker.codigo = b.dataset.sw;
    grid.querySelectorAll('[data-sw]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarMuestra();
  });
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { Picker.q = buscar.value.slice(0, 30); pintar(); }, 200); });
  buscar.closest('form')?.addEventListener('submit', e => e.preventDefault());
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-pedir-color]');
    if (!b) return;
    const c = colorPorCodigo(Picker.codigo);
    abrirQV(b.dataset.pedirColor, b, '', c ? colorTxt(c) : '');
  });
  pintar();
}

const LOCALIDADES = [
  { id: 'casco', nombre: 'La Plata (casco urbano)', grupo: 'La Plata', ll: [-34.9214, -57.9545] },
  { id: 'tolosa', nombre: 'Tolosa', grupo: 'La Plata', ll: [-34.9005, -57.9705] },
  { id: 'ringuelet', nombre: 'Ringuelet', grupo: 'La Plata', ll: [-34.8855, -57.9845] },
  { id: 'gonnet', nombre: 'Manuel B. Gonnet', grupo: 'La Plata', ll: [-34.8745, -58.0185] },
  { id: 'citybell', nombre: 'City Bell', grupo: 'La Plata', ll: [-34.8655, -58.0505] },
  { id: 'villaelisa', nombre: 'Villa Elisa', grupo: 'La Plata', ll: [-34.8485, -58.0835] },
  { id: 'segui', nombre: 'Arturo Seguí', grupo: 'La Plata', ll: [-34.8855, -58.1305] },
  { id: 'hornos', nombre: 'Los Hornos', grupo: 'La Plata', ll: [-34.9655, -57.9935] },
  { id: 'sancarlos', nombre: 'San Carlos', grupo: 'La Plata', ll: [-34.9395, -58.0055] },
  { id: 'elvira', nombre: 'Villa Elvira', grupo: 'La Plata', ll: [-34.9455, -57.9085] },
  { id: 'sanlorenzo', nombre: 'Altos de San Lorenzo', grupo: 'La Plata', ll: [-34.9605, -57.9345] },
  { id: 'romero', nombre: 'Melchor Romero', grupo: 'La Plata', ll: [-34.9485, -58.0445] },
  { id: 'olmos', nombre: 'Lisandro Olmos', grupo: 'La Plata', ll: [-34.9955, -58.0385] },
  { id: 'abasto', nombre: 'Abasto', grupo: 'La Plata', ll: [-34.9855, -58.1185] },
  { id: 'berisso', nombre: 'Berisso', grupo: 'Berisso y Ensenada', ll: [-34.8725, -57.8865] },
  { id: 'ensenada', nombre: 'Ensenada', grupo: 'Berisso y Ensenada', ll: [-34.8645, -57.9115] },
  { id: 'puntalara', nombre: 'Punta Lara', grupo: 'Berisso y Ensenada', ll: [-34.8175, -57.9725] },
];
function initEntregas() {
  const box = document.getElementById('entregas');
  if (!box) return;
  const sel = box.querySelector('[data-loc]');
  const res = box.querySelector('[data-loc-res]');
  const mapaEl = box.querySelector('[data-mapa]');
  const grupos = [...new Set(LOCALIDADES.map(l => l.grupo))];
  sel.innerHTML = '<option value="">Elegí tu localidad</option>' + grupos.map(g => `<optgroup label="${esc(g)}">${LOCALIDADES.filter(l => l.grupo === g).map(l => `<option value="${l.id}">${esc(l.nombre)}</option>`).join('')}</optgroup>`).join('') + '<option value="otra">Otra localidad</option>';
  let mapa = null;
  const marcas = new Map();
  if (mapaEl && typeof L !== 'undefined') {
    try {
      mapa = L.map(mapaEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([-34.91, -57.99], 11);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
      L.circle([-34.915, -57.99], { radius: 15500, color: '#2457C5', weight: 1, fillColor: '#28A69A', fillOpacity: 0.1 }).addTo(mapa);
      LOCALIDADES.forEach(l => {
        const m = L.circleMarker(l.ll, { radius: 6, color: '#fff', weight: 2, fillColor: '#2457C5', fillOpacity: 1 }).addTo(mapa).bindTooltip(l.nombre, { direction: 'top', offset: [0, -6] });
        m.on('click', () => { sel.value = l.id; elegir(); });
        marcas.set(l.id, m);
      });
    } catch (err) { console.error(err); }
  }
  function elegir() {
    const l = LOCALIDADES.find(x => x.id === sel.value);
    if (!sel.value) { res.innerHTML = ''; return; }
    if (!l) {
      res.innerHTML = `<p class="loc-res loc-res--consulta">${ICON.pin}<span><strong>Consultanos por tu localidad.</strong> Te decimos cómo te lo hacemos llegar.</span></p><a class="btn btn--line btn--wsp" href="${wspHref(`Hola ${MARCA}! ¿Hacen entregas en mi localidad? Estoy en `)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>`;
      return;
    }
    res.innerHTML = `<p class="loc-res">${ICON.check}<span><strong>Sí, en ${esc(l.nombre)} la entrega es sin cargo.</strong> Coordinamos el día por WhatsApp cuando hacés el pedido.</span></p><div class="loc-ctas"><a class="btn btn--cta" href="${CATALOGO_URL}">Elegir productos${ICON.flecha}</a><a class="btn btn--line btn--wsp" href="${wspHref(`Hola ${MARCA}! Estoy en ${l.nombre} y quiero coordinar una entrega.`)}" target="_blank" rel="noopener">${ICON.wsp}Coordinar la entrega</a></div>`;
    const m = marcas.get(l.id);
    if (mapa && m) { mapa.flyTo(l.ll, 13, { duration: reduceMotion ? 0 : 0.8 }); m.openTooltip(); }
  }
  sel.addEventListener('change', elegir);
  box.querySelectorAll('[data-loc-chip]').forEach(b => b.addEventListener('click', () => { sel.value = b.dataset.locChip; elegir(); }));
}

const QV = { p: null, op: '', color: '', opener: null, picker: false, fam: 'azules' };
function colorQVHTML(p) {
  if (!p.colores) return '';
  if (Array.isArray(p.colores)) {
    return `<div><p class="f-grupo__titulo">Color</p><div class="qv__ops" role="group" aria-label="Elegí el color">${p.colores.map(c => `<button type="button" class="qv__op" data-qv-color="${esc(c)}" aria-pressed="${QV.color === c}">${esc(c)}</button>`).join('')}</div></div>`;
  }
  const deCarta = QV.color && QV.color !== 'Blanco';
  const actual = deCarta ? CARTA.find(c => QV.color.includes(c.codigo)) : null;
  return `<div class="qv__color">
    <p class="f-grupo__titulo">Color</p>
    <div class="qv__ops" role="group" aria-label="Elegí el color">
      <button type="button" class="qv__op" data-qv-color="Blanco" aria-pressed="${!deCarta}"><i class="dot" style="background:#fff" aria-hidden="true"></i>Blanco</button>
      <button type="button" class="qv__op" data-qv-carta aria-expanded="${QV.picker}" aria-pressed="${deCarta}"><i class="dot" style="background:${actual?.hex || 'conic-gradient(#8FB3D9,#9BB58E,#E5C46B,#C9735F,#A792C9,#8FB3D9)'}" aria-hidden="true"></i>${deCarta ? esc(QV.color) : 'Elegir de la carta (+400)'}</button>
    </div>
    ${QV.picker ? `<div class="qv__picker"><div class="fams fams--chicas">${famsHTML(QV.fam)}</div><div class="swatches swatches--chicas">${swatchesHTML(QV.fam, '', actual?.codigo || '')}</div></div>` : ''}
  </div>`;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre} (${lineaTxt(p, QV.op, QV.color)}).`;
  const on = Favs.has(p.id);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800"></div>
        <dl class="qv__ficha">
          <div><dt>Rinde</dt><dd>${esc(p.rinde)}</dd></div>
          <div><dt>Secado</dt><dd>${esc(p.secado)}</dd></div>
          <div><dt>Para</dt><dd>${(p.uso || []).map(u => esc(nombreDe(USOS, u).toLowerCase())).join(' · ')}</dd></div>
        </dl>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        <div data-qv-precio>${precioHTML(p, QV.op)}</div>
        <p class="qv__desc">${esc(p.desc)}</p>
        <div>
          <p class="f-grupo__titulo">Presentación</p>
          <div class="qv__ops qv__ops--pres" role="group" aria-label="Elegí la presentación">${p.ops.map(o => `<button type="button" class="qv__op qv__op--pres" data-qv-op="${o.id}" aria-pressed="${QV.op === o.id}"><span>${esc(o.n)}</span><small>${formatearPrecio(precioOp(p, o.id))}</small></button>`).join('')}</div>
        </div>
        ${colorQVHTML(p)}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">desde ${formatearPrecio(desdeDe(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desdeDe(p), highPrice: Math.max(...p.ops.map(o => precioOp(p, o.id))), offerCount: p.ops.length, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '', color = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = opDe(p, op) ? op : opInicial(p);
  QV.color = color && p.colores ? color : colorDefault(p);
  QV.picker = false;
  const deCarta = conCarta(p) && QV.color !== 'Blanco' ? CARTA.find(c => QV.color.includes(c.codigo)) : null;
  QV.fam = deCarta?.familia || 'azules';
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const rePintar = foco => {
    const qty = modal.querySelector('.qv__compra output')?.textContent;
    const top = modal.querySelector('.qv__panel')?.scrollTop || 0;
    renderQV();
    const out = modal.querySelector('.qv__compra output');
    if (out && qty) { out.textContent = qty; const st = out.closest('[data-stepper]'); st.querySelector('[data-menos]').disabled = Number(qty) <= 1; }
    modal.querySelector('.qv__panel')?.scrollTo(0, top);
    if (foco) modal.querySelector(foco)?.focus();
  };
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) { QV.op = o.dataset.qvOp; rePintar(`[data-qv-op="${QV.op}"]`); return; }
    const c = e.target.closest('[data-qv-color]');
    if (c) { QV.color = c.dataset.qvColor; QV.picker = false; rePintar(`[data-qv-color="${CSS.escape(QV.color)}"]`); return; }
    if (e.target.closest('[data-qv-carta]')) { QV.picker = !QV.picker; rePintar('[data-qv-carta]'); return; }
    const f = e.target.closest('[data-fam]');
    if (f) { QV.fam = f.dataset.fam; rePintar(`[data-fam="${QV.fam}"]`); return; }
    const sw = e.target.closest('[data-sw]');
    if (sw) {
      const col = colorPorCodigo(sw.dataset.sw);
      if (col) { QV.color = colorTxt(col); QV.picker = false; rePintar('[data-qv-carta]'); }
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op, QV.color);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (${lineaTxt(p, QV.op, QV.color)}) al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(i.op || '')}" data-linea-color="${esc(i.color || '')}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(lineaTxt(p, i.op, i.color))} · ${formatearPrecio(precioOp(p, i.op))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioOp(p, i.op) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function textoPedido(lineas, total) {
  return [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${lineaTxt(p, i.op, i.color)}): ${formatearPrecio(precioOp(p, i.op) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, 'Localidad para la entrega: '].join('\n');
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.balde}<p>Tu carrito está vacío. Elegí el producto, la presentación y el color, y sumalo acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas, total));
}
function renderPedido() {
  const box = document.getElementById('pedido');
  if (!box) return;
  const lista = box.querySelector('[data-pedido-items]');
  const pie = box.querySelector('[data-pedido-pie]');
  const n = box.querySelector('[data-pedido-n]');
  const lineas = Cart.get().filter(i => getProducto(i.id));
  n.textContent = lineas.length ? `${Cart.count()} ${Cart.count() === 1 ? 'unidad' : 'unidades'}` : 'Vacío';
  if (!lineas.length) {
    lista.innerHTML = `<p class="pedido__vacio">${ICON.balde}<span>Tocá la presentación y «Agregar»: tu pedido se arma acá, con el total al momento.</span></p>`;
    pie.hidden = true;
    return;
  }
  lista.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  pie.hidden = false;
  const total = Cart.total();
  box.querySelector('[data-pedido-total]').textContent = formatearPrecio(total);
  const wsp = box.querySelector('[data-pedido-wsp]');
  if (wsp) wsp.href = wspHref(textoPedido(lineas, total));
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function lineasClick(e) {
  const linea = e.target.closest('[data-linea]');
  if (!linea) return;
  const id = linea.dataset.linea, op = linea.dataset.lineaOp || '', color = linea.dataset.lineaColor || '';
  const it = Cart.get().find(i => Cart.igual(i, id, op, color));
  if (e.target.closest('[data-quitar]')) { Cart.remove(id, op, color); return; }
  if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, color, it.qty + 1);
  if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, color, it.qty - 1);
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  const checkout = () => showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  document.querySelectorAll('[data-checkout]').forEach(b => b.addEventListener('click', checkout));
  const pedido = document.getElementById('pedido');
  if (pedido) {
    pedido.addEventListener('click', lineasClick);
    document.addEventListener('cart:updated', renderPedido);
    renderPedido();
  }
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    lineasClick(e);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function opElegida(caja, p) {
  return caja?.querySelector('[data-op]')?.value || caja?.querySelector('[data-pres][aria-pressed="true"]')?.dataset.pres || opInicial(p);
}
function initAcciones() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-op]');
    if (sel && sel.closest('.prod')) {
      const caja = sel.closest('.prod');
      const p = getProducto(caja.dataset.prod);
      const pr = caja.querySelector('[data-precio]');
      if (p && pr) pr.innerHTML = precioHTML(p, sel.value);
      return;
    }
    const col = e.target.closest('[data-color]');
    if (col && col.value === '__carta') {
      const caja = col.closest('[data-prod]');
      col.value = 'Blanco';
      const p = getProducto(caja?.dataset.prod);
      if (p) { abrirQV(p.id, col, opElegida(caja, p)); QV.picker = true; renderQV(); }
    }
  });
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) {
      e.preventDefault();
      const caja = qv.closest('[data-prod]');
      const p = getProducto(qv.dataset.qv);
      abrirQV(qv.dataset.qv, qv, caja && p ? opElegida(caja, p) : '');
      return;
    }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvOp || ''); return; }
    const pres = e.target.closest('[data-pres]');
    if (pres) {
      pres.parentElement.querySelectorAll('[data-pres]').forEach(b => b.setAttribute('aria-pressed', String(b === pres)));
      return;
    }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const caja = add.closest('[data-prod]');
      const op = opElegida(caja, p);
      const colSel = caja?.querySelector('[data-color]')?.value;
      const color = colSel && colSel !== '__carta' ? colSel : colorDefault(p);
      const qty = Number(caja?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op, color);
      showToast(`Sumaste ${p.nombre} (${lineaTxt(p, op, color)}).`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const caja = comprar.closest('[data-prod]');
      Cart.add(p, 1, opElegida(caja, p), colorDefault(p));
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), uso: multi('uso', USOS), pres: multi('pres', PRESENTACIONES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1', carta: params.get('carta') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const plantilla = MODELO === '2' ? filaHTML : cardHTML;
  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const vacioWsp = document.getElementById('vacioWsp');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.uso.length) f.uso = e.uso;
    if (e.pres.length) f.pres = e.pres;
    if (e.oferta) f.oferta = true;
    if (e.carta) f.carta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Producto</legend>
      ${opcion('radio', 'cat', '', 'Todos', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const usos = USOS.filter(u => fac.uso[u.id]);
    if (usos.length) grupos.push(`<fieldset class="f-grupo"><legend>Para pintar</legend><div class="f-necs">
      ${usos.map(u => `<label class="f-nec"><input type="checkbox" name="uso-${u.id}" value="${u.id}" data-f="uso"${e.uso.includes(u.id) ? ' checked' : ''}><span>${esc(u.nombre)}</span></label>`).join('')}</div></fieldset>`);
    const pres = PRESENTACIONES.filter(x => fac.pres[x]);
    if (pres.length) grupos.push(`<fieldset class="f-grupo"><legend>Presentación</legend><div class="f-necs">
      ${pres.map(x => `<label class="f-nec"><input type="checkbox" name="pres-${x.replace(/\W/g, '')}" value="${x}" data-f="pres"${e.pres.includes(x) ? ' checked' : ''}><span>${esc(x)}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'carta', '1', 'En la carta de +400 colores', e.carta, Tienda.contar({ ...base, carta: true }), 'carta')}
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const uso = !cat && e.uso.length === 1 ? USOS.find(u => u.id === e.uso[0]) : null;
    const titulo = cat ? cat.nombre : uso ? `Para ${uso.nombre.toLowerCase()}` : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.carta ? 'En más de 400 colores' : e.q ? `Resultados para «${e.q}»` : 'Todos los productos';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : uso ? `Pinturas y productos para ${uso.nombre.toLowerCase()}, directo de fábrica.` : e.oferta ? 'Productos con descuento, mientras haya stock.' : e.fav ? 'Los que guardaste con el corazón, para decidir con calma.' : e.carta ? 'Látex y esmaltes que podés pedir en cualquier tono de la carta.' : 'Látex, esmaltes, membranas y especiales directo de fábrica. Elegí la presentación y el color, y sumalos al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : uso ? uso.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : uso ? `${CATALOGO_URL}?uso=${uso.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta && !e.uso.length ? ' aria-current="page"' : ''}>Todos <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.uso.forEach(v => quitar.push(['uso', v, nombreDe(USOS, v)]));
    e.pres.forEach(v => quitar.push(['pres', v, v]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.carta) quitar.push(['carta', '1', '+400 colores']);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'uso', 'pres', 'precio', 'oferta', 'fav', 'carta', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.uso.length) u.searchParams.set('uso', e.uso.join(','));
    if (e.pres.length) u.searchParams.set('pres', e.pres.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.carta) u.searchParams.set('carta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = e.q ? 0 : Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li ${ESTADO.subir}>${plantilla(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const hay = mostrados > 0;
    contador.textContent = e.q
      ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'}`
      : `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te decimos si lo fabricamos.` : 'No hay productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! ¿Tienen ${e.q}?` : `Hola ${MARCA}! Estoy buscando un producto y no lo encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados} ${cursor ? '· hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav' || grupo === 'carta') e[grupo] = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.id === 'busquedaHeader') {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.uso = []; e.pres = []; e.precio = ''; e.oferta = false; e.fav = false; e.carta = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav' || k === 'carta') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.uso = []; e.oferta = false;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-nec a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.uso = (u.searchParams.get('uso') || '').split(',').filter(v => USOS.some(x => x.id === v));
    e.pres = [];
    e.oferta = u.searchParams.get('oferta') === '1';
    e.carta = u.searchParams.get('carta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });
  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initListaFabrica, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initCarta, initEntregas, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
