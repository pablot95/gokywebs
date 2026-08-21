const WHATSAPP_NUMBER = "5491157511886";
const PAGINA_TAMANO = 16;

const CATEGORIAS = [
  {
    id: "climatizacion",
    nombre: "Climatización",
    imagen: "images/climatizacion-aire-acondicionado-1200x1200.webp",
  },
  {
    id: "cocina",
    nombre: "Cocina",
    imagen: "images/heladera-abierta-cocina-1600x1300.webp",
  },
  {
    id: "lavado",
    nombre: "Lavado",
    imagen: "images/lavarropas-tambor-detalle-1200x1200.webp",
  },
  {
    id: "tv-audio",
    nombre: "TV y Audio",
    imagen: "images/hero-tv-sala-moderna-1920x1080.webp",
  },
  {
    id: "pequenos",
    nombre: "Pequeños electrodomésticos",
    imagen: "images/freidora-aire-electrodomestico-1200x1200.webp",
  },
];

const IMG_COCINA_A = "images/heladera-abierta-cocina-1600x1300.webp";
const IMG_COCINA_B = "images/cocina-equipada-electrodomesticos-1600x1300.webp";
const IMG_LAVADO_A = "images/lavarropas-tambor-detalle-1200x1200.webp";
const IMG_LAVADO_B = "images/lavanderia-lavarropas-fila-1600x1300.webp";
const IMG_CLIMA = "images/climatizacion-aire-acondicionado-1200x1200.webp";
const IMG_TV = "images/hero-tv-sala-moderna-1920x1080.webp";
const IMG_PEQUENOS = "images/freidora-aire-electrodomestico-1200x1200.webp";

const PRODUCTOS = [
  {
    id: 1,
    slug: "split-frio-calor-3000-bgh",
    nombre: "Split frío/calor 3000 frigorías",
    categoria: "climatizacion",
    subcategoria: "Aire acondicionado",
    marca: "BGH",
    precio: 580000,
    descuento: 15,
    stock: 6,
    destacado: true,
    nuevo: false,
    imagen: IMG_CLIMA,
    descripcion:
      "Equipo split inverter frío/calor pensado para ambientes de hasta 25m². Bajo consumo y funcionamiento silencioso.",
    caracteristicas: [
      "3000 frigorías",
      "Frío/calor inverter",
      "Control remoto incluido",
      "Garantía oficial BGH",
    ],
    etiquetas: ["aire acondicionado", "split", "inverter", "frio calor"],
  },
  {
    id: 2,
    slug: "split-frio-calor-2250-philco",
    nombre: "Split frío/calor 2250 frigorías",
    categoria: "climatizacion",
    subcategoria: "Aire acondicionado",
    marca: "Philco",
    precio: 460000,
    descuento: 0,
    stock: 9,
    destacado: false,
    nuevo: false,
    imagen: IMG_CLIMA,
    descripcion:
      "Split eco inverter ideal para dormitorios y ambientes chicos, con bajo nivel de ruido.",
    caracteristicas: [
      "2250 frigorías",
      "Frío/calor",
      "Modo eco",
      "Filtro lavable",
    ],
    etiquetas: ["aire acondicionado", "split", "eco inverter"],
  },
  {
    id: 3,
    slug: "split-frio-4500-surrey",
    nombre: "Split solo frío 4500 frigorías",
    categoria: "climatizacion",
    subcategoria: "Aire acondicionado",
    marca: "Surrey",
    precio: 720000,
    descuento: 0,
    stock: 4,
    destacado: false,
    nuevo: true,
    imagen: IMG_CLIMA,
    descripcion:
      "Equipo de alta potencia para ambientes amplios o locales comerciales, solo frío.",
    caracteristicas: [
      "4500 frigorías",
      "Solo frío",
      "Turbo cooling",
      "Ideal ambientes grandes",
    ],
    etiquetas: ["aire acondicionado", "split", "solo frio", "alta potencia"],
  },
  {
    id: 4,
    slug: "ventilador-pie-20-liliana",
    nombre: 'Ventilador de pie 20"',
    categoria: "climatizacion",
    subcategoria: "Ventilación",
    marca: "Liliana",
    precio: 65000,
    descuento: 10,
    stock: 14,
    destacado: false,
    nuevo: false,
    imagen: IMG_CLIMA,
    descripcion:
      "Ventilador de pie de altura regulable, 3 velocidades y oscilación automática.",
    caracteristicas: [
      'Aspas 20"',
      "3 velocidades",
      "Oscilación automática",
      "Altura regulable",
    ],
    etiquetas: ["ventilador", "pie", "verano"],
  },
  {
    id: 5,
    slug: "heladera-nofrost-300-whirlpool",
    nombre: "Heladera No Frost 300L",
    categoria: "cocina",
    subcategoria: "Heladeras",
    marca: "Whirlpool",
    precio: 890000,
    descuento: 10,
    stock: 5,
    destacado: true,
    nuevo: false,
    imagen: IMG_COCINA_A,
    descripcion:
      "Heladera con freezer superior, sistema No Frost y estantes de vidrio templado.",
    caracteristicas: [
      "300 litros",
      "No Frost",
      "Freezer superior",
      "Eficiencia clase A",
    ],
    etiquetas: ["heladera", "nofrost", "cocina"],
  },
  {
    id: 6,
    slug: "heladera-spacemax-420-samsung",
    nombre: "Heladera con freezer 420L",
    categoria: "cocina",
    subcategoria: "Heladeras",
    marca: "Samsung",
    precio: 1250000,
    descuento: 0,
    stock: 3,
    destacado: true,
    nuevo: false,
    imagen: IMG_COCINA_A,
    descripcion:
      "Heladera side by side de gran capacidad, ideal para familias numerosas.",
    caracteristicas: [
      "420 litros",
      "Side by side",
      "Dispenser de agua",
      "Enfriamiento uniforme",
    ],
    etiquetas: ["heladera", "side by side", "cocina"],
  },
  {
    id: 7,
    slug: "cocina-4h-orbis",
    nombre: "Cocina 4 hornallas multigas",
    categoria: "cocina",
    subcategoria: "Cocción",
    marca: "Orbis",
    precio: 410000,
    descuento: 0,
    stock: 7,
    destacado: false,
    nuevo: false,
    imagen: IMG_COCINA_B,
    descripcion:
      "Cocina multigas con horno y grill, encendido electrónico en las cuatro hornallas.",
    caracteristicas: [
      "4 hornallas",
      "Horno con grill",
      "Encendido electrónico",
      "Multigas",
    ],
    etiquetas: ["cocina", "multigas", "horno"],
  },
  {
    id: 8,
    slug: "horno-mesada-45-ariston",
    nombre: "Horno eléctrico de mesada 45L",
    categoria: "cocina",
    subcategoria: "Cocción",
    marca: "Ariston",
    precio: 195000,
    descuento: 0,
    stock: 10,
    destacado: false,
    nuevo: false,
    imagen: IMG_COCINA_B,
    descripcion:
      "Horno eléctrico de mesada con grill y turbo, ideal para cocinas chicas.",
    caracteristicas: [
      "45 litros",
      "Función grill",
      "Turbo convección",
      "Temporizador",
    ],
    etiquetas: ["horno", "electrico", "mesada"],
  },
  {
    id: 9,
    slug: "lavavajillas-12-whirlpool",
    nombre: "Lavavajillas 12 cubiertos",
    categoria: "cocina",
    subcategoria: "Cocina",
    marca: "Whirlpool",
    precio: 780000,
    descuento: 20,
    stock: 4,
    destacado: true,
    nuevo: false,
    imagen: IMG_COCINA_B,
    descripcion:
      "Lavavajillas con 6 programas de lavado y bajo consumo de agua.",
    caracteristicas: [
      "12 cubiertos",
      "6 programas",
      "Bajo consumo de agua",
      "Panel electrónico",
    ],
    etiquetas: ["lavavajillas", "cocina"],
  },
  {
    id: 10,
    slug: "microondas-28-grill-philco",
    nombre: "Microondas 28L con grill",
    categoria: "cocina",
    subcategoria: "Cocina",
    marca: "Philco",
    precio: 145000,
    descuento: 0,
    stock: 12,
    destacado: false,
    nuevo: false,
    imagen: IMG_COCINA_A,
    descripcion: "Microondas con función grill y 10 niveles de potencia.",
    caracteristicas: [
      "28 litros",
      "Función grill",
      "10 niveles de potencia",
      "Plato giratorio",
    ],
    etiquetas: ["microondas", "grill", "cocina"],
  },
  {
    id: 11,
    slug: "lavarropas-frontal-8-drean",
    nombre: "Lavarropas carga frontal 8kg",
    categoria: "lavado",
    subcategoria: "Lavado",
    marca: "Drean",
    precio: 650000,
    descuento: 0,
    stock: 6,
    destacado: true,
    nuevo: false,
    imagen: IMG_LAVADO_A,
    descripcion:
      "Lavarropas carga frontal con motor inverter y 12 programas de lavado.",
    caracteristicas: [
      "8 kg",
      "Carga frontal",
      "Motor inverter",
      "12 programas",
    ],
    etiquetas: ["lavarropas", "carga frontal"],
  },
  {
    id: 12,
    slug: "lavarropas-superior-6-5-whirlpool",
    nombre: "Lavarropas carga superior 6.5kg",
    categoria: "lavado",
    subcategoria: "Lavado",
    marca: "Whirlpool",
    precio: 420000,
    descuento: 0,
    stock: 8,
    destacado: false,
    nuevo: false,
    imagen: IMG_LAVADO_B,
    descripcion:
      "Lavarropas carga superior con centrifugado de 700rpm, ideal para uso diario.",
    caracteristicas: ["6.5 kg", "Carga superior", "700 rpm", "8 programas"],
    etiquetas: ["lavarropas", "carga superior"],
  },
  {
    id: 13,
    slug: "secarropas-condensacion-7-candy",
    nombre: "Secarropas por condensación 7kg",
    categoria: "lavado",
    subcategoria: "Lavado",
    marca: "Candy",
    precio: 580000,
    descuento: 0,
    stock: 3,
    destacado: false,
    nuevo: false,
    imagen: IMG_LAVADO_B,
    descripcion:
      "Secarropas por condensación con sensor de humedad y programa antiarrugas.",
    caracteristicas: [
      "7 kg",
      "Por condensación",
      "Sensor de humedad",
      "Antiarrugas",
    ],
    etiquetas: ["secarropas", "lavado"],
  },
  {
    id: 14,
    slug: "lavarropas-doble-tina-8-fherguini",
    nombre: "Lavarropas doble tina 8kg",
    categoria: "lavado",
    subcategoria: "Lavado",
    marca: "Fherguini",
    precio: 280000,
    descuento: 0,
    stock: 0,
    destacado: false,
    nuevo: false,
    imagen: IMG_LAVADO_A,
    descripcion:
      "Lavarropas doble tina de gran capacidad, ideal para lavados intensivos.",
    caracteristicas: [
      "8 kg",
      "Doble tina",
      "Centrifugado independiente",
      "Uso semiautomático",
    ],
    etiquetas: ["lavarropas", "doble tina"],
  },
  {
    id: 15,
    slug: "smart-tv-50-4k-samsung",
    nombre: 'Smart TV 50" 4K',
    categoria: "tv-audio",
    subcategoria: "TV",
    marca: "Samsung",
    precio: 650000,
    descuento: 12,
    stock: 7,
    destacado: true,
    nuevo: false,
    imagen: IMG_TV,
    descripcion:
      "Smart TV 4K con HDR y sistema operativo con las principales apps de streaming.",
    caracteristicas: ["50 pulgadas", "4K UHD", "HDR", "Smart TV"],
    etiquetas: ["tv", "smart tv", "4k"],
  },
  {
    id: 16,
    slug: "smart-tv-43-fullhd-lg",
    nombre: 'Smart TV 43" Full HD',
    categoria: "tv-audio",
    subcategoria: "TV",
    marca: "LG",
    precio: 480000,
    descuento: 0,
    stock: 9,
    destacado: false,
    nuevo: true,
    imagen: IMG_TV,
    descripcion:
      "Smart TV Full HD liviano y compacto, ideal para dormitorios y living chicos.",
    caracteristicas: ["43 pulgadas", "Full HD", "Smart TV", "3 entradas HDMI"],
    etiquetas: ["tv", "smart tv", "fullhd"],
  },
  {
    id: 17,
    slug: "barra-sonido-21-jbl",
    nombre: "Barra de sonido 2.1",
    categoria: "tv-audio",
    subcategoria: "Audio",
    marca: "JBL",
    precio: 210000,
    descuento: 0,
    stock: 6,
    destacado: true,
    nuevo: false,
    imagen: IMG_TV,
    descripcion:
      "Barra de sonido con subwoofer inalámbrico y conexión Bluetooth.",
    caracteristicas: [
      "Sistema 2.1",
      "Subwoofer inalámbrico",
      "Bluetooth",
      "Entrada óptica",
    ],
    etiquetas: ["audio", "barra de sonido", "bluetooth"],
  },
  {
    id: 18,
    slug: "parlante-bt-philco",
    nombre: "Parlante Bluetooth portátil",
    categoria: "tv-audio",
    subcategoria: "Audio",
    marca: "Philco",
    precio: 85000,
    descuento: 0,
    stock: 15,
    destacado: false,
    nuevo: false,
    imagen: IMG_TV,
    descripcion:
      "Parlante portátil resistente a salpicaduras, hasta 10 horas de batería.",
    caracteristicas: [
      "Bluetooth 5.0",
      "10 horas de batería",
      "Resistente a salpicaduras",
      "Compacto",
    ],
    etiquetas: ["audio", "parlante", "bluetooth", "portatil"],
  },
  {
    id: 19,
    slug: "freidora-aire-55-liliana",
    nombre: "Freidora de aire 5.5L",
    categoria: "pequenos",
    subcategoria: "Cocina",
    marca: "Liliana",
    precio: 175000,
    descuento: 25,
    stock: 11,
    destacado: true,
    nuevo: false,
    imagen: IMG_PEQUENOS,
    descripcion:
      "Freidora de aire de capacidad familiar, cocina con poco o nada de aceite.",
    caracteristicas: [
      "5.5 litros",
      "8 funciones preestablecidas",
      "Sin aceite",
      "Timer digital",
    ],
    etiquetas: ["freidora", "aire", "pequenos electrodomesticos"],
  },
  {
    id: 20,
    slug: "licuadora-3vel-atma",
    nombre: "Licuadora 3 velocidades",
    categoria: "pequenos",
    subcategoria: "Cocina",
    marca: "Atma",
    precio: 58000,
    descuento: 0,
    stock: 18,
    destacado: false,
    nuevo: false,
    imagen: IMG_PEQUENOS,
    descripcion:
      "Licuadora de vaso de vidrio con 3 velocidades y función pulso.",
    caracteristicas: [
      "Vaso de vidrio 1.5L",
      "3 velocidades",
      "Función pulso",
      "Cuchillas de acero",
    ],
    etiquetas: ["licuadora", "pequenos electrodomesticos"],
  },
  {
    id: 21,
    slug: "pava-electrica-17-peabody",
    nombre: "Pava eléctrica 1.7L",
    categoria: "pequenos",
    subcategoria: "Cocina",
    marca: "Peabody",
    precio: 42000,
    descuento: 15,
    stock: 20,
    destacado: false,
    nuevo: false,
    imagen: IMG_PEQUENOS,
    descripcion: "Pava eléctrica de hervido rápido con apagado automático.",
    caracteristicas: [
      "1.7 litros",
      "Apagado automático",
      "Base 360°",
      "Filtro removible",
    ],
    etiquetas: ["pava", "electrica", "pequenos electrodomesticos"],
  },
  {
    id: 22,
    slug: "cafetera-filtro-12-philco",
    nombre: "Cafetera de filtro 12 tazas",
    categoria: "pequenos",
    subcategoria: "Cocina",
    marca: "Philco",
    precio: 68000,
    descuento: 0,
    stock: 9,
    destacado: false,
    nuevo: true,
    imagen: IMG_PEQUENOS,
    descripcion:
      "Cafetera de filtro con jarra de vidrio y placa de mantenimiento de temperatura.",
    caracteristicas: [
      "12 tazas",
      "Jarra de vidrio",
      "Mantiene temperatura",
      "Filtro permanente",
    ],
    etiquetas: ["cafetera", "pequenos electrodomesticos"],
  },
];

const PASOS_RECOMENDADOR = [
  {
    id: "categoria",
    titulo: "Elegí una categoría",
    opciones: CATEGORIAS.map((c) => ({ label: c.nombre, value: c.id })),
  },
  {
    id: "prioridad",
    titulo: "Qué priorizás",
    opciones: [
      { label: "Menor precio", value: "precio" },
      { label: "Los más elegidos", value: "destacado" },
      { label: "Lo más nuevo", value: "nuevo" },
    ],
  },
];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function formatPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function precioFinal(producto) {
  if (!producto.descuento) return producto.precio;
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}

function categoriaNombre(id) {
  const cat = CATEGORIAS.find((c) => c.id === id);
  return cat ? cat.nombre : id;
}

function cardHTML(producto) {
  const final = precioFinal(producto);
  const sinStock = producto.stock <= 0;
  const badges = [];
  if (producto.descuento)
    badges.push(
      `<span class="badge badge-sale">-${producto.descuento}%</span>`,
    );
  if (producto.nuevo)
    badges.push('<span class="badge badge-nuevo">Nuevo</span>');
  return `
    <article class="card" data-id="${producto.id}">
      <div class="card-media">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="600" height="600" loading="lazy">
        ${badges.length ? `<div class="card-badges">${badges.join("")}</div>` : ""}
        <button type="button" class="card-quick" data-quick="${producto.id}" aria-label="Vista rápida de ${producto.nombre}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="card-body">
        <span class="card-cat">${producto.subcategoria}</span>
        <h3 class="card-title">${producto.nombre}</h3>
        <span class="card-marca">${producto.marca}</span>
        ${
          sinStock
            ? '<p class="card-sin-stock">Sin stock por el momento</p>'
            : `<div class="card-precios">
              <span class="card-precio">${formatPrecio(final)}</span>
              ${producto.descuento ? `<span class="card-precio-antes">${formatPrecio(producto.precio)}</span>` : ""}
            </div>`
        }
        <button type="button" class="card-agregar" data-agregar="${producto.id}" ${sinStock ? "disabled" : ""}>${sinStock ? "Sin stock" : "Agregar al carrito"}</button>
      </div>
    </article>`;
}

function renderList(container, productos) {
  container.innerHTML = productos.map(cardHTML).join("");
}

function initDestacados() {
  const track = document.getElementById("railDestacadosTrack");
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  renderList(track, destacados);
}

function initCategorias() {
  const grid = document.getElementById("categoriasGrid");
  grid.innerHTML = CATEGORIAS.map(
    (c) => `
    <a class="categoria-card" href="#catalogo" data-ir-categoria="${c.id}">
      <img src="${c.imagen}" alt="${c.nombre}" width="400" height="500" loading="lazy">
      <span>${c.nombre}</span>
    </a>`,
  ).join("");
  grid.addEventListener("click", (e) => {
    const link = e.target.closest("[data-ir-categoria]");
    if (!link) return;
    const select = document.getElementById("filtroCategoria");
    select.value = link.dataset.irCategoria;
    select.dispatchEvent(new window.Event("change"));
  });
}

const estadoCatalogo = {
  busqueda: "",
  categoria: "",
  marca: "",
  orden: "relevancia",
  pagina: 1,
};

function initFiltros() {
  const selectCategoria = document.getElementById("filtroCategoria");
  CATEGORIAS.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nombre;
    selectCategoria.appendChild(opt);
  });
  const marcas = [...new Set(PRODUCTOS.map((p) => p.marca))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
  const selectMarca = document.getElementById("filtroMarca");
  marcas.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    selectMarca.appendChild(opt);
  });

  document.getElementById("buscador").addEventListener("input", (e) => {
    estadoCatalogo.busqueda = e.target.value.trim().toLowerCase();
    estadoCatalogo.pagina = 1;
    renderCatalogo();
  });
  selectCategoria.addEventListener("change", (e) => {
    estadoCatalogo.categoria = e.target.value;
    estadoCatalogo.pagina = 1;
    renderCatalogo();
  });
  selectMarca.addEventListener("change", (e) => {
    estadoCatalogo.marca = e.target.value;
    estadoCatalogo.pagina = 1;
    renderCatalogo();
  });
  document.getElementById("filtroOrden").addEventListener("change", (e) => {
    estadoCatalogo.orden = e.target.value;
    renderCatalogo();
  });
}

function productosFiltrados() {
  let lista = PRODUCTOS.filter((p) => {
    if (estadoCatalogo.categoria && p.categoria !== estadoCatalogo.categoria)
      return false;
    if (estadoCatalogo.marca && p.marca !== estadoCatalogo.marca) return false;
    if (estadoCatalogo.busqueda) {
      const texto = `${p.nombre} ${p.marca} ${p.subcategoria}`.toLowerCase();
      if (!texto.includes(estadoCatalogo.busqueda)) return false;
    }
    return true;
  });
  if (estadoCatalogo.orden === "precio-asc")
    lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estadoCatalogo.orden === "precio-desc")
    lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estadoCatalogo.orden === "nuevo")
    lista = lista
      .slice()
      .sort((a, b) => (b.nuevo === true) - (a.nuevo === true));
  else
    lista = lista
      .slice()
      .sort((a, b) => (b.destacado === true) - (a.destacado === true));
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const vacio = document.getElementById("catalogoVacio");
  const resultados = document.getElementById("catalogoResultados");
  const paginacion = document.getElementById("paginacion");

  const lista = productosFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(lista.length / PAGINA_TAMANO));
  estadoCatalogo.pagina = Math.min(estadoCatalogo.pagina, totalPaginas);
  const inicio = (estadoCatalogo.pagina - 1) * PAGINA_TAMANO;
  const pagina = lista.slice(inicio, inicio + PAGINA_TAMANO);

  grid.hidden = lista.length === 0;
  vacio.hidden = lista.length !== 0;
  resultados.textContent = lista.length
    ? `${lista.length} producto${lista.length === 1 ? "" : "s"} encontrado${lista.length === 1 ? "" : "s"}`
    : "";

  renderList(grid, pagina);

  paginacion.innerHTML = "";
  if (totalPaginas > 1) {
    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(i);
      if (i === estadoCatalogo.pagina) btn.classList.add("is-activa");
      btn.addEventListener("click", () => {
        estadoCatalogo.pagina = i;
        renderCatalogo();
        document.getElementById("catalogo").scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
      paginacion.appendChild(btn);
    }
  }
}

const estadoRecomendador = { categoria: null, prioridad: null };

function renderRecomendadorSteps() {
  const cont = document.getElementById("recomendadorSteps");
  const resetBtn = document.getElementById("recomendadorReset");
  let html = "";

  html += `<div class="paso-bloque"><p class="paso-titulo">${PASOS_RECOMENDADOR[0].titulo}</p>`;
  html += PASOS_RECOMENDADOR[0].opciones
    .map(
      (op) => `
    <button type="button" class="paso-opcion ${estadoRecomendador.categoria === op.value ? "is-selected" : ""}" data-paso="categoria" data-valor="${op.value}">
      <span>${op.label}</span>
    </button>`,
    )
    .join("");
  html += "</div>";

  if (estadoRecomendador.categoria) {
    html += `<div class="paso-bloque"><p class="paso-titulo">${PASOS_RECOMENDADOR[1].titulo}</p>`;
    html += PASOS_RECOMENDADOR[1].opciones
      .map(
        (op) => `
      <button type="button" class="paso-opcion ${estadoRecomendador.prioridad === op.value ? "is-selected" : ""}" data-paso="prioridad" data-valor="${op.value}">
        <span>${op.label}</span>
      </button>`,
      )
      .join("");
    html += "</div>";
  }

  cont.innerHTML = html;
  resetBtn.hidden = !estadoRecomendador.categoria;
}

function resultadosRecomendador() {
  if (!estadoRecomendador.categoria) return [];
  let lista = PRODUCTOS.filter(
    (p) => p.categoria === estadoRecomendador.categoria && p.stock > 0,
  );
  if (estadoRecomendador.prioridad === "precio")
    lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estadoRecomendador.prioridad === "nuevo")
    lista = lista
      .slice()
      .sort((a, b) => (b.nuevo === true) - (a.nuevo === true));
  else
    lista = lista
      .slice()
      .sort((a, b) => (b.destacado === true) - (a.destacado === true));
  return lista.slice(0, 4);
}

function renderRecomendadorResultado() {
  const grid = document.getElementById("recomendadorGrid");
  const estado = document.getElementById("recomendadorEstado");
  const lista = resultadosRecomendador();

  if (!estadoRecomendador.categoria) {
    estado.textContent = "Elegí una categoría para empezar";
  } else if (!estadoRecomendador.prioridad) {
    estado.textContent = `Mostrando ${categoriaNombre(estadoRecomendador.categoria)} — elegí qué priorizás para afinar`;
  } else {
    estado.textContent = `Resultados en ${categoriaNombre(estadoRecomendador.categoria)}`;
  }

  const doFlip =
    typeof gsap !== "undefined" &&
    typeof window.Flip !== "undefined" &&
    !reduceMotion &&
    grid.children.length;
  const state = doFlip ? window.Flip.getState(grid.children) : null;
  renderList(grid, lista);
  if (doFlip && state) {
    window.Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.35 },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.25 }),
    });
  }
}

function initRecomendador() {
  renderRecomendadorSteps();
  renderRecomendadorResultado();

  document
    .getElementById("recomendadorSteps")
    .addEventListener("click", (e) => {
      const btn = e.target.closest("[data-paso]");
      if (!btn) return;
      if (btn.dataset.paso === "categoria") {
        estadoRecomendador.categoria = btn.dataset.valor;
        estadoRecomendador.prioridad = null;
      } else {
        estadoRecomendador.prioridad = btn.dataset.valor;
      }
      renderRecomendadorSteps();
      renderRecomendadorResultado();
    });

  document.getElementById("recomendadorReset").addEventListener("click", () => {
    estadoRecomendador.categoria = null;
    estadoRecomendador.prioridad = null;
    renderRecomendadorSteps();
    renderRecomendadorResultado();
  });
}

const CART_KEY = "casaelectrodomesticos_carrito";

function leerCarrito() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
}

let CARRITO = leerCarrito();

function agregarAlCarrito(id) {
  const producto = PRODUCTOS.find((p) => p.id === id);
  if (!producto || producto.stock <= 0) return;
  const item = CARRITO.find((i) => i.id === id);
  if (item) {
    if (item.cantidad < producto.stock) item.cantidad++;
  } else {
    CARRITO.push({ id, cantidad: 1 });
  }
  guardarCarrito(CARRITO);
  renderCarrito();
  abrirCarrito();
}

function quitarDelCarrito(id) {
  CARRITO = CARRITO.filter((i) => i.id !== id);
  guardarCarrito(CARRITO);
  renderCarrito();
}

function cambiarCantidad(id, delta) {
  const producto = PRODUCTOS.find((p) => p.id === id);
  const item = CARRITO.find((i) => i.id === id);
  if (!item || !producto) return;
  item.cantidad = Math.max(1, Math.min(producto.stock, item.cantidad + delta));
  guardarCarrito(CARRITO);
  renderCarrito();
}

function renderCarrito() {
  const body = document.getElementById("cartBody");
  const footer = document.getElementById("cartFooter");
  const badge = document.getElementById("cartBadge");
  const badgeFloat = document.getElementById("floatingCartBadge");
  const totalCantidad = CARRITO.reduce((acc, i) => acc + i.cantidad, 0);

  [badge, badgeFloat].forEach((b) => {
    b.textContent = String(totalCantidad);
    b.hidden = totalCantidad === 0;
  });

  if (CARRITO.length === 0) {
    body.innerHTML = '<p class="cart-vacio">Tu carrito está vacío.</p>';
    footer.hidden = true;
    return;
  }

  let total = 0;
  body.innerHTML = CARRITO.map((item) => {
    const producto = PRODUCTOS.find((p) => p.id === item.id);
    if (!producto) return "";
    const final = precioFinal(producto) * item.cantidad;
    total += final;
    return `
      <div class="cart-item" data-id="${producto.id}">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="64" height="64" loading="lazy">
        <div class="cart-item-info">
          <span class="cart-item-nombre">${producto.nombre}</span>
          <span class="cart-item-precio">${formatPrecio(precioFinal(producto))}</span>
          <div class="cart-item-qty">
            <button type="button" data-qty-menos="${producto.id}" aria-label="Restar unidad">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-qty-mas="${producto.id}" aria-label="Sumar unidad">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-quitar" data-quitar="${producto.id}">Quitar</button>
      </div>`;
  }).join("");

  footer.hidden = false;
  document.getElementById("cartTotal").textContent = formatPrecio(total);

  const lineas = CARRITO.map((item) => {
    const producto = PRODUCTOS.find((p) => p.id === item.id);
    return producto
      ? `${item.cantidad}x ${producto.nombre} (${formatPrecio(precioFinal(producto))} c/u)`
      : "";
  }).filter(Boolean);
  const mensaje = [
    "Hola! Quiero consultar por este pedido:",
    ...lineas,
    `Total: ${formatPrecio(total)}`,
  ].join("\n");
  const checkout = document.getElementById("cartCheckout");
  checkout.dataset.wspMsg = mensaje;
  checkout.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

function abrirCarrito() {
  document.getElementById("cartOverlay").hidden = false;
  document.getElementById("cartDrawer").removeAttribute("inert");
  requestAnimationFrame(() => {
    document.getElementById("cartOverlay").classList.add("is-open");
    document.getElementById("cartDrawer").classList.add("is-open");
  });
  document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
  document.getElementById("cartOverlay").classList.remove("is-open");
  document.getElementById("cartDrawer").classList.remove("is-open");
  document.getElementById("cartDrawer").setAttribute("inert", "");
  setTimeout(() => {
    document.getElementById("cartOverlay").hidden = true;
  }, 350);
  document.body.style.overflow = "";
}

function initCarrito() {
  renderCarrito();
  document.getElementById("cartToggle").addEventListener("click", abrirCarrito);
  document
    .getElementById("floatingCart")
    .addEventListener("click", abrirCarrito);
  document.getElementById("cartClose").addEventListener("click", cerrarCarrito);
  document
    .getElementById("cartOverlay")
    .addEventListener("click", cerrarCarrito);

  document.getElementById("cartBody").addEventListener("click", (e) => {
    const masBtn = e.target.closest("[data-qty-mas]");
    const menosBtn = e.target.closest("[data-qty-menos]");
    const quitarBtn = e.target.closest("[data-quitar]");
    if (masBtn) cambiarCantidad(Number(masBtn.dataset.qtyMas), 1);
    else if (menosBtn) cambiarCantidad(Number(menosBtn.dataset.qtyMenos), -1);
    else if (quitarBtn) quitarDelCarrito(Number(quitarBtn.dataset.quitar));
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("cartDrawer").classList.contains("is-open")
    )
      cerrarCarrito();
  });
}

function abrirModal(id) {
  const producto = PRODUCTOS.find((p) => p.id === id);
  if (!producto) return;
  const final = precioFinal(producto);
  const scroll = document.getElementById("modalScroll");
  scroll.innerHTML = `
    <div class="modal-media"><img src="${producto.imagen}" alt="${producto.nombre}" width="600" height="600"></div>
    <div class="modal-info">
      <span class="card-cat">${producto.subcategoria} · ${producto.marca}</span>
      <h2 id="modalTitulo">${producto.nombre}</h2>
      <div class="modal-precios">
        <span class="modal-precio">${formatPrecio(final)}</span>
        ${producto.descuento ? `<span class="card-precio-antes">${formatPrecio(producto.precio)}</span><span class="badge badge-sale">-${producto.descuento}%</span>` : ""}
      </div>
      <p class="modal-desc">${producto.descripcion}</p>
      <ul class="modal-specs">${producto.caracteristicas.map((c) => `<li>${c}</li>`).join("")}</ul>
      <button type="button" class="btn btn-cta modal-agregar" data-agregar="${producto.id}" ${producto.stock <= 0 ? "disabled" : ""}>${producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}</button>
    </div>`;

  document.getElementById("modalOverlay").hidden = false;
  const modal = document.getElementById("modalProducto");
  modal.setAttribute("aria-labelledby", "modalTitulo");
  modal.removeAttribute("inert");
  requestAnimationFrame(() => {
    document.getElementById("modalOverlay").classList.add("is-open");
    modal.classList.add("is-open");
  });
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("is-open");
  const modal = document.getElementById("modalProducto");
  modal.classList.remove("is-open");
  modal.setAttribute("inert", "");
  setTimeout(() => {
    document.getElementById("modalOverlay").hidden = true;
  }, 300);
  document.body.style.overflow = "";
}

function initModal() {
  document.getElementById("modalClose").addEventListener("click", cerrarModal);
  document
    .getElementById("modalOverlay")
    .addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("modalProducto").classList.contains("is-open")
    )
      cerrarModal();
  });
}

function initAcciones() {
  document.addEventListener("click", (e) => {
    const agregarBtn = e.target.closest("[data-agregar]");
    const quickBtn = e.target.closest("[data-quick]");
    if (agregarBtn) {
      agregarAlCarrito(Number(agregarBtn.dataset.agregar));
    } else if (quickBtn) {
      abrirModal(Number(quickBtn.dataset.quick));
    }
  });
}

function initNav() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("navToggle");
  const close = document.getElementById("navClose");
  const scrim = document.getElementById("navScrim");
  const desktopMq = window.matchMedia("(min-width: 641px)");

  function abrir() {
    nav.classList.add("is-open");
    nav.removeAttribute("inert");
    scrim.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function cerrar() {
    nav.classList.remove("is-open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    else nav.removeAttribute("inert");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", abrir);
  close.addEventListener("click", cerrar);
  scrim.addEventListener("click", cerrar);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });
  desktopMq.addEventListener("change", () => cerrar());
  cerrar();
}

function initWspLinks() {
  document.querySelectorAll("[data-wsp-msg]").forEach((a) => {
    const msg = a.dataset.wspMsg;
    if (!msg) return;
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
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
      vp.setPointerCapture?.(pointerId);
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = (e) => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId))
      return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
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

function initRailWheel(vp) {
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
}

function initReveals() {
  const els = document.querySelectorAll("[data-animate]");
  if (typeof gsap === "undefined" || reduceMotion) {
    els.forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }
  els.forEach((el) => {
    gsap.to(el, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: "expo.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

function initRevealsStagger() {
  const contenedores = document.querySelectorAll("[data-animate-stagger]");
  if (typeof gsap === "undefined" || reduceMotion) {
    contenedores.forEach((cont) => {
      [...cont.children].forEach((child) => {
        child.style.opacity = 1;
        child.style.transform = "none";
      });
    });
    return;
  }
  contenedores.forEach((cont) => {
    const hijos = [...cont.children];
    gsap.set(hijos, { opacity: 0, y: 26 });
    gsap.to(hijos, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.14,
      scrollTrigger: { trigger: cont, start: "top 85%", once: true },
    });
  });
}

function initAntiCopia() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && ["u", "s", "c"].includes(e.key.toLowerCase()))
      e.preventDefault();
  });
}

function initJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Casa Electrodomésticos",
    description:
      "Electrodomésticos en Misiones: heladeras, lavarropas, aires acondicionados, TVs y pequeños electrodomésticos.",
    areaServed: "Misiones, Argentina",
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "$$",
    makesOffer: PRODUCTOS.map((p) => ({
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precioFinal(p),
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemOffered: {
        "@type": "Product",
        name: p.nombre,
        brand: p.marca,
        category: categoriaNombre(p.categoria),
        image: `${location.origin}${location.pathname.replace("index.html", "")}${p.imagen}`,
      },
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function initLenis() {
  if (
    typeof Lenis === "undefined" ||
    typeof gsap === "undefined" ||
    reduceMotion
  )
    return;
  const lenis = new Lenis();
  window.lenis = lenis;
  lenis.on("scroll", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("anioActual").textContent = new Date().getFullYear();

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.Flip !== "undefined") gsap.registerPlugin(window.Flip);
  }

  initDestacados();
  initCategorias();
  initFiltros();
  renderCatalogo();
  initRecomendador();
  initCarrito();
  initModal();
  initAcciones();
  initNav();
  initWspLinks();
  initRailDrag(document.getElementById("railDestacados"));
  initRailWheel(document.getElementById("railDestacados"));
  initAntiCopia();
  initJsonLd();
  initLenis();
  initReveals();
  initRevealsStagger();

  window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
});
