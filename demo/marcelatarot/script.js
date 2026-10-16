document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491148899782';
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const DOCENTE = {
  nombre: 'Marcela',
  rol: 'Tarotista y profesora de Tarot Rider Waite',
  bio: 'Da consultas de Tarot Rider Waite por WhatsApp y videollamada, y enseña a leer el mazo en cursos y talleres pensados para avanzar paso a paso.',
};

const CATS = { curso: 'Curso', taller: 'Taller', material: 'Material' };
const NIVELES = { inicial: 'Inicial', intermedio: 'Intermedio', avanzado: 'Avanzado', todos: 'Todos los niveles' };
const MODOS = { vivo: 'En vivo por videollamada', grabado: 'Grabado', pdf: 'Para descargar' };
const MODOS_CORTO = { vivo: 'En vivo', grabado: 'Grabado', pdf: 'PDF' };
const MODOS_CARD = { vivo: 'Por videollamada', grabado: 'Grabado', pdf: 'Para descargar' };

const m = (titulo, clases) => ({ titulo, clases: clases.map(([t, d, tipo = 'vivo', preview = false]) => ({ titulo: t, duracion: d, tipo, preview })) });

const CURSOS = [
  {
    id: 'tarot-desde-cero', num: 'I', cat: 'curso', nivel: 'inicial', modo: 'vivo', precio: 64000, badge: 'Para empezar',
    portada: 'c-desde-cero', alt: 'Cartas del Sol, la Estrella y el Mago sobre una mesa de mármol junto a un cuaderno con una luna dorada',
    titulo: 'Tarot Rider Waite desde cero',
    corta: 'Los 22 arcanos mayores, la simbología del mazo y tus primeras tiradas.',
    descripcion: 'Para quien nunca leyó el Tarot o lo intentó por su cuenta con un libro. Recorremos los arcanos mayores uno por uno, aprendés a mirar los símbolos del Rider Waite en lugar de memorizar significados y terminás haciendo tus primeras tiradas.',
    resultados: ['Reconocer los 22 arcanos mayores y sus símbolos', 'Leer tiradas de una y de tres cartas', 'Llevar tu propio diario de lecturas'],
    incluye: ['9 clases en vivo por videollamada', 'Guía de estudio en PDF de cada clase', 'Ejercicios de tiradas para practicar en casa', 'Tus dudas por WhatsApp entre clase y clase'],
    requisitos: ['Un mazo Rider Waite, de cualquier edición', 'Un cuaderno para tus anotaciones', 'Conexión para las clases por videollamada'],
    modulos: [
      m('El mazo y cómo se lee', [['Historia y estructura del Rider Waite', 80, 'vivo', true], ['Arcanos mayores y menores: cómo se ordena el mazo', 85], ['Cómo preguntarle al Tarot', 80]]),
      m('Del Loco a la Rueda de la Fortuna', [['El Loco, el Mago y la Sacerdotisa', 90], ['De la Emperatriz al Carro', 90], ['La Fuerza, el Ermitaño y la Rueda', 90]]),
      m('De la Justicia al Mundo', [['La Justicia, el Colgado y la Muerte', 90], ['De la Templanza a la Luna', 90], ['El Sol, el Juicio, el Mundo y tus primeras tiradas', 95]]),
    ],
  },
  {
    id: 'arcanos-menores', num: 'II', cat: 'curso', nivel: 'intermedio', modo: 'vivo', precio: 58000,
    portada: 'c-menores', alt: 'Cartas de bastos y de la corte del Rider Waite sobre un paño violeta con estrellas doradas',
    titulo: 'Arcanos menores y cartas de la corte',
    corta: 'Los cuatro palos, los números y las 16 figuras para leer el mazo completo.',
    descripcion: 'El segundo nivel: los cuatro palos, lo que dice cada número y las cartas de la corte, que son las que más cuestan. Al final juntás mayores y menores en la misma tirada.',
    resultados: ['Leer los cuatro palos y sus números', 'Interpretar las 16 cartas de la corte', 'Hacer tiradas con el mazo completo'],
    incluye: ['9 clases en vivo por videollamada', 'Guía en PDF de los cuatro palos y la corte', 'Práctica guiada con preguntas reales', 'Tus dudas por WhatsApp entre clase y clase'],
    requisitos: ['Conocer los arcanos mayores o haber hecho «Tarot Rider Waite desde cero»', 'Tu mazo Rider Waite'],
    modulos: [
      m('Los cuatro palos', [['Bastos y Copas', 85, 'vivo', true], ['Espadas y Oros', 85], ['Los números, del As al Diez', 85]]),
      m('Las cartas de la corte', [['Sotas y Caballeros', 85], ['Reinas y Reyes', 85], ['Cómo leer una figura en una tirada', 80]]),
      m('El mazo completo en juego', [['Mayores y menores en la misma tirada', 85], ['Tirada de cinco cartas', 90], ['Práctica guiada con preguntas reales', 90]]),
    ],
  },
  {
    id: 'lectura-para-otros', num: 'III', cat: 'curso', nivel: 'avanzado', modo: 'vivo', precio: 72000,
    portada: 'c-lectura', alt: 'Mano acomodando cartas del Rider Waite junto a la carta del Sol sobre una mesa clara',
    titulo: 'Lectura para otros: tiradas y consultantes',
    corta: 'Cruz Celta, tiradas por tema y cómo acompañar a quien te consulta.',
    descripcion: 'El nivel para empezar a leerle a otras personas: la Cruz Celta completa, tiradas por tema y cómo recibir una pregunta, contar lo que ves y cuidar a quien te consulta.',
    resultados: ['Hacer una Cruz Celta completa', 'Elegir la tirada justa para cada pregunta', 'Acompañar a quien te consulta con cuidado'],
    incluye: ['9 clases en vivo por videollamada', 'Plantillas de tiradas en PDF', 'Tres lecturas de práctica con devolución', 'Tus dudas por WhatsApp entre clase y clase'],
    requisitos: ['Conocer las 78 cartas del Rider Waite', 'Haber hecho tiradas para vos'],
    modulos: [
      m('Tiradas para cada pregunta', [['La Cruz Celta completa', 90], ['Tiradas de amor, trabajo y decisiones', 90], ['Armar tu propia tirada', 80]]),
      m('La consulta', [['Cómo recibir la pregunta', 75], ['Contar lo que ves sin asustar', 80], ['Cuidar a quien consulta y cuidarte', 70]]),
      m('Práctica con consultantes', [['Primera lectura de práctica', 90, 'practica'], ['Segunda lectura de práctica', 90, 'practica'], ['Tercera lectura y cierre', 90, 'practica']]),
    ],
  },
  {
    id: 'taller-cruz-celta', num: 'IV', cat: 'taller', nivel: 'intermedio', modo: 'vivo', precio: 18000, formato: '1 encuentro en vivo',
    portada: 't-cruz-celta', alt: 'Tirada de cartas Rider Waite sobre una mesa de madera con velas encendidas y cristales',
    titulo: 'Taller: la Cruz Celta paso a paso',
    corta: 'Las diez posiciones de la tirada más clásica, explicadas con una lectura real.',
    descripcion: 'Un encuentro para entender la tirada más clásica del Tarot posición por posición, con una lectura completa hecha en vivo y tiempo para preguntas.',
    resultados: ['Ubicar y leer las diez posiciones', 'Unir las cartas en una sola historia'],
    incluye: ['Un encuentro en vivo de 2 h', 'Plantilla de la Cruz Celta en PDF', 'Guía de preguntas para cada posición'],
    requisitos: ['Conocer los arcanos mayores', 'Tu mazo Rider Waite'],
    modulos: [
      m('Las posiciones', [['La cruz: situación, desafío y raíz', 25], ['El báculo: vos, el entorno y el desenlace', 25], ['Cómo se relacionan las diez cartas', 15]]),
      m('Lectura en vivo', [['Una tirada completa, posición por posición', 30], ['Preguntas del grupo', 15], ['Los errores más comunes al leerla', 10]]),
      m('Para llevarte', [['Plantilla de la Cruz Celta', 0, 'pdf'], ['Guía de preguntas para cada posición', 0, 'pdf'], ['Práctica sugerida para la semana', 0, 'practica']]),
    ],
  },
  {
    id: 'taller-autoconocimiento', num: 'V', cat: 'taller', nivel: 'todos', modo: 'vivo', precio: 26000, formato: '2 encuentros en vivo',
    portada: 't-diario', alt: 'Cuaderno de cuero con lapicera dorada, un mazo de Tarot y velas sobre una mesa',
    titulo: 'Taller: Tarot y autoconocimiento',
    corta: 'Tiradas para mirarte a vos y un diario para seguir tus lecturas.',
    descripcion: 'Dos encuentros para usar el Tarot como herramienta de autoconocimiento: la carta del día, tiradas para mirarte y un diario para seguir lo que aparece.',
    resultados: ['Una práctica diaria con el Tarot', 'Un diario para ver qué se repite en tus tiradas'],
    incluye: ['Dos encuentros en vivo por videollamada', 'Diario de tiradas para imprimir', 'Audio con una lectura guiada'],
    requisitos: ['Ganas de mirarte con el Tarot: no hace falta experiencia', 'Tu mazo Rider Waite y un cuaderno'],
    modulos: [
      m('Primer encuentro', [['La carta del día como práctica', 30], ['Tirada de los tres tiempos', 40], ['Cómo anotar una lectura', 20]]),
      m('Segundo encuentro', [['Tirada del espejo', 35], ['Lo que se repite en tus tiradas', 30], ['Cerrar un ciclo con el Tarot', 25]]),
      m('Entre encuentros', [['Diario de tiradas para imprimir', 0, 'pdf'], ['Ejercicios para una semana', 0, 'practica'], ['Lectura guiada en audio', 15, 'audio']]),
    ],
  },
  {
    id: 'taller-tirada-anual', num: 'VI', cat: 'taller', nivel: 'todos', modo: 'grabado', precio: 16000, formato: 'Grabado, a tu ritmo',
    portada: 't-anual', alt: 'Mano dando vuelta la carta del Sol sobre un paño violeta, con velas y cristales',
    titulo: 'Taller grabado: tu tirada para el año',
    corta: 'Una carta por mes y una para el año: cómo armarla y leerla en casa.',
    descripcion: 'Un taller grabado para armar tu tirada del año en casa: una carta para cada mes y una que lo resume todo, con plantillas para volver a ella.',
    resultados: ['Tu tirada anual armada y leída', 'Una forma de volver a ella cada mes'],
    incluye: ['Clases grabadas para ver cuando quieras', 'Plantilla imprimible de la tirada anual', 'Registro para seguir los doce meses'],
    requisitos: ['Tu mazo Rider Waite', 'Conocer los significados básicos de las cartas'],
    modulos: [
      m('Preparar la tirada', [['Qué preguntarle al año', 12, 'video', true], ['Cómo barajar y ubicar las doce cartas', 15, 'video'], ['La carta que resume el año', 10, 'video']]),
      m('Leer mes por mes', [['Mayores y menores en la tirada anual', 20, 'video'], ['Cuando sale una carta difícil', 15, 'video'], ['Unir los doce meses en una historia', 18, 'video']]),
      m('Después de la tirada', [['Plantilla imprimible', 0, 'pdf'], ['Cómo volver a la tirada cada mes', 10, 'video'], ['Registro para todo el año', 0, 'pdf']]),
    ],
  },
  {
    id: 'guia-78-arcanos', num: 'VII', cat: 'material', nivel: 'todos', modo: 'pdf', precio: 9500, formato: 'PDF para descargar',
    portada: 'm-guia', alt: 'Pila de libros de Tarot con fases de la luna, cristales y una taza de té',
    titulo: 'Guía de los 78 arcanos',
    corta: 'Cada carta con sus símbolos, palabras clave y lectura al derecho y al revés.',
    descripcion: 'Las 78 cartas del Rider Waite en fichas: símbolos, palabras clave y lectura al derecho y al revés, para repasar o consultar en medio de una tirada.',
    resultados: ['Encontrar cualquier carta en segundos', 'Repasar símbolos y palabras clave'],
    incluye: ['Las 78 cartas, una por ficha', 'Palabras clave al derecho y al revés', 'Tabla rápida para tener a mano'],
    requisitos: ['Nada: sirve desde la primera tirada'],
    modulos: [
      m('Arcanos mayores', [['Del Loco al Mundo: 22 fichas', 0, 'pdf', true], ['Símbolos que se repiten', 0, 'pdf'], ['Los mayores en una tirada', 0, 'pdf']]),
      m('Arcanos menores', [['Bastos y Copas', 0, 'pdf'], ['Espadas y Oros', 0, 'pdf'], ['Las 16 cartas de la corte', 0, 'pdf']]),
      m('Para practicar', [['Tabla rápida de palabras clave', 0, 'pdf'], ['Ejercicios por carta', 0, 'pdf'], ['Índice para buscar rápido', 0, 'pdf']]),
    ],
  },
  {
    id: 'cuaderno-tiradas', num: 'VIII', cat: 'material', nivel: 'todos', modo: 'pdf', precio: 7500, formato: 'PDF para imprimir',
    portada: 'm-cuaderno', alt: 'Cuadernos abiertos y una taza sobre una mesa de madera durante una clase de Tarot',
    titulo: 'Cuaderno de tiradas para imprimir',
    corta: 'Plantillas para anotar tus lecturas, la carta del día y tus tiradas favoritas.',
    descripcion: 'Plantillas listas para imprimir: tiradas, carta del día y un diario de lecturas para que tu práctica quede ordenada.',
    resultados: ['Anotar cada lectura en el mismo formato', 'Ver tu recorrido con el Tarot mes a mes'],
    incluye: ['Plantillas de tiradas para imprimir', 'Carta del día para un mes', 'Diario de lecturas'],
    requisitos: ['Una impresora, o el PDF en la tablet'],
    modulos: [
      m('Plantillas de tiradas', [['Una carta y tres cartas', 0, 'pdf'], ['Cruz Celta', 0, 'pdf'], ['Tirada anual', 0, 'pdf']]),
      m('Tu registro', [['Carta del día para un mes', 0, 'pdf'], ['Diario de lecturas', 0, 'pdf'], ['Seguimiento de preguntas', 0, 'pdf']]),
      m('Extras', [['Cómo elegir la tirada', 0, 'pdf'], ['Tabla de palos y elementos', 0, 'pdf'], ['Hojas para notas libres', 0, 'pdf']]),
    ],
  },
];

const CONSULTAS = [
  { id: 'pregunta', titulo: 'Una pregunta', detalle: 'Tres cartas para algo puntual', duracion: '20 min', precio: 14000 },
  { id: 'completa', titulo: 'Lectura completa', detalle: 'Amor, trabajo y lo que viene', duracion: '45 min', precio: 30000 },
  { id: 'cruz', titulo: 'Cruz Celta', detalle: 'Diez cartas para ir a fondo', duracion: '60 min', precio: 38000 },
];

const HORARIO = { 1: [10, 19], 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [10, 14] };
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const getCurso = id => CURSOS.find(c => c.id === id);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const duracionTxt = min => { const h = Math.floor(min / 60); const r = min % 60; return h ? `${h} h${r ? ` ${r} min` : ''}` : `${r} min`; };
const minutos = c => c.modulos.reduce((s, mo) => s + mo.clases.reduce((t, cl) => t + cl.duracion, 0), 0);
const cantidad = c => c.modulos.reduce((s, mo) => s + mo.clases.length, 0);
const formatoDe = c => c.formato || `${cantidad(c)} clases en vivo`;
const normalizar = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'marcelatarot_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { void 0; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().filter(i => getCurso(i.id)).length; },
  total() { return this.get().reduce((s, i) => s + (getCurso(i.id)?.precio || 0), 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  vivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 10 5-3v10l-5-3z"/><rect x="3" y="6" width="13" height="12" rx="2"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  practica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  capas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const ANIM = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';

function etiquetaCarta(c) {
  if (c.cat === 'curso') return `Curso · ${NIVELES[c.nivel]}`;
  return `${CATS[c.cat]} · ${MODOS_CORTO[c.modo]}`;
}

function cartaHTML(c, { tag = 'button', badge = true } = {}) {
  const attrs = tag === 'button' ? ` type="button" data-ver="${esc(c.id)}" tabindex="-1" aria-label="Ver detalle: ${esc(c.titulo)}"` : '';
  return `<${tag} class="carta"${attrs}>
    <span class="carta__num" aria-hidden="true">${c.num}</span>
    <span class="carta__foto"><img src="images/${c.portada}.webp" alt="${esc(c.alt)}" width="600" height="800"></span>
    <span class="carta__nombre" aria-hidden="true">${etiquetaCarta(c)}</span>
    ${badge && c.badge ? `<span class="carta__badge">${esc(c.badge)}</span>` : ''}
  </${tag}>`;
}

function metaHTML(c) {
  const partes = [`<span>${c.modo === 'pdf' ? ICON.pdf : ICON.capas}${esc(formatoDe(c))}</span>`];
  const min = minutos(c);
  if (min) partes.push(`<span>${ICON.reloj}${duracionTxt(min)}</span>`);
  return `<p class="curso__meta">${partes.join('')}</p>`;
}

function addBtn(c, clase = 'btn btn--navy btn--sm') {
  return `<button type="button" class="${clase}" data-add="${esc(c.id)}"><span class="add-ico">${ICON.carrito}</span><span class="add-txt">Agregar</span></button>`;
}

function tarjetaHTML(c, animar = true) {
  return `<article class="curso"${animar ? ' ' + ANIM : ''}>
    ${cartaHTML(c)}
    <div class="curso__info">
      <p class="curso__tipo">${esc(MODOS_CARD[c.modo])}</p>
      <h3 class="curso__titulo"><button type="button" data-ver="${esc(c.id)}">${esc(c.titulo)}</button></h3>
      ${metaHTML(c)}
      <div class="curso__pie"><p class="precio">${formatearPrecio(c.precio)}</p>${addBtn(c)}</div>
    </div>
  </article>`;
}

function filaHTML(c, animar = true) {
  return `<article class="fila"${animar ? ' ' + ANIM : ''}>
    ${cartaHTML(c, { badge: false })}
    <div class="fila__info">
      <p class="curso__tipo">${esc(CATS[c.cat])} · ${esc(MODOS_CARD[c.modo])}</p>
      <h3 class="curso__titulo"><button type="button" data-ver="${esc(c.id)}">${esc(c.titulo)}</button></h3>
      <p class="fila__corta">${esc(c.corta)}</p>
      ${metaHTML(c)}
    </div>
    <div class="fila__compra">
      <p class="precio">${formatearPrecio(c.precio)}</p>
      <div class="fila__botones"><button type="button" class="btn btn--line btn--sm" data-ver="${esc(c.id)}">Ver detalle</button>${addBtn(c)}</div>
    </div>
  </article>`;
}

const filtro = { cat: '', modo: '', q: '' };

function textoBusqueda(c) {
  return normalizar([c.titulo, c.corta, c.descripcion, CATS[c.cat], NIVELES[c.nivel], MODOS[c.modo], ...c.modulos.flatMap(mo => [mo.titulo, ...mo.clases.map(cl => cl.titulo)])].join(' '));
}

function renderCursos(animar = true) {
  const cont = document.querySelector('[data-cursos]');
  if (!cont) return;
  const palabras = normalizar(filtro.q).split(/\s+/).filter(Boolean);
  const lista = CURSOS.filter(c => (!filtro.cat || c.cat === filtro.cat) && (!filtro.modo || c.modo === filtro.modo) && palabras.every(p => textoBusqueda(c).includes(p)));
  const filas = cont.dataset.cursos === 'filas';
  cont.innerHTML = lista.map(c => (filas ? filaHTML(c, animar) : tarjetaHTML(c, animar))).join('');
  cont.hidden = !lista.length;
  const vacio = document.querySelector('[data-vacio]');
  if (vacio) vacio.hidden = lista.length > 0;
  const contador = document.querySelector('[data-contador]');
  if (contador) contador.textContent = `${lista.length} ${lista.length === 1 ? 'opción' : 'opciones'}`;
  const activo = !!(filtro.cat || filtro.modo || filtro.q.trim());
  document.querySelectorAll('.filtros__estado [data-limpiar]').forEach(b => { b.hidden = !activo; });
  syncBotones();
  revelarNuevos(cont);
}

function sincronizarControles() {
  document.querySelectorAll('.chip[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === filtro.cat)));
  const sel = document.getElementById('filtroModo');
  if (sel) sel.value = filtro.modo;
  const q = document.getElementById('buscarCurso');
  if (q && q.value !== filtro.q) q.value = filtro.q;
}

function aplicarFiltro(cambios) {
  Object.assign(filtro, cambios);
  sincronizarControles();
  renderCursos(true);
}

function initFiltros() {
  if (!document.querySelector('[data-cursos]')) return;
  document.querySelectorAll('.chip[data-cat]').forEach(b => b.addEventListener('click', () => aplicarFiltro({ cat: b.dataset.cat })));
  document.getElementById('filtroModo')?.addEventListener('change', e => aplicarFiltro({ modo: e.target.value }));
  let t = 0;
  document.getElementById('buscarCurso')?.addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { filtro.q = e.target.value; renderCursos(true); }, 160);
  });
}

function temarioHTML(c, abrirPrimero = true) {
  const material = c.cat === 'material';
  return c.modulos.map((mo, i) => {
    const min = mo.clases.reduce((t, cl) => t + cl.duracion, 0);
    const dur = material ? `${mo.clases.length} contenidos` : `${mo.clases.length} ${c.cat === 'curso' ? 'clases' : 'temas'}${min ? ` · ${duracionTxt(min)}` : ''}`;
    return `<details${abrirPrimero && i === 0 ? ' open' : ''}>
      <summary><span class="temario__n">${String(i + 1).padStart(2, '0')}</span><span class="temario__titulo">${esc(mo.titulo)}</span><span class="temario__dur">${dur}</span></summary>
      <ol>${mo.clases.map(cl => `<li>${ICON[cl.tipo] || ICON.vivo}<span>${esc(cl.titulo)}${cl.preview ? `<span class="preview">${material ? 'Muestra gratis' : 'Clase de muestra'}</span>` : ''}</span><small>${cl.tipo === 'pdf' ? 'PDF' : cl.tipo === 'practica' && !cl.duracion ? 'Práctica' : duracionTxt(cl.duracion)}</small></li>`).join('')}</ol>
    </details>`;
  }).join('');
}

function planHTML(c) {
  return `<div class="plan__cab">
      <span class="plan__num" aria-hidden="true">${c.num}</span>
      <div>
        <p class="plan__nivel">Nivel ${esc(NIVELES[c.nivel].toLowerCase())} · ${esc(MODOS[c.modo])}</p>
        <h3 class="plan__titulo">${esc(c.titulo)}</h3>
        <p class="plan__corta">${esc(c.corta)}</p>
        ${metaHTML(c)}
      </div>
    </div>
    <div class="temario">${temarioHTML(c, true)}</div>
    <div class="plan__pie">
      <p class="precio">${formatearPrecio(c.precio)}</p>
      <button type="button" class="btn btn--line" data-ver="${esc(c.id)}">Ver el curso</button>
      <button type="button" class="btn btn--claro" data-inscribir="${esc(c.id)}">Inscribirme</button>
    </div>`;
}

function renderPlanes() {
  document.querySelectorAll('[data-plan]').forEach(el => {
    const c = getCurso(el.dataset.plan);
    if (c) el.innerHTML = planHTML(c);
  });
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco = false) => {
    tabs.forEach(t => {
      const si = t === tab;
      t.setAttribute('aria-selected', String(si));
      t.tabIndex = si ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !si;
    });
    if (foco) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j >= 0) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function syncBotones() {
  const ids = new Set(Cart.get().map(i => i.id));
  document.querySelectorAll('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const dentro = ids.has(c.id);
    const txt = b.querySelector('.add-txt');
    if (!b.dataset.txt) b.dataset.txt = txt ? txt.textContent : b.textContent.trim();
    const nuevo = dentro ? 'En el carrito' : b.dataset.txt;
    if (txt) txt.textContent = nuevo; else b.textContent = nuevo;
    const ico = b.querySelector('.add-ico');
    if (ico) ico.innerHTML = dentro ? ICON.check : ICON.carrito;
    b.classList.toggle('en-carrito', dentro);
    b.setAttribute('aria-label', `${nuevo}: ${c.titulo}`);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

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

function agregar(c) {
  if (!Cart.add(c)) return false;
  showToast(`«${c.titulo}» se sumó a tu carrito`);
  return true;
}

const overlays = new Set();
function bloquearScroll(nombre, si) {
  if (si) overlays.add(nombre); else overlays.delete(nombre);
  document.body.classList.toggle('no-scroll', overlays.size > 0);
}

function atraparFoco(cont, ev) {
  if (ev.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), summary, input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[hidden]') && el.tabIndex !== -1);
  if (!f.length) return;
  const primero = f[0]; const ultimo = f[f.length - 1];
  if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
  else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
}

let focoCarrito = null;
function renderCarrito() {
  const lista = document.getElementById('carritoLista');
  if (!lista) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  lista.innerHTML = items.map(c => `<li class="linea">
    <span class="linea__img"><img src="images/${c.portada}.webp" alt="" width="600" height="800"></span>
    <div><p class="linea__nombre">${esc(c.titulo)}</p><p class="linea__meta">${esc(CATS[c.cat])} · ${esc(MODOS[c.modo])}</p><p class="linea__precio">${formatearPrecio(c.precio)}</p></div>
    <button type="button" class="linea__quitar" data-quitar-item="${esc(c.id)}" aria-label="Quitar ${esc(c.titulo)} del carrito">${ICON.x}</button>
  </li>`).join('');
  lista.hidden = !items.length;
  const vacio = document.getElementById('carritoVacio');
  if (vacio) vacio.hidden = items.length > 0;
  const pie = document.getElementById('carritoPie');
  if (pie) pie.hidden = !items.length;
  const total = document.getElementById('carritoTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirCarrito(trigger) {
  const d = document.getElementById('carrito');
  if (!d) return;
  const desdeModal = !!trigger?.closest?.('#vista');
  focoCarrito = desdeModal ? focoVista : (trigger || document.activeElement);
  if (!document.getElementById('vista')?.hidden) cerrarVista(false);
  renderCarrito();
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto');
  bloquearScroll('carrito', true);
  d.querySelector('.cerrar-x')?.focus();
}

function cerrarCarrito() {
  const d = document.getElementById('carrito');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  bloquearScroll('carrito', false);
  const fin = () => { if (!d.classList.contains('abierto')) d.hidden = true; };
  d.querySelector('.drawer__panel')?.addEventListener('transitionend', fin, { once: true });
  setTimeout(fin, 450);
  focoCarrito?.focus?.();
}

function initCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  d.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrarCarrito));
  d.addEventListener('keydown', ev => atraparFoco(d, ev));
  document.getElementById('carritoLista')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-quitar-item]');
    if (!b) return;
    const c = getCurso(b.dataset.quitarItem);
    Cart.remove(b.dataset.quitarItem);
    renderCarrito();
    if (c) showToast(`Saqué «${c.titulo}» del carrito`);
    (d.querySelector('.linea__quitar') || d.querySelector('.cerrar-x'))?.focus();
  });
  document.getElementById('finalizar')?.addEventListener('click', ev => {
    const b = ev.currentTarget;
    b.disabled = true;
    const txt = b.textContent;
    b.textContent = 'Preparando el pago…';
    setTimeout(() => { b.disabled = false; b.textContent = txt; showToast('El pago con Mercado Pago y el acceso a tus clases se activan al pasar la web a producción.'); }, 750);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

let focoVista = null;
function vistaHTML(c) {
  const lista = arr => `<ul class="vr__lista">${arr.map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>`;
  const min = minutos(c);
  return `<div class="vr__media">
      ${cartaHTML(c, { tag: 'div' })}
      <ul class="vr__datos">
        <li>Formato<strong>${esc(formatoDe(c))}</strong></li>
        <li>Duración<strong>${min ? duracionTxt(min) : 'A tu ritmo'}</strong></li>
        <li>Nivel<strong>${esc(NIVELES[c.nivel])}</strong></li>
        <li>Modalidad<strong>${esc(MODOS[c.modo])}</strong></li>
      </ul>
      <div class="vr__compra">
        <p class="precio">${formatearPrecio(c.precio)}</p>
        <div class="vr__botones">
          ${addBtn(c, 'btn btn--line').replace('>Agregar<', '>Agregar al carrito<')}
          <button type="button" class="btn btn--navy" data-inscribir="${esc(c.id)}">${c.cat === 'material' ? 'Comprar ahora' : 'Inscribirme ahora'}</button>
        </div>
        <a class="btn-link" href="${wa(`¡Hola, Marcela! Quiero consultar por «${c.titulo}».`)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
      </div>
    </div>
    <div class="vr__info">
      <p class="curso__tipo">${esc(CATS[c.cat])} · ${esc(NIVELES[c.nivel])}</p>
      <h2>${esc(c.titulo)}</h2>
      <p class="vr__promesa">${esc(c.corta)}</p>
      <p class="vr__desc">${esc(c.descripcion)}</p>
      <div class="vr__bloque"><h3>Al terminar vas a poder</h3>${lista(c.resultados)}</div>
      <div class="vr__bloque"><h3>${c.cat === 'material' ? 'Qué trae' : 'El programa'}</h3><div class="temario">${temarioHTML(c, false)}</div></div>
      <div class="vr__bloque"><h3>Qué incluye</h3>${lista(c.incluye)}</div>
      <div class="vr__bloque"><h3>Qué necesitás</h3>${lista(c.requisitos)}</div>
      <div class="vr__docente"><span class="quien__ini" aria-hidden="true">M</span><strong>${esc(DOCENTE.nombre)}</strong><span>${esc(DOCENTE.rol)}</span><p>${esc(DOCENTE.bio)}</p></div>
    </div>`;
}

function abrirVista(id, trigger) {
  const c = getCurso(id);
  const mo = document.getElementById('vista');
  const body = document.getElementById('vistaBody');
  if (!c || !mo || !body) return;
  if (mo.hidden) focoVista = trigger || document.activeElement;
  body.innerHTML = vistaHTML(c);
  mo.hidden = false;
  bloquearScroll('vista', true);
  const caja = mo.querySelector('.modal__caja');
  if (caja) caja.scrollTop = 0;
  syncBotones();
  mo.querySelector('.modal__cerrar')?.focus();
  const u = new URL(location.href);
  u.searchParams.set('curso', c.id);
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

function cerrarVista(devolverFoco = true) {
  const mo = document.getElementById('vista');
  if (!mo || mo.hidden) return;
  mo.hidden = true;
  bloquearScroll('vista', false);
  const u = new URL(location.href);
  u.searchParams.delete('curso');
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  if (devolverFoco) focoVista?.focus?.();
}

function initVista() {
  const mo = document.getElementById('vista');
  if (!mo) return;
  mo.querySelectorAll('[data-cerrar-vista]').forEach(b => b.addEventListener('click', () => cerrarVista()));
  mo.addEventListener('keydown', ev => atraparFoco(mo, ev));
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirVista(id, null);
}

function ahoraBA() {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const fecha = new Date(Date.UTC(+p.year, +p.month - 1, +p.day));
    return { fecha, dia: fecha.getUTCDay(), min: (+p.hour % 24) * 60 + +p.minute };
  } catch {
    const d = new Date();
    return { fecha: new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}

function estadoAtencion() {
  const { dia, min } = ahoraBA();
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] * 60 && min < hoy[1] * 60) return { abierto: true, texto: `En horario de atención · hasta las ${hoy[1]} h` };
  if (hoy && min < hoy[0] * 60) return { abierto: false, texto: `Hoy atiendo de ${hoy[0]} a ${hoy[1]} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) return { abierto: false, texto: `Fuera de horario · vuelvo ${k === 1 ? 'mañana' : `el ${DIAS_LARGO[d]}`} a las ${HORARIO[d][0]} h` };
  }
  return { abierto: false, texto: '' };
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoAtencion();
    els.forEach(el => { el.textContent = e.texto; el.classList.toggle('abierto', e.abierto); });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function diasDisponibles() {
  const { fecha, min } = ahoraBA();
  const out = [];
  for (let k = 0; out.length < 6 && k < 14; k++) {
    const f = new Date(fecha.getTime() + k * 864e5);
    const d = f.getUTCDay();
    const h = HORARIO[d];
    if (!h) continue;
    const horas = [];
    for (let x = h[0]; x < h[1]; x++) if (k > 0 || x * 60 >= min + 90) horas.push(x);
    if (!horas.length) continue;
    out.push({ iso: f.toISOString().slice(0, 10), k, d, dd: f.getUTCDate(), mm: f.getUTCMonth() + 1, horas });
  }
  return out;
}

function initTurno() {
  const form = document.getElementById('turno');
  if (!form) return;
  const cta = document.getElementById('turnoCta');
  const resumen = form.querySelector('[data-resumen]');
  const consEl = form.querySelector('[data-consultas]');
  const diasEl = form.querySelector('[data-dias]');
  const horasEl = form.querySelector('[data-horas]');
  if (!consEl || !diasEl || !horasEl) return;
  consEl.innerHTML = CONSULTAS.map(c => `<label class="opcion"><input type="radio" name="consulta" value="${c.id}"${c.id === 'completa' ? ' checked' : ''}><span class="opcion__caja"><strong>${esc(c.titulo)}</strong><small>${esc(c.detalle)} · ${c.duracion}</small><span class="opcion__precio">${formatearPrecio(c.precio)}</span></span></label>`).join('');
  const dias = diasDisponibles();
  const etiqueta = d => (d.k === 0 ? 'Hoy' : d.k === 1 ? 'Mañana' : `${DIAS_CORTO[d.d]} ${d.dd}`);
  diasEl.innerHTML = dias.map((d, i) => `<label class="opcion"><input type="radio" name="dia" value="${d.iso}"${i === 0 ? ' checked' : ''}><span class="opcion__caja">${etiqueta(d)}</span></label>`).join('');
  const valor = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const pintarHoras = () => {
    const d = dias.find(x => x.iso === valor('dia'));
    const prev = Number(valor('hora'));
    const horas = d?.horas || [];
    const elegida = horas.includes(prev) ? prev : horas[Math.min(horas.length - 1, Math.floor(horas.length / 2))];
    horasEl.innerHTML = horas.map(h => `<label class="opcion"><input type="radio" name="hora" value="${h}"${h === elegida ? ' checked' : ''}><span class="opcion__caja">${h} h</span></label>`).join('');
  };
  const actualizar = () => {
    const c = CONSULTAS.find(x => x.id === valor('consulta'));
    const d = dias.find(x => x.iso === valor('dia'));
    const h = valor('hora');
    const modo = valor('modo') === 'whatsapp' ? 'por WhatsApp' : 'por videollamada';
    const nombre = (form.querySelector('input[name="nombre"]')?.value || '').trim();
    if (!c || !d || !h) {
      if (resumen) resumen.textContent = 'Elegí la consulta, el día y el horario.';
      return;
    }
    const fecha = `${DIAS_LARGO[d.d]} ${d.dd}/${d.mm}`;
    if (resumen) resumen.textContent = `${c.titulo} (${c.duracion}) ${modo} · ${d.k === 0 ? 'hoy, ' : d.k === 1 ? 'mañana, ' : ''}${fecha} a las ${h} h · ${formatearPrecio(c.precio)}`;
    if (cta) cta.href = wa(`¡Hola, Marcela! Quiero reservar una consulta: ${c.titulo} (${c.duracion}) ${modo}, para el ${fecha} a las ${h} h.${nombre ? ` Soy ${nombre}.` : ''}`);
  };
  form.addEventListener('change', e => {
    if (e.target.name === 'dia') pintarHoras();
    actualizar();
  });
  form.addEventListener('input', e => { if (e.target.name === 'nombre') actualizar(); });
  form.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.name === 'nombre') { e.preventDefault(); cta?.click(); } });
  pintarHoras();
  actualizar();
}

function elegirModo(modo) {
  const r = document.querySelector(`#turno input[name="modo"][value="${modo}"]`);
  if (!r) return;
  r.checked = true;
  r.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function initDelegacion() {
  document.addEventListener('click', ev => {
    const add = ev.target.closest('[data-add]');
    if (add) {
      const c = getCurso(add.dataset.add);
      if (!c) return;
      if (Cart.has(c.id)) { abrirCarrito(add); return; }
      agregar(c);
      return;
    }
    const ins = ev.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      if (!Cart.has(c.id)) agregar(c);
      abrirCarrito(ins);
      return;
    }
    const ver = ev.target.closest('[data-ver]');
    if (ver) { abrirVista(ver.dataset.ver, ver); return; }
    const open = ev.target.closest('[data-open-cart]');
    if (open) { abrirCarrito(open); return; }
    const limpiar = ev.target.closest('[data-limpiar]');
    if (limpiar) { aplicarFiltro({ cat: '', modo: '', q: '' }); return; }
    const cat = ev.target.closest('[data-filtro-cat]');
    if (cat) aplicarFiltro({ cat: cat.dataset.filtroCat, modo: '', q: '' });
    const modo = ev.target.closest('[data-modo]');
    if (modo) elegirModo(modo.dataset.modo);
  });
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!document.getElementById('vista')?.hidden) { cerrarVista(); return; }
    if (!document.getElementById('carrito')?.hidden) cerrarCarrito();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotones(); });
  window.addEventListener('storage', ev => { if (ev.key === Cart.KEY) { updateCartBadge(); syncBotones(); renderCarrito(); } });
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
  cart?.addEventListener('click', () => abrirCarrito(cart));
  sync();
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
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll('nav', true);
    nav.querySelector('a')?.focus();
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

renderCursos(true);
renderPlanes();
initTabs();
initTurno();
initReveals();
initFiltros();
initEstado();
initDelegacion();
initCarrito();
initVista();
initFloats();
initNav();
initModelBarScroll();
updateCartBadge();
syncBotones();
