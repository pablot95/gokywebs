const WHATSAPP_NUMBER = "5491139385526";
const MARCA = "Ronin3d";
const PAGE_SIZE = 16;
const API_MAX = 100;
const DESTACADOS_MAX = 8;
const esDOM = typeof document !== "undefined";
const reduceMotion =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const CATEGORIAS = {
  figuras: "Figuras",
  bustos: "Bustos",
  dragones: "Dragones",
  deco: "Deco y útiles",
};
const COLORES = {
  negro: { label: "Negro", hex: "#1b1b1b" },
  rojo: { label: "Rojo", hex: "#b3252c" },
  gris: { label: "Gris", hex: "#8c8c8c" },
  blanco: { label: "Blanco", hex: "#f4f4f4" },
};

const PRODUCTOS = [
  {
    id: "dragon-ruinas",
    nombre: "Dragón sobre las ruinas",
    cat: "dragones",
    precio: 148000,
    descuento: 0,
    stock: 2,
    colores: ["negro", "rojo"],
    color: "negro",
    alto: 32,
    img: "p-dragon-ruinas.webp",
    destacado: 1,
    nuevo: false,
    tags: ["escultura", "vitrina", "castillo", "pieza grande"],
    desc: "Pieza de vitrina en dos tonos: dragón negro con membranas rojas posado sobre un castillo en ruinas. Se imprime en partes, se pega y se termina a mano. La base va incluida.",
  },
  {
    id: "busto-cornuda",
    nombre: "Busto Dama de los cuernos",
    cat: "bustos",
    precio: 68000,
    descuento: 0,
    stock: 3,
    colores: ["blanco", "gris"],
    color: "blanco",
    alto: 28,
    img: "p-busto-cornuda.webp",
    destacado: 2,
    nuevo: false,
    tags: ["busto", "fantasía", "vitrina"],
    desc: "Busto en PLA blanco con cuernos y detalles en rojo. Sale del taller con el acabado que se ve en la foto, listo para exhibir o para que lo pintes vos.",
  },
  {
    id: "samurai",
    nombre: "Samurái con katana",
    cat: "figuras",
    precio: 42000,
    descuento: 0,
    stock: 6,
    colores: ["negro", "gris"],
    color: "negro",
    alto: 22,
    img: "p-samurai.webp",
    destacado: 3,
    nuevo: false,
    tags: ["samurai", "japón", "guerrero", "miniatura"],
    desc: "Samurái en pose de guardia sobre una base de ruinas. Impreso en resolución fina para que se lean las escamas de la armadura y los pliegues de la capa.",
  },
  {
    id: "craneo-dragon",
    nombre: "Cráneo de dragón",
    cat: "bustos",
    precio: 54000,
    descuento: 10,
    stock: 4,
    colores: ["blanco", "gris", "negro"],
    color: "blanco",
    alto: 24,
    img: "p-craneo-dragon.webp",
    destacado: 4,
    nuevo: false,
    tags: ["cráneo", "dragón", "escritorio", "trofeo"],
    desc: "Cráneo de dragón con cuernos y dientes definidos, sobre base negra. Una pieza de escritorio que se lleva todas las miradas.",
  },
  {
    id: "oni",
    nombre: "Oni rojo",
    cat: "figuras",
    precio: 36000,
    descuento: 0,
    stock: 5,
    colores: ["rojo", "negro"],
    color: "rojo",
    alto: 18,
    img: "p-oni.webp",
    destacado: 5,
    nuevo: false,
    tags: ["oni", "demonio", "japón", "miniatura"],
    desc: "Demonio oni con cuernos y colmillos, en PLA rojo sobre base rocosa. Pensado para la vitrina o la mesa de juego.",
  },
  {
    id: "busto-cyborg",
    nombre: "Busto Cyborg",
    cat: "bustos",
    precio: 72000,
    descuento: 0,
    stock: 2,
    colores: ["gris", "blanco"],
    color: "gris",
    alto: 30,
    img: "p-busto-cyborg.webp",
    destacado: 6,
    nuevo: false,
    tags: ["cyborg", "ciencia ficción", "busto"],
    desc: "Busto de ciencia ficción con cables y placas de armadura impresos en una sola pieza. Acabado gris mate, sin soportes a la vista.",
  },
  {
    id: "dragon-articulado",
    nombre: "Dragón articulado",
    cat: "dragones",
    precio: 19500,
    descuento: 0,
    stock: 14,
    colores: ["negro", "rojo", "gris", "blanco"],
    color: "negro",
    alto: 40,
    img: "p-dragon-articulado.webp",
    destacado: 7,
    nuevo: true,
    tags: ["articulado", "flexi", "juguete", "dragón"],
    desc: "Dragón flexible que sale impreso ya articulado: se mueve en cada segmento de la cola y del cuerpo. Mide 40 cm de largo. Bicolor negro y rojo o del color que elijas.",
  },
  {
    id: "florero-espiral",
    nombre: "Florero espiral",
    cat: "deco",
    precio: 14500,
    descuento: 0,
    stock: 9,
    colores: ["rojo", "negro", "blanco", "gris"],
    color: "rojo",
    alto: 22,
    img: "p-florero-espiral.webp",
    destacado: 8,
    nuevo: false,
    tags: ["florero", "deco", "hogar", "regalo"],
    desc: "Florero de pared fina con relieve en espiral, impreso en modo vaso. Para flores secas o como pieza de deco.",
  },
  {
    id: "busto-espartano",
    nombre: "Busto Espartano",
    cat: "bustos",
    precio: 58000,
    descuento: 0,
    stock: 3,
    colores: ["negro", "gris"],
    color: "negro",
    alto: 26,
    img: "p-busto-espartano.webp",
    destacado: 0,
    nuevo: false,
    tags: ["espartano", "guerrero", "casco", "busto"],
    desc: "Busto de hoplita con casco de cresta, armadura y capa. Impreso en negro y terminado a mano para que las escamas se vean nítidas.",
  },
  {
    id: "busto-dama",
    nombre: "Busto clásico Dama",
    cat: "bustos",
    precio: 39000,
    descuento: 15,
    stock: 4,
    colores: ["blanco", "gris"],
    color: "blanco",
    alto: 24,
    img: "p-busto-dama.webp",
    destacado: 0,
    nuevo: false,
    tags: ["clásico", "escultura", "busto", "deco"],
    desc: "Busto de inspiración clásica con pliegues y peinado trenzado, en PLA blanco mate. Queda bien en una biblioteca o un escritorio.",
  },
  {
    id: "busto-caballero",
    nombre: "Busto Caballero oscuro",
    cat: "bustos",
    precio: 61000,
    descuento: 0,
    stock: 2,
    colores: ["negro"],
    color: "negro",
    alto: 28,
    img: "p-busto-caballero.webp",
    destacado: 0,
    nuevo: false,
    tags: ["caballero", "armadura", "busto", "fantasía"],
    desc: "Caballero con yelmo cerrado y hombreras, en negro. Las ranuras del yelmo se imprimen abiertas para que la luz pase.",
  },
  {
    id: "busto-rojo",
    nombre: "Busto Guerrero carmesí",
    cat: "bustos",
    precio: 64000,
    descuento: 0,
    stock: 1,
    colores: ["rojo", "negro"],
    color: "rojo",
    alto: 27,
    img: "p-busto-rojo.webp",
    destacado: 0,
    nuevo: false,
    tags: ["guerrero", "armadura", "busto", "rojo"],
    desc: "Busto de guerrero con yelmo y armadura de placas, impreso en rojo y negro. Queda una unidad lista para llevar.",
  },
  {
    id: "casco",
    nombre: "Casco de cazador, escala real",
    cat: "bustos",
    precio: 95000,
    descuento: 0,
    stock: 2,
    colores: ["gris", "negro"],
    color: "gris",
    alto: 30,
    img: "p-casco.webp",
    destacado: 0,
    nuevo: false,
    tags: ["casco", "escala real", "cosplay", "exhibición"],
    desc: "Casco en escala real impreso en partes y unido en el taller, con base de exhibición. Para vitrina o como pieza de cosplay.",
  },
  {
    id: "dragon-rojo",
    nombre: "Dragón guardián rojo",
    cat: "dragones",
    precio: 24000,
    descuento: 0,
    stock: 7,
    colores: ["rojo", "negro"],
    color: "rojo",
    alto: 14,
    img: "p-dragon-rojo.webp",
    destacado: 0,
    nuevo: false,
    tags: ["dragón", "guardián", "escritorio"],
    desc: "Dragón sentado con las alas abiertas, impreso en rojo. Pieza de escritorio que no necesita base.",
  },
  {
    id: "dragon-blanco",
    nombre: "Dragón de mesa blanco",
    cat: "dragones",
    precio: 21000,
    descuento: 0,
    stock: 0,
    colores: ["blanco", "gris"],
    color: "blanco",
    alto: 12,
    img: "p-dragon-blanco.webp",
    destacado: 0,
    nuevo: false,
    tags: ["dragón", "mesa", "blanco"],
    desc: "Dragón recostado sobre su base, en PLA blanco. Se imprime a pedido cuando no hay stock: escribinos y te decimos el plazo.",
  },
  {
    id: "samurai-taller",
    nombre: "Samurái carmesí",
    cat: "figuras",
    precio: 38000,
    descuento: 0,
    stock: 4,
    colores: ["negro", "rojo"],
    color: "negro",
    alto: 20,
    img: "p-samurai-taller.webp",
    destacado: 0,
    nuevo: false,
    tags: ["samurai", "guerrero", "japón", "bicolor"],
    desc: "Samurái con katana desenvainada sobre base de ruinas, en negro con detalles rojos. Impreso en dos materiales en la misma pasada.",
  },
  {
    id: "lobo",
    nombre: "Lobo de las ruinas",
    cat: "figuras",
    precio: 27000,
    descuento: 0,
    stock: 6,
    colores: ["gris", "negro"],
    color: "gris",
    alto: 12,
    img: "p-lobo.webp",
    destacado: 0,
    nuevo: false,
    tags: ["lobo", "bestia", "criatura", "miniatura"],
    desc: "Criatura lobuna al acecho, en gris, sobre base redonda. Escala pensada para la mesa de juego.",
  },
  {
    id: "dama-kimono",
    nombre: "Dama con kimono",
    cat: "figuras",
    precio: 29000,
    descuento: 0,
    stock: 5,
    colores: ["gris", "blanco"],
    color: "gris",
    alto: 16,
    img: "p-dama-kimono.webp",
    destacado: 0,
    nuevo: false,
    tags: ["kimono", "japón", "figura", "dama"],
    desc: "Figura de una dama con kimono al viento junto a un farol de piedra. Impresa en gris claro, con los pliegues de la tela bien marcados.",
  },
  {
    id: "guerrera",
    nombre: "Guerrera del viento",
    cat: "figuras",
    precio: 31000,
    descuento: 0,
    stock: 3,
    colores: ["negro", "gris"],
    color: "negro",
    alto: 17,
    img: "p-guerrera.webp",
    destacado: 0,
    nuevo: false,
    tags: ["guerrera", "capa", "figura", "fantasía"],
    desc: "Guerrera en movimiento con la capa al viento, impresa en negro. Una pieza con mucho dinamismo para el estante.",
  },
  {
    id: "mago",
    nombre: "Mago errante",
    cat: "figuras",
    precio: 33000,
    descuento: 0,
    stock: 4,
    colores: ["negro", "gris"],
    color: "negro",
    alto: 18,
    img: "p-mago.webp",
    destacado: 0,
    nuevo: false,
    tags: ["mago", "bastón", "figura", "fantasía"],
    desc: "Mago con bastón y túnica en pose de combate, sobre base negra. Impreso en negro y terminado a mano.",
  },
  {
    id: "castillo",
    nombre: "Castillo en miniatura",
    cat: "deco",
    precio: 17500,
    descuento: 0,
    stock: 8,
    colores: ["gris", "negro", "blanco"],
    color: "gris",
    alto: 9,
    img: "p-castillo.webp",
    destacado: 0,
    nuevo: false,
    tags: ["castillo", "miniatura", "deco", "terreno"],
    desc: "Castillo con torres y muralla sobre una roca, en gris. Sirve de escenografía, de pisapapeles o de pieza de deco.",
  },
  {
    id: "nudo",
    nombre: "Nudo infinito",
    cat: "deco",
    precio: 12500,
    descuento: 0,
    stock: 10,
    colores: ["negro", "rojo", "blanco"],
    color: "negro",
    alto: 12,
    img: "p-nudo.webp",
    destacado: 0,
    nuevo: false,
    tags: ["nudo", "escultura", "deco", "geométrico"],
    desc: "Escultura geométrica de cintas entrelazadas, impresa en una sola pieza sin soportes. Para la mesa de luz o la biblioteca.",
  },
  {
    id: "turbina",
    nombre: "Portamacetas Turbina",
    cat: "deco",
    precio: 16800,
    descuento: 20,
    stock: 6,
    colores: ["rojo", "negro"],
    color: "rojo",
    alto: 8,
    img: "p-turbina.webp",
    destacado: 0,
    nuevo: false,
    tags: ["maceta", "turbina", "deco", "plantas"],
    desc: "Portamacetas bicolor con aletas de turbina y vaso interior removible. Entra una maceta de 8 cm.",
  },
  {
    id: "maceta",
    nombre: "Maceta facetada",
    cat: "deco",
    precio: 13900,
    descuento: 0,
    stock: 12,
    colores: ["negro", "blanco", "gris"],
    color: "negro",
    alto: 12,
    img: "p-maceta.webp",
    destacado: 0,
    nuevo: false,
    tags: ["maceta", "plantas", "deco", "hogar"],
    desc: "Maceta de caras facetadas con orificio de drenaje. Impresa en negro mate, para plantas de interior.",
  },
  {
    id: "esfera-lava",
    nombre: "Esfera Lava",
    cat: "deco",
    precio: 11500,
    descuento: 0,
    stock: 7,
    colores: ["rojo", "negro"],
    color: "rojo",
    alto: 10,
    img: "p-esfera-lava.webp",
    destacado: 0,
    nuevo: true,
    tags: ["esfera", "lava", "deco", "bicolor"],
    desc: "Esfera decorativa con textura de lava, impresa en negro y rojo. Viene con un anillo de apoyo para que no ruede.",
  },
  {
    id: "florero-geometrico",
    nombre: "Florero geométrico",
    cat: "deco",
    precio: 13500,
    descuento: 0,
    stock: 9,
    colores: ["rojo", "negro", "blanco"],
    color: "rojo",
    alto: 20,
    img: "p-florero-geometrico.webp",
    destacado: 0,
    nuevo: false,
    tags: ["florero", "geométrico", "deco", "regalo"],
    desc: "Florero de caras triangulares en rojo. Impreso en modo vaso, liviano y de una sola pieza.",
  },
  {
    id: "soporte-celular",
    nombre: "Soporte para celular Panal",
    cat: "deco",
    precio: 6900,
    descuento: 0,
    stock: 20,
    colores: ["negro", "rojo", "gris", "blanco"],
    color: "negro",
    alto: 10,
    img: "p-soporte-celular.webp",
    destacado: 0,
    nuevo: false,
    tags: ["soporte", "celular", "escritorio", "útil"],
    desc: "Soporte de escritorio con trama de panal y ángulo cómodo para ver la pantalla. Entra cualquier celular, con funda incluida.",
  },
  {
    id: "lapicero",
    nombre: "Lapicero Espiral",
    cat: "deco",
    precio: 8900,
    descuento: 0,
    stock: 15,
    colores: ["negro", "rojo", "blanco"],
    color: "negro",
    alto: 10,
    img: "p-lapicero.webp",
    destacado: 0,
    nuevo: false,
    tags: ["lapicero", "escritorio", "útil", "oficina"],
    desc: "Vaso para lápices con relieve en espiral, impreso en negro. Base pesada para que no se vuelque.",
  },
  {
    id: "llavero",
    nombre: "Llavero Panal",
    cat: "deco",
    precio: 3500,
    descuento: 0,
    stock: 40,
    colores: ["negro", "rojo", "gris", "blanco"],
    color: "negro",
    alto: 7,
    img: "p-llavero.webp",
    destacado: 0,
    nuevo: true,
    tags: ["llavero", "regalo", "souvenir", "útil"],
    desc: "Llavero bicolor con trama de panal y argolla metálica. Se puede personalizar con un nombre o un logo: consultanos por cantidad.",
  },
];

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const formatearPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
const catLabel = (cat) => CATEGORIAS[cat] || cat;
const colorLabel = (c) => COLORES[c]?.label || c;

function parseRangoPrecio(v) {
  const m = /^(\d+)-(\d*)$/.exec(String(v || ""));
  if (!m) return null;
  return { min: Number(m[1]), max: m[2] === "" ? Infinity : Number(m[2]) };
}

function filtrarColeccion(coleccion, params = {}) {
  const cats = Array.isArray(params.cat)
    ? params.cat
    : params.cat
      ? [params.cat]
      : [];
  const colores = Array.isArray(params.color)
    ? params.color
    : params.color
      ? [params.color]
      : [];
  const rangos = (
    Array.isArray(params.precio)
      ? params.precio
      : params.precio
        ? [params.precio]
        : []
  )
    .map(parseRangoPrecio)
    .filter(Boolean);
  const palabras = normalizar(params.q).split(/\s+/).filter(Boolean);
  const soloStock = Boolean(params.stock);
  let lista = coleccion.filter((p) => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (colores.length && !p.colores.some((c) => colores.includes(c)))
      return false;
    if (soloStock && !(p.stock > 0)) return false;
    const precio = precioFinal(p);
    if (
      rangos.length &&
      !rangos.some((r) => precio >= r.min && precio <= r.max)
    )
      return false;
    if (palabras.length) {
      const indice = normalizar(
        [
          p.nombre,
          p.cat,
          catLabel(p.cat),
          p.desc,
          p.tags.join(" "),
          p.colores.map(colorLabel).join(" "),
        ].join(" "),
      );
      if (!palabras.every((w) => indice.includes(w))) return false;
    }
    return true;
  });
  const orden = params.orden || "destacados";
  const porDestacado = (a, b) => (a.destacado || 99) - (b.destacado || 99);
  if (orden === "precio-asc")
    lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === "precio-desc")
    lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (orden === "nuevos")
    lista = lista
      .slice()
      .sort((a, b) => Number(b.nuevo) - Number(a.nuevo) || porDestacado(a, b));
  else
    lista = lista
      .slice()
      .sort(
        (a, b) =>
          Number(b.stock > 0) - Number(a.stock > 0) || porDestacado(a, b),
      );
  return lista;
}

const ProductosAPI = (() => {
  const coleccion = PRODUCTOS;
  const clonar = (p) => ({
    ...p,
    colores: p.colores.slice(),
    tags: p.tags.slice(),
  });
  function listar(params = {}) {
    const pedido =
      Number(params.limit) > 0 ? Math.floor(Number(params.limit)) : PAGE_SIZE;
    const limit = Math.min(pedido, API_MAX);
    const cursor = Number.isFinite(Number(params.cursor))
      ? Math.max(0, Math.floor(Number(params.cursor)))
      : 0;
    const todos = filtrarColeccion(coleccion, params);
    const items = todos.slice(cursor, cursor + limit).map(clonar);
    const nextCursor =
      cursor + limit < todos.length ? String(cursor + limit) : null;
    return { items, nextCursor, total: todos.length, limit };
  }
  function destacados(n = DESTACADOS_MAX) {
    const tope = Math.min(Math.max(1, n | 0), API_MAX);
    return coleccion
      .filter((p) => p.destacado > 0)
      .sort((a, b) => a.destacado - b.destacado)
      .slice(0, tope)
      .map(clonar);
  }
  function get(id) {
    const p = coleccion.find((x) => x.id === id);
    return p ? clonar(p) : null;
  }
  function porIds(ids) {
    return (Array.isArray(ids) ? ids : [])
      .slice(0, API_MAX)
      .map(get)
      .filter(Boolean);
  }
  function relacionados(id, n = 3) {
    const base = coleccion.find((x) => x.id === id);
    if (!base) return [];
    const tope = Math.min(Math.max(1, n | 0), API_MAX);
    const misma = coleccion.filter((p) => p.id !== id && p.cat === base.cat);
    const otras = coleccion.filter(
      (p) => p.id !== id && p.cat !== base.cat && p.destacado > 0,
    );
    return misma
      .concat(otras)
      .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
      .slice(0, tope)
      .map(clonar);
  }
  function conteos() {
    return coleccion.reduce((acc, p) => {
      acc[p.cat] = (acc[p.cat] || 0) + 1;
      return acc;
    }, {});
  }
  return {
    listar,
    destacados,
    get,
    porIds,
    relacionados,
    conteos,
    MAX: API_MAX,
  };
})();

function recibir(res) {
  if (!res || !Array.isArray(res.items) || res.items.length > API_MAX)
    throw new Error("Respuesta de catálogo inválida");
  return res;
}

const storage = (() => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.getItem("ronin3d_ping");
      return localStorage;
    }
  } catch {
    /* sin storage */
  }
  const mem = {};
  return {
    getItem: (k) => (k in mem ? mem[k] : null),
    setItem: (k, v) => {
      mem[k] = String(v);
    },
    removeItem: (k) => {
      delete mem[k];
    },
  };
})();

const Cart = {
  KEY: "ronin3d_cart",
  get() {
    try {
      const v = JSON.parse(storage.getItem(this.KEY));
      if (!Array.isArray(v)) return [];
      return v
        .filter(
          (i) =>
            i &&
            typeof i.id === "string" &&
            Number.isFinite(Number(i.qty)) &&
            Number(i.qty) > 0,
        )
        .map((i) => ({
          id: i.id,
          color: typeof i.color === "string" ? i.color : "",
          qty: Math.floor(Number(i.qty)),
        }));
    } catch {
      return [];
    }
  },
  save(items) {
    storage.setItem(this.KEY, JSON.stringify(items));
    if (esDOM) document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1, color) {
    if (!producto || !(producto.stock > 0)) return false;
    const c =
      color && producto.colores.includes(color) ? color : producto.colores[0];
    const n = Math.max(1, Math.floor(Number(qty) || 1));
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id && i.color === c);
    if (existing)
      existing.qty = Math.min(existing.qty + n, producto.stock ?? 99);
    else
      items.push({
        id: producto.id,
        color: c,
        qty: Math.min(n, producto.stock ?? 99),
      });
    this.save(items);
    return true;
  },
  setQty(id, color, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id && i.color === color);
    if (!it) return;
    const p = ProductosAPI.get(id);
    it.qty = Math.max(
      1,
      Math.min(Math.floor(Number(qty) || 1), p?.stock ?? 99),
    );
    this.save(items);
  },
  remove(id, color) {
    this.save(this.get().filter((i) => !(i.id === id && i.color === color)));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  lineas() {
    const items = this.get();
    const productos = ProductosAPI.porIds(items.map((i) => i.id));
    return items
      .map((i) => {
        const p = productos.find((x) => x.id === i.id);
        return p
          ? {
              ...i,
              producto: p,
              unitario: precioFinal(p),
              subtotal: precioFinal(p) * i.qty,
            }
          : null;
      })
      .filter(Boolean);
  },
  total() {
    return this.lineas().reduce((s, l) => s + l.subtotal, 0);
  },
  syncStock() {
    const items = this.get();
    let changed = false;
    const filtered = items.filter((i) => {
      const p = ProductosAPI.get(i.id);
      if (!p || p.stock <= 0) {
        changed = true;
        return false;
      }
      if (!p.colores.includes(i.color)) {
        i.color = p.colores[0];
        changed = true;
      }
      if (i.qty > p.stock) {
        i.qty = p.stock;
        changed = true;
      }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

function construirMensajeWsp(lineas, total) {
  const lines = [`Hola ${MARCA}, quiero hacer este pedido:`, ""];
  lineas.forEach((l) =>
    lines.push(
      `${l.qty}x ${l.producto.nombre} | ${colorLabel(l.color)} | ${formatearPrecio(l.subtotal)}`,
    ),
  );
  lines.push(
    "",
    `Total: ${formatearPrecio(total)}`,
    "¿Me confirman disponibilidad y forma de pago?",
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function mensajeProducto(p, color) {
  const lines = [
    `Hola ${MARCA}, quiero consultar por ${p.nombre}${color ? ` en ${colorLabel(color).toLowerCase()}` : ""}.`,
    "¿Lo tienen disponible?",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function badgesHTML(p) {
  const out = [];
  if (p.stock <= 0) out.push('<span class="badge">Sin stock</span>');
  else if (p.stock <= 3)
    out.push('<span class="badge badge--pocas">Últimas unidades</span>');
  if (p.descuento > 0)
    out.push(`<span class="badge badge--oferta">-${p.descuento}%</span>`);
  if (p.nuevo) out.push('<span class="badge badge--nuevo">Nuevo</span>');
  return out.join("");
}

function precioHTML(p) {
  if (p.descuento > 0)
    return `<span class="precio precio--oferta">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`;
  return `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function imgHTML(p, extra = "") {
  return `<img src="images/${esc(p.img)}" alt="${esc(p.nombre)}, impreso en PLA ${esc(colorLabel(p.color).toLowerCase())}" width="480" height="600" decoding="async"${extra}>`;
}

function stepperHTML(max, attrs = "") {
  return `<div class="stepper" data-stepper data-max="${max}" ${attrs}>
    <button type="button" data-step="-1" aria-label="Una unidad menos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
    <output aria-live="polite">1</output>
    <button type="button" data-step="1" aria-label="Una unidad más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
  </div>`;
}

function cardHTML(p) {
  const agotado = p.stock <= 0;
  return `<article class="prod${agotado ? " prod--agotado" : ""}" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(48px)">
    <div class="prod-media">
      ${imgHTML(p)}
      <button class="prod-media-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"></button>
      <div class="prod-badges">${badgesHTML(p)}</div>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(catLabel(p.cat))} · ${p.alto} cm</span>
      <h3 class="prod-name">${esc(p.nombre)}</h3>
      <div class="prod-price">${precioHTML(p)}</div>
      <div class="prod-actions">
        ${stepperHTML(Math.max(1, p.stock))}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}"${agotado ? " disabled" : ""}>${agotado ? "Sin stock" : "Agregar al carrito"}</button>
      </div>
      <button class="prod-buy" type="button" data-buy="${esc(p.id)}"${agotado ? " hidden" : ""}>Comprar ahora</button>
    </div>
  </article>`;
}

function mosaicoHTML(p, i) {
  const xl = i === 0;
  return `<div class="arte-item${xl ? " arte-item--xl" : ""}" data-animate="subir" style="opacity:0;transform:translateY(48px)">
    ${imgHTML(p)}
    <button class="arte-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
      <span class="arte-txt"><span><strong>${esc(p.nombre)}</strong><small>${esc(catLabel(p.cat))}</small></span><span class="precio">${formatearPrecio(precioFinal(p))}</span></span>
    </button>
  </div>`;
}

function railHTML(p) {
  return `<li class="rail-card" data-animate="der" style="opacity:0;transform:translateX(64px)">
    <button class="rail-card-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
      <div class="prod-media">${imgHTML(p)}<div class="prod-badges">${badgesHTML(p)}</div></div>
      <div class="rail-card-body"><strong>${esc(p.nombre)}</strong><small>${esc(catLabel(p.cat))} · ${p.alto} cm</small><span class="precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ""}</span></div>
    </button>
  </li>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll("[data-animate]:not(.in)")];
  if (!nuevos.length) return;
  if (reduceMotion) {
    nuevos.forEach((el) => el.classList.add("in"));
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      nuevos.forEach((el, i) => {
        const d = Math.min(i * 0.06, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add("in");
        setTimeout(
          () => {
            el.style.transitionDelay = "";
          },
          (d + 1.2) * 1000,
        );
      }),
    ),
  );
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add("in");
    setTimeout(
      () => {
        el.style.transitionDelay = "";
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -7% 0px" },
  );
  items.forEach((el) => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener("scroll", queueSweep);
      window.removeEventListener("resize", queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}

function refrescarScroll() {
  if (typeof ScrollTrigger !== "undefined")
    requestAnimationFrame(() => ScrollTrigger.refresh());
}

function showToast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove("bump");
    void b.offsetWidth;
    if (n) b.classList.add("bump");
  });
}

function trapFocus(container, e) {
  const f = container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!f.length) return;
  const first = f[0],
    last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

let ultimoFocoDrawer = null;
function renderCart() {
  const body = document.getElementById("cart-body");
  const foot = document.getElementById("cart-foot");
  if (!body || !foot) return;
  const lineas = Cart.lineas();
  if (!lineas.length) {
    body.innerHTML = `<div class="cart-vacio"><span class="sello" aria-hidden="true"><span>3D</span></span><strong>Todavía no hay piezas</strong><p class="muted">Elegí algo del catálogo o contanos qué querés imprimir.</p><button type="button" class="btn btn--tinta" data-ir-catalogo>Ver el catálogo</button></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = lineas
    .map(
      (
        l,
      ) => `<div class="cart-line" data-line-id="${esc(l.id)}" data-line-color="${esc(l.color)}">
    <div class="cart-line-img">${imgHTML(l.producto)}</div>
    <div class="cart-line-info">
      <strong>${esc(l.producto.nombre)}</strong>
      <small>${esc(colorLabel(l.color))} · ${formatearPrecio(l.unitario)} c/u</small>
      ${stepperHTML(Math.max(1, l.producto.stock), `data-cart-id="${esc(l.id)}" data-cart-color="${esc(l.color)}"`).replace('<output aria-live="polite">1</output>', `<output aria-live="polite">${l.qty}</output>`)}
    </div>
    <div class="cart-line-right">
      <span class="precio">${formatearPrecio(l.subtotal)}</span>
      <button type="button" class="cart-line-del" data-cart-del aria-label="Quitar ${esc(l.producto.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg></button>
    </div>
  </div>`,
    )
    .join("");
  const total = Cart.total();
  foot.innerHTML = `<div class="drawer-total"><span>Total</span><span class="precio">${formatearPrecio(total)}</span></div>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--linea" href="${construirMensajeWsp(lineas, total)}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
    <p class="drawer-nota">Retiro y envío se coordinan por WhatsApp al confirmar.</p>`;
}

function openCartDrawer() {
  const d = document.getElementById("cart-drawer");
  const bd = document.getElementById("drawer-backdrop");
  if (!d || !bd) return;
  ultimoFocoDrawer = document.activeElement;
  renderCart();
  d.classList.add("open");
  bd.classList.add("open");
  document.body.classList.add("no-scroll");
  d.querySelector("[data-close-cart]")?.focus();
}
function closeCartDrawer() {
  const d = document.getElementById("cart-drawer");
  const bd = document.getElementById("drawer-backdrop");
  if (!d || !d.classList.contains("open")) return;
  d.classList.remove("open");
  bd?.classList.remove("open");
  if (document.getElementById("modal-backdrop")?.hidden !== false)
    document.body.classList.remove("no-scroll");
  ultimoFocoDrawer?.focus?.();
}

function initCartUI() {
  const d = document.getElementById("cart-drawer");
  if (!d) return;
  document
    .querySelectorAll("[data-open-cart]")
    .forEach((b) => b.addEventListener("click", openCartDrawer));
  d.querySelector("[data-close-cart]")?.addEventListener(
    "click",
    closeCartDrawer,
  );
  document
    .getElementById("drawer-backdrop")
    ?.addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (!d.classList.contains("open")) return;
    if (e.key === "Escape") closeCartDrawer();
    if (e.key === "Tab") trapFocus(d, e);
  });
  d.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      const st = step.closest("[data-stepper]");
      const out = st?.querySelector("output");
      if (!st || !out) return;
      const max = Number(st.dataset.max) || 99;
      const nuevo = Math.max(
        1,
        Math.min(
          max,
          (Number(out.textContent) || 1) + Number(step.dataset.step),
        ),
      );
      Cart.setQty(st.dataset.cartId, st.dataset.cartColor, nuevo);
      const linea = Cart.lineas().find(
        (l) => l.id === st.dataset.cartId && l.color === st.dataset.cartColor,
      );
      out.textContent = linea ? linea.qty : nuevo;
      const fila = st.closest(".cart-line");
      const precio = fila?.querySelector(".cart-line-right .precio");
      if (precio && linea) precio.textContent = formatearPrecio(linea.subtotal);
      const totalEl = document.querySelector(
        "#cart-foot .drawer-total .precio",
      );
      if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
      const wsp = document.querySelector('#cart-foot a[href^="https://wa.me"]');
      if (wsp) wsp.href = construirMensajeWsp(Cart.lineas(), Cart.total());
      return;
    }
    const del = e.target.closest("[data-cart-del]");
    if (del) {
      const fila = del.closest(".cart-line");
      Cart.remove(fila.dataset.lineId, fila.dataset.lineColor);
      renderCart();
      showToast("Pieza quitada del carrito.");
      return;
    }
    if (e.target.closest("[data-finalizar]")) {
      showToast(
        "¡Genial! El pago online se activa al pasar la web a producción.",
      );
      return;
    }
    if (e.target.closest("[data-ir-catalogo]")) {
      closeCartDrawer();
      document
        .getElementById("tienda")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
  document.addEventListener("cart:updated", updateCartBadge);
  document.addEventListener("cart:updated", () => {
    if (d.classList.contains("open") && !d.contains(document.activeElement))
      renderCart();
  });
  updateCartBadge();
}

function initFloats() {
  const wsp = document.getElementById("wsp-float");
  const cart = document.getElementById("cart-float");
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle("visible", scrolled);
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", openCartDrawer);
  sync();
}

let ultimoFocoModal = null;
let colorElegido = "";
function inyectarLdProducto(p) {
  let s = document.getElementById("ld-producto");
  if (!s) {
    s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "ld-producto";
    document.head.appendChild(s);
  }
  const base = location.href.split("?")[0].split("#")[0];
  const dir = base.slice(0, base.lastIndexOf("/") + 1);
  s.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.desc,
    image: dir + "images/" + p.img,
    brand: { "@type": "Brand", name: MARCA },
    category: catLabel(p.cat),
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: base + "?producto=" + p.id,
    },
  });
}

function abrirModal(id) {
  const p = ProductosAPI.get(id);
  const bd = document.getElementById("modal-backdrop");
  const m = document.getElementById("modal");
  if (!p || !bd || !m) return;
  ultimoFocoModal = document.activeElement;
  colorElegido = p.colores[0];
  const agotado = p.stock <= 0;
  const rel = ProductosAPI.relacionados(p.id, 3);
  m.innerHTML = `<button class="modal-close" type="button" data-close-modal aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-media">${imgHTML(p)}<div class="prod-badges">${badgesHTML(p)}</div></div>
    <div class="modal-info">
      <span class="prod-cat">${esc(catLabel(p.cat))}</span>
      <h2>${esc(p.nombre)}</h2>
      <div class="prod-price">${precioHTML(p)}</div>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-specs">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5"/></svg>PLA, capa 0,2 mm</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 3 21M21 3h-6M21 3v6M3 21h6M3 21v-6"/></svg>${p.alto} cm ${p.cat === "dragones" && p.id === "dragon-articulado" ? "de largo" : "de alto"}</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>Acabado a mano</span>
      </div>
      <div class="variantes"><span>Color del filamento</span><div class="var-list" data-colores>${p.colores.map((c, i) => `<button type="button" data-color="${esc(c)}" aria-pressed="${i === 0 ? "true" : "false"}"><span class="color-dot" style="background:${COLORES[c]?.hex || "#999"}"></span>${esc(colorLabel(c))}</button>`).join("")}</div></div>
      <div class="modal-actions">
        ${stepperHTML(Math.max(1, p.stock), "data-modal-stepper")}
        <button type="button" class="btn btn--cta" data-modal-add${agotado ? " disabled" : ""}>${agotado ? "Sin stock" : "Agregar al carrito"}</button>
        ${agotado ? "" : '<button type="button" class="btn btn--tinta" data-modal-buy>Comprar ahora</button>'}
      </div>
      <a class="link-mas" href="${mensajeProducto(p, colorElegido)}" target="_blank" rel="noopener" data-modal-wsp>${agotado ? "Pedirlo a medida por WhatsApp" : "Consultar por esta pieza"}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      ${rel.length ? `<div class="modal-rel"><span>También te puede interesar</span><div class="rel-grid">${rel.map((r) => `<button type="button" class="rel-item" data-quick="${esc(r.id)}"><span class="rel-img">${imgHTML(r)}</span><strong>${esc(r.nombre)}</strong><small>${formatearPrecio(precioFinal(r))}</small></button>`).join("")}</div></div>` : ""}
    </div>`;
  m.dataset.id = p.id;
  bd.hidden = false;
  document.body.classList.add("no-scroll");
  m.scrollTop = 0;
  inyectarLdProducto(p);
  m.querySelector("[data-close-modal]")?.focus();
}

function cerrarModal() {
  const bd = document.getElementById("modal-backdrop");
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  if (!document.getElementById("cart-drawer")?.classList.contains("open"))
    document.body.classList.remove("no-scroll");
  ultimoFocoModal?.focus?.();
}

function initModal() {
  const bd = document.getElementById("modal-backdrop");
  const m = document.getElementById("modal");
  if (!bd || !m) return;
  bd.addEventListener("click", (e) => {
    if (e.target === bd) cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (bd.hidden) return;
    if (e.key === "Escape") cerrarModal();
    if (e.key === "Tab") trapFocus(m, e);
  });
  m.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-modal]")) {
      cerrarModal();
      return;
    }
    const colorBtn = e.target.closest("[data-color]");
    if (colorBtn) {
      colorElegido = colorBtn.dataset.color;
      m.querySelectorAll("[data-color]").forEach((b) =>
        b.setAttribute("aria-pressed", b === colorBtn ? "true" : "false"),
      );
      const wsp = m.querySelector("[data-modal-wsp]");
      const p = ProductosAPI.get(m.dataset.id);
      if (wsp && p) wsp.href = mensajeProducto(p, colorElegido);
      return;
    }
    const step = e.target.closest("[data-step]");
    if (step) {
      const st = step.closest("[data-stepper]");
      const out = st?.querySelector("output");
      if (!st || !out) return;
      const max = Number(st.dataset.max) || 99;
      out.textContent = Math.max(
        1,
        Math.min(
          max,
          (Number(out.textContent) || 1) + Number(step.dataset.step),
        ),
      );
      return;
    }
    if (
      e.target.closest("[data-modal-add]") ||
      e.target.closest("[data-modal-buy]")
    ) {
      const p = ProductosAPI.get(m.dataset.id);
      const qty =
        Number(m.querySelector("[data-modal-stepper] output")?.textContent) ||
        1;
      if (!p || !Cart.add(p, qty, colorElegido)) return;
      if (e.target.closest("[data-modal-buy]")) {
        cerrarModal();
        openCartDrawer();
      } else
        showToast(
          `${p.nombre} (${colorLabel(colorElegido).toLowerCase()}) agregado al carrito.`,
        );
    }
  });
}

const catalogo = {
  cat: [],
  color: [],
  precio: [],
  stock: false,
  q: "",
  orden: "destacados",
  cursor: 0,
  cargados: 0,
  total: 0,
};

function leerFiltros() {
  const marcados = (f) =>
    [...document.querySelectorAll(`input[data-f="${f}"]:checked`)].map(
      (i) => i.value,
    );
  catalogo.cat = marcados("cat");
  catalogo.color = marcados("color");
  catalogo.precio = marcados("precio");
  catalogo.stock = marcados("stock").length > 0;
}

function textoConteo() {
  const { total, q, cat } = catalogo;
  if (total === 0)
    return q ? `Sin resultados para «${q}»` : "Sin piezas con esos filtros";
  const piezas = total === 1 ? "1 pieza" : `${total} piezas`;
  if (q) return `${piezas} para «${q}»`;
  if (cat.length === 1) return `${piezas} en ${catLabel(cat[0])}`;
  return piezas;
}

function cargarPagina(reset) {
  const grid = document.getElementById("catalogo");
  if (!grid) return;
  if (reset) {
    grid.innerHTML = "";
    catalogo.cursor = 0;
    catalogo.cargados = 0;
  }
  grid.setAttribute("aria-busy", "true");
  let res;
  try {
    res = recibir(
      ProductosAPI.listar({
        cat: catalogo.cat,
        color: catalogo.color,
        precio: catalogo.precio,
        stock: catalogo.stock,
        q: catalogo.q,
        orden: catalogo.orden,
        cursor: catalogo.cursor,
        limit: PAGE_SIZE,
      }),
    );
  } catch {
    grid.innerHTML = `<div class="tienda-vacio"><strong>No pudimos cargar el catálogo</strong><p class="muted">Probá de nuevo en un momento.</p></div>`;
    grid.setAttribute("aria-busy", "false");
    return;
  }
  catalogo.total = res.total;
  if (res.total === 0) {
    grid.innerHTML = `<div class="tienda-vacio"><strong>${esc(textoConteo())}</strong><p class="muted">Probá con otra palabra o sacá algún filtro. Si no está en el catálogo, lo imprimimos a pedido.</p><button type="button" class="btn btn--linea" data-limpiar>Limpiar filtros</button></div>`;
  } else {
    grid.insertAdjacentHTML("beforeend", res.items.map(cardHTML).join(""));
  }
  catalogo.cargados += res.items.length;
  catalogo.cursor = res.nextCursor === null ? null : Number(res.nextCursor);
  const head = document.querySelector("[data-count]");
  const pie = document.querySelector("[data-count-pie]");
  const mas = document.querySelector("[data-ver-mas]");
  if (head) head.textContent = textoConteo();
  if (pie)
    pie.textContent = res.total
      ? `Mostrando ${catalogo.cargados} de ${res.total}`
      : "";
  if (mas) mas.hidden = res.nextCursor === null;
  grid.setAttribute("aria-busy", "false");
  revelarNuevos(grid);
  refrescarScroll();
}

function setCategoria(cat) {
  document.querySelectorAll("input[data-f]").forEach((i) => {
    i.checked = i.dataset.f === "cat" && i.value === cat;
  });
  catalogo.q = "";
  document
    .querySelectorAll("[data-busca] input, [data-busca-header] input")
    .forEach((i) => {
      i.value = "";
    });
  leerFiltros();
  cargarPagina(true);
}

function setBusqueda(q) {
  catalogo.q = String(q || "").trim();
  document
    .querySelectorAll("[data-busca] input, [data-busca-header] input")
    .forEach((i) => {
      if (i.value !== catalogo.q) i.value = catalogo.q;
    });
  cargarPagina(true);
}

function initCatalogo() {
  const grid = document.getElementById("catalogo");
  if (!grid) return;
  const conteos = ProductosAPI.conteos();
  document.querySelectorAll("[data-fcount]").forEach((el) => {
    el.textContent = conteos[el.dataset.fcount] || 0;
  });
  const params = new URLSearchParams(location.search);
  const catUrl = params.get("cat");
  if (catUrl && CATEGORIAS[catUrl]) {
    const input = document.querySelector(
      `input[data-f="cat"][value="${catUrl}"]`,
    );
    if (input) input.checked = true;
  }
  const qUrl = params.get("q");
  if (qUrl) catalogo.q = qUrl.trim();
  leerFiltros();
  cargarPagina(true);

  document.querySelectorAll("input[data-f]").forEach((i) =>
    i.addEventListener("change", () => {
      leerFiltros();
      cargarPagina(true);
    }),
  );
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-limpiar]")) {
      document.querySelectorAll("input[data-f]").forEach((i) => {
        i.checked = false;
      });
      leerFiltros();
      setBusqueda("");
    }
  });
  document.querySelector("[data-orden]")?.addEventListener("change", (e) => {
    catalogo.orden = e.target.value;
    cargarPagina(true);
  });
  document.querySelector("[data-ver-mas]")?.addEventListener("click", () => {
    if (catalogo.cursor !== null) cargarPagina(false);
  });

  const formTienda = document.querySelector("[data-busca]");
  const inputTienda = formTienda?.querySelector("input");
  let t = 0;
  formTienda?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(t);
    setBusqueda(inputTienda?.value);
  });
  inputTienda?.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => setBusqueda(inputTienda.value), 260);
  });
  if (inputTienda && catalogo.q) inputTienda.value = catalogo.q;

  const formHeader = document.querySelector("[data-busca-header]");
  formHeader?.addEventListener("submit", (e) => {
    e.preventDefault();
    setBusqueda(formHeader.querySelector("input")?.value);
    document
      .getElementById("tienda")
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  const toggle = document.querySelector(".filtros-toggle");
  toggle?.addEventListener("click", () => {
    const aside = toggle.closest(".filtros");
    const abierto = aside.classList.toggle("open");
    toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    refrescarScroll();
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-cat-link]");
    if (!link) return;
    e.preventDefault();
    setCategoria(link.dataset.catLink);
    document
      .getElementById("tienda")
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  grid.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      const st = step.closest("[data-stepper]");
      const out = st?.querySelector("output");
      if (!st || !out) return;
      const max = Number(st.dataset.max) || 99;
      out.textContent = Math.max(
        1,
        Math.min(
          max,
          (Number(out.textContent) || 1) + Number(step.dataset.step),
        ),
      );
      return;
    }
    const add = e.target.closest("[data-add]");
    const buy = e.target.closest("[data-buy]");
    if (add || buy) {
      const card = (add || buy).closest(".prod");
      const p = ProductosAPI.get(
        (add || buy).dataset.add || (add || buy).dataset.buy,
      );
      const qty =
        Number(card?.querySelector("[data-stepper] output")?.textContent) || 1;
      if (!p || !Cart.add(p, qty)) {
        showToast("Esa pieza se imprime a pedido: escribinos por WhatsApp.");
        return;
      }
      if (buy) openCartDrawer();
      else showToast(`${p.nombre} agregado al carrito.`);
    }
  });

  const prod = params.get("producto");
  if (prod && ProductosAPI.get(prod)) setTimeout(() => abrirModal(prod), 300);
}

function renderDestacados() {
  const cont = document.querySelector("[data-destacados]");
  if (!cont) return;
  const lista = ProductosAPI.destacados(DESTACADOS_MAX);
  if (cont.dataset.destacados === "rail") {
    cont.innerHTML = lista.map(railHTML).join("");
  } else {
    cont.innerHTML =
      lista.map(mosaicoHTML).join("") +
      `<a class="arte-cta" href="#tienda" data-animate="subir" style="opacity:0;transform:translateY(48px)"><strong>Ver todo el catálogo</strong><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`;
  }
}

function initQuickView() {
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quick]");
    if (!q) return;
    e.preventDefault();
    abrirModal(q.dataset.quick);
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el drag igual funciona */
      }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId))
      return;
    dragging = false;
    if (moved) {
      try {
        vp.releasePointerCapture?.(pointerId);
      } catch {
        /* ya liberado */
      }
      vp.classList.remove("dragging");
      const kill = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      vp.addEventListener("click", kill, { capture: true, once: true });
      setTimeout(
        () => vp.removeEventListener("click", kill, { capture: true }),
        0,
      );
    }
    pointerId = null;
    moved = false;
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener("dragstart", (e) => e.preventDefault());
}

function initRail() {
  const vp = document.querySelector("[data-rail-vp]");
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.firstElementChild;
  const prev = document.querySelector("[data-rail-prev]");
  const next = document.querySelector("[data-rail-next]");
  const paso = () => {
    const card = track?.firstElementChild;
    return card
      ? card.getBoundingClientRect().width + 16
      : vp.clientWidth * 0.8;
  };
  const sync = () => {
    if (!prev || !next || !track) return;
    const inicio =
      parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () =>
    vp.scrollBy({
      left: -paso() * 2,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({
      left: paso() * 2,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  vp.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  window.addEventListener("load", sync);
  sync();
}

function initBanner() {
  const b = document.querySelector("[data-banner]");
  if (!b) return;
  const slides = [...b.querySelectorAll("[data-slide]")];
  const dots = b.querySelector("[data-dots]");
  if (slides.length < 2 || !dots) return;
  let i = 0,
    timer = 0;
  dots.innerHTML = slides
    .map(
      (_, k) =>
        `<button type="button" aria-label="Mensaje ${k + 1}"${k === 0 ? ' aria-current="true"' : ""}><span></span></button>`,
    )
    .join("");
  const botones = [...dots.querySelectorAll("button")];
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("activo", k === i));
    botones.forEach((d, k) => {
      if (k === i) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  };
  const play = () => {
    window.clearInterval(timer);
    if (reduceMotion) return;
    timer = window.setInterval(() => go(i + 1), 5600);
  };
  botones.forEach((d, k) =>
    d.addEventListener("click", () => {
      go(k);
      play();
    }),
  );
  b.addEventListener("mouseenter", () => window.clearInterval(timer));
  b.addEventListener("mouseleave", play);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearInterval(timer);
    else play();
  });
  play();
}

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    const header = document.querySelector(".site-header");
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 769px)");
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.querySelector("a")?.focus();
  };
  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open(),
  );
  closeBtn?.addEventListener("click", () => {
    close();
    toggle.focus();
  });
  bd.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute("inert");
    else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
}

function initModelBarScroll() {
  const bar = document.querySelector(".gw-modelos");
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove("gw-modelos--scrolling");
      return;
    }
    bar.classList.add("gw-modelos--scrolling");
    clearTimeout(showTimer);
    showTimer = setTimeout(
      () => bar.classList.remove("gw-modelos--scrolling"),
      120,
    );
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const img = hero.querySelector("[data-hero-img]");
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(
    hero.querySelectorAll(".hero-badge"),
    { scale: 0.92, opacity: 0, duration: 1, clearProps: "transform,opacity" },
    0.05,
  )
    .from(
      hero.querySelectorAll(".hero-eyebrow"),
      { y: 18, opacity: 0, duration: 0.9 },
      0.15,
    )
    .from(
      hero.querySelectorAll("h1, .banner-titulo"),
      {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        clearProps: "filter",
      },
      0.25,
    )
    .from(
      hero.querySelectorAll(".hero-lead"),
      { y: 26, opacity: 0, duration: 1 },
      0.5,
    )
    .from(
      hero.querySelectorAll(".hero-ctas .btn"),
      {
        y: 22,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        clearProps: "transform,opacity",
      },
      0.65,
    )
    .from(
      hero.querySelectorAll("[data-hero-linea]"),
      { scaleX: 0, duration: 1.3, transformOrigin: "0 50%" },
      0.8,
    )
    .from(
      hero.querySelectorAll(".hero-capa span:not(.capa-linea), .banner-dots"),
      { opacity: 0, duration: 0.8 },
      0.95,
    );
}

function initParallax() {
  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;
  document.querySelectorAll("[data-parallax] > img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -4.5 },
      {
        yPercent: 4.5,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

if (esDOM) {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (
      k === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
      (e.ctrlKey && k === "u")
    ) {
      e.preventDefault();
    }
  });

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
    gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === "undefined")
    document
      .querySelectorAll("[data-animate]")
      .forEach((el) => el.classList.add("in"));
  if (typeof ScrollTrigger !== "undefined")
    window.addEventListener("load", () => ScrollTrigger.refresh());

  initModelBarScroll();
  Cart.syncStock();
  renderDestacados();
  initCatalogo();
  initReveals();
  initNav();
  initCartUI();
  initFloats();
  initModal();
  initQuickView();
  initRail();
  initBanner();
  initHeroMotion();
  initParallax();
}

function ronin3dLogic() {
  return {
    WHATSAPP_NUMBER,
    PAGE_SIZE,
    API_MAX,
    DESTACADOS_MAX,
    CATEGORIAS,
    COLORES,
    PRODUCTOS,
    esc,
    formatearPrecio,
    precioFinal,
    normalizar,
    parseRangoPrecio,
    filtrarColeccion,
    ProductosAPI,
    recibir,
    Cart,
    construirMensajeWsp,
    mensajeProducto,
    badgesHTML,
    cardHTML,
  };
}
if (!esDOM) ronin3dLogic();
