const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492645621465';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'jabones', nombre: 'Jabones artesanales', img: 'images/cat-jabones.webp' },
  { id: 'cremas', nombre: 'Cremas y aceites', img: 'images/cat-cremas.webp' },
  { id: 'cabello', nombre: 'Champú y acondicionador', img: 'images/cat-cabello.webp' },
  { id: 'higiene', nombre: 'Higiene personal', img: 'images/cat-higiene.webp' },
  { id: 'regalos', nombre: 'Cajas para regalar', img: 'images/cat-regalos.webp' },
];
const INGREDIENTES = { avena: 'Avena', lavanda: 'Lavanda', aloe: 'Aloe vera', calendula: 'Caléndula', 'rosa-mosqueta': 'Rosa mosqueta', cafe: 'Café', romero: 'Romero', karite: 'Karité', coco: 'Coco' };
const PIELES = { seca: 'Piel seca', sensible: 'Piel sensible', grasa: 'Piel grasa', mixta: 'Piel mixta o normal' };
const PIEL_TIPS = {
  seca: 'La piel seca agradece la manteca de karité, la avena y la rosa mosqueta: limpian sin dejarla tirante. Después de la ducha, crema o unas gotas de aceite.',
  sensible: 'Si tu piel se irrita fácil, mejor sin exfoliantes. El aloe, la caléndula y la avena suelen ser los más suaves.',
  grasa: 'Para la piel grasa o con brillo, la arcilla verde, el café y el romero ayudan a limpiar en profundidad. La esponja vegetal, una o dos veces por semana.',
  mixta: 'Con piel mixta o normal podés ir rotando: lavanda o aloe para todos los días y café cuando quieras exfoliar.',
};
const PRECIOS = { 'hasta-6': [0, 6000], '6-10': [6001, 10000], '10-15': [10001, 15000], 'mas-15': [15001, Infinity] };
const TODA_PIEL = ['seca', 'sensible', 'grasa', 'mixta'];

const PRODUCTOS = [
  { id: 'jabon-avena-miel', nombre: 'Jabón de avena y miel', cat: 'jabones', pres: 'Barra de 100 g', precio: 5900, descuento: 0, stock: 18, ing: ['avena'], piel: ['seca', 'sensible'], rango: 1, alta: 20260910, img: 'p-avena-miel', alt: 'Barras de jabón de avena con copos enteros en la superficie, sobre piedra', corto: 'Suave · Con copos de avena', desc: 'Avena en copos y miel para una limpieza suave que no tira. Para la ducha de todos los días y para pieles que se resecan con facilidad.', ficha: [['Ingredientes clave', 'Avena y miel'], ['Ideal para', 'Piel seca o sensible'], ['Uso', 'Cuerpo y manos'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'jabon-lavanda', nombre: 'Jabón de lavanda', cat: 'jabones', pres: 'Barra de 100 g', precio: 5900, descuento: 0, stock: 22, ing: ['lavanda'], piel: ['mixta', 'seca'], rango: 2, alta: 20260915, img: 'p-lavanda', alt: 'Dos barras de jabón violeta veteado con flores de lavanda secas arriba', corto: 'Relajante · Con flores de lavanda', desc: 'Veteado en violeta, con flores de lavanda secas arriba y un aroma suave que queda en el baño. Para la ducha de la noche.', ficha: [['Ingredientes clave', 'Lavanda'], ['Ideal para', 'Piel mixta o seca'], ['Uso', 'Cuerpo'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'jabon-aloe', nombre: 'Jabón de aloe vera', cat: 'jabones', pres: 'Barra de 100 g', precio: 5900, descuento: 0, stock: 15, ing: ['aloe'], piel: ['sensible', 'grasa', 'mixta'], rango: 3, alta: 20260920, img: 'p-aloe', alt: 'Barra de jabón verde claro en una jabonera de cerámica junto a una penca de aloe cortada', corto: 'Fresco · Calma la piel', desc: 'Gel de aloe vera en una barra fresca y liviana. Calma la piel después del sol o de la depilación.', ficha: [['Ingredientes clave', 'Aloe vera'], ['Ideal para', 'Piel sensible, grasa o mixta'], ['Uso', 'Cuerpo y cara'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'caja-surtida-6', nombre: 'Caja surtida de 6 jabones', cat: 'regalos', pres: '6 barras de 100 g', precio: 36000, descuento: 10, stock: 6, ing: ['lavanda', 'avena', 'calendula', 'rosa-mosqueta', 'cafe', 'romero'], piel: TODA_PIEL, rango: 4, alta: 20261005, img: 'p-caja-x6', alt: 'Caja de cartón con papel seda y seis jabones artesanales de colores', corto: 'Regalo · Caja kraft con papel seda', desc: 'Seis jabones distintos —lavanda, avena, caléndula, rosa mosqueta, café y arcilla verde— en caja de cartón con papel seda. Lista para regalar o para probar variedades.', ficha: [['Incluye', '6 jabones de 100 g'], ['Presentación', 'Caja kraft con papel seda'], ['Ideal para', 'Regalar o probar variedades'], ['Entrega', 'Armada y cerrada']] },
  { id: 'jabon-rosa-mosqueta', nombre: 'Jabón de rosa mosqueta', cat: 'jabones', pres: 'Barra de 100 g', precio: 6500, descuento: 0, stock: 12, ing: ['rosa-mosqueta'], piel: ['seca'], rango: 5, alta: 20261015, img: 'p-rosa-mosqueta', alt: 'Barra de jabón rosado con pétalos de rosa secos en el borde', corto: 'Nutritivo · Con pétalos de rosa', desc: 'Aceite de rosa mosqueta y pétalos de rosa. Deja la piel suave y con un perfume floral liviano.', ficha: [['Ingredientes clave', 'Rosa mosqueta'], ['Ideal para', 'Piel seca'], ['Uso', 'Cuerpo y cara'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'jabon-calendula', nombre: 'Jabón de caléndula', cat: 'jabones', pres: 'Barra de 100 g', precio: 6200, descuento: 0, stock: 3, ing: ['calendula'], piel: ['sensible', 'seca'], rango: 6, alta: 20261012, img: 'p-calendula', alt: 'Barra de jabón color crema con pétalos de caléndula naranjas', corto: 'Delicado · Con pétalos de caléndula', desc: 'Pétalos de caléndula sobre una barra cremosa. Va bien en pieles delicadas y para lavar la cara.', ficha: [['Ingredientes clave', 'Caléndula'], ['Ideal para', 'Piel sensible o seca'], ['Uso', 'Cara y cuerpo'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'jabon-cafe', nombre: 'Jabón exfoliante de café', cat: 'jabones', pres: 'Barra de 100 g', precio: 6200, descuento: 0, stock: 10, ing: ['cafe'], piel: ['grasa', 'mixta'], rango: 7, alta: 20260901, img: 'p-cafe', alt: 'Barra de jabón veteada con café molido sobre papel seda', corto: 'Exfoliante · Con café molido', desc: 'Café molido que exfolia suave y despierta en la ducha de la mañana. Una o dos veces por semana alcanza.', ficha: [['Ingredientes clave', 'Café molido'], ['Ideal para', 'Piel grasa o mixta'], ['Uso', 'Cuerpo'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'champu-romero', nombre: 'Champú de romero', cat: 'cabello', pres: 'Frasco de 500 ml con válvula', precio: 12900, descuento: 0, stock: 14, ing: ['romero'], piel: [], rango: 8, alta: 20260920, img: 'p-champu-romero', alt: 'Frasco ámbar de champú con válvula negra junto a una toalla blanca', corto: 'Cabello graso · Uso diario', desc: 'Champú suave con extracto de romero, en frasco ámbar con válvula. Limpia sin resecar y deja el cuero cabelludo fresco.', ficha: [['Ingredientes clave', 'Romero'], ['Ideal para', 'Cabello graso o normal'], ['Uso', 'Masajeá, dejá actuar un minuto y enjuagá'], ['Presentación', 'Frasco ámbar de 500 ml']] },
  { id: 'jabon-arcilla-romero', nombre: 'Jabón de arcilla verde y romero', cat: 'jabones', pres: 'Barra de 100 g', precio: 6200, descuento: 0, stock: 0, ing: ['romero'], piel: ['grasa'], rango: 9, alta: 20260901, img: 'p-arcilla-romero', alt: 'Barra de jabón verde de arcilla y romero en una caja con papel seda', corto: 'Purificante · Para piel grasa', desc: 'Arcilla verde y romero para pieles grasas o con brillo. Limpia en profundidad sin dejar la piel tirante.', ficha: [['Ingredientes clave', 'Arcilla verde y romero'], ['Ideal para', 'Piel grasa'], ['Uso', 'Cuerpo y cara'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'jabon-karite-petalos', nombre: 'Jabón de karité con pétalos', cat: 'jabones', pres: 'Barra de 100 g', precio: 6900, descuento: 0, stock: 8, ing: ['karite'], piel: ['seca', 'sensible'], rango: 10, alta: 20261018, img: 'p-karite-petalos', alt: 'Jabones blancos con pimpollos de rosa secos sobre una jabonera, en un estante de madera', corto: 'Cremoso · Con rosas secas', desc: 'Manteca de karité y pimpollos de rosa secos. Una barra cremosa, linda para regalar o para tener a la vista en el baño.', ficha: [['Ingredientes clave', 'Manteca de karité'], ['Ideal para', 'Piel seca o sensible'], ['Uso', 'Cuerpo y manos'], ['Cuidado', 'Dejalo secar en una jabonera que drene']] },
  { id: 'acondicionador-coco', nombre: 'Acondicionador de coco', cat: 'cabello', pres: 'Frasco de 400 ml', precio: 12900, descuento: 0, stock: 11, ing: ['coco'], piel: [], rango: 11, alta: 20260920, img: 'p-acondicionador-coco', alt: 'Frasco blanco de acondicionador sobre la mesada, junto a un peine de bambú', corto: 'Desenreda · Cabello seco', desc: 'Aceite de coco para desenredar y dar brillo. Se aplica de medios a puntas y se enjuaga.', ficha: [['Ingredientes clave', 'Coco'], ['Ideal para', 'Cabello seco o con frizz'], ['Uso', 'De medios a puntas, después del champú'], ['Presentación', 'Frasco de 400 ml']] },
  { id: 'trio-jabones', nombre: 'Trío de jabones', cat: 'regalos', pres: '3 barras de 100 g', precio: 16900, descuento: 0, stock: 9, ing: ['lavanda', 'calendula', 'romero'], piel: TODA_PIEL, rango: 12, alta: 20261001, img: 'p-trio', alt: 'Tres jabones apilados de lavanda, caléndula y arcilla verde sobre una jabonera', corto: 'Regalo · Lavanda, caléndula y romero', desc: 'Tres barras para probar: lavanda, caléndula y arcilla verde con romero. Un regalo chico que siempre queda bien.', ficha: [['Incluye', '3 jabones de 100 g'], ['Variedades', 'Lavanda, caléndula, arcilla y romero'], ['Ideal para', 'Regalar o probar'], ['Entrega', 'Atadas con cordón']] },
  { id: 'duo-cabello', nombre: 'Dúo champú + acondicionador', cat: 'cabello', pres: '2 frascos con tapa de bambú', precio: 23900, descuento: 0, stock: 7, ing: ['romero', 'coco'], piel: [], rango: 13, alta: 20261010, img: 'p-duo-cabello', alt: 'Dos frascos con tapa de bambú, uno de champú dorado y otro de acondicionador blanco', corto: 'Rutina completa · Tapa de bambú', desc: 'Champú de romero y acondicionador de coco en frascos con tapa de bambú, para tener la rutina del cabello completa.', ficha: [['Incluye', 'Champú y acondicionador'], ['Ingredientes clave', 'Romero y coco'], ['Ideal para', 'Todo tipo de cabello'], ['Presentación', 'Frascos con tapa de bambú']] },
  { id: 'crema-karite', nombre: 'Crema corporal de karité', cat: 'cremas', pres: 'Pote de 200 g', precio: 14500, descuento: 0, stock: 13, ing: ['karite'], piel: ['seca', 'sensible'], rango: 14, alta: 20260925, img: 'p-crema-karite', alt: 'Pote blanco de crema corporal abierto sobre una mesada de granito', corto: 'Hidratación profunda', desc: 'Crema espesa con manteca de karité que se absorbe rápido. Para brazos, piernas y codos secos, después de la ducha.', ficha: [['Ingredientes clave', 'Manteca de karité'], ['Ideal para', 'Piel seca o sensible'], ['Uso', 'Sobre la piel húmeda, después de la ducha'], ['Presentación', 'Pote de 200 g']] },
  { id: 'aceite-rosa-mosqueta', nombre: 'Aceite de rosa mosqueta', cat: 'cremas', pres: 'Gotero de 30 ml', precio: 11900, descuento: 0, stock: 2, ing: ['rosa-mosqueta'], piel: ['seca', 'mixta'], rango: 15, alta: 20261008, img: 'p-aceite-rosa', alt: 'Frasco ámbar con gotero y aceite derramado sobre mármol, junto a hojas secas', corto: 'Puro · Con gotero', desc: 'Aceite de rosa mosqueta en frasco ámbar con gotero. Unas gotas por la noche en la cara, cicatrices o estrías.', ficha: [['Ingredientes clave', 'Rosa mosqueta'], ['Ideal para', 'Piel seca o mixta'], ['Uso', '2 o 3 gotas por la noche'], ['Presentación', 'Frasco ámbar de 30 ml']] },
  { id: 'balsamo-labial', nombre: 'Bálsamo labial de karité', cat: 'cremas', pres: 'Barra de 5 g', precio: 4200, descuento: 0, stock: 30, ing: ['karite', 'coco'], piel: ['seca'], rango: 16, alta: 20260901, img: 'p-balsamo', alt: 'Mujer aplicándose un bálsamo labial en barra blanca', corto: 'Labios secos · Para la cartera', desc: 'Bálsamo de karité y coco en barra, para labios secos o paspados. Entra en cualquier bolsillo.', ficha: [['Ingredientes clave', 'Karité y coco'], ['Ideal para', 'Labios secos'], ['Uso', 'Las veces que haga falta'], ['Presentación', 'Barra de 5 g']] },
  { id: 'jabon-liquido-manos', nombre: 'Jabón líquido de manos', cat: 'higiene', pres: 'Frasco de 500 ml con válvula', precio: 9900, descuento: 0, stock: 20, ing: ['aloe'], piel: TODA_PIEL, rango: 17, alta: 20260910, img: 'p-jabon-liquido', alt: 'Frasco transparente de jabón líquido con válvula blanca sobre una bandeja de cerámica', corto: 'Con aloe · Para el lavabo', desc: 'Jabón líquido transparente con aloe vera, para tener en el baño o en la cocina. Lava sin resecar las manos.', ficha: [['Ingredientes clave', 'Aloe vera'], ['Ideal para', 'Todo tipo de piel'], ['Uso', 'Manos'], ['Presentación', 'Frasco de 500 ml con válvula']] },
  { id: 'desodorante-natural', nombre: 'Desodorante natural en barra', cat: 'higiene', pres: 'Barra de 75 g', precio: 7900, descuento: 0, stock: 16, ing: ['coco'], piel: ['sensible'], rango: 18, alta: 20261002, img: 'p-desodorante', alt: 'Desodorante en barra blanco sobre una rodaja de madera', corto: 'Sin alcohol · Aroma suave', desc: 'Desodorante en barra a base de aceite de coco, sin alcohol. Se aplica sobre la piel limpia y seca.', ficha: [['Ingredientes clave', 'Coco'], ['Ideal para', 'Piel sensible'], ['Uso', 'Sobre la piel limpia y seca'], ['Presentación', 'Barra de 75 g']] },
  { id: 'cepillo-bambu', nombre: 'Cepillo de dientes de bambú', cat: 'higiene', pres: 'Mango de bambú, cerdas suaves', precio: 3500, descuento: 0, stock: 40, ing: [], piel: [], rango: 19, alta: 20260901, img: 'p-cepillo', alt: 'Tres cepillos de dientes de bambú con cerdas negras y naturales sobre fondo beige', corto: 'Cerdas suaves · Mango de bambú', desc: 'Cepillo con mango de bambú y cerdas suaves. Se cambia cada tres meses, como cualquier cepillo.', ficha: [['Material', 'Mango de bambú'], ['Cerdas', 'Suaves'], ['Uso', 'Cambialo cada 3 meses'], ['Presentación', 'Unidad']] },
  { id: 'esponja-vegetal', nombre: 'Esponja vegetal', cat: 'higiene', pres: 'Luffa natural con cordón', precio: 4900, descuento: 0, stock: 25, ing: [], piel: ['grasa', 'mixta'], rango: 20, alta: 20260915, img: 'p-esponja', alt: 'Mano pasando una esponja vegetal de luffa por el hombro', corto: 'Exfolia en la ducha', desc: 'Esponja de luffa con cordón para colgar. Exfolia suave y se seca rápido entre usos.', ficha: [['Material', 'Luffa natural'], ['Ideal para', 'Piel grasa o mixta'], ['Uso', 'Una o dos veces por semana'], ['Cuidado', 'Colgala para que se seque']] },
  { id: 'sales-de-bano', nombre: 'Sales de baño con lavanda', cat: 'higiene', pres: 'Frasco de 500 g', precio: 8500, descuento: 0, stock: 12, ing: ['lavanda'], piel: TODA_PIEL, rango: 21, alta: 20261014, img: 'p-sales', alt: 'Manos volcando sales de baño gruesas desde un bol de vidrio en la bañera', corto: 'Para el baño de inmersión', desc: 'Sales gruesas con lavanda para un baño de inmersión o para remojar los pies al final del día.', ficha: [['Ingredientes clave', 'Sal gruesa y lavanda'], ['Ideal para', 'Todo tipo de piel'], ['Uso', 'Un puñado en el agua tibia'], ['Presentación', 'Frasco de 500 g']] },
  { id: 'jabon-miel-propoleo', nombre: 'Jabón de miel y propóleo', cat: 'jabones', pres: 'Barra de 100 g', precio: 6200, descuento: 0, stock: 0, ing: [], piel: [], rango: 99, alta: 20250101, visible: false, img: 'p-avena-miel', alt: '', corto: '', desc: '', ficha: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261008;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const foto = (p, chica) => `images/${p.img}${chica ? '-480' : ''}.webp`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), ing = lista(f.ing), piel = lista(f.piel), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (ing.length && !ing.some(i => p.ing.includes(i))) return false;
    if (piel.length && !piel.some(i => p.piel.includes(i))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioFinal(p);
      if (v < min || v > max) return false;
    }
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
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
    textoBusqueda.set(p.id, norm([
      p.nombre, p.pres, catDe(p.cat)?.nombre, p.corto, p.desc, ...p.ficha.map(f => f[1]),
      ...p.ing.map(i => INGREDIENTES[i]), ...p.piel.map(i => PIELES[i]),
      p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
      if (coincideBusqueda(p, palabras)) {
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

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'bellezanatural_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
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

const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const WSP_ICO = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"></use></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = p => wa(`¡Hola Belleza natural! Quiero consultar por ${p.nombre} (${p.pres}).`);

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">−${p.descuento}%</span></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Belleza natural! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;

function cardV(p, anim = true) {
  const acc = p.stock > 0
    ? `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('cart')}<span>Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard"${anim ? ` ${ANIM_SUBIR}` : ''}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, true)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="(min-width: 1100px) 300px, (min-width: 761px) 33vw, 50vw" alt="${esc(p.alt)}" width="480" height="480"></button>
    <div class="pcard__body">
      <p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pcard__pres">${esc(p.pres)}</p>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}

function cardT(p, grande = false) {
  const add = p.stock > 0
    ? `<button type="button" class="ptile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('plus')}</button>`
    : '<span class="ptile__sin">Sin stock</span>';
  return `<article class="ptile" ${ANIM_SUBIR}>
    <button type="button" class="ptile__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, !grande)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="${grande ? '(min-width: 901px) 50vw, 100vw' : '(min-width: 901px) 25vw, 50vw'}" alt="${esc(p.alt)}" width="480" height="480"></button>
    <div class="ptile__info">
      <div><p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p><h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>${precioHTML(p)}</div>
      ${add}
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-drop__btn')?.focus();
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

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 901px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  const txt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  const pintar = (sel, clave, filtro) => document.querySelectorAll(sel).forEach(el => {
    const n = Tienda.contar({ [filtro]: el.dataset[clave] });
    el.textContent = el.closest('.chk') ? n : txt(n);
  });
  pintar('[data-cuenta-cat]', 'cuentaCat', 'cat');
  pintar('[data-cuenta-ing]', 'cuentaIng', 'ing');
  pintar('[data-cuenta-piel]', 'cuentaPiel', 'piel');
}

function destacados(n) {
  const items = Tienda.consultar({ orden: 'destacados', filtros: { stock: true }, limite: n }).items;
  items.forEach(cachear);
  return items;
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  track.innerHTML = destacados(8).map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardV(p, false)}</div>`).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 18;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; startScroll = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId !== e.pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
    vp.classList.remove('dragging');
    if (moved) vp.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const excluir = destacados(8).map(p => p.id);
  const items = Tienda.consultar({ filtros: { excluir }, orden: 'nuevos', limite: 8 }).items;
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const ids = (cont.dataset.mosaico || '').split(',').filter(Boolean);
  const items = ids.length ? Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: 5 }).items : destacados(5);
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => cardT(p, i === 0)).join('');
}

function initGuia() {
  const root = document.querySelector('[data-guia]');
  if (!root) return;
  const lista = root.querySelector('[data-guia-lista]');
  const tip = root.querySelector('[data-guia-tip]');
  const ver = root.querySelector('[data-guia-ver]');
  const base = paginaCatalogo();
  const pintar = (piel, animar) => {
    const items = Tienda.consultar({ filtros: { piel: [piel], stock: true }, orden: 'destacados', limite: 3 }).items;
    items.forEach(cachear);
    const total = Tienda.contar({ piel: [piel] });
    tip.textContent = PIEL_TIPS[piel];
    lista.innerHTML = items.map(p => `<li class="guia__item">
      <button type="button" class="guia__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${foto(p, true)}" alt="${esc(p.alt)}" width="480" height="480"></button>
      <div><p class="guia__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></p><p class="guia__por">${esc(p.corto)}</p>${precioHTML(p)}</div>
      <button type="button" class="btn btn--cta btn--sm" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button>
    </li>`).join('');
    ver.href = `${base}?piel=${piel}`;
    ver.querySelector('span').textContent = `Ver los ${total} productos para ${PIELES[piel].toLowerCase()}`;
    if (animar && !reduceMotion) { lista.classList.remove('cambia'); void lista.offsetWidth; lista.classList.add('cambia'); }
    refrescarST();
  };
  root.addEventListener('change', e => {
    const i = e.target.closest('input[name="piel"]');
    if (i && PIELES[i.value]) pintar(i.value, true);
  });
  const inicial = root.querySelector('input[name="piel"]:checked')?.value || 'seca';
  pintar(inicial, false);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const esM2 = document.body.dataset.modelo === '2';
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const chips = document.querySelector('[data-chips-cat]');
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), ing: Object.keys(INGREDIENTES), piel: Object.keys(PIELES) };
  const estado = { cat: [], ing: [], piel: [], precio: '', stock: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.ing = listaURL('ing');
  estado.piel = listaURL('piel');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';

  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="">Todo <small>${Tienda.contar({})}</small></button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  }

  const filtrosDe = () => ({ cat: estado.cat, ing: estado.ing, piel: estado.piel, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.ing.length) p.set('ing', estado.ing.join(','));
    if (estado.piel.length) p.set('piel', estado.piel.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    try { window.history.replaceState(null, '', s ? `?${s}` : location.pathname); } catch { /* file:// */ }
  };
  const sincronizarUI = () => {
    filtrosEl.querySelectorAll('input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    filtrosEl.querySelectorAll('input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    chips?.querySelectorAll('[data-chip]').forEach(b => {
      const v = b.dataset.chip;
      b.setAttribute('aria-pressed', String(v ? estado.cat.length === 1 && estado.cat[0] === v : !estado.cat.length));
    });
    const n = (esM2 ? 0 : estado.cat.length) + estado.ing.length + estado.piel.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (esM2 ? cardT(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'producto' : 'productos'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    estado.cat = b.dataset.chip ? [b.dataset.chip] : [];
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], ing: [], piel: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const drawerFiltros = () => esM2 || window.matchMedia('(max-width: 1024px)').matches;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    filtrosEl.setAttribute('role', 'dialog');
    filtrosEl.setAttribute('aria-modal', 'true');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    filtrosEl.removeAttribute('role');
    filtrosEl.removeAttribute('aria-modal');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => { if (!drawerFiltros()) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p) {
  return `<div class="linea">
    <div class="linea__foto"><img src="${foto(p, true)}" alt="" width="480" height="480"></div>
    <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(p.pres)}</p></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}"><button type="button" data-linea-step="-1" data-id="${p.id}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= p.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Belleza natural! Vi la web y quiero hacer una consulta.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${p.nombre} (${p.pres}) — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  return wa(`¡Hola Belleza natural! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Elegí un jabón, una crema o lo que necesites para tu rutina.</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (selector && drawer) (drawer.querySelector(selector) || drawer.querySelector('button:not([disabled])'))?.focus();
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const comprar = p.stock > 0
    ? `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al carrito</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} unidades</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  const rasgos = [...p.ing.map(i => `<span class="rasgo">${INGREDIENTES[i]}</span>`), ...p.piel.map(i => `<span class="rasgo rasgo--piel">${PIELES[i]}</span>`)].join('');
  return `<figure class="qv__foto"><img src="${foto(p)}" alt="${esc(p.alt)}" width="900" height="900"></figure>
  <div class="qv__info">
    <p class="pcard__cat">${esc(cat?.nombre)} · ${esc(p.corto)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="pcard__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${rasgos ? `<div class="qv__ings">${rasgos}</div>` : ''}
    <dl class="ficha-dl">${p.ficha.map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    ${comprar}
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${foto(r, true)}" alt="" width="480" height="480"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  qv.querySelector('.qv__panel').setAttribute('aria-label', `Detalle: ${p.nombre}`);
  document.getElementById('ldProducto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ldProducto';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(foto(p), location.href).href, description: p.desc,
    category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
  document.head.appendChild(ld);
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  document.getElementById('ldProducto')?.remove();
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const it = Cart.get().find(i => i.id === t.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const st = t.closest('.pcard, .qv__comprar')?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
    if (enCarrito >= p.stock) { showToast(`Ya tenés todas las unidades de ${p.nombre} en el carrito`); return; }
    Cart.add(p, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${p.nombre} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero .trazo'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id, null);
}

initCuentas();
initNavDrop();
initRail();
initPreview();
initMosaico();
initGuia();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initFloats();
Cart.syncStock();
updateCartBadge();
renderCarrito();
initDelegacion();
initHeroMotion();
abrirDesdeURL();
