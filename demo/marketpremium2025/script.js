const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'marketpremium2025_cart',
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
const PRODUCTOS = [];
const CATEGORIAS = [
  {id:'hogar',nombre:'Hogar & deco',cantidad:5,detalle:'Para tus espacios'},
  {id:'accesorios',nombre:'Accesorios',cantidad:3,detalle:'Para llevar con vos'},
  {id:'tecnologia',nombre:'Tecnología',cantidad:1,detalle:'Para tu rutina'}
];
const SUBCATEGORIAS = {cocina:'Cocina',deco:'Decoración',organizacion:'Organización',bolsos:'Bolsos',audio:'Audio'};
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const cleanCart = value => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(i => i && typeof i.id === 'string' && /^mp-[a-z0-9-]+$/.test(i.id) && Number.isFinite(i.qty) && i.qty > 0 && !seen.has(i.id) && seen.add(i.id)).slice(0,100).map(i => ({id:i.id,qty:Math.min(99,Math.floor(i.qty))}));
};
const model = document.body.dataset.modelo || '1';
const page = document.body.dataset.pagina;
const catalogUrl = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
const homeUrl = model === '2' ? 'modelo-2.html' : './';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const WHATSAPP_NUMBER = '5493462216657';
let cartFallback = [];
let lastFocus = null;
let activeOverlay = null;
let quickSequence = 0;
let pageAbort;
let nextCursor = null;
let loadingPage = false;
let requestSequence = 0;
const cartReady = {promise:Promise.resolve()};

function remember(items) {
  const protectedIds = new Set(Cart.get().map(i => i.id));
  for (const p of items) {
    const old = PRODUCTOS.findIndex(item => item.id === p.id);
    if (old >= 0) PRODUCTOS[old] = p;
    else {
      if (PRODUCTOS.length >= 100) {
        const evict = PRODUCTOS.findIndex(item => !protectedIds.has(item.id));
        if (evict >= 0) PRODUCTOS.splice(evict,1);
        else continue;
      }
      PRODUCTOS.push(p);
    }
  }
}
async function fetchPage(scope, options = {}, signal) {
  const cap = scope === 'home' ? 6 : scope === 'catalog' ? 16 : 100;
  const params = new URLSearchParams({scope,limit:String(Math.min(cap,options.limit || cap))});
  Object.entries(options).forEach(([key,value]) => {if (value !== '' && value != null && key !== 'limit') params.set(key,String(value));});
  const response = await fetch(`api.php?${params}`,{signal,cache:'no-store'});
  if (!response.ok) throw new Error('No pudimos cargar los productos.');
  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length > cap || data.items.length > 100) throw new Error('La respuesta del catálogo no es válida.');
  return data;
}
async function resolveProduct(id) {
  let p = getProducto(id);
  if (!p) {const data = await fetchPage('lookup',{ids:id,limit:1});remember(data.items);p = data.items[0];}
  return p;
}
function titleCategory(id) { return CATEGORIAS.find(c => c.id === id)?.nombre || 'Todos los productos'; }
function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'; }
function quantity(p, value = 1) {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar una unidad">−</button><output aria-label="Cantidad" data-qty data-max="${p.stock}">${value}</output><button type="button" data-step="1" aria-label="Sumar una unidad">+</button></div>`;
}
function cardHTML(p, variant = 'subir') {
  return `<article class="product-card" data-id="${esc(p.id)}" data-animate="${variant}" style="opacity:0;transform:translate${variant === 'der' ? 'X(44px)' : 'Y(32px)'}"><button type="button" class="prod-image" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="1254" height="1254"><span class="quick-hint">Ver detalles ↗</span>${p.stock === 0 ? '<span class="prod-badge">Sin stock · demo</span>' : p.descuento > 0 ? `<span class="prod-badge">−${p.descuento}%</span>` : ''}</button><div class="prod-info"><span class="prod-category">${esc(titleCategory(p.categoria))}</span><h3>${esc(p.nombre)}</h3><span class="prod-price">${formatearPrecio(precioFinal(p))}${p.descuento ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span><div class="prod-actions">${quantity(p)}<button type="button" class="prod-add" data-add="${esc(p.id)}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Agregar' : 'Sin stock'}</button></div><button type="button" class="buy-now" data-buy="${esc(p.id)}" ${p.stock ? '' : 'disabled'}>Comprar ahora</button></div></article>`;
}
function initCategories() {
  const active = new URLSearchParams(location.search).get('cat');
  $$('[data-cats-menu]').forEach(el => {el.innerHTML = CATEGORIAS.map(c => `<li><a href="${catalogUrl}?cat=${c.id}" ${active === c.id ? 'aria-current="page"' : ''}>${esc(c.nombre)} <span>${c.cantidad}</span></a></li>`).join('');});
  const strip = $('[data-categories]');
  if (strip) strip.innerHTML = CATEGORIAS.map((c,i) => `<div data-animate="cortina" style="clip-path:inset(0 100% 0 0)"><a href="${catalogUrl}?cat=${c.id}"><span class="category-num">0${i+1}</span><span><strong>${esc(c.nombre)}</strong><small>${esc(c.detalle)}</small></span>${arrow()}</a></div>`).join('');
  const catSelect = $('[name="cat"]');
  if (catSelect) catSelect.innerHTML = '<option value="">Todas las categorías</option>' + CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('');
  const subSelect = $('[name="sub"]');
  if (subSelect) subSelect.innerHTML = '<option value="">Todos los tipos</option>' + Object.entries(SUBCATEGORIAS).map(([id,name]) => `<option value="${id}">${esc(name)}</option>`).join('');
  const wrap = $('.nav-cats');
  if (!wrap) return;
  const btn = $('.nav-cats__btn',wrap), panel = $('.nav-cats__panel',wrap);
  let timer;
  const set = open => {clearTimeout(timer);panel.hidden = !open;btn.setAttribute('aria-expanded',String(open));};
  btn.addEventListener('click',() => set(panel.hidden));
  wrap.addEventListener('mouseenter',() => {if (matchMedia('(hover:hover) and (min-width:769px)').matches) set(true);});
  wrap.addEventListener('mouseleave',() => {if (matchMedia('(min-width:769px)').matches) timer = setTimeout(() => set(false),120);});
  wrap.addEventListener('focusout',e => {if (!wrap.contains(e.relatedTarget)) set(false);});
  document.addEventListener('click',e => {if (!wrap.contains(e.target)) set(false);});
  document.addEventListener('keydown',e => {if(e.key === 'Escape' && !panel.hidden){set(false);btn.focus();}});
}
function bindProductActions() {
  document.addEventListener('click',async e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const output = $('[data-qty]',step.parentElement);
      output.value = String(Math.max(1,Math.min(Number(output.dataset.max) || 1,Number(output.value) + Number(step.dataset.step))));
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) {await openQuick(quick.dataset.quick,quick);return;}
    const action = e.target.closest('[data-add],[data-buy]');
    if (!action || action.disabled) return;
    action.disabled = true;
    try {
      await cartReady.promise;
      const p = await resolveProduct(action.dataset.add || action.dataset.buy);
      if (!p || p.stock < 1) {showToast('Este producto no tiene stock disponible.');return;}
      const root = action.closest('[data-id]');
      const qty = Math.max(1,Math.min(p.stock,Number($('[data-qty]',root)?.value) || 1));
      const previous = Cart.get().find(i => i.id === p.id)?.qty || 0;
      Cart.add(p,qty);
      showToast(previous >= p.stock ? 'Ya agregaste el máximo disponible de este producto.' : `${p.nombre} se agregó al carrito.`);
      if (action.hasAttribute('data-buy')) openCartDrawer();
    } catch {showToast('No pudimos agregarlo. Volvé a intentar.');}
    finally {action.disabled = false;}
  });
}
function openOverlay(el, trigger) {
  if (!el) return;
  const returnFocus = activeOverlay ? lastFocus : trigger || document.activeElement;
  if (activeOverlay) closeOverlay(false);
  lastFocus = returnFocus;
  activeOverlay = el;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  $$('body > main,body > header,body > footer').forEach(x => x.inert = true);
  $('[data-close]',el)?.focus();
}
function closeOverlay(restore = true) {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  $('#productSchema')?.remove();
  document.body.classList.remove('no-scroll');
  $$('body > main,body > header,body > footer').forEach(x => x.inert = false);
  if (restore && lastFocus?.isConnected) lastFocus.focus();
}
function initDialogs() {
  $$('.overlay').forEach(el => el.addEventListener('click',e => {if(e.target === el || e.target.closest('[data-close]')) closeOverlay();}));
  document.addEventListener('keydown',e => {
    const dialog = activeOverlay || ($('#mainNav')?.classList.contains('open') ? $('#mainNav') : null);
    if (!dialog) return;
    if(e.key === 'Escape' && activeOverlay) closeOverlay();
    if(e.key !== 'Tab') return;
    const focusable = $$('a[href],button:not([disabled]),input,select,[tabindex="0"]',dialog).filter(el => el.getClientRects().length && !el.closest('[hidden]'));
    const first = focusable[0], last = focusable.at(-1);
    if(e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))){e.preventDefault();last?.focus();}
    else if(!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))){e.preventDefault();first?.focus();}
  });
  $$('[data-open-cart]').forEach(b => b.addEventListener('click',openCartDrawer));
}
async function openQuick(id, trigger) {
  const seq = ++quickSequence;
  try {
    const p = await resolveProduct(id);
    if(!p || seq !== quickSequence) return;
    const overlay = $('#quickOverlay');
    const dialog = $('.quick-dialog',overlay);
    dialog.innerHTML = `<button type="button" class="icon-btn quick-close" data-close aria-label="Cerrar detalles">×</button><div class="quick-grid" data-id="${esc(p.id)}"><div class="quick-photo"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="1254" height="1254"></div><div class="quick-copy"><p class="eyebrow">${esc(titleCategory(p.categoria))}</p><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><strong class="price">${formatearPrecio(precioFinal(p))}</strong><label>Presentación<select aria-label="Presentación del producto">${p.variantes.map(v => `<option>${esc(v)}</option>`).join('')}</select></label><div class="prod-actions">${quantity(p)}<button type="button" class="prod-add" data-add="${esc(p.id)}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Agregar al carrito' : 'Sin stock en esta demo'}</button></div><button type="button" class="btn btn-dark" data-buy="${esc(p.id)}" ${p.stock ? '' : 'disabled'}>Comprar ahora ${arrow()}</button><p class="demo-note">Producto, precio y stock ilustrativos.</p></div></div><div class="related" hidden><h3>También te puede interesar</h3><div class="related-items"></div></div>`;
    openOverlay(overlay,trigger);
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';schema.id = 'productSchema';
    schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.nombre,description:`Producto ilustrativo de demostración. ${p.descripcion}`,image:new URL(`images/${p.imagenes[0]}`,location.href).href,offers:{'@type':'Offer',price:precioFinal(p),priceCurrency:'ARS',availability:`https://schema.org/${p.stock ? 'InStock' : 'OutOfStock'}`}});
    document.head.appendChild(schema);
    const data = await fetchPage('catalog',{cat:p.categoria,limit:4});
    if(seq !== quickSequence || activeOverlay !== overlay) return;
    const related = data.items.filter(x => x.id !== p.id).slice(0,3);
    remember(related);
    $('.related',dialog).hidden = !related.length;
    $('.related-items',dialog).innerHTML = related.map(x => `<button type="button" class="related-item" data-quick="${esc(x.id)}"><img src="images/${esc(x.imagenes[0])}" alt="" width="48" height="48"><span>${esc(x.nombre)}<br>${formatearPrecio(precioFinal(x))}</span></button>`).join('');
  } catch {showToast('No pudimos abrir el producto. Volvé a intentar.');}
}
function renderCart() {
  updateCartBadge();
  const list = $('#cartItems');
  if (!list) return;
  const items = Cart.get();
  list.innerHTML = items.length ? items.map(i => {const p = getProducto(i.id);return p ? `<div class="cart-item" data-cart-id="${esc(i.id)}"><div class="cart-photo"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="76" height="76"></div><div><h3>${esc(p.nombre)}</h3><p>${formatearPrecio(precioFinal(p))} por unidad</p><div class="cart-item-actions"><div class="stepper"><button type="button" data-cart-change="-1" aria-label="Restar ${esc(p.nombre)}">−</button><output>${i.qty}</output><button type="button" data-cart-change="1" aria-label="Sumar ${esc(p.nombre)}">+</button></div><button type="button" class="remove" data-cart-remove>Quitar</button></div></div></div>` : '';}).join('') : `<div class="empty-state"><h2>Tu carrito empieza acá.</h2><p>Elegí eso que te gustó y encontralo acá.</p><a class="text-link" href="${catalogUrl}">Explorar el catálogo ${arrow()}</a></div>`;
  $('#cartTotal').textContent = formatearPrecio(Cart.total());
  $('#checkout').disabled = !items.length;
}
async function openCartDrawer(event) {
  openOverlay($('#cartOverlay'),event?.currentTarget || document.activeElement);
  try {await cartReady.promise;renderCart();} catch {showToast('No pudimos actualizar el carrito.');}
}
async function hydrateCart() {
  const stored = Cart.get();
  if (!stored.length) {renderCart();return;}
  const data = await fetchPage('lookup',{ids:stored.map(i => i.id).join(','),limit:100});
  remember(data.items);
  Cart.syncStock(data.items);
  renderCart();
}
function initCart() {
  Cart.get = function() {try{return cleanCart(JSON.parse(localStorage.getItem(this.KEY) || '[]'));}catch{return cartFallback;}};
  Cart.save = function(items) {cartFallback = cleanCart(items);try{localStorage.setItem(this.KEY,JSON.stringify(cartFallback));}catch{}document.dispatchEvent(new CustomEvent('cart:updated'));};
  const addCanonical = Cart.add.bind(Cart);
  Cart.add = (p,qty = 1) => {if(p.stock <= 0) return;if(Cart.get().length >= 100 && !Cart.get().some(i => i.id === p.id)){showToast('Tu carrito llegó al máximo de productos distintos.');return;}addCanonical(p,Math.max(1,Math.floor(qty)));};
  cartReady.promise = hydrateCart().catch(() => {showToast('No pudimos actualizar los precios del carrito. Intentá abrirlo nuevamente.');});
  document.addEventListener('cart:updated',renderCart);
  $('#cartItems')?.addEventListener('click',e => {
    const row = e.target.closest('[data-cart-id]');
    if(!row) return;
    const id = row.dataset.cartId;
    if(e.target.closest('[data-cart-remove]')) Cart.remove(id);
    const change = e.target.closest('[data-cart-change]');
    if(change) {const current = Cart.get().find(i => i.id === id)?.qty || 1;Cart.setQty(id,current + Number(change.dataset.cartChange));}
  });
  $('#checkout')?.addEventListener('click',() => {if(Cart.count()) showToast('¡Genial! El pago online se activa al pasar la web a producción.');});
}
function readFilters() {
  const form = $('#catalogFilters');
  if (!form) return {};
  const data = new FormData(form);
  return {cat:data.get('cat') || '',sub:data.get('sub') || '',q:$('#catalogSearch')?.value.trim() || '',orden:$('#sort')?.value || 'nombre',stock:data.get('stock') === '1' ? '1' : '',precio:data.get('precio') || ''};
}
function updateFilterUrl(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key,value]) => {if(value && !(key === 'orden' && value === 'nombre')) params.set(key,value);});
  history.replaceState(null,'',location.pathname + (params.size ? `?${params}` : ''));
  $('#categoryCrumb').textContent = filters.cat ? titleCategory(filters.cat) : 'Todos los productos';
  $$('[data-cats-menu] a').forEach(a => {a.removeAttribute('aria-current');if(filters.cat && a.href.includes(`cat=${filters.cat}`)) a.setAttribute('aria-current','page');});
}
async function loadCatalog(more = false) {
  const admin = page === 'admin';
  const root = admin ? $('#adminList') : $('#catalogGrid');
  if (!root || more && loadingPage) return;
  const seq = ++requestSequence;
  pageAbort?.abort();pageAbort = new AbortController();
  loadingPage = true;
  const moreBtn = admin ? $('#adminMore') : $('#loadMore');
  const status = admin ? $('#adminStatus') : $('#catalogStatus');
  const filters = admin ? {q:$('#adminSearch').value.trim()} : readFilters();
  if (!more) {nextCursor = null;root.innerHTML = '<div class="load-state" role="status">Buscando productos…</div>';}
  if (!admin) updateFilterUrl(filters);
  moreBtn.disabled = true;root.setAttribute('aria-busy','true');
  try {
    const data = await fetchPage(admin ? 'admin' : 'catalog',{...filters,cursor:more ? nextCursor : '',limit:admin ? 100 : 16},pageAbort.signal);
    if (seq !== requestSequence) return;
    remember(data.items);
    if (!more) root.innerHTML = '';
    if (!data.total) root.innerHTML = `<div class="empty-state"><h2>No encontramos ese producto.</h2><p>Probá con otra palabra o quitá algún filtro.</p><button type="button" class="btn btn-dark" data-clear>Limpiar búsqueda</button></div>`;
    else root.insertAdjacentHTML('beforeend',data.items.map(p => admin ? `<div class="admin-row"><img src="images/${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="65" height="65"><div><strong>${esc(p.nombre)}</strong><small>${esc(titleCategory(p.categoria))}</small></div><span>${formatearPrecio(precioFinal(p))}</span><span>${p.stock} unidades</span></div>` : cardHTML(p)).join(''));
    const maxNodes = admin ? 100 : 96;
    while(root.children.length > maxNodes) root.firstElementChild.remove();
    status.textContent = `${root.querySelectorAll(admin ? '.admin-row' : '.product-card').length} visibles · ${data.total} ${data.total === 1 ? 'producto' : 'productos'}`;
    nextCursor = data.nextCursor;
    moreBtn.hidden = !nextCursor;
    revelarNuevos(root);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  } catch(err) {
    if(err.name !== 'AbortError' && seq === requestSequence) {root.innerHTML = '<div class="empty-state"><p>No pudimos cargar el catálogo.</p><button type="button" class="btn btn-dark" data-retry>Volver a intentar</button></div>';status.textContent = 'Conexión interrumpida';moreBtn.hidden = true;}
  } finally {if(seq === requestSequence){loadingPage = false;moreBtn.disabled = false;root.setAttribute('aria-busy','false');}}
}
function initCatalog() {
  if (!['catalogo','admin'].includes(page)) return;
  const admin = page === 'admin';
  if(!admin) {
    const params = new URLSearchParams(location.search);
    const form = $('#catalogFilters');
    ['cat','sub','precio'].forEach(name => {const control = form.elements[name];const value = params.get(name) || '';control.value = [...control.options].some(o => o.value === value) ? value : '';});
    form.elements.stock.checked = params.get('stock') === '1';
    $('#catalogSearch').value = (params.get('q') || '').slice(0,80);
    $('#sort').value = ['nombre','precio-asc','precio-desc'].includes(params.get('orden')) ? params.get('orden') : 'nombre';
    form.addEventListener('change',() => loadCatalog());
    form.addEventListener('submit',e => {e.preventDefault();loadCatalog();});
    $('#sort').addEventListener('change',() => loadCatalog());
    const mobile = matchMedia('(max-width:768px)');
    $('.filters').open = !mobile.matches;
    mobile.addEventListener('change',() => {$('.filters').open = !mobile.matches;});
    const slug = params.get('producto');
    if(slug) fetchPage('lookup',{slug,limit:1}).then(data => {remember(data.items);if(data.items[0]) openQuick(data.items[0].id);}).catch(() => {});
  }
  const search = admin ? $('#adminSearch') : $('#catalogSearch');
  let searchTimer;
  search.addEventListener('input',() => {clearTimeout(searchTimer);searchTimer = setTimeout(() => loadCatalog(),300);});
  search.closest('form')?.addEventListener('submit',e => {e.preventDefault();clearTimeout(searchTimer);loadCatalog();});
  (admin ? $('#adminMore') : $('#loadMore')).addEventListener('click',() => loadCatalog(true));
  document.addEventListener('click',e => {
    if(e.target.closest('[data-clear]')) {
      if(admin) search.value = '';
      else {$('#catalogFilters').reset();$('#catalogSearch').value = '';$('#sort').value = 'nombre';}
      loadCatalog();
    }
    if(e.target.closest('[data-retry]')) loadCatalog();
  });
  return loadCatalog();
}
async function initHome() {
  const rail = $('#featuredRail');
  if(!rail) return;
  try {
    const data = await fetchPage('home');remember(data.items);
    rail.innerHTML = data.items.map(p => cardHTML(p,model === '1' ? 'der' : 'subir')).join('');
    if (model === '1') {
      initRailDrag(rail);
      const prev = $('#railPrev'), next = $('#railNext');
      const sync = () => {prev.disabled = rail.scrollLeft <= 2;next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;};
      prev.addEventListener('click',() => rail.scrollBy({left:-rail.clientWidth*.8,behavior:reduceMotion ? 'instant' : 'smooth'}));
      next.addEventListener('click',() => rail.scrollBy({left:rail.clientWidth*.8,behavior:reduceMotion ? 'instant' : 'smooth'}));
      rail.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);sync();
    }
  } catch {rail.innerHTML = '<div class="load-state"><div>No pudimos cargar la selección.<button type="button" class="btn btn-outline" id="retryHome">Volver a intentar</button></div></div>';$('#retryHome')?.addEventListener('click',async () => {await initHome();initReveals();});}
}
function initExtraMotion() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const label = $('.hero-label');
  if(label) gsap.to(label,{y:15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  $$('details').forEach(d => d.addEventListener('toggle',() => ScrollTrigger.refresh()));
}
async function boot() {
  initCategories();initNav();initCart();initDialogs();initFloats();initModelBarScroll();bindProductActions();
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  initHeroMotion();initExtraMotion();
  await Promise.allSettled([initHome(),initCatalog()]);
  initReveals();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load',() => ScrollTrigger.refresh());
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
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
    if (desktopMq.matches) { if (nav.classList.contains('open')) close(); nav.removeAttribute('inert'); }
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
  let reached = false;
  const sync = () => {
    const scrolled = reached = reached || window.scrollY > 600;
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
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch {} }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch {}
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
boot();
