document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';
const WSP = '5493437433009';

if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);
if (!hasGsap) {
  document.querySelectorAll('[data-animate], [data-hero]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (hasST) window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'macrame', nombre: 'Macramé', color: 'var(--c1)', img: 'frizo-verde-aro.webp', pie: 'Frizos, tapices y colgantes' },
  { id: 'bijouterie', nombre: 'Bijouterie', color: 'var(--c2)', img: 'muestra-bijouterie-colores.webp', pie: 'Collares, pulseras y piezas únicas' },
  { id: 'kits', nombre: 'Kits y materiales', color: 'var(--c3)', img: 'materiales-kit.webp', pie: 'Para armar en casa' },
  { id: 'cursos', nombre: 'Cursos', color: 'var(--c4)', img: 'curso-taller.webp', pie: 'Aprendé a hacerlo vos' }
];

const PRODUCTOS = [
  {
    id: 'p1', nombre: 'Tapiz de macramé “Ola”', categoria: 'macrame', precio: 38900, descuento: 0, stock: 6,
    destacado: true, nuevo: false, img: 'tapiz-macrame.webp',
    variantes: { label: 'Color del algodón', opciones: ['Crudo', 'Rosa', 'Celeste'] },
    corta: 'Tapiz de pared tejido nudo por nudo, con varilla de madera.',
    larga: 'Un tapiz de 90 cm de alto armado con el nudo plano y flecos abiertos. Va colgado de una varilla de madera lijada a mano. Queda bien sobre la cama, en el living o detrás de un escritorio.',
    detalles: ['Algodón 100% natural, 5 mm', 'Varilla de madera de 60 cm', 'Alto total aprox. 90 cm', 'Se entrega listo para colgar']
  },
  {
    id: 'p2', nombre: 'Tapiz con flecos “Cascada”', categoria: 'macrame', precio: 44500, descuento: 15, stock: 3,
    destacado: false, nuevo: false, img: 'tapiz-fleco.webp',
    variantes: null,
    corta: 'Versión larga del tapiz, con caída de flecos y borlas.',
    larga: 'La versión grande de nuestro tapiz: más ancho, con caída de flecos y borlas rematadas una por una. Lleva alrededor de veinte horas de trabajo, así que hacemos pocas por mes.',
    detalles: ['Algodón natural 5 mm', 'Ancho 70 cm · alto 130 cm', 'Borlas rematadas a mano', 'Pieza única por color']
  },
  {
    id: 'p3', nombre: 'Colgante para plantas “Selva”', categoria: 'macrame', precio: 16400, descuento: 0, stock: 12,
    destacado: false, nuevo: false, img: 'colgante-plantas.webp',
    variantes: { label: 'Largo', opciones: ['Corto (70 cm)', 'Largo (110 cm)'] },
    corta: 'Colgante de macramé para maceta, con aro de madera.',
    larga: 'Sostiene macetas de hasta 18 cm de diámetro. El aro de madera va arriba y los cuatro cordones se cruzan con nudo plano hasta formar la canasta. La maceta y la planta no van incluidas.',
    detalles: ['Algodón natural 4 mm', 'Aro de madera de 5 cm', 'Soporta hasta 3 kg', 'La maceta no está incluida']
  },
  {
    id: 'p4', nombre: 'Colgante doble “Terraza”', categoria: 'macrame', precio: 24900, descuento: 0, stock: 5,
    destacado: false, nuevo: false, img: 'colgante-terraza.webp',
    variantes: null,
    corta: 'Dos macetas en un mismo colgante, para ventanas y galerías.',
    larga: 'Dos canastas en una sola bajada: una arriba y otra abajo. Pensado para ventanas altas y galerías, donde una sola maceta queda perdida.',
    detalles: ['Algodón natural 4 mm', 'Alto total 140 cm', 'Dos canastas de hasta 15 cm', 'Aro de madera reforzado']
  },
  {
    id: 'p5', nombre: 'Llavero arcoíris', categoria: 'macrame', precio: 5900, descuento: 0, stock: 24,
    destacado: true, nuevo: false, img: 'llavero-arcoiris.webp',
    variantes: { label: 'Combinación', opciones: ['Rosa', 'Amarillo', 'Verde agua'] },
    corta: 'Arcoíris de hilo forrado a mano, con argolla dorada.',
    larga: 'El regalo que más nos piden. Cada arco se forra con hilo de algodón sobre alambre y se remata con flecos. Va con argolla dorada y viene en su tarjeta.',
    detalles: ['Alto 9 cm', 'Argolla dorada de 3 cm', 'Hilo de algodón teñido', 'Viene con tarjeta para regalo']
  },
  {
    id: 'p6', nombre: 'Móvil de cuna “Arcoíris”', categoria: 'macrame', precio: 27500, descuento: 0, stock: 4,
    destacado: false, nuevo: true, img: 'movil-arcoiris.webp',
    variantes: { label: 'Paleta', opciones: ['Rosados', 'Celestes', 'Tierra'] },
    corta: 'Móvil de tres arcos para cuna o cambiador.',
    larga: 'Tres arcos de distinto tamaño colgados de una varilla de madera. Se hace por encargo en la paleta que elijas, así que tarda unos días más que el resto.',
    detalles: ['Tres arcos de 9, 12 y 15 cm', 'Varilla de madera de 40 cm', 'Se hace por encargo', 'Demora 5 a 7 días']
  },

  {
    id: 'p7', nombre: 'Aros arcoíris de hilo', categoria: 'bijouterie', precio: 8900, descuento: 0, stock: 15,
    destacado: true, nuevo: false, img: 'aro-arcoiris.webp',
    variantes: { label: 'Combinación', opciones: ['Pastel', 'Tierra', 'Vivos'] },
    corta: 'El arcoíris del llavero, en versión aro. Livianos.',
    larga: 'Mismo arco forrado a mano, pero en escala chica y con flecos de algodón. Pesan poco, así que se pueden usar todo el día.',
    detalles: ['Alto 5 cm con flecos', 'Ganchos de acero quirúrgico', 'Peso 4 g cada uno', 'Hilo de algodón teñido']
  },
  {
    id: 'p8', nombre: 'Aros hoja “Monstera”', categoria: 'bijouterie', precio: 7400, descuento: 0, stock: 10,
    destacado: false, nuevo: false, img: 'aro-monstera.webp',
    variantes: null,
    corta: 'Hoja de monstera en metal dorado, con gancho de acero.',
    larga: 'Una hoja calada en metal dorado, colgada de una perla de vidrio. Es el par más pedido para regalar: entra en cualquier look y no pesa.',
    detalles: ['Largo total 6 cm', 'Metal dorado sin níquel', 'Ganchos de acero quirúrgico', 'Se entregan en bolsita de tela']
  },
  {
    id: 'p9', nombre: 'Aros trenza de hilo', categoria: 'bijouterie', precio: 6800, descuento: 0, stock: 18,
    destacado: false, nuevo: false, img: 'aro-trenza.webp',
    variantes: { label: 'Color', opciones: ['Natural', 'Negro', 'Terracota'] },
    corta: 'Trenza plana de hilo encerado, larga y liviana.',
    larga: 'Una trenza plana de hilo encerado, tejida a mano de punta a punta. Larga pero liviana: pesa menos de lo que parece.',
    detalles: ['Largo 8 cm', 'Hilo encerado', 'Ganchos de acero quirúrgico', 'Se puede hacer en otros colores']
  },
  {
    id: 'p10', nombre: 'Aros perla “Gota”', categoria: 'bijouterie', precio: 9600, descuento: 10, stock: 8,
    destacado: false, nuevo: false, img: 'aro-perla.webp',
    variantes: null,
    corta: 'Perla barroca colgada de un gancho fino con brillos.',
    larga: 'Una perla barroca de río, cada una con su forma. Va colgada de un gancho fino con circonias. Es el par que más se lleva para casamientos.',
    detalles: ['Perla de río barroca', 'Gancho con circonias', 'Largo total 4 cm', 'Cada perla es distinta']
  },
  {
    id: 'p11', nombre: 'Aros cascada de mostacillas', categoria: 'bijouterie', precio: 10400, descuento: 0, stock: 7,
    destacado: false, nuevo: false, img: 'aro-cascada.webp',
    variantes: { label: 'Combinación', opciones: ['Blanco y dorado', 'Terracota'] },
    corta: 'Dos hileras de mostacillas y perlas ensartadas a mano.',
    larga: 'Dos hileras largas de mostacillas checas y perlas de vidrio, ensartadas de a una. Se mueven al caminar, que es medio la gracia.',
    detalles: ['Largo 9 cm', 'Mostacillas checas', 'Ganchos de acero quirúrgico', 'Lleva 40 minutos cada par']
  },
  {
    id: 'p12', nombre: 'Aros nácar “Marea”', categoria: 'bijouterie', precio: 11200, descuento: 0, stock: 5,
    destacado: false, nuevo: true, img: 'aro-nacar.webp',
    variantes: null,
    corta: 'Nácar tornasolado en hilera, cambia de color con la luz.',
    larga: 'Placas de nácar tornasolado montadas en hilera. Según cómo les pegue la luz pasan del verde al violeta, así que no hay dos fotos iguales.',
    detalles: ['Nácar natural', 'Largo 8 cm', 'Ganchos dorados', 'Pieza limitada']
  },
  {
    id: 'p13', nombre: 'Collar de mostacillas “Flor”', categoria: 'bijouterie', precio: 23900, descuento: 0, stock: 4,
    destacado: true, nuevo: false, img: 'collar-flor.webp',
    variantes: null,
    corta: 'Medallón floral tejido en mostacilla, punto por punto.',
    larga: 'Un medallón floral tejido en mostacilla checa, punto por punto, sobre hilo encerado. Son unas seis horas de trabajo por pieza y no se puede apurar.',
    detalles: ['Mostacilla checa', 'Medallón de 7 cm', 'Tiento regulable', 'Seis horas de trabajo']
  },
  {
    id: 'p14', nombre: 'Collar de flecos “Fiesta”', categoria: 'bijouterie', precio: 28500, descuento: 15, stock: 3,
    destacado: false, nuevo: false, img: 'collar-fleco.webp',
    variantes: null,
    corta: 'Flecos de mostacilla que se mueven, para salir.',
    larga: 'La versión con flecos: hileras de mostacilla que caen sueltas y se mueven solas. Es la pieza que se lleva la mirada, así que va con ropa lisa.',
    detalles: ['Mostacilla checa y de vidrio', 'Flecos de 12 cm', 'Cierre regulable', 'Pieza única']
  },
  {
    id: 'p15', nombre: 'Pulsera trenzada “Nudo”', categoria: 'bijouterie', precio: 4900, descuento: 0, stock: 30,
    destacado: true, nuevo: false, img: 'pulseras-mostacillas.webp',
    variantes: { label: 'Color', opciones: ['Rosa', 'Celeste', 'Violeta', 'Verde agua'] },
    corta: 'Pulsera de nudo plano, ajustable. La clásica.',
    larga: 'La pulsera de siempre, hecha con el mismo nudo plano del macramé. Ajustable con nudo corredizo, así que le entra a cualquier muñeca. Se lleva de a varias.',
    detalles: ['Hilo de algodón encerado', 'Ajustable de 14 a 20 cm', 'No se destiñe con el agua', 'Combinable de a tres']
  },

  {
    id: 'p16', nombre: 'Kit de macramé para empezar', categoria: 'kits', precio: 27900, descuento: 0, stock: 9,
    destacado: true, nuevo: false, img: 'materiales-kit.webp',
    variantes: null,
    corta: 'Todo lo que hace falta para tu primer tapiz.',
    larga: 'Cordón, aros, varilla, tijera y una guía impresa con los cuatro nudos base. Es el kit que usamos en el curso “Macramé desde cero”, así que sirve para seguir las clases sin comprar nada más.',
    detalles: ['30 m de cordón de algodón', 'Varilla de madera de 40 cm', '4 aros de madera', 'Guía impresa de nudos']
  },
  {
    id: 'p17', nombre: 'Set de hilos · 10 colores', categoria: 'kits', precio: 14500, descuento: 0, stock: 20,
    destacado: false, nuevo: false, img: 'kit-hilos.webp',
    variantes: { label: 'Paleta', opciones: ['Cálida', 'Fría', 'Pasteles'] },
    corta: 'Diez ovillos de algodón teñido, elegidos para combinar.',
    larga: 'Diez ovillos de algodón teñido que combinan entre sí — no son diez colores al azar. Sirven para aros, pulseras y arcoíris chicos.',
    detalles: ['10 ovillos de 20 m', 'Algodón teñido', 'Grosor 2 mm', 'Tres paletas para elegir']
  },
  {
    id: 'p18', nombre: 'Aros de madera · pack x6', categoria: 'kits', precio: 6200, descuento: 0, stock: 25,
    destacado: false, nuevo: false, img: 'aros-madera.webp',
    variantes: { label: 'Medida', opciones: ['5 cm', '8 cm', '12 cm'] },
    corta: 'Aros lijados listos para forrar o colgar.',
    larga: 'Aros de madera lijados y listos para usar. Son la base de los colgantes de planta, los atrapasueños y los aros forrados.',
    detalles: ['Pack de 6 unidades', 'Madera lijada sin barniz', 'Tres medidas', 'Se pueden pintar']
  },
  {
    id: 'p19', nombre: 'Cordón de algodón · madeja 100 m', categoria: 'kits', precio: 11800, descuento: 0, stock: 14,
    destacado: false, nuevo: false, img: 'cordon-madeja.webp',
    variantes: { label: 'Grosor', opciones: ['3 mm', '5 mm'] },
    corta: 'La madeja grande, para cuando ya arrancaste en serio.',
    larga: 'Cien metros de cordón de algodón trenzado. Con una madeja de 5 mm sale un tapiz grande y sobra para dos colgantes.',
    detalles: ['100 metros por madeja', 'Algodón trenzado', 'Dos grosores', 'Color crudo natural']
  }
];

const DOCENTE = {
  nombre: 'Equipo Cien Colores',
  rol: 'Taller de macramé y bijouterie',
  bio: 'Las mismas manos que arman las piezas del catálogo dan las clases. Sin teoría de más: se aprende haciendo, con el material en la mano.'
};

const CURSOS = [
  {
    id: 'c1', titulo: 'Macramé desde cero', categoria: 'cursos', precio: 32000, descuento: 0,
    nivel: 'Principiante', modalidad: 'Online', clases: 6, duracion: '4 h', destacado: true, nuevo: false,
    img: 'curso-taller.webp',
    corta: 'Los cuatro nudos base y tu primer tapiz terminado.',
    larga: 'Arrancás sin saber nada y terminás con un tapiz colgado en tu pared. Vemos los cuatro nudos que se usan en el 90% del macramé y cómo combinarlos sin que quede torcido.',
    resultados: ['Hacer nudo plano, alondra, festón y espiral', 'Calcular cuánto cordón necesitás', 'Terminar un tapiz de 60 cm', 'Rematar flecos parejos'],
    kitId: 'p16',
    modulos: [
      { titulo: 'Materiales y primeros nudos', clases: [
        { t: 'Qué cordón usar y por qué', d: '12 min', preview: true },
        { t: 'Nudo de alondra: el montaje', d: '18 min' },
        { t: 'Nudo plano paso a paso', d: '22 min' }
      ] },
      { titulo: 'Armar el tapiz', clases: [
        { t: 'Calcular el cordón sin quedarte corto', d: '14 min' },
        { t: 'Diagonales y rombos', d: '26 min' },
        { t: 'Remate y flecos parejos', d: '19 min' }
      ] }
    ]
  },
  {
    id: 'c2', titulo: 'Nudos avanzados: tapices grandes', categoria: 'cursos', precio: 41000, descuento: 10,
    nivel: 'Intermedio', modalidad: 'Online', clases: 8, duracion: '6 h', destacado: false, nuevo: false,
    img: 'curso-nudos.webp',
    corta: 'Para el que ya hizo un tapiz y quiere ir por uno grande.',
    larga: 'El salto de la pieza chica a la grande. Trabajamos estructura, peso y tensión: por qué un tapiz de un metro se deforma si no se planifica antes de empezar.',
    resultados: ['Diseñar una pieza de más de 1 m', 'Trabajar con varias tensiones', 'Sumar cuentas y madera a la trama', 'Colgar sin que se venza el centro'],
    kitId: 'p19',
    modulos: [
      { titulo: 'Estructura y peso', clases: [
        { t: 'Por qué se deforma un tapiz grande', d: '16 min', preview: true },
        { t: 'Repartir el peso en la varilla', d: '21 min' },
        { t: 'Tensión pareja en cordones largos', d: '18 min' }
      ] },
      { titulo: 'Trama y textura', clases: [
        { t: 'Nudo festón en diagonal', d: '24 min' },
        { t: 'Sumar cuentas de madera', d: '17 min' },
        { t: 'Capas y profundidad', d: '23 min' }
      ] },
      { titulo: 'Terminación', clases: [
        { t: 'Cortar flecos sin arruinar la pieza', d: '15 min' },
        { t: 'Cepillado y planchado del algodón', d: '12 min' }
      ] }
    ]
  },
  {
    id: 'c3', titulo: 'Bijouterie con mostacillas', categoria: 'cursos', precio: 28000, descuento: 0,
    nivel: 'Principiante', modalidad: 'Online', clases: 5, duracion: '3 h', destacado: true, nuevo: false,
    img: 'collar-hebras.webp',
    corta: 'Aros y collares tejidos punto por punto, desde cero.',
    larga: 'Cómo se teje la mostacilla: el punto peyote, el ladrillo y el circular. Con esos tres puntos podés hacer casi cualquier pieza que veas en el catálogo.',
    resultados: ['Tejer punto peyote y ladrillo', 'Armar un medallón circular', 'Montar aros con gancho de acero', 'Elegir mostacilla que no se rompa'],
    kitId: 'p17',
    modulos: [
      { titulo: 'El punto base', clases: [
        { t: 'Mostacillas: cuáles sirven', d: '11 min', preview: true },
        { t: 'Punto peyote paso a paso', d: '25 min' },
        { t: 'Cerrar y esconder el hilo', d: '13 min' }
      ] },
      { titulo: 'Piezas terminadas', clases: [
        { t: 'Medallón circular', d: '28 min' },
        { t: 'Montaje de aros', d: '16 min' }
      ] }
    ]
  },
  {
    id: 'c4', titulo: 'Taller presencial en Paraná', categoria: 'cursos', precio: 25000, descuento: 0,
    nivel: 'Todos los niveles', modalidad: 'Presencial', clases: 1, duracion: '3 h', destacado: false, nuevo: true,
    img: 'curso-presencial.webp',
    corta: 'Un encuentro de tres horas con los materiales puestos.',
    larga: 'Un sábado a la tarde, grupo chico, materiales incluidos. Te llevás la pieza terminada y el sobrante de cordón para seguir en casa. Las fechas se confirman por WhatsApp.',
    resultados: ['Terminar una pieza en el día', 'Corregir la postura de las manos', 'Llevarte el material sobrante', 'Resolver dudas en el momento'],
    kitId: null,
    modulos: [
      { titulo: 'El encuentro', clases: [
        { t: 'Presentación y materiales', d: '20 min' },
        { t: 'Práctica guiada', d: '2 h' },
        { t: 'Terminación y remate', d: '40 min' }
      ] }
    ]
  },
  {
    id: 'c5', titulo: 'Vendé lo que hacés a mano', categoria: 'cursos', precio: 34000, descuento: 0,
    nivel: 'Intermedio', modalidad: 'Online', clases: 6, duracion: '4 h', destacado: false, nuevo: false,
    img: 'curso-emprender.webp',
    corta: 'Cómo poner precio, fotografiar y vender sin regalar tu trabajo.',
    larga: 'La parte que nadie enseña: cuánto cobrar, cómo sacar una foto que venda con el celular y cómo organizar los encargos para no volverte loca en diciembre.',
    resultados: ['Calcular tu precio con las horas adentro', 'Fotografiar piezas con luz natural', 'Armar un catálogo simple', 'Organizar encargos y entregas'],
    kitId: null,
    modulos: [
      { titulo: 'El precio', clases: [
        { t: 'Costo real de una pieza', d: '22 min', preview: true },
        { t: 'Cuánto vale tu hora', d: '18 min' }
      ] },
      { titulo: 'Mostrarlo', clases: [
        { t: 'Fotos con celular y luz natural', d: '24 min' },
        { t: 'Fondo, encuadre y escala', d: '16 min' }
      ] },
      { titulo: 'Vender', clases: [
        { t: 'Responder consultas sin perder tiempo', d: '19 min' },
        { t: 'Agenda de encargos', d: '15 min' }
      ] }
    ]
  }
];

const SORTEO = { paso: 10000, fecha: '30 de septiembre', premioId: 'p16' };

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const precioAR = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = it => it.descuento > 0 ? Math.round(it.precio * (1 - it.descuento / 100)) : it.precio;
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const catDe = id => CATEGORIAS.find(c => c.id === id);
const colorDe = it => catDe(it.type === 'curso' ? 'cursos' : it.categoria)?.color || 'var(--c1)';
const varKey = v => v ? norm(v).replace(/[^a-z0-9]+/g, '-') : '_';

const ITEMS = [
  ...PRODUCTOS.map(p => ({ ...p, type: 'producto' })),
  ...CURSOS.map(c => ({ ...c, type: 'curso', nombre: c.titulo }))
];
const getItem = (type, id) => ITEMS.find(i => i.type === type && i.id === id);

const Cart = {
  KEY: 'ciencolores_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(type, id, variante, qty = 1) {
    const it = getItem(type, id);
    if (!it) return;
    const key = type === 'curso' ? `course:${id}` : `product:${id}:${varKey(variante)}`;
    const items = this.get();
    const existing = items.find(l => l.key === key);
    if (type === 'curso') {
      if (!existing) items.push({ key, type, id, variante: null, qty: 1 });
    } else if (existing) {
      existing.qty = Math.min(existing.qty + qty, it.stock ?? 99);
    } else {
      items.push({ key, type, id, variante: variante || null, qty: Math.min(qty, it.stock ?? 99) });
    }
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get();
    const l = items.find(x => x.key === key);
    if (!l) return;
    const it = getItem(l.type, l.id);
    l.qty = Math.max(1, Math.min(qty, it?.stock ?? 99));
    this.save(items);
  },
  remove(key) { this.save(this.get().filter(l => l.key !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, l) => s + l.qty, 0); },
  lineas() {
    return this.get().map(l => {
      const it = getItem(l.type, l.id);
      return it ? { ...l, item: it, unit: precioFinal(it), sub: precioFinal(it) * l.qty } : null;
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.sub, 0); },
  totalPor(type) { return this.lineas().filter(l => l.type === type).reduce((s, l) => s + l.sub, 0); }
};

const Sorteo = {
  KEY: 'ciencolores_numeros',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(n) { localStorage.setItem(this.KEY, JSON.stringify(n)); document.dispatchEvent(new CustomEvent('sorteo:updated')); },
  porMonto(monto) { return Math.floor(monto / SORTEO.paso); },
  generar(cant) {
    const actuales = this.get();
    const nuevos = [];
    while (nuevos.length < cant) {
      const n = String(Math.floor(1000 + Math.random() * 9000));
      if (!actuales.includes(n) && !nuevos.includes(n)) nuevos.push(n);
    }
    this.save([...actuales, ...nuevos]);
    return nuevos;
  },
  reset() { this.save([]); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

const ICO = {
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 11 5-3v8l-5-3z"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h13M13 6l6 6-6 6"/></svg>'
};

let revealsListos = false;

function cardHTML(it, opts = {}) {
  const cc = colorDe(it);
  const fin = precioFinal(it);
  const esCurso = it.type === 'curso';
  const agotado = !esCurso && it.stock <= 0;
  const badges = [];
  if (it.nuevo) badges.push('<span class="tag tag-nuevo">Nuevo</span>');
  if (it.descuento > 0) badges.push(`<span class="tag tag-off">-${it.descuento}%</span>`);
  const meta = esCurso
    ? `${esc(it.nivel)} · ${it.clases} ${it.clases === 1 ? 'encuentro' : 'clases'} · ${esc(it.modalidad)}`
    : (it.variantes ? `${it.variantes.opciones.length} ${esc(it.variantes.label.toLowerCase())}` : esc(it.corta));
  const precio = it.descuento > 0
    ? `<span class="con-off">${precioAR(fin)}</span> <s>${precioAR(it.precio)}</s>`
    : precioAR(fin);
  const accion = esCurso
    ? `<button type="button" class="card-add" data-add="curso:${it.id}">Inscribirme</button>`
    : `<div class="stepper" data-stepper="${it.id}">
         <button type="button" data-step="-1" aria-label="Quitar uno" disabled>−</button>
         <span data-qty>1</span>
         <button type="button" data-step="1" aria-label="Agregar uno">+</button>
       </div>
       <button type="button" class="card-add" data-add="producto:${it.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>`;
  const anim = opts.animar === false ? '' : ' data-animate="up" style="transform:translateY(18px);opacity:0"';
  return `<li class="card" style="--cc:${cc}"${anim}>
    <span class="card-tira"></span>
    <button type="button" class="card-media" data-open="${it.type}:${it.id}" aria-label="Ver ${esc(it.nombre)}">
      <img src="images/${it.img}" alt="${esc(it.nombre)}" width="1200" height="1200" decoding="async">
      <span class="card-badges">${badges.join('')}</span>
      <span class="tag tag-tipo">${esCurso ? 'Curso' : 'Producto'}</span>
    </button>
    <div class="card-body">
      <p class="card-cat">${esc(catDe(esCurso ? 'cursos' : it.categoria)?.nombre || '')}</p>
      <h3 class="card-nombre"><button type="button" data-open="${it.type}:${it.id}">${esc(it.nombre)}</button></h3>
      <p class="card-meta">${meta}</p>
      <p class="card-precio">${precio}</p>
      <div class="card-actions">${accion}</div>
    </div>
  </li>`;
}

function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = c.id === 'cursos' ? CURSOS.length : PRODUCTOS.filter(p => p.categoria === c.id).length;
    return `<li data-animate="up" style="transform:translateY(20px);opacity:0">
      <a class="cat-card" href="#tienda" data-cat="${c.id}" style="--cc:${c.color}">
        <span class="cat-barra"></span>
        <img src="images/${c.img}" alt="${esc(c.nombre)}" width="1200" height="1600" decoding="async">
        <span class="cat-info">
          <span class="cat-nombre">${esc(c.nombre)}</span>
          <span class="cat-n">${n} ${n === 1 ? 'opción' : 'opciones'} · ${esc(c.pie)}</span>
        </span>
        <span class="cat-flecha">${ICO.flecha}</span>
      </a>
    </li>`;
  }).join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;

  const destacados = ITEMS.filter(i => i.destacado);
  track.innerHTML = destacados.map(i => cardHTML(i)).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const stepSize = () => {
    const card = track.querySelector('.card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * .8;
  };
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= 8;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    void inicio;
  };
  const behavior = reduceMotion ? 'auto' : 'smooth';
  prev?.addEventListener('click', () => vp.scrollBy({ left: -stepSize(), behavior }));
  next?.addEventListener('click', () => vp.scrollBy({ left: stepSize(), behavior }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();

  let down = false, moved = false, justDragged = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      justDragged = true;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => { justDragged = false; }, 60);
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
}

const estado = { tab: 'todo', q: '', categorias: [], niveles: [], modalidades: [], disp: [], precioMax: null, visibles: 16 };
const PRECIO_TOPE = Math.max(...ITEMS.map(precioFinal));

function filtrados() {
  const q = norm(estado.q).trim();
  return ITEMS.filter(it => {
    if (estado.tab !== 'todo' && it.type !== estado.tab) return false;
    if (estado.categorias.length) {
      const cid = it.type === 'curso' ? 'cursos' : it.categoria;
      if (!estado.categorias.includes(cid)) return false;
    }
    if (it.type === 'curso') {
      if (estado.niveles.length && !estado.niveles.includes(it.nivel)) return false;
      if (estado.modalidades.length && !estado.modalidades.includes(it.modalidad)) return false;
    } else {
      if (estado.disp.length) {
        const hay = it.stock > 0;
        if (estado.disp.includes('disponible') && !hay) return false;
        if (estado.disp.includes('oferta') && !(it.descuento > 0)) return false;
      }
    }
    if (estado.precioMax != null && precioFinal(it) > estado.precioMax) return false;
    if (q) {
      const heno = norm([
        it.nombre, it.corta, it.larga, catDe(it.type === 'curso' ? 'cursos' : it.categoria)?.nombre,
        it.nivel, it.modalidad, it.variantes?.opciones?.join(' '), it.detalles?.join(' '), it.resultados?.join(' ')
      ].filter(Boolean).join(' '));
      if (!q.split(/\s+/).every(w => heno.includes(w))) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const cont = document.getElementById('catalogo');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!cont) return;

  const lista = filtrados();
  const mostrar = lista.slice(0, estado.visibles);
  cont.innerHTML = mostrar.map(i => cardHTML(i)).join('');
  cont.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  if (res) {
    res.textContent = lista.length === 0
      ? 'Sin resultados'
      : `${lista.length} ${lista.length === 1 ? 'artículo' : 'artículos'}${lista.length > mostrar.length ? ` · mostrando ${mostrar.length}` : ''}`;
  }

  const nTodo = document.getElementById('nTodo');
  const nProd = document.getElementById('nProd');
  const nCur = document.getElementById('nCur');
  if (nTodo) nTodo.textContent = ITEMS.length;
  if (nProd) nProd.textContent = PRODUCTOS.length;
  if (nCur) nCur.textContent = CURSOS.length;

  const fn = document.getElementById('filtrosN');
  const activos = estado.categorias.length + estado.niveles.length + estado.modalidades.length + estado.disp.length + (estado.precioMax != null ? 1 : 0);
  if (fn) { fn.textContent = activos; fn.hidden = activos === 0; }

  document.getElementById('grupoNivel').hidden = estado.tab === 'producto';
  document.getElementById('grupoModalidad').hidden = estado.tab === 'producto';
  document.getElementById('grupoDisp').hidden = estado.tab === 'curso';

  revelarNuevos(cont);
  if (hasST) requestAnimationFrame(() => ScrollTrigger.refresh());
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCategoria');
  const chipsNivel = document.getElementById('chipsNivel');
  const chipsMod = document.getElementById('chipsModalidad');
  const chipsDisp = document.getElementById('chipsDisp');
  const rango = document.getElementById('precioMax');
  const precioVal = document.getElementById('precioVal');

  chipsCat.innerHTML = CATEGORIAS.map(c => `<button type="button" class="chip" data-f="categorias" data-v="${c.id}" style="--cc:${c.color}">${esc(c.nombre)}</button>`).join('');
  chipsNivel.innerHTML = [...new Set(CURSOS.map(c => c.nivel))].map(n => `<button type="button" class="chip sin-punto" data-f="niveles" data-v="${esc(n)}">${esc(n)}</button>`).join('');
  chipsMod.innerHTML = [...new Set(CURSOS.map(c => c.modalidad))].map(m => `<button type="button" class="chip sin-punto" data-f="modalidades" data-v="${esc(m)}">${esc(m)}</button>`).join('');
  chipsDisp.innerHTML = `<button type="button" class="chip sin-punto" data-f="disp" data-v="disponible">Con stock</button><button type="button" class="chip sin-punto" data-f="disp" data-v="oferta">En oferta</button>`;

  rango.max = PRECIO_TOPE;
  rango.value = PRECIO_TOPE;
  rango.step = 500;
  precioVal.textContent = precioAR(PRECIO_TOPE);

  document.getElementById('filtrosPanel').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const f = chip.dataset.f, v = chip.dataset.v;
    const arr = estado[f];
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v);
    chip.classList.toggle('is-on', i < 0);
    estado.visibles = 16;
    renderCatalogo();
  });

  rango.addEventListener('input', () => {
    const v = +rango.value;
    estado.precioMax = v >= PRECIO_TOPE ? null : v;
    precioVal.textContent = precioAR(v);
    estado.visibles = 16;
    renderCatalogo();
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle.addEventListener('click', () => {
    const abierto = !panel.hidden;
    panel.hidden = abierto;
    toggle.setAttribute('aria-expanded', String(!abierto));
    if (hasST) requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  const limpiar = () => {
    estado.categorias = []; estado.niveles = []; estado.modalidades = []; estado.disp = [];
    estado.precioMax = null; estado.q = ''; estado.visibles = 16;
    document.querySelectorAll('#filtrosPanel .chip').forEach(c => c.classList.remove('is-on'));
    rango.value = PRECIO_TOPE;
    precioVal.textContent = precioAR(PRECIO_TOPE);
    const q = document.getElementById('q');
    q.value = '';
    document.getElementById('qClear').hidden = true;
    renderCatalogo();
  };
  document.getElementById('fpLimpiar').addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar').addEventListener('click', limpiar);

  const q = document.getElementById('q');
  const qClear = document.getElementById('qClear');
  let t;
  q.addEventListener('input', () => {
    qClear.hidden = !q.value;
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value; estado.visibles = 16; renderCatalogo(); }, 180);
  });
  qClear.addEventListener('click', () => { q.value = ''; qClear.hidden = true; estado.q = ''; estado.visibles = 16; renderCatalogo(); q.focus(); });

  document.getElementById('buscarToggle').addEventListener('click', () => {
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => q.focus(), reduceMotion ? 0 : 600);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });

  document.getElementById('verMas').addEventListener('click', () => {
    estado.visibles += 16;
    renderCatalogo();
  });
}

function setTab(tab) {
  estado.tab = tab;
  estado.visibles = 16;
  if (tab === 'producto') { estado.niveles = []; estado.modalidades = []; }
  if (tab === 'curso') { estado.disp = []; }
  document.querySelectorAll('.tab').forEach(t => {
    const on = t.dataset.tab === tab;
    t.classList.toggle('is-on', on);
    t.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('#filtrosPanel .chip').forEach(c => {
    if (!estado[c.dataset.f].includes(c.dataset.v)) c.classList.remove('is-on');
  });
  renderCatalogo();
}

function irACatalogo(tab, categoria) {
  if (tab) setTab(tab);
  if (categoria) {
    estado.categorias = [categoria];
    estado.visibles = 16;
    document.querySelectorAll('#filtrosPanel .chip[data-f="categorias"]').forEach(c => {
      c.classList.toggle('is-on', c.dataset.v === categoria);
    });
    if (categoria === 'cursos') setTab('curso');
    renderCatalogo();
  }
  document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initAtajos() {
  document.addEventListener('click', e => {
    const catLink = e.target.closest('[data-cat]');
    if (catLink) {
      e.preventDefault();
      irACatalogo(null, catLink.dataset.cat);
      return;
    }
    const tabLink = e.target.closest('[data-tab-link]');
    if (tabLink) {
      e.preventDefault();
      const t = tabLink.dataset.tabLink;
      estado.categorias = [];
      document.querySelectorAll('#filtrosPanel .chip[data-f="categorias"]').forEach(c => c.classList.remove('is-on'));
      irACatalogo(t === 'todo' ? 'todo' : t);
    }
  });
}

function initCards() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const wrap = step.closest('[data-stepper]');
      const span = wrap.querySelector('[data-qty]');
      const it = getItem('producto', wrap.dataset.stepper);
      const max = it?.stock ?? 99;
      let n = parseInt(span.textContent, 10) + parseInt(step.dataset.step, 10);
      n = Math.max(1, Math.min(n, max));
      span.textContent = n;
      wrap.querySelector('[data-step="-1"]').disabled = n <= 1;
      wrap.querySelector('[data-step="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const [type, id] = add.dataset.add.split(':');
      const card = add.closest('.card, .mg');
      const qtyEl = card?.querySelector('[data-qty]');
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      const varSel = card?.querySelector('.chip.is-on[data-variante]');
      const it = getItem(type, id);
      Cart.add(type, id, varSel?.dataset.variante || (it?.variantes ? it.variantes.opciones[0] : null), qty);
      showToast(type === 'curso' ? '¡Curso agregado! Ya está en tu carrito.' : '¡Agregado! Tu carrito te espera.');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const [type, id] = buy.dataset.buy.split(':');
      const card = buy.closest('.mg');
      const qtyEl = card?.querySelector('[data-qty]');
      const varSel = card?.querySelector('.chip.is-on[data-variante]');
      const it = getItem(type, id);
      Cart.add(type, id, varSel?.dataset.variante || (it?.variantes ? it.variantes.opciones[0] : null), qtyEl ? parseInt(qtyEl.textContent, 10) : 1);
      cerrarModal();
      abrirDrawer();
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) {
      const [type, id] = open.dataset.open.split(':');
      abrirModal(type, id);
    }
  });
}

let ultimoFoco = null;
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');

function modalProductoHTML(p) {
  const cc = colorDe(p);
  const fin = precioFinal(p);
  const precio = p.descuento > 0
    ? `<span class="con-off">${precioAR(fin)}</span> <s>${precioAR(p.precio)}</s> <span class="tag tag-off">-${p.descuento}%</span>`
    : precioAR(fin);
  const vars = p.variantes ? `
    <p class="mg-var-label">${esc(p.variantes.label)}</p>
    <div class="mg-vars">${p.variantes.opciones.map((o, i) => `<button type="button" class="chip sin-punto${i === 0 ? ' is-on' : ''}" data-variante="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : '';
  const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const curso = CURSOS.find(c => c.kitId === p.id);
  return `<div class="mg" style="--cc:${cc}">
    <div class="mg-media"><span class="mg-tira"></span><img src="images/${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200"></div>
    <div class="mg-info">
      <p class="mg-cat">${esc(catDe(p.categoria)?.nombre || '')}</p>
      <h2 class="mg-titulo">${esc(p.nombre)}</h2>
      <p class="mg-desc">${esc(p.larga)}</p>
      <p class="mg-precio">${precio}</p>
      <div class="mg-datos">
        <span class="mg-dato">${p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}</span>
        <span class="mg-dato">Hecho a mano</span>
      </div>
      ${vars}
      <p class="mg-h">Detalles</p>
      <ul class="mg-lista">${p.detalles.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <div class="stepper" data-stepper="${p.id}">
        <button type="button" data-step="-1" aria-label="Quitar uno" disabled>−</button>
        <span data-qty>1</span>
        <button type="button" data-step="1" aria-label="Agregar uno">+</button>
      </div>
      <div class="mg-acciones">
        <button type="button" class="btn btn-line" data-add="producto:${p.id}"${p.stock <= 0 ? ' disabled' : ''}><span class="btn-t">Agregar al carrito</span></button>
        <button type="button" class="btn btn-cta" data-buy="producto:${p.id}"${p.stock <= 0 ? ' disabled' : ''}><span class="btn-t">Comprar ahora</span></button>
      </div>
      ${curso ? `<p class="mg-h">Se usa en este curso</p>
      <button type="button" class="mg-rel mg-rel-fila" data-open="curso:${curso.id}">
        <img src="images/${curso.img}" alt="" width="1500" height="1100">
        <span><span class="mg-rel-nombre">${esc(curso.titulo)}</span><span class="mg-rel-precio">${precioAR(precioFinal(curso))}</span></span>
      </button>` : ''}
    </div>
  </div>
  ${rel.length ? `<div class="mg-relacionados">
    <p class="mg-h mg-h-top">También te puede interesar</p>
    <div class="mg-rel-grid">${rel.map(r => `<button type="button" class="mg-rel" data-open="producto:${r.id}">
      <img src="images/${r.img}" alt="" width="1200" height="1200">
      <span class="mg-rel-nombre">${esc(r.nombre)}</span>
      <span class="mg-rel-precio">${precioAR(precioFinal(r))}</span>
    </button>`).join('')}</div>
  </div>` : ''}`;
}

function modalCursoHTML(c) {
  const cc = colorDe(c);
  const fin = precioFinal(c);
  const precio = c.descuento > 0
    ? `<span class="con-off">${precioAR(fin)}</span> <s>${precioAR(c.precio)}</s> <span class="tag tag-off">-${c.descuento}%</span>`
    : precioAR(fin);
  const kit = c.kitId ? PRODUCTOS.find(p => p.id === c.kitId) : null;
  const totalClases = c.modulos.reduce((s, m) => s + m.clases.length, 0);
  return `<div class="mg" style="--cc:${cc}">
    <div class="mg-media"><span class="mg-tira"></span><img src="images/${c.img}" alt="${esc(c.titulo)}" width="1500" height="1100"></div>
    <div class="mg-info">
      <p class="mg-cat">Curso · ${esc(c.modalidad)}</p>
      <h2 class="mg-titulo">${esc(c.titulo)}</h2>
      <p class="mg-desc">${esc(c.larga)}</p>
      <p class="mg-precio">${precio}</p>
      <div class="mg-datos">
        <span class="mg-dato">${esc(c.nivel)}</span>
        <span class="mg-dato">${totalClases} ${totalClases === 1 ? 'clase' : 'clases'}</span>
        <span class="mg-dato">${esc(c.duracion)}</span>
        <span class="mg-dato">${esc(c.modalidad)}</span>
      </div>
      <p class="mg-h">Qué vas a poder hacer</p>
      <ul class="mg-lista">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <div class="mg-acciones">
        <button type="button" class="btn btn-line" data-add="curso:${c.id}"><span class="btn-t">Agregar al carrito</span></button>
        <button type="button" class="btn btn-cta" data-buy="curso:${c.id}"><span class="btn-t">Inscribirme ahora</span></button>
      </div>
      ${kit ? `<p class="mg-h">Materiales del curso</p>
      <button type="button" class="mg-rel mg-rel-fila" data-open="producto:${kit.id}">
        <img src="images/${kit.img}" alt="" width="1200" height="1200">
        <span><span class="mg-rel-nombre">${esc(kit.nombre)}</span><span class="mg-rel-precio">${precioAR(precioFinal(kit))}</span></span>
      </button>` : ''}
    </div>
  </div>
  <div class="mg-relacionados">
    <p class="mg-h mg-h-top">El programa</p>
    <div class="mg-modulos">
      ${c.modulos.map((m, i) => `<details${i === 0 ? ' open' : ''}>
        <summary>${esc(m.titulo)} <span>${m.clases.length} ${m.clases.length === 1 ? 'clase' : 'clases'}</span></summary>
        <ul>${m.clases.map(cl => `<li>${ICO.video}<span>${esc(cl.t)}</span>${cl.preview ? '<span class="mg-preview">Preview</span>' : ''}<span class="mg-clase-dur">${esc(cl.d)}</span></li>`).join('')}</ul>
      </details>`).join('')}
    </div>
    <p class="mg-h">Quién lo da</p>
    <div class="mg-docente">
      <span class="mg-docente-ico" aria-hidden="true"></span>
      <span>
        <span class="mg-docente-nombre">${esc(DOCENTE.nombre)}</span>
        <span class="mg-docente-bio" style="display:block">${esc(DOCENTE.bio)}</span>
      </span>
    </div>
  </div>`;
}

function abrirModal(type, id) {
  const it = getItem(type, id);
  if (!it) return;
  ultimoFoco = document.activeElement;
  document.getElementById('modalBody').innerHTML = type === 'curso' ? modalCursoHTML(it) : modalProductoHTML(it);
  modal.setAttribute('aria-label', it.nombre);
  modalBackdrop.hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => { modalBackdrop.classList.add('open'); modal.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function cerrarModal() {
  if (modal.hidden) return;
  modal.classList.remove('open');
  modalBackdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; modalBackdrop.hidden = true; }, 300);
  ultimoFoco?.focus();
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  modalBackdrop.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    const chip = e.target.closest('[data-variante]');
    if (chip) {
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) {
      const f = modal.querySelectorAll('button:not(:disabled), a[href], input, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const lineas = Cart.lineas();

  if (!lineas.length) {
    body.innerHTML = `<div class="dvacio">
      <span class="dvacio-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></span>
      <h3>Tu carrito está vacío</h3>
      <p>Agregá una pieza o un curso y volvé por acá. Cada compra suma números para el sorteo.</p>
    </div>`;
    foot.hidden = true;
    return;
  }

  const grupos = [
    { tipo: 'producto', titulo: 'Productos con entrega', color: 'var(--c1)' },
    { tipo: 'curso', titulo: 'Acceso digital', color: 'var(--c4)' }
  ];
  body.innerHTML = grupos.map(g => {
    const ls = lineas.filter(l => l.type === g.tipo);
    if (!ls.length) return '';
    return `<div class="dgrupo">
      <p class="dgrupo-titulo" style="--cc:${g.color}">${g.titulo}</p>
      ${ls.map(l => `<div class="dlinea">
        <img src="images/${l.item.img}" alt="" width="1200" height="1200">
        <div>
          <p class="dl-nombre">${esc(l.item.nombre)}</p>
          ${l.variante ? `<p class="dl-var">${esc(l.variante)}</p>` : ''}
          ${l.type === 'curso' ? `<p class="dl-var">${esc(l.item.modalidad)} · ${esc(l.item.nivel)}</p>` : ''}
          <p class="dl-precio">${precioAR(l.sub)}</p>
        </div>
        <div class="dl-acciones">
          ${l.type === 'producto' ? `<div class="stepper">
            <button type="button" data-dqty="${l.key}" data-d="-1" aria-label="Quitar uno">−</button>
            <span>${l.qty}</span>
            <button type="button" data-dqty="${l.key}" data-d="1" aria-label="Agregar uno">+</button>
          </div>` : '<span class="dl-var">1 acceso</span>'}
          <button type="button" class="dl-quitar" data-drem="${l.key}">Quitar</button>
        </div>
      </div>`).join('')}
    </div>`;
  }).join('');

  const total = Cart.total();
  const tFis = Cart.totalPor('producto');
  const tDig = Cart.totalPor('curso');
  const nums = Sorteo.porMonto(total);

  document.getElementById('dSorteo').innerHTML =
    `<b>${nums}</b><span>${nums === 1 ? 'número' : 'números'} para el sorteo con este carrito${nums === 0 ? ` · sumás uno cada ${precioAR(SORTEO.paso)}` : ''}</span>`;

  document.getElementById('dTotales').innerHTML = `
    ${tFis ? `<div><dt>Productos</dt><dd>${precioAR(tFis)}</dd></div>` : ''}
    ${tDig ? `<div><dt>Cursos</dt><dd>${precioAR(tDig)}</dd></div>` : ''}
    ${tFis ? '<div><dt>Envío</dt><dd>Se coordina por WhatsApp</dd></div>' : ''}
    <div class="dtotal"><dt>Total</dt><dd>${precioAR(total)}</dd></div>`;

  const bloques = ['Hola Cien Colores, quiero hacer este pedido:'];
  if (tFis) {
    bloques.push('\nProductos:\n' + lineas.filter(l => l.type === 'producto')
      .map(l => `- ${l.item.nombre}${l.variante ? ` (${l.variante})` : ''} x${l.qty} - ${precioAR(l.sub)}`).join('\n'));
  }
  if (tDig) {
    bloques.push('\nCursos:\n' + lineas.filter(l => l.type === 'curso')
      .map(l => `- ${l.item.nombre} (${l.item.modalidad}) - ${precioAR(l.sub)}`).join('\n'));
  }
  bloques.push(`\nTotal: ${precioAR(total)}`);
  if (nums > 0) bloques.push(`Me corresponden ${nums} ${nums === 1 ? 'numero' : 'numeros'} para el sorteo.`);
  document.getElementById('drawerWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(bloques.join('\n'))}`;

  foot.hidden = false;
}

function abrirDrawer() {
  renderDrawer();
  drawerBackdrop.hidden = false;
  drawer.hidden = false;
  requestAnimationFrame(() => { drawerBackdrop.classList.add('open'); drawer.classList.add('open'); });
  document.body.classList.add('no-scroll');
  ultimoFoco = document.activeElement;
  document.getElementById('drawerClose').focus();
}

function cerrarDrawer() {
  if (drawer.hidden) return;
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; drawerBackdrop.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  document.getElementById('cartHeader').addEventListener('click', abrirDrawer);
  document.getElementById('cart-float').addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose').addEventListener('click', cerrarDrawer);
  drawerBackdrop.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) cerrarDrawer(); });

  drawer.addEventListener('click', e => {
    const q = e.target.closest('[data-dqty]');
    if (q) {
      const linea = Cart.get().find(x => x.key === q.dataset.dqty);
      if (!linea) return;
      const nueva = linea.qty + parseInt(q.dataset.d, 10);
      if (nueva < 1) Cart.remove(q.dataset.dqty);
      else Cart.setQty(q.dataset.dqty, nueva);
      return;
    }
    const rem = e.target.closest('[data-drem]');
    if (rem) { Cart.remove(rem.dataset.drem); return; }
  });

  document.getElementById('finalizar').addEventListener('click', () => {
    const total = Cart.total();
    const n = Sorteo.porMonto(total);
    if (n > 0) {
      const nuevos = Sorteo.generar(n);
      showToast(`¡Listo! Sumaste ${n} ${n === 1 ? 'número' : 'números'}: ${nuevos.join(', ')}`);
    } else {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
    Cart.clear();
    cerrarDrawer();
    setTimeout(() => document.getElementById('sorteo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 420);
  });

  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderDrawer(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
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

function renderSorteo() {
  const nums = Sorteo.get();
  const total = document.getElementById('sorteoTotal');
  const lista = document.getElementById('sorteoNumeros');
  const vacio = document.getElementById('sorteoVacio');
  if (total) total.textContent = nums.length;
  if (lista) lista.innerHTML = nums.slice(-24).map(n => `<li>${esc(n)}</li>`).join('');
  if (vacio) vacio.hidden = nums.length > 0;

  const premio = PRODUCTOS.find(p => p.id === SORTEO.premioId);
  const box = document.getElementById('sorteoPremio');
  if (box && premio) {
    box.innerHTML = `<img src="images/${premio.img}" alt="" width="1200" height="1200">
      <span><span class="sp-premio-nombre">${esc(premio.nombre)}</span>
      <span class="sp-premio-val">Valor ${precioAR(precioFinal(premio))}</span></span>`;
  }
  document.querySelectorAll('[data-sorteo-paso]').forEach(el => { el.textContent = precioAR(SORTEO.paso); });
  document.querySelectorAll('[data-sorteo-fecha]').forEach(el => { el.textContent = SORTEO.fecha; });
}

function initSorteo() {
  renderSorteo();
  document.addEventListener('sorteo:updated', renderSorteo);
  document.getElementById('sorteoReset').addEventListener('click', () => {
    Sorteo.reset();
    showToast('Listo, borramos tus números de la demo.');
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.barra');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHero() {
  const items = document.querySelectorAll('[data-hero]');
  if (!items.length) return;
  if (!hasGsap || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('[data-hero="1"]', { opacity: 1, y: 0, duration: .6 }, .1)
    .to('[data-hero="2"]', { opacity: 1, y: 0, duration: .8 }, .18)
    .from('.hero-marca .marca-letras i:not(.marca-espacio)', { scale: 0.2, y: 12, duration: .7, stagger: .045, ease: 'back.out(3)' }, .38)
    .to('[data-hero="3"]', { opacity: 1, y: 0, duration: .8 }, .34)
    .to('[data-hero="4"]', { opacity: 1, y: 0, duration: .7 }, .48)
    .to('[data-hero="5"]', { opacity: 1, y: 0, duration: .7 }, .58)
    .to('[data-hero="6"]', { opacity: 1, y: 0, duration: .6 }, .66)
    .from('.hero-swatches li', { scale: 0, duration: .5, stagger: .06, ease: 'back.out(2.4)' }, .7)
    .to('[data-hero="7"]', { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'expo.out' }, .26)
    .to('[data-hero="8"]', { opacity: 1, y: 0, rotate: -3, duration: .7, ease: 'back.out(1.6)' }, .78);

  if (hasST) {
    gsap.to('.hero-nudo', {
      rotate: 38, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
  }
}

function nudoPrep() {
  document.querySelectorAll('#nudoSvg .cord-izq, #nudoSvg .cord-der, #nudoSvg .cord-tira').forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
}

function nudoEstatico() {
  document.querySelectorAll('#nudoSvg .cord-izq, #nudoSvg .cord-der, #nudoSvg .cord-tira').forEach(p => { p.style.strokeDashoffset = 0; });
  const tira = document.getElementById('nudoTira');
  const marcas = document.getElementById('nudoMarcas');
  if (tira) tira.style.opacity = 1;
  if (marcas) marcas.querySelectorAll('.marca').forEach(m => { m.style.opacity = 1; });
  document.getElementById('pasosNudo')?.classList.add('is-static');
}

function nudoTl(tl) {
  tl.to('#nudoSvg .cord-base', { strokeWidth: 18, duration: .5, ease: 'power2.out' }, 0)
    .fromTo('#nudoSvg .nudo-guia path', { opacity: 0 }, { opacity: 1, duration: .5 }, 0)

    .to('#nudoSvg .cord-izq', { strokeDashoffset: 0, duration: 1, ease: 'none' }, 1)
    .to('#nudoSvg .cord-der', { strokeDashoffset: 0, duration: 1, ease: 'none' }, 2)

    .to('#nudoSvg .marca', { opacity: 1, duration: .3 }, 3)
    .fromTo('#nudoSvg .marca', { attr: { r: 26 } }, { attr: { r: 13 }, duration: .7, ease: 'power3.out' }, 3)
    .to('#nudoSvg .cord-izq, #nudoSvg .cord-der', { strokeWidth: 13, duration: .6, ease: 'power2.inOut' }, 3.2)

    .to('#nudoTira', { opacity: 1, duration: .35 }, 4)
    .to('#nudoSvg .cord-tira', { strokeDashoffset: 0, duration: .7, stagger: .18, ease: 'power2.out' }, 4.05);
  return tl;
}

function initNudo() {
  const stage = document.getElementById('stage');
  const pasos = document.getElementById('pasosNudo');
  if (!stage || !pasos) return;
  const items = [...pasos.querySelectorAll('.paso-nudo')];
  if (!hasGsap || !hasST) { nudoEstatico(); items.forEach(p => p.classList.add('is-on')); return; }

  nudoPrep();
  const hudNow = document.getElementById('hudNow');
  const hudFill = document.getElementById('hudFill');
  const hudLabel = document.getElementById('hudLabel');
  const colores = ['var(--c3)', 'var(--c1)', 'var(--c2)', 'var(--c5)', 'var(--c4)'];

  const setStep = p => {
    const i = Math.max(0, Math.min(items.length - 1, Math.floor(p * items.length)));
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (hudNow) hudNow.textContent = String(i + 1).padStart(2, '0');
    if (hudFill) {
      hudFill.style.transform = `scaleX(${Math.max(0, Math.min(1, p)).toFixed(3)})`;
      hudFill.style.background = colores[i];
    }
    if (hudLabel) hudLabel.textContent = items[i]?.querySelector('h3')?.textContent || '';
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    nudoEstatico();
    items.forEach(p => p.classList.add('is-on'));
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=250%',
        pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    nudoTl(tl);
    setStep(0);
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom',
        scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    nudoTl(tl);
    setStep(0);
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initSchema() {
  const base = 'https://gokywebs.com/demo/ciencolores/';
  const graph = [
    {
      '@type': 'Organization', '@id': base + '#org', name: 'Cien Colores',
      description: 'Taller de macramé y bijouterie hechos a mano, con cursos y venta online.',
      url: base, telephone: '+' + WSP, email: 'hola@ciencolores.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Paraná', addressRegion: 'Entre Ríos', addressCountry: 'AR' }
    },
    ...PRODUCTOS.map(p => ({
      '@type': 'Product', name: p.nombre, description: p.corta,
      image: base + 'images/' + p.img, category: catDe(p.categoria)?.nombre,
      brand: { '@type': 'Brand', name: 'Cien Colores' },
      offers: {
        '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      }
    })),
    ...CURSOS.map(c => ({
      '@type': 'Course', name: c.titulo, description: c.corta,
      image: base + 'images/' + c.img,
      provider: { '@type': 'Organization', name: 'Cien Colores', '@id': base + '#org' },
      offers: { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', category: 'Paid' },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: c.modalidad === 'Presencial' ? 'Onsite' : 'Online',
        courseWorkload: c.duracion
      }
    }))
  ];
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

initCategorias();
initRail();
initFiltros();
renderCatalogo();
initAtajos();
initCards();
initModal();
initDrawer();
initSorteo();
initReveals();
initNav();
initHero();
initNudo();
initFloats();
initSchema();

document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
