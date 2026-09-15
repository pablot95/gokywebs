/* Datos demostrativos — Muebles de pino Posadas (Garupá, Misiones). Modelos con fines de demostración. */
/* eslint-disable no-unused-vars -- consumidos por script.js vía scope global */
const WSP = "5493764243734";

const CATEGORIAS = [
  { id: "dormitorio", label: "Dormitorio" },
  { id: "living",     label: "Living y comedor" },
  { id: "infantil",   label: "Infantil" },
  { id: "colchones",  label: "Colchones" },
  { id: "medida",     label: "A medida" },
];

const PRODUCTOS = [
  { id: 1,  nombre: "Cama de pino 2 plazas",       categoria: "dormitorio", desc: "Pino macizo con respaldo alto. También en 1 plaza, Queen y King.",            img: "images/m-cama.jpg",        destacado: true },
  { id: 2,  nombre: "Ropero de 3 puertas",         categoria: "dormitorio", desc: "Tres puertas y cajones internos. Amplio, resistente y bien terminado.",       img: "images/m-ropero.jpg",      destacado: true },
  { id: 3,  nombre: "Cómoda de 4 cajones",         categoria: "dormitorio", desc: "Cajones con guías suaves. Ideal para sumar orden al dormitorio.",             img: "images/m-comoda.jpg",      destacado: false },
  { id: 4,  nombre: "Mesa de luz",                 categoria: "dormitorio", desc: "Con cajón y estante. Se puede hacer en juego con la cama.",                   img: "images/m-comoda.jpg",      destacado: false },
  { id: 5,  nombre: "Juego de comedor",            categoria: "living",     desc: "Mesa de pino más 4 o 6 sillas. Medida a elección.",                           img: "images/m-comedor.jpg",     destacado: true },
  { id: 6,  nombre: "Rack para TV",                categoria: "living",     desc: "Con estantes y espacio para el equipo. En el largo que necesites.",           img: "images/m-racktv.jpg",      destacado: false },
  { id: 7,  nombre: "Biblioteca de pino",          categoria: "living",     desc: "Estantería alta y firme. Perfecta para libros, plantas y deco.",              img: "images/m-biblioteca.jpg",  destacado: false },
  { id: 8,  nombre: "Mesa ratona",                 categoria: "living",     desc: "Baja, con estante inferior. Le da calidez al living.",                        img: "images/m-racktv.jpg",      destacado: false },
  { id: 9,  nombre: "Cucheta infantil",            categoria: "infantil",   desc: "Cucheta de pino con baranda y escalera reforzada. Segura y resistente.",      img: "images/m-infantil.jpg",    destacado: true },
  { id: 10, nombre: "Cama infantil con cajones",   categoria: "infantil",   desc: "Cama baja con cajones para guardar. Rinde cada centímetro.",                  img: "images/m-infantil.jpg",    destacado: false },
  { id: 11, nombre: "Escritorio de pino",          categoria: "infantil",   desc: "Para estudiar o trabajar. Con cajón y estante opcional.",                     img: "images/m-escritorio.jpg",  destacado: false },
  { id: 12, nombre: "Placard a medida",            categoria: "medida",     desc: "Lo diseñamos para tu espacio: puertas, cajones y estantes a tu gusto.",       img: "images/m-ropero.jpg",      destacado: true },
  { id: 13, nombre: "Colchón 2 plazas resortes",   categoria: "colchones",  desc: "Resortes con pillow. Firmeza equilibrada para un buen descanso.",             img: "images/m-colchon.jpg",     destacado: true },
  { id: 14, nombre: "Colchón 1 plaza espuma",      categoria: "colchones",  desc: "Espuma de alta densidad. Ideal para camas infantiles y de una plaza.",        img: "images/m-colchon.jpg",     destacado: false },
  { id: 15, nombre: "Colchón Queen premium",       categoria: "colchones",  desc: "Doble pillow y mayor soporte. Para el descanso de dos, sin apretarse.",       img: "images/m-colchon.jpg",     destacado: false },
];
