document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5493564220290';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'sofas', nombre: 'Sofás', img: 'images/p-sofa-nube.webp',
    bajada: 'De dos, tres o cuatro cuerpos, rectos o curvos, en la tela y el color que elijas.' },
  { id: 'esquineros', nombre: 'Esquineros', img: 'images/p-esquinero-camel.webp',
    bajada: 'En L o con chaise, para aprovechar una esquina o armar un living grande.' },
  { id: 'sillones', nombre: 'Sillones y puffs', img: 'images/p-sillon-rufino.webp',
    bajada: 'Para completar el juego o sumar un lugar más al sofá que ya tenés.' },
  { id: 'juegos', nombre: 'Juegos completos', img: 'images/p-juego-celeste.webp',
    bajada: 'Sofá y sillón del mismo modelo, en la misma tela y el mismo color.' },
];
const TELAS = {
  pana: { nombre: 'Pana', hex: '#8E9CAF', desc: 'Suave y de pelo corto.' },
  lino: { nombre: 'Lino', hex: '#CFC2AB', desc: 'Trama natural, fresca y mate.' },
  boucle: { nombre: 'Bouclé', hex: '#ECE5D8', desc: 'Rulo texturado, muy cálido.' },
  terciopelo: { nombre: 'Terciopelo', hex: '#5A6239', desc: 'Brillo suave y color profundo.' },
  chenille: { nombre: 'Chenille', hex: '#B98549', desc: 'Gruesa y pareja al tacto.' },
  cuero: { nombre: 'Cuero ecológico', hex: '#8E5228', desc: 'Se limpia con un paño húmedo.' },
};
const COLORES = {
  crudo: { nombre: 'Crudo', hex: '#EAE3D6' },
  arena: { nombre: 'Arena', hex: '#D2C2A6' },
  'gris-topo': { nombre: 'Gris topo', hex: '#8A8178' },
  grafito: { nombre: 'Grafito', hex: '#4A4C51' },
  indigo: { nombre: 'Índigo', hex: '#2C3F74' },
  celeste: { nombre: 'Celeste', hex: '#9CB3CB' },
  oliva: { nombre: 'Oliva', hex: '#5A6239' },
  'verde-botella': { nombre: 'Verde botella', hex: '#2F4A3C' },
  terracota: { nombre: 'Terracota', hex: '#B4532F' },
  camel: { nombre: 'Camel', hex: '#B98549' },
  suela: { nombre: 'Suela', hex: '#8E5228' },
  negro: { nombre: 'Negro', hex: '#2B2724' },
};
const RANGOS = {
  'hasta-900': { label: 'Hasta $900.000', max: 900000 },
  '900-1500': { label: '$900.000 a $1.500.000', min: 900000, max: 1500000 },
  'mas-1500': { label: 'Más de $1.500.000', min: 1500000 },
};
const ORDENES = { destacados: 'Destacados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const HORARIO = [
  { dias: [1, 2, 3, 4, 5], tramos: [['08:30', '12:30'], ['16:00', '20:00']] },
  { dias: [6], tramos: [['09:00', '13:00']] },
];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const Tienda = crearTienda([
  { id: 'sofa-nube', nombre: 'Sofá Nube', cat: 'sofas', rango: 1, alta: 20, nuevo: true,
    img: 'p-sofa-nube', px: 1000,
    alt: 'Sofá Nube de líneas curvas tapizado en bouclé crudo, con una manta tejida sobre el brazo',
    medidas: [{ id: '2c', label: '2 cuerpos', cm: '180 × 95 cm', precio: 890000 }, { id: '3c', label: '3 cuerpos', cm: '220 × 95 cm', precio: 1090000 }],
    telas: ['boucle', 'lino', 'pana'], colores: ['crudo', 'arena', 'gris-topo', 'grafito'],
    desc: 'Líneas curvas, brazos redondeados y almohadones de asiento corridos. En bouclé crudo queda como en la foto; también se fabrica en lino o en pana.' },
  { id: 'esquinero-indigo', nombre: 'Esquinero Índigo', cat: 'esquineros', rango: 2, alta: 19,
    img: 'p-esquinero-indigo', px: 900, escena: 'images/hero-16x9.webp',
    alt: 'Esquinero Índigo con chaise tapizado en pana azul, con almohadones claros y una manta',
    medidas: [{ id: 'm', label: 'Mediano', cm: '280 × 170 cm', precio: 1750000 }, { id: 'g', label: 'Grande', cm: '320 × 180 cm', precio: 1980000 }],
    telas: ['pana', 'chenille', 'lino'], colores: ['indigo', 'grafito', 'arena', 'oliva'], lado: true,
    desc: 'Asiento profundo, almohadones de respaldo sueltos y chaise para estirarse. En la foto, en pana índigo y con el Puff Índigo al frente.' },
  { id: 'sillon-rufino', nombre: 'Sillón Rufino', cat: 'sillones', rango: 3, alta: 18,
    img: 'p-sillon-rufino', px: 1000,
    alt: 'Dos sillones Rufino de cuero ecológico color suela con patas de metal negras',
    medidas: [{ id: 'u', label: '1 sillón', cm: '78 × 82 cm', precio: 420000 }],
    telas: ['cuero', 'pana'], colores: ['suela', 'negro', 'verde-botella'],
    desc: 'Respaldo envolvente, almohadón de asiento suelto y patas de metal. En la foto, dos sillones en cuero ecológico suela.' },
  { id: 'esquinero-andes', nombre: 'Esquinero Andes', cat: 'esquineros', rango: 4, alta: 17,
    img: 'p-esquinero-andes', px: 1000,
    alt: 'Esquinero Andes con chaise tapizado en chenille gris grafito, con una mesa ratona redonda',
    medidas: [{ id: 'm', label: 'Mediano', cm: '240 × 160 cm', precio: 1450000 }, { id: 'g', label: 'Grande', cm: '280 × 180 cm', precio: 1690000 }],
    telas: ['chenille', 'pana', 'lino'], colores: ['grafito', 'gris-topo', 'arena', 'indigo'], lado: true,
    desc: 'Brazos rectos, respaldo con almohadones sueltos y chaise para estirar las piernas. En la foto, en chenille grafito.' },
  { id: 'esquinero-camel', nombre: 'Esquinero Camel', cat: 'esquineros', rango: 5, alta: 16,
    img: 'p-esquinero-camel', px: 1000,
    alt: 'Esquinero Camel modular en L tapizado en chenille color camel, con almohadones claros',
    medidas: [{ id: 'l', label: 'L pareja', cm: '260 × 260 cm', precio: 1890000 }, { id: 'xl', label: 'L larga', cm: '300 × 260 cm', precio: 2150000 }],
    telas: ['chenille', 'lino', 'pana'], colores: ['camel', 'arena', 'crudo', 'oliva'],
    desc: 'Esquinero modular en L, de asiento bajo y almohadones mullidos. Los módulos se pueden reacomodar si cambia el living.' },
  { id: 'sofa-oliva', nombre: 'Sofá Oliva', cat: 'sofas', rango: 6, alta: 15,
    img: 'p-sofa-oliva', px: 1000,
    alt: 'Sofá Oliva recto de tres cuerpos tapizado en terciopelo verde oliva con patas de madera',
    medidas: [{ id: '3c', label: '3 cuerpos', cm: '210 × 92 cm', precio: 980000 }, { id: '4c', label: '4 cuerpos', cm: '250 × 92 cm', precio: 1190000 }],
    telas: ['terciopelo', 'pana', 'lino'], colores: ['oliva', 'verde-botella', 'grafito', 'arena'],
    desc: 'Sofá recto de brazos finos, almohadones de asiento separados y patas de madera. En terciopelo oliva queda como en la foto.' },
  { id: 'loveseat-terra', nombre: 'Loveseat Terra', cat: 'sofas', rango: 7, alta: 14, nuevo: true,
    img: 'p-loveseat-terra', px: 1000,
    alt: 'Loveseat Terra de dos cuerpos con formas redondeadas, tapizado en chenille terracota',
    medidas: [{ id: '2c', label: '2 cuerpos', cm: '160 × 90 cm', precio: 760000 }, { id: '2xl', label: '2 cuerpos XL', cm: '180 × 90 cm', precio: 840000 }],
    telas: ['chenille', 'boucle', 'pana'], colores: ['terracota', 'camel', 'crudo', 'oliva'],
    desc: 'Dos cuerpos de líneas redondeadas, pensado para livings chicos, departamentos o un rincón de lectura.' },
  { id: 'juego-celeste', nombre: 'Juego Celeste', cat: 'juegos', rango: 8, alta: 13,
    img: 'p-juego-celeste', px: 1000,
    alt: 'Juego Celeste: sofá de tres cuerpos y sillón tapizados en lino celeste, con mesa ratona de madera',
    medidas: [{ id: '3-1', label: 'Sofá 3 + sillón', cm: '200 cm + 95 cm', precio: 1390000 }, { id: '3-2', label: 'Sofá 3 + sofá 2', cm: '200 cm + 160 cm', precio: 1690000 }],
    telas: ['lino', 'pana', 'chenille'], colores: ['celeste', 'arena', 'gris-topo', 'crudo'],
    desc: 'Sofá de tres cuerpos y sillón del mismo modelo, de brazos rectos y patas de madera, en la misma tela y el mismo color.' },
  { id: 'juego-lino', nombre: 'Juego Lino', cat: 'juegos', rango: 9, alta: 12,
    img: 'p-juego-lino', px: 900, escena: 'images/living-9x16.webp',
    alt: 'Juego Lino: sofá de tres cuerpos y sillón tapizados en lino arena, con mesa ratona de madera',
    medidas: [{ id: '3-1', label: 'Sofá 3 + sillón', cm: '220 cm + 100 cm', precio: 1490000 }, { id: '3-2', label: 'Sofá 3 + sofá 2', cm: '220 cm + 170 cm', precio: 1820000 }],
    telas: ['lino', 'boucle', 'chenille'], colores: ['arena', 'crudo', 'gris-topo'],
    desc: 'Sofá amplio de tres cuerpos con sillón al tono, brazos anchos y almohadones de respaldo sueltos.' },
  { id: 'puff-indigo', nombre: 'Puff Índigo', cat: 'sillones', rango: 10, alta: 11,
    img: 'p-puff-indigo', px: 660, escena: 'images/hero-16x9.webp',
    alt: 'Puff Índigo rectangular tapizado en pana azul, con una bandeja de madera encima',
    medidas: [{ id: 'm', label: 'Mediano', cm: '100 × 70 cm', precio: 290000 }, { id: 'g', label: 'Grande', cm: '120 × 80 cm', precio: 340000 }],
    telas: ['pana', 'chenille', 'lino'], colores: ['indigo', 'grafito', 'arena', 'oliva'],
    desc: 'Puff de apoyo del mismo modelo que el Esquinero Índigo: con una bandeja hace de mesa, sin ella sirve para estirar las piernas.' },
  { id: 'sofa-cama-siesta', nombre: 'Sofá cama Siesta', cat: 'sofas', rango: 0, alta: 1, visible: false,
    img: 'p-sofa-nube', px: 1000, alt: 'Sofá cama Siesta',
    medidas: [{ id: '2c', label: '2 cuerpos', cm: '180 × 90 cm', precio: 990000 }],
    telas: ['pana'], colores: ['grafito'], desc: 'Fuera de catálogo por ahora.' },
], { tope: 100, rangos: RANGOS, telas: TELAS, categorias: CATEGORIAS });

function crearTienda(coleccion, { tope = 100, rangos = {}, telas = {}, categorias = [] } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const nombreDeCat = id => categorias.find(c => c.id === id)?.nombre || '';
  const desde = p => Math.min(...p.medidas.map(m => m.precio));
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, nombreDeCat(p.cat), p.desc, ...p.medidas.map(m => `${m.label} ${m.cm}`),
    ...(p.telas || []).map(t => telas[t]?.nombre || t), ...(p.colores || []).map(c => c.replace(/-/g, ' ')), p.lado ? 'chaise' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), tela = lista(f.tela), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tela.length && !tela.some(t => (p.telas || []).includes(t))) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.rango && rangos[f.rango]) {
      const r = rangos[f.rango], precio = desde(p);
      if (r.min != null && precio < r.min) return false;
      if (r.max != null && precio >= r.max) return false;
    }
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => categorias.map(c => ({ id: c.id, cantidad: contar({ cat: c.id }) }));
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Tienda.obtener(id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const imgDe = p => `images/${p.img}.webp`;
const precioDesde = p => Math.min(...p.medidas.map(m => m.precio));
const hayVarios = p => p.medidas.some(m => m.precio !== p.medidas[0].precio);
const anchos = p => p.medidas.map(m => parseInt(m.cm, 10));
const unidadMedida = p => (p.cat === 'juegos' ? p.medidas.map(m => m.id.replace('-', ' + ')).join(' o ') : p.medidas.length > 1 ? `${anchos(p)[0]} a ${anchos(p)[p.medidas.length - 1]} cm` : `${anchos(p)[0]} cm`);

function grupos(p) {
  const g = [
    { id: 'medida', nombre: 'Medida', ops: p.medidas.map(m => ({ id: m.id, label: m.label, det: m.cm, precio: m.precio })) },
    { id: 'tela', nombre: 'Tela', ops: p.telas.map(t => ({ id: t, label: TELAS[t]?.nombre || t, hex: TELAS[t]?.hex })) },
    { id: 'color', nombre: 'Color', ops: p.colores.map(c => ({ id: c, label: COLORES[c]?.nombre || c, hex: COLORES[c]?.hex })) },
  ];
  if (p.lado) g.push({ id: 'lado', nombre: 'Lado de la chaise', ops: [{ id: 'der', label: 'Derecha' }, { id: 'izq', label: 'Izquierda' }] });
  return g;
}
function leerV(p, v) {
  const partes = String(v || '').split('|');
  const sel = {};
  grupos(p).forEach((g, i) => { sel[g.id] = g.ops.find(o => o.id === partes[i]) || g.ops[0]; });
  return sel;
}
const armarV = (p, sel) => grupos(p).map(g => (sel[g.id]?.id || g.ops[0].id)).join('|');
const vDefault = p => armarV(p, {});
const normV = (p, v) => armarV(p, leerV(p, v));
const precioDe = (p, v) => leerV(p, v).medida.precio;
function detalleV(p, v) {
  const s = leerV(p, v);
  return [`${s.medida.label} (${s.medida.det})`, s.tela.label, s.color.label, s.lado ? `chaise ${s.lado.label.toLowerCase()}` : ''].filter(Boolean).join(' · ');
}

const Cart = {
  KEY: 'mdliving_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 10);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 10) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 10)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2M4 14l2 2"/></svg>',
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer.open, .modal:not([hidden]), .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  subirCh: ' data-animate="subir" style="opacity:0;transform:translateY(20px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(16px) scale(.94)"',
};
function stepperHTML(nombre) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="10" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function precioHTML(p, cls = 'pcard__precio') {
  return `<p class="${cls}">${hayVarios(p) ? '<small>Desde</small>' : ''}<span>${formatearPrecio(precioDesde(p))}</span></p>`;
}
function swatchesHTML(p, max = 4) {
  const cs = p.colores.slice(0, max);
  const resto = p.colores.length - cs.length;
  return `<span class="swatches" aria-label="Colores: ${esc(p.colores.map(c => COLORES[c]?.nombre || c).join(', '))}">${cs.map(c => `<span class="swatch" style="--sw:${COLORES[c]?.hex || '#ccc'}"></span>`).join('')}${resto > 0 ? `<span class="swatches__mas">+${resto}</span>` : ''}</span>`;
}
function cardHTML(p, { rail = false, anim = true } = {}) {
  const a = anim ? (rail ? ANIM.der : ANIM.subir) : '';
  const n = esc(p.nombre);
  const v = vDefault(p);
  const badge = p.nuevo ? '<span class="pcard__badge">Nuevo</span>' : '';
  const foto = `<button type="button" class="pcard__foto" data-quick="${p.id}" aria-label="Elegir medida y tela de ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${badge}<span class="pcard__elegir" aria-hidden="true">${ICON.regla}Elegir medida y tela</span></button>`;
  const acciones = `<div class="prod-actions">${rail ? '' : stepperHTML(p.nombre)}<button type="button" class="btn btn-cta prod-add" data-add="${p.id}" data-v="${v}" aria-label="Agregar ${n} al carrito">${ICON.carrito}<span>${rail ? 'Agregar al carrito' : 'Agregar'}</span></button></div>`;
  const nombre = rail ? `<h3 class="pcard__nombre">${n}</h3>` : `<h3 class="pcard__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3>`;
  return `<article class="pcard${rail ? ' pcard--rail' : ''}"${a}>${foto}
    <div class="pcard__info"><p class="pcard__meta">${esc(nombreCat(p.cat))} · ${esc(unidadMedida(p))}</p>${nombre}
    <div class="pcard__fila">${precioHTML(p)}${swatchesHTML(p)}</div>
    ${acciones}${rail ? '' : `<button type="button" class="prod-buy" data-buy="${p.id}" data-v="${v}">Comprar ahora</button>`}</div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
document.addEventListener('cart:updated', updateCartBadge);

function waPedido() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) return waLink('¡Hola, MD Living! Quiero consultar por un juego de living.');
  const txt = lineas.map(({ p, v, qty }) => `• ${qty} × ${p.nombre} (${detalleV(p, v)}): ${formatearPrecio(precioDe(p, v) * qty)}`).join('\n');
  return waLink(`¡Hola, MD Living! Quiero encargar:\n${txt}\nTotal: ${formatearPrecio(Cart.total())}\n¿Me confirman el plazo de fabricación y la entrega?`);
}

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p) return false;
  const vv = normV(p, v);
  Cart.add(p, qty, vv);
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre} (${leerV(p, vv).medida.label}, ${leerV(p, vv).tela.label.toLowerCase()}) al carrito`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.pcard, .qv, .prod-actions, .qv__acciones, .mcard')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 10)) : 1;
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, 10));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, cantidadDe(add), add.dataset.v || '');
      add.classList.remove('agregado'); void add.offsetWidth; add.classList.add('agregado');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '')) { cerrarQuickView(false); abrirCarrito(); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, quick); return; }
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, 10));
  });
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); syncNoScroll();
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); } else atraparFoco(nav, e);
  });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatMenu() {
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const resumen = Tienda.resumen();
  const href = catalogoHref();
  const activa = document.body.dataset.pagina === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = CATEGORIAS.map(c => {
    const r = resumen.find(x => x.id === c.id);
    return `<a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="52" height="52"><span>${esc(c.nombre)}</span><span class="nav-cats__cant">${r?.cantidad || 0} ${r?.cantidad === 1 ? 'modelo' : 'modelos'}</span></a>`;
  }).join('') + `<a class="nav-cats__todo" href="${href}">Ver todos los modelos ${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open') && hoverMq.matches) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target) && hoverMq.matches) cerrar(); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
}

const aMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const horaTxt = hhmm => { const [h, m] = hhmm.split(':').map(Number); return m ? `${h}:${String(m).padStart(2, '0')} h` : `${h} h`; };
function ahoraEnCordoba(fecha = new Date()) {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Cordoba', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia, min: Number(val('hour')) * 60 + Number(val('minute')) };
  } catch { return { dia: fecha.getDay(), min: fecha.getHours() * 60 + fecha.getMinutes() }; }
}
function estadoAtencion(ahora = ahoraEnCordoba()) {
  const tramosDe = d => HORARIO.find(h => h.dias.includes(d))?.tramos || [];
  const hoy = tramosDe(ahora.dia);
  const actual = hoy.find(([a, b]) => ahora.min >= aMin(a) && ahora.min < aMin(b));
  if (actual) return { abierto: true, largo: `Abierto ahora · hasta las ${horaTxt(actual[1])}`, corto: 'Abierto ahora' };
  const luego = hoy.find(([a]) => aMin(a) > ahora.min);
  if (luego) return { abierto: false, largo: `Cerrado · abrimos hoy a las ${horaTxt(luego[0])}`, corto: `Abre a las ${horaTxt(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (ahora.dia + k) % 7;
    const t = tramosDe(d);
    if (t.length) {
      const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
      return { abierto: false, largo: `Cerrado · abrimos ${cuando} a las ${horaTxt(t[0][0])}`, corto: `Abre ${cuando} ${horaTxt(t[0][0])}` };
    }
  }
  return { abierto: false, largo: 'Cerrado', corto: 'Cerrado' };
}
function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('[data-dias]');
  if (!els.length && !filas.length) return;
  const pintar = () => {
    const ahora = ahoraEnCordoba();
    const est = estadoAtencion(ahora);
    els.forEach(el => {
      el.textContent = el.dataset.estado === 'corto' ? est.corto : est.largo;
      el.classList.toggle('is-cerrado', !est.abierto);
      el.classList.add('is-listo');
    });
    filas.forEach(f => f.classList.toggle('is-hoy', f.dataset.dias.split(',').map(Number).includes(ahora.dia)));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, y: 18, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
  const costura = hero.querySelector('.hero-costura');
  if (costura) tl.from(costura, { scaleY: 0, transformOrigin: '50% 0%', duration: 1.4, clearProps: 'transform' }, 0.15);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    document.querySelectorAll('[data-parallax]').forEach(img => {
      const sec = img.closest('section');
      gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 7 }).items;
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  const vp = document.getElementById('railDest');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) * 1.5;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, .stepper, [data-add]')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
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
      const card = vp.querySelector('.pcard');
      if (card && !reduceMotion) {
        const ancho = card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(card.parentElement).columnGap) || 0);
        const inicio = parseFloat(window.getComputedStyle(card.parentElement).paddingInlineStart) || 0;
        const destino = Math.round((vp.scrollLeft - inicio) / ancho) * ancho + inicio;
        vp.scrollTo({ left: Math.max(0, destino), behavior: 'smooth' });
      }
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function renderFormas() {
  document.querySelectorAll('[data-formas]').forEach(cont => {
    const resumen = Tienda.resumen();
    const href = catalogoHref();
    cont.innerHTML = CATEGORIAS.map(c => {
      const r = resumen.find(x => x.id === c.id)?.cantidad || 0;
      return `<a class="forma" href="${href}?cat=${c.id}"${ANIM.subir}><span class="forma__foto"><img src="${c.img}" alt="" width="1000" height="1000"></span><span class="forma__txt"><span class="forma__nombre">${esc(c.nombre)}</span><span class="forma__cant">${r} ${r === 1 ? 'modelo' : 'modelos'} ${ICON.flecha}</span></span></a>`;
    }).join('');
  });
}

function mcardHTML(p, grande) {
  const n = esc(p.nombre);
  return `<article class="mcard${grande ? ' mcard--grande' : ''}"${ANIM.subir}>
    <button type="button" class="mcard__foto" data-quick="${p.id}" aria-label="Elegir medida y tela de ${n}"><img src="${grande && p.escena && p.escena.includes('16x9') ? p.escena : imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${p.nuevo ? '<span class="pcard__badge">Nuevo</span>' : ''}</button>
    <div class="mcard__txt"><p class="mcard__meta">${esc(unidadMedida(p))}</p><h3 class="mcard__nombre">${n}</h3>${precioHTML(p, 'mcard__precio')}</div>
    <button type="button" class="mcard__add" data-add="${p.id}" data-v="${vDefault(p)}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}</button>
  </article>`;
}
function renderMosaico() {
  const cont = document.getElementById('mosaico');
  if (!cont) return;
  const res = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 7 });
  const total = Tienda.contar({});
  cont.innerHTML = res.items.map((p, i) => mcardHTML(p, i === 0)).join('') +
    `<a class="mcard-cta" href="${catalogoHref()}"${ANIM.subir}><span class="mcard-cta__num">${total}</span><span class="mcard-cta__txt">modelos para elegir medida, tela y color</span><span class="mcard-cta__link">Ver todos los modelos ${ICON.flecha}</span></a>`;
}

let qvUltimoFoco = null;
function opsHTML(p, g, sel) {
  if (g.id === 'color') {
    return `<div class="qv__colores">${g.ops.map(o => `<button type="button" class="qv__color" data-g="color" data-op="${o.id}" aria-pressed="${o.id === sel.color.id}" aria-label="${esc(o.label)}" title="${esc(o.label)}"><span style="--sw:${o.hex}"></span></button>`).join('')}<span class="qv__color-nombre" data-color-nombre>${esc(sel.color.label)}</span></div>`;
  }
  return `<div class="qv__ops qv__ops--${g.id}">${g.ops.map(o => `<button type="button" class="qv__op" data-g="${g.id}" data-op="${o.id}" aria-pressed="${o.id === sel[g.id].id}">${g.id === 'tela' ? `<span class="qv__tela" style="--sw:${o.hex}"></span>` : ''}<span>${esc(o.label)}</span>${o.det ? `<small>${esc(o.det)}${g.id === 'medida' && hayVarios(p) ? ` · ${formatearPrecio(o.precio)}` : ''}</small>` : ''}</button>`).join('')}</div>`;
}
function abrirQuickView(id, trigger) {
  const modal = document.getElementById('quickView');
  const cont = document.getElementById('qvContenido');
  const p = getProducto(id);
  if (!modal || !cont || !p) return;
  if (modal.hidden) qvUltimoFoco = trigger || document.activeElement;
  const n = esc(p.nombre);
  let v = vDefault(p);
  const sel = leerV(p, v);
  const fotos = [imgDe(p), p.escena].filter(Boolean);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const masRel = rel.length < 3 ? Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, orden: 'destacados', limite: 3 - rel.length }).items : [];
  const relacionados = [...rel, ...masRel];
  cont.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__principal"><img src="${fotos[0]}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}" data-qv-img></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-foto="${f}" aria-pressed="${i === 0}" aria-label="${i === 0 ? 'Ver la foto del modelo' : 'Ver el modelo en el living'}"><img src="${f}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreCat(p.cat))}${p.nuevo ? ' · Nuevo' : ''}</p>
      <h2 class="qv__nombre">${n}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioDe(p, v))}</span></p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${grupos(p).map(g => `<fieldset class="qv__var"><legend>${esc(g.nombre)}</legend>${opsHTML(p, g, sel)}</fieldset>`).join('')}
      <p class="qv__eleccion"><span>Tu elección</span><strong data-qv-detalle>${esc(detalleV(p, v))}</strong></p>
      <div class="qv__acciones">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta" data-add="${p.id}" data-v="${v}">${ICON.carrito}<span>Agregar al carrito</span></button><button type="button" class="btn btn-ghost" data-buy="${p.id}" data-v="${v}">Comprar ahora</button></div>
      <p class="qv__nota">Se fabrica a pedido: antes de arrancar te confirmamos el plazo y coordinamos la entrega por WhatsApp.</p>
      <a class="qv__wa" data-qv-wa href="${waLink(`¡Hola, MD Living! Quiero consultar por el ${p.nombre}: ${detalleV(p, v)}.`)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar este modelo por WhatsApp</span></a>
    </div>
    ${relacionados.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="56" height="56"><span>${esc(r.nombre)}<small>${hayVarios(r) ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</small></span></button>`).join('')}</div></div>` : ''}`;
  const pintarFoto = src => {
    const im = cont.querySelector('[data-qv-img]');
    if (im) im.src = src;
    cont.querySelectorAll('[data-foto]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.foto === src)));
  };
  cont.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    const s = leerV(p, v);
    const g = grupos(p).find(x => x.id === b.dataset.g);
    s[b.dataset.g] = g.ops.find(o => o.id === b.dataset.op) || g.ops[0];
    v = armarV(p, s);
    cont.querySelectorAll(`[data-g="${b.dataset.g}"]`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('[data-add], [data-buy]').forEach(x => { if (x.dataset.add === p.id || x.dataset.buy === p.id) x.dataset.v = v; });
    const pr = cont.querySelector('[data-qv-precio]');
    if (pr) pr.textContent = formatearPrecio(precioDe(p, v));
    const det = cont.querySelector('[data-qv-detalle]');
    if (det) det.textContent = detalleV(p, v);
    const cn = cont.querySelector('[data-color-nombre]');
    if (cn) cn.textContent = leerV(p, v).color.label;
    const wa = cont.querySelector('[data-qv-wa]');
    if (wa) wa.href = waLink(`¡Hola, MD Living! Quiero consultar por el ${p.nombre}: ${detalleV(p, v)}.`);
  }));
  cont.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => pintarFoto(b.dataset.foto)));
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(imgDe(p), location.href).href, brand: { '@type': 'Brand', name: 'MD Living' }, offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.medidas.map(m => m.precio)), offerCount: p.medidas.length, availability: 'https://schema.org/MadeToOrder' } });
  const yaAbierto = !modal.hidden;
  modal.hidden = false;
  cont.parentElement.scrollTop = 0;
  syncNoScroll();
  if (!yaAbierto) requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  modal.querySelector('.modal__cerrar')?.focus();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQuickView(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  syncNoScroll();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  if (devolverFoco && qvUltimoFoco?.isConnected) qvUltimoFoco.focus();
}
function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close-modal]')) cerrarQuickView(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarQuickView();
    else atraparFoco(modal, e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, null);
}

let carritoUltimoFoco = null;
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.carrito}<h3>Tu carrito está vacío</h3><p>Elegí un modelo, la medida y la tela, y lo sumás acá para encargarlo.</p><a class="btn btn-cta" href="${catalogoHref()}">Ver los modelos</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = lineas.map(({ p, v, qty }, k) => `<div class="linea" data-id="${p.id}" data-v="${esc(v || '')}"${animar ? ` style="animation-delay:${Math.min(k * 0.05, 0.3)}s"` : ' style="animation:none"'}>
      <img src="${imgDe(p)}" alt="" width="76" height="76">
      <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(detalleV(p, v))}</p>
        <div class="linea__fila"><div class="stepper" data-stepper><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="10" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
        <span class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</span>
        <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.basura}</button></div>
      </div></div>`).join('');
  if (total) total.textContent = formatearPrecio(Cart.total());
}
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  carritoUltimoFoco = document.activeElement;
  renderCarrito(true);
  drawer.removeAttribute('inert');
  drawer.classList.add('open'); bd?.classList.add('open');
  syncNoScroll();
  drawer.querySelector('[data-close-cart]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open'); bd?.classList.remove('open');
  drawer.setAttribute('inert', '');
  syncNoScroll();
  if (carritoUltimoFoco?.isConnected) carritoUltimoFoco.focus();
}
function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('.linea');
    if (!linea) return;
    const { id, v } = linea.dataset;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v)?.qty || 1;
      Cart.setQty(id, v, actual + Number(step.dataset.lineaStep));
    }
    if (e.target.closest('[data-quitar]')) Cart.remove(id, v);
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.linea input');
    if (!input) return;
    const { id, v } = input.closest('.linea').dataset;
    Cart.setQty(id, v, parseInt(input.value, 10) || 1);
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(false); });
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarCarrito();
    else atraparFoco(drawer, e);
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

const POR_PAGINA = 16;
function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid || document.body.dataset.pagina !== 'catalogo') return;
  const params = new URLSearchParams(location.search);
  const valida = (v, mapa) => (v && Object.prototype.hasOwnProperty.call(mapa, v) ? v : '');
  const catsValidas = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const st = {
    cat: valida(params.get('cat'), catsValidas),
    tela: (params.get('tela') || '').split(',').filter(s => TELAS[s]),
    precio: valida(params.get('precio'), RANGOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valida(params.get('orden'), ORDENES) || 'destacados',
  };
  const el = {
    titulo: document.getElementById('catTitulo'), bajada: document.getElementById('catBajada'), miga: document.getElementById('migaCat'),
    q: document.getElementById('q'), orden: document.getElementById('orden'), resumen: document.getElementById('resumen'),
    mas: document.getElementById('masWrap'), verMas: document.getElementById('verMas'), mostrando: document.getElementById('mostrando'),
    cats: document.getElementById('filtroCats'), telas: document.getElementById('filtroTelas'),
    precios: document.getElementById('filtroPrecios'), filtros: document.getElementById('filtros'), abrir: document.getElementById('abrirFiltros'),
  };
  const bajadaBase = el.bajada?.textContent || '';
  const tituloBase = el.titulo?.textContent || 'Todos los modelos';
  let cursor = null, mostrados = 0, total = 0;

  el.cats.innerHTML = [{ id: '', nombre: 'Todos los modelos' }, ...CATEGORIAS].map(c => `<button type="button" class="filtro__cat" data-cat="${c.id}" aria-pressed="${st.cat === c.id}">${esc(c.nombre)}<span>${Tienda.contar(c.id ? { cat: c.id } : {})}</span></button>`).join('');
  el.telas.innerHTML = Object.entries(TELAS).map(([id, t]) => `<label class="check"><input type="checkbox" data-f="tela" value="${id}"${st.tela.includes(id) ? ' checked' : ''}><span class="check__sw" style="--sw:${t.hex}"></span>${esc(t.nombre)}</label>`).join('');
  el.precios.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([id, r]) => [id, r.label])].map(([id, l]) => `<label class="check"><input type="radio" name="precio" value="${id}"${st.precio === id ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.orden.innerHTML = Object.entries(ORDENES).map(([id, l]) => `<option value="${id}"${st.orden === id ? ' selected' : ''}>${esc(l)}</option>`).join('');
  el.q.value = st.q;

  const filtrosServidor = () => ({ cat: st.cat || undefined, tela: st.tela, rango: st.precio || undefined, q: st.q || undefined });
  const activos = () => (st.cat ? 1 : 0) + st.tela.length + (st.precio ? 1 : 0) + (st.q ? 1 : 0);

  function escribirURL() {
    const u = new URL(location.href);
    ['cat', 'tela', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.cat) u.searchParams.set('cat', st.cat);
    if (st.tela.length) u.searchParams.set('tela', st.tela.join(','));
    if (st.precio) u.searchParams.set('precio', st.precio);
    if (st.q) u.searchParams.set('q', st.q);
    if (st.orden !== 'destacados') u.searchParams.set('orden', st.orden);
    window.history.replaceState(null, '', u);
  }
  function pintarCabecera() {
    const c = catsValidas[st.cat];
    if (el.titulo) el.titulo.textContent = c ? c.nombre : tituloBase;
    if (el.bajada) el.bajada.textContent = c ? c.bajada : bajadaBase;
    if (el.miga) { el.miga.hidden = !c; const s = el.miga.querySelector('span:last-child'); if (s) s.textContent = c ? c.nombre : ''; }
    document.title = `${c ? c.nombre : 'Todos los modelos'} — MD Living, juegos de living a medida`;
    el.cats.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === st.cat)));
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (st.cat && new URL(a.href).searchParams.get('cat') === st.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarResumen() {
    const chips = [];
    if (st.cat) chips.push(['cat', st.cat, catsValidas[st.cat].nombre]);
    st.tela.forEach(t => chips.push(['tela', t, `En ${TELAS[t].nombre.toLowerCase()}`]));
    if (st.precio) chips.push(['precio', st.precio, RANGOS[st.precio].label]);
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    el.resumen.innerHTML = `<span><strong>${total}</strong> ${total === 1 ? 'modelo' : 'modelos'}</span>` +
      chips.map(([k, v, l]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') +
      (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    document.querySelectorAll('[data-total]').forEach(s => { s.textContent = total; });
    const nf = document.querySelector('[data-nfiltros]');
    if (nf) nf.textContent = activos() ? `(${activos()})` : '';
  }
  function vacioHTML() {
    return `<div class="vacio"${ANIM.subirCh}><h2>Ese modelo no está en el catálogo (todavía)</h2><p>Probá con otra palabra o sacá algún filtro. Si buscás una medida o una forma especial, contanos y vemos cómo fabricarlo.</p><div class="vacio__ctas"><button type="button" class="btn btn-cta" data-limpiar>Limpiar filtros</button><a class="btn btn-ghost" href="${waLink('¡Hola, MD Living! Busco un modelo que no encontré en la web: ')}" target="_blank" rel="noopener">${ICON.wa}<span>Contanos por WhatsApp</span></a></div></div>`;
  }
  function cargar(reset) {
    const res = Tienda.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
    if (reset) { grid.innerHTML = ''; mostrados = 0; }
    total = res.total; cursor = res.cursor;
    if (!total) grid.innerHTML = vacioHTML();
    else grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    el.mas.hidden = !cursor;
    if (el.mostrando) el.mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    pintarResumen();
    revelarNuevos(grid);
    refrescarScroll();
  }
  function aplicar() { pintarCabecera(); escribirURL(); cargar(true); }

  el.cats.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; st.cat = b.dataset.cat; aplicar(); });
  el.filtros.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) {
      st[t.dataset.f] = [...el.filtros.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
      aplicar();
    } else if (t.matches('input[name="precio"]')) { st.precio = valida(t.value, RANGOS); aplicar(); }
  });
  el.orden.addEventListener('change', () => { st.orden = valida(el.orden.value, ORDENES) || 'destacados'; aplicar(); });
  let deb = 0;
  el.q.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { st.q = el.q.value.trim().slice(0, 60); aplicar(); }, 250); });
  document.getElementById('buscador')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); st.q = el.q.value.trim().slice(0, 60); aplicar(); });
  el.verMas.addEventListener('click', () => cargar(false));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(st, { cat: '', tela: [], precio: '', q: '' });
      el.q.value = '';
      el.filtros.querySelectorAll('input[type="checkbox"]').forEach(i => { i.checked = false; });
      const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true;
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-quitar-filtro]');
    if (!chip) return;
    const k = chip.dataset.quitarFiltro, v = chip.dataset.valor;
    if (k === 'cat') st.cat = '';
    else if (k === 'precio') { st.precio = ''; const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true; }
    else if (k === 'q') { st.q = ''; el.q.value = ''; }
    else { st[k] = st[k].filter(x => x !== v); const i = el.filtros.querySelector(`input[data-f="${k}"][value="${v}"]`); if (i) i.checked = false; }
    aplicar();
  });

  const mobileMq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  let filtrosFoco = null;
  const cerrarFiltros = () => {
    if (!el.filtros.classList.contains('open')) return;
    el.filtros.classList.remove('open'); bd.classList.remove('open');
    el.abrir?.setAttribute('aria-expanded', 'false');
    if (mobileMq.matches) el.filtros.setAttribute('inert', '');
    syncNoScroll();
    filtrosFoco?.focus();
  };
  const abrirFiltros = () => {
    filtrosFoco = document.activeElement;
    el.filtros.removeAttribute('inert');
    el.filtros.classList.add('open'); bd.classList.add('open');
    el.abrir?.setAttribute('aria-expanded', 'true');
    syncNoScroll();
    el.filtros.querySelector('[data-cerrar-filtros]')?.focus();
  };
  el.abrir?.addEventListener('click', abrirFiltros);
  bd.addEventListener('click', cerrarFiltros);
  el.filtros.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarFiltros(); });
  document.addEventListener('keydown', e => {
    if (!el.filtros.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros(); else atraparFoco(el.filtros, e);
  });
  const syncFiltros = () => {
    if (mobileMq.matches) {
      if (!el.filtros.classList.contains('open')) el.filtros.setAttribute('inert', '');
      el.filtros.querySelectorAll('[data-animate]').forEach(x => x.classList.add('in'));
    } else { el.filtros.removeAttribute('inert'); cerrarFiltros(); }
  };
  mobileMq.addEventListener('change', syncFiltros);
  syncFiltros();

  pintarCabecera();
  cargar(true);
  if (params.has('q') && !st.q) setTimeout(() => el.q.focus({ preventScroll: true }), 300);
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

initModelBarScroll();
initNav();
initCatMenu();
initEstado();
renderRail();
renderFormas();
renderMosaico();
initAcciones();
initQuickView();
initCarrito();
initFloats();
initCatalogo();
updateCartBadge();
initReveals();
initHeroMotion();
initParallax();
