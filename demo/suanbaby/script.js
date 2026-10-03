const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491124692743';
const ES_M2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FOTOS = {
  '01': { src: 'images/01_bebe_vertical.webp', w: 440, h: 1024 },
  '02': { src: 'images/02_panales_banner.webp', w: 1086, h: 467 },
  '03': { src: 'images/03_juguetes.webp', w: 345, h: 549 },
  '04': { src: 'images/04_ropa_bebe.webp', w: 371, h: 549 },
  '05': { src: 'images/05_bolso_maternidad.webp', w: 355, h: 549 },
  '06': { src: 'images/06_higiene_cuidado.webp', w: 450, h: 350 }
};

const CATS = {
  panales: { n: 'Pañales', mundo: 'panalera', foto: '02', foco: [0.44, 0.42, 1.3], alt: 'Paquete de pañales' },
  toallitas: { n: 'Toallitas', mundo: 'panalera', foto: '06', foco: [0.66, 0.74, 1.35], alt: 'Paquete de toallitas húmedas' },
  higiene: { n: 'Higiene y perfumería', corto: 'Higiene', mundo: 'panalera', foto: '06', foco: [0.25, 0.6, 1.35], alt: 'Crema y colonia para bebé' },
  ropa: { n: 'Ropa y accesorios', corto: 'Ropa', mundo: 'panalera', foto: '04', foco: [0.36, 0.3, 1.3], alt: 'Body de bebé con estampa de ositos' },
  maternidad: { n: 'Maternidad y lactancia', corto: 'Maternidad', mundo: 'panalera', foto: '05', foco: [0.5, 0.38, 1.15], alt: 'Mochila maternal gris' },
  juguetes: { n: 'Juguetes', mundo: 'jugueteria', foto: '03', foco: [0.3, 0.34, 1.3], alt: 'Oso de peluche con moño' },
  combos: { n: 'Combos', mundo: 'panalera', foto: '04', foco: [0.62, 0.62, 1.1], alt: 'Set de ropa de bebé con babero' },
  hogar: { n: 'Hogar y bazar', corto: 'Hogar', mundo: 'panalera', foto: '02', foco: [0.92, 0.35, 1.6], alt: 'Canasto de mimbre' }
};

const MUNDOS = {
  panalera: { n: 'Pañalera', ver: 'Ver los {n} de pañalera', uno: 'producto de pañalera', varios: 'productos de pañalera' },
  jugueteria: { n: 'Juguetería', ver: 'Ver los {n} juguetes', uno: 'juguete', varios: 'juguetes' }
};

const TALLES_PANAL = ['RN', 'P', 'M', 'G', 'XG', 'XXG'];
const EDADES = { e0: { t: '0 a 12 meses', r: [0, 12] }, e1: { t: '1 a 2 años', r: [12, 36] }, e3: { t: '3 años o más', r: [36, 999] } };
const PRECIOS = { p1: { t: 'Hasta $10.000', r: [0, 10000] }, p2: { t: '$10.000 a $30.000', r: [10001, 30000] }, p3: { t: 'Más de $30.000', r: [30001, Infinity] } };

const PANAL = (k, u, kg, stock, extra = {}) => ({ k, t: k, txt: `${k} × ${u}`, sub: kg, u, stock, ...extra });
const ROPA = (k, stock) => ({ k, txt: k, sub: 'meses', stock });

const PRODUCTOS = [
  { id: 'huggies-supreme', cat: 'panales', marca: 'Huggies', nombre: 'Pañales Huggies Supreme Care', precio: 29000, descuento: 14, rank: 1, foto: '02', foco: [0.165, 0.47, 1.15],
    vars: { titulo: 'Talle y cantidad', boton: 'Elegir talle', lista: [PANAL('P', 50, '3,5 a 6 kg', 4), PANAL('M', 80, '5,5 a 9,5 kg', 9), PANAL('G', 72, '9 a 12,5 kg', 12), PANAL('XG', 60, '11 a 14 kg', 3), PANAL('XXG', 54, 'más de 14 kg', 0)] },
    desc: 'Pañal con cubierta suave, cintura elastizada y tiras ajustables. El precio es por paquete y cambia la cantidad según el talle.',
    datos: [['Marca', 'Huggies'], ['Línea', 'Supreme Care'], ['Talles', 'P a XXG']],
    alt: 'Paquete rojo de pañales Huggies Supreme Care talle G por 72' },
  { id: 'pampers-confort', cat: 'panales', marca: 'Pampers', nombre: 'Pañales Pampers Confort Sec', precio: 23900, descuento: 0, rank: 3, foto: '02', foco: [0.435, 0.44, 1.2],
    vars: { titulo: 'Talle y cantidad', boton: 'Elegir talle', lista: [PANAL('M', 80, '6 a 10 kg', 10), PANAL('G', 70, '9 a 13 kg', 14), PANAL('XG', 64, '12 a 15 kg', 6), PANAL('XXG', 58, 'más de 15 kg', 5)] },
    desc: 'Pañal Confort Sec con canales que reparten el líquido y cobertura suave. Mismo precio en todos los talles.',
    datos: [['Marca', 'Pampers'], ['Línea', 'Confort Sec'], ['Talles', 'M a XXG']],
    alt: 'Paquete turquesa de pañales Pampers Confort Sec talle G por 70' },
  { id: 'babysec-ultra', cat: 'panales', marca: 'Babysec', nombre: 'Pañales Babysec Ultra Sec', precio: 9000, descuento: 0, rank: 6, foto: '06', foco: [0.53, 0.28, 1.2],
    vars: { titulo: 'Talle y cantidad', boton: 'Elegir talle', lista: [PANAL('M', 36, '5 a 9,5 kg', 15), PANAL('G', 30, '8,5 a 12 kg', 20), PANAL('XG', 28, '11 a 14 kg', 8), PANAL('XXG', 26, 'más de 14 kg', 7), { k: 'G4', t: 'G', txt: 'G × 120', sub: 'bulto de 4', u: 120, stock: 4, precio: 35000 }] },
    desc: 'Pañal Ultra Sec con cubierta de algodón y tiras elásticas. Llevando el bulto de 4 paquetes, cada pañal sale menos.',
    datos: [['Marca', 'Babysec'], ['Línea', 'Ultra Sec'], ['Talles', 'M a XXG'], ['Bulto', '4 paquetes de G × 30']],
    alt: 'Paquete violeta de pañales Babysec Ultra Sec talle G' },
  { id: 'toallitas-huggies', cat: 'toallitas', marca: 'Huggies', nombre: 'Toallitas húmedas Huggies × 48', precio: 2900, descuento: 0, rank: 12, stock: 30, u: 48, foto: '02', foco: [0.19, 0.86, 2.1],
    desc: 'Toallitas húmedas para la cola y las manos, con tapa que mantiene la humedad.', datos: [['Marca', 'Huggies'], ['Unidades', '48']],
    alt: 'Paquete de toallitas húmedas Huggies' },
  { id: 'toallitas-pampers', cat: 'toallitas', marca: 'Pampers', nombre: 'Toallitas húmedas Pampers × 48', precio: 3300, descuento: 0, rank: 19, stock: 18, u: 48, foto: '02', foco: [0.43, 0.86, 2.1], nuevo: true,
    desc: 'Toallitas húmedas suaves, sin alcohol, en paquete con tapa.', datos: [['Marca', 'Pampers'], ['Unidades', '48']],
    alt: 'Paquete de toallitas húmedas Pampers' },
  { id: 'toallitas-babysec', cat: 'toallitas', marca: 'Babysec', nombre: 'Toallitas húmedas Babysec × 50', precio: 2800, descuento: 0, rank: 9, stock: 26, u: 50, foto: '06', foco: [0.68, 0.8, 1.55],
    desc: 'Toallitas húmedas Babysec en paquete de 50, con tapa plástica.', datos: [['Marca', 'Babysec'], ['Unidades', '50']],
    alt: 'Paquete de toallitas húmedas Babysec por 50' },
  { id: 'crema-johnson', cat: 'higiene', marca: "Johnson's", nombre: "Crema líquida Johnson's Baby 400 ml", precio: 8900, descuento: 0, rank: 11, stock: 10, foto: '02', foco: [0.6, 0.66, 1.7],
    desc: 'Crema líquida para después del baño, en envase con válvula dosificadora.', datos: [['Marca', "Johnson's"], ['Contenido', '400 ml']],
    alt: "Frasco blanco con válvula de crema líquida Johnson's Baby" },
  { id: 'colonia-johnson', cat: 'higiene', marca: "Johnson's", nombre: "Colonia Johnson's Baby 200 ml", precio: 7900, descuento: 0, rank: 15, stock: 7, tags: ['mama'], foto: '06', foco: [0.37, 0.73, 1.6],
    desc: 'Colonia suave para bebé, con aroma clásico.', datos: [['Marca', "Johnson's"], ['Contenido', '200 ml']],
    alt: "Frasco de colonia Johnson's Baby" },
  { id: 'body-ositos', cat: 'ropa', nombre: 'Body manga corta estampa ositos', precio: 8900, descuento: 0, rank: 5, nuevo: true, edad: [0, 12], foto: '04', foco: [0.36, 0.28, 1.25],
    vars: { titulo: 'Talle', boton: 'Elegir talle', lista: [ROPA('0-3', 4), ROPA('3-6', 6), ROPA('6-9', 5), ROPA('9-12', 2)] },
    desc: 'Body de algodón con broches en la entrepierna y estampa de ositos.', datos: [['Material', 'Algodón'], ['Cierre', 'Broches']],
    alt: 'Body blanco de manga corta con estampa de ositos' },
  { id: 'body-rosa', cat: 'ropa', nombre: 'Body cruzado de morley rosa', precio: 10900, descuento: 0, rank: 13, edad: [0, 12], foto: '04', foco: [0.74, 0.37, 1.45],
    vars: { titulo: 'Talle', boton: 'Elegir talle', lista: [ROPA('0-3', 3), ROPA('3-6', 4), ROPA('6-9', 0), ROPA('9-12', 2)] },
    desc: 'Body cruzado de morley con broches al costado: se pone sin pasarlo por la cabeza.', datos: [['Material', 'Morley de algodón'], ['Cierre', 'Broches al costado']],
    alt: 'Body cruzado rosa de morley con broches' },
  { id: 'babero-osito', cat: 'ropa', nombre: 'Babero de algodón con osito', precio: 4900, descuento: 0, rank: 20, stock: 14, edad: [0, 24], foto: '04', foco: [0.76, 0.76, 1.45],
    desc: 'Babero de algodón con osito bordado y broche en el cuello.', datos: [['Material', 'Algodón'], ['Cierre', 'Broche']],
    alt: 'Babero color crema con un osito bordado' },
  { id: 'medias-osito', cat: 'ropa', nombre: 'Medias con orejitas de osito', precio: 3900, descuento: 0, rank: 18, edad: [0, 12], foto: '04', foco: [0.2, 0.72, 1.6],
    vars: { titulo: 'Talle', boton: 'Elegir talle', lista: [ROPA('0-6', 10), ROPA('6-12', 8)] },
    desc: 'Par de medias de algodón con orejitas y carita de osito.', datos: [['Material', 'Algodón'], ['Viene', '1 par']],
    alt: 'Par de medias blancas con orejitas de osito' },
  { id: 'mochila-maternal', cat: 'maternidad', nombre: 'Mochila maternal con cambiador', precio: 52900, descuento: 15, rank: 2, stock: 5, tags: ['mama'], foto: '05', foco: [0.5, 0.36, 1.12],
    desc: 'Mochila maternal de lona gris con manijas de cuero sintético, bolsillos térmicos a los costados y cambiador.', datos: [['Material', 'Lona'], ['Bolsillos', 'Térmicos laterales'], ['Incluye', 'Cambiador']],
    alt: 'Mochila maternal gris con manijas color suela' },
  { id: 'mamadera-260', cat: 'maternidad', nombre: 'Mamadera anticólicos 260 ml', precio: 9900, descuento: 0, rank: 10, stock: 12, edad: [0, 24], foto: '05', foco: [0.17, 0.6, 1.9],
    desc: 'Mamadera con válvula anticólicos y tetina de silicona de flujo lento.', datos: [['Capacidad', '260 ml'], ['Tetina', 'Silicona, flujo lento']],
    alt: 'Mamadera de 260 ml con tapa transparente' },
  { id: 'dosificador', cat: 'maternidad', nombre: 'Dosificador de leche en polvo de 3 tomas', precio: 6900, descuento: 0, rank: 21, stock: 9, foto: '05', foco: [0.4, 0.66, 2],
    desc: 'Dosificador de 3 compartimentos para llevar la leche en polvo medida.', datos: [['Compartimentos', '3'], ['Material', 'Plástico libre de BPA']],
    alt: 'Dosificador de leche en polvo de tres pisos' },
  { id: 'chupete-apego', cat: 'maternidad', nombre: 'Chupete con muñeco de apego', precio: 8500, descuento: 0, rank: 14, nuevo: true, foto: '05', foco: [0.22, 0.78, 2],
    vars: { titulo: 'Edad', boton: 'Elegir edad', lista: [ROPA('0-6', 6), ROPA('6-18', 5)] },
    desc: 'Chupete de silicona con un muñequito de apego de tela suave.', datos: [['Tetina', 'Silicona'], ['Muñeco', 'Tela suave']],
    alt: 'Chupete con un muñequito de tela color crema' },
  { id: 'muselinas', cat: 'maternidad', nombre: 'Muselinas estampadas de algodón × 2', precio: 12900, descuento: 0, rank: 17, stock: 8, tags: ['mama'], foto: '05', foco: [0.75, 0.72, 1.7],
    desc: 'Dos muselinas de algodón estampadas: sirven de mantita, cambiador o para dar la teta.', datos: [['Material', 'Gasa de algodón'], ['Viene', '2 unidades']],
    alt: 'Muselinas dobladas con estampa de flores' },
  { id: 'oso-mono', cat: 'juguetes', nombre: 'Oso de peluche con moño 40 cm', precio: 19900, descuento: 20, rank: 4, stock: 6, edad: [12, 72], foto: '03', foco: [0.3, 0.36, 1.2],
    desc: 'Oso de peluche de pelo suave con moño a cuadros. Mide 40 cm sentado.', datos: [['Alto', '40 cm'], ['Edad recomendada', 'Desde 1 año']],
    alt: 'Oso de peluche marrón claro con moño a cuadros' },
  { id: 'torre-aros', cat: 'juguetes', nombre: 'Torre de aros apilables de madera', precio: 9900, descuento: 0, rank: 16, stock: 11, edad: [6, 36], foto: '03', foco: [0.66, 0.48, 1.9],
    desc: 'Torre de madera con aros de colores para apilar por tamaño.', datos: [['Material', 'Madera pintada'], ['Edad recomendada', 'Desde 6 meses']],
    alt: 'Torre de aros de madera de colores' },
  { id: 'encastre-madera', cat: 'juguetes', nombre: 'Cubo de encastre de madera', precio: 16900, descuento: 0, rank: 22, stock: 4, edad: [18, 48], foto: '03', foco: [0.88, 0.55, 1.7],
    desc: 'Cubo de madera con figuras para encastrar: estrella, círculo, triángulo y más.', datos: [['Material', 'Madera'], ['Edad recomendada', 'Desde 18 meses']],
    alt: 'Cubo de madera con agujeros con forma de estrella, círculo y triángulo' },
  { id: 'mesa-musical', cat: 'juguetes', nombre: 'Mesa de actividades musical', precio: 29990, descuento: 10, rank: 8, stock: 3, nuevo: true, edad: [6, 36], foto: '03', foco: [0.2, 0.66, 1.6],
    desc: 'Mesa de actividades con botones, luces y sonidos, y piezas que giran.', datos: [['Funciona con', '3 pilas AA'], ['Edad recomendada', 'Desde 6 meses']],
    alt: 'Mesa de actividades turquesa con botones de colores' },
  { id: 'cubos-colores', cat: 'juguetes', nombre: 'Cubos de colores × 12', precio: 11900, descuento: 0, rank: 24, stock: 9, edad: [12, 48], foto: '03', foco: [0.55, 0.8, 1.5],
    desc: 'Doce cubos de colores para apilar, ordenar y construir.', datos: [['Viene', '12 cubos'], ['Edad recomendada', 'Desde 1 año']],
    alt: 'Cubos de colores azul, amarillo y verde' },
  { id: 'pelota-sonajero', cat: 'juguetes', nombre: 'Pelota de tela con sonajero', precio: 7900, descuento: 0, rank: 23, stock: 13, edad: [0, 24], foto: '01', foco: [0.6, 0.77, 1.6],
    desc: 'Pelota de tela en gajos de colores con sonajero adentro y carita de osito.', datos: [['Material', 'Tela'], ['Edad recomendada', 'Desde el nacimiento']],
    alt: 'Pelota de tela de colores con carita de osito' },
  { id: 'autito-arrastre', cat: 'juguetes', nombre: 'Autito de arrastre de madera', precio: 12900, descuento: 0, rank: 25, stock: 0, edad: [12, 48], foto: '01', foco: [0.85, 0.83, 1.8],
    desc: 'Autito de madera con ruedas grandes para empujar o arrastrar.', datos: [['Material', 'Madera'], ['Edad recomendada', 'Desde 1 año']],
    alt: 'Autito de madera verde agua con ruedas de madera' },
  { id: 'combo-babysec', cat: 'combos', marca: 'Babysec', nombre: 'Combo Babysec: pañales G × 30 + toallitas × 50', precio: 12800, descuento: 10, rank: 7, stock: 10, foto: '02', foco: [0.75, 0.56, 1.15],
    desc: 'Un paquete de pañales Babysec Ultra Sec G × 30 y un paquete de toallitas húmedas × 50.', datos: [['Pañales', 'Babysec Ultra Sec G × 30'], ['Toallitas', 'Babysec × 50']],
    alt: 'Paquete de pañales Babysec junto a toallitas Babysec' },
  { id: 'combo-johnson', cat: 'combos', marca: "Johnson's", nombre: "Combo Johnson's Baby: crema líquida + colonia", precio: 16800, descuento: 10, rank: 26, stock: 6, tags: ['mama'], foto: '06', foco: [0.27, 0.62, 1.15],
    desc: "La crema líquida de 400 ml y la colonia de 200 ml de Johnson's Baby, juntas.", datos: [['Crema líquida', '400 ml'], ['Colonia', '200 ml']],
    alt: "Crema líquida y colonia Johnson's Baby" },
  { id: 'set-bienvenida', cat: 'combos', nombre: 'Set de bienvenida: 2 bodies, babero y medias', precio: 29900, descuento: 0, rank: 27, stock: 5, tags: ['mama'], edad: [0, 6], foto: '04', foco: [0.5, 0.5, 1],
    desc: 'Dos bodies de algodón, un babero con osito y un par de medias, en talle 0 a 3 meses.', datos: [['Talle', '0 a 3 meses'], ['Incluye', '2 bodies, babero y medias']],
    alt: 'Set de ropa de bebé: bodies, babero y medias' },
  { id: 'canasto-mimbre', cat: 'hogar', nombre: 'Canasto organizador de mimbre', precio: 14900, descuento: 0, rank: 28, stock: 6, foto: '02', foco: [0.92, 0.35, 1.9],
    desc: 'Canasto tejido para ordenar pañales, toallitas y juguetes en el cuarto del bebé.', datos: [['Material', 'Mimbre'], ['Uso', 'Cuarto y cambiador']],
    alt: 'Canasto de mimbre tejido' }
];

const RAIL = ['huggies-supreme', 'combo-babysec', 'body-ositos', 'mesa-musical', 'toallitas-babysec', 'mochila-maternal', 'mamadera-260', 'combo-johnson'];
const MUNDO_PROD = { panalera: 'combo-babysec', jugueteria: 'torre-aros' };

const tercerDomingo = (y, m) => { const d = new Date(y, m, 1); const dom = (7 - d.getDay()) % 7; return new Date(y, m, 1 + dom + 14); };
const TEMPORADAS = [
  { id: 'infancias', nombre: 'Día de las Infancias', corto: 'Infancias', fecha: y => tercerDomingo(y, 7), txt: 'Juguetes para cada edad, listos para regalar.', filtro: { cat: 'juguetes' }, cta: 'Ver juguetes', foto: '03', foco: [0.3, 0.36, 1.2] },
  { id: 'mama', nombre: 'Día de la Madre', corto: 'Día de la Madre', fecha: y => tercerDomingo(y, 9), txt: 'Regalos para mamá y para el bebé.', filtro: { tag: 'mama' }, cta: 'Ver regalos', foto: '05', foco: [0.5, 0.36, 1.12] },
  { id: 'navidad', nombre: 'Navidad', corto: 'Navidad', fecha: y => new Date(y, 11, 25), txt: 'Peluches, encastres y juguetes para el arbolito.', filtro: { cat: 'juguetes' }, cta: 'Ver juguetes', foto: '03', foco: [0.3, 0.36, 1.2] },
  { id: 'reyes', nombre: 'Reyes', corto: 'Reyes', fecha: y => new Date(y, 0, 6), txt: 'Juguetes por edad para dejar junto a los zapatos.', filtro: { cat: 'juguetes' }, cta: 'Ver juguetes', foto: '03', foco: [0.3, 0.36, 1.2] }
];

const ZONAS = {
  local: { n: 'Moreno y alrededores', d: 'Trujui, Moreno, Paso del Rey, La Reja y Gral. Rodríguez', medio: 'Envío en moto', costo: 2500, plazo: 'Llega en 24 h hábiles', corto: '24 h hábiles' },
  oeste: { n: 'Zona oeste', d: 'Merlo, Ituzaingó, Castelar, Morón y San Justo', medio: 'Envío en moto', costo: 4500, plazo: 'Llega en 24 a 48 h hábiles', corto: '24 a 48 h hábiles' },
  amba: { n: 'CABA y resto del GBA', d: 'Capital, zona norte y zona sur', medio: 'Mensajería', costo: 6900, plazo: 'Llega en 48 a 72 h hábiles', corto: '48 a 72 h hábiles' },
  pais: { n: 'Resto del país', d: 'Por correo, a todas las provincias', medio: 'Correo', costo: 9900, plazo: 'Llega en 3 a 6 días hábiles', corto: '3 a 6 días hábiles' }
};
const PAGOS_POR_MODO = { domicilio: ['mp', 'tarjeta', 'transferencia'], retiro: ['mp', 'tarjeta', 'transferencia', 'efectivo'], coordinar: ['mp', 'tarjeta', 'transferencia', 'efectivo'] };
const CUPONES = { BIENVENIDA10: { pct: 10, txt: 'Bienvenida 10%' } };
const MAPA_COORDS = [-34.5986, -58.7516];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const varsDe = p => p?.vars?.lista || [];
const tieneVars = p => varsDe(p).length > 0;
const getVar = (p, k) => varsDe(p).find(v => v.k === k);
const varDefault = p => (varsDe(p).find(v => v.stock > 0) || varsDe(p)[0])?.k || '';
const precioBase = (p, k = '') => getVar(p, k)?.precio ?? p.precio;
const precioFinal = (p, k = '') => { const b = precioBase(p, k); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const stockDe = (p, k = '') => (tieneVars(p) ? (getVar(p, k)?.stock ?? 0) : (p.stock ?? 0));
const stockTotal = p => (tieneVars(p) ? varsDe(p).reduce((s, v) => s + v.stock, 0) : (p.stock ?? 0));
const precioDesde = p => (tieneVars(p) ? Math.min(...varsDe(p).map(v => precioFinal(p, v.k))) : precioFinal(p));
const unidades = (p, k = '') => (tieneVars(p) ? (getVar(p, k)?.u || 0) : (p.u || 0));
const porUnidad = (p, k = '') => { const u = unidades(p, k); return u ? precioFinal(p, k) / u : 0; };
const nombreVar = (p, k) => { const v = getVar(p, k); if (!v) return ''; return p.cat === 'panales' ? `${v.txt}${v.sub && v.sub.startsWith('bulto') ? ` · ${v.sub}` : ''}` : `${v.txt} ${v.sub || ''}`.trim(); };
const conVar = (p, k) => (k && tieneVars(p) ? ` (${nombreVar(p, k)})` : '');
const edadTxt = m => (m <= 0 ? 'Desde el nacimiento' : m < 12 ? `Desde los ${m} meses` : m === 12 ? 'Desde 1 año' : m % 12 === 0 ? `Desde los ${m / 12} años` : `Desde los ${m} meses`);
const fechaLarga = d => `${DIAS[d.getDay()].replace(/^./, c => c.toUpperCase())} ${d.getDate()} de ${MESES[d.getMonth()]}`;

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId] || { w: 1, h: 1 };
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / f.w, 1 / f.h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = f.w > vw + 0.5 ? clamp01((cx * f.w - vw / 2) / (f.w - vw)) : 0.5;
  const py = f.h > vh + 0.5 ? clamp01((cy * f.h - vh / 2) / (f.h - vh)) : 0.5;
  const x0 = (f.w - vw) * px;
  const y0 = (f.h - vh) * py;
  const fx = z > 1 ? clamp01((cx * f.w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * f.h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fotoHTML(fotoId, foco, ar, clase = '', extra = '', alt = '') {
  const f = FOTOS[fotoId];
  if (!f) return '';
  return `<div class="recorte ${clase}"${extra} style="${recorte(fotoId, foco, ar)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(alt)}"></div>`;
}

/* ---------- consulta paginada (simula el endpoint del servidor) ---------- */
const API_MAX = 100;
const PASO = 16;

function coincide(texto, palabras, termino) {
  if (termino.length <= 2) return palabras.includes(termino);
  return texto.includes(termino);
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    const partes = [p.nombre, p.marca, CATS[p.cat]?.n, MUNDOS[CATS[p.cat]?.mundo]?.n, p.desc, p.vars?.titulo, ...varsDe(p).map(v => `${v.txt} ${v.t || ''} ${v.sub || ''}`), ...(p.tags || []).map(t => TEMPORADAS.find(x => x.id === t)?.nombre || '')];
    const texto = normal(partes.join(' '));
    textoBusqueda.set(p.id, { texto, palabras: texto.split(/[^a-z0-9]+/).filter(Boolean) });
  }
  return textoBusqueda.get(p.id);
}

const Servidor = {
  consultar(f = {}) {
    const terminos = normal(f.q || '').split(/\s+/).filter(Boolean);
    let lista = PRODUCTOS.filter(p => {
      if (f.cats?.length && !f.cats.includes(p.cat)) return false;
      if (f.marcas?.length && !f.marcas.includes(p.marca)) return false;
      if (f.talles?.length && !varsDe(p).some(v => v.t && f.talles.includes(v.t))) return false;
      if (f.edades?.length && !(p.edad && f.edades.some(e => { const r = EDADES[e]?.r; return r && p.edad[0] < r[1] && p.edad[1] > r[0]; }))) return false;
      if (f.precios?.length && !f.precios.some(k => { const r = PRECIOS[k]?.r; const v = precioDesde(p); return r && v >= r[0] && v <= r[1]; })) return false;
      if (f.oferta && !(p.descuento > 0)) return false;
      if (f.stock && stockTotal(p) <= 0) return false;
      if (f.tag && !(p.tags || []).includes(f.tag)) return false;
      if (terminos.length) { const t = textoDe(p); if (!terminos.every(w => coincide(t.texto, t.palabras, w))) return false; }
      return true;
    });
    const orden = f.orden || 'vendidos';
    if (orden === 'menor') lista = lista.slice().sort((a, b) => precioDesde(a) - precioDesde(b));
    else if (orden === 'mayor') lista = lista.slice().sort((a, b) => precioDesde(b) - precioDesde(a));
    else if (orden === 'descuento') lista = lista.slice().sort((a, b) => (b.descuento || 0) - (a.descuento || 0) || a.rank - b.rank);
    else if (orden === 'nuevos') lista = lista.slice().sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    else lista = lista.slice().sort((a, b) => a.rank - b.rank);
    return lista;
  },
  productos(params = {}) {
    const limite = Math.max(1, Math.min(API_MAX, Math.floor(Number(params.limite)) || PASO));
    const desde = Math.max(0, parseInt(params.cursor, 10) || 0);
    const lista = this.consultar(params);
    const items = lista.slice(desde, desde + limite);
    const fin = desde + items.length;
    return { items, total: lista.length, siguiente: fin < lista.length ? String(fin) : null };
  },
  destacados(ids, limite = 8) {
    return ids.slice(0, Math.min(limite, API_MAX)).map(getProducto).filter(Boolean);
  },
  conteo(f) {
    return this.consultar(f).length;
  }
};

/* ---------- carrito ---------- */
const Cart = {
  KEY: 'suanbaby_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id, v = '') { return this.get().filter(i => i.id === id && (i.v || '') === v).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const libre = stockDe(producto, v) - this.enCarrito(producto.id, v);
    const suma = Math.max(0, Math.min(qty, libre));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, stockDe(p, v))); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v || '') * i.qty : s; }, 0); }
};

function sanearCarrito() {
  const limpios = [];
  Cart.get().forEach(i => {
    const p = i && getProducto(i.id);
    if (!p) return;
    const v = tieneVars(p) ? (getVar(p, i.v) ? i.v : '') : '';
    if (tieneVars(p) && !v) return;
    const qty = Math.min(Math.max(1, Number(i.qty) || 1), stockDe(p, v));
    if (qty > 0) limpios.push({ id: p.id, v, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { limpios.length = 0; }
}

const Guardado = {
  leer(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  escribir(k, v) {
    try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; }
  }
};
let envioElegido = Guardado.leer('suanbaby_envio');
let cuponAplicado = Guardado.leer('suanbaby_cupon');
if (cuponAplicado && !CUPONES[cuponAplicado]) cuponAplicado = null;

function totales() {
  const sub = Cart.total();
  const cupon = cuponAplicado ? CUPONES[cuponAplicado] : null;
  const desc = cupon ? Math.round(sub * cupon.pct / 100) : 0;
  const envio = envioElegido?.modo === 'domicilio' ? (envioElegido.costo || 0) : 0;
  return { sub, desc, envio, total: Math.max(0, sub - desc + envio) };
}

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

/* ---------- tarjetas ---------- */
const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"'
};
const ICONO_CARRITO = '<svg class="ic" aria-hidden="true"><use href="#i-carrito"/></svg>';
let temporadaActual = null;

function precioHTML(p, k = null) {
  if (k === null && tieneVars(p)) {
    const desde = precioDesde(p);
    const igual = varsDe(p).every(v => precioFinal(p, v.k) === desde);
    const orig = p.descuento > 0 ? Math.min(...varsDe(p).map(v => precioBase(p, v.k))) : 0;
    return `<p class="precio">${igual ? '' : '<span class="precio__desde">desde</span>'}<span class="precio__f">${formatearPrecio(desde)}</span>${orig ? `<s class="precio__o">${formatearPrecio(orig)}</s>` : ''}</p>`;
  }
  const kk = k || '';
  return `<p class="precio"><span class="precio__f">${formatearPrecio(precioFinal(p, kk))}</span>${p.descuento > 0 ? `<s class="precio__o">${formatearPrecio(precioBase(p, kk))}</s>` : ''}</p>`;
}

function metaDe(p) {
  if (p.cat === 'panales') {
    const ts = varsDe(p).map(v => v.t).filter((t, i, a) => a.indexOf(t) === i);
    const minU = Math.min(...varsDe(p).map(v => porUnidad(p, v.k)));
    return `Talles ${ts[0]} a ${ts[ts.length - 1]} · desde ${formatearPrecio(minU)} c/u`;
  }
  if (tieneVars(p)) return `${p.vars.titulo === 'Edad' ? 'Edades' : 'Talles'} ${varsDe(p).map(v => v.k).join(' · ')} meses`;
  if (p.u) return `${p.u} unidades · ${formatearPrecio(porUnidad(p))} c/u`;
  if (p.edad && p.cat === 'juguetes') return edadTxt(p.edad[0]);
  return '';
}

function stepperHTML(id, clase = '') {
  return `<div class="stepper${clase}" data-stepper="${id}" role="group" aria-label="Cantidad"><button type="button" data-paso="-1" aria-label="Restar uno" disabled>−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

function tieneTemporada(p) {
  if (!temporadaActual) return false;
  const f = temporadaActual.filtro;
  return f.tag ? (p.tags || []).includes(f.tag) : false;
}

function accionesHTML(p) {
  if (stockTotal(p) <= 0) return `<a class="btn btn--line btn--sm prod-add" href="${wspLink(`Hola Suan Baby! ¿Cuándo vuelve a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;
  if (tieneVars(p)) return `<button type="button" class="btn btn--line btn--sm prod-add" data-quick="${p.id}">${esc(p.vars.boton)}</button>`;
  const libre = stockDe(p) - Cart.enCarrito(p.id);
  return `${stepperHTML(p.id)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO}<span class="lbl">Agregar</span></button>`;
}

function cardHTML(p, anim = 'subir') {
  const total = stockTotal(p);
  const badges = [
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : '',
    p.nuevo ? '<span class="badge">Nuevo</span>' : '',
    tieneTemporada(p) ? `<span class="badge badge--temp">${esc(temporadaActual.corto)}</span>` : '',
    total > 0 && total <= 4 && !tieneVars(p) ? `<span class="badge badge--poco">Quedan ${total}</span>` : '',
    total <= 0 ? '<span class="badge badge--sin">Sin stock</span>' : ''
  ].filter(Boolean).slice(0, 2).join('');
  const meta = metaDe(p);
  return `<div class="card-wrap"${anim ? ` ${ANIM[anim]}` : ''}><article class="card" data-id="${p.id}">
    <div class="card__media">
      ${fotoHTML(p.foto, p.foco, 0.8, 'card__img', ` data-quick="${p.id}"`, p.alt)}
      <div class="card__badges">${badges}</div>
      <button type="button" class="card__quick" data-quick="${p.id}" tabindex="-1" aria-hidden="true">Vista rápida</button>
    </div>
    <div class="card__body">
      <p class="card__marca">${esc(p.marca || CATS[p.cat]?.corto || CATS[p.cat]?.n || '')}</p>
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${meta ? `<p class="card__meta">${esc(meta)}</p>` : ''}
      ${precioHTML(p)}
      <div class="prod-actions">${accionesHTML(p)}</div>
      ${total > 0 ? `<button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>` : ''}
    </div>
  </article></div>`;
}

function refrescarCards() {
  document.querySelectorAll('.card[data-id]').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p || tieneVars(p) || stockTotal(p) <= 0) return;
    const libre = stockDe(p) - Cart.enCarrito(p.id);
    const add = card.querySelector('[data-add]');
    if (add) add.disabled = libre <= 0;
    const st = card.querySelector('[data-stepper]');
    const out = st?.querySelector('output');
    if (out && Number(out.textContent) > Math.max(1, libre)) out.textContent = String(Math.max(1, libre));
    syncStepper(st, p);
  });
}

function syncStepper(st, p) {
  if (!st || !p) return;
  const out = st.querySelector('output');
  const n = Number(out?.textContent) || 1;
  const libre = stockDe(p) - Cart.enCarrito(p.id);
  const menos = st.querySelector('[data-paso="-1"]');
  const mas = st.querySelector('[data-paso="1"]');
  if (menos) menos.disabled = n <= 1;
  if (mas) mas.disabled = n >= Math.max(1, libre);
}

/* ---------- catálogo ---------- */
const FILTRO = { q: '', cats: new Set(), talles: new Set(), edades: new Set(), marcas: new Set(), precios: new Set(), oferta: false, stock: false, tag: '', orden: 'vendidos' };
const ESTADO = { siguiente: null, total: 0, mostrados: 0 };

function paramsDeFiltro() {
  return { q: FILTRO.q, cats: [...FILTRO.cats], talles: [...FILTRO.talles], edades: [...FILTRO.edades], marcas: [...FILTRO.marcas], precios: [...FILTRO.precios], oferta: FILTRO.oferta, stock: FILTRO.stock, tag: FILTRO.tag, orden: FILTRO.orden };
}

function mundoDeCats() {
  if (!FILTRO.cats.size) return '';
  return Object.keys(MUNDOS).find(m => {
    const cs = Object.keys(CATS).filter(c => CATS[c].mundo === m);
    return cs.length === FILTRO.cats.size && cs.every(c => FILTRO.cats.has(c));
  }) || '';
}

function tituloTienda() {
  const otros = FILTRO.talles.size || FILTRO.edades.size || FILTRO.marcas.size || FILTRO.precios.size;
  const mundo = mundoDeCats();
  if (FILTRO.tag && temporadaActual?.filtro.tag === FILTRO.tag) return temporadaActual.nombre;
  if (mundo) return MUNDOS[mundo].n;
  if (FILTRO.cats.size === 1 && !otros) return CATS[[...FILTRO.cats][0]].n;
  if (FILTRO.oferta && !FILTRO.cats.size && !otros) return 'Ofertas';
  if (FILTRO.q && !FILTRO.cats.size) return `Resultados para «${FILTRO.q}»`;
  return 'Todos los productos';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  const mundo = mundoDeCats();
  if (FILTRO.q) pills.push(['q', '', `«${FILTRO.q}»`]);
  if (mundo) pills.push(['mundo', mundo, MUNDOS[mundo].n]);
  else if (FILTRO.cats.size > 1 || (FILTRO.cats.size === 1 && (FILTRO.q || FILTRO.oferta))) FILTRO.cats.forEach(c => pills.push(['cat', c, CATS[c].n]));
  FILTRO.talles.forEach(t => pills.push(['talle', t, `Talle ${t}`]));
  FILTRO.edades.forEach(e => pills.push(['edad', e, EDADES[e].t]));
  FILTRO.marcas.forEach(m => pills.push(['marca', m, m]));
  FILTRO.precios.forEach(r => pills.push(['precio', r, PRECIOS[r].t]));
  if (FILTRO.oferta) pills.push(['oferta', '', 'Ofertas']);
  if (FILTRO.stock) pills.push(['stock', '', 'Con stock']);
  if (FILTRO.tag) pills.push(['tag', '', temporadaActual?.nombre || 'Temporada']);
  cont.innerHTML = pills.map(([k, v, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('');
  cont.hidden = !pills.length;
}

function sincronizarControles() {
  document.querySelectorAll('input[data-f="cat"]').forEach(c => { c.checked = FILTRO.cats.has(c.value); });
  document.querySelectorAll('input[data-f="marca"]').forEach(c => { c.checked = FILTRO.marcas.has(c.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(c => { c.checked = FILTRO.precios.has(c.value); });
  document.querySelectorAll('.f-chip[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.talles.has(b.dataset.talle))));
  document.querySelectorAll('.f-chip[data-edad]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.edades.has(b.dataset.edad))));
  const oferta = document.getElementById('f-oferta');
  if (oferta) oferta.checked = FILTRO.oferta;
  const stock = document.getElementById('f-stock');
  if (stock) stock.checked = FILTRO.stock;
  const una = FILTRO.cats.size === 1 ? [...FILTRO.cats][0] : '';
  const limpio = !FILTRO.cats.size && !FILTRO.oferta && !FILTRO.tag;
  document.querySelectorAll('.chip-cat').forEach(b => {
    const c = b.dataset.chip;
    const on = c === 'todo' ? limpio : c === 'oferta' ? (FILTRO.oferta && !FILTRO.cats.size) : c === una;
    b.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('.cat[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === una)));
  const q = document.getElementById('q');
  if (q && document.activeElement !== q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const q2 = document.getElementById('q2');
  if (q2 && document.activeElement !== q2 && q2.value !== FILTRO.q) q2.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
}

function pintarPie() {
  const count = document.getElementById('cat-count');
  if (count) count.textContent = ESTADO.total ? plural(ESTADO.total, 'producto', 'productos') : 'Sin resultados';
  const mas = document.getElementById('ver-mas');
  const masN = document.getElementById('mas-n');
  if (mas) mas.hidden = !ESTADO.siguiente;
  if (masN) masN.textContent = ESTADO.total > PASO ? `Mostrando ${ESTADO.mostrados} de ${ESTADO.total}` : '';
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = ESTADO.total > 0;
}

function pintarCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const pagina = Servidor.productos({ ...paramsDeFiltro(), cursor: '0', limite: PASO });
  grid.innerHTML = pagina.items.map(p => cardHTML(p)).join('');
  ESTADO.siguiente = pagina.siguiente;
  ESTADO.total = pagina.total;
  ESTADO.mostrados = pagina.items.length;
  const tit = document.getElementById('t-tienda');
  if (tit) tit.textContent = tituloTienda();
  pintarPie();
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function verMas() {
  const grid = document.getElementById('grid');
  if (!grid || !ESTADO.siguiente) return;
  const pagina = Servidor.productos({ ...paramsDeFiltro(), cursor: ESTADO.siguiente, limite: PASO });
  grid.insertAdjacentHTML('beforeend', pagina.items.map(p => cardHTML(p)).join(''));
  ESTADO.siguiente = pagina.siguiente;
  ESTADO.total = pagina.total;
  ESTADO.mostrados += pagina.items.length;
  pintarPie();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() {
  FILTRO.q = ''; FILTRO.cats = new Set(); FILTRO.talles = new Set(); FILTRO.edades = new Set(); FILTRO.marcas = new Set(); FILTRO.precios = new Set();
  FILTRO.oferta = false; FILTRO.stock = false; FILTRO.tag = '';
}

function filtrarPor(tipo, valor, ir = true) {
  resetFiltros();
  if (tipo === 'cat' && CATS[valor]) FILTRO.cats = new Set([valor]);
  if (tipo === 'mundo' && MUNDOS[valor]) FILTRO.cats = new Set(Object.keys(CATS).filter(c => CATS[c].mundo === valor));
  if (tipo === 'oferta') FILTRO.oferta = true;
  if (tipo === 'tag' && valor) FILTRO.tag = valor;
  pintarCatalogo();
  if (ir) irATienda();
}

function toggleSet(set, v) { if (set.has(v)) set.delete(v); else set.add(v); }

function construirFiltros() {
  const cats = document.getElementById('f-cats');
  if (cats) cats.innerHTML = Object.keys(CATS).map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c}">${esc(CATS[c].n)}<span class="f-n">${Servidor.conteo({ cats: [c] })}</span></label>`).join('');
  const talles = document.getElementById('f-talles');
  if (talles) talles.innerHTML = TALLES_PANAL.filter(t => Servidor.conteo({ talles: [t] }) > 0).map(t => `<button type="button" class="f-chip" data-talle="${t}" aria-pressed="false">${t}</button>`).join('');
  const edades = document.getElementById('f-edades');
  if (edades) edades.innerHTML = Object.keys(EDADES).map(e => `<button type="button" class="f-chip" data-edad="${e}" aria-pressed="false">${esc(EDADES[e].t)}</button>`).join('');
  const marcas = document.getElementById('f-marcas');
  if (marcas) {
    const lista = [...new Set(PRODUCTOS.map(p => p.marca).filter(Boolean))].sort();
    marcas.innerHTML = lista.map(m => `<label class="f-check"><input type="checkbox" data-f="marca" value="${esc(m)}">${esc(m)}<span class="f-n">${Servidor.conteo({ marcas: [m] })}</span></label>`).join('');
  }
  const precios = document.getElementById('f-precios');
  if (precios) precios.innerHTML = Object.keys(PRECIOS).map(r => `<label class="f-check"><input type="checkbox" data-f="precio" value="${r}">${esc(PRECIOS[r].t)}</label>`).join('');
  const chips = document.getElementById('chips-cat');
  if (chips) chips.innerHTML = `<button type="button" class="chip-cat" data-chip="todo" aria-pressed="true">Todo</button><button type="button" class="chip-cat" data-chip="oferta" aria-pressed="false">Ofertas</button>` + Object.keys(CATS).map(c => `<button type="button" class="chip-cat" data-chip="${c}" aria-pressed="false">${esc(CATS[c].corto || CATS[c].n)}</button>`).join('');
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  construirFiltros();
  ['q', 'q2'].forEach(id => {
    const q = document.getElementById(id);
    let t = 0;
    q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim().slice(0, 60); pintarCatalogo(); }, 200); });
  });
  document.querySelectorAll('.busca').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input');
    FILTRO.q = q ? q.value.trim().slice(0, 60) : '';
    pintarCatalogo();
    irATienda();
  }));
  const filtros = document.getElementById('filtros');
  filtros?.addEventListener('change', e => {
    const c = e.target;
    if (c.matches('input[data-f="cat"]')) { if (c.checked) FILTRO.cats.add(c.value); else FILTRO.cats.delete(c.value); }
    else if (c.matches('input[data-f="marca"]')) { if (c.checked) FILTRO.marcas.add(c.value); else FILTRO.marcas.delete(c.value); }
    else if (c.matches('input[data-f="precio"]')) { if (c.checked) FILTRO.precios.add(c.value); else FILTRO.precios.delete(c.value); }
    else if (c.id === 'f-oferta') FILTRO.oferta = c.checked;
    else if (c.id === 'f-stock') FILTRO.stock = c.checked;
    else return;
    pintarCatalogo();
  });
  filtros?.addEventListener('click', e => {
    const t = e.target.closest('.f-chip[data-talle]');
    const ed = e.target.closest('.f-chip[data-edad]');
    if (t) { toggleSet(FILTRO.talles, t.dataset.talle); pintarCatalogo(); }
    if (ed) { toggleSet(FILTRO.edades, ed.dataset.edad); pintarCatalogo(); }
  });
  document.getElementById('chips-cat')?.addEventListener('click', e => {
    const b = e.target.closest('.chip-cat');
    if (!b) return;
    const c = b.dataset.chip;
    if (c === 'todo') filtrarPor('', '', false);
    else if (c === 'oferta') filtrarPor('oferta', '', false);
    else filtrarPor('cat', c, false);
  });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('f-clear')?.addEventListener('click', () => { resetFiltros(); pintarCatalogo(); });
  document.getElementById('vacio-reset')?.addEventListener('click', () => { resetFiltros(); pintarCatalogo(); });
  document.getElementById('ver-mas')?.addEventListener('click', verMas);
  document.getElementById('pills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro;
    const v = b.dataset.valor || '';
    if (k === 'q') FILTRO.q = '';
    if (k === 'mundo') FILTRO.cats = new Set();
    if (k === 'cat') FILTRO.cats.delete(v);
    if (k === 'talle') FILTRO.talles.delete(v);
    if (k === 'edad') FILTRO.edades.delete(v);
    if (k === 'marca') FILTRO.marcas.delete(v);
    if (k === 'precio') FILTRO.precios.delete(v);
    if (k === 'oferta') FILTRO.oferta = false;
    if (k === 'stock') FILTRO.stock = false;
    if (k === 'tag') FILTRO.tag = '';
    pintarCatalogo();
  });
  const params = new URLSearchParams(location.search);
  let desdeURL = false;
  const cat = params.get('cat');
  if (cat && CATS[cat]) { FILTRO.cats = new Set([cat]); desdeURL = true; }
  if (params.get('oferta') === '1') { FILTRO.oferta = true; desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(irATienda, 60));
}

function initFiltrosPanel() {
  const panel = document.getElementById('filtros');
  const toggle = document.getElementById('filtrosToggle');
  if (!panel || !toggle) return;
  const mq = window.matchMedia(ES_M2 ? '(min-width: 0px)' : '(max-width: 1024px)');
  let bd = null;
  const cerrar = () => {
    panel.classList.remove('open');
    bd?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const abrir = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    panel.removeAttribute('inert');
    panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    panel.classList.add('open');
    bd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  toggle.addEventListener('click', () => (panel.classList.contains('open') ? cerrar() : abrir()));
  document.getElementById('filtrosClose')?.addEventListener('click', () => { cerrar(); toggle.focus(); });
  document.getElementById('filtrosVer')?.addEventListener('click', () => { cerrar(); irATienda(); });
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); toggle.focus(); }
    if (e.key === 'Tab') trap(e, panel);
  });
  const sync = () => {
    if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrar(); }
  };
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- categorías visuales ---------- */
function initCats() {
  const cont = document.getElementById('cats');
  if (!cont) return;
  cont.innerHTML = Object.keys(CATS).map(c => {
    const k = CATS[c];
    const n = Servidor.conteo({ cats: [c] });
    return `<button type="button" class="cat" data-cat="${c}" aria-pressed="false" ${ANIM.escala}>
      <span class="cat__c">${fotoHTML(k.foto, k.foco, 1, '', '', '')}</span>
      <span class="cat__n">${esc(k.corto || k.n)}</span>
      <span class="cat__q">${plural(n, 'producto', 'productos')}</span>
    </button>`;
  }).join('');
  const dato = document.getElementById('cats-dato');
  if (dato) dato.textContent = `${Object.keys(CATS).length} categorías · ${PRODUCTOS.length} productos`;
}

/* ---------- temporada ---------- */
function proximaTemporada(hoy = new Date()) {
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let mejor = null;
  TEMPORADAS.forEach(t => {
    [base.getFullYear(), base.getFullYear() + 1].forEach(y => {
      const f = t.fecha(y);
      if (f >= base && (!mejor || f < mejor.f)) mejor = { t, f };
    });
  });
  if (!mejor) return null;
  const dias = Math.round((mejor.f - base) / 86400000);
  return { ...mejor.t, f: mejor.f, dias };
}

function initTemporada() {
  const prox = proximaTemporada();
  if (!prox) return;
  temporadaActual = prox;
  const set = (sel, txt) => document.querySelectorAll(sel).forEach(el => { el.textContent = txt; });
  set('[data-temp-nombre]', prox.nombre);
  set('[data-temp-fecha]', fechaLarga(prox.f));
  set('[data-temp-falta]', prox.dias === 0 ? 'Es hoy' : prox.dias === 1 ? 'Falta 1 día' : `Faltan ${prox.dias} días`);
  set('[data-temp-txt]', prox.txt);
  document.querySelectorAll('[data-temp-cta]').forEach(a => {
    a.firstChild.textContent = prox.cta;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (prox.filtro.tag) filtrarPor('tag', prox.filtro.tag);
      else filtrarPor('cat', prox.filtro.cat);
    });
  });
  document.querySelectorAll('[data-temp-foto]').forEach(el => {
    const f = FOTOS[prox.foto];
    if (!f) return;
    el.setAttribute('style', recorte(prox.foto, prox.foco, 0.8));
    el.innerHTML = `<img src="${f.src}" width="${f.w}" height="${f.h}" alt="">`;
  });
}

/* ---------- carrusel ---------- */
function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail');
  if (!track || !vp) return;
  track.innerHTML = Servidor.destacados(RAIL, 8).map(p => cardHTML(p, 'der')).join('');
  initRailDrag(vp);
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => (track.querySelector('.card-wrap')?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { moved = true; }
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

/* ---------- ¿cómo te llega? ---------- */
const ENVIO = { modo: 'domicilio', zona: '', cp: '' };

function zonaDeCP(cp) {
  if (!/^\d{4}$/.test(cp)) return '';
  const n = parseInt(cp, 10);
  if (n < 1000) return '';
  if (n >= 1736 && n <= 1748) return 'local';
  if (n >= 1700 && n <= 1799) return 'oeste';
  if ((n >= 1000 && n <= 1499) || (n >= 1600 && n <= 1699) || (n >= 1800 && n <= 1899)) return 'amba';
  return 'pais';
}

function envioActual() {
  if (ENVIO.modo === 'retiro') return { modo: 'retiro', costo: 0, label: 'Retiro en el local (Trujui, Moreno)' };
  if (ENVIO.modo === 'coordinar') return { modo: 'coordinar', costo: 0, label: 'Envío a coordinar por WhatsApp' };
  const z = ZONAS[ENVIO.zona];
  if (!z) return null;
  return { modo: 'domicilio', zona: ENVIO.zona, cp: ENVIO.cp, costo: z.costo, label: `${z.medio} a ${z.n}${ENVIO.cp ? ` (CP ${ENVIO.cp})` : ''}` };
}

function pedidoTexto(extra = '') {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre}${conVar(p, i.v)} — ${formatearPrecio(precioFinal(p, i.v || '') * i.qty)}` : '';
  }).filter(Boolean);
  const t = totales();
  const partes = ['Hola Suan Baby! Quiero hacer este pedido:', ...lineas, `Subtotal: ${formatearPrecio(t.sub)}`];
  if (t.desc) partes.push(`Cupón ${cuponAplicado}: −${formatearPrecio(t.desc)}`);
  if (envioElegido) partes.push(`Envío: ${envioElegido.label}${envioElegido.modo === 'domicilio' ? ` — ${formatearPrecio(envioElegido.costo)}` : ''}`);
  partes.push(`Total: ${formatearPrecio(t.total)}`);
  if (extra) partes.push(extra);
  return partes.join('\n');
}

function pintarEnvio() {
  const app = document.getElementById('envio-app');
  if (!app) return;
  app.querySelectorAll('input[name="envio-modo"]').forEach(r => { r.checked = r.value === ENVIO.modo; });
  app.querySelectorAll('.envio__panel').forEach(p => { p.hidden = p.dataset.modo !== ENVIO.modo; });
  app.querySelectorAll('.zona').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zona === ENVIO.zona)));
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const sub = Cart.total();
  const usar = document.getElementById('envio-usar');
  const wsp = document.getElementById('envio-wsp');
  let costo = 0;
  if (ENVIO.modo === 'retiro') {
    set('tk-zona', 'Retiro en el local');
    set('tk-costo', 'Sin costo');
    set('tk-plazo', 'En Trujui, Moreno. Te avisamos por WhatsApp cuando tu pedido está listo.');
    set('tk-envio', 'Sin costo');
    if (usar) { usar.hidden = false; usar.disabled = false; usar.textContent = 'Retirar en el local'; }
    if (wsp) wsp.hidden = true;
  } else if (ENVIO.modo === 'coordinar') {
    set('tk-zona', 'Envío a coordinar');
    set('tk-costo', 'Lo arreglamos por WhatsApp');
    set('tk-plazo', 'Día, horario, dirección y costo, con tu pedido a la vista.');
    set('tk-envio', 'A coordinar');
    if (usar) usar.hidden = true;
    if (wsp) { wsp.hidden = false; wsp.href = wspLink(Cart.count() ? pedidoTexto('Quiero coordinar el envío.') : 'Hola Suan Baby! Quiero coordinar un envío.'); }
  } else {
    const z = ZONAS[ENVIO.zona];
    if (z) {
      costo = z.costo;
      set('tk-zona', `${z.medio} · ${z.n}`);
      set('tk-costo', formatearPrecio(z.costo));
      set('tk-plazo', `${z.plazo}${ENVIO.cp ? ` a tu código postal ${ENVIO.cp}` : ''}.`);
      set('tk-envio', formatearPrecio(z.costo));
    } else {
      set('tk-zona', 'Envío a domicilio');
      set('tk-costo', 'Poné tu código postal');
      set('tk-plazo', 'Te mostramos el costo y el plazo de tu zona.');
      set('tk-envio', '—');
    }
    if (usar) { usar.hidden = false; usar.disabled = !z; usar.textContent = 'Usar este envío'; }
    if (wsp) wsp.hidden = true;
  }
  const cupon = cuponAplicado ? Math.round(sub * CUPONES[cuponAplicado].pct / 100) : 0;
  set('tk-sub', !sub ? 'Todavía vacío' : cupon ? `${formatearPrecio(sub - cupon)} con cupón` : formatearPrecio(sub));
  set('tk-total', !sub && !costo ? '—' : formatearPrecio(sub - cupon + costo));
  const pagos = PAGOS_POR_MODO[ENVIO.modo] || [];
  document.querySelectorAll('#pagos li[data-pago]').forEach(li => {
    if (li.dataset.pago === 'contraentrega') return;
    const on = pagos.includes(li.dataset.pago);
    li.classList.toggle('is-on', on && li.dataset.pago === 'efectivo');
    li.classList.toggle('is-off', !on);
  });
}

function initEnvio() {
  const app = document.getElementById('envio-app');
  if (!app) return;
  const cp = document.getElementById('cp');
  const ayuda = document.getElementById('cp-ayuda');
  const zonas = document.getElementById('zonas');
  if (zonas) zonas.innerHTML = Object.keys(ZONAS).map(k => {
    const z = ZONAS[k];
    return `<button type="button" class="zona" data-zona="${k}" aria-pressed="false"><span class="zona__n">${esc(z.n)}</span><span class="zona__d">${esc(z.d)}</span><span class="zona__p"><b>${formatearPrecio(z.costo)}</b> · ${esc(z.corto)}</span></button>`;
  }).join('');
  if (envioElegido) {
    ENVIO.modo = envioElegido.modo || 'domicilio';
    ENVIO.zona = envioElegido.zona || '';
    ENVIO.cp = envioElegido.cp || '';
    if (cp) cp.value = ENVIO.cp;
  }
  app.addEventListener('change', e => {
    if (e.target.name !== 'envio-modo') return;
    ENVIO.modo = e.target.value;
    pintarEnvio();
    if (ENVIO.modo === 'retiro') crearMapa();
  });
  cp?.addEventListener('input', () => {
    const v = cp.value.replace(/\D/g, '').slice(0, 4);
    if (cp.value !== v) cp.value = v;
    ENVIO.cp = v;
    if (v.length === 4) {
      const z = zonaDeCP(v);
      ENVIO.zona = z;
      if (ayuda) { ayuda.textContent = z ? `Código ${v}: ${ZONAS[z].n}.` : 'Ese código postal no existe. Revisá los 4 números.'; ayuda.classList.toggle('is-error', !z); }
    } else {
      ENVIO.zona = '';
      if (ayuda) { ayuda.textContent = 'Con los 4 números del código postal alcanza.'; ayuda.classList.remove('is-error'); }
    }
    pintarEnvio();
  });
  app.querySelectorAll('.zona').forEach(b => b.addEventListener('click', () => {
    ENVIO.zona = b.dataset.zona;
    ENVIO.cp = '';
    if (cp) cp.value = '';
    if (ayuda) { ayuda.textContent = `Elegiste ${ZONAS[ENVIO.zona].n}. Con el código postal lo calculamos exacto.`; ayuda.classList.remove('is-error'); }
    pintarEnvio();
  }));
  document.getElementById('envio-usar')?.addEventListener('click', () => {
    const e = envioActual();
    if (!e) return;
    envioElegido = e;
    Guardado.escribir('suanbaby_envio', e);
    document.dispatchEvent(new CustomEvent('cart:updated'));
    if (Cart.count()) { showToast(`Listo: ${e.label} quedó en tu carrito.`); abrirDrawer(); }
    else { showToast('Guardamos tu forma de entrega. Ahora sumá productos al carrito.'); irATienda(); }
  });
  document.addEventListener('cart:updated', pintarEnvio);
  pintarEnvio();
  if (ENVIO.modo === 'retiro') crearMapa();
}

let mapaLeaflet = null;
function crearMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  if (mapaLeaflet) { setTimeout(() => mapaLeaflet.invalidateSize(), 60); return; }
  requestAnimationFrame(() => {
    if (mapaLeaflet || el.offsetParent === null) return;
    mapaLeaflet = L.map(el, { zoomControl: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false, dragging: !window.matchMedia('(hover: none)').matches }).setView(MAPA_COORDS, 14);
    mapaLeaflet.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapaLeaflet);
    const icono = L.divIcon({ className: '', html: '<div class="pin-suan"><span>S</span></div>', iconSize: [44, 44], iconAnchor: [22, 50] });
    L.marker(MAPA_COORDS, { icon: icono, keyboard: false, interactive: false }).addTo(mapaLeaflet);
    L.circle(MAPA_COORDS, { radius: 900, color: '#0A7377', weight: 1.5, dashArray: '6 6', fillColor: '#22DDE0', fillOpacity: 0.12, interactive: false }).addTo(mapaLeaflet);
  });
}

/* ---------- del primer pañal al primer juguete (momento) ---------- */
function miniHTML(p) {
  const libre = stockDe(p) - Cart.enCarrito(p.id);
  return `<div class="mini">
    ${fotoHTML(p.foto, p.foco, 0.8, '', '', p.alt)}
    <div><p class="mini__t">${esc(p.nombre)}</p><p class="mini__p">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? ` · −${p.descuento}%` : ''}</p></div>
    <button type="button" class="btn btn--line" data-add-mini="${p.id}"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO}<span class="lbl">Agregar</span></button>
  </div>`;
}

function initMundos() {
  const sec = document.getElementById('mundos');
  const cont = document.getElementById('mundos-cont');
  const stage = document.getElementById('mundos-stage');
  const linea = document.getElementById('mundos-linea');
  if (!sec || !cont || !stage || !linea) return;
  const conteos = {};
  Object.keys(MUNDOS).forEach(m => { conteos[m] = Servidor.conteo({ cats: Object.keys(CATS).filter(c => CATS[c].mundo === m) }); });
  const pintarMinis = () => document.querySelectorAll('[data-mundo-prod]').forEach(el => {
    const mundo = el.closest('[data-mundo]')?.dataset.mundo;
    const p = getProducto(MUNDO_PROD[mundo]);
    el.innerHTML = p ? miniHTML(p) : '';
  });
  pintarMinis();
  document.addEventListener('cart:updated', pintarMinis);
  document.querySelectorAll('[data-mundo-ver]').forEach(a => {
    const m = a.dataset.mundoVer;
    a.textContent = MUNDOS[m].ver.replace('{n}', conteos[m]);
    a.addEventListener('click', e => { e.preventDefault(); filtrarPor('mundo', m); });
  });
  sec.addEventListener('click', e => {
    const b = e.target.closest('[data-add-mini]');
    if (!b) return;
    const p = getProducto(b.dataset.addMini);
    if (!p) return;
    const ok = Cart.add(p, 1);
    showToast(ok ? `Sumaste ${p.nombre} al carrito.` : 'Ya tenés en el carrito todo el stock de este producto.');
  });
  const nEl = document.getElementById('mundos-n');
  const queEl = document.getElementById('mundos-que');
  const nA = conteos.panalera;
  const nB = conteos.jugueteria;
  if (reduceMotion) {
    sec.classList.add('mundos--estatico');
    return;
  }
  const ANG = 6;
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const escena = cont.querySelector('.mundos__escena');
  const medirK = () => {
    stage.style.setProperty('--ang', `${ANG}deg`);
    stage.style.setProperty('--k', `${(Math.tan(ANG * Math.PI / 180) * stage.clientHeight / 2).toFixed(1)}px`);
  };
  const suave = t => t * t * (3 - 2 * t);
  const pintar = p => {
    const t = suave(clamp01((p - 0.12) / 0.72));
    const w = 108 - 116 * t;
    stage.style.setProperty('--w', w.toFixed(2));
    linea.classList.toggle('is-fuera', w > 99.5 || w < 0.5);
    const enB = w < 50;
    const n = Math.round(enB ? nB : nA);
    if (nEl && nEl.textContent !== String(n)) nEl.textContent = String(n);
    const mundo = enB ? MUNDOS.jugueteria : MUNDOS.panalera;
    const txt = n === 1 ? mundo.uno : mundo.varios;
    if (queEl && queEl.textContent !== txt) queEl.textContent = txt;
  };
  window.__pintarMundos = pintar;
  let frame = 0;
  const medir = () => {
    frame = 0;
    const off = OFF();
    const total = cont.offsetHeight - (escena ? escena.offsetHeight : window.innerHeight - off);
    const p = total > 0 ? clamp01((off - cont.getBoundingClientRect().top) / total) : 0;
    pintar(p);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medirK(); pedir(); }, { passive: true });
  medirK();
  medir();
}

/* ---------- carrito (cajón) ---------- */
let ultimoFoco = null;

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const v = i.v || '';
  const libre = stockDe(p, v) - Cart.enCarrito(p.id, v);
  const ve = esc(v);
  return `<div class="linea">
    ${fotoHTML(p.foto, p.foco, 0.8, '', '', '')}
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">${v ? esc(nombreVar(p, v)) : esc(CATS[p.cat]?.n || '')}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea" role="group" aria-label="Cantidad"><button type="button" data-linea="-1" data-id="${p.id}" data-v="${ve}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" data-v="${ve}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-v="${ve}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p, v) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Arrancá por los pañales de tu talle o por un juguete para su edad.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver los productos</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (!foot) return;
  foot.hidden = false;
  const t = totales();
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('dr-sub', formatearPrecio(t.sub));
  const fila = document.getElementById('dr-desc-fila');
  if (fila) fila.hidden = !t.desc;
  set('dr-desc-k', cuponAplicado ? `Cupón ${cuponAplicado}` : 'Cupón');
  set('dr-desc', `−${formatearPrecio(t.desc)}`);
  const env = document.getElementById('dr-envio');
  if (env) {
    if (!envioElegido) env.innerHTML = '<a href="#envios" data-ir-envio>Calcular</a>';
    else if (envioElegido.modo === 'domicilio') env.innerHTML = `${formatearPrecio(envioElegido.costo)}<br><a href="#envios" data-ir-envio>${esc(ZONAS[envioElegido.zona]?.n || 'Cambiar')}</a>`;
    else env.innerHTML = `${envioElegido.modo === 'retiro' ? 'Retiro sin costo' : 'A coordinar'}<br><a href="#envios" data-ir-envio>Cambiar</a>`;
  }
  set('dr-total', formatearPrecio(t.total));
  const cupon = document.getElementById('cupon');
  if (cupon && document.activeElement !== cupon) cupon.value = cuponAplicado || '';
  const wsp = document.getElementById('drawer-wsp');
  if (wsp) wsp.href = wspLink(pedidoTexto());
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  cerrarModal(false);
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : document.getElementById('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer(devolverFoco = true) {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  if (devolverFoco) ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function irAEnvios() {
  cerrarDrawer(false);
  setTimeout(() => document.getElementById('envios')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 60);
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', () => cerrarDrawer());
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => cerrarDrawer());
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar, q.dataset.v || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const v = paso.dataset.v || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && (x.v || '') === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-ir-envio]')) { e.preventDefault(); irAEnvios(); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(false); irATienda(); }
  });
  document.getElementById('cupon-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('cupon');
    const cod = (input?.value || '').trim().toUpperCase();
    if (!cod) { cuponAplicado = null; Guardado.escribir('suanbaby_cupon', null); pintarDrawer(); pintarEnvio(); return; }
    if (!CUPONES[cod]) { showToast('Ese cupón no existe. Revisá cómo lo escribiste.'); return; }
    cuponAplicado = cod;
    Guardado.escribir('suanbaby_cupon', cod);
    showToast(`Aplicamos ${CUPONES[cod].txt} a tu compra.`);
    pintarDrawer();
    pintarEnvio();
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let modalProd = null;
let modalVar = '';
let modalQty = 1;
let modalFoco = null;

function modalStock(p) {
  const v = modalVar;
  const st = stockDe(p, v);
  const libre = st - Cart.enCarrito(p.id, v);
  if (st <= 0) return '<p class="m-stock m-stock--sin">Sin stock por ahora. Escribinos y te avisamos cuando vuelve.</p>';
  if (libre <= 0) return '<p class="m-stock m-stock--sin">Ya tenés en el carrito todo el stock de esta opción.</p>';
  if (st <= 4) return `<p class="m-stock m-stock--poco">Quedan ${st}${v ? ` en ${esc(nombreVar(p, v))}` : ''}</p>`;
  return `<p class="m-stock">En stock${v ? ` en ${esc(nombreVar(p, v))}` : ''}</p>`;
}

function modalHTML(p) {
  const v = modalVar;
  const vars = tieneVars(p)
    ? `<fieldset class="m-vars"><legend>${esc(p.vars.titulo)}</legend><div class="m-vars__lista">${varsDe(p).map(x => `<button type="button" class="m-var" data-mvar="${esc(x.k)}" aria-pressed="${x.k === v}"${x.stock <= 0 ? ' disabled' : ''}><b>${esc(x.txt)}</b>${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</button>`).join('')}</div></fieldset>`
    : '';
  const u = porUnidad(p, v);
  const datos = (p.datos || []).map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('') + (p.edad && p.cat !== 'juguetes' ? `<div><dt>Edad</dt><dd>${esc(edadTxt(p.edad[0]))}</dd></div>` : '');
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const relHTML = rel.length ? `<p class="m-rel-t">También te puede interesar</p><ul class="m-rels">${rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x.foto, x.foco, 0.8)}<span>${esc(x.nombre)}</span><b>${formatearPrecio(precioDesde(x))}</b></button></li>`).join('')}</ul>` : '';
  const st = stockDe(p, v);
  const libre = st - Cart.enCarrito(p.id, v);
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p.foto, p.foco, 0.8, 'm-foto', ' id="m-foto"', p.alt)}
      <div class="m-vistas" role="group" aria-label="Fotos del producto">
        <button type="button" class="m-vista" data-m-vista="0" aria-pressed="true">El producto</button>
        <button type="button" class="m-vista" data-m-vista="1" aria-pressed="false">Foto completa</button>
      </div>
    </div>
    <div class="m-info">
      <p class="m-marca">${esc(p.marca || CATS[p.cat]?.n || '')}</p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      <div class="m-precio">${precioHTML(p, v)}${u ? `<p class="m-unidad">${formatearPrecio(u)} cada ${p.cat === 'panales' ? 'pañal' : 'unidad'}</p>` : ''}</div>
      ${vars}
      <div id="m-stock">${modalStock(p)}</div>
      <div class="m-compra">
        <div class="stepper" id="m-stepper" role="group" aria-label="Cantidad"><button type="button" data-mpaso="-1" aria-label="Restar uno"${modalQty <= 1 ? ' disabled' : ''}>−</button><output id="m-q">${modalQty}</output><button type="button" data-mpaso="1" aria-label="Sumar uno"${modalQty >= Math.max(1, libre) ? ' disabled' : ''}>+</button></div>
        <button type="button" class="btn btn--cta" id="m-add"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO}Agregar · ${formatearPrecio(precioFinal(p, v) * modalQty)}</button>
        <button type="button" class="btn btn--line" id="m-comprar"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <p class="m-desc">${esc(p.desc)}</p>
      <dl class="m-datos">${datos}</dl>
      ${relHTML}
    </div>
  </div>`;
}

function pintarModal() {
  const cont = document.getElementById('modal-content');
  if (!cont || !modalProd) return;
  cont.innerHTML = modalHTML(modalProd);
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  if (!p || !modal) return;
  const yaAbierto = !modal.hidden;
  if (!yaAbierto) {
    const activo = document.activeElement;
    modalFoco = activo && activo.offsetParent !== null ? activo : null;
  }
  modalProd = p;
  modalVar = tieneVars(p) ? varDefault(p) : '';
  modalQty = 1;
  pintarModal();
  const box = modal.querySelector('.modal-box');
  if (box) box.scrollTop = 0;
  if (!yaAbierto) {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.classList.add('no-scroll');
  }
  document.getElementById('modal-close')?.focus();
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  modalProd = null;
  if (devolverFoco) modalFoco?.focus?.();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const p = modalProd;
    if (!p) return;
    const mv = e.target.closest('[data-mvar]');
    if (mv && !mv.disabled) { modalVar = mv.dataset.mvar; modalQty = 1; pintarModal(); return; }
    const paso = e.target.closest('[data-mpaso]');
    if (paso) {
      const libre = Math.max(1, stockDe(p, modalVar) - Cart.enCarrito(p.id, modalVar));
      modalQty = Math.max(1, Math.min(libre, modalQty + Number(paso.dataset.mpaso)));
      pintarModal();
      return;
    }
    const vista = e.target.closest('[data-m-vista]');
    if (vista) {
      const foto = document.getElementById('m-foto');
      const completa = vista.dataset.mVista === '1';
      if (foto) {
        foto.setAttribute('style', completa ? '--op:50% 50%;--to:50% 50%;--z:1' : recorte(p.foto, p.foco, 0.8));
        const img = foto.querySelector('img');
        if (img) img.style.objectFit = completa ? 'contain' : '';
      }
      modal.querySelectorAll('[data-m-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    if (e.target.closest('#m-add') || e.target.closest('#m-comprar')) {
      const comprar = !!e.target.closest('#m-comprar');
      const ok = Cart.add(p, modalQty, modalVar);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de esta opción.'); return; }
      showToast(`Sumaste ${plural(ok, 'unidad', 'unidades')} de ${p.nombre}${conVar(p, modalVar)}.`);
      modalQty = 1;
      if (comprar) { cerrarModal(false); abrirDrawer(); }
      else pintarModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod && getProducto(prod)) window.addEventListener('load', () => abrirModal(prod));
}

/* ---------- clicks compartidos ---------- */
function initClicks() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.modal')) { e.preventDefault(); abrirModal(quick.dataset.quick); return; }
    if (quick && e.target.closest('.m-rel')) { e.preventDefault(); abrirModal(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const p = getProducto(st.dataset.stepper);
      const out = st.querySelector('output');
      const libre = Math.max(1, stockDe(p) - Cart.enCarrito(p.id));
      out.textContent = String(Math.max(1, Math.min(libre, (Number(out.textContent) || 1) + Number(paso.dataset.paso))));
      syncStepper(st, p);
      return;
    }
    const add = e.target.closest('[data-add]');
    const comprar = e.target.closest('[data-comprar]');
    if (add || comprar) {
      const id = (add || comprar).dataset.add || (add || comprar).dataset.comprar;
      const p = getProducto(id);
      if (!p) return;
      if (tieneVars(p)) { abrirModal(p.id); return; }
      const card = (add || comprar).closest('.card');
      const out = card?.querySelector('[data-stepper] output');
      const qty = Number(out?.textContent) || 1;
      const ok = Cart.add(p, qty);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de este producto.'); return; }
      if (out) out.textContent = '1';
      if (comprar) abrirDrawer();
      else showToast(`Sumaste ${plural(ok, 'unidad', 'unidades')} de ${p.nombre}.`);
      return;
    }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#filtros')) { e.preventDefault(); filtrarPor('cat', cat.dataset.cat); return; }
    const oferta = e.target.closest('[data-oferta]');
    if (oferta) { e.preventDefault(); filtrarPor('oferta'); return; }
    const ver = e.target.closest('[data-ver-todo]');
    if (ver) { e.preventDefault(); filtrarPor(''); }
  });
}

function initSuscripcion() {
  const form = document.getElementById('susc-form');
  if (!form) return;
  const input = document.getElementById('susc-mail');
  const msg = document.getElementById('susc-msg');
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = (input?.value || '').trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    input?.setAttribute('aria-invalid', String(!ok));
    if (!ok) {
      if (msg) { msg.textContent = 'Revisá el mail: le falta algo.'; msg.classList.add('is-error'); }
      input?.focus();
      return;
    }
    if (msg) { msg.textContent = ''; msg.classList.remove('is-error'); }
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    setTimeout(() => {
      cuponAplicado = 'BIENVENIDA10';
      Guardado.escribir('suanbaby_cupon', cuponAplicado);
      document.dispatchEvent(new CustomEvent('cart:updated'));
      if (msg) msg.innerHTML = 'Tu código: <span class="susc__codigo">BIENVENIDA10 <button type="button" data-copiar="BIENVENIDA10">Copiar</button></span>';
      showToast('¡Listo! Ya aplicamos el 10% a tu carrito. En la web real el código también te llega por mail.');
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Quiero mi 10%'; }
    }, 800);
  });
  form.addEventListener('click', e => {
    const c = e.target.closest('[data-copiar]');
    if (!c) return;
    const txt = c.dataset.copiar;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => showToast('Código copiado.'), () => showToast(`Tu código es ${txt}.`));
    else showToast(`Tu código es ${txt}.`);
  });
}

/* ---------- flotantes, badge, nav ---------- */
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function updateCartBadge(bump = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n && bump && !reduceMotion) b.classList.add('bump');
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
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

/* ---------- entradas ---------- */
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.temporada, .sello'), { y: 16, scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
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

/* ---------- arranque ---------- */
sanearCarrito();
initModelBarScroll();
initTemporada();
initCats();
initRail();
initCatalogo();
initFiltrosPanel();
initEnvio();
initMundos();
initReveals();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initHeroMotion();
initNav();
initDrawer();
initModal();
initClicks();
initSuscripcion();
initFloats();
updateCartBadge(false);
document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarCards(); });
document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
