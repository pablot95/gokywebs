const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
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

const WSP = '5493585040619';
const MARCA = 'Aurora';
const TALLES = [{"id": "1-3m", "edadTxt": "1 a 3 meses", "nombre": "1-3 meses", "corto": "1-3 m", "etapa": "bebe", "edad": [1, 3], "altura": [50, 62], "desde": "1 mes", "hasta": "3 meses"}, {"id": "3-6m", "edadTxt": "3 a 6 meses", "nombre": "3-6 meses", "corto": "3-6 m", "etapa": "bebe", "edad": [4, 6], "altura": [62, 68], "desde": "3 meses", "hasta": "6 meses"}, {"id": "6-9m", "edadTxt": "6 a 9 meses", "nombre": "6-9 meses", "corto": "6-9 m", "etapa": "bebe", "edad": [7, 9], "altura": [68, 74], "desde": "6 meses", "hasta": "9 meses"}, {"id": "9-12m", "edadTxt": "9 a 12 meses", "nombre": "9-12 meses", "corto": "9-12 m", "etapa": "bebe", "edad": [10, 12], "altura": [74, 80], "desde": "9 meses", "hasta": "12 meses"}, {"id": "12-18m", "edadTxt": "12 a 18 meses", "nombre": "12-18 meses", "corto": "12-18 m", "etapa": "bebe", "edad": [13, 18], "altura": [80, 86], "desde": "12 meses", "hasta": "18 meses"}, {"id": "18-24m", "edadTxt": "18 a 24 meses", "nombre": "18-24 meses", "corto": "18-24 m", "etapa": "bebe", "edad": [19, 24], "altura": [86, 92], "desde": "18 meses", "hasta": "24 meses"}, {"id": "2a", "edadTxt": "2 años", "nombre": "2 años", "corto": "2 años", "etapa": "chicos", "edad": [25, 36], "altura": [92, 98], "desde": "2 años", "hasta": "2 años"}, {"id": "4a", "edadTxt": "3 y 4 años", "nombre": "4 años", "corto": "4 años", "etapa": "chicos", "edad": [37, 60], "altura": [98, 110], "desde": "3 años", "hasta": "4 años"}, {"id": "6a", "edadTxt": "5 y 6 años", "nombre": "6 años", "corto": "6 años", "etapa": "chicos", "edad": [61, 84], "altura": [110, 122], "desde": "5 años", "hasta": "6 años"}, {"id": "8a", "edadTxt": "7 y 8 años", "nombre": "8 años", "corto": "8 años", "etapa": "chicos", "edad": [85, 96], "altura": [122, 134], "desde": "7 años", "hasta": "8 años"}];
const ETAPAS = [{"id": "bebe", "nombre": "Bebés", "rango": "1 a 24 meses"}, {"id": "chicos", "nombre": "Chicos", "rango": "2 a 8 años"}];
const COLORES = [{"id": "crudo", "nombre": "Crudo", "hex": "#EDE6D6"}, {"id": "terracota", "nombre": "Terracota", "hex": "#B4583A"}, {"id": "rosa", "nombre": "Rosa viejo", "hex": "#D9A3A0"}, {"id": "rayado", "nombre": "Rayado marino", "hex": "#27324F", "hex2": "#EDE6D6"}, {"id": "azul", "nombre": "Azul", "hex": "#3552B0"}, {"id": "salvia", "nombre": "Verde salvia", "hex": "#8FA58A"}, {"id": "jean", "nombre": "Jean", "hex": "#34425E"}, {"id": "amarillo", "nombre": "Amarillo", "hex": "#E9C85A"}, {"id": "celeste", "nombre": "Celeste", "hex": "#A8C4E6"}];
const CATEGORIAS = [{"id": "bodys", "nombre": "Bodys y enteritos", "bajada": "Para los primeros meses", "img": "images/c-bodys.webp", "tinte": "celeste", "alt": "Enterito tejido color terracota con botones"}, {"id": "arriba", "nombre": "Remeras y buzos", "bajada": "Para el día a día", "img": "images/c-arriba.webp", "tinte": "manteca", "alt": "Remera rayada azul marino y crudo"}, {"id": "abajo", "nombre": "Pantalones y jardineros", "bajada": "Para jugar cómodos", "img": "images/c-abajo.webp", "tinte": "salvia", "alt": "Jardinero de jean con tiradores"}, {"id": "vestidos", "nombre": "Vestidos y abrigos", "bajada": "Para salir y para el frío", "img": "images/c-vestidos.webp", "tinte": "rosa", "alt": "Vestido amarillo con volados en los breteles"}];
const PRECIOS = [{"id": "hasta15", "nombre": "Hasta $15.000", "min": 0, "max": 15000}, {"id": "15a25", "nombre": "$15.000 a $25.000", "min": 15000, "max": 25000}, {"id": "mas25", "nombre": "Más de $25.000", "min": 25000, "max": null}];
const PRODUCTOS = [{"id": "campera-matelaseada", "rango": 1, "cat": "vestidos", "nombre": "Campera matelaseada", "nota": "Cuello bebé y broches", "precio": 36900, "talles": ["6-9m", "9-12m", "12-18m", "18-24m", "2a", "4a"], "color": "celeste", "img": "images/p-campera.webp", "etiqueta": "Nuevo", "alt": "Campera matelaseada celeste con cuello bebé, broches y dos bolsillos", "desc": "Campera acolchada con costura en rombos, cuello bebé, broches al frente y dos bolsillos. Abriga sin pesar y se lava en lavarropas.", "claves": ["campera", "abrigo", "matelaseada", "acolchada", "invierno", "celeste"]}, {"id": "body-cruzado", "rango": 2, "cat": "bodys", "nombre": "Body cruzado de morley", "nota": "Manga larga, broches al costado", "precio": 12900, "talles": ["1-3m", "3-6m", "6-9m", "9-12m", "12-18m"], "color": "crudo", "img": "images/p-body-cruzado.webp", "alt": "Body cruzado de morley acanalado color crudo con broches al costado", "desc": "Body de morley acanalado que se cruza y se prende al costado, así no hay que pasarlo por la cabeza. Manga larga y broches abajo para cambiar el pañal rápido.", "claves": ["body", "bodie", "morley", "recien nacido", "bebe", "cruzado"]}, {"id": "enterito-tejido", "rango": 3, "cat": "bodys", "nombre": "Enterito tejido con botones", "nota": "Punto tejido, puños elastizados", "precio": 28900, "talles": ["3-6m", "6-9m", "9-12m", "12-18m", "18-24m"], "color": "terracota", "img": "images/p-enterito-tejido.webp", "alt": "Enterito tejido color terracota con botones al frente", "desc": "Enterito de punto tejido con botones al frente y puños elastizados en mangas y tobillos. Para los días frescos, solo o sobre un body.", "claves": ["enterito", "tejido", "mameluco", "osito", "bebe", "abrigo"]}, {"id": "vestido-volados", "rango": 4, "cat": "vestidos", "nombre": "Vestido con volados", "nota": "Algodón, breteles con volado", "precio": 24900, "talles": ["12-18m", "18-24m", "2a", "4a", "6a"], "color": "amarillo", "img": "images/p-vestido.webp", "etiqueta": "Nuevo", "alt": "Vestido amarillo de algodón con volados en los breteles", "desc": "Vestido de algodón con falda fruncida y breteles con volado. Fresco para el verano y fácil de combinar con un saquito.", "claves": ["vestido", "nena", "verano", "volados", "fiesta"]}, {"id": "jardinero-jean", "rango": 5, "cat": "abajo", "nombre": "Jardinero de jean", "nota": "Tiradores regulables", "precio": 32900, "talles": ["12-18m", "18-24m", "2a", "4a", "6a"], "color": "jean", "img": "images/p-jardinero.webp", "alt": "Jardinero de jean oscuro con tiradores y bolsillo al pecho", "desc": "Jardinero de jean con tiradores regulables, bolsillo al pecho y botones a los costados. Resistente para jugar y crece con ellos.", "claves": ["jardinero", "jean", "enterito", "mameluco", "pantalon", "overol"]}, {"id": "buzo-canguro", "rango": 6, "cat": "arriba", "nombre": "Buzo canguro con capucha", "nota": "Polar, bolsillo canguro", "precio": 27900, "talles": ["2a", "4a", "6a", "8a"], "color": "azul", "img": "images/p-buzo.webp", "alt": "Buzo canguro azul de polar con capucha y bolsillo", "desc": "Buzo de polar con capucha, bolsillo canguro y puños elastizados. Abrigado y liviano para la escuela o la plaza.", "claves": ["buzo", "canguro", "capucha", "polar", "abrigo", "hoodie"]}, {"id": "enterito-pie", "rango": 7, "cat": "bodys", "nombre": "Enterito con pie", "nota": "Algodón, broches al frente", "precio": 16900, "talles": ["1-3m", "3-6m", "6-9m", "9-12m", "12-18m", "18-24m"], "color": "rosa", "img": "images/p-enterito-pie.webp", "alt": "Enterito de algodón rosa viejo con pie y broches al frente", "desc": "Enterito de algodón con pie cerrado y broches de punta a punta. Para dormir abrigado o andar en casa.", "claves": ["enterito", "pijama", "osito", "con pie", "bebe", "dormir"]}, {"id": "remera-rayada", "rango": 8, "cat": "arriba", "nombre": "Remera rayada manga larga", "nota": "Algodón, cuello redondo", "precio": 14900, "talles": ["2a", "4a", "6a", "8a"], "color": "rayado", "img": "images/p-remera-rayada.webp", "alt": "Remera de manga larga a rayas azul marino y crudo", "desc": "Remera de algodón a rayas marinas con cuello redondo y manga larga. Va con jogger, jardinero o jean.", "claves": ["remera", "rayada", "rayas", "manga larga", "marinera"]}, {"id": "jogger-frisa", "rango": 9, "cat": "abajo", "nombre": "Jogger de frisa", "nota": "Cintura elástica con cordón", "precio": 18900, "talles": ["2a", "4a", "6a", "8a"], "color": "salvia", "img": "images/p-jogger.webp", "alt": "Jogger de frisa verde salvia con cordón y puños", "desc": "Jogger de frisa con cintura elástica, cordón y puños en los tobillos. Cómodo para la escuela, la plaza y la casa.", "claves": ["jogger", "pantalon", "frisa", "babucha", "jogging"]}, {"id": "medias-antideslizantes", "rango": 99, "cat": "bodys", "nombre": "Medias antideslizantes x 3", "nota": "Pack", "precio": 7900, "talles": ["6-9m", "9-12m", "12-18m", "18-24m"], "color": "crudo", "img": "images/p-body-cruzado.webp", "visible": false, "alt": "Producto oculto", "desc": "Producto oculto de prueba: no se muestra en la tienda.", "claves": ["medias"]}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacadas' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const talleDe = id => TALLES.find(t => t.id === id) || null;
const colorDe = id => COLORES.find(c => c.id === id) || null;
const etapasDe = p => [...new Set((p.talles || []).map(t => talleDe(t)?.etapa).filter(Boolean))];
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  return !!r && p.precio >= r.min && (r.max == null || p.precio < r.max);
};
function rangoEdad(p) {
  const a = talleDe(p.talles[0])?.desde || '';
  const b = talleDe(p.talles[p.talles.length - 1])?.hasta || '';
  const meses = s => /mes(es)?$/.test(s);
  const anios = s => /años$/.test(s);
  if ((meses(a) && meses(b)) || (anios(a) && anios(b))) return `${a.split(' ')[0]} a ${b}`;
  return `${a} a ${b}`;
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, catDe(p.cat)?.nombre, colorDe(p.color)?.nombre, rangoEdad(p),
    ...(p.talles || []).map(t => talleDe(t)?.nombre), ...etapasDe(p).map(e => nombreDe(ETAPAS, e)), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), etapa = lista(f.etapa), talle = lista(f.talle), color = lista(f.color), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (etapa.length && !etapasDe(p).some(e => etapa.includes(e))) return false;
    if (talle.length && !talle.some(t => (p.talles || []).includes(t))) return false;
    if (color.length && !color.includes(p.color)) return false;
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
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
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
const talleValido = (p, t) => (p?.talles || []).includes(t) ? t : '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const fondoColor = c => (c?.hex2 ? `repeating-linear-gradient(0deg, ${c.hex} 0 3px, ${c.hex2} 3px 6px)` : c?.hex || '#ccc');
const detalleLinea = i => `Talle ${talleDe(i.t)?.nombre || i.t}`;

const Cart = {
  KEY: 'aurora_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, t, qty = 1) {
    if (!producto) return 0;
    const tt = talleValido(producto, t);
    if (!tt) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.t === tt);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, t: tt, qty: n });
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      const t = p && talleValido(p, i.t);
      if (!p || !t) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.t === t);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push({ id: p.id, t, qty });
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
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
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
const talleSelectHTML = (p, t = '') => `<select class="talle-sel" data-talle-sel aria-label="Talle de ${esc(p.nombre)}"><option value="">Talle</option>${p.talles.map(x => `<option value="${x}"${x === t ? ' selected' : ''}>${esc(talleDe(x)?.corto || x)}</option>`).join('')}</select>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', talle = '' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const etq = p.etiqueta ? `<span class="prod__etq">${esc(p.etiqueta)}</span>` : '';
  return `<article class="prod prod--${esc(catDe(p.cat).tinte)}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"></button>${etq}<p class="prod__edad">${esc(rangoEdad(p))}</p></div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__precio">${formatearPrecio(p.precio)}</p>
    <div class="prod-actions">${talleSelectHTML(p, talleValido(p, talle))}${botonSumar(p)}</div>
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
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'prenda', 'prendas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleLinea(i)}) — ${formatearPrecio(p.precio * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o el envío?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="1000" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleLinea(i))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-k="${k}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${k}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(p.precio * i.qty)}</p>
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
    cuenta.textContent = n ? plural(n, 'prenda', 'prendas') : '';
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
    Cart.remove(k);
    if (p) showToast(`Sacaste «${p.nombre}» (${detalleLinea(it)}) del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, t, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, t, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (talle ${talleDe(t)?.nombre || t}) al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function pedirTalle(sel) {
  showToast('Elegí el talle para sumarla al carrito');
  if (!sel) return;
  sel.classList.remove('falta'); void sel.offsetWidth; sel.classList.add('falta');
  sel.focus({ preventScroll: true });
  setTimeout(() => sel.classList.remove('falta'), 1800);
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const card = b.closest('.prod');
      const sel = card?.querySelector('[data-talle-sel]');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const t = sel?.value || '';
      if (!t) { pedirTalle(sel); return; }
      const n = sumar(id, t, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      const card = qv.closest('.prod');
      abrirVistaRapida(qv.dataset.qv, { previo: qv, t: card?.querySelector('[data-talle-sel]')?.value });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { etapa: etapasDe(p), excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p, t) {
  const rel = relacionados(p);
  const col = colorDe(p.color);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></figure>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(catDe(p.cat).nombre)}${p.etiqueta ? `<span class="prod__etq prod__etq--qv">${esc(p.etiqueta)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__edad">Para ${esc(rangoEdad(p))}</p>
    <p class="qv__precio">${formatearPrecio(p.precio)}</p>
    ${col ? `<p class="qv__color"><span class="punto" style="background:${fondoColor(col)}"></span>Color: <b>${esc(col.nombre)}</b></p>` : ''}
    <div class="qv__bloque">
      <p class="qv__label">Talle <a class="qv__guia" href="${HOME_URL}#edad">${ICO.regla}¿Qué talle le queda?</a></p>
      <div class="qv__talles" role="group" aria-label="Talle">${p.talles.map(x => `<button type="button" class="qv__talle" data-qv-talle="${x}" aria-pressed="${x === t}">${esc(talleDe(x)?.corto || x)}</button>`).join('')}</div>
      <p class="qv__aviso" data-qv-aviso hidden>Elegí el talle para seguir.</p>
    </div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, t = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const tt = talleValido(p, t);
  qvEstado = { id: p.id, t: tt };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, tt);
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
    if (e.target.closest('.qv__guia')) { cerrarCapa(modal, { devolverFoco: false }); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const tal = e.target.closest('[data-qv-talle]');
    if (tal) {
      qvEstado.t = tal.dataset.qvTalle;
      cont.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === tal)));
      cont.querySelector('[data-qv-aviso]').hidden = true;
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
      if (!qvEstado.t) {
        cont.querySelector('[data-qv-aviso]').hidden = false;
        cont.querySelector('[data-qv-talle]')?.focus();
        return;
      }
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, qvEstado.t, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (talle ${talleDe(qvEstado.t)?.nombre}) al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, color: colorDe(p.color)?.nombre || '', size: p.talles.map(t => talleDe(t)?.nombre).join(', '),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: 'https://schema.org/InStock' },
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
  const otros = ['etapa', 'talle', 'color', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="720" height="720"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'prenda', 'prendas')}</em></a></li>`;
    }).join('');
  });
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

function marcarRegla(talle) {
  document.querySelectorAll('[data-regla]').forEach(r => {
    r.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === talle)));
    const b = talle && r.querySelector(`[data-talle="${talle}"]`);
    if (b && r.scrollWidth > r.clientWidth) {
      const rr = r.getBoundingClientRect(), br = b.getBoundingClientRect();
      r.scrollLeft += br.left - rr.left - (rr.width - br.width) / 2;
    }
  });
}

function initReglaScroll() {
  document.querySelectorAll('[data-regla]').forEach(r => {
    const sync = () => r.classList.toggle('al-final', r.scrollLeft >= r.scrollWidth - r.clientWidth - 4);
    r.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initPanel() {
  const grid = document.querySelector('[data-panel]');
  if (!grid) return;
  const vacio = document.querySelector('[data-panel-vacio]');
  const todo = document.querySelector('[data-panel-todo]');
  const quitar = document.querySelector('[data-panel-quitar]');
  const estadoTxt = document.querySelector('[data-panel-estado]');
  const base = estadoTxt?.textContent || '';
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const estado = { talle: '', cat: '' };
  let primera = true;
  const render = () => {
    const filtros = {};
    if (estado.talle) filtros.talle = estado.talle;
    if (estado.cat) filtros.cat = estado.cat;
    const items = Tienda.consultar({ filtros, limite: 8 }).items;
    grid.innerHTML = items.map(p => cardHTML(p, { anim: 'subir', talle: estado.talle })).join('');
    vacio.hidden = items.length > 0;
    grid.hidden = items.length === 0;
    const q = new URLSearchParams();
    if (estado.cat) q.set('cat', estado.cat);
    if (estado.talle) q.set('talle', estado.talle);
    todo.href = CATALOGO_URL + (q.toString() ? `?${q}` : '');
    const t = talleDe(estado.talle);
    todo.firstChild.textContent = t ? `Ver todo en talle ${t.nombre} ` : 'Ver todo el catálogo ';
    quitar.hidden = !t;
    if (estadoTxt) estadoTxt.textContent = t ? `Talle ${t.nombre} (${t.edadTxt}): ${plural(Tienda.contar(filtros), 'prenda', 'prendas')}${estado.cat ? ` en ${catDe(estado.cat).nombre.toLowerCase()}` : ''}.` : base;
    marcarRegla(estado.talle);
    if (!primera) { revelarNuevos(grid); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
    primera = false;
  };
  document.querySelectorAll('[data-regla] [data-talle]').forEach(b => b.addEventListener('click', () => {
    estado.talle = estado.talle === b.dataset.talle ? '' : b.dataset.talle;
    render();
    if (estado.talle) document.getElementById('coleccion')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  quitar?.addEventListener('click', () => { estado.talle = ''; render(); });
  tabs.forEach(tb => tb.addEventListener('click', () => {
    estado.cat = tb.dataset.tab;
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === tb)));
    render();
  }));
  render();
}

function edadTexto(m) {
  if (m < 24) return m === 1 ? '1 mes' : `${m} meses`;
  const a = Math.floor(m / 12), r = m % 12;
  return r ? `${a} años y ${r} ${r === 1 ? 'mes' : 'meses'}` : `${a} años`;
}
function talleSugerido(meses, grande = false) {
  let i = TALLES.findIndex(t => meses >= t.edad[0] && meses <= t.edad[1]);
  if (i < 0) i = meses < TALLES[0].edad[0] ? 0 : TALLES.length - 1;
  if (grande) i = Math.min(i + 1, TALLES.length - 1);
  return TALLES[i];
}

function initGuia() {
  document.querySelectorAll('[data-guia]').forEach(box => {
    const range = box.querySelector('[data-edad]');
    const out = box.querySelector('[data-edad-out]');
    const check = box.querySelector('[data-grande]');
    const tTalle = box.querySelector('[data-guia-talle]');
    const nota = box.querySelector('[data-guia-nota]');
    const link = box.querySelector('[data-guia-link]');
    const linkT = box.querySelector('[data-guia-link-t]');
    const wsp = box.querySelector('[data-guia-wsp]');
    const tabla = box.closest('section')?.querySelectorAll('[data-fila]') || [];
    let previo = '';
    const calcular = () => {
      const m = Number(range.value);
      const t = talleSugerido(m, check?.checked);
      const n = Tienda.contar({ talle: t.id });
      out.textContent = edadTexto(m);
      range.style.setProperty('--pct', `${((m - range.min) / (range.max - range.min)) * 100}%`);
      range.setAttribute('aria-valuetext', edadTexto(m));
      tTalle.textContent = t.nombre;
      nota.textContent = `Altura orientativa: ${t.altura[0]} a ${t.altura[1]} cm.${check?.checked ? ' Le sugerimos un talle más.' : ''}`;
      link.href = n ? `${CATALOGO_URL}?talle=${t.id}` : CATALOGO_URL;
      linkT.textContent = n ? `Ver ${plural(n, 'prenda', 'prendas')} en ${t.nombre}` : 'Ver todo el catálogo';
      wsp.href = wspHref(`Hola! Quiero consultar qué talle le queda a mi hijo/a en ${MARCA}. Tiene ${edadTexto(m)}${check?.checked ? ' y es alto/a para su edad' : ''}, y la web me sugiere talle ${t.nombre}.`);
      tabla.forEach(tr => tr.classList.toggle('activa', tr.dataset.fila === t.id));
      if (previo && previo !== t.id && !reduceMotion) { tTalle.classList.remove('cambia'); void tTalle.offsetWidth; tTalle.classList.add('cambia'); }
      previo = t.id;
    };
    range.addEventListener('input', calcular);
    check?.addEventListener('change', calcular);
    calcular();
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
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, etapa: ETAPAS, talle: TALLES, color: COLORES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    etapa: valida(params.get('etapa'), ETAPAS),
    talle: valida(params.get('talle'), TALLES),
    color: valida(params.get('color'), COLORES),
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
  const opTalle = (item, marcado, n) => `<label class="op-talle${n ? '' : ' is-cero'}"><input type="checkbox" data-f="talle" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.corto)}</span></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cat]').innerHTML = CATEGORIAS.map(it => opcion('cat', it, e.cat.includes(it.id), Tienda.contar({ ...filtros('cat'), cat: it.id }))).join('');
    panel.querySelector('[data-f-etapa]').innerHTML = ETAPAS.map(it => opcion('etapa', { id: it.id, nombre: `${it.nombre} · ${it.rango}` }, e.etapa.includes(it.id), Tienda.contar({ ...filtros('etapa'), etapa: it.id }))).join('');
    panel.querySelector('[data-f-talle]').innerHTML = TALLES.map(it => opTalle(it, e.talle.includes(it.id), Tienda.contar({ ...filtros('talle'), talle: it.id }))).join('');
    panel.querySelector('[data-f-color]').innerHTML = COLORES.map(it => ({ it, n: Tienda.contar({ ...filtros('color'), color: it.id }) })).filter(x => x.n || e.color.includes(x.it.id)).map(x => opcion('color', x.it, e.color.includes(x.it.id), x.n, `<span class="punto" style="background:${fondoColor(x.it)}"></span>`)).join('');
    panel.querySelector('[data-f-precio]').innerHTML = PRECIOS.map(it => opcion('precio', it, e.precio.includes(it.id), Tienda.contar({ ...filtros('precio'), precio: it.id }))).join('');
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return nombreDe(CATEGORIAS, e.cat[0]);
    if (solo('etapa')) return e.etapa[0] === 'bebe' ? 'Ropa de bebé' : 'Ropa de chicos';
    if (solo('talle')) return `Talle ${nombreDe(TALLES, e.talle[0])}`;
    if (solo('color')) return `En ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const nom = (k, id) => k === 'talle' ? `Talle ${nombreDe(TALLES, id)}` : nombreDe(GRUPOS[k], id);
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nom(k, id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Toda la ropa';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, ropa para bebés y chicos`;
    marcarRegla(e.talle.length === 1 ? e.talle[0] : '');
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
    const talle = e.talle.length === 1 ? e.talle[0] : '';
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir', talle })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'prenda' : 'prendas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  document.querySelectorAll('[data-regla] [data-talle]').forEach(b => b.addEventListener('click', () => {
    e.talle = e.talle.length === 1 && e.talle[0] === b.dataset.talle ? [] : [b.dataset.talle];
    aplicar();
  }));
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
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.sol', { scale: 0.86, opacity: 0, duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-chip', { y: 16, scale: 0.94, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.4);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-ficha', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img, .sol--marca').forEach(el => {
    gsap.to(el, { yPercent: el.matches('img') ? 4 : -8, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initRail();
initPanel();
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
initGuia();
initReglaScroll();
initFloats();
initModelBarScroll();
initProductoUrl();
Cart.sync();
updateCartBadge();
