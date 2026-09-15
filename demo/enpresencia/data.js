/* En Presencia — formación en reseteo mental y presencia
   Datos demostrativos. Contenido educativo de desarrollo personal:
   NO es terapia ni tratamiento de salud mental. */

const WHATSAPP = '5492257524107';
const INSTAGRAM = 'https://www.instagram.com/lonelina74';

/* Facilitadores: perfiles demostrativos. Reemplazar por los datos reales. */
const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Camila Duarte',
    rol: 'Facilitadora en atención y presencia',
    eje: 'Presencia',
    bio: 'Acompaña procesos de foco y presencia desde la práctica, no desde la promesa. Trabaja con ejercicios simples y sostenibles para el día a día.',
    foto: 'images/facilitador-camila-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd2',
    nombre: 'Marcos Vidal',
    rol: 'Coach de rendimiento mental',
    eje: 'Mente',
    bio: 'Ayuda a ordenar el diálogo interno y a decidir con más claridad. Sus clases bajan la teoría a rutinas concretas que se pueden sostener.',
    foto: 'images/facilitador-marcos-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  }
];

function mod(id, titulo, clases) { return { id, titulo, clases }; }
function cl(id, titulo, duracion, tipo, preview) { return { id, titulo, duracion, tipo, preview: !!preview }; }

const CURSOS = [
  {
    id: 'c1', slug: 'reseteo-mental',
    titulo: 'Reseteo mental: 21 días para volver a foco',
    categoria: 'Presencia', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 34900, descuento: 15, duracion: '6 horas', cantidadClases: 9,
    descripcionCorta: 'Bajá el ruido mental y recuperá tu foco con un plan simple de 21 días, sin misticismo ni promesas mágicas.',
    descripcionCompleta: 'Cuando la cabeza no para, todo cuesta más. Este curso te da un método claro para cortar con el piloto automático, ordenar tu atención y armar una rutina de reseteo que puedas sostener. Es un proceso de práctica personal, no un tratamiento de salud.',
    resultados: ['Reconocer tus disparadores de ruido mental', 'Incorporar micro-pausas de reseteo en tu día', 'Sostener una rutina de foco de 21 días'],
    requisitos: ['No necesitás experiencia previa', 'Ganas de probar cambios chicos y constantes'],
    incluye: ['9 clases grabadas', 'Audios de práctica guiada', 'Certificado de finalización de En Presencia', 'Acceso sin vencimiento'],
    etiquetas: ['reseteo', 'foco', 'atención', 'rutina', 'claridad'],
    docenteId: 'd1', portada: 'images/curso-reseteo-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c1m1', 'El ruido y el piloto automático', [
        cl('c1m1l1', 'Qué es (y qué no es) resetear la mente', '12 min', 'video', true),
        cl('c1m1l2', 'Tus disparadores de dispersión', '15 min', 'video', false),
        cl('c1m1l3', 'Ejercicio: tu mapa de ruido', '9 min', 'lectura', false)
      ]),
      mod('c1m2', 'Micro-pausas de reseteo', [
        cl('c1m2l1', 'La pausa de 90 segundos', '13 min', 'audio', false),
        cl('c1m2l2', 'Volver al presente sin forzar', '14 min', 'video', false),
        cl('c1m2l3', 'Guía: 3 pausas para tu día', '7 min', 'pdf', false)
      ]),
      mod('c1m3', 'Tu rutina de 21 días', [
        cl('c1m3l1', 'Diseñar una rutina que se sostenga', '16 min', 'video', false),
        cl('c1m3l2', 'Cuando la rutina se cae', '12 min', 'audio', false),
        cl('c1m3l3', 'Cierre: tu plan de reseteo', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c2', slug: 'presencia-plena',
    titulo: 'Presencia plena en el día a día',
    categoria: 'Presencia', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 31900, descuento: 0, duracion: '5 horas', cantidadClases: 9,
    descripcionCorta: 'Entrená la atención para estar más presente en lo que hacés, sin vivir en la cabeza ni en el celular.',
    descripcionCompleta: 'Estar presente es una habilidad que se entrena. Aprendés a sostener la atención, a registrar cuándo te vas y a volver una y otra vez, con prácticas cortas y laicas que podés hacer en cualquier momento del día.',
    resultados: ['Sostener la atención por más tiempo', 'Registrar cuándo te distraés y volver', 'Estar más presente en tus vínculos y tu trabajo'],
    requisitos: ['No necesitás experiencia previa', 'Un lugar tranquilo, aunque sean 5 minutos'],
    incluye: ['9 clases grabadas', 'Audios de práctica guiada', 'Certificado de finalización de En Presencia', 'Acceso sin vencimiento'],
    etiquetas: ['presencia', 'atención plena', 'foco', 'calma', 'hábitos'],
    docenteId: 'd1', portada: 'images/curso-presencia-1600x1200.jpg', trailer: null, destacado: false, nuevo: true,
    modulos: [
      mod('c2m1', 'La atención se entrena', [
        cl('c2m1l1', 'Qué es la presencia (sin humo)', '11 min', 'video', true),
        cl('c2m1l2', 'El ancla de la respiración', '13 min', 'audio', false),
        cl('c2m1l3', 'Ejercicio: 3 anclas en tu día', '8 min', 'lectura', false)
      ]),
      mod('c2m2', 'Volver una y otra vez', [
        cl('c2m2l1', 'Presencia en movimiento', '14 min', 'audio', false),
        cl('c2m2l2', 'Registrar sin juzgarte', '15 min', 'video', false),
        cl('c2m2l3', 'Guía: práctica de 5 minutos', '7 min', 'pdf', false)
      ]),
      mod('c2m3', 'Presencia en lo cotidiano', [
        cl('c2m3l1', 'Comer, caminar y escuchar con atención', '14 min', 'audio', false),
        cl('c2m3l2', 'Presencia con otros', '13 min', 'video', false),
        cl('c2m3l3', 'Cierre: tu rutina de presencia', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c3', slug: 'juego-interior',
    titulo: 'El juego interior: tu diálogo y tus emociones',
    categoria: 'Mente', nivel: 'Intermedio', modalidad: 'Grabado',
    precio: 38900, descuento: 0, duracion: '7 horas', cantidadClases: 9,
    descripcionCorta: 'Reconocé tu diálogo interno y aprendé a regular tus emociones antes de reaccionar. Contenido educativo, no terapéutico.',
    descripcionCompleta: 'El juego más importante se juega adentro. Este curso te ayuda a observar tu diálogo interno, entender qué lo dispara y regular la reacción emocional con herramientas concretas. Es formación en desarrollo personal y no reemplaza un proceso terapéutico.',
    resultados: ['Observar tu diálogo interno sin creerle todo', 'Regular la reacción antes de que te maneje', 'Elegir tu respuesta en situaciones difíciles'],
    requisitos: ['Disposición para observarte con honestidad', 'Ideal haber hecho alguna práctica de atención'],
    incluye: ['9 clases grabadas', 'Diario de registro', 'Certificado de finalización de En Presencia', 'Acceso sin vencimiento'],
    etiquetas: ['emociones', 'diálogo interno', 'autoconocimiento', 'regulación', 'mente'],
    docenteId: 'd2', portada: 'images/curso-juego-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c3m1', 'Escuchar el diálogo interno', [
        cl('c3m1l1', 'La voz que te habla todo el día', '13 min', 'video', true),
        cl('c3m1l2', 'Pensamiento no es realidad', '16 min', 'video', false),
        cl('c3m1l3', 'Ejercicio: tu diario de 7 días', '8 min', 'lectura', false)
      ]),
      mod('c3m2', 'Regular sin reprimir', [
        cl('c3m2l1', 'La emoción como información', '15 min', 'video', false),
        cl('c3m2l2', 'La pausa entre estímulo y respuesta', '14 min', 'audio', false),
        cl('c3m2l3', 'Guía: frases para vos mismo', '7 min', 'pdf', false)
      ]),
      mod('c3m3', 'Elegir la respuesta', [
        cl('c3m3l1', 'Conversaciones que venís evitando', '16 min', 'video', false),
        cl('c3m3l2', 'Sostener sin explotar ni tragarte', '15 min', 'video', false),
        cl('c3m3l3', 'Cierre: tu protocolo personal', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c4', slug: 'claridad-bajo-presion',
    titulo: 'Claridad bajo presión: decidí mejor',
    categoria: 'Mente', nivel: 'Intermedio', modalidad: 'Híbrido',
    precio: 42900, descuento: 10, duracion: '6 horas', cantidadClases: 9,
    descripcionCorta: 'Pensá con claridad cuando más cuesta: decisiones, incertidumbre y presión, con la cabeza en su lugar.',
    descripcionCompleta: 'Bajo presión, la mente se nubla y decidimos peor. Aprendés a bajar la activación, ordenar el pensamiento y tomar decisiones con criterio, incluso cuando el tiempo apremia. Incluye un encuentro en vivo para practicar con casos reales.',
    resultados: ['Bajar la activación antes de decidir', 'Ordenar el pensamiento bajo presión', 'Tomar decisiones con un método simple'],
    requisitos: ['Situaciones reales donde te cueste decidir', 'Ganas de practicar, no solo escuchar'],
    incluye: ['9 clases (grabadas + un encuentro en vivo)', 'Plantilla de decisiones', 'Certificado de finalización de En Presencia', 'Acceso sin vencimiento'],
    etiquetas: ['claridad', 'decisiones', 'presión', 'foco', 'rendimiento'],
    docenteId: 'd2', portada: 'images/curso-claridad-1600x1200.jpg', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c4m1', 'La mente bajo presión', [
        cl('c4m1l1', 'Por qué decidimos peor bajo estrés', '13 min', 'video', true),
        cl('c4m1l2', 'Bajar la activación en el momento', '14 min', 'audio', false),
        cl('c4m1l3', 'Ejercicio: tu señal de alarma', '9 min', 'lectura', false)
      ]),
      mod('c4m2', 'Ordenar el pensamiento', [
        cl('c4m2l1', 'Separar hechos de interpretaciones', '16 min', 'video', false),
        cl('c4m2l2', 'Preguntas que aclaran', '15 min', 'video', false),
        cl('c4m2l3', 'Plantilla: mapa de decisión', '7 min', 'pdf', false)
      ]),
      mod('c4m3', 'Decidir con criterio', [
        cl('c4m3l1', 'Un método simple para decidir', '16 min', 'video', false),
        cl('c4m3l2', 'Decidir y soltar la duda', '13 min', 'audio', false),
        cl('c4m3l3', 'Cierre: tu caso real', '10 min', 'lectura', false)
      ])
    ]
  }
];

const BANNERS = [];
