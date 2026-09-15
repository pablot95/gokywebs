/* eslint-disable no-unused-vars -- consumidos por script.js vía scope global */
const WHATSAPP = '5491100000000';

const CATEGORIAS = [
  { id: 'todo', nombre: 'Todo' },
  { id: 'retrato', nombre: 'Retrato' },
  { id: 'paisaje', nombre: 'Paisaje' },
  { id: 'urbano', nombre: 'Urbano' },
  { id: 'producto', nombre: 'Producto' },
  { id: 'video', nombre: 'Video' },
];

const OBRAS = [
  {
    id: 1, slug: 'lo-que-queda-de-la-tarde', titulo: 'Lo que queda de la tarde',
    categoria: 'retrato', tipo: 'foto', anio: 2025, lugar: 'Buenos Aires',
    img: 'images/retrato-bn-luz-1200x1500.webp',
    tecnica: '35mm · f/1.8 · ISO 400',
    descripcion: 'Una sola fuente de luz entrando de costado y el resto librado a la sombra. De la serie de retratos en blanco y negro que vengo haciendo desde 2023, siempre con la misma regla: una ventana, nada de flash.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 2, slug: 'el-que-mira-para-adentro', titulo: 'El que mira para adentro',
    categoria: 'retrato', tipo: 'foto', anio: 2025, lugar: 'Buenos Aires',
    img: 'images/retrato-bn-barba-1200x1500.webp',
    tecnica: '85mm · f/2 · ISO 640',
    descripcion: 'Retrato de estudio con una sola luz cenital. Le pedí que no mirara a cámara durante veinte minutos; esta es la foto número ciento cuatro.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 3, slug: 'rojo-sobre-rojo', titulo: 'Rojo sobre rojo',
    categoria: 'retrato', tipo: 'foto', anio: 2026, lugar: 'Buenos Aires',
    img: 'images/retrato-rojo-1200x1500.webp',
    tecnica: '50mm · f/2.8 · ISO 200',
    descripcion: 'Fondo de papel y un gelatina roja sobre la luz principal. Buscaba que la piel y el fondo compartieran temperatura hasta casi confundirse.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 4, slug: 'once-de-la-manana', titulo: 'Once de la mañana',
    categoria: 'retrato', tipo: 'foto', anio: 2025, lugar: 'La Plata',
    img: 'images/retrato-ventana-1200x1500.webp',
    tecnica: '35mm · f/2 · ISO 100',
    descripcion: 'Luz de ventana pura, sin rebote ni difusor. La foto existe porque esa mañana estaba nublado: el cielo hizo de softbox.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 5, slug: 'cumbres-con-techo-bajo', titulo: 'Cumbres con techo bajo',
    categoria: 'paisaje', tipo: 'foto', anio: 2025, lugar: 'Cordillera',
    img: 'images/paisaje-cumbres-1200x1500.webp',
    tecnica: '24mm · f/8 · ISO 100',
    descripcion: 'Esperé cuatro horas a que la nube bajara hasta la línea de roca. Cuando bajó, duró seis minutos.',
    formatos: 'Copia fine art hasta 90×112 cm · archivo digital 1200×1500',
  },
  {
    id: 6, slug: 'primera-luz', titulo: 'Primera luz',
    categoria: 'paisaje', tipo: 'foto', anio: 2026, lugar: 'Valle de Uco',
    img: 'images/paisaje-amanecer-1200x1500.webp',
    tecnica: '70mm · f/11 · ISO 100',
    descripcion: 'Las capas de sierra se separan solas cuando el sol todavía está abajo del horizonte. Es el único momento del día en que el aire se ve.',
    formatos: 'Copia fine art hasta 90×112 cm · archivo digital 1200×1500',
  },
  {
    id: 7, slug: 'bruma-en-tres-planos', titulo: 'Bruma en tres planos',
    categoria: 'paisaje', tipo: 'foto', anio: 2024, lugar: 'Sierras',
    img: 'images/paisaje-bruma-bn-1200x1500.webp',
    tecnica: '135mm · f/8 · ISO 200',
    descripcion: 'Blanco y negro para que quede solamente lo que me interesaba: la distancia convertida en tono.',
    formatos: 'Copia fine art hasta 90×112 cm · archivo digital 1200×1500',
  },
  {
    id: 8, slug: 'diecisiete-grados', titulo: 'Diecisiete grados',
    categoria: 'urbano', tipo: 'foto', anio: 2025, lugar: 'Buenos Aires',
    img: 'images/urbano-semaforo-1200x1500.webp',
    tecnica: '28mm · f/1.8 · ISO 1600',
    descripcion: 'La avenida vacía y el cartel de temperatura como único dato. Me gusta cuando la ciudad da información que a nadie le sirve.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 9, slug: 'el-turno-noche', titulo: 'El turno noche',
    categoria: 'urbano', tipo: 'foto', anio: 2025, lugar: 'Buenos Aires',
    img: 'images/urbano-vidriera-1200x1500.webp',
    tecnica: '35mm · f/2 · ISO 3200',
    descripcion: 'Un local iluminado a las tres de la mañana y una persona adentro. No hizo falta acercarse más.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 10, slug: 'volver-caminando', titulo: 'Volver caminando',
    categoria: 'urbano', tipo: 'foto', anio: 2024, lugar: 'Rosario',
    img: 'images/urbano-niebla-1200x1500.webp',
    tecnica: '50mm · f/1.4 · ISO 2000',
    descripcion: 'Niebla, una luz de sodio y alguien que vuelve. La foto se armó sola, yo solo esperé a que entrara en el cono de luz.',
    formatos: 'Copia fine art hasta 60×75 cm · archivo digital 1200×1500',
  },
  {
    id: 11, slug: 'naturaleza-muerta-con-piedra', titulo: 'Naturaleza muerta con piedra',
    categoria: 'producto', tipo: 'foto', anio: 2026, lugar: 'Estudio',
    img: 'images/producto-bodegon-1200x1500.webp',
    tecnica: '100mm macro · f/11 · ISO 100',
    descripcion: 'Trabajo comercial que terminó siendo personal. Objetos apilados hasta que el equilibrio se volvió el tema.',
    formatos: 'Uso comercial por 12 o 24 meses · archivo digital 1200×1500',
  },
  {
    id: 12, slug: 'un-solo-gesto', titulo: 'Un solo gesto',
    categoria: 'producto', tipo: 'foto', anio: 2026, lugar: 'Estudio',
    img: 'images/producto-labial-1200x1500.webp',
    tecnica: '100mm macro · f/8 · ISO 100',
    descripcion: 'Producto sobre fondo neutro con discos de vidrio para quebrar el reflejo. Cero retoque de forma: lo que se ve es lo que había.',
    formatos: 'Uso comercial por 12 o 24 meses · archivo digital 1200×1500',
  },
  {
    id: 13, slug: 'materia', titulo: 'Materia',
    categoria: 'video', tipo: 'video', anio: 2026, lugar: 'Estudio',
    img: 'video/reel-humo-poster.webp',
    video: 'video/reel-humo.mp4',
    duracion: '00:07',
    tecnica: '4K · 25 fps · 1/50',
    descripcion: 'Pieza de textura pura: tinta y humo de color sobre fondo negro, filmado a 100 cuadros por segundo y bajado a 25. Se usa como fondo de placas y aperturas.',
    formatos: 'Archivo 4K sin marca de agua · licencia de uso 12 o 24 meses',
  },
  {
    id: 14, slug: 'ciudad-dormida', titulo: 'Ciudad dormida',
    categoria: 'video', tipo: 'video', anio: 2025, lugar: 'Buenos Aires',
    img: 'video/reel-ciudad-poster.webp',
    video: 'video/reel-ciudad.mp4',
    duracion: '00:07',
    tecnica: '4K · 30 fps · 1/60',
    descripcion: 'Plano aéreo nocturno, movimiento lento y continuo. Filmado como plano de apertura para una serie documental.',
    formatos: 'Archivo 4K sin marca de agua · licencia de uso 12 o 24 meses',
  },
  {
    id: 15, slug: 'ritual', titulo: 'Ritual',
    categoria: 'video', tipo: 'video', anio: 2026, lugar: 'Estudio',
    img: 'video/reel-cafe-poster.webp',
    video: 'video/reel-cafe.mp4',
    duracion: '00:07',
    tecnica: '4K · 24 fps · 1/48',
    descripcion: 'Cenital fijo, una sola acción, sin cortes. De la serie de piezas cortas para redes de marcas gastronómicas.',
    formatos: 'Archivo 4K sin marca de agua · licencia de uso 12 o 24 meses',
  },
  {
    id: 16, slug: 'domingo', titulo: 'Domingo',
    categoria: 'video', tipo: 'video', anio: 2025, lugar: 'Buenos Aires',
    img: 'video/reel-retrato-poster.webp',
    video: 'video/reel-retrato.mp4',
    duracion: '00:07',
    tecnica: '4K · 24 fps · 1/48',
    descripcion: 'Retrato en movimiento con luz natural. La idea era que la persona se olvidara de la cámara; tardó una hora.',
    formatos: 'Archivo 4K sin marca de agua · licencia de uso 12 o 24 meses',
  },
];

const FORMAS = [
  {
    id: 'digital', nombre: 'Archivo digital',
    desde: 38000,
    detalle: 'La imagen en alta resolución, sin marca de agua, lista para imprimir donde quieras o usar en tus redes.',
    incluye: ['Archivo a máxima resolución', 'Perfil de color sRGB y Adobe RGB', 'Uso personal, sin límite de tiempo', 'Entrega en 24 h por link de descarga'],
  },
  {
    id: 'copia', nombre: 'Copia fine art',
    desde: 96000,
    detalle: 'Impresión en papel de algodón, firmada y numerada. Edición corta: cuando se agota, no se reimprime.',
    incluye: ['Papel Hahnemühle 308 g', 'Edición de 15 copias, firmada al dorso', 'Certificado de autenticidad', 'Envío a todo el país en tubo rígido'],
    destacado: true,
  },
  {
    id: 'licencia', nombre: 'Licencia comercial',
    desde: 145000,
    detalle: 'Para marcas y agencias: foto o video con permiso de uso comercial por tiempo y territorio definidos.',
    incluye: ['Foto o video en máxima calidad', 'Uso comercial por 12 o 24 meses', 'Cesión por escrito con alcance claro', 'Ajustes de encuadre y color incluidos'],
  },
];

const FAQS = [
  {
    q: '¿Puedo pedir una foto que no está en el sitio?',
    a: 'Sí. Lo que ves acá es una selección chica; el archivo completo tiene bastante más. Contame qué buscás (tema, clima, orientación, dónde lo vas a usar) y te mando opciones por WhatsApp.',
  },
  {
    q: '¿Cómo se define el precio de una copia?',
    a: 'Depende del tamaño y de la edición. Los valores de la sección "Qué te llevás" son el punto de partida; el precio final te lo paso por escrito antes de que confirmes nada.',
  },
  {
    q: '¿Qué significa que la edición sea de 15 copias?',
    a: 'Que de esa imagen se imprimen 15 copias en total y después no se vuelve a imprimir en ese tamaño. Cada una va firmada y numerada al dorso.',
  },
  {
    q: '¿Puedo usar una foto tuya para mi marca?',
    a: 'Sí, con licencia comercial. Se acuerda por escrito para qué medios, en qué territorio y por cuánto tiempo. Sin ese acuerdo, la compra de una copia o un archivo es solo para uso personal.',
  },
  {
    q: '¿Hacés trabajos por encargo?',
    a: 'Sí, tanto foto como video: retrato, producto, piezas cortas para redes y cobertura de eventos. Escribime con la fecha y la idea y te paso disponibilidad y presupuesto.',
  },
  {
    q: '¿Cómo se paga y cuánto tarda?',
    a: 'Transferencia o efectivo. El archivo digital se entrega dentro de las 24 h; las copias impresas tardan entre 7 y 10 días hábiles más el envío.',
  },
];
