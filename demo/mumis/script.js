const WHATSAPP_NUMBER = '5493482637474';
const MARCA = 'Mumis';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE_SIZE = 16;

const MUNDOS = [
  { id: 'ninos', nombre: 'Bebés y niños' },
  { id: 'teens', nombre: 'Teens y dama' },
];

const CATEGORIAS = [
  { id: 'bebes', nombre: 'Bebés', mundo: 'ninos', rango: '0 a 24 meses' },
  { id: 'ninos', nombre: 'Niños', mundo: 'ninos', rango: '2 a 12 años' },
  { id: 'teens', nombre: 'Teens', mundo: 'teens', rango: 'Urbana y de noche' },
  { id: 'dama', nombre: 'Dama', mundo: 'teens', rango: 'Jeans, blusas y sweaters' },
];

const TALLES = {
  bebes: ['0-3 M', '3-6 M', '6-12 M', '12-18 M', '18-24 M'],
  ninos: ['2', '4', '6', '8', '10', '12'],
  teens: ['12', '14', '16'],
  damaTop: ['S', 'M', 'L', 'XL'],
  damaJean: ['36', '38', '40', '42', '44'],
};

const PRECIOS = [
  { id: 'hasta-30', nombre: 'Hasta $30.000', min: 0, max: 30000 },
  { id: '30-40', nombre: '$30.000 a $40.000', min: 30000, max: 40000 },
  { id: 'mas-40', nombre: 'Más de $40.000', min: 40000, max: Infinity },
];

const ESCALA_TALLES = ['0-3 M', '3-6 M', '6-12 M', '12-18 M', '18-24 M', '2', '4', '6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL'];

const PRODUCTOS = [
  {
    id: 'vestido-floral-puntilla', orden: 1, nombre: 'Vestido floral con cuello de puntilla', categoria: 'ninos', color: 'Mostaza floreado',
    precio: 31900, descuento: 0, nuevo: true,
    imagen: 'images/vestido-floral-puntilla-1200x1200.webp', alt: 'Vestido floral mostaza con cuello de puntilla azul colgado en un perchero de madera', foco: '45% 40%',
    grupoTalle: 'ninos', talles: { 2: 2, 4: 3, 6: 3, 8: 2, 10: 0, 12: 0 },
    tela: 'Poplin de algodón estampado',
    descripcion: 'Mangas abullonadas, cuello de puntilla en azul noche y falda con frunce. Para cumpleaños, fiestas del jardín o un domingo en familia.',
    cuidados: ['Lavar a mano o en ciclo delicado', 'Planchar del revés a temperatura media'],
    tags: ['vestido', 'nena', 'fiesta', 'floreado', 'amarillo'],
  },
  {
    id: 'enterito-bordado', orden: 2, nombre: 'Enterito jardinero bordado', categoria: 'bebes', color: 'Panda', tipoVariante: 'Modelo', variantes: ['Panda', 'Margarita', 'Osito'],
    precio: 24900, descuento: 0,
    imagen: 'images/enterito-bordado-1200x1200.webp', alt: 'Tres enteritos jardineros de bebé: negro con panda, bordó con margarita y mostaza con osito', foco: '50% 50%',
    grupoTalle: 'bebes', talles: { '0-3 M': 3, '3-6 M': 4, '6-12 M': 3, '12-18 M': 2, '18-24 M': 0 },
    tela: 'Frisa de algodón',
    descripcion: 'Jardinero con tiradores abotonados, elástico en las piernas y un bordado al frente. Viene en tres modelos: panda, margarita y osito.',
    cuidados: ['Lavar del revés en agua fría', 'No usar secadora'],
    tags: ['enterito', 'jardinero', 'body', 'bebe', 'panda', 'osito', 'margarita', 'bordado'],
  },
  {
    id: 'jean-cargo-wide', orden: 3, nombre: 'Jean cargo wide leg', categoria: 'teens', color: 'Celeste nevado',
    precio: 44900, descuento: 0, nuevo: true,
    imagen: 'images/jean-cargo-wide-1200x1200.webp', alt: 'Jean cargo celeste de pierna ancha con bolsillos laterales', foco: '50% 40%',
    grupoTalle: 'teens', talles: { 12: 2, 14: 3, 16: 3 },
    tela: 'Denim rígido',
    descripcion: 'Tiro medio, pierna ancha y bolsillos cargo con tapa. Con zapatillas y un top corto, o con un buzo oversize.',
    cuidados: ['Lavar del revés en agua fría', 'Secar a la sombra'],
    tags: ['jean', 'cargo', 'wide leg', 'urbana', 'denim', 'celeste', 'pantalon'],
  },
  {
    id: 'remera-lentejuelas', orden: 4, nombre: 'Remera de lentejuelas', categoria: 'teens', color: 'Multicolor',
    precio: 36900, descuento: 0,
    imagen: 'images/remera-lentejuelas-1200x1200.webp', alt: 'Remera de lentejuelas multicolor en rayas combinada con un short negro', foco: '55% 40%',
    grupoTalle: 'teens', talles: { 12: 1, 14: 2, 16: 2 },
    tela: 'Lentejuelas sobre tul',
    descripcion: 'Remera suelta cubierta de lentejuelas en rayas de colores. Para una fiesta de quince, un cumple o una salida de noche.',
    cuidados: ['Lavar a mano en agua fría', 'No planchar sobre las lentejuelas'],
    tags: ['remera', 'top', 'noche', 'fiesta', 'brillo', 'lentejuelas'],
  },
  {
    id: 'vestido-broderie', orden: 5, nombre: 'Vestido con cuello de broderie', categoria: 'bebes', color: 'Rosa', tipoVariante: 'Color', variantes: ['Salvia', 'Rosa', 'Frambuesa'],
    precio: 28500, descuento: 10,
    imagen: 'images/vestido-broderie-1200x1200.webp', alt: 'Tres vestidos de bebé en salvia, rosa y frambuesa con cuello blanco de broderie', foco: '50% 50%',
    grupoTalle: 'bebes', talles: { '0-3 M': 0, '3-6 M': 2, '6-12 M': 3, '12-18 M': 4, '18-24 M': 3 },
    tela: 'Algodón con cuello de broderie',
    descripcion: 'Vestido abotonado adelante con un cuello grande de broderie blanca. En tres colores: salvia, rosa y frambuesa.',
    cuidados: ['Lavar en ciclo delicado', 'Planchar el cuello del revés'],
    tags: ['vestido', 'bebe', 'broderie', 'rosa', 'verde', 'cuello'],
  },
  {
    id: 'sweater-trenzado', orden: 6, nombre: 'Sweater trenzado', categoria: 'dama', color: 'Crudo',
    precio: 39900, descuento: 0,
    imagen: 'images/sweater-trenzado-1200x1200.webp', alt: 'Sweater trenzado color crudo sobre un jean oscuro y unos anteojos', foco: '60% 50%',
    grupoTalle: 'damaTop', talles: { S: 1, M: 3, L: 3, XL: 2 },
    tela: 'Hilado de lana',
    descripcion: 'Tejido con trenzas al frente, cuello redondo y puños acanalados. Abriga sin pesar y combina con cualquier jean.',
    cuidados: ['Lavar a mano en agua fría', 'Secar en horizontal'],
    tags: ['sweater', 'tejido', 'abrigo', 'lana', 'blanco', 'crudo'],
  },
  {
    id: 'jean-mom-celeste', orden: 7, nombre: 'Jean mom tiro alto', categoria: 'dama', color: 'Celeste nevado',
    precio: 42900, descuento: 0,
    imagen: 'images/jean-mom-celeste-1200x1200.webp', alt: 'Jean mom celeste nevado doblado junto a una blusa blanca y ramas de eucalipto', foco: '40% 40%',
    grupoTalle: 'damaJean', talles: { 36: 2, 38: 3, 40: 3, 42: 2, 44: 1 },
    tela: 'Denim rígido',
    descripcion: 'Tiro alto, pierna recta y lavado nevado. El jean que va con todo, en talles del 36 al 44.',
    cuidados: ['Lavar del revés en agua fría', 'No usar lavandina'],
    tags: ['jean', 'mom', 'tiro alto', 'denim', 'celeste', 'pantalon'],
  },
  {
    id: 'sweater-acanalado', orden: 8, nombre: 'Sweater acanalado', categoria: 'ninos', color: 'Verde oliva',
    precio: 29900, descuento: 0,
    imagen: 'images/mundo-bebes-ninos-1200x1600.webp', alt: 'Nene con sweater acanalado verde oliva y pantalón beige', foco: '50% 38%',
    grupoTalle: 'ninos', talles: { 2: 0, 4: 2, 6: 4, 8: 3, 10: 2, 12: 1 },
    tela: 'Hilado acanalado',
    descripcion: 'Cuello redondo, hombro caído y punto acanalado suave. Para el colegio o para salir abrigado.',
    cuidados: ['Lavar a mano o en ciclo lana', 'Secar en horizontal'],
    tags: ['sweater', 'tejido', 'nene', 'verde', 'abrigo'],
  },
  {
    id: 'sweater-polo-rayado', orden: 9, nombre: 'Sweater polo rayado', categoria: 'bebes', color: 'Tostado',
    precio: 26900, descuento: 0,
    imagen: 'images/sweater-polo-rayado-1200x1200.webp', alt: 'Sweater tipo polo tostado con rayas crudas colgado en un perchero de madera', foco: '30% 45%',
    grupoTalle: 'bebes', talles: { '0-3 M': 0, '3-6 M': 1, '6-12 M': 2, '12-18 M': 3, '18-24 M': 3 },
    tela: 'Hilado de algodón',
    descripcion: 'Cuello polo con dos botones de madera y rayas anchas. Queda lindo solo o sobre un body.',
    cuidados: ['Lavar en ciclo delicado', 'Secar en horizontal'],
    tags: ['sweater', 'polo', 'bebe', 'rayado', 'tejido', 'marron'],
  },
  {
    id: 'blusa-fibrana-blanca', orden: 10, nombre: 'Blusa de fibrana', categoria: 'dama', color: 'Blanca',
    precio: 27900, descuento: 20,
    imagen: 'images/blusa-fibrana-blanca-1200x1200.webp', alt: 'Blusa blanca de fibrana con pliegues sobre una cama clara', foco: '50% 45%',
    grupoTalle: 'damaTop', talles: { S: 2, M: 3, L: 2, XL: 1 },
    tela: 'Fibrana',
    descripcion: 'Blusa liviana y fresca con caída suave. Por dentro de un jean mom o suelta con un short.',
    cuidados: ['Lavar en ciclo delicado', 'Planchar a temperatura baja'],
    tags: ['blusa', 'camisa', 'blanca', 'verano', 'fibrana'],
  },
];

const RAIL_IDS = ['vestido-floral-puntilla', 'enterito-bordado', 'jean-cargo-wide', 'remera-lentejuelas', 'vestido-broderie', 'sweater-trenzado', 'jean-mom-celeste', 'sweater-acanalado'];

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#F4EEE6', '--color-text': '#16130F', '--color-text-muted': '#5E574F', '--color-primary': '#000000', '--color-secondary': '#FFFFFF', '--color-cta': '#000000', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Arena', vars: { '--color-bg': '#FAF6F0', '--color-bg-alt': '#F0E6D8', '--color-text': '#231A12', '--color-text-muted': '#6B5A4A', '--color-primary': '#3B2A1E', '--color-secondary': '#FFFDF9', '--color-cta': '#3B2A1E', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Celeste', vars: { '--color-bg': '#F5F8FB', '--color-bg-alt': '#E3EDF6', '--color-text': '#0F1B2A', '--color-text-muted': '#4E5D6E', '--color-primary': '#1E3A5F', '--color-secondary': '#FFFFFF', '--color-cta': '#1E3A5F', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Frutilla', vars: { '--color-bg': '#FDF7F8', '--color-bg-alt': '#F9E3E8', '--color-text': '#2A1218', '--color-text-muted': '#6E4B55', '--color-primary': '#8E1F45', '--color-secondary': '#FFFFFF', '--color-cta': '#8E1F45', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Salvia', vars: { '--color-bg': '#F7F8F4', '--color-bg-alt': '#E7ECE1', '--color-text': '#1C2419', '--color-text-muted': '#56604F', '--color-primary': '#2F4A34', '--color-secondary': '#FFFFFF', '--color-cta': '#2F4A34', '--color-cta-text': '#FFFFFF' } },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const mundoDe = p => getCategoria(p?.categoria)?.mundo || '';
const nombreMundo = id => MUNDOS.find(m => m.id === id)?.nombre || '';
const tallesDe = p => (TALLES[p?.grupoTalle] || []).filter(t => Object.prototype.hasOwnProperty.call(p.talles, t));
const stockTalle = (p, talle) => Number(p?.talles?.[talle]) || 0;
const tallesConStock = p => tallesDe(p).filter(t => stockTalle(p, t) > 0);
const talleSugerido = p => { const lista = tallesConStock(p); return lista.length ? lista[Math.floor((lista.length - 1) / 2)] : null; };
const varianteDe = (p, v) => (p?.variantes?.length ? (p.variantes.includes(v) ? v : p.variantes[0]) : p?.color);
const rangoTalles = p => { const lista = tallesConStock(p); if (!lista.length) return 'Sin stock por ahora'; return lista.length === 1 ? `Talle ${lista[0]}` : `Talles ${lista[0]} a ${lista[lista.length - 1]}`; };
const wspLink = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

const Cart = {
  KEY: 'mumis_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(v)) return [];
      return v.filter(i => i && typeof i.id === 'string' && typeof i.talle === 'string' && Number.isFinite(i.qty) && i.qty >= 1 && tallesDe(getProducto(i.id)).includes(i.talle))
        .map(i => ({ id: i.id, talle: i.talle, variante: varianteDe(getProducto(i.id), i.variante) ?? '', qty: Math.floor(i.qty) }));
    } catch { return []; }
  },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { return; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  key(item) { return `${item.id}|${item.talle}|${item.variante}`; },
  add(producto, qty = 1, talle = talleSugerido(producto), variante = varianteDe(producto)) {
    if (!producto || !talle) return false;
    const max = stockTalle(producto, talle);
    if (max <= 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle && i.variante === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, talle, variante, qty: Math.min(qty, max) });
    this.save(items);
    return true;
  },
  setQty(key, qty) {
    const items = this.get(); const it = items.find(i => this.key(i) === key); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, stockTalle(p, it.talle) || 1)); this.save(items);
  },
  setTalle(key, talle) {
    const items = this.get(); const it = items.find(i => this.key(i) === key); if (!it) return;
    const p = getProducto(it.id); const max = stockTalle(p, talle); if (max <= 0) return;
    const dup = items.find(i => i !== it && i.id === it.id && i.talle === talle && i.variante === it.variante);
    if (dup) { dup.qty = Math.min(dup.qty + it.qty, max); this.save(items.filter(i => i !== it)); return; }
    it.talle = talle; it.qty = Math.min(it.qty, max); this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => this.key(i) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ESTADO_INICIAL = { q: '', mundo: 'todos', cat: 'todas', talle: 'todos', precio: 'todos', orden: 'destacados' };

function textoBusqueda(p) {
  const cat = getCategoria(p.categoria);
  return normalizar([p.nombre, p.color, (p.variantes || []).join(' '), cat?.nombre, p.tela, (p.tags || []).join(' '), 'talle', tallesDe(p).join(' ')].join(' '));
}

function coincideBusqueda(p, palabras) {
  const texto = textoBusqueda(p);
  const talles = tallesConStock(p).map(normalizar);
  return palabras.every(w => (/^\d+$/.test(w) ? talles.includes(w) : texto.includes(w)));
}

function tallesDisponiblesPara(estado) {
  let cats = [];
  if (estado.cat !== 'todas') cats = CATEGORIAS.filter(c => c.id === estado.cat);
  else if (estado.mundo !== 'todos') cats = CATEGORIAS.filter(c => c.mundo === estado.mundo);
  if (!cats.length) return [];
  const grupos = [];
  PRODUCTOS.filter(p => cats.some(c => c.id === p.categoria)).forEach(p => { if (!grupos.includes(p.grupoTalle)) grupos.push(p.grupoTalle); });
  const orden = Object.keys(TALLES);
  const lista = [];
  grupos.sort((a, b) => orden.indexOf(a) - orden.indexOf(b)).forEach(g => TALLES[g].forEach(t => { if (!lista.includes(t)) lista.push(t); }));
  return lista;
}

function filtrarProductos(estado, lista = PRODUCTOS) {
  const palabras = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const rango = PRECIOS.find(r => r.id === estado.precio);
  const res = lista.filter(p => {
    if (estado.mundo !== 'todos' && mundoDe(p) !== estado.mundo) return false;
    if (estado.cat !== 'todas' && p.categoria !== estado.cat) return false;
    if (estado.talle !== 'todos' && stockTalle(p, estado.talle) <= 0) return false;
    if (rango) { const v = precioFinal(p); if (!(v > rango.min && v <= rango.max)) return false; }
    if (palabras.length && !coincideBusqueda(p, palabras)) return false;
    return true;
  });
  const orden = {
    destacados: (a, b) => a.orden - b.orden,
    menor: (a, b) => precioFinal(a) - precioFinal(b),
    mayor: (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  };
  return res.sort(orden[estado.orden] || orden.destacados);
}

function filtrosActivos(estado) {
  return ['mundo', 'cat', 'talle', 'precio'].filter(k => estado[k] !== ESTADO_INICIAL[k]).length + (estado.q.trim() ? 1 : 0);
}

function normalizarEstado(estado, cambios = {}) {
  const e = { ...ESTADO_INICIAL, ...estado, ...cambios };
  if (!MUNDOS.some(m => m.id === e.mundo)) e.mundo = 'todos';
  let cat = getCategoria(e.cat);
  if (cat && 'mundo' in cambios && !('cat' in cambios) && cat.mundo !== e.mundo) cat = null;
  e.cat = cat ? cat.id : 'todas';
  if (cat) e.mundo = cat.mundo;
  if (e.talle !== 'todos' && !tallesDisponiblesPara(e).includes(e.talle)) e.talle = 'todos';
  if (!PRECIOS.some(r => r.id === e.precio)) e.precio = 'todos';
  if (!['destacados', 'menor', 'mayor', 'nombre'].includes(e.orden)) e.orden = 'destacados';
  e.q = String(e.q ?? '');
  return e;
}

const ordenMundo = id => MUNDOS.findIndex(m => m.id === id);
const agruparPorMundo = lista => [...lista].sort((a, b) => ordenMundo(mundoDe(a)) - ordenMundo(mundoDe(b)));

function talleEnBarrido(avance) {
  const ultimo = ESCALA_TALLES.length - 1;
  const corte = TALLES.bebes.length + TALLES.ninos.length - 0.5;
  const t = Math.min(1, Math.max(0, Number(avance) || 0));
  const pos = t < 0.5 ? (t / 0.5) * corte : corte + ((t - 0.5) / 0.5) * (ultimo - corte);
  const indice = Math.min(ultimo, Math.round(pos));
  return { pos, indice, talle: ESCALA_TALLES[indice] };
}

function mensajePedido(items) {
  const lineas = [`Hola ${MARCA}, quiero hacer este pedido:`, ''];
  let total = 0;
  items.forEach(i => {
    const p = getProducto(i.id);
    if (!p) return;
    total += precioFinal(p) * i.qty;
    lineas.push(`${i.qty}x ${p.nombre} | ${i.variante} | Talle ${i.talle} | ${formatearPrecio(precioFinal(p) * i.qty)}`);
  });
  lineas.push('', `Total: ${formatearPrecio(total)}`, '¿Me confirman si está disponible y cómo lo coordinamos?');
  return lineas.join('\n');
}

const ICON = {
  menos: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  basura: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  wsp: '<svg class="icon" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function badgesHTML(p) {
  const b = [];
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  return b.length ? `<span class="prod-badges">${b.join('')}</span>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span>${formatearPrecio(p.precio)}</span>`;
}

function stepperHTML(max, extra = '', qty = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"${extra}>
      <button type="button" data-step="-1" aria-label="Restar una unidad"${qty <= 1 ? ' disabled' : ''}>${ICON.menos}</button>
      <output aria-live="polite">${qty}</output>
      <button type="button" data-step="1" aria-label="Sumar una unidad"${qty >= max ? ' disabled' : ''}>${ICON.mas}</button>
    </div>`;
}

function cardHTML(p, opts = {}) {
  const tag = opts.tag || 'li';
  const anim = opts.animar === false ? '' : ' data-animate="up" style="opacity:0;transform:translateY(46px)"';
  const mundo = mundoDe(p);
  const sugerido = talleSugerido(p);
  const max = sugerido ? stockTalle(p, sugerido) : 0;
  const variantesTxt = p.variantes?.length ? ` · ${p.variantes.length} ${p.tipoVariante === 'Modelo' ? 'modelos' : 'colores'}` : '';
  return `<${tag} class="prod-card" data-id="${esc(p.id)}"${anim}>
    <button type="button" class="prod-media" data-abrir="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}" style="--foco:${esc(p.foco)}">
      <img src="${esc(p.imagen)}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async">
      <span class="pill-mundo pill-mundo--${esc(mundo)} prod-pill">${esc(nombreMundo(mundo))}</span>
      ${badgesHTML(p)}
    </button>
    <div class="prod-body">
      <h3 class="prod-nombre"><button type="button" data-abrir="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="prod-talles">${esc(rangoTalles(p))}${esc(variantesTxt)}</p>
      <p class="prod-precio">${precioHTML(p)}</p>
      <div class="prod-actions">
        ${stepperHTML(Math.max(max, 1))}
        <button type="button" class="btn btn-cta prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito"${max ? '' : ' disabled'}><span class="add-largo">Agregar al carrito</span><span class="add-corto">Agregar</span></button>
      </div>
      <button type="button" class="btn btn-suave prod-buy" data-comprar="${esc(p.id)}"${max ? '' : ' disabled'}>Comprar ahora</button>
    </div>
  </${tag}>`;
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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

function refrescarScroll() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irA(destino) {
  const el = typeof destino === 'string' ? document.querySelector(destino) : destino;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 8;
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

function atraparTab(e, cont) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length > 0);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

function hayCapaAbierta() {
  return !!(document.getElementById('mainNav')?.classList.contains('open')
    || document.getElementById('cartDrawer')?.classList.contains('open')
    || document.getElementById('qvBackdrop')?.classList.contains('open')
    || (document.getElementById('palette-panel-backdrop') && !document.getElementById('palette-panel-backdrop').hidden));
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!hayCapaAbierta()) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparTab(e, nav); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspLink(a.dataset.wspMsg); });
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const btn = document.getElementById('cartBtn');
  if (btn) btn.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'prenda' : 'prendas'}` : 'Abrir el carrito');
}

let drawerTrigger = null;
let drawerTimer = null;

function openCartDrawer(e) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  if (document.getElementById('qvBackdrop')?.classList.contains('open')) cerrarQuickView(false);
  drawerTrigger = e?.currentTarget instanceof window.HTMLElement ? e.currentTarget : (document.activeElement instanceof window.HTMLElement ? document.activeElement : null);
  clearTimeout(drawerTimer);
  renderDrawer(true);
  drawer.hidden = false;
  bd.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus({ preventScroll: true });
}

function closeCartDrawer(devolverFoco = true) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  bd?.classList.remove('open');
  if (!hayCapaAbierta()) document.body.classList.remove('no-scroll');
  drawerTimer = setTimeout(() => { drawer.hidden = true; if (bd) bd.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolverFoco && drawerTrigger && document.contains(drawerTrigger)) drawerTrigger.focus({ preventScroll: true });
}

function renderDrawer(animarItems = false) {
  const lista = document.getElementById('drawerItems');
  const vacio = document.getElementById('drawerVacio');
  const foot = document.getElementById('drawerFoot');
  if (!lista) return;
  const activo = document.activeElement;
  let recordar = null;
  if (activo && lista.contains(activo)) {
    const item = activo.closest('.drawer-item');
    recordar = {
      idx: [...lista.children].indexOf(item),
      control: activo.dataset.cartStep ? `[data-cart-step="${activo.dataset.cartStep}"]` : activo.matches('select') ? 'select' : '.drawer-remove',
    };
  }
  const items = Cart.get().filter(i => getProducto(i.id));
  lista.hidden = items.length === 0;
  if (vacio) vacio.hidden = items.length > 0;
  if (foot) foot.hidden = items.length === 0;
  lista.innerHTML = items.map((i, n) => {
    const p = getProducto(i.id);
    const key = Cart.key(i);
    const max = stockTalle(p, i.talle);
    const variante = p.variantes?.length ? `${p.tipoVariante} ${i.variante}` : i.variante;
    const opciones = tallesDe(p).map(t => {
      const st = stockTalle(p, t);
      return `<option value="${esc(t)}"${t === i.talle ? ' selected' : ''}${st > 0 ? '' : ' disabled'}>${esc(t)}${st > 0 ? '' : ' · agotado'}</option>`;
    }).join('');
    return `<li class="drawer-item${animarItems ? ' entra' : ''}" style="animation-delay:${Math.min(n * 0.06, 0.36).toFixed(2)}s">
      <div class="drawer-thumb"><img src="${esc(p.imagen)}" width="1200" height="1200" alt="" decoding="async" style="object-position:${esc(p.foco)}"></div>
      <div class="drawer-info">
        <p class="drawer-nombre">${esc(p.nombre)}</p>
        <p class="drawer-var">${esc(nombreMundo(mundoDe(p)))} · ${esc(variante)} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <label class="drawer-talle">Talle <select data-talle-key="${esc(key)}" aria-label="Talle de ${esc(p.nombre)}">${opciones}</select></label>
        <div class="drawer-row">
          <div class="stepper" data-cart-key="${esc(key)}">
            <button type="button" data-cart-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICON.menos}</button>
            <output aria-live="polite">${i.qty}</output>
            <button type="button" data-cart-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}"${i.qty >= max ? ' disabled' : ''}>${ICON.mas}</button>
          </div>
          <span class="drawer-sub">${formatearPrecio(precioFinal(p) * i.qty)}</span>
          <button type="button" class="drawer-remove" data-remove="${esc(key)}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.basura}</button>
        </div>
      </div>
    </li>`;
  }).join('');
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = items.length ? wspLink(mensajePedido(items)) : `https://wa.me/${WHATSAPP_NUMBER}`;
  if (recordar) {
    const item = lista.children[Math.min(recordar.idx, lista.children.length - 1)];
    const el = item?.querySelector(recordar.control);
    if (el && !el.disabled) el.focus({ preventScroll: true });
    else (item?.querySelector('select') || document.getElementById('drawerClose'))?.focus({ preventScroll: true });
  }
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', () => closeCartDrawer());
  bd?.addEventListener('click', () => closeCartDrawer());
  drawer.addEventListener('keydown', e => atraparTab(e, drawer));
  drawer.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const key = step.closest('[data-cart-key]')?.dataset.cartKey;
      const it = Cart.get().find(i => Cart.key(i) === key);
      if (it) Cart.setQty(key, it.qty + Number(step.dataset.cartStep));
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { Cart.remove(rm.dataset.remove); showToast('Listo, la sacamos del carrito.'); }
  });
  drawer.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle-key]');
    if (sel) { Cart.setTalle(sel.dataset.talleKey, sel.value); showToast(`Cambiamos el talle a ${sel.value}.`); }
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.getElementById('drawerVerTienda')?.addEventListener('click', e => { e.preventDefault(); closeCartDrawer(false); irA('#tienda'); });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderDrawer(false); });
}

let qvTrigger = null;
let qvTimer = null;
let qvEstado = null;

function abrirQuickView(id, trigger) {
  const p = getProducto(id);
  const bd = document.getElementById('qvBackdrop');
  if (!p || !bd) return;
  if (trigger instanceof window.HTMLElement) qvTrigger = trigger;
  qvEstado = { id, talle: talleSugerido(p), variante: varianteDe(p) };
  clearTimeout(qvTimer);
  renderQuickView();
  if (!bd.classList.contains('open')) {
    bd.hidden = false;
    void bd.offsetWidth;
    bd.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  const qv = document.getElementById('quickView');
  if (qv) qv.scrollTop = 0;
  document.getElementById('qvClose')?.focus({ preventScroll: true });
}

function cerrarQuickView(devolverFoco = true) {
  const bd = document.getElementById('qvBackdrop');
  if (!bd || !bd.classList.contains('open')) return;
  bd.classList.remove('open');
  if (!hayCapaAbierta()) document.body.classList.remove('no-scroll');
  qvTimer = setTimeout(() => { bd.hidden = true; const body = document.getElementById('qvBody'); if (body) body.innerHTML = ''; }, reduceMotion ? 0 : 320);
  if (devolverFoco && qvTrigger && document.contains(qvTrigger)) qvTrigger.focus({ preventScroll: true });
}

function renderQuickView(qtyPrevia = 1) {
  const body = document.getElementById('qvBody');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!body || !p) return;
  document.getElementById('quickView')?.setAttribute('aria-label', `Ficha de ${p.nombre}`);
  const mundo = mundoDe(p);
  const cat = getCategoria(p.categoria);
  const variante = varianteDe(p, qvEstado.variante);
  const max = qvEstado.talle ? stockTalle(p, qvEstado.talle) : 0;
  const qty = Math.max(1, Math.min(qtyPrevia, max || 1));
  const relacionados = [
    ...PRODUCTOS.filter(x => x.id !== p.id && x.categoria === p.categoria),
    ...PRODUCTOS.filter(x => x.id !== p.id && mundoDe(x) === mundo),
  ].filter((x, i, arr) => arr.findIndex(y => y.id === x.id) === i).slice(0, 3);
  const consulta = mundo === 'ninos'
    ? `Hola ${MARCA}, quiero consultar el talle de ${p.nombre} (${variante}). Tiene __ meses o años y mide __ cm.`
    : `Hola ${MARCA}, quiero consultar el talle de ${p.nombre} (${variante}). Mis medidas son: busto __, cintura __ y cadera __.`;
  body.innerHTML = `
    <div class="qv-galeria">
      <div class="qv-principal" style="--foco:${esc(p.foco)}">
        <img src="${esc(p.imagen)}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async">
        <span class="pill-mundo pill-mundo--${esc(mundo)}">${esc(nombreMundo(mundo))}</span>
      </div>
    </div>
    <div class="qv-info">
      <p class="eyebrow">${esc(cat?.nombre)} · ${esc(cat?.rango)}</p>
      <h2>${esc(p.nombre)}</h2>
      <p class="prod-precio qv-precio">${precioHTML(p)}</p>
      <p class="qv-desc">${esc(p.descripcion)}</p>
      <dl class="qv-ficha">
        <dt>Tela</dt><dd>${esc(p.tela)}</dd>
        <dt>Talles</dt><dd>${esc(rangoTalles(p))}</dd>
        ${p.variantes?.length ? '' : `<dt>Color</dt><dd>${esc(p.color)}</dd>`}
      </dl>
      ${p.variantes?.length ? `<div class="qv-opcion">
        <div class="qv-opcion-top"><span>${esc(p.tipoVariante)}: <strong>${esc(variante)}</strong></span></div>
        <div class="qv-chips" role="group" aria-label="${esc(p.tipoVariante)}">${p.variantes.map(v => `<button type="button" class="qv-chip" data-variante="${esc(v)}" aria-pressed="${v === variante}">${esc(v)}</button>`).join('')}</div>
      </div>` : ''}
      <div class="qv-opcion">
        <div class="qv-opcion-top"><span>Talle: <strong>${esc(qvEstado.talle || 'sin stock')}</strong></span><a class="link-inline" href="#preguntas" data-guia-talles="${esc(mundo)}">Guía de talles</a></div>
        <div class="qv-chips" role="group" aria-label="Talle">${tallesDe(p).map(t => {
          const st = stockTalle(p, t);
          return `<button type="button" class="qv-chip" data-talle="${esc(t)}" aria-pressed="${t === qvEstado.talle}"${st > 0 ? '' : ` disabled aria-label="Talle ${esc(t)}, agotado"`}>${esc(t)}</button>`;
        }).join('')}</div>
      </div>
      <div class="qv-acciones">
        ${stepperHTML(Math.max(max, 1), ' data-qv-stepper', qty)}
        <button type="button" class="btn btn-cta" data-qv-add${max ? '' : ' disabled'}>Agregar al carrito</button>
        <button type="button" class="btn btn-suave" data-qv-comprar${max ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <a class="link-flecha" href="${esc(wspLink(consulta))}" target="_blank" rel="noopener noreferrer">${ICON.wsp}<span>Consultá el talle por WhatsApp</span></a>
      <div>
        <p class="qv-rel-titulo">Cuidados</p>
        <ul class="qv-cuidados">${p.cuidados.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      <div class="qv-rel">
        <p class="qv-rel-titulo">Más de ${esc(nombreMundo(mundo))}</p>
        <ul class="qv-rel-lista">${relacionados.map(r => `<li><button type="button" class="qv-rel-item" data-qv-abrir="${esc(r.id)}"><span class="qv-rel-media"><img src="${esc(r.imagen)}" width="1200" height="1200" alt="" decoding="async" style="object-position:${esc(r.foco)}"></span><span class="qv-rel-nombre">${esc(r.nombre)}</span><span class="qv-rel-precio">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul>
      </div>
    </div>`;
}

function agregarDesdeQV(comprar) {
  const p = qvEstado && getProducto(qvEstado.id);
  if (!p) return;
  if (!qvEstado.talle) { showToast('Esta prenda está sin stock. Escribinos y te avisamos cuando vuelva.'); return; }
  const qty = Number(document.querySelector('[data-qv-stepper] output')?.textContent) || 1;
  const variante = varianteDe(p, qvEstado.variante);
  if (!Cart.add(p, qty, qvEstado.talle, variante)) { showToast('Ese talle se agotó. Probá con otro o consultanos.'); return; }
  if (comprar) { cerrarQuickView(false); openCartDrawer({ currentTarget: qvTrigger }); return; }
  showToast(`${p.nombre}, talle ${qvEstado.talle}, ya está en tu carrito.`);
}

function initQuickView() {
  const bd = document.getElementById('qvBackdrop');
  const qv = document.getElementById('quickView');
  if (!bd || !qv) return;
  const qtyActual = () => Number(qv.querySelector('[data-qv-stepper] output')?.textContent) || 1;
  document.getElementById('qvClose')?.addEventListener('click', () => cerrarQuickView());
  qv.addEventListener('keydown', e => atraparTab(e, qv));
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrarQuickView(); return; }
    const talle = e.target.closest('[data-talle]');
    if (talle && !talle.disabled) {
      const qty = qtyActual();
      qvEstado.talle = talle.dataset.talle;
      renderQuickView(qty);
      qv.querySelector(`[data-talle="${window.CSS.escape(qvEstado.talle)}"]`)?.focus({ preventScroll: true });
      return;
    }
    const variante = e.target.closest('[data-variante]');
    if (variante) {
      const qty = qtyActual();
      qvEstado.variante = variante.dataset.variante;
      renderQuickView(qty);
      qv.querySelector(`[data-variante="${window.CSS.escape(qvEstado.variante)}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-qv-add]')) { agregarDesdeQV(false); return; }
    if (e.target.closest('[data-qv-comprar]')) { agregarDesdeQV(true); return; }
    const rel = e.target.closest('[data-qv-abrir]');
    if (rel) { abrirQuickView(rel.dataset.qvAbrir); return; }
    const guia = e.target.closest('[data-guia-talles]');
    if (guia) {
      e.preventDefault();
      cerrarQuickView(false);
      const detalles = document.querySelectorAll('#preguntas details');
      const destino = detalles[guia.dataset.guiaTalles === 'teens' ? 1 : 0];
      if (destino) destino.open = true;
      irA('#preguntas');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (bd.classList.contains('open')) { cerrarQuickView(); return; }
    if (document.getElementById('cartDrawer')?.classList.contains('open')) closeCartDrawer();
  });
}

function pulsar(el) {
  if (reduceMotion || !el?.animate) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-step]');
    if (step) {
      const cont = step.closest('[data-stepper]');
      const out = cont.querySelector('output');
      const max = Number(cont.dataset.max) || 1;
      const v = Math.max(1, Math.min(max, (Number(out.textContent) || 1) + Number(step.dataset.step)));
      out.textContent = v;
      cont.querySelector('[data-step="-1"]').disabled = v <= 1;
      cont.querySelector('[data-step="1"]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const out = add.closest('.prod-actions')?.querySelector('[data-stepper] output');
      const qty = Number(out?.textContent) || 1;
      const talle = talleSugerido(p);
      const variante = varianteDe(p);
      if (!Cart.add(p, qty, talle, variante)) { showToast('Esta prenda está sin stock por ahora.'); return; }
      pulsar(add);
      if (out) {
        out.textContent = 1;
        const cont = out.closest('[data-stepper]');
        cont.querySelector('[data-step="-1"]').disabled = true;
        cont.querySelector('[data-step="1"]').disabled = (Number(cont.dataset.max) || 1) <= 1;
      }
      showToast(`${p.nombre}${p.variantes?.length ? ` (${variante})` : ''}, talle ${talle}, ya está en tu carrito. El talle se cambia desde ahí.`);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.prod-body')?.querySelector('[data-stepper] output')?.textContent) || 1;
      if (Cart.add(p, qty)) openCartDrawer({ currentTarget: comprar });
      return;
    }
    const abrir = e.target.closest('[data-abrir], a[data-producto]');
    if (abrir) {
      e.preventDefault();
      abrirQuickView(abrir.dataset.abrir || abrir.dataset.producto, abrir);
    }
  });
}

let revealsListos = false;

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.07, 0.56).toFixed(2)}s`; });
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  void cont.offsetWidth;
  nuevos.forEach(el => el.classList.add('in'));
}

function initCategorias() {
  CATEGORIAS.forEach(c => {
    const n = PRODUCTOS.filter(p => p.categoria === c.id).length;
    document.querySelectorAll(`[data-cat-count="${c.id}"]`).forEach(el => { el.textContent = n === 1 ? '1 prenda' : `${n} prendas`; });
  });
  const porMundo = { todos: PRODUCTOS.length };
  MUNDOS.forEach(m => { porMundo[m.id] = PRODUCTOS.filter(p => mundoDe(p) === m.id).length; });
  document.querySelectorAll('[data-count-mundo]').forEach(el => { el.textContent = porMundo[el.dataset.countMundo] ?? 0; });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = e.pointerId; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  track.setAttribute('data-animate-stagger', '');
  track.innerHTML = RAIL_IDS.map(getProducto).filter(Boolean).slice(0, 8).map(p => cardHTML(p)).join('');
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return card ? (card.getBoundingClientRect().width + gap) * 2 : 320;
  };
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 8;
    if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 8;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

const estadoCat = { ...ESTADO_INICIAL, visibles: PAGE_SIZE };
const catUI = {};

function sepHTML(mundo, total) {
  const oscuro = mundo === 'teens' ? ' sobre-oscuro' : '';
  return `<li class="catalogo-sep catalogo-sep--${esc(mundo)}${oscuro}" data-animate="up" style="opacity:0;transform:translateY(46px)">
    <span class="pill-mundo pill-mundo--${esc(mundo)}">Mundo ${ordenMundo(mundo) + 1}</span>
    <p class="catalogo-sep-titulo">${esc(nombreMundo(mundo))}</p>
    <span class="catalogo-sep-count">${total === 1 ? '1 prenda' : `${total} prendas`}</span>
    <button type="button" class="link-btn" data-filtro-mundo="${esc(mundo)}">Ver solo ${esc(nombreMundo(mundo))}</button>
  </li>`;
}

function listaCatalogo() {
  const lista = filtrarProductos(estadoCat);
  return estadoCat.mundo === 'todos' ? agruparPorMundo(lista) : lista;
}

function catalogoHTML(lista, desde, hasta) {
  const agrupar = estadoCat.mundo === 'todos';
  return lista.slice(desde, hasta).map((p, n) => {
    const i = desde + n;
    const mundo = mundoDe(p);
    const sep = agrupar && (i === 0 || mundoDe(lista[i - 1]) !== mundo) ? sepHTML(mundo, lista.filter(x => mundoDe(x) === mundo).length) : '';
    return sep + cardHTML(p);
  }).join('');
}

function chipHTML(clave, id, nombre, n, extra = '') {
  const base = id === ESTADO_INICIAL[clave];
  const activo = estadoCat[clave] === id;
  const apagado = !base && !activo && n === 0;
  return `<button type="button" class="chip" data-filtro="${clave}" data-valor="${esc(id)}" aria-pressed="${activo}"${extra}${apagado ? ' disabled' : ''}>${esc(nombre)}${base ? '' : `<span class="chip-count">${n}</span>`}</button>`;
}

function renderChips() {
  const activo = document.activeElement;
  const recordar = activo?.matches?.('.chip[data-filtro]') && catUI.panel?.contains(activo) ? { f: activo.dataset.filtro, v: activo.dataset.valor } : null;
  const base = { ...ESTADO_INICIAL, mundo: estadoCat.mundo };
  const conCat = { ...base, cat: estadoCat.cat };
  const cats = CATEGORIAS.filter(c => estadoCat.mundo === 'todos' || c.mundo === estadoCat.mundo);
  if (catUI.chipsCat) {
    catUI.chipsCat.innerHTML = chipHTML('cat', 'todas', 'Todas', 0)
      + cats.map(c => chipHTML('cat', c.id, c.nombre, filtrarProductos({ ...base, cat: c.id }).length, ` data-chip-mundo="${c.mundo}"`)).join('');
  }
  const talles = tallesDisponiblesPara(estadoCat);
  if (catUI.chipsTalle) {
    catUI.chipsTalle.hidden = talles.length === 0;
    catUI.chipsTalle.innerHTML = talles.length
      ? chipHTML('talle', 'todos', 'Todos', 0) + talles.map(t => chipHTML('talle', t, t, filtrarProductos({ ...conCat, talle: t }).length)).join('')
      : '';
  }
  if (catUI.talleAyuda) catUI.talleAyuda.hidden = talles.length > 0;
  if (catUI.chipsPrecio) {
    catUI.chipsPrecio.innerHTML = chipHTML('precio', 'todos', 'Todos', 0)
      + PRECIOS.map(r => chipHTML('precio', r.id, r.nombre, filtrarProductos({ ...conCat, precio: r.id }).length)).join('');
  }
  if (recordar) {
    const el = catUI.panel.querySelector(`[data-filtro="${recordar.f}"][data-valor="${window.CSS.escape(recordar.v)}"]:not(:disabled)`)
      || catUI.panel.querySelector(`[data-filtro="${recordar.f}"][aria-pressed="true"]`);
    el?.focus({ preventScroll: true });
  }
}

function sincronizarMundo() {
  catUI.tabs?.querySelectorAll('[data-filtro-mundo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtroMundo === estadoCat.mundo)));
  document.querySelectorAll('.mundo-link').forEach(a => a.classList.toggle('is-activo', a.dataset.mundo === estadoCat.mundo));
}

function renderCatalogo(animar = true) {
  if (!catUI.grid) return;
  const lista = listaCatalogo();
  catUI.grid.innerHTML = catalogoHTML(lista, 0, estadoCat.visibles);
  catUI.grid.hidden = lista.length === 0;
  if (catUI.vacio) catUI.vacio.hidden = lista.length > 0;
  if (catUI.verMas) catUI.verMas.hidden = lista.length <= estadoCat.visibles;
  if (catUI.resultados) {
    const n = lista.length === 1 ? '1 prenda' : `${lista.length} prendas`;
    catUI.resultados.textContent = estadoCat.mundo === 'todos' ? n : `${n} en ${nombreMundo(estadoCat.mundo)}`;
  }
  if (catUI.limpiar) catUI.limpiar.hidden = filtrosActivos(estadoCat) === 0;
  const enPanel = ['cat', 'talle', 'precio'].filter(k => estadoCat[k] !== ESTADO_INICIAL[k]).length;
  if (catUI.count) { catUI.count.hidden = enPanel === 0; catUI.count.textContent = enPanel; }
  if (catUI.clear) catUI.clear.hidden = !estadoCat.q;
  renderChips();
  sincronizarMundo();
  if (animar) revelarNuevos(catUI.grid);
  refrescarScroll();
}

function aplicarFiltro(cambios) {
  Object.assign(estadoCat, normalizarEstado(estadoCat, cambios), { visibles: PAGE_SIZE });
  renderCatalogo(true);
}

function limpiarFiltros() {
  Object.assign(estadoCat, ESTADO_INICIAL, { visibles: PAGE_SIZE });
  if (catUI.buscador) catUI.buscador.value = '';
  if (catUI.orden) catUI.orden.value = ESTADO_INICIAL.orden;
  renderCatalogo(true);
}

function initCatalogo() {
  catUI.grid = document.getElementById('catalogoGrid');
  if (!catUI.grid) return;
  catUI.grid.setAttribute('data-animate-stagger', '');
  catUI.tabs = document.getElementById('mundoTabs');
  catUI.buscador = document.getElementById('buscador');
  catUI.clear = document.getElementById('searchClear');
  catUI.orden = document.getElementById('orden');
  catUI.toggle = document.getElementById('filtrosToggle');
  catUI.panel = document.getElementById('filtrosPanel');
  catUI.count = document.getElementById('filtrosCount');
  catUI.chipsCat = document.getElementById('chipsCat');
  catUI.chipsTalle = document.getElementById('chipsTalle');
  catUI.chipsPrecio = document.getElementById('chipsPrecio');
  catUI.talleAyuda = document.getElementById('talleAyuda');
  catUI.resultados = document.getElementById('resultados');
  catUI.limpiar = document.getElementById('limpiarFiltros');
  catUI.vacio = document.getElementById('catalogoVacio');
  catUI.verMas = document.getElementById('verMas');

  catUI.panel?.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro]');
    if (chip && !chip.disabled) aplicarFiltro({ [chip.dataset.filtro]: chip.dataset.valor });
  });
  document.getElementById('tienda')?.addEventListener('click', e => {
    const tab = e.target.closest('[data-filtro-mundo]');
    if (!tab) return;
    const desdeGrilla = catUI.grid.contains(tab);
    aplicarFiltro({ mundo: tab.dataset.filtroMundo });
    if (desdeGrilla) irA('#tienda');
  });

  let espera = null;
  catUI.buscador?.addEventListener('input', () => {
    clearTimeout(espera);
    if (catUI.clear) catUI.clear.hidden = !catUI.buscador.value;
    espera = setTimeout(() => aplicarFiltro({ q: catUI.buscador.value }), 180);
  });
  catUI.buscador?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { clearTimeout(espera); aplicarFiltro({ q: catUI.buscador.value }); }
  });
  catUI.clear?.addEventListener('click', () => {
    catUI.buscador.value = '';
    aplicarFiltro({ q: '' });
    catUI.buscador.focus();
  });
  catUI.orden?.addEventListener('change', () => aplicarFiltro({ orden: catUI.orden.value }));
  catUI.toggle?.addEventListener('click', () => {
    const abierto = catUI.panel.classList.toggle('is-open');
    catUI.toggle.setAttribute('aria-expanded', String(abierto));
    refrescarScroll();
  });
  catUI.limpiar?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarFiltros);
  catUI.verMas?.addEventListener('click', () => {
    const lista = listaCatalogo();
    const desde = estadoCat.visibles;
    estadoCat.visibles += PAGE_SIZE;
    catUI.grid.insertAdjacentHTML('beforeend', catalogoHTML(lista, desde, estadoCat.visibles));
    catUI.verMas.hidden = lista.length <= estadoCat.visibles;
    revelarNuevos(catUI.grid);
    refrescarScroll();
  });
  renderCatalogo(false);
}

function initLinksFiltro() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-cat], a[data-mundo]');
    if (link) {
      e.preventDefault();
      const cambios = { ...ESTADO_INICIAL };
      if (link.dataset.cat) cambios.cat = link.dataset.cat;
      else cambios.mundo = link.dataset.mundo;
      if (catUI.buscador) catUI.buscador.value = '';
      if (catUI.orden) catUI.orden.value = ESTADO_INICIAL.orden;
      aplicarFiltro(cambios);
      irA('#tienda');
      return;
    }
    const buscar = e.target.closest('[data-buscar]');
    if (buscar) {
      e.preventDefault();
      irA('#tienda');
      setTimeout(() => catUI.buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
    }
  });
}

function initMundos() {
  const track = document.getElementById('mundosTrack');
  const escena = document.getElementById('mundosEscena');
  const copyA = document.getElementById('copyA');
  const copyB = document.getElementById('copyB');
  const fondoA = document.getElementById('fondoA');
  const fondoB = document.getElementById('fondoB');
  const valor = document.getElementById('talleValor');
  const marcador = document.getElementById('talleMarcador');
  if (!track || !escena || !copyA || !copyB || reduceMotion) return;

  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const tramo = (p, a, b) => clamp01((p - a) / (b - a));
  const suave = t => t * t * (3 - 2 * t);
  const mezcla = (a, b, t) => a + (b - a) * t;
  const ultimo = ESCALA_TALLES.length - 1;
  let talleActual = -1;

  const pintar = p => {
    const barrido = suave(tramo(p, .04, .70));
    escena.style.setProperty('--w', mezcla(108, -8, barrido).toFixed(2));

    const saleA = suave(tramo(p, .08, .28));
    copyA.style.transform = `translateX(${mezcla(0, -70, saleA).toFixed(1)}px)`;
    copyA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.pointerEvents = saleA > .85 ? 'none' : 'auto';
    if (fondoA) fondoA.style.transform = `scale(${mezcla(1, 1.07, suave(tramo(p, 0, 1))).toFixed(4)})`;

    const entraB = suave(tramo(p, .34, .58));
    copyB.style.transform = `translateY(${mezcla(40, 0, entraB).toFixed(1)}px)`;
    copyB.style.opacity = entraB.toFixed(3);
    copyB.style.pointerEvents = entraB < .15 ? 'none' : 'auto';
    if (fondoB) fondoB.style.transform = `scale(${mezcla(1.09, 1, suave(tramo(p, .18, .9))).toFixed(4)})`;

    const talle = talleEnBarrido(barrido);
    if (marcador) marcador.style.setProperty('--t', (talle.pos / ultimo).toFixed(4));
    if (valor && talle.indice !== talleActual) { talleActual = talle.indice; valor.textContent = talle.talle; }
  };

  const progreso = () => {
    const r = track.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };
  const calcular = () => pintar(progreso());

  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; calcular(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'mumis_paleta';

  const guardarPaleta = paleta => { try { localStorage.setItem(KEY, JSON.stringify(paleta)); return true; } catch { return false; } };

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) guardarPaleta(paleta);
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: window.gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, document.querySelector(`[data-abrir="${window.CSS.escape(id)}"]`));
}

initWspLinks();
initCategorias();
initRail();
initCatalogo();
initReveals();
initNav();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initDrawer();
initQuickView();
initAcciones();
initLinksFiltro();
initMundos();
initLeeScroll();
initColorSwitch();
initDeepLink();
