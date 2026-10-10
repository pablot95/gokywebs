const WHATSAPP_NUMBER = "5491165267885";
const MARCA = "EncantArte";
const PAGE_SIZE = 16;
const API_MAX = 100;
const DESTACADOS_MAX = 8;
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
  ropa: "Indumentaria",
  carteras: "Carteras y bolsos",
  accesorios: "Accesorios",
  calzado: "Calzado",
  deco: "Deco y regalos",
};

const ROPA = ["S", "M", "L", "XL"];
const PIES = ["35", "36", "37", "38", "39", "40"];

const PRODUCTOS = [
  { id: "camisa-marfil", nombre: "Camisa fluida Marfil", cat: "ropa", precio: 38900, descuento: 0, stock: 12, talles: ROPA, destacado: 1, nuevo: true, img: "p-camisa-marfil.webp", tags: ["camisa", "blusa", "blanca", "fluida"], desc: "Camisa de caída suave con mangas para arremangar. Va con el pantalón sastrero o con un jean." },
  { id: "pantalon-sastrero", nombre: "Pantalón sastrero Arena", cat: "ropa", precio: 42900, descuento: 0, stock: 9, talles: ROPA, destacado: 3, nuevo: false, img: "p-pantalon-sastrero.webp", tags: ["pantalon", "sastrero", "pinzas", "beige"], desc: "Tiro alto, pinzas y pierna ancha. Cómodo para todo el día y elegante para salir." },
  { id: "sweater-crema", nombre: "Sweater de punto Crema", cat: "ropa", precio: 45900, descuento: 0, stock: 7, talles: ["S", "M", "L"], destacado: 5, nuevo: false, img: "p-sweater-crema.webp", tags: ["sweater", "tejido", "punto", "crema"], desc: "Punto grueso, cuello redondo y calce amplio para usar suelto." },
  { id: "jean-recto", nombre: "Jean recto clásico", cat: "ropa", precio: 39900, descuento: 10, stock: 11, talles: ROPA, destacado: 0, nuevo: false, img: "p-jean-recto.webp", tags: ["jean", "denim", "recto", "azul"], desc: "Denim azul de calce recto, con bolsillos traseros clásicos." },
  { id: "sweater-celeste", nombre: "Sweater liviano Celeste", cat: "ropa", precio: 34900, descuento: 0, stock: 10, talles: ROPA, destacado: 0, nuevo: false, img: "p-sweater-celeste.webp", tags: ["sweater", "liviano", "celeste", "media estacion"], desc: "Tejido fino para media estación, cuello redondo y puños elastizados." },
  { id: "sweater-azul", nombre: "Sweater trenzado Azul francia", cat: "ropa", precio: 47900, descuento: 0, stock: 2, talles: ["S", "M", "L"], destacado: 0, nuevo: false, img: "p-sweater-azul.webp", tags: ["sweater", "trenzado", "azul", "tejido"], desc: "Trenzado grueso en azul intenso, para darle color a un look neutro." },
  { id: "camisa-lino", nombre: "Camisa de lino Blanca", cat: "ropa", precio: 36900, descuento: 0, stock: 8, talles: ROPA, destacado: 0, nuevo: true, img: "p-camisa-lino.webp", tags: ["camisa", "lino", "blanca", "verano"], desc: "Lino liviano con botones, para usar abierta sobre una remera o abrochada." },
  { id: "cartera-clara", nombre: "Cartera Clara", cat: "carteras", precio: 54900, descuento: 0, stock: 5, talles: [], destacado: 2, nuevo: false, img: "p-cartera-clara.webp", tags: ["cartera", "bolso", "crema", "mano"], desc: "Cartera de mano con correa corta y cierre metálico dorado. Combina con todo." },
  { id: "cartera-celeste", nombre: "Cartera Celeste con borla", cat: "carteras", precio: 52900, descuento: 0, stock: 6, talles: [], destacado: 6, nuevo: false, img: "p-cartera-celeste.webp", tags: ["cartera", "bolso", "celeste", "borla"], desc: "Dos manijas, cierre de cremallera y una borla que le da movimiento." },
  { id: "cartera-bruma", nombre: "Cartera Bruma", cat: "carteras", precio: 49900, descuento: 0, stock: 3, talles: [], destacado: 0, nuevo: false, img: "p-cartera-bruma.webp", tags: ["cartera", "bolso", "verde", "petroleo"], desc: "Cartera rígida en verde petróleo con cierre dorado." },
  { id: "tote-teal", nombre: "Bolso tote de lona", cat: "carteras", precio: 24900, descuento: 0, stock: 14, talles: [], destacado: 4, nuevo: false, img: "p-tote-teal.webp", tags: ["tote", "bolso", "lona", "playa"], desc: "Lona resistente con manijas largas: entra la compu, el abrigo y lo que haga falta." },
  { id: "billetera-cielo", nombre: "Billetera Cielo", cat: "carteras", precio: 18900, descuento: 0, stock: 11, talles: [], destacado: 0, nuevo: false, img: "p-billetera-cielo.webp", tags: ["billetera", "celeste", "cierre"], desc: "Billetera con cierre y lugar para tarjetas, billetes y monedas." },
  { id: "billetera-esmeralda", nombre: "Billetera Esmeralda", cat: "carteras", precio: 18900, descuento: 0, stock: 9, talles: [], destacado: 0, nuevo: false, img: "p-billetera-esmeralda.webp", tags: ["billetera", "verde", "cierre"], desc: "La misma billetera en verde esmeralda, para que se encuentre rápido en la cartera." },
  { id: "neceser-ikat", nombre: "Neceser ikat con borla", cat: "carteras", precio: 17900, descuento: 0, stock: 12, talles: [], destacado: 0, nuevo: false, img: "p-neceser-ikat.webp", tags: ["neceser", "cosmetiquero", "ikat", "viaje"], desc: "Tela estampada con cierre dorado. Para el maquillaje o para viajar." },
  { id: "panuelo-mar", nombre: "Pañuelo de seda Mar", cat: "accesorios", precio: 16900, descuento: 0, stock: 15, talles: [], destacado: 7, nuevo: false, img: "p-panuelo-mar.webp", tags: ["panuelo", "seda", "azul", "estampado"], desc: "Para el cuello, el pelo o atado en la manija de la cartera." },
  { id: "panuelo-rayas", nombre: "Pañuelo de rayas Océano", cat: "accesorios", precio: 15900, descuento: 0, stock: 10, talles: [], destacado: 0, nuevo: false, img: "p-panuelo-rayas.webp", tags: ["panuelo", "rayas", "azul"], desc: "Rayas anchas en azules y blanco." },
  { id: "anteojos-aurora", nombre: "Anteojos de sol Aurora", cat: "accesorios", precio: 22900, descuento: 0, stock: 8, talles: [], destacado: 0, nuevo: false, img: "p-anteojos-aurora.webp", tags: ["anteojos", "lentes", "sol"], desc: "Armazón dorado liviano con lentes degradé." },
  { id: "anteojos-aviador", nombre: "Anteojos de sol Aviador", cat: "accesorios", precio: 21900, descuento: 0, stock: 0, talles: [], destacado: 0, nuevo: false, img: "p-anteojos-aviador.webp", tags: ["anteojos", "lentes", "sol", "aviador"], desc: "El clásico aviador con puente doble. Escribinos y te avisamos cuando vuelve." },
  { id: "aros-turquesa", nombre: "Set de anillos Turquesa", cat: "accesorios", precio: 11900, descuento: 0, stock: 9, talles: [], destacado: 0, nuevo: false, img: "p-aros-turquesa.webp", tags: ["anillos", "bijou", "turquesa", "dorado"], desc: "Dos anillos con piedra turquesa y uno trenzado, en tono dorado." },
  { id: "aros-gota", nombre: "Aros gota Aguamarina", cat: "accesorios", precio: 9900, descuento: 0, stock: 13, talles: [], destacado: 0, nuevo: true, img: "p-aros-gota.webp", tags: ["aros", "bijou", "aguamarina", "dorado"], desc: "Argolla dorada con una gota verde agua que se mueve." },
  { id: "pulsera-aguamarina", nombre: "Pulsera de piedras Aguamarina", cat: "accesorios", precio: 11900, descuento: 0, stock: 10, talles: [], destacado: 0, nuevo: false, img: "p-pulsera-aguamarina.webp", tags: ["pulsera", "bijou", "piedras", "elastizada"], desc: "Piedras verde agua con dije dorado, elastizada." },
  { id: "collar-medalla", nombre: "Collar con medalla", cat: "accesorios", precio: 14900, descuento: 0, stock: 7, talles: [], destacado: 0, nuevo: false, img: "p-collar-medalla.webp", tags: ["collar", "cadena", "medalla", "bijou"], desc: "Cadena fina con medalla y piedra verde agua." },
  { id: "zapatillas-urbanas", nombre: "Zapatillas urbanas Blanco y azul", cat: "calzado", precio: 62900, descuento: 0, stock: 8, talles: PIES, destacado: 8, nuevo: false, img: "p-zapatillas-urbanas.webp", tags: ["zapatillas", "urbanas", "blancas", "azul"], desc: "Blancas con detalles grises y suela azul. Para usar todos los días." },
  { id: "zapatillas-blancas", nombre: "Zapatillas clásicas Blancas", cat: "calzado", precio: 59900, descuento: 0, stock: 6, talles: PIES, destacado: 0, nuevo: false, img: "p-zapatillas-blancas.webp", tags: ["zapatillas", "blancas", "clasicas"], desc: "Las blancas de siempre, con talón en tono arena." },
  { id: "vela-ceramica", nombre: "Vela en vaso de cerámica", cat: "deco", precio: 12900, descuento: 0, stock: 16, talles: [], destacado: 0, nuevo: false, img: "p-vela-ceramica.webp", tags: ["vela", "aromatica", "ceramica", "regalo"], desc: "Vaso de cerámica pintado que después sirve de maceta o portalápices." },
  { id: "florero-azul", nombre: "Florero de vidrio Azul", cat: "deco", precio: 15900, descuento: 0, stock: 6, talles: [], destacado: 0, nuevo: false, img: "p-florero-azul.webp", tags: ["florero", "vidrio", "azul", "deco"], desc: "Vidrio azul translúcido, para flores secas o un ramito fresco." },
  { id: "pashmina-flecos", nombre: "Pashmina tejida con flecos", cat: "deco", precio: 28900, descuento: 0, stock: 9, talles: [], destacado: 0, nuevo: true, img: "p-pashmina-flecos.webp", tags: ["pashmina", "manta", "flecos", "regalo"], desc: "Tejido rústico con flecos: para el sillón, la cama o abrigarse." },
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
const conTalle = (p) => p.talles.length > 0;
const tallesTexto = (p) => {
  if (!conTalle(p)) return "Talle único";
  if (p.cat === "calzado") return `Del ${p.talles[0]} al ${p.talles[p.talles.length - 1]}`;
  return p.talles.join(" · ");
};

function parseRangoPrecio(v) {
  const m = /^(\d+)-(\d*)$/.exec(String(v || ""));
  if (!m) return null;
  return { min: Number(m[1]), max: m[2] === "" ? Infinity : Number(m[2]) };
}

const comoLista = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function filtrarColeccion(coleccion, params = {}) {
  const cats = comoLista(params.cat);
  const talles = comoLista(params.talle);
  const rangos = comoLista(params.precio).map(parseRangoPrecio).filter(Boolean);
  const palabras = normalizar(params.q).split(/\s+/).filter(Boolean);
  const soloStock = Boolean(params.stock);
  let lista = coleccion.filter((p) => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (talles.length && !p.talles.some((t) => talles.includes(t))) return false;
    if (soloStock && !(p.stock > 0)) return false;
    const precio = precioFinal(p);
    if (rangos.length && !rangos.some((r) => precio >= r.min && precio <= r.max)) return false;
    if (palabras.length) {
      const indice = normalizar([p.nombre, catLabel(p.cat), p.desc, p.tags.join(" ")].join(" "));
      if (!palabras.every((w) => indice.includes(w))) return false;
    }
    return true;
  });
  const orden = params.orden || "destacados";
  const porDestacado = (a, b) => (a.destacado || 99) - (b.destacado || 99);
  const enNombre = (p) =>
    palabras.length ? palabras.filter((w) => normalizar(p.nombre).includes(w)).length : 0;
  if (orden === "precio-asc") lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === "precio-desc") lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (orden === "nuevos")
    lista = lista.slice().sort((a, b) => Number(b.nuevo) - Number(a.nuevo) || porDestacado(a, b));
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
  const clonar = (p) => ({ ...p, tags: p.tags.slice(), talles: p.talles.slice() });
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
  function conteos() {
    return coleccion.reduce((acc, p) => {
      acc[p.cat] = (acc[p.cat] || 0) + 1;
      p.talles.forEach((t) => {
        acc["t" + t] = (acc["t" + t] || 0) + 1;
      });
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
      localStorage.getItem("encantarte_ping");
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
  KEY: "encantarte_cart",
  get() {
    try {
      const v = JSON.parse(storage.getItem(this.KEY));
      if (!Array.isArray(v)) return [];
      return v
        .filter((i) => i && typeof i.id === "string" && Number(i.qty) > 0)
        .map((i) => ({ id: i.id, talle: typeof i.talle === "string" ? i.talle : "", qty: Math.floor(Number(i.qty)) }));
    } catch {
      return [];
    }
  },
  save(items) {
    storage.setItem(this.KEY, JSON.stringify(items));
    if (esDOM) document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1, talle = "") {
    if (!producto || !(producto.stock > 0)) return false;
    if (conTalle(producto) && !producto.talles.includes(talle)) return false;
    const t = conTalle(producto) ? talle : "";
    const n = Math.max(1, Math.floor(Number(qty) || 1));
    const items = this.get();
    const enCarrito = items.filter((i) => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const lugar = Math.max(0, (producto.stock ?? 99) - enCarrito);
    if (!lugar) return false;
    const existing = items.find((i) => i.id === producto.id && i.talle === t);
    if (existing) existing.qty += Math.min(n, lugar);
    else items.push({ id: producto.id, talle: t, qty: Math.min(n, lugar) });
    this.save(items);
    return true;
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id && i.talle === talle);
    if (!it) return;
    const p = ProductosAPI.get(id);
    const otros = items.filter((i) => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty) || 1), (p?.stock ?? 99) - otros));
    this.save(items);
  },
  remove(id, talle) {
    this.save(this.get().filter((i) => !(i.id === id && i.talle === talle)));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  lineas() {
    const items = this.get();
    const productos = ProductosAPI.porIds([...new Set(items.map((i) => i.id))]);
    return items
      .map((i) => {
        const p = productos.find((x) => x.id === i.id);
        return p ? { ...i, producto: p, unitario: precioFinal(p), subtotal: precioFinal(p) * i.qty } : null;
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
      if (!p || p.stock <= 0 || (conTalle(p) && !p.talles.includes(i.talle))) {
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

const wspLink = (texto) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

function construirMensajeWsp(lineas, total) {
  const lines = [`Hola ${MARCA}, quiero hacer este pedido:`, ""];
  lineas.forEach((l) =>
    lines.push(`${l.qty} x ${l.producto.nombre}${l.talle ? ` (talle ${l.talle})` : ""} | ${formatearPrecio(l.subtotal)}`),
  );
  lines.push("", `Total: ${formatearPrecio(total)}`, "¿Me confirman disponibilidad y cómo coordinamos la entrega?");
  return wspLink(lines.join("\n"));
}

function mensajeProducto(p, talle) {
  return wspLink(`Hola ${MARCA}, quiero consultar por: ${p.nombre}${talle ? ` en talle ${talle}` : ""}. ¿Lo tienen disponible?`);
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
  return `<img src="images/${esc(p.img)}" alt="${esc(p.nombre)}" width="560" height="700" decoding="async"${extra}>`;
}

function stepperHTML(max, attrs = "", valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}" ${attrs}>
    <button type="button" data-step="-1" aria-label="Una unidad menos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
    <output aria-live="polite">${valor}</output>
    <button type="button" data-step="1" aria-label="Una unidad más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
  </div>`;
}

const numero = (p) => String(PRODUCTOS.findIndex((x) => x.id === p.id) + 1).padStart(3, "0");

function cardHTML(p) {
  const agotado = p.stock <= 0;
  const variante = conTalle(p);
  const etiqueta = agotado ? "Sin stock" : variante ? "Elegir talle" : "Agregar al carrito";
  const corta = agotado ? "Sin stock" : variante ? "Talle" : "Agregar";
  return `<article class="prod${agotado ? " prod--agotado" : ""}" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <div class="prod-media">
      ${imgHTML(p)}
      <button class="prod-media-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"></button>
      <div class="prod-badges">${badgesHTML(p)}</div>
    </div>
    <div class="prod-body">
      <span class="prod-cartela">N.º ${numero(p)} · ${esc(catLabel(p.cat))}</span>
      <h3 class="prod-name"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <div class="prod-price">${precioHTML(p)}</div>
      <span class="prod-talles">${esc(tallesTexto(p))}</span>
      <div class="prod-actions">
        ${stepperHTML(Math.max(1, p.stock))}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}"${agotado ? " disabled" : ` aria-label="${variante ? "Elegir talle de" : "Agregar"} ${esc(p.nombre)}${variante ? "" : " al carrito"}"`}><span class="add-largo" aria-hidden="true">${etiqueta}</span><span class="add-corto" aria-hidden="true">${corta}</span></button>
      </div>
      ${agotado ? `<a class="prod-buy" href="${mensajeProducto(p)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>` : `<button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function mosaicoHTML(p, i) {
  return `<div class="mos-item${i === 0 ? " mos-item--xl" : ""}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <button class="mos-btn" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
      <span class="mos-img">${imgHTML(p)}</span>
      <span class="mos-cartela"><small>N.º ${numero(p)}</small><strong>${esc(p.nombre)}</strong><span class="precio">${formatearPrecio(precioFinal(p))}</span></span>
    </button>
  </div>`;
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
  if (typeof ScrollTrigger !== "undefined") requestAnimationFrame(() => ScrollTrigger.refresh());
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
  const f = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
    body.innerHTML = `<div class="cart-vacio"><span class="cartela-vacia">N.º 000</span><strong>Tu carrito está vacío</strong><p class="muted">Mirá la tienda y sumá lo que te guste: ropa, carteras, accesorios o algo para regalar.</p><button type="button" class="btn btn--linea" data-ir-catalogo>Ver la tienda</button></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = lineas
    .map(
      (l) => `<div class="cart-line" data-line-id="${esc(l.id)}" data-line-talle="${esc(l.talle)}">
    <div class="cart-line-img">${imgHTML(l.producto)}</div>
    <div class="cart-line-info">
      <strong>${esc(l.producto.nombre)}</strong>
      <small>${l.talle ? `Talle ${esc(l.talle)} · ` : ""}${formatearPrecio(l.unitario)} c/u</small>
      ${stepperHTML(Math.max(1, l.producto.stock), `data-cart-id="${esc(l.id)}" data-cart-talle="${esc(l.talle)}"`, l.qty)}
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
    <p class="drawer-nota">La entrega o el retiro se coordinan por WhatsApp.</p>`;
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
  if (document.getElementById("modal-backdrop")?.hidden !== false) document.body.classList.remove("no-scroll");
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
      Cart.setQty(st.dataset.cartId, st.dataset.cartTalle, nuevo);
      const linea = Cart.lineas().find((l) => l.id === st.dataset.cartId && l.talle === st.dataset.cartTalle);
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
      const fila = del.closest(".cart-line");
      Cart.remove(fila.dataset.lineId, fila.dataset.lineTalle);
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
let talleElegido = "";
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
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: base + "?producto=" + p.id,
    },
  });
}

function abrirModal(id, opciones = {}) {
  const p = ProductosAPI.get(id);
  const bd = document.getElementById("modal-backdrop");
  const m = document.getElementById("modal");
  if (!p || !bd || !m) return;
  if (bd.hidden) ultimoFocoModal = document.activeElement;
  talleElegido = conTalle(p) && p.talles.length === 1 ? p.talles[0] : "";
  const agotado = p.stock <= 0;
  const rel = ProductosAPI.relacionados(p.id, 3);
  const qty = Math.max(1, Math.min(Number(opciones.qty) || 1, Math.max(1, p.stock)));
  m.innerHTML = `<button class="modal-close" type="button" data-close-modal aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-media">${imgHTML(p)}<div class="prod-badges">${badgesHTML(p)}</div></div>
    <div class="modal-info">
      <span class="prod-cartela">N.º ${numero(p)} · ${esc(catLabel(p.cat))}</span>
      <h2>${esc(p.nombre)}</h2>
      <div class="prod-price">${precioHTML(p)}</div>
      <p class="modal-desc">${esc(p.desc)}</p>
      ${conTalle(p) ? `<div class="talles" data-talles><span class="talles-label">Talle <em data-talle-aviso hidden>Elegí uno para seguir</em></span><div class="talles-lista">${p.talles.map((t) => `<button type="button" data-talle="${esc(t)}" aria-pressed="${t === talleElegido ? "true" : "false"}">${esc(t)}</button>`).join("")}</div></div>` : `<span class="prod-talles">Talle único</span>`}
      <div class="modal-actions">
        ${stepperHTML(Math.max(1, p.stock), "data-modal-stepper", qty)}
        <button type="button" class="btn btn--cta" data-modal-add${agotado ? " disabled" : ""}>${agotado ? "Sin stock" : "Agregar al carrito"}</button>
        ${agotado ? "" : '<button type="button" class="btn btn--tinta" data-modal-buy>Comprar ahora</button>'}
      </div>
      <a class="link-mas" href="${mensajeProducto(p)}" target="_blank" rel="noopener" data-modal-wsp>${agotado ? "Avisame cuando vuelva" : "Consultar por WhatsApp"}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      ${rel.length ? `<div class="modal-rel"><span>También te puede gustar</span><div class="rel-grid">${rel.map((r) => `<button type="button" class="rel-item" data-quick="${esc(r.id)}"><span class="rel-img">${imgHTML(r)}</span><strong>${esc(r.nombre)}</strong><small>${formatearPrecio(precioFinal(r))}</small></button>`).join("")}</div></div>` : ""}
    </div>`;
  m.dataset.id = p.id;
  m.dataset.compra = opciones.comprar ? "1" : "";
  bd.hidden = false;
  document.body.classList.add("no-scroll");
  m.scrollTop = 0;
  inyectarLdProducto(p);
  if (opciones.pedirTalle) m.querySelector("[data-talles] button")?.focus();
  else m.querySelector("[data-close-modal]")?.focus();
}

function cerrarModal() {
  const bd = document.getElementById("modal-backdrop");
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  if (!document.getElementById("cart-drawer")?.classList.contains("open")) document.body.classList.remove("no-scroll");
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
    const t = e.target.closest("[data-talle]");
    if (t) {
      talleElegido = t.dataset.talle;
      m.querySelectorAll("[data-talle]").forEach((b) => b.setAttribute("aria-pressed", b === t ? "true" : "false"));
      const aviso = m.querySelector("[data-talle-aviso]");
      if (aviso) aviso.hidden = true;
      const p = ProductosAPI.get(m.dataset.id);
      const wsp = m.querySelector("[data-modal-wsp]");
      if (p && wsp && p.stock > 0) wsp.href = mensajeProducto(p, talleElegido);
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
    const add = e.target.closest("[data-modal-add]");
    const buy = e.target.closest("[data-modal-buy]");
    if (add || buy) {
      const p = ProductosAPI.get(m.dataset.id);
      if (!p) return;
      if (conTalle(p) && !talleElegido) {
        const aviso = m.querySelector("[data-talle-aviso]");
        if (aviso) aviso.hidden = false;
        const lista = m.querySelector(".talles-lista");
        lista?.classList.remove("avisa");
        void lista?.offsetWidth;
        lista?.classList.add("avisa");
        m.querySelector("[data-talles] button")?.focus();
        return;
      }
      const qty = Number(m.querySelector("[data-modal-stepper] output")?.textContent) || 1;
      if (!Cart.add(p, qty, talleElegido)) {
        showToast("No queda más stock de ese producto.");
        return;
      }
      if (buy || m.dataset.compra === "1") {
        cerrarModal();
        openCartDrawer();
      } else showToast(`${p.nombre}${talleElegido ? ` (talle ${talleElegido})` : ""}: agregado al carrito.`);
    }
  });
}

const catalogo = { cat: [], talle: [], precio: [], stock: false, q: "", orden: "destacados", cursor: 0, cargados: 0, total: 0 };

function leerFiltros() {
  const marcados = (f) => [...document.querySelectorAll(`input[data-f="${f}"]:checked`)].map((i) => i.value);
  catalogo.cat = marcados("cat");
  catalogo.talle = [...new Set(marcados("talle"))];
  catalogo.precio = marcados("precio");
  catalogo.stock = marcados("stock").length > 0;
}

function textoConteo() {
  const { total, q, cat, talle } = catalogo;
  if (total === 0) return q ? `Sin resultados para «${q}»` : "No hay productos con esos filtros";
  const n = total === 1 ? "1 producto" : `${total} productos`;
  if (q) return `${n} para «${q}»`;
  if (cat.length === 1 && !talle.length) return `${n} en ${catLabel(cat[0])}`;
  if (talle.length === 1 && !cat.length) return `${n} en talle ${talle[0]}`;
  return n;
}

function sincronizarChips() {
  document.querySelectorAll("[data-cat-link]").forEach((el) => {
    el.classList.toggle("is-activa", catalogo.cat.length === 1 && catalogo.cat[0] === el.dataset.catLink && !catalogo.q);
  });
  document.querySelectorAll("[data-talle-link]").forEach((el) => {
    el.setAttribute("aria-pressed", catalogo.talle.includes(el.dataset.talleLink) ? "true" : "false");
  });
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
        talle: catalogo.talle,
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
    grid.innerHTML = `<div class="tienda-vacio"><strong>${esc(textoConteo())}</strong><p class="muted">Probá con otra palabra o sacá algún filtro. Si buscás algo en especial, escribinos.</p><div class="tienda-vacio-acciones"><button type="button" class="btn btn--linea" data-limpiar>Limpiar filtros</button><a class="btn btn--tinta" href="${wspLink(`Hola ${MARCA}, estoy buscando: ${catalogo.q || "un producto"}. ¿Lo tienen?`)}" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div></div>`;
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
  if (limpiar) limpiar.hidden = !(catalogo.cat.length || catalogo.talle.length || catalogo.precio.length || catalogo.stock || catalogo.q);
  sincronizarChips();
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
  const conteos = ProductosAPI.conteos();
  document.querySelectorAll("[data-fcount]").forEach((el) => {
    el.textContent = conteos[el.dataset.fcount] ?? 0;
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
    const link = e.target.closest("[data-cat-link]");
    if (link) {
      e.preventDefault();
      setFiltroUnico("cat", link.dataset.catLink);
      irATienda();
      return;
    }
    const tl = e.target.closest("[data-talle-link]");
    if (tl) {
      e.preventDefault();
      const ya = catalogo.talle.length === 1 && catalogo.talle[0] === tl.dataset.talleLink;
      if (ya) setFiltroUnico("talle", "__ninguno__");
      else setFiltroUnico("talle", tl.dataset.talleLink);
      if (tl.hasAttribute("data-ir")) irATienda();
    }
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
    if (!p) return;
    if (conTalle(p)) {
      abrirModal(p.id, { pedirTalle: true, qty, comprar: Boolean(btn.dataset.buy) });
      return;
    }
    if (!Cart.add(p, qty)) {
      showToast("No queda más stock de ese producto: escribinos y te avisamos.");
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
  cont.innerHTML =
    ProductosAPI.destacados(DESTACADOS_MAX - 1).map(mosaicoHTML).join("") +
    `<a class="mos-cta" href="#tienda" data-animate="subir" style="opacity:0;transform:translateY(40px)"><small>${PRODUCTOS.length} productos con su número</small><strong>Ver toda la tienda</strong><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`;
}

function initQuickView() {
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quick]");
    if (!q) return;
    e.preventDefault();
    abrirModal(q.dataset.quick);
  });
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

function initBuscarHeader() {
  document.querySelectorAll("[data-ir-buscar]").forEach((b) =>
    b.addEventListener("click", () => {
      irATienda();
      setTimeout(() => document.querySelector("#tienda [data-busca] input")?.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    }),
  );
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
  tl.from(hero.querySelectorAll(".hero-cartela, .hero-copy"), { y: 30, opacity: 0, duration: 1, clearProps: "transform,opacity" }, 0.1)
    .from(hero.querySelectorAll(".hero-eyebrow"), { y: 18, opacity: 0, duration: 0.9 }, 0.25)
    .from(hero.querySelectorAll("h1"), { y: 36, opacity: 0, duration: 1.2 }, 0.3)
    .from(hero.querySelectorAll(".hero-lead"), { y: 24, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll(".hero-ctas .btn"), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "transform,opacity" }, 0.62)
    .from(hero.querySelectorAll(".hero-chip, .hero-badge"), { scale: 0.92, opacity: 0, duration: 1, stagger: 0.05, clearProps: "transform,opacity" }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const foto = document.querySelector(".hero--vidriera [data-hero-img]");
  if (!foto) return;
  gsap.fromTo(foto, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: ".hero--vidriera", start: "top top", end: "bottom top", scrub: true } });
}

globalThis.encantarteLogic = () => ({
  PRODUCTOS, CATEGORIAS, ProductosAPI, Cart, filtrarColeccion, precioFinal, formatearPrecio, construirMensajeWsp, recibir, API_MAX, PAGE_SIZE,
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
  initBuscarHeader();
  initHeroMotion();
  initParallax();
}
