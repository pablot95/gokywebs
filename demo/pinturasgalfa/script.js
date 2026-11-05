const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491127316436';
const MARCA = 'Pinturas Galfa';
const POR_PAGINA = 16;
const TOPE_LINEA = 99;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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

const CATEGORIAS = [{"id": "interior", "nombre": "Látex para interior", "corto": "Interior", "bajada": "Paredes y cielorrasos", "img": "images/p-salvia.webp"}, {"id": "exterior", "nombre": "Exterior y frentes", "corto": "Exterior", "bajada": "Frentes, medianeras y muros", "img": "images/p-terracota.webp"}, {"id": "esmaltes", "nombre": "Esmaltes sintéticos", "corto": "Esmaltes", "bajada": "Madera y metal: rejas, puertas y muebles", "img": "images/p-marino.webp"}];
const FAMILIAS = [{"id": "neutros", "nombre": "Blancos y neutros"}, {"id": "frios", "nombre": "Verdes y azules"}, {"id": "calidos", "nombre": "Cálidos"}];
const TERMINACIONES = [{"id": "mate", "nombre": "Mate"}, {"id": "satinado", "nombre": "Satinado"}, {"id": "brillante", "nombre": "Brillante"}];
const ENVASES = [{"id": "05", "nombre": "½ litro", "corto": "½ L", "litros": 0.5}, {"id": "1", "nombre": "1 litro", "corto": "1 L", "litros": 1}, {"id": "4", "nombre": "4 litros", "corto": "4 L", "litros": 4}, {"id": "10", "nombre": "10 litros", "corto": "10 L", "litros": 10}, {"id": "20", "nombre": "20 litros", "corto": "20 L", "litros": 20}];
const PRODUCTOS = [{"id": "latex-blanco", "rango": 1, "cat": "interior", "fam": "neutros", "nombre": "Látex interior mate Blanco", "color": "Blanco", "cod": "GF 001", "hex": "#F2F1EC", "term": "mate", "rinde": "10 a 12", "r": 11, "opciones": [{"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 24900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 56900}, {"id": "20", "nombre": "20 L", "largo": "20 litros", "litros": 20, "precio": 104900}], "img": {"src": "images/p-blanco.webp", "w": 960, "h": 1200, "alt": "Balde blanco de látex abierto, con la tapa apoyada atrás"}, "desc": "Para paredes y cielorrasos de casas y obras. Se aplica con rodillo o pincel, deja una terminación pareja y las herramientas se lavan con agua.", "claves": ["latex", "blanco", "interior", "paredes", "cielorraso", "techo", "obra", "balde", "mate"], "muestra": "images/m-blanco.webp"}, {"id": "latex-salvia", "rango": 2, "cat": "interior", "fam": "frios", "nombre": "Látex interior Verde salvia", "color": "Verde salvia", "cod": "GF 031", "hex": "#8EA58A", "term": "mate", "rinde": "10 a 12", "r": 11, "opciones": [{"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 9800}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 34900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 79900}], "img": {"src": "images/p-salvia.webp", "w": 960, "h": 1200, "alt": "Lata abierta de látex verde salvia"}, "desc": "Un verde suave y apagado para livings, dormitorios y cocinas. Terminación mate, sin brillos, que disimula las pequeñas imperfecciones de la pared.", "claves": ["latex", "verde", "salvia", "interior", "living", "dormitorio", "mate", "color"], "muestra": "images/m-salvia.webp"}, {"id": "frente-terracota", "rango": 3, "cat": "exterior", "fam": "calidos", "nombre": "Látex exterior Terracota", "color": "Terracota", "cod": "GF 118", "hex": "#B8623F", "term": "mate", "rinde": "9 a 11", "r": 10, "opciones": [{"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 31900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 72900}, {"id": "20", "nombre": "20 L", "largo": "20 litros", "litros": 20, "precio": 134900}], "img": {"src": "images/p-terracota.webp", "w": 960, "h": 1200, "alt": "Lata abierta de látex exterior color terracota"}, "desc": "El color del ladrillo para frentes, muros y canteros. Látex para exterior, pensado para paredes que reciben sol y lluvia.", "claves": ["latex", "exterior", "frente", "terracota", "ladrillo", "naranja", "muro", "medianera"], "muestra": "images/m-terracota.webp"}, {"id": "esmalte-marino", "rango": 4, "cat": "esmaltes", "fam": "frios", "nombre": "Esmalte sintético Azul marino", "color": "Azul marino", "cod": "GF 207", "hex": "#22335D", "term": "brillante", "rinde": "12 a 14", "r": 12, "opciones": [{"id": "05", "nombre": "½ L", "largo": "½ litro", "litros": 0.5, "precio": 7900}, {"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 13900}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 49900}], "img": {"src": "images/p-marino.webp", "w": 960, "h": 1200, "alt": "Lata abierta de esmalte sintético azul marino brillante"}, "desc": "Brillante, para rejas, puertas, portones y muebles de madera o metal. Se aplica con pincel o rodillo de espuma.", "claves": ["esmalte", "sintetico", "azul", "marino", "rejas", "puertas", "metal", "madera", "brillante"], "muestra": "images/m-marino.webp"}, {"id": "latex-crema", "rango": 5, "cat": "interior", "fam": "neutros", "nombre": "Látex interior Crema", "color": "Crema", "cod": "GF 014", "hex": "#EDDDB8", "term": "mate", "rinde": "10 a 12", "r": 11, "opciones": [{"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 9800}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 34900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 79900}], "img": {"src": "images/p-crema.webp", "w": 960, "h": 1200, "alt": "Lata abierta de látex color crema"}, "desc": "Un blanco cálido que ilumina sin encandilar. Combina con pisos de madera, cerámicos y aberturas blancas.", "claves": ["latex", "crema", "marfil", "beige", "interior", "calido", "mate", "color"], "muestra": "images/m-crema.webp"}, {"id": "frente-gris", "rango": 6, "cat": "exterior", "fam": "neutros", "nombre": "Látex exterior Gris cemento", "color": "Gris cemento", "cod": "GF 105", "hex": "#A8ADB3", "term": "mate", "rinde": "9 a 11", "r": 10, "opciones": [{"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 31900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 72900}, {"id": "20", "nombre": "20 L", "largo": "20 litros", "litros": 20, "precio": 134900}], "img": {"src": "images/p-gris.webp", "w": 960, "h": 1200, "alt": "Lata abierta de látex exterior gris cemento"}, "desc": "Para frentes, medianeras y muros exteriores. Un gris neutro que acompaña revoques, ladrillo visto y aberturas oscuras.", "claves": ["latex", "exterior", "frente", "gris", "cemento", "medianera", "muro", "obra"], "muestra": "images/m-gris.webp"}, {"id": "latex-celeste", "rango": 7, "cat": "interior", "fam": "frios", "nombre": "Látex interior Celeste", "color": "Celeste", "cod": "GF 041", "hex": "#A4C4E2", "term": "satinado", "rinde": "10 a 12", "r": 11, "opciones": [{"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 9800}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 34900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 79900}], "img": {"src": "images/p-celeste.webp", "w": 960, "h": 1200, "alt": "Lata de látex celeste abierta"}, "desc": "Celeste claro con terminación satinada, más fácil de limpiar: ideal para cuartos de chicos, baños y pasillos.", "claves": ["latex", "celeste", "azul", "interior", "satinado", "lavable", "chicos", "bano"], "muestra": "images/m-celeste.webp"}, {"id": "esmalte-bordo", "rango": 8, "cat": "esmaltes", "fam": "calidos", "nombre": "Esmalte sintético Bordó", "color": "Bordó", "cod": "GF 213", "hex": "#6C1F2D", "term": "satinado", "rinde": "12 a 14", "r": 12, "opciones": [{"id": "05", "nombre": "½ L", "largo": "½ litro", "litros": 0.5, "precio": 7900}, {"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 13900}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 49900}], "img": {"src": "images/p-bordo.webp", "w": 960, "h": 1200, "alt": "Lata plateada abierta de esmalte sintético bordó"}, "desc": "Satinado, para aberturas, muebles y herrería. Un bordó profundo que resalta sobre paredes claras.", "claves": ["esmalte", "sintetico", "bordo", "rojo", "vino", "aberturas", "muebles", "herreria", "satinado"], "muestra": "images/m-bordo.webp"}, {"id": "latex-amarillo", "rango": 9, "cat": "interior", "fam": "calidos", "nombre": "Látex interior Amarillo trigo", "color": "Amarillo trigo", "cod": "GF 022", "hex": "#EAD97E", "term": "mate", "rinde": "10 a 12", "r": 11, "opciones": [{"id": "1", "nombre": "1 L", "largo": "1 litro", "litros": 1, "precio": 9800}, {"id": "4", "nombre": "4 L", "largo": "4 litros", "litros": 4, "precio": 34900}, {"id": "10", "nombre": "10 L", "largo": "10 litros", "litros": 10, "precio": 79900}], "img": {"src": "images/p-amarillo.webp", "w": 960, "h": 1200, "alt": "Lata abierta de látex amarillo pastel"}, "desc": "Amarillo pastel para cocinas, comedores y cuartos de chicos. Le suma calidez a los ambientes con poca luz.", "claves": ["latex", "amarillo", "trigo", "pastel", "interior", "cocina", "mate", "color"], "muestra": "images/m-amarillo.webp"}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const MEDIDAS = { puerta: 1.7, ventana: 1.4, extra: 0.1 };

PRODUCTOS.forEach(p => {
  p.opciones.sort((a, b) => a.litros - b.litros);
  p.desde = Math.min(...p.opciones.map(o => o.precio));
  p.base = p.opciones[0].precio;
});

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const famDe = id => FAMILIAS.find(f => f.id === id) || FAMILIAS[0];

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.color, p.cod, p.desc, p.term, catDe(p.cat).nombre, catDe(p.cat).corto, famDe(p.fam).nombre,
    ...(p.opciones || []).map(o => `${o.nombre} ${o.largo}`), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), fam = lista(f.familia), term = lista(f.term), env = lista(f.env), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (fam.length && !fam.includes(p.fam)) return false;
    if (term.length && !term.includes(p.term)) return false;
    if (env.length && !env.some(v => p.opciones.some(o => o.id === v))) return false;
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
      case 'precio-asc': return (a, b) => a.base - b.base || desempate(a, b);
      case 'precio-desc': return (a, b) => b.base - a.base || desempate(a, b);
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
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const formatearNum = (n, d = 1) => Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d });
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opcionDe = (p, v) => p?.opciones?.find(o => o.id === v) || null;
const varValida = (p, v) => (opcionDe(p, v) ? v : p?.opciones?.[0]?.id || '');
const precioDe = (p, v) => (opcionDe(p, v) || p?.opciones?.[0])?.precio || 0;
const envaseDe = (p, v) => (opcionDe(p, v) || p?.opciones?.[0])?.largo || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const esOscuro = hex => {
  const h = String(hex).replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.28;
};

const Cart = {
  KEY: 'pinturasgalfa_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    if (!vv) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15.5 15.5 3 21 8.5 8.5 21Z"/><path d="m7 11.5 2 2M10 8.5l2 2M13 5.5l2 2"/></svg>',
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
const botonSumar = p => `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
const envSelectHTML = p => `<label class="prod__env"><span class="sr-only">Envase de ${esc(p.nombre)}</span><select data-env-sel>${p.opciones.map(o => `<option value="${esc(o.id)}">${esc(o.nombre)}</option>`).join('')}</select></label>`;
const precioCard = p => `<p class="prod__precio precio" data-card-precio><small>Desde</small> ${formatearPrecio(p.desde)}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
};
function cardHTML(p, estilo = 'ficha', anim = 'subir') {
  const a = ANIMS[anim] || '';
  const cat = catDe(p.cat);
  const tira = estilo === 'muestra'
    ? `<p class="prod__tira${esOscuro(p.hex) ? ' prod__tira--osc' : ''}" style="--c:${esc(p.hex)}"><b>${esc(p.cod)}</b><span>${esc(p.color)}</span></p>`
    : '';
  const chip = estilo === 'ficha' ? `<span class="prod__chip"><i style="--c:${esc(p.hex)}"></i>${esc(p.cod)}</span>` : '';
  return `<article class="prod prod--${estilo}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.w}" height="${p.img.h}" decoding="async"></button><span class="prod__cat">${esc(cat.corto)}</span>${chip}</div>
  ${tira}<div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__meta">${esc(p.term[0].toUpperCase() + p.term.slice(1))} · rinde ${esc(p.rinde)} m²/L</p>
    ${precioCard(p)}
    <div class="prod__compra">${envSelectHTML(p)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function opcionesHTML(p, sel = null) {
  const v = varValida(p, sel);
  return `<div class="opciones" role="group" aria-label="Envase" data-opciones>${p.opciones.map(o => `<button type="button" class="opcion-btn" data-opcion="${esc(o.id)}" aria-pressed="${o.id === v}"><b>${esc(o.nombre)}</b><small>${formatearPrecio(o.precio)}</small></button>`).join('')}</div>`;
}
function elegirOpcion(cont, v) {
  const p = cont && getProducto(cont.dataset.id);
  if (!p) return;
  const vv = varValida(p, v);
  cont.querySelectorAll('[data-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.opcion === vv)));
  cont.querySelectorAll('[data-precio]').forEach(el => { el.textContent = formatearPrecio(precioDe(p, vv)); });
  cont.querySelectorAll('[data-det]').forEach(el => { el.textContent = `envase de ${envaseDe(p, vv)}`; });
}
const opcionElegida = cont => cont?.querySelector('[data-opcion][aria-pressed="true"]')?.dataset.opcion || cont?.querySelector('[data-env-sel]')?.value || null;
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'envase', 'envases')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${p.cod}), envase de ${envaseDe(p, i.v)} — ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.w}" height="${p.img.h}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><i style="--c:${esc(p.hex)}"></i>${esc(p.cod)} · <b>${esc(envaseDe(p, i.v))}</b> · ${formatearPrecio(precioDe(p, i.v))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)} de ${esc(envaseDe(p, i.v))}">${ICO.x}</button>
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
    cuenta.textContent = n ? plural(n, 'envase', 'envases') : '';
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
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» (${envaseDe(p, v)}) del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${envaseDe(p, v)}) al pedido`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-env-sel]');
    if (!sel) return;
    const card = sel.closest('[data-id]');
    const p = card && getProducto(card.dataset.id);
    const out = card?.querySelector('[data-card-precio]');
    if (p && out) out.innerHTML = `<small>${esc(envaseDe(p, sel.value))}</small> ${formatearPrecio(precioDe(p, sel.value))}`;
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const v = cont?.querySelector('[data-env-sel]')?.value;
      const n = sumar(id, v, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: qv.closest('[data-id]')?.querySelector('[data-env-sel]')?.value });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { familia: p.fam, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const calcHref = `${HOME_URL}?calc=${encodeURIComponent(p.id)}#calculadora`;
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.w}" height="${p.img.h}"></figure>
    <div class="qv__muestra"><img src="${esc(p.muestra)}" alt="" width="480" height="320"><span><b>${esc(p.cod)}</b>${esc(p.color)}</span></div>
  </div>
  <div class="qv__info">
    <p class="qv__meta"><span class="qv__cat">${esc(catDe(p.cat).nombre)}</span><span class="qv__fam">${esc(famDe(p.fam).nombre)}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv"><span data-precio>${formatearPrecio(precioDe(p, vv))}</span> <small data-det>envase de ${esc(envaseDe(p, vv))}</small></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">
      <div><dt>Terminación</dt><dd>${esc(p.term[0].toUpperCase() + p.term.slice(1))}</dd></div>
      <div><dt>Rendimiento</dt><dd>${esc(p.rinde)} m² por litro y por mano</dd></div>
      <div><dt>Envases</dt><dd>${p.opciones.map(o => esc(o.nombre)).join(' · ')}</dd></div>
    </dl>
    <div class="qv__bloque"><p class="qv__label">Envase</p>${opcionesHTML(p, vv)}</div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <div class="qv__links"><a class="qv__calc" href="${esc(calcHref)}" data-calc-ir="${esc(p.id)}">${ICO.regla}<span>Calcular cuántos litros necesito</span></a><a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» (${p.cod}) de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a></div>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>Combina con</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.w}" height="${r.img.h}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(r.desde)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const op = e.target.closest('[data-opcion]');
    if (op) { elegirOpcion(cont, op.dataset.opcion); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const ir = e.target.closest('[data-calc-ir]');
    if (ir && document.querySelector('[data-calc]')) {
      e.preventDefault();
      cerrarCapa(modal, { devolverFoco: false });
      window.elegirEnCalculadora?.(ir.dataset.calcIr, true);
      return;
    }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const v = opcionElegida(cont);
      const n = Cart.add(p, v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${envaseDe(p, v)}) al pedido`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, color: p.color, sku: p.cod.replace(' ', '-'),
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: p.desde, highPrice: Math.max(...p.opciones.map(o => o.precio)), offerCount: p.opciones.length, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { }
}

function mejorCombo(opciones, litros) {
  const paso = 0.5;
  const need = Math.max(1, Math.ceil(litros / paso - 1e-9));
  const tam = opciones.map(o => Math.round(o.litros / paso));
  const max = Math.max(...tam);
  const lim = need + max;
  const costo = new Array(lim + 1).fill(Infinity);
  const elegido = new Array(lim + 1).fill(-1);
  costo[0] = 0;
  for (let t = 1; t <= lim; t++) {
    tam.forEach((s, k) => {
      if (s <= t && costo[t - s] + opciones[k].precio < costo[t]) { costo[t] = costo[t - s] + opciones[k].precio; elegido[t] = k; }
    });
  }
  let mejor = -1;
  for (let t = need; t <= lim; t++) if (costo[t] < Infinity && (mejor < 0 || costo[t] < costo[mejor])) mejor = t;
  const cuenta = new Map();
  for (let t = mejor; t > 0 && elegido[t] >= 0; t -= tam[elegido[t]]) {
    const o = opciones[elegido[t]];
    cuenta.set(o.id, (cuenta.get(o.id) || 0) + 1);
  }
  const envases = opciones.filter(o => cuenta.has(o.id)).sort((a, b) => b.litros - a.litros).map(o => ({ id: o.id, nombre: o.nombre, qty: cuenta.get(o.id), precio: o.precio, subtotal: o.precio * cuenta.get(o.id) }));
  return { envases, litrosEnvases: mejor * paso, total: costo[mejor] };
}

function calcularPintura({ modo = 'ambiente', largo, ancho, alto, puertas = 0, ventanas = 0, techo = false, m2, producto, manos = 2 } = {}) {
  const p = typeof producto === 'string' ? getProducto(producto) : producto;
  if (!p) return { error: 'Elegí una pintura.' };
  const num = v => (typeof v === 'string' ? parseFloat(v.trim().replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')) : Number(v));
  let sup;
  if (modo === 'm2') {
    const s = num(m2);
    if (!(s >= 1 && s <= 2000)) return { error: 'Poné una superficie entre 1 y 2.000 m².' };
    sup = s;
  } else {
    const l = num(largo), a = num(ancho), h = num(alto);
    if (!(l >= 1 && l <= 30) || !(a >= 1 && a <= 30)) return { error: 'El largo y el ancho van de 1 a 30 metros.' };
    if (!(h >= 2 && h <= 6)) return { error: 'El alto va de 2 a 6 metros.' };
    const pu = Math.min(Math.max(Math.round(num(puertas) || 0), 0), 10);
    const ve = Math.min(Math.max(Math.round(num(ventanas) || 0), 0), 20);
    sup = 2 * (l + a) * h - pu * MEDIDAS.puerta - ve * MEDIDAS.ventana + (techo ? l * a : 0);
    if (sup < 1) return { error: 'Las aberturas ocupan más que las paredes: revisá las medidas.' };
  }
  const mn = Math.min(Math.max(parseInt(manos, 10) || 2, 1), 3);
  const litros = (sup * mn / p.r) * (1 + MEDIDAS.extra);
  const combo = mejorCombo(p.opciones, litros);
  return { m2: Math.round(sup * 10) / 10, manos: mn, rinde: p.r, litros: Math.round(litros * 10) / 10, ...combo, producto: p };
}

function initCalc() {
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const sec = form.closest('section');
  const $ = s => sec.querySelector(s);
  const prodSel = $('#calcProd');
  const err = $('[data-calc-error]');
  const out = {
    m2: $('[data-calc-m2]'), l: $('[data-calc-l]'), det: $('[data-calc-det]'), env: $('[data-calc-env]'),
    total: $('[data-calc-total]'), img: $('[data-calc-img]'), color: $('[data-calc-color]'), sumar: $('[data-calc-sumar]'), wsp: $('[data-calc-wsp]'),
  };
  let ultimo = null;
  const leer = () => ({
    modo: form.querySelector('input[name="calc-modo"]:checked')?.value || 'ambiente',
    largo: $('#calcLargo').value, ancho: $('#calcAncho').value, alto: $('#calcAlto').value,
    puertas: $('#calcPuertas').value, ventanas: $('#calcVentanas').value, techo: $('#calcTecho').checked,
    m2: $('#calcM2').value, producto: prodSel.value, manos: form.querySelector('input[name="calc-manos"]:checked')?.value || '2',
  });
  const pintar = () => {
    const d = leer();
    form.querySelectorAll('[data-modo]').forEach(b => { b.hidden = b.dataset.modo !== d.modo; });
    const r = calcularPintura(d);
    const card = $('[data-calc-res]');
    if (r.error) {
      err.textContent = r.error; err.hidden = false;
      card.classList.add('is-error');
      out.sumar.disabled = true;
      ultimo = null;
      return;
    }
    err.hidden = true;
    card.classList.remove('is-error');
    out.sumar.disabled = false;
    ultimo = r;
    const p = r.producto;
    out.img.src = p.muestra;
    out.color.textContent = `${p.cod} · ${p.color}`;
    out.m2.textContent = `${formatearNum(r.m2)} m²`;
    out.l.textContent = formatearNum(r.litros);
    out.det.textContent = `${plural(r.manos, 'mano', 'manos')} · rinde ${p.r} m² por litro · +10 % para retoques`;
    out.env.innerHTML = r.envases.map(e => `<li><b>${e.qty} ×</b> envase de ${esc(e.nombre)}<span>${formatearPrecio(e.subtotal)}</span></li>`).join('');
    out.total.textContent = formatearPrecio(r.total);
    const env = r.envases.map(e => `${e.qty} × ${e.nombre}`).join(' + ');
    out.wsp.href = wspHref(`Hola! Calculé en la web ${formatearNum(r.m2)} m² a ${plural(r.manos, 'mano', 'manos')} con ${p.nombre} (${p.cod}): me da ${formatearNum(r.litros)} litros, ${env}. ¿Me confirmás el pedido?`);
    if (!reduceMotion) { out.l.classList.remove('salta'); void out.l.offsetWidth; out.l.classList.add('salta'); }
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  out.sumar.addEventListener('click', () => {
    if (!ultimo) return;
    ultimo.envases.forEach(e => Cart.add(ultimo.producto, e.id, e.qty));
    const n = ultimo.envases.reduce((s, e) => s + e.qty, 0);
    showToast(`Sumaste ${plural(n, 'envase', 'envases')} de «${ultimo.producto.nombre}» al pedido`);
    if (!reduceMotion) { out.sumar.classList.remove('sumado'); void out.sumar.offsetWidth; out.sumar.classList.add('sumado'); }
  });
  window.elegirEnCalculadora = (id, ir) => {
    if (!getProducto(id)) return;
    prodSel.value = id;
    pintar();
    if (ir) { sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); setTimeout(() => prodSel.focus({ preventScroll: true }), 500); }
  };
  const pre = new URLSearchParams(location.search).get('calc');
  if (pre && getProducto(pre)) { prodSel.value = pre; setParam('calc', null); }
  pintar();
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
  const otros = ['familia', 'term', 'env', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="960" height="1200"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'pintura', 'pinturas')}</em></a></li>`;
    }).join('');
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => { el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'pintura', 'pinturas'); });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
  cont.innerHTML = Tienda.consultar({ limite }).items.map(p => cardHTML(p, cont.dataset.estilo || 'muestra', 'der')).join('');
}

function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const estilo = cont.dataset.estilo || 'ficha';
    const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      const [k, v] = tab ? tab.split(':') : [];
      const filtros = k ? { [k]: v } : {};
      cont.innerHTML = Tienda.consultar({ filtros, limite }).items.map(p => cardHTML(p, estilo, 'subir')).join('');
      if (verTodo) verTodo.href = k ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
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
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
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
      const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
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
  const estilo = MODELO === '2' ? 'muestra' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, familia: FAMILIAS, term: TERMINACIONES, env: ENVASES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    familia: valida(params.get('familia'), FAMILIAS),
    term: valida(params.get('term'), TERMINACIONES),
    env: valida(params.get('env'), ENVASES),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    return f;
  };
  const tonos = fid => PRODUCTOS.filter(p => p.fam === fid).map(p => `<i style="--c:${esc(p.hex)}"></i>`).join('');
  const opcion = (grupo, item, marcado, n, extra = '') => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}>${extra}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  const opcionEnv = (item, marcado, n) => `<label class="env-op${n ? '' : ' is-cero'}"><input type="checkbox" data-f="env" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.corto)}</span></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cat]').innerHTML = CATEGORIAS.map(it => opcion('cat', it, e.cat.includes(it.id), Tienda.contar({ ...filtros('cat'), cat: it.id }))).join('');
    panel.querySelector('[data-f-familia]').innerHTML = FAMILIAS.map(it => opcion('familia', it, e.familia.includes(it.id), Tienda.contar({ ...filtros('familia'), familia: it.id }), `<span class="opcion__tonos" aria-hidden="true">${tonos(it.id)}</span>`)).join('');
    panel.querySelector('[data-f-term]').innerHTML = TERMINACIONES.map(it => opcion('term', it, e.term.includes(it.id), Tienda.contar({ ...filtros('term'), term: it.id }))).join('');
    panel.querySelector('[data-f-env]').innerHTML = ENVASES.map(it => opcionEnv(it, e.env.includes(it.id), Tienda.contar({ ...filtros('env'), env: it.id }))).join('');
  }
  const nombreChip = (k, id) => (k === 'env' ? `Envase de ${ENVASES.find(x => x.id === id)?.corto || ''}` : nombreDe(GRUPOS[k], id));
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1 || e[solo[0]].length !== 1) return '';
    const k = solo[0], id = e[k][0];
    if (k === 'cat') return nombreDe(CATEGORIAS, id);
    if (k === 'familia') return `Colores ${nombreDe(FAMILIAS, id).toLowerCase()}`;
    if (k === 'term') return `Terminación ${nombreDe(TERMINACIONES, id).toLowerCase()}`;
    return `Envases de ${ENVASES.find(x => x.id === id)?.nombre || ''}`;
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreChip(k, id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Pinturas para tu hogar y tu obra';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, látex, frentes y esmaltes`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo, 'subir')).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'pintura' : 'pinturas'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'las' : `${total}`; });
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
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
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
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
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
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero__pincelada i', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, stagger: 0.12, clearProps: 'transform' }, 0.05);
  desde('.hero-eyebrow', { x: -24, opacity: 0, duration: 0.9 }, 0.15);
  desde('h1', { y: 40, opacity: 0, duration: 1.1 }, 0.25);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  desde('.hero-badge', { y: 16, scale: 0.94, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

initRail();
initPreviews();
initMenuCategorias();
initCatalogo();
initCalc();
initReveals();
initHeroMotion();
initRails();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
