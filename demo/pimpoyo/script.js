const PAGE = document.body.dataset.page;
const MODEL = document.body.dataset.model || '1';
const CATALOG = MODEL === '1' ? 'catalogo.html' : 'catalogo-2.html';
const HOME = MODEL === '1' ? './' : 'modelo-2.html';
const WA = '5493512112630';
const CATEGORIES = [
  ['cereales', 'Cereales', '03-avena.jpg'],
  ['frutos-secos', 'Frutos secos', '04-almendras.jpg'],
  ['semillas', 'Semillas', '06-chia.jpg'],
  ['snacks', 'Algo rico', '08-chocolate.jpg'],
  ['almacen', 'Almacén', '09-aceite-oliva.jpg']
];
const fmt = n => new Intl.NumberFormat('es-AR', {style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img = name => `images/${encodeURIComponent(name)}`;
const store = new Map();
let focusBeforeDialog = null;
const cartKey = 'pimpoyo_demo_cart';
let cart = (() => {try { const x = JSON.parse(localStorage.getItem(cartKey)); return Array.isArray(x) ? x.slice(0,100) : []; } catch { return []; }})();
const iconCart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.5 4h2.8l2 10.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="18" cy="20" r="1.3" fill="currentColor"/></svg>';
const iconWA = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .8A15.1 15.1 0 0 0 3 23.5L.8 31l7.7-2A15.2 15.2 0 1 0 16 .8Zm0 27.6a12.3 12.3 0 0 1-6.3-1.7l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.4 12.4 0 1 1 16 28.4Zm6.8-9.3c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.3 1.5-.2.2-.5.3-.9.1-2.3-1.1-3.8-2.1-5.3-4.7-.4-.6.4-.6 1.1-2 .1-.2 0-.5-.1-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6H10c-.4 0-.8.2-1.1.5-.4.4-1.4 1.4-1.4 3.3s1.4 3.8 1.6 4c.2.3 2.8 4.4 6.8 6.1 2.5 1.1 3.5 1.2 4.7 1 1.5-.2 2.2-1.2 2.5-2.3.3-1 .3-1.9.2-2.1-.1-.2-.4-.3-.8-.5Z"/></svg>';

function header() {
  return `<div class="promo">COMER RICO <span>✳</span> ELEGIR BIEN <span>✳</span> COMPRAR FÁCIL</div>
  <header class="site-header"><div class="wrap head-inner"><a class="brand" href="${HOME}" aria-label="Pimpoyo, inicio"><span class="brand-mark">p</span><span><strong>pimpoyo</strong><small>TU DIETÉTICA</small></span></a>
  <nav class="desktop-nav" aria-label="Principal"><a href="${HOME}">Inicio</a><a href="${CATALOG}">Tienda</a><div class="nav-category"><button id="catToggle" type="button" aria-expanded="false" aria-haspopup="true">Categorías <span>⌄</span></button><div class="category-menu" id="catMenu">${CATEGORIES.map(([id,label])=>`<a href="${CATALOG}?cat=${id}">${label}<span>↗</span></a>`).join('')}<a href="${CATALOG}">Ver todo el catálogo <span>↗</span></a></div></div><a href="${HOME}#nosotros">Nosotros</a></nav>
  <div class="head-actions"><a class="head-wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp</a><button class="cart-top" type="button" data-open-cart aria-label="Abrir carrito">${iconCart}<span>Carrito</span><b data-cart-count>0</b></button><button class="menu-toggle" type="button" id="menuToggle" aria-label="Abrir menú" aria-expanded="false">☰</button></div></div>
  <nav class="mobile-nav" id="mobileNav" aria-label="Menú móvil"><a href="${HOME}">Inicio</a><a href="${CATALOG}">Tienda</a><details><summary>Categorías</summary>${CATEGORIES.map(([id,label])=>`<a href="${CATALOG}?cat=${id}">${label}</a>`).join('')}</details><a href="${HOME}#nosotros">Nosotros</a><a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp</a></nav></header>`;
}
function footer() { return `<footer class="site-footer" id="contacto"><div class="wrap footer-grid"><div><a href="${HOME}" class="footer-brand">pimpoyo<span>✳</span></a><p>Productos de dietética para todos los días.<br>Elegí tus favoritos y sumalos al carrito.</p></div><div><strong>Explorá</strong><a href="${CATALOG}">Todo el catálogo</a>${CATEGORIES.slice(0,3).map(([id,label])=>`<a href="${CATALOG}?cat=${id}">${label}</a>`).join('')}</div><div><strong>Hablemos</strong><a href="https://wa.me/${WA}" target="_blank" rel="noopener">+54 9 351 211-2630</a><p>¿Tenés una consulta? Escribinos.</p></div></div><div class="wrap footer-bottom"><span>© Pimpoyo · Demo de tienda</span><a href="https://gokywebs.com" target="_blank" rel="noopener">Developed and designed by Gokywebs</a></div></footer>`; }
function shell(content) {
  document.getElementById('app').innerHTML = `${header()}<main>${content}</main>${footer()}<div class="float-stack"><button class="float-cart" data-open-cart aria-label="Abrir carrito">${iconCart}<b data-cart-count>0</b></button><a class="float-wa" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="Hablar por WhatsApp">${iconWA}</a></div><nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="${PAGE==='catalog'?'catalogo.html':'./'}" data-modelo="1" ${MODEL==='1'?'aria-current="page"':''}>Modelo 1</a><a class="gw-modelos__btn" href="${PAGE==='catalog'?'catalogo-2.html':'modelo-2.html'}" data-modelo="2" ${MODEL==='2'?'aria-current="page"':''}>Modelo 2</a></nav><div class="overlay" id="overlay" hidden></div><aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden><div class="drawer-head"><div><small>TU COMPRA</small><h2>Tu carrito</h2></div><button class="close" data-close aria-label="Cerrar carrito">×</button></div><div id="cartContent"></div></aside><div class="quick-modal" id="quickModal" role="dialog" aria-modal="true" aria-label="Detalle del producto" hidden></div><div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  initCommon();
}
function hero() {
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-copy reveal"><p class="eyebrow">BIENVENIDOS A PIMPOYO <span>✳</span> TU DIETÉTICA</p><h1>Todo lo rico para <em>sentirte bien.</em></h1><p class="hero-sub">Productos de dietética para todos los días. Elegí tus favoritos y sumalos al carrito.</p><a class="button yellow" href="${CATALOG}">Comprar ahora <span>↗</span></a></div><div class="hero-visual reveal"><img class="hero-main" src="${img('02-dietetica-banner.jpg')}" alt="Frascos con avena, granola, semillas y frutos secos" fetchpriority="high"><img class="hero-side" src="${img('01-frutos-secos-vertical.jpg')}" alt="Frasco de frutos secos"><div class="hero-sticker">rico<br>cada día<span>✳</span></div></div></div></section>`;
}
function categorySection() { return `<section class="categories wrap reveal" id="categorias"><div class="section-heading"><div><p class="eyebrow">UN POCO DE TODO</p><h2>Encontrá lo que te gusta.</h2></div><a href="${CATALOG}" class="text-link">Ver todas las categorías ↗</a></div><div class="category-grid">${CATEGORIES.map(([id,label,photo],i)=>`<a class="category-card" href="${CATALOG}?cat=${id}"><span class="category-photo"><img src="${img(photo)}" alt="" loading="lazy"></span><span class="category-number">0${i+1}</span><strong>${label}</strong><span class="category-arrow">↗</span></a>`).join('')}</div></section>`; }
function productsSection(type) {
  const featured = type==='featured'; const title = featured?'Elegidos para vos.':'Seguí explorando.';
  return `<section class="product-section wrap reveal ${featured?'featured':'preview'}"><div class="section-heading"><div><p class="eyebrow">${featured?'FAVORITOS DE PIMPOYO':'MÁS PARA DESCUBRIR'}</p><h2>${title}</h2></div><a class="text-link" href="${CATALOG}">Ver todos los productos ↗</a></div><div class="product-grid ${featured?'rail':''}" id="${type}Grid"><p class="loading">Cargando productos…</p></div>${!featured?`<a href="${CATALOG}" class="button outline all-products">Ver todo el catálogo <span>↗</span></a>`:''}</section>`;
}
function story() { return `<section class="story reveal" id="nosotros"><div class="wrap story-grid"><div class="story-image"><img src="${img('02-dietetica-banner.jpg')}" alt="Frascos con productos de dietética sobre una mesa" loading="lazy"></div><div class="story-copy"><p class="eyebrow">PIMPOYO, TU DIETÉTICA</p><h2>Lo bueno de elegir a tu manera.</h2><p>De la avena de cada mañana a ese snack para la tarde: encontrá en un solo lugar productos para disfrutar todos los días.</p><a href="${CATALOG}" class="button dark">Explorar la tienda <span>↗</span></a></div></div></section>`; }
function benefits() { return `<section class="benefits reveal"><div class="wrap benefits-grid"><div><span>01</span><strong>Elegí tus favoritos</strong><p>Explorá categorías y encontrá lo que buscás.</p></div><div><span>02</span><strong>Sumalos al carrito</strong><p>Revisá tu pedido y ajustá cantidades fácilmente.</p></div><div><span>03</span><strong>Confirmá tu pedido</strong><p>Te contactamos para coordinar el pago y la entrega.</p></div></div></section>`; }
function renderHome() {
  const order = MODEL==='1' ? `${hero()}${categorySection()}${productsSection('featured')}${story()}${productsSection('preview')}${benefits()}` : `${hero()}${categorySection()}${productsSection('preview')}${story()}${productsSection('featured')}${benefits()}`;
  shell(order);
  loadBlock('home', 'featuredGrid', 7);
  loadBlock('home-preview', 'previewGrid', 7);
}
function renderCatalog() {
  const params = new URLSearchParams(location.search);
  const selected = CATEGORIES.some(x=>x[0]===params.get('cat')) ? params.get('cat') : '';
  shell(`<section class="catalog-hero"><div class="wrap"><p class="breadcrumbs"><a href="${HOME}">Inicio</a> / Catálogo</p><p class="eyebrow">LA TIENDA PIMPOYO</p><h1>Algo rico te espera acá.</h1><p>Explorá, elegí y llená tu carrito de favoritos.</p></div></section><section class="catalog-area wrap"><div class="catalog-tools"><label class="search-wrap"><span class="sr-only">Buscar productos</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input id="searchInput" type="search" placeholder="¿Qué estás buscando?" value="${esc(params.get('q')||'')}"></label><label class="sort-wrap">Ordenar <select id="sortSelect"><option value="original">Destacados</option><option value="menor">Menor precio</option><option value="mayor">Mayor precio</option></select></label></div><div class="filter-row" id="filterRow"><button type="button" data-cat="" ${!selected?'class="active"':''}>Todos</button>${CATEGORIES.map(([id,label])=>`<button type="button" data-cat="${id}" ${selected===id?'class="active"':''}>${label}</button>`).join('')}</div><div class="catalog-meta"><p id="resultsCount">Cargando productos…</p><button type="button" id="clearFilters">Limpiar filtros ↗</button></div><div class="product-grid catalog-grid" id="catalogGrid"><p class="loading">Cargando productos…</p></div><div class="empty-state" id="emptyState" hidden><h2>No encontramos productos</h2><p>Probá con otra palabra o explorá todas las categorías.</p><button class="button yellow" id="emptyReset">Ver todo</button></div><button class="button outline more" id="loadMore" hidden>Ver más productos ↓</button></section>`);
  initCatalog(selected);
}
function card(p) {
  store.set(Number(p.id), p);
  return `<article class="product-card"><button class="product-photo" data-quick="${p.id}" aria-label="Ver ${esc(p.name)}"><img src="${img(p.image)}" alt="${esc(p.name)}" loading="lazy"></button><div class="product-info"><span class="product-kicker">${esc(CATEGORIES.find(x=>x[0]===p.category)?.[1]||'Pimpoyo')} · ${esc(p.unit)}</span><button class="product-name" data-quick="${p.id}">${esc(p.name)}</button><strong class="price">${fmt(p.price)}</strong><button class="add-button" data-add="${p.id}">Agregar <span>+</span></button></div></article>`;
}
async function api(mode, limit, cursor='', q='', cat='', order='original') {
  const u = new URL('catalog-api.php', location.href);
  u.search = new URLSearchParams({mode,limit:String(Math.min(100,limit)),cursor,q,cat,order}).toString();
  const r = await fetch(u, {cache:'no-store'});
  if (!r.ok) throw new Error('No se pudo cargar el catálogo');
  return r.json();
}
async function loadBlock(mode, id, limit) {
  const el = document.getElementById(id);
  try { const d = await api(mode,limit); el.innerHTML = d.items.map(card).join('') || '<p>No hay productos disponibles.</p>'; }
  catch { el.innerHTML = '<p>No pudimos cargar los productos. Actualizá la página para intentar de nuevo.</p>'; }
}
function initCatalog(initialCat) {
  const grid=document.getElementById('catalogGrid'), search=document.getElementById('searchInput'), more=document.getElementById('loadMore'), count=document.getElementById('resultsCount'), sort=document.getElementById('sortSelect');
  let cat=initialCat, cursor='', hasMore=true, generation=0, displayed=0, debounce;
  const syncUrl=()=>{const u=new URL(location.href); cat?u.searchParams.set('cat',cat):u.searchParams.delete('cat'); search.value.trim()?u.searchParams.set('q',search.value.trim()):u.searchParams.delete('q'); history.replaceState({},'',u);};
  async function page(reset=false) {
    const my=++generation;
    if(reset){cursor='';hasMore=true;displayed=0;grid.innerHTML='<p class="loading">Buscando productos…</p>';}
    if(!hasMore)return;
    more.disabled=true;
    try {
      let results=[], loops=0;
      do { const d=await api('catalog',16-results.length,cursor,search.value.trim(),cat,sort.value); if(my!==generation)return; results.push(...d.items); cursor=d.nextCursor||''; hasMore=d.hasMore; loops++; } while(results.length<16 && hasMore && loops<20);
      if(reset)grid.innerHTML='';
      grid.insertAdjacentHTML('beforeend',results.map(card).join(''));
      displayed+=results.length;
      count.textContent=`${displayed} producto${displayed===1?'':'s'} para explorar${hasMore?' · hay más':''}`;
      document.getElementById('emptyState').hidden=displayed!==0;
      more.hidden=!hasMore;
    } catch { if(reset)grid.innerHTML='<p>No pudimos cargar el catálogo. Intentá de nuevo.</p>'; count.textContent='Ocurrió un error al cargar.'; more.hidden=true; }
    finally {more.disabled=false;}
  }
  document.getElementById('filterRow').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat=b.dataset.cat;document.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('active',x===b));syncUrl();page(true);});
  search.addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{syncUrl();page(true);},250);});
  sort.addEventListener('change',()=>page(true));
  more.addEventListener('click',()=>page());
  const clear=()=>{cat='';search.value='';sort.value='original';document.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('active',x.dataset.cat===''));syncUrl();page(true);};
  document.getElementById('clearFilters').addEventListener('click',clear);
  document.getElementById('emptyReset').addEventListener('click',clear);
  page(true);
}

function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart));renderBadges();if(!document.getElementById('cartDrawer')?.hidden)renderCart();}
function renderBadges(){const n=cart.reduce((s,x)=>s+x.qty,0);document.querySelectorAll('[data-cart-count]').forEach(x=>x.textContent=n);document.querySelector('.float-cart')?.classList.toggle('visible',n>0||scrollY>500);}
function toast(message){const t=document.getElementById('toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200);}
function add(id){const p=store.get(Number(id));if(!p)return;const x=cart.find(x=>x.id===p.id);if(x)x.qty++;else cart.push({id:p.id,qty:1,name:p.name,price:p.price,image:p.image});saveCart();toast(`${p.name} se agregó al carrito`);}
function renderCart(){const el=document.getElementById('cartContent');if(!el)return;if(!cart.length){el.innerHTML=`<div class="cart-empty"><span>✳</span><h3>Tu carrito te espera.</h3><p>Explorá la tienda y elegí algo rico.</p><a class="button yellow" href="${CATALOG}">Ver productos ↗</a></div>`;return;}
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  el.innerHTML=`<div class="cart-lines">${cart.map(x=>`<div class="cart-line"><img src="${img(x.image)}" alt=""><div><strong>${esc(x.name)}</strong><small>${fmt(x.price)}</small><div class="qty"><button data-qty="${x.id}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${x.qty}</span><button data-qty="${x.id}" data-delta="1" aria-label="Sumar una unidad">+</button></div></div><button class="remove" data-remove="${x.id}" aria-label="Eliminar ${esc(x.name)}">×</button></div>`).join('')}</div><div class="cart-summary"><div><span>Subtotal</span><strong>${fmt(total)}</strong></div><small>Precios ilustrativos de la demo. El pago online se configura al publicar la tienda.</small><button class="button yellow checkout-button" id="checkoutButton">Continuar con el pedido ↗</button></div>`;
}
function openOverlay(which){focusBeforeDialog=document.activeElement;document.getElementById('overlay').hidden=false;document.getElementById(which).hidden=false;document.body.classList.add('no-scroll');document.querySelector('.gw-modelos')?.classList.add('gw-modelos--scrolling');}
function closeOverlay(){document.getElementById('overlay').hidden=true;document.getElementById('cartDrawer').hidden=true;document.getElementById('quickModal').hidden=true;document.body.classList.remove('no-scroll');focusBeforeDialog?.focus?.();}
function openCart(){renderCart();openOverlay('cartDrawer');document.querySelector('#cartDrawer .close')?.focus();}
function openQuick(id){const p=store.get(Number(id));if(!p)return;const el=document.getElementById('quickModal');el.innerHTML=`<button class="close quick-close" data-close aria-label="Cerrar detalle">×</button><img src="${img(p.image)}" alt="${esc(p.name)}"><div><p class="eyebrow">${esc(CATEGORIES.find(x=>x[0]===p.category)?.[1]||'Pimpoyo')}</p><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><p class="unit">Presentación: ${esc(p.unit)}</p><strong class="quick-price">${fmt(p.price)}</strong><button class="button yellow" data-add="${p.id}">Agregar al carrito +</button><button class="text-link quick-buy" data-buy="${p.id}">Comprar ahora ↗</button></div>`;openOverlay('quickModal');el.querySelector('.close').focus();}
function checkout(){const el=document.getElementById('cartContent');const total=cart.reduce((s,x)=>s+x.price*x.qty,0);el.innerHTML=`<form class="checkout-form" id="checkoutForm"><p class="eyebrow">ÚLTIMO PASO</p><h3>Confirmá tus datos</h3><label>Tu nombre<input name="name" required autocomplete="name" placeholder="Nombre y apellido"></label><label>Tu teléfono<input name="phone" required type="tel" autocomplete="tel" placeholder="Tu número de contacto"></label><label>¿Cómo preferís recibirlo?<select name="delivery"><option>Quiero coordinar la entrega</option><option>Quiero consultar por retiro</option></select></label><label>Nota para el pedido<textarea name="note" rows="3" placeholder="Opcional"></textarea></label><div class="checkout-total"><span>Total ilustrativo</span><strong>${fmt(total)}</strong></div><p>Al confirmar, se abre WhatsApp con tu pedido listo para enviar. Pimpoyo coordinará el pago y la entrega.</p><button class="button yellow" type="submit">Confirmar pedido por WhatsApp ↗</button><button class="back-cart" type="button" id="backCart">← Volver al carrito</button></form>`;el.querySelector('#backCart').addEventListener('click',renderCart);el.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const lines=cart.map(x=>`• ${x.qty} × ${x.name} — ${fmt(x.price*x.qty)}`).join('\n');const msg=`Hola Pimpoyo, quiero hacer este pedido:\n${lines}\nTotal ilustrativo: ${fmt(total)}\n\nNombre: ${data.get('name')}\nTeléfono: ${data.get('phone')}\nEntrega: ${data.get('delivery')}\nNota: ${data.get('note')||'-'}`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');toast('Tu pedido está listo para enviar por WhatsApp');});}
function initCommon(){renderBadges();document.querySelectorAll('[data-open-cart]').forEach(x=>x.addEventListener('click',openCart));document.addEventListener('click',e=>{const addBtn=e.target.closest('[data-add]'),quick=e.target.closest('[data-quick]'),buy=e.target.closest('[data-buy]'),close=e.target.closest('[data-close]'),qty=e.target.closest('[data-qty]'),remove=e.target.closest('[data-remove]');if(addBtn)add(addBtn.dataset.add);if(quick)openQuick(quick.dataset.quick);if(buy){add(buy.dataset.buy);closeOverlay();openCart();}if(close)closeOverlay();if(qty){const x=cart.find(x=>x.id===Number(qty.dataset.qty));if(x){x.qty+=Number(qty.dataset.delta);if(x.qty<1)cart=cart.filter(y=>y!==x);saveCart();}}if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart();}if(e.target.id==='checkoutButton')checkout();});document.getElementById('overlay').addEventListener('click',closeOverlay);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay();});const toggle=document.getElementById('catToggle');toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',toggle.getAttribute('aria-expanded')==='true'?'false':'true'));document.addEventListener('click',e=>{if(!e.target.closest('.nav-category'))toggle.setAttribute('aria-expanded','false');});const menu=document.getElementById('menuToggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('mobileNav').classList.toggle('open',open);document.body.classList.toggle('menu-open',open);});let timer;addEventListener('scroll',()=>{renderBadges();const bar=document.querySelector('.gw-modelos');bar.classList.add('gw-modelos--scrolling');clearTimeout(timer);timer=setTimeout(()=>{if(!document.body.classList.contains('no-scroll'))bar.classList.remove('gw-modelos--scrolling');},120);},{passive:true});const observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');observer.unobserve(x.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));}

function renderAdmin(){document.getElementById('app').innerHTML=`<div class="admin-shell"><aside class="admin-side"><a class="brand" href="./"><span class="brand-mark">p</span><span><strong>pimpoyo</strong><small>PANEL DEMO</small></span></a><nav><a class="selected" href="#productos">Productos</a><a href="./">Ver la tienda ↗</a></nav></aside><main class="admin-main" id="productos"><div class="admin-head"><div><p class="eyebrow">PANEL DE ADMINISTRACIÓN · DEMOSTRACIÓN</p><h1>Productos</h1><p>Una vista de cómo podrías organizar el catálogo. Los precios y el stock definitivos se cargan al publicar la tienda.</p></div><a class="button dark" href="./">Ver tienda ↗</a></div><div class="admin-toolbar"><label class="search-wrap"><span class="sr-only">Buscar productos</span><input type="search" id="adminSearch" placeholder="Buscar productos por nombre o categoría"></label><select id="adminCategory" aria-label="Filtrar categoría"><option value="">Todas las categorías</option>${CATEGORIES.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></div><div class="admin-table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio ilustrativo</th><th>Visibilidad</th></tr></thead><tbody id="adminRows"><tr><td colspan="4">Cargando…</td></tr></tbody></table></div><p id="adminStatus" class="admin-status"></p><button id="adminMore" class="button outline" hidden>Ver más productos ↓</button></main></div>`;initAdmin();}
function initAdmin(){const rows=document.getElementById('adminRows'),search=document.getElementById('adminSearch'),cat=document.getElementById('adminCategory'),more=document.getElementById('adminMore'),status=document.getElementById('adminStatus');let cursor='',hasMore=true,gen=0,shown=0,timer;
  async function page(reset=false){const mine=++gen;if(reset){rows.innerHTML='<tr><td colspan="4">Buscando…</td></tr>';cursor='';hasMore=true;shown=0;}if(!hasMore)return;more.disabled=true;try{let found=[],loops=0;do{const d=await api('admin',20-found.length,cursor,search.value.trim(),cat.value);if(mine!==gen)return;found.push(...d.items);cursor=d.nextCursor||'';hasMore=d.hasMore;loops++;}while(found.length<20&&hasMore&&loops<20);if(reset)rows.innerHTML='';rows.insertAdjacentHTML('beforeend',found.map(p=>`<tr><td><div class="admin-product"><img src="${img(p.image)}" alt=""><div><strong>${esc(p.name)}</strong><small>${esc(p.unit)}</small></div></div></td><td>${esc(CATEGORIES.find(x=>x[0]===p.category)?.[1]||p.category)}</td><td>${fmt(p.price)}</td><td><span class="status-pill">${p.visible?'Visible':'Oculto'}</span></td></tr>`).join(''));shown+=found.length;if(!shown)rows.innerHTML='<tr><td colspan="4">No encontramos productos. Probá otra búsqueda.</td></tr>';status.textContent=`${shown} producto${shown===1?'':'s'} mostrado${shown===1?'':'s'}${hasMore?' · hay más páginas':''}`;more.hidden=!hasMore;}catch{rows.innerHTML='<tr><td colspan="4">No se pudo cargar el listado.</td></tr>';more.hidden=true;}finally{more.disabled=false;}}
  search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>page(true),250);});cat.addEventListener('change',()=>page(true));more.addEventListener('click',()=>page());page(true);}

if(PAGE==='admin')renderAdmin();else if(PAGE==='catalog')renderCatalog();else renderHome();
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
  if (e.key === 'Tab') {
    const dialog = [document.getElementById('quickModal'), document.getElementById('cartDrawer')].find(x => x && !x.hidden);
    if (!dialog) return;
    const elements = [...dialog.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')].filter(x => !x.hidden);
    if (!elements.length) return;
    const first = elements[0], last = elements.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
