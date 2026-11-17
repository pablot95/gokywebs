"use strict";
const WHATSAPP_NUMBER = '5491164422702';
const CATEGORIAS = [{id:'remeras',nombre:'Remeras',count:6},{id:'musculosas',nombre:'Musculosas',count:5},{id:'puperas',nombre:'Puperas',count:5},{id:'bermudas',nombre:'Bermudas',count:4}];
const PRODUCTOS = new Map();
const cartProducts = new Map();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isModel2 = document.body.classList.contains('m2');
const catalogUrl = isModel2 ? 'catalogo-2.html' : 'catalogo.html';
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1-p.descuento/100)) : p.precio;
const getProducto = id => PRODUCTOS.get(id) || cartProducts.get(id);
const _normalizar = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let revealsListos=false, activeOverlay=null, previousFocus=null, quickProduct=null, quickQty=1, quickRequest=0, cartRequest=0;
let shippingEstimate=null;
const Cart = {
  KEY:'malhablados_cart',
  get() {
    try {
      const raw=JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(raw)) return [];
      const seen=new Set();
      return raw.slice(0,40).filter(i => {
        if(!i || typeof i.id!=='string' || !/^mh-[a-z0-9-]{1,70}$/.test(i.id) || !['S','M','L','XL'].includes(i.talle) || !Number.isInteger(i.qty) || i.qty<1 || seen.has(i.id+'|'+i.talle)) return false;
        seen.add(i.id+'|'+i.talle);return true;
      }).map(i=>({id:i.id,talle:i.talle,qty:Math.min(i.qty,99)}));
    } catch {return [];}
  },
  save(items) {
    try {localStorage.setItem(this.KEY,JSON.stringify(items));}
    catch {showToast('No pudimos guardar el carrito en este navegador.');return false;}
    shippingEstimate=null;
    document.dispatchEvent(new CustomEvent('cart:updated'));return true;
  },
  add(producto,qty=1,talle='') {
    if(!producto?.variantes.includes(talle) || producto.stock<=0) return false;
    const items=this.get();const existing=items.find(i=>i.id===producto.id && i.talle===talle);
    const available=producto.stock-items.filter(i=>i.id===producto.id).reduce((s,i)=>s+i.qty,0);
    if(available<=0) {showToast('Alcanzaste el stock de muestra de esta prenda.');return false;}
    if(!existing && items.length>=40) {showToast('El carrito admite hasta 40 combinaciones.');return false;}
    const amount=Math.min(Math.max(1,Math.floor(Number(qty)||1)),available);
    if(existing) existing.qty+=amount;else items.push({id:producto.id,talle,qty:amount});
    cartProducts.set(producto.id,producto);return this.save(items);
  },
  setQty(id,qty,talle) {
    const items=this.get(),it=items.find(i=>i.id===id&&i.talle===talle),p=getProducto(id);
    if(!it||!p)return;
    const other=items.filter(i=>i.id===id&&i!==it).reduce((s,i)=>s+i.qty,0);
    it.qty=Math.max(1,Math.min(Math.floor(Number(qty)||1),p.stock-other));this.save(items);
  },
  remove(id,talle){this.save(this.get().filter(i=>!(i.id===id&&i.talle===talle)));},
  clear(){this.save([]);},
  count(){return this.get().reduce((s,i)=>s+i.qty,0);},
  total(){return this.get().reduce((s,i)=>{const p=getProducto(i.id);return p?s+precioFinal(p)*i.qty:s;},0);}
};
function cacheProducts(items) {
  items.forEach(p=>{if(PRODUCTOS.has(p.id))PRODUCTOS.delete(p.id);PRODUCTOS.set(p.id,p);});
  while(PRODUCTOS.size>100)PRODUCTOS.delete(PRODUCTOS.keys().next().value);
}
async function requestProducts(params,signal) {
  const res=await window.fetch('api.php?'+new URLSearchParams(params),{signal,cache:'no-store'});
  if(!res.ok)throw new Error('No pudimos cargar las prendas. Volvé a intentar.');
  const data=await res.json();
  if(!Array.isArray(data.items)||data.items.length>100)throw new Error('La respuesta del catálogo no es válida.');
  cacheProducts(data.items);return data;
}
function refreshScroll(){if(typeof ScrollTrigger!=='undefined')ScrollTrigger.refresh();}
function cardHTML(p,role='subir') {
  return `<article class="product" data-animate="${role}" style="opacity:0;transform:translateY(32px)"><button type="button" class="product-image" data-product="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.imagenes[0])}" width="1024" height="1024" alt="${esc(p.nombre+' '+p.color.toLowerCase())}"><span class="image-label">${esc(p.color)} / ${esc(p.vista)}</span><span class="image-plus" aria-hidden="true">↗</span></button><div class="product-info"><h3><button type="button" data-product="${esc(p.id)}">${esc(p.nombre)}</button></h3><p class="product-price">${formatearPrecio(precioFinal(p))}</p><p class="product-size">${p.stock?esc(p.variantes.join(' · ')):'Sin stock de muestra'}</p><div class="prod-actions"><div class="stepper"><button type="button" data-step="-1" aria-label="Restar cantidad">−</button><output>1</output><button type="button" data-step="1" aria-label="Sumar cantidad">+</button></div><button type="button" class="prod-add" data-add="${esc(p.id)}" ${p.stock?'':'disabled'}>Agregar<span> al carrito</span></button></div><button type="button" class="buy-now" data-buy="${esc(p.id)}" ${p.stock?'':'disabled'}>Comprar ahora ↗</button></div></article>`;
}
function trapFocus(e,container) {
  if(e.key!=='Tab')return;
  const items=[...container.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=items[0],last=items.at(-1);
  if(!first)return;
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
function openOverlay(overlay) {
  if(!overlay)return;
  if(!activeOverlay)previousFocus=document.activeElement;
  else activeOverlay.hidden=true;
  activeOverlay=overlay;overlay.hidden=false;document.body.classList.add('no-scroll');
  document.querySelectorAll('main,.site-header,.site-footer,.gw-modelos,.floats').forEach(el=>el.setAttribute('inert',''));
  overlay.querySelector('button')?.focus();
}
function closeOverlay() {
  quickRequest++;
  if(!activeOverlay)return;
  activeOverlay.hidden=true;activeOverlay=null;document.body.classList.remove('no-scroll');
  document.querySelectorAll('main,.site-header,.site-footer,.gw-modelos,.floats').forEach(el=>el.removeAttribute('inert'));
  if(previousFocus?.isConnected)previousFocus.focus();
}
async function openProduct(id,qty=1,buy=false) {
  const request=++quickRequest;
  let p=getProducto(id);
  try {if(!p)p=(await requestProducts({scope:'lookup',ids:id})).items[0];}
  catch(e){showToast(e.message);return;}
  if(!p||request!==quickRequest)return;
  quickProduct=p;quickQty=qty;
  const modal=document.getElementById('product-modal');
  modal.querySelector('.modal-content').innerHTML=`<div class="quick-gallery"><div class="quick-image"><img id="quick-photo" src="${esc(p.imagenes[0])}" width="1024" height="1024" alt="${esc(p.nombre)}"><p class="missing-view" hidden>La foto de esta vista está pendiente.<br>Consultanos para ver la prenda real.</p></div><div class="view-tabs" aria-label="Vistas de la prenda"><button type="button" data-view="Frente" aria-pressed="${p.vista==='Frente'}">Frente</button><button type="button" data-view="Espalda" aria-pressed="${p.vista==='Espalda'}">Espalda</button></div><p class="small">Imágenes ilustrativas. Falta completar las fotos reales de cada modelo.</p></div><div class="quick-info"><p class="eyebrow">${esc(p.categoria)} / oversize</p><h2>${esc(p.nombre)}</h2><p class="quick-price">${formatearPrecio(precioFinal(p))}</p><p>${esc(p.descripcion)}</p><p>Color: <strong>${esc(p.color)}</strong></p><label for="quick-size">Elegí tu talle</label><select id="quick-size"><option value="">Seleccionar talle</option>${p.variantes.map(s=>`<option value="${s}">${s}</option>`).join('')}</select><p id="size-error" class="error" hidden>Elegí un talle para continuar.</p><p class="availability">${p.stock?'Disponible en la muestra':'Sin stock en la muestra'}</p><div class="quick-purchase"><div class="stepper"><button type="button" data-quick-step="-1" aria-label="Restar cantidad">−</button><output id="quick-qty">${qty}</output><button type="button" data-quick-step="1" aria-label="Sumar cantidad">+</button></div><button type="button" class="btn" id="quick-add" ${p.stock?'':'disabled'}>${buy?'Comprar ahora':'Agregar al carrito'}</button></div><details class="size-guide"><summary>Guía de medidas</summary><p>Medidas ilustrativas de la prenda apoyada, sin estirar. Confirmá el talle antes de comprar.</p><table><caption>${p.categoria==='bermudas'?'Cintura y largo en centímetros':'Ancho y largo en centímetros'}</caption><thead><tr><th>Talle</th><th>${p.categoria==='bermudas'?'Cintura':'Ancho'}</th><th>Largo</th></tr></thead><tbody>${['S','M','L','XL'].map((s,i)=>`<tr><th>${s}</th><td>${(p.categoria==='bermudas'?36:54)+i*3}</td><td>${(p.categoria==='puperas'?42:p.categoria==='bermudas'?46:68)+i*2}</td></tr>`).join('')}</tbody></table></details><p class="small">Precios, medidas y disponibilidad de demostración.</p><a class="text-link" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero consultar por '+p.nombre+' en color '+p.color+'. ¿Me ayudan con el talle y las fotos de frente y espalda?')}" target="_blank" rel="noopener noreferrer">Consultar esta prenda ↗</a></div><div class="related"><h3>Seguí mirando</h3><div id="related-items"></div></div>`;
  modal.querySelector('[role="dialog"]').setAttribute('aria-label',p.nombre);
  document.getElementById('product-schema')?.remove();
  const productSchema=document.createElement('script');productSchema.id='product-schema';productSchema.type='application/ld+json';productSchema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.nombre,description:p.descripcion+' Producto de demostración; precio y disponibilidad a confirmar.',image:p.imagenes.map(src=>new URL(src,location.href).href),brand:{'@type':'Brand',name:'MALHABLADOS'},color:p.color,size:p.variantes,offers:{'@type':'Offer',priceCurrency:'ARS',price:precioFinal(p),availability:'https://schema.org/'+(p.stock?'InStock':'OutOfStock'),url:new URL(catalogUrl+'?producto='+p.slug,location.href).href}});document.head.appendChild(productSchema);
  document.getElementById('quick-add').addEventListener('click',()=>{
    const size=document.getElementById('quick-size');
    document.getElementById('size-error').hidden=!!size.value;
    size.setAttribute('aria-invalid',String(!size.value));
    if(!size.value){size.focus();return;}
    if(Cart.add(p,quickQty,size.value)){showToast('Se agregó '+p.nombre+' · talle '+size.value);if(buy)openCartDrawer();}
  });
  openOverlay(modal);
  try {
    const related=(await requestProducts({scope:'catalog',cat:p.categoria,limit:4})).items.filter(item=>item.id!==p.id).slice(0,3);
    if(quickProduct?.id===p.id && !modal.hidden)document.getElementById('related-items').innerHTML=related.map(item=>`<button type="button" data-product="${esc(item.id)}"><img src="${esc(item.imagenes[0])}" width="100" height="100" alt=""><span>${esc(item.nombre)}<small>${formatearPrecio(item.precio)}</small></span>↗</button>`).join('');
  }catch{document.getElementById('related-items').textContent='Encontrá más prendas en el catálogo.';}
}
async function hydrateCart(){
  const items=Cart.get();if(!items.length){cartProducts.clear();return;}
  const data=await requestProducts({scope:'lookup',ids:[...new Set(items.map(i=>i.id))].join(',')});
  cartProducts.clear();data.items.forEach(p=>cartProducts.set(p.id,p));
  const used=new Map();
  const valid=items.flatMap(i=>{
    const p=cartProducts.get(i.id);if(!p||!p.variantes.includes(i.talle)||p.stock<=0)return [];
    const qty=Math.min(i.qty,p.stock-(used.get(i.id)||0));if(qty<=0)return [];
    used.set(i.id,(used.get(i.id)||0)+qty);return [{...i,qty}];
  });
  if(JSON.stringify(valid)!==JSON.stringify(items))Cart.save(valid);
}
function renderCart(){
  const cont=document.getElementById('cart-items');if(!cont)return;
  const items=Cart.get();
  cont.innerHTML=items.length?items.map(i=>{const p=getProducto(i.id);if(!p)return '';return `<div class="cart-line"><img src="${esc(p.imagenes[0])}" width="96" height="96" alt="${esc(p.nombre)}"><div><h3>${esc(p.nombre)}</h3><p>${esc(p.color)} · talle ${esc(i.talle)}</p><strong>${formatearPrecio(precioFinal(p)*i.qty)}</strong><div class="stepper"><button type="button" data-cart-step="-1" data-key="${esc(i.id)}" data-size="${i.talle}" aria-label="Restar ${esc(p.nombre)}">−</button><output>${i.qty}</output><button type="button" data-cart-step="1" data-key="${esc(i.id)}" data-size="${i.talle}" aria-label="Sumar ${esc(p.nombre)}">+</button></div></div><button type="button" class="icon-btn" data-remove="${esc(i.id)}" data-size="${i.talle}" aria-label="Quitar ${esc(p.nombre)}">×</button></div>`;}).join(''):`<div class="cart-empty"><span aria-hidden="true">[ ]</span><h3>Tu próxima prenda está por acá.</h3><p>Elegí un talle y sumala al carrito.</p><a class="btn" href="${catalogUrl}">Ver colección</a></div>`;
  document.getElementById('cart-summary').hidden=!items.length;
  document.getElementById('cart-total').textContent=formatearPrecio(Cart.total());
  document.getElementById('shipping-result').textContent=shippingEstimate?`Envío ilustrativo: ${formatearPrecio(shippingEstimate.cost)} · peso de cálculo ${shippingEstimate.weight.toFixed(2)} kg. No es una cotización del correo.`:'';
}
async function openCartDrawer(){
  const drawer=document.getElementById('cart-modal');openOverlay(drawer);
  const req=++cartRequest;document.getElementById('cart-items').textContent='Actualizando tu selección…';
  document.getElementById('cart-summary').hidden=true;
  try{await hydrateCart();if(req===cartRequest)renderCart();}
  catch(e){document.getElementById('cart-items').innerHTML=`<p>${esc(e.message)}</p><button type="button" class="btn" data-cart-open>Reintentar</button>`;}
}
function calculateShipping(cp,items){
  if(!/^\d{4}$/.test(cp)||Number(cp)<1000||Number(cp)>9999)throw new Error('Ingresá un código postal de cuatro números, entre 1000 y 9999.');
  if(!items.length)throw new Error('Sumá una prenda para calcular el envío.');
  let weight=0,volume=0;
  for(const i of items){const p=getProducto(i.id);if(!p)throw new Error('Actualizá el carrito antes de calcular.');weight+=p.peso*i.qty;volume+=p.medidas.reduce((a,b)=>a*b,1)*i.qty;}
  const charged=Math.max(weight,volume/5000);
  return {weight:charged,cost:(Number(cp)<2000?5500:8500)+Math.ceil(charged)*900};
}
function updateCartBadge(){
  const n=Cart.count();document.querySelectorAll('[data-cart-count]').forEach(b=>{b.textContent=n;b.hidden=n===0;b.classList.remove('bump');void b.offsetWidth;if(n)b.classList.add('bump');});
}
function initFloats(){
  const wsp=document.getElementById('wsp-float'),cart=document.getElementById('cart-float');let appeared=false;
  const sync=()=>{appeared=appeared||window.scrollY>600;wsp?.classList.toggle('visible',appeared);cart?.classList.toggle('visible',appeared||Cart.count()>0);};
  window.addEventListener('scroll',sync,{passive:true});document.addEventListener('cart:updated',sync);cart?.addEventListener('click',openCartDrawer);sync();
}
function initInteractions(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(b?.hasAttribute('data-close'))closeOverlay();
    if(e.target.classList.contains('overlay'))closeOverlay();
    if(b?.hasAttribute('data-cart-open'))openCartDrawer();
    if(b?.dataset.product)openProduct(b.dataset.product);
    if(b?.dataset.add||b?.dataset.buy){const card=b.closest('.product');openProduct(b.dataset.add||b.dataset.buy,Number(card.querySelector('output').value||1),!!b.dataset.buy);}
    if(b?.dataset.step){const output=b.parentElement.querySelector('output');output.value=Math.max(1,Math.min(99,Number(output.value)+Number(b.dataset.step)));}
    if(b?.dataset.quickStep){quickQty=Math.max(1,Math.min(quickProduct.stock,quickQty+Number(b.dataset.quickStep)));document.getElementById('quick-qty').value=quickQty;}
    if(b?.dataset.cartStep){const i=Cart.get().find(it=>it.id===b.dataset.key&&it.talle===b.dataset.size);if(i)Cart.setQty(i.id,i.qty+Number(b.dataset.cartStep),i.talle);}
    if(b?.dataset.remove)Cart.remove(b.dataset.remove,b.dataset.size);
    if(b?.dataset.view){const available=b.dataset.view===quickProduct.vista;document.getElementById('quick-photo').hidden=!available;document.querySelector('.missing-view').hidden=available;document.querySelectorAll('[data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));}
  });
  document.addEventListener('keydown',e=>{if(activeOverlay){if(e.key==='Escape')closeOverlay();trapFocus(e,activeOverlay);}else if(document.getElementById('mainNav')?.classList.contains('open'))trapFocus(e,document.getElementById('mainNav'));});
  document.addEventListener('cart:updated',()=>{updateCartBadge();if(activeOverlay?.id==='cart-modal')renderCart();});
  document.getElementById('shipping-form')?.addEventListener('submit',e=>{
    e.preventDefault();const cp=document.getElementById('shipping-cp'),error=document.getElementById('shipping-error');
    try{shippingEstimate=calculateShipping(cp.value.trim(),Cart.get());error.hidden=true;cp.setAttribute('aria-invalid','false');renderCart();}
    catch(err){error.textContent=err.message;error.hidden=false;cp.setAttribute('aria-invalid','true');cp.focus();}
  });
  document.getElementById('checkout')?.addEventListener('click',()=>showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',refreshScroll));
}
function initCategories(){
  document.querySelectorAll('[data-categories]').forEach(cont=>{cont.innerHTML=CATEGORIAS.map((c,i)=>`<a href="${catalogUrl}?cat=${c.id}"><span class="category-no">0${i+1}</span>${c.nombre}<span aria-hidden="true">↗</span></a>`).join('');});
  document.querySelectorAll('[data-category-menu]').forEach(cont=>{cont.innerHTML=CATEGORIAS.map(c=>`<a href="${catalogUrl}?cat=${c.id}">${c.nombre}<span>${c.count}</span></a>`).join('')+`<a href="${catalogUrl}">Ver todo el catálogo ↗</a>`;});
  const button=document.getElementById('category-toggle'),panel=document.getElementById('category-menu'),wrap=button?.parentElement;
  if(!button||!panel)return;
  let timer=0;const set=open=>{panel.hidden=!open;button.setAttribute('aria-expanded',String(open));};
  button.addEventListener('click',()=>set(panel.hidden));
  wrap.addEventListener('mouseenter',()=>{if(window.matchMedia('(min-width:769px)').matches){clearTimeout(timer);set(true);}});
  wrap.addEventListener('mouseleave',()=>{if(window.matchMedia('(min-width:769px)').matches)timer=setTimeout(()=>set(false),120);});
  wrap.addEventListener('focusout',e=>{if(!wrap.contains(e.relatedTarget))set(false);});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))set(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){set(false);button.focus();}});
}
async function initFeatured(){
  const grid=document.getElementById('featured');if(!grid)return;
  try{
    const data=await requestProducts({scope:'home',limit:6});grid.innerHTML=data.items.map(p=>cardHTML(p,isModel2?'subir':'der')).join('');
    const rail=document.getElementById('product-rail');
    if(!isModel2){initRailDrag(rail);const prev=document.getElementById('rail-prev'),next=document.getElementById('rail-next');
      const sync=()=>{prev.disabled=rail.scrollLeft<=2;next.disabled=rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-2;};
      prev.addEventListener('click',()=>rail.scrollBy({left:-350,behavior:reduceMotion?'instant':'smooth'}));next.addEventListener('click',()=>rail.scrollBy({left:350,behavior:reduceMotion?'instant':'smooth'}));rail.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);sync();}
  }catch(e){grid.innerHTML=`<p>${esc(e.message)}</p><button type="button" class="btn" id="retry-featured">Reintentar</button>`;document.getElementById('retry-featured')?.addEventListener('click',async()=>{await initFeatured();revelarNuevos(grid);});}
}
function validFilters(params){
  const out={};for(const [key,allowed] of Object.entries({cat:CATEGORIAS.map(c=>c.id),talle:['S','M','L','XL'],color:['Negro','Crudo','Terracota','Arena'],precio:['25000','35000','45000'],stock:['1'],orden:['nombre','precio-asc','precio-desc']}))if(allowed.includes(params.get(key)))out[key]=params.get(key);
  const q=params.get('q')?.trim().slice(0,80);if(q)out.q=q;return out;
}
async function initCatalog(){
  const grid=document.getElementById('catalog-grid');if(!grid)return;
  const form=document.getElementById('filters'),more=document.getElementById('load-more'),counter=document.getElementById('results-count');
  let filters=validFilters(new URLSearchParams(location.search)),cursor=null,controller=null,request=0,busy=false,shown=0;
  for(const [key,value] of Object.entries(filters)){const input=form.elements.namedItem(key);if(input)input.type==='checkbox'?input.checked=true:input.value=value;}
  const load=async reset=>{
    if(busy&&!reset)return;
    if(reset){controller?.abort();cursor=null;shown=0;grid.innerHTML='<div class="catalog-loading" role="status">Buscando tu próxima prenda…</div>';}
    const req=++request;controller=new window.AbortController();busy=true;more.disabled=true;
    try{
      const data=await requestProducts({scope:'catalog',limit:16,...filters,...(!reset&&cursor?{cursor}:{})},controller.signal);
      if(req!==request)return;
      if(reset)grid.innerHTML='';
      grid.insertAdjacentHTML('beforeend',data.items.map(p=>cardHTML(p)).join(''));shown+=data.items.length;cursor=data.nextCursor;
      counter.textContent=`${shown} de ${data.total} prendas`;more.hidden=!cursor;
      document.getElementById('catalog-empty').hidden=data.total!==0;
      const cat=CATEGORIAS.find(c=>c.id===filters.cat);document.getElementById('catalog-heading').textContent=cat?.nombre||'La colección';document.getElementById('breadcrumb-category').textContent=cat?'/ '+cat.nombre:'';
      document.querySelectorAll('[data-category-menu] a').forEach(a=>{a.removeAttribute('aria-current');if(filters.cat&&a.href.includes('cat='+filters.cat))a.setAttribute('aria-current','page');});
      revelarNuevos(grid);refreshScroll();
    }catch(e){if(e.name!=='AbortError'){counter.textContent=e.message;more.hidden=false;more.textContent='Reintentar';if(reset)grid.innerHTML='';}}
    finally{if(req===request){busy=false;more.disabled=false;if(cursor)more.textContent='Ver más prendas';}}
  };
  const update=()=>{filters=validFilters(new URLSearchParams(new window.FormData(form)));const params=new URLSearchParams(filters);window.history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));load(true);};
  let timer=0;form.addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);update();});
  form.addEventListener('change',update);form.elements.namedItem('q').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(update,250);});
  document.querySelectorAll('[data-clear]').forEach(b=>b.addEventListener('click',()=>{form.reset();update();}));
  more.addEventListener('click',()=>load(!cursor));await load(true);
}
async function initAdmin(){
  const list=document.getElementById('admin-products');if(!list)return;
  const more=document.getElementById('admin-more'),form=document.getElementById('admin-search');
  let cursor=null,busy=false,controller=null,request=0,q='',shown=0;
  const load=async reset=>{
    if(busy&&!reset)return;if(reset){controller?.abort();cursor=null;shown=0;list.innerHTML='';PRODUCTOS.clear();}
    const req=++request;controller=new window.AbortController();busy=true;more.disabled=true;
    document.getElementById('admin-status').textContent='Cargando prendas…';
    try{
      const data=await requestProducts({scope:'admin',limit:100,q,...(cursor?{cursor}:{})},controller.signal);if(req!==request)return;
      list.innerHTML=data.items.map(p=>`<article class="admin-product"><img src="${esc(p.imagenes[0])}" width="90" height="90" alt=""><div><h2>${esc(p.nombre)}</h2><p>${esc(p.categoria)} · ${esc(p.color)} · ${esc(p.variantes.join('/'))}</p><p>${formatearPrecio(p.precio)} · stock: ${p.stock}</p><p>${p.peso} kg · ${p.medidas.join(' × ')} cm</p><button type="button" class="text-link" data-product="${esc(p.id)}">Revisar ficha ↗</button></div></article>`).join('');
      shown+=data.items.length;cursor=data.nextCursor;more.hidden=!cursor;document.getElementById('admin-status').textContent=`Página de ${data.items.length} prendas · ${shown} recorridas de ${data.total}.`;
    }catch(e){if(e.name!=='AbortError'){document.getElementById('admin-status').textContent=e.message;more.hidden=false;more.textContent='Reintentar';}}
    finally{if(req===request){busy=false;more.disabled=false;}}
  };
  form.addEventListener('submit',e=>{e.preventDefault();q=form.elements.namedItem('q').value.trim().slice(0,80);load(true);});
  more.addEventListener('click',()=>load(!cursor));await load(true);
}
function initBrandSchema(){
  const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'ClothingStore',name:'MALHABLADOS',url:'https://gokywebs.com/demo/malhablados/',telephone:'+54 9 11 6442-2702',image:'https://gokywebs.com/demo/malhablados/images/logo.webp',sameAs:['https://www.instagram.com/malhablados.ar/']});document.head.appendChild(schema);
  const faq=[...document.querySelectorAll('.faq details')].map(el=>({'@type':'Question',name:el.querySelector('summary').textContent,acceptedAnswer:{'@type':'Answer',text:el.querySelector('p').textContent}}));
  if(faq.length){const tag=document.createElement('script');tag.type='application/ld+json';tag.textContent=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq});document.head.appendChild(tag);}
}
async function init(){
  if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);
  if(typeof ScrollTrigger!=='undefined')window.addEventListener('load',()=>ScrollTrigger.refresh());
  initCategories();initNav();initModelBarScroll();initFloats();initInteractions();updateCartBadge();initHeroMotion();initBrandSchema();
  await Promise.allSettled([initFeatured(),initCatalog(),initAdmin()]);
  initReveals();if(typeof gsap==='undefined')document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('in'));
  const slug=new URLSearchParams(location.search).get('producto');
  if(slug&&/^[a-z0-9-]{1,100}$/.test(slug)){try{const p=(await requestProducts({scope:'lookup',slug})).items[0];if(p)openProduct(p.id);}catch{showToast('No pudimos abrir esa prenda. Buscala en el catálogo.');}}
  document.querySelectorAll('.gw-modelos__btn').forEach(a=>{if(document.body.dataset.pagina==='catalogo')a.href=a.getAttribute('href')+location.search;});
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
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { moved = true; } }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { moved = true; }
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

init();
