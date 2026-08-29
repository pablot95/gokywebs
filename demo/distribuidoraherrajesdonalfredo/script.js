/* global esc, formatearPrecio, precioFinal, wspUrl, filtrarProductos, paginar, clampQty, calcularCount, calcularTotal */
const WHATSAPP_NUMBER = '5491138670661';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getProducto = id => PRODUCTOS.find(p => p.id === id);

const CATEGORIAS = [
  { id: 'cerraduras', nombre: 'Cerraduras y cilindros', img: 'images/cerradura-cilindro-960x1200.webp' },
  { id: 'candados', nombre: 'Candados', img: 'images/candado-dorado-1200x1500.webp' },
  { id: 'bisagras', nombre: 'Bisagras', icon: 'bisagra' },
  { id: 'manijas', nombre: 'Manijas y picaportes', img: 'images/manija-puerta-960x1200.webp' },
  { id: 'pasadores', nombre: 'Pasadores y cerrojos', icon: 'pasador' },
  { id: 'portones', nombre: 'Herrajes para portones y rejas', img: 'images/porton-hierro-1200x1600.webp' },
  { id: 'llaves', nombre: 'Llaves y copiado', img: 'images/llaves-mano-1200x1500.webp' },
  { id: 'herramientas', nombre: 'Herramientas y accesorios', img: 'images/herramientas-fila-1200x1500.webp' },
];

const ICONS = {
  bisagra: '<rect x="4" y="4" width="7" height="16" rx="1.2"/><rect x="13" y="4" width="7" height="16" rx="1.2"/><circle cx="12" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
  pasador: '<rect x="2" y="10" width="13" height="4" rx="1"/><rect x="17" y="6" width="4" height="12" rx="1"/>',
};

function getCategoria(id) { return CATEGORIAS.find(c => c.id === id); }

const PRODUCTOS = [
  { id: 1, slug: 'cerradura-embutir-45mm', nombre: 'Cerradura de embutir 45mm', categoria: 'cerraduras', marca: 'Nortex', precio: 32900, descuento: 0, stock: 18, descripcion: 'Cerradura de embutir para puerta de madera o chapa, cuerpo de acero y frente cromado.', tags: ['acero', 'puerta', 'embutir'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },
  { id: 2, slug: 'cilindro-europeo-70mm', nombre: 'Cilindro europeo de seguridad 70mm', categoria: 'cerraduras', marca: 'Acerix', precio: 24500, descuento: 10, stock: 25, descripcion: 'Cilindro europeo con sistema anti-extracción, 3 llaves incluidas.', tags: ['cilindro', 'seguridad', 'europeo'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },
  { id: 3, slug: 'cerradura-multipunto-blindada', nombre: 'Cerradura multipunto para puerta blindada', categoria: 'cerraduras', marca: 'Robusta', precio: 68000, descuento: 0, stock: 0, descripcion: 'Sistema multipunto de 3 puntos de anclaje para puertas blindadas.', tags: ['multipunto', 'blindada', 'seguridad'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },
  { id: 4, slug: 'cerrojo-sobreponer-cilindro', nombre: 'Cerrojo de sobreponer con cilindro', categoria: 'cerraduras', marca: 'Praxis', precio: 19800, descuento: 0, stock: 30, descripcion: 'Cerrojo de sobreponer con cilindro de seguridad, ideal como refuerzo.', tags: ['cerrojo', 'sobreponer', 'refuerzo'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },
  { id: 5, slug: 'cerradura-electrica-porton', nombre: 'Cerradura eléctrica para portón', categoria: 'cerraduras', marca: 'Vertex', precio: 54300, descuento: 0, stock: 9, descripcion: 'Cerradura eléctrica 12V para portones con apertura a distancia.', tags: ['electrica', 'porton', '12v'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },
  { id: 6, slug: 'bombin-antibumping', nombre: 'Bombín de seguridad anti-bumping', categoria: 'cerraduras', marca: 'Acerix', precio: 29900, descuento: 15, stock: 14, descripcion: 'Bombín con protección anti-bumping y anti-ganzúa, perfil europeo.', tags: ['bombin', 'antibumping', 'seguridad'], imagenes: ['images/cerradura-cilindro-960x1200.webp'] },

  { id: 7, slug: 'candado-bronce-50mm', nombre: 'Candado de bronce macizo 50mm', categoria: 'candados', marca: 'Nortex', precio: 11200, descuento: 0, stock: 40, descripcion: 'Candado de bronce macizo, arco templado, con dos llaves.', tags: ['bronce', 'candado', 'arco'], imagenes: ['images/candado-dorado-1200x1500.webp'] },
  { id: 8, slug: 'candado-acero-laminado-60mm', nombre: 'Candado de acero laminado 60mm', categoria: 'candados', marca: 'Robusta', precio: 14800, descuento: 0, stock: 35, descripcion: 'Candado de acero laminado de alta resistencia para uso exterior.', tags: ['acero', 'laminado', 'exterior'], imagenes: ['images/candado-negro-1200x1500.webp'] },
  { id: 9, slug: 'candado-combinacion-4-digitos', nombre: 'Candado con combinación de 4 dígitos', categoria: 'candados', marca: 'Praxis', precio: 9500, descuento: 0, stock: 50, descripcion: 'Candado a combinación de 4 dígitos, sin necesidad de llave.', tags: ['combinacion', 'sin llave'], imagenes: ['images/candado-dorado-1200x1500.webp'] },
  { id: 10, slug: 'mini-candado-valijas', nombre: 'Mini candado para mochilas y valijas', categoria: 'candados', marca: 'Vertex', precio: 4300, descuento: 0, stock: 60, descripcion: 'Mini candado liviano para mochilas, valijas y bolsos.', tags: ['mini', 'valija', 'mochila'], imagenes: ['images/candado-negro-1200x1500.webp'] },
  { id: 11, slug: 'candado-disco-portones', nombre: 'Candado de disco para portones', categoria: 'candados', marca: 'Acerix', precio: 22000, descuento: 12, stock: 20, descripcion: 'Candado tipo disco, bajo perfil, resistente a la palanca.', tags: ['disco', 'porton', 'palanca'], imagenes: ['images/candado-dorado-1200x1500.webp'] },
  { id: 12, slug: 'candado-reforzado-cadena', nombre: 'Candado reforzado con cadena', categoria: 'candados', marca: 'Robusta', precio: 26500, descuento: 0, stock: 15, descripcion: 'Candado reforzado con cadena de acero de 1 metro incluida.', tags: ['cadena', 'reforzado'], imagenes: ['images/candado-negro-1200x1500.webp'] },

  { id: 13, slug: 'bisagra-reforzada-4-pulgadas', nombre: 'Bisagra reforzada 4 pulgadas', categoria: 'bisagras', marca: 'Nortex', precio: 3800, descuento: 0, stock: 80, descripcion: 'Bisagra reforzada de 4 pulgadas con rulemán, para puertas pesadas.', tags: ['bisagra', 'ruleman', 'puerta'], imagenes: [] },
  { id: 14, slug: 'bisagra-invisible-muebles', nombre: 'Bisagra invisible para muebles', categoria: 'bisagras', marca: 'Praxis', precio: 2900, descuento: 0, stock: 70, descripcion: 'Bisagra invisible de montaje oculto para muebles y placares.', tags: ['invisible', 'mueble', 'placard'], imagenes: [] },
  { id: 15, slug: 'bisagra-piano-metro', nombre: 'Bisagra de piano por metro', categoria: 'bisagras', marca: 'Acerix', precio: 6200, descuento: 0, stock: 0, descripcion: 'Bisagra de piano continua, se vende por metro lineal.', tags: ['piano', 'continua', 'metro'], imagenes: [] },
  { id: 16, slug: 'bisagra-vaiven-local', nombre: 'Bisagra vaivén para puerta de local', categoria: 'bisagras', marca: 'Robusta', precio: 8900, descuento: 0, stock: 18, descripcion: 'Bisagra vaivén de doble acción para puertas de local comercial.', tags: ['vaiven', 'local', 'comercial'], imagenes: [] },
  { id: 17, slug: 'bisagra-ajustable-3-posiciones', nombre: 'Bisagra ajustable de 3 posiciones', categoria: 'bisagras', marca: 'Vertex', precio: 5400, descuento: 10, stock: 40, descripcion: 'Bisagra ajustable en 3 posiciones para regular el cierre de la puerta.', tags: ['ajustable', 'regulable'], imagenes: [] },

  { id: 18, slug: 'manija-palanca-inoxidable', nombre: 'Manija tipo palanca acero inoxidable', categoria: 'manijas', marca: 'Nortex', precio: 16700, descuento: 0, stock: 28, descripcion: 'Manija tipo palanca en acero inoxidable, roseta incluida.', tags: ['palanca', 'inoxidable', 'roseta'], imagenes: ['images/manija-puerta-960x1200.webp'] },
  { id: 19, slug: 'picaporte-antiguo-bronce', nombre: 'Picaporte antiguo de bronce', categoria: 'manijas', marca: 'Praxis', precio: 12300, descuento: 0, stock: 20, descripcion: 'Picaporte de línea antigua en bronce, para puertas de estilo clásico.', tags: ['picaporte', 'bronce', 'antiguo'], imagenes: ['images/manija-puerta-960x1200.webp'] },
  { id: 20, slug: 'manija-cilindro-incorporado', nombre: 'Manija con cilindro incorporado', categoria: 'manijas', marca: 'Acerix', precio: 21900, descuento: 10, stock: 16, descripcion: 'Manija con cilindro de seguridad incorporado, lista para instalar.', tags: ['manija', 'cilindro', 'completo'], imagenes: ['images/manija-puerta-960x1200.webp'] },
  { id: 21, slug: 'tirador-doble-vidriada', nombre: 'Tirador doble para puerta vidriada', categoria: 'manijas', marca: 'Robusta', precio: 18500, descuento: 0, stock: 22, descripcion: 'Tirador doble para puertas vidriadas, fijación pasante.', tags: ['tirador', 'vidrio', 'doble'], imagenes: ['images/manija-puerta-960x1200.webp'] },
  { id: 22, slug: 'pomo-giratorio-interior', nombre: 'Pomo giratorio para interior', categoria: 'manijas', marca: 'Vertex', precio: 9800, descuento: 0, stock: 33, descripcion: 'Pomo giratorio simple para puertas interiores sin llave.', tags: ['pomo', 'interior'], imagenes: ['images/manija-puerta-960x1200.webp'] },
  { id: 23, slug: 'set-manija-cilindro-bocallave', nombre: 'Set manija + cilindro + bocallave', categoria: 'manijas', marca: 'Nortex', precio: 27400, descuento: 0, stock: 12, descripcion: 'Set completo: manija, cilindro y bocallave a juego.', tags: ['set', 'completo', 'juego'], imagenes: ['images/manija-puerta-960x1200.webp'] },

  { id: 24, slug: 'pasador-seguridad-reforzado', nombre: 'Pasador de seguridad reforzado', categoria: 'pasadores', marca: 'Nortex', precio: 7600, descuento: 0, stock: 45, descripcion: 'Pasador de seguridad reforzado con base de acero.', tags: ['pasador', 'seguridad'], imagenes: [] },
  { id: 25, slug: 'cerrojo-sobreponer-simple', nombre: 'Cerrojo de sobreponer simple', categoria: 'pasadores', marca: 'Praxis', precio: 5900, descuento: 0, stock: 50, descripcion: 'Cerrojo de sobreponer simple, instalación rápida.', tags: ['cerrojo', 'simple'], imagenes: [] },
  { id: 26, slug: 'pasador-candado-incluido', nombre: 'Pasador con candado incluido', categoria: 'pasadores', marca: 'Acerix', precio: 13200, descuento: 0, stock: 24, descripcion: 'Pasador con candado a juego incluido en el mismo pack.', tags: ['pasador', 'candado', 'pack'], imagenes: [] },
  { id: 27, slug: 'falleba-ventana-dos-hojas', nombre: 'Falleba para ventana de dos hojas', categoria: 'pasadores', marca: 'Robusta', precio: 10400, descuento: 8, stock: 19, descripcion: 'Falleba de cierre superior e inferior para ventanas de dos hojas.', tags: ['falleba', 'ventana'], imagenes: [] },
  { id: 28, slug: 'cerrojo-deslizante-porton', nombre: 'Cerrojo deslizante para portón', categoria: 'pasadores', marca: 'Vertex', precio: 8700, descuento: 0, stock: 30, descripcion: 'Cerrojo deslizante de acero para portones peatonales.', tags: ['cerrojo', 'deslizante', 'porton'], imagenes: [] },

  { id: 29, slug: 'bisagra-pesada-porton-chapa', nombre: 'Bisagra pesada para portón de chapa', categoria: 'portones', marca: 'Robusta', precio: 9900, descuento: 0, stock: 26, descripcion: 'Bisagra pesada soldable para portones de chapa y caño.', tags: ['bisagra', 'porton', 'soldable'], imagenes: ['images/porton-hierro-1200x1600.webp'] },
  { id: 30, slug: 'cerradura-reja-perimetral', nombre: 'Cerradura para reja perimetral', categoria: 'portones', marca: 'Nortex', precio: 31200, descuento: 0, stock: 10, descripcion: 'Cerradura reforzada para rejas y cercos perimetrales.', tags: ['reja', 'perimetral'], imagenes: ['images/porton-hierro-1200x1600.webp'] },
  { id: 31, slug: 'pasador-porton-argolla', nombre: 'Pasador de portón con argolla', categoria: 'portones', marca: 'Praxis', precio: 6800, descuento: 0, stock: 38, descripcion: 'Pasador con argolla para colocar candado, uso en portones.', tags: ['pasador', 'argolla'], imagenes: ['images/porton-hierro-1200x1600.webp'] },
  { id: 32, slug: 'tranca-reforzada-porton-doble', nombre: 'Tranca reforzada para portón doble', categoria: 'portones', marca: 'Acerix', precio: 17500, descuento: 10, stock: 15, descripcion: 'Tranca central reforzada para portones de dos hojas.', tags: ['tranca', 'doble hoja'], imagenes: ['images/porton-hierro-1200x1600.webp'] },
  { id: 33, slug: 'rueda-nylon-porton-corredizo', nombre: 'Rueda de nylon para portón corredizo', categoria: 'portones', marca: 'Vertex', precio: 12900, descuento: 0, stock: 20, descripcion: 'Rueda de nylon reforzado para portones corredizos.', tags: ['rueda', 'corredizo', 'nylon'], imagenes: ['images/porton-hierro-1200x1600.webp'] },
  { id: 34, slug: 'kit-herrajes-porton-completo', nombre: 'Kit de herrajes completo para portón', categoria: 'portones', marca: 'Robusta', precio: 39600, descuento: 0, stock: 8, descripcion: 'Kit completo: bisagras, tranca, pasador y ruedas para un portón.', tags: ['kit', 'completo', 'porton'], imagenes: ['images/porton-hierro-1200x1600.webp'] },

  { id: 35, slug: 'copiado-llave-simple', nombre: 'Copiado de llave simple (servicio)', categoria: 'llaves', marca: 'Servicio propio', precio: 2800, descuento: 0, stock: 999, descripcion: 'Servicio de copiado de llave simple en el mostrador, al momento.', tags: ['copiado', 'servicio', 'llave'], imagenes: ['images/llaves-mano-1200x1500.webp'] },
  { id: 36, slug: 'copiado-llave-seguridad', nombre: 'Copiado de llave de seguridad (servicio)', categoria: 'llaves', marca: 'Servicio propio', precio: 6500, descuento: 0, stock: 999, descripcion: 'Servicio de copiado de llaves de seguridad con perfil registrado.', tags: ['copiado', 'seguridad'], imagenes: ['images/llaves-mano-1200x1500.webp'] },
  { id: 37, slug: 'llave-pico-loro', nombre: 'Llave tipo pico de loro', categoria: 'llaves', marca: 'Nortex', precio: 3400, descuento: 0, stock: 55, descripcion: 'Llave ajustable tipo pico de loro, mango antideslizante.', tags: ['llave', 'ajustable', 'herramienta'], imagenes: ['images/llaves-mano-1200x1500.webp'] },
  { id: 38, slug: 'llavero-seguridad-reforzado', nombre: 'Llavero de seguridad con anilla reforzada', categoria: 'llaves', marca: 'Praxis', precio: 2100, descuento: 0, stock: 70, descripcion: 'Llavero con anilla de acero reforzada, difícil de forzar.', tags: ['llavero', 'anilla'], imagenes: ['images/llaves-mano-1200x1500.webp'] },
  { id: 39, slug: 'duplicado-bombin-completo', nombre: 'Duplicado de bombín completo (servicio)', categoria: 'llaves', marca: 'Servicio propio', precio: 15900, descuento: 0, stock: 999, descripcion: 'Duplicado de bombín completo con juego de llaves nuevo.', tags: ['bombin', 'duplicado', 'servicio'], imagenes: ['images/llaves-mano-1200x1500.webp'] },

  { id: 40, slug: 'set-destornilladores-x6', nombre: 'Set de destornilladores x6', categoria: 'herramientas', marca: 'Vertex', precio: 8400, descuento: 0, stock: 40, descripcion: 'Set de 6 destornilladores planos y phillips, mango ergonómico.', tags: ['destornillador', 'set'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
  { id: 41, slug: 'pinza-universal-8-pulgadas', nombre: 'Pinza universal 8 pulgadas', categoria: 'herramientas', marca: 'Acerix', precio: 6900, descuento: 0, stock: 35, descripcion: 'Pinza universal de 8 pulgadas, acero al cromo vanadio.', tags: ['pinza', 'universal'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
  { id: 42, slug: 'taladro-percutor-600w', nombre: 'Taladro percutor 600W', categoria: 'herramientas', marca: 'Robusta', precio: 54900, descuento: 15, stock: 10, descripcion: 'Taladro percutor 600W con mandril de 13mm, ideal para instalar herrajes.', tags: ['taladro', 'percutor', '600w'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
  { id: 43, slug: 'caja-tornillos-surtidos-x200', nombre: 'Caja de tornillos surtidos x200', categoria: 'herramientas', marca: 'Praxis', precio: 5200, descuento: 0, stock: 60, descripcion: 'Caja organizadora con 200 tornillos surtidos para uso general.', tags: ['tornillos', 'surtido'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
  { id: 44, slug: 'cinta-metrica-5-metros', nombre: 'Cinta métrica 5 metros', categoria: 'herramientas', marca: 'Nortex', precio: 3100, descuento: 0, stock: 90, descripcion: 'Cinta métrica de 5 metros con traba y clip de cinturón.', tags: ['cinta', 'metrica', 'medicion'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
  { id: 45, slug: 'nivel-burbuja-40cm', nombre: 'Nivel de burbuja 40cm', categoria: 'herramientas', marca: 'Vertex', precio: 4700, descuento: 0, stock: 45, descripcion: 'Nivel de burbuja de 40cm, cuerpo de aluminio.', tags: ['nivel', 'burbuja', 'aluminio'], imagenes: ['images/herramientas-fila-1200x1500.webp'] },
];

const DESTACADOS_IDS = [2, 6, 8, 12, 20, 34, 39, 42];

const Cart = {
  KEY: 'herrajesdonalfredo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = clampQty(existing.qty + qty, producto.stock);
    else items.push({ id: producto.id, qty: clampQty(qty, producto.stock) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = clampQty(qty, p?.stock); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return calcularCount(this.get()); },
  total() { return calcularTotal(this.get(), PRODUCTOS); },
};

function mediaHtml(producto, imgClass) {
  if (producto.imagenes && producto.imagenes.length) {
    return `<img src="${esc(producto.imagenes[0])}" alt="${esc(producto.nombre)}" class="${imgClass || ''}">`;
  }
  const cat = getCategoria(producto.categoria);
  return `<div class="cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICONS[cat?.icon] || ''}</svg></div>`;
}

function productCardHtml(p) {
  const catNombre = getCategoria(p.categoria)?.nombre || '';
  const final = precioFinal(p);
  const agotado = p.stock <= 0;
  let badge = '';
  if (agotado) badge = `<span class="prod-badge prod-badge--out">Sin stock</span>`;
  else if (p.descuento > 0) badge = `<span class="prod-badge">-${p.descuento}%</span>`;
  return `
  <article class="prod-card" data-id="${p.id}" data-animate="rise-sm">
    <div class="prod-media" data-open-modal="${p.id}">
      <span class="prod-ref">REF. ${String(p.id).padStart(3, '0')}</span>
      ${badge}
      ${mediaHtml(p)}
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(catNombre)}</span>
      <h3 class="prod-name">${esc(p.nombre)}</h3>
      <div class="prod-price-row">
        <span class="prod-price">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      ${!agotado && p.stock <= 5 ? `<span class="prod-stock-low">¡Últimas unidades!</span>` : ''}
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step-down aria-label="Restar cantidad" ${agotado ? 'disabled' : ''}>−</button>
          <output>${agotado ? 0 : 1}</output>
          <button type="button" data-step-up aria-label="Sumar cantidad" ${agotado ? 'disabled' : ''}>+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}" ${agotado ? 'disabled' : ''}>
          ${agotado ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
      <button type="button" class="prod-buy-full" data-buy="${p.id}" ${agotado ? 'disabled' : ''}>Comprar ahora</button>
    </div>
  </article>`;
}

function renderCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map((c, i) => `
    <a class="cat-card" href="#tienda" data-cat-filter="${c.id}" data-animate="rise-sm">
      <div class="cat-media">
        <span class="cat-folio">${String(i + 1).padStart(2, '0')}</span>
        ${c.img ? `<img src="${esc(c.img)}" alt="${esc(c.nombre)}">` : `<div class="cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon] || ''}</svg></div>`}
      </div>
      <div class="cat-body">
        <h3>${esc(c.nombre)}</h3>
        <span>${PRODUCTOS.filter(p => p.categoria === c.id).length} productos</span>
      </div>
    </a>`).join('');

  const footerCats = document.getElementById('footerCategorias');
  if (footerCats) {
    footerCats.innerHTML = CATEGORIAS.slice(0, 6).map(c => `<li><a href="#tienda" data-cat-filter="${c.id}">${esc(c.nombre)}</a></li>`).join('');
  }
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const items = DESTACADOS_IDS.map(getProducto).filter(Boolean);
  track.innerHTML = items.map(productCardHtml).join('');
  bindCardEvents(track);
}

/* ===== Catálogo: búsqueda, filtros y paginación ===== */
const PAGE_SIZE = 16;
let catalogoVisible = PAGE_SIZE;

function poblarFiltros() {
  const selCat = document.getElementById('filtroCategoria');
  const selMarca = document.getElementById('filtroMarca');
  CATEGORIAS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.nombre;
    selCat.appendChild(opt);
  });
  const marcas = [...new Set(PRODUCTOS.map(p => p.marca))].sort((a, b) => a.localeCompare(b, 'es'));
  marcas.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    selMarca.appendChild(opt);
  });
}

function productosFiltrados() {
  const query = document.getElementById('buscador').value;
  const categoria = document.getElementById('filtroCategoria').value;
  const marca = document.getElementById('filtroMarca').value;
  const rango = document.getElementById('filtroPrecio').value;
  const [min, max] = rango ? rango.split('-').map(Number) : [null, null];
  return filtrarProductos(PRODUCTOS, CATEGORIAS, { query, categoria, marca, min, max });
}

function renderCatalogo(resetPage) {
  if (resetPage) catalogoVisible = PAGE_SIZE;
  const grid = document.getElementById('catalogoGrid');
  const empty = document.getElementById('catalogoEmpty');
  const countEl = document.getElementById('catalogoCount');
  const verMasBtn = document.getElementById('verMasBtn');
  const wrap = verMasBtn.closest('.load-more-wrap');

  const items = productosFiltrados();
  countEl.textContent = items.length === 0 ? '' : `${items.length} producto${items.length === 1 ? '' : 's'} encontrado${items.length === 1 ? '' : 's'}`;

  if (!items.length) {
    grid.innerHTML = ''; empty.hidden = false; wrap.hidden = true;
    return;
  }
  empty.hidden = true;
  const visibles = paginar(items, catalogoVisible);
  grid.innerHTML = visibles.map(productCardHtml).join('');
  wrap.hidden = catalogoVisible >= items.length;

  revelarNuevos(grid);
  bindCardEvents(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

/* ===== Reveals ===== */
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.56)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    revealsListos = true;
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
  revealsListos = true;
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const els = cont.querySelectorAll('[data-animate]:not(.in)');
  els.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    if (reduceMotion) { el.classList.add('in'); return; }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 1.15) requestAnimationFrame(() => el.classList.add('in'));
  });
}

/* ===== Toast ===== */
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

/* ===== Badge del carrito ===== */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ===== Drawer del carrito ===== */
function drawerItemHtml(item) {
  const p = getProducto(item.id);
  if (!p) return '';
  return `
  <div class="drawer-item" data-drawer-item="${p.id}">
    <div class="media">${mediaHtml(p)}</div>
    <div class="drawer-item-body">
      <span class="name">${esc(p.nombre)}</span>
      <span class="prod-price">${formatearPrecio(precioFinal(p) * item.qty)}</span>
      <div class="drawer-item-row">
        <div class="stepper" data-stepper-drawer="${p.id}">
          <button type="button" data-step-down aria-label="Restar cantidad">−</button>
          <output>${item.qty}</output>
          <button type="button" data-step-up aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="drawer-item-remove" data-remove="${p.id}">Quitar</button>
      </div>
    </div>
  </div>`;
}

function renderDrawer() {
  const itemsEl = document.getElementById('drawerItems');
  const foot = document.getElementById('drawerFoot');
  const items = Cart.get();
  if (!items.length) {
    itemsEl.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <p>Tu carrito está vacío. Todavía no elegiste ningún herraje.</p>
        <a href="#tienda" class="btn btn-outline" id="drawerEmptyGo">Ir al catálogo</a>
      </div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  itemsEl.innerHTML = items.map(drawerItemHtml).join('');
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
}

function initDrawerEvents() {
  document.getElementById('drawerItems').addEventListener('click', e => {
    const stepUp = e.target.closest('[data-step-up]');
    const stepDown = e.target.closest('[data-step-down]');
    const removeBtn = e.target.closest('[data-remove]');
    if (stepUp || stepDown) {
      const wrap = e.target.closest('[data-stepper-drawer]');
      const id = Number(wrap.dataset.stepperDrawer);
      const item = Cart.get().find(i => i.id === id);
      if (!item) return;
      Cart.setQty(id, item.qty + (stepUp ? 1 : -1));
    } else if (removeBtn) {
      Cart.remove(Number(removeBtn.dataset.remove));
    }
  });
  document.addEventListener('cart:updated', () => {
    if (document.getElementById('cartDrawer').classList.contains('open')) renderDrawer();
  });
}

function openDrawer() {
  document.getElementById('drawerBackdrop').classList.add('open');
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.add('open'); drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'overlay-open');
  window.lenis?.stop();
  renderDrawer();
  drawer.querySelector('.drawer-close')?.focus();
}
function closeDrawer() {
  document.getElementById('drawerBackdrop').classList.remove('open');
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.remove('open'); drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll', 'overlay-open');
  window.lenis?.start();
  document.getElementById('cart-btn')?.focus();
}

/* ===== Modal de vista rápida ===== */
function modalContentHtml(p) {
  const catNombre = getCategoria(p.categoria)?.nombre || '';
  const final = precioFinal(p);
  const agotado = p.stock <= 0;
  const relacionados = PRODUCTOS.filter(r => r.categoria === p.categoria && r.id !== p.id).slice(0, 3);
  return `
    <div class="modal-media">${mediaHtml(p)}</div>
    <div class="modal-body">
      <span class="modal-cat">${esc(catNombre)}</span>
      <h2 id="modalTitle">${esc(p.nombre)}</h2>
      <div class="modal-price-row">
        <span class="modal-price">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s><span class="prod-badge" style="position:static">-${p.descuento}%</span>` : ''}
      </div>
      <p class="modal-desc">${esc(p.descripcion)}</p>
      <div class="modal-attrs">
        <span class="modal-attr">Línea: ${esc(p.marca)}</span>
        <span class="modal-attr">${agotado ? 'Sin stock' : p.stock <= 5 ? 'Últimas unidades' : 'En stock'}</span>
      </div>
      <div class="modal-qty-row">
        <div class="stepper" data-stepper-modal="${p.id}">
          <button type="button" data-step-down aria-label="Restar cantidad" ${agotado ? 'disabled' : ''}>−</button>
          <output>${agotado ? 0 : 1}</output>
          <button type="button" data-step-up aria-label="Sumar cantidad" ${agotado ? 'disabled' : ''}>+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" data-add="${p.id}" data-modal-source ${agotado ? 'disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn-primary" data-buy="${p.id}" data-modal-source ${agotado ? 'disabled' : ''}>Comprar ahora</button>
      </div>
      ${relacionados.length ? `
      <div class="modal-related">
        <h3>También te puede interesar</h3>
        <div class="modal-related-grid">
          ${relacionados.map(r => `
            <div class="modal-related-item" data-open-modal="${r.id}">
              <div class="media">${mediaHtml(r)}</div>
              <span>${esc(r.nombre)}</span>
            </div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
}

let lastFocusedBeforeModal = null;
function openModal(id) {
  const p = getProducto(id);
  if (!p) return;
  lastFocusedBeforeModal = document.activeElement;
  document.getElementById('modalContent').innerHTML = modalContentHtml(p);
  document.getElementById('modalBackdrop').classList.add('open');
  const modal = document.getElementById('quickModal');
  modal.setAttribute('aria-labelledby', 'modalTitle');
  modal.classList.add('open'); modal.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'overlay-open');
  window.lenis?.stop();
  bindCardEvents(document.getElementById('modalContent'));
  document.getElementById('modalClose')?.focus();
  const url = new URL(location.href);
  url.searchParams.set('producto', p.slug);
  window.history.replaceState(null, '', url);
}
function closeModal() {
  const modal = document.getElementById('quickModal');
  document.getElementById('modalBackdrop').classList.remove('open');
  modal.classList.remove('open'); modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll', 'overlay-open');
  window.lenis?.start();
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  lastFocusedBeforeModal?.focus();
}

/* ===== Eventos compartidos (cards, stepper, agregar, comprar) ===== */
function bindCardEvents(root) {
  root.querySelectorAll('[data-open-modal]').forEach(el => {
    if (el.dataset.bound) return; el.dataset.bound = '1';
    el.addEventListener('click', () => openModal(Number(el.dataset.openModal)));
  });
  root.querySelectorAll('[data-stepper], [data-stepper-modal]').forEach(st => {
    if (st.dataset.bound) return; st.dataset.bound = '1';
    const id = Number(st.dataset.stepper || st.dataset.stepperModal);
    const p = getProducto(id);
    const out = st.querySelector('output');
    st.querySelector('[data-step-up]').addEventListener('click', () => {
      out.textContent = Math.min(Number(out.textContent) + 1, p?.stock ?? 99);
    });
    st.querySelector('[data-step-down]').addEventListener('click', () => {
      out.textContent = Math.max(1, Number(out.textContent) - 1);
    });
  });
  root.querySelectorAll('[data-add]').forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.add);
      const p = getProducto(id);
      const qty = qtyFor(root, id);
      Cart.add(p, qty);
      showToast('¡Agregado! Tu carrito te espera.');
    });
  });
  root.querySelectorAll('[data-buy]').forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.buy);
      const p = getProducto(id);
      const qty = qtyFor(root, id);
      Cart.add(p, qty);
      if (document.getElementById('quickModal').classList.contains('open')) closeModal();
      openDrawer();
    });
  });
}
function qtyFor(root, id) {
  const st = root.querySelector(`[data-stepper="${id}"], [data-stepper-modal="${id}"]`);
  return st ? Number(st.querySelector('output').textContent) : 1;
}

/* ===== Rail: drag + wheel + flechas ===== */
function initRail() {
  const vp = document.getElementById('railViewport');
  if (!vp) return;
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

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
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ } }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

  const syncArrows = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -280, behavior: 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: 280, behavior: 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows);
  syncArrows();
}

/* ===== Filtros: eventos ===== */
function initFiltros() {
  const buscador = document.getElementById('buscador');
  const selCat = document.getElementById('filtroCategoria');
  const selMarca = document.getElementById('filtroMarca');
  const selPrecio = document.getElementById('filtroPrecio');
  let debounceId;
  buscador.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => renderCatalogo(true), 220);
  });
  [selCat, selMarca, selPrecio].forEach(sel => sel.addEventListener('change', () => renderCatalogo(true)));

  const limpiar = () => {
    buscador.value = ''; selCat.value = ''; selMarca.value = ''; selPrecio.value = '';
    renderCatalogo(true);
  };
  document.getElementById('filtrosClear').addEventListener('click', limpiar);
  document.getElementById('emptyClear').addEventListener('click', limpiar);

  document.getElementById('verMasBtn').addEventListener('click', () => {
    catalogoVisible += PAGE_SIZE;
    renderCatalogo(false);
  });
}

function initAnchors() {
  const selCat = document.getElementById('filtroCategoria');
  document.addEventListener('click', e => {
    const catLink = e.target.closest('[data-cat-filter]');
    if (catLink) {
      e.preventDefault();
      selCat.value = catLink.dataset.catFilter;
      renderCatalogo(true);
      document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

/* ===== Nav mobile ===== */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

/* ===== Overlays: cierre con Esc + backdrop ===== */
function initOverlays() {
  document.getElementById('cart-btn').addEventListener('click', openDrawer);
  document.getElementById('cart-float').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('quickModal').classList.contains('open')) closeModal();
    else if (document.getElementById('cartDrawer').classList.contains('open')) closeDrawer();
  });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    closeDrawer();
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('click', e => {
    if (e.target.id === 'drawerEmptyGo') closeDrawer();
  });
}

/* ===== Flotantes: carrito + WhatsApp ===== */
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

function initWhatsapp() {
  const url = wspUrl(WHATSAPP_NUMBER, ['Hola! Quiero consultar sobre herrajes y cerraduras.']);
  ['wsp-float', 'wsp-inline', 'wsp-inline-2', 'wsp-inline-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

/* ===== Anti-copia ===== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ===== Capítulo: el plano que se arma ===== */
function initPlano() {
  const stage = document.getElementById('planoStage');
  if (!stage) return;
  const partsFor = step => document.querySelectorAll(`.plano-part[data-step="${step}"]`);
  const check = document.querySelector('.plano-check');
  const steps = document.querySelectorAll('.plano-step');

  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.plano-part').forEach(el => el.style.opacity = 1);
    if (check) check.style.opacity = 1;
    steps.forEach(s => s.classList.add('is-on'));
    return;
  }

  gsap.set(partsFor(1), { x: -22 });
  gsap.set(partsFor(2), { scale: .5, transformOrigin: '259px 230px' });
  gsap.set(partsFor(3), { rotation: -76 });
  gsap.set(partsFor(4), { rotation: -30, opacity: 0 });
  gsap.set(partsFor(5), { scaleX: 0, transformOrigin: '272px 229px' });
  gsap.set(check, { scale: .5 });

  const setStep = progress => {
    const idx = Math.min(4, Math.floor(progress * 5));
    steps.forEach(s => s.classList.toggle('is-on', Number(s.dataset.stepIndex) === idx));
  };

  const buildTimeline = () => {
    const tl = gsap.timeline();
    tl.to(partsFor(1), { x: 0, opacity: 1, duration: 1 })
      .to(partsFor(2), { scale: 1, opacity: 1, duration: 1 }, '+=.1')
      .to(partsFor(3), { rotation: 0, opacity: 1, duration: 1 }, '+=.1')
      .to(partsFor(4), { rotation: 20, opacity: 1, duration: .6 }, '+=.1')
      .to(partsFor(5), { scaleX: 1, duration: .6 }, '+=.1')
      .to(check, { scale: 1, opacity: 1, duration: .5 }, '<');
    return tl;
  };

  if (typeof ScrollTrigger === 'undefined') { buildTimeline().progress(1); steps.forEach(s => s.classList.add('is-on')); return; }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=220%',
        pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress),
      },
    });
    tl.add(buildTimeline());
  });

  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom',
        scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress),
      },
    });
    tl.add(buildTimeline());
    return () => stage.classList.remove('is-sticky-mobile');
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    buildTimeline().progress(1);
    steps.forEach(s => s.classList.add('is-on'));
  });
}

/* ===== Init ===== */
function initGsapBase() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  initGsapBase();
  initWhatsapp();
  poblarFiltros();
  renderCategorias();
  renderRail();
  renderCatalogo(true);
  initRail();
  initFiltros();
  initAnchors();
  initDrawerEvents();
  initReveals();
  initNav();
  initOverlays();
  initFloats();
  initPlano();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();

  const params = new URLSearchParams(location.search);
  const slug = params.get('producto');
  if (slug) {
    const p = PRODUCTOS.find(x => x.slug === slug);
    if (p) openModal(p.id);
  }
});
