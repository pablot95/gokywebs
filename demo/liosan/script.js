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

const WSP = '5492616135515';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'dormitorio', nombre: 'Dormitorio', img: 'images/p-placard-alba.webp', foto: 'images/amb-dormitorio.webp', alt: 'Dormitorio con cómoda baja blanca de seis cajones y tapa de roble', bajada: 'Placards, cómodas, mesas de luz y zapateros en blanco, roble o combinados.' },
  { id: 'living', nombre: 'Living', img: 'images/p-rack-lago.webp', foto: 'images/amb-living.webp', alt: 'Living con panel de roble para la tele, estantes flotantes y bajo blanco', bajada: 'Racks y paneles para la tele, bibliotecas y estantes para ordenar el living.' },
  { id: 'estudio', nombre: 'Estudio', img: 'images/p-escritorio-nexo.webp', foto: 'images/escritorio-nexo.webp', alt: 'Escritorio de roble con cajonera blanca junto a una ventana', bajada: 'Escritorios, cajoneras y bibliotecas para trabajar o estudiar en casa.' },
  { id: 'bano', nombre: 'Baño', img: 'images/p-vanitory-ola.webp', foto: 'images/vanitory-ola.webp', alt: 'Vanitory suspendido de roble con bacha blanca en un baño claro', bajada: 'Vanitorys suspendidos o de pie y columnas para guardar todo en el baño.' },
  { id: 'cocina', nombre: 'Cocina y lavadero', img: 'images/p-cocina-andes.webp', foto: 'images/amb-cocina.webp', alt: 'Cocina con alacenas blancas y bajo mesada de cajones en madera', bajada: 'Bajo mesadas, alacenas y columnas de lavadero. La cocina completa la hacemos a medida.' },
];
const TIPOS = {
  placares: 'Placards',
  comodas: 'Cómodas y cajoneras',
  'mesas-luz': 'Mesas de luz',
  zapateros: 'Zapateros',
  racks: 'Racks y paneles de TV',
  bibliotecas: 'Bibliotecas y estantes',
  escritorios: 'Escritorios',
  bano: 'Vanitorys y columnas',
  cocina: 'Bajo mesadas y alacenas',
  lavadero: 'Muebles de lavadero',
};
const COLORES = {
  'blanco-roble': 'Blanco y roble',
  blanco: 'Blanco',
  roble: 'Roble',
  grafito: 'Grafito',
};
const ANCHOS = {
  hasta60: { nombre: 'Hasta 60 cm', max: 60 },
  '61a120': { nombre: 'De 61 a 120 cm', min: 61, max: 120 },
  mas120: { nombre: 'Más de 120 cm', min: 121 },
};
const RANGOS = {
  hasta150: { nombre: 'Hasta $150.000', max: 150000 },
  '150a300': { nombre: '$150.000 a $300.000', min: 150001, max: 300000 },
  mas300: { nombre: 'Más de $300.000', min: 300001 },
};
const ORDENES = { destacados: 'Más pedidos', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', angosto: 'Más angostos primero', nombre: 'Nombre (A-Z)' };
const MEDIDOR_TIPOS = [
  { id: '', nombre: 'Cualquier mueble', frase: 'un mueble' },
  { id: 'placares', nombre: 'Placard', frase: 'un placard' },
  { id: 'racks', nombre: 'Rack o panel de TV', frase: 'un rack o panel de TV' },
  { id: 'escritorios', nombre: 'Escritorio', frase: 'un escritorio' },
  { id: 'bibliotecas', nombre: 'Biblioteca', frase: 'una biblioteca o estante' },
  { id: 'comodas', nombre: 'Cómoda', frase: 'una cómoda o cajonera' },
  { id: 'bano', nombre: 'Vanitory', frase: 'un vanitory o columna de baño' },
  { id: 'cocina', nombre: 'Bajo mesada', frase: 'un bajo mesada' },
];

const PRODUCTOS = [
  { id: 'rack-lago', nombre: 'Rack Lago', linea: 'Rack para TV con 2 puertas', tipo: 'racks', cats: ['living'], rango: 1,
    medidas: [{ a: 140, p: 40, h: 45, precio: 230000 }, { a: 160, p: 40, h: 45, precio: 255000 }, { a: 180, p: 40, h: 45, precio: 285000 }],
    colores: ['blanco-roble', 'blanco', 'roble', 'grafito'], incluye: '2 puertas y un hueco central',
    img: 'images/p-rack-lago.webp', alt: 'Rack bajo blanco con dos puertas de roble y un hueco central con un canasto, en un living claro',
    desc: 'Rack bajo con dos puertas de roble a los costados y un hueco al medio para el decodificador o un canasto.', tags: ['mueble tv', 'tele', 'bajo'] },
  { id: 'placard-alba', nombre: 'Placard Alba', linea: 'Placard de 3 puertas', tipo: 'placares', cats: ['dormitorio'], rango: 2,
    medidas: [{ a: 120, p: 55, h: 200, precio: 690000 }, { a: 150, p: 55, h: 200, precio: 790000 }, { a: 180, p: 55, h: 200, precio: 890000 }],
    colores: ['blanco-roble', 'blanco', 'roble', 'grafito'], incluye: 'barral para colgar, 2 estantes y tiradores de roble',
    img: 'images/p-placard-alba.webp', alt: 'Placard de tres puertas blancas con tiradores largos de roble y lateral de roble, en un dormitorio luminoso',
    desc: 'Tres puertas batientes en blanco con tiradores largos de roble y laterales del mismo tono. Por dentro lleva barral y estantes.', tags: ['ropero', 'guardarropa', 'tres puertas', 'placar'] },
  { id: 'escritorio-nexo', nombre: 'Escritorio Nexo', linea: 'Escritorio con cajonera', tipo: 'escritorios', cats: ['estudio'], rango: 3,
    medidas: [{ a: 100, p: 55, h: 75, precio: 185000 }, { a: 120, p: 60, h: 75, precio: 215000 }, { a: 140, p: 60, h: 75, precio: 245000 }],
    colores: ['blanco-roble', 'blanco', 'roble', 'grafito'], incluye: 'cajonera de 3 cajones',
    img: 'images/p-escritorio-nexo.webp', alt: 'Escritorio con tapa de roble y cajonera blanca de tres cajones al costado, junto a una ventana',
    desc: 'Tapa de roble con cajonera blanca de tres cajones a un costado. Hay lugar para la computadora y para estudiar cómodo.', tags: ['home office', 'computadora', 'oficina', 'mesa'] },
  { id: 'comoda-brisa', nombre: 'Cómoda Brisa', linea: 'Cómoda de 3 cajones', tipo: 'comodas', cats: ['dormitorio'], rango: 4,
    medidas: [{ a: 80, p: 45, h: 80, precio: 240000 }, { a: 100, p: 45, h: 80, precio: 275000 }],
    colores: ['blanco-roble', 'blanco', 'roble'], incluye: '3 cajones con correderas metálicas',
    img: 'images/p-comoda-brisa.webp', alt: 'Cómoda blanca de tres cajones con tapa de roble y tiradores negros, junto a una cama',
    desc: 'Tres cajones amplios con tiradores negros y tapa de roble. Entra al lado de la cama o debajo de la tele.', tags: ['cajonera', 'cajones'] },
  { id: 'panel-sierra', nombre: 'Panel TV Sierra', linea: 'Panel para TV con estantes', tipo: 'racks', cats: ['living'], rango: 5, nuevo: true,
    medidas: [{ a: 180, p: 35, h: 200, precio: 420000 }, { a: 220, p: 35, h: 200, precio: 490000 }],
    colores: ['roble', 'blanco-roble'], incluye: 'panel, 3 estantes flotantes y bajo con puertas',
    img: 'images/p-panel-sierra.webp', alt: 'Panel de roble con la tele colgada, estantes flotantes iluminados y un bajo blanco con puertas',
    desc: 'Panel de roble para colgar la tele y esconder los cables, con estantes flotantes al costado y un bajo blanco con puertas.', tags: ['tele', 'tv', 'estantes', 'cables', 'modular'] },
  { id: 'vanitory-ola', nombre: 'Vanitory Ola', linea: 'Vanitory suspendido de 2 cajones', tipo: 'bano', cats: ['bano'], rango: 6,
    medidas: [{ a: 60, p: 46, h: 50, precio: 210000 }, { a: 80, p: 46, h: 50, precio: 245000 }],
    colores: ['roble', 'blanco', 'grafito'], incluye: '2 cajones (sin bacha ni grifería)',
    img: 'images/p-vanitory-ola.webp', alt: 'Vanitory suspendido de dos cajones de roble con bacha blanca, en un baño de azulejos claros',
    desc: 'Mueble suspendido de dos cajones en roble: deja el piso libre y se limpia fácil. Se vende sin bacha ni grifería.', tags: ['baño', 'bacha', 'lavatorio', 'colgante'] },
  { id: 'biblioteca-faro', nombre: 'Biblioteca Faro', linea: 'Biblioteca de 5 estantes', tipo: 'bibliotecas', cats: ['living', 'estudio'], rango: 7,
    medidas: [{ a: 60, p: 30, h: 180, precio: 165000 }, { a: 80, p: 30, h: 180, precio: 195000 }],
    colores: ['blanco-roble', 'blanco', 'roble'], incluye: '5 estantes',
    img: 'images/p-biblioteca-faro.webp', alt: 'Biblioteca abierta de cinco estantes blancos con marco de roble, con libros y plantas',
    desc: 'Cinco estantes abiertos con marco de roble. Sirve para libros o plantas, o como separador de ambientes.', tags: ['estanteria', 'libros', 'repisa'] },
  { id: 'mesa-luz-nido', nombre: 'Mesa de luz Nido', linea: 'Mesa de luz con cajón', tipo: 'mesas-luz', cats: ['dormitorio'], rango: 8, descuento: 10,
    medidas: [{ a: 45, p: 40, h: 50, precio: 89000 }, { a: 50, p: 40, h: 55, precio: 98000 }],
    colores: ['blanco-roble', 'blanco', 'roble', 'grafito'], incluye: '1 cajón y un hueco abierto',
    img: 'images/p-mesa-luz-nido.webp', alt: 'Mesa de luz blanca con un cajón de frente roble y un hueco abierto abajo, al lado de la cama',
    desc: 'Un cajón con frente de roble y un hueco abierto abajo para libros o un canasto. Se vende por unidad.', tags: ['mesita', 'velador', 'dormitorio'] },
  { id: 'placard-duna', nombre: 'Placard Duna', linea: 'Placard de 2 puertas corredizas', tipo: 'placares', cats: ['dormitorio'], rango: 9, nuevo: true,
    medidas: [{ a: 160, p: 60, h: 220, precio: 820000 }, { a: 200, p: 60, h: 220, precio: 960000 }],
    colores: ['blanco-roble', 'blanco', 'grafito'], incluye: 'altillo, barral y estantes',
    img: 'images/p-placard-duna.webp', alt: 'Placard de dos puertas corredizas blancas con marco de roble y altillo arriba',
    desc: 'Dos puertas corredizas que no ocupan lugar al abrir, con marco de roble y altillo arriba para lo que usás menos.', tags: ['corredizo', 'ropero', 'altillo', 'placar'] },
  { id: 'rack-delta', nombre: 'Rack Delta', linea: 'Rack largo con puertas y estantes', tipo: 'racks', cats: ['living'], rango: 10,
    medidas: [{ a: 160, p: 40, h: 50, precio: 260000 }, { a: 200, p: 40, h: 50, precio: 305000 }],
    colores: ['blanco-roble', 'blanco', 'grafito'], incluye: '3 puertas y 4 estantes abiertos',
    img: 'images/p-rack-delta.webp', alt: 'Rack largo con tapa de roble, puertas blancas y estantes abiertos debajo de una tele',
    desc: 'Tapa de roble, puertas blancas y estantes abiertos a los costados. Ancho, para la tele y el equipo de sonido.', tags: ['mueble tv', 'tele', 'largo'] },
  { id: 'cocina-andes', nombre: 'Bajo mesada y alacena Andes', linea: 'Módulo de cocina', tipo: 'cocina', cats: ['cocina'], rango: 11,
    medidas: [{ a: 120, p: 60, h: 86, precio: 480000 }, { a: 160, p: 60, h: 86, precio: 610000 }, { a: 200, p: 60, h: 86, precio: 740000 }],
    colores: ['blanco-roble', 'blanco', 'roble', 'grafito'], incluye: 'bajo mesada de cajones y alacena de 70 cm de alto (sin mesada ni bacha)',
    img: 'images/p-cocina-andes.webp', alt: 'Cocina con alacenas blancas brillantes arriba y bajo mesada de cajones en madera, junto a una ventana',
    desc: 'Bajo mesada de cajones y alacena del mismo ancho, para armar o renovar una cocina recta. La mesada y la bacha van aparte.', tags: ['cocina', 'alacena', 'bajo mesada', 'modulo'] },
  { id: 'comoda-lumen', nombre: 'Cómoda Lumen', linea: 'Cómoda baja de 6 cajones', tipo: 'comodas', cats: ['dormitorio'], rango: 12,
    medidas: [{ a: 120, p: 45, h: 75, precio: 330000 }, { a: 160, p: 45, h: 75, precio: 395000 }],
    colores: ['blanco-roble', 'blanco'], incluye: '6 cajones con correderas metálicas',
    img: 'images/p-comoda-lumen.webp', alt: 'Cómoda baja blanca de seis cajones con tapa de roble contra una pared de ladrillo blanco',
    desc: 'Seis cajones en dos columnas y tapa de roble: mucho guardado a baja altura, ideal debajo de una ventana.', tags: ['cajonera', 'baja', 'larga'] },
  { id: 'cajonera-pampa', nombre: 'Cajonera Pampa', linea: 'Cajonera con ruedas', tipo: 'comodas', cats: ['estudio'], rango: 13,
    medidas: [{ a: 40, p: 50, h: 60, precio: 110000 }],
    colores: ['roble', 'blanco', 'grafito'], incluye: '3 cajones y 4 ruedas',
    img: 'images/p-cajonera-pampa.webp', alt: 'Cajonera de roble de tres cajones con ruedas, sobre un piso claro',
    desc: 'Tres cajones con ruedas que entran debajo del escritorio y se mueven a donde los necesites.', tags: ['oficina', 'ruedas', 'archivo'] },
  { id: 'zapatero-ancla', nombre: 'Zapatero Ancla', linea: 'Zapatero alto de 8 estantes', tipo: 'zapateros', cats: ['dormitorio'], rango: 14,
    medidas: [{ a: 40, p: 35, h: 180, precio: 135000 }, { a: 60, p: 35, h: 180, precio: 165000 }],
    colores: ['roble', 'blanco'], incluye: '8 estantes',
    img: 'images/p-zapatero-ancla.webp', alt: 'Zapatero alto de estantes de madera con zapatillas y sandalias, dentro de un placard blanco',
    desc: 'Estantes a la altura justa para zapatillas, zapatos y sandalias. Va suelto o dentro de un placard.', tags: ['zapatos', 'calzado', 'vestidor'] },
  { id: 'estante-mosaico', nombre: 'Estante Mosaico', linea: 'Estante flotante de cubos', tipo: 'bibliotecas', cats: ['living'], rango: 15,
    medidas: [{ a: 120, p: 25, h: 60, precio: 98000 }, { a: 160, p: 25, h: 60, precio: 125000 }],
    colores: ['blanco', 'roble'], incluye: 'herrajes ocultos para colgar',
    img: 'images/p-estante-mosaico.webp', alt: 'Estante flotante blanco de cubos con objetos de decoración negros, sobre una pared blanca',
    desc: 'Cubos que se cuelgan de la pared sin soportes a la vista. Arman una repisa liviana para decorar.', tags: ['repisa', 'cubos', 'pared', 'flotante'] },
  { id: 'vanitory-mar', nombre: 'Vanitory Mar', linea: 'Vanitory de pie con cajonera', tipo: 'bano', cats: ['bano'], rango: 16,
    medidas: [{ a: 80, p: 50, h: 85, precio: 255000 }, { a: 100, p: 50, h: 85, precio: 290000 }],
    colores: ['blanco', 'blanco-roble'], incluye: '1 puerta y 2 cajones (sin mesada, bacha ni grifería)',
    img: 'images/p-vanitory-mar.webp', alt: 'Vanitory de pie blanco con cajones y puertas debajo de una bacha rectangular',
    desc: 'Vanitory de pie con puertas y cajonera al costado para ordenar todo lo del baño. Sin mesada, bacha ni grifería.', tags: ['baño', 'lavatorio', 'de pie'] },
  { id: 'columna-roca', nombre: 'Columna Roca', linea: 'Columna alta para baño', tipo: 'bano', cats: ['bano'], rango: 17,
    medidas: [{ a: 35, p: 30, h: 160, precio: 150000 }],
    colores: ['roble', 'blanco'], incluye: '2 puertas y 4 estantes',
    img: 'images/p-columna-roca.webp', alt: 'Columna alta de baño de dos puertas en roble grisáceo, colgada en una pared de azulejos blancos',
    desc: 'Columna alta de dos puertas para toallas y productos. Se cuelga de la pared y ocupa apenas 35 cm.', tags: ['baño', 'toallero', 'alto'] },
  { id: 'lavadero-torre', nombre: 'Columna Torre', linea: 'Columna alta para lavadero', tipo: 'lavadero', cats: ['cocina'], rango: 18,
    medidas: [{ a: 60, p: 60, h: 200, precio: 285000 }, { a: 80, p: 60, h: 200, precio: 325000 }],
    colores: ['blanco', 'blanco-roble'], incluye: '2 puertas, estantes y lugar para escobas',
    img: 'images/p-lavadero-torre.webp', alt: 'Columna alta blanca de dos puertas en un lavadero, al lado del lavarropas',
    desc: 'Columna alta de dos puertas para escobas, productos de limpieza y todo lo del lavadero.', tags: ['escobero', 'lavadero', 'limpieza'] },
  { id: 'borrador-alacena', nombre: 'Alacena (borrador)', linea: '-', tipo: 'cocina', cats: ['cocina'], rango: 0, visible: false,
    medidas: [{ a: 80, p: 35, h: 70, precio: 1 }], colores: ['blanco'], incluye: '', img: 'images/p-cocina-andes.webp', alt: '', desc: '', tags: [] },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  p.medidas.sort((x, y) => x.a - y.a);
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioDe = (p, m) => (p.descuento > 0 ? redondear(m.precio * (1 - p.descuento / 100)) : m.precio);
const precioDesde = p => Math.min(...p.medidas.map(m => precioDe(p, m)));
const medidaDe = (p, a) => p.medidas.find(m => m.a === Number(a)) || p.medidas[0];
const medidaTxt = m => `${m.a} × ${m.p} × ${m.h} cm`;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const tipoMedidor = id => MEDIDOR_TIPOS.find(t => t.id === id) || MEDIDOR_TIPOS[0];

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), tipos = lista(f.tipos), colores = lista(f.colores), excluir = lista(f.excluir);
    if (cat.length && !cat.some(c => p.cats.includes(c))) return false;
    if (tipos.length && !tipos.includes(p.tipo)) return false;
    if (colores.length && !colores.some(c => p.colores.includes(c))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !(p.rango > 0 && p.rango <= 8)) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.anchoMin != null || f.anchoMax != null) {
      const min = f.anchoMin ?? 0, max = f.anchoMax ?? Infinity;
      if (!p.medidas.some(m => m.a >= min && m.a <= max)) return false;
    }
    if (f.entra != null && !p.medidas.some(m => m.a <= f.entra)) return false;
    if (f.precioMin != null && precioDesde(p) < f.precioMin) return false;
    if (f.precioMax != null && precioDesde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'angosto': return (a, b) => a.medidas[0].a - b.medidas[0].a || desempate(a, b);
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
      p.nombre, p.linea, TIPOS[p.tipo], ...p.cats.map(c => catDe(c)?.nombre), ...p.colores.map(c => COLORES[c]),
      ...p.medidas.map(m => `${m.a} cm ${m.a}cm`), p.desc, p.incluye, ...(p.tags || []), p.descuento > 0 ? 'oferta descuento' : '',
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
const modelos = n => `${n} ${n === 1 ? 'modelo' : 'modelos'}`;

const Cart = {
  KEY: 'liosan_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  clave: i => `${i.id}|${i.med}|${i.col}`,
  add(producto, med, col, qty = 1) {
    const n = Math.min(Math.max(1, qty), 20);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.med === med && i.col === col);
    if (existing) existing.qty = Math.min(20, existing.qty + n);
    else items.push({ id: producto.id, med, col, qty: n });
    this.save(items);
    return n;
  },
  setQty(clave, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i) === clave);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20));
    this.save(items);
  },
  remove(clave) { this.save(this.get().filter(i => this.clave(i) !== clave)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, medidaDe(p, i.med)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  flechaIzq: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
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

function precioHTML(p, m, clase = 'precio') {
  return `<p class="${clase}" data-precio><b>${formatearPrecio(precioDe(p, m))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(m.precio)}</s>` : ''}</p>`;
}
const cotaHTML = (a, clase = '') => `<div class="cota${clase ? ' ' + clase : ''}" aria-hidden="true"><span class="cota__linea"></span><span class="cota__txt" data-cota-txt>${a} cm</span></div>`;
const stepperHTML = (clase = '') => `<div class="stepper${clase ? ' ' + clase : ''}" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const chipsMedHTML = (p, sel, attr = 'data-med') => (p.medidas.length > 1
  ? `<div class="chips-med" role="group" aria-label="Ancho de ${esc(p.nombre)}">${p.medidas.map(m => `<button type="button" class="chip-med" ${attr}="${m.a}" aria-pressed="${m.a === sel}" aria-label="${m.a} centímetros de ancho">${m.a}</button>`).join('')}</div>`
  : '<p class="chips-med__unica">Medida única</p>');

function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (p.nuevo) return '<span class="etiqueta">Nuevo</span>';
  return '';
}

function cardHTML(p, { anim = true, variante = 'subir' } = {}) {
  const m = p.medidas[0];
  const estado = !anim ? '' : variante === 'der' ? ' data-animate="der" style="opacity:0;transform:translateX(48px)"' : ' data-animate="subir" style="opacity:0;transform:translateY(36px)"';
  return `<article class="pcard" data-id="${esc(p.id)}" data-sel="${m.a}"${estado}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200"></a>
    ${badgeHTML(p)}
    ${cotaHTML(m.a, 'cota--clara pcard__cota')}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__linea">${esc(p.linea)}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__medida" data-medida-txt>${medidaTxt(m)}</p>
    ${chipsMedHTML(p, m.a)}
    ${precioHTML(p, m)}
    <div class="prod-actions">${stepperHTML()}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button></div>
  </div>
</article>`;
}

function miniHTML(p, m, detalle) {
  return `<li><button type="button" class="mini" data-quick="${esc(p.id)}" data-quick-med="${m.a}"><img src="${esc(p.img)}" alt="" width="96" height="120"><span><b>${esc(p.nombre)}</b><small>${esc(detalle)}</small></span><span class="mini__precio">${formatearPrecio(precioDe(p, m))}</span></button></li>`;
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
    lista.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="52" height="52"><span><b>${esc(c.nombre)}</b><small>${modelos(Tienda.contar({ cat: c.id }))}</small></span>${ICO.flecha}</a></li>`).join('');
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
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = modelos(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initFicha() {
  document.querySelectorAll('[data-ficha]').forEach(b => {
    const p = getProducto(b.dataset.quick);
    if (!p) { b.remove(); return; }
    const precio = b.querySelector('[data-ficha-precio]');
    if (precio) precio.textContent = `Desde ${formatearPrecio(precioDesde(p))}`;
  });
}

function initRailProductos() {
  const vp = document.querySelector('[data-rail-productos]');
  if (!vp) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  vp.innerHTML = items.map(p => `<div class="rail__item">${cardHTML(p, { variante: 'der' })}</div>`).join('');
  initRail(vp);
}

function initRail(vp) {
  initRailDrag(vp);
  const wrap = vp.closest('section');
  const prev = wrap?.querySelector('[data-rail-prev]');
  const next = wrap?.querySelector('[data-rail-next]');
  const paso = () => ([...vp.children].find(el => el.offsetParent)?.getBoundingClientRect().width || 300) + 16;
  const sync = () => {
    const ini = parseFloat(window.getComputedStyle(vp).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= ini + 2;
    if (next) next.disabled = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  vp.addEventListener('rail:sync', sync);
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
      const inicio = parseFloat(window.getComputedStyle(vp).paddingInlineStart) || 0;
      const items = [...vp.children].filter(it => it.offsetParent);
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

function initAmbientes() {
  const root = document.querySelector('[data-amb-tabs]');
  if (!root) return;
  const lista = root.querySelector('[data-amb-lista]');
  const panel = root.querySelector('[data-amb-panel]');
  if (!lista || !panel) return;
  const foto = panel.querySelector('[data-amb-foto]');
  const img = foto?.querySelector('img');
  const etiqueta = panel.querySelector('[data-amb-etiqueta]');
  const tit = panel.querySelector('[data-amb-tit]');
  const bajada = panel.querySelector('[data-amb-bajada]');
  const filas = panel.querySelector('[data-amb-filas]');
  const pie = panel.querySelector('[data-amb-pie]');
  const ver = panel.querySelector('[data-amb-ver]');
  lista.innerHTML = CATEGORIAS.map((c, i) => `<button type="button" class="chip" role="tab" id="ambTab-${c.id}" aria-controls="ambPanel" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''} data-amb="${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  const tabs = [...lista.querySelectorAll('[data-amb]')];
  const pintar = (id, primera = false) => {
    const c = catDe(id) || CATEGORIAS[0];
    tabs.forEach(t => {
      const activo = t.dataset.amb === c.id;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `ambTab-${c.id}`);
    const total = Tienda.contar({ cat: c.id });
    const { items } = Tienda.consultar({ filtros: { cat: c.id }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    const cambiar = () => {
      if (img) { img.src = c.foto; img.alt = c.alt; }
      if (etiqueta) etiqueta.textContent = c.nombre;
      foto?.classList.remove('cambiando');
    };
    if (primera || reduceMotion) cambiar();
    else { foto?.classList.add('cambiando'); setTimeout(cambiar, 200); }
    if (tit) tit.textContent = c.nombre;
    if (bajada) bajada.textContent = c.bajada;
    if (filas) {
      filas.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(24px)"><button type="button" class="amb-fila" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="128" height="160"><span><b>${esc(p.nombre)}</b><small>${esc(p.linea)} · ${p.medidas.length > 1 ? `${p.medidas.length} anchos, de ${p.medidas[0].a} a ${p.medidas[p.medidas.length - 1].a} cm` : `${p.medidas[0].a} cm de ancho`}</small></span><span class="amb-fila__precio"><small>desde</small><br>${formatearPrecio(precioDesde(p))}</span></button></li>`).join('');
      if (!primera) revelarNuevos(filas);
    }
    if (pie) pie.textContent = `${modelos(total)} para ${c.nombre.toLowerCase()}, en ${c.id === 'cocina' ? 'varios anchos' : 'distintos anchos y colores'}.`;
    if (ver) { ver.href = `${URL_CATALOGO}?cat=${c.id}`; ver.querySelector('span').textContent = `Ver ${total === 1 ? 'el modelo' : `los ${total}`}`; }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  lista.addEventListener('click', e => { const t = e.target.closest('[data-amb]'); if (t) pintar(t.dataset.amb); });
  lista.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    sig.focus();
    pintar(sig.dataset.amb);
  });
  pintar(CATEGORIAS[0].id, true);
}

const GALERIA = [
  { img: 'images/cocina-l.webp', w: 1600, h: 900, forma: 'ancha', amb: 'cocina', titulo: 'Cocina en L con alacenas blancas', txt: 'Alacenas blancas hasta el techo y bajo mesada en roble con tiradores negros, hecha a la medida de la pared.', alt: 'Cocina en L con alacenas blancas, bajo mesada de roble con tiradores negros y horno empotrado' },
  { img: 'images/placard-alba-alto.webp', w: 900, h: 1600, forma: 'alta', amb: 'dormitorio', titulo: 'Placard de tres puertas', txt: 'Puertas blancas con tiradores largos de roble y laterales del mismo tono, de piso a techo.', alt: 'Placard alto de tres puertas blancas con tiradores de roble en un dormitorio' },
  { img: 'images/g-cocina-roble.webp', w: 1068, h: 1068, amb: 'cocina', titulo: 'Cocina con frentes de roble', txt: 'Columna de hornos en gris oscuro, alacenas blancas y un nicho con frentes de roble iluminado.', alt: 'Cocina con columna gris oscura, alacenas blancas y muebles de roble con luz cálida' },
  { img: 'images/g-bano-suspendido.webp', w: 1200, h: 1200, amb: 'bano', titulo: 'Baño con muebles suspendidos', txt: 'Vanitory blanco de dos cajones, botiquín de tres puertas y columna alta, todo colgado de la pared.', alt: 'Baño con vanitory blanco suspendido, botiquín con espejo y columna alta blanca' },
  { img: 'images/g-living-colgante.webp', w: 1068, h: 1068, amb: 'living', titulo: 'Living con módulos colgantes', txt: 'Módulos blancos colgados, panel para la tele y un bajo largo que recorre toda la pared.', alt: 'Living con módulos blancos colgados de la pared, panel para la tele y mueble bajo largo' },
  { img: 'images/rack-lago.webp', w: 1200, h: 1200, amb: 'living', titulo: 'Rack de TV blanco y roble', txt: 'Rack bajo con puertas de roble y un hueco central para el decodificador.', alt: 'Rack bajo blanco con dos puertas de roble en un living luminoso' },
  { img: 'images/detalle-cajon.webp', w: 1200, h: 1200, amb: 'detalles', titulo: 'Cajón con correderas metálicas', txt: 'Así se ve un cajón por dentro: correderas metálicas, cantos prolijos y la tapa en roble.', alt: 'Detalle de un cajón blanco abierto con correderas metálicas bajo una tapa de roble' },
];
const GAL_FILTROS = [
  { id: '', nombre: 'Todos' }, { id: 'cocina', nombre: 'Cocinas' }, { id: 'dormitorio', nombre: 'Dormitorios' },
  { id: 'living', nombre: 'Living' }, { id: 'bano', nombre: 'Baños' }, { id: 'detalles', nombre: 'Detalles' },
];

function galeriaBotonHTML(g, i) {
  return `<button type="button" class="gfoto" data-visor="${i}" aria-label="Ver la foto: ${esc(g.titulo)}">
    <span class="gfoto__foto"><img src="${esc(g.img)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}"></span>
    <span class="gfoto__txt"><b>${esc(g.titulo)}</b><small>${esc(GAL_FILTROS.find(f => f.id === g.amb)?.nombre || '')}</small></span>
  </button>`;
}

function initGaleria() {
  const bento = document.querySelector('[data-galeria-bento]');
  if (bento) {
    bento.innerHTML = GALERIA.map((g, i) => `<div class="bento__item${g.forma ? ' bento__item--' + g.forma : ''}" data-animate="mascara" style="clip-path:inset(100% 0 0 0)">${galeriaBotonHTML(g, i)}</div>`).join('');
  }
  const rail = document.querySelector('[data-galeria-rail]');
  if (rail) {
    rail.innerHTML = GALERIA.map((g, i) => `<div class="rail__foto${g.forma === 'alta' ? ' rail__foto--alta' : ''}" data-animate="der" style="opacity:0;transform:translateX(48px)">${galeriaBotonHTML(g, i)}</div>`).join('');
    initRail(rail);
  }
  const visor = document.getElementById('visor');
  if (!visor || !(bento || rail)) return;
  const img = visor.querySelector('[data-visor-img]');
  const tit = visor.querySelector('[data-visor-tit]');
  const txt = visor.querySelector('[data-visor-txt]');
  const num = visor.querySelector('[data-visor-num]');
  const wsp = visor.querySelector('[data-visor-wsp]');
  let pos = 0;
  let foco = null;
  const pintar = p => {
    pos = (p + GALERIA.length) % GALERIA.length;
    const g = GALERIA[pos];
    img.src = g.img; img.alt = g.alt; img.width = g.w; img.height = g.h;
    tit.textContent = g.titulo;
    txt.textContent = g.txt;
    num.textContent = `${pos + 1} / ${GALERIA.length}`;
    if (wsp) wsp.href = wspLink(`Hola LIO.SAN! Vi en la galería «${g.titulo}» y quiero algo así para mi casa. ¿Me pasan presupuesto?`);
  };
  const abrir = (i, origen) => {
    foco = origen || document.activeElement;
    pintar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('.visor__close')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (visor.hidden) return;
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { visor.hidden = true; }, 320);
    if (foco && document.contains(foco)) foco.focus({ preventScroll: true });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) { e.preventDefault(); abrir(parseInt(b.dataset.visor, 10) || 0, b); }
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) { cerrar(); return; }
    if (e.target.closest('[data-visor-prev]')) { pintar(pos - 1); return; }
    if (e.target.closest('[data-visor-next]')) pintar(pos + 1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') { pintar(pos - 1); return; }
    if (e.key === 'ArrowRight') { pintar(pos + 1); return; }
    atraparFoco(visor.querySelector('.visor__panel'), e);
  });
}

function initMedidor() {
  const box = document.querySelector('[data-medidor]');
  if (!box) return;
  const tiposBox = box.querySelector('[data-med-tipos]');
  const rango = box.querySelector('[data-med-rango]');
  const num = box.querySelector('[data-med-num]');
  const cota = box.querySelector('[data-med-cota]');
  const mueble = box.querySelector('[data-med-mueble]');
  const sobra = box.querySelector('[data-med-sobra]');
  const res = box.querySelector('[data-med-res]');
  const ver = box.querySelector('[data-med-ver]');
  const wsp = box.querySelector('[data-med-wsp]');
  let tipo = '';
  let ancho = 150;
  if (tiposBox) tiposBox.innerHTML = MEDIDOR_TIPOS.map(t => `<button type="button" class="chip" data-med-tipo="${t.id}" aria-pressed="${t.id === tipo}">${esc(t.nombre)}</button>`).join('');
  const pintar = () => {
    const filtros = { entra: ancho };
    if (tipo) filtros.tipos = [tipo];
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: Tienda.TOPE });
    items.forEach(cachear);
    const total = Tienda.contar(filtros);
    const ajustes = items.map(p => {
      const m = p.medidas.filter(x => x.a <= ancho).sort((x, y) => y.a - x.a)[0];
      return { p, m, resto: ancho - m.a };
    }).sort((x, y) => x.resto - y.resto || (x.p.rango || 999) - (y.p.rango || 999)).slice(0, 3);
    const t = tipoMedidor(tipo);
    if (cota) cota.textContent = `Tu espacio: ${ancho} cm`;
    const mejor = ajustes[0];
    if (mueble) {
      mueble.classList.toggle('vacio', !mejor);
      mueble.style.width = mejor ? `${Math.max(18, (mejor.m.a / ancho) * 100)}%` : '100%';
      mueble.textContent = mejor ? `${mejor.p.nombre} · ${mejor.m.a} cm` : 'Ningún modelo estándar entra justo';
    }
    if (sobra) {
      sobra.innerHTML = !mejor
        ? `Para ${esc(t.frase)} de <b>${ancho} cm</b> no hay modelo estándar, pero te lo hacemos a medida.`
        : mejor.resto === 0
          ? `El <b>${esc(mejor.p.nombre)}</b> de ${mejor.m.a} cm entra <b>justo</b>.`
          : `Entra el <b>${esc(mejor.p.nombre)}</b> de ${mejor.m.a} cm y te sobran <b>${mejor.resto} cm</b>.`;
    }
    if (res) {
      res.innerHTML = ajustes.length
        ? `<ul class="minis">${ajustes.map(({ p, m, resto }) => miniHTML(p, m, `${m.a} cm de ancho · ${resto ? `sobran ${resto} cm` : 'entra justo'}`)).join('')}</ul>`
        : '';
    }
    if (ver) {
      ver.hidden = !total;
      ver.href = `${URL_CATALOGO}?entra=${ancho}${tipo ? `&tipo=${tipo}` : ''}`;
      ver.innerHTML = `${ICO.regla}Ver ${total === 1 ? 'el que entra' : `los ${total} que entran`}`;
    }
    if (wsp) wsp.href = wspLink(`Hola LIO.SAN! Tengo un espacio de ${ancho} cm de ancho para ${t.frase}. ¿Me pasan un presupuesto a medida?`);
  };
  const fijar = v => {
    const n = Math.round(Math.min(300, Math.max(30, Number(v) || 150)));
    ancho = n;
    if (rango && Number(rango.value) !== n) rango.value = String(n);
    if (rango) rango.setAttribute('aria-valuetext', `${n} centímetros`);
    pintar();
  };
  tiposBox?.addEventListener('click', e => {
    const b = e.target.closest('[data-med-tipo]');
    if (!b) return;
    tipo = b.dataset.medTipo;
    tiposBox.querySelectorAll('[data-med-tipo]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar();
  });
  rango?.addEventListener('input', () => { if (num) num.value = rango.value; fijar(rango.value); });
  let t = 0;
  num?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { if (num.value !== '') fijar(num.value); }, 250); });
  num?.addEventListener('change', () => { fijar(num.value); num.value = String(ancho); });
  fijar(ancho);
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 20) : 1;
}
function sumarAlCarrito(p, { med, col, qty = 1, comprar = false } = {}) {
  const m = medidaDe(p, med);
  const color = p.colores.includes(col) ? col : p.colores[0];
  const n = Cart.add(p, m.a, color, qty);
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}«${p.nombre}» de ${m.a} cm al carrito`);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 20;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 20;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function elegirMedidaCard(card, a) {
  const p = getProducto(card.dataset.id);
  if (!p) return;
  const m = medidaDe(p, a);
  card.dataset.sel = m.a;
  card.querySelectorAll('[data-med]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.med) === m.a)));
  const txt = card.querySelector('[data-medida-txt]');
  if (txt) txt.textContent = medidaTxt(m);
  const cota = card.querySelector('[data-cota-txt]');
  if (cota) cota.textContent = `${m.a} cm`;
  const precio = card.querySelector('[data-precio]');
  if (precio) precio.outerHTML = precioHTML(p, m);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const chip = e.target.closest('.pcard [data-med]');
    if (chip) { elegirMedidaCard(chip.closest('.pcard'), chip.dataset.med); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      const card = quick.closest('.pcard');
      abrirQV(quick.dataset.quick, quick, { med: quick.dataset.quickMed || card?.dataset.sel });
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      const card = add.closest('.pcard');
      sumarAlCarrito(p, { med: card?.dataset.sel, col: p.colores[0], qty: leerCantidad(card), comprar: add.hasAttribute('data-comprar') });
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
const qvEstado = { p: null, med: 0, col: '' };
function abrirQV(id, origen, { med, col } = {}) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvEstado.p = p;
  qvEstado.med = medidaDe(p, med).a;
  qvEstado.col = p.colores.includes(col) ? col : p.colores[0];
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
    brand: { '@type': 'Brand', name: 'LIO.SAN' }, material: 'Melamina',
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.medidas.map(m => precioDe(p, m))), offerCount: p.medidas.length, availability: 'https://schema.org/InStock' },
  });
}
function pintarQV(qty = 1) {
  const { p, med, col } = qvEstado;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const m = medidaDe(p, med);
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cats[0], excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const ambientes = p.cats.map(c => catDe(c)?.nombre).filter(Boolean).join(' y ');
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200">${badgeHTML(p)}${cotaHTML(m.a, 'cota--clara')}</div>
    <div class="qv__info">
      <p class="qv__linea">${esc(p.linea)} · ${esc(ambientes)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, m, 'precio qv__precio')}
      <p class="qv__desc">${esc(p.desc)}</p>
      <div><p class="qv__g">Ancho: <b>${m.a} cm</b></p>${chipsMedHTML(p, m.a, 'data-qv-med')}</div>
      <div><p class="qv__g">Color de placa: <b>${esc(COLORES[col])}</b></p><div class="colores" role="group" aria-label="Color de placa">${p.colores.map(c => `<button type="button" class="color-opt" data-qv-col="${c}" aria-pressed="${c === col}"><span class="swatch swatch--${c}"></span>${esc(COLORES[c])}</button>`).join('')}</div><p class="colores__nota">La foto muestra el modelo en ${esc(COLORES[p.colores[0]].toLowerCase())}.</p></div>
      <dl class="qv__ficha"><div><dt>Ancho</dt><dd>${m.a} cm</dd></div><div><dt>Profundidad</dt><dd>${m.p} cm</dd></div><div><dt>Alto</dt><dd>${m.h} cm</dd></div></dl>
      <p class="qv__incluye"><b>Incluye:</b> ${esc(p.incluye)}.</p>
      <div class="qv__acc">
        ${stepperHTML('stepper--grande')}
        <button type="button" class="btn btn--cta" data-qv-add>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola LIO.SAN! Me interesa el ${p.nombre} (${medidaTxt(m)}, ${COLORES[col].toLowerCase()}). ¿Lo pueden hacer en otra medida?`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Necesitás otra medida? Pedilo a medida por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También para ${esc(catDe(p.cats[0])?.nombre.toLowerCase())}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="300"><span>${esc(r.nombre)}</span><b>Desde ${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
  const input = cont.querySelector('.qv__acc [data-stepper] input');
  if (input) input.value = String(qty);
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
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    const medBtn = e.target.closest('[data-qv-med]');
    if (medBtn) { qvEstado.med = Number(medBtn.dataset.qvMed); pintarQV(qty); qv.querySelector(`[data-qv-med="${qvEstado.med}"]`)?.focus(); return; }
    const colBtn = e.target.closest('[data-qv-col]');
    if (colBtn) { qvEstado.col = colBtn.dataset.qvCol; pintarQV(qty); qv.querySelector(`[data-qv-col="${qvEstado.col}"]`)?.focus(); return; }
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    if (comprar) {
      Cart.add(p, qvEstado.med, qvEstado.col, qty);
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, { med: qvEstado.med, col: qvEstado.col, qty });
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
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.regla}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí un modelo, el ancho que te entra y el color de la placa.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver el catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const m = medidaDe(p, i.med);
    const clave = Cart.clave(i);
    return `<li class="linea" data-linea="${esc(clave)}">
      <img src="${esc(p.img)}" alt="" width="140" height="176">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${medidaTxt(m)} · ${esc(COLORES[i.col] || COLORES[p.colores[0]])} · ${formatearPrecio(precioDe(p, m))}${i.qty > 1 ? ' c/u' : ''}</p>
        <div class="linea__acc"><div class="stepper" data-linea-stepper><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= 20 ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, m) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const m = medidaDe(p, i.med); return `- ${i.qty} × ${p.nombre} (${medidaTxt(m)}, ${(COLORES[i.col] || '').toLowerCase()}): ${formatearPrecio(precioDe(p, m) * i.qty)}`; }).join('\n');
  const msg = `Hola LIO.SAN! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi zona para la entrega: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">La entrega se coordina por WhatsApp después de la compra.</p>`;
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
    const clave = linea.dataset.linea;
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(clave);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => Cart.clave(i) === clave);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(clave, nuevo);
      dr.querySelector(`[data-linea="${window.CSS.escape(clave)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]:not(:disabled)`)?.focus({ preventScroll: true });
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const leerEntra = v => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 20 && n <= 600 ? n : null; };
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    tipos: new Set(lista('tipo').filter(c => TIPOS[c])),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    ancho: valido(PARAMS.get('ancho'), ANCHOS),
    entra: leerEntra(PARAMS.get('entra')),
    precio: valido(PARAMS.get('precio'), RANGOS),
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const SETS = { tipo: estado.tipos, color: estado.colores };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');
  const entras = [...document.querySelectorAll('[data-entra-input]')];

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los ambientes')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-tipo-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TIPOS).map(([k, n]) => `<label class="opt" data-opt-tipo="${k}"><input type="checkbox" value="${k}" data-f="tipo"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-tipo="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(COLORES).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="color"><span class="swatch swatch--${k}"></span><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-color="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-ancho-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Cualquier ancho'], ...Object.entries(ANCHOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-ancho" value="${k}" data-filtro="ancho"><span>${esc(n)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.tipos.size && sin !== 'tipo') f.tipos = [...estado.tipos];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    if (estado.ancho && sin !== 'ancho') { const r = ANCHOS[estado.ancho]; if (r.min != null) f.anchoMin = r.min; if (r.max != null) f.anchoMax = r.max; }
    if (estado.entra && sin !== 'entra') f.entra = estado.entra;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.tipos.forEach(v => chips.push(['tipo', v, TIPOS[v]]));
    estado.colores.forEach(v => chips.push(['color', v, `Placa ${COLORES[v].toLowerCase()}`]));
    if (estado.ancho) chips.push(['ancho', '', `Ancho: ${ANCHOS[estado.ancho].nombre.toLowerCase()}`]);
    if (estado.entra) chips.push(['entra', '', `Entra en ${estado.entra} cm`]);
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    entras.forEach(el => { if (document.activeElement !== el) el.value = estado.entra ? String(estado.entra) : ''; });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-tipo]').forEach(el => {
      const k = el.dataset.cuentaFiltroTipo;
      const n = Tienda.contar({ ...filtrosDe('tipo'), tipos: [k] });
      el.textContent = n;
      const opt = el.closest('[data-opt-tipo]');
      if (opt) opt.hidden = n === 0 && !estado.tipos.has(k);
    });
    document.querySelectorAll('[data-cuenta-filtro-color]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('color'), colores: [el.dataset.cuentaFiltroColor] }); });
    const enPanel = estado.tipos.size + estado.colores.size + (estado.ancho ? 1 : 0) + (estado.precio ? 1 : 0)
      + (document.querySelector('#filtros [data-entra-input]') && estado.entra ? 1 : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const tipoUnico = !cat && estado.tipos.size === 1 ? TIPOS[[...estado.tipos][0]] : '';
    const titulo = cat ? cat.nombre : tipoUnico || 'Todos los muebles';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Muebles de melamina estándar en varios anchos. Filtrá por ambiente, tipo de mueble, color de placa o por el ancho que tenés.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !(cat || tipoUnico); miga.textContent = titulo; }
    document.title = `${titulo} — LIO.SAN`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'color', 'ancho', 'entra', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.tipos.size) u.searchParams.set('tipo', [...estado.tipos].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.ancho) u.searchParams.set('ancho', estado.ancho);
    if (estado.entra) u.searchParams.set('entra', String(estado.entra));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
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
    if (estado.entra) {
      res.items.forEach(p => {
        const card = grid.querySelector(`.pcard[data-id="${window.CSS.escape(p.id)}"]`);
        const m = p.medidas.filter(x => x.a <= estado.entra).sort((x, y) => y.a - x.a)[0];
        if (card && m) elegirMedidaCard(card, m.a);
      });
    }
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${modelos(total)}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más modelos para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.ancho = ''; estado.precio = ''; estado.entra = null; estado.q = '';
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
    estado[el.dataset.filtro] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else if (f === 'entra') estado.entra = null;
      else estado[f] = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  let tEntra = 0;
  entras.forEach(el => {
    el.addEventListener('input', () => {
      clearTimeout(tEntra);
      tEntra = setTimeout(() => { estado.entra = el.value === '' ? null : leerEntra(el.value); entras.forEach(o => { if (o !== el) o.value = el.value; }); aplicar(); }, 450);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(tEntra); estado.entra = el.value === '' ? null : leerEntra(el.value); aplicar(); } });
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
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
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
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero__panel', { opacity: 0, duration: 0.8, clearProps: 'opacity' }, 0);
  paso('.regla', { scaleX: 0, duration: 0.9, clearProps: 'transform' }, 0.1);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.12);
  paso('h1', { y: 30, opacity: 0, duration: 1.1 }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.4);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero__sello', { y: 12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  paso('.cota:not(.cota--alto) .cota__linea', { scaleX: 0, duration: 1.2, clearProps: 'transform' }, 0.5);
  paso('.cota--alto .cota__linea', { scaleY: 0, scaleX: 1, duration: 1.2, clearProps: 'transform' }, 0.6);
  paso('.cota__txt', { opacity: 0, duration: 0.8, clearProps: 'opacity' }, 0.9);
  paso('.hero__ficha', { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
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
  initFicha,
  initRailProductos,
  initAmbientes,
  initGaleria,
  initMedidor,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
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
