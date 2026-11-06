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

const WSP = '5491138651514';
const MARCA = 'ECLIPSE';
const TONOS = [{"id": "claros", "nombre": "Claros y naturales", "hex": "#E6DCC8"}, {"id": "violetas", "nombre": "Violetas", "hex": "#8C6790"}, {"id": "azules", "nombre": "Azules", "hex": "#34508C"}, {"id": "verdes", "nombre": "Verdes", "hex": "#71875A"}];
const AMBIENTES = [{"id": "mesa", "nombre": "La mesa", "bajada": "Manteles y caminos"}, {"id": "ventana", "nombre": "La ventana", "bajada": "Cortinas de voile y blackout"}, {"id": "living", "nombre": "El sillón", "bajada": "Almohadones"}, {"id": "pared", "nombre": "La pared", "bajada": "Cuadros"}];
const CATEGORIAS = [{"id": "manteles", "nombre": "Manteles", "bajada": "Rectangulares y redondos", "amb": "mesa", "img": "images/c-manteles.webp", "alt": "Mantel redondo lavanda sobre una mesa de madera"}, {"id": "cortinas", "nombre": "Cortinas", "bajada": "Voile y blackout", "amb": "ventana", "img": "images/c-cortinas.webp", "alt": "Cortina blackout malva frente a una ventana"}, {"id": "almohadones", "nombre": "Almohadones", "bajada": "Terciopelo y bouclé", "amb": "living", "img": "images/c-almohadones.webp", "alt": "Almohadón de bouclé arena sobre un banco tapizado"}, {"id": "caminos", "nombre": "Caminos de mesa", "bajada": "Yute y algodón rayado", "amb": "mesa", "img": "images/c-caminos.webp", "alt": "Camino de mesa rayado azul y crudo sobre madera clara"}, {"id": "cuadros", "nombre": "Cuadros", "bajada": "Láminas con marco de madera", "amb": "pared", "img": "images/c-cuadros.webp", "alt": "Cuadro con lámina de helecho y marco de roble"}];
const PRECIOS = [{"id": "hasta20", "nombre": "Hasta $20.000", "min": 0, "max": 20000}, {"id": "20a35", "nombre": "$20.000 a $35.000", "min": 20000, "max": 35000}, {"id": "mas35", "nombre": "Más de $35.000", "min": 35000, "max": null}];
const PRODUCTOS = [{"id": "mantel-lino-crudo", "rango": 1, "cat": "manteles", "tono": "claros", "nombre": "Mantel de lino crudo", "nota": "Rectangular, trama rústica", "color": "Crudo", "material": "Lino y algodón", "medidas": [{"id": "150x200", "nombre": "1,50 × 2,00 m · para 4 a 6", "corto": "1,50 × 2,00 m", "precio": 34900}, {"id": "150x250", "nombre": "1,50 × 2,50 m · para 6 a 8", "corto": "1,50 × 2,50 m", "precio": 41900}, {"id": "150x300", "nombre": "1,50 × 3,00 m · para 8 a 10", "corto": "1,50 × 3,00 m", "precio": 48900}], "img": "images/p-mantel-lino-crudo.webp", "alt": "Mantel de lino crudo sobre una mesa rectangular de madera con un florero y peras", "desc": "Mantel rectangular de lino con algodón, de trama abierta y caída suave. El crudo va con madera, vajilla blanca y cualquier camino de mesa.", "cuidado": "Lavarropas en frío y planchado tibio.", "claves": ["mantel", "lino", "rectangular", "mesa", "comedor", "beige", "natural"]}, {"id": "almohadon-terciopelo-ciruela", "rango": 2, "cat": "almohadones", "tono": "violetas", "nombre": "Almohadón de terciopelo ciruela", "nota": "Con vivo al tono", "color": "Ciruela", "material": "Terciopelo", "etiqueta": "Nuevo", "medidas": [{"id": "45", "nombre": "45 × 45 cm, con relleno", "corto": "45 × 45 cm", "precio": 18900}, {"id": "50", "nombre": "50 × 50 cm, con relleno", "corto": "50 × 50 cm", "precio": 21900}], "img": "images/p-almohadon-terciopelo-ciruela.webp", "alt": "Almohadón de terciopelo color ciruela con vivo, apoyado sobre un banco tapizado", "desc": "Funda de terciopelo con vivo al tono y cierre oculto, con relleno incluido. El ciruela le da profundidad a un sillón claro o a una cama blanca.", "cuidado": "Funda lavable a mano, sin secarropas.", "claves": ["almohadon", "almohadones", "terciopelo", "violeta", "bordo", "sillon", "cama"]}, {"id": "cortina-voile-lino", "rango": 3, "cat": "cortinas", "tono": "claros", "nombre": "Cortina de voile de lino", "nota": "Filtra la luz, con pasacortina", "color": "Blanco", "material": "Voile de lino", "medidas": [{"id": "140x220", "nombre": "1,40 × 2,20 m por paño", "corto": "1,40 × 2,20 m", "precio": 29900}, {"id": "140x250", "nombre": "1,40 × 2,50 m por paño", "corto": "1,40 × 2,50 m", "precio": 33900}], "img": "images/p-cortina-voile-lino.webp", "alt": "Dos paños de cortina de voile de lino blanco colgados de un barral frente a una ventana", "desc": "Paño de voile de lino con pasacortina para barral. Deja pasar la claridad y suaviza el sol directo: el ambiente queda luminoso sin encandilar.", "cuidado": "Lavarropas en programa delicado; colgar húmeda.", "claves": ["cortina", "cortinas", "voile", "lino", "blanca", "liviana", "traslucida", "living", "ventana"]}, {"id": "camino-yute-flecos", "rango": 4, "cat": "caminos", "tono": "claros", "nombre": "Camino de mesa de yute", "nota": "Tejido grueso con flecos", "color": "Natural", "material": "Yute y algodón", "medidas": [{"id": "35x150", "nombre": "35 × 150 cm", "corto": "35 × 150 cm", "precio": 16900}, {"id": "35x200", "nombre": "35 × 200 cm", "corto": "35 × 200 cm", "precio": 19900}], "img": "images/p-camino-yute-flecos.webp", "alt": "Camino de mesa de yute tejido con flecos sobre una mesa de madera clara", "desc": "Camino tejido de yute con algodón y flecos en las puntas. Va directo sobre la madera o encima de un mantel liso.", "cuidado": "Sacudir o aspirar; lavar a mano en frío.", "claves": ["camino", "yute", "flecos", "mesa", "natural", "tejido", "rustico"]}, {"id": "mantel-redondo-lavanda", "rango": 5, "cat": "manteles", "tono": "violetas", "nombre": "Mantel redondo lavanda", "nota": "Lino lavado, cuadros tenues", "color": "Lavanda", "material": "Lino lavado", "etiqueta": "Nuevo", "medidas": [{"id": "160", "nombre": "Ø 1,60 m · mesa de 4", "corto": "Ø 1,60 m", "precio": 36900}, {"id": "180", "nombre": "Ø 1,80 m · mesa de 6", "corto": "Ø 1,80 m", "precio": 41900}], "img": "images/p-mantel-redondo-lavanda.webp", "alt": "Mantel redondo lavanda de lino sobre una mesa con pie de madera, con flores y peras", "desc": "Mantel redondo de lino lavado con un cuadriculado tenue en el mismo tono. Cae hasta la mitad de la pata y le da color a una mesa de madera.", "cuidado": "Lavarropas en frío; no usar lavandina.", "claves": ["mantel", "redondo", "lavanda", "lila", "violeta", "lino", "mesa redonda"]}, {"id": "cuadro-helecho", "rango": 6, "cat": "cuadros", "tono": "verdes", "nombre": "Cuadro lámina de helecho", "nota": "Marco de madera con paspartú", "color": "Verde y roble", "material": "Lámina impresa, marco de madera y vidrio", "medidas": [{"id": "30x40", "nombre": "30 × 40 cm", "corto": "30 × 40 cm", "precio": 24900}, {"id": "40x50", "nombre": "40 × 50 cm", "corto": "40 × 50 cm", "precio": 31900}, {"id": "50x70", "nombre": "50 × 70 cm", "corto": "50 × 70 cm", "precio": 42900}], "img": "images/p-cuadro-helecho.webp", "alt": "Cuadro con una lámina botánica de helecho verde, paspartú blanco y marco de roble", "desc": "Lámina botánica de helecho con paspartú blanco y marco de madera clara. Queda bien en vertical sobre un aparador, una cama o un escritorio.", "cuidado": "Limpiar con un paño seco.", "claves": ["cuadro", "cuadros", "lamina", "helecho", "botanico", "marco", "pared", "verde"]}, {"id": "almohadon-boucle-arena", "rango": 7, "cat": "almohadones", "tono": "claros", "nombre": "Almohadón bouclé arena", "nota": "Textura de rulos, tono cálido", "color": "Arena", "material": "Bouclé", "medidas": [{"id": "45", "nombre": "45 × 45 cm, con relleno", "corto": "45 × 45 cm", "precio": 19900}, {"id": "60", "nombre": "60 × 60 cm, con relleno", "corto": "60 × 60 cm", "precio": 25900}], "img": "images/p-almohadon-boucle-arena.webp", "alt": "Almohadón de bouclé color arena sobre un banco tapizado junto a una manta tejida", "desc": "Funda de bouclé con textura de rulos y relleno incluido. El arena suma calidez a un sillón gris, blanco o de lino.", "cuidado": "Funda lavable a mano en frío.", "claves": ["almohadon", "almohadones", "boucle", "beige", "arena", "sillon", "textura"]}, {"id": "camino-rayado-azul", "rango": 8, "cat": "caminos", "tono": "azules", "nombre": "Camino de mesa rayado", "nota": "Algodón azul y crudo", "color": "Azul y crudo", "material": "Algodón", "medidas": [{"id": "35x150", "nombre": "35 × 150 cm", "corto": "35 × 150 cm", "precio": 15900}, {"id": "35x180", "nombre": "35 × 180 cm", "corto": "35 × 180 cm", "precio": 17900}], "img": "images/p-camino-rayado-azul.webp", "alt": "Camino de mesa de algodón con rayas azules sobre fondo crudo, apoyado en madera", "desc": "Camino de algodón con rayas azules sobre fondo crudo y terminación lisa. Le da un aire de casa de campo a una mesa de madera clara.", "cuidado": "Lavarropas en frío.", "claves": ["camino", "rayado", "rayas", "azul", "algodon", "mesa", "campo"]}, {"id": "cortina-blackout-malva", "rango": 9, "cat": "cortinas", "tono": "violetas", "nombre": "Cortina blackout malva", "nota": "Bloquea la luz, para barral", "color": "Malva", "material": "Tela blackout", "medidas": [{"id": "140x220", "nombre": "1,40 × 2,20 m por paño", "corto": "1,40 × 2,20 m", "precio": 39900}, {"id": "140x250", "nombre": "1,40 × 2,50 m por paño", "corto": "1,40 × 2,50 m", "precio": 44900}], "img": "images/p-cortina-blackout-malva.webp", "alt": "Cortina blackout color malva cerrada frente a una ventana", "desc": "Paño de tela blackout que tapa la luz de la calle y el sol de la mañana. Para el dormitorio, o para ver una película de día con el living a oscuras.", "cuidado": "Lavarropas en frío; planchado suave del revés.", "claves": ["cortina", "cortinas", "blackout", "black out", "oscura", "dormitorio", "malva", "violeta", "ventana"]}, {"id": "servilletas-lino", "rango": 99, "cat": "manteles", "tono": "claros", "nombre": "Servilletas de lino x 4", "nota": "Juego", "color": "Crudo", "material": "Lino", "visible": false, "medidas": [{"id": "40", "nombre": "40 × 40 cm", "corto": "40 × 40 cm", "precio": 12900}], "img": "images/p-mantel-lino-crudo.webp", "alt": "Producto oculto", "desc": "Producto oculto de prueba: no se muestra en la tienda.", "cuidado": "", "claves": ["servilletas"]}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const ambDe = p => catDe(p.cat).amb;
const tonoDe = id => TONOS.find(t => t.id === id) || null;
const desde = p => Math.min(...(p.medidas || []).map(m => m.precio));
const medidaDe = (p, m) => (p?.medidas || []).find(x => x.id === m) || null;
const medidaValida = (p, m) => (medidaDe(p, m) ? m : '');
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  return !!r && (p.medidas || []).some(m => m.precio >= r.min && (r.max == null || m.precio < r.max));
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, p.material, p.color, catDe(p.cat)?.nombre, nombreDe(AMBIENTES, ambDe(p)), tonoDe(p.tono)?.nombre,
    ...(p.medidas || []).map(m => m.nombre), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), amb = lista(f.amb), tono = lista(f.tono), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (amb.length && !amb.includes(ambDe(p))) return false;
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
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const precioLinea = i => medidaDe(getProducto(i.id), i.m)?.precio || 0;
const detalleLinea = i => `Medida ${medidaDe(getProducto(i.id), i.m)?.corto || i.m}`;

const Cart = {
  KEY: 'eclipse_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, m, qty = 1) {
    if (!producto) return 0;
    const mm = medidaValida(producto, m);
    if (!mm) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.m === mm);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, m: mm, qty: n });
    this.save(items);
    return n;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items[k];
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
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
      const m = p && medidaValida(p, i.m);
      if (!p || !m) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.m === m);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push({ id: p.id, m, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
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

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const medidaSelectHTML = (p, m = '') => {
  const actual = medidaValida(p, m) || p.medidas[0].id;
  return `<select class="medida-sel" data-medida-sel aria-label="Medida de ${esc(p.nombre)}">${p.medidas.map(x => `<option value="${esc(x.id)}"${x.id === actual ? ' selected' : ''}>${esc(x.corto)}</option>`).join('')}</select>`;
};

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', medida = '' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const m = medidaDe(p, medidaValida(p, medida)) || p.medidas[0];
  const etq = p.etiqueta ? `<span class="prod__etq">${esc(p.etiqueta)}</span>` : '';
  const tono = tonoDe(p.tono);
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"></button>${etq}</div>
  <div class="prod__info">
    <p class="prod__cat"><span class="punto" style="background:${esc(tono?.hex || '#ccc')}"></span>${esc(catDe(p.cat).nombre)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__precio" data-precio>${formatearPrecio(m.precio)}</p>
    <div class="prod-actions">${medidaSelectHTML(p, m.id)}<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleLinea(i)}) — ${formatearPrecio(precioLinea(i) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o el envío?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="800" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleLinea(i))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-k="${k}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${k}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
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
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
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

function sumar(id, m, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, m, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${medidaDe(p, m)?.corto}) al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-medida-sel]');
    if (!sel) return;
    const card = sel.closest('.prod');
    const p = card && getProducto(card.dataset.id);
    const m = medidaDe(p, sel.value);
    const out = card?.querySelector('[data-precio]');
    if (m && out) out.textContent = formatearPrecio(m.precio);
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
      const m = medidaValida(p, card?.querySelector('[data-medida-sel]')?.value) || p?.medidas[0]?.id;
      const n = sumar(id, m, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      const card = qv.closest('.prod');
      abrirVistaRapida(qv.dataset.qv, { previo: qv, m: card?.querySelector('[data-medida-sel]')?.value });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { amb: ambDe(p), excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { tono: p.tono, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p, m) {
  const rel = relacionados(p);
  const md = medidaDe(p, m) || p.medidas[0];
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000"></figure>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(catDe(p.cat).nombre)} · ${esc(nombreDe(AMBIENTES, ambDe(p)))}${p.etiqueta ? `<span class="prod__etq prod__etq--qv">${esc(p.etiqueta)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    <p class="qv__precio" data-qv-precio>${formatearPrecio(md.precio)}</p>
    <div class="qv__bloque">
      <p class="qv__label">Medida</p>
      <div class="qv__medidas" role="group" aria-label="Medida">${p.medidas.map(x => `<button type="button" class="qv__medida" data-qv-medida="${esc(x.id)}" aria-pressed="${x.id === md.id}"><b>${esc(x.corto)}</b><small>${esc(x.nombre.replace(x.corto, '').replace(/^[\s·,]+/, '') || formatearPrecio(x.precio))}</small></button>`).join('')}</div>
    </div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha"><div><dt>Material</dt><dd>${esc(p.material)}</dd></div><div><dt>Color</dt><dd>${esc(p.color)}</dd></div><div><dt>Cuidados</dt><dd>${esc(p.cuidado)}</dd></div></dl>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="800" height="1000"><span>${esc(r.nombre)}</span><small>desde ${formatearPrecio(desde(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, m = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const mm = medidaValida(p, m) || p.medidas[0].id;
  qvEstado = { id: p.id, m: mm };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, mm);
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const med = e.target.closest('[data-qv-medida]');
    if (med) {
      qvEstado.m = med.dataset.qvMedida;
      cont.querySelectorAll('[data-qv-medida]').forEach(b => b.setAttribute('aria-pressed', String(b === med)));
      cont.querySelector('[data-qv-precio]').textContent = formatearPrecio(medidaDe(p, qvEstado.m)?.precio || 0);
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, qvEstado.m, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${medidaDe(p, qvEstado.m)?.corto}) al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, color: p.color, material: p.material,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desde(p), highPrice: Math.max(...p.medidas.map(m => m.precio)), offerCount: p.medidas.length, availability: 'https://schema.org/InStock' },
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
  const otros = ['amb', 'tono', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="640" height="480"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'producto', 'productos')}</em></a></li>`;
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
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
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

function initLuz() {
  const sec = document.getElementById('luz');
  if (!sec) return;
  const ops = [...sec.querySelectorAll('[data-luz]')];
  const paneles = [...sec.querySelectorAll('[data-luz-panel]')];
  const elegida = {};
  paneles.forEach(pn => {
    const p = getProducto(pn.dataset.id);
    if (!p) return;
    elegida[pn.dataset.luzPanel] = p.medidas[0].id;
    pn.addEventListener('click', e => {
      const med = e.target.closest('[data-luz-med]');
      if (med) {
        elegida[pn.dataset.luzPanel] = med.dataset.luzMed;
        pn.querySelectorAll('[data-luz-med]').forEach(b => b.setAttribute('aria-pressed', String(b === med)));
        pn.querySelector('[data-luz-precio]').firstChild.textContent = `${formatearPrecio(medidaDe(p, med.dataset.luzMed)?.precio || 0)} `;
        return;
      }
      const ag = e.target.closest('[data-luz-agregar]');
      if (ag) sumar(p.id, elegida[pn.dataset.luzPanel], 1, ag);
    });
  });
  ops.forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.luz;
    if (sec.dataset.estado === k) return;
    sec.dataset.estado = k;
    ops.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    paneles.forEach(pn => { pn.hidden = pn.dataset.luzPanel !== k; });
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
  const GRUPOS = { cat: CATEGORIAS, amb: AMBIENTES, tono: TONOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    amb: valida(params.get('amb'), AMBIENTES),
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
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }), k === 'tono' ? `<span class="punto" style="background:${esc(it.hex)}"></span>` : '')).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return nombreDe(CATEGORIAS, e.cat[0]);
    if (solo('amb')) return `Para ${nombreDe(AMBIENTES, e.amb[0]).toLowerCase()}`;
    if (solo('tono')) return `Tonos ${nombreDe(TONOS, e.tono[0]).toLowerCase()}`;
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
    document.title = `${t || 'Tienda'} — ${MARCA}, manteles, cortinas y almohadones`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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

function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
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
  hero.classList.add('hero--anim');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desdeA('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desdeA('.hero-orn', { scaleX: 0.4, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.4);
  desdeA('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero-ficha', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img, .spot--m2 .spot__foto img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initRail();
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
initLuz();
initFloats();
initModelBarScroll();
initProductoUrl();
Cart.sync();
updateCartBadge();
