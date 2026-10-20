document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5492976214301';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const LINEAS = {
  td: { label: 'Tiro defensivo', perfil: 'Para civiles' },
  lu: { label: 'Legítimos usuarios', perfil: 'Para legítimos usuarios' },
  pf: { label: 'Personal de fuerzas', perfil: 'Para fuerzas e instituciones' }
};

const TIPOS = {
  aula: { label: 'Clase en aula', svg: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>' },
  seco: { label: 'Práctica en seco', svg: '<circle cx="12" cy="12" r="9"/><path d="M21 12h-4M7 12H3M12 7V3M12 21v-4"/>' },
  practica: { label: 'Práctica guiada', svg: '<path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>' },
  poligono: { label: 'Polígono', svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>' },
  evaluacion: { label: 'Evaluación', svg: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>' }
};

const cl = (titulo, dur, tipo) => ({ titulo, dur, tipo });

const CURSOS = [
  {
    id: 'td-1', codigo: 'TD·01', linea: 'td', titulo: 'Tiro defensivo · Nivel 1', nivel: 'Inicial', formato: 'Teórico-práctico',
    minutos: 360, encuentros: '2 encuentros de 3 h', precio: 120000, destacado: true, badge: 'Para empezar',
    img: 'images/01_proteccion-cuadrada.webp', alt: 'Protector auditivo y anteojos de seguridad sobre la mesada de un polígono de tiro',
    corta: 'Desarrollá conocimientos y habilidades para un manejo seguro y responsable.',
    promesa: 'Aprendé a manipular y disparar con seguridad: primero las normas en el aula, después la práctica en la línea de tiro.',
    descripcion: 'Es el punto de partida de la academia. Trabajamos las reglas de seguridad, los comandos del polígono y los fundamentos del tiro —postura, empuñe, alineación de miras y control del disparador— hasta que salgan con naturalidad, con el instructor cerca en cada ejercicio.',
    paraQuien: 'Nunca disparaste, o lo hiciste pocas veces, y querés aprender bien desde la base.',
    paraQuienNo: 'Ya tirás seguido y buscás trabajar recargas o interrupciones: mirá el Nivel 2.',
    resultados: ['Manipular un arma corta con las reglas de seguridad incorporadas', 'Sostener una postura y un empuñe estables', 'Agrupar tus disparos a 5 y 7 metros'],
    requisitos: ['No hace falta experiencia previa', 'DNI', 'Protección auditiva y visual (si no tenés, consultanos)'],
    incluye: ['Apunte del módulo teórico', 'Práctica en seco guiada antes del polígono', 'Devolución individual al terminar'],
    modulos: [
      { titulo: 'Seguridad y normas del polígono', clases: [cl('Las reglas de seguridad', 45, 'aula'), cl('Comandos y conducta en la línea de tiro', 30, 'aula'), cl('Equipo de protección y su uso', 15, 'aula')] },
      { titulo: 'Fundamentos del tiro', clases: [cl('Postura y empuñe', 40, 'seco'), cl('Alineación de miras', 40, 'seco'), cl('Control del disparador', 40, 'seco')] },
      { titulo: 'Práctica en el polígono', clases: [cl('Tiro de precisión a 5 metros', 60, 'poligono'), cl('Tiro a 7 metros con ritmo propio', 60, 'poligono'), cl('Evaluación y devolución individual', 30, 'evaluacion')] }
    ]
  },
  {
    id: 'td-2', codigo: 'TD·02', linea: 'td', titulo: 'Tiro defensivo · Nivel 2', nivel: 'Intermedio', formato: 'Teórico-práctico',
    minutos: 360, encuentros: '2 encuentros de 3 h', precio: 150000, previo: 'td-1', nota: 'Pide el Nivel 1 aprobado o una evaluación previa',
    img: 'images/06_blanco.webp', alt: 'Blanco de tiro de círculos concéntricos en un polígono al aire libre',
    corta: 'Precisión con tiempo, recargas y manejo de interrupciones.',
    promesa: 'Sumá velocidad sin perder precisión: recargas, interrupciones y tiro con las dos manos.',
    descripcion: 'Retoma los fundamentos del Nivel 1 y los pone bajo tiempo. Practicamos recargas, cómo resolver una interrupción, el tiro con mano hábil y no hábil y la toma de decisiones frente a blancos que cambian.',
    paraQuien: 'Hiciste el Nivel 1 o ya tirás seguido y querés ganar confianza y consistencia.',
    paraQuienNo: 'Es tu primera vez en un polígono: empezá por el Nivel 1.',
    resultados: ['Resolver una interrupción sin perder la línea de seguridad', 'Recargar con fluidez', 'Mantener la precisión con tiempo marcado'],
    requisitos: ['Nivel 1 aprobado o evaluación previa con un instructor', 'DNI', 'Protección auditiva y visual'],
    incluye: ['Evaluación inicial para ajustar los ejercicios', 'Registro de tus resultados por ejercicio', 'Devolución individual al terminar'],
    modulos: [
      { titulo: 'Repaso y diagnóstico', clases: [cl('Repaso de seguridad y fundamentos', 30, 'aula'), cl('Ejercicio de diagnóstico', 45, 'poligono'), cl('Objetivos para el curso', 15, 'aula')] },
      { titulo: 'Recargas e interrupciones', clases: [cl('Recargas: cuándo y cómo', 45, 'seco'), cl('Interrupciones: identificar y resolver', 45, 'seco'), cl('Práctica con munición', 60, 'poligono')] },
      { titulo: 'Precisión con tiempo', clases: [cl('Tiro con mano hábil y no hábil', 45, 'poligono'), cl('Blancos múltiples y toma de decisiones', 45, 'poligono'), cl('Evaluación final', 30, 'evaluacion')] }
    ]
  },
  {
    id: 'td-3', codigo: 'TD·03', linea: 'td', titulo: 'Tiro en baja luminosidad', nivel: 'Avanzado', formato: 'Práctico',
    minutos: 240, encuentros: '1 encuentro de 4 h', precio: 95000, previo: 'td-2', nota: 'Pide el Nivel 2 aprobado',
    img: 'images/04_gafas.webp', alt: 'Anteojos de seguridad transparentes sobre una mesa oscura',
    corta: 'Linterna, identificación del blanco y tiro con poca luz.',
    promesa: 'Practicá lo que casi nadie entrena: identificar, iluminar y decidir cuando hay poca luz.',
    descripcion: 'La mayoría de las situaciones reales no pasan a pleno sol. Trabajamos el uso de la linterna, la identificación del blanco antes de disparar y la práctica en el polígono con la luz reducida, paso a paso y con el instructor marcando cada ejercicio.',
    paraQuien: 'Completaste el Nivel 2 y querés llevar lo aprendido a condiciones más exigentes.',
    paraQuienNo: 'Todavía no tenés firmes las recargas y las interrupciones: hacé primero el Nivel 2.',
    resultados: ['Identificar el blanco antes de cualquier disparo', 'Combinar linterna y arma con técnicas seguras', 'Moverte en la línea con la luz reducida'],
    requisitos: ['Nivel 2 aprobado', 'Linterna de mano (consultanos el modelo)', 'Protección auditiva y visual'],
    incluye: ['Charla previa sobre identificación del blanco', 'Ejercicios en seco con la linterna', 'Práctica guiada con luz reducida'],
    modulos: [
      { titulo: 'Identificación y criterio', clases: [cl('Por qué la luz cambia todo', 20, 'aula'), cl('Identificación del blanco', 20, 'aula'), cl('Seguridad con visibilidad reducida', 20, 'aula')] },
      { titulo: 'Técnicas con linterna', clases: [cl('Tomas de linterna', 25, 'seco'), cl('Encender, mirar y apagar', 25, 'seco'), cl('Desplazamiento con poca luz', 25, 'seco')] },
      { titulo: 'Práctica con luz reducida', clases: [cl('Precisión con linterna', 45, 'poligono'), cl('Blancos con luz intermitente', 30, 'poligono'), cl('Ejercicio integrador y devolución', 30, 'evaluacion')] }
    ]
  },
  {
    id: 'td-4', codigo: 'TD·04', linea: 'td', titulo: 'Defensa en el hogar: prevención y decisiones', nivel: 'Inicial', formato: 'Teórico',
    minutos: 180, encuentros: '1 encuentro de 3 h', precio: 45000, badge: 'Sin práctica de tiro',
    img: 'images/08_botiquin.webp', alt: 'Bolso de primeros auxilios azul y paquetes de gasas en un estante',
    corta: 'Prevención, marco legal y qué hacer antes, durante y después.',
    promesa: 'Pensá tu casa con criterio: prevención, guarda segura, marco legal y primera respuesta ante una lesión.',
    descripcion: 'Un curso teórico para quien tiene un arma en casa y para quienes conviven con ella: cómo prevenir situaciones de riesgo, cómo guardar el arma para que nadie más acceda, qué dice la ley sobre la legítima defensa y cómo actuar ante una lesión hasta que llegue la ayuda.',
    paraQuien: 'Tenés o vas a tener un arma en casa y querés que todos sepan cómo prevenir y cómo actuar.',
    paraQuienNo: 'Buscás practicar tiro: este curso es solo teórico, mirá el Nivel 1.',
    resultados: ['Un plan de prevención para tu casa', 'Criterios claros de guarda segura', 'Los primeros pasos ante una lesión hasta que llegue la ayuda'],
    requisitos: ['No hace falta experiencia ni arma propia', 'DNI'],
    incluye: ['Guía de prevención para el hogar', 'Lista de control de guarda segura', 'Espacio para preguntas sobre tu caso'],
    modulos: [
      { titulo: 'Prevención', clases: [cl('Evaluar los riesgos de tu casa', 25, 'aula'), cl('Rutinas y acuerdos con quienes conviven', 20, 'aula'), cl('Qué hacer ante un ruido extraño', 15, 'aula')] },
      { titulo: 'Marco legal y guarda', clases: [cl('Legítima defensa: qué dice la ley', 30, 'aula'), cl('Guarda segura y acceso restringido', 20, 'aula'), cl('Después de un incidente', 15, 'aula')] },
      { titulo: 'Primera respuesta', clases: [cl('Botiquín básico y su uso', 20, 'aula'), cl('Control de hemorragias', 25, 'practica'), cl('Cierre y preguntas', 10, 'aula')] }
    ]
  },
  {
    id: 'lu-1', codigo: 'LU·01', linea: 'lu', titulo: 'Formación de legítimos usuarios', nivel: 'Inicial', formato: 'Teórico-práctico',
    minutos: 360, encuentros: '2 encuentros de 3 h', precio: 110000, destacado: true, badge: 'Teoría + práctica',
    img: 'images/03_aula.webp', alt: 'Aula con mesas, sillas y pizarra blanca lista para una clase teórica',
    corta: 'Conocé los aspectos teóricos y prácticos para una tenencia responsable.',
    promesa: 'Llegá al examen de idoneidad con la normativa clara, la manipulación segura incorporada y la práctica hecha.',
    descripcion: 'Para quien inicia el trámite de legítimo usuario o quiere hacerlo bien informado. Repasamos la ley de armas y lo que exige el trámite, la manipulación, el mantenimiento, la guarda y el transporte, y practicamos en el polígono hasta que el tiro sea seguro y preciso.',
    paraQuien: 'Vas a tramitar la credencial de legítimo usuario por primera vez y querés llegar preparado.',
    paraQuienNo: 'Ya sos legítimo usuario y solo necesitás practicar para renovar: mirá la Práctica de idoneidad para renovación.',
    resultados: ['Entender qué te habilita la credencial y qué no', 'Manipular, limpiar y guardar un arma con seguridad', 'Tirar con precisión respetando las normas del polígono'],
    requisitos: ['No hace falta experiencia previa', 'DNI', 'Protección auditiva y visual'],
    incluye: ['Apunte de normativa para estudiar', 'Práctica en seco y en el polígono', 'Orientación sobre la documentación del trámite'],
    modulos: [
      { titulo: 'Normativa', clases: [cl('La ley de armas y sus categorías', 45, 'aula'), cl('Tenencia y portación: diferencias', 30, 'aula'), cl('Qué pide el trámite de la credencial', 30, 'aula')] },
      { titulo: 'Manipulación segura', clases: [cl('Reglas de seguridad y comandos', 30, 'aula'), cl('Armado, desarmado de campo y limpieza', 45, 'seco'), cl('Guarda y transporte', 30, 'aula')] },
      { titulo: 'Práctica de tiro', clases: [cl('Fundamentos en seco', 40, 'seco'), cl('Tiro de precisión en el polígono', 80, 'poligono'), cl('Evaluación y devolución', 30, 'evaluacion')] }
    ]
  },
  {
    id: 'lu-2', codigo: 'LU·02', linea: 'lu', titulo: 'Práctica de idoneidad para renovación', nivel: 'Intermedio', formato: 'Práctico',
    minutos: 180, encuentros: '1 encuentro de 3 h', precio: 60000, nota: 'Para credenciales vigentes o por vencer',
    img: 'images/09_poligono-exterior.webp', alt: 'Línea de tiro techada frente a un polígono al aire libre con blancos al fondo',
    corta: 'Repaso y práctica antes del examen que pide cada renovación.',
    promesa: 'Renová tu credencial con la práctica fresca: repaso de seguridad y tiro de precisión con devolución.',
    descripcion: 'La idoneidad se vuelve a acreditar en cada renovación de la credencial. Esta práctica es un repaso concentrado: normas de seguridad, manipulación y una tanda de tiro de precisión con el instructor corrigiendo en el momento.',
    paraQuien: 'Ya sos legítimo usuario y se acerca la renovación de tu credencial.',
    paraQuienNo: 'Es tu primer trámite: te conviene la Formación de legítimos usuarios completa.',
    resultados: ['Repasar las normas de seguridad', 'Corregir vicios de postura y empuñe', 'Llegar al examen con práctica reciente'],
    requisitos: ['Credencial de legítimo usuario vigente o por vencer', 'DNI', 'Protección auditiva y visual'],
    incluye: ['Repaso teórico breve', 'Tanda de tiro de precisión', 'Devolución individual'],
    modulos: [
      { titulo: 'Repaso', clases: [cl('Normas y comandos del polígono', 20, 'aula'), cl('Novedades de la normativa', 15, 'aula'), cl('Manipulación segura', 20, 'seco')] },
      { titulo: 'Práctica', clases: [cl('Fundamentos en seco', 20, 'seco'), cl('Precisión a distancia corta', 40, 'poligono'), cl('Precisión a distancia media', 30, 'poligono')] },
      { titulo: 'Cierre', clases: [cl('Corrección de errores frecuentes', 15, 'poligono'), cl('Devolución individual', 10, 'evaluacion'), cl('Próximos pasos del trámite', 10, 'aula')] }
    ]
  },
  {
    id: 'lu-3', codigo: 'LU·03', linea: 'lu', titulo: 'Guarda, transporte y tenencia responsable', nivel: 'Inicial', formato: 'Teórico',
    minutos: 120, encuentros: '1 encuentro de 2 h', precio: 38000,
    img: 'images/05_valija.webp', alt: 'Valija rígida abierta con espuma de protección sobre una mesa de madera',
    corta: 'Cómo guardar y trasladar un arma según la normativa.',
    promesa: 'Guardá y trasladá tu arma como corresponde, sin dudas y sin riesgos para nadie.',
    descripcion: 'Una clase teórica y concreta sobre lo que más dudas genera: dónde y cómo guardar el arma y la munición en casa, cómo trasladarla al polígono y qué documentación llevar en cada caso.',
    paraQuien: 'Sos legítimo usuario o estás por serlo y querés hacer las cosas bien desde el primer día.',
    paraQuienNo: 'Buscás práctica de tiro: este curso no incluye polígono.',
    resultados: ['Elegir una guarda segura para tu casa', 'Trasladar el arma y la munición correctamente', 'Saber qué documentación llevar encima'],
    requisitos: ['No hace falta experiencia', 'DNI'],
    incluye: ['Lista de control para la guarda en casa', 'Guía de traslado al polígono', 'Espacio para tus consultas'],
    modulos: [
      { titulo: 'Guarda en el hogar', clases: [cl('Cajas, gabinetes y cerraduras', 15, 'aula'), cl('Arma y munición por separado', 10, 'aula'), cl('Acceso de terceros y de menores', 15, 'aula')] },
      { titulo: 'Transporte', clases: [cl('Cómo trasladar el arma al polígono', 15, 'aula'), cl('Valijas y estuches', 10, 'practica'), cl('Documentación que tenés que llevar', 15, 'aula')] },
      { titulo: 'Tenencia responsable', clases: [cl('Mantenimiento y registro', 15, 'aula'), cl('Qué hacer ante un robo o extravío', 10, 'aula'), cl('Preguntas y casos', 15, 'aula')] }
    ]
  },
  {
    id: 'pf-1', codigo: 'PF·01', linea: 'pf', titulo: 'Capacitación para personal de fuerzas', nivel: 'A medida', formato: 'A medida',
    minutos: 0, duracionTexto: 'Según el programa', encuentros: 'Cronograma a coordinar', precio: null, destacado: true, consulta: true, badge: 'Para instituciones',
    img: 'images/07_planificacion.webp', alt: 'Cuaderno abierto, lapicera y carpeta sobre una mesa de aula',
    corta: 'Entrenamiento orientado a necesidades específicas de personal de fuerzas.',
    promesa: 'Asesoramiento y entrenamiento armados según la función, el equipamiento y los objetivos de cada fuerza.',
    descripcion: 'Trabajamos con fuerzas de seguridad e instituciones que necesitan capacitar a su personal. Empezamos por un diagnóstico del grupo y armamos un programa con objetivos, cronograma y evaluación, en el aula y en el polígono.',
    paraQuien: 'Coordinás la capacitación de un grupo de una fuerza o institución y necesitás un programa a medida.',
    paraQuienNo: 'Sos personal de fuerzas y buscás práctica por tu cuenta: mirá la Práctica individual para personal de fuerzas.',
    resultados: ['Un diagnóstico del nivel del grupo', 'Un programa con objetivos y cronograma', 'Evaluación final con informe por agente'],
    requisitos: ['Pedido de la institución o del responsable del grupo', 'Personal con credencial de la fuerza'],
    incluye: ['Reunión de diagnóstico', 'Programa escrito a medida', 'Informe final de resultados'],
    modulos: [
      { titulo: 'Diagnóstico', clases: [cl('Reunión con los responsables', 'A coordinar', 'aula'), cl('Evaluación inicial del grupo', 'A coordinar', 'poligono'), cl('Objetivos del programa', 'A coordinar', 'aula')] },
      { titulo: 'Programa', clases: [cl('Módulos teóricos según la función', 'A coordinar', 'aula'), cl('Entrenamiento en el polígono', 'A coordinar', 'poligono'), cl('Prácticas de procedimiento', 'A coordinar', 'practica')] },
      { titulo: 'Evaluación', clases: [cl('Evaluación final', 'A coordinar', 'evaluacion'), cl('Informe por agente', 'A coordinar', 'aula'), cl('Plan de continuidad', 'A coordinar', 'aula')] }
    ]
  },
  {
    id: 'pf-2', codigo: 'PF·02', linea: 'pf', titulo: 'Práctica individual para personal de fuerzas', nivel: 'Intermedio', formato: 'Práctico',
    minutos: 240, encuentros: '1 jornada de 4 h', precio: 85000, badge: 'Con credencial', nota: 'Pide credencial vigente de la fuerza',
    img: 'images/02_poligono-cuadrada.webp', alt: 'Puestos de tiro de un polígono cubierto con los blancos al fondo',
    corta: 'Entrenamiento individual para mantener tu nivel entre cursos.',
    promesa: 'Mantené tu nivel con práctica dirigida: diagnóstico, corrección y ejercicios según tu función.',
    descripcion: 'Para agentes que quieren sumar horas de práctica por su cuenta. Arrancamos con un diagnóstico en el polígono y trabajamos lo que más necesitás: precisión, recargas, interrupciones o tiro con tiempo.',
    paraQuien: 'Sos personal de una fuerza y querés sumar práctica dirigida por tu cuenta.',
    paraQuienNo: 'Necesitás capacitar a un grupo: pedí el programa para instituciones.',
    resultados: ['Un diagnóstico de tu nivel actual', 'Correcciones puntuales sobre tu técnica', 'Ejercicios para seguir practicando'],
    requisitos: ['Credencial vigente de la fuerza', 'DNI', 'Protección auditiva y visual'],
    incluye: ['Diagnóstico inicial', 'Plan de ejercicios según tu función', 'Devolución con próximos objetivos'],
    modulos: [
      { titulo: 'Diagnóstico', clases: [cl('Repaso de seguridad', 15, 'aula'), cl('Ejercicio de diagnóstico', 30, 'poligono'), cl('Objetivos de la jornada', 15, 'aula')] },
      { titulo: 'Técnica', clases: [cl('Recargas e interrupciones', 30, 'seco'), cl('Precisión con tiempo', 40, 'poligono'), cl('Tiro desde distintas posiciones', 50, 'poligono')] },
      { titulo: 'Cierre', clases: [cl('Ejercicio integrador', 30, 'poligono'), cl('Devolución', 15, 'evaluacion'), cl('Plan para seguir practicando', 15, 'aula')] }
    ]
  }
];

const getCurso = id => CURSOS.find(c => c.id === id);
const minTexto = m => {
  if (typeof m === 'string') return m;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} h ${r} min` : `${h} h`;
};
const duracion = c => c.minutos ? minTexto(c.minutos) : c.duracionTexto;
const precioTexto = c => c.precio == null ? 'A convenir' : formatearPrecio(c.precio);
const moduloMin = m => m.clases.reduce((s, x) => s + (typeof x.dur === 'number' ? x.dur : 0), 0);
const icono = t => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TIPOS[t].svg}</svg>`;
const flecha = '<svg class="ico-flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const msgCurso = c => c.consulta
  ? 'Hola A.D.I.A.P., quiero pedir una propuesta de capacitación para personal de fuerzas.'
  : `Hola A.D.I.A.P., quiero consultar por ${c.titulo} (${c.codigo}).`;

const Cart = {
  KEY: 'adiap_cart',
  mem: [],
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return (Array.isArray(v) ? v : this.mem).filter(i => getCurso(i.id) && !getCurso(i.id).consulta);
    } catch {
      return this.mem.filter(i => getCurso(i.id));
    }
  },
  save(items) {
    this.mem = items.map(i => ({ ...i }));
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.mem = items.map(i => ({ ...i })); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  add(id) { if (!this.has(id)) this.save([...this.get(), { id, qty: 1 }]); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => s + (getCurso(i.id)?.precio || 0), 0); }
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

function accionPrincipal(c, clase = 'btn btn--primary btn--sm') {
  if (c.consulta) return `<a class="${clase}" href="${waLink(msgCurso(c))}" target="_blank" rel="noopener">Pedir propuesta</a>`;
  return `<button class="${clase}" type="button" data-inscribir="${c.id}">Inscribirme</button>`;
}

function metaCurso(c) {
  return `${esc(c.nivel)} · ${esc(duracion(c))}`;
}

function cantidadLinea(l) {
  const n = CURSOS.filter(c => c.linea === l).length;
  return n === 1 ? 'Ver el curso de la línea' : `Ver los ${n} cursos de la línea`;
}

function destacadoHTML(c, variante) {
  const linea = LINEAS[c.linea];
  const badge = c.badge ? `<span class="badge">${esc(c.badge)}</span>` : '';
  if (variante === 'puertas') {
    return `<li class="puerta" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <p class="puerta-perfil">${esc(linea.perfil)}</p>
      <p class="puerta-cod" aria-hidden="true">${esc(c.codigo)}</p>
      <h3 class="puerta-titulo">${esc(c.titulo)}</h3>
      <p class="puerta-texto">${esc(c.corta)}</p>
      <p class="puerta-meta">${metaCurso(c)} · <strong>${precioTexto(c)}</strong></p>
      <div class="puerta-acciones">
        <button class="btn btn--primary btn--sm" type="button" data-ver="${c.id}">Más información ${flecha}</button>
        ${accionPrincipal(c, 'btn btn--ghost btn--sm')}
      </div>
      <button class="link-linea" type="button" data-linea="${c.linea}">${cantidadLinea(c.linea)}</button>
    </li>`;
  }
  return `<li class="dest-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="foto-card">
      <img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000">${badge}
    </div>
    <div class="dest-body">
      <p class="dest-perfil"><span>${esc(c.codigo)}</span> ${esc(linea.perfil)}</p>
      <h3 class="dest-titulo">${esc(c.titulo)}</h3>
      <p class="dest-texto">${esc(c.corta)}</p>
      <p class="dest-meta">${metaCurso(c)} · <strong>${precioTexto(c)}</strong></p>
      <div class="dest-acciones">
        <button class="btn btn--primary btn--sm" type="button" data-ver="${c.id}">Más información ${flecha}</button>
        ${accionPrincipal(c, 'btn btn--ghost btn--sm')}
      </div>
      <button class="link-linea" type="button" data-linea="${c.linea}">${cantidadLinea(c.linea)}</button>
    </div>
  </li>`;
}

function initDestacados() {
  const cont = document.getElementById('destacados');
  if (!cont) return;
  const variante = cont.dataset.variante;
  cont.innerHTML = CURSOS.filter(c => c.destacado).map(c => destacadoHTML(c, variante)).join('');
}

function filaHTML(c) {
  const add = c.consulta
    ? `<a class="btn btn--ghost btn--sm" href="${waLink(msgCurso(c))}" target="_blank" rel="noopener">Pedir propuesta</a>`
    : `<button class="btn btn--ghost btn--sm" type="button" data-sumar="${c.id}">Sumar</button>`;
  return `<li class="fila" data-id="${c.id}" data-animate="subir" style="opacity:0;transform:translateY(28px)">
    <span class="fila-cod">${esc(c.codigo)}</span>
    <div class="fila-tit">
      <h3><button type="button" data-ver="${c.id}">${esc(c.titulo)}</button></h3>
      <p>${esc(LINEAS[c.linea].label)}${c.badge ? ` · <span class="fila-badge">${esc(c.badge)}</span>` : ''}</p>
    </div>
    <p class="fila-dato fila-dato--nivel"><span class="fila-lbl">Nivel</span>${esc(c.nivel)}</p>
    <p class="fila-dato fila-dato--formato"><span class="fila-lbl">Formato</span>${esc(c.formato)}</p>
    <p class="fila-dato fila-dato--dur"><span class="fila-lbl">Duración</span>${esc(duracion(c))}</p>
    <p class="fila-precio">${precioTexto(c)}</p>
    <div class="fila-acciones">
      <button class="btn btn--primary btn--sm" type="button" data-ver="${c.id}">Ver programa</button>
      ${add}
    </div>
  </li>`;
}

function planItemHTML(c) {
  return `<li class="plan-item" data-id="${c.id}" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <button type="button" class="plan-btn" data-sel="${c.id}" aria-pressed="false" aria-controls="planDetalle">
      <span class="plan-cod">${esc(c.codigo)}</span>
      <span class="plan-tit">${esc(c.titulo)}</span>
      <span class="plan-meta">${esc(c.nivel)} · ${esc(c.formato)} · ${esc(duracion(c))}</span>
      <span class="plan-precio">${precioTexto(c)}</span>
    </button>
  </li>`;
}

function programaHTML(c, abierto = 0) {
  return c.modulos.map((m, k) => {
    const min = moduloMin(m);
    return `<details class="modulo"${k === abierto ? ' open' : ''}>
      <summary><span class="modulo-num">Módulo ${k + 1}</span><span class="modulo-tit">${esc(m.titulo)}</span><span class="modulo-dur">${min ? minTexto(min) : 'A coordinar'}</span></summary>
      <ul class="clases">${m.clases.map(x => `<li><span class="clase-tipo" title="${TIPOS[x.tipo].label}">${icono(x.tipo)}</span><span class="clase-tit">${esc(x.titulo)}<small>${TIPOS[x.tipo].label}</small></span><span class="clase-dur">${esc(minTexto(x.dur))}</span></li>`).join('')}</ul>
    </details>`;
  }).join('');
}

function detalleHTML(c) {
  const linea = LINEAS[c.linea];
  return `<div class="det-top">
      <figure class="det-foto"><img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000"></figure>
      <div class="det-cab">
        <p class="det-cod">${esc(c.codigo)} · ${esc(linea.label)}</p>
        <h3 class="det-titulo">${esc(c.titulo)}</h3>
        <p class="det-promesa">${esc(c.promesa)}</p>
      </div>
    </div>
    <dl class="datos">
      <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
      <div><dt>Formato</dt><dd>${esc(c.formato)}</dd></div>
      <div><dt>Duración</dt><dd>${esc(duracion(c))}</dd></div>
      <div><dt>Cursada</dt><dd>${esc(c.encuentros)}</dd></div>
    </dl>
    <p class="det-sub">Programa</p>
    <div class="programa">${programaHTML(c)}</div>
    <div class="det-compra">
      <p class="det-precio">${precioTexto(c)}</p>
      ${accionPrincipal(c, 'btn btn--primary')}
      <button class="btn btn--ghost" type="button" data-ver="${c.id}">Ver el curso completo</button>
    </div>`;
}

const filtros = { linea: 'todas', nivel: 'todos', formato: 'todos', q: '' };
let planSel = null;

function initCatalogo() {
  const lista = document.getElementById('listaCursos');
  if (!lista) return;
  const variante = lista.dataset.variante;
  lista.innerHTML = CURSOS.map(variante === 'plan' ? planItemHTML : filaHTML).join('');
  if (variante === 'plan') seleccionarPlan(CURSOS[0].id, false);
  document.querySelectorAll('[data-chip-linea]').forEach(b => b.addEventListener('click', () => { filtros.linea = b.dataset.chipLinea; aplicarFiltros(); }));
  const nivel = document.getElementById('filtroNivel');
  const formato = document.getElementById('filtroFormato');
  const buscar = document.getElementById('buscarCurso');
  nivel?.addEventListener('change', () => { filtros.nivel = nivel.value; aplicarFiltros(); });
  formato?.addEventListener('change', () => { filtros.formato = formato.value; aplicarFiltros(); });
  buscar?.addEventListener('input', () => { filtros.q = buscar.value; aplicarFiltros(); });
  document.getElementById('formBuscar')?.addEventListener('submit', e => { e.preventDefault(); aplicarFiltros(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarFiltros));
  aplicarFiltros(false);
}

function limpiarFiltros() {
  filtros.linea = 'todas'; filtros.nivel = 'todos'; filtros.formato = 'todos'; filtros.q = '';
  const buscar = document.getElementById('buscarCurso');
  const nivel = document.getElementById('filtroNivel');
  const formato = document.getElementById('filtroFormato');
  if (buscar) buscar.value = '';
  if (nivel) nivel.value = 'todos';
  if (formato) formato.value = 'todos';
  aplicarFiltros();
}

function textoCurso(c) {
  return normalizar([c.codigo, c.codigo.replace('·', ''), c.titulo, LINEAS[c.linea].label, LINEAS[c.linea].perfil, c.nivel, c.formato, c.corta, c.promesa, c.descripcion, c.modulos.map(m => m.titulo + ' ' + m.clases.map(x => x.titulo).join(' ')).join(' ')].join(' '));
}

function aplicarFiltros(revelar = true) {
  const lista = document.getElementById('listaCursos');
  if (!lista) return;
  const terminos = normalizar(filtros.q.trim()).split(/\s+/).filter(Boolean);
  let visibles = 0;
  let primero = null;
  lista.querySelectorAll('[data-id]').forEach(li => {
    const c = getCurso(li.dataset.id);
    const texto = textoCurso(c);
    const ok = (filtros.linea === 'todas' || c.linea === filtros.linea)
      && (filtros.nivel === 'todos' || c.nivel === filtros.nivel)
      && (filtros.formato === 'todos' || c.formato === filtros.formato)
      && terminos.every(t => texto.includes(t));
    li.hidden = !ok;
    if (ok) { visibles++; if (!primero) primero = c.id; }
  });
  document.querySelectorAll('[data-chip-linea]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chipLinea === filtros.linea)));
  const activos = filtros.linea !== 'todas' || filtros.nivel !== 'todos' || filtros.formato !== 'todos' || terminos.length > 0;
  const contador = document.getElementById('cursosContador');
  if (contador) contador.textContent = activos ? `${visibles} de ${CURSOS.length} capacitaciones` : `${CURSOS.length} capacitaciones`;
  document.querySelectorAll('.link-limpiar').forEach(b => { b.hidden = !activos; });
  const vacio = document.getElementById('cursosVacio');
  if (vacio) vacio.hidden = visibles > 0;
  if (lista.dataset.variante === 'plan') {
    const det = document.getElementById('planDetalle');
    if (det) det.hidden = visibles === 0;
    const selVisible = planSel && !lista.querySelector(`[data-id="${planSel}"]`)?.hidden;
    if (!selVisible && primero) seleccionarPlan(primero, false);
  }
  if (revelar) revelarNuevos(lista);
}

function seleccionarPlan(id, animar = true) {
  const c = getCurso(id);
  const det = document.getElementById('planDetalle');
  if (!c || !det) return;
  planSel = id;
  document.querySelectorAll('[data-sel]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sel === id)));
  const cuerpo = det.querySelector('.det-cuerpo');
  if (!cuerpo) return;
  cuerpo.innerHTML = detalleHTML(c);
  if (animar && !reduceMotion) {
    cuerpo.classList.remove('cambia');
    void cuerpo.offsetWidth;
    cuerpo.classList.add('cambia');
  }
}

const mqPlanMovil = window.matchMedia('(max-width: 900px)');

function irACursos(linea) {
  filtros.linea = linea; filtros.nivel = 'todos'; filtros.formato = 'todos'; filtros.q = '';
  const buscar = document.getElementById('buscarCurso');
  const nivel = document.getElementById('filtroNivel');
  const formato = document.getElementById('filtroFormato');
  if (buscar) buscar.value = '';
  if (nivel) nivel.value = 'todos';
  if (formato) formato.value = 'todos';
  aplicarFiltros();
  document.getElementById('cursos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(lista => {
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
  el.dataset.abierta = '1';
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { if (el.dataset.abierta) el.classList.add('open'); }));
}
function cerrarCapa(el) {
  delete el.dataset.abierta;
  el.classList.remove('open');
  setTimeout(() => {
    if (!el.dataset.abierta) el.hidden = true;
  }, 380);
  const otraAbierta = [...document.querySelectorAll('.modal, .drawer')].some(x => x !== el && x.dataset.abierta);
  if (!otraAbierta) document.body.classList.remove('no-scroll');
}

let focoModal = null;

function modalHTML(c) {
  const linea = LINEAS[c.linea];
  const enCarrito = Cart.has(c.id);
  const boton = c.consulta
    ? `<a class="btn btn--primary" href="${waLink(msgCurso(c))}" target="_blank" rel="noopener">Pedir propuesta</a>`
    : `<button class="btn btn--primary" type="button" data-mc-inscribir="${c.id}">${enCarrito ? 'Ver mi inscripción' : 'Inscribirme'}</button>`;
  return `<div class="mc-top">
    <figure class="mc-foto"><img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</figure>
    <div class="mc-info">
      <p class="mc-cod">${esc(c.codigo)} · ${esc(linea.label)}</p>
      <h2 class="mc-titulo" id="mcTitulo">${esc(c.titulo)}</h2>
      <p class="mc-promesa">${esc(c.promesa)}</p>
      <dl class="datos">
        <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
        <div><dt>Formato</dt><dd>${esc(c.formato)}</dd></div>
        <div><dt>Duración</dt><dd>${esc(duracion(c))}</dd></div>
        <div><dt>Cursada</dt><dd>${esc(c.encuentros)}</dd></div>
      </dl>
      <div class="mc-compra">
        <p class="mc-precio">${precioTexto(c)}</p>
        ${boton}
        <a class="btn btn--ghost" href="${waLink(msgCurso(c))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
      ${c.nota ? `<p class="mc-nota">${esc(c.nota)}.</p>` : ''}
    </div>
  </div>
  <div class="mc-cuerpo">
    <p class="mc-desc">${esc(c.descripcion)}</p>
    <div class="mc-quien">
      <div><h3>Es para vos si…</h3><p>${esc(c.paraQuien)}</p></div>
      <div><h3>Mejor otra opción si…</h3><p>${esc(c.paraQuienNo)}</p></div>
    </div>
    <h3 class="mc-sub">Qué vas a lograr</h3>
    <ul class="mc-lista mc-lista--check">${c.resultados.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <h3 class="mc-sub">Programa</h3>
    <div class="programa">${programaHTML(c)}</div>
    <div class="mc-dos">
      <div><h3 class="mc-sub">Requisitos</h3><ul class="mc-lista">${c.requisitos.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h3 class="mc-sub">Qué incluye</h3><ul class="mc-lista">${c.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>
  </div>`;
}

function actualizarURL(id) {
  try {
    const u = new URL(location.href);
    if (id) u.searchParams.set('curso', id); else u.searchParams.delete('curso');
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  } catch {
    return;
  }
}

function abrirCurso(id, origen) {
  const c = getCurso(id);
  const modal = document.getElementById('cursoModal');
  const cont = document.getElementById('modalContenido');
  if (!c || !modal || !cont) return;
  if (!modal.dataset.abierta) focoModal = origen || document.activeElement;
  cont.innerHTML = modalHTML(c);
  cont.scrollTop = 0;
  abrirCapa(modal);
  modal.querySelector('.modal-panel')?.focus({ preventScroll: true });
  actualizarURL(c.id);
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('cursoModal');
  if (!modal || modal.hidden) return;
  cerrarCapa(modal);
  actualizarURL(null);
  if (devolverFoco && focoModal && document.contains(focoModal)) focoModal.focus({ preventScroll: true });
}

function initModal() {
  const modal = document.getElementById('cursoModal');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-modal]')) { cerrarModal(); return; }
    const ins = e.target.closest('[data-mc-inscribir]');
    if (ins) {
      const origen = focoModal;
      cerrarModal(false);
      inscribir(ins.dataset.mcInscribir, true);
      if (origen && document.contains(origen)) focoDrawer = origen;
    }
  });
}

function avisoPrevio(c) {
  if (!c.previo || Cart.has(c.previo)) return '';
  const p = getCurso(c.previo);
  return p ? `${c.titulo} pide ${p.titulo} aprobado o una evaluación previa: lo coordinamos al confirmar.` : '';
}

function inscribir(id, abrir) {
  const c = getCurso(id);
  if (!c || c.consulta) return;
  if (Cart.has(id)) {
    if (abrir) abrirDrawer(); else showToast(`${c.titulo} ya está en tu inscripción.`);
    return;
  }
  Cart.add(id);
  const aviso = avisoPrevio(c);
  if (abrir) {
    abrirDrawer();
    if (aviso) showToast(aviso);
  } else {
    showToast(aviso || `Sumaste ${c.titulo} a tu inscripción.`);
  }
}

let focoDrawer = null;
function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  if (!drawer.dataset.abierta) focoDrawer = document.activeElement;
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
    cont.innerHTML = `<div class="drawer-vacio"><strong>Todavía no elegiste ninguna capacitación</strong><p>Sumá un curso desde el listado y lo ves acá, con el total.</p><a class="btn btn--primary btn--sm" href="#cursos" data-cerrar-drawer>Ver las capacitaciones</a></div>`;
    pie.innerHTML = '';
    return;
  }
  cont.innerHTML = items.map(i => {
    const c = getCurso(i.id);
    return `<div class="item">
      <img src="${c.img}" alt="" width="64" height="64">
      <div class="item-info"><p class="item-cod">${esc(c.codigo)}</p><p class="item-titulo">${esc(c.titulo)}</p><p class="item-meta">${metaCurso(c)}</p>${c.nota ? `<p class="item-nota">${esc(c.nota)}</p>` : ''}</div>
      <div class="item-der"><p class="item-precio">${precioTexto(c)}</p><button class="item-quitar" type="button" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></div>
    </div>`;
  }).join('');
  const lista = items.map(i => { const c = getCurso(i.id); return `${c.codigo} ${c.titulo}`; }).join(', ');
  pie.innerHTML = `<div class="drawer-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer-nota">Las fechas de cursada se coordinan con vos al confirmar la inscripción.</p>
    <button class="btn btn--primary" type="button" data-finalizar>Finalizar inscripción</button>
    <a class="btn btn--ghost" href="${waLink(`Hola A.D.I.A.P., quiero inscribirme en: ${lista}. Total: ${formatearPrecio(Cart.total())}.`)}" target="_blank" rel="noopener">Consultar antes por WhatsApp</a>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const c = getCurso(q.dataset.quitar);
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
    if (ver) { e.preventDefault(); abrirCurso(ver.dataset.ver, ver); return; }
    const sel = e.target.closest('[data-sel]');
    if (sel) {
      if (mqPlanMovil.matches) abrirCurso(sel.dataset.sel, sel);
      else seleccionarPlan(sel.dataset.sel);
      return;
    }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) { inscribir(ins.dataset.inscribir, true); return; }
    const sum = e.target.closest('[data-sumar]');
    if (sum) { inscribir(sum.dataset.sumar, false); return; }
    const lin = e.target.closest('[data-linea]');
    if (lin) { e.preventDefault(); irACursos(lin.dataset.linea); }
  });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('cursoModal');
    const drawer = document.getElementById('cartDrawer');
    if (modal?.dataset.abierta) {
      if (e.key === 'Escape') { cerrarModal(); return; }
      atraparFoco(modal, e);
      return;
    }
    if (drawer?.dataset.abierta) {
      if (e.key === 'Escape') { cerrarDrawer(); return; }
      atraparFoco(drawer, e);
    }
  });
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirCurso(id, null);
}

[initDestacados, initCatalogo, initTabs, initReveals, initNav, initFloats, initModelBarScroll, initDelegacion, initModal, initDrawer, updateCartBadge, initDeepLink]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
