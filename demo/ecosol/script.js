const WHATSAPP_NUMBER = "5493624168825";
const MARCA = "Ecosol";
const PAGE_SIZE = 16;
const API_MAX = 100;
const DESTACADOS_MAX = 6;
const UBICACION = { lat: -27.344761, lng: -59.06863 };
const esDOM = typeof document !== "undefined";
const reduceMotion =
  esDOM && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (esDOM) {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const k = (e.key || "").toLowerCase();
    if (
      k === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
      (e.ctrlKey && k === "u")
    ) {
      e.preventDefault();
    }
  });
}

const CATEGORIAS = {
  quimicos: "Químicos",
  equipos: "Bombas y filtros",
  limpieza: "Limpieza de pileta",
  herramientas: "Herramientas",
  motos: "Repuestos de moto",
};

const MARCAS = {
  vulcano: "Vulcano",
  gamma: "Gamma",
  otras: "Otras marcas",
};

const PRODUCTOS = [
  { id: "cloro-granulado", nombre: "Cloro granulado 10 kg", cat: "quimicos", marca: "vulcano", precio: 89900, descuento: 10, stock: 14, destacado: 1, nuevo: false, img: "p-cloro-granulado.webp", tags: ["cloro", "granulado", "balde", "mantenimiento", "desinfeccion"], desc: "Cloro granulado de disolución rápida para el mantenimiento diario y la puesta a punto de la pileta. Balde de 10 kg con tapa." },
  { id: "pastillas-cloro", nombre: "Pastillas de cloro 200 g · pote de 1 kg", cat: "quimicos", marca: "vulcano", precio: 28500, descuento: 0, stock: 22, destacado: 7, nuevo: false, img: "p-pastillas-cloro.webp", tags: ["pastillas", "tabletas", "cloro", "dosificador"], desc: "Pastillas de disolución lenta para el dosificador flotante o el skimmer. Pote de 1 kg con cinco pastillas de 200 g." },
  { id: "clarificador", nombre: "Clarificador líquido 1 L", cat: "quimicos", marca: "vulcano", precio: 9800, descuento: 0, stock: 18, destacado: 0, nuevo: false, img: "p-clarificador.webp", tags: ["clarificador", "agua turbia", "floculante", "lechosa"], desc: "Junta las partículas que enturbian el agua para que el filtro las retenga. Para agua opaca o lechosa." },
  { id: "regulador-ph", nombre: "Reductor de pH 1 kg", cat: "quimicos", marca: "vulcano", precio: 11200, descuento: 0, stock: 9, destacado: 0, nuevo: false, img: "p-regulador-ph.webp", tags: ["ph", "reductor", "regulador", "menos"], desc: "Baja el pH cuando el análisis da alto, así el cloro trabaja bien y el agua no irrita los ojos." },
  { id: "kit-analisis", nombre: "Kit de análisis de cloro y pH", cat: "quimicos", marca: "otras", precio: 14500, descuento: 0, stock: 11, destacado: 0, nuevo: false, img: "p-kit-analisis.webp", tags: ["test", "analisis", "medidor", "reactivos", "ph", "cloro"], desc: "Medí el cloro y el pH del agua en un minuto, con los reactivos y la tabla de colores." },
  { id: "dosificador", nombre: "Dosificador flotante de cloro", cat: "quimicos", marca: "otras", precio: 12900, descuento: 0, stock: 16, destacado: 0, nuevo: false, img: "p-dosificador.webp", tags: ["dosificador", "flotante", "boya", "pastillas"], desc: "Flota en la pileta y va soltando el cloro de las pastillas de a poco. Con regulador de apertura." },
  { id: "filtro-arena", nombre: "Filtro de arena 50 cm con válvula selectora", cat: "equipos", marca: "vulcano", precio: 389000, descuento: 0, stock: 4, destacado: 5, nuevo: false, img: "p-filtro-arena.webp", tags: ["filtro", "arena", "valvula", "selectora", "equipo"], desc: "Filtro de arena con válvula selectora de seis posiciones: filtrar, lavar, enjuagar, desagotar, recircular y cerrado." },
  { id: "bomba", nombre: "Bomba autocebante 3/4 HP", cat: "equipos", marca: "vulcano", precio: 259000, descuento: 0, stock: 5, destacado: 2, nuevo: false, img: "p-bomba.webp", tags: ["bomba", "motor", "autocebante", "3/4 hp"], desc: "Bomba autocebante con prefiltro de tapa transparente, para recircular y filtrar el agua junto con el filtro de arena." },
  { id: "bombas-local", nombre: "Bomba autocebante 1 HP", cat: "equipos", marca: "vulcano", precio: 319000, descuento: 0, stock: 2, destacado: 0, nuevo: true, img: "p-bombas-local.webp", tags: ["bomba", "motor", "autocebante", "1 hp"], desc: "Más caudal para piletas grandes o con cascada. Prefiltro con canasto y tapa transparente." },
  { id: "uniones", nombre: "Uniones dobles y cuplas de 50 mm", cat: "equipos", marca: "otras", precio: 6900, descuento: 0, stock: 40, destacado: 0, nuevo: false, img: "p-uniones.webp", tags: ["union", "cupla", "codo", "pvc", "50 mm", "conexion"], desc: "Uniones dobles, cuplas y codos de PVC de 50 mm para armar o reparar la conexión del equipo." },
  { id: "abrazaderas", nombre: "Abrazaderas de acero · pack x4", cat: "equipos", marca: "otras", precio: 4200, descuento: 0, stock: 35, destacado: 0, nuevo: false, img: "p-abrazaderas.webp", tags: ["abrazadera", "sujecion", "manguera"], desc: "Para ajustar las mangueras a la bomba, al filtro o al barrefondo sin pérdidas." },
  { id: "saca-hojas", nombre: "Saca hojas de superficie", cat: "limpieza", marca: "otras", precio: 11900, descuento: 0, stock: 20, destacado: 0, nuevo: false, img: "p-saca-hojas.webp", tags: ["saca hojas", "red", "copo", "limpieza"], desc: "Red de malla fina con marco reforzado. Se encastra en el cabo telescópico." },
  { id: "cepillo-pared", nombre: "Cepillo de pared 45 cm", cat: "limpieza", marca: "otras", precio: 13500, descuento: 0, stock: 15, destacado: 0, nuevo: false, img: "p-cepillo-pared.webp", tags: ["cepillo", "pared", "piso", "limpieza"], desc: "Cepillo curvo para paredes y piso, con cerdas firmes que no rayan el revestimiento." },
  { id: "cepillo-chico", nombre: "Cepillo de mano para bordes", cat: "limpieza", marca: "otras", precio: 7800, descuento: 0, stock: 12, destacado: 0, nuevo: false, img: "p-cepillo-chico.webp", tags: ["cepillo", "mano", "borde", "linea de flotacion"], desc: "Para la línea de flotación, los escalones y los rincones donde no llega el cepillo grande." },
  { id: "barrefondo", nombre: "Barrefondo con ruedas", cat: "limpieza", marca: "vulcano", precio: 24900, descuento: 0, stock: 10, destacado: 6, nuevo: false, img: "p-barrefondo.webp", tags: ["barrefondo", "aspiradora", "limpiafondo", "fondo"], desc: "Se conecta a la manguera y al skimmer para aspirar el fondo con la bomba encendida." },
  { id: "manguera", nombre: "Manguera flotante 38 mm × 10 m", cat: "limpieza", marca: "otras", precio: 46500, descuento: 0, stock: 8, destacado: 0, nuevo: false, img: "p-manguera.webp", tags: ["manguera", "flotante", "barrefondo"], desc: "Manguera para el barrefondo, liviana y con puños de conexión en las dos puntas." },
  { id: "cabo-telescopico", nombre: "Cabo telescópico de aluminio 3,6 m", cat: "limpieza", marca: "otras", precio: 27900, descuento: 0, stock: 9, destacado: 0, nuevo: false, img: "p-cabo-telescopico.webp", tags: ["cabo", "telescopico", "aluminio", "palo"], desc: "Se estira de 1,8 a 3,6 m y sirve para el saca hojas, el cepillo y el barrefondo." },
  { id: "amoladora", nombre: "Amoladora angular 115 mm 850 W", cat: "herramientas", marca: "gamma", precio: 74900, descuento: 0, stock: 6, destacado: 3, nuevo: false, img: "p-amoladora.webp", tags: ["amoladora", "disco", "corte", "desbaste"], desc: "Amoladora compacta para corte y desbaste, con empuñadura lateral y protector de disco." },
  { id: "taladro", nombre: "Taladro atornillador a batería 18 V", cat: "herramientas", marca: "gamma", precio: 129000, descuento: 8, stock: 5, destacado: 8, nuevo: true, img: "p-taladro.webp", tags: ["taladro", "atornillador", "bateria", "inalambrico"], desc: "Taladro y atornillador inalámbrico con mandril de 10 mm y batería de 18 V." },
  { id: "cinta-metrica", nombre: "Cinta métrica 5 m", cat: "herramientas", marca: "gamma", precio: 8900, descuento: 0, stock: 25, destacado: 0, nuevo: false, img: "p-cinta-metrica.webp", tags: ["cinta", "metro", "medir"], desc: "Cinta de acero con traba y carcasa engomada." },
  { id: "pinzas", nombre: "Pinza universal y pinza de punta · set x2", cat: "herramientas", marca: "gamma", precio: 19800, descuento: 0, stock: 12, destacado: 0, nuevo: false, img: "p-pinzas.webp", tags: ["pinza", "alicate", "punta"], desc: "Pinza universal y pinza de punta con mangos engomados." },
  { id: "destornilladores", nombre: "Destornilladores plano y Phillips · x2", cat: "herramientas", marca: "otras", precio: 7400, descuento: 0, stock: 20, destacado: 0, nuevo: false, img: "p-destornilladores.webp", tags: ["destornillador", "plano", "phillips", "estrella"], desc: "Un destornillador plano y uno Phillips, con punta imantada y mango engomado." },
  { id: "llaves-combinadas", nombre: "Juego de llaves combinadas 8 a 19 mm", cat: "herramientas", marca: "otras", precio: 36500, descuento: 0, stock: 7, destacado: 0, nuevo: false, img: "p-llaves-combinadas.webp", tags: ["llaves", "combinadas", "boca", "estria"], desc: "Llaves boca y estría de 8 a 19 mm para el taller, la moto y el equipo de la pileta." },
  { id: "tubos-crique", nombre: "Llave crique con tubos de 1/2\"", cat: "herramientas", marca: "otras", precio: 42900, descuento: 0, stock: 6, destacado: 0, nuevo: false, img: "p-tubos-crique.webp", tags: ["crique", "tubos", "llave", "encastre"], desc: "Llave crique reversible con juego de tubos de encastre 1/2\"." },
  { id: "maletin", nombre: "Maletín organizador para herramientas", cat: "herramientas", marca: "otras", precio: 29900, descuento: 0, stock: 8, destacado: 0, nuevo: false, img: "p-maletin.webp", tags: ["maletin", "caja", "organizador"], desc: "Maletín rígido con manija y trabas para llevar las herramientas ordenadas." },
  { id: "puntas", nombre: "Set de puntas para atornillar · 32 piezas", cat: "herramientas", marca: "gamma", precio: 9900, descuento: 0, stock: 18, destacado: 0, nuevo: false, img: "p-puntas.webp", tags: ["puntas", "atornillar", "bits", "set"], desc: "Puntas planas, Phillips, Torx y Allen en su soporte, para el taladro o el atornillador." },
  { id: "kit-transmision", nombre: "Kit de transmisión para moto 110 cc", cat: "motos", marca: "otras", precio: 38900, descuento: 0, stock: 7, destacado: 4, nuevo: false, img: "p-kit-transmision.webp", tags: ["kit", "transmision", "cadena", "corona", "pinon", "moto"], desc: "Cadena, corona y piñón para motos de 110 cc. Consultanos el modelo y te confirmamos la medida." },
  { id: "bujias", nombre: "Bujía para moto 110 a 150 cc", cat: "motos", marca: "otras", precio: 5200, descuento: 0, stock: 30, destacado: 0, nuevo: false, img: "p-bujias.webp", tags: ["bujia", "encendido", "moto"], desc: "Bujía estándar para motos de 110 a 150 cc. Decinos el modelo y te confirmamos la que va." },
  { id: "pastillas-freno", nombre: "Pastillas de freno delanteras", cat: "motos", marca: "otras", precio: 7900, descuento: 0, stock: 14, destacado: 0, nuevo: false, img: "p-pastillas-freno.webp", tags: ["pastillas", "freno", "disco", "moto"], desc: "Pastillas para freno a disco delantero. Consultanos por la medida de tu moto." },
  { id: "filtro-aceite", nombre: "Filtro de aceite para moto", cat: "motos", marca: "otras", precio: 6300, descuento: 0, stock: 16, destacado: 0, nuevo: false, img: "p-filtro-aceite.webp", tags: ["filtro", "aceite", "service", "moto"], desc: "Filtro de aceite a rosca para el service de la moto." },
  { id: "filtro-aire", nombre: "Filtro de aire para moto", cat: "motos", marca: "otras", precio: 9700, descuento: 0, stock: 10, destacado: 0, nuevo: false, img: "p-filtro-aire.webp", tags: ["filtro", "aire", "service", "moto"], desc: "Filtro de aire de reemplazo para el service. Consultanos la medida de tu moto." },
  { id: "lampara-h4", nombre: "Lámpara H4 12 V 35/35 W", cat: "motos", marca: "otras", precio: 4800, descuento: 0, stock: 24, destacado: 0, nuevo: false, img: "p-lampara-h4.webp", tags: ["lampara", "h4", "optica", "luz", "moto"], desc: "Lámpara H4 de 12 V para el faro delantero, con luz alta y baja." },
  { id: "rulemanes", nombre: "Rulemanes de rueda · par", cat: "motos", marca: "otras", precio: 8600, descuento: 0, stock: 12, destacado: 0, nuevo: false, img: "p-rulemanes.webp", tags: ["rulemanes", "rodamientos", "rueda", "moto"], desc: "Par de rulemanes blindados para la rueda. Consultanos la medida." },
  { id: "cables", nombre: "Cable de embrague o acelerador", cat: "motos", marca: "otras", precio: 5900, descuento: 0, stock: 15, destacado: 0, nuevo: false, img: "p-cables.webp", tags: ["cable", "embrague", "acelerador", "moto"], desc: "Cables de embrague y acelerador para las motos más comunes. Decinos el modelo." },
  { id: "rele", nombre: "Relé de destellador 12 V", cat: "motos", marca: "otras", precio: 4600, descuento: 0, stock: 0, destacado: 0, nuevo: false, img: "p-rele.webp", tags: ["rele", "destellador", "giro", "moto"], desc: "Relé para las luces de giro de 12 V. Escribinos y te avisamos cuando vuelve a entrar." },
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
const marcaLabel = (m) => MARCAS[m] || m;

function parseRangoPrecio(v) {
  const m = /^(\d+)-(\d*)$/.exec(String(v || ""));
  if (!m) return null;
  return { min: Number(m[1]), max: m[2] === "" ? Infinity : Number(m[2]) };
}

const comoLista = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function filtrarColeccion(coleccion, params = {}) {
  const cats = comoLista(params.cat);
  const marcas = comoLista(params.marca);
  const rangos = comoLista(params.precio).map(parseRangoPrecio).filter(Boolean);
  const palabras = normalizar(params.q).split(/\s+/).filter(Boolean);
  const soloStock = Boolean(params.stock);
  let lista = coleccion.filter((p) => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (marcas.length && !marcas.includes(p.marca)) return false;
    if (soloStock && !(p.stock > 0)) return false;
    const precio = precioFinal(p);
    if (rangos.length && !rangos.some((r) => precio >= r.min && precio <= r.max))
      return false;
    if (palabras.length) {
      const indice = normalizar(
        [p.nombre, catLabel(p.cat), marcaLabel(p.marca), p.desc, p.tags.join(" ")].join(" "),
      );
      if (!palabras.every((w) => indice.includes(w))) return false;
    }
    return true;
  });
  const orden = params.orden || "destacados";
  const porDestacado = (a, b) => (a.destacado || 99) - (b.destacado || 99);
  const enNombre = (p) =>
    palabras.length ? palabras.filter((w) => normalizar(p.nombre).includes(w)).length : 0;
  if (orden === "precio-asc")
    lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === "precio-desc")
    lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else
    lista = lista
      .slice()
      .sort(
        (a, b) =>
          enNombre(b) - enNombre(a) ||
          Number(b.stock > 0) - Number(a.stock > 0) ||
          porDestacado(a, b),
      );
  return lista;
}

const ProductosAPI = (() => {
  const coleccion = PRODUCTOS;
  const clonar = (p) => ({ ...p, tags: p.tags.slice() });
  function listar(params = {}) {
    const pedido = Number(params.limit) > 0 ? Math.floor(Number(params.limit)) : PAGE_SIZE;
    const limit = Math.min(pedido, API_MAX);
    const cursor = Number.isFinite(Number(params.cursor))
      ? Math.max(0, Math.floor(Number(params.cursor)))
      : 0;
    const todos = filtrarColeccion(coleccion, params);
    const items = todos.slice(cursor, cursor + limit).map(clonar);
    const nextCursor = cursor + limit < todos.length ? String(cursor + limit) : null;
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
    return (Array.isArray(ids) ? ids : []).slice(0, API_MAX).map(get).filter(Boolean);
  }
  function relacionados(id, n = 3) {
    const base = coleccion.find((x) => x.id === id);
    if (!base) return [];
    const tope = Math.min(Math.max(1, n | 0), API_MAX);
    return coleccion
      .filter((p) => p.id !== id && p.cat === base.cat)
      .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
      .slice(0, tope)
      .map(clonar);
  }
  function conteos(campo) {
    return coleccion.reduce((acc, p) => {
      acc[p[campo]] = (acc[p[campo]] || 0) + 1;
      return acc;
    }, {});
  }
  return { listar, destacados, get, porIds, relacionados, conteos, MAX: API_MAX };
})();

function recibir(res) {
  if (!res || !Array.isArray(res.items) || res.items.length > API_MAX)
    throw new Error("Respuesta de catálogo inválida");
  return res;
}

const storage = (() => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.getItem("ecosol_ping");
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
  KEY: "ecosol_cart",
  get() {
    try {
      const v = JSON.parse(storage.getItem(this.KEY));
      if (!Array.isArray(v)) return [];
      return v
        .filter((i) => i && typeof i.id === "string" && Number(i.qty) > 0)
        .map((i) => ({ id: i.id, qty: Math.floor(Number(i.qty)) }));
    } catch {
      return [];
    }
  },
  save(items) {
    storage.setItem(this.KEY, JSON.stringify(items));
    if (esDOM) document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1) {
    if (!producto || !(producto.stock > 0)) return false;
    const n = Math.max(1, Math.floor(Number(qty) || 1));
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + n, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(n, producto.stock ?? 99) });
    this.save(items);
    return true;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const p = ProductosAPI.get(id);
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty) || 1), p?.stock ?? 99));
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter((i) => i.id !== id));
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
          ? { ...i, producto: p, unitario: precioFinal(p), subtotal: precioFinal(p) * i.qty }
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
      if (i.qty > p.stock) {
        i.qty = p.stock;
        changed = true;
      }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const wspLink = (texto) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

function construirMensajeWsp(lineas, total) {
  const lines = [`Hola ${MARCA}, quiero hacer este pedido:`, ""];
  lineas.forEach((l) =>
    lines.push(`${l.qty} x ${l.producto.nombre} | ${formatearPrecio(l.subtotal)}`),
  );
  lines.push("", `Total: ${formatearPrecio(total)}`, "¿Me confirman disponibilidad y cómo lo retiro?");
  return wspLink(lines.join("\n"));
}

function mensajeProducto(p) {
  return wspLink(`Hola ${MARCA}, quiero consultar por: ${p.nombre}. ¿Lo tienen disponible?`);
}

function badgesHTML(p) {
  const out = [];
  if (p.stock <= 0) out.push('<span class="badge badge--sin">Sin stock</span>');
  else if (p.stock <= 3) out.push('<span class="badge badge--pocas">Últimas unidades</span>');
  if (p.descuento > 0) out.push(`<span class="badge badge--oferta">-${p.descuento}%</span>`);
  if (p.nuevo) out.push('<span class="badge badge--nuevo">Nuevo</span>');
  return out.join("");
}

function precioHTML(p) {
  if (p.descuento > 0)
    return `<span class="precio precio--oferta">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`;
  return `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function imgHTML(p, extra = "") {
  return `<img src="images/${esc(p.img)}" alt="${esc(p.nombre)}" width="600" height="600" decoding="async"${extra}>`;
}

function stepperHTML(max, attrs = "", valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}" ${attrs}>
    <button type="button" data-step="-1" aria-label="Una unidad menos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
    <output aria-live="polite">${valor}</output>
    <button type="button" data-step="1" aria-label="Una unidad más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
  </div>`;
}

function stockTexto(p) {
  if (p.stock <= 0) return "Sin stock por ahora";
  if (p.stock <= 3) return `Quedan ${p.stock}`;
  return "En stock";
}

function cardHTML(p) {
  const agotado = p.stock <= 0;
  return `<article class="prod${agotado ? " prod--agotado" : ""}" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <div class="prod-media">
      ${imgHTML(p)}
      <button class="prod-media-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"></button>
      <div class="prod-badges">${badgesHTML(p)}</div>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(catLabel(p.cat))} · ${esc(marcaLabel(p.marca))}</span>
      <h3 class="prod-name"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <div class="prod-meta">
        <div class="prod-price">${precioHTML(p)}</div>
        <span class="prod-stock${agotado ? " prod-stock--sin" : p.stock <= 3 ? " prod-stock--pocas" : ""}">${stockTexto(p)}</span>
      </div>
      <div class="prod-actions">
        ${stepperHTML(Math.max(1, p.stock))}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}"${agotado ? " disabled" : ` aria-label="Agregar ${esc(p.nombre)} al carrito"`}>${agotado ? "Sin stock" : `<span class="add-largo" aria-hidden="true">Agregar al carrito</span><span class="add-corto" aria-hidden="true">Agregar</span>`}</button>
      </div>
      ${agotado ? `<a class="prod-buy" href="${mensajeProducto(p)}" target="_blank" rel="noopener">Avisame cuando entre</a>` : `<button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function railHTML(p) {
  return `<li class="rail-card" data-animate="der" style="opacity:0;transform:translateX(64px)">
    <button class="rail-card-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
      <span class="prod-media">${imgHTML(p)}<span class="prod-badges">${badgesHTML(p)}</span></span>
      <span class="rail-card-body"><span class="prod-cat">${esc(catLabel(p.cat))}</span><strong>${esc(p.nombre)}</strong><span class="prod-price">${precioHTML(p)}</span></span>
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
        setTimeout(() => {
          el.style.transitionDelay = "";
        }, (d + 1.2) * 1000);
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
    setTimeout(() => {
      el.style.transitionDelay = "";
    }, (d + 1.2) * 1000);
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
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function irATienda() {
  document.getElementById("tienda")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

let ultimoFocoDrawer = null;
function renderCart() {
  const body = document.getElementById("cart-body");
  const foot = document.getElementById("cart-foot");
  if (!body || !foot) return;
  const lineas = Cart.lineas();
  if (!lineas.length) {
    body.innerHTML = `<div class="cart-vacio"><svg viewBox="0 0 64 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 12c5-6 10-6 15 0s10 6 15 0 10-6 15 0 10 6 15 0"/></svg><strong>Tu carrito está vacío</strong><p class="muted">Sumá lo que necesitás para la pileta, el taller o la moto.</p><button type="button" class="btn btn--linea" data-ir-catalogo>Ver los productos</button></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = lineas
    .map(
      (l) => `<div class="cart-line" data-line-id="${esc(l.id)}">
    <div class="cart-line-img">${imgHTML(l.producto)}</div>
    <div class="cart-line-info">
      <strong>${esc(l.producto.nombre)}</strong>
      <small>${formatearPrecio(l.unitario)} c/u</small>
      ${stepperHTML(Math.max(1, l.producto.stock), `data-cart-id="${esc(l.id)}"`, l.qty)}
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
    <a class="btn btn--linea" href="${construirMensajeWsp(lineas, total)}" target="_blank" rel="noopener" data-cart-wsp>Mandar el pedido por WhatsApp</a>
    <p class="drawer-nota">El retiro en Ruta 16 km 27,8 o el envío se coordinan por WhatsApp.</p>`;
}

function openCartDrawer() {
  const d = document.getElementById("cart-drawer");
  const bd = document.getElementById("drawer-backdrop");
  if (!d || !bd) return;
  ultimoFocoDrawer = document.activeElement;
  renderCart();
  d.classList.add("open");
  d.removeAttribute("inert");
  bd.classList.add("open");
  document.body.classList.add("no-scroll");
  d.querySelector("[data-close-cart]")?.focus();
}

function closeCartDrawer() {
  const d = document.getElementById("cart-drawer");
  const bd = document.getElementById("drawer-backdrop");
  if (!d || !d.classList.contains("open")) return;
  d.classList.remove("open");
  d.setAttribute("inert", "");
  bd?.classList.remove("open");
  if (document.getElementById("modal-backdrop")?.hidden !== false)
    document.body.classList.remove("no-scroll");
  ultimoFocoDrawer?.focus?.();
}

function initCartUI() {
  const d = document.getElementById("cart-drawer");
  if (!d) return;
  document.querySelectorAll("[data-open-cart]").forEach((b) => b.addEventListener("click", openCartDrawer));
  d.querySelector("[data-close-cart]")?.addEventListener("click", closeCartDrawer);
  document.getElementById("drawer-backdrop")?.addEventListener("click", closeCartDrawer);
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
      const nuevo = Math.max(1, Math.min(max, (Number(out.textContent) || 1) + Number(step.dataset.step)));
      Cart.setQty(st.dataset.cartId, nuevo);
      const linea = Cart.lineas().find((l) => l.id === st.dataset.cartId);
      out.textContent = linea ? linea.qty : nuevo;
      const precio = st.closest(".cart-line")?.querySelector(".cart-line-right .precio");
      if (precio && linea) precio.textContent = formatearPrecio(linea.subtotal);
      const totalEl = document.querySelector("#cart-foot .drawer-total .precio");
      if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
      const wsp = document.querySelector("#cart-foot [data-cart-wsp]");
      if (wsp) wsp.href = construirMensajeWsp(Cart.lineas(), Cart.total());
      return;
    }
    const del = e.target.closest("[data-cart-del]");
    if (del) {
      Cart.remove(del.closest(".cart-line").dataset.lineId);
      renderCart();
      d.querySelector("[data-close-cart]")?.focus();
      showToast("Producto quitado del carrito.");
      return;
    }
    if (e.target.closest("[data-finalizar]")) {
      showToast("¡Genial! El pago online se activa al pasar la web a producción.");
      return;
    }
    if (e.target.closest("[data-ir-catalogo]")) {
      closeCartDrawer();
      irATienda();
    }
  });
  document.addEventListener("cart:updated", updateCartBadge);
  document.addEventListener("cart:updated", () => {
    if (d.classList.contains("open") && !d.contains(document.activeElement)) renderCart();
  });
  Cart.syncStock();
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
    brand: { "@type": "Brand", name: marcaLabel(p.marca) },
    category: catLabel(p.cat),
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: base + "?producto=" + p.id,
    },
  });
}

function abrirModal(id) {
  const p = ProductosAPI.get(id);
  const bd = document.getElementById("modal-backdrop");
  const m = document.getElementById("modal");
  if (!p || !bd || !m) return;
  if (bd.hidden) ultimoFocoModal = document.activeElement;
  const agotado = p.stock <= 0;
  const rel = ProductosAPI.relacionados(p.id, 3);
  m.innerHTML = `<button class="modal-close" type="button" data-close-modal aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-media">${imgHTML(p)}<div class="prod-badges">${badgesHTML(p)}</div></div>
    <div class="modal-info">
      <span class="prod-cat">${esc(catLabel(p.cat))} · ${esc(marcaLabel(p.marca))}</span>
      <h2>${esc(p.nombre)}</h2>
      <div class="prod-price">${precioHTML(p)}</div>
      <span class="prod-stock${agotado ? " prod-stock--sin" : p.stock <= 3 ? " prod-stock--pocas" : ""}">${stockTexto(p)}</span>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-actions">
        ${stepperHTML(Math.max(1, p.stock), "data-modal-stepper")}
        <button type="button" class="btn btn--cta" data-modal-add${agotado ? " disabled" : ""}>${agotado ? "Sin stock" : "Agregar al carrito"}</button>
        ${agotado ? "" : '<button type="button" class="btn btn--tinta" data-modal-buy>Comprar ahora</button>'}
      </div>
      <a class="link-mas" href="${mensajeProducto(p)}" target="_blank" rel="noopener">${agotado ? "Avisame cuando entre" : "Consultar por WhatsApp"}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
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
    const step = e.target.closest("[data-step]");
    if (step) {
      const st = step.closest("[data-stepper]");
      const out = st?.querySelector("output");
      if (!st || !out) return;
      const max = Number(st.dataset.max) || 99;
      out.textContent = Math.max(1, Math.min(max, (Number(out.textContent) || 1) + Number(step.dataset.step)));
      return;
    }
    if (e.target.closest("[data-modal-add]") || e.target.closest("[data-modal-buy]")) {
      const p = ProductosAPI.get(m.dataset.id);
      const qty = Number(m.querySelector("[data-modal-stepper] output")?.textContent) || 1;
      if (!p || !Cart.add(p, qty)) return;
      if (e.target.closest("[data-modal-buy]")) {
        cerrarModal();
        openCartDrawer();
      } else showToast(`${p.nombre}: ${qty > 1 ? qty + " unidades agregadas" : "agregado al carrito"}.`);
    }
  });
}

const catalogo = { cat: [], marca: [], precio: [], stock: false, q: "", orden: "destacados", cursor: 0, cargados: 0, total: 0 };

function leerFiltros() {
  const marcados = (f) => [...document.querySelectorAll(`input[data-f="${f}"]:checked`)].map((i) => i.value);
  catalogo.cat = marcados("cat");
  catalogo.marca = marcados("marca");
  catalogo.precio = marcados("precio");
  catalogo.stock = marcados("stock").length > 0;
}

function textoConteo() {
  const { total, q, cat } = catalogo;
  if (total === 0) return q ? `Sin resultados para «${q}»` : "No hay productos con esos filtros";
  const n = total === 1 ? "1 producto" : `${total} productos`;
  if (q) return `${n} para «${q}»`;
  if (cat.length === 1) return `${n} en ${catLabel(cat[0])}`;
  return n;
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
        marca: catalogo.marca,
        precio: catalogo.precio,
        stock: catalogo.stock,
        q: catalogo.q,
        orden: catalogo.orden,
        cursor: catalogo.cursor,
        limit: PAGE_SIZE,
      }),
    );
  } catch {
    grid.innerHTML = `<div class="tienda-vacio"><strong>No pudimos cargar los productos</strong><p class="muted">Probá de nuevo en un momento.</p></div>`;
    grid.setAttribute("aria-busy", "false");
    return;
  }
  catalogo.total = res.total;
  if (res.total === 0) {
    grid.innerHTML = `<div class="tienda-vacio"><strong>${esc(textoConteo())}</strong><p class="muted">Probá con otra palabra o sacá algún filtro. Si no lo encontrás, preguntanos: puede que lo tengamos en el local.</p><div class="tienda-vacio-acciones"><button type="button" class="btn btn--linea" data-limpiar>Limpiar filtros</button><a class="btn btn--tinta" href="${wspLink(`Hola ${MARCA}, estoy buscando: ${catalogo.q || "un producto"}. ¿Lo tienen?`)}" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div></div>`;
  } else {
    grid.insertAdjacentHTML("beforeend", res.items.map(cardHTML).join(""));
  }
  catalogo.cargados += res.items.length;
  catalogo.cursor = res.nextCursor === null ? null : Number(res.nextCursor);
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = textoConteo();
  });
  const pie = document.querySelector("[data-count-pie]");
  const mas = document.querySelector("[data-ver-mas]");
  if (pie) pie.textContent = res.total ? `Mostrando ${catalogo.cargados} de ${res.total}` : "";
  if (mas) mas.hidden = res.nextCursor === null;
  const limpiar = document.querySelector("[data-limpiar-barra]");
  if (limpiar) limpiar.hidden = !(catalogo.cat.length || catalogo.marca.length || catalogo.precio.length || catalogo.stock || catalogo.q);
  document.querySelectorAll("[data-cat-link]").forEach((el) => {
    el.classList.toggle("is-activa", catalogo.cat.length === 1 && catalogo.cat[0] === el.dataset.catLink && !catalogo.q);
  });
  grid.setAttribute("aria-busy", "false");
  revelarNuevos(grid);
  refrescarScroll();
}

function setFiltroUnico(campo, valor) {
  document.querySelectorAll("input[data-f]").forEach((i) => {
    i.checked = i.dataset.f === campo && i.value === valor;
  });
  catalogo.q = "";
  document.querySelectorAll("[data-busca] input").forEach((i) => {
    i.value = "";
  });
  leerFiltros();
  cargarPagina(true);
}

function setBusqueda(q) {
  catalogo.q = String(q || "").trim().slice(0, 60);
  document.querySelectorAll("[data-busca] input").forEach((i) => {
    if (i.value !== catalogo.q) i.value = catalogo.q;
  });
  cargarPagina(true);
}

function initCatalogo() {
  const grid = document.getElementById("catalogo");
  if (!grid) return;
  const porCat = ProductosAPI.conteos("cat");
  const porMarca = ProductosAPI.conteos("marca");
  document.querySelectorAll("[data-fcount]").forEach((el) => {
    el.textContent = porCat[el.dataset.fcount] ?? porMarca[el.dataset.fcount] ?? 0;
  });
  const params = new URLSearchParams(location.search);
  const catUrl = params.get("cat");
  if (catUrl && CATEGORIAS[catUrl]) {
    const input = document.querySelector(`input[data-f="cat"][value="${catUrl}"]`);
    if (input) input.checked = true;
  }
  const qUrl = params.get("q");
  if (qUrl) catalogo.q = qUrl.trim().slice(0, 60);
  leerFiltros();
  cargarPagina(true);

  document.querySelectorAll("input[data-f]").forEach((i) =>
    i.addEventListener("change", () => {
      leerFiltros();
      cargarPagina(true);
    }),
  );
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-limpiar]") || e.target.closest("[data-limpiar-barra]")) {
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

  document.querySelectorAll("[data-busca]").forEach((form) => {
    const input = form.querySelector("input");
    let t = 0;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearTimeout(t);
      setBusqueda(input?.value);
      if (!form.closest("#tienda")) irATienda();
    });
    if (form.hasAttribute("data-busca-vivo")) {
      input?.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => setBusqueda(input.value), 260);
      });
    }
    if (input && catalogo.q) input.value = catalogo.q;
  });

  const toggle = document.querySelector(".filtros-toggle");
  toggle?.addEventListener("click", () => {
    const aside = toggle.closest(".filtros");
    const abierto = aside.classList.toggle("open");
    toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    refrescarScroll();
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-cat-link], [data-marca-link]");
    if (!link) return;
    e.preventDefault();
    if (link.dataset.catLink) setFiltroUnico("cat", link.dataset.catLink);
    else setFiltroUnico("marca", link.dataset.marcaLink);
    irATienda();
  });

  grid.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      const st = step.closest("[data-stepper]");
      const out = st?.querySelector("output");
      if (!st || !out) return;
      const max = Number(st.dataset.max) || 99;
      out.textContent = Math.max(1, Math.min(max, (Number(out.textContent) || 1) + Number(step.dataset.step)));
      return;
    }
    const btn = e.target.closest("[data-add], [data-buy]");
    if (!btn) return;
    const card = btn.closest(".prod");
    const p = ProductosAPI.get(btn.dataset.add || btn.dataset.buy);
    const qty = Number(card?.querySelector("[data-stepper] output")?.textContent) || 1;
    if (!p || !Cart.add(p, qty)) {
      showToast("Ese producto no tiene stock: escribinos y te avisamos.");
      return;
    }
    if (btn.dataset.buy) openCartDrawer();
    else {
      btn.classList.remove("ok");
      void btn.offsetWidth;
      btn.classList.add("ok");
      showToast(`${p.nombre}: agregado al carrito.`);
    }
  });

  const prod = params.get("producto");
  if (prod && ProductosAPI.get(prod)) setTimeout(() => abrirModal(prod), 300);
}

function renderDestacados() {
  const cont = document.querySelector("[data-destacados]");
  if (!cont) return;
  cont.innerHTML = ProductosAPI.destacados(DESTACADOS_MAX).map(railHTML).join("");
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
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
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
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
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
      setTimeout(() => vp.removeEventListener("click", kill, { capture: true }), 0);
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
    return card ? card.getBoundingClientRect().width + 16 : vp.clientWidth * 0.8;
  };
  const sync = () => {
    if (!prev || !next || !track) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? "auto" : "smooth" }));
  next?.addEventListener("click", () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? "auto" : "smooth" }));
  vp.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  window.addEventListener("load", sync);
  sync();
}

function initBanner() {
  const b = document.querySelector("[data-banner]");
  if (!b) return;
  const slides = [...b.querySelectorAll("[data-slide]")];
  const fotos = [...b.querySelectorAll("[data-slide-foto]")];
  const dots = [...b.querySelectorAll("[data-dot]")];
  if (slides.length < 2) return;
  let i = 0;
  let timer = 0;
  const ir = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle("is-on", k === i);
      s.setAttribute("aria-hidden", k === i ? "false" : "true");
      s.querySelectorAll("a, button").forEach((el) => {
        el.tabIndex = k === i ? 0 : -1;
      });
    });
    fotos.forEach((f, k) => f.classList.toggle("is-on", k === i));
    dots.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
  };
  const play = () => {
    if (reduceMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => ir(i + 1), 5200);
  };
  dots.forEach((d, k) =>
    d.addEventListener("click", () => {
      ir(k);
      play();
    }),
  );
  b.addEventListener("mouseenter", () => window.clearInterval(timer));
  b.addEventListener("mouseleave", play);
  b.addEventListener("focusin", () => window.clearInterval(timer));
  ir(0);
  play();
}

function initMapa() {
  const el = document.getElementById("mapa");
  if (!el || typeof L === "undefined") return;
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([UBICACION.lat, UBICACION.lng], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19,
  }).addTo(mapa);
  const icono = L.divIcon({
    className: "mapa-pin",
    html: '<span class="mapa-pin-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5-3"/><path d="M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5-3"/><circle cx="12" cy="6" r="3"/></svg></span>',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
  L.marker([UBICACION.lat, UBICACION.lng], { icon: icono, title: "Ecosol" })
    .addTo(mapa)
    .bindPopup("<strong>Ecosol</strong><br>Ruta 16, km 27,8 · Cruce Viejo, Puerto Tirol");
  window.addEventListener("load", () => mapa.invalidateSize());
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
  const desktopMq = window.matchMedia("(min-width: 900px)");
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
  toggle.addEventListener("click", () => (nav.classList.contains("open") ? close() : open()));
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
    showTimer = setTimeout(() => bar.classList.remove("gw-modelos--scrolling"), 120);
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
  tl.from(hero.querySelectorAll(".hero-eyebrow"), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll("h1"), { y: 40, opacity: 0, duration: 1.2 }, 0.2)
    .from(hero.querySelectorAll(".hero-lead, .hero-busca"), { y: 26, opacity: 0, duration: 1, stagger: 0.1, clearProps: "transform,opacity" }, 0.45)
    .from(hero.querySelectorAll(".hero-ctas .btn"), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "transform,opacity" }, 0.6)
    .from(hero.querySelectorAll(".sello, .hero-badge, .hero-chip"), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.06, clearProps: "transform,opacity" }, 0.65);
}

globalThis.ecosolLogic = () => ({
   PRODUCTOS, CATEGORIAS, MARCAS, ProductosAPI, Cart, filtrarColeccion, precioFinal, formatearPrecio, construirMensajeWsp, recibir, storage, API_MAX, PAGE_SIZE,
});

if (esDOM) {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === "undefined") document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in"));
  if (typeof ScrollTrigger !== "undefined") window.addEventListener("load", () => ScrollTrigger.refresh());

  initModelBarScroll();
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
  initMapa();
  initHeroMotion();
}
