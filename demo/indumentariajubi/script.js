const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491125006565';
const MARCA = 'Indumentaria_jubi';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
const DESKTOP = '(min-width: 1101px)';

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
  { id: 'urbana', nombre: 'Urbana', genero: 'mujer', bajada: 'Jeans y remeras', img: 'images/p-jean.webp',
    texto: 'Jeans y remeras para el día a día: lo que te ponés sin pensarlo y combina con todo.',
    subs: [{ id: 'jeans', nombre: 'Jeans' }, { id: 'remeras', nombre: 'Remeras' }] },
  { id: 'formal', nombre: 'Formal', genero: 'mujer', bajada: 'Sastrería y pantalones', img: 'images/p-pantalon.webp',
    texto: 'Sastrería y pantalones de vestir para la oficina, una reunión o un almuerzo elegante.',
    subs: [{ id: 'sastreria', nombre: 'Sastrería' }, { id: 'pantalones', nombre: 'Pantalones' }] },
  { id: 'fiesta', nombre: 'Fiesta', genero: 'mujer', bajada: 'Vestidos y blusas', img: 'images/p-vestido-negro.webp',
    texto: 'Vestidos y blusas para casamientos, cumpleaños y cenas: del cóctel al vestido largo.',
    subs: [{ id: 'vestidos', nombre: 'Vestidos' }, { id: 'blusas', nombre: 'Blusas' }] },
  { id: 'hombre', nombre: 'Hombre', genero: 'hombre', bajada: 'Camisas y buzos', img: 'images/p-camisa.webp',
    texto: 'Camisas y buzos de hombre, de S a XXL. Pocas prendas, elegidas una por una.',
    subs: [{ id: 'camisas', nombre: 'Camisas' }, { id: 'buzos', nombre: 'Buzos' }] },
];
const GENEROS = [
  { id: 'mujer', nombre: 'Mujer', texto: 'Urbana, formal y de fiesta: toda la ropa de mujer de la tienda.' },
  { id: 'hombre', nombre: 'Hombre', texto: 'Camisas y buzos de hombre, de S a XXL. Pocas prendas, elegidas una por una.' },
];
const OCASIONES = [
  { id: 'diario', nombre: 'Día a día', que: 'Jean, remera y algo cómodo arriba',
    texto: 'Sin reglas: lo que te deja moverte toda la jornada y combina con todo.',
    dia: 'De día, una remera blanca va con todo y no falla.', noche: 'De noche, cambiá la remera por una blusa y el mismo jean ya es otro look.' },
  { id: 'oficina', nombre: 'Oficina', que: 'Pantalón de vestir con camisa o blusa lisa',
    texto: 'Prolijo y cómodo para muchas horas, sin parecer de fiesta.',
    dia: 'Colores neutros: beige, negro, blanco o azul.', noche: 'Para un after office, sumá la blusa de satén y listo.' },
  { id: 'elegante-sport', nombre: 'Elegante sport', que: 'Un escalón arriba del jean',
    texto: 'Pantalón sastrero, blazer o una blusa linda. Nada de jean gastado ni zapatillas de correr.',
    dia: 'De día van bien el beige y los tonos claros.', noche: 'De noche, negro con un toque de color: el bordó, por ejemplo.' },
  { id: 'coctel', nombre: 'Cóctel', que: 'Vestido corto o midi, o pantalón con blusa de fiesta',
    texto: 'Más arreglado que el elegante sport, sin llegar al vestido largo.',
    dia: 'De día, telas livianas y colores más claros.', noche: 'De noche, negro, bordó o champagne, y telas con brillo como el satén.' },
  { id: 'gala', nombre: 'De gala', que: 'Vestido largo',
    texto: 'Es el dress code más formal: telas con caída, como el satén, y accesorios mínimos.',
    dia: 'Si la fiesta es de día, elegí un largo en tono claro, como el champagne.', noche: 'De noche, el largo en champagne o en negro es la apuesta segura.' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro' }, { id: 'blanco', nombre: 'Blanco' }, { id: 'azul', nombre: 'Azul' }, { id: 'beige', nombre: 'Beige' },
  { id: 'bordo', nombre: 'Bordó' }, { id: 'champagne', nombre: 'Champagne' }, { id: 'gris', nombre: 'Gris' },
];
const TALLES = ['S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44', '46'];
const PRECIOS = [
  { id: 'hasta40', nombre: 'Hasta $40.000', min: null, max: 40000 },
  { id: '40a90', nombre: '$40.000 a $90.000', min: 40001, max: 90000 },
  { id: 'mas90', nombre: 'Más de $90.000', min: 90001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  urbana: 'urbana urbano casual diario', formal: 'formal oficina trabajo vestir', fiesta: 'fiesta noche evento casamiento cumpleanos', hombre: 'hombre caballero masculino',
  mujer: 'mujer dama femenino femenina',
  jeans: 'jean jeans denim vaquero pantalon', remeras: 'remera remeras basica top', sastreria: 'sastreria blazer saco traje conjunto', pantalones: 'pantalon pantalones vestir',
  vestidos: 'vestido vestidos', blusas: 'blusa blusas camisa saten', camisas: 'camisa camisas', buzos: 'buzo buzos frisa sweater',
  diario: 'dia a dia diario', oficina: 'oficina trabajo', 'elegante-sport': 'elegante sport', coctel: 'coctel', gala: 'gala etiqueta largo',
  negro: 'negro negra', blanco: 'blanco blanca', azul: 'azul marino', beige: 'beige arena crudo', bordo: 'bordo bordeaux vino', champagne: 'champagne dorado', gris: 'gris melange',
};
const T_MUJER = { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] };
const T_NUM = { tipo: 'Talle', ops: ['36', '38', '40', '42', '44', '46'] };
const T_HOMBRE = { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL', 'XXL'] };

const Tienda = crearTienda([
  { id: 'vestido-midi-drapeado-negro', nombre: 'Vestido Midi Drapeado Negro', cat: 'fiesta', sub: 'vestidos', genero: 'mujer', ocasion: ['coctel', 'elegante-sport', 'gala'], color: 'negro', precio: 89900, descuento: 0, stock: 6, alta: 30, rango: 1, tag: 'Nuevo',
    var: T_MUJER, img: 'images/p-vestido-negro.webp', escena: 'images/vestido-alto.webp',
    alt: 'Vestido negro midi sin mangas, con escote barco y drapeado a un costado de la cintura', desc: 'Escote barco, sin mangas y un drapeado que nace en la cintura y cae hacia un costado. Largo midi, tela con caída que no se marca.' },
  { id: 'conjunto-sastrero-beige', nombre: 'Conjunto Sastrero Beige', cat: 'formal', sub: 'sastreria', genero: 'mujer', ocasion: ['oficina', 'elegante-sport'], color: 'beige', precio: 129900, descuento: 0, stock: 5, alta: 29, rango: 2,
    var: T_MUJER, img: 'images/p-conjunto.webp', escena: 'images/conjunto-ancho.webp',
    alt: 'Conjunto sastrero beige: blazer de un botón y pantalón recto con pinzas', desc: 'Blazer entallado de un botón con solapa y bolsillos con tapa, más pantalón recto con pinzas y raya marcada. Se venden juntos.' },
  { id: 'vestido-largo-saten-champagne', nombre: 'Vestido Largo de Satén Champagne', cat: 'fiesta', sub: 'vestidos', genero: 'mujer', ocasion: ['gala', 'coctel'], color: 'champagne', precio: 119900, descuento: 0, stock: 3, alta: 28, rango: 3,
    var: { tipo: 'Talle', ops: ['S', 'M', 'L'] }, img: 'images/p-vestido-champagne.webp', escena: null,
    alt: 'Vestido largo de satén color champagne con breteles finos y escote drapeado', desc: 'Satén con brillo suave, breteles finos y escote drapeado. Cae al cuerpo y llega al piso: para un casamiento o una fiesta de gala.' },
  { id: 'blusa-saten-bordo', nombre: 'Blusa de Satén Bordó Cuello Drapeado', cat: 'fiesta', sub: 'blusas', genero: 'mujer', ocasion: ['coctel', 'elegante-sport', 'oficina'], color: 'bordo', precio: 46900, descuento: 0, stock: 8, alta: 27, rango: 4,
    var: T_MUJER, img: 'images/p-blusa.webp', escena: null,
    alt: 'Blusa de satén bordó con cuello drapeado y mangas abullonadas con puño', desc: 'Cuello drapeado, mangas abullonadas con puño y frunce en la cintura. Con pantalón sastrero sale de la oficina directo a la cena.' },
  { id: 'jean-recto-tiro-alto', nombre: 'Jean Recto Tiro Alto Azul Clásico', cat: 'urbana', sub: 'jeans', genero: 'mujer', ocasion: ['diario'], color: 'azul', precio: 49900, descuento: 0, stock: 12, alta: 26, rango: 5,
    var: T_NUM, img: 'images/p-jean.webp', escena: null,
    alt: 'Jean de mujer azul clásico de tiro alto y pierna recta', desc: 'Denim azul clásico de tiro alto y pierna recta, con cinco bolsillos. Largo al tobillo: va con zapatillas, botas o sandalias.' },
  { id: 'pantalon-sastrero-negro', nombre: 'Pantalón Sastrero Negro con Pinzas', cat: 'formal', sub: 'pantalones', genero: 'mujer', ocasion: ['oficina', 'elegante-sport', 'coctel'], color: 'negro', precio: 52900, descuento: 0, stock: 9, alta: 25, rango: 6,
    var: T_NUM, img: 'images/p-pantalon.webp', escena: null,
    alt: 'Pantalón sastrero negro de tiro alto, con pinzas y pierna ancha', desc: 'Tiro alto, pinzas al frente y pierna ancha con caída. El pantalón que se usa con blazer, con blusa de satén o con una remera.' },
  { id: 'camisa-azul-marino', nombre: 'Camisa Azul Marino Manga Larga', cat: 'hombre', sub: 'camisas', genero: 'hombre', ocasion: ['oficina', 'elegante-sport'], color: 'azul', precio: 44900, descuento: 0, stock: 10, alta: 24, rango: 7,
    var: T_HOMBRE, img: 'images/p-camisa.webp', escena: null,
    alt: 'Camisa de hombre azul marino de manga larga con botones blancos', desc: 'Manga larga con puño abotonado, cuello clásico y botones blancos. Va con jean o con pantalón de vestir.' },
  { id: 'remera-basica-blanca', nombre: 'Remera Básica de Algodón Blanca', cat: 'urbana', sub: 'remeras', genero: 'mujer', ocasion: ['diario'], color: 'blanco', precio: 18900, descuento: 10, stock: 20, alta: 23, rango: 8,
    var: T_MUJER, img: 'images/p-remera.webp', escena: null,
    alt: 'Remera blanca básica de algodón con cuello redondo y manga corta', desc: 'Algodón con cuello redondo y manga corta. La base de todo: debajo de un blazer, con jean o con el pantalón sastrero.' },
  { id: 'buzo-frisa-gris', nombre: 'Buzo de Frisa Gris Melange', cat: 'hombre', sub: 'buzos', genero: 'hombre', ocasion: ['diario'], color: 'gris', precio: 39900, descuento: 0, stock: 11, alta: 22, rango: 9,
    var: T_HOMBRE, img: 'images/p-buzo.webp', escena: null,
    alt: 'Buzo de hombre gris melange de frisa con cuello redondo', desc: 'Frisa gris melange con cuello redondo, puños y cintura de rib. Abriga sin pesar, para el día a día.' },

  { id: 'blazer-negro-proximo', nombre: 'Blazer Negro', cat: 'formal', sub: 'sastreria', genero: 'mujer', ocasion: ['oficina'], color: 'negro', precio: 98900, descuento: 0, stock: 0, alta: 31, visible: false,
    var: T_MUJER, img: 'images/p-conjunto.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, p.genero, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ETIQUETAS[p.genero] || '', ETIQUETAS[p.color] || '',
    ...(p.ocasion || []).map(o => ETIQUETAS[o] || o), ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), genero = lista(f.genero), ocasion = lista(f.ocasion), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (genero.length && !genero.includes(p.genero)) return false;
    if (ocasion.length && !(p.ocasion || []).some(o => ocasion.includes(o))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !(p.var?.ops || []).some(t => talle.includes(t))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
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
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {}, ocasiones = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.var?.ops || []).forEach(t => { talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
      (p.ocasion || []).forEach(o => { ocasiones[o] = (ocasiones[o] || 0) + 1; });
    });
    return { talles, colores, ocasiones };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const tipoVar = p => p.var?.tipo || 'Talle';
const varTxt = (p, op) => `${tipoVar(p).toLowerCase()} ${op}`;

const Cart = {
  KEY: 'indumentariajubi_cart',
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
  KEY: 'indumentariajubi_favs',
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
  percha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.6L3.4 15.2a1.4 1.4 0 0 0 .8 2.5h15.6a1.4 1.4 0 0 0 .8-2.5L12 9.1"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${subDe(p)?.nombre || ''} · ${nombreDe(CATEGORIAS, p.cat)}`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 5) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
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
function tallesHTML(p) {
  if (!p.var) return '';
  const ops = p.var.ops;
  const vista = ops.length > 5 ? [ops[0], '…', ops[ops.length - 1]] : ops;
  return `<span class="prod__talles" aria-hidden="true">${vista.map(t => `<span>${esc(t)}</span>`).join('')}</span>`;
}

function cardHTML(p, { compacta = false, grande = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const foto = `<a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    const accion = conVar(p)
      ? `<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir talle y agregar: ${nombre}">${ICON.carritoMas}</button>`
      : `<button type="button" class="prod-mini" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}">
      ${media}
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}${accion}</div>
      </div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">Talle de ${nombre}</span><select data-op><option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      ${precioHTML(p)}
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
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
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
  const desktopMq = window.matchMedia(DESKTOP);
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
  const hoverMq = window.matchMedia(`(hover: hover) and ${DESKTOP}`);
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
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-ocasiones"><p class="cats-ocasiones__tit">Por dress code</p>${OCASIONES.map(o => `<a href="${CATALOGO_URL}?ocasion=${o.id}">${esc(o.nombre)} <span class="cats-item__n">${Tienda.contar({ ocasion: o.id })}</span></a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-mujer" href="${CATALOGO_URL}?genero=mujer">Todo mujer <span class="cats-item__n">${Tienda.contar({ genero: 'mujer' })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
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
  if (PAGINA === 'catalogo' && catActual) {
    document.querySelectorAll('.main-nav > a').forEach(a => {
      if (new URL(a.href, location.href).searchParams.get('cat') === catActual) a.setAttribute('aria-current', 'page');
    });
  }
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
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
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero__foto, .puerta'), { y: 56, opacity: 0, duration: 1.2, stagger: 0.12, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 44, opacity: 0, filter: 'blur(10px)', duration: 1.1, clearProps: 'filter' }, 0.22)
    .from(hero.querySelectorAll('.raya'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, clearProps: 'transform' }, 0.45)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function pintarPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const [k, v] = el.dataset.catN.split(':');
    const n = Tienda.contar(v ? { [k]: v } : { cat: k });
    el.textContent = `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
  });
  const bento = document.getElementById('bentoNuevos');
  if (bento) {
    bento.innerHTML = Tienda.consultar({ orden: 'nuevos', limite: 8 }).items
      .map((p, i) => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p, { compacta: true, grande: i === 0 })}</li>`).join('')
      + `<li data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="vitrina__todo"><p>Toda la tienda, con filtros por talle y dress code</p><a class="btn btn--cta btn--chico" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div></li>`;
  }
}

function initRail() {
  const box = document.querySelector('[data-rail]');
  if (!box) return;
  const vp = box.querySelector('.rail-vp');
  const track = box.querySelector('.rail-track');
  const prev = box.querySelector('[data-rail-prev]');
  const next = box.querySelector('[data-rail-next]');
  if (!vp || !track) return;
  track.innerHTML = Tienda.consultar({ orden: 'nuevos', limite: 8 }).items
    .map(p => `<li class="rail-item"><div class="rail-item__in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p)}</div></li>`).join('');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 20;
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('select')) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    vp.classList.remove('dragging');
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

function initLooks() {
  const box = document.getElementById('looks');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  if (!tabs.length) return;
  const elegir = (t, foco) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) t.focus();
    revelarNuevos(document.getElementById(t.getAttribute('aria-controls')));
    refrescarTriggers();
  };
  tabs.forEach(t => t.addEventListener('click', () => elegir(t)));
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (j === null) return;
    e.preventDefault();
    elegir(tabs[j], true);
  });
}

function initDressCode() {
  const box = document.getElementById('dresscode');
  if (!box) return;
  const ocs = [...box.querySelectorAll('[data-dc]')];
  const momentos = [...box.querySelectorAll('[data-dc-momento]')];
  const codigo = document.getElementById('dcCodigo');
  const titulo = document.getElementById('dcTitulo');
  const texto = document.getElementById('dcTexto');
  const tip = document.getElementById('dcTip');
  const prendas = document.getElementById('dcPrendas');
  const ver = document.getElementById('dcVer');
  const wsp = document.getElementById('dcWsp');
  if (!ocs.length || !prendas) return;
  const PREFIERE = { noche: ['negro', 'bordo', 'champagne', 'azul'], dia: ['beige', 'blanco', 'champagne', 'azul', 'gris'] };
  let oc = 'coctel', mom = 'dia';
  const pintar = () => {
    const o = OCASIONES.find(x => x.id === oc) || OCASIONES[0];
    ocs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dc === o.id)));
    momentos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dcMomento === mom)));
    box.classList.toggle('is-noche', mom === 'noche');
    const cuando = mom === 'noche' ? 'de noche' : 'de día';
    codigo.textContent = `${o.nombre} · ${cuando}`;
    titulo.textContent = o.que;
    texto.textContent = o.texto;
    tip.textContent = o[mom];
    const va = p => (PREFIERE[mom].includes(p.color) ? 1 : 0);
    const items = Tienda.consultar({ filtros: { ocasion: o.id }, orden: 'destacados', limite: 8 }).items
      .sort((a, b) => va(b) - va(a))
      .slice(0, 3);
    prendas.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(24px)">
      <a class="dc-prenda" href="${urlProducto(p)}" data-qv="${p.id}">
        <span class="dc-prenda__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="400" height="400" decoding="async"></span>
        <span class="dc-prenda__nombre">${esc(p.nombre)}</span>
        <span class="dc-prenda__precio">${formatearPrecio(precioFinal(p))}</span>
      </a></li>`).join('');
    const n = Tienda.contar({ ocasion: o.id });
    ver.href = `${CATALOGO_URL}?ocasion=${o.id}`;
    ver.querySelector('span').textContent = `Ver las ${n} prendas para ${o.nombre.toLowerCase()}`;
    wsp.href = wspHref(`Hola ${MARCA}! Tengo un evento con dress code ${o.nombre.toLowerCase()} ${cuando}. ¿Qué me recomiendan?`);
    revelarNuevos(prendas);
  };
  ocs.forEach(b => b.addEventListener('click', () => { oc = b.dataset.dc; pintar(); }));
  momentos.forEach(b => b.addEventListener('click', () => { mom = b.dataset.dcMomento; pintar(); }));
  pintar();
}

const MEDIDAS = {
  letras: { cols: ['Talle', 'Busto', 'Cintura', 'Cadera'], filas: [['S', '84-88', '66-70', '92-96'], ['M', '89-93', '71-75', '97-101'], ['L', '94-98', '76-80', '102-106'], ['XL', '99-104', '81-86', '107-112']] },
  numeros: { cols: ['Talle', 'Cintura', 'Cadera'], filas: [['36', '66', '92'], ['38', '70', '96'], ['40', '74', '100'], ['42', '78', '104'], ['44', '82', '108'], ['46', '86', '112']] },
  hombre: { cols: ['Talle', 'Pecho', 'Cintura'], filas: [['S', '92-96', '78-82'], ['M', '97-101', '83-87'], ['L', '102-106', '88-92'], ['XL', '107-112', '93-98'], ['XXL', '113-118', '99-104']] },
};
function tablaTalles(p) {
  const t = p.genero === 'hombre' ? MEDIDAS.hombre : (p.var?.ops || []).includes('36') ? MEDIDAS.numeros : MEDIDAS.letras;
  return `<details class="qv__tabla"><summary>Ver tabla de talles</summary>
    <table><thead><tr>${t.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>
    <tbody>${t.filas.filter(f => (p.var?.ops || []).includes(f[0])).map(f => `<tr>${f.map((v, k) => (k ? `<td>${v}</td>` : `<th scope="row">${v}</th>`)).join('')}</tr>`).join('')}</tbody></table>
    <p>Medidas del cuerpo en centímetros, orientativas. Si estás entre dos talles, elegí el más grande o escribinos.</p></details>`;
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto].src;
  const forma = actual.includes('alto') ? ' qv__principal--alta' : actual.includes('ancho') ? ' qv__principal--ancha' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || '')}${sub ? ' · ' : ''}${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__dato"><span>Dress code</span>${(p.ocasion || []).map(o => esc(nombreDe(OCASIONES, o).toLowerCase())).join(' · ')}</p>
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
          ${tablaTalles(p)}
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar talle por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : ''; QV.foto = 0;
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
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (${varTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''} al carrito.`);
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
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
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
    items.innerHTML = `<div class="drawer__vacio">${ICON.percha}<p>Tu carrito está vacío. Hay jeans, sastrería y vestidos de fiesta esperando tu talle.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
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
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
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
      showToast(`Sumaste ${p.nombre}${op ? ` (${varTxt(p, op)})` : ''} al carrito.`);
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
      Cart.add(p, 1, op);
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
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), genero: valido(params.get('genero'), GENEROS), sub: [], ocasion: multi('ocasion', OCASIONES),
    color: multi('color', COLORES), talle: multi('talle', TALLES), precio: valido(params.get('precio'), PRECIOS),
    oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  if (e.cat) e.genero = '';
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];
  const tallesDe = () => {
    const base = e.cat ? { cat: e.cat } : e.genero ? { genero: e.genero } : null;
    if (!base) return [];
    const f = Tienda.facetas(base);
    return TALLES.filter(t => f.talles[t]);
  };
  const compatibles = () => {
    if (!e.cat) e.sub = [];
    const ok = tallesDe();
    e.talle = e.talle.filter(t => ok.includes(t));
  };
  compatibles();

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.genero) f.genero = e.genero;
    if (e.sub.length) f.sub = e.sub;
    if (e.ocasion.length) f.ocasion = e.ocasion;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : e.genero ? { genero: e.genero } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat && !e.genero, Tienda.contar({}), 'cat')}
      ${opcion('radio', 'cat', 'g:mujer', 'Todo mujer', !e.cat && e.genero === 'mujer', Tienda.contar({ genero: 'mujer' }), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    const ocs = OCASIONES.filter(o => fac.ocasiones[o.id]);
    if (ocs.length) grupos.push(`<fieldset class="f-grupo"><legend>Dress code</legend>
      ${ocs.map(o => opcion('checkbox', `ocasion-${o.id}`, o.id, esc(o.nombre), e.ocasion.includes(o.id), fac.ocasiones[o.id], 'ocasion')).join('')}</fieldset>`);
    const talles = TALLES.filter(t => fac.talles[t]);
    if ((e.cat || e.genero) && talles.length) grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend><div class="f-talles">
      ${talles.map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`);
    else grupos.push('<fieldset class="f-grupo"><legend>Talle</legend><p class="f-nota">Elegí una categoría para filtrar por talle.</p></fieldset>');
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span><small>${fac.colores[c.id]}</small></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const gen = !cat ? GENEROS.find(g => g.id === e.genero) : null;
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const oc = !cat && !gen && e.ocasion.length === 1 ? OCASIONES.find(o => o.id === e.ocasion[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : gen ? gen.nombre : oc ? `Dress code: ${oc.nombre.toLowerCase()}` : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.orden === 'nuevos' ? 'Recién llegadas' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : gen ? gen.texto : oc ? `${oc.que}. ${oc.texto}` : e.oferta ? 'Prendas con descuento, mientras haya talle.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Ropa de mujer urbana, formal y de fiesta, y una selección para hombre. Elegís tu talle y lo sumás al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : gen ? gen.nombre : oc ? oc.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : gen ? `${CATALOGO_URL}?genero=${gen.id}` : oc ? `${CATALOGO_URL}?ocasion=${oc.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const nada = !e.cat && !e.genero && !e.oferta;
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${nada ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      `<a class="chip" href="${CATALOGO_URL}?genero=mujer" data-chip-genero="mujer"${!e.cat && e.genero === 'mujer' ? ' aria-current="page"' : ''}>Mujer <small>${Tienda.contar({ genero: 'mujer' })}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat && !e.genero ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.ocasion.forEach(v => quitar.push(['ocasion', v, nombreDe(OCASIONES, v)]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat || e.genero ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'genero', 'sub', 'ocasion', 'color', 'talle', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.genero) u.searchParams.set('genero', e.genero);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.ocasion.length) u.searchParams.set('ocasion', e.ocasion.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.items.length ? res.cursor : null;
    contador.textContent = `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una prenda y aparece acá.'
      : 'No encontramos prendas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = !cursor || mostrados >= total;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') {
      if (inp.value.startsWith('g:')) { e.cat = ''; e.genero = inp.value.slice(2); } else { e.cat = inp.value; e.genero = ''; }
      e.sub = []; e.talle = [];
    } else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
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
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.genero = ''; e.sub = []; e.ocasion = []; e.color = []; e.talle = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta], [data-chip-genero]');
    if (!a) return;
    ev.preventDefault();
    e.sub = []; e.ocasion = []; e.talle = [];
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.genero = ''; e.oferta = true; }
    else if (a.hasAttribute('data-chip-genero')) { e.cat = ''; e.genero = a.dataset.chipGenero; e.oferta = false; }
    else { e.cat = a.dataset.chipCat; e.genero = ''; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-ocasiones a, .cats-todo, .cats-mujer, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.genero = e.cat ? '' : valido(u.searchParams.get('genero'), GENEROS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.ocasion = (u.searchParams.get('ocasion') || '').split(',').filter(v => OCASIONES.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.color = []; e.talle = []; e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
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
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
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

[initCatsMenu, pintarPrecios, initHome, initRail, initDressCode, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initLooks, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
