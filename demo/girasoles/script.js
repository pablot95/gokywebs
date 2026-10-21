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

const WSP = '5492246438968';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'tapices', nombre: 'Tapices', img: 'images/cat-tapices.webp', bajada: 'Tapices, plumas y alas para la pared, en crudo, mostaza y terracota.' },
  { id: 'decoracion', nombre: 'Decoración', img: 'images/cat-decoracion.webp', bajada: 'Espejos, colgantes para macetas, almohadones y textiles para la mesa.' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/cat-accesorios.webp', bajada: 'Llaveros y bolsos tejidos, para llevar un girasol con vos.' },
];
const TIPOS = {
  tapiz: 'Tapices de pared',
  pluma: 'Plumas y alas',
  espejo: 'Espejos',
  colgante: 'Colgantes para macetas',
  almohadon: 'Almohadones',
  mesa: 'Posavasos y caminos',
  deco: 'Objetos decorativos',
  llavero: 'Llaveros',
  bolso: 'Bolsos',
};
const COLORES = {
  crudo: { nombre: 'Crudo', hex: '#EFE6D2' },
  mostaza: { nombre: 'Mostaza', hex: '#C99A2E' },
  terracota: { nombre: 'Terracota', hex: '#B5603A' },
  girasol: { nombre: 'Con girasoles', hex: 'radial-gradient(circle, #5A3A1E 0 28%, #E0B53F 30% 100%)' },
};
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 20000 },
  '20a40': { nombre: '$20.000 a $40.000', min: 20001, max: 40000 },
  mas40: { nombre: 'Más de $40.000', min: 40001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién terminados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const TALLERES = {
  inicial: 'Primeros nudos',
  colgante: 'Colgante para maceta',
  tapiz: 'Tu primer tapiz',
};
const MODALIDADES = { grupal: 'grupal en el taller', particular: 'clase particular' };
const HORARIOS = { manana: 'entre semana a la mañana', tarde: 'entre semana a la tarde', sabado: 'los sábados' };

const GALERIA = [
  { img: 'images/g-tapiz.webp', w: 900, h: 1600, titulo: 'Tapiz Girasol', txt: 'Cordón crudo con un girasol en el centro y borlas mostaza y terracota.', producto: 'tapiz-girasol', alt: 'Tapiz de macramé crudo con un girasol tejido y borlas mostaza y terracota, colgado sobre una pared clara junto a girasoles' },
  { img: 'images/hero-taller.webp', w: 1600, h: 900, titulo: 'Un comedor vestido de macramé', txt: 'Camino de mesa con girasoles y un tapiz chico al fondo, con luz de la tarde.', producto: 'camino-girasoles', alt: 'Comedor luminoso con una mesa larga de madera, un camino de macramé con girasoles y un tapiz chico colgado en la pared del fondo' },
  { img: 'images/p-almohadon-girasoles.webp', w: 1000, h: 1000, titulo: 'Almohadón con cinco girasoles', txt: 'Rombos calados y girasoles tejidos sobre una silla de madera.', producto: 'almohadon-girasoles', alt: 'Almohadón de macramé crudo con rombos y girasoles tejidos sobre una silla de madera' },
  { img: 'images/p-camino-girasoles.webp', w: 1000, h: 1000, titulo: 'Camino de mesa calado', txt: 'Girasoles en el centro y flecos en las dos puntas.', producto: 'camino-girasoles', alt: 'Camino de mesa de macramé crudo con girasoles tejidos sobre una mesa de madera con sillas' },
  { img: 'images/p-espejo-mandala.webp', w: 1000, h: 1000, titulo: 'Espejo mandala', txt: 'Doce girasoles alrededor de un espejo redondo.', producto: 'espejo-mandala', alt: 'Espejo redondo con marco de macramé en forma de mandala y girasoles tejidos' },
  { img: 'images/p-colgante-girasoles.webp', w: 1000, h: 1000, titulo: 'Colgante para un potus', txt: 'Girasoles a lo largo del cordón y una borla al final.', producto: 'colgante-girasoles', alt: 'Colgante de macramé con girasoles tejidos que sostiene una maceta de barro con un potus' },
  { img: 'images/p-posavasos-girasol.webp', w: 1000, h: 1000, titulo: 'Posavasos para el mate', txt: 'Espirales con flores mostaza y terracota en el borde.', producto: 'posavasos-girasol', alt: 'Cuatro posavasos de macramé con flores tejidas sobre una mesa de madera, con un vaso de limonada' },
  { img: 'images/p-llavero-girasol.webp', w: 1000, h: 1000, titulo: 'Llaveros en tres colores', txt: 'Crudo, mostaza y terracota, con su flor tejida.', producto: 'llavero-girasol', alt: 'Tres llaveros de macramé con girasoles y margaritas tejidas sobre una tabla de madera' },
];

const PRODUCTOS = [
  { id: 'tapiz-girasol', nombre: 'Tapiz Girasol de pared', cat: 'tapices', tipo: 'tapiz', colores: ['crudo', 'mostaza', 'terracota', 'girasol'], precio: 68000, stock: 1, medida: '60 × 90 cm, con varilla de madera', rango: 1, alta: 22,
    img: 'images/p-tapiz-girasol.webp', alt: 'Tapiz de macramé crudo con un girasol tejido en el centro y borlas mostaza y terracota, colgado de una varilla de madera',
    corto: 'La pieza del nombre: un girasol tejido en el centro.',
    desc: 'Tapiz grande en cordón de algodón crudo, con un girasol tejido en el centro y borlas en mostaza y terracota. Cuelga de una varilla de madera y llena una pared entera.', tags: ['girasol', 'grande', 'living', 'borlas', 'pared'] },
  { id: 'colgante-girasoles', nombre: 'Colgante para maceta con girasoles', cat: 'decoracion', tipo: 'colgante', colores: ['crudo', 'girasol'], precio: 27000, stock: 3, medida: '90 cm de largo, para macetas de 15 a 18 cm', rango: 2, alta: 21,
    img: 'images/p-colgante-girasoles.webp', alt: 'Colgante de macramé crudo con girasoles tejidos que sostiene una maceta de barro con un potus',
    corto: 'Girasoles a lo largo del cordón y una borla al final.',
    desc: 'Cordón crudo con girasoles tejidos a lo largo y una borla al final. Sostiene macetas de 15 a 18 cm; la maceta y la planta no van incluidas.', tags: ['colgante', 'maceta', 'planta', 'potus', 'girasol'] },
  { id: 'espejo-mandala', nombre: 'Espejo mandala con girasoles', cat: 'decoracion', tipo: 'espejo', colores: ['crudo', 'girasol'], precio: 62000, stock: 1, medida: '60 cm de diámetro, espejo de 30 cm', rango: 3, alta: 20,
    img: 'images/p-espejo-mandala.webp', alt: 'Espejo redondo con marco de macramé crudo en forma de mandala y girasoles tejidos alrededor',
    corto: 'Doce girasoles alrededor de un espejo redondo.',
    desc: 'Un mandala de nudos alrededor de un espejo redondo, con doce girasoles tejidos en el borde. Para el recibidor, el living o arriba de una cómoda.', tags: ['espejo', 'mandala', 'redondo', 'girasol', 'recibidor'] },
  { id: 'duo-mostaza', nombre: 'Dúo mostaza: tapiz con rombo y media luna', cat: 'tapices', tipo: 'tapiz', colores: ['crudo', 'mostaza'], precio: 58000, descuento: 10, stock: 1, medida: 'Tapiz de 45 × 90 cm y media luna de 30 cm', rango: 4, alta: 18,
    img: 'images/p-duo-mostaza.webp', alt: 'Dos piezas de macramé sobre una pared verde: un tapiz largo de flecos crudos con un rombo mostaza y una media luna tejida en crudo y mostaza',
    corto: 'Un tapiz largo y una media luna que hacen juego.',
    desc: 'Un tapiz largo de flecos con un rombo mostaza y una media luna haciendo juego. Se cuelgan juntos o cada uno en su lugar.', tags: ['set', 'media luna', 'rombo', 'mostaza', 'flecos'] },
  { id: 'colgantes-duo', nombre: 'Set de colgantes mostaza y crudo', cat: 'decoracion', tipo: 'colgante', colores: ['mostaza', 'crudo'], precio: 34000, stock: 3, medida: 'Dos colgantes de 80 cm', rango: 5, alta: 14,
    img: 'images/p-colgantes-duo.webp', alt: 'Dos colgantes de macramé, uno mostaza y uno crudo, con macetas y plantas colgantes sobre una pared blanca',
    corto: 'Dos colgantes que se complementan.',
    desc: 'Dos colgantes que se complementan: uno en cordón mostaza y otro en crudo. Para una ventana o el techo del balcón.', tags: ['colgante', 'set', 'maceta', 'balcon', 'ventana'] },
  { id: 'tapiz-rombos', nombre: 'Tapiz Rombos natural', cat: 'tapices', tipo: 'tapiz', colores: ['crudo'], precio: 52000, stock: 2, medida: '50 × 70 cm', rango: 6, alta: 15,
    img: 'images/p-tapiz-rombos.webp', alt: 'Tapiz de macramé color arena con rombos y franjas de nudos, colgado entre dos ventanas',
    corto: 'Franjas de rombos y espigas en tono arena.',
    desc: 'Franjas de rombos, espigas y flecos parejos en tono arena. Va sobre un respaldo de cama, un sillón o un pasillo largo.', tags: ['rombos', 'arena', 'dormitorio', 'respaldo'] },
  { id: 'plumas-rama', nombre: 'Plumas de macramé en rama (par)', cat: 'tapices', tipo: 'pluma', colores: ['mostaza', 'crudo'], precio: 18000, stock: 5, medida: 'Plumas de 30 cm sobre rama de 40 cm', rango: 7, alta: 16,
    img: 'images/p-plumas-rama.webp', alt: 'Dos plumas de macramé peinadas, una mostaza y una beige, colgadas de una rama natural',
    corto: 'Flecos peinados a mano en mostaza y beige.',
    desc: 'Dos plumas de flecos peinados a mano, en mostaza y beige, sobre una rama. Suman calidez a una pared sin ocuparla entera.', tags: ['plumas', 'hojas', 'rama', 'flecos', 'regalo'] },
  { id: 'almohadon-girasoles', nombre: 'Almohadón de macramé con girasoles', cat: 'decoracion', tipo: 'almohadon', colores: ['crudo', 'girasol'], precio: 32000, stock: 3, medida: '45 × 45 cm, con relleno', rango: 8, alta: 19,
    img: 'images/p-almohadon-girasoles.webp', alt: 'Almohadón de macramé crudo con rombos y girasoles tejidos, apoyado en una silla de madera',
    corto: 'Rombos calados y cinco girasoles.',
    desc: 'Funda tejida con rombos y cinco girasoles sobre un forro de tela. Va con relleno y la funda se saca para lavar.', tags: ['almohadon', 'silla', 'sillon', 'girasol', 'funda'] },
  { id: 'tapiz-arena', nombre: 'Tapiz Arena con varilla', cat: 'tapices', tipo: 'tapiz', colores: ['crudo'], precio: 24000, stock: 4, medida: '30 × 45 cm', rango: 9, alta: 12,
    img: 'images/p-tapiz-arena.webp', alt: 'Tapiz chico de macramé crudo con flecos en punta, colgado de una varilla fina sobre una pared clara',
    corto: 'Chico, con flecos en punta.',
    desc: 'Un tapiz chico de nudos cuadrados y flecos en punta. Para empezar a decorar un rincón o para regalar.', tags: ['chico', 'varilla', 'regalo', 'crudo'] },
  { id: 'alas-terracota', nombre: 'Alas de macramé terracota', cat: 'tapices', tipo: 'pluma', colores: ['terracota'], precio: 46000, stock: 0, medida: '70 × 80 cm', rango: 10, alta: 11,
    img: 'images/p-alas-terracota.webp', alt: 'Par de alas de macramé color terracota con flecos largos, colgadas de una rama sobre una pared clara',
    corto: 'Un par de alas con flecos largos.',
    desc: 'Un par de alas tejidas en terracota, con flecos largos que se mueven con el aire. Quedan muy bien detrás de una cama o en un cuarto de chicos.', tags: ['alas', 'terracota', 'dormitorio', 'chicos'] },
  { id: 'tapiz-brisa', nombre: 'Tapiz Brisa en rama natural', cat: 'tapices', tipo: 'tapiz', colores: ['crudo'], precio: 34000, stock: 2, medida: '40 × 70 cm, en rama', rango: 11, alta: 9,
    img: 'images/p-tapiz-brisa.webp', alt: 'Tapiz de macramé blanco con dibujo de rombos, colgado de una rama de madera natural con cuentas',
    corto: 'Rombos calados sobre una rama con cuentas.',
    desc: 'Tejido en cordón blanco sobre una rama natural con cuentas de madera. Los rombos calados dejan ver la pared.', tags: ['rama', 'cuentas', 'blanco', 'rombos'] },
  { id: 'espejo-flecos', nombre: 'Espejo redondo con flecos', cat: 'decoracion', tipo: 'espejo', colores: ['crudo'], precio: 48000, stock: 2, medida: '35 cm de diámetro, flecos de 50 cm', rango: 12, alta: 10,
    img: 'images/p-espejo-flecos.webp', alt: 'Espejo redondo con marco tejido en macramé blanco y borlas largas con cuentas de madera, sobre una pared de madera',
    corto: 'Marco tejido y borlas largas con cuentas.',
    desc: 'Marco tejido en cordón blanco con borlas largas y cuentas de madera. Para un recibidor o al lado de la puerta.', tags: ['espejo', 'borlas', 'cuentas', 'recibidor'] },
  { id: 'colgante-crudo', nombre: 'Colgante doble para macetas', cat: 'decoracion', tipo: 'colgante', colores: ['crudo'], precio: 31000, stock: 2, medida: '1,20 m de largo, dos niveles', rango: 13, alta: 8,
    img: 'images/p-colgante-crudo.webp', alt: 'Colgante de macramé crudo de dos niveles con una maceta de barro y una planta verde',
    corto: 'Dos macetas, una sobre otra.',
    desc: 'Dos niveles de nudos para colgar dos macetas una sobre otra. Ocupa poco lugar y suma verde en vertical.', tags: ['colgante', 'doble', 'maceta', 'vertical'] },
  { id: 'tapiz-mini', nombre: 'Mini tapiz para rincones', cat: 'tapices', tipo: 'tapiz', colores: ['crudo'], precio: 16500, stock: 6, medida: '25 × 35 cm', rango: 14, alta: 6,
    img: 'images/p-tapiz-mini.webp', alt: 'Mini tapiz de macramé crudo con flecos, colgado en el rincón de una habitación junto a una planta',
    corto: 'Chiquito y liviano.',
    desc: 'Chiquito y liviano: para una puerta, un baño o el costado de un estante.', tags: ['mini', 'chico', 'rincon', 'bano', 'regalo'] },
  { id: 'posavasos-girasol', nombre: 'Posavasos girasol (set de 4)', cat: 'decoracion', tipo: 'mesa', colores: ['crudo', 'girasol'], precio: 16000, stock: 6, medida: '11 cm de diámetro cada uno', rango: 15, alta: 17,
    img: 'images/p-posavasos-girasol.webp', alt: 'Cuatro posavasos redondos de macramé crudo con flores mostaza y terracota tejidas, sobre una mesa de madera',
    corto: 'Cuatro espirales con flores en el borde.',
    desc: 'Cuatro posavasos en espiral con flores mostaza y terracota en el borde. Para el mate de la tarde o un vaso bien frío.', tags: ['posavasos', 'mesa', 'mate', 'set', 'regalo'] },
  { id: 'camino-girasoles', nombre: 'Camino de mesa con girasoles', cat: 'decoracion', tipo: 'mesa', colores: ['crudo', 'girasol'], precio: 45000, stock: 2, medida: '1,60 m × 35 cm', rango: 16, alta: 13,
    img: 'images/p-camino-girasoles.webp', alt: 'Camino de mesa de macramé crudo con girasoles tejidos y flecos en las puntas, sobre una mesa de madera',
    corto: 'Calado, con flecos en las dos puntas.',
    desc: 'Un camino calado con girasoles en el centro y flecos en las dos puntas. Viste una mesa de seis sin taparla.', tags: ['camino', 'mesa', 'comedor', 'girasol', 'flecos'] },
  { id: 'botella-hoja', nombre: 'Botella decorada con hoja de macramé', cat: 'decoracion', tipo: 'deco', colores: ['crudo'], precio: 14500, descuento: 15, stock: 5, medida: 'Botella de 25 cm', rango: 17, alta: 7,
    img: 'images/p-botella-hoja.webp', alt: 'Botella de vidrio blanca con el cuello forrado en yute y una hoja de macramé colgando, con una rama de hiedra',
    corto: 'Florero o adorno, con su hoja tejida.',
    desc: 'Botella de vidrio con el cuello forrado en yute y una hoja de macramé colgada. Florero o adorno, como más te guste.', tags: ['botella', 'florero', 'yute', 'hoja', 'regalo'] },
  { id: 'llavero-girasol', nombre: 'Llavero girasol tejido', cat: 'accesorios', tipo: 'llavero', colores: ['crudo', 'mostaza', 'terracota', 'girasol'], precio: 6500, stock: 12, medida: '14 cm con borla', rango: 18, alta: 23,
    opciones: { nombre: 'Color', valores: [{ id: 'crudo', nombre: 'Crudo con girasol', color: 'crudo' }, { id: 'mostaza', nombre: 'Mostaza con margarita', color: 'mostaza' }, { id: 'terracota', nombre: 'Terracota con girasol', color: 'terracota' }] },
    img: 'images/p-llavero-girasol.webp', alt: 'Tres llaveros de macramé con aro dorado: uno crudo con girasol, uno mostaza con margarita y uno terracota con girasol',
    corto: 'Elegí el color: crudo, mostaza o terracota.',
    desc: 'Un girasol (o una margarita) tejido en el centro, aro metálico y borla al final. Para tus llaves, la mochila o para regalar.', tags: ['llavero', 'regalo', 'souvenir', 'girasol', 'margarita'] },
  { id: 'llavero-hoja', nombre: 'Llavero hoja con aro de madera', cat: 'accesorios', tipo: 'llavero', colores: ['crudo'], precio: 5500, stock: 10, medida: '12 cm', rango: 19, alta: 5,
    img: 'images/p-llavero-hoja.webp', alt: 'Hoja de macramé crudo con flecos peinados y aro de madera, sobre una mesa con hilos y aros',
    corto: 'Una hoja de flecos peinados.',
    desc: 'Una hoja de flecos peinados colgada de un aro de madera. Llavero, adorno para el espejo del auto o colgante para la cartera.', tags: ['llavero', 'hoja', 'aro', 'madera', 'regalo'] },
  { id: 'bolso-flecos', nombre: 'Bolso de macramé con flecos', cat: 'accesorios', tipo: 'bolso', colores: ['crudo'], precio: 39000, stock: 2, medida: '30 × 25 cm, manija larga', rango: 20, alta: 4,
    img: 'images/p-bolso-flecos.webp', alt: 'Bolsos de macramé crudo con flecos largos colgados de un perchero',
    corto: 'Para llevar cruzado, con flecos largos.',
    desc: 'Bolso tejido en cordón crudo con flecos largos y manija para llevar cruzado. Liviano, para el verano en la costa.', tags: ['bolso', 'cartera', 'flecos', 'verano', 'playa'] },
  { id: 'borrador-atrapasuenos', nombre: 'Atrapasueños (borrador)', cat: 'decoracion', tipo: 'deco', colores: ['crudo'], precio: 22000, stock: 1, medida: '-', rango: 0, alta: 1, visible: false,
    img: 'images/p-tapiz-mini.webp', alt: '', corto: '', desc: '', tags: [] },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
});

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
    const cat = lista(f.cat), excluir = lista(f.excluir), tipos = lista(f.tipos), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipos.length && !tipos.includes(p.tipo)) return false;
    if (colores.length && !colores.some(c => p.colores.includes(c))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
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
      p.nombre, catDe(p.cat)?.nombre, TIPOS[p.tipo], ...p.colores.map(c => COLORES[c]?.nombre), p.medida, p.desc, ...(p.tags || []),
      ...(p.opciones ? p.opciones.valores.map(v => v.nombre) : []), p.descuento > 0 ? 'oferta descuento' : '', p.stock > 0 ? '' : 'sin stock',
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
const opcionDe = (p, op) => p?.opciones?.valores.find(v => v.id === op) || null;

const Cart = {
  KEY: 'girasoles_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, op = '') {
    const max = producto.stock ?? 0;
    const libre = max - this.enCarrito(producto.id);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, op, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, op, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.op || '') === op);
    if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 1) - otros));
    this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  izq: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  der: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  hoja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  campana: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"/></svg>',
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
const coloresHTML = p => `<span class="dots" aria-label="Colores: ${esc(p.colores.map(c => COLORES[c]?.nombre).join(', '))}">${p.colores.map(c => `<i style="background:${COLORES[c]?.hex}"></i>`).join('')}</span>`;
const msgAviso = p => `Hola Girasoles! Me interesa «${p.nombre}», que figura sin stock. ¿Me avisás cuando vuelva a haber?`;
const stepperHTML = (max, clase = '') => `<div class="stepper${clase ? ' ' + clase : ''}" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="prod-add prod-add--aviso" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}<span>Avisame</span></a>`;
  if (p.opciones) return `<button type="button" class="prod-add prod-add--elegir" data-quick="${esc(p.id)}" aria-label="Elegir ${esc(p.opciones.nombre.toLowerCase())}: ${esc(p.nombre)}">${ICO.hoja}<span>Elegir ${esc(p.opciones.nombre.toLowerCase())}</span></button>`;
  return `${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>`;
}

function badgeHTML(p) {
  if (!(p.stock > 0)) return '<span class="etiqueta etiqueta--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="etiqueta">-${p.descuento}%</span>`;
  if (p.stock === 1) return '<span class="etiqueta etiqueta--unica">Pieza única</span>';
  if (p.alta >= 20) return '<span class="etiqueta etiqueta--nueva">Recién tejido</span>';
  return '';
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sin = !(p.stock > 0);
  return `<article class="pcard${clase ? ' ' + clase : ''}${sin ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badgeHTML(p)}
    ${sin || p.opciones ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${coloresHTML(p)}<span>${esc(TIPOS[p.tipo])}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
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
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'pieza' : 'piezas'}</small></span></a></li>`;
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
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
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
    const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver las ${total} piezas</span><span class="mosaico__todo-n">Tapices, decoración y accesorios, con filtros por color y precio.</span>${ICO.flecha}</a>` : '';
    cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
  });
}

function galeriaItemHTML(g, i, clase) {
  return `<button type="button" class="${clase}" data-visor="${i}" aria-label="Ver en grande: ${esc(g.titulo)}">
    <span class="${clase}__foto"><img src="${esc(g.img)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}"></span>
    <span class="${clase}__txt"><b>${esc(g.titulo)}</b><small>${esc(g.txt)}</small></span>
  </button>`;
}
function initGaleria() {
  const thumbs = document.querySelector('[data-galeria-thumbs]');
  if (thumbs) {
    const elegidos = (thumbs.dataset.galeriaThumbs || '0,1,2,3').split(',').map(Number);
    thumbs.innerHTML = elegidos.map(i => `<button type="button" class="thumb" data-visor="${i}" aria-label="Ver en grande: ${esc(GALERIA[i].titulo)}"><img src="${esc(GALERIA[i].img)}" alt="${esc(GALERIA[i].alt)}" width="${GALERIA[i].w}" height="${GALERIA[i].h}"></button>`).join('');
  }
  const rail = document.querySelector('[data-galeria-rail]');
  if (rail) {
    rail.innerHTML = GALERIA.map((g, i) => `<div class="obra" data-animate="der" style="opacity:0;transform:translateX(56px)">${galeriaItemHTML(g, i, 'obra__btn')}</div>`).join('');
    initRailDrag(rail);
    const wrap = rail.closest('[data-rail]');
    const prev = wrap?.querySelector('[data-rail-prev]');
    const next = wrap?.querySelector('[data-rail-next]');
    const paso = () => (rail.querySelector('.obra')?.getBoundingClientRect().width || 300) + 16;
    const sync = () => {
      const ini = parseFloat(getComputedStyle(rail).paddingInlineStart) || 0;
      if (prev) prev.disabled = rail.scrollLeft <= ini + 2;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    };
    prev?.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => rail.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('[data-visor-img]');
  const tit = visor.querySelector('[data-visor-tit]');
  const txt = visor.querySelector('[data-visor-txt]');
  const num = visor.querySelector('[data-visor-num]');
  const acc = visor.querySelector('[data-visor-acc]');
  let actual = 0;
  let foco = null;
  const pintar = i => {
    actual = (i + GALERIA.length) % GALERIA.length;
    const g = GALERIA[actual];
    img.src = g.img; img.alt = g.alt; img.width = g.w; img.height = g.h;
    img.closest('.visor__foto').classList.toggle('visor__foto--alta', g.h > g.w);
    tit.textContent = g.titulo;
    txt.textContent = g.txt;
    num.textContent = `${actual + 1} / ${GALERIA.length}`;
    const p = getProducto(g.producto);
    acc.innerHTML = `${p ? `<button type="button" class="btn btn--cta" data-visor-pieza="${esc(p.id)}">${ICO.carrito}Ver la pieza en la tienda</button>` : ''}<a class="btn btn--line" href="${wspLink(`Hola Girasoles! Vi en la galería «${g.titulo}» y quiero una pieza así.`)}" target="_blank" rel="noopener">${ICO.wsp}Quiero una así</a>`;
  };
  const abrir = (i, origen) => {
    foco = origen || document.activeElement;
    pintar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('.visor__close')?.focus({ preventScroll: true });
  };
  const cerrar = (devolver = true) => {
    if (visor.hidden) return;
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { visor.hidden = true; }, 320);
    if (devolver && foco && document.contains(foco)) foco.focus({ preventScroll: true });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) { e.preventDefault(); abrir(parseInt(b.dataset.visor, 10) || 0, b); }
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) { cerrar(); return; }
    if (e.target.closest('[data-visor-prev]')) { pintar(actual - 1); return; }
    if (e.target.closest('[data-visor-next]')) { pintar(actual + 1); return; }
    const pieza = e.target.closest('[data-visor-pieza]');
    if (pieza) { cerrar(false); setTimeout(() => abrirQV(pieza.dataset.visorPieza, foco), 60); }
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') { pintar(actual - 1); return; }
    if (e.key === 'ArrowRight') { pintar(actual + 1); return; }
    atraparFoco(visor.querySelector('.visor__panel'), e);
  });
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
      const items = [...vp.children];
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

function initTalleres() {
  const box = document.querySelector('[data-consulta]');
  if (!box) return;
  const estado = { taller: 'inicial', modalidad: 'grupal', personas: 1, horario: 'tarde' };
  const msgEl = box.querySelector('[data-consulta-msg]');
  const link = box.querySelector('[data-consulta-wsp]');
  const nEl = box.querySelector('[data-consulta-n]');
  const mensaje = () => {
    const quien = estado.personas === 1 ? 'para mí' : `para ${estado.personas} personas`;
    return `Hola Girasoles! Quiero consultar por el taller «${TALLERES[estado.taller]}», ${MODALIDADES[estado.modalidad]}, ${quien}, de preferencia ${HORARIOS[estado.horario]}. ¿Qué fechas y cupos hay?`;
  };
  const pintar = () => {
    box.querySelectorAll('[data-consulta-op]').forEach(b => {
      const [campo, valor] = b.dataset.consultaOp.split(':');
      b.setAttribute('aria-pressed', String(estado[campo] === valor));
    });
    document.querySelectorAll('[data-taller-card]').forEach(c => c.classList.toggle('taller--activo', c.dataset.tallerCard === estado.taller));
    if (nEl) nEl.textContent = estado.personas;
    const m = mensaje();
    if (msgEl) msgEl.textContent = m;
    if (link) link.href = wspLink(m);
  };
  box.addEventListener('click', e => {
    const op = e.target.closest('[data-consulta-op]');
    if (op) {
      const [campo, valor] = op.dataset.consultaOp.split(':');
      estado[campo] = valor;
      pintar();
      return;
    }
    const paso = e.target.closest('[data-consulta-paso]');
    if (paso) {
      estado.personas = Math.max(1, Math.min(8, estado.personas + parseInt(paso.dataset.consultaPaso, 10)));
      pintar();
    }
  });
  document.addEventListener('click', e => {
    const elegir = e.target.closest('[data-elegir-taller]');
    if (!elegir) return;
    e.preventDefault();
    estado.taller = elegir.dataset.elegirTaller;
    pintar();
    box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    box.querySelector(`[data-consulta-op="taller:${estado.taller}"]`)?.focus({ preventScroll: true });
  });
  pintar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-36.5432, -56.6985);
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: el.dataset.zoom !== 'off' });
  mapa.setView(centro, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 450, color: '#8A6514', weight: 1, fillColor: '#E0B53F', fillOpacity: .22 }).addTo(mapa);
  L.circleMarker(centro, { radius: 7, color: '#FFFEF7', weight: 2, fillColor: '#4A2F1F', fillOpacity: 1 }).addTo(mapa);
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, { qty = 1, op = '', comprar = false } = {}) {
  if (p.opciones && !opcionDe(p, op)) { abrirQV(p.id); showToast(`Elegí el ${p.opciones.nombre.toLowerCase()} antes de agregarlo.`); return; }
  const n = Cart.add(p, qty, op);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id)) { abrirCarrito(); return; }
    showToast(p.stock > 0 ? `Ya tenés en el carrito todas las unidades de «${p.nombre}».` : 'Esta pieza está sin stock. Pedí que te avisen por WhatsApp.');
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  const v = opcionDe(p, op);
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}«${p.nombre}»${v ? ` (${v.nombre.toLowerCase()})` : ''} al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
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
let qvOpcion = '';
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  if (qvActual?.id !== p.id) qvOpcion = '';
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
    brand: { '@type': 'Brand', name: 'Girasoles' }, material: 'Cordón de algodón',
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
  const op = opcionDe(p, qvOpcion);
  const opcionesHTML = p.opciones ? `<div class="qv__ops" role="radiogroup" aria-label="${esc(p.opciones.nombre)}">
      <p class="qv__ops-tit">${esc(p.opciones.nombre)}: <b data-qv-op-txt>${op ? esc(op.nombre) : 'elegí uno'}</b></p>
      <div class="qv__ops-lista">${p.opciones.valores.map(v => `<button type="button" class="op" role="radio" aria-checked="${String(v.id === qvOpcion)}" data-qv-op="${esc(v.id)}"><i style="background:${COLORES[v.color]?.hex}"></i>${esc(v.nombre)}</button>`).join('')}</div>
    </div>` : '';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media" data-lupa><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgeHTML(p)}<span class="qv__lupa">${ICO.lupa}Pasá el mouse para ver los nudos</span></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(TIPOS[p.tipo])}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'precio qv__precio')}
      <p class="qv__corto">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Medida</dt><dd>${esc(p.medida)}</dd></div>
        <div><dt>Colores</dt><dd>${esc(p.colores.map(c => COLORES[c]?.nombre).join(', '))}</dd></div>
        <div><dt>Material</dt><dd>Cordón de algodón</dd></div>
        <div><dt>Disponibles</dt><dd>${sin ? 'Sin stock por ahora' : p.stock === 1 ? 'Pieza única' : `${p.stock} unidades`}</dd></div>
      </dl>
      ${opcionesHTML}
      <div class="qv__acc">
        ${sin
          ? `<a class="btn btn--cta" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}Avisame cuando vuelva</a>`
          : `${stepperHTML(Math.max(1, libre), 'stepper--grande')}
             <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está todo en tu carrito'}</button>
             <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Girasoles! Tengo una consulta sobre «${p.nombre}».`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Lo querés en otro color o medida? Consultá por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
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
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvOpcion = opBtn.dataset.qvOp;
      qv.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-checked', String(b === opBtn)));
      const t = qv.querySelector('[data-qv-op-txt]');
      if (t) t.textContent = opcionDe(p, qvOpcion)?.nombre || '';
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    if (p.opciones && !opcionDe(p, qvOpcion)) {
      showToast(`Elegí el ${p.opciones.nombre.toLowerCase()} antes de agregarlo.`);
      qv.querySelector('[data-qv-op]')?.focus();
      return;
    }
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qty, qvOpcion);
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, { qty, op: qvOpcion });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const lupaMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  qv.addEventListener('pointermove', e => {
    const media = e.target.closest('[data-lupa]');
    if (!media || !lupaMq.matches || reduceMotion) return;
    const r = media.getBoundingClientRect();
    media.style.setProperty('--ox', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    media.style.setProperty('--oy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    media.classList.add('lupa');
  });
  qv.addEventListener('pointerout', e => {
    const media = e.target.closest('[data-lupa]');
    if (media && !media.contains(e.relatedTarget)) media.classList.remove('lupa');
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
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Todavía no elegiste ninguna pieza. Hay tapices, espejos y llaveros esperando.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const v = opcionDe(p, i.op);
    const otros = Cart.enCarrito(p.id) - i.qty;
    return `<li class="linea" data-linea="${esc(i.id)}" data-op="${esc(i.op || '')}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${v ? esc(v.nombre) + ' · ' : ''}${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper" data-linea-stepper><button type="button" data-linea-paso="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty + otros >= p.stock ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const v = opcionDe(p, i.op); return `- ${i.qty} × ${p.nombre}${v ? ` (${v.nombre.toLowerCase()})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Girasoles! Quiero estas piezas:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El envío o el retiro por el taller se coordinan por WhatsApp.</p>`;
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
    const id = linea.dataset.linea;
    const op = linea.dataset.op || '';
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, op);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, op, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"][data-op="${CSS.escape(op)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
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
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    tipos: new Set(lista('tipo').filter(t => TIPOS[t])),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    stock: PARAMS.get('disponibles') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
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
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas las piezas')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-tipo-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TIPOS).map(([k, n]) => `<label class="opt" data-tipo-opt="${k}"><input type="checkbox" value="${k}" data-f="tipo"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-tipo="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(COLORES).map(([k, c]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="color"><span class="opt__dot" style="background:${c.hex}"></span><span>${esc(c.nombre)}</span><span class="opt__n" data-cuenta-filtro-color="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.tipos.size && sin !== 'tipo') f.tipos = [...estado.tipos];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.tipos.forEach(t => chips.push(['tipo', t, TIPOS[t]]));
    estado.colores.forEach(c => chips.push(['color', c, COLORES[c].nombre]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
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
    document.querySelectorAll('input[data-f="tipo"]').forEach(el => { el.checked = estado.tipos.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-tipo]').forEach(el => {
      const n = Tienda.contar({ ...filtrosDe('tipo'), tipos: [el.dataset.cuentaFiltroTipo] });
      el.textContent = n;
      const opt = el.closest('[data-tipo-opt]');
      if (opt) opt.hidden = n === 0 && !estado.tipos.has(el.dataset.cuentaFiltroTipo);
    });
    document.querySelectorAll('[data-cuenta-filtro-color]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('color'), colores: [el.dataset.cuentaFiltroColor] }); });
    const enPanel = estado.tipos.size + estado.colores.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : 'Todas las piezas';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Piezas de macramé tejidas a mano en Santa Teresita. Filtrá por categoría, tipo, color o precio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat; miga.textContent = titulo; }
    document.title = `${titulo} — Girasoles`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'color', 'precio', 'q', 'orden', 'disponibles'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.tipos.size) u.searchParams.set('tipo', [...estado.tipos].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('disponibles', '1');
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
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'pieza' : 'piezas'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.precio = ''; estado.stock = false; estado.q = '';
    estado.tipos.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'tipo' ? estado.tipos : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
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
      if (f === 'tipo') estado.tipos.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
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
  paso('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-chips li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero__tag', { y: -14, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.85);
  paso('.hero__sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
  paso('.hero__rama', { opacity: 0, duration: 1.4, clearProps: 'opacity' }, 0.3);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initVistaPrevia,
  initGaleria,
  initTalleres,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
  initMapa,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
