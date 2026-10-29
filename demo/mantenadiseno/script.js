const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491138682799';
const MARCA = 'Manteña Diseño';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'asientos', nombre: 'Asientos', bajada: 'Mecedora, banqueta y sillón de autor.', img: 'images/p-cacique.webp',
    texto: 'La misma lámina curva convertida en asiento de suelo, banqueta o sillón. Elegís el enchapado de cada pieza.',
    subs: [{ id: 'suelo', nombre: 'Asiento de suelo' }, { id: 'banco', nombre: 'Bancos y banquetas' }, { id: 'sillon', nombre: 'Sillones' }] },
  { id: 'mesas', nombre: 'Mesas', bajada: 'Bases curvas y tapa de cristal.', img: 'images/p-mesa.webp',
    texto: 'Dos bases monocurvas que sostienen por gravedad una tapa de cristal templado, cuadrada o redonda.',
    subs: [] },
  { id: 'sets', nombre: 'Sets', bajada: 'Sillones y mesa, listos para recibir.', img: 'images/p-senorio.webp',
    texto: 'Sillones de autor Línea Cacique con la mesa de centro Línea Coalición, para salas de espera y oficinas.',
    subs: [] },
];
const ESPACIOS = [
  { id: 'recepcion', nombre: 'Recepciones y vestíbulos', frase: 'Piezas para recibir en accesos residenciales, corporativos y vestíbulos.' },
  { id: 'espera', nombre: 'Salas de espera', frase: 'Piezas para salas de espera de clínicas, centros de estética y showrooms.' },
  { id: 'oficinas', nombre: 'Oficinas ejecutivas', frase: 'Piezas para oficinas ejecutivas y espacios de reunión.' },
  { id: 'relax', nombre: 'Meditación y relax', frase: 'Piezas para rincones de meditación, terapia y descompresión.' },
  { id: 'lectura', nombre: 'Lectura y terrazas', frase: 'Piezas para espacios de lectura y terrazas.' },
];
const PRECIOS = [
  { id: 'hasta700', nombre: 'Hasta $700.000', min: null, max: 700000 },
  { id: '700a1000', nombre: '$700.000 a $1.000.000', min: 700001, max: 1000000 },
  { id: 'mas1000', nombre: 'Más de $1.000.000', min: 1000001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacadas' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  asientos: 'asiento asientos silla sillas sillon banco banqueta', mesas: 'mesa mesas cristal vidrio centro ratona', sets: 'set sets juego living sala combo',
  suelo: 'zafu suelo piso meditacion mecedora balanceo', banco: 'manta banco banqueta ottoman puff', sillon: 'poltrona jaboncillo sillon butaca cacique',
  recepcion: 'recepcion vestibulo hall acceso hotel', espera: 'espera clinica consultorio estetica showroom', oficinas: 'oficina oficinas ejecutiva reunion corporativo',
  relax: 'relax meditacion terapia descanso', lectura: 'lectura terraza balcon',
};
const ENCHAPADO = { tipo: 'Enchapado', ops: ['Guatambú', 'Paraíso'] };
const MUESTRAS = { 'Guatambú': 'images/enchapado-guatambu.webp', 'Paraíso': 'images/enchapado-paraiso.webp' };

const Tienda = crearTienda([
  { id: 'sillon-cacique', nombre: 'Sillón de autor', linea: 'Línea Cacique · U-CONTOUR', modo: 'Poltrona Jaboncillo', cat: 'asientos', sub: 'sillon',
    espacios: ['espera', 'oficinas', 'lectura'], precio: 950000, antes: 1250000, stock: 20, alta: 4, rango: 1,
    vars: [ENCHAPADO], img: 'images/p-cacique.webp',
    alt: 'Sillón de autor Línea Cacique: dos láminas de madera curvada cruzadas, con almohadilla gris, en un living luminoso',
    fotos: [{ src: 'images/g-cacique.webp', alt: 'Sillón Línea Cacique de madera curvada con almohadilla gris, sobre una alfombra de yute', alta: true },
      { src: 'images/g-cacique-oficina.webp', alt: 'Cuatro sillones Línea Cacique en fila en la sala de espera de una oficina', alta: true }],
    desc: 'Una pieza monolítica que preside cualquier espacio: dos monocascos de multilaminado de 18 mm cruzados, con el dibujo de las capas de madera a la vista.',
    specs: ['Precio por unidad', 'Almohadilla de espuma de alta densidad (28 kg/m³)', 'Fundas desmontables de fácil higienización', 'Cantos con pulido artesanal y laqueado perimetral'] },
  { id: 'mecedora-zen', nombre: 'Mecedora Zen', linea: 'Línea Chamán · U-ROCKER', modo: 'Zafu', cat: 'asientos', sub: 'suelo',
    espacios: ['relax', 'lectura'], precio: 650000, antes: 790000, stock: 20, alta: 3, rango: 2,
    vars: [ENCHAPADO], img: 'images/p-mecedora.webp',
    alt: 'Mecedora Zen Línea Chamán: lámina de madera curvada apoyada sobre su lomo, con almohadón gris, en un rincón de meditación',
    fotos: [{ src: 'images/g-mecedora.webp', alt: 'Mecedora Zen con almohadón gris en un rincón de meditación con almohadones y plantas' }],
    desc: 'Relax al ras del suelo y fluidez orgánica. Aprovecha el lomo de su propia curvatura para un balanceo suave, anatómico e informal, ideal para espacios de terapia o áreas de lectura.',
    specs: ['Monocurvo laminado y laqueado', 'Cantos sellados con laca satinada', 'Almohadón integrado de alta resistencia'] },
  { id: 'banqueta-ancestral', nombre: 'Banqueta Modular', linea: 'Línea Ancestral · U-BENCH', modo: 'Manta', cat: 'asientos', sub: 'banco',
    espacios: ['recepcion', 'espera'], precio: 650000, antes: 790000, stock: 20, alta: 2, rango: 3,
    vars: [ENCHAPADO], img: 'images/p-banqueta.webp',
    alt: 'Dos Banquetas Modulares Línea Ancestral en U invertida, con almohadones, frente a un ventanal con la ciudad',
    fotos: [{ src: 'images/g-banqueta.webp', alt: 'Dos banquetas de madera curvada en U invertida con almohadones, junto a un ventanal al atardecer' }],
    desc: 'Pureza lineal y rigidez absoluta: la estructura en «U» invertida forma un módulo de alta resistencia y uso polivalente. Funciona sola como banqueta de recepción o como ottoman de los sillones curvos.',
    specs: ['Precio por unidad', 'Madera natural satinada', 'Cantos sellados contra la abrasión'] },
  { id: 'mesa-coalicion', nombre: 'Mesa de centro', linea: 'Línea Coalición · U-CRISTAL', modo: 'Coalición', cat: 'mesas', sub: '',
    espacios: ['espera', 'oficinas'], precio: 950000, antes: 1250000, stock: 20, alta: 1, rango: 4,
    vars: [ENCHAPADO, { tipo: 'Tapa', ops: ['Transparente, cuadrada', 'Esfumada, cuadrada', 'Transparente, redonda', 'Esfumada, redonda'] }],
    img: 'images/p-mesa.webp',
    alt: 'Mesa de centro Línea Coalición: dos bases de madera curvada entrelazadas con tapa de cristal, en un living cálido',
    fotos: [{ src: 'images/g-mesa.webp', alt: 'Mesa de centro de cristal con dos bases curvas de madera entrelazadas, sobre una alfombra' },
      { src: 'images/g-mesa-living.webp', alt: 'Mesa de centro Línea Coalición en un living con ventanal y vista a la ciudad' },
      { src: 'images/g-mesa-redonda.webp', alt: 'Mesa de centro con tapa de cristal redonda en una sala cálida con lámparas' }],
    desc: 'Una escultura de fuerzas contrapuestas: dos bases monocurvas se entrelazan y sostienen por gravedad una tapa de cristal templado. Desde arriba se ven las vetas de la madera.',
    specs: ['Cristal templado de seguridad de 10 mm', 'Cantos pulidos y esquinas redondeadas anti-impacto', 'Fijación con almohadillas de silicona y ventosas antideslizantes'] },
  { id: 'set-duo', nombre: 'Set Corporativo Duo', linea: 'Línea Prestigio · 2 sillones + mesa', modo: '', cat: 'sets', sub: '', tag: 'Set',
    espacios: ['oficinas', 'espera'], precio: 1950000, antes: 2100000, stock: 20, alta: 5, rango: 5,
    vars: [ENCHAPADO], img: 'images/p-duo.webp',
    alt: 'Set Corporativo Duo: sillón de autor Línea Cacique junto a la mesa de centro de cristal, en un consultorio',
    fotos: [{ src: 'images/g-duo.webp', alt: 'Dos sillones Línea Cacique con almohadones blancos y una mesa de centro de cristal en un consultorio' },
      { src: 'images/g-duo-oficina.webp', alt: 'Set de dos sillones y mesa de cristal en una oficina de arquitectura' }],
    desc: 'Dos sillones de autor Línea Cacique y una mesa de centro de cristal Línea Coalición: un rincón de reunión completo, con la misma curva en las tres piezas.',
    specs: ['2 sillones Línea Cacique (U-CONTOUR)', '1 mesa de centro de cristal Línea Coalición (U-CRISTAL)', 'Almohadillas de espuma de alta densidad y fundas desmontables'] },
  { id: 'set-senorio', nombre: 'Set Señorío Máximo', linea: 'Línea Premium · 3 sillones + mesa', modo: '', cat: 'sets', sub: '', tag: 'Set',
    espacios: ['espera', 'oficinas', 'lectura'], precio: 3100000, antes: 3900000, stock: 20, alta: 6, rango: 6,
    vars: [ENCHAPADO], img: 'images/p-senorio.webp',
    alt: 'Set Señorío Máximo: tres sillones Línea Cacique y una mesa de cristal en una sala con ventanal y vista a un parque',
    fotos: [{ src: 'images/g-senorio.webp', alt: 'Sala de espera con sillones de madera curvada y mesa de centro de cristal' },
      { src: 'images/g-senorio-alto.webp', alt: 'Tres sillones Línea Cacique y una mesa de cristal sobre una alfombra, frente a un ventanal', alta: true },
      { src: 'images/g-senorio-terraza.webp', alt: 'Set de sillones y mesa de cristal en una terraza con vista a la ciudad' },
      { src: 'images/g-senorio-ventanal.webp', alt: 'Sillones y mesa de madera curvada en una sala de doble altura con ventanal' }],
    desc: 'Tres sillones de autor Línea Cacique y una mesa de centro de cristal Línea Coalición, para salas de espera premium, centros de estética, oficinas ejecutivas y espacios de lectura o terrazas.',
    specs: ['3 sillones Línea Cacique (U-CONTOUR)', '1 mesa de centro de cristal Línea Coalición (U-CRISTAL)', 'Almohadillas de espuma de alta densidad y fundas desmontables'] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.linea, p.modo, p.cat, p.sub, p.desc, p.tag || '', ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '',
    ...(p.espacios || []).map(a => `${a} ${ETIQUETAS[a] || ''}`), ...(p.vars || []).flatMap(v => [v.tipo, ...v.ops]), ...(p.specs || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), espacio = lista(f.espacio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (espacio.length && !(p.espacios || []).some(a => espacio.includes(a))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.precio < f.precioMin) return false;
    if (f.precioMax != null && p.precio > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const espacio = {}, subs = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.espacios || []).forEach(x => { espacio[x] = (espacio[x] || 0) + 1; });
      if (p.sub) subs[p.sub] = (subs[p.sub] || 0) + 1;
    });
    return { espacio, subs };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.precio;
const descuento = p => (p.antes > p.precio ? Math.round((1 - p.precio / p.antes) * 100) : 0);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.vars || []).length > 0;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const opDe = (p, elegidas) => p.vars.map((v, i) => `${v.tipo.toLowerCase()} ${elegidas[i]}`).join(' · ');
const nombreCompleto = p => `${p.nombre} ${p.linea.split(' · ')[0]}`;

const Cart = {
  KEY: 'mantenadiseno_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'mantenadiseno_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  u: '<svg class="vacio-u" viewBox="0 0 40 28" aria-hidden="true"><path d="M4 3v7a11 11 0 0 0 11 11h10a11 11 0 0 0 11-11V3"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ESTADO = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(40px)"',
};

function precioHTML(p) {
  const d = descuento(p);
  return `<p class="precio"><span class="precio__final${d ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${d ? `<s>${formatearPrecio(p.antes)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  const d = descuento(p);
  if (d) b.push(`<span class="etiqueta etiqueta--oferta">-${d}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta etiqueta--set">${esc(p.tag)}</span>`);
  if (p.stock <= 3) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="608" height="760" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver la pieza</span></div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  let control = stepperHTML(p.stock);
  if (p.vars?.length === 1) {
    const v = p.vars[0];
    control = `<label class="var-sel"><span class="sr-only">${esc(v.tipo)} de ${nombre}</span><select data-op><option value="">${esc(v.tipo)}</option>${v.ops.map(o => `<option value="${esc(opDe(p, [o]))}">${esc(o)}</option>`).join('')}</select></label>`;
  } else if (p.vars?.length > 1) {
    control = `<button type="button" class="prod__opciones" data-qv-abrir="${p.id}" aria-label="Elegir ${esc(p.vars.map(v => v.tipo.toLowerCase()).join(' y '))}: ${nombre}">Opciones</button>`;
  }
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(p.linea)}</p>
      ${titulo}
      <span class="prod__linea" aria-hidden="true"></span>
      <div class="prod__precio-fila">${precioHTML(p)}</div>
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

let revealsListos = false;
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        ${c.subs.length ? `<div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>` : ''}
      </div>`).join('') + '</div>'
      + `<div class="cats-nec"><p class="cats-nec__tit">Para tu espacio</p>${ESPACIOS.map(a => `<a href="${CATALOGO_URL}?espacio=${a.id}">${esc(a.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><span class="cats-oferta">${Tienda.contar({})} piezas en la colección</span><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
  if (!btn || !form) return;
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const q = sel => [...hero.querySelectorAll(sel)];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(q('.hero__kicker'), { y: 18, opacity: 0, duration: 1 }, 0.15)
    .from(q('h1'), { y: 34, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.24)
    .from(q('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(q('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  if (q('.sello').length) tl.from(q('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity,scale' }, 0.8);
}

function initHome() {
  if (PAGINA !== 'home') return;
  const destacados = Tienda.consultar({ orden: 'destacados', limite: 8 }).items;
  const lista = document.getElementById('destacadosLista');
  if (lista) lista.innerHTML = destacados.map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join('');
  const rail = document.getElementById('railLista');
  if (rail) rail.innerHTML = destacados.map(p => `<li ${ESTADO.der}>${cardHTML(p)}</li>`).join('');
  document.querySelectorAll('[data-cat-cuenta]').forEach(el => { el.textContent = Tienda.contar({ cat: el.dataset.catCuenta }); });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = `${formatearPrecio(precioFinal(p))} · enchapado a elección`;
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    const caja = vp.closest('section') || document;
    const prev = caja.querySelector('[data-rail-prev]');
    const next = caja.querySelector('[data-rail-next]');
    if (!track) return;
    const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 300) + 20;
    const flechas = () => {
      if (!prev || !next) return;
      const primero = track.firstElementChild;
      const inicio = vp.getBoundingClientRect().left + (parseFloat(window.getComputedStyle(track).paddingLeft) || 0);
      prev.disabled = vp.scrollLeft <= 2 || !primero || primero.getBoundingClientRect().left >= inicio - 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    window.addEventListener('load', flechas);
    track.addEventListener('transitionend', flechas);
    flechas();

    let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target.closest('select, button, .stepper')) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const fin = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      if (moved) { matar = true; setTimeout(() => { matar = false; }, 0); }
      vp.classList.remove('dragging');
      pointerId = null; moved = false;
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('lostpointercapture', fin);
    vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
  });
}

function initModos() {
  const app = document.querySelector('[data-modos]');
  if (!app) return;
  const tabs = [...app.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) { panel.hidden = !on; panel.classList.toggle('modo--on', on); }
    });
    if (foco) tab.focus();
    refrescarTriggers();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (d) { e.preventDefault(); elegir(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); elegir(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); elegir(tabs[tabs.length - 1], true); }
    });
  });
}

const PROYECTO = {
  hotel: { nombre: 'un hotel', esp: ['recepcion', 'relax'] },
  oficina: { nombre: 'una oficina', esp: ['oficinas'] },
  clinica: { nombre: 'una clínica o consultorio', esp: ['espera', 'recepcion'] },
  estetica: { nombre: 'un centro de estética', esp: ['espera'] },
  showroom: { nombre: 'un showroom', esp: ['recepcion', 'espera'] },
  meditacion: { nombre: 'un espacio de meditación o terapia', esp: ['relax'] },
  casa: { nombre: 'mi casa', esp: ['lectura', 'relax'] },
};
function initProyecto() {
  const form = document.getElementById('proyecto');
  const res = document.getElementById('proyectoRes');
  const wsp = document.getElementById('proyectoWsp');
  if (!form || !res || !wsp) return;
  const pintar = () => {
    const tipo = form.querySelector('input[name="espacio"]:checked')?.value || 'hotel';
    const datos = PROYECTO[tipo] || PROYECTO.hotel;
    const n = Number(form.querySelector('[data-stepper] output')?.textContent) || 1;
    const lugar = (form.querySelector('input[name="localidad"]')?.value || '').trim().slice(0, 60);
    const piezas = Tienda.consultar({ filtros: { espacio: datos.esp }, orden: 'destacados', limite: 3 }).items;
    res.innerHTML = piezas.length
      ? `Pensadas para ese espacio: ${piezas.map(p => `<strong>${esc(nombreCompleto(p))}</strong>`).join(', ')}.`
      : '';
    const msg = `Hola ${MARCA}! Estoy equipando ${datos.nombre}${lugar ? ` en ${lugar}` : ''} y necesito ${n === 1 ? 'una pieza' : `unas ${n} piezas`}.${piezas.length ? ` Me interesan: ${piezas.map(nombreCompleto).join(', ')}.` : ''} ¿Me asesoran con los modos y el enchapado?`;
    wsp.href = wspHref(msg);
  };
  form.addEventListener('change', pintar);
  form.addEventListener('input', pintar);
  form.addEventListener('click', e => { if (e.target.closest('[data-stepper]')) setTimeout(pintar, 0); });
  pintar();
}

const QV = { p: null, sel: [], foto: 0, opener: null };
function opQV() {
  const p = QV.p;
  if (!conVar(p)) return '';
  return QV.sel.every(Boolean) ? opDe(p, QV.sel) : '';
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel =Tienda.consultar({ filtros: { excluir: p.id }, orden: 'destacados', limite: 6 }).items
    .sort((a, b) => (a.cat === p.cat ? 0 : 1) - (b.cat === p.cat ? 0 : 1)).slice(0, 3);
  const fotos = [{ src: p.img, alt: p.alt, card: true }, ...(p.fotos || [])];
  const actual = fotos[QV.foto] || fotos[0];
  const op = opQV();
  const msg = `Hola ${MARCA}! Quiero consultar por ${nombreCompleto(p)}${op ? ` (${op})` : ''}.`;
  const on = Favs.has(p.id);
  const forma = actual.card || actual.alta ? ' qv__principal--alta' : '';
  const espacios = (p.espacios || []).map(a => esc(nombreDe(ESPACIOS, a).toLowerCase())).join(' · ');
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual.src}" alt="${esc(actual.alt)}" width="1024" height="${actual.card || actual.alta ? 1365 : 760}"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="Ver la foto ${k + 1} de ${fotos.length}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="qv__linea">${esc(p.linea)}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.specs?.length ? `<ul class="qv__specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        <p class="qv__dato"><span>Para</span>${espacios}</p>
        ${p.modo ? `<p class="qv__dato"><span>Modo de la lámina</span>${esc(p.modo)}</p>` : ''}
        ${(p.vars || []).map((v, i) => `<div>
          <p class="f-grupo__titulo">${esc(v.tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí ${esc(v.tipo.toLowerCase())}">${v.ops.map(o => `<button type="button" class="qv__op" data-qv-var="${i}" data-qv-op="${esc(o)}" aria-pressed="${QV.sel[i] === o}">${MUESTRAS[o] && v.tipo === 'Enchapado' ? `<img src="${MUESTRAS[o]}" alt="" width="22" height="22">` : ''}${esc(o)}</button>`).join('')}</div>
        </div>`).join('')}
        ${conVar(p) ? '<p class="qv__aviso" id="qvAviso" aria-live="polite"></p>' : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en la colección</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="500"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: nombreCompleto(p), description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.foto = 0;
  QV.sel = (p.vars || []).map(v => {
    const m = op.split(' · ').find(x => x.startsWith(`${v.tipo.toLowerCase()} `));
    const val = m ? m.slice(v.tipo.length + 1) : '';
    return v.ops.includes(val) ? val : '';
  });
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      const i = Number(o.dataset.qvVar) || 0;
      QV.sel[i] = o.dataset.qvOp;
      modal.querySelectorAll(`[data-qv-var="${i}"]`).forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      const op = opQV();
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${nombreCompleto(QV.p)}${op ? ` (${op})` : ''}.`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const op = opQV();
      if (conVar(p) && !op) {
        const falta = p.vars.find((v, i) => !QV.sel[i]);
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí ${falta.tipo === 'Tapa' ? 'la tapa' : 'el enchapado'} para sumarla al carrito.`;
        modal.querySelector(`[data-qv-var="${p.vars.indexOf(falta)}"]`)?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${op ? ` (${op})` : ''} al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(nombreCompleto(p))}</p>
      <p class="linea__meta">${op ? `${esc(op)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.u}<p>Tu carrito está vacío. Las piezas de la colección te esperan, con el enchapado que elijas.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${nombreCompleto(p)}${i.op ? ` (${i.op})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvOp || ''); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const acciones = add.closest('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (${op})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], espacio: multi('espacio', ESPACIOS),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const vacioWsp = document.getElementById('vacioWsp');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.espacio.length) f.espacio = e.espacio;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Tipo de pieza</legend>
      ${opcion('radio', 'cat', '', 'Todas', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat && subsDe(e.cat).length) grupos.push(`<fieldset class="f-grupo"><legend>${esc(nombreDe(CATEGORIAS, e.cat))}</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    const espacios = ESPACIOS.filter(a => fac.espacio[a.id]);
    if (espacios.length) grupos.push(`<fieldset class="f-grupo"><legend>Para tu espacio</legend><div class="f-necs">
      ${espacios.map(a => `<label class="f-nec"><input type="checkbox" name="espacio-${a.id}" value="${a.id}" data-f="espacio"${e.espacio.includes(a.id) ? ' checked' : ''}><span>${esc(a.nombre)}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritas', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const espacio = !cat && e.espacio.length === 1 ? ESPACIOS.find(a => a.id === e.espacio[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : espacio ? `Para ${espacio.nombre.toLowerCase()}` : e.fav ? 'Tus favoritas' : e.q ? `Resultados para «${e.q}»` : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la colección';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : espacio ? espacio.frase : e.fav ? 'Las piezas que guardaste con el corazón, para decidir con calma.' : 'Asientos, mesas y sets en madera curvada, inspirados en las sillas manteñas. Elegí el enchapado y sumalos al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : espacio ? espacio.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : espacio ? `${CATALOGO_URL}?espacio=${espacio.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.espacio.length ? ' aria-current="page"' : ''}>Todas <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.espacio.forEach(v => quitar.push(['espacio', v, nombreDe(ESPACIOS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritas']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'espacio', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.espacio.length) u.searchParams.set('espacio', e.espacio.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = e.q ? 0 : Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const hay = mostrados > 0;
    contador.textContent = e.q
      ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'}`
      : `${total} ${total === 1 ? 'pieza' : 'piezas'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritas. Tocá el corazón de una pieza y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te contamos si se puede resolver con alguno de los modos.` : 'No hay piezas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! Estoy buscando ${e.q}, ¿tienen algo así?` : `Hola ${MARCA}! Estoy buscando una pieza y no la encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados} ${cursor ? '· hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    if (!e.cat) e.sub = [];
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'fav') e.fav = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    f.hidden = true;
    document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.espacio = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'fav') e.fav = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = []; e.espacio = [];
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-nec a, .cats-todo, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.espacio = (u.searchParams.get('espacio') || '').split(',').filter(v => ESPACIOS.some(x => x.id === v));
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });
  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initModos, initProyecto, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initRail, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
