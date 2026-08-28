document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493751479896';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normaliza = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const CATEGORIAS = [
  { id: 'libreria', nombre: 'Librería', img: 'images/cat-libreria.webp', desc: 'Cuadernos, biromes y todo lo que se escribe' },
  { id: 'escolar', nombre: 'Escolar', img: 'images/cat-escolar.webp', desc: 'Carpetas, cartucheras y la lista del cole' },
  { id: 'arte', nombre: 'Arte y manualidades', img: 'images/cat-arte.webp', desc: 'Témperas, pinceles, cartulinas y papeles' },
  { id: 'descartables', nombre: 'Descartables', img: 'images/cat-descartables.webp', desc: 'Vasos, platos y cubiertos para la mesa' },
  { id: 'cotillon', nombre: 'Cotillón y disfraces', img: 'images/cat-cotillon.webp', desc: 'Velas, guirnaldas y disfraces del cumple' }
];

const SERVICIO = {
  id: 'fotocopias', nombre: 'Fotocopias e impresiones', img: 'images/cat-fotocopias.webp',
  desc: 'Copias, anillado y plastificado en el día', href: '#fotocopias', badge: 'Servicio'
};

const PRODUCTOS = [
  { id: 'cuaderno-tapa-dura-48', nombre: 'Cuaderno tapa dura 48 hojas rayado', cat: 'libreria', sub: 'Cuadernos', precio: 2800, descuento: 0, stock: 40, destacado: true, img: 'images/p-cuaderno-tapadura.webp', tags: ['triunfante', 'rayado', '19x24'], perfil: ['escuela', 'primaria', 'secundaria', 'basico', 'completo'], desc: 'El cuaderno de toda la vida: 19x24 cm, 48 hojas rayadas de 90 g y tapa dura lavable. Es el que más sale para primaria y el que casi siempre encabeza la lista.' },
  { id: 'cuaderno-espiral-80', nombre: 'Cuaderno espiral tapa dura 80 hojas', cat: 'libreria', sub: 'Cuadernos', precio: 6500, descuento: 10, stock: 22, img: 'images/p-cuaderno-espiral.webp', tags: ['espiral', 'estampado', 'a4'], perfil: ['escuela', 'secundaria', 'completo'], desc: 'Tapa dura estampada y espiral metálico que no se abre solo. Entran 80 hojas rayadas: alcanza para una materia entera sin tener que cambiar a mitad de año.' },
  { id: 'cuaderno-flexible-a4', nombre: 'Cuaderno tapa flexible A4', cat: 'libreria', sub: 'Cuadernos', precio: 4900, descuento: 0, stock: 30, img: 'images/p-cuaderno-verde.webp', tags: ['a4', 'liso', 'apuntes'], perfil: ['escuela', 'oficina', 'secundaria', 'completo'], desc: 'Liviano, de tapa flexible y formato A4. El favorito para apuntes de secundaria y para anotar pedidos en el negocio.' },
  { id: 'biromes-x10', nombre: 'Biromes de colores x10', cat: 'libreria', sub: 'Escritura', precio: 5200, descuento: 0, stock: 35, img: 'images/p-biromes.webp', tags: ['biromes', 'boligrafo', 'colores'], perfil: ['escuela', 'oficina', 'primaria', 'secundaria', 'completo'], desc: 'Diez biromes de tinta suave en colores surtidos. Sirven para subrayar, para el cuaderno de comunicaciones y para que nadie te robe la azul.' },
  { id: 'lapiz-goma-set', nombre: 'Lápiz negro HB + goma (set x3)', cat: 'libreria', sub: 'Escritura', precio: 900, descuento: 0, stock: 60, img: 'images/p-goma-lapiz.webp', tags: ['lapiz', 'goma', 'hb'], perfil: ['escuela', 'jardin', 'primaria', 'basico'], desc: 'Tres lápices HB con su goma. Es la reposición que siempre falta a mitad de trimestre.' },
  { id: 'broches-24-6', nombre: 'Broches para abrochadora 24/6 x1000', cat: 'libreria', sub: 'Oficina', precio: 1100, descuento: 0, stock: 45, img: 'images/p-broches.webp', tags: ['broches', 'abrochadora', 'ganchos'], perfil: ['oficina', 'basico'], desc: 'Caja de mil broches 24/6, medida estándar para cualquier abrochadora de mostrador o de escritorio.' },

  { id: 'carpeta-n3-flores', nombre: 'Carpeta N°3 tapa dura «Flores»', cat: 'escolar', sub: 'Carpetas', precio: 7900, descuento: 0, stock: 14, img: 'images/p-carpeta-flores.webp', tags: ['carpeta', 'n3', 'anillos', 'verde'], perfil: ['escuela', 'primaria', 'secundaria', 'completo'], desc: 'Carpeta N°3 de tapa dura con estampa de flores en relieve con glitter. Tres anillos y lomo reforzado para que aguante el año entero.' },
  { id: 'carpeta-n3-animal', nombre: 'Carpeta N°3 tapa dura «Animal print»', cat: 'escolar', sub: 'Carpetas', precio: 7900, descuento: 15, stock: 11, destacado: true, img: 'images/p-carpeta-animal.webp', tags: ['carpeta', 'n3', 'animal print', 'dorado'], perfil: ['escuela', 'secundaria', 'completo'], desc: 'Animal print con la frase estampada a la hoja en dorado. Es la que más eligen en secundaria y la que se agota primero en marzo.' },
  { id: 'carpeta-n3-mapa', nombre: 'Carpeta N°3 tapa dura «Planisferio»', cat: 'escolar', sub: 'Carpetas', precio: 7900, descuento: 0, stock: 9, img: 'images/p-carpeta-planisferio.webp', tags: ['carpeta', 'n3', 'mapa', 'geografia'], perfil: ['escuela', 'secundaria', 'completo'], desc: 'Tapa con planisferio impreso, tres anillos. Cumple doble función: guarda las hojas y saca de apuro en la prueba de geografía.' },
  { id: 'cartuchera-plata', nombre: 'Cartuchera glitter plateada', cat: 'escolar', sub: 'Cartucheras', precio: 8500, descuento: 0, stock: 12, img: 'images/p-cartuchera-plata.webp', tags: ['cartuchera', 'glitter', 'plateada'], perfil: ['escuela', 'primaria', 'secundaria', 'completo'], desc: 'Cartuchera de glitter plateado con cierre de color y base ancha para que se apoye sola en el banco. Entra un set completo de lápices.' },
  { id: 'cartuchera-dorada', nombre: 'Cartuchera glitter dorada', cat: 'escolar', sub: 'Cartucheras', precio: 8500, descuento: 0, stock: 8, destacado: true, img: 'images/p-cartuchera-dorada.webp', tags: ['cartuchera', 'glitter', 'dorada'], perfil: ['escuela', 'primaria', 'secundaria', 'completo'], desc: 'La misma cartuchera de glitter, en dorado con cierre negro. Es la que más nos piden para regalo de fin de curso.' },
  { id: 'cartuchera-azul', nombre: 'Cartuchera glitter plateada cierre azul', cat: 'escolar', sub: 'Cartucheras', precio: 8500, descuento: 0, stock: 10, img: 'images/p-cartuchera-azul.webp', tags: ['cartuchera', 'glitter', 'azul'], perfil: ['escuela', 'primaria', 'completo'], desc: 'Glitter plateado con cierre azul. Amplia, con forro interior liso para que no se enganchen las puntas de los lápices.' },
  { id: 'estuche-simil-cuero', nombre: 'Estuche símil cuero', cat: 'escolar', sub: 'Cartucheras', precio: 11500, descuento: 0, stock: 6, img: 'images/p-estuche-cuero.webp', tags: ['estuche', 'cuero', 'lapiceras'], perfil: ['oficina', 'secundaria', 'completo'], desc: 'Estuche angosto de símil cuero para lapiceras y marcadores finos. La opción sobria cuando el glitter no va.' },
  { id: 'lapices-colores-x12', nombre: 'Lápices de colores x12', cat: 'escolar', sub: 'Útiles', precio: 6900, descuento: 0, stock: 26, destacado: true, img: 'images/p-lapices-colores.webp', tags: ['lapices', 'colores', 'x12'], perfil: ['escuela', 'jardin', 'primaria', 'basico', 'completo'], desc: 'Doce colores de mina blanda, fáciles de sacar punta y sin astillarse. El estuche clásico que pide la lista de todos los grados.' },
  { id: 'regla-madera-20', nombre: 'Regla de madera 20 cm', cat: 'escolar', sub: 'Útiles', precio: 1500, descuento: 0, stock: 50, img: 'images/p-regla-madera.webp', tags: ['regla', 'madera', '20cm'], perfil: ['escuela', 'primaria', 'secundaria', 'basico'], desc: 'Regla de madera de 20 cm con numeración grabada, no impresa: no se borra con el uso ni con la mochila.' },
  { id: 'tijera-escolar', nombre: 'Tijera escolar punta redonda', cat: 'escolar', sub: 'Útiles', precio: 2400, descuento: 0, stock: 33, img: 'images/p-tijera-escolar.webp', tags: ['tijera', 'escolar', 'punta redonda'], perfil: ['escuela', 'primaria', 'basico', 'completo'], desc: 'Punta redondeada, mango ergonómico y hoja de acero que corta cartulina sin doblarla. Apta desde primer grado.' },

  { id: 'tijera-infantil', nombre: 'Tijera infantil punta roma', cat: 'arte', sub: 'Herramientas', precio: 2900, descuento: 0, stock: 18, img: 'images/p-tijera-infantil.webp', tags: ['tijera', 'infantil', 'jardin'], perfil: ['escuela', 'jardin', 'basico'], desc: 'Tijera chiquita de punta roma pensada para manos de jardín. Corta papel y cartulina fina, y nada más: esa es la idea.' },
  { id: 'acuarelas-x12', nombre: 'Acuarelas x12 pastillas con pincel', cat: 'arte', sub: 'Pintura', precio: 4800, descuento: 0, stock: 20, destacado: true, img: 'images/p-acuarelas.webp', tags: ['acuarelas', 'pastillas', 'pincel'], perfil: ['escuela', 'jardin', 'primaria', 'completo'], desc: 'Caja de doce pastillas con su pincel incluido y tapa que hace de paleta. Se limpia con agua y no mancha el guardapolvo.' },
  { id: 'temperas-x6', nombre: 'Témperas x6 potes de 30 ml', cat: 'arte', sub: 'Pintura', precio: 7500, descuento: 10, stock: 15, img: 'images/p-temperas-potes.webp', tags: ['temperas', 'potes', 'colores'], perfil: ['escuela', 'jardin', 'primaria', 'completo'], desc: 'Seis potes de témpera lavable de 30 ml con tapa a rosca. Colores plenos, buena cobertura sobre cartulina y afiche.' },
  { id: 'pinceles-x4', nombre: 'Pinceles set x4', cat: 'arte', sub: 'Pintura', precio: 3900, descuento: 0, stock: 24, img: 'images/p-pinceles-set.webp', tags: ['pinceles', 'set', 'cerda'], perfil: ['escuela', 'primaria', 'secundaria', 'completo'], desc: 'Cuatro pinceles planos de cerda en medidas escalonadas: del trazo grueso del fondo al detalle fino. Mango largo, virola sin óxido.' },
  { id: 'pincel-plano-38', nombre: 'Pincel plano 38 mm', cat: 'arte', sub: 'Pintura', precio: 2200, descuento: 0, stock: 28, img: 'images/p-pincel-plano.webp', tags: ['pincel', 'plano', 'ancho'], perfil: ['oficina', 'secundaria', 'basico'], desc: 'Pincel ancho de 38 mm con mango de madera. Para maquetas, afiches grandes y para pintar el cartel del acto sin quedarse a la madrugada.' },
  { id: 'cartulinas-x10', nombre: 'Cartulinas de color x10', cat: 'arte', sub: 'Papeles', precio: 4500, descuento: 0, stock: 30, img: 'images/p-cartulinas.webp', tags: ['cartulina', 'colores', 'x10'], perfil: ['escuela', 'jardin', 'primaria', 'completo'], desc: 'Diez cartulinas de colores surtidos, tamaño escolar. Gramaje que aguanta plasticola sin arrugarse.' },
  { id: 'papel-afiche-x10', nombre: 'Papel afiche x10', cat: 'arte', sub: 'Papeles', precio: 5300, descuento: 0, stock: 25, img: 'images/p-papel-afiche.webp', tags: ['afiche', 'papel', 'lamina'], perfil: ['escuela', 'primaria', 'secundaria', 'completo'], desc: 'Diez láminas de papel afiche en tonos surtidos. La medida de siempre para láminas, carteles y trabajos prácticos.' },
  { id: 'papel-color-a4', nombre: 'Papel de color A4 x100', cat: 'arte', sub: 'Papeles', precio: 8900, descuento: 0, stock: 16, img: 'images/p-papel-color.webp', tags: ['papel', 'a4', 'color', 'resma'], perfil: ['oficina', 'secundaria', 'completo'], desc: 'Cien hojas A4 de color, aptas para impresora y fotocopiadora. Sirven para folletos, señalización y trabajos de plástica.' },

  { id: 'vasos-tornasol-x8', nombre: 'Vasos descartables tornasol x8', cat: 'descartables', sub: 'Vasos', precio: 2900, descuento: 0, stock: 40, destacado: true, img: 'images/p-vasos-tornasol.webp', tags: ['vasos', 'tornasol', 'iridiscente', 'cumple'], perfil: ['cumple', 'completo'], desc: 'Ocho vasos de papel con terminación tornasolada. Base firme, no se vuelcan con el primer codazo de la mesa de los chicos.' },
  { id: 'platos-tornasol-x8', nombre: 'Platos descartables tornasol x8', cat: 'descartables', sub: 'Platos', precio: 3400, descuento: 0, stock: 34, img: 'images/p-platos-tornasol.webp', tags: ['platos', 'tornasol', 'cumple'], perfil: ['cumple', 'completo'], desc: 'Ocho platos de papel rígido con borde festoneado y brillo tornasol. Combinan con los vasos de la misma línea.' },
  { id: 'sorbetes-papel-x25', nombre: 'Sorbetes de papel rayados x25', cat: 'descartables', sub: 'Accesorios', precio: 1800, descuento: 0, stock: 48, img: 'images/p-sorbetes.webp', tags: ['sorbetes', 'papel', 'rayados'], perfil: ['cumple', 'basico'], desc: 'Veinticinco sorbetes de papel a rayas. Aguantan el jugo sin ablandarse a los dos minutos.' },
  { id: 'vasos-dorados-x8', nombre: 'Vasos de papel dorados x8', cat: 'descartables', sub: 'Vasos', precio: 3600, descuento: 0, stock: 22, img: 'images/p-vasos-dorados.webp', tags: ['vasos', 'dorados', 'metalizado'], perfil: ['cumple', 'completo'], desc: 'Ocho vasos con borde metalizado dorado y rosa. Para cumpleaños de quince, despedidas y mesas dulces.' },
  { id: 'platos-dorados-x8', nombre: 'Platos festoneados dorados x8', cat: 'descartables', sub: 'Platos', precio: 4100, descuento: 15, stock: 19, img: 'images/p-platos-dorados.webp', tags: ['platos', 'dorados', 'festoneado'], perfil: ['cumple', 'completo'], desc: 'Platos de postre con borde festoneado y filo dorado. Van con servilleta al tono, que también tenemos suelta.' },
  { id: 'platos-servilletas', nombre: 'Platos + servilletas «Estrellas» x8', cat: 'descartables', sub: 'Platos', precio: 4600, descuento: 0, stock: 21, img: 'images/p-platos-estrellas.webp', tags: ['platos', 'servilletas', 'estrellas', 'combo'], perfil: ['cumple', 'basico', 'completo'], desc: 'Combo de ocho platos con estampa de estrellas y ocho servilletas lisas que combinan. Resuelve la mesa de un cumple chico de una sola compra.' },
  { id: 'cubiertos-madera-x24', nombre: 'Cubiertos de madera x24', cat: 'descartables', sub: 'Accesorios', precio: 4200, descuento: 0, stock: 26, img: 'images/p-cubiertos-madera.webp', tags: ['cubiertos', 'madera', 'cucharas'], perfil: ['cumple', 'completo'], desc: 'Veinticuatro cubiertos de madera lisa. Más lindos que el plástico en la foto de la mesa y más firmes con la torta.' },

  { id: 'velas-numero', nombre: 'Velas de número plateadas', cat: 'cotillon', sub: 'Velas', precio: 2600, descuento: 0, stock: 38, destacado: true, img: 'images/p-velas-numero.webp', tags: ['velas', 'numero', 'cumpleanos', 'plateadas'], perfil: ['cumple', 'basico', 'completo'], desc: 'Velas de número con terminación metalizada y pincho plástico incluido. Tenemos todos los dígitos del 0 al 9: nos decís cuál y lo separamos.' },
  { id: 'guirnalda-flecos', nombre: 'Guirnalda de flecos', cat: 'cotillon', sub: 'Decoración', precio: 5900, descuento: 0, stock: 17, img: 'images/p-guirnalda-flecos.webp', tags: ['guirnalda', 'flecos', 'decoracion', 'metalizado'], perfil: ['cumple', 'completo'], desc: 'Guirnalda de flecos de papel de seda y metalizado, lista para colgar. Con dos alcanza para armar el fondo de fotos del cumple.' },
  { id: 'disfraz-princesa', nombre: 'Disfraz de princesa', cat: 'cotillon', sub: 'Disfraces', precio: 28000, descuento: 0, stock: 5, destacado: true, img: 'images/p-disfraz-princesa.webp', tags: ['disfraz', 'princesa', 'rosa', 'vestido'], perfil: ['cumple', 'jardin', 'primaria', 'completo'], desc: 'Vestido largo de raso rosa con vivos plateados y collar incluido. Tenemos varios talles infantiles en el local: consultanos el que necesitás.' },
  { id: 'disfraz-abejita', nombre: 'Disfraz de abejita', cat: 'cotillon', sub: 'Disfraces', precio: 26000, descuento: 10, stock: 4, img: 'images/p-disfraz-abejita.webp', tags: ['disfraz', 'abeja', 'amarillo', 'acto'], perfil: ['cumple', 'jardin', 'completo'], desc: 'Vestido de abejita con falda amarilla y estampa al frente. Uno de los que más se piden para los actos de jardín.' },
  { id: 'disfraz-lunares', nombre: 'Disfraz de lunares rojo', cat: 'cotillon', sub: 'Disfraces', precio: 27000, descuento: 0, stock: 4, img: 'images/p-disfraz-lunares.webp', tags: ['disfraz', 'lunares', 'rojo', 'vestido'], perfil: ['cumple', 'jardin', 'primaria', 'completo'], desc: 'Vestido rojo de lunares blancos con falda negra. Clásico de cumpleaños temáticos y de disfraz improvisado a último momento.' }
];

const Cart = {
  KEY: 'libreriajd_cart',
  fallback: null,
  get() { try { return JSON.parse(localStorage.getItem(this.KEY) ?? this.fallback) || []; } catch { return []; } },
  save(items) {
    this.fallback = JSON.stringify(items);
    try { localStorage.setItem(this.KEY, this.fallback); } catch { this.fallback = JSON.stringify(items); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 240); }, 3200);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

function cardHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="prod-badge off">-${p.descuento}%</span>`
    : (p.destacado ? '<span class="prod-badge">Más elegido</span>' : '');
  const precios = p.descuento > 0
    ? `<span class="prod-precio">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span class="prod-precio">${formatearPrecio(fin)}</span>`;
  const razon = opts.razon ? `<p class="prod-razon">Elegido por: ${esc(opts.razon)}</p>` : '';
  const anim = opts.anim === false ? '' : ' data-animate style="opacity:0;transform:translateY(34px) rotate(-1.2deg)"';
  return `<article class="prod" data-id="${esc(p.id)}"${anim}>
    <div class="prod-media">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1250">
      ${badge}
      <button type="button" class="prod-ver" data-ver="${esc(p.id)}">Ver más</button>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(p.sub)}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${razon}
      <div class="prod-precios">${precios}</div>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}">Agregar</button>
      </div>
      <button type="button" class="prod-buy" data-buy="${esc(p.id)}">Comprar ahora</button>
    </div>
  </article>`;
}

function qtyDe(el) {
  const s = el.closest('.prod, .vr-txt')?.querySelector('[data-qty]');
  return s ? Math.max(1, parseInt(s.textContent, 10) || 1) : 1;
}

document.addEventListener('click', e => {
  const step = e.target.closest('[data-step]');
  if (step) {
    const box = step.closest('[data-stepper]');
    const span = box.querySelector('[data-qty]');
    const n = Math.max(1, (parseInt(span.textContent, 10) || 1) + Number(step.dataset.step));
    span.textContent = n;
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = getProducto(add.dataset.add); if (!p) return;
    Cart.add(p, qtyDe(add));
    showToast('¡Anotado! Ya está en tu pedido');
    return;
  }
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    const p = getProducto(buy.dataset.buy); if (!p) return;
    Cart.add(p, qtyDe(buy));
    abrirDrawer();
    return;
  }
  const ver = e.target.closest('[data-ver]');
  if (ver) { abrirModal(ver.dataset.ver); }
});

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const items = CATEGORIAS.map(c => `
    <a class="cat-card" href="#tienda" data-cat-go="${esc(c.id)}" data-animate style="opacity:0;transform:translateY(30px) scale(.97)">
      <div class="cat-media"><img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="1200" height="900"></div>
      <div class="cat-txt"><h3><span>${esc(c.nombre)}</span></h3><p>${esc(c.desc)}</p></div>
    </a>`).join('');
  const serv = `
    <a class="cat-card" href="${SERVICIO.href}" data-animate style="opacity:0;transform:translateY(30px) scale(.97)">
      <span class="cat-badge">${esc(SERVICIO.badge)}</span>
      <div class="cat-media"><img src="${esc(SERVICIO.img)}" alt="${esc(SERVICIO.nombre)}" width="1200" height="900"></div>
      <div class="cat-txt"><h3><span>${esc(SERVICIO.nombre)}</span></h3><p>${esc(SERVICIO.desc)}</p></div>
    </a>`;
  grid.innerHTML = items + serv;
  grid.querySelectorAll('[data-cat-go]').forEach(a => {
    a.addEventListener('click', () => { aplicarCategoria(a.dataset.catGo); });
  });
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p)).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * .8;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));

  const syncArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();

  const capturar = (el, id) => { try { el.setPointerCapture?.(id); return true; } catch { return false; } };
  const liberar = (el, id) => { try { el.releasePointerCapture?.(id); return true; } catch { return false; } };

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      capturar(vp, pointerId);
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      vp.classList.remove('dragging');
      liberar(vp, pointerId);
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 40);
    }
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const borde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (borde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

let filtroCat = 'all', filtroSub = 'all', filtroOrden = 'rel', busqueda = '', visibles = 16;

function subsDe(cat) {
  const lista = PRODUCTOS.filter(p => cat === 'all' || p.cat === cat).map(p => p.sub);
  return [...new Set(lista)].sort((a, b) => a.localeCompare(b, 'es'));
}

function filtrados() {
  const q = normaliza(busqueda).trim();
  let out = PRODUCTOS.filter(p => {
    if (filtroCat !== 'all' && p.cat !== filtroCat) return false;
    if (filtroSub !== 'all' && p.sub !== filtroSub) return false;
    if (!q) return true;
    const heno = normaliza([p.nombre, p.sub, catNombre(p.cat), p.desc, (p.tags || []).join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (filtroOrden === 'precio-asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtroOrden === 'precio-desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (filtroOrden === 'nombre') out = out.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return out;
}

function pintarCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const info = document.getElementById('resultados');
  if (!grid) return;
  const lista = filtrados();
  const trozo = lista.slice(0, visibles);
  grid.innerHTML = trozo.map(p => cardHTML(p)).join('');
  vacio.hidden = lista.length !== 0;
  grid.hidden = lista.length === 0;
  verMas.parentElement.hidden = lista.length <= visibles;
  info.textContent = lista.length === 0
    ? 'Sin resultados'
    : `${lista.length} producto${lista.length === 1 ? '' : 's'}${filtroCat !== 'all' ? ' en ' + catNombre(filtroCat) : ''}`;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function syncSubSelect() {
  const sel = document.getElementById('fsub');
  if (!sel) return;
  const subs = subsDe(filtroCat);
  sel.innerHTML = '<option value="all">Todas las subcategorías</option>' + subs.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
  if (!subs.includes(filtroSub)) filtroSub = 'all';
  sel.value = filtroSub;
}

function aplicarCategoria(cat) {
  filtroCat = cat; filtroSub = 'all'; visibles = 16;
  document.querySelectorAll('.chip-cat').forEach(c => c.classList.toggle('on', c.dataset.cat === cat));
  syncSubSelect();
  pintarCatalogo();
}

function initCatalogo() {
  const chips = document.getElementById('chipsCat');
  if (!chips) return;
  chips.innerHTML = `<button type="button" class="chip-cat on" data-cat="all">Todo el mostrador</button>` +
    CATEGORIAS.map(c => `<button type="button" class="chip-cat" data-cat="${esc(c.id)}">${esc(c.nombre)}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip-cat'); if (!b) return;
    aplicarCategoria(b.dataset.cat);
  });

  const q = document.getElementById('q');
  let t;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { busqueda = q.value; visibles = 16; pintarCatalogo(); }, 180);
  });

  document.getElementById('fsub')?.addEventListener('change', e => { filtroSub = e.target.value; visibles = 16; pintarCatalogo(); });
  document.getElementById('forden')?.addEventListener('change', e => { filtroOrden = e.target.value; visibles = 16; pintarCatalogo(); });

  const limpiar = () => {
    filtroCat = 'all'; filtroSub = 'all'; filtroOrden = 'rel'; busqueda = ''; visibles = 16;
    if (q) q.value = '';
    const fo = document.getElementById('forden'); if (fo) fo.value = 'rel';
    document.querySelectorAll('.chip-cat').forEach(c => c.classList.toggle('on', c.dataset.cat === 'all'));
    syncSubSelect();
    pintarCatalogo();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);

  document.getElementById('verMas')?.addEventListener('click', () => { visibles += 16; pintarCatalogo(); });

  syncSubSelect();
  pintarCatalogo();
}

/* ---------- ARMÁ LA LISTA ---------- */
const PREGUNTAS = [
  { grupo: 'uso', etiquetas: { escuela: 'Para la escuela', cumple: 'Para un cumple', oficina: 'Para el negocio' } },
  { grupo: 'quien', etiquetas: { jardin: 'Jardín', primaria: 'Primaria', secundaria: 'Secundaria o adultos' } },
  { grupo: 'cuanto', etiquetas: { basico: 'Lo justo y necesario', completo: 'La lista completa' } }
];

function initLista() {
  const pasos = document.getElementById('pasos');
  const renglones = document.getElementById('renglones');
  if (!pasos || !renglones) return;
  const resultado = document.getElementById('listaResultado');
  const cards = document.getElementById('listaCards');
  const verMasLink = document.getElementById('listaVerMas');
  let elegido = [];

  const items = [...pasos.querySelectorAll('.paso')];
  const lineas = [...renglones.querySelectorAll('.renglon')];

  const mostrarPaso = n => {
    items.forEach(li => li.classList.toggle('is-on', Number(li.dataset.paso) === n));
  };

  const escribir = (i, texto) => {
    const li = lineas[i];
    if (!li) return;
    li.classList.remove('renglon-vacio');
    li.innerHTML = `<span class="tick">✓</span><span class="escrito">${esc(texto)}</span>`;
    requestAnimationFrame(() => li.querySelector('.escrito')?.classList.add('on'));
  };

  const volar = (chip, destinoIndex, cb) => {
    if (reduceMotion) { cb(); return; }
    const destino = lineas[destinoIndex];
    if (!destino) { cb(); return; }
    const a = chip.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const clon = document.createElement('span');
    clon.className = 'chip-vuelo';
    clon.textContent = chip.textContent;
    clon.style.left = a.left + 'px';
    clon.style.top = a.top + 'px';
    clon.style.width = a.width + 'px';
    document.body.appendChild(clon);
    requestAnimationFrame(() => {
      clon.style.transform = `translate(${b.left - a.left + 8}px, ${b.top - a.top + 4}px) scale(.72)`;
      clon.style.opacity = '0';
    });
    setTimeout(() => { clon.remove(); cb(); }, 470);
  };

  const puntaje = p => elegido.reduce((s, v) => s + ((p.perfil || []).includes(v.valor) ? 1 : 0), 0);

  const cerrar = () => {
    const rank = PRODUCTOS
      .map(p => ({ p, s: puntaje(p) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s || precioFinal(a.p) - precioFinal(b.p));
    const top = (rank.length >= 4 ? rank : rank.concat(PRODUCTOS.filter(p => !rank.some(r => r.p.id === p.id)).map(p => ({ p, s: 0 }))))
      .slice(0, 4).map(x => x.p);
    const razon = elegido.map(v => v.etiqueta.toLowerCase()).join(' + ');
    cards.innerHTML = top.map(p => cardHTML(p, { razon, anim: false })).join('');
    resultado.hidden = false;
    cards.querySelectorAll('.prod').forEach((c, i) => setTimeout(() => c.classList.add('in'), reduceMotion ? 0 : 90 * i));
    escribir(3, `${top.length} productos anotados abajo`);
    verMasLink.dataset.cat = top[0]?.cat || 'all';
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();

    const addAll = document.getElementById('listaAddAll');
    if (addAll) {
      addAll.onclick = () => {
        top.forEach(p => Cart.add(p, 1));
        showToast('Los 4 ya están en tu pedido');
        abrirDrawer();
      };
    }
    mostrarPaso(3);
  };

  pasos.addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    const grupo = chip.closest('.chips')?.dataset.grupo;
    const valor = chip.dataset.valor;
    const etiqueta = chip.textContent.trim();
    const idx = elegido.length;
    volar(chip, idx, () => {
      elegido.push({ grupo, valor, etiqueta });
      escribir(idx, etiqueta);
      if (elegido.length >= PREGUNTAS.length) cerrar();
      else mostrarPaso(elegido.length);
    });
  });

  document.getElementById('listaReset')?.addEventListener('click', () => {
    elegido = [];
    lineas.forEach((li, i) => { li.className = 'renglon' + (i === 0 ? ' renglon-vacio' : ''); li.textContent = i === 0 ? 'Elegí una opción y la anotamos acá…' : ''; });
    resultado.hidden = true;
    cards.innerHTML = '';
    mostrarPaso(0);
  });

  verMasLink?.addEventListener('click', () => {
    const c = verMasLink.dataset.cat;
    if (c && c !== 'all') aplicarCategoria(c);
  });
}

/* ---------- DRAWER ---------- */
let ultimoFoco = null;

function pintarDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <span aria-hidden="true">✎</span>
      <h3>Todavía no anotaste nada</h3>
      <p>Agregá lo que necesites y lo dejamos separado en el mostrador.</p>
      <a class="btn btn-bordo btn-sm" href="#tienda" data-cerrar-drawer>Ir al catálogo</a>
    </div>`;
    foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const fin = precioFinal(p);
    return `<div class="ci" data-ci="${esc(p.id)}">
      <div class="ci-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1250" loading="lazy"></div>
      <div>
        <p class="ci-nombre">${esc(p.nombre)}</p>
        <p class="ci-precio">${formatearPrecio(fin)}</p>
        <div class="ci-bottom">
          <div class="stepper" data-stepper>
            <button type="button" data-ciq="-1" aria-label="Quitar una unidad">−</button>
            <span data-qty>${i.qty}</span>
            <button type="button" data-ciq="1" aria-label="Agregar una unidad">+</button>
          </div>
          <button type="button" class="ci-del" data-del="${esc(p.id)}">Quitar</button>
        </div>
      </div>
      <span class="ci-sub">${formatearPrecio(fin * i.qty)}</span>
    </div>`;
  }).join('');
  foot.hidden = false;
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
  const detalle = items.map(i => {
    const p = getProducto(i.id); return p ? `• ${p.nombre} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean).join('\n');
  const msg = `Hola Librería JD, quiero hacer este pedido:\n${detalle}\n\nTotal: ${formatearPrecio(Cart.total())}`;
  document.getElementById('pedirWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d) return;
  ultimoFoco = document.activeElement;
  d.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('drawer-open', 'no-scroll');
  pintarDrawer();
  setTimeout(() => document.getElementById('drawerClose')?.focus(), 60);
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('drawer-open', 'no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer')?.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    const q = e.target.closest('[data-ciq]');
    if (q) {
      const id = q.closest('[data-ci]').dataset.ci;
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      const nuevo = actual + Number(q.dataset.ciq);
      if (nuevo <= 0) Cart.remove(id); else Cart.setQty(id, nuevo);
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del); showToast('Lo sacamos del pedido'); }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => {
    if (!document.getElementById('drawer')?.hidden) pintarDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
  const d = document.getElementById('drawer');
  d?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...d.querySelectorAll('button, a[href], input, select')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ---------- VISTA RÁPIDA ---------- */
function abrirModal(id) {
  const p = getProducto(id); if (!p) return;
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  ultimoFoco = document.activeElement;
  const fin = precioFinal(p);
  const precios = p.descuento > 0
    ? `<span class="vr-precio">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="vr-tag">-${p.descuento}%</span>`
    : `<span class="vr-precio">${formatearPrecio(fin)}</span>`;
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const relHTML = rel.length ? `<div class="vr-rel">
      <h4>También te puede servir</h4>
      <div class="vr-rel-grid">${rel.map(r => `
        <button type="button" class="vr-rel-item" data-ver="${esc(r.id)}">
          <span class="m"><img src="${esc(r.img)}" alt="${esc(r.nombre)}" width="1000" height="1250" loading="lazy"></span>
          <b>${esc(r.nombre)}</b><i>${formatearPrecio(precioFinal(r))}</i>
        </button>`).join('')}</div>
    </div>` : '';
  body.innerHTML = `<div class="vr">
    <div class="vr-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1250"></div>
    <div class="vr-txt">
      <span class="vr-cat">${esc(catNombre(p.cat))} · ${esc(p.sub)}</span>
      <h3>${esc(p.nombre)}</h3>
      <div class="vr-precios">${precios}</div>
      <p class="vr-desc">${esc(p.desc)}</p>
      <div class="vr-meta">${(p.tags || []).map(t => `<span class="vr-tag">${esc(t)}</span>`).join('')}</div>
      <div class="vr-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-bordo" data-add="${esc(p.id)}">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" data-buy="${esc(p.id)}">Comprar ahora</button>
      </div>
      ${relHTML}
    </div>
  </div>`;
  const titulo = document.getElementById('modalTitle');
  if (titulo) titulo.textContent = p.nombre;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('no-scroll');
  setTimeout(() => document.getElementById('modalClose')?.focus(), 60);
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; }, 340);
  ultimoFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modal?.addEventListener('click', e => { if (e.target.closest('[data-close]')) cerrarModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal?.hidden) cerrarModal(); });
  modal?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...modal.querySelectorAll('button, a[href], input, select')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ---------- REVEALS ---------- */
let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`; });
  requestAnimationFrame(() => {
    nuevos.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight * 1.1) el.classList.add('in');
      else window.__revealObserver?.observe(el);
    });
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));
  window.__revealObserver = io;

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    document.querySelectorAll('[data-animate]').forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ---------- NAV ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.masthead');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

/* ---------- FLOTANTES ---------- */
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ---------- MARGEN QUE SE DIBUJA ---------- */
function initMargen() {
  const fill = document.getElementById('margenFill');
  const main = document.getElementById('main');
  if (!fill || !main) return;
  let queued = false;
  const draw = () => {
    queued = false;
    const r = main.getBoundingClientRect();
    const alto = r.height - window.innerHeight;
    const p = alto <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / alto));
    fill.style.transform = `scaleY(${p.toFixed(4)})`;
  };
  const q = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
  window.addEventListener('scroll', q, { passive: true });
  window.addEventListener('resize', q, { passive: true });
  window.addEventListener('load', q);
  draw();
}

/* ---------- GSAP: PARALLAX ---------- */
function initGsap() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 };
    gsap.fromTo('.cap-1 img', { yPercent: -6, scale: 1.12 }, { yPercent: 6, ease: 'none', scrollTrigger: st });
    gsap.fromTo('.cap-2 img', { yPercent: 6, scale: 1.12 }, { yPercent: -7, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.cap-3 img', { yPercent: -4, scale: 1.12 }, { yPercent: 5, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.mostrador-foto img', { yPercent: -5, scale: 1.11 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.sec-mostrador', start: 'top bottom', end: 'bottom top', scrub: .5 }
    });
  });
}

/* ---------- JSON-LD DE PRODUCTOS ---------- */
function injectProductSchema() {
  const base = 'https://gokywebs.com/demo/libreria/';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de Librería JD',
    itemListElement: PRODUCTOS.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        image: base + p.img,
        description: p.desc,
        category: catNombre(p.cat),
        offers: {
          '@type': 'Offer',
          price: precioFinal(p),
          priceCurrency: 'ARS',
          availability: (p.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    }))
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}

initCategorias();
initRail();
initCatalogo();
initLista();
initReveals();
initNav();
initDrawer();
initModal();
initFloats();
initMargen();
initGsap();
injectProductSchema();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
