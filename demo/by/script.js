const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1-p.descuento/100)) : p.precio;
const PRODUCTOS = [];
const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
function remember(items){for(const p of items){const index=PRODUCTOS.findIndex(x=>x.id===p.id);if(index>=0)PRODUCTOS[index]=p;else PRODUCTOS.push(p);}while(PRODUCTOS.length>100)PRODUCTOS.shift();}
async function api(params,signal){const response=await fetch('catalog-api.php?'+new URLSearchParams(params),{signal});if(!response.ok)throw new Error('No pudimos cargar los productos. Intentá de nuevo.');const data=await response.json();if(!Array.isArray(data.items)||data.items.length>100)throw new Error('Respuesta de catálogo inválida.');return data;}
function variantStock(p,talle){return p?.variantes?.find(v=>v.talle===talle)?.stock||0;}
const Cart={
 KEY:'by_joyas_cart',
 get(){try{const raw=JSON.parse(localStorage.getItem(this.KEY)||'[]');if(!Array.isArray(raw))return [];return raw.filter(x=>Number.isInteger(x?.id)&&x.id>0&&typeof x.talle==='string'&&x.talle.length<=8&&Number.isInteger(x.qty)&&x.qty>0).slice(0,100).map(x=>({id:x.id,talle:x.talle,qty:Math.min(99,x.qty)}));}catch{return [];}},
 save(items){try{localStorage.setItem(this.KEY,JSON.stringify(items));document.dispatchEvent(new CustomEvent('cart:updated'));}catch{showToast('El navegador no pudo guardar tu carrito. Revisá el almacenamiento.');}},
 add(p,qty=1,talle=''){const stock=variantStock(p,talle);if(!stock)return false;const items=this.get();const line=items.find(x=>x.id===p.id&&x.talle===talle);if(line)line.qty=Math.min(stock,line.qty+Math.max(1,Math.floor(qty)||1));else items.push({id:p.id,talle,qty:Math.min(stock,Math.max(1,Math.floor(qty)||1))});this.save(items);return true;},
 setQty(id,qty,talle){const items=this.get();const line=items.find(x=>x.id===id&&x.talle===talle);if(!line)return;const stock=variantStock(getProducto(id),talle);line.qty=Math.min(stock||1,Math.max(1,Math.floor(qty)||1));this.save(items);},
 remove(id,talle){this.save(this.get().filter(x=>!(x.id===id&&x.talle===talle)));},
 clear(){this.save([]);},count(){return this.get().reduce((sum,x)=>sum+x.qty,0);},
 total(){return this.get().reduce((sum,x)=>sum+(getProducto(x.id)?precioFinal(getProducto(x.id))*x.qty:0),0);}
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
const model=document.body.classList.contains('m2')?2:1;
const catalogUrl=model===2?'catalogo-2.html':'catalogo.html';
const categoryNames={aros:'Aros',collares:'Collares',pulseras:'Pulseras',anillos:'Anillos'};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos=false;
function revelarNuevos(container){if(!revealsListos)return;container.querySelectorAll('[data-animate]').forEach((el,i)=>{el.style.transitionDelay=Math.min(i*.07,.35)+'s';requestAnimationFrame(()=>el.classList.add('in'));});}
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
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function sizeSelect(){return '';}
function card(p){return `<article class="product" data-animate="subir" style="opacity:0;transform:translateY(32px)"><button class="product-photo" type="button" data-detail="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.imagen)}" width="1254" height="1254" alt="${esc(p.nombre)}"><span>Ver detalle ↗</span></button><div class="product-meta"><div class="product-category"><span>${categoryNames[p.categoria]}</span><span>${esc(p.materialNombre)}</span></div><h3><button type="button" data-detail="${p.id}">${esc(p.nombre)}</button></h3><strong>${formatearPrecio(p.precio)}</strong>${sizeSelect(p)}<div class="prod-actions"><div class="stepper"><button type="button" data-step="-1" aria-label="Reducir cantidad">−</button><input type="number" min="1" max="4" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Aumentar cantidad">+</button></div><button class="prod-add" type="button" data-add="${p.id}">Agregar</button></div><button class="buy-now" type="button" data-buy="${p.id}">Comprar ahora ↗</button></div></article>`;}
let modalOrigin=null;
function openDialog(dialog){document.querySelectorAll('dialog[open]').forEach(x=>x.close());modalOrigin=document.activeElement;dialog.showModal();document.body.classList.add('no-scroll');}
function closeDialog(dialog){dialog.close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('no-scroll');modalOrigin?.focus();}
async function showProduct(id){let p=getProducto(id);if(!p){const d=await api({id,limit:1});p=d.items[0];remember(d.items);}if(!p)return;document.getElementById('product-detail').innerHTML=`<div class="detail-photo"><img src="${esc(p.imagen)}" width="1254" height="1254" alt="${esc(p.nombre)}"></div><div class="detail-copy"><span class="eyebrow">${categoryNames[p.categoria]} / ${esc(p.materialNombre)}</span><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><strong class="detail-price">${formatearPrecio(p.precio)}</strong><p class="demo-note">Producto, precio y disponibilidad de muestra. Medidas, talle si corresponde, material y entrega a confirmar antes de comprar.</p>${sizeSelect(p)}<div class="prod-actions"><div class="stepper"><button type="button" data-step="-1" aria-label="Reducir cantidad">−</button><input type="number" min="1" max="4" value="1" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Aumentar cantidad">+</button></div><button class="prod-add" type="button" data-add="${p.id}">Agregar al carrito</button></div><button type="button" class="text-button" data-buy="${p.id}">Comprar ahora ↗</button><a class="text-link" href="https://wa.me/5493855789606?text=${encodeURIComponent('Hola B|Y, quiero consultar por '+p.nombre)}" target="_blank" rel="noopener">Consultá por este producto ↗</a><div class="size-help"><strong>¿Querés conocer los detalles?</strong><p>Consultá las medidas, el talle si corresponde, el material y la disponibilidad de esta joya por WhatsApp.</p></div></div>`;openDialog(document.getElementById('product-dialog'));}
function updateBadges(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=Cart.count());if(Cart.count())document.querySelector('.float-stack')?.classList.add('visible');}
async function renderCart(){const lines=Cart.get();const container=document.getElementById('cart-items');if(!container)return;container.innerHTML='<p>Cargando tu selección…</p>';const products=await Promise.all(lines.map(async line=>getProducto(line.id)||(await api({id:line.id,limit:1})).items[0]));remember(products.filter(Boolean));container.innerHTML=lines.length?lines.map((line,i)=>{const p=products[i];if(!p)return `<p>Un producto ya no está disponible. <button type="button" data-remove="${line.id}" data-size="${esc(line.talle)}">Quitar</button></p>`;return `<article class="cart-line"><img src="${esc(p.imagen)}" width="90" height="90" alt="${esc(p.nombre)}"><div><h3>${esc(p.nombre)}</h3><span>${formatearPrecio(p.precio)} c/u</span><div class="cart-quantity"><button type="button" data-cart-step="${line.id}" data-size="${esc(line.talle)}" data-delta="-1" aria-label="Reducir cantidad">−</button><span>${line.qty}</span><button type="button" data-cart-step="${line.id}" data-size="${esc(line.talle)}" data-delta="1" aria-label="Aumentar cantidad">+</button><button type="button" data-remove="${line.id}" data-size="${esc(line.talle)}" aria-label="Quitar ${esc(p.nombre)}">Quitar</button></div></div></article>`;}).join(''):`<p class="empty-cart">Tu próximo favorito todavía no está acá.</p><a class="button" href="${catalogUrl}">Explorá la colección ↗</a>`;const total=lines.reduce((sum,line,i)=>sum+(products[i]?.precio||0)*line.qty,0);document.getElementById('cart-summary').innerHTML=lines.length?`<div class="cart-total"><span>Total ilustrativo</span><strong>${formatearPrecio(total)}</strong></div><p class="demo-note">Precios y stock de muestra. Las opciones de entrega y pago se confirman con B|Y.</p><button class="button" type="button" id="checkout">Finalizar compra</button><a class="text-link" href="https://wa.me/5493855789606?text=${encodeURIComponent('Hola B|Y, quiero consultar esta selección: '+lines.map((x,i)=>(products[i]?.nombre||'Producto')+' × '+x.qty).join(', '))}" target="_blank" rel="noopener">Consultar mi selección por WhatsApp ↗</a>`:'';}
function safe(action){Promise.resolve().then(action).catch(e=>showToast(e.message||'No pudimos completar la acción.'));}
document.addEventListener('click',async e=>{const el=e.target.closest('button,a');if(!el)return;if(el.matches('[data-step]')){const input=el.parentElement.querySelector('input');input.value=Math.max(1,Math.min(4,(parseInt(input.value)||1)+Number(el.dataset.step)));}if(el.matches('[data-add],[data-buy]')){let p=getProducto(el.dataset.add||el.dataset.buy);if(!p){try{const d=await api({id:el.dataset.add||el.dataset.buy,limit:1});remember(d.items);p=d.items[0];}catch(error){showToast(error.message);return;}}if(!p)return;const input=el.closest('.product-meta,.detail-copy')?.querySelector('input');const talle='Unidad';if(!talle){showToast('Elegí una pieza antes de agregar.');el.closest('.product-meta,.detail-copy')?.querySelector('.size-select')?.focus();return;}if(!Cart.add(p,Math.max(1,Math.min(4,parseInt(input?.value)||1)),talle)){showToast('Esa opción no está disponible.');return;}if(el.dataset.buy){safe(async()=>{openDialog(document.getElementById('cart-dialog'));await renderCart();});}else showToast('Se agregó a tu selección.');}if(el.matches('[data-detail]'))safe(()=>showProduct(Number(el.dataset.detail)));if(el.matches('[data-cart-open]'))safe(async()=>{openDialog(document.getElementById('cart-dialog'));await renderCart();});if(el.matches('[data-remove]')){Cart.remove(Number(el.dataset.remove),el.dataset.size);safe(renderCart);}if(el.matches('[data-cart-step]')){const id=Number(el.dataset.cartStep);const line=Cart.get().find(x=>x.id===id&&x.talle===el.dataset.size);if(line)Cart.setQty(id,line.qty+Number(el.dataset.delta),line.talle);safe(renderCart);}if(el.id==='checkout')showToast('¡Genial! El pago online se activa al pasar la web a producción.');if(el.matches('[data-close]'))closeDialog(el.closest('dialog'));});
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target===d){const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog(d);}});d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('no-scroll');});});
document.addEventListener('cart:updated',updateBadges);
async function initFeatured(){const container=document.getElementById('featured-products');if(!container)return;try{const d=await api({limit:4});remember(d.items);container.innerHTML=d.items.map(card).join('');revelarNuevos(container);}catch(e){container.innerHTML=`<p>${esc(e.message)} <a href="${catalogUrl}">Volvé a intentar desde el catálogo</a></p>`;}}
async function initCatalog(){const container=document.getElementById('catalog-products');if(!container)return;const search=document.getElementById('search'),cat=document.getElementById('category'),order=document.getElementById('order'),material=document.getElementById('material-filter'),more=document.getElementById('load-more'),status=document.getElementById('results-status');const url=new URL(location.href);search.value=(url.searchParams.get('q')||'').slice(0,120);cat.value=categoryNames[url.searchParams.get('cat')]?url.searchParams.get('cat'):'';order.value=['menor','mayor'].includes(url.searchParams.get('orden'))?url.searchParams.get('orden'):'original';material.value=['acero316l','enchapado'].includes(url.searchParams.get('material'))?url.searchParams.get('material'):'';let cursor=null,controller=null,count=0,version=0;async function load(reset){const v=++version;controller?.abort();controller=new AbortController();more.disabled=true;if(reset){cursor=null;count=0;container.innerHTML='<p>Cargando las joyas…</p>';}const params={limit:16,q:search.value,cat:cat.value,orden:order.value,material:material.value};if(cursor)params.cursor=cursor;const state=new URL(location.href);['q','cat','orden','material'].forEach(k=>{if(params[k]&&params[k]!=='original')state.searchParams.set(k,params[k]);else state.searchParams.delete(k);});history.replaceState(null,'',state);try{const d=await api(params,controller.signal);if(v!==version)return;remember(d.items);if(reset)container.innerHTML='';container.insertAdjacentHTML('beforeend',d.items.map(card).join(''));count+=d.items.length;cursor=d.nextCursor;more.hidden=!d.hasMore;status.textContent=count+' productos mostrados'+(d.hasMore?' · Hay más para descubrir':'');if(!count)container.innerHTML='<div class="empty"><h2>No encontramos esa joya.</h2><p>Probá con otra palabra o limpiá los filtros.</p><button type="button" class="text-button" data-reset>Limpiar filtros</button></div>';revelarNuevos(container);if(typeof ScrollTrigger!=='undefined')ScrollTrigger.refresh();}catch(e){if(e.name==='AbortError')return;status.textContent=e.message;if(reset)container.innerHTML='';more.hidden=false;more.textContent='Reintentar';}finally{if(v===version)more.disabled=false;}}let timer;search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>load(true),300);});[cat,order,material].forEach(x=>x.addEventListener('change',()=>load(true)));const reset=()=>{search.value='';cat.value='';material.value='';order.value='original';load(true);};document.getElementById('reset-filters').addEventListener('click',reset);container.addEventListener('click',e=>{if(e.target.closest('[data-reset]'))reset();});more.addEventListener('click',()=>load(false));await load(true);const slug=url.searchParams.get('producto');if(slug){const d=await api({q:slug.replaceAll('-',' '),limit:1});if(d.items[0]?.slug===slug){remember(d.items);showProduct(d.items[0].id);}}}
async function initAdmin(){const table=document.getElementById('admin-products');if(!table)return;let cursor=null,controller=null,request=0;const search=document.getElementById('admin-search'),status=document.getElementById('admin-status'),more=document.getElementById('admin-more');async function load(reset){const token=++request;controller?.abort();controller=new AbortController();if(reset){cursor=null;table.innerHTML='';}more.disabled=true;status.textContent='Cargando productos…';try{const params={limit:100,q:search.value};if(cursor)params.cursor=cursor;const d=await api(params,controller.signal);if(token!==request)return;table.insertAdjacentHTML('beforeend',d.items.map(p=>`<tr><td>${esc(p.nombre)}</td><td>${categoryNames[p.categoria]||''}</td><td>${esc(p.materialNombre||'')}</td><td>${formatearPrecio(p.precio)}</td></tr>`).join(''));cursor=d.nextCursor;more.hidden=!d.hasMore;status.textContent=table.rows.length+' piezas mostradas'+(d.hasMore?' · Usá Ver más para pedir la siguiente página':' · Fin de los resultados');}catch(e){if(e.name!=='AbortError'){status.textContent=e.message;more.hidden=false;}}finally{if(token===request)more.disabled=false;}}document.getElementById('admin-search-form').addEventListener('submit',e=>{e.preventDefault();load(true);});document.getElementById('admin-reset').addEventListener('click',()=>{search.value='';load(true);});more.addEventListener('click',()=>load(false));await load(true);}
function initNav(){const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');if(!toggle||!nav)return;const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');if(!document.querySelector('dialog[open]'))document.body.classList.remove('no-scroll');};toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('no-scroll',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();document.querySelectorAll('.category-menu').forEach(x=>x.open=false);}});document.addEventListener('click',e=>{if(!e.target.closest('.category-menu'))document.querySelectorAll('.category-menu').forEach(x=>x.open=false);});document.querySelectorAll('.category-menu').forEach(el=>{el.addEventListener('mouseenter',()=>{if(innerWidth>800)el.open=true;});el.addEventListener('mouseleave',()=>{if(innerWidth>800)setTimeout(()=>{if(!el.matches(':hover')&&!el.contains(document.activeElement))el.open=false;},120);});});}
if(document.body.dataset.pagina==='admin'){safe(initAdmin);}else{initNav();updateBadges();initReveals();initModelBarScroll();safe(initFeatured);safe(initCatalog);window.addEventListener('scroll',()=>{if(scrollY>600)document.querySelector('.float-stack')?.classList.add('visible');},{passive:true});if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);if(typeof gsap==='undefined')document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('in'));if(typeof ScrollTrigger!=='undefined')window.addEventListener('load',()=>ScrollTrigger.refresh());}
