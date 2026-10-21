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

const WSP = '5493816170471';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const LINEAS = {
  omnilife: { nombre: 'Omnilife', rubro: 'Nutrición', titulo: 'Nutrición Omnilife', bajada: 'Batidos, bebidas en polvo, sobres e infusiones para sumar a tu alimentación de todos los días.' },
  seytu: { nombre: 'Seytu', rubro: 'Cosmética', titulo: 'Cosmética Seytu', bajada: 'Cuidado facial, maquillaje y cuidado capilar, con productos para cada paso de tu rutina.' },
};
const CATEGORIAS = [
  { id: 'nutricion', nombre: 'Nutrición', linea: 'omnilife', img: 'images/cat-nutricion.webp', bajada: 'Batidos, bebidas en polvo, sobres e infusiones para sumar a tu día.' },
  { id: 'facial', nombre: 'Cuidado facial', linea: 'seytu', img: 'images/cat-facial.webp', bajada: 'Limpieza, sérum y cremas para tu rutina de la mañana y de la noche.' },
  { id: 'maquillaje', nombre: 'Maquillaje', linea: 'seytu', img: 'images/cat-maquillaje.webp', bajada: 'Base, polvo, rubor, sombras y labiales, con tonos para elegir.' },
  { id: 'capilar', nombre: 'Cuidado capilar', linea: 'seytu', img: 'images/cat-capilar.webp', bajada: 'Shampoo, acondicionador, mascarilla y aceite para tu tipo de pelo.' },
];
const FORMATOS = { polvo: 'Polvo', sobres: 'Sobres y saquitos', liquido: 'Líquido', crema: 'Crema', aceite: 'Sérum y aceite', compacto: 'Compacto', barra: 'Barra' };
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 20000 },
  '20a35': { nombre: '$20.000 a $35.000', min: 20001, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const NUEVO_DESDE = 24;

const PRODUCTOS = [
  { id: 'batido-nutricional', nombre: 'Batido nutricional', cat: 'nutricion', formato: 'polvo', pres: 'Lata · 600 g', precio: 52900, stock: 12, rango: 1, alta: 20,
    opciones: { nombre: 'Sabor', plural: 'sabores', boton: 'Elegir sabor', valores: ['Vainilla', 'Chocolate', 'Frutilla'] },
    img: 'images/p-batido-vainilla.webp', alt: 'Lata blanca de batido nutricional con tapa violeta sobre mármol lila',
    desc: 'Polvo para preparar batidos con agua o leche. Se disuelve fácil y viene en tres sabores.', uso: 'Mezclá dos medidas en un vaso de agua o leche y batí unos segundos.', tags: ['licuado', 'desayuno', 'merienda'] },
  { id: 'serum-facial', nombre: 'Sérum facial', cat: 'facial', formato: 'aceite', pres: 'Gotero · 30 ml', precio: 41900, stock: 8, rango: 2, alta: 25,
    img: 'images/p-serum-facial.webp', alt: 'Frasco gotero de sérum facial ámbar sobre una piedra clara',
    desc: 'Sérum de textura liviana que se absorbe rápido. Va después de la limpieza y antes de la crema.', uso: 'Tres o cuatro gotas sobre el rostro limpio, a la mañana y a la noche.', tags: ['serum', 'gotero', 'rostro', 'piel'] },
  { id: 'bebida-sobres', nombre: 'Bebida en polvo en sobres', cat: 'nutricion', formato: 'sobres', pres: 'Caja · 30 sobres', precio: 38500, descuento: 10, stock: 18, rango: 3, alta: 18,
    opciones: { nombre: 'Sabor', plural: 'sabores', boton: 'Elegir sabor', valores: ['Frutos rojos', 'Mango', 'Limón'] },
    img: 'images/p-bebida-sobres.webp', alt: 'Sobres individuales de bebida en polvo, dos violetas y uno crema',
    desc: 'Sobres individuales para preparar en una botella de agua. Prácticos para llevar en la cartera o la mochila.', uso: 'Disolvé un sobre en 500 ml de agua fría y agitá.', tags: ['sobre', 'monodosis', 'agua'] },
  { id: 'crema-hidratante', nombre: 'Crema facial hidratante', cat: 'facial', formato: 'crema', pres: 'Pote · 50 g', precio: 39900, stock: 11, rango: 4, alta: 19,
    img: 'images/p-crema-hidratante.webp', alt: 'Pote de crema facial abierto con tapa dorada sobre una piedra lila',
    desc: 'Crema de textura suave para el día. Deja la piel lista para el maquillaje.', uso: 'Después del sérum, aplicá una capa fina en rostro y cuello.', tags: ['crema', 'dia', 'rostro', 'piel'] },
  { id: 'polvo-compacto', nombre: 'Polvo compacto', cat: 'maquillaje', formato: 'compacto', pres: 'Estuche con espejo · 10 g', precio: 24900, stock: 12, rango: 5, alta: 17,
    opciones: { nombre: 'Tono', plural: 'tonos', boton: 'Elegir tono', valores: ['Claro', 'Medio', 'Trigueño'] },
    img: 'images/p-polvo-compacto.webp', alt: 'Polvo compacto en estuche dorado abierto con espejo, sobre fondo lila',
    desc: 'Polvo para sellar la base y retocar durante el día. El estuche trae espejo.', uso: 'Con la esponja del estuche, a toques suaves sobre la base.', tags: ['polvo', 'sellar', 'retoque'] },
  { id: 'duo-capilar', nombre: 'Shampoo y acondicionador', cat: 'capilar', formato: 'liquido', pres: 'Dúo · 2 × 400 ml', precio: 33900, stock: 10, rango: 6, alta: 21,
    opciones: { nombre: 'Tipo de pelo', plural: 'versiones', boton: 'Elegir versión', valores: ['Normal', 'Seco', 'Graso'] },
    img: 'images/p-duo-capilar.webp', alt: 'Frascos de shampoo y acondicionador blancos con tapa violeta en un estante de baño',
    desc: 'Shampoo y acondicionador que se venden juntos, en versión para tu tipo de pelo.', uso: 'Shampoo sobre el pelo mojado; enjuagá y aplicá el acondicionador de medios a puntas.', tags: ['shampoo', 'acondicionador', 'pelo', 'cabello'] },
  { id: 'labial-cremoso', nombre: 'Labial cremoso', cat: 'maquillaje', formato: 'barra', pres: 'Barra · 3,5 g', precio: 16900, stock: 20, rango: 7, alta: 16,
    opciones: { nombre: 'Tono', plural: 'tonos', boton: 'Elegir tono', valores: ['Nude rosado', 'Malva', 'Rojo'] },
    img: 'images/p-labial.webp', alt: 'Labial cremoso rosado en estuche dorado sobre fondo lila',
    desc: 'Labial de textura cremosa y color pleno desde la primera pasada.', uso: 'Aplicá directo desde la barra; para un color más suave, a toques con el dedo.', tags: ['labios', 'lapiz labial', 'rouge'] },
  { id: 'batido-proteico', nombre: 'Batido proteico con vaso mezclador', cat: 'nutricion', formato: 'polvo', pres: 'Pote · 450 g + vaso', precio: 46900, stock: 6, rango: 8, alta: 26,
    img: 'images/p-batido-proteico.webp', alt: 'Vaso mezclador con batido preparado junto a un sobre de polvo',
    desc: 'Proteína en polvo sabor chocolate que viene con su vaso mezclador con tapa.', uso: 'Poné una medida en el vaso con agua o leche, tapá y agitá.', tags: ['proteina', 'shaker', 'chocolate'] },
  { id: 'emulsion-limpiadora', nombre: 'Emulsión limpiadora facial', cat: 'facial', formato: 'liquido', pres: 'Frasco con válvula · 200 ml', precio: 24900, stock: 14, rango: 9, alta: 14,
    img: 'images/p-emulsion-limpiadora.webp', alt: 'Frasco blanco de emulsión limpiadora con válvula junto a una toalla',
    desc: 'Textura cremosa para limpiar el rostro y retirar el maquillaje. Pensada para piel normal a seca.', uso: 'Aplicá con los dedos sobre la piel seca, masajeá y retirá con agua tibia.', tags: ['limpieza', 'desmaquillante', 'rostro'] },
  { id: 'base-liquida', nombre: 'Base de maquillaje líquida', cat: 'maquillaje', formato: 'liquido', pres: 'Frasco con válvula · 30 ml', precio: 29900, stock: 9, rango: 10, alta: 22,
    opciones: { nombre: 'Tono', plural: 'tonos', boton: 'Elegir tono', valores: ['Claro', 'Medio', 'Trigueño'] },
    img: 'images/p-base-liquida.webp', alt: 'Frasco de base líquida con válvula junto a un corrector y una esponja',
    desc: 'Base de cobertura media y terminación natural, con válvula para dosificar.', uso: 'Aplicá con esponja o pincel, del centro del rostro hacia afuera.', tags: ['base', 'cobertura'] },
  { id: 'mascarilla-capilar', nombre: 'Mascarilla capilar', cat: 'capilar', formato: 'crema', pres: 'Pote · 250 g', precio: 26900, stock: 8, rango: 11, alta: 15,
    img: 'images/p-mascarilla-capilar.webp', alt: 'Dos potes de mascarilla capilar sobre mármol junto a un ramo de lavanda',
    desc: 'Tratamiento de textura cremosa para usar una o dos veces por semana.', uso: 'Después del shampoo, de medios a puntas; dejá actuar 5 minutos y enjuagá.', tags: ['mascara', 'tratamiento', 'pelo', 'cabello'] },
  { id: 'crema-noche', nombre: 'Crema de noche', cat: 'facial', formato: 'crema', pres: 'Pote · 50 g', precio: 42900, stock: 3, rango: 12, alta: 27,
    img: 'images/p-crema-noche.webp', alt: 'Pote blanco de crema de noche sobre una mesada clara',
    desc: 'Crema de textura más rica, para el último paso de tu rutina de la noche.', uso: 'Sobre la piel limpia, antes de dormir.', tags: ['crema', 'noche', 'rostro', 'piel'] },
  { id: 'rubor-compacto', nombre: 'Rubor compacto', cat: 'maquillaje', formato: 'compacto', pres: 'Pastilla · 5 g', precio: 19900, descuento: 15, stock: 7, rango: 13, alta: 13,
    img: 'images/p-rubor.webp', alt: 'Pastillas de rubor en tonos rosados sobre una superficie blanca',
    desc: 'Rubor en polvo de tono rosado suave, fácil de difuminar.', uso: 'Con pincel, sobre la parte alta de las mejillas, hacia las sienes.', tags: ['rubor', 'mejillas', 'rosado'] },
  { id: 'proteina-frutilla', nombre: 'Proteína en polvo sabor frutilla', cat: 'nutricion', formato: 'polvo', pres: 'Pote · 450 g', precio: 41900, stock: 9, rango: 14, alta: 12,
    img: 'images/p-proteina-frutilla.webp', alt: 'Pote blanco de proteína en polvo con un medidor y polvo rosado',
    desc: 'Proteína en polvo sabor frutilla, con medidor adentro del pote.', uso: 'Una medida en un vaso de leche o en un licuado de frutas.', tags: ['proteina', 'licuado', 'frutilla'] },
  { id: 'infusion-hierbas', nombre: 'Infusión de hierbas', cat: 'nutricion', formato: 'sobres', pres: 'Caja · 30 saquitos', precio: 18900, stock: 22, rango: 15, alta: 23,
    img: 'images/p-infusion-hierbas.webp', alt: 'Taza de vidrio con infusión de hierbas y flores secas sobre fondo verde agua',
    desc: 'Mezcla de hierbas en saquitos, para tomar caliente o con hielo.', uso: 'Un saquito en una taza de agua caliente, de 3 a 5 minutos.', tags: ['te', 'saquitos', 'hierbas'] },
  { id: 'espuma-limpiadora', nombre: 'Espuma limpiadora facial', cat: 'facial', formato: 'liquido', pres: 'Frasco espumador · 150 ml', precio: 23900, stock: 10, rango: 16, alta: 24,
    img: 'images/p-espuma-limpiadora.webp', alt: 'Dos frascos blancos de espuma limpiadora con válvula sobre una toalla',
    desc: 'Espuma liviana para limpiar el rostro a la noche, pensada para piel mixta a grasa.', uso: 'Dos disparos sobre las manos húmedas, masajeá el rostro y enjuagá.', tags: ['limpieza', 'espuma', 'rostro'] },
  { id: 'paleta-sombras', nombre: 'Paleta de sombras', cat: 'maquillaje', formato: 'compacto', pres: 'Paleta · 12 tonos', precio: 34900, stock: 5, rango: 17, alta: 11,
    img: 'images/p-sombras.webp', alt: 'Paleta de doce sombras en tonos tierra con dos pinceles',
    desc: 'Doce sombras en tonos tierra, mates y satinadas, para looks de día y de noche.', uso: 'Usá un tono claro en todo el párpado y uno más oscuro en el pliegue.', tags: ['sombras', 'ojos', 'paleta'] },
  { id: 'aceite-capilar', nombre: 'Aceite capilar', cat: 'capilar', formato: 'aceite', pres: 'Gotero · 30 ml', precio: 21900, stock: 13, rango: 18, alta: 10,
    img: 'images/p-aceite-capilar.webp', alt: 'Dos frascos gotero de aceite capilar sobre un espejo redondo con flores secas',
    desc: 'Unas gotas para las puntas, con el pelo húmedo o seco.', uso: 'Frotá 2 o 3 gotas entre las manos y aplicalas en las puntas.', tags: ['aceite', 'puntas', 'pelo', 'cabello'] },
  { id: 'iluminador-compacto', nombre: 'Iluminador compacto', cat: 'maquillaje', formato: 'compacto', pres: 'Estuche · 8 g', precio: 22900, stock: 0, rango: 19, alta: 9,
    img: 'images/p-iluminador.webp', alt: 'Iluminador compacto rosado en estuche negro junto a un labial',
    desc: 'Polvo iluminador de brillo suave en tono champagne rosado.', uso: 'Con pincel, a toques sobre pómulos, arco de la ceja y nariz.', tags: ['iluminador', 'brillo'] },
  { id: 'borrador-crema-corporal', nombre: 'Crema corporal (borrador)', cat: 'facial', formato: 'crema', pres: '-', precio: 20000, stock: 1, rango: 0, alta: 1, visible: false,
    img: 'images/p-crema-noche.webp', alt: '', desc: '', uso: '', tags: [] },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
  p.linea = CATEGORIAS.find(c => c.id === p.cat)?.linea || 'seytu';
});

const RUTINAS = [
  { id: 'dia', nombre: 'Piel de día', pasos: [
    ['Limpiá', 'emulsion-limpiadora', 'Sobre la piel seca: masajeá y enjuagá con agua tibia.'],
    ['Tratá', 'serum-facial', 'Tres o cuatro gotas, antes de la crema.'],
    ['Hidratá', 'crema-hidratante', 'Una capa fina en rostro y cuello, y lista para el maquillaje.'],
  ] },
  { id: 'noche', nombre: 'Piel de noche', pasos: [
    ['Limpiá', 'espuma-limpiadora', 'Para sacar el día de la piel antes de dormir.'],
    ['Tratá', 'serum-facial', 'El mismo sérum de la mañana.'],
    ['Nutrí', 'crema-noche', 'El último paso, con una textura más rica.'],
  ] },
  { id: 'maquillaje', nombre: 'Maquillaje', pasos: [
    ['Base', 'base-liquida', 'Del centro del rostro hacia afuera.'],
    ['Sellá', 'polvo-compacto', 'A toques suaves, para que dure todo el día.'],
    ['Color', 'labial-cremoso', 'El toque final, en el tono que elijas.'],
  ] },
  { id: 'cabello', nombre: 'Cabello', pasos: [
    ['Lavá', 'duo-capilar', 'En la versión para tu tipo de pelo.'],
    ['Tratá', 'mascarilla-capilar', 'Una o dos veces por semana, después del shampoo.'],
    ['Terminá', 'aceite-capilar', 'Dos o tres gotas en las puntas.'],
  ] },
  { id: 'nutricion', nombre: 'Nutrición', pasos: [
    ['Desayuno', 'batido-nutricional', 'Con agua o leche, listo en un minuto.'],
    ['Durante el día', 'bebida-sobres', 'Un sobre en tu botella de agua.'],
    ['A la tarde', 'infusion-hierbas', 'Caliente o con hielo.'],
  ] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), linea = lista(f.linea), formatos = lista(f.formatos), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (linea.length && !linea.includes(p.linea)) return false;
    if (formatos.length && !formatos.includes(p.formato)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const sinStockAlFinal = (a, b) => (b.stock > 0) - (a.stock > 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => sinStockAlFinal(a, b) || b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => sinStockAlFinal(a, b) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
      p.nombre, catDe(p.cat)?.nombre, LINEAS[p.linea]?.nombre, LINEAS[p.linea]?.rubro, FORMATOS[p.formato], p.pres, p.desc,
      ...(p.opciones?.valores || []), ...(p.tags || []), p.descuento > 0 ? 'oferta descuento' : '',
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'omnilifeyseytu_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string' && i.qty > 0).map(i => ({ id: i.id, v: String(i.v || ''), qty: i.qty })) : [];
    } catch { return []; }
  },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    const libre = (producto.stock ?? 0) - this.enCarrito(producto.id);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === (v || ''));
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, v: v || '', qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === (v || ''));
    if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 1) - otros));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  campana: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
const msgAviso = p => `Hola! Quiero que me avises cuando vuelva a haber «${p.nombre}».`;
const stepperHTML = (max, clase = '') => `<div class="stepper${clase ? ' ' + clase : ''}" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const nombreConVariante = (p, v) => (v ? `${p.nombre} (${v})` : p.nombre);

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="prod-add prod-add--aviso" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}<span>Avisame</span></a>`;
  if (p.opciones) return `<button type="button" class="prod-add" data-quick="${esc(p.id)}" aria-label="${esc(p.opciones.boton)}: ${esc(p.nombre)}">${ICO.bolsa}<span>${esc(p.opciones.boton)}</span></button>`;
  return `${p.stock > 1 ? stepperHTML(Math.min(p.stock, 10)) : ''}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>`;
}

function badgeHTML(p) {
  if (!(p.stock > 0)) return '<span class="etiqueta etiqueta--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (p.stock <= 3) return '<span class="etiqueta etiqueta--ultimas">Últimas unidades</span>';
  if (p.alta >= NUEVO_DESDE) return '<span class="etiqueta etiqueta--nuevo">Nuevo</span>';
  return '';
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sin = !(p.stock > 0);
  const lin = LINEAS[p.linea];
  const extra = p.opciones ? ` · ${plural(p.opciones.valores.length, p.opciones.nombre.toLowerCase(), p.opciones.plural)}` : '';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sin ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200"></a>
    ${badgeHTML(p)}
    ${sin ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <p class="pcard__linea pcard__linea--${esc(p.linea)}">${esc(lin.nombre)}<span>${esc(catDe(p.cat)?.nombre)}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__pres">${esc(p.pres + extra)}</p>
    ${precioHTML(p)}
    <div class="prod-actions">${accionesHTML(p)}</div>
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${LINEAS[c.linea].nombre} · ${plural(n, 'producto', 'productos')}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = plural(Tienda.contar({ cat: el.dataset.cuentaCat }), 'producto', 'productos'); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-cuenta-linea]').forEach(el => { el.textContent = Tienda.contar({ linea: el.dataset.cuentaLinea }); });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const mosaico = cont.hasAttribute('data-mosaico');
    const ids = (cont.dataset.ids || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const filtros = ids.length ? { ids, stock: true } : { destacado: true, stock: true };
    const { items } = Tienda.consultar({ filtros, orden: ids.length ? 'ids' : 'destacados', limite });
    items.forEach(cachear);
    const total = Tienda.contar({});
    const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(32px)"><span class="mosaico__todo-tit">Ver los ${total} productos</span><span class="mosaico__todo-n">Nutrición, cuidado facial, maquillaje y cuidado capilar, con filtros por presentación y precio.</span>${ICO.flecha}</a>` : '';
    cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
  });
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, { qty = 1, v = '', comprar = false, silencioso = false } = {}) {
  const n = Cart.add(p, qty, v);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id)) { abrirCarrito(); return 0; }
    if (!silencioso) showToast(p.stock > 0 ? `Ya tenés en el carrito todo el stock de «${p.nombre}».` : `«${p.nombre}» está sin stock. Te aviso por WhatsApp cuando vuelva.`);
    return 0;
  }
  if (comprar) { abrirCarrito(); return n; }
  if (!silencioso) {
    showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}«${nombreConVariante(p, v)}» al carrito`);
    if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
  }
  return n;
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      if (p.opciones) { abrirQV(p.id, add); return; }
      sumarAlCarrito(p, { qty: leerCantidad(add.closest('.pcard')), comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvVariante = '';
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  if (qvActual?.id !== p.id) qvVariante = '';
  qvActual = p;
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
    brand: { '@type': 'Brand', name: LINEAS[p.linea].nombre }, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sin = !(p.stock > 0);
  const libre = p.stock - Cart.enCarrito(p.id);
  const ops = p.opciones && !sin ? `<fieldset class="qv__ops"><legend>${esc(p.opciones.nombre)}${qvVariante ? `: <b>${esc(qvVariante)}</b>` : ''}</legend><div class="ops">${p.opciones.valores.map(v => `<label class="op"><input type="radio" name="qvOp" value="${esc(v)}"${v === qvVariante ? ' checked' : ''}><span>${esc(v)}</span></label>`).join('')}</div><p class="qv__ops-aviso" data-ops-aviso hidden>Elegí ${p.opciones.nombre === 'Tipo de pelo' ? 'tu tipo de pelo' : 'un ' + esc(p.opciones.nombre.toLowerCase())} para seguir.</p></fieldset>` : '';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200">${badgeHTML(p)}<span class="qv__nota">Imagen ilustrativa</span></div>
    <div class="qv__info">
      <p class="pcard__linea pcard__linea--${esc(p.linea)} qv__linea">${esc(LINEAS[p.linea].nombre)}<span>${esc(catDe(p.cat)?.nombre)}</span></p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'precio qv__precio')}
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Presentación</dt><dd>${esc(p.pres)}</dd></div>
        <div><dt>Disponibles</dt><dd>${sin ? 'Sin stock por ahora' : p.stock <= 3 ? `Últimas ${p.stock} unidades` : 'Con stock'}</dd></div>
        <div class="qv__ficha-uso"><dt>Cómo se usa</dt><dd>${esc(p.uso)}</dd></div>
      </dl>
      ${ops}
      <div class="qv__acc">
        ${sin
          ? `<a class="btn btn--cta" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}Avisame cuando llegue</a>`
          : `${libre > 1 ? stepperHTML(Math.min(libre, 10), 'stepper--grande') : ''}
             <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya tenés todo el stock'}</button>
             <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola! Tengo una consulta sobre «${p.nombre}» de ${LINEAS[p.linea].nombre}.`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas sobre cómo usarlo? Consultá por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="300"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('change', e => {
    const op = e.target.closest('input[name="qvOp"]');
    if (!op) return;
    qvVariante = op.value;
    const legend = qv.querySelector('.qv__ops legend');
    if (legend && qvActual?.opciones) legend.innerHTML = `${esc(qvActual.opciones.nombre)}: <b>${esc(qvVariante)}</b>`;
    qv.querySelector('[data-ops-aviso]')?.setAttribute('hidden', '');
    qv.querySelector('.qv__ops')?.classList.remove('falta');
  });
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    if (p.opciones && !qvVariante) {
      const box = qv.querySelector('.qv__ops');
      box?.classList.remove('falta');
      void box?.offsetWidth;
      box?.classList.add('falta');
      qv.querySelector('[data-ops-aviso]')?.removeAttribute('hidden');
      qv.querySelector('input[name="qvOp"]')?.focus();
      return;
    }
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qty, qvVariante);
      if (!Cart.enCarrito(p.id)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, { qty, v: qvVariante });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
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
const claveLinea = i => `${i.id}|${i.v}`;
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.bolsa}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Todavía no sumaste productos. Empezá por tu rutina o mirá el catálogo.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas-cart">${items.map(i => {
    const p = getProducto(i.id);
    const tope = i.qty >= p.stock - (Cart.enCarrito(p.id) - i.qty);
    return `<li class="linea" data-linea="${esc(claveLinea(i))}">
      <img src="${esc(p.img)}" alt="" width="80" height="100">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${i.v ? `${esc(p.opciones?.nombre || 'Opción')}: ${esc(i.v)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${tope ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(nombreConVariante(p, i.v))}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${nombreConVariante(p, i.v)}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola! Quiero hacer este pedido de Omnilife y Seytu:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi zona para la entrega: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">Te confirmo la disponibilidad y coordinamos la entrega por WhatsApp.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const [id, v = ''] = linea.dataset.linea.split('|');
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, v, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(linea.dataset.linea)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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
  sync();
}

function initRutina() {
  const tabs = document.querySelector('[data-rutina-tabs]');
  const panel = document.querySelector('[data-rutina-panel]');
  if (!tabs || !panel) return;
  tabs.innerHTML = RUTINAS.map((r, i) => `<button type="button" class="tab" role="tab" id="rt-${r.id}" aria-controls="rutinaPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-rutina="${r.id}">${esc(r.nombre)}</button>`).join('');
  let actual = RUTINAS[0];
  const pasosDe = r => r.pasos.map(([verbo, id, tip]) => ({ verbo, tip, p: getProducto(id) })).filter(x => x.p);
  const pintar = r => {
    actual = r;
    panel.setAttribute('aria-labelledby', `rt-${r.id}`);
    const pasos = pasosDe(r);
    const conStock = pasos.filter(x => x.p.stock > 0);
    const total = conStock.reduce((s, x) => s + precioFinal(x.p), 0);
    const msg = `Hola! Me interesa la rutina «${r.nombre}»:\n${pasos.map((x, i) => `${i + 1}. ${x.verbo}: ${x.p.nombre}`).join('\n')}\n¿Me asesorás?`;
    panel.innerHTML = `<ol class="rpasos">${pasos.map((x, i) => `<li class="rpaso" data-animate="subir" style="opacity:0;transform:translateY(28px)">
      <h3 class="rpaso__n"><span>${i + 1}</span>${esc(x.verbo)}</h3>
      <div class="rpaso__prod">
        <span class="rpaso__foto"><img src="${esc(x.p.img)}" alt="" width="960" height="1200"></span>
        <div class="rpaso__info">
          <p class="rpaso__nombre"><button type="button" data-quick="${esc(x.p.id)}">${esc(x.p.nombre)}</button></p>
          <p class="rpaso__pres">${esc(x.p.pres)}</p>
          ${precioHTML(x.p)}
          ${x.p.opciones ? `<label class="rpaso__op"><span>${esc(x.p.opciones.nombre)}</span><select data-rutina-op="${esc(x.p.id)}">${x.p.opciones.valores.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>` : ''}
          <button type="button" class="rpaso__add" data-rutina-add="${esc(x.p.id)}"${x.p.stock > 0 ? '' : ' disabled'}>${ICO.mas}<span>${x.p.stock > 0 ? 'Agregar' : 'Sin stock'}</span></button>
        </div>
      </div>
      <p class="rpaso__tip">${esc(x.tip)}</p>
    </li>`).join('')}</ol>
    <div class="rutina__pie" data-animate="subir" style="opacity:0;transform:translateY(20px)">
      <p class="rutina__total">Los ${conStock.length} productos suman <b>${formatearPrecio(total)}</b></p>
      <div class="rutina__acc"><button type="button" class="btn btn--cta" data-rutina-todo${conStock.length ? '' : ' disabled'}>${ICO.carrito}Sumar los ${conStock.length} al carrito</button><a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Consultar esta rutina</a></div>
    </div>`;
    revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const elegir = (btn, foco = false) => {
    const r = RUTINAS.find(x => x.id === btn.dataset.rutina);
    if (!r || r === actual) { if (foco) btn.focus(); return; }
    tabs.querySelectorAll('[role="tab"]').forEach(b => {
      const activo = b === btn;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    if (foco) btn.focus();
    pintar(r);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-rutina]'); if (b) elegir(b); });
  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const lista = [...tabs.querySelectorAll('[role="tab"]')];
    const i = lista.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    elegir(lista[(i + (e.key === 'ArrowRight' ? 1 : -1) + lista.length) % lista.length], true);
  });
  const variante = id => panel.querySelector(`[data-rutina-op="${CSS.escape(id)}"]`)?.value || '';
  panel.addEventListener('click', e => {
    const add = e.target.closest('[data-rutina-add]');
    if (add) {
      const p = getProducto(add.dataset.rutinaAdd);
      if (p) sumarAlCarrito(p, { v: variante(p.id) });
      return;
    }
    if (e.target.closest('[data-rutina-todo]')) {
      const sumados = pasosDe(actual).filter(x => x.p.stock > 0).reduce((n, x) => n + (sumarAlCarrito(x.p, { v: variante(x.p.id), silencioso: true }) ? 1 : 0), 0);
      showToast(sumados ? `Sumaste ${plural(sumados, 'producto', 'productos')} de la rutina «${actual.nombre}» al carrito` : 'Ya tenés en el carrito todo el stock de esta rutina.');
    }
  });
  const inicial = RUTINAS.find(r => r.id === PARAMS.get('rutina'));
  if (inicial) tabs.querySelectorAll('[role="tab"]').forEach(b => { const activo = b.dataset.rutina === inicial.id; b.setAttribute('aria-selected', String(activo)); b.tabIndex = activo ? 0 : -1; });
  pintar(inicial || RUTINAS[0]);
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    linea: valido(PARAMS.get('linea'), LINEAS),
    formatos: new Set(lista('formato').filter(c => FORMATOS[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    stock: PARAMS.get('disponibles') === '1',
    ofertas: PARAMS.get('ofertas') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  if (estado.cat) estado.linea = catIds[estado.cat].linea;
  const SETS = { formato: estado.formatos };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas las categorías')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-linea-opciones]').forEach(cont => {
    const opciones = [['', 'Las dos líneas'], ...Object.entries(LINEAS).map(([k, l]) => [k, `${l.nombre} · ${l.rubro}`])];
    cont.innerHTML = opciones.map(([k, n]) => `<label class="opt"><input type="radio" name="f-linea" value="${k}" data-filtro="linea"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-linea="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-linea-chips]').forEach(cont => {
    const opciones = [['', 'Las dos líneas'], ...Object.entries(LINEAS).map(([k, l]) => [k, `${l.nombre} · ${l.rubro}`])];
    cont.innerHTML = opciones.map(([k, n]) => `<button type="button" class="chip-linea${k ? ' chip-linea--' + k : ''}" data-filtro="linea" data-valor="${k}" aria-pressed="false">${esc(n)}</button>`).join('');
  });
  document.querySelectorAll('[data-formato-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(FORMATOS).map(([k, n]) => `<label class="opt" data-opt-formato="${k}"><input type="checkbox" value="${k}" data-f="formato"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-formato="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.linea && sin !== 'linea' && sin !== 'cat') f.linea = estado.linea;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.formatos.size && sin !== 'formato') f.formatos = [...estado.formatos];
    return f;
  };
  const setFiltro = (f, v) => {
    if (f === 'cat') { estado.cat = valido(v, catIds); estado.linea = estado.cat ? catIds[estado.cat].linea : ''; return; }
    if (f === 'linea') { estado.linea = valido(v, LINEAS); if (estado.cat && catIds[estado.cat].linea !== estado.linea) estado.cat = ''; return; }
    if (f === 'precio') { estado.precio = valido(v, RANGOS); return; }
    if (f === 'stock' || f === 'ofertas') estado[f] = !!v;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.formatos.forEach(v => chips.push(['formato', v, FORMATOS[v]]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-linea]').forEach(el => { const id = el.dataset.cuentaFiltroLinea; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { linea: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-formato]').forEach(el => {
      const k = el.dataset.cuentaFiltroFormato;
      const n = Tienda.contar({ ...filtrosDe('formato'), formatos: [k] });
      el.textContent = n;
      const opt = el.closest('[data-opt-formato]');
      if (opt) opt.hidden = n === 0 && !estado.formatos.has(k);
    });
    const enPanel = estado.formatos.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (estado.ofertas ? 1 : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0)
      + (document.querySelector('#filtros [data-linea-opciones]') && estado.linea && !estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const lin = !cat && estado.linea ? LINEAS[estado.linea] : null;
    const titulo = cat ? cat.nombre : lin ? lin.titulo : 'Todo el catálogo';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : lin ? lin.bajada : 'Nutrición de Omnilife y cosmética de Seytu. Filtrá por categoría, presentación o precio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !(cat || lin); miga.textContent = titulo; }
    document.title = `${titulo} — Omnilife y Seytu`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'linea', 'formato', 'precio', 'q', 'orden', 'disponibles', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.linea) u.searchParams.set('linea', estado.linea);
    if (estado.formatos.size) u.searchParams.set('formato', [...estado.formatos].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('disponibles', '1');
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${plural(total, 'producto', 'productos')}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más productos para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.linea = ''; estado.precio = ''; estado.stock = false; estado.ofertas = false; estado.q = '';
    Object.values(SETS).forEach(s => s.clear());
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = SETS[multi.dataset.f];
      if (!set) return;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    setFiltro(el.dataset.filtro, el.type === 'checkbox' ? el.checked : el.value);
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      setFiltro(b.dataset.filtro, b.dataset.valor || '');
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else setFiltro(f, '');
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
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
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { if (!filtros.classList.contains('open')) return; filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.09, duration: 1.8, stagger: 0.12 }, 0);
  paso('.hero__card', { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1);
  paso('.hero__linea', { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, clearProps: 'transform' }, 0.1);
  paso('h1', { y: 28, opacity: 0, filter: 'blur(8px)', duration: 1.1, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  paso('.puerta__txt', { y: 24, opacity: 0, duration: 1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.5);
  paso('.hero__dato', { y: -12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  paso('.trazos i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.7, stagger: 0.1, clearProps: 'transform' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-5 + 5 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initVistaPrevia,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initRutina,
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
