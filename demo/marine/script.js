document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491164029872';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const lsGet = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

const ICO = {
  flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  huella: '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>',
  casco: '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
  notebook: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  flor: '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',
  video: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  lectura: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  practica: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  capas: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  distancia: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  semi: '<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>',
  presencial: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"/><path d="M18 5v17"/><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
  candado: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCirculo: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  chevronAbajo: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  inscripcion: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  comillas: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>'
};
const ico = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n]}</svg>`;

const DOCENTE = { nombre: 'Irene Quiroli', rol: 'Docente a cargo de Marine', iniciales: 'IQ' };
const AREAS = {
  forense: { nombre: 'Seguridad forense', codigo: 'SF', icono: 'huella' },
  higiene: { nombre: 'Seguridad e higiene', codigo: 'SH', icono: 'casco' },
  administrativo: { nombre: 'Administrativo', codigo: 'AD', icono: 'notebook' },
  belleza: { nombre: 'Belleza y estética', codigo: 'BE', icono: 'flor' }
};
const MODALIDADES = { distancia: 'A distancia', semi: 'Semipresencial', presencial: 'Presencial' };
const TIPO_CLASE = { video: 'Clase en video', lectura: 'Apunte en PDF', practica: 'Práctica' };

const CURSOS = [
  {
    id: 'criminalistica', area: 'forense', codigo: 'SF·01', destacado: true, badge: 'Para empezar',
    titulo: 'Criminalística: la escena del hecho paso a paso', corto: 'Criminalística inicial',
    foto: 'images/seguridad-forense.webp', alt: 'Dos personas con guardapolvo revisan un rastro con una lupa junto a un sobre de evidencia',
    nivel: 'Inicial', modalidades: ['distancia', 'semi'], duracion: '8 semanas', horas: 32, precio: 68000,
    descripcionCorta: 'Qué se busca en una escena, cómo se preserva y cómo se documenta cada rastro.',
    promesa: 'Entendé cómo se trabaja una escena del hecho, desde que se llega hasta que se entrega el informe.',
    descripcion: 'Un curso de base para conocer la criminalística: cómo se preserva un lugar, qué rastros se buscan, cómo se levantan y embalan, y cómo se arma la cadena de custodia. Sirve para empezar en el área o para ordenar lo que ya sabés.',
    resultados: ['Reconocer los tipos de rastros y dónde buscarlos', 'Preservar la escena y fijarla con fotos, planos y notas', 'Levantar y embalar evidencias sin contaminarlas', 'Completar una cadena de custodia'],
    requisitos: ['No hace falta experiencia previa', 'Compu o celular con conexión a internet'],
    incluye: ['9 clases por módulos en el área de alumnos', 'Apunte en PDF de cada clase', 'Consultas con la docente en cada clase'],
    etiquetas: 'criminalistica escena del hecho rastros evidencias cadena de custodia peritos forense',
    modulos: [
      { titulo: 'La escena del hecho', clases: [['Qué estudia la criminalística', '24:10', 'video', true], ['Llegar y preservar el lugar', '27:35', 'video'], ['Apunte: los roles en la escena', '12 págs.', 'lectura']] },
      { titulo: 'Rastros y evidencias', clases: [['Tipos de rastros y dónde buscarlos', '31:20', 'video'], ['Levantamiento y embalaje', '29:05', 'video'], ['Práctica: rotulado de evidencias', '1:30 h', 'practica']] },
      { titulo: 'Documentar e informar', clases: [['Fijación fotográfica y planimetría', '26:40', 'video'], ['La cadena de custodia', '22:15', 'video'], ['Trabajo final: tu primer informe', '8 págs.', 'lectura']] }
    ]
  },
  {
    id: 'papiloscopia', area: 'forense', codigo: 'SF·02',
    titulo: 'Papiloscopía: huellas dactilares', corto: 'Papiloscopía',
    nivel: 'Intermedio', modalidades: ['semi', 'presencial'], duracion: '6 semanas', horas: 24, precio: 74000,
    descripcionCorta: 'Cómo se clasifican, se revelan y se comparan las huellas dactilares.',
    promesa: 'Aprendé a revelar, levantar y comparar huellas, con las prácticas en el aula.',
    descripcion: 'Un curso para conocer la papiloscopía: los dibujos papilares, el sistema de clasificación de Vucetich, los polvos y reactivos para revelar rastros latentes y la comparación de puntos característicos. Las prácticas de revelado se hacen en el aula.',
    resultados: ['Reconocer los tipos fundamentales de dibujos papilares', 'Revelar rastros latentes con polvos y reactivos', 'Levantar una huella y rotularla', 'Comparar puntos característicos entre dos impresiones'],
    requisitos: ['Conviene haber hecho Criminalística inicial', 'Ganas de practicar con materiales en el aula'],
    incluye: ['9 clases por módulos', 'Prácticas de revelado en el aula', 'Apunte en PDF de cada clase'],
    etiquetas: 'papiloscopia huellas dactilares dactiloscopia vucetich rastros latentes revelado',
    modulos: [
      { titulo: 'Los dibujos papilares', clases: [['Qué es la papiloscopía', '21:30', 'video', true], ['Tipos fundamentales y su clasificación', '28:45', 'video'], ['Apunte: el sistema de Vucetich', '10 págs.', 'lectura']] },
      { titulo: 'Revelar rastros latentes', clases: [['Polvos, brochas y superficies', '25:10', 'video'], ['Reactivos: cuándo usar cada uno', '23:40', 'video'], ['Práctica: revelado y levantamiento', '2 h', 'practica']] },
      { titulo: 'Comparar huellas', clases: [['Puntos característicos', '27:20', 'video'], ['Cómo se arma una comparación', '24:05', 'video'], ['Práctica: comparación de impresiones', '2 h', 'practica']] }
    ]
  },
  {
    id: 'fotografia-forense', area: 'forense', codigo: 'SF·03',
    titulo: 'Fotografía forense y documentación de la escena', corto: 'Fotografía forense',
    nivel: 'Inicial', modalidades: ['distancia', 'semi'], duracion: '6 semanas', horas: 24, precio: 62000,
    descripcionCorta: 'Fotos que sirven como prueba: planos, escalas, testigo métrico y orden de las tomas.',
    promesa: 'Sacá fotos de una escena que sirvan como prueba, con cámara o con el celular.',
    descripcion: 'Un curso práctico sobre cómo documentar una escena con fotografía: planos generales, medios y de detalle, el testigo métrico, la luz y el orden de las tomas, y cómo se arma el álbum que acompaña al informe.',
    resultados: ['Tomar planos generales, medios y de detalle en orden', 'Usar testigo métrico y escalas', 'Resolver la luz en interiores y de noche', 'Armar el álbum fotográfico del informe'],
    requisitos: ['Una cámara o un celular con cámara', 'Compu o celular con conexión a internet'],
    incluye: ['9 clases por módulos', 'Guía de planos en PDF', 'Devolución de la docente sobre tus fotos de práctica'],
    etiquetas: 'fotografia forense camara celular planos testigo metrico album escena',
    modulos: [
      { titulo: 'La foto como prueba', clases: [['Para qué sirve la fotografía forense', '19:50', 'video', true], ['Planos general, medio y de detalle', '26:30', 'video'], ['Apunte: el orden de las tomas', '8 págs.', 'lectura']] },
      { titulo: 'Técnica en la escena', clases: [['Testigo métrico y escalas', '22:10', 'video'], ['Luz: interiores, noche y flash', '28:25', 'video'], ['Práctica: fotografiá una escena armada', '1 h', 'practica']] },
      { titulo: 'El álbum fotográfico', clases: [['Ordenar y rotular las fotos', '18:40', 'video'], ['Cómo acompaña al informe', '21:15', 'video'], ['Trabajo final: tu álbum', '6 págs.', 'lectura']] }
    ]
  },
  {
    id: 'seguridad-higiene', area: 'higiene', codigo: 'SH·01', destacado: true, badge: 'Para empezar',
    titulo: 'Seguridad e higiene en el trabajo: bases y normativa', corto: 'Seguridad e higiene: bases',
    foto: 'images/seguridad-higiene.webp', alt: 'Grupo sentado a una mesa revisando un casco blanco y anteojos de seguridad',
    nivel: 'Inicial', modalidades: ['distancia', 'semi'], duracion: '8 semanas', horas: 32, precio: 72000,
    descripcionCorta: 'Riesgos, prevención y las Leyes 19.587 y 24.557 explicadas con casos de todos los días.',
    promesa: 'Aprendé a detectar los riesgos de un lugar de trabajo y a proponer cómo prevenirlos.',
    descripcion: 'Un curso de base para entender la seguridad e higiene laboral: qué es un riesgo y cómo se evalúa, qué dicen la Ley 19.587 de Higiene y Seguridad y la Ley 24.557 de Riesgos del Trabajo, y cómo se arma el relevamiento de un puesto de trabajo.',
    resultados: ['Identificar riesgos físicos, químicos, ergonómicos y eléctricos', 'Conocer las obligaciones que fijan las Leyes 19.587 y 24.557', 'Hacer el relevamiento de un puesto de trabajo', 'Proponer medidas de prevención por orden de prioridad'],
    requisitos: ['No hace falta experiencia previa', 'Compu o celular con conexión a internet'],
    incluye: ['9 clases por módulos en el área de alumnos', 'Planilla de relevamiento para descargar', 'Consultas con la docente en cada clase'],
    etiquetas: 'seguridad higiene laboral riesgos prevencion ley 19587 24557 art relevamiento',
    modulos: [
      { titulo: 'Riesgo y prevención', clases: [['Qué es la seguridad e higiene', '22:40', 'video', true], ['Peligro, riesgo y accidente', '25:15', 'video'], ['Apunte: tipos de riesgo', '9 págs.', 'lectura']] },
      { titulo: 'Lo que dice la ley', clases: [['Ley 19.587 de Higiene y Seguridad', '28:30', 'video'], ['Ley 24.557 y las ART', '24:50', 'video'], ['Apunte: obligaciones de cada parte', '11 págs.', 'lectura']] },
      { titulo: 'Relevar un puesto de trabajo', clases: [['Cómo se recorre un puesto', '26:05', 'video'], ['Prioridades: eliminar, sustituir, proteger', '23:30', 'video'], ['Trabajo final: tu relevamiento', '1 h', 'practica']] }
    ]
  },
  {
    id: 'proteccion-personal', area: 'higiene', codigo: 'SH·02',
    titulo: 'Elementos de protección personal y prevención de accidentes', corto: 'Protección personal',
    nivel: 'Inicial', modalidades: ['distancia', 'presencial'], duracion: '4 semanas', horas: 16, precio: 48000,
    descripcionCorta: 'Qué protección corresponde a cada tarea, cómo se usa y cómo se controla.',
    promesa: 'Elegí, usá y controlá la protección personal que corresponde a cada tarea.',
    descripcion: 'Un curso corto sobre elementos de protección personal: cascos, anteojos, guantes, protección auditiva y respiratoria, calzado y arneses. Cuándo corresponde cada uno, cómo se usan, cómo se guardan y cómo se registra su entrega.',
    resultados: ['Elegir el elemento de protección según la tarea y el riesgo', 'Usarlo, guardarlo y controlarlo bien', 'Registrar la entrega de elementos de protección', 'Darte cuenta de cuándo un elemento ya no protege'],
    requisitos: ['No hace falta experiencia previa', 'Conexión a internet o asistencia al aula'],
    incluye: ['9 clases por módulos', 'Planilla de entrega de elementos de protección', 'Práctica con elementos reales en la cursada presencial'],
    etiquetas: 'epp elementos proteccion personal casco guantes anteojos arnes accidentes',
    modulos: [
      { titulo: 'Protección de la cabeza a los pies', clases: [['Para qué sirve cada elemento', '20:15', 'video', true], ['Cascos, anteojos y protección auditiva', '24:40', 'video'], ['Guantes, calzado y ropa de trabajo', '22:05', 'video']] },
      { titulo: 'Protección respiratoria y en altura', clases: [['Barbijos, semimáscaras y filtros', '23:20', 'video'], ['Arnés y trabajo en altura', '26:10', 'video'], ['Apunte: tabla de elección', '6 págs.', 'lectura']] },
      { titulo: 'Uso y control', clases: [['Colocación correcta', '18:30', 'video'], ['Guardado, limpieza y recambio', '16:45', 'video'], ['Práctica: registro de entrega', '45 min', 'practica']] }
    ]
  },
  {
    id: 'incendios', area: 'higiene', codigo: 'SH·03',
    titulo: 'Prevención de incendios y plan de evacuación', corto: 'Incendios y evacuación',
    nivel: 'Intermedio', modalidades: ['semi', 'presencial'], duracion: '6 semanas', horas: 24, precio: 56000,
    descripcionCorta: 'Clases de fuego, matafuegos y cómo se arma y se practica una evacuación.',
    promesa: 'Sabé qué hacer ante un principio de incendio y cómo se organiza una evacuación.',
    descripcion: 'Un curso sobre prevención y protección contra incendios: el triángulo del fuego, las clases de fuego y el matafuego que corresponde a cada una, la señalización, y cómo se arma, se comunica y se practica un plan de evacuación.',
    resultados: ['Reconocer las clases de fuego y el matafuego de cada una', 'Usar un matafuego en un principio de incendio', 'Leer la señalización de evacuación', 'Armar un plan de evacuación simple'],
    requisitos: ['Conviene haber hecho Seguridad e higiene: bases', 'Ropa cómoda para la práctica'],
    incluye: ['9 clases por módulos', 'Práctica de uso de matafuegos en el aula', 'Modelo de plan de evacuación en PDF'],
    etiquetas: 'incendios fuego matafuegos extintores evacuacion simulacro señalizacion',
    modulos: [
      { titulo: 'El fuego', clases: [['Triángulo y tetraedro del fuego', '21:10', 'video', true], ['Clases de fuego', '19:45', 'video'], ['Apunte: matafuegos por clase de fuego', '7 págs.', 'lectura']] },
      { titulo: 'Protección contra incendios', clases: [['Matafuegos: partes y uso', '24:30', 'video'], ['Señalización y salidas', '20:20', 'video'], ['Práctica: uso de matafuegos', '2 h', 'practica']] },
      { titulo: 'Plan de evacuación', clases: [['Roles y recorridos', '23:15', 'video'], ['Simulacros: cómo se preparan', '21:40', 'video'], ['Trabajo final: tu plan de evacuación', '1 h', 'practica']] }
    ]
  },
  {
    id: 'auxiliar-administrativo', area: 'administrativo', codigo: 'AD·01', destacado: true, badge: 'Para empezar',
    titulo: 'Auxiliar administrativo: gestión de oficina', corto: 'Auxiliar administrativo',
    foto: 'images/administrativo.webp', alt: 'Mujer trabajando en una notebook junto a carpetas, un cuaderno y una calculadora',
    nivel: 'Inicial', modalidades: ['distancia', 'presencial'], duracion: '10 semanas', horas: 40, precio: 79000,
    descripcionCorta: 'Documentación comercial, archivo, atención y las tareas de todos los días en una oficina.',
    promesa: 'Aprendé las tareas de todos los días de una oficina y hacelas con orden.',
    descripcion: 'Un curso para conocer el trabajo administrativo: documentación comercial (facturas, remitos y recibos), archivo físico y digital, agenda, atención en persona y por teléfono, y redacción de notas y correos.',
    resultados: ['Emitir y controlar facturas, remitos y recibos', 'Organizar un archivo físico y digital', 'Redactar notas y correos claros', 'Atender consultas en persona, por teléfono y por mail'],
    requisitos: ['No hace falta experiencia previa', 'Compu con conexión a internet'],
    incluye: ['9 clases por módulos en el área de alumnos', 'Modelos de documentos para descargar', 'Consultas con la docente en cada clase'],
    etiquetas: 'administrativo oficina facturas remitos recibos archivo secretariado atencion',
    modulos: [
      { titulo: 'La oficina por dentro', clases: [['Qué hace un auxiliar administrativo', '20:30', 'video', true], ['Circuitos administrativos básicos', '26:15', 'video'], ['Apunte: glosario de la oficina', '8 págs.', 'lectura']] },
      { titulo: 'Documentación comercial', clases: [['Facturas, remitos y recibos', '29:40', 'video'], ['Control y archivo de comprobantes', '22:50', 'video'], ['Práctica: un circuito de compra completo', '1 h', 'practica']] },
      { titulo: 'Comunicación y atención', clases: [['Redactar notas y correos', '24:10', 'video'], ['Atención en persona y por teléfono', '21:25', 'video'], ['Trabajo final: un día en la oficina', '1 h', 'practica']] }
    ]
  },
  {
    id: 'liquidacion-sueldos', area: 'administrativo', codigo: 'AD·02',
    titulo: 'Liquidación de sueldos y cargas sociales', corto: 'Liquidación de sueldos',
    nivel: 'Intermedio', modalidades: ['distancia'], duracion: '8 semanas', horas: 32, precio: 86000,
    descripcionCorta: 'Recibo de sueldo, aportes, contribuciones y el Libro de Sueldos Digital.',
    promesa: 'Liquidá un recibo de sueldo completo, con sus aportes, contribuciones y presentación.',
    descripcion: 'Un curso para aprender a liquidar sueldos: conceptos remunerativos y no remunerativos, horas extra, vacaciones y aguinaldo, aportes y contribuciones, el recibo de sueldo y cómo se presenta la información en ARCA.',
    resultados: ['Armar un recibo de sueldo de principio a fin', 'Calcular horas extra, vacaciones y aguinaldo', 'Separar aportes y contribuciones', 'Conocer la presentación del Libro de Sueldos Digital'],
    requisitos: ['Conviene haber hecho Auxiliar administrativo', 'Compu con planilla de cálculo'],
    incluye: ['9 clases por módulos', 'Planillas de liquidación para practicar', 'Consultas con la docente en cada clase'],
    etiquetas: 'sueldos liquidacion recibo aportes contribuciones aguinaldo vacaciones arca libro de sueldos',
    modulos: [
      { titulo: 'El recibo de sueldo', clases: [['Las partes de un recibo', '23:05', 'video', true], ['Remunerativo y no remunerativo', '25:40', 'video'], ['Apunte: conceptos más usados', '10 págs.', 'lectura']] },
      { titulo: 'Liquidar mes a mes', clases: [['Horas extra y adicionales', '27:30', 'video'], ['Vacaciones y aguinaldo', '28:15', 'video'], ['Práctica: liquidá tres recibos', '1:30 h', 'practica']] },
      { titulo: 'Aportes y presentaciones', clases: [['Aportes y contribuciones', '24:20', 'video'], ['El Libro de Sueldos Digital', '22:45', 'video'], ['Trabajo final: una liquidación completa', '2 h', 'practica']] }
    ]
  },
  {
    id: 'excel', area: 'administrativo', codigo: 'AD·03',
    titulo: 'Excel para tareas administrativas', corto: 'Excel administrativo',
    nivel: 'Inicial', modalidades: ['distancia'], duracion: '4 semanas', horas: 16, precio: 42000,
    descripcionCorta: 'Planillas, fórmulas y tablas para llevar caja, stock y agenda sin errores.',
    promesa: 'Armá planillas que hagan las cuentas por vos: fórmulas, filtros y tablas.',
    descripcion: 'Un curso práctico de planilla de cálculo pensado para la oficina: formato, fórmulas básicas, las funciones SI y BUSCARV, filtros, tablas dinámicas y gráficos, siempre con ejemplos de caja, stock y agenda.',
    resultados: ['Dar formato y ordenar una planilla', 'Usar SUMA, PROMEDIO, SI y BUSCARV', 'Filtrar datos y armar tablas dinámicas', 'Mostrar resultados en un gráfico'],
    requisitos: ['Una compu con Excel o una planilla de cálculo gratuita', 'Manejar la compu a nivel usuario'],
    incluye: ['9 clases por módulos', 'Planillas de práctica para descargar', 'Consultas con la docente en cada clase'],
    etiquetas: 'excel planilla calculo formulas buscarv tablas dinamicas graficos caja stock',
    modulos: [
      { titulo: 'Planillas ordenadas', clases: [['Celdas, filas y formato', '18:20', 'video', true], ['Fórmulas básicas', '21:35', 'video'], ['Práctica: planilla de caja', '40 min', 'practica']] },
      { titulo: 'Funciones que ahorran tiempo', clases: [['SI y condiciones', '22:10', 'video'], ['BUSCARV y búsquedas', '24:30', 'video'], ['Práctica: control de stock', '45 min', 'practica']] },
      { titulo: 'Resumir y mostrar', clases: [['Filtros y orden', '17:40', 'video'], ['Tablas dinámicas', '25:50', 'video'], ['Gráficos para un informe', '19:15', 'video']] }
    ]
  },
  {
    id: 'maquillaje-social', area: 'belleza', codigo: 'BE·01', destacado: true, badge: 'Con práctica en el aula',
    titulo: 'Maquillaje social: piel, ojos y ocasiones', corto: 'Maquillaje social',
    foto: 'images/maquillaje.webp', alt: 'Docente maquillando una cabeza de práctica frente a un grupo de alumnas',
    nivel: 'Inicial', modalidades: ['presencial', 'semi'], duracion: '8 semanas', horas: 32, precio: 95000,
    descripcionCorta: 'Preparación de la piel, correcciones y maquillajes de día, de noche y para eventos.',
    promesa: 'Aprendé a maquillar para el día, la noche y un evento, practicando en cada encuentro.',
    descripcion: 'Un curso de maquillaje social con práctica en cada encuentro: higiene de las herramientas, preparación de la piel, corrección y base, ojos, cejas y labios, y maquillajes para el día, la noche y los eventos.',
    resultados: ['Preparar la piel según su tipo', 'Corregir y elegir el tono de base', 'Maquillar ojos, cejas y labios', 'Armar un maquillaje de día, de noche y de evento'],
    requisitos: ['No hace falta experiencia previa', 'Un kit básico (la lista está en la primera clase)'],
    incluye: ['9 clases con práctica', 'Lista de materiales y guía en PDF', 'Práctica sobre cabeza de práctica y entre compañeras'],
    etiquetas: 'maquillaje social makeup piel base ojos cejas labios evento noche belleza',
    modulos: [
      { titulo: 'Piel y herramientas', clases: [['Higiene de pinceles y herramientas', '18:30', 'video', true], ['Tipos de piel y preparación', '24:45', 'video'], ['Práctica: preparación y base', '2 h', 'practica']] },
      { titulo: 'Correcciones y rasgos', clases: [['Correcciones de color', '22:20', 'video'], ['Ojos y cejas', '27:10', 'video'], ['Práctica: ojos y cejas', '2 h', 'practica']] },
      { titulo: 'Maquillajes completos', clases: [['Día y noche', '25:35', 'video'], ['Maquillaje de evento', '28:40', 'video'], ['Práctica final: un maquillaje completo', '2:30 h', 'practica']] }
    ]
  },
  {
    id: 'cosmetologia-facial', area: 'belleza', codigo: 'BE·02',
    titulo: 'Cosmetología facial: limpieza e higiene de la piel', corto: 'Cosmetología facial',
    foto: 'images/cosmetologia.webp', alt: 'Alumnas con delantal preparando cremas y máscaras en un aula de estética',
    nivel: 'Inicial', modalidades: ['presencial'], duracion: '8 semanas', horas: 32, precio: 110000,
    descripcionCorta: 'Tipos de piel, limpieza profunda, máscaras y protocolos de higiene en cabina.',
    promesa: 'Hacé una limpieza facial completa, con los cuidados de higiene de una cabina.',
    descripcion: 'Un curso presencial para aprender cosmetología facial: análisis de la piel, limpieza profunda paso a paso, exfoliación, máscaras e hidratación, y los protocolos de higiene y bioseguridad del trabajo en cabina.',
    resultados: ['Reconocer el tipo y el estado de una piel', 'Hacer una limpieza facial profunda paso a paso', 'Preparar y aplicar máscaras', 'Trabajar con protocolos de higiene en cabina'],
    requisitos: ['No hace falta experiencia previa', 'Ambo o delantal y toalla para las prácticas'],
    incluye: ['9 clases con práctica en el aula', 'Fichas de análisis de la piel en PDF', 'Protocolo de higiene en cabina en PDF'],
    etiquetas: 'cosmetologia facial limpieza piel mascaras cabina estetica cosmiatria',
    modulos: [
      { titulo: 'La piel', clases: [['Estructura y funciones de la piel', '23:10', 'video', true], ['Biotipos y estados de la piel', '25:30', 'video'], ['Apunte: ficha de análisis', '6 págs.', 'lectura']] },
      { titulo: 'Limpieza facial', clases: [['Limpieza profunda paso a paso', '28:20', 'video'], ['Exfoliación y extracción', '24:15', 'video'], ['Práctica: limpieza completa', '2:30 h', 'practica']] },
      { titulo: 'Máscaras y cabina', clases: [['Máscaras e hidratación', '21:50', 'video'], ['Higiene y bioseguridad en cabina', '19:35', 'video'], ['Práctica final: protocolo completo', '2:30 h', 'practica']] }
    ]
  },
  {
    id: 'manicuria', area: 'belleza', codigo: 'BE·03',
    titulo: 'Manicuría y esmaltado semipermanente', corto: 'Manicuría',
    nivel: 'Inicial', modalidades: ['presencial'], duracion: '6 semanas', horas: 24, precio: 88000,
    descripcionCorta: 'Preparación de la uña, manicuría tradicional y esmaltado semipermanente.',
    promesa: 'Aprendé una manicuría prolija y un esmaltado semipermanente que dure.',
    descripcion: 'Un curso presencial de manicuría: higiene y desinfección de herramientas, preparación de la uña y las cutículas, manicuría tradicional, esmaltado semipermanente con lámpara y retiro sin dañar la uña.',
    resultados: ['Desinfectar herramientas y preparar la mesa de trabajo', 'Trabajar cutículas y dar forma a la uña', 'Aplicar esmaltado semipermanente con lámpara', 'Retirar el semipermanente sin dañar la uña'],
    requisitos: ['No hace falta experiencia previa', 'Un kit básico de manicuría (te pasamos la lista)'],
    incluye: ['9 clases con práctica en el aula', 'Lista de materiales en PDF', 'Práctica entre compañeras'],
    etiquetas: 'manicuria uñas esmaltado semipermanente cuticulas lampara belleza',
    modulos: [
      { titulo: 'Higiene y preparación', clases: [['Desinfección de herramientas', '17:40', 'video', true], ['La mesa de trabajo', '14:20', 'video'], ['Práctica: preparación de uñas', '2 h', 'practica']] },
      { titulo: 'Manicuría', clases: [['Cutículas y limado', '21:30', 'video'], ['Manicuría tradicional', '23:45', 'video'], ['Práctica: manicuría completa', '2 h', 'practica']] },
      { titulo: 'Semipermanente', clases: [['Aplicación con lámpara', '24:10', 'video'], ['Retiro sin dañar la uña', '16:55', 'video'], ['Práctica final: esmaltado completo', '2 h', 'practica']] }
    ]
  }
];

const TESTIMONIOS = [];

const getCurso = id => CURSOS.find(c => c.id === id);
const area = c => AREAS[c?.area] || AREAS.forense;
const modsTxt = c => c.modalidades.map(m => MODALIDADES[m]).join(' · ');
const totalClases = c => c.modulos.reduce((s, m) => s + m.clases.length, 0);

const Cart = {
  KEY: 'marine_cart',
  get() {
    const items = lsGet(this.KEY, []);
    return Array.isArray(items) ? items.filter(i => getCurso(i.id)) : [];
  },
  save(items) { lsSet(this.KEY, items); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(curso, modalidad) {
    const items = this.get();
    const m = curso.modalidades.includes(modalidad) ? modalidad : curso.modalidades[0];
    const it = items.find(i => i.id === curso.id);
    if (it) it.modalidad = m; else items.push({ id: curso.id, modalidad: m });
    this.save(items);
  },
  setModalidad(id, modalidad) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    const c = getCurso(id);
    if (!it || !c || !c.modalidades.includes(modalidad)) return;
    it.modalidad = modalidad;
    this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
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

const SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';

function placaHTML(c, cls = '') {
  const a = area(c);
  return `<span class="placa placa--${c.area}${cls ? ' ' + cls : ''}" aria-hidden="true"><span class="placa__barras"><i></i><i></i></span>${ico(a.icono)}<span class="placa__codigo">${esc(c.codigo)}</span></span>`;
}
function modsChips(c) {
  return `<span class="mods">${c.modalidades.map(m => `<span class="mod mod--${m}">${ico(m)}${MODALIDADES[m]}</span>`).join('')}</span>`;
}
function botonInscribir(c, clases = 'btn btn--primary btn--sm') {
  const dentro = Cart.has(c.id);
  return `<button class="${clases}" type="button" data-inscribir="${c.id}" aria-pressed="${dentro}">${dentro ? 'En tu inscripción' : 'Inscribirme'}</button>`;
}
function refrescarBotones() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const dentro = Cart.has(b.dataset.inscribir);
    b.setAttribute('aria-pressed', String(dentro));
    b.textContent = dentro ? 'En tu inscripción' : 'Inscribirme';
  });
}

function renderDestacados() {
  const cont = document.getElementById('destacados');
  if (!cont) return;
  cont.innerHTML = CURSOS.filter(c => c.destacado).map((c, i) => `
    <div class="dest-celda dest-celda--${i + 1}" ${SUBIR}>
      <article class="dest">
        <div class="dest__foto"><img src="${c.foto}" alt="${esc(c.alt)}" width="1200" height="1200"></div>
        <div class="dest__cuerpo">
          <p class="dest__area"><span class="dest__ico">${ico(area(c).icono)}</span>${esc(area(c).nombre)}</p>
          <h3 class="dest__titulo">${esc(c.titulo)}</h3>
          <p class="dest__meta">${esc(modsTxt(c))} · ${esc(c.duracion)}</p>
          <div class="dest__pie">
            <p class="precio">${formatearPrecio(c.precio)}</p>
            <div class="dest__acciones">
              <button class="btn btn--ghost btn--sm" type="button" data-ver="${c.id}">Ver programa</button>
              ${botonInscribir(c)}
            </div>
          </div>
        </div>
        <span class="dest__badge">${esc(c.badge)}</span>
      </article>
    </div>`).join('');
}

const filtros = { area: 'todas', modalidad: '', q: '' };
function cursoHTML(c) {
  return `
    <article class="curso" ${SUBIR}>
      ${placaHTML(c, 'curso__placa')}
      <div class="curso__cuerpo">
        <p class="curso__area">${esc(area(c).nombre)} · ${esc(c.nivel)}</p>
        <h3 class="curso__titulo">${esc(c.titulo)}</h3>
        <p class="curso__desc">${esc(c.descripcionCorta)}</p>
        <p class="curso__meta"><span>${ico('reloj')}${esc(c.duracion)} · ${c.horas} h</span><span>${ico('capas')}${totalClases(c)} clases</span></p>
      </div>
      <div class="curso__mods">${modsChips(c)}</div>
      <div class="curso__lado">
        <p class="precio">${formatearPrecio(c.precio)}</p>
        <div class="curso__acciones">
          <button class="btn btn--ghost btn--sm" type="button" data-ver="${c.id}">Ver programa</button>
          ${botonInscribir(c)}
        </div>
      </div>
    </article>`;
}
function filtrarCursos() {
  const palabras = normalizar(filtros.q).trim().split(/\s+/).filter(Boolean);
  return CURSOS.filter(c => {
    if (filtros.area !== 'todas' && c.area !== filtros.area) return false;
    if (filtros.modalidad && !c.modalidades.includes(filtros.modalidad)) return false;
    if (!palabras.length) return true;
    const texto = normalizar([c.titulo, c.codigo, area(c).nombre, c.nivel, modsTxt(c), c.descripcionCorta, c.descripcion, c.etiquetas, DOCENTE.nombre].join(' '));
    return palabras.every(p => texto.includes(p));
  });
}
function contarModalidad(m) { return CURSOS.filter(c => c.modalidades.includes(m)).length; }
let catMostrados = 0;
function syncVerMas(total) {
  const mas = document.getElementById('cat-mas');
  if (!mas) return;
  const resto = total - catMostrados;
  mas.hidden = resto <= 0;
  mas.textContent = resto === 1 ? 'Ver 1 curso más' : `Ver ${resto} cursos más`;
}
function verMasCursos() {
  const lista = document.getElementById('cat-lista');
  if (!lista) return;
  const res = filtrarCursos();
  lista.insertAdjacentHTML('beforeend', res.slice(catMostrados).map(cursoHTML).join(''));
  catMostrados = res.length;
  syncVerMas(res.length);
  revelarNuevos(lista);
}
function renderCatalogo() {
  const lista = document.getElementById('cat-lista');
  if (!lista) return;
  const res = filtrarCursos();
  const inicial = parseInt((window.innerWidth < 700 && lista.dataset.inicialMovil) || lista.dataset.inicial, 10) || res.length;
  const vis = res.slice(0, inicial);
  catMostrados = vis.length;
  lista.innerHTML = vis.map(cursoHTML).join('');
  syncVerMas(res.length);
  const vacio = document.getElementById('cat-vacio');
  if (vacio) vacio.hidden = res.length > 0;
  const contador = document.getElementById('cat-contador');
  if (contador) contador.textContent = res.length === 1 ? '1 curso' : `${res.length} cursos`;
  document.querySelectorAll('[data-area-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.areaChip === filtros.area)));
  document.querySelectorAll('[data-mod-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.modChip === filtros.modalidad)));
  const sel = document.getElementById('cat-modalidad');
  if (sel) sel.value = filtros.modalidad;
  revelarNuevos(lista);
}
function aplicarFiltro(areaId, modalidad, irAlCatalogo) {
  filtros.area = areaId || 'todas';
  filtros.modalidad = modalidad || '';
  filtros.q = '';
  const q = document.getElementById('cat-q');
  if (q) q.value = '';
  renderCatalogo();
  if (irAlCatalogo) document.getElementById('cursos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
function initCatalogo() {
  document.querySelectorAll('[data-cuenta-mod]').forEach(el => { el.textContent = contarModalidad(el.dataset.cuentaMod); });
  document.querySelectorAll('[data-cuenta-area]').forEach(el => { el.textContent = CURSOS.filter(c => c.area === el.dataset.cuentaArea).length; });
  if (!document.getElementById('cat-lista')) return;
  renderCatalogo();
  document.querySelectorAll('[data-area-chip]').forEach(ch => ch.addEventListener('click', () => { filtros.area = ch.dataset.areaChip; renderCatalogo(); }));
  document.querySelectorAll('[data-mod-chip]').forEach(ch => ch.addEventListener('click', () => { filtros.modalidad = ch.dataset.modChip; renderCatalogo(); }));
  const sel = document.getElementById('cat-modalidad');
  sel?.addEventListener('change', () => { filtros.modalidad = sel.value; renderCatalogo(); });
  const q = document.getElementById('cat-q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filtros.q = q.value; renderCatalogo(); }, 160); });
  document.getElementById('cat-form')?.addEventListener('submit', e => { e.preventDefault(); filtros.q = q?.value || ''; renderCatalogo(); });
  document.getElementById('cat-limpiar')?.addEventListener('click', () => aplicarFiltro('todas', '', false));
  document.getElementById('cat-mas')?.addEventListener('click', verMasCursos);
}

const buscador = { area: '', modalidad: '' };
function initBuscador() {
  const form = document.getElementById('buscador');
  if (!form) return;
  const salida = document.getElementById('buscador-cuenta');
  const btn = document.getElementById('buscador-ir');
  const contar = () => CURSOS.filter(c => (!buscador.area || c.area === buscador.area) && (!buscador.modalidad || c.modalidades.includes(buscador.modalidad))).length;
  const sync = () => {
    form.querySelectorAll('[data-b-area]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bArea === buscador.area)));
    form.querySelectorAll('[data-b-mod]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bMod === buscador.modalidad)));
    const n = contar();
    if (salida) salida.textContent = n === 1 ? '1 curso' : `${n} cursos`;
    if (btn) btn.disabled = n === 0;
  };
  form.addEventListener('click', e => {
    const a = e.target.closest('[data-b-area]');
    if (a) { buscador.area = buscador.area === a.dataset.bArea ? '' : a.dataset.bArea; sync(); return; }
    const m = e.target.closest('[data-b-mod]');
    if (m) { buscador.modalidad = m.dataset.bMod; sync(); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!contar()) { showToast('No hay cursos con esa combinación. Probá con otra modalidad.'); return; }
    aplicarFiltro(buscador.area || 'todas', buscador.modalidad, true);
  });
  sync();
}

function moduloHTML(m, i, abierto) {
  return `
    <details class="modulo"${abierto ? ' open' : ''}>
      <summary><span class="modulo__num">${i + 1}</span><span class="modulo__nombre">${esc(m.titulo)}<small>${m.clases.length} clases</small></span>${ico('chevronAbajo')}</summary>
      <ul class="clases">${m.clases.map(cl => `<li class="clase-li">${ico(cl[2])}<span>${esc(cl[0])}${cl[3] ? '<span class="clase-li__prev">Clase abierta</span>' : ''}</span><span class="clase-li__dur">${esc(cl[1])}</span></li>`).join('')}</ul>
    </details>`;
}

let ultimoFoco = null;
function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function bloquearScroll(si) { document.body.classList.toggle('no-scroll', si); }

let modalModalidad = '';
function modalCtas(c) {
  const dentro = Cart.has(c.id);
  return `<button class="btn btn--primary" type="button" data-inscribir-ya="${c.id}">${dentro ? 'Ver mi inscripción' : 'Inscribirme'}</button><button class="btn btn--ghost" type="button" data-aula="${c.id}">Verlo en el área de alumnos</button>`;
}
function modalHTML(c) {
  const enCarrito = Cart.get().find(i => i.id === c.id);
  modalModalidad = enCarrito?.modalidad || c.modalidades[0];
  const datos = [['Duración', `${c.duracion} · ${c.horas} h`], ['Nivel', c.nivel], ['Clases', `${totalClases(c)} en ${c.modulos.length} módulos`], ['Valor del curso', formatearPrecio(c.precio)]];
  const portada = c.foto
    ? `<div class="modal__foto"><img src="${c.foto}" alt="${esc(c.alt)}" width="1200" height="1200"></div>`
    : `<div class="modal__foto modal__foto--placa">${placaHTML(c, 'placa--grande')}<p>${esc(area(c).nombre)}</p></div>`;
  return `
    <div class="modal__grid">
      <div class="modal__lado">
        ${portada}
        <div class="modal__docente">
          <span class="avatar" aria-hidden="true">${DOCENTE.iniciales}</span>
          <div><strong>${esc(DOCENTE.nombre)}</strong><p>${esc(DOCENTE.rol)}</p></div>
        </div>
      </div>
      <div class="modal__info">
        <p class="curso__area">${esc(c.codigo)} · ${esc(area(c).nombre)}</p>
        <h2>${esc(c.titulo)}</h2>
        <p class="modal__promesa">${esc(c.promesa)}</p>
        <div class="ficha-datos">${datos.map(d => `<div><strong>${esc(d[1])}</strong>${esc(d[0])}</div>`).join('')}</div>
        <fieldset class="elegir-mod">
          <legend>Elegí cómo cursarlo</legend>
          <div class="elegir-mod__opciones">${c.modalidades.map(m => `<button class="mod-op" type="button" data-modal-mod="${m}" aria-pressed="${m === modalModalidad}">${ico(m)}${MODALIDADES[m]}</button>`).join('')}</div>
        </fieldset>
        <div class="modal__ctas" id="modal-ctas">${modalCtas(c)}</div>
        <div class="modal__bloque"><h3>Sobre el curso</h3><p>${esc(c.descripcion)}</p></div>
        <div class="modal__bloque"><h3>Lo que vas a aprender</h3><ul class="lista-check">${c.resultados.map(r => `<li>${ico('checkCirculo')}<span>${esc(r)}</span></li>`).join('')}</ul></div>
        <div class="modal__bloque"><h3>Programa</h3><div class="programa">${c.modulos.map((m, i) => moduloHTML(m, i, i === 0)).join('')}</div></div>
        <div class="modal__bloque modal__dos">
          <div><h3>Qué necesitás</h3><ul class="lista-simple">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
          <div><h3>Incluye</h3><ul class="lista-simple">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
        </div>
      </div>
    </div>`;
}
let modalCursoId = '';
function abrirModal(id) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  if (!c || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  modalCursoId = c.id;
  document.getElementById('modal-contenido').innerHTML = modalHTML(c);
  modal.hidden = false;
  modal.querySelector('.modal__caja').scrollTop = 0;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('abierto')));
  setTimeout(() => modal.querySelector('.modal__cerrar')?.focus(), 60);
}
function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('abierto');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  if (document.getElementById('drawer')?.hidden !== false) bloquearScroll(false);
  if (devolverFoco) ultimoFoco?.focus?.({ preventScroll: true });
}

function mensajeInscripcion(items) {
  const lineas = items.map(i => { const c = getCurso(i.id); return `• ${c.titulo} (${MODALIDADES[i.modalidad].toLowerCase()})`; });
  return `Hola Marine, quiero inscribirme en:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Me pasan las fechas de inicio?`;
}
function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer__vacio">${ico('inscripcion')}<p>Todavía no sumaste ningún curso a tu inscripción.</p><a class="btn btn--primary btn--sm" href="#cursos" data-cerrar-drawer>Ver los cursos</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(i => {
    const c = getCurso(i.id);
    const mod = c.modalidades.length > 1
      ? `<label class="drawer__mod"><span class="sr-only">Modalidad de ${esc(c.corto)}</span><select data-drawer-mod="${c.id}">${c.modalidades.map(m => `<option value="${m}"${m === i.modalidad ? ' selected' : ''}>${MODALIDADES[m]}</option>`).join('')}</select></label>`
      : `<span class="drawer__mod-fija">${MODALIDADES[i.modalidad]}</span>`;
    return `
      <div class="drawer__item">
        ${placaHTML(c, 'placa--chica')}
        <div class="drawer__item-txt"><strong>${esc(c.titulo)}</strong><span>${esc(c.duracion)} · ${formatearPrecio(c.precio)}</span>${mod}</div>
        <button class="quitar-btn" type="button" data-quitar="${c.id}" aria-label="Quitar ${esc(c.corto)}">${ico('x')}</button>
      </div>`;
  }).join('');
  foot.innerHTML = `
    <p class="drawer__linea drawer__linea--total"><span>Total de la inscripción</span><span>${formatearPrecio(Cart.total())}</span></p>
    <p class="nota">La enviás por WhatsApp y te respondemos con las fechas de inicio y cómo abonar. Al confirmarla, recibís tu usuario del área de alumnos.</p>
    <a class="btn btn--primary btn--block" id="enviar-inscripcion" href="${wa(mensajeInscripcion(items))}" target="_blank" rel="noopener">Enviar mi inscripción por WhatsApp</a>`;
}
function abrirDrawer() {
  const d = document.getElementById('drawer');
  if (!d) return;
  if (document.getElementById('modal')?.hidden === false) cerrarModal(false);
  else ultimoFoco = document.activeElement;
  renderDrawer();
  d.hidden = false;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  setTimeout(() => d.querySelector('[data-cerrar-drawer]')?.focus(), 60);
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  bloquearScroll(false);
  ultimoFoco?.focus?.({ preventScroll: true });
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

const AULA_KEY = 'marine_aula';
const CONS_KEY = 'marine_consultas';
const aula = Object.assign({ usuario: '', curso: 'seguridad-higiene', clase: '', hechas: [] }, lsGet(AULA_KEY, {}));
if (!getCurso(aula.curso)) aula.curso = 'seguridad-higiene';
if (!Array.isArray(aula.hechas)) aula.hechas = [];
const guardarAula = () => lsSet(AULA_KEY, { usuario: aula.usuario, curso: aula.curso, clase: aula.clase, hechas: aula.hechas });
const EJEMPLOS = {
  'criminalistica-m0-c0': [['Alumna', '¿Para hacer el curso necesito tener algún título?', 0], ['Docente', 'No. Arrancamos desde cero: en el apunte de esta clase tenés el vocabulario básico.', 1]],
  'seguridad-higiene-m0-c0': [['Alumno', '¿La planilla de relevamiento sirve para cualquier rubro?', 0], ['Docente', 'Sí, es general. En el módulo 3 vemos cómo adaptarla a tu lugar de trabajo.', 1]],
  'auxiliar-administrativo-m0-c0': [['Alumna', '¿Las clases quedan grabadas si no puedo verlas en el horario?', 0], ['Docente', 'Sí, quedan acá en el área de alumnos y las mirás cuando puedas.', 1]],
  'maquillaje-social-m0-c0': [['Alumna', '¿El kit lo tengo que tener antes de la primera clase?', 0], ['Docente', 'No hace falta. En esta clase te paso la lista y lo armás para el primer encuentro práctico.', 1]]
};
function clasesDe(c) {
  const out = [];
  c.modulos.forEach((m, i) => m.clases.forEach((cl, j) => out.push({ id: `${c.id}-m${i}-c${j}`, mod: i, n: j, titulo: cl[0], dur: cl[1], tipo: cl[2], abierta: !!cl[3], modulo: m.titulo })));
  return out;
}
const logueado = () => !!aula.usuario;
function claseActual() {
  const lista = clasesDe(getCurso(aula.curso));
  return lista.find(x => x.id === aula.clase) || lista[0];
}
function resaltarIngreso(enfocar = true) {
  const panel = document.getElementById('panel-ingreso');
  if (!panel) return;
  panel.classList.add('resaltar');
  setTimeout(() => panel.classList.remove('resaltar'), 1800);
  if (enfocar && !logueado()) {
    panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => document.getElementById('login-usuario')?.focus({ preventScroll: true }), 450);
  }
}
function renderModulosAula() {
  const cont = document.getElementById('aula-modulos');
  if (!cont) return;
  const c = getCurso(aula.curso);
  const actual = claseActual();
  const lista = clasesDe(c);
  cont.innerHTML = c.modulos.map((m, i) => `
    <details class="aula-mod"${i === actual.mod ? ' open' : ''}>
      <summary><span class="modulo__num">${i + 1}</span><span>${esc(m.titulo)}</span>${ico('chevronAbajo')}</summary>
      <div class="aula-clases">${lista.filter(x => x.mod === i).map(x => {
        const libre = logueado() || x.abierta;
        const hecha = aula.hechas.includes(x.id);
        const estado = hecha ? ico('checkCirculo', 'ico-estado') : libre ? ico(x.tipo, 'ico-estado') : ico('candado', 'ico-estado');
        return `<button class="aula-clase${libre ? '' : ' is-lock'}${hecha ? ' is-hecha' : ''}" type="button" data-clase="${x.id}"${x.id === actual.id ? ' aria-current="true"' : ''}>${estado}<span>${esc(x.titulo)}</span><span class="clase-li__dur">${esc(x.dur)}</span></button>`;
      }).join('')}</div>
    </details>`).join('');
  const hechas = lista.filter(x => aula.hechas.includes(x.id)).length;
  const pct = Math.round((hechas / lista.length) * 100);
  const av = document.getElementById('aula-avance');
  if (av) av.textContent = `${pct} % completado`;
  const barra = document.getElementById('aula-barra');
  if (barra) barra.style.width = `${pct}%`;
}
function renderClase() {
  const x = claseActual();
  const libre = logueado() || x.abierta;
  const c = getCurso(aula.curso);
  const ub = document.getElementById('clase-ubic');
  if (ub) ub.textContent = `${c.codigo} · Módulo ${x.mod + 1} · Clase ${x.n + 1}${x.abierta ? ' · clase abierta' : ''}`;
  const ti = document.getElementById('clase-titulo');
  if (ti) ti.textContent = x.titulo;
  const tipo = document.getElementById('clase-tipo');
  if (tipo) tipo.innerHTML = `${ico(x.tipo)}${TIPO_CLASE[x.tipo]} · ${esc(x.dur)}`;
  const lock = document.getElementById('player-lock');
  if (lock) lock.hidden = libre;
  const play = document.getElementById('player-play');
  if (play) {
    play.hidden = !libre;
    play.setAttribute('aria-label', x.tipo === 'video' ? 'Reproducir la clase' : x.tipo === 'lectura' ? 'Abrir el apunte de la clase' : 'Ver la consigna de la práctica');
  }
  const t = document.getElementById('player-t');
  if (t) t.textContent = x.tipo === 'video' ? `00:00 / ${x.dur}` : x.dur;
  const pdf = document.getElementById('btn-pdf');
  if (pdf) pdf.setAttribute('aria-disabled', String(!libre));
  const comp = document.getElementById('btn-completar');
  if (comp) comp.innerHTML = aula.hechas.includes(x.id) ? `${ico('checkCirculo')}Clase completada` : `Completar y seguir${ico('flecha')}`;
  renderChat();
}
function renderChat() {
  const hilo = document.getElementById('chat-hilo');
  if (!hilo) return;
  const x = claseActual();
  const propias = lsGet(CONS_KEY, {})[x.id] || [];
  const ej = EJEMPLOS[x.id] || [];
  const msgs = ej.map(m => `<div class="msg${m[2] ? ' msg--docente' : ''}"><small>${esc(m[0])} · ejemplo</small>${esc(m[1])}</div>`)
    .concat(propias.map(m => `<div class="msg msg--yo"><small>${esc(aula.usuario || 'Vos')} · ${esc(m.hora)}</small>${esc(m.t)}</div>`));
  hilo.innerHTML = msgs.length ? msgs.join('') : '<p class="chat__vacio">Todavía no hay consultas en esta clase. Dejá la primera.</p>';
  hilo.scrollTop = hilo.scrollHeight;
  const input = document.getElementById('chat-input');
  if (input) input.placeholder = logueado() ? 'Escribí tu consulta para la docente' : 'Ingresá para dejar tu consulta';
}
function renderIngreso() {
  const form = document.getElementById('login-form');
  const alumno = document.getElementById('alumno');
  if (!form || !alumno) return;
  form.hidden = logueado();
  alumno.hidden = !logueado();
  if (logueado()) {
    document.getElementById('alumno-nombre').textContent = aula.usuario;
    document.getElementById('alumno-curso').textContent = getCurso(aula.curso).titulo;
  }
  document.querySelectorAll('[data-acceso-txt]').forEach(el => { el.textContent = logueado() ? `Hola, ${aula.usuario}` : 'Área de alumnos'; });
}
function renderAula() {
  const sel = document.getElementById('aula-curso');
  if (sel) sel.value = aula.curso;
  renderModulosAula();
  renderClase();
  renderIngreso();
}
function irAClase(id) {
  const x = clasesDe(getCurso(aula.curso)).find(y => y.id === id);
  if (!x) return;
  aula.clase = x.id;
  guardarAula();
  renderModulosAula();
  renderClase();
  if (!logueado() && !x.abierta) { showToast('Esa clase se abre cuando ingresás con tu usuario.'); resaltarIngreso(false); }
}
function pdfLatin(s) {
  const mapa = { 8212: 45, 8211: 45, 8220: 34, 8221: 34, 8216: 39, 8217: 39, 8230: 46, 183: 183 };
  const out = [];
  for (const ch of s) {
    let c = ch.codePointAt(0);
    if (c > 255) c = mapa[c] ?? 63;
    if (c === 40 || c === 41 || c === 92) out.push(92);
    out.push(c);
  }
  return out;
}
function partirLinea(txt, max) {
  const lineas = [];
  let l = '';
  txt.split(' ').forEach(p => {
    if ((l + ' ' + p).trim().length > max) { lineas.push(l.trim()); l = p; } else l += ' ' + p;
  });
  if (l.trim()) lineas.push(l.trim());
  return lineas;
}
function crearPDF(bloques) {
  const ascii = s => [...s].map(ch => ch.charCodeAt(0));
  let y = 790;
  const ops = [];
  ops.push(...ascii('0.79 0.64 0.15 rg 56 812 m 70 812 l 64 798 l 50 798 l f 74 812 m 88 812 l 82 798 l 68 798 l f\n'));
  bloques.forEach(b => {
    if (b.regla) { ops.push(...ascii(`0.09 0.09 0.08 RG 0.6 w 56 ${y} m 539 ${y} l S\n`)); y -= b.espacio || 22; return; }
    partirLinea(b.t, b.max || 88).forEach(li => {
      ops.push(...ascii(`BT /${b.bold ? 'F2' : 'F1'} ${b.size} Tf ${b.color || '0.09 0.09 0.08'} rg 56 ${y} Td (`), ...pdfLatin(li), ...ascii(') Tj ET\n'));
      y -= Math.round(b.size * 1.45);
    });
    y -= b.despues ?? 8;
  });
  const objetos = [
    ascii('<< /Type /Catalog /Pages 2 0 R >>'),
    ascii('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    ascii('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>'),
    ascii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),
    ascii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),
    [...ascii(`<< /Length ${ops.length} >>\nstream\n`), ...ops, ...ascii('\nendstream')]
  ];
  const bytes = ascii('%PDF-1.4\n%âãÏÓ\n');
  const offsets = [];
  objetos.forEach((o, i) => { offsets.push(bytes.length); bytes.push(...ascii(`${i + 1} 0 obj\n`), ...o, ...ascii('\nendobj\n')); });
  const xref = bytes.length;
  bytes.push(...ascii(`xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`));
  offsets.forEach(o => bytes.push(...ascii(`${String(o).padStart(10, '0')} 00000 n \n`)));
  bytes.push(...ascii(`trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));
  return new window.Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
}
function descargarPDF() {
  const x = claseActual();
  if (!logueado() && !x.abierta) { showToast('El apunte de esta clase se descarga cuando ingresás con tu usuario.'); resaltarIngreso(false); return; }
  const c = getCurso(aula.curso);
  const blob = crearPDF([
    { t: `MARINE · ${area(c).nombre.toUpperCase()} · ${c.codigo}`, size: 9, bold: true, color: '0.50 0.38 0.06', despues: 14 },
    { t: c.titulo, size: 18, bold: true, max: 50, despues: 6 },
    { t: `Módulo ${x.mod + 1} · ${x.modulo}`, size: 11, color: '0.36 0.35 0.31', despues: 10 },
    { t: `Clase ${x.n + 1}: ${x.titulo}`, size: 14, bold: true, max: 64, despues: 14 },
    { regla: true, espacio: 26 },
    { t: 'Apunte de la clase (material de muestra)', size: 11, bold: true, despues: 6 },
    { t: 'Este archivo muestra cómo se descarga el material de cada clase. En la plataforma, la docente sube su propio apunte desde el panel y cada alumno lo baja desde el área de alumnos, con su usuario y contraseña.', size: 11, despues: 12 },
    { t: 'Para después de la clase', size: 11, bold: true, despues: 6 },
    { t: '1. Repasá los puntos de la clase y marcá lo que no te quedó claro.', size: 11, despues: 2 },
    { t: '2. Hacé el ejercicio del módulo antes de pasar a la clase siguiente.', size: 11, despues: 2 },
    { t: '3. Si te queda una duda, dejala en «Consultas a la docente»: la respuesta queda ahí para todo el curso.', size: 11, despues: 18 },
    { regla: true, espacio: 20 },
    { t: 'Material de muestra de la demo de Marine. Contenido a confirmar.', size: 9, color: '0.36 0.35 0.31' }
  ]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `marine-${c.id}-modulo-${x.mod + 1}-clase-${x.n + 1}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  showToast('Descargaste el apunte de la clase.');
}
function initAula() {
  const sel = document.getElementById('aula-curso');
  if (!sel) return;
  sel.innerHTML = Object.entries(AREAS).map(([id, a]) => `<optgroup label="${esc(a.nombre)}">${CURSOS.filter(c => c.area === id).map(c => `<option value="${c.id}">${esc(c.corto)}</option>`).join('')}</optgroup>`).join('');
  sel.addEventListener('change', () => { aula.curso = sel.value; aula.clase = ''; guardarAula(); renderAula(); });
  document.getElementById('aula-modulos').addEventListener('click', e => {
    const b = e.target.closest('[data-clase]');
    if (b) irAClase(b.dataset.clase);
  });
  document.getElementById('player-play')?.addEventListener('click', () => {
    const x = claseActual();
    if (x.tipo === 'lectura') { descargarPDF(); return; }
    showToast(x.tipo === 'video' ? 'Acá se reproduce el video de la clase. En la plataforma lo sube la docente desde el panel.' : 'Acá aparece la consigna de la práctica, con su fecha si es en el aula.');
  });
  document.getElementById('player-lock')?.addEventListener('click', () => resaltarIngreso());
  document.getElementById('btn-pdf')?.addEventListener('click', descargarPDF);
  document.getElementById('btn-completar')?.addEventListener('click', () => {
    if (!logueado()) { showToast('Ingresá con tu usuario para guardar tu avance.'); resaltarIngreso(); return; }
    const lista = clasesDe(getCurso(aula.curso));
    const x = claseActual();
    if (!aula.hechas.includes(x.id)) aula.hechas.push(x.id);
    const sig = lista[lista.findIndex(y => y.id === x.id) + 1];
    if (sig) { aula.clase = sig.id; showToast('Clase completada. Seguís con la próxima.'); }
    else showToast('Completaste todas las clases del curso.');
    guardarAula();
    renderModulosAula();
    renderClase();
  });
  document.getElementById('chat-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (!logueado()) { showToast('Ingresá con tu usuario para dejar tu consulta.'); resaltarIngreso(); return; }
    const t = input.value.trim();
    if (t.length < 3) { showToast('Escribí tu consulta antes de enviarla.'); input.focus(); return; }
    const todas = lsGet(CONS_KEY, {});
    const x = claseActual();
    todas[x.id] = (todas[x.id] || []).concat({ t, hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) });
    lsSet(CONS_KEY, todas);
    input.value = '';
    renderChat();
    showToast('Consulta enviada. En la plataforma, la docente te responde acá.');
  });
  const form = document.getElementById('login-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-usuario');
    const p = document.getElementById('login-clave');
    let ok = true;
    [[u, u.value.trim().length >= 2, 'err-usuario'], [p, p.value.length >= 4, 'err-clave']].forEach(([el, valido, err]) => {
      el.setAttribute('aria-invalid', String(!valido));
      document.getElementById(err).hidden = valido;
      if (!valido && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Ingresando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Ingresar';
      aula.usuario = u.value.trim().slice(0, 24);
      p.value = '';
      guardarAula();
      renderAula();
      showToast(`¡Hola, ${aula.usuario}! Ya tenés abiertos todos los módulos.`);
    }, 800);
  });
  document.getElementById('logout')?.addEventListener('click', () => {
    aula.usuario = '';
    guardarAula();
    renderAula();
    showToast('Cerraste la sesión del área de alumnos.');
  });
  renderAula();
}

const TESTI_KEY = 'marine_testimonio';
function testimonioHTML(t, pendiente) {
  const c = getCurso(t.curso);
  return `<figure class="testi${pendiente ? ' testi--pendiente' : ''}">${ico('comillas', 'testi__comillas')}<blockquote>${esc(t.texto)}</blockquote><figcaption><strong>${esc(t.nombre)}</strong>${c ? `<span>${esc(c.corto)}</span>` : ''}${pendiente ? '<em>Vista previa · se publica cuando Marine lo revisa</em>' : ''}</figcaption></figure>`;
}
function renderTestimonios() {
  const grilla = document.getElementById('testi-grilla');
  const vacio = document.getElementById('testi-vacio');
  if (!grilla) return;
  const propio = lsGet(TESTI_KEY, null);
  const html = TESTIMONIOS.map(t => testimonioHTML(t, false)).join('') + (propio ? testimonioHTML(propio, true) : '');
  grilla.innerHTML = html;
  grilla.hidden = !html;
  if (vacio) vacio.hidden = TESTIMONIOS.length > 0;
}
function initTestimonios() {
  const form = document.getElementById('testi-form');
  if (!form) return;
  const sel = document.getElementById('testi-curso');
  if (sel) sel.innerHTML = '<option value="">Elegí el curso</option>' + Object.entries(AREAS).map(([id, a]) => `<optgroup label="${esc(a.nombre)}">${CURSOS.filter(c => c.area === id).map(c => `<option value="${c.id}">${esc(c.corto)}</option>`).join('')}</optgroup>`).join('');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('testi-nombre');
    const texto = document.getElementById('testi-texto');
    const ok = document.getElementById('testi-ok');
    const reglas = [[nombre, nombre.value.trim().length >= 2, 'err-testi-nombre'], [sel, !!sel.value, 'err-testi-curso'], [texto, texto.value.trim().length >= 20, 'err-testi-texto'], [ok, ok.checked, 'err-testi-ok']];
    let valido = true;
    reglas.forEach(([el, bien, err]) => {
      el.setAttribute('aria-invalid', String(!bien));
      document.getElementById(err).hidden = bien;
      if (!bien && valido) { el.focus(); valido = false; }
    });
    if (!valido) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Enviar mi testimonio';
      lsSet(TESTI_KEY, { nombre: nombre.value.trim().slice(0, 40), curso: sel.value, texto: texto.value.trim().slice(0, 400) });
      form.reset();
      renderTestimonios();
      showToast('¡Gracias! El envío de testimonios se activa al pasar la web a producción.');
    }, 800);
  });
  renderTestimonios();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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

function irAlAula() {
  document.getElementById('alumnos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver); return; }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      if (Cart.has(c.id)) { abrirDrawer(); return; }
      Cart.add(c, c.modalidades[0]);
      showToast(c.modalidades.length > 1 ? `Sumaste «${c.corto}» (${MODALIDADES[c.modalidades[0]].toLowerCase()}). La modalidad la cambiás en tu inscripción.` : `Sumaste «${c.corto}» a tu inscripción.`);
      return;
    }
    const modBtn = e.target.closest('[data-modal-mod]');
    if (modBtn) {
      modalModalidad = modBtn.dataset.modalMod;
      document.querySelectorAll('[data-modal-mod]').forEach(b => b.setAttribute('aria-pressed', String(b === modBtn)));
      if (Cart.has(modalCursoId)) { Cart.setModalidad(modalCursoId, modalModalidad); showToast(`Cambiaste la modalidad a ${MODALIDADES[modalModalidad].toLowerCase()}.`); }
      return;
    }
    const insYa = e.target.closest('[data-inscribir-ya]');
    if (insYa) {
      const c = getCurso(insYa.dataset.inscribirYa);
      if (c) Cart.add(c, modalModalidad || c.modalidades[0]);
      abrirDrawer();
      return;
    }
    const aulaBtn = e.target.closest('[data-aula]');
    if (aulaBtn) {
      cerrarModal(false);
      aula.curso = aulaBtn.dataset.aula; aula.clase = ''; guardarAula();
      renderAula();
      irAlAula();
      return;
    }
    const filtroBtn = e.target.closest('[data-filtro-area], [data-filtro-mod]');
    if (filtroBtn) {
      aplicarFiltro(filtroBtn.dataset.filtroArea || 'todas', filtroBtn.dataset.filtroMod || '', filtroBtn.tagName !== 'A');
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); renderDrawer(); return; }
    if (e.target.closest('[data-cerrar-modal]')) { cerrarModal(); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (e.target.closest('[data-abrir-carrito]')) { abrirDrawer(); return; }
    const acceso = e.target.closest('[data-acceso]');
    if (acceso) {
      e.preventDefault();
      if (logueado()) { irAlAula(); showToast(`Ya estás en el área de alumnos, ${aula.usuario}.`); }
      else resaltarIngreso();
    }
  });
  document.addEventListener('change', e => {
    const s = e.target.closest('[data-drawer-mod]');
    if (!s) return;
    Cart.setModalidad(s.dataset.drawerMod, s.value);
    const a = document.getElementById('enviar-inscripcion');
    if (a) a.href = wa(mensajeInscripcion(Cart.get()));
  });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modal');
    const drawer = document.getElementById('drawer');
    if (modal && !modal.hidden) { if (e.key === 'Escape') cerrarModal(); else trampaFoco(modal, e); return; }
    if (drawer && !drawer.hidden) { if (e.key === 'Escape') cerrarDrawer(); else trampaFoco(drawer, e); }
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    refrescarBotones();
    const ctas = document.getElementById('modal-ctas');
    const c = getCurso(modalCursoId);
    if (ctas && c && document.getElementById('modal')?.hidden === false) ctas.innerHTML = modalCtas(c);
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirModal(id);
}

renderDestacados();
initCatalogo();
initBuscador();
initAula();
initTestimonios();
initReveals();
initNav();
initFloats();
initModelBarScroll();
initAcciones();
updateCartBadge();
abrirDesdeURL();
