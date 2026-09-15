window.WHATSAPP = '5491126889718';
window.INSTAGRAM_USER = 'los.exclusivos.ranch';
window.ENVIO_GRATIS_DESDE = 25000;

window.CATEGORIAS = [
  { id: 'fiambres',   nombre: 'Fiambres',   emoji: '🥓', img: 'images/cat-fiambres.jpg',   desc: 'Cortados al momento' },
  { id: 'quesos',     nombre: 'Quesos',     emoji: '🧀', img: 'images/cat-quesos.jpg',     desc: 'De horma y estacionados' },
  { id: 'avicola',    nombre: 'Avícola',    emoji: '🍗', img: 'images/cat-avicola.jpg',    desc: 'Elaboración propia de pollo' },
  { id: 'congelados', nombre: 'Congelados', emoji: '❄️', img: 'images/cat-congelados.jpg', desc: 'Listos para el horno' },
  { id: 'almacen',    nombre: 'Almacén',    emoji: '🫒', img: 'images/cat-almacen.jpg',    desc: 'Para acompañar la picada' },
];

window.PRODUCTOS = [
  {
    id: 'jamon-cocido', nombre: 'Jamón cocido natural', categoria: 'fiambres', marca: 'Los Exclusivos',
    precio: 9800, descuento: 0, stock: 40, unidad: 'por kg', img: 'images/prod-jamon-cocido.jpg',
    destacado: true, badge: 'Más pedido', tags: ['jamon', 'cocido', 'sandwich', 'natural', 'feteado'],
    desc: 'Jamón cocido natural, sin fosfatos agregados, feteado fino en el momento. El clásico infaltable para el sándwich, la tostada o la picada de todos los días.'
  },
  {
    id: 'jamon-crudo', nombre: 'Jamón crudo estacionado', categoria: 'fiambres', marca: 'Selección Ranch',
    precio: 18500, descuento: 10, stock: 22, unidad: 'por kg', img: 'images/prod-jamon-crudo.jpg',
    destacado: true, badge: '', tags: ['jamon', 'crudo', 'estacionado', 'picada', 'premium'],
    desc: 'Estacionado más de 12 meses, de textura sedosa y sabor intenso. Ideal para una tabla de picada de las que se recuerdan.'
  },
  {
    id: 'salame-milan', nombre: 'Salame tipo Milán', categoria: 'fiambres', marca: 'Los Exclusivos',
    precio: 12400, descuento: 0, stock: 35, unidad: 'por kg', img: 'images/prod-salame-milan.jpg',
    destacado: true, badge: '', tags: ['salame', 'milan', 'embutido', 'picada'],
    desc: 'Salame tipo Milán de grano fino, curado lento y equilibrado. Se corta parejo y rinde en cualquier tabla.'
  },
  {
    id: 'mortadela', nombre: 'Mortadela con pistachos', categoria: 'fiambres', marca: 'Los Exclusivos',
    precio: 8900, descuento: 0, stock: 30, unidad: 'por kg', img: 'images/prod-mortadela.jpg',
    destacado: false, badge: '', tags: ['mortadela', 'pistachos', 'sandwich', 'feteado'],
    desc: 'Mortadela suave con pistachos enteros, jugosa y aromática. Perfecta en sándwich caliente o en cubos para la picada.'
  },
  {
    id: 'salamin', nombre: 'Salamín tipo Colonia', categoria: 'fiambres', marca: 'Selección Ranch',
    precio: 13200, descuento: 0, stock: 28, unidad: 'por kg', img: 'images/prod-salamin.jpg',
    destacado: false, badge: 'Nuevo', tags: ['salamin', 'colonia', 'embutido', 'picada'],
    desc: 'Salamín tipo Colonia, fino y sabroso, con el punto justo de secado. Un infaltable de la picada argentina.'
  },
  {
    id: 'bondiola', nombre: 'Bondiola ahumada', categoria: 'fiambres', marca: 'Selección Ranch',
    precio: 16900, descuento: 0, stock: 18, unidad: 'por kg', img: 'images/prod-bondiola.jpg',
    destacado: false, badge: '', tags: ['bondiola', 'ahumada', 'cerdo', 'picada'],
    desc: 'Bondiola de cerdo curada y ahumada a leña, tierna y con aroma profundo. Se luce sola o con un buen pan.'
  },
  {
    id: 'lomo-ahumado', nombre: 'Lomo ahumado', categoria: 'fiambres', marca: 'Selección Ranch',
    precio: 17500, descuento: 0, stock: 16, unidad: 'por kg', img: 'images/prod-lomo-ahumado.jpg',
    destacado: false, badge: '', tags: ['lomo', 'ahumado', 'cerdo', 'premium', 'picada'],
    desc: 'Lomo de cerdo ahumado, magro y delicado. Un fiambre fino para las tablas más cuidadas.'
  },
  {
    id: 'cremoso', nombre: 'Queso cremoso', categoria: 'quesos', marca: 'Los Exclusivos',
    precio: 7900, descuento: 0, stock: 45, unidad: 'por kg', img: 'images/prod-cremoso.jpg',
    destacado: true, badge: 'Más pedido', tags: ['queso', 'cremoso', 'sandwich', 'untable'],
    desc: 'Queso cremoso fresco, tierno y de sabor suave. El que funde perfecto en la tostada y no puede faltar en la heladera.'
  },
  {
    id: 'pategras', nombre: 'Pategrás sardo', categoria: 'quesos', marca: 'Los Exclusivos',
    precio: 9600, descuento: 0, stock: 30, unidad: 'por kg', img: 'images/prod-pategras.jpg',
    destacado: false, badge: '', tags: ['queso', 'pategras', 'semiduro', 'picada'],
    desc: 'Pategrás de pasta semidura, con ojos característicos y sabor amable. Ideal para la picada y para gratinar.'
  },
  {
    id: 'provolone', nombre: 'Provolone', categoria: 'quesos', marca: 'Selección Ranch',
    precio: 11800, descuento: 0, stock: 26, unidad: 'por kg', img: 'images/prod-provolone.jpg',
    destacado: true, badge: '', tags: ['queso', 'provolone', 'provoleta', 'parrilla'],
    desc: 'Provolone estacionado, firme y de sabor marcado. El corte justo para hacer provoleta a la parrilla.'
  },
  {
    id: 'roquefort', nombre: 'Roquefort', categoria: 'quesos', marca: 'Selección Ranch',
    precio: 14500, descuento: 15, stock: 20, unidad: 'por kg', img: 'images/prod-roquefort.jpg',
    destacado: false, badge: '', tags: ['queso', 'roquefort', 'azul', 'premium'],
    desc: 'Queso azul cremoso e intenso, de vetas parejas. Espectacular en salsas o para rematar una tabla con carácter.'
  },
  {
    id: 'sardo', nombre: 'Sardo estacionado', categoria: 'quesos', marca: 'Los Exclusivos',
    precio: 12900, descuento: 0, stock: 24, unidad: 'por kg', img: 'images/prod-sardo.jpg',
    destacado: false, badge: '', tags: ['queso', 'sardo', 'rallar', 'duro'],
    desc: 'Sardo de pasta dura, estacionado y sabroso. Perfecto para rallar sobre pastas o comer en escamas.'
  },
  {
    id: 'pollo-entero', nombre: 'Pollo entero fresco', categoria: 'avicola', marca: 'Elaboración propia',
    precio: 3850, descuento: 0, stock: 50, unidad: 'por kg', img: 'images/prod-pollo-entero.jpg',
    destacado: true, badge: 'Elaboración propia', tags: ['pollo', 'entero', 'fresco', 'avicola'],
    desc: 'Pollo entero fresco de nuestra propia elaboración, seleccionado y limpio, listo para el horno o la cacerola.'
  },
  {
    id: 'suprema', nombre: 'Suprema de pollo', categoria: 'avicola', marca: 'Elaboración propia',
    precio: 6900, descuento: 0, stock: 40, unidad: 'por kg', img: 'images/prod-suprema.jpg',
    destacado: true, badge: '', tags: ['pollo', 'suprema', 'pechuga', 'fresco'],
    desc: 'Pechuga de pollo deshuesada y limpia, magra y tierna. La base ideal para milanesas, grillados o al horno.'
  },
  {
    id: 'pata-muslo', nombre: 'Pata muslo', categoria: 'avicola', marca: 'Elaboración propia',
    precio: 4200, descuento: 0, stock: 44, unidad: 'por kg', img: 'images/prod-pata-muslo.jpg',
    destacado: false, badge: '', tags: ['pollo', 'pata', 'muslo', 'fresco'],
    desc: 'Pata muslo fresca, jugosa y con hueso, perfecta para el horno con papas o para la parrilla del domingo.'
  },
  {
    id: 'pollo-trozado', nombre: 'Pollo trozado', categoria: 'avicola', marca: 'Elaboración propia',
    precio: 4600, descuento: 0, stock: 36, unidad: 'por kg', img: 'images/prod-pollo-trozado.jpg',
    destacado: false, badge: '', tags: ['pollo', 'trozado', 'presas', 'guiso', 'fresco'],
    desc: 'Pollo trozado en presas parejas, listo para el guiso, la cazuela o la fritura sin trabajo extra.'
  },
  {
    id: 'milanesas-pollo', nombre: 'Milanesas de pollo', categoria: 'congelados', marca: 'Elaboración propia',
    precio: 8400, descuento: 0, stock: 32, unidad: 'por kg', img: 'images/prod-milanesas.jpg',
    destacado: true, badge: 'Más pedido', tags: ['milanesas', 'pollo', 'rebozado', 'congelado', 'horno'],
    desc: 'Milanesas de suprema rebozadas por nosotros, finas y tiernas. Del freezer a la mesa en minutos.'
  },
  {
    id: 'hamburguesas-pollo', nombre: 'Hamburguesas de pollo x6', categoria: 'congelados', marca: 'Elaboración propia',
    precio: 6200, descuento: 10, stock: 30, unidad: 'x 6 unidades', img: 'images/prod-hamburguesas.jpg',
    destacado: false, badge: '', tags: ['hamburguesas', 'pollo', 'congelado', 'medallon'],
    desc: 'Seis hamburguesas de pollo caseras, jugosas y con sabor real. Ideales para resolver el almuerzo de los chicos.'
  },
  {
    id: 'medallones-pollo', nombre: 'Medallones de pollo x8', categoria: 'congelados', marca: 'Elaboración propia',
    precio: 7100, descuento: 0, stock: 28, unidad: 'x 8 unidades', img: 'images/prod-medallones.jpg',
    destacado: false, badge: '', tags: ['medallones', 'pollo', 'congelado', 'rebozado'],
    desc: 'Medallones de pollo rebozados, crocantes por fuera y tiernos por dentro. Un clásico que siempre gusta.'
  },
  {
    id: 'empanadas', nombre: 'Empanadas para hornear x12', categoria: 'congelados', marca: 'Los Exclusivos',
    precio: 9900, descuento: 0, stock: 26, unidad: 'x 12 unidades', img: 'images/prod-empanadas.jpg',
    destacado: true, badge: 'Nuevo', tags: ['empanadas', 'congelado', 'horno', 'carne', 'pollo'],
    desc: 'Docena de empanadas armadas a mano, listas para hornear. Repulgue de verdad y relleno generoso.'
  },
  {
    id: 'aceitunas-verdes', nombre: 'Aceitunas verdes 500 g', categoria: 'almacen', marca: 'Los Exclusivos',
    precio: 4300, descuento: 0, stock: 60, unidad: '500 g', img: 'images/prod-aceitunas.jpg',
    destacado: false, badge: '', tags: ['aceitunas', 'verdes', 'almacen', 'picada'],
    desc: 'Aceitunas verdes en salmuera, carnosas y con el punto justo de sal. La compañía natural de todo fiambre.'
  },
  {
    id: 'aceite-oliva', nombre: 'Aceite de oliva extra virgen 500 ml', categoria: 'almacen', marca: 'Selección Ranch',
    precio: 8700, descuento: 0, stock: 34, unidad: '500 ml', img: 'images/prod-aceite-oliva.jpg',
    destacado: false, badge: '', tags: ['aceite', 'oliva', 'extra virgen', 'almacen'],
    desc: 'Aceite de oliva extra virgen de primera prensada en frío, frutado y equilibrado. Para terminar cualquier plato.'
  },
  {
    id: 'tabla-picada', nombre: 'Tabla de picada armada', categoria: 'fiambres', marca: 'Los Exclusivos',
    precio: 22500, descuento: 0, stock: 12, unidad: 'para 2-3 personas', img: 'images/prod-tabla-picada.jpg',
    destacado: true, badge: 'Lista para servir', tags: ['picada', 'tabla', 'fiambres', 'quesos', 'combo', 'regalo'],
    desc: 'Nuestra selección de fiambres y quesos armada y lista para servir: crudo, salame, cremoso, provolone, aceitunas y frutos secos. Avisá con un día y la tenés lista.'
  },
];
