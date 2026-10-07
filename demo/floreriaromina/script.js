(() => {
  'use strict';

  const WA = '5491128163312';
  const CART_KEY = 'floreria_romina_demo_cart_v1';
  const PRODUCTS = [
    { id:'ramo-rosa', name:'Ramo en tonos rosa', category:'Ramos', image:'images/01_floreria_romina_vertical_9x16.jpg', description:'Una propuesta suave de rosas y lirios rosados para regalar un momento especial.', tags:'rosa lirios delicado' },
    { id:'ramo-jardin', name:'Ramo jardín', category:'Ramos', image:'images/02_floreria_romina_horizontal_16x9.jpg', description:'Flores en una mezcla fresca de tonos rosados, blancos y verdes.', tags:'rosa blanco mixto' },
    { id:'ramo-blanco', name:'Ramo de lirios blancos', category:'Ramos', image:'images/04_floreria_romina_lirios_blancos.jpg', description:'Lirios blancos y follaje para un gesto sereno y luminoso.', tags:'lirios blancos' },
    { id:'arreglo-canasta', name:'Canasta de flores', category:'Arreglos', image:'images/03_floreria_romina_canasta_flores.jpg', description:'Una canasta floral en tonos suaves para celebrar o acompañar.', tags:'canasta rosa blanco' },
    { id:'arreglo-claro', name:'Arreglo blanco y verde', category:'Arreglos', image:'images/04_floreria_romina_lirios_blancos.jpg', description:'Flores blancas y verdes con una presencia natural.', tags:'lirios blanco verde' },
    { id:'arreglo-romantico', name:'Arreglo romántico', category:'Arreglos', image:'images/02_floreria_romina_horizontal_16x9.jpg', description:'Una combinación de flores rosadas y blancas para decir mucho sin palabras.', tags:'rosa lirios' },
    { id:'rosas-rojas', name:'Rosas rojas', category:'Rosas', image:'images/05_floreria_romina_rosas_rojas.jpg', description:'El gesto clásico para una ocasión que querés recordar.', tags:'rojas romantico' },
    { id:'rosas-rosadas', name:'Rosas rosadas', category:'Rosas', image:'images/01_floreria_romina_vertical_9x16.jpg', description:'Rosas en tonos rosados junto a flores claras y follaje.', tags:'rosadas suave' },
    { id:'rosas-y-lirios', name:'Rosas y lirios', category:'Rosas', image:'images/02_floreria_romina_horizontal_16x9.jpg', description:'Una mezcla floral de rosas, lirios y verdes naturales.', tags:'rosa lirios mixto' },
    { id:'box-flores', name:'Box de flores y regalo', category:'Regalos', image:'images/06_floreria_romina_box_regalo.jpg', description:'Flores y un detalle de regalo presentados en una caja rosa.', tags:'box caja regalo' },
    { id:'box-rosa', name:'Box en tonos rosa', category:'Regalos', image:'images/06_floreria_romina_box_regalo.jpg', description:'Una alternativa de regalo floral para sorprender de una forma distinta.', tags:'box caja rosa regalo' },
    { id:'canasta-regalo', name:'Canasta para regalar', category:'Regalos', image:'images/03_floreria_romina_canasta_flores.jpg', description:'Una canasta de flores para llevar un mensaje especial.', tags:'canasta regalo flores' }
  ];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const getProduct = id => PRODUCTS.find(product => product.id === id);
  const state = { category:'', search:'', visible:16, cart:loadCart(), lastFocus:null, modalId:null, toastTimer:0 };

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(row => row && getProduct(row.id) && Number.isInteger(row.qty) && row.qty > 0).map(row => ({id:row.id,qty:Math.min(row.qty,20),dedication:String(row.dedication || '').slice(0,500)})) : [];
    } catch (_) { return []; }
  }
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (_) {} }
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }
  function updateCount() {
    const count = state.cart.reduce((sum, row) => sum + row.qty, 0);
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });
    $('.floating-actions').classList.toggle('visible', count > 0 || scrollY > 590);
  }
  function addCart(id, qty=1, dedication='') {
    const product = getProduct(id);
    if (!product) return;
    const text = dedication.trim().slice(0,500);
    const existing = state.cart.find(row => row.id === id && row.dedication === text);
    if (existing) existing.qty = Math.min(20, existing.qty + qty);
    else state.cart.push({id,qty:Math.max(1,Math.min(20,qty)),dedication:text});
    saveCart(); updateCount(); renderCart();
    toast(product.name + ' se sumó a tu pedido.');
  }
  function filteredProducts() {
    return PRODUCTS.filter(product => {
      const matchCategory = !state.category || product.category === state.category;
      const haystack = normalize([product.name,product.category,product.description,product.tags].join(' '));
      return matchCategory && (!state.search || haystack.includes(normalize(state.search)));
    });
  }
  function productCard(product) {
    return `<article class="product-card" data-animate><button type="button" class="product-image" data-open-product="${esc(product.id)}" aria-label="Ver ${esc(product.name)}"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy"><span>VER DETALLE ↗</span></button><div class="product-body"><span class="product-category">${esc(product.category)}</span><h3>${esc(product.name)}</h3><p>Precio a confirmar</p><div class="product-actions"><button type="button" class="product-detail" data-open-product="${esc(product.id)}" aria-label="Ver detalles de ${esc(product.name)}">↗</button><button type="button" class="product-add" data-add-product="${esc(product.id)}">Elegir para regalar</button></div></div></article>`;
  }
  function renderCatalog() {
    const results = filteredProducts();
    const shown = results.slice(0,state.visible);
    $('#product-grid').innerHTML = shown.length ? shown.map(productCard).join('') : '<div class="catalog-empty"><h3>No encontramos esas flores.</h3><p>Probá otra búsqueda o mirá todas las propuestas.</p><button type="button" data-clear-filters>Ver todas las flores</button></div>';
    $('#catalog-count').textContent = `${results.length} ${results.length === 1 ? 'propuesta' : 'propuestas'} de ejemplo`;
    $('#show-more').hidden = shown.length >= results.length;
    $('#clear-filters').hidden = !state.category && !state.search;
    $$('[data-filter]').forEach(button => button.classList.toggle('active',button.dataset.filter === state.category));
    initReveals($('#product-grid'));
  }
  function setCategory(category, shouldScroll=true) {
    state.category = category;
    state.visible = 16;
    renderCatalog();
    if (shouldScroll) $('#tienda').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function clearFilters() {
    state.category = ''; state.search = ''; state.visible = 16;
    $('#shop-search').value = '';
    renderCatalog();
  }
  function closeDialogs(restoreFocus=true) {
    if (state.modalId === '#product-modal' && new URLSearchParams(location.search).has('producto')) {
      const url = new URL(location.href);
      url.searchParams.delete('producto');
      history.replaceState(null,'',url);
    }
    $('#cart-drawer').hidden = true;
    $('#product-modal').hidden = true;
    $('#gallery-modal').hidden = true;
    $('#overlay').hidden = true;
    document.body.classList.remove('dialog-open');
    state.modalId = null;
    if (restoreFocus && state.lastFocus?.focus) state.lastFocus.focus();
  }
  function showDialog(selector) {
    closeDialogs(false);
    const dialog = $(selector);
    dialog.hidden = false;
    $('#overlay').hidden = false;
    document.body.classList.add('dialog-open');
    state.modalId = selector;
    dialog.querySelector('[data-close],button,input')?.focus();
  }
  function openCart() {
    state.lastFocus = document.activeElement;
    renderCart();
    showDialog('#cart-drawer');
  }
  function openProduct(id) {
    const product = getProduct(id);
    if (!product) return;
    state.lastFocus = document.activeElement;
    $('#modal-body').innerHTML = `<div class="modal-inner"><img src="${esc(product.image)}" alt="${esc(product.name)}"><div class="modal-copy"><span class="eyebrow">${esc(product.category)} · PROPUESTA DE DEMO</span><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p><p>El producto final, su composición y su precio se confirmarán antes de publicar.</p><label>Tu dedicatoria para este regalo<textarea id="modal-dedication" maxlength="500" placeholder="Escribí acá el mensaje que acompañará las flores"></textarea></label><div class="modal-actions"><input id="modal-qty" type="number" min="1" max="20" value="1" aria-label="Cantidad"><button type="button" class="button button-primary" data-modal-add="${esc(product.id)}">Sumar a mi pedido ↗</button></div><small>Podés cambiar la dedicatoria más adelante en tu carrito.</small></div></div>`;
    showDialog('#product-modal');
    const url = new URL(location.href);
    url.searchParams.set('producto',id);
    history.replaceState(null,'',url);
  }
  function openGallery(source, alt) {
    state.lastFocus = document.activeElement;
    $('#gallery-large').src = source;
    $('#gallery-large').alt = alt;
    showDialog('#gallery-modal');
  }
  function renderCart() {
    const items = $('#cart-items');
    items.innerHTML = state.cart.length ? state.cart.map((row,index) => {
      const product = getProduct(row.id);
      return `<div class="cart-row"><img src="${esc(product.image)}" alt=""><div><h4>${esc(product.name)}</h4><small>Precio a confirmar</small><textarea data-dedication="${index}" maxlength="500" aria-label="Dedicatoria para ${esc(product.name)}" placeholder="Escribí una dedicatoria (opcional)">${esc(row.dedication)}</textarea><div class="cart-row-actions"><span class="qty-controls"><button type="button" data-qty="${index}" data-delta="-1" aria-label="Quitar una unidad">−</button>${row.qty}<button type="button" data-qty="${index}" data-delta="1" aria-label="Sumar una unidad">+</button></span><button type="button" class="remove" data-remove="${index}">Quitar</button></div></div></div>`;
    }).join('') : '<div class="cart-empty"><h3>Tu pedido empieza con una flor.</h3><p>Elegí algo del catálogo y sumale tus palabras.</p><button type="button" class="button button-outline" data-close>Volver a la tienda</button></div>';
    $('#order-form').hidden = !state.cart.length;
  }
  function localToday() {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  }
  function messageFromOrder(form) {
    const field = name => form.elements.namedItem(name).value.trim();
    const lines = ['Hola Florería Romina, quiero consultar por este pedido:',''];
    state.cart.forEach(row => {
      const product = getProduct(row.id);
      lines.push(`• ${product.name} × ${row.qty}`);
      if (row.dedication.trim()) lines.push(`  Dedicatoria: ${row.dedication.trim()}`);
    });
    lines.push('',`Recibe: ${field('recipient')}`,`Dirección o zona: ${field('address')}`,`Día deseado: ${field('date')}`,`Horario deseado: ${field('time')}`,`Pago preferido: ${field('payment')}`,'','¿Me confirman precio, disponibilidad y entrega?');
    return lines.join('\n');
  }
  function initReveals(root=document) {
    const elements = [...root.querySelectorAll('[data-animate]')];
    if (!elements.length) return;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { elements.forEach(el => el.classList.add('in')); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } });
    },{threshold:0,rootMargin:'0px 0px 45px 0px'});
    elements.forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
    setTimeout(() => elements.forEach(el => el.classList.add('in')),1800);
  }
  function initNav() {
    const nav = $('#main-nav'), toggle = $('.menu-toggle'), backdrop = $('.nav-backdrop');
    const mq = matchMedia('(min-width: 821px)');
    const close = () => { nav.classList.remove('open'); backdrop.hidden = true; toggle.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); if (!mq.matches) nav.setAttribute('inert',''); };
    const open = () => { nav.classList.add('open'); backdrop.hidden = false; nav.removeAttribute('inert'); toggle.setAttribute('aria-expanded','true'); document.body.classList.add('menu-open'); nav.querySelector('a')?.focus(); };
    const sync = () => { if (mq.matches) { close(); nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) nav.setAttribute('inert',''); };
    toggle.addEventListener('click',() => nav.classList.contains('open') ? close() : open());
    $('.nav-close').addEventListener('click',() => { close(); toggle.focus(); });
    backdrop.addEventListener('click',close);
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click',close));
    mq.addEventListener('change',sync);
    sync();
    return close;
  }

  const closeNav = initNav();
  $('#order-form [name="date"]').min = localToday();
  renderCatalog(); renderCart(); updateCount(); initReveals();

  document.addEventListener('click',event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-open-cart')) { openCart(); return; }
    if (target.dataset.category !== undefined) { setCategory(target.dataset.category); return; }
    if (target.dataset.filter !== undefined) { setCategory(target.dataset.filter,false); return; }
    if (target.hasAttribute('data-clear-filters') || target.id === 'clear-filters') { clearFilters(); return; }
    if (target.id === 'show-more') { state.visible += 16; renderCatalog(); return; }
    if (target.dataset.openProduct) { openProduct(target.dataset.openProduct); return; }
    if (target.dataset.addProduct) { addCart(target.dataset.addProduct); return; }
    if (target.dataset.modalAdd) { const qty=Math.max(1,Math.min(20,parseInt($('#modal-qty').value,10)||1)); addCart(target.dataset.modalAdd,qty,$('#modal-dedication').value); closeDialogs(); return; }
    if (target.dataset.gallery) { openGallery(target.dataset.gallery,target.dataset.alt || 'Flores'); return; }
    if (target.hasAttribute('data-close')) { closeDialogs(); return; }
    if (target.dataset.remove !== undefined) { state.cart.splice(Number(target.dataset.remove),1); saveCart(); updateCount(); renderCart(); return; }
    if (target.dataset.qty !== undefined) { const row=state.cart[Number(target.dataset.qty)]; if (!row) return; row.qty += Number(target.dataset.delta); if (row.qty <= 0) state.cart.splice(Number(target.dataset.qty),1); else row.qty=Math.min(row.qty,20); saveCart(); updateCount(); renderCart(); }
  });
  $('#shop-search').addEventListener('input',event => { state.search=event.target.value.trim(); state.visible=16; renderCatalog(); });
  $('#cart-items').addEventListener('input',event => { const index=event.target.dataset.dedication; if (index === undefined || !state.cart[index]) return; state.cart[index].dedication=event.target.value.slice(0,500); saveCart(); });
  $('#overlay').addEventListener('click',() => closeDialogs());
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') { if (state.modalId) closeDialogs(); else closeNav(); return; }
    if (event.key !== 'Tab' || !state.modalId) return;
    const dialog=$(state.modalId);
    const focusables=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled])')].filter(el => !el.closest('[hidden]'));
    if (!focusables.length) return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
  });
  $('#order-form').addEventListener('submit',event => {
    event.preventDefault();
    if (!state.cart.length) { toast('Elegí flores para preparar tu pedido.'); return; }
    const form=event.currentTarget;
    if (!form.reportValidity()) return;
    const date = form.elements.namedItem('date');
    if (date.value < localToday()) { toast('Elegí una fecha de hoy en adelante.'); date.focus(); return; }
    const url=`https://wa.me/${WA}?text=${encodeURIComponent(messageFromOrder(form))}`;
    window.open(url,'_blank','noopener');
    toast('Tu pedido está listo para enviar por WhatsApp.');
  });
  addEventListener('scroll',updateCount,{passive:true});
  const deepLink=new URLSearchParams(location.search).get('producto');
  if (deepLink && getProduct(deepLink)) openProduct(deepLink);
  // Las imágenes del demo se muestran como referencia visual dentro del sitio.
  document.addEventListener('contextmenu',event => { if (event.target.closest('img')) event.preventDefault(); });
})();
