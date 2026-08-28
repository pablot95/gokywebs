document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491164382829';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normaliza = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const MARCAS = {
  tamberita: { nombre: 'La Tamberita', linea: 'Regionales' },
  taba: { nombre: 'La Taba', linea: 'Muebles' }
};

const CATEGORIAS = [
  { id: 'asado', nombre: 'Asado y picadas', img: 'images/cat-asado.webp', marca: 'tamberita', desc: 'Tablas, pizzeras, bandejas y los fierros de la parrilla' },
  { id: 'mates', nombre: 'Mates y termos', img: 'images/cat-mates.webp', marca: 'tamberita', desc: 'Mates, bombillas y porta termo para llevar' },
  { id: 'cocina', nombre: 'Cocina y utensilios', img: 'images/cat-cocina.webp', marca: 'tamberita', desc: 'Cucharas, espátulas, mazas y organizadores' },
  { id: 'mesas', nombre: 'Mesas y desayunadores', img: 'images/cat-mesas.webp', marca: 'taba', desc: 'Mesas materas, cerveceras y plegables' },
  { id: 'verduleros', nombre: 'Verduleros y torres', img: 'images/cat-verduleros.webp', marca: 'taba', desc: 'De dos, tres y cuatro pisos, en pino macizo' },
  { id: 'deco', nombre: 'Deco y organización', img: 'images/cat-deco.webp', marca: 'taba', desc: 'Percheros, espejos, cajas y porta macetas' }
];

const PRODUCTOS = [
  { id: 'cdt02', codigo: 'CD T 02', nombre: 'Tabla Eco con mango', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 16500, descuento: 0, stock: 24, img: 'images/cdt02_eco_con_mango.webp', tags: ['tabla', 'picada', 'mango', 'eco'], desc: 'Tabla de pino macizo con mango integrado y agujero para colgar. La medida más pedida para picada de dos: liviana, prolija y con la veta quemada a fuego para resaltar el dibujo.' },
  { id: 'cdt03', codigo: 'CD T 03', nombre: 'Tabla Eco caballito', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 19800, descuento: 15, stock: 12, img: 'images/cdt03_eco_caballito.webp', tags: ['tabla', 'caballo', 'calada', 'regalo'], desc: 'La tabla con la silueta del caballo calada en el mango, el modelo insignia de La Tamberita. Se lleva mucho de regalo: si querés, le grabamos un nombre.' },
  { id: 'cdt04', codigo: 'CD T 04', nombre: 'Tabla de mango largo', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 17900, descuento: 0, stock: 20, img: 'images/cdt04_mango_largo.webp', tags: ['tabla', 'mango largo', 'asado'], desc: 'Mango largo para sacarla del fuego sin quemarse y superficie amplia para cortar. La que va del asador a la mesa sin escalas.' },
  { id: 'cdt06', codigo: 'CD T 06', nombre: 'Tabla con dos herraduras', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 24500, descuento: 0, stock: 9, destacado: true, img: 'images/cdt06_dos_herraduras.webp', tags: ['tabla', 'herradura', 'colgante', 'campo'], desc: 'Tabla grande con dos herraduras de hierro remachadas que hacen de agarre y de colgante. Pesada, de las que duran años sobre la mesada.' },
  { id: 'cdt13', codigo: 'CD T 13', nombre: 'Pizzera redonda con desgrase', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 22900, descuento: 0, stock: 15, img: 'images/cdt13_pizzera_redonda.webp', tags: ['pizzera', 'redonda', 'desgrase', 'canal'], desc: 'Pizzera redonda con mango y canal de desgrase perimetral. Sirve igual para pizza, para asado o para presentar una picada redonda.' },
  { id: 'cdt17', codigo: 'CD T 17', nombre: 'Bandeja de empanadas', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 26400, descuento: 0, stock: 11, img: 'images/cdt17_bandeja_de_empanadas.webp', tags: ['bandeja', 'empanadas', 'divisiones', 'ovalada'], desc: 'Bandeja ovalada con tres divisiones internas: doce empanadas ordenadas sin que se pisen. Una sola pieza de madera, ahuecada y lijada a mano.' },
  { id: 'cdt20', codigo: 'CD T 20', nombre: 'Caja con 6 tablitas', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 38000, descuento: 0, stock: 7, destacado: true, img: 'images/cdt20_caja_x6_tablitas.webp', tags: ['caja', 'tablitas', 'combo', 'soga', 'regalo'], desc: 'Cajón con manija de soga y seis tablitas individuales adentro. Es el combo que más sale para regalo: llega listo, sin envolver nada.' },
  { id: 'cdt22', codigo: 'CD T 22', nombre: 'Plato redondo con borde', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 14200, descuento: 0, stock: 26, img: 'images/cdt22_plato_redondo.webp', tags: ['plato', 'redondo', 'borde', 'individual'], desc: 'Plato redondo con borde torneado que contiene el jugo. Va como plato individual de asado o como base para quesos.' },
  { id: 'cdh01', codigo: 'CD H 01', nombre: 'Agarra brasa de hierro', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 21000, descuento: 0, stock: 14, img: 'images/cdh01_agarra_brasa.webp', tags: ['parrilla', 'hierro', 'brasa', 'pinza'], desc: 'Pinza de hierro forjado para mover la brasa sin acercar la mano. Larga, con la punta abierta para agarrar el carbón entero.' },
  { id: 'cdh03', codigo: 'CD H 03', nombre: 'Pala y atizador', cat: 'asado', marca: 'tamberita', fondo: 'claro', precio: 34500, descuento: 0, stock: 8, img: 'images/cdh03_pala_y_atizador.webp', tags: ['parrilla', 'pala', 'atizador', 'juego', 'hierro'], desc: 'Juego parrillero de hierro con cabos de madera torneada: pala para juntar la brasa y atizador para acomodarla. Se venden juntos.' },

  { id: 'mate01', codigo: 'CD M 01', nombre: 'Mate forrado en cuero', cat: 'mates', marca: 'tamberita', fondo: 'claro', precio: 18900, descuento: 0, stock: 16, destacado: true, img: 'images/p-mate-cuero.webp', tags: ['mate', 'cuero', 'virola', 'calabaza'], desc: 'Calabaza forrada en cuero cosido a mano, con virola de alpaca. Curado y listo para usar: aguanta el agua caliente sin abrirse.' },
  { id: 'mate02', codigo: 'CD M 02', nombre: 'Mate de calabaza con virola', cat: 'mates', marca: 'tamberita', fondo: 'claro', precio: 16400, descuento: 0, stock: 19, img: 'images/p-mate-calabaza.webp', tags: ['mate', 'calabaza', 'virola', 'base'], desc: 'Calabaza natural con virola de alpaca y base tallada para que quede firme sobre la mesa. El clásico de toda la vida.' },
  { id: 'mate03', codigo: 'CD M 03', nombre: 'Mate de madera pirograbado', cat: 'mates', marca: 'tamberita', fondo: 'claro', precio: 14800, descuento: 0, stock: 22, img: 'images/p-mate-madera.webp', tags: ['mate', 'madera', 'pirograbado', 'torneado'], desc: 'Mate torneado en madera maciza con un motivo pirograbado a mano. No se raja ni necesita curado, y el dibujo lo hacemos nosotros.' },
  { id: 'mate05', codigo: 'CD M 05', nombre: 'Bombilla de alpaca', cat: 'mates', marca: 'tamberita', fondo: 'claro', precio: 9600, descuento: 0, stock: 30, img: 'images/p-bombillas.webp', tags: ['bombilla', 'alpaca', 'pico', 'resorte'], desc: 'Bombilla de alpaca con filtro de resorte, la que no se tapa. Pico ancho y curva cómoda para el mate de todos los días.' },
  { id: 'mate08', codigo: 'CD M 08', nombre: 'Set matero con porta termo', cat: 'mates', marca: 'tamberita', fondo: 'claro', precio: 42000, descuento: 0, stock: 6, destacado: true, img: 'images/p-set-matero.webp', tags: ['set', 'matero', 'porta termo', 'combo', 'cuero'], desc: 'El juego completo: mate forrado, bombilla de alpaca y porta termo de cuero. Lo armamos en el local y sale listo para el campo o la playa.' },

  { id: 'coc01', codigo: 'CD C 01', nombre: 'Organizador de utensilios', cat: 'cocina', marca: 'tamberita', fondo: 'claro', precio: 19500, descuento: 0, stock: 13, destacado: true, img: 'images/p-organizador.webp', tags: ['organizador', 'utensilios', 'mesada', 'porta'], desc: 'Cubo de madera para tener las cucharas y espátulas a mano sobre la mesada. Base ancha, no se vuelca ni con todo cargado.' },
  { id: 'coc03', codigo: 'CD C 03', nombre: 'Maza para carne', cat: 'cocina', marca: 'tamberita', fondo: 'claro', precio: 11900, descuento: 0, stock: 18, img: 'images/p-maza.webp', tags: ['maza', 'carne', 'martillo', 'cocina'], desc: 'Maza de madera dura con cabeza metálica dentada de un lado y lisa del otro. Para milanesas, sin astillarse al primer golpe.' },
  { id: 'coc05', codigo: 'CD C 05', nombre: 'Juego de cubiertos de madera', cat: 'cocina', marca: 'tamberita', fondo: 'claro', precio: 13400, descuento: 0, stock: 21, img: 'images/p-cubiertos.webp', tags: ['cubiertos', 'tenedor', 'ensalada', 'juego'], desc: 'Juego de tenedores y cucharas de madera lijada. No raya las ollas antiadherentes y no se calienta con la comida.' },
  { id: 'coc06', codigo: 'CD C 06', nombre: 'Espátulas de madera x3', cat: 'cocina', marca: 'tamberita', fondo: 'claro', precio: 10800, descuento: 10, stock: 24, img: 'images/p-espatulas.webp', tags: ['espatula', 'cocina', 'x3', 'set'], desc: 'Tres espátulas en medidas distintas: la angosta para el sartén chico, la ancha para la plancha y la de punta recta para raspar.' },
  { id: 'coc09', codigo: 'CD C 09', nombre: 'Salero y pimentero torneados', cat: 'cocina', marca: 'tamberita', fondo: 'claro', precio: 8900, descuento: 0, stock: 28, img: 'images/p-saleros.webp', tags: ['salero', 'pimentero', 'torneado', 'par'], desc: 'Par de saleros torneados en madera clara, con tapa a rosca y agujeros distintos para sal y pimienta.' },

  { id: 'lt01', codigo: 'LT 01', nombre: 'Mesa matera plegable', cat: 'mesas', marca: 'taba', fondo: 'oscuro', precio: 52000, descuento: 0, stock: 8, destacado: true, img: 'images/lt01_mesa_matera.webp', tags: ['mesa', 'matera', 'plegable', 'mate', 'pino'], desc: 'Mesita plegable con el hueco para el mate y un estante bajo para el termo. Se cierra plana y entra en el baúl del auto.' },
  { id: 'lt02', codigo: 'LT 02', nombre: 'Mesa machimbrada plegable', cat: 'mesas', marca: 'taba', fondo: 'oscuro', precio: 58000, descuento: 0, stock: 6, img: 'images/lt02_mesa_machimbrada.webp', tags: ['mesa', 'machimbre', 'plegable', 'desayunador'], desc: 'Tapa de machimbre entablonado y patas plegables. Sirve de desayunador en la cama o de mesa auxiliar en el patio.' },
  { id: 'lt03', codigo: 'LT 03', nombre: 'Mesa cervecera con posavasos', cat: 'mesas', marca: 'taba', fondo: 'oscuro', precio: 64000, descuento: 0, stock: 5, img: 'images/lt03_mesa_cervecera.webp', tags: ['mesa', 'cervecera', 'posavasos', 'plegable'], desc: 'Mesa plegable con dos huecos calados para apoyar las copas o los vasos. La mesa de la previa: se arma en diez segundos.' },
  { id: 'lt04', codigo: 'LT 04', nombre: 'Mesa matera cubo con manija', cat: 'mesas', marca: 'taba', fondo: 'oscuro', precio: 47500, descuento: 0, stock: 7, img: 'images/lt04_mesa_matera_cubo.webp', tags: ['cubo', 'matera', 'manija', 'guarda'], desc: 'Cubo cerrado con manija de soga: por fuera es mesa, por dentro guarda el termo, la yerba y el mate. Se lleva de una mano.' },

  { id: 'lt07', codigo: 'LT 07', nombre: 'Verdulero de 2 pisos', cat: 'verduleros', marca: 'taba', fondo: 'oscuro', precio: 46000, descuento: 0, stock: 10, img: 'images/lt07_verdulero_x2.webp', tags: ['verdulero', 'frutero', '2 pisos', 'cocina'], desc: 'Verdulero de dos bandejas con listones separados para que la fruta respire. Entra en cualquier rincón de cocina.' },
  { id: 'lt08', codigo: 'LT 08', nombre: 'Verdulero de 3 pisos', cat: 'verduleros', marca: 'taba', fondo: 'oscuro', precio: 62000, descuento: 0, stock: 9, destacado: true, img: 'images/lt08_verdulero_x3.webp', tags: ['verdulero', 'frutero', '3 pisos', 'escalera'], desc: 'El de tres pisos, el más vendido de La Taba. Bandejas en escalera para ver todo de un vistazo, en pino macizo lijado y sellado.' },
  { id: 'lt09', codigo: 'LT 09', nombre: 'Verdulero de 4 pisos', cat: 'verduleros', marca: 'taba', fondo: 'oscuro', precio: 78000, descuento: 10, stock: 4, img: 'images/lt09_verdulero_x4.webp', tags: ['verdulero', 'frutero', '4 pisos', 'alto'], desc: 'Cuatro bandejas para cocinas con poco piso y mucha altura. Sube sin ocupar más lugar que el de dos.' },
  { id: 'lt10', codigo: 'LT 10', nombre: 'Torre organizadora de 2 pisos', cat: 'verduleros', marca: 'taba', fondo: 'oscuro', precio: 54000, descuento: 0, stock: 8, img: 'images/lt10_torre_x2.webp', tags: ['torre', 'organizador', 'mesa de luz', 'auxiliar'], desc: 'Torre angosta de dos niveles con marco alto: funciona de mesa de luz, de auxiliar del sillón o de organizador en el baño.' },

  { id: 'lt05', codigo: 'LT 05', nombre: 'Porta macetas x3', cat: 'deco', marca: 'taba', fondo: 'oscuro', precio: 29000, descuento: 0, stock: 12, img: 'images/lt05_porta_macetas.webp', tags: ['maceta', 'porta', 'plantas', 'x3', 'jardin'], desc: 'Tres soportes de distinta altura para levantar las macetas del piso. Se venden como juego y arman el rincón de plantas de una.' },
  { id: 'lt06', codigo: 'LT 06', nombre: 'Caja para vino', cat: 'deco', marca: 'taba', fondo: 'oscuro', precio: 23500, descuento: 0, stock: 15, img: 'images/lt06_caja_para_vino.webp', tags: ['caja', 'vino', 'regalo', 'presentacion'], desc: 'Caja de presentación para una botella, con tapa deslizante y agujero de agarre. Le grabamos el nombre si es para regalo.' },
  { id: 'lt31', codigo: 'LT 31', nombre: 'Perchero con estante', cat: 'deco', marca: 'taba', fondo: 'claro', precio: 38000, descuento: 0, stock: 6, destacado: true, img: 'images/p-perchero-estante.webp', tags: ['perchero', 'estante', 'pared', 'ganchos', 'entrada'], desc: 'Perchero de pared con estante superior y ganchos de hierro forjado. Para la entrada de casa: arriba el sombrero, abajo los abrigos.' },
  { id: 'lt33', codigo: 'LT 33', nombre: 'Perchero de pared 6 ganchos', cat: 'deco', marca: 'taba', fondo: 'claro', precio: 26500, descuento: 0, stock: 11, img: 'images/p-perchero-barra.webp', tags: ['perchero', 'barra', 'ganchos', 'pared'], desc: 'Barra de madera con seis ganchos de hierro, listo para atornillar. La versión angosta, para pasillos y detrás de la puerta.' },
  { id: 'lt36', codigo: 'LT 36', nombre: 'Espejo con marco rústico', cat: 'deco', marca: 'taba', fondo: 'claro', precio: 34000, descuento: 0, stock: 5, img: 'images/p-espejo-marco.webp', tags: ['espejo', 'marco', 'rustico', 'pared'], desc: 'Espejo con marco ancho de madera recuperada, con los nudos y las marcas a la vista. Cada uno sale distinto del anterior.' }
];

const Cart = {
  KEY: 'lataba_cart',
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
  const anim = opts.anim === false ? '' : ' data-animate style="opacity:0;transform:translateY(32px) scale(.96)"';
  return `<article class="prod" data-id="${esc(p.id)}" data-fondo="${esc(p.fondo)}"${anim}>
    <div class="prod-media">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1100" height="1100">
      ${badge}
      <span class="prod-codigo">${esc(p.codigo)}</span>
      <button type="button" class="prod-ver" data-ver="${esc(p.id)}">Ver la ficha</button>
    </div>
    <div class="prod-body">
      <span class="prod-marca">${esc(MARCAS[p.marca].nombre)}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <div class="prod-precios">${precios}</div>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">&minus;</button>
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
    const span = step.closest('[data-stepper]').querySelector('[data-qty]');
    span.textContent = Math.max(1, (parseInt(span.textContent, 10) || 1) + Number(step.dataset.step));
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = getProducto(add.dataset.add); if (!p) return;
    Cart.add(p, qtyDe(add));
    showToast('Listo, lo sumamos a tu pedido');
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
  if (ver) abrirModal(ver.dataset.ver);
});

function initRubros() {
  const grid = document.getElementById('rubroGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <a class="rubro" href="#tienda" data-cat-go="${esc(c.id)}" data-animate style="opacity:0;transform:translateY(28px) scale(.97)">
      <span class="rubro-tag">${esc(MARCAS[c.marca].nombre)}</span>
      <div class="rubro-media"><img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="1200" height="900"></div>
      <div class="rubro-txt"><h3><span>${esc(c.nombre)}</span></h3><p>${esc(c.desc)}</p></div>
    </a>`).join('');
  grid.querySelectorAll('[data-cat-go]').forEach(a => {
    a.addEventListener('click', () => aplicarCategoria(a.dataset.catGo));
  });
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p)).join('');

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
    if (!moved) { moved = true; vp.classList.add('dragging'); capturar(vp, pointerId); }
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
    if ((e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

const ORDEN_VIDRIERA = (() => {
  const porCat = CATEGORIAS.map(c => PRODUCTOS.filter(p => p.cat === c.id));
  const mezcla = [];
  for (let i = 0; mezcla.length < PRODUCTOS.length; i++) {
    porCat.forEach(lista => { if (lista[i]) mezcla.push(lista[i].id); });
  }
  return new Map(mezcla.map((id, i) => [id, i]));
})();

let filtroCat = 'all', filtroMarca = 'all', filtroOrden = 'rel', busqueda = '', visibles = 16;

function filtrados() {
  const q = normaliza(busqueda).trim();
  let out = PRODUCTOS.filter(p => {
    if (filtroCat !== 'all' && p.cat !== filtroCat) return false;
    if (filtroMarca !== 'all' && p.marca !== filtroMarca) return false;
    if (!q) return true;
    const heno = normaliza([p.nombre, p.codigo, p.codigo.replace(/\s+/g, ''), catNombre(p.cat), MARCAS[p.marca].nombre, p.desc, (p.tags || []).join(' ')].join(' '));
    return q.split(' ').every(t => heno.includes(t));
  });
  if (filtroOrden === 'precio-asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtroOrden === 'precio-desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (filtroOrden === 'codigo') out = out.slice().sort((a, b) => a.codigo.localeCompare(b.codigo, 'es'));
  else out = out.slice().sort((a, b) => ORDEN_VIDRIERA.get(a.id) - ORDEN_VIDRIERA.get(b.id));
  return out;
}

function pintarCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const info = document.getElementById('resultados');
  if (!grid) return;
  const lista = filtrados();
  grid.innerHTML = lista.slice(0, visibles).map(p => cardHTML(p)).join('');
  vacio.hidden = lista.length !== 0;
  grid.hidden = lista.length === 0;
  verMas.parentElement.hidden = lista.length <= visibles;
  const donde = filtroCat !== 'all' ? ' en ' + catNombre(filtroCat)
    : (filtroMarca !== 'all' ? ' de ' + MARCAS[filtroMarca].nombre : '');
  info.textContent = lista.length === 0 ? 'Sin resultados'
    : `${lista.length} pieza${lista.length === 1 ? '' : 's'}${donde}`;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function syncChips() {
  document.querySelectorAll('.chip-cat').forEach(c => c.classList.toggle('on', c.dataset.cat === filtroCat));
  document.querySelectorAll('[data-marca]').forEach(b => b.classList.toggle('on', b.dataset.marca === filtroMarca));
  const chips = document.getElementById('chipsCat');
  if (chips) {
    chips.querySelectorAll('[data-cat]').forEach(c => {
      const cat = CATEGORIAS.find(x => x.id === c.dataset.cat);
      c.hidden = !!(cat && filtroMarca !== 'all' && cat.marca !== filtroMarca);
    });
  }
}

function aplicarCategoria(cat) {
  filtroCat = cat; visibles = 16;
  const c = CATEGORIAS.find(x => x.id === cat);
  if (c && filtroMarca !== 'all' && c.marca !== filtroMarca) filtroMarca = 'all';
  syncChips();
  pintarCatalogo();
}

function aplicarMarca(marca) {
  filtroMarca = marca; visibles = 16;
  const c = CATEGORIAS.find(x => x.id === filtroCat);
  if (c && marca !== 'all' && c.marca !== marca) filtroCat = 'all';
  syncChips();
  pintarCatalogo();
}

function initCatalogo() {
  const marcas = document.getElementById('filtroMarcas');
  if (marcas) {
    marcas.innerHTML = `<button type="button" data-marca="all" class="on">Todo</button>` +
      Object.entries(MARCAS).map(([k, v]) => `<button type="button" data-marca="${esc(k)}">${esc(v.nombre)}</button>`).join('');
    marcas.addEventListener('click', e => {
      const b = e.target.closest('[data-marca]'); if (!b) return;
      aplicarMarca(b.dataset.marca);
    });
  }

  const chips = document.getElementById('chipsCat');
  if (!chips) return;
  chips.innerHTML = `<button type="button" class="chip-cat on" data-cat="all">Todos los rubros</button>` +
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

  document.getElementById('forden')?.addEventListener('change', e => { filtroOrden = e.target.value; visibles = 16; pintarCatalogo(); });

  const limpiar = () => {
    filtroCat = 'all'; filtroMarca = 'all'; filtroOrden = 'rel'; busqueda = ''; visibles = 16;
    if (q) q.value = '';
    const fo = document.getElementById('forden'); if (fo) fo.value = 'rel';
    syncChips();
    pintarCatalogo();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);
  document.getElementById('verMas')?.addEventListener('click', () => { visibles += 16; pintarCatalogo(); });

  document.querySelectorAll('[data-marca-go]').forEach(b => {
    b.addEventListener('click', () => {
      aplicarMarca(b.dataset.marcaGo);
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  syncChips();
  pintarCatalogo();
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
      <span class="vacio-ico" aria-hidden="true"></span>
      <h3>Todavía no elegiste ninguna pieza</h3>
      <p>Sumá lo que necesites y lo dejamos separado en el local.</p>
      <a class="btn btn-solid btn-sm" href="#tienda" data-cerrar-drawer>Ir al catálogo</a>
    </div>`;
    foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const fin = precioFinal(p);
    return `<div class="ci" data-ci="${esc(p.id)}">
      <div class="ci-media" data-fondo="${esc(p.fondo)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1100" height="1100" loading="lazy"></div>
      <div>
        <span class="ci-cod">${esc(p.codigo)}</span>
        <p class="ci-nombre">${esc(p.nombre)}</p>
        <p class="ci-precio">${formatearPrecio(fin)}</p>
        <div class="ci-bottom">
          <div class="stepper" data-stepper>
            <button type="button" data-ciq="-1" aria-label="Quitar una unidad">&minus;</button>
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
    const p = getProducto(i.id); return p ? `• ${p.codigo} — ${p.nombre} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean).join('\n');
  const msg = `Hola La Taba, quiero hacer este pedido:\n${detalle}\n\nTotal: ${formatearPrecio(Cart.total())}`;
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

function trapFocus(cont) {
  cont?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...cont.querySelectorAll('button, a[href], input, select')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
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
    if (e.key === 'Escape' && !document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
  trapFocus(document.getElementById('drawer'));
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
      <h4>De la misma línea</h4>
      <div class="vr-rel-grid">${rel.map(r => `
        <button type="button" class="vr-rel-item" data-ver="${esc(r.id)}">
          <span class="m" data-fondo="${esc(r.fondo)}"><img src="${esc(r.img)}" alt="${esc(r.nombre)}" width="1100" height="1100" loading="lazy"></span>
          <b>${esc(r.nombre)}</b><i>${formatearPrecio(precioFinal(r))}</i>
        </button>`).join('')}</div>
    </div>` : '';
  body.innerHTML = `<div class="vr">
    <div class="vr-media" data-fondo="${esc(p.fondo)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1100" height="1100"></div>
    <div class="vr-txt">
      <div class="vr-cab">
        <span class="vr-cat">${esc(MARCAS[p.marca].nombre)} · ${esc(catNombre(p.cat))}</span>
        <span class="vr-cod">${esc(p.codigo)}</span>
      </div>
      <h3>${esc(p.nombre)}</h3>
      <div class="vr-precios">${precios}</div>
      <p class="vr-desc">${esc(p.desc)}</p>
      <div class="vr-meta">${(p.tags || []).map(t => `<span class="vr-tag">${esc(t)}</span>`).join('')}</div>
      <div class="vr-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad">&minus;</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-solid" data-add="${esc(p.id)}">Agregar al pedido</button>
        <button type="button" class="btn btn-line" data-buy="${esc(p.id)}">Comprar ahora</button>
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
  trapFocus(modal);
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
    (document.querySelector('.barra') || document.body).appendChild(bd);
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

/* ---------- CAPÍTULO: DEL TABLÓN AL PRODUCTO ---------- */
function initTaller() {
  const stage = document.getElementById('stage');
  const pasos = [...document.querySelectorAll('#pasosTaller .paso')];
  if (!stage || !pasos.length) return;

  const setPaso = n => {
    const i = Math.max(0, Math.min(pasos.length - 1, n));
    if (stage.dataset.paso === String(i)) return;
    stage.dataset.paso = String(i);
    pasos.forEach((li, k) => li.classList.toggle('is-on', k === i));
  };
  setPaso(0);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    setPaso(3);
    return;
  }

  const desdeProgreso = p => setPaso(Math.floor(Math.min(0.999, Math.max(0, p)) * pasos.length));
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%',
      pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => desdeProgreso(self.progress)
    });
    return () => st.kill();
  });

  mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => desdeProgreso(self.progress)
    });
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

/* ---------- GSAP: PARALLAX ---------- */
function initGsap() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 };
    gsap.fromTo('.ph-1 img', { yPercent: -5, scale: 1.1 }, { yPercent: 5, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.ph-2 img', { yPercent: 5, scale: 1.1 }, { yPercent: -6, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.ph-3 img', { yPercent: -4, scale: 1.1 }, { yPercent: 4, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.disco-hero', { rotate: 0 }, { rotate: 140, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo('.disco-costura', { rotate: -60 }, {
      rotate: 60, ease: 'none',
      scrollTrigger: { trigger: '.sec-rubros', start: 'top bottom', end: 'bottom top', scrub: .5 }
    });
    gsap.fromTo('.marcas-foto img', { yPercent: -5, scale: 1.11 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.sec-marcas', start: 'top bottom', end: 'bottom top', scrub: .5 }
    });
  });
}

/* ---------- JSON-LD DE PRODUCTOS ---------- */
function injectProductSchema() {
  const base = 'https://gokywebs.com/demo/lataba/';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de La Taba',
    itemListElement: PRODUCTOS.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        sku: p.codigo,
        image: base + p.img,
        description: p.desc,
        category: catNombre(p.cat),
        brand: { '@type': 'Brand', name: MARCAS[p.marca].nombre },
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

initRubros();
initRail();
initCatalogo();
initReveals();
initNav();
initDrawer();
initModal();
initFloats();
initGsap();
initTaller();
injectProductSchema();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
