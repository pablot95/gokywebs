const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491171044151';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
const wspLink = lineas => `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.filter(Boolean).join('\n'))}`;

const PUBLICO = { prof: 'Profesionales', personal: 'Uso personal', infancia: 'Infancia y adolescencia' };
const TEMAS = {
  ansiedad: 'Ansiedad', duelo: 'Duelo', autoestima: 'Autoestima', estres: 'Estrés', depresion: 'Depresión',
  informes: 'Informes', consultorio: 'Consultorio y primeras entrevistas', escritura: 'Escritura terapéutica',
  infancia: 'Emociones en la infancia', vocacional: 'Orientación vocacional', breves: 'Intervenciones breves'
};
const FORMATOS = { cuadernillo: 'Cuadernillo', guia: 'Guía clínica', ebook: 'Ebook', tarjetas: 'Tarjetas', pack: 'Pack', biblioteca: 'Biblioteca' };
const RELACIONADOS = {
  ansiedad: ['estres', 'autoestima', 'breves'], duelo: ['depresion', 'escritura'], autoestima: ['ansiedad', 'escritura'],
  estres: ['ansiedad', 'escritura'], depresion: ['duelo', 'autoestima'], informes: ['consultorio'], consultorio: ['informes', 'breves'],
  escritura: ['autoestima', 'duelo', 'estres'], infancia: ['ansiedad', 'autoestima'], vocacional: ['informes', 'consultorio'], breves: ['consultorio', 'ansiedad']
};

const ITEMS = [
  {
    id: 'taller-informes', type: 'course', nombre: 'Taller de Informes Psicológicos', precio: 9000, antes: 15000, pack: false, badge: 'Nuevo',
    img: 'images/taller-informes.webp', publico: ['prof'], temas: ['informes'], formato: 'taller', meta: '7 módulos en PDF',
    corto: 'Siete módulos para redactar informes de niños, adolescentes y adultos, con plantillas editables.',
    desc: 'Escribir un informe es de las tareas más desafiantes del trabajo clínico: cómo integrar entrevistas, pruebas y observaciones, qué es ético escribir y cómo concluir con solidez. Este taller lo enseña paso a paso, con estructuras claras, ejemplos reales y un método simple.',
    incluye: ['7 módulos: del motivo de consulta a las recomendaciones', 'Plantillas editables', 'Ejemplos reales de informes'],
    para: ['Psicólogos/as clínicos', 'Psicopedagogos/as', 'Acompañantes terapéuticos', 'Neuropsicólogos/as', 'Estudiantes avanzados'],
    rel: 'guia-clinica-informes', relPor: 'La guía suma cien frases clínicas listas para los apartados que ves en el taller.'
  },
  {
    id: 'primeros-pasos', type: 'course', nombre: 'Primeros pasos en la clínica', precio: 8500, antes: 0, pack: false,
    img: 'images/primeros-pasos-clinica.webp', publico: ['prof'], temas: ['consultorio'], formato: 'taller', meta: '7 módulos + anexo',
    corto: 'Siete módulos y plantillas para armar tu historia clínica y ordenar el consultorio.',
    desc: '¿Estás dando tus primeros pasos en clínica? Aprendé a crear tu propia historia clínica, qué datos incluir, cómo registrar la primera entrevista y las notas de sesión, y cómo cuidar la información del paciente desde el primer encuentro.',
    incluye: ['Introducción, 7 módulos y un anexo', 'Plantillas modelo para usar hoy', 'Bonus: historia clínica para niños, adolescentes y adultos'],
    para: ['Psicólogos/as recién recibidos', 'Estudiantes avanzados', 'Acompañantes terapéuticos', 'Profesionales que quieren ordenar su consultorio'],
    rel: 'primera-entrevista-plan', relPor: 'Sigue donde termina el taller: de la entrevista a las hipótesis y el plan de tratamiento.'
  },
  {
    id: 'taller-escritura', type: 'course', nombre: 'Taller autodidáctico de Escritura Terapéutica', precio: 6500, antes: 9000, pack: false,
    img: 'images/taller-escritura-terapeutica.webp', publico: ['personal', 'prof'], temas: ['escritura', 'autoestima', 'estres', 'duelo'], formato: 'taller', meta: '12 cuadernillos en PDF',
    corto: 'Doce cuadernillos de escritura guiada para conocerte y regular emociones, a tu ritmo.',
    desc: 'Un programa autodidáctico para recorrer un camino progresivo de escritura, reflexión e introspección, desde una mirada psicológica y creativa. No necesitás conocimientos previos: solo ganas de escucharte y expresarte.',
    incluye: ['12 cuadernillos terapéuticos en PDF', 'Escritura guiada, disparadores creativos y espacios de cierre', 'Recursos de autorregulación emocional', 'Uso personal ilimitado'],
    para: ['Personas que quieren conocerse más', 'Quienes atraviesan ansiedad, estrés, duelos o cambios vitales', 'Terapeutas, coaches y docentes que quieren sumar la escritura'],
    rel: 'pack-escritura', relPor: 'El pack trae dos recorridos cortos para seguir escribiendo después del taller.'
  },
  {
    id: 'pack-coleccion', type: 'product', nombre: 'Pack Colección PsicoEnlace', precio: 30500, antes: 0, pack: true, contiene: ['cuadernillo-ansiedad', 'cuadernillo-duelo', 'cuadernillo-autoestima', 'cuadernillo-depresion', 'cuadernillo-estres'],
    img: 'images/pack-coleccion.webp', publico: ['prof', 'personal'], temas: ['ansiedad', 'duelo', 'autoestima', 'depresion', 'estres'], formato: 'pack', meta: '5 cuadernillos',
    corto: 'Los cinco cuadernillos juntos: ansiedad, duelo, autoestima, depresión y estrés.',
    desc: 'Cinco cuadernillos para acompañar (o acompañarte en) los procesos más frecuentes del bienestar emocional. Cada uno combina marco teórico, guía práctica y actividades originales para adolescentes y adultos.',
    incluye: ['Ansiedad, Duelo, Autoestima, Depresión y Estrés', 'Teoría, guía práctica y actividades en cada uno', 'Formato descargable y editable', 'Por separado suman $32.500'],
    para: ['Psicólogos/as y terapeutas', 'Docentes y acompañantes terapéuticos', 'Uso personal']
  },
  {
    id: 'cuadernillo-ansiedad', type: 'product', nombre: 'Cuadernillo de Ansiedad', precio: 6500, antes: 0, pack: false,
    img: 'images/cuadernillo-ansiedad.webp', publico: ['prof', 'personal'], temas: ['ansiedad'], formato: 'cuadernillo', meta: 'Guía + actividades',
    corto: 'Guía práctica y actividades para comprender y gestionar la ansiedad.',
    desc: 'Cuando la ansiedad se vuelve intensa o difícil de controlar, afecta el bienestar emocional, físico y cotidiano. Este cuadernillo ayuda a acompañar a adolescentes y adultos en su comprensión y manejo, en sesión, en el aula o en el trabajo personal.',
    incluye: ['Marco teórico: qué es la ansiedad, tipos y manifestaciones', 'Estrategias para trabajar en sesión o en espacios educativos', 'Actividades con espacio para escribir y reflexionar', 'Formato editable'],
    para: ['Profesionales de la salud mental', 'Docentes y familias', 'Uso personal']
  },
  {
    id: 'guia-clinica-informes', type: 'product', nombre: 'Guía clínica de informes psicológicos', precio: 9000, antes: 12000, pack: false,
    img: 'images/guia-clinica-informes.webp', publico: ['prof'], temas: ['informes'], formato: 'guia', meta: '2 guías + 100 frases',
    corto: 'Dos guías, cien frases clínicas y casos resueltos para escribir informes sin dudar.',
    desc: 'Para dejar de dudar al escribir un informe: qué escribir, cómo escribirlo y por qué. No es falta de capacidad, es falta de estructura y lenguaje clínico.',
    incluye: ['2 guías completas', '100 frases clínicas listas', 'Frases con ejemplos reales', 'Casos reales resueltos'],
    para: ['Psicólogos/as que escriben informes', 'Estudiantes avanzados'],
    relCurso: 'taller-informes', relPor: 'El taller enseña a armar cada apartado del informe en el que usás estas frases.'
  },
  {
    id: 'primera-entrevista-plan', type: 'product', nombre: 'De la primera entrevista al plan de tratamiento', precio: 9000, antes: 12000, pack: false,
    img: 'images/primera-entrevista-plan.webp', publico: ['prof'], temas: ['consultorio'], formato: 'guia', meta: '6 capítulos + bonus',
    corto: 'Cómo pasar de escuchar al paciente a intervenir con claridad clínica, con enfoque TCC.',
    desc: 'Una guía para cuando no sabés cómo organizar lo que dice el paciente, qué trabajar primero o cómo formular hipótesis. Te lleva paso a paso de la entrevista a los objetivos terapéuticos y el plan de tratamiento. No reemplaza formación ni supervisión clínica.',
    incluye: ['La primera entrevista como base clínica', 'Hipótesis, objetivos y plan de tratamiento en TCC', 'Registros y casos clínicos', 'Bonus: estructura clínica de sesión'],
    para: ['Psicólogos/as recién recibidos', 'Profesionales en formación', 'Terapeutas que quieren ordenar su práctica'],
    relCurso: 'primeros-pasos', relPor: 'El taller arma la historia clínica y el registro que esta guía da por hechos.'
  },
  {
    id: 'intervenciones-15', type: 'product', nombre: 'Intervenciones en 15 minutos', precio: 6500, antes: 0, pack: false,
    img: 'images/intervenciones-15-minutos.webp', publico: ['prof'], temas: ['breves', 'ansiedad'], formato: 'ebook', meta: 'Ebook con hojas de trabajo',
    corto: 'Estrategias breves para aplicar en sesión, con variantes para teleconsulta.',
    desc: 'Técnicas listas para usar en quince minutos, basadas en terapias con respaldo (TCC, ACT, terapia breve centrada en soluciones), para ahorrar tiempo de preparación y sumar materiales visuales y simples.',
    incluye: ['Estrategias breves con pasos claros', 'Hojas de trabajo', 'Variantes para teleconsulta'],
    para: ['Psicólogos/as clínicos', 'Terapeutas que atienden online']
  },
  {
    id: 'cuadernillo-duelo', type: 'product', nombre: 'Cuadernillo: Acompañar en el duelo', precio: 6500, antes: 0, pack: false,
    img: 'images/cuadernillo-duelo.webp', publico: ['prof', 'personal'], temas: ['duelo'], formato: 'cuadernillo', meta: 'Guía + actividades',
    corto: 'Para acompañar procesos de pérdida, cierre y reconstrucción emocional.',
    desc: 'Creado para acompañar procesos de pérdida desde una mirada profesional y humana. Sirve en sesión y también de manera personal, como herramienta de autoconocimiento.',
    incluye: ['Marco teórico: etapas, tipos y manifestaciones del duelo', 'Guía práctica para adolescentes y adultos', 'Actividades reflexivas, proyectivas y de autocuidado', 'Ejercicios de cierre y resignificación'],
    para: ['Profesionales que acompañan duelos', 'Grupos y talleres', 'Personas que atraviesan una pérdida']
  },
  {
    id: 'cuadernillo-autoestima', type: 'product', nombre: 'Cuadernillo de Autoestima', precio: 6500, antes: 0, pack: false,
    img: 'images/cuadernillo-autoestima.webp', publico: ['prof', 'personal'], temas: ['autoestima'], formato: 'cuadernillo', meta: '27 actividades',
    corto: 'Teoría y 27 actividades para fortalecer la confianza y el valor personal.',
    desc: 'Para trabajar la autopercepción, la confianza y el amor propio en adolescentes y adultos, con una estética cálida y profesional que combina teoría y práctica.',
    incluye: ['Marco teórico de la autoestima y sus componentes', 'Estrategias para la autoaceptación y la autocompasión', '27 actividades paso a paso', 'Formato editable'],
    para: ['Psicólogos/as y terapeutas', 'Docentes y acompañantes terapéuticos', 'Uso personal']
  },
  {
    id: 'cuadernillo-estres', type: 'product', nombre: 'Cuadernillo de Estrés', precio: 6500, antes: 0, pack: false,
    img: 'images/cuadernillo-estres.webp', publico: ['prof', 'personal'], temas: ['estres'], formato: 'cuadernillo', meta: 'Guía + actividades',
    corto: 'Para identificar las señales del estrés y construir rutinas de calma.',
    desc: 'Combina fundamentos de la psicología clínica con herramientas prácticas para comprender y regular las respuestas al estrés en adolescentes y adultos.',
    incluye: ['Tipos de estrés y síntomas frecuentes', 'Estrategias para detectar señales tempranas', 'Respiración consciente, organización y autocuidado', 'Formato editable'],
    para: ['Profesionales de la salud mental', 'Docentes y coaches', 'Uso personal']
  },
  {
    id: 'cuadernillo-depresion', type: 'product', nombre: 'Cuadernillo de Depresión', precio: 6500, antes: 0, pack: false,
    img: 'images/cuadernillo-depresion.webp', publico: ['prof', 'personal'], temas: ['depresion'], formato: 'cuadernillo', meta: 'Guía + actividades',
    corto: 'Activación conductual, registro emocional y actividades para recuperar el sentido.',
    desc: 'Para acompañar procesos de tristeza profunda, desmotivación y pérdida de energía, desde una mirada terapéutica, empática y basada en evidencia.',
    incluye: ['Marco teórico: tipos y síntomas, y diferencias con la tristeza', 'Estrategias de activación conductual', 'Actividades con objetivos y consignas', 'Formato editable'],
    para: ['Profesionales que trabajan con adolescentes y adultos', 'Grupos de apoyo', 'Uso personal']
  },
  {
    id: 'pack-ansiedad-autoestima', type: 'product', nombre: 'Pack Ansiedad + Autoestima + bonus', precio: 8500, antes: 0, pack: true,
    img: 'images/pack-ansiedad-autoestima.webp', publico: ['prof', 'infancia'], temas: ['ansiedad', 'autoestima', 'infancia'], formato: 'pack', meta: '3 ebooks + bonus',
    corto: 'Ebooks de ansiedad, autoestima y autoevaluaciones para chicos, con juegos de bonus.',
    desc: 'Recursos prácticos para el trabajo en sesión con población infanto-juvenil y adultos: ejercicios listos, material adaptado a distintas edades y protocolos de autoevaluación.',
    incluye: ['Ebooks: Autoestima, Ansiedad y Autoevaluaciones para niños, niñas y adolescentes', 'Bonus: comecocos terapéutico y juego rompehielo', 'Bonus: cuadernillo Emocionarte'],
    para: ['Psicólogos/as clínicos', 'Profesionales de la infancia']
  },
  {
    id: 'informes-educativos', type: 'product', nombre: 'Informes educativos psicológicos: guía', precio: 5000, antes: 7500, pack: false,
    img: 'images/informes-educativos.webp', publico: ['prof', 'infancia'], temas: ['informes', 'infancia'], formato: 'guia', meta: 'Guía + banco de frases',
    corto: 'Estructura, casos reales, banco de frases e introducción al PPI.',
    desc: 'Para organizar, redactar y fundamentar informes psicológicos educativos con seguridad clínica, evitando errores frecuentes y mejorando las devoluciones a familias e instituciones.',
    incluye: ['Estructura paso a paso', 'Casos reales', 'Banco de frases por área: emocional, cognitiva, vincular y conductual', 'Introducción al Proyecto Pedagógico Individual'],
    para: ['Psicólogos/as clínicos y educacionales', 'Psicopedagogos/as', 'Profesionales en contexto escolar'],
    relCurso: 'taller-informes', relPor: 'El taller trabaja los mismos apartados para informes clínicos.'
  },
  {
    id: 'tarjetas-cierre', type: 'product', nombre: 'Tarjetas terapéuticas de cierre de año', precio: 8500, antes: 0, pack: false,
    img: 'images/tarjetas-cierre-de-ano.webp', publico: ['prof'], temas: ['breves'], formato: 'tarjetas', meta: '30 tarjetas en PDF',
    corto: 'Treinta tarjetas con su dinámica para cerrar el año en sesión o en grupo.',
    desc: 'Para cerrar el año de manera significativa con adolescentes y adultos: cada tarjeta trae una dinámica guiada para procesar emociones, integrar aprendizajes y planificar lo que viene.',
    incluye: ['30 tarjetas para imprimir o usar en digital', 'Una dinámica breve por tarjeta', 'Actividades complementarias'],
    para: ['Consultorio individual', 'Grupos terapéuticos', 'Talleres y espacios educativos']
  },
  {
    id: 'inteligencia-emocional', type: 'product', nombre: 'Inteligencia emocional infantil', precio: 8500, antes: 0, pack: false,
    img: 'images/inteligencia-emocional.webp', publico: ['prof', 'infancia'], temas: ['infancia'], formato: 'ebook', meta: 'Ebook con 30 actividades',
    corto: 'Teoría desde la neuropsicología y treinta actividades para chicos y adolescentes.',
    desc: 'Un ebook que explica cómo se procesan las emociones y cómo influyen en la conducta y el aprendizaje, con treinta actividades para sesión, talleres grupales, la escuela o la familia.',
    incluye: ['Base teórica desde la neuropsicología', '30 actividades con objetivo, materiales y guía paso a paso'],
    para: ['Psicólogos/as', 'Educadores/as', 'Profesionales de la infancia']
  },
  {
    id: 'tarjetas-emociones', type: 'product', nombre: 'Tarjetas de emociones + dinámicas', precio: 12000, antes: 0, pack: false,
    img: 'images/tarjetas-emociones.webp', publico: ['prof', 'infancia'], temas: ['infancia'], formato: 'tarjetas', meta: 'Tarjetas + dinámicas',
    corto: 'Para identificar y nombrar emociones jugando, en sesión individual o grupal.',
    desc: 'Tarjetas con emociones y dinámicas guiadas para trabajar con niños, adolescentes o adultos: juegos, actividades de expresión y ejercicios que facilitan la conversación en sesión.',
    incluye: ['Tarjetas de alegría, tristeza, miedo, sorpresa, enojo y más', 'Dinámicas guiadas', 'Uso individual, en pareja o en grupo'],
    para: ['Psicólogos/as infanto-juveniles', 'Docentes', 'Talleres grupales']
  },
  {
    id: 'pack-escritura', type: 'product', nombre: 'Pack de escritura terapéutica', precio: 5300, antes: 8000, pack: true,
    img: 'images/pack-escritura.webp', publico: ['prof', 'personal'], temas: ['escritura'], formato: 'pack', meta: '2 cuadernillos',
    corto: '«Escribí el camino» y «10 días de catarsis», dos recorridos de escritura guiada.',
    desc: 'Dos cuadernillos editables para reflexionar, soltar y reconectar a través de la escritura, en un proceso personal o en sesión.',
    incluye: ['Escribí el camino, cuadernillo editable', '10 días de catarsis, ejercicios guiados', 'Preguntas para el autoconocimiento'],
    para: ['Uso personal', 'Psicólogos/as y coaches', 'Programas grupales']
  },
  {
    id: 'pack-informes', type: 'product', nombre: 'Pack completo de informes psicológicos', precio: 18000, antes: 23000, pack: true, contiene: ['guia-clinica-informes', 'taller-informes', 'informes-educativos'],
    img: 'images/pack-informes.webp', publico: ['prof'], temas: ['informes'], formato: 'pack', meta: '3 recursos',
    corto: 'La guía de informes, el taller de siete módulos y la guía de informes educativos.',
    desc: 'Los tres recursos de informes en una sola compra, para redactar con más claridad, seguridad y criterio clínico.',
    incluye: ['Guía de informes psicológicos (A + B)', 'Taller de informes psicológicos (7 módulos)', 'Informes educativos psicológicos'],
    para: ['Psicólogos/as que escriben informes', 'Psicopedagogos/as']
  },
  {
    id: 'biblioteca-ov', type: 'product', nombre: 'Biblioteca clínica de Orientación Vocacional', precio: 18000, antes: 25000, pack: true,
    img: 'images/biblioteca-orientacion-vocacional.webp', publico: ['prof'], temas: ['vocacional'], formato: 'biblioteca', meta: 'Biblioteca digital',
    corto: 'Manual, técnicas, protocolos, consentimientos y modelos de informe en un solo lugar.',
    desc: 'Una colección organizada para acompañar procesos de orientación vocacional con enfoque clínico, desde la primera entrevista hasta la devolución, con actualizaciones durante la vigencia.',
    incluye: ['Manual clínico de orientación vocacional', 'Técnicas proyectivas, psicométricas y lúdicas', 'Protocolos de entrevista y consentimientos', 'Modelos de informes y formularios'],
    para: ['Psicólogos/as y psicopedagogos/as', 'Orientadores vocacionales', 'Estudiantes avanzados']
  }
];

const getItem = id => ITEMS.find(i => i.id === id);
const keyDe = item => `${item.type}:${item.id}`;
const descuento = item => (item.antes > item.precio ? Math.round((1 - item.precio / item.antes) * 100) : 0);
const tipoLabel = item => (item.type === 'course' ? 'Taller' : 'Material PDF');

const Cart = {
  KEY: 'psicoenlace_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || this.memoria || []; } catch { return this.memoria || []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(item) { return this.get().some(i => i.key === keyDe(item)); },
  add(item) {
    const items = this.get();
    if (items.some(i => i.key === keyDe(item))) return false;
    items.push({ key: keyDe(item), type: item.type, id: item.id, variantKey: null, qty: 1 });
    this.save(items);
    return true;
  },
  remove(key) { this.save(this.get().filter(i => i.key !== key)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getItem(i.id)).length; }
};

function resumenCarrito(lineas) {
  const items = lineas.map(l => getItem(l.id)).filter(Boolean);
  const subtotal = items.reduce((s, i) => s + i.precio, 0);
  const elegibles = items.filter(i => !i.pack).map(i => i.precio).sort((a, b) => b - a);
  let promo = 0;
  for (let n = 2; n < elegibles.length; n += 3) promo += elegibles[n];
  return { items, subtotal, promo, total: subtotal - promo, elegibles: elegibles.length };
}

function limpiarCarrito() {
  const items = Cart.get();
  const validos = items.filter(i => getItem(i.id));
  if (validos.length !== items.length) Cart.save(validos);
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function agregar(item, abrir = false) {
  if (!item) return;
  const nuevo = Cart.add(item);
  if (nuevo) {
    const r = resumenCarrito(Cart.get());
    const extra = r.elegibles > 0 && r.elegibles % 3 === 2 ? ' Sumá uno más y el de menor precio va sin cargo.' : '';
    showToast(`${item.nombre} ya está en tu carrito.${extra}`);
  } else {
    showToast('Ya está en tu carrito: es un PDF, con uno alcanza.');
  }
  syncBotones();
  if (abrir) openCartDrawer();
}

function syncBotones() {
  $$('[data-add]').forEach(b => {
    const item = getItem(b.dataset.add);
    const en = item && Cart.has(item);
    b.classList.toggle('is-added', !!en);
    if (b.classList.contains('card-add')) b.textContent = en ? 'En el carrito' : 'Agregar';
  });
}
document.addEventListener('cart:updated', syncBotones);

const ICON = {
  course: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4Z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6Z"/></svg>',
  product: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/></svg>'
};

function precioHTML(item) {
  const d = descuento(item);
  return `<p class="card-price"><b>${formatearPrecio(item.precio)}</b>${d ? `<s>${formatearPrecio(item.antes)}</s>` : ''}</p>`;
}

function cardHTML(item, variante, i) {
  const d = descuento(item);
  const quien = item.publico.map(p => PUBLICO[p]).join(' · ');
  return `<article class="card card--${variante} is-${item.type}" data-id="${item.id}" data-animate style="opacity:0;transform:translateY(22px);transition-delay:${Math.min(i * 0.06, 0.36)}s">
    <div class="card-media fold">
      <img src="${item.img}" width="1000" height="1250" alt="Portada de ${esc(item.nombre)}">
      <span class="card-type">${ICON[item.type]}${item.type === 'course' ? 'Taller' : '<span class="ct-word">Material </span>PDF'}</span>
      ${d ? `<span class="card-off">-${d}%</span>` : item.badge ? `<span class="card-off card-off--new">${esc(item.badge)}</span>` : ''}
    </div>
    <div class="card-body">
      <p class="card-meta">${esc(item.meta)}</p>
      <h3 class="card-title"><button type="button" data-open="${item.id}"><span>${esc(item.nombre)}</span></button></h3>
      ${variante === 'dest' ? `<p class="card-desc">${esc(item.corto)}</p><p class="card-quien">${esc(quien)}</p>` : ''}
      ${precioHTML(item)}
      <div class="card-actions">
        <button type="button" class="card-add" data-add="${item.id}">Agregar</button>
        ${variante === 'dest' ? `<button type="button" class="card-link" data-open="${item.id}">${item.type === 'course' ? 'Ver el taller' : 'Ver qué trae'}</button>` : ''}
      </div>
    </div>
  </article>`;
}

let revealsListos = false;
let revealIO = null;

const DESTACADOS = ['taller-informes', 'primeros-pasos', 'taller-escritura', 'pack-coleccion', 'cuadernillo-ansiedad', 'guia-clinica-informes'];

function initDestacados() {
  $('#destGrid').innerHTML = DESTACADOS.map((id, i) => cardHTML(getItem(id), 'dest', i)).join('');
}

const cat = { tipo: 'todo', q: '', publico: null, tema: null, formato: null, precio: null, orden: 'recomendados', page: 1 };
const PAGE = 12;

function filtrar() {
  const palabras = normalizar(cat.q).split(/\s+/).filter(Boolean);
  const lista = ITEMS.filter(i => {
    if (cat.tipo !== 'todo' && i.type !== cat.tipo) return false;
    if (cat.publico && !i.publico.includes(cat.publico)) return false;
    if (cat.tema && !i.temas.includes(cat.tema)) return false;
    if (cat.formato && i.formato !== cat.formato) return false;
    if (cat.precio === 'b1' && i.precio > 7000) return false;
    if (cat.precio === 'b2' && (i.precio < 7000 || i.precio > 10000)) return false;
    if (cat.precio === 'b3' && i.precio <= 10000) return false;
    if (palabras.length) {
      const texto = normalizar([i.nombre, i.meta, i.corto, i.desc, i.incluye.join(' '), i.para.join(' '), i.temas.map(t => TEMAS[t]).join(' '), i.publico.map(p => PUBLICO[p]).join(' '), tipoLabel(i), FORMATOS[i.formato] || 'taller'].join(' '));
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  if (cat.orden === 'menor') lista.sort((a, b) => a.precio - b.precio);
  if (cat.orden === 'mayor') lista.sort((a, b) => b.precio - a.precio);
  if (cat.orden === 'recomendados') {
    // Con búsqueda, primero lo que la nombra; sin búsqueda, el catálogo no abre repitiendo los destacados (van al final).
    const peso = palabras.length
      ? i => Number(!palabras.every(w => normalizar(i.nombre).includes(w)))
      : i => Number(DESTACADOS.includes(i.id));
    lista.sort((a, b) => peso(a) - peso(b));
  }
  return lista;
}

function chipsHTML(obj, attr, activo) {
  return Object.entries(obj).map(([k, v]) => `<button type="button" class="chip" ${attr}="${k}" aria-pressed="${k === activo}">${esc(v)}</button>`).join('');
}

function renderFiltros() {
  $('#fPublico').innerHTML = chipsHTML(PUBLICO, 'data-f-publico', cat.publico);
  $('#fTema').innerHTML = chipsHTML(TEMAS, 'data-f-tema', cat.tema);
  $('#fFormato').innerHTML = chipsHTML(FORMATOS, 'data-f-formato', cat.formato);
  $('#fFormatoGroup').hidden = cat.tipo === 'course';
  $$('[data-precio]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.precio === cat.precio)));
  $$('[data-tipo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tipo === cat.tipo)));
  const buscar = $('#buscar'); if (buscar.value !== cat.q) buscar.value = cat.q;
  $('#orden').value = cat.orden;
}

function renderActivos() {
  const chips = [];
  if (cat.q) chips.push(['q', `“${cat.q}”`]);
  if (cat.publico) chips.push(['publico', PUBLICO[cat.publico]]);
  if (cat.tema) chips.push(['tema', TEMAS[cat.tema]]);
  if (cat.formato) chips.push(['formato', FORMATOS[cat.formato]]);
  if (cat.precio) chips.push(['precio', $(`[data-precio="${cat.precio}"]`)?.textContent || '']);
  $('#activeFilters').innerHTML = chips.map(([k, l]) => `<button type="button" class="af-chip" data-quitar="${k}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.x}</button>`).join('');
}

function renderCatalogo() {
  const lista = filtrar();
  const visibles = lista.slice(0, cat.page * PAGE);
  const grid = $('#catalogo');
  grid.innerHTML = visibles.map((item, i) => cardHTML(item, 'cat', i % PAGE)).join('');
  $('#catEmpty').hidden = lista.length > 0;
  $('#verMas').hidden = visibles.length >= lista.length;
  $$('[data-result-count]').forEach(el => { el.textContent = lista.length; });
  renderActivos();
  syncBotones();
  revelarNuevos(grid);
}

function aplicar() { cat.page = 1; renderFiltros(); renderCatalogo(); }

function limpiar() { Object.assign(cat, { q: '', publico: null, tema: null, formato: null, precio: null }); aplicar(); }

function irACatalogo() { $('#materiales').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }

function initCatalogo() {
  $$('[data-tipo-count]').forEach(el => { const t = el.dataset.tipoCount; el.textContent = t === 'todo' ? ITEMS.length : ITEMS.filter(i => i.type === t).length; });
  $$('[data-door-count]').forEach(el => { el.textContent = ITEMS.filter(i => i.publico.includes(el.dataset.doorCount)).length; });
  renderFiltros();
  renderCatalogo();
  const panel = $('#filtersPanel');
  panel.addEventListener('click', e => {
    const p = e.target.closest('[data-f-publico]'); if (p) { cat.publico = cat.publico === p.dataset.fPublico ? null : p.dataset.fPublico; aplicar(); return; }
    const t = e.target.closest('[data-f-tema]'); if (t) { cat.tema = cat.tema === t.dataset.fTema ? null : t.dataset.fTema; aplicar(); return; }
    const f = e.target.closest('[data-f-formato]'); if (f) { cat.formato = cat.formato === f.dataset.fFormato ? null : f.dataset.fFormato; if (cat.formato && cat.tipo === 'course') cat.tipo = 'todo'; aplicar(); return; }
    const pr = e.target.closest('[data-precio]'); if (pr) { cat.precio = cat.precio === pr.dataset.precio ? null : pr.dataset.precio; aplicar(); }
  });
  $$('[data-tipo]').forEach(b => b.addEventListener('click', () => {
    cat.tipo = b.dataset.tipo;
    if (cat.tipo === 'course' && cat.formato) { cat.formato = null; showToast('Los talleres no tienen formato: saqué ese filtro'); }
    aplicar();
  }));
  let tmr;
  $('#buscar').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { cat.q = e.target.value.trim(); cat.page = 1; renderCatalogo(); }, 180); });
  $('#orden').addEventListener('change', e => { cat.orden = e.target.value; aplicar(); });
  $('#filtersClear').addEventListener('click', limpiar);
  $('#emptyClear').addEventListener('click', limpiar);
  $('#verMas').addEventListener('click', () => { cat.page += 1; renderCatalogo(); });
  $('#activeFilters').addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]'); if (!b) return;
    const k = b.dataset.quitar;
    if (k === 'q') cat.q = ''; else cat[k] = null;
    aplicar();
  });
  $$('.door').forEach(d => d.addEventListener('click', () => {
    Object.assign(cat, { tipo: 'todo', q: '', tema: null, formato: null, precio: null, publico: d.dataset.door });
    aplicar(); irACatalogo();
  }));
  $$('[data-footer-publico], [data-footer-tipo]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    Object.assign(cat, { tipo: a.dataset.footerTipo || 'todo', q: '', tema: null, formato: null, precio: null, publico: a.dataset.footerPublico || null });
    aplicar(); irACatalogo();
  }));

  const abrir = $('#filtersOpen');
  const openF = () => {
    panel.classList.add('open'); abrir.setAttribute('aria-expanded', 'true');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    $('#overlay').classList.add('open'); document.body.classList.add('no-scroll');
    setTimeout(() => $('#filtersClose').focus(), 60);
  };
  const closeF = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); abrir.setAttribute('aria-expanded', 'false');
    panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    if (!$('#cartDrawer').classList.contains('open')) { $('#overlay').classList.remove('open'); document.body.classList.remove('no-scroll'); }
    abrir.focus({ preventScroll: true });
    $('#materiales').scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  cerrarFiltrosRef = closeF;
  abrir.addEventListener('click', openF);
  $('#filtersClose').addEventListener('click', closeF);
  $('#filtersApply').addEventListener('click', closeF);
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') closeF();
    if (e.key === 'Tab') atraparFoco(e, panel);
  });
}
let cerrarFiltrosRef = null;

const quiz = { publico: 'prof', tema: 'ansiedad', formato: 'aplicar' };

function prefiere(item) {
  if (quiz.formato === 'taller') return item.type === 'course';
  if (quiz.formato === 'pack') return item.pack;
  return item.type === 'product' && !item.pack;
}

// Solo los temas que tienen material para ese público: «Para mí» no ofrece informes ni orientación vocacional.
function temasDelPublico() {
  return Object.fromEntries(Object.entries(TEMAS).filter(([t]) => ITEMS.some(i => i.temas.includes(t) && i.publico.includes(quiz.publico))));
}

function recomendar() {
  const deAudiencia = i => i.publico.includes(quiz.publico);
  const base = ITEMS.filter(i => i.temas.includes(quiz.tema) && deAudiencia(i));
  // Sin el formato pedido, primero el recurso suelto del tema y recién después el pack que lo incluye.
  const puntaje = i => Number(prefiere(i)) * 2 + Number(quiz.formato !== 'pack' && !i.pack);
  const orden = [...base].sort((a, b) => puntaje(b) - puntaje(a));
  const principal = orden[0];
  const exacto = principal ? prefiere(principal) : false;
  const usados = new Set(principal ? [principal.id, ...(principal.contiene || [])] : []);
  const comp = [];
  const tomar = lista => lista.forEach(i => { if (comp.length < 2 && !usados.has(i.id)) { comp.push(i); usados.add(i.id); } });
  const noPack = i => quiz.formato === 'pack' || !i.pack;
  tomar(orden.filter(noPack));
  (RELACIONADOS[quiz.tema] || []).forEach(t => tomar(ITEMS.filter(i => i.temas.includes(t) && deAudiencia(i) && noPack(i))));
  tomar(ITEMS.filter(i => deAudiencia(i) && noPack(i)));
  return { principal, comp, exacto };
}

function renderQuiz() {
  const temas = temasDelPublico();
  if (!temas[quiz.tema]) quiz.tema = Object.keys(temas)[0];
  $('#qTema').innerHTML = chipsHTML(temas, 'data-q-tema', quiz.tema);
  $$('[data-q-publico]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qPublico === quiz.publico)));
  $$('[data-q-formato]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qFormato === quiz.formato)));
  const { principal, comp, exacto } = recomendar();
  const reco = $('#reco');
  if (!principal) { reco.innerHTML = '<p>Elegí un tema para ver la recomendación.</p>'; return; }
  const trio = [principal, ...comp];
  const r = resumenCarrito(trio.map(i => ({ id: i.id })));
  const aviso = !exacto ? `<p class="reco-aviso">${quiz.formato === 'taller' ? `No hay un taller de ${esc(TEMAS[quiz.tema].toLowerCase())}: te sugerimos el material que mejor lo cubre.` : quiz.formato === 'pack' ? 'No hay un pack solo de este tema: te sugerimos el material que mejor lo cubre.' : 'Para este tema lo más completo es este recurso.'}</p>` : '';
  const promo = r.promo ? `<p class="reco-promo"><b>3x2:</b> llevándote los tres pagás ${formatearPrecio(r.total)} en vez de ${formatearPrecio(r.subtotal)}. El de ${formatearPrecio(r.promo)} va sin cargo.</p>` : `<p class="reco-promo reco-promo--off">Los packs no entran en el 3x2: los tres suman ${formatearPrecio(r.subtotal)}.</p>`;
  const cuidado = quiz.publico === 'personal' ? `<p class="reco-cuidado">${ICON.heart}<span>Son recursos para acompañarte: no reemplazan un espacio de terapia.</span></p>` : '';
  reco.innerHTML = `
    <p class="reco-kicker">Te recomendamos empezar por</p>
    <div class="reco-main">
      <button type="button" class="reco-img" data-open="${principal.id}" aria-label="Ver ${esc(principal.nombre)}"><img src="${principal.img}" width="1000" height="1250" alt="Portada de ${esc(principal.nombre)}"></button>
      <div class="reco-info">
        <span class="card-type card-type--inline">${ICON[principal.type]}${tipoLabel(principal)}</span>
        <h3>${esc(principal.nombre)}</h3>
        <p>${esc(principal.corto)}</p>
        ${precioHTML(principal)}
      </div>
    </div>
    ${aviso}
    <p class="reco-sub">Y para complementarlo</p>
    <ul class="reco-comp">${comp.map(c => `<li><button type="button" data-open="${c.id}"><img src="${c.img}" width="1000" height="1250" alt=""><span><b>${esc(c.nombre)}</b><small>${tipoLabel(c)} · ${formatearPrecio(c.precio)}</small></span></button></li>`).join('')}</ul>
    ${promo}
    ${cuidado}
    <div class="reco-actions">
      <button type="button" class="btn btn-cta" id="recoAll">Agregar los tres al carrito</button>
      <button type="button" class="btn btn-ghost" data-add="${principal.id}">Solo el primero</button>
      <a class="text-link" href="${wspLink([`¡Hola! Busco material de ${TEMAS[quiz.tema].toLowerCase()} (${PUBLICO[quiz.publico].toLowerCase()}).`, `La web me sugirió: ${trio.map(i => i.nombre).join(', ')}.`, '¿Me ayudás a elegir?'])}" target="_blank" rel="noopener noreferrer">Preguntar antes por WhatsApp</a>
    </div>`;
  reco.dataset.trio = trio.map(i => i.id).join(',');
  syncBotones();
}

function initQuiz() {
  renderQuiz();
  $('#quiz').addEventListener('click', e => {
    const p = e.target.closest('[data-q-publico]'); if (p) { quiz.publico = p.dataset.qPublico; renderQuiz(); return; }
    const t = e.target.closest('[data-q-tema]'); if (t) { quiz.tema = t.dataset.qTema; renderQuiz(); return; }
    const f = e.target.closest('[data-q-formato]'); if (f) { quiz.formato = f.dataset.qFormato; renderQuiz(); }
  });
  $('#reco').addEventListener('click', e => {
    if (!e.target.closest('#recoAll')) return;
    const ids = ($('#reco').dataset.trio || '').split(',').filter(Boolean);
    let nuevos = 0;
    ids.forEach(id => { const item = getItem(id); if (item && Cart.add(item)) nuevos++; });
    const r = resumenCarrito(Cart.get());
    showToast(nuevos ? `Sumaste ${nuevos} ${nuevos === 1 ? 'recurso' : 'recursos'}. Total del carrito: ${formatearPrecio(r.total)}` : 'Los tres ya estaban en tu carrito.');
    syncBotones();
  });
}

function initTabs() {
  const tabs = $$('[role="tab"]');
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (foco) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); activar(tabs[(i + 1) % tabs.length], true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activar(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); activar(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); activar(tabs[tabs.length - 1], true); }
    });
  });
}

function focusables(cont) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', cont).filter(el => el.offsetParent !== null);
}
function atraparFoco(e, cont) {
  const f = focusables(cont); if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let qvOpener = null;
function openQuickView(id, opener) {
  const item = getItem(id);
  if (!item) return;
  qvOpener = opener || document.activeElement;
  const wrap = $('#quickView');
  const modal = $('#qvModal');
  const d = descuento(item);
  const rel = item.type === 'course' ? getItem(item.rel) : getItem(item.relCurso);
  const cuidado = item.publico.includes('personal') ? `<p class="reco-cuidado">${ICON.heart}<span>Es un recurso para acompañar: no reemplaza un espacio de terapia.</span></p>` : '';
  modal.innerHTML = `
    <button type="button" class="close-btn modal-close" data-close-modal aria-label="Cerrar">${ICON.x}</button>
    <div class="modal-media fold"><img src="${item.img}" width="1000" height="1250" alt="Portada de ${esc(item.nombre)}"></div>
    <div class="modal-info">
      <span class="card-type card-type--inline">${ICON[item.type]}${tipoLabel(item)} · ${esc(item.meta)}</span>
      <h2 id="qv-title">${esc(item.nombre)}</h2>
      <p class="modal-price"><b>${formatearPrecio(item.precio)}</b>${d ? `<s>${formatearPrecio(item.antes)}</s><span class="card-off">-${d}%</span>` : ''}</p>
      <p class="modal-desc">${esc(item.desc)}</p>
      <div class="modal-cols">
        <div><h3>${item.type === 'course' ? 'Qué trae el taller' : 'Qué incluye'}</h3><ul class="modal-list">${item.incluye.map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul></div>
        <div><h3>Para quién es</h3><ul class="modal-list modal-list--dot">${item.para.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ul></div>
      </div>
      <p class="modal-entrega">Se entrega en PDF para descargar${item.pack ? '. Los packs no entran en el 3x2.' : '. Entra en el 3x2 con otros dos sueltos.'}</p>
      ${cuidado}
      <div class="modal-actions">
        <button type="button" class="btn btn-cta" data-add="${item.id}" data-qv-add>${item.type === 'course' ? 'Sumar el taller al carrito' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn-ghost" id="qvBuy">Comprar ahora</button>
      </div>
      <a class="text-link" href="${wspLink([`¡Hola! Quiero consultar por ${item.nombre}.`])}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      ${rel ? `<div class="modal-rel"><h3>${item.type === 'course' ? 'Material que lo complementa' : 'Taller relacionado'}</h3><button type="button" class="rel-item" data-rel="${rel.id}"><img src="${rel.img}" width="1000" height="1250" alt=""><span><b>${esc(rel.nombre)}</b><small>${esc(item.relPor || '')}</small><em>${formatearPrecio(rel.precio)}</em></span></button></div>` : ''}
    </div>`;
  modal.onclick = e => {
    if (e.target.closest('[data-qv-add]')) { agregar(item); return; }
    if (e.target.closest('#qvBuy')) { Cart.add(item); syncBotones(); closeQuickView(false); openCartDrawer(); return; }
    const r = e.target.closest('[data-rel]'); if (r) { openQuickView(r.dataset.rel, qvOpener); return; }
    if (e.target.closest('[data-close-modal]')) closeQuickView();
  };
  syncBotones();
  if (wrap.hidden) { wrap.hidden = false; document.body.classList.add('no-scroll'); }
  modal.scrollTop = 0;
  const url = new URL(location.href); url.searchParams.set(item.type === 'course' ? 'taller' : 'material', item.id); url.searchParams.delete(item.type === 'course' ? 'material' : 'taller'); window.history.replaceState(null, '', url);
  setTimeout(() => $('.modal-close', modal)?.focus(), 40);
}

function closeQuickView(devolver = true) {
  const wrap = $('#quickView');
  if (wrap.hidden) return;
  wrap.hidden = true;
  if (!$('#cartDrawer').classList.contains('open')) document.body.classList.remove('no-scroll');
  const url = new URL(location.href); url.searchParams.delete('taller'); url.searchParams.delete('material'); window.history.replaceState(null, '', url);
  if (devolver && qvOpener && document.contains(qvOpener)) qvOpener.focus({ preventScroll: true });
}

function initQuickView() {
  const wrap = $('#quickView');
  wrap.addEventListener('click', e => { if (e.target.matches('.modal-backdrop')) closeQuickView(); });
  wrap.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeQuickView(); }
    if (e.key === 'Tab') atraparFoco(e, $('#qvModal'));
  });
  document.addEventListener('click', e => {
    if (e.target.closest('#qvModal')) return;
    const add = e.target.closest('[data-add]');
    if (add) { agregar(getItem(add.dataset.add)); return; }
    const open = e.target.closest('[data-open]');
    if (open) openQuickView(open.dataset.open, open);
  });
  const params = new URLSearchParams(location.search);
  const t = params.get('taller'), m = params.get('material');
  const item = getItem(t || m || '');
  if (item && ((t && item.type === 'course') || (m && item.type === 'product'))) openQuickView(item.id);
}

let drawerOpener = null;
function openCartDrawer() {
  const drawer = $('#cartDrawer');
  drawerOpener = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  $('#overlay').classList.add('open');
  document.body.classList.add('no-scroll');
  setTimeout(() => $('[data-close-drawer]', drawer)?.focus(), 60);
}
function closeCartDrawer() {
  const drawer = $('#cartDrawer');
  if (!drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  $('#overlay').classList.remove('open');
  if ($('#quickView').hidden) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) drawer.hidden = true; }, 420);
  if (drawerOpener && document.contains(drawerOpener)) drawerOpener.focus({ preventScroll: true });
}

function renderCarrito() {
  const lineas = Cart.get().filter(l => getItem(l.id));
  const body = $('#cartBody');
  const r = resumenCarrito(lineas);
  if (!lineas.length) {
    body.innerHTML = `<div class="cart-empty fold"><p class="cart-empty-title">Tu carrito está vacío</p><p>Mirá los cuadernillos y los talleres, o dejá que te recomendemos por dónde empezar.</p><a class="btn btn-ghost" href="#empezar" data-close-drawer>¿Por dónde empiezo?</a></div>`;
  } else {
    const grupo = tipo => lineas.filter(l => l.type === tipo).map(l => {
      const item = getItem(l.id);
      return `<div class="cart-line" data-key="${esc(l.key)}">
        <img src="${item.img}" width="1000" height="1250" alt="">
        <div><h3>${esc(item.nombre)}</h3><p class="cart-line-meta">${tipoLabel(item)} · ${esc(item.meta)}${item.pack ? ' · no entra en el 3x2' : ''}</p></div>
        <div class="cart-line-right"><span class="cart-line-price">${formatearPrecio(item.precio)}</span><button type="button" class="cart-remove" data-remove aria-label="Quitar ${esc(item.nombre)}">${ICON.trash}</button></div>
      </div>`;
    }).join('');
    const talleres = grupo('course'), materiales = grupo('product');
    body.innerHTML = (talleres ? `<p class="cart-group">Talleres</p>${talleres}` : '') + (materiales ? `<p class="cart-group">Materiales PDF</p>${materiales}` : '');
  }
  $('#cartFoot').hidden = !lineas.length;
  $('#cartSub').textContent = formatearPrecio(r.subtotal);
  $('#cartPromoRow').hidden = !r.promo;
  $('#cartPromo').textContent = '-' + formatearPrecio(r.promo);
  $('#cartTotal').textContent = formatearPrecio(r.total);
  const faltan = r.elegibles % 3 === 0 ? 0 : 3 - (r.elegibles % 3);
  $('#cartNote').textContent = r.elegibles && faltan ? `Todo es digital: descargás los PDF. Con ${faltan} ${faltan === 1 ? 'recurso suelto más' : 'recursos sueltos más'}, el de menor precio va sin cargo.` : 'Todo es digital: descargás los PDF, no hay envío.';
}

function initCarrito() {
  limpiarCarrito();
  updateCartBadge();
  $('#headerCart').addEventListener('click', openCartDrawer);
  const drawer = $('#cartDrawer');
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-drawer]')) { closeCartDrawer(); return; }
    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const key = rm.closest('.cart-line').dataset.key;
      const item = getItem(key.split(':')[1]);
      Cart.remove(key);
      showToast(`Sacaste ${item?.nombre || 'el recurso'} del carrito`);
    }
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
    if (e.key === 'Tab') atraparFoco(e, drawer);
  });
  $('#overlay').addEventListener('click', () => { closeCartDrawer(); cerrarFiltrosRef?.(); });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(); });
  $('#checkout').addEventListener('click', () => showToast('El pago y la descarga automática de los PDF se activan al pasar la web a producción.'));
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initWspLinks() {
  $$('[data-wsp-msg]').forEach(a => { a.href = wspLink([a.dataset.wspMsg]); });
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
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.48)}s`;
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
  revealIO = io;
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

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (reduceMotion || (r.bottom > 0 && r.top < window.innerHeight)) el.classList.add('in');
    else if (revealIO) revealIO.observe(el);
    else el.classList.add('in');
  });
}

initDestacados();
initCatalogo();
initQuiz();
initTabs();
initQuickView();
initCarrito();
initReveals();
initNav();
initFloats();
initWspLinks();
syncBotones();
