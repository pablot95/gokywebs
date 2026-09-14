const WHATSAPP_NUMBER = '5491144489069';
const MARCA = 'Vestirsi Con Il Cuore';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE_SIZE = 16;
const TALLES = ['S', 'M', 'L', 'XL'];

const CATEGORIAS = [
  { id: 'vestidos', nombre: 'Vestidos' },
  { id: 'camisas', nombre: 'Camisas y blusas' },
  { id: 'sastreria', nombre: 'Sastrería' },
  { id: 'tejidos', nombre: 'Tejidos' },
];

const TELAS = [
  { id: 'lino', nombre: 'Lino' },
  { id: 'saten', nombre: 'Satén' },
  { id: 'crepe', nombre: 'Crepe' },
  { id: 'punto', nombre: 'Punto' },
  { id: 'viscosa', nombre: 'Viscosa' },
];

const PRECIOS = [
  { id: 'hasta-50', nombre: 'Hasta $50.000', min: 0, max: 50000 },
  { id: '50-70', nombre: '$50.000 a $70.000', min: 50000, max: 70000 },
  { id: 'mas-70', nombre: 'Más de $70.000', min: 70000, max: Infinity },
];

const PRODUCTOS = [
  {
    id: 'conjunto-sastrero-fucsia', orden: 1, nombre: 'Conjunto sastrero de crepe', color: 'Fucsia',
    categoria: 'sastreria', tela: 'crepe', composicion: [['Poliéster', 95], ['Elastano', 5]],
    precio: 119900, descuento: 0, nuevo: true,
    imagen: 'images/conjunto-sastrero-fucsia-1200x1600.webp',
    alt: 'Conjunto sastrero fucsia de crepe con saco oversize y pantalón recto, usado por una modelo sentada',
    foco: '50% 30%', trama: '34% 62%',
    talles: { S: 3, M: 4, L: 2, XL: 0 },
    tacto: 'Crepe de grano mate y caída firme: el saco mantiene la forma y el pantalón no se marca al sentarte.',
    descripcion: 'Saco de hombros amplios con solapa en pico y pantalón recto de tiro alto. Se usa junto para una reunión o separado, con jean y remera blanca.',
    cuidados: ['Lavar a mano en agua fría', 'No usar secadora', 'Planchar del revés a baja temperatura'],
    tags: ['traje', 'saco', 'blazer', 'pantalon', 'oficina', 'rosa'],
  },
  {
    id: 'vestido-lencero-noche', orden: 2, nombre: 'Vestido lencero de satén', color: 'Azul noche',
    categoria: 'vestidos', tela: 'saten', composicion: [['Poliéster', 97], ['Elastano', 3]],
    precio: 68900, descuento: 0, nuevo: true,
    imagen: 'images/vestido-lencero-noche-1200x1600.webp',
    alt: 'Modelo con vestido lencero azul noche de satén y breteles finos sobre fondo lila',
    foco: '50% 30%', trama: '46% 62%',
    talles: { S: 0, M: 3, L: 4, XL: 2 },
    tacto: 'Satén de brillo suave que cae pegado al cuerpo; el 3% de elastano lo deja moverse con vos.',
    descripcion: 'Escote recto, breteles regulables y largo midi cortado al bies. Con sandalias para una fiesta o con un cardigan encima durante el día.',
    cuidados: ['Lavar a mano en agua fría', 'Secar colgado a la sombra', 'Planchar del revés a baja temperatura'],
    tags: ['vestido', 'fiesta', 'noche', 'azul', 'slip', 'midi'],
  },
  {
    id: 'camisa-mao-lino-cruda', orden: 3, nombre: 'Camisa mao de lino', color: 'Cruda',
    categoria: 'camisas', tela: 'lino', composicion: [['Lino', 100]],
    precio: 58900, descuento: 0,
    imagen: 'images/camisa-mao-lino-cruda-1200x1600.webp',
    alt: 'Camisa de lino crudo con cuello mao colgada de una rama en un estudio claro',
    foco: '50% 40%', trama: '42% 50%',
    talles: { S: 4, M: 5, L: 3, XL: 2 },
    tacto: 'Lino lavado, fresco y seco al tacto. Se arruga con naturalidad y se ablanda con cada lavado.',
    descripcion: 'Cuello mao, pechera con pliegue y ruedo asimétrico con tajos laterales. Abierta sobre una musculosa o cerrada con pantalón claro.',
    cuidados: ['Lavar a máquina en agua fría, ciclo delicado', 'Secar a la sombra', 'Planchar húmeda a temperatura alta'],
    tags: ['camisa', 'blusa', 'verano', 'natural', 'beige', 'blanca'],
  },
  {
    id: 'cardigan-punto-ingles-rojo', orden: 4, nombre: 'Cardigan de punto inglés', color: 'Rojo',
    categoria: 'tejidos', tela: 'punto', composicion: [['Lana', 50], ['Acrílico', 50]],
    precio: 62900, descuento: 0,
    imagen: 'images/cardigan-punto-ingles-rojo-1200x1600.webp',
    alt: 'Cardigan rojo de punto inglés con botones carey colgado en una percha de madera',
    foco: '50% 45%', trama: '38% 58%',
    talles: { S: 2, M: 3, L: 3, XL: 2 },
    tacto: 'Punto inglés acanalado y esponjoso: abriga sin pesar y vuelve a su forma después de usarlo.',
    descripcion: 'Escote en V, cuatro botones carey y hombro caído. Sobre un vestido lencero o con una camisa blanca por debajo.',
    cuidados: ['Lavar a mano en agua fría con jabón neutro', 'Secar en horizontal', 'No planchar'],
    tags: ['sweater', 'saco', 'tejido', 'abrigo', 'invierno', 'rojo'],
  },
  {
    id: 'saco-cruzado-marfil', orden: 5, nombre: 'Saco cruzado de crepe', color: 'Marfil',
    categoria: 'sastreria', tela: 'crepe', composicion: [['Poliéster', 100]],
    precio: 89900, descuento: 0,
    imagen: 'images/saco-cruzado-marfil-1200x1600.webp',
    alt: 'Saco cruzado marfil con solapa chal de satén colgado de una percha sobre pared blanca',
    foco: '50% 45%', trama: '36% 60%',
    talles: { S: 2, M: 3, L: 3, XL: 0 },
    tacto: 'Crepe liviano con solapa chal de satén: estructura para la noche sin sentirse rígido.',
    descripcion: 'Saco cruzado con botones forrados y bolsillos de vivo. Sobre un vestido lencero o con pantalón negro resuelve cualquier evento.',
    cuidados: ['Limpieza en seco recomendada', 'No usar lavandina', 'Planchar con paño a temperatura media'],
    tags: ['blazer', 'saco', 'evento', 'blanco', 'crudo', 'noche'],
  },
  {
    id: 'vestido-camisero-fucsia', orden: 6, nombre: 'Vestido camisero de satén', color: 'Fucsia',
    categoria: 'vestidos', tela: 'saten', composicion: [['Poliéster', 100]],
    precio: 64000, descuento: 15,
    imagen: 'images/vestido-camisero-fucsia-1200x1600.webp',
    alt: 'Modelo con vestido camisero corto de satén fucsia con cinto, en un estudio oscuro',
    foco: '50% 32%', trama: '54% 42%',
    talles: { S: 2, M: 4, L: 3, XL: 1 },
    tacto: 'Satén liviano y brillante que no transparenta. Se siente fresco y no se pega con el calor.',
    descripcion: 'Camisero corto con cinto del mismo satén, puños para arremangar y ruedo curvo. Con sandalias de tiras o abierto como sobrecamisa.',
    cuidados: ['Lavar a mano en agua fría', 'No usar secadora', 'Planchar del revés a baja temperatura'],
    tags: ['vestido', 'camisa', 'fiesta', 'rosa', 'corto'],
  },
  {
    id: 'camisa-lino-pistacho', orden: 7, nombre: 'Camisa de lino', color: 'Pistacho',
    categoria: 'camisas', tela: 'lino', composicion: [['Lino', 55], ['Viscosa', 45]],
    precio: 52000, descuento: 15,
    imagen: 'images/camisa-lino-pistacho-1200x1600.webp',
    alt: 'Camisa de lino verde pistacho con botones marrones en un perchero junto a prendas lila y celeste',
    foco: '45% 40%', trama: '42% 52%',
    talles: { S: 3, M: 0, L: 4, XL: 3 },
    tacto: 'Lino con viscosa: conserva la frescura del lino y suma una caída más suave, con menos arruga.',
    descripcion: 'Corte recto con cuello clásico y botones de pasta. Se lleva suelta, anudada a la cintura o por dentro de una pollera.',
    cuidados: ['Lavar a mano o en ciclo delicado con agua fría', 'No retorcer', 'Planchar a temperatura media'],
    tags: ['camisa', 'blusa', 'verde', 'pastel', 'primavera'],
  },
  {
    id: 'vestido-lencero-jardin', orden: 8, nombre: 'Vestido lencero de viscosa', color: 'Jardín',
    categoria: 'vestidos', tela: 'viscosa', composicion: [['Viscosa', 100]],
    precio: 52900, descuento: 0,
    imagen: 'images/vestido-lencero-jardin-1200x1600.webp',
    alt: 'Vestido lencero de viscosa verde oscuro con flores blancas colgado en un placard',
    foco: '50% 50%', trama: '46% 70%',
    talles: { S: 3, M: 4, L: 2, XL: 0 },
    tacto: 'Viscosa estampada, suave y liviana: respira como el algodón y cae como la seda.',
    descripcion: 'Breteles finos, escote en V y microestampa floral en verde bosque. Para el calor, con zapatillas blancas o con un cardigan al atardecer.',
    cuidados: ['Lavar a mano en agua fría', 'Secar a la sombra sin retorcer', 'Planchar a temperatura media'],
    tags: ['vestido', 'floral', 'estampado', 'verde', 'slip', 'verano'],
  },
  {
    id: 'cardigan-algodon', orden: 9, nombre: 'Cardigan de algodón', color: 'Arena', colores: ['Arena', 'Crema', 'Niebla'],
    categoria: 'tejidos', tela: 'punto', composicion: [['Algodón', 100]],
    precio: 48900, descuento: 0,
    imagen: 'images/cardigan-algodon-tres-colores-1200x1600.webp',
    alt: 'Tres cardigans de hilo de algodón en arena, crema y gris niebla doblados sobre una mesa blanca',
    foco: '50% 60%', trama: '40% 62%',
    talles: { S: 3, M: 5, L: 4, XL: 3 },
    tacto: 'Hilado de algodón en punto grueso: fresco para el entretiempo y suave contra la piel.',
    descripcion: 'Cardigan largo con escote en V y puños acanalados. Viene en tres colores que combinan con todo el placard.',
    cuidados: ['Lavar a mano en agua fría', 'Secar en horizontal a la sombra', 'Planchar a baja temperatura sin apoyar'],
    tags: ['sweater', 'tejido', 'entretiempo', 'beige', 'gris', 'crema'],
  },
];

const RAIL_IDS = ['conjunto-sastrero-fucsia', 'vestido-lencero-noche', 'camisa-mao-lino-cruda', 'cardigan-punto-ingles-rojo', 'saco-cruzado-marfil', 'vestido-camisero-fucsia', 'camisa-lino-pistacho', 'vestido-lencero-jardin'];

const CAPITULOS = [
  { producto: 'camisa-mao-lino-cruda', tela: 'Lino', clima: [24, 34], composicion: [['Lino', 100]], lupa: [44, 48] },
  { producto: 'vestido-camisero-fucsia', tela: 'Satén', clima: [16, 26], composicion: [['Poliéster', 100]], lupa: [56, 40] },
  { producto: 'cardigan-punto-ingles-rojo', tela: 'Punto inglés', clima: [6, 16], composicion: [['Lana', 50], ['Acrílico', 50]], lupa: [40, 55] },
  { producto: 'saco-cruzado-marfil', tela: 'Crepe', clima: [12, 24], composicion: [['Poliéster', 100]], lupa: [38, 56] },
];

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#EBDAEA', '--color-bg-alt': '#F7EFF6', '--color-text': '#2A1030', '--color-text-muted': '#6B4F6E', '--color-primary': '#FF00FF', '--color-secondary': '#8A1DC4', '--color-cta': '#6E14A8', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Rosa shocking', vars: { '--color-bg': '#F2DFE3', '--color-bg-alt': '#FBF4F5', '--color-text': '#2B0E19', '--color-text-muted': '#6F4A55', '--color-primary': '#FF2D7A', '--color-secondary': '#A3134D', '--color-cta': '#8A0F42', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Lavanda', vars: { '--color-bg': '#E2DFF1', '--color-bg-alt': '#F4F3FA', '--color-text': '#191433', '--color-text-muted': '#564F72', '--color-primary': '#8C74FF', '--color-secondary': '#4A30B3', '--color-cta': '#3B2596', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Ciruela', vars: { '--color-bg': '#EFD3EB', '--color-bg-alt': '#FAEEF8', '--color-text': '#1E0622', '--color-text-muted': '#62405F', '--color-primary': '#E000E0', '--color-secondary': '#7300B8', '--color-cta': '#1E0622', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Nude', vars: { '--color-bg': '#EDE3DD', '--color-bg-alt': '#F8F3EF', '--color-text': '#2D201B', '--color-text-muted': '#6C5A51', '--color-primary': '#D07A86', '--color-secondary': '#8A4653', '--color-cta': '#5A2C36', '--color-cta-text': '#FFFFFF' } },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const nombreTela = id => TELAS.find(t => t.id === id)?.nombre || '';
const nombreCategoria = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const composicionTexto = comp => comp.map(([fibra, n]) => `${n}% ${fibra.toLowerCase()}`).join(' · ');
const composicionCorta = p => `${p.composicion[0][1]}% ${p.composicion[0][0].toLowerCase()}`;
const stockTalle = (p, talle) => p?.talles?.[talle] ?? 0;
const talleSugerido = p => ['M', 'L', 'S', 'XL'].find(t => stockTalle(p, t) > 0) || null;
const colorDe = (p, color) => (p?.colores?.length ? (p.colores.includes(color) ? color : p.colores[0]) : p?.color);
const wspLink = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

const Cart = {
  KEY: 'vestirsiconilcuore_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { return; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  key(item) { return `${item.id}|${item.talle}|${item.color}`; },
  add(producto, qty = 1, talle = talleSugerido(producto), color = colorDe(producto)) {
    if (!producto || !talle) return false;
    const max = stockTalle(producto, talle);
    if (max <= 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle && i.color === color);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, talle, color, qty: Math.min(qty, max) });
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
    const dup = items.find(i => i !== it && i.id === it.id && i.talle === talle && i.color === it.color);
    if (dup) { dup.qty = Math.min(dup.qty + it.qty, max); this.save(items.filter(i => i !== it)); return; }
    it.talle = talle; it.qty = Math.min(it.qty, max); this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => this.key(i) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ESTADO_INICIAL = { q: '', cat: 'todas', tela: 'todas', talle: 'todos', precio: 'todos', orden: 'destacados' };

function textoBusqueda(p) {
  return normalizar([p.nombre, p.color, (p.colores || []).join(' '), nombreCategoria(p.categoria), nombreTela(p.tela), composicionTexto(p.composicion), p.descripcion, p.tacto, (p.tags || []).join(' ')].join(' '));
}

function filtrarProductos(estado, lista = PRODUCTOS) {
  const palabras = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const rango = PRECIOS.find(r => r.id === estado.precio);
  const res = lista.filter(p => {
    if (estado.cat !== 'todas' && p.categoria !== estado.cat) return false;
    if (estado.tela !== 'todas' && p.tela !== estado.tela) return false;
    if (estado.talle !== 'todos' && stockTalle(p, estado.talle) <= 0) return false;
    if (rango) { const v = precioFinal(p); if (!(v > rango.min && v <= rango.max)) return false; }
    if (palabras.length) { const t = textoBusqueda(p); if (!palabras.every(w => t.includes(w))) return false; }
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
  return ['cat', 'tela', 'talle', 'precio'].filter(k => estado[k] !== ESTADO_INICIAL[k]).length + (estado.q.trim() ? 1 : 0);
}

function mensajePedido(items) {
  const lineas = [`Hola ${MARCA}, quiero hacer este pedido:`, ''];
  items.forEach(i => {
    const p = getProducto(i.id);
    if (!p) return;
    lineas.push(`${i.qty}x ${p.nombre} | ${i.color} | Talle ${i.talle} | ${formatearPrecio(precioFinal(p) * i.qty)}`);
  });
  const total = items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0);
  lineas.push('', `Total: ${formatearPrecio(total)}`, '¿Me confirman disponibilidad y forma de pago?');
  return lineas.join('\n');
}

const ICON = {
  menos: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  basura: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
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
    ? `<span class="precio-desc">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span>${formatearPrecio(p.precio)}</span>`;
}

function stepperHTML(max, extra = '') {
  return `<div class="stepper" data-stepper data-max="${max}"${extra}>
      <button type="button" data-step="-1" aria-label="Restar una unidad" disabled>${ICON.menos}</button>
      <output aria-live="polite">1</output>
      <button type="button" data-step="1" aria-label="Sumar una unidad"${max <= 1 ? ' disabled' : ''}>${ICON.mas}</button>
    </div>`;
}

function cardHTML(p, opts = {}) {
  const tag = opts.tag || 'li';
  const anim = opts.animar === false ? '' : ' data-animate="up" style="opacity:0;transform:translateY(50px)"';
  const colorTxt = p.colores?.length ? `${p.colores.length} colores: ${p.colores.join(', ')}` : p.color;
  const sugerido = talleSugerido(p);
  const max = sugerido ? stockTalle(p, sugerido) : 0;
  return `<${tag} class="prod-card" data-id="${esc(p.id)}"${anim}>
    <button type="button" class="prod-media" data-abrir="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}, ${esc(colorTxt)}" style="--foco:${esc(p.foco)};--trama:${esc(p.trama)}">
      <img src="${esc(p.imagen)}" width="1200" height="1600" alt="${esc(p.alt)}" decoding="async">
      ${badgesHTML(p)}
      <span class="prod-trama" aria-hidden="true">Trama de ${esc(nombreTela(p.tela).toLowerCase())}</span>
    </button>
    <span class="etiqueta etiqueta--mini prod-etiqueta"><span class="etq-tela">${esc(nombreTela(p.tela))}</span><span class="etq-compo"> · ${esc(composicionCorta(p))}</span></span>
    <div class="prod-body">
      <h3 class="prod-nombre"><button type="button" data-abrir="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="prod-color">${esc(colorTxt)}</p>
      <p class="prod-precio">${precioHTML(p)}</p>
      <div class="prod-actions">
        ${stepperHTML(max)}
        <button type="button" class="btn btn-cta prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito"${max ? '' : ' disabled'}><span class="add-largo">Agregar al carrito</span><span class="add-corto">Agregar</span></button>
      </div>
      <button type="button" class="btn btn-line prod-buy" data-comprar="${esc(p.id)}"${max ? '' : ' disabled'}>Comprar ahora</button>
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
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
    const opciones = TALLES.map(t => {
      const st = stockTalle(p, t);
      return `<option value="${t}"${t === i.talle ? ' selected' : ''}${st > 0 ? '' : ' disabled'}>${t}${st > 0 ? '' : ' · agotado'}</option>`;
    }).join('');
    return `<li class="drawer-item${animarItems ? ' entra' : ''}" style="animation-delay:${Math.min(n * 0.06, 0.36).toFixed(2)}s">
      <div class="drawer-thumb"><img src="${esc(p.imagen)}" width="1200" height="1600" alt="" decoding="async" style="object-position:${esc(p.foco)}"></div>
      <div class="drawer-info">
        <p class="drawer-nombre">${esc(p.nombre)}</p>
        <p class="drawer-var">${esc(i.color)} · ${esc(nombreTela(p.tela))} · ${formatearPrecio(precioFinal(p))} c/u</p>
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
  qvEstado = { id, talle: talleSugerido(p), color: colorDe(p), vista: 'prenda' };
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
  const colorActual = colorDe(p, qvEstado.color);
  const max = qvEstado.talle ? stockTalle(p, qvEstado.talle) : 0;
  const qty = Math.max(1, Math.min(qtyPrevia, max || 1));
  const vistaTrama = qvEstado.vista === 'trama';
  const relacionados = [
    ...PRODUCTOS.filter(x => x.id !== p.id && x.categoria === p.categoria),
    ...PRODUCTOS.filter(x => x.id !== p.id && x.categoria !== p.categoria && x.tela === p.tela),
    ...PRODUCTOS.filter(x => x.id !== p.id),
  ].filter((x, i, arr) => arr.findIndex(y => y.id === x.id) === i).slice(0, 3);
  const msg = `Hola ${MARCA}, quiero consultar el talle de ${p.nombre} (${colorActual}). Mis medidas son: busto __, cintura __ y cadera __.`;
  body.innerHTML = `
    <div class="qv-galeria">
      <div class="qv-principal${vistaTrama ? ' is-trama' : ''}" style="--foco:${esc(p.foco)};--trama:${esc(p.trama)}">
        <img src="${esc(p.imagen)}" width="1200" height="1600" alt="${esc(p.alt)}" decoding="async">
        <span class="etiqueta etiqueta--mini qv-vista">${vistaTrama ? `Trama de ${esc(nombreTela(p.tela).toLowerCase())}` : 'Prenda completa'}</span>
      </div>
      <div class="qv-thumbs" role="group" aria-label="Vistas de la prenda">
        <button type="button" class="qv-thumb" data-vista="prenda" aria-pressed="${!vistaTrama}" aria-label="Ver la prenda completa" style="--foco:${esc(p.foco)}"><img src="${esc(p.imagen)}" width="1200" height="1600" alt="" decoding="async"></button>
        <button type="button" class="qv-thumb qv-thumb--trama" data-vista="trama" aria-pressed="${vistaTrama}" aria-label="Ver la trama de la tela de cerca" style="--foco:${esc(p.foco)};--trama:${esc(p.trama)}"><img src="${esc(p.imagen)}" width="1200" height="1600" alt="" decoding="async"></button>
      </div>
    </div>
    <div class="qv-info">
      <p class="eyebrow">${esc(nombreCategoria(p.categoria))} · N.º ${String(p.orden).padStart(2, '0')}</p>
      <h2 id="qvTitle">${esc(p.nombre)}</h2>
      <p class="qv-color">${esc(colorActual)}</p>
      <p class="prod-precio qv-precio">${precioHTML(p)}</p>
      <div class="qv-etiqueta">
        <span class="qv-etq-titulo">Composición · ${esc(nombreTela(p.tela))}</span>
        <ul class="qv-compo">${p.composicion.map(([f, n]) => `<li><strong>${n}%</strong>${esc(f.toLowerCase())}</li>`).join('')}</ul>
        <p class="qv-tacto">${esc(p.tacto)}</p>
      </div>
      <p class="qv-desc">${esc(p.descripcion)}</p>
      ${p.colores?.length ? `<div class="qv-opcion">
        <div class="qv-opcion-top"><span>Color: <strong>${esc(colorActual)}</strong></span></div>
        <div class="qv-chips" role="group" aria-label="Color">${p.colores.map(c => `<button type="button" class="qv-chip" data-color="${esc(c)}" aria-pressed="${c === colorActual}">${esc(c)}</button>`).join('')}</div>
      </div>` : ''}
      <div class="qv-opcion">
        <div class="qv-opcion-top"><span>Talle: <strong>${esc(qvEstado.talle || 'sin stock')}</strong></span><a class="link-inline" href="#preguntas" data-guia-talles>Tabla de talles</a></div>
        <div class="qv-chips" role="group" aria-label="Talle">${TALLES.map(t => {
          const st = stockTalle(p, t);
          return `<button type="button" class="qv-chip" data-talle="${t}" aria-pressed="${t === qvEstado.talle}"${st > 0 ? '' : ` disabled aria-label="Talle ${t}, agotado"`}>${t}</button>`;
        }).join('')}</div>
      </div>
      <div class="qv-acciones">
        ${stepperHTML(max, ' data-qv-stepper').replace('<output aria-live="polite">1</output>', `<output aria-live="polite">${qty}</output>`).replace('aria-label="Restar una unidad" disabled', `aria-label="Restar una unidad"${qty <= 1 ? ' disabled' : ''}`)}
        <button type="button" class="btn btn-cta" data-qv-add${max ? '' : ' disabled'}>Agregar al carrito</button>
        <button type="button" class="btn btn-line" data-qv-comprar${max ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <a class="link-cta" href="${esc(wspLink(msg))}" target="_blank" rel="noopener noreferrer">${ICON.wsp}<span>Consultá tu talle por WhatsApp</span></a>
      <div>
        <p class="qv-rel-titulo">Cuidados</p>
        <ul class="qv-cuidados">${p.cuidados.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      <div class="qv-rel">
        <p class="qv-rel-titulo">También te puede interesar</p>
        <ul class="qv-rel-lista">${relacionados.map(r => `<li><button type="button" class="qv-rel-item" data-qv-abrir="${esc(r.id)}"><span class="qv-rel-media"><img src="${esc(r.imagen)}" width="1200" height="1600" alt="" decoding="async" style="object-position:${esc(r.foco)}"></span><span class="qv-rel-nombre">${esc(r.nombre)} · ${esc(r.colores?.length ? `${r.colores.length} colores` : r.color)}</span><span class="qv-rel-precio">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul>
      </div>
    </div>`;
  const stepper = body.querySelector('[data-qv-stepper]');
  if (stepper) stepper.querySelector('[data-step="1"]').disabled = qty >= max;
}

function actualizarVistaQV() {
  const body = document.getElementById('qvBody');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!body || !p) return;
  const trama = qvEstado.vista === 'trama';
  body.querySelector('.qv-principal')?.classList.toggle('is-trama', trama);
  const label = body.querySelector('.qv-vista');
  if (label) label.textContent = trama ? `Trama de ${nombreTela(p.tela).toLowerCase()}` : 'Prenda completa';
  body.querySelectorAll('[data-vista]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === qvEstado.vista)));
}

function agregarDesdeQV(comprar) {
  const p = qvEstado && getProducto(qvEstado.id);
  if (!p) return;
  if (!qvEstado.talle) { showToast('Esta prenda está sin stock. Escribinos y te avisamos cuando vuelva.'); return; }
  const qty = Number(document.querySelector('[data-qv-stepper] output')?.textContent) || 1;
  const ok = Cart.add(p, qty, qvEstado.talle, colorDe(p, qvEstado.color));
  if (!ok) { showToast('Ese talle se agotó. Probá con otro o consultanos.'); return; }
  if (comprar) { cerrarQuickView(false); openCartDrawer(); return; }
  showToast(`${p.nombre}, talle ${qvEstado.talle}, ya está en tu carrito.`);
}

function initQuickView() {
  const bd = document.getElementById('qvBackdrop');
  const qv = document.getElementById('quickView');
  if (!bd || !qv) return;
  document.getElementById('qvClose')?.addEventListener('click', () => cerrarQuickView());
  qv.addEventListener('keydown', e => atraparTab(e, qv));
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrarQuickView(); return; }
    const vista = e.target.closest('[data-vista]');
    if (vista) { qvEstado.vista = vista.dataset.vista; actualizarVistaQV(); return; }
    const talle = e.target.closest('[data-talle]');
    if (talle && !talle.disabled) {
      const qty = Number(qv.querySelector('[data-qv-stepper] output')?.textContent) || 1;
      qvEstado.talle = talle.dataset.talle;
      renderQuickView(qty);
      qv.querySelector(`[data-talle="${qvEstado.talle}"]`)?.focus({ preventScroll: true });
      return;
    }
    const color = e.target.closest('[data-color]');
    if (color) {
      const qty = Number(qv.querySelector('[data-qv-stepper] output')?.textContent) || 1;
      qvEstado.color = color.dataset.color;
      renderQuickView(qty);
      qv.querySelector(`[data-color="${window.CSS.escape(qvEstado.color)}"]`)?.focus({ preventScroll: true });
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
      const primera = document.querySelector('#preguntas details');
      if (primera) primera.open = true;
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
      if (!Cart.add(p, qty, talle)) { showToast('Esta prenda está sin stock por ahora.'); return; }
      pulsar(add);
      if (out) {
        out.textContent = 1;
        const cont = out.closest('[data-stepper]');
        cont.querySelector('[data-step="-1"]').disabled = true;
        cont.querySelector('[data-step="1"]').disabled = (Number(cont.dataset.max) || 1) <= 1;
      }
      showToast(`${p.nombre}, talle ${talle}, ya está en tu carrito. El talle se cambia desde ahí.`);
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
    const prods = PRODUCTOS.filter(p => p.categoria === c.id);
    document.querySelectorAll(`[data-cat-count="${c.id}"]`).forEach(el => { el.textContent = prods.length === 1 ? '1 prenda' : `${prods.length} prendas`; });
    const telas = [...new Set(prods.map(p => nombreTela(p.tela)))].join(' · ');
    document.querySelectorAll(`[data-cat-telas="${c.id}"]`).forEach(el => { el.textContent = telas; });
  });
  document.querySelectorAll('[data-total-prendas]').forEach(el => { el.textContent = PRODUCTOS.length; });
}

function initPreciosDinamicos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (!p) return;
    el.innerHTML = p.descuento > 0 ? `${formatearPrecio(precioFinal(p))}<s>${formatearPrecio(p.precio)}</s>` : formatearPrecio(p.precio);
  });
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

function renderCatalogo(animar = true) {
  if (!catUI.grid) return;
  const lista = filtrarProductos(estadoCat);
  catUI.grid.innerHTML = lista.slice(0, estadoCat.visibles).map(p => cardHTML(p)).join('');
  catUI.grid.hidden = lista.length === 0;
  if (catUI.vacio) catUI.vacio.hidden = lista.length > 0;
  if (catUI.verMas) catUI.verMas.hidden = lista.length <= estadoCat.visibles;
  if (catUI.resultados) catUI.resultados.textContent = lista.length === 1 ? '1 prenda' : `${lista.length} prendas`;
  const activos = filtrosActivos(estadoCat);
  if (catUI.limpiar) catUI.limpiar.hidden = activos === 0;
  if (catUI.count) { catUI.count.hidden = activos === 0; catUI.count.textContent = activos; }
  if (catUI.clear) catUI.clear.hidden = !estadoCat.q;
  document.querySelectorAll('[data-filtro]').forEach(ch => ch.setAttribute('aria-pressed', String(estadoCat[ch.dataset.filtro] === ch.dataset.valor)));
  if (animar) revelarNuevos(catUI.grid);
  refrescarScroll();
}

function aplicarFiltro(cambios) {
  Object.assign(estadoCat, cambios, { visibles: PAGE_SIZE });
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
  catUI.buscador = document.getElementById('buscador');
  catUI.clear = document.getElementById('searchClear');
  catUI.orden = document.getElementById('orden');
  catUI.toggle = document.getElementById('filtrosToggle');
  catUI.panel = document.getElementById('filtrosPanel');
  catUI.count = document.getElementById('filtrosCount');
  catUI.resultados = document.getElementById('resultados');
  catUI.limpiar = document.getElementById('limpiarFiltros');
  catUI.vacio = document.getElementById('catalogoVacio');
  catUI.verMas = document.getElementById('verMas');

  const enRango = (p, id) => { const r = PRECIOS.find(x => x.id === id); const v = precioFinal(p); return !!r && v > r.min && v <= r.max; };
  const grupos = [
    ['cat', 'chipsCat', [{ id: 'todas', nombre: 'Todas' }, ...CATEGORIAS], id => PRODUCTOS.filter(p => p.categoria === id).length],
    ['tela', 'chipsTela', [{ id: 'todas', nombre: 'Todas' }, ...TELAS], id => PRODUCTOS.filter(p => p.tela === id).length],
    ['talle', 'chipsTalle', [{ id: 'todos', nombre: 'Todos' }, ...TALLES.map(t => ({ id: t, nombre: t }))], id => PRODUCTOS.filter(p => stockTalle(p, id) > 0).length],
    ['precio', 'chipsPrecio', [{ id: 'todos', nombre: 'Todos' }, ...PRECIOS], id => PRODUCTOS.filter(p => enRango(p, id)).length],
  ];
  grupos.forEach(([clave, elId, opciones, contar]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = opciones.map(o => `<button type="button" class="chip" data-filtro="${clave}" data-valor="${esc(o.id)}" aria-pressed="${estadoCat[clave] === o.id}">${esc(o.nombre)}${o.id === ESTADO_INICIAL[clave] ? '' : `<span class="chip-count">${contar(o.id)}</span>`}</button>`).join('');
  });

  catUI.panel?.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro]');
    if (chip) aplicarFiltro({ [chip.dataset.filtro]: chip.dataset.valor });
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
    const lista = filtrarProductos(estadoCat);
    const desde = estadoCat.visibles;
    estadoCat.visibles += PAGE_SIZE;
    catUI.grid.insertAdjacentHTML('beforeend', lista.slice(desde, estadoCat.visibles).map(p => cardHTML(p)).join(''));
    catUI.verMas.hidden = lista.length <= estadoCat.visibles;
    revelarNuevos(catUI.grid);
    refrescarScroll();
  });
  renderCatalogo(false);
}

function initLinksFiltro() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-cat], a[data-tela]');
    if (link) {
      e.preventDefault();
      const cambios = { ...ESTADO_INICIAL };
      if (link.dataset.cat) cambios.cat = link.dataset.cat;
      if (link.dataset.tela) cambios.tela = link.dataset.tela;
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

function initCapitulos() {
  const track = document.getElementById('telasTrack');
  if (!track) return;
  const textos = [...track.querySelectorAll('.texto')];
  const shots = [...track.querySelectorAll('.shot')];
  const marcas = [...track.querySelectorAll('.marca-cap')];
  const climaValor = document.getElementById('climaValor');
  const termo = document.getElementById('termoRango');
  const compoValor = document.getElementById('compoValor');
  const compo = document.getElementById('compoBarra');
  const lupa = document.getElementById('lupaTrama');
  const lupaLabel = document.getElementById('lupaLabel');
  const N = Math.min(textos.length, CAPITULOS.length, 4);
  if (!N) return;
  let actual = -1;

  const activar = i => {
    if (i === actual) return;
    actual = i;
    textos.forEach((t, n) => { const on = n === i; t.classList.toggle('is-on', on); t.inert = !on; });
    shots.forEach((s, n) => s.classList.toggle('is-on', n === i));
    marcas.forEach((m, n) => {
      m.classList.toggle('is-on', n === i);
      m.classList.toggle('is-pasada', n < i);
      m.setAttribute('aria-pressed', String(n === i));
    });
    const cap = CAPITULOS[i];
    const [min, max] = cap.clima;
    if (climaValor) climaValor.textContent = `${min} – ${max} °C`;
    if (termo) {
      termo.style.setProperty('--min', (min / 40).toFixed(3));
      termo.style.setProperty('--ancho', ((max - min) / 40).toFixed(3));
    }
    if (compoValor) compoValor.textContent = composicionTexto(cap.composicion);
    if (compo) compo.style.setProperty('--p', (cap.composicion[0][1] / 100).toFixed(2));
    const p = getProducto(cap.producto);
    if (lupa && p) {
      lupa.style.backgroundImage = `url("${p.imagen}")`;
      lupa.style.backgroundPosition = `${cap.lupa[0]}% ${cap.lupa[1]}%`;
    }
    if (lupaLabel) lupaLabel.textContent = `Trama de ${cap.tela.toLowerCase()}`;
  };

  const progreso = () => {
    const r = track.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  };

  const calcular = () => {
    const p = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    if (reduceMotion) return;
    const local = Math.min(1, Math.max(0, p * N - i));
    const img = shots[i]?.querySelector('img');
    if (img) img.style.transform = `scale(${(1.07 - local * 0.07).toFixed(4)})`;
    const cap = CAPITULOS[i];
    if (lupa && cap) lupa.style.backgroundPosition = `${(cap.lupa[0] + (local - 0.5) * 8).toFixed(2)}% ${(cap.lupa[1] + (local - 0.5) * 5).toFixed(2)}%`;
  };

  marcas.forEach((m, n) => m.addEventListener('click', () => {
    const r = track.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const top = window.scrollY + r.top + Math.max(0, total) * ((n + 0.5) / N);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const hero = document.querySelector('.hero');
  const capas = [...document.querySelectorAll('.hero [data-depth]')];
  if (hero && capas.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const movers = capas.map(el => ({
      d: parseFloat(el.dataset.depth) || 0.5,
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }));
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach(m => { m.x(nx * 18 * m.d); m.y(ny * 14 * m.d); });
    });
    hero.addEventListener('pointerleave', () => movers.forEach(m => { m.x(0); m.y(0); }));
  }
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-word', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initCatParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.cat-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'vestirsiconilcuore_paleta';

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
initPreciosDinamicos();
initReveals();
initNav();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initDrawer();
initQuickView();
initAcciones();
initLinksFiltro();
initCapitulos();
initLeeScroll();
initHero();
initCatParallax();
initColorSwitch();
initDeepLink();
