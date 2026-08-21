const WHATSAPP_NUMBER = '5491132325398';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const waHref = lines => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

const CATEGORIAS = [
  { id: 'jabon-liquido', nombre: 'Jabón líquido', imagen: 'images/dispenser-jabon-1200x1200.webp' },
  { id: 'suavizantes', nombre: 'Suavizantes', imagen: 'images/detalle-linea-productos-1600x1300.webp' },
  { id: 'lavandina', nombre: 'Lavandina', imagen: 'images/hero-productos-1920x1080.webp' },
  { id: 'cloro', nombre: 'Cloro', imagen: 'images/gotas-frescura-1600x1200.webp' },
  { id: 'bolsas-residuos', nombre: 'Bolsas de residuos', imagen: 'images/bolsas-residuos-1200x1200.webp' },
  { id: 'esponjas', nombre: 'Esponjas', imagen: 'images/esponjas-1200x1200.webp' },
  { id: 'trapos-piso', nombre: 'Trapos de piso', imagen: 'images/profesional-limpieza-1600x1300.webp' },
  { id: 'escobas-secadores', nombre: 'Escobas y secadores', imagen: 'images/escoba-secador-1200x1200.webp' },
];
const IMG_POR_CATEGORIA = {
  'jabon-liquido': 'images/dispenser-jabon-1200x1200.webp',
  'suavizantes': 'images/detalle-linea-productos-1600x1300.webp',
  'lavandina': 'images/hero-productos-1920x1080.webp',
  'cloro': 'images/hero-productos-1920x1080.webp',
  'bolsas-residuos': 'images/bolsas-residuos-1200x1200.webp',
  'esponjas': 'images/esponjas-1200x1200.webp',
  'trapos-piso': 'images/profesional-limpieza-1600x1300.webp',
  'escobas-secadores': 'images/escoba-secador-1200x1200.webp',
};
const categoriaNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || id;

const PRODUCTOS_RAW = [
  ['jabon-liquido-ropa-3l', 'Jabón líquido para ropa 3L', 'jabon-liquido', 'Botella', 'Hogar', 'Limpieza profunda para el lavado diario de ropa.', 'Jabón líquido concentrado para lavado a máquina o a mano. Disuelve fácil en agua fría y cuida los colores.'],
  ['jabon-liquido-ropa-5l', 'Jabón líquido para ropa 5L', 'jabon-liquido', 'Bidón', 'Comercial', 'Formato grande para lavanderías y consumo frecuente.', 'El mismo jabón líquido para ropa en bidón de 5 litros, pensado para lavaderos, consorcios y uso intensivo.', 1, 0],
  ['jabon-liquido-vajilla-750ml', 'Jabón líquido para vajilla 750ml', 'jabon-liquido', 'Botella', 'Hogar', 'Corta la grasa y rinde en cada lavado.', 'Fórmula desengrasante para platos, ollas y utensilios. Poco producto alcanza para mucha vajilla.'],
  ['jabon-liquido-vajilla-5l', 'Jabón líquido para vajilla 5L', 'jabon-liquido', 'Bidón', 'Comercial', 'El formato que necesita una cocina que no para.', 'Bidón de 5 litros para restaurantes, comedores y cocinas de alto volumen de vajilla.'],
  ['jabon-liquido-manos-1l', 'Jabón líquido de manos 1L', 'jabon-liquido', 'Botella', 'Hogar', 'Para el dispenser del baño o la cocina.', 'Jabón de manos de uso frecuente, textura suave y buen rendimiento por dosis.'],

  ['suavizante-ropa-3l', 'Suavizante para ropa 3L', 'suavizantes', 'Botella', 'Hogar', 'Ropa más suave y con menos estática.', 'Suavizante de uso diario que deja las prendas más blandas y fáciles de planchar.'],
  ['suavizante-ropa-5l', 'Suavizante para ropa 5L', 'suavizantes', 'Bidón', 'Comercial', 'Formato grande para lavado en volumen.', 'El mismo suavizante en bidón de 5 litros, pensado para lavanderías y uso frecuente.'],
  ['suavizante-concentrado-900ml', 'Suavizante concentrado 900ml', 'suavizantes', 'Botella', 'Hogar', 'Menos producto, mismo resultado.', 'Versión concentrada: alcanza con menos cantidad por lavado, rinde más el envase.'],
  ['suavizante-lavanda-3l', 'Suavizante aroma lavanda 3L', 'suavizantes', 'Botella', 'Hogar', 'Aroma a lavanda que dura en la ropa guardada.', 'Suavizante con perfume de lavanda, pensado para que el aroma se note incluso días después de lavar.', 1, 1],
  ['suavizante-aroma-bebe-3l', 'Suavizante aroma bebé 3L', 'suavizantes', 'Botella', 'Hogar', 'Fragancia suave, ideal para ropa de bebé.', 'Formulado con fragancia suave, pensado para la ropa de los más chicos de la casa.'],

  ['lavandina-tradicional-1l', 'Lavandina tradicional 1L', 'lavandina', 'Botella', 'Hogar', 'La lavandina de siempre, para desinfectar y blanquear.', 'Lavandina clásica para superficies, baños y blanqueo de ropa blanca.'],
  ['lavandina-tradicional-5l', 'Lavandina tradicional 5L', 'lavandina', 'Bidón', 'Comercial', 'El formato para limpieza en volumen.', 'Bidón de 5 litros pensado para comercios, consorcios y limpieza a gran escala.', 1, 0],
  ['lavandina-gel-900ml', 'Lavandina en gel 900ml', 'lavandina', 'Botella', 'Hogar', 'Se adhiere a superficies verticales sin escurrir.', 'Textura en gel que se queda donde la aplicás — ideal para inodoros y azulejos.', 0, 1],
  ['lavandina-perfumada-1l', 'Lavandina perfumada 1L', 'lavandina', 'Botella', 'Hogar', 'Desinfecta y deja un aroma a limpio más suave.', 'Misma efectividad de siempre, con una fragancia más agradable que la lavandina tradicional.'],
  ['lavandina-concentrada-2l', 'Lavandina concentrada 2L', 'lavandina', 'Botella', 'Comercial', 'Mayor concentración, rinde más diluida.', 'Fórmula concentrada pensada para diluir según el uso: desinfección liviana o profunda.'],

  ['cloro-granulado-1kg', 'Cloro granulado 1kg', 'cloro', 'Pack', 'Comercial', 'Para desinfección de superficies y espacios grandes.', 'Cloro en granulado, de disolución rápida en agua, para tareas de desinfección más exigentes.'],
  ['cloro-pileta-5kg', 'Cloro para pileta 5kg', 'cloro', 'Bolsón', 'Comercial', 'Mantenimiento de piletas durante la temporada.', 'Cloro granulado formulado para el tratamiento y mantenimiento del agua de pileta.'],
  ['cloro-liquido-concentrado-5l', 'Cloro líquido concentrado 5L', 'cloro', 'Bidón', 'Comercial', 'Alta concentración para uso industrial.', 'Cloro líquido de alta concentración, pensado para desinfección en volumen.', 1, 0],
  ['pastillas-cloro-x10', 'Pastillas de cloro x10', 'cloro', 'Pack', 'Comercial', 'Dosis prácticas, sin medir cada vez.', 'Pastillas de cloro de disolución gradual, cómodas para tanques y depósitos de agua.'],

  ['bolsas-residuos-40x60-x30', 'Bolsas de residuos 40x60 x30', 'bolsas-residuos', 'Pack', 'Hogar', 'El tamaño de siempre para la cocina.', 'Bolsas resistentes de 40x60cm, pack de 30 unidades, para el residuo diario del hogar.'],
  ['bolsas-residuos-60x90-x20', 'Bolsas de residuos 60x90 x20', 'bolsas-residuos', 'Pack', 'Hogar', 'Más capacidad para juntar varios días.', 'Bolsas de 60x90cm, pack de 20 unidades, con mayor capacidad y resistencia.', 1, 0],
  ['bolsas-residuos-80x110-x10', 'Bolsas de residuos 80x110 x10', 'bolsas-residuos', 'Bolsón', 'Comercial', 'Para volumen grande: obras, depósitos, eventos.', 'Bolsas de gran tamaño (80x110cm), pack de 10, pensadas para residuo de obra o comercio.'],
  ['bolsas-residuos-reforzadas-50x70-x25', 'Bolsas de residuos reforzadas 50x70 x25', 'bolsas-residuos', 'Pack', 'Comercial', 'Mayor espesor para residuo con bordes filosos.', 'Bolsas reforzadas de 50x70cm, pack de 25, con mayor resistencia a roturas.'],
  ['bolsas-residuos-biodegradables-40x60-x20', 'Bolsas de residuos biodegradables 40x60 x20', 'bolsas-residuos', 'Pack', 'Hogar', 'Una opción con menor impacto ambiental.', 'Bolsas de 40x60cm elaboradas con material biodegradable, pack de 20 unidades.', 0, 1],

  ['esponja-multiuso-x3', 'Esponja multiuso x3', 'esponjas', 'Pack', 'Hogar', 'La esponja de todos los días, en pack de 3.', 'Esponja doble faz para vajilla y superficies, pack de 3 unidades.', 1, 0],
  ['esponja-doble-faz-x6', 'Esponja doble faz x6', 'esponjas', 'Pack', 'Comercial', 'Pack grande para consumo frecuente.', 'Esponjas doble faz (espuma + fibra), pack de 6, para cocinas con mucho movimiento.'],
  ['esponja-acero-x4', 'Esponja de acero x4', 'esponjas', 'Pack', 'Hogar', 'Para lo que la esponja común no saca.', 'Esponjas de acero para ollas y superficies con restos difíciles de quitar.'],
  ['esponja-antibacterial-x3', 'Esponja antibacterial x3', 'esponjas', 'Pack', 'Comercial', 'Con tratamiento antibacterial incorporado.', 'Esponja multiuso con tratamiento antibacterial, pensada para cocinas comerciales.', 0, 1],
  ['fibra-verde-vajilla-x5', 'Fibra verde para vajilla x5', 'esponjas', 'Pack', 'Hogar', 'La fibra clásica, sola, sin espuma.', 'Fibra verde abrasiva para vajilla y superficies resistentes, pack de 5 unidades.'],

  ['trapo-piso-rejilla', 'Trapo de piso rejilla', 'trapos-piso', 'Unidad', 'Hogar', 'El clásico trapo rejilla de algodón.', 'Trapo de piso tipo rejilla, absorbente y resistente al lavado frecuente.'],
  ['trapo-piso-microfibra-x2', 'Trapo de piso microfibra x2', 'trapos-piso', 'Pack', 'Hogar', 'Atrapa mejor el polvo y seca más rápido.', 'Trapos de microfibra, pack de 2, para pisos que necesitan un lavado más prolijo.'],
  ['repasador-cocina-x3', 'Repasador de cocina x3', 'trapos-piso', 'Pack', 'Hogar', 'Para secar y limpiar mesadas.', 'Repasadores de algodón, pack de 3, para el uso diario en la cocina.'],
  ['trapo-piso-absorbente-x2', 'Trapo de piso absorbente x2', 'trapos-piso', 'Pack', 'Comercial', 'Mayor absorción para limpieza de locales.', 'Trapos de piso de alta absorción, pack de 2, pensados para superficies grandes.'],
  ['pano-rejilla-multiuso-x5', 'Paño rejilla multiuso x5', 'trapos-piso', 'Pack', 'Comercial', 'Para tener siempre uno a mano.', 'Paños tipo rejilla, pack de 5, para limpieza general de superficies y derrames.'],

  ['escoba-cerdas-duras', 'Escoba de cerdas duras', 'escobas-secadores', 'Unidad', 'Hogar', 'Para patios, veredas y superficies rústicas.', 'Escoba de cerdas duras, ideal para barrer exteriores y superficies ásperas.'],
  ['escoba-cerdas-mixtas', 'Escoba de cerdas mixtas', 'escobas-secadores', 'Unidad', 'Hogar', 'Un equilibrio entre suave y resistente.', 'Escoba de cerdas mixtas para uso general dentro y fuera de casa.', 1, 0],
  ['secador-piso-simple', 'Secador de piso simple', 'escobas-secadores', 'Unidad', 'Hogar', 'El secador de goma de toda la vida.', 'Secador de piso con hoja de goma simple, para juntar agua después de trapear.'],
  ['secador-piso-doble-goma', 'Secador de piso doble goma', 'escobas-secadores', 'Unidad', 'Comercial', 'Dos hojas de goma para superficies grandes.', 'Secador con doble hoja de goma, más eficiente en locales y superficies amplias.', 1, 0],
  ['escoba-pala-conjunto', 'Escoba y pala conjunto', 'escobas-secadores', 'Pack', 'Hogar', 'El combo clásico, listo para usar.', 'Escoba y pala a juego, pensadas para guardar juntas y tener siempre a mano.'],
  ['cepillo-lavar', 'Cepillo para lavar', 'escobas-secadores', 'Unidad', 'Hogar', 'Para fregar superficies y prendas duras.', 'Cepillo de cerdas firmes para fregar superficies, calzado o prendas resistentes.'],
];

const PRODUCTOS = PRODUCTOS_RAW.map((row, i) => ({
  id: i + 1,
  slug: row[0], nombre: row[1], categoria: row[2], formato: row[3], uso: row[4],
  descCorta: row[5], descLarga: row[6], destacado: !!row[7], nuevo: !!row[8],
  imagen: IMG_POR_CATEGORIA[row[2]],
}));
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const DESTACADOS = PRODUCTOS.filter(p => p.destacado);

const Cart = {
  KEY: 'neoscent_seleccion',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(id, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else items.push({ id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, qty); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function prodCardHTML(p) {
  return `
    <article class="prod-card" data-id="${p.id}">
      <div class="prod-media" data-open-modal="${p.id}">
        ${p.nuevo ? '<span class="prod-badge">Nuevo</span>' : ''}
        <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
      </div>
      <div class="prod-info">
        <span class="prod-cat">${esc(categoriaNombre(p.categoria))}</span>
        <p class="prod-nombre" data-open-modal="${p.id}">${esc(p.nombre)}</p>
        <span class="prod-meta">${esc(p.formato)} · ${esc(p.uso)}</span>
        <div class="prod-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>`;
}

function initProdCardEvents(container) {
  container.querySelectorAll('[data-stepper]').forEach(stepper => {
    stepper.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = stepper.querySelector('[data-qty]');
        const next = Math.max(1, parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10));
        span.textContent = next;
      });
    });
  });
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.add, 10);
      const card = btn.closest('.prod-card');
      const qty = parseInt(card.querySelector('[data-qty]').textContent, 10) || 1;
      Cart.add(id, qty);
      btn.textContent = 'Agregado ✓';
      btn.classList.add('is-added');
      setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('is-added'); }, 1300);
    });
  });
  container.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', () => openProductModal(parseInt(el.dataset.openModal, 10)));
  });
}

function renderDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS.map(prodCardHTML).join('');
  initProdCardEvents(track);
}

function renderCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <button type="button" class="cat-card" data-cat="${c.id}" data-animate="up" style="transform:translateY(30px);opacity:0">
      <img src="${c.imagen}" width="800" height="800" alt="Categoría ${esc(c.nombre)}" loading="lazy">
      <span>${esc(c.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const select = document.getElementById('filtroCategoria');
      select.value = cat;
      catalogoState.categoria = cat;
      catalogoState.visibles = 16;
      renderCatalogo();
      document.getElementById('catalogo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

function llenarFiltros() {
  const selCat = document.getElementById('filtroCategoria');
  CATEGORIAS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.nombre;
    selCat.appendChild(opt);
  });
  const selFormato = document.getElementById('filtroFormato');
  [...new Set(PRODUCTOS.map(p => p.formato))].forEach(f => {
    const opt = document.createElement('option');
    opt.value = f; opt.textContent = f;
    selFormato.appendChild(opt);
  });
  const selUso = document.getElementById('filtroUso');
  ['Hogar', 'Comercial'].forEach(u => {
    const opt = document.createElement('option');
    opt.value = u; opt.textContent = u;
    selUso.appendChild(opt);
  });
}

const catalogoState = { query: '', categoria: '', formato: '', uso: '', visibles: 16 };

function filtrarProductos() {
  const q = normalizar(catalogoState.query.trim());
  return PRODUCTOS.filter(p => {
    if (catalogoState.categoria && p.categoria !== catalogoState.categoria) return false;
    if (catalogoState.formato && p.formato !== catalogoState.formato) return false;
    if (catalogoState.uso && p.uso !== catalogoState.uso) return false;
    if (q) {
      const haystack = normalizar([p.nombre, categoriaNombre(p.categoria), p.formato, p.uso, p.descCorta, p.descLarga].join(' '));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const count = document.getElementById('resultadosCount');
  const sinResultados = document.getElementById('sinResultados');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiarFiltros');
  const resultados = filtrarProductos();
  const visibles = resultados.slice(0, catalogoState.visibles);

  grid.innerHTML = visibles.map(prodCardHTML).join('');
  initProdCardEvents(grid);
  grid.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));

  count.textContent = resultados.length === PRODUCTOS.length
    ? `${resultados.length} productos`
    : `${resultados.length} resultado${resultados.length === 1 ? '' : 's'}`;
  sinResultados.hidden = resultados.length > 0;
  grid.hidden = resultados.length === 0;
  verMas.hidden = catalogoState.visibles >= resultados.length;
  limpiar.hidden = !(catalogoState.query || catalogoState.categoria || catalogoState.formato || catalogoState.uso);
}

function initCatalogo() {
  llenarFiltros();
  const buscador = document.getElementById('buscador');
  const selCat = document.getElementById('filtroCategoria');
  const selFormato = document.getElementById('filtroFormato');
  const selUso = document.getElementById('filtroUso');
  const limpiar = document.getElementById('limpiarFiltros');
  const sinResultadosLimpiar = document.getElementById('sinResultadosLimpiar');
  const verMas = document.getElementById('verMas');

  let debounceId;
  buscador.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      catalogoState.query = buscador.value; catalogoState.visibles = 16; renderCatalogo();
    }, 180);
  });
  selCat.addEventListener('change', () => { catalogoState.categoria = selCat.value; catalogoState.visibles = 16; renderCatalogo(); });
  selFormato.addEventListener('change', () => { catalogoState.formato = selFormato.value; catalogoState.visibles = 16; renderCatalogo(); });
  selUso.addEventListener('change', () => { catalogoState.uso = selUso.value; catalogoState.visibles = 16; renderCatalogo(); });
  const limpiarTodo = () => {
    catalogoState.query = ''; catalogoState.categoria = ''; catalogoState.formato = ''; catalogoState.uso = ''; catalogoState.visibles = 16;
    buscador.value = ''; selCat.value = ''; selFormato.value = ''; selUso.value = '';
    renderCatalogo();
  };
  limpiar.addEventListener('click', limpiarTodo);
  sinResultadosLimpiar.addEventListener('click', limpiarTodo);
  verMas.addEventListener('click', () => { catalogoState.visibles += 16; renderCatalogo(); });

  renderCatalogo();
}

function openProductModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-media"><img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}"></div>
    <div class="modal-info">
      <span class="prod-cat">${esc(categoriaNombre(p.categoria))}</span>
      <h3>${esc(p.nombre)}</h3>
      <div class="modal-tags"><span>${esc(p.formato)}</span><span>${esc(p.uso)}</span></div>
      <p class="modal-desc">${esc(p.descLarga)}</p>
      <div class="modal-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar a mi selección</button>
      </div>
    </div>`;
  initProdCardEvents(body);
  body.querySelector('[data-add]').addEventListener('click', () => {
    modal.querySelector('.btn-cta').textContent = 'Agregado ✓';
    setTimeout(closeProductModal, 500);
  });
  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}
function closeProductModal() {
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('modalBackdrop');
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}
function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeProductModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('productModal').classList.contains('open')) closeProductModal(); });
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const items = Cart.get();
  const cotizarBtn = document.getElementById('cotizarBtn');
  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
        <p>Todavía no agregaste productos.<br>Recorré el catálogo y sumá lo que necesites.</p>
      </div>`;
    cotizarBtn.setAttribute('aria-disabled', 'true');
    cotizarBtn.href = '#';
    return;
  }
  cotizarBtn.removeAttribute('aria-disabled');
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
      <div class="drawer-item" data-id="${p.id}">
        <img src="${p.imagen}" width="60" height="60" alt="${esc(p.nombre)}">
        <div class="drawer-item-info">
          <p>${esc(p.nombre)}</p>
          <span class="drawer-item-meta">${esc(p.formato)}</span>
          <div class="drawer-item-actions">
            <div class="stepper" data-stepper-cart="${p.id}">
              <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
              <span data-qty>${i.qty}</span>
              <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
            </div>
            <button type="button" class="drawer-remove" data-remove="${p.id}">Quitar</button>
          </div>
        </div>
      </div>`;
  }).join('');

  body.querySelectorAll('[data-stepper-cart]').forEach(stepper => {
    const id = parseInt(stepper.dataset.stepperCart, 10);
    stepper.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = stepper.querySelector('[data-qty]');
        const next = Math.max(1, parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10));
        Cart.setQty(id, next);
      });
    });
  });
  body.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => Cart.remove(parseInt(btn.dataset.remove, 10)));
  });

  const lines = ['Hola Neoscent! Quiero pedir una cotización para:', ''];
  items.forEach(i => {
    const p = getProducto(i.id);
    if (p) lines.push(`${i.qty} x ${p.nombre} (${p.formato})`);
  });
  lines.push('', `Total de productos: ${Cart.count()}`);
  cotizarBtn.href = waHref(lines);
}
document.addEventListener('cart:updated', renderCartDrawer);

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  renderCartDrawer();
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('cartDrawerClose').focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}
function initDrawer() {
  document.getElementById('cart-btn').addEventListener('click', openCartDrawer);
  document.getElementById('cart-float').addEventListener('click', openCartDrawer);
  document.getElementById('cartDrawerClose').addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('cartDrawer').classList.contains('open')) closeCartDrawer(); });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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

function initRail(id) {
  const vp = document.getElementById(id);
  if (!vp) return;
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
    if (!moved) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sigue sin capture */ }
    }
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ORDEN_SHAPES = ['botella', 'botella-ancha', 'bolsa', 'esponja', 'trapo', 'escoba', 'secador', 'botella-chata'];
const ORDEN_OFFSETS = [
  { x: -60, y: -40, r: -25 }, { x: 50, y: -70, r: 18 }, { x: -30, y: 60, r: 30 }, { x: 70, y: 40, r: -20 },
  { x: -80, y: 20, r: 15 }, { x: 40, y: -30, r: -30 }, { x: -50, y: -60, r: 22 }, { x: 60, y: 70, r: -15 },
];
function initOrden() {
  const stage = document.getElementById('ordenStage');
  const visual = document.getElementById('ordenVisual');
  const iconsWrap = document.getElementById('ordenIcons');
  if (!stage || !visual || !iconsWrap) return;
  iconsWrap.innerHTML = ORDEN_SHAPES.map(s => `<div class="orden-icon" data-shape="${s}"><i></i></div>`).join('');
  const icons = [...iconsWrap.children];

  if (reduceMotion) { visual.classList.add('is-ordered'); return; }

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    icons.forEach((icon, i) => {
      const o = ORDEN_OFFSETS[i];
      const k = 1 - progress;
      icon.style.transform = `translate(${o.x * k}px, ${o.y * k}px) rotate(${o.r * k}deg)`;
    });
    visual.classList.toggle('is-ordered', progress > .85);
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

renderDestacados();
renderCategorias();
initCatalogo();
initReveals();
initNav();
initRail('destacadosRail');
initFloats();
initModal();
initDrawer();
initOrden();
initFooterYear();
updateCartBadge();
