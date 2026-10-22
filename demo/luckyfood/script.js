const WA = '5491154236606';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'quesos', nombre: 'Quesos', img: 'images/cat-quesos.webp' },
  { id: 'fiambres', nombre: 'Fiambres', img: 'images/cat-fiambres.webp' },
  { id: 'especialidades', nombre: 'Especialidades', img: 'images/cat-especialidades.webp' },
];
const TIPOS = { duro: 'Pasta dura', semiduro: 'Semiduro', blando: 'Blando', fresco: 'Fresco', curado: 'Curado', cocido: 'Cocido', ahumado: 'Ahumado', embutido: 'Embutido' };
const USOS = { tablas: 'Tablas y picadas', sandwiches: 'Sándwiches', cocina: 'Cocina', pizzas: 'Pizzería' };
const PRECIOS = { 'hasta-20': [0, 20000], '20-26': [20001, 26000], 'mas-26': [26001, Infinity] };

const PRODUCTOS = [
  {
    id: 'reggianito', nombre: 'Reggianito', cat: 'quesos', tipo: 'duro', usos: ['tablas', 'cocina', 'pizzas'], unidad: 'Horma', peso: 7, precioKg: 21500, stock: 14,
    img: 'images/p-reggianito.webp', alt: 'Trozo de queso de pasta dura y granulosa con lascas sueltas sobre piedra clara',
    corto: 'Pasta dura y granulosa, para rallar o en lascas.',
    desc: 'Horma de pasta dura, de sabor intenso y textura granulosa. Rinde rallado sobre pastas y en lascas para tablas.',
    rango: 1, alta: 20260801,
  },
  {
    id: 'jamon-crudo', nombre: 'Jamón crudo feteado', cat: 'fiambres', tipo: 'curado', usos: ['tablas', 'sandwiches'], unidad: 'Bandeja', peso: 0.5, precioKg: 39800, stock: 30,
    img: 'images/p-jamon-crudo.webp', alt: 'Fetas finas de jamón crudo apiladas en una bandeja blanca',
    corto: 'Feteado fino e intercalado, listo para servir.',
    desc: 'Jamón crudo estacionado, feteado fino e intercalado. Listo para tablas, sándwiches y pizzas recién salidas del horno.',
    rango: 2, alta: 20260810,
  },
  {
    id: 'brie', nombre: 'Brie', cat: 'especialidades', tipo: 'blando', usos: ['tablas'], unidad: 'Horma', peso: 1, precioKg: 31900, stock: 3,
    img: 'images/p-brie.webp', alt: 'Horma de brie de corteza blanca con una porción cortada',
    corto: 'Corteza blanca y pasta untuosa.',
    desc: 'Horma de corteza blanca y pasta untuosa, de sabor suave a hongos. Se sirve a temperatura ambiente en tablas.',
    rango: 3, alta: 20260820,
  },
  {
    id: 'salame-milan', nombre: 'Salame tipo Milán', cat: 'fiambres', tipo: 'embutido', usos: ['tablas', 'sandwiches', 'pizzas'], unidad: 'Pieza', peso: 1.5, precioKg: 22800, stock: 18,
    img: 'images/p-salame-milan.webp', alt: 'Salame de corteza blanca cortado en rodajas sobre una tabla de madera',
    corto: 'Picado fino, se fetea parejo.',
    desc: 'Salame de picado fino y sabor suave, con corteza enmohecida. Se fetea parejo para sándwiches, pizzas y tablas.',
    rango: 4, alta: 20260805,
  },
  {
    id: 'queso-azul', nombre: 'Queso azul', cat: 'especialidades', tipo: 'blando', usos: ['tablas', 'cocina'], unidad: 'Horma', peso: 2.5, precioKg: 25600, stock: 9,
    img: 'images/p-azul.webp', alt: 'Porción de queso azul con vetas de hongos sobre un plato claro',
    corto: 'Vetas azules y sabor intenso.',
    desc: 'Queso de pasta cremosa con vetas de hongos azules y sabor intenso. Para tablas, salsas y ensaladas.',
    rango: 5, alta: 20260815,
  },
  {
    id: 'jamon-cocido', nombre: 'Jamón cocido natural', cat: 'fiambres', tipo: 'cocido', usos: ['sandwiches', 'pizzas'], unidad: 'Pieza', peso: 4.5, precioKg: 15600, stock: 22,
    img: 'images/p-jamon-cocido.webp', alt: 'Pieza de jamón cocido con fetas cortadas sobre una pizarra',
    corto: 'Pieza entera para fetear en el mostrador.',
    desc: 'Pieza de jamón cocido natural, de corte parejo y poca grasa, para fetear en la máquina del mostrador.',
    rango: 6, alta: 20260801,
  },
  {
    id: 'queso-campo', nombre: 'Queso de campo estacionado', cat: 'quesos', tipo: 'semiduro', usos: ['tablas', 'sandwiches'], unidad: 'Horma', peso: 4, precioKg: 19600, stock: 11,
    img: 'images/p-queso-campo.webp', alt: 'Horma de queso de corteza natural con una porción cortada sobre una tabla',
    corto: 'Corteza natural y pasta cremosa con ojos chicos.',
    desc: 'Horma de corteza natural, estacionada, con pasta semidura y cremosa. Va en cubos en la tabla o en fetas gruesas.',
    rango: 7, alta: 20260812,
  },
  {
    id: 'bondiola', nombre: 'Bondiola curada', cat: 'especialidades', tipo: 'curado', usos: ['tablas', 'sandwiches'], unidad: 'Pieza', peso: 1.8, precioKg: 33500, stock: 8,
    img: 'images/p-bondiola.webp', alt: 'Bondiola curada con fetas finas sobre una pizarra oscura',
    corto: 'Curada y estacionada, se fetea fino.',
    desc: 'Bondiola de cerdo curada y estacionada, de vetas marcadas y sabor profundo. Se fetea fino para tablas y sándwiches.',
    rango: 8, alta: 20261005,
  },
  {
    id: 'mozzarella', nombre: 'Mozzarella fresca', cat: 'quesos', tipo: 'fresco', usos: ['pizzas', 'cocina'], unidad: 'Pack', peso: 1, precioKg: 11900, stock: 40,
    img: 'images/p-mozzarella.webp', alt: 'Bocha de mozzarella fresca abierta al medio sobre un plato blanco',
    corto: 'Pasta hilada fresca, en bochas.',
    desc: 'Mozzarella fresca de pasta hilada, en bochas. Funde y estira: pensada para pizzerías, sándwiches y ensaladas.',
    rango: 9, alta: 20260801,
  },
  {
    id: 'salame-grueso', nombre: 'Salame picado grueso', cat: 'fiambres', tipo: 'embutido', usos: ['tablas'], unidad: 'Pieza', peso: 0.8, precioKg: 24900, stock: 16,
    img: 'images/p-salame-grueso.webp', alt: 'Dos salames de picado grueso, uno cortado, sobre fondo oscuro',
    corto: 'Picado grueso y especiado, para tablas.',
    desc: 'Salame de picado grueso con pimienta en grano y sabor intenso. Luce en tablas y picadas cortado en rodajas al bies.',
    rango: 10, alta: 20260825,
  },
  {
    id: 'sardo', nombre: 'Sardo', cat: 'quesos', tipo: 'duro', usos: ['cocina', 'tablas'], unidad: 'Horma', peso: 3.5, precioKg: 18400, stock: 12,
    img: 'images/p-sardo.webp', alt: 'Trozo de queso duro con lascas y un cuchillo sobre papel',
    corto: 'Sabor marcado, para rallar y gratinar.',
    desc: 'Queso de pasta dura y sabor marcado, algo picante. Se usa rallado en salsas y gratinados o en cubos para picadas.',
    rango: 11, alta: 20260802,
  },
  {
    id: 'lomo-ahumado', nombre: 'Lomo de cerdo ahumado', cat: 'fiambres', tipo: 'ahumado', usos: ['sandwiches', 'tablas'], unidad: 'Pieza', peso: 2, precioKg: 26400, stock: 7,
    img: 'images/p-lomo-ahumado.webp', alt: 'Lomo de cerdo ahumado con pimentón cortado en tiras junto a una cebolla morada',
    corto: 'Ahumado con pimentón, para fetear.',
    desc: 'Lomo de cerdo curado y ahumado, con un toque de pimentón. Se fetea fino para sándwiches y tablas.',
    rango: 12, alta: 20260818,
  },
  {
    id: 'provolone', nombre: 'Provolone hilado', cat: 'especialidades', tipo: 'semiduro', usos: ['cocina', 'tablas'], unidad: 'Pieza', peso: 1.5, precioKg: 22400, stock: 10,
    img: 'images/p-provolone.webp', alt: 'Dos quesos de pasta hilada con forma de pera sobre fondo oscuro',
    corto: 'Pasta hilada, para la parrilla o la tabla.',
    desc: 'Queso de pasta hilada con forma de pera. A la parrilla o al horno con orégano, o en cubos para la picada.',
    rango: 13, alta: 20261010,
  },
  {
    id: 'emmental', nombre: 'Emmental', cat: 'quesos', tipo: 'semiduro', usos: ['sandwiches', 'cocina', 'tablas'], unidad: 'Trozo', peso: 3, precioKg: 24700, stock: 6,
    img: 'images/p-emmental.webp', alt: 'Fetas enruladas de queso emmental sobre un trozo con ojos grandes',
    corto: 'Ojos grandes y sabor dulce, funde muy bien.',
    desc: 'Pasta semidura con ojos grandes y sabor dulce. Funde parejo: ideal para sándwiches calientes, tartas y fondue.',
    rango: 14, alta: 20260808,
  },
  {
    id: 'panceta', nombre: 'Panceta ahumada', cat: 'fiambres', tipo: 'ahumado', usos: ['cocina', 'pizzas'], unidad: 'Pieza', peso: 2.5, precioKg: 16800, stock: 15,
    img: 'images/p-panceta.webp', alt: 'Panceta ahumada en pieza con fetas cortadas sobre una tabla rústica',
    corto: 'Pieza ahumada para cocina y pizzas.',
    desc: 'Panceta curada y ahumada en pieza. Se corta en tiras o cubos para pastas, pizzas, rellenos y guisos.',
    rango: 15, alta: 20260806,
  },
  {
    id: 'queso-bola', nombre: 'Queso de bola', cat: 'quesos', tipo: 'semiduro', usos: ['tablas', 'sandwiches'], unidad: 'Horma', peso: 2, precioKg: 20800, stock: 9,
    img: 'images/p-queso-bola.webp', alt: 'Horma de queso con corteza de parafina roja y una porción cortada',
    corto: 'Corteza de parafina roja y sabor suave.',
    desc: 'Clásico de corteza de parafina roja, pasta firme y sabor suave y avellanado. Se corta prolijo para tablas y sándwiches.',
    rango: 16, alta: 20260811,
  },
  {
    id: 'matambre', nombre: 'Matambre de cerdo arrollado', cat: 'fiambres', tipo: 'cocido', usos: ['sandwiches', 'tablas'], unidad: 'Pieza', peso: 3, precioKg: 17900, stock: 12,
    img: 'images/p-matambre.webp', alt: 'Rodajas de matambre arrollado sobre una tabla redonda con romero',
    corto: 'Arrollado cocido, se fetea en rodajas.',
    desc: 'Matambre de cerdo arrollado y cocido, condimentado. Se fetea en rodajas para sándwiches de miga, fiambreras y tablas frías.',
    rango: 17, alta: 20260814,
  },
  {
    id: 'salamin', nombre: 'Salamín picado fino', cat: 'fiambres', tipo: 'embutido', usos: ['tablas'], unidad: 'Atado', peso: 1, precioKg: 23900, stock: 20,
    img: 'images/p-salamin.webp', alt: 'Salamines curados enteros y en rodajas sobre una tabla con romero y pimienta',
    corto: 'Atado de salamines curados, para picadas.',
    desc: 'Salamines curados de picado fino, en atado. El clásico de la picada, para cortar en rodajas finas.',
    rango: 18, alta: 20260809,
  },
  {
    id: 'feta', nombre: 'Queso feta en cubos', cat: 'especialidades', tipo: 'fresco', usos: ['cocina'], unidad: 'Pote', peso: 1, precioKg: 19800, stock: 0,
    img: 'images/p-feta.webp', alt: 'Cubos de queso blanco en un bol de madera',
    corto: 'En cubos, para ensaladas y cocina.',
    desc: 'Queso blanco salado, en cubos y en salmuera. Para ensaladas, tartas y platos de inspiración mediterránea.',
    rango: 19, alta: 20260901,
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioPieza = p => Math.round((p.precioKg * p.peso) / 100) * 100;
const formatearPeso = kg => (kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg.toLocaleString('es-AR')} kg`);
const presentacion = p => `${p.unidad} de ${p.unidad === 'Bandeja' || p.unidad === 'Pack' || p.unidad === 'Pote' ? '' : 'aprox. '}${formatearPeso(p.peso)}`;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261001;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), uso = lista(f.uso), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (uso.length && !uso.some(x => p.usos.includes(x))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      if (p.precioKg < min || p.precioKg > max) return false;
    }
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'kg-asc': return (a, b) => a.precioKg - b.precioKg || desempate(a, b);
      case 'kg-desc': return (a, b) => b.precioKg - a.precioKg || desempate(a, b);
      case 'pieza-asc': return (a, b) => precioPieza(a) - precioPieza(b) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, TIPOS[p.tipo], ...p.usos.map(u => USOS[u]), p.unidad, p.corto, p.desc,
      p.cat === 'quesos' || p.id === 'queso-azul' || p.id === 'brie' || p.id === 'provolone' || p.id === 'feta' ? 'queso quesos' : 'fiambre fiambres',
      esNuevo(p) ? 'nuevo novedad' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'luckyfood_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioPieza(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const ANIM_DER = 'data-animate="der" style="opacity:0;transform:translateX(56px)"';
const waConsulta = p => wa(`¡Hola Lucky Food! Quiero consultar por ${p.nombre} (${presentacion(p)}).`);

function precioHTML(p) {
  return `<p class="precio"><span class="precio__pieza">${formatearPrecio(precioPieza(p))}</span><span class="precio__kg">${formatearPrecio(p.precioKg)}/kg</span></p>`;
}
function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const fotoHTML = (p, clase) => `<button type="button" class="${clase}" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${clase === 'pcard__foto' ? badgesHTML(p) : ''}<img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"></button>`;
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Lucky Food! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;

function cardV(p, anim = true) {
  const acc = p.stock > 0
    ? `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}">Agregar</button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard" ${anim ? ANIM_SUBIR : ''}>
    ${fotoHTML(p, 'pcard__foto')}
    <div class="pcard__body">
      <p class="pcard__pres">${esc(presentacion(p))}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}
function cardRail(p) {
  return `<div class="rslot"><article class="rcard" ${ANIM_DER}>
    ${fotoHTML(p, 'pcard__foto')}
    <p class="pcard__pres">${esc(catDe(p.cat).nombre)} · ${esc(presentacion(p))}</p>
    <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
    <div class="rcard__pie">${precioHTML(p)}${p.stock > 0 ? `<button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button>` : '<span class="prod-sin">Sin stock</span>'}</div>
  </article></div>`;
}
function filaHTML(p) {
  const acc = p.stock > 0
    ? `<div class="fila__acc">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button></div>`
    : `<div class="fila__acc fila__acc--sin">${avisameHTML(p)}</div>`;
  const estado = badgesDe(p).map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('');
  return `<article class="fila" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'fila__foto')}
    <div class="fila__info">
      <h3 class="fila__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button>${estado}</h3>
      <p class="fila__meta">${esc(presentacion(p))} · ${esc(TIPOS[p.tipo])}</p>
      <p class="fila__corto">${esc(p.corto)}</p>
    </div>
    <p class="fila__kg"><span>Por kilo</span>${formatearPrecio(p.precioKg)}</p>
    <p class="fila__pieza"><span>${esc(p.unidad)}</span>${formatearPrecio(precioPieza(p))}</p>
    ${acc}
  </article>`;
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="64" height="40"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCatCounts() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const ids = (rail.dataset.ids || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: ids.length || 8 });
  items.forEach(cachear);
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  track.innerHTML = items.map(cardRail).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rslot')?.getBoundingClientRect().width || 280) + 16;
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let pointerId = null;
  let inicioX = 0;
  let inicioScroll = 0;
  let movido = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId;
    inicioX = e.clientX;
    inicioScroll = vp.scrollLeft;
    movido = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - inicioX;
    if (!movido && Math.abs(dx) > 6) {
      movido = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { vp.classList.add('sin-captura'); }
    }
    if (movido) vp.scrollLeft = inicioScroll - dx;
  });
  const fin = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('sin-captura'); }
    pointerId = null;
    if (movido) {
      vp.classList.remove('dragging');
      const matar = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 60);
    }
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', () => { if (pointerId !== null) fin(); });
}

function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const excluir = (cont.dataset.excluir || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { excluir }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initLista() {
  const cont = document.querySelector('[data-lista]');
  if (!cont) return;
  const lim = parseInt(cont.dataset.limite, 10) || 8;
  const tabs = [...document.querySelectorAll('[data-lista-tab]')];
  const pie = document.querySelector('[data-lista-pie]');
  const pintar = (cat, animar) => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: lim });
    items.forEach(cachear);
    cont.innerHTML = items.map(filaHTML).join('');
    if (pie) {
      const n = Tienda.contar(cat ? { cat } : {});
      pie.href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
      pie.querySelector('span').textContent = cat ? `Ver los ${n} productos de ${catDe(cat).nombre.toLowerCase()}` : `Ver la lista completa (${n} productos)`;
    }
    if (animar) { revelarNuevos(cont); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.listaTab, true);
  }));
  pintar(tabs.find(t => t.getAttribute('aria-pressed') === 'true')?.dataset.listaTab || '', false);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const vistas = [...root.querySelectorAll('[data-vista]')];
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'kg-asc', 'kg-desc', 'pieza-asc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), tipo: Object.keys(TIPOS), uso: Object.keys(USOS) };
  const vistaInicial = root.dataset.vistaInicial === 'lista' ? 'lista' : 'fotos';
  const estado = { cat: [], tipo: [], uso: [], precio: '', stock: false, q: '', orden: 'destacados', vista: vistaInicial };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.tipo = listaURL('tipo');
  estado.uso = listaURL('uso');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';
  if (['fotos', 'lista'].includes(u.get('vista'))) estado.vista = u.get('vista');

  const filtrosDe = () => ({ cat: estado.cat, tipo: estado.tipo, uso: estado.uso, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.tipo.length) p.set('tipo', estado.tipo.join(','));
    if (estado.uso.length) p.set('uso', estado.uso.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    if (estado.vista !== vistaInicial) p.set('vista', estado.vista);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    document.querySelectorAll('#filtros input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    vistas.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === estado.vista)));
    grid.classList.toggle('es-lista', estado.vista === 'lista');
    const n = estado.cat.length + estado.tipo.length + estado.uso.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (estado.vista === 'lista' ? filaHTML(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'producto' : 'productos'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], tipo: [], uso: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  vistas.forEach(b => b.addEventListener('click', () => { if (estado.vista === b.dataset.vista) return; estado.vista = b.dataset.vista; aplicar(); }));
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p, mini) {
  return `<div class="linea${mini ? ' linea--mini' : ''}">
    ${mini ? '' : `<div class="linea__foto"><img src="${p.img}" alt="" width="900" height="900"></div>`}
    <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(presentacion(p))} · ${formatearPrecio(precioPieza(p))} c/u</p></div>
    <p class="linea__precio">${formatearPrecio(precioPieza(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}"><button type="button" data-linea-step="-1" data-id="${p.id}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= p.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Lucky Food! Tengo un comercio y quiero la lista de precios mayorista.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${p.nombre} (${presentacion(p)}) — ${formatearPrecio(precioPieza(p) * i.qty)}`);
  return wa(`¡Hola Lucky Food! Quiero hacer este pedido mayorista:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas], [data-pedido-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const total = formatearPrecio(Cart.total());
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu pedido está vacío</p><small>Elegí quesos y fiambres del catálogo y sumalos con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p, false)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  const pedido = document.querySelector('[data-pedido-lineas]');
  if (pedido) {
    pedido.innerHTML = vacio
      ? '<p class="pedido__vacio">Todavía no sumaste productos. Tocá «Agregar» en la lista y el pedido se arma acá.</p>'
      : items.map(({ i, p }) => lineaHTML(i, p, true)).join('');
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp], [data-pedido-wsp]').forEach(a => { a.href = msg; });
  if (selector && enLineas) {
    const cont = document.querySelector(enLineas.hasAttribute('data-drawer-lineas') ? '[data-drawer-lineas]' : '[data-pedido-lineas]');
    (cont.querySelector(selector) || cont.querySelector('button:not([disabled])'))?.focus();
  }
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const comprar = p.stock > 0
    ? `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al pedido</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} ${p.unidad.toLowerCase()}s</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<figure class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"></figure>
  <div class="qv__info">
    <p class="pcard__pres">${esc(cat?.nombre)} · ${esc(TIPOS[p.tipo])}</p>
    <h2>${esc(p.nombre)}</h2>
    <dl class="qv__precios"><div><dt>${esc(presentacion(p))}</dt><dd>${formatearPrecio(precioPieza(p))}</dd></div><div><dt>Precio por kilo</dt><dd>${formatearPrecio(p.precioKg)}</dd></div></dl>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="rasgos">${p.usos.map(x => `<span class="rasgo">${USOS[x]}</span>`).join('')}</div>
    ${comprar}
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="900" height="900"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(r.precioKg)}/kg</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href, description: p.desc,
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioPieza(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu pedido está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const it = Cart.get().find(i => i.id === t.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del pedido`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const st = t.closest('.pcard, .rcard, .fila, .qv__comprar')?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
    if (enCarrito >= p.stock) { showToast(`Ya tenés todo el stock de ${p.nombre} en el pedido`); return; }
    Cart.add(p, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${qty > 1 ? `${qty} × ` : ''}${p.nombre} al pedido`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * 8).toFixed(2)}%`; }
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-buscar', { y: 22, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id);
}

Cart.syncStock();
initCatCounts();
initNavDrop();
initRail();
initPrevia();
initLista();
initCatalogo();
renderCarrito();
initReveals();
initNav();
initModelBarScroll();
initFloats();
updateCartBadge();
initDelegacion();
initHeroMotion();
initParallax();
abrirDesdeURL();
