document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5491165643315';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const SEMANA = [1, 2, 3, 4, 5, 6];

const CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'arrancar', label: 'Para arrancar' },
  { id: 'fuerza', label: 'Fuerza' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'movilidad', label: 'Movilidad' },
  { id: 'medida', label: 'Pases y 1 a 1' }
];

const CLASES = [
  {
    id: 'full-body', titulo: 'Funcional full body', cat: 'fuerza', catLabel: 'Fuerza y resistencia', nivel: 'Todos los niveles', duracion: 60,
    img: 'images/02_clase-cuadrada.webp', alt: 'Alumna haciendo una estocada lateral con pelota medicinal en una clase grupal', badge: 'La más completa',
    promesa: 'Fuerza, cardio y core en la misma hora, con un circuito que cambia cada semana.',
    descripcion: 'Es la clase base de LAU_GYM10: trabajás todo el cuerpo con kettlebells, bandas y tu propio peso, en estaciones que se adaptan a tu nivel. Cada ejercicio tiene una versión más simple y una más exigente.',
    paraQuien: 'Querés entrenar todo el cuerpo dos o tres veces por semana y notar cómo mejora tu fuerza mes a mes.',
    paraQuienNo: 'Buscás solo estirar o venís de una lesión sin el alta médica: arrancá por Movilidad y core o escribinos.',
    horarios: [[1, '08:00'], [3, '08:00'], [5, '08:00'], [1, '19:00'], [3, '19:00'], [5, '19:00']],
    opciones: [{ id: '2', label: '2 veces por semana', precio: 28000 }, { id: '3', label: '3 veces por semana', precio: 34000 }],
    bloques: [
      { titulo: 'Entrada en calor', dur: '10 min', items: ['Movilidad de tobillos, cadera y hombros', 'Activación de core en el piso', 'Trote suave y desplazamientos'] },
      { titulo: 'Circuito principal', dur: '40 min', items: ['Sentadilla y peso muerto con kettlebell', 'Remo y empuje con bandas', 'Estocadas, saltos y planchas por tiempo'] },
      { titulo: 'Vuelta a la calma', dur: '10 min', items: ['Elongación guiada', 'Respiración para bajar pulsaciones', 'Qué viene en la próxima clase'] }
    ],
    incluye: ['Plan de la clase según la semana del mes', 'Corrección de técnica en cada estación', 'Versión más simple o más exigente de cada ejercicio']
  },
  {
    id: 'desde-cero', titulo: 'Funcional desde cero', cat: 'arrancar', catLabel: 'Para arrancar', nivel: 'Inicial', duracion: 50,
    img: 'images/03_sentadillas.webp', alt: 'Alumna haciendo una sentadilla profunda con las manos juntas frente al grupo', badge: 'Para arrancar',
    promesa: 'Aprendé los movimientos base sin apuro y con la técnica corregida desde el primer día.',
    descripcion: 'Pensada para quien nunca entrenó o vuelve después de mucho tiempo. Trabajamos sentadilla, bisagra de cadera, empujes y tracciones con poco peso, para que en unas semanas puedas sumarte a cualquier clase del parque.',
    paraQuien: 'Nunca hiciste funcional, te cuesta arrancar por tu cuenta o querés retomar con calma.',
    paraQuienNo: 'Ya entrenás seguido y buscás intensidad: probá Funcional full body o Circuito intenso.',
    horarios: [[2, '09:00'], [4, '09:00'], [2, '18:00'], [4, '18:00']],
    opciones: [{ id: '2', label: '2 veces por semana', precio: 26000 }],
    bloques: [
      { titulo: 'Entrada en calor', dur: '10 min', items: ['Movilidad articular de pies a cabeza', 'Ejercicios de equilibrio', 'Caminata y trote suave'] },
      { titulo: 'Técnica', dur: '30 min', items: ['Sentadilla al banco', 'Bisagra de cadera con palo', 'Empuje y tracción con bandas livianas'] },
      { titulo: 'Cierre', dur: '10 min', items: ['Core en el piso', 'Elongación', 'Consejos para la semana'] }
    ],
    incluye: ['Progresión semana a semana', 'Corrección de cerca en cada ejercicio', 'Te avisamos cuándo pasar a Full body']
  },
  {
    id: 'kettlebell', titulo: 'Fuerza con kettlebell', cat: 'fuerza', catLabel: 'Fuerza', nivel: 'Intermedio', duracion: 60,
    img: 'images/04_fuerza.webp', alt: 'Alumna levantando una kettlebell desde el piso en posición de sentadilla', badge: '',
    promesa: 'Más fuerza en piernas, espalda y agarre con el elemento más completo del funcional.',
    descripcion: 'Swing, peso muerto, sentadilla goblet y remo: los movimientos de kettlebell explicados paso a paso, con cargas que suben a medida que dominás la técnica.',
    paraQuien: 'Ya hiciste funcional y querés sumar carga y trabajar la fuerza con método.',
    paraQuienNo: 'Tenés dolor de espalda sin diagnóstico o nunca entrenaste: empezá por Funcional desde cero.',
    horarios: [[2, '19:30'], [4, '19:30']],
    opciones: [{ id: '2', label: '2 veces por semana', precio: 30000 }],
    bloques: [
      { titulo: 'Entrada en calor', dur: '10 min', items: ['Movilidad de cadera y columna', 'Activación de glúteos', 'Swing liviano para tomar ritmo'] },
      { titulo: 'Fuerza', dur: '35 min', items: ['Peso muerto y sentadilla goblet', 'Swing a dos manos', 'Remo y press por series'] },
      { titulo: 'Cierre', dur: '15 min', items: ['Caminatas con carga y core', 'Elongación de espalda y piernas', 'Anotamos las cargas del día'] }
    ],
    incluye: ['Cargas que suben cuando la técnica está firme', 'Registro de tus pesos de cada semana', 'Corrección en cada serie']
  },
  {
    id: 'circuito', titulo: 'Circuito intenso', cat: 'cardio', catLabel: 'Cardio e intensidad', nivel: 'Avanzado', duracion: 45,
    img: 'images/06_circuito.webp', alt: 'Alumna trabajando con sogas de batalla entre conos durante un circuito', badge: '',
    promesa: 'Estaciones cortas y por tiempo para mejorar la resistencia y salir con todo hecho.',
    descripcion: 'Sogas, saltos, desplazamientos y trabajo en parejas en estaciones intensas. La intensidad la ponés vos: cada estación tiene una opción de menor impacto.',
    paraQuien: 'Ya entrenás y querés una clase corta, intensa y con mucha energía de grupo.',
    paraQuienNo: 'Estás empezando o tenés molestias en las rodillas: mejor Funcional full body, donde el ritmo es más parejo.',
    horarios: [[1, '20:00'], [3, '20:00'], [6, '10:00']],
    opciones: [{ id: '2', label: '2 veces por semana', precio: 28000 }, { id: '3', label: '3 veces por semana', precio: 34000 }],
    bloques: [
      { titulo: 'Entrada en calor', dur: '8 min', items: ['Movilidad dinámica', 'Saltos suaves y skipping', 'Activación de hombros'] },
      { titulo: 'Estaciones', dur: '30 min', items: ['Sogas de batalla y burpees', 'Desplazamientos entre conos', 'Postas en parejas'] },
      { titulo: 'Cierre', dur: '7 min', items: ['Caminata para bajar pulsaciones', 'Elongación', 'Hidratación y charla de cierre'] }
    ],
    incluye: ['Opción de menor impacto en cada estación', 'Trabajo en parejas y en equipo', 'Circuito distinto cada semana']
  },
  {
    id: 'movilidad', titulo: 'Movilidad y core', cat: 'movilidad', catLabel: 'Movilidad', nivel: 'Todos los niveles', duracion: 50,
    img: 'images/05_movilidad.webp', alt: 'Alumnos haciendo una torsión sentados sobre colchonetas', badge: '',
    promesa: 'Cadera, columna y hombros más sueltos, y un centro firme que te cuida en el resto de las clases.',
    descripcion: 'Una clase más tranquila para ganar rango de movimiento y fortalecer el core sin impacto. Sirve como complemento de cualquier otra clase o para cerrar la semana.',
    paraQuien: 'Sentís el cuerpo rígido, pasás muchas horas frente a la compu o querés complementar las clases de fuerza.',
    paraQuienNo: 'Buscás transpirar y subir pulsaciones: para eso está Circuito intenso.',
    horarios: [[5, '09:00'], [6, '09:00']],
    opciones: [{ id: '1', label: '1 vez por semana', precio: 16000 }, { id: '2', label: '2 veces por semana', precio: 24000 }],
    bloques: [
      { titulo: 'Respiración y movilidad', dur: '15 min', items: ['Respiración diafragmática', 'Movilidad de columna en cuadrupedia', 'Rotaciones de cadera'] },
      { titulo: 'Core', dur: '20 min', items: ['Planchas y variantes', 'Antirrotación con banda', 'Puentes de glúteo'] },
      { titulo: 'Elongación', dur: '15 min', items: ['Cadena posterior', 'Hombros y pecho', 'Relajación final'] }
    ],
    incluye: ['Sin impacto ni saltos', 'Ejercicios que podés repetir en casa', 'Ideal para combinar con Full body o Fuerza']
  },
  {
    id: 'personal', titulo: 'Personal trainer 1 a 1', cat: 'medida', catLabel: 'A tu medida', nivel: 'Todos los niveles', duracion: 60,
    img: 'images/07_profesoras.webp', alt: 'Dos profesoras revisando un plan de entrenamiento con una libreta y una notebook', badge: '1 a 1',
    horarioTexto: 'Día y horario a coordinar', lugar: 'A coordinar', legend: '¿Cuántas sesiones por semana?',
    promesa: 'Un plan armado para vos, con una profe dedicada solo a tu entrenamiento.',
    descripcion: 'Arrancamos con una charla sobre tu objetivo, tu historial y tus horarios, y armamos el plan. Las sesiones se coordinan en el día y el horario que te queden cómodos.',
    paraQuien: 'Tenés un objetivo puntual, horarios que no coinciden con las clases o preferís entrenar sin grupo.',
    paraQuienNo: 'Lo que buscás es entrenar en grupo: las clases del parque te van a gustar más.',
    horarios: [],
    opciones: [{ id: '1', label: '1 sesión por semana', precio: 40000 }, { id: '2', label: '2 sesiones por semana', precio: 72000 }],
    bloques: [
      { titulo: 'Primera charla', dur: '20 min', items: ['Objetivo y punto de partida', 'Lesiones y actividad previa', 'Días y horarios disponibles'] },
      { titulo: 'Sesiones', dur: '60 min', items: ['Plan de fuerza a tu medida', 'Ajustes según cómo te sentís cada semana', 'Ejercicios para hacer por tu cuenta'] },
      { titulo: 'Seguimiento', dur: 'Todo el mes', items: ['Revisamos cómo venís cada semana', 'Subimos la carga cuando corresponde', 'Nuevo plan al terminar el mes'] }
    ],
    incluye: ['Plan personalizado', 'Horario que se adapta a vos', 'Seguimiento semana a semana']
  },
  {
    id: 'pase-libre', titulo: 'Pase libre', cat: 'medida', catLabel: 'Pases', nivel: 'Todos los niveles', duracion: 0,
    img: 'images/09_comunidad.webp', alt: 'Grupo de alumnos chocando las manos al terminar una clase', badge: 'Todas las clases',
    horarioTexto: 'Todas las clases de la pizarra', metaTexto: 'Las 5 clases grupales · Parque Domínico', duracionTexto: 'Según la clase', legend: 'Plan',
    promesa: 'Entrá a todas las clases grupales de la semana y armá tu propia rutina.',
    descripcion: 'Con el pase libre venís a Funcional full body, Funcional desde cero, Fuerza con kettlebell, Circuito intenso y Movilidad y core, los días y horarios que quieras.',
    paraQuien: 'Querés entrenar más de tres veces por semana o combinar fuerza, circuito y movilidad.',
    paraQuienNo: 'Venís una o dos veces por semana a la misma clase: te conviene el plan de esa clase.',
    horarios: [],
    opciones: [{ id: 'libre', label: 'Todo el mes', precio: 42000 }],
    bloques: [
      { titulo: 'Para la fuerza', dur: 'Lun a jue', items: ['Funcional full body', 'Fuerza con kettlebell', 'Funcional desde cero'] },
      { titulo: 'Para el cardio', dur: 'Lun, mié y sáb', items: ['Circuito intenso', 'Postas en parejas', 'Estaciones por tiempo'] },
      { titulo: 'Para recuperar', dur: 'Vie y sáb', items: ['Movilidad y core', 'Elongación guiada', 'Respiración'] }
    ],
    incluye: ['Las 5 clases grupales', 'Cambiás de horario cuando quieras', 'Una sola cuota por mes']
  },
  {
    id: 'clase-suelta', titulo: 'Clase suelta', cat: 'medida', catLabel: 'Pases', nivel: 'Todos los niveles', duracion: 0,
    img: 'images/08_equipamiento.webp', alt: 'Kettlebells, mancuernas, bandas y una colchoneta listas para la clase', badge: '',
    horarioTexto: 'El horario que elijas de la pizarra', metaTexto: 'Una clase · Parque Domínico', duracionTexto: 'Según la clase', legend: 'Plan', sufijo: 'la clase',
    promesa: 'Vení a una clase de la pizarra y conocé cómo entrenamos antes de elegir tu plan.',
    descripcion: 'Elegís el día y el horario de cualquier clase grupal, nos avisás por WhatsApp y te esperamos en el parque.',
    paraQuien: 'Querés conocer el grupo y la forma de trabajar, o venís por una semana puntual.',
    paraQuienNo: 'Ya sabés que vas a venir todas las semanas: con un plan mensual organizás mejor tu semana.',
    horarios: [],
    opciones: [{ id: '1', label: 'Una clase', precio: 7000 }],
    bloques: [
      { titulo: 'Antes de venir', dur: 'Por WhatsApp', items: ['Elegís la clase en la pizarra', 'Nos contás si tenés alguna lesión', 'Te pasamos el punto de encuentro'] },
      { titulo: 'En la clase', dur: 'Según la clase', items: ['Entrada en calor', 'Bloque principal', 'Vuelta a la calma'] },
      { titulo: 'Después', dur: 'Cuando quieras', items: ['Te recomendamos la clase que va con vos', 'Elegís tu plan', 'Te sumás a la pizarra'] }
    ],
    incluye: ['Cualquier clase grupal de la semana', 'Recomendación de plan al terminar', 'Punto de encuentro en el Monumento a Sarmiento']
  }
];

const getClase = id => CLASES.find(c => c.id === id);
const esGrupal = c => !!c && c.horarios.length > 0;
const incluidaEnPase = c => esGrupal(c) || c?.id === 'clase-suelta';
const hora = h => h.replace(/^0/, '');
const aMinutos = h => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const listaY = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
const precioDesde = c => Math.min(...c.opciones.map(o => o.precio));
const opcionDe = (c, opt) => c.opciones.find(o => o.id === opt) || c.opciones[0];

function horariosTexto(c) {
  if (!c.horarios.length) return c.horarioTexto || '';
  const porHora = {};
  c.horarios.forEach(([d, h]) => { (porHora[h] = porHora[h] || []).push(d); });
  const grupos = {};
  Object.keys(porHora).sort().forEach(h => {
    const k = porHora[h].sort((a, b) => a - b).join(',');
    (grupos[k] = grupos[k] || []).push(h);
  });
  const partes = Object.entries(grupos)
    .sort((a, b) => Number(a[0].split(',')[0]) - Number(b[0].split(',')[0]))
    .map(([k, hs]) => [listaY(k.split(',').map(d => DIAS_CORTO[d])), listaY(hs.map(hora))]);
  if (partes.length === 1) return partes[0][0] + ' · ' + partes[0][1];
  return partes.map(p => p[0] + ' ' + p[1]).join(' · ');
}

function metaTexto(c) {
  if (c.metaTexto) return c.metaTexto;
  return `${c.duracion} min · ${c.lugar || 'Parque Domínico'}`;
}

function turnosDe(c) {
  if (!c.horarios.length) return ['manana', 'tarde'];
  return [...new Set(c.horarios.map(([, h]) => (aMinutos(h) < 13 * 60 ? 'manana' : 'tarde')))];
}

function slotsDelDia(d) {
  const out = [];
  CLASES.forEach(c => c.horarios.forEach(([dd, h]) => { if (dd === d) out.push({ id: c.id, titulo: c.titulo, hora: h, nivel: c.nivel, duracion: c.duracion }); }));
  return out.sort((a, b) => a.hora.localeCompare(b.hora));
}

const Cart = {
  KEY: 'laugym10_cart',
  mem: [],
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return (Array.isArray(v) ? v : this.mem).filter(i => getClase(i.id));
    } catch {
      return this.mem.filter(i => getClase(i.id));
    }
  },
  save(items) {
    this.mem = items.map(i => ({ ...i }));
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.mem = items.map(i => ({ ...i })); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  set(id, opt) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (it) it.opt = opt; else items.push({ id, opt });
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getClase(i.id); return c ? s + opcionDe(c, i.opt).precio : s; }, 0); }
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
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function cardHTML(c, i) {
  const desde = c.opciones.length > 1 ? '<span class="clase-desde">desde</span> ' : '';
  const badge = c.badge ? `<span class="badge${c.cat === 'arrancar' ? ' badge--verde' : ''}">${esc(c.badge)}</span>` : '';
  return `<article class="clase-card" data-id="${c.id}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <span class="clase-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <button class="clase-foto" type="button" data-ver="${c.id}" aria-label="Ver ${esc(c.titulo)}">
      <img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000">${badge}
    </button>
    <div class="clase-body">
      <p class="clase-cat">${esc(c.catLabel)} · ${esc(c.nivel)}</p>
      <h3 class="clase-titulo">${esc(c.titulo)}</h3>
      <p class="clase-dias">${esc(horariosTexto(c))}</p>
      <p class="clase-meta">${esc(metaTexto(c))}</p>
      <div class="clase-pie">
        <p class="clase-precio">${desde}${formatearPrecio(precioDesde(c))} <small>${esc(c.sufijo || '/mes')}</small></p>
        <div class="clase-acciones">
          <button class="btn btn--ghost btn--sm" type="button" data-ver="${c.id}">Ver clase</button>
          <button class="btn btn--primary btn--sm" type="button" data-anotar="${c.id}">Anotarme</button>
        </div>
      </div>
    </div>
  </article>`;
}

const filtros = { cat: 'todas', turno: 'todos', q: '' };

function initClases() {
  const grid = document.getElementById('clasesGrid');
  if (!grid) return;
  grid.innerHTML = CLASES.map(cardHTML).join('');
  const chips = document.getElementById('chipsCat');
  if (chips) {
    chips.innerHTML = CATEGORIAS.map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === 'todas'}">${esc(c.label)}</button>`).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      filtros.cat = b.dataset.cat;
      aplicarFiltros();
    });
  }
  document.querySelectorAll('[data-turno]').forEach(b => b.addEventListener('click', () => { filtros.turno = b.dataset.turno; aplicarFiltros(); }));
  const buscar = document.getElementById('buscarClase');
  if (buscar) buscar.addEventListener('input', () => { filtros.q = buscar.value; aplicarFiltros(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    filtros.cat = 'todas'; filtros.turno = 'todos'; filtros.q = '';
    if (buscar) buscar.value = '';
    aplicarFiltros();
  }));
}

function aplicarFiltros() {
  const grid = document.getElementById('clasesGrid');
  if (!grid) return;
  const q = normalizar(filtros.q.trim());
  const terminos = q ? q.split(/\s+/) : [];
  let visibles = 0;
  grid.querySelectorAll('.clase-card').forEach(card => {
    const c = getClase(card.dataset.id);
    if (!c) { card.hidden = true; return; }
    const texto = normalizar([c.titulo, c.catLabel, c.nivel, c.promesa, c.descripcion, horariosTexto(c), c.horarios.map(([d]) => DIAS[d]).join(' ')].join(' '));
    const ok = (filtros.cat === 'todas' || c.cat === filtros.cat)
      && (filtros.turno === 'todos' || turnosDe(c).includes(filtros.turno))
      && terminos.every(t => texto.includes(t));
    card.hidden = !ok;
    if (ok) visibles++;
  });
  document.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === filtros.cat)));
  document.querySelectorAll('[data-turno]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.turno === filtros.turno)));
  const activos = filtros.cat !== 'todas' || filtros.turno !== 'todos' || !!q;
  const contador = document.getElementById('clasesContador');
  if (contador) contador.textContent = activos ? `${visibles} de ${CLASES.length} clases` : `${CLASES.length} clases`;
  document.querySelectorAll('.link-limpiar[data-limpiar]').forEach(b => { b.hidden = !activos; });
  const vacio = document.getElementById('clasesVacio');
  if (vacio) vacio.hidden = visibles > 0;
  revelarNuevos(grid);
}

function initPizarra() {
  const cont = document.getElementById('pizarraDias');
  const tabs = document.getElementById('pizarraTabs');
  if (!cont) return;
  const hoy = new Date().getDay();
  const activo = hoy === 0 ? 1 : hoy;
  if (tabs) {
    tabs.innerHTML = SEMANA.map(d => `<button type="button" role="tab" class="pizarra-tab" id="tab-dia-${d}" aria-controls="dia-${d}" aria-selected="${d === activo}" tabindex="${d === activo ? 0 : -1}" data-dia="${d}"><span>${DIAS_CORTO[d]}</span>${d === hoy ? '<span class="tab-hoy">hoy</span>' : ''}</button>`).join('');
  }
  cont.innerHTML = SEMANA.map(d => `<div class="dia${d === activo ? ' activo' : ''}${d === hoy ? ' es-hoy' : ''}" id="dia-${d}" role="tabpanel" aria-labelledby="tab-dia-${d}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="dia-head"><h3 class="dia-nombre">${DIAS[d]}</h3>${d === hoy ? '<span class="dia-hoy">Hoy</span>' : ''}</div>
    <ul class="slots">${slotsDelDia(d).map(s => `<li><button type="button" class="slot" data-ver="${s.id}"><span class="slot-hora">${hora(s.hora)}</span><span class="slot-clase">${esc(s.titulo)}</span><span class="slot-meta">${s.duracion} min · ${esc(s.nivel)}</span></button></li>`).join('')}</ul>
  </div>`).join('');
  if (!tabs) return;
  const botones = [...tabs.querySelectorAll('[role="tab"]')];
  const activar = (b, foco) => {
    botones.forEach(x => {
      const on = x === b;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls'))?.classList.toggle('activo', on);
    });
    if (foco) b.focus();
    revelarNuevos(cont);
  };
  botones.forEach(b => b.addEventListener('click', () => activar(b)));
  tabs.addEventListener('keydown', e => {
    const i = botones.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); activar(botones[(i + 1) % botones.length], true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); activar(botones[(i - 1 + botones.length) % botones.length], true); }
  });
}

function initHoy() {
  const lista = document.getElementById('hoyLista');
  const titulo = document.getElementById('hoyTitulo');
  if (!lista) return;
  const ahora = new Date();
  let d = ahora.getDay();
  let esHoy = true;
  if (d === 0) { d = 1; esHoy = false; }
  const slots = slotsDelDia(d);
  const mins = ahora.getHours() * 60 + ahora.getMinutes();
  const proxima = esHoy ? slots.findIndex(s => aMinutos(s.hora) > mins) : 0;
  if (titulo) titulo.textContent = esHoy ? `Hoy, ${DIAS[d]}` : 'Hoy descansamos · el lunes';
  lista.innerHTML = slots.map((s, k) => {
    const paso = esHoy && aMinutos(s.hora) + s.duracion <= mins;
    return `<li><button type="button" class="hoy-slot${paso ? ' paso' : ''}" data-ver="${s.id}"><span class="hoy-hora">${hora(s.hora)}</span><span class="hoy-clase">${esc(s.titulo)}</span>${k === proxima ? '<span class="hoy-tag">Próxima</span>' : ''}</button></li>`;
  }).join('');
  const nota = document.getElementById('hoyNota');
  if (nota) nota.hidden = !(esHoy && proxima === -1);
}

function initProgramaTabs() {
  document.querySelectorAll('.programa-tabs').forEach(lista => {
    const botones = [...lista.querySelectorAll('[role="tab"]')];
    const activar = (b, foco) => {
      botones.forEach(x => {
        const on = x === b;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (foco) b.focus();
    };
    botones.forEach(b => b.addEventListener('click', () => activar(b)));
    lista.addEventListener('keydown', e => {
      const i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); activar(botones[(i + 1) % botones.length], true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activar(botones[(i - 1 + botones.length) % botones.length], true); }
    });
  });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !cont.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirCapa(el) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
}
function cerrarCapa(el) {
  el.classList.remove('open');
  setTimeout(() => {
    if (!el.classList.contains('open')) el.hidden = true;
  }, 380);
  const otraAbierta = [...document.querySelectorAll('.modal, .drawer')].some(x => x !== el && x.classList.contains('open'));
  if (!otraAbierta) document.body.classList.remove('no-scroll');
}

let focoModal = null;
let claseAbierta = null;

function modalHTML(c) {
  const enCarrito = Cart.get().find(i => i.id === c.id);
  const sel = enCarrito ? enCarrito.opt : c.opciones[0].id;
  const precioSel = opcionDe(c, sel).precio;
  const frecuencia = c.opciones.length > 1
    ? `<fieldset class="mc-frecuencia"><legend>${esc(c.legend || '¿Cuántas veces por semana?')}</legend>${c.opciones.map(o => `<label class="mc-opcion"><input type="radio" name="frecuencia" value="${o.id}"${o.id === sel ? ' checked' : ''}><span>${esc(o.label)}</span><strong>${formatearPrecio(o.precio)}</strong></label>`).join('')}</fieldset>`
    : `<p class="mc-unica">${esc(c.opciones[0].label)}</p>`;
  const msg = `Hola LAU_GYM10, quiero consultar por ${c.titulo} (${horariosTexto(c)}).`;
  return `<div class="mc-top">
    <figure class="mc-foto"><img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000"></figure>
    <div class="mc-info">
      <p class="mc-cat">${esc(c.catLabel)} · ${esc(c.nivel)}</p>
      <h2 class="mc-titulo">${esc(c.titulo)}</h2>
      <p class="mc-promesa">${esc(c.promesa)}</p>
      <dl class="mc-datos">
        <div><dt>Días y horarios</dt><dd>${esc(horariosTexto(c))}</dd></div>
        <div><dt>Duración</dt><dd>${c.duracion ? c.duracion + ' min' : esc(c.duracionTexto)}</dd></div>
        <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
        <div><dt>Dónde</dt><dd>${c.lugar ? esc(c.lugar) : 'Parque Domínico, Av. Mitre 4800'}</dd></div>
      </dl>
      ${frecuencia}
      <div class="mc-compra">
        <p class="mc-precio"><span id="mcPrecio">${formatearPrecio(precioSel)}</span> <small>${esc(c.sufijo || 'por mes')}</small></p>
        <button class="btn btn--primary" type="button" data-mc-anotar="${c.id}">${enCarrito ? 'Actualizar inscripción' : 'Anotarme'}</button>
        <a class="btn btn--ghost" href="${waLink(msg)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    </div>
  </div>
  <div class="mc-cuerpo">
    <p class="mc-desc">${esc(c.descripcion)}</p>
    <div class="mc-quien">
      <div><h3>Es para vos si…</h3><p>${esc(c.paraQuien)}</p></div>
      <div><h3>Mejor otra opción si…</h3><p>${esc(c.paraQuienNo)}</p></div>
    </div>
    <h3 class="mc-sub">Cómo es por dentro</h3>
    <div class="mc-bloques">${c.bloques.map((b, k) => `<details${k === 0 ? ' open' : ''}><summary><span>${esc(b.titulo)}</span><small>${esc(b.dur)}</small></summary><ul>${b.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></details>`).join('')}</div>
    <h3 class="mc-sub">Qué incluye</h3>
    <ul class="mc-incluye">${c.incluye.map(it => `<li>${esc(it)}</li>`).join('')}</ul>
  </div>`;
}

function actualizarURL(id) {
  try {
    const u = new URL(location.href);
    if (id) u.searchParams.set('clase', id); else u.searchParams.delete('clase');
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  } catch {
    return;
  }
}

function abrirClase(id, origen) {
  const c = getClase(id);
  const modal = document.getElementById('claseModal');
  const cont = document.getElementById('modalContenido');
  if (!c || !modal || !cont) return;
  if (!modal.classList.contains('open')) focoModal = origen || document.activeElement;
  claseAbierta = c.id;
  cont.innerHTML = modalHTML(c);
  cont.scrollTop = 0;
  abrirCapa(modal);
  modal.querySelector('.modal-panel')?.focus({ preventScroll: true });
  actualizarURL(c.id);
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('claseModal');
  if (!modal || modal.hidden) return;
  cerrarCapa(modal);
  claseAbierta = null;
  actualizarURL(null);
  if (devolverFoco && focoModal && document.contains(focoModal)) focoModal.focus({ preventScroll: true });
}

function initModal() {
  const modal = document.getElementById('claseModal');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-modal]')) { cerrarModal(); return; }
    const an = e.target.closest('[data-mc-anotar]');
    if (an) {
      const sel = modal.querySelector('input[name="frecuencia"]:checked');
      const origen = focoModal;
      cerrarModal(false);
      anotar(an.dataset.mcAnotar, sel ? sel.value : null);
      if (origen && document.contains(origen)) focoDrawer = origen;
    }
  });
  modal.addEventListener('change', e => {
    if (e.target.name !== 'frecuencia') return;
    const c = getClase(claseAbierta);
    const p = document.getElementById('mcPrecio');
    if (c && p) p.textContent = formatearPrecio(opcionDe(c, e.target.value).precio);
  });
}

function anotar(id, opt) {
  const c = getClase(id);
  if (!c) return;
  let items = Cart.get();
  if (incluidaEnPase(c) && items.some(i => i.id === 'pase-libre')) {
    showToast('Ya tenés el pase libre: esa clase está incluida.');
    abrirDrawer();
    return;
  }
  if (c.id === 'pase-libre' && items.some(i => incluidaEnPase(getClase(i.id)))) {
    items = items.filter(i => !incluidaEnPase(getClase(i.id)));
    Cart.save(items);
    showToast('El pase libre ya incluye las clases grupales: las sacamos de tu inscripción.');
  }
  const previa = items.find(i => i.id === id);
  const elegida = opt || (previa ? previa.opt : c.opciones[0].id);
  Cart.set(id, opcionDe(c, elegida).id);
  if (previa && previa.opt !== elegida) showToast(`Actualizamos ${c.titulo}: ${opcionDe(c, elegida).label.toLowerCase()}.`);
  abrirDrawer();
}

let focoDrawer = null;
function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  if (!drawer.classList.contains('open')) focoDrawer = document.activeElement;
  renderDrawer();
  abrirCapa(drawer);
  drawer.querySelector('.drawer-panel')?.focus({ preventScroll: true });
}
function cerrarDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer || drawer.hidden) return;
  cerrarCapa(drawer);
  if (focoDrawer && document.contains(focoDrawer)) focoDrawer.focus({ preventScroll: true });
}

function renderDrawer() {
  const cont = document.getElementById('drawerItems');
  const pie = document.getElementById('drawerPie');
  if (!cont || !pie) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = `<div class="drawer-vacio"><strong>Todavía no elegiste</strong><p>Sumá una clase de la pizarra y la ves acá.</p><a class="btn btn--primary btn--sm" href="#clases" data-cerrar-drawer>Ver las clases</a></div>`;
    pie.innerHTML = '';
    return;
  }
  cont.innerHTML = items.map(i => {
    const c = getClase(i.id);
    const o = opcionDe(c, i.opt);
    const selector = c.opciones.length > 1
      ? `<label class="item-opcion"><span class="sr-only">Frecuencia de ${esc(c.titulo)}</span><select data-opt="${c.id}">${c.opciones.map(x => `<option value="${x.id}"${x.id === o.id ? ' selected' : ''}>${esc(x.label)}</option>`).join('')}</select></label>`
      : `<p class="item-opcion-fija">${esc(o.label)}</p>`;
    return `<div class="item">
      <img src="${c.img}" alt="" width="64" height="64">
      <div class="item-info"><p class="item-titulo">${esc(c.titulo)}</p><p class="item-horario">${esc(horariosTexto(c))}</p>${selector}</div>
      <div class="item-der"><p class="item-precio">${formatearPrecio(o.precio)}</p><button class="item-quitar" type="button" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></div>
    </div>`;
  }).join('');
  const conSuelta = items.some(i => i.id === 'clase-suelta');
  pie.innerHTML = `<div class="drawer-total"><span>${conSuelta ? 'Total' : 'Total por mes'}</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer-nota">${conSuelta ? 'Las clases y los pases se pagan por mes; la clase suelta, una sola vez.' : 'Pagás el mes y te esperamos en el parque en los horarios de tu clase.'}</p>
    <button class="btn btn--primary" type="button" data-finalizar>Finalizar inscripción</button>
    <a class="btn btn--ghost" href="${waLink('Hola LAU_GYM10, tengo una consulta antes de inscribirme.')}" target="_blank" rel="noopener">Consultar antes por WhatsApp</a>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const c = getClase(q.dataset.quitar);
      Cart.remove(q.dataset.quitar);
      renderDrawer();
      if (c) showToast(`Sacamos ${c.titulo} de tu inscripción.`);
      drawer.querySelector('.drawer-panel')?.focus({ preventScroll: true });
      return;
    }
    const fin = e.target.closest('[data-finalizar]');
    if (fin) {
      fin.disabled = true;
      fin.textContent = 'Procesando…';
      setTimeout(() => {
        fin.disabled = false;
        fin.textContent = 'Finalizar inscripción';
        showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
      }, 800);
    }
  });
  drawer.addEventListener('change', e => {
    const s = e.target.closest('[data-opt]');
    if (!s) return;
    Cart.set(s.dataset.opt, s.value);
    renderDrawer();
  });
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirDrawer));
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
document.addEventListener('cart:updated', updateCartBadge);

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

function initDelegacion() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { e.preventDefault(); abrirClase(ver.dataset.ver, ver); return; }
    const an = e.target.closest('[data-anotar]');
    if (an) anotar(an.dataset.anotar);
  });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('claseModal');
    const drawer = document.getElementById('cartDrawer');
    if (modal && modal.classList.contains('open')) {
      if (e.key === 'Escape') { cerrarModal(); return; }
      atraparFoco(modal, e);
      return;
    }
    if (drawer && drawer.classList.contains('open')) {
      if (e.key === 'Escape') { cerrarDrawer(); return; }
      atraparFoco(drawer, e);
    }
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6933, -58.331];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false }).setView(centro, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'LAU_GYM10' }).addTo(mapa).bindPopup('<strong>LAU_GYM10</strong><br>Monumento a Sarmiento · Av. Mitre 4800');
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('clase');
  if (id && getClase(id)) abrirClase(id, null);
}

[initClases, initPizarra, initHoy, initProgramaTabs, initReveals, initNav, initFloats, initModelBarScroll, initDelegacion, initModal, initDrawer, updateCartBadge, initMapa, initDeepLink]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
