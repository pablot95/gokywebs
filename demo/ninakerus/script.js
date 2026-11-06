const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5493834378327';
const MARCA = 'Ninakerus';
const URL_DEMO = 'https://gokywebs.com/demo/ninakerus/';
const TONOS = [{"id": "fucsias", "nombre": "Fucsias y verdes", "hex": "#A32A6E"}, {"id": "multicolor", "nombre": "Multicolor", "hex": "conic-gradient(#D9573F, #E6B33D, #3E8C66, #4A6FB0, #A32A6E, #D9573F)"}, {"id": "lilas", "nombre": "Lilas y azules", "hex": "#8088C4"}, {"id": "negros", "nombre": "Sobre negro", "hex": "#2A2430"}];
const CATEGORIAS = [{"id": "obras", "nombre": "Obras en caballete", "bajada": "Originales listos para colgar", "opcion": "Formato", "img": "images/c-obras.webp", "alt": "Detalle de una pintura con pájaros de colores entre hojas"}, {"id": "indumentaria", "nombre": "Indumentaria", "bajada": "Remeras, gorras y buzos", "opcion": "Talle", "img": "images/c-indumentaria.webp", "alt": "Gorra negra con un brote rosado bordado al frente"}];
const PRECIOS = [{"id": "hasta30", "nombre": "Hasta $30.000", "min": 0, "max": 30000}, {"id": "30a100", "nombre": "$30.000 a $100.000", "min": 30000, "max": 100000}, {"id": "mas100", "nombre": "Más de $100.000", "min": 100000, "max": null}];
const PRODUCTOS = [{"id": "hibiscos-al-sol", "rango": 1, "cat": "obras", "tono": "fucsias", "nombre": "Hibiscos al sol", "nota": "Obra original en caballete", "etiqueta": "Obra única", "stock": 1, "opciones": [{"id": "original", "nombre": "Original · 60 × 80 cm", "corto": "60 × 80 cm", "precio": 240000}], "img": "images/p-hibiscos-al-sol.webp", "alt": "Pintura de hibiscos fucsias con hojas verdes, apoyada en un caballete de madera junto a una ventana", "historia": "Tres hibiscos abiertos y un pimpollo, pintados con espátula para que los pétalos tengan relieve. El fondo verde claro deja que el fucsia sea lo primero que se ve desde la otra punta del cuarto.", "ficha": [["Técnica", "Pintura con espátula sobre tela"], ["Medida", "60 × 80 cm"], ["Cuidados", "Colgar lejos del sol directo; limpiar con un pincel seco."]], "claves": ["cuadro", "pintura", "flores", "hibisco", "fucsia", "magenta", "rosa", "verde", "original", "oleo", "espatula"]}, {"id": "remera-jardin-de-hibiscos", "rango": 2, "cat": "indumentaria", "tono": "multicolor", "nombre": "Remera Jardín de hibiscos", "nota": "Algodón crudo, estampa ilustrada", "opciones": [{"id": "s", "nombre": "Talle S", "corto": "S", "precio": 29000}, {"id": "m", "nombre": "Talle M", "corto": "M", "precio": 29000}, {"id": "l", "nombre": "Talle L", "corto": "L", "precio": 29000}, {"id": "xl", "nombre": "Talle XL", "corto": "XL", "precio": 29000}, {"id": "xxl", "nombre": "Talle XXL", "corto": "XXL", "precio": 29000}], "img": "images/p-remera-jardin-de-hibiscos.webp", "alt": "Remera color crudo con estampa de hibiscos rojos y amarillos y flores silvestres", "historia": "Hibiscos, lantanas y flores silvestres en un mismo ramo: es el jardín de los murales llevado a una remera. La estampa va al frente y cubre todo el pecho.", "ficha": [["Material", "Algodón, color crudo"], ["Talles", "S a XXL"], ["Cuidados", "Lavar del revés en agua fría y planchar del revés."]], "claves": ["remera", "remeras", "algodon", "crudo", "flores", "hibisco", "estampa", "ropa"]}, {"id": "pajaros-entre-hojas", "rango": 3, "cat": "obras", "tono": "multicolor", "nombre": "Pájaros entre hojas", "nota": "Obra original enmarcada", "etiqueta": "Obra única", "stock": 1, "opciones": [{"id": "original", "nombre": "Original · 50 × 50 cm", "corto": "50 × 50 cm", "precio": 210000}], "img": "images/p-pajaros-entre-hojas.webp", "alt": "Pintura de dos pájaros de colores entre hojas, con marco dorado y paspartú blanco", "historia": "Dos pájaros, uno rojo y uno amarillo, entre ramas y hojas de todos los colores. Las pinceladas cortas arman un follaje que cambia según desde dónde se lo mire.", "ficha": [["Técnica", "Pintura sobre tela"], ["Medida", "50 × 50 cm, con marco dorado y paspartú"], ["Cuidados", "Limpiar el vidrio y el marco con un paño seco."]], "claves": ["cuadro", "pintura", "pajaros", "aves", "hojas", "colores", "marco", "original"]}, {"id": "gorra-brote-rosa", "rango": 4, "cat": "indumentaria", "tono": "negros", "nombre": "Gorra Brote rosa", "nota": "Gabardina negra con bordado", "opciones": [{"id": "unico", "nombre": "Talle único, regulable", "corto": "Único", "precio": 24000}], "img": "images/p-gorra-brote-rosa.webp", "alt": "Gorra negra con un brote de pétalos rosados bordado al frente", "historia": "Un brote con tres pétalos rosados y hojas verdes, bordado al frente. Es el detalle más chico de la colección floral, para usar todos los días.", "ficha": [["Material", "Gabardina de algodón negra, bordado"], ["Talle", "Único, con regulador"], ["Cuidados", "Lavar a mano; no usar secarropas."]], "claves": ["gorra", "gorras", "bordado", "negra", "rosa", "flor", "ropa"]}, {"id": "hortensias-con-limones", "rango": 5, "cat": "obras", "tono": "lilas", "nombre": "Hortensias con limones", "nota": "Naturaleza muerta en caballete", "etiqueta": "Obra única", "stock": 1, "opciones": [{"id": "original", "nombre": "Original · 40 × 40 cm", "corto": "40 × 40 cm", "precio": 165000}], "img": "images/p-hortensias-con-limones.webp", "alt": "Pintura de un jarro blanco con hortensias azules, lilas y blancas y tres limones", "historia": "Un jarro blanco con hortensias azules, lilas y blancas, y tres limones sobre la mesa. El amarillo de los limones equilibra el frío de las flores.", "ficha": [["Técnica", "Pintura con espátula sobre tela"], ["Medida", "40 × 40 cm"], ["Cuidados", "Colgar lejos del sol directo; limpiar con un pincel seco."]], "claves": ["cuadro", "pintura", "hortensias", "limones", "flores", "azul", "lila", "naturaleza muerta", "original"]}, {"id": "buzo-lirios-de-noche", "rango": 6, "cat": "indumentaria", "tono": "negros", "nombre": "Buzo Lirios de noche", "nota": "Frisa negra con capucha, estampa ilustrada", "opciones": [{"id": "s", "nombre": "Talle S", "corto": "S", "precio": 56000}, {"id": "m", "nombre": "Talle M", "corto": "M", "precio": 56000}, {"id": "l", "nombre": "Talle L", "corto": "L", "precio": 56000}, {"id": "xl", "nombre": "Talle XL", "corto": "XL", "precio": 56000}], "img": "images/p-buzo-lirios-de-noche.webp", "alt": "Buzo negro con capucha y estampa de lirios fucsias y naranjas en el frente y las mangas", "historia": "Lirios fucsias y naranjas que se abren sobre el negro, en el frente y en las mangas. Pinceladas sueltas, como si el buzo fuera la tela de un cuadro.", "ficha": [["Material", "Frisa de algodón negra"], ["Talles", "S a XL"], ["Cuidados", "Lavar del revés en agua fría; no usar secarropas."]], "claves": ["buzo", "buzos", "canguro", "capucha", "negro", "lirios", "flores", "fucsia", "estampa", "ropa"]}, {"id": "lamina-hibiscos", "rango": 99, "cat": "obras", "tono": "fucsias", "nombre": "Lámina Hibiscos al sol", "nota": "Producto oculto", "visible": false, "opciones": [{"id": "a4", "nombre": "Lámina A4", "corto": "A4", "precio": 18000}], "img": "images/p-hibiscos-al-sol.webp", "alt": "Producto oculto", "historia": "Producto oculto de prueba.", "ficha": [], "claves": ["lamina"]}];
const MURALES = [{"id": "mural-fachada", "espacio": "fachada", "lugar": "Fachada de local", "nombre": "Hibiscos en la fachada", "tecnica": "Pintura sobre revoque exterior", "img": "images/m-fachada.webp", "w": 1200, "h": 900, "alt": "Fachada blanca de un local con un mural de hibiscos fucsias y hojas verdes alrededor de la ventana y la puerta", "corta": "Las flores enmarcan la ventana y la puerta para que el local se reconozca desde la vereda.", "historia": "Las flores enmarcan la ventana y la puerta verde para que el local se reconozca desde la vereda. Hojas y pimpollos siguen las aberturas, y las flores grandes quedan a la altura de la mirada."}, {"id": "mural-pileta", "espacio": "pileta", "lugar": "Pileta", "nombre": "Selva junto al agua", "tecnica": "Pintura sobre muro exterior", "img": "images/m-pileta.webp", "w": 1000, "h": 1000, "alt": "Mural de hibiscos, aves del paraíso y hojas tropicales en la pared del fondo de una pileta", "corta": "Hibiscos, aves del paraíso y monsteras que se reflejan en el agua.", "historia": "Hibiscos rojos, rosados y amarillos, aves del paraíso y hojas de monstera sobre la pared del fondo. El verde se refleja en el agua y la pileta parece parte del jardín."}, {"id": "mural-quincho", "espacio": "quincho", "lugar": "Quincho", "nombre": "Geometría en el quincho", "tecnica": "Pintura sobre revoque interior", "img": "images/m-quincho.webp", "w": 1000, "h": 1000, "alt": "Mural geométrico en verde, mostaza, petróleo y terracota en la pared de un quincho con parrilla de ladrillo", "corta": "Curvas y triángulos con los mismos tonos del ladrillo de la parrilla.", "historia": "Curvas y triángulos en verde, mostaza, petróleo y terracota, los mismos tonos del ladrillo de la parrilla. Un diseño sin figuras para un lugar de reunión que se usa todo el año."}];
const ESPACIOS = [{"id": "fachada", "nombre": "Fachada de local", "texto": "Mandanos una foto de la fachada con el ancho y el alto de la pared: pensamos un diseño que se vea desde la vereda.", "msg": "Hola Ninakerus! Quiero consultar por un mural para la fachada de mi local."}, {"id": "pileta", "nombre": "Pileta", "texto": "Mandanos una foto de la pared y del entorno: elegimos colores que acompañen el agua y el verde del jardín.", "msg": "Hola Ninakerus! Quiero consultar por un mural para la pared de mi pileta."}, {"id": "quincho", "nombre": "Quincho", "texto": "Mandanos una foto del quincho con la parrilla: armamos la paleta a partir de los materiales que ya están.", "msg": "Hola Ninakerus! Quiero consultar por un mural para mi quincho."}, {"id": "otro", "nombre": "Otro espacio", "texto": "Living, local, consultorio o habitación: mandanos una foto de la pared y contanos qué te imaginás.", "msg": "Hola Ninakerus! Quiero consultar por un mural para otro espacio."}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const tonoDe = id => TONOS.find(t => t.id === id) || null;
const desde = p => Math.min(...(p.opciones || []).map(o => o.precio));
const opcionDe = (p, o) => (p?.opciones || []).find(x => x.id === o) || null;
const opcionValida = (p, o) => (opcionDe(p, o) ? o : '');
const esUnica = p => (p?.stock ?? TOPE_LINEA) === 1;
const topeDe = p => Math.max(1, Math.min(p?.stock ?? TOPE_LINEA, TOPE_LINEA));
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  return !!r && (p.opciones || []).some(o => o.precio >= r.min && (r.max == null || o.precio < r.max));
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.historia, catDe(p.cat)?.nombre, tonoDe(p.tono)?.nombre,
    ...(p.ficha || []).map(f => f[1]), ...(p.opciones || []).map(o => o.nombre), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tono = lista(f.tono), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tono.length && !tono.includes(p.tono)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const muralDe = id => MURALES.find(m => m.id === id) || null;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const precioLinea = i => opcionDe(getProducto(i.id), i.o)?.precio || 0;
const detalleLinea = i => {
  const p = getProducto(i.id);
  const o = opcionDe(p, i.o);
  if (!p || !o) return '';
  return esUnica(p) ? `Original ${o.corto}` : (o.corto === 'Único' ? 'Talle único' : `Talle ${o.corto}`);
};

const Cart = {
  KEY: 'ninakerus_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, o, qty = 1) {
    if (!producto) return 0;
    const oo = opcionValida(producto, o);
    if (!oo) return 0;
    const tope = topeDe(producto);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, tope));
    const existing = items.find(i => i.id === producto.id && i.o === oo);
    if (existing) {
      const antes = existing.qty;
      existing.qty = Math.min(existing.qty + n, tope);
      if (existing.qty === antes) return 0;
      this.save(items);
      return existing.qty - antes;
    }
    items.push({ id: producto.id, o: oo, qty: n });
    this.save(items);
    return n;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items[k];
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, topeDe(getProducto(it.id))));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter((_, j) => j !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + precioLinea(i) * i.qty, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      const o = p && opcionValida(p, i.o);
      if (!p || !o) { changed = true; return; }
      const tope = topeDe(p);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, tope));
      const previa = limpias.find(x => x.id === p.id && x.o === o);
      if (previa) { previa.qty = Math.min(previa.qty + qty, tope); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push({ id: p.id, o, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1, max = TOPE_LINEA) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno"${max <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>`;
const opcionSelectHTML = (p, o = '') => {
  if (p.opciones.length === 1) return `<span class="opc-fija">${esc(esUnica(p) ? p.opciones[0].corto : p.opciones[0].nombre)}</span>`;
  const actual = opcionValida(p, o) || p.opciones[0].id;
  return `<select class="opc-sel" data-opc-sel aria-label="${esc(catDe(p.cat).opcion)} de ${esc(p.nombre)}">${p.opciones.map(x => `<option value="${esc(x.id)}"${x.id === actual ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select>`;
};
const puntoHTML = t => `<span class="punto" style="background:${esc(t?.hex || '#ccc')}"></span>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(60px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', opcion = '' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const o = opcionDe(p, opcionValida(p, opcion)) || p.opciones[0];
  const etq = p.etiqueta ? `<span class="prod__etq">${esc(p.etiqueta)}</span>` : '';
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle y la historia de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="640" height="800" decoding="async"><span class="prod__pill" aria-hidden="true">Ver reseña</span></button>${etq}</div>
  <div class="prod__info">
    <p class="prod__cat">${puntoHTML(tonoDe(p.tono))}${esc(catDe(p.cat).nombre)}</p>
    <h3 class="prod__nombre">${esc(p.nombre)}</h3>
    <p class="prod__precio" data-precio>${formatearPrecio(o.precio)}</p>
    <div class="prod-actions">${opcionSelectHTML(p, o.id)}<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <div class="prod__links"><button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora</button><button type="button" class="prod__resena" data-qv="${esc(p.id)}">Ver reseña ${ICO.flecha}</button></div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'pieza', 'piezas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleLinea(i)}) — ${formatearPrecio(precioLinea(i) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el envío o el retiro?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const tope = topeDe(p);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="640" height="800">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleLinea(i))}</p>
    <div class="linea__fila">
      ${tope > 1 ? `<div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-k="${k}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${k}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>` : '<span class="linea__unica">Obra única</span>'}
      <p class="linea__precio">${formatearPrecio(precioLinea(i) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${k}" aria-label="Quitar ${esc(p.nombre)}, ${esc(detalleLinea(i))}">${ICO.x}</button>
</li>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'pieza', 'piezas') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = Number(paso.dataset.k);
      const it = Cart.get()[k];
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-k="${k}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const k = Number(q.dataset.quitar);
    const it = Cart.get()[k];
    const p = it && getProducto(it.id);
    const det = it ? detalleLinea(it) : '';
    Cart.remove(k);
    if (p) showToast(`Sacaste «${p.nombre}» (${det}) del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, o, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${detalleLinea({ id: p.id, o })}) al carrito`);
  else if (esUnica(p)) showToast(`«${p.nombre}» ya está en tu carrito: es una obra única`);
  else showToast(`Llegaste al máximo de «${p.nombre}» por pedido`);
}

function sumar(id, o, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, o, qty);
  avisoSumado(p, o, n);
  if (n && boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-opc-sel]');
    if (!sel) return;
    const card = sel.closest('.prod');
    const p = card && getProducto(card.dataset.id);
    const o = opcionDe(p, sel.value);
    const out = card?.querySelector('[data-precio]');
    if (o && out) out.textContent = formatearPrecio(o.precio);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const card = b.closest('.prod');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const p = getProducto(id);
      if (!p) return;
      const o = opcionValida(p, card?.querySelector('[data-opc-sel]')?.value) || p.opciones[0].id;
      const n = sumar(id, o, 1, b);
      if (c && (n || esUnica(p))) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      const card = qv.closest('.prod');
      abrirVistaRapida(qv.dataset.qv, { previo: qv, o: card?.querySelector('[data-opc-sel]')?.value });
      return;
    }
    const mu = e.target.closest('[data-mural]');
    if (mu) { e.preventDefault(); abrirMural(mu.dataset.mural, { previo: mu }); }
  });
}

const qrHTML = (archivo, titulo, texto) => `<div class="qv__qr"><img src="images/${esc(archivo)}" alt="Código QR que abre esta historia en el celular" width="112" height="112"><p><b>${esc(titulo)}</b><small>${esc(texto)}</small></p></div>`;

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p, o) {
  const rel = relacionados(p);
  const op = opcionDe(p, o) || p.opciones[0];
  const unica = esUnica(p);
  const label = catDe(p.cat).opcion;
  const opciones = p.opciones.length > 1
    ? `<div class="qv__opciones" role="group" aria-label="${esc(label)}">${p.opciones.map(x => `<button type="button" class="qv__op" data-qv-op="${esc(x.id)}" aria-pressed="${x.id === op.id}">${esc(x.corto)}</button>`).join('')}</div>`
    : `<p class="qv__fija">${esc(op.nombre)}${unica ? ' · <b>Obra única</b>' : ''}</p>`;
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="640" height="800"></figure>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(catDe(p.cat).nombre)}${p.etiqueta ? `<span class="prod__etq prod__etq--qv">${esc(p.etiqueta)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    <p class="qv__precio" data-qv-precio>${formatearPrecio(op.precio)}</p>
    <div class="qv__bloque"><p class="qv__label">${esc(label)}</p>${opciones}</div>
    <div class="qv__acciones">${unica ? '' : stepperHTML(1, topeDe(p))}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <div class="qv__historia"><p class="qv__label">La historia del diseño</p><p>${esc(p.historia)}</p></div>
    <dl class="qv__ficha">${(p.ficha || []).map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('')}</dl>
    ${qrHTML(`qr-${p.id}.svg`, 'El QR de esta pieza', unica ? 'Escanealo para leer esta historia en el celular. Va en la etiqueta, detrás del cuadro.' : 'Escanealo para leer esta historia en el celular. Va en la etiqueta de la prenda.')}
    <a class="qv__wsp" href="${esc(wspHref(`Hola ${MARCA}! Quiero consultar por «${p.nombre}».`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="640" height="800"><span>${esc(r.nombre)}</span><small>${formatearPrecio(desde(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, o = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const oo = opcionValida(p, o) || p.opciones[0].id;
  qvEstado = { tipo: 'producto', id: p.id, o: oo };
  modal.setAttribute('aria-label', `Detalle de ${p.nombre}`);
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, oo);
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { setParam('producto', null); setParam('mural', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('mural', null);
  setParam('producto', p.id);
}

function muralHTML(m) {
  return `<div class="qv__grid qv__grid--mural" data-id="${esc(m.id)}">
  <div class="qv__media">
    <figure class="qv__foto qv__foto--mural"><img src="${esc(m.img)}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}"></figure>
  </div>
  <div class="qv__info">
    <p class="qv__cat">Mural · ${esc(m.lugar)}</p>
    <h2>${esc(m.nombre)}</h2>
    <div class="qv__historia"><p class="qv__label">La historia del mural</p><p>${esc(m.historia)}</p></div>
    <dl class="qv__ficha"><div><dt>Espacio</dt><dd>${esc(m.lugar)}</dd></div><div><dt>Técnica</dt><dd>${esc(m.tecnica)}</dd></div></dl>
    ${qrHTML(`qr-${m.id}.svg`, 'El QR de este mural', 'Escanealo para leer esta historia en el celular. Va en una placa, al lado del mural.')}
    <a class="btn btn--cta btn--block" href="${esc(wspHref(`Hola ${MARCA}! Vi el mural «${m.nombre}» en la web y quiero uno para mi espacio.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Quiero un mural así</span></a>
  </div>
</div>
<div class="qv__rel qv__rel--murales"><h3>Otros murales</h3><ul>${MURALES.filter(x => x.id !== m.id).map(x => `<li><button type="button" data-qv-mural="${esc(x.id)}"><img src="${esc(x.img)}" alt="" width="${x.w}" height="${x.h}"><span>${esc(x.nombre)}</span><small>${esc(x.lugar)}</small></button></li>`).join('')}</ul></div>`;
}
function abrirMural(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const m = muralDe(id);
  if (!modal || !m) return;
  qvEstado = { tipo: 'mural', id: m.id };
  modal.setAttribute('aria-label', `Historia del mural ${m.nombre}`);
  modal.querySelector('[data-qv-body]').innerHTML = muralHTML(m);
  modal.querySelector('.qv__panel').scrollTop = 0;
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { setParam('producto', null); setParam('mural', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', null);
  setParam('mural', m.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const otroMural = e.target.closest('[data-qv-mural]');
    if (otroMural) { abrirMural(otroMural.dataset.qvMural, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const p = qvEstado?.tipo === 'producto' && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const op = e.target.closest('[data-qv-op]');
    if (op) {
      qvEstado.o = op.dataset.qvOp;
      cont.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === op)));
      cont.querySelector('[data-qv-precio]').textContent = formatearPrecio(opcionDe(p, qvEstado.o)?.precio || 0);
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      const n = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), topeDe(p)));
      out.textContent = n;
      cont.querySelector('[data-paso="-1"]').disabled = n <= 1;
      cont.querySelector('[data-paso="1"]').disabled = n >= topeDe(p);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const out = cont.querySelector('[data-qty]');
      const qty = parseInt(out?.textContent, 10) || 1;
      const n = Cart.add(p, qvEstado.o, qty);
      if (out) { out.textContent = '1'; cont.querySelector('[data-paso="-1"]').disabled = true; cont.querySelector('[data-paso="1"]').disabled = topeDe(p) <= 1; }
      if (comprar && (n || esUnica(p))) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); if (!n) avisoSumado(p, qvEstado.o, n); }
      else avisoSumado(p, qvEstado.o, n);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.historia, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desde(p), highPrice: Math.max(...p.opciones.map(o => o.precio)), offerCount: p.opciones.length, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['tono', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="640" height="480"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'pieza', 'piezas')}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    box.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}

function initGrillaHome() {
  const cont = document.querySelector('[data-grilla-home]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 6 }).items.map(p => cardHTML(p, { anim: 'subir' })).join('');
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('select')) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initDonde() {
  const sec = document.getElementById('galeria');
  if (!sec) return;
  const ops = [...sec.querySelectorAll('[data-donde]')];
  const txt = sec.querySelector('[data-donde-txt]');
  const qr = sec.querySelector('[data-donde-qr]');
  const wsp = sec.querySelector('[data-donde-wsp]');
  ops.forEach(b => b.addEventListener('click', () => {
    const e = ESPACIOS.find(x => x.id === b.dataset.donde);
    if (!e || sec.dataset.espacio === e.id) return;
    sec.dataset.espacio = e.id;
    ops.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    if (txt) txt.textContent = e.texto;
    if (qr) { qr.src = `images/qr-wsp-${e.id}.svg`; qr.alt = `Código QR que abre WhatsApp con la consulta por un mural para ${e.nombre.toLowerCase()}`; }
    if (wsp) wsp.href = wspHref(e.msg);
    if (!reduceMotion) { sec.classList.remove('donde-cambio'); void sec.offsetWidth; sec.classList.add('donde-cambio'); }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, tono: TONOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    tono: valida(params.get('tono'), TONOS),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n, extra = '') => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}>${extra}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = panel.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }), k === 'tono' ? puntoHTML(it) : '')).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return nombreDe(CATEGORIAS, e.cat[0]);
    if (solo('tono')) return `Paleta: ${nombreDe(TONOS, e.tono[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Toda la tienda';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Tienda'} — ${MARCA}, obras en caballete e indumentaria`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t === nombreDe(CATEGORIAS, id)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'pieza' : 'piezas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
}

function initDeepLink() {
  const params = new URLSearchParams(location.search);
  const id = params.get('producto');
  const mu = params.get('mural');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
  if (!id && mu && muralDe(mu)) setTimeout(() => abrirMural(mu), 80);
  else if (mu && !muralDe(mu)) setParam('mural', null);
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desdeA('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  const h1 = hero.querySelectorAll('h1');
  if (h1.length) tl.fromTo(h1, { clipPath: 'inset(-12% 100% -12% 0%)', x: -18 }, { clipPath: 'inset(-12% 0% -12% 0%)', x: 0, duration: 1.3, clearProps: 'clipPath,transform' }, 0.2);
  desdeA('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero-ficha', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initRail();
initGrillaHome();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initRails();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initDonde();
initFloats();
initModelBarScroll();
initDeepLink();
Cart.sync();
updateCartBadge();
