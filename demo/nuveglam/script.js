'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ES_M2 = document.body.classList.contains('m2');
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = ES_M2 ? 'catalogo-2.html' : 'catalogo.html';
const WSP = '5493704282883';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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
  { id: 'zapatillas', nombre: 'Zapatillas', corto: 'Zapatillas', img: 'images/p-clasica-franja-azul.webp', bajada: 'Urbanas, clásicas y deportivas para mujer, hombre y unisex. Elegí tu talle en cada modelo.' },
  { id: 'fragancias', nombre: 'Perfumes y fragancias', corto: 'Fragancias', img: 'images/p-jazmin-dorado.webp', bajada: 'Eau de parfum, eau de toilette y esencias en aceite, para ella, para él y para compartir.' },
  { id: 'bagues', nombre: 'Productos Bagués', corto: 'Bagués', img: 'images/p-set-bagues.webp', bajada: 'Sets de regalo, cremas, body mist y aromas para la casa de Bagués, para usar o regalar.' },
];

const TIPOS = {
  urbanas: 'Urbanas', clasicas: 'Clásicas', deportivas: 'Deportivas',
  edp: 'Eau de parfum', edt: 'Eau de toilette', esencias: 'Esencias en aceite',
  sets: 'Sets de regalo', mist: 'Body mist', piel: 'Cuidado de la piel', aromas: 'Aromas para la casa',
};
const TIPOS_POR_CAT = { zapatillas: ['urbanas', 'clasicas', 'deportivas'], fragancias: ['edp', 'edt', 'esencias'], bagues: ['sets', 'mist', 'piel', 'aromas'] };
const PARA = { mujer: 'Mujer', hombre: 'Hombre', unisex: 'Unisex' };

const TALLES_MUJER = ['35', '36', '37', '38', '39', '40'];
const TALLES_HOMBRE = ['39', '40', '41', '42', '43', '44'];
const TALLES_UNISEX = ['36', '37', '38', '39', '40', '41', '42', '43'];
const TALLES_TODOS = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
const GUIA_TALLES = [['35', '22,5'], ['36', '23'], ['37', '23,5'], ['38', '24,5'], ['39', '25'], ['40', '25,5'], ['41', '26,5'], ['42', '27'], ['43', '27,5'], ['44', '28,5']];

const PRODUCTOS = [
  { id: 'urbana-nube', nombre: 'Urbana Nube beige y dorado', cat: 'zapatillas', tipo: 'urbanas', para: 'mujer', precio: 89900, descuento: 0, stock: 9, rango: 1, alta: 20, talles: TALLES_MUJER,
    img: 'images/p-urbana-nube.webp', alt: 'Zapatillas urbanas blancas con gamuza beige y talón dorado, sobre escalones de piedra',
    desc: 'Cuero sintético blanco con gamuza beige y talón dorado. Suela alta y liviana para usar todo el día.', tags: ['blanca', 'beige', 'dorado', 'plataforma', 'urbana'] },
  { id: 'clasica-crema', nombre: 'Clásica de cuero crema', cat: 'zapatillas', tipo: 'clasicas', para: 'unisex', precio: 84900, descuento: 0, stock: 7, alta: 14, talles: TALLES_UNISEX,
    img: 'images/p-clasica-crema.webp', alt: 'Zapatillas clásicas color crema con talón azul marino sobre mármol, junto a dos frascos de perfume',
    desc: 'Cuero liso color crema con talón azul marino y suela cosida. Va con jean, sastrero o vestido.', tags: ['crema', 'cuero', 'azul', 'clasica', 'blanca'] },
  { id: 'knit-negra', nombre: 'Deportiva knit negra', cat: 'zapatillas', tipo: 'deportivas', para: 'hombre', precio: 92900, descuento: 0, stock: 6, rango: 4, alta: 17, talles: TALLES_HOMBRE,
    img: 'images/p-knit-negra.webp', alt: 'Zapatillas deportivas negras de tejido knit apoyadas sobre bloques de piedra',
    desc: 'Tejido knit que respira, suela con amortiguación y tira trasera para calzarla rápido. Total black.', tags: ['negra', 'knit', 'running', 'gimnasio', 'deportiva'] },
  { id: 'gamuza-rosa', nombre: 'Urbana gamuza rosa', cat: 'zapatillas', tipo: 'urbanas', para: 'mujer', precio: 86900, descuento: 10, stock: 5, rango: 8, alta: 22, talles: TALLES_MUJER,
    img: 'images/p-gamuza-rosa.webp', alt: 'Zapatillas de gamuza rosa empolvado con suela blanca sobre un escalón claro',
    desc: 'Gamuza y cuero en rosa empolvado con suela blanca dentada. Suma color sin dejar de ser clásica.', tags: ['rosa', 'gamuza', 'pastel', 'urbana'] },
  { id: 'clasica-franja-azul', nombre: 'Clásica blanca franja azul', cat: 'zapatillas', tipo: 'clasicas', para: 'unisex', precio: 79900, descuento: 0, stock: 10, rango: 6, alta: 12, talles: TALLES_UNISEX,
    img: 'images/p-clasica-franja-azul.webp', alt: 'Zapatillas blancas con franja lateral y talón azul marino vistas desde arriba',
    desc: 'Blanca con franja lateral y talón azul marino, puntera perforada. La que combina con todo.', tags: ['blanca', 'azul', 'franja', 'clasica'] },
  { id: 'lona-blanca', nombre: 'Lona blanca básica', cat: 'zapatillas', tipo: 'clasicas', para: 'unisex', precio: 54900, descuento: 0, stock: 14, alta: 9, talles: TALLES_UNISEX,
    img: 'images/p-lona-blanca.webp', alt: 'Par de zapatillas de lona blanca con cordones sobre un piso claro',
    desc: 'Lona blanca con cordones y suela de goma. Liviana, cómoda y fácil de lavar.', tags: ['lona', 'blanca', 'basica', 'canvas'] },
  { id: 'retro-perla', nombre: 'Retro perla suela caramelo', cat: 'zapatillas', tipo: 'urbanas', para: 'unisex', precio: 109900, descuento: 0, stock: 3, alta: 26, talles: TALLES_UNISEX,
    img: 'images/p-retro-perla.webp', alt: 'Zapatillas retro color perla con suela dentada color caramelo sobre una vitrina',
    desc: 'Cuero perla con gamuza y suela dentada color caramelo. Un modelo retro con aire de running.', tags: ['retro', 'perla', 'caramelo', 'running', 'urbana'] },
  { id: 'urbana-arena', nombre: 'Urbana arena acolchada', cat: 'zapatillas', tipo: 'urbanas', para: 'mujer', precio: 74900, descuento: 0, stock: 0, alta: 6, talles: TALLES_MUJER,
    img: 'images/p-urbana-arena.webp', alt: 'Zapatillas color arena con cordones vistas desde arriba sobre baldosas claras',
    desc: 'Cuero color arena con cuello acolchado y cordones encerados.', tags: ['arena', 'beige', 'urbana', 'cuero'] },

  { id: 'ambar-intenso', nombre: 'Ámbar Intenso', cat: 'fragancias', tipo: 'edp', para: 'hombre', pres: '100 ml', precio: 69900, descuento: 0, stock: 8, rango: 7, alta: 10, regalo: true,
    notas: ['Cardamomo', 'Ámbar', 'Cuero'], img: 'images/p-ambar-intenso.webp', alt: 'Frasco cuadrado de perfume ámbar con tapa negra sobre piedra, con terciopelo azul de fondo',
    desc: 'Abre especiado con cardamomo y se asienta en un ámbar con cuero, cálido y profundo. Para la noche.', tags: ['ambar', 'cuero', 'especiado', 'noche', 'masculino'] },
  { id: 'jazmin-dorado', nombre: 'Jazmín Dorado', cat: 'fragancias', tipo: 'edp', para: 'mujer', pres: '100 ml', precio: 74900, descuento: 0, stock: 6, rango: 2, alta: 21, regalo: true,
    notas: ['Bergamota', 'Jazmín', 'Vainilla'], img: 'images/p-jazmin-dorado.webp', alt: 'Frasco de perfume dorado con tapa de cristal facetado entre flores blancas de jazmín',
    desc: 'Un jazmín luminoso con bergamota y un fondo suave de vainilla. Femenino y elegante sin ser pesado.', tags: ['jazmin', 'floral', 'vainilla', 'femenino', 'dorado'] },
  { id: 'linea-azul', nombre: 'Línea Azul', cat: 'fragancias', tipo: 'edt', para: 'unisex', pres: '100 ml', precio: 64900, descuento: 0, stock: 12, rango: 5, alta: 23, regalo: true,
    variantes: ['Profundo', 'Marino', 'Cielo'],
    variantesDesc: { Profundo: 'amaderado, con cedro y lavanda', Marino: 'acuático, con notas marinas y menta', Cielo: 'cítrico, con pomelo y almizcle' },
    img: 'images/p-linea-azul.webp', alt: 'Tres frascos de perfume en tonos de azul, uno redondo y dos rectangulares, sobre piedra',
    desc: 'Tres fragancias frescas en frascos azules: Profundo, Marino y Cielo. Elegí la tuya.', tags: ['azul', 'fresco', 'acuatico', 'citrico', 'amaderado'] },
  { id: 'piedra-blanca', nombre: 'Piedra Blanca', cat: 'fragancias', tipo: 'edt', para: 'hombre', pres: '100 ml', precio: 58900, descuento: 0, stock: 7, alta: 16,
    notas: ['Pomelo', 'Lavanda', 'Almizcle'], img: 'images/p-piedra-blanca.webp', alt: 'Frasco esmerilado de perfume sobre piedras apiladas y mármol gris, con una flor violeta',
    desc: 'Pomelo y lavanda sobre un almizcle limpio, con un fondo mineral. Fresco para todos los días.', tags: ['fresco', 'lavanda', 'mineral', 'masculino'] },
  { id: 'almizcle-suave', nombre: 'Almizcle Suave', cat: 'fragancias', tipo: 'edp', para: 'unisex', pres: '50 ml', precio: 49900, descuento: 0, stock: 9, alta: 18,
    notas: ['Pera', 'Iris', 'Almizcle blanco'], img: 'images/p-almizcle-suave.webp', alt: 'Frasco de perfume esmerilado de vidrio sobre una superficie color arena',
    desc: 'Pera jugosa e iris sobre un almizcle blanco, como ropa recién lavada. Se usa todo el año.', tags: ['almizcle', 'limpio', 'iris', 'suave'] },
  { id: 'flor-de-sal', nombre: 'Flor de Sal', cat: 'fragancias', tipo: 'edt', para: 'mujer', pres: '50 ml', precio: 46900, descuento: 15, stock: 4, alta: 19,
    notas: ['Sal marina', 'Azahar', 'Ámbar gris'], img: 'images/p-flor-de-sal.webp', alt: 'Frasco facetado de perfume rosado junto a un caracol sobre fondo claro',
    desc: 'Azahar con un toque de sal marina y un fondo de ámbar gris. Luminoso, ideal para el verano.', tags: ['azahar', 'marino', 'verano', 'femenino'] },
  { id: 'esencias-arabes', nombre: 'Esencias árabes en aceite x 2', cat: 'fragancias', tipo: 'esencias', para: 'unisex', pres: '2 × 12 ml', precio: 39900, descuento: 0, stock: 10, alta: 25, regalo: true,
    notas: ['Rosa', 'Oud', 'Ámbar'], img: 'images/p-esencias-arabes.webp', alt: 'Dos frascos chicos de esencia en aceite con tapa dorada sobre un cubo blanco',
    desc: 'Dos perfumes en aceite, sin alcohol: uno de oud y otro de ámbar con rosa. Se aplican con roll-on y duran horas.', tags: ['arabe', 'oud', 'aceite', 'roll on', 'rosa'] },
  { id: 'peonia-suave', nombre: 'Peonía Suave', cat: 'fragancias', tipo: 'edp', para: 'mujer', pres: '100 ml', precio: 66900, descuento: 0, stock: 2, alta: 13, regalo: true,
    notas: ['Lichi', 'Peonía', 'Almizcle'], img: 'images/p-peonia-suave.webp', alt: 'Frasco de perfume rosado con tapa beige apoyado sobre papel arrugado',
    desc: 'Floral frutal con lichi y peonía, y una estela dulce que no cansa.', tags: ['peonia', 'lichi', 'floral', 'dulce', 'femenino'] },

  { id: 'set-bagues', nombre: 'Set de regalo Bagués: fragancia y crema', cat: 'bagues', tipo: 'sets', para: 'mujer', marca: 'Bagués', pres: 'Caja de regalo', precio: 59900, descuento: 0, stock: 6, rango: 3, alta: 15, regalo: true,
    img: 'images/p-set-bagues.webp', alt: 'Caja de regalo azul con moño que lleva un frasco de perfume y un pomo de crema sobre satén',
    desc: 'Caja azul con moño que trae una fragancia femenina y su crema corporal, lista para regalar.', tags: ['set', 'regalo', 'caja', 'crema', 'perfume', 'bagues'] },
  { id: 'body-mist-bagues', nombre: 'Body mist Bagués', cat: 'bagues', tipo: 'mist', para: 'mujer', marca: 'Bagués', pres: '250 ml', precio: 16900, descuento: 10, stock: 11, alta: 5, regalo: true,
    variantes: ['Floral', 'Frutal', 'Cítrico'],
    img: 'images/p-body-mist-bagues.webp', alt: 'Frasco de bruma corporal con atomizador apoyado sobre una caja, con fondo beige',
    desc: 'Bruma corporal liviana para después de la ducha. Se puede aplicar varias veces al día.', tags: ['body mist', 'bruma', 'corporal', 'bagues'] },
  { id: 'crema-corporal-bagues', nombre: 'Crema corporal Bagués', cat: 'bagues', tipo: 'piel', para: 'unisex', marca: 'Bagués', pres: '400 ml', precio: 18900, descuento: 0, stock: 12, alta: 8,
    img: 'images/p-crema-corporal-bagues.webp', alt: 'Frasco de crema corporal con válvula dosificadora y su sombra sobre fondo ocre',
    desc: 'Hidrata y deja la piel suave sin sensación grasa. Para usar todos los días, después de bañarte.', tags: ['crema', 'corporal', 'hidratante', 'piel', 'bagues'] },
  { id: 'serum-corporal-bagues', nombre: 'Sérum corporal humectante Bagués', cat: 'bagues', tipo: 'piel', para: 'unisex', marca: 'Bagués', pres: '200 ml', precio: 21900, descuento: 0, stock: 5, alta: 24,
    img: 'images/p-serum-corporal-bagues.webp', alt: 'Frasco blanco de sérum corporal con dosificador negro a contraluz',
    desc: 'Textura liviana que se absorbe rápido. Humecta y deja la piel con brillo natural.', tags: ['serum', 'corporal', 'humectante', 'piel', 'bagues'] },
  { id: 'crema-manos-bagues', nombre: 'Crema de manos Bagués', cat: 'bagues', tipo: 'piel', para: 'unisex', marca: 'Bagués', pres: '60 g', precio: 9900, descuento: 0, stock: 15, alta: 7,
    img: 'images/p-crema-manos-bagues.webp', alt: 'Pomo de crema de manos color nude parado sobre mármol blanco',
    desc: 'Nutre manos secas y uñas. Formato chico para llevar en la cartera.', tags: ['crema', 'manos', 'piel', 'cartera', 'bagues'] },
  { id: 'difusor-bagues', nombre: 'Difusor de varillas Bagués', cat: 'bagues', tipo: 'aromas', para: 'unisex', marca: 'Bagués', pres: '125 ml', precio: 19900, descuento: 0, stock: 9, alta: 11, regalo: true,
    variantes: ['Lino', 'Sándalo', 'Vainilla'],
    img: 'images/p-difusor-bagues.webp', alt: 'Difusor de vidrio con varillas de madera y flores secas sobre una bandeja de mármol, con fondo turquesa',
    desc: 'Perfuma un ambiente sin prender nada. Girá las varillas cada tanto para renovar el aroma.', tags: ['difusor', 'varillas', 'hogar', 'ambiente', 'bagues'] },

  { id: 'borrador-zapatilla', nombre: 'Zapatilla en carga (borrador)', cat: 'zapatillas', tipo: 'urbanas', para: 'unisex', precio: 1, descuento: 0, stock: 0, alta: 0, visible: false, talles: [],
    img: 'images/p-lona-blanca.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const varDe = p => {
  if ((p.talles || []).length) return { valores: p.talles, titulo: 'Elegí tu talle', boton: 'Elegir talle', talle: true };
  if ((p.variantes || []).length) return { valores: p.variantes, titulo: p.cat === 'fragancias' ? 'Elegí la fragancia' : 'Elegí el aroma', boton: p.cat === 'fragancias' ? 'Elegir fragancia' : 'Elegir aroma' };
  return null;
};
const pideEleccion = p => (varDe(p)?.valores.length || 0) > 1;
const varTexto = (p, v) => (v && p.talles ? `Talle ${v}` : v || '');

const RANGOS_PRECIO = [
  { id: '0-20000', nombre: 'Hasta $20.000', min: 0, max: 20000 },
  { id: '20000-60000', nombre: '$20.000 a $60.000', min: 20000, max: 60000 },
  { id: '60000-90000', nombre: '$60.000 a $90.000', min: 60000, max: 90000 },
  { id: '90000-', nombre: 'Más de $90.000', min: 90000, max: null },
];

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.marca, catDe(p.cat)?.nombre, catDe(p.cat)?.corto, TIPOS[p.tipo], PARA[p.para], p.pres, p.desc,
      ...(p.notas || []), ...(p.variantes || []), ...(p.talles || []).map(t => `talle ${t}`), ...(p.tags || []),
      p.regalo ? 'regalo regalar' : '', p.descuento > 0 ? 'oferta descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const palabrasDe = q => norm(q).split(/\s+/).filter(w => w.length > 1);
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), para = lista(f.para), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (para.length && !(para.includes(p.para) || (p.para === 'unisex' && para.some(x => x !== 'unisex')))) return false;
    if (talle.length && !(p.talles || []).some(t => talle.includes(t))) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.regalo && !p.regalo) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    if (f.q && !coincideBusqueda(p, palabrasDe(f.q))) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || (b.stock > 0) - (a.stock > 0) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = palabrasDe(q);
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
  if (!agotado && items.length === limite && ultimo != null) {
    const resto = tienda.consultar({ filtros: { ...filtros, q }, orden, cursor: ultimo, limite: 1 });
    if (!resto.items.length) agotado = true;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'nuveglam_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const max = producto.stock ?? 99;
    if (max <= 0) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtrados = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtrados);
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carrito: '<svg class="ico-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function refrescarTriggers() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function metaDe(p) {
  if (p.cat === 'zapatillas') return `${TIPOS[p.tipo]} · ${PARA[p.para]}`;
  if (p.marca) return `${p.marca} · ${p.pres}`;
  return `${TIPOS[p.tipo]} · ${p.pres}`;
}

function badgeDe(p) {
  if (p.stock <= 0) return '<span class="badge badge--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="badge badge--off">-${p.descuento}%</span>`;
  if (p.stock <= 3) return '<span class="badge">Últimas unidades</span>';
  if (p.alta >= 24) return '<span class="badge badge--nuevo">Nuevo</span>';
  return '';
}

function precioHTML(p) {
  const fin = precioFinal(p);
  return p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><strong class="off">${formatearPrecio(fin)}</strong>` : `<strong>${formatearPrecio(fin)}</strong>`;
}

function pieCardHTML(p, sin, eleccion) {
  if (sin) return `<a class="prod-buy" href="${wa(`Hola NUVÉ GLAM, avisame cuando vuelva ${p.nombre}.`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;
  if (!eleccion) return `<button class="prod-buy" type="button" data-buy="${p.id}">Comprar ahora</button>`;
  const txt = p.talles?.length ? `Talles del ${p.talles[0]} al ${p.talles[p.talles.length - 1]}` : `${p.variantes.length} ${p.cat === 'fragancias' ? 'fragancias' : 'aromas'} para elegir`;
  return `<button class="prod-buy" type="button" data-quick="${p.id}">${txt}</button>`;
}

function cardHTML(p) {
  const sin = p.stock <= 0;
  const eleccion = pideEleccion(p);
  let acciones;
  if (sin) acciones = `<button class="btn btn--cta prod-add" type="button" disabled>Sin stock</button>`;
  else if (eleccion) acciones = `<button class="btn btn--cta prod-add" type="button" data-quick="${p.id}">${varDe(p).boton}</button>`;
  else acciones = `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div><button class="btn btn--cta prod-add prod-add--ico" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="txt">Agregar<span class="largo"> al carrito</span></span>${ICON.carrito}</button>`;
  return `<article class="prod" data-id="${p.id}">
    <button class="prod-foto" type="button" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async">${badgeDe(p)}<span class="prod-ver" aria-hidden="true">${ICON.ojo}Vista rápida</span></button>
    <div class="prod-info">
      <p class="prod-meta">${esc(metaDe(p))}</p>
      <h3 class="prod-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-precio">${precioHTML(p)}</p>
      <div class="prod-actions">${acciones}</div>
      ${pieCardHTML(p, sin, eleccion)}
    </div>
  </article>`;
}

function liHTML(p, anim = 'subir', clase = '') {
  const estilos = { subir: 'opacity:0;transform:translateY(40px)', der: 'opacity:0;transform:translateX(64px)' };
  return `<li${clase ? ` class="${clase}"` : ''} data-animate="${anim}" style="${estilos[anim]}">${cardHTML(p)}</li>`;
}

function cantidadDe(btn) {
  const input = btn.closest('.prod, .qv-info')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function agregar(id, qty = 1, v = '', { abrir = false } = {}) {
  const p = getProducto(id);
  if (!p) return;
  if (pideEleccion(p) && !v) { abrirQuickView(id); return; }
  const sumados = Cart.add(p, qty, v);
  if (abrir) { closeQuickView(false); openCartDrawer(); return; }
  if (sumados > 0) showToast(`${p.nombre}${v ? ` (${varTexto(p, v)})` : ''} se sumó al carrito.`);
  else showToast(`Ya tenés en el carrito todo el stock de ${p.nombre}.`);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.closest('[data-stepper]')?.querySelector('input');
      if (input) {
        const max = parseInt(input.max, 10) || 99;
        input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, cantidadDe(add), add.dataset.v || ''); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) { agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '', { abrir: true }); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      if (quick.closest('.rail-vp')?.dataset.arrastrado === '1') return;
      abrirQuickView(quick.dataset.quick, quick);
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input || input.closest('.linea')) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

let ultimoFoco = null;
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function renderCarrito() {
  const body = document.querySelector('[data-cart-items]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!body || !foot) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.bolsa}<h3>Tu carrito está vacío</h3><p>Todavía no elegiste tus zapatillas ni tu fragancia. Empezá por la tienda.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(({ p, v, qty }) => `<div class="linea">
      <img src="${p.img}" alt="" width="76" height="76">
      <div>
        <div class="linea-top"><div><p class="linea-nombre">${esc(p.nombre)}</p><p class="linea-var">${esc([p.pres, varTexto(p, v)].filter(Boolean).join(' · ') || catDe(p.cat)?.corto)}</p></div>
          <button class="linea-quitar" type="button" data-quitar="${p.id}" data-v="${esc(v || '')}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></div>
        <div class="linea-bot">
          <div class="stepper" data-stepper><button type="button" data-linea-step="-1" data-id="${p.id}" data-v="${esc(v || '')}" aria-label="Restar uno">−</button><input type="number" value="${qty}" min="1" max="${p.stock}" aria-label="Cantidad" data-linea-input data-id="${p.id}" data-v="${esc(v || '')}"><button type="button" data-linea-step="1" data-id="${p.id}" data-v="${esc(v || '')}" aria-label="Sumar uno">+</button></div>
          <span class="linea-precio">${formatearPrecio(precioFinal(p) * qty)}</span>
        </div>
      </div>
    </div>`).join('');
  const resumen = items.map(({ p, v, qty }) => `• ${qty} × ${p.nombre}${v ? ` (${varTexto(p, v)})` : ''}`).join('\n');
  foot.innerHTML = `<div class="drawer-total"><span>Subtotal</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer-nota">La entrega se coordina al finalizar la compra. ¿Dudas con el talle o la fragancia? <a href="${wa(`Hola NUVÉ GLAM, quiero consultar por este pedido:\n${resumen}`)}" target="_blank" rel="noopener">Consultalo por WhatsApp</a>.</p>
    <button class="btn btn--cta" type="button" data-finalizar>Finalizar compra</button>
    <button class="btn btn--outline" type="button" data-close-cart>Seguir comprando</button>`;
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-backdrop]');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  renderCarrito();
  drawer.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
  drawer.querySelector('[data-close-cart]')?.focus();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-backdrop]');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) { drawer.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function initCarrito() {
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelector('[data-drawer-backdrop]')?.addEventListener('click', closeCartDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCartDrawer(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar, q.dataset.v || ''); return; }
    const s = e.target.closest('[data-linea-step]');
    if (s) {
      const it = Cart.get().find(i => i.id === s.dataset.id && (i.v || '') === (s.dataset.v || ''));
      if (it) Cart.setQty(s.dataset.id, s.dataset.v || '', it.qty + Number(s.dataset.lineaStep));
      return;
    }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('change', e => {
    const i = e.target.closest('[data-linea-input]');
    if (i) Cart.setQty(i.dataset.id, i.dataset.v || '', parseInt(i.value, 10) || 1);
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
    atraparFoco(drawer, e);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(); });
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

function relacionadosDe(p) {
  return Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, orden: 'destacados', limite: 3 }).items.map(cachear);
}

function guiaTallesHTML(p) {
  const filas = GUIA_TALLES.filter(([t]) => p.talles.includes(t));
  return `<details class="qv-guia"><summary>¿Cuál es mi talle?</summary>
    <p>Pará el pie sobre una hoja, marcá el talón y la punta del dedo más largo y medí la distancia. Buscá ese largo en la tabla.</p>
    <table><caption class="sr-only">Largo del pie por talle</caption><thead><tr><th scope="col">Talle</th><th scope="col">Largo del pie</th></tr></thead>
    <tbody>${filas.map(([t, cm]) => `<tr><td>${t}</td><td>${cm} cm</td></tr>`).join('')}</tbody></table>
    <p class="qv-guia__nota">Medidas orientativas. Si quedás entre dos talles, escribinos y te decimos cuál conviene en este modelo.</p></details>`;
}

function qvHTML(p) {
  const sin = p.stock <= 0;
  const vari = varDe(p);
  const valores = vari?.valores || [];
  const v0 = valores.length === 1 ? valores[0] : vari && !vari.talle ? valores[0] : '';
  const stockTxt = sin ? 'Sin stock por ahora' : p.stock <= 3 ? `Quedan ${p.stock} unidades` : 'En stock';
  const notas = (p.notas || []).length === 3 ? `<dl class="qv-notas"><div><dt>Salida</dt><dd>${esc(p.notas[0])}</dd></div><div><dt>Corazón</dt><dd>${esc(p.notas[1])}</dd></div><div><dt>Fondo</dt><dd>${esc(p.notas[2])}</dd></div></dl>` : '';
  const varDescs = p.variantesDesc ? `<ul class="qv-variantes">${Object.entries(p.variantesDesc).map(([k, d]) => `<li><strong>${esc(k)}:</strong> ${esc(d)}</li>`).join('')}</ul>` : '';
  const selVar = valores.length > 1 ? `<fieldset class="qv-opciones"><legend>${vari.titulo}</legend><div class="opciones" role="radiogroup" aria-label="${vari.talle ? 'Talle' : 'Variante'}">${valores.map(a => `<button type="button" class="chip${vari.talle ? ' chip--talle' : ''}" role="radio" aria-checked="${a === v0}" data-var="${esc(a)}">${esc(a)}</button>`).join('')}</div></fieldset>` : '';
  const rel = relacionadosDe(p);
  const consulta = p.cat === 'zapatillas' ? `Hola NUVÉ GLAM, quiero consultar por las ${p.nombre}. ¿Qué talle me conviene?` : `Hola NUVÉ GLAM, quiero consultar por ${p.nombre}${p.pres ? ` (${p.pres})` : ''}.`;
  return `<div class="qv-grid">
      <div class="qv-foto"><img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1000">${badgeDe(p)}</div>
      <div class="qv-info">
        <p class="prod-meta">${esc(catDe(p.cat)?.nombre)} · ${esc(metaDe(p))}</p>
        <h2 id="qv-titulo">${esc(p.nombre)}</h2>
        <p class="prod-precio qv-precio">${precioHTML(p)}</p>
        <p class="qv-desc">${esc(p.desc)}</p>
        ${notas}
        ${varDescs}
        ${selVar}
        ${p.talles?.length ? guiaTallesHTML(p) : ''}
        <p class="qv-stock ${sin ? 'sin' : p.stock <= 3 ? 'poco' : ''}">${stockTxt}</p>
        <div class="qv-acciones-wrap">
          ${sin ? '' : `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>`}
        </div>
        <div class="qv-acciones">
          <button class="btn btn--cta" type="button" data-qv-add="${p.id}" data-v="${esc(v0)}" ${sin ? 'disabled' : ''}>${sin ? 'Sin stock' : 'Agregar al carrito'}</button>
          ${sin ? '' : `<button class="btn btn--outline" type="button" data-qv-buy="${p.id}" data-v="${esc(v0)}">Comprar ahora</button>`}
        </div>
        <a class="qv-wsp" href="${wa(consulta)}" target="_blank" rel="noopener">${ICON.wsp}${sin ? 'Avisame cuando vuelva' : 'Consultar por WhatsApp'}</a>
      </div>
    </div>
    ${rel.length ? `<div class="qv-rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button class="mini" type="button" data-qv-ir="${r.id}"><img src="${r.img}" alt="${esc(r.alt)}" width="1000" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}

function jsonLdProducto(p) {
  document.getElementById('ld-producto')?.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ld-producto';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: p.marca || 'NUVÉ GLAM' }, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${location.origin}${location.pathname}?producto=${p.id}` },
  });
  document.head.appendChild(s);
}

function abrirQuickView(id, origen) {
  const qv = document.getElementById('quickView');
  const p = getProducto(id);
  if (!qv || !p) return;
  if (qv.hidden) ultimoFoco = origen || document.activeElement;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  qv.querySelector('.qv-panel').scrollTop = 0;
  jsonLdProducto(p);
  if (qv.hidden) {
    qv.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  qv.querySelector('.qv-cerrar')?.focus();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', id);
    history.replaceState(null, '', u);
  }
}

function closeQuickView(devolverFoco = true) {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!qv.classList.contains('open')) qv.hidden = true; }, 320);
  document.getElementById('ld-producto')?.remove();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    history.replaceState(null, '', u);
  }
  if (devolverFoco) ultimoFoco?.focus?.();
}

function initQuickView() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { closeQuickView(); return; }
    const opcion = e.target.closest('[data-var]');
    if (opcion) {
      opcion.parentElement.querySelectorAll('[data-var]').forEach(b => b.setAttribute('aria-checked', String(b === opcion)));
      qv.querySelectorAll('[data-qv-add], [data-qv-buy]').forEach(b => { b.dataset.v = opcion.dataset.var; });
      return;
    }
    const accion = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (accion) {
      const id = accion.dataset.qvAdd || accion.dataset.qvBuy;
      const p = getProducto(id);
      if (p && pideEleccion(p) && !accion.dataset.v) {
        showToast(`${varDe(p).titulo} antes de agregarlo.`);
        qv.querySelector('[data-var]')?.focus();
        return;
      }
      agregar(id, cantidadDe(accion), accion.dataset.v || '', { abrir: 'qvBuy' in accion.dataset });
      return;
    }
    const ir = e.target.closest('[data-qv-ir]');
    if (ir) abrirQuickView(ir.dataset.qvIr);
  }, true);
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuickView();
    atraparFoco(qv, e);
    const radio = e.target.closest('[data-var]');
    if (radio && ['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      const todos = [...radio.parentElement.querySelectorAll('[data-var]')];
      const sig = todos[(todos.indexOf(radio) + (e.key === 'ArrowRight' ? 1 : -1) + todos.length) % todos.length];
      sig.focus(); sig.click();
    }
  });
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
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats__btn');
  const panel = cont.querySelector('.nav-cats__panel');
  const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = CATEGORIAS.map(c => `<a class="nav-cats__item" href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="52" height="52"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} productos</small></span></a>`).join('')
    + `<a class="nav-cats__item nav-cats__item--extra" href="${CATALOGO_URL}?regalo=1"><span class="nav-cats__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.2C7 7 12 7 12 7zm0 0c1.5-3 5-3.5 5-1.2C17 7 12 7 12 7z"/></svg></span><span><strong>Para regalar</strong><small>${Tienda.contar({ regalo: true })} ideas</small></span></a>`
    + `<a class="nav-cats__todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
  const desktop = window.matchMedia('(min-width: 1025px) and (hover: hover)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (desktop.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (window.matchMedia('(min-width: 1025px)').matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!cont.contains(e.target) && window.matchMedia('(min-width: 1025px)').matches) cerrar(); });
  cont.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); cerrar(); btn.focus(); } });
}

function initConteos() {
  document.querySelectorAll('[data-conteo]').forEach(el => {
    const n = Tienda.contar(el.dataset.conteo === 'todo' ? {} : { cat: el.dataset.conteo });
    el.textContent = el.dataset.conteo === 'zapatillas' ? `${n} modelos` : `${n} productos`;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach((img, i) => tl.from(img, { scale: 1.09, duration: 1.8 }, i * 0.08));
  tl.from(hero.querySelectorAll('.esfera'), { scale: 0.92, opacity: 0, duration: 1.4, stagger: 0.12, clearProps: 'transform,opacity' }, 0)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.2 }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker'), { y: 22, opacity: 0, duration: 1 }, 0.38)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.48)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.puerta__txt'), { y: 26, opacity: 0, duration: 1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const zona = el.closest('section') || el;
    ScrollTrigger.create({
      trigger: zona, start: 'top top', end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${(self.progress * 5).toFixed(2)}%`; },
    });
  });
}

function initRailDrag(vp) {
  let pointerId = null, startX = 0, startLeft = 0, moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { void 0; }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { void 0; }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 0);
      const destino = vp.scrollLeft;
      vp.classList.remove('dragging');
      vp.scrollLeft = destino;
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}

function consultaVidriera(tipo, excluir = [], limite = 8) {
  const res = tipo === 'novedades'
    ? Tienda.consultar({ filtros: { excluir, stock: true }, orden: 'nuevos', limite })
    : Tienda.consultar({ filtros: { destacado: true, excluir }, orden: 'destacados', limite });
  res.items.forEach(cachear);
  return res.items;
}

function initRail(excluir = []) {
  const vp = document.querySelector('[data-rail]');
  const track = document.querySelector('[data-rail-track]');
  if (!vp || !track) return [];
  const items = consultaVidriera(vp.dataset.rail, excluir, 8);
  track.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p)}</li>`).join('');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 20;
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  return items.map(p => p.id);
}

function initPreview(excluir = []) {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return [];
  const mosaico = cont.classList.contains('mosaico');
  const items = consultaVidriera(cont.dataset.preview, excluir, mosaico ? 7 : 8);
  let html = items.map((p, i) => liHTML(p, 'subir', mosaico && i === 0 ? 'mosaico-grande' : '')).join('');
  if (mosaico) {
    const total = Tienda.contar({});
    html += `<li class="mosaico-li-cta" data-animate="subir" style="opacity:0;transform:translateY(40px)"><div class="mosaico-cta"><strong>${total} productos en la tienda</strong><p>Zapatillas, fragancias y Bagués, con buscador y filtros por talle y precio.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div></li>`;
  }
  cont.innerHTML = html;
  return items.map(p => p.id);
}

function initGaleria() {
  const sec = document.querySelector('[data-galeria]');
  if (!sec) return;
  const grid = sec.querySelector('[data-galeria-grid]');
  const chips = sec.querySelector('[data-galeria-filtros]');
  const visor = document.getElementById('visor');
  const items = [...grid.querySelectorAll('[data-foto]')];
  const vp = sec.querySelector('[data-galeria-vp]');
  if (ES_M2 && vp) initRailDrag(vp);
  if (chips) {
    const temas = { '': 'Todo', zapatillas: 'Zapatillas', fragancias: 'Fragancias', regalos: 'Regalos' };
    chips.innerHTML = Object.entries(temas).map(([id, t]) => {
      const n = id ? items.filter(it => it.dataset.tema === id).length : items.length;
      return `<button type="button" class="chip" aria-pressed="${id === ''}" data-tema="${id}">${t} <small>${n}</small></button>`;
    }).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-tema]');
      if (!b) return;
      chips.querySelectorAll('[data-tema]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const tema = b.dataset.tema;
      items.forEach(it => { it.closest('li').hidden = !!tema && it.dataset.tema !== tema; });
      grid.classList.toggle('filtrada', !!tema);
      refrescarTriggers();
    });
  }
  if (!visor) return;
  const img = visor.querySelector('[data-visor-img]');
  const cap = visor.querySelector('[data-visor-cap]');
  const cnt = visor.querySelector('[data-visor-n]');
  const link = visor.querySelector('[data-visor-link]');
  let lista = [];
  let idx = 0;
  const pintar = () => {
    const it = lista[idx];
    const pic = it.querySelector('img');
    img.src = pic.getAttribute('src');
    img.alt = pic.alt;
    img.width = Number(pic.getAttribute('width'));
    img.height = Number(pic.getAttribute('height'));
    cap.textContent = it.dataset.titulo;
    cnt.textContent = `${idx + 1} / ${lista.length}`;
    link.href = it.dataset.link;
    link.textContent = it.dataset.linkTxt;
  };
  const abrir = it => {
    lista = items.filter(x => !x.closest('li').hidden);
    idx = Math.max(0, lista.indexOf(it));
    ultimoFoco = it;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('[data-visor-cerrar]').focus();
  };
  const cerrar = () => {
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!visor.classList.contains('open')) visor.hidden = true; }, 300);
    ultimoFoco?.focus?.();
  };
  const mover = d => { idx = (idx + d + lista.length) % lista.length; pintar(); };
  grid.addEventListener('click', e => {
    if (vp?.dataset.arrastrado === '1') return;
    const it = e.target.closest('[data-foto]');
    if (it) abrir(it);
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]') || e.target === visor) { cerrar(); return; }
    if (e.target.closest('[data-visor-prev]')) mover(-1);
    if (e.target.closest('[data-visor-next]')) mover(1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'ArrowLeft') mover(-1);
    atraparFoco(visor, e);
  });
  let x0 = null;
  visor.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  visor.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  });
}

const POR_PAGINA = 16;
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros-form]');
  const panel = document.querySelector('[data-filtros]');
  const inputQ = document.getElementById('q');
  const selOrden = document.querySelector('[data-orden]');
  const verMas = document.querySelector('[data-ver-mas]');
  const masInfo = document.querySelector('[data-mas-info]');
  const vacio = document.querySelector('[data-empty]');
  const countEl = document.querySelector('[data-count]');
  const chips = document.querySelector('[data-chips]');
  const tabs = document.querySelector('[data-cat-tabs]');
  const h1 = document.querySelector('[data-cat-h1]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-miga]');

  const sp = new URLSearchParams(location.search);
  const validos = (clave, permitidos) => (sp.get(clave) || '').split(',').map(s => s.trim()).filter(v => permitidos.includes(v));
  const estado = {
    cat: validos('cat', CATEGORIAS.map(c => c.id)),
    tipo: validos('tipo', Object.keys(TIPOS)),
    para: validos('para', Object.keys(PARA)),
    talle: validos('talle', TALLES_TODOS),
    precio: validos('precio', RANGOS_PRECIO.map(r => r.id))[0] || '',
    regalo: sp.get('regalo') === '1',
    stock: sp.get('stock') === '1',
    ofertas: sp.get('ofertas') === '1',
    q: (sp.get('q') || '').slice(0, 60),
    orden: Object.keys(ORDENES).includes(sp.get('orden')) ? sp.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const conTalles = () => !estado.cat.length || estado.cat.includes('zapatillas');
  const filtrosDe = sinGrupo => {
    const f = {};
    if (sinGrupo !== 'cat' && estado.cat.length) f.cat = estado.cat;
    if (sinGrupo !== 'tipo' && estado.tipo.length) f.tipo = estado.tipo;
    if (sinGrupo !== 'para' && estado.para.length) f.para = estado.para;
    if (sinGrupo !== 'talle' && estado.talle.length) f.talle = estado.talle;
    if (sinGrupo !== 'precio' && estado.precio) {
      const r = RANGOS_PRECIO.find(x => x.id === estado.precio);
      if (r) { f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    }
    if (sinGrupo !== 'regalo' && estado.regalo) f.regalo = true;
    if (sinGrupo !== 'stock' && estado.stock) f.stock = true;
    if (sinGrupo !== 'ofertas' && estado.ofertas) f.ofertas = true;
    return f;
  };
  const conTexto = f => (estado.q ? { ...f, q: estado.q } : f);

  const grupoHTML = (clave, titulo, opciones, tipo = 'checkbox', extraClase = '') => {
    const base = filtrosDe(clave);
    const ops = opciones.map(o => {
      const extra = clave === 'precio' ? { precioMin: o.min, ...(o.max != null ? { precioMax: o.max } : {}) } : { [clave]: o.id };
      const n = Tienda.contar(conTexto({ ...base, ...extra }));
      const marcado = clave === 'precio' ? estado.precio === o.id : estado[clave].includes(o.id);
      return `<label class="f-op${n === 0 && !marcado ? ' vacio' : ''}"><input type="${tipo}" data-f="${clave}" value="${o.id}"${marcado ? ' checked' : ''}><span>${esc(o.nombre)}</span><small>${n}</small></label>`;
    }).join('');
    return `<fieldset class="f-grupo${extraClase}"><legend>${titulo}</legend>${ops}</fieldset>`;
  };

  const tiposVisibles = () => {
    const cats = estado.cat.length ? estado.cat : CATEGORIAS.map(c => c.id);
    return cats.flatMap(c => TIPOS_POR_CAT[c]).map(id => ({ id, nombre: TIPOS[id] }));
  };

  const pintarFiltros = () => {
    if (!form) return;
    const unico = k => Tienda.contar(conTexto({ ...filtrosDe(k), [k]: true }));
    form.innerHTML = [
      grupoHTML('cat', 'Categoría', CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre }))),
      grupoHTML('tipo', 'Tipo de producto', tiposVisibles()),
      grupoHTML('para', 'Para quién', Object.entries(PARA).map(([id, nombre]) => ({ id, nombre }))),
      conTalles() ? grupoHTML('talle', 'Talle de zapatillas', TALLES_TODOS.map(t => ({ id: t, nombre: t })), 'checkbox', ' f-grupo--talles') : '',
      grupoHTML('precio', 'Precio', RANGOS_PRECIO, 'radio'),
      `<fieldset class="f-grupo"><legend>Más opciones</legend>
        <label class="f-op"><input type="checkbox" data-f="regalo" value="1"${estado.regalo ? ' checked' : ''}><span>Ideal para regalar</span><small>${unico('regalo')}</small></label>
        <label class="f-op"><input type="checkbox" data-f="ofertas" value="1"${estado.ofertas ? ' checked' : ''}><span>Con descuento</span><small>${unico('ofertas')}</small></label>
        <label class="f-op"><input type="checkbox" data-f="stock" value="1"${estado.stock ? ' checked' : ''}><span>Solo con stock</span><small>${unico('stock')}</small></label></fieldset>`,
    ].join('');
  };

  const etiquetas = () => {
    const out = [];
    estado.cat.forEach(id => out.push(['cat', id, catDe(id)?.corto]));
    estado.tipo.forEach(id => out.push(['tipo', id, TIPOS[id]]));
    estado.para.forEach(id => out.push(['para', id, PARA[id]]));
    estado.talle.forEach(id => out.push(['talle', id, `Talle ${id}`]));
    if (estado.precio) out.push(['precio', estado.precio, RANGOS_PRECIO.find(r => r.id === estado.precio)?.nombre]);
    if (estado.regalo) out.push(['regalo', '1', 'Para regalar']);
    if (estado.ofertas) out.push(['ofertas', '1', 'Con descuento']);
    if (estado.stock) out.push(['stock', '1', 'Con stock']);
    if (estado.q) out.push(['q', estado.q, `“${estado.q}”`]);
    return out;
  };

  const syncURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'para', 'talle', 'precio', 'regalo', 'stock', 'ofertas', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    ['cat', 'tipo', 'para', 'talle'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    ['regalo', 'stock', 'ofertas'].forEach(k => { if (estado[k]) u.searchParams.set(k, '1'); });
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    history.replaceState(null, '', u);
    const params = new URLSearchParams(u.search);
    params.delete('producto');
    const qs = params.toString();
    document.querySelectorAll('.gw-modelos__btn').forEach(a => { a.href = a.getAttribute('href').split('?')[0] + (qs ? `?${qs}` : ''); });
  };

  const pintarCabecera = () => {
    const cat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const regalo = !cat && estado.regalo;
    if (h1) h1.textContent = cat ? cat.nombre : regalo ? 'Para regalar' : 'Catálogo';
    if (bajada) bajada.textContent = cat ? cat.bajada : regalo ? 'Fragancias, sets y aromas que ya vienen listos para regalar.' : 'Zapatillas, perfumes y productos Bagués. Filtrá por categoría, talle, precio o para quién es.';
    if (miga) {
      miga.innerHTML = cat || regalo ? `<a href="${CATALOGO_URL}">Catálogo</a>` : 'Catálogo';
      const ultimo = document.querySelector('[data-miga-cat]');
      if (ultimo) { ultimo.hidden = !(cat || regalo); ultimo.textContent = cat ? cat.nombre : regalo ? 'Para regalar' : ''; }
      if (cat || regalo) miga.removeAttribute('aria-current'); else miga.setAttribute('aria-current', 'page');
    }
    document.title = `${cat ? cat.nombre : regalo ? 'Para regalar' : 'Catálogo'} — NUVÉ GLAM`;
    if (tabs) tabs.querySelectorAll('[data-tab]').forEach(t => {
      const activo = t.dataset.tab === '' ? !estado.cat.length : estado.cat.length === 1 && estado.cat[0] === t.dataset.tab;
      t.setAttribute('aria-pressed', String(activo));
    });
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      const u = new URL(a.href);
      const esActual = u.searchParams.get('cat') ? u.searchParams.get('cat') === cat?.id : u.searchParams.get('regalo') === '1' && regalo;
      if (esActual) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };

  const pintarChips = total => {
    if (countEl) countEl.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}`;
    const et = etiquetas();
    if (chips) chips.innerHTML = et.map(([k, v, t]) => `<button type="button" class="chip-x" data-quitar-f="${k}" data-v="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('') + (et.length ? '<button type="button" class="chip-x chip-x--limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = et.filter(([k]) => k !== 'q').length;
    document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n; el.hidden = !n; });
    document.querySelectorAll('[data-count-btn]').forEach(el => { el.textContent = total; });
  };

  const traer = () => buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor, limite: POR_PAGINA });

  const render = ({ reset = true } = {}) => {
    if (reset) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = traer();
    res.items.forEach(cachear);
    grid.insertAdjacentHTML('beforeend', res.items.map(p => liHTML(p)).join(''));
    cursor = res.cursor;
    mostrados += res.items.length;
    const total = Tienda.contar(conTexto(filtrosDe()));
    if (verMas) verMas.hidden = !cursor;
    if (masInfo) { masInfo.hidden = !cursor; masInfo.textContent = `Viendo ${mostrados} de ${total}`; }
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (reset) { pintarFiltros(); pintarChips(total); pintarCabecera(); syncURL(); }
    revelarNuevos(grid);
    refrescarTriggers();
  };

  if (selOrden) {
    selOrden.innerHTML = Object.entries(ORDENES).map(([v, t]) => `<option value="${v}"${v === estado.orden ? ' selected' : ''}>${t}</option>`).join('');
    selOrden.addEventListener('change', () => { estado.orden = selOrden.value; render(); });
  }
  if (inputQ) {
    inputQ.value = estado.q;
    let t = 0;
    inputQ.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = inputQ.value.trim().slice(0, 60); render(); }, 220); });
    inputQ.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = inputQ.value.trim().slice(0, 60); render(); inputQ.blur(); });
    if (location.hash === '#buscar') setTimeout(() => inputQ.focus(), 60);
    document.querySelectorAll('[data-ir-buscar]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      inputQ.closest('form')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      inputQ.focus({ preventScroll: true });
    }));
  }
  form?.addEventListener('change', e => {
    const input = e.target.closest('[data-f]');
    if (!input) return;
    const k = input.dataset.f;
    if (['regalo', 'stock', 'ofertas'].includes(k)) estado[k] = input.checked;
    else if (k === 'precio') estado.precio = input.checked ? input.value : '';
    else {
      estado[k] = input.checked ? [...new Set([...estado[k], input.value])] : estado[k].filter(v => v !== input.value);
      if (k === 'cat') {
        const permitidos = tiposVisibles().map(x => x.id);
        estado.tipo = estado.tipo.filter(v => permitidos.includes(v));
        if (!conTalles()) estado.talle = [];
      }
    }
    render();
  });
  const limpiar = () => {
    Object.assign(estado, { cat: [], tipo: [], para: [], talle: [], precio: '', regalo: false, stock: false, ofertas: false, q: '' });
    if (inputQ) inputQ.value = '';
    render();
  };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const x = e.target.closest('[data-quitar-f]');
    if (x) {
      const k = x.dataset.quitarF, v = x.dataset.v;
      if (k === 'q') { estado.q = ''; if (inputQ) inputQ.value = ''; }
      else if (k === 'precio') estado.precio = '';
      else if (['regalo', 'stock', 'ofertas'].includes(k)) estado[k] = false;
      else estado[k] = estado[k].filter(y => y !== v);
      render();
      return;
    }
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      estado.cat = tab.dataset.tab ? [tab.dataset.tab] : [];
      estado.tipo = [];
      if (!conTalles()) estado.talle = [];
      render();
    }
  });
  verMas?.addEventListener('click', () => {
    const antes = grid.children.length;
    render({ reset: false });
    grid.children[antes]?.querySelector('.prod-foto')?.focus({ preventScroll: true });
  });

  if (tabs) tabs.innerHTML = `<button type="button" class="chip" data-tab="">Todo <small>${Tienda.contar({})}</small></button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-tab="${c.id}">${esc(c.corto)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');

  if (panel) initPanelFiltros(panel);
  render();
  const prod = sp.get('producto');
  if (prod && Tienda.obtener(prod)) abrirQuickView(prod);
}

function initPanelFiltros(panel) {
  const abrirBtns = document.querySelectorAll('[data-filtros-open]');
  const cajon = () => ES_M2 || window.matchMedia('(max-width: 1099px)').matches;
  let bd = null;
  const marcar = () => {
    if (cajon()) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { cerrar(); panel.removeAttribute('inert'); }
  };
  const abrir = () => {
    if (!cajon()) return;
    ultimoFoco = document.activeElement;
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    bd.hidden = false;
    panel.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { panel.classList.add('open'); bd.classList.add('open'); });
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    panel.querySelector('.filtros-close')?.focus();
  };
  function cerrar() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd?.classList.remove('open');
    setTimeout(() => { if (bd && !bd.classList.contains('open')) bd.hidden = true; }, 300);
    if (cajon()) panel.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    ultimoFoco?.focus?.();
  }
  abrirBtns.forEach(b => b.addEventListener('click', abrir));
  panel.addEventListener('click', e => { if (e.target.closest('[data-filtros-close]')) cerrar(); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); if (panel.classList.contains('open')) atraparFoco(panel, e); });
  window.matchMedia('(max-width: 1099px)').addEventListener('change', marcar);
  marcar();
}

document.addEventListener('cart:updated', updateCartBadge);

Cart.syncStock();
initModelBarScroll();
initMenuCategorias();
initConteos();
if (ES_M2) initRail(initPreview());
else initPreview(initRail());
initGaleria();
initCatalogo();
initReveals();
initNav();
initAcciones();
initCarrito();
initQuickView();
initFloats();
initHeroMotion();
initParallax();
updateCartBadge();
