document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493837494188';
const CANAL = 'https://www.youtube.com/';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const wsp = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const DISCIPLINAS = [
  {
    id: 'bajo', nombre: 'Bajo eléctrico', foto: 'images/bajo.webp', alt: 'Mano sobre el mástil de un bajo eléctrico',
    paraQuien: 'Chicos desde 7, adolescentes y adultos',
    primeraClase: 'Postura, mano derecha y las dos primeras notas sobre una base grabada.',
    primerMes: ['Pulsar parejo con los dedos', 'Tocar la raíz de cuatro acordes', 'Entrar y salir a tiempo con una base'],
    primerMesIntermedio: ['Escalas mayores en dos posiciones', 'Groove con síncopa y silencios', 'Leer una cifra y sacar la línea'],
    necesitas: 'Un bajo y un cable. Si todavía no lo compraste, vemos juntos qué conviene antes de gastar.',
    cuandoSuena: 'Suena rápido: a la segunda clase ya acompañás un tema completo.'
  },
  {
    id: 'guitarra', nombre: 'Guitarra criolla', foto: 'images/guitarra.webp', alt: 'Boca y cuerdas de una guitarra criolla',
    paraQuien: 'Chicos desde 7, adolescentes y adultos',
    primeraClase: 'Cómo agarrar el mástil sin que duela y el primer acorde con dos dedos.',
    primerMes: ['Cuatro acordes abiertos sin cortar el sonido', 'Rasguido de chacarera y de balada', 'Un tema de punta a punta'],
    primerMesIntermedio: ['Acordes con cejilla y traslados', 'Arpegios y bajo alternado', 'Acompañar una voz en dos tonalidades'],
    necesitas: 'Una criolla de cuerdas de nylon y un banquito. Nada más.',
    cuandoSuena: 'El primer tema completo sale en el primer mes.'
  },
  {
    id: 'percusion', nombre: 'Percusión', foto: 'images/percusion.webp', alt: 'Manos tocando un parche de percusión',
    paraQuien: 'Chicos desde 7, adolescentes y adultos',
    primeraClase: 'Golpe grave y golpe agudo, y el pulso con el pie.',
    primerMes: ['Sostener un pulso parejo dos minutos', 'Tres ritmos base con variantes', 'Acompañar una canción sin apurarse'],
    primerMesIntermedio: ['Ritmos folclóricos: chacarera y zamba', 'Independencia de manos', 'Rellenos y cortes con la banda'],
    necesitas: 'Al principio, las manos y una silla. Después charlamos si conviene un cajón o congas.',
    cuandoSuena: 'Es la que suena mejor el primer día: el ritmo se escucha de entrada.'
  },
  {
    id: 'canto', nombre: 'Canto', foto: 'images/canto.webp', alt: 'Manos sosteniendo un micrófono de estudio',
    paraQuien: 'Adolescentes y adultos',
    primeraClase: 'Respiración baja, apoyo y dos vocalizos cortos para medir tu registro.',
    primerMes: ['Rutina de calentamiento de 10 minutos', 'Afinar frases con acompañamiento', 'Un tema elegido por vos, cantado entero'],
    primerMesIntermedio: ['Pasaje de registro sin quiebre', 'Dinámica y color en la frase', 'Micrófono: distancia y matices'],
    necesitas: 'Nada material: agua y ganas de hacer ruido.',
    cuandoSuena: 'La afinación mejora en las primeras cuatro clases; la voz tarda más y se nota.'
  },
  {
    id: 'piano', nombre: 'Piano', foto: 'images/piano.webp', alt: 'Manos sobre las teclas de un piano',
    paraQuien: 'Chicos desde 7, adolescentes y adultos',
    primeraClase: 'Ubicación en el teclado, mano derecha y una melodía conocida.',
    primerMes: ['Cinco dedos en dos tonalidades', 'Acordes de tríada con la izquierda', 'Una melodía con acompañamiento'],
    primerMesIntermedio: ['Cifrado americano aplicado', 'Inversiones y enlaces de acordes', 'Acompañar una voz o un instrumento'],
    necesitas: 'Un teclado de 61 teclas alcanza para arrancar; si tenés piano, mejor.',
    cuandoSuena: 'Melodía reconocible en la primera clase, las dos manos juntas al mes.'
  },
  {
    id: 'trombon', nombre: 'Trombón', foto: 'images/trombon.webp', alt: 'Dos trombones apoyados junto a partituras',
    paraQuien: 'Adolescentes y adultos',
    primeraClase: 'Embocadura, aire y las primeras notas en primera posición.',
    primerMes: ['Sonido estable en cinco notas', 'Las siete posiciones de la vara', 'Una melodía corta con respiraciones marcadas'],
    primerMesIntermedio: ['Registro agudo sin apretar', 'Legato y staccato', 'Lectura en clave de fa a tempo'],
    necesitas: 'El instrumento y una boquilla propia. Te ayudo a conseguir uno usado en buen estado.',
    cuandoSuena: 'Las primeras semanas son de aire; el sonido redondo llega al segundo mes.'
  },
  {
    id: 'lenguaje', nombre: 'Lenguaje musical', foto: 'images/lenguaje.webp', alt: 'Partituras con notación musical sobre una mesa',
    paraQuien: 'Desde 9 años, adolescentes y adultos',
    primeraClase: 'Pulso, figuras y leer un ritmo sencillo palmeando.',
    primerMes: ['Leer figuras y silencios en 4/4', 'Reconocer tonos y semitonos', 'Escribir el ritmo de una canción'],
    primerMesIntermedio: ['Intervalos y escalas al oído', 'Funciones y cifrado', 'Leer a primera vista en dos claves'],
    necesitas: 'Cuaderno pentagramado y lápiz. Si tocás algo, traelo.',
    cuandoSuena: 'No es para sonar: es para entender lo que ya toca tu instrumento.'
  }
];

const CLASES = [
  { id: 1, slug: 'bajo-desde-cero', disciplinaId: 'bajo', titulo: 'Bajo desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: true, video: true,
    resumen: 'Para el que nunca tocó: postura, pulso y acompañar un tema de entrada.',
    incluye: ['Ejercicios de mano derecha grabados', 'Cuatro bases para practicar en casa', 'Lectura de cifrado básica'] },
  { id: 2, slug: 'bajo-groove', disciplinaId: 'bajo', titulo: 'Bajo · Groove y lectura', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: true,
    resumen: 'Para el que ya toca: síncopa, escalas aplicadas y sacar líneas de oído.',
    incluye: ['Transcripción de una línea por mes', 'Escalas en dos posiciones', 'Trabajo con metrónomo y pistas'] },
  { id: 3, slug: 'bajo-chicos', disciplinaId: 'bajo', titulo: 'Bajo para chicos', nivel: 'Desde cero', quien: ['Chicos'], duracion: 45, destacada: false, video: false,
    resumen: 'Clase de 45 minutos con canciones conocidas y juegos de ritmo.',
    incluye: ['Canciones elegidas con el chico', 'Juegos de pulso y memoria', 'Consigna corta para la semana'] },
  { id: 4, slug: 'guitarra-desde-cero', disciplinaId: 'guitarra', titulo: 'Guitarra criolla desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: true, video: true,
    resumen: 'Los primeros cuatro acordes, dos rasguidos y un tema completo.',
    incluye: ['Cancionero con los acordes marcados', 'Rasguidos de chacarera y balada', 'Cambios de acorde sin cortar'] },
  { id: 5, slug: 'guitarra-folclore', disciplinaId: 'guitarra', titulo: 'Guitarra criolla · Acompañamiento folclórico', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Chacarera, zamba y gato: rasguidos, bajos y cómo acompañar a una voz.',
    incluye: ['Tres ritmos con sus variantes', 'Bajo alternado y arpegios', 'Cejilla y traslado de tonalidad'] },
  { id: 6, slug: 'guitarra-chicos', disciplinaId: 'guitarra', titulo: 'Guitarra para chicos', nivel: 'Desde cero', quien: ['Chicos'], duracion: 45, destacada: false, video: false,
    resumen: 'Guitarra criolla en 45 minutos, con canciones que el chico elige.',
    incluye: ['Acordes de dos dedos', 'Canciones cortas de memoria', 'Ritmo con la mano derecha'] },
  { id: 7, slug: 'percusion-desde-cero', disciplinaId: 'percusion', titulo: 'Percusión desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: true, video: true,
    resumen: 'Pulso, golpes básicos y tres ritmos para acompañar cualquier canción.',
    incluye: ['Golpe grave y agudo parejos', 'Tres ritmos base', 'Práctica con canciones'] },
  { id: 8, slug: 'percusion-folclore', disciplinaId: 'percusion', titulo: 'Percusión · Ritmos folclóricos y latinos', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Chacarera, zamba, candombe y cumbia con independencia de manos.',
    incluye: ['Independencia de manos', 'Cortes y rellenos', 'Tocar con otros sin taparse'] },
  { id: 9, slug: 'percusion-chicos', disciplinaId: 'percusion', titulo: 'Percusión para chicos', nivel: 'Desde cero', quien: ['Chicos'], duracion: 45, destacada: false, video: false,
    resumen: 'La más física de todas: ritmo, cuerpo y canciones en 45 minutos.',
    incluye: ['Juegos de pulso', 'Ritmos simples con las manos', 'Acompañar una canción entera'] },
  { id: 10, slug: 'canto-desde-cero', disciplinaId: 'canto', titulo: 'Canto desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: true, video: true,
    resumen: 'Respiración, apoyo y afinación sobre los temas que querés cantar.',
    incluye: ['Rutina de calentamiento propia', 'Trabajo de afinación con acompañamiento', 'Un tema elegido por vos'] },
  { id: 11, slug: 'canto-repertorio', disciplinaId: 'canto', titulo: 'Canto · Repertorio e interpretación', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Pasaje de registro, dinámica, micrófono y armado de repertorio.',
    incluye: ['Pasaje sin quiebre', 'Color y dinámica en la frase', 'Técnica de micrófono'] },
  { id: 12, slug: 'piano-desde-cero', disciplinaId: 'piano', titulo: 'Piano desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: true,
    resumen: 'Melodía con la derecha, acordes con la izquierda y las dos juntas.',
    incluye: ['Ubicación en el teclado', 'Tríadas y enlaces', 'Una melodía con acompañamiento'] },
  { id: 13, slug: 'piano-armonia', disciplinaId: 'piano', titulo: 'Piano · Armonía aplicada', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Cifrado americano, inversiones y acompañamiento de otros instrumentos.',
    incluye: ['Cifrado aplicado a tus temas', 'Inversiones y voicings', 'Acompañar voz o instrumento'] },
  { id: 14, slug: 'piano-chicos', disciplinaId: 'piano', titulo: 'Piano para chicos', nivel: 'Desde cero', quien: ['Chicos'], duracion: 45, destacada: false, video: false,
    resumen: 'Teclado en 45 minutos: melodías conocidas y lectura de a poco.',
    incluye: ['Cinco dedos y postura', 'Melodías de memoria', 'Primeros pasos de lectura'] },
  { id: 15, slug: 'trombon-desde-cero', disciplinaId: 'trombon', titulo: 'Trombón desde cero', nivel: 'Desde cero', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Embocadura, aire y las siete posiciones, sin apretar los labios.',
    incluye: ['Ejercicios de aire diarios', 'Sonido estable en cinco notas', 'Las siete posiciones'] },
  { id: 16, slug: 'trombon-repertorio', disciplinaId: 'trombon', titulo: 'Trombón · Repertorio y respiración', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Registro agudo, legato y lectura en clave de fa a tempo.',
    incluye: ['Registro sin tensión', 'Legato y staccato', 'Lectura a primera vista'] },
  { id: 17, slug: 'lenguaje-lectura', disciplinaId: 'lenguaje', titulo: 'Lenguaje musical · Lectura y ritmo', nivel: 'Desde cero', quien: ['Chicos', 'Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Leer figuras, sostener el pulso y escribir lo que escuchás.',
    incluye: ['Figuras y silencios en 4/4', 'Dictados rítmicos cortos', 'Escritura de melodías simples'] },
  { id: 18, slug: 'lenguaje-armonia', disciplinaId: 'lenguaje', titulo: 'Lenguaje musical · Armonía para instrumentistas', nivel: 'Intermedio', quien: ['Adolescentes', 'Adultos'], duracion: 60, destacada: false, video: false,
    resumen: 'Para el que ya toca y quiere entender qué está tocando.',
    incluye: ['Intervalos y escalas al oído', 'Funciones y cifrado', 'Análisis de temas propios'] }
];

const AGENDA = [
  { dia: 'Lunes', hora: '10:00', franja: 'mañana', disciplinas: ['lenguaje', 'piano'], libre: true },
  { dia: 'Lunes', hora: '16:00', franja: 'tarde', disciplinas: ['guitarra', 'bajo', 'lenguaje'], libre: true },
  { dia: 'Lunes', hora: '18:00', franja: 'tarde', disciplinas: ['guitarra', 'bajo'], libre: false },
  { dia: 'Lunes', hora: '20:00', franja: 'noche', disciplinas: ['bajo', 'guitarra'], libre: true },
  { dia: 'Martes', hora: '11:00', franja: 'mañana', disciplinas: ['canto', 'trombon'], libre: true },
  { dia: 'Martes', hora: '17:00', franja: 'tarde', disciplinas: ['canto', 'piano'], libre: false },
  { dia: 'Martes', hora: '19:00', franja: 'noche', disciplinas: ['canto', 'trombon'], libre: true },
  { dia: 'Miércoles', hora: '09:00', franja: 'mañana', disciplinas: ['piano', 'lenguaje'], libre: true },
  { dia: 'Miércoles', hora: '16:30', franja: 'tarde', disciplinas: ['percusion', 'bajo'], libre: true },
  { dia: 'Miércoles', hora: '18:30', franja: 'tarde', disciplinas: ['percusion', 'guitarra'], libre: false },
  { dia: 'Miércoles', hora: '20:30', franja: 'noche', disciplinas: ['percusion', 'bajo'], libre: true },
  { dia: 'Jueves', hora: '10:30', franja: 'mañana', disciplinas: ['trombon', 'lenguaje'], libre: false },
  { dia: 'Jueves', hora: '17:00', franja: 'tarde', disciplinas: ['piano', 'canto', 'lenguaje'], libre: true },
  { dia: 'Jueves', hora: '19:30', franja: 'noche', disciplinas: ['guitarra', 'canto'], libre: true },
  { dia: 'Viernes', hora: '16:00', franja: 'tarde', disciplinas: ['guitarra', 'percusion', 'bajo'], libre: true },
  { dia: 'Viernes', hora: '18:00', franja: 'tarde', disciplinas: ['piano', 'trombon'], libre: true },
  { dia: 'Sábado', hora: '10:00', franja: 'mañana', disciplinas: ['guitarra', 'percusion', 'canto', 'bajo'], libre: true },
  { dia: 'Sábado', hora: '12:00', franja: 'mañana', disciplinas: ['piano', 'lenguaje', 'trombon'], libre: false }
];

const VIDEOS = [
  { titulo: 'Una clase de bajo, completa', disciplinaId: 'bajo', detalle: 'Cómo se trabaja la mano derecha en los primeros 20 minutos.' },
  { titulo: 'Rasguido de chacarera, paso a paso', disciplinaId: 'guitarra', detalle: 'El movimiento lento y después a tempo, con la cuenta cantada.' },
  { titulo: 'Percusión: tres ritmos para arrancar', disciplinaId: 'percusion', detalle: 'Grave, agudo y pulso con el pie sobre una canción.' }
];

const getDisciplina = id => DISCIPLINAS.find(d => d.id === id);
const getClase = slug => CLASES.find(c => c.slug === slug);
const clasesDe = id => CLASES.filter(c => c.disciplinaId === id);

const ICONOS = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round"/></svg>'
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `${ICONOS.check}<span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

/* ---------- hero: banner con mensajes que pasan ---------- */
function initHero() {
  const cont = document.getElementById('heroRot');
  const dots = document.getElementById('heroDots');
  if (!cont || !dots) return;
  const msgs = [...cont.querySelectorAll('.hero-msg')];
  if (msgs.length < 2) return;
  let i = 0;
  let timer = null;
  dots.innerHTML = msgs.map((m, n) => `<li role="presentation"><button type="button" role="tab" aria-selected="${n === 0}" aria-label="Mensaje ${n + 1}"><i></i></button></li>`).join('');
  const botones = [...dots.querySelectorAll('button')];
  const mostrar = n => {
    i = (n + msgs.length) % msgs.length;
    msgs.forEach((m, x) => m.classList.toggle('activa', x === i));
    botones.forEach((b, x) => b.setAttribute('aria-selected', x === i ? 'true' : 'false'));
  };
  const arrancar = () => {
    if (reduceMotion) return;
    detener();
    timer = window.setInterval(() => mostrar(i + 1), 5200);
  };
  const detener = () => { if (timer) { window.clearInterval(timer); timer = null; } };
  botones.forEach((b, n) => b.addEventListener('click', () => { mostrar(n); arrancar(); }));
  cont.addEventListener('pointerenter', detener);
  cont.addEventListener('pointerleave', arrancar);
  document.addEventListener('visibilitychange', () => (document.hidden ? detener() : arrancar()));
  mostrar(0);
  arrancar();
}

/* ---------- círculos de disciplinas ---------- */
function initCirculos() {
  const cont = document.getElementById('circulos');
  if (!cont) return;
  cont.innerHTML = DISCIPLINAS.map(d => `
    <li class="circulo" data-circulo="${d.id}" data-animate style="opacity:0;transform:translateY(18px)">
      <button type="button" data-disciplina="${d.id}" aria-label="Ver las clases de ${esc(d.nombre)}">
        <span class="circulo-foto"><img src="${d.foto}" alt="${esc(d.alt)}" width="1200" height="1200" decoding="async"></span>
        <span class="circulo-nombre">${esc(d.nombre)}</span>
        <span class="circulo-dato">${clasesDe(d.id).length} clases</span>
      </button>
    </li>`).join('');
  cont.addEventListener('click', e => {
    const btn = e.target.closest('[data-disciplina]');
    if (!btn) return;
    aplicarDisciplina(btn.dataset.disciplina);
  });
}

function marcarCirculo(id) {
  document.querySelectorAll('[data-circulo]').forEach(li => {
    li.classList.toggle('activo', li.dataset.circulo === id);
  });
}

/* ---------- card de clase ---------- */
function claseCardHTML(c) {
  const d = getDisciplina(c.disciplinaId);
  const msg = `Hola Impulso Musical, quiero consultar por la clase «${c.titulo}» (${c.nivel}, ${c.duracion} minutos). ¿Qué horarios tenés libres?`;
  return `<article class="clase-card" data-animate style="opacity:0;transform:translateY(18px)">
    <div class="clase-media">
      <img src="${d?.foto}" alt="${esc(d?.alt || c.titulo)}" width="1200" height="1200" decoding="async">
      <span class="cinta ${c.nivel === 'Desde cero' ? 'cinta-cian' : 'cinta-amarilla'}">${esc(c.nivel)}</span>
      ${c.video ? `<a class="clase-play" href="${CANAL}" target="_blank" rel="noopener" aria-label="Ver el video de ${esc(c.titulo)}">${ICONOS.play}</a>` : ''}
    </div>
    <div class="clase-cuerpo">
      <p class="clase-disciplina">${esc(d?.nombre || '')}</p>
      <h3 class="clase-titulo">${esc(c.titulo)}</h3>
      <p class="clase-meta"><span>${c.duracion} min</span><span>${esc(c.quien.join(' · '))}</span></p>
      <p class="clase-resumen">${esc(c.resumen)}</p>
      <div class="clase-acciones">
        <button type="button" class="btn btn-linea" data-ver-clase="${c.slug}">Ver el detalle</button>
        <a class="btn btn-negro" href="${esc(wsp(msg))}" target="_blank" rel="noopener">Consultar</a>
      </div>
    </div>
  </article>`;
}

/* ---------- rail: por dónde empezar ---------- */
function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacadas = CLASES.filter(c => c.destacada);
  track.innerHTML = destacadas.map(claseCardHTML).join('');

  const vp = document.getElementById('railVp');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp) return;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.querySelector('.clase-card')?.getBoundingClientRect().width || 280) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  let abajo = false, moved = false, x0 = 0, scroll0 = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    abajo = true; moved = false; x0 = e.clientX; scroll0 = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = scroll0 - dx;
  });
  const fin = () => {
    if (!abajo) return;
    abajo = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      const matarClick = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matarClick, { capture: true, once: true });
      setTimeout(() => {
        vp.removeEventListener('click', matarClick, { capture: true });
        vp.classList.remove('dragging');
      }, 60);
    }
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('pointerleave', fin);
}

/* ---------- momento propio: comparador ---------- */
const FILAS_COMP = [
  { id: 'primera', titulo: 'La primera clase', campo: 'primeraClase' },
  { id: 'mes', titulo: 'Qué tocás el primer mes', campo: 'primerMes' },
  { id: 'casa', titulo: 'Qué necesitás en casa', campo: 'necesitas' },
  { id: 'suena', titulo: 'Cuánto tarda en sonar', campo: 'cuandoSuena' },
  { id: 'quien', titulo: 'Para quién es', campo: 'paraQuien' }
];
let compA = 'bajo';
let compB = 'guitarra';

function celdaHTML(d, campo) {
  const valor = d?.[campo];
  if (Array.isArray(valor)) return `<ul>${valor.map(v => `<li><span>${esc(v)}</span></li>`).join('')}</ul>`;
  return `<p>${esc(valor || '')}</p>`;
}

function renderComparador() {
  const cols = document.getElementById('escenaCols');
  const filas = document.getElementById('escenaFilas');
  if (!cols || !filas) return;
  const a = getDisciplina(compA);
  const b = getDisciplina(compB);
  const columna = (d, lado) => {
    const clases = clasesDe(d.id);
    const cortas = clases.some(c => c.duracion === 45);
    return `<div class="escena-col">
      <span class="escena-col-foto"><img src="${d.foto}" alt="${esc(d.alt)}" width="1200" height="1200" decoding="async"></span>
      <div class="escena-col-txt">
        <label class="visually-oculto" for="comp-${lado}">Disciplina ${lado === 'a' ? 'de la izquierda' : 'de la derecha'}</label>
        <select id="comp-${lado}" data-comp="${lado}">
          ${DISCIPLINAS.map(o => `<option value="${o.id}"${o.id === d.id ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('')}
        </select>
        <span class="escena-dato">
          <b data-dato-duracion>${cortas ? '45 o 60 min' : '60 min'}</b>
          <b data-dato-clases>${clases.length} clases</b>
        </span>
      </div>
    </div>`;
  };
  cols.innerHTML = columna(a, 'a') + columna(b, 'b');
  filas.innerHTML = FILAS_COMP.map((f, i) => `
    <div class="comp-fila" data-comp-fila="${i}">
      <p class="comp-fila-tit">${esc(f.titulo)}</p>
      <div class="comp-celdas">
        <div class="comp-celda">${celdaHTML(a, f.campo)}</div>
        <div class="comp-celda">${celdaHTML(b, f.campo)}</div>
      </div>
    </div>`).join('');
  const cta = document.getElementById('escenaCta');
  if (cta) {
    cta.innerHTML = `
      <div class="comp-cta">
        <a class="btn btn-negro" href="${esc(wsp(`Hola Impulso Musical, quiero arrancar con ${a.nombre}. ¿Qué horarios tenés libres?`))}" target="_blank" rel="noopener">Arrancar con ${esc(a.nombre)}</a>
        <a class="btn btn-negro" href="${esc(wsp(`Hola Impulso Musical, quiero arrancar con ${b.nombre}. ¿Qué horarios tenés libres?`))}" target="_blank" rel="noopener">Arrancar con ${esc(b.nombre)}</a>
        <p class="comp-cta-nota">
          <span>¿Seguís dudando entre los dos?</span>
          <a class="link-fuerte" href="${esc(wsp(`Hola Impulso Musical, estoy entre ${a.nombre} y ${b.nombre} y no me decido. ¿Me ayudás a elegir?`))}" target="_blank" rel="noopener">Contame y elegimos juntos <span aria-hidden="true">→</span></a>
        </p>
      </div>`;
  }
  cols.querySelectorAll('[data-comp]').forEach(sel => {
    sel.addEventListener('change', () => {
      const otro = sel.dataset.comp === 'a' ? compB : compA;
      if (sel.value === otro) {
        showToast('Elegí dos disciplinas distintas para comparar.');
        sel.value = sel.dataset.comp === 'a' ? compA : compB;
        return;
      }
      if (sel.dataset.comp === 'a') compA = sel.value; else compB = sel.value;
      renderComparador();
      actualizarProgresoComp();
      revelarNuevos(document.getElementById('escenaFilas'));
    });
  });
  revelarNuevos(filas);
}

function actualizarProgresoComp() {
  const filas = [...document.querySelectorAll('[data-comp-fila]')];
  const salida = document.getElementById('compPaso');
  const barra = document.getElementById('compBarra');
  const rotulo = document.getElementById('compRotulo');
  if (!filas.length || !salida) return;
  const corte = window.innerHeight * 0.42;
  let activa = 0;
  filas.forEach((f, i) => { if (f.getBoundingClientRect().top <= corte) activa = i; });
  filas.forEach((f, i) => f.classList.toggle('activa', i === activa));
  salida.textContent = String(activa + 1);
  if (rotulo) rotulo.textContent = FILAS_COMP[activa]?.titulo || '';
  if (barra) barra.style.width = ((activa + 1) / filas.length * 100).toFixed(1) + '%';
}

function initComparador() {
  const escena = document.getElementById('escena');
  const cols = document.getElementById('escenaCols');
  if (!escena || !cols) return;
  const sticky = document.createElement('div');
  sticky.className = 'escena-sticky';
  sticky.innerHTML = '<div class="escena-sticky-in"></div>';
  const inner = sticky.querySelector('.escena-sticky-in');
  const padre = cols.parentElement;
  if (!padre) return;
  padre.insertBefore(sticky, cols);
  inner.appendChild(cols);
  const progreso = document.createElement('div');
  progreso.className = 'escena-progreso';
  progreso.innerHTML = '<span><b id="compPaso">1</b> de ' + FILAS_COMP.length + '</span><span class="escena-progreso-barra"><i id="compBarra"></i></span><span id="compRotulo"></span>';
  inner.appendChild(progreso);
  renderComparador();
  actualizarProgresoComp();
  window.addEventListener('scroll', actualizarProgresoComp, { passive: true });
  window.addEventListener('resize', actualizarProgresoComp);
}

/* ---------- catálogo con filtros ---------- */
const PAGINA = 16;
let estado = { disciplina: '', nivel: '', quien: '', duracion: '', q: '', orden: 'disciplina', visibles: PAGINA };
let revealsListos = false;

function chipsHTML(id, opciones, activo) {
  return opciones.map(o => `<button type="button" class="chip${String(activo) === String(o.valor) ? ' activo' : ''}" data-filtro="${id}" data-valor="${esc(o.valor)}">${esc(o.label)}</button>`).join('');
}

function pintarFiltros() {
  const d = document.getElementById('fDisciplina');
  const n = document.getElementById('fNivel');
  const q = document.getElementById('fQuien');
  const du = document.getElementById('fDuracion');
  if (d) d.innerHTML = chipsHTML('disciplina', [{ valor: '', label: 'Todas' }, ...DISCIPLINAS.map(x => ({ valor: x.id, label: x.nombre }))], estado.disciplina);
  if (n) n.innerHTML = chipsHTML('nivel', [{ valor: '', label: 'Todos' }, { valor: 'Desde cero', label: 'Desde cero' }, { valor: 'Intermedio', label: 'Intermedio' }], estado.nivel);
  if (q) q.innerHTML = chipsHTML('quien', [{ valor: '', label: 'Todos' }, { valor: 'Chicos', label: 'Chicos' }, { valor: 'Adolescentes', label: 'Adolescentes' }, { valor: 'Adultos', label: 'Adultos' }], estado.quien);
  if (du) du.innerHTML = chipsHTML('duracion', [{ valor: '', label: 'Cualquiera' }, { valor: '45', label: '45 min' }, { valor: '60', label: '60 min' }], estado.duracion);
}

function coincide(c) {
  if (estado.disciplina && c.disciplinaId !== estado.disciplina) return false;
  if (estado.nivel && c.nivel !== estado.nivel) return false;
  if (estado.quien && !c.quien.includes(estado.quien)) return false;
  if (estado.duracion && String(c.duracion) !== String(estado.duracion)) return false;
  if (estado.q) {
    const d = getDisciplina(c.disciplinaId);
    const campos = [c.titulo, c.resumen, c.nivel, c.quien.join(' '), d?.nombre, (c.incluye || []).join(' ')].map(norm).join(' ');
    if (!norm(estado.q).split(/\s+/).filter(Boolean).every(t => campos.includes(t))) return false;
  }
  return true;
}

function ordenar(lista) {
  const copia = [...lista];
  if (estado.orden === 'alfabetico') return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  if (estado.orden === 'duracion') return copia.sort((a, b) => a.duracion - b.duracion || a.titulo.localeCompare(b.titulo, 'es'));
  if (estado.orden === 'cero') return copia.sort((a, b) => (a.nivel === 'Desde cero' ? 0 : 1) - (b.nivel === 'Desde cero' ? 0 : 1) || a.id - b.id);
  const orden = DISCIPLINAS.map(d => d.id);
  return copia.sort((a, b) => orden.indexOf(a.disciplinaId) - orden.indexOf(b.disciplinaId) || a.id - b.id);
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const lista = ordenar(CLASES.filter(coincide));
  const visibles = lista.slice(0, estado.visibles);
  grid.innerHTML = visibles.map(claseCardHTML).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (contador) {
    contador.textContent = lista.length
      ? `${visibles.length} de ${lista.length} ${lista.length === 1 ? 'clase' : 'clases'}`
      : 'Ninguna clase coincide';
  }
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarDisciplina(id) {
  estado.disciplina = estado.disciplina === id ? '' : id;
  estado.visibles = PAGINA;
  marcarCirculo(estado.disciplina);
  pintarFiltros();
  renderCatalogo();
  const url = new URL(location.href);
  if (estado.disciplina) url.searchParams.set('disciplina', estado.disciplina); else url.searchParams.delete('disciplina');
  window.history.replaceState(null, '', url);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  const d = getDisciplina(id);
  if (estado.disciplina && d) showToast(`Catálogo filtrado: ${clasesDe(id).length} clases de ${d.nombre.toLowerCase()}.`);
}

function limpiarFiltros() {
  estado = { disciplina: '', nivel: '', quien: '', duracion: '', q: '', orden: estado.orden, visibles: PAGINA };
  const q = document.getElementById('q');
  if (q) q.value = '';
  marcarCirculo('');
  pintarFiltros();
  renderCatalogo();
  const url = new URL(location.href);
  url.searchParams.delete('disciplina');
  window.history.replaceState(null, '', url);
}

function initCatalogo() {
  pintarFiltros();
  renderCatalogo();
  document.getElementById('filtros')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro]');
    if (!chip) return;
    const clave = chip.dataset.filtro;
    estado[clave] = chip.dataset.valor;
    estado.visibles = PAGINA;
    if (clave === 'disciplina') marcarCirculo(estado.disciplina);
    pintarFiltros();
    renderCatalogo();
  });
  const q = document.getElementById('q');
  q?.addEventListener('input', () => { estado.q = q.value; estado.visibles = PAGINA; renderCatalogo(); });
  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PAGINA; renderCatalogo(); });
  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarFiltros);
  const ft = document.getElementById('filtrosToggle');
  ft?.addEventListener('click', () => {
    const panel = document.getElementById('filtros');
    const abierto = panel?.classList.toggle('abierto');
    ft.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  const buscarHeader = document.getElementById('headerBuscar');
  buscarHeader?.addEventListener('submit', e => {
    e.preventDefault();
    const valor = document.getElementById('qHeader')?.value || '';
    estado.q = valor;
    estado.visibles = PAGINA;
    if (q) q.value = valor;
    renderCatalogo();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

/* ---------- componente funcional: armá tu clase ---------- */
function horariosPara(disciplinaId, franja) {
  return AGENDA.filter(s => s.disciplinas.includes(disciplinaId) && (!franja || s.franja === franja));
}

function armarClase() {
  const panel = document.getElementById('armarPanel');
  if (!panel) return null;
  const dId = document.getElementById('aDisciplina')?.value || DISCIPLINAS[0].id;
  const nivel = document.getElementById('aNivel')?.value || 'Desde cero';
  const quien = document.getElementById('aQuien')?.value || 'Adultos';
  const franja = document.getElementById('aFranja')?.value || '';
  const d = getDisciplina(dId);
  if (!d) return null;
  const duracion = quien === 'Chicos' ? 45 : 60;
  const plan = nivel === 'Intermedio' ? d.primerMesIntermedio : d.primerMes;
  const slots = horariosPara(dId, franja);
  const libres = slots.filter(s => s.libre);
  const clase = CLASES.find(c => c.disciplinaId === dId && c.nivel === nivel && c.quien.includes(quien))
    || CLASES.find(c => c.disciplinaId === dId && c.nivel === nivel)
    || clasesDe(dId)[0];
  const sinCupo = quien === 'Chicos' && !d.paraQuien.toLowerCase().includes('chicos');
  const msg = `Hola Impulso Musical, quiero una clase de ${d.nombre} (${nivel.toLowerCase()}, ${quien.toLowerCase()}, ${duracion} minutos)`
    + (franja ? ` en la franja de la ${franja}` : '')
    + (libres.length ? `. Vi libre ${libres[0].dia} ${libres[0].hora}` : '')
    + '. ¿Lo coordinamos?';
  panel.innerHTML = `
    <p class="armar-panel-tit">${esc(d.nombre)} · ${esc(nivel.toLowerCase())}</p>
    <p class="armar-dato">
      <b>${duracion} minutos</b>
      <b>${libres.length} ${libres.length === 1 ? 'horario libre' : 'horarios libres'}</b>
      <b>1 vez por semana</b>
    </p>
    ${sinCupo ? '<p class="nota">Esta disciplina arranca a partir de los 9 años; para los más chicos conviene percusión, guitarra o piano.</p>' : ''}
    <div class="armar-bloque">
      <p class="tit">El primer mes</p>
      <ul>${plan.map(p => `<li><span>${esc(p)}</span></li>`).join('')}</ul>
    </div>
    <div class="armar-bloque">
      <p class="tit">Qué necesitás</p>
      <ul><li><span>${esc(d.necesitas)}</span></li></ul>
    </div>
    <div class="armar-bloque">
      <p class="tit">Horarios ${franja ? 'de la ' + esc(franja) : 'de la semana'}</p>
      ${slots.length ? `<div class="horarios">${slots.map(s => `<span class="horario${s.libre ? ' libre' : ''}">${esc(s.dia)} ${esc(s.hora)}${s.libre ? '' : ' · tomado'}</span>`).join('')}</div>`
        : '<p class="nota">En esa franja no hay clases de esta disciplina. Probá otra franja o escribime y vemos.</p>'}
    </div>
    <a class="btn btn-cta btn-bloque" href="${esc(wsp(msg))}" target="_blank" rel="noopener">Consultar este horario</a>
    ${clase ? `<button type="button" class="btn btn-linea btn-bloque" data-ver-clase="${clase.slug}">Ver la clase completa</button>` : ''}
    <p class="nota">Los horarios son de muestra para el demo: en producción los cargás vos desde el panel.</p>`;
  return { dId, nivel, quien, franja, duracion, libres: libres.length };
}

function initArmar() {
  const sel = document.getElementById('aDisciplina');
  if (sel) sel.innerHTML = DISCIPLINAS.map(d => `<option value="${d.id}">${esc(d.nombre)}</option>`).join('');
  ['aDisciplina', 'aNivel', 'aQuien', 'aFranja'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', armarClase);
  });
  armarClase();
}

/* ---------- videos ---------- */
function initVideos() {
  const cont = document.getElementById('videosGrid');
  if (!cont) return;
  cont.innerHTML = VIDEOS.map(v => {
    const d = getDisciplina(v.disciplinaId);
    return `<li data-animate style="opacity:0;transform:translateY(18px)">
      <a class="video-card" href="${CANAL}" target="_blank" rel="noopener">
        <span class="video-media">
          <img src="${d?.foto}" alt="${esc(d?.alt || v.titulo)}" width="1200" height="1200" decoding="async">
          <span class="video-play"><span>${ICONOS.play}</span></span>
        </span>
        <span class="video-cuerpo">
          <h3>${esc(v.titulo)}</h3>
          <p>${esc(v.detalle)}</p>
        </span>
      </a>
    </li>`;
  }).join('');
}

/* ---------- modal de la clase ---------- */
let ultimoFoco = null;

function trapFoco(cont, e) {
  const foco = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null);
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function cerrarModal() {
  const bd = document.getElementById('modalBackdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  document.getElementById('schema-modal')?.remove();
  ultimoFoco?.focus();
}

function abrirClase(slug) {
  const c = getClase(slug);
  const bd = document.getElementById('modalBackdrop');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!c || !bd || !cuerpo) return;
  const d = getDisciplina(c.disciplinaId);
  const slots = horariosPara(c.disciplinaId, '').filter(s => s.libre).slice(0, 4);
  const msg = `Hola Impulso Musical, quiero consultar por la clase «${c.titulo}» (${c.nivel}, ${c.duracion} minutos). ¿Qué horarios tenés libres?`;
  ultimoFoco = document.activeElement;
  document.getElementById('modalTit').textContent = c.titulo;
  cuerpo.innerHTML = `
    <div class="ficha">
      <div>
        <div class="ficha-media">
          <img src="${d?.foto}" alt="${esc(d?.alt || c.titulo)}" width="1200" height="1200" decoding="async">
        </div>
        ${c.video ? `<a class="btn btn-linea btn-bloque" href="${CANAL}" target="_blank" rel="noopener" style="margin-top:.7rem">Ver el video</a>` : ''}
      </div>
      <div>
        <div class="ficha-chips">
          <span class="cinta ${c.nivel === 'Desde cero' ? 'cinta-cian' : 'cinta-amarilla'}">${esc(c.nivel)}</span>
          <span class="cinta">${c.duracion} minutos</span>
          <span class="cinta">${esc(c.quien.join(' · '))}</span>
        </div>
        <h3>${esc(c.titulo)}</h3>
        <p>${esc(c.resumen)}</p>
        <div class="ficha-bloque">
          <p class="tit">Qué incluye</p>
          <ul>${c.incluye.map(i => `<li><span>${esc(i)}</span></li>`).join('')}</ul>
        </div>
        <div class="ficha-bloque">
          <p class="tit">${c.nivel === 'Intermedio' ? 'En qué vas a trabajar' : 'Qué tocás el primer mes'}</p>
          <ul>${(c.nivel === 'Intermedio' ? d.primerMesIntermedio : d.primerMes).map(i => `<li><span>${esc(i)}</span></li>`).join('')}</ul>
        </div>
        <div class="ficha-bloque">
          <p class="tit">Qué necesitás</p>
          <ul><li><span>${esc(d.necesitas)}</span></li></ul>
        </div>
        ${slots.length ? `<div class="ficha-bloque">
          <p class="tit">Horarios libres</p>
          <div class="horarios">${slots.map(s => `<span class="horario libre">${esc(s.dia)} ${esc(s.hora)}</span>`).join('')}</div>
        </div>` : ''}
        <div class="ficha-acciones">
          <a class="btn btn-cta" href="${esc(wsp(msg))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
          <button type="button" class="btn btn-linea" data-ir-armar="${c.disciplinaId}">Ver horarios de ${esc(d.nombre.toLowerCase())}</button>
        </div>
      </div>
    </div>`;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  bd.querySelector('.modal').scrollTop = 0;
  document.getElementById('modalClose')?.focus();

  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: c.titulo, serviceType: 'Clase de música',
    description: c.resumen,
    provider: { '@type': 'MusicSchool', name: 'Impulso Musical', telephone: '+54' + WSP.slice(2) },
    areaServed: 'AR', audience: { '@type': 'Audience', audienceType: c.quien.join(', ') }
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'schema-modal';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
}

function initModal() {
  const bd = document.getElementById('modalBackdrop');
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  bd?.addEventListener('click', e => { if (e.target === bd) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (!bd || bd.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trapFoco(bd, e);
  });
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver-clase]');
    if (ver) { abrirClase(ver.dataset.verClase); return; }
    const ir = e.target.closest('[data-ir-armar]');
    if (ir) {
      const sel = document.getElementById('aDisciplina');
      if (sel) { sel.value = ir.dataset.irArmar; armarClase(); }
      cerrarModal();
      document.getElementById('armar')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
}

/* ---------- formulario ---------- */
function initForm() {
  const form = document.getElementById('form');
  const sel = document.getElementById('fClase');
  if (sel) {
    sel.innerHTML = '<option value="">Todavía no lo sé</option>' +
      DISCIPLINAS.map(d => `<optgroup label="${esc(d.nombre)}">${clasesDe(d.id).map(c => `<option value="${esc(c.titulo)}">${esc(c.titulo)}</option>`).join('')}</optgroup>`).join('');
  }
  if (!form) return;
  const mostrarError = (campo, msg) => {
    const salida = form.querySelector(`[data-error-de="${campo.id}"]`);
    if (salida) salida.textContent = msg;
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('fNombre');
    const email = document.getElementById('fEmail');
    const mensaje = document.getElementById('fMensaje');
    let ok = true;
    if (!nombre.value.trim()) { mostrarError(nombre, 'Poné tu nombre así sé cómo llamarte.'); ok = false; } else mostrarError(nombre, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { mostrarError(email, 'Revisá el correo: falta algo.'); ok = false; } else mostrarError(email, '');
    if (mensaje.value.trim().length < 8) { mostrarError(mensaje, 'Contame un poco más, aunque sea una línea.'); ok = false; } else mostrarError(mensaje, '');
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = document.getElementById('formEnviar');
    const textoOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = textoOriginal;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
  form.querySelectorAll('input, textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      if (campo.getAttribute('aria-invalid') === 'true') mostrarError(campo, '');
    });
  });
}

/* ---------- nav, flotante, reveals ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.35)}s`;
    el.classList.add('in');
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.63)}s`;
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

function initMovimiento() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero .cinta', { opacity: 0, y: -14, duration: .6 })
    .from('.hero-tit', { opacity: 0, y: 28, duration: 1, clearProps: 'all' }, '-=.35')
    .from('.hero-btns .btn', { opacity: 0, y: 14, duration: .6, stagger: .09, clearProps: 'all' }, '-=.55')
    .from('.hero-dots', { opacity: 0, duration: .5, clearProps: 'all' }, '-=.35');
  gsap.fromTo('.hero-foto img', { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.publico-foto img').forEach(img => {
      gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, {
        yPercent: 4, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: img.closest('.publico-foto'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

function initDeepLinks() {
  const params = new URLSearchParams(location.search);
  const disciplina = params.get('disciplina');
  const clase = params.get('clase');
  if (disciplina && getDisciplina(disciplina)) {
    estado.disciplina = disciplina;
    marcarCirculo(disciplina);
    pintarFiltros();
    renderCatalogo();
  }
  if (clase && getClase(clase)) abrirClase(clase);
}

initHero();
initCirculos();
initRail();
initComparador();
initCatalogo();
initArmar();
initVideos();
initForm();
initReveals();
initModal();
initNav();
initWspFloat();
initMovimiento();
initDeepLinks();
const anio = document.getElementById('anio');
if (anio) anio.textContent = String(new Date().getFullYear());
