const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
document.documentElement.classList.add('js');

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

const WSP = '5492215896090';
const MARCA = 'Velvet Cart';
const CATEGORIAS = [
  { id: 'vibradores', nombre: 'Vibradores', titulo: 'Vibradores', bajada: 'Magic, Sex Angel, Mini Kong y anillo con control', img: 'images/p-sex-angel.webp' },
  { id: 'masajeadores', nombre: 'Masajeadores', titulo: 'Masajeadores y succionadores', bajada: 'Succionador Lovely y masajeador corporal', img: 'images/p-lovely.webp' },
  { id: 'geles-aceites', nombre: 'Geles y aceites', titulo: 'Geles y aceites', bajada: 'Lubricantes Miss V y aceites para masajes', img: 'images/p-aceite-almendras.webp' },
  { id: 'lenceria', nombre: 'Lencería', titulo: 'Lencería y ropa erótica', bajada: 'Corpiños, culottes, camisones y bata', img: 'images/p-camison-bordo.webp' },
];
const PARA = [
  { id: 'vos', nombre: 'Para vos' },
  { id: 'compartir', nombre: 'Para compartir' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15a35', nombre: '$15.000 a $35.000', min: 15000, max: 35000 },
  { id: 'mas35', nombre: 'Más de $35.000', min: 35000, max: null },
];
const PRODUCTOS = [
  { id: 'magic', rango: 1, cat: 'vibradores', para: ['vos'], nombre: 'Vibrador «Magic» a pilas', pres: 'A pilas', gancho: 'Formato varita, liviano y fácil de usar', precio: 24900, descuento: 0, etiqueta: 'Más elegido', img: 'images/p-magic.webp', alt: 'Vibrador rosa de formato varita sobre fondo beige', desc: 'Vibrador a pilas de formato varita, liviano y fácil de manejar. Si querés saber qué pilas usa o qué colores hay, preguntanos por WhatsApp.', claves: ['varita', 'wand', 'pilas', 'vibrador', 'magic'] },
  { id: 'lovely', rango: 2, cat: 'masajeadores', para: ['vos'], nombre: 'Succionador «Lovely» a pilas', pres: 'A pilas', gancho: 'Estimulación por succión, en un formato suave', precio: 49900, descuento: 0, img: 'images/p-lovely.webp', alt: 'Succionador rosa de forma ovalada con ondas, sobre fondo beige', desc: 'Succionador a pilas de formas redondeadas, pensado para la estimulación externa. Se sostiene con una mano y se guarda en cualquier cajón.', claves: ['succionador', 'succion', 'pilas', 'lovely', 'externo'] },
  { id: 'sex-angel', rango: 3, cat: 'vibradores', para: ['vos', 'compartir'], nombre: 'Vibrador «Sex Angel» doble motor', pres: 'Doble motor', gancho: 'Dos motores para sentir la vibración en dos puntos', precio: 39900, descuento: 0, img: 'images/p-sex-angel.webp', alt: 'Vibrador negro de forma curva con dos extremos redondeados', desc: 'Vibrador de doble motor y forma curva, para sentir la vibración en dos puntos a la vez. Medidas y forma de carga, por WhatsApp.', claves: ['doble', 'motor', 'curvo', 'sex angel', 'vibrador'] },
  { id: 'camison-bordo', rango: 4, cat: 'lenceria', para: ['vos', 'compartir'], nombre: 'Camisón de satén bordó', pres: 'Satén con encaje', gancho: 'Corto, con breteles finos y encaje en el escote', precio: 34900, descuento: 0, img: 'images/p-camison-bordo.webp', alt: 'Camisón corto de satén bordó con encaje en el escote', desc: 'Camisón corto de satén bordó, con breteles finos y terminación de encaje en el escote. Los talles disponibles te los confirmamos por WhatsApp.', claves: ['camison', 'saten', 'bordo', 'lenceria', 'ropa erotica', 'encaje'] },
  { id: 'anillo', rango: 5, cat: 'vibradores', para: ['compartir'], nombre: 'Anillo vibrador con control remoto USB', pres: 'Control remoto · USB', gancho: 'Para usar en pareja y manejarlo a distancia', precio: 32900, descuento: 0, img: 'images/p-anillo.webp', alt: 'Pieza de silicona gris grafito de forma ovalada sobre fondo beige', desc: 'Anillo vibrador que se carga por USB y se maneja con un control remoto. Pensado para compartir.', claves: ['anillo', 'control', 'remoto', 'usb', 'recargable', 'pareja'] },
  { id: 'corpino-negro', rango: 6, cat: 'lenceria', para: ['vos'], nombre: 'Corpiño triangular de encaje negro', pres: 'Encaje sin aro', gancho: 'Encaje negro, sin aro y con breteles finos', precio: 19900, descuento: 0, img: 'images/p-corpino-negro.webp', alt: 'Corpiño triangular de encaje negro con breteles finos', desc: 'Corpiño triangular de encaje negro, sin aro y con breteles finos. Combina con los culottes de encaje.', claves: ['corpino', 'encaje', 'negro', 'lenceria', 'bralette', 'conjunto'] },
  { id: 'mini-kong', rango: 7, cat: 'vibradores', para: ['vos'], nombre: 'Vibrador Mini Kong 16 × 4 cm', pres: '16 × 4 cm', gancho: 'Tamaño compacto: 16 cm de largo y 4 de diámetro', precio: 27900, descuento: 0, img: 'images/p-mini-kong.webp', alt: 'Vibrador curvo color malva sobre fondo beige', desc: 'Vibrador de tamaño compacto, de 16 cm de largo por 4 cm de diámetro. Colores y tipo de pilas, por WhatsApp.', claves: ['mini kong', 'kong', 'vibrador', 'compacto', '16'] },
  { id: 'bata-marfil', rango: 8, cat: 'lenceria', para: ['vos', 'compartir'], nombre: 'Bata kimono de satén marfil', pres: 'Satén con lazo', gancho: 'Corte kimono, con lazo para atar en la cintura', precio: 42900, descuento: 0, img: 'images/p-bata-marfil.webp', alt: 'Bata corta de satén marfil doblada, con su lazo al costado', desc: 'Bata corta de satén marfil, de corte kimono y con lazo para atar en la cintura. Va sobre cualquier conjunto.', claves: ['bata', 'kimono', 'saten', 'marfil', 'lenceria', 'salida de cama'] },
  { id: 'missv-neutro', rango: 9, cat: 'geles-aceites', para: ['vos', 'compartir'], nombre: 'Gel lubricante íntimo Miss V Neutro', pres: '50 ml · Hipoalergénico', gancho: 'Base neutra e hipoalergénica', precio: 9900, descuento: 0, img: 'images/p-missv-neutro.webp', alt: 'Frasco transparente con válvula dosificadora y gel incoloro', desc: 'Gel lubricante íntimo Miss V Neutro, hipoalergénico, en envase de 50 ml.', claves: ['gel', 'lubricante', 'miss v', 'neutro', 'hipoalergenico', '50 ml'] },
  { id: 'missv-calor', rango: 10, cat: 'geles-aceites', para: ['vos', 'compartir'], nombre: 'Gel íntimo efecto calor Miss V Natural', pres: 'Lubricante · Efecto calor', gancho: 'Lubricante con efecto calor, de uso anal y vaginal', precio: 10900, descuento: 0, img: 'images/p-missv-calor.webp', alt: 'Frasco transparente con válvula dosificadora y gel de tono durazno', desc: 'Gel íntimo lubricante Miss V Natural con efecto calor, apto para uso anal y vaginal.', claves: ['gel', 'lubricante', 'miss v', 'natural', 'calor', 'anal', 'vaginal'] },
  { id: 'aceite-almendras', rango: 11, cat: 'geles-aceites', para: ['compartir'], nombre: 'Aceite para masajes · Almendras', pres: 'Aceite corporal', gancho: 'Para masajes largos, con aroma suave', precio: 12900, descuento: 0, img: 'images/p-aceite-almendras.webp', alt: 'Frasco de vidrio ámbar con válvula negra', desc: 'Aceite corporal para masajes con aroma a almendras. Se desliza fácil y deja la piel suave.', claves: ['aceite', 'masajes', 'almendras', 'corporal'] },
  { id: 'aceite-frutos', rango: 12, cat: 'geles-aceites', para: ['compartir'], nombre: 'Aceite para masajes · Frutos rojos', pres: 'Aceite corporal', gancho: 'Aroma frutal para un masaje en pareja', precio: 13900, descuento: 0, img: 'images/p-aceite-frutos.webp', alt: 'Frasco de vidrio color granate con válvula negra', desc: 'Aceite corporal para masajes con aroma a frutos rojos. Para un masaje sin apuro, a solas o en pareja.', claves: ['aceite', 'masajes', 'frutos rojos', 'corporal', 'aroma'] },
  { id: 'culotte-rosa', rango: 13, cat: 'lenceria', para: ['vos'], nombre: 'Culotte de encaje rosa', pres: 'Encaje', gancho: 'Encaje floral rosa, tiro medio', precio: 12900, descuento: 0, img: 'images/p-culotte-rosa.webp', alt: 'Culotte de encaje floral rosa sobre fondo beige', desc: 'Culotte de encaje floral rosa, de tiro medio. Los talles disponibles te los confirmamos por WhatsApp.', claves: ['culotte', 'bombacha', 'encaje', 'rosa', 'lenceria'] },
  { id: 'camison-negro', rango: 14, cat: 'lenceria', para: ['vos', 'compartir'], nombre: 'Camisón de satén negro', pres: 'Satén con encaje', gancho: 'Corto, con breteles finos y encaje en el escote', precio: 34900, descuento: 0, img: 'images/p-camison-negro.webp', alt: 'Camisón corto de satén negro con encaje en el escote', desc: 'Camisón corto de satén negro, con breteles finos y terminación de encaje en el escote. Los talles disponibles te los confirmamos por WhatsApp.', claves: ['camison', 'saten', 'negro', 'lenceria', 'ropa erotica', 'encaje'] },
  { id: 'masajeador', rango: 15, cat: 'masajeadores', para: ['vos', 'compartir'], nombre: 'Masajeador corporal de silicona', pres: 'Silicona', gancho: 'Cabezal redondeado para hombros, espalda y más', precio: 44900, descuento: 0, img: 'images/p-masajeador.webp', alt: 'Masajeador lila de formato varita sobre fondo beige', desc: 'Masajeador de silicona con cabezal redondeado, para aflojar hombros y espalda o para un masaje en pareja.', claves: ['masajeador', 'silicona', 'varita', 'wand', 'masaje', 'lila'] },
  { id: 'culotte-negro', rango: 16, cat: 'lenceria', para: ['vos'], nombre: 'Culotte de encaje negro', pres: 'Encaje', gancho: 'Encaje floral negro, tiro medio', precio: 12900, descuento: 0, img: 'images/p-culotte-negro.webp', alt: 'Culotte de encaje floral negro sobre fondo beige', desc: 'Culotte de encaje floral negro, de tiro medio. Combina con el corpiño triangular negro.', claves: ['culotte', 'bombacha', 'encaje', 'negro', 'lenceria', 'conjunto'] },
  { id: 'corpino-bordo', rango: 17, cat: 'lenceria', para: ['vos'], nombre: 'Corpiño triangular de encaje bordó', pres: 'Encaje sin aro', gancho: 'Encaje bordó, sin aro y con breteles finos', precio: 19900, descuento: 0, img: 'images/p-corpino-bordo.webp', alt: 'Corpiño triangular de encaje bordó con breteles finos', desc: 'Corpiño triangular de encaje bordó, sin aro y con breteles finos. Los talles disponibles te los confirmamos por WhatsApp.', claves: ['corpino', 'encaje', 'bordo', 'lenceria', 'bralette'] },
  { id: 'prueba-oculto', rango: 99, cat: 'lenceria', para: [], nombre: 'Producto de prueba', pres: '-', gancho: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-magic.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', claves: ['prueba'] },
];
PRODUCTOS.forEach(p => { p.cod = `VC-${String(p.rango).padStart(2, '0')}`; });
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cod, p.pres, p.gancho, p.desc, catDe(p.cat).nombre, catDe(p.cat).titulo, ...(p.para || []).map(x => nombreDe(PARA, x)), ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9-]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), para = lista(f.para), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (para.length && !(p.para || []).some(x => para.includes(x))) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/[^a-z0-9-]+/).filter(Boolean);
    const voces = indice.get(p.id) || [];
    const empieza = w => voces.some(v => v.startsWith(w));
    return palabras.every(w => empieza(w) || (w.length > 4 && w.endsWith('s') && empieza(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && empieza(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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

const Cart = {
  KEY: 'velvetcart_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || Object.keys(i).length !== 2) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

const DISCRETO_KEY = 'velvetcart_discreto';
const VELO_KEY = 'velvetcart_velo';
const Privado = {
  discreto() { try { return localStorage.getItem(DISCRETO_KEY) !== '0'; } catch { return true; } },
  setDiscreto(on) { try { localStorage.setItem(DISCRETO_KEY, on ? '1' : '0'); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('discreto:cambio')); },
};
const EJEMPLO_PEDIDO = [{ id: 'missv-neutro', qty: 1 }, { id: 'magic', qty: 1 }];
function textoPedido(items = Cart.get(), discreto = Privado.discreto()) {
  let total = 0;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    return discreto ? `• ${i.qty} × ${p.cod}` : `• ${i.qty} × ${p.nombre} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}\n¿Cómo seguimos?`;
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  ojo: SVG('<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>'),
  candado: SVG('<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M8 11v-4a4 4 0 1 1 8 0v4"/>'),
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
  const otros = ['para', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto velable"><img src="${esc(c.img)}" alt="" width="900" height="900"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')}</small></span></a></li>`;
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

const stepperHTML = (n = 1, cls = '') => `<div class="stepper${cls}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(28px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(20px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', grande = false } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const badge = p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  const img = grande && p.imgAlta ? p.imgAlta : p.img;
  const dims = grande && p.imgAlta ? 'width="900" height="1600"' : 'width="900" height="900"';
  const extra = grande ? `<p class="prod__gancho">${esc(p.gancho)}</p>` : '';
  return `<article class="prod${grande ? ' prod--grande' : ''}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media velable"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(img)}" alt="${esc(p.alt)}" ${dims} decoding="async"><span class="prod__mirar" aria-hidden="true">Ver detalle</span></button><span class="prod__cod">${esc(p.cod)}</span>${badge}${off}</div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(catDe(p.cat).nombre)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__pres">${esc(p.pres)}</p>
    ${extra}
    ${precioHTML(p, false)}
    <div class="prod-actions">${stepperHTML(1, ' stepper--card')}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
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

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto velable"><img src="${esc(p.img)}" alt="" width="900" height="900"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><b>${esc(p.cod)}</b> · ${esc(p.pres)}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${id}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
  const pintarWsp = () => { if (wsp) wsp.href = wspHref(textoPedido()); };
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    pintarWsp();
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => x.id === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('discreto:cambio', pintarWsp);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = el => {
  const out = el.closest('[data-cant]')?.querySelector('[data-qty]');
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, TOPE_LINEA));
  if (out) out.textContent = '1';
  return n;
};

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-cant] [data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, Cart.add(p, cantDe(ag)));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantDe(cm));
      window.abrirCarrito?.(cm);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { para: p.para, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const ficha = [['Código', p.cod], ['Categoría', c.titulo], ['Presentación', p.pres], ['Para', (p.para || []).map(x => nombreDe(PARA, x)).join(' · ') || '—']];
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></figure>
    <p class="qv__nota-foto">Imagen ilustrativa: el producto real puede variar. Precio de muestra.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}<span>${esc(p.cod)}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">${ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`Hola ${MARCA}! Quería consultar por el producto ${p.cod}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por ${esc(p.cod)}, sin nombrarlo</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto velable"><img src="${esc(r.img)}" alt="" width="900" height="900"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
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
      const n = Cart.add(p, cantDe(cont.querySelector('[data-cant]')));
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.cod,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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

const SIN_GELES = ['vibradores', 'masajeadores', 'lenceria'];
function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ filtros: { cat: SIN_GELES }, limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ filtros: { cat: SIN_GELES }, limite: 7 }).items.map((p, i) => cardHTML(i === 0 ? { ...p, imgAlta: 'images/h-magic.webp' } : p, { grande: i === 0 })).join('');
}
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = plural(n, 'producto', 'productos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

function gelHTML(p) {
  if (MODELO === '2') {
    return `<li class="gel-fila"${ANIMS.fila}>
      <button type="button" class="gel-fila__foto velable" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="900" height="900"></button>
      <div class="gel-fila__txt"><h3><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3><p>${esc(p.pres)} · <span>${esc(p.cod)}</span></p></div>
      <p class="gel-fila__precio">${formatearPrecio(precioFinal(p))}</p>
      <button type="button" class="btn btn--cta btn--sm gel-fila__add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
    </li>`;
  }
  return `<li class="gel"${ANIMS.subir}>
    <button type="button" class="gel__foto velable" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></button>
    <div class="gel__txt" data-cant>
      <p class="gel__cod">${esc(p.cod)} · ${esc(p.pres)}</p>
      <h3 class="gel__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="gel__gancho">${esc(p.gancho)}</p>
      <div class="gel__pie">${precioHTML(p, false)}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    </div>
  </li>`;
}
function initGeles() {
  const cont = document.querySelector('[data-geles]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ filtros: { cat: 'geles-aceites' }, limite: 4 }).items.map(gelHTML).join('');
}

function initPrivado() {
  const sync = () => {
    const on = Privado.discreto();
    document.querySelectorAll('[data-discreto]').forEach(c => { c.checked = on; });
  };
  document.addEventListener('change', e => {
    const c = e.target.closest('[data-discreto]');
    if (!c) return;
    Privado.setDiscreto(c.checked);
  });
  document.addEventListener('discreto:cambio', sync);
  sync();
  const box = document.querySelector('[data-msj]');
  if (!box) return;
  const texto = box.querySelector('[data-msj-texto]');
  const nota = box.querySelector('[data-msj-nota]');
  const cta = box.querySelector('[data-msj-cta]');
  const ctaTxt = cta.querySelector('span');
  const pintar = () => {
    const items = Cart.get();
    const vacio = !items.length;
    const on = Privado.discreto();
    texto.textContent = textoPedido(vacio ? EJEMPLO_PEDIDO : items, on);
    box.classList.toggle('is-discreto', on);
    nota.textContent = vacio
      ? (on ? 'Ejemplo con dos productos. Solo viajan los códigos y el total.' : 'Ejemplo con dos productos. Así se lee con los nombres.')
      : (on ? `Tu carrito, con ${plural(Cart.count(), 'producto', 'productos')}: solo viajan los códigos y el total.` : `Tu carrito, con ${plural(Cart.count(), 'producto', 'productos')}, con los nombres a la vista.`);
    if (vacio) {
      cta.href = CATALOGO_URL;
      cta.removeAttribute('target');
      cta.removeAttribute('rel');
      ctaTxt.textContent = 'Elegir mis productos';
    } else {
      cta.href = wspHref(textoPedido(items, on));
      cta.target = '_blank';
      cta.rel = 'noopener';
      ctaTxt.textContent = 'Enviar mi pedido por WhatsApp';
    }
    cta.classList.toggle('is-wsp', !vacio);
  };
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('discreto:cambio', pintar);
  pintar();
}

function initVelo() {
  const btns = document.querySelectorAll('[data-velo]');
  if (!btns.length) return;
  let on = false;
  try { on = localStorage.getItem(VELO_KEY) === '1'; } catch (err) { void err; }
  const aplicar = () => {
    document.documentElement.classList.toggle('velo', on);
    btns.forEach(b => { b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Vista discreta activada: mostrar las fotos' : 'Vista discreta: velar las fotos'); });
  };
  aplicar();
  btns.forEach(b => b.addEventListener('click', () => {
    on = !on;
    aplicar();
    try { localStorage.setItem(VELO_KEY, on ? '1' : '0'); } catch (err) { void err; }
    showToast(on ? 'Vista discreta: las fotos quedan veladas hasta que pasás por encima.' : 'Listo, las fotos vuelven a verse.');
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
  const GRUPOS = { cat: CATEGORIAS, para: PARA, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    para: valida(params.get('para'), PARA),
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
  const opcion = (grupo, item, marcado, n) => (grupo === 'cat' && MODELO === '2'
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('para')) return PARA.find(x => x.id === e.para[0])?.nombre || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los productos';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, productos para adultos`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
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
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
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
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => hero.classList.add('is-listo') });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('.hero1__onda', { scaleX: 0.7, opacity: 0, transformOrigin: '100% 50%', duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__foto', { y: 36, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.05);
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  const velo = hero.querySelector('.hero__velo');
  if (velo) tl.to(velo, { yPercent: -101, duration: 1.4, ease: 'power3.inOut' }, 0.15);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 30, opacity: 0, duration: 1.1 }, 0.22);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.4);
  desdeA('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desdeA('.hero__datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.hero__placa', { y: -14, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.7);
  desdeA('.hero__ficha', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initRail, initDestacados, initGeles, initCategoriasCuenta, initMenuCategorias, initCatalogo, initPrivado, initVelo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
