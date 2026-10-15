const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491159781292';
const ZONA = 'America/Argentina/Buenos_Aires';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const MAPA = { lat: -34.6037, lng: -58.3816, zoom: 15, etiqueta: 'Crepúsculo · Buenos Aires' };

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
  { id: 'lenceria', nombre: 'Lencería', bajada: 'Corpiños, bralettes, pijamas y batas', img: 'images/cat-lenceria.webp',
    texto: 'Corpiños y bralettes de encaje, pijamas de satén y batas para estar en casa.',
    subs: [{ id: 'corpinos', nombre: 'Corpiños y bralettes' }, { id: 'pijamas', nombre: 'Pijamas y batas' }] },
  { id: 'mallas', nombre: 'Mallas', bajada: 'Enterizas, bikinis y salidas de playa', img: 'images/cat-mallas.webp',
    texto: 'Enterizas fruncidas, bikinis estampadas y salidas de playa, en talles del S al XL.',
    subs: [{ id: 'enterizas', nombre: 'Enterizas' }, { id: 'bikinis', nombre: 'Bikinis' }, { id: 'salidas', nombre: 'Salidas de playa' }] },
  { id: 'hombre', nombre: 'Hombre', bajada: 'Boxers, remeras, buzos y joggers', img: 'images/cat-hombre.webp',
    texto: 'Boxers y medias en pack, remeras básicas, buzos, joggers y pijamas.',
    subs: [{ id: 'ropa-interior', nombre: 'Ropa interior' }, { id: 'remeras', nombre: 'Remeras y buzos' }, { id: 'pantalones', nombre: 'Shorts y joggers' }, { id: 'pijamas-h', nombre: 'Pijamas' }] },
  { id: 'indumentaria', nombre: 'Indumentaria', bajada: 'Blusas, tejidos, jeans y remeras', img: 'images/cat-indumentaria.webp',
    texto: 'Blusas estampadas, tejidos, jeans y remeras de lino para el día a día.' },
];
const PARA = [{ id: 'mujer', nombre: 'Mujer' }, { id: 'hombre', nombre: 'Hombre' }];
const COLORES = [
  { id: 'rosa', nombre: 'Rosa', hex: '#D9A9A0' }, { id: 'celeste', nombre: 'Celeste', hex: '#A9C3DE' },
  { id: 'azul', nombre: 'Azul', hex: '#2B3C63' }, { id: 'negro', nombre: 'Negro', hex: '#1E1E22' },
  { id: 'blanco', nombre: 'Blanco', hex: '#F4F4F2' }, { id: 'crudo', nombre: 'Crudo', hex: '#E8DECB' },
  { id: 'gris', nombre: 'Gris', hex: '#A2A6AD' }, { id: 'verde', nombre: 'Verde', hex: '#7A8768' },
  { id: 'terracota', nombre: 'Terracota', hex: '#B5644A' }, { id: 'estampado', nombre: 'Estampado', hex: 'linear-gradient(135deg,#E2A47F 0 33%,#7F9A6C 33% 66%,#F1E6D6 66%)' },
];
const TALLES = ['S', 'M', 'L', 'XL', 'XXL', '85', '90', '95', '100', '36', '38', '40', '42', '44', 'Único'];
const PRECIOS = [
  { id: 'hasta25', nombre: 'Hasta $25.000', min: null, max: 25000 },
  { id: '25a45', nombre: '$25.000 a $45.000', min: 25001, max: 45000 },
  { id: 'mas45', nombre: 'Más de $45.000', min: 45001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS_CAT = {
  lenceria: 'lenceria ropa interior intima corpino brasier pijama bata mujer',
  mallas: 'malla mallas traje de bano bikini enteriza playa pileta verano mujer',
  hombre: 'hombre varon masculino ropa interior',
  indumentaria: 'ropa indumentaria mujer prenda',
};
const HORARIOS = { 0: null, 1: ['10:00', '19:00'], 2: ['10:00', '19:00'], 3: ['10:00', '19:00'], 4: ['10:00', '19:00'], 5: ['10:00', '19:00'], 6: ['10:00', '19:00'] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const LETRAS = ['S', 'M', 'L', 'XL'];
const LETRAS_H = ['S', 'M', 'L', 'XL', 'XXL'];
const COPAS = ['85', '90', '95', '100'];
const E_LEN = 'images/cat-lenceria.webp', E_LOCAL = 'images/local-mesa.webp', E_PERCHA = 'images/mallas-percha.webp',
  E_MAL = 'images/cat-mallas.webp', E_HOM = 'images/cat-hombre.webp', E_IND = 'images/cat-indumentaria.webp';

const COLECCION = [
  { id: 'set-saten-bata', nombre: 'Set de pijama de satén con bata', cat: 'lenceria', sub: 'pijamas', para: 'mujer', precio: 48900, descuento: 0, stock: 6, alta: 12, rango: 1,
    color: 'rosa', talles: ['S', 'M', 'L'], img: 'images/p-set-saten-bata.webp', escena: E_LEN,
    alt: 'Camisola y short de satén rosa con encaje, bralette y bata de plush sobre mármol',
    desc: 'Camisola y short de satén con puntilla de encaje, más la bata de plush al tono.' },
  { id: 'boxers-pack', nombre: 'Pack de 3 boxers de algodón', cat: 'hombre', sub: 'ropa-interior', para: 'hombre', precio: 32500, descuento: 0, stock: 12, alta: 9, rango: 2,
    color: 'gris', talles: LETRAS_H, img: 'images/p-boxers-pack.webp', escena: E_HOM,
    alt: 'Tres boxers de algodón gris, azul y negro con elástico ancho, doblados sobre un estante',
    desc: 'Tres boxers de algodón con elástico ancho, en gris, azul y negro.' },
  { id: 'bikini-triangulo', nombre: 'Bikini triángulo estampada', cat: 'mallas', sub: 'bikinis', para: 'mujer', precio: 36900, descuento: 0, stock: 8, alta: 14, rango: 3,
    color: 'estampado', talles: ['S', 'M', 'L'], img: 'images/p-bikini-triangulo.webp', escena: E_PERCHA,
    alt: 'Bikini triángulo con estampado de flores tropicales colgada en una percha de madera',
    desc: 'Corpiño triángulo con breteles al cuello y bombacha con lazos, en estampado de flores tropicales.' },
  { id: 'malla-frunce-negra', nombre: 'Malla enteriza fruncé clásica', cat: 'mallas', sub: 'enterizas', para: 'mujer', precio: 42500, descuento: 0, stock: 7, alta: 8, rango: 4,
    color: 'negro', talles: LETRAS, img: 'images/p-malla-frunce-negra.webp', escena: E_PERCHA,
    alt: 'Malla enteriza negra con escote en V y fruncido al frente, colgada en una percha',
    desc: 'Enteriza negra con escote en V, breteles anchos y fruncido al frente.' },
  { id: 'cardigan', nombre: 'Cardigan tejido con botones', cat: 'indumentaria', para: 'mujer', precio: 56900, descuento: 0, stock: 5, alta: 7, rango: 5,
    color: 'crudo', talles: ['S', 'M', 'L'], img: 'images/p-cardigan.webp', escena: E_IND,
    alt: 'Cardigan tejido grueso color crudo con botones, doblado sobre una mesa de madera',
    desc: 'Tejido de punto grueso color crudo, con escote en V y botones marrones.' },
  { id: 'blusa-floral', nombre: 'Blusa estampada floral', cat: 'indumentaria', para: 'mujer', precio: 49900, descuento: 0, stock: 6, alta: 10, rango: 6,
    color: 'estampado', talles: ['S', 'M', 'L'], img: 'images/p-blusa-floral.webp', escena: E_IND,
    alt: 'Blusa blanca liviana con estampado floral azul y mangas amplias, colgada en el local',
    desc: 'Blusa liviana con estampado de flores azules, mangas amplias y lazo con borlas al cuello.' },
  { id: 'bralette-rosa', nombre: 'Bralette de encaje rosa viejo', cat: 'lenceria', sub: 'corpinos', para: 'mujer', precio: 22900, descuento: 0, stock: 9, alta: 18, tag: 'Nuevo',
    color: 'rosa', talles: ['S', 'M', 'L'], img: 'images/p-bralette-rosa.webp', escena: E_LEN,
    alt: 'Bralette de encaje rosa viejo con breteles finos sobre mármol',
    desc: 'Bralette sin aro, todo de encaje, con breteles regulables y banda ancha.' },
  { id: 'camisola-saten', nombre: 'Camisola de satén con encaje', cat: 'lenceria', sub: 'pijamas', para: 'mujer', precio: 27900, descuento: 0, stock: 7, alta: 6,
    color: 'rosa', talles: ['S', 'M', 'L'], img: 'images/p-camisola-saten.webp', escena: E_LEN,
    alt: 'Camisola de satén rosa con escote de encaje y moño',
    desc: 'Camisola de satén con escote de encaje y un moño al centro. Breteles finos.' },
  { id: 'short-saten', nombre: 'Short de satén con puntilla', cat: 'lenceria', sub: 'pijamas', para: 'mujer', precio: 19900, descuento: 0, stock: 8, alta: 5,
    color: 'rosa', talles: LETRAS, img: 'images/p-short-saten.webp', escena: E_LEN,
    alt: 'Short de satén rosa con cintura elástica y puntilla de encaje en el borde',
    desc: 'Short de satén con cintura elástica, moño y puntilla de encaje en las piernas.' },
  { id: 'bata-plush', nombre: 'Bata de plush rosa', cat: 'lenceria', sub: 'pijamas', para: 'mujer', precio: 45900, descuento: 0, stock: 4, alta: 4,
    color: 'rosa', talles: ['S', 'M', 'L'], img: 'images/p-bata-plush.webp', escena: E_LEN,
    alt: 'Bata de plush rosa con cinturón anudado',
    desc: 'Bata de plush suave con cuello chal, bolsillos y cinturón para anudar.' },
  { id: 'corpino-celeste', nombre: 'Corpiño de encaje celeste', cat: 'lenceria', sub: 'corpinos', para: 'mujer', precio: 24900, descuento: 15, stock: 10, alta: 3,
    color: 'celeste', talles: COPAS, img: 'images/p-corpino-celeste.webp', escena: E_LOCAL,
    alt: 'Corpiños de encaje celeste en una bandeja, junto a batas celestes dobladas',
    desc: 'Corpiño de encaje con taza suave y breteles regulables. Talles por contorno: del 85 al 100.' },
  { id: 'corpino-azul', nombre: 'Corpiño de encaje azul marino', cat: 'lenceria', sub: 'corpinos', para: 'mujer', precio: 24900, descuento: 0, stock: 3, alta: 15,
    color: 'azul', talles: COPAS, img: 'images/p-corpino-azul.webp', escena: E_LOCAL,
    alt: 'Corpiños de encaje azul marino y crudo sobre una mesa del local',
    desc: 'Corpiño de encaje azul marino con taza suave y detalle de puntilla clara. Del 85 al 100.' },
  { id: 'pijama-floral', nombre: 'Pijama estampado floral', cat: 'lenceria', sub: 'pijamas', para: 'mujer', precio: 39900, descuento: 0, stock: 6, alta: 17, tag: 'Nuevo',
    color: 'estampado', talles: LETRAS, img: 'images/p-pijama-floral.webp', escena: E_LOCAL,
    alt: 'Pijamas blancos con estampado de flores azules doblados en pila',
    desc: 'Camisa con cuello y botones más pantalón largo, en algodón blanco con flores azules.' },
  { id: 'malla-oliva', nombre: 'Malla enteriza con nudo verde oliva', cat: 'mallas', sub: 'enterizas', para: 'mujer', precio: 42500, descuento: 0, stock: 5, alta: 11,
    color: 'verde', talles: LETRAS, img: 'images/p-malla-oliva.webp', escena: E_PERCHA,
    alt: 'Malla enteriza verde oliva con nudo al frente y laterales fruncidos, en percha',
    desc: 'Enteriza verde oliva con escote profundo, nudo al centro y laterales fruncidos.' },
  { id: 'salida-crochet', nombre: 'Salida de playa de crochet', cat: 'mallas', sub: 'salidas', para: 'mujer', precio: 38900, descuento: 0, stock: 4, alta: 13,
    color: 'crudo', talles: ['Único'], img: 'images/p-salida-crochet.webp', escena: E_PERCHA,
    alt: 'Salida de playa larga de crochet color crudo con flecos, colgada en una percha',
    desc: 'Kimono largo de crochet color crudo con flecos en las mangas. Talle único.' },
  { id: 'malla-terracota', nombre: 'Malla enteriza cruzada terracota', cat: 'mallas', sub: 'enterizas', para: 'mujer', precio: 44900, descuento: 0, stock: 6, alta: 16, tag: 'Nuevo',
    color: 'terracota', talles: LETRAS, img: 'images/p-malla-terracota.webp', escena: E_MAL,
    alt: 'Malla enteriza terracota con escote cruzado y cintura drapeada, junto a un sombrero de paja',
    desc: 'Enteriza terracota con escote cruzado y cintura drapeada.' },
  { id: 'bikini-floral', nombre: 'Bikini floral con lazos', cat: 'mallas', sub: 'bikinis', para: 'mujer', precio: 36900, descuento: 0, stock: 2, alta: 2,
    color: 'estampado', talles: ['S', 'M', 'L'], img: 'images/p-bikini-floral.webp', escena: E_MAL,
    alt: 'Bikini con estampado de flores terracota y hojas verdes, con lazos y cuentas de madera',
    desc: 'Triángulo y bombacha con lazos y cuentas de madera, en flores terracota sobre fondo crudo.' },
  { id: 'remera-basica', nombre: 'Remera básica de algodón', cat: 'hombre', sub: 'remeras', para: 'hombre', precio: 18900, descuento: 0, stock: 15, alta: 1,
    color: 'blanco', talles: LETRAS_H, img: 'images/p-remera-basica.webp', escena: E_HOM,
    alt: 'Remeras básicas dobladas en blanco, gris, azul y verde',
    desc: 'Remera de algodón cuello redondo. También en gris, azul y verde: avisanos el color.' },
  { id: 'buzo-canguro', nombre: 'Buzo canguro gris melange', cat: 'hombre', sub: 'remeras', para: 'hombre', precio: 54900, descuento: 0, stock: 6, alta: 0,
    color: 'gris', talles: LETRAS_H, img: 'images/p-buzo-canguro.webp', escena: E_HOM,
    alt: 'Buzo canguro gris melange con capucha y cordones, doblado',
    desc: 'Buzo de frisa con capucha, cordones y bolsillo canguro.' },
  { id: 'short-algodon', nombre: 'Short de algodón con cordón', cat: 'hombre', sub: 'pantalones', para: 'hombre', precio: 24900, descuento: 0, stock: 9, alta: -1,
    color: 'azul', talles: LETRAS_H, img: 'images/p-short-algodon.webp', escena: E_HOM,
    alt: 'Short de algodón azul marino con cintura elástica y cordón',
    desc: 'Short de algodón con cintura elástica, cordón y bolsillos.' },
  { id: 'medias-pack', nombre: 'Pack de 3 pares de medias', cat: 'hombre', sub: 'ropa-interior', para: 'hombre', precio: 9900, descuento: 0, stock: 20, alta: -2,
    color: 'gris', talles: ['Único'], img: 'images/p-medias-pack.webp', escena: E_HOM,
    alt: 'Tres pares de medias deportivas blanco, gris y negro',
    desc: 'Medias de algodón en blanco, gris y negro. Talle único.' },
  { id: 'jogger-azul', nombre: 'Jogger de algodón azul', cat: 'hombre', sub: 'pantalones', para: 'hombre', precio: 34900, descuento: 0, stock: 7, alta: -3,
    color: 'azul', talles: LETRAS_H, img: 'images/p-jogger-gris.webp', escena: E_LOCAL,
    alt: 'Jogger de algodón azul oscuro con cordón crudo, doblado sobre una pila de prendas',
    desc: 'Pantalón jogger de algodón con cintura elástica y cordón en contraste.' },
  { id: 'pijama-azul', nombre: 'Pijama azul marino con vivo', cat: 'hombre', sub: 'pijamas-h', para: 'hombre', precio: 41900, descuento: 0, stock: 5, alta: -4,
    color: 'azul', talles: LETRAS_H, img: 'images/p-pijama-azul.webp', escena: E_LOCAL,
    alt: 'Pijamas azul marino con vivo blanco y bolsillo, doblados en pila',
    desc: 'Camisa con vivo blanco y bolsillo, más pantalón largo. Algodón azul marino.' },
  { id: 'jean-recto', nombre: 'Jean recto tiro alto', cat: 'indumentaria', para: 'mujer', precio: 52900, descuento: 0, stock: 8, alta: -5,
    color: 'azul', talles: ['36', '38', '40', '42', '44'], img: 'images/p-jean-recto.webp', escena: E_IND,
    alt: 'Jeans azules doblados en pila sobre una mesa del local',
    desc: 'Jean de corte recto y tiro alto, lavado medio. Talles del 36 al 44.' },
  { id: 'remera-lino', nombre: 'Remera de lino', cat: 'indumentaria', para: 'mujer', precio: 29900, descuento: 0, stock: 7, alta: -6,
    color: 'verde', talles: ['S', 'M', 'L'], img: 'images/p-remera-lino.webp', escena: E_IND,
    alt: 'Remeras de lino dobladas en blanco y verde salvia',
    desc: 'Remera de lino verde salvia, fresca y de calce suelto. También en blanco.' },
  { id: 'top-encaje', nombre: 'Top de encaje negro', cat: 'lenceria', sub: 'corpinos', para: 'mujer', precio: 26900, descuento: 0, stock: 0, alta: 20, visible: false,
    color: 'negro', talles: ['S', 'M'], img: 'images/p-bralette-rosa.webp', escena: E_LEN, alt: 'Top de encaje', desc: 'Próximo ingreso.' },
];

function crearTienda(coleccion, { tope = 100, extra = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
  const indice = new Map(visibles.map(p => {
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    return [p.id, norm([p.nombre, cat?.nombre, cat?.subs?.find(s => s.id === p.sub)?.nombre, p.para, nombreDe(COLORES, p.color), p.desc, ...(p.talles || []), extra(p)].join(' '))];
  }));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), para = lista(f.para), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (para.length && !para.includes(p.para)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !(p.talles || []).some(t => talle.includes(t))) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const Tienda = crearTienda(COLECCION, { tope: 100, extra: p => ETIQUETAS_CAT[p.cat] || '' });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conTalle = p => (p.talles || []).length > 1;
const fondoColor = id => COLORES.find(x => x.id === id)?.hex || '#ccc';

const Cart = {
  KEY: 'crepusculo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.talle || '') === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.talle || '') === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle || '') === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  talle: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
  luna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = cat?.subs?.find(s => s.id === p.sub);
  const t = conTalle(p) ? `Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]}` : 'Talle único';
  return `${sub ? sub.nombre : cat?.nombre || ''} · ${t}`;
}
function puntoColor(p) {
  return `<span class="punto-color" style="background:${fondoColor(p.color)}" aria-hidden="true"></span>`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="badge">${esc(p.tag)}</span>`);
  else if (p.stock <= 3) b.push('<span class="badge badge--claro">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p, { variante = MODELO === '2' ? 'foto' : 'clasica', compacta = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="640" height="800" decoding="async">`;
  const accionRapida = conTalle(p)
    ? `<button type="button" class="prod-add prod-add--icono" data-qv-abrir="${p.id}" aria-label="Elegir talle: ${nombre}">${ICON.talle}</button>`
    : `<button type="button" class="prod-add prod-add--icono" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
  if (variante === 'foto') {
    return `<article class="prod prod--foto">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver detalle: ${nombre}">${img}${badgesHTML(p)}</a>
      <div class="prod__info">
        <p class="prod__meta">${puntoColor(p)}${esc(metaDe(p))}</p>
        <h3 class="prod__nombre">${nombre}</h3>
        ${precioHTML(p)}
      </div>
      ${accionRapida.replace('prod-add--icono', 'prod-add--redondo')}
    </article>`;
  }
  if (compacta) {
    return `<article class="prod prod--compacta">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
      <div class="prod__body">
        <p class="prod__meta">${puntoColor(p)}${esc(metaDe(p))}</p>
        <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
        <div class="prod__fila">${precioHTML(p)}${accionRapida}</div>
      </div>
    </article>`;
  }
  const control = conTalle(p)
    ? `<label class="talle-sel"><span class="sr-only">Talle de ${nombre}</span><select data-talle>${p.talles.map(t => `<option value="${t}">${t}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
    <div class="prod__body">
      <p class="prod__meta">${puntoColor(p)}${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = CATEGORIAS.map(c => `
      <div class="cats-col">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="48" height="48" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__n">${Tienda.contar({ cat: c.id })} productos</span></span>
        </a>
        ${c.subs ? `<div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>` : ''}
      </div>`).join('')
      + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function ahoraEnZona() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const v = t => partes.find(p => p.type === t)?.value;
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[v('weekday')] ?? new Date().getDay();
  return { dia, min: (parseInt(v('hour'), 10) % 24) * 60 + parseInt(v('minute'), 10) };
}
const aMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const horaCorta = s => (s.endsWith(':00') ? s.slice(0, -3) : s);
function estadoAtencion(ahora = ahoraEnZona()) {
  const hoy = HORARIOS[ahora.dia];
  if (hoy && ahora.min >= aMin(hoy[0]) && ahora.min < aMin(hoy[1])) {
    return { abierto: true, texto: 'Abierto ahora', detalle: `hasta las ${horaCorta(hoy[1])} h` };
  }
  for (let k = 0; k < 8; k++) {
    const d = (ahora.dia + k) % 7;
    const h = HORARIOS[d];
    if (!h || (k === 0 && ahora.min >= aMin(h[0]))) continue;
    const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, texto: 'Cerrado ahora', detalle: `abrimos ${cuando} a las ${horaCorta(h[0])} h` };
  }
  return { abierto: false, texto: 'Cerrado ahora', detalle: '' };
}
function initHorarios() {
  const pintar = () => {
    const ahora = ahoraEnZona();
    const e = estadoAtencion(ahora);
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      el.innerHTML = `<span class="estado__punto" aria-hidden="true"></span>${e.texto}`;
    });
    document.querySelectorAll('[data-estado-detalle]').forEach(el => { el.textContent = e.detalle; });
    document.querySelectorAll('[data-dia]').forEach(li => li.classList.toggle('is-hoy', li.dataset.dia.split(',').map(Number).includes(ahora.dia)));
    document.querySelectorAll('[data-horario-cta]').forEach(a => {
      a.href = wspHref(e.abierto ? 'Hola Crepúsculo! ¿Están en el local? Quiero hacer una consulta.' : 'Hola Crepúsculo! Les dejo mi consulta para cuando abran: ');
      const txt = a.querySelector('[data-horario-cta-txt]');
      if (txt) txt.textContent = e.abierto ? 'Escribinos ahora' : 'Dejanos tu consulta';
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initMapa() {
  const cont = document.getElementById('mapa');
  if (!cont) return;
  const crear = () => {
    if (cont.dataset.listo || typeof L === 'undefined') return;
    cont.dataset.listo = '1';
    const mapa = L.map(cont, { center: [MAPA.lat, MAPA.lng], zoom: MAPA.zoom, scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin', html: `<span class="pin__punto">${ICON.luna}</span>`, iconSize: [44, 44], iconAnchor: [22, 44] });
    L.marker([MAPA.lat, MAPA.lng], { icon: icono, title: MAPA.etiqueta, keyboard: false }).addTo(mapa);
    [400, 1300, 2600].forEach(ms => setTimeout(() => mapa.invalidateSize(), ms));
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { crear(); io.disconnect(); } }, { rootMargin: '300px 0px' });
  io.observe(cont);
  window.addEventListener('load', () => { const r = cont.getBoundingClientRect(); if (r.top < window.innerHeight + 300) crear(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.12 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.mundo__label'), { y: 24, opacity: 0, duration: 1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const sec = el.closest('section') || el;
    gsap.to(el, { yPercent: Number(el.dataset.parallax) || 6, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });
}

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
      trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
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
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (moved) requestAnimationFrame(() => vp.classList.remove('dragging'));
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 20;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function pintarTabs(cat) {
  const grid = document.getElementById('gridTabs');
  if (!grid) return;
  const items = Tienda.consultar({ filtros: { cat }, orden: 'destacados', limite: 8 }).items;
  grid.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'foto' })}</li>`).join('');
  const ver = document.querySelector('[data-tabs-ver]');
  if (ver) { ver.href = `${CATALOGO_URL}?cat=${cat}`; const t = ver.querySelector('span'); if (t) t.textContent = `Ver todo ${nombreDe(CATEGORIAS, cat).toLowerCase()}`; }
}
function initTabs() {
  const tabs = [...document.querySelectorAll('[data-tab]')];
  if (!tabs.length) return;
  pintarTabs(tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.tab || tabs[0].dataset.tab);
  const activar = (t, foco) => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    if (foco) t.focus();
    pintarTabs(t.dataset.tab);
    revelarNuevos(document.getElementById('gridTabs'));
    refrescarTriggers();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      activar(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const rail = document.getElementById('railDestacados');
  if (rail) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const grilla = document.getElementById('gridNovedades');
  if (grilla) {
    const items = Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
    grilla.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const mallas = document.getElementById('railMallas');
  if (mallas) {
    const items = Tienda.consultar({ filtros: { cat: 'mallas' }, orden: 'destacados', limite: 8 }).items;
    mallas.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { variante: 'foto' })}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} productos`;
  });
}

const QV = { p: null, talle: '', foto: 0, opener: null };
function guiaTalles(p) {
  if (p.talles.includes('85')) return '<table><caption class="sr-only">Guía de talles de corpiños</caption><thead><tr><th scope="col">Talle</th><th scope="col">Contorno bajo busto</th></tr></thead><tbody><tr><td>85</td><td>68 a 72 cm</td></tr><tr><td>90</td><td>73 a 77 cm</td></tr><tr><td>95</td><td>78 a 82 cm</td></tr><tr><td>100</td><td>83 a 87 cm</td></tr></tbody></table>';
  if (p.talles.includes('38')) return '<table><caption class="sr-only">Guía de talles de jeans</caption><thead><tr><th scope="col">Talle</th><th scope="col">Cintura</th></tr></thead><tbody><tr><td>36</td><td>66 cm</td></tr><tr><td>38</td><td>70 cm</td></tr><tr><td>40</td><td>74 cm</td></tr><tr><td>42</td><td>78 cm</td></tr><tr><td>44</td><td>82 cm</td></tr></tbody></table>';
  return '<table><caption class="sr-only">Guía de talles por letra</caption><thead><tr><th scope="col">Talle</th><th scope="col">Equivale a</th></tr></thead><tbody><tr><td>S</td><td>36 a 38</td></tr><tr><td>M</td><td>40 a 42</td></tr><tr><td>L</td><td>44 a 46</td></tr><tr><td>XL</td><td>48</td></tr><tr><td>XXL</td><td>50</td></tr></tbody></table>';
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = cat?.subs?.find(s => s.id === p.sub);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `En el local: ${p.alt}` }];
  const msg = `Hola Crepúsculo! Quiero consultar por ${p.nombre}${QV.talle && QV.talle !== 'Único' ? ` talle ${QV.talle}` : ''}.`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="640" height="800"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto en el local' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}${sub ? ` · ${esc(sub.nombre)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__color">${puntoColor(p)}Color: ${esc(nombreDe(COLORES, p.color))}</p>
        ${conTalle(p) ? `<div class="qv__talles-wrap">
          <p class="qv__label">Talle</p>
          <div class="qv__talles" role="group" aria-label="Elegí el talle">${p.talles.map(t => `<button type="button" class="qv__talle" data-qv-talle="${t}" aria-pressed="${QV.talle === t}">${t}</button>`).join('')}</div>
          <p class="qv__talle-aviso" id="qvTalleAviso" aria-live="polite"></p>
          <details class="qv__guia"><summary>Guía de talles</summary>${guiaTalles(p)}</details>
        </div>` : '<p class="qv__label">Talle único</p>'}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <p class="qv__stock">${p.stock <= 3 ? `Quedan ${p.stock} unidades` : 'En stock'} · Probátelo en el local o pedilo online</p>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span class="qv__rel-foto"><img src="${r.img}" alt="" width="640" height="800"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, color: nombreDe(COLORES, p.color),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.talle = conTalle(p) ? '' : (p.talles?.[0] || ''); QV.foto = 0;
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
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const t = e.target.closest('[data-qv-talle]');
    if (t) {
      QV.talle = t.dataset.qvTalle;
      modal.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      const aviso = document.getElementById('qvTalleAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Crepúsculo! Quiero consultar por ${QV.p.nombre} talle ${QV.talle}.`);
      return;
    }
    const st = e.target.closest('[data-stepper]');
    if (st) {
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
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conTalle(p) && !QV.talle) {
        const aviso = document.getElementById('qvTalleAviso');
        if (aviso) aviso.textContent = 'Elegí un talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-talle]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conTalle(p) ? QV.talle : (p.talles?.[0] || ''));
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${conTalle(p) ? ` (talle ${QV.talle})` : ''} al carrito.`);
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
  const talle = i.talle || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-talle="${esc(talle)}">
    <img src="${p.img}" alt="" width="64" height="80">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${talle && talle !== 'Único' ? `Talle ${esc(talle)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function textoPedido(lineas, total) {
  return ['Hola Crepúsculo! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.talle && i.talle !== 'Único' ? ` (talle ${i.talle})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.luna}<p>Tu carrito está vacío. Empezá por la lencería, las mallas o lo nuevo de hombre.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Ver productos ${ICON.flecha}</a></div>`;
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
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, talle = linea.dataset.lineaTalle || '';
    const it = Cart.get().find(i => i.id === id && (i.talle || '') === talle);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, talle); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, talle, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, talle, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
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
    if (e.target.closest('.qv')) return;
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
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
      const acciones = add.closest('.prod__acciones');
      const talle = acciones?.querySelector('[data-talle]')?.value || (p.talles?.[0] || '');
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, talle);
      showToast(`Sumaste ${p.nombre}${conTalle(p) ? ` (talle ${talle})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const talle = acciones?.querySelector('[data-talle]')?.value || (p.talles?.[0] || '');
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, talle);
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
  const subsDe = cat => CATEGORIAS.find(c => c.id === cat)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [],
    para: multi('para', PARA), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = multi('sub', subsDe(e.cat));
  const compatibles = () => { if (!subsDe(e.cat).some(s => e.sub.includes(s.id))) e.sub = []; };

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.para.length) f.para = e.para;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${nombre.replace(/-.*$/, '')}"${marcado ? ' checked' : ''}>${etiqueta}${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}))}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }))).join('')}</fieldset>`);
    const subs = subsDe(e.cat);
    if (subs.length) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subs.map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }))).join('')}</fieldset>`);
    if (!e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Para</legend>
      ${PARA.map(x => opcion('checkbox', `para-${x.id}`, x.id, x.nombre, e.para.includes(x.id), Tienda.contar({ ...base, para: x.id }))).join('')}</fieldset>`);
    const tallesDisp = TALLES.filter(t => Tienda.contar({ ...base, talle: t }) > 0);
    grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend><div class="f-talles">
      ${tallesDisp.map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`);
    const coloresDisp = COLORES.filter(c => Tienda.contar({ ...base, color: c.id }) > 0);
    grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${coloresDisp.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><span class="f-color__muestra" style="background:${c.hex}" aria-hidden="true"></span><span class="f-color__nombre">${c.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio)}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const paraUnico = !cat && e.para.length === 1 ? nombreDe(PARA, e.para[0]) : '';
    const titulo = sub ? sub.nombre : cat ? cat.nombre : paraUnico ? `Todo ${paraUnico.toLowerCase()}` : 'Catálogo completo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Lencería, mallas e indumentaria para mujer y hombre. Elegí tu talle y comprá online o en el local.';
    document.title = `${titulo} — Crepúsculo`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    const subs = subsDe(e.cat);
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subs, v)]));
    e.para.forEach(v => quitar.push(['para', v, `Para ${nombreDe(PARA, v).toLowerCase()}`]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'para', 'color', 'talle', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.para.length) u.searchParams.set('para', e.para.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.para = []; e.color = []; e.talle = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = [];
    aplicar();
  });
  document.querySelectorAll('a[href="#buscar"]').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    buscar.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    buscar.focus({ preventScroll: true });
  }));
  document.querySelectorAll('.cats-item, .cats-subs a, .cats-todo, a[data-para-link]').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.para = (u.searchParams.get('para') || '').split(',').filter(v => PARA.some(x => x.id === v));
    e.color = []; e.talle = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
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
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
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

initCatsMenu();
initHome();
initTabs();
initCatalogo();
initHorarios();
initReveals();
initNav();
initHeroMotion();
initParallax();
initLeeScroll();
initRail();
initMapa();
initQV();
initCarrito();
initAcciones();
initFloats();
initModelBarScroll();
syncModelosLink();
updateCartBadge();
