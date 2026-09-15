/* Datos demo — Compasivamente. Productos, categorías y sesiones. */
const CATEGORIAS = [
  { id: 'aromaterapia', label: 'Aromaterapia' },
  { id: 'ritual', label: 'Ritual' },
  { id: 'practica', label: 'Práctica' },
  { id: 'infusiones', label: 'Infusiones' }
];

const PRODUCTOS = [
  { id: 1, slug: 'vela-de-soja-serenar', nombre: 'Vela de soja "Serenar"', categoria: 'aromaterapia', precio: 8900, descuento: 0, stock: 24, nuevo: false, destacado: true,
    img: 'images/p1-vela.jpg', descripcionCorta: 'Cera de soja y mecha de madera, aroma lavanda y bergamota.',
    descripcion: 'Una vela de cera de soja 100% natural con mecha de madera que cruje suave al encenderse. Su aroma a lavanda y bergamota acompaña tus momentos de pausa. 40 horas de encendido.' },
  { id: 2, slug: 'sahumerios-naturales-x6', nombre: 'Sahumerios naturales x6', categoria: 'aromaterapia', precio: 4500, descuento: 0, stock: 40, nuevo: false, destacado: false,
    img: 'images/p2-sahumerios.jpg', descripcionCorta: 'Set de seis varillas de sahumerio de fragancias suaves.',
    descripcion: 'Seis varillas de sahumerio elaboradas con ingredientes naturales. Ideales para preparar el ambiente antes de meditar o simplemente para habitar tu espacio con más calma.' },
  { id: 3, slug: 'difusor-de-aromas', nombre: 'Difusor de aromas + aceite esencial', categoria: 'aromaterapia', precio: 22900, descuento: 0, stock: 12, nuevo: false, destacado: true,
    img: 'images/p3-difusor.jpg', descripcionCorta: 'Difusor de madera ultrasónico con un aceite esencial de regalo.',
    descripcion: 'Difusor ultrasónico de acabado madera que dispersa aroma y humedad en silencio. Incluye un aceite esencial para que empieces a usarlo desde el primer día. Luz cálida regulable.' },
  { id: 4, slug: 'diario-de-gratitud', nombre: 'Diario de gratitud', categoria: 'practica', precio: 12900, descuento: 0, stock: 30, nuevo: false, destacado: false,
    img: 'images/p4-diario.jpg', descripcionCorta: 'Un diario con consignas para escribir y volver a vos.',
    descripcion: 'Un diario pensado para el hábito de la gratitud: consignas diarias, espacios de reflexión y páginas para registrar lo que agradecés. Tapa dura, papel de calidad, 120 páginas.' },
  { id: 5, slug: 'kit-de-limpieza-energetica', nombre: 'Kit de limpieza energética', categoria: 'ritual', precio: 9900, descuento: 0, stock: 18, nuevo: true, destacado: false,
    img: 'images/p5-kit.jpg', descripcionCorta: 'Palo santo y salvia blanca para tus rituales de despeje.',
    descripcion: 'Un kit con palo santo y salvia blanca de origen responsable para acompañar tus rituales de despeje. Incluye una guía breve para usarlo con intención y cuidado.' },
  { id: 6, slug: 'infusion-relajante-calma', nombre: 'Infusión relajante "Calma"', categoria: 'infusiones', precio: 6500, descuento: 0, stock: 50, nuevo: false, destacado: false,
    img: 'images/p6-infusion.jpg', descripcionCorta: 'Blend de manzanilla, lavanda y melisa para el final del día.',
    descripcion: 'Un blend de hierbas seleccionadas —manzanilla, lavanda y melisa— pensado para acompañar el final del día. 20 saquitos biodegradables en lata reutilizable.' },
  { id: 7, slug: 'set-de-meditacion', nombre: 'Set de meditación', categoria: 'ritual', precio: 34900, descuento: 0, stock: 8, nuevo: false, destacado: true,
    img: 'images/p7-set.jpg', descripcionCorta: 'Cuenco, mazo y cojín para armar tu rincón de práctica.',
    descripcion: 'Todo lo que necesitás para armar tu rincón de meditación: un cuenco con su mazo para el sonido, y un cojín firme que cuida tu postura. Un espacio propio para volver cada día.' },
  { id: 8, slug: 'vela-premium-presencia', nombre: 'Vela premium "Presencia"', categoria: 'aromaterapia', precio: 11900, descuento: 15, stock: 15, nuevo: false, destacado: false,
    img: 'images/p8-velapremium.jpg', descripcionCorta: 'Edición grande de doble mecha, aroma sándalo y vainilla.',
    descripcion: 'Nuestra vela más generosa: doble mecha de algodón, cera de soja y un aroma envolvente a sándalo y vainilla. Pensada para llenar espacios grandes de calidez. 60 horas de encendido.' }
];

const RESERVAS = [
  { id: 'bienvenida', nombre: 'Encuentro de bienvenida', duracion: '30 min', precio: 'Sin cargo', desc: 'Una charla para conocernos y ver cómo podemos acompañarte.' },
  { id: 'individual', nombre: 'Sesión individual de mindfulness', duracion: '60 min', precio: '$15.000', desc: 'Un espacio personal para trabajar la atención plena y la gestión emocional.' },
  { id: 'taller', nombre: 'Taller grupal de meditación', duracion: '90 min', precio: '$8.000', desc: 'Encuentro en grupo para practicar meditación guiada y compartir.' },
  { id: 'programa', nombre: 'Programa de acompañamiento', duracion: '4 encuentros', precio: '$52.000', desc: 'Un recorrido de cuatro encuentros para sostener el cambio en el tiempo.' }
];
