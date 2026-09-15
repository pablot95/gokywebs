const WHATSAPP = '5493364363394';
const INSTAGRAM = 'https://www.instagram.com/lorenadellujan';
const MARCA = 'Estimulación Temprana';

const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Lorena del Luján',
    rol: 'Lic. en Educación Especial · Arteterapeuta · Estimuladora temprana',
    bio: 'Acompaña a familias con bebés y niños de 0 a 3 años en CABA y online. Su trabajo cruza la estimulación temprana con recursos de arteterapia y canciones terapéuticas: rituales cortos, materiales simples y un lenguaje sin tecnicismos para usar en casa, esa misma noche.',
    foto: null,
    inicial: 'L',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  }
];

function mod(id, titulo, clases) { return { id, titulo, clases }; }
function cl(id, titulo, duracion, tipo, preview) { return { id, titulo, duracion, tipo, preview: !!preview }; }

const CURSOS = [
  {
    id: 'c1', slug: 'dormir-mejor',
    titulo: 'Dormir mejor: rutina y canciones para las noches de 0 a 3',
    categoria: 'Sueño y rutinas', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 32900, descuento: 15, duracion: '4 h 20 min', cantidadClases: 12,
    descripcionCorta: 'Armá un ritual de sueño realista para tu casa, con canciones que le avisan al cuerpo que llegó la calma. Sin métodos de llanto ni horarios imposibles.',
    descripcionCompleta: 'La hora de dormir se vuelve la más difícil del día cuando cada noche se improvisa. Acá vas a armar un ritual corto y repetible, ajustado a la edad de tu hije y a los horarios reales de tu familia, apoyado en canciones y en señales sensoriales que anticipan el descanso. Es contenido educativo de crianza: no reemplaza el seguimiento de tu pediatra.',
    resultados: ['Diseñar un ritual de sueño de 15 minutos que puedas sostener', 'Usar tres canciones como señal de transición hacia la calma', 'Leer las señales de sueño antes de que aparezca el desborde'],
    requisitos: ['Tener un bebé o niñe de 0 a 3 años', 'Diez minutos por clase, aunque sea de a ratos'],
    incluye: ['12 clases grabadas', 'Audios de las tres nanas del ritual', 'Guía imprimible del ritual paso a paso', 'Acceso sin vencimiento'],
    etiquetas: ['sueño', 'nanas', 'rutina', 'noche', 'descanso', 'ritual'],
    docenteId: 'd1', portada: 'images/curso-sueno-1400x1050.webp', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c1m1', 'Antes del ritual: leer a tu bebé', [
        cl('c1m1l1', 'Señales de sueño que se ven antes del llanto', '14 min', 'video', true),
        cl('c1m1l2', 'Por qué falla la rutina que copiaste de internet', '12 min', 'video', false),
        cl('c1m1l3', 'Mapa: cómo duerme tu casa hoy', '8 min', 'lectura', false)
      ]),
      mod('c1m2', 'El ritual de 15 minutos', [
        cl('c1m2l1', 'Los cuatro pasos del ritual', '16 min', 'video', false),
        cl('c1m2l2', 'La luz, el sonido y la temperatura', '11 min', 'video', false),
        cl('c1m2l3', 'Guía imprimible del ritual', '6 min', 'pdf', false)
      ]),
      mod('c1m3', 'Las canciones de la noche', [
        cl('c1m3l1', 'Tres nanas y cuándo entra cada una', '18 min', 'audio', false),
        cl('c1m3l2', 'Cantar afinado no importa: importa el ritmo', '13 min', 'audio', false),
        cl('c1m3l3', 'Repertorio para transiciones difíciles', '15 min', 'audio', false)
      ]),
      mod('c1m4', 'Cuando la noche se complica', [
        cl('c1m4l1', 'Despertares, dientes y mudanzas de cuna', '17 min', 'video', false),
        cl('c1m4l2', 'Volver al ritual después de un viaje', '12 min', 'video', false),
        cl('c1m4l3', 'Cierre: tu plan de las próximas dos semanas', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c2', slug: 'nanas-que-calman',
    titulo: 'Nanas y canciones que calman: repertorio para el día a día',
    categoria: 'Música y calma', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 24900, descuento: 0, duracion: '3 h 10 min', cantidadClases: 9,
    descripcionCorta: 'Un repertorio de canciones para cambiar el pañal, salir de casa, comer y volver a la calma. Música con función, no de fondo.',
    descripcionCompleta: 'Cada momento difícil del día puede tener su canción: la del cambiador, la de guardar los juguetes, la de la vuelta a casa. En este curso armás tu propio repertorio y aprendés a usar tempo, volumen y repetición como herramientas de regulación. Contenido educativo, sin promesas mágicas.',
    resultados: ['Tener una canción propia para cada transición del día', 'Bajar el tempo y la intensidad para acompañar un desborde', 'Sumar percusión simple con objetos de tu casa'],
    requisitos: ['No hace falta saber música ni tocar ningún instrumento', 'Ganas de cantar aunque desafines'],
    incluye: ['9 clases grabadas', 'Audios descargables del repertorio', 'Fichas de letras para imprimir', 'Acceso sin vencimiento'],
    etiquetas: ['canciones', 'música', 'nanas', 'transiciones', 'calma', 'ritmo'],
    docenteId: 'd1', portada: 'images/curso-canciones-1400x1050.webp', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c2m1', 'La voz como herramienta', [
        cl('c2m1l1', 'Qué hace una canción en el cuerpo de un bebé', '13 min', 'video', true),
        cl('c2m1l2', 'Tempo, volumen y repetición', '15 min', 'audio', false),
        cl('c2m1l3', 'Ejercicio: grabá tu voz una vez', '7 min', 'lectura', false)
      ]),
      mod('c2m2', 'Una canción para cada momento', [
        cl('c2m2l1', 'Cambiador, comida y salida de casa', '16 min', 'audio', false),
        cl('c2m2l2', 'La canción de guardar', '12 min', 'audio', false),
        cl('c2m2l3', 'Fichas de letras del repertorio', '6 min', 'pdf', false)
      ]),
      mod('c2m3', 'Percusión con lo que hay en casa', [
        cl('c2m3l1', 'Instrumentos con frascos, tapas y cucharas', '14 min', 'video', false),
        cl('c2m3l2', 'Jugar con silencios y sorpresas', '13 min', 'video', false),
        cl('c2m3l3', 'Cierre: tu repertorio de la semana', '8 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c3', slug: 'manos-que-pintan',
    titulo: 'Manos que pintan: arteterapia para primeras infancias',
    categoria: 'Arte y emoción', nivel: 'Intermedio', modalidad: 'Grabado',
    precio: 34900, descuento: 0, duracion: '5 h', cantidadClases: 12,
    descripcionCorta: 'Propuestas de arte sensorial para acompañar lo que tu hije todavía no puede decir con palabras. Con materiales seguros y poco lío.',
    descripcionCompleta: 'Antes de las palabras está el trazo, la mancha y la textura. Este curso baja recursos de arteterapia a la escala de una casa con bebés: qué materiales son seguros, cómo armar el espacio, cómo mirar lo que aparece sin interpretarlo de más y cómo cerrar la actividad. Es una propuesta educativa y expresiva, no un tratamiento terapéutico.',
    resultados: ['Armar una propuesta de arte sensorial por semana', 'Elegir materiales seguros según la edad', 'Acompañar la expresión sin corregir ni dirigir el resultado'],
    requisitos: ['Tener un espacio que se pueda ensuciar un rato', 'Idealmente haber hecho alguna propuesta de juego libre'],
    incluye: ['12 clases grabadas', 'Recetario de materiales caseros seguros', 'Guía de 10 propuestas por edad', 'Acceso sin vencimiento'],
    etiquetas: ['arteterapia', 'pintura', 'sensorial', 'expresión', 'texturas', 'juego'],
    docenteId: 'd1', portada: 'images/curso-arte-1400x1050.webp', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c3m1', 'El arte antes de las palabras', [
        cl('c3m1l1', 'Qué expresa un bebé cuando mancha', '15 min', 'video', true),
        cl('c3m1l2', 'Mirar sin interpretar de más', '14 min', 'video', false),
        cl('c3m1l3', 'Registro: qué aparece cada semana', '8 min', 'lectura', false)
      ]),
      mod('c3m2', 'Materiales y espacio', [
        cl('c3m2l1', 'Pinturas caseras y seguras por edad', '16 min', 'video', false),
        cl('c3m2l2', 'Armar el espacio en diez minutos', '12 min', 'video', false),
        cl('c3m2l3', 'Recetario de materiales caseros', '7 min', 'pdf', false)
      ]),
      mod('c3m3', 'Diez propuestas para hacer', [
        cl('c3m3l1', 'Manchas, huellas y sellos', '18 min', 'video', false),
        cl('c3m3l2', 'Texturas: harina, gelatina y papel', '17 min', 'video', false),
        cl('c3m3l3', 'Guía imprimible de las 10 propuestas', '6 min', 'pdf', false)
      ]),
      mod('c3m4', 'Cerrar la experiencia', [
        cl('c3m4l1', 'Cómo termina una propuesta sin llanto', '13 min', 'video', false),
        cl('c3m4l2', 'Qué hacemos con lo que se produjo', '12 min', 'audio', false),
        cl('c3m4l3', 'Cierre: tu calendario de propuestas', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c4', slug: 'jugar-para-crecer',
    titulo: 'Jugar para crecer: estimulación mes a mes de 0 a 18',
    categoria: 'Juego y estimulación', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 38900, descuento: 10, duracion: '6 h 15 min', cantidadClases: 15,
    descripcionCorta: 'Qué proponerle a tu bebé en cada etapa, con juegos de dos minutos y objetos que ya tenés en casa. Sin comprar nada.',
    descripcionCompleta: 'Un recorrido mes a mes por el primer año y medio: qué está desarrollando tu bebé en cada tramo y qué juego simple lo acompaña. Cada clase termina con una propuesta concreta de dos minutos. La estimulación no es una agenda de actividades: es mirar, esperar y responder. Este material es orientativo y no reemplaza los controles de salud ni una evaluación profesional.',
    resultados: ['Reconocer qué está desarrollando tu bebé en cada etapa', 'Tener tres juegos listos para cada tramo de edad', 'Armar un rincón de juego con lo que ya tenés'],
    requisitos: ['Tener un bebé de 0 a 18 meses (o estar por tenerlo)', 'Un rato de piso por día'],
    incluye: ['15 clases grabadas', 'Calendario de juegos mes a mes', 'Lista de objetos seguros por edad', 'Acceso sin vencimiento'],
    etiquetas: ['estimulación', 'juego', 'motricidad', 'primer año', 'desarrollo', 'piso'],
    docenteId: 'd1', portada: 'images/curso-juego-1400x1050.webp', trailer: null, destacado: false, nuevo: true,
    modulos: [
      mod('c4m1', 'De 0 a 3 meses', [
        cl('c4m1l1', 'Mirada, voz y contacto', '13 min', 'video', true),
        cl('c4m1l2', 'Boca abajo sin llanto', '14 min', 'video', false),
        cl('c4m1l3', 'Tres juegos de dos minutos', '7 min', 'lectura', false)
      ]),
      mod('c4m2', 'De 4 a 6 meses', [
        cl('c4m2l1', 'Manos que agarran y sueltan', '15 min', 'video', false),
        cl('c4m2l2', 'Rodar y descubrir el propio cuerpo', '13 min', 'video', false),
        cl('c4m2l3', 'Objetos seguros de esta etapa', '6 min', 'pdf', false)
      ]),
      mod('c4m3', 'De 7 a 9 meses', [
        cl('c4m3l1', 'Sentarse, alcanzar y perseguir', '16 min', 'video', false),
        cl('c4m3l2', 'El juego de aparecer y desaparecer', '12 min', 'video', false),
        cl('c4m3l3', 'Tres juegos de dos minutos', '7 min', 'lectura', false)
      ]),
      mod('c4m4', 'De 10 a 12 meses', [
        cl('c4m4l1', 'Gatear, trepar y ponerse de pie', '17 min', 'video', false),
        cl('c4m4l2', 'Primeras palabras y señalar', '14 min', 'audio', false),
        cl('c4m4l3', 'Calendario de juegos del primer año', '6 min', 'pdf', false)
      ]),
      mod('c4m5', 'De 13 a 18 meses', [
        cl('c4m5l1', 'Caminar, encastrar y apilar', '16 min', 'video', false),
        cl('c4m5l2', 'El rincón de juego que se ordena solo', '13 min', 'video', false),
        cl('c4m5l3', 'Cierre: tu semana de juego', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c5', slug: 'berrinches-sin-gritos',
    titulo: 'Berrinches sin gritos: acompañar emociones grandes',
    categoria: 'Arte y emoción', nivel: 'Inicial', modalidad: 'En vivo',
    precio: 29900, descuento: 0, duracion: '3 h 40 min', cantidadClases: 9,
    descripcionCorta: 'Qué pasa en el cuerpo de un niñe de 2 años cuando estalla, y qué podés hacer vos para no estallar también. Con encuentro en vivo.',
    descripcionCompleta: 'El berrinche no es un desafío a tu autoridad: es un sistema nervioso chiquito desbordado. En este curso vas a entender qué está pasando, qué frases ayudan y cuáles empujan, y cómo sostener el límite sin gritos. Incluye un encuentro en vivo para trabajar situaciones reales que traigan las familias. Es formación en crianza, no terapia ni orientación clínica individual.',
    resultados: ['Reconocer la escalada antes del estallido', 'Sostener un límite con calma y sin gritos', 'Recuperarte vos después de un episodio difícil'],
    requisitos: ['Tener un niñe de 18 meses a 3 años (o casi)', 'Disposición a mirar también tus propias reacciones'],
    incluye: ['9 clases grabadas', 'Un encuentro en vivo con casos reales', 'Fichas de frases que ayudan', 'Grabación del encuentro'],
    etiquetas: ['berrinches', 'emociones', 'límites', 'regulación', 'calma', 'crianza'],
    docenteId: 'd1', portada: 'images/curso-emociones-1400x1050.webp', trailer: null, destacado: false, nuevo: true,
    modulos: [
      mod('c5m1', 'Qué es un berrinche', [
        cl('c5m1l1', 'El cerebro de 2 años, sin tecnicismos', '14 min', 'video', true),
        cl('c5m1l2', 'La escalada: lo que pasa antes del estallido', '15 min', 'video', false),
        cl('c5m1l3', 'Registro: tus tres situaciones más difíciles', '8 min', 'lectura', false)
      ]),
      mod('c5m2', 'Qué hacer en el momento', [
        cl('c5m2l1', 'Frases que ayudan y frases que empujan', '16 min', 'video', false),
        cl('c5m2l2', 'El límite sostenido con calma', '15 min', 'video', false),
        cl('c5m2l3', 'Fichas de frases para tener a mano', '6 min', 'pdf', false)
      ]),
      mod('c5m3', 'Después del episodio', [
        cl('c5m3l1', 'Reparar el vínculo sin culpa', '14 min', 'video', false),
        cl('c5m3l2', 'Tu propia regulación primero', '13 min', 'audio', false),
        cl('c5m3l3', 'Encuentro en vivo: casos reales', '25 min', 'video', false)
      ])
    ]
  }
];

const ASESORIAS = [
  {
    id: 'a1',
    titulo: 'Consulta de crianza',
    duracion: '50 minutos por videollamada',
    detalle: 'Un encuentro para ordenar una situación puntual: sueño, alimentación, berrinches, pantallas o adaptación al jardín. Salís con un plan escrito de dos semanas.',
    incluye: ['Encuentro por videollamada', 'Plan escrito de dos semanas', 'Una consulta de seguimiento por WhatsApp']
  },
  {
    id: 'a2',
    titulo: 'Acompañamiento de un mes',
    duracion: '3 encuentros + mensajes',
    detalle: 'Para procesos que necesitan sostén: destete, mudanza de cuna, llegada de un hermanito o vuelta al trabajo. Ajustamos el plan semana a semana.',
    incluye: ['3 encuentros por videollamada', 'Mensajes durante el mes', 'Material de arteterapia y canciones seleccionado para tu caso']
  }
];

const BANNERS = [];
