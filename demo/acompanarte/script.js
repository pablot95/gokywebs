const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491159371427';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const AREAS = {
  dp: 'Desarrollo personal',
  ps: 'Psicología Social',
  at: 'Acompañamiento Terapéutico',
  num: 'Numerología'
};
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'A coordinar'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const COORDINA = 'Psicóloga Social, Acompañante Terapéutica y Auxiliar en Fonoaudiología, creadora de ACOMPAÑAR(TE).';

const CURSOS = [
  {
    id: 'p1', slug: 'vinculos-que-cuidan', titulo: 'Vínculos que cuidan', area: 'dp', formato: 'Taller',
    modalidad: 'Presencial', dia: 'Martes', hora: '18:30 a 20:00', fecha: '2026-11-03', inicio: 'martes 3 de noviembre',
    encuentros: 4, duracion: '1 h 30 min por encuentro', precio: 32000, destacado: true,
    portada: 'taller-vinculos.webp', alt: 'Grupo sentado en ronda conversando en un taller',
    corta: 'Cómo nos relacionamos con quienes queremos, qué esperamos y qué podemos cambiar.',
    completa: 'Un taller para mirar los vínculos de todos los días —familia, pareja, amistades, trabajo— y pensar cómo nos relacionamos. Con actividades en grupo, ejercicios y momentos de reflexión, vamos a reconocer qué nos hace bien, qué se repite y qué herramientas podemos poner en práctica.',
    resultados: ['Reconocer cómo te vinculás y qué esperás de los otros', 'Herramientas para poner límites y pedir lo que necesitás', 'Un espacio de escucha para compartir con otras personas'],
    paraQuien: 'Para cualquier persona que quiera pensar sus vínculos. No hace falta experiencia previa.',
    incluye: ['Material de lectura breve por encuentro', 'Ejercicios para seguir en casa'],
    modulos: [
      { titulo: '¿Cómo nos vinculamos?', items: ['Presentación y encuadre del grupo', 'Mapa de mis vínculos', 'Puesta en común'] },
      { titulo: 'Lo que esperamos de los otros', items: ['Expectativas y demandas', 'Ejercicio en parejas', 'Reflexión grupal'] },
      { titulo: 'Límites que cuidan', items: ['Decir que no sin romper el vínculo', 'Situaciones de la vida cotidiana', 'Ensayo de respuestas'] },
      { titulo: 'Lo que me llevo', items: ['Recorrido por lo trabajado', 'Herramientas para el día a día', 'Cierre del grupo'] }
    ]
  },
  {
    id: 'p2', slug: 'emociones-en-palabras', titulo: 'Emociones en palabras', area: 'dp', formato: 'Taller',
    modalidad: 'Presencial', dia: 'Jueves', hora: '10:00 a 11:30', fecha: '2026-11-05', inicio: 'jueves 5 de noviembre',
    encuentros: 4, duracion: '1 h 30 min por encuentro', precio: 32000,
    portada: 'taller-emociones.webp', alt: 'Mesa de taller con tarjetas de colores, cuadernos y lápices',
    corta: 'Reconocer lo que sentimos, ponerle nombre y encontrar formas de expresarlo.',
    completa: 'Muchas veces sentimos algo y no sabemos bien qué es. En este taller trabajamos con tarjetas, escritura y actividades grupales para identificar las emociones, entender qué nos dicen y encontrar formas de expresarlas sin que nos desborden.',
    resultados: ['Más palabras para nombrar lo que sentís', 'Recursos para registrar las emociones en el día a día', 'Formas de expresarlas en tus vínculos'],
    paraQuien: 'Para quienes quieran conocer mejor sus emociones. No hace falta experiencia previa.',
    incluye: ['Tarjetas y consignas del taller', 'Registro emocional para usar en casa'],
    modulos: [
      { titulo: 'Lo que sentimos', items: ['Emociones básicas y emociones mezcladas', 'Actividad con tarjetas', 'Registro personal'] },
      { titulo: 'Lo que nos dicen', items: ['Para qué sirve cada emoción', 'Situaciones cotidianas', 'Trabajo en grupos chicos'] },
      { titulo: 'Cuando desbordan', items: ['Enojo, miedo y angustia', 'Recursos para frenar y respirar', 'Puesta en común'] },
      { titulo: 'Expresarlas', items: ['Decir lo que siento', 'Ejercicio en parejas', 'Cierre y recursos para seguir'] }
    ]
  },
  {
    id: 'p3', slug: 'escribirse-para-conocerse', titulo: 'Escribirse para conocerse', area: 'dp', formato: 'Taller',
    modalidad: 'Presencial', dia: 'Sábado', hora: '10:30 a 12:30', fecha: '2026-11-07', inicio: 'sábado 7 de noviembre',
    encuentros: 3, duracion: '2 h por encuentro', precio: 27000,
    portada: 'taller-escritura.webp', alt: 'Manos escribiendo en un cuaderno sobre una mesa de madera',
    corta: 'La escritura como herramienta de autoconocimiento, sin necesidad de saber escribir.',
    completa: 'Un taller de escritura reflexiva: consignas simples para escribir sobre tu historia, tus días y lo que te pasa. No se trata de escribir bien, sino de usar la palabra para ordenar, mirar con distancia y conocerte un poco más.',
    resultados: ['Un cuaderno propio con lo trabajado', 'Consignas para seguir escribiendo en casa', 'Otra forma de mirar lo que te pasa'],
    paraQuien: 'Para quienes tengan ganas de escribir, aunque nunca lo hayan hecho.',
    incluye: ['Consignas impresas para llevarte', 'Lecturas breves para inspirarte'],
    modulos: [
      { titulo: 'Mi historia en palabras', items: ['Consignas de arranque', 'Escritura libre', 'Lectura voluntaria'] },
      { titulo: 'Lo cotidiano', items: ['Escribir un día', 'Detalles que dicen mucho', 'Intercambio en grupo'] },
      { titulo: 'Cartas que no se envían', items: ['Escribirle a alguien', 'Escribirte a vos', 'Cierre del taller'] }
    ]
  },
  {
    id: 'p4', slug: 'introduccion-psicologia-social', titulo: 'Introducción a la Psicología Social', area: 'ps', formato: 'Seminario',
    modalidad: 'Online en vivo', dia: 'Miércoles', hora: '19:00 a 20:30', fecha: '2026-11-04', inicio: 'miércoles 4 de noviembre',
    encuentros: 6, duracion: '1 h 30 min por encuentro', precio: 42000, destacado: true,
    portada: 'seminario-online.webp', alt: 'Persona tomando notas frente a una clase por videollamada',
    corta: 'Conceptos centrales para entender a las personas en sus grupos, vínculos y contextos.',
    completa: 'Un recorrido por las ideas que sostienen la Psicología Social: el sujeto como ser en relación, los vínculos, los grupos y la vida cotidiana. Con explicaciones claras, ejemplos y espacio para preguntas, por videollamada y en vivo.',
    resultados: ['Los conceptos básicos de la Psicología Social', 'Una mirada nueva sobre situaciones de todos los días', 'Bibliografía para seguir profundizando'],
    paraQuien: 'Para quienes se acercan por primera vez o piensan estudiar Psicología Social. Abierto a todo público.',
    incluye: ['Material de lectura en PDF', 'Link de la sala al inscribirte'],
    requisitos: 'Conexión a internet y una computadora o celular.',
    modulos: [
      { titulo: 'Punto de partida', rango: 'Encuentros 1 y 2', items: ['Qué estudia la Psicología Social', 'El sujeto como ser en relación', 'La vida cotidiana'] },
      { titulo: 'Vínculos y grupos', rango: 'Encuentros 3 y 4', items: ['La noción de vínculo', 'Qué hace que un grupo sea grupo', 'Los roles en los grupos'] },
      { titulo: 'Comunicación y aprendizaje', rango: 'Encuentros 5 y 6', items: ['Comunicación y malentendidos', 'Aprender con otros', 'Integración y cierre'] }
    ]
  },
  {
    id: 'p5', slug: 'grupos-que-aprenden', titulo: 'Grupos que aprenden: procesos grupales', area: 'ps', formato: 'Seminario',
    modalidad: 'Presencial', dia: 'Lunes', hora: '19:00 a 21:00', fecha: '2026-11-09', inicio: 'lunes 9 de noviembre',
    encuentros: 4, duracion: '2 h por encuentro', precio: 38000,
    portada: 'procesos-grupales.webp', alt: 'Coordinadora hablando con un grupo alrededor de una mesa',
    corta: 'Cómo funciona un grupo, qué roles aparecen y cómo acompañar su tarea.',
    completa: 'Un seminario para entender qué pasa en los grupos: cómo se forman, qué roles aparecen, cómo se comunican y qué obstáculos encuentran al trabajar juntos. Teoría con ejemplos concretos y ejercicios para quienes coordinan o participan en grupos.',
    resultados: ['Herramientas para leer lo que pasa en un grupo', 'Los roles más frecuentes y cómo circulan', 'Recursos para coordinar con más claridad'],
    paraQuien: 'Para estudiantes, docentes, coordinadores y quienes trabajan con grupos.',
    incluye: ['Material teórico por encuentro', 'Guía de observación de grupos'],
    modulos: [
      { titulo: '¿Qué es un grupo?', items: ['Grupo y serie', 'La tarea del grupo', 'Ejemplos cotidianos'] },
      { titulo: 'Los roles', items: ['Portavoz, chivo emisario, líder y saboteador', 'Cómo circulan los roles', 'Ejercicio de observación'] },
      { titulo: 'La comunicación en el grupo', items: ['Malentendidos y ruido', 'La escucha', 'Análisis de situaciones'] },
      { titulo: 'Coordinar', items: ['El lugar de quien coordina', 'Obstáculos frecuentes', 'Cierre e integración'] }
    ]
  },
  {
    id: 'p6', slug: 'at-vida-cotidiana', titulo: 'El Acompañamiento Terapéutico en la vida cotidiana', area: 'at', formato: 'Seminario',
    modalidad: 'Presencial', dia: 'Sábado', hora: '14:00 a 17:00', fecha: '2026-11-14', inicio: 'sábado 14 de noviembre',
    encuentros: 3, duracion: '3 h por encuentro', precio: 36000, destacado: true,
    portada: 'at-vida-cotidiana.webp', alt: 'Dos mujeres conversando mientras caminan por un parque',
    corta: 'Qué es acompañar, dónde se acompaña y qué herramientas sostienen la tarea.',
    completa: 'Un seminario sobre la práctica del Acompañamiento Terapéutico: qué hace un acompañante, cómo se trabaja en la casa, en la calle y en la rutina de la persona, y cómo se articula con el equipo tratante. Con casos, ejemplos y herramientas para la tarea.',
    resultados: ['Una idea clara del rol y sus límites', 'Herramientas para acompañar en lo cotidiano', 'Casos para pensar la práctica'],
    paraQuien: 'Para estudiantes y acompañantes terapéuticos, familias y personas interesadas en el rol.',
    incluye: ['Material de lectura por encuentro', 'Modelo de registro de la tarea'],
    modulos: [
      { titulo: '¿Qué es acompañar?', items: ['El rol del acompañante', 'Encuadre y límites', 'Casos para pensar'] },
      { titulo: 'Acompañar en lo cotidiano', items: ['La casa, la calle, la rutina', 'Actividades y objetivos', 'El registro de la tarea'] },
      { titulo: 'Trabajo en equipo', items: ['Articulación con el equipo tratante', 'El cuidado de quien acompaña', 'Cierre del seminario'] }
    ]
  },
  {
    id: 'p7', slug: 'escucha-y-encuadre', titulo: 'Escucha y encuadre en el acompañamiento', area: 'at', formato: 'Seminario',
    modalidad: 'Online en vivo', dia: 'Jueves', hora: '19:00 a 20:30', fecha: '2026-11-12', inicio: 'jueves 12 de noviembre',
    encuentros: 4, duracion: '1 h 30 min por encuentro', precio: 30000,
    portada: 'escucha-encuadre.webp', alt: 'Dos personas conversando frente a frente con cuadernos sobre la mesa',
    corta: 'La escucha como herramienta: qué decir, qué no y cómo sostener el encuadre.',
    completa: 'Un seminario para trabajar la escucha y la comunicación en la tarea de acompañar: cómo escuchar sin juzgar, cómo intervenir, qué hacer con lo que nos pasa y cómo sostener el encuadre acordado. Con situaciones reales para analizar en grupo.',
    resultados: ['Recursos de escucha para la tarea', 'Criterios para intervenir sin invadir', 'Claves para sostener el encuadre'],
    paraQuien: 'Para acompañantes terapéuticos, estudiantes y personas que acompañan a otras.',
    incluye: ['Material de lectura en PDF', 'Link de la sala al inscribirte'],
    requisitos: 'Conexión a internet y una computadora o celular.',
    modulos: [
      { titulo: 'Escuchar', items: ['La escucha activa', 'Lo que se dice y lo que no', 'Ejercicio en parejas'] },
      { titulo: 'Comunicar', items: ['Intervenir sin invadir', 'Preguntas que abren', 'Situaciones para analizar'] },
      { titulo: 'El encuadre', items: ['Acuerdos, horarios y límites', 'Cuando el encuadre se corre', 'Casos'] },
      { titulo: 'Quien acompaña', items: ['Lo que nos pasa en la tarea', 'Supervisión y cuidado', 'Cierre del seminario'] }
    ]
  },
  {
    id: 'p8', slug: 'numerologia-numero-personal', titulo: 'Numerología: tu número personal', area: 'num', formato: 'Encuentro individual',
    modalidad: 'Presencial u online', dia: 'A coordinar', hora: 'Lunes a viernes, de 9 a 18', fecha: '2099-01-01', inicio: '',
    encuentros: 1, duracion: '60 minutos', precio: 15000,
    portada: 'numerologia.webp', alt: 'Cuaderno abierto y figuras de madera sobre una mesa',
    corta: 'Un encuentro individual para conocer tus números y usarlos como herramienta de autoconocimiento.',
    completa: 'A partir de tu fecha de nacimiento y tu nombre, calculamos tu número personal y vemos lo que propone la numerología sobre tus características, tus tiempos y tus desafíos. Una herramienta más para conocerte y reflexionar, que no reemplaza ninguna consulta profesional.',
    resultados: ['Tu número personal y su lectura', 'Preguntas para pensar tu momento actual', 'Un resumen escrito del encuentro'],
    paraQuien: 'Para quienes sientan curiosidad por la numerología como herramienta de autoconocimiento.',
    incluye: ['Cálculo de tu mapa numerológico', 'Resumen escrito del encuentro'],
    modulos: [
      { titulo: 'Antes del encuentro', items: ['Coordinamos día y horario por WhatsApp', 'Me pasás tu fecha de nacimiento', 'Y tu nombre completo'] },
      { titulo: 'En el encuentro', items: ['Cálculo de tu número personal', 'Lectura de tu mapa numerológico', 'Preguntas y reflexión'] },
      { titulo: 'Después', items: ['Resumen escrito', 'Preguntas para seguir pensando', 'Recursos de lectura'] }
    ]
  }
];

const ICONS = {
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const WA_GLIFO = '<svg class="wa" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getCurso = id => CURSOS.find(c => c.id === id);
const getPorSlug = s => CURSOS.find(c => c.slug === s);
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const intentar = fn => { try { return fn(); } catch (e) { return e; } };
const waLink = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
const horarioTxt = c => c.dia === 'A coordinar' ? c.hora : `${c.dia} · ${c.hora}`;
const encuentrosTxt = c => `${c.encuentros} encuentro${c.encuentros > 1 ? 's' : ''}`;
const inicioTxt = c => c.inicio ? `Inicia el ${c.inicio}` : 'Día y horario a coordinar';
const costoNota = c => c.encuentros > 1 ? `por los ${c.encuentros} encuentros` : 'el encuentro';
const modalidadIco = c => /online/i.test(c.modalidad) && !/presencial/i.test(c.modalidad) ? 'video' : 'pin';
const lugarTxt = c => c.modalidad === 'Presencial' ? 'Buenos Aires · dirección al inscribirte' : c.modalidad === 'Online en vivo' ? 'Por videollamada, en vivo' : 'En Buenos Aires o por videollamada';
const badgeTxt = c => c.formato === 'Encuentro individual' ? ['user', 'Individual'] : /online/i.test(c.modalidad) ? ['video', 'Online en vivo'] : null;

const Cart = {
  KEY: 'acompanarte_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items))); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getCurso(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); }
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

const sumarBtn = (c, cls = 'btn--sm') => `<button type="button" class="btn btn--dark ${cls}" data-sumar="${c.id}"><span class="lbl">Inscribirme</span></button>`;
const verBtn = (c, cls = 'btn--sm') => `<button type="button" class="btn btn--ghost ${cls}" data-ver="${c.slug}">Ver<span class="lbl-largo">propuesta</span></button>`;
const tituloLink = c => `<a class="titulo-link" href="?propuesta=${c.slug}" data-ver="${c.slug}">${esc(c.titulo)}</a>`;
const tagArea = c => `<p class="tag-area">${AREAS[c.area]} <span>· ${esc(c.formato)}</span></p>`;
const fotoBtn = c => `<button type="button" class="foto" data-ver="${c.slug}" aria-label="Ver «${esc(c.titulo)}»"><img src="images/${c.portada}" alt="${esc(c.alt)}" width="1000" height="1000"></button>`;

function destCardHTML(c) {
  return `<article class="dest-card" data-area="${c.area}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    ${fotoBtn(c)}
    <div class="dest-card__body">
      ${tagArea(c)}
      <h3>${tituloLink(c)}</h3>
      <p class="dest-card__corta">${esc(c.corta)}</p>
      <div class="datos-2">
        <p class="dato">${ico('calendar')}<span><b>Horario</b>${esc(horarioTxt(c))}</span></p>
        <p class="dato">${ico('tag')}<span><b>Costo</b>${formatearPrecio(precioFinal(c))}</span></p>
      </div>
      <p class="dest-card__inicio">${esc(inicioTxt(c))} · ${encuentrosTxt(c)} · ${esc(c.modalidad)}</p>
      <div class="dest-card__acc">${verBtn(c)}${sumarBtn(c)}</div>
    </div>
  </article>`;
}

function ticketHTML(c) {
  const f = new Date(c.fecha + 'T12:00:00');
  return `<article class="ticket" data-area="${c.area}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <p class="ticket__fecha"><small>${esc(c.dia)}</small><b>${String(f.getDate()).padStart(2, '0')}</b><span>${MESES[f.getMonth()]}</span></p>
    ${fotoBtn(c)}
    <div class="ticket__info">
      ${tagArea(c)}
      <h3>${tituloLink(c)}</h3>
      <p>${esc(c.corta)}</p>
    </div>
    <div class="ticket__lado">
      <p class="fila__meta"><span>${esc(c.hora)}</span><span>${encuentrosTxt(c)}</span><span>${esc(c.modalidad)}</span></p>
      <p class="precio"><b>${formatearPrecio(precioFinal(c))}</b><span>${costoNota(c)}</span></p>
      <div class="ticket__acc">${verBtn(c)}${sumarBtn(c)}</div>
    </div>
  </article>`;
}

function cardHTML(c) {
  const b = badgeTxt(c);
  return `<article class="card" data-area="${c.area}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="card__media">${fotoBtn(c)}${b ? `<span class="badge">${ico(b[0])}${b[1]}</span>` : ''}</div>
    <div class="card__body">
      ${tagArea(c)}
      <h3>${tituloLink(c)}</h3>
      <ul class="meta">
        <li>${ico('calendar')}<span>${esc(horarioTxt(c))}</span></li>
        <li>${ico('clock')}<span>${esc(inicioTxt(c))} · ${encuentrosTxt(c)}</span></li>
        <li>${ico(modalidadIco(c))}<span>${esc(c.modalidad)}</span></li>
      </ul>
      <p class="precio"><b>${formatearPrecio(precioFinal(c))}</b><span>${costoNota(c)}</span></p>
      <div class="card__acc">${verBtn(c)}${sumarBtn(c)}</div>
    </div>
  </article>`;
}

function filaHTML(c) {
  const [desde, hasta] = c.dia === 'A coordinar' ? ['A coordinar', c.hora] : c.hora.split(' a ');
  return `<li class="fila" data-area="${c.area}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <p class="fila__hora${c.dia === 'A coordinar' ? ' fila__hora--coord' : ''}">${esc(desde)}<span>${c.dia === 'A coordinar' ? esc(hasta) : 'a ' + esc(hasta)}</span></p>
    ${fotoBtn(c)}
    <div class="fila__info">
      ${tagArea(c)}
      <h3>${tituloLink(c)}</h3>
      <p class="fila__meta"><span>${esc(inicioTxt(c))}</span><span>${encuentrosTxt(c)}</span><span>${esc(c.modalidad)}</span></p>
    </div>
    <div class="fila__lado">
      <p class="precio"><b>${formatearPrecio(precioFinal(c))}</b><span>${costoNota(c)}</span></p>
      <div class="fila__acc">${verBtn(c)}${sumarBtn(c)}</div>
    </div>
  </li>`;
}

function agendaHTML(lista) {
  return DIAS.map(d => {
    const delDia = lista.filter(c => c.dia === d).sort((a, b) => a.hora.localeCompare(b.hora));
    if (!delDia.length) return '';
    return `<div class="agenda-dia">
      <span class="regla" data-animate="linea" style="transform:scaleX(0)"></span>
      <h3 class="agenda-dia__nombre" data-animate="subir" style="opacity:0;transform:translateY(20px)">${d}<small>${delDia.length} propuesta${delDia.length > 1 ? 's' : ''}</small></h3>
      <ul class="agenda-lista">${delDia.map(filaHTML).join('')}</ul>
    </div>`;
  }).join('');
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

function syncSumar(scope = document) {
  const enCarrito = new Set(Cart.get().map(i => i.id));
  scope.querySelectorAll('[data-sumar]').forEach(b => {
    const dentro = enCarrito.has(b.dataset.sumar);
    b.classList.toggle('is-added', dentro);
    const lbl = b.querySelector('.lbl');
    if (lbl) lbl.innerHTML = dentro ? `${ico('check')}Anotada` : 'Inscribirme';
    b.setAttribute('aria-label', dentro ? 'Ya está en tu inscripción: ver inscripción' : 'Sumar a tu inscripción');
  });
}

function initDestacados() {
  const cont = document.getElementById('destacados');
  if (!cont) return;
  const lista = CURSOS.filter(c => c.destacado);
  cont.innerHTML = cont.dataset.vista === 'tickets' ? lista.map(ticketHTML).join('') : lista.map(destCardHTML).join('');
}

const estado = { area: '', q: '', formato: '', modalidad: '', dia: '', visibles: 12 };
let renderCatalogo = () => {};

function initCatalogo() {
  const cont = document.getElementById('catalogo-lista');
  if (!cont) return;
  const vista = cont.dataset.vista || 'grilla';
  const buscar = document.getElementById('buscar');
  const fFormato = document.getElementById('f-formato');
  const fModalidad = document.getElementById('f-modalidad');
  const fDia = document.getElementById('f-dia');
  const count = document.getElementById('catalogo-count');
  const limpiar = document.getElementById('catalogo-limpiar');
  const vacio = document.getElementById('catalogo-vacio');
  const mas = document.getElementById('catalogo-mas');
  const chips = [...document.querySelectorAll('[data-chip]')];
  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros');

  const filtrar = () => {
    const q = norm(estado.q.trim());
    return CURSOS.filter(c => {
      if (estado.area && c.area !== estado.area) return false;
      if (estado.formato && c.formato !== estado.formato) return false;
      if (estado.modalidad && !norm(c.modalidad).includes(estado.modalidad)) return false;
      if (estado.dia && c.dia !== estado.dia) return false;
      if (q) {
        const texto = norm([c.titulo, AREAS[c.area], c.formato, c.modalidad, c.dia, c.hora, c.corta, c.completa, COORDINA, ...(c.modulos || []).flatMap(m => [m.titulo, ...m.items])].join(' '));
        if (!q.split(/\s+/).every(p => texto.includes(p))) return false;
      }
      return true;
    }).sort((a, b) => a.fecha.localeCompare(b.fecha));
  };

  renderCatalogo = () => {
    const lista = filtrar();
    const vis = lista.slice(0, estado.visibles);
    cont.innerHTML = vista === 'agenda' ? agendaHTML(vis) : vis.map(cardHTML).join('');
    count.innerHTML = `<strong>${lista.length}</strong> propuesta${lista.length === 1 ? '' : 's'}`;
    vacio.hidden = lista.length > 0;
    cont.hidden = lista.length === 0;
    if (mas) mas.hidden = lista.length <= estado.visibles;
    const activos = estado.area || estado.q || estado.formato || estado.modalidad || estado.dia;
    limpiar.hidden = !activos;
    chips.forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.chip === estado.area)));
    syncSumar(cont);
    revelarNuevos(cont);
  };

  chips.forEach(ch => ch.addEventListener('click', () => { estado.area = ch.dataset.chip; estado.visibles = 12; renderCatalogo(); }));
  let t = 0;
  buscar?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscar.value; estado.visibles = 12; renderCatalogo(); }, 160); });
  fFormato?.addEventListener('change', () => { estado.formato = fFormato.value; renderCatalogo(); });
  fModalidad?.addEventListener('change', () => { estado.modalidad = fModalidad.value; renderCatalogo(); });
  fDia?.addEventListener('change', () => { estado.dia = fDia.value; renderCatalogo(); });
  const reset = () => {
    Object.assign(estado, { area: '', q: '', formato: '', modalidad: '', dia: '', visibles: 12 });
    if (buscar) buscar.value = '';
    [fFormato, fModalidad, fDia].forEach(s => { if (s) s.value = ''; });
    renderCatalogo();
  };
  limpiar?.addEventListener('click', reset);
  document.getElementById('catalogo-vacio-limpiar')?.addEventListener('click', reset);
  mas?.addEventListener('click', () => { estado.visibles += 12; renderCatalogo(); });
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(abierto));
  });

  document.querySelectorAll('[data-area-link]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    estado.area = a.dataset.areaLink;
    estado.visibles = 12;
    renderCatalogo();
    document.getElementById('propuestas')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));

  renderCatalogo();
}

function focusTrap(container, e) {
  if (e.key !== 'Tab') return;
  const f = [...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null && el.getAttribute('aria-disabled') !== 'true');
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const Overlay = {
  abiertos: 0,
  lock() { this.abiertos++; document.body.classList.add('no-scroll'); },
  unlock() { this.abiertos = Math.max(0, this.abiertos - 1); if (!this.abiertos) document.body.classList.remove('no-scroll'); }
};

function modalHTML(c) {
  const consulta = waLink(`Hola! Quiero consultar por «${c.titulo}» (${horarioTxt(c)}).`);
  return `<div class="ficha" data-area="${c.area}">
    <div class="ficha__media">
      <div class="ficha__foto"><img src="images/${c.portada}" alt="${esc(c.alt)}" width="1000" height="1000"></div>
      <dl class="ficha__datos">
        <div><dt>${ico('calendar')}Horario</dt><dd>${esc(horarioTxt(c))}</dd></div>
        <div><dt>${ico('clock')}Inicio</dt><dd>${esc(c.inicio ? c.inicio.charAt(0).toUpperCase() + c.inicio.slice(1) : 'Cuando quieras')}</dd></div>
        <div><dt>${ico('layers')}Duración</dt><dd>${encuentrosTxt(c)} · ${esc(c.duracion)}</dd></div>
        <div><dt>${ico(modalidadIco(c))}Modalidad</dt><dd>${esc(c.modalidad)}<small>${esc(lugarTxt(c))}</small></dd></div>
        <div class="costo"><dt>${ico('tag')}Costo</dt><dd>${formatearPrecio(precioFinal(c))} <small>${costoNota(c)}</small></dd></div>
      </dl>
      <div class="ficha__acc">
        <button type="button" class="btn btn--dark btn--block" data-inscribir="${c.id}">Inscribirme ${ico('arrow', 'ico-arrow')}</button>
        <a class="btn btn--ghost btn--block" href="${consulta}" target="_blank" rel="noopener">${WA_GLIFO}Consultar por WhatsApp</a>
      </div>
    </div>
    <div class="ficha__txt">
      ${tagArea(c)}
      <h2 class="ficha__titulo">${esc(c.titulo)}</h2>
      <p class="ficha__corta">${esc(c.corta)}</p>
      <p>${esc(c.completa)}</p>
      <h3>Qué te llevás</h3>
      <ul class="checks">${c.resultados.map(r => `<li>${ico('check')}<span>${esc(r)}</span></li>`).join('')}</ul>
      <h3>${c.encuentros > 1 ? 'Encuentro por encuentro' : 'Cómo es el encuentro'}</h3>
      <div class="programa">${c.modulos.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span><small>${esc(m.rango || (c.encuentros > 1 ? `Encuentro ${i + 1}` : `Parte ${i + 1}`))}</small>${esc(m.titulo)}</span>${ico('chevron')}</summary><ul>${m.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></details>`).join('')}</div>
      <div class="ficha__2col">
        <div><h3>Para quién es</h3><p>${esc(c.paraQuien)}${c.requisitos ? ' ' + esc(c.requisitos) : ''}</p></div>
        <div><h3>Qué incluye</h3><ul>${c.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
      <div class="coordina"><span class="coordina__mono">(te)</span><div><b>Coordina</b><p>${esc(COORDINA)}</p></div></div>
    </div>
  </div>`;
}

const Modal = { el: null, prevFocus: null, abierto: false };
function abrirModal(slug, { pushUrl = true } = {}) {
  const c = getPorSlug(slug);
  const m = Modal.el;
  if (!c || !m) return;
  m.querySelector('#modal-contenido').innerHTML = modalHTML(c);
  if (!Modal.abierto) { Modal.prevFocus = document.activeElement; Overlay.lock(); }
  Modal.abierto = true;
  m.hidden = false;
  const panel = m.querySelector('.modal__panel');
  panel.scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('open')));
  panel.focus({ preventScroll: true });
  if (pushUrl) intentar(() => window.history.replaceState(null, '', `?propuesta=${c.slug}${location.hash}`));
}
function cerrarModal() {
  const m = Modal.el;
  if (!m || !Modal.abierto) return;
  Modal.abierto = false;
  m.classList.remove('open');
  Overlay.unlock();
  setTimeout(() => { if (!Modal.abierto) m.hidden = true; }, reduceMotion ? 0 : 320);
  intentar(() => window.history.replaceState(null, '', location.pathname + location.hash));
  Modal.prevFocus?.focus?.({ preventScroll: true });
}
function initModal() {
  Modal.el = document.getElementById('modal');
  if (!Modal.el) return;
  Modal.el.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarModal(); });
  Modal.el.addEventListener('keydown', e => focusTrap(Modal.el.querySelector('.modal__panel'), e));
  const slug = new URLSearchParams(location.search).get('propuesta');
  if (slug && getPorSlug(slug)) abrirModal(slug, { pushUrl: false });
}

const Drawer = { el: null, prevFocus: null, abierto: false };
function mensajeInscripcion() {
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  const nombre = document.getElementById('insc-nombre')?.value.trim();
  const lineas = items.map(c => `• ${c.titulo} — ${horarioTxt(c)} (${formatearPrecio(precioFinal(c))})`);
  return `Hola! Quiero inscribirme en:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${nombre ? `\nMi nombre es ${nombre}.` : ''}`;
}
function renderDrawer() {
  const d = Drawer.el;
  if (!d) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  const cont = d.querySelector('#drawer-items');
  const vacio = d.querySelector('#drawer-vacio');
  const pie = d.querySelector('#drawer-pie');
  vacio.hidden = items.length > 0;
  pie.hidden = items.length === 0;
  cont.innerHTML = items.map(c => `<div class="d-item" data-area="${c.area}">
    <span class="d-item__foto"><img src="images/${c.portada}" alt="" width="1000" height="1000"></span>
    <div><b>${esc(c.titulo)}</b><small>${esc(horarioTxt(c))} · ${esc(c.modalidad)}</small><p class="d-item__precio">${formatearPrecio(precioFinal(c))}</p></div>
    <button type="button" class="d-item__quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}">${ico('trash')}</button>
  </div>`).join('');
  d.querySelector('#drawer-total').textContent = formatearPrecio(Cart.total());
  actualizarEnvio();
}
function actualizarEnvio() {
  const a = document.getElementById('insc-enviar');
  if (!a) return;
  if (!Cart.count()) { a.setAttribute('aria-disabled', 'true'); a.tabIndex = -1; return; }
  a.removeAttribute('aria-disabled');
  a.removeAttribute('tabindex');
  a.href = waLink(mensajeInscripcion());
}
function abrirDrawer() {
  const d = Drawer.el;
  if (!d) return;
  if (Modal.abierto) cerrarModal();
  renderDrawer();
  if (!Drawer.abierto) { Drawer.prevFocus = document.activeElement; Overlay.lock(); }
  Drawer.abierto = true;
  d.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  d.querySelector('.drawer__panel').focus({ preventScroll: true });
}
function cerrarDrawer() {
  const d = Drawer.el;
  if (!d || !Drawer.abierto) return;
  Drawer.abierto = false;
  d.classList.remove('open');
  Overlay.unlock();
  setTimeout(() => { if (!Drawer.abierto) d.hidden = true; }, reduceMotion ? 0 : 400);
  Drawer.prevFocus?.focus?.({ preventScroll: true });
}
function initDrawer() {
  Drawer.el = document.getElementById('drawer');
  if (!Drawer.el) return;
  Drawer.el.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
    const q = e.target.closest('[data-quitar]');
    if (q) { const c = getCurso(q.dataset.quitar); Cart.remove(q.dataset.quitar); if (c) showToast(`Sacaste «${c.titulo}» de tu inscripción.`); }
    if (e.target.closest('[data-ir-propuestas]')) { cerrarDrawer(); document.getElementById('propuestas')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });
  Drawer.el.addEventListener('keydown', e => focusTrap(Drawer.el.querySelector('.drawer__panel'), e));
  document.getElementById('insc-nombre')?.addEventListener('input', actualizarEnvio);
  document.getElementById('insc-enviar')?.addEventListener('click', () => {
    if (Cart.count()) showToast('Te abrimos WhatsApp con tu inscripción lista para enviar.');
  });
  document.querySelectorAll('[data-abrir-drawer]').forEach(b => b.addEventListener('click', abrirDrawer));
  document.addEventListener('cart:updated', () => { if (Drawer.abierto) renderDrawer(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { e.preventDefault(); abrirModal(ver.dataset.ver); return; }
    const sumar = e.target.closest('[data-sumar]');
    if (sumar) {
      const c = getCurso(sumar.dataset.sumar);
      if (!c) return;
      if (Cart.has(c.id)) { abrirDrawer(); return; }
      Cart.add(c);
      showToast(`Sumaste «${c.titulo}» a tu inscripción.`);
      return;
    }
    const insc = e.target.closest('[data-inscribir]');
    if (insc) {
      const c = getCurso(insc.dataset.inscribir);
      if (!c) return;
      Cart.add(c);
      abrirDrawer();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (Drawer.abierto) cerrarDrawer();
    else if (Modal.abierto) cerrarModal();
  });
  document.addEventListener('cart:updated', () => { syncSumar(); updateCartBadge(); });
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const activar = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (foco) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activar(t));
      t.addEventListener('keydown', e => {
        const dir = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        activar(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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

initDestacados();
initCatalogo();
initReveals();
initNav();
initTabs();
initAcciones();
initModal();
initDrawer();
initFloats();
syncSumar();
updateCartBadge();
initModelBarScroll();
