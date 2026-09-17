document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491152207981';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const PRODUCTOS = [
  {
    id: 1, type: 'product', tipoUI: 'fragancia', slug: 'oud-esmeralda', nombre: 'Oud Esmeralda',
    categoria: 'Árabes', origen: 'Árabe', familia: 'Amaderada', precio: 9800, descuento: 0, stock: 24,
    imagen: 'images/perfume-miniaturas.webp', alt: 'Miniaturas de perfume de 5 ml sobre un plato blanco',
    destacado: true, reventa: true, notas: 'Oud, vetiver y un fondo de musgo',
    variantes: [{ key: '5ml', label: '5 ml', precio: 9800 }, { key: '10ml', label: '10 ml', precio: 16400 }],
    descripcionCorta: 'Amaderada intensa, la que más se repite entre quienes arrancan con árabes.',
    descripcionCompleta: 'Abre seca y amaderada, y a los veinte minutos aparece el musgo. Rinde mucho: con dos aplicaciones te dura la jornada entera, así que la miniatura de 5 ml se estira más de lo que parece. Es la que recomendamos para probar el mundo oud sin pagar un frasco de 100 ml.'
  },
  {
    id: 2, type: 'product', tipoUI: 'fragancia', slug: 'ambar-nocturno', nombre: 'Ámbar Nocturno',
    categoria: 'Árabes', origen: 'Árabe', familia: 'Oriental', precio: 10200, descuento: 0, stock: 18,
    imagen: 'images/perfume-ambar.webp', alt: 'Frasco de perfume ámbar con detalles dorados',
    destacado: true, reventa: true, notas: 'Ámbar, vainilla y canela',
    variantes: [{ key: '5ml', label: '5 ml', precio: 10200 }, { key: '10ml', label: '10 ml', precio: 17500 }],
    descripcionCorta: 'Oriental dulce para la noche, con ámbar y un toque de canela.',
    descripcionCompleta: 'Es golosa sin empachar: ámbar y vainilla adelante, canela atrás. Funciona mejor de noche y en otoño o invierno. Entre las mujeres que compran para revender es la que sale sola en salidas y fiestas.'
  },
  {
    id: 3, type: 'product', tipoUI: 'fragancia', slug: 'majlis-dorado', nombre: 'Majlis Dorado',
    categoria: 'Árabes', origen: 'Árabe', familia: 'Oriental', precio: 11500, descuento: 10, stock: 12,
    imagen: 'images/perfume-arabe.webp', alt: 'Frasco de perfume árabe con etiqueta dorada sobre seda',
    destacado: true, reventa: true, notas: 'Incienso, rosa y sándalo',
    variantes: [{ key: '5ml', label: '5 ml', precio: 11500 }, { key: '10ml', label: '10 ml', precio: 19900 }],
    descripcionCorta: 'Incienso y rosa: la más ceremoniosa de la vitrina.',
    descripcionCompleta: 'La que más se parece a lo que se usa en el Golfo: incienso arriba, rosa en el medio y sándalo abajo. No es para todos los días; es para cuando querés que se note que entraste. Se vende bien de regalo.'
  },
  {
    id: 4, type: 'product', tipoUI: 'fragancia', slug: 'rosa-de-damasco', nombre: 'Rosa de Damasco',
    categoria: 'Árabes', origen: 'Árabe', familia: 'Floral', precio: 9400, descuento: 0, stock: 20,
    imagen: 'images/perfume-oro.webp', alt: 'Frasco de perfume con tapa dorada sobre fondo negro',
    destacado: true, reventa: true, notas: 'Rosa, pimienta rosa y almizcle',
    variantes: [{ key: '5ml', label: '5 ml', precio: 9400 }, { key: '10ml', label: '10 ml', precio: 15800 }],
    descripcionCorta: 'Rosa de verdad, sin el costado jabonoso de las florales baratas.',
    descripcionCompleta: 'Rosa con pimienta rosa arriba y almizcle abajo, que es lo que la sostiene sobre la piel. Es la puerta de entrada más fácil: quien nunca usó un árabe la acepta de una.'
  },
  {
    id: 5, type: 'product', tipoUI: 'fragancia', slug: 'sandalo-privado', nombre: 'Sándalo Privado',
    categoria: 'Árabes', origen: 'Árabe', familia: 'Amaderada', precio: 10900, descuento: 0, stock: 14,
    imagen: 'images/perfume-oro.webp', alt: 'Frasco de perfume con tapa dorada sobre superficie negra',
    destacado: false, reventa: true, notas: 'Sándalo, cardamomo y cuero suave',
    variantes: [{ key: '5ml', label: '5 ml', precio: 10900 }, { key: '10ml', label: '10 ml', precio: 18600 }],
    descripcionCorta: 'Sándalo cremoso con cardamomo: amaderada pero abrigada.',
    descripcionCompleta: 'Más redonda que el oud y más fácil de llevar a la oficina. El cardamomo le da un arranque especiado que baja en media hora y deja el sándalo solo. Unisex real, no “unisex” de etiqueta.'
  },
  {
    id: 6, type: 'product', tipoUI: 'fragancia', slug: 'citrico-cristal', nombre: 'Cítrico Cristal',
    categoria: 'Europeas', origen: 'Europea', familia: 'Cítrica', precio: 8600, descuento: 0, stock: 26,
    imagen: 'images/perfume-cristal.webp', alt: 'Frasco de perfume de vidrio labrado sobre fondo claro',
    destacado: true, reventa: true, notas: 'Bergamota, limón y cedro',
    variantes: [{ key: '5ml', label: '5 ml', precio: 8600 }, { key: '10ml', label: '10 ml', precio: 14500 }],
    descripcionCorta: 'Cítrica limpia para el día, la que piden para la oficina y el verano.',
    descripcionCompleta: 'Bergamota y limón que duran poco solos, apoyados en cedro para que aguanten la mañana. Es la fragancia más segura del catálogo: nunca molesta a nadie y se termina rápido, así que quien la prueba vuelve.'
  },
  {
    id: 7, type: 'product', tipoUI: 'fragancia', slug: 'vetiver-salino', nombre: 'Vetiver Salino',
    categoria: 'Europeas', origen: 'Europea', familia: 'Cítrica', precio: 9100, descuento: 0, stock: 16,
    imagen: 'images/perfume-esmeralda.webp', alt: 'Frasco de perfume iluminado en verde sobre fondo oscuro',
    destacado: true, reventa: true, notas: 'Vetiver, sal marina y pomelo',
    variantes: [{ key: '5ml', label: '5 ml', precio: 9100 }, { key: '10ml', label: '10 ml', precio: 15200 }],
    descripcionCorta: 'Fresca con fondo mineral: verano sin el cítrico obvio.',
    descripcionCompleta: 'Arranca con pomelo y termina en vetiver con una nota salada que la vuelve distinta a todas las frescas del mostrador. Buena para hombres que dicen “no quiero nada dulce”.'
  },
  {
    id: 8, type: 'product', tipoUI: 'fragancia', slug: 'vainilla-tabaco', nombre: 'Vainilla Tabaco',
    categoria: 'Europeas', origen: 'Europea', familia: 'Dulce', precio: 9900, descuento: 15, stock: 22,
    imagen: 'images/perfume-ambar.webp', alt: 'Frasco de perfume con líquido ámbar y detalles dorados',
    destacado: true, reventa: true, notas: 'Vainilla, tabaco y tonka',
    variantes: [{ key: '5ml', label: '5 ml', precio: 9900 }, { key: '10ml', label: '10 ml', precio: 16900 }],
    descripcionCorta: 'Dulce con carácter: vainilla y tabaco, no vainilla de postre.',
    descripcionCompleta: 'La vainilla está cortada con tabaco y tonka, así que no queda infantil. Deja rastro en el abrigo y en la bufanda, que es justo lo que busca quien la compra. De las que más se repiten en el segundo pedido.'
  },
  {
    id: 9, type: 'product', tipoUI: 'fragancia', slug: 'jazmin-blanco', nombre: 'Jazmín Blanco',
    categoria: 'Europeas', origen: 'Europea', familia: 'Floral', precio: 8900, descuento: 0, stock: 15,
    imagen: 'images/perfume-cristal.webp', alt: 'Frasco de perfume de vidrio con detalles dorados',
    destacado: false, reventa: true, notas: 'Jazmín, neroli y almizcle blanco',
    variantes: [{ key: '5ml', label: '5 ml', precio: 8900 }, { key: '10ml', label: '10 ml', precio: 15400 }],
    descripcionCorta: 'Floral blanca y luminosa, la de uso diario para primavera.',
    descripcionCompleta: 'Jazmín y neroli sobre almizcle blanco: suave, prolija, de las que se usan todos los días sin pensar. Se vende mucho para regalar en fechas.'
  },
  {
    id: 10, type: 'product', tipoUI: 'fragancia', slug: 'cuero-negro', nombre: 'Cuero Negro',
    categoria: 'Europeas', origen: 'Europea', familia: 'Amaderada', precio: 11200, descuento: 0, stock: 10,
    imagen: 'images/perfume-arabe.webp', alt: 'Frasco de perfume con etiqueta grabada sobre tela marrón',
    destacado: false, reventa: true, notas: 'Cuero, azafrán y abedul',
    variantes: [{ key: '5ml', label: '5 ml', precio: 11200 }, { key: '10ml', label: '10 ml', precio: 19100 }],
    descripcionCorta: 'Cuero y azafrán para quien ya probó de todo.',
    descripcionCompleta: 'La más difícil de la vitrina y la que más fideliza: cuero con azafrán arriba y abedul ahumado abajo. No se recomienda como primera compra; se recomienda cuando alguien vuelve y pide “algo distinto”.'
  },
  {
    id: 11, type: 'product', tipoUI: 'fragancia', slug: 'pack-descubri-4', nombre: 'Pack Descubrí · 4 x 5 ml',
    categoria: 'Packs', origen: 'Pack', familia: 'Surtido', precio: 32500, descuento: 0, stock: 12,
    imagen: 'images/pack-muestras.webp', alt: 'Cuatro miniaturas de perfume numeradas sobre seda',
    destacado: true, reventa: true, notas: 'Cuatro familias distintas para probar',
    descripcionCorta: 'Cuatro miniaturas de 5 ml, una por familia, para descubrir sin jugarse a una sola.',
    descripcionCompleta: 'Viene con una amaderada, una oriental, una cítrica y una floral, cada una en su frasco de 5 ml numerado. Es el pack que usan quienes van a revender para mostrar en mano: se abre, se prueba en la muñeca y se vende la que más gustó.'
  },
  {
    id: 12, type: 'product', tipoUI: 'fragancia', slug: 'pack-vitrina-8', nombre: 'Pack Vitrina · 8 x 5 ml',
    categoria: 'Packs', origen: 'Pack', familia: 'Surtido', precio: 61900, descuento: 10, stock: 8,
    imagen: 'images/vitrina.webp', alt: 'Estantes con frascos de perfume en miniatura',
    destacado: false, reventa: true, notas: 'Las ocho de la vitrina, en miniatura',
    descripcionCorta: 'Las ocho fragancias de la vitrina en 5 ml: el arranque completo para revender.',
    descripcionCompleta: 'Ocho miniaturas, cuatro árabes y cuatro europeas, con la lista de notas impresa para que sepas qué contar de cada una. Es el pack con el que se arma una primera vitrina propia sin adivinar qué comprar.'
  },
  {
    id: 13, type: 'product', tipoUI: 'ebook', slug: 'vender-por-whatsapp', nombre: 'Vender perfumes por WhatsApp',
    categoria: 'Ebooks', origen: 'Ebook', familia: 'Ventas', precio: 6900, descuento: 0, digital: true,
    paginas: 48, derechoReventa: true, destacado: true, coverNum: '01',
    descripcionCorta: 'Los mensajes exactos para responder, ofrecer y cerrar sin perseguir a nadie.',
    descripcionCompleta: 'Cuarenta y ocho páginas con la conversación completa: cómo abrir sin parecer catálogo, qué contestar cuando preguntan el precio primero, cómo ofrecer el segundo perfume y cómo cerrar el envío. Incluye quince mensajes listos para copiar y adaptar. Viene con derecho de reventa: lo podés vender con tu propio precio.'
  },
  {
    id: 14, type: 'product', tipoUI: 'ebook', slug: 'familias-olfativas', nombre: 'Familias olfativas en 30 minutos',
    categoria: 'Ebooks', origen: 'Ebook', familia: 'Producto', precio: 5400, descuento: 0, digital: true,
    paginas: 32, derechoReventa: false, destacado: false, coverNum: '02',
    descripcionCorta: 'Para saber qué recomendar cuando te dicen “algo fresco pero que dure”.',
    descripcionCompleta: 'Las cinco familias explicadas con ejemplos de la vitrina, qué notas las componen y con qué piel y estación funciona cada una. Al final hay una tabla de una página para tener al lado del celular mientras vendés.'
  },
  {
    id: 15, type: 'product', tipoUI: 'ebook', slug: 'lista-de-precios', nombre: 'Armá tu lista de precios',
    categoria: 'Ebooks', origen: 'Ebook', familia: 'Números', precio: 7200, descuento: 20, digital: true,
    paginas: 40, derechoReventa: true, destacado: true, coverNum: '03',
    descripcionCorta: 'Cómo poner precio a una miniatura sin quedarte sin margen ni espantar al cliente.',
    descripcionCompleta: 'Cómo calcular el costo real (frasco, envase, etiqueta, envío y tu tiempo), qué margen deja cada formato y cómo armar los combos que suben el ticket. Trae la planilla en PDF para completar a mano y el ejemplo resuelto de un pedido de doce unidades. Viene con derecho de reventa.'
  },
  {
    id: 16, type: 'product', tipoUI: 'ebook', slug: 'packaging-simple', nombre: 'Packaging simple para reventa',
    categoria: 'Ebooks', origen: 'Ebook', familia: 'Producto', precio: 5900, descuento: 0, digital: true,
    paginas: 28, derechoReventa: false, destacado: false, coverNum: '04',
    descripcionCorta: 'Envasado, etiquetas y entrega prolija con lo que se consigue acá.',
    descripcionCompleta: 'Qué frascos comprar, cómo trasvasar sin perder producto, qué poner en la etiqueta para que se vea serio y cómo armar el paquete para que llegue entero. Con las medidas de etiqueta listas para imprimir.'
  }
];

const CURSOS = [
  {
    id: 1, type: 'course', tipoUI: 'curso', slug: 'negocio-de-miniaturas', titulo: 'Tu negocio de perfumes en miniatura',
    categoria: 'Formación completa', nivel: 'Inicial', modalidad: 'Grabado', precio: 78000, descuento: 15,
    duracion: '4 h 20 min', cantidadClases: 18, destacado: true, insignia: true, coverNum: '01',
    descripcionCorta: 'De cero a tu primer pedido armado, con precios, fotos y mensajes listos.',
    descripcionCompleta: 'La formación completa: qué fragancias comprar primero, cómo envasar y etiquetar, cómo poner precio con margen, cómo mostrar en Instagram y WhatsApp y cómo hacer el segundo pedido mirando lo que se vendió. Cada módulo termina en algo hecho, no en apuntes.',
    resultados: ['Tu lista de precios con margen calculado', 'Tu primer pedido de reventa armado', 'Diez publicaciones y quince mensajes listos'],
    requisitos: ['No hace falta experiencia previa', 'Un celular con cámara', 'Presupuesto inicial para 6 a 12 unidades'],
    incluye: ['18 clases grabadas', 'Planilla de precios en PDF', 'Medidas de etiquetas para imprimir', 'Consultas por WhatsApp mientras cursás'],
    modulos: [
      { titulo: 'Qué comprar primero', clases: [
        { titulo: 'Las cinco familias y qué se vende en tu zona', duracion: '14 min', tipo: 'video', preview: true },
        { titulo: 'Árabes y europeas: diferencias reales', duracion: '12 min', tipo: 'video' },
        { titulo: 'Armar la primera vitrina con 6 unidades', duracion: '16 min', tipo: 'video' },
        { titulo: 'Planilla: tu lista de compra', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'Envasado y presentación', clases: [
        { titulo: 'Trasvasar sin perder producto', duracion: '11 min', tipo: 'video' },
        { titulo: 'Etiquetas: qué tiene que decir', duracion: '9 min', tipo: 'video' },
        { titulo: 'El paquete que llega entero', duracion: '13 min', tipo: 'video' }
      ] },
      { titulo: 'Precio y margen', clases: [
        { titulo: 'Costo real de una miniatura', duracion: '15 min', tipo: 'video' },
        { titulo: 'Tres formas de armar combos', duracion: '12 min', tipo: 'video' },
        { titulo: 'Cuándo conviene subir el precio', duracion: '10 min', tipo: 'video' },
        { titulo: 'Planilla de precios resuelta', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'Mostrar y vender', clases: [
        { titulo: 'Fotos con el celular y luz de casa', duracion: '17 min', tipo: 'video' },
        { titulo: 'Cómo se cuenta una fragancia', duracion: '14 min', tipo: 'video' },
        { titulo: 'WhatsApp: abrir, ofrecer, cerrar', duracion: '19 min', tipo: 'video' },
        { titulo: '15 mensajes listos', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'El segundo pedido', clases: [
        { titulo: 'Leer qué se vendió y qué quedó', duracion: '13 min', tipo: 'video' },
        { titulo: 'Cuándo pasar a pedidos más grandes', duracion: '12 min', tipo: 'video' },
        { titulo: 'Clientes que vuelven solos', duracion: '11 min', tipo: 'video' }
      ] }
    ]
  },
  {
    id: 2, type: 'course', tipoUI: 'curso', slug: 'elegir-fragancias', titulo: 'Cómo elegir qué fragancias comprar',
    categoria: 'Producto', nivel: 'Inicial', modalidad: 'Grabado', precio: 34000, descuento: 0,
    duracion: '1 h 40 min', cantidadClases: 9, destacado: true, coverNum: '02',
    descripcionCorta: 'Para no comprar diez frascos y vender tres.',
    descripcionCompleta: 'El criterio para armar una vitrina que rote: qué familias conviven, cuántas unidades por fragancia y cómo probar una nueva sin arriesgar el capital del mes.',
    resultados: ['Una vitrina de 8 fragancias elegida con criterio', 'Un método para sumar fragancias nuevas'],
    requisitos: ['Ninguno'],
    incluye: ['9 clases grabadas', 'Tabla de familias en PDF'],
    modulos: [
      { titulo: 'Leer tu clientela', clases: [
        { titulo: 'Qué pide cada tipo de cliente', duracion: '12 min', tipo: 'video', preview: true },
        { titulo: 'Zona, clima y estación', duracion: '10 min', tipo: 'video' },
        { titulo: 'Preguntas que hacen elegir', duracion: '11 min', tipo: 'video' }
      ] },
      { titulo: 'Armar el surtido', clases: [
        { titulo: 'Cuántas unidades por fragancia', duracion: '13 min', tipo: 'video' },
        { titulo: 'Las que nunca fallan', duracion: '12 min', tipo: 'video' },
        { titulo: 'Las que fidelizan', duracion: '10 min', tipo: 'video' }
      ] },
      { titulo: 'Probar sin arriesgar', clases: [
        { titulo: 'La regla de las dos unidades', duracion: '9 min', tipo: 'video' },
        { titulo: 'Qué hacer con lo que no rota', duracion: '12 min', tipo: 'video' },
        { titulo: 'Tabla de familias', duracion: 'PDF', tipo: 'pdf' }
      ] }
    ]
  },
  {
    id: 3, type: 'course', tipoUI: 'curso', slug: 'decants-envasado', titulo: 'Decants: armado, envasado y etiquetas',
    categoria: 'Producto', nivel: 'Inicial', modalidad: 'Grabado', precio: 42000, descuento: 0,
    duracion: '2 h', cantidadClases: 10, destacado: true, coverNum: '03',
    descripcionCorta: 'El taller completo para que tus miniaturas se vean de local, no de casa.',
    descripcionCompleta: 'Insumos, trasvase, sellado, etiqueta y control final. Está filmado en la mesa de trabajo, con los mismos frascos y embudos que usamos todos los días.',
    resultados: ['Un procedimiento de envasado propio', 'Etiquetas listas para imprimir'],
    requisitos: ['Frascos y embudo (la lista está en la clase 1)'],
    incluye: ['10 clases grabadas', 'Lista de insumos', 'Plantilla de etiquetas'],
    modulos: [
      { titulo: 'Insumos', clases: [
        { titulo: 'Qué frascos comprar y cuáles no', duracion: '13 min', tipo: 'video', preview: true },
        { titulo: 'Embudos, pipetas y sellos', duracion: '10 min', tipo: 'video' },
        { titulo: 'Lista de insumos', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'El trasvase', clases: [
        { titulo: 'Paso a paso sin desperdicio', duracion: '16 min', tipo: 'video' },
        { titulo: 'Errores que arruinan el frasco', duracion: '11 min', tipo: 'video' },
        { titulo: 'Higiene y conservación', duracion: '12 min', tipo: 'video' }
      ] },
      { titulo: 'Etiqueta y control', clases: [
        { titulo: 'Qué dice una etiqueta seria', duracion: '10 min', tipo: 'video' },
        { titulo: 'Imprimir en casa que se vea bien', duracion: '14 min', tipo: 'video' },
        { titulo: 'Control final antes de entregar', duracion: '9 min', tipo: 'video' },
        { titulo: 'Plantilla de etiquetas', duracion: 'PDF', tipo: 'pdf' }
      ] }
    ]
  },
  {
    id: 4, type: 'course', tipoUI: 'curso', slug: 'precios-y-margen', titulo: 'Precios y margen para reventa',
    categoria: 'Números', nivel: 'Intermedio', modalidad: 'Grabado', precio: 39000, descuento: 10,
    duracion: '2 h 10 min', cantidadClases: 11, destacado: true, coverNum: '04',
    descripcionCorta: 'Cuánto te queda de verdad y cómo subir el ticket sin perder clientes.',
    descripcionCompleta: 'Costos ocultos, margen por formato, combos, descuentos que no te comen la ganancia y qué hacer cuando sube el costo de reposición.',
    resultados: ['Tu lista de precios con margen definido', 'Dos combos armados con números'],
    requisitos: ['Tener al menos un pedido hecho'],
    incluye: ['11 clases grabadas', 'Planilla de costos', 'Ejemplos resueltos'],
    modulos: [
      { titulo: 'Costo real', clases: [
        { titulo: 'Todo lo que se paga por unidad', duracion: '14 min', tipo: 'video', preview: true },
        { titulo: 'Tu tiempo también es costo', duracion: '11 min', tipo: 'video' },
        { titulo: 'Planilla de costos', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'Precio de venta', clases: [
        { titulo: 'Margen por formato: 5 y 10 ml', duracion: '13 min', tipo: 'video' },
        { titulo: 'Precio de lista y precio de amigo', duracion: '12 min', tipo: 'video' },
        { titulo: 'Cuándo no conviene vender', duracion: '10 min', tipo: 'video' },
        { titulo: 'Reposición: qué hacer si sube el costo', duracion: '13 min', tipo: 'video' }
      ] },
      { titulo: 'Subir el ticket', clases: [
        { titulo: 'Combos que se venden solos', duracion: '15 min', tipo: 'video' },
        { titulo: 'Descuentos que no te comen', duracion: '12 min', tipo: 'video' },
        { titulo: 'Segunda venta al mismo cliente', duracion: '14 min', tipo: 'video' },
        { titulo: 'Ejemplos resueltos', duracion: 'PDF', tipo: 'pdf' }
      ] }
    ]
  },
  {
    id: 5, type: 'course', tipoUI: 'curso', slug: 'contenido-que-vende', titulo: 'Contenido que vende en Instagram',
    categoria: 'Ventas', nivel: 'Intermedio', modalidad: 'Grabado', precio: 38000, descuento: 0,
    duracion: '1 h 55 min', cantidadClases: 10, destacado: false, coverNum: '05',
    descripcionCorta: 'Fotos, videos cortos y textos para que te escriban sin pautar.',
    descripcionCompleta: 'Cómo se fotografía un frasco chico con luz de casa, qué se filma de un envasado, qué se escribe debajo y cada cuánto publicar para que el perfil no se apague.',
    resultados: ['Diez publicaciones armadas', 'Un guion de video de envasado'],
    requisitos: ['Un celular con cámara'],
    incluye: ['10 clases grabadas', 'Guiones de video', 'Textos de ejemplo'],
    modulos: [
      { titulo: 'La foto', clases: [
        { titulo: 'Luz de ventana y fondos que tenés', duracion: '15 min', tipo: 'video', preview: true },
        { titulo: 'Cómo se ve grande un frasco chico', duracion: '12 min', tipo: 'video' },
        { titulo: 'Edición con el celular', duracion: '11 min', tipo: 'video' }
      ] },
      { titulo: 'El video', clases: [
        { titulo: 'Qué filmar de un envasado', duracion: '13 min', tipo: 'video' },
        { titulo: 'Guion de 20 segundos', duracion: '10 min', tipo: 'video' },
        { titulo: 'Guiones listos', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'El texto y el ritmo', clases: [
        { titulo: 'Qué se escribe debajo de la foto', duracion: '12 min', tipo: 'video' },
        { titulo: 'Historias que traen mensajes', duracion: '14 min', tipo: 'video' },
        { titulo: 'Un calendario que se puede sostener', duracion: '11 min', tipo: 'video' },
        { titulo: 'Textos de ejemplo', duracion: 'PDF', tipo: 'pdf' }
      ] }
    ]
  },
  {
    id: 6, type: 'course', tipoUI: 'curso', slug: 'escalar-a-mayorista', titulo: 'Escalá a pedidos mayoristas',
    categoria: 'Negocio', nivel: 'Avanzado', modalidad: 'Grabado', precio: 56000, descuento: 0,
    duracion: '2 h 30 min', cantidadClases: 10, destacado: false, coverNum: '06',
    descripcionCorta: 'Cuándo y cómo pasar de vender de a una a mover pedidos grandes.',
    descripcionCompleta: 'Cómo se calcula el punto en el que conviene comprar más, cómo se organiza el stock, cómo se atiende a quien te compra para revender y qué controles necesitás para no perder plata en el camino.',
    resultados: ['Un plan de compra para tres meses', 'Una lista mayorista propia'],
    requisitos: ['Estar vendiendo con regularidad'],
    incluye: ['10 clases grabadas', 'Plan de compra en PDF', 'Modelo de lista mayorista'],
    modulos: [
      { titulo: 'El salto', clases: [
        { titulo: 'Cuándo conviene comprar más', duracion: '14 min', tipo: 'video', preview: true },
        { titulo: 'Capital de trabajo sin ahogarse', duracion: '13 min', tipo: 'video' },
        { titulo: 'Plan de compra a tres meses', duracion: 'PDF', tipo: 'pdf' }
      ] },
      { titulo: 'Stock y orden', clases: [
        { titulo: 'Contar lo que tenés sin planilla eterna', duracion: '12 min', tipo: 'video' },
        { titulo: 'Reponer antes de quedarte sin', duracion: '11 min', tipo: 'video' },
        { titulo: 'Guardar perfume sin arruinarlo', duracion: '13 min', tipo: 'video' }
      ] },
      { titulo: 'Vender a quien revende', clases: [
        { titulo: 'Armar tu propia lista mayorista', duracion: '16 min', tipo: 'video' },
        { titulo: 'Mínimos y condiciones claras', duracion: '12 min', tipo: 'video' },
        { titulo: 'Atender sin que te coma el día', duracion: '14 min', tipo: 'video' },
        { titulo: 'Modelo de lista mayorista', duracion: 'PDF', tipo: 'pdf' }
      ] }
    ]
  }
];

const BUNDLE = {
  id: 'kit-arranque',
  titulo: 'Kit para arrancar',
  detalle: 'El pack de cuatro miniaturas, la guía de WhatsApp y el curso de entrada, en un solo precio.',
  productLines: [{ id: 11, variantKey: null, qty: 1 }, { id: 13, variantKey: null, qty: 1 }],
  courseIds: [2],
  precioBundle: 66400
};

const CATALOGO = [...PRODUCTOS, ...CURSOS];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCurso = id => CURSOS.find(c => c.id === id);
const nombreDe = item => item?.type === 'course' ? item.titulo : item?.nombre;

function precioBase(item, variantKey) {
  if (!item) return 0;
  if (variantKey && item.variantes) {
    const v = item.variantes.find(x => x.key === variantKey);
    if (v) return v.precio;
  }
  return item.precio;
}
function precioFinal(item, variantKey) {
  const base = precioBase(item, variantKey);
  return item?.descuento > 0 ? Math.round(base * (1 - item.descuento / 100)) : base;
}
function esDigital(item) {
  return item?.type === 'course' || item?.digital === true;
}
function claveDe(item, variantKey) {
  return item.type === 'course' ? `course:${item.id}` : `product:${item.id}${variantKey ? ':' + variantKey : ''}`;
}
function resolverClave(key) {
  const partes = String(key).split(':');
  if (partes[0] === 'course') return { item: getCurso(Number(partes[1])), variantKey: null };
  return { item: getProducto(Number(partes[1])), variantKey: partes[2] || null };
}

const Cart = {
  KEY: 'esmeraldaoro_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(item, variantKey = null, qty = 1) {
    if (!item) return;
    const key = claveDe(item, variantKey);
    const items = this.get();
    const linea = items.find(i => i.key === key);
    if (item.type === 'course') {
      if (!linea) items.push({ key, type: 'course', id: item.id, variantKey: null, qty: 1 });
    } else {
      const tope = item.stock ?? 99;
      if (linea) linea.qty = Math.min(linea.qty + qty, tope);
      else items.push({ key, type: 'product', id: item.id, variantKey, qty: Math.min(qty, tope) });
    }
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get();
    const linea = items.find(i => i.key === key);
    if (!linea) return;
    const { item } = resolverClave(key);
    if (item?.type === 'course') { linea.qty = 1; this.save(items); return; }
    linea.qty = Math.max(1, Math.min(qty, item?.stock ?? 99));
    this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => i.key !== key)); },
  clear() { this.save([]); },
  lineas() { return this.get().filter(l => resolverClave(l.key).item); },
  count() { return this.lineas().length; },
  unidades() { return this.lineas().reduce((s, l) => s + l.qty, 0); },
  total() {
    return this.lineas().reduce((s, l) => {
      const { item, variantKey } = resolverClave(l.key);
      return s + precioFinal(item, variantKey) * l.qty;
    }, 0);
  },
  totalPorTipo(digital) {
    return this.lineas().reduce((s, l) => {
      const { item, variantKey } = resolverClave(l.key);
      if (esDigital(item) !== digital) return s;
      return s + precioFinal(item, variantKey) * l.qty;
    }, 0);
  },
  tiene(key) { return this.get().some(i => i.key === key); }
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

const ICONOS = {
  fragancia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3h4v3h-4zM8 9a4 4 0 0 1 4-3h0a4 4 0 0 1 4 3l1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/></svg>',
  ebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 7h7M8 11h7"/></svg>',
  curso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8l9-4 9 4-9 4zM7 11v5c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"/></svg>'
};
const ETIQUETA_TIPO = { fragancia: 'Fragancia', ebook: 'Ebook', curso: 'Curso' };

function coverHTML(item) {
  const num = item.coverNum || '00';
  const variante = (Number(num) % 4) + 1;
  const pie = item.type === 'course' ? `${esc(item.nivel)} · ${item.cantidadClases} clases` : `PDF · ${item.paginas} páginas`;
  const tema = item.type === 'course' ? item.categoria : item.familia;
  return `<div class="cover cover-v${variante}"><span class="cover-num">${esc(num)}</span><span class="cover-tit">${esc(tema)}</span><span class="cover-pie">${pie}</span></div>`;
}

function mediaHTML(item) {
  if (item.imagen) {
    return `<img src="${item.imagen}" alt="${esc(item.alt || nombreDe(item))}" width="1400" height="1400" decoding="async">`;
  }
  return coverHTML(item);
}

function precioHTML(item, variantKey) {
  const final = precioFinal(item, variantKey);
  const base = precioBase(item, variantKey);
  const desde = item.variantes && !variantKey ? '<em>desde</em>' : '';
  return `${desde}<b>${formatearPrecio(final)}</b>${item.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}`;
}

function metaHTML(item) {
  if (item.type === 'course') return `${esc(item.nivel)} · ${esc(item.modalidad)} · ${item.cantidadClases} clases · ${esc(item.duracion)}`;
  if (item.tipoUI === 'ebook') return `${item.paginas} páginas · PDF${item.derechoReventa ? ' · con derecho de reventa' : ''}`;
  if (item.categoria === 'Packs') return `${esc(item.notas)}`;
  return `${esc(item.origen)} · ${esc(item.familia)} · 5 y 10 ml`;
}

function cardHTML(item, opciones = {}) {
  const tipo = item.tipoUI;
  const conTipo = opciones.conTipo !== false;
  const variantKey = item.variantes ? item.variantes[0].key : null;
  const acciones = item.type === 'course'
    ? `<div class="prod-actions"><button type="button" class="btn btn-cta prod-add" data-ver-curso="${item.slug}">Ver el curso</button></div>`
    : `<div class="prod-actions">
         <span class="stepper" data-stepper>
           <button type="button" data-paso="-1" aria-label="Quitar una unidad">−</button>
           <span data-qty>1</span>
           <button type="button" data-paso="1" aria-label="Sumar una unidad">+</button>
         </span>
         <button type="button" class="btn btn-cta prod-add" data-agregar="${item.id}" data-variante="${variantKey || ''}">Agregar</button>
       </div>`;
  const abre = item.type === 'course' ? `data-ver-curso="${item.slug}"` : `data-ver-producto="${item.slug}"`;
  return `<article class="card" data-tipo="${tipo}" data-animate style="opacity:0;transform:translateY(18px)">
    <button type="button" class="card-media" ${abre} aria-label="Ver la ficha de ${esc(nombreDe(item))}">
      ${mediaHTML(item)}
      ${item.tipoUI === 'ebook' ? '<span class="etiqueta etiqueta-digital">Acceso digital</span>' : ''}
      ${item.descuento > 0 ? `<span class="card-desc">−${item.descuento}%</span>` : ''}
    </button>
    ${conTipo ? `<span class="card-tipo">${ICONOS[tipo]}${ETIQUETA_TIPO[tipo]}</span>` : `<span class="card-tipo">${esc(item.familia || item.categoria)}</span>`}
    <h3 class="card-nombre">${esc(nombreDe(item))}</h3>
    <p class="card-meta">${metaHTML(item)}</p>
    <p class="card-precio">${precioHTML(item, item.variantes ? null : variantKey)}</p>
    ${acciones}
  </article>`;
}

/* ---------- rail de la vitrina ---------- */
function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacadas = PRODUCTOS.filter(p => p.destacado && p.tipoUI === 'fragancia').slice(0, 8);
  track.innerHTML = destacadas.map(p => cardHTML(p, { conTipo: false })).join('');

  const vp = document.getElementById('railVp');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp) return;

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.querySelector('.card')?.getBoundingClientRect().width || 240) + 14;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  let abajo = false, moved = false, x0 = 0, scroll0 = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    abajo = true; moved = false; x0 = e.clientX; scroll0 = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = scroll0 - dx;
  });
  const fin = () => {
    if (!abajo) return;
    abajo = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      const matarClick = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matarClick, { capture: true, once: true });
      setTimeout(() => {
        vp.removeEventListener('click', matarClick, { capture: true });
        vp.classList.remove('dragging');
      }, 60);
    }
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('pointerleave', fin);
}

/* ---------- momento propio: pedido de reventa ---------- */
const pedido = new Map();
let listaReventa = [];
let filtroLista = 'todas';

function itemsReventa() {
  return PRODUCTOS.filter(p => p.reventa).filter(p => filtroLista === 'todas' || p.categoria === filtroLista);
}

function renderFilasReventa() {
  const cont = document.getElementById('filasReventa');
  if (!cont) return;
  listaReventa = itemsReventa();
  cont.innerHTML = listaReventa.map(p => {
    const unitario = precioFinal(p, p.variantes ? '5ml' : null);
    const n = pedido.get(p.id) || 0;
    return `<div class="fila${n > 0 ? ' con-unidades' : ''}" data-fila="${p.id}" data-animate style="opacity:0;transform:translateY(14px)">
      <span class="fila-foto"><img src="${p.imagen}" alt="${esc(p.alt || p.nombre)}" width="1400" height="1400" decoding="async"></span>
      <span class="fila-nombre"><b>${esc(p.nombre)}</b><em>${p.categoria === 'Packs' ? esc(p.notas) : `${esc(p.origen)} · ${esc(p.familia)}`} · ${p.stock} disponibles</em></span>
      <span class="fila-precio">${formatearPrecio(unitario)}<small>${p.categoria === 'Packs' ? 'por pack' : 'por unidad de 5 ml'}</small></span>
      <span class="stepper fila-stepper">
        <button type="button" data-pedido="-1" data-id="${p.id}" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
        <span data-pedido-qty="${p.id}">${n}</span>
        <button type="button" data-pedido="1" data-id="${p.id}" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
      </span>
      <span class="fila-sub" data-pedido-sub="${p.id}">${n > 0 ? formatearPrecio(unitario * n) : '—'}</span>
    </div>`;
  }).join('');
  const largo = document.getElementById('pedidoLargo');
  if (largo) largo.textContent = String(listaReventa.length);
  revelarNuevos(cont);
  actualizarRecorrido();
}

function totalPedido() {
  let unidades = 0, total = 0;
  pedido.forEach((n, id) => {
    const p = getProducto(id);
    if (!p || n <= 0) return;
    unidades += n;
    total += precioFinal(p, p.variantes ? '5ml' : null) * n;
  });
  return { unidades, total };
}

function renderPanelPedido() {
  const lista = document.getElementById('pedidoLista');
  const { unidades, total } = totalPedido();
  if (lista) {
    const filas = [];
    pedido.forEach((n, id) => {
      const p = getProducto(id);
      if (!p || n <= 0) return;
      const sub = precioFinal(p, p.variantes ? '5ml' : null) * n;
      filas.push(`<li><span>${esc(p.nombre)} × ${n}</span><b>${formatearPrecio(sub)}</b></li>`);
    });
    lista.innerHTML = filas.length ? filas.join('') : '<li class="pedido-vacio">Todavía no sumaste unidades. Empezá por la primera fila.</li>';
  }
  const u = document.getElementById('pedidoUnidades');
  const t = document.getElementById('pedidoTotal');
  const un = document.getElementById('pedidoUnitario');
  if (u) u.textContent = String(unidades);
  if (t) t.textContent = formatearPrecio(total);
  if (un) un.textContent = unidades ? formatearPrecio(total / unidades) : '—';
}

function setPedido(id, delta) {
  const p = getProducto(id);
  if (!p) return;
  const actual = pedido.get(id) || 0;
  const nuevo = Math.max(0, Math.min(actual + delta, p.stock ?? 99));
  if (nuevo === actual) return;
  if (nuevo === 0) pedido.delete(id); else pedido.set(id, nuevo);
  const qty = document.querySelector(`[data-pedido-qty="${id}"]`);
  if (qty) qty.textContent = String(nuevo);
  const sub = document.querySelector(`[data-pedido-sub="${id}"]`);
  if (sub) sub.textContent = nuevo > 0 ? formatearPrecio(precioFinal(p, p.variantes ? '5ml' : null) * nuevo) : '—';
  const fila = document.querySelector(`[data-fila="${id}"]`);
  fila?.classList.toggle('con-unidades', nuevo > 0);
  if (delta > 0 && fila) volarAlPanel(fila);
  renderPanelPedido();
}

function volarAlPanel(fila) {
  if (reduceMotion) return;
  const foto = fila.querySelector('.fila-foto');
  const destino = document.querySelector('.pedido-tit');
  if (!foto || !destino) return;
  const a = foto.getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'fila-ghost';
  ghost.innerHTML = foto.innerHTML;
  ghost.style.left = a.left + 'px';
  ghost.style.top = a.top + 'px';
  ghost.style.width = a.width + 'px';
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(.42)`;
    ghost.style.opacity = '0';
  });
  setTimeout(() => ghost.remove(), 700);
}

function actualizarRecorrido() {
  const cont = document.getElementById('filasReventa');
  const salida = document.getElementById('pedidoRecorrido');
  const barra = document.getElementById('pedidoBarra');
  if (!cont || !salida) return;
  const filas = [...cont.querySelectorAll('.fila')];
  if (!filas.length) { salida.textContent = '0'; if (barra) barra.style.width = '0%'; return; }
  const corte = window.innerHeight * 0.75;
  let vistas = 0;
  filas.forEach(f => { if (f.getBoundingClientRect().top < corte) vistas++; });
  vistas = Math.max(0, Math.min(vistas, filas.length));
  salida.textContent = String(vistas);
  if (barra) barra.style.width = (vistas / filas.length * 100).toFixed(1) + '%';
}

function initReventa() {
  renderFilasReventa();
  renderPanelPedido();
  const cont = document.getElementById('filasReventa');
  cont?.addEventListener('click', e => {
    const btn = e.target.closest('[data-pedido]');
    if (!btn) return;
    setPedido(Number(btn.dataset.id), Number(btn.dataset.pedido));
  });
  document.querySelectorAll('.reventa-tabs .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.reventa-tabs .pill').forEach(p => { p.classList.remove('activa'); p.setAttribute('aria-selected', 'false'); });
      pill.classList.add('activa');
      pill.setAttribute('aria-selected', 'true');
      filtroLista = pill.dataset.lista;
      renderFilasReventa();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
  document.getElementById('pedidoAlCarrito')?.addEventListener('click', () => {
    const { unidades } = totalPedido();
    if (!unidades) { showToast('Sumá al menos una unidad para pasar el pedido.'); return; }
    pedido.forEach((n, id) => {
      const p = getProducto(id);
      if (p && n > 0) Cart.add(p, p.variantes ? '5ml' : null, n);
    });
    pedido.clear();
    renderFilasReventa();
    renderPanelPedido();
    showToast(`Pasamos ${unidades} unidades al carrito.`);
    abrirDrawer();
  });
  window.addEventListener('scroll', actualizarRecorrido, { passive: true });
  window.addEventListener('resize', actualizarRecorrido);
}

/* ---------- componente funcional: calculadora de reventa ---------- */
function costoPromedio(formato) {
  const fragancias = PRODUCTOS.filter(p => p.tipoUI === 'fragancia' && p.variantes);
  if (!fragancias.length) return 0;
  const suma = fragancias.reduce((s, p) => s + precioFinal(p, formato === '10' ? '10ml' : '5ml'), 0);
  return Math.round(suma / fragancias.length);
}

function calcular() {
  const unidades = Math.max(1, Math.min(200, Number(document.getElementById('calcUnidades')?.value) || 1));
  const formato = document.getElementById('calcFormato')?.value || '5';
  const venta = Math.max(0, Number(document.getElementById('calcVenta')?.value) || 0);
  const costo = costoPromedio(formato);
  const inversion = costo * unidades;
  const ingreso = venta * unidades;
  const ganancia = ingreso - inversion;
  const margen = ingreso > 0 ? (ganancia / ingreso) * 100 : 0;
  const set = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };
  set('calcInversion', formatearPrecio(inversion));
  set('calcIngreso', formatearPrecio(ingreso));
  set('calcGanancia', formatearPrecio(ganancia));
  set('calcUnidad', formatearPrecio(venta - costo));
  set('calcMargen', `${margen.toFixed(0)}%`);
  const nota = document.getElementById('calcNota');
  if (nota) nota.textContent = `Tomamos ${formatearPrecio(costo)} por unidad: es el promedio de las miniaturas de ${formato} ml de esta vitrina.`;
  const armar = document.getElementById('calcArmar');
  if (armar) armar.textContent = `Armar el pedido con ${unidades} unidades`;
  const wsp = document.getElementById('calcWsp');
  if (wsp) {
    const msg = `Hola Esmeralda & Oro. Estoy viendo la reventa: ${unidades} unidades de ${formato} ml, con un costo estimado de ${formatearPrecio(inversion)} y precio de venta de ${formatearPrecio(venta)} por unidad. ¿Me confirman disponibilidad?`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
  return { unidades, costo, ganancia };
}

function armarPedidoDesdeCalculadora() {
  const { unidades } = calcular();
  const candidatas = PRODUCTOS.filter(p => p.tipoUI === 'fragancia' && p.reventa)
    .sort((a, b) => precioFinal(a, '5ml') - precioFinal(b, '5ml'));
  if (!candidatas.length) return;
  pedido.clear();
  let restantes = unidades;
  let i = 0;
  while (restantes > 0 && i < 400) {
    const p = candidatas[i % candidatas.length];
    const actual = pedido.get(p.id) || 0;
    if (actual < (p.stock ?? 99)) { pedido.set(p.id, actual + 1); restantes--; }
    i++;
  }
  filtroLista = 'todas';
  document.querySelectorAll('.reventa-tabs .pill').forEach(p => {
    const activa = p.dataset.lista === 'todas';
    p.classList.toggle('activa', activa);
    p.setAttribute('aria-selected', activa ? 'true' : 'false');
  });
  renderFilasReventa();
  renderPanelPedido();
  document.getElementById('reventa')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  showToast(`Repartimos ${unidades} unidades de 5 ml en la lista. Ajustá lo que quieras.`);
}

function initCalculadora() {
  ['calcUnidades', 'calcFormato', 'calcVenta'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calcular);
    document.getElementById(id)?.addEventListener('change', calcular);
  });
  document.getElementById('calcArmar')?.addEventListener('click', armarPedidoDesdeCalculadora);
  calcular();
}

/* ---------- ebooks y bundle ---------- */
function initEbooks() {
  const grid = document.getElementById('ebooksGrid');
  if (grid) {
    grid.innerHTML = PRODUCTOS.filter(p => p.tipoUI === 'ebook').map(p => `
      <article class="ebook" data-animate style="opacity:0;transform:translateY(20px)">
        ${coverHTML(p)}
        <div class="curso-chips">
          <span class="etiqueta etiqueta-digital">Acceso digital</span>
          ${p.derechoReventa ? '<span class="etiqueta">Con derecho de reventa</span>' : ''}
        </div>
        <h3 class="ebook-nombre">${esc(p.nombre)}</h3>
        <p class="ebook-meta">${esc(p.descripcionCorta)}</p>
        <p class="card-precio">${precioHTML(p, null)}</p>
        <div class="prod-actions">
          <button type="button" class="btn btn-cta prod-add" data-agregar="${p.id}" data-variante="">Agregar</button>
        </div>
        <button type="button" class="card-ver" data-ver-producto="${p.slug}">Ver qué trae</button>
      </article>`).join('');
  }

  const cont = document.getElementById('bundleKit');
  if (!cont) return;
  const lineas = BUNDLE.productLines.map(l => ({ item: getProducto(l.id), qty: l.qty, variantKey: l.variantKey }))
    .filter(l => l.item);
  const cursos = BUNDLE.courseIds.map(id => getCurso(id)).filter(Boolean);
  const suelto = lineas.reduce((s, l) => s + precioFinal(l.item, l.variantKey) * l.qty, 0)
    + cursos.reduce((s, c) => s + precioFinal(c, null), 0);
  const ahorro = suelto - BUNDLE.precioBundle;
  cont.innerHTML = `
    <p class="eyebrow">Combo</p>
    <h3 class="bundle-tit">${esc(BUNDLE.titulo)}</h3>
    <ul>
      ${lineas.map(l => `<li>${ICONOS.check}<span>${esc(nombreDe(l.item))}</span></li>`).join('')}
      ${cursos.map(c => `<li>${ICONOS.check}<span>Curso «${esc(c.titulo)}»</span></li>`).join('')}
    </ul>
    <p class="bundle-precio"><b>${formatearPrecio(BUNDLE.precioBundle)}</b><s>${formatearPrecio(suelto)}</s></p>
    ${ahorro > 0 ? `<p class="bundle-ahorro">Ahorrás ${formatearPrecio(ahorro)} comprándolo junto</p>` : ''}
    <button type="button" class="btn btn-cta btn-bloque" id="bundleAdd">Agregar el kit</button>
    <p class="nota">${esc(BUNDLE.detalle)}</p>`;
  document.getElementById('bundleAdd')?.addEventListener('click', () => {
    lineas.forEach(l => Cart.add(l.item, l.variantKey, l.qty));
    cursos.forEach(c => Cart.add(c, null, 1));
    showToast('Sumamos el kit: pack, guía y curso.');
    abrirDrawer();
  });
}

/* ---------- academia ---------- */
let nivelCursos = 'todos';
function renderCursos() {
  const grid = document.getElementById('cursosGrid');
  if (!grid) return;
  const lista = CURSOS.filter(c => nivelCursos === 'todos' || c.nivel === nivelCursos);
  grid.innerHTML = lista.map(c => `
    <article class="curso">
      ${coverHTML(c)}
      <div class="curso-chips">
        <span class="etiqueta etiqueta-plana">${esc(c.modalidad)}</span>
        <span class="etiqueta etiqueta-plana">${esc(c.nivel)}</span>
        <span class="etiqueta etiqueta-plana">${c.cantidadClases} clases</span>
        ${c.insignia ? '<span class="etiqueta">Formación completa</span>' : ''}
      </div>
      <h3 class="curso-nombre">${esc(c.titulo)}</h3>
      <p class="curso-desc">${esc(c.descripcionCorta)}</p>
      <div class="curso-pie">
        <span class="precio">${formatearPrecio(precioFinal(c, null))}${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}</span>
        <button type="button" class="btn btn-linea" data-ver-curso="${c.slug}">Ver el curso</button>
      </div>
    </article>`).join('');
}

function initAcademia() {
  renderCursos();
  document.querySelectorAll('.academia-cab .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.academia-cab .pill').forEach(p => { p.classList.remove('activa'); p.setAttribute('aria-selected', 'false'); });
      pill.classList.add('activa');
      pill.setAttribute('aria-selected', 'true');
      nivelCursos = pill.dataset.nivel;
      renderCursos();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function modulosHTML(curso, abrirPrimero) {
  return curso.modulos.map((m, i) => `
    <details class="modulo"${abrirPrimero && i === 0 ? ' open' : ''}>
      <summary><span class="modulo-num">${String(i + 1).padStart(2, '0')}</span>${esc(m.titulo)}</summary>
      <ul class="modulo-clases">
        ${m.clases.map(cl => `<li>${cl.tipo === 'pdf' ? ICONOS.pdf : ICONOS.play}<span>${esc(cl.titulo)}${cl.preview ? ' · clase abierta' : ''}</span><span class="dur">${esc(cl.duracion)}</span></li>`).join('')}
      </ul>
    </details>`).join('');
}

function initTemario() {
  const curso = CURSOS.find(c => c.insignia) || CURSOS[0];
  const cont = document.getElementById('temarioModulos');
  const aside = document.getElementById('temarioAside');
  if (!curso) return;
  if (cont) cont.innerHTML = modulosHTML(curso, true);
  if (aside) {
    aside.innerHTML = `
      ${coverHTML(curso)}
      <p class="inscripcion-precio"><b>${formatearPrecio(precioFinal(curso, null))}</b>${curso.descuento > 0 ? `<s>${formatearPrecio(curso.precio)}</s>` : ''}</p>
      <p class="nota nota-pegada">${curso.cantidadClases} clases · ${esc(curso.duracion)} · ${esc(curso.modalidad)}</p>
      <button type="button" class="btn btn-cta btn-bloque" data-sumar-curso="${curso.id}">Inscribirme</button>
      <ul class="incluye">${curso.incluye.map(i => `<li>${ICONOS.check}<span>${esc(i)}</span></li>`).join('')}</ul>
      <p class="nota">La primera clase de cada módulo inicial es de acceso abierto.</p>`;
  }
}

/* ---------- catálogo unificado ---------- */
const PAGINA = 16;
let estado = { tipo: 'todo', q: '', familia: '', origen: '', precio: '', soloDesc: false, visibles: PAGINA };
let revealsListos = false;

function opcionesContexto() {
  const familia = document.getElementById('fFamilia');
  const origen = document.getElementById('fOrigen');
  if (familia) {
    const familias = [...new Set(PRODUCTOS.filter(p => p.tipoUI === 'fragancia').map(p => p.familia))];
    const mostrar = estado.tipo === 'todo' || estado.tipo === 'fragancia';
    familia.innerHTML = '<option value="">Todas</option>' + familias.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join('');
    familia.disabled = !mostrar;
    familia.closest('.campo').hidden = !mostrar;
  }
  if (origen) {
    const OPCIONES = {
      curso: ['Inicial', 'Intermedio', 'Avanzado'],
      fragancia: ['Árabe', 'Europea', 'Pack'],
      ebook: [],
      todo: ['Árabe', 'Europea', 'Pack', 'Inicial', 'Intermedio', 'Avanzado']
    };
    const ETIQUETAS = { curso: 'Nivel', fragancia: 'Origen', ebook: 'Origen o nivel', todo: 'Origen o nivel' };
    const opciones = OPCIONES[estado.tipo] || OPCIONES.todo;
    const label = ETIQUETAS[estado.tipo] || 'Origen o nivel';
    const mostrar = opciones.length > 0;
    origen.innerHTML = '<option value="">Todos</option>' + opciones.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
    origen.disabled = !mostrar;
    origen.closest('.campo').hidden = !mostrar;
    const lab = document.querySelector('label[for="fOrigen"]');
    if (lab) lab.textContent = label;
  }
}

function coincide(item) {
  if (estado.tipo !== 'todo' && item.tipoUI !== estado.tipo) return false;
  if (estado.q) {
    const campos = [nombreDe(item), item.categoria, item.familia, item.origen, item.nivel, item.modalidad,
      item.descripcionCorta, item.descripcionCompleta, item.notas].map(norm).join(' ');
    if (!norm(estado.q).split(/\s+/).filter(Boolean).every(t => campos.includes(t))) return false;
  }
  if (estado.familia && item.familia !== estado.familia) return false;
  if (estado.origen && item.origen !== estado.origen && item.nivel !== estado.origen) return false;
  if (estado.soloDesc && !(item.descuento > 0)) return false;
  if (estado.precio) {
    const [min, max] = estado.precio.split('-').map(Number);
    const p = precioFinal(item, item.variantes ? '5ml' : null);
    if (p < min || p > max) return false;
  }
  return true;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const lista = CATALOGO.filter(coincide);
  const mostrados = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrados.map(i => cardHTML(i)).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  if (contador) {
    contador.textContent = lista.length
      ? `${mostrados.length} de ${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'}`
      : '';
  }
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function reiniciarPagina() { estado.visibles = PAGINA; }

function initCatalogo() {
  opcionesContexto();
  renderCatalogo();
  document.querySelectorAll('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tabs .tab').forEach(t => { t.classList.remove('activa'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('activa');
      tab.setAttribute('aria-selected', 'true');
      estado.tipo = tab.dataset.tipo;
      estado.familia = ''; estado.origen = '';
      reiniciarPagina();
      opcionesContexto();
      renderCatalogo();
    });
  });
  const q = document.getElementById('q');
  q?.addEventListener('input', () => { estado.q = q.value; reiniciarPagina(); renderCatalogo(); });
  document.getElementById('fFamilia')?.addEventListener('change', e => { estado.familia = e.target.value; reiniciarPagina(); renderCatalogo(); });
  document.getElementById('fOrigen')?.addEventListener('change', e => { estado.origen = e.target.value; reiniciarPagina(); renderCatalogo(); });
  document.getElementById('fPrecio')?.addEventListener('change', e => { estado.precio = e.target.value; reiniciarPagina(); renderCatalogo(); });
  document.getElementById('fDesc')?.addEventListener('change', e => { estado.soloDesc = e.target.checked; reiniciarPagina(); renderCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PAGINA; renderCatalogo(); });
  const limpiar = () => {
    estado = { tipo: 'todo', q: '', familia: '', origen: '', precio: '', soloDesc: false, visibles: PAGINA };
    if (q) q.value = '';
    const fp = document.getElementById('fPrecio'); if (fp) fp.value = '';
    const fd = document.getElementById('fDesc'); if (fd) fd.checked = false;
    document.querySelectorAll('.tabs .tab').forEach(t => {
      const activa = t.dataset.tipo === 'todo';
      t.classList.toggle('activa', activa);
      t.setAttribute('aria-selected', activa ? 'true' : 'false');
    });
    opcionesContexto();
    renderCatalogo();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);
  const ft = document.getElementById('filtrosToggle');
  ft?.addEventListener('click', () => {
    const panel = document.getElementById('filtros');
    const abierto = panel?.classList.toggle('abierto');
    ft.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
}

/* ---------- acciones sobre cards ---------- */
function qtyDeCard(el) {
  const stepper = el.closest('.card, .ebook')?.querySelector('[data-stepper] [data-qty]');
  return Math.max(1, Number(stepper?.textContent) || 1);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const salida = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (salida) {
        const n = Math.max(1, (Number(salida.textContent) || 1) + Number(paso.dataset.paso));
        salida.textContent = String(n);
      }
      return;
    }
    const agregar = e.target.closest('[data-agregar]');
    if (agregar) {
      const p = getProducto(Number(agregar.dataset.agregar));
      if (!p) return;
      const variante = agregar.dataset.variante || (p.variantes ? p.variantes[0].key : null);
      Cart.add(p, variante, qtyDeCard(agregar));
      showToast(`${nombreDe(p)} en el carrito.`);
      return;
    }
    const sumar = e.target.closest('[data-sumar-curso]');
    if (sumar) {
      const c = getCurso(Number(sumar.dataset.sumarCurso));
      if (!c) return;
      if (Cart.tiene(claveDe(c, null))) { showToast('Ese curso ya está en el carrito.'); return; }
      Cart.add(c, null, 1);
      showToast(`Inscripción a «${c.titulo}» en el carrito.`);
      return;
    }
    const verP = e.target.closest('[data-ver-producto]');
    if (verP) { abrirFichaProducto(verP.dataset.verProducto); return; }
    const verC = e.target.closest('[data-ver-curso]');
    if (verC) { abrirFichaCurso(verC.dataset.verCurso); return; }
  });
}

/* ---------- modal: fichas ---------- */
let ultimoFoco = null;
let varianteActiva = null;

function trapFoco(cont, e) {
  const foco = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null);
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function cerrarModal() {
  const bd = document.getElementById('modalBackdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  document.getElementById('schema-modal')?.remove();
  ultimoFoco?.focus();
}

function abrirModal(html, schema, titulo) {
  const bd = document.getElementById('modalBackdrop');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!bd || !cuerpo) return;
  ultimoFoco = document.activeElement;
  const tit = document.getElementById('modalTit');
  if (tit && titulo) tit.textContent = titulo;
  cuerpo.innerHTML = html;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  bd.querySelector('.modal').scrollTop = 0;
  document.getElementById('modalClose')?.focus();
  if (schema) {
    document.getElementById('schema-modal')?.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'schema-modal';
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  }
}

function relacionadosHTML(item) {
  let lista = [];
  let titulo = 'También te puede interesar';
  if (item.tipoUI === 'fragancia') {
    lista = PRODUCTOS.filter(p => p.id !== item.id && p.tipoUI === 'fragancia' && (p.familia === item.familia || p.categoria === item.categoria)).slice(0, 3);
  } else if (item.tipoUI === 'ebook') {
    const curso = CURSOS.find(c => c.nivel === 'Inicial');
    if (curso) { lista = [curso]; titulo = 'El curso que sigue a esta guía'; }
  } else {
    const pack = getProducto(11);
    if (pack) { lista = [pack]; titulo = 'Los materiales para hacer las prácticas'; }
  }
  if (!lista.length) return '';
  return `<div class="relacionados">
    <p class="relacionados-tit">${esc(titulo)}</p>
    <div class="relacionados-grid">
      ${lista.map(r => `<button type="button" class="rel" ${r.type === 'course' ? `data-ver-curso="${r.slug}"` : `data-ver-producto="${r.slug}"`}>
        <span class="rel-media">${mediaHTML(r)}</span>
        <b>${esc(nombreDe(r))}</b>
        <span>${formatearPrecio(precioFinal(r, r.variantes ? '5ml' : null))}</span>
      </button>`).join('')}
    </div>
  </div>`;
}

function abrirFichaProducto(slug) {
  const p = PRODUCTOS.find(x => x.slug === slug);
  if (!p) return;
  varianteActiva = p.variantes ? p.variantes[0].key : null;
  const datos = p.tipoUI === 'ebook'
    ? [['Formato', 'PDF'], ['Páginas', String(p.paginas)], ['Reventa', p.derechoReventa ? 'Incluida' : 'No incluida'], ['Entrega', 'A tu casilla']]
    : p.categoria === 'Packs'
      ? [['Contenido', p.notas], ['Formato', '5 ml cada uno'], ['Disponibles', `${p.stock} packs`], ['Entrega', 'A coordinar']]
      : [['Familia', p.familia], ['Origen', p.origen], ['Notas', p.notas], ['Disponibles', `${p.stock} unidades`]];
  const html = `
    <div class="ficha" id="fichaProducto">
      <div class="ficha-media">${mediaHTML(p)}</div>
      <div>
        <div class="ficha-chips">
          <span class="etiqueta${esDigital(p) ? ' etiqueta-digital' : ''}">${esDigital(p) ? 'Acceso digital' : 'Con entrega'}</span>
          <span class="etiqueta etiqueta-plana">${esc(p.categoria)}</span>
          ${p.descuento > 0 ? `<span class="etiqueta">−${p.descuento}%</span>` : ''}
        </div>
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.descripcionCompleta)}</p>
        <dl class="ficha-datos">
          ${datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        ${p.variantes ? `<div class="variantes" role="group" aria-label="Elegí el formato">
          ${p.variantes.map((v, i) => `<button type="button" class="variante${i === 0 ? ' activa' : ''}" data-variante-btn="${v.key}">${esc(v.label)} · ${formatearPrecio(precioFinal(p, v.key))}</button>`).join('')}
        </div>` : ''}
        <p class="ficha-precio" id="fichaPrecio">${precioHTML(p, varianteActiva)}</p>
        <div class="ficha-acciones">
          <span class="stepper" data-stepper>
            <button type="button" data-paso="-1" aria-label="Quitar una unidad">−</button>
            <span data-qty>1</span>
            <button type="button" data-paso="1" aria-label="Sumar una unidad">+</button>
          </span>
          <button type="button" class="btn btn-cta" id="fichaAgregar">Agregar al carrito</button>
          <button type="button" class="btn btn-linea" id="fichaComprar">Comprar ahora</button>
        </div>
        <p class="nota">${esDigital(p) ? 'Al confirmar la compra llega a tu casilla en PDF.' : 'La entrega se coordina por WhatsApp una vez confirmado el pedido.'}</p>
      </div>
    </div>
    ${relacionadosHTML(p)}`;

  const schema = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.descripcionCorta,
    image: p.imagen ? `https://gokywebs.com/demo/esmeraldaoro/${p.imagen}` : undefined,
    category: p.categoria,
    offers: { '@type': 'Offer', price: precioFinal(p, varianteActiva), priceCurrency: 'ARS', availability: (p.stock ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  };
  abrirModal(html, schema, p.nombre);

  const precioEl = document.getElementById('fichaPrecio');
  document.querySelectorAll('[data-variante-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      varianteActiva = btn.dataset.varianteBtn;
      document.querySelectorAll('[data-variante-btn]').forEach(b => b.classList.toggle('activa', b === btn));
      if (precioEl) precioEl.innerHTML = precioHTML(p, varianteActiva);
    });
  });
  const qty = () => Math.max(1, Number(document.querySelector('#fichaProducto [data-qty]')?.textContent) || 1);
  document.getElementById('fichaAgregar')?.addEventListener('click', () => {
    Cart.add(p, varianteActiva, qty());
    showToast(`${p.nombre} en el carrito.`);
  });
  document.getElementById('fichaComprar')?.addEventListener('click', () => {
    Cart.add(p, varianteActiva, qty());
    cerrarModal();
    abrirDrawer();
  });
}

function abrirFichaCurso(slug) {
  const c = CURSOS.find(x => x.slug === slug);
  if (!c) return;
  const html = `
    <div class="ficha">
      <div class="ficha-media">${coverHTML(c)}</div>
      <div>
        <div class="ficha-chips">
          <span class="etiqueta etiqueta-digital">Acceso digital</span>
          <span class="etiqueta etiqueta-plana">${esc(c.nivel)}</span>
          <span class="etiqueta etiqueta-plana">${esc(c.modalidad)}</span>
          ${c.descuento > 0 ? `<span class="etiqueta">−${c.descuento}%</span>` : ''}
        </div>
        <h3>${esc(c.titulo)}</h3>
        <p>${esc(c.descripcionCompleta)}</p>
        <dl class="ficha-datos">
          <div><dt>Clases</dt><dd>${c.cantidadClases}</dd></div>
          <div><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div>
          <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
          <div><dt>Acceso</dt><dd>Con tu usuario</dd></div>
        </dl>
        <p class="ficha-precio"><b>${formatearPrecio(precioFinal(c, null))}</b>${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}</p>
        <div class="ficha-acciones">
          <button type="button" class="btn btn-cta" data-sumar-curso="${c.id}">Inscribirme</button>
        </div>
        <p class="nota">Cantidad 1 por alumno: el acceso es personal.</p>
        <ul class="incluye">${c.incluye.map(i => `<li>${ICONOS.check}<span>${esc(i)}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="modulos-modal">
      <p class="relacionados-tit">Qué vas a ver</p>
      <div class="modulos">${modulosHTML(c, true)}</div>
      <p class="nota"><b>Con qué salís:</b> ${c.resultados.map(esc).join(' · ')}</p>
      <p class="nota"><b>Qué necesitás antes de empezar:</b> ${c.requisitos.map(esc).join(' · ')}</p>
    </div>
    ${relacionadosHTML(c)}`;

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course', name: c.titulo, description: c.descripcionCorta,
    provider: { '@type': 'EducationalOrganization', name: 'Esmeralda & Oro' },
    educationalLevel: c.nivel,
    offers: { '@type': 'Offer', price: precioFinal(c, null), priceCurrency: 'ARS', availability: 'https://schema.org/InStock', category: 'Paid' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: c.duracion }
  };
  abrirModal(html, schema, c.titulo);
}

function initModal() {
  const bd = document.getElementById('modalBackdrop');
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  bd?.addEventListener('click', e => { if (e.target === bd) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (!bd || bd.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trapFoco(bd, e);
  });
}

/* ---------- drawer del carrito ---------- */
function renderDrawer() {
  const cuerpo = document.getElementById('drawerCuerpo');
  const pie = document.getElementById('drawerPie');
  if (!cuerpo || !pie) return;
  const lineas = Cart.lineas();
  if (!lineas.length) {
    cuerpo.innerHTML = `<div class="drawer-vacio">
      <p>Tu carrito está vacío. Podés empezar por una miniatura de 5 ml o por el pack de cuatro.</p>
      <button type="button" class="btn btn-cta" id="drawerIrCatalogo">Ver el catálogo</button>
    </div>`;
    pie.innerHTML = '';
    document.getElementById('drawerIrCatalogo')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }
  const grupo = (digital) => lineas.filter(l => esDigital(resolverClave(l.key).item) === digital);
  const bloque = (titulo, items, nota) => items.length ? `
    <div class="drawer-grupo">
      <p class="drawer-grupo-tit">${esc(titulo)}</p>
      ${items.map(l => {
        const { item, variantKey } = resolverClave(l.key);
        const unit = precioFinal(item, variantKey);
        const esCurso = item.type === 'course';
        return `<div class="linea">
          <span class="linea-foto">${mediaHTML(item)}</span>
          <span class="linea-info">
            <b>${esc(nombreDe(item))}</b>
            <em>${variantKey ? esc(item.variantes.find(v => v.key === variantKey)?.label || variantKey) + ' · ' : ''}${formatearPrecio(unit)}${esCurso ? ' · acceso personal' : ''}</em>
            ${esCurso ? '' : `<span class="stepper linea-stepper">
              <button type="button" data-linea-paso="-1" data-key="${esc(l.key)}" aria-label="Quitar una unidad">−</button>
              <span>${l.qty}</span>
              <button type="button" data-linea-paso="1" data-key="${esc(l.key)}" aria-label="Sumar una unidad">+</button>
            </span>`}
          </span>
          <span class="linea-der">
            <span class="linea-precio">${formatearPrecio(unit * l.qty)}</span>
            <button type="button" class="linea-quitar" data-quitar="${esc(l.key)}">Quitar</button>
          </span>
        </div>`;
      }).join('')}
      <p class="nota">${esc(nota)}</p>
    </div>` : '';

  const digitales = grupo(true);
  const fisicos = grupo(false);
  cuerpo.innerHTML =
    bloque('Acceso digital', digitales, 'Ebooks y cursos: no necesitan envío. El alta del acceso se activa al pasar la web a producción.') +
    bloque('Con entrega a coordinar', fisicos, 'Miniaturas y packs: la entrega se arregla por WhatsApp según tu zona.');

  const subDigital = Cart.totalPorTipo(true);
  const subFisico = Cart.totalPorTipo(false);
  pie.innerHTML = `
    <div class="drawer-totales">
      ${digitales.length ? `<div><span>Acceso digital</span><span>${formatearPrecio(subDigital)}</span></div>` : ''}
      ${fisicos.length ? `<div><span>Productos con entrega</span><span>${formatearPrecio(subFisico)}</span></div>` : ''}
      <div><span>Total</span><span class="total">${formatearPrecio(Cart.total())}</span></div>
    </div>
    <button type="button" class="btn btn-cta btn-bloque" id="finalizar">Finalizar compra</button>
    <button type="button" class="btn btn-texto btn-bloque" id="vaciar">Vaciar el carrito</button>`;
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online, el acceso del alumno y el envío se activan al pasar la web a producción.');
  });
  document.getElementById('vaciar')?.addEventListener('click', () => { Cart.clear(); showToast('Carrito vacío.'); });
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  renderDrawer();
  bd.hidden = false; d.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('abierto'); d.classList.add('abierto'); });
  document.body.classList.add('no-scroll');
  ultimoFoco = document.activeElement;
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd || d.hidden) return;
  d.classList.remove('abierto'); bd.classList.remove('abierto');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  document.getElementById('cartHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  const d = document.getElementById('drawer');
  document.addEventListener('keydown', e => {
    if (!d || d.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trapFoco(d, e);
  });
  d?.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const key = paso.dataset.key;
      const linea = Cart.get().find(l => l.key === key);
      if (linea) Cart.setQty(key, linea.qty + Number(paso.dataset.lineaPaso));
    }
  });
  document.addEventListener('cart:updated', () => { if (!d?.hidden) renderDrawer(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- nav, flotantes, reveals ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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
  sync();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    el.classList.add('in');
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
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

function initMovimiento() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (reduceMotion) return;
  gsap.fromTo('.hero-franja img', { scale: 1.09 }, { scale: 1, duration: 1.5, ease: 'power2.out' });
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.quien-foto img, .ebooks-foto img').forEach(img => {
      gsap.fromTo(img, { yPercent: -3, scale: 1.06 }, {
        yPercent: 3, scale: 1.06, ease: 'none',
        scrollTrigger: { trigger: img.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

function initDeepLinks() {
  const params = new URLSearchParams(location.search);
  const slugP = params.get('producto');
  const slugC = params.get('curso');
  const cat = params.get('cat');
  if (cat) {
    const tab = document.querySelector(`.tabs .tab[data-tipo="${cat}"]`);
    if (tab) tab.click();
  }
  if (slugP && PRODUCTOS.some(p => p.slug === slugP)) abrirFichaProducto(slugP);
  else if (slugC && CURSOS.some(c => c.slug === slugC)) abrirFichaCurso(slugC);
}

document.addEventListener('cart:updated', updateCartBadge);

initRail();
initReventa();
initCalculadora();
initEbooks();
initAcademia();
initTemario();
initCatalogo();
initReveals();
initAcciones();
initModal();
initDrawer();
initNav();
initFloats();
initMovimiento();
initDeepLinks();
updateCartBadge();
const anio = document.getElementById('anio');
if (anio) anio.textContent = String(new Date().getFullYear());
