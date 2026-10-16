const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491139002441';
const POR_PAGINA = 16;
const TOPE_CONSULTA = 100;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
const MARCA = 'Química Productos del Plata';

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
  { id: 'multiuso', nombre: 'Limpiadores multiuso', bajada: 'Pisos, vidrios y superficies', img: 'images/cat-multiuso.webp',
    texto: 'Limpiadores con gatillo, de pisos y desinfectantes, en envase chico, familiar o bidón de 5 litros.' },
  { id: 'ropa-vajilla', nombre: 'Detergentes y lavavajillas', bajada: 'Ropa y vajilla', img: 'images/cat-ropa-vajilla.webp',
    texto: 'Lavavajillas, detergentes y jabones líquidos para ropa, suavizante y quitamanchas.' },
  { id: 'desengrasantes', nombre: 'Desengrasantes', bajada: 'Cocina e industria', img: 'images/cat-desengrasantes.webp',
    texto: 'Desengrasantes con gatillo y en bidón, y limpiador para hornos y parrillas.' },
  { id: 'mayoristas', nombre: 'Formatos mayoristas', bajada: 'Bidones, packs y granel', img: 'images/cat-mayoristas.webp',
    texto: 'Bidones de 5 litros, packs cerrados y formatos a granel para comercios, consorcios e industria.' },
  { id: 'higiene', nombre: 'Higiene y accesorios', bajada: 'Baño, manos y complementos', img: 'images/cat-higiene.webp',
    texto: 'Jabón líquido para manos, gel para inodoros, toallitas y cepillos.' },
  { id: 'combos', nombre: 'Combos', bajada: 'Kits armados con ahorro', img: 'images/cat-combos.webp',
    texto: 'Kits armados para la cocina, el lavadero, la casa y el comercio, con el ahorro a la vista.' },
];
const FORMATOS = [
  { id: 'chico', nombre: 'Envase chico (hasta 1 L)' },
  { id: 'familiar', nombre: 'Familiar (2 a 3 L)' },
  { id: 'bidon', nombre: 'Bidón de 5 L' },
  { id: 'pack', nombre: 'Pack cerrado' },
  { id: 'granel', nombre: 'Granel e industria' },
  { id: 'kit', nombre: 'Combo armado' },
];
const PRECIOS = [
  { id: 'hasta1500', nombre: 'Hasta $1.500', min: null, max: 1500 },
  { id: '1500a5000', nombre: '$1.500 a $5.000', min: 1501, max: 5000 },
  { id: 'mas5000', nombre: 'Más de $5.000', min: 5001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const OPCIONES = {
  fragancia: { nombre: 'Fragancia', verbo: 'Elegir fragancia', valores: ['Lavanda', 'Limón', 'Marina'] },
};
const E = {
  banner: 'images/hero-fabrica.webp', estante: 'images/estanteria.webp', hogar: 'images/combo-limpieza.webp',
  ropa: 'images/cuidado-ropa.webp', cocina: 'images/cocina-bano.webp', mayor: 'images/mayoristas.webp',
};
const ETIQUETAS_CAT = {
  multiuso: 'limpiador limpiadores multiuso pisos vidrios superficies desinfectante',
  'ropa-vajilla': 'detergente detergentes lavavajillas vajilla ropa lavado lavarropas',
  desengrasantes: 'desengrasante grasa cocina industria horno parrilla',
  mayoristas: 'mayorista mayoristas bidon bidones pack granel industria comercio',
  higiene: 'higiene accesorios baño manos jabon',
  combos: 'combo combos kit kits ahorro oferta',
};

const PRODUCTOS = [
  { id: 'multiuso-500', nombre: 'Limpiador multiuso con gatillo', pres: '500 ml', cat: 'multiuso', formato: 'chico', precio: 1250, may: [12, 990], stock: 120, rango: 1, op: 'fragancia',
    img: 'images/p-multiuso-500.webp', escena: E.hogar, alt: 'Limpiador multiuso celeste en botella con gatillo',
    desc: 'Limpia mesadas, azulejos, muebles y superficies lavables sin dejar velo. Se usa directo con el gatillo y se repasa con un paño húmedo.' },
  { id: 'limpiavidrios-500', nombre: 'Limpiavidrios con gatillo', pres: '500 ml', cat: 'multiuso', formato: 'chico', precio: 1190, may: [12, 950], stock: 90,
    img: 'images/p-limpiavidrios-500.webp', escena: E.banner, alt: 'Limpiavidrios celeste en botella con gatillo',
    desc: 'Para vidrios, espejos y mamparas: se aplica, se pasa un paño seco y queda sin marcas.' },
  { id: 'multiuso-5l', nombre: 'Limpiador multiuso', pres: 'Bidón 5 L', cat: 'multiuso', formato: 'bidon', precio: 4800, may: [4, 3950], stock: 60, rango: 3, op: 'fragancia',
    img: 'images/p-multiuso-5l.webp', escena: E.banner, alt: 'Bidón de 5 litros de limpiador multiuso celeste',
    desc: 'El mismo limpiador multiuso en bidón de 5 litros, para recargar el envase con gatillo o para limpiezas grandes en casas, consorcios y comercios.' },
  { id: 'pisos-3l', nombre: 'Limpiador de pisos', pres: '3 L', cat: 'multiuso', formato: 'familiar', precio: 2900, may: [6, 2350], stock: 70, rango: 9, op: 'fragancia',
    img: 'images/p-pisos-3l.webp', escena: E.cocina, alt: 'Botella azul de 3 litros de limpiador de pisos con manija',
    desc: 'Para cerámicos, porcelanatos y mosaicos. Se diluye en el balde y deja el ambiente perfumado.' },
  { id: 'desinfectante-3l', nombre: 'Limpiador desinfectante', pres: '3 L', cat: 'multiuso', formato: 'familiar', precio: 3100, may: [6, 2550], stock: 50,
    img: 'images/p-desinfectante-3l.webp', escena: E.banner, alt: 'Botella azul de 3 litros de limpiador desinfectante',
    desc: 'Para baños, cocinas y superficies de mucho tránsito. Se usa diluido en el balde o puro sobre las manchas difíciles.' },

  { id: 'lavavajillas-500', nombre: 'Lavavajillas líquido', pres: '500 ml', cat: 'ropa-vajilla', formato: 'chico', precio: 1290, may: [12, 1020], stock: 150, rango: 2,
    img: 'images/p-lavavajillas-500.webp', escena: E.banner, alt: 'Botella de lavavajillas líquido color ámbar',
    desc: 'Gran poder desengrasante para platos, ollas y cubiertos. Rinde porque con poco producto hace mucha espuma.' },
  { id: 'lavavajillas-limon', nombre: 'Lavavajillas concentrado limón', pres: '750 ml', cat: 'ropa-vajilla', formato: 'chico', precio: 1690, descuento: 15, may: [12, 1250], stock: 80,
    img: 'images/p-lavavajillas-limon.webp', escena: E.cocina, alt: 'Botella azul de lavavajillas concentrado con tapa de pico',
    desc: 'Versión concentrada con aroma a limón para la cocina de todos los días. Tapa de pico para dosificar.' },
  { id: 'detergente-ropa-3l', nombre: 'Detergente líquido para ropa', pres: '3 L', cat: 'ropa-vajilla', formato: 'familiar', precio: 3900, may: [6, 3250], stock: 60, rango: 7,
    img: 'images/p-detergente-ropa-3l.webp', escena: E.ropa, alt: 'Bidón azul de 3 litros de detergente líquido para ropa',
    desc: 'Para lavarropas de carga frontal o superior y para lavar a mano. Se disuelve rápido, aun en agua fría.' },
  { id: 'doypack-3l', nombre: 'Detergente líquido doypack', pres: 'Doypack 3 L', cat: 'ropa-vajilla', formato: 'familiar', precio: 3400, may: [6, 2850], stock: 70, rango: 5,
    img: 'images/p-doypack-3l.webp', escena: E.ropa, alt: 'Doypack azul y dorado de detergente líquido de 3 litros',
    desc: 'Repuesto en doypack con pico vertedor: rellenás tu bidón y ahorrás envase. Alto rendimiento.' },
  { id: 'suavizante-2l', nombre: 'Suavizante para ropa', pres: '2 L', cat: 'ropa-vajilla', formato: 'familiar', precio: 2950, may: [6, 2450], stock: 65, rango: 4,
    img: 'images/p-suavizante-2l.webp', escena: E.ropa, alt: 'Botella blanca de suavizante para ropa con tapa dorada',
    desc: 'Deja la ropa suave, fácil de planchar y con una fragancia intensa y duradera. Se agrega en el último enjuague.' },
  { id: 'jabon-ropa-3l', nombre: 'Jabón líquido para ropa', pres: '3 L', cat: 'ropa-vajilla', formato: 'familiar', precio: 3600, may: [6, 2990], stock: 55,
    img: 'images/p-jabon-ropa-3l.webp', escena: E.hogar, alt: 'Botella ámbar de 3 litros de jabón líquido para ropa',
    desc: 'Jabón líquido para ropa blanca y de color, para el lavado diario en lavarropas.' },
  { id: 'quitamanchas-500', nombre: 'Quitamanchas prelavado', pres: '500 ml', cat: 'ropa-vajilla', formato: 'chico', precio: 1450, may: [12, 1150], stock: 60,
    img: 'images/p-quitamanchas-500.webp', escena: E.ropa, alt: 'Quitamanchas color ámbar en botella con gatillo',
    desc: 'Se rocía sobre la mancha antes de lavar: cuellos, puños, grasa y tierra. Después, lavado normal.' },

  { id: 'desengrasante-500', nombre: 'Desengrasante con gatillo', pres: '500 ml', cat: 'desengrasantes', formato: 'chico', precio: 1390, descuento: 10, may: [12, 1090], stock: 100, rango: 8,
    img: 'images/p-desengrasante-500.webp', escena: E.cocina, alt: 'Desengrasante color ámbar en botella con gatillo',
    desc: 'Para campanas, hornallas, azulejos y mesadas con grasa. Se rocía, se deja actuar unos minutos y se retira con un paño.' },
  { id: 'limpiahornos-500', nombre: 'Limpiador de hornos y parrillas', pres: '500 ml', cat: 'desengrasantes', formato: 'chico', precio: 1590, may: [12, 1290], stock: 45,
    img: 'images/p-limpiahornos-500.webp', escena: E.banner, alt: 'Botella ámbar con gatillo de limpiador para hornos y parrillas',
    desc: 'Para grasa quemada en hornos, parrillas y planchas. Se usa con guantes y con la superficie fría.' },
  { id: 'desengrasante-5l', nombre: 'Desengrasante industrial', pres: 'Bidón 5 L', cat: 'desengrasantes', formato: 'bidon', precio: 5600, may: [4, 4650], stock: 40,
    img: 'images/p-desengrasante-5l.webp', escena: E.banner, alt: 'Bidón de 5 litros de desengrasante color ámbar',
    desc: 'Para cocinas de comercios, talleres y uso industrial. Se diluye según la suciedad, así que un bidón rinde varios litros.' },

  { id: 'jabon-manos-500', nombre: 'Jabón líquido para manos', pres: '500 ml con válvula', cat: 'higiene', formato: 'chico', precio: 1350, may: [12, 1090], stock: 90,
    img: 'images/p-jabon-manos-500.webp', escena: E.hogar, alt: 'Jabón líquido para manos color ámbar en envase con válvula',
    desc: 'Con válvula dosificadora para el baño y la cocina. Limpia sin resecar y deja las manos perfumadas.' },
  { id: 'jabon-manos-marino', nombre: 'Jabón líquido para manos marino', pres: '500 ml con válvula', cat: 'higiene', formato: 'chico', precio: 1350, descuento: 10, may: [12, 1090], stock: 70,
    img: 'images/p-jabon-manos-marino.webp', escena: E.banner, alt: 'Jabón líquido azul para manos en envase con válvula',
    desc: 'La misma fórmula del jabón para manos, con fragancia marina. Para el baño de casa o del local.' },
  { id: 'gel-inodoro', nombre: 'Gel para inodoros', pres: '750 ml', cat: 'higiene', formato: 'chico', precio: 1690, may: [12, 1350], stock: 60,
    img: 'images/p-gel-inodoro.webp', escena: E.cocina, alt: 'Botella blanca de gel para inodoros con pico curvo dorado',
    desc: 'Pico curvo para llegar debajo del borde del inodoro. Se aplica, se deja actuar y se cepilla.' },
  { id: 'toallitas-x50', nombre: 'Toallitas de limpieza', pres: 'Paquete x 50', cat: 'higiene', formato: 'chico', precio: 1150, descuento: 10, may: [12, 890], stock: 100, rango: 6,
    img: 'images/p-toallitas-x50.webp', escena: E.hogar, alt: 'Paquete azul de 50 toallitas de limpieza con tapa',
    desc: 'Toallitas húmedas para superficies, prácticas y resistentes: para la cocina, el auto o el escritorio.' },
  { id: 'cepillo', nombre: 'Cepillo de cerdas naturales', pres: 'Mango corto de madera', cat: 'higiene', formato: 'chico', precio: 2200, may: [6, 1800], stock: 30,
    img: 'images/p-cepillo.webp', escena: E.banner, alt: 'Cepillo de madera con cerdas naturales sobre la mesada',
    desc: 'Cepillo de madera para vajilla, tablas y verduras. Cerdas firmes que no rayan.' },

  { id: 'pack-lavavajillas-x12', nombre: 'Lavavajillas líquido · pack x 12', pres: '12 × 500 ml', cat: 'mayoristas', formato: 'pack', precio: 13900, may: [3, 12500], stock: 25, rango: 10,
    img: 'images/p-pack-lavavajillas-x12.webp', escena: E.mayor, alt: 'Pack cerrado de 12 botellas de lavavajillas color ámbar',
    desc: 'Caja cerrada de 12 lavavajillas de 500 ml para reventa, comedores y oficinas.' },
  { id: 'pack-doypack-x3', nombre: 'Detergente doypack · pack x 3', pres: '3 × 3 L', cat: 'mayoristas', formato: 'pack', precio: 9600, may: [3, 8700], stock: 25,
    img: 'images/p-pack-doypack-x3.webp', escena: E.mayor, alt: 'Tres doypacks azules de detergente líquido de 3 litros',
    desc: 'Tres repuestos de detergente líquido de 3 litros: 9 litros para el lavadero de una casa grande, un hotel o una lavandería.' },
  { id: 'bidon-pisos-5l', nombre: 'Limpiador de pisos', pres: 'Bidón 5 L', cat: 'mayoristas', formato: 'bidon', precio: 4500, may: [4, 3700], stock: 50, op: 'fragancia',
    img: 'images/p-bidon-pisos-5l.webp', escena: E.estante, alt: 'Bidón celeste de 5 litros de limpiador de pisos en la estantería',
    desc: 'Limpiador de pisos en bidón de 5 litros para consorcios, oficinas y comercios.' },
  { id: 'bidon-detergente-5l', nombre: 'Detergente concentrado', pres: 'Bidón 5 L', cat: 'mayoristas', formato: 'bidon', precio: 5200, may: [4, 4300], stock: 45,
    img: 'images/p-bidon-detergente-5l.webp', escena: E.estante, alt: 'Botella azul de 5 litros de detergente concentrado',
    desc: 'Detergente concentrado para vajilla en bidón: para cocinas de comercios y para fraccionar.' },
  { id: 'bidon-jabon-ropa-5l', nombre: 'Jabón líquido para ropa', pres: 'Bidón 5 L', cat: 'mayoristas', formato: 'bidon', precio: 5400, may: [4, 4500], stock: 40,
    img: 'images/p-bidon-jabon-ropa-5l.webp', escena: E.mayor, alt: 'Bidón de 5 litros de jabón líquido para ropa color ámbar',
    desc: 'El jabón líquido para ropa en bidón de 5 litros, para lavaderos y familias numerosas.' },
  { id: 'tambor-200l', nombre: 'Tambor a granel', pres: '200 L', cat: 'mayoristas', formato: 'granel', consulta: true, stock: 0,
    img: 'images/p-tambor-200l.webp', escena: E.mayor, alt: 'Tambor azul de 200 litros',
    desc: 'Multiuso, detergente o desengrasante en tambor de 200 litros, para industria, distribuidores y fraccionadores. Precio y entrega por cotización.' },
  { id: 'ibc-1000l', nombre: 'Contenedor IBC', pres: '1000 L', cat: 'mayoristas', formato: 'granel', consulta: true, stock: 0,
    img: 'images/p-ibc-1000l.webp', escena: E.mayor, alt: 'Contenedor IBC de 1000 litros con jaula metálica',
    desc: 'Producto a granel en contenedor IBC de 1000 litros. Contanos qué producto necesitás y armamos la cotización.' },

  { id: 'combo-cocina', nombre: 'Combo Cocina', pres: '5 productos', cat: 'combos', formato: 'kit', precio: 6400, stock: 30, rango: 11,
    incluye: [['lavavajillas-500', 2], ['desengrasante-500', 1], ['multiuso-500', 1], ['cepillo', 1]],
    img: 'images/p-combo-cocina.webp', escena: E.cocina, alt: 'Productos de limpieza para la cocina sobre la mesada',
    desc: 'Todo para la cocina: lavavajillas, desengrasante, limpiador multiuso y cepillo de cerdas naturales.' },
  { id: 'combo-lavadero', nombre: 'Combo Lavadero', pres: '3 productos', cat: 'combos', formato: 'kit', precio: 7200, stock: 30,
    incluye: [['detergente-ropa-3l', 1], ['suavizante-2l', 1], ['quitamanchas-500', 1]],
    img: 'images/p-combo-lavadero.webp', escena: E.ropa, alt: 'Detergente, suavizante y quitamanchas junto al lavarropas',
    desc: 'Detergente líquido, suavizante y quitamanchas para el lavado de toda la semana.' },
  { id: 'combo-hogar', nombre: 'Combo Hogar', pres: '5 productos', cat: 'combos', formato: 'kit', precio: 5700, stock: 30,
    incluye: [['multiuso-500', 1], ['limpiavidrios-500', 1], ['jabon-manos-500', 1], ['toallitas-x50', 1], ['gel-inodoro', 1]],
    img: 'images/p-combo-hogar.webp', escena: E.hogar, alt: 'Limpiador, jabón para manos, bidones y toallitas sobre la mesada',
    desc: 'Lo básico para mantener la casa: multiuso, limpiavidrios, jabón para manos, toallitas y gel para inodoros.' },
  { id: 'combo-comercio', nombre: 'Combo Comercio', pres: '3 bidones de 5 L', cat: 'combos', formato: 'kit', precio: 13500, stock: 20,
    incluye: [['multiuso-5l', 1], ['desengrasante-5l', 1], ['bidon-detergente-5l', 1]],
    img: 'images/p-combo-comercio.webp', escena: E.estante, alt: 'Bidones y envases de limpieza en una estantería',
    desc: 'Tres bidones de 5 litros para locales, consultorios y oficinas: multiuso, desengrasante y detergente concentrado.' },
];
const MAY_CALC = ['lavavajillas-500', 'suavizante-2l', 'desengrasante-5l', 'toallitas-x50'];

function crearServidor(coleccion) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false).map(p => Object.freeze({ descuento: 0, ...p }));
  const porId = new Map(datos.map(p => [p.id, p]));
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const indice = new Map(datos.map(p => [p.id, norm([p.nombre, p.pres, p.desc, ETIQUETAS_CAT[p.cat], CATEGORIAS.find(c => c.id === p.cat)?.nombre,
    FORMATOS.find(f => f.id === p.formato)?.nombre, p.op ? OPCIONES[p.op].valores.join(' ') : '', p.descuento > 0 ? 'oferta ofertas descuento' : ''].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat), formato = lista(f.formato), ids = lista(f.ids), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (formato.length && !formato.includes(p.formato)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.precioMin != null && (p.consulta || final(p) < f.precioMin)) return false;
    if (f.precioMax != null && (p.consulta || final(p) > f.precioMax)) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const valor = p => (p.consulta ? Infinity : final(p));
    switch (orden) {
      case 'precio-asc': return (a, b) => valor(a) - valor(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => (b.consulta ? -Infinity : final(b)) - (a.consulta ? -Infinity : final(a)) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.pres.localeCompare(b.pres, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || datos.indexOf(a) - datos.indexOf(b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const tope = Math.max(1, Math.min(Math.floor(Number(limite)) || POR_PAGINA, TOPE_CONSULTA));
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      if (i < 0) return { items: [], cursor: null };
      desde = i + 1;
    }
    const items = ordenados.slice(desde, desde + tope);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) { return datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0); }
  function obtener(id) { const p = porId.get(id); return p ? copia(p) : null; }
  return { consultar, contar, obtener };
}
const Servidor = crearServidor(PRODUCTOS);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const esMayorista = (p, cantidad) => !!p?.may && cantidad >= p.may[0];
const precioUnitario = (p, cantidad) => (esMayorista(p, cantidad) ? p.may[1] : precioFinal(p));
const getProducto = id => Servidor.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
const sumaIncluye = p => (p.incluye || []).reduce((s, [id, n]) => { const x = getProducto(id); return x ? s + precioFinal(x) * n : s; }, 0);
const ahorroCombo = p => Math.max(0, sumaIncluye(p) - p.precio);
const msgCotizar = p => `Hola ${MARCA}! Quiero cotizar ${p.nombre} de ${p.pres}. ¿Qué productos tienen en ese formato y cómo es la entrega?`;

const Cart = {
  KEY: 'quimicadelplata_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string' && Number(i.qty) > 0).map(i => ({ id: i.id, op: i.op || '', qty: Math.floor(Number(i.qty)) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  qtyDe(id, op = '') { return this.get().find(i => i.id === id && i.op === op)?.qty || 0; },
  qtyProducto(id) { return this.get().reduce((s, i) => s + (i.id === id ? i.qty : 0), 0); },
  add(p, qty = 1, op = '') { return this.set(p, op, this.qtyDe(p.id, op) + qty); },
  set(p, op, qty) {
    if (!p || p.consulta) return 0;
    const antes = esMayorista(p, this.qtyProducto(p.id));
    let items = this.get();
    const otros = items.filter(i => i.id === p.id && i.op !== op).reduce((s, i) => s + i.qty, 0);
    const max = Math.max(0, (p.stock ?? 99) - otros);
    const pedido = Math.max(0, Math.round(Number(qty)) || 0);
    const n = Math.min(pedido, max);
    const it = items.find(i => i.id === p.id && i.op === op);
    if (n === 0) items = items.filter(i => i !== it);
    else if (it) it.qty = n;
    else items.push({ id: p.id, op, qty: n });
    this.save(items);
    if (pedido > max) showToast(`Por ahora hay ${p.stock} unidades de ${p.nombre}. Para más, consultanos por WhatsApp.`);
    if (!antes && esMayorista(p, this.qtyProducto(p.id))) showToast(`Precio mayorista aplicado: ${p.nombre} a ${formatearPrecio(p.may[1])} c/u.`);
    return n;
  },
  remove(id, op = '') { this.save(this.get().filter(i => !(i.id === id && i.op === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  totales() {
    const lineas = this.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(l => l.p && !l.p.consulta);
    const cant = {};
    lineas.forEach(l => { cant[l.id] = (cant[l.id] || 0) + l.qty; });
    let lista = 0, total = 0;
    lineas.forEach(l => { lista += precioFinal(l.p) * l.qty; total += precioUnitario(l.p, cant[l.id]) * l.qty; });
    return { lineas, cant, lista, total, ahorro: lista - total, unidades: lineas.reduce((s, l) => s + l.qty, 0) };
  },
};
const ENTREGA_KEY = 'quimicadelplata_entrega';
const ENTREGAS = { retiro: 'Retiro en la fábrica (Pilar)', envio: 'Envío a domicilio o comercio (a coordinar)' };
const leerEntrega = () => { try { const v = localStorage.getItem(ENTREGA_KEY); return ENTREGAS[v] ? v : 'retiro'; } catch { return 'retiro'; } };
function mensajePedido() {
  const t = Cart.totales();
  return [`Hola ${MARCA}! Quiero hacer este pedido:`,
    ...t.lineas.map(l => {
      const may = esMayorista(l.p, t.cant[l.id]);
      return `- ${l.qty} × ${l.p.nombre} ${l.p.pres}${l.op ? ` (${l.op})` : ''}: ${formatearPrecio(precioUnitario(l.p, t.cant[l.id]) * l.qty)}${may ? ' (mayorista)' : ''}`;
    }),
    `Total: ${formatearPrecio(t.total)}`,
    ...(t.ahorro > 0 ? [`Ahorro mayorista: ${formatearPrecio(t.ahorro)}`] : []),
    `Entrega: ${ENTREGAS[leerEntrega()]}`].join('\n');
}

const SVG = d => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON = {
  flecha: SVG('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  menos: SVG('<path d="M5 12h14"/>'),
  mas: SVG('<path d="M5 12h14"/><path d="M12 5v14"/>'),
  cerrar: SVG('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  carritoMas: SVG('<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/>'),
  gota: SVG('<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>'),
  baja: SVG('<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>'),
  check: SVG('<path d="M20 6 9 17l-5-5"/>'),
  wsp: '<svg class="wsp-glyph" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  if (p.consulta) return '<p class="precio precio--consulta"><span class="precio__final">Precio por cotización</span></p>';
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function mayHTML(p) {
  if (p.incluye) { const a = ahorroCombo(p); return a > 0 ? `<p class="ahorro">Ahorrás ${formatearPrecio(a)} vs. por separado</p>` : ''; }
  if (p.consulta) return '<p class="precio-may">Cotizamos según producto y entrega</p>';
  return p.may ? `<p class="precio-may">Mayorista <b>${formatearPrecio(p.may[1])}</b> desde ${p.may[0]} u.</p>` : '';
}
function badgesHTML(p, clase = 'prod__badges') {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge">-${p.descuento}%</span>`);
  if (p.incluye) b.push('<span class="badge badge--azul">Combo</span>');
  if (p.consulta) b.push('<span class="badge badge--claro">A granel</span>');
  return b.length ? `<span class="${clase}">${b.join('')}</span>` : '';
}
const metaDe = p => (p.incluye ? `${p.pres} · Combo` : `${p.pres} · ${nombreDe(CATEGORIAS, p.cat)}`);
function stepperHTML(max, valor = 1, etiqueta = '') {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno${etiqueta}"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno${etiqueta}"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function cardHTML(p) {
  const nombre = esc(p.nombre);
  let acciones = '', comprar = '';
  if (p.consulta) {
    acciones = `<a class="prod-add prod-add--wsp" href="${wspHref(msgCotizar(p))}" target="_blank" rel="noopener" aria-label="Cotizar por WhatsApp: ${nombre}">${ICON.wsp}<span class="lbl-long">Cotizar por WhatsApp</span><span class="lbl-short">Cotizar</span></a>`;
  } else if (p.op) {
    acciones = `<button type="button" class="prod-add" data-qv-abrir="${p.id}" aria-label="${OPCIONES[p.op].verbo}: ${nombre}">${ICON.gota}<span class="lbl-long">${OPCIONES[p.op].verbo}</span><span class="lbl-short">Elegir</span></button>`;
  } else {
    acciones = `${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span>Agregar</span>${ICON.carritoMas}</button>`;
    comprar = `<button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>`;
  }
  return `<article class="prod">
    <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="480" height="600">${badgesHTML(p)}</a>
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      ${mayHTML(p)}
      <div class="prod-actions">${acciones}</div>
      ${comprar}
    </div>
  </article>`;
}
function filaHTML(p, animar = true) {
  const nombre = esc(p.nombre);
  const op = p.op ? OPCIONES[p.op].valores[0] : '';
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(28px)"' : '';
  const cant = p.consulta
    ? `<a class="prod-add prod-add--wsp" href="${wspHref(msgCotizar(p))}" target="_blank" rel="noopener" aria-label="Cotizar por WhatsApp: ${nombre}">${ICON.wsp}<span>Cotizar</span></a>`
    : `<div class="stepper" data-fila-stepper><button type="button" data-menos aria-label="Restar uno de ${nombre}" disabled>${ICON.menos}</button><input type="text" inputmode="numeric" maxlength="3" value="0" aria-label="Cantidad de ${nombre}" data-fila-qty><button type="button" data-mas aria-label="Sumar uno de ${nombre}">${ICON.mas}</button></div>`;
  const may = p.may
    ? `<strong>${formatearPrecio(p.may[1])}</strong><small>desde ${p.may[0]} u.</small>`
    : p.incluye ? `<small>Ahorrás ${formatearPrecio(ahorroCombo(p))}</small>` : '<small>A cotizar</small>';
  return `<li${anim}><div class="fila" data-fila="${p.id}" data-op="${esc(op)}">
    <a class="fila__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" width="64" height="80"></a>
    <div class="fila__info">
      <p class="fila__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></p>
      <p class="fila__meta">${esc(metaDe(p))}</p>
      ${badgesHTML(p, 'fila__tags')}
      ${p.op ? `<select class="fila__op" data-fila-op aria-label="Fragancia de ${nombre}">${OPCIONES[p.op].valores.map(v => `<option>${esc(v)}</option>`).join('')}</select>` : ''}
    </div>
    <div class="fila__min"><span class="fila__lbl">Minorista</span>${p.consulta ? '<strong>Cotización</strong>' : `<strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}`}</div>
    <div class="fila__may" data-fila-may><span class="fila__lbl">Mayorista</span>${may}</div>
    <div class="fila__cant">${cant}</div>
    <div class="fila__sub" data-fila-sub>—</div>
  </div></li>`;
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
  cerrar(capa) {
    this.abiertas = this.abiertas.filter(c => c !== capa);
    if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll');
  },
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
  nav.querySelectorAll(':scope > a').forEach(a => a.addEventListener('click', close));
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
    panel.innerHTML = CATEGORIAS.map(c => `
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="52" height="52">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Servidor.contar({ cat: c.id })}</span>
      </a>`).join('') + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero, .hero-lista');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-card, .hero-lista__datos > span, .hero-lista__marco'), { y: 24, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-lista__placa, .hero-card__sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
  if (typeof ScrollTrigger !== 'undefined' && img && window.matchMedia('(min-width: 981px)').matches) {
    gsap.to(img, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target.closest('button, input, select, .stepper')) return;
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
    const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 16;
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(vp).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const cats = document.getElementById('catsGrid');
  if (cats) {
    cats.innerHTML = CATEGORIAS.filter(c => c.id !== 'combos').map(c => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">
      <a class="cat-tile" href="${CATALOGO_URL}?cat=${c.id}">
        <span class="cat-tile__foto"><img src="${c.img}" alt="${esc(c.nombre)}: ${esc(c.bajada.toLowerCase())}" width="800" height="600"></span>
        <span class="cat-tile__info"><span><span class="cat-tile__nombre">${esc(c.nombre)}</span><span class="cat-tile__bajada">${esc(c.bajada)}</span></span><span class="cat-tile__flecha">${ICON.flecha}</span></span>
      </a></li>`).join('') + `<li class="cats-lado" data-animate="subir" style="opacity:0;transform:translateY(40px)">
      <a class="lado-card" href="#mayorista"><span class="lado-card__ic">${ICON.baja}</span><strong>Precios mayoristas y minoristas</strong><span>El precio baja solo por cantidad.</span></a>
      <a class="lado-card lado-card--oro" href="${CATALOGO_URL}?cat=combos"><span class="lado-card__ic">${SVG('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>')}</span><strong>Combos y ofertas</strong><span>Kits armados con el ahorro a la vista.</span></a>
    </li>`;
  }
  const tabs = document.getElementById('catsTabs');
  if (tabs) {
    tabs.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-animate="subir" style="opacity:0;transform:translateY(20px)">Todo el catálogo <small>${Servidor.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-animate="subir" style="opacity:0;transform:translateY(20px)">${esc(c.nombre)} <small>${Servidor.contar({ cat: c.id })}</small></a>`)].join('');
  }
  const rail = document.getElementById('railDestacados');
  if (rail) {
    const { items } = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p)}</li>`).join('');
  }
  const preview = document.getElementById('listaPreview');
  if (preview) {
    const { items } = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    preview.innerHTML = items.map(p => filaHTML(p)).join('');
    const n = document.querySelector('[data-total-productos]');
    if (n) n.textContent = Servidor.contar({});
  }
  initOfertas();
}

function initOfertas() {
  const grid = document.getElementById('ofertasGrid');
  const tabs = [...document.querySelectorAll('[data-oferta-tab]')];
  if (!grid || !tabs.length) return;
  const FILTRO = { combos: { cat: 'combos' }, ofertas: { oferta: true } };
  const link = document.querySelector('[data-ofertas-link]');
  const pintar = (id, animar) => {
    tabs.forEach(t => { const on = t.dataset.ofertaTab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    const { items } = Servidor.consultar({ filtros: FILTRO[id], orden: 'destacados', limite: 4 });
    grid.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
    grid.setAttribute('aria-labelledby', tabs.find(t => t.dataset.ofertaTab === id)?.id || '');
    if (link) { link.href = id === 'combos' ? `${CATALOGO_URL}?cat=combos` : `${CATALOGO_URL}?oferta=1`; link.querySelector('span').textContent = id === 'combos' ? 'Ver todos los combos' : 'Ver todas las ofertas'; }
    if (animar) { revelarNuevos(grid); refrescarTriggers(); }
  };
  tabs.forEach((t, i) => {
    const n = t.querySelector('small');
    if (n) n.textContent = Servidor.contar(FILTRO[t.dataset.ofertaTab]);
    t.addEventListener('click', () => pintar(t.dataset.ofertaTab, true));
    t.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      e.preventDefault();
      const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[j].focus();
      pintar(tabs[j].dataset.ofertaTab, true);
    });
  });
  pintar('combos', false);
}

function initMayCalc() {
  const box = document.getElementById('mayCalc');
  if (!box) return;
  const prods = MAY_CALC.map(getProducto).filter(p => p?.may);
  const chips = box.querySelector('[data-may-prods]');
  const input = box.querySelector('[data-may-qty]');
  const menos = box.querySelector('[data-may-menos]');
  const mas = box.querySelector('[data-may-mas]');
  const out = k => box.querySelector(`[data-may-${k}]`);
  if (!chips || !input || !prods.length) return;
  let p = prods[0], qty = p.may[0];
  chips.innerHTML = prods.map((x, i) => `<button type="button" class="chip" data-may-prod="${x.id}" aria-pressed="${i === 0}">${esc(x.nombre)} ${esc(x.pres)}</button>`).join('');
  const pintar = () => {
    qty = Math.max(1, Math.min(qty, p.stock));
    if (document.activeElement !== input) input.value = qty;
    menos.disabled = qty <= 1; mas.disabled = qty >= p.stock;
    const unit = precioUnitario(p, qty);
    const total = unit * qty;
    const ahorro = precioFinal(p) * qty - total;
    out('unit').textContent = formatearPrecio(unit);
    out('total').textContent = formatearPrecio(total);
    out('ahorro').textContent = formatearPrecio(ahorro);
    out('nivel').textContent = esMayorista(p, qty) ? 'Precio por unidad · mayorista' : 'Precio por unidad · minorista';
    out('barra').style.transform = `scaleX(${Math.min(qty / p.may[0], 1)})`;
    out('msg').innerHTML = esMayorista(p, qty)
      ? `Precio mayorista aplicado: pagás <b>${formatearPrecio(ahorro)}</b> menos que a precio minorista.`
      : `Sumá <b>${p.may[0] - qty}</b> más y cada unidad baja a <b>${formatearPrecio(p.may[1])}</b>.`;
    out('add').textContent = `Agregar ${qty} al carrito`;
  };
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-may-prod]');
    if (!b) return;
    p = prods.find(x => x.id === b.dataset.mayProd) || p;
    qty = p.may[0];
    chips.querySelectorAll('[data-may-prod]').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    pintar();
  });
  menos.addEventListener('click', () => { qty--; pintar(); });
  mas.addEventListener('click', () => { qty++; pintar(); });
  input.addEventListener('input', () => { const v = parseInt(input.value.replace(/\D/g, ''), 10); if (v > 0) { qty = v; pintar(); } });
  input.addEventListener('blur', () => { input.value = qty; });
  box.querySelector('[data-may-cta]')?.addEventListener('click', () => {
    const n = Cart.add(p, qty);
    if (n) showToast(`Sumaste ${qty} × ${p.nombre} ${p.pres} al carrito.`);
  });
  pintar();
}

function syncFilas() {
  const filas = document.querySelectorAll('[data-fila]');
  if (!filas.length) return;
  const { cant } = Cart.totales();
  const items = Cart.get();
  filas.forEach(f => {
    const p = getProducto(f.dataset.fila);
    if (!p || p.consulta) return;
    const op = f.dataset.op || '';
    const q = items.find(i => i.id === p.id && i.op === op)?.qty || 0;
    const total = cant[p.id] || 0;
    const inp = f.querySelector('[data-fila-qty]');
    if (inp && document.activeElement !== inp) inp.value = q;
    const menos = f.querySelector('[data-menos]');
    if (menos) menos.disabled = q <= 0;
    const mas = f.querySelector('[data-mas]');
    if (mas) mas.disabled = total >= p.stock;
    f.classList.toggle('en-pedido', q > 0);
    const may = esMayorista(p, total);
    f.querySelector('[data-fila-may]')?.classList.toggle('may-on', may);
    const sub = f.querySelector('[data-fila-sub]');
    if (!sub) return;
    if (!q) { sub.textContent = '—'; return; }
    const nota = may ? '<small>Mayorista</small>' : p.may ? `<small>Sumá ${p.may[0] - total} y baja</small>` : '';
    sub.innerHTML = `${formatearPrecio(precioUnitario(p, total) * q)}${nota}`;
  });
}
function initFilas() {
  if (!document.querySelector('[data-fila]') && PAGINA !== 'catalogo') return;
  const cambiar = (f, nuevo) => {
    const p = getProducto(f.dataset.fila);
    if (!p) return;
    const op = f.dataset.op || '';
    const antes = Cart.qtyDe(p.id, op);
    const n = Cart.set(p, op, nuevo);
    if (!antes && n) showToast(`Sumaste ${p.nombre} ${p.pres}${op ? ` (${op})` : ''} al pedido.`);
    syncFilas();
  };
  document.addEventListener('click', e => {
    const f = e.target.closest('[data-fila]');
    if (!f || !e.target.closest('[data-fila-stepper]')) return;
    const q = Cart.qtyDe(f.dataset.fila, f.dataset.op || '');
    if (e.target.closest('[data-mas]')) cambiar(f, q + 1);
    else if (e.target.closest('[data-menos]')) cambiar(f, q - 1);
  });
  document.addEventListener('change', e => {
    const f = e.target.closest('[data-fila]');
    if (!f) return;
    if (e.target.matches('[data-fila-op]')) { f.dataset.op = e.target.value; syncFilas(); return; }
    if (e.target.matches('[data-fila-qty]')) cambiar(f, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches?.('[data-fila-qty]')) { e.preventDefault(); e.target.blur(); }
  });
  document.addEventListener('focusout', e => {
    if (e.target.matches?.('[data-fila-qty]')) setTimeout(syncFilas, 0);
  });
  document.addEventListener('cart:updated', syncFilas);
  syncFilas();
}

function renderPedido() {
  const panel = document.getElementById('pedidoPanel');
  if (!panel) return;
  const t = Cart.totales();
  const cabeza = `<div class="pedido__head"><h2>Tu pedido</h2><span class="pedido__n">${t.unidades} ${t.unidades === 1 ? 'unidad' : 'unidades'}</span></div>`;
  if (!t.lineas.length) {
    panel.innerHTML = `${cabeza}<div class="pedido__vacio"><strong>Todavía está vacío</strong>Indicá cantidades en la lista: el precio mayorista se aplica solo cuando llegás a la cantidad de cada producto.</div>`;
    return;
  }
  panel.innerHTML = `${cabeza}
    <ul class="pedido__lineas">${t.lineas.map(l => {
      const may = esMayorista(l.p, t.cant[l.id]);
      const unit = precioUnitario(l.p, t.cant[l.id]);
      return `<li class="pedido__linea"><b>${esc(l.p.nombre)} ${esc(l.p.pres)}${l.op ? ` · ${esc(l.op)}` : ''}</b><span class="tnum">${formatearPrecio(unit * l.qty)}</span><small>${l.qty} × ${formatearPrecio(unit)}${may ? ' · <em>mayorista</em>' : ''}</small></li>`;
    }).join('')}</ul>
    <div class="resumen">
      <div class="resumen__fila"><span>A precio minorista</span><span>${formatearPrecio(t.lista)}</span></div>
      ${t.ahorro > 0 ? `<div class="resumen__fila resumen__ahorro"><span>Ahorro mayorista</span><span>−${formatearPrecio(t.ahorro)}</span></div>` : ''}
      <div class="resumen__fila resumen__total"><span>Total</span><span>${formatearPrecio(t.total)}</span></div>
    </div>
    <div class="pedido__acciones">
      <button type="button" class="btn btn--primary btn--bloque" data-checkout>Finalizar compra</button>
      <a class="btn btn--wsp btn--bloque" href="${wspHref(mensajePedido())}" target="_blank" rel="noopener">${ICON.wsp}Enviar pedido por WhatsApp</a>
      <button type="button" class="pedido__vaciar" data-vaciar>Vaciar pedido</button>
    </div>`;
}

const QV = { p: null, op: '', foto: 0, qty: 1, opener: null };
function nivelesHTML(p) {
  if (!p.may) return '';
  const total = Cart.qtyProducto(p.id) + QV.qty;
  const may = esMayorista(p, total);
  return `<div class="qv__escala" data-qv-escala>
    <div class="qv__nivel${may ? '' : ' nivel-on'}"><small>Minorista</small><strong>${formatearPrecio(precioFinal(p))} ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</strong><span>De 1 a ${p.may[0] - 1} unidades</span></div>
    <div class="qv__nivel qv__nivel--may${may ? ' nivel-on' : ''}"><small>Mayorista</small><strong>${formatearPrecio(p.may[1])}</strong><span>Desde ${p.may[0]} unidades</span></div>
  </div>`;
}
function totalQVHTML(p) {
  const enCarrito = Cart.qtyProducto(p.id);
  const unit = precioUnitario(p, enCarrito + QV.qty);
  const nota = p.may && !esMayorista(p, enCarrito + QV.qty) ? ` · sumá ${p.may[0] - enCarrito - QV.qty} más para el mayorista` : p.may ? ' · precio mayorista' : '';
  return `${QV.qty} × ${formatearPrecio(unit)} = <b>${formatearPrecio(unit * QV.qty)}</b>${enCarrito ? ` (ya tenés ${enCarrito} en el carrito)` : ''}${nota}`;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `Ambiente: ${p.alt}` }];
  const opc = p.op ? OPCIONES[p.op] : null;
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre} ${p.pres}${QV.op ? ` (${QV.op})` : ''}.`;
  let cuerpo = '';
  if (p.consulta) {
    cuerpo = `<a class="btn btn--wsp" href="${wspHref(msgCotizar(p))}" target="_blank" rel="noopener">${ICON.wsp}Cotizar por WhatsApp</a>`;
  } else {
    cuerpo = `${opc ? `<div class="qv__opciones">
        <p><span>${opc.nombre}</span></p>
        <div class="qv__ops" role="group" aria-label="Elegí la ${opc.nombre.toLowerCase()}">${opc.valores.map(v => `<button type="button" class="chip" data-qv-op="${esc(v)}" aria-pressed="${QV.op === v}">${esc(v)}</button>`).join('')}</div>
        <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
      </div>` : ''}
      <div class="qv__compra">
        ${stepperHTML(p.stock, QV.qty)}
        <button type="button" class="btn btn--primary" data-qv-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar>Comprar ahora</button>
      </div>
      <p class="qv__total" data-qv-total>${totalQVHTML(p)}</p>`;
  }
  const incluye = p.incluye ? `<div class="qv__incluye"><p>Incluye</p><ul>${p.incluye.map(([id, n]) => {
    const x = getProducto(id);
    return x ? `<li><span>${n} × ${esc(x.nombre)} ${esc(x.pres)}</span><span>${formatearPrecio(precioFinal(x) * n)}</span></li>` : '';
  }).join('')}<li><span><strong>Por separado</strong></span><span><s>${formatearPrecio(sumaIncluye(p))}</s></span></li></ul></div>` : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="640" height="800"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto del ambiente' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="qv__pres">${esc(p.pres)}</p>
        ${p.may ? nivelesHTML(p) : `${precioHTML(p)}${mayHTML(p)}`}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${incluye}
        ${cuerpo}
        ${p.consulta ? '' : `<div class="qv__links"><a href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a></div>`}
        ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="200" height="250"></span><span>${esc(r.nombre)} ${esc(r.pres)}</span><span class="precio__final">${r.consulta ? 'A cotizar' : formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) {
    const data = { '@context': 'https://schema.org', '@type': 'Product', name: `${p.nombre} ${p.pres}`, description: p.desc,
      image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA } };
    if (!p.consulta) data.offers = { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' };
    ld.textContent = JSON.stringify(data);
  }
}
function actualizarQVCompra() {
  const modal = document.getElementById('quickView');
  const p = QV.p;
  if (!modal || !p) return;
  const st = modal.querySelector('.qv__compra [data-stepper]');
  if (st) {
    st.querySelector('output').textContent = QV.qty;
    st.querySelector('[data-menos]').disabled = QV.qty <= 1;
    st.querySelector('[data-mas]').disabled = QV.qty >= p.stock;
  }
  const esc2 = modal.querySelector('[data-qv-escala]');
  if (esc2) esc2.outerHTML = nivelesHTML(p);
  const tot = modal.querySelector('[data-qv-total]');
  if (tot) tot.innerHTML = totalQVHTML(p);
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = ''; QV.foto = 0; QV.qty = 1;
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
function cerrarQV(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  if (devolverFoco) QV.opener?.focus?.({ preventScroll: true });
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const st = e.target.closest('.qv__compra [data-stepper]');
    if (st) {
      e.stopPropagation();
      if (e.target.closest('[data-mas]')) QV.qty = Math.min(QV.qty + 1, QV.p.stock);
      else if (e.target.closest('[data-menos]')) QV.qty = Math.max(QV.qty - 1, 1);
      actualizarQVCompra();
      return;
    }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__links a');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} ${QV.p.pres} (${QV.op}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (p.op && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí una fragancia para agregarlo al carrito.';
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const n = Cart.add(p, QV.qty, QV.op);
      if (!n) return;
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else { showToast(`Sumaste ${QV.qty} × ${p.nombre}${QV.op ? ` (${QV.op})` : ''} al carrito.`); QV.qty = 1; actualizarQVCompra(); }
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(l, cant) {
  const p = l.p;
  const total = cant[p.id];
  const may = esMayorista(p, total);
  const unit = precioUnitario(p, total);
  const nudge = p.may && !may ? `<p class="linea__nudge">Sumá ${p.may[0] - total} más y pagás ${formatearPrecio(p.may[1])} c/u.</p>` : may ? '<p class="linea__nudge">Precio mayorista aplicado.</p>' : '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(l.op)}">
    <img src="${p.img}" alt="" width="60" height="75">
    <div>
      <p class="linea__nombre">${esc(p.nombre)} ${esc(p.pres)}</p>
      <p class="linea__meta">${l.op ? `${esc(l.op)} · ` : ''}${formatearPrecio(unit)} c/u${may ? ' · mayorista' : ''}</p>
      ${stepperHTML(p.stock, l.qty, ` de ${esc(p.nombre)}`)}
      ${nudge}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(unit * l.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const t = Cart.totales();
  if (!t.lineas.length) {
    items.innerHTML = `<div class="drawer__vacio"><strong>Tu carrito está limpito</strong><p>Todavía no sumaste productos. Arrancá por los infaltables: lavavajillas, multiuso o un bidón de 5 litros.</p><a class="btn btn--primary" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${t.lineas.map(l => lineaHTML(l, t.cant)).join('')}</ul>`;
  foot.hidden = false;
  const res = foot.querySelector('[data-resumen]');
  if (res) res.innerHTML = `
    <div class="resumen__fila"><span>A precio minorista</span><span>${formatearPrecio(t.lista)}</span></div>
    ${t.ahorro > 0 ? `<div class="resumen__fila resumen__ahorro"><span>Ahorro mayorista</span><span>−${formatearPrecio(t.ahorro)}</span></div>` : ''}
    <div class="resumen__fila resumen__total"><span>Total</span><span>${formatearPrecio(t.total)}</span></div>`;
  const entrega = leerEntrega();
  foot.querySelectorAll('input[name="entrega"]').forEach(r => { r.checked = r.value === entrega; });
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(mensajePedido());
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
  cartOpener?.focus?.({ preventScroll: true });
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const p = getProducto(linea.dataset.linea);
    const op = linea.dataset.lineaOp || '';
    if (!p) return;
    if (e.target.closest('[data-quitar]')) { Cart.remove(p.id, op); return; }
    const q = Cart.qtyDe(p.id, op);
    if (e.target.closest('[data-mas]')) Cart.set(p, op, q + 1);
    else if (e.target.closest('[data-menos]') && q > 1) Cart.set(p, op, q - 1);
  });
  d.addEventListener('change', e => {
    const r = e.target.closest('input[name="entrega"]');
    if (!r) return;
    try { localStorage.setItem(ENTREGA_KEY, r.value); } catch (err) { void err; }
    renderCarrito();
    renderPedido();
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
  const total = Cart.totales().total;
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = n ? formatearPrecio(total) : 'Carrito'; });
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
    if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('[data-vaciar]')) { Cart.clear(); showToast('Vaciaste el pedido.'); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]') && !e.target.closest('.qv')) {
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
      const qty = Number(add.closest('.prod-actions')?.querySelector('[data-stepper] output')?.textContent) || 1;
      if (!Cart.add(p, qty)) return;
      showToast(`Sumaste ${qty} × ${p.nombre} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.prod__body')?.querySelector('.prod-actions [data-stepper] output')?.textContent) || 1;
      if (Cart.add(p, qty)) abrirCarrito();
    }
  });
}

const HORARIO = { 1: [480, 1080], 2: [480, 1080], 3: [480, 1080], 4: [480, 1080], 5: [480, 1080], 6: [480, 780] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function estadoHorario(ahora = new Date()) {
  let dia = ahora.getDay(), min = ahora.getHours() * 60 + ahora.getMinutes();
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(ahora);
    const get = t => partes.find(x => x.type === t)?.value;
    dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    min = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
  } catch (e) { void e; }
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] && min < hoy[1]) return { abierto: true, texto: `Abierto ahora · hasta las ${hoy[1] / 60} h` };
  if (hoy && min < hoy[0]) return { abierto: false, texto: `Cerrado · abre hoy a las ${hoy[0] / 60} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) return { abierto: false, texto: `Cerrado · abre ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0] / 60} h` };
  }
  return { abierto: false, texto: 'Cerrado' };
}
function initHorario() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const s = estadoHorario();
    els.forEach(el => { el.textContent = s.texto; el.classList.toggle('estado--cerrado', !s.abierto); });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.4587, -58.9142];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: false, dragging: !window.matchMedia('(hover: none)').matches, attributionControl: true }).setView(centro, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.marker(centro, { icon: L.divIcon({ className: '', html: '<span class="pin"></span>', iconSize: [22, 22], iconAnchor: [11, 22] }), title: 'Pilar, Buenos Aires', keyboard: false }).addTo(mapa);
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid') || document.getElementById('catalogoLista');
  if (!grid) return;
  const esLista = grid.id === 'catalogoLista';
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS),
    formato: (params.get('formato') || '').split(',').filter(v => FORMATOS.some(f => f.id === v)),
    precio: valido(params.get('precio'), PRECIOS),
    oferta: params.get('oferta') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const formatoSel = document.getElementById('formato');
  const soloOfertas = document.getElementById('soloOfertas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  const pie = document.querySelector('[data-cat-pie]');
  let cursor = null, mostrados = 0, total = 0, primerosFiltros = true;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.formato.length) f.formato = e.formato;
    if (e.oferta) f.oferta = true;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, grupo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}>${etiqueta}${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    if (!cuerpo) return;
    const anim = primerosFiltros ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : '';
    const base = e.cat ? { cat: e.cat } : {};
    cuerpo.innerHTML = [
      `<fieldset class="f-grupo"${anim}><legend>Línea</legend>
        ${opcion('radio', 'cat', 'cat', '', 'Todo el catálogo', !e.cat, Servidor.contar({}))}
        ${CATEGORIAS.map(c => opcion('radio', 'cat', 'cat', c.id, esc(c.nombre), e.cat === c.id, Servidor.contar({ cat: c.id }))).join('')}</fieldset>`,
      `<fieldset class="f-grupo"${anim}><legend>Presentación</legend>
        ${FORMATOS.map(f => opcion('checkbox', 'formato', `formato-${f.id}`, f.id, esc(f.nombre), e.formato.includes(f.id), Servidor.contar({ ...base, formato: f.id }))).join('')}</fieldset>`,
      `<fieldset class="f-grupo"${anim}><legend>Precio por unidad</legend>
        ${opcion('radio', 'precio', 'precio', '', 'Cualquier precio', !e.precio)}
        ${PRECIOS.map(r => opcion('radio', 'precio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`,
      `<fieldset class="f-grupo"${anim}><legend>Ofertas</legend>
        ${opcion('checkbox', 'oferta', 'oferta', '1', 'Solo productos en oferta', e.oferta, Servidor.contar({ ...base, oferta: true }))}</fieldset>`,
    ].join('');
    if (!primerosFiltros) cuerpo.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    primerosFiltros = false;
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const titulo = cat ? cat.nombre : e.oferta ? 'Ofertas' : 'Catálogo completo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.oferta ? 'Productos con precio rebajado. El precio mayorista por cantidad también se aplica.' : 'Limpiadores, detergentes, desengrasantes, bidones, packs y combos, con precio minorista y mayorista.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) {
      const yaAnimado = chips.dataset.listo === '1';
      const anim = yaAnimado ? '' : ' data-animate="subir" style="opacity:0;transform:translateY(20px)"';
      chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}${anim}>Todo <small>${Servidor.contar({})}</small></a>`,
        ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}${anim}>${esc(c.nombre)} <small>${Servidor.contar({ cat: c.id })}</small></a>`)].join('');
      if (yaAnimado) chips.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      chips.dataset.listo = '1';
    }
  }
  function pintarActivos() {
    const quitar = [];
    e.formato.forEach(v => quitar.push(['formato', v, nombreDe(FORMATOS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'En oferta']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    if (activos) activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncControles() {
    if (orden) orden.value = e.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = e.q;
    if (formatoSel) formatoSel.value = e.formato[0] || '';
    if (soloOfertas) soloOfertas.checked = e.oferta;
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'formato', 'precio', 'oferta', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.formato.length) u.searchParams.set('formato', e.formato.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Servidor.contar(filtros()); }
    const res = Servidor.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => (esLista ? filaHTML(p) : `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    if (contador) contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    if (vacio) vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (pie) pie.hidden = total === 0;
    if (verMas) verMas.hidden = !cursor;
    if (mostrando) mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    if (esLista) syncFilas();
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncControles();
    syncURL();
    pintar(true);
  }

  if (orden) orden.innerHTML = ORDENES.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('');
  if (formatoSel) formatoSel.innerHTML = '<option value="">Todas las presentaciones</option>' + FORMATOS.map(f => `<option value="${f.id}">${esc(f.nombre)}</option>`).join('');
  if (esLista && e.formato.length > 1) e.formato = e.formato.slice(0, 1);
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncControles();
  syncURL();
  pintar(true);

  form?.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta') e.oferta = inp.checked;
    else {
      const set = new Set(e.formato);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e.formato = [...set];
    }
    aplicar();
  });
  form?.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar?.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden?.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  formatoSel?.addEventListener('change', () => { e.formato = formatoSel.value ? [formatoSel.value] : []; aplicar(); });
  soloOfertas?.addEventListener('change', () => { e.oferta = soloOfertas.checked; aplicar(); });
  verMas?.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.formato = []; e.precio = ''; e.oferta = false; e.q = ''; if (buscar) buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos?.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta') e.oferta = false;
    else if (k === 'q') { e.q = ''; if (buscar) buscar.value = ''; }
    else e.formato = e.formato.filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.querySelectorAll('.cats-item, .cats-todo, .site-footer a[href*="catalogo"]').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.oferta = u.searchParams.get('oferta') === '1';
    e.formato = []; e.precio = ''; e.q = ''; if (buscar) buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  const headerBuscar = document.querySelector('.header-search');
  headerBuscar?.addEventListener('submit', ev => {
    const q = headerBuscar.querySelector('input')?.value.trim().slice(0, 60) || '';
    ev.preventDefault();
    e.q = q; if (buscar) buscar.value = q;
    aplicar();
    buscar?.scrollIntoView({ block: 'center' });
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar?.focus({ preventScroll: false }), 60);
  window.addEventListener('hashchange', () => { if (location.hash === '#buscar') buscar?.focus(); });
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  function cerrar(devolver = true) {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (mq.matches) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    if (devolver) abrirBtn.focus();
  }
  const modo = () => {
    const d = mq.matches;
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { cerrar(false); form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', () => cerrar());
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
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
document.addEventListener('cart:updated', renderPedido);
window.addEventListener('storage', e => { if (e.key === Cart.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });

initCatsMenu();
initHome();
initCatalogo();
initReveals();
initNav();
initHeroMotion();
initRails();
initMayCalc();
initFilas();
renderPedido();
initQV();
initCarrito();
initAcciones();
initFloats();
initHorario();
initMapa();
initModelBarScroll();
updateCartBadge();
