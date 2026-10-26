const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491159745386';
const IG = 'https://www.instagram.com/you.can.education/';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => (c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio);
const waLink = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const svg = (inner, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
const ICON = {
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'ico ico-arrow'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  vivo: svg('<circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>'),
  video: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>'),
  pdf: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>'),
  practica: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  kit: svg('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  descarga: svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  persona: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'
};
const TIPOS = { vivo: 'En vivo', video: 'Video', pdf: 'PDF', practica: 'Práctica' };

const CATEGORIAS = {
  talleres: { nombre: 'Talleres docentes', fig: 'tri' },
  ingles: { nombre: 'Inglés online', fig: 'cir' },
  master: { nombre: 'Masterclasses', fig: 'cua' },
  material: { nombre: 'Material inclusivo', fig: 'hex' }
};
const PARA = { docentes: 'Docentes', estudiantes: 'Estudiantes de inglés', familias: 'Familias', instituciones: 'Instituciones' };
const DIRECTOR = { nombre: 'Mag. Ricardo Spizzo', rol: 'Director de You Can Education · Coach educativo' };
const ETAPAS = {
  comprender: ['neuropedagogia-aplicada', 'funciones-ejecutivas', 'conciencia-fonologica'],
  detectar: ['dislexia-en-el-aula', 'dispraxia-en-primaria', 'familias-dislexia'],
  adaptar: ['aula-inclusiva', 'dua-en-90-minutos', 'ingles-multisensorial']
};
const OFERTAS_ONLINE = ['clase-individual', 'pack-4-clases', 'speaking-docentes'];

const mod = (titulo, clases) => ({ titulo, clases: clases.map(([t, d, tipo]) => ({ titulo: t, duracion: d, tipo })) });
const PASOS_CLASE = ['Nos contás el objetivo y tu nivel por WhatsApp', 'Coordinamos el día y el horario', 'Clase en vivo por videollamada', 'Te llega el material y la tarea en PDF'];

const CURSOS = [
  {
    id: 'dislexia-en-el-aula', titulo: 'Dislexia en el aula: señales, ajustes y evaluación', categoria: 'talleres', tipo: 'curso',
    para: ['docentes'], nivel: 'Inicial', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Taller en vivo',
    duracion: '4 encuentros de 2 h', cuando: 'Martes de noviembre · 19 a 21 h', precio: 38000, descuento: 0, badge: 'Para empezar', destacado: 1,
    foto: 'rotafolio-taller', alt: 'Rotafolio blanco, notas adhesivas de colores y marcadores sobre una mesa de taller',
    descripcionCorta: 'Qué mirar en la clase, qué ajustar en la enseñanza y cómo evaluar a un estudiante con dislexia sin bajar la exigencia.',
    resultados: ['Reconocer señales de dislexia según la edad y el nivel', 'Ajustar consignas, tiempos y materiales de tu clase', 'Armar una evaluación justa para todo el grupo'],
    requisitos: 'Para docentes de nivel inicial, primario y secundario. No hace falta formación previa en el tema.',
    incluye: ['4 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Planilla de registro de señales en PDF', 'Constancia de participación'],
    tags: 'dislexia lectoescritura lectura evaluacion ajustes inclusion primaria secundaria',
    modulos: [
      mod('Qué es la dislexia (y qué no)', [['Cómo aprende a leer el cerebro', '40 min', 'vivo'], ['Mitos frecuentes en la escuela', '30 min', 'vivo'], ['Señales por edad y por nivel', '12 págs.', 'pdf']]),
      mod('Detectar en el aula', [['Observar la clase de lengua', '40 min', 'vivo'], ['Registro de señales', 'Planilla', 'pdf'], ['Cómo hablar con la familia', '30 min', 'vivo']]),
      mod('Ajustar la enseñanza', [['Apoyos visuales y multisensoriales', '45 min', 'vivo'], ['Consignas claras y tiempos', '30 min', 'vivo'], ['Lectura compartida en voz alta', '25 min', 'video']]),
      mod('Evaluar sin dejar afuera', [['Ajustes en evaluaciones escritas', '40 min', 'vivo'], ['Evaluación oral y por proyectos', '30 min', 'vivo'], ['Tu plan para el grupo', 'Práctica', 'practica']])
    ]
  },
  {
    id: 'ingles-multisensorial', titulo: 'Inglés multisensorial para estudiantes con dislexia', categoria: 'ingles', tipo: 'curso',
    para: ['docentes'], nivel: 'Intermedio', modalidad: 'Grabado + en vivo', modos: ['grabado', 'vivo'], formato: 'Curso grabado + en vivo',
    duracion: '8 clases grabadas + 2 encuentros', cuando: 'Acceso inmediato · encuentros en noviembre', precio: 48000, descuento: 0, badge: 'Nuevo', destacado: 2,
    foto: 'cuaderno-auriculares', alt: 'Cuaderno abierto, auriculares azules, lápiz y taza sobre un escritorio junto a la ventana',
    descripcionCorta: 'Para docentes de inglés: sonidos, vocabulario y lectura con apoyos visuales, auditivos y de movimiento.',
    resultados: ['Enseñar los sonidos del inglés de forma explícita y ordenada', 'Presentar vocabulario con apoyos multisensoriales', 'Adaptar lecturas y evaluaciones de inglés'],
    requisitos: 'Para docentes y profesores de inglés de cualquier nivel educativo.',
    incluye: ['8 clases grabadas para ver a tu ritmo', '2 encuentros en vivo de consulta', 'Banco de actividades en PDF', 'Constancia de participación'],
    tags: 'ingles english phonics dislexia lengua extranjera esl multisensorial pronunciacion',
    modulos: [
      mod('Dislexia y lengua extranjera', [['Por qué el inglés cuesta más', '25 min', 'video'], ['Ortografía y conciencia fonológica', '30 min', 'video'], ['Lectura de apoyo', '10 págs.', 'pdf']]),
      mod('Sonidos y letras', [['Phonics paso a paso', '35 min', 'video'], ['Juegos de sonidos para la clase', '25 min', 'video'], ['Primer encuentro en vivo', '60 min', 'vivo']]),
      mod('Vocabulario y lectura', [['Vocabulario con imágenes y gestos', '30 min', 'video'], ['Lecturas adaptadas', '30 min', 'video'], ['Banco de actividades', '24 págs.', 'pdf']]),
      mod('Evaluar en inglés', [['Ajustes en pruebas escritas', '25 min', 'video'], ['Evaluación oral', '25 min', 'video'], ['Segundo encuentro en vivo', '60 min', 'vivo']])
    ]
  },
  {
    id: 'funciones-ejecutivas', titulo: 'Masterclass: funciones ejecutivas en el aula', categoria: 'master', tipo: 'curso',
    para: ['docentes', 'familias'], nivel: 'Todos los niveles', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Masterclass en vivo',
    duracion: '90 minutos', cuando: 'Noviembre · 19 h · fecha a confirmar', precio: 15000, descuento: 0, badge: 'En vivo', destacado: 3,
    foto: 'proyector-sala', alt: 'Proyector, cuaderno azul y control remoto sobre una mesa frente a filas de sillas',
    descripcionCorta: 'Atención, memoria de trabajo y planificación: qué son, cómo se ven en la clase y cómo ayudar a desarrollarlas.',
    resultados: ['Entender qué son las funciones ejecutivas', 'Reconocerlas en la conducta de tus estudiantes', 'Llevarte estrategias simples para el aula y la casa'],
    requisitos: 'Abierta a docentes, familias y profesionales de la educación.',
    incluye: ['Masterclass en vivo de 90 minutos', 'Grabación disponible después', 'Presentación en PDF'],
    tags: 'funciones ejecutivas atencion memoria planificacion tdah conducta',
    modulos: [
      mod('Qué son', [['Atención, memoria de trabajo y control', '20 min', 'vivo'], ['Cómo maduran con la edad', '10 min', 'vivo'], ['Mitos sobre la atención', '10 min', 'vivo']]),
      mod('En la clase', [['Cómo se ven en el día a día', '15 min', 'vivo'], ['Estrategias para el aula', '15 min', 'vivo'], ['Ideas para la casa', '10 min', 'vivo']]),
      mod('Para llevarte', [['Ronda de preguntas', '10 min', 'vivo'], ['Presentación de la masterclass', 'PDF', 'pdf'], ['Grabación', '90 min', 'video']])
    ]
  },
  {
    id: 'neuropedagogia-aplicada', titulo: 'Neuropedagogía aplicada: cómo aprende el cerebro y qué cambia en tu planificación', categoria: 'talleres', tipo: 'curso',
    para: ['docentes'], nivel: 'Intermedio', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Taller en vivo',
    duracion: '6 encuentros de 2 h', cuando: 'Jueves de noviembre y diciembre · 19 a 21 h', precio: 52000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Atención, memoria y emoción explicadas para el aula, con ideas concretas para planificar, dar la clase y repasar.',
    resultados: ['Planificar teniendo en cuenta la atención y la memoria', 'Diseñar repasos que ayuden a recordar', 'Cuidar el clima emocional de la clase'],
    requisitos: 'Para docentes de todos los niveles y equipos de orientación escolar.',
    incluye: ['6 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Guía de planificación en PDF', 'Constancia de participación'],
    tags: 'neuroeducacion neurociencia cerebro atencion memoria emocion planificacion',
    modulos: [
      mod('El cerebro que aprende', [['Redes, conexiones y plasticidad', '40 min', 'vivo'], ['Mitos de la neuroeducación', '30 min', 'vivo'], ['Lectura de apoyo', '10 págs.', 'pdf']]),
      mod('Atención y memoria', [['Cómo se sostiene la atención', '40 min', 'vivo'], ['Memoria de trabajo y de largo plazo', '40 min', 'vivo'], ['Repasos espaciados', '25 min', 'video']]),
      mod('Emoción y aprendizaje', [['El clima de la clase', '40 min', 'vivo'], ['Error y motivación', '30 min', 'vivo'], ['Rutinas que dan seguridad', '25 min', 'video']]),
      mod('Planificar con todo esto', [['Una secuencia de clase completa', '45 min', 'vivo'], ['Ajustes para la diversidad', '30 min', 'vivo'], ['Tu planificación revisada', 'Práctica', 'practica']])
    ]
  },
  {
    id: 'clase-individual', titulo: 'Clase de inglés individual · 60 minutos', categoria: 'ingles', tipo: 'clase',
    para: ['estudiantes'], nivel: 'Todos los niveles', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Clase online',
    duracion: '1 clase de 60 min', cuando: 'Día y horario a coordinar', precio: 14000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Una clase por videollamada para practicar un tema puntual, preparar una prueba o destrabar la lectura en inglés.',
    resultados: ['Trabajar el tema que necesitás, a tu ritmo', 'Practicar con apoyos visuales y auditivos', 'Llevarte material y ejercicios para repasar'],
    requisitos: 'Para estudiantes de cualquier edad y nivel. Solo necesitás conexión a internet y auriculares.',
    incluye: ['Clase en vivo por videollamada', 'Material de la clase en PDF', 'Ejercicios para repasar'],
    tags: 'ingles clase particular individual examen prueba lectura online',
    pasos: PASOS_CLASE
  },
  {
    id: 'pack-4-clases', titulo: 'Pack de 4 clases de inglés individuales', categoria: 'ingles', tipo: 'clase',
    para: ['estudiantes'], nivel: 'Todos los niveles', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Clases online',
    duracion: '4 clases de 60 min', cuando: 'Una por semana · horario a coordinar', precio: 56000, descuento: 10, badge: '', destacado: 0,
    descripcionCorta: 'Un mes de clases semanales con un plan de trabajo armado para vos y seguimiento entre una clase y la otra.',
    resultados: ['Avanzar con un plan pensado para tu objetivo', 'Practicar todas las semanas con la misma guía', 'Ver tu progreso clase a clase'],
    requisitos: 'Para estudiantes de cualquier edad y nivel. Solo necesitás conexión a internet y auriculares.',
    incluye: ['4 clases en vivo por videollamada', 'Plan de trabajo personalizado', 'Material y ejercicios en PDF'],
    tags: 'ingles clases particulares pack mensual semanal online',
    pasos: PASOS_CLASE
  },
  {
    id: 'aula-inclusiva', titulo: 'Aula inclusiva: configuraciones de apoyo y evaluación diversificada', categoria: 'talleres', tipo: 'curso',
    para: ['docentes', 'instituciones'], nivel: 'Intermedio', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Taller en vivo',
    duracion: '4 encuentros de 2 h', cuando: 'Miércoles de noviembre · 19 a 21 h', precio: 42000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Herramientas para planificar una misma clase para estudiantes distintos y evaluar con criterios claros para todos.',
    resultados: ['Diseñar configuraciones de apoyo para tu grupo', 'Planificar actividades con distintos puntos de entrada', 'Evaluar con rúbricas y producciones variadas'],
    requisitos: 'Para docentes, equipos directivos y equipos de orientación escolar.',
    incluye: ['4 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Plantillas de planificación y rúbricas', 'Constancia de participación'],
    tags: 'inclusion configuraciones de apoyo dua evaluacion rubricas integracion diversidad',
    modulos: [
      mod('Mirar al grupo', [['La diversidad en el aula', '40 min', 'vivo'], ['Barreras para aprender y participar', '30 min', 'vivo'], ['Lectura de apoyo', '8 págs.', 'pdf']]),
      mod('Configuraciones de apoyo', [['Qué son y cuándo usarlas', '40 min', 'vivo'], ['Apoyos de tiempo, espacio y materiales', '35 min', 'vivo'], ['Trabajo con el equipo de integración', '30 min', 'vivo']]),
      mod('Una clase para todos', [['Diseño Universal para el Aprendizaje', '40 min', 'vivo'], ['Actividades con varios niveles', '35 min', 'vivo'], ['Una clase resuelta', '20 min', 'video']]),
      mod('Evaluar distinto', [['Rúbricas claras', '35 min', 'vivo'], ['Producciones orales, visuales y escritas', '30 min', 'vivo'], ['Tu propuesta de evaluación', 'Práctica', 'practica']])
    ]
  },
  {
    id: 'conciencia-fonologica', titulo: 'Masterclass: conciencia fonológica en español y en inglés', categoria: 'master', tipo: 'curso',
    para: ['docentes'], nivel: 'Inicial', modalidad: 'Grabada', modos: ['grabado'], formato: 'Masterclass grabada',
    duracion: '90 minutos', cuando: 'Acceso inmediato', precio: 12000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'La base de la lectura: cómo trabajar sílabas, rimas y sonidos en las dos lenguas, con actividades listas para usar.',
    resultados: ['Entender por qué la conciencia fonológica anticipa la lectura', 'Trabajar sílabas, rimas y fonemas en español y en inglés', 'Usar actividades cortas en cualquier momento de la clase'],
    requisitos: 'Para docentes de nivel inicial, primer ciclo y profesores de inglés.',
    incluye: ['Masterclass grabada de 90 minutos', 'Para ver cuando quieras', 'Actividades en PDF'],
    tags: 'conciencia fonologica lectura silabas rimas fonemas ingles espanol inicial',
    modulos: [
      mod('Qué es', [['De la oralidad a la lectura', '15 min', 'video'], ['Niveles: sílaba, rima y fonema', '15 min', 'video'], ['Diferencias entre español e inglés', '10 min', 'video']]),
      mod('En la clase', [['Juegos con sílabas', '15 min', 'video'], ['Rimas y canciones', '10 min', 'video'], ['Aislar y unir sonidos', '15 min', 'video']]),
      mod('Para llevarte', [['Secuencia sugerida por edad', '10 min', 'video'], ['Actividades listas para usar', '16 págs.', 'pdf'], ['Registro de avances', 'Planilla', 'pdf']])
    ]
  },
  {
    id: 'dispraxia-en-primaria', titulo: 'Dispraxia en primaria: escritura, motricidad y organización', categoria: 'talleres', tipo: 'curso',
    para: ['docentes'], nivel: 'Inicial', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Taller en vivo',
    duracion: '3 encuentros de 2 h', cuando: 'Lunes de noviembre · 18 a 20 h', precio: 32000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Cómo acompañar a quien tiene dificultades para escribir, copiar del pizarrón u ordenar sus materiales.',
    resultados: ['Reconocer la dispraxia y diferenciarla de otras dificultades', 'Adaptar la escritura y la copia en el cuaderno', 'Dar apoyos para organizarse en el día a día'],
    requisitos: 'Para docentes de primaria, equipos de integración y acompañantes.',
    incluye: ['3 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Fichas de motricidad fina en PDF', 'Constancia de participación'],
    tags: 'dispraxia motricidad escritura caligrafia organizacion coordinacion',
    modulos: [
      mod('Qué es la dispraxia', [['Coordinación y planificación motora', '40 min', 'vivo'], ['Señales en el aula', '30 min', 'vivo'], ['Lectura de apoyo', '8 págs.', 'pdf']]),
      mod('Escribir y copiar', [['Agarre, trazo y espacio en la hoja', '40 min', 'vivo'], ['Alternativas a la copia', '30 min', 'vivo'], ['Ejercicios de motricidad fina', '20 min', 'video']]),
      mod('Organizarse', [['Rutinas y apoyos visuales', '35 min', 'vivo'], ['El banco y los útiles', '25 min', 'vivo'], ['Plan de apoyo para un estudiante', 'Práctica', 'practica']])
    ]
  },
  {
    id: 'fichas-lectoescritura', titulo: 'Fichas de lectoescritura multisensorial · 60 fichas en PDF', categoria: 'material', tipo: 'material',
    para: ['docentes', 'familias'], nivel: 'Inicial', modalidad: 'PDF descargable', modos: ['pdf'], formato: 'PDF descargable',
    duracion: '60 fichas', cuando: 'Descarga al confirmar la compra', precio: 9500, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Fichas para trabajar letras, sílabas y lectura con colores, trazos y movimiento. Listas para imprimir.',
    contenido: ['20 fichas de letras y sonidos', '20 fichas de sílabas y palabras', '20 fichas de lectura con pictogramas', 'Guía de uso para docentes y familias'],
    uso: 'Primer ciclo de primaria, apoyo escolar y trabajo en casa.',
    tags: 'fichas lectoescritura imprimir pdf letras silabas lectura dislexia'
  },
  {
    id: 'speaking-docentes', titulo: 'Speaking para docentes: grupo reducido', categoria: 'ingles', tipo: 'curso',
    para: ['docentes'], nivel: 'Intermedio', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Clases grupales',
    duracion: '8 clases de 60 min', cuando: 'Sábados por la mañana · horario a confirmar', precio: 60000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Conversación y pronunciación en grupos chicos, para docentes que enseñan o quieren empezar a enseñar en inglés.',
    resultados: ['Ganar fluidez para hablar en clase', 'Mejorar la pronunciación de las palabras que más usás', 'Dar consignas en inglés con seguridad'],
    requisitos: 'Nivel intermedio de inglés. Antes de empezar hacemos una charla corta para armar los grupos.',
    incluye: ['8 clases grupales en vivo', 'Grupos reducidos', 'Glosario de classroom language en PDF'],
    tags: 'speaking conversacion pronunciacion docentes ingles grupo fluidez',
    modulos: [
      mod('En la clase', [['Consignas y rutinas', '60 min', 'vivo'], ['Preguntas y devoluciones', '60 min', 'vivo'], ['Manejo del grupo', '60 min', 'vivo']]),
      mod('Pronunciación', [['Los sonidos que más cuestan', '60 min', 'vivo'], ['Acento y entonación', '60 min', 'vivo'], ['Leer en voz alta', '60 min', 'vivo']]),
      mod('Conversación', [['Hablar de tu trabajo', '60 min', 'vivo'], ['Debatir un tema educativo', '60 min', 'vivo'], ['Classroom language', 'Glosario', 'pdf']])
    ]
  },
  {
    id: 'kit-sensorial', titulo: 'Kit sensorial de aula: pelotas texturadas, aros y bloques', categoria: 'material', tipo: 'material',
    para: ['docentes', 'instituciones', 'familias'], nivel: 'Inicial', modalidad: 'Material físico', modos: ['fisico'], formato: 'Material físico',
    duracion: '13 piezas + bolsa de tela', cuando: 'Entrega a coordinar por WhatsApp', precio: 34000, descuento: 0, badge: '', destacado: 0,
    foto: 'kit-sensorial', alt: 'Pelotas texturadas azul, mostaza y crema, aros flexibles y bloques de madera con figuras junto a una bolsa de tela',
    descripcionCorta: 'Piezas para trabajar regulación, atención y motricidad: pelotas con texturas, aros flexibles y bloques con figuras.',
    contenido: ['3 pelotas texturadas de distintos tamaños', '3 aros flexibles', '7 bloques de madera con figuras', 'Bolsa de tela para guardar todo', 'Guía de actividades en PDF'],
    uso: 'Rincón de calma, apoyo escolar y espacios terapéuticos.',
    tags: 'kit sensorial pelotas texturas regulacion motricidad bloques'
  },
  {
    id: 'dua-en-90-minutos', titulo: 'Masterclass: Diseño Universal para el Aprendizaje (DUA) en 90 minutos', categoria: 'master', tipo: 'curso',
    para: ['docentes', 'instituciones'], nivel: 'Inicial', modalidad: 'Grabada', modos: ['grabado'], formato: 'Masterclass grabada',
    duracion: '90 minutos', cuando: 'Acceso inmediato', precio: 12000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Los tres principios del DUA explicados con ejemplos de clases reales y una plantilla para planificar la tuya.',
    resultados: ['Entender los tres principios del DUA', 'Ofrecer más de una forma de acceder, hacer y mostrar', 'Planificar una clase con la plantilla'],
    requisitos: 'Para docentes, equipos directivos y equipos de orientación.',
    incluye: ['Masterclass grabada de 90 minutos', 'Para ver cuando quieras', 'Plantilla de planificación DUA'],
    tags: 'dua diseno universal aprendizaje planificacion inclusion',
    modulos: [
      mod('Los principios', [['Por qué un diseño universal', '15 min', 'video'], ['Múltiples formas de implicación', '10 min', 'video'], ['Representación y expresión', '15 min', 'video']]),
      mod('En una clase real', [['Una clase de lengua', '15 min', 'video'], ['Una clase de matemática', '15 min', 'video'], ['Errores frecuentes', '10 min', 'video']]),
      mod('Para llevarte', [['Cómo usar la plantilla', '10 min', 'video'], ['Plantilla de planificación', 'Editable', 'pdf'], ['Tu primera clase DUA', 'Práctica', 'practica']])
    ]
  },
  {
    id: 'figuras-madera', titulo: 'Set de figuras de madera para clasificar y secuenciar', categoria: 'material', tipo: 'material',
    para: ['docentes', 'familias'], nivel: 'Inicial', modalidad: 'Material físico', modos: ['fisico'], formato: 'Material físico',
    duracion: 'Figuras, aros, esferas y bandeja', cuando: 'Entrega a coordinar por WhatsApp', precio: 26000, descuento: 0, badge: '', destacado: 0,
    foto: 'figuras-madera', alt: 'Figuras de madera azules, mostaza y naturales con aros y esferas sobre una mesa clara',
    descripcionCorta: 'Figuras, aros y esferas de madera en tres colores para clasificar, contar, armar secuencias y trabajar el lenguaje.',
    contenido: ['Figuras geométricas en azul, mostaza y madera natural', 'Aros para enhebrar y apilar', 'Esferas de madera', 'Bandeja de madera', 'Fichas de actividades en PDF'],
    uso: 'Nivel inicial, primer ciclo y apoyo terapéutico.',
    tags: 'figuras madera clasificar secuencias montessori formas colores'
  },
  {
    id: 'familias-dislexia', titulo: 'Masterclass para familias: cómo acompañar a un hijo con dislexia', categoria: 'master', tipo: 'curso',
    para: ['familias'], nivel: 'Todos los niveles', modalidad: 'Online en vivo', modos: ['vivo'], formato: 'Masterclass en vivo',
    duracion: '90 minutos', cuando: 'Sábado por la mañana · fecha a confirmar', precio: 10000, descuento: 0, badge: '', destacado: 0,
    descripcionCorta: 'Qué es la dislexia, cómo hablar con la escuela y cómo ayudar con la tarea sin que cada tarde sea una batalla.',
    resultados: ['Entender qué le pasa a tu hijo cuando lee y escribe', 'Pedirle a la escuela los apoyos que necesita', 'Organizar la tarea en casa con menos frustración'],
    requisitos: 'Abierta a madres, padres y adultos a cargo.',
    incluye: ['Masterclass en vivo de 90 minutos', 'Grabación disponible después', 'Guía para la reunión con la escuela'],
    tags: 'familias padres madres dislexia tarea escuela acompanar hijos',
    modulos: [
      mod('Entender', [['Qué es la dislexia', '20 min', 'vivo'], ['Lo que no es', '10 min', 'vivo'], ['Fortalezas para cuidar', '10 min', 'vivo']]),
      mod('Con la escuela', [['Qué pedir y cómo', '15 min', 'vivo'], ['Configuraciones de apoyo', '10 min', 'vivo'], ['Guía para la reunión', 'PDF', 'pdf']]),
      mod('En casa', [['La tarea sin peleas', '15 min', 'vivo'], ['Leer juntos', '10 min', 'vivo'], ['Ronda de preguntas', '10 min', 'vivo']])
    ]
  }
];

const RECURSOS = [
  { id: 'guia-senales', titulo: 'Guía rápida: señales de dislexia por edad', meta: 'PDF · 8 páginas' },
  { id: 'glosario', titulo: 'Glosario de neuropedagogía para docentes', meta: 'PDF · 12 páginas' },
  { id: 'checklist-apoyos', titulo: 'Checklist de configuraciones de apoyo para el aula', meta: 'PDF · 2 páginas' },
  { id: 'bibliografia', titulo: 'Bibliografía recomendada: dislexia, dispraxia y DUA', meta: 'PDF · 4 páginas' },
  { cat: 'material', titulo: 'Material inclusivo para el aula: fichas, kits y figuras', meta: 'PDF descargable y material físico' }
];

const getCurso = id => CURSOS.find(c => c.id === id);
const figHTML = cat => `<span class="fig fig-${CATEGORIAS[cat]?.fig || 'tri'}" aria-hidden="true"></span>`;
const ACCION = { curso: 'Inscribirme', clase: 'Reservar', material: 'Comprar' };

const Cart = {
  KEY: 'youcan_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { return; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    const items = this.get();
    if (!items.some(i => i.id === curso.id)) items.push({ id: curso.id, qty: 1 });
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getCurso(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); }
};

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

const precioHTML = c => (c.descuento > 0
  ? `<span class="p-final">${formatearPrecio(precioFinal(c))}</span><s class="p-antes">${formatearPrecio(c.precio)}</s><span class="p-off">-${c.descuento}%</span>`
  : `<span class="p-final">${formatearPrecio(c.precio)}</span>`);
const accionLabel = c => (Cart.has(c.id) ? `${ICON.check}Agregado` : ACCION[c.tipo]);
const listaY = arr => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}` : arr[0] || '');
const paraTexto = c => listaY(c.para.map(p => PARA[p]));

function coverHTML(c, i = 0, cls = 'cur-cover') {
  const v = i % 3;
  return `<span class="${cls} cov cov-${c.categoria} cov-v${v}" aria-hidden="true"><span class="cov-shape fig-${CATEGORIAS[c.categoria].fig}"></span><span class="cov-dot"></span><span class="cov-label">${esc(c.formato)}</span><span class="cov-para">Para ${esc(listaY(c.para.map(p => PARA[p].toLowerCase())))}</span></span>`;
}

function destHTML(c, i) {
  return `<article class="dest-card${i === 0 ? ' dest-card--prima' : ''}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="dest-media"><img src="images/${c.foto}.webp" srcset="images/${c.foto}-600.webp 600w, images/${c.foto}.webp 1000w" sizes="(max-width: 700px) 40vw, (max-width: 1100px) 34vw, 42vw" width="1000" height="1000" alt="${esc(c.alt)}">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</div>
    <div class="dest-body">
      <p class="dest-cat">${figHTML(c.categoria)}${esc(CATEGORIAS[c.categoria].nombre)}</p>
      <h3 class="dest-title">${esc(c.titulo)}</h3>
      <p class="dest-desc">${esc(c.descripcionCorta)}</p>
      <p class="dest-meta">${ICON.reloj}<span>${esc(c.modalidad)} · ${esc(c.duracion)}</span></p>
      <ol class="dest-modulos">${(c.modulos || []).map(m => `<li>${esc(m.titulo)}</li>`).join('')}</ol>
      <div class="dest-foot"><span class="precio">${precioHTML(c)}</span><button class="btn btn-primary btn-sm" type="button" data-ver="${c.id}">Ver propuesta ${ICON.arrow}</button></div>
    </div>
  </article>`;
}

function renderDestacados() {
  const cont = document.getElementById('dest-grid');
  if (!cont) return;
  cont.innerHTML = CURSOS.filter(c => c.destacado).sort((a, b) => a.destacado - b.destacado).map(destHTML).join('');
}

function renderOfertas() {
  const cont = document.getElementById('ofertas');
  if (!cont) return;
  cont.innerHTML = OFERTAS_ONLINE.map(getCurso).filter(Boolean).map(c => `<li class="oferta" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <div class="of-info"><p class="of-tit">${esc(c.titulo)}</p><p class="of-det">${esc(c.duracion)} · ${esc(c.cuando)}</p></div>
      <p class="of-precio">${precioHTML(c)}</p>
      <div class="of-actions"><button class="btn btn-primary btn-sm${Cart.has(c.id) ? ' is-en' : ''}" type="button" data-inscribir="${c.id}">${accionLabel(c)}</button></div>
    </li>`).join('');
}

function curHTML(c, animar) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : '';
  return `<article class="cur-card"${anim} data-id="${c.id}">
    <button class="cur-media" type="button" data-ver="${c.id}" aria-label="Ver el detalle de ${esc(c.titulo)}">${coverHTML(c, CURSOS.indexOf(c))}</button>
    <div class="cur-body">
      <p class="cur-cat">${figHTML(c.categoria)}${esc(CATEGORIAS[c.categoria].nombre)}${c.badge ? `<span class="cur-badge">${esc(c.badge)}</span>` : ''}</p>
      <h3 class="cur-title">${esc(c.titulo)}</h3>
      <p class="cur-meta">${esc(c.modalidad)} · ${esc(c.duracion)}</p>
    </div>
    <div class="cur-foot"><span class="cur-precio">${precioHTML(c)}</span><div class="cur-actions"><button class="btn-link" type="button" data-ver="${c.id}">Detalle</button><button class="btn btn-primary btn-sm${Cart.has(c.id) ? ' is-en' : ''}" type="button" data-inscribir="${c.id}">${accionLabel(c)}</button></div></div>
  </article>`;
}

const PAGINA = window.matchMedia('(max-width: 640px)').matches ? 6 : 12;
const Catalogo = { q: '', cat: '', para: '', modo: '', precio: '', visibles: PAGINA, PAGE: PAGINA };

function filtrarCursos() {
  const q = norm(Catalogo.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  const [min, max] = Catalogo.precio ? Catalogo.precio.split('-').map(v => (v === '' ? Infinity : Number(v))) : [0, Infinity];
  return CURSOS.filter(c => {
    if (Catalogo.cat && c.categoria !== Catalogo.cat) return false;
    if (Catalogo.para && !c.para.includes(Catalogo.para)) return false;
    if (Catalogo.modo && !c.modos.includes(Catalogo.modo)) return false;
    const p = precioFinal(c);
    if (p < min || p > max) return false;
    if (!palabras.length) return true;
    const texto = norm([c.titulo, CATEGORIAS[c.categoria].nombre, c.nivel, c.modalidad, c.formato, paraTexto(c), DIRECTOR.nombre, c.descripcionCorta, c.tags].join(' '));
    return palabras.every(w => texto.includes(w));
  });
}

function renderCatalogo(desde = 0) {
  const list = document.getElementById('cat-list');
  if (!list) return;
  const res = filtrarCursos();
  const vis = res.slice(0, Catalogo.visibles);
  list.innerHTML = vis.map((c, k) => curHTML(c, k >= desde)).join('');
  const count = document.getElementById('cat-count');
  if (count) count.textContent = res.length === 1 ? '1 propuesta' : `${res.length} propuestas`;
  const hayFiltro = Catalogo.q || Catalogo.cat || Catalogo.para || Catalogo.modo || Catalogo.precio;
  const clear = document.getElementById('cat-clear');
  if (clear) clear.hidden = !hayFiltro;
  const vacio = document.getElementById('cat-empty');
  if (vacio) vacio.hidden = res.length > 0;
  const mas = document.getElementById('cat-more');
  if (mas) mas.hidden = res.length <= Catalogo.visibles;
  revelarNuevos(list);
}

function setCategoria(cat) {
  Catalogo.cat = cat;
  document.querySelectorAll('.cat-chips .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
}

function limpiarFiltros() {
  Catalogo.q = ''; Catalogo.para = ''; Catalogo.modo = ''; Catalogo.precio = '';
  setCategoria('');
  ['cat-q', 'f-para', 'f-modo', 'f-precio'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  Catalogo.visibles = Catalogo.PAGE;
  renderCatalogo();
}

function initCatalogo() {
  const list = document.getElementById('cat-list');
  if (!list) return;
  const q = document.getElementById('cat-q');
  const reset = () => { Catalogo.visibles = Catalogo.PAGE; renderCatalogo(); };
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { Catalogo.q = q.value; reset(); }, 160); });
  document.getElementById('cat-search')?.addEventListener('submit', e => { e.preventDefault(); Catalogo.q = q?.value || ''; reset(); });
  [['f-para', 'para'], ['f-modo', 'modo'], ['f-precio', 'precio']].forEach(([id, campo]) => {
    const sel = document.getElementById(id);
    sel?.addEventListener('change', () => { Catalogo[campo] = sel.value; reset(); });
  });
  document.querySelectorAll('.cat-chips .chip').forEach(b => b.addEventListener('click', () => { setCategoria(b.dataset.cat); reset(); }));
  document.getElementById('cat-clear')?.addEventListener('click', limpiarFiltros);
  document.querySelector('[data-clear]')?.addEventListener('click', limpiarFiltros);
  document.getElementById('cat-more')?.addEventListener('click', () => {
    const antes = Math.min(Catalogo.visibles, filtrarCursos().length);
    Catalogo.visibles += Catalogo.PAGE;
    renderCatalogo(antes);
  });
  const fbtn = document.getElementById('cat-filtros-btn');
  const fsel = document.getElementById('cat-selects');
  fbtn?.addEventListener('click', () => {
    const abierto = fsel.classList.toggle('open');
    fbtn.setAttribute('aria-expanded', String(abierto));
  });
  renderCatalogo();
}

function refrescarBotones() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const c = getCurso(b.dataset.inscribir);
    if (!c) return;
    b.classList.toggle('is-en', Cart.has(c.id));
    b.innerHTML = accionLabel(c);
  });
}

function initTrayecto() {
  const tabs = [...document.querySelectorAll('.trayecto [role="tab"]')];
  if (!tabs.length) return;
  document.querySelectorAll('.tray-list[data-etapa]').forEach(ul => {
    ul.innerHTML = (ETAPAS[ul.dataset.etapa] || []).map(getCurso).filter(Boolean).map(c => `<li><button class="tray-item" type="button" data-ver="${c.id}">${figHTML(c.categoria)}<span class="tray-tit">${esc(c.titulo)}</span><span class="tray-meta">${esc(c.formato)} · ${esc(c.duracion)}</span>${ICON.arrow}</button></li>`).join('');
  });
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        activar(tabs[n], true);
      }
    });
  });
}

function renderRecursos() {
  const list = document.getElementById('rec-list');
  if (!list) return;
  list.innerHTML = RECURSOS.map(r => {
    const anim = ' data-animate="subir" style="opacity:0;transform:translateY(28px)"';
    if (r.cat) {
      const desde = Math.min(...CURSOS.filter(c => c.categoria === r.cat).map(precioFinal));
      return `<li class="rec-item rec-item--pago"${anim}><span class="rec-ico">${ICON.kit}</span><div class="rec-info"><p class="rec-tit">${esc(r.titulo)}</p><p class="rec-meta">${esc(r.meta)}</p></div><span class="rec-precio"><span class="rec-desde">Desde</span> <span class="p-final">${formatearPrecio(desde)}</span></span><a class="btn btn-ghost btn-sm" href="#propuesta" data-cat-link="${r.cat}">Ver el material</a></li>`;
    }
    return `<li class="rec-item"${anim}><span class="rec-ico">${ICON.pdf}</span><div class="rec-info"><p class="rec-tit">${esc(r.titulo)}</p><p class="rec-meta">${esc(r.meta)}</p></div><span class="rec-precio rec-gratis">Gratis</span><button class="btn btn-ghost btn-sm" type="button" data-descargar="${r.id}">${ICON.descarga}Descargar</button></li>`;
  }).join('');
}

const Capa = {
  ultimoFoco: null,
  abrir(el, alAbrir) {
    this.ultimoFoco = document.activeElement;
    el.dataset.abierta = '1';
    el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (el.dataset.abierta !== '1') return;
      el.classList.add('open');
    }));
    alAbrir?.();
  },
  cerrar(el, devolverFoco = true) {
    if (el.hidden) return;
    el.dataset.abierta = '0';
    el.classList.remove('open');
    const fin = () => { if (el.dataset.abierta === '0') el.hidden = true; };
    if (reduceMotion) fin(); else setTimeout(fin, 380);
    if (!document.querySelector('.modal[data-abierta="1"], .drawer[data-abierta="1"], .visor[data-abierta="1"]')) document.body.classList.remove('no-scroll');
    if (devolverFoco && this.ultimoFoco && document.contains(this.ultimoFoco)) this.ultimoFoco.focus({ preventScroll: true });
  }
};

function atraparFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function modalHTML(c) {
  const media = c.foto
    ? `<figure class="md-media"><img src="images/${c.foto}.webp" width="1000" height="1000" alt="${esc(c.alt)}"></figure>`
    : `<figure class="md-media md-media--cov">${coverHTML(c, CURSOS.indexOf(c), 'md-cover')}</figure>`;
  const consulta = `Hola, quiero consultar por «${c.titulo}». ¿Me pasás más información?`;
  const datos = c.tipo === 'material'
    ? `<div><dt>Formato</dt><dd>${esc(c.formato)}</dd></div><div><dt>Contenido</dt><dd>${esc(c.duracion)}</dd></div><div><dt>Para</dt><dd>${esc(paraTexto(c))}</dd></div><div><dt>Entrega</dt><dd>${esc(c.cuando)}</dd></div>`
    : `<div><dt>Para</dt><dd>${esc(paraTexto(c))}</dd></div><div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div><div><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div><div><dt>Cuándo</dt><dd>${esc(c.cuando)}</dd></div>`;
  let secs;
  if (c.tipo === 'material') {
    secs = `<div class="md-sec md-two"><div><h3>Qué trae</h3><ul class="md-check">${c.contenido.map(x => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul></div><div><h3>Para usar en</h3><p>${esc(c.uso)}</p><h3>Cómo llega</h3><p>${c.modos.includes('pdf') ? 'Te llega el enlace de descarga apenas se confirma el pago.' : 'Coordinamos la entrega o el envío por WhatsApp después de la compra.'}</p></div></div>
      <p class="md-nota">Contenido y valor de ejemplo: se confirman con el material real.</p>`;
  } else {
    const programa = c.modulos
      ? `<div class="md-sec"><h3>Programa</h3><div class="md-mods">${c.modulos.map((m, i) => `<details class="md-mod"${i === 0 ? ' open' : ''}><summary><span class="md-mod-n">${String(i + 1).padStart(2, '0')}</span><span class="md-mod-t">${esc(m.titulo)}</span><span class="md-mod-d">${m.clases.length} temas</span>${ICON.plus}</summary><ul class="md-clases">${m.clases.map(cl => `<li>${ICON[cl.tipo] || ICON.vivo}<span>${esc(cl.titulo)} <span class="md-tipo">${TIPOS[cl.tipo] || ''}</span></span><span class="md-dur">${esc(cl.duracion)}</span></li>`).join('')}</ul></details>`).join('')}</div></div>`
      : `<div class="md-sec"><h3>Cómo es</h3><ol class="md-pasos">${c.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol></div>`;
    secs = `<div class="md-sec"><h3>Qué vas a poder hacer</h3><ul class="md-check">${c.resultados.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      ${programa}
      <div class="md-sec md-two"><div><h3>Para quién es</h3><p>${esc(c.requisitos)}</p></div><div><h3>Incluye</h3><ul class="md-check">${c.incluye.map(x => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul></div></div>
      <div class="md-doc"><span class="monograma monograma--sm" aria-hidden="true"><span>RS</span></span><div><p class="md-doc-n">${esc(DIRECTOR.nombre)}</p><p>${esc(DIRECTOR.rol)}</p></div></div>
      <p class="md-nota">Programa, fechas y valor de ejemplo: se confirman con cada edición.</p>`;
  }
  return `<div class="md-grid">
      ${media}
      <div class="md-main">
        <p class="md-cat">${figHTML(c.categoria)}${esc(CATEGORIAS[c.categoria].nombre)}${c.badge ? ` · ${esc(c.badge)}` : ''}</p>
        <h2 class="md-title">${esc(c.titulo)}</h2>
        <p class="md-lead">${esc(c.descripcionCorta)}</p>
        <dl class="md-datos">${datos}</dl>
        <div class="md-buy"><span class="md-precio">${precioHTML(c)}</span><button class="btn btn-primary${Cart.has(c.id) ? ' is-en' : ''}" type="button" data-md-inscribir="${c.id}">${Cart.has(c.id) ? `${ICON.check}Ver mi carrito` : ACCION[c.tipo]}</button><a class="btn btn-ghost" href="${waLink(consulta)}" target="_blank" rel="noopener">${ICON.wsp}Consultar</a></div>
      </div>
    </div>
    <div class="md-secs">${secs}</div>`;
}

let modalCurso = null;
function abrirModal(id) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  if (!c || !modal) return;
  modalCurso = c;
  const body = document.getElementById('modal-body');
  body.innerHTML = modalHTML(c);
  body.scrollTop = 0;
  const panel = modal.querySelector('.modal-panel');
  Capa.abrir(modal, () => panel.focus({ preventScroll: true }));
}
function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (modal) Capa.cerrar(modal, devolverFoco);
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarModal(); }
    atraparFoco(e, modal.querySelector('.modal-panel'));
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-modal-close]')) { cerrarModal(); return; }
    const ins = e.target.closest('[data-md-inscribir]');
    if (ins && modalCurso) {
      const nuevo = !Cart.has(modalCurso.id);
      Cart.add(modalCurso);
      cerrarModal(false);
      setTimeout(() => abrirDrawer(), reduceMotion ? 0 : 200);
      if (nuevo) showToast(`Sumaste «${modalCurso.titulo}» al carrito.`);
    }
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirModal(id);
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = `<div class="dr-empty"><span class="dr-figs" aria-hidden="true"><span class="fig fig-tri"></span><span class="fig fig-cir"></span><span class="fig fig-cua"></span><span class="fig fig-hex"></span></span><p>Todavía no elegiste ningún taller, curso o material.</p><a class="btn btn-ghost" href="#propuesta" data-drawer-close>Ver la propuesta</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = `<ul>${items.map(c => `<li class="dr-item">${c.foto ? `<img src="images/${c.foto}-600.webp" width="600" height="600" alt="">` : `<span class="dr-cov">${coverHTML(c, CURSOS.indexOf(c), 'dr-cover')}</span>`}<div class="dr-info"><p class="dr-tit">${esc(c.titulo)}</p><p class="dr-meta">${esc(c.formato)} · ${esc(c.duracion)}</p><button class="btn-link dr-quitar" type="button" data-quitar="${c.id}">Quitar</button></div><span class="dr-precio">${formatearPrecio(precioFinal(c))}</span></li>`).join('')}</ul>`;
  if (foot) foot.hidden = false;
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const ahorro = items.reduce((s, c) => s + (c.precio - precioFinal(c)), 0);
  const nota = document.getElementById('drawer-nota');
  if (nota) {
    const partes = [];
    if (ahorro > 0) partes.push(`Ahorrás ${formatearPrecio(ahorro)}.`);
    if (items.some(c => c.modos.includes('fisico'))) partes.push('El material físico se entrega a coordinar por WhatsApp.');
    nota.textContent = partes.join(' ');
    nota.hidden = !partes.length;
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer) return;
  renderDrawer();
  bd.hidden = false;
  Capa.abrir(drawer, () => drawer.querySelector('[data-drawer-close]')?.focus({ preventScroll: true }));
  requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
}
function cerrarDrawer(devolverFoco = true) {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer || drawer.hidden) return;
  bd.classList.remove('open');
  setTimeout(() => { if (drawer.dataset.abierta === '0') bd.hidden = true; }, reduceMotion ? 0 : 380);
  Capa.cerrar(drawer, devolverFoco);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('drawer-bd')?.addEventListener('click', () => cerrarDrawer());
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarDrawer(); }
    atraparFoco(e, drawer);
  });
  drawer.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); renderDrawer(); drawer.querySelector('[data-drawer-close]')?.focus(); return; }
    if (e.target.closest('[data-drawer-close]')) {
      const link = e.target.closest('a[href^="#"]');
      cerrarDrawer(!link);
    }
  });
  document.getElementById('drawer-fin')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
}

const Visor = { fotos: [], i: 0 };
function initGaleria() {
  const visor = document.getElementById('visor');
  const btns = [...document.querySelectorAll('[data-galeria]')];
  if (!visor || !btns.length) return;
  Visor.fotos = btns.map(b => ({ src: b.dataset.full, alt: b.querySelector('img')?.alt || '', cap: b.closest('li')?.querySelector('.g-cap')?.textContent || '' }));
  const img = document.getElementById('visor-img');
  const cap = document.getElementById('visor-cap');
  const count = document.getElementById('visor-count');
  const mostrar = i => {
    Visor.i = (i + Visor.fotos.length) % Visor.fotos.length;
    const f = Visor.fotos[Visor.i];
    img.src = f.src; img.alt = f.alt; cap.textContent = f.cap;
    count.textContent = `${Visor.i + 1} / ${Visor.fotos.length}`;
  };
  const cerrar = () => Capa.cerrar(visor);
  btns.forEach(b => b.addEventListener('click', () => {
    mostrar(Number(b.dataset.galeria));
    Capa.abrir(visor, () => visor.querySelector('.visor-close')?.focus({ preventScroll: true }));
  }));
  visor.querySelector('.visor-prev')?.addEventListener('click', () => mostrar(Visor.i - 1));
  visor.querySelector('.visor-next')?.addEventListener('click', () => mostrar(Visor.i + 1));
  visor.addEventListener('click', e => { if (e.target.closest('[data-visor-close]')) cerrar(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrar(); }
    if (e.key === 'ArrowRight') mostrar(Visor.i + 1);
    if (e.key === 'ArrowLeft') mostrar(Visor.i - 1);
    atraparFoco(e, visor);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
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
    if (ver && !ver.closest('.modal')) { abrirModal(ver.dataset.ver); return; }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      const nuevo = !Cart.has(c.id);
      Cart.add(c);
      abrirDrawer();
      if (nuevo) showToast(`Sumaste «${c.titulo}» al carrito.`);
      return;
    }
    const catLink = e.target.closest('[data-cat-link]');
    if (catLink) {
      limpiarFiltros();
      setCategoria(catLink.dataset.catLink);
      renderCatalogo();
      return;
    }
    const des = e.target.closest('[data-descargar]');
    if (des) {
      const r = RECURSOS.find(x => x.id === des.dataset.descargar);
      showToast(`La descarga de «${r?.titulo || 'este material'}» se activa al pasar la web a producción.`);
      return;
    }
    if (e.target.closest('[data-biodata]')) {
      showToast('La BioData completa en PDF se suma con el CV del director al pasar la web a producción.');
      return;
    }
    if (e.target.closest('[data-cart-open]')) abrirDrawer();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarBotones(); if (!document.getElementById('drawer')?.hidden) renderDrawer(); });
}

function initDatosEstructurados() {
  const modo = { 'Online en vivo': 'online', 'Grabada': 'online', 'Grabado + en vivo': 'blended' };
  const data = {
    '@context': 'https://schema.org',
    '@graph': CURSOS.filter(c => c.tipo !== 'material').map(c => ({
      '@type': 'Course',
      name: c.titulo,
      description: c.descripcionCorta,
      educationalLevel: c.nivel,
      inLanguage: 'es-AR',
      provider: { '@type': 'EducationalOrganization', name: 'You Can Education', sameAs: IG },
      offers: { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', category: 'Paid' },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: modo[c.modalidad] || 'online', instructor: { '@type': 'Person', name: DIRECTOR.nombre } }
    }))
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

renderDestacados();
renderOfertas();
initCatalogo();
initTrayecto();
renderRecursos();
initReveals();
initNav();
initModal();
initDrawer();
initGaleria();
initAcciones();
initFloats();
updateCartBadge();
initModelBarScroll();
initDatosEstructurados();
abrirDesdeURL();
