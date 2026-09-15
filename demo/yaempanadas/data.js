/* Datos demostrativos — Ya EMPANADAS (Formosa). Un único curso en PDF.
   Precio, cantidad de páginas y contenidos con fines de demostración. */
/* eslint-disable no-unused-vars -- consumidos por script.js vía scope global */
const WSP = "5493704570989";

const CURSO = {
  nombre: "Empanadas de cero",
  precio: 18900,
  paginas: 84,
  recetas: 12,
  masas: 4,
  repulgues: 6,
  formato: "PDF",
};

/* Los 6 módulos del curso: son las "páginas" que se pasan en la sección firma. */
const MODULOS = [
  {
    n: "01",
    titulo: "La masa",
    paginas: 14,
    desde: 1,
    resumen: "La criolla al horno y la de freír, con las proporciones exactas, el punto de la grasa y el descanso que casi nadie respeta.",
    puntos: ["Criolla, de freír, hojaldrada e integral", "Cómo estirar y cortar sin que se encoja", "Los 5 errores que arruinan la masa"],
    img: "images/emp-queso.jpg",
    alt: "Tabla con empanadas de distintas masas",
  },
  {
    n: "02",
    titulo: "Los 12 rellenos",
    paginas: 26,
    desde: 15,
    resumen: "Carne a cuchillo, pollo, jamón y queso, humita y ocho más. Cada una con su corte, su cocción y su punto de sal.",
    puntos: ["Las 4 clásicas, bien explicadas", "4 especiales para diferenciarte", "4 veggie y dulces para cerrar"],
    img: "images/emp-carne.jpg",
    alt: "Plato con empanadas de carne servidas con salsa",
  },
  {
    n: "03",
    titulo: "El armado y el repulgue",
    paginas: 16,
    desde: 41,
    resumen: "El momento que frena a todo el mundo. Seis repulgues con foto de cada pliegue, para que cierren parejos y no se abran.",
    puntos: ["Cuánto relleno va (y cuánto no)", "6 repulgues paso a paso", "Cómo sellar para que no pierdan jugo"],
    img: "images/emp-humita.jpg",
    alt: "Empanadas con el repulgue trenzado a la vista",
  },
  {
    n: "04",
    titulo: "La cocción",
    paginas: 12,
    desde: 57,
    resumen: "Horno de casa, sartén o freidora de aire: temperaturas, tiempos y cómo darte cuenta de que ya están.",
    puntos: ["Temperatura real del horno común", "Pintado y dorado parejo", "Versión frita y en freidora de aire"],
    img: "images/emp-pollo.jpg",
    alt: "Empanadas recién horneadas en una bandeja",
  },
  {
    n: "05",
    titulo: "Freezar y conservar",
    paginas: 8,
    desde: 69,
    resumen: "Cómo dejar la docena lista en el freezer y que salgan igual de ricas dentro de dos meses.",
    puntos: ["Freezado crudo, bandeja por bandeja", "Cuánto duran de verdad", "Cómo cocinarlas sin descongelar"],
    img: "images/emp-verdura.jpg",
    alt: "Empanada de masa rústica apoyada sobre un paño",
  },
  {
    n: "06",
    titulo: "Si querés vender",
    paginas: 8,
    desde: 77,
    resumen: "El bonus: cuánto te cuesta cada empanada, a cuánto conviene venderla y cómo organizar la primera tanda de pedidos.",
    puntos: ["Costo real por unidad y por docena", "Cómo poner precio sin quedarte corto", "Producción por tandas desde tu cocina"],
    img: "images/nosotros.jpg",
    alt: "Manos armando empanadas sobre la mesada de trabajo",
  },
];

/* Las 12 recetas del módulo 02, para la lista de la sección "Las recetas". */
const RECETAS = [
  "Carne a cuchillo", "Carne picada suave", "Pollo al verdeo", "Jamón y queso",
  "Humita cremosa", "Verdura y salsa blanca", "Caprese", "Roquefort y jamón",
  "Choclo y queso", "Cebolla y queso", "Batata y dulce", "Manzana y canela",
];
