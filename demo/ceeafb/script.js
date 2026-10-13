const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493425028178';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ICO = {
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  chevron: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  clock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  nivel: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20v-4M10 20v-8M16 20V8M22 20V4"/></svg>',
  cancha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.5"/></svg>',
  video: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
  evaluacion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ICO_MODALIDAD = {
  Grupal: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  Personalizado: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  Programa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  Servicio: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>',
};
const TIPOS = { cancha: 'En cancha', video: 'Video', evaluacion: 'Evaluación' };

const CATEGORIAS = [
  { id: 'arqueros', nombre: 'Arqueros' },
  { id: 'jugadores', nombre: 'Jugadores' },
  { id: 'visorias', nombre: 'Visorías' },
  { id: 'audiovisual', nombre: 'Foto y video' },
];
const NIVELES = ['Inicial', 'Intermedio', 'Avanzado', 'Todos los niveles'];
const FOTOS = {
  arqueros: { src: 'images/03_arquero_atajando_1x1.webp', alt: 'Arquero de buzo negro atrapando la pelota con las dos manos en plena caída' },
  jugadores: { src: 'images/04_regate_y_control_1x1.webp', alt: 'Jugador conduciendo la pelota entre conos junto a una escalera de coordinación' },
  visorias: { src: 'images/05_evaluacion_y_velocidad_1x1.webp', alt: 'Jugador arrancando un ejercicio de velocidad mientras el entrenador toma registro en una tablet' },
  audiovisual: { src: 'images/06_entrenamiento_general_1x1.webp', alt: 'Cámara sobre trípode filmando a un arquero durante el entrenamiento' },
};
const DOCENTES = [
  {
    id: 'fabian',
    nombre: 'Fabián Barrientos',
    iniciales: 'FB',
    rol: 'Entrenador de arqueros · a cargo del centro',
    bio: 'Arma cada plan según el puesto, la edad y el objetivo de quien entrena, y comparte el trabajo de todos los días en Instagram, Facebook y TikTok.',
  },
];

const m = (titulo, clases) => ({ titulo, clases: clases.map(([t, duracion, tipo]) => ({ titulo: t, duracion, tipo })) });

const PROGRAMAS = [
  {
    id: 'arq-formacion', slug: 'arqueros-en-formacion', titulo: 'Arqueros en formación',
    categoria: 'arqueros', nivel: 'Inicial', modalidad: 'Grupal',
    precio: 28000, descuento: 0, unidad: 'por mes', duracion: 'Cuota mensual',
    frecuencia: '2 veces por semana', horario: 'Lun y Mié · 18:00', cantidadClases: 8,
    paraQuien: 'Para quienes recién empiezan a atajar.',
    descripcionCorta: 'Posición básica, blocaje y caídas, con ejercicios pensados para cada edad.',
    descripcionCompleta: 'Un primer paso ordenado en el puesto: cómo pararse, cómo agarrar la pelota y cómo caer sin lastimarse. Trabajamos en grupos chicos para que cada arquero tenga muchas repeticiones y corrección en el momento.',
    resultados: ['Posición de espera y desplazamientos cortos', 'Blocaje de pelotas rasas, a media altura y altas', 'Caídas laterales seguras', 'Primeras salidas y achique'],
    requisitos: ['Guantes de arquero', 'Botines o zapatillas para césped', 'Ropa cómoda y agua'],
    incluye: ['8 sesiones por mes en cancha', 'Evaluación al empezar', 'Grupos por edad y nivel'],
    docenteId: 'fabian', badge: 'Para empezar', etiquetas: 'arquero guantes atajar blocaje caidas principiante',
    modulos: [
      m('Base del puesto', [['Evaluación inicial', '30 min', 'evaluacion'], ['Posición de espera y desplazamientos', '60 min', 'cancha'], ['Blocaje de pelotas rasas', '60 min', 'cancha']]),
      m('Caídas y achique', [['Caídas laterales sin pelota', '60 min', 'cancha'], ['Caídas con pelota a media altura', '60 min', 'cancha'], ['Achique en el uno contra uno', '60 min', 'cancha']]),
      m('Juego aéreo inicial', [['Pelotas altas de frente', '60 min', 'cancha'], ['Salidas cortas', '60 min', 'cancha'], ['Repaso en video', '20 min', 'video']]),
    ],
  },
  {
    id: 'arq-perfeccionamiento', slug: 'perfeccionamiento-tecnico-arqueros', titulo: 'Perfeccionamiento técnico para arqueros',
    categoria: 'arqueros', nivel: 'Intermedio', modalidad: 'Grupal',
    precio: 32000, descuento: 0, unidad: 'por mes', duracion: 'Cuota mensual',
    frecuencia: '2 veces por semana', horario: 'Mar y Jue · 18:30', cantidadClases: 8,
    paraQuien: 'Para arqueros que ya atajan en un club y quieren pulir la técnica.',
    descripcionCorta: 'Reacción, juego aéreo y uno contra uno, con corrección individual en cada sesión.',
    descripcionCompleta: 'Trabajo específico para arqueros que ya compiten: velocidad de reacción, ubicación, juego aéreo con oposición y lectura del uno contra uno. Cada bloque cierra con un ejercicio en situación de partido.',
    resultados: ['Reacción y segunda acción después del rebote', 'Ubicación según la posición de la pelota', 'Juego aéreo con oposición', 'Uno contra uno y achique'],
    requisitos: ['Atajar en un club o liga (no excluyente)', 'Guantes de arquero', 'Botines para césped'],
    incluye: ['8 sesiones por mes en cancha', 'Corrección individual', 'Clips de video de los ejercicios clave'],
    docenteId: 'fabian', badge: 'Por puesto', etiquetas: 'arquero reaccion juego aereo centros uno contra uno tecnica',
    modulos: [
      m('Reacción y ubicación', [['Test de reacción', '30 min', 'evaluacion'], ['Reacción con estímulos visuales', '60 min', 'cancha'], ['Ubicación y ángulos de tiro', '60 min', 'cancha']]),
      m('Juego aéreo', [['Centros con oposición', '60 min', 'cancha'], ['Despejes de puño', '60 min', 'cancha'], ['Salidas en el área chica', '60 min', 'cancha']]),
      m('Uno contra uno', [['Achique y bloqueo', '60 min', 'cancha'], ['Lectura del delantero', '60 min', 'cancha'], ['Análisis en video', '30 min', 'video']]),
    ],
  },
  {
    id: 'arq-competencia', slug: 'arqueros-en-competencia', titulo: 'Arqueros en competencia',
    categoria: 'arqueros', nivel: 'Avanzado', modalidad: 'Grupal',
    precio: 38000, descuento: 0, unidad: 'por mes', duracion: 'Cuota mensual',
    frecuencia: '3 veces por semana', horario: 'Lun, Mié y Vie · 19:30', cantidadClases: 12,
    paraQuien: 'Para arqueros de inferiores, ligas y primera que entrenan para el fin de semana.',
    descripcionCorta: 'Volumen de trabajo, juego con los pies y preparación del partido del fin de semana.',
    descripcionCompleta: 'Un programa de carga semanal pensado para quien compite: técnica bajo cansancio, juego con los pies y distribución, y un repaso del partido para corregir lo que pasó.',
    resultados: ['Técnica sostenida bajo carga física', 'Juego con los pies y distribución', 'Comunicación y orden de la defensa', 'Repaso del partido con video'],
    requisitos: ['Competir en un club o liga', 'Guantes de arquero y botines', 'Video del último partido (opcional)'],
    incluye: ['12 sesiones por mes', 'Revisión de un partido por mes en video', 'Plan para la semana de partido'],
    docenteId: 'fabian', badge: '', etiquetas: 'arquero competencia partido juego con los pies distribucion saque',
    modulos: [
      m('Carga y técnica', [['Control de la carga', '30 min', 'evaluacion'], ['Circuito técnico con carga', '75 min', 'cancha'], ['Potencia de salto', '60 min', 'cancha']]),
      m('Juego con los pies', [['Pase corto bajo presión', '60 min', 'cancha'], ['Saque largo y distribución', '60 min', 'cancha'], ['Salida desde el fondo', '60 min', 'cancha']]),
      m('Semana de partido', [['Activación previa al partido', '45 min', 'cancha'], ['Pelota parada', '60 min', 'cancha'], ['Revisión del partido', '40 min', 'video']]),
    ],
  },
  {
    id: 'arq-1a1', slug: 'arquero-1-a-1', titulo: 'Arquero 1 a 1',
    categoria: 'arqueros', nivel: 'Todos los niveles', modalidad: 'Personalizado',
    precio: 45000, descuento: 0, unidad: 'pack de 4 sesiones', duracion: '4 sesiones',
    frecuencia: 'A coordinar', horario: 'Día y hora a coordinar', cantidadClases: 4,
    paraQuien: 'Para trabajar un aspecto puntual con la atención completa del entrenador.',
    descripcionCorta: 'Sesiones individuales armadas después de evaluarte, sobre lo que más necesitás.',
    descripcionCompleta: 'Entrenamiento uno a uno: arrancamos con una evaluación y armamos las cuatro sesiones sobre lo que más te cuesta, sea técnica, juego aéreo, uno contra uno o juego con los pies.',
    resultados: ['Plan hecho a tu medida', 'Muchas más repeticiones por sesión', 'Corrección de un gesto técnico puntual', 'Video comparando el antes y el después'],
    requisitos: ['Guantes de arquero', 'Contarnos qué querés mejorar'],
    incluye: ['4 sesiones individuales', 'Evaluación inicial', 'Video comparativo al terminar'],
    docenteId: 'fabian', badge: '1 a 1', etiquetas: 'arquero personalizado individual particular uno a uno',
    modulos: [
      m('Sesión 1 · Evaluación', [['Test de técnica de base', '20 min', 'evaluacion'], ['Gesto a corregir', '25 min', 'cancha'], ['Grabación de referencia', '15 min', 'video']]),
      m('Sesiones 2 y 3 · Trabajo específico', [['Ejercicio analítico del gesto', '30 min', 'cancha'], ['Ejercicio con oposición', '30 min', 'cancha'], ['Situación de partido', '20 min', 'cancha']]),
      m('Sesión 4 · Cierre', [['Repetición en situación real', '30 min', 'cancha'], ['Grabación final', '15 min', 'video'], ['Comparativo y próximos pasos', '15 min', 'video']]),
    ],
  },
  {
    id: 'jug-tecnica', slug: 'tecnica-y-control-de-juego', titulo: 'Técnica y control de juego',
    categoria: 'jugadores', nivel: 'Inicial', modalidad: 'Grupal',
    precio: 28000, descuento: 0, unidad: 'por mes', duracion: 'Cuota mensual',
    frecuencia: '2 veces por semana', horario: 'Mar y Jue · 17:30', cantidadClases: 8,
    paraQuien: 'Para jugadores de campo que quieren dominar mejor la pelota.',
    descripcionCorta: 'Control orientado, conducción, pase y regate con mucha pelota por jugador.',
    descripcionCompleta: 'Sesiones con mucha pelota por jugador para mejorar el primer control, la conducción y el pase, y animarse al regate. Cada ejercicio termina en un juego reducido para llevarlo al partido.',
    resultados: ['Primer control orientado con los dos perfiles', 'Conducción con cambios de dirección', 'Pase corto y largo con precisión', 'Regate en el uno contra uno'],
    requisitos: ['Botines o zapatillas para césped', 'Canilleras', 'Ropa cómoda y agua'],
    incluye: ['8 sesiones por mes en cancha', 'Evaluación al empezar', 'Juegos reducidos en cada sesión'],
    docenteId: 'fabian', badge: 'Para empezar', etiquetas: 'jugador campo tecnica control pase conduccion regate gambeta',
    modulos: [
      m('Control y pase', [['Test técnico inicial', '30 min', 'evaluacion'], ['Control orientado', '60 min', 'cancha'], ['Pase corto en movimiento', '60 min', 'cancha']]),
      m('Conducción', [['Conducción entre conos', '60 min', 'cancha'], ['Cambios de dirección', '60 min', 'cancha'], ['Conducción con oposición', '60 min', 'cancha']]),
      m('Regate y juego', [['Amagues y regate', '60 min', 'cancha'], ['Uno contra uno', '60 min', 'cancha'], ['Juego reducido con video', '40 min', 'video']]),
    ],
  },
  {
    id: 'jug-velocidad', slug: 'velocidad-y-cambio-de-ritmo', titulo: 'Velocidad y cambio de ritmo',
    categoria: 'jugadores', nivel: 'Intermedio', modalidad: 'Grupal',
    precio: 30000, descuento: 0, unidad: 'por mes', duracion: 'Cuota mensual',
    frecuencia: '2 veces por semana', horario: 'Mar y Jue · 19:00', cantidadClases: 8,
    paraQuien: 'Para jugadores que quieren llegar antes y arrancar mejor.',
    descripcionCorta: 'Arranques, coordinación y potencia con escalera, vallas y mediciones de velocidad.',
    descripcionCompleta: 'Trabajo físico aplicado al fútbol: técnica de carrera, coordinación con escalera y vallas, arranques y frenadas, y cambio de ritmo con pelota. Medimos la velocidad al empezar y al terminar el mes.',
    resultados: ['Mejor técnica de carrera', 'Arranque y frenada más rápidos', 'Coordinación y agilidad', 'Cambio de ritmo con pelota'],
    requisitos: ['Botines para césped', 'Estar sin lesiones', 'Ropa cómoda y agua'],
    incluye: ['8 sesiones por mes', 'Medición de velocidad al empezar y al terminar', 'Ejercicios para hacer en casa'],
    docenteId: 'fabian', badge: '', etiquetas: 'jugador velocidad fisico potencia coordinacion escalera vallas',
    modulos: [
      m('Medición y técnica de carrera', [['Test de velocidad en 10 y 30 metros', '30 min', 'evaluacion'], ['Técnica de carrera', '60 min', 'cancha'], ['Coordinación con escalera', '60 min', 'cancha']]),
      m('Arranques y frenadas', [['Arranques desde distintas posiciones', '60 min', 'cancha'], ['Frenadas y cambios de dirección', '60 min', 'cancha'], ['Potencia con vallas', '60 min', 'cancha']]),
      m('Velocidad con pelota', [['Cambio de ritmo con pelota', '60 min', 'cancha'], ['Duelos de velocidad', '60 min', 'cancha'], ['Medición final', '30 min', 'evaluacion']]),
    ],
  },
  {
    id: 'jug-1a1', slug: 'jugador-1-a-1-por-puesto', titulo: 'Jugador 1 a 1 por puesto',
    categoria: 'jugadores', nivel: 'Todos los niveles', modalidad: 'Personalizado',
    precio: 45000, descuento: 0, unidad: 'pack de 4 sesiones', duracion: '4 sesiones',
    frecuencia: 'A coordinar', horario: 'Día y hora a coordinar', cantidadClases: 4,
    paraQuien: 'Para defensores, volantes y delanteros que quieren un plan propio.',
    descripcionCorta: 'Cuatro sesiones individuales con ejercicios del puesto en el que jugás.',
    descripcionCompleta: 'Entrenamiento individual según tu puesto: perfiles y anticipo para defensores, recepción y pase para volantes, definición y desmarque para delanteros. Arrancamos con una evaluación y cerramos con un video comparativo.',
    resultados: ['Ejercicios específicos de tu puesto', 'Corrección de un gesto técnico', 'Toma de decisiones en situaciones de partido', 'Video comparando el antes y el después'],
    requisitos: ['Botines y canilleras', 'Contarnos en qué puesto jugás'],
    incluye: ['4 sesiones individuales', 'Evaluación inicial', 'Video comparativo al terminar'],
    docenteId: 'fabian', badge: '1 a 1', etiquetas: 'jugador personalizado individual particular defensor volante delantero definicion',
    modulos: [
      m('Sesión 1 · Evaluación', [['Test técnico del puesto', '20 min', 'evaluacion'], ['Gesto a mejorar', '25 min', 'cancha'], ['Grabación de referencia', '15 min', 'video']]),
      m('Sesiones 2 y 3 · Trabajo del puesto', [['Ejercicio analítico', '30 min', 'cancha'], ['Ejercicio con oposición', '30 min', 'cancha'], ['Situación de partido', '20 min', 'cancha']]),
      m('Sesión 4 · Cierre', [['Repetición en situación real', '30 min', 'cancha'], ['Grabación final', '15 min', 'video'], ['Comparativo y próximos pasos', '15 min', 'video']]),
    ],
  },
  {
    id: 'vis-preparacion', slug: 'preparacion-para-visorias', titulo: 'Preparación para visorías',
    categoria: 'visorias', nivel: 'Avanzado', modalidad: 'Programa',
    precio: 60000, descuento: 10, unidad: 'programa completo', duracion: '6 semanas',
    frecuencia: '2 veces por semana', horario: 'Mié y Sáb · 10:00', cantidadClases: 12,
    paraQuien: 'Para arqueros y jugadores que se van a presentar a una prueba en un club.',
    descripcionCorta: 'Seis semanas de puesta a punto, evaluación y video de presentación para llegar listo a la prueba.',
    descripcionCompleta: 'Un programa corto para llegar a la visoría en tu mejor nivel: evaluación física y técnica, entrenamiento específico del puesto, simulación de prueba y un video de presentación para mostrar en clubes. Consultá por WhatsApp las próximas visorías en clubes.',
    resultados: ['Evaluación física y técnica con informe', 'Trabajo específico del puesto', 'Simulación de una prueba real', 'Video de presentación para clubes'],
    requisitos: ['Edad y puesto para la prueba', 'Botines, canilleras o guantes según el puesto'],
    incluye: ['12 sesiones en 6 semanas', 'Informe de evaluación', 'Video de presentación editado'],
    docenteId: 'fabian', badge: '6 semanas', etiquetas: 'visoria prueba club seleccion captacion evaluacion',
    modulos: [
      m('Evaluación', [['Evaluación física', '45 min', 'evaluacion'], ['Evaluación técnica del puesto', '45 min', 'evaluacion'], ['Objetivos para la prueba', '20 min', 'evaluacion']]),
      m('Puesta a punto', [['Técnica específica del puesto', '75 min', 'cancha'], ['Velocidad y potencia', '60 min', 'cancha'], ['Toma de decisiones en juego', '60 min', 'cancha']]),
      m('Simulación y video', [['Simulación de prueba', '90 min', 'cancha'], ['Grabación del video de presentación', '60 min', 'video'], ['Revisión del video con el jugador', '30 min', 'video']]),
    ],
  },
  {
    id: 'av-video', slug: 'video-de-habilidades-para-clubes', titulo: 'Video de habilidades para clubes',
    categoria: 'audiovisual', nivel: 'Todos los niveles', modalidad: 'Servicio',
    precio: 35000, descuento: 0, unidad: 'por video', duracion: '1 jornada de grabación',
    frecuencia: 'A coordinar', horario: 'Día y hora a coordinar', cantidadClases: 1,
    paraQuien: 'Para mostrar lo que sabés hacer a clubes, representantes o visorías.',
    descripcionCorta: 'Grabamos tus mejores acciones en cancha y te entregamos un video editado para presentar.',
    descripcionCompleta: 'Una jornada de grabación con ejercicios elegidos para tu puesto y un video corto editado con tus mejores acciones, listo para mandar a clubes o compartir en redes.',
    resultados: ['Ejercicios elegidos según tu puesto', 'Tomas desde distintos ángulos', 'Video editado con tus mejores acciones', 'Versión vertical para redes'],
    requisitos: ['Ropa de entrenamiento lisa o del club', 'Guantes o botines según el puesto'],
    incluye: ['1 jornada de grabación en cancha', 'Edición del video', 'Versión horizontal y vertical'],
    docenteId: 'fabian', badge: 'Para clubes', etiquetas: 'video filmacion grabacion highlights compilado clubes redes',
    modulos: [
      m('Preparación', [['Charla sobre el puesto y el objetivo', '15 min', 'evaluacion'], ['Elección de ejercicios', '15 min', 'evaluacion'], ['Entrada en calor', '20 min', 'cancha']]),
      m('Grabación', [['Ejercicios técnicos', '40 min', 'video'], ['Acciones de juego', '40 min', 'video'], ['Tomas en cámara lenta', '20 min', 'video']]),
      m('Entrega', [['Selección de las mejores acciones', 'Edición', 'video'], ['Versión vertical para redes', 'Edición', 'video'], ['Entrega del video', 'Digital', 'video']]),
    ],
  },
  {
    id: 'av-fotos', slug: 'fotos-y-video-de-tu-entrenamiento', titulo: 'Fotos y video de tu entrenamiento',
    categoria: 'audiovisual', nivel: 'Todos los niveles', modalidad: 'Servicio',
    precio: 22000, descuento: 0, unidad: 'por sesión', duracion: '1 sesión',
    frecuencia: 'A coordinar', horario: 'Durante tu entrenamiento', cantidadClases: 1,
    paraQuien: 'Para tener fotos y clips de calidad de lo que entrenás.',
    descripcionCorta: 'Fotos profesionales y clips cortos durante una sesión, listos para tus redes.',
    descripcionCompleta: 'Durante una sesión de entrenamiento te sacamos fotos y grabamos clips cortos de tus mejores acciones. Sirve para tus redes o para sumar a tu video de presentación.',
    resultados: ['Fotos en alta calidad', 'Clips cortos de tus mejores acciones', 'Material listo para redes', 'Archivo para tu video de presentación'],
    requisitos: ['Estar inscripto en un entrenamiento o coordinar una sesión'],
    incluye: ['Cobertura de una sesión', 'Fotos editadas', 'Clips para redes'],
    docenteId: 'fabian', badge: '', etiquetas: 'fotos fotografia clips redes instagram tiktok',
    modulos: [
      m('Antes', [['Elegimos qué mostrar', '10 min', 'evaluacion'], ['Ajuste de luz y ángulos', '10 min', 'video'], ['Entrada en calor', '15 min', 'cancha']]),
      m('Durante', [['Fotos en acción', 'Toda la sesión', 'video'], ['Clips en cámara lenta', 'Toda la sesión', 'video'], ['Tomas verticales', 'Toda la sesión', 'video']]),
      m('Después', [['Selección y edición de fotos', 'Edición', 'video'], ['Clips para redes', 'Edición', 'video'], ['Entrega digital', 'Digital', 'video']]),
    ],
  },
];

const DESTACADOS = ['arq-perfeccionamiento', 'jug-tecnica', 'vis-preparacion', 'av-video'];

const getPrograma = id => PROGRAMAS.find(p => p.id === id);
const getCat = id => CATEGORIAS.find(c => c.id === id) || { id, nombre: id };
const getDocente = id => DOCENTES.find(d => d.id === id);

PROGRAMAS.forEach(p => {
  p._busca = norm([p.titulo, getCat(p.categoria).nombre, p.nivel, p.modalidad, getDocente(p.docenteId)?.nombre, p.descripcionCorta, p.paraQuien, p.resultados.join(' '), p.etiquetas].join(' '));
});

const guardarLocal = (clave, valor) => {
  try { localStorage.setItem(clave, valor); return true; } catch { return false; }
};

const Cart = {
  KEY: 'ceeafb_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(programa) {
    const items = this.get();
    if (items.some(i => i.id === programa.id)) return false;
    items.push({ id: programa.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getPrograma(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const p = getPrograma(i.id); return p ? s + precioFinal(p) : s; }, 0); },
  ahorro() { return this.get().reduce((s, i) => { const p = getPrograma(i.id); return p ? s + (p.precio - precioFinal(p)) : s; }, 0); },
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

function precioHTML(p) {
  const off = p.descuento > 0;
  return `<p class="precio">${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<strong>${formatearPrecio(precioFinal(p))}</strong><span>${esc(p.unidad)}</span>${off ? `<span class="off">-${p.descuento}%</span>` : ''}</p>`;
}

function addBtnHTML(p, abrir = false) {
  return `<button type="button" class="btn btn--primary btn--sm btn-add" data-add="${p.id}" data-nombre="${esc(p.titulo)}"${abrir ? ' data-abrir="1"' : ''} aria-label="Inscribirme en ${esc(p.titulo)}"><span class="btn-ico" data-add-ico>${ICO.plus}</span><span data-add-label>Inscribirme</span></button>`;
}

function destCardHTML(p) {
  const foto = FOTOS[p.categoria];
  return `<article class="dest-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="dest-media"><img src="${foto.src}" alt="${esc(foto.alt)}" width="1254" height="1254" decoding="async"></div>
    <div class="dest-tags"><span class="tag tag--${p.categoria}">${esc(getCat(p.categoria).nombre)}</span>${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</div>
    <div class="dest-body">
      <h3 class="dest-title">${esc(p.titulo)}</h3>
      <p class="dest-para">${esc(p.paraQuien)}</p>
      <ul class="dest-bullets">${p.resultados.slice(0, 3).map(r => `<li>${ICO.check}<span>${esc(r)}</span></li>`).join('')}</ul>
      <p class="dest-meta">${esc(p.modalidad)} · ${esc(p.frecuencia)} · ${esc(p.nivel)}</p>
      <div class="dest-foot">
        ${precioHTML(p)}
        <div class="dest-actions"><button type="button" class="btn btn--sm btn--on-photo" data-ver="${p.id}">Ver programa</button>${addBtnHTML(p)}</div>
      </div>
    </div>
  </article>`;
}

function renderDestacados() {
  const grid = document.getElementById('dest-grid');
  if (!grid) return;
  grid.innerHTML = DESTACADOS.map(getPrograma).filter(Boolean).map(destCardHTML).join('');
}

function filaHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(28px)"' : '';
  return `<article class="fila"${anim}>
    <div class="fila-prog">
      <span class="tag tag--${p.categoria}">${esc(getCat(p.categoria).nombre)}</span>
      <h3 class="fila-title"><button type="button" class="fila-link" data-ver="${p.id}">${esc(p.titulo)}</button></h3>
      <p class="fila-para">${esc(p.paraQuien)}</p>
    </div>
    <div class="fila-meta">
      <p class="fila-cell">${ICO_MODALIDAD[p.modalidad] || ''}<span><span class="sr-only">Modalidad: </span>${esc(p.modalidad)}</span></p>
      <p class="fila-cell">${ICO.clock}<span><span class="sr-only">Días y horario: </span>${esc(p.horario)}<small>${esc(p.frecuencia)}</small></span></p>
      <p class="fila-cell">${ICO.nivel}<span><span class="sr-only">Nivel: </span>${esc(p.nivel)}</span></p>
    </div>
    <div class="fila-precio"><span class="sr-only">Valor: </span>${precioHTML(p)}</div>
    <div class="fila-actions"><button type="button" class="btn btn--ghost btn--sm" data-ver="${p.id}">Ver detalle</button>${addBtnHTML(p)}</div>
  </article>`;
}

const Catalogo = { q: '', cat: 'todos', modalidad: '', nivel: '', visibles: 12, PASO: 12 };
const ORDEN_CAT = CATEGORIAS.map(c => c.id);

const hayFiltros = () => Boolean(Catalogo.q.trim() || Catalogo.cat !== 'todos' || Catalogo.modalidad || Catalogo.nivel);

function filtrados() {
  const terms = norm(Catalogo.q).split(/\s+/).filter(Boolean);
  return [...PROGRAMAS]
    .sort((a, b) => ORDEN_CAT.indexOf(a.categoria) - ORDEN_CAT.indexOf(b.categoria) || NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel))
    .filter(p => (Catalogo.cat === 'todos' || p.categoria === Catalogo.cat)
      && (!Catalogo.modalidad || p.modalidad === Catalogo.modalidad)
      && (!Catalogo.nivel || p.nivel === Catalogo.nivel)
      && terms.every(t => p._busca.includes(t)));
}

function renderCatalogo(yaVistos = 0) {
  const lista = document.getElementById('cat-lista');
  if (!lista) return;
  const res = filtrados();
  const vis = res.slice(0, Catalogo.visibles);
  lista.innerHTML = vis.map((p, k) => filaHTML(p, k >= yaVistos)).join('');
  const vacio = res.length === 0;
  lista.hidden = vacio;
  const head = document.querySelector('.cat-head');
  if (head) head.hidden = vacio;
  const empty = document.getElementById('cat-empty');
  if (empty) empty.hidden = !vacio;
  const count = document.getElementById('cat-count');
  if (count) count.textContent = hayFiltros()
    ? `${res.length} de ${PROGRAMAS.length} programas`
    : `${res.length} programas`;
  const clear = document.getElementById('cat-clear');
  if (clear) clear.hidden = !hayFiltros();
  const more = document.getElementById('cat-more');
  if (more) more.hidden = res.length <= Catalogo.visibles;
  const activos = (Catalogo.cat !== 'todos') + Boolean(Catalogo.modalidad) + Boolean(Catalogo.nivel);
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = activos; b.hidden = activos === 0; });
  syncAddButtons();
  revelarNuevos(lista);
}

function syncChips() {
  document.querySelectorAll('.chip[data-cat]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === Catalogo.cat)));
}

function aplicarCategoria(cat) {
  Catalogo.cat = ORDEN_CAT.includes(cat) ? cat : 'todos';
  Catalogo.visibles = Catalogo.PASO;
  syncChips();
  renderCatalogo();
}

function limpiarFiltros() {
  Catalogo.q = ''; Catalogo.cat = 'todos'; Catalogo.modalidad = ''; Catalogo.nivel = '';
  Catalogo.visibles = Catalogo.PASO;
  const q = document.getElementById('cat-q'); if (q) q.value = '';
  const mod = document.getElementById('cat-modalidad'); if (mod) mod.value = '';
  const niv = document.getElementById('cat-nivel'); if (niv) niv.value = '';
  syncChips();
  renderCatalogo();
}

function initCatalogo() {
  const lista = document.getElementById('cat-lista');
  if (!lista) return;
  const q = document.getElementById('cat-q');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.q = q.value; Catalogo.visibles = Catalogo.PASO; renderCatalogo(); }, 140);
  });
  document.querySelectorAll('.chip[data-cat]').forEach(c => c.addEventListener('click', () => aplicarCategoria(c.dataset.cat)));
  document.getElementById('cat-modalidad')?.addEventListener('change', e => { Catalogo.modalidad = e.target.value; Catalogo.visibles = Catalogo.PASO; renderCatalogo(); });
  document.getElementById('cat-nivel')?.addEventListener('change', e => { Catalogo.nivel = e.target.value; Catalogo.visibles = Catalogo.PASO; renderCatalogo(); });
  document.getElementById('cat-clear')?.addEventListener('click', limpiarFiltros);
  document.getElementById('cat-more')?.addEventListener('click', () => {
    const antes = Catalogo.visibles;
    Catalogo.visibles += Catalogo.PASO;
    renderCatalogo(antes);
  });
  const toggle = document.getElementById('cat-filtros-toggle');
  const panel = document.getElementById('cat-filtros');
  toggle?.addEventListener('click', () => {
    const abierto = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
  });
  renderCatalogo();
}

function syncAddButtons() {
  const ids = new Set(Cart.get().map(i => i.id));
  document.querySelectorAll('[data-add]').forEach(b => {
    const on = ids.has(b.dataset.add);
    if (b.classList.contains('is-added') === on && b.dataset.sync) return;
    b.dataset.sync = '1';
    b.classList.toggle('is-added', on);
    const label = b.querySelector('[data-add-label]');
    const ico = b.querySelector('[data-add-ico]');
    if (label) label.textContent = on ? 'Inscripto' : 'Inscribirme';
    if (ico) ico.innerHTML = on ? ICO.check : ICO.plus;
    b.setAttribute('aria-label', on ? `Inscripto en ${b.dataset.nombre}, ver tu inscripción` : `Inscribirme en ${b.dataset.nombre}`);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

const modal = document.getElementById('modal-programa');
const drawer = document.getElementById('drawer');
let modalVuelta = null;
let drawerVuelta = null;

const algoAbierto = () => (modal && !modal.hidden) || (drawer && !drawer.hidden) || Boolean(document.getElementById('mainNav')?.classList.contains('open'));

function setParamCurso(slug) {
  try {
    const u = new URL(location.href);
    if (slug) u.searchParams.set('curso', slug); else u.searchParams.delete('curso');
    window.history.replaceState(null, '', u);
    return true;
  } catch {
    return false;
  }
}

function modalHTML(p) {
  const doc = getDocente(p.docenteId);
  const foto = FOTOS[p.categoria];
  const lista = arr => `<ul class="mp-lista">${arr.map(x => `<li>${ICO.check}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const modulos = p.modulos.map((mod, i) => `<details class="mod"${i === 0 ? ' open' : ''}>
      <summary><span class="mod-num">0${i + 1}</span><span class="mod-titulo">${esc(mod.titulo)}</span><span class="mod-cant">${mod.clases.length} bloques</span>${ICO.chevron}</summary>
      <ol>${mod.clases.map(c => `<li>${ICO[c.tipo] || ''}<span>${esc(c.titulo)}</span><span>${esc(c.duracion)}</span></li>`).join('')}</ol>
    </details>`).join('');
  return `<article class="mp">
    <div class="mp-top">
      <figure class="mp-media"><img src="${foto.src}" alt="${esc(foto.alt)}" width="1254" height="1254" decoding="async"></figure>
      <div class="mp-resumen">
        <div class="mp-tags"><span class="tag tag--${p.categoria}">${esc(getCat(p.categoria).nombre)}</span>${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</div>
        <h2 class="mp-title">${esc(p.titulo)}</h2>
        <p class="mp-desc">${esc(p.descripcionCompleta)}</p>
        <dl class="mp-datos">
          <div class="mp-dato-ancho"><dt>Para quién</dt><dd>${esc(p.paraQuien)}</dd></div>
          <div><dt>Modalidad</dt><dd>${esc(p.modalidad)}</dd></div>
          <div><dt>Nivel</dt><dd>${esc(p.nivel)}</dd></div>
          <div><dt>Días y horario</dt><dd>${esc(p.horario)}</dd></div>
          <div><dt>Frecuencia</dt><dd>${esc(p.frecuencia)}</dd></div>
          <div><dt>Duración</dt><dd>${esc(p.duracion)}</dd></div>
          <div><dt>Sesiones</dt><dd>${p.cantidadClases}</dd></div>
        </dl>
        <div class="mp-compra">${precioHTML(p)}<div class="mp-botones">${addBtnHTML(p, true)}</div></div>
        <a class="mp-consulta" href="${wspLink(`Hola, quiero consultar por el programa "${p.titulo}".`)}" target="_blank" rel="noopener">${ICO.wsp}Consultar este programa por WhatsApp</a>
      </div>
    </div>
    <div class="mp-cols">
      <section class="mp-bloque"><h3>Qué vas a trabajar</h3>${lista(p.resultados)}</section>
      <section class="mp-bloque"><h3>Qué incluye</h3>${lista(p.incluye)}<h3 class="mp-sub">Qué traer</h3>${lista(p.requisitos)}</section>
      <section class="mp-bloque mp-programa"><h3>Programa por etapas</h3>${modulos}
        <p class="mp-leyenda">${Object.entries(TIPOS).map(([k, v]) => `<span>${ICO[k]}${v}</span>`).join('')}</p>
      </section>
      ${doc ? `<div class="mp-docente"><span class="mp-inicial" aria-hidden="true">${esc(doc.iniciales)}</span><div><h3>${esc(doc.nombre)}</h3><p class="mp-rol">${esc(doc.rol)}</p><p>${esc(doc.bio)}</p></div></div>` : ''}
    </div>
  </article>`;
}

function abrirModal(id, desde) {
  const p = getPrograma(id);
  if (!p || !modal) return;
  modalVuelta = desde || document.activeElement;
  const body = document.getElementById('modal-body');
  body.innerHTML = modalHTML(p);
  body.scrollTop = 0;
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
  modal.querySelector('.modal-panel')?.focus({ preventScroll: true });
  syncAddButtons();
  setParamCurso(p.slug);
}

function cerrarModal(devolverFoco = true) {
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setParamCurso(null);
  const fin = () => {
    modal.hidden = true;
    if (!algoAbierto()) document.body.classList.remove('no-scroll');
  };
  if (reduceMotion) fin(); else setTimeout(fin, 320);
  if (devolverFoco && modalVuelta && document.contains(modalVuelta)) modalVuelta.focus({ preventScroll: true });
}

function renderDrawer() {
  if (!drawer) return;
  const items = Cart.get().map(i => getPrograma(i.id)).filter(Boolean);
  const cont = document.getElementById('drawer-items');
  const vacio = document.getElementById('drawer-empty');
  const pie = document.getElementById('drawer-foot');
  cont.innerHTML = items.map((p, k) => `<div class="d-item" style="animation-delay:${Math.min(k * 0.06, 0.3)}s">
      <span class="tag tag--${p.categoria}">${esc(getCat(p.categoria).nombre)}</span>
      <p class="d-title">${esc(p.titulo)}</p>
      <p class="d-meta">${esc(p.modalidad)} · ${esc(p.horario)}</p>
      ${precioHTML(p)}
      <button type="button" class="icon-btn" data-quitar="${p.id}" aria-label="Quitar ${esc(p.titulo)} de tu inscripción">${ICO.trash}</button>
    </div>`).join('');
  cont.hidden = items.length === 0;
  vacio.hidden = items.length > 0;
  pie.hidden = items.length === 0;
  document.getElementById('drawer-total').textContent = formatearPrecio(Cart.total());
  const ahorro = Cart.ahorro();
  const ahorroEl = document.getElementById('drawer-ahorro');
  ahorroEl.hidden = ahorro <= 0;
  ahorroEl.textContent = ahorro > 0 ? `Ahorrás ${formatearPrecio(ahorro)} con los descuentos` : '';
}

function abrirDrawer(desde) {
  if (!drawer) return;
  drawerVuelta = desde || document.activeElement;
  renderDrawer();
  drawer.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('.drawer-panel')?.focus({ preventScroll: true });
}

function cerrarDrawer(devolverFoco = true) {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  const fin = () => {
    drawer.hidden = true;
    if (!algoAbierto()) document.body.classList.remove('no-scroll');
  };
  if (reduceMotion) fin(); else setTimeout(fin, 380);
  if (devolverFoco && drawerVuelta && document.contains(drawerVuelta)) drawerVuelta.focus({ preventScroll: true });
}

function inscribir(id, abrir) {
  const p = getPrograma(id);
  if (!p) return;
  const yaEstaba = Cart.has(id);
  if (!yaEstaba) Cart.add(p);
  if (abrir || yaEstaba) {
    if (modal && !modal.hidden) cerrarModal(false);
    abrirDrawer();
    return;
  }
  showToast(`Sumaste «${p.titulo}» a tu inscripción`);
}

function atrapar(e, cont) {
  const focos = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!focos.length) return;
  const primero = focos[0];
  const ultimo = focos[focos.length - 1];
  if (e.shiftKey && (document.activeElement === primero || !cont.contains(document.activeElement))) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initOverlays() {
  document.addEventListener('click', e => {
    const t = e.target;
    const add = t.closest('[data-add]');
    if (add) { inscribir(add.dataset.add, add.dataset.abrir === '1'); return; }
    const ver = t.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver, ver); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) {
      const p = getPrograma(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      drawer?.querySelector('.drawer-panel')?.focus({ preventScroll: true });
      if (p) showToast(`Quitaste «${p.titulo}»`);
      return;
    }
    if (t.closest('[data-close-modal]')) { cerrarModal(); return; }
    const cierraDrawer = t.closest('[data-close-drawer]');
    if (cierraDrawer) { cerrarDrawer(cierraDrawer.tagName !== 'A'); return; }
    const abreCarrito = t.closest('[data-open-cart]');
    if (abreCarrito) { abrirDrawer(abreCarrito); return; }
    const filtro = t.closest('[data-filtro-cat]');
    if (filtro) aplicarCategoria(filtro.dataset.filtroCat);
    if (t.closest('[data-limpiar]')) limpiarFiltros();
  });

  document.addEventListener('keydown', e => {
    const abierto = modal && !modal.hidden ? modal : (drawer && !drawer.hidden ? drawer : null);
    if (!abierto) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (abierto === modal) cerrarModal(); else cerrarDrawer();
      return;
    }
    if (e.key === 'Tab') atrapar(e, abierto);
  });

  const fin = document.getElementById('drawer-finalizar');
  fin?.addEventListener('click', () => {
    if (!Cart.count()) return;
    const texto = fin.textContent;
    fin.disabled = true;
    fin.textContent = 'Procesando…';
    setTimeout(() => {
      fin.disabled = false;
      fin.textContent = texto;
      showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
    }, 800);
  });

  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    syncAddButtons();
    if (drawer && !drawer.hidden) renderDrawer();
  });
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
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const sync = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  window.addEventListener('scroll', sync, { passive: true });
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

function inyectarSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': PROGRAMAS.map(p => ({
      '@type': 'Course',
      name: p.titulo,
      description: p.descripcionCorta,
      provider: { '@type': 'EducationalOrganization', name: 'C.E.E.A.F.B', url: 'https://gokywebs.com/demo/ceeafb/' },
      offers: { '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS', category: p.unidad },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', courseSchedule: { '@type': 'Schedule', repeatFrequency: p.frecuencia } },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function abrirDesdeURL() {
  const slug = new URLSearchParams(location.search).get('curso');
  if (!slug) return;
  const p = PROGRAMAS.find(x => x.slug === slug);
  if (p) abrirModal(p.id); else setParamCurso(null);
}

renderDestacados();
initCatalogo();
initReveals();
initOverlays();
initNav();
initHeader();
initFloats();
initModelBarScroll();
updateCartBadge();
syncAddButtons();
inyectarSchema();
abrirDesdeURL();
