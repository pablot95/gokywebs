const WSP = "5493624625417";
const IG = "https://www.instagram.com/magico_amor/";
const ENVIO_GRATIS_DESDE = 95000;
const MAYORISTA_OFF = 0.28;
const MAYORISTA_MIN = 6;

const TALLES = [
  { id: "xs", label: "XS", peso: "hasta 3 kg", lomo: "20 a 28 cm", lomoNum: 24, razas: "Chihuahua, Yorkshire, Pinscher", factor: 0.75, escala: 0.5 },
  { id: "s", label: "S", peso: "3 a 7 kg", lomo: "28 a 38 cm", lomoNum: 33, razas: "Caniche, Salchicha, Shih Tzu", factor: 0.86, escala: 0.66 },
  { id: "m", label: "M", peso: "7 a 15 kg", lomo: "38 a 50 cm", lomoNum: 44, razas: "Beagle, Cocker, Schnauzer", factor: 1, escala: 0.82 },
  { id: "l", label: "L", peso: "15 a 30 kg", lomo: "50 a 65 cm", lomoNum: 57, razas: "Labrador, Boxer, Border Collie", factor: 1.2, escala: 1 },
  { id: "xl", label: "XL", peso: "más de 30 kg", lomo: "65 a 80 cm", lomoNum: 72, razas: "Ovejero, Rottweiler, Gran Danés", factor: 1.42, escala: 1.16 },
];

const CATEGORIAS = [
  { id: "camas", label: "Camas y colchonetas", corto: "Camas", img: "images/col-nube.webp", desc: "Colchonetas, somieres y almohadones que vuelven a su forma después de cada siesta." },
  { id: "niditos", label: "Moisés, iglús y niditos", corto: "Niditos", img: "images/iglu.webp", desc: "Para los que duermen hechos un ovillo y buscan cueva." },
  { id: "ropa", label: "Ropa", corto: "Ropa", img: "images/buzo.webp", desc: "Buzos, camperitas y pilotos cortados sobre el lomo de tu perro." },
  { id: "paseo", label: "Collares y paseo", corto: "Paseo", img: "images/collar.webp", desc: "Collares reforzados, correas y bandanas para salir bien vestido." },
];

const PRODUCTOS = [
  { id: 1, nombre: "Colchoneta Nube", categoria: "camas", precio: 32900, descuento: 0, talles: ["s", "m", "l", "xl"], tela: "Corderito y polar antipelo", destacado: true, nuevo: false, img: "images/col-nube.webp", desc: "La más pedida del taller. Corderito arriba, polar antipelo abajo y relleno de vellón siliconado que no se apelmaza. Se lava entera en el lavarropas y vuelve a su forma." },
  { id: 2, nombre: "Colchoneta Reversible", categoria: "camas", precio: 38500, descuento: 0, talles: ["s", "m", "l", "xl"], tela: "Polar de un lado, piqué del otro", destacado: false, nuevo: false, img: "images/col-reversible.webp", desc: "Una cara de polar para el invierno y una de piqué de algodón para los días de calor. La das vuelta y cambia de temporada sin comprar otra." },
  { id: 3, nombre: "Colchoneta Antipelo Resistente", categoria: "camas", precio: 41900, descuento: 0, talles: ["m", "l", "xl"], tela: "Gabardina antidesgarro", destacado: false, nuevo: true, img: "images/col-antipelo.webp", desc: "Pensada para perros grandes y para los que rascan antes de acostarse. Gabardina antidesgarro, doble costura en los bordes y base antideslizante." },
  { id: 4, nombre: "Somier de Pino Elevado", categoria: "camas", precio: 74900, descuento: 0, talles: ["m", "l"], tela: "Pino lustrado y lona reforzada", destacado: true, nuevo: false, img: "images/somier.webp", desc: "Estructura de pino lustrado con lona tensada: el perro duerme despegado del piso, ventilado en verano y lejos de la humedad. Incluye la colchoneta al tono." },
  { id: 5, nombre: "Almohadón Acolchado", categoria: "camas", precio: 27500, descuento: 15, talles: ["s", "m", "l"], tela: "Pana suave", destacado: false, nuevo: false, img: "images/almohadon.webp", desc: "Rectangular, de pana, con relleno generoso. Va solo en el piso o entra justo adentro del somier y del moisés." },
  { id: 6, nombre: "Mantita Polar", categoria: "camas", precio: 15900, descuento: 0, talles: ["xs", "s", "m", "l"], tela: "Polar doble faz", destacado: false, nuevo: false, img: "images/mantita.webp", desc: "La que se lleva al auto, a lo de la abuela y al veterinario. Polar doble faz con vivo cosido alrededor para que no se deshilache." },
  { id: 7, nombre: "Nidito Redondo", categoria: "niditos", precio: 36900, descuento: 0, talles: ["xs", "s", "m"], tela: "Peluche corderito", destacado: false, nuevo: false, img: "images/nidito.webp", desc: "Borde alto y mullido para apoyar la cabeza, base firme para que no se hunda. El favorito de los que duermen hechos un ovillo." },
  { id: 8, nombre: "Moisés Ovalado", categoria: "niditos", precio: 48900, descuento: 0, talles: ["s", "m", "l"], tela: "Corderito y sarga", destacado: true, nuevo: false, img: "images/moises.webp", desc: "Paredes acolchadas que abrazan y colchoneta interior que sale para lavar. El más elegido para cachorros y para perros que buscan rincón." },
  { id: 9, nombre: "Iglú Carpita", categoria: "niditos", precio: 59900, descuento: 0, talles: ["s", "m"], tela: "Lona de algodón y varillas de pino", destacado: false, nuevo: true, img: "images/iglu.webp", desc: "Cueva de lona con varillas de pino: se arma y se desarma en un minuto, y adentro va una colchoneta acolchada. Ideal para los que se esconden abajo de la mesa." },
  { id: 10, nombre: "Buzo Polar Abrigado", categoria: "ropa", precio: 18900, descuento: 0, talles: ["xs", "s", "m", "l", "xl"], tela: "Polar y puño elastizado", destacado: true, nuevo: false, img: "images/buzo.webp", desc: "Cuello alto, mangas cortas con puño elastizado y una abertura atrás para que haga pis sin mojarlo. El básico del invierno chaqueño." },
  { id: 11, nombre: "Sweater Tejido", categoria: "ropa", precio: 24500, descuento: 0, talles: ["xs", "s", "m", "l"], tela: "Lana acrílica tejida", destacado: false, nuevo: false, img: "images/sweater.webp", desc: "Tejido en lana acrílica que no pica ni encoge al lavarlo. Elástico en el cuello y en la cintura para que no se corra cuando corre." },
  { id: 12, nombre: "Piloto Impermeable", categoria: "ropa", precio: 27900, descuento: 0, talles: ["s", "m", "l", "xl"], tela: "Nylon impermeable con forro", destacado: false, nuevo: true, img: "images/piloto.webp", desc: "Nylon impermeable con forro interior y capucha. Cubre lomo y panza, y tiene tiras reflectivas para el paseo de la noche." },
  { id: 13, nombre: "Camperita Acolchada", categoria: "ropa", precio: 29900, descuento: 0, talles: ["xs", "s", "m", "l"], tela: "Nylon acolchado", destacado: false, nuevo: false, img: "images/camperita.webp", desc: "Acolchada y liviana, con cierre al costado para que entre sin pelear. Se cierra sola con abrojo y no le aprieta el cuello." },
  { id: 14, nombre: "Chaleco Rayado de Algodón", categoria: "ropa", precio: 14900, descuento: 20, talles: ["xs", "s", "m", "l"], tela: "Algodón rayado", destacado: false, nuevo: false, img: "images/chaleco.webp", desc: "Sin mangas y en algodón: abriga apenas, para las noches frescas de entretiempo o para andar por casa bien vestido." },
  { id: 15, nombre: "Collar Clásico Reforzado", categoria: "paseo", precio: 12900, descuento: 0, talles: ["xs", "s", "m", "l", "xl"], tela: "Cinta reforzada y herrajes metálicos", destacado: false, nuevo: false, img: "images/collar.webp", desc: "Cinta gruesa con costura de refuerzo en los extremos, hebilla metálica y argolla soldada. Regulable, para que acompañe el crecimiento." },
  { id: 16, nombre: "Bandana Cuadrillé", categoria: "paseo", precio: 7900, descuento: 0, talles: ["s", "m", "l"], tela: "Algodón cuadrillé", destacado: false, nuevo: false, img: "images/bandana.webp", desc: "Se pasa por el collar, así no queda floja ni se le engancha. Algodón cuadrillé que sale del lavarropas como nueva." },
  { id: 17, nombre: "Set Collar + Correa", categoria: "paseo", precio: 24900, descuento: 0, talles: ["s", "m", "l", "xl"], tela: "Cinta reforzada al tono", destacado: true, nuevo: false, img: "images/set-paseo.webp", desc: "Collar regulable y correa de 1,20 m en la misma tela, con mosquetón reforzado y manija acolchada para que no lastime la mano." },
  { id: 18, nombre: "Bandana Estampada", categoria: "paseo", precio: 7900, descuento: 0, talles: ["s", "m", "l"], tela: "Algodón estampado", destacado: false, nuevo: false, img: "images/bandana-fiesta.webp", desc: "Para el cumple, la foto o el paseo del domingo. Estampados que rotan seguido: preguntá por los que hay esta semana." },
];

const TALLER = [
  { n: "01", titulo: "Elegimos la tela", texto: "Polar antipelo, corderito, gabardina o lona. Todas lavables en lavarropas, ninguna que largue pelusa." },
  { n: "02", titulo: "Cortamos sobre la medida", texto: "Con el lomo y el peso de tu perro, no sobre un molde genérico que le queda grande o corto." },
  { n: "03", titulo: "Rellenamos con vellón", texto: "Vellón siliconado, el que vuelve a su forma después de la siesta y no queda hecho una tabla." },
  { n: "04", titulo: "Cosemos reforzado", texto: "Doble costura en todo el contorno: el borde es donde más tira cuando rascan antes de acostarse." },
  { n: "05", titulo: "Y sale para tu casa", texto: "Lo despachamos desde Resistencia por correo o transporte, a cualquier punto del país." },
];

const FAQ = [
  { q: "¿Hacen envíos a todo el país?", a: "Sí. Despachamos desde Resistencia por correo o por transporte, y te pasamos el seguimiento apenas sale. El costo depende de la provincia y lo confirmamos por WhatsApp antes de enviar; arriba de $95.000 el envío corre por nuestra cuenta." },
  { q: "¿Cómo sé qué talle pedir?", a: "Medí el lomo de tu perro, del cuello al nacimiento de la cola, y fijate el peso. Con esos dos datos usás el medidor de arriba o nos escribís y te decimos cuál le queda." },
  { q: "¿Se pueden lavar?", a: "Todas las telas van al lavarropas en ciclo suave y agua fría. Las colchonetas grandes conviene secarlas al sol, no en secarropas, para que el vellón no se apelmace." },
  { q: "¿Hacen medidas especiales?", a: "Sí, es lo que más nos gusta. Si tu perro no entra en ningún talle o querés una tela puntual, mandanos las medidas por WhatsApp y lo cotizamos." },
  { q: "¿Cómo compro para mi pet shop?", a: "El precio mayorista sale desde 6 unidades por modelo y podés combinar talles y telas dentro de ese modelo. Activá el precio pet shop en la tienda o pedinos la lista completa por WhatsApp." },
  { q: "¿Cómo se paga?", a: "Por transferencia o efectivo al retirar en Resistencia. En la web todavía no hay pago online: armás el pedido acá y lo cerramos por WhatsApp." },
];
