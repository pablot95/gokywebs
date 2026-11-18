const CATEGORIAS = [
  { id: 'bandoleras', nombre: 'Bandoleras' },
  { id: 'hombro', nombre: 'Al hombro' },
  { id: 'mano', nombre: 'De mano' },
  { id: 'totes', nombre: 'Totes' },
];
const PRODUCTOS = [
  { id: 's01', slug: 'alma-rosa', nombre: 'Alma rosa', categoria: 'hombro', color: 'Rosa', precio: 38500, descuento: 0, stock: 8, imagen: 'cartera-01.webp', descripcion: 'Una silueta suave en rosa nude, con solapa curva y un pequeño acento dorado. Para llevar al hombro y sumar un tono delicado a tu día.', tags: ['nude', 'solapa', 'diario'] },
  { id: 's02', slug: 'olivia-suela', nombre: 'Olivia suela', categoria: 'totes', color: 'Suela', precio: 62000, descuento: 0, stock: 6, imagen: 'cartera-02.webp', descripcion: 'Formato tote, líneas simples y asas largas. Una propuesta amplia en tono suela para cuando querés llevar un poco más.', tags: ['amplia', 'asas', 'tote'] },
  { id: 's03', slug: 'clara-topo', nombre: 'Clara topo', categoria: 'bandoleras', color: 'Topo', precio: 42000, descuento: 0, stock: 7, imagen: 'cartera-03.webp', descripcion: 'Bandolera de líneas redondeadas con correa y hebilla dorada. El tono topo acompaña tanto colores claros como oscuros.', tags: ['cruzada', 'hebilla', 'neutro'] },
  { id: 's04', slug: 'ines-marfil', nombre: 'Inés marfil', categoria: 'mano', color: 'Marfil', precio: 48500, descuento: 0, stock: 5, imagen: 'cartera-04.webp', descripcion: 'Textura matelassé, cadena dorada y color marfil. Un formato compacto para sumar un detalle especial a una salida.', tags: ['cadena', 'matelasse', 'noche'] },
  { id: 's05', slug: 'vera-chocolate', nombre: 'Vera chocolate', categoria: 'mano', color: 'Chocolate', precio: 56000, descuento: 0, stock: 4, imagen: 'cartera-05.webp', descripcion: 'Cartera estructurada con asa superior y solapa. La silueta clásica se encuentra con un chocolate profundo y herrajes de tono dorado.', tags: ['estructurada', 'asa', 'clasica'] },
  { id: 's06', slug: 'nina-negro', nombre: 'Nina negro', categoria: 'mano', color: 'Negro', precio: 28500, descuento: 0, stock: 0, imagen: 'cartera-06.webp', descripcion: 'Sobre negro de perfil limpio y cierre discreto. Una opción pequeña para llevar en la mano cuando el plan pide solo lo esencial.', tags: ['sobre', 'clutch', 'noche'] },
  { id: 's07', slug: 'mila-rosa', nombre: 'Mila rosa', categoria: 'hombro', color: 'Rosa', precio: 44500, descuento: 0, stock: 9, imagen: 'cartera-07.webp', descripcion: 'Formato bucket con cierre fruncido y un rosa cálido. Su contorno relajado le da un aire distinto a los looks de todos los días.', tags: ['bucket', 'bolsa', 'fruncida'] },
  { id: 's08', slug: 'luna-arena', nombre: 'Luna arena', categoria: 'hombro', color: 'Arena', precio: 46000, descuento: 0, stock: 6, imagen: 'cartera-08.webp', descripcion: 'Curvas suaves y formato hobo en tono arena. Una cartera de hombro con una silueta relajada y un color fácil de combinar.', tags: ['hobo', 'beige', 'curva'] },
  { id: 's09', slug: 'amelia-suela', nombre: 'Amelia suela', categoria: 'bandoleras', color: 'Suela', precio: 39500, descuento: 0, stock: 7, imagen: 'cartera-09.webp', descripcion: 'Pequeña bandolera con asa superior y solapa redondeada. El tono suela y la correa larga permiten llevarla a tu manera.', tags: ['mini', 'asa', 'cruzada'] },
];
const WHATSAPP_NUMBER = '5491166308021';
const normalizar = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const COLORES = [...new Set(PRODUCTOS.map(p => p.color))];
function validarFiltros(raw = {}) {
  return {
    cat: CATEGORIAS.some(c => c.id === raw.cat) ? raw.cat : '',
    color: COLORES.includes(raw.color) ? raw.color : '',
    q: typeof raw.q === 'string' ? raw.q.slice(0, 150) : '',
    precio: ['hasta40', 'mas40'].includes(raw.precio) ? raw.precio : '',
    orden: ['menor', 'mayor', 'nombre'].includes(raw.orden) ? raw.orden : 'seleccion',
    disponible: raw.disponible === '1' || raw.disponible === true,
  };
}
function filtrarProductos(raw, products = PRODUCTOS) {
  const f = validarFiltros(raw);
  const words = normalizar(f.q).split(/\s+/).filter(Boolean);
  const result = products.filter(p => {
    const text = normalizar([p.nombre, 'SOELI', p.categoria, p.color, p.descripcion, ...(p.tags || [])].join(' '));
    return (!f.cat || p.categoria === f.cat) && (!f.color || p.color === f.color) && (!f.disponible || p.stock > 0) && (!f.precio || (f.precio === 'hasta40' ? precioFinal(p) <= 40000 : precioFinal(p) > 40000)) && words.every(w => text.includes(w));
  });
  if (f.orden === 'menor') result.sort((a,b) => precioFinal(a)-precioFinal(b));
  if (f.orden === 'mayor') result.sort((a,b) => precioFinal(b)-precioFinal(a));
  if (f.orden === 'nombre') result.sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
  return result;
}
function paginar(products, limit = 16) { return products.slice(0, Math.max(16, Math.floor(limit / 16) * 16)); }
function sanearCarrito(raw) {
  if (!Array.isArray(raw)) return [];
  const clean = [];
  raw.forEach(item => {
    const p = PRODUCTOS.find(x => x.id === item?.id);
    if (!p || !p.stock || typeof item?.qty !== 'number' || !Number.isFinite(item.qty) || item.qty <= 0) return;
    const qty = Math.min(Math.floor(item.qty), p.stock);
    if (qty < 1) return;
    const prev = clean.find(x => x.id === p.id);
    if (prev) prev.qty = Math.min(prev.qty + qty, p.stock);
    else clean.push({id: p.id, qty});
  });
  return clean;
}
function prepararCarrito() {
  try { localStorage.setItem(Cart.KEY, JSON.stringify(sanearCarrito(JSON.parse(localStorage.getItem(Cart.KEY) || '[]')))); }
  catch { try { localStorage.setItem(Cart.KEY, '[]'); } catch { return; } }
}
let reduceMotion = false;
let revealsListos = false;
let catalogURL = 'catalogo.html';
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
function refrescarScroll() { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
function initSchema() {
  const faq = [...document.querySelectorAll('.faq details')];
  if (!faq.length && document.body.dataset.pagina !== 'catalogo') return;
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  if (faq.length) schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(el=>({'@type':'Question',name:el.querySelector('summary').textContent,acceptedAnswer:{'@type':'Answer',text:el.querySelector('p').textContent}}))});
  else schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:'https://gokywebs.com/demo/soeli/'+(document.body.dataset.modelo==='2'?'modelo-2.html':'')},{'@type':'ListItem',position:2,name:'Carteras',item:'https://gokywebs.com/demo/soeli/'+catalogURL}]});
  document.head.appendChild(schema);
}
function stepper(qty, stock, mode = '', id = '') {
  return `<div class="stepper" data-limit="${stock}"><button type="button" data-step="-1" ${mode ? `data-cart-line="${id}"` : ''} aria-label="Quitar una unidad" ${qty <= 1 ? 'disabled' : ''}>−</button><output aria-label="Cantidad">${qty}</output><button type="button" data-step="1" ${mode ? `data-cart-line="${id}"` : ''} aria-label="Sumar una unidad" ${qty >= stock ? 'disabled' : ''}>+</button></div>`;
}
function cardHTML(p) {
  const c = CATEGORIAS.find(x => x.id === p.categoria)?.nombre || '';
  return `<article class="product-card" data-product="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="product-photo"><button type="button" data-detail="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.imagen}" width="1024" height="1024" alt="${esc(p.nombre)}, cartera ${esc(p.color.toLowerCase())}"><span class="view-label">Mirala de cerca ↗</span></button>${p.stock === 0 ? '<span class="product-status">Sin stock de muestra</span>' : ''}${p.descuento ? `<span class="product-status">−${p.descuento}%</span>` : ''}</div><div class="prod-info"><p class="prod-kicker">${esc(c)} · ${esc(p.color)}</p><h3 class="prod-name"><button type="button" data-detail="${p.id}">${esc(p.nombre)}</button></h3><p class="prod-price">${formatearPrecio(precioFinal(p))}${p.descuento ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p><div class="prod-actions">${stepper(1, p.stock || 1)}<button type="button" class="prod-add" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Agregar<span class="add-long"> al carrito</span>' : 'Sin stock'}</button></div><button type="button" class="prod-buy" data-buy="${p.id}" ${p.stock ? '' : 'disabled'}>Comprar ahora ↗</button></div></article>`;
}
function initCategories() {
  const categoryMenu = document.getElementById('category-menu');
  const toggle = document.getElementById('category-toggle');
  const count = c => PRODUCTOS.filter(p => p.categoria === c.id).length;
  const current = new URLSearchParams(window.location.search).get('cat');
  if (categoryMenu) categoryMenu.innerHTML = CATEGORIAS.map(c => `<a href="${catalogURL}?cat=${c.id}" ${current === c.id ? 'aria-current="page"' : ''}>${c.nombre}<span>${count(c)}</span></a>`).join('') + `<a href="${catalogURL}">Ver todo el catálogo <span>↗</span></a>`;
  document.querySelectorAll('[data-categories]').forEach(el => { el.innerHTML = CATEGORIAS.map(c => `<a href="${catalogURL}?cat=${c.id}"><span>${c.nombre}</span><small>${String(count(c)).padStart(2,'0')} ↗</small></a>`).join(''); });
  if (!toggle || !categoryMenu) return;
  let timer;
  const setOpen = open => { categoryMenu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setOpen(categoryMenu.hidden));
  const parent = toggle.parentElement;
  parent.addEventListener('mouseenter', () => { if (window.innerWidth > 768) { clearTimeout(timer); setOpen(true); } });
  parent.addEventListener('mouseleave', () => { if (window.innerWidth > 768) timer = setTimeout(() => setOpen(false), 120); });
  parent.addEventListener('focusout', e => { if (!parent.contains(e.relatedTarget)) setOpen(false); });
  document.addEventListener('click', e => { if (!parent.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !categoryMenu.hidden) { setOpen(false); toggle.focus(); e.stopPropagation(); } });
}
function initFeatured() {
  const el = document.getElementById('featured');
  if (!el) return;
  el.innerHTML = PRODUCTOS.slice(1, 9).map(cardHTML).join('');
}
function initCatalog() {
  const form = document.getElementById('catalog-filters');
  if (!form) return;
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('no-results');
  empty.dataset.animate = 'subir';
  empty.style.opacity = '0';
  empty.style.transform = 'translateY(24px)';
  const selectCat = document.getElementById('filter-category');
  const selectColor = document.getElementById('filter-color');
  selectCat.innerHTML = '<option value="">Todas las carteras</option>' + CATEGORIAS.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  selectColor.innerHTML = '<option value="">Todos los colores</option>' + COLORES.map(c => `<option value="${c}">${c}</option>`).join('');
  let f = validarFiltros(Object.fromEntries(new URLSearchParams(window.location.search)));
  let limit = 16;
  const syncControls = () => {
    document.getElementById('query').value = f.q;
    selectCat.value = f.cat; selectColor.value = f.color;
    document.getElementById('filter-price').value = f.precio;
    document.getElementById('filter-sort').value = f.orden;
    document.getElementById('filter-stock').checked = f.disponible;
  };
  const render = (append = false) => {
    const results = filtrarProductos(f);
    const visible = paginar(results, limit);
    const previous = append ? grid.querySelectorAll('.product-card').length : 0;
    if (append) grid.insertAdjacentHTML('beforeend', visible.slice(previous).map(cardHTML).join(''));
    else grid.innerHTML = visible.map(cardHTML).join('');
    document.getElementById('results-count').textContent = `${results.length} ${results.length === 1 ? 'cartera' : 'carteras'} · ${visible.length} a la vista`;
    empty.hidden = results.length > 0;
    if (!results.length) revelarNuevos(empty.parentElement);
    document.getElementById('load-more').hidden = visible.length >= results.length;
    document.getElementById('breadcrumb-current').textContent = CATEGORIAS.find(c => c.id === f.cat)?.nombre || 'Carteras';
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k,v]) => { if (v && v !== 'seleccion') params.set(k,v === true ? '1' : v); });
    const product = new URLSearchParams(window.location.search).get('producto');
    if (PRODUCTOS.some(p => p.slug === product)) params.set('producto', product);
    window.history.replaceState(null, '', window.location.pathname + (params.size ? '?' + params.toString() : ''));
    document.querySelectorAll('.gw-modelos__btn').forEach(a => { const base = a.dataset.modelo === '1' ? 'catalogo.html' : 'catalogo-2.html'; a.href = base + (params.size ? '?' + params.toString() : ''); });
    document.querySelectorAll('#category-menu a').forEach(a => { const match = new URL(a.href).searchParams.get('cat') === f.cat && f.cat; if (match) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    revelarNuevos(grid); refrescarScroll();
  };
  const change = () => {
    f = validarFiltros({q: document.getElementById('query').value, cat: selectCat.value, color: selectColor.value, precio: document.getElementById('filter-price').value, orden: document.getElementById('filter-sort').value, disponible: document.getElementById('filter-stock').checked});
    limit = 16; render();
  };
  form.addEventListener('submit', e => { e.preventDefault(); change(); });
  form.addEventListener('change', change);
  let searchTimer;
  document.getElementById('query').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(change, 160); });
  const reset = () => { clearTimeout(searchTimer); f = validarFiltros(); limit = 16; syncControls(); render(); };
  document.getElementById('clear-filters').addEventListener('click', reset);
  document.querySelector('[data-reset]').addEventListener('click', reset);
  document.getElementById('load-more').addEventListener('click', () => { limit += 16; render(true); });
  syncControls(); render();
}
let activeOverlay = null;
let lastTrigger = null;
let overlayTimer = 0;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const elements = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length);
  if (!elements.length) return;
  const first = elements[0], last = elements[elements.length-1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openOverlay(el) {
  clearTimeout(overlayTimer);
  document.querySelectorAll('.overlay').forEach(other => { if (other !== el) { other.hidden = true; other.classList.remove('open'); } });
  if (activeOverlay && activeOverlay !== el) { activeOverlay.hidden = true; activeOverlay.classList.remove('open'); }
  if (!activeOverlay) lastTrigger = document.activeElement;
  activeOverlay = el;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  document.querySelectorAll('main,.site-header,.site-footer,.gw-modelos,.floats').forEach(node => node.setAttribute('inert',''));
  requestAnimationFrame(() => { el.classList.add('open'); el.querySelector('button')?.focus(); });
}
function closeOverlay() {
  if (!activeOverlay) return;
  const closing = activeOverlay;
  closing.classList.remove('open');
  activeOverlay = null;
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('main,.site-header,.site-footer,.gw-modelos,.floats').forEach(node => node.removeAttribute('inert'));
  if (lastTrigger?.isConnected) lastTrigger.focus();
  overlayTimer = setTimeout(() => { closing.hidden = true; }, reduceMotion ? 0 : 350);
  const params = new URLSearchParams(window.location.search);
  if (params.has('producto')) { params.delete('producto'); window.history.replaceState(null,'',window.location.pathname+(params.size?'?'+params:'')); }
}
function openProduct(id) {
  const p = getProducto(id);
  if (!p) return;
  const container = document.getElementById('product-content');
  const related = PRODUCTOS.filter(x => x.id !== id && x.categoria === p.categoria).slice(0,3);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola SOELI, quiero consultar por la cartera ${p.nombre}. ¿Me confirman material, medidas y disponibilidad?`)}`;
  container.innerHTML = `<div class="detail-grid" data-product="${p.id}"><div><div class="detail-photo" id="detail-photo"><img src="images/${p.imagen}" width="1024" height="1024" alt="Cartera ${esc(p.nombre)}"></div><div class="gallery-tabs" aria-label="Vistas de la cartera"><button type="button" data-view="full" aria-pressed="true">Vista completa</button><button type="button" data-view="detail" aria-pressed="false">Acercar detalle</button></div></div><div class="detail-copy"><span class="eyebrow">${esc(CATEGORIAS.find(c=>c.id===p.categoria)?.nombre)}</span><h2>${esc(p.nombre)}</h2><p class="detail-price">${formatearPrecio(precioFinal(p))}</p><p>${esc(p.descripcion)}</p><div class="detail-variant">Color de esta muestra: <strong>${esc(p.color)}</strong></div><div class="prod-actions">${stepper(1,p.stock || 1)}<button type="button" class="prod-add" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Agregar al carrito' : 'Sin stock de muestra'}</button></div><button type="button" class="prod-buy" data-buy="${p.id}" ${p.stock ? '' : 'disabled'}>Comprar ahora ↗</button><p class="small">Producto, precio y stock ilustrativos. Confirmá las medidas y el material antes de comprar.</p><a class="text-link" href="${wa}" target="_blank" rel="noopener noreferrer">Consultá por esta cartera ↗</a></div></div>${related.length ? `<div class="related"><h3>También puede gustarte</h3><div class="related-list">${related.map(x=>`<button type="button" data-detail="${x.id}">${esc(x.nombre)} · ${formatearPrecio(x.precio)} ↗</button>`).join('')}</div></div>` : ''}`;
  openOverlay(document.getElementById('product-modal'));
  const params = new URLSearchParams(window.location.search); params.set('producto',p.slug);
  window.history.replaceState(null,'',window.location.pathname+'?'+params);
  let schema = document.getElementById('product-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'product-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
  schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.nombre+' — muestra ilustrativa',description:p.descripcion+' Producto y precio demostrativos.',image:'https://gokywebs.com/demo/soeli/images/'+p.imagen,brand:{'@type':'Brand',name:'SOELI'},offers:{'@type':'Offer',price:p.precio,priceCurrency:'ARS',availability:'https://schema.org/'+(p.stock?'InStock':'OutOfStock'),url:'https://gokywebs.com/demo/soeli/'+catalogURL+'?producto='+p.slug}});
}
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const items = Cart.get();
  container.innerHTML = items.length ? items.map(item => {
    const p = getProducto(item.id);
    if (!p) return '';
    return `<article class="cart-line"><img src="images/${p.imagen}" width="76" height="95" alt="${esc(p.nombre)}"><div><h3>${esc(p.nombre)}</h3><p>${esc(p.color)} · ${formatearPrecio(precioFinal(p)*item.qty)}</p><div class="cart-line-actions">${stepper(item.qty,p.stock,'cart',p.id)}<button type="button" class="remove-item" data-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">Quitar</button></div></div></article>`;
  }).join('') : `<div class="cart-empty"><h3>La próxima puede ser tuya.</h3><p>Elegí una cartera y guardala acá mientras seguís mirando.</p><a class="btn btn-ink" href="${catalogURL}">Explorá las carteras ↗</a></div>`;
  document.getElementById('cart-summary').hidden = items.length === 0;
  document.getElementById('cart-total').textContent = formatearPrecio(Cart.total());
}
function openCartDrawer() { renderCart(); openOverlay(document.getElementById('cart-modal')); }
function initInteractions() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('keydown', trapFocus);
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('[data-close]')) closeOverlay(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && activeOverlay) { e.preventDefault(); closeOverlay(); } });
  document.addEventListener('click', e => {
    const detail = e.target.closest('[data-detail]');
    if (detail) { openProduct(detail.dataset.detail); return; }
    const view = e.target.closest('[data-view]');
    if (view) { document.getElementById('detail-photo').classList.toggle('zoomed',view.dataset.view === 'detail'); document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===view))); return; }
    const remove = e.target.closest('[data-remove]');
    if (remove) { Cart.remove(remove.dataset.remove); renderCart(); document.querySelector('#cart-modal [data-close]')?.focus(); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const parent = step.closest('.stepper');
      const qty = Math.max(1, Math.min(Number(parent.dataset.limit), Number(parent.querySelector('output').textContent) + Number(step.dataset.step)));
      if (step.dataset.cartLine) { const id=step.dataset.cartLine; const direction=step.dataset.step; Cart.setQty(id,qty); renderCart(); document.querySelector(`[data-cart-line="${id}"][data-step="${direction}"]:not([disabled])`)?.focus(); }
      else { parent.querySelector('output').textContent = qty; parent.querySelector('[data-step="-1"]').disabled = qty <= 1; parent.querySelector('[data-step="1"]').disabled = qty >= Number(parent.dataset.limit); }
      return;
    }
    const add = e.target.closest('[data-add],[data-buy]');
    if (add) {
      const p = getProducto(add.dataset.add || add.dataset.buy);
      if (!p || !p.stock) return;
      const qty = Number(add.closest('[data-product]')?.querySelector('.stepper output')?.textContent || 1);
      const before = Cart.count();
      try { Cart.add(p,qty); }
      catch { showToast('Tu navegador no pudo guardar el carrito. Habilitá el almacenamiento e intentá de nuevo.'); return; }
      if (add.dataset.buy) openCartDrawer();
      else showToast(Cart.count() > before ? `${p.nombre} ya está en tu selección.` : 'Llegaste al stock disponible en esta muestra.');
    }
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',refrescarScroll));
  window.addEventListener('storage', e=>{ if (e.key===Cart.KEY) { prepararCarrito(); updateCartBadge(); renderCart(); } });
  const nav = document.getElementById('mainNav');
  nav?.addEventListener('keydown', e=> { if (window.innerWidth <= 768 && nav.classList.contains('open')) trapFocus(e); });
  const observer = new window.MutationObserver(() => {
    const open = nav.classList.contains('open');
    if (open) { nav.setAttribute('role','dialog'); nav.setAttribute('aria-modal','true'); }
    else { nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); }
  });
  if (nav) observer.observe(nav,{attributes:true,attributeFilter:['class']});
  window.matchMedia('(min-width: 769px)').addEventListener('change', e => { if (e.matches && nav?.classList.contains('open')) document.getElementById('navClose').click(); });
}
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from(hero.querySelector('[data-hero-img]'),{scale:1.08,duration:1.7,clearProps:'transform'},0)
    .from(hero.querySelector('.hero-eyebrow'),{y:16,opacity:0,duration:.8,clearProps:'all'},.1)
    .from(hero.querySelector('h1'),{y:24,opacity:0,duration:1.1,clearProps:'all'},.2)
    .from(hero.querySelector('.hero-lead'),{y:20,opacity:0,duration:.9,clearProps:'all'},.35)
    .from(hero.querySelectorAll('.hero-ctas .btn'),{y:18,opacity:0,duration:.8,stagger:.1,clearProps:'transform,opacity'},.5)
    .from(hero.querySelector('.hero-badge'),{y:12,opacity:0,duration:.9,clearProps:'transform,opacity'},.6);
}
function initDemo() {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  catalogURL = BASE + (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
  prepararCarrito(); initSchema();
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  initCategories(); initFeatured(); initCatalog(); initReveals(); initNav(); initInteractions(); initFloats(); updateCartBadge(); initModelBarScroll(); initHeroMotion();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load',refrescarScroll);
  const slug = new URLSearchParams(window.location.search).get('producto');
  const product = PRODUCTOS.find(p=>p.slug===slug);
  if (product) openProduct(product.id);
  let wspSeen = window.scrollY > 600;
  window.addEventListener('scroll',()=>{ if(window.scrollY>600) wspSeen=true; if(wspSeen) document.getElementById('wsp-float')?.classList.add('visible'); },{passive:true});
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'soeli_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {   
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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
  cart?.addEventListener('click', openCartDrawer);                     
  sync();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

globalThis.Soeli = { PRODUCTOS, CATEGORIAS, normalizar, validarFiltros, filtrarProductos, paginar, sanearCarrito, Cart, precioFinal, formatearPrecio };
if (typeof document.querySelector === 'function') initDemo();
