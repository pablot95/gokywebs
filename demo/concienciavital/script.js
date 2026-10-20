const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5492234385890';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const ICONS = {
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  house: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M12 17.5s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.8-3 3.6-3 3.6z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  stethoscope: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  chat: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  team: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.6 7.3 6.4 15.7M13.4 7.3l4.2 8.4M7.5 18h9"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  video: '<path d="m16 13 5.22 3.13a.5.5 0 0 0 .78-.41V8.28a.5.5 0 0 0-.78-.41L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  mixta: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  pencil: '<path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'
};
const ico = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const AREAS = [
  { id: 'mayores', nombre: 'Cuidado de personas mayores', icono: 'users' },
  { id: 'domiciliarios', nombre: 'Cuidadores domiciliarios', icono: 'house' },
  { id: 'autocuidado', nombre: 'Autocuidado', icono: 'leaf' },
  { id: 'prevencion', nombre: 'Prevención y promoción de la salud', icono: 'shield' },
  { id: 'enfermeria', nombre: 'Enfermería', icono: 'stethoscope' },
  { id: 'comunicacion', nombre: 'Comunicación', icono: 'chat' },
  { id: 'equipo', nombre: 'Trabajo en equipo', icono: 'team' },
  { id: 'psicosocial', nombre: 'Abordaje psicosocial', icono: 'heart' },
  { id: 'bienestar', nombre: 'Bienestar', icono: 'sun' }
];
const getArea = id => AREAS.find(a => a.id === id);

const MODALIDADES = {
  vivo: { nombre: 'Virtual en vivo', icono: 'video' },
  presencial: { nombre: 'Presencial', icono: 'pin' },
  mixta: { nombre: 'Mixta', icono: 'mixta' },
  grabado: { nombre: 'Grabado', icono: 'play' }
};
const TIPOS = {
  vivo: { nombre: 'Encuentro en vivo', icono: 'video' },
  presencial: { nombre: 'Encuentro presencial', icono: 'pin' },
  video: { nombre: 'Clase grabada', icono: 'play' },
  lectura: { nombre: 'Lectura', icono: 'file' },
  pdf: { nombre: 'Material descargable', icono: 'download' },
  practica: { nombre: 'Actividad práctica', icono: 'pencil' }
};
const CERTIFICADOS = {
  participacion: 'Certificado de participación',
  finalizacion: 'Certificado de finalización'
};

const DOCENTES = [
  { id: 'd1', nombre: 'Dirección de Conciencia Vital', especialidad: 'Enfermería y psicología social', etiqueta: 'Coordinación', bio: 'Coordina el espacio y dicta los cursos de cuidados, enfermería y abordaje psicosocial: cuidar el cuerpo sin perder de vista la historia de cada persona.' },
  { id: 'd2', nombre: 'Profesional de kinesiología', especialidad: 'Kinesiología', etiqueta: 'Equipo invitado', bio: 'Dicta los talleres de movilización y prevención de caídas: postura, traslados seguros y ejercicios simples de equilibrio.' },
  { id: 'd3', nombre: 'Profesional de psicología', especialidad: 'Psicología', etiqueta: 'Equipo invitado', bio: 'Acompaña el curso de comunicación y la charla abierta: escucha, conversaciones difíciles y cuidado emocional de quienes cuidan.' },
  { id: 'd4', nombre: 'Profesional de trabajo social', especialidad: 'Trabajo social', etiqueta: 'Equipo invitado', bio: 'Trabaja la organización de los equipos de cuidado, el vínculo con las familias y los recursos de la comunidad.' }
];
const getDocente = id => DOCENTES.find(d => d.id === id);

const m = (titulo, clases) => ({ titulo, clases: clases.map(([t, min, tipo, preview]) => ({ titulo: t, duracion: min, tipo, preview: !!preview })) });

const CURSOS = [
  {
    id: 1, slug: 'cuidados-basicos-personas-mayores', titulo: 'Cuidados básicos de personas mayores', area: 'mayores', formato: 'Curso', modalidad: 'mixta', nivel: 'Inicial',
    precio: 78000, descuento: 0, duracion: '8 semanas', cantidadClases: 16, horas: 32, inicio: 'Inicia en noviembre', certificado: 'finalizacion', docenteId: 'd1',
    portada: 'cuidados.webp', destacado: true, nuevo: false, stock: 1,
    descripcionCorta: 'Lo esencial para acompañar el día a día de una persona mayor: higiene, alimentación, movilidad y señales de alerta, con práctica presencial.',
    paraQuien: 'Para cuidadores, familiares y estudiantes que empiezan. No hace falta experiencia previa. No reemplaza una formación profesional en enfermería.',
    resultados: ['Organizar una rutina de cuidado segura y respetuosa', 'Asistir en higiene, alimentación e hidratación', 'Acompañar la movilidad y prevenir caídas en casa', 'Reconocer señales de alerta y saber a quién avisar'],
    requisitos: ['Ser mayor de 18 años', 'Conexión a internet para las clases virtuales', 'Asistir a los encuentros prácticos en Mar del Plata'],
    incluye: ['8 encuentros en vivo y 8 prácticas presenciales', 'Grabación de las clases virtuales', 'Guía de cuidados en PDF', 'Certificado de finalización'],
    modulos: [
      m('Envejecer con dignidad', [['Cambios esperables en la vejez', 60, 'vivo', true], ['Autonomía, respeto y trato', 60, 'vivo'], ['El rol de quien cuida', 20, 'lectura']]),
      m('Cuidados de todos los días', [['Higiene y confort', 120, 'presencial'], ['Alimentación e hidratación', 60, 'vivo'], ['Descanso y sueño', 45, 'video']]),
      m('Movilidad y seguridad', [['Traslados sin riesgo para ambos', 120, 'presencial'], ['La casa sin obstáculos', 45, 'video'], ['Prevención de caídas', 60, 'vivo']]),
      m('Cuándo pedir ayuda', [['Señales de alerta', 60, 'vivo'], ['Comunicación con la familia y el equipo de salud', 45, 'vivo'], ['Actividad final integradora', 60, 'practica']])
    ]
  },
  {
    id: 2, slug: 'demencias-comprender-acompanar', titulo: 'Demencias: comprender y acompañar', area: 'mayores', formato: 'Curso', modalidad: 'grabado', nivel: 'Intermedio',
    precio: 38000, descuento: 0, duracion: '5 clases', cantidadClases: 5, horas: 6, inicio: 'Disponible ahora', certificado: 'finalizacion', docenteId: 'd1',
    portada: 'comunicacion.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Qué cambia en la memoria, la conducta y la comunicación, y cómo acompañar sin enfrentar: recursos prácticos para la casa.',
    paraQuien: 'Para familias y cuidadores que acompañan a una persona con deterioro cognitivo. No es un curso de diagnóstico.',
    resultados: ['Entender las etapas y los cambios más frecuentes', 'Responder con calma ante la desorientación o la irritabilidad', 'Adaptar la rutina y el ambiente de la casa', 'Cuidar tu propia energía en un acompañamiento largo'],
    requisitos: ['Ninguno: se cursa a tu ritmo desde el celular o la compu'],
    incluye: ['5 clases grabadas', 'Fichas descargables por clase', 'Cuestionario final', 'Certificado de finalización'],
    modulos: [
      m('Qué son las demencias', [['Memoria, orientación y lenguaje', 40, 'video', true], ['Etapas y cambios esperables', 35, 'video'], ['Mitos frecuentes', 15, 'lectura']]),
      m('Comunicarse cuando cuesta', [['Hablar simple, de a una idea', 35, 'video'], ['Qué hacer ante el enojo o la angustia', 40, 'video'], ['Frases que ayudan', 10, 'pdf']]),
      m('La casa como aliada', [['Rutinas que ordenan el día', 30, 'video'], ['Un ambiente seguro', 30, 'video'], ['Cuidar al que cuida', 40, 'video']])
    ]
  },
  {
    id: 3, slug: 'formacion-cuidadores-domiciliarios', titulo: 'Formación para cuidadores domiciliarios', area: 'domiciliarios', formato: 'Formación', modalidad: 'presencial', nivel: 'Inicial',
    precio: 135000, descuento: 0, duracion: '12 semanas', cantidadClases: 12, horas: 36, inicio: 'Inicia en marzo', certificado: 'finalizacion', docenteId: 'd1',
    portada: 'aula.webp', destacado: false, nuevo: true, stock: 1,
    descripcionCorta: 'Trayecto completo para trabajar o acompañar en domicilio: cuidados básicos, organización del día, comunicación con la familia y límites del rol.',
    paraQuien: 'Para quienes quieren desempeñarse como cuidadores en domicilios. Es una capacitación privada: no otorga matrícula ni habilitación profesional.',
    resultados: ['Planificar y registrar los cuidados de cada día', 'Asistir en higiene, alimentación y movilidad con técnica segura', 'Comunicar novedades a la familia con claridad', 'Conocer los límites del rol y cuándo derivar'],
    requisitos: ['Ser mayor de 18 años', 'Secundario completo o en curso (recomendado)', 'Asistencia mínima del 80 %'],
    incluye: ['12 encuentros presenciales en Mar del Plata', 'Prácticas guiadas', 'Cuadernillo de la cursada', 'Certificado de finalización'],
    modulos: [
      m('El trabajo en domicilio', [['El rol del cuidador y sus límites', 180, 'presencial', true], ['Ética, respeto y privacidad', 180, 'presencial'], ['Registro diario de cuidados', 180, 'presencial']]),
      m('Cuidados básicos', [['Higiene y confort en cama', 180, 'presencial'], ['Alimentación e hidratación', 180, 'presencial'], ['Movilización y traslados', 180, 'presencial']]),
      m('Prevención y alerta', [['Prevención de caídas y lesiones', 180, 'presencial'], ['Signos de alarma', 180, 'presencial'], ['Qué hacer en una urgencia: a quién llamar', 180, 'presencial']]),
      m('Vínculo y autocuidado', [['Comunicación con la familia', 180, 'presencial'], ['Manejo del estrés', 180, 'presencial'], ['Evaluación final práctica', 180, 'practica']])
    ]
  },
  {
    id: 4, slug: 'movilizacion-traslados-seguros', titulo: 'Movilización y traslados seguros', area: 'domiciliarios', formato: 'Taller', modalidad: 'presencial', nivel: 'Inicial',
    precio: 28000, descuento: 0, duracion: '2 encuentros', cantidadClases: 2, horas: 6, inicio: 'Próxima fecha: noviembre', certificado: 'participacion', docenteId: 'd2',
    portada: 'cuidados.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Taller práctico para mover, sentar y trasladar a una persona sin lastimarla ni lastimarte: postura, apoyos y uso de ayudas técnicas.',
    paraQuien: 'Para cuidadores y familiares que asisten a alguien con movilidad reducida.',
    resultados: ['Cuidar tu espalda con una postura correcta', 'Pasar de la cama a la silla de forma segura', 'Usar andador, silla de ruedas y barandas', 'Detectar cuándo hacen falta dos personas'],
    requisitos: ['Ser mayor de 18 años', 'Ropa cómoda'],
    incluye: ['2 encuentros prácticos de 3 h', 'Práctica supervisada', 'Ficha de ejercicios en PDF', 'Certificado de participación'],
    modulos: [
      m('Tu cuerpo primero', [['Postura y mecánica corporal', 60, 'presencial', true], ['Errores que lastiman la espalda', 30, 'presencial'], ['Entrada en calor', 20, 'practica']]),
      m('Cambios de posición', [['Girar y acomodar en la cama', 50, 'presencial'], ['De acostado a sentado', 40, 'presencial'], ['Práctica en parejas', 60, 'practica']]),
      m('Traslados', [['Cama, silla y baño', 60, 'presencial'], ['Ayudas técnicas', 40, 'presencial'], ['Cierre y consultas', 20, 'presencial']])
    ]
  },
  {
    id: 5, slug: 'autocuidado-para-quienes-cuidan', titulo: 'Autocuidado para quienes cuidan', area: 'autocuidado', formato: 'Curso', modalidad: 'vivo', nivel: 'Todos los niveles',
    precio: 32000, descuento: 0, duracion: '4 encuentros', cantidadClases: 4, horas: 6, inicio: 'Inicia en noviembre', certificado: 'participacion', docenteId: 'd1',
    portada: 'autocuidado.webp', destacado: true, nuevo: false, stock: 1,
    descripcionCorta: 'Un espacio para mirar cómo estás vos: cansancio, culpa, límites y pedido de ayuda, con herramientas simples para sostener el cuidado sin agotarte.',
    paraQuien: 'Para familiares, cuidadores y personal de salud. No es un espacio terapéutico: si necesitás acompañamiento psicológico, te orientamos.',
    resultados: ['Reconocer señales de agotamiento en vos', 'Poner límites sin culpa', 'Armar una red de apoyo posible', 'Sumar pausas reales a tu semana'],
    requisitos: ['Conexión a internet', 'Ganas de compartir, o solo de escuchar'],
    incluye: ['4 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Cuaderno de autocuidado en PDF', 'Certificado de participación'],
    modulos: [
      m('Cuidar cansa', [['Señales del desgaste', 90, 'vivo', true], ['Culpa y exigencia', 15, 'lectura'], ['Registro semanal', 10, 'pdf']]),
      m('Límites y red', [['Decir que no también es cuidar', 90, 'vivo'], ['Mapa de mi red de apoyo', 15, 'pdf'], ['Pedir ayuda sin vergüenza', 15, 'lectura']]),
      m('Pausas que sostienen', [['Respiración y pausas breves', 90, 'vivo'], ['El descanso posible', 90, 'vivo'], ['Plan personal de autocuidado', 20, 'pdf']])
    ]
  },
  {
    id: 6, slug: 'prevencion-de-caidas-en-el-hogar', titulo: 'Prevención de caídas en el hogar', area: 'prevencion', formato: 'Curso', modalidad: 'grabado', nivel: 'Inicial',
    precio: 18000, descuento: 0, duracion: '4 clases', cantidadClases: 4, horas: 3, inicio: 'Disponible ahora', certificado: 'finalizacion', docenteId: 'd2',
    portada: 'prevencion.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Cómo revisar la casa, el calzado y la rutina para reducir el riesgo de caídas en personas mayores, y qué hacer si una caída ocurre.',
    paraQuien: 'Para familias y cuidadores. Ideal como primer curso.',
    resultados: ['Detectar riesgos en cada ambiente de la casa', 'Elegir calzado, luz y apoyos adecuados', 'Sumar ejercicios simples de equilibrio a la rutina', 'Actuar con calma si la persona se cae'],
    requisitos: ['Ninguno'],
    incluye: ['4 clases grabadas', 'Lista de chequeo de la casa en PDF', 'Cuestionario final', 'Certificado de finalización'],
    modulos: [
      m('Por qué nos caemos', [['Factores de riesgo', 25, 'video', true], ['Medicación, vista y descanso', 20, 'video'], ['Mitos sobre las caídas', 10, 'lectura']]),
      m('La casa segura', [['Recorrido por los ambientes', 35, 'video'], ['Baño y dormitorio', 25, 'video'], ['Lista de chequeo', 5, 'pdf']]),
      m('Si pasa', [['Cómo ayudar a levantarse, y cuándo no', 30, 'video'], ['A quién avisar', 15, 'video'], ['Cuestionario final', 15, 'practica']])
    ]
  },
  {
    id: 7, slug: 'higiene-y-confort-persona-en-cama', titulo: 'Higiene y confort de la persona en cama', area: 'enfermeria', formato: 'Taller', modalidad: 'presencial', nivel: 'Inicial',
    precio: 26000, descuento: 0, duracion: '2 encuentros', cantidadClases: 2, horas: 6, inicio: 'Próxima fecha: diciembre', certificado: 'participacion', docenteId: 'd1',
    portada: 'cuidados.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Técnicas de enfermería básica para el baño en cama, el cambio de ropa de cama ocupada y el cuidado de la piel, con práctica guiada.',
    paraQuien: 'Para cuidadores, familiares y estudiantes. Se practica con maniquí y entre participantes.',
    resultados: ['Realizar el baño en cama respetando la intimidad', 'Cambiar la ropa de cama con la persona acostada', 'Cuidar la piel y prevenir lastimaduras por presión', 'Preparar los materiales antes de empezar'],
    requisitos: ['Ser mayor de 18 años', 'Ropa cómoda'],
    incluye: ['2 encuentros prácticos de 3 h', 'Materiales para la práctica', 'Ficha paso a paso en PDF', 'Certificado de participación'],
    modulos: [
      m('Antes de empezar', [['Higiene de manos y materiales', 40, 'presencial', true], ['Intimidad y trato', 30, 'presencial'], ['Organizar el espacio', 20, 'presencial']]),
      m('Baño y cama', [['Baño en cama paso a paso', 60, 'presencial'], ['Cama ocupada', 50, 'presencial'], ['Práctica guiada', 60, 'practica']]),
      m('La piel', [['Zonas de presión', 30, 'presencial'], ['Cambios de posición', 30, 'presencial'], ['Ficha paso a paso', 10, 'pdf']])
    ]
  },
  {
    id: 8, slug: 'signos-vitales-nociones-basicas', titulo: 'Control de signos vitales: nociones básicas', area: 'enfermeria', formato: 'Curso', modalidad: 'mixta', nivel: 'Inicial',
    precio: 36000, descuento: 0, duracion: '4 clases', cantidadClases: 4, horas: 8, inicio: 'Inicia en noviembre', certificado: 'finalizacion', docenteId: 'd1',
    portada: 'prevencion.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Cómo tomar y registrar presión, pulso, temperatura y respiración, qué valores conviene consultar y cómo comunicarlos al equipo de salud.',
    paraQuien: 'Para cuidadores, familiares y estudiantes. No habilita a indicar tratamientos ni reemplaza la consulta médica.',
    resultados: ['Usar bien un tensiómetro digital y un termómetro', 'Contar el pulso y la respiración', 'Llevar un registro claro', 'Saber cuándo un valor es motivo de consulta'],
    requisitos: ['Tener un tensiómetro digital para practicar (opcional)'],
    incluye: ['2 clases en vivo y 2 prácticas presenciales', 'Planilla de registro descargable', 'Evaluación práctica', 'Certificado de finalización'],
    modulos: [
      m('Qué miramos y por qué', [['Los signos vitales', 60, 'vivo', true], ['Cuándo medir', 15, 'lectura'], ['Planilla de registro', 5, 'pdf']]),
      m('Práctica de medición', [['Presión arterial', 120, 'presencial'], ['Pulso y respiración', 60, 'presencial'], ['Temperatura', 30, 'presencial']]),
      m('Comunicar', [['Valores para consultar', 60, 'vivo'], ['Cómo avisar al equipo de salud', 30, 'vivo'], ['Evaluación práctica', 60, 'practica']])
    ]
  },
  {
    id: 9, slug: 'comunicacion-y-bienestar-en-el-cuidado', titulo: 'Comunicación y bienestar en el cuidado', area: 'comunicacion', formato: 'Curso', modalidad: 'vivo', nivel: 'Todos los niveles',
    precio: 48000, descuento: 0, duracion: '6 encuentros', cantidadClases: 6, horas: 9, inicio: 'Inicia en noviembre', certificado: 'finalizacion', docenteId: 'd3',
    portada: 'comunicacion.webp', destacado: true, nuevo: false, stock: 1,
    descripcionCorta: 'Herramientas para hablar con la persona cuidada, con su familia y con el equipo: escucha, preguntas, malas noticias y conversaciones difíciles.',
    paraQuien: 'Para cuidadores, personal de enfermería, estudiantes y familias.',
    resultados: ['Escuchar sin interrumpir ni juzgar', 'Explicar con palabras simples', 'Atravesar conversaciones difíciles con la familia', 'Cuidar el clima de trabajo'],
    requisitos: ['Conexión a internet', 'Asistencia al 75 % de los encuentros para el certificado'],
    incluye: ['6 encuentros en vivo', 'Grabaciones', 'Ejercicios de role-play', 'Certificado de finalización'],
    modulos: [
      m('Escuchar', [['Escucha activa', 90, 'vivo', true], ['Lo que no se dice', 15, 'lectura'], ['Ejercicio de registro', 10, 'pdf']]),
      m('Hablar claro', [['Palabras simples', 90, 'vivo'], ['Preguntas que abren', 90, 'vivo'], ['Guía de frases', 10, 'pdf']]),
      m('Conversaciones difíciles', [['Malas noticias y enojo', 90, 'vivo'], ['Familias en desacuerdo', 90, 'vivo'], ['Role-play final', 90, 'vivo']])
    ]
  },
  {
    id: 10, slug: 'trabajo-en-equipo-cuidado-domiciliario', titulo: 'Trabajo en equipo en el cuidado domiciliario', area: 'equipo', formato: 'Curso', modalidad: 'vivo', nivel: 'Intermedio',
    precio: 24000, descuento: 0, duracion: '3 encuentros', cantidadClases: 3, horas: 4.5, inicio: 'Inicia en diciembre', certificado: 'participacion', docenteId: 'd4',
    portada: 'aula.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Cómo coordinar turnos, pases de guardia y roles entre cuidadores, familia y profesionales para que nadie quede solo ni se pisen tareas.',
    paraQuien: 'Para equipos de cuidadores, personal de enfermería y quienes coordinan cuidados en domicilio.',
    resultados: ['Hacer un pase de guardia ordenado', 'Repartir tareas y responsabilidades', 'Resolver diferencias sin romper el equipo', 'Registrar y compartir la información clave'],
    requisitos: ['Experiencia en cuidado (recomendada)'],
    incluye: ['3 encuentros en vivo', 'Plantilla de pase de guardia', 'Grabaciones', 'Certificado de participación'],
    modulos: [
      m('Roles', [['Quién hace qué', 45, 'vivo', true], ['Acuerdos del equipo', 45, 'vivo'], ['Roles en domicilio', 15, 'lectura']]),
      m('La información que circula', [['El pase de guardia', 45, 'vivo'], ['Registro compartido', 45, 'vivo'], ['Plantilla de pase', 5, 'pdf']]),
      m('Cuando hay tensión', [['Diferencias y conflictos', 45, 'vivo'], ['Cuidar el clima', 45, 'vivo'], ['Caso integrador', 30, 'practica']])
    ]
  },
  {
    id: 11, slug: 'abordaje-psicosocial-persona-mayor', titulo: 'Abordaje psicosocial de la persona mayor', area: 'psicosocial', formato: 'Curso', modalidad: 'vivo', nivel: 'Intermedio',
    precio: 52000, descuento: 0, duracion: '6 encuentros', cantidadClases: 6, horas: 9, inicio: 'Inicia en noviembre', certificado: 'finalizacion', docenteId: 'd1',
    portada: 'comunicacion.webp', destacado: false, nuevo: false, stock: 1,
    descripcionCorta: 'Mirar a la persona mayor más allá de lo físico: su historia, sus vínculos, la soledad, los duelos y el lugar que ocupa en su familia y su barrio.',
    paraQuien: 'Para cuidadores, personal de salud, estudiantes y familias que buscan un acompañamiento integral.',
    resultados: ['Usar la historia de vida como herramienta de cuidado', 'Reconocer soledad, aislamiento y duelos', 'Promover vínculos y actividades con sentido', 'Trabajar junto a la familia y la comunidad'],
    requisitos: ['Conexión a internet'],
    incluye: ['6 encuentros en vivo', 'Grabaciones', 'Bibliografía y materiales', 'Certificado de finalización'],
    modulos: [
      m('La persona y su historia', [['Envejecer hoy', 90, 'vivo', true], ['La historia de vida', 90, 'vivo'], ['Vejez y derechos', 20, 'lectura']]),
      m('Vínculos', [['Soledad y aislamiento', 90, 'vivo'], ['Duelos y pérdidas', 90, 'vivo'], ['Señales de aislamiento', 10, 'pdf']]),
      m('Red y comunidad', [['Familia y cuidado', 90, 'vivo'], ['Actividades con sentido', 90, 'vivo'], ['Trabajo final', 30, 'practica']])
    ]
  },
  {
    id: 12, slug: 'charla-cuidar-sin-desgastarse', titulo: 'Cuidar sin desgastarse: charla abierta', area: 'bienestar', formato: 'Charla', modalidad: 'vivo', nivel: 'Todos los niveles',
    precio: 0, descuento: 0, duracion: '1 encuentro', cantidadClases: 1, horas: 1.5, inicio: 'Próxima fecha: noviembre', certificado: 'participacion', docenteId: 'd3',
    portada: 'autocuidado.webp', destacado: false, nuevo: true, stock: 1,
    descripcionCorta: 'Charla abierta y gratuita para conocer el espacio: cómo el cansancio de cuidar afecta el cuerpo y el ánimo, y qué pequeños cambios ayudan.',
    paraQuien: 'Para cualquier persona que cuide a otra o quiera empezar a cuidarse.',
    resultados: ['Entender por qué cuidar cansa', 'Llevarte tres hábitos simples para la semana', 'Conocer la propuesta de Conciencia Vital'],
    requisitos: ['Inscribirte para recibir el enlace'],
    incluye: ['Encuentro en vivo de 90 minutos', 'Espacio de preguntas', 'Certificado de participación'],
    modulos: [
      m('El cansancio del cuidado', [['Qué nos pasa cuando cuidamos', 30, 'vivo', true]]),
      m('Hábitos que ayudan', [['Tres cambios para esta semana', 30, 'vivo']]),
      m('Preguntas y cierre', [['Ronda de preguntas', 30, 'vivo']])
    ]
  }
];
const PRODUCTOS = CURSOS;

const RECURSOS = {
  articulos: [
    {
      id: 'a1', tag: 'Autocuidado', min: 4, titulo: 'Cinco señales de que quien cuida necesita una pausa',
      resumen: 'El cansancio de cuidar no avisa de golpe: aparece de a poco y se confunde con el ritmo normal de la semana.',
      cuerpo: ['Cuidar a otra persona todos los días desgasta, aunque se haga con amor. El cansancio no siempre avisa de golpe: aparece de a poco y se confunde con el ritmo normal de la semana.'],
      lista: ['El descanso no alcanza: dormís y te levantás con cansancio.', 'Te irritás por cosas que antes dejabas pasar.', 'Dejaste de ver gente o de hacer lo que te gustaba.', 'Sentís culpa cada vez que pensás en vos.', 'Aparecen dolores de cabeza o de espalda, o cambia tu apetito.'],
      cierre: 'Si te reconocés en varias, no es falta de voluntad: es una señal para pedir ayuda, repartir tareas y buscar un espacio propio. Si el malestar no cede, consultá con un profesional de salud.',
      cursoId: 5
    },
    {
      id: 'a2', tag: 'Prevención', min: 3, titulo: 'La casa sin obstáculos: una revisión en diez minutos',
      resumen: 'Antes de comprar nada, vale la pena recorrer los ambientes con otros ojos y sacar lo que hace tropezar.',
      cuerpo: ['Muchas de las caídas de personas mayores pasan dentro de casa. Antes de comprar nada, vale la pena recorrer los ambientes con otros ojos.'],
      lista: ['Sacá alfombras sueltas y cables del paso.', 'Sumá una luz de noche entre el dormitorio y el baño.', 'Dejá lo que se usa todos los días a la altura de la mano.', 'En el baño, una alfombra antideslizante y un apoyo firme hacen la diferencia.', 'Revisá el calzado: cerrado, cómodo y con suela que no resbale.'],
      cierre: 'Este recorrido es el punto de partida del curso Prevención de caídas en el hogar.',
      cursoId: 6
    },
    {
      id: 'a3', tag: 'Comunicación', min: 3, titulo: 'Hablar con alguien que no recuerda: tres ideas que ayudan',
      resumen: 'Cuando la memoria falla, corregir o discutir suele generar más angustia. Algunas ideas simples cambian el clima.',
      cuerpo: ['Cuando la memoria falla, corregir o discutir suele generar más angustia. Algunas ideas simples cambian el clima de la conversación.'],
      lista: ['Una idea por vez, con frases cortas y tono tranquilo.', 'Atendé primero la emoción y después el dato: «veo que algo te preocupa» abre más que «eso no pasó».', 'Acercate de frente, mirá a los ojos y llamá a la persona por su nombre.'],
      cierre: 'Lo trabajamos en profundidad en el curso Demencias: comprender y acompañar.',
      cursoId: 2
    }
  ],
  novedades: [
    { id: 'n1', fecha: 'Noviembre', titulo: 'Charla abierta y gratuita: Cuidar sin desgastarse', texto: 'Un encuentro en vivo para conocer el espacio y llevarte herramientas para la semana. Inscripción previa para recibir el enlace.', cursoId: 12 },
    { id: 'n2', fecha: 'Marzo', titulo: 'Nueva formación para cuidadores domiciliarios', texto: 'Abrimos las consultas para la cursada presencial de 12 semanas en Mar del Plata.', cursoId: 3 }
  ],
  descargables: [
    { id: 'p1', titulo: 'Planilla de registro de signos vitales', detalle: 'PDF · 1 página' },
    { id: 'p2', titulo: 'Lista de chequeo: casa segura', detalle: 'PDF · 2 páginas' },
    { id: 'p3', titulo: 'Cuaderno de autocuidado para quienes cuidan', detalle: 'PDF · 6 páginas' }
  ]
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'concienciavital_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};
const enCarrito = id => Cart.get().some(i => i.id === id);

const precioTexto = p => (p.precio === 0 ? 'Gratis' : formatearPrecio(precioFinal(p)));
const precioHTML = p => {
  if (p.precio === 0) return '<span class="precio precio--gratis">Gratis</span>';
  if (p.descuento > 0) return `<span class="precio">${formatearPrecio(precioFinal(p))}</span> <s class="precio-antes">${formatearPrecio(p.precio)}</s>`;
  return `<span class="precio">${formatearPrecio(p.precio)}</span>`;
};
const horasTexto = h => (Number.isInteger(h) ? `${h} h` : `${Math.floor(h)} h ${Math.round((h % 1) * 60)} min`);
const minTexto = min => (min < 60 ? `${min} min` : (min % 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min / 60} h`));
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const labelInscribir = p => (enCarrito(p.id) ? 'En tu inscripción' : (p.precio === 0 ? 'Inscribirme gratis' : 'Inscribirme'));

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

function botonInscribir(p, extra = '') {
  const dentro = enCarrito(p.id);
  return `<button type="button" class="btn btn-sm btn-primary btn-inscribir${dentro ? ' is-dentro' : ''} ${extra}" data-inscribir="${p.id}"${dentro ? ' aria-pressed="true"' : ''}>${dentro ? ico('check') : ''}<span>${labelInscribir(p)}</span></button>`;
}

function syncBotones() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const p = getProducto(Number(b.dataset.inscribir));
    if (!p) return;
    const dentro = enCarrito(p.id);
    b.classList.toggle('is-dentro', dentro);
    if (dentro) b.setAttribute('aria-pressed', 'true'); else b.removeAttribute('aria-pressed');
    b.innerHTML = `${dentro ? ico('check') : ''}<span>${labelInscribir(p)}</span>`;
  });
}

function inscribir(id) {
  const p = getProducto(id);
  if (!p) return;
  if (enCarrito(id)) { openCartDrawer(); return; }
  Cart.add(p);
  showToast(`Sumaste «${p.titulo}» a tu inscripción.`);
}

function destacadoHTML(p) {
  const area = getArea(p.area);
  const mod = MODALIDADES[p.modalidad];
  return `<article class="dest" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="dest-foto"><img src="images/${p.portada}" alt="${esc(p.titulo)}" width="1254" height="1254" decoding="async"><span class="chip chip--sobre">${ico(mod.icono)}${mod.nombre}</span></div>
    <div class="dest-body">
      <div class="dest-head">
        <span class="area-ico">${ico(area.icono)}</span>
        <h3 class="dest-titulo"><button type="button" class="dest-ver" data-ver="${p.id}">${esc(p.titulo)}</button></h3>
        <span class="dest-flecha">${ico('arrow')}</span>
      </div>
      <span class="raya" aria-hidden="true"></span>
      <p class="dest-desc">${esc(p.descripcionCorta)}</p>
      <p class="dest-meta">${p.formato} · ${p.duracion} · ${p.inicio}</p>
      <div class="dest-pie">${precioHTML(p)}${botonInscribir(p)}</div>
    </div>
  </article>`;
}

function initDestacados() {
  const cont = document.getElementById('destacados-grid');
  if (!cont) return;
  cont.innerHTML = CURSOS.filter(p => p.destacado).slice(0, 4).map(destacadoHTML).join('');
}

const filtros = { q: '', area: '', modalidad: '', nivel: '', duracion: '', precio: '' };
const POR_PAGINA = window.matchMedia('(max-width: 640px)').matches ? 6 : 12;
let visibles = POR_PAGINA;
const ordenArea = id => AREAS.findIndex(a => a.id === id);

function initAreas() {
  const cont = document.getElementById('areas-list');
  if (!cont) return;
  cont.innerHTML = AREAS.map(a => {
    const n = CURSOS.filter(p => p.area === a.id).length;
    return `<li data-animate="subir" style="opacity:0;transform:translateY(20px)"><button type="button" class="area-btn" data-area="${a.id}" aria-pressed="false">
      <span class="area-ico">${ico(a.icono)}</span><span class="area-nombre">${esc(a.nombre)}</span><span class="area-n">${n} ${n === 1 ? 'curso' : 'cursos'}</span>${ico('arrow', 'area-flecha')}
    </button></li>`;
  }).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-area]');
    if (!b) return;
    const id = b.dataset.area;
    const yaActiva = filtros.area === id && document.body.classList.contains('m2');
    setFiltro('area', yaActiva ? '' : id);
    const destino = document.getElementById('catalogo-top');
    if (destino && (!document.body.classList.contains('m2') || window.innerWidth < 900)) destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function syncAreas() {
  document.querySelectorAll('[data-area]').forEach(b => {
    const on = b.dataset.area === filtros.area;
    b.classList.toggle('is-activa', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function filtrarCursos() {
  const q = norm(filtros.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  return CURSOS.filter(p => {
    if (filtros.area && p.area !== filtros.area) return false;
    if (filtros.modalidad && p.modalidad !== filtros.modalidad) return false;
    if (filtros.nivel && p.nivel !== filtros.nivel) return false;
    if (filtros.duracion === 'corto' && p.cantidadClases > 2) return false;
    if (filtros.duracion === 'medio' && (p.cantidadClases < 3 || p.cantidadClases > 6)) return false;
    if (filtros.duracion === 'largo' && p.cantidadClases < 7) return false;
    const pf = precioFinal(p);
    if (filtros.precio === 'gratis' && pf !== 0) return false;
    if (filtros.precio === 'hasta30' && (pf === 0 || pf > 30000)) return false;
    if (filtros.precio === '30a60' && (pf <= 30000 || pf > 60000)) return false;
    if (filtros.precio === 'mas60' && pf <= 60000) return false;
    if (palabras.length) {
      const d = getDocente(p.docenteId);
      const texto = norm([p.titulo, getArea(p.area)?.nombre, p.formato, p.nivel, MODALIDADES[p.modalidad]?.nombre, d?.especialidad, p.descripcionCorta, p.paraQuien, p.resultados.join(' ')].join(' '));
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }).sort((a, b) => ordenArea(a.area) - ordenArea(b.area) || a.id - b.id);
}

function cursoHTML(p) {
  const area = getArea(p.area);
  const mod = MODALIDADES[p.modalidad];
  const d = getDocente(p.docenteId);
  const badge = p.nuevo ? '<span class="badge">Nuevo</span>' : '';
  return `<article class="curso" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <span class="area-ico curso-ico">${ico(area.icono)}</span>
    <div class="curso-main">
      <p class="curso-area">${esc(area.nombre)}${badge}</p>
      <h3 class="curso-titulo"><button type="button" class="curso-ver" data-ver="${p.id}">${esc(p.titulo)}</button></h3>
      <p class="curso-sub">${p.formato} · ${p.nivel} · Dicta: ${esc(d?.especialidad || '')}</p>
    </div>
    <ul class="curso-meta">
      <li class="chip chip--${p.modalidad}">${ico(mod.icono)}${mod.nombre}</li>
      <li class="curso-dato">${ico('clock')}${p.duracion}</li>
    </ul>
    <p class="curso-precio">${precioHTML(p)}</p>
    <div class="curso-acciones"><button type="button" class="btn btn-sm btn-ghost" data-ver="${p.id}">Ver curso</button>${botonInscribir(p)}</div>
  </article>`;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const lista = filtrarCursos();
  const vacio = document.getElementById('catalogo-vacio');
  const mas = document.getElementById('catalogo-mas');
  const contador = document.getElementById('catalogo-contador');
  grid.innerHTML = lista.slice(0, visibles).map(cursoHTML).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  if (mas) mas.hidden = lista.length <= visibles;
  if (contador) contador.textContent = lista.length === 1 ? '1 curso' : `${lista.length} cursos`;
  const activos = ['area', 'modalidad', 'nivel', 'duracion', 'precio'].filter(k => filtros[k]).length + (filtros.q ? 1 : 0);
  document.querySelectorAll('[data-limpiar]').forEach(b => { b.hidden = activos === 0; });
  const nf = document.getElementById('filtros-n');
  if (nf) { nf.textContent = activos; nf.hidden = activos === 0; }
  revelarNuevos(grid);
}

function setFiltro(k, v) {
  filtros[k] = v;
  visibles = POR_PAGINA;
  const sel = document.querySelector(`[data-filtro="${k}"]`);
  if (sel && sel.value !== v) sel.value = v;
  syncAreas();
  renderCatalogo();
}

function limpiarFiltros() {
  Object.keys(filtros).forEach(k => { filtros[k] = ''; });
  document.querySelectorAll('[data-filtro]').forEach(el => { el.value = ''; });
  const q = document.getElementById('catalogo-q');
  if (q) q.value = '';
  visibles = POR_PAGINA;
  syncAreas();
  renderCatalogo();
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const selArea = document.querySelector('[data-filtro="area"]');
  if (selArea) selArea.insertAdjacentHTML('beforeend', AREAS.map(a => `<option value="${a.id}">${esc(a.nombre)}</option>`).join(''));
  const q = document.getElementById('catalogo-q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filtros.q = q.value; visibles = POR_PAGINA; renderCatalogo(); }, 160); });
  document.getElementById('catalogo-buscar')?.addEventListener('submit', e => { e.preventDefault(); filtros.q = q?.value || ''; visibles = POR_PAGINA; renderCatalogo(); });
  document.querySelectorAll('[data-filtro]').forEach(sel => sel.addEventListener('change', () => setFiltro(sel.dataset.filtro, sel.value)));
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarFiltros));
  document.getElementById('catalogo-mas')?.addEventListener('click', () => { visibles += POR_PAGINA; renderCatalogo(); });
  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros-panel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  renderCatalogo();
}

function initDocentes() {
  const cont = document.getElementById('docentes-grid');
  if (!cont) return;
  cont.innerHTML = DOCENTES.map(d => `<article class="docente" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <span class="docente-avatar">${ico('user')}</span>
      <div class="docente-body">
        <p class="docente-etiqueta">${esc(d.etiqueta)} · ${esc(d.especialidad)}</p>
        <h3 class="docente-nombre">${esc(d.nombre)}</h3>
        <p class="docente-bio">${esc(d.bio)}</p>
      </div>
    </article>`).join('');
}

function initRecursos() {
  const art = document.getElementById('rec-articulos');
  const nov = document.getElementById('rec-novedades');
  const des = document.getElementById('rec-descargables');
  if (!art) return;
  art.innerHTML = RECURSOS.articulos.map(a => `<article class="rec-item" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <p class="rec-tag">${esc(a.tag)} · ${a.min} min de lectura</p>
    <h3 class="rec-titulo"><button type="button" data-articulo="${a.id}">${esc(a.titulo)}${ico('arrow', 'rec-flecha')}</button></h3>
    <p class="rec-texto">${esc(a.resumen)}</p>
  </article>`).join('');
  if (nov) nov.innerHTML = RECURSOS.novedades.map(n => `<article class="rec-item" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <p class="rec-tag">${ico('calendar')}${esc(n.fecha)}</p>
    <h3 class="rec-titulo"><button type="button" data-ver="${n.cursoId}">${esc(n.titulo)}${ico('arrow', 'rec-flecha')}</button></h3>
    <p class="rec-texto">${esc(n.texto)}</p>
  </article>`).join('');
  if (des) des.innerHTML = RECURSOS.descargables.map(p => `<article class="rec-item rec-item--pdf" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <span class="area-ico">${ico('file')}</span>
    <div><h3 class="rec-titulo">${esc(p.titulo)}</h3><p class="rec-tag">${esc(p.detalle)}</p></div>
    <button type="button" class="btn btn-sm btn-ghost" data-descargar="${p.id}">${ico('download')}<span>Descargar</span></button>
  </article>`).join('');
}

function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const activar = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) { panel.hidden = !on; if (on) { panel.classList.remove('tab-entra'); void panel.offsetWidth; panel.classList.add('tab-entra'); revelarNuevos(panel); } }
      });
      if (foco) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activar(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); activar(tabs[(i + 1) % tabs.length], true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); activar(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      });
    });
  });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
function trapFocus(cont, e) {
  if (e.key !== 'Tab') return;
  const items = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let modalPrevFocus = null;
function modalShell() { return document.getElementById('modal'); }

function cursoModalHTML(p) {
  const area = getArea(p.area);
  const mod = MODALIDADES[p.modalidad];
  const d = getDocente(p.docenteId);
  const totalClases = p.modulos.reduce((s, mo) => s + mo.clases.length, 0);
  const wa = waLink(`Hola, Conciencia Vital. Quiero consultar por «${p.titulo}».`);
  return `<div class="modal-media"><img src="images/${p.portada}" alt="${esc(p.titulo)}" width="1254" height="1254"><span class="chip chip--sobre">${ico(area.icono)}${esc(area.nombre)}</span></div>
  <div class="modal-body">
    <p class="modal-kicker">${p.formato} · ${mod.nombre} · ${p.nivel}</p>
    <h2 class="modal-title">${esc(p.titulo)}</h2>
    <p class="modal-lead">${esc(p.descripcionCorta)}</p>
    <div class="modal-compra">
      <div><p class="modal-precio">${precioHTML(p)}</p><p class="modal-inicio">${ico('calendar')}${esc(p.inicio)}</p></div>
      <div class="modal-ctas">${botonInscribir(p)}<a class="btn btn-sm btn-ghost" href="${wa}" target="_blank" rel="noopener">Consultar por WhatsApp</a></div>
    </div>
    <dl class="modal-datos">
      <div><dt>Duración</dt><dd>${p.duracion}</dd></div>
      <div><dt>Carga horaria</dt><dd>${horasTexto(p.horas)}</dd></div>
      <div><dt>Modalidad</dt><dd>${mod.nombre}</dd></div>
      <div><dt>Certificado</dt><dd>${p.certificado === 'finalizacion' ? 'De finalización' : 'De participación'}</dd></div>
    </dl>
    <section class="modal-sec"><h3>Para quién es</h3><p>${esc(p.paraQuien)}</p></section>
    <section class="modal-sec"><h3>Qué vas a lograr</h3><ul class="checks">${p.resultados.map(r => `<li>${ico('check')}<span>${esc(r)}</span></li>`).join('')}</ul></section>
    <section class="modal-sec"><h3>Programa <span class="modal-sub">${p.modulos.length} módulos · ${totalClases} clases</span></h3>
      <div class="programa">${p.modulos.map((mo, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="mod-n">Módulo ${i + 1}</span><span class="mod-t">${esc(mo.titulo)}</span><span class="mod-c">${mo.clases.length} ${mo.clases.length === 1 ? 'clase' : 'clases'}</span></summary>
        <ol>${mo.clases.map(c => `<li><span class="clase-ico" title="${TIPOS[c.tipo].nombre}">${ico(TIPOS[c.tipo].icono)}</span><span class="clase-t">${esc(c.titulo)}${c.preview ? '<span class="badge badge--suave">Clase de muestra</span>' : ''}</span><span class="clase-d">${TIPOS[c.tipo].nombre} · ${minTexto(c.duracion)}</span></li>`).join('')}</ol>
      </details>`).join('')}</div>
    </section>
    <div class="modal-dos">
      <section class="modal-sec"><h3>Requisitos</h3><ul class="puntos">${p.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul></section>
      <section class="modal-sec"><h3>Incluye</h3><ul class="puntos">${p.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul></section>
    </div>
    <section class="modal-sec modal-docente"><span class="docente-avatar">${ico('user')}</span><div><p class="docente-etiqueta">${esc(d.etiqueta)} · ${esc(d.especialidad)}</p><h3>${esc(d.nombre)}</h3><p>${esc(d.bio)}</p></div></section>
    <p class="modal-legal">${ico('award')}<span>${CERTIFICADOS[p.certificado]}. Capacitación privada de educación no formal: no otorga título oficial ni habilitación profesional.</span></p>
  </div>`;
}

function articuloModalHTML(a) {
  const p = getProducto(a.cursoId);
  return `<div class="modal-body modal-body--articulo">
    <p class="modal-kicker">${esc(a.tag)} · ${a.min} min de lectura</p>
    <h2 class="modal-title">${esc(a.titulo)}</h2>
    ${a.cuerpo.map(t => `<p class="modal-lead">${esc(t)}</p>`).join('')}
    <ul class="checks">${a.lista.map(t => `<li>${ico('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
    <p>${esc(a.cierre)}</p>
    ${p ? `<div class="modal-compra modal-compra--rel"><div><p class="modal-kicker">Curso relacionado</p><p class="modal-rel">${esc(p.titulo)}</p></div><div class="modal-ctas"><button type="button" class="btn btn-sm btn-ghost" data-ver="${p.id}">Ver el curso</button></div></div>` : ''}
  </div>`;
}

function abrirModal(html, label, extraClass = '') {
  const modal = modalShell();
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  const cont = modal.querySelector('.modal-content');
  if (!modal.classList.contains('open')) modalPrevFocus = document.activeElement;
  cont.innerHTML = html;
  panel.className = `modal-panel ${extraClass}`;
  modal.setAttribute('aria-label', label);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  panel.scrollTop = 0;
  modal.querySelector('.modal-close')?.focus();
}

function cerrarModal() {
  const modal = modalShell();
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  if (!document.querySelector('.drawer.open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 280);
  if (location.search.includes('curso=')) window.history.replaceState(null, '', location.pathname + location.hash);
  modalPrevFocus?.focus?.();
}

function abrirCurso(id) {
  const p = getProducto(id);
  if (!p) return;
  abrirModal(cursoModalHTML(p), `Curso: ${p.titulo}`);
  window.history.replaceState(null, '', `${location.pathname}?curso=${p.slug}${location.hash}`);
}

function abrirArticulo(id) {
  const a = RECURSOS.articulos.find(x => x.id === id);
  if (!a) return;
  abrirModal(articuloModalHTML(a), `Artículo: ${a.titulo}`, 'modal-panel--angosto');
}

function initModal() {
  const modal = modalShell();
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal-close')) cerrarModal(); });
  modal.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); else trapFocus(modal.querySelector('.modal-panel'), e); });
  const slug = new URLSearchParams(location.search).get('curso');
  const p = slug ? CURSOS.find(c => c.slug === slug) : null;
  if (p) abrirCurso(p.id);
}

function openCartDrawer() {
  const dr = document.getElementById('cart-drawer');
  if (!dr) return;
  if (!modalShell()?.hidden) cerrarModal();
  dr._prev = document.activeElement;
  renderDrawer();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer-close')?.focus();
}

function closeCartDrawer() {
  const dr = document.getElementById('cart-drawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, reduceMotion ? 0 : 340);
  dr._prev?.focus?.();
}

function renderDrawer() {
  const list = document.getElementById('drawer-list');
  if (!list) return;
  const items = Cart.get().map(i => getProducto(i.id)).filter(Boolean);
  const vacio = document.getElementById('drawer-vacio');
  const pie = document.getElementById('drawer-pie');
  vacio.hidden = items.length > 0;
  pie.hidden = items.length === 0;
  list.innerHTML = items.map((p, i) => `<li class="drawer-item" style="--i:${i}">
    <span class="area-ico">${ico(getArea(p.area).icono)}</span>
    <div><p class="drawer-titulo">${esc(p.titulo)}</p><p class="drawer-meta">${MODALIDADES[p.modalidad].nombre} · ${p.duracion}</p></div>
    <p class="drawer-precio">${precioTexto(p)}</p>
    <button type="button" class="drawer-quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.titulo)}">${ico('trash')}</button>
  </li>`).join('');
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = Cart.total() === 0 ? 'Gratis' : formatearPrecio(Cart.total());
}

function initDrawer() {
  const dr = document.getElementById('cart-drawer');
  if (!dr) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  dr.addEventListener('click', e => {
    if (e.target === dr || e.target.closest('.drawer-close')) closeCartDrawer();
    const q = e.target.closest('[data-quitar]');
    if (q) Cart.remove(Number(q.dataset.quitar));
    if (e.target.closest('[data-seguir]')) closeCartDrawer();
  });
  dr.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); else trapFocus(dr.querySelector('.drawer-panel'), e); });
  document.getElementById('drawer-finalizar')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderDrawer(); });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const ins = e.target.closest('[data-inscribir]');
    if (ins) { e.preventDefault(); inscribir(Number(ins.dataset.inscribir)); return; }
    const ver = e.target.closest('[data-ver]');
    if (ver) { e.preventDefault(); abrirCurso(Number(ver.dataset.ver)); return; }
    const art = e.target.closest('[data-articulo]');
    if (art) { e.preventDefault(); abrirArticulo(art.dataset.articulo); return; }
    if (e.target.closest('[data-descargar]')) showToast('La descarga de materiales se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', syncBotones);
  document.addEventListener('cart:updated', updateCartBadge);
}

function initForm() {
  const form = document.getElementById('form-inscripcion');
  if (!form) return;
  const sel = form.querySelector('#f-curso');
  if (sel) sel.insertAdjacentHTML('beforeend', CURSOS.map(p => `<option value="${p.id}">${esc(p.titulo)}</option>`).join(''));
  const tel = form.querySelector('#f-tel');
  if (tel && typeof IMask !== 'undefined') IMask(tel, { mask: '+{54} {9} 000 000-0000' });
  const reglas = {
    'f-nombre': v => v.trim().length >= 3 || 'Contanos tu nombre y apellido.',
    'f-tel': v => v.replace(/\D/g, '').length >= 12 || 'Dejanos un WhatsApp con código de área.',
    'f-curso': v => v !== '' || 'Elegí un curso, o «Todavía no sé».'
  };
  const validar = input => {
    const regla = reglas[input.id];
    if (!regla) return true;
    const r = regla(input.value);
    const err = form.querySelector(`#${input.id}-err`);
    const ok = r === true;
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.textContent = ok ? '' : r;
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const input = form.querySelector(`#${id}`);
    input?.addEventListener('blur', () => validar(input));
    input?.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validar(input); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = Object.keys(reglas).map(id => form.querySelector(`#${id}`)).filter(Boolean);
    const malos = inputs.filter(i => !validar(i));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = txt;
      form.reset();
      inputs.forEach(i => i.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-consultar]');
    if (!c || !sel) return;
    sel.value = c.dataset.consultar;
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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

function initSchema() {
  const url = 'https://gokywebs.com/demo/concienciavital/';
  const data = {
    '@context': 'https://schema.org',
    '@graph': CURSOS.map(p => ({
      '@type': 'Course',
      name: p.titulo,
      description: p.descripcionCorta,
      url: `${url}?curso=${p.slug}`,
      provider: { '@type': 'EducationalOrganization', name: 'Conciencia Vital', url },
      offers: { '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS', category: p.precio === 0 ? 'Free' : 'Paid' },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: p.modalidad === 'presencial' ? 'Onsite' : p.modalidad === 'mixta' ? 'Blended' : 'Online' }
    }))
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

initDestacados();
initAreas();
initCatalogo();
initDocentes();
initRecursos();
initTabs();
initReveals();
initNav();
initModal();
initDrawer();
initAcciones();
initFloats();
initForm();
initModelBarScroll();
initSchema();
updateCartBadge();
