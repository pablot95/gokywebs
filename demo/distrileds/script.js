const WHATSAPP = '5492302483104';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGINA = document.body.dataset.pagina || 'home';
const MODELO = document.body.dataset.modelo || '1';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
const POR_PAGINA = 16;

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
  { id: 'tiras', nombre: 'Tiras LED', img: 'images/p-tira-rgb.webp' },
  { id: 'neon', nombre: 'Neón', img: 'images/p-neon-12v.webp' },
  { id: 'pixel', nombre: 'Píxel', img: 'images/tira-pixel.webp' },
  { id: 'controladoras', nombre: 'Controladoras', img: 'images/p-controladora-ir.webp' },
  { id: 'fuentes', nombre: 'Fuentes', img: 'images/p-fuente-12v.webp' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/p-perfil-aluminio.webp' },
];

const LUCES = { calida: 'Cálida', neutra: 'Neutra', fria: 'Fría', rgb: 'RGB', pixel: 'Píxel', hielo: 'Azul hielo' };
const TENSIONES = [5, 12, 24, 220];
const USOS = { interior: 'Interior', exterior: 'Exterior (IP65)' };
const ORDENES = { destacados: 'Destacados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)', nuevos: 'Recién llegados' };

const PRODUCTOS = [
  {
    id: 'tira-rgb-5050', nombre: 'Tira LED 5050 RGB 12V · rollo 5 m', corto: 'Tira 5050 RGB 12V', cat: 'tiras',
    img: 'images/p-tira-rgb.webp', alt: 'Rollo de tira LED 5050 RGB encendida en azul y violeta',
    tension: 12, wm: 14.4, unidad: 'rollo', metros: 5, etiqueta: '12V · 60 LED/m · RGB',
    destacado: true, rango: 1, alta: 20261002, descuento: 0, varTitulo: 'Uso',
    variantes: [
      { v: 'ip20', corto: 'IP20', nombre: 'Interior · IP20', precio: 16900, stock: 18, ip: 'IP20', luz: 'rgb' },
      { v: 'ip65', corto: 'IP65', nombre: 'Exterior · IP65', precio: 19900, stock: 11, ip: 'IP65', luz: 'rgb' },
    ],
    specs: [['Tensión', '12 V'], ['Chip', 'SMD 5050 RGB'], ['LED', '60 por metro (300 en total)'], ['Consumo', '14,4 W/m (72 W el rollo)'], ['Corte', 'cada 3 LED (5 cm)'], ['Conexión', '4 pines: +12 V, R, G y B']],
    desc: 'El rollo clásico para ambientar con color: cinta autoadhesiva, se corta cada 5 cm y se maneja con una controladora RGB. La versión IP65 viene cubierta en silicona para exterior o lugares húmedos.',
    tags: ['rgb', 'colores', 'gamer', 'ambiente', 'smd'],
  },
  {
    id: 'tira-blanca-12v', nombre: 'Tira LED 2835 blanca 12V · rollo 5 m', corto: 'Tira 2835 blanca 12V', cat: 'tiras',
    img: 'images/tira-calida.webp', alt: 'Rollo de tira LED blanca cálida encendida',
    tension: 12, wm: 6, unidad: 'rollo', metros: 5, etiqueta: '12V · 60 LED/m · 6 W/m',
    destacado: true, rango: 2, alta: 20261003, descuento: 0, varTitulo: 'Luz y uso',
    variantes: [
      { v: 'calida-ip20', corto: 'Cálida', nombre: 'Cálida 3000 K · interior', precio: 12500, stock: 25, ip: 'IP20', luz: 'calida' },
      { v: 'calida-ip65', corto: 'Cálida IP65', nombre: 'Cálida 3000 K · exterior IP65', precio: 14900, stock: 12, ip: 'IP65', luz: 'calida' },
      { v: 'neutra-ip20', corto: 'Neutra', nombre: 'Neutra 4000 K · interior', precio: 12500, stock: 10, ip: 'IP20', luz: 'neutra' },
      { v: 'fria-ip20', corto: 'Fría', nombre: 'Fría 6500 K · interior', precio: 12500, stock: 20, ip: 'IP20', luz: 'fria' },
      { v: 'fria-ip65', corto: 'Fría IP65', nombre: 'Fría 6500 K · exterior IP65', precio: 14900, stock: 0, ip: 'IP65', luz: 'fria' },
    ],
    specs: [['Tensión', '12 V'], ['Chip', 'SMD 2835'], ['LED', '60 por metro (300 en total)'], ['Consumo', '6 W/m (30 W el rollo)'], ['Corte', 'cada 3 LED (5 cm)'], ['Temperatura', '3000 K, 4000 K o 6500 K']],
    desc: 'Luz blanca pareja para bajo alacenas, placares, cielorrasos y vitrinas. Consume poco y se esconde fácil dentro de un perfil de aluminio.',
    tags: ['blanca', 'calida', 'fria', 'neutra', 'cocina', 'alacena', 'smd'],
  },
  {
    id: 'pixel-ws2812b', nombre: 'Tira píxel WS2812B 5V 60 LED/m · rollo 5 m', corto: 'Píxel WS2812B 5V', cat: 'pixel',
    img: 'images/tira-pixel.webp', alt: 'Rollo de tira píxel con cada LED de un color distinto',
    tension: 5, wm: 18, unidad: 'rollo', metros: 5, etiqueta: '5V · 60 LED/m · direccionable',
    destacado: true, rango: 3, alta: 20261005, descuento: 0, varTitulo: 'Protección',
    variantes: [
      { v: 'ip30', corto: 'IP30', nombre: 'Sin silicona · IP30', precio: 48900, stock: 7, ip: 'IP30', luz: 'pixel' },
      { v: 'ip65', corto: 'IP65', nombre: 'Con silicona · IP65', precio: 54900, stock: 5, ip: 'IP65', luz: 'pixel' },
    ],
    specs: [['Tensión', '5 V'], ['Chip', 'WS2812B, uno por LED'], ['LED', '60 por metro (300 en total)'], ['Consumo máximo', '18 W/m en blanco a pleno'], ['Conexión', '3 cables: 5 V, datos y GND'], ['Corte', 'en cada LED (1,6 cm)']],
    desc: 'Cada LED se maneja por separado: degradés, efectos que corren y animaciones. Funciona con controladoras píxel y con placas tipo ESP32 o Arduino.',
    tags: ['direccionable', 'efectos', 'arduino', 'esp32', 'wled', 'rgb'],
  },
  {
    id: 'neon-12v', nombre: 'Neón flex 12V 6 × 12 mm · por metro', corto: 'Neón flex 12V', cat: 'neon',
    img: 'images/p-neon-12v.webp', alt: 'Neón flex azul hielo enrollado y encendido',
    tension: 12, wm: 8, unidad: 'metro', etiqueta: '12V · 8 W/m · IP65',
    destacado: true, rango: 4, alta: 20261007, descuento: 10, varTitulo: 'Color',
    variantes: [
      { v: 'hielo', corto: 'Azul hielo', nombre: 'Azul hielo', precio: 6900, stock: 60, ip: 'IP65', luz: 'hielo' },
      { v: 'calida', corto: 'Cálido', nombre: 'Blanco cálido', precio: 6900, stock: 45, ip: 'IP65', luz: 'calida' },
      { v: 'fria', corto: 'Frío', nombre: 'Blanco frío', precio: 6900, stock: 38, ip: 'IP65', luz: 'fria' },
    ],
    specs: [['Tensión', '12 V'], ['Medida', '6 × 12 mm'], ['Consumo', '8 W/m'], ['Protección', 'IP65, apto exterior'], ['Corte', 'cada 2,5 cm'], ['Venta', 'por metro']],
    desc: 'Luz continua, sin puntos, en silicona flexible: para carteles, letras, contornos de muebles y espejos. Se dobla a mano y se corta cada 2,5 cm.',
    tags: ['neon', 'flex', 'cartel', 'letras', 'contorno', 'sin puntos'],
  },
  {
    id: 'neon-220v', nombre: 'Neón flex 220V azul hielo con ficha', corto: 'Neón flex 220V', cat: 'neon',
    img: 'images/p-neon-220v.webp', alt: 'Punta de neón flex azul hielo con su conector',
    tension: 220, wm: 9, unidad: 'rollo', etiqueta: '220V · con ficha · IP65',
    destacado: true, rango: 5, alta: 20261001, descuento: 0, varTitulo: 'Largo',
    variantes: [
      { v: '5m', corto: '5 m', nombre: 'Rollo de 5 m', precio: 42900, stock: 5, ip: 'IP65', luz: 'hielo' },
      { v: '10m', corto: '10 m', nombre: 'Rollo de 10 m', precio: 79900, stock: 3, ip: 'IP65', luz: 'hielo' },
    ],
    specs: [['Tensión', '220 V, directo a la red'], ['Consumo', '9 W/m'], ['Protección', 'IP65, apto exterior'], ['Corte', 'solo cada 1 m, en las marcas'], ['Incluye', 'ficha con rectificador']],
    desc: 'Va directo a 220 V con su ficha: no lleva fuente. Para fachadas, vidrieras y contornos en exterior. Se corta solo en las marcas de cada metro.',
    tags: ['neon', 'flex', 'fachada', 'vidriera', 'exterior', 'sin fuente'],
  },
  {
    id: 'tira-blanca-24v', nombre: 'Tira LED 2835 blanca 24V 120 LED/m · rollo 5 m', corto: 'Tira 2835 blanca 24V', cat: 'tiras',
    img: 'images/p-tira-24v.webp', alt: 'Tramo de tira LED blanca cálida con los LED encendidos',
    tension: 24, wm: 9.6, unidad: 'rollo', metros: 5, etiqueta: '24V · 120 LED/m · 9,6 W/m',
    destacado: true, rango: 6, alta: 20260928, descuento: 0, varTitulo: 'Luz',
    variantes: [
      { v: 'calida', corto: 'Cálida', nombre: 'Cálida 3000 K', precio: 21900, stock: 9, ip: 'IP20', luz: 'calida' },
      { v: 'neutra', corto: 'Neutra', nombre: 'Neutra 4000 K', precio: 21900, stock: 6, ip: 'IP20', luz: 'neutra' },
      { v: 'fria', corto: 'Fría', nombre: 'Fría 6500 K', precio: 21900, stock: 7, ip: 'IP20', luz: 'fria' },
    ],
    specs: [['Tensión', '24 V'], ['Chip', 'SMD 2835'], ['LED', '120 por metro (600 en total)'], ['Consumo', '9,6 W/m (48 W el rollo)'], ['Corte', 'cada 6 LED (5 cm)'], ['Ideal para', 'tramos largos y luz principal']],
    desc: 'Más LED por metro y menos caída de tensión: la luz llega pareja de punta a punta en tramos largos. Para cocinas, locales y luz principal de ambientes.',
    tags: ['blanca', 'calida', 'fria', 'neutra', 'local', 'smd'],
  },
  {
    id: 'pixel-ws2811-12v', nombre: 'Tira píxel WS2811 12V 60 LED/m · rollo 5 m', corto: 'Píxel WS2811 12V', cat: 'pixel',
    img: 'images/p-pixel-ws2811.webp', alt: 'Punta de tira píxel con su conector de tres cables',
    tension: 12, wm: 14.4, unidad: 'rollo', metros: 5, etiqueta: '12V · 60 LED/m · direccionable',
    destacado: true, rango: 7, alta: 20260925, descuento: 0, varTitulo: 'Protección',
    variantes: [
      { v: 'ip30', corto: 'IP30', nombre: 'Sin silicona · IP30', precio: 39900, stock: 6, ip: 'IP30', luz: 'pixel' },
      { v: 'ip65', corto: 'IP65', nombre: 'Con silicona · IP65', precio: 44900, stock: 4, ip: 'IP65', luz: 'pixel' },
    ],
    specs: [['Tensión', '12 V'], ['Chip', 'WS2811, uno cada 3 LED'], ['LED', '60 por metro (300 en total)'], ['Consumo máximo', '14,4 W/m'], ['Conexión', '3 cables: 12 V, datos y GND'], ['Corte', 'cada 3 LED (5 cm)']],
    desc: 'Efectos píxel con 12 V: menos caída de tensión que la de 5 V en tramos largos. Los LED se controlan de a grupos de 3.',
    tags: ['direccionable', 'efectos', 'rgb'],
  },
  {
    id: 'controladora-rgb-ir', nombre: 'Controladora RGB con control remoto de 24 teclas', corto: 'Controladora RGB IR', cat: 'controladoras',
    img: 'images/p-controladora-ir.webp', alt: 'Controladora RGB con su control remoto de 24 teclas de colores',
    tension: null, etiqueta: '12-24V · 6 A · RGB',
    destacado: true, rango: 8, alta: 20260920, descuento: 0, varTitulo: '',
    variantes: [{ v: 'unica', corto: 'Única', nombre: 'Única', precio: 5900, stock: 30 }],
    specs: [['Tensión', '12 a 24 V'], ['Corriente máxima', '6 A (72 W a 12 V)'], ['Control', 'remoto infrarrojo de 24 teclas'], ['Funciones', '16 colores, brillo y 4 efectos'], ['Conexión', 'hembra de 4 pines']],
    desc: 'La forma más simple de manejar una tira RGB: conectás la fuente de un lado y la tira del otro, y elegís color, brillo y efectos con el control.',
    tags: ['control', 'remoto', 'rgb', 'infrarrojo'],
  },
  {
    id: 'fuente-12v-metalica', nombre: 'Fuente switching 12V metálica', corto: 'Fuente 12V metálica', cat: 'fuentes',
    img: 'images/p-fuente-12v.webp', alt: 'Fuente switching metálica con borneras atornillables',
    tension: 12, etiqueta: '220V → 12V · gabinete',
    destacado: false, rango: 9, alta: 20260930, descuento: 0, varTitulo: 'Potencia',
    variantes: [
      { v: '5a', corto: '5 A', nombre: '5 A · 60 W', precio: 13900, stock: 15, amp: 5, w: 60 },
      { v: '10a', corto: '10 A', nombre: '10 A · 120 W', precio: 18900, stock: 14, amp: 10, w: 120 },
      { v: '20a', corto: '20 A', nombre: '20 A · 240 W', precio: 27900, stock: 8, amp: 20, w: 240 },
      { v: '30a', corto: '30 A', nombre: '30 A · 360 W', precio: 36900, stock: 5, amp: 30, w: 360 },
    ],
    specs: [['Entrada', '220 V'], ['Salida', '12 V, regulable ±10 %'], ['Potencias', '60, 120, 240 y 360 W'], ['Conexión', 'borneras atornillables'], ['Uso', 'interior, en lugar seco y ventilado']],
    desc: 'Fuente de gabinete para instalaciones fijas: alimenta tiras, neón y controladoras de 12 V. Elegí la potencia con la calculadora y dejá siempre un 20 % de margen.',
    tags: ['transformador', 'alimentacion', 'switching'],
  },
  {
    id: 'fuente-12v-ficha', nombre: 'Fuente 12V con ficha tipo cargador', corto: 'Fuente 12V con ficha', cat: 'fuentes',
    img: 'images/p-fuente-ficha.webp', alt: 'Fuente de 12 V tipo cargador con cable y ficha plug',
    tension: 12, etiqueta: '220V → 12V · plug 5,5 mm',
    destacado: false, rango: 10, alta: 20261004, descuento: 0, varTitulo: 'Potencia',
    variantes: [
      { v: '2a', corto: '2 A', nombre: '2 A · 24 W', precio: 6900, stock: 22, amp: 2, w: 24 },
      { v: '3a', corto: '3 A', nombre: '3 A · 36 W', precio: 8500, stock: 16, amp: 3, w: 36 },
      { v: '5a', corto: '5 A', nombre: '5 A · 60 W', precio: 10900, stock: 12, amp: 5, w: 60 },
    ],
    specs: [['Entrada', '220 V, se enchufa directo'], ['Salida', '12 V'], ['Potencias', '24, 36 y 60 W'], ['Conexión', 'plug 5,5 × 2,1 mm'], ['Uso', 'interior']],
    desc: 'Se enchufa al toma y trae ficha plug: la más práctica para tramos cortos, escritorios, muebles y vitrinas.',
    tags: ['transformador', 'alimentacion', 'cargador', 'enchufe'],
  },
  {
    id: 'controladora-rgb-wifi', nombre: 'Controladora RGB WiFi con app', corto: 'Controladora RGB WiFi', cat: 'controladoras',
    img: 'images/p-controladora-wifi.webp', alt: 'Módulo controlador negro con cables de conexión RGB',
    tension: null, etiqueta: '12-24V · 6 A · app',
    destacado: false, rango: 11, alta: 20261006, descuento: 0, varTitulo: '',
    variantes: [{ v: 'unica', corto: 'Única', nombre: 'Única', precio: 12900, stock: 12 }],
    specs: [['Tensión', '12 a 24 V'], ['Corriente máxima', '6 A (72 W a 12 V)'], ['Control', 'app en el celular, por WiFi'], ['Funciones', 'colores, brillo, escenas y horarios'], ['Conexión', 'hembra de 4 pines']],
    desc: 'Manejá la tira RGB desde el celular: colores, brillo, escenas y horarios de encendido y apagado. Para tiras RGB de 12 o 24 V.',
    tags: ['wifi', 'app', 'celular', 'rgb', 'inteligente'],
  },
  {
    id: 'perfil-aluminio', nombre: 'Perfil de aluminio con difusor opal y tapas', corto: 'Perfil de aluminio', cat: 'accesorios',
    img: 'images/p-perfil-aluminio.webp', alt: 'Perfil de aluminio con difusor opal y dos tapas',
    tension: null, unidad: 'tramo', etiqueta: 'Para tiras de hasta 10 mm',
    destacado: false, rango: 12, alta: 20261006, descuento: 0, varTitulo: 'Largo',
    variantes: [
      { v: '1m', corto: '1 m', nombre: 'Tramo de 1 m', precio: 7900, stock: 40 },
      { v: '2m', corto: '2 m', nombre: 'Tramo de 2 m', precio: 13900, stock: 25 },
    ],
    specs: [['Material', 'aluminio anodizado'], ['Difusor', 'opal, esconde los puntos de luz'], ['Ancho interno', '10 mm'], ['Incluye', '2 tapas'], ['Largos', '1 y 2 m']],
    desc: 'Disipa el calor de la tira, la protege y esconde los puntos de luz para que se vea una línea pareja. Se corta con sierra a la medida.',
    tags: ['perfil', 'difusor', 'canal', 'aluminio', 'disipador'],
  },
  {
    id: 'conectores-rapidos', nombre: 'Conectores rápidos para tira de 10 mm · pack x 5', corto: 'Conectores rápidos x 5', cat: 'accesorios',
    img: 'images/p-conectores.webp', alt: 'Conectores rápidos transparentes y blancos para tira LED',
    tension: null, unidad: 'pack', etiqueta: 'Sin soldar · pack x 5',
    destacado: false, rango: 13, alta: 20260926, descuento: 0, varTitulo: 'Tipo',
    variantes: [
      { v: '2p', corto: '2 pines', nombre: '2 pines · un color', precio: 3900, stock: 50 },
      { v: '4p', corto: '4 pines', nombre: '4 pines · RGB', precio: 4900, stock: 35 },
    ],
    specs: [['Para', 'tiras de 10 mm de ancho'], ['Pines', '2 (un color) o 4 (RGB)'], ['Contenido', '5 conectores'], ['Instalación', 'a presión, sin soldar']],
    desc: 'Unen o empalman tramos de tira sin soldar. Elegí 2 pines para tiras de un color y 4 pines para RGB.',
    tags: ['conector', 'empalme', 'union', 'clip'],
  },
  {
    id: 'fuente-24v-metalica', nombre: 'Fuente switching 24V metálica', corto: 'Fuente 24V metálica', cat: 'fuentes',
    img: 'images/p-fuente-24v.webp', alt: 'Borneras de una fuente switching metálica',
    tension: 24, etiqueta: '220V → 24V · gabinete',
    destacado: false, rango: 14, alta: 20260915, descuento: 0, varTitulo: 'Potencia',
    variantes: [
      { v: '5a', corto: '5 A', nombre: '5 A · 120 W', precio: 22900, stock: 6, amp: 5, w: 120 },
      { v: '10a', corto: '10 A', nombre: '10 A · 240 W', precio: 33900, stock: 5, amp: 10, w: 240 },
      { v: '15a', corto: '15 A', nombre: '15 A · 360 W', precio: 41900, stock: 3, amp: 15, w: 360 },
    ],
    specs: [['Entrada', '220 V'], ['Salida', '24 V, regulable ±10 %'], ['Potencias', '120, 240 y 360 W'], ['Conexión', 'borneras atornillables'], ['Uso', 'interior, en lugar seco y ventilado']],
    desc: 'Para tiras de 24 V y tramos largos: misma potencia con la mitad de corriente, cables más finos y menos caída de tensión.',
    tags: ['transformador', 'alimentacion', 'switching'],
  },
  {
    id: 'fuente-5v-metalica', nombre: 'Fuente switching 5V metálica', corto: 'Fuente 5V metálica', cat: 'fuentes',
    img: 'images/p-fuente-5v.webp', alt: 'Gabinete perforado de una fuente switching metálica',
    tension: 5, etiqueta: '220V → 5V · gabinete',
    destacado: false, rango: 15, alta: 20260918, descuento: 0, varTitulo: 'Potencia',
    variantes: [
      { v: '10a', corto: '10 A', nombre: '10 A · 50 W', precio: 16900, stock: 8, amp: 10, w: 50 },
      { v: '20a', corto: '20 A', nombre: '20 A · 100 W', precio: 22900, stock: 6, amp: 20, w: 100 },
      { v: '40a', corto: '40 A', nombre: '40 A · 200 W', precio: 34900, stock: 4, amp: 40, w: 200 },
    ],
    specs: [['Entrada', '220 V'], ['Salida', '5 V, regulable ±10 %'], ['Potencias', '50, 100 y 200 W'], ['Conexión', 'borneras atornillables'], ['Uso', 'interior, en lugar seco y ventilado']],
    desc: 'La fuente para tiras píxel de 5 V: entrega la corriente alta que piden los LED direccionables a pleno.',
    tags: ['transformador', 'alimentacion', 'switching', 'pixel'],
  },
  {
    id: 'cables-union', nombre: 'Cables de unión con conector · pack x 2', corto: 'Cables de unión x 2', cat: 'accesorios',
    img: 'images/p-cables-union.webp', alt: 'Cables cortos rojo y negro con conectores rápidos en las puntas',
    tension: null, unidad: 'pack', etiqueta: '15 cm · 2 pines · pack x 2',
    destacado: false, rango: 16, alta: 20260912, descuento: 0, varTitulo: '',
    variantes: [{ v: 'unica', corto: 'Única', nombre: '2 pines', precio: 3200, stock: 40 }],
    specs: [['Largo', '15 cm'], ['Pines', '2 (un color)'], ['Contenido', '2 cables'], ['Instalación', 'a presión, sin soldar']],
    desc: 'Para doblar esquinas o separar tramos: 15 cm de cable con un conector rápido en cada punta.',
    tags: ['conector', 'esquina', 'union', 'empalme', 'cable'],
  },
  {
    id: 'cable-bipolar', nombre: 'Cable bipolar rojo y negro 2 × 0,5 mm · por metro', corto: 'Cable bipolar 2 × 0,5', cat: 'accesorios',
    img: 'images/p-cable-bipolar.webp', alt: 'Rollo de cable bipolar rojo y negro',
    tension: null, unidad: 'metro', etiqueta: '2 × 0,5 mm · por metro',
    destacado: false, rango: 17, alta: 20260910, descuento: 0, varTitulo: '',
    variantes: [{ v: 'unica', corto: 'Única', nombre: 'Por metro', precio: 1100, stock: 300 }],
    specs: [['Sección', '2 × 0,5 mm'], ['Colores', 'rojo (+) y negro (−)'], ['Venta', 'por metro']],
    desc: 'Para llevar la alimentación de la fuente a la tira. Rojo positivo y negro negativo, así no hay confusión al conectar.',
    tags: ['cable', 'alimentacion', 'bipolar'],
  },
  {
    id: 'tira-cob-24v', nombre: 'Tira COB 24V cálida (borrador)', corto: 'Tira COB 24V', cat: 'tiras', visible: false,
    img: 'images/tira-calida.webp', alt: 'Tira COB',
    tension: 24, wm: 10, unidad: 'rollo', metros: 5, etiqueta: '24V · COB',
    destacado: false, rango: 99, alta: 20261008, descuento: 0, varTitulo: '',
    variantes: [{ v: 'unica', corto: 'Única', nombre: 'Única', precio: 25900, stock: 0, ip: 'IP20', luz: 'calida' }],
    specs: [], desc: '', tags: [],
  },
];

const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/×/g, 'x').replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)\s+(v|a|w|m|k|mm)\b/g, '$1$2');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const formatearNum = (n, dec = 1) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: dec });
const redondear = n => Math.round(n / 10) * 10;
const precioVar = (p, vv) => (p.descuento > 0 ? redondear(vv.precio * (1 - p.descuento / 100)) : vv.precio);
const varDe = (p, v) => p.variantes.find(x => x.v === v) || p.variantes[0];
const primeraConStock = p => p.variantes.find(x => x.stock > 0) || p.variantes[0];
const stockTotal = p => p.variantes.reduce((s, x) => s + (x.stock || 0), 0);
const desdeDe = p => Math.min(...p.variantes.map(x => precioVar(p, x)));
const catDe = id => CATEGORIAS.find(c => c.id === id);
const sufijo = p => (p.unidad === 'metro' ? ' /m' : '');
const esExterior = ip => ip === 'IP65' || ip === 'IP67';

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v != null && v !== '' ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), luz = lista(f.luz), tension = lista(f.tension).map(Number), uso = lista(f.uso), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.destacado) return false;
    if (f.destacado === false && p.destacado) return false;
    if (f.conConsumo && !(p.wm > 0)) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (tension.length && !tension.includes(p.tension)) return false;
    if (luz.length && !p.variantes.some(x => luz.includes(x.luz) && (!f.stock || x.stock > 0))) return false;
    if (uso.length && !p.variantes.some(x => x.ip && uso.includes(esExterior(x.ip) ? 'exterior' : 'interior'))) return false;
    if (f.precioMax != null && desdeDe(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desdeDe(a) - desdeDe(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desdeDe(b) - desdeDe(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, p.desc, p.etiqueta, p.tension ? `${p.tension}v` : '',
      ...p.variantes.map(x => `${x.nombre} ${x.luz ? LUCES[x.luz] : ''} ${x.ip || ''}`), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) {
    const tokens = textoDe(p).split(/[^a-z0-9.]+/).filter(Boolean);
    tokens.forEach(t => { const m = t.match(/^(\d+(?:\.\d+)?)[a-z]+$/); if (m) tokens.push(m[1]); });
    tokensBusqueda.set(p.id, new Set(tokens));
  }
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const recordar = items => items.forEach(p => cacheProductos.set(p.id, p));

const Cart = {
  KEY: 'distrileds_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v, qty = 1) {
    const vv = varDe(producto, v);
    const tope = vv.stock ?? 99;
    if (tope <= 0) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === vv.v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, v: vv.v, qty: Math.min(qty, tope) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, tope)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); const vv = p ? varDe(p, v) : null;
    it.qty = Math.max(1, Math.min(qty, vv?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      const vv = p?.variantes.find(x => x.v === i.v);
      return p && vv ? { ...i, p, vv, unit: precioVar(p, vv) } : null;
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.unit * l.qty, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id); const vv = p?.variantes.find(x => x.v === i.v);
      if (!vv || vv.stock <= 0) { changed = true; return false; }
      if (i.qty > vv.stock) { i.qty = vv.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
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

const ICO_FLECHA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const ICO_CARRITO = '<svg class="ico ico--cart" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" class="ico-relleno"/><circle cx="17.5" cy="20" r="1.5" class="ico-relleno"/></svg>';
const ICO_TACHO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/></svg>';
const ICO_WSP = '<svg class="ico ico--wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const wspHref = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

function precioHTML(p, vv) {
  const final = precioVar(p, vv);
  return `<span class="precio">${formatearPrecio(final)}<small>${sufijo(p)}</small></span>${p.descuento > 0 ? `<s class="precio-antes">${formatearPrecio(vv.precio)}</s>` : ''}`;
}

function stockTexto(vv) {
  if (vv.stock <= 0) return 'Sin stock en esta opción';
  if (vv.stock <= 5) return `Últimas ${vv.stock} unidades`;
  return 'En stock';
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  no: '',
};

function cardHTML(p, { anim = 'subir', clase = '', compacta = false } = {}) {
  const vv = primeraConStock(p);
  const multi = p.variantes.length > 1;
  const chips = multi && !compacta ? `<div class="card__vars" role="group" aria-label="${esc(p.varTitulo || 'Opciones')}">${p.variantes.map(x => `<button type="button" class="card__var${x.v === vv.v ? ' is-on' : ''}${x.stock <= 0 ? ' is-agotado' : ''}" data-var="${x.v}" aria-pressed="${x.v === vv.v}">${esc(x.corto)}</button>`).join('')}</div>` : '';
  const badge = p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : stockTotal(p) <= 5 ? '<span class="badge">Últimas unidades</span>' : '';
  const precio = compacta && multi
    ? `<span class="precio"><small class="precio-desde">desde</small>${formatearPrecio(desdeDe(p))}<small>${sufijo(p)}</small></span>`
    : precioHTML(p, vv);
  const sinStock = vv.stock <= 0;
  let acciones;
  if (compacta) {
    acciones = multi
      ? `<button type="button" class="btn btn--ghost prod-add" data-quick="${p.id}">Ver opciones</button>`
      : `<button type="button" class="btn btn--cta prod-add" data-add${sinStock ? ' disabled' : ''} aria-label="Agregar ${esc(p.corto)} al carrito">${ICO_CARRITO}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>`;
  } else {
    acciones = `<div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-menos aria-label="Uno menos">−</button><span class="stepper__n" data-n>1</span><button type="button" data-mas aria-label="Uno más">+</button></div>
      <button type="button" class="btn btn--cta prod-add" data-add${sinStock ? ' disabled' : ''} aria-label="Agregar ${esc(p.corto)} al carrito">${ICO_CARRITO}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>`;
  }
  return `<article class="card${compacta ? ' card--compacta' : ''} ${clase}" data-id="${p.id}" data-v="${vv.v}"${ANIM[anim] || ''}>
  <a class="card__link" href="${CATALOGO_URL}?producto=${p.id}" data-quick="${p.id}">
    <span class="card__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800"><span class="etiqueta card__etiqueta">${esc(p.etiqueta)}</span>${badge}</span>
    <span class="card__cab"><span class="card__cat">${esc(catDe(p.cat)?.nombre)}</span><h3 class="card__nombre">${esc(p.nombre)}</h3></span>
  </a>
  <div class="card__pie">
    ${chips}${multi ? `<p class="card__nopc">${p.variantes.length} opciones</p>` : ''}
    <p class="card__precio" data-card-precio>${precio}</p>
    <div class="prod-actions">${acciones}</div>
    ${compacta ? '' : `<button type="button" class="card__comprar" data-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>`}
  </div>
</article>`;
}

function refrescarCard(card) {
  const p = getProducto(card.dataset.id);
  if (!p) return;
  const vv = varDe(p, card.dataset.v);
  card.querySelectorAll('[data-var]').forEach(b => {
    const on = b.dataset.var === vv.v;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  const precio = card.querySelector('[data-card-precio]');
  if (precio) precio.innerHTML = precioHTML(p, vv);
  const n = card.querySelector('[data-n]');
  if (n) n.textContent = '1';
  const add = card.querySelector('[data-add]');
  if (add) {
    add.disabled = vv.stock <= 0;
    add.querySelector('span').textContent = vv.stock <= 0 ? 'Sin stock' : 'Agregar';
  }
  const comprar = card.querySelector('[data-comprar]');
  if (comprar) comprar.disabled = vv.stock <= 0;
}

function agregarYAvisar(p, v, qty) {
  const vv = varDe(p, v);
  const sumados = Cart.add(p, vv.v, qty);
  if (sumados > 0) {
    const opcion = p.variantes.length > 1 ? ` (${vv.nombre})` : '';
    showToast(`Sumaste ${sumados > 1 ? sumados + ' × ' : ''}${p.corto}${opcion} al carrito`);
  } else {
    showToast(vv.stock <= 0 ? 'Esa opción no tiene stock por ahora' : `Ya tenés todo el stock disponible de ${p.corto}`);
  }
  return sumados;
}

function initCards() {
  document.addEventListener('click', e => {
    const card = e.target.closest('.card');
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('[data-add],[data-comprar],[data-var],.stepper')) {
      e.preventDefault();
      QV.abrir(quick.dataset.quick, { v: card?.dataset.v, disparador: quick });
      return;
    }
    if (!card) return;
    const p = getProducto(card.dataset.id);
    if (!p) return;
    const chip = e.target.closest('[data-var]');
    if (chip) { card.dataset.v = chip.dataset.var; refrescarCard(card); return; }
    const n = card.querySelector('[data-n]');
    const qty = n ? +n.textContent || 1 : 1;
    const vv = varDe(p, card.dataset.v);
    if (n && e.target.closest('[data-menos]')) { n.textContent = Math.max(1, qty - 1); return; }
    if (n && e.target.closest('[data-mas]')) { n.textContent = Math.min(Math.max(vv.stock, 1), qty + 1); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      if (agregarYAvisar(p, vv.v, qty) > 0) {
        add.classList.add('is-ok');
        setTimeout(() => add.classList.remove('is-ok'), 900);
      }
      return;
    }
    if (e.target.closest('[data-comprar]')) {
      agregarYAvisar(p, vv.v, qty);
      Drawer.abrir(e.target.closest('[data-comprar]'));
    }
  });
}

function renderListas() {
  document.querySelectorAll('[data-lista]').forEach(cont => {
    const tipo = cont.dataset.lista;
    let res;
    if (tipo === 'destacados' || tipo === 'mosaico') res = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    else if (tipo === 'complementos') res = Tienda.consultar({ filtros: { cat: ['controladoras', 'fuentes', 'accesorios'], destacado: false }, orden: 'destacados', limite: 8 });
    if (!res) return;
    recordar(res.items);
    if (cont.hasAttribute('data-rail-track')) cont.innerHTML = res.items.map(p => cardHTML(p, { anim: 'der', clase: 'rail-item', compacta: true })).join('');
    else if (tipo === 'mosaico') {
      const total = Tienda.contar({});
      cont.innerHTML = res.items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'card--grande' : '', compacta: true })).join('')
        + `<a class="mosaico-todo" href="${CATALOGO_URL}" data-animate="subir" style="opacity:0;transform:translateY(48px)"><span class="luz" aria-hidden="true"></span><span class="mosaico-todo__n">${total}</span><span class="mosaico-todo__txt">productos en el catálogo. Ver todos ${ICO_FLECHA}</span></a>`;
    }
    else cont.innerHTML = res.items.map(p => cardHTML(p, { compacta: true })).join('');
  });
  document.querySelectorAll('[data-precio-desde]').forEach(el => {
    const p = getProducto(el.dataset.precioDesde);
    if (p) el.textContent = `desde ${formatearPrecio(desdeDe(p))}`;
  });
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: [el.dataset.cuentaCat] });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function renderDropdowns() {
  const params = new URLSearchParams(location.search);
  const activa = PAGINA === 'catalogo' ? params.get('cat') : null;
  document.querySelectorAll('[data-drop-lista]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: [c.id] });
      return `<li><a class="nav-drop__item" href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><span class="nav-drop__n">${n}</span></a></li>`;
    }).join('');
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-link')?.focus();
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

function initNavDrop() {
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
  document.querySelectorAll('[data-nav-drop]').forEach(drop => {
    const btn = drop.querySelector('.nav-drop__btn');
    if (!btn) return;
    let t = 0;
    const abrir = () => { clearTimeout(t); drop.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (drop.classList.contains('is-open') ? cerrar() : abrir()));
    drop.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    drop.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    drop.addEventListener('focusout', e => { if (hoverMq.matches && !drop.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !drop.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drop.classList.contains('is-open')) { cerrar(); btn.focus(); }
    });
  });
}

function initBuscador() {
  document.querySelectorAll('[data-buscador]').forEach(form => {
    form.setAttribute('action', CATALOGO_URL);
    form.addEventListener('submit', e => {
      const input = form.querySelector('input[name="q"]');
      const q = input?.value.trim() || '';
      if (PAGINA === 'catalogo' && Catalogo.buscar) {
        e.preventDefault();
        Catalogo.buscar(q);
        input?.blur();
        return;
      }
      e.preventDefault();
      location.href = q ? `${CATALOGO_URL}?q=${encodeURIComponent(q)}` : CATALOGO_URL;
    });
  });
}

function bloquearFoco(cont) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const handler = e => {
    if (e.key !== 'Tab') return;
    const f = [...cont.querySelectorAll(sel)].filter(el => el.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  cont.addEventListener('keydown', handler);
  return () => cont.removeEventListener('keydown', handler);
}

function mostrar(el, extra) {
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); extra?.classList.add('open'); }));
}
function ocultar(el, extra, ms = 360) {
  el.classList.remove('open'); extra?.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) { el.hidden = true; if (extra) extra.hidden = true; } }, ms);
}

const Drawer = {
  el: null, bd: null, volver: null, soltar: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('.drawer-backdrop');
    if (!this.el) return;
    document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => this.abrir(b)));
    document.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.abierto()) this.cerrar(); });
    this.el.addEventListener('click', e => {
      const linea = e.target.closest('[data-linea]');
      if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
      if (!linea) return;
      const { id, v } = linea.dataset;
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (!it) return;
      if (e.target.closest('[data-l-menos]')) { if (it.qty <= 1) Cart.remove(id, v); else Cart.setQty(id, v, it.qty - 1); }
      else if (e.target.closest('[data-l-mas]')) Cart.setQty(id, v, it.qty + 1);
      else if (e.target.closest('[data-l-quitar]')) Cart.remove(id, v);
    });
    document.addEventListener('cart:updated', () => this.render());
    this.render();
  },
  abierto() { return this.el && !this.el.hidden; },
  render() {
    if (!this.el) return;
    const lista = this.el.querySelector('[data-drawer-lista]');
    const pie = this.el.querySelector('[data-drawer-pie]');
    const lineas = Cart.lineas();
    if (!lineas.length) {
      lista.innerHTML = `<div class="drawer__vacio"><span class="luz" aria-hidden="true"></span><p class="drawer__vacio-tit">Tu carrito está apagado</p><p>Sumá una tira, una fuente o lo que necesites y lo vas a ver acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo</a></div>`;
      pie.innerHTML = '';
      return;
    }
    lista.innerHTML = `<ul class="drawer__lineas">${lineas.map(l => `<li class="linea" data-linea data-id="${l.id}" data-v="${l.v}">
      <img src="${l.p.img}" alt="" width="72" height="72">
      <div class="linea__info"><p class="linea__nombre">${esc(l.p.corto)}</p>${l.p.variantes.length > 1 ? `<p class="linea__var">${esc(l.vv.nombre)}</p>` : ''}<p class="linea__precio">${formatearPrecio(l.unit)}${sufijo(l.p)}</p>
      <div class="linea__acciones"><div class="stepper stepper--chico" role="group" aria-label="Cantidad"><button type="button" data-l-menos aria-label="Uno menos">−</button><span class="stepper__n">${l.qty}</span><button type="button" data-l-mas aria-label="Uno más"${l.qty >= l.vv.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-l-quitar aria-label="Quitar ${esc(l.p.corto)}">${ICO_TACHO}</button></div></div>
      <p class="linea__sub">${formatearPrecio(l.unit * l.qty)}</p></li>`).join('')}</ul>`;
    const total = Cart.total();
    const msg = `Hola Distrileds! Quiero hacer este pedido:\n${lineas.map(l => `• ${l.qty} × ${l.p.corto}${l.p.variantes.length > 1 ? ` (${l.vv.nombre})` : ''} — ${formatearPrecio(l.unit * l.qty)}`).join('\n')}\nTotal: ${formatearPrecio(total)}`;
    pie.innerHTML = `<div class="drawer__total"><span>Total</span><strong>${formatearPrecio(total)}</strong></div>
      <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
      <a class="btn btn--ghost btn--block" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO_WSP}Enviar el pedido por WhatsApp</a>`;
  },
  abrir(disparador) {
    if (!this.el) return;
    if (QV.abierto()) QV.cerrar(false);
    this.volver = disparador || document.activeElement;
    this.render();
    mostrar(this.el, this.bd);
    this.bd.hidden = false;
    document.body.classList.add('no-scroll');
    this.soltar = bloquearFoco(this.el);
    setTimeout(() => this.el.querySelector('.drawer__head .icon-btn')?.focus(), 60);
  },
  cerrar() {
    if (!this.abierto()) return;
    ocultar(this.el, this.bd);
    document.body.classList.remove('no-scroll');
    this.soltar?.();
    this.volver?.focus?.();
  },
};

function fuenteRecomendada(tension, vatiosNecesarios) {
  const fuentes = Tienda.consultar({ filtros: { cat: ['fuentes'] }, limite: 100 }).items;
  recordar(fuentes);
  const opciones = fuentes.filter(f => f.tension === tension)
    .flatMap(f => f.variantes.filter(x => x.stock > 0).map(x => ({ p: f, vv: x })))
    .sort((a, b) => a.vv.w - b.vv.w || precioVar(a.p, a.vv) - precioVar(b.p, b.vv));
  if (!opciones.length) return null;
  const justa = opciones.find(o => o.vv.w >= vatiosNecesarios - 0.01);
  if (justa) return { ...justa, cantidad: 1 };
  const mayor = opciones[opciones.length - 1];
  return { ...mayor, cantidad: Math.ceil(vatiosNecesarios / mayor.vv.w) };
}

const QV = {
  el: null, cont: null, volver: null, soltar: null, actual: null, v: null, qty: 1,
  init() {
    this.el = document.getElementById('qv');
    if (!this.el) return;
    this.cont = this.el.querySelector('[data-qv-contenido]');
    this.el.querySelectorAll('[data-qv-cerrar]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.abierto()) this.cerrar(); });
    this.cont.addEventListener('click', e => {
      const p = this.actual;
      if (!p) return;
      const opt = e.target.closest('[data-qv-var]');
      if (opt) { this.v = opt.dataset.qvVar; this.qty = 1; this.render(); return; }
      const vv = varDe(p, this.v);
      if (e.target.closest('[data-qv-menos]')) { this.qty = Math.max(1, this.qty - 1); this.render(); return; }
      if (e.target.closest('[data-qv-mas]')) { this.qty = Math.min(Math.max(vv.stock, 1), this.qty + 1); this.render(); return; }
      if (e.target.closest('[data-qv-add]')) { agregarYAvisar(p, vv.v, this.qty); return; }
      if (e.target.closest('[data-qv-comprar]')) { agregarYAvisar(p, vv.v, this.qty); Drawer.abrir(this.volver); return; }
      const rel = e.target.closest('[data-qv-rel]');
      if (rel) { this.v = null; this.qty = 1; this.mostrarProducto(rel.dataset.qvRel); this.cont.scrollTop = 0; }
    });
  },
  abierto() { return this.el && !this.el.hidden; },
  abrir(id, { v = null, disparador = null } = {}) {
    if (!this.el) return;
    if (!this.mostrarProducto(id, v)) return;
    this.volver = disparador || document.activeElement;
    mostrar(this.el);
    document.body.classList.add('no-scroll');
    this.soltar = bloquearFoco(this.el);
    setTimeout(() => this.el.querySelector('.qv__cerrar')?.focus(), 60);
  },
  mostrarProducto(id, v = null) {
    const p = getProducto(id);
    if (!p) return false;
    this.actual = p;
    this.v = v && p.variantes.some(x => x.v === v) ? v : primeraConStock(p).v;
    this.qty = 1;
    this.render();
    this.jsonld(p);
    return true;
  },
  render() {
    const p = this.actual;
    const vv = varDe(p, this.v);
    const cat = catDe(p.cat);
    const multi = p.variantes.length > 1;
    const rel = Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, limite: 3 }).items;
    recordar(rel);
    const metros = p.wm && p.tension && p.tension <= 24 ? (p.metros || 5) : 0;
    const fuente = metros ? fuenteRecomendada(p.tension, p.wm * metros * 1.2) : null;
    const msg = `Hola Distrileds! Quiero consultar por ${p.nombre}${multi ? ` (${vv.nombre})` : ''}.`;
    this.cont.innerHTML = `<div class="qv__grid">
      <div class="qv__media">
        <div class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800">${p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''}</div>
        <div class="rotulo rotulo--qv"><span class="rotulo__marca">Distrileds</span><span class="rotulo__nombre">${esc(p.corto)}</span><span class="rotulo__datos">${esc(p.etiqueta).split(' · ').map(x => `<span>${x}</span>`).join('')}</span></div>
      </div>
      <div class="qv__info">
        <p class="qv__cat"><a href="${CATALOGO_URL}?cat=${p.cat}">${esc(cat?.nombre)}</a></p>
        <p class="qv__nombre">${esc(p.nombre)}</p>
        <p class="qv__precio">${precioHTML(p, vv)}</p>
        ${multi ? `<div class="qv__vars"><p class="qv__label">${esc(p.varTitulo || 'Opción')}: <strong>${esc(vv.nombre)}</strong></p><div class="qv__opciones" role="group" aria-label="${esc(p.varTitulo || 'Opción')}">${p.variantes.map(x => `<button type="button" class="opcion${x.v === vv.v ? ' is-on' : ''}${x.stock <= 0 ? ' is-agotado' : ''}" data-qv-var="${x.v}" aria-pressed="${x.v === vv.v}">${esc(x.nombre)}</button>`).join('')}</div></div>` : ''}
        <p class="qv__stock${vv.stock <= 0 ? ' is-sin' : vv.stock <= 5 ? ' is-poco' : ''}">${stockTexto(vv)}</p>
        <div class="qv__compra">
          <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-menos aria-label="Uno menos">−</button><span class="stepper__n">${this.qty}</span><button type="button" data-qv-mas aria-label="Uno más">+</button></div>
          <button type="button" class="btn btn--cta" data-qv-add${vv.stock <= 0 ? ' disabled' : ''}>${ICO_CARRITO}<span>Agregar al carrito</span></button>
          <button type="button" class="btn btn--ghost" data-qv-comprar${vv.stock <= 0 ? ' disabled' : ''}>Comprar ahora</button>
        </div>
        <p class="qv__desc">${esc(p.desc)}</p>
        ${fuente ? `<p class="qv__fuente"><span class="luz" aria-hidden="true"></span>Para ${p.unidad === 'metro' ? `${metros} m` : 'un rollo de 5 m'}: fuente de ${p.tension} V y ${formatearNum(fuente.vv.amp)} A o más (${esc(fuente.p.corto)} ${esc(fuente.vv.nombre)}).</p>` : ''}
        <dl class="qv__ficha">${p.specs.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO_WSP}Consultar este producto por WhatsApp</a>
        ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="64" height="64"><span>${esc(r.corto)}</span><span class="qv__rel-precio">desde ${formatearPrecio(desdeDe(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  },
  jsonld(p) {
    document.getElementById('jsonld-producto')?.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'jsonld-producto';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
      brand: { '@type': 'Brand', name: 'Distrileds' },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desdeDe(p), highPrice: Math.max(...p.variantes.map(x => precioVar(p, x))), offerCount: p.variantes.length, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
    document.head.appendChild(s);
  },
  cerrar(devolver = true) {
    if (!this.abierto()) return;
    ocultar(this.el, null, 320);
    if (!Drawer.abierto()) document.body.classList.remove('no-scroll');
    this.soltar?.();
    document.getElementById('jsonld-producto')?.remove();
    if (PAGINA === 'catalogo') Catalogo.quitarProductoURL?.();
    if (devolver) this.volver?.focus?.();
  },
};

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
  cart?.addEventListener('click', () => Drawer.abrir(cart));
  sync();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initRailDrag(vp) {
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, suprimir = false;
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
      try { vp.setPointerCapture?.(pointerId); } catch (e) { void e; }
    }
    if (moved) { e.preventDefault(); vp.scrollLeft = startLeft - dx; }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (e) { void e; }
    if (moved) {
      suprimir = true;
      setTimeout(() => { suprimir = false; }, 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (suprimir) { e.preventDefault(); e.stopPropagation(); suprimir = false; } }, true);
}

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('[data-rail-vp]');
    const track = rail.querySelector('[data-rail-track]');
    if (!vp || !track) return;
    initRailDrag(vp);
    const sec = rail.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const paso = () => {
      const card = track.querySelector('.rail-item');
      return card ? card.getBoundingClientRect().width + parseFloat(window.getComputedStyle(track).columnGap || 16) : vp.clientWidth * 0.8;
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initEscena() {
  const sec = document.querySelector('.dn');
  if (!sec) return;
  const escena = sec.querySelector('.dn-escena');
  const dato = sec.querySelector('[data-dn-dato]');
  const linea = sec.querySelector('.dn-linea');
  const fotoA = sec.querySelector('.dn-a .dn-foto img');
  const fotoB = sec.querySelector('.dn-b .dn-foto img');
  const copyA = sec.querySelector('.dn-a .dn-copy');
  const copyB = sec.querySelector('.dn-b .dn-copy');
  const ctaA = sec.querySelector('.dn-a .btn');
  const ctaB = sec.querySelector('.dn-b .btn');
  if (reduceMotion) { sec.classList.add('is-estatica'); return; }
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const tramo = (p, a, b) => clamp01((p - a) / (b - a));
  const suave = t => t * t * (3 - 2 * t);
  const mezcla = (a, b, t) => a + (b - a) * t;
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const tope = parseFloat(window.getComputedStyle(escena).top) || 0;
    const total = r.height - (window.innerHeight - tope);
    return total > 0 ? clamp01((tope - r.top) / total) : 0;
  };
  let ultimo = '';
  const pintar = p => {
    const w = mezcla(108, -8, suave(tramo(p, 0.06, 0.8)));
    escena.style.setProperty('--w', w.toFixed(2));
    const txt = w > 50 ? '3000 K' : 'RGB';
    if (txt !== ultimo && dato) { dato.textContent = txt; ultimo = txt; }
    if (linea) linea.style.opacity = w > 104 || w < -4 ? '0' : '1';
    if (fotoA) fotoA.style.transform = `scale(${mezcla(1.04, 1.12, p).toFixed(4)})`;
    if (fotoB) fotoB.style.transform = `scale(${mezcla(1.16, 1.04, suave(tramo(p, 0.2, 0.95))).toFixed(4)})`;
    const aActivo = w > 50;
    if (copyA) copyA.style.pointerEvents = aActivo ? '' : 'none';
    if (copyB) copyB.style.pointerEvents = aActivo ? 'none' : '';
    if (ctaA) ctaA.tabIndex = aActivo ? 0 : -1;
    if (ctaB) ctaB.tabIndex = aActivo ? -1 : 0;
  };
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; pintar(progreso()); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pedir);
  pintar(progreso());
}

function initCalc() {
  const form = document.querySelector('[data-calc]');
  const out = document.querySelector('[data-calc-resultado]');
  if (!form || !out) return;
  const contOpciones = form.querySelector('[data-calc-opciones]');
  const input = form.querySelector('#calc-m');
  const luces = Tienda.consultar({ filtros: { cat: ['tiras', 'neon', 'pixel'], conConsumo: true, tension: [5, 12, 24] }, orden: 'destacados', limite: 100 }).items;
  recordar(luces);
  if (!luces.length) return;
  contOpciones.innerHTML = luces.map((p, i) => `<label class="calc-op"><input type="radio" name="calc-tira" value="${p.id}"${i === 0 ? ' checked' : ''}><span class="calc-op__caja"><span class="calc-op__luz" data-luz="${primeraConStock(p).luz || 'calida'}" aria-hidden="true"></span><span class="calc-op__txt"><span class="calc-op__nombre">${esc(p.corto)}</span><span class="calc-op__dato">${p.tension} V · ${formatearNum(p.wm)} W/m</span></span></span></label>`).join('');
  const metros = () => Math.min(60, Math.max(1, parseInt(input.value, 10) || 1));
  let ultimo = null;
  const calcular = () => {
    const id = form.querySelector('input[name="calc-tira"]:checked')?.value;
    const p = getProducto(id);
    if (!p) return;
    const m = metros();
    const consumo = p.wm * m;
    const conMargen = consumo * 1.2;
    const amperes = conMargen / p.tension;
    const f = fuenteRecomendada(p.tension, conMargen);
    const vt = primeraConStock(p);
    const unidades = p.unidad === 'rollo' ? Math.ceil(m / (p.metros || 5)) : m;
    const unidadTxt = p.unidad === 'rollo' ? `${unidades} ${unidades === 1 ? 'rollo' : 'rollos'} de 5 m` : `${unidades} m`;
    let tip;
    if (p.tension === 12 && m > 5) tip = 'Con más de 5 m a 12 V, alimentá la tira por los dos extremos (o cada 5 m) para que no pierda brillo al final.';
    else if (p.tension === 5 && m > 2) tip = 'En 5 V la caída de tensión se nota rápido: llevá alimentación cada 2 o 3 m.';
    else if (p.tension === 24 && m > 10) tip = 'A 24 V aguanta más, pero pasados los 10 m conviene alimentar también la otra punta.';
    else tip = 'Dejamos un 20 % de margen para que la fuente trabaje fresca y dure más.';
    ultimo = { p, vt, f, unidades, m };
    const fuenteHTML = f ? `<div class="calc-res__prod">
        <img src="${f.p.img}" alt="" width="72" height="72">
        <div><p class="calc-res__prod-tit">${f.cantidad > 1 ? `${f.cantidad} × ` : ''}${esc(f.p.corto)}</p><p class="calc-res__prod-var">${esc(f.vv.nombre)} · ${formatearPrecio(precioVar(f.p, f.vv) * f.cantidad)}</p></div>
        <button type="button" class="btn btn--cta" data-calc-fuente>${ICO_CARRITO}<span>Agregar la fuente</span></button>
      </div>${f.cantidad > 1 ? `<p class="calc-res__nota">No hay una sola fuente de ${p.tension} V que alcance: dividí la instalación en ${f.cantidad} tramos, cada uno con su fuente.</p>` : ''}` : `<p class="calc-res__nota">No tenemos una fuente de ${p.tension} V cargada para esa potencia: consultanos y te la conseguimos.</p>`;
    const msg = `Hola Distrileds! Calculé la fuente para ${m} m de ${p.corto}: ${formatearNum(conMargen, 0)} W con margen, ${formatearNum(amperes)} A a ${p.tension} V.${f ? ` Me sugiere ${f.cantidad > 1 ? f.cantidad + ' × ' : ''}${f.p.corto} ${f.vv.nombre}.` : ''} ¿Me confirman?`;
    out.innerHTML = `<p class="calc-res__eyebrow">Para ${m} m de ${esc(p.corto)}</p>
      <div class="calc-res__cifras">
        <div><span class="calc-res__num">${formatearNum(consumo, 0)} W</span><span class="calc-res__lbl">consumo</span></div>
        <div><span class="calc-res__num">${formatearNum(conMargen, 0)} W</span><span class="calc-res__lbl">con 20 % de margen</span></div>
        <div><span class="calc-res__num">${formatearNum(amperes)} A</span><span class="calc-res__lbl">a ${p.tension} V</span></div>
      </div>
      <p class="calc-res__sub">Fuente recomendada</p>
      ${fuenteHTML}
      <p class="calc-res__tip"><span class="luz" aria-hidden="true"></span>${tip}</p>
      <div class="calc-res__acciones">
        <button type="button" class="btn btn--ghost" data-calc-tira${vt.stock <= 0 ? ' disabled' : ''}>Sumar la tira: ${unidadTxt}</button>
        <a class="calc-res__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO_WSP}Consultar por WhatsApp</a>
      </div>`;
  };
  form.addEventListener('change', calcular);
  input.addEventListener('input', calcular);
  input.addEventListener('blur', () => { input.value = metros(); calcular(); });
  form.addEventListener('submit', e => e.preventDefault());
  form.querySelector('[data-calc-menos]')?.addEventListener('click', () => { input.value = Math.max(1, metros() - 1); calcular(); });
  form.querySelector('[data-calc-mas]')?.addEventListener('click', () => { input.value = Math.min(60, metros() + 1); calcular(); });
  form.querySelectorAll('[data-calc-rapido]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.calcRapido; calcular(); }));
  out.addEventListener('click', e => {
    if (!ultimo) return;
    if (e.target.closest('[data-calc-fuente]') && ultimo.f) agregarYAvisar(ultimo.f.p, ultimo.f.vv.v, ultimo.f.cantidad);
    if (e.target.closest('[data-calc-tira]')) agregarYAvisar(ultimo.p, ultimo.vt.v, ultimo.unidades);
  });
  calcular();
}

const Catalogo = {};

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const qInput = document.querySelector('[data-cat-q]');
  const ordenSel = document.querySelector('[data-cat-orden]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const verMas = document.querySelector('[data-cat-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-cat-miga]');
  const chips = document.querySelector('[data-cat-chips]');
  const activos = document.querySelector('[data-cat-activos]');
  const headerQs = document.querySelectorAll('.site-header input[name="q"]');
  const BAJADAS = {
    '': 'Tiras, neón, píxel, controladoras, fuentes y accesorios, con la ficha técnica de cada uno.',
    tiras: 'Blancas y RGB, a 12 o 24 V, en rollos de 5 m.',
    neon: 'Neón flex a 12 V por metro o a 220 V con ficha.',
    pixel: 'Tiras direccionables para efectos y animaciones.',
    controladoras: 'Para manejar tus tiras RGB con control remoto o desde el celular.',
    fuentes: 'De 5, 12 y 24 V: elegí la potencia con la calculadora.',
    accesorios: 'Perfiles, conectores y cables para terminar la instalación.',
  };
  const estado = { cat: [], luz: [], tension: [], uso: [], stock: false, ofertas: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const valida = (lista, permitidos) => lista.filter((v, i) => permitidos.includes(v) && lista.indexOf(v) === i);
  const desdeURL = () => {
    const sp = new URLSearchParams(location.search);
    const partir = k => (sp.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
    estado.cat = valida(partir('cat'), CATEGORIAS.map(c => c.id));
    estado.luz = valida(partir('luz'), Object.keys(LUCES));
    estado.tension = valida(partir('tension'), TENSIONES.map(String));
    estado.uso = valida(partir('uso'), Object.keys(USOS));
    estado.stock = sp.get('stock') === '1';
    estado.ofertas = sp.get('ofertas') === '1';
    estado.q = (sp.get('q') || '').slice(0, 60);
    estado.orden = ORDENES[sp.get('orden')] ? sp.get('orden') : 'destacados';
  };
  const escribirURL = () => {
    const sp = new URLSearchParams();
    if (estado.cat.length) sp.set('cat', estado.cat.join(','));
    if (estado.luz.length) sp.set('luz', estado.luz.join(','));
    if (estado.tension.length) sp.set('tension', estado.tension.join(','));
    if (estado.uso.length) sp.set('uso', estado.uso.join(','));
    if (estado.stock) sp.set('stock', '1');
    if (estado.ofertas) sp.set('ofertas', '1');
    if (estado.q) sp.set('q', estado.q);
    if (estado.orden !== 'destacados') sp.set('orden', estado.orden);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod && QV.abierto()) sp.set('producto', prod);
    const qs = sp.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };
  const filtrosDe = () => ({ cat: estado.cat, luz: estado.luz, tension: estado.tension, uso: estado.uso, stock: estado.stock, ofertas: estado.ofertas });

  const grupo = (titulo, f, opciones) => `<fieldset class="filtro"><legend>${titulo}</legend>${opciones.map(([v, label, n]) => `<label class="filtro__op"><input type="checkbox" data-f="${f}" value="${v}"><span class="filtro__caja" aria-hidden="true"></span><span>${esc(label)}</span>${n != null ? `<span class="filtro__n">${n}</span>` : ''}</label>`).join('')}</fieldset>`;
  if (form) {
    form.querySelector('[data-filtros-grupos]').innerHTML = [
      grupo('Categoría', 'cat', CATEGORIAS.map(c => [c.id, c.nombre, Tienda.contar({ cat: [c.id] })])),
      grupo('Tipo de luz', 'luz', Object.entries(LUCES).map(([k, v]) => [k, v])),
      grupo('Tensión', 'tension', TENSIONES.map(t => [String(t), `${t} V`])),
      grupo('Uso', 'uso', Object.entries(USOS).map(([k, v]) => [k, v])),
      `<fieldset class="filtro"><legend>Más filtros</legend><label class="filtro__op"><input type="checkbox" data-f="stock" value="1"><span class="filtro__caja" aria-hidden="true"></span><span>Solo con stock</span></label><label class="filtro__op"><input type="checkbox" data-f="ofertas" value="1"><span class="filtro__caja" aria-hidden="true"></span><span>Con descuento</span></label></fieldset>`,
    ].join('');
  }
  if (chips) {
    chips.innerHTML = `<button type="button" class="chip chip--cat" data-chip-cat="">Todo</button>${CATEGORIAS.map(c => `<button type="button" class="chip chip--cat" data-chip-cat="${c.id}">${esc(c.nombre)}</button>`).join('')}`;
  }
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');

  const sincronizarUI = () => {
    form?.querySelectorAll('input[data-f]').forEach(inp => {
      const f = inp.dataset.f;
      inp.checked = f === 'stock' ? estado.stock : f === 'ofertas' ? estado.ofertas : estado[f].includes(inp.value);
    });
    chips?.querySelectorAll('[data-chip-cat]').forEach(b => {
      const id = b.dataset.chipCat;
      const on = id ? estado.cat.length === 1 && estado.cat[0] === id : !estado.cat.length;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const chipOn = chips?.querySelector('.is-on');
    if (chipOn && chips.scrollWidth > chips.clientWidth) chips.scrollLeft = Math.max(0, chipOn.offsetLeft - chips.offsetLeft - 16);
    if (qInput) qInput.value = estado.q;
    headerQs.forEach(inp => { inp.value = estado.q; });
    if (ordenSel) ordenSel.value = estado.orden;
    const una = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    if (titulo) titulo.textContent = una ? una.nombre : 'Catálogo completo';
    if (bajada) bajada.textContent = BAJADAS[una?.id || ''];
    if (miga) miga.innerHTML = `<li><a href="${HOME_URL}">Inicio</a></li>${una ? `<li><a href="${CATALOGO_URL}">Catálogo</a></li><li aria-current="page">${esc(una.nombre)}</li>` : '<li aria-current="page">Catálogo</li>'}`;
    document.querySelectorAll('[data-drop-lista] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (una && id === una.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (activos) {
      const tags = [
        ...estado.cat.map(v => ['cat', v, catDe(v)?.nombre]), ...estado.luz.map(v => ['luz', v, LUCES[v]]),
        ...estado.tension.map(v => ['tension', v, `${v} V`]), ...estado.uso.map(v => ['uso', v, USOS[v]]),
        ...(estado.stock ? [['stock', '1', 'Con stock']] : []), ...(estado.ofertas ? [['ofertas', '1', 'Con descuento']] : []),
        ...(estado.q ? [['q', estado.q, `«${estado.q}»`]] : []),
      ];
      activos.innerHTML = tags.map(([f, v, l]) => `<button type="button" class="tag-activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)} <span aria-hidden="true">×</span></button>`).join('');
      activos.hidden = !tags.length;
    }
    const n = [estado.cat, estado.luz, estado.tension, estado.uso].reduce((s, l) => s + l.length, 0) + (estado.stock ? 1 : 0) + (estado.ofertas ? 1 : 0);
    document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n ? ` (${n})` : ''; });
  };

  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    recordar(res.items);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) { grid.insertAdjacentHTML('beforeend', html); mostrados += res.items.length; }
    else { grid.innerHTML = html; mostrados = res.items.length; }
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else {
        const total = Tienda.contar(filtrosDe());
        cuenta.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}`;
      }
    }
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = estado.q ? mostrados : Tienda.contar(filtrosDe()); });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  form?.addEventListener('change', e => {
    const inp = e.target.closest('input[data-f]');
    if (!inp) return;
    const f = inp.dataset.f;
    if (f === 'stock' || f === 'ofertas') estado[f] = inp.checked;
    else estado[f] = inp.checked ? [...new Set([...estado[f], inp.value])] : estado[f].filter(v => v !== inp.value);
    aplicar();
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip-cat]');
    if (!b) return;
    estado.cat = b.dataset.chipCat ? [b.dataset.chipCat] : [];
    aplicar();
  });
  activos?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const f = b.dataset.quitar, v = b.dataset.valor;
    if (f === 'stock' || f === 'ofertas') estado[f] = false;
    else if (f === 'q') estado.q = '';
    else estado[f] = estado[f].filter(x => x !== v);
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], luz: [], tension: [], uso: [], stock: false, ofertas: false, q: '' });
    aplicar();
  }));
  ordenSel?.addEventListener('change', () => { estado.orden = ordenSel.value; aplicar(); });
  let tq = 0;
  qInput?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = qInput.value.trim().slice(0, 60); aplicar(); }, 220); });
  qInput?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = qInput.value.trim().slice(0, 60); aplicar(); });
  verMas?.addEventListener('click', () => pintar(true));

  const panel = document.querySelector('[data-filtros-panel]');
  const bdF = document.querySelector('[data-filtros-backdrop]');
  let soltarF = null, volverF = null;
  const abrirF = btn => {
    if (!panel) return;
    volverF = btn;
    panel.classList.add('open'); bdF?.classList.add('open');
    panel.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    soltarF = bloquearFoco(panel);
    setTimeout(() => panel.querySelector('[data-cerrar-filtros]')?.focus(), 60);
  };
  const cerrarF = () => {
    if (!panel?.classList.contains('open')) return;
    panel.classList.remove('open'); bdF?.classList.remove('open');
    if (panelMq && !panelMq.matches) panel.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    soltarF?.();
    volverF?.focus();
  };
  const panelMq = panel ? window.matchMedia(panel.dataset.filtrosPanel || '(min-width: 1024px)') : null;
  const syncPanel = () => {
    if (!panel) return;
    if (panelMq.matches) { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrarF(); }
    else if (!panel.classList.contains('open')) panel.setAttribute('inert', '');
  };
  panelMq?.addEventListener('change', syncPanel);
  syncPanel();
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', () => abrirF(b)));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarF));
  bdF?.addEventListener('click', cerrarF);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel?.classList.contains('open')) cerrarF(); });

  Catalogo.buscar = q => { estado.q = q.slice(0, 60); aplicar(); grid.closest('section')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }); };
  Catalogo.quitarProductoURL = () => {
    const sp = new URLSearchParams(location.search);
    if (!sp.has('producto')) return;
    sp.delete('producto');
    const qs = sp.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  desdeURL();
  sincronizarUI();
  pintar();
  if (new URLSearchParams(location.search).has('q')) setTimeout(() => qInput?.focus({ preventScroll: true }), 300);
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('producto');
  if (!id) return;
  if (getProducto(id)) QV.abrir(id, { disparador: document.querySelector('.brand') });
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-luz', { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-rotulo', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

initModelBarScroll();
Cart.syncStock();
renderListas();
renderDropdowns();
initCalc();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initNavDrop();
initBuscador();
initCards();
initRails();
initEscena();
Drawer.init();
QV.init();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initDeepLink();
initAnio();
