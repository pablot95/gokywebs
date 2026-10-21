const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const MARCA = 'Pata Club';
const WSP = '5491130548711';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const URL_HOME = MODELO === '2' ? 'modelo-2.html' : './';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_TALLE = 'pataclub_talle';

const CATEGORIAS = [
  { id: 'camas', nombre: 'Camas', bajada: 'Camas nido y rectangulares con almohadón de corderito, en tres tamaños según el largo de tu mascota.', img: 'images/p-cama-rectangular.webp' },
  { id: 'juguetes', nombre: 'Juguetes', bajada: 'Mordillos de cuerda para tironear y un peluche para acompañar la siesta.', img: 'images/p-mordillo-nudos.webp' },
  { id: 'panuelos', nombre: 'Pañuelos', bajada: 'Pañuelos para atar al cuello, en talles S, M y L según el contorno del cuello.', img: 'images/p-panuelo-lunares.webp' },
  { id: 'ropa', nombre: 'Ropa', bajada: 'Buzos, sweaters y chalecos del XS al XL para los días frescos.', img: 'images/p-buzo-polar.webp' },
  { id: 'paseo', nombre: 'Paseo', bajada: 'Arneses acolchados y regulables, del XS al XL según el contorno del pecho.', img: 'images/p-arnes-cintas.webp' },
];
const TALLES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORES = { 'Bordó': '#7E1F3D', Rosa: '#D08C9C', Crema: '#EFE5D4', 'Marrón': '#8A5A3B' };
const RANGOS = {
  hasta15: { nombre: 'Hasta $15.000', max: 15000 },
  '15a35': { nombre: '$15.000 a $35.000', min: 15001, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Más elegidos', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const GUIA_ROPA = [
  ['XS', 28, 36, 20, 26, 'Hasta 3 kg', 'Chihuahua, gatos chicos'],
  ['S', 36, 46, 26, 32, '3 a 7 kg', 'Caniche toy, gatos adultos'],
  ['M', 46, 58, 32, 40, '7 a 14 kg', 'Beagle, Bulldog francés'],
  ['L', 58, 72, 40, 48, '14 a 25 kg', 'Border collie, Cocker'],
  ['XL', 72, 88, 48, 58, '25 a 40 kg', 'Labrador, Golden'],
];
const GUIA_PANUELO = [['S', 32], ['M', 44], ['L', 58]];
const GUIA_CAMA = [['S', 40, '50 × 40 cm o nido de 50 cm'], ['M', 55, '70 × 55 cm o nido de 65 cm'], ['L', 75, '90 × 70 cm o nido de 80 cm']];
const t5 = s => TALLES.map((v, i) => ({ v, stock: s[i] ?? 0 }));
const t3 = s => ['S', 'M', 'L'].map((v, i) => ({ v, stock: s[i] ?? 0 }));

const PRODUCTOS = [
  { id: 'cama-nido', nombre: 'Cama nido redonda', cat: 'camas', tipo: 'tamano', precio: 49900, descuento: 0, colores: ['Rosa', 'Crema'], rango: 1, alta: 10,
    ops: [{ v: 'S', det: '50 cm de diámetro', precio: 49900, stock: 3 }, { v: 'M', det: '65 cm de diámetro', precio: 62900, stock: 4 }, { v: 'L', det: '80 cm de diámetro', precio: 76900, stock: 1 }],
    img: 'images/p-cama-nido.webp', alt: 'Cama redonda de borde alto en tela rosa viejo con almohadón de corderito crema, sobre un piso de madera clara',
    desc: 'Borde alto y acolchado en tela texturada rosa viejo, con almohadón de corderito crema. Para los que duermen hechos un rollito.', tags: ['cama', 'redonda', 'nido', 'rosa', 'corderito', 'almohadon', 'perro', 'gato'] },
  { id: 'panuelo-lunares', nombre: 'Pañuelo de lunares', cat: 'panuelos', tipo: 'talle', precio: 10900, descuento: 0, colores: ['Crema', 'Bordó'], rango: 2, alta: 9, ops: t3([6, 5, 3]),
    img: 'images/p-panuelo-lunares.webp', alt: 'Pañuelo crema con lunares bordó anudado con un moño, junto a una tela bordó y ramitas secas',
    desc: 'Pañuelo triangular crema con lunares bordó que se ata al cuello con un moño. Queda arriba del collar de todos los días.', tags: ['pañuelo', 'bandana', 'lunares', 'crema', 'bordo', 'cuello'] },
  { id: 'arnes-cintas', nombre: 'Arnés acolchado bordó y crema', cat: 'paseo', tipo: 'talle', precio: 32900, descuento: 0, colores: ['Bordó', 'Crema'], rango: 3, alta: 4, ops: t5([2, 4, 5, 3, 2]),
    img: 'images/p-arnes-cintas.webp', alt: 'Arnés acolchado bordó con cintas crema regulables, hebillas doradas y argolla para la correa',
    desc: 'Pechera acolchada bordó con cintas crema regulables en cuello y pecho, hebillas doradas y argolla para enganchar la correa.', tags: ['arnes', 'pechera', 'paseo', 'correa', 'bordo', 'crema'] },
  { id: 'buzo-polar', nombre: 'Buzo polar con capucha', cat: 'ropa', tipo: 'talle', precio: 27900, descuento: 0, colores: ['Crema', 'Bordó'], rango: 4, alta: 8, ops: t5([3, 5, 4, 2, 1]),
    img: 'images/p-buzo-polar.webp', alt: 'Buzo de polar crema con capucha y vivos bordó en los puños, la capucha y el ruedo',
    desc: 'Polar crema con capucha y vivos bordó en puños y ruedo. Abriga sin pesar y se pone por la cabeza.', tags: ['buzo', 'polar', 'capucha', 'abrigo', 'crema', 'ropa'] },
  { id: 'mordillo-nudos', nombre: 'Mordillo de cuerda con nudos', cat: 'juguetes', tipo: 'tamano', precio: 8900, descuento: 0, colores: ['Bordó', 'Rosa', 'Crema'], rango: 5, alta: 7,
    ops: [{ v: 'Chico', det: '25 cm', precio: 8900, stock: 8 }, { v: 'Grande', det: '35 cm', precio: 11900, stock: 5 }],
    img: 'images/p-mordillo-nudos.webp', alt: 'Mordillo de cuerda trenzada bordó, rosa y crema con un nudo grande en cada punta',
    desc: 'Cuerda trenzada en bordó, rosa y crema con un nudo en cada punta. Para tironear, morder y traer.', tags: ['juguete', 'mordillo', 'cuerda', 'soga', 'nudo', 'tironear', 'perro'] },
  { id: 'chaleco-acolchado', nombre: 'Chaleco acolchado rosa', cat: 'ropa', tipo: 'talle', precio: 34900, descuento: 10, colores: ['Rosa', 'Bordó'], rango: 6, alta: 6, ops: t5([1, 3, 3, 2, 1]),
    img: 'images/p-chaleco-acolchado.webp', alt: 'Chaleco acolchado rosa con costuras en rombos, cuello alto y forro bordó',
    desc: 'Acolchado en rombos con cuello alto y forro bordó. Deja las patas delanteras libres para caminar cómodo.', tags: ['chaleco', 'acolchado', 'campera', 'abrigo', 'rosa', 'ropa'] },
  { id: 'cama-rectangular', nombre: 'Cama rectangular bordó', cat: 'camas', tipo: 'tamano', precio: 56900, descuento: 0, colores: ['Bordó', 'Crema'], rango: 7, alta: 5,
    ops: [{ v: 'S', det: '50 × 40 cm', precio: 56900, stock: 2 }, { v: 'M', det: '70 × 55 cm', precio: 71900, stock: 3 }, { v: 'L', det: '90 × 70 cm', precio: 89900, stock: 2 }],
    img: 'images/p-cama-rectangular.webp', alt: 'Cama rectangular bordó con bordes acolchados y base de corderito crema, sobre fondo rosa claro',
    desc: 'Bordes acolchados para apoyar la cabeza y base de corderito crema, en tela bordó de trama marcada. Para los que duermen estirados.', tags: ['cama', 'rectangular', 'bordo', 'corderito', 'colchon', 'perro', 'gato'] },
  { id: 'peluche-osito', nombre: 'Peluche osito con moño', cat: 'juguetes', tipo: 'tamano', precio: 15900, descuento: 0, colores: ['Marrón', 'Bordó'], rango: 8, alta: 3,
    ops: [{ v: 'Único', det: '30 cm de alto', precio: 15900, stock: 4 }],
    img: 'images/p-peluche-osito.webp', alt: 'Osito de peluche marrón con un moño de cinta bordó al cuello, sentado sobre fondo rosa claro',
    desc: 'Osito de peluche suave con moño de cinta bordó. Para acompañar la siesta en la cama.', tags: ['peluche', 'oso', 'osito', 'juguete', 'moño'] },
  { id: 'sweater-trenzado', nombre: 'Sweater trenzado de cuello alto', cat: 'ropa', tipo: 'talle', precio: 29900, descuento: 0, colores: ['Crema'], alta: 12, ops: t5([2, 4, 3, 2, 0]),
    img: 'images/p-sweater-trenzado.webp', alt: 'Sweater tejido color crema con trenzas al frente y cuello alto, doblado sobre fondo rosa claro',
    desc: 'Tejido crema con trenzas al frente y cuello alto doblado. Para las mañanas de frío.', tags: ['sweater', 'tejido', 'trenzado', 'cuello alto', 'crema', 'ropa', 'abrigo'] },
  { id: 'panuelo-rosa', nombre: 'Pañuelo rosa liso', cat: 'panuelos', tipo: 'talle', precio: 9900, descuento: 0, colores: ['Rosa'], alta: 11, ops: t3([5, 0, 4]),
    img: 'images/p-panuelo-rosa.webp', alt: 'Pañuelo rosa viejo liso de tela texturada con costura a la vista, anudado con un moño',
    desc: 'Pañuelo rosa viejo de tela texturada con costura a la vista. Se ata al cuello con un moño.', tags: ['pañuelo', 'bandana', 'rosa', 'liso', 'cuello'] },
  { id: 'arnes-pechera', nombre: 'Arnés pechera bordó', cat: 'paseo', tipo: 'talle', precio: 29900, descuento: 0, colores: ['Bordó'], alta: 2, ops: t5([3, 4, 4, 2, 1]),
    img: 'images/p-arnes-pechera.webp', alt: 'Arnés tipo pechera bordó con forro de red, cuatro hebillas regulables y argolla dorada al frente',
    desc: 'Pechera de tela bordó con forro de red, cuatro puntos para regular y argolla dorada al frente.', tags: ['arnes', 'pechera', 'paseo', 'correa', 'bordo'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const conDescuento = (p, n) => (p.descuento > 0 ? redondear(n * (1 - p.descuento / 100)) : n);
const opDe = (p, v) => p.ops.find(o => o.v === v);
const precioLista = (p, v) => opDe(p, v)?.precio ?? p.precio;
const precioOp = (p, v) => conDescuento(p, precioLista(p, v));
const precioDesde = p => Math.min(...p.ops.map(o => conDescuento(p, o.precio ?? p.precio)));
const variaPrecio = p => new Set(p.ops.map(o => o.precio ?? p.precio)).size > 1;
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const stockDe = (p, v) => opDe(p, v)?.stock || 0;
const unico = p => p.ops.length === 1;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const grupoTalle = p => (p.cat === 'ropa' || p.cat === 'paseo' ? 'ropa' : p.cat === 'panuelos' ? 'panuelo' : p.cat === 'camas' ? 'cama' : '');

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), talles = lista(f.talles), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.excluirCat && p.cat === f.excluirCat) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (talles.length && !p.ops.some(o => talles.includes(o.v) && o.stock > 0)) return false;
    if (colores.length && !p.colores.some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioDesde(p) < f.precioMin) return false;
    if (f.precioMax != null && precioDesde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
      p.nombre, catDe(p.cat)?.nombre, p.desc, ...p.colores, ...p.ops.filter(o => o.stock > 0).map(o => `${o.v} ${o.det || ''}`), ...(p.tags || []),
      p.cat === 'paseo' ? 'arnes pechera correa paseo' : '', p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 3 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const varTexto = (p, v) => {
  const o = opDe(p, v);
  if (!o) return '';
  if (p.tipo === 'talle') return `Talle ${o.v}`;
  if (unico(p)) return o.det || '';
  return o.det ? `${o.v} · ${o.det}` : o.v;
};
const leerTalles = () => { try { const t = JSON.parse(localStorage.getItem(KEY_TALLE)); return t && typeof t === 'object' ? t : {}; } catch { return {}; } };
const guardarTalles = t => { try { localStorage.setItem(KEY_TALLE, JSON.stringify(t)); } catch (e) { void e; } };
const mioPara = p => leerTalles()[grupoTalle(p)] || '';

const Cart = {
  KEY: 'pataclub_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v);
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && opDe(p, i.v) ? s + precioOp(p, i.v) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  compartir: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  const desde = variaPrecio(p);
  const base = desde ? Math.min(...p.ops.map(o => o.precio ?? p.precio)) : p.precio;
  return `<p class="${clase}">${desde ? '<small>desde</small>' : ''}<b>${formatearPrecio(precioDesde(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  return `<span class="swatches" aria-label="Colores: ${esc(p.colores.join(', '))}">${p.colores.map(c => `<i style="--sw:${COLORES[c] || '#ccc'}" title="${esc(c)}"></i>`).join('')}</span>`;
}
function tallesHTML(p) {
  if (unico(p)) return '';
  const mio = mioPara(p);
  const items = p.ops.map(o => {
    const cls = [o.stock > 0 ? (o.stock <= 1 ? 'es-ultimo' : '') : 'es-agotado', o.v === mio ? 'es-mio' : ''].filter(Boolean).join(' ');
    const txt = `${p.tipo === 'talle' ? 'Talle' : 'Tamaño'} ${o.v}${o.stock > 0 ? (o.stock <= 1 ? ', última unidad' : ', con stock') : ', sin stock'}${o.v === mio ? ', el talle de tu mascota' : ''}`;
    return `<li${cls ? ` class="${cls}"` : ''} aria-label="${esc(txt)}">${esc(o.v)}</li>`;
  }).join('');
  return `<ul class="talles" aria-label="${p.tipo === 'talle' ? 'Talles' : 'Tamaños'} disponibles">${items}</ul>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 5) badge = '<span class="pcard__badge">Últimas unidades</span>';
  else if (p.alta >= 11) badge = '<span class="pcard__badge">Nuevo</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(catDe(p.cat)?.nombre)}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    ${tallesHTML(p)}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === sel.cat ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="54" height="54"><span><span class="nav-drop__nombre">${esc(c.nombre)}</span><small>${n} ${n === 1 ? 'producto' : 'productos'}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1101px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const valor = el.dataset.cuenta;
    const n = Tienda.contar(valor === 'todo' ? {} : { cat: valor });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 18;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  const total = Tienda.contar({});
  const todo = `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver toda la colección</span><span class="mosaico__todo-n">${total} productos entre camas, juguetes, pañuelos, ropa y paseo</span>${ICO.flecha}</a>`;
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function pickerHTML(p) {
  const mio = mioPara(p);
  const conDet = p.tipo === 'tamano';
  const op = o => `<button type="button" class="picker__op${conDet ? ' picker__op--det' : ''}${o.v === mio ? ' es-mio' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${p.tipo === 'talle' ? 'Talle' : 'Tamaño'} ${esc(o.v)}${o.det ? `, ${esc(o.det)}` : ''}${variaPrecio(p) ? `, ${formatearPrecio(precioOp(p, o.v))}` : ''}${o.stock > 0 ? (o.stock <= 1 ? ', última unidad' : '') : ', sin stock'}">${esc(o.v)}${conDet && o.det ? `<small>${esc(o.det)}</small>` : ''}</button>`;
  const guia = grupoTalle(p) ? `<a class="picker__guia" href="${URL_HOME}#talle">¿No sabés cuál? Medila en 1 minuto</a>` : '';
  return `<div class="picker__head"><p class="picker__tit">${p.tipo === 'talle' ? 'Elegí el talle' : 'Elegí el tamaño'}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(op).join('')}</div>${guia}`;
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `${p.tipo === 'talle' ? 'Elegí el talle' : 'Elegí el tamaño'}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = pickerHTML(p) + (qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : '');
  card.appendChild(pk);
  (pk.querySelector('.picker__op.es-mio:not([disabled])') || pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(stockDe(p, v) ? 'Ya tenés todo el stock de esa opción en el carrito.' : 'Esa opción no tiene stock por ahora.'); if (comprar) abrirCarrito(); return; }
  if (comprar) { abrirCarrito(); return; }
  const det = varTexto(p, v);
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${det ? ` (${det})` : ''} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (unico(p)) { sumarAlCarrito(p, parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1, p.ops[0].v, comprar); return; }
      abrirPicker(card, p, comprar ? 'comprar' : 'agregar');
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, opBtn.dataset.pickerOp, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function guiaRopaHTML(resaltar = '') {
  return `<table><thead><tr><th scope="col">Talle</th><th scope="col">Pecho</th><th scope="col">Cuello</th><th scope="col">Peso</th><th scope="col" class="talle__col-ej">Por ejemplo</th></tr></thead>
    <tbody>${GUIA_ROPA.map(([t, p1, p2, c1, c2, kg, ej]) => `<tr data-guia-fila="${t}"${t === resaltar ? ' class="es-actual"' : ''}><th scope="row">${t}</th><td>${p1}-${p2} cm</td><td>${c1}-${c2} cm</td><td>${kg}</td><td class="talle__col-ej">${ej}</td></tr>`).join('')}</tbody></table>`;
}
function guiaQVHTML(p, resaltar) {
  if (p.cat === 'panuelos') return `<p class="guia__tit">Contorno del cuello, donde va el collar</p><table><tbody>${GUIA_PANUELO.map(([t, max], i) => `<tr${t === resaltar ? ' class="es-actual"' : ''}><th scope="row">${t}</th><td>${i ? GUIA_PANUELO[i - 1][1] : 20} a ${max} cm</td></tr>`).join('')}</tbody></table>`;
  if (p.cat === 'camas') return `<p class="guia__tit">Largo del lomo, de la nariz a la base de la cola</p><table><tbody>${GUIA_CAMA.map(([t, max, med], i) => `<tr${t === resaltar ? ' class="es-actual"' : ''}><th scope="row">${t}</th><td>${i ? `${GUIA_CAMA[i - 1][1]} a ${max}` : `hasta ${max}`} cm</td><td>${med}</td></tr>`).join('')}</tbody></table>`;
  return `<p class="guia__tit">Medidas de tu mascota, en centímetros</p><table><thead><tr><th scope="col">Talle</th><th scope="col">Pecho</th><th scope="col">Peso</th></tr></thead><tbody>${GUIA_ROPA.map(([t, p1, p2, , , kg]) => `<tr${t === resaltar ? ' class="es-actual"' : ''}><th scope="row">${t}</th><td>${p1}-${p2} cm</td><td>${kg}</td></tr>`).join('')}</tbody></table>`;
}

const qvEstado = { p: null, v: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  const mio = mioPara(p);
  qvEstado.v = unico(p) ? p.ops[0].v : (p.ops.find(o => o.v === mio && o.stock > 0) ? mio : '');
  qvEstado.qty = 1;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: p.colores.join(', '),
    brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(o => precioOp(p, o.v))), offerCount: p.ops.length, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { colores: p.colores, excluirCat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const op = opDe(p, qvEstado.v);
  const nombreOp = p.tipo === 'talle' ? 'talle' : 'tamaño';
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí un ${nombreOp} para ver cuántas quedan` : op.stock === 1 ? 'Queda 1 unidad' : op.stock <= 3 ? `Quedan ${op.stock} unidades` : 'En stock';
  const precio = op ? `<p class="qv__precio"><b>${formatearPrecio(precioOp(p, op.v))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioLista(p, op.v))}</s>` : ''}${unico(p) ? '' : `<small>${esc(varTexto(p, op.v))}</small>`}</p>` : precioHTML(p, 'qv__precio');
  const boton = o => `<button type="button" class="qv__op${p.tipo === 'tamano' ? ' qv__op--det' : ''}" role="radio" aria-checked="${o.v === qvEstado.v}" data-qv-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${esc(o.v)}${p.tipo === 'tamano' && o.det ? `<small>${esc(o.det)}</small>` : ''}</button>`;
  const selector = unico(p) ? `<p class="qv__colores">${esc(op?.det || '')}</p>` : `<div class="qv__var"><p class="qv__var-tit">${p.tipo === 'talle' ? 'Talle' : 'Tamaño'}${qvEstado.v ? `: <b>${esc(qvEstado.v)}</b>` : ''}</p>
    <div class="qv__ops" role="radiogroup" aria-label="${p.tipo === 'talle' ? 'Talle' : 'Tamaño'}">${p.ops.map(boton).join('')}</div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí un ${nombreOp} para sumarlo al carrito.</p></div>`;
  const compartir = `${new URL(location.pathname, location.href).href}?producto=${p.id}`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precio}
      <p class="qv__colores">${swatchesHTML(p)}${esc(p.colores.join(', '))}</p>
      ${selector}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${grupoTalle(p) ? `<details class="qv__det" data-qv-guia><summary>${ICO.regla}Guía de ${p.tipo === 'talle' ? 'talles' : 'tamaños'}</summary><div class="guia">${guiaQVHTML(p, qvEstado.v)}<p class="guia__nota">Si queda entre dos ${p.tipo === 'talle' ? 'talles' : 'tamaños'}, elegí el más grande o escribinos y te ayudamos.</p></div></details>` : ''}
      <div class="qv__links">
        <a class="qv__wsp" href="${wspLink(`Hola ${MARCA}! Quiero consultar por: ${p.nombre}${qvEstado.v && !unico(p) ? ` (${varTexto(p, qvEstado.v)})` : ''}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
        <a class="qv__share" href="https://wa.me/?text=${encodeURIComponent(`Mirá esto de ${MARCA}: ${p.nombre} ${compartir}`)}" target="_blank" rel="noopener">${ICO.compartir}<span>Compartir</span></a>
      </div>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">Combina con</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${variaPrecio(r) ? 'desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.v = opBtn.dataset.qvOp;
      qvEstado.qty = Math.min(qvEstado.qty, stockDe(p, qvEstado.v) || 1);
      const guiaAbierta = qv.querySelector('[data-qv-guia]')?.open;
      pintarQV();
      if (guiaAbierta) qv.querySelector('[data-qv-guia]').open = true;
      qv.querySelector(`[data-qv-op="${window.CSS.escape(qvEstado.v)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = stockDe(p, qvEstado.v) || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.v) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { Cart.add(p, qvEstado.qty, qvEstado.v); cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, qvEstado.v, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => { const p = getProducto(i.id); return p && opDe(p, i.v); });
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio"><img src="images/logo-pataclub.webp" alt="" width="96" height="96"><p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí una cama, un pañuelo o un abrigo y sumalo acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver la colección</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const det = varTexto(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${det ? `${esc(det)} · ` : ''}${formatearPrecio(precioOp(p, i.v))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, i.v) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const det = varTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${det ? ` (${det})` : ''}: ${formatearPrecio(precioOp(p, i.v) * i.qty)}`; }).join('\n');
  const msg = `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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
  sync();
}

function sugerirTalles({ pecho, cuello, lomo }) {
  const r = {};
  if (pecho) {
    const i = GUIA_ROPA.findIndex(f => pecho <= f[2]);
    r.ropa = GUIA_ROPA[i < 0 ? GUIA_ROPA.length - 1 : i][0];
    r.ropaFuera = i < 0;
  }
  if (cuello) {
    const i = GUIA_PANUELO.findIndex(f => cuello <= f[1]);
    r.panuelo = GUIA_PANUELO[i < 0 ? GUIA_PANUELO.length - 1 : i][0];
    r.panueloFuera = i < 0;
  }
  if (lomo) {
    const i = GUIA_CAMA.findIndex(f => lomo <= f[1]);
    r.cama = GUIA_CAMA[i < 0 ? GUIA_CAMA.length - 1 : i][0];
    r.camaFuera = i < 0;
  }
  return Object.keys(r).length ? r : null;
}

function initTalle() {
  const form = document.querySelector('[data-talle-form]');
  if (!form) return;
  const tabla = document.querySelector('[data-talle-tabla]');
  const res = document.querySelector('[data-talle-res]');
  if (tabla) tabla.innerHTML = guiaRopaHTML(leerTalles().ropa || '');
  const campos = [...form.querySelectorAll('input[type="number"]')];
  const fila = (que, det, talle, filtros) => {
    const n = Tienda.contar({ ...filtros, talles: [talle] });
    const url = `${URL_CATALOGO}?cat=${filtros.cat}&talle=${encodeURIComponent(talle)}`;
    return `<li class="talle-res__fila"><p class="talle-res__que">${esc(que)}<small>${esc(det)}</small></p><p class="talle-res__talle">${esc(talle)}</p>${n ? `<a class="talle-res__ir" href="${url}">Ver ${n}${ICO.flecha}</a>` : `<a class="talle-res__ir" href="${wspLink(`Hola ${MARCA}! Busco ${que.toLowerCase()} en ${talle}, ¿les entra?`)}" target="_blank" rel="noopener">Consultar</a>`}</li>`;
  };
  let ultimo = null;
  const pintar = r => {
    ultimo = r;
    if (!res) return;
    if (!r) { res.hidden = true; return; }
    const filas = [];
    if (r.ropa) {
      filas.push(fila('Ropa', 'Buzos, sweaters y chalecos', r.ropa, { cat: 'ropa' }));
      filas.push(fila('Arneses', 'Para el paseo', r.ropa, { cat: 'paseo' }));
    }
    if (r.panuelo) filas.push(fila('Pañuelos', 'Según el cuello', r.panuelo, { cat: 'panuelos' }));
    if (r.cama) filas.push(fila('Camas', GUIA_CAMA.find(c => c[0] === r.cama)[2], r.cama, { cat: 'camas' }));
    const fuera = r.ropaFuera || r.panueloFuera || r.camaFuera;
    const guardado = leerTalles();
    const yaGuardado = ['ropa', 'panuelo', 'cama'].every(k => !r[k] || guardado[k] === r[k]);
    res.hidden = false;
    res.innerHTML = `<p class="talle-res__eti">Lo que le queda a tu mascota</p>
      <ul class="talle-res__lista">${filas.join('')}</ul>
      ${fuera ? `<p class="talle-res__nota">Alguna medida pasa la tabla: tomamos el más grande, pero mejor <a href="${wspLink(`Hola ${MARCA}! Medí a mi mascota y quiero consultar el talle`)}" target="_blank" rel="noopener">escribinos</a> y lo vemos juntos.</p>` : ''}
      <div class="talle-res__acc"><button type="button" class="btn btn--line" data-talle-guardar>${yaGuardado ? `${ICO.check}Guardado en las tarjetas` : 'Marcar estos talles en la tienda'}</button></div>`;
    tabla?.querySelectorAll('[data-guia-fila]').forEach(tr => tr.classList.toggle('es-actual', tr.dataset.guiaFila === r.ropa));
  };
  const leer = () => {
    const m = {};
    let error = false;
    campos.forEach(c => {
      const v = c.value.trim() === '' ? null : Number(c.value);
      const min = Number(c.min) || 10, max = Number(c.max) || 120;
      const malo = v != null && (!Number.isFinite(v) || v < min || v > max);
      c.setAttribute('aria-invalid', String(malo));
      const err = form.querySelector(`[data-error-de="${c.id}"]`);
      if (err) err.hidden = !malo;
      if (malo) error = true;
      else if (v != null) m[c.name] = v;
    });
    return { m, error };
  };
  form.addEventListener('input', () => {
    const { m, error } = leer();
    if (error) return;
    pintar(sugerirTalles(m));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { m, error } = leer();
    if (error) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const r = sugerirTalles(m);
    if (!r) { campos[0]?.focus(); showToast('Cargá al menos una medida en centímetros.'); return; }
    pintar(r);
  });
  res?.addEventListener('click', e => {
    const b = e.target.closest('[data-talle-guardar]');
    if (!b || !ultimo) return;
    const g = leerTalles();
    ['ropa', 'panuelo', 'cama'].forEach(k => { if (ultimo[k]) g[k] = ultimo[k]; });
    guardarTalles(g);
    b.innerHTML = `${ICO.check}Guardado en las tarjetas`;
    showToast('Listo: marcamos sus talles en cada producto.');
    document.querySelectorAll('.pcard').forEach(card => {
      const p = getProducto(card.dataset.id);
      const ul = card.querySelector('.talles');
      if (p && ul) ul.outerHTML = tallesHTML(p);
    });
  });
}

function initLectura() {
  const p = document.querySelector('body.m2 .marca__lee');
  if (!p) return;
  const palabras = p.textContent.trim().split(/\s+/);
  p.innerHTML = palabras.map(w => `<span class="palabra">${esc(w)}</span> `).join('');
  const spans = [...p.querySelectorAll('.palabra')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = p.getBoundingClientRect();
    const vh = window.innerHeight;
    const prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5)));
    const n = Math.round(prog * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    talles: new Set(lista('talle').map(t => t.toUpperCase()).filter(t => TALLES.includes(t))),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la colección')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-talle-opciones]').forEach(cont => {
    cont.innerHTML = `<div class="tgrupo__ops">${TALLES.map(t => `<label class="talle-op"><input type="checkbox" value="${esc(t)}" data-f="talle"><span>${esc(t)}</span></label>`).join('')}</div><p class="tgrupo__nota">En camas y pañuelos, S, M y L son tamaños.</p>`;
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.talles.size && sin !== 'talle') f.talles = [...estado.talles];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.talles.forEach(t => chips.push(['talle', t, `Talle ${t}`]));
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="talle"]').forEach(el => { el.checked = estado.talles.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    const enPanel = estado.talles.size + estado.colores.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Toda la colección';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Camas, juguetes, pañuelos, ropa y arneses en bordó, rosa y crema. Elegí el talle o el tamaño en cada producto y sumalo al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Toda la colección'; miga.textContent = titulo; }
    document.title = `${titulo} — Pata Club · Accesorios para mascotas`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if ((u.searchParams.get('cat') || '') === estado.cat && estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'talle', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.talles.size) u.searchParams.set('talle', [...estado.talles].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.talles.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'talle' ? estado.talles : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'talle') estado.talles.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && window.getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.15);
  paso('.hero-kicker', { y: 18, opacity: 0, duration: 0.9 }, 0.4);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.5);
  paso('.hero-ctas > *', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.65);
  paso('.sello__in', { scale: 0.92, rotation: -14, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.7);
  paso('.huella', { scale: 0.92, y: 10, opacity: 0, duration: 0.8, stagger: 0.18 }, 0.9);
  const trazo = hero.querySelector('.trazo__linea');
  if (trazo) tl.fromTo(trazo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.9);
  paso('.trazo__corazon', { opacity: 0, y: 6, duration: 0.6 }, 2.2);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initVistaPrevia,
  initCuentas,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initTalle,
  initLectura,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
