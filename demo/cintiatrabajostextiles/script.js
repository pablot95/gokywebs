const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491140308918';
const MAYOR_DESDE = 6;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const PRODUCTOS = [
  { foto: 'images/03_cesteria_nordica_1x1.webp', id: 1, slug: 'cesta-nordica-manijas-cuero', nombre: 'Cesta nórdica con manijas de cuero', categoria: 'Cestería nórdica', medida: '45 × 32 cm', ancho: 45, color: 'Crudo', tono: 'crudo', precio: 28900, precioMayor: 23900, descuento: 0, stock: 8, destacado: true, trenza: 'cesta',
    corta: 'La cesta grande del living, para mantas o juguetes.', completa: 'Cordón de algodón trenzado sobre base rígida, con manijas de cuero vacuno cosidas a mano. Mantiene la forma aunque esté vacía y se limpia con un paño húmedo.', cuidado: 'Limpiar en seco. No sumergir.' },
  { id: 2, slug: 'cesta-redonda-trenzada-chica', nombre: 'Cesta redonda trenzada chica', categoria: 'Cestería nórdica', medida: '24 × 20 cm', ancho: 24, color: 'Lino natural', tono: 'lino', precio: 12400, precioMayor: 9900, descuento: 0, stock: 14, destacado: false, trenza: 'cesta',
    corta: 'Para el escritorio, la mesa de luz o el cambiador.', completa: 'Cesta chica de cordón trenzado, ideal para ordenar cables, cremas o lanas. Entra en cualquier estante y se deja lavar a mano.', cuidado: 'Lavado a mano en agua fría.' },
  { id: 3, slug: 'set-tres-cestas-apilables', nombre: 'Set de tres cestas apilables', categoria: 'Cestería nórdica', medida: '3 medidas', ancho: 40, color: 'Crudo', tono: 'crudo', precio: 52000, precioMayor: 44000, descuento: 10, stock: 5, destacado: true, trenza: 'cesta',
    corta: 'Tres medidas que se guardan una dentro de la otra.', completa: 'Juego de tres cestas de 40, 30 y 22 cm de diámetro. Se apilan para guardar y se separan para usar en distintos ambientes.', cuidado: 'Limpiar en seco. No sumergir.' },
  { id: 4, slug: 'cesta-organizadora-cambiador', nombre: 'Cesta organizadora de cambiador', categoria: 'Cestería nórdica', medida: '38 × 26 cm', ancho: 38, color: 'Rosa viejo', tono: 'rosa', precio: 23500, precioMayor: 19500, descuento: 0, stock: 6, destacado: false, trenza: 'cesta',
    corta: 'Con tres divisiones internas cosidas.', completa: 'Cesta rectangular con tres bolsillos internos para separar pañales, cremas y toallitas. Base reforzada para que no se venza con el peso.', cuidado: 'Limpiar en seco. Las divisiones salen para lavar.' },
  { id: 5, slug: 'panera-base-rigida', nombre: 'Panera con base rígida', categoria: 'Cestería nórdica', medida: '22 × 12 cm', ancho: 22, color: 'Blanco roto', tono: 'blanco', precio: 9800, precioMayor: 7900, descuento: 0, stock: 20, destacado: false, trenza: 'cesta',
    corta: 'Va del horno a la mesa sin desarmarse.', completa: 'Panera de cordón con base rígida y borde reforzado. Aguanta el pan recién horneado y se puede plegar hacia afuera para mostrar el contenido.', cuidado: 'Lavado a mano en agua fría.' },
  { id: 6, slug: 'cesto-alto-mantas', nombre: 'Cesto alto para mantas', categoria: 'Cestería nórdica', medida: '50 × 45 cm', ancho: 50, color: 'Tierra', tono: 'tierra', precio: 49000, precioMayor: 41000, descuento: 0, stock: 3, destacado: true, trenza: 'cesta',
    corta: 'El más grande: entran dos mantas dobladas.', completa: 'Cesto de gran porte con estructura interna, pensado para el costado del sillón o el pie de la cama. Las manijas están cosidas en dos vueltas para soportar el peso lleno.', cuidado: 'Limpiar en seco. No sumergir.' },

  { foto: 'images/04_almohadones_textiles_1x1.webp', id: 7, slug: 'almohadon-texturado-flecos', nombre: 'Almohadón texturado con flecos', categoria: 'Almohadones', medida: '45 × 45 cm', ancho: 45, color: 'Crudo', tono: 'crudo', precio: 18900, precioMayor: 15400, descuento: 0, stock: 12, destacado: true, trenza: 'almohadon',
    corta: 'Textura en relieve y flecos cosidos al borde.', completa: 'Funda de algodón con textura en relieve tejida, flecos cosidos en los cuatro lados y cierre invisible al dorso. Se vende con relleno de vellón siliconado.', cuidado: 'La funda sale y se lava a máquina en frío.' },
  { id: 8, slug: 'almohadon-rayado-lino', nombre: 'Almohadón rayado de lino lavado', categoria: 'Almohadones', medida: '50 × 30 cm', ancho: 50, color: 'Gris piedra', tono: 'piedra', precio: 16500, precioMayor: 13500, descuento: 0, stock: 9, destacado: false, trenza: 'almohadon',
    corta: 'Rectangular, para el respaldo del sillón.', completa: 'Lino lavado con rayas tejidas, no estampadas: la raya no se borra con los lavados. Medida rectangular, la que mejor acompaña en el respaldo.', cuidado: 'Lavado a máquina en frío, secado a la sombra.' },
  { id: 9, slug: 'almohadon-bordado-mano', nombre: 'Almohadón bordado a mano', categoria: 'Almohadones', medida: '40 × 40 cm', ancho: 40, color: 'Rosa viejo', tono: 'rosa', precio: 21900, precioMayor: 18400, descuento: 0, stock: 4, destacado: true, trenza: 'almohadon',
    corta: 'Bordado punto por punto: no hay dos iguales.', completa: 'Base de algodón grueso con bordado a mano en hilo de algodón. Al ser bordado uno por uno, el dibujo tiene variaciones mínimas entre piezas.', cuidado: 'Lavado a mano en frío, sin frotar el bordado.' },
  { id: 10, slug: 'funda-almohadon-lisa', nombre: 'Funda de almohadón lisa', categoria: 'Almohadones', medida: '50 × 50 cm', ancho: 50, color: 'Blanco roto', tono: 'blanco', precio: 12900, precioMayor: 9900, descuento: 0, stock: 25, destacado: false, trenza: 'almohadon',
    corta: 'Sin relleno, para cambiar la que ya tenés.', completa: 'Funda sola, con cierre invisible al dorso y costuras reforzadas. Es 2 cm más chica que la medida del relleno para que quede bien tomada, como corresponde.', cuidado: 'Lavado a máquina en frío.' },
  { id: 11, slug: 'almohadon-de-piso', nombre: 'Almohadón de piso', categoria: 'Almohadones', medida: '60 × 60 cm', ancho: 60, color: 'Tierra', tono: 'tierra', precio: 32000, precioMayor: 27000, descuento: 0, stock: 6, destacado: false, trenza: 'almohadon',
    corta: 'Alto y firme, para sentarse de verdad.', completa: 'Almohadón grande con relleno firme de 15 cm de alto y manija lateral para moverlo. Pensado para el piso del living o el cuarto de juegos.', cuidado: 'La funda sale y se lava a máquina en frío.' },

  { foto: 'images/06_decoracion_mesa_1x1.webp', id: 12, slug: 'camino-mesa-lino', nombre: 'Camino de mesa de lino', categoria: 'Mesa', medida: '180 × 40 cm', ancho: 180, color: 'Lino natural', tono: 'lino', precio: 24500, precioMayor: 20500, descuento: 0, stock: 10, destacado: true, trenza: 'mesa',
    corta: 'Con 25 cm de caída de cada lado.', completa: 'Lino lavado con dobladillo hecho a mano en los cuatro lados. La medida está calculada para una mesa de 130 cm con caída pareja de 25 cm por punta.', cuidado: 'Lavado a máquina en frío, plancha tibia.' },
  { id: 13, slug: 'individual-redondo-trenzado', nombre: 'Individual redondo trenzado', categoria: 'Mesa', medida: '38 cm', ancho: 38, color: 'Crudo', tono: 'crudo', precio: 6900, precioMayor: 5200, descuento: 0, stock: 40, destacado: false, trenza: 'mesa',
    corta: 'Se vende por unidad, para armar el juego que quieras.', completa: 'Individual de cordón trenzado en espiral, 38 cm de diámetro y 6 mm de espesor. Aísla el calor del plato y se limpia con un paño.', cuidado: 'Paño húmedo. No sumergir.' },
  { id: 14, slug: 'set-cuatro-servilletas', nombre: 'Set de cuatro servilletas', categoria: 'Mesa', medida: '40 × 40 cm', ancho: 40, color: 'Blanco roto', tono: 'blanco', precio: 14800, precioMayor: 11900, descuento: 0, stock: 15, destacado: false, trenza: 'mesa',
    corta: 'Cuatro servilletas con dobladillo a mano.', completa: 'Algodón de trama cerrada con dobladillo doble cosido a mano en las cuatro puntas. Soportan el lavado frecuente sin deshilacharse.', cuidado: 'Lavado a máquina en caliente, plancha media.' },
  { id: 15, slug: 'mantel-rustico', nombre: 'Mantel rústico', categoria: 'Mesa', medida: '220 × 150 cm', ancho: 220, color: 'Lino natural', tono: 'lino', precio: 46000, precioMayor: 39000, descuento: 15, stock: 4, destacado: true, trenza: 'mesa',
    corta: 'Para mesa de seis, con 25 cm de caída.', completa: 'Mantel de lino rústico con dobladillo a mano y esquinas en inglete. La medida corresponde a una mesa de 170 × 100 cm con caída de 25 cm por lado.', cuidado: 'Lavado a máquina en frío, plancha tibia del revés.' },
  { id: 16, slug: 'posavasos-trenzados', nombre: 'Posavasos trenzados x6', categoria: 'Mesa', medida: '10 cm', ancho: 10, color: 'Gris piedra', tono: 'piedra', precio: 7400, precioMayor: 5900, descuento: 0, stock: 30, destacado: false, trenza: 'mesa',
    corta: 'Seis unidades, en dos tonos combinados.', completa: 'Juego de seis posavasos de cordón trenzado de 10 cm, tres en cada tono. Absorben la condensación del vaso sin marcar la mesa.', cuidado: 'Lavado a mano en agua fría.' },

  { foto: 'images/05_costura_organizacion_1x1.webp', id: 17, slug: 'organizador-costura', nombre: 'Organizador de costura de tela', categoria: 'Organización', medida: '30 × 22 cm', ancho: 30, color: 'Crudo', tono: 'crudo', precio: 19800, precioMayor: 16400, descuento: 0, stock: 7, destacado: true, trenza: 'org',
    corta: 'Bolsillos externos, alfiletero y divisiones internas.', completa: 'Caja de tela rígida con seis bolsillos externos, cuatro divisiones internas y alfiletero cosido en la tapa. Entra el kit completo de costura y se transporta de una mano.', cuidado: 'Limpiar en seco.' },
  { id: 18, slug: 'cesto-plegable-juguetes', nombre: 'Cesto plegable para juguetes', categoria: 'Organización', medida: '40 × 40 cm', ancho: 40, color: 'Gris piedra', tono: 'piedra', precio: 26500, precioMayor: 22000, descuento: 0, stock: 8, destacado: false, trenza: 'org',
    corta: 'Se dobla plano cuando no se usa.', completa: 'Cesto cuadrado con estructura desmontable: se saca el marco y queda plano para guardar. Interior impermeabilizado para limpiar de un paso.', cuidado: 'Interior con paño húmedo, exterior en seco.' },
  { id: 19, slug: 'bolsa-tela-manijas', nombre: 'Bolsa de tela con manijas', categoria: 'Organización', medida: '45 × 38 cm', ancho: 45, color: 'Tierra', tono: 'tierra', precio: 15900, precioMayor: 12900, descuento: 0, stock: 18, destacado: false, trenza: 'org',
    corta: 'Forrada y con base rígida: se para sola.', completa: 'Bolsa de lona con forro interno, base rígida removible y manijas cosidas en cuatro puntos. Sirve para la feria, la playa o el taller.', cuidado: 'Lavado a mano en frío, sin la base.' },
  { id: 20, slug: 'neceser-matelaseado', nombre: 'Neceser matelaseado', categoria: 'Organización', medida: '24 × 16 cm', ancho: 24, color: 'Rosa viejo', tono: 'rosa', precio: 11900, precioMayor: 9400, descuento: 0, stock: 22, destacado: false, trenza: 'org',
    corta: 'Matelaseado a máquina, con forro impermeable.', completa: 'Neceser con matelaseado cosido en rombos, cierre metálico y forro impermeable. Se abre del todo para ver el contenido de una.', cuidado: 'Lavado a mano en frío.' },

  { id: 21, slug: 'repasadores-algodon', nombre: 'Repasadores de algodón x2', categoria: 'Baño y cocina', medida: '50 × 70 cm', ancho: 50, color: 'Blanco roto', tono: 'blanco', precio: 10400, precioMayor: 8200, descuento: 0, stock: 26, destacado: false, trenza: 'bano',
    corta: 'Dos unidades, con colgador cosido.', completa: 'Algodón de trama abierta que seca rápido, con dobladillo doble y colgador cosido en una esquina. Vienen en dos tonos combinados.', cuidado: 'Lavado a máquina en caliente.' },
  { id: 22, slug: 'agarradera-manopla', nombre: 'Agarradera y manopla', categoria: 'Baño y cocina', medida: 'Set', ancho: 20, color: 'Lino natural', tono: 'lino', precio: 8900, precioMayor: 6900, descuento: 0, stock: 16, destacado: false, trenza: 'bano',
    corta: 'Con guata térmica en el interior.', completa: 'Set de agarradera cuadrada y manopla, ambas con guata térmica doble y ribete cosido. Aguantan la bandeja del horno sin transmitir el calor.', cuidado: 'Lavado a máquina en frío.' },
  { id: 23, slug: 'cesto-bano-tapa', nombre: 'Cesto de baño con tapa', categoria: 'Baño y cocina', medida: '32 × 30 cm', ancho: 32, color: 'Blanco roto', tono: 'blanco', precio: 27900, precioMayor: 23400, descuento: 0, stock: 0, destacado: false, trenza: 'bano',
    corta: 'Con tapa rígida forrada en la misma tela.', completa: 'Cesto de cordón con tapa rígida forrada y borde reforzado. Pensado para el baño: el interior lleva una capa impermeable cosida.', cuidado: 'Interior con paño húmedo, exterior en seco.' },
  { id: 24, slug: 'bolsa-portamate', nombre: 'Bolsa portamate', categoria: 'Baño y cocina', medida: '30 × 20 cm', ancho: 30, color: 'Tierra', tono: 'tierra', precio: 38000, precioMayor: 32000, descuento: 0, stock: 5, destacado: true, trenza: 'org',
    corta: 'Con lugar para mate, termo, yerba y bombilla.', completa: 'Bolsa con cuatro compartimentos acolchados: termo, mate, yerbera y bombilla. Manija ancha cosida en dos vueltas y base impermeable.', cuidado: 'Lavado a mano en frío.' }
];

const TRENZAS = {
  cesta: 'M14 46h72v34a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10zM26 46V34a24 24 0 0 1 48 0v12M34 60v20M50 60v20M66 60v20',
  almohadon: 'M16 20h68a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6zM10 26l14 12M90 26 76 38M10 74l14-12M90 74 76 62',
  mesa: 'M6 34h88v32H6zM6 42h88M6 58h88M22 34v32M50 34v32M78 34v32',
  org: 'M18 36h64v50H18zM18 36l6-16h52l6 16M40 36v50M60 36v50M18 58h64',
  bano: 'M22 26h56v58a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6zM22 44h56M36 26V16h28v10M50 58v22'
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioUnidad = (p, qty) => qty >= MAYOR_DESDE ? p.precioMayor : precioFinal(p);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tonoClase = p => 'port--' + p.tono;

function portada(p, alt) {
  if (p.foto) return `<span class="port port--foto"><img src="${p.foto}" width="1200" height="1200" alt="${esc(alt || p.nombre)}"></span>`;
  return `<span class="port ${tonoClase(p)}">
    <svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><path class="port__trenza" d="${TRENZAS[p.trenza] || TRENZAS.cesta}" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="port__m">${esc(p.medida)}</span>
  </span>`;
}

const Cart = {
  KEY: 'cintiatextiles_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnidad(p, i.qty) * i.qty : s; }, 0); },
  totalSinMayor() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  }
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

function precioHTML(p) {
  const fin = precioFinal(p);
  const desc = p.descuento > 0
    ? `<p class="prod-precio"><span class="off">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s></p>`
    : `<p class="prod-precio">${formatearPrecio(fin)}</p>`;
  return desc + `<p class="prod-mayor">Desde ${MAYOR_DESDE} u.: ${formatearPrecio(p.precioMayor)} c/u</p>`;
}

function stepperHTML(id, qty = 1) {
  return `<span class="stepper" data-stepper="${id}">
    <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
    <span data-qty>${qty}</span>
    <button type="button" data-step="1" aria-label="Sumar uno">+</button>
  </span>`;
}

function cardHTML(p) {
  const agotado = p.stock <= 0;
  const badge = agotado ? '<span class="prod-badge prod-badge--agot">Sin stock</span>'
    : p.descuento > 0 ? `<span class="prod-badge prod-badge--off">-${p.descuento}%</span>`
      : p.stock <= 4 ? '<span class="prod-badge">Últimas unidades</span>' : '';
  return `<article class="prod" data-animate style="opacity:0;transform:translateY(20px)" data-id="${p.id}">
    <button type="button" class="prod-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">${portada(p)}${badge}</button>
    <div class="prod-body">
      <p class="prod-cat">${esc(p.categoria)}</p>
      <h3 class="prod-name"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-dato">${esc(p.medida)} · ${esc(p.color)}</p>
      ${precioHTML(p)}
      <div class="prod-actions">
        ${agotado ? '' : stepperHTML(p.id)}
        <button type="button" class="prod-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
      </div>
    </div>
  </article>`;
}

function filaHTML(p) {
  const agotado = p.stock <= 0;
  return `<article class="prod fila" data-animate style="opacity:0;transform:translateY(16px)" data-id="${p.id}">
    <button type="button" class="fila-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">${portada(p)}</button>
    <div class="fila-info">
      <p class="prod-cat">${esc(p.categoria)}</p>
      <h3 class="prod-name"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-dato">${esc(p.medida)} · ${esc(p.color)}${agotado ? ' · sin stock, se cose a pedido' : ''}</p>
    </div>
    <p class="fila-pr"><span class="fila-pr__k">Por unidad</span><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
    <p class="fila-pr fila-pr--may"><span class="fila-pr__k">Desde ${MAYOR_DESDE} u.</span><strong>${formatearPrecio(p.precioMayor)}</strong></p>
    <div class="fila-acts">
      ${agotado ? '' : stepperHTML(p.id)}
      <button type="button" class="prod-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'A pedido' : 'Sumar'}</button>
    </div>
  </article>`;
}

/* ---------- Catálogo ---------- */
const FILTROS = { q: '', categoria: [], color: [], tamano: [], precio: [], extra: [], orden: 'destacado' };
const PASO = 16;
let visibles = PASO;
let idsPrev = [];
let flipActual = null;
let reasiento = null;

const TAMANOS = [
  { id: 'chico', label: 'Hasta 30 cm', test: p => p.ancho <= 30 },
  { id: 'medio', label: '31 a 50 cm', test: p => p.ancho > 30 && p.ancho <= 50 },
  { id: 'grande', label: 'Más de 50 cm', test: p => p.ancho > 50 }
];
const RANGOS = [
  { id: 'r1', label: 'Hasta $12.000', test: n => n <= 12000 },
  { id: 'r2', label: '$12.000 a $28.000', test: n => n > 12000 && n <= 28000 },
  { id: 'r3', label: 'Más de $28.000', test: n => n > 28000 }
];
const SWATCH = { 'Crudo': '#efe7db', 'Lino natural': '#e2d5c1', 'Rosa viejo': '#e9cfc7', 'Gris piedra': '#dad5cb', 'Tierra': '#cbb8a1', 'Blanco roto': '#f7f3ed' };

function chipsDe(id, valores, grupo, swatch) {
  const cont = document.getElementById(id);
  if (!cont) return;
  cont.innerHTML = valores.map(v => `<button type="button" class="f-chip" aria-pressed="false" data-grupo="${grupo}" data-val="${esc(v.val)}">${swatch ? `<span class="f-chip__sw" style="background:${SWATCH[v.val] || '#fff'}"></span>` : ''}${esc(v.label)}</button>`).join('');
}

function initFiltros() {
  chipsDe('f-categoria', [...new Set(PRODUCTOS.map(p => p.categoria))].map(c => ({ val: c, label: c })), 'categoria');
  chipsDe('f-color', [...new Set(PRODUCTOS.map(p => p.color))].map(c => ({ val: c, label: c })), 'color', true);
  chipsDe('f-tamano', TAMANOS.map(t => ({ val: t.id, label: t.label })), 'tamano');
  chipsDe('f-precio', RANGOS.map(r => ({ val: r.id, label: r.label })), 'precio');
  chipsDe('f-extra', [{ val: 'stock', label: 'Solo con stock' }, { val: 'oferta', label: 'Con descuento' }], 'extra');

  document.querySelectorAll('.f-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const g = chip.dataset.grupo, v = chip.dataset.val;
      const on = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (on) FILTROS[g] = FILTROS[g].filter(x => x !== v);
      else FILTROS[g].push(v);
      visibles = PASO;
      pintarCatalogo();
    });
  });
  document.getElementById('f-clear')?.addEventListener('click', () => limpiarFiltros(true));
  document.getElementById('vacio-reset')?.addEventListener('click', () => {
    const q = document.getElementById('q'); if (q) q.value = '';
    FILTROS.q = '';
    limpiarFiltros(true);
  });
}

function limpiarFiltros(pintar) {
  ['categoria', 'color', 'tamano', 'precio', 'extra'].forEach(g => { FILTROS[g] = []; });
  document.querySelectorAll('.f-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  visibles = PASO;
  sincronizarTabs();
  if (pintar !== false) pintarCatalogo();
}

function filtrar() {
  const q = normal(FILTROS.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  let res = PRODUCTOS.filter(p => {
    if (FILTROS.categoria.length && !FILTROS.categoria.includes(p.categoria)) return false;
    if (FILTROS.color.length && !FILTROS.color.includes(p.color)) return false;
    if (FILTROS.tamano.length && !FILTROS.tamano.some(id => TAMANOS.find(t => t.id === id)?.test(p))) return false;
    if (FILTROS.precio.length && !FILTROS.precio.some(id => RANGOS.find(r => r.id === id)?.test(precioFinal(p)))) return false;
    if (FILTROS.extra.includes('stock') && p.stock <= 0) return false;
    if (FILTROS.extra.includes('oferta') && !(p.descuento > 0)) return false;
    if (palabras.length) {
      const blob = normal([p.nombre, p.categoria, p.color, p.medida, p.corta].join(' '));
      if (!palabras.every(w => blob.includes(w))) return false;
    }
    return true;
  });
  if (FILTROS.orden === 'menor') res = res.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (FILTROS.orden === 'mayor') res = res.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else res = res.slice().sort((a, b) => (b.destacado === true) - (a.destacado === true) || a.id - b.id);
  return res;
}

/* Momento propio: el reorden visible de la grilla al filtrar */
function asentar(cards, ids) {
  cards.forEach(c => {
    const on = ids.includes(Number(c.dataset.id));
    if (typeof gsap !== 'undefined') gsap.killTweensOf(c);
    ['opacity', 'transform', 'position', 'left', 'top', 'width', 'height', 'margin'].forEach(prop => c.style.removeProperty(prop));
    c.style.display = on ? '' : 'none';
    if (on) c.classList.add('in');
  });
}

function reordenar(grid, ids) {
  const cards = [...grid.querySelectorAll('.prod')];
  if (!cards.length) return false;
  const puedo = typeof gsap !== 'undefined' && typeof Flip !== 'undefined' && !reduceMotion;
  if (!puedo) { asentar(cards, ids); return true; }
  if (flipActual) flipActual.kill();
  clearTimeout(reasiento);
  asentar(cards, idsPrev.length ? idsPrev : ids);
  const estado = Flip.getState(cards);
  asentar(cards, ids);
  idsPrev = ids;
  const cerrar = () => asentar(cards, ids);
  flipActual = Flip.from(estado, { duration: .55, ease: 'power2.inOut', stagger: .02, onComplete: cerrar });
  reasiento = setTimeout(() => { cerrar(); setTimeout(cerrar, 1300); }, 900);
  return true;
}

function pintarCatalogo(animar) {
  const grid = document.getElementById('catalogo-grid') || document.getElementById('mayorista-lista');
  if (!grid) return;
  const esLista = grid.id === 'mayorista-lista';
  const res = filtrar();
  const mostrar = res.slice(0, visibles);
  const ids = mostrar.map(p => p.id);
  const yaEstan = [...grid.querySelectorAll('.prod')].map(c => Number(c.dataset.id));
  const mismos = ids.every(id => yaEstan.includes(id)) && yaEstan.length >= ids.length;

  if (animar && mismos && yaEstan.length) {
    reordenar(grid, ids);
  } else {
    grid.innerHTML = mostrar.map(esLista ? filaHTML : cardHTML).join('');
    idsPrev = ids;
    revelarNuevos(grid);
    sincronizarSteppers();
  }

  const vacio = document.getElementById('cat-vacio');
  if (vacio) vacio.hidden = res.length > 0;
  grid.hidden = res.length === 0;
  const mas = document.getElementById('ver-mas');
  if (mas) mas.hidden = res.length <= visibles;
  const cnt = document.getElementById('cat-count');
  if (cnt) {
    const cats = FILTROS.categoria.length ? ' en ' + FILTROS.categoria.join(' y ') : '';
    cnt.innerHTML = `<b>${res.length}</b> producto${res.length === 1 ? '' : 's'}${esc(cats)}`;
  }
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid') || document.getElementById('mayorista-lista');
  if (!grid) return;
  initFiltros();
  pintarCatalogo(false);
  const q = document.getElementById('q');
  let t;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { FILTROS.q = q.value; visibles = PASO; pintarCatalogo(); }, 180);
  });
  document.getElementById('orden')?.addEventListener('change', e => { FILTROS.orden = e.target.value; visibles = PASO; pintarCatalogo(true); });
  document.getElementById('ver-mas')?.addEventListener('click', () => { visibles += PASO; pintarCatalogo(false); });
  document.querySelectorAll('.chip-cat').forEach(chip => {
    chip.addEventListener('click', () => filtrarPorCategoria(chip.dataset.cat));
  });
  sincronizarTabs();
}

function sincronizarTabs() {
  document.querySelectorAll('.chip-cat[role="tab"]').forEach(t => {
    const activo = (t.dataset.cat || '') === (FILTROS.categoria[0] || '');
    t.setAttribute('aria-selected', String(activo));
  });
}

function filtrarPorCategoria(cat) {
  limpiarFiltros(false);
  FILTROS.categoria = cat ? [cat] : [];
  document.querySelectorAll('#f-categoria .f-chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.val === cat)));
  sincronizarTabs();
  const q = document.getElementById('q'); if (q) { q.value = ''; FILTROS.q = ''; }
  visibles = PASO;
  pintarCatalogo(true);
  const destino = document.getElementById('tienda') || document.getElementById('mayorista');
  destino?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initFiltrosMobile() {
  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtros');
  const close = document.getElementById('filtrosClose');
  if (!toggle || !panel) return;
  const bd = document.querySelector('.drawer-backdrop');
  const cerrar = () => {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (bd && !document.getElementById('drawer')?.classList.contains('open')) { bd.classList.remove('open'); bd.hidden = true; }
    toggle.focus();
  };
  toggle.addEventListener('click', () => {
    if (panel.classList.contains('open')) { cerrar(); return; }
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    if (bd) { bd.hidden = false; requestAnimationFrame(() => bd.classList.add('open')); }
  });
  close?.addEventListener('click', cerrar);
  bd?.addEventListener('click', () => { if (panel.classList.contains('open')) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });
}

/* ---------- Rail sugeridos ---------- */
function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  const sel = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  const extra = PRODUCTOS.filter(p => !p.destacado && p.stock > 0).slice(0, Math.max(0, 8 - sel.length));
  track.innerHTML = sel.concat(extra).map(cardHTML).join('');
  revelarNuevos(track);
  sincronizarSteppers();

  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 240) + 20;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  let down = false, moved = false, x0 = 0, s0 = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
    sync();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}

/* ---------- Panel del pedido (Modelo 2) ---------- */
function pintarPanelMayorista() {
  const body = document.getElementById('may-panel-body');
  if (!body) return;
  Cart.syncStock();
  const items = Cart.get();
  const tot = document.getElementById('may-total');
  const ver = document.getElementById('may-ver');
  if (!items.length) {
    body.innerHTML = '<p class="may-panel__vacio">Sumá cantidades en la lista y el pedido se arma acá.</p>';
    if (tot) tot.textContent = formatearPrecio(0);
    if (ver) ver.disabled = true;
    return;
  }
  if (ver) ver.disabled = false;
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const unidad = precioUnidad(p, i.qty);
    return `<div class="may-linea">
      <span class="may-linea__q">${i.qty}×</span>
      <span class="may-linea__t">${esc(p.nombre)}${i.qty >= MAYOR_DESDE ? '<span class="may-linea__may">por cantidad</span>' : ''}</span>
      <span class="may-linea__p">${formatearPrecio(unidad * i.qty)}</span>
      <button type="button" class="may-linea__x" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">×</button>
    </div>`;
  }).join('');
  if (tot) tot.textContent = formatearPrecio(Cart.total());
}

function initMayorista() {
  const panel = document.getElementById('mayorista-panel');
  if (!panel) return;
  pintarPanelMayorista();
  panel.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(Number(q.dataset.quitar)); showToast('Lo sacamos del pedido.'); return; }
    if (e.target.closest('#may-ver')) abrirDrawer();
  });
}

/* ---------- Componente: tu medida ---------- */
const MEDIDAS = {
  camino: { a: 'Largo de la mesa', b: 'Ancho de la mesa', cat: 'Mesa', tarifa: 24000, base: 7000 },
  mantel: { a: 'Largo de la mesa', b: 'Ancho de la mesa', cat: 'Mesa', tarifa: 11000, base: 9000 },
  almohadon: { a: 'Ancho del relleno', b: 'Alto del relleno', cat: 'Almohadones', tarifa: 24000, base: 14000 },
  cortina: { a: 'Ancho de la ventana', b: 'Alto hasta el piso', cat: null, tarifa: 13000, base: 12000 }
};
let medidaUltima = null;

function calcularMedida(tipo, a, b) {
  if (tipo === 'camino') {
    const ancho = Math.min(50, Math.max(35, Math.round(b / 3 / 5) * 5));
    const largo = a + 50;
    return { ancho, largo, texto: `Sobre una mesa de ${a} × ${b} cm, el camino va de ${largo} × ${ancho} cm: 25 cm de caída en cada punta y un tercio del ancho de la mesa, que es la proporción que mejor queda.` };
  }
  if (tipo === 'mantel') {
    return { ancho: b + 50, largo: a + 50, texto: `Para una mesa de ${a} × ${b} cm, el mantel va de ${a + 50} × ${b + 50} cm: 25 cm de caída por los cuatro lados, que llega hasta la falda de la silla sin tocar el piso.` };
  }
  if (tipo === 'almohadon') {
    return { ancho: Math.max(20, b - 2), largo: Math.max(20, a - 2), texto: `Para un relleno de ${a} × ${b} cm, la funda se cose de ${a - 2} × ${b - 2} cm. Va 2 cm más chica a propósito: así el almohadón queda lleno y no se arruga en las puntas.` };
  }
  const ancho = Math.round(a * 2.2 / 5) * 5;
  return { ancho, largo: b + 15, texto: `Para una ventana de ${a} cm de ancho, la cortina se corta de ${ancho} cm: 2,2 veces el ancho para que el frunce quede parejo. El largo suma 15 cm de cabezal y dobladillo.` };
}

function initMedida() {
  const form = document.getElementById('medida-form');
  if (!form) return;
  const tipo = document.getElementById('m-tipo');
  const res = document.getElementById('medida-res');
  const err = document.getElementById('medida-err');

  const sincronizarLabels = () => {
    const m = MEDIDAS[tipo.value];
    document.getElementById('lbl-a').textContent = m.a;
    document.getElementById('lbl-b').textContent = m.b;
  };
  tipo.addEventListener('change', sincronizarLabels);
  sincronizarLabels();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const a = parseInt(document.getElementById('m-a').value, 10) || 0;
    const b = parseInt(document.getElementById('m-b').value, 10) || 0;
    if (a < 10 || b < 10) { err.hidden = false; res.hidden = true; return; }
    err.hidden = true;
    const calc = calcularMedida(tipo.value, a, b);
    const conf = MEDIDAS[tipo.value];
    const m2 = (calc.ancho * calc.largo) / 10000;
    const estimado = Math.round((m2 * conf.tarifa + conf.base) / 500) * 500;
    medidaUltima = { tipo: tipo.value, a, b, calc, estimado };
    document.getElementById('medida-num').textContent = `${calc.largo} × ${calc.ancho} cm`;
    document.getElementById('medida-msg').textContent = calc.texto;
    document.getElementById('medida-est').textContent = `Estimado orientativo: ${formatearPrecio(estimado)}. El valor final depende de la tela que elijas y lo confirmamos por WhatsApp.`;
    res.hidden = false;
    if (!reduceMotion) res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('medida-wsp')?.addEventListener('click', () => {
    const nombres = { camino: 'un camino de mesa', mantel: 'un mantel', almohadon: 'una funda de almohadón', cortina: 'una cortina' };
    const txt = medidaUltima
      ? `Hola Cintia! Calculé en la web ${nombres[medidaUltima.tipo]} de ${medidaUltima.calc.largo} × ${medidaUltima.calc.ancho} cm (mi medida es ${medidaUltima.a} × ${medidaUltima.b} cm). ¿Me pasás colores y valor final?`
      : 'Hola Cintia! Quiero consultar por una pieza a medida.';
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
  });
  document.getElementById('medida-ver')?.addEventListener('click', () => {
    const cat = medidaUltima ? MEDIDAS[medidaUltima.tipo].cat : null;
    if (!cat) { showToast('Las cortinas y paneles van siempre a medida: escribinos y las cotizamos.'); return; }
    filtrarPorCategoria(cat);
  });
}

/* ---------- Steppers ---------- */
const qtys = {};
function sincronizarSteppers() {
  document.querySelectorAll('[data-stepper]').forEach(st => {
    const id = Number(st.dataset.stepper);
    const p = getProducto(id);
    const q = qtys[id] || 1;
    st.querySelector('[data-qty]').textContent = q;
    st.querySelector('[data-step="-1"]').disabled = q <= 1;
    st.querySelector('[data-step="1"]').disabled = !!p && q >= p.stock;
  });
}
function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    const st = b.closest('[data-stepper]');
    const id = Number(st.dataset.stepper);
    const p = getProducto(id);
    const q = Math.max(1, Math.min((qtys[id] || 1) + Number(b.dataset.step), p?.stock ?? 99));
    qtys[id] = q;
    sincronizarSteppers();
  });
}

/* ---------- Drawer ---------- */
let ultimoFoco = null;

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  Cart.syncStock();
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio"><p>Tu pedido está vacío por ahora.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver el catálogo</button></div>`;
    if (foot) foot.hidden = true;
    const tot = document.getElementById('drawer-total');
    if (tot) tot.textContent = formatearPrecio(0);
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const unidad = precioUnidad(p, i.qty);
    const mayor = i.qty >= MAYOR_DESDE;
    return `<div class="linea">
      <span class="linea__p">${portada(p)}</span>
      <div>
        <p class="linea__t">${esc(p.nombre)}</p>
        <p class="linea__m">${esc(p.medida)} · ${esc(p.color)} · ${formatearPrecio(unidad)} c/u${mayor ? ' (por cantidad)' : ''}</p>
        <span class="linea__q">${stepperHTML(p.id, i.qty)}<button type="button" class="linea__x" data-quitar="${p.id}">Quitar</button></span>
      </div>
      <p class="linea__pr">${formatearPrecio(unidad * i.qty)}</p>
    </div>`;
  }).join('');
  body.querySelectorAll('[data-stepper]').forEach(st => {
    const id = Number(st.dataset.stepper);
    const it = items.find(i => i.id === id);
    const p = getProducto(id);
    st.querySelector('[data-qty]').textContent = it.qty;
    st.querySelector('[data-step="-1"]').disabled = it.qty <= 1;
    st.querySelector('[data-step="1"]').disabled = it.qty >= (p?.stock ?? 99);
  });
  if (foot) {
    foot.hidden = false;
    document.getElementById('drawer-total').textContent = formatearPrecio(Cart.total());
    const ahorro = Cart.totalSinMayor() - Cart.total();
    let ah = foot.querySelector('.drawer-ahorro');
    if (ahorro > 0) {
      if (!ah) { ah = document.createElement('p'); ah.className = 'drawer-ahorro'; foot.insertBefore(ah, foot.querySelector('.drawer-nota')); }
      ah.textContent = `Precio por cantidad aplicado: ahorrás ${formatearPrecio(ahorro)}.`;
    } else if (ah) ah.remove();
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  ultimoFoco = document.activeElement;
  pintarDrawer();
  bd.hidden = false; dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}
function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  dr.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => { if (dr.classList.contains('open')) cerrarDrawer(); });
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(Number(q.dataset.quitar)); pintarDrawer(); showToast('Lo sacamos de tu pedido.'); return; }
    const st = e.target.closest('[data-step]');
    if (st) {
      const id = Number(st.closest('[data-stepper]').dataset.stepper);
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + Number(st.dataset.step));
      pintarDrawer();
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dr.classList.contains('open')) cerrarDrawer();
    if (e.key === 'Tab' && dr.classList.contains('open')) trap(e, dr);
  });
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- Modal ---------- */
function modalHTML(p) {
  const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id && x.stock > 0).slice(0, 3);
  const agotado = p.stock <= 0;
  return `<div class="modal-media">${portada(p)}</div>
  <div class="modal-info">
    <p class="prod-cat">${esc(p.categoria)}</p>
    <h2 class="modal-t">${esc(p.nombre)}</h2>
    <p class="modal-desc">${esc(p.completa)}</p>
    <dl class="modal-datos">
      <div><dt>Medida</dt><dd>${esc(p.medida)}</dd></div>
      <div><dt>Color</dt><dd>${esc(p.color)}</dd></div>
      <div><dt>Cuidado</dt><dd>${esc(p.cuidado)}</dd></div>
      <div><dt>Disponibilidad</dt><dd>${agotado ? 'Sin stock, se cose a pedido' : p.stock + ' en stock'}</dd></div>
    </dl>
    <div class="modal-buy">
      ${precioHTML(p)}
      <div class="prod-actions">
        ${agotado ? '' : stepperHTML(p.id, qtys[p.id] || 1)}
        <button type="button" class="prod-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Consultar por encargo' : 'Agregar al pedido'}</button>
      </div>
    </div>
    ${rel.length ? `<div class="modal-rel"><h3>También de ${esc(p.categoria)}</h3><div class="modal-rel-grid">${rel.map(r => `<button type="button" data-open="${r.id}">${portada(r)}<span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
  </div>`;
}

function abrirModal(id) {
  const p = getProducto(Number(id));
  const modal = document.getElementById('modal');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  document.getElementById('modal-content').innerHTML = modalHTML(p);
  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  sincronizarSteppers();
  document.getElementById('modal-close')?.focus();
}
function cerrarModal() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}
function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target.closest('[data-close-modal]')) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) trap(e, modal);
  });
}

/* ---------- Acciones globales ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { abrirModal(open.dataset.open); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(Number(add.dataset.add));
      if (!p || p.stock <= 0) return;
      const q = qtys[p.id] || 1;
      Cart.add(p, q);
      qtys[p.id] = 1;
      sincronizarSteppers();
      showToast(q > 1 ? `${q} × ${p.nombre} en tu pedido.` : `${p.nombre} en tu pedido.`);
    }
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- Reveals ---------- */
let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.54)}s`;
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

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
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
  let intentos = 0;
  const reloj = setInterval(() => { sweep(); if (++intentos >= 12) clearInterval(reloj); }, 500);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.04, 0.28)}s`; });
  setTimeout(() => nuevos.forEach(el => el.classList.add('in')), 40);
}

/* ---------- Nav ---------- */
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

/* ---------- Floats ---------- */
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

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  Cart.syncStock();
  initCatalogo();
  if (typeof initMayorista === 'function') initMayorista();
  initRail();
  initReveals();
  initSteppers();
  initMedida();
  initNav();
  initDrawer();
  initModal();
  initFiltrosMobile();
  initAcciones();
  initFloats();
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (document.getElementById('drawer')?.classList.contains('open')) pintarDrawer();
    if (typeof pintarPanelMayorista === 'function') pintarPanelMayorista();
  });
  updateCartBadge();
});
