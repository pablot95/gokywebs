const PROYECTO = 'iglesiacentroderestauracionemmanuel';
const WSP = '5491128663912';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const AREAS = [
  { id: 'seminarios', nombre: 'Seminarios bíblicos', corto: 'Seminario' },
  { id: 'acompanamiento', nombre: 'Acompañamiento terapéutico', corto: 'Acompañamiento' },
  { id: 'psicologia', nombre: 'Psicología Social', corto: 'Carrera' },
  { id: 'escuelita', nombre: 'Escuelita bíblica', corto: 'Escuelita' },
];
const SUBCATEGORIAS = [
  { id: 'biblias', nombre: 'Biblias' },
  { id: 'papeleria', nombre: 'Papelería de estudio' },
  { id: 'escuelita', nombre: 'Escuelita bíblica' },
  { id: 'hogar', nombre: 'Hogar y regalos' },
];
const NIVELES = ['Inicial', 'Intermedio', 'Avanzado', 'Carrera'];
const MODALIDADES = ['A tu ritmo', 'Con encuentros en vivo'];
const RANGOS = [
  { id: 'hasta-20', nombre: 'Hasta $20.000', min: 0, max: 20000 },
  { id: '20-a-50', nombre: '$20.000 a $50.000', min: 20001, max: 50000 },
  { id: 'mas-de-50', nombre: 'Más de $50.000', min: 50001, max: Infinity },
];

const DOCENTES = [
  { id: 'd1', nombre: 'Equipo pastoral', rol: 'Seminarios bíblicos', bio: 'Pastores y líderes de la iglesia. Dan las clases de cada seminario y responden las consultas de cada módulo dentro del aula.' },
  { id: 'd2', nombre: 'Coordinación de Acompañamiento Terapéutico', rol: 'Acompañamiento terapéutico', bio: 'Arma el cronograma de cada nivel, corrige los trabajos y coordina el encuentro en vivo de cada semana.' },
  { id: 'd3', nombre: 'Coordinación de Psicología Social', rol: 'Carrera de Psicología Social', bio: 'Coordina el grupo operativo semanal y acompaña las lecturas de cada módulo del primer año.' },
  { id: 'd4', nombre: 'Ministerio de niños', rol: 'Escuelita bíblica', bio: 'Las maestras de la escuelita comparten cómo preparan la clase, la historia y la actividad para cada grupo de chicos.' },
];

const CURSOS_BASE = [
  {
    id: 'c1', slug: 'fundamentos-de-la-fe', titulo: 'Fundamentos de la fe', categoria: 'seminarios', nivel: 'Inicial', modalidad: 'A tu ritmo',
    precio: 24000, descuento: 0, duracion: '6 semanas', docenteId: 'd1', destacado: 1, nuevo: false,
    descripcionCorta: 'El seminario de entrada: quién es Dios, qué hizo Jesús y cómo se vive la fe en comunidad.',
    descripcionCompleta: 'Seis semanas para ordenar lo esencial de la fe cristiana a partir de la Biblia. Cada módulo tiene clases cortas en video, una lectura guiada y preguntas para pensar solo o en grupo.',
    resultados: ['Leer un pasaje con su contexto', 'Explicar con tus palabras las bases de la fe', 'Armar un plan de lectura que puedas sostener'],
    requisitos: ['No hace falta conocimiento previo', 'Una Biblia, en papel o en el celular'],
    incluye: ['Acceso al aula con tu usuario', 'Guías de lectura descargables', 'Consultas al equipo docente dentro del aula'],
    m: [['La Biblia, una historia', ['Cómo está organizada la Biblia', 'Leer con contexto', 'Un plan de lectura posible']], ['Dios, Jesús y el Espíritu', ['Quién es Dios', 'La obra de Jesús', 'El Espíritu Santo en la vida diaria']], ['La fe en comunidad', ['La iglesia como familia', 'Oración y servicio', 'Dar el siguiente paso']]],
    faq: [['¿Lo puedo hacer si nunca leí la Biblia?', 'Sí. Está pensado para empezar desde cero.']],
  },
  {
    id: 'c2', slug: 'panorama-del-antiguo-testamento', titulo: 'Panorama del Antiguo Testamento', categoria: 'seminarios', nivel: 'Intermedio', modalidad: 'A tu ritmo',
    precio: 36000, descuento: 0, duracion: '10 semanas', docenteId: 'd1', destacado: 0, nuevo: false,
    descripcionCorta: 'De Génesis a Malaquías: el hilo que une la ley, la historia, la poesía y los profetas.',
    descripcionCompleta: 'Un recorrido por los libros del Antiguo Testamento para entender cómo se conecta cada parte con la historia completa de la Biblia. Incluye mapas, líneas de tiempo y lecturas por semana.',
    resultados: ['Ubicar cada libro en su época y en su género', 'Seguir el hilo de las promesas de Dios', 'Preparar un estudio breve sobre un libro'],
    requisitos: ['Haber hecho Fundamentos de la fe o tener hábito de lectura bíblica'],
    incluye: ['Acceso al aula con tu usuario', 'Líneas de tiempo y mapas descargables', 'Consultas al equipo docente dentro del aula'],
    m: [['Génesis y los orígenes', ['La creación y la caída', 'Abraham y la promesa', 'José y la familia de Israel']], ['La ley y la historia de Israel', ['Éxodo y el pacto', 'La tierra prometida', 'Reyes y reinos']], ['Poesía y profetas', ['Salmos y Proverbios', 'Los profetas mayores', 'Los profetas menores']]],
    faq: [],
  },
  {
    id: 'c3', slug: 'evangelios-y-hechos', titulo: 'Evangelios y Hechos de los Apóstoles', categoria: 'seminarios', nivel: 'Intermedio', modalidad: 'Con encuentros en vivo',
    precio: 32000, descuento: 15, duracion: '8 semanas', docenteId: 'd1', destacado: 0, nuevo: true,
    descripcionCorta: 'La vida de Jesús en los cuatro Evangelios y el nacimiento de la iglesia en Hechos.',
    descripcionCompleta: 'Leemos los Evangelios en paralelo para ver qué destaca cada autor y seguimos con Hechos para entender cómo creció la iglesia. Una vez por semana hay un encuentro en vivo para compartir lo leído.',
    resultados: ['Comparar cómo cuenta cada Evangelio la vida de Jesús', 'Reconocer cómo se formaron las primeras comunidades', 'Llevar las enseñanzas de Jesús a situaciones concretas'],
    requisitos: ['Haber hecho Fundamentos de la fe o tener hábito de lectura bíblica'],
    incluye: ['Acceso al aula con tu usuario', 'Un encuentro en vivo por semana', 'Guías de lectura descargables'],
    m: [['Cuatro miradas sobre Jesús', ['Mateo y Marcos', 'Lucas', 'Juan']], ['Enseñanzas y milagros', ['El Sermón del monte', 'Las parábolas', 'Los milagros y su sentido']], ['La iglesia en Hechos', ['Pentecostés', 'Pedro y la iglesia de Jerusalén', 'Los viajes de Pablo']]],
    faq: [['¿Qué pasa si no puedo ir al encuentro en vivo?', 'Queda grabado en el aula y lo mirás cuando puedas.']],
  },
  {
    id: 'c4', slug: 'oracion-e-intercesion', titulo: 'Oración e intercesión', categoria: 'seminarios', nivel: 'Inicial', modalidad: 'A tu ritmo',
    precio: 18000, descuento: 0, duracion: '4 semanas', docenteId: 'd1', destacado: 0, nuevo: false,
    descripcionCorta: 'Cuatro semanas para aprender a orar con la Biblia y a sostener la oración por otros.',
    descripcionCompleta: 'Un seminario corto y práctico: qué enseña la Biblia sobre la oración, cómo armar un tiempo diario y cómo organizar la intercesión en un grupo o en la iglesia.',
    resultados: ['Sostener un tiempo de oración diario', 'Orar con los Salmos y con el Padre Nuestro', 'Organizar un grupo de intercesión'],
    requisitos: ['No hace falta conocimiento previo'],
    incluye: ['Acceso al aula con tu usuario', 'Cuaderno de oración descargable', 'Consultas al equipo docente dentro del aula'],
    m: [['Qué es orar', ['La oración en la Biblia', 'El Padre Nuestro', 'Orar con los Salmos']], ['Un tiempo diario', ['Armar el hábito', 'Oración y lectura', 'Cuando cuesta orar']], ['Orar por otros', ['La intercesión', 'Orar en grupo', 'Un plan de intercesión para la iglesia']]],
    faq: [],
  },
  {
    id: 'c5', slug: 'liderazgo-y-servicio', titulo: 'Liderazgo y servicio en la iglesia', categoria: 'seminarios', nivel: 'Avanzado', modalidad: 'Con encuentros en vivo',
    precio: 32000, descuento: 0, duracion: '8 semanas', docenteId: 'd1', destacado: 0, nuevo: false,
    descripcionCorta: 'Para quienes ya sirven: cómo liderar un grupo, cuidar a las personas y trabajar en equipo.',
    descripcionCompleta: 'Un seminario para líderes de grupo, maestros y servidores. Trabaja el llamado al servicio, el cuidado de las personas y la organización de equipos, con un encuentro en vivo por semana.',
    resultados: ['Coordinar un grupo pequeño con un plan claro', 'Acompañar a las personas del grupo con criterio', 'Organizar un equipo de servicio y repartir tareas'],
    requisitos: ['Estar sirviendo en algún ministerio de la iglesia', 'Haber hecho Fundamentos de la fe'],
    incluye: ['Acceso al aula con tu usuario', 'Un encuentro en vivo por semana', 'Material para usar con tu grupo'],
    m: [['El llamado a servir', ['Liderar como Jesús', 'Carácter y ejemplo', 'Cuidarse para cuidar']], ['Cuidar a las personas', ['Escuchar y acompañar', 'Cuándo derivar', 'Visitas y seguimiento']], ['Trabajar en equipo', ['Armar el equipo', 'Planificar el año', 'Resolver conflictos']]],
    faq: [],
  },
  {
    id: 'c6', slug: 'acompanamiento-terapeutico-nivel-1', titulo: 'Acompañamiento Terapéutico · Nivel I', categoria: 'acompanamiento', nivel: 'Inicial', modalidad: 'Con encuentros en vivo',
    precio: 96000, descuento: 0, duracion: '16 semanas', docenteId: 'd2', destacado: 2, nuevo: false,
    descripcionCorta: 'El rol del acompañante: el vínculo, los límites y el trabajo con la familia y el equipo tratante.',
    descripcionCompleta: 'Primer nivel de la formación. Estudia qué hace un acompañante terapéutico, cómo se construye el vínculo con la persona acompañada y cómo se trabaja junto a la familia y al equipo tratante. Hay un encuentro en vivo por semana para trabajar casos.',
    resultados: ['Entender el rol y los límites del acompañante', 'Registrar y comunicar lo que pasa en cada encuentro', 'Trabajar casos en grupo con la coordinación'],
    requisitos: ['Ser mayor de 18 años'],
    incluye: ['Acceso al aula con tu usuario', 'Un encuentro en vivo por semana', 'Bibliografía por módulo'],
    m: [['El rol del acompañante', ['Qué es el acompañamiento terapéutico', 'El encuadre y los límites', 'Ética del acompañante']], ['El vínculo', ['Construir confianza', 'Comunicación y escucha', 'El registro de cada encuentro']], ['Familia y equipo', ['Trabajar con la familia', 'El equipo tratante', 'Análisis de casos']]],
    faq: [['¿Cuándo puedo hacer el Nivel II?', 'Cuando termines y apruebes el Nivel I.']],
  },
  {
    id: 'c7', slug: 'acompanamiento-terapeutico-nivel-2', titulo: 'Acompañamiento Terapéutico · Nivel II', categoria: 'acompanamiento', nivel: 'Avanzado', modalidad: 'Con encuentros en vivo',
    precio: 96000, descuento: 0, duracion: '16 semanas', docenteId: 'd2', destacado: 0, nuevo: false,
    descripcionCorta: 'Segundo nivel: crisis, consumo problemático y discapacidad, con análisis de casos.',
    descripcionCompleta: 'Profundiza en las situaciones más frecuentes del acompañamiento: crisis, consumo problemático, discapacidad y salud mental. El trabajo en vivo se centra en analizar casos junto a la coordinación.',
    resultados: ['Reconocer señales de crisis y saber cómo actuar', 'Adaptar el acompañamiento a cada situación', 'Presentar un caso con registro y propuesta de trabajo'],
    requisitos: ['Haber aprobado el Nivel I'],
    incluye: ['Acceso al aula con tu usuario', 'Un encuentro en vivo por semana', 'Bibliografía por módulo'],
    m: [['Situaciones de crisis', ['Señales de alerta', 'Intervenir en la crisis', 'Después de la crisis']], ['Contextos de acompañamiento', ['Consumo problemático', 'Discapacidad', 'Salud mental']], ['Trabajo con casos', ['Armar un plan de trabajo', 'Supervisión en grupo', 'Presentación de un caso']]],
    faq: [],
  },
  {
    id: 'c8', slug: 'psicologia-social-primer-ano', titulo: 'Psicología Social · Primer año', categoria: 'psicologia', nivel: 'Carrera', modalidad: 'Con encuentros en vivo',
    precio: 168000, descuento: 0, duracion: '1 año', docenteId: 'd3', destacado: 3, nuevo: false,
    descripcionCorta: 'El primer año de la carrera: sujeto, vínculo, grupo operativo y comunicación.',
    descripcionCompleta: 'La carrera de Psicología Social se cursa por años. En el primero se estudian las bases: el sujeto y sus vínculos, el grupo como lugar de aprendizaje y la comunicación. Cada semana hay un grupo operativo en vivo.',
    resultados: ['Leer lo que pasa en un grupo con herramientas de la psicología social', 'Participar en un grupo operativo y sostener la tarea', 'Relacionar la teoría con situaciones de tu comunidad'],
    requisitos: ['Ser mayor de 18 años'],
    incluye: ['Acceso al aula con tu usuario', 'Grupo operativo en vivo cada semana', 'Lecturas por módulo'],
    m: [['Sujeto y vínculo', ['Necesidad y vínculo', 'El sujeto en su contexto', 'La vida cotidiana']], ['El grupo operativo', ['Qué es un grupo', 'La tarea y los roles', 'Coordinar un grupo']], ['Comunicación y aprendizaje', ['Comunicar en grupo', 'Obstáculos del aprendizaje', 'Instituciones y comunidad']]],
    faq: [['¿El primer año se puede cursar desde otra ciudad?', 'Sí. Las clases y el grupo operativo son online.']],
  },
  {
    id: 'c9', slug: 'maestra-de-escuelita-biblica', titulo: 'Maestra de Escuelita Bíblica', categoria: 'escuelita', nivel: 'Inicial', modalidad: 'A tu ritmo',
    precio: 28000, descuento: 0, duracion: '8 semanas', docenteId: 'd4', destacado: 4, nuevo: true,
    descripcionCorta: 'Cómo preparar la clase, contar la historia bíblica y armar la actividad con los chicos.',
    descripcionCompleta: 'Un curso práctico para quienes dan la escuelita o quieren empezar. Cada módulo termina con una clase lista para usar: la historia, la actividad y la manualidad.',
    resultados: ['Planificar una clase completa según la edad', 'Contar una historia bíblica que los chicos sigan', 'Preparar manualidades simples con materiales accesibles'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['Acceso al aula con tu usuario', 'Clases listas para descargar', 'Ideas de manualidades por módulo'],
    m: [['Preparar la clase', ['Conocer al grupo por edades', 'Elegir la historia', 'Armar el plan de la clase']], ['Contar la historia', ['Recursos para narrar', 'Preguntas que hacen pensar', 'Memorizar un versículo']], ['Actividades y cuidado', ['Manualidades simples', 'Juegos con sentido', 'Cuidar al grupo y a las familias']]],
    faq: [['¿Sirve para chicos de todas las edades?', 'Sí. El primer módulo muestra cómo adaptar la clase a cada edad.']],
  },
];

const TIPOS_CLASE = ['video', 'lectura', 'video', 'audio', 'video', 'pdf'];
const CURSOS = CURSOS_BASE.map(c => {
  let n = 0;
  const modulos = c.m.map(([titulo, clases], mi) => ({
    id: `${c.id}-m${mi + 1}`,
    titulo,
    clases: clases.map((t, ci) => {
      n++;
      return { id: `${c.id}-m${mi + 1}-c${ci + 1}`, titulo: t, duracion: 14 + ((n * 7 + mi * 5) % 26), tipo: TIPOS_CLASE[(mi + ci) % TIPOS_CLASE.length], preview: mi === 0 && ci === 0 };
    }),
  }));
  const { m: _m, ...resto } = c;
  return { ...resto, type: 'course', modulos, cantidadClases: n, tags: [c.nivel, c.modalidad, c.duracion] };
});

const PRODUCTOS = [
  {
    id: 'p1', type: 'product', slug: 'biblia-de-estudio-reina-valera-1960', nombre: 'Biblia de estudio Reina-Valera 1960', categoria: 'biblias',
    precio: 42500, descuento: 0, stock: 8, varLabel: 'Tamaño de letra',
    variantes: [{ key: 'letra-normal', label: 'Letra normal' }, { key: 'letra-grande', label: 'Letra grande' }],
    descripcionCorta: 'Tapa negra y cinta señaladora para marcar por dónde vas.',
    descripcionCompleta: 'La versión Reina-Valera 1960 en edición de estudio, con tapa negra y cinta señaladora para marcar por dónde vas. Elegí el tamaño de letra que te resulte más cómodo.',
    imagen: 'images/biblia-estudio-negra.webp', w: 1200, h: 1800, pos: '50% 50%', alt: 'Biblia de tapa negra con cinta señaladora sobre fondo oscuro', tags: ['biblia', 'reina valera', 'estudio'],
  },
  {
    id: 'p2', type: 'product', slug: 'cuaderno-de-estudio-tapa-dura', nombre: 'Cuaderno de estudio tapa dura', categoria: 'papeleria',
    precio: 12900, descuento: 0, stock: 15, varLabel: 'Hojas',
    variantes: [{ key: 'rayadas', label: 'Rayadas' }, { key: 'lisas', label: 'Lisas' }],
    descripcionCorta: 'Tapa dura con elástico y cinta señaladora, para tus apuntes de cada clase.',
    descripcionCompleta: 'Para tomar apuntes en los seminarios y anotar lo que vas leyendo. Tapa dura, cierre con elástico y cinta señaladora.',
    imagen: 'images/cuaderno-tapa-dura.webp', w: 1600, h: 1067, pos: '50% 50%', alt: 'Cuaderno de tapa dura color terracota con elástico negro y cinta señaladora', tags: ['cuaderno', 'apuntes', 'anotador'],
  },
  {
    id: 'p3', type: 'product', slug: 'set-de-resaltadores-y-notas', nombre: 'Set de resaltadores y notas', categoria: 'papeleria',
    precio: 9800, descuento: 10, stock: 20, varLabel: '', variantes: [],
    descripcionCorta: 'Resaltadores, lápices, notas adhesivas y señaladores en tonos pastel.',
    descripcionCompleta: 'Lo necesario para subrayar, marcar y ordenar tus lecturas: resaltadores, lápices de colores, notas adhesivas y señaladores, en tonos pastel.',
    imagen: 'images/set-resaltadores.webp', w: 1600, h: 1067, pos: '22% 50%', alt: 'Resaltadores y lápices en tonos pastel con notas adhesivas y clips', tags: ['resaltadores', 'subrayar', 'lapices', 'señaladores'],
  },
  {
    id: 'p4', type: 'product', slug: 'kit-de-materiales-para-la-escuelita', nombre: 'Kit de materiales para la escuelita', categoria: 'escuelita',
    precio: 18600, descuento: 0, stock: 6, varLabel: '', variantes: [],
    descripcionCorta: 'Fibras, figuras de goma eva con brillo y cintas decoradas para las manualidades.',
    descripcionCompleta: 'Los materiales para las manualidades del curso de Maestra de Escuelita Bíblica: fibras de colores, figuras de goma eva con brillo, cartulina y cintas decoradas.',
    imagen: 'images/kit-escuelita.webp', w: 1600, h: 1067, pos: '42% 55%', alt: 'Fibras de colores, figuras de goma eva con brillo y cintas decoradas sobre una mesa', tags: ['kit', 'manualidades', 'escuelita', 'niños'],
  },
  {
    id: 'p5', type: 'product', slug: 'cruz-de-madera-con-base', nombre: 'Cruz de madera con base', categoria: 'hogar',
    precio: 21000, descuento: 0, stock: 0, varLabel: '', variantes: [],
    descripcionCorta: 'Cruz de madera con base de piedra, para la entrada o el living.',
    descripcionCompleta: 'Una cruz de madera con base de piedra, sobria, para tener presente en casa.',
    imagen: 'images/cruz-madera.webp', w: 1600, h: 1066, pos: '50% 55%', alt: 'Cruz de madera con base de piedra apoyada contra una pared blanca', tags: ['cruz', 'decoracion', 'regalo'],
  },
  {
    id: 'p6', type: 'product', slug: 'taza-de-ceramica', nombre: 'Taza de cerámica', categoria: 'hogar',
    precio: 8500, descuento: 0, stock: 24, varLabel: 'Color',
    variantes: [{ key: 'negra', label: 'Negra' }, { key: 'blanca', label: 'Blanca' }],
    descripcionCorta: 'Taza lisa de cerámica, en negro o en blanco.',
    descripcionCompleta: 'Para el mate cocido de la mañana o el café mientras estudiás. Taza lisa de cerámica, en negro o en blanco.',
    imagen: 'images/taza-ceramica.webp', w: 1200, h: 1800, pos: '50% 60%', alt: 'Dos tazas de cerámica, una blanca y una negra, sobre una bandeja de mármol', tags: ['taza', 'regalo', 'cafe'],
  },
];

const BUNDLES = [
  { id: 'b1', titulo: 'Maestra de Escuelita + kit de materiales', texto: 'El curso para preparar cada clase y el kit para las manualidades de los chicos.', courseIds: ['c9'], productLines: [{ id: 'p4', variantKey: null, qty: 1 }], precioBundle: 42000 },
  { id: 'b2', titulo: 'Fundamentos de la fe + Biblia de estudio', texto: 'El seminario de entrada con la Biblia de estudio y el set para subrayar tus lecturas.', courseIds: ['c1'], productLines: [{ id: 'p1', variantKey: 'letra-normal', qty: 1 }, { id: 'p3', variantKey: null, qty: 1 }], precioBundle: 69900 },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = item => item.descuento > 0 ? Math.round(item.precio * (1 - item.descuento / 100)) : item.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getCurso = id => CURSOS.find(c => c.id === id);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getDocente = id => DOCENTES.find(d => d.id === id);
const getArea = id => AREAS.find(a => a.id === id);
const getSubcat = id => SUBCATEGORIAS.find(s => s.id === id);
const getVariante = (p, key) => p?.variantes?.find(v => v.key === key);
const minutosTotales = c => c.modulos.reduce((s, m) => s + m.clases.reduce((t, cl) => t + cl.duracion, 0), 0);
const numeroEnArea = c => CURSOS.filter(x => x.categoria === c.categoria).indexOf(c) + 1;
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const Cart = {
  KEY: `${PROYECTO}_cart`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  keyCurso: id => `course:${id}`,
  keyProducto: (id, variantKey) => `product:${id}:${variantKey || 'unica'}`,
  has(key) { return this.get().some(i => i.key === key); },
  addCurso(id, bundle = null) {
    if (!getCurso(id)) return false;
    const items = this.get();
    const key = this.keyCurso(id);
    const existente = items.find(i => i.key === key);
    if (existente) {
      if (bundle && existente.bundle !== bundle) { existente.bundle = bundle; this.save(items); }
      return false;
    }
    items.push({ key, type: 'course', id, variantKey: null, qty: 1, bundle });
    this.save(items);
    return true;
  },
  stockLibre(id, exceptKey) {
    const p = getProducto(id);
    if (!p) return 0;
    const usado = this.get().filter(i => i.type === 'product' && i.id === id && i.key !== exceptKey).reduce((s, i) => s + i.qty, 0);
    return Math.max(0, p.stock - usado);
  },
  addProducto(id, variantKey = null, qty = 1, bundle = null) {
    const p = getProducto(id);
    if (!p || p.stock <= 0) return 0;
    if (!p.variantes.length) variantKey = null;
    else if (!getVariante(p, variantKey)) variantKey = p.variantes[0].key;
    const items = this.get();
    const key = this.keyProducto(id, variantKey);
    const existente = items.find(i => i.key === key);
    const actual = existente ? existente.qty : 0;
    const nueva = Math.min(actual + Math.max(1, qty), this.stockLibre(id, key));
    if (nueva <= actual) return 0;
    if (existente) { existente.qty = nueva; if (bundle) existente.bundle = bundle; }
    else items.push({ key, type: 'product', id, variantKey, qty: nueva, bundle });
    this.save(items);
    return nueva - actual;
  },
  setQty(key, qty) {
    const items = this.get();
    const it = items.find(i => i.key === key);
    if (!it || it.type !== 'product') return;
    it.qty = Math.max(1, Math.min(qty, this.stockLibre(it.id, key)));
    this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => i.key !== key)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  sanear() {
    const items = this.get();
    let cambio = false;
    const validos = items.filter(i => {
      if (i.type === 'course') { if (getCurso(i.id)) return true; cambio = true; return false; }
      const p = getProducto(i.id);
      if (!p || p.stock <= 0 || (p.variantes.length && !getVariante(p, i.variantKey))) { cambio = true; return false; }
      return true;
    });
    validos.forEach(i => {
      if (i.type !== 'product') return;
      const libre = getProducto(i.id).stock - validos.filter(o => o !== i && o.type === 'product' && o.id === i.id).reduce((s, o) => s + o.qty, 0);
      if (i.qty > libre) { i.qty = Math.max(1, libre); cambio = true; }
    });
    if (cambio) this.save(validos);
  },
};

function lineaInfo(it) {
  if (it.type === 'course') {
    const c = getCurso(it.id);
    return c ? { item: c, titulo: c.titulo, variante: '', unit: precioFinal(c), orig: c.precio, qty: 1 } : null;
  }
  const p = getProducto(it.id);
  if (!p) return null;
  return { item: p, titulo: p.nombre, variante: getVariante(p, it.variantKey)?.label || '', unit: precioFinal(p), orig: p.precio, qty: it.qty };
}
const sumaBundle = b => b.courseIds.reduce((s, id) => s + (getCurso(id) ? precioFinal(getCurso(id)) : 0), 0)
  + b.productLines.reduce((s, l) => { const p = getProducto(l.id); return s + (p ? precioFinal(p) * l.qty : 0); }, 0);
const ahorroBundle = b => Math.max(0, sumaBundle(b) - b.precioBundle);
const bundleDisponible = b => b.courseIds.every(id => getCurso(id))
  && b.productLines.every(l => { const p = getProducto(l.id); return p && p.stock >= l.qty && (l.variantKey == null || getVariante(p, l.variantKey)); })
  && ahorroBundle(b) > 0;
function bundlesActivos(items = Cart.get()) {
  return BUNDLES.map(b => {
    const cursosOk = b.courseIds.every(id => items.some(i => i.type === 'course' && i.id === id && i.bundle === b.id));
    const prodsOk = b.productLines.every(l => items.some(i => i.type === 'product' && i.id === l.id && i.bundle === b.id && i.qty >= l.qty && (l.variantKey == null || i.variantKey === l.variantKey)));
    const ahorro = ahorroBundle(b);
    return cursosOk && prodsOk && ahorro > 0 ? { bundle: b, ahorro } : null;
  }).filter(Boolean);
}
function totales(items = Cart.get()) {
  let digital = 0, fisico = 0, digitalLista = 0, fisicoLista = 0, descuentos = 0;
  items.forEach(it => {
    const li = lineaInfo(it);
    if (!li) return;
    if (it.type === 'course') { digital += li.unit; digitalLista += li.orig; }
    else { fisico += li.unit * li.qty; fisicoLista += li.orig * li.qty; }
    descuentos += (li.orig - li.unit) * li.qty;
  });
  const combos = bundlesActivos(items).reduce((s, a) => s + a.ahorro, 0);
  return { digital, fisico, digitalLista, fisicoLista, descuentos, combos, total: digital + fisico - combos };
}

const SVG = (paths, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
const ICON = {
  curso: SVG('<path d="M2 8.5 12 4l10 4.5L12 13z"/><path d="M6 10.6V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.4"/>'),
  producto: SVG('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  reloj: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  nivel: SVG('<path d="M5 20v-5M12 20V10M19 20V4"/>'),
  clases: SVG('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>'),
  check: SVG('<path d="M20 6 9 17l-5-5"/>'),
  video: SVG('<rect x="3" y="6" width="13" height="12" rx="1.5"/><path d="m16 10 5-3v10l-5-3"/>'),
  lectura: SVG('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>'),
  audio: SVG('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>'),
  pdf: SVG('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
};
const TIPO_LABEL = { video: 'Video', lectura: 'Lectura', audio: 'Audio', pdf: 'PDF' };
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function coverHTML(c) {
  const area = getArea(c.categoria);
  return `<span class="cover" data-area="${esc(c.categoria)}" aria-hidden="true"><span class="cinta cover-cinta"></span><span class="cover-top">${esc(area?.corto)} · ${String(numeroEnArea(c)).padStart(2, '0')}</span><span class="cover-mid"><span class="cover-rule"></span><span class="cover-title">${esc(c.titulo)}</span></span><span class="cover-foot"><span>${esc(c.duracion)}</span><span class="cover-sello">E</span></span></span>`;
}
function coverMiniHTML(c) {
  const idx = AREAS.findIndex(a => a.id === c.categoria);
  return `<span class="cover cover-mini" data-area="${esc(c.categoria)}" aria-hidden="true"><span class="cover-mini-n">${ROMANOS[idx] || 'E'}</span></span>`;
}
function fotoHTML(p, eager = false) {
  return `<span class="card-foto"><img src="${esc(p.imagen)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" style="object-position:${esc(p.pos)}"${eager ? '' : ' decoding="async"'}></span>`;
}
function precioHTML(item) {
  const f = precioFinal(item);
  if (item.descuento > 0) return `<p class="precio"><span class="precio-final">${formatearPrecio(f)}</span><s class="precio-orig"><span class="sr-only">Antes </span>${formatearPrecio(item.precio)}</s><span class="precio-off">-${item.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio-final">${formatearPrecio(f)}</span></p>`;
}
function botonCursoHTML(c, clase = 'btn-sm') {
  return Cart.has(Cart.keyCurso(c.id))
    ? `<button type="button" class="btn btn-en-carrito ${clase}" data-open-cart>${ICON.check}En tu carrito</button>`
    : `<button type="button" class="btn btn-cta ${clase}" data-add-course="${esc(c.id)}">Inscribirme</button>`;
}
function destCardHTML(c) {
  const d = getDocente(c.docenteId);
  return `<article class="dest-card" data-animate style="opacity:0;transform:translateY(20px)">
    <button type="button" class="card-media" data-open="course:${esc(c.id)}" aria-label="Ver el programa de ${esc(c.titulo)}">${coverHTML(c)}</button>
    <div class="dest-body">
      <p class="card-tipo">${ICON.curso}<b>Curso</b><span>· ${esc(getArea(c.categoria)?.nombre)}</span></p>
      <h3 class="card-title"><button type="button" data-open="course:${esc(c.id)}">${esc(c.titulo)}</button></h3>
      <p class="dest-desc">${esc(c.descripcionCorta)}</p>
      <p class="dest-datos"><span>${ICON.nivel}${esc(c.nivel)}</span><span>${ICON.reloj}${esc(c.duracion)}</span><span>${ICON.clases}${c.cantidadClases} clases</span></p>
      <p class="card-meta">${esc(d?.nombre)} · ${esc(c.modalidad)}</p>
      <div class="dest-foot">${precioHTML(c)}<div class="dest-actions"><button type="button" class="btn btn-line btn-sm" data-open="course:${esc(c.id)}">Ver el programa</button><span class="curso-cta" data-curso-cta="${esc(c.id)}">${botonCursoHTML(c)}</span></div></div>
    </div>
  </article>`;
}
function cardCursoHTML(c) {
  const d = getDocente(c.docenteId);
  return `<article class="card" data-type="course" data-animate style="opacity:0;transform:translateY(20px)">
    <button type="button" class="card-media" data-open="course:${esc(c.id)}" aria-label="Ver el programa de ${esc(c.titulo)}">${coverHTML(c)}</button>
    <div class="card-body">
      <p class="card-tipo">${ICON.curso}<b>Curso</b><span>· ${esc(getArea(c.categoria)?.nombre)}</span></p>
      <h3 class="card-title"><button type="button" data-open="course:${esc(c.id)}">${esc(c.titulo)}</button></h3>
      <p class="card-meta card-docente">${esc(d?.nombre)}</p>
      <p class="card-meta">${esc(c.nivel)} · ${esc(c.duracion)} · ${c.cantidadClases} clases</p>
      ${precioHTML(c)}
      <div class="prod-actions"><button type="button" class="btn btn-line btn-sm prod-add" data-open="course:${esc(c.id)}">Ver curso</button></div>
    </div>
  </article>`;
}
function cardProductoHTML(p) {
  const agotado = p.stock <= 0;
  const conVar = p.variantes.length > 0;
  const meta = conVar ? `${p.variantes.length} opciones · ${esc(p.varLabel.toLowerCase())}` : 'Presentación única';
  const acciones = agotado
    ? `<button type="button" class="btn btn-line btn-sm prod-add" data-open="product:${esc(p.id)}">Ver detalle</button>`
    : conVar
      ? `<button type="button" class="btn btn-cta btn-sm prod-add" data-open="product:${esc(p.id)}">Elegir opción</button>`
      : `<div class="stepper" data-stepper="${esc(p.id)}"><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><output aria-live="polite">1</output><button type="button" data-step="1" aria-label="Sumar uno">+</button></div><button type="button" class="btn btn-cta btn-sm prod-add" data-add-product="${esc(p.id)}">Agregar</button>`;
  return `<article class="card" data-type="product" data-animate style="opacity:0;transform:translateY(20px)">
    <button type="button" class="card-media" data-open="product:${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}${agotado ? '<span class="card-agotado">Sin stock</span>' : ''}</button>
    <div class="card-body">
      <p class="card-tipo">${ICON.producto}<b>Producto</b><span>· ${esc(getSubcat(p.categoria)?.nombre)}</span></p>
      <h3 class="card-title"><button type="button" data-open="product:${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="card-meta">${meta}</p>
      ${precioHTML(p)}
      <div class="prod-actions">${acciones}</div>
    </div>
  </article>`;
}

const PASO = 12;
const Estado = { tab: 'todo', q: '', cats: new Set(), niveles: new Set(), modalidades: new Set(), stock: false, rango: null, visibles: PASO };
const itemsCatalogo = () => [
  ...AREAS.flatMap(a => CURSOS.filter(c => c.categoria === a.id).sort((x, y) => precioFinal(x) - precioFinal(y))),
  ...PRODUCTOS,
];
const textoBusqueda = it => it.type === 'course'
  ? normalizar([it.titulo, getArea(it.categoria)?.nombre, it.nivel, it.modalidad, getDocente(it.docenteId)?.nombre, it.descripcionCorta, it.descripcionCompleta, ...it.tags, ...it.modulos.flatMap(m => [m.titulo, ...m.clases.map(c => c.titulo)])].join(' '))
  : normalizar([it.nombre, getSubcat(it.categoria)?.nombre, it.descripcionCorta, it.descripcionCompleta, ...it.tags, ...it.variantes.map(v => v.label)].join(' '));
const INDICE = new Map([...CURSOS, ...PRODUCTOS].map(it => [it.type + ':' + it.id, textoBusqueda(it)]));

function categoriasDelTab(tab = Estado.tab) {
  if (tab === 'course') return AREAS.map(a => ({ id: a.id, nombre: a.nombre }));
  if (tab === 'product') return SUBCATEGORIAS.map(s => ({ id: s.id, nombre: s.nombre }));
  return [...AREAS.map(a => ({ id: a.id, nombre: a.nombre })), ...SUBCATEGORIAS.filter(s => !AREAS.some(a => a.id === s.id)).map(s => ({ id: s.id, nombre: s.nombre }))];
}
function filtrar() {
  const palabras = normalizar(Estado.q).split(/\s+/).filter(Boolean);
  const rango = RANGOS.find(r => r.id === Estado.rango);
  return itemsCatalogo().filter(it => {
    if (Estado.tab !== 'todo' && it.type !== Estado.tab) return false;
    if (palabras.length && !palabras.every(w => INDICE.get(it.type + ':' + it.id).includes(w))) return false;
    if (Estado.cats.size && !Estado.cats.has(it.categoria)) return false;
    if (rango) { const p = precioFinal(it); if (p < rango.min || p > rango.max) return false; }
    if (it.type === 'course') {
      if (Estado.niveles.size && !Estado.niveles.has(it.nivel)) return false;
      if (Estado.modalidades.size && !Estado.modalidades.has(it.modalidad)) return false;
    } else if (Estado.stock && it.stock <= 0) return false;
    return true;
  });
}
const cantidadFiltros = () => Estado.cats.size + Estado.niveles.size + Estado.modalidades.size + (Estado.stock ? 1 : 0) + (Estado.rango ? 1 : 0);
const hayFiltros = () => cantidadFiltros() > 0 || Estado.q.trim() !== '';
const cardHTML = it => it.type === 'course' ? cardCursoHTML(it) : cardProductoHTML(it);

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`; });
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
}

function grupoFiltroHTML(label, key, opciones) {
  const activo = o => key === 'rango' ? Estado.rango === o.id : Estado[key].has(o.id);
  return `<div class="filtro-grupo" role="group" aria-label="${esc(label)}"><span class="filtro-label">${esc(label)}</span>${opciones.map(o => `<button type="button" class="chip" data-filtro="${key}" data-valor="${esc(o.id)}" aria-pressed="${activo(o)}">${esc(o.nombre)}</button>`).join('')}</div>`;
}
function renderFiltros() {
  const cont = document.getElementById('catFiltros');
  if (!cont) return;
  const grupos = [grupoFiltroHTML('Categoría', 'cats', categoriasDelTab())];
  if (Estado.tab === 'course') {
    grupos.push(grupoFiltroHTML('Nivel', 'niveles', NIVELES.map(n => ({ id: n, nombre: n }))));
    grupos.push(grupoFiltroHTML('Modalidad', 'modalidades', MODALIDADES.map(m => ({ id: m, nombre: m }))));
  }
  if (Estado.tab === 'product') {
    grupos.push(`<div class="filtro-grupo" role="group" aria-label="Disponibilidad"><span class="filtro-label">Disponibilidad</span><button type="button" class="chip" data-filtro="stock" aria-pressed="${Estado.stock}">Con stock</button></div>`);
  }
  grupos.push(grupoFiltroHTML('Precio', 'rango', RANGOS));
  cont.innerHTML = grupos.join('');
}
function actualizarEstadoCatalogo(total) {
  const count = document.getElementById('catCount');
  const more = document.getElementById('catMore');
  const clear = document.getElementById('catClear');
  const n = document.getElementById('filtrosN');
  const etiqueta = Estado.tab === 'course' ? (total === 1 ? 'curso' : 'cursos') : Estado.tab === 'product' ? (total === 1 ? 'producto' : 'productos') : (total === 1 ? 'resultado' : 'resultados');
  if (count) count.innerHTML = `<strong>${total}</strong> ${etiqueta}${Estado.q.trim() ? ` para «${esc(Estado.q.trim())}»` : ''}`;
  if (more) {
    const restantes = total - Estado.visibles;
    more.hidden = restantes <= 0;
    more.textContent = `Ver más (${Math.max(0, restantes)})`;
  }
  if (clear) clear.hidden = !hayFiltros();
  if (n) { n.textContent = cantidadFiltros(); n.hidden = cantidadFiltros() === 0; }
  document.getElementById('catEmpty').hidden = total > 0;
}
function renderCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, Estado.visibles).map(cardHTML).join('');
  grid.setAttribute('aria-labelledby', `tab-${Estado.tab}`);
  actualizarEstadoCatalogo(lista.length);
  revelarNuevos(grid);
}
function verMas() {
  const grid = document.getElementById('catGrid');
  const lista = filtrar();
  const desde = Estado.visibles;
  Estado.visibles += PASO;
  grid.insertAdjacentHTML('beforeend', lista.slice(desde, Estado.visibles).map(cardHTML).join(''));
  actualizarEstadoCatalogo(lista.length);
  revelarNuevos(grid);
  grid.children[desde]?.querySelector('.card-title button')?.focus({ preventScroll: true });
}
function cambiarTab(tab, { foco = false } = {}) {
  Estado.tab = tab;
  const validas = new Set(categoriasDelTab(tab).map(c => c.id));
  Estado.cats = new Set([...Estado.cats].filter(c => validas.has(c)));
  Estado.niveles.clear(); Estado.modalidades.clear(); Estado.stock = false;
  Estado.visibles = PASO;
  document.querySelectorAll('.cat-tab').forEach(b => {
    const activo = b.dataset.tab === tab;
    b.setAttribute('aria-selected', String(activo));
    b.tabIndex = activo ? 0 : -1;
    if (activo && foco) b.focus();
  });
  renderFiltros();
  renderCatalogo();
}
function limpiarFiltros({ tab = null } = {}) {
  Estado.q = ''; Estado.cats.clear(); Estado.niveles.clear(); Estado.modalidades.clear(); Estado.stock = false; Estado.rango = null; Estado.visibles = PASO;
  const input = document.getElementById('catSearch');
  if (input) input.value = '';
  if (tab) cambiarTab(tab); else { renderFiltros(); renderCatalogo(); }
}
function initCatalogo() {
  renderFiltros();
  renderCatalogo();
  const tabs = [...document.querySelectorAll('.cat-tab')];
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => { if (b.dataset.tab !== Estado.tab) cambiarTab(b.dataset.tab); });
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      cambiarTab(sig.dataset.tab, { foco: true });
    });
  });
  let t;
  document.getElementById('catSearch')?.addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { Estado.q = e.target.value; Estado.visibles = PASO; renderCatalogo(); }, 180);
  });
  document.getElementById('catFiltros')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const key = chip.dataset.filtro;
    const valor = chip.dataset.valor;
    if (key === 'stock') Estado.stock = !Estado.stock;
    else if (key === 'rango') Estado.rango = Estado.rango === valor ? null : valor;
    else if (Estado[key].has(valor)) Estado[key].delete(valor);
    else Estado[key].add(valor);
    Estado.visibles = PASO;
    renderFiltros();
    renderCatalogo();
    document.querySelector(`#catFiltros .chip[data-filtro="${key}"]${valor ? `[data-valor="${window.CSS.escape(valor)}"]` : ''}`)?.focus();
  });
  document.getElementById('catMore')?.addEventListener('click', verMas);
  document.getElementById('catClear')?.addEventListener('click', () => limpiarFiltros());
  document.getElementById('catEmptyClear')?.addEventListener('click', () => limpiarFiltros({ tab: 'todo' }));
  const toggle = document.getElementById('filtrosToggle');
  toggle?.addEventListener('click', () => {
    const abierto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!abierto));
    document.getElementById('catFiltros')?.classList.toggle('open', !abierto);
  });
}
function aplicarLinkCategoria(area) {
  limpiarFiltros({ tab: 'course' });
  Estado.cats.add(area);
  renderFiltros();
  renderCatalogo();
}

function renderDestacados() {
  const grid = document.getElementById('destGrid');
  if (!grid) return;
  grid.innerHTML = CURSOS.filter(c => c.destacado > 0).sort((a, b) => a.destacado - b.destacado).slice(0, 4).map(destCardHTML).join('');
}
function comboHTML(b) {
  const cursos = b.courseIds.map(getCurso).filter(Boolean);
  const prods = b.productLines.map(l => ({ l, p: getProducto(l.id) })).filter(x => x.p);
  const disponible = bundleDisponible(b);
  const filas = [
    ...cursos.map(c => `<li><span>${esc(c.titulo)}</span><span>${formatearPrecio(precioFinal(c))}</span></li>`),
    ...prods.map(({ l, p }) => `<li><span>${esc(p.nombre)}${l.variantKey ? ` · ${esc(getVariante(p, l.variantKey)?.label)}` : ''}</span><span>${formatearPrecio(precioFinal(p) * l.qty)}</span></li>`),
  ];
  return `<article class="combo" data-animate style="opacity:0;transform:translateY(20px)">
    <div class="combo-visual">
      ${cursos[0] ? `<button type="button" class="card-media" data-open="course:${esc(cursos[0].id)}" aria-label="Ver el programa de ${esc(cursos[0].titulo)}">${coverHTML(cursos[0])}</button>` : ''}
      ${prods[0] ? `<button type="button" class="card-media" data-open="product:${esc(prods[0].p.id)}" aria-label="Ver ${esc(prods[0].p.nombre)}">${fotoHTML(prods[0].p)}</button>` : ''}
      <span class="combo-plus" aria-hidden="true">+</span>
    </div>
    <div class="combo-body">
      <p class="card-tipo">${ICON.curso}<b>Curso</b><span>+ ${prods.length === 1 ? 'material' : `${prods.length} materiales`}</span></p>
      <h3>${esc(b.titulo)}</h3>
      <p class="combo-texto">${esc(b.texto)}</p>
      <ul class="combo-items">${filas.join('')}</ul>
      <div class="combo-precio"><span class="precio-final">${formatearPrecio(b.precioBundle)}</span><s class="precio-orig"><span class="sr-only">Por separado </span>${formatearPrecio(sumaBundle(b))}</s><span class="combo-ahorro">Ahorrás ${formatearPrecio(ahorroBundle(b))}</span></div>
      <button type="button" class="btn btn-cta" data-add-bundle="${esc(b.id)}"${disponible ? '' : ' disabled'}>${disponible ? 'Comprar curso + materiales' : 'Sin stock de un material'}</button>
    </div>
  </article>`;
}
function renderCombos() {
  const grid = document.getElementById('combosGrid');
  if (grid) grid.innerHTML = BUNDLES.map(comboHTML).join('');
}

function agregarCurso(id) {
  const c = getCurso(id);
  if (!c) return;
  if (Cart.addCurso(id)) showToast(`Sumamos «${c.titulo}» a tu carrito.`);
  else showToast(`«${c.titulo}» ya está en tu carrito.`);
}
function agregarProducto(id, variantKey, qty) {
  const p = getProducto(id);
  if (!p) return 0;
  const sumados = Cart.addProducto(id, variantKey, qty);
  const v = getVariante(p, variantKey)?.label;
  if (sumados > 0) showToast(`Sumamos ${sumados} × ${p.nombre}${v ? ` (${v})` : ''} a tu carrito.`);
  else showToast(p.stock <= 0 ? `«${p.nombre}» no tiene stock por ahora.` : `Ya tenés en el carrito todo el stock de «${p.nombre}».`);
  return sumados;
}
function agregarBundle(id) {
  const b = BUNDLES.find(x => x.id === id);
  if (!b || !bundleDisponible(b)) return;
  b.courseIds.forEach(cid => Cart.addCurso(cid, b.id));
  b.productLines.forEach(l => {
    const key = Cart.keyProducto(l.id, l.variantKey);
    const existente = Cart.get().find(i => i.key === key);
    if (!existente) { Cart.addProducto(l.id, l.variantKey, l.qty, b.id); return; }
    if (existente.qty < l.qty) { Cart.addProducto(l.id, l.variantKey, l.qty - existente.qty, b.id); return; }
    const items = Cart.get();
    const it = items.find(i => i.key === key);
    if (it && it.bundle !== b.id) { it.bundle = b.id; Cart.save(items); }
  });
  showToast(`Sumamos «${b.titulo}». Ahorrás ${formatearPrecio(ahorroBundle(b))}.`);
}
function valorStepper(scope) {
  return parseInt(scope?.querySelector('.stepper output')?.textContent, 10) || 1;
}
function moverStepper(btn) {
  const stepper = btn.closest('.stepper');
  const out = stepper?.querySelector('output');
  const p = getProducto(stepper?.dataset.stepper);
  if (!out || !p) return;
  const scope = btn.closest('.qv, .card');
  const variantKey = scope?.querySelector('.variantes [aria-pressed="true"]')?.dataset.variante || null;
  const key = Cart.keyProducto(p.id, p.variantes.length ? (variantKey || p.variantes[0].key) : null);
  const tope = Math.max(1, Cart.stockLibre(p.id, key) - (Cart.get().find(i => i.key === key)?.qty || 0));
  const valor = Math.max(1, Math.min(tope, (parseInt(out.textContent, 10) || 1) + Number(btn.dataset.step)));
  out.textContent = valor;
  stepper.querySelector('[data-step="-1"]').disabled = valor <= 1;
  stepper.querySelector('[data-step="1"]').disabled = valor >= tope;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-curso-cta]').forEach(el => {
    const c = getCurso(el.dataset.cursoCta);
    if (c) el.innerHTML = botonCursoHTML(c, el.dataset.clase || 'btn-sm');
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
function atraparFoco(e, cont) {
  if (e.key !== 'Tab' || !cont) return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length > 0);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

const RELACION_CURSO = {
  c1: { productos: ['p1'], motivo: 'Si todavía no tenés una Biblia de estudio, la podés sumar al seminario.' },
  c2: { productos: ['p2', 'p3'], motivo: 'Para seguir las lecturas de cada semana y marcar lo que vas estudiando.' },
  c4: { productos: ['p2'], motivo: 'Para llevar tu cuaderno de oración durante las cuatro semanas.' },
  c9: { productos: ['p4'], motivo: 'Las manualidades del curso se arman con estos materiales.' },
};
const RELACION_PRODUCTO = {
  p1: { curso: 'c1', motivo: 'Fundamentos de la fe enseña a leerla con orden y con su contexto.' },
  p4: { curso: 'c9', motivo: 'El curso de Maestra de Escuelita Bíblica enseña a usar estos materiales en cada clase.' },
};

function relacionadoHTML(it) {
  const esCurso = it.type === 'course';
  const media = esCurso ? coverHTML(it) : `<img src="${esc(it.imagen)}" width="${it.w}" height="${it.h}" alt="" style="object-position:${esc(it.pos)}">`;
  return `<button type="button" class="relacionado" data-open="${it.type}:${esc(it.id)}">${media}<span><span class="relacionado-t">${esc(esCurso ? it.titulo : it.nombre)}</span><span class="relacionado-p">${formatearPrecio(precioFinal(it))}</span></span></button>`;
}
function stepperHTML(p) {
  return `<div class="stepper" data-stepper="${esc(p.id)}"><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><output aria-live="polite">1</output><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
}
function vistaCursoHTML(c) {
  const d = getDocente(c.docenteId);
  const horas = (minutosTotales(c) / 60).toLocaleString('es-AR', { maximumFractionDigits: 1 });
  const rel = RELACION_CURSO[c.id];
  const relItems = rel ? rel.productos.map(getProducto).filter(p => p && p.stock > 0) : [];
  const lista = arr => `<ul class="qv-lista">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<div class="qv-grid">
    <div class="qv-media">${coverHTML(c)}</div>
    <div class="qv-info">
      <p class="card-tipo">${ICON.curso}<b>Curso</b><span>· ${esc(getArea(c.categoria)?.nombre)}</span></p>
      <h2 id="qvTitle">${esc(c.titulo)}</h2>
      <p class="qv-lead">${esc(c.descripcionCompleta)}</p>
      <dl class="qv-datos">
        <div><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div>
        <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
        <div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div>
        <div><dt>Clases</dt><dd>${c.cantidadClases} clases · ${horas} h</dd></div>
        <div><dt>Acceso</dt><dd>Aula online con tu usuario</dd></div>
        <div><dt>Para probar</dt><dd>La primera clase es abierta</dd></div>
      </dl>
      <div class="qv-compra">
        ${precioHTML(c)}
        <div class="qv-compra-acciones"><span data-curso-cta="${esc(c.id)}" data-clase="">${botonCursoHTML(c, '')}</span><button type="button" class="btn btn-line" data-comprar-curso="${esc(c.id)}">Comprar ahora</button></div>
        <p class="qv-compra-nota">Pagás online y el curso aparece en tu aula.</p>
      </div>
      <section class="qv-seccion"><h3>Qué vas a lograr</h3>${lista(c.resultados)}</section>
      <section class="qv-seccion programa"><h3>Programa</h3>${c.modulos.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="mod-n">${ROMANOS[i]}</span>${esc(m.titulo)}<small>${m.clases.length} clases · ${m.clases.reduce((s, x) => s + x.duracion, 0)} min</small></summary><ol>${m.clases.map(cl => `<li class="clase">${ICON[cl.tipo]}<span>${esc(cl.titulo)}${cl.preview ? '<span class="clase-preview">Clase abierta</span>' : ''}</span><span class="clase-dur"><span class="sr-only">${TIPO_LABEL[cl.tipo]}, </span>${cl.duracion} min</span></li>`).join('')}</ol></details>`).join('')}</section>
      <section class="qv-seccion"><h3>Requisitos</h3>${lista(c.requisitos)}</section>
      <section class="qv-seccion"><h3>Qué incluye</h3>${lista(c.incluye)}</section>
      <section class="qv-seccion"><h3>Quién enseña</h3><div class="docente"><span class="docente-mono" aria-hidden="true">${esc(d?.nombre.charAt(0))}</span><div><p class="docente-nombre">${esc(d?.nombre)}</p><p class="docente-rol">${esc(d?.rol)}</p><p>${esc(d?.bio)}</p></div></div></section>
      ${c.faq.length ? `<section class="qv-seccion"><h3>Preguntas del curso</h3>${c.faq.map(([q, a]) => `<details class="faq-item"><summary>${esc(q)}</summary><div class="faq-body"><p>${esc(a)}</p></div></details>`).join('')}</section>` : ''}
      ${relItems.length ? `<section class="qv-seccion"><h3>Material para este curso</h3><p class="rel-porque">${esc(rel.motivo)}</p><div class="relacionados">${relItems.map(relacionadoHTML).join('')}</div></section>` : ''}
    </div>
  </div>`;
}
function vistaProductoHTML(p) {
  const agotado = p.stock <= 0;
  const rel = RELACION_PRODUCTO[p.id];
  const curso = rel ? getCurso(rel.curso) : null;
  const similares = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const acciones = agotado
    ? `<a class="btn btn-line" href="${wspLink(`Hola, quiero saber cuándo vuelve a haber stock de ${p.nombre}.`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`
    : `${stepperHTML(p)}<button type="button" class="btn btn-cta" data-add-product="${esc(p.id)}">Agregar</button><button type="button" class="btn btn-line" data-comprar-producto="${esc(p.id)}">Comprar ahora</button>`;
  return `<div class="qv-grid">
    <div class="qv-media">${fotoHTML(p, true)}</div>
    <div class="qv-info">
      <p class="card-tipo">${ICON.producto}<b>Producto</b><span>· ${esc(getSubcat(p.categoria)?.nombre)}</span></p>
      <h2 id="qvTitle">${esc(p.nombre)}</h2>
      <p class="qv-lead">${esc(p.descripcionCompleta)}</p>
      ${p.variantes.length ? `<div><p class="var-label" id="qvVarLabel">${esc(p.varLabel)}</p><div class="variantes" role="group" aria-labelledby="qvVarLabel">${p.variantes.map((v, i) => `<button type="button" class="chip" data-variante="${esc(v.key)}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join('')}</div></div>` : ''}
      <dl class="qv-datos">
        <div><dt>Entrega</dt><dd>Se coordina por WhatsApp</dd></div>
        <div><dt>Disponibilidad</dt><dd>${agotado ? 'Sin stock por ahora' : 'Con stock'}</dd></div>
      </dl>
      <div class="qv-compra">${precioHTML(p)}<div class="qv-compra-acciones">${acciones}</div></div>
      ${curso ? `<section class="qv-seccion"><h3>Curso relacionado</h3><p class="rel-porque">${esc(rel.motivo)}</p><div class="relacionados">${relacionadoHTML(curso)}</div></section>` : ''}
      ${similares.length ? `<section class="qv-seccion"><h3>También te puede interesar</h3><div class="relacionados">${similares.map(relacionadoHTML).join('')}</div></section>` : ''}
    </div>
  </div>`;
}

const Overlay = { qvTrigger: null, qvTimer: null, drawerTrigger: null, drawerTimer: null, paso: 'carrito' };
const vistaAbierta = () => !document.getElementById('qvBackdrop')?.hidden;
const drawerAbierto = () => !document.getElementById('cartDrawer')?.hidden;

function abrirVista(tipo, id, trigger) {
  const item = tipo === 'course' ? getCurso(id) : tipo === 'product' ? getProducto(id) : null;
  const back = document.getElementById('qvBackdrop');
  const cont = document.getElementById('qvContent');
  if (!item || !back || !cont) return;
  if (!vistaAbierta()) Overlay.qvTrigger = trigger || document.activeElement;
  clearTimeout(Overlay.qvTimer);
  cont.innerHTML = tipo === 'course' ? vistaCursoHTML(item) : vistaProductoHTML(item);
  cont.scrollTop = 0;
  document.getElementById('qv')?.setAttribute('aria-labelledby', 'qvTitle');
  back.hidden = false;
  requestAnimationFrame(() => back.classList.add('open'));
  document.body.classList.add('no-scroll');
  try { window.history.replaceState(null, '', `${location.pathname}?${tipo === 'course' ? 'curso' : 'producto'}=${item.slug}`); } catch (e) { void e; }
  document.getElementById('qvClose')?.focus();
}
function cerrarVista({ devolverFoco = true } = {}) {
  const back = document.getElementById('qvBackdrop');
  if (!back || back.hidden) return;
  back.classList.remove('open');
  clearTimeout(Overlay.qvTimer);
  Overlay.qvTimer = setTimeout(() => { back.hidden = true; }, reduceMotion ? 0 : 320);
  if (!drawerAbierto()) document.body.classList.remove('no-scroll');
  try { window.history.replaceState(null, '', location.pathname); } catch (e) { void e; }
  if (devolverFoco) Overlay.qvTrigger?.focus?.({ preventScroll: true });
}

function lineaHTML(it) {
  const li = lineaInfo(it);
  const esCurso = it.type === 'course';
  const media = esCurso ? coverMiniHTML(li.item) : `<img src="${esc(li.item.imagen)}" width="${li.item.w}" height="${li.item.h}" alt="" style="object-position:${esc(li.item.pos)}">`;
  const enCombo = it.bundle && bundlesActivos().some(a => a.bundle.id === it.bundle);
  const meta = esCurso ? `${esc(li.item.modalidad)} · ${esc(li.item.duracion)}` : `${li.variante ? `${esc(li.variante)} · ` : ''}${formatearPrecio(li.unit)} c/u`;
  const libre = esCurso ? 1 : Cart.stockLibre(it.id, it.key);
  const controles = esCurso ? '' : `<div class="stepper"><button type="button" data-line-step="-1" data-key="${esc(it.key)}" aria-label="Restar uno de ${esc(li.titulo)}"${it.qty <= 1 ? ' disabled' : ''}>−</button><output aria-live="polite">${it.qty}</output><button type="button" data-line-step="1" data-key="${esc(it.key)}" aria-label="Sumar uno de ${esc(li.titulo)}"${it.qty >= libre ? ' disabled' : ''}>+</button></div>`;
  return `<div class="cart-line"><div class="cart-line-media">${media}</div><div class="cart-line-info"><p class="cart-line-title">${esc(li.titulo)}</p><p class="cart-line-meta">${meta}</p>${enCombo ? '<span class="cart-line-combo">Parte de un combo</span>' : ''}${controles}</div><div class="cart-line-side"><span class="cart-line-precio">${formatearPrecio(li.unit * li.qty)}</span><button type="button" class="cart-remove" data-remove="${esc(it.key)}">Quitar<span class="sr-only"> ${esc(li.titulo)}</span></button></div></div>`;
}
function totalesHTML(t, cursos, prods, activos) {
  return `<dl class="cart-totales">
    ${cursos.length ? `<div><dt>Cursos</dt><dd>${formatearPrecio(t.digitalLista)}</dd></div>` : ''}
    ${prods.length ? `<div><dt>Productos</dt><dd>${formatearPrecio(t.fisicoLista)}</dd></div>` : ''}
    ${t.descuentos > 0 ? `<div class="cart-ahorro"><dt>Descuentos</dt><dd>−${formatearPrecio(t.descuentos)}</dd></div>` : ''}
    ${activos.map(a => `<div class="cart-ahorro"><dt>Combo ${esc(a.bundle.titulo)}</dt><dd>−${formatearPrecio(a.ahorro)}</dd></div>`).join('')}
    <div class="cart-total"><dt>Total</dt><dd>${formatearPrecio(t.total)}</dd></div>
  </dl>`;
}
function renderDrawer() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const title = document.getElementById('cartTitle');
  if (!body || !foot || !title) return;
  const foco = document.activeElement?.closest?.('#cartDrawer') ? { key: document.activeElement.dataset.key, step: document.activeElement.dataset.lineStep } : null;
  const items = Cart.get().filter(i => lineaInfo(i));
  if (!items.length) {
    Overlay.paso = 'carrito';
    title.textContent = 'Tu carrito';
    body.innerHTML = `<div class="cart-vacio">${ICON.carrito}<p class="cart-vacio-title">Tu carrito está vacío</p><p>Elegí un seminario o un curso y lo vas a ver acá, junto con los materiales que sumes.</p><a class="btn btn-cta" href="#catalogo" data-cerrar-drawer>Ver el catálogo</a></div>`;
    foot.innerHTML = '';
    return;
  }
  const cursos = items.filter(i => i.type === 'course');
  const prods = items.filter(i => i.type === 'product');
  const t = totales(items);
  const activos = bundlesActivos(items);
  if (Overlay.paso === 'checkout') {
    title.textContent = 'Resumen de tu compra';
    body.innerHTML = `<p class="checkout-paso">Paso 2 de 2 · Revisá antes de pagar</p>
      ${cursos.length ? `<div class="checkout-bloque"><h3>Cursos · acceso digital</h3><ul>${cursos.map(i => { const li = lineaInfo(i); return `<li><span>${esc(li.titulo)}</span><span>${formatearPrecio(li.unit)}</span></li>`; }).join('')}</ul><p class="checkout-recibis">Con el pago confirmado se crea tu usuario y ${cursos.length === 1 ? 'el curso aparece' : 'los cursos aparecen'} en tu aula.</p></div>` : ''}
      ${prods.length ? `<div class="checkout-bloque"><h3>Productos · con entrega</h3><ul>${prods.map(i => { const li = lineaInfo(i); return `<li><span>${i.qty} × ${esc(li.titulo)}${li.variante ? ` (${esc(li.variante)})` : ''}</span><span>${formatearPrecio(li.unit * i.qty)}</span></li>`; }).join('')}</ul><p class="checkout-recibis">${cursos.length ? 'Los materiales' : 'La entrega'} ${cursos.length ? 'los coordinamos' : 'la coordinamos'} por WhatsApp después del pago.</p></div>` : ''}`;
    foot.innerHTML = `${totalesHTML(t, cursos, prods, activos)}<button type="button" class="btn btn-cta" data-pagar>Pagar con Mercado Pago</button><button type="button" class="btn btn-line" data-volver>Volver al carrito</button>`;
    return;
  }
  title.textContent = 'Tu carrito';
  body.innerHTML = `
    ${cursos.length ? `<section class="cart-grupo" aria-label="Acceso digital"><div class="cart-grupo-head"><p class="cart-grupo-title">${ICON.curso}Acceso digital</p><span class="cart-grupo-sub">${cursos.length} ${cursos.length === 1 ? 'curso' : 'cursos'}</span></div>${cursos.map(lineaHTML).join('')}<p class="cart-grupo-nota">${cursos.length === 1 ? 'El curso aparece' : 'Los cursos aparecen'} en tu aula cuando se confirma el pago.</p></section>` : ''}
    ${prods.length ? `<section class="cart-grupo" aria-label="Productos con entrega"><div class="cart-grupo-head"><p class="cart-grupo-title">${ICON.producto}Productos con entrega</p><span class="cart-grupo-sub">${prods.reduce((s, i) => s + i.qty, 0)} u.</span></div>${prods.map(lineaHTML).join('')}<p class="cart-grupo-nota">La entrega se coordina por WhatsApp después de la compra.</p></section>` : ''}`;
  foot.innerHTML = `${totalesHTML(t, cursos, prods, activos)}<button type="button" class="btn btn-cta" data-checkout>Continuar con el pago</button><button type="button" class="btn btn-line" data-cerrar-drawer>Seguir mirando</button>`;
  if (foco?.key) {
    const btn = body.querySelector(`[data-key="${window.CSS.escape(foco.key)}"][data-line-step="${foco.step}"]`);
    (btn && !btn.disabled ? btn : body.querySelector(`[data-key="${window.CSS.escape(foco.key)}"]`) || document.getElementById('cartClose'))?.focus();
  }
}
function openCartDrawer(trigger) {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  if (vistaAbierta()) cerrarVista({ devolverFoco: false });
  Overlay.drawerTrigger = trigger instanceof window.Element ? trigger : document.activeElement;
  Overlay.paso = 'carrito';
  clearTimeout(Overlay.drawerTimer);
  renderDrawer();
  d.hidden = false;
  bd.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
}
function closeCartDrawer({ devolverFoco = true } = {}) {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  bd.classList.remove('open');
  clearTimeout(Overlay.drawerTimer);
  Overlay.drawerTimer = setTimeout(() => { d.hidden = true; bd.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (devolverFoco) Overlay.drawerTrigger?.focus?.({ preventScroll: true });
}
function mensajePago(items) {
  const hayCursos = items.some(i => i.type === 'course');
  const hayProductos = items.some(i => i.type === 'product');
  if (hayCursos && hayProductos) return 'El pago con Mercado Pago, tu usuario del aula y la coordinación de la entrega se activan al pasar la web a producción.';
  if (hayCursos) return 'El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.';
  return '¡Genial! El pago online se activa al pasar la web a producción.';
}

function initOverlays() {
  const back = document.getElementById('qvBackdrop');
  const qv = document.getElementById('qv');
  const drawer = document.getElementById('cartDrawer');
  document.getElementById('qvClose')?.addEventListener('click', () => cerrarVista());
  back?.addEventListener('click', e => { if (e.target === back) cerrarVista(); });
  document.getElementById('drawerBackdrop')?.addEventListener('click', () => closeCartDrawer());
  document.getElementById('cartClose')?.addEventListener('click', () => closeCartDrawer());
  document.getElementById('cartBtn')?.addEventListener('click', e => openCartDrawer(e.currentTarget));
  document.addEventListener('keydown', e => {
    if (vistaAbierta()) { if (e.key === 'Escape') cerrarVista(); else atraparFoco(e, qv); return; }
    if (drawerAbierto()) { if (e.key === 'Escape') closeCartDrawer(); else atraparFoco(e, drawer); }
  });
  drawer?.addEventListener('click', e => {
    const t = e.target.closest('[data-remove],[data-line-step],[data-checkout],[data-volver],[data-pagar],[data-cerrar-drawer]');
    if (!t) return;
    if (t.matches('[data-remove]')) {
      const li = lineaInfo(Cart.get().find(i => i.key === t.dataset.remove) || {});
      Cart.remove(t.dataset.remove);
      if (li) showToast(`Quitamos «${li.titulo}» del carrito.`);
      document.getElementById('cartClose')?.focus();
    } else if (t.matches('[data-line-step]')) {
      const it = Cart.get().find(i => i.key === t.dataset.key);
      if (it) Cart.setQty(it.key, it.qty + Number(t.dataset.lineStep));
    } else if (t.matches('[data-checkout]')) {
      Overlay.paso = 'checkout';
      renderDrawer();
      drawer.querySelector('.drawer-body').scrollTop = 0;
      drawer.querySelector('[data-pagar]')?.focus();
    } else if (t.matches('[data-volver]')) {
      Overlay.paso = 'carrito';
      renderDrawer();
      drawer.querySelector('[data-checkout]')?.focus();
    } else if (t.matches('[data-pagar]')) {
      t.disabled = true;
      t.textContent = 'Conectando…';
      setTimeout(() => {
        showToast(mensajePago(Cart.get()));
        t.disabled = false;
        t.textContent = 'Pagar con Mercado Pago';
      }, 800);
    } else if (t.matches('[data-cerrar-drawer]')) {
      closeCartDrawer({ devolverFoco: !t.matches('a') });
    }
  });
  qv?.addEventListener('click', e => {
    const chip = e.target.closest('.variantes .chip');
    if (!chip) return;
    chip.parentElement.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    const stepper = qv.querySelector('.stepper');
    const out = stepper?.querySelector('output');
    if (out) { out.textContent = '1'; stepper.querySelector('[data-step="-1"]').disabled = true; stepper.querySelector('[data-step="1"]').disabled = false; }
  });
  document.addEventListener('cart:updated', () => { if (drawerAbierto()) renderDrawer(); });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open],[data-add-course],[data-add-product],[data-add-bundle],[data-open-cart],[data-step],[data-cat-link],[data-comprar-curso],[data-comprar-producto]');
    if (!t) return;
    if (t.matches('[data-open]')) {
      const [tipo, id] = t.dataset.open.split(':');
      abrirVista(tipo, id, vistaAbierta() ? Overlay.qvTrigger : t);
    } else if (t.matches('[data-add-course]')) {
      agregarCurso(t.dataset.addCourse);
    } else if (t.matches('[data-comprar-curso]')) {
      Cart.addCurso(t.dataset.comprarCurso);
      openCartDrawer(Overlay.qvTrigger);
    } else if (t.matches('[data-add-product], [data-comprar-producto]')) {
      const id = t.dataset.addProduct || t.dataset.comprarProducto;
      const scope = t.closest('.qv, .card');
      const variante = scope?.querySelector('.variantes [aria-pressed="true"]')?.dataset.variante || null;
      const sumados = t.matches('[data-comprar-producto]') ? Cart.addProducto(id, variante, valorStepper(scope)) : agregarProducto(id, variante, valorStepper(scope));
      const out = scope?.querySelector('.stepper output');
      if (out) { out.textContent = '1'; const menos = scope.querySelector('[data-step="-1"]'); if (menos) menos.disabled = true; }
      if (t.matches('[data-comprar-producto]')) {
        if (!sumados && !Cart.get().some(i => i.type === 'product' && i.id === id)) showToast('No hay más stock para sumar.');
        openCartDrawer(Overlay.qvTrigger);
      }
    } else if (t.matches('[data-add-bundle]')) {
      agregarBundle(t.dataset.addBundle);
    } else if (t.matches('[data-open-cart]')) {
      openCartDrawer(t);
    } else if (t.matches('[data-step]')) {
      moverStepper(t);
    } else if (t.matches('[data-cat-link]')) {
      aplicarLinkCategoria(t.dataset.catLink);
    }
  });
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
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F7F4EF', '--color-text': '#141414', '--color-text-muted': '#5F5B56', '--color-primary': '#FF0000', '--color-secondary': '#000000', '--color-cta': '#D00000', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Vino', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F7F2F1', '--color-text': '#1B1316', '--color-text-muted': '#655A5D', '--color-primary': '#FF4D6D', '--color-secondary': '#1A0B10', '--color-cta': '#9B1B30', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Azul noche', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F2F4F8', '--color-text': '#0E1422', '--color-text-muted': '#566074', '--color-primary': '#4C8DFF', '--color-secondary': '#0A1020', '--color-cta': '#1D4ED8', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Oro viejo', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F8F5EC', '--color-text': '#17140C', '--color-text-muted': '#5E5849', '--color-primary': '#B8820F', '--color-secondary': '#14110A', '--color-cta': '#8A5A00', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Bosque', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F1F5F2', '--color-text': '#0F1A14', '--color-text-muted': '#56645B', '--color-primary': '#2E9E68', '--color-secondary': '#0B1611', '--color-cta': '#17683F', '--color-cta-text': '#FFFFFF' } },
];

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = `${PROYECTO}_paleta`;

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch (e) { void e; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: window.gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.32)}s`;
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

function initFormacion() {
  const tabs = [...document.querySelectorAll('.form-tab')];
  if (!tabs.length) return;
  const activar = (tab, foco = false) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      const estabaOculto = panel.hidden;
      panel.hidden = !on;
      if (on && estabaOculto && !reduceMotion) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
    });
    if (foco) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      activar(tabs[(mapa[e.key] + tabs.length) % tabs.length], true);
    });
  });
}

function initSchemaCatalogo() {
  const base = 'https://gokywebs.com/demo/iglesiacentroderestauracionemmanuel/';
  const proveedor = { '@id': `${base}#iglesia` };
  const graph = [
    ...CURSOS.map(c => ({
      '@type': 'Course', name: c.titulo, description: c.descripcionCorta, url: `${base}?curso=${c.slug}`,
      provider: proveedor, educationalLevel: c.nivel, inLanguage: 'es-AR',
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online' },
      offers: { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', category: 'Paid', availability: 'https://schema.org/InStock' },
    })),
    ...PRODUCTOS.map(p => ({
      '@type': 'Product', name: p.nombre, description: p.descripcionCorta, image: base + p.imagen, url: `${base}?producto=${p.slug}`,
      offers: { '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    })),
  ];
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(el);
}

function initDeepLink() {
  const params = new URLSearchParams(location.search);
  const curso = CURSOS.find(c => c.slug === params.get('curso'));
  const producto = PRODUCTOS.find(p => p.slug === params.get('producto'));
  if (curso) abrirVista('course', curso.id, null);
  else if (producto) abrirVista('product', producto.id, null);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

Cart.sanear();
renderDestacados();
renderCombos();
initCatalogo();
initReveals();
initNav();
initFloats();
initOverlays();
initAcciones();
initFormacion();
initColorSwitch();
initSchemaCatalogo();
document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
initDeepLink();
