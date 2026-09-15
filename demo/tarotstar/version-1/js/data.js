/* Datos demo — Tarotstar. Cursos con fines de autoconocimiento y bienestar. */
const DOCENTE = { nombre: 'Tarotstar', rol: 'Coach & Master Holística', bio: 'Acompaño procesos de autoconocimiento con tarot, numerología y energía. Perfil demostrativo.' };

const CURSOS = [
  {
    id: 1, slug: 'tarot-desde-cero', titulo: 'Tarot desde cero', subtitulo: 'Leé las cartas con intuición y método',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 34900, descuento: 0, duracion: '5 h', destacado: true, nuevo: false,
    portada: 'images/c1-tarot.jpg', color: 'tarot',
    resumen: 'Un recorrido claro por los Arcanos Mayores para empezar a leer el tarot como herramienta de introspección.',
    descripcion: 'Aprendé a interpretar los 22 Arcanos Mayores y a hacer tus primeras tiradas. Un curso pensado para que te vincules con las cartas desde la intuición, con una base ordenada y sin dogmas. El tarot como espejo para mirarte, no para adivinar un destino fijo.',
    aprendes: ['Interpretar los 22 Arcanos Mayores', 'Hacer tiradas simples de 1 y 3 cartas', 'Registrar tu proceso en una bitácora'],
    incluye: ['9 clases grabadas', 'Guía de arcanos descargable', 'Acceso de por vida (demo)'],
    modulos: [
      { id:'m1', titulo:'Antes de tirar', clases:[{id:'c1',titulo:'Qué es (y qué no es) el tarot',dur:'14 min',tipo:'video',preview:true},{id:'c2',titulo:'Cómo se estructura el mazo',dur:'16 min',tipo:'video',preview:false},{id:'c3',titulo:'Preparar el espacio y la intención',dur:'12 min',tipo:'video',preview:false}] },
      { id:'m2', titulo:'Los Arcanos Mayores', clases:[{id:'c4',titulo:'Del Loco a la Fuerza',dur:'22 min',tipo:'video',preview:false},{id:'c5',titulo:'De la Templanza al Mundo',dur:'21 min',tipo:'video',preview:false},{id:'c6',titulo:'Cartas invertidas',dur:'15 min',tipo:'lectura',preview:false}] },
      { id:'m3', titulo:'Tus primeras tiradas', clases:[{id:'c7',titulo:'La tirada de una carta',dur:'13 min',tipo:'video',preview:false},{id:'c8',titulo:'Pasado, presente, futuro',dur:'18 min',tipo:'video',preview:false},{id:'c9',titulo:'Tu bitácora de lectura',dur:'11 min',tipo:'video',preview:false}] }
    ]
  },
  {
    id: 2, slug: 'numerologia-tu-mapa-personal', titulo: 'Numerología: tu mapa personal', subtitulo: 'Descubrí el lenguaje de tus números',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 28900, descuento: 0, duracion: '4 h', destacado: false, nuevo: true,
    portada: 'images/c2-numerologia.jpg', color: 'numero',
    resumen: 'Calculá y entendé tus números personales para conocerte mejor y tomar decisiones con más claridad.',
    descripcion: 'La numerología como mapa simbólico: aprendé a calcular tu camino de vida y tus números personales, y a leerlos como una guía de autoconocimiento. Sin promesas mágicas, una herramienta más para mirarte con perspectiva.',
    aprendes: ['Calcular tu número de camino de vida', 'Interpretar tus números personales', 'Leer los ciclos del año personal'],
    incluye: ['8 clases grabadas', 'Planilla de cálculo', 'Acceso de por vida (demo)'],
    modulos: [
      { id:'m1', titulo:'Las bases', clases:[{id:'c1',titulo:'Qué mide la numerología',dur:'13 min',tipo:'video',preview:true},{id:'c2',titulo:'Reducción y números maestros',dur:'15 min',tipo:'video',preview:false},{id:'c3',titulo:'Tu fecha como punto de partida',dur:'12 min',tipo:'video',preview:false}] },
      { id:'m2', titulo:'Tus números', clases:[{id:'c4',titulo:'Camino de vida',dur:'20 min',tipo:'video',preview:false},{id:'c5',titulo:'Número de expresión y alma',dur:'18 min',tipo:'video',preview:false},{id:'c6',titulo:'Compatibilidades',dur:'14 min',tipo:'lectura',preview:false}] },
      { id:'m3', titulo:'En movimiento', clases:[{id:'c7',titulo:'El año personal',dur:'16 min',tipo:'video',preview:false},{id:'c8',titulo:'Cómo usarlo en tu día a día',dur:'13 min',tipo:'video',preview:false}] }
    ]
  },
  {
    id: 3, slug: 'reiki-nivel-1', titulo: 'Reiki nivel 1', subtitulo: 'Iniciación a la energía y la autosanación',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 42900, descuento: 0, duracion: '6 h', destacado: true, nuevo: false,
    portada: 'images/c3-reiki.jpg', color: 'reiki',
    resumen: 'Una iniciación clara al Reiki como práctica de relajación, equilibrio y conexión con la energía propia.',
    descripcion: 'Un primer nivel para acercarte al Reiki como práctica de bienestar y relajación. Aprendé las posiciones de manos, la autoaplicación y cómo sostener una práctica diaria. El Reiki acompaña el bienestar; no reemplaza la atención médica.',
    aprendes: ['Las posiciones básicas de manos', 'La autoaplicación diaria', 'Cómo preparar una sesión de relajación'],
    incluye: ['10 clases grabadas', 'Guía de posiciones', 'Acceso de por vida (demo)'],
    modulos: [
      { id:'m1', titulo:'Fundamentos', clases:[{id:'c1',titulo:'Qué es el Reiki',dur:'15 min',tipo:'video',preview:true},{id:'c2',titulo:'Los cinco principios',dur:'14 min',tipo:'video',preview:false},{id:'c3',titulo:'Energía y bienestar (sin promesas médicas)',dur:'12 min',tipo:'lectura',preview:false}] },
      { id:'m2', titulo:'La práctica', clases:[{id:'c4',titulo:'Posiciones de manos',dur:'24 min',tipo:'video',preview:false},{id:'c5',titulo:'Autoaplicación',dur:'22 min',tipo:'video',preview:false},{id:'c6',titulo:'Respiración y presencia',dur:'16 min',tipo:'video',preview:false}] },
      { id:'m3', titulo:'Sostener el hábito', clases:[{id:'c7',titulo:'Tu rutina diaria',dur:'15 min',tipo:'video',preview:false},{id:'c8',titulo:'Preparar el espacio',dur:'13 min',tipo:'video',preview:false},{id:'c9',titulo:'Cierre e integración',dur:'14 min',tipo:'video',preview:false}] }
    ]
  },
  {
    id: 4, slug: 'limpiezas-energeticas-del-hogar', titulo: 'Limpiezas energéticas del hogar', subtitulo: 'Rituales simples para tu espacio',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 19900, descuento: 10, duracion: '3 h', destacado: false, nuevo: false,
    portada: 'images/c4-limpiezas.jpg', color: 'limpieza',
    resumen: 'Aprendé rituales sencillos y seguros para despejar y armonizar la energía de tu casa.',
    descripcion: 'Un curso breve y práctico para armonizar tu hogar con rituales simples: sahumado responsable, sales, aguas y pequeñas rutinas de despeje. Con foco en la intención y el cuidado, más que en la superstición.',
    aprendes: ['Sahumar tu casa de forma segura', 'Preparar aguas y sales de despeje', 'Crear una rutina de armonización'],
    incluye: ['6 clases grabadas', 'Calendario de rituales', 'Acceso de por vida (demo)'],
    modulos: [
      { id:'m1', titulo:'Preparar el terreno', clases:[{id:'c1',titulo:'Por qué limpiar el espacio',dur:'12 min',tipo:'video',preview:true},{id:'c2',titulo:'Materiales y seguridad',dur:'13 min',tipo:'video',preview:false}] },
      { id:'m2', titulo:'Los rituales', clases:[{id:'c3',titulo:'Sahumado responsable',dur:'16 min',tipo:'video',preview:false},{id:'c4',titulo:'Aguas y sales',dur:'15 min',tipo:'video',preview:false},{id:'c5',titulo:'Despeje rápido diario',dur:'11 min',tipo:'lectura',preview:false}] },
      { id:'m3', titulo:'Sostener la energía', clases:[{id:'c6',titulo:'Tu calendario de armonización',dur:'12 min',tipo:'video',preview:false}] }
    ]
  }
];
