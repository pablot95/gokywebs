document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493416516632';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const lsGet = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

const ICO = {
  flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  video: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  pdf: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  vivo: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/>',
  reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  capas: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  pantalla: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  candado: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCirculo: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  chevronAbajo: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  carrito: '<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/>',
  calendario: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  libro: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>'
};
const ico = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n]}</svg>`;

const DOCENTE = { nombre: 'Virginia Rezzia', rol: 'Al frente de Instituto Renacer', foto: 'images/virginia-rezzia.webp' };

const CURSOS = [
  {
    id: 'constelaciones-familiares', tipo: 'formacion', titulo: 'Formación Profesional en Constelaciones Familiares',
    corto: 'Constelaciones familiares', portada: 'images/constelaciones-familiares.webp', alt: 'Manos ubicando figuras de madera sobre una manta, como en una constelación familiar',
    duracion: '12 meses', modalidad: ['grabada', 'vivo'], modalidadTxt: 'Clases grabadas y prácticas en vivo', clases: 24,
    cuota: 48000, cuotas: 12, etiqueta: 'Formación principal',
    descripcionCorta: 'Doce meses de formación práctica y vivencial para facilitar sesiones individuales y talleres grupales.',
    promesa: 'Aprendé a acompañar procesos de transformación de manera profunda, consciente y efectiva.',
    descripcion: 'Una formación práctica y vivencial de 12 meses para que adquieras las herramientas para facilitar sesiones individuales y talleres grupales, y acompañes a las personas a identificar y transformar patrones, conflictos y bloqueos de origen sistémico.',
    resultados: ['Reconocer las dinámicas ocultas que se repiten en una familia', 'Facilitar sesiones de constelaciones con la metodología Vincores', 'Integrar herramientas sistémicas a tu trabajo personal y profesional', 'Acompañar a otras personas en su propio proceso de sanación'],
    requisitos: ['No hace falta experiencia previa en terapias', 'Una compu o un celular con conexión a internet'],
    incluye: ['24 clases grabadas por módulos', 'El PDF de cada clase', 'Espacio de preguntas en cada clase', 'Prácticas vivenciales guiadas'],
    etiquetas: 'sistemica hellinger familia arbol genealogico figuras ordenes del amor',
    modulos: [
      { titulo: 'Introducción a la mirada sistémica', clases: [['Qué es una constelación familiar', '28:17', 'video', true], ['Los órdenes del amor: pertenencia, jerarquía y equilibrio', '34:05', 'video'], ['Tu primer ejercicio con figuras', '19:40', 'video']] },
      { titulo: 'El sistema familiar', clases: [['El árbol genealógico como mapa', '31:12', 'video'], ['Excluidos, secretos y lealtades invisibles', '36:48', 'video'], ['Dibujá tu genograma de tres generaciones', '22:30', 'video']] },
      { titulo: 'Facilitar una constelación', clases: [['La entrevista previa', '27:55', 'video'], ['El campo y los representantes', '39:10', 'video'], ['Constelar con figuras en una sesión individual', '33:24', 'video']] },
      { titulo: 'Práctica profesional', clases: [['Cómo se arma un taller grupal', '29:02', 'video'], ['Ética y cuidado de quien consulta', '24:16', 'video'], ['Práctica guiada en vivo', '1:30:00', 'vivo']] }
    ]
  },
  {
    id: 'tarot', tipo: 'formacion', titulo: 'Formación en Tarot',
    corto: 'Tarot', portada: 'images/tarot.webp', alt: 'Mazo de cartas de tarot desplegado sobre una mesa de madera junto a un cuaderno',
    duracion: '8 meses', modalidad: ['grabada', 'vivo'], modalidadTxt: 'Clases grabadas y lecturas en vivo', clases: 16,
    cuota: 42000, cuotas: 8, etiqueta: 'Formación',
    descripcionCorta: 'Los 78 arcanos como herramienta de autoconocimiento y de consulta, con mirada sistémica.',
    promesa: 'Usá el tarot como una herramienta de acompañamiento, no de adivinación.',
    descripcion: 'Una formación de ocho meses para conocer los arcanos mayores y menores, aprender a preguntar sin condicionar y llevar el tarot a una consulta con encuadre y cuidado.',
    resultados: ['Conocer el significado de los 78 arcanos', 'Hacer tiradas de tres y de cinco cartas', 'Preguntar sin condicionar la respuesta', 'Encuadrar una consulta de principio a fin'],
    requisitos: ['Un mazo de tarot (te recomendamos cuál en la primera clase)', 'Una compu o un celular con conexión a internet'],
    incluye: ['16 clases grabadas por módulos', 'Guía de significados en PDF', 'Espacio de preguntas en cada clase', 'Lecturas de práctica en vivo'],
    etiquetas: 'cartas arcanos mayores menores lectura tiradas autoconocimiento consulta',
    modulos: [
      { titulo: 'Los arcanos mayores', clases: [['El viaje del Loco: cómo está armado el mazo', '24:38', 'video', true], ['Arcanos mayores del I al XI', '41:20', 'video'], ['Arcanos mayores del XII al XXI', '43:05', 'video']] },
      { titulo: 'Los arcanos menores', clases: [['Palos y elementos', '29:47', 'video'], ['Números y figuras de la corte', '35:12', 'video'], ['Guía de significados', '18:30', 'video']] },
      { titulo: 'La lectura', clases: [['Tiradas de tres y de cinco cartas', '32:16', 'video'], ['Cómo preguntar sin condicionar', '26:40', 'video'], ['Lectura con mirada sistémica', '37:02', 'video']] },
      { titulo: 'La consulta', clases: [['El encuadre de una sesión', '25:18', 'video'], ['Devolución y cierre', '21:44', 'video'], ['Práctica de lecturas en vivo', '1:30:00', 'vivo']] }
    ]
  },
  {
    id: 'constelaciones-fluviales', tipo: 'formacion', titulo: 'Formación en Constelaciones Fluviales',
    corto: 'Constelaciones fluviales', portada: 'images/constelaciones-fluviales.webp', alt: 'Mano ubicando discos de madera que flotan en un recipiente de vidrio con agua',
    duracion: '4 meses', modalidad: ['grabada', 'vivo'], modalidadTxt: 'Clases grabadas y práctica en vivo', clases: 8,
    cuota: 45000, cuotas: 4, etiqueta: 'Formación',
    descripcionCorta: 'Constelar con agua y figuras que flotan: el movimiento muestra lo que el sistema necesita.',
    promesa: 'Sumá el agua a tu práctica: una forma suave de mirar el sistema en movimiento.',
    descripcion: 'Una formación de cuatro meses para trabajar con un recipiente con agua y figuras que flotan. Aprendés a preparar el espacio, a leer distancias, giros y encuentros, y a llevar la constelación fluvial a la consulta individual y online.',
    resultados: ['Preparar el recipiente, el agua y las figuras', 'Leer distancias, giros y encuentros entre las figuras', 'Saber cuándo intervenir y cuándo esperar', 'Hacer una constelación fluvial online, con la cámara'],
    requisitos: ['Conocer las bases de las constelaciones familiares', 'Un recipiente transparente y figuras que floten'],
    incluye: ['8 clases grabadas por módulos', 'El PDF de cada clase', 'Espacio de preguntas en cada clase', 'Práctica guiada en vivo'],
    etiquetas: 'agua recipiente flotan figuras movimiento fluvial',
    modulos: [
      { titulo: 'El agua como campo', clases: [['Qué es una constelación fluvial', '22:14', 'video', true], ['Recipiente, agua y figuras', '18:36', 'video'], ['Preparar el espacio', '16:50', 'video']] },
      { titulo: 'Leer el movimiento', clases: [['Distancias, giros y encuentros', '31:28', 'video'], ['Cuándo intervenir y cuándo esperar', '27:05', 'video'], ['Registro de una sesión', '15:42', 'video']] },
      { titulo: 'La sesión', clases: [['La constelación fluvial en una consulta individual', '29:33', 'video'], ['Constelar online con la cámara', '24:10', 'video'], ['Práctica guiada en vivo', '1:20:00', 'vivo']] }
    ]
  },
  {
    id: 'taller-arbol', tipo: 'taller', titulo: 'Taller: Tu árbol genealógico',
    corto: 'Tu árbol genealógico', portada: 'images/taller-arbol.webp', alt: 'Persona escribiendo en un cuaderno junto a una notebook',
    duracion: '3 encuentros', modalidad: ['vivo'], modalidadTxt: 'En vivo online', clases: 3, precio: 22000,
    descripcionCorta: 'Dibujá tu genograma de tres generaciones y mirá qué se repite.',
    promesa: 'Mirá tu historia familiar en un papel y encontrá lo que se repite.',
    descripcion: 'Un taller corto, en tres encuentros en vivo, para dibujar tu genograma de tres generaciones, ubicar fechas y nombres, y leer los patrones que se repiten en tu familia.',
    resultados: ['Dibujar tu genograma de tres generaciones', 'Ubicar fechas, nombres y repeticiones', 'Reconocer patrones que pasan de una generación a otra'],
    requisitos: ['Ganas de mirar tu historia familiar', 'Papel, lápices de colores y conexión a internet'],
    incluye: ['3 encuentros en vivo online', 'La grabación de cada encuentro', 'Plantilla del genograma en PDF'],
    etiquetas: 'arbol genealogico genograma familia generaciones patrones',
    modulos: [
      { titulo: 'Encuentro 1 · Las tres generaciones', clases: [['Cómo se dibuja un genograma', '45:00', 'vivo', true], ['Plantilla para completar', '10:00', 'video'], ['Puesta en común', '30:00', 'vivo']] },
      { titulo: 'Encuentro 2 · Lo que se repite', clases: [['Fechas, nombres y repeticiones', '40:00', 'vivo'], ['Leer patrones en el árbol', '35:00', 'vivo'], ['Puesta en común', '30:00', 'vivo']] },
      { titulo: 'Encuentro 3 · Tu lugar en el árbol', clases: [['Ordenar lo que apareció', '40:00', 'vivo'], ['Un ejercicio con figuras', '30:00', 'vivo'], ['Cierre del taller', '25:00', 'vivo']] }
    ]
  },
  {
    id: 'taller-ordenes', tipo: 'taller', titulo: 'Taller: Los órdenes del amor',
    corto: 'Los órdenes del amor', portada: 'images/taller-ordenes.webp', alt: 'Carpeta abierta con hojas en blanco y una lapicera sobre el escritorio',
    duracion: '3 módulos cortos', modalidad: ['grabada'], modalidadTxt: 'Clases grabadas', clases: 6, precio: 18000,
    descripcionCorta: 'Pertenencia, jerarquía y equilibrio: las tres leyes que ordenan los vínculos.',
    promesa: 'Entendé las tres leyes que ordenan los vínculos y miralas en tu propia familia.',
    descripcion: 'Un taller grabado para cursar a tu ritmo: las tres leyes de los vínculos (pertenencia, jerarquía y equilibrio entre dar y tomar) explicadas con ejemplos y con un ejercicio para cada una.',
    resultados: ['Reconocer las tres leyes en tus vínculos', 'Detectar dónde se rompe el equilibrio entre dar y tomar', 'Practicar un ejercicio para cada ley'],
    requisitos: ['Ninguno: es un buen primer paso', 'Una compu o un celular con conexión a internet'],
    incluye: ['6 clases grabadas', 'El PDF de cada clase', 'Espacio de preguntas en cada clase'],
    etiquetas: 'ordenes del amor pertenencia jerarquia equilibrio vinculos pareja',
    modulos: [
      { titulo: 'Pertenencia', clases: [['Todos tienen derecho a pertenecer', '21:15', 'video', true], ['Ejercicio: quién falta en tu familia', '12:40', 'video'], ['Apuntes del módulo', '08:00', 'video']] },
      { titulo: 'Jerarquía', clases: [['Los que llegaron antes', '19:50', 'video'], ['Ejercicio: el lugar de cada uno', '14:05', 'video'], ['Apuntes del módulo', '07:30', 'video']] },
      { titulo: 'Equilibrio', clases: [['Dar y tomar en la pareja y en la familia', '23:35', 'video'], ['Ejercicio: lo que debés y lo que te deben', '13:20', 'video'], ['Cierre del taller', '09:10', 'video']] }
    ]
  },
  {
    id: 'taller-vinculos', tipo: 'taller', titulo: 'Taller: Sanar el vínculo con mamá y papá',
    corto: 'El vínculo con mamá y papá', portada: 'images/taller-vinculos.webp', alt: 'Taza y planta junto a un cuaderno sobre un escritorio de madera iluminado por el sol',
    duracion: '3 encuentros', modalidad: ['vivo'], modalidadTxt: 'En vivo online', clases: 3, precio: 26000,
    descripcionCorta: 'Tomar a los padres tal como fueron, para poder seguir adelante con lo propio.',
    promesa: 'Mirá a tus padres con otros ojos y tomá la fuerza que viene de ellos.',
    descripcion: 'Tres encuentros en vivo para trabajar el vínculo con la madre y con el padre desde la mirada sistémica, con ejercicios guiados y un espacio para compartir lo que aparece.',
    resultados: ['Mirar el vínculo con cada uno de tus padres', 'Diferenciar lo que es tuyo de lo que cargás por ellos', 'Hacer un ejercicio de reconciliación guiado'],
    requisitos: ['Ganas de trabajar tu historia', 'Un espacio tranquilo y conexión a internet'],
    incluye: ['3 encuentros en vivo online', 'La grabación de cada encuentro', 'Ejercicios en PDF'],
    etiquetas: 'madre padre mama papa padres vinculos reconciliacion',
    modulos: [
      { titulo: 'Encuentro 1 · La madre', clases: [['El lugar de la madre en el sistema', '40:00', 'vivo', true], ['Ejercicio guiado', '25:00', 'vivo'], ['Puesta en común', '30:00', 'vivo']] },
      { titulo: 'Encuentro 2 · El padre', clases: [['El lugar del padre en el sistema', '40:00', 'vivo'], ['Ejercicio guiado', '25:00', 'vivo'], ['Puesta en común', '30:00', 'vivo']] },
      { titulo: 'Encuentro 3 · Tomar la vida', clases: [['Lo que es tuyo y lo que no', '35:00', 'vivo'], ['Ejercicio de reconciliación', '30:00', 'vivo'], ['Cierre del taller', '25:00', 'vivo']] }
    ]
  },
  {
    id: 'sesion-constelacion', tipo: 'sesion', titulo: 'Sesión individual de constelaciones',
    corto: 'Sesión de constelaciones', portada: 'images/sesion-online.webp', alt: 'Sesión online con figuras de madera frente a una notebook con cámara',
    duracion: '90 minutos', modalidad: ['individual'], modalidadTxt: 'Online por videollamada', clases: 1, precio: 35000,
    descripcionCorta: 'Una constelación con figuras, por videollamada, para mirar un tema puntual.',
    promesa: 'Un espacio a solas para mirar lo que hoy te pesa, con figuras y por videollamada.',
    descripcion: 'Una sesión individual por videollamada para cualquier persona que necesite sanar un tema puntual: un vínculo, una repetición, una pérdida. Se trabaja con figuras que se ubican frente a la cámara.',
    pasos: ['Nos escribís por WhatsApp y coordinamos el día', 'Charlamos unos minutos sobre el tema que querés mirar', 'Se ubican las figuras y se mira el movimiento', 'Cerramos con una imagen y un ejercicio para casa'],
    requisitos: ['Un lugar tranquilo para la videollamada', 'Compu o celular con cámara'],
    incluye: ['90 minutos por videollamada', 'Un ejercicio para seguir en casa'],
    etiquetas: 'individual sesion personal turno videollamada figuras sanar'
  },
  {
    id: 'sesion-tarot', tipo: 'sesion', titulo: 'Consulta de tarot',
    corto: 'Consulta de tarot', portada: 'images/consultorio.webp', alt: 'Consultorio luminoso con dos sillones y una mesa baja',
    duracion: '60 minutos', modalidad: ['individual'], modalidadTxt: 'Online por videollamada', clases: 1, precio: 25000,
    descripcionCorta: 'Una lectura para ordenar una pregunta y ver qué movimiento te toca hacer.',
    promesa: 'Una lectura para ordenar una pregunta, sin anticipar el futuro.',
    descripcion: 'Una consulta individual por videollamada: llegás con una pregunta, se hace una tirada y se conversa lo que muestran las cartas sobre tu situación y tus próximos pasos.',
    pasos: ['Nos escribís por WhatsApp y coordinamos el día', 'Llegás con una pregunta (o la armamos juntas)', 'Se hace la tirada y se lee carta por carta', 'Te llevás una foto de la tirada y lo conversado'],
    requisitos: ['Una pregunta concreta', 'Compu o celular con cámara'],
    incluye: ['60 minutos por videollamada', 'La foto de tu tirada'],
    etiquetas: 'tarot cartas lectura consulta individual turno'
  }
];
const TIPOS = { formacion: 'Formación', taller: 'Taller', sesion: 'Sesión individual' };
const getCurso = id => CURSOS.find(c => c.id === id);
const esFormacion = c => c?.tipo === 'formacion';
const precioTxt = c => c.tipo === 'formacion'
  ? `${formatearPrecio(c.cuota)} <small>por mes · ${c.cuotas} cuotas</small>`
  : `${formatearPrecio(c.precio)} <small>${c.tipo === 'sesion' ? 'por sesión' : 'pago único'}</small>`;

const Cart = {
  KEY: 'institutorenacer_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { lsSet(this.KEY, items); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(curso) {
    const items = this.get();
    if (!items.find(i => i.id === curso.id)) items.push({ id: curso.id, qty: 1 });
    this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getCurso(i.id)).length; }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
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

const SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';

function botonInscribir(c, clases = 'btn btn--primary btn--sm') {
  if (c.tipo === 'sesion') {
    return `<a class="${clases}" href="${wa(`Hola Instituto Renacer, quiero pedir un turno para: ${c.titulo}.`)}" target="_blank" rel="noopener">Pedir turno</a>`;
  }
  const dentro = Cart.has(c.id);
  return `<button class="${clases}" type="button" data-inscribir="${c.id}" aria-pressed="${dentro}">${dentro ? 'Ver inscripción' : 'Inscribirme'}</button>`;
}
function refrescarBotones() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const dentro = Cart.has(b.dataset.inscribir);
    b.setAttribute('aria-pressed', String(dentro));
    b.textContent = dentro ? 'Ver inscripción' : 'Inscribirme';
  });
}

function renderDestacadas() {
  const cont = document.getElementById('destacadas');
  if (!cont) return;
  cont.innerHTML = CURSOS.filter(esFormacion).map(c => `
    <div ${SUBIR}>
      <article class="form-card">
        <div class="form-card__foto"><img src="${c.portada}" alt="${esc(c.alt)}" width="1200" height="1200"></div>
        <div class="form-card__body">
          <p class="form-card__meta">${esc(c.etiqueta)} · ${esc(c.duracion)}</p>
          <h3 class="form-card__titulo">${esc(c.titulo)}</h3>
          <p class="form-card__desc">${esc(c.descripcionCorta)}</p>
        </div>
        <div class="form-card__pie">
          <p class="precio">${precioTxt(c)}</p>
          <div class="form-card__acciones">
            ${botonInscribir(c)}
            <button class="flecha-btn" type="button" data-ver="${c.id}" aria-label="Ver el programa de ${esc(c.titulo)}">${ico('flecha')}</button>
          </div>
        </div>
      </article>
    </div>`).join('');
}

const filtros = { tipo: 'todo', modalidad: '', q: '' };
function propHTML(c) {
  const meta = [
    `<span>${ico('reloj')}${esc(c.duracion)}</span>`,
    c.tipo === 'sesion' || /encuentros/.test(c.duracion) ? '' : `<span>${ico('video')}${c.clases} clases</span>`,
    `<span>${ico('pantalla')}${esc(c.modalidadTxt)}</span>`
  ].join('');
  return `
    <article class="prop" ${SUBIR}>
      <div class="prop-foto"><img src="${c.portada}" alt="${esc(c.alt)}" width="1200" height="1200"></div>
      <div class="prop-cuerpo">
        <p class="prop-tipo prop-tipo--${c.tipo}">${TIPOS[c.tipo]}</p>
        <h3 class="prop-titulo">${esc(c.titulo)}</h3>
        <p class="prop-meta">${meta}</p>
      </div>
      <div class="prop-lado">
        <p class="precio">${precioTxt(c)}</p>
        <div class="prop-acciones">
          <button class="btn btn--ghost btn--sm" type="button" data-ver="${c.id}">Ver detalle</button>
          ${botonInscribir(c)}
        </div>
      </div>
    </article>`;
}
function filtrarCursos() {
  const q = normalizar(filtros.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  const orden = { formacion: 0, taller: 1, sesion: 2 };
  return CURSOS.filter(c => {
    if (filtros.tipo !== 'todo' && c.tipo !== filtros.tipo) return false;
    if (filtros.modalidad && !c.modalidad.includes(filtros.modalidad)) return false;
    if (!palabras.length) return true;
    const texto = normalizar([c.titulo, TIPOS[c.tipo], c.modalidadTxt, c.descripcionCorta, c.descripcion, c.etiquetas, DOCENTE.nombre].join(' '));
    return palabras.every(p => texto.includes(p));
  }).sort((a, b) => orden[a.tipo] - orden[b.tipo]);
}
function renderCatalogo() {
  const lista = document.getElementById('cat-lista');
  if (!lista) return;
  const res = filtrarCursos();
  lista.innerHTML = res.map(propHTML).join('');
  const vacio = document.getElementById('cat-vacio');
  if (vacio) vacio.hidden = res.length > 0;
  const contador = document.getElementById('cat-contador');
  if (contador) contador.textContent = res.length === 1 ? '1 propuesta' : `${res.length} propuestas`;
  document.querySelectorAll('.chip[data-tipo]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.tipo === filtros.tipo)));
  revelarNuevos(lista);
}
function initCatalogo() {
  if (!document.getElementById('cat-lista')) return;
  renderCatalogo();
  document.querySelectorAll('.chip[data-tipo]').forEach(ch => ch.addEventListener('click', () => { filtros.tipo = ch.dataset.tipo; renderCatalogo(); }));
  const sel = document.getElementById('cat-modalidad');
  sel?.addEventListener('change', () => { filtros.modalidad = sel.value; renderCatalogo(); });
  const q = document.getElementById('cat-q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filtros.q = q.value; renderCatalogo(); }, 160); });
  document.getElementById('cat-limpiar')?.addEventListener('click', () => {
    filtros.tipo = 'todo'; filtros.modalidad = ''; filtros.q = '';
    if (q) q.value = '';
    if (sel) sel.value = '';
    renderCatalogo();
  });
  document.querySelectorAll('[data-filtro]').forEach(a => a.addEventListener('click', () => {
    filtros.tipo = a.dataset.filtro; filtros.modalidad = ''; filtros.q = '';
    if (q) q.value = '';
    if (sel) sel.value = '';
    renderCatalogo();
  }));
}

function moduloHTML(m, i, abierto) {
  return `
    <details class="modulo"${abierto ? ' open' : ''}>
      <summary><span class="modulo__num">${i + 1}</span><span class="modulo__nombre">${esc(m.titulo)}<small>${m.clases.length} clases</small></span>${ico('chevronAbajo')}</summary>
      <ul class="clases">${m.clases.map(cl => `<li class="clase-li">${ico(cl[2] === 'vivo' ? 'vivo' : 'video')}<span>${esc(cl[0])}${cl[3] ? '<span class="clase-li__prev">Clase abierta</span>' : ''}</span><span class="clase-li__dur">${cl[1]}</span></li>`).join('')}</ul>
    </details>`;
}
function modulosHTML(c, abierto = 0) {
  return c.modulos.map((m, i) => moduloHTML(m, i, i === abierto)).join('');
}

function renderEstrella() {
  const prog = document.getElementById('estrella-programa');
  if (!prog) return;
  const c = getCurso('constelaciones-familiares');
  const desc = document.getElementById('estrella-desc');
  if (desc) desc.textContent = c.descripcion;
  const res = document.getElementById('estrella-resultados');
  if (res) res.innerHTML = c.resultados.map(r => `<li ${SUBIR}>${ico('checkCirculo')}<span>${esc(r)}</span></li>`).join('');
  const precio = document.getElementById('estrella-precio');
  if (precio) precio.innerHTML = precioTxt(c);
  const acc = document.getElementById('estrella-acciones');
  if (acc) acc.innerHTML = `<button class="btn btn--ghost btn--sm" type="button" data-aula="${c.id}">Verla en el aula</button>${botonInscribir(c)}`;
  prog.insertAdjacentHTML('beforeend', c.modulos.map((m, i) => `<div ${SUBIR}>${moduloHTML(m, i, i === 0)}</div>`).join(''));
}

let ultimoFoco = null;
function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function bloquearScroll(si) { document.body.classList.toggle('no-scroll', si); }

function modalHTML(c) {
  const datos = c.tipo === 'formacion'
    ? [['Duración', c.duracion], ['Modalidad', c.modalidadTxt], ['Clases', `${c.clases} clases en ${c.modulos.length} módulos`], ['Cuota', `${formatearPrecio(c.cuota)} por mes · ${c.cuotas} cuotas`]]
    : c.tipo === 'taller'
      ? [['Duración', c.duracion], ['Modalidad', c.modalidadTxt], ['Acceso', 'Con tu usuario, desde el aula'], ['Precio', `${formatearPrecio(c.precio)} · pago único`]]
      : [['Duración', c.duracion], ['Modalidad', c.modalidadTxt], ['Turno', 'Se coordina por WhatsApp'], ['Precio', `${formatearPrecio(c.precio)} por sesión`]];
  const ctas = c.tipo === 'sesion'
    ? botonInscribir(c, 'btn btn--primary')
    : `<button class="btn btn--primary" type="button" data-inscribir-ya="${c.id}">${Cart.has(c.id) ? 'Ver mi inscripción' : 'Inscribirme'}</button>${c.tipo === 'formacion' ? `<button class="btn btn--ghost" type="button" data-aula="${c.id}">Verla en el aula de ejemplo</button>` : ''}`;
  const programa = c.modulos
    ? `<div class="modal__bloque"><h3>Programa</h3><div class="programa">${modulosHTML(c, 0)}</div></div>`
    : `<div class="modal__bloque"><h3>Cómo es la sesión</h3><ol class="lista-simple">${c.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol></div>`;
  return `
    <div class="modal__grid">
      <div class="modal__lado">
        <div class="modal__foto"><img src="${c.portada}" alt="${esc(c.alt)}" width="1200" height="1200"></div>
        <div class="modal__docente">
          <div class="modal__docente-foto"><img src="${DOCENTE.foto}" alt="${esc(DOCENTE.nombre)}" width="960" height="1200"></div>
          <div><strong>${esc(DOCENTE.nombre)}</strong><p>${esc(DOCENTE.rol)}</p></div>
        </div>
      </div>
      <div class="modal__info">
        <p class="prop-tipo prop-tipo--${c.tipo}">${TIPOS[c.tipo]} · ${esc(c.duracion)}</p>
        <h2>${esc(c.titulo)}</h2>
        <p class="modal__promesa">${esc(c.promesa)}</p>
        <div class="ficha-datos">${datos.map(d => `<div><strong>${esc(d[1])}</strong>${esc(d[0])}</div>`).join('')}</div>
        <div class="modal__ctas">${ctas}</div>
        <div class="modal__bloque"><h3>${c.tipo === 'sesion' ? 'Sobre la sesión' : c.tipo === 'taller' ? 'Sobre el taller' : 'Sobre la formación'}</h3><p>${esc(c.descripcion)}</p></div>
        ${c.resultados ? `<div class="modal__bloque"><h3>Lo que vas a aprender</h3><ul class="lista-check">${c.resultados.map(r => `<li>${ico('checkCirculo')}<span>${esc(r)}</span></li>`).join('')}</ul></div>` : ''}
        ${programa}
        <div class="modal__bloque"><h3>Qué necesitás</h3><ul class="lista-simple">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
        <div class="modal__bloque"><h3>Incluye</h3><ul class="lista-simple">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      </div>
    </div>`;
}
function abrirModal(id) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  if (!c || !modal) return;
  ultimoFoco = document.activeElement;
  document.getElementById('modal-contenido').innerHTML = modalHTML(c);
  modal.hidden = false;
  modal.querySelector('.modal__caja').scrollTop = 0;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('abierto')));
  setTimeout(() => modal.querySelector('.modal__cerrar')?.focus(), 60);
}
function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('abierto');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  if (document.getElementById('drawer')?.hidden !== false) bloquearScroll(false);
  if (devolverFoco) ultimoFoco?.focus?.({ preventScroll: true });
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body || !foot) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = `<div class="drawer__vacio">${ico('libro')}<p>Todavía no elegiste ninguna formación ni taller.</p><a class="btn btn--primary btn--sm" href="#propuesta" data-cerrar-drawer>Ver la propuesta</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(c => `
    <div class="drawer__item">
      <div class="drawer__item-foto"><img src="${c.portada}" alt="" width="1200" height="1200"></div>
      <div><strong>${esc(c.titulo)}</strong><span>${c.tipo === 'formacion' ? `${formatearPrecio(c.cuota)} por mes · ${c.cuotas} cuotas` : `${formatearPrecio(c.precio)} · pago único`}</span></div>
      <button class="quitar-btn" type="button" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}">${ico('x')}</button>
    </div>`).join('');
  const mensual = items.filter(esFormacion).reduce((s, c) => s + c.cuota, 0);
  const hoy = items.reduce((s, c) => s + (esFormacion(c) ? c.cuota : c.precio), 0);
  foot.innerHTML = `
    <p class="drawer__linea drawer__linea--total"><span>Hoy abonás</span><span>${formatearPrecio(hoy)}</span></p>
    ${mensual ? `<p class="drawer__linea"><span>Después, por mes</span><span>${formatearPrecio(mensual)}</span></p>` : ''}
    <p class="nota">${mensual ? 'Hoy pagás la primera cuota de cada formación y los talleres completos. ' : ''}Al confirmar se crea tu usuario para entrar al aula.</p>
    <button class="btn btn--primary btn--block" type="button" id="finalizar">Finalizar inscripción</button>`;
  document.getElementById('finalizar').addEventListener('click', e => {
    const b = e.currentTarget;
    b.disabled = true; b.textContent = 'Procesando…';
    setTimeout(() => {
      b.disabled = false; b.textContent = 'Finalizar inscripción';
      showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
    }, 900);
  });
}
function abrirDrawer() {
  const d = document.getElementById('drawer');
  if (!d) return;
  if (document.getElementById('modal')?.hidden === false) cerrarModal(false);
  else ultimoFoco = document.activeElement;
  renderDrawer();
  d.hidden = false;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  setTimeout(() => d.querySelector('[data-cerrar-drawer]')?.focus(), 60);
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  bloquearScroll(false);
  ultimoFoco?.focus?.({ preventScroll: true });
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

const AULA_KEY = 'institutorenacer_aula';
const PREG_KEY = 'institutorenacer_preguntas';
const aula = Object.assign({ usuario: '', formacion: 'constelaciones-familiares', clase: '', hechas: [] }, lsGet(AULA_KEY, {}));
if (!getCurso(aula.formacion) || !esFormacion(getCurso(aula.formacion))) aula.formacion = 'constelaciones-familiares';
const guardarAula = () => lsSet(AULA_KEY, { usuario: aula.usuario, formacion: aula.formacion, clase: aula.clase, hechas: aula.hechas });
const EJEMPLOS = {
  'constelaciones-familiares-m0-c0': [['Alumna', '¿Puedo practicar con figuras de madera en casa antes de hacerlo con otra persona?', 0], ['Equipo docente', 'Sí. En el PDF de esta clase tenés un ejercicio para hacerlo con tu propio sistema familiar.', 1]],
  'tarot-m0-c0': [['Alumna', '¿Sirve cualquier mazo o tiene que ser uno en particular?', 0], ['Equipo docente', 'Para seguir las clases conviene un mazo de 78 cartas. En el PDF te dejamos cuál usamos.', 1]],
  'constelaciones-fluviales-m0-c0': [['Alumna', '¿El recipiente tiene que ser de vidrio?', 0], ['Equipo docente', 'Conviene que sea transparente, así se ve el movimiento desde arriba y de costado.', 1]]
};
function clasesDe(c) {
  const out = [];
  c.modulos.forEach((m, i) => m.clases.forEach((cl, j) => out.push({ id: `${c.id}-m${i}-c${j}`, mod: i, n: j, titulo: cl[0], dur: cl[1], tipo: cl[2], abierta: !!cl[3], modulo: m.titulo })));
  return out;
}
const logueado = () => !!aula.usuario;
function claseActual() {
  const c = getCurso(aula.formacion);
  const lista = clasesDe(c);
  return lista.find(x => x.id === aula.clase) || lista[0];
}
function resaltarIngreso(enfocar = true) {
  const panel = document.getElementById('panel-ingreso');
  if (!panel) return;
  panel.classList.add('resaltar');
  setTimeout(() => panel.classList.remove('resaltar'), 1800);
  if (enfocar && !logueado()) {
    panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => document.getElementById('login-usuario')?.focus({ preventScroll: true }), 450);
  }
}
function renderModulosAula() {
  const cont = document.getElementById('aula-modulos');
  if (!cont) return;
  const c = getCurso(aula.formacion);
  const actual = claseActual();
  const lista = clasesDe(c);
  cont.innerHTML = c.modulos.map((m, i) => `
    <details class="aula-mod"${i === actual.mod ? ' open' : ''}>
      <summary><span class="modulo__num">${i + 1}</span><span>${esc(m.titulo)}</span>${ico('chevron')}</summary>
      <div class="aula-clases">${lista.filter(x => x.mod === i).map(x => {
        const libre = logueado() || x.abierta;
        const hecha = aula.hechas.includes(x.id);
        const estado = hecha ? ico('checkCirculo', 'ico-estado') : libre ? ico(x.tipo === 'vivo' ? 'vivo' : 'video', 'ico-estado') : ico('candado', 'ico-estado');
        return `<button class="aula-clase${libre ? '' : ' is-lock'}${hecha ? ' is-hecha' : ''}" type="button" data-clase="${x.id}"${x.id === actual.id ? ' aria-current="true"' : ''}>${estado}<span>${esc(x.titulo)}</span><span class="clase-li__dur">${x.dur}</span></button>`;
      }).join('')}</div>
    </details>`).join('');
  const total = lista.length;
  const hechas = lista.filter(x => aula.hechas.includes(x.id)).length;
  const pct = Math.round((hechas / total) * 100);
  const av = document.getElementById('aula-avance');
  if (av) av.textContent = `${pct} % completado`;
  const barra = document.getElementById('aula-barra');
  if (barra) barra.style.width = `${pct}%`;
}
function renderClase() {
  const x = claseActual();
  const libre = logueado() || x.abierta;
  const ub = document.getElementById('clase-ubic');
  if (ub) ub.textContent = `Módulo ${x.mod + 1} · Clase ${x.n + 1}${x.abierta ? ' · clase abierta' : ''}`;
  const ti = document.getElementById('clase-titulo');
  if (ti) ti.textContent = x.titulo;
  const lock = document.getElementById('player-lock');
  if (lock) lock.hidden = libre;
  const play = document.getElementById('player-play');
  if (play) play.hidden = !libre;
  const t = document.getElementById('player-t');
  if (t) t.textContent = `${x.dur.length > 5 ? '0:00:00' : '00:00'} / ${x.dur}`;
  const pdf = document.getElementById('btn-pdf');
  if (pdf) pdf.setAttribute('aria-disabled', String(!libre));
  const comp = document.getElementById('btn-completar');
  if (comp) comp.innerHTML = aula.hechas.includes(x.id) ? `${ico('checkCirculo')}Clase completada` : `Completar y continuar${ico('flecha')}`;
  renderChat();
}
function renderChat() {
  const hilo = document.getElementById('chat-hilo');
  if (!hilo) return;
  const x = claseActual();
  const propias = lsGet(PREG_KEY, {})[x.id] || [];
  const ej = EJEMPLOS[x.id] || [];
  const msgs = ej.map(m => `<div class="msg${m[2] ? ' msg--docente' : ''}"><small>${esc(m[0])} · ejemplo</small>${esc(m[1])}</div>`)
    .concat(propias.map(m => `<div class="msg msg--yo"><small>${esc(aula.usuario || 'Vos')} · ${esc(m.hora)}</small>${esc(m.t)}</div>`));
  hilo.innerHTML = msgs.length ? msgs.join('') : '<p class="chat__vacio">Todavía no hay preguntas en esta clase. Dejá la primera.</p>';
  hilo.scrollTop = hilo.scrollHeight;
  const input = document.getElementById('chat-input');
  if (input) input.placeholder = logueado() ? 'Escribí tu consulta' : 'Ingresá con tu usuario para preguntar';
}
function mesTxt(offset) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleDateString('es-AR', { month: 'long' });
}
function renderPagos() {
  const cuerpo = document.getElementById('pagos-cuerpo');
  if (!cuerpo) return;
  const c = getCurso(aula.formacion);
  if (!logueado()) {
    cuerpo.innerHTML = `
      <div class="cuota-dato"><small>Cuota mensual · ${esc(c.corto)}</small><strong>${formatearPrecio(c.cuota)}</strong><small>${c.cuotas} cuotas, una por mes</small></div>
      <a class="btn btn--primary btn--block" href="${wa(`Hola Instituto Renacer, quiero consultar la inscripción a: ${c.titulo}.`)}" target="_blank" rel="noopener">Consultar inscripción</a>
      <p class="nota">Cuando ingreses, acá ves tus cuotas pagadas y la próxima a vencer.</p>`;
    return;
  }
  const filas = [0, 1, 2, 3].map(k => {
    const estado = k === 0 ? ['Pagada', 'ok'] : k === 1 ? [`Vence el 10`, 'prox'] : ['Pendiente', 'fut'];
    return `<div class="cuota"><span>Cuota ${k + 1} de ${c.cuotas} · ${mesTxt(k)}</span><span class="cuota__estado cuota__estado--${estado[1]}">${estado[0]}</span></div>`;
  }).join('');
  cuerpo.innerHTML = `
    <div class="cuota-dato"><small>${esc(c.corto)} · ${formatearPrecio(c.cuota)} por mes</small></div>
    <div class="cuotas">${filas}</div>
    <button class="btn btn--primary btn--block" type="button" id="pagar-cuota">Pagar la cuota de ${mesTxt(1)}</button>`;
  document.getElementById('pagar-cuota').addEventListener('click', () => showToast('El cobro de las cuotas se activa al llevar la plataforma a producción.'));
}
function renderIngreso() {
  const form = document.getElementById('login-form');
  const alumno = document.getElementById('alumno');
  if (!form || !alumno) return;
  form.hidden = logueado();
  alumno.hidden = !logueado();
  if (logueado()) {
    document.getElementById('alumno-nombre').textContent = aula.usuario;
    document.getElementById('alumno-formacion').textContent = getCurso(aula.formacion).titulo;
  }
}
function renderAula() {
  renderModulosAula();
  renderClase();
  renderIngreso();
  renderPagos();
}
function irAClase(id) {
  const c = getCurso(aula.formacion);
  const x = clasesDe(c).find(y => y.id === id);
  if (!x) return;
  aula.clase = x.id;
  guardarAula();
  renderModulosAula();
  renderClase();
  if (!logueado() && !x.abierta) { showToast('Esa clase se abre cuando ingresás con tu usuario.'); resaltarIngreso(false); }
}
function pdfLatin(s) {
  const mapa = { 8212: 45, 8211: 45, 8220: 34, 8221: 34, 8216: 39, 8217: 39, 8230: 46 };
  const out = [];
  for (const ch of s) {
    let c = ch.codePointAt(0);
    if (c > 255) c = mapa[c] ?? 63;
    if (c === 40 || c === 41 || c === 92) out.push(92);
    out.push(c);
  }
  return out;
}
function partirLinea(txt, max) {
  const palabras = txt.split(' ');
  const lineas = [];
  let l = '';
  palabras.forEach(p => {
    if ((l + ' ' + p).trim().length > max) { lineas.push(l.trim()); l = p; } else l += ' ' + p;
  });
  if (l.trim()) lineas.push(l.trim());
  return lineas;
}
function crearPDF(bloques) {
  const ascii = s => [...s].map(ch => ch.charCodeAt(0));
  let y = 790;
  const ops = [];
  bloques.forEach(b => {
    if (b.regla) { ops.push(...ascii(`0.66 0.52 0.26 RG 0.8 w 56 ${y} m 539 ${y} l S\n`)); y -= b.espacio || 22; return; }
    const lineas = partirLinea(b.t, b.max || 88);
    lineas.forEach(li => {
      ops.push(...ascii(`BT /${b.bold ? 'F2' : 'F1'} ${b.size} Tf ${b.color || '0.11 0.16 0.25'} rg 56 ${y} Td (`), ...pdfLatin(li), ...ascii(') Tj ET\n'));
      y -= Math.round(b.size * 1.45);
    });
    y -= b.despues ?? 8;
  });
  const objetos = [
    ascii('<< /Type /Catalog /Pages 2 0 R >>'),
    ascii('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    ascii('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>'),
    ascii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),
    ascii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),
    [...ascii(`<< /Length ${ops.length} >>\nstream\n`), ...ops, ...ascii('\nendstream')]
  ];
  const bytes = ascii('%PDF-1.4\n%âãÏÓ\n');
  const offsets = [];
  objetos.forEach((o, i) => { offsets.push(bytes.length); bytes.push(...ascii(`${i + 1} 0 obj\n`), ...o, ...ascii('\nendobj\n')); });
  const xref = bytes.length;
  bytes.push(...ascii(`xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`));
  offsets.forEach(o => bytes.push(...ascii(`${String(o).padStart(10, '0')} 00000 n \n`)));
  bytes.push(...ascii(`trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));
  return new window.Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
}
function descargarPDF() {
  const x = claseActual();
  if (!logueado() && !x.abierta) { showToast('El PDF de esta clase se descarga cuando ingresás con tu usuario.'); resaltarIngreso(false); return; }
  const c = getCurso(aula.formacion);
  const blob = crearPDF([
    { t: 'INSTITUTO RENACER · ESCUELA ONLINE', size: 9, bold: true, color: '0.52 0.41 0.18', despues: 14 },
    { t: c.titulo, size: 18, bold: true, max: 50, despues: 6 },
    { t: `Módulo ${x.mod + 1} · ${x.modulo}`, size: 11, color: '0.34 0.38 0.48', despues: 10 },
    { t: `Clase ${x.n + 1}: ${x.titulo}`, size: 14, bold: true, max: 64, despues: 14 },
    { regla: true, espacio: 26 },
    { t: 'Apuntes de la clase (material de muestra)', size: 11, bold: true, despues: 6 },
    { t: 'Este archivo muestra cómo se descarga el material de cada clase. En la plataforma, el equipo docente sube su propio PDF desde el panel y cada alumno lo baja desde el aula, con su usuario y contraseña.', size: 11, despues: 12 },
    { t: 'Para practicar después de la clase', size: 11, bold: true, despues: 6 },
    { t: '1. Volvé a mirar los minutos de la clase que más te movilizaron y anotá qué apareció.', size: 11, despues: 2 },
    { t: '2. Hacé el ejercicio con tu propio sistema antes de llevarlo a una consulta.', size: 11, despues: 2 },
    { t: '3. Si algo no quedó claro, escribilo en «Preguntas de la clase»: la respuesta queda ahí para todo el grupo.', size: 11, despues: 18 },
    { regla: true, espacio: 20 },
    { t: 'Material de muestra de la demo de Instituto Renacer. Contenido a confirmar.', size: 9, color: '0.34 0.38 0.48' }
  ]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `renacer-${c.id}-modulo-${x.mod + 1}-clase-${x.n + 1}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  showToast('Descargaste el PDF de la clase.');
}
function initAula() {
  const sel = document.getElementById('aula-formacion');
  if (!sel) return;
  sel.innerHTML = CURSOS.filter(esFormacion).map(c => `<option value="${c.id}">${esc(c.corto)}</option>`).join('');
  sel.value = aula.formacion;
  sel.addEventListener('change', () => { aula.formacion = sel.value; aula.clase = ''; guardarAula(); renderAula(); });
  document.getElementById('aula-modulos').addEventListener('click', e => {
    const b = e.target.closest('[data-clase]');
    if (b) irAClase(b.dataset.clase);
  });
  document.getElementById('player-play')?.addEventListener('click', () => showToast('Acá se reproduce el video de la clase. En la plataforma lo sube el equipo docente desde el panel.'));
  document.getElementById('player-lock')?.addEventListener('click', () => resaltarIngreso());
  document.getElementById('btn-pdf')?.addEventListener('click', descargarPDF);
  document.getElementById('btn-completar')?.addEventListener('click', () => {
    if (!logueado()) { showToast('Ingresá con tu usuario para guardar tu avance.'); resaltarIngreso(); return; }
    const c = getCurso(aula.formacion);
    const lista = clasesDe(c);
    const x = claseActual();
    if (!aula.hechas.includes(x.id)) aula.hechas.push(x.id);
    const sig = lista[lista.findIndex(y => y.id === x.id) + 1];
    if (sig) { aula.clase = sig.id; showToast('Clase completada. Seguís con la próxima.'); }
    else showToast('Completaste todas las clases de la formación.');
    guardarAula();
    renderModulosAula();
    renderClase();
  });
  document.getElementById('chat-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (!logueado()) { showToast('Ingresá con tu usuario para dejar tu pregunta.'); resaltarIngreso(); return; }
    const t = input.value.trim();
    if (t.length < 3) { showToast('Escribí tu pregunta antes de enviarla.'); input.focus(); return; }
    const todas = lsGet(PREG_KEY, {});
    const x = claseActual();
    todas[x.id] = (todas[x.id] || []).concat({ t, hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) });
    lsSet(PREG_KEY, todas);
    input.value = '';
    renderChat();
    showToast('Pregunta enviada. En la plataforma, el equipo docente te responde acá.');
  });
  const form = document.getElementById('login-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-usuario');
    const p = document.getElementById('login-clave');
    let ok = true;
    [[u, u.value.trim().length >= 2, 'err-usuario'], [p, p.value.length >= 4, 'err-clave']].forEach(([el, valido, err]) => {
      el.setAttribute('aria-invalid', String(!valido));
      document.getElementById(err).hidden = valido;
      if (!valido && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Ingresando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Ingresar';
      aula.usuario = u.value.trim().slice(0, 24);
      p.value = '';
      guardarAula();
      renderAula();
      showToast(`¡Hola, ${aula.usuario}! Ya tenés abiertos todos los módulos.`);
    }, 800);
  });
  document.getElementById('logout')?.addEventListener('click', () => {
    aula.usuario = '';
    guardarAula();
    renderAula();
    showToast('Cerraste la sesión del aula.');
  });
  renderAula();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver); return; }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      if (Cart.has(c.id)) { abrirDrawer(); return; }
      Cart.add(c);
      showToast(`Sumaste «${c.corto}» a tu inscripción.`);
      return;
    }
    const insYa = e.target.closest('[data-inscribir-ya]');
    if (insYa) {
      const c = getCurso(insYa.dataset.inscribirYa);
      if (c && !Cart.has(c.id)) Cart.add(c);
      abrirDrawer();
      return;
    }
    const aulaBtn = e.target.closest('[data-aula]');
    if (aulaBtn) {
      const id = aulaBtn.dataset.aula;
      cerrarModal(false);
      aula.formacion = id; aula.clase = ''; guardarAula();
      const sel = document.getElementById('aula-formacion');
      if (sel) sel.value = id;
      renderAula();
      document.getElementById('aula')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); renderDrawer(); return; }
    if (e.target.closest('[data-cerrar-modal]')) { cerrarModal(); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (e.target.closest('[data-abrir-carrito]')) { abrirDrawer(); return; }
    const acceso = e.target.closest('[data-acceso]');
    if (acceso) {
      e.preventDefault();
      if (logueado()) {
        document.getElementById('aula')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        showToast(`Ya estás en el aula, ${aula.usuario}.`);
      } else {
        resaltarIngreso();
      }
    }
  });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modal');
    const drawer = document.getElementById('drawer');
    if (modal && !modal.hidden) { if (e.key === 'Escape') cerrarModal(); else trampaFoco(modal, e); return; }
    if (drawer && !drawer.hidden) { if (e.key === 'Escape') cerrarDrawer(); else trampaFoco(drawer, e); }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarBotones(); });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirModal(id);
}

renderDestacadas();
renderEstrella();
initCatalogo();
initAula();
initReveals();
initNav();
initFloats();
initModelBarScroll();
initAcciones();
updateCartBadge();
abrirDesdeURL();
