"use strict";
/* global Flip, getComputedStyle, setInterval, clearInterval */

const WHATSAPP_NUMBER = "5491123084440";
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const CATEGORIAS = [
  {
    id: "almacen",
    nombre: "Almacén",
    img: "images/almacen-16x9.webp",
    desc: "Fideos, arroz, aceites, conservas y todo lo de la despensa de siempre.",
  },
  {
    id: "lacteos",
    nombre: "Lácteos",
    img: "images/lacteos-9x16.webp",
    desc: "Leche, quesos, yogures y manteca, de la heladera a tu mesa.",
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    img: "images/bebidas-1x1.webp",
    desc: "Gaseosas, aguas, jugos, cervezas y vinos bien fríos.",
  },
  {
    id: "perfumeria",
    nombre: "Perfumería",
    img: "images/perfumeria-1x1.webp",
    desc: "Higiene y cuidado personal para toda la familia.",
  },
  {
    id: "fiambreria",
    nombre: "Fiambrería",
    img: "images/fiambreria-1x1.webp",
    desc: "Fiambres y quesos cortados en el momento, como en el mostrador.",
  },
  {
    id: "granja",
    nombre: "Granja",
    img: "images/granja-1x1.webp",
    desc: "Huevos y pollo frescos, directo de granjas de la zona.",
  },
];

const SUBCATEGORIAS = {
  "fideos-arroz": "Fideos y arroz",
  "aceites-aderezos": "Aceites y aderezos",
  conservas: "Conservas",
  "galletitas-snacks": "Galletitas y snacks",
  leches: "Leches",
  quesos: "Quesos",
  yogures: "Yogures",
  "manteca-crema": "Manteca y crema",
  gaseosas: "Gaseosas",
  "aguas-jugos": "Aguas y jugos",
  cervezas: "Cervezas",
  vinos: "Vinos",
  "higiene-personal": "Higiene personal",
  "cuidado-cabello": "Cuidado del cabello",
  "cuidado-piel": "Cuidado de la piel",
  fiambres: "Fiambres",
  "quesos-fiambreria": "Quesos de fiambrería",
  huevos: "Huevos",
  "pollo-aves": "Pollo y aves",
};

const PRODUCTOS = [
  {
    id: "alm-fideos",
    nombre: "Fideos tallarines",
    categoria: "almacen",
    subcategoria: "fideos-arroz",
    precio: 1450,
    descuento: 0,
    stock: 40,
    presentacion: "Paquete 500 g",
    img: "images/almacen-16x9.webp",
    foco: "10% 55%",
    desc: "El clásico de todos los días, ideal para tuco o salsa blanca.",
    tags: "pasta tuco salsa tallarin",
  },
  {
    id: "alm-arroz",
    nombre: "Arroz largo fino",
    categoria: "almacen",
    subcategoria: "fideos-arroz",
    precio: 2150,
    descuento: 0,
    stock: 35,
    presentacion: "Paquete 1 kg",
    img: "images/almacen-16x9.webp",
    foco: "24% 55%",
    desc: "Grano suelto, el de siempre para guarniciones y ensaladas.",
    tags: "arroz guarnicion",
  },
  {
    id: "alm-aceite",
    nombre: "Aceite de girasol",
    categoria: "almacen",
    subcategoria: "aceites-aderezos",
    precio: 3890,
    descuento: 10,
    stock: 22,
    presentacion: "Botella 1,5 L",
    img: "images/almacen-16x9.webp",
    foco: "47% 45%",
    desc: "Para todos los días, de la marca que ya conocés.",
    tags: "aceite girasol cocina",
  },
  {
    id: "alm-pure",
    nombre: "Puré de tomate",
    categoria: "almacen",
    subcategoria: "conservas",
    precio: 1290,
    descuento: 0,
    stock: 50,
    presentacion: "Sachet 520 g",
    img: "images/almacen-16x9.webp",
    foco: "66% 42%",
    desc: "Base de salsa lista en minutos.",
    tags: "tomate salsa conserva",
  },
  {
    id: "alm-aceitunas",
    nombre: "Aceitunas verdes descarozadas",
    categoria: "almacen",
    subcategoria: "conservas",
    precio: 1680,
    descuento: 0,
    stock: 30,
    presentacion: "Frasco 200 g",
    img: "images/almacen-16x9.webp",
    foco: "72% 60%",
    desc: "Para la picada o para tirar en la ensalada.",
    tags: "aceitunas picada conserva",
  },
  {
    id: "alm-galletitas",
    nombre: "Galletitas de agua",
    categoria: "almacen",
    subcategoria: "galletitas-snacks",
    precio: 1590,
    descuento: 0,
    stock: 3,
    badge: "Últimas unidades",
    badgeTipo: "stock",
    presentacion: "Paquete 300 g",
    img: "images/almacen-16x9.webp",
    foco: "10% 78%",
    desc: "Para acompañar el mate o la tabla de fiambres.",
    tags: "galletitas snack mate",
  },

  {
    id: "lac-lecheentera",
    nombre: "Leche entera",
    categoria: "lacteos",
    subcategoria: "leches",
    precio: 1190,
    descuento: 0,
    stock: 60,
    presentacion: "Sachet 1 L",
    img: "images/lacteos-9x16.webp",
    foco: "18% 8%",
    desc: "La de todos los días, para el café con leche de la mañana.",
    tags: "leche entera desayuno",
  },
  {
    id: "lac-lechedescremada",
    nombre: "Leche descremada",
    categoria: "lacteos",
    subcategoria: "leches",
    precio: 1190,
    descuento: 0,
    stock: 55,
    presentacion: "Sachet 1 L",
    img: "images/lacteos-9x16.webp",
    foco: "40% 6%",
    desc: "Misma leche de siempre, versión más liviana.",
    tags: "leche descremada desayuno",
  },
  {
    id: "lac-yogurbebible",
    nombre: "Yogur bebible frutilla",
    categoria: "lacteos",
    subcategoria: "yogures",
    precio: 2050,
    descuento: 15,
    stock: 26,
    presentacion: "Botella 1 L",
    img: "images/lacteos-9x16.webp",
    foco: "30% 90%",
    desc: "Para la vianda o la merienda de la tarde.",
    tags: "yogur frutilla merienda",
  },
  {
    id: "lac-yogurpote",
    nombre: "Yogur natural",
    categoria: "lacteos",
    subcategoria: "yogures",
    precio: 1980,
    descuento: 0,
    stock: 18,
    badge: "Nuevo",
    badgeTipo: "nuevo",
    presentacion: "Pack x4 · 190 g",
    img: "images/lacteos-9x16.webp",
    foco: "55% 12%",
    desc: "Sin azúcar agregada, para combinar con fruta o cereal.",
    tags: "yogur natural pack",
  },
  {
    id: "lac-quesocremoso",
    nombre: "Queso cremoso",
    categoria: "lacteos",
    subcategoria: "quesos",
    precio: 3400,
    descuento: 0,
    stock: 20,
    presentacion: "Pote 300 g",
    img: "images/lacteos-9x16.webp",
    foco: "30% 40%",
    desc: "Para untar o para completar la tabla de quesos.",
    tags: "queso cremoso untable",
  },
  {
    id: "lac-manteca",
    nombre: "Manteca",
    categoria: "lacteos",
    subcategoria: "manteca-crema",
    precio: 1750,
    descuento: 0,
    stock: 33,
    presentacion: "Pan 200 g",
    img: "images/lacteos-9x16.webp",
    foco: "62% 63%",
    desc: "Para las tostadas o para la masa que estás horneando.",
    tags: "manteca tostadas horneado",
  },

  {
    id: "beb-gaseosacola",
    nombre: "Gaseosa cola",
    categoria: "bebidas",
    subcategoria: "gaseosas",
    precio: 2390,
    descuento: 0,
    stock: 45,
    presentacion: "Botella 2,25 L",
    img: "images/bebidas-1x1.webp",
    foco: "88% 78%",
    desc: "La de siempre, bien fría para el asado del domingo.",
    tags: "gaseosa cola bebida",
  },
  {
    id: "beb-aguasingas",
    nombre: "Agua mineral sin gas",
    categoria: "bebidas",
    subcategoria: "aguas-jugos",
    precio: 1050,
    descuento: 0,
    stock: 70,
    presentacion: "Botella 2 L",
    img: "images/bebidas-1x1.webp",
    foco: "10% 15%",
    desc: "Para tener siempre a mano en casa.",
    tags: "agua mineral",
  },
  {
    id: "beb-jugonaranja",
    nombre: "Jugo exprimido de naranja",
    categoria: "bebidas",
    subcategoria: "aguas-jugos",
    precio: 2650,
    descuento: 0,
    stock: 15,
    badge: "Nuevo",
    badgeTipo: "nuevo",
    presentacion: "Botella 1 L",
    img: "images/bebidas-1x1.webp",
    foco: "35% 15%",
    desc: "Recién exprimido, sin agregar agua.",
    tags: "jugo naranja desayuno",
  },
  {
    id: "beb-cervezalata",
    nombre: "Cerveza rubia",
    categoria: "bebidas",
    subcategoria: "cervezas",
    precio: 4200,
    descuento: 12,
    stock: 28,
    presentacion: "Pack x6 · 473 ml",
    img: "images/bebidas-1x1.webp",
    foco: "15% 80%",
    desc: "Para juntarse un viernes con amigos.",
    tags: "cerveza pack lata",
  },
  {
    id: "beb-vinomalbec",
    nombre: "Vino tinto malbec",
    categoria: "bebidas",
    subcategoria: "vinos",
    precio: 5900,
    descuento: 0,
    stock: 24,
    presentacion: "Botella 750 ml",
    img: "images/bebidas-1x1.webp",
    foco: "78% 18%",
    desc: "Para acompañar la picada o el asado.",
    tags: "vino tinto malbec",
  },
  {
    id: "beb-aguasaborizada",
    nombre: "Agua saborizada pomelo",
    categoria: "bebidas",
    subcategoria: "aguas-jugos",
    precio: 1680,
    descuento: 0,
    stock: 38,
    presentacion: "Botella 1,5 L",
    img: "images/bebidas-1x1.webp",
    foco: "60% 15%",
    desc: "Fresca y liviana, sin tanta azúcar.",
    tags: "agua saborizada pomelo",
  },

  {
    id: "per-jabon",
    nombre: "Jabón en pan glicerina",
    categoria: "perfumeria",
    subcategoria: "higiene-personal",
    precio: 2100,
    descuento: 0,
    stock: 40,
    presentacion: "Pack x3 · 90 g",
    img: "images/perfumeria-1x1.webp",
    foco: "48% 78%",
    desc: "Suave para toda la familia, de baño diario.",
    tags: "jabon higiene bano",
  },
  {
    id: "per-shampoo",
    nombre: "Shampoo uso diario",
    categoria: "perfumeria",
    subcategoria: "cuidado-cabello",
    precio: 3950,
    descuento: 20,
    stock: 19,
    presentacion: "Frasco 400 ml",
    img: "images/perfumeria-1x1.webp",
    foco: "15% 45%",
    desc: "Limpieza suave para lavar todos los días.",
    tags: "shampoo cabello",
  },
  {
    id: "per-acondicionador",
    nombre: "Acondicionador",
    categoria: "perfumeria",
    subcategoria: "cuidado-cabello",
    precio: 3950,
    descuento: 0,
    stock: 17,
    presentacion: "Frasco 400 ml",
    img: "images/perfumeria-1x1.webp",
    foco: "68% 45%",
    desc: "Para el cabello suave y fácil de peinar.",
    tags: "acondicionador cabello",
  },
  {
    id: "per-cremadental",
    nombre: "Crema dental menta",
    categoria: "perfumeria",
    subcategoria: "higiene-personal",
    precio: 1850,
    descuento: 0,
    stock: 44,
    presentacion: "Pomo 90 g",
    img: "images/perfumeria-1x1.webp",
    foco: "12% 85%",
    desc: "Frescor de siempre para el cepillado diario.",
    tags: "crema dental pasta dientes",
  },
  {
    id: "per-desodorante",
    nombre: "Desodorante roll-on",
    categoria: "perfumeria",
    subcategoria: "higiene-personal",
    precio: 2290,
    descuento: 0,
    stock: 4,
    badge: "Últimas unidades",
    badgeTipo: "stock",
    presentacion: "Roll-on 50 ml",
    img: "images/perfumeria-1x1.webp",
    foco: "78% 50%",
    desc: "Protección de todo el día.",
    tags: "desodorante roll on",
  },
  {
    id: "per-cremacorporal",
    nombre: "Crema corporal hidratante",
    categoria: "perfumeria",
    subcategoria: "cuidado-piel",
    precio: 2780,
    descuento: 0,
    stock: 21,
    presentacion: "Pote 200 ml",
    img: "images/perfumeria-1x1.webp",
    foco: "84% 68%",
    desc: "Para la piel reseca después de la ducha.",
    tags: "crema corporal piel",
  },

  {
    id: "fia-jamoncocido",
    nombre: "Jamón cocido natural",
    categoria: "fiambreria",
    subcategoria: "fiambres",
    precio: 2950,
    descuento: 0,
    stock: 25,
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "75% 55%",
    desc: "Cortado fino, para sándwiches o la picada.",
    tags: "jamon cocido fiambre picada",
  },
  {
    id: "fia-salame",
    nombre: "Salame picado grueso",
    categoria: "fiambreria",
    subcategoria: "fiambres",
    precio: 3100,
    descuento: 0,
    stock: 22,
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "48% 52%",
    desc: "El infaltable de toda picada que se precie.",
    tags: "salame fiambre picada",
  },
  {
    id: "fia-paleta",
    nombre: "Paleta cocida",
    categoria: "fiambreria",
    subcategoria: "fiambres",
    precio: 2650,
    descuento: 10,
    stock: 20,
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "18% 15%",
    desc: "Más económica que el jamón, igual de rica.",
    tags: "paleta fiambre",
  },
  {
    id: "fia-bondiola",
    nombre: "Bondiola ahumada",
    categoria: "fiambreria",
    subcategoria: "fiambres",
    precio: 3450,
    descuento: 0,
    stock: 12,
    badge: "Nuevo",
    badgeTipo: "nuevo",
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "25% 88%",
    desc: "Ahumada en casa, para una picada distinta.",
    tags: "bondiola ahumada fiambre picada",
  },
  {
    id: "fia-quesotybo",
    nombre: "Queso de máquina tybo",
    categoria: "fiambreria",
    subcategoria: "quesos-fiambreria",
    precio: 2400,
    descuento: 0,
    stock: 27,
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "55% 18%",
    desc: "Cortado fino en el momento, para la mesa de todos los días.",
    tags: "queso tybo fiambreria",
  },
  {
    id: "fia-quesoprovolone",
    nombre: "Queso provolone",
    categoria: "fiambreria",
    subcategoria: "quesos-fiambreria",
    precio: 2800,
    descuento: 0,
    stock: 18,
    presentacion: "Fiambre 200 g",
    img: "images/fiambreria-1x1.webp",
    foco: "72% 20%",
    desc: "De sabor más fuerte, ideal para la tabla o la parrilla.",
    tags: "queso provolone parrilla",
  },

  {
    id: "gra-huevosblancos",
    nombre: "Huevos blancos",
    categoria: "granja",
    subcategoria: "huevos",
    precio: 2890,
    descuento: 0,
    stock: 34,
    presentacion: "Maple x12",
    img: "images/granja-1x1.webp",
    foco: "8% 45%",
    desc: "Frescos de granjas de la zona.",
    tags: "huevos blancos maple",
  },
  {
    id: "gra-huevoscolor",
    nombre: "Huevos color",
    categoria: "granja",
    subcategoria: "huevos",
    precio: 6450,
    descuento: 8,
    stock: 14,
    presentacion: "Maple x30",
    img: "images/granja-1x1.webp",
    foco: "25% 12%",
    desc: "El maple grande para la casa que consume más.",
    tags: "huevos color maple grande",
  },
  {
    id: "gra-huevoscampo",
    nombre: "Huevos de campo",
    categoria: "granja",
    subcategoria: "huevos",
    precio: 2350,
    descuento: 0,
    stock: 16,
    badge: "Nuevo",
    badgeTipo: "nuevo",
    presentacion: "Maple x6",
    img: "images/granja-1x1.webp",
    foco: "50% 75%",
    desc: "De gallinas criadas a campo abierto.",
    tags: "huevos campo maple",
  },
  {
    id: "gra-polloentero",
    nombre: "Pollo entero",
    categoria: "granja",
    subcategoria: "pollo-aves",
    precio: 3290,
    descuento: 0,
    stock: 12,
    presentacion: "Precio por kg",
    img: "images/granja-1x1.webp",
    foco: "78% 20%",
    desc: "Fresco, para el horno del domingo.",
    tags: "pollo entero horno",
  },
  {
    id: "gra-supremapollo",
    nombre: "Suprema de pollo",
    categoria: "granja",
    subcategoria: "pollo-aves",
    precio: 4190,
    descuento: 0,
    stock: 9,
    presentacion: "Precio por kg",
    img: "images/granja-1x1.webp",
    foco: "85% 65%",
    desc: "Sin hueso, lista para la plancha o milanesas.",
    tags: "suprema pollo milanesa",
  },
  {
    id: "gra-patamuslo",
    nombre: "Pata muslo de pollo",
    categoria: "granja",
    subcategoria: "pollo-aves",
    precio: 2990,
    descuento: 0,
    stock: 2,
    badge: "Últimas unidades",
    badgeTipo: "stock",
    presentacion: "Precio por kg",
    img: "images/granja-1x1.webp",
    foco: "70% 75%",
    desc: "Jugosa, para guisar o al horno con papas.",
    tags: "pata muslo pollo guiso",
  },
];

const DESTACADOS_IDS = [
  "lac-yogurbebible",
  "fia-jamoncocido",
  "gra-huevoscolor",
  "beb-cervezalata",
  "alm-aceite",
  "per-shampoo",
  "lac-quesocremoso",
  "fia-bondiola",
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
const getCategoria = (id) => CATEGORIAS.find((c) => c.id === id);
const normalizar = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const Cart = {
  KEY: "productosalmacenlacteos_cart",
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
  syncStock(productos) {
    const items = this.get();
    let changed = false;
    const filtered = items.filter((i) => {
      const p = productos.find((x) => x.id === i.id);
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

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
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
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll("[data-animate]:not(.in)").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`;
    requestAnimationFrame(() => el.classList.add("in"));
  });
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
document.addEventListener("cart:updated", updateCartBadge);

function syncWhatsappLinks() {
  document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
    a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${WHATSAPP_NUMBER}`);
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
  cart?.addEventListener("click", () =>
    openDrawer(document.getElementById("cartDrawer"), cart),
  );
  sync();
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
let _lastTrigger = null;

function openDrawer(panel, trigger) {
  if (!panel || panel.classList.contains("open")) return;
  _lastTrigger = trigger || document.activeElement;
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add("open"));
  window.lenis?.stop();
  document.body.classList.add("no-scroll");
  (panel.querySelector(FOCUSABLE) || panel).focus();
  panel.addEventListener("keydown", _trap);
  document.addEventListener("keydown", _escHandler);
}
function closeDrawer(panel) {
  if (!panel || !panel.classList.contains("open")) return;
  panel.classList.remove("open");
  setTimeout(() => {
    panel.hidden = true;
  }, 380);
  window.lenis?.start();
  document.body.classList.remove("no-scroll");
  panel.removeEventListener("keydown", _trap);
  document.removeEventListener("keydown", _escHandler);
  _lastTrigger?.focus();
}
function _trap(e) {
  if (e.key !== "Tab") return;
  const els = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null,
  );
  if (!els.length) return;
  const first = els[0],
    last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function _escHandler(e) {
  if (e.key !== "Escape") return;
  const open = document.querySelector(".drawer.open, .modal-backdrop.open");
  if (open) closeDrawer(open);
}

function renderCartDrawer() {
  const body = document.getElementById("cartBody");
  const footer = document.getElementById("cartFooter");
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
      <p>Todavía no agregaste productos.</p>
      <button type="button" class="btn btn-primary" data-cart-seguir>Ver el catálogo</button>
    </div>`;
    body.querySelector("[data-cart-seguir]")?.addEventListener("click", () => {
      closeDrawer(document.getElementById("cartDrawer"));
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (footer) footer.hidden = true;
    return;
  }
  if (footer) footer.hidden = false;
  body.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      const pf = precioFinal(p);
      return `<div class="cart-item" data-cart-item="${p.id}">
      <div class="cart-item-img"><img src="${p.img}" alt="" style="object-position:${p.foco || "50% 50%"}" width="80" height="80" loading="lazy"></div>
      <div class="cart-item-info">
        <p class="cart-item-nombre">${esc(p.nombre)}</p>
        <p class="cart-item-presentacion">${esc(p.presentacion)}</p>
        <div class="cart-item-row">
          <div class="stepper stepper-sm" data-stepper="${p.id}">
            <button type="button" class="stepper-btn" data-step="-1" aria-label="Restar uno">−</button>
            <span class="stepper-val">${i.qty}</span>
            <button type="button" class="stepper-btn" data-step="1" aria-label="Sumar uno">+</button>
          </div>
          <span class="cart-item-precio">${formatearPrecio(pf * i.qty)}</span>
        </div>
      </div>
      <button type="button" class="cart-item-quitar" data-cart-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>`;
    })
    .join("");
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());

  body.querySelectorAll("[data-stepper]").forEach((st) => {
    const id = st.dataset.stepper;
    st.querySelectorAll(".stepper-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const items2 = Cart.get();
        const it = items2.find((x) => x.id === id);
        if (!it) return;
        Cart.setQty(id, it.qty + Number(btn.dataset.step));
      }),
    );
  });
  body
    .querySelectorAll("[data-cart-quitar]")
    .forEach((btn) =>
      btn.addEventListener("click", () => Cart.remove(btn.dataset.cartQuitar)),
    );
}
document.addEventListener("cart:updated", renderCartDrawer);

function initCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const headerBtn = document.getElementById("cart-header-btn");
  const closeBtn = document.getElementById("cartClose");
  const backdrop = drawer?.querySelector(".drawer-backdrop");
  const finalizar = document.getElementById("cartFinalizar");
  if (!drawer) return;
  headerBtn?.addEventListener("click", () => openDrawer(drawer, headerBtn));
  closeBtn?.addEventListener("click", () => closeDrawer(drawer));
  backdrop?.addEventListener("click", () => closeDrawer(drawer));
  finalizar?.addEventListener("click", () => {
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
  renderCartDrawer();
}

function renderQuickview(id) {
  const p = getProducto(id);
  if (!p) return;
  const cont = document.getElementById("quickviewBody");
  if (!cont) return;
  const pf = precioFinal(p);
  const relacionados = PRODUCTOS.filter(
    (x) => x.categoria === p.categoria && x.id !== p.id,
  ).slice(0, 3);
  cont.innerHTML = `
    <div class="qv-media"><img src="${p.img}" alt="${esc(p.nombre)}" style="object-position:${p.foco || "50% 50%"}" width="600" height="600"></div>
    <div class="qv-info">
      <p class="qv-eyebrow">${esc(getCategoria(p.categoria)?.nombre || "")}${p.subcategoria ? " · " + esc(SUBCATEGORIAS[p.subcategoria] || "") : ""}</p>
      <h3 id="quickviewTitle">${esc(p.nombre)}</h3>
      <p class="qv-presentacion">${esc(p.presentacion)}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <div class="qv-precio-row">
        <span class="qv-precio">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="qv-precio-original">${formatearPrecio(p.precio)}</s><span class="badge badge-desc">-${p.descuento}%</span>` : ""}
      </div>
      ${p.stock <= 4 ? `<p class="qv-stock">Quedan ${p.stock} unidades.</p>` : ""}
      <div class="qv-actions">
        <div class="stepper" data-qv-stepper>
          <button type="button" class="stepper-btn" data-step="-1" aria-label="Restar uno">−</button>
          <span class="stepper-val" data-qv-qty>1</span>
          <button type="button" class="stepper-btn" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-primary btn-block" data-qv-agregar>Agregar al carrito</button>
      </div>
    </div>
    ${
      relacionados.length
        ? `<div class="qv-relacionados">
      <p class="qv-relacionados-titulo">También te puede interesar</p>
      <div class="qv-relacionados-grid">
        ${relacionados
          .map(
            (
              r,
            ) => `<button type="button" class="qv-relacionado" data-quickview-open="${r.id}">
          <img src="${r.img}" alt="" style="object-position:${r.foco || "50% 50%"}" width="120" height="120" loading="lazy">
          <span>${esc(r.nombre)}</span>
          <strong>${formatearPrecio(precioFinal(r))}</strong>
        </button>`,
          )
          .join("")}
      </div>
    </div>`
        : ""
    }
  `;
  let qty = 1;
  const qtyEl = cont.querySelector("[data-qv-qty]");
  cont
    .querySelector("[data-qv-stepper]")
    ?.querySelectorAll(".stepper-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => {
        qty = Math.max(
          1,
          Math.min(qty + Number(btn.dataset.step), p.stock ?? 99),
        );
        qtyEl.textContent = qty;
      }),
    );
  cont.querySelector("[data-qv-agregar]")?.addEventListener("click", () => {
    Cart.add(p, qty);
    showToast(`Agregaste ${qty} × ${p.nombre}`);
  });
  cont
    .querySelectorAll("[data-quickview-open]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        renderQuickview(b.dataset.quickviewOpen),
      ),
    );
}
function openQuickview(id) {
  const modal = document.getElementById("quickviewModal");
  if (!modal) return;
  renderQuickview(id);
  openDrawer(modal, document.activeElement);
}
function initQuickview() {
  const modal = document.getElementById("quickviewModal");
  const closeBtn = document.getElementById("quickviewClose");
  const backdrop = modal?.querySelector(".drawer-backdrop");
  if (!modal) return;
  closeBtn?.addEventListener("click", () => closeDrawer(modal));
  backdrop?.addEventListener("click", () => closeDrawer(modal));
}

const catalogoState = {
  query: "",
  categoria: "",
  subcategoria: "",
  soloStock: false,
  orden: "relevancia",
  visibles: 16,
};

function productosFiltrados() {
  const q = normalizar(catalogoState.query.trim());
  return PRODUCTOS.filter((p) => {
    if (catalogoState.categoria && p.categoria !== catalogoState.categoria)
      return false;
    if (
      catalogoState.subcategoria &&
      p.subcategoria !== catalogoState.subcategoria
    )
      return false;
    if (catalogoState.soloStock && p.stock <= 0) return false;
    if (q) {
      const hay = normalizar(
        [
          p.nombre,
          p.categoria,
          SUBCATEGORIAS[p.subcategoria] || "",
          p.desc,
          p.tags,
        ].join(" "),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (catalogoState.orden === "precio-asc")
      return precioFinal(a) - precioFinal(b);
    if (catalogoState.orden === "precio-desc")
      return precioFinal(b) - precioFinal(a);
    return 0;
  });
}

function cardProductoHTML(p) {
  const pf = precioFinal(p);
  return `<article class="prod-card" data-animate data-producto="${p.id}">
    <button type="button" class="prod-media" data-quickview-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" style="object-position:${p.foco || "50% 50%"}" width="400" height="400" loading="lazy">
      ${p.badge ? `<span class="badge badge-${p.badgeTipo}">${esc(p.badge)}</span>` : ""}
      ${p.descuento > 0 ? `<span class="badge badge-desc">-${p.descuento}%</span>` : ""}
      <span class="prod-media-zoom" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      </span>
    </button>
    <div class="prod-info">
      <p class="prod-nombre">${esc(p.nombre)}</p>
      <p class="prod-presentacion">${esc(p.presentacion)}</p>
      <div class="prod-precio-row">
        <span class="prod-precio">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="prod-precio-original">${formatearPrecio(p.precio)}</s>` : ""}
      </div>
    </div>
    <div class="prod-actions">
      <button type="button" class="btn btn-primary prod-add" data-card-agregar="${p.id}">Agregar al carrito</button>
    </div>
  </article>`;
}

function wireCard(card, p) {
  card
    .querySelectorAll("[data-quickview-open]")
    .forEach((el) => el.addEventListener("click", () => openQuickview(p.id)));
  card
    .querySelector(`[data-card-agregar="${p.id}"]`)
    ?.addEventListener("click", () => {
      Cart.add(p, 1);
      showToast(`Agregaste ${p.nombre} al carrito`);
    });
}

function renderCatalogo({ resetVisibles = false } = {}) {
  const grid = document.querySelector("[data-catalogo-grid]");
  if (!grid) return;
  if (resetVisibles) catalogoState.visibles = 16;

  const todos = productosFiltrados();
  const contEl = document.querySelector("[data-catalogo-count]");
  const catNombre = catalogoState.categoria
    ? getCategoria(catalogoState.categoria)?.nombre
    : "todo el catálogo";
  if (contEl)
    contEl.textContent =
      todos.length === 0
        ? `Sin resultados en ${catNombre}`
        : `${todos.length} producto${todos.length === 1 ? "" : "s"} en ${catNombre}`;

  const vermas = document.querySelector("[data-catalogo-vermas]");
  const vacio = document.querySelector("[data-catalogo-vacio]");

  const flipState =
    window.Flip && !reduceMotion ? Flip.getState(grid.children) : null;

  if (!todos.length) {
    grid.innerHTML = "";
    if (vacio) vacio.hidden = false;
    if (vermas) vermas.hidden = true;
    return;
  }
  if (vacio) vacio.hidden = true;

  const visibles = todos.slice(0, catalogoState.visibles);
  grid.innerHTML = visibles.map(cardProductoHTML).join("");
  visibles.forEach((p) =>
    wireCard(grid.querySelector(`[data-producto="${p.id}"]`), p),
  );

  if (vermas) vermas.hidden = catalogoState.visibles >= todos.length;

  if (flipState && window.Flip) {
    Flip.from(flipState, {
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.02,
      absolute: false,
    });
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}

function setCategoria(id, opts = {}) {
  catalogoState.categoria = catalogoState.categoria === id ? "" : id;
  catalogoState.subcategoria = "";
  document.querySelectorAll("[data-cat-filter]").forEach((el) => {
    const activo = el.dataset.catFilter === catalogoState.categoria;
    el.classList.toggle("activo", activo);
    if (el.matches('input[type="checkbox"]')) el.checked = activo;
    else el.setAttribute("aria-pressed", String(activo));
  });
  renderSubcatFiltros();
  renderCatalogo({ resetVisibles: true });
  if (opts.scroll !== false)
    document
      .getElementById("catalogo")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
}

function renderSubcatFiltros() {
  const cont = document.querySelector("[data-subcat-filtros]");
  if (!cont) return;
  if (!catalogoState.categoria) {
    cont.innerHTML = "";
    cont.hidden = true;
    return;
  }
  const subs = [
    ...new Set(
      PRODUCTOS.filter((p) => p.categoria === catalogoState.categoria).map(
        (p) => p.subcategoria,
      ),
    ),
  ];
  cont.hidden = false;
  cont.innerHTML = subs
    .map(
      (s) => `<label class="filtro-check">
    <input type="checkbox" data-subcat-filter="${s}" ${catalogoState.subcategoria === s ? "checked" : ""}>
    <span>${esc(SUBCATEGORIAS[s] || s)}</span>
  </label>`,
    )
    .join("");
  cont.querySelectorAll("[data-subcat-filter]").forEach((chk) =>
    chk.addEventListener("change", () => {
      catalogoState.subcategoria = chk.checked ? chk.dataset.subcatFilter : "";
      cont.querySelectorAll("[data-subcat-filter]").forEach((o) => {
        if (o !== chk) o.checked = false;
      });
      renderCatalogo({ resetVisibles: true });
    }),
  );
}

function initCatalogo() {
  const grid = document.querySelector("[data-catalogo-grid]");
  if (!grid) return;

  document.querySelectorAll("[data-catalogo-search]").forEach((input) => {
    input.addEventListener("input", () => {
      catalogoState.query = input.value;
      renderCatalogo({ resetVisibles: true });
    });
  });
  document
    .querySelectorAll("[data-catalogo-search-form]")
    .forEach((form) =>
      form.addEventListener("submit", (e) => e.preventDefault()),
    );

  document.querySelectorAll("[data-cat-filter]").forEach((el) => {
    el.addEventListener(el.matches("input") ? "change" : "click", () =>
      setCategoria(el.dataset.catFilter, {
        scroll: el.matches("input") ? false : undefined,
      }),
    );
  });

  document.querySelectorAll("[data-catalogo-stock]").forEach((chk) =>
    chk.addEventListener("change", () => {
      catalogoState.soloStock = chk.checked;
      renderCatalogo({ resetVisibles: true });
    }),
  );
  document.querySelectorAll("[data-catalogo-orden]").forEach((sel) =>
    sel.addEventListener("change", () => {
      catalogoState.orden = sel.value;
      renderCatalogo({ resetVisibles: true });
    }),
  );
  document.querySelectorAll("[data-catalogo-limpiar]").forEach((btn) =>
    btn.addEventListener("click", () => {
      catalogoState.query = "";
      catalogoState.categoria = "";
      catalogoState.subcategoria = "";
      catalogoState.soloStock = false;
      catalogoState.orden = "relevancia";
      document.querySelectorAll("[data-catalogo-search]").forEach((i) => {
        i.value = "";
      });
      document.querySelectorAll("[data-cat-filter]").forEach((el) => {
        el.classList.remove("activo");
        if (el.matches("input")) el.checked = false;
        else el.setAttribute("aria-pressed", "false");
      });
      document.querySelectorAll("[data-catalogo-stock]").forEach((i) => {
        i.checked = false;
      });
      document.querySelectorAll("[data-catalogo-orden]").forEach((s) => {
        s.value = "relevancia";
      });
      renderSubcatFiltros();
      renderCatalogo({ resetVisibles: true });
    }),
  );
  document.querySelectorAll("[data-catalogo-vermas]").forEach((btn) =>
    btn.addEventListener("click", () => {
      catalogoState.visibles += 16;
      renderCatalogo();
    }),
  );

  renderSubcatFiltros();
  renderCatalogo({ resetVisibles: true });
}

function initCategoriasCirculos() {
  const cont = document.querySelector("[data-categorias-circulos]");
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map((c) => {
    const n = PRODUCTOS.filter((p) => p.categoria === c.id).length;
    return `<button type="button" class="cat-circulo" data-cat-filter="${c.id}" aria-pressed="false" data-animate>
      <span class="cat-circulo-img"><img src="${c.img}" alt="" style="object-position:${c.id === "lacteos" ? "50% 15%" : "50% 50%"}" width="120" height="120" loading="lazy"></span>
      <span class="cat-circulo-nombre">${esc(c.nombre)}</span>
      <span class="cat-circulo-count">${n} productos</span>
    </button>`;
  }).join("");
}

function initRail(root) {
  const vp = root.querySelector(".rail-vp");
  const track = root.querySelector(".rail-track");
  const prev = root.querySelector("[data-rail-prev]");
  const next = root.querySelector("[data-rail-next]");
  if (!vp || !track) return;

  const items = DESTACADOS_IDS.map(getProducto).filter(Boolean);
  track.innerHTML = items
    .map((p) => `<div class="rail-card">${cardProductoHTML(p)}</div>`)
    .join("");
  items.forEach((p) =>
    wireCard(track.querySelector(`[data-producto="${p.id}"]`), p),
  );
  revelarNuevos(track);

  const inicio = () =>
    parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const syncArrows = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= inicio() + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener("click", () =>
    vp.scrollBy({
      left: -vp.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({
      left: vp.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    }),
  );
  vp.addEventListener("scroll", syncArrows, { passive: true });
  syncArrows();

  let down = false,
    moved = false,
    startX = 0,
    startScroll = 0,
    pointerId = null;
  vp.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
    pointerId = e.pointerId;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el drag igual funciona */
      }
    }
    if (moved) {
      vp.scrollLeft = startScroll - dx;
      syncArrows();
    }
  });
  const end = () => {
    down = false;
    vp.classList.remove("dragging");
    try {
      vp.releasePointerCapture?.(pointerId);
    } catch {
      /* ya liberado */
    }
    if (moved)
      setTimeout(() => {
        moved = false;
      }, 30);
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
}
function initRailes() {
  document.querySelectorAll("[data-rail]").forEach(initRail);
}

const PICADA_CONFIG = {
  liviana: {
    fiambre: 60,
    queso: 40,
    aceitunas: 25,
    etiqueta: "Picada liviana",
  },
  completa: {
    fiambre: 100,
    queso: 70,
    aceitunas: 40,
    etiqueta: "Picada completa",
  },
};
const PICADA_FIAMBRES = ["fia-jamoncocido", "fia-salame"];
const PICADA_QUESOS = ["fia-quesotybo", "fia-quesoprovolone"];
const PICADA_ACEITUNAS = "alm-aceitunas";
const PICADA_PAQUETE_G = 200;

function calcularPicada(personas, tipo) {
  const cfg = PICADA_CONFIG[tipo];
  const items = [];
  const repartir = (ids, gramosTotal) => {
    const gramosPorItem = gramosTotal / ids.length;
    ids.forEach((id) =>
      items.push({
        id,
        qty: Math.max(1, Math.ceil(gramosPorItem / PICADA_PAQUETE_G)),
      }),
    );
  };
  repartir(PICADA_FIAMBRES, personas * cfg.fiambre);
  repartir(PICADA_QUESOS, personas * cfg.queso);
  items.push({
    id: PICADA_ACEITUNAS,
    qty: Math.max(1, Math.ceil((personas * cfg.aceitunas) / PICADA_PAQUETE_G)),
  });
  const subtotal = items.reduce((s, i) => {
    const p = getProducto(i.id);
    return p ? s + precioFinal(p) * i.qty : s;
  }, 0);
  return { items, subtotal };
}

function initCalculadoraPicada() {
  const root = document.querySelector("[data-calc-picada]");
  if (!root) return;
  const personasEl = root.querySelector("[data-calc-personas]");
  const tipoBtns = root.querySelectorAll("[data-calc-tipo]");
  const resultEl = root.querySelector("[data-calc-resultado]");
  const subtotalEl = root.querySelector("[data-calc-subtotal]");
  const agregarBtn = root.querySelector("[data-calc-agregar]");
  let personas = Number(personasEl?.textContent) || 6;
  let tipo = "completa";

  const render = () => {
    const { items, subtotal } = calcularPicada(personas, tipo);
    resultEl.innerHTML = items
      .map((i) => {
        const p = getProducto(i.id);
        return `<li><span class="calc-item-nombre">${esc(p.nombre)}</span><span class="calc-item-qty">× ${i.qty} <small>(${esc(p.presentacion)})</small></span></li>`;
      })
      .join("");
    subtotalEl.textContent = formatearPrecio(subtotal);
    if (typeof gsap !== "undefined" && !reduceMotion) {
      gsap.fromTo(
        subtotalEl,
        { scale: 1.12 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
    }
  };

  root.querySelectorAll("[data-calc-personas-step]").forEach((btn) =>
    btn.addEventListener("click", () => {
      personas = Math.max(
        2,
        Math.min(20, personas + Number(btn.dataset.calcPersonasStep)),
      );
      personasEl.textContent = personas;
      render();
    }),
  );
  tipoBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      tipo = btn.dataset.calcTipo;
      tipoBtns.forEach((b) => b.classList.toggle("activo", b === btn));
      render();
    }),
  );
  agregarBtn?.addEventListener("click", () => {
    const { items } = calcularPicada(personas, tipo);
    items.forEach((i) => {
      const p = getProducto(i.id);
      if (p) Cart.add(p, i.qty);
    });
    showToast(`Agregamos tu picada para ${personas} personas al carrito`);
  });

  render();
}

function initHeroBanner() {
  const root = document.querySelector("[data-hero-banner]");
  if (!root) return;
  const slides = [...root.querySelectorAll(".hero-banner-slide")];
  const dots = [...root.querySelectorAll("[data-hero-dot]")];
  if (slides.length < 2) return;
  let idx = 0,
    timer = null;
  const show = (i) => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("activo", n === idx));
    dots.forEach((d, n) => d.setAttribute("aria-current", String(n === idx)));
  };
  const next = () => show(idx + 1);
  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = setInterval(next, 5000);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  root.querySelector("[data-hero-prev]")?.addEventListener("click", () => {
    show(idx - 1);
    start();
  });
  root.querySelector("[data-hero-next]")?.addEventListener("click", () => {
    show(idx + 1);
    start();
  });
  dots.forEach((d, n) =>
    d.addEventListener("click", () => {
      show(n);
      start();
    }),
  );
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);
  show(0);
  start();
}

function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const input = form.querySelector("input");
    if (input && !input.value.trim()) {
      input.focus();
      return;
    }
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Enviando…";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      showToast(
        "¡Gracias! El envío de mensajes se activa al pasar la web a producción.",
      );
      form.reset();
    }, 800);
  });
}

function initAnimaciones() {
  if (typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const media = hero.querySelector(
    ".hero-media img, .hero-banner-slide.activo img",
  );
  const titulo = hero.querySelector("h1");
  const ctas = hero.querySelectorAll(".hero-cta > *");
  if (reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (media) tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.2 }, 0);
  if (titulo)
    tl.fromTo(
      titulo,
      { opacity: 0, y: 24, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      0.15,
    );
  if (ctas.length)
    tl.fromTo(
      ctas,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      0.4,
    );
}

document.addEventListener("DOMContentLoaded", () => {
  syncWhatsappLinks();
  Cart.syncStock(PRODUCTOS);
  initHeroBanner();
  initCategoriasCirculos();
  initCatalogo();
  initRailes();
  initCalculadoraPicada();
  initNewsletter();
  initReveals();
  initNav();
  initFloats();
  initCartDrawer();
  initQuickview();
  updateCartBadge();
  initAnimaciones();
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
    gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollTrigger !== "undefined")
    window.addEventListener("load", () => ScrollTrigger.refresh());
});
