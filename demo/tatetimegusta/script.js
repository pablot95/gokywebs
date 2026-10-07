'use strict';
const WA='5492235298344';
const KEY='tatetimegusta_selection_v1';
const MAX_PUBLIC=100;
const state={products:[],cursor:null,category:'',subcategory:'',query:'',loading:false,generation:0,cart:[],lastFocus:null,modalProduct:null};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=p=>`images/${encodeURIComponent(p.imagen)}`;
function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>el.classList.remove('show'),2700)}
function initModelBarScroll(){const bar=$('.gw-modelos');if(!bar)return;let showTimer=0,frame=0;const update=()=>{frame=0;if(window.scrollY<=8){bar.classList.remove('gw-modelos--scrolling');return}bar.classList.add('gw-modelos--scrolling');clearTimeout(showTimer);showTimer=setTimeout(()=>bar.classList.remove('gw-modelos--scrolling'),120)};addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true})}
async function fetchPage(cursor){const url=new URL('api/productos.php',location.href);url.searchParams.set('limit','16');url.searchParams.set('scope','catalogo');if(state.category)url.searchParams.set('categoria',state.category);if(state.subcategory)url.searchParams.set('subcategoria',state.subcategory);if(state.query)url.searchParams.set('q',state.query);if(cursor)url.searchParams.set('cursor',cursor);const response=await fetch(url,{headers:{Accept:'application/json'}});if(!response.ok)throw Error('No se pudo cargar el catálogo');const data=await response.json();if(!Array.isArray(data.items)||data.items.length>100)throw Error('El servidor excedió el límite de 100');return data}
function productCard(p){return `<article class="product-card reveal"><button class="product-photo" type="button" data-detail="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${img(p)}" alt="${esc(p.nombre)}" loading="lazy"><span class="view">VER ARTÍCULO ↗</span></button><div class="product-text"><small>${esc(p.subcategoria)} · ${esc(p.segmento)}</small><h3>${esc(p.nombre)}</h3><p class="product-price">Modelos, talles y precio a consultar</p><div class="prod-actions"><div class="qty-control"><button type="button" data-qty="minus" aria-label="Restar cantidad">−</button><output>1</output><button type="button" data-qty="plus" aria-label="Sumar cantidad">+</button></div><button class="prod-add" type="button" data-add="${esc(p.id)}">Sumar a mi selección</button></div></div></article>`}
function revealNew(){const nodes=$$('.reveal:not(.in)');if(matchMedia('(prefers-reduced-motion: reduce)').matches){nodes.forEach(n=>n.classList.add('in'));return}const observer=new IntersectionObserver((entries,o)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px 80px 0px'});nodes.forEach(n=>observer.observe(n))}
function renderCatalog(){const grid=$('#catalog-grid');grid.innerHTML=state.products.length?state.products.map(productCard).join(''):`<div class="empty-state"><h3>No encontramos artículos</h3><p>Probá otra palabra o limpiá los filtros.</p><button type="button" data-clear>Ver todos los artículos</button></div>`;$('#catalog-count').textContent=`${state.products.length} ${state.products.length===1?'artículo':'artículos'} ${state.cursor?'y más para explorar':''}`;$('#catalog-more').hidden=!state.cursor||state.loading;$('#clear-filters').hidden=!state.category&&!state.subcategory&&!state.query;revealNew()}
async function loadCatalog(reset=false){if(state.loading)return;const generation=state.generation;if(reset){state.products=[];state.cursor=null;$('#catalog-grid').innerHTML='<div class="catalog-loading">Cargando artículos…</div>';$('#catalog-count').textContent='Cargando artículos…'}state.loading=true;$('#catalog-more').hidden=true;$('#catalog-error').textContent='';try{const data=await fetchPage(reset?null:state.cursor);if(generation!==state.generation)return;state.products.push(...data.items);if(state.products.length>MAX_PUBLIC)state.products.splice(0,state.products.length-MAX_PUBLIC);state.cursor=data.nextCursor;renderCatalog()}catch(e){if(generation===state.generation){$('#catalog-error').textContent='No pudimos cargar los artículos. Intentá de nuevo.';if(!state.products.length)$('#catalog-grid').innerHTML='<div class="empty-state">La tienda no está disponible en este momento.</div>'}}finally{if(generation===state.generation){state.loading=false;$('#catalog-more').hidden=!state.cursor}}}
function resetCatalog(){state.generation++;state.loading=false;loadCatalog(true)}
function syncFilters(){$$('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===state.category));$$('[data-subcategory]').forEach(b=>{b.hidden=!!state.category&&!!b.dataset.dept&&b.dataset.dept!==state.category;b.classList.toggle('active',b.dataset.subcategory===state.subcategory)})}
function clearFilters(){state.category='';state.subcategory='';state.query='';$('#catalog-search').value='';syncFilters();resetCatalog()}
function initCatalog(){
  $$('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;state.subcategory='';syncFilters();resetCatalog()}));
  $$('[data-subcategory]').forEach(button=>button.addEventListener('click',()=>{state.subcategory=button.dataset.subcategory;if(button.dataset.dept)state.category=button.dataset.dept;syncFilters();resetCatalog()}));
  $$('[data-department]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.department;state.subcategory='';syncFilters();resetCatalog();$('#coleccion').scrollIntoView({behavior:'smooth'})}));
  let timer=0;$('#catalog-search').addEventListener('input',e=>{clearTimeout(timer);timer=setTimeout(()=>{state.query=e.target.value.trim();resetCatalog()},250)});
  $('#catalog-more').addEventListener('click',()=>loadCatalog(false));$('#clear-filters').addEventListener('click',clearFilters);
  $('#catalog-grid').addEventListener('click',e=>{const clear=e.target.closest('[data-clear]');if(clear){clearFilters();return}const detail=e.target.closest('[data-detail]');if(detail){const p=state.products.find(x=>x.id===detail.dataset.detail);if(p)openModal(p);return}const qty=e.target.closest('[data-qty]');if(qty){const out=qty.parentElement.querySelector('output');out.value=String(Math.max(1,Math.min(99,Number(out.value)+(qty.dataset.qty==='plus'?1:-1))));return}const add=e.target.closest('[data-add]');if(add){const p=state.products.find(x=>x.id===add.dataset.add);if(p)addToCart(p,Number(add.parentElement.querySelector('output').value)||1)}});
  syncFilters();loadCatalog(true)
}
function readCart(){try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(data)?data.slice(0,50).filter(x=>typeof x.id==='string'&&Number.isInteger(x.qty)&&x.qty>0):[]}catch{return[]}}
function saveCart(){localStorage.setItem(KEY,JSON.stringify(state.cart));renderCart()}
function cartMessage(){return `Hola Tateti, quiero consultar por estos artículos:\n${state.cart.map(x=>`• ${x.nombre} × ${x.qty}`).join('\n')}\n¿Me confirman modelos, precio, talles, disponibilidad, pago y envío?`}
function renderCart(){const count=state.cart.reduce((n,x)=>n+x.qty,0);$$('[data-cart-count]').forEach(el=>el.textContent=count);$('.floating-actions').classList.toggle('visible',window.scrollY>550||count>0);$('#cart-items').innerHTML=state.cart.length?state.cart.map(x=>`<div class="cart-row"><img src="images/${encodeURIComponent(x.imagen)}" alt=""><div><h3>${esc(x.nombre)}</h3><small>Cantidad: ${x.qty}</small></div><button type="button" data-remove="${esc(x.id)}">Quitar</button></div>`).join(''):'<div class="empty-state"><h3>Tu selección está vacía</h3><p>Explorá la tienda y sumá los artículos que te gusten.</p><button type="button" data-cart-close>Volver a la tienda</button></div>';const link=$('#cart-whatsapp');link.href=state.cart.length?`https://wa.me/${WA}?text=${encodeURIComponent(cartMessage())}`:`https://wa.me/${WA}?text=${encodeURIComponent('Hola Tateti, quiero consultar por sus artículos')}`;link.textContent=state.cart.length?'Consultar selección por WhatsApp ↗':'Consultar por WhatsApp ↗'}
function addToCart(p,qty=1){const item=state.cart.find(x=>x.id===p.id);if(item)item.qty=Math.min(99,item.qty+qty);else state.cart.push({id:p.id,nombre:p.nombre,imagen:p.imagen,qty:Math.min(99,qty)});saveCart();notify(`${p.nombre} se sumó a tu selección`)}
function openLayer(el){state.lastFocus=document.activeElement;$('#overlay').hidden=false;el.hidden=false;document.body.classList.add('no-scroll');$('.floating-actions').style.visibility='hidden';const focusable=el.querySelector('button, a');focusable?.focus()}
function closeLayers(){$('#overlay').hidden=true;$('#cart-drawer').hidden=true;$('#product-modal').hidden=true;document.body.classList.remove('no-scroll');$('.floating-actions').style.visibility='';state.lastFocus?.focus()}
function openModal(p){state.modalProduct=p;$('#modal-body').innerHTML=`<div class="modal-layout"><img src="${img(p)}" alt="${esc(p.nombre)}"><div class="modal-info"><span class="eyebrow">${esc(p.categoria)} / ${esc(p.subcategoria)}</span><h2 id="modal-title">${esc(p.nombre)}</h2><p>${esc(p.detalle)}</p><p>Modelo, precio y talles a consultar. Te confirmamos los detalles antes de comprar.</p><div class="prod-actions"><div class="qty-control"><button type="button" data-modal-qty="minus" aria-label="Restar cantidad">−</button><output id="modal-qty">1</output><button type="button" data-modal-qty="plus" aria-label="Sumar cantidad">+</button></div><button class="prod-add" type="button" id="modal-add">Sumar a mi selección</button></div></div></div>`;openLayer($('#product-modal'));const url=new URL(location.href);url.searchParams.set('producto',p.id);history.replaceState(null,'',url)}
function closeModalUrl(){const url=new URL(location.href);url.searchParams.delete('producto');history.replaceState(null,'',url)}
function initDrawers(){
  state.cart=readCart();renderCart();
  addEventListener('scroll',()=>$('.floating-actions').classList.toggle('visible',window.scrollY>550||state.cart.length>0),{passive:true});
  $$('[data-open-cart]').forEach(b=>b.addEventListener('click',()=>openLayer($('#cart-drawer'))));
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>{closeModalUrl();closeLayers()}));
  $('#overlay').addEventListener('click',()=>{closeModalUrl();closeLayers()});
  $('#cart-items').addEventListener('click',e=>{
    const b=e.target.closest('[data-remove]');
    if(b){state.cart=state.cart.filter(x=>x.id!==b.dataset.remove);saveCart()}
    if(e.target.closest('[data-cart-close]')){closeLayers();$('#coleccion').scrollIntoView({behavior:'smooth'})}
  });
  $('#modal-body').addEventListener('click',e=>{
    const b=e.target.closest('[data-modal-qty]');
    if(b){const out=$('#modal-qty');out.value=String(Math.max(1,Math.min(99,Number(out.value)+(b.dataset.modalQty==='plus'?1:-1))))}
    if(e.target.closest('#modal-add')&&state.modalProduct){addToCart(state.modalProduct,Number($('#modal-qty').value)||1);closeModalUrl();closeLayers()}
  });
  addEventListener('keydown',e=>{
    const open=!$('#cart-drawer').hidden?$('#cart-drawer'):!$('#product-modal').hidden?$('#product-modal'):null;
    if(!open)return;
    if(e.key==='Escape'){closeModalUrl();closeLayers()}
    if(e.key==='Tab'){
      const focusables=[...open.querySelectorAll('button:not([disabled]),a[href],input')];
      const first=focusables[0],last=focusables.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
}
function initNav(){const b=$('.menu-toggle'),nav=$('.main-nav');b.addEventListener('click',()=>{const open=nav.classList.toggle('open');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');b.setAttribute('aria-expanded','false')}})}
async function initProductLink(){const id=new URL(location.href).searchParams.get('producto');if(!id)return;const url=new URL('api/productos.php',location.href);url.searchParams.set('limit','1');url.searchParams.set('id',id);try{const response=await fetch(url);if(!response.ok)return;const data=await response.json();if(Array.isArray(data.items)&&data.items[0])openModal(data.items[0])}catch{}}
initModelBarScroll();initNav();initDrawers();initCatalog();initProductLink();revealNew();
