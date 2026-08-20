const WHATSAPP_NUMBER = '5492215730804';
const QUOTE_KEY = 'negocioventaproductos_quote';
const PAGE_SIZE = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const wspUrl = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'audio', nombre: 'Audio y Tecnología', imagen: 'images/auriculares-inear-1200x1200.webp' },
  { id: 'indumentaria', nombre: 'Indumentaria', imagen: 'images/remera-percha-1200x1200.webp' },
  { id: 'accesorios', nombre: 'Accesorios', imagen: 'images/mochila-urbana-1200x1200.webp' },
  { id: 'hogar', nombre: 'Hogar y Bazar', imagen: 'images/botella-termica-1200x1200.webp' },
];
const CATEGORIA_NOMBRE = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre]));

const IMAGENES_CATEGORIA = {
  audio: ['images/auriculares-inear-1200x1200.webp', 'images/auriculares-onear-1200x1200.webp'],
  indumentaria: ['images/remera-percha-1200x1200.webp', 'images/remera-lifestyle-1200x1200.webp'],
  accesorios: ['images/mochila-urbana-1200x1200.webp'],
  hogar: ['images/botella-termica-1200x1200.webp'],
};

const BENEFICIOS_CATEGORIA = {
  audio: ['Conexión Bluetooth estable y batería para todo el día', 'Sonido claro, ideal para uso diario', 'Diseño liviano para llevar a todos lados', 'Se empareja fácil con celular o notebook'],
  indumentaria: ['Tela suave que no pierde forma con el lavado', 'Corte cómodo para uso diario, todo el año', 'Costuras reforzadas y terminaciones prolijas', 'Combina fácil con cualquier look'],
  accesorios: ['Materiales resistentes para el uso diario', 'Diseño práctico con compartimentos pensados', 'Ideal para el día a día o para regalar', 'Terminaciones cuidadas que no pasan de moda'],
  hogar: ['Mantiene la temperatura durante horas', 'Fácil de limpiar, pensado para el uso diario', 'Suma orden y practicidad a cualquier ambiente', 'Ideal para tener en casa o llevar de viaje'],
};

const BASE_PRODUCTOS = [
  { categoria: 'audio', nombre: 'Auriculares Bluetooth In-Ear', desc: 'Auriculares inalámbricos compactos con estuche de carga.', tags: ['uso-diario', 'tecnologia'], variantes: ['Negro', 'Blanco', 'Azul', 'Rojo'] },
  { categoria: 'audio', nombre: 'Auriculares Bluetooth Over-Ear', desc: 'Auriculares de diadema con acolchado suave y buena aislación de ruido.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Gris'] },
  { categoria: 'audio', nombre: 'Auriculares Deportivos con Cable', desc: 'Auriculares livianos con gancho para la oreja, pensados para entrenar.', tags: ['viaje-deporte'], variantes: ['Negro', 'Celeste'] },
  { categoria: 'audio', nombre: 'Parlante Bluetooth Portátil Mini', desc: 'Parlante compacto con buena autonomía para escuchar música donde sea.', tags: ['uso-diario', 'viaje-deporte'], variantes: ['Negro', 'Rojo', 'Amarillo'] },
  { categoria: 'audio', nombre: 'Parlante Bluetooth con Luces LED', desc: 'Parlante con juego de luces sincronizadas, ideal para reuniones.', tags: ['regalo'], variantes: ['Negro'] },
  { categoria: 'audio', nombre: 'Cargador Inalámbrico de Mesa', desc: 'Base de carga por inducción compatible con la mayoría de los celulares.', tags: ['tecnologia', 'regalo'], variantes: ['Blanco', 'Negro'] },
  { categoria: 'audio', nombre: 'Power Bank 10.000 mAh', desc: 'Batería portátil para cargar el celular varias veces fuera de casa.', tags: ['tecnologia', 'viaje-deporte'], variantes: ['Negro', 'Blanco'] },
  { categoria: 'audio', nombre: 'Cable USB-C Trenzado 1m', desc: 'Cable reforzado de carga rápida, resistente al uso diario.', tags: ['tecnologia', 'uso-diario'], variantes: ['Negro', 'Blanco', 'Rojo'] },
  { categoria: 'audio', nombre: 'Funda Antigolpe Universal', desc: 'Funda de silicona con refuerzo en las esquinas para proteger el celular.', tags: ['uso-diario'], variantes: ['Negro', 'Transparente', 'Rosa'] },
  { categoria: 'audio', nombre: 'Soporte de Celular para Auto', desc: 'Soporte magnético para el aire acondicionado del auto.', tags: ['viaje-deporte'], variantes: ['Negro'] },
  { categoria: 'audio', nombre: 'Mouse Inalámbrico Compacto', desc: 'Mouse silencioso con receptor USB, ideal para notebook.', tags: ['tecnologia', 'uso-diario'], variantes: ['Negro', 'Blanco'] },
  { categoria: 'audio', nombre: 'Teclado Bluetooth Compacto', desc: 'Teclado slim inalámbrico, se guarda en cualquier mochila.', tags: ['tecnologia'], variantes: ['Negro'] },

  { categoria: 'indumentaria', nombre: 'Remera Básica de Algodón', desc: '100% algodón, corte clásico que no pierde forma.', tags: ['uso-diario'], variantes: ['Blanco', 'Negro', 'Gris', 'Azul Marino', 'Bordo'] },
  { categoria: 'indumentaria', nombre: 'Remera Oversize Estampada', desc: 'Corte oversize con estampa al frente, tela con buena caída.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Blanco'] },
  { categoria: 'indumentaria', nombre: 'Remera Deportiva Dry-Fit', desc: 'Tela técnica que seca rápido, pensada para entrenar.', tags: ['viaje-deporte'], variantes: ['Negro', 'Gris', 'Celeste'] },
  { categoria: 'indumentaria', nombre: 'Buzo Canguro Frisa', desc: 'Buzo con capucha y bolsillo canguro, interior afelpado.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Gris Melange', 'Bordo'] },
  { categoria: 'indumentaria', nombre: 'Buzo con Cierre', desc: 'Buzo entero con cierre y cuello alto, ideal para las primeras frías.', tags: ['uso-diario'], variantes: ['Negro', 'Azul Marino'] },
  { categoria: 'indumentaria', nombre: 'Campera Rompeviento', desc: 'Campera liviana e impermeable, se guarda en su propio bolsillo.', tags: ['viaje-deporte'], variantes: ['Negro', 'Azul'] },
  { categoria: 'indumentaria', nombre: 'Gorra Visera Curva', desc: 'Gorra ajustable de seis paneles, visera curva clásica.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Blanco', 'Azul'] },
  { categoria: 'indumentaria', nombre: 'Gorra Trucker', desc: 'Gorra con panel frontal y malla trasera, ajuste con broche.', tags: ['uso-diario'], variantes: ['Negro', 'Beige'] },
  { categoria: 'indumentaria', nombre: 'Medias Deportivas Pack x3', desc: 'Pack de tres pares con planta reforzada.', tags: ['viaje-deporte', 'uso-diario'], variantes: ['Blanco', 'Negro'] },
  { categoria: 'indumentaria', nombre: 'Short Deportivo', desc: 'Short liviano con bolsillos laterales, ideal para entrenar.', tags: ['viaje-deporte'], variantes: ['Negro', 'Gris'] },

  { categoria: 'accesorios', nombre: 'Mochila Urbana Impermeable', desc: 'Mochila de uso diario con compartimento acolchado para notebook.', tags: ['uso-diario', 'viaje-deporte'], variantes: ['Negro', 'Gris', 'Azul'] },
  { categoria: 'accesorios', nombre: 'Mochila Porta Notebook', desc: 'Mochila slim pensada para ir a estudiar o trabajar.', tags: ['uso-diario'], variantes: ['Negro'] },
  { categoria: 'accesorios', nombre: 'Riñonera Deportiva', desc: 'Riñonera liviana con cierre doble, ideal para salir a entrenar.', tags: ['viaje-deporte'], variantes: ['Negro', 'Gris'] },
  { categoria: 'accesorios', nombre: 'Billetera de Cuero Ecológico', desc: 'Billetera con varios compartimentos para tarjetas.', tags: ['regalo', 'uso-diario'], variantes: ['Negro', 'Marrón'] },
  { categoria: 'accesorios', nombre: 'Lentes de Sol Polarizados', desc: 'Lentes con protección UV y armazón liviano.', tags: ['regalo', 'viaje-deporte'], variantes: ['Negro', 'Carey', 'Azul Espejado'] },
  { categoria: 'accesorios', nombre: 'Reloj Digital Deportivo', desc: 'Reloj resistente al agua con cronómetro y alarma.', tags: ['viaje-deporte', 'regalo'], variantes: ['Negro', 'Verde Militar'] },
  { categoria: 'accesorios', nombre: 'Reloj Analógico Minimalista', desc: 'Reloj de diseño simple, fácil de combinar con cualquier look.', tags: ['regalo', 'uso-diario'], variantes: ['Malla Cuero Marrón', 'Malla Plateada'] },
  { categoria: 'accesorios', nombre: 'Cinturón de Cuero Reversible', desc: 'Cinturón con hebilla reversible, dos colores en uno.', tags: ['uso-diario', 'regalo'], variantes: ['Negro/Marrón'] },
  { categoria: 'accesorios', nombre: 'Llavero Multiuso', desc: 'Llavero con mosquetón y destapador integrado.', tags: ['regalo'], variantes: ['Negro', 'Plateado'] },
  { categoria: 'accesorios', nombre: 'Paraguas Automático Antiviento', desc: 'Paraguas de apertura automática con varillas reforzadas.', tags: ['uso-diario'], variantes: ['Negro', 'Azul'] },
  { categoria: 'accesorios', nombre: 'Gafas de Sol Deportivas', desc: 'Gafas livianas con banda antideslizante, ideales para correr.', tags: ['viaje-deporte'], variantes: ['Negro Mate'] },
  { categoria: 'accesorios', nombre: 'Cartera Cruzada Chica', desc: 'Cartera compacta con correa ajustable, para lo esencial.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Beige'] },
  { categoria: 'accesorios', nombre: 'Portadocumentos', desc: 'Organizador para documentos y tarjetas, tamaño de bolsillo.', tags: ['viaje-deporte'], variantes: ['Negro'] },

  { categoria: 'hogar', nombre: 'Termo Acero Inoxidable 1L', desc: 'Termo de doble pared que mantiene la temperatura por horas.', tags: ['uso-diario', 'viaje-deporte'], variantes: ['Negro', 'Blanco', 'Verde'] },
  { categoria: 'hogar', nombre: 'Mate Térmico de Acero', desc: 'Mate de acero inoxidable con doble pared, no quema al tacto.', tags: ['uso-diario', 'regalo'], variantes: ['Negro', 'Acero'] },
  { categoria: 'hogar', nombre: 'Bombilla de Acero Inoxidable', desc: 'Bombilla con filtro, fácil de limpiar.', tags: ['uso-diario'], variantes: ['Acero'] },
  { categoria: 'hogar', nombre: 'Set de Vasos Térmicos x2', desc: 'Juego de dos vasos con tapa hermética.', tags: ['regalo'], variantes: ['Acero'] },
  { categoria: 'hogar', nombre: 'Organizador de Escritorio', desc: 'Organizador con divisiones para útiles y accesorios.', tags: ['uso-diario'], variantes: ['Negro'] },
  { categoria: 'hogar', nombre: 'Cesto Organizador Plegable', desc: 'Cesto de tela reforzada, se pliega cuando no se usa.', tags: ['uso-diario'], variantes: ['Gris', 'Beige'] },
  { categoria: 'hogar', nombre: 'Tira LED USB 5m', desc: 'Tira de luces con control remoto, se alimenta por USB.', tags: ['uso-diario', 'regalo'], variantes: ['Multicolor'] },
  { categoria: 'hogar', nombre: 'Lámpara LED de Escritorio', desc: 'Lámpara recargable con tres niveles de intensidad.', tags: ['uso-diario', 'regalo'], variantes: ['Blanco', 'Negro'] },
  { categoria: 'hogar', nombre: 'Portavasos de Silicona x4', desc: 'Set de posavasos antideslizantes, fáciles de lavar.', tags: ['uso-diario'], variantes: ['Negro'] },
  { categoria: 'hogar', nombre: 'Cargador Solar Portátil', desc: 'Panel solar plegable para cargar dispositivos al aire libre.', tags: ['viaje-deporte', 'tecnologia'], variantes: ['Negro'] },
  { categoria: 'hogar', nombre: 'Botella Deportiva con Filtro', desc: 'Botella liviana con filtro de carbón activado incorporado.', tags: ['viaje-deporte'], variantes: ['Celeste', 'Rosa'] },
  { categoria: 'hogar', nombre: 'Manta Polar 1 Plaza', desc: 'Manta suave de microfibra, ideal para el sillón.', tags: ['uso-diario', 'regalo'], variantes: ['Gris', 'Beige'] },
  { categoria: 'hogar', nombre: 'Almohadón Decorativo', desc: 'Almohadón con funda desmontable y relleno mullido.', tags: ['regalo'], variantes: ['Gris', 'Mostaza', 'Terracota'] },
  { categoria: 'hogar', nombre: 'Set de Ganchos Adhesivos x6', desc: 'Ganchos resistentes que no dañan la pared.', tags: ['uso-diario'], variantes: ['Blanco'] },
  { categoria: 'hogar', nombre: 'Difusor de Aromas USB', desc: 'Difusor compacto con luz LED suave.', tags: ['regalo', 'uso-diario'], variantes: ['Blanco'] },
];

function construirProductos() {
  const contador = {};
  const productos = [];
  let globalIndex = 0;
  BASE_PRODUCTOS.forEach(base => {
    base.variantes.forEach((variante, vi) => {
      contador[base.categoria] = (contador[base.categoria] || 0) + 1;
      const n = contador[base.categoria];
      const id = `${base.categoria}-${n}`;
      const imagenes = IMAGENES_CATEGORIA[base.categoria];
      const imagen = imagenes[globalIndex % imagenes.length];
      const beneficios = BENEFICIOS_CATEGORIA[base.categoria].slice();
      const nombreCompleto = base.variantes.length > 1 ? `${base.nombre} — ${variante}` : base.nombre;
      const colorClauseCorta = base.variantes.length > 1 ? ` Color ${variante.toLowerCase()}.` : '';
      productos.push({
        id,
        categoria: base.categoria,
        categoriaNombre: CATEGORIA_NOMBRE[base.categoria],
        nombre: nombreCompleto,
        descCorta: `${base.desc} ${BENEFICIOS_CATEGORIA[base.categoria][vi % beneficios.length]}.${colorClauseCorta}`,
        descLarga: `${base.desc} ${base.variantes.length > 1 ? `Esta variante viene en color ${variante.toLowerCase()}. ` : ''}Pensado para uso diario, con materiales elegidos para que dure.`,
        beneficios,
        variante,
        tags: base.tags,
        imagen,
        disponible: globalIndex % 19 !== 5,
        nuevo: globalIndex % 9 === 3,
        destacado: false,
      });
      globalIndex++;
    });
  });
  return productos;
}

const PRODUCTOS = construirProductos();

const DESTACADOS_IDS = ['audio-1', 'audio-4', 'indumentaria-1', 'indumentaria-4', 'accesorios-1', 'accesorios-5', 'hogar-1', 'hogar-11'];
DESTACADOS_IDS.forEach(id => { const p = PRODUCTOS.find(x => x.id === id); if (p) { p.destacado = true; p.disponible = true; } });

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const mensajeProducto = p => `Hola NegocioVentaProductos, quiero consultar por ${p.nombre}.`;

const Quote = {
  get() { try { return JSON.parse(localStorage.getItem(QUOTE_KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(QUOTE_KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('quote:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty += qty;
    else items.push({ id: producto.id, qty });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, qty); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
};

function buildQuoteMessage() {
  const items = Quote.get();
  const lines = ['Hola NegocioVentaProductos, quiero pedir cotización por:', ''];
  items.forEach(i => { const p = getProducto(i.id); if (p) lines.push(`${i.qty}x ${p.nombre}`); });
  lines.push('', '¿Me confirmás disponibilidad?');
  return lines.join('\n');
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 2600);
}

function updateQuoteBadge() {
  const n = Quote.count();
  document.querySelectorAll('[data-quote-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('quote:updated', updateQuoteBadge);
document.addEventListener('quote:updated', () => { if (document.getElementById('quoteDrawer')?.classList.contains('open')) renderDrawer(); });

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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const quote = document.getElementById('quote-float');
  const sync = () => {
    const scrolled = window.scrollY > 500;
    wsp?.classList.toggle('visible', scrolled);
    quote?.classList.toggle('visible', scrolled || Quote.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('quote:updated', sync);
  quote?.addEventListener('click', openDrawer);
  sync();
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const items = ['Más de 100 productos', 'Audio y Tecnología', 'Indumentaria', 'Accesorios', 'Hogar y Bazar', 'Consultá por WhatsApp'];
  const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>';
  const html = items.map(t => `<span class="marquee-item">${star}${esc(t)}</span>`).join('');
  track.innerHTML = html + html;
}

function initShelf() {
  const tiles = document.querySelectorAll('.shelf-tile');
  if (!tiles.length) return;
  const pool = [
    'images/auriculares-inear-1200x1200.webp', 'images/auriculares-onear-1200x1200.webp',
    'images/remera-percha-1200x1200.webp', 'images/remera-lifestyle-1200x1200.webp',
    'images/mochila-urbana-1200x1200.webp', 'images/botella-termica-1200x1200.webp',
  ];
  const finales = [pool[0], pool[2], pool[4]];

  if (reduceMotion) {
    tiles.forEach((tile, i) => { const img = tile.querySelector('img'); img.src = finales[i]; img.classList.add('is-shown'); });
    return;
  }

  tiles.forEach((tile, i) => {
    const img = tile.querySelector('img');
    const settleAt = 950 + i * 330;
    let elapsed = 0;
    img.src = pool[i];
    requestAnimationFrame(() => img.classList.add('is-shown'));

    const shuffleTick = () => {
      elapsed += 210;
      if (elapsed >= settleAt) {
        img.classList.remove('is-shown');
        setTimeout(() => {
          img.src = finales[i];
          img.classList.add('is-shown');
          tile.classList.add('is-settled');
          setTimeout(() => tile.classList.remove('is-settled'), 500);
        }, 150);
        return;
      }
      img.classList.remove('is-shown');
      setTimeout(() => { img.src = pool[Math.floor(Math.random() * pool.length)]; img.classList.add('is-shown'); }, 150);
      setTimeout(shuffleTick, 210);
    };
    setTimeout(shuffleTick, 210);
  });
}

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <a class="cat-card" href="#catalogo" data-cat-link="${c.id}" data-animate style="opacity:0;transform:translateY(28px)">
      <img src="${c.imagen}" width="900" height="1200" alt="${esc(c.nombre)}" loading="lazy">
      <div class="cat-card-body">
        <span class="k">Ver categoría</span>
        <h3>${esc(c.nombre)}</h3>
      </div>
    </a>
  `).join('');
  grid.addEventListener('click', e => {
    const link = e.target.closest('[data-cat-link]');
    if (!link) return;
    setCategoriaFilter(link.dataset.catLink);
  });
}

function cardTemplate(p) {
  const badge = !p.disponible ? '<span class="badge badge--out">Sin stock</span>' : (p.nuevo ? '<span class="badge badge--new">Nuevo</span>' : '');
  return `
  <article class="product-card" data-animate style="opacity:0;transform:translateY(28px)" data-id="${p.id}" data-qty="1">
    <div class="product-media">
      ${badge}
      <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
    </div>
    <div class="product-body">
      <span class="product-cat">${esc(p.categoriaNombre)}</span>
      <h3>${esc(p.nombre)}</h3>
      <div class="product-actions">
        <div class="qty-stepper">
          <button type="button" data-qty-minus aria-label="Restar cantidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>
          </button>
          <span class="qty-val" data-qty-val>1</span>
          <button type="button" data-qty-plus aria-label="Sumar cantidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <button type="button" class="btn btn--icon-only btn--ghost" data-open-modal="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button type="button" class="btn btn--cta" data-add-quote ${p.disponible ? '' : 'disabled'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          <span>Agregar</span>
        </button>
      </div>
    </div>
  </article>`;
}

function bindCardQty(container) {
  container.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    const p = getProducto(id);
    if (!p) return;

    if (e.target.closest('[data-qty-plus]')) {
      const n = Math.min(99, parseInt(card.dataset.qty, 10) + 1);
      card.dataset.qty = n; card.querySelector('[data-qty-val]').textContent = n;
    } else if (e.target.closest('[data-qty-minus]')) {
      const n = Math.max(1, parseInt(card.dataset.qty, 10) - 1);
      card.dataset.qty = n; card.querySelector('[data-qty-val]').textContent = n;
    } else if (e.target.closest('[data-add-quote]')) {
      const qty = parseInt(card.dataset.qty, 10) || 1;
      Quote.add(p, qty);
      showToast(`Agregado: ${p.nombre}`);
      card.dataset.qty = 1; card.querySelector('[data-qty-val]').textContent = 1;
    } else if (e.target.closest('[data-open-modal]')) {
      window.openModal(id);
    }
  });
}

const catalogState = { search: '', categoria: 'todo', visible: PAGE_SIZE };

function filtrarProductos() {
  const q = normalizar(catalogState.search);
  return PRODUCTOS.filter(p => {
    if (catalogState.categoria !== 'todo' && p.categoria !== catalogState.categoria) return false;
    if (!q) return true;
    const hay = normalizar(`${p.nombre} ${p.categoriaNombre} ${p.tags.join(' ')}`);
    return hay.includes(q);
  });
}

function syncFilterChips() {
  document.querySelectorAll('[data-filter-cat]').forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.filterCat === catalogState.categoria);
  });
}

function setCategoriaFilter(cat) {
  catalogState.categoria = cat;
  catalogState.visible = PAGE_SIZE;
  syncFilterChips();
  renderCatalog();
  document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });
}

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const items = cont.querySelectorAll('[data-animate]:not(.in)');
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const moreBtn = document.getElementById('catalogMore');
  const countEl = document.getElementById('resultsCount');
  const emptyEl = document.getElementById('emptyState');
  if (!grid) return;

  const filtered = filtrarProductos();
  const slice = filtered.slice(0, catalogState.visible);
  grid.innerHTML = slice.map(cardTemplate).join('');

  countEl.textContent = filtered.length
    ? `Mostrando ${slice.length} de ${filtered.length} productos`
    : '';
  moreBtn.hidden = catalogState.visible >= filtered.length;
  emptyEl.classList.toggle('is-visible', filtered.length === 0);
  grid.hidden = filtered.length === 0;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initCatalogo() {
  const grid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('searchInput');
  const moreBtn = document.getElementById('catalogMore');
  const clearBtn = document.getElementById('clearFilters');
  if (!grid) return;

  bindCardQty(grid);

  searchInput.addEventListener('input', () => {
    catalogState.search = searchInput.value;
    catalogState.visible = PAGE_SIZE;
    renderCatalog();
  });

  document.querySelectorAll('[data-filter-cat]').forEach(chip => {
    chip.addEventListener('click', () => setCategoriaFilter(chip.dataset.filterCat));
  });

  moreBtn.addEventListener('click', () => {
    catalogState.visible += PAGE_SIZE;
    renderCatalog();
  });

  clearBtn.addEventListener('click', () => {
    catalogState.search = ''; catalogState.categoria = 'todo'; catalogState.visible = PAGE_SIZE;
    searchInput.value = '';
    syncFilterChips();
    renderCatalog();
  });

  syncFilterChips();
  renderCatalog();
}

function initRail() {
  const track = document.getElementById('railTrack');
  const viewport = document.getElementById('railViewport');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!track || !viewport) return;

  const items = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = items.map(cardTemplate).join('');
  bindCardQty(track);

  let isDown = false, moved = false, justDragged = false, startX = 0, startScroll = 0, pointerId = null;

  viewport.addEventListener('pointerdown', e => {
    isDown = true; moved = false; startX = e.clientX; startScroll = viewport.scrollLeft; pointerId = e.pointerId;
  });
  viewport.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      viewport.classList.add('dragging');
      try { viewport.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) viewport.scrollLeft = startScroll - dx;
  });
  const endDrag = () => {
    isDown = false;
    if (moved) {
      try { viewport.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      justDragged = true;
      setTimeout(() => viewport.classList.remove('dragging'), 50);
    }
    moved = false;
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointerleave', endDrag);
  viewport.addEventListener('click', e => {
    if (justDragged) { e.preventDefault(); e.stopPropagation(); justDragged = false; }
  }, true);

  const syncArrows = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = viewport.scrollLeft <= inicio + 2;
    next.disabled = viewport.scrollLeft >= (viewport.scrollWidth - viewport.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => viewport.scrollBy({ left: -320, behavior: 'smooth' }));
  next?.addEventListener('click', () => viewport.scrollBy({ left: 320, behavior: 'smooth' }));
  viewport.addEventListener('scroll', syncArrows, { passive: true });
  viewport.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const atStart = viewport.scrollLeft <= 0;
    const atEnd = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    viewport.scrollLeft += e.deltaY;
  }, { passive: false });
  syncArrows();
}

const QUIZ_OCASIONES = {
  diario: { label: 'Uso diario', tag: 'uso-diario', razon: 'Pensado para el uso de todos los días.' },
  regalo: { label: 'Para regalar', tag: 'regalo', razon: 'Una opción segura para regalar.' },
  viaje: { label: 'Viajar o hacer deporte', tag: 'viaje-deporte', razon: 'Resistente y práctico para llevar a cualquier lado.' },
};

function initQuiz() {
  const root = document.getElementById('quiz');
  if (!root) return;
  const steps = root.querySelectorAll('.quiz-step');
  const resultGrid = document.getElementById('quizResultGrid');
  const resultTitle = document.getElementById('quizResultTitle');
  let categoriaElegida = null;

  const goStep = id => steps.forEach(s => s.classList.toggle('is-active', s.dataset.quizStep === id));

  root.querySelectorAll('[data-quiz-cat]').forEach(btn => {
    btn.addEventListener('click', () => { categoriaElegida = btn.dataset.quizCat; goStep('ocasion'); });
  });

  root.querySelectorAll('[data-quiz-ocasion]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ocasion = QUIZ_OCASIONES[btn.dataset.quizOcasion];
      let pool = PRODUCTOS.filter(p => p.categoria === categoriaElegida && p.disponible);
      let matched = pool.filter(p => p.tags.includes(ocasion.tag));
      const finalPool = matched.length >= 3 ? matched : pool;
      const picks = finalPool.slice(0, 3);

      resultTitle.textContent = `En ${esc(CATEGORIA_NOMBRE[categoriaElegida])}, esto es para vos`;
      resultGrid.innerHTML = picks.map(p => `
        <div class="quiz-card" data-id="${p.id}">
          <div class="quiz-card-media"><img src="${p.imagen}" width="400" height="400" alt="${esc(p.nombre)}" loading="lazy"></div>
          <div class="quiz-card-body">
            <h4>${esc(p.nombre)}</h4>
            <p class="quiz-card-why">${esc(ocasion.razon)}</p>
          </div>
        </div>
      `).join('');
      resultGrid.querySelectorAll('.quiz-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('is-in'), reduceMotion ? 0 : i * 120);
      });
      goStep('resultado');
    });
  });

  root.querySelectorAll('[data-quiz-skip]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ block: 'start' }); });
  });
  document.getElementById('quizSeeAll')?.addEventListener('click', () => setCategoriaFilter(categoriaElegida || 'todo'));
  document.getElementById('quizRestart')?.addEventListener('click', () => { categoriaElegida = null; goStep('categoria'); });
}

function initModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const cardEl = document.getElementById('modalCard');
  const imgEl = document.getElementById('modalImg');
  const catEl = document.getElementById('modalCat');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const benefEl = document.getElementById('modalBenefits');
  const addBtn = document.getElementById('modalAdd');
  const wspBtn = document.getElementById('modalWsp');
  const closeBtn = document.getElementById('modalClose');
  const qtyVal = document.getElementById('modalQtyVal');
  if (!backdrop) return;
  let lastFocused = null;
  let currentId = null;
  let qty = 1;

  function onKeydown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(cardEl.querySelectorAll('a,button')).filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  window.openModal = id => {
    const p = getProducto(id);
    if (!p) return;
    currentId = id; qty = 1; qtyVal.textContent = 1;
    lastFocused = document.activeElement;
    catEl.textContent = p.categoriaNombre;
    titleEl.textContent = p.nombre;
    descEl.textContent = p.descLarga;
    benefEl.innerHTML = p.beneficios.map(b => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(b)}</span></li>`).join('');
    imgEl.src = p.imagen;
    imgEl.alt = p.nombre;
    addBtn.disabled = !p.disponible;
    addBtn.querySelector('span').textContent = p.disponible ? 'Agregar a mi pedido' : 'Sin stock';
    wspBtn.href = wspUrl(mensajeProducto(p));
    document.body.classList.add('modal-open', 'no-scroll');
    window.lenis?.stop();
    backdrop.classList.add('open');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  };

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.classList.remove('modal-open', 'no-scroll');
    window.lenis?.start();
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  }

  document.getElementById('modalQtyPlus').addEventListener('click', () => { qty = Math.min(99, qty + 1); qtyVal.textContent = qty; });
  document.getElementById('modalQtyMinus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyVal.textContent = qty; });
  addBtn.addEventListener('click', () => {
    const p = getProducto(currentId);
    if (!p) return;
    Quote.add(p, qty);
    showToast(`Agregado: ${p.nombre}`);
  });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
}

function quoteLineTemplate(p, qty) {
  return `
  <div class="quote-line" data-id="${p.id}">
    <img src="${p.imagen}" width="54" height="54" alt="${esc(p.nombre)}">
    <div class="quote-line-body">
      <div class="name">${esc(p.nombre)}</div>
      <div class="cat">${esc(p.categoriaNombre)}</div>
    </div>
    <div class="qty-stepper">
      <button type="button" data-line-minus aria-label="Restar cantidad">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>
      </button>
      <span class="qty-val">${qty}</span>
      <button type="button" data-line-plus aria-label="Sumar cantidad">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <button type="button" class="quote-line-remove" data-line-remove aria-label="Quitar ${esc(p.nombre)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
  </div>`;
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const wspBtn = document.getElementById('drawerWsp');
  const clearBtn = document.getElementById('drawerClear');
  if (!body) return;
  const items = Quote.get();

  if (!items.length) {
    body.innerHTML = `<div class="drawer-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
      <p>Todavía no agregaste productos.<br>Elegí lo que te interese en el catálogo.</p>
    </div>`;
    wspBtn.setAttribute('aria-disabled', 'true');
    wspBtn.style.pointerEvents = 'none'; wspBtn.style.opacity = '.5';
    clearBtn.hidden = true;
    return;
  }

  body.innerHTML = items.map(i => { const p = getProducto(i.id); return p ? quoteLineTemplate(p, i.qty) : ''; }).join('');
  wspBtn.removeAttribute('aria-disabled');
  wspBtn.style.pointerEvents = ''; wspBtn.style.opacity = '';
  wspBtn.href = wspUrl(buildQuoteMessage());
  clearBtn.hidden = false;
}

function openDrawer() {
  renderDrawer();
  document.getElementById('quoteDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
  document.body.classList.add('drawer-open', 'no-scroll');
  window.lenis?.stop();
  document.getElementById('drawerClose')?.focus();
}
function closeDrawer() {
  document.getElementById('quoteDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  document.body.classList.remove('drawer-open', 'no-scroll');
  window.lenis?.start();
}

function initDrawer() {
  const drawer = document.getElementById('quoteDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const clearBtn = document.getElementById('drawerClear');
  const body = document.getElementById('drawerBody');
  if (!drawer) return;

  document.querySelectorAll('[data-open-drawer]').forEach(btn => btn.addEventListener('click', openDrawer));
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });

  clearBtn.addEventListener('click', () => Quote.clear());

  body.addEventListener('click', e => {
    const line = e.target.closest('.quote-line');
    if (!line) return;
    const id = line.dataset.id;
    if (e.target.closest('[data-line-plus]')) Quote.setQty(id, (Quote.get().find(i => i.id === id)?.qty || 1) + 1);
    else if (e.target.closest('[data-line-minus]')) {
      const current = Quote.get().find(i => i.id === id)?.qty || 1;
      if (current <= 1) Quote.remove(id); else Quote.setQty(id, current - 1);
    } else if (e.target.closest('[data-line-remove]')) Quote.remove(id);
  });

  renderDrawer();
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

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initNav();
  initFloats();
  initMarquee();
  initShelf();
  initCategorias();
  initQuiz();
  initRail();
  initCatalogo();
  initModal();
  initDrawer();
  updateQuoteBadge();
  initReveals();
});
