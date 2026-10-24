const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5492281590188';
const FAV_KEY = 'piscione_favoritos';
const POR_PAGINA = 12;
const OFICINA = [-36.7775, -59.8635];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const wa = t => `https://wa.me/${WSP}?text=${encodeURIComponent(t)}`;
const fmt = n => Math.round(n).toLocaleString('es-AR');
const precioTxt = p => (p.moneda === 'USD' ? 'USD ' : '$ ') + fmt(p.precio);
const precioCorto = p => (p.moneda === 'USD' ? 'USD ' : '$ ') + fmt(p.precio / 1000) + ' mil';
const opTxt = p => (p.operacion === 'venta' ? 'Venta' : 'Alquiler');
const fichaUrl = p => location.href.split('#')[0].split('?')[0] + '?propiedad=' + p.slug;

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  bed: svg('<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>'),
  bath: svg('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>'),
  area: svg('<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>'),
  car: svg('<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>'),
  heart: svg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
  pin: svg('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  chevL: svg('<path d="m15 18-6-6 6-6"/>'),
  chevR: svg('<path d="m9 18 6-6-6-6"/>'),
  cal: svg('<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
  amb: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h9M12 3v18"/>')
};
const WSP_SVG = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const BARRIOS = {
  'Centro': { color: '#D8E3F2', geo: [[-36.77328, -59.86493], [-36.77992, -59.8567], [-36.78611, -59.86438], [-36.77948, -59.87261]] },
  'Villa Suiza': { color: '#F3DED3', geo: [[-36.76706, -59.86084], [-36.76884, -59.85856], [-36.76626, -59.85546], [-36.76488, -59.85732], [-36.76472, -59.85704], [-36.76023, -59.86276], [-36.76142, -59.86405], [-36.76176, -59.86466], [-36.76197, -59.86478], [-36.7635, -59.86447], [-36.76383, -59.86453], [-36.76412, -59.86485], [-36.76457, -59.86487], [-36.76457, -59.86433], [-36.76725, -59.86107]] },
  'Plaza Oubiñas': { color: '#DCE8D5', geo: [[-36.7736, -59.86431], [-36.76993, -59.86907], [-36.76964, -59.86879], [-36.76951, -59.86819], [-36.76915, -59.86757], [-36.76799, -59.86696], [-36.76678, -59.8659], [-36.7659, -59.86553], [-36.76519, -59.86496], [-36.76463, -59.86487], [-36.76457, -59.86433], [-36.76725, -59.86107], [-36.76706, -59.86084], [-36.76884, -59.85856]] },
  'San Antonio': { color: '#F4E6C4', geo: [[-36.7747, -59.85444], [-36.77804, -59.85849], [-36.78411, -59.85072], [-36.78016, -59.84603], [-36.77939, -59.84701], [-36.7793, -59.84689], [-36.77473, -59.85277], [-36.77537, -59.85354]] },
  'Monte Viggiano': { color: '#E5DCF0', geo: [[-36.77602, -59.85109], [-36.77473, -59.85277], [-36.77406, -59.85197], [-36.77473, -59.85112], [-36.77266, -59.84852], [-36.77437, -59.84616], [-36.77348, -59.84506], [-36.77624, -59.84142], [-36.78016, -59.84603], [-36.77939, -59.84701], [-36.7793, -59.84689]] },
  'Villa Piazza Norte': { color: '#D3EBE5', geo: [[-36.77624, -59.84142], [-36.7689, -59.83261], [-36.77681, -59.82233], [-36.78937, -59.83727], [-36.79209, -59.84031], [-36.78411, -59.85072]] },
  'Villa Piazza Centro': { color: '#F3D8DE', geo: [[-36.79324, -59.84182], [-36.79209, -59.84031], [-36.78411, -59.85072], [-36.7887, -59.85621], [-36.79013, -59.85432], [-36.79635, -59.84621], [-36.7967, -59.84595]] },
  'Villa Piazza Sur': { color: '#ECE3CF', geo: [[-36.80823, -59.85961], [-36.7967, -59.84595], [-36.79635, -59.84621], [-36.79494, -59.84804], [-36.7887, -59.85621], [-36.80028, -59.86997]] },
  'Del Carmen': { color: '#DDE0F3', geo: [[-36.80028, -59.86997], [-36.79131, -59.85929], [-36.78964, -59.86145], [-36.7899, -59.86175], [-36.78548, -59.86738], [-36.79396, -59.87746], [-36.7972, -59.87318], [-36.79675, -59.87264], [-36.7978, -59.8712], [-36.7986, -59.87216]] },
  'Parque Pinasco': { color: '#E2EDCB', geo: [[-36.79525, -59.88849], [-36.7949, -59.8929], [-36.80307, -59.90261], [-36.80934, -59.8944], [-36.80942, -59.89402], [-36.80926, -59.89382], [-36.80832, -59.89463], [-36.80736, -59.89498], [-36.80672, -59.89505], [-36.80621, -59.89481], [-36.80431, -59.89517], [-36.80369, -59.8947], [-36.80288, -59.89303], [-36.8022, -59.89233], [-36.80132, -59.89206], [-36.80078, -59.89166], [-36.80015, -59.89001], [-36.79845, -59.89213]] }
};
const colorBarrio = b => BARRIOS[b]?.color || '#ECE6DC';

const PROPIEDADES = [
  {
    id: 1, slug: 'duplex-a-estrenar-villa-piazza-norte', titulo: 'Dúplex a estrenar con living al jardín',
    operacion: 'venta', tipo: 'Dúplex', estado: 'A estrenar', precio: 132000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Villa Piazza Norte', direccionAproximada: 'Zona Villa Piazza Norte',
    dormitorios: 3, ambientes: 4, banos: 2, cocheras: 1, superficieTotal: 230, superficieCubierta: 148, antiguedad: 'A estrenar',
    descripcion: [
      'Dúplex de dos plantas con frente de ladrillo y revoque claro, listo para mudarse. En planta baja, living comedor con ventanales de piso a techo que abren al jardín.',
      'Arriba, tres dormitorios: el principal con baño en suite y balcón al frente. Cocina integrada, toilette y lavadero independiente.',
      'Cochera, jardín con césped nuevo y lugar para sumar un quincho.'
    ],
    caracteristicas: ['Baño en suite', 'Balcón', 'Jardín', 'Toilette', 'Lavadero', 'Cochera'],
    etiquetas: ['a estrenar', 'jardin', 'ventanales'],
    coords: [-36.77727, -59.84015],
    fotos: [{ src: 'duplex-piazzanorte-1', alt: 'Frente del dúplex de ladrillo y revoque claro con jardín' }, { src: 'duplex-piazzanorte-2', alt: 'Living comedor con ventanales abiertos al jardín' }],
    destacada: true, nueva: true
  },
  {
    id: 2, slug: 'departamento-2-dormitorios-balcon-centro', titulo: 'Departamento de 2 dormitorios con balcón',
    operacion: 'alquiler', tipo: 'Departamento', estado: 'Muy bueno', precio: 620000, moneda: 'ARS', expensas: 85000,
    ciudad: 'Azul', barrio: 'Centro', direccionAproximada: 'A pocas cuadras de la plaza San Martín',
    dormitorios: 2, ambientes: 3, banos: 1, cocheras: 0, superficieTotal: 74, superficieCubierta: 68, antiguedad: '12 años',
    descripcion: [
      'Departamento luminoso en un cuarto piso, con living comedor al balcón y vista abierta. A pocas cuadras de la plaza y de los comercios del centro.',
      'Dos dormitorios con placard, baño completo y cocina separada con lavadero. Pisos de madera y aberturas de aluminio.',
      'Edificio con ascensor. Se alquila sin muebles.'
    ],
    caracteristicas: ['Balcón', 'Ascensor', 'Placares', 'Pisos de madera', 'Lavadero'],
    etiquetas: ['balcon', 'centro', 'ascensor'],
    coords: [-36.78157, -59.86532],
    fotos: [{ src: 'depto-centro-1', alt: 'Living del departamento con sillón claro y balcón con vista abierta' }],
    destacada: true, nueva: false
  },
  {
    id: 3, slug: 'casa-una-planta-quincho-villa-suiza', titulo: 'Casa en una planta con quincho y jardín',
    operacion: 'venta', tipo: 'Casa', estado: 'Muy bueno', precio: 168000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Villa Suiza', direccionAproximada: 'Zona Villa Suiza',
    dormitorios: 3, ambientes: 5, banos: 2, cocheras: 1, superficieTotal: 450, superficieCubierta: 165, antiguedad: '6 años',
    descripcion: [
      'Casa moderna en una sola planta, con frente arbolado y cochera. Living comedor amplio y cocina con isla abierta al comedor diario.',
      'Tres dormitorios, el principal con vestidor y baño en suite. Galería con salida al patio.',
      'En el fondo, quincho con parrilla y jardín con césped: listo para las reuniones de fin de semana.'
    ],
    caracteristicas: ['Quincho con parrilla', 'Cocina con isla', 'Baño en suite', 'Galería', 'Jardín', 'Cochera'],
    etiquetas: ['quincho', 'parrilla', 'una planta'],
    coords: [-36.76423, -59.86143],
    fotos: [{ src: 'casa-villasuiza-1', alt: 'Frente de casa moderna en una planta con árbol en la vereda', pos: '50% 64%', vertical: true }, { src: 'casa-villasuiza-3', alt: 'Cocina con isla, banquetas de madera y luz natural' }, { src: 'casa-villasuiza-2', alt: 'Patio con césped y quincho con parrilla al fondo' }],
    destacada: false, nueva: false
  },
  {
    id: 4, slug: 'chalet-tejas-jardin-del-carmen', titulo: 'Chalet con techo de tejas y jardín al frente',
    operacion: 'venta', tipo: 'Casa', estado: 'Bueno', precio: 98000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Del Carmen', direccionAproximada: 'Zona barrio Del Carmen',
    dormitorios: 3, ambientes: 4, banos: 1, cocheras: 1, superficieTotal: 360, superficieCubierta: 120, antiguedad: '35 años',
    descripcion: [
      'Chalet clásico de ladrillo con techo de tejas, jardín al frente y galería de entrada, en una cuadra tranquila y arbolada.',
      'Living con hogar a leña, cocina comedor, tres dormitorios y baño completo. Al fondo, patio con lugar para huerta.',
      'Una casa con mucho encanto para poner a tu gusto.'
    ],
    caracteristicas: ['Jardín al frente', 'Galería', 'Hogar a leña', 'Patio', 'Cochera'],
    etiquetas: ['chalet', 'tejas', 'hogar'],
    coords: [-36.79251, -59.86156],
    fotos: [{ src: 'casa-delcarmen-1', alt: 'Chalet blanco con techo de tejas y jardín con camino de entrada' }],
    destacada: false, nueva: false
  },
  {
    id: 5, slug: 'casa-dos-plantas-pileta-parque-pinasco', titulo: 'Casa de dos plantas con pileta y parque',
    operacion: 'venta', tipo: 'Casa', estado: 'Excelente', precio: 295000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Parque Pinasco', direccionAproximada: 'Zona Parque Pinasco',
    dormitorios: 4, ambientes: 6, banos: 3, cocheras: 2, superficieTotal: 900, superficieCubierta: 260, antiguedad: '4 años',
    descripcion: [
      'Casa contemporánea en un lote de 900 m², con parque, pileta y deck de madera. Grandes ventanales conectan el living con el exterior.',
      'Cuatro dormitorios, dos en suite, y un estar en planta alta con balcón. Cocina equipada con desayunador.',
      'Cochera para dos autos y amplio ingreso de vehículos.'
    ],
    caracteristicas: ['Pileta', 'Deck', 'Parque', 'Dos suites', 'Balcón', 'Cochera doble'],
    etiquetas: ['pileta', 'parque', 'suite'],
    coords: [-36.80254, -59.89323],
    fotos: [{ src: 'casa-pinasco-1', alt: 'Casa contemporánea de dos plantas con pileta y césped' }, { src: 'casa-pinasco-2', alt: 'Pileta con deck de madera y galería techada' }, { src: 'casa-pinasco-3', alt: 'Ingreso de vehículos y cochera de la casa' }],
    destacada: false, nueva: false
  },
  {
    id: 6, slug: 'casa-ladrillo-dos-plantas-monte-viggiano', titulo: 'Casa de ladrillo en dos plantas con jardín',
    operacion: 'venta', tipo: 'Casa', estado: 'Muy bueno', precio: 145000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Monte Viggiano', direccionAproximada: 'Zona Monte Viggiano',
    dormitorios: 3, ambientes: 5, banos: 2, cocheras: 1, superficieTotal: 320, superficieCubierta: 165, antiguedad: '20 años',
    descripcion: [
      'Casa de ladrillo visto en dos plantas, con jardín al frente y entrada de vehículos. Abajo, living, comedor, cocina y toilette.',
      'Arriba, tres dormitorios con placard y baño completo. Patio al fondo con parrilla.'
    ],
    caracteristicas: ['Jardín', 'Parrilla', 'Placares', 'Toilette', 'Cochera'],
    etiquetas: ['ladrillo', 'parrilla', 'dos plantas'],
    coords: [-36.77753, -59.84654],
    fotos: [{ src: 'casa-viggiano-1', alt: 'Casa de ladrillo de dos plantas con jardín y camino de entrada' }],
    destacada: false, nueva: false
  },
  {
    id: 7, slug: 'lote-10x40-villa-piazza-sur', titulo: 'Lote de 10 × 40 listo para construir',
    operacion: 'venta', tipo: 'Terreno', estado: 'Nivelado', precio: 32000, moneda: 'USD', expensas: 0,
    ciudad: 'Azul', barrio: 'Villa Piazza Sur', direccionAproximada: 'Zona Villa Piazza Sur',
    dormitorios: 0, ambientes: 0, banos: 0, cocheras: 0, superficieTotal: 400, superficieCubierta: 0, antiguedad: '',
    descripcion: [
      'Lote de 400 m² (10 × 40) en una cuadra de casas bajas, con forma regular y buena orientación.',
      'Terreno nivelado y con césped. Ideal para tu primera casa o para un proyecto de dúplex.'
    ],
    caracteristicas: ['10 × 40 m', 'Forma regular', 'Nivelado', 'Cuadra residencial'],
    etiquetas: ['lote', 'terreno', 'construir'],
    coords: [-36.79465, -59.85569],
    fotos: [{ src: 'lote-piazzasur-1', alt: 'Lote con césped y cielo abierto, rodeado de casas bajas' }],
    destacada: false, nueva: false
  },
  {
    id: 8, slug: 'departamento-2-dormitorios-plaza-centro', titulo: 'Departamento de 2 dormitorios a metros de la plaza',
    operacion: 'venta', tipo: 'Departamento', estado: 'Muy bueno', precio: 89000, moneda: 'USD', expensas: 70000,
    ciudad: 'Azul', barrio: 'Centro', direccionAproximada: 'A metros de la plaza San Martín',
    dormitorios: 2, ambientes: 3, banos: 1, cocheras: 0, superficieTotal: 70, superficieCubierta: 66, antiguedad: '8 años',
    descripcion: [
      'Departamento en edificio moderno, a metros de la plaza. Cocina blanca completa con horno y anafe, abierta al comedor.',
      'Dos dormitorios con placard y baño con ducha y mampara.',
      'Muy buena opción para vivir en el centro o como inversión para alquilar.'
    ],
    caracteristicas: ['Cocina equipada', 'Placares', 'Ascensor', 'Aire acondicionado'],
    etiquetas: ['inversion', 'centro', 'plaza'],
    coords: [-36.77967, -59.86415],
    fotos: [{ src: 'depto-plaza-1', alt: 'Cocina blanca completa con horno y alacenas' }, { src: 'depto-plaza-2', alt: 'Dormitorio con cama de respaldo capitoné y cortinas claras' }, { src: 'depto-plaza-3', alt: 'Baño con ducha de vidrio y revestimiento símil madera' }],
    destacada: false, nueva: false
  },
  {
    id: 9, slug: 'local-vidriera-centro', titulo: 'Local a la calle con vidriera amplia',
    operacion: 'alquiler', tipo: 'Local', estado: 'Muy bueno', precio: 950000, moneda: 'ARS', expensas: 0,
    ciudad: 'Azul', barrio: 'Centro', direccionAproximada: 'Zona comercial del centro',
    dormitorios: 0, ambientes: 1, banos: 1, cocheras: 0, superficieTotal: 90, superficieCubierta: 85, antiguedad: '15 años',
    descripcion: [
      'Local de 85 m² con frente vidriado de piso a techo y acceso directo desde la vereda.',
      'Planta libre con piso cerámico, depósito y baño. Ideal para comercio u oficina.'
    ],
    caracteristicas: ['Vidriera', 'Planta libre', 'Depósito', 'Baño'],
    etiquetas: ['comercio', 'oficina', 'vidriera'],
    coords: [-36.78046, -59.8697],
    fotos: [{ src: 'local-centro-1', alt: 'Local vacío con frente vidriado a la calle y piso cerámico' }],
    destacada: false, nueva: false
  },
  {
    id: 10, slug: 'departamento-1-dormitorio-plaza-oubinas', titulo: 'Departamento de 1 dormitorio con cocina integrada',
    operacion: 'alquiler', tipo: 'Departamento', estado: 'Muy bueno', precio: 450000, moneda: 'ARS', expensas: 40000,
    ciudad: 'Azul', barrio: 'Plaza Oubiñas', direccionAproximada: 'Zona plaza Oubiñas',
    dormitorios: 1, ambientes: 2, banos: 1, cocheras: 0, superficieTotal: 52, superficieCubierta: 50, antiguedad: '5 años',
    descripcion: [
      'Departamento de dos ambientes con pared de ladrillo visto, cocina integrada y comedor diario.',
      'Dormitorio con placard y buena luz natural. Se alquila con muebles de cocina y aire acondicionado.'
    ],
    caracteristicas: ['Cocina integrada', 'Aire acondicionado', 'Placard', 'Ladrillo visto'],
    etiquetas: ['dos ambientes', 'ladrillo'],
    coords: [-36.77027, -59.86312],
    fotos: [{ src: 'depto-oubinas-1', alt: 'Cocina integrada con mesa, sillón naranja y pared de ladrillo' }, { src: 'depto-oubinas-2', alt: 'Dormitorio con respaldo de madera y ventanal' }],
    destacada: false, nueva: false
  },
  {
    id: 11, slug: 'monoambiente-amoblado-san-antonio', titulo: 'Monoambiente amoblado, ideal para estudiantes',
    operacion: 'alquiler', tipo: 'Departamento', estado: 'Muy bueno', precio: 340000, moneda: 'ARS', expensas: 25000,
    ciudad: 'Azul', barrio: 'San Antonio', direccionAproximada: 'Zona barrio San Antonio',
    dormitorios: 0, ambientes: 1, banos: 1, cocheras: 0, superficieTotal: 34, superficieCubierta: 32, antiguedad: '10 años',
    descripcion: [
      'Monoambiente amoblado y luminoso, con kitchenette, escritorio y sofá cama.',
      'Listo para entrar a vivir: ideal para estudiantes o para quien llega a Azul por trabajo.'
    ],
    caracteristicas: ['Amoblado', 'Kitchenette', 'Escritorio', 'Sofá cama'],
    etiquetas: ['monoambiente', 'estudiantes', 'amoblado'],
    coords: [-36.7791, -59.84878],
    fotos: [{ src: 'mono-sanantonio-1', alt: 'Monoambiente blanco con sofá cama, escritorio y kitchenette' }],
    destacada: false, nueva: false
  },
  {
    id: 12, slug: 'departamento-a-estrenar-villa-piazza-centro', titulo: 'Departamento a estrenar de 2 ambientes',
    operacion: 'alquiler', tipo: 'Departamento', estado: 'A estrenar', precio: 480000, moneda: 'ARS', expensas: 45000,
    ciudad: 'Azul', barrio: 'Villa Piazza Centro', direccionAproximada: 'Zona Villa Piazza Centro',
    dormitorios: 1, ambientes: 2, banos: 1, cocheras: 0, superficieTotal: 58, superficieCubierta: 55, antiguedad: 'A estrenar',
    descripcion: [
      'Departamento a estrenar en edificio nuevo, con piso flotante y ventanales con balcón francés.',
      'Cocina integrada al living, dormitorio amplio y baño completo. Calefacción por radiadores.'
    ],
    caracteristicas: ['A estrenar', 'Balcón francés', 'Calefacción por radiadores', 'Piso flotante'],
    etiquetas: ['a estrenar', 'nuevo'],
    coords: [-36.78726, -59.84861],
    fotos: [{ src: 'depto-piazzacentro-1', alt: 'Living con cocina integrada y piso flotante, sin muebles' }, { src: 'depto-piazzacentro-2', alt: 'Ambiente amplio con ventanas y piso flotante claro' }, { src: 'depto-piazzacentro-3', alt: 'Dormitorio vacío con balcón francés' }],
    destacada: false, nueva: true
  }
];
const getProp = id => PROPIEDADES.find(p => p.id === Number(id));
const TIPOS = ['Casa', 'Dúplex', 'Departamento', 'Local', 'Terreno'].filter(t => PROPIEDADES.some(p => p.tipo === t));
const BARRIOS_CON = Object.keys(BARRIOS).filter(b => PROPIEDADES.some(p => p.barrio === b));
const ORDEN_REC = [3, 10, 5, 12, 8, 4, 11, 6, 9, 7, 1, 2];
const PRECIOS = {
  venta: [50000, 100000, 150000, 200000, 300000],
  alquiler: [400000, 500000, 700000, 1000000]
};

const Favs = {
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
      return Array.isArray(a) ? a.filter(id => getProp(id)) : [];
    } catch { return []; }
  },
  has(id) { return this.get().includes(Number(id)); },
  toggle(id) {
    id = Number(id);
    const a = this.get();
    const i = a.indexOf(id);
    if (i >= 0) a.splice(i, 1); else a.push(id);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch { showToast('No pudimos guardar tus favoritas en este navegador.'); }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return i < 0;
  }
};

const estado = { op: '', tipo: '', barrio: '', dorm: 0, precio: 0, q: '', orden: 'rec', favs: false, pagina: 1 };
let yaVistos = 0;
let revealsListos = false;

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

function refrescarST() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function datosHTML(p) {
  const d = [];
  if (p.tipo === 'Terreno') {
    d.push(`${ICON.area}${fmt(p.superficieTotal)} m² totales`);
  } else if (p.tipo === 'Local') {
    d.push(`${ICON.area}${fmt(p.superficieCubierta)} m²`);
    d.push(`${ICON.bath}${p.banos} baño`);
  } else {
    d.push(`${ICON.bed}${p.dormitorios ? p.dormitorios + (p.dormitorios === 1 ? ' dorm.' : ' dorms.') : 'Monoambiente'}`);
    d.push(`${ICON.bath}${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}`);
    d.push(`${ICON.area}${fmt(p.superficieCubierta)} m²`);
    if (p.cocheras) d.push(`${ICON.car}${p.cocheras === 1 ? 'Cochera' : p.cocheras + ' cocheras'}`);
  }
  return d.map(x => `<li>${x}</li>`).join('');
}

function cardHTML(p, opts = {}) {
  const { anim = true, fila = false } = opts;
  const fav = Favs.has(p.id);
  const f = p.fotos[0];
  const animAttr = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  return `<article class="prop-card${fila ? ' prop-row' : ''}" data-id="${p.id}"${animAttr}>
    <div class="prop-media">
      <img src="images/${f.src}-800.webp" alt="${esc(f.alt)}" width="800" height="600" decoding="async"${f.pos ? ` style="object-position:${f.pos}"` : ''}>
      <div class="prop-badges"><span class="badge badge--${p.operacion}">${opTxt(p)}</span>${p.nueva ? '<span class="badge badge--nueva">A estrenar</span>' : ''}</div>
      ${p.fotos.length > 1 ? `<span class="badge badge--fotos">${p.fotos.length} fotos</span>` : ''}
    </div>
    <button class="fav" type="button" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(p.titulo)}">${ICON.heart}</button>
    <div class="prop-body">
      <p class="prop-precio">${precioTxt(p)}${p.operacion === 'alquiler' ? ' <small>por mes</small>' : ''}</p>
      <h3 class="prop-titulo"><a href="?propiedad=${p.slug}" data-abrir="${p.id}"><span class="prop-tipo">${p.tipo} ·</span> ${esc(p.titulo)}</a></h3>
      <p class="prop-barrio"><span class="chip-dot" style="--bc:${colorBarrio(p.barrio)}"></span>${esc(p.barrio)}, Azul</p>
      <ul class="prop-datos">${datosHTML(p)}</ul>
    </div>
  </article>`;
}

function textoDe(p) {
  return norm([p.titulo, p.tipo, p.operacion, opTxt(p), p.ciudad, p.barrio, p.descripcion.join(' '), p.caracteristicas.join(' '), p.etiquetas.join(' '), p.dormitorios ? p.dormitorios + ' dormitorios' : 'monoambiente'].join(' '));
}

function filtrar(ignorar = '') {
  const favs = Favs.get();
  const tokens = norm(estado.q).split(/\s+/).filter(Boolean);
  let l = PROPIEDADES.filter(p =>
    (!estado.op || p.operacion === estado.op) &&
    (!estado.tipo || p.tipo === estado.tipo) &&
    (ignorar === 'barrio' || !estado.barrio || p.barrio === estado.barrio) &&
    (!estado.dorm || p.dormitorios >= estado.dorm) &&
    (!estado.precio || !estado.op || p.precio <= estado.precio) &&
    (!estado.favs || favs.includes(p.id)) &&
    (!tokens.length || tokens.every(t => textoDe(p).includes(t)))
  );
  const porMoneda = (a, b) => (a.moneda === b.moneda ? 0 : a.moneda === 'USD' ? -1 : 1);
  if (estado.orden === 'menor') l.sort((a, b) => porMoneda(a, b) || a.precio - b.precio);
  else if (estado.orden === 'mayor') l.sort((a, b) => porMoneda(a, b) || b.precio - a.precio);
  else if (estado.orden === 'sup') l.sort((a, b) => (b.superficieCubierta || b.superficieTotal) - (a.superficieCubierta || a.superficieTotal));
  else l.sort((a, b) => ORDEN_REC.indexOf(a.id) - ORDEN_REC.indexOf(b.id));
  return l;
}

function filtrosActivos() {
  return [estado.tipo, estado.barrio, estado.dorm, estado.precio && estado.op ? estado.precio : 0, estado.orden !== 'rec' ? 1 : 0].filter(Boolean).length;
}
function hayAlgo() {
  return !!(estado.op || estado.tipo || estado.barrio || estado.dorm || estado.precio || estado.q || estado.favs);
}

const $ = id => document.getElementById(id);

function opcionesPrecio() {
  const sel = $('fPrecio');
  if (!sel) return;
  if (!estado.op) {
    sel.innerHTML = '<option value="0">Elegí Comprar o Alquilar</option>';
    sel.disabled = true;
    estado.precio = 0;
    return;
  }
  const mon = estado.op === 'venta' ? 'USD ' : '$ ';
  sel.disabled = false;
  sel.innerHTML = '<option value="0">Sin límite</option>' + PRECIOS[estado.op].map(v => `<option value="${v}">Hasta ${mon}${fmt(v)}</option>`).join('');
  if (!PRECIOS[estado.op].includes(estado.precio)) estado.precio = 0;
  sel.value = String(estado.precio);
}

function sincronizar() {
  document.querySelectorAll('[data-op-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.opTab === estado.op)));
  const set = (id, v) => { const el = $(id); if (el && el.value !== String(v)) el.value = String(v); };
  set('fTipo', estado.tipo); set('fBarrio', estado.barrio); set('fDorm', estado.dorm); set('fOrden', estado.orden);
  set('bOp', estado.op); set('bTipo', estado.tipo); set('bBarrio', estado.barrio);
  if ($('fTexto') && $('fTexto').value !== estado.q) $('fTexto').value = estado.q;
  opcionesPrecio();
  const sf = $('soloFavs');
  if (sf) sf.setAttribute('aria-pressed', String(estado.favs));
  const n = filtrosActivos();
  const fn = $('filtrosN');
  if (fn) { fn.textContent = n; fn.hidden = !n; }
}

function pintarChips() {
  const cont = $('barriosChips');
  if (!cont) return;
  const base = filtrar('barrio');
  const label = cont.querySelector('.barrios-chips__label')?.outerHTML || '';
  cont.innerHTML = label + `<button class="chip" type="button" data-barrio="" aria-pressed="${!estado.barrio}">Todos <small>${base.length}</small></button>` +
    BARRIOS_CON.map(b => {
      const c = base.filter(p => p.barrio === b).length;
      return `<button class="chip" type="button" data-barrio="${esc(b)}" style="--bc:${colorBarrio(b)}" aria-pressed="${estado.barrio === b}"${!c && estado.barrio !== b ? ' disabled aria-disabled="true"' : ''}>${esc(b)} <small>${c}</small></button>`;
    }).join('');
}

let mapaBarrios = null;
const capasBarrio = {};
const marcadores = {};

function render(opts = {}) {
  const cont = $('grid') || $('lista');
  if (!cont) return;
  const fila = cont.id === 'lista';
  if (!opts.mas) { estado.pagina = 1; yaVistos = 0; }
  const lista = filtrar();
  const visibles = lista.slice(0, estado.pagina * POR_PAGINA);
  cont.innerHTML = visibles.map((p, k) => cardHTML(p, { anim: k >= yaVistos, fila })).join('');
  yaVistos = visibles.length;
  const vacio = $('vacio');
  if (vacio) {
    vacio.hidden = lista.length > 0;
    const t = vacio.querySelector('[data-vacio-txt]');
    if (t) t.textContent = estado.favs && !Favs.get().length
      ? 'Todavía no guardaste propiedades. Tocá el corazón de las que te gusten y las encontrás acá.'
      : 'No encontramos propiedades con esos filtros. Probá con otro barrio o escribinos y te avisamos cuando entre una.';
  }
  const vm = $('verMasWrap');
  if (vm) vm.hidden = lista.length <= visibles.length;
  const rt = $('resultadoTxt');
  if (rt) {
    const donde = estado.barrio ? ` en ${esc(estado.barrio)}` : ' en Azul';
    rt.innerHTML = lista.length
      ? `<strong>${lista.length}</strong> ${lista.length === 1 ? 'propiedad' : 'propiedades'}${donde}${lista.length > visibles.length ? ` · mostrando ${visibles.length}` : ''}`
      : 'Sin resultados';
  }
  document.querySelectorAll('.resultado [data-limpiar]').forEach(b => { b.hidden = !hayAlgo(); });
  pintarChips();
  sincronizar();
  if (mapaBarrios) actualizarMapa(lista);
  revelarNuevos(cont);
  refrescarST();
}

function initCatalogo() {
  const cont = $('grid') || $('lista');
  if (!cont) return;
  const tipoOpts = '<option value="">Todos</option>' + TIPOS.map(t => `<option value="${t}">${t}</option>`).join('');
  const barrioOpts = '<option value="">Todos</option>' + BARRIOS_CON.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  ['fTipo', 'bTipo'].forEach(id => { if ($(id)) $(id).innerHTML = tipoOpts; });
  ['fBarrio', 'bBarrio'].forEach(id => { if ($(id)) $(id).innerHTML = barrioOpts; });

  document.addEventListener('click', e => {
    const tab = e.target.closest('[data-op-tab]');
    if (tab) { estado.op = tab.dataset.opTab; render(); return; }
    const chip = e.target.closest('.chip[data-barrio]');
    if (chip && !chip.disabled) {
      const b = chip.dataset.barrio;
      estado.barrio = estado.barrio === b ? '' : b;
      render();
      if (mapaBarrios) enfocarBarrio(estado.barrio);
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(estado, { op: '', tipo: '', barrio: '', dorm: 0, precio: 0, q: '', orden: 'rec', favs: false });
      render();
      if (mapaBarrios) enfocarBarrio('');
      return;
    }
    const navOp = e.target.closest('a[data-op]');
    if (navOp) {
      estado.op = navOp.dataset.op;
      estado.favs = false;
      render();
    }
  });

  const onSel = (id, key, num) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener('change', () => {
      estado[key] = num ? Number(el.value) || 0 : el.value;
      render();
      if (key === 'barrio' && mapaBarrios) enfocarBarrio(estado.barrio);
    });
  };
  onSel('fTipo', 'tipo'); onSel('fBarrio', 'barrio'); onSel('fDorm', 'dorm', true); onSel('fPrecio', 'precio', true); onSel('fOrden', 'orden');

  const txt = $('fTexto');
  if (txt) {
    let t = 0;
    txt.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = txt.value; render(); }, 220); });
  }
  $('soloFavs')?.addEventListener('click', () => { estado.favs = !estado.favs; render(); });
  $('verMas')?.addEventListener('click', () => { estado.pagina++; render({ mas: true }); });

  const bf = $('btnFiltros');
  const fw = $('filtrosWrap');
  if (bf && fw) {
    bf.addEventListener('click', () => {
      const abierto = fw.classList.toggle('abierto');
      bf.setAttribute('aria-expanded', String(abierto));
      refrescarST();
    });
    $('verResultados')?.addEventListener('click', () => {
      fw.classList.remove('abierto');
      bf.setAttribute('aria-expanded', 'false');
      (document.querySelector('.resultado') || cont).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  const form = $('buscador');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      estado.op = $('bOp')?.value || '';
      estado.tipo = $('bTipo')?.value || '';
      estado.barrio = $('bBarrio')?.value || '';
      estado.favs = false;
      render();
      $('propiedades')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  document.querySelectorAll('[data-tipo-rapido]').forEach(b => b.addEventListener('click', () => {
    estado.tipo = estado.tipo === b.dataset.tipoRapido ? '' : b.dataset.tipoRapido;
    render();
    document.querySelectorAll('[data-tipo-rapido]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.tipoRapido === estado.tipo)));
  }));

  render();
}

function initDestacadas() {
  const ancla = $('mapaCard');
  if (!ancla) return;
  ancla.insertAdjacentHTML('beforebegin', PROPIEDADES.filter(p => p.destacada).slice(0, 2).map(p => cardHTML(p)).join(''));
}

function initFavs() {
  const pintar = () => {
    const n = Favs.get().length;
    const b = $('favBtn');
    if (b) {
      b.classList.toggle('tiene', n > 0);
      const c = $('favN');
      if (c) c.textContent = n;
      b.setAttribute('aria-label', `Ver favoritas (${n})`);
    }
    document.querySelectorAll('[data-fav]').forEach(btn => {
      const on = Favs.has(btn.dataset.fav);
      btn.setAttribute('aria-pressed', String(on));
      const p = getProp(btn.dataset.fav);
      if (p) btn.setAttribute('aria-label', `${on ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${p.titulo}`);
    });
  };
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const add = Favs.toggle(btn.dataset.fav);
    btn.classList.remove('latido'); void btn.offsetWidth; btn.classList.add('latido');
    showToast(add ? 'Guardada en tus favoritas.' : 'La sacamos de tus favoritas.');
    if (estado.favs) render();
  });
  document.addEventListener('favs:updated', pintar);
  $('favBtn')?.addEventListener('click', () => {
    estado.favs = true;
    render();
    const destino = $('propiedades') || $('listado');
    destino?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  pintar();
}

const TILE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATRIB = '&copy; OpenStreetMap';
function nuevoMapa(el, opts = {}) {
  const m = L.map(el, Object.assign({ scrollWheelZoom: false, zoomControl: true, attributionControl: true }, opts));
  L.tileLayer(TILE, { attribution: ATRIB, maxZoom: 19 }).addTo(m);
  return m;
}
const pinOfi = () => L.divIcon({ className: 'pin-ofi', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });

function initMapaOficina() {
  const el = $('mapaOfi');
  if (!el || typeof L === 'undefined') return;
  const m = nuevoMapa(el, { dragging: !L.Browser.mobile, tap: false });
  L.polygon(BARRIOS['Centro'].geo, { color: '#1F5E40', weight: 1, opacity: .5, fillColor: BARRIOS['Centro'].color, fillOpacity: .5, interactive: false }).addTo(m);
  L.marker(OFICINA, { icon: pinOfi(), keyboard: false, interactive: false }).addTo(m);
  m.setView(OFICINA, 14);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { m.invalidateSize(); io.disconnect(); } }) : null;
  io?.observe(el);
  window.addEventListener('load', () => m.invalidateSize());
}

const estiloBarrio = (b, sel) => ({
  color: sel === b ? '#1F5E40' : '#8C7964',
  weight: sel === b ? 2 : 1.2,
  opacity: sel === b ? .95 : .7,
  fillColor: colorBarrio(b),
  fillOpacity: !sel ? .78 : sel === b ? .88 : .25
});

function popHTML(p) {
  return `<button class="pop" type="button" data-abrir="${p.id}"><img src="images/${p.fotos[0].src}-800.webp" alt="${esc(p.fotos[0].alt)}"${p.fotos[0].pos ? ` style="object-position:${p.fotos[0].pos}"` : ''}><span class="pop__body"><span class="pop__precio">${precioTxt(p)}${p.operacion === 'alquiler' ? ' por mes' : ''}</span><span class="pop__titulo">${esc(p.titulo)}</span><span class="pop__ver">Ver ficha</span></span></button>`;
}

function initMapaBarrios() {
  const el = $('mapaBarrios');
  if (!el || typeof L === 'undefined') return;
  mapaBarrios = nuevoMapa(el, { tap: false, zoomControl: false, zoomSnap: 0.5 });
  L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(mapaBarrios);
  const ajustarZoom = () => {
    const z = mapaBarrios.getZoom();
    el.classList.toggle('lejos', z < 14);
  };
  mapaBarrios.on('zoomend', ajustarZoom);
  const todos = [];
  BARRIOS_CON.forEach(b => {
    const capa = L.polygon(BARRIOS[b].geo, estiloBarrio(b, estado.barrio)).addTo(mapaBarrios);
    capa.bindTooltip(b, { permanent: true, direction: 'center', className: 'barrio-label', interactive: false });
    capa.on('click', () => {
      estado.barrio = estado.barrio === b ? '' : b;
      render();
      enfocarBarrio(estado.barrio);
    });
    capa.on('mouseover', () => {
      if (estado.barrio !== b) capa.setStyle({ fillOpacity: estado.barrio ? .45 : .95 });
      const ay = $('mapaAyuda');
      if (ay && !estado.barrio) {
        const n = filtrar('barrio').filter(p => p.barrio === b).length;
        ay.innerHTML = `<strong>${esc(b)}</strong> · ${n} ${n === 1 ? 'propiedad' : 'propiedades'} · tocá para filtrar`;
      }
    });
    capa.on('mouseout', () => {
      capa.setStyle(estiloBarrio(b, estado.barrio));
      if (!estado.barrio) actualizarMapa(filtrar());
    });
    capasBarrio[b] = capa;
    todos.push(...BARRIOS[b].geo);
  });
  L.marker(OFICINA, { icon: pinOfi(), keyboard: false, interactive: false }).addTo(mapaBarrios);
  PROPIEDADES.forEach(p => {
    const mk = L.marker(p.coords, { icon: L.divIcon({ className: 'pin-precio', html: `<span>${precioCorto(p)}</span>`, iconSize: null }), title: p.titulo, riseOnHover: true });
    mk.bindPopup(popHTML(p), { closeButton: false, offset: [0, -34], minWidth: 230, maxWidth: 240, autoPanPadding: [20, 20] });
    mk.on('mouseover', () => document.querySelector(`.prop-row[data-id="${p.id}"]`)?.classList.add('resaltada'));
    mk.on('mouseout', () => document.querySelector(`.prop-row[data-id="${p.id}"]`)?.classList.remove('resaltada'));
    marcadores[p.id] = mk;
  });
  mapaBarrios.__limites = L.latLngBounds(todos);
  mapaBarrios.fitBounds(mapaBarrios.__limites, { padding: [16, 16] });
  ajustarZoom();

  const lista = $('lista');
  lista?.addEventListener('mouseover', e => {
    const row = e.target.closest('.prop-row');
    document.querySelectorAll('.pin-precio.activo').forEach(x => x.classList.remove('activo'));
    if (row) marcadores[row.dataset.id]?.getElement()?.classList.add('activo');
  });
  lista?.addEventListener('mouseleave', () => document.querySelectorAll('.pin-precio.activo').forEach(x => x.classList.remove('activo')));

  const seccion = $('listado');
  document.querySelectorAll('[data-vista-btn]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.vistaBtn;
    seccion?.setAttribute('data-vista', v);
    document.querySelectorAll('[data-vista-btn]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (v === 'mapa') setTimeout(() => { mapaBarrios.invalidateSize(); enfocarBarrio(estado.barrio, true); }, 30);
    refrescarST();
  }));
  $('mapaAyuda')?.addEventListener('click', e => {
    if (e.target.closest('[data-ver-lista]')) document.querySelector('[data-vista-btn="lista"]')?.click();
  });
  window.addEventListener('load', () => { mapaBarrios.invalidateSize(); enfocarBarrio(estado.barrio, true); });
  actualizarMapa(filtrar());
}

function enfocarBarrio(b, sinAnim) {
  if (!mapaBarrios) return;
  const o = { padding: b ? [40, 40] : [16, 16], animate: !sinAnim && !reduceMotion };
  if (b && capasBarrio[b]) mapaBarrios.fitBounds(capasBarrio[b].getBounds(), Object.assign({ maxZoom: 15 }, o));
  else mapaBarrios.fitBounds(mapaBarrios.__limites, o);
}

function actualizarMapa(lista) {
  const ids = new Set(lista.map(p => p.id));
  Object.entries(marcadores).forEach(([id, mk]) => {
    const on = ids.has(Number(id));
    if (on && !mapaBarrios.hasLayer(mk)) mk.addTo(mapaBarrios);
    if (!on && mapaBarrios.hasLayer(mk)) mapaBarrios.removeLayer(mk);
  });
  Object.entries(capasBarrio).forEach(([b, capa]) => capa.setStyle(estiloBarrio(b, estado.barrio)));
  const ay = $('mapaAyuda');
  if (ay) {
    ay.innerHTML = estado.barrio
      ? `<strong>${esc(estado.barrio)}</strong> · ${lista.length} ${lista.length === 1 ? 'propiedad' : 'propiedades'} <button type="button" class="link-flecha" data-ver-lista>Ver en la lista</button>`
      : 'Tocá un barrio para ver sus propiedades';
  }
}

let galeria = { p: null, i: 0 };
let mapaFicha = null;
let ultimoFoco = null;

function fichaHTML(p) {
  const filas = [];
  filas.push(['Operación', opTxt(p)], ['Tipo', p.tipo], ['Barrio', p.barrio]);
  if (p.tipo !== 'Terreno' && p.tipo !== 'Local') filas.push(['Dormitorios', p.dormitorios || 'Monoambiente'], ['Baños', p.banos], ['Ambientes', p.ambientes]);
  if (p.tipo === 'Local') filas.push(['Baños', p.banos], ['Estado', p.estado]);
  if (p.superficieCubierta) filas.push(['Sup. cubierta', fmt(p.superficieCubierta) + ' m²']);
  filas.push(['Sup. total', fmt(p.superficieTotal) + ' m²']);
  if (p.cocheras) filas.push(['Cocheras', p.cocheras]);
  if (p.antiguedad && p.tipo !== 'Local') filas.push(['Antigüedad', p.antiguedad]);
  if (p.expensas) filas.push(['Expensas', '$ ' + fmt(p.expensas)]);
  if (p.tipo === 'Terreno') filas.push(['Estado', p.estado]);
  const similares = PROPIEDADES.filter(x => x.id !== p.id && x.operacion === p.operacion)
    .map(x => ({ x, s: (x.tipo === p.tipo ? 2 : 0) + (x.barrio === p.barrio ? 1 : 0) + (x.destacada ? .5 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.x);
  const consulta = wa(`Hola Piscione Inmobiliaria, quiero consultar por «${p.titulo}» (${opTxt(p).toLowerCase()} en ${p.barrio}, ${precioTxt(p)}). ¿Sigue disponible? Ficha: ${fichaUrl(p)}`);
  const visita = wa(`Hola Piscione Inmobiliaria, quiero agendar una visita para ver «${p.titulo}» en ${p.barrio}. ¿Qué días tienen disponibles?`);
  return `
    <div class="ficha-galeria">
      <div class="galeria-main">
        <img id="galeriaImg" src="images/${p.fotos[0].src}.webp" alt="${esc(p.fotos[0].alt)}"${p.fotos[0].vertical ? ' class="vertical"' : ''}>
        ${p.fotos.length > 1 ? `<button class="galeria-nav galeria-nav--prev" type="button" data-gal="-1" aria-label="Foto anterior">${ICON.chevL}</button><button class="galeria-nav galeria-nav--next" type="button" data-gal="1" aria-label="Foto siguiente">${ICON.chevR}</button>` : ''}
        <span class="galeria-cont" id="galeriaCont" aria-live="polite">1 / ${p.fotos.length}</span>
      </div>
      ${p.fotos.length > 1 ? `<div class="galeria-thumbs">${p.fotos.map((f, i) => `<button type="button" data-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0}"><img src="images/${f.src}-800.webp" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="ficha-cuerpo">
      <div>
        <div class="ficha-top"><span class="badge badge--${p.operacion}">${opTxt(p)}</span>${p.nueva ? '<span class="badge badge--nueva">A estrenar</span>' : ''}<span class="badge">${p.tipo}</span></div>
        <h2 id="fichaTitulo">${esc(p.titulo)}</h2>
        <p class="ficha-ubic">${ICON.pin}${esc(p.direccionAproximada)} · ${esc(p.barrio)}, Azul</p>
        <p class="ficha-precio">${precioTxt(p)}${p.operacion === 'alquiler' ? ' <small>por mes' + (p.expensas ? ` · expensas $ ${fmt(p.expensas)}` : '') + '</small>' : p.expensas ? ` <small>Expensas $ ${fmt(p.expensas)}</small>` : ''}</p>
        <dl class="ficha-tecnica">${filas.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="ficha-desc">${p.descripcion.map(t => `<p>${esc(t)}</p>`).join('')}</div>
        <ul class="ficha-carac">${p.caracteristicas.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      <aside class="ficha-lateral">
        <div class="asesor">
          <div class="asesor__quien"><span class="asesor__ini" aria-hidden="true">P</span><div><strong>Piscione Inmobiliaria</strong><span>Te respondemos por WhatsApp</span></div></div>
          <a class="btn btn--wsp" href="${consulta}" target="_blank" rel="noopener">${WSP_SVG}Consultar por esta propiedad</a>
          <a class="btn btn--ghost" href="${visita}" target="_blank" rel="noopener">${ICON.cal}Agendar una visita</a>
          <button class="btn btn--ghost" type="button" data-fav="${p.id}" aria-pressed="${Favs.has(p.id)}" aria-label="${Favs.has(p.id) ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(p.titulo)}">${ICON.heart}Favorita</button>
        </div>
        <div class="ficha-mapa"><div class="mapa" id="mapaFicha" role="img" aria-label="Mapa con la zona aproximada de la propiedad"></div></div>
        <p class="ficha-mapa-nota">Ubicación aproximada. La dirección exacta se comparte al coordinar la visita.</p>
        <p class="ficha-nota">Propiedad y valores utilizados con fines demostrativos.</p>
      </aside>
    </div>
    ${similares.length ? `<div class="similares"><h3>También te puede interesar</h3><div class="similares-grid">${similares.map(x => `<button class="mini" type="button" data-abrir="${x.id}"><span class="mini__foto"><img src="images/${x.fotos[0].src}-800.webp" alt="${esc(x.fotos[0].alt)}"${x.fotos[0].pos ? ` style="object-position:${x.fotos[0].pos}"` : ''}></span><strong>${precioTxt(x)}${x.operacion === 'alquiler' ? ' por mes' : ''}</strong><span>${esc(x.titulo)} · ${esc(x.barrio)}</span></button>`).join('')}</div></div>` : ''}`;
}

function mostrarFoto(i) {
  const p = galeria.p;
  if (!p) return;
  const n = p.fotos.length;
  galeria.i = (i + n) % n;
  const f = p.fotos[galeria.i];
  const img = $('galeriaImg');
  if (img) { img.src = `images/${f.src}.webp`; img.alt = f.alt; img.classList.toggle('vertical', !!f.vertical); }
  const c = $('galeriaCont');
  if (c) c.textContent = `${galeria.i + 1} / ${n}`;
  document.querySelectorAll('[data-thumb]').forEach(t => t.setAttribute('aria-current', String(Number(t.dataset.thumb) === galeria.i)));
}

function cambiarUrl(slug) {
  if (!window.history?.replaceState) return;
  const u = new URL(location.href);
  if (slug) u.searchParams.set('propiedad', slug); else u.searchParams.delete('propiedad');
  window.history.replaceState(null, '', u);
}

function abrirFicha(id, opener) {
  const p = getProp(id);
  const modal = $('modal');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = opener || document.activeElement;
  if (mapaFicha) { mapaFicha.remove(); mapaFicha = null; }
  $('modalContenido').innerHTML = fichaHTML(p);
  modal.setAttribute('aria-label', `Ficha: ${p.titulo}`);
  galeria = { p, i: 0 };
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
  $('modalPanel').scrollTop = 0;
  cambiarUrl(p.slug);
  $('modalCerrar')?.focus({ preventScroll: true });
  if (typeof L !== 'undefined') {
    setTimeout(() => {
      const el = $('mapaFicha');
      if (!el) return;
      mapaFicha = nuevoMapa(el, { dragging: !L.Browser.mobile, tap: false });
      const b = BARRIOS[p.barrio];
      if (b) L.polygon(b.geo, { color: '#8C7964', weight: 1, opacity: .6, fillColor: b.color, fillOpacity: .5, interactive: false }).addTo(mapaFicha);
      L.circle(p.coords, { radius: 220, color: '#1F5E40', weight: 1.5, fillColor: '#1F5E40', fillOpacity: .16, interactive: false }).addTo(mapaFicha);
      mapaFicha.setView(p.coords, 15);
      setTimeout(() => mapaFicha?.invalidateSize(), 120);
    }, 60);
  }
}

function cerrarFicha() {
  const modal = $('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  cambiarUrl('');
  const fin = () => {
    modal.hidden = true;
    if (mapaFicha) { mapaFicha.remove(); mapaFicha = null; }
    $('modalContenido').innerHTML = '';
  };
  if (reduceMotion) fin(); else setTimeout(fin, 300);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}

function initModal() {
  const modal = $('modal');
  if (!modal) return;
  document.addEventListener('click', e => {
    if (e.target.closest('[data-fav]')) return;
    const a = e.target.closest('[data-abrir]');
    if (a) {
      e.preventDefault();
      mapaBarrios?.closePopup();
      abrirFicha(a.dataset.abrir, a);
      return;
    }
    const card = e.target.closest('.prop-card');
    if (card && !e.target.closest('a, button')) abrirFicha(card.dataset.id, card.querySelector('[data-abrir]'));
  });
  $('modalCerrar')?.addEventListener('click', cerrarFicha);
  modal.addEventListener('click', e => {
    if (e.target === modal) { cerrarFicha(); return; }
    const g = e.target.closest('[data-gal]');
    if (g) mostrarFoto(galeria.i + Number(g.dataset.gal));
    const t = e.target.closest('[data-thumb]');
    if (t) mostrarFoto(Number(t.dataset.thumb));
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { cerrarFicha(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && galeria.p?.fotos.length > 1 && !e.target.closest('input, select, textarea')) {
      mostrarFoto(galeria.i + (e.key === 'ArrowRight' ? 1 : -1));
    }
    if (e.key === 'Tab') {
      const f = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(x => x.getClientRects().length);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const slug = new URLSearchParams(location.search).get('propiedad');
  if (slug) {
    const p = PROPIEDADES.find(x => x.slug === slug);
    if (p) abrirFicha(p.id, null);
  }
}

function initTasacion() {
  const form = $('formTasacion');
  if (!form) return;
  const tel = $('tTel');
  const valido = () => (tel.value.replace(/\D/g, '').length >= 8);
  tel.addEventListener('input', () => { if (valido()) tel.closest('.campo').classList.remove('invalido'); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campo = tel.closest('.campo');
    if (!valido()) {
      campo.classList.add('invalido');
      tel.setAttribute('aria-invalid', 'true');
      tel.focus();
      return;
    }
    campo.classList.remove('invalido');
    tel.removeAttribute('aria-invalid');
    const tipo = $('tTipo').value;
    const barrio = $('tBarrio').value;
    const msg = `Hola Piscione Inmobiliaria, quiero pedir una tasación. Tipo de propiedad: ${tipo}. Barrio: ${barrio}. Mi teléfono: ${tel.value.trim()}.`;
    window.open(wa(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu pedido listo para enviar.');
    form.reset();
  });
}

function initCruce() {
  const el = document.querySelector('.buscador, .m2-barra .toolbar');
  if (!el) return;
  const medir = () => {
    document.documentElement.style.setProperty('--cruce-h', `${Math.round(el.offsetHeight)}px`);
  };
  medir();
  if ('ResizeObserver' in window) new window.ResizeObserver(() => { medir(); refrescarST(); }).observe(el);
  else window.addEventListener('resize', medir, { passive: true });
}

function initHeader() {
  const h = document.querySelector('.site-header');
  if (!h) return;
  const f = () => h.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', f, { passive: true });
  f();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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
  const hero = document.querySelector('.hero, .m2-intro');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.m2-tipo'), { y: 24, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.5)
    .from(hero.querySelectorAll('.buscador, .m2-barra .toolbar'), { y: 22, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.6);
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

function initSchema() {
  const graph = PROPIEDADES.map(p => ({
    '@type': p.tipo === 'Departamento' ? 'Apartment' : p.tipo === 'Terreno' ? 'Place' : p.tipo === 'Local' ? 'Place' : 'House',
    name: p.titulo,
    url: fichaUrl(p),
    address: { '@type': 'PostalAddress', addressLocality: 'Azul', addressRegion: 'Buenos Aires', addressCountry: 'AR' },
    floorSize: { '@type': 'QuantitativeValue', value: p.superficieCubierta || p.superficieTotal, unitCode: 'MTK' },
    offers: { '@type': 'Offer', price: p.precio, priceCurrency: p.moneda, businessFunction: p.operacion === 'venta' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut' }
  }));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

initDestacadas();
initCatalogo();
initCruce();
initFavs();
initReveals();
initNav();
initHeader();
initMapaOficina();
initMapaBarrios();
initModal();
initTasacion();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initSchema();
