/* V1 "Serenidad" — render + interacción. Usa data.js + core.js. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = location.pathname.includes('/producto/') ? '../' : '';
const IMG = c => BASE + c;
const qs = new URLSearchParams(location.search);
const wspBase = txt => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(txt);

function initReveal() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => ents.forEach(e => {
    if (e.isIntersecting) { const el = e.target, sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')]; el.style.transitionDelay = Math.min(Math.max(sibs.indexOf(el),0),6)*0.08 + 's'; el.classList.add('in'); io.unobserve(el); }
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}
function initNav() {
  const t = document.getElementById('navToggle'), n = document.getElementById('mobileNav');
  if (!t || !n) return;
  let bd = document.querySelector('.nav-backdrop'); if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => { n.classList.remove('open'); bd.classList.remove('open'); t.setAttribute('aria-expanded','false'); n.setAttribute('aria-hidden','true'); };
  const open = () => { n.classList.add('open'); bd.classList.add('open'); t.setAttribute('aria-expanded','true'); n.setAttribute('aria-hidden','false'); };
  t.addEventListener('click', () => n.classList.contains('open') ? close() : open());
  bd.addEventListener('click', close);
  n.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && n.classList.contains('open')) close(); });
}

/* Badges header */
function syncBadges() {
  document.querySelectorAll('[data-cart-count]').forEach(b => { const n = Cart.count(); b.textContent = n; b.classList.toggle('has', n>0); b.classList.remove('bump'); void b.offsetWidth; if (n>0) b.classList.add('bump'); });
  document.querySelectorAll('[data-wish-count]').forEach(b => { const n = Wishlist.count(); b.textContent = n; b.classList.toggle('has', n>0); });
}

/* Card */
function cardHTML(p, i) {
  const pf = precioFinal(p), sinStock = p.stock <= 0, wished = Wishlist.has(p.id);
  const badge = sinStock ? '<span class="p-badge sin">Sin stock</span>' : (p.nuevo ? '<span class="p-badge">Nuevo</span>' : (p.descuento>0 ? '<span class="p-badge off">-'+p.descuento+'%</span>' : ''));
  const precio = p.descuento>0 ? '<span class="p-precio"><s>'+formatPrecio(p.precio)+'</s> '+formatPrecio(pf)+'</span>' : '<span class="p-precio">'+formatPrecio(pf)+'</span>';
  return '<article class="p-card" data-animate style="--i:'+(i||0)+'">'+
    '<div class="p-cover"><a href="'+BASE+'producto/?id='+p.id+'"><img src="'+IMG(p.img)+'" alt="'+esc(p.nombre)+'" width="1200" height="1200" loading="lazy"'+(sinStock?' style="opacity:.55"':'')+'></a>'+badge+
    '<button class="p-wish'+(wished?' on':'')+'" data-wish="'+p.id+'" aria-label="Guardar en favoritos"><svg viewBox="0 0 24 24" fill="'+(wished?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 3.5C19 16.65 12 21 12 21Z"/></svg></button></div>'+
    '<div class="p-body"><span class="p-cat">'+esc(getCategoria(p.categoria))+'</span>'+
    '<h3><a href="'+BASE+'producto/?id='+p.id+'">'+esc(p.nombre)+'</a></h3>'+precio+
    (sinStock ? '<button class="btn btn-ghost btn-block" disabled>Sin stock</button>' :
    '<div class="p-actions"><div class="qty" data-qty><button data-minus aria-label="Restar">–</button><span data-val>1</span><button data-plus aria-label="Sumar">+</button></div>'+
    '<button class="btn btn-cta btn-block" data-add="'+p.id+'">Agregar</button>'+
    '<button class="btn btn-ghost btn-block" data-buy="'+p.id+'">Comprar ahora</button></div>')+
    '</div></article>';
}
function wireCards(root) {
  root.querySelectorAll('[data-qty]').forEach(q => {
    const val = q.querySelector('[data-val]');
    q.querySelector('[data-minus]').addEventListener('click', () => { val.textContent = Math.max(1, +val.textContent - 1); });
    q.querySelector('[data-plus]').addEventListener('click', () => { val.textContent = Math.min(99, +val.textContent + 1); });
  });
  root.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const p = getProducto(b.dataset.add); const q = b.closest('.p-body,.pd-buy')?.querySelector('[data-val]'); Cart.add(p, q ? +q.textContent : 1); showToast('Sumado a tu carrito'); }));
  root.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => {
    const p = getProducto(b.dataset.buy); const q = b.closest('.p-body,.pd-buy')?.querySelector('[data-val]'); Cart.add(p, q ? +q.textContent : 1); openCart(); }));
  root.querySelectorAll('[data-wish]').forEach(b => b.addEventListener('click', () => {
    const on = Wishlist.toggle(b.dataset.wish); b.classList.toggle('on', on); b.querySelector('svg').setAttribute('fill', on?'currentColor':'none'); }));
}

/* Cart drawer */
function openCart() { const d = document.getElementById('cartDrawer'); if (!d) return; renderCart(); d.classList.add('open'); d.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
function closeCart() { const d = document.getElementById('cartDrawer'); if (!d) return; d.classList.remove('open'); d.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); }
function renderCart() {
  const box = document.getElementById('cartItems'); if (!box) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  const totalEl = document.getElementById('cartTotal'), chk = document.getElementById('cartCheckout');
  const ship = document.getElementById('shipBar');
  if (!items.length) {
    box.innerHTML = '<div class="cart-empty"><p>Tu carrito está esperando un momento para vos.</p><a class="btn btn-ghost" href="'+BASE+'catalogo.html">Ver la tienda</a></div>';
    if (totalEl) totalEl.textContent = formatPrecio(0); if (chk) chk.disabled = true; if (ship) ship.hidden = true; return;
  }
  box.innerHTML = items.map(i => '<div class="cart-item"><img src="'+IMG(i.p.img)+'" alt="" width="70" height="70" loading="lazy">'+
    '<div class="cart-item-body"><h4>'+esc(i.p.nombre)+'</h4><strong>'+formatPrecio(precioFinal(i.p))+'</strong>'+
    '<div class="cart-qty" data-cqty="'+i.p.id+'"><button data-cminus aria-label="Restar">–</button><span>'+i.qty+'</span><button data-cplus aria-label="Sumar">+</button></div></div>'+
    '<button class="cart-remove" data-cremove="'+i.p.id+'" aria-label="Quitar">&times;</button></div>').join('');
  const total = Cart.total();
  if (totalEl) totalEl.textContent = formatPrecio(total);
  if (chk) chk.disabled = false;
  if (ship) {
    ship.hidden = false;
    const falta = ENVIO_GRATIS_DESDE - total;
    const bar = ship.querySelector('.ship-fill'), txt = ship.querySelector('.ship-txt');
    if (falta <= 0) { txt.innerHTML = '¡Tenés envío gratis! 🌿'; bar.style.width = '100%'; }
    else { txt.innerHTML = 'Te faltan <b>'+formatPrecio(falta)+'</b> para el envío gratis'; bar.style.width = Math.min(100, total/ENVIO_GRATIS_DESDE*100)+'%'; }
  }
  box.querySelectorAll('[data-cqty]').forEach(q => {
    const id = q.dataset.cqty;
    q.querySelector('[data-cminus]').addEventListener('click', () => { const it = Cart.get().find(x=>x.id===+id); Cart.setQty(id, (it?.qty||1)-1); });
    q.querySelector('[data-cplus]').addEventListener('click', () => { const it = Cart.get().find(x=>x.id===+id); Cart.setQty(id, (it?.qty||1)+1); });
  });
  box.querySelectorAll('[data-cremove]').forEach(b => b.addEventListener('click', () => Cart.remove(b.dataset.cremove)));
}
function initCart() {
  const d = document.getElementById('cartDrawer'); if (!d) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCart(); }));
  d.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && d.classList.contains('open')) closeCart(); });
  const chk = document.getElementById('cartCheckout');
  if (chk) chk.addEventListener('click', () => { if (!Cart.count()) return; showToast('¡Gracias! El pago online se activa al pasar la web a producción.'); Cart.clear(); setTimeout(closeCart, 900); });
  document.addEventListener('cart:updated', () => { syncBadges(); renderCart(); });
  document.addEventListener('wish:updated', syncBadges);
}

/* Reservas */
function renderReservas(el) {
  el.innerHTML = RESERVAS.map(r => '<article class="res-card" data-animate>'+
    '<div class="res-info"><h3>'+esc(r.nombre)+'</h3><p>'+esc(r.desc)+'</p><div class="res-meta"><span>'+esc(r.duracion)+'</span><i></i><span>'+esc(r.precio)+'</span></div></div>'+
    '<a class="btn btn-cta" href="'+wspBase('Hola Compasivamente! Quiero reservar: '+r.nombre+' ('+r.duracion+').')+'" target="_blank" rel="noopener">Reservar</a>'+
    '</article>').join('');
}

/* Home */
function initHome() {
  const dest = document.getElementById('destacados');
  if (dest) { dest.innerHTML = PRODUCTOS.filter(p => p.destacado).map((p,i)=>cardHTML(p,i)).join(''); wireCards(dest); }
  const cats = document.getElementById('catsList');
  if (cats) cats.innerHTML = CATEGORIAS.map((c,i) => { const n = PRODUCTOS.filter(p=>p.categoria===c.id).length; return '<a class="cat-tile" href="catalogo.html?cat='+c.id+'" data-animate style="--i:'+i+'"><span class="cat-name">'+esc(c.label)+'</span><span class="cat-n">'+n+' producto'+(n!==1?'s':'')+'</span></a>'; }).join('');
  const res = document.getElementById('reservasList'); if (res) renderReservas(res);
  initBreathing();
}
function initBreathing() {
  const b = document.getElementById('breathTxt'); if (!b || reduce) return;
  const fases = [['Inhalá', 4000], ['Sostené', 2000], ['Exhalá', 4000]];
  let i = 0;
  const tick = () => { b.textContent = fases[i][0]; const dur = fases[i][1]; i = (i+1) % fases.length; setTimeout(tick, dur); };
  tick();
}

/* Catálogo */
function initCatalogo() {
  const grid = document.getElementById('grid'); if (!grid) return;
  const st = { q: '', categoria: qs.get('cat') || '', orden: '' };
  const PAGE = 12; let shown = PAGE;
  const buscar = document.getElementById('buscar'), chips = document.getElementById('chips'), orden = document.getElementById('orden');
  const count = document.getElementById('count'), limpiar = document.getElementById('limpiar'), verMas = document.getElementById('verMas');
  if (chips) chips.innerHTML = '<button class="chip" data-cat="">Todo</button>' + CATEGORIAS.map(c=>'<button class="chip" data-cat="'+c.id+'">'+esc(c.label)+'</button>').join('');
  function syncChips() { chips && chips.querySelectorAll('.chip').forEach(ch => ch.classList.toggle('on', (ch.dataset.cat||'')===st.categoria)); }
  function render() {
    const res = filtrarProductos(st);
    if (count) count.textContent = res.length + (res.length===1?' producto':' productos');
    if (!res.length) { grid.innerHTML = '<div class="empty"><h3>No encontramos productos con esos criterios</h3><button class="btn btn-ghost" id="ec">Limpiar filtros</button></div>'; grid.querySelector('#ec').addEventListener('click', clearAll); if (verMas) verMas.hidden = true; return; }
    const vis = res.slice(0, shown);
    grid.innerHTML = vis.map((p,i)=>cardHTML(p,i)).join(''); wireCards(grid);
    grid.querySelectorAll('[data-animate]').forEach((el,i)=>{ el.style.transitionDelay = Math.min(i,8)*0.05+'s'; requestAnimationFrame(()=>el.classList.add('in')); });
    if (verMas) verMas.hidden = res.length <= shown;
  }
  function clearAll() { st.q=''; st.categoria=''; st.orden=''; shown=PAGE; if (buscar) buscar.value=''; if (orden) orden.value=''; syncChips(); render(); }
  if (buscar) buscar.addEventListener('input', () => { st.q = buscar.value; shown = PAGE; render(); });
  if (chips) chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; st.categoria = b.dataset.cat||''; shown = PAGE; syncChips(); render(); });
  if (orden) orden.addEventListener('change', () => { st.orden = orden.value; render(); });
  if (limpiar) limpiar.addEventListener('click', clearAll);
  if (verMas) verMas.addEventListener('click', () => { shown += PAGE; render(); });
  const fb = document.getElementById('filtrosToggle'), fp = document.getElementById('filtrosPanel');
  if (fb && fp) fb.addEventListener('click', () => { const o = fp.classList.toggle('open'); fb.setAttribute('aria-expanded', o); });
  syncChips(); render();
}

/* Producto */
function initProducto() {
  const cont = document.getElementById('prod'); if (!cont) return;
  const p = getProducto(qs.get('id'));
  document.getElementById('prodLoading')?.remove();
  if (!p) { cont.innerHTML = '<div class="empty wrap"><h3>Producto no encontrado</h3><a class="btn btn-cta" href="'+BASE+'catalogo.html">Volver a la tienda</a></div>'; return; }
  document.title = p.nombre + ' — Compasivamente';
  const pf = precioFinal(p), sinStock = p.stock<=0, wished = Wishlist.has(p.id);
  const precio = p.descuento>0 ? '<div class="pd-precio"><s>'+formatPrecio(p.precio)+'</s><strong>'+formatPrecio(pf)+'</strong><span class="pd-off">-'+p.descuento+'%</span></div>' : '<div class="pd-precio"><strong>'+formatPrecio(pf)+'</strong></div>';
  const stockTxt = sinStock ? '<span class="pd-stock sin">Sin stock por ahora</span>' : (p.stock<=5 ? '<span class="pd-stock low">Últimas '+p.stock+' unidades</span>' : '<span class="pd-stock">En stock</span>');
  cont.innerHTML =
    '<nav class="crumbs wrap" aria-label="Ruta"><a href="'+BASE+'index.html">Inicio</a> / <a href="'+BASE+'catalogo.html">Tienda</a> / <span>'+esc(p.nombre)+'</span></nav>'+
    '<div class="pd-top wrap"><div class="pd-media" data-animate><img src="'+IMG(p.img)+'" alt="'+esc(p.nombre)+'" width="1200" height="1200"></div>'+
    '<div class="pd-info"><span class="eyebrow">'+esc(getCategoria(p.categoria))+'</span><h1 data-animate>'+esc(p.nombre)+'</h1>'+
    stockTxt + precio +
    '<p class="pd-desc" data-animate>'+esc(p.descripcion)+'</p>'+
    (sinStock ? '<button class="btn btn-ghost btn-lg" disabled>Sin stock</button>' :
    '<div class="pd-buy" data-animate><div class="qty" data-qty><button data-minus aria-label="Restar">–</button><span data-val>1</span><button data-plus aria-label="Sumar">+</button></div>'+
    '<button class="btn btn-cta btn-lg" data-add="'+p.id+'">Agregar al carrito</button><button class="btn btn-ghost btn-lg" data-buy="'+p.id+'">Comprar ahora</button></div>')+
    '<button class="pd-wish'+(wished?' on':'')+'" data-wish="'+p.id+'"><svg viewBox="0 0 24 24" fill="'+(wished?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 3.5C19 16.65 12 21 12 21Z"/></svg> '+(wished?'Guardado':'Guardar en favoritos')+'</button>'+
    '</div></div>'+
    '<section class="pd-rel wrap"><h2 data-animate>También para vos</h2><div class="p-grid">'+relacionados(p)+'</div></section>';
  wireCards(cont);
  cont.querySelector('.pd-wish')?.addEventListener('click', e => { const btn = e.currentTarget; const on = Wishlist.toggle(p.id); btn.classList.toggle('on', on); btn.querySelector('svg').setAttribute('fill', on?'currentColor':'none'); btn.lastChild.textContent = ' '+(on?'Guardado':'Guardar en favoritos'); });
  initReveal(); initStickyBuy(p);
}
function relacionados(p) {
  const rel = PRODUCTOS.filter(x => x.id!==p.id && x.categoria===p.categoria).slice(0,3);
  const list = rel.length ? rel : PRODUCTOS.filter(x=>x.id!==p.id).slice(0,3);
  return list.map((x,i)=>cardHTML(x,i)).join('');
}
function initStickyBuy(p) {
  const bar = document.getElementById('stickyBuy'); if (!bar || p.stock<=0) return;
  bar.querySelector('.sb-precio').textContent = formatPrecio(precioFinal(p));
  bar.querySelector('.sb-add').addEventListener('click', () => { Cart.add(p, 1); showToast('Sumado a tu carrito'); });
  const anchor = document.querySelector('.pd-buy');
  if (anchor && 'IntersectionObserver' in window) { const io = new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { rootMargin: '0px 0px -20% 0px' }); io.observe(anchor); }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav(); initCart(); syncBadges();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'catalogo') initCatalogo();
  if (page === 'producto') initProducto();
  initReveal();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});
