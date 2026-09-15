/* Claudio Moabre — datos del sitio. Shows reales del brief; textos demostrativos. */
/* eslint-disable no-unused-vars -- consumidos por script.js vía scope global */
const WSP = "5491167553539";

const SHOWS = [
  {
    n: "01",
    titulo: "Magia infantil",
    bajada: "Para cumpleaños y fiestas de chicos",
    texto: "Magia participativa: los chicos suben, sostienen, soplan y hacen aparecer las cosas ellos mismos. Se ríen, gritan y quedan con la sensación de haber hecho magia.",
    tags: ["Cumpleaños", "3 a 10 años", "30 a 45 min"],
    img: "images/magia-infantil-1600x1300.webp",
    alt: "Chicos en una fiesta mirando el show con globos en la mano",
  },
  {
    n: "02",
    titulo: "Show familiar",
    bajada: "Cuando hay abuelos, chicos y todo el resto",
    texto: "El show más difícil de armar y el que más se agradece: efectos que funcionan para un nene de cinco y para su abuelo, sin que ninguno se aburra esperando.",
    tags: ["Aniversarios", "Todo público", "45 min"],
    img: "images/show-escenario-1600x1300.webp",
    alt: "Mago en escena con una esfera de cristal bajo luces rojas",
  },
  {
    n: "03",
    titulo: "Mentalismo",
    bajada: "Para adultos, con la piel de gallina incluida",
    texto: "Predicciones, pensamientos adivinados y elecciones imposibles. Nadie sube al escenario a hacer papelones: la gente participa desde su lugar y no entiende nada.",
    tags: ["Adultos", "Cenas y fiestas", "40 min"],
    img: "images/mentalismo-1600x1300.webp",
    alt: "Manos de mago sosteniendo una carta en blanco y negro",
  },
  {
    n: "04",
    titulo: "Ventriloquía",
    bajada: "El personaje que se roba la fiesta",
    texto: "Humor en vivo con muñeco, improvisando con el público. Funciona igual de bien en un cumpleaños de chicos que en una cena de fin de año.",
    tags: ["Humor", "Todo público", "20 a 30 min"],
    img: "images/show-recepcion-1600x1300.webp",
    alt: "Artista haciendo un número de magia frente a los invitados",
  },
  {
    n: "05",
    titulo: "Eventos corporativos",
    bajada: "Fin de año, lanzamientos y capacitaciones",
    texto: "Un show que corta la formalidad sin romperla. Si la empresa quiere, sumamos el producto o el mensaje de la campaña adentro de los efectos.",
    tags: ["Empresas", "Hasta 200 personas", "A medida"],
    img: "images/corporativo-1600x1300.webp",
    alt: "Público aplaudiendo durante un evento de empresa",
  },
  {
    n: "06",
    titulo: "Magia de recepción",
    bajada: "Mesa por mesa, mientras llegan los invitados",
    texto: "Magia a un metro de distancia, en las manos de la gente. Ideal para la hora en que todavía no arrancó la fiesta y nadie sabe qué hacer.",
    tags: ["Casamientos", "Cócteles", "1 a 2 horas"],
    img: "images/show-recepcion-1600x1300.webp",
    alt: "Mago haciendo magia de cerca a los invitados de una fiesta",
  },
];

/* El truco de la sección "Pensá una carta": las 6 que se muestran y las 5 que vuelven.
   Las finales repiten los mismos valores pero con el palo cambiado por su par del mismo color
   (♥↔♦, ♠↔♣): el ojo reconoce "las mismas cartas", pero ninguna es la que pensó. */
const CARTAS_INICIO = [
  { v: "K", p: "♠" }, { v: "Q", p: "♥" }, { v: "J", p: "♦" },
  { v: "A", p: "♣" }, { v: "10", p: "♠" }, { v: "9", p: "♥" },
];
const CARTAS_FINAL = [
  { v: "Q", p: "♦" }, { v: "9", p: "♦" }, { v: "K", p: "♣" },
  { v: "J", p: "♥" }, { v: "10", p: "♣" },
];
