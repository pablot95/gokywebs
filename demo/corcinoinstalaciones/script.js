const WA = '5491134991360';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TEMAS = {
  instalaciones: 'Instalaciones',
  protecciones: 'Protecciones',
  iluminacion: 'Iluminación',
  mediciones: 'Mediciones y fallas',
  normativa: 'Normativa'
};
const NIVELES = { inicial: 'Inicial', intermedio: 'Intermedio', avanzado: 'Avanzado' };
const FORMATOS = { curso: 'Curso completo', taller: 'Taller corto', gratis: 'Clase gratis' };
const TIPOS = { video: 'Video', pdf: 'PDF', lectura: 'Lectura', practica: 'Práctica' };

const DOCENTE = {
  nombre: 'Corcino',
  rol: 'Electricista · Corcino Instalaciones',
  bio: 'Hago instalaciones eléctricas en casas y departamentos. En los cursos te muestro lo mismo que hago en obra: cómo se planifica un circuito, cómo se arma un tablero y cómo se deja todo prolijo y seguro.'
};

const CURSOS = [
  {
    id: 'instalacion-completa', n: '01', orden: 1, destacado: true, badge: 'Recorrido completo',
    titulo: 'Instalación eléctrica completa de una vivienda',
    tema: 'instalaciones', nivel: 'intermedio', formato: 'curso', precio: 58000, descuento: 15,
    simbolo: 'unifilar', foto: 'images/cajas-embutir.webp', fotoAlt: 'Cajas de embutir verdes alineadas en una pared recién canaleteada',
    corta: 'Del plano a la puesta en marcha en cinco etapas: caños, cables, tablero y puesta a tierra.',
    completa: 'El recorrido entero de una instalación domiciliaria, en el orden en que se hace en obra. Cada etapa termina con una práctica que mandás desde el campus y vuelve con devolución.',
    resultados: ['Proyectar los circuitos de una vivienda y elegir la sección de cada cable', 'Canalizar, cablear y armar un tablero con térmicas y disyuntor', 'Medir antes de energizar y dejar la instalación documentada'],
    requisitos: ['Haber hecho «Electricidad domiciliaria desde cero» o tener nociones equivalentes'],
    incluye: ['5 prácticas con devolución', 'Planilla de cálculo de circuitos en PDF', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'caño corrugado cajas cableado borneras tablero termica disyuntor jabalina tierra iug tug tue plano',
    faq: [
      ['¿Necesito herramientas especiales?', 'Para las primeras etapas alcanza con las básicas. En la etapa 5 se usa un multímetro; en la clase te muestro cuál conviene.'],
      ['¿Qué pasa si una práctica no sale bien?', 'Te devuelvo qué corregir y la volvés a mandar antes de pasar a la etapa siguiente.']
    ],
    modulos: [
      ['Proyecto y cálculo', [['Leer el plano y ubicar las bocas', 14, 'video', true], ['Circuitos IUG, TUG y TUE: qué va en cada uno', 18, 'video'], ['Cómo se elige la sección del cable', 16, 'video'], ['Planilla de cálculo de circuitos', 0, 'pdf'], ['Práctica 1 · Tu plano con bocas y circuitos', 0, 'practica']]],
      ['Canalización', [['Caños, cajas y curvas: qué va en cada lugar', 17, 'video'], ['Marcar, canaletear y amurar cajas', 22, 'video'], ['Canalización a la vista, prolija', 15, 'video'], ['Práctica 2 · Un tramo de caño con dos cajas', 0, 'practica']]],
      ['Cableado y conexiones', [['Fase, neutro y tierra: colores y funciones', 12, 'video'], ['Pasar cables sin dañar la aislación', 14, 'video'], ['Empalmes y borneras que no fallan', 19, 'video'], ['Práctica 3 · Circuito de un punto y un toma', 0, 'practica']]],
      ['Tablero y protecciones', [['Térmicas: cuál va en cada circuito', 16, 'video'], ['Disyuntor diferencial: conexión y prueba', 18, 'video'], ['Armado y peinado del tablero', 24, 'video'], ['Práctica 4 · Tablero de dos circuitos con diferencial', 0, 'practica']]],
      ['Puesta a tierra y puesta en marcha', [['Jabalina y conductor de protección', 15, 'video'], ['Mediciones antes de energizar', 20, 'video'], ['Puesta en marcha y prueba final', 13, 'video'], ['Práctica 5 · Medición de continuidad y aislación', 0, 'practica']]]
    ]
  },
  {
    id: 'desde-cero', n: '02', orden: 2, destacado: true, badge: 'Para empezar',
    titulo: 'Electricidad domiciliaria desde cero',
    tema: 'instalaciones', nivel: 'inicial', formato: 'curso', precio: 32000, descuento: 0,
    simbolo: 'circuito', foto: 'images/teclas-destornillador.webp', fotoAlt: 'Manos ajustando con destornillador dos módulos de llave en una pared blanca',
    corta: 'Lo que necesitás para entender tu instalación y hacer tus primeros circuitos con seguridad.',
    completa: 'Arranca de cero: qué es cada cosa, cómo llega la electricidad a tu casa y cómo se trabaja sin tensión. Terminás armando un punto de luz, un toma y una llave de combinación.',
    resultados: ['Reconocer cables, cajas, llaves y tomas de una instalación', 'Trabajar sin tensión: cortar, verificar y recién ahí tocar', 'Armar un punto de luz con su llave y un toma con tierra'],
    requisitos: ['Ninguno: arranca desde lo más básico'],
    incluye: ['Lista de compras de herramientas en PDF', '1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'basico principiante tension corriente llave toma buscapolo herramientas ventilador',
    modulos: [
      ['Lo básico, sin fórmulas de más', [['Tensión, corriente y potencia con ejemplos de la casa', 12, 'video', true], ['Del medidor al toma: cómo llega la electricidad', 10, 'video'], ['Cortar, verificar y trabajar sin tensión', 14, 'video']]],
      ['Herramientas y materiales', [['Las herramientas que sí necesitás', 9, 'video'], ['Cables, cajas, llaves y tomas: cómo reconocerlos', 13, 'video'], ['Lista de compras para empezar', 0, 'pdf']]],
      ['Tus primeros circuitos', [['Un punto de luz con su llave', 18, 'video'], ['Un toma con puesta a tierra', 15, 'video'], ['Llave de combinación: prender desde dos lugares', 20, 'video'], ['Práctica · Punto y toma en tablero de prueba', 0, 'practica']]],
      ['Arreglos comunes en casa', [['Cambiar un toma o una llave', 11, 'video'], ['Instalar un ventilador de techo', 16, 'video'], ['Cuándo no tocar y llamar a un electricista', 6, 'lectura']]]
    ]
  },
  {
    id: 'tableros', n: '03', orden: 3, destacado: true, badge: '',
    titulo: 'Tableros: armado, protecciones y peinado',
    tema: 'protecciones', nivel: 'intermedio', formato: 'curso', precio: 36000, descuento: 0,
    simbolo: 'termica', foto: 'images/tablero-en-banco.webp', fotoAlt: 'Tablero con térmicas y bornera armado sobre un banco de trabajo',
    corta: 'Cómo se diseña, se arma en banco y se prueba un tablero que se entiende al abrirlo.',
    completa: 'Qué va adentro de un tablero y por qué, cuántos circuitos lleva una vivienda y cómo se arma prolijo: riel, térmicas, disyuntor, borneras e identificación de cada circuito.',
    resultados: ['Elegir térmicas, disyuntor y protección contra sobretensiones', 'Armar un tablero en banco con los cables peinados', 'Probar el diferencial e identificar cada circuito'],
    requisitos: ['Nociones de circuitos domiciliarios'],
    incluye: ['Esquema unifilar del tablero en PDF', '1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'tablero termica termomagnetica disyuntor diferencial dps riel din bornera peinado precintos',
    modulos: [
      ['Qué hay adentro de un tablero', [['Tablero principal y tablero seccional', 12, 'video', true], ['Térmicas, diferencial y DPS: para qué sirve cada uno', 17, 'video'], ['Curva y capacidad de corte, explicadas', 13, 'video']]],
      ['Diseño del tablero', [['Cuántos circuitos y de qué calibre', 15, 'video'], ['Gabinete y riel DIN', 10, 'video'], ['Esquema unifilar del tablero', 0, 'pdf']]],
      ['Armado en banco', [['Montaje de riel, térmicas y borneras', 22, 'video'], ['Peinado y precintado de cables', 19, 'video'], ['Identificación de circuitos', 8, 'video'], ['Práctica · Tablero de tres circuitos', 0, 'practica']]],
      ['Instalación y prueba', [['Conexión a la línea de alimentación', 14, 'video'], ['Prueba del diferencial', 12, 'video'], ['Errores que se ven en obra', 16, 'video']]]
    ]
  },
  {
    id: 'diferencial', n: '04', orden: 6, destacado: false, badge: '',
    titulo: 'Disyuntor diferencial: por qué salta y cómo elegirlo',
    tema: 'protecciones', nivel: 'inicial', formato: 'taller', precio: 12000, descuento: 0,
    simbolo: 'diferencial', foto: 'images/tablero-en-banco.webp', fotoAlt: 'Tablero con térmicas y bornera armado sobre un banco de trabajo',
    corta: 'Qué protege el diferencial, cómo encontrar lo que lo hace saltar y cuál poner.',
    completa: 'Un taller corto sobre la protección que más consultas genera en una casa: cómo funciona, cómo se busca la fuga circuito por circuito y cómo se elige y se cambia.',
    resultados: ['Entender qué detecta un diferencial', 'Buscar la fuga bajando circuito por circuito', 'Elegir el diferencial para una vivienda'],
    requisitos: ['Ninguno'],
    incluye: ['Checklist de prueba en PDF', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'disyuntor diferencial salta fuga humedad 30 ma bipolar tetrapolar',
    modulos: [
      ['Cómo funciona', [['Qué mide un diferencial y por qué salta', 11, 'video', true], ['Por qué 30 mA', 8, 'video']]],
      ['Cuando salta', [['Buscar la fuga circuito por circuito', 14, 'video'], ['Artefactos que suelen provocarlo', 9, 'video'], ['Humedad en cajas y tomas exteriores', 10, 'video']]],
      ['Elegir y cambiar', [['Bipolar o tetrapolar, 25 o 40 A', 9, 'video'], ['Cambio de un diferencial paso a paso', 13, 'video'], ['Checklist de prueba', 0, 'pdf']]]
    ]
  },
  {
    id: 'puesta-tierra', n: '05', orden: 7, destacado: false, badge: '',
    titulo: 'Puesta a tierra: jabalina, conexión y medición',
    tema: 'protecciones', nivel: 'avanzado', formato: 'curso', precio: 28000, descuento: 0,
    simbolo: 'tierra', foto: 'images/pinza-cable.webp', fotoAlt: 'Mano cortando un cable con una pinza de mango amarillo',
    corta: 'La protección que no se ve: cómo se instala, cómo se mide y qué hacer si no da.',
    completa: 'Para qué sirve la puesta a tierra y cómo trabaja con el diferencial, cómo se instala la jabalina y se lleva el conductor de protección a cada toma, y cómo se mide y se informa.',
    resultados: ['Instalar jabalina, cámara y conductor de protección', 'Medir la resistencia de puesta a tierra', 'Informar la medición al cliente'],
    requisitos: ['Haber hecho «Tableros» o tener experiencia equivalente'],
    incluye: ['Planilla de medición en PDF', '1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'puesta a tierra jabalina telurimetro conductor proteccion verde amarillo medicion',
    modulos: [
      ['Para qué sirve la tierra', [['Protección de personas: tierra y diferencial', 13, 'video', true], ['El conductor verde y amarillo', 9, 'video']]],
      ['Instalación', [['Jabalina, cámara de inspección y conexión', 18, 'video'], ['Del tablero a cada toma', 14, 'video'], ['Errores comunes: tierra al neutro y cañerías', 11, 'video']]],
      ['Medición', [['Medir con telurímetro: método y lectura', 20, 'video'], ['Qué hacer si el valor no da', 12, 'video'], ['Planilla de medición', 0, 'pdf'], ['Práctica · Informe de una medición', 0, 'practica']]]
    ]
  },
  {
    id: 'iluminacion', n: '06', orden: 4, destacado: true, badge: 'Nuevo',
    titulo: 'Iluminación LED: spots, tiras y circuitos con sensor',
    tema: 'iluminacion', nivel: 'intermedio', formato: 'curso', precio: 26000, descuento: 0,
    simbolo: 'lampara', foto: 'images/aro-led.webp', fotoAlt: 'Aro de luz LED encendido sobre un cielorraso blanco',
    corta: 'Elegir la luz de cada ambiente y dejar funcionando spots, tiras LED y sensores.',
    completa: 'Temperatura de color, lúmenes y tipos de luminaria sin vueltas, y los circuitos que más se piden hoy: tiras LED con su fuente, sensores de movimiento, fotocélulas y dimmers.',
    resultados: ['Elegir luminarias y temperatura de color por ambiente', 'Instalar tiras LED con la fuente bien ubicada', 'Armar circuitos con sensor, fotocélula o temporizador'],
    requisitos: ['Nociones de circuitos domiciliarios'],
    incluye: ['1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'iluminacion led spots tira fuente sensor movimiento fotocelula temporizador dimmer colgante',
    modulos: [
      ['Elegir la luz', [['Temperatura de color y lúmenes, sin vueltas', 12, 'video', true], ['Spots, paneles y colgantes: dónde va cada uno', 14, 'video']]],
      ['Tiras LED', [['Fuentes, perfiles y cálculo de la tira', 17, 'video'], ['Conexión y ubicación de la fuente', 13, 'video']]],
      ['Circuitos con sensor', [['Sensor de movimiento en un pasillo', 15, 'video'], ['Fotocélula y temporizador en exteriores', 14, 'video'], ['Dimmer: cuándo sí y cuándo no', 10, 'video']]],
      ['Terminaciones', [['Un colgante bien centrado', 12, 'video'], ['Práctica · Circuito de spots con sensor', 0, 'practica']]]
    ]
  },
  {
    id: 'mediciones', n: '07', orden: 8, destacado: false, badge: '',
    titulo: 'Multímetro y pinza amperométrica, sin miedo',
    tema: 'mediciones', nivel: 'inicial', formato: 'taller', precio: 9500, descuento: 0,
    simbolo: 'voltimetro', foto: 'images/multimetro.webp', fotoAlt: 'Multímetro digital amarillo con sus puntas de prueba rojas',
    corta: 'Medir tensión, continuidad y consumo con seguridad, en situaciones reales de una casa.',
    completa: 'Un taller corto para perderle el miedo al multímetro: qué escala usar, cómo medir tensión en un toma, cómo probar continuidad y cómo usar la pinza para ver qué consume cada artefacto.',
    resultados: ['Elegir la escala correcta antes de medir', 'Probar continuidad en cables, lámparas y llaves', 'Medir el consumo de un artefacto con la pinza'],
    requisitos: ['Ninguno'],
    incluye: ['Seguimiento de tu avance en el campus'],
    etiquetas: 'multimetro tester pinza amperometrica tension continuidad resistencia consumo',
    modulos: [
      ['El multímetro', [['Qué mide y cómo se elige la escala', 10, 'video', true], ['Medir tensión en un toma, con seguridad', 9, 'video']]],
      ['Continuidad y resistencia', [['Probar un cable, una lámpara y una llave', 12, 'video'], ['Encontrar un corte en un circuito', 11, 'video']]],
      ['La pinza amperométrica', [['Medir el consumo de un artefacto', 9, 'video'], ['Detectar un circuito sobrecargado', 10, 'video']]]
    ]
  },
  {
    id: 'fallas', n: '08', orden: 5, destacado: false, badge: '',
    titulo: 'Detección de fallas en la instalación de una casa',
    tema: 'mediciones', nivel: 'avanzado', formato: 'curso', precio: 34000, descuento: 0,
    simbolo: 'falla', foto: 'images/tomas-muro-gris.webp', fotoAlt: 'Manos trabajando con una pinza sobre tomas en una pared gris oscura',
    corta: 'Un método para ir del síntoma a la causa: cortes, térmicas que se bajan, fugas y calentamientos.',
    completa: 'Las fallas que más aparecen en una vivienda, resueltas con método y con el instrumento adecuado: cortocircuitos, sobrecargas, fugas a tierra, empalmes flojos y tomas que calientan.',
    resultados: ['Razonar una falla desde el síntoma', 'Encontrar fugas y medir aislación', 'Detectar empalmes flojos y tomas que calientan'],
    requisitos: ['Haber hecho «Multímetro y pinza» o saber medir'],
    incluye: ['1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'fallas corte cortocircuito sobrecarga termica fuga aislacion megometro calentamiento empalme',
    modulos: [
      ['Método', [['Del síntoma a la causa', 15, 'video', true], ['Herramientas para diagnosticar', 10, 'video']]],
      ['Cortes y térmicas', [['La térmica que se baja: sobrecarga o cortocircuito', 16, 'video'], ['Un ambiente sin luz: seguir el circuito', 18, 'video']]],
      ['Fugas y diferencial', [['Encontrar una fuga a tierra', 17, 'video'], ['Medir aislación con megóhmetro', 15, 'video']]],
      ['Calentamientos', [['Tomas y fichas que calientan', 13, 'video'], ['Empalmes flojos: cómo detectarlos', 12, 'video'], ['Práctica · Informe de diagnóstico', 0, 'practica']]]
    ]
  },
  {
    id: 'normativa', n: '09', orden: 9, destacado: false, badge: '',
    titulo: 'Reglamentación AEA aplicada a una vivienda',
    tema: 'normativa', nivel: 'avanzado', formato: 'curso', precio: 30000, descuento: 0,
    simbolo: 'plano', foto: 'images/canalizacion-exterior.webp', fotoAlt: 'Caños y cajas de una canalización a la vista sobre una pared blanca',
    corta: 'Lo que pide la reglamentación para una vivienda, explicado con ejemplos de obra.',
    completa: 'Cómo leer la reglamentación AEA 90364 pensando en una casa o un departamento: grados de electrificación, cantidad de circuitos y bocas, secciones mínimas, protecciones y documentación.',
    resultados: ['Definir el grado de electrificación de una vivienda', 'Proyectar circuitos y bocas según la reglamentación', 'Dibujar el esquema unifilar y el plano de la instalación'],
    requisitos: ['Experiencia en instalaciones domiciliarias'],
    incluye: ['Planilla de circuitos en PDF', '1 práctica con devolución', 'Seguimiento de tu avance en el campus'],
    etiquetas: 'reglamentacion aea 90364 normativa grado electrificacion circuitos bocas unifilar plano documentacion',
    modulos: [
      ['La reglamentación, explicada', [['Qué es la AEA 90364 y a qué alcanza', 12, 'video', true], ['Grados de electrificación de una vivienda', 14, 'video']]],
      ['Circuitos y bocas', [['Cantidad mínima de circuitos y bocas', 16, 'video'], ['Secciones mínimas y protecciones', 15, 'video']]],
      ['Proyecto y documentación', [['Esquema unifilar y plano de la instalación', 18, 'video'], ['Planilla de circuitos', 0, 'pdf'], ['Práctica · Proyecto de un departamento', 0, 'practica']]]
    ]
  },
  {
    id: 'clase-gratis', n: '10', orden: 10, destacado: false, badge: 'Gratis',
    titulo: 'Clase gratis: cambiar un toma y una llave sin riesgos',
    tema: 'instalaciones', nivel: 'inicial', formato: 'gratis', precio: 0, descuento: 0,
    simbolo: 'toma', foto: 'images/teclas-destornillador.webp', fotoAlt: 'Manos ajustando con destornillador dos módulos de llave en una pared blanca',
    corta: 'Veinticinco minutos para conocer cómo enseño, resolviendo un arreglo de todos los días.',
    completa: 'Una clase corta y completa: cómo cortar la térmica correcta, verificar que no haya tensión, cambiar un toma con su tierra y una llave de un punto, y probar antes de cerrar.',
    resultados: ['Cortar y verificar antes de tocar', 'Conectar fase, neutro y tierra en un toma', 'Cambiar una llave de un punto'],
    requisitos: ['Ninguno'],
    incluye: ['Acceso inmediato al inscribirte'],
    etiquetas: 'gratis gratuita toma llave cambiar buscapolo',
    modulos: [
      ['Antes de tocar', [['Cortar la térmica y verificar con buscapolo', 5, 'video']]],
      ['El toma', [['Desarmar el toma viejo', 5, 'video'], ['Conectar fase, neutro y tierra', 7, 'video']]],
      ['La llave', [['Cambiar una llave de un punto', 6, 'video'], ['Probar y cerrar', 3, 'video']]]
    ]
  }
];

CURSOS.forEach(c => {
  const clases = c.modulos.flatMap(m => m[1]);
  c.cantidadClases = clases.filter(k => k[2] !== 'practica').length;
  c.practicas = clases.filter(k => k[2] === 'practica').length;
  c.minutos = clases.reduce((s, k) => s + (k[1] || 0), 0);
});


document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => CURSOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const duracionTxt = min => {
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

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

const Cart = {
  KEY: 'corcino_cart',
  memoria: null,
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || this.memoria || []; } catch { return this.memoria || []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(producto) {
    const items = this.get();
    if (items.some(i => i.id === producto.id)) return false;
    items.push({ id: producto.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getProducto(i.id)).length; },
  subtotal() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio : s; }, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) : s; }, 0); }
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function syncAddButtons() {
  document.querySelectorAll('[data-add]').forEach(btn => {
    const en = Cart.has(btn.dataset.add);
    btn.classList.toggle('is-added', en);
    btn.setAttribute('aria-pressed', en ? 'true' : 'false');
    const lbl = btn.querySelector('.add-lbl');
    if (lbl) lbl.textContent = en ? 'En el carrito' : (btn.dataset.lbl || 'Agregar');
  });
}

function agregarCurso(id, abrir = false) {
  const p = getProducto(id);
  if (!p) return;
  if (p.precio === 0) {
    showToast('La inscripción a la clase gratis se activa al pasar la web a producción.');
    return;
  }
  const nuevo = Cart.add(p);
  if (abrir) { openCartDrawer(); return; }
  showToast(nuevo ? `Sumaste «${p.titulo}» al carrito.` : 'Ese curso ya está en tu carrito.');
}

document.addEventListener('cart:updated', () => { updateCartBadge(); syncAddButtons(); renderCartDrawer(); });

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { e.preventDefault(); agregarCurso(add.dataset.add, add.hasAttribute('data-buy')); return; }
  const ver = e.target.closest('[data-curso]');
  if (ver) { e.preventDefault(); openCursoModal(ver.dataset.curso, ver); return; }
  const cartBtn = e.target.closest('[data-open-cart]');
  if (cartBtn) { e.preventDefault(); openCartDrawer(cartBtn); }
});

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

function trapFocus(panel, e) {
  if (e.key !== 'Tab') return;
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const Overlay = {
  stack: [],
  open(root, opener, focusEl) {
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add('open'));
    document.body.classList.add('no-scroll');
    this.stack.push({ root, opener: opener || document.activeElement });
    setTimeout(() => (focusEl || root.querySelector('[data-close]'))?.focus(), 30);
  },
  close(root) {
    const i = this.stack.findIndex(s => s.root === root);
    if (i < 0) return;
    const { opener } = this.stack.splice(i, 1)[0];
    root.classList.remove('open');
    setTimeout(() => { root.hidden = true; }, reduceMotion ? 0 : 320);
    if (!this.stack.length) document.body.classList.remove('no-scroll');
    opener?.focus?.();
  },
  top() { return this.stack[this.stack.length - 1]?.root; }
};

document.addEventListener('keydown', e => {
  const root = Overlay.top();
  if (!root) return;
  if (e.key === 'Escape') { e.preventDefault(); Overlay.close(root); return; }
  trapFocus(root, e);
});
document.addEventListener('click', e => {
  const c = e.target.closest('[data-close]');
  if (c) { const root = c.closest('.overlay'); if (root) Overlay.close(root); return; }
  if (e.target.classList?.contains('overlay-backdrop')) { const root = e.target.closest('.overlay'); if (root) Overlay.close(root); }
});

const SIMBOLOS = {
  unifilar: '<circle class="acc-fill" cx="60" cy="8" r="3"/><path d="M60 11v14M46 25h28v14H46zM60 39v11M24 50h72M24 50v14M60 50v14M96 50v14"/><circle cx="24" cy="71" r="7"/><path d="M19 66l10 10M29 66L19 76"/><path d="M52 64h16M53 64a7 7 0 0 0 14 0"/><rect x="90" y="64" width="12" height="12"/>',
  circuito: '<path d="M22 38V18h26M70 18h28v24M98 60v12H22V52"/><path d="M48 18l19-9"/><circle class="acc-fill" cx="48" cy="18" r="2.6"/><circle cx="70" cy="18" r="2.2"/><path d="M12 40h20M16 46h12"/><path d="M22 46v6"/><circle cx="98" cy="51" r="9"/><path d="M91.6 44.6l12.8 12.8M104.4 44.6L91.6 57.4"/>',
  termica: '<path d="M60 6v22M60 60v24"/><path d="M55.5 23.5l9 9M64.5 23.5l-9 9"/><path d="M60 60L46 33"/><circle class="acc-fill" cx="60" cy="60" r="2.8"/><path d="M52 46h22" stroke-dasharray="2.5 3"/><rect x="74" y="38" width="18" height="16"/><path d="M78 46c2-4 3-4 5 0s3 4 5 0"/>',
  diferencial: '<path d="M48 6v78M72 6v78"/><ellipse cx="60" cy="46" rx="21" ry="7"/><path d="M81 46h9"/><rect x="90" y="38" width="16" height="16"/><path d="M98 38V24H60v-6" stroke-dasharray="2.5 3"/><circle class="acc-fill" cx="81" cy="46" r="2.6"/>',
  tierra: '<circle class="acc-fill" cx="60" cy="12" r="3"/><path d="M60 15v33M34 48h52M43 59h34M52 70h16"/>',
  lampara: '<circle cx="60" cy="45" r="15"/><path d="M49.4 34.4l21.2 21.2M70.6 34.4L49.4 55.6"/><path class="acc" d="M60 22v-10M60 68v10M37 45H27M83 45h10M43.7 28.7l-7-7M76.3 28.7l7-7M43.7 61.3l-7 7M76.3 61.3l7 7"/>',
  voltimetro: '<circle cx="60" cy="45" r="19"/><path d="M52 36l8 18 8-18"/><path d="M60 26V8M60 64v18"/><circle class="acc-fill" cx="60" cy="8" r="2.6"/>',
  falla: '<path d="M72 8L48 46h24L50 82"/><path d="M50 82l2-13M50 82l11-7"/><circle class="acc-fill" cx="72" cy="8" r="2.6"/>',
  plano: '<path d="M20 14h80v62H72M58 76H20V14"/><path d="M20 44h30M50 44v-8"/><path class="acc" d="M58 76a14 14 0 0 1 14-14"/><circle cx="78" cy="32" r="6"/><path d="M73.8 27.8l8.4 8.4M82.2 27.8l-8.4 8.4"/><path d="M30 60h12M31 60a5 5 0 0 0 10 0"/>',
  toma: '<path d="M40 38h40"/><path d="M42 38a18 18 0 0 0 36 0"/><path d="M60 56v26"/><path d="M60 38V20M50 20h20"/><circle class="acc-fill" cx="60" cy="82" r="2.6"/>'
};

function coverHTML(c) {
  const l = Object.keys(NIVELES).indexOf(c.nivel) + 1;
  const bars = [1, 2, 3].map(i => `<b${i <= l ? ' class="on"' : ''}></b>`).join('');
  return `<div class="cover lvl-${c.nivel}${c.formato === 'gratis' ? ' is-free' : ''}" aria-hidden="true">
    <svg class="cover-sym" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${SIMBOLOS[c.simbolo] || ''}</svg>
    <span class="cover-n"><small>N°</small>${esc(c.n)}</span>
    <span class="cover-lvl">${esc(NIVELES[c.nivel])}<i class="lvl-bars">${bars}</i></span>
    <span class="cover-dur">${esc(duracionTxt(c.minutos))}</span>
  </div>`;
}

function precioHTML(c) {
  if (c.precio === 0) return '<p class="precio"><span class="precio-final">Gratis</span></p>';
  const off = c.descuento > 0;
  return `<p class="precio"><span class="precio-final">${formatearPrecio(precioFinal(c))}</span>${off ? `<s>${formatearPrecio(c.precio)}</s><span class="badge-off">-${c.descuento}%</span>` : ''}</p>`;
}

const ICON_PLUS = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

function addBtnHTML(c, cls = '') {
  const free = c.precio === 0;
  const lbl = free ? 'Inscribirme gratis' : 'Agregar';
  return `<button type="button" class="btn btn-sm add ${cls}" data-add="${esc(c.id)}" data-lbl="${lbl}" aria-label="${free ? 'Inscribirme gratis a' : 'Agregar al carrito'} ${esc(c.titulo)}">${free ? '' : ICON_PLUS}<span class="add-lbl">${lbl}</span></button>`;
}

function cardHTML(c, variant) {
  const meta = `${TEMAS[c.tema]} · ${c.cantidadClases} clases`;
  const badge = c.badge ? `<span class="curso-badge">${esc(c.badge)}</span>` : '';
  if (variant === 'k') {
    return `<article class="curso curso--k" data-id="${esc(c.id)}">
      <div class="curso-cover">${coverHTML(c)}${badge}</div>
      <div class="curso-body">
        <p class="curso-meta">${esc(FORMATOS[c.formato])} · ${c.cantidadClases} clases · ${esc(duracionTxt(c.minutos))}</p>
        <h3 class="curso-tit"><button type="button" data-curso="${esc(c.id)}"><span>${esc(c.titulo)}</span></button></h3>
        <p class="curso-corta">${esc(c.corta)}</p>
        <div class="curso-pie">${precioHTML(c)}${addBtnHTML(c)}</div>
      </div>
    </article>`;
  }
  return `<article class="curso" data-id="${esc(c.id)}">
    <div class="curso-cover">${coverHTML(c)}${badge}</div>
    <div class="curso-body">
      <p class="curso-meta">${esc(meta)}</p>
      <h3 class="curso-tit"><button type="button" data-curso="${esc(c.id)}"><span>${esc(c.titulo)}</span></button></h3>
      ${precioHTML(c)}
      <div class="curso-actions">${addBtnHTML(c)}</div>
    </div>
  </article>`;
}

function haystack(c) {
  return normalizar([c.titulo, TEMAS[c.tema], NIVELES[c.nivel], FORMATOS[c.formato], c.corta, c.etiquetas, DOCENTE.nombre, c.modulos.map(m => m[0] + ' ' + m[1].map(k => k[0]).join(' ')).join(' ')].join(' '));
}
CURSOS.forEach(c => { c._hay = haystack(c); });

function coincideBusqueda(c, q) {
  const t = normalizar(q).split(/\s+/).filter(Boolean);
  return t.every(w => c._hay.includes(w));
}

function flipUpdate(grid, byId, ids) {
  const cards = [...grid.children].filter(el => el.dataset.id);
  const prev = new Map();
  cards.forEach(el => { if (!el.classList.contains('is-out')) prev.set(el.dataset.id, el.getBoundingClientRect()); });
  ids.forEach(id => grid.appendChild(byId[id]));
  cards.forEach(el => el.classList.toggle('is-out', !ids.includes(el.dataset.id)));
  cards.filter(el => el.classList.contains('is-out')).forEach(el => grid.appendChild(el));
  if (reduceMotion || typeof window.Element.prototype.animate !== 'function') return;
  ids.forEach((id, i) => {
    const el = byId[id];
    const a = prev.get(id);
    const b = el.getBoundingClientRect();
    if (a) {
      const dx = a.left - b.left, dy = a.top - b.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    } else {
      el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: Math.min(i * 30, 180), easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
    }
  });
}

const WA_ELEGIR = 'https://wa.me/5491134991360?text=Hola%2C%20quiero%20aprender%20electricidad%20y%20no%20s%C3%A9%20por%20qu%C3%A9%20curso%20empezar.';

function rellenarHueco(grid, n) {
  let f = grid.querySelector('.grid-relleno');
  if (!f) {
    f = document.createElement('a');
    f.className = 'grid-relleno';
    f.href = WA_ELEGIR;
    f.target = '_blank';
    f.rel = 'noopener';
    f.innerHTML = '<span class="label">¿Por dónde empiezo?</span><span class="relleno-t">Te ayudo a elegir el curso según lo que ya sabés hacer.</span><span class="relleno-cta">Escribime por WhatsApp<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
  }
  grid.appendChild(f);
  const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
  const resto = n % cols;
  f.hidden = !(n && resto && cols > 1);
  f.style.gridColumn = resto ? `span ${cols - resto}` : '';
}

const ORDENES = {
  recomendados: (a, b) => a.orden - b.orden,
  'precio-asc': (a, b) => precioFinal(a) - precioFinal(b) || a.orden - b.orden,
  'precio-desc': (a, b) => precioFinal(b) - precioFinal(a) || a.orden - b.orden,
  'duracion-asc': (a, b) => a.minutos - b.minutos,
  nivel: (a, b) => Object.keys(NIVELES).indexOf(a.nivel) - Object.keys(NIVELES).indexOf(b.nivel) || a.orden - b.orden
};
const DURACIONES = { corto: c => c.minutos < 90, medio: c => c.minutos >= 90 && c.minutos <= 180, largo: c => c.minutos > 180 };

function initCatalogoB() {
  const grid = document.getElementById('catalogo-grid');
  const form = document.getElementById('filtros');
  if (!grid || !form) return;
  const byId = {};
  grid.innerHTML = CURSOS.slice().sort(ORDENES.recomendados).map(c => cardHTML(c, 'b')).join('');
  grid.querySelectorAll('.curso').forEach(el => { byId[el.dataset.id] = el; });

  const st = { q: '', precioMax: 60000, dur: 'todas', orden: 'recomendados' };
  const qInput = document.getElementById('q-header');
  const countEl = document.getElementById('catalogo-count');
  const pills = document.getElementById('catalogo-pills');
  const empty = document.getElementById('catalogo-vacio');
  const precioOut = document.getElementById('precio-out');
  const ordenSel = document.getElementById('orden');
  const filtrosBtnN = document.querySelector('[data-filtros-n]');
  const verN = document.querySelector('[data-ver-n]');
  const checked = name => [...form.querySelectorAll(`input[name="${name}[]"]:checked`)].map(i => i.value);

  const pasa = (c, skip) => {
    const temas = checked('tema'), niveles = checked('nivel'), formatos = checked('formato');
    if (st.q && !coincideBusqueda(c, st.q)) return false;
    if (skip !== 'tema' && temas.length && !temas.includes(c.tema)) return false;
    if (skip !== 'nivel' && niveles.length && !niveles.includes(c.nivel)) return false;
    if (skip !== 'formato' && formatos.length && !formatos.includes(c.formato)) return false;
    if (precioFinal(c) > st.precioMax) return false;
    if (skip !== 'dur' && st.dur !== 'todas' && !DURACIONES[st.dur](c)) return false;
    return true;
  };

  const actualizarConteos = () => {
    form.querySelectorAll('[data-count-for]').forEach(el => {
      const [grupo, valor] = el.dataset.countFor.split(':');
      const n = CURSOS.filter(c => pasa(c, grupo) && (grupo === 'dur' ? (valor === 'todas' || DURACIONES[valor](c)) : c[grupo] === valor)).length;
      el.textContent = n;
    });
  };

  const render = (anim = true) => {
    const lista = CURSOS.filter(c => pasa(c)).sort(ORDENES[st.orden]);
    const ids = lista.map(c => c.id);
    if (anim) flipUpdate(grid, byId, ids); else { ids.forEach(id => grid.appendChild(byId[id])); Object.values(byId).forEach(el => el.classList.toggle('is-out', !ids.includes(el.dataset.id))); }
    const n = lista.length;
    rellenarHueco(grid, n);
    countEl.textContent = n === 1 ? '1 curso' : `${n} cursos`;
    if (verN) verN.textContent = n === 1 ? 'Ver 1 curso' : `Ver ${n} cursos`;
    empty.hidden = n > 0;
    const activos = [];
    if (st.q) activos.push(['q', '', `«${st.q}»`]);
    ['tema', 'nivel', 'formato'].forEach(g => checked(g).forEach(v => activos.push([g, v, g === 'tema' ? TEMAS[v] : g === 'nivel' ? NIVELES[v] : FORMATOS[v]])));
    if (st.precioMax < 60000) activos.push(['precio', '', `Hasta ${formatearPrecio(st.precioMax)}`]);
    if (st.dur !== 'todas') activos.push(['dur', '', form.querySelector(`input[name="dur"][value="${st.dur}"]`)?.dataset.lbl || '']);
    pills.innerHTML = activos.map(([g, v, t]) => `<button type="button" class="pill" data-quitar="${g}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`).join('') + (activos.length ? '<button type="button" class="pill-clear" data-limpiar>Limpiar filtros</button>' : '');
    if (filtrosBtnN) { const k = activos.length; filtrosBtnN.textContent = k; filtrosBtnN.hidden = !k; }
    actualizarConteos();
    syncAddButtons();
  };

  const limpiar = () => {
    form.reset();
    st.q = ''; st.precioMax = 60000; st.dur = 'todas';
    if (qInput) qInput.value = '';
    precioOut.textContent = formatearPrecio(60000);
    marcarCategoria('');
    render();
  };

  form.addEventListener('change', e => {
    if (e.target.name === 'dur') st.dur = e.target.value;
    if (e.target.name === 'tema[]') marcarCategoria(checked('tema').length === 1 ? checked('tema')[0] : '');
    render();
  });
  const rango = document.getElementById('precio-max');
  rango?.addEventListener('input', () => { st.precioMax = +rango.value; precioOut.textContent = formatearPrecio(st.precioMax); render(); });
  ordenSel?.addEventListener('change', () => { st.orden = ordenSel.value; render(); });
  form.addEventListener('submit', e => e.preventDefault());

  let t;
  qInput?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = qInput.value.trim(); render(); }, 160); });
  document.getElementById('buscador-header')?.addEventListener('submit', e => {
    e.preventDefault();
    st.q = qInput.value.trim(); render();
    document.getElementById('cursos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  document.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const g = q.dataset.quitar, v = q.dataset.valor;
      if (g === 'q') { st.q = ''; if (qInput) qInput.value = ''; }
      else if (g === 'precio') { st.precioMax = 60000; if (rango) rango.value = 60000; precioOut.textContent = formatearPrecio(60000); }
      else if (g === 'dur') { st.dur = 'todas'; const r = form.querySelector('input[name="dur"][value="todas"]'); if (r) r.checked = true; }
      else { const i = form.querySelector(`input[name="${g}[]"][value="${v}"]`); if (i) i.checked = false; if (g === 'tema') marcarCategoria(''); }
      render(); return;
    }
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat) {
      e.preventDefault();
      form.querySelectorAll('input[name="tema[]"]').forEach(i => { i.checked = i.value === cat.dataset.cat; });
      marcarCategoria(cat.dataset.cat);
      render();
      document.getElementById('cursos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });

  function marcarCategoria(v) {
    document.querySelectorAll('[data-cat]').forEach(a => {
      const on = a.dataset.cat === v;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  render(false);
  initFiltrosDrawer(form);
  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => rellenarHueco(grid, grid.querySelectorAll('.curso:not(.is-out)').length), 150); }, { passive: true });
}

function initFiltrosDrawer(form) {
  const btn = document.getElementById('filtros-btn');
  const cerrar = form.querySelectorAll('[data-filtros-cerrar]');
  if (!btn) return;
  const mq = window.matchMedia('(max-width: 900px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const sync = () => { if (mq.matches && !form.classList.contains('is-open')) form.setAttribute('inert', ''); else form.removeAttribute('inert'); };
  const open = () => {
    form.classList.add('is-open'); bd.classList.add('open'); form.removeAttribute('inert');
    btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    form.querySelector('input, button')?.focus();
  };
  const close = () => {
    form.classList.remove('is-open'); bd.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    sync(); btn.focus();
  };
  btn.addEventListener('click', open);
  cerrar.forEach(b => b.addEventListener('click', close));
  bd.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && form.classList.contains('is-open')) close(); });
  mq.addEventListener('change', () => { if (!mq.matches && form.classList.contains('is-open')) close(); sync(); });
  sync();
}

function initGrillaK() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  const byId = {};
  const orden = CURSOS.slice().sort(ORDENES.recomendados);
  grid.innerHTML = orden.map(c => cardHTML(c, 'k')).join('');
  grid.querySelectorAll('.curso').forEach(el => { byId[el.dataset.id] = el; });
  const tabs = document.querySelectorAll('[data-nivel-tab]');
  const q = document.getElementById('q-cursos');
  const mas = document.getElementById('cursos-mas');
  const vacio = document.getElementById('cursos-vacio');
  const INICIALES = 6;
  let nivel = 'todos', todos = false;

  const render = (anim = true) => {
    const lista = orden.filter(c => (nivel === 'todos' || c.nivel === nivel) && (!q?.value.trim() || coincideBusqueda(c, q.value.trim())));
    const visibles = todos ? lista : lista.slice(0, INICIALES);
    const ids = visibles.map(c => c.id);
    if (anim) flipUpdate(grid, byId, ids); else Object.values(byId).forEach(el => el.classList.toggle('is-out', !ids.includes(el.dataset.id)));
    rellenarHueco(grid, visibles.length);
    const resto = lista.length - visibles.length;
    mas.hidden = resto <= 0;
    mas.querySelector('span').textContent = `Ver ${resto === 1 ? 'el curso que falta' : `los ${resto} que faltan`}`;
    vacio.hidden = lista.length > 0;
    syncAddButtons();
  };
  tabs.forEach(tab => tab.addEventListener('click', () => {
    nivel = tab.dataset.nivelTab;
    tabs.forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
    render();
  }));
  let t;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => render(), 160); });
  mas?.addEventListener('click', () => { todos = true; render(); });
  document.getElementById('cursos-limpiar')?.addEventListener('click', () => {
    nivel = 'todos'; if (q) q.value = '';
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.nivelTab === 'todos' ? 'true' : 'false'));
    render();
  });
  render(false);
  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => rellenarHueco(grid, grid.querySelectorAll('.curso:not(.is-out)').length), 150); }, { passive: true });
}

const ICONOS_TIPO = {
  video: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  pdf: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
  lectura: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  practica: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z"/>'
};
const CHEVRON = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const CHECK = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

function claseHTML(k) {
  const [titulo, min, tipo, preview] = k;
  const dato = tipo === 'practica' ? 'Entrega' : tipo === 'pdf' ? 'PDF' : `${min} min`;
  return `<li class="clase t-${tipo}${preview ? ' is-preview' : ''}">
    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_TIPO[tipo]}</svg>
    <span class="clase-t">${esc(titulo)}${preview ? '<em class="clase-muestra">Clase de muestra</em>' : ''}</span>
    <span class="clase-d"><span class="sr-only">${esc(TIPOS[tipo])}: </span>${esc(dato)}</span>
  </li>`;
}

function modulosHTML(c, abrirPrimero = true) {
  return c.modulos.map((m, i) => {
    const vids = m[1].filter(k => k[2] !== 'practica');
    const min = m[1].reduce((s, k) => s + (k[1] || 0), 0);
    return `<details class="mod"${abrirPrimero && i === 0 ? ' open' : ''}>
      <summary><span class="mod-n">Etapa ${i + 1}</span><span class="mod-t">${esc(m[0])}</span><span class="mod-m">${vids.length} ${vids.length === 1 ? 'clase' : 'clases'} · ${esc(duracionTxt(min))}</span>${CHEVRON}</summary>
      <ol class="clases">${m[1].map(claseHTML).join('')}</ol>
    </details>`;
  }).join('');
}

function compraHTML(c, contexto) {
  if (c.precio === 0) {
    return `${precioHTML(c)}<div class="compra-btns"><button type="button" class="btn" data-add="${esc(c.id)}" data-lbl="Inscribirme gratis"><span class="add-lbl">Inscribirme gratis</span></button></div>`;
  }
  return `${precioHTML(c)}<div class="compra-btns">
    <button type="button" class="btn" data-add="${esc(c.id)}" data-buy data-lbl="Comprar ahora"><span>Comprar ahora</span></button>
    <button type="button" class="btn btn-ghost" data-add="${esc(c.id)}" data-lbl="Agregar al carrito">${ICON_PLUS}<span class="add-lbl">Agregar al carrito</span></button>
  </div>
  <p class="compra-nota">${contexto === 'modal' ? 'Pagás con Mercado Pago. Con el pago aprobado se habilita tu acceso al campus.' : ''}</p>`;
}

function openCursoModal(id, opener) {
  const c = getProducto(id);
  const root = document.getElementById('curso-modal');
  const body = document.getElementById('cm-body');
  if (!c || !root || !body) return;
  const preview = c.modulos.flatMap(m => m[1]).find(k => k[3]);
  body.innerHTML = `
    <div class="cm-head">
      <figure class="cm-foto">
        <img src="${esc(c.foto)}" alt="${esc(c.fotoAlt)}" width="1280" height="960">
        ${preview ? `<figcaption class="cm-muestra"><span class="play-dot" aria-hidden="true"></span>Clase de muestra · ${esc(preview[0])} · ${preview[1]} min</figcaption>` : ''}
      </figure>
      <div class="cm-intro">
        <p class="label">N°${esc(c.n)} · ${esc(TEMAS[c.tema])} · ${esc(NIVELES[c.nivel])}</p>
        <h2 id="cm-titulo" class="cm-titulo">${esc(c.titulo)}</h2>
        <p class="cm-corta">${esc(c.corta)}</p>
        <ul class="cm-datos">
          <li><b>${c.cantidadClases}</b><span>clases</span></li>
          <li><b>${esc(duracionTxt(c.minutos))}</b><span>de clases grabadas</span></li>
          ${c.practicas ? `<li><b>${c.practicas}</b><span>${c.practicas === 1 ? 'práctica con devolución' : 'prácticas con devolución'}</span></li>` : ''}
          <li><b>Online</b><span>a tu ritmo</span></li>
        </ul>
        <div class="cm-compra">${compraHTML(c, 'modal')}</div>
      </div>
    </div>
    <div class="cm-grid">
      <section class="cm-sec">
        <h3 class="cm-h3">Qué vas a lograr</h3>
        <ul class="checks">${c.resultados.map(r => `<li>${CHECK}<span>${esc(r)}</span></li>`).join('')}</ul>
        <p class="cm-completa">${esc(c.completa)}</p>
        <h3 class="cm-h3">Requisitos</h3>
        <ul class="lista-simple">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <h3 class="cm-h3">Incluye</h3>
        <ul class="lista-simple">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </section>
      <section class="cm-sec">
        <h3 class="cm-h3">Programa</h3>
        <div class="mods">${modulosHTML(c)}</div>
        <div class="cm-docente">
          <img src="images/pinza-cable.webp" alt="Mano cortando un cable con una pinza de mango amarillo" width="1200" height="1200" loading="lazy">
          <div><p class="label">Quién enseña</p><p class="cm-doc-n">${esc(DOCENTE.nombre)}, electricista</p><p class="cm-doc-b">${esc(DOCENTE.bio)}</p></div>
        </div>
        ${c.faq ? `<h3 class="cm-h3">Preguntas del curso</h3><div class="faq-mini">${c.faq.map(f => `<details><summary>${esc(f[0])}${CHEVRON}</summary><p>${esc(f[1])}</p></details>`).join('')}</div>` : ''}
        <a class="link-wsp" href="${waLink(`Hola, tengo una consulta sobre el curso «${c.titulo}».`)}" target="_blank" rel="noopener">¿Dudas con este curso? Escribime por WhatsApp</a>
      </section>
    </div>`;
  body.scrollTop = 0;
  syncAddButtons();
  if (root.hidden) Overlay.open(root, opener, root.querySelector('[data-close]'));
  try { const u = new URL(location.href); u.searchParams.set('curso', c.id); window.history.replaceState(null, '', u); } catch { return; }
}

function initCursoModal() {
  const root = document.getElementById('curso-modal');
  if (!root) return;
  new window.MutationObserver(() => {
    if (root.hidden) { try { const u = new URL(location.href); if (u.searchParams.has('curso')) { u.searchParams.delete('curso'); window.history.replaceState(null, '', u); } } catch { return; } }
  }).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  const slug = new URLSearchParams(location.search).get('curso');
  if (slug && getProducto(slug)) openCursoModal(slug, null);
}

function openCartDrawer(opener) {
  const root = document.getElementById('cart-drawer');
  if (!root) return;
  renderCartDrawer();
  if (root.hidden) Overlay.open(root, opener, root.querySelector('[data-close]'));
}

function renderCartDrawer() {
  const body = document.getElementById('cd-body');
  const foot = document.getElementById('cd-foot');
  if (!body || !foot) return;
  const items = Cart.get().map(i => getProducto(i.id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = `<div class="cd-vacio"><p class="cd-vacio-t">Todavía no sumaste ningún curso.</p><p>Si no sabés por dónde arrancar, la clase gratis dura 25 minutos.</p><a class="btn btn-ghost" href="#cursos" data-close>Ver los cursos</a></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = `<ul class="cd-items">${items.map(c => `
    <li class="cd-item">
      <span class="cd-chip lvl-${c.nivel}" aria-hidden="true">N°${esc(c.n)}</span>
      <div class="cd-info"><p class="cd-t">${esc(c.titulo)}</p><p class="cd-m">${esc(NIVELES[c.nivel])} · ${c.cantidadClases} clases · ${esc(duracionTxt(c.minutos))}</p>
        <button type="button" class="cd-quitar" data-quitar-cart="${esc(c.id)}">Quitar</button></div>
      <p class="cd-p">${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}${formatearPrecio(precioFinal(c))}</p>
    </li>`).join('')}</ul>`;
  const sub = Cart.subtotal(), tot = Cart.total(), ahorro = sub - tot;
  foot.innerHTML = `
    <dl class="cd-tot">
      ${ahorro > 0 ? `<div><dt>Subtotal</dt><dd>${formatearPrecio(sub)}</dd></div><div class="cd-ahorro"><dt>Ahorrás</dt><dd>−${formatearPrecio(ahorro)}</dd></div>` : ''}
      <div class="cd-total"><dt>Total</dt><dd>${formatearPrecio(tot)}</dd></div>
    </dl>
    <button type="button" class="btn btn-block" id="cd-pagar">Pagar con Mercado Pago</button>
    <p class="cd-nota">El pago se hace en Mercado Pago. Con el pago aprobado se habilita tu acceso al campus y el seguimiento de cada curso.</p>`;
}

document.addEventListener('click', e => {
  const q = e.target.closest('[data-quitar-cart]');
  if (q) { const p = getProducto(q.dataset.quitarCart); Cart.remove(q.dataset.quitarCart); if (p) showToast(`Sacaste «${p.titulo}» del carrito.`); document.querySelector('#cart-drawer [data-close]')?.focus(); return; }
  const pagar = e.target.closest('#cd-pagar');
  if (pagar) {
    pagar.disabled = true; pagar.textContent = 'Conectando…';
    setTimeout(() => { pagar.disabled = false; pagar.textContent = 'Pagar con Mercado Pago'; showToast('El pago con Mercado Pago y el alta en el campus se activan al pasar la web a producción.'); }, 800);
  }
});

const DEVOLUCIONES = [
  'Buen plano. Ojo con la cocina: heladera, microondas y pava en el mismo circuito es mucha carga; pasalos a un circuito de tomas propio.',
  'Cajas a plomo y a la misma altura, bien. En la curva del caño dejá más radio: el cable tiene que pasar sin forzarlo.',
  'Conexiones firmes. Pelaste de más el neutro en la bornera: que no quede cobre a la vista fuera del borne.',
  'Tablero prolijo. Identificá cada térmica con su circuito antes de cerrar la tapa.',
  'Valores correctos. Guardá la planilla de mediciones: es la que después le mostrás al cliente.'
];

function initCampus() {
  const app = document.getElementById('campus-app');
  const c = getProducto('instalacion-completa');
  if (!app || !c) return;
  const etapas = c.modulos.map(m => ({ titulo: m[0], clases: m[1].filter(k => k[2] !== 'practica'), practica: m[1].find(k => k[2] === 'practica') }));
  const total = etapas.reduce((s, e) => s + e.clases.length + 1, 0);
  let st, timer;

  const inicial = () => ({ vistas: etapas.map((e, i) => (i < 2 ? e.clases.length : i === 2 ? 1 : 0)), practicas: etapas.map((e, i) => (i < 2 ? 'devuelta' : 'pendiente')) });
  st = inicial();

  const etapaActual = () => {
    const i = st.practicas.findIndex(p => p !== 'devuelta');
    return i === -1 ? etapas.length : i;
  };
  const hechas = () => st.vistas.reduce((s, n) => s + n, 0) + st.practicas.filter(p => p === 'devuelta').length;

  const render = () => {
    const i = etapaActual();
    const pct = Math.round((hechas() / total) * 100);
    const faltanClases = etapas.reduce((s, e, k) => s + (e.clases.length - st.vistas[k]), 0);
    const faltanPract = st.practicas.filter(p => p !== 'devuelta').length;
    const minFaltan = etapas.reduce((s, e, k) => s + e.clases.slice(st.vistas[k]).reduce((a, x) => a + (x[1] || 0), 0), 0);
    let next;
    if (i >= etapas.length) {
      next = `<p class="label">Recorrido completo</p><p class="cmp-next-t">Terminaste las cinco etapas y todas las prácticas tienen devolución.</p>`;
    } else {
      const e = etapas[i], v = st.vistas[i];
      if (v < e.clases.length) {
        const k = e.clases[v];
        next = `<p class="label">Próxima clase · Etapa ${i + 1}</p><p class="cmp-next-t">${esc(k[0])}<span>${k[2] === 'pdf' ? 'PDF' : `${k[1]} min`}</span></p><button type="button" class="btn btn-sm" data-cmp="ver">Marcar como vista</button>`;
      } else if (st.practicas[i] === 'lista') {
        next = `<p class="label">Práctica de la etapa ${i + 1}</p><p class="cmp-next-t">${esc(e.practica[0])}</p><button type="button" class="btn btn-sm btn-acc" data-cmp="entregar">Entregar práctica</button>`;
      } else {
        next = `<p class="label">Práctica de la etapa ${i + 1}</p><p class="cmp-next-t">En revisión: la devolución llega en un momento.</p><span class="cmp-spin" aria-hidden="true"></span>`;
      }
    }
    const segs = etapas.map((e, k) => {
      const hechasE = st.vistas[k] + (st.practicas[k] === 'devuelta' ? 1 : 0);
      const w = Math.round((hechasE / (e.clases.length + 1)) * 100);
      return `<span class="cmp-seg${k === i ? ' is-actual' : ''}"><i style="width:${w}%"></i></span>`;
    }).join('');
    const estados = { devuelta: 'Con devolución', revision: 'En revisión', lista: 'Lista para entregar', pendiente: 'Pendiente' };
    const practicas = etapas.map((e, k) => {
      const s = st.practicas[k];
      return `<li class="cmp-p st-${s}">
        <span class="cmp-p-n" aria-hidden="true">${k + 1}</span>
        <div class="cmp-p-txt"><p class="cmp-p-t">${esc(e.practica[0].replace(/^Práctica \d+ · /, ''))}</p>
        ${s === 'devuelta' ? `<details class="cmp-dev"><summary>Ver devolución</summary><p>«${esc(DEVOLUCIONES[k])}»</p></details>` : ''}</div>
        <span class="cmp-chip">${estados[s]}</span>
      </li>`;
    }).join('');
    app.innerHTML = `
      <div class="cmp-top"><span class="label">Campus · vista de ejemplo</span><span class="label cmp-led"><i aria-hidden="true"></i>Tu avance</span></div>
      <div class="cmp-head">
        <div><p class="label">Curso</p><p class="cmp-curso">${esc(c.titulo)}</p></div>
        <p class="cmp-pct" aria-hidden="true"><b>${pct}</b><span>%</span></p>
      </div>
      <div class="cmp-barra" role="progressbar" aria-label="Avance del curso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">${segs}</div>
      <p class="cmp-estado" aria-live="polite">${i >= etapas.length ? 'Curso terminado.' : `Etapa ${i + 1} de 5 · ${esc(etapas[i].titulo)}. Te faltan ${faltanClases} ${faltanClases === 1 ? 'clase' : 'clases'} (${esc(duracionTxt(minFaltan))}) y ${faltanPract} ${faltanPract === 1 ? 'práctica' : 'prácticas'}.`}</p>
      <div class="cmp-next">${next}</div>
      <p class="label cmp-sub">Prácticas</p>
      <ol class="cmp-practicas">${practicas}</ol>
      <div class="cmp-foot">
        <button type="button" class="btn" data-add="${esc(c.id)}" data-buy data-lbl="Empezar este curso"><span class="add-lbl">Empezar este curso</span></button>
        <button type="button" class="btn-link" data-cmp="reset">Reiniciar el ejemplo</button>
      </div>`;
    syncAddButtons();
  };

  app.addEventListener('click', e => {
    const b = e.target.closest('[data-cmp]');
    if (!b) return;
    const accion = b.dataset.cmp;
    const i = etapaActual();
    if (accion === 'ver' && i < etapas.length) {
      st.vistas[i] = Math.min(st.vistas[i] + 1, etapas[i].clases.length);
      if (st.vistas[i] === etapas[i].clases.length && st.practicas[i] === 'pendiente') st.practicas[i] = 'lista';
      render();
      app.querySelector('[data-cmp="ver"], [data-cmp="entregar"]')?.focus();
    } else if (accion === 'entregar' && i < etapas.length) {
      st.practicas[i] = 'revision';
      render();
      clearTimeout(timer);
      timer = setTimeout(() => {
        st.practicas[i] = 'devuelta';
        render();
        const d = app.querySelectorAll('.cmp-dev')[i];
        if (d) d.open = true;
        showToast(`Tenés una devolución nueva en la práctica ${i + 1}.`);
      }, 1600);
    } else if (accion === 'reset') {
      clearTimeout(timer);
      st = inicial();
      render();
    }
  });
  render();
}

function initTemarioK() {
  const mods = document.getElementById('temario-mods');
  const compra = document.getElementById('temario-compra');
  const c = getProducto('instalacion-completa');
  if (!c) return;
  if (mods) mods.innerHTML = modulosHTML(c);
  if (compra) compra.innerHTML = compraHTML(c, 'aside');
}

document.addEventListener('click', e => {
  const v = e.target.closest('[data-video]');
  if (v) {
    e.preventDefault();
    showToast(v.dataset.video === 'muestra' ? 'La clase de muestra se reproduce acá al pasar la web a producción.' : 'El video de presentación se reproduce acá al pasar la web a producción.');
  }
});

function initRail() {
  const vp = document.querySelector('.rail-vp');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  if (!vp || !prev || !next) return;
  const paso = () => {
    const item = vp.querySelector('.trabajo');
    return item ? item.getBoundingClientRect().width + parseFloat(window.getComputedStyle(vp.firstElementChild).columnGap || 0) : vp.clientWidth * 0.8;
  };
  const sync = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initTrabajosFiltro() {
  const grid = document.getElementById('trabajos-grid');
  const chips = document.querySelectorAll('[data-trab-cat]');
  if (!grid || !chips.length) return;
  const byId = {};
  grid.querySelectorAll('.trabajo').forEach(el => { byId[el.dataset.id] = el; });
  const orden = Object.keys(byId);
  chips.forEach(chip => chip.addEventListener('click', () => {
    const cat = chip.dataset.trabCat;
    chips.forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
    const ids = orden.filter(id => cat === 'todos' || byId[id].dataset.cat === cat);
    grid.classList.toggle('is-filtrado', cat !== 'todos');
    flipUpdate(grid, byId, ids);
  }));
}

function initLightbox() {
  const root = document.getElementById('lightbox');
  if (!root) return;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const count = document.getElementById('lb-count');
  let lista = [], idx = 0;
  const mostrar = () => {
    const fig = lista[idx];
    if (!fig) return;
    const src = fig.querySelector('img');
    img.src = src.getAttribute('src');
    img.alt = src.getAttribute('alt');
    cap.innerHTML = fig.querySelector('figcaption')?.innerHTML || '';
    count.textContent = `${idx + 1} / ${lista.length}`;
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lb]');
    if (!b) return;
    const cont = b.closest('[data-galeria]');
    lista = [...cont.querySelectorAll('.trabajo')].filter(f => !f.classList.contains('is-out'));
    idx = Math.max(0, lista.indexOf(b.closest('.trabajo')));
    mostrar();
    Overlay.open(root, b, root.querySelector('[data-close]'));
  });
  const mover = d => { if (!lista.length) return; idx = (idx + d + lista.length) % lista.length; mostrar(); };
  root.querySelector('[data-lb-prev]')?.addEventListener('click', () => mover(-1));
  root.querySelector('[data-lb-next]')?.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (root.hidden || Overlay.top() !== root) return;
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.4)}s`;
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

  let queued = false, intentos = 0;
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
  const iv = window.setInterval(() => { sweep(); if (++intentos >= 12) window.clearInterval(iv); }, 500);
}

initCatalogoB();
initGrillaK();
initTemarioK();
initCampus();
initReveals();
initNav();
initFloats();
initRail();
initTrabajosFiltro();
initLightbox();
initCursoModal();
updateCartBadge();
syncAddButtons();
renderCartDrawer();
