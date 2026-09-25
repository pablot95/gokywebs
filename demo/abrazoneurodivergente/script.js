'use strict';

const WHATSAPP = '5493564379618';
const MARCA = 'Abrazo Neurodivergente';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esLista = document.body.classList.contains('m2');
const POR_PAGINA = 16;

const FOTOS = {
  rincon: { src: 'images/rincon-sensorial-9x16.webp', w: 941, h: 1672 },
  mesa: { src: 'images/mesa-juegos-16x9.webp', w: 1672, h: 941 },
  libros: { src: 'images/libros-1x1.webp', w: 1254, h: 1254 },
  sensoriales: { src: 'images/sensoriales-1x1.webp', w: 1254, h: 1254 },
  juegos: { src: 'images/juegos-1x1.webp', w: 1254, h: 1254 },
  libreria: { src: 'images/libreria-1x1.webp', w: 1254, h: 1254 },
};

const CATEGORIAS = {
  sensoriales: 'Juguetes sensoriales',
  libros: 'Libros didácticos',
  cuentos: 'Cuentos didácticos',
  juegos: 'Juegos de mesa',
  libreria: 'Artículos de librería',
};

const TRABAJA = {
  calma: 'Calma y regulación',
  manos: 'Manos y motricidad',
  emociones: 'Emociones',
  lenguaje: 'Lenguaje y comunicación',
  lectura: 'Lectura y escritura',
  atencion: 'Atención y turnos',
};

const EDADES = {
  '0-3': { nombre: 'De 0 a 3 años', min: 0, max: 3 },
  '3-6': { nombre: 'De 3 a 6 años', min: 3, max: 6 },
  '6-12': { nombre: 'De 6 a 12 años', min: 6, max: 12 },
  '12+': { nombre: 'Adolescentes y adultos', min: 12, max: 120 },
};

const PRECIOS = {
  hasta10: { nombre: 'Hasta $10.000', min: 0, max: 10000 },
  '10a25': { nombre: 'De $10.000 a $25.000', min: 10001, max: 25000 },
  mas25: { nombre: 'Más de $25.000', min: 25001, max: Infinity },
};

const ENVIOS = {
  ciudad: { nombre: 'Envío en la ciudad', corto: 'En la ciudad', detalle: 'A tu casa, dentro de la ciudad', costo: 3000, dias: 1, ico: 'casa' },
  zona: { nombre: 'Envío en la zona', corto: 'En la zona', detalle: 'A tu casa, en localidades cercanas', costo: 6500, dias: 2, ico: 'pin' },
  turno: { nombre: 'Retiro con turno', corto: 'Retiro con turno', detalle: 'Lo ves antes y te lo llevás', costo: 0, ico: 'cal' },
};

const FRANJAS = { manana: 'por la mañana', tarde: 'por la tarde' };

const PRODUCTOS = [
  { id: 'p01', slug: 'pop-it-arcoiris', nombre: 'Pop it arcoíris redondo', cat: 'sensoriales', sub: 'Para las manos', precio: 8900, descuento: 0, stock: 14, edades: ['3-6', '6-12', '12+'], trabaja: ['calma', 'manos'], silencioso: false, foto: { f: 'sensoriales', x: 0.17, y: 0.52, s: 0.34 }, desc: 'Burbujas de silicona para apretar y dar vuelta. Sirve para descargar tensión con las manos y también para contar o esperar el turno jugando de a dos.', detalle: ['Silicona lavable', '20 cm de diámetro'], tags: ['fidget', 'burbujas', 'pop'] },
  { id: 'p02', slug: 'set-pelotas-sensoriales', nombre: 'Set de 3 pelotas sensoriales con texturas', cat: 'sensoriales', sub: 'Pelotas y texturas', precio: 12500, descuento: 0, stock: 9, edades: ['0-3', '3-6', '6-12', '12+'], trabaja: ['calma', 'manos'], silencioso: true, foto: { f: 'sensoriales', x: 0.53, y: 0.47, s: 0.38 }, desc: 'Tres tamaños y tres texturas para apretar, rodar y masajear. Registrar el cuerpo con las manos ayuda a bajar la ansiedad sin cortar lo que se está haciendo.', detalle: ['6, 8 y 10 cm', 'Tres texturas distintas'], tags: ['pelota', 'erizo', 'masaje', 'pinches'] },
  { id: 'p03', slug: 'cubo-infinito', nombre: 'Cubo infinito', cat: 'sensoriales', sub: 'Para las manos', precio: 7800, descuento: 0, stock: 3, edades: ['6-12', '12+'], trabaja: ['atencion', 'calma'], silencioso: true, foto: { f: 'sensoriales', x: 0.885, y: 0.435, s: 0.22 }, desc: 'Se pliega y se despliega sin fin y casi sin hacer ruido. Tener las manos ocupadas ayuda a sostener la atención en clase o en una sala de espera.', detalle: ['Entra en un bolsillo', 'Bisagras que no se traban'], tags: ['fidget', 'cubo'] },
  { id: 'p04', slug: 'tubos-pop', nombre: 'Tubos pop elásticos x2', cat: 'sensoriales', sub: 'Para las manos', precio: 5600, descuento: 0, stock: 18, edades: ['3-6', '6-12', '12+'], trabaja: ['manos', 'calma'], silencioso: false, foto: { f: 'sensoriales', x: 0.755, y: 0.74, s: 0.26 }, desc: 'Se estiran, se doblan y se conectan entre sí con un «pop» suave. Suman un estímulo auditivo y táctil para quien lo busca.', detalle: ['2 tubos de 19 cm', 'Se estiran hasta 70 cm'], tags: ['tubo', 'pop', 'fidget'] },
  { id: 'p05', slug: 'anillos-sensoriales', nombre: 'Anillos sensoriales con pinches x2', cat: 'sensoriales', sub: 'Pelotas y texturas', precio: 4900, descuento: 0, stock: 22, edades: ['3-6', '6-12', '12+'], trabaja: ['calma', 'manos'], silencioso: true, foto: { f: 'sensoriales', x: 0.33, y: 0.75, s: 0.24 }, desc: 'Se usan como pulsera, así están a mano cuando hacen falta. Textura firme para rodar entre los dedos en el aula, el colectivo o la consulta.', detalle: ['Goma flexible', 'Dos colores'], tags: ['pulsera', 'anillo', 'pinches'] },
  { id: 'p06', slug: 'torre-apilable-silicona', nombre: 'Torre de aros apilables de silicona', cat: 'sensoriales', sub: 'Primeros años', precio: 15900, descuento: 0, stock: 6, edades: ['0-3'], trabaja: ['manos'], silencioso: true, nuevo: true, foto: { f: 'sensoriales', x: 0.27, y: 0.215, s: 0.38 }, desc: 'Cinco aros blandos para apilar y ordenar por tamaño. Colores apagados que no saturan la vista.', detalle: ['Silicona blanda', '5 aros y base'], tags: ['torre', 'apilar', 'bebe'] },
  { id: 'p07', slug: 'pelota-calada', nombre: 'Pelota calada para agarrar', cat: 'sensoriales', sub: 'Primeros años', precio: 9200, descuento: 0, stock: 0, edades: ['0-3'], trabaja: ['manos'], silencioso: true, foto: { f: 'sensoriales', x: 0.67, y: 0.305, s: 0.27 }, desc: 'Tiene agujeros por todos lados para que las manos chiquitas la agarren desde cualquier lugar. Liviana y blanda.', detalle: ['12 cm de diámetro', 'Plástico flexible'], tags: ['pelota', 'bebe', 'agarre'] },
  { id: 'p08', slug: 'tangle', nombre: 'Tangle para enredar y destrabar', cat: 'sensoriales', sub: 'Para las manos', precio: 6400, descuento: 0, stock: 11, edades: ['6-12', '12+'], trabaja: ['atencion', 'manos'], silencioso: true, foto: { f: 'sensoriales', x: 0.77, y: 0.545, s: 0.24 }, desc: 'Piezas curvas que giran y se retuercen sin fin. Acompaña momentos de escucha, lectura o espera sin distraer a los demás.', detalle: ['18 piezas articuladas', 'Se desarma para limpiar'], tags: ['fidget', 'tangle'] },
  { id: 'p09', slug: 'auriculares-protectores', nombre: 'Auriculares protectores de ruido', cat: 'sensoriales', sub: 'Calma y descanso', precio: 32000, descuento: 0, stock: 5, edades: ['3-6', '6-12', '12+'], trabaja: ['calma'], silencioso: true, nuevo: true, foto: { f: 'rincon', x: 0.31, y: 0.62, s: 0.52 }, desc: 'Protectores auditivos pasivos con vincha acolchada. Bajan el ruido de fondo en cumpleaños, supermercados o recreos, sin aislar del todo.', detalle: ['Vincha regulable', 'Plegables, con bolsa'], tags: ['auriculares', 'ruido', 'orejeras', 'protector'] },
  { id: 'p10', slug: 'almohadon-con-peso', nombre: 'Almohadón con peso para el regazo', cat: 'sensoriales', sub: 'Calma y descanso', precio: 38500, descuento: 0, stock: 2, edades: ['3-6', '6-12', '12+'], trabaja: ['calma', 'atencion'], silencioso: true, foto: { f: 'rincon', x: 0.76, y: 0.84, s: 0.48 }, desc: 'Se apoya sobre las piernas y da una presión pareja. A muchas personas las ayuda a quedarse sentadas y en calma durante la tarea o la comida.', detalle: ['1,5 kg', 'Funda de tela suave, lavable'], tags: ['peso', 'almohadon', 'presion'] },
  { id: 'p11', slug: 'libro-emociones-pictogramas', nombre: 'Libro de emociones con pictogramas', cat: 'libros', sub: 'Emociones', precio: 18900, descuento: 0, stock: 7, edades: ['3-6', '6-12'], trabaja: ['emociones', 'lenguaje', 'lectura'], foto: { f: 'libros', x: 0.76, y: 0.33, s: 0.24 }, desc: 'Cada página nombra una emoción con una imagen clara y una frase corta. Para reconocer lo que pasa adentro y encontrar palabras para decirlo.', detalle: ['Tapa dura', '32 páginas', 'Letra imprenta mayúscula'], tags: ['libro', 'emociones', 'pictogramas'] },
  { id: 'p12', slug: 'agenda-visual', nombre: 'Agenda visual con 40 pictogramas', cat: 'libros', sub: 'Rutinas y anticipación', precio: 14500, descuento: 0, stock: 12, edades: ['3-6', '6-12', '12+'], trabaja: ['lenguaje', 'atencion'], foto: { f: 'libreria', x: 0.16, y: 0.22, s: 0.32 }, desc: 'Tarjetas plastificadas para armar la rutina del día: qué pasa primero y qué pasa después. Anticipar baja la incertidumbre y las preguntas repetidas.', detalle: ['40 tarjetas plastificadas', 'Tira con abrojo'], tags: ['agenda', 'rutina', 'pictogramas', 'anticipacion', 'tarjetas'] },
  { id: 'p13', slug: 'libro-empezar-a-leer', nombre: 'Libro de actividades para empezar a leer', cat: 'libros', sub: 'Lectoescritura', precio: 16200, descuento: 0, stock: 8, edades: ['3-6', '6-12'], trabaja: ['lectura', 'lenguaje'], foto: { f: 'mesa', x: 0.71, y: 0.36, s: 0.3 }, desc: 'Una actividad por página, con letra imprenta mayúscula y mucho espacio en blanco. Anillado para que quede abierto sobre la mesa sin sostenerlo.', detalle: ['Anillado', '48 páginas'], tags: ['leer', 'letras', 'lectoescritura', 'actividades'] },
  { id: 'p14', slug: 'cuaderno-atencion', nombre: 'Cuaderno de atención: laberintos y diferencias', cat: 'libros', sub: 'Atención', precio: 11900, descuento: 0, stock: 10, edades: ['6-12'], trabaja: ['atencion', 'manos'], foto: { f: 'rincon', x: 0.555, y: 0.385, s: 0.42 }, desc: 'Laberintos, secuencias y buscar las diferencias, de menor a mayor dificultad. Consignas de una sola línea para que se entiendan a la primera.', detalle: ['64 páginas', 'Para lápiz o fibra'], tags: ['laberintos', 'atencion', 'diferencias'] },
  { id: 'p15', slug: 'libro-mi-cuerpo-y-mis-sentidos', nombre: 'Libro Mi cuerpo y mis sentidos', cat: 'libros', sub: 'Emociones', precio: 17400, descuento: 0, stock: 4, edades: ['3-6', '6-12'], trabaja: ['calma', 'lenguaje'], foto: { f: 'libros', x: 0.29, y: 0.37, s: 0.42 }, desc: 'Cuenta con ilustraciones cómo se sienten los ruidos, las texturas y las luces fuertes, y qué ayuda cuando algo es demasiado.', detalle: ['Tapa blanda', '40 páginas'], tags: ['sentidos', 'cuerpo', 'sensorial'] },
  { id: 'p16', slug: 'cuento-respirar-despacio', nombre: 'Cuento para respirar despacio', cat: 'cuentos', sub: 'Cuentos para la calma', precio: 15800, descuento: 0, stock: 9, edades: ['3-6', '6-12'], trabaja: ['calma', 'emociones'], nuevo: true, foto: { f: 'libros', x: 0.76, y: 0.6, s: 0.44 }, desc: 'Una historia que acompaña a respirar lento, página por página. Para la hora de dormir o después de un día con mucho estímulo.', detalle: ['Tapa dura', '28 páginas ilustradas'], tags: ['cuento', 'respirar', 'dormir', 'calma'] },
  { id: 'p17', slug: 'cuento-vamos-al-dentista', nombre: 'Cuento para anticipar: vamos al dentista', cat: 'cuentos', sub: 'Historias para anticipar', precio: 13900, descuento: 0, stock: 6, edades: ['3-6', '6-12'], trabaja: ['lenguaje', 'emociones'], foto: { f: 'rincon', x: 0.28, y: 0.345, s: 0.36 }, desc: 'Cuenta paso a paso qué va a pasar en la consulta, desde la sala de espera hasta el final. Leerlo unos días antes baja la ansiedad del día.', detalle: ['Tapa blanda', '24 páginas'], tags: ['cuento', 'dentista', 'anticipar', 'historia social'] },
  { id: 'p18', slug: 'cuento-el-bosque-de-los-ruidos', nombre: 'Cuento El bosque de los ruidos', cat: 'cuentos', sub: 'Cuentos para la calma', precio: 14700, descuento: 0, stock: 5, edades: ['3-6', '6-12'], trabaja: ['calma', 'lenguaje'], foto: { f: 'libros', x: 0.42, y: 0.57, s: 0.4 }, desc: 'Un paseo por un bosque donde cada sonido tiene su volumen. Da pie para hablar de lo que molesta, de lo que calma y de cómo pedir silencio.', detalle: ['Tapa dura', '32 páginas'], tags: ['cuento', 'ruido', 'bosque'] },
  { id: 'p19', slug: 'coleccion-cuentos-para-anticipar', nombre: 'Colección de 4 cuentos para anticipar', cat: 'cuentos', sub: 'Historias para anticipar', precio: 42000, descuento: 12, stock: 3, edades: ['3-6', '6-12'], trabaja: ['lenguaje', 'emociones', 'lectura'], foto: { f: 'rincon', x: 0.15, y: 0.31, s: 0.3 }, desc: 'Cuatro historias para situaciones nuevas: el primer día de clases, un cumpleaños, un viaje y el corte de pelo. Frases cortas y una imagen por idea.', detalle: ['4 libros de tapa blanda', '20 páginas cada uno'], tags: ['cuentos', 'coleccion', 'anticipar', 'cumpleanos', 'viaje'] },
  { id: 'p20', slug: 'cuento-cada-cual-juega-a-su-manera', nombre: 'Cuento Cada cual juega a su manera', cat: 'cuentos', sub: 'Diversidad', precio: 13200, descuento: 0, stock: 7, edades: ['3-6', '6-12'], trabaja: ['emociones', 'atencion'], foto: { f: 'mesa', x: 0.14, y: 0.75, s: 0.28 }, desc: 'Una historia sobre jugar juntos aunque cada uno juegue distinto. Para hablar de amistad y de diferencias sin forzar a nadie.', detalle: ['Tapa blanda', '28 páginas'], tags: ['cuento', 'amistad', 'diversidad', 'jugar'] },
  { id: 'p21', slug: 'juego-camino-de-las-emociones', nombre: 'Juego de recorrido: el camino de las emociones', cat: 'juegos', sub: 'Emociones', precio: 29900, descuento: 0, stock: 6, edades: ['3-6', '6-12'], trabaja: ['emociones', 'atencion'], nuevo: true, foto: { f: 'juegos', x: 0.55, y: 0.53, s: 0.62 }, desc: 'Tablero, dado grande, cuatro fichas y cartas con caritas. En cada casilla se nombra una emoción o se cuenta cuándo la sentiste.', detalle: ['De 2 a 4 jugadores', '20 minutos por partida'], tags: ['juego', 'tablero', 'emociones', 'dado'] },
  { id: 'p22', slug: 'cartas-de-emociones', nombre: 'Cartas de emociones x36', cat: 'juegos', sub: 'Emociones', precio: 11500, descuento: 0, stock: 14, edades: ['3-6', '6-12', '12+'], trabaja: ['emociones', 'lenguaje'], foto: { f: 'juegos', x: 0.52, y: 0.8, s: 0.4 }, desc: 'Ilustraciones claras, sin exageraciones, para nombrar lo que se siente. Sirven en casa, en el aula o en la consulta, y traen ideas de juego.', detalle: ['36 cartas grandes', 'Guía de juegos'], tags: ['cartas', 'emociones', 'caritas'] },
  { id: 'p23', slug: 'reloj-de-arena-1-minuto', nombre: 'Reloj de arena de 1 minuto', cat: 'juegos', sub: 'Turnos y tiempo', precio: 6900, descuento: 0, stock: 16, edades: ['0-3', '3-6', '6-12', '12+'], trabaja: ['atencion', 'calma'], silencioso: true, foto: { f: 'juegos', x: 0.87, y: 0.79, s: 0.26 }, desc: 'Muestra cuánto falta sin números ni alarmas. Sirve para esperar el turno en un juego o para saber cuándo termina una actividad.', detalle: ['Base de madera', 'Colores surtidos'], tags: ['reloj', 'arena', 'tiempo', 'turno', 'temporizador'] },
  { id: 'p24', slug: 'memotest-de-caritas', nombre: 'Memotest de caritas x24', cat: 'juegos', sub: 'Emociones', precio: 9800, descuento: 0, stock: 0, edades: ['3-6', '6-12'], trabaja: ['emociones', 'atencion'], foto: { f: 'juegos', x: 0.12, y: 0.37, s: 0.22 }, desc: 'Fichas redondas de cartón grueso con caras que expresan cosas distintas. Para memoria, turnos y reconocer gestos.', detalle: ['24 fichas de 7 cm', 'Cartón grueso'], tags: ['memotest', 'memoria', 'caritas'] },
  { id: 'p25', slug: 'juego-clasificar-por-colores', nombre: 'Juego de clasificar por colores', cat: 'juegos', sub: 'Encastres y clasificación', precio: 21400, descuento: 0, stock: 4, edades: ['3-6', '6-12'], trabaja: ['atencion', 'manos'], silencioso: true, foto: { f: 'mesa', x: 0.79, y: 0.56, s: 0.25 }, desc: 'Bandeja de madera con compartimentos y piezas para ordenar por color y forma. Tiene un final claro: cuando todo está en su lugar, terminó.', detalle: ['Bandeja de madera', '30 piezas'], tags: ['clasificar', 'colores', 'madera', 'ordenar'] },
  { id: 'p26', slug: 'encastre-de-formas', nombre: 'Encastre de formas de madera', cat: 'juegos', sub: 'Encastres y clasificación', precio: 17800, descuento: 10, stock: 7, edades: ['0-3', '3-6'], trabaja: ['manos', 'atencion'], silencioso: true, foto: { f: 'mesa', x: 0.385, y: 0.625, s: 0.3 }, desc: 'Piezas gruesas que entran en un solo lugar, fáciles de agarrar. Cada forma tiene su color, así el error se ve y se corrige solo.', detalle: ['Madera pintada', '9 piezas'], tags: ['encastre', 'formas', 'madera'] },
  { id: 'p27', slug: 'cuaderno-tapa-dura-rayado-ancho', nombre: 'Cuaderno tapa dura rayado ancho', cat: 'libreria', sub: 'Cuadernos', precio: 8400, descuento: 0, stock: 20, edades: ['6-12', '12+'], trabaja: ['lectura'], foto: { f: 'libreria', x: 0.5, y: 0.5, s: 0.56 }, desc: 'Renglón ancho y hojas gruesas que no se transparentan. Tapa en colores suaves, sin estampas que distraigan.', detalle: ['Espiralado', '80 hojas'], tags: ['cuaderno', 'renglon', 'escuela'] },
  { id: 'p28', slug: 'cartuchera-completa', nombre: 'Cartuchera completa con crayones y fibras', cat: 'libreria', sub: 'Para pintar y dibujar', precio: 19900, descuento: 15, stock: 5, edades: ['3-6', '6-12'], trabaja: ['manos'], foto: { f: 'libreria', x: 0.22, y: 0.78, s: 0.44 }, desc: 'Se abre como un libro y todo queda a la vista, cada cosa en su elástico. Menos tiempo buscando y más tiempo dibujando.', detalle: ['Cierre perimetral', '24 piezas incluidas'], tags: ['cartuchera', 'crayones', 'fibras', 'escuela'] },
  { id: 'p29', slug: 'crayones-gruesos', nombre: 'Crayones gruesos x12', cat: 'libreria', sub: 'Para pintar y dibujar', precio: 4800, descuento: 0, stock: 25, edades: ['0-3', '3-6'], trabaja: ['manos'], foto: { f: 'libreria', x: 0.15, y: 0.4, s: 0.22 }, desc: 'Más gruesos que los comunes, para agarrar con toda la mano. Aguantan cuando se aprieta fuerte.', detalle: ['12 colores', 'Forma gruesa'], tags: ['crayones', 'pintar'] },
  { id: 'p30', slug: 'lapices-de-colores-x24', nombre: 'Lápices de colores x24', cat: 'libreria', sub: 'Para pintar y dibujar', precio: 7600, descuento: 0, stock: 15, edades: ['6-12', '12+'], trabaja: ['manos'], foto: { f: 'libreria', x: 0.85, y: 0.29, s: 0.3 }, desc: 'Mina blanda que pinta sin apretar, así la mano no se cansa. Colores parejos para pintar y para ordenar tareas por color.', detalle: ['24 colores', 'Mina blanda'], tags: ['lapices', 'colores', 'pintar'] },
  { id: 'p31', slug: 'tijera-punta-redonda', nombre: 'Tijera escolar punta redonda', cat: 'libreria', sub: 'Recortar y pegar', precio: 3900, descuento: 0, stock: 3, edades: ['3-6', '6-12'], trabaja: ['manos'], foto: { f: 'libreria', x: 0.74, y: 0.85, s: 0.3 }, desc: 'Mango grande y blando que no marca los dedos. Punta redonda para usarla con tranquilidad desde el jardín.', detalle: ['13 cm', 'Mango blando'], tags: ['tijera', 'recortar'] },
  { id: 'p32', slug: 'stickers-de-emociones', nombre: 'Stickers de emociones x4 planchas', cat: 'libreria', sub: 'Recortar y pegar', precio: 3200, descuento: 0, stock: 30, edades: ['3-6', '6-12'], trabaja: ['emociones'], foto: { f: 'libreria', x: 0.79, y: 0.66, s: 0.28 }, desc: 'Caritas, corazones y arcoíris para marcar cómo fue el día en la agenda o festejar algo que salió bien.', detalle: ['4 planchas', 'Más de 80 stickers'], tags: ['stickers', 'emociones', 'caritas'] },
  { id: 'p33', slug: 'cintas-washi', nombre: 'Cintas washi x3', cat: 'libreria', sub: 'Recortar y pegar', precio: 4500, descuento: 0, stock: 12, edades: ['6-12', '12+'], trabaja: ['manos', 'atencion'], foto: { f: 'libreria', x: 0.535, y: 0.78, s: 0.2 }, desc: 'Se cortan con la mano y se despegan sin romper el papel. Sirven para marcar por colores el cuaderno o la agenda.', detalle: ['3 rollos de 10 m', 'Papel de arroz'], tags: ['washi', 'cinta', 'ordenar'] },
];

const RINCON = [
  null,
  { id: 'p09', fx: 0.31, fy: 0.62, z: 1.75 },
  { id: 'p02', fx: 0.38, fy: 0.8, z: 1.9 },
  { id: 'p10', fx: 0.75, fy: 0.84, z: 1.75 },
  { id: 'p23', fx: 0.77, fy: 0.42, z: 2.6 },
];

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  casa: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.53l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  cal: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/></svg>',
  camion: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  flecha: '<svg class="timeline__flecha" viewBox="0 0 38 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7h34M29 1l6 6-6 6"/></svg>',
  flechaSm: '<svg class="ico ico--arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  edad: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  silencio: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.41 7.59A1.4 1.4 0 0 1 5.42 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.42a1.4 1.4 0 0 1 1 .41l3.38 3.39a.7.7 0 0 0 1.2-.5zM22 9l-6 6M16 9l6 6"/></svg>',
  cerrar: '<svg class="ico ico--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  wsp: '<svg class="ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'abrazoneurodivergente_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const intentar = fn => { try { return fn(); } catch (err) { return err; } };

const Envio = {
  KEY: 'abrazoneurodivergente_envio',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { return {}; } },
  set(cambios) {
    const v = { ...this.get(), ...cambios };
    intentar(() => localStorage.setItem(this.KEY, JSON.stringify(v)));
    document.dispatchEvent(new CustomEvent('envio:updated'));
  },
  opcion() { return ENVIOS[this.get().modo] || null; },
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const capitalizar = s => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const qtyEnCarrito = id => Cart.get().find(i => i.id === id)?.qty || 0;
const wspHref = lineas => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;

const esHabil = d => d.getDay() !== 0 && d.getDay() !== 6;
function sumarHabiles(desde, n) {
  const d = new Date(desde); d.setHours(12, 0, 0, 0);
  let k = 0;
  while (k < n) { d.setDate(d.getDate() + 1); if (esHabil(d)) k++; }
  return d;
}
function proximosHabiles(n) {
  const out = []; const d = new Date(); d.setHours(12, 0, 0, 0);
  while (out.length < n) { d.setDate(d.getDate() + 1); if (esHabil(d)) out.push(new Date(d)); }
  return out;
}
const isoDia = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const desdeIso = iso => { const [y, m, dd] = iso.split('-').map(Number); return new Date(y, m - 1, dd, 12); };
const FMT_LARGO = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const FMT_CORTO = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });
const fechaLarga = d => FMT_LARGO.format(d).replace(',', '');
const diaCorto = d => capitalizar(FMT_CORTO.format(d).replace('.', ''));

function edadTexto(p) {
  const bandas = p.edades.map(e => EDADES[e]);
  if (p.edades.length === 4) return 'Todas las edades';
  const min = Math.min(...bandas.map(b => b.min));
  const max = Math.max(...bandas.map(b => b.max));
  if (max > 12) return min === 0 ? 'Todas las edades' : `Desde ${min} años`;
  return `De ${min} a ${max} años`;
}

function phHTML(p, alejar = 1) {
  const f = FOTOS[p.foto.f];
  const ratio = f.h / f.w;
  const s = Math.min(p.foto.s * alejar, 1, ratio);
  const x = Math.min(Math.max(p.foto.x, s / 2), 1 - s / 2);
  const y = Math.min(Math.max(p.foto.y * ratio, s / 2), ratio - s / 2);
  const estilo = `width:${(100 / s).toFixed(2)}%;height:${(100 * ratio / s).toFixed(2)}%;left:${(-(x - s / 2) / s * 100).toFixed(2)}%;top:${(-(y - s / 2) / s * 100).toFixed(2)}%`;
  return `<div class="ph"><div class="ph__in"><img src="${f.src}" alt="${esc(p.nombre)}" width="${f.w}" height="${f.h}" decoding="async" style="${estilo}"></div></div>`;
}

function badgeHTML(p, extra = '') {
  if (p.stock <= 0) return `<span class="badge badge--sin${extra}">Sin stock</span>`;
  if (p.descuento > 0) return `<span class="badge badge--off${extra}">-${p.descuento}%</span>`;
  if (p.nuevo) return `<span class="badge badge--nuevo${extra}">Nuevo</span>`;
  if (p.stock <= 3) return `<span class="badge${extra}">Últimas unidades</span>`;
  return '';
}

function stockTexto(p) {
  if (p.stock <= 0) return 'Sin stock';
  if (p.stock <= 3) return `Quedan ${p.stock}`;
  return `Stock: ${p.stock}`;
}

function stockHTML(p) {
  const mod = p.stock <= 0 ? ' stock--sin' : p.stock <= 3 ? ' stock--poco' : '';
  return `<span class="stock${mod}">${stockTexto(p)}</span>`;
}

function precioHTML(p) {
  const pf = precioFinal(p);
  return `<span class="price${p.descuento > 0 ? ' price--off' : ''}">${formatearPrecio(pf)}</span>${p.descuento > 0 ? ` <s class="price-old">${formatearPrecio(p.precio)}</s>` : ''}`;
}

function stepperHTML(p, q) {
  return `<div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-menos="${p.id}" aria-label="${q === 1 ? 'Quitar del pedido' : 'Restar uno'}">${ICO.menos}</button><output>${q}</output><button type="button" data-mas="${p.id}" aria-label="Sumar uno"${q >= p.stock ? ' disabled' : ''}>${ICO.mas}</button></div>`;
}

function accionesHTML(p) {
  if (p.stock <= 0) {
    return `<a class="btn btn--soft prod-add" href="${wspHref([`Hola ${MARCA}, ¿me avisan cuando vuelva a entrar ${p.nombre}?`])}" target="_blank" rel="noopener noreferrer"><span class="lbl-long">Avisame cuando vuelva</span><span class="lbl-short">Avisame</span></a>`;
  }
  const q = qtyEnCarrito(p.id);
  if (!q) return `<button type="button" class="btn btn--cta prod-add" data-add="${p.id}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button>`;
  return `<div class="en-carrito">${stepperHTML(p, q)}<span class="en-carrito__lbl">en tu pedido</span></div>`;
}

function cardHTML(p, i) {
  return `<li class="card" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(24px);transition-delay:${(i % 3) * 0.08}s">
    <div class="card__media">${phHTML(p)}${badgeHTML(p)}${stockHTML(p).replace('class="stock', 'class="stock stock--foto')}</div>
    <div class="card__body">
      <p class="card__meta">${edadTexto(p)}</p>
      <h3 class="card__name"><button type="button" class="card__open" data-qv="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="card__row"><span>${precioHTML(p)}</span>${stockHTML(p)}</div>
      <div class="prod-actions" data-acciones="${p.id}">${accionesHTML(p)}</div>
    </div>
  </li>`;
}

function filaHTML(p, i) {
  return `<li class="fila" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(16px);transition-delay:${(i % 4) * 0.05}s">
    ${phHTML(p)}
    <div class="fila__info">
      ${badgeHTML(p)}
      <h3 class="card__name"><button type="button" class="card__open" data-qv="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="fila__meta">${edadTexto(p)} · ${p.trabaja.map(t => TRABAJA[t]).join(', ')}</p>
      ${stockHTML(p)}
    </div>
    <div class="fila__price">${precioHTML(p)}</div>
    <div class="prod-actions" data-acciones="${p.id}">${accionesHTML(p)}</div>
  </li>`;
}

const STOP = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'o', 'para', 'con', 'un', 'una', 'unos', 'unas', 'que', 'por', 'en', 'a', 'al', 'mi', 'su', 'algo', 'ano', 'anos']);

function parseBusqueda(q) {
  const tokens = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
  let edad = null;
  const textos = [];
  tokens.forEach(t => {
    if (/^\d{1,2}$/.test(t)) { edad = Number(t); return; }
    if (!STOP.has(t)) textos.push(t);
  });
  return { edad, textos };
}

function coincide(txt, t) {
  if (txt.includes(t)) return true;
  if (t.length > 4 && t.endsWith('es') && txt.includes(t.slice(0, -2))) return true;
  return t.length > 3 && t.endsWith('s') && txt.includes(t.slice(0, -1));
}

const ORDEN_BASE = new Map();
function prepararProductos() {
  PRODUCTOS.forEach(p => {
    p._txt = norm([p.nombre, CATEGORIAS[p.cat], p.sub, p.desc, ...p.trabaja.map(t => TRABAJA[t]), ...p.edades.map(e => EDADES[e].nombre), ...(p.tags || [])].join(' '));
  });
  const grupos = Object.keys(CATEGORIAS).map(c => PRODUCTOS.filter(p => p.cat === c));
  let k = 0;
  for (let i = 0; grupos.some(g => g[i]); i++) grupos.forEach(g => { if (g[i]) ORDEN_BASE.set(g[i].id, k++); });
}

const state = { q: '', cats: new Set(), trabaja: new Set(), edades: new Set(), precio: '', stock: false, orden: 'relevancia', visibles: POR_PAGINA };

function resultados() {
  const { edad, textos } = parseBusqueda(state.q);
  const rango = PRECIOS[state.precio];
  const lista = PRODUCTOS.filter(p => {
    const pf = precioFinal(p);
    return (!state.cats.size || state.cats.has(p.cat))
      && (!state.trabaja.size || p.trabaja.some(t => state.trabaja.has(t)))
      && (!state.edades.size || p.edades.some(e => state.edades.has(e)))
      && (!rango || (pf >= rango.min && pf <= rango.max))
      && (!state.stock || p.stock > 0)
      && (edad === null || p.edades.some(e => edad >= EDADES[e].min && edad <= EDADES[e].max))
      && textos.every(t => coincide(p._txt, t));
  });
  const porStock = (a, b) => (b.stock > 0) - (a.stock > 0);
  if (state.orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (state.orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (state.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => porStock(a, b) || ORDEN_BASE.get(a.id) - ORDEN_BASE.get(b.id));
  return lista;
}

const grid = document.getElementById('grid');
let ultimaLista = [];

function pintar(lista, desde, hasta) {
  const html = lista.slice(desde, hasta).map((p, i) => (esLista ? filaHTML : cardHTML)(p, i)).join('');
  if (desde === 0) grid.innerHTML = html;
  else grid.insertAdjacentHTML('beforeend', html);
}

function render({ scroll = false } = {}) {
  if (!grid) return;
  const lista = resultados();
  ultimaLista = lista;
  state.visibles = POR_PAGINA;
  pintar(lista, 0, state.visibles);
  actualizarMeta();
  revelarNuevos(grid);
  if (scroll) irATienda();
}

function actualizarMeta() {
  const n = ultimaLista.length;
  const count = document.getElementById('count');
  if (count) count.textContent = plural(n, 'producto', 'productos');
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = n > 0;
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = n <= state.visibles;
  const verRes = document.getElementById('verResultados');
  if (verRes) verRes.textContent = n ? `Ver ${plural(n, 'producto', 'productos')}` : 'Sin resultados';
  sincronizarControles();
}

function filtrosActivos() {
  const out = [];
  if (state.q.trim()) out.push({ k: 'q', v: '', t: `«${state.q.trim()}»` });
  state.cats.forEach(v => out.push({ k: 'cat', v, t: CATEGORIAS[v] }));
  state.trabaja.forEach(v => out.push({ k: 'trabaja', v, t: TRABAJA[v] }));
  state.edades.forEach(v => out.push({ k: 'edad', v, t: EDADES[v].nombre }));
  if (state.precio) out.push({ k: 'precio', v: state.precio, t: PRECIOS[state.precio].nombre });
  if (state.stock) out.push({ k: 'stock', v: '', t: 'Solo con stock' });
  return out;
}

function sincronizarControles() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = state.cats.has(i.value); });
  document.querySelectorAll('input[data-f="trabaja"]').forEach(i => { i.checked = state.trabaja.has(i.value); });
  document.querySelectorAll('input[data-f="edad"]').forEach(i => { i.checked = state.edades.has(i.value); });
  document.querySelectorAll('input[data-f="stock"]').forEach(i => { i.checked = state.stock; });
  document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === state.precio; });
  document.querySelectorAll('.fgrupo').forEach(g => {
    if (g.querySelector('input[data-f]:checked, input[name="precio"]:checked:not([value=""])')) g.open = true;
  });
  document.querySelectorAll('[data-trabaja]').forEach(b => b.setAttribute('aria-pressed', String(state.trabaja.has(b.dataset.trabaja))));
  document.querySelectorAll('[data-tab]').forEach(b => {
    const v = b.dataset.tab;
    const on = v ? state.cats.size === 1 && state.cats.has(v) : state.cats.size === 0;
    b.setAttribute('aria-pressed', String(on));
  });
  const edadSel = document.getElementById('edadSel');
  if (edadSel) edadSel.value = state.edades.size === 1 ? [...state.edades][0] : '';
  const orden = document.getElementById('orden');
  if (orden) orden.value = state.orden;
  const q = document.getElementById('q');
  if (q && document.activeElement !== q) q.value = state.q;
  const activos = filtrosActivos();
  const cont = document.getElementById('activos');
  if (cont) cont.innerHTML = activos.map(a => `<button type="button" class="activo" data-quitar="${a.k}" data-valor="${esc(a.v)}" aria-label="Quitar filtro ${esc(a.t)}">${esc(a.t)}${ICO.cerrar}</button>`).join('');
  const nf = document.getElementById('nFiltros');
  if (nf) nf.textContent = activos.length ? `(${activos.length})` : '';
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function limpiarFiltros() {
  state.q = ''; state.cats.clear(); state.trabaja.clear(); state.edades.clear(); state.precio = ''; state.stock = false;
  render();
}

function initCatalogo() {
  if (!grid) return;
  const conteo = {};
  PRODUCTOS.forEach(p => { conteo[p.cat] = (conteo[p.cat] || 0) + 1; });
  document.querySelectorAll('[data-n-cat]').forEach(el => { el.textContent = conteo[el.dataset.nCat] || 0; });
  document.querySelectorAll('[data-tab] .tab__n').forEach(el => {
    const v = el.parentElement.dataset.tab;
    el.textContent = v ? conteo[v] || 0 : PRODUCTOS.length;
  });

  document.querySelectorAll('input[data-f]').forEach(inp => inp.addEventListener('change', () => {
    const f = inp.dataset.f;
    if (f === 'stock') state.stock = inp.checked;
    else {
      const set = f === 'cat' ? state.cats : f === 'trabaja' ? state.trabaja : state.edades;
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
    }
    render();
  }));
  document.querySelectorAll('input[name="precio"]').forEach(inp => inp.addEventListener('change', () => { state.precio = inp.value; render(); }));
  document.getElementById('orden')?.addEventListener('change', e => { state.orden = e.target.value; render(); });
  document.getElementById('edadSel')?.addEventListener('change', e => {
    state.edades.clear();
    if (e.target.value) state.edades.add(e.target.value);
    render();
  });

  const q = document.getElementById('q');
  let tq = 0;
  q?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { state.q = q.value; render(); }, 200);
  });
  document.getElementById('buscador')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(tq);
    state.q = q ? q.value : '';
    render({ scroll: true });
    if (window.matchMedia('(hover: none)').matches) q?.blur();
  });

  document.getElementById('verMas')?.addEventListener('click', () => {
    const desde = state.visibles;
    state.visibles += POR_PAGINA;
    pintar(ultimaLista, desde, state.visibles);
    actualizarMeta();
    revelarNuevos(grid);
  });

  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);

  document.getElementById('headerSearch')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => q?.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
  });

  render();
}

function quitarFiltro(k, v) {
  if (k === 'q') state.q = '';
  else if (k === 'cat') state.cats.delete(v);
  else if (k === 'trabaja') state.trabaja.delete(v);
  else if (k === 'edad') state.edades.delete(v);
  else if (k === 'precio') state.precio = '';
  else if (k === 'stock') state.stock = false;
  render();
}

let revealsListos = false;

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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.045, 0.5)}s`; });
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
}

function refrescarAcciones() {
  const act = document.activeElement;
  let foco = null;
  if (act && act.closest && act.closest('[data-acciones]') && (act.dataset.add || act.dataset.mas || act.dataset.menos)) {
    foco = { id: act.dataset.add || act.dataset.mas || act.dataset.menos, menos: !!act.dataset.menos, cont: act.closest('[data-acciones]') };
  }
  document.querySelectorAll('[data-acciones]').forEach(c => {
    const p = getProducto(c.dataset.acciones);
    if (p) c.innerHTML = accionesHTML(p);
  });
  if (foco) {
    const q = qtyEnCarrito(foco.id);
    const destino = q > 0
      ? foco.cont.querySelector(foco.menos ? `[data-menos="${foco.id}"]` : `[data-mas="${foco.id}"]:not([disabled])`) || foco.cont.querySelector(`[data-menos="${foco.id}"]`)
      : foco.cont.querySelector(`[data-add="${foco.id}"]`);
    destino?.focus({ preventScroll: true });
  }
}

function objetivoCarrito() {
  const lineas = document.getElementById('pedidoLineas');
  const panel = document.getElementById('pedido');
  if (panel) {
    const r = panel.getBoundingClientRect();
    if (r.top < window.innerHeight - 40 && r.bottom > 60) return lineas && lineas.getBoundingClientRect().height ? lineas : panel;
  }
  const flotante = document.getElementById('cart-float');
  const header = document.querySelector('.site-header [data-open-cart]');
  const rh = header?.getBoundingClientRect();
  if (rh && rh.bottom > 0 && rh.top < window.innerHeight) return header;
  return flotante;
}

function volar(p, desde) {
  if (reduceMotion || !desde || typeof desde.animate !== 'function') return;
  const a = desde.getBoundingClientRect();
  if (!a.width || a.bottom < 0 || a.top > window.innerHeight) return;
  const destino = objetivoCarrito();
  if (!destino) return;
  const b = destino.getBoundingClientRect();
  const lado = Math.min(Math.max(a.width, 56), 120);
  const fly = document.createElement('div');
  fly.className = 'fly';
  fly.setAttribute('aria-hidden', 'true');
  fly.innerHTML = phHTML(p);
  Object.assign(fly.style, { width: `${lado}px`, height: `${lado}px`, left: `${a.left + a.width / 2 - lado / 2}px`, top: `${a.top + a.height / 2 - lado / 2}px` });
  document.body.appendChild(fly);
  const dx = b.left + Math.min(b.width, 80) / 2 - (a.left + a.width / 2);
  const dy = b.top + Math.min(b.height, 80) / 2 - (a.top + a.height / 2);
  const anim = fly.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.22)`, opacity: 0.35 },
  ], { duration: 720, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
  anim.onfinish = () => fly.remove();
}

function agregar(id, qty = 1, desde) {
  const p = getProducto(id);
  if (!p || p.stock <= 0) return false;
  const actual = qtyEnCarrito(id);
  if (actual >= p.stock) { showToast(`Ya tenés todo el stock de ${p.nombre} en tu pedido.`); return false; }
  const suma = Math.min(qty, p.stock - actual);
  volar(p, desde);
  Cart.add(p, suma);
  showToast(suma > 1 ? `Sumaste ${suma} de ${p.nombre} a tu pedido.` : `Sumaste ${p.nombre} a tu pedido.`);
  return true;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function lineaHTML(it, nueva) {
  const p = getProducto(it.id);
  if (!p) return '';
  return `<li class="linea${nueva ? ' linea--nueva' : ''}">
    ${phHTML(p)}
    <div>
      <p class="linea__name">${esc(p.nombre)}</p>
      <p class="linea__sub">${formatearPrecio(precioFinal(p))} c/u · <button type="button" class="quitar" data-quitar-linea="${p.id}">Quitar</button></p>
    </div>
    <div class="linea__right">
      <span class="linea__total">${formatearPrecio(precioFinal(p) * it.qty)}</span>
      ${stepperHTML(p, it.qty)}
    </div>
  </li>`;
}

function totalConEnvio() {
  const e = Envio.opcion();
  return Cart.total() + (e ? e.costo : 0);
}

function totalesHTML() {
  const e = Envio.opcion();
  const sub = Cart.total();
  const envio = e ? (e.costo ? formatearPrecio(e.costo) : 'Sin costo') : 'Elegí arriba';
  return `<dl class="totales">
    <div><dt>Productos (${Cart.count()})</dt><dd>${formatearPrecio(sub)}</dd></div>
    <div><dt>${e ? esc(e.nombre) : 'Envío'}</dt><dd>${envio}</dd></div>
    <div class="totales__total"><dt>Total</dt><dd data-total>${formatearPrecio(totalConEnvio())}${e ? '' : ' + envío'}</dd></div>
  </dl>`;
}

function entregaTexto() {
  const st = Envio.get();
  const e = Envio.opcion();
  if (!e) return 'Entrega: a coordinar';
  if (st.modo === 'turno') {
    return st.dia && st.franja ? `Entrega: retiro con turno el ${fechaLarga(desdeIso(st.dia))} ${FRANJAS[st.franja]}` : 'Entrega: retiro con turno, día a coordinar';
  }
  return `Entrega: ${e.nombre.toLowerCase()} (${formatearPrecio(e.costo)}), estimada para el ${fechaLarga(sumarHabiles(new Date(), e.dias))}`;
}

function lineasPedido() {
  return Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `${i.qty}x ${p.nombre} | ${formatearPrecio(precioFinal(p) * i.qty)}` : null;
  }).filter(Boolean);
}

function wspPedidoHref() {
  const e = Envio.opcion();
  return wspHref([
    `Hola ${MARCA}, quiero hacer este pedido:`, '',
    ...lineasPedido(), '',
    `Productos: ${formatearPrecio(Cart.total())}`,
    entregaTexto(),
    `Total: ${formatearPrecio(totalConEnvio())}${e ? '' : ' + envío'}`, '',
    '¿Me confirman la disponibilidad y cómo sigo con el pago?',
  ]);
}

function wspTurnoHref() {
  const st = Envio.get();
  const cuando = st.modo === 'turno' && st.dia && st.franja ? ` el ${fechaLarga(desdeIso(st.dia))} ${FRANJAS[st.franja]}` : '';
  const l = [`Hola ${MARCA}, quiero pedir un turno para ver la mercadería${cuando}.`];
  const items = lineasPedido();
  if (items.length) l.push('', 'Me interesan:', ...items);
  return wspHref(l);
}

function accionesPedidoHTML() {
  return `<div class="acciones-pedido">
    <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost btn--block" href="${wspPedidoHref()}" target="_blank" rel="noopener noreferrer">${ICO.wsp}Enviar el pedido por WhatsApp</a>
  </div>`;
}

function turnoValido(st) {
  return !!(st.dia && st.franja && proximosHabiles(3).some(d => isoDia(d) === st.dia));
}

function resultadoHTML(full) {
  const st = Envio.get();
  const e = Envio.opcion();
  if (!e) return 'Elegí una opción y te mostramos cuánto sale y cuándo te llega.';
  if (st.modo === 'turno') {
    const dias = proximosHabiles(3).map(d => {
      const iso = isoDia(d);
      return `<button type="button" class="dia" data-dia="${iso}" aria-pressed="${st.dia === iso}" aria-label="${esc(capitalizar(fechaLarga(d)))}"><span>${diaCorto(d)}</span><b>${d.getDate()}</b></button>`;
    }).join('');
    const franjas = Object.entries(FRANJAS).map(([k, t]) => `<button type="button" class="dia dia--franja" data-franja="${k}" aria-pressed="${st.franja === k}">${capitalizar(t)}</button>`).join('');
    const listo = turnoValido(st);
    return `<p><b>Retiro con turno, sin costo.</b> Elegí día y horario:</p>
      <div class="turno-dias" role="group" aria-label="Día del turno">${dias}</div>
      <div class="turno-franja" role="group" aria-label="Horario del turno">${franjas}</div>
      ${listo ? `<p>Te esperamos el <b>${fechaLarga(desdeIso(st.dia))}</b> ${FRANJAS[st.franja]}. La dirección te la pasamos por WhatsApp.</p>` : ''}
      ${full ? `<div class="calc__cta"><a class="btn btn--cta" href="${wspTurnoHref()}" target="_blank" rel="noopener noreferrer">${ICO.wsp}Pedir el turno por WhatsApp</a></div>` : ''}`;
  }
  const llega = sumarHabiles(new Date(), e.dias);
  const n = Cart.count();
  let detalle = '';
  if (full) {
    detalle = n
      ? `<p>Tu pedido: ${formatearPrecio(Cart.total())} + envío ${formatearPrecio(e.costo)} = <b>${formatearPrecio(totalConEnvio())}</b></p>`
      : '<p>Cuando sumes productos, el envío se agrega solo al total.</p>';
  }
  const cta = full
    ? `<div class="calc__cta">${n ? `<button type="button" class="btn btn--cta" data-open-cart>Ver mi pedido${ICO.flechaSm}</button>` : `<button type="button" class="btn btn--ghost" data-ir-tienda>Elegir productos${ICO.flechaSm}</button>`}</div>`
    : '';
  return `<div class="timeline">
      <span class="timeline__paso"><small>Hoy</small><b>Hacés el pedido</b></span>
      ${ICO.flecha}
      <span class="timeline__paso"><small>${esc(capitalizar(fechaLarga(llega)))}</small><b>Te llega a casa</b></span>
    </div>
    <p>${esc(e.nombre)}: <b>${formatearPrecio(e.costo)}</b></p>
    ${detalle}
    <p class="calc__nota">Costo y día estimados: se confirman al coordinar la entrega.</p>
    ${cta}`;
}

function initCalc(el) {
  const variante = el.dataset.calc;
  const name = `envio-${variante}`;
  el.innerHTML = `<fieldset class="calc__opts"><legend class="calc__tit">¿Cómo lo recibís?</legend>${Object.entries(ENVIOS).map(([k, e]) => `<label class="calc__opt"><input type="radio" name="${name}" value="${k}"><span class="calc__ico">${ICO[e.ico]}</span><span class="calc__txt"><b>${e.corto}</b><small>${e.detalle}</small></span><span class="calc__costo">${e.costo ? formatearPrecio(e.costo) : 'Sin costo'}</span></label>`).join('')}</fieldset><div class="calc__res" aria-live="polite"></div>`;
  el.addEventListener('change', ev => {
    const r = ev.target.closest('input[type="radio"]');
    if (r) Envio.set({ modo: r.value });
  });
  sincronizarCalc(el);
}

function sincronizarCalc(el) {
  const st = Envio.get();
  el.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = r.value === st.modo; });
  const res = el.querySelector('.calc__res');
  if (!res) return;
  res.className = `calc__res${st.modo ? '' : ' calc__res--vacio'}`;
  res.innerHTML = resultadoHTML(el.dataset.calc === 'full');
}

function refrescarCalcs() {
  const act = document.activeElement;
  const foco = act && act.dataset ? (act.dataset.dia ? `[data-dia="${act.dataset.dia}"]` : act.dataset.franja ? `[data-franja="${act.dataset.franja}"]` : null) : null;
  const cont = foco ? act.closest('.calc') : null;
  document.querySelectorAll('.calc').forEach(sincronizarCalc);
  if (cont && foco) cont.querySelector(foco)?.focus({ preventScroll: true });
}

let idsAntes = new Set();

function renderDrawer(nuevos) {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body || !foot) return;
  if (!body.dataset.listo) {
    body.innerHTML = `<div class="drawer-vacio" id="drawerVacio"><span class="arcos" aria-hidden="true"><i></i><i></i><i></i></span><strong>Todavía no sumaste nada</strong><p>Buscá por edad o por lo que querés trabajar: todo tiene precio y stock a la vista.</p><button type="button" class="btn btn--cta" data-ir-tienda>Ver productos</button></div><ul class="lineas" id="drawerLineas"></ul><div class="calc" data-calc="drawer"></div>`;
    body.dataset.listo = '1';
    initCalc(body.querySelector('.calc'));
  }
  const items = Cart.get();
  const vacio = items.length === 0;
  body.querySelector('#drawerVacio').hidden = !vacio;
  const lineas = body.querySelector('#drawerLineas');
  lineas.hidden = vacio;
  lineas.innerHTML = items.map(i => lineaHTML(i, nuevos && nuevos.has(i.id))).join('');
  body.querySelector('.calc').hidden = vacio;
  foot.hidden = vacio;
  foot.innerHTML = vacio ? '' : totalesHTML() + accionesPedidoHTML();
}

let totalPanel = 0;

function animarNumero(el, desde, hasta, sufijo) {
  if (!el) return;
  if (reduceMotion || desde === hasta) { el.textContent = formatearPrecio(hasta) + sufijo; return; }
  const t0 = window.performance.now();
  const dur = 520;
  const paso = t => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = formatearPrecio(desde + (hasta - desde) * e) + sufijo;
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function renderPanel(nuevos) {
  const cont = document.getElementById('pedidoBody');
  if (!cont) return;
  if (!cont.dataset.listo) {
    cont.innerHTML = `<div class="pedido__vacio" id="pedidoVacio"><span class="arcos" aria-hidden="true"><i></i><i></i><i></i></span><p>Todavía no sumaste nada. Tocá «Agregar» en la lista y tu pedido se arma acá.</p></div><ul class="lineas" id="pedidoLineas"></ul><div class="calc" data-calc="panel"></div><div id="pedidoTotales"></div><div id="pedidoAcciones"></div>`;
    cont.dataset.listo = '1';
    initCalc(cont.querySelector('.calc'));
  }
  const items = Cart.get();
  const vacio = items.length === 0;
  document.getElementById('pedidoVacio').hidden = !vacio;
  const lineas = document.getElementById('pedidoLineas');
  lineas.hidden = vacio;
  lineas.innerHTML = items.map(i => lineaHTML(i, nuevos && nuevos.has(i.id))).join('');
  const tot = document.getElementById('pedidoTotales');
  tot.innerHTML = vacio ? '' : totalesHTML();
  document.getElementById('pedidoAcciones').innerHTML = vacio ? '' : accionesPedidoHTML();
  const n = document.getElementById('pedidoN');
  if (n) n.textContent = plural(Cart.count(), 'producto', 'productos');
  const nuevoTotal = totalConEnvio();
  if (!vacio) {
    const dd = tot.querySelector('[data-total]');
    animarNumero(dd, totalPanel, nuevoTotal, Envio.opcion() ? '' : ' + envío');
  }
  totalPanel = vacio ? 0 : nuevoTotal;
}

function onCartActualizado() {
  const ahora = new Set(Cart.get().map(i => i.id));
  const nuevos = new Set([...ahora].filter(id => !idsAntes.has(id)));
  idsAntes = ahora;
  updateCartBadge();
  refrescarAcciones();
  renderDrawer(nuevos);
  renderPanel(nuevos);
  refrescarCalcs();
}

function onEnvioActualizado() {
  refrescarCalcs();
  const foot = document.getElementById('drawerFoot');
  if (foot && Cart.get().length) foot.innerHTML = totalesHTML() + accionesPedidoHTML();
  renderPanel(null);
  const qv = document.getElementById('qvEnvio');
  if (qv) qv.innerHTML = envioLineaHTML();
}

const overlays = [];

function abrirOverlay(el, opener, foco) {
  if (!el) return;
  el._opener = opener || document.activeElement;
  el.hidden = false;
  clearTimeout(el._t);
  if (!overlays.includes(el)) overlays.push(el);
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-open');
    (foco || el.querySelector('button[data-close-qv],button[data-close-drawer],button[data-close-filtros]'))?.focus({ preventScroll: true });
  }));
}

function cerrarOverlay(el, devolverFoco = true) {
  if (!el || !overlays.includes(el)) return;
  el.classList.remove('is-open');
  overlays.splice(overlays.indexOf(el), 1);
  if (!overlays.length) document.body.classList.remove('no-scroll');
  if (el.id !== 'filtrosWrap') {
    clearTimeout(el._t);
    el._t = setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 450);
  }
  const op = el._opener;
  if (devolverFoco && op && document.contains(op)) op.focus({ preventScroll: true });
}

function openCartDrawer(e) {
  const drawer = document.getElementById('drawer');
  const opener = e && e.currentTarget && e.currentTarget.nodeType === 1 ? e.currentTarget : document.activeElement;
  abrirOverlay(drawer, opener);
}

let qvCantidad = 1;

function envioLineaHTML() {
  const st = Envio.get();
  const e = Envio.opcion();
  if (!e) return `${ICO.camion}<span>El envío se calcula en tu pedido: en la ciudad, en la zona o con retiro con turno.</span>`;
  if (st.modo === 'turno') return `${ICO.cal}<span>Retiro con turno, sin costo. Elegís el día en tu pedido.</span>`;
  return `${ICO.camion}<span>${esc(e.nombre)}: ${formatearPrecio(e.costo)} · llega el ${fechaLarga(sumarHabiles(new Date(), e.dias))} (estimado).</span>`;
}

function qvHTML(p) {
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => (b.stock > 0) - (a.stock > 0) || ORDEN_BASE.get(a.id) - ORDEN_BASE.get(b.id)).slice(0, 3);
  const libre = Math.max(0, p.stock - qtyEnCarrito(p.id));
  qvCantidad = libre > 0 ? 1 : 0;
  const tags = [
    `<span class="tag">${ICO.edad}${edadTexto(p)}</span>`,
    ...p.trabaja.map(t => `<span class="tag">${ICO.check}${TRABAJA[t]}</span>`),
    p.cat === 'sensoriales' && p.silencioso ? `<span class="tag">${ICO.silencio}Silencioso</span>` : '',
  ].join('');
  let compra;
  if (p.stock <= 0) {
    compra = `<a class="btn btn--soft" href="${wspHref([`Hola ${MARCA}, ¿me avisan cuando vuelva a entrar ${p.nombre}?`])}" target="_blank" rel="noopener noreferrer">${ICO.wsp}Avisame cuando vuelva</a>`;
  } else if (libre <= 0) {
    compra = `<p class="qv__envio">${ICO.check}<span>Ya tenés todo el stock en tu pedido.</span></p><button type="button" class="btn btn--cta" data-qv-comprar="${p.id}">Ver mi pedido</button>`;
  } else {
    compra = `<div class="stepper" role="group" aria-label="Cantidad a sumar"><button type="button" data-qvq="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output id="qvCant">1</output><button type="button" data-qvq="1" aria-label="Sumar uno"${libre <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
      <button type="button" class="btn btn--cta" data-qv-add="${p.id}">Agregar al carrito</button>
      <button type="button" class="btn btn--ghost" data-qv-comprar="${p.id}">Comprar ahora</button>`;
  }
  return `<div class="qv__media">${phHTML(p, 1.3)}</div>
    <div class="qv__info">
      <p class="qv__cat">${esc(CATEGORIAS[p.cat])} · ${esc(p.sub)}</p>
      <h3>${esc(p.nombre)}</h3>
      <div class="qv__precio">${precioHTML(p)}${stockHTML(p)}</div>
      <div class="qv__tags">${tags}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__detalle">${p.detalle.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <div class="qv__compra">${compra}</div>
      <p class="qv__envio" id="qvEnvio">${envioLineaHTML()}</p>
    </div>
    ${rel.length ? `<div class="qv__rel"><h4>También te puede interesar</h4><ul>${rel.map(r => `<li><button type="button" class="rel" data-qv="${r.id}">${phHTML(r)}<span><b>${esc(r.nombre)}</b>${formatearPrecio(precioFinal(r))} · ${stockTexto(r)}</span></button></li>`).join('')}</ul></div>` : ''}`;
}

function abrirQV(id, opener) {
  const p = getProducto(id);
  const modal = document.getElementById('qv');
  const body = document.getElementById('qvBody');
  if (!p || !modal || !body) return;
  body.innerHTML = qvHTML(p);
  modal.querySelector('.modal__panel').scrollTop = 0;
  modal.dataset.id = p.id;
  const yaAbierto = overlays.includes(modal);
  if (!yaAbierto) abrirOverlay(modal, opener);
  else modal.querySelector('[data-close-qv].modal__close')?.focus({ preventScroll: true });
  intentar(() => window.history.replaceState(null, '', `?producto=${p.slug}`));
}

function cerrarQV(devolverFoco = true) {
  const modal = document.getElementById('qv');
  cerrarOverlay(modal, devolverFoco);
  intentar(() => window.history.replaceState(null, '', location.pathname));
}

function actualizarQVCantidad(delta) {
  const modal = document.getElementById('qv');
  const p = getProducto(modal?.dataset.id);
  if (!p) return;
  const libre = Math.max(0, p.stock - qtyEnCarrito(p.id));
  qvCantidad = Math.max(1, Math.min(libre, qvCantidad + delta));
  const out = document.getElementById('qvCant');
  if (out) out.textContent = qvCantidad;
  modal.querySelector('[data-qvq="-1"]').disabled = qvCantidad <= 1;
  modal.querySelector('[data-qvq="1"]').disabled = qvCantidad >= libre;
}

function finalizar(boton) {
  const st = Envio.get();
  const cont = boton.closest('.drawer__panel, .pedido');
  const calc = cont?.querySelector('.calc');
  if (!Envio.opcion()) {
    showToast('Elegí cómo lo recibís y el envío se suma al total.');
    calc?.querySelector('input[type="radio"]')?.focus();
    return;
  }
  if (st.modo === 'turno' && !turnoValido(st)) {
    showToast('Elegí el día y el horario del turno.');
    calc?.querySelector('[data-dia]')?.focus();
    return;
  }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initFiltrosMobile() {
  const wrap = document.getElementById('filtrosWrap');
  const btn = document.getElementById('btnFiltrar');
  const aside = document.getElementById('filtros');
  if (!wrap || !btn || !aside) return;
  const mq = window.matchMedia('(max-width: 1199px)');
  btn.addEventListener('click', () => {
    aside.setAttribute('role', 'dialog');
    aside.setAttribute('aria-modal', 'true');
    btn.setAttribute('aria-expanded', 'true');
    wrap.hidden = false;
    abrirOverlay(wrap, btn, aside.querySelector('[data-close-filtros]'));
  });
  wrap._alCerrar = () => {
    aside.removeAttribute('role');
    aside.removeAttribute('aria-modal');
    btn.setAttribute('aria-expanded', 'false');
  };
  mq.addEventListener('change', () => { if (!mq.matches && overlays.includes(wrap)) { cerrarOverlay(wrap, false); wrap._alCerrar(); } });
}

function cerrarArriba() {
  const top = overlays[overlays.length - 1];
  if (!top) return false;
  if (top.id === 'qv') cerrarQV();
  else { cerrarOverlay(top); top._alCerrar?.(); }
  return true;
}

function atraparFoco(e) {
  const top = overlays[overlays.length - 1];
  if (!top || e.key !== 'Tab') return;
  const caja = top.id === 'filtrosWrap' ? top.querySelector('.filtros') : top;
  const f = [...caja.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (!caja.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initInteracciones() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-mas],[data-menos],[data-quitar-linea],[data-open-cart],[data-qv],[data-finalizar],[data-dia],[data-franja],[data-qvq],[data-qv-add],[data-qv-comprar],[data-close-qv],[data-close-drawer],[data-close-filtros],[data-limpiar],[data-quitar],[data-ver-trabaja],[data-ir-cat],[data-trabaja],[data-tab],[data-ir-tienda]');
    if (!t) return;
    const d = t.dataset;
    if (d.add) {
      const desde = t.closest('.card, .fila')?.querySelector('.ph') || t;
      agregar(d.add, 1, desde);
    } else if (d.mas) {
      const p = getProducto(d.mas);
      const q = qtyEnCarrito(d.mas);
      if (p && q < p.stock) Cart.setQty(d.mas, q + 1);
    } else if (d.menos) {
      const q = qtyEnCarrito(d.menos);
      if (q <= 1) Cart.remove(d.menos); else Cart.setQty(d.menos, q - 1);
    } else if (d.quitarLinea) {
      Cart.remove(d.quitarLinea);
    } else if (t.hasAttribute('data-open-cart')) {
      if (overlays.includes(document.getElementById('qv'))) cerrarQV(false);
      abrirOverlay(document.getElementById('drawer'), t);
    } else if (d.qv) {
      abrirQV(d.qv, overlays.includes(document.getElementById('qv')) ? null : t);
    } else if (t.hasAttribute('data-finalizar')) {
      finalizar(t);
    } else if (d.dia) {
      Envio.set({ dia: d.dia });
    } else if (d.franja) {
      Envio.set({ franja: d.franja });
    } else if (d.qvq) {
      actualizarQVCantidad(Number(d.qvq));
    } else if (d.qvAdd) {
      const ok = agregar(d.qvAdd, qvCantidad, document.querySelector('#qvBody .qv__media .ph'));
      if (ok) {
        abrirQV(d.qvAdd);
        document.querySelector('#qvBody [data-qv-add], #qvBody [data-qv-comprar]')?.focus({ preventScroll: true });
      }
    } else if (d.qvComprar) {
      const libre = getProducto(d.qvComprar).stock - qtyEnCarrito(d.qvComprar);
      if (libre > 0) Cart.add(getProducto(d.qvComprar), qvCantidad);
      const qvModal = document.getElementById('qv');
      const opener = qvModal._opener;
      cerrarQV(false);
      abrirOverlay(document.getElementById('drawer'), opener);
    } else if (t.hasAttribute('data-close-qv')) {
      cerrarQV();
    } else if (t.hasAttribute('data-close-drawer')) {
      cerrarOverlay(document.getElementById('drawer'));
    } else if (t.hasAttribute('data-close-filtros')) {
      const wrap = document.getElementById('filtrosWrap');
      cerrarOverlay(wrap);
      wrap._alCerrar?.();
    } else if (t.hasAttribute('data-limpiar')) {
      limpiarFiltros();
    } else if (d.quitar) {
      quitarFiltro(d.quitar, d.valor || '');
    } else if (d.verTrabaja) {
      state.trabaja.add(d.verTrabaja);
      render({ scroll: true });
    } else if (d.irCat) {
      state.cats = new Set([d.irCat]);
      render({ scroll: true });
    } else if (d.trabaja) {
      if (state.trabaja.has(d.trabaja)) state.trabaja.delete(d.trabaja); else state.trabaja.add(d.trabaja);
      const tienda = document.getElementById('tienda');
      const lejos = tienda && tienda.getBoundingClientRect().top > window.innerHeight * 0.6;
      render({ scroll: lejos });
    } else if (d.tab !== undefined) {
      state.cats = new Set(d.tab ? [d.tab] : []);
      render();
    } else if (t.hasAttribute('data-ir-tienda')) {
      if (overlays.length) cerrarArriba();
      irATienda();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cerrarArriba()) { e.preventDefault(); return; }
    atraparFoco(e);
  });

  document.addEventListener('cart:updated', onCartActualizado);
  document.addEventListener('envio:updated', onEnvioActualizado);
  window.addEventListener('storage', e => {
    if (e.key === Cart.KEY) onCartActualizado();
    if (e.key === Envio.KEY) onEnvioActualizado();
  });
}

function initRincon() {
  const track = document.getElementById('rinconTrack');
  const frame = document.getElementById('rinconFrame');
  const img = document.getElementById('rinconImg');
  if (!track || !frame || !img) return;
  const scene = document.getElementById('rinconScene');
  const pasos = [...document.querySelectorAll('.rstep')];
  const dots = [...document.querySelectorAll('.rincon__dots i')];
  const cajaPasos = document.getElementById('rinconSteps');
  const iw = FOTOS.rincon.w;
  const ih = FOTOS.rincon.h;
  let actual = -1;

  pasos.forEach(paso => {
    const p = getProducto(paso.dataset.id);
    if (!p) return;
    const precio = paso.querySelector('[data-precio]');
    const stock = paso.querySelector('[data-stock]');
    if (precio) precio.textContent = formatearPrecio(precioFinal(p));
    if (stock) { stock.textContent = stockTexto(p); stock.className = `stock${p.stock <= 0 ? ' stock--sin' : p.stock <= 3 ? ' stock--poco' : ''}`; }
  });

  const camara = i => {
    const fw = frame.clientWidth;
    const fh = frame.clientHeight;
    if (!fw || !fh) return;
    const c = Math.max(fw / iw, fh / ih);
    const dw = iw * c;
    const dh = ih * c;
    img.style.width = `${dw}px`;
    img.style.height = `${dh}px`;
    const stop = RINCON[i];
    let tx = (fw - dw) / 2;
    let ty = (fh - dh) / 2;
    let z = 1;
    if (stop) {
      z = stop.z;
      tx = Math.min(0, Math.max(fw - dw * z, fw / 2 - stop.fx * dw * z));
      ty = Math.min(0, Math.max(fh - dh * z, fh / 2 - stop.fy * dh * z));
    }
    img.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${z})`;
  };

  const activar = i => {
    if (i === actual) return;
    actual = i;
    pasos.forEach((paso, k) => {
      const on = k === i;
      paso.classList.toggle('is-on', on);
      paso.setAttribute('aria-hidden', String(!on));
    });
    dots.forEach((d, k) => d.classList.toggle('is-on', k < i));
    camara(i);
  };

  const medir = () => {
    cajaPasos.style.height = '';
    const alto = Math.max(...pasos.map(p => p.offsetHeight));
    cajaPasos.style.height = `${alto}px`;
  };

  const leer = () => {
    const off = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const r = track.getBoundingClientRect();
    const recorrido = r.height - scene.offsetHeight;
    const prog = recorrido > 0 ? Math.min(1, Math.max(0, (off - r.top) / recorrido)) : 0;
    activar(Math.min(4, Math.floor(prog * 5)));
  };

  let pendiente = false;
  const onScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; leer(); });
  };

  medir();
  activar(0);
  camara(0);
  requestAnimationFrame(() => frame.classList.add('is-cam'));
  leer();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    frame.classList.remove('is-cam');
    medir();
    camara(actual);
    leer();
    requestAnimationFrame(() => frame.classList.add('is-cam'));
  }, { passive: true });
  if (img.complete === false) img.addEventListener('load', () => camara(actual), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
}

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

function abrirDesdeUrl() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (!slug) return;
  const p = PRODUCTOS.find(x => x.slug === slug);
  if (p) abrirQV(p.id, null);
}

function init() {
  prepararProductos();
  Cart.syncStock(PRODUCTOS);
  idsAntes = new Set(Cart.get().map(i => i.id));
  initCatalogo();
  document.querySelectorAll('[data-calc="full"]').forEach(initCalc);
  renderDrawer(null);
  renderPanel(null);
  initRincon();
  initReveals();
  initInteracciones();
  initFiltrosMobile();
  initNav();
  initModelBarScroll();
  initFloats();
  updateCartBadge();
  abrirDesdeUrl();
}

init();
