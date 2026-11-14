const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
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

const WSP = '595983668218';
const MARCA = 'Randy Outlet';
const CATEGORIAS = [
  { id: 'damas', nombre: 'Damas', titulo: 'Ropa de damas', bajada: 'Vestidos y prendas para ella', img: 'images/p-vestido-floral.webp' },
  { id: 'caballeros', nombre: 'Caballeros', titulo: 'Ropa de caballeros', bajada: 'Camisas para todos los días', img: 'images/p-camisa-marino.webp' },
  { id: 'ninos', nombre: 'Niños', titulo: 'Ropa de niños', bajada: 'Conjuntos de 4 a 8 años', img: 'images/p-conjunto-amarillo.webp' },
  { id: 'bano', nombre: 'Trajes de baño y lencería', titulo: 'Trajes de baño y lencería', bajada: 'Mallas enterizas y camisolas', img: 'images/p-malla-petroleo.webp' },
  { id: 'carteras', nombre: 'Carteras', titulo: 'Carteras', bajada: 'Para llevar todos los días', img: 'images/p-cartera-suela.webp' },
  { id: 'peluches', nombre: 'Peluches', titulo: 'Peluches', bajada: 'Para regalar o para la cama', img: 'images/p-oso-marron.webp' },
  { id: 'hogar', nombre: 'Hogar', titulo: 'Para el hogar', bajada: 'Sábanas, cortinas y blanquería', img: 'images/p-sabanas.webp' },
];
const TALLES = [
  { id: 's', nombre: 'S', etq: 'S' },
  { id: 'm', nombre: 'M', etq: 'M' },
  { id: 'l', nombre: 'L', etq: 'L' },
  { id: 'xl', nombre: 'XL', etq: 'XL' },
  { id: '4', nombre: '4 años', etq: '4 años', ninos: true },
  { id: '6', nombre: '6 años', etq: '6 años', ninos: true },
  { id: '8', nombre: '8 años', etq: '8 años', ninos: true },
  { id: 'unico', nombre: 'Talle único', etq: 'Único' },
];
const ORIGENES = [
  { id: 'eeuu', nombre: 'Americana', largo: 'Estados Unidos' },
  { id: 'brasil', nombre: 'Brasilera', largo: 'Brasil' },
];
const ESTADOS = { excelente: 'Excelente estado', 'muy-bueno': 'Muy buen estado' };
const PRECIOS = [
  { id: 'hasta7', nombre: 'Hasta $7.000', min: 0, max: 7000 },
  { id: '7a10', nombre: '$7.000 a $10.000', min: 7000, max: 10000 },
  { id: 'mas10', nombre: 'Más de $10.000', min: 10000, max: null },
];
const PRODUCTOS = [
  { id: 'vestido-floral-volados', rango: 1, cat: 'damas', talle: 'm', origen: 'eeuu', estado: 'muy-bueno', stock: 1, nombre: 'Vestido largo floral con volados', pres: 'Largo midi · Cintura elastizada', precio: 9500, descuento: 0, img: 'images/p-vestido-floral.webp', alt: 'Vestido largo con flores rosas y amarillas sobre fondo crema, con mangas de volado, colgado en una percha', gancho: 'Flores sobre fondo crema y mangas con volado', desc: 'Vestido largo de tela liviana con estampado de flores, escote cruzado, cintura elastizada y falda con volado. Fresco para el calor.', ficha: [['Talle', 'M'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Largo', 'Midi']], claves: ['vestido', 'floral', 'flores', 'largo', 'volado', 'verano', 'mujer', 'dama'] },
  { id: 'camisa-marino', rango: 2, cat: 'caballeros', talle: 'l', origen: 'eeuu', estado: 'muy-bueno', stock: 2, nombre: 'Camisa de gabardina azul marino', pres: 'Manga larga · Bolsillo al pecho', precio: 7500, descuento: 0, img: 'images/p-camisa-marino.webp', alt: 'Camisa de hombre azul marino de manga larga con botones blancos y bolsillo en el pecho', gancho: 'Manga larga con bolsillo al pecho', desc: 'Camisa de gabardina azul marino, manga larga, con botones blancos y bolsillo en el pecho. Va con jean y con pantalón de vestir.', ficha: [['Talle', 'L'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Manga', 'Larga']], claves: ['camisa', 'azul', 'marino', 'gabardina', 'hombre', 'caballero', 'manga larga'] },
  { id: 'conjunto-amarillo', rango: 3, cat: 'ninos', talle: '6', origen: 'eeuu', estado: 'excelente', stock: 1, nombre: 'Conjunto remera amarilla y short de jean', pres: 'Remera de algodón · Short con bolsillos', precio: 6500, descuento: 0, img: 'images/p-conjunto-amarillo.webp', alt: 'Remera amarilla de niño y short de jean celeste con bolsillos', gancho: 'Remera amarilla y short de jean', desc: 'Conjunto de remera amarilla de algodón y short de jean con bolsillos y presillas para el cinto. Para jugar todo el día.', ficha: [['Talle', '6 años'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Incluye', 'Remera y short']], claves: ['conjunto', 'remera', 'short', 'jean', 'amarillo', 'nene', 'nena', 'chico', 'infantil'] },
  { id: 'malla-petroleo', rango: 4, cat: 'bano', talle: 'm', origen: 'brasil', estado: 'excelente', stock: 1, nombre: 'Malla enteriza verde petróleo', pres: 'Frunce al frente · Breteles anchos', precio: 8500, descuento: 0, img: 'images/p-malla-petroleo.webp', alt: 'Malla enteriza de mujer verde petróleo con frunce al frente y breteles anchos', gancho: 'Enteriza con frunce al frente', desc: 'Malla enteriza brasilera verde petróleo, con frunce al frente que estiliza y breteles anchos que sostienen bien.', ficha: [['Talle', 'M'], ['Estado', 'Excelente'], ['Origen', 'Brasil'], ['Modelo', 'Enteriza']], claves: ['malla', 'traje de baño', 'enteriza', 'verde', 'petroleo', 'pileta', 'playa', 'mujer'] },
  { id: 'cartera-suela', rango: 5, cat: 'carteras', talle: 'unico', origen: 'eeuu', estado: 'muy-bueno', stock: 1, nombre: 'Cartera tipo hobo color suela', pres: 'Asa al hombro · Herrajes dorados', precio: 14900, descuento: 0, img: 'images/p-cartera-suela.webp', alt: 'Cartera grande tipo hobo color suela con asa al hombro y herrajes dorados', gancho: 'Grande, blanda y con asa al hombro', desc: 'Cartera tipo hobo color suela, grande y blanda, con asa para llevar al hombro y herrajes dorados. Entra todo lo del día.', ficha: [['Medida', 'Grande'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Color', 'Suela']], claves: ['cartera', 'bolso', 'hobo', 'suela', 'marron', 'cuero', 'hombro'] },
  { id: 'oso-marron', rango: 6, cat: 'peluches', talle: 'unico', origen: 'eeuu', estado: 'excelente', stock: 3, nombre: 'Oso de peluche marrón', pres: 'Unos 35 cm sentado', precio: 5500, descuento: 0, img: 'images/p-oso-marron.webp', alt: 'Oso de peluche marrón sentado, con hocico y patas claras', gancho: 'Suave, sentado, con hocico claro', desc: 'Oso de peluche marrón, suave, con hocico y patas en tono claro. Mide unos 35 cm sentado.', ficha: [['Medida', 'Unos 35 cm'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Color', 'Marrón']], claves: ['oso', 'osito', 'peluche', 'marron', 'regalo', 'bebe'] },
  { id: 'camisola-crema', rango: 7, cat: 'bano', talle: 'm', origen: 'eeuu', estado: 'excelente', stock: 1, nombre: 'Camisola de encaje color crema', pres: 'Breteles finos · Moño al centro', precio: 6900, descuento: 0, img: 'images/p-camisola-crema.webp', alt: 'Camisola de lencería de encaje color crema con breteles finos y un moño al centro', gancho: 'Encaje con breteles finos', desc: 'Camisola de lencería toda de encaje color crema, con breteles finos y un moñito al centro del escote.', ficha: [['Talle', 'M'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Tela', 'Encaje']], claves: ['camisola', 'lenceria', 'encaje', 'crema', 'blanca', 'mujer'] },
  { id: 'sabanas-2-plazas', rango: 8, cat: 'hogar', talle: null, origen: 'eeuu', estado: 'muy-bueno', stock: 2, nombre: 'Juego de sábanas crema y celeste, 2 plazas', pres: '2 plazas · Algodón', precio: 16500, descuento: 0, img: 'images/p-sabanas.webp', alt: 'Dos sábanas dobladas, una color crema y otra celeste', gancho: 'Una crema y una celeste, de algodón', desc: 'Juego de sábanas de 2 plazas: una crema y una celeste, de algodón. Lavadas y dobladas, listas para usar.', ficha: [['Medida', '2 plazas'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Tela', 'Algodón']], claves: ['sabana', 'sabanas', 'juego', 'cama', 'blanqueria', 'celeste', 'crema', 'hogar'] },
  { id: 'vestido-floral-azul', rango: 9, cat: 'damas', talle: 's', origen: 'brasil', estado: 'excelente', stock: 1, nombre: 'Vestido largo floral azul', pres: 'Largo midi · Escote cruzado', precio: 8900, descuento: 0, img: 'images/p-vestido-floral-azul.webp', alt: 'Vestido largo con flores celestes y azules, mangas con volado, colgado en una percha', gancho: 'Flores en celeste y azul', desc: 'Vestido largo brasilero con flores en tonos celeste y azul, escote cruzado y mangas con volado.', ficha: [['Talle', 'S'], ['Estado', 'Excelente'], ['Origen', 'Brasil'], ['Largo', 'Midi']], claves: ['vestido', 'floral', 'flores', 'azul', 'celeste', 'largo', 'verano', 'mujer', 'dama'] },
  { id: 'camisa-oliva', rango: 10, cat: 'caballeros', talle: 'm', origen: 'eeuu', estado: 'excelente', stock: 1, nombre: 'Camisa de gabardina verde oliva', pres: 'Manga larga · Bolsillo al pecho', precio: 7900, descuento: 0, img: 'images/p-camisa-oliva.webp', alt: 'Camisa de hombre verde oliva de manga larga con botones blancos', gancho: 'Verde oliva, manga larga', desc: 'Camisa de gabardina verde oliva, manga larga, con botones blancos y bolsillo en el pecho.', ficha: [['Talle', 'M'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Manga', 'Larga']], claves: ['camisa', 'verde', 'oliva', 'gabardina', 'hombre', 'caballero', 'manga larga'] },
  { id: 'conjunto-coral', rango: 11, cat: 'ninos', talle: '4', origen: 'brasil', estado: 'muy-bueno', stock: 2, nombre: 'Conjunto remera coral y short de jean', pres: 'Remera de algodón · Short con bolsillos', precio: 5900, descuento: 0, img: 'images/p-conjunto-coral.webp', alt: 'Remera coral de niño y short de jean celeste', gancho: 'Remera coral y short de jean', desc: 'Conjunto brasilero de remera coral de algodón y short de jean con bolsillos.', ficha: [['Talle', '4 años'], ['Estado', 'Muy bueno'], ['Origen', 'Brasil'], ['Incluye', 'Remera y short']], claves: ['conjunto', 'remera', 'short', 'jean', 'coral', 'naranja', 'nene', 'nena', 'infantil'] },
  { id: 'malla-bordo', rango: 12, cat: 'bano', talle: 'l', origen: 'brasil', estado: 'muy-bueno', stock: 1, nombre: 'Malla enteriza bordó', pres: 'Frunce al frente · Breteles anchos', precio: 7900, descuento: 0, img: 'images/p-malla-bordo.webp', alt: 'Malla enteriza de mujer color bordó con frunce al frente', gancho: 'Bordó, enteriza y con frunce', desc: 'Malla enteriza brasilera color bordó, con frunce al frente y breteles anchos.', ficha: [['Talle', 'L'], ['Estado', 'Muy bueno'], ['Origen', 'Brasil'], ['Modelo', 'Enteriza']], claves: ['malla', 'traje de baño', 'enteriza', 'bordo', 'rojo', 'pileta', 'playa', 'mujer'] },
  { id: 'cortinas-crema', rango: 13, cat: 'hogar', talle: null, origen: 'eeuu', estado: 'muy-bueno', stock: 1, nombre: 'Par de cortinas de lino color crema', pres: 'Par · Con frunce para barral', precio: 18900, descuento: 0, img: 'images/p-cortinas-crema.webp', alt: 'Dos paños de cortina de lino color crema, doblados, con el frunce para el barral', gancho: 'Lino crema que deja pasar la luz', desc: 'Par de cortinas de tela tipo lino color crema, con frunce para colgar del barral. Dejan pasar la luz y dan intimidad.', ficha: [['Medida', 'Par de paños'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Tela', 'Tipo lino']], claves: ['cortina', 'cortinas', 'lino', 'crema', 'ventana', 'barral', 'hogar'] },
  { id: 'osito-rosa', rango: 14, cat: 'peluches', talle: 'unico', origen: 'eeuu', estado: 'excelente', stock: 2, nombre: 'Osito de peluche rosa', pres: 'Unos 35 cm sentado', precio: 4900, descuento: 0, img: 'images/p-oso-rosa.webp', alt: 'Osito de peluche rosa sentado, con hocico claro', gancho: 'Rosa y suave, para regalar', desc: 'Osito de peluche rosa, suave, con hocico claro. Mide unos 35 cm sentado.', ficha: [['Medida', 'Unos 35 cm'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Color', 'Rosa']], claves: ['oso', 'osito', 'peluche', 'rosa', 'regalo', 'bebe', 'nena'] },
  { id: 'camisa-bordo', rango: 15, cat: 'caballeros', talle: 'xl', origen: 'brasil', estado: 'muy-bueno', stock: 1, nombre: 'Camisa de gabardina bordó', pres: 'Manga larga · Bolsillo al pecho', precio: 8200, descuento: 0, img: 'images/p-camisa-bordo.webp', alt: 'Camisa de hombre bordó de manga larga con botones blancos', gancho: 'Bordó, manga larga', desc: 'Camisa brasilera de gabardina bordó, manga larga, con botones blancos y bolsillo en el pecho.', ficha: [['Talle', 'XL'], ['Estado', 'Muy bueno'], ['Origen', 'Brasil'], ['Manga', 'Larga']], claves: ['camisa', 'bordo', 'rojo', 'gabardina', 'hombre', 'caballero', 'manga larga'] },
  { id: 'camisola-rosa', rango: 16, cat: 'bano', talle: 's', origen: 'eeuu', estado: 'muy-bueno', stock: 1, nombre: 'Camisola de encaje rosa', pres: 'Breteles finos · Moño al centro', precio: 6500, descuento: 0, img: 'images/p-camisola-rosa.webp', alt: 'Camisola de lencería de encaje rosa con breteles finos', gancho: 'Encaje rosa con breteles finos', desc: 'Camisola de lencería de encaje rosa, con breteles finos y un moñito al centro.', ficha: [['Talle', 'S'], ['Estado', 'Muy bueno'], ['Origen', 'Estados Unidos'], ['Tela', 'Encaje']], claves: ['camisola', 'lenceria', 'encaje', 'rosa', 'mujer'] },
  { id: 'cartera-bordo', rango: 17, cat: 'carteras', talle: 'unico', origen: 'brasil', estado: 'muy-bueno', stock: 1, nombre: 'Cartera tipo hobo bordó', pres: 'Asa al hombro · Herrajes dorados', precio: 12900, descuento: 0, img: 'images/p-cartera-bordo.webp', alt: 'Cartera grande tipo hobo color bordó con asa al hombro', gancho: 'Bordó, grande y con asa al hombro', desc: 'Cartera brasilera tipo hobo color bordó, con asa para el hombro y herrajes dorados.', ficha: [['Medida', 'Grande'], ['Estado', 'Muy bueno'], ['Origen', 'Brasil'], ['Color', 'Bordó']], claves: ['cartera', 'bolso', 'hobo', 'bordo', 'rojo', 'hombro'] },
  { id: 'conjunto-verde', rango: 18, cat: 'ninos', talle: '8', origen: 'eeuu', estado: 'excelente', stock: 1, nombre: 'Conjunto remera verde agua y short de jean', pres: 'Remera de algodón · Short con bolsillos', precio: 6200, descuento: 0, img: 'images/p-conjunto-verde.webp', alt: 'Remera verde agua de niño y short de jean celeste', gancho: 'Remera verde agua y short de jean', desc: 'Conjunto de remera verde agua de algodón y short de jean con bolsillos.', ficha: [['Talle', '8 años'], ['Estado', 'Excelente'], ['Origen', 'Estados Unidos'], ['Incluye', 'Remera y short']], claves: ['conjunto', 'remera', 'short', 'jean', 'verde', 'agua', 'nene', 'nena', 'infantil'] },
  { id: 'malla-terracota', rango: 19, cat: 'bano', talle: 's', origen: 'brasil', estado: 'excelente', stock: 1, nombre: 'Malla enteriza terracota', pres: 'Frunce al frente · Breteles anchos', precio: 7500, descuento: 0, img: 'images/p-malla-coral.webp', alt: 'Malla enteriza de mujer color terracota con frunce al frente', gancho: 'Terracota, enteriza y con frunce', desc: 'Malla enteriza brasilera color terracota, con frunce al frente y breteles anchos.', ficha: [['Talle', 'S'], ['Estado', 'Excelente'], ['Origen', 'Brasil'], ['Modelo', 'Enteriza']], claves: ['malla', 'traje de baño', 'enteriza', 'terracota', 'naranja', 'pileta', 'playa', 'mujer'] },
  { id: 'cortinas-salvia', rango: 20, cat: 'hogar', talle: null, origen: 'brasil', estado: 'muy-bueno', stock: 1, nombre: 'Par de cortinas verde salvia', pres: 'Par · Con frunce para barral', precio: 17500, descuento: 0, img: 'images/p-cortinas-salvia.webp', alt: 'Dos paños de cortina verde salvia, doblados, con el frunce para el barral', gancho: 'Verde salvia, livianas', desc: 'Par de cortinas brasileras verde salvia, de tela liviana, con frunce para colgar del barral.', ficha: [['Medida', 'Par de paños'], ['Estado', 'Muy bueno'], ['Origen', 'Brasil'], ['Color', 'Verde salvia']], claves: ['cortina', 'cortinas', 'verde', 'salvia', 'ventana', 'barral', 'hogar'] },
  { id: 'prueba-oculto', rango: 99, cat: 'damas', talle: 'm', origen: 'eeuu', estado: 'excelente', stock: 1, nombre: 'Producto oculto de prueba', pres: '—', precio: 1, descuento: 0, img: 'images/p-vestido-floral.webp', alt: '', gancho: '', desc: '', ficha: [], claves: [], visible: false },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Lo último que llegó' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const origenDe = p => nombreDe(ORIGENES, p.origen);
const talleDe = p => TALLES.find(t => t.id === p.talle) || null;
const etiquetaTalle = p => talleDe(p)?.etq || (p.cat === 'hogar' ? (p.pres.split(' · ')[0] || 'Hogar') : '');
const stockDe = p => Math.max(1, Math.min(parseInt(p?.stock, 10) || 1, TOPE_LINEA));
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.pres, p.gancho, p.desc, catDe(p.cat).nombre, catDe(p.cat).titulo, origenDe(p), ORIGENES.find(o => o.id === p.origen)?.largo, talleDe(p) ? `talle ${talleDe(p).nombre}` : '', ESTADOS[p.estado], ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const ordenes = new Map();

  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle), origen = lista(f.origen), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !talle.includes(p.talle)) return false;
    if (origen.length && !origen.includes(p.origen)) return false;
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
  KEY: 'randyoutlet_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const tope = stockDe(producto);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, tope));
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, tope);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, stockDe(getProducto(id))));
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
      const tope = stockDe(p);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, tope));
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, tope); changed = true; return; }
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
    const t = talleDe(p);
    return `• ${i.qty} × ${p.nombre}${t ? ` (${t.id === 'unico' ? 'talle único' : t.ninos ? t.nombre : `talle ${t.nombre}`})` : ''} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  return `¡Hola Randy Outlet! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}\n¿Cómo seguimos?`;
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  percha: SVG('<path d="M12 6.5a2 2 0 1 1 2 2c-1 0 -2 .6 -2 1.6v.4"/><path d="M12 10.5l8.6 5.3a1.2 1.2 0 0 1 -.6 2.2h-16a1.2 1.2 0 0 1 -.6 -2.2z"/>'),
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
  const otros = ['talle', 'origen', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="1000" height="1000"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'artículo', 'artículos')}</small></span></a></li>`;
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

const stepperHTML = (n = 1, cls = '', max = TOPE_LINEA) => `<div class="stepper${cls}" data-stepper data-max="${max}"><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = p => {
  const fin = precioFinal(p);
  if (p.descuento > 0) return `<p class="precio precio--oferta"><span class="precio__v">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__etq">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(fin)}</span></p>`;
};
const quedanDe = p => (stockDe(p) > 1 ? `Hay ${stockDe(p)}` : 'Única');
const etqHTML = p => {
  const t = talleDe(p);
  const k = t ? 'Talle' : 'Medida';
  return `<span class="etq"><span class="etq__k">${k}</span><b>${esc(etiquetaTalle(p))}</b></span>`;
};

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(28px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(18px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const unica = stockDe(p) === 1;
  return `<article class="prod${unica ? ' prod--unica' : ''}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver ficha</span></button>${etqHTML(p)}</div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(origenDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__pres">${esc(ESTADOS[p.estado] || '')} · <span class="prod__quedan">${esc(quedanDe(p))}</span></p>
    ${precioHTML(p)}
    <div class="prod-actions">${unica ? '' : stepperHTML(1, ' stepper--card', stockDe(p))}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
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
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'artículo', 'artículos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  const tope = stockDe(p);
  const t = talleDe(p);
  const cant = tope > 1
    ? `<div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>`
    : '<p class="linea__unica">Prenda única</p>';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="1000" height="1000"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${t ? `${t.ninos ? '' : 'Talle '}${esc(t.nombre)} · ` : ''}${esc(origenDe(p))}</p>
    <div class="linea__fila">
      ${cant}
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
    cuenta.textContent = n ? plural(n, 'artículo', 'artículos') : '';
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
  else if (stockDe(p) === 1) showToast(`«${p.nombre}» ya está en tu carrito: es única`);
  else showToast(`Ya tenés las ${stockDe(p)} que hay de «${p.nombre}»`);
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
const pasoStepper = paso => {
  const st = paso.closest('[data-stepper]');
  const out = st.querySelector('[data-qty]');
  const max = Math.max(1, parseInt(st.dataset.max, 10) || TOPE_LINEA);
  out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), max));
};

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-cant] [data-paso]');
    if (paso) { pasoStepper(paso); return; }
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
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3 && p.talle) rel = rel.concat(Tienda.consultar({ filtros: { talle: p.talle, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const tope = stockDe(p);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${etqHTML(p)}</figure>
    <p class="qv__nota-foto">Foto ilustrativa: si querés, te mandamos fotos reales de la prenda por WhatsApp. Precio de muestra.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}<span>${esc(origenDe(p))}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    <p class="qv__stock">${ICO.percha}<span>${tope > 1 ? `Hay ${tope} iguales` : 'Prenda única: hay una sola'} · ${esc(ESTADOS[p.estado] || '')}</span></p>
    <div class="qv__acciones">${tope > 1 ? stepperHTML(1, '', tope) : ''}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Randy Outlet! Quería consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Pedir fotos o medidas por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto"><img src="${esc(r.img)}" alt="" width="1000" height="1000"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
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
    if (paso) { pasoStepper(paso); return; }
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
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo,
    ...(talleDe(p) ? { size: talleDe(p).nombre } : {}),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), itemCondition: 'https://schema.org/UsedCondition', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'artículo', 'artículos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

const TALLES_RAPIDOS = [
  { id: '', nombre: 'Todos', talle: [] },
  { id: 's', nombre: 'S', talle: ['s'] },
  { id: 'm', nombre: 'M', talle: ['m'] },
  { id: 'l', nombre: 'L', talle: ['l'] },
  { id: 'xl', nombre: 'XL', talle: ['xl'] },
  { id: 'ninos', nombre: 'Niños', talle: TALLES.filter(t => t.ninos).map(t => t.id) },
];
const ORIGENES_RAPIDOS = [{ id: '', nombre: 'Las dos' }, ...ORIGENES.map(o => ({ id: o.id, nombre: o.id === 'eeuu' ? 'Americanas' : 'Brasileras' }))];
function initTalles() {
  const box = document.querySelector('[data-talles]');
  if (!box) return;
  const grid = box.querySelector('[data-talles-grid]');
  const vacio = box.querySelector('[data-talles-vacio]');
  const mas = box.querySelector('[data-talles-mas]');
  const cuenta = box.querySelector('[data-talles-cuenta]');
  const chipsT = box.querySelector('[data-talles-t]');
  const chipsO = box.querySelector('[data-talles-o]');
  const e = { talle: 'm', origen: '' };
  const filtros = (t = e.talle, o = e.origen) => {
    const f = {};
    const tt = TALLES_RAPIDOS.find(x => x.id === t);
    if (tt?.talle.length) f.talle = tt.talle;
    if (o) f.origen = [o];
    return f;
  };
  const chip = (grupo, it, on, n) => `<button type="button" class="talle-chip${n ? '' : ' is-cero'}" data-${grupo}="${esc(it.id)}" aria-pressed="${on}"><span>${esc(it.nombre)}</span><small>${n}</small></button>`;
  const pintar = () => {
    chipsT.innerHTML = TALLES_RAPIDOS.map(t => chip('t', t, t.id === e.talle, Tienda.contar(filtros(t.id, e.origen)))).join('');
    chipsO.innerHTML = ORIGENES_RAPIDOS.map(o => chip('o', o, o.id === e.origen, Tienda.contar(filtros(e.talle, o.id)))).join('');
    const f = filtros();
    const items = Tienda.consultar({ filtros: f, limite: 8 }).items;
    const total = Tienda.contar(f);
    grid.innerHTML = items.map(p => cardHTML(p, { anim: 'subir' })).join('');
    grid.hidden = !items.length;
    vacio.hidden = items.length > 0;
    const tt = TALLES_RAPIDOS.find(x => x.id === e.talle);
    const qs = new URLSearchParams();
    if (f.talle) qs.set('talle', f.talle.join(','));
    if (f.origen) qs.set('origen', f.origen.join(','));
    const q = qs.toString().replace(/%2C/g, ',');
    mas.href = `${CATALOGO_URL}${q ? `?${q}` : ''}`;
    const que = tt?.id === 'ninos' ? ' para niños' : tt?.id ? ` en talle ${tt.nombre}` : '';
    mas.querySelector('span').textContent = total ? `Ver ${total === 1 ? 'la prenda' : `las ${total} prendas`}${que}` : 'Ver todo el catálogo';
    cuenta.textContent = total ? `${plural(total, 'prenda', 'prendas')}${que}` : `Nada${que} por ahora`;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  box.addEventListener('click', ev => {
    const t = ev.target.closest('[data-t]');
    const o = ev.target.closest('[data-o]');
    if (t && TALLES_RAPIDOS.some(x => x.id === t.dataset.t)) { e.talle = t.dataset.t; pintar(); box.querySelector(`[data-t="${e.talle}"]`)?.focus(); }
    else if (o && ORIGENES_RAPIDOS.some(x => x.id === o.dataset.o)) { e.origen = o.dataset.o; pintar(); box.querySelector(`[data-o="${e.origen}"]`)?.focus(); }
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
  const GRUPOS = { cat: CATEGORIAS, talle: TALLES, origen: ORIGENES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    talle: valida(params.get('talle'), TALLES),
    origen: valida(params.get('origen'), ORIGENES),
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
    const soloTalles = Object.keys(GRUPOS).every(g => g === 'talle' || !e[g].length) && e.talle.length;
    const ninos = TALLES.filter(t => t.ninos).map(t => t.id);
    if (soloTalles && e.talle.length === ninos.length && e.talle.every(id => ninos.includes(id))) return 'Talles de niños';
    if (solo('talle')) { const t = TALLES.find(x => x.id === e.talle[0]); return t?.id === 'unico' ? 'Talle único' : `Talle ${t?.nombre || ''}`; }
    if (solo('origen')) return `Lo que llegó de ${ORIGENES.find(x => x.id === e.origen[0])?.largo || ''}`;
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
    document.title = `${t || 'Catálogo'} — ${MARCA}, feria americana en Clorinda`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'artículo' : 'artículos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  desdeA('.hero1__blob', { opacity: 0, scale: 0.86, transformOrigin: '50% 50%', duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__foto', { y: 40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.08);
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.franja-wsp__in', { y: 14, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.7);
  desdeA('.tag-wrap', { y: -40, rotate: -16, opacity: 0, transformOrigin: '50% 0%', duration: 1.6, ease: 'elastic.out(1, 0.45)', clearProps: 'transform,opacity' }, 0.95);
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: -18, rotate: -1.5, opacity: 0, transformOrigin: '10% 0%', duration: 1.3, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.2);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.4);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desdeA('.hero__datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.sello--hero', { scale: 0.92, rotate: -18, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.55);
  desdeA('.perchero__barral', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.2, ease: 'power3.inOut', clearProps: 'transform' }, 0.35);
  desdeA('.perchero__head', { y: 12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.5);
  desdeA('.percha-item', { y: -36, rotate: -9, opacity: 0, transformOrigin: '50% 0%', duration: 1.5, stagger: 0.07, ease: 'elastic.out(1, 0.5)', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initPrecios, initRail, initTalles, initCategoriasCuenta, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
