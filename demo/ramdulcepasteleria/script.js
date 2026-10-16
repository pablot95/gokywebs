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

const WA = '5493412505135';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'tortas', nombre: 'Tortas', img: 'images/torta-chocolate-1x1.webp', alt: 'Torta de chocolate con ganache y frutos rojos',
    bajada: 'Tortas de 18, 22 y 26 cm para cumpleaños y reuniones, y tortas de varios pisos a medida para tu evento.' },
  { id: 'cupcakes', nombre: 'Cupcakes', img: 'images/cupcakes-1x1.webp', alt: 'Cupcakes de frutos rojos, chocolate y vainilla',
    bajada: 'Cajas de 6 y de 12, con frosting hecho en el día. También en los colores de tu mesa dulce.' },
  { id: 'tartas', nombre: 'Tartas y tarteletas', img: 'images/p-tarta-frambuesa.webp', alt: 'Tarteleta de frambuesas',
    bajada: 'Masa sablée, cremas suaves y fruta fresca, en cajas de 6 o enteras para compartir.' },
  { id: 'mesa-dulce', nombre: 'Mesa dulce', img: 'images/mini-postres-1x1.webp', alt: 'Macarons, brownies, cookies y mini postres',
    bajada: 'Macarons, brownies, mini postres y masitas por caja, o la mesa dulce completa para tu evento.' },
];
const SABORES = { chocolate: 'Chocolate', 'frutos-rojos': 'Frutos rojos', vainilla: 'Vainilla', 'dulce-de-leche': 'Dulce de leche', limon: 'Limón', pistacho: 'Pistacho', frutales: 'Frutales' };
const TIPOS = { precio: 'Con precio de catálogo', medida: 'A medida, se cotiza' };
const RANGOS = {
  'hasta-10000': { label: 'Hasta $10.000', max: 10000 },
  '10000-20000': { label: '$10.000 a $20.000', min: 10000, max: 20000 },
  'mas-20000': { label: 'Más de $20.000', min: 20000 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TAMANOS = (a, b, c) => ({ nombre: 'Tamaño', ops: [
  { id: '18', label: '18 cm', detalle: '10 porciones', precio: a },
  { id: '22', label: '22 cm', detalle: '16 porciones', precio: b },
  { id: '26', label: '26 cm', detalle: '24 porciones', precio: c },
] });
const ESC_MESA = 'images/mesa-dulce-16x9.webp';
const ESC_CUPCAKES = 'images/cupcakes-1x1.webp';
const ESC_MINI = 'images/mini-postres-1x1.webp';
const ESC_BODAS = 'images/torta-bodas-9x16.webp';

const Servidor = crearServidor([
  { id: 'torta-chocolate-frutos-rojos', nombre: 'Torta de chocolate y frutos rojos', cat: 'tortas', sabores: ['chocolate', 'frutos-rojos'], var: TAMANOS(32000, 39000, 49000), rango: 1, alta: 12,
    img: 'p-torta-chocolate', px: 720, alt: 'Torta de chocolate con ganache, frutillas, frambuesas y arándanos',
    desc: 'Bizcochuelo húmedo de chocolate, relleno de mousse semiamargo y dulce de leche, ganache brillante y frutos rojos frescos arriba.' },
  { id: 'torta-bodas-tres-pisos', nombre: 'Torta de bodas de tres pisos', cat: 'tortas', sabores: ['vainilla', 'frutos-rojos'], aPedido: true, unidad: 'Para casamientos y aniversarios', rango: 2, alta: 10,
    img: 'p-torta-boda', px: 720, escena: ESC_BODAS, alt: 'Torta de bodas de tres pisos con rosas naturales y detalles en relieve',
    desc: 'Tres pisos con buttercream marfil, detalles en relieve y rosas naturales. Elegís el sabor y el relleno de cada piso, y la cotizamos según el diseño y la cantidad de invitados.' },
  { id: 'naked-cake-flores', nombre: 'Naked cake con flores naturales', cat: 'tortas', sabores: ['vainilla', 'frutos-rojos'], var: TAMANOS(34000, 42000, 53000), rango: 3, alta: 14,
    img: 'p-naked-cake', px: 450, escena: ESC_MESA, alt: 'Naked cake con hilos de chocolate blanco y flores naturales',
    desc: 'Bizcochuelo de vainilla con crema de mascarpone y frutos rojos, cobertura semidesnuda, hilos de chocolate blanco y flores naturales de decoración.' },
  { id: 'mesa-dulce-eventos', nombre: 'Mesa dulce para eventos', cat: 'mesa-dulce', sabores: ['chocolate', 'frutos-rojos', 'vainilla'], aPedido: true, unidad: 'Para cumpleaños, casamientos y eventos', rango: 4, alta: 9,
    img: 'p-mesa-dulce', px: 720, escena: ESC_MESA, alt: 'Mesa dulce con naked cake, cupcakes, tarteletas y masitas',
    desc: 'Torta principal, cupcakes, tarteletas, mini postres y masitas en los colores de tu evento. La armamos según la cantidad de invitados y la cotizamos por WhatsApp.' },
  { id: 'torta-floral-pintada', nombre: 'Torta floral pintada a mano', cat: 'tortas', sabores: ['vainilla', 'dulce-de-leche'], var: TAMANOS(28000, 34000, 43000), rango: 5, alta: 13,
    img: 'p-torta-floral', px: 720, alt: 'Torta rosa con flores pintadas a mano sobre una base dorada',
    desc: 'Vainilla con dulce de leche y merengue suizo, cubierta de buttercream rosa y flores pintadas a mano una por una. Podemos cambiar los colores.' },
  { id: 'cupcakes-frutos-rojos', nombre: 'Cupcakes de frutos rojos', cat: 'cupcakes', sabores: ['vainilla', 'frutos-rojos'], precio: 10800, unidad: 'Caja de 6', rango: 6, alta: 11,
    img: 'p-cup-frutos-rojos', px: 350, escena: ESC_CUPCAKES, alt: 'Cupcake con frosting rosa de frambuesa y una frambuesa fresca',
    desc: 'Cupcake de vainilla con frosting de frambuesa, frambuesa fresca y crocante de frutos rojos.' },
  { id: 'macarons-surtidos', nombre: 'Macarons surtidos', cat: 'mesa-dulce', sabores: ['pistacho', 'chocolate', 'frutos-rojos', 'vainilla'], precio: 15600, unidad: 'Caja de 12', rango: 7, alta: 8,
    img: 'p-macarons', px: 400, escena: ESC_MINI, alt: 'Torre de macarons de pistacho, chocolate, frambuesa y vainilla',
    desc: 'Pistacho, chocolate, frambuesa y vainilla: tres de cada sabor, rellenos de ganache.' },
  { id: 'tarteletas-frutos-del-bosque', nombre: 'Tarteletas de frutos del bosque', cat: 'tartas', sabores: ['frutos-rojos', 'vainilla'], precio: 13200, unidad: 'Caja de 6', rango: 8, alta: 7,
    img: 'p-tarta-bosque', px: 330, escena: ESC_CUPCAKES, alt: 'Tarteleta con frutillas, moras, frambuesas y arándanos',
    desc: 'Masa sablée, crema pastelera de vainilla, frutillas, moras, frambuesas y arándanos.' },
  { id: 'torta-mousse-chocolate', nombre: 'Torta mousse de chocolate', cat: 'tortas', sabores: ['chocolate'], var: TAMANOS(27000, 33000, 42000), alta: 6,
    img: 'p-torta-mousse', px: 330, escena: ESC_MINI, alt: 'Torta mousse de chocolate con copos de chocolate arriba',
    desc: 'Base de brownie, mousse de chocolate semiamargo y copos de chocolate arriba. Para los que no negocian el chocolate.' },
  { id: 'cheesecake-frutos-rojos', nombre: 'Cheesecake de frutos rojos', cat: 'tortas', sabores: ['frutos-rojos', 'vainilla'], precio: 29000, unidad: 'Entera de 22 cm · 12 porciones', alta: 15,
    img: 'p-cheesecake', px: 370, escena: ESC_MINI, alt: 'Porción de cheesecake con cobertura de frutos rojos y frambuesas',
    desc: 'Base de galletitas y manteca, crema de queso horneada y cobertura brillante de frutos rojos.' },
  { id: 'cupcakes-chocolate', nombre: 'Cupcakes de chocolate', cat: 'cupcakes', sabores: ['chocolate'], precio: 10800, unidad: 'Caja de 6', alta: 5,
    img: 'p-cup-chocolate', px: 340, escena: ESC_CUPCAKES, alt: 'Cupcake de chocolate con frosting de ganache y virutas',
    desc: 'Cupcake de cacao con frosting de ganache batida y virutas de chocolate.' },
  { id: 'cupcakes-vainilla-frutilla', nombre: 'Cupcakes de vainilla y frutilla', cat: 'cupcakes', sabores: ['vainilla'], precio: 9900, unidad: 'Caja de 6', alta: 4,
    img: 'p-cup-vainilla', px: 340, escena: ESC_CUPCAKES, alt: 'Cupcake de vainilla con frosting de crema y media frutilla',
    desc: 'Vainilla con frosting de crema y media frutilla fresca arriba.' },
  { id: 'cupcakes-pistacho', nombre: 'Cupcakes de pistacho', cat: 'cupcakes', sabores: ['pistacho', 'frutos-rojos'], precio: 12600, unidad: 'Caja de 6', nuevo: true, alta: 27,
    img: 'p-cup-pistacho', px: 314, escena: ESC_CUPCAKES, alt: 'Cupcake de pistacho con frosting de queso crema y una frambuesa',
    desc: 'Bizcocho de pistacho, frosting de queso crema, pistachos tostados y una frambuesa.' },
  { id: 'cupcakes-rosa-mesa-dulce', nombre: 'Cupcakes rosa para mesa dulce', cat: 'cupcakes', sabores: ['vainilla', 'frutos-rojos'], precio: 19800, unidad: 'Caja de 12', alta: 16,
    img: 'p-cup-rosa', px: 400, escena: ESC_MESA, alt: 'Cupcakes con frosting rosa y blanco sobre una base de madera',
    desc: 'Frosting rosa y blanco, frutos rojos y detalles comestibles. Los hacemos en los colores de tu evento.' },
  { id: 'tarteletas-frutilla-arandanos', nombre: 'Tarteletas de frutilla y arándanos', cat: 'tartas', sabores: ['frutos-rojos'], precio: 12600, unidad: 'Caja de 6', alta: 3,
    img: 'p-tarta-frutilla', px: 350, escena: ESC_MESA, alt: 'Tarteletas con frutillas y arándanos sobre una bandeja',
    desc: 'Crema pastelera, frutillas y arándanos frescos sobre masa sablée.' },
  { id: 'mini-lemon-pie', nombre: 'Mini lemon pie', cat: 'tartas', sabores: ['limon'], precio: 11400, unidad: 'Caja de 6', alta: 24,
    img: 'p-tarta-limon', px: 274, escena: ESC_CUPCAKES, alt: 'Mini lemon pie con merengue flameado',
    desc: 'Masa sablée, crema de limón y merengue italiano flameado.' },
  { id: 'tarteletas-frambuesa', nombre: 'Tarteletas de frambuesa', cat: 'tartas', sabores: ['frutos-rojos'], precio: 13200, unidad: 'Caja de 6', alta: 2,
    img: 'p-tarta-frambuesa', px: 340, escena: ESC_MINI, alt: 'Tarteleta cubierta de frambuesas con una hoja de menta',
    desc: 'Crema de vainilla y frambuesas frescas sobre masa sablée.' },
  { id: 'tarteletas-arandanos', nombre: 'Tarteletas de arándanos', cat: 'tartas', sabores: ['frutos-rojos', 'vainilla'], precio: 12600, unidad: 'Caja de 6', alta: 1,
    img: 'p-tarta-arandanos', px: 320, escena: ESC_MINI, alt: 'Tarteleta cubierta de arándanos',
    desc: 'Crema de vainilla y arándanos frescos sobre masa sablée.' },
  { id: 'tarta-humeda-chocolate', nombre: 'Tarta húmeda de chocolate', cat: 'tartas', sabores: ['chocolate'], precio: 24000, unidad: 'Entera de 22 cm', alta: 20,
    img: 'p-tarta-chocolate', px: 400, escena: ESC_MINI, alt: 'Porción de tarta de chocolate con praliné de avellanas',
    desc: 'Base de chocolate, relleno cremoso de chocolate semiamargo y praliné de avellanas.' },
  { id: 'tarteletas-maracuya', nombre: 'Tarteletas de maracuyá', cat: 'tartas', sabores: ['frutales'], precio: 12000, unidad: 'Caja de 6', nuevo: true, alta: 26,
    img: 'p-tarta-maracuya', px: 320, escena: ESC_CUPCAKES, alt: 'Tarteleta de maracuyá con duraznos',
    desc: 'Crema de maracuyá con duraznos en almíbar sobre masa sablée.' },
  { id: 'macarons-frambuesa', nombre: 'Macarons de frambuesa', cat: 'mesa-dulce', sabores: ['frutos-rojos'], precio: 15600, unidad: 'Caja de 12', alta: 17,
    img: 'p-macarons-frambuesa', px: 374, escena: ESC_MINI, alt: 'Macarons rosados de frambuesa en un plato de cerámica',
    desc: 'Tapas de almendra y ganache de frambuesa.' },
  { id: 'brownies-nuez', nombre: 'Brownies con nuez', cat: 'mesa-dulce', sabores: ['chocolate'], precio: 12600, unidad: 'Caja de 9', alta: 22,
    img: 'p-brownies', px: 294, escena: ESC_MINI, alt: 'Brownies de chocolate con nueces',
    desc: 'Brownie húmedo de chocolate semiamargo con nueces, cortado en cuadrados.' },
  { id: 'cookies-chips', nombre: 'Cookies con chips de chocolate', cat: 'mesa-dulce', sabores: ['chocolate'], precio: 8400, unidad: 'Caja de 6', alta: 23,
    img: 'p-cookies', px: 400, escena: ESC_MINI, alt: 'Cookies grandes con chips de chocolate',
    desc: 'Grandes, crocantes por fuera y blanditas por dentro.' },
  { id: 'vasitos-crema-frambuesa', nombre: 'Vasitos de crema y frambuesa', cat: 'mesa-dulce', sabores: ['frutos-rojos', 'vainilla'], precio: 16800, unidad: 'Bandeja de 12', alta: 21,
    img: 'p-vasitos', px: 280, escena: ESC_MESA, alt: 'Vasitos de mousse de vainilla con frambuesa',
    desc: 'Mousse de vainilla, bizcocho y una frambuesa fresca, servidos en vasito.' },
  { id: 'bocaditos-chocolate-cereza', nombre: 'Bocaditos de chocolate y cereza', cat: 'mesa-dulce', sabores: ['chocolate'], precio: 14400, unidad: 'Bandeja de 12', alta: 18,
    img: 'p-bocaditos', px: 340, escena: ESC_MESA, alt: 'Bocaditos de chocolate con una cereza arriba',
    desc: 'Cuadraditos de bizcocho de chocolate bañados en ganache, con una cereza.' },
  { id: 'pepas-linzer', nombre: 'Pepas linzer de frambuesa', cat: 'mesa-dulce', sabores: ['frutos-rojos'], precio: 9000, unidad: 'Docena', alta: 19,
    img: 'p-pepas', px: 400, escena: ESC_MESA, alt: 'Masitas linzer con mermelada de frambuesa y azúcar impalpable',
    desc: 'Masitas de manteca con mermelada de frambuesa y azúcar impalpable.' },
  { id: 'alfajorcitos-maicena', nombre: 'Alfajorcitos de maicena', cat: 'mesa-dulce', sabores: ['dulce-de-leche'], precio: 9600, unidad: 'Docena', alta: 25,
    img: 'p-alfajorcitos', px: 300, escena: ESC_MESA, alt: 'Alfajorcitos de maicena con dulce de leche',
    desc: 'Tapitas de maicena que se deshacen y mucho dulce de leche.' },
  { id: 'mini-cheesecakes', nombre: 'Mini cheesecakes con frambuesa', cat: 'mesa-dulce', sabores: ['frutos-rojos', 'vainilla'], precio: 14400, unidad: 'Caja de 6', alta: 28,
    img: 'p-mini-cheesecake', px: 350, escena: ESC_CUPCAKES, alt: 'Mini cheesecake con base crocante y una frambuesa',
    desc: 'Base crocante, crema de queso y una frambuesa arriba.' },
  { id: 'mini-tortas-chocolate', nombre: 'Mini tortas de chocolate glaseadas', cat: 'mesa-dulce', sabores: ['chocolate'], precio: 15000, unidad: 'Caja de 4', nuevo: true, alta: 29,
    img: 'p-mini-chocolate', px: 390, escena: ESC_CUPCAKES, alt: 'Mini torta de chocolate con glaseado espejo y avellanas',
    desc: 'Bizcocho de chocolate, mousse y glaseado espejo con avellanas tostadas.' },
], { tope: 100 });

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, nombreCat(p.cat), p.desc, p.unidad, ...(p.sabores || []).map(s => SABORES[s] || s), p.aPedido ? 'a medida evento' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => (p.aPedido ? null : p.var ? Math.min(...p.var.ops.map(o => o.precio)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), sabor = lista(f.sabor), tipo = lista(f.tipo), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sabor.length && !sabor.some(s => (p.sabores || []).includes(s))) return false;
    if (tipo.length && !tipo.includes(p.aPedido ? 'medida' : 'precio')) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.rango && RANGOS[f.rango]) {
      const r = RANGOS[f.rango], precio = desde(p);
      if (precio == null) return false;
      if (r.min != null && precio <= r.min) return false;
      if (r.max != null && precio > r.max) return false;
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
    const precio = p => desde(p) ?? Infinity;
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precio(a) - precio(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => (desde(b) ?? -1) - (desde(a) ?? -1) || desempate(a, b);
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
  const obtener = id => { const p = datos.find(x => x.id === id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => {
    const precios = datos.filter(p => p.cat === c.id).map(desde).filter(v => v != null);
    return { id: c.id, cantidad: contar({ cat: c.id }), desde: precios.length ? Math.min(...precios) : null };
  });
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Servidor.obtener(id);
const opcion = (p, v) => (p?.var ? (p.var.ops.find(o => o.id === v) || p.var.ops[0]) : null);
const precioDe = (p, v) => (p.aPedido ? 0 : p.var ? opcion(p, v).precio : p.precio);
const precioDesde = p => (p.var ? Math.min(...p.var.ops.map(o => o.precio)) : p.precio);
const varDefault = p => (p.var ? p.var.ops[0].id : '');
const imgDe = p => `images/${p.img}.webp`;
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const waProducto = p => waLink(`¡Hola, RAM.DULCE! Quiero consultar por: ${p.nombre}.`);
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };

const Cart = {
  KEY: 'ramdulce_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 20);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 20) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 20)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && !p.aPedido ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoVacio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
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
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
};
function precioHTML(p, clase = 'prod-card__precio') {
  if (p.aPedido) return `<p class="${clase} ${clase}--medida">A cotizar</p>`;
  return `<p class="${clase}">${p.var ? '<small>Desde</small>' : ''}${formatearPrecio(precioDesde(p))}</p>`;
}
function metaDe(p) {
  if (p.aPedido) return 'A medida · se cotiza';
  if (p.var) return `${p.var.ops.length} tamaños · desde ${p.var.ops[0].detalle}`;
  return p.unidad || '';
}
function badgeDe(p) {
  if (p.aPedido) return '<span class="prod-badge prod-badge--medida">A medida</span>';
  if (p.nuevo) return '<span class="prod-badge">Nuevo</span>';
  return '';
}
function stepperHTML(nombre) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function cardHTML(p, { rail = false, anim = true } = {}) {
  const a = anim ? (rail ? ANIM.der : ANIM.subir) : '';
  const n = esc(p.nombre);
  let acciones;
  if (rail) {
    acciones = p.aPedido
      ? `<a class="prod-add-icon prod-add-icon--wa" href="${waProducto(p)}" target="_blank" rel="noopener" aria-label="Consultar ${n} por WhatsApp">${ICON.wa}</a>`
      : `<button type="button" class="prod-add-icon" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carrito}</button>`;
    return `<article class="prod-card prod-card--rail"${a}>
      <button type="button" class="recorte prod-card__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${badgeDe(p)}</button>
      <div class="prod-card__info"><p class="prod-card__meta">${esc(metaDe(p))}</p><h3 class="prod-card__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3>
      <div class="prod-card__fila">${precioHTML(p)}${acciones}</div></div></article>`;
  }
  acciones = p.aPedido
    ? `<div class="prod-actions"><a class="btn btn-ghost prod-consultar" href="${waProducto(p)}" target="_blank" rel="noopener" aria-label="Consultar ${n} por WhatsApp">${ICON.wa}<span>Consultar</span></a></div><button type="button" class="prod-buy" data-quick="${p.id}">Ver el detalle</button>`
    : `<div class="prod-actions">${stepperHTML(p.nombre)}<button type="button" class="btn btn-primary prod-add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">Agregar</button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
  return `<article class="prod-card"${a}>
    <button type="button" class="recorte prod-card__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${badgeDe(p)}</button>
    <div class="prod-card__info"><p class="prod-card__meta">${esc(metaDe(p))}</p><h3 class="prod-card__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3>
    <div class="prod-card__fila"><span class="prod-card__leader" aria-hidden="true"></span>${precioHTML(p)}</div>${acciones}</div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p || p.aPedido) return false;
  const vv = p.var ? (opcion(p, v).id) : '';
  Cart.add(p, qty, vv);
  const extra = p.var ? ` (${opcion(p, vv).label})` : '';
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${extra} al carrito`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.prod-card, .qv, .carta-fila')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 20)) : 1;
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, 20));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, cantidadDe(add), add.dataset.v || ''); return; }
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
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, 20));
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
    nav.querySelector('a, button:not(.nav-close)')?.focus();
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

function initCatMenu() {
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const resumen = Servidor.resumen();
  const href = catalogoHref();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const activa = enCatalogo ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = CATEGORIAS.map(c => {
    const r = resumen.find(x => x.id === c.id);
    return `<a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="46" height="46"><span class="nav-cats__nombre">${esc(c.nombre)}</span><span class="nav-cats__cant">${r?.cantidad || 0}</span></a>`;
  }).join('') + `<a class="nav-cats__todo" href="${href}">Ver todo el catálogo ${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target) && hoverMq.matches) cerrar(); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.12 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

function renderCategorias() {
  const cont = document.getElementById('catTiles');
  if (!cont) return;
  const resumen = Servidor.resumen();
  cont.innerHTML = CATEGORIAS.map(c => {
    const r = resumen.find(x => x.id === c.id);
    const meta = `${r?.cantidad || 0} productos${r?.desde ? ' · desde ' + formatearPrecio(r.desde) : ''}`;
    return `<a class="cat-tile" href="${catalogoHref()}?cat=${c.id}"${ANIM.subir}>
      <span class="cat-tile__foto recorte"><img src="${c.img}" alt="${esc(c.alt)}" width="600" height="600"></span>
      <span class="cat-tile__pie"><span><span class="cat-tile__nombre">${esc(c.nombre)}</span><br><span class="cat-tile__meta">${meta}</span></span><span class="cat-tile__flecha" aria-hidden="true">${ICON.flecha}</span></span>
    </a>`;
  }).join('');
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const items = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  const vp = document.getElementById('railDest');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) * 2;
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
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function renderPreview() {
  const cont = document.getElementById('previewGrid');
  if (!cont) return;
  const items = Servidor.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
  const total = document.querySelector('[data-total-catalogo]');
  if (total) total.textContent = Servidor.contar();
}

function filaCarta(p) {
  const n = esc(p.nombre);
  const accion = p.aPedido
    ? `<a class="prod-add-icon prod-add-icon--wa" href="${waProducto(p)}" target="_blank" rel="noopener" aria-label="Consultar ${n} por WhatsApp">${ICON.wa}</a>`
    : `<button type="button" class="prod-add-icon" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carrito}</button>`;
  const precio = p.aPedido ? '<span class="carta-fila__precio carta-fila__precio--medida">A cotizar</span>'
    : `<span class="carta-fila__precio">${formatearPrecio(precioDesde(p))}</span>`;
  const desc = p.var ? `${p.var.ops[0].label} · ${p.var.ops[0].detalle} · también en ${p.var.ops.slice(1).map(o => o.label).join(' y ')}` : (p.unidad || '');
  return `<div class="carta-fila">
    <button type="button" class="recorte carta-fila__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></button>
    <div class="carta-fila__txt"><div class="carta-fila__linea"><button type="button" class="carta-fila__nombre" data-quick="${p.id}">${n}</button><span class="carta-fila__puntos" aria-hidden="true"></span>${precio}</div><p class="carta-fila__desc">${esc(desc)}</p></div>
    ${accion}
  </div>`;
}
function renderCarta() {
  const cont = document.getElementById('cartaGrid');
  if (!cont) return;
  const resumen = Servidor.resumen();
  cont.innerHTML = CATEGORIAS.map((c, i) => {
    const items = Servidor.consultar({ filtros: { cat: c.id }, orden: 'destacados', limite: 2 }).items;
    const cant = resumen.find(r => r.id === c.id)?.cantidad || 0;
    return `<div class="carta-cat"${ANIM.subir}>
      <div class="carta-cat__head"><span class="carta-cat__num">0${i + 1}</span><h3 class="carta-cat__nombre">${esc(c.nombre)}</h3><a class="carta-cat__ver" href="${catalogoHref()}?cat=${c.id}" aria-label="Ver las ${cant} opciones de ${esc(c.nombre)}">Ver <span>las ${cant}</span> ${ICON.flecha}</a></div>
      ${items.map(filaCarta).join('')}
    </div>`;
  }).join('');
  const total = document.querySelector('[data-total-catalogo]');
  if (total) total.textContent = Servidor.contar();
}

function initEventos() {
  const grupo = document.querySelector('.ocasiones');
  const cta = document.getElementById('eventosCta');
  if (!grupo || !cta) return;
  const label = cta.querySelector('span');
  grupo.addEventListener('click', e => {
    const b = e.target.closest('[data-ocasion]');
    if (!b) return;
    grupo.querySelectorAll('[data-ocasion]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cta.href = waLink(`¡Hola, RAM.DULCE! Quiero una torta para ${b.dataset.ocasion}. Te cuento la fecha, los invitados y la idea.`);
    if (label) label.textContent = `Pedí tu torta para ${b.dataset.ocasion}`;
  });
}

let qvUltimoFoco = null;
function abrirQuickView(id, trigger) {
  const modal = document.getElementById('quickView');
  const cont = document.getElementById('qvContenido');
  const p = getProducto(id);
  if (!modal || !cont || !p) return;
  if (modal.hidden) qvUltimoFoco = trigger || document.activeElement;
  const n = esc(p.nombre);
  const fotos = [imgDe(p), p.escena].filter(Boolean);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const datos = [
    p.unidad && !p.aPedido ? p.unidad : null,
    p.aPedido ? 'A medida · se cotiza por WhatsApp' : null,
    ...(p.sabores || []).map(s => SABORES[s]),
  ].filter(Boolean);
  const vIni = varDefault(p);
  const precio = p.aPedido ? '<p class="qv__precio qv__precio--medida">Precio a cotizar según diseño e invitados</p>'
    : `<p class="qv__precio" data-qv-precio>${formatearPrecio(precioDe(p, vIni))}</p>`;
  const variantes = p.var ? `<fieldset class="qv__var"><legend>${esc(p.var.nombre)}</legend><div class="qv__ops">${p.var.ops.map((o, i) => `<button type="button" class="qv__op" data-op="${o.id}" aria-pressed="${i === 0}">${esc(o.label)}<small>${esc(o.detalle)} · ${formatearPrecio(o.precio)}</small></button>`).join('')}</div></fieldset>` : '';
  const acciones = p.aPedido
    ? `<div class="qv__acciones"><a class="btn btn-primary" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar por WhatsApp</span></a></div><p class="qv__nota">Contanos la fecha, la cantidad de invitados y la idea. Si tenés fotos de referencia, mandalas.</p>`
    : `<div class="qv__acciones">${stepperHTML(p.nombre)}<button type="button" class="btn btn-primary" data-add="${p.id}" data-v="${vIni}">Agregar al carrito</button><button type="button" class="btn btn-ghost" data-buy="${p.id}" data-v="${vIni}">Comprar ahora</button></div><p class="qv__nota">Atendemos todos los barrios de Rosario. La entrega se coordina por WhatsApp.</p>`;
  cont.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__principal"><img src="${fotos[0]}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}" data-qv-img></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-foto="${f}" aria-pressed="${i === 0}" aria-label="${i === 0 ? 'Ver el producto' : 'Ver la foto de la mesa'}"><img src="${f}" alt="" width="68" height="68"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreCat(p.cat))}</p>
      <h2 class="qv__nombre">${n}</h2>
      ${precio}
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__datos">${datos.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      ${variantes}
      ${acciones}
    </div>
    ${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="58" height="58"><span>${esc(r.nombre)}<small>${r.aPedido ? 'A cotizar' : (r.var ? 'Desde ' : '') + formatearPrecio(precioDesde(r))}</small></span></button>`).join('')}</div></div>` : ''}`;
  cont.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    cont.querySelectorAll('[data-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('[data-add], [data-buy]').forEach(x => { x.dataset.v = b.dataset.op; });
    const el = cont.querySelector('[data-qv-precio]');
    if (el) el.textContent = formatearPrecio(precioDe(p, b.dataset.op));
  }));
  cont.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => {
    cont.querySelectorAll('[data-foto]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const img = cont.querySelector('[data-qv-img]');
    if (img) img.src = b.dataset.foto;
  }));
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  const oferta = p.aPedido ? {} : { offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: 'https://schema.org/InStock' } };
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(imgDe(p), location.href).href, brand: { '@type': 'Brand', name: 'RAM.DULCE. pastelería' }, ...oferta });
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
function lineasCarrito() {
  return Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p && !i.p.aPedido);
}
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  const lineas = lineasCarrito();
  if (!lineas.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.carritoVacio}<h3>Tu carrito está vacío</h3><p>Todavía no elegiste nada dulce. Arrancá por las tortas o por una caja de cupcakes.</p><a class="btn btn-primary" href="${catalogoHref()}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = lineas.map(({ p, v, qty }, k) => {
    const o = opcion(p, v);
    const detalle = o ? `${o.label} · ${o.detalle}` : (p.unidad || '');
    return `<div class="linea" data-id="${p.id}" data-v="${v || ''}"${animar ? ` style="animation-delay:${Math.min(k * 0.05, 0.3)}s"` : ' style="animation:none"'}>
      <img src="${imgDe(p)}" alt="" width="72" height="72">
      <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(detalle)}</p>
        <div class="linea__fila"><div class="stepper" data-stepper><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="20" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
        <span class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</span>
        <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.basura}</button></div>
      </div></div>`;
  }).join('');
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
    sabor: (params.get('sabor') || '').split(',').filter(s => SABORES[s]),
    tipo: (params.get('tipo') || '').split(',').filter(s => TIPOS[s]),
    precio: valida(params.get('precio'), RANGOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valida(params.get('orden'), ORDENES) || 'destacados',
  };
  const el = {
    titulo: document.getElementById('catTitulo'), bajada: document.getElementById('catBajada'), miga: document.getElementById('migaCat'),
    q: document.getElementById('q'), orden: document.getElementById('orden'), resumen: document.getElementById('resumen'),
    mas: document.getElementById('masWrap'), verMas: document.getElementById('verMas'), mostrando: document.getElementById('mostrando'),
    cats: document.getElementById('filtroCats'), sabores: document.getElementById('filtroSabores'), tipos: document.getElementById('filtroTipos'),
    precios: document.getElementById('filtroPrecios'), filtros: document.getElementById('filtros'), abrir: document.getElementById('abrirFiltros'),
  };
  const bajadaBase = el.bajada?.textContent || '';
  const tituloBase = el.titulo?.textContent || 'Catálogo';
  let cursor = null, mostrados = 0, total = 0;

  el.cats.innerHTML = [{ id: '', nombre: 'Todas' }, ...CATEGORIAS].map(c => `<button type="button" class="filtro__cat" data-cat="${c.id}" aria-pressed="${st.cat === c.id}">${esc(c.nombre)}<span>${Servidor.contar(c.id ? { cat: c.id } : {})}</span></button>`).join('');
  el.sabores.innerHTML = Object.entries(SABORES).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="sabor" value="${id}"${st.sabor.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.tipos.innerHTML = Object.entries(TIPOS).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="tipo" value="${id}"${st.tipo.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.precios.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([id, r]) => [id, r.label])].map(([id, l]) => `<label class="check"><input type="radio" name="precio" value="${id}"${st.precio === id ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.orden.innerHTML = Object.entries(ORDENES).map(([id, l]) => `<option value="${id}"${st.orden === id ? ' selected' : ''}>${esc(l)}</option>`).join('');
  el.q.value = st.q;

  const filtrosServidor = () => ({ cat: st.cat || undefined, sabor: st.sabor, tipo: st.tipo, rango: st.precio || undefined, q: st.q || undefined });
  const activos = () => (st.cat ? 1 : 0) + st.sabor.length + st.tipo.length + (st.precio ? 1 : 0) + (st.q ? 1 : 0);

  function escribirURL() {
    const u = new URL(location.href);
    ['cat', 'sabor', 'tipo', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.cat) u.searchParams.set('cat', st.cat);
    if (st.sabor.length) u.searchParams.set('sabor', st.sabor.join(','));
    if (st.tipo.length) u.searchParams.set('tipo', st.tipo.join(','));
    if (st.precio) u.searchParams.set('precio', st.precio);
    if (st.q) u.searchParams.set('q', st.q);
    if (st.orden !== 'destacados') u.searchParams.set('orden', st.orden);
    window.history.replaceState(null, '', u);
  }
  function pintarCabecera() {
    const c = catsValidas[st.cat];
    if (el.titulo) el.titulo.textContent = c ? c.nombre : tituloBase;
    if (el.bajada) el.bajada.textContent = c ? c.bajada : bajadaBase;
    if (el.miga) { el.miga.hidden = !c; const s = el.miga.querySelector('span'); if (s) s.textContent = c ? c.nombre : ''; }
    document.title = `${c ? c.nombre : 'Catálogo'} — RAM.DULCE. pastelería`;
    el.cats.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === st.cat)));
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (new URL(a.href).searchParams.get('cat') === st.cat && st.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarResumen() {
    const chips = [];
    if (st.cat) chips.push(['cat', st.cat, catsValidas[st.cat].nombre]);
    st.sabor.forEach(s => chips.push(['sabor', s, SABORES[s]]));
    st.tipo.forEach(t => chips.push(['tipo', t, TIPOS[t]]));
    if (st.precio) chips.push(['precio', st.precio, RANGOS[st.precio].label]);
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    el.resumen.innerHTML = `<span><strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}</span>` +
      chips.map(([k, v, l]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') +
      (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    document.querySelectorAll('[data-total]').forEach(s => { s.textContent = total; });
    const nf = document.querySelector('[data-nfiltros]');
    if (nf) nf.textContent = activos() ? `(${activos()})` : '';
  }
  function vacioHTML() {
    return `<div class="vacio" data-animate="subir" style="opacity:0;transform:translateY(24px)"><h2>No encontramos ese antojo</h2><p>Probá con otra palabra o sacá algún filtro. Y si lo que buscás es algo especial, lo hacemos a medida.</p><div class="vacio__ctas"><button type="button" class="btn btn-primary" data-limpiar>Limpiar filtros</button><a class="btn btn-ghost" href="${waLink('¡Hola, RAM.DULCE! Busco algo que no encontré en el catálogo: ')}" target="_blank" rel="noopener">${ICON.wa}<span>Contanos qué buscás</span></a></div></div>`;
  }
  function cargar(reset) {
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
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
      Object.assign(st, { cat: '', sabor: [], tipo: [], precio: '', q: '' });
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

function iniciar() {
  initModelBarScroll();
  initCatMenu();
  initNav();
  renderCategorias();
  renderRail();
  renderPreview();
  renderCarta();
  initEventos();
  initCatalogo();
  initAcciones();
  initCarrito();
  initFloats();
  updateCartBadge();
  initHeroMotion();
  initReveals();
  initQuickView();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
