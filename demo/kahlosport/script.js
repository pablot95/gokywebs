const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492215951148';
const MARCA = 'Kahlosport';
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
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

const COLORES = [{"id": "negro", "nombre": "Negro", "hex": "#232227"}, {"id": "azul", "nombre": "Azul noche", "hex": "#2B3253"}, {"id": "lila", "nombre": "Lila", "hex": "#C9BCE6"}, {"id": "rosa", "nombre": "Rosa", "hex": "#D3979F"}, {"id": "salvia", "nombre": "Salvia", "hex": "#93A78A"}, {"id": "ciruela", "nombre": "Ciruela", "hex": "#4F2241"}, {"id": "celeste", "nombre": "Celeste", "hex": "#AABAE3"}, {"id": "gris", "nombre": "Gris perla", "hex": "#B5B4BB"}, {"id": "blanco", "nombre": "Blanco", "hex": "#EDECF1"}, {"id": "topo", "nombre": "Gris topo", "hex": "#3C3C40"}];
const CATEGORIAS = [{"id": "calzas", "nombre": "Calzas y shorts", "corto": "Calzas", "bajada": "Calzas, bikers y shorts", "img": "images/c-calzas.webp"}, {"id": "tops", "nombre": "Tops y remeras", "corto": "Tops", "bajada": "Tops, musculosas y remeras", "img": "images/c-tops.webp"}, {"id": "abrigo", "nombre": "Abrigo", "corto": "Abrigo", "bajada": "Camperas y joggers", "img": "images/c-abrigo.webp"}, {"id": "conjuntos", "nombre": "Conjuntos", "corto": "Conjuntos", "bajada": "Dos prendas que combinan", "img": "images/c-conjuntos.webp"}];
const TALLES = ["S", "M", "L", "XL"];
const PRECIOS = [{"id": "hasta20", "nombre": "Hasta $20.000", "min": 0, "max": 20000}, {"id": "20a35", "nombre": "$20.000 a $35.000", "min": 20000, "max": 35000}, {"id": "mas35", "nombre": "Más de $35.000", "min": 35000, "max": null}];
const GUIA = [{"t": "S", "cintura": [62, 68], "cadera": [88, 94]}, {"t": "M", "cintura": [68, 74], "cadera": [94, 100]}, {"t": "L", "cintura": [74, 80], "cadera": [100, 106]}, {"t": "XL", "cintura": [80, 88], "cadera": [106, 114]}];
const PRODUCTOS = [{"id": "calza-tiro-alto", "rango": 1, "cat": "calzas", "prenda": "Calza", "nombre": "Calza tiro alto", "nota": "Largo completo", "precio": 32900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "negro", "nombre": "Negro", "tonos": ["negro"], "img": "images/p-calza-negro.webp"}, {"id": "azul", "nombre": "Azul noche", "tonos": ["azul"], "img": "images/p-calza-azul.webp"}], "alt": "Calza deportiva larga de tiro alto", "desc": "Calza larga de tiro alto con cintura ancha que sostiene sin apretar. Para gimnasio, funcional o salir a correr.", "claves": ["calza", "leggings", "larga", "tiro alto", "gimnasio", "running"]}, {"id": "top-nadadora", "rango": 2, "cat": "tops", "prenda": "Top", "nombre": "Top espalda nadadora", "nota": "Sostén medio", "precio": 21900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "lila", "nombre": "Lila", "tonos": ["lila"], "img": "images/p-top-lila.webp"}, {"id": "rosa", "nombre": "Rosa", "tonos": ["rosa"], "img": "images/p-top-rosa.webp"}, {"id": "salvia", "nombre": "Salvia", "tonos": ["salvia"], "img": "images/p-top-salvia.webp"}], "alt": "Top deportivo de espalda nadadora", "desc": "Top deportivo con espalda nadadora y banda elástica bajo el busto. Combina con calzas, bikers o shorts.", "claves": ["top", "corpiño", "deportivo", "nadadora", "sosten"]}, {"id": "biker-tiro-alto", "rango": 3, "cat": "calzas", "prenda": "Biker", "nombre": "Biker tiro alto", "nota": "Largo medio muslo", "precio": 24900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "azul", "nombre": "Azul noche", "tonos": ["azul"], "img": "images/p-biker-azul.webp"}, {"id": "ciruela", "nombre": "Ciruela", "tonos": ["ciruela"], "img": "images/p-biker-ciruela.webp"}, {"id": "negro", "nombre": "Negro", "tonos": ["negro"], "img": "images/p-biker-negro.webp"}], "alt": "Biker deportivo de tiro alto", "desc": "Calza corta tipo biker, de tiro alto y largo a medio muslo, con costuras que acompañan el movimiento.", "claves": ["biker", "calza corta", "ciclista", "short", "tiro alto"]}, {"id": "remera-crop", "rango": 4, "cat": "tops", "prenda": "Remera", "nombre": "Remera crop deportiva", "nota": "Manga corta", "precio": 17900, "talles": ["S", "M", "L"], "etiqueta": "Nuevo", "variantes": [{"id": "rosa", "nombre": "Rosa", "tonos": ["rosa"], "img": "images/p-crop-rosa.webp"}, {"id": "lila", "nombre": "Lila", "tonos": ["lila"], "img": "images/p-crop-lila.webp"}, {"id": "celeste", "nombre": "Celeste", "tonos": ["celeste"], "img": "images/p-crop-celeste.webp"}], "alt": "Remera deportiva corta de manga corta", "desc": "Remera corta de manga ranglan, liviana y suelta, para usar sola o sobre un top.", "claves": ["remera", "crop", "corta", "manga corta", "camiseta"]}, {"id": "campera-cierre", "rango": 5, "cat": "abrigo", "prenda": "Campera", "nombre": "Campera deportiva con cierre", "nota": "Cuello alto", "precio": 42900, "talles": ["S", "M", "L", "XL"], "etiqueta": "Nuevo", "variantes": [{"id": "lila", "nombre": "Lila", "tonos": ["lila"], "img": "images/p-campera-lila.webp"}, {"id": "gris", "nombre": "Gris perla", "tonos": ["gris"], "img": "images/p-campera-gris.webp"}], "alt": "Campera deportiva entallada con cierre", "desc": "Campera entallada con cierre completo, cuello alto y dos bolsillos con cierre. Para antes y después de entrenar.", "claves": ["campera", "abrigo", "cierre", "buzo", "chaqueta"]}, {"id": "short-tajo", "rango": 6, "cat": "calzas", "prenda": "Short", "nombre": "Short deportivo con tajo", "nota": "Cintura elástica", "precio": 19900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "salvia", "nombre": "Salvia", "tonos": ["salvia"], "img": "images/p-short-salvia.webp"}, {"id": "lila", "nombre": "Lila", "tonos": ["lila"], "img": "images/p-short-lila.webp"}, {"id": "negro", "nombre": "Negro", "tonos": ["negro"], "img": "images/p-short-negro.webp"}], "alt": "Short deportivo liviano con tajo lateral", "desc": "Short liviano con cintura elástica fruncida y tajo lateral redondeado. Ideal para correr y para el calor.", "claves": ["short", "running", "correr", "verano", "liviano"]}, {"id": "remera-manga-larga", "rango": 7, "cat": "tops", "prenda": "Remera", "nombre": "Remera deportiva manga larga", "nota": "Entallada", "precio": 23900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "ciruela", "nombre": "Ciruela", "tonos": ["ciruela"], "img": "images/p-manga-ciruela.webp"}, {"id": "azul", "nombre": "Azul noche", "tonos": ["azul"], "img": "images/p-manga-azul.webp"}], "alt": "Remera deportiva entallada de manga larga", "desc": "Remera entallada de manga larga con costuras al frente. Para entrenar con fresco o usar debajo de la campera.", "claves": ["remera", "manga larga", "entallada", "camiseta", "invierno"]}, {"id": "musculosa", "rango": 8, "cat": "tops", "prenda": "Musculosa", "nombre": "Musculosa deportiva", "nota": "Espalda nadadora", "precio": 16900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "blanco", "nombre": "Blanco", "tonos": ["blanco"], "img": "images/p-musculosa-blanco.webp"}], "alt": "Musculosa deportiva de espalda nadadora", "desc": "Musculosa de espalda nadadora con largo a la cadera, liviana y fresca.", "claves": ["musculosa", "remera", "sin mangas", "verano", "nadadora"]}, {"id": "jogger-frisa", "rango": 9, "cat": "abrigo", "prenda": "Jogger", "nombre": "Jogger de frisa", "nota": "Puño en el tobillo", "precio": 34900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "topo", "nombre": "Gris topo", "tonos": ["topo"], "img": "images/p-jogger-gris.webp"}], "alt": "Pantalón jogger de frisa con cordón", "desc": "Jogger de frisa con cintura elástica, cordón y bolsillos. Para ir y volver del gimnasio.", "claves": ["jogger", "pantalon", "frisa", "babucha", "abrigo"]}, {"id": "conjunto-calza-top", "rango": 10, "cat": "conjuntos", "prenda": "Conjunto", "nombre": "Conjunto calza + top", "nota": "Dos prendas", "precio": 49900, "talles": ["S", "M", "L"], "variantes": [{"id": "negro-lila", "nombre": "Calza negra y top lila", "tonos": ["negro", "lila"], "img": "images/p-conjunto-lila.webp"}], "alt": "Conjunto de calza negra y top lila", "incluye": "Calza tiro alto negra + top espalda nadadora lila", "desc": "La calza tiro alto negra con el top espalda nadadora lila, en el mismo talle.", "claves": ["conjunto", "set", "calza", "top"]}, {"id": "conjunto-biker-crop", "rango": 11, "cat": "conjuntos", "prenda": "Conjunto", "nombre": "Conjunto biker + remera crop", "nota": "Dos prendas", "precio": 39900, "talles": ["S", "M", "L"], "variantes": [{"id": "azul-rosa", "nombre": "Biker azul y remera rosa", "tonos": ["azul", "rosa"], "img": "images/p-conjunto-rosa.webp"}], "alt": "Conjunto de biker azul noche y remera crop rosa", "incluye": "Biker tiro alto azul noche + remera crop rosa", "desc": "El biker tiro alto azul noche con la remera crop rosa, en el mismo talle.", "claves": ["conjunto", "set", "biker", "remera", "crop"]}, {"id": "conjunto-short-musculosa", "rango": 12, "cat": "conjuntos", "prenda": "Conjunto", "nombre": "Conjunto short + musculosa", "nota": "Dos prendas", "precio": 33900, "talles": ["S", "M", "L", "XL"], "variantes": [{"id": "salvia-blanco", "nombre": "Short salvia y musculosa blanca", "tonos": ["salvia", "blanco"], "img": "images/p-conjunto-blanco.webp"}], "alt": "Conjunto de short salvia y musculosa blanca", "incluye": "Short deportivo salvia + musculosa blanca", "desc": "El short con tajo salvia con la musculosa blanca, en el mismo talle.", "claves": ["conjunto", "set", "short", "musculosa", "verano"]}, {"id": "medias-tobilleras", "rango": 99, "cat": "abrigo", "prenda": "Medias", "nombre": "Medias tobilleras x 3", "nota": "Pack", "precio": 8900, "talles": ["S", "M"], "visible": false, "variantes": [{"id": "blanco", "nombre": "Blanco", "tonos": ["blanco"], "img": "images/p-musculosa-blanco.webp"}], "alt": "Producto oculto", "desc": "Producto oculto de prueba: no se muestra en la tienda.", "claves": ["medias"]}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacadas' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const colorDe = id => COLORES.find(c => c.id === id) || null;
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  return !!r && p.precio >= r.min && (r.max == null || p.precio < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, p.prenda, p.incluye, catDe(p.cat)?.nombre,
    ...(p.variantes || []).map(v => v.nombre), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle), color = lista(f.color), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !talle.some(t => (p.talles || []).includes(t))) return false;
    if (color.length && !(p.variantes || []).some(v => v.tonos.some(t => color.includes(t)))) return false;
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
const varDe = (p, v) => p?.variantes?.find(x => x.id === v) || p?.variantes?.[0] || null;
const varPorColor = (p, colores = []) => (colores.length && p.variantes.find(v => v.tonos.some(t => colores.includes(t)))) || p.variantes[0];
const talleValido = (p, t) => (p?.talles || []).includes(t) ? t : '';
const altDe = (p, v) => `${p.alt || p.nombre}, color ${v.nombre.toLowerCase()}`;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const fondoPunto = v => {
  const hex = v.tonos.map(t => colorDe(t)?.hex || '#ccc');
  return hex.length > 1 ? `linear-gradient(135deg, ${hex[0]} 50%, ${hex[1]} 50%)` : hex[0];
};
const detalleLinea = (p, i) => `${varDe(p, i.v)?.nombre || ''} · Talle ${i.t}`;

const Cart = {
  KEY: 'kahlosport_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v, t, qty = 1) {
    if (!producto) return 0;
    const vv = varDe(producto, v)?.id;
    const tt = talleValido(producto, t);
    if (!vv || !tt) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv && i.t === tt);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, t: tt, qty: n });
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
      const v = varDe(p, i.v).id;
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v && x.t === t);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, t, qty });
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
const talleSelectHTML = (p, t = '') => `<select class="talle-sel" data-talle-sel aria-label="Talle de ${esc(p.nombre)}"><option value="">Talle</option>${p.talles.map(x => `<option value="${x}"${x === t ? ' selected' : ''}>${x}</option>`).join('')}</select>`;
const puntosHTML = (p, vid) => `<div class="puntos" role="group" aria-label="Colores de ${esc(p.nombre)}">${p.variantes.map(v => `<button type="button" class="punto-btn" data-color="${esc(v.id)}" aria-pressed="${v.id === vid}" aria-label="${esc(v.nombre)}" title="${esc(v.nombre)}"><span class="punto" style="background:${fondoPunto(v)}"></span></button>`).join('')}<span class="puntos__nombre" data-color-nombre>${esc(varDe(p, vid).nombre)}</span></div>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  izq: ' data-animate="izq" style="opacity:0;transform:translateX(-48px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', talle = '', colores = [] } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const v = varPorColor(p, colores);
  const etq = p.etiqueta ? `<span class="prod__etq">${esc(p.etiqueta)}</span>` : '';
  return `<article class="prod" data-id="${esc(p.id)}" data-v="${esc(v.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(v.img)}" alt="${esc(altDe(p, v))}" width="960" height="1200" decoding="async"></button>${etq}${puntosHTML(p, v.id)}</div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__precio">${formatearPrecio(p.precio)}</p>
    <div class="prod-actions">${talleSelectHTML(p, talleValido(p, talle))}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function elegirColorCard(card, vid) {
  const p = card && getProducto(card.dataset.id);
  if (!p) return;
  const v = varDe(p, vid);
  card.dataset.v = v.id;
  card.querySelectorAll('[data-color]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.color === v.id)));
  const nom = card.querySelector('[data-color-nombre]');
  if (nom) nom.textContent = v.nombre;
  const img = card.querySelector('.prod__img');
  if (img && img.getAttribute('src') !== v.img) {
    const cambiar = () => { img.src = v.img; img.alt = altDe(p, v); img.classList.remove('cambiando'); };
    if (reduceMotion) cambiar();
    else {
      const pre = new window.Image();
      pre.src = v.img;
      img.classList.add('cambiando');
      const listo = () => setTimeout(cambiar, 140);
      if (pre.complete) listo(); else { pre.onload = listo; pre.onerror = listo; }
    }
  }
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
    return p ? `• ${i.qty} × ${p.nombre} (${detalleLinea(p, i)}) — ${formatearPrecio(p.precio * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o el envío?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const v = varDe(p, i.v);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(v.img)}" alt="" width="960" height="1200">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><span class="punto punto--sm" style="background:${fondoPunto(v)}"></span>${esc(detalleLinea(p, i))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-k="${k}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${k}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(p.precio * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${k}" aria-label="Quitar ${esc(p.nombre)}, ${esc(detalleLinea(p, i))}">${ICO.x}</button>
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
    if (p) showToast(`Sacaste «${p.nombre}» (${detalleLinea(p, it)}) del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, t, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, t, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${varDe(p, v).nombre}, talle ${t}) al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function pedirTalle(sel) {
  showToast('Elegí tu talle para sumarla al carrito');
  if (!sel) return;
  sel.classList.remove('falta'); void sel.offsetWidth; sel.classList.add('falta');
  sel.focus({ preventScroll: true });
  setTimeout(() => sel.classList.remove('falta'), 1800);
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const col = e.target.closest('.prod [data-color]');
    if (col) { elegirColorCard(col.closest('.prod'), col.dataset.color); return; }
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
      const n = sumar(id, card?.dataset.v, t, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      const card = qv.closest('.prod');
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: card?.dataset.v, t: card?.querySelector('[data-talle-sel]')?.value });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p, v, t) {
  const rel = relacionados(p);
  const mini = p.variantes.length > 1 ? `<div class="qv__minis" role="group" aria-label="Fotos por color">${p.variantes.map(x => `<button type="button" class="qv__mini" data-qv-color="${esc(x.id)}" aria-pressed="${x.id === v.id}" aria-label="Ver en ${esc(x.nombre)}"><img src="${esc(x.img)}" alt="" width="960" height="1200"></button>`).join('')}</div>` : '';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(v.img)}" alt="${esc(altDe(p, v))}" width="960" height="1200"></figure>
    ${mini}
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(catDe(p.cat).nombre)}${p.etiqueta ? `<span class="prod__etq prod__etq--qv">${esc(p.etiqueta)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__precio">${formatearPrecio(p.precio)}</p>
    ${p.incluye ? `<p class="qv__incluye"><b>Incluye:</b> ${esc(p.incluye)}</p>` : ''}
    <div class="qv__bloque">
      <p class="qv__label">Color: <b data-qv-color-nombre>${esc(v.nombre)}</b></p>
      <div class="qv__colores" role="group" aria-label="Color">${p.variantes.map(x => `<button type="button" class="qv__color" data-qv-color="${esc(x.id)}" aria-pressed="${x.id === v.id}"><span class="punto" style="background:${fondoPunto(x)}"></span><span>${esc(x.nombre)}</span></button>`).join('')}</div>
    </div>
    <div class="qv__bloque">
      <p class="qv__label">Talle <a class="qv__guia" href="${HOME_URL}#talles">${ICO.regla}¿Qué talle soy?</a></p>
      <div class="qv__talles" role="group" aria-label="Talle">${TALLES.map(x => {
        const hay = p.talles.includes(x);
        return `<button type="button" class="qv__talle" data-qv-talle="${x}" aria-pressed="${x === t}"${hay ? '' : ' disabled aria-label="Talle ' + x + ', sin stock"'}>${x}</button>`;
      }).join('')}</div>
      <p class="qv__aviso" data-qv-aviso hidden>Elegí tu talle para seguir.</p>
    </div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.variantes[0].img)}" alt="" width="960" height="1200"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null, t = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const vv = varDe(p, v);
  const tt = talleValido(p, t);
  qvEstado = { id: p.id, v: vv.id, t: tt };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, vv, tt);
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
    const col = e.target.closest('[data-qv-color]');
    if (col) {
      const v = varDe(p, col.dataset.qvColor);
      qvEstado.v = v.id;
      cont.querySelectorAll('[data-qv-color]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvColor === v.id)));
      const img = cont.querySelector('[data-qv-img]');
      img.src = v.img; img.alt = altDe(p, v);
      cont.querySelector('[data-qv-color-nombre]').textContent = v.nombre;
      return;
    }
    const tal = e.target.closest('[data-qv-talle]');
    if (tal && !tal.disabled) {
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
        const aviso = cont.querySelector('[data-qv-aviso]');
        aviso.hidden = false;
        cont.querySelector('[data-qv-talle]:not([disabled])')?.focus();
        return;
      }
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, qvEstado.v, qvEstado.t, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${varDe(p, qvEstado.v).nombre}, talle ${qvEstado.t}) al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.variantes[0].img, location.href).href, category: catDe(p.cat).nombre, color: p.variantes.map(v => v.nombre).join(', '), size: p.talles.join(', '),
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
  const otros = ['talle', 'color', 'precio', 'q'].some(k => params.get(k));
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

function initGridHome() {
  const grid = document.querySelector('[data-grid-home]');
  if (!grid) return;
  const vacio = document.querySelector('[data-grid-vacio]');
  const verTodo = document.querySelector('[data-ver-todo]');
  const chips = [...document.querySelectorAll('[data-talle-chip], [data-talle-chip2]')];
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const estado = { talle: '', cat: '' };
  let primera = true;
  const render = () => {
    const filtros = {};
    if (estado.talle) filtros.talle = estado.talle;
    if (estado.cat) filtros.cat = estado.cat;
    else filtros.excluir = Tienda.consultar({ filtros: { cat: 'conjuntos' }, limite: 100 }).items.map(p => p.id);
    const items = Tienda.consultar({ filtros, limite: 8 }).items;
    grid.innerHTML = items.map(p => cardHTML(p, { anim: 'subir', talle: estado.talle })).join('');
    vacio.hidden = items.length > 0;
    const q = new URLSearchParams();
    if (estado.cat) q.set('cat', estado.cat);
    if (estado.talle) q.set('talle', estado.talle);
    verTodo.href = CATALOGO_URL + (q.toString() ? `?${q}` : '');
    verTodo.firstChild.textContent = estado.talle ? `Ver todo en talle ${estado.talle} ` : 'Ver todo el catálogo ';
    if (!primera) { revelarNuevos(grid); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
    primera = false;
  };
  chips.forEach(ch => ch.addEventListener('click', () => {
    const t = ch.dataset.talleChip || ch.dataset.talleChip2;
    estado.talle = estado.talle === t ? '' : t;
    chips.forEach(x => x.setAttribute('aria-pressed', String((x.dataset.talleChip || x.dataset.talleChip2) === estado.talle)));
    render();
    if (ch.dataset.talleChip) document.getElementById('coleccion')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  tabs.forEach(tb => tb.addEventListener('click', () => {
    estado.cat = tb.dataset.tab;
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === tb)));
    render();
  }));
  render();
}

function conjuntoHTML(p, i) {
  const v = p.variantes[0];
  const lado = i % 2 ? 'der' : 'izq';
  return `<article class="prod prod--conjunto" data-id="${esc(p.id)}" data-v="${esc(v.id)}"${ANIMS[lado]}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(v.img)}" alt="${esc(altDe(p, v))}" width="960" height="1200" decoding="async"></button></div>
  <div class="prod__info">
    <p class="conj__n">0${i + 1}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="conj__incluye">${esc(p.incluye || '')}</p>
    <p class="prod__precio">${formatearPrecio(p.precio)}</p>
    <p class="conj__talles">Talles ${esc(p.talles.join(' · '))}</p>
    <div class="prod-actions">${talleSelectHTML(p)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function initConjuntos() {
  const cont = document.querySelector('[data-conjuntos]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ filtros: { cat: 'conjuntos' }, limite: 3 }).items.map(conjuntoHTML).join('');
}

function talleSugerido(cintura, cadera, calce = 'cuerpo') {
  const idx = (medida, k) => {
    const i = GUIA.findIndex(g => medida <= g[k][1]);
    return i < 0 ? GUIA.length - 1 : i;
  };
  let i = Math.max(idx(cintura, 'cintura'), idx(cadera, 'cadera'));
  if (calce === 'suelta') i = Math.min(i + 1, GUIA.length - 1);
  const g = GUIA[i];
  const fuera = cintura > GUIA[GUIA.length - 1].cintura[1] || cadera > GUIA[GUIA.length - 1].cadera[1];
  return { talle: g.t, fuera };
}

function initTalles() {
  document.querySelectorAll('[data-talles]').forEach(box => {
    const cat = box.dataset.cat || CATALOGO_URL;
    const ranges = [...box.querySelectorAll('[data-medida]')];
    const res = box.querySelector('[data-talle-res]');
    const nota = box.querySelector('[data-talle-nota]');
    const link = box.querySelector('[data-talle-link]');
    const txt = box.querySelector('[data-talle-txt]');
    const wsp = box.querySelector('[data-talle-wsp]');
    let previo = '';
    const calcular = () => {
      const m = Object.fromEntries(ranges.map(r => [r.dataset.medida, Number(r.value)]));
      ranges.forEach(r => {
        const out = box.querySelector(`[data-out="${r.dataset.medida}"]`);
        if (out) out.textContent = `${r.value} cm`;
        const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
        r.style.setProperty('--pct', `${pct}%`);
      });
      const calce = box.querySelector('input[type="radio"]:checked')?.value || 'cuerpo';
      const { talle, fuera } = talleSugerido(m.cintura, m.cadera, calce);
      res.textContent = talle;
      txt.textContent = talle;
      link.href = `${cat}?talle=${talle}`;
      nota.textContent = fuera
        ? `Tus medidas pasan nuestra tabla: te sugerimos ${talle} y que nos escribas para confirmarlo.`
        : calce === 'suelta'
          ? `Para que te quede más suelta, te sugerimos el talle ${talle}.`
          : `Con esas medidas, la calza y el top te quedan al cuerpo en talle ${talle}.`;
      wsp.href = wspHref(`Hola! Quiero consultar mi talle en ${MARCA}. Tengo ${m.cintura} cm de cintura y ${m.cadera} cm de cadera, y me gusta ${calce === 'suelta' ? 'más suelta' : 'al cuerpo'}. La web me sugiere talle ${talle}.`);
      box.querySelectorAll('[data-fila]').forEach(tr => tr.classList.toggle('activa', tr.dataset.fila === talle));
      if (previo && previo !== talle && !reduceMotion) { res.classList.remove('cambia'); void res.offsetWidth; res.classList.add('cambia'); }
      previo = talle;
    };
    box.addEventListener('input', calcular);
    box.addEventListener('change', calcular);
    calcular();
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const lat = Number(el.dataset.lat), lng = Number(el.dataset.lng);
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true, dragging: !window.matchMedia('(hover: none)').matches, tap: false });
    mapa.setView([lat, lng], 15);
    mapa.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle([lat, lng], { radius: 420, color: '#5B4B9A', weight: 1, fillColor: '#C9BCE6', fillOpacity: 0.35 }).addTo(mapa);
    const icono = L.divIcon({ className: 'mapa__pin', html: '<span></span>', iconSize: [28, 28], iconAnchor: [14, 14] });
    L.marker([lat, lng], { icon: icono, keyboard: false, title: 'Kahlosport, La Plata centro' }).addTo(mapa);
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { mapa.invalidateSize(); io.disconnect(); } });
    io.observe(el);
  } catch { el.classList.add('mapa__lienzo--error'); }
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
  const TALLES_L = TALLES.map(t => ({ id: t, nombre: t }));
  const GRUPOS = { cat: CATEGORIAS, talle: TALLES_L, color: COLORES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    talle: valida((params.get('talle') || '').toUpperCase(), TALLES_L),
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
  const opcion = (grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  const opTalle = (item, marcado, n) => `<label class="op-talle${n ? '' : ' is-cero'}"><input type="checkbox" data-f="talle" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span></label>`;
  const opColor = (item, marcado, n) => `<label class="op-color${n ? '' : ' is-cero'}"><input type="checkbox" data-f="color" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span class="punto" style="background:${item.hex}"></span><span class="op-color__n">${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cat]').innerHTML = CATEGORIAS.map(it => opcion('cat', it, e.cat.includes(it.id), Tienda.contar({ ...filtros('cat'), cat: it.id }))).join('');
    panel.querySelector('[data-f-talle]').innerHTML = TALLES_L.map(it => opTalle(it, e.talle.includes(it.id), Tienda.contar({ ...filtros('talle'), talle: it.id }))).join('');
    panel.querySelector('[data-f-color]').innerHTML = COLORES.map(it => ({ it, n: Tienda.contar({ ...filtros('color'), color: it.id }) })).filter(x => x.n || e.color.includes(x.it.id)).map(x => opColor(x.it, e.color.includes(x.it.id), x.n)).join('');
    panel.querySelector('[data-f-precio]').innerHTML = PRECIOS.map(it => opcion('precio', it, e.precio.includes(it.id), Tienda.contar({ ...filtros('precio'), precio: it.id }))).join('');
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return nombreDe(CATEGORIAS, e.cat[0]);
    if (solo('talle')) return `Talle ${e.talle[0]}`;
    if (solo('color')) return `En ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const nom = (k, id) => k === 'talle' ? `Talle ${id}` : nombreDe(GRUPOS[k], id);
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nom(k, id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Toda la colección';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, ropa deportiva femenina`;
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
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir', talle, colores: e.color })).join(''));
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
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('estela-lista'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero__pieza, .arco, .circulo', { y: 36, duration: 1.4, stagger: 0.12 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('.hero__raya', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, clearProps: 'transform' }, 0.5);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  tl.add(() => hero.classList.add('estela-lista'), 0.45);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero__datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72);
  desde('.hero-badge', { y: 18, scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.68);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__fondo-wm, .estela--hero').forEach(el => {
    gsap.to(el, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

initRail();
initGridHome();
initConjuntos();
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
initTalles();
initFloats();
initModelBarScroll();
initProductoUrl();
Cart.sync();
updateCartBadge();
window.addEventListener('load', initMapa);
