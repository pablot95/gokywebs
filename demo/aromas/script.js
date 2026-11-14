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

const WSP = '5493875315332';
const MARCA = 'Aromas';
const CATEGORIAS = [
  { id: 'esteticos', nombre: 'Estéticos y exfoliantes', corto: 'Estéticos', titulo: 'Jabones estéticos y exfoliantes', bajada: 'Avena y miel, café, chía y esponja natural', img: 'images/p-avena-miel.webp' },
  { id: 'especiales', nombre: 'Especiales para tu piel', corto: 'Especiales', titulo: 'Jabones especiales para tu piel', bajada: 'Carbón, arcilla verde, arroz, miel y caña, menta y romero, íntimo', img: 'images/p-carbon.webp' },
  { id: 'masajeadores', nombre: 'Masajeadores', corto: 'Masajeadores', titulo: 'Jabones masajeadores', bajada: 'Ocho variedades, 100% naturales', img: 'images/p-mas-manzanilla.webp' },
  { id: 'regalar', nombre: 'Aromáticos y souvenirs', corto: 'Para regalar', titulo: 'Aromáticos y souvenirs', bajada: 'Jabones aromáticos y margaritas para souvenirs', img: 'images/p-margaritas.webp' },
];
const JABONES = ['esteticos', 'especiales', 'masajeadores'];
const PARA = [
  { id: 'grasa', nombre: 'Piel grasa', titulo: 'Jabones para piel grasa' },
  { id: 'acne', nombre: 'Piel con acné', titulo: 'Jabones para piel con acné' },
  { id: 'luminosidad', nombre: 'Suavidad y luminosidad', titulo: 'Jabones para suavidad y luminosidad' },
  { id: 'nutricion', nombre: 'Nutrir la piel', titulo: 'Jabones nutritivos' },
  { id: 'refrescar', nombre: 'Refrescar', titulo: 'Jabones refrescantes' },
  { id: 'exfoliar', nombre: 'Exfoliar', titulo: 'Jabones exfoliantes' },
  { id: 'masajes', nombre: 'Masajes', titulo: 'Jabones para masajes' },
  { id: 'intima', nombre: 'Higiene íntima', titulo: 'Jabón íntimo' },
  { id: 'regalar', nombre: 'Para regalar', titulo: 'Para regalar' },
];
const PRECIOS = [
  { id: 'hasta5', nombre: 'Hasta $5.000', min: 0, max: 5000 },
  { id: '5a6', nombre: '$5.000 a $6.000', min: 5000, max: 6000 },
  { id: 'mas6', nombre: 'Más de $6.000', min: 6000, max: null },
];
const MAS = (id, rango, nom, de, precio, img, alt, gancho) => ({
  id, rango, cat: 'masajeadores', para: ['masajes'], sello: '100% natural', nombre: `Masajeador de ${nom}`, pres: 'Con relieve para masajear', precio, descuento: 0, img, alt,
  gancho, desc: `Jabón masajeador 100% natural ${de}, con relieve para masajear la piel mientras te bañás.`,
  ficha: [['Línea', 'Masajeadores'], ['Ingredientes', nom.charAt(0).toUpperCase() + nom.slice(1)], ['Natural', '100%'], ['Forma', 'Con relieve']],
  claves: ['masajeador', 'masajes', 'masaje', 'natural', ...nom.split(/\s+y\s+|\s+con\s+|\s+/)],
});
const PRODUCTOS = [
  { id: 'aromatico-flores', rango: 1, cat: 'regalar', para: ['regalar'], sello: 'Para regalar', nombre: 'Jabón aromático con flores secas', pres: 'Fragancia a elección', precio: 4500, descuento: 0, img: 'images/p-aromatico-flores.webp', alt: 'Tres jabones artesanales color crema con pétalos secos de caléndula, apilados sobre una tela rosa', gancho: 'Con pétalos secos, para vos o para regalar', desc: 'Jabón aromático artesanal con pétalos de flores secas, para todo tipo de piel. Hay variedad de fragancias y modelos: contanos cuál te gusta por WhatsApp.', ficha: [['Línea', 'Aromáticos'], ['Piel', 'Todo tipo de piel'], ['Fragancia', 'A elección'], ['Ideal', 'Para regalar']], claves: ['aromatico', 'aroma', 'flores', 'calendula', 'petalos', 'regalo', 'fragancia', 'perfumado'] },
  { id: 'carbon', rango: 2, cat: 'especiales', para: ['grasa'], sello: 'Piel grasa', nombre: 'Jabón de carbón activado', pres: 'Especial para piel grasa', precio: 5800, descuento: 0, img: 'images/p-carbon.webp', alt: 'Jabón artesanal negro de carbón activado sobre fondo claro con una tela rosa', gancho: 'El negro de la línea especial, para piel grasa', desc: 'Jabón especial de carbón activado, pensado para la piel grasa. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Para', 'Piel grasa'], ['Ingrediente', 'Carbón activado'], ['Hecho', 'A mano']], claves: ['carbon', 'activado', 'negro', 'grasa', 'piel grasa', 'especial'] },
  MAS('mas-manzanilla', 3, 'manzanilla', 'de manzanilla', 6500, 'images/p-mas-manzanilla.webp', 'Jabón masajeador amarillo claro con relieve de burbujas y flores de manzanilla al lado', 'Amarillo suave, con flores de manzanilla'),
  { id: 'avena-miel', rango: 4, cat: 'esteticos', para: ['exfoliar', 'nutricion'], sello: 'Exfoliante', nombre: 'Jabón de avena y miel', pres: 'Estético y exfoliante', precio: 5200, descuento: 0, img: 'images/p-avena-miel.webp', alt: 'Jabón artesanal beige con copos de avena arriba, junto a un frasco de miel', gancho: 'Avena que exfolia y miel para la piel', desc: 'Jabón estético de avena y miel, para el cuidado de la piel y el cuerpo. La avena le da el toque exfoliante.', ficha: [['Línea', 'Estéticos'], ['Uso', 'Exfoliante'], ['Ingredientes', 'Avena y miel'], ['Para', 'Piel y cuerpo']], claves: ['avena', 'miel', 'exfoliante', 'estetico', 'cuerpo'] },
  { id: 'margaritas', rango: 5, cat: 'regalar', para: ['regalar'], sello: 'Souvenir', max: 60, nombre: 'Margaritas aromáticas en tul', pres: 'Por unidad · Bolsita de tul con cinta', precio: 1900, descuento: 0, img: 'images/p-margaritas.webp', alt: 'Jabones aromáticos con forma de margarita, envueltos en bolsitas de tul blanco atadas con cinta lila', gancho: 'Souvenir para cumpleaños y recuerdos', desc: 'Margaritas de jabón aromático envueltas en tul con cinta, para cumpleaños, souvenirs y recuerdos. Por cantidad hay precios especiales: consultanos y te pasamos el precio.', ficha: [['Línea', 'Souvenirs'], ['Presentación', 'Bolsita de tul con cinta'], ['Para', 'Cumpleaños y recuerdos'], ['Por cantidad', 'Precio especial']], claves: ['margarita', 'margaritas', 'souvenir', 'souvenirs', 'cumpleanos', 'recuerdo', 'evento', 'tul', 'flor', 'regalo'] },
  { id: 'arcilla', rango: 6, cat: 'especiales', para: ['acne'], sello: 'Piel con acné', nombre: 'Jabón de arcilla verde', pres: 'Especial para piel con acné', precio: 5800, descuento: 0, img: 'images/p-arcilla.webp', alt: 'Jabón artesanal verde de arcilla sobre fondo claro con una tela rosa', gancho: 'Arcilla verde, pensado para la piel con acné', desc: 'Jabón especial de arcilla verde, pensado para la piel con acné. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Para', 'Piel con acné'], ['Ingrediente', 'Arcilla verde'], ['Hecho', 'A mano']], claves: ['arcilla', 'verde', 'acne', 'granos', 'especial'] },
  MAS('mas-curcuma', 7, 'cúrcuma', 'de cúrcuma', 6500, 'images/p-mas-curcuma.webp', 'Jabón masajeador naranja de cúrcuma con relieve de burbujas', 'Naranja intenso, de cúrcuma'),
  { id: 'cafe-canela', rango: 8, cat: 'esteticos', para: ['exfoliar'], sello: 'Exfoliante', nombre: 'Jabón exfoliante de café', pres: 'Estético y exfoliante', precio: 5200, descuento: 0, img: 'images/p-cafe-canela.webp', alt: 'Jabón artesanal marrón de café con granos de café y una rama de canela al lado', gancho: 'Café molido que exfolia', desc: 'Jabón estético exfoliante de café, para el cuidado de la piel y el cuerpo.', ficha: [['Línea', 'Estéticos'], ['Uso', 'Exfoliante'], ['Ingrediente', 'Café'], ['Para', 'Piel y cuerpo']], claves: ['cafe', 'canela', 'exfoliante', 'estetico', 'cuerpo', 'marron'] },
  { id: 'arroz', rango: 9, cat: 'especiales', para: ['luminosidad'], sello: 'Luminosidad', nombre: 'Jabón de arroz', pres: 'Especial para suavidad y luminosidad', precio: 5800, descuento: 0, img: 'images/p-arroz.webp', alt: 'Jabón artesanal claro con granos de arroz y un hilo de miel arriba', gancho: 'Para una piel suave y luminosa', desc: 'Jabón especial de arroz, para darle suavidad y luminosidad a la piel. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Para', 'Suavidad y luminosidad'], ['Ingrediente', 'Arroz'], ['Hecho', 'A mano']], claves: ['arroz', 'luminosidad', 'suavidad', 'suave', 'luminosa', 'especial'] },
  MAS('mas-colageno', 10, 'colágeno hidrolizado', 'de colágeno hidrolizado', 6900, 'images/p-mas-colageno.webp', 'Jabón masajeador rosado con relieve de burbujas y florcitas al lado', 'Rosado, con colágeno hidrolizado'),
  { id: 'menta-romero', rango: 11, cat: 'especiales', para: ['refrescar'], sello: 'Refrescante', nombre: 'Jabón de menta y romero', pres: 'Especial refrescante', precio: 5600, descuento: 0, img: 'images/p-menta-romero.webp', alt: 'Jabón artesanal verde menta sobre fondo claro con una tela rosa', gancho: 'Refrescante, para los días de calor', desc: 'Jabón especial de menta y romero, refrescante. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Efecto', 'Refrescante'], ['Ingredientes', 'Menta y romero'], ['Hecho', 'A mano']], claves: ['menta', 'romero', 'refrescante', 'fresco', 'verde', 'especial'] },
  { id: 'chia', rango: 12, cat: 'esteticos', para: ['exfoliar'], sello: 'Exfoliante', nombre: 'Jabón exfoliante de chía', pres: 'Estético y exfoliante', precio: 5200, descuento: 0, img: 'images/p-chia.webp', alt: 'Jabón artesanal claro con semillas de chía, junto a un frasco de miel y copos de avena', gancho: 'Semillas de chía para exfoliar', desc: 'Jabón estético exfoliante de chía, para el cuidado de la piel y el cuerpo.', ficha: [['Línea', 'Estéticos'], ['Uso', 'Exfoliante'], ['Ingrediente', 'Chía'], ['Para', 'Piel y cuerpo']], claves: ['chia', 'semillas', 'exfoliante', 'estetico', 'cuerpo'] },
  MAS('mas-canela-miel', 13, 'canela y miel', 'de canela y miel', 6500, 'images/p-mas-canela-miel.webp', 'Jabón masajeador color canela con relieve de burbujas', 'Color canela, con miel'),
  { id: 'miel-cana', rango: 14, cat: 'especiales', para: ['nutricion'], sello: 'Nutritivo', nombre: 'Jabón de miel y caña', pres: 'Especial nutritivo', precio: 5600, descuento: 0, img: 'images/p-miel-cana.webp', alt: 'Jabón artesanal color caramelo con copos arriba, junto a un frasco de miel', gancho: 'Nutritivo, color caramelo', desc: 'Jabón especial de miel y caña, nutritivo para la piel. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Efecto', 'Nutritivo'], ['Ingredientes', 'Miel y caña'], ['Hecho', 'A mano']], claves: ['miel', 'cana', 'azucar', 'nutritivo', 'nutrir', 'especial'] },
  { id: 'intimo', rango: 15, cat: 'especiales', para: ['intima'], sello: 'Íntimo', nombre: 'Jabón íntimo para hombres y mujeres', pres: 'Especial para higiene íntima', precio: 5900, descuento: 0, img: 'images/p-intimo.webp', alt: 'Jabón artesanal rosa claro sobre fondo blanco con una tela rosa', gancho: 'Para hombres y para mujeres', desc: 'Jabón especial íntimo, para hombres y mujeres. Hecho a mano en Salta.', ficha: [['Línea', 'Especiales'], ['Uso', 'Higiene íntima'], ['Para', 'Hombres y mujeres'], ['Hecho', 'A mano']], claves: ['intimo', 'intima', 'higiene', 'hombre', 'mujer', 'especial'] },
  MAS('mas-avena-miel', 16, 'avena con miel', 'de avena con miel', 6500, 'images/p-mas-avena-miel.webp', 'Jabón masajeador color miel con relieve de burbujas y flores al lado', 'Color miel, con avena'),
  { id: 'esponja', rango: 17, cat: 'esteticos', para: ['exfoliar'], sello: 'Exfoliante', nombre: 'Jabón con esponja natural', pres: 'Estético y exfoliante', precio: 5600, descuento: 0, img: 'images/p-esponja.webp', alt: 'Jabón artesanal dorado con fibras naturales arriba, sobre fondo claro', gancho: 'Jabón y esponja en una sola pieza', desc: 'Jabón estético con esponja natural, para exfoliar la piel y el cuerpo.', ficha: [['Línea', 'Estéticos'], ['Uso', 'Exfoliante'], ['Con', 'Esponja natural'], ['Para', 'Piel y cuerpo']], claves: ['esponja', 'natural', 'luffa', 'exfoliante', 'estetico', 'cuerpo'] },
  MAS('mas-sabila', 18, 'sábila con miel', 'de sábila con miel', 6500, 'images/p-mas-sabila.webp', 'Jabón masajeador verde muy claro con relieve de burbujas y flores al lado', 'Verde muy claro, de sábila'),
  MAS('mas-cafe-canela', 19, 'café con canela', 'de café con canela', 6500, 'images/p-mas-cafe-canela.webp', 'Jabón masajeador marrón oscuro de café con relieve de burbujas', 'Marrón oscuro, de café'),
  MAS('mas-arroz-miel', 20, 'arroz con miel', 'de arroz con miel', 6500, 'images/p-mas-arroz-miel.webp', 'Jabón masajeador color crema con relieve de burbujas y flores al lado', 'Color crema, de arroz'),
  { id: 'prueba-oculto', rango: 99, cat: 'esteticos', para: ['exfoliar'], sello: '', nombre: 'Producto oculto de prueba', pres: '—', precio: 1, descuento: 0, img: 'images/p-avena-miel.webp', alt: '', gancho: '', desc: '', ficha: [], claves: [], visible: false },
];
const GUIA = [
  { id: 'grasa', t: 'Piel grasa', frase: 'El de carbón activado es el de la línea especial para piel grasa.', ids: ['carbon'], color: '#3B3B3D', tinta: '#fff' },
  { id: 'acne', t: 'Acné', frase: 'El de arcilla verde es el que hacemos para la piel con acné.', ids: ['arcilla'], color: '#A9B98F', tinta: '#2F3A24' },
  { id: 'luminosidad', t: 'Luminosidad', frase: 'El de arroz es para darle suavidad y luminosidad a la piel.', ids: ['arroz'], color: '#F3E6CC', tinta: '#5A4524' },
  { id: 'nutricion', t: 'Nutrir', frase: 'Miel y caña es el nutritivo. La avena con miel también cuida la piel.', ids: ['miel-cana', 'avena-miel'], color: '#C98F4E', tinta: '#fff' },
  { id: 'refrescar', t: 'Refrescar', frase: 'Menta y romero es el refrescante, ideal para el calor de Salta.', ids: ['menta-romero'], color: '#BFDCCB', tinta: '#24453A' },
  { id: 'exfoliar', t: 'Exfoliar', frase: 'Los estéticos exfolian: avena y miel, café, chía o esponja natural.', ids: ['cafe-canela', 'avena-miel', 'chia', 'esponja'], color: '#E9D3B4', tinta: '#5A4524' },
  { id: 'masajes', t: 'Masajes', frase: 'Los masajeadores son 100% naturales y tienen relieve para masajear.', ids: ['mas-manzanilla', 'mas-colageno', 'mas-curcuma', 'mas-sabila'], color: '#F2DC7E', tinta: '#4F4316' },
  { id: 'regalar', t: 'Regalar', frase: 'Los aromáticos con flores y las margaritas en tul están pensados para regalar.', ids: ['aromatico-flores', 'margaritas'], color: '#F8D7E3', tinta: '#7A2F47' },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Recomendados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const paraDe = p => (p.para || []).map(id => PARA.find(x => x.id === id)).filter(Boolean);
const maxDe = p => Math.max(1, Math.min(parseInt(p?.max, 10) || TOPE_LINEA, 100));
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.pres, p.gancho, p.desc, p.sello, catDe(p.cat).nombre, catDe(p.cat).titulo, ...paraDe(p).map(x => x.nombre), ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const ordenes = new Map();

  function coincide(p, f) {
    const cat = lista(f.cat), para = lista(f.para), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (para.length && !para.some(id => (p.para || []).includes(id))) return false;
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
  KEY: 'aromas_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const tope = maxDe(producto);
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
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, maxDe(getProducto(id))));
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
      const tope = maxDe(p);
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
  let souvenirs = 0;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    if (p.cat === 'regalar' && p.max > TOPE_LINEA) souvenirs += i.qty;
    return `• ${i.qty} × ${p.nombre} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  const extra = souvenirs >= 10 ? `\nLas ${souvenirs} margaritas son para souvenirs: ¿me pasan el precio especial por cantidad?` : '';
  return `¡Hola Aromas! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}${extra}\n¿Cómo seguimos?`;
}

function estadoHorario(ahora = new Date()) {
  const ar = new Date(ahora.getTime() - 3 * 3600 * 1000);
  const min = ar.getUTCHours() * 60 + ar.getUTCMinutes();
  if (min >= 9 * 60 && min < 20 * 60) return { abierto: true, texto: 'Atendiendo ahora, hasta las 20 h' };
  if (min < 9 * 60) return { abierto: false, texto: 'Ahora cerrado, abrimos a las 9 h' };
  return { abierto: false, texto: 'Ahora cerrado, mañana desde las 9 h' };
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  hoja: SVG('<path d="M5 21c.5 -4.5 2.5 -8 7 -10"/><path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z"/>'),
  regalo: SVG('<path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z"/><path d="M12 8l0 13"/><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"/>'),
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
  const otros = ['para', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="1000" height="1000"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')}</small></span></a></li>`;
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
const porUnidad = p => maxDe(p) > TOPE_LINEA;
const precioHTML = p => {
  const fin = precioFinal(p);
  const cu = porUnidad(p) ? '<span class="precio__cu">c/u</span>' : '';
  if (p.descuento > 0) return `<p class="precio precio--oferta"><span class="precio__v">${formatearPrecio(fin)}</span>${cu}<s>${formatearPrecio(p.precio)}</s><span class="precio__etq">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(fin)}</span>${cu}</p>`;
};
const selloHTML = p => (p.sello ? `<span class="sticker sticker--${esc(p.cat)}" aria-hidden="true"><span>${esc(p.sello)}</span></span>` : '');

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(36px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver ficha</span></button>${selloHTML(p)}</div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(catDe(p.cat).corto)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
    <div class="prod-actions">${stepperHTML(1, ' stepper--card', maxDe(p))}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
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
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  const tope = maxDe(p);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="1000" height="1000"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(catDe(p.cat).corto)}${porUnidad(p) ? ` · ${formatearPrecio(precioFinal(p))} c/u` : ''}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
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
  const nota = drawer.querySelector('[data-drawer-souvenir]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
    if (nota) nota.hidden = !items.some(i => { const p = getProducto(i.id); return p && porUnidad(p) && i.qty >= 10; });
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
  else if (porUnidad(p)) showToast(`Para más de ${maxDe(p)} ${p.nombre.split(' ')[0].toLowerCase()}, escribinos: hay precio por cantidad`);
  else showToast(`Ya tenés ${maxDe(p)} de «${p.nombre}»: para más, escribinos`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = el => {
  const cont = el.closest('[data-cant]');
  const st = cont?.querySelector('[data-stepper]');
  const out = st?.querySelector('[data-qty]');
  const max = Math.max(1, parseInt(st?.dataset.max, 10) || TOPE_LINEA);
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, max));
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
  let rel = Tienda.consultar({ filtros: { para: p.para, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
const MSG_CANTIDAD = '¡Hola Aromas! Quiero margaritas aromáticas para souvenirs. ¿Me pasan el precio por cantidad? Serían para (evento, cantidad y fecha):';
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${selloHTML(p)}</figure>
    <p class="qv__nota-foto">Foto ilustrativa y precio de muestra: en la web real van tus fotos y tus precios.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    <ul class="qv__para" aria-label="Para qué es">${paraDe(p).map(x => `<li><a href="${CATALOGO_URL}?para=${esc(x.id)}">${esc(x.nombre)}</a></li>`).join('')}</ul>
    <div class="qv__acciones">${stepperHTML(1, '', maxDe(p))}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    ${porUnidad(p) ? `<p class="qv__cantidad">${ICO.regalo}<span>Por cantidad hay precio especial. <a href="${esc(wspHref(MSG_CANTIDAD))}" target="_blank" rel="noopener">Pedir el precio por WhatsApp</a></span></p>` : ''}
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Aromas! Quería consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
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
      const n = Cart.add(p, cantDe(cont.querySelector('[data-cant] [data-stepper]')));
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
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), itemCondition: 'https://schema.org/NewCondition', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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
    el.textContent = plural(Tienda.contar({ cat: el.dataset.catN.split(',') }), 'producto', 'productos');
  });
  document.querySelectorAll('[data-cat-num]').forEach(el => { el.textContent = String(Tienda.contar({ cat: el.dataset.catNum.split(',') })); });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

function initGrilla() {
  const box = document.querySelector('[data-grilla]');
  if (!box) return;
  const grid = box.querySelector('[data-grilla-grid]');
  const tabs = box.querySelector('[data-grilla-tabs]');
  const mas = box.querySelector('[data-grilla-mas]');
  const OPS = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.corto }))];
  let actual = '';
  const pintar = () => {
    const f = actual ? { cat: [actual] } : {};
    const total = Tienda.contar(f);
    tabs.innerHTML = OPS.map(o => `<button type="button" class="tab-linea" data-tab="${esc(o.id)}" aria-pressed="${o.id === actual}"><span>${esc(o.nombre)}</span><small>${Tienda.contar(o.id ? { cat: [o.id] } : {})}</small></button>`).join('');
    grid.innerHTML = Tienda.consultar({ filtros: f, limite: 8 }).items.map(p => cardHTML(p, { anim: 'subir' })).join('');
    mas.href = `${CATALOGO_URL}${actual ? `?cat=${actual}` : ''}`;
    mas.querySelector('span').textContent = actual ? `Ver ${total === 1 ? 'el producto' : `los ${total}`} ${catDe(actual).id === 'regalar' ? 'para regalar' : catDe(actual).corto.toLowerCase()}` : `Ver los ${total} productos`;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.addEventListener('click', ev => {
    const t = ev.target.closest('[data-tab]');
    if (!t || !OPS.some(o => o.id === t.dataset.tab)) return;
    actual = t.dataset.tab;
    pintar();
    tabs.querySelector(`[data-tab="${actual}"]`)?.focus();
  });
  pintar();
}

function initGuia() {
  const box = document.querySelector('[data-guia]');
  if (!box) return;
  const ops = box.querySelector('[data-guia-ops]');
  const panel = box.querySelector('[data-guia-panel]');
  let actual = GUIA[0].id;
  ops.innerHTML = GUIA.map(g => `<li><button type="button" class="guia-op" data-guia-op="${g.id}" aria-pressed="${g.id === actual}" style="--op:${g.color};--op-t:${g.tinta}"><span class="guia-op__pastilla" aria-hidden="true"></span><span class="guia-op__t">${esc(g.t)}</span></button></li>`).join('');
  const pintar = () => {
    const g = GUIA.find(x => x.id === actual) || GUIA[0];
    const prods = g.ids.map(getProducto).filter(Boolean);
    const p = prods[0];
    if (!p) return;
    const otros = prods.slice(1);
    const para = PARA.find(x => x.id === g.id);
    const n = Tienda.contar({ para: [g.id] });
    panel.innerHTML = `<div class="guia-res" data-cant>
      <button type="button" class="guia-res__foto" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${selloHTML(p)}</button>
      <div class="guia-res__txt">
        <p class="guia-res__k">Para ${esc((para?.nombre || g.t).toLowerCase())}</p>
        <h3 class="guia-res__n"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
        <p class="guia-res__frase">${esc(g.frase)}</p>
        ${precioHTML(p)}
        <div class="prod-actions">${stepperHTML(1, ' stepper--card', maxDe(p))}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
        <a class="link-flecha" href="${CATALOGO_URL}?para=${esc(g.id)}"><span>${n > 1 ? `Ver los ${n} para ${esc((para?.nombre || g.t).toLowerCase())}` : 'Verlo en el catálogo'}</span> ${ICO.flecha}</a>
      </div>
      ${otros.length ? `<div class="guia-res__otros"><p class="guia-res__ok">También sirve</p><ul>${otros.map(o => `<li><button type="button" data-qv="${esc(o.id)}"><span class="guia-res__mini"><img src="${esc(o.img)}" alt="" width="1000" height="1000"></span><span><b>${esc(o.nombre)}</b><small>${formatearPrecio(precioFinal(o))}${porUnidad(o) ? ' c/u' : ''}</small></span></button></li>`).join('')}</ul></div>` : `<div class="guia-res__otros guia-res__duda"><p class="guia-res__ok">¿Dudás?</p><p>Contanos cómo es tu piel y te decimos cuál te conviene.</p><a class="btn btn--wsp btn--sm" href="${esc(wspHref('¡Hola Aromas! Quiero que me ayuden a elegir un jabón para mi tipo de piel:'))}" target="_blank" rel="noopener">${ICO.wsp}Preguntar</a></div>`}
    </div>`;
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  ops.addEventListener('click', ev => {
    const b = ev.target.closest('[data-guia-op]');
    if (!b || !GUIA.some(g => g.id === b.dataset.guiaOp)) return;
    actual = b.dataset.guiaOp;
    ops.querySelectorAll('[data-guia-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    panel.classList.remove('is-cambio'); void panel.offsetWidth; panel.classList.add('is-cambio');
    pintar();
  });
  pintar();
}

function initHorario() {
  const pintar = () => {
    const e = estadoHorario();
    document.querySelectorAll('[data-horario]').forEach(el => {
      el.textContent = e.texto;
      el.closest('[data-horario-box]')?.classList.toggle('is-abierto', e.abierto);
    });
  };
  pintar();
  setInterval(pintar, 60000);
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
  const GRUPOS = { cat: CATEGORIAS, para: PARA, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    para: valida(params.get('para'), PARA),
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
    const soloCat = Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length);
    if (soloCat && e.cat.length === JABONES.length && JABONES.every(id => e.cat.includes(id))) return 'Jabones artesanales';
    if (solo('para')) return PARA.find(x => x.id === e.para[0])?.titulo || '';
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
    document.title = `${t || 'Catálogo'} — ${MARCA}, jabones artesanales en Salta`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 26, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.2);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.38);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.52);
  desdeA('.hero__datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72);
  desdeA('.sello--hero', { scale: 0.92, rotate: -28, opacity: 0, duration: 1.3, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.45);
  desdeA('.ficha-wrap', { y: 18, scale: 0.92, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.8);
  desdeA('.tira__item', { y: 36, duration: 1.2, stagger: 0.08, clearProps: 'transform' }, 0.3);
  desdeA('.tira__item img', { scale: 1.1, duration: 1.8, stagger: 0.08, clearProps: 'transform' }, 0.3);
  desdeA('.tira__etq', { y: 10, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.8);
  desdeA('.sello--tira', { scale: 0.92, rotate: 24, opacity: 0, duration: 1.3, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.62);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initPrecios, initHorario, initRail, initGrilla, initGuia, initCategoriasCuenta, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
