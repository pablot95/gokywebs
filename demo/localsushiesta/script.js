/* global getComputedStyle */
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const IMG = {
  nigiri: "images/nigiri-tradicional-1200x1200.webp",
  salmon: "images/roll-salmon-avocado-cheese-1200x1200.webp",
  langostinos: "images/roll-langostinos-tempura-1200x1200.webp",
  vegetariano: "images/roll-vegetariano-palta-1200x1200.webp",
  entrada: "images/langostinos-apanados-1200x1200.webp",
  combo: "images/combo-para-compartir-1200x1200.webp",
};

const CATEGORIAS = [
  {
    id: "rolls",
    nombre: "Rolls Especiales",
    desc: "Salmón, langostinos, palta y queso crema, combinados sin la fórmula de siempre.",
    img: IMG.salmon,
  },
  {
    id: "nigiri",
    nombre: "Nigiri y Tradicional",
    desc: "La base del sushi, sin vueltas: pescado justo sobre el arroz.",
    img: IMG.nigiri,
  },
  {
    id: "entradas",
    nombre: "Entradas",
    desc: "Para arrancar mientras se arma el resto de la mesa.",
    img: IMG.entrada,
  },
  {
    id: "vegetarianos",
    nombre: "Vegetarianos",
    desc: "Rolls sin pescado, pensados como plato principal, no como excepción.",
    img: IMG.vegetariano,
  },
  {
    id: "combos",
    nombre: "Combos para Compartir",
    desc: "Para mesas de dos, cuatro o más — se arman según cuántos son.",
    img: IMG.combo,
  },
];

const PRODUCTOS = [
  {
    id: "p01",
    slug: "rollo-salmon-clasico",
    nombre: "Salmón Roll Clásico",
    categoria: "rolls",
    proteina: "salmon",
    precio: 12900,
    descuento: 0,
    stock: 24,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.salmon,
    descripcion:
      "Salmón fresco, palta y queso crema en un roll de ocho piezas, el clásico que nunca falla.",
  },
  {
    id: "p02",
    slug: "philadelphia-roll",
    nombre: "Philadelphia Roll",
    categoria: "rolls",
    proteina: "salmon",
    precio: 13400,
    descuento: 0,
    stock: 20,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.salmon,
    descripcion:
      "Salmón curado, queso crema y ciboulette fresco, en piezas parejas y suaves.",
  },
  {
    id: "p03",
    slug: "spicy-salmon-roll",
    nombre: "Spicy Salmón Roll",
    categoria: "rolls",
    proteina: "salmon",
    precio: 13900,
    descuento: 0,
    stock: 18,
    destacado: true,
    nuevo: true,
    picante: true,
    vegetariano: false,
    img: IMG.salmon,
    descripcion:
      "Salmón picante con un toque de sriracha y cebollín — para los que piden fuerte.",
  },
  {
    id: "p04",
    slug: "salmon-crocante-roll",
    nombre: "Salmón Crocante Roll",
    categoria: "rolls",
    proteina: "salmon",
    precio: 14200,
    descuento: 10,
    stock: 16,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.salmon,
    descripcion:
      "Salmón, queso crema y un crocante de panko tostado por encima.",
  },
  {
    id: "p05",
    slug: "salmon-sesamo-negro-roll",
    nombre: "Salmón Roll con Sésamo Negro",
    categoria: "rolls",
    proteina: "salmon",
    precio: 13100,
    descuento: 0,
    stock: 22,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.salmon,
    descripcion: "Salmón y palta envueltos en arroz con sésamo negro tostado.",
  },
  {
    id: "p06",
    slug: "ebi-tempura-roll",
    nombre: "Ebi Tempura Roll",
    categoria: "rolls",
    proteina: "langostinos",
    precio: 13800,
    descuento: 0,
    stock: 20,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.langostinos,
    descripcion:
      "Langostinos tempura, palta y sésamo, con el crocante justo en cada bocado.",
  },
  {
    id: "p07",
    slug: "langostino-crocante-roll",
    nombre: "Langostino Crocante Roll",
    categoria: "rolls",
    proteina: "langostinos",
    precio: 13600,
    descuento: 0,
    stock: 18,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.langostinos,
    descripcion:
      "Langostinos apanados, queso crema y panko — textura crocante de punta a punta.",
  },
  {
    id: "p08",
    slug: "ebi-katsu-roll",
    nombre: "Ebi Katsu Roll",
    categoria: "rolls",
    proteina: "langostinos",
    precio: 14500,
    descuento: 0,
    stock: 14,
    destacado: false,
    nuevo: false,
    picante: true,
    vegetariano: false,
    img: IMG.langostinos,
    descripcion:
      "Langostinos empanizados con salsa acevichada y un toque de ciboulette.",
  },
  {
    id: "p09",
    slug: "langostino-palta-roll",
    nombre: "Langostino Tempura Roll con Palta",
    categoria: "rolls",
    proteina: "langostinos",
    precio: 13200,
    descuento: 0,
    stock: 20,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.langostinos,
    descripcion:
      "Langostino tempura, palta cremosa y queso crema en partes iguales.",
  },
  {
    id: "p10",
    slug: "roll-crocante-mixto",
    nombre: "Roll Crocante Mixto",
    categoria: "rolls",
    proteina: "mixto",
    precio: 15500,
    descuento: 15,
    stock: 12,
    destacado: false,
    nuevo: true,
    picante: false,
    vegetariano: false,
    img: IMG.langostinos,
    descripcion:
      "Langostinos tempura, salmón y queso crema, coronados con panko dorado.",
  },

  {
    id: "p11",
    slug: "nigiri-salmon-x2",
    nombre: "Nigiri de Salmón x2",
    categoria: "nigiri",
    proteina: "salmon",
    precio: 6800,
    descuento: 0,
    stock: 30,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion:
      "Dos piezas de salmón fresco sobre arroz — la base del sushi, sin vueltas.",
  },
  {
    id: "p12",
    slug: "nigiri-langostino-x2",
    nombre: "Nigiri de Langostino x2",
    categoria: "nigiri",
    proteina: "langostinos",
    precio: 7200,
    descuento: 0,
    stock: 25,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion: "Dos piezas de langostino cocido sobre arroz sazonado.",
  },
  {
    id: "p13",
    slug: "sashimi-salmon-x5",
    nombre: "Sashimi de Salmón x5 Cortes",
    categoria: "nigiri",
    proteina: "salmon",
    precio: 9800,
    descuento: 0,
    stock: 3,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion: "Cinco cortes de salmón fresco, sin arroz — directo al grano.",
  },
  {
    id: "p14",
    slug: "tabla-nigiri-surtido-x8",
    nombre: "Tabla de Nigiri Surtido x8",
    categoria: "nigiri",
    proteina: "variado",
    precio: 16900,
    descuento: 0,
    stock: 15,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion:
      "Ocho piezas surtidas entre salmón, langostino y omelette — para probar de todo.",
  },
  {
    id: "p15",
    slug: "gunkan-salmon-flambeado",
    nombre: "Gunkan de Salmón Flambeado x2",
    categoria: "nigiri",
    proteina: "salmon",
    precio: 8600,
    descuento: 0,
    stock: 0,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion:
      "Dos piezas de salmón flambeado, con el borde justo entre crudo y tostado.",
  },
  {
    id: "p16",
    slug: "uramaki-clasico-salmon",
    nombre: "Uramaki Clásico de Salmón",
    categoria: "nigiri",
    proteina: "salmon",
    precio: 12400,
    descuento: 0,
    stock: 18,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.nigiri,
    descripcion:
      "Arroz por fuera, salmón y palta adentro — el uramaki de siempre.",
  },

  {
    id: "p17",
    slug: "langostinos-apanados-x6",
    nombre: "Langostinos Apanados x6",
    categoria: "entradas",
    proteina: "langostinos",
    precio: 8200,
    descuento: 0,
    stock: 20,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.entrada,
    descripcion:
      "Seis langostinos rebozados y fritos, servidos con salsa para acompañar.",
  },
  {
    id: "p18",
    slug: "langostinos-panko-acevichada",
    nombre: "Langostinos al Panko con Salsa Acevichada",
    categoria: "entradas",
    proteina: "langostinos",
    precio: 8900,
    descuento: 0,
    stock: 16,
    destacado: false,
    nuevo: false,
    picante: true,
    vegetariano: false,
    img: IMG.entrada,
    descripcion:
      "Langostinos crocantes bañados en una salsa acevichada con punch.",
  },
  {
    id: "p19",
    slug: "bastones-queso-crema-apanados",
    nombre: "Bastones de Queso Crema Apanados x8",
    categoria: "entradas",
    proteina: "vegetariano",
    precio: 6900,
    descuento: 0,
    stock: 20,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.entrada,
    descripcion:
      "Queso crema apanado y frito, crocante afuera y cremoso adentro.",
  },
  {
    id: "p20",
    slug: "tempura-mixta-langostinos-vegetales",
    nombre: "Tempura Mixta de Langostinos y Vegetales x8",
    categoria: "entradas",
    proteina: "langostinos",
    precio: 8700,
    descuento: 0,
    stock: 14,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.entrada,
    descripcion: "Langostinos y vegetales de estación en tempura liviana.",
  },

  {
    id: "p21",
    slug: "roll-palta-queso-crema",
    nombre: "Roll de Palta y Queso Crema",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 10900,
    descuento: 0,
    stock: 22,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion:
      "Palta madura y queso crema, sin pescado — plato principal, no relleno de sobra.",
  },
  {
    id: "p22",
    slug: "roll-vegetales-salteados",
    nombre: "Roll de Vegetales Salteados",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 10500,
    descuento: 0,
    stock: 18,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion:
      "Morrón, zanahoria y cebolla de verdeo salteados, con un toque de sésamo.",
  },
  {
    id: "p23",
    slug: "roll-palta-picante",
    nombre: "Roll de Palta Picante",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 11200,
    descuento: 0,
    stock: 16,
    destacado: false,
    nuevo: false,
    picante: true,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion: "Palta cremosa con un golpe de sriracha — picante de verdad.",
  },
  {
    id: "p24",
    slug: "uramaki-vegetariano",
    nombre: "Uramaki Vegetariano",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 11800,
    descuento: 0,
    stock: 14,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion:
      "Palta, pepino y zanahoria, arroz por fuera con sésamo tostado.",
  },
  {
    id: "p25",
    slug: "roll-palta-pepino-fresco",
    nombre: "Roll de Palta y Pepino Fresco",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 10200,
    descuento: 0,
    stock: 20,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion:
      "La combinación más simple: palta, pepino y arroz, sin nada de más.",
  },
  {
    id: "p26",
    slug: "uramaki-vegetales-grillados",
    nombre: "Uramaki de Vegetales Grillados",
    categoria: "vegetarianos",
    proteina: "vegetariano",
    precio: 11600,
    descuento: 0,
    stock: 10,
    destacado: false,
    nuevo: true,
    picante: false,
    vegetariano: true,
    img: IMG.vegetariano,
    descripcion:
      "Berenjena, morrón y zucchini grillados, envueltos en arroz con sésamo.",
  },

  {
    id: "p27",
    slug: "combo-duo",
    nombre: "Combo Dúo (16 piezas)",
    categoria: "combos",
    proteina: "variado",
    precio: 24500,
    descuento: 0,
    stock: 15,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.combo,
    descripcion:
      "Dieciséis piezas entre rolls de salmón y langostino, pensado para dos.",
  },
  {
    id: "p28",
    slug: "combo-family",
    nombre: "Combo Family (32 piezas)",
    categoria: "combos",
    proteina: "variado",
    precio: 45800,
    descuento: 10,
    stock: 10,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.combo,
    descripcion:
      "Treinta y dos piezas variadas — la mesa entera cubierta sin repetir.",
  },
  {
    id: "p29",
    slug: "combo-vegetariano-x2",
    nombre: "Combo Vegetariano para 2 (20 piezas)",
    categoria: "combos",
    proteina: "vegetariano",
    precio: 27500,
    descuento: 10,
    stock: 12,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: true,
    img: IMG.combo,
    descripcion:
      "Veinte piezas sin pescado, todas a base de palta y vegetales.",
  },
  {
    id: "p30",
    slug: "combo-localsushiesta",
    nombre: "Combo LocalSushiEsta (40 piezas)",
    categoria: "combos",
    proteina: "variado",
    precio: 54900,
    descuento: 15,
    stock: 8,
    destacado: true,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.combo,
    descripcion:
      "La selección completa de la casa: salmón, langostinos, palta y queso crema en 40 piezas.",
  },
  {
    id: "p31",
    slug: "combo-entradas-rolls",
    nombre: "Combo Entradas + Rolls",
    categoria: "combos",
    proteina: "variado",
    precio: 29800,
    descuento: 0,
    stock: 14,
    destacado: false,
    nuevo: false,
    picante: false,
    vegetariano: false,
    img: IMG.combo,
    descripcion:
      "Langostinos apanados de entrada más veinte piezas de rolls surtidos.",
  },
  {
    id: "p32",
    slug: "combo-nigiri-premium",
    nombre: "Combo Nigiri Premium (24 piezas)",
    categoria: "combos",
    proteina: "variado",
    precio: 38500,
    descuento: 0,
    stock: 9,
    destacado: false,
    nuevo: true,
    picante: false,
    vegetariano: false,
    img: IMG.combo,
    descripcion:
      "Veinticuatro piezas de nigiri surtido, para los que van directo al pescado.",
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
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);
const catNombre = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre || "";
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const Cart = {
  KEY: "localsushiesta_cart",
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (existing)
      existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else
      items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
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
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  },
};

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

function getBadges(p) {
  const badges = [];
  if (p.stock === 0)
    badges.push('<span class="badge badge-agotado">Agotado</span>');
  else if (p.stock <= 3)
    badges.push('<span class="badge badge-last">Últimas unidades</span>');
  if (p.descuento > 0)
    badges.push(`<span class="badge badge-off">-${p.descuento}%</span>`);
  if (p.nuevo) badges.push('<span class="badge badge-nuevo">Nuevo</span>');
  return badges.join("");
}

function priceHTML(p) {
  const pf = precioFinal(p);
  return p.descuento > 0
    ? `<span class="price-now">${formatearPrecio(pf)}</span><s class="price-old">${formatearPrecio(p.precio)}</s>`
    : `<span class="price-now">${formatearPrecio(pf)}</span>`;
}

function cardHTML(p) {
  const agotado = p.stock === 0;
  return `
  <article class="prod-card${agotado ? " is-agotado" : ""}" data-id="${p.id}" data-animate="up" style="transform:translateY(28px);opacity:0">
    <button type="button" class="prod-media" data-quickview="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="600" height="600" loading="lazy">
      <span class="prod-badges">${getBadges(p)}</span>
    </button>
    <div class="prod-info">
      <p class="prod-cat">${esc(catNombre(p.categoria))}</p>
      <h3 class="prod-name"><button type="button" data-quickview="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">${priceHTML(p)}</p>
      <div class="prod-actions">
        <div class="qty-stepper" data-qty="1">
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}"${agotado ? " disabled" : ""}>${agotado ? "Agotado" : "Agregar"}</button>
      </div>
      <button type="button" class="btn-buy-desktop" data-buy="${p.id}"${agotado ? " disabled" : ""}>Comprar ahora</button>
    </div>
  </article>`;
}

function cintaCardHTML(p) {
  return `
  <article class="cinta-card" data-id="${p.id}">
    <button type="button" class="cinta-plate" data-quickview="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="360" height="360" loading="lazy">
    </button>
    <p class="cinta-name">${esc(p.nombre)}</p>
    <p class="cinta-price">${formatearPrecio(precioFinal(p))}</p>
    <button type="button" class="cinta-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
    </button>
  </article>`;
}

function catCardHTML(c) {
  return `
  <a href="#tienda" class="cat-card" data-cat-jump="${c.id}" data-animate="up" style="transform:translateY(26px);opacity:0">
    <div class="cat-media"><img src="${c.img}" alt="${esc(c.nombre)}" width="400" height="500" loading="lazy"></div>
    <div class="cat-label"><p class="cat-name">${esc(c.nombre)}</p><p class="cat-desc">${esc(c.desc)}</p></div>
  </a>`;
}

const filtros = {
  categoria: "todas",
  proteina: "todas",
  vegetariano: false,
  picante: false,
  precio: "todos",
  q: "",
};
let visibleCount = 16;
const PAGE_SIZE = 16;

function getFiltered() {
  return PRODUCTOS.filter((p) => {
    if (filtros.categoria !== "todas" && p.categoria !== filtros.categoria)
      return false;
    if (filtros.proteina !== "todas" && p.proteina !== filtros.proteina)
      return false;
    if (filtros.vegetariano && !p.vegetariano) return false;
    if (filtros.picante && !p.picante) return false;
    if (filtros.precio !== "todos") {
      const [min, max] = filtros.precio.split("-").map(Number);
      const pf = precioFinal(p);
      if (pf < min || pf > max) return false;
    }
    if (filtros.q) {
      const haystack = normalize(
        `${p.nombre} ${catNombre(p.categoria)} ${p.proteina} ${p.descripcion}`,
      );
      if (!haystack.includes(normalize(filtros.q))) return false;
    }
    return true;
  });
}

let revealsListos = false;

function renderCatalogo({ resetPage = false } = {}) {
  if (resetPage) visibleCount = PAGE_SIZE;
  const grid = document.getElementById("catalogoGrid");
  const empty = document.getElementById("catalogoEmpty");
  const verMas = document.getElementById("verMasBtn");
  const count = document.getElementById("resultadosCount");
  const filtered = getFiltered();
  const visible = filtered.slice(0, visibleCount);

  grid.innerHTML = visible.map(cardHTML).join("");
  empty.hidden = filtered.length !== 0;
  verMas.hidden = visibleCount >= filtered.length;
  count.textContent =
    filtered.length === 0
      ? ""
      : `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

function renderCinta() {
  const track = document.getElementById("cintaTrack");
  if (!track) return;
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  track.innerHTML = destacados.map(cintaCardHTML).join("");
}

function renderCategorias() {
  const grid = document.getElementById("catGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(catCardHTML).join("");
  revelarNuevos(grid);
}

function jumpToCategoria(catId) {
  filtros.categoria = catId;
  syncChipUI("categoria", catId);
  renderCatalogo({ resetPage: true });
  document
    .getElementById("tienda")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function syncChipUI(group, value) {
  document
    .querySelectorAll(`[data-filter-group="${group}"] .chip`)
    .forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.value === value);
    });
}

function initFiltroChips() {
  const catWrap = document.getElementById("filtroCategoria");
  CATEGORIAS.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.value = c.id;
    b.textContent = c.nombre;
    catWrap.appendChild(b);
  });
  const proteinas = [
    { id: "salmon", label: "Salmón" },
    { id: "langostinos", label: "Langostinos" },
    { id: "vegetariano", label: "Vegetariano" },
    { id: "variado", label: "Variado" },
  ];
  const protWrap = document.getElementById("filtroProteina");
  proteinas.forEach((pr) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.value = pr.id;
    b.textContent = pr.label;
    protWrap.appendChild(b);
  });
  document.querySelectorAll(".filtro-group").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const groupName = group.dataset.filterGroup;
      filtros[groupName] = chip.dataset.value;
      syncChipUI(groupName, chip.dataset.value);
      renderCatalogo({ resetPage: true });
    });
  });
}

function initFiltrosControles() {
  document
    .getElementById("filtroVegetariano")
    .addEventListener("change", (e) => {
      filtros.vegetariano = e.target.checked;
      renderCatalogo({ resetPage: true });
    });
  document.getElementById("filtroPicante").addEventListener("change", (e) => {
    filtros.picante = e.target.checked;
    renderCatalogo({ resetPage: true });
  });
  document.getElementById("filtroPrecio").addEventListener("change", (e) => {
    filtros.precio = e.target.value;
    renderCatalogo({ resetPage: true });
  });
  const limpiar = () => {
    filtros.categoria = "todas";
    filtros.proteina = "todas";
    filtros.vegetariano = false;
    filtros.picante = false;
    filtros.precio = "todos";
    filtros.q = "";
    syncChipUI("categoria", "todas");
    syncChipUI("proteina", "todas");
    document.getElementById("filtroVegetariano").checked = false;
    document.getElementById("filtroPicante").checked = false;
    document.getElementById("filtroPrecio").value = "todos";
    document.getElementById("searchInput").value = "";
    renderCatalogo({ resetPage: true });
  };
  document.getElementById("limpiarFiltros").addEventListener("click", limpiar);
  document
    .getElementById("limpiarFiltrosEmpty")
    .addEventListener("click", limpiar);
  document.getElementById("verMasBtn").addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    renderCatalogo();
  });
}

function wireSearch() {
  const input = document.getElementById("searchInput");
  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      filtros.q = input.value;
      renderCatalogo({ resetPage: true });
    }, 180);
  });
}

function initSearchToggle() {
  document.getElementById("searchToggle")?.addEventListener("click", () => {
    document
      .getElementById("tienda")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("searchInput")?.focus(), 450);
  });
}

document.addEventListener("click", (e) => {
  const jumpEl = e.target.closest("[data-cat-jump]");
  if (jumpEl) {
    e.preventDefault();
    jumpToCategoria(jumpEl.dataset.catJump);
  }
});

function wireQtyDelegation(container) {
  container.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-step]");
    if (!stepBtn) return;
    const stepper = stepBtn.closest(".qty-stepper");
    const span = stepper.querySelector("span");
    const p = getProducto(stepper.closest("[data-id]")?.dataset.id);
    const max = p?.stock > 0 ? p.stock : 99;
    let val =
      parseInt(span.textContent, 10) + parseInt(stepBtn.dataset.step, 10);
    val = Math.max(1, Math.min(val, max));
    span.textContent = val;
  });
}

function wireAddBuyDelegation(container) {
  container.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    const buyBtn = e.target.closest("[data-buy]");
    const qvBtn = e.target.closest("[data-quickview]");
    if (addBtn) {
      const p = getProducto(addBtn.dataset.add);
      if (!p || p.stock === 0) return;
      const card = addBtn.closest("[data-id]");
      const qtyEl = card?.querySelector(".qty-stepper span");
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      Cart.add(p, qty);
      showToast("¡Directo a la cinta! Se sumó a tu carrito.");
    } else if (buyBtn) {
      const p = getProducto(buyBtn.dataset.buy);
      if (!p || p.stock === 0) return;
      const card = buyBtn.closest("[data-id]");
      const qtyEl = card?.querySelector(".qty-stepper span");
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      Cart.add(p, qty);
      openCartDrawer();
    } else if (qvBtn) {
      openModal(qvBtn.dataset.quickview);
    }
  });
}

function revelarNuevos(container) {
  if (!revealsListos) return;
  requestAnimationFrame(() => {
    container.querySelectorAll("[data-animate]:not(.in)").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.5)}s`;
      requestAnimationFrame(() => el.classList.add("in"));
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  items.forEach((el) => {
    if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`;
  });
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    revealsListos = true;
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
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
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add("in");
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
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
  revealsListos = true;
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

function initCintaRail() {
  const vp = document.getElementById("cintaRail");
  if (!vp) return;
  vp.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = vp.scrollWidth - vp.clientWidth;
      if (max <= 1) return;
      const atStart = vp.scrollLeft <= 0,
        atEnd = vp.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      vp.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
  initRailDrag(vp);

  const prev = document.getElementById("cintaPrev");
  const next = document.getElementById("cintaNext");
  const track = document.getElementById("cintaTrack");
  const syncArrows = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev.addEventListener("click", () =>
    vp.scrollBy({ left: -420, behavior: "smooth" }),
  );
  next.addEventListener("click", () =>
    vp.scrollBy({ left: 420, behavior: "smooth" }),
  );
  vp.addEventListener("scroll", syncArrows, { passive: true });
  window.addEventListener("resize", syncArrows, { passive: true });
  setTimeout(syncArrows, 300);
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
  document
    .getElementById("cart-header")
    ?.addEventListener("click", openCartDrawer);
  sync();
}

function renderCartDrawer() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const items = Cart.get();
  if (!items.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <p>Tu cinta todavía no tiene nada arriba.</p>
        <p>¿Empezamos con un roll?</p>
        <a href="#tienda" class="btn btn-primary" id="cartEmptyGo">Ver el menú</a>
      </div>`;
    document
      .getElementById("cartEmptyGo")
      ?.addEventListener("click", closeCartDrawer);
  } else {
    wrap.innerHTML = items
      .map((i) => {
        const p = getProducto(i.id);
        if (!p) return "";
        return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="68" height="68" loading="lazy"></div>
        <div>
          <p class="cart-item-name">${esc(p.nombre)}</p>
          <p class="cart-item-price">${formatearPrecio(precioFinal(p))} c/u</p>
        </div>
        <div class="cart-item-right">
          <div class="qty-stepper">
            <button type="button" data-cart-step="-1" aria-label="Restar cantidad">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-cart-remove>Quitar</button>
        </div>
      </div>`;
      })
      .join("");
  }
  totalEl.textContent = formatearPrecio(Cart.total());
}

function initCartDrawerEvents() {
  const wrap = document.getElementById("cartItems");
  wrap.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-cart-step]");
    const removeBtn = e.target.closest("[data-cart-remove]");
    const row = e.target.closest(".cart-item");
    if (!row) return;
    const id = row.dataset.id;
    if (stepBtn) {
      const items = Cart.get();
      const it = items.find((i) => i.id === id);
      if (it) Cart.setQty(id, it.qty + parseInt(stepBtn.dataset.cartStep, 10));
      if (
        Cart.get().find((i) => i.id === id)?.qty === it?.qty &&
        parseInt(stepBtn.dataset.cartStep, 10) < 0 &&
        it?.qty === 1
      ) {
        /* mantiene mínimo 1, no elimina automáticamente */
      }
    } else if (removeBtn) {
      Cart.remove(id);
    }
  });
  document.getElementById("cartCheckout").addEventListener("click", () => {
    if (!Cart.count()) {
      showToast("Tu carrito está vacío por ahora.");
      return;
    }
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
}

function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").removeAttribute("inert");
  document.getElementById("cartBackdrop").classList.add("open");
  document.body.classList.add("no-scroll", "drawer-open");
  window.lenis?.stop?.();
}
function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("inert", "");
  document.getElementById("cartBackdrop").classList.remove("open");
  document.body.classList.remove("no-scroll", "drawer-open");
  window.lenis?.start?.();
}

function initCartDrawerToggle() {
  document
    .getElementById("cartClose")
    .addEventListener("click", closeCartDrawer);
  document
    .getElementById("cartBackdrop")
    .addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("cartDrawer").classList.contains("open")
    )
      closeCartDrawer();
  });
  document.addEventListener("cart:updated", renderCartDrawer);
  renderCartDrawer();
}

let modalCurrentId = null;

function openModal(id) {
  const p = getProducto(id);
  if (!p) return;
  modalCurrentId = id;
  document.getElementById("modalImg").src = p.img;
  document.getElementById("modalImg").alt = p.nombre;
  document.getElementById("modalBadges").innerHTML = getBadges(p);
  document.getElementById("modalCat").textContent = catNombre(p.categoria);
  document.getElementById("modalTitle").textContent = p.nombre;
  document.getElementById("modalPrice").innerHTML = priceHTML(p);
  document.getElementById("modalDesc").textContent = p.descripcion;
  document.getElementById("modalQty").textContent = "1";
  const agotado = p.stock === 0;
  document.getElementById("modalAdd").disabled = agotado;
  document.getElementById("modalAdd").textContent = agotado
    ? "Agotado"
    : "Agregar al carrito";
  document.getElementById("modalBuy").disabled = agotado;

  const relacionados = PRODUCTOS.filter(
    (x) => x.categoria === p.categoria && x.id !== p.id,
  ).slice(0, 3);
  const relWrap = document.getElementById("modalRelacionados");
  const relGrid = document.getElementById("modalRelacionadosGrid");
  if (relacionados.length) {
    relWrap.hidden = false;
    relGrid.innerHTML = relacionados
      .map(
        (r) => `
      <button type="button" class="modal-rel-card" data-quickview="${r.id}">
        <div class="modal-rel-media"><img src="${r.img}" alt="${esc(r.nombre)}" width="200" height="200" loading="lazy"></div>
        <p class="modal-rel-name">${esc(r.nombre)}</p>
        <p class="modal-rel-price">${formatearPrecio(precioFinal(r))}</p>
      </button>`,
      )
      .join("");
  } else {
    relWrap.hidden = true;
  }

  injectProductJsonLd(p);

  const overlay = document.getElementById("modalOverlay");
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("open"));
  document.getElementById("productModal").removeAttribute("inert");
  document.body.classList.add("no-scroll", "modal-open");
  window.lenis?.stop?.();
  document.getElementById("modalClose").focus();
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("open");
  document.getElementById("productModal").setAttribute("inert", "");
  document.body.classList.remove("no-scroll", "modal-open");
  window.lenis?.start?.();
  setTimeout(() => {
    overlay.hidden = true;
  }, 320);
}

function injectProductJsonLd(p) {
  let tag = document.getElementById("productJsonLd");
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "productJsonLd";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    image:
      location.origin + location.pathname.replace(/index\.html$/, "") + p.img,
    description: p.descripcion,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  });
}

function initModalEvents() {
  const overlay = document.getElementById("modalOverlay");
  document.getElementById("modalClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  document.getElementById("modalQtyStepper").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    const p = getProducto(modalCurrentId);
    const max = p?.stock > 0 ? p.stock : 99;
    const span = document.getElementById("modalQty");
    let val = parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10);
    val = Math.max(1, Math.min(val, max));
    span.textContent = val;
  });

  document.getElementById("modalAdd").addEventListener("click", () => {
    const p = getProducto(modalCurrentId);
    if (!p || p.stock === 0) return;
    const qty = parseInt(document.getElementById("modalQty").textContent, 10);
    Cart.add(p, qty);
    showToast("¡Directo a la cinta! Se sumó a tu carrito.");
  });
  document.getElementById("modalBuy").addEventListener("click", () => {
    const p = getProducto(modalCurrentId);
    if (!p || p.stock === 0) return;
    const qty = parseInt(document.getElementById("modalQty").textContent, 10);
    Cart.add(p, qty);
    closeModal();
    setTimeout(openCartDrawer, 260);
  });
  document
    .getElementById("modalRelacionadosGrid")
    .addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quickview]");
      if (btn) openModal(btn.dataset.quickview);
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
    document.body.appendChild(bd);
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

function initCorte() {
  const stage = document.getElementById("corteStage");
  const pasos = document.querySelectorAll(".corte-pasos .paso");
  if (!stage) return;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    document
      .querySelectorAll(
        ".corte .capa-nori, .corte .capa-arroz, .corte .capa-relleno, .corte #cuchillaGroup, .corte #piezasGroup",
      )
      .forEach((el) => {
        el.style.opacity = 1;
      });
    pasos.forEach((p) => p.classList.add("is-on"));
    return;
  }

  const setStep = (progress) => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle("is-on", i === idx));
  };

  gsap.set(["#piezaA", "#piezaB", "#piezaC"], {
    x: 200,
    y: 200,
    scale: 0,
    transformOrigin: "50% 50%",
  });
  gsap.set(".capa-relleno", { y: 14 });

  if (reduceMotion) {
    gsap.set(".capa-nori, .capa-arroz", { opacity: 1, scale: 1 });
    gsap.set(".capa-relleno", { opacity: 1, y: 0 });
    pasos.forEach((p) => p.classList.add("is-on"));
    return;
  }

  function buildTimeline(stVars) {
    const tl = gsap.timeline({
      scrollTrigger: { ...stVars, onUpdate: (self) => setStep(self.progress) },
    });
    tl.to(
      ".capa-nori",
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
      0,
    )
      .to(
        ".capa-arroz",
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        0.9,
      )
      .to(
        ".capa-relleno",
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        1.9,
      )
      .to("#rolloGroup", { scale: 1.05, duration: 0.3 }, 2.75)
      .to("#rolloGroup", { scale: 1, duration: 0.3 }, 3.05)
      .to("#cuchillaGroup", { opacity: 1, duration: 0.12 }, 3.5)
      .fromTo(
        "#cuchillaGroup",
        { x: -420 },
        { x: 420, duration: 0.7, ease: "power2.inOut" },
        3.5,
      )
      .to("#cuchillaGroup", { opacity: 0, duration: 0.15 }, 4.15)
      .to("#rolloGroup", { opacity: 0.16, scale: 0.86, duration: 0.45 }, 4.2)
      .to("#piezasGroup", { opacity: 1, duration: 0.1 }, 4.25)
      .to(
        "#piezaA",
        {
          x: 126,
          y: 198,
          scale: 1,
          rotation: -8,
          duration: 0.55,
          ease: "back.out(1.6)",
        },
        4.3,
      )
      .to(
        "#piezaB",
        {
          x: 200,
          y: 214,
          scale: 1,
          rotation: 4,
          duration: 0.55,
          ease: "back.out(1.6)",
        },
        4.3,
      )
      .to(
        "#piezaC",
        {
          x: 274,
          y: 198,
          scale: 1,
          rotation: 10,
          duration: 0.55,
          ease: "back.out(1.6)",
        },
        4.3,
      );
    return tl;
  }

  ScrollTrigger.matchMedia({
    "(min-width: 1081px)": () => {
      buildTimeline({
        trigger: stage,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    },
    "(max-width: 1080px)": () => {
      stage.classList.add("is-sticky-mobile");
      const tl = buildTimeline({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        stage.classList.remove("is-sticky-mobile");
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
  });
}

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

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === "undefined") {
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
}
if (typeof ScrollTrigger !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

renderCinta();
renderCategorias();
initFiltroChips();
renderCatalogo({ resetPage: true });
initFiltrosControles();
wireSearch();
initSearchToggle();
wireQtyDelegation(document.getElementById("cintaTrack"));
wireAddBuyDelegation(document.getElementById("cintaTrack"));
wireQtyDelegation(document.getElementById("catalogoGrid"));
wireAddBuyDelegation(document.getElementById("catalogoGrid"));
initCintaRail();
initNav();
initReveals();
initFloats();
updateCartBadge();
document.addEventListener("cart:updated", updateCartBadge);
initCartDrawerToggle();
initCartDrawerEvents();
initModalEvents();
initCorte();
