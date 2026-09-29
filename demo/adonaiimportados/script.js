const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492233423167';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const SECCIONES = [
  { id: 'zapatillas', nro: '01', nombre: 'Zapatillas brasileras', corto: 'Zapatillas', escena: 'images/zapatillas.webp', w: 1254, h: 1254,
    alt: 'Tres pares de zapatillas urbanas de cuero, negra, blanca y arena, sobre bloques blancos',
    titulo: 'Hechas para <em>caminar la ciudad</em>', bajada: 'Urbanas de cuero, blancas con gamuza, arena y de plataforma.' },
  { id: 'indumentaria', nro: '02', nombre: 'Indumentaria', corto: 'Indumentaria', escena: 'images/indumentaria.webp', w: 1254, h: 1254,
    alt: 'Sweaters tejidos, camisa blanca, campera bomber, pantalón chino azul y zapatillas blancas sobre una mesa',
    titulo: 'Básicos que <em>combinan solos</em>', bajada: 'Sweater acanalado, camisa blanca, bomber de gabardina y chino azul noche.' },
  { id: 'perfumeria', nro: '03', nombre: 'Perfumería', corto: 'Perfumería', escena: 'images/perfumeria.webp', w: 941, h: 1672,
    alt: 'Frascos de perfume dorado, rosado y facetado junto a un difusor de varillas sobre mármol',
    titulo: 'Un frasco que <em>queda a la vista</em>', bajada: 'Perfumes floral, rosé y oriental, y un difusor de varillas para la casa.' },
  { id: 'blanqueria', nro: '04', nombre: 'Blanquería', corto: 'Blanquería', escena: 'images/blanqueria.webp', w: 1254, h: 1254,
    alt: 'Toallas apiladas, manta con flecos, acolchado y almohadones en tonos crudos',
    titulo: 'La cama <em>recién tendida</em>', bajada: 'Toallas de algodón, manta con flecos, acolchado y fundas de lino.' },
  { id: 'bazar', nro: '05', nombre: 'Bazar', corto: 'Bazar', escena: 'images/bazar.webp', w: 1254, h: 1254,
    alt: 'Vajilla de gres moteado, tazas, copas rayadas y jarra de vidrio sobre mármol',
    titulo: 'La mesa <em>de todos los días</em>', bajada: 'Vajilla de gres moteado, ensaladera, tazas y copas con filete dorado.' },
  { id: 'electronica', nro: '06', nombre: 'Electrónica', corto: 'Electrónica', escena: 'images/electronica.webp', w: 1672, h: 941,
    alt: 'Auriculares de vincha, reloj inteligente, parlante portátil y auriculares inalámbricos en tonos claros',
    titulo: 'Tu música, <em>sin cables</em>', bajada: 'Auriculares de vincha e inalámbricos, reloj inteligente y parlante portátil.' }
];

const PARA = { ella: 'para ella', el: 'para él', casa: 'para la casa' };
const TALLES_CALZADO = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const PRODUCTOS = [
  { id: 'zap-blanca', seccion: 'zapatillas', nombre: 'Zapatilla blanca con gamuza gris', precio: 115000, descuento: 10, stock: 4, img: 'images/p-zap-blanca.webp', w: 734, h: 734, talles: TALLES_CALZADO.slice(0, 9), para: ['ella', 'el'],
    alt: 'Zapatilla urbana de cuero blanco con detalles de gamuza gris', desc: 'Capellada de cuero blanco con puntera y talón de gamuza gris. Suela de goma cosida y plantilla acolchada.' },
  { id: 'per-dorado', seccion: 'perfumeria', nombre: 'Perfume floral, frasco dorado 100 ml', precio: 89900, descuento: 0, stock: 5, img: 'images/p-per-dorado.webp', w: 640, h: 640, para: ['ella'],
    alt: 'Frasco de perfume en forma de gota con cuello dorado y tapa de cristal', desc: 'Eau de parfum de salida floral y fondo cálido. Frasco de vidrio con cuello dorado y tapa de cristal.' },
  { id: 'bla-manta', seccion: 'blanqueria', nombre: 'Manta tejida con flecos', precio: 49900, descuento: 0, stock: 6, img: 'images/p-bla-manta.webp', w: 554, h: 554, para: ['casa', 'ella'],
    alt: 'Manta tejida color crudo con flecos sobre una manta gris de punto', desc: 'Tejido de algodón color crudo con flecos anudados. Para el pie de la cama o el sillón.' },
  { id: 'ele-reloj', seccion: 'electronica', nombre: 'Reloj inteligente con malla de silicona', precio: 149000, descuento: 10, stock: 3, img: 'images/p-ele-reloj.webp', w: 460, h: 460, para: ['el', 'ella'],
    alt: 'Reloj inteligente de caja clara con malla de silicona crema', desc: 'Pantalla táctil, notificaciones del celular y registro de actividad. Malla de silicona color crema.' },
  { id: 'ind-bomber', seccion: 'indumentaria', nombre: 'Campera bomber de gabardina', precio: 98000, descuento: 15, stock: 5, img: 'images/p-ind-bomber.webp', w: 640, h: 640, talles: ['M', 'L', 'XL'], para: ['el'],
    alt: 'Campera bomber beige de gabardina con cierre y puños elastizados', desc: 'Gabardina color arena con cierre metálico, cuello alto y puños elastizados.' },
  { id: 'baz-vajilla', seccion: 'bazar', nombre: 'Vajilla de gres moteado, 16 piezas', precio: 89900, descuento: 0, stock: 4, img: 'images/p-baz-vajilla.webp', w: 780, h: 780, para: ['casa'],
    alt: 'Platos y bowls de gres moteado con borde tostado apilados', desc: 'Platos playos, de postre, bowls y tazas de gres esmaltado con borde tostado. Aptos para lavavajillas.' },
  { id: 'zap-negra', seccion: 'zapatillas', nombre: 'Zapatilla urbana de cuero negro', precio: 119900, descuento: 0, stock: 6, img: 'images/p-zap-negra.webp', w: 720, h: 720, talles: TALLES_CALZADO.slice(1), para: ['el', 'ella'],
    alt: 'Zapatilla urbana de cuero negro con suela crema', desc: 'Cuero negro liso con puntera perforada y suela crema cosida. Horma cómoda para todo el día.' },
  { id: 'per-difusor', seccion: 'perfumeria', nombre: 'Difusor de varillas ámbar 200 ml', precio: 29900, descuento: 0, stock: 12, img: 'images/p-per-difusor.webp', w: 511, h: 511, para: ['casa'],
    alt: 'Difusor de vidrio con varillas de madera y tapa dorada', desc: 'Frasco de vidrio con tapa dorada y varillas de ratán. Aroma ámbar suave para el living o el dormitorio.' },
  { id: 'ind-sweater', seccion: 'indumentaria', nombre: 'Sweater de hilo acanalado crudo', precio: 54900, descuento: 0, stock: 9, img: 'images/p-ind-sweater.webp', w: 620, h: 620, talles: ['S', 'M', 'L', 'XL'], para: ['el', 'ella'],
    alt: 'Sweaters de hilo acanalado doblados en crudo, gris y azul noche', desc: 'Hilo de algodón acanalado, cuello redondo y puños al tono. Color crudo.' },
  { id: 'ele-vincha', seccion: 'electronica', nombre: 'Auriculares de vincha inalámbricos', precio: 129900, descuento: 0, stock: 4, img: 'images/p-ele-vincha.webp', w: 720, h: 720, para: ['el', 'ella'],
    alt: 'Auriculares de vincha inalámbricos color crema', desc: 'Almohadillas acolchadas, conexión bluetooth y estuche rígido. Terminación color crema.' },
  { id: 'bla-toallas', seccion: 'blanqueria', nombre: 'Juego de toallas de algodón, 4 piezas', precio: 39900, descuento: 0, stock: 10, img: 'images/p-bla-toallas.webp', w: 660, h: 660, para: ['casa'],
    alt: 'Toallas de algodón apiladas en gris, crudo y arena', desc: 'Dos toallas y dos toallones de rizo de algodón, con guarda tejida. En gris, crudo y arena.' },
  { id: 'baz-copas', seccion: 'bazar', nombre: 'Copas de vidrio rayado con filete dorado, x4', precio: 36900, descuento: 0, stock: 6, img: 'images/p-baz-copas.webp', w: 600, h: 600, para: ['casa'],
    alt: 'Copas de vidrio rayado con borde dorado junto a una jarra de vidrio', desc: 'Cuatro copas de vidrio rayado con filete dorado en el borde. Para agua o vino.' },
  { id: 'zap-arena', seccion: 'zapatillas', nombre: 'Zapatilla arena y crudo', precio: 109900, descuento: 0, stock: 3, img: 'images/p-zap-arena.webp', w: 620, h: 620, talles: TALLES_CALZADO.slice(0, 7), para: ['ella'],
    alt: 'Zapatilla de cuero crudo con paneles de gamuza color arena', desc: 'Cuero crudo con paneles de gamuza arena y suela en dos tonos.' },
  { id: 'per-facetado', seccion: 'perfumeria', nombre: 'Perfume oriental, frasco facetado 90 ml', precio: 83000, descuento: 10, stock: 2, img: 'images/p-per-facetado.webp', w: 400, h: 400, para: ['ella', 'el'],
    alt: 'Frasco de perfume facetado color ámbar con tapa dorada', desc: 'Fragancia oriental con notas de ámbar y vainilla. Frasco facetado con tapa dorada.' },
  { id: 'ind-camisa', seccion: 'indumentaria', nombre: 'Camisa blanca de algodón', precio: 46900, descuento: 0, stock: 7, img: 'images/p-ind-camisa.webp', w: 680, h: 680, talles: ['S', 'M', 'L', 'XL', 'XXL'], para: ['el'],
    alt: 'Camisa blanca de algodón doblada', desc: 'Algodón liviano, cuello clásico y bolsillo en el pecho. Calce recto.' },
  { id: 'ele-parlante', seccion: 'electronica', nombre: 'Parlante bluetooth portátil', precio: 89900, descuento: 0, stock: 7, img: 'images/p-ele-parlante.webp', w: 760, h: 760, para: ['el', 'casa'],
    alt: 'Parlante bluetooth cilíndrico de tela gris con correa', desc: 'Cuerpo de tela gris con correa para colgar y carga por USB-C.' },
  { id: 'bla-acolchado', seccion: 'blanqueria', nombre: 'Acolchado liviano color arena, 2 plazas', precio: 119900, descuento: 0, stock: 3, img: 'images/p-bla-acolchado.webp', w: 554, h: 554, para: ['casa'],
    alt: 'Acolchado doblado color arena junto a una manta tejida', desc: 'Relleno liviano y funda de microfibra color arena. Medida 2 plazas.' },
  { id: 'baz-ensaladera', seccion: 'bazar', nombre: 'Ensaladera de gres con borde dorado', precio: 19900, descuento: 0, stock: 11, img: 'images/p-baz-ensaladera.webp', w: 560, h: 560, para: ['casa'],
    alt: 'Ensaladera de gres moteado con frutos rojos sobre una tabla de madera', desc: 'Gres esmaltado moteado con borde tostado. Para ensaladas, frutas o para servir.' },
  { id: 'zap-plataforma', seccion: 'zapatillas', nombre: 'Zapatilla blanca de plataforma', precio: 98900, descuento: 0, stock: 8, img: 'images/p-zap-plataforma.webp', w: 520, h: 520, talles: TALLES_CALZADO.slice(0, 6), para: ['ella'],
    alt: 'Zapatillas blancas de plataforma con talón de gamuza arena', desc: 'Cuero blanco con talón de gamuza arena y plataforma liviana.' },
  { id: 'ind-chino', seccion: 'indumentaria', nombre: 'Pantalón chino azul noche', precio: 52900, descuento: 0, stock: 6, img: 'images/p-ind-chino.webp', w: 444, h: 444, talles: ['40', '42', '44', '46'], para: ['el'],
    alt: 'Pantalón chino azul noche doblado', desc: 'Gabardina de algodón con un toque de elastano. Tiro medio y botón metálico.' },
  { id: 'per-rose', seccion: 'perfumeria', nombre: 'Perfume rosé, frasco cuadrado 100 ml', precio: 74900, descuento: 0, stock: 7, img: 'images/p-per-rose.webp', w: 620, h: 620, para: ['ella'],
    alt: 'Frasco cuadrado de perfume rosado con tapa de cristal', desc: 'Fragancia de rosa y frutos rojos en frasco cuadrado de vidrio grueso.' },
  { id: 'bla-almohadones', seccion: 'blanqueria', nombre: 'Fundas de almohadón de lino, x2', precio: 24900, descuento: 0, stock: 14, img: 'images/p-bla-almohadones.webp', w: 600, h: 600, para: ['casa'],
    alt: 'Almohadones blancos y de lino crudo sobre una cama', desc: 'Dos fundas de lino color crudo con cierre oculto. Medida 50 × 50 cm.' },
  { id: 'baz-taza', seccion: 'bazar', nombre: 'Tazas de gres 350 ml, x2', precio: 18900, descuento: 0, stock: 16, img: 'images/p-baz-taza.webp', w: 440, h: 440, para: ['casa'],
    alt: 'Taza de gres moteado con borde tostado', desc: 'Dos tazas de gres moteado con borde tostado. Capacidad 350 ml cada una.' },
  { id: 'ele-inear', seccion: 'electronica', nombre: 'Auriculares inalámbricos con estuche de carga', precio: 69900, descuento: 0, stock: 9, img: 'images/p-ele-inear.webp', w: 420, h: 420, para: ['ella', 'el'],
    alt: 'Auriculares inalámbricos blancos fuera de su estuche', desc: 'Auriculares in-ear con estuche de carga y micrófono para llamadas.' }
];

const RAIL = ['zap-blanca', 'ind-bomber', 'per-facetado', 'ele-reloj', 'bla-manta', 'baz-vajilla', 'zap-negra', 'per-dorado'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getSeccion = id => SECCIONES.find(s => s.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'adonaiimportados_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const libre = (producto.stock ?? 99) - this.enCarrito(producto.id);
    const suma = Math.max(0, Math.min(qty, libre));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.talle || '') === talle);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, talle, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.talle || '') === talle); if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otros)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle || '') === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function sanearCarrito() {
  let items;
  try { items = JSON.parse(localStorage.getItem(Cart.KEY)) || []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  const limpios = [];
  items.forEach(i => {
    const p = i && getProducto(i.id);
    if (!p) return;
    const talle = p.talles && p.talles.includes(i.talle) ? i.talle : '';
    if (p.talles && !talle) return;
    const ya = limpios.filter(x => x.id === p.id).reduce((s, x) => s + x.qty, 0);
    const qty = Math.min(Math.max(1, Number(i.qty) || 1), p.stock - ya);
    if (qty > 0) limpios.push({ id: p.id, talle, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { return; }
}

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

const ICONO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

function precioHTML(p, clase = 'precio') {
  const final = precioFinal(p);
  return `<p class="${clase}"><span class="${clase}__f">${formatearPrecio(final)}</span>${p.descuento > 0 ? `<s class="${clase}__o">${formatearPrecio(p.precio)}</s><span class="${clase}__d">−${p.descuento}%</span>` : ''}</p>`;
}

function stockHTML(p) {
  const libre = p.stock - Cart.enCarrito(p.id);
  if (p.stock <= 0) return '<p class="stock stock--sin">Sin stock</p>';
  if (libre <= 0) return '<p class="stock stock--sin">Todo en tu carrito</p>';
  return p.stock <= 3 ? `<p class="stock stock--poco">Quedan ${p.stock}</p>` : '<p class="stock">En stock</p>';
}

/* ---------- tarjeta de producto ---------- */
function cardHTML(p, extra = '', animar = true) {
  const s = getSeccion(p.seccion);
  const conTalle = Boolean(p.talles);
  const libre = p.stock - Cart.enCarrito(p.id);
  const accion = conTalle
    ? `<button type="button" class="btn btn--solid btn--sm card__add" data-quick="${p.id}">Elegir talle</button>`
    : `<button type="button" class="btn btn--solid btn--sm card__add" data-add="${p.id}"${libre <= 0 ? ' disabled' : ''}>${ICONO_MAS}<span class="card__add-t">Agregar</span></button>`;
  return `<article class="card${extra}" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
    <div class="card__img">
      <img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}">
      ${p.descuento > 0 ? `<span class="card__badge">−${p.descuento}%</span>` : ''}
      <button type="button" class="card__quick" data-quick="${p.id}" tabindex="-1" aria-hidden="true">Vista rápida</button>
    </div>
    <div class="card__body">
      <p class="card__sec">${esc(s.corto)}</p>
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="card__fila">${precioHTML(p)}${stockHTML(p)}</div>
      <div class="card__acts">
        ${conTalle ? '' : `<div class="stepper" data-stepper="${p.id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`}
        ${accion}
      </div>
      <button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

/* ---------- catálogo ---------- */
const PASO = 16;
let visibles = PASO;
const FILTRO = { q: '', secciones: new Set(), precio: new Set(), talle: '', stock: false, para: '', tope: 0, orden: 'destacados' };
const RANGOS = { hasta30: [0, 30000], de30a80: [30001, 80000], mas80: [80001, Infinity] };

function textoDe(p) {
  const s = getSeccion(p.seccion);
  return normal([p.nombre, s.nombre, s.corto, p.desc, ...(p.talles || []), ...(p.para || []).map(x => PARA[x])].join(' '));
}

function filtrar() {
  const palabras = normal(FILTRO.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (FILTRO.secciones.size && !FILTRO.secciones.has(p.seccion)) return false;
    if (FILTRO.precio.size && ![...FILTRO.precio].some(r => { const [a, b] = RANGOS[r]; const f = precioFinal(p); return f >= a && f <= b; })) return false;
    if (FILTRO.talle && !(p.talles || []).includes(FILTRO.talle)) return false;
    if (FILTRO.stock && p.stock <= 0) return false;
    if (FILTRO.para && !(p.para || []).includes(FILTRO.para)) return false;
    if (FILTRO.tope && precioFinal(p) > FILTRO.tope) return false;
    if (palabras.length) { const t = textoDe(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  if (FILTRO.orden === 'menor') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (FILTRO.orden === 'mayor') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (FILTRO.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}

function tituloTienda() {
  if (FILTRO.para) return `Regalos ${PARA[FILTRO.para]}`;
  if (FILTRO.secciones.size === 1) return getSeccion([...FILTRO.secciones][0]).nombre;
  return 'Toda la tienda';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.para) pills.push(['para', `Regalos ${PARA[FILTRO.para]}${FILTRO.tope ? ` hasta ${formatearPrecio(FILTRO.tope)}` : ''}`]);
  if (FILTRO.q) pills.push(['q', `«${FILTRO.q}»`]);
  if (FILTRO.talle) pills.push(['talle', `Talle ${FILTRO.talle}`]);
  cont.innerHTML = pills.map(([k, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('');
  cont.hidden = !pills.length;
}

function sincronizarControles() {
  document.querySelectorAll('input[data-f="seccion"]').forEach(c => { c.checked = FILTRO.secciones.has(c.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(c => { c.checked = FILTRO.precio.has(c.value); });
  document.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === FILTRO.talle)));
  const stock = document.getElementById('f-stock');
  if (stock) stock.checked = FILTRO.stock;
  const una = FILTRO.secciones.size === 1 ? [...FILTRO.secciones][0] : '';
  document.querySelectorAll('.tienda-chips [data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === una && !(FILTRO.secciones.size > 1))));
  const q = document.getElementById('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
}

function pintarCatalogo(reiniciar = true, yaVistos = 0) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  if (reiniciar) visibles = PASO;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, visibles).map((p, k) => cardHTML(p, '', k >= yaVistos)).join('');
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const count = document.getElementById('cat-count');
  if (count) count.textContent = lista.length ? plural(lista.length, 'producto', 'productos') : 'Sin resultados';
  const tit = document.getElementById('t-tienda');
  if (tit) tit.textContent = tituloTienda();
  const mas = document.getElementById('ver-mas');
  const masN = document.getElementById('mas-n');
  const quedan = lista.length - visibles;
  if (mas) mas.hidden = quedan <= 0;
  if (masN) masN.textContent = quedan > 0 ? `Mostrando ${visibles} de ${lista.length}` : (lista.length > PASO ? `Estás viendo los ${lista.length}` : '');
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function filtrarSeccion(cat, ir = true) {
  FILTRO.secciones = cat ? new Set([cat]) : new Set();
  FILTRO.q = ''; FILTRO.para = ''; FILTRO.tope = 0; FILTRO.talle = ''; FILTRO.precio = new Set();
  pintarCatalogo();
  if (ir) irATienda();
}

function limpiarFiltros() {
  FILTRO.q = ''; FILTRO.secciones = new Set(); FILTRO.precio = new Set(); FILTRO.talle = '';
  FILTRO.stock = false; FILTRO.para = ''; FILTRO.tope = 0;
  pintarCatalogo();
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim(); pintarCatalogo(); }, 180); });
  document.getElementById('busca-form')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value.trim() : '';
    pintarCatalogo();
    irATienda();
  });
  document.querySelectorAll('input[data-f="seccion"]').forEach(c => c.addEventListener('change', () => {
    if (c.checked) FILTRO.secciones.add(c.value); else FILTRO.secciones.delete(c.value);
    pintarCatalogo();
  }));
  document.querySelectorAll('input[data-f="precio"]').forEach(c => c.addEventListener('change', () => {
    if (c.checked) FILTRO.precio.add(c.value); else FILTRO.precio.delete(c.value);
    pintarCatalogo();
  }));
  document.querySelectorAll('[data-talle]').forEach(b => b.addEventListener('click', () => {
    FILTRO.talle = FILTRO.talle === b.dataset.talle ? '' : b.dataset.talle;
    pintarCatalogo();
  }));
  document.getElementById('f-stock')?.addEventListener('change', e => { FILTRO.stock = e.target.checked; pintarCatalogo(); });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('f-clear')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacio-reset')?.addEventListener('click', limpiarFiltros);
  document.getElementById('ver-mas')?.addEventListener('click', () => { const antes = visibles; visibles += PASO; pintarCatalogo(false, antes); });
  document.getElementById('pills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro;
    if (k === 'para') { FILTRO.para = ''; FILTRO.tope = 0; }
    if (k === 'q') FILTRO.q = '';
    if (k === 'talle') FILTRO.talle = '';
    pintarCatalogo();
  });
  pintarCatalogo();
}

function initFiltrosMobile() {
  const panel = document.getElementById('filtros');
  const toggle = document.getElementById('filtrosToggle');
  if (!panel || !toggle) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = null;
  const cerrar = () => {
    panel.classList.remove('open');
    bd?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const abrir = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    panel.removeAttribute('inert');
    panel.classList.add('open');
    bd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  toggle.addEventListener('click', () => (panel.classList.contains('open') ? cerrar() : abrir()));
  document.getElementById('filtrosClose')?.addEventListener('click', () => { cerrar(); toggle.focus(); });
  document.getElementById('filtrosVer')?.addEventListener('click', () => { cerrar(); irATienda(); });
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); toggle.focus(); }
    if (e.key === 'Tab') trap(e, panel);
  });
  const sync = () => {
    if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrar(); }
  };
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- carrusel ---------- */
function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail');
  if (!track || !vp) return;
  track.innerHTML = RAIL.map(getProducto).filter(Boolean).map(p => cardHTML(p, ' card--rail')).join('');
  initRailDrag(vp);
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => (track.querySelector('.card')?.getBoundingClientRect().width || 280) + 24;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { moved = true; }
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

/* ---------- guía de regalos ---------- */
const GUIA = { para: 'ella', tope: 90000 };

function candidatosRegalo() {
  return PRODUCTOS
    .filter(p => p.stock > 0 && (p.para || []).includes(GUIA.para) && precioFinal(p) <= GUIA.tope)
    .sort((a, b) => precioFinal(b) - precioFinal(a));
}

function destacarRegalos(todos) {
  const vistas = new Set();
  const primeros = todos.filter(p => !vistas.has(p.seccion) && vistas.add(p.seccion));
  return primeros.concat(todos.filter(p => !primeros.includes(p))).slice(0, 3);
}

function pintarGuia() {
  const lista = document.getElementById('regalos-lista');
  if (!lista) return;
  const todos = candidatosRegalo();
  const n = document.getElementById('regalos-n');
  const ver = document.getElementById('regalos-ver');
  const vacio = document.getElementById('regalos-vacio');
  const tope = document.getElementById('tope');
  const topeV = document.getElementById('tope-v');
  if (topeV) topeV.textContent = formatearPrecio(GUIA.tope);
  if (tope) {
    const min = Number(tope.min) || 0; const max = Number(tope.max) || 1;
    tope.style.setProperty('--p', `${((GUIA.tope - min) / (max - min)) * 100}%`);
    tope.setAttribute('aria-valuetext', `Hasta ${formatearPrecio(GUIA.tope)}`);
  }
  if (n) n.innerHTML = todos.length
    ? `<b>${plural(todos.length, 'regalo', 'regalos')}</b> ${PARA[GUIA.para]} hasta ${formatearPrecio(GUIA.tope)}`
    : `Todavía no hay regalos ${PARA[GUIA.para]} hasta ${formatearPrecio(GUIA.tope)}`;
  lista.innerHTML = destacarRegalos(todos).map(p => {
    const s = getSeccion(p.seccion);
    return `<li class="regalo">
      <button type="button" class="regalo__img" data-quick="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" width="${p.w}" height="${p.h}" alt=""></button>
      <div class="regalo__txt">
        <p class="regalo__sec">${esc(s.corto)}</p>
        <p class="regalo__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></p>
        ${precioHTML(p, 'rprecio')}
      </div>
      ${p.talles ? `<button type="button" class="btn btn--line btn--sm" data-quick="${p.id}">Elegir talle</button>` : `<button type="button" class="btn btn--line btn--sm" data-add="${p.id}">Agregar</button>`}
    </li>`;
  }).join('');
  lista.hidden = !todos.length;
  if (vacio) {
    const baratos = PRODUCTOS.filter(p => p.stock > 0 && (p.para || []).includes(GUIA.para)).map(precioFinal);
    const minimo = baratos.length ? Math.min(...baratos) : 0;
    vacio.hidden = Boolean(todos.length);
    vacio.innerHTML = todos.length ? '' : `El primero ${PARA[GUIA.para]} arranca en ${formatearPrecio(minimo)}. <button type="button" class="link-btn" data-subir-tope="${Math.ceil(minimo / 5000) * 5000}">Subir el tope a ${formatearPrecio(Math.ceil(minimo / 5000) * 5000)}</button>`;
  }
  if (ver) {
    ver.hidden = !todos.length;
    ver.textContent = todos.length === 1 ? 'Ver el regalo en la tienda' : `Ver los ${todos.length} en la tienda`;
  }
  const wsp = document.getElementById('regalos-wsp');
  if (wsp) wsp.href = wspLink(`Hola! Estoy buscando un regalo ${PARA[GUIA.para]} de hasta ${formatearPrecio(GUIA.tope)}. ¿Qué me recomendás?`);
}

function initGuia() {
  const root = document.getElementById('regalos');
  if (!root) return;
  root.querySelectorAll('input[name="para"]').forEach(r => r.addEventListener('change', () => { if (r.checked) { GUIA.para = r.value; pintarGuia(); } }));
  const tope = document.getElementById('tope');
  tope?.addEventListener('input', () => { GUIA.tope = Number(tope.value) || GUIA.tope; pintarGuia(); });
  root.addEventListener('click', e => {
    const sub = e.target.closest('[data-subir-tope]');
    if (!sub) return;
    GUIA.tope = Number(sub.dataset.subirTope);
    if (tope) tope.value = String(GUIA.tope);
    pintarGuia();
  });
  document.getElementById('regalos-ver')?.addEventListener('click', e => {
    e.preventDefault();
    FILTRO.secciones = new Set(); FILTRO.precio = new Set(); FILTRO.talle = ''; FILTRO.q = '';
    FILTRO.para = GUIA.para; FILTRO.tope = GUIA.tope;
    pintarCatalogo();
    irATienda();
  });
  const marcado = root.querySelector('input[name="para"]:checked');
  if (marcado) GUIA.para = marcado.value;
  if (tope) GUIA.tope = Number(tope.value) || GUIA.tope;
  pintarGuia();
}

/* ---------- las seis secciones (momento) ---------- */
const SLOTS = 6;
let pisoActual = -1;

function datoSeccion(id) {
  const ps = PRODUCTOS.filter(p => p.seccion === id);
  return { n: ps.length, desde: Math.min(...ps.map(precioFinal)) };
}

function pintarPiso(i) {
  const s = SECCIONES[i];
  if (!s) return;
  const d = datoSeccion(s.id);
  const txt = document.getElementById('piso-txt');
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('piso-n', s.nro);
  set('piso-nombre', esc(s.nombre));
  set('piso-titulo', s.titulo);
  set('piso-bajada', esc(s.bajada));
  set('piso-dato', `<b>${plural(d.n, 'producto', 'productos')}</b> desde ${formatearPrecio(d.desde)}`);
  const cta = document.getElementById('piso-cta');
  if (cta) { cta.dataset.cat = s.id; cta.textContent = `Ver los ${d.n} de ${s.corto}`; }
  if (txt && !reduceMotion) { txt.classList.remove('is-cambio'); void txt.offsetWidth; txt.classList.add('is-cambio'); }
  document.querySelectorAll('.piso-marca').forEach((m, k) => m.classList.toggle('on', k === i));
}

function recomponer(i) {
  const mosaico = document.getElementById('mosaico');
  if (!mosaico) return;
  const tiles = [...mosaico.querySelectorAll('.tile')];
  const antes = new Map(tiles.map(t => [t, t.getBoundingClientRect()]));
  tiles.forEach((t, k) => {
    const slot = (k - i + SLOTS) % SLOTS;
    t.dataset.slot = String(slot);
    t.classList.toggle('is-activa', slot === 0);
    t.tabIndex = slot === 0 ? -1 : 0;
  });
  if (reduceMotion || pisoActual < 0) return;
  tiles.forEach(t => {
    const a = antes.get(t);
    const b = t.getBoundingClientRect();
    if (!b.width) return;
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    const s = a.width / b.width;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(s - 1) < 0.01) return;
    t.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  });
}

function irAPiso(i) {
  const cont = document.getElementById('pisos');
  if (!cont) return;
  const off = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const recorrido = cont.offsetHeight - (window.innerHeight - off);
  const top = cont.getBoundingClientRect().top + window.scrollY - off + recorrido * ((i + 0.5) / SLOTS);
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initPisos() {
  const cont = document.getElementById('pisos');
  const mosaico = document.getElementById('mosaico');
  if (!cont || !mosaico) return;
  mosaico.addEventListener('click', e => {
    const t = e.target.closest('.tile');
    if (t && t.dataset.slot !== '0') irAPiso(Number(t.dataset.i));
  });
  let frame = 0;
  const medir = () => {
    frame = 0;
    const off = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const r = cont.getBoundingClientRect();
    const recorrido = cont.offsetHeight - (window.innerHeight - off);
    const p = recorrido > 0 ? Math.min(1, Math.max(0, (off - r.top) / recorrido)) : 0;
    const i = Math.min(SLOTS - 1, Math.floor(p * SLOTS));
    const barra = document.getElementById('piso-barra');
    if (barra) barra.style.transform = `scaleX(${(i + 1) / SLOTS})`;
    if (i === pisoActual) return;
    recomponer(i);
    pintarPiso(i);
    pisoActual = i;
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  medir();
}

/* ---------- portada con vitrinas (modelo 2) ---------- */
function initVitrinas() {
  const cont = document.getElementById('vitrinas');
  if (!cont) return;
  const slides = [...cont.querySelectorAll('.vitrina')];
  const puntos = [...document.querySelectorAll('[data-vitrina]')];
  if (slides.length < 2) return;
  let i = 0;
  let timer = 0;
  let pausa = false;
  const mostrar = k => {
    i = (k + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === i;
      s.classList.toggle('on', on);
      s.setAttribute('aria-hidden', String(!on));
      s.querySelectorAll('a, button').forEach(el => { el.tabIndex = on ? 0 : -1; });
    });
    puntos.forEach((p, n) => { p.setAttribute('aria-pressed', String(n === i)); p.classList.toggle('on', n === i); });
  };
  const programar = () => {
    clearTimeout(timer);
    if (reduceMotion || pausa) return;
    timer = setTimeout(() => { mostrar(i + 1); programar(); }, 6000);
  };
  puntos.forEach((p, n) => p.addEventListener('click', () => { mostrar(n); programar(); }));
  cont.addEventListener('mouseenter', () => { pausa = true; clearTimeout(timer); });
  cont.addEventListener('mouseleave', () => { pausa = false; programar(); });
  cont.addEventListener('focusin', () => { pausa = true; clearTimeout(timer); });
  cont.addEventListener('focusout', () => { pausa = false; programar(); });
  mostrar(0);
  programar();
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const libre = p.stock - Cart.enCarrito(p.id);
  return `<div class="linea">
    <div class="linea__img"><img src="${p.img}" width="${p.w}" height="${p.h}" alt=""></div>
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">${esc(getSeccion(p.seccion).corto)}${i.talle ? ` · Talle ${esc(i.talle)}` : ''}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea"><button type="button" data-linea="-1" data-id="${p.id}" data-talle="${esc(i.talle || '')}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" data-talle="${esc(i.talle || '')}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-talle="${esc(i.talle || '')}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Empezá por una sección.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver la tienda</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (foot) {
    foot.hidden = false;
    const tot = document.getElementById('drawer-total');
    if (tot) tot.textContent = formatearPrecio(Cart.total());
    const n = document.getElementById('drawer-n');
    if (n) n.textContent = plural(Cart.count(), 'producto', 'productos');
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : document.getElementById('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar, q.dataset.talle || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const talle = paso.dataset.talle || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && (x.talle || '') === talle);
      if (it) Cart.setQty(it.id, talle, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); irATienda(); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let talleModal = '';

function relacionados(p) {
  return PRODUCTOS.filter(x => x.seccion === p.seccion && x.id !== p.id).slice(0, 3);
}

function modalHTML(p) {
  const s = getSeccion(p.seccion);
  const libre = p.stock - Cart.enCarrito(p.id);
  const talles = p.talles
    ? `<fieldset class="m-talles"><legend>Talle</legend><div class="m-talles__lista">${p.talles.map(t => `<button type="button" class="m-talle" data-talle-modal="${esc(t)}" aria-pressed="${t === talleModal}">${esc(t)}</button>`).join('')}</div></fieldset>`
    : '';
  const rel = relacionados(p).map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}"><img src="${x.img}" width="${x.w}" height="${x.h}" alt=""><span>${esc(x.nombre)}</span><b>${formatearPrecio(precioFinal(x))}</b></button></li>`).join('');
  return `<div class="m-grid">
    <div class="m-fotos">
      <div class="m-foto"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"></div>
      <div class="m-foto m-foto--escena"><img src="${s.escena}" width="${s.w}" height="${s.h}" alt="${esc(s.alt)}"></div>
    </div>
    <div class="m-info">
      <p class="m-sec"><span>${s.nro}</span>${esc(s.nombre)}</p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'mprecio')}
      <p class="m-desc">${esc(p.desc)}</p>
      ${talles}
      ${stockHTML(p)}
      <div class="m-compra">
        <div class="stepper stepper--modal" data-stepper="${p.id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>
        <button type="button" class="btn btn--solid" data-add-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button>
      </div>
      <button type="button" class="btn btn--line btn--block" data-comprar-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      <a class="m-wsp" href="${wspLink(`Hola! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      <p class="m-talle-aviso" id="m-talle-aviso" hidden>Elegí un talle para agregarlo.</p>
      ${rel ? `<div class="m-rels"><p class="m-rels__t">También en ${esc(s.corto)}</p><ul>${rel}</ul></div>` : ''}
    </div>
  </div>`;
}

function inyectarLD(p) {
  document.getElementById('ld-producto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ld-producto';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href,
    description: p.desc, category: getSeccion(p.seccion).nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: String(precioFinal(p)), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
  document.head.appendChild(ld);
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modal-content');
  if (!p || !modal || !cont) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  talleModal = '';
  cont.innerHTML = modalHTML(p);
  cont.scrollTop = 0;
  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
  inyectarLD(p);
  try { window.history.replaceState(null, '', `${location.pathname}?producto=${p.id}`); } catch { return; }
}

function cerrarModal(sinFoco) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  document.getElementById('ld-producto')?.remove();
  if (!sinFoco) ultimoFoco?.focus?.();
  try { window.history.replaceState(null, '', location.pathname); } catch { return; }
}

function cantidadDe(cont) {
  const out = cont?.querySelector('output');
  return out ? Math.max(1, Number(out.textContent) || 1) : 1;
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const t = e.target.closest('[data-talle-modal]');
    if (t) {
      talleModal = t.dataset.talleModal;
      modal.querySelectorAll('[data-talle-modal]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      const aviso = document.getElementById('m-talle-aviso');
      if (aviso) aviso.hidden = true;
      return;
    }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (add) {
      const id = add.dataset.addModal || add.dataset.comprarModal;
      const p = getProducto(id);
      if (!p) return;
      if (p.talles && !talleModal) {
        const aviso = document.getElementById('m-talle-aviso');
        if (aviso) aviso.hidden = false;
        modal.querySelector('.m-talle')?.focus();
        return;
      }
      const qty = cantidadDe(modal.querySelector('.stepper--modal'));
      const ok = Cart.add(p, qty, p.talles ? talleModal : '');
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de este producto.'); return; }
      if (add.dataset.comprarModal) { cerrarModal(true); abrirDrawer(); return; }
      showToast(`Agregaste ${p.nombre}${p.talles ? ` talle ${talleModal}` : ''} al carrito.`);
      modal.querySelector('.m-info .stock')?.replaceWith(document.createRange().createContextualFragment(stockHTML(p)));
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirModal(id);
}

/* ---------- acciones ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('.stepper');
      const out = st?.querySelector('output');
      const p = getProducto(st?.dataset.stepper);
      if (!out || !p) return;
      const libre = Math.max(1, p.stock - Cart.enCarrito(p.id));
      out.textContent = String(Math.max(1, Math.min(libre, (Number(out.textContent) || 1) + Number(paso.dataset.paso))));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      if (p.talles) { abrirModal(p.id); return; }
      const card = add.closest('.card');
      const qty = cantidadDe(card?.querySelector('.stepper'));
      const ok = Cart.add(p, qty);
      showToast(ok ? `Agregaste ${plural(ok, 'unidad', 'unidades')} de ${p.nombre}.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      if (p.talles) { abrirModal(p.id); return; }
      const card = comprar.closest('.card');
      Cart.add(p, cantidadDe(card?.querySelector('.stepper')));
      abrirDrawer();
      return;
    }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#modal')) {
      e.preventDefault();
      filtrarSeccion(cat.dataset.cat, !cat.closest('#tienda'));
      return;
    }
    if (e.target.closest('[data-ir-busqueda]')) {
      irATienda();
      setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 500);
      return;
    }
    if (e.target.closest('[data-cuenta]')) showToast('El ingreso a tu cuenta se activa al pasar la web a producción.');
  });
  document.getElementById('newsletter')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const mail = form.querySelector('input[type="email"]');
    const err = form.querySelector('.nl-error');
    if (!mail || !mail.value.trim() || !mail.checkValidity()) {
      mail?.setAttribute('aria-invalid', 'true');
      if (err) err.hidden = false;
      mail?.focus();
      return;
    }
    mail.removeAttribute('aria-invalid');
    if (err) err.hidden = true;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Suscribirme'; }
    }, 800);
  });
}

function refrescarVistas() {
  document.querySelectorAll('#grid .card, #rail-track .card').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p) return;
    const t = document.createElement('template');
    t.innerHTML = cardHTML(p, '', false);
    card.replaceChildren(...t.content.firstElementChild.childNodes);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', refrescarVistas);

/* ---------- entradas ---------- */
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

/* ---------- menú ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

/* ---------- flotantes ---------- */
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

/* ---------- barra de modelos ---------- */
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

/* ---------- arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  sanearCarrito();
  initModelBarScroll();
  initVitrinas();
  initRail();
  initCatalogo();
  initGuia();
  initPisos();
  initReveals();
  initNav();
  initFiltrosMobile();
  initDrawer();
  initModal();
  initAcciones();
  initFloats();
  updateCartBadge();
  abrirDesdeURL();
});
