(() => {
  'use strict';
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
  const cfg = window.DEMO_CONFIG;
  const page = document.body.dataset.page;
  const categories = cfg.categories;
  const cache = new Map();
  const money = n => '$' + Number(n || 0).toLocaleString('es-AR');
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const photo = p => 'images/' + encodeURIComponent(p.image);
  const nameOf = cat => categories[cat] || cat;
  const catalogUrl = document.body.dataset.model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const load = async (view, limit, cursor) => {
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('view', view);
    url.searchParams.set('limit', String(Math.min(100, limit)));
    if (cursor) url.searchParams.set('cursor', cursor);
    const res = await fetch(url, {credentials:'same-origin'});
    if (!res.ok) throw Error('No se pudo cargar el catálogo.');
    const data = await res.json();
    data.items.forEach(p => cache.set(p.id, p));
    return data;
  };
  const one = async id => {
    if (cache.has(id)) return cache.get(id);
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('id', id);
    const res = await fetch(url, {credentials:'same-origin'});
    if (!res.ok) return null;
    const data = await res.json();
    if (data.item) cache.set(id, data.item);
    return data.item || null;
  };

  const menuButton = document.querySelector('[data-menu]');
  menuButton?.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('.main-nav')?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
  }));

  function card(p) {
    const offer = p.oldPrice && p.oldPrice > p.price;
    const discount = offer ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `<article class="product-card"><button class="product-image" type="button" data-product="${safe(p.id)}" aria-label="Ver detalle de ${safe(p.name)}"><img src="${photo(p)}" alt="${safe(p.name)}" loading="lazy" width="450" height="450">${offer ? `<span class="badge">${discount}% OFF</span>` : ''}</button><div class="product-body"><span class="product-cat">${safe(nameOf(p.category))}</span><h3>${safe(p.name)}</h3><p>${safe(p.presentation)}</p><div class="price-row"><strong>${money(p.price)}</strong>${offer ? `<del>${money(p.oldPrice)}</del>` : ''}</div><div class="product-actions"><button type="button" data-product="${safe(p.id)}">Ver detalle</button><button type="button" data-add="${safe(p.id)}">Agregar +</button></div></div></article>`;
  }
  async function initHome() {
    const grid = document.querySelector('[data-featured]');
    if (!grid) return;
    try {
      const data = await load('home',8);
      grid.innerHTML = data.items.map(card).join('') || '<p>Consultanos por WhatsApp por los productos disponibles.</p>';
      const preview = document.querySelector('[data-preview]');
      if (preview) {
        const next = data.nextCursor ? await load('home',8,data.nextCursor) : {items:[]};
        preview.innerHTML = next.items.map(card).join('') || '<p>Muy pronto, más productos para elegir.</p>';
      }
    } catch { grid.innerHTML = '<p>No pudimos cargar los productos. Intentá nuevamente más tarde.</p>'; }
  }

  const catalogState = {cursor:null, hasMore:true, matches:[], shown:0, busy:false, generation:0, q:'', cat:'', offers:false};
  function matches(p,s) {
    return (!s.cat || p.category === s.cat) && (!s.offers || (p.oldPrice && p.oldPrice > p.price)) && (!s.q || norm(p.name+' '+nameOf(p.category)+' '+p.presentation).includes(norm(s.q)));
  }
  async function fill(state, target, view) {
    const generation = state.generation;
    while (state.matches.length < target && state.hasMore && generation === state.generation) {
      const data = await load(view, view === 'admin' ? 10 : 16, state.cursor);
      if (generation !== state.generation) return;
      state.cursor = data.nextCursor;
      state.hasMore = data.hasMore;
      state.matches.push(...data.items.filter(p => matches(p,state)));
    }
  }
  function updateUrl(s) {
    const url = new URL(location.href);
    s.q ? url.searchParams.set('q',s.q) : url.searchParams.delete('q');
    s.cat ? url.searchParams.set('cat',s.cat) : url.searchParams.delete('cat');
    s.offers ? url.searchParams.set('ofertas','1') : url.searchParams.delete('ofertas');
    history.replaceState(null,'',url);
  }
  async function renderCatalog(target) {
    const s = catalogState, grid = document.querySelector('[data-products]');
    const more = document.querySelector('[data-more]');
    more.hidden = true;
    grid.setAttribute('aria-busy','true');
    try {
      await fill(s,target,'catalog');
      s.shown = Math.min(target,s.matches.length);
      grid.innerHTML = s.matches.slice(0,s.shown).map(card).join('') || '<p>No encontramos productos con esos filtros. Probá otra búsqueda.</p>';
      document.querySelector('[data-count]').textContent = `${s.shown} producto${s.shown===1?'':'s'} en pantalla${s.hasMore?' · hay más para explorar':''}`;
      more.hidden = !(s.hasMore || s.shown < s.matches.length);
    } catch { grid.innerHTML = '<p>No pudimos cargar el catálogo. Reintentá en unos segundos.</p>'; more.hidden = false; }
    finally { grid.removeAttribute('aria-busy'); }
  }
  function resetCatalog() {
    const s = catalogState;
    s.cursor=null;s.hasMore=true;s.matches=[];s.shown=0;s.generation++;
    document.querySelectorAll('[data-filter-cat]').forEach(b => b.classList.toggle('active',b.dataset.filterCat===s.cat));
    document.querySelector('[data-filter-offers]')?.classList.toggle('active',s.offers);
    document.querySelector('[data-clear]').hidden = !(s.q||s.cat||s.offers);
    updateUrl(s);
    renderCatalog(16);
  }
  function initCatalog() {
    const params = new URLSearchParams(location.search), s=catalogState;
    s.cat = Object.hasOwn(categories,params.get('cat')) ? params.get('cat') : '';
    s.q = (params.get('q')||'').slice(0,80);
    s.offers = cfg.kind==='bazar' && params.get('ofertas')==='1';
    const field=document.querySelector('[data-search] input');field.value=s.q;
    document.querySelector('[data-search]').addEventListener('submit', ev => {ev.preventDefault();s.q=field.value.trim().slice(0,80);resetCatalog();});
    document.querySelectorAll('[data-filter-cat]').forEach(b => b.addEventListener('click',()=>{s.cat=b.dataset.filterCat;resetCatalog();}));
    document.querySelector('[data-filter-offers]')?.addEventListener('click',()=>{s.offers=!s.offers;resetCatalog();});
    document.querySelector('[data-clear]').addEventListener('click',()=>{s.q='';s.cat='';s.offers=false;field.value='';resetCatalog();});
    document.querySelector('[data-more]').addEventListener('click',()=>renderCatalog(s.shown+16));
    resetCatalog();
  }

  const storageKey = 'goky-cart-'+location.pathname.split('/').filter(Boolean).slice(-2,-1)[0];
  let cart=[];
  try {cart=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(cart))cart=[];}catch{cart=[];}
  const saveCart=()=>{localStorage.setItem(storageKey,JSON.stringify(cart));renderCart();};
  function cartMessage() {
    if (!cart.length) return 'Hola, quisiera consultar por sus productos.';
    let lines=['Hola, quisiera consultar por este pedido de '+cfg.name+':',''];
    cart.forEach(item => lines.push(`• ${item.qty} × ${item.name}${item.variant?' ('+item.variant+')':''} — ${money(item.price*item.qty)}`));
    lines.push('',`Total de muestra: ${money(cart.reduce((n,item)=>n+item.price*item.qty,0))}`,'¿Podrían confirmarme disponibilidad y precio final?');
    return lines.join('\n');
  }
  function renderCart() {
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cart.reduce((n,i)=>n+i.qty,0));
    const host=document.querySelector('[data-cart-items]');if(!host)return;
    host.innerHTML=cart.length?cart.map((item,i)=>`<div class="cart-item"><img src="${safe(item.image)}" alt="" width="70" height="70"><div><strong>${safe(item.name)}</strong><small>${safe(item.variant)} · ${item.qty} × ${money(item.price)}</small><button type="button" data-remove="${i}">Quitar</button></div><strong>${money(item.price*item.qty)}</strong></div>`).join(''):'<p>Tu pedido está vacío. Explorá el catálogo y elegí tus favoritos.</p>';
    document.querySelector('[data-cart-total]').textContent=money(cart.reduce((n,item)=>n+item.qty*item.price,0));
    document.querySelector('[data-checkout]').href='https://wa.me/'+cfg.phone+'?text='+encodeURIComponent(cartMessage());
  }
  function openCart() {document.querySelector('[data-overlay]').hidden=false;document.querySelector('[data-cart]').classList.add('open');document.querySelector('[data-cart]').setAttribute('aria-hidden','false');document.body.classList.add('lock');renderCart();}
  function closeCart() {document.querySelector('[data-cart]').classList.remove('open');document.querySelector('[data-cart]').setAttribute('aria-hidden','true');document.querySelector('[data-overlay]').hidden=true;document.body.classList.remove('lock');}
  function addCart(p,variant,qty=1){
    const key=p.id+'|'+variant, existing=cart.find(i=>i.key===key);
    if(existing)existing.qty+=qty;else cart.push({key,id:p.id,name:p.name,variant,qty,price:p.price,image:photo(p)});
    saveCart();openCart();
  }
  document.querySelector('[data-open-cart]')?.addEventListener('click',openCart);
  document.querySelector('[data-close-cart]')?.addEventListener('click',closeCart);
  document.querySelector('[data-overlay]')?.addEventListener('click',closeCart);

  const dialog=document.querySelector('[data-dialog]');
  async function openProduct(id){
    const p=await one(id);if(!p||!dialog)return;
    const offer=p.oldPrice&&p.oldPrice>p.price;
    dialog.querySelector('[data-dialog-body]').innerHTML=`<div class="detail-grid"><img src="${photo(p)}" alt="${safe(p.name)}" width="700" height="700"><div class="detail-info"><span class="eyebrow">${safe(nameOf(p.category))} · ${safe(cfg.name)}</span><h2>${safe(p.name)}</h2><p>${safe(p.description)}</p><div class="price-row"><strong>${money(p.price)}</strong>${offer?`<del>${money(p.oldPrice)}</del>`:''}</div><label for="detail-variant">${cfg.kind==='pilchitas'?'Elegí el talle':'Presentación'}</label><select id="detail-variant">${p.sizes.map(v=>`<option value="${safe(v)}">${safe(v)}</option>`).join('')}</select><label for="detail-qty">Cantidad</label><div class="detail-buy"><input id="detail-qty" type="number" min="1" max="99" value="1"><button type="button" class="button button-main" data-confirm-add="${safe(p.id)}">Agregar al pedido ↗</button></div><p class="sample">${safe(cfg.note)}</p></div></div>`;
    dialog.showModal();
    const url=new URL(location.href);url.searchParams.set('producto',id);history.replaceState(null,'',url);
  }
  function closeDialog(){if(dialog?.open)dialog.close();const url=new URL(location.href);url.searchParams.delete('producto');history.replaceState(null,'',url);}
  dialog?.querySelector('[data-close-dialog]')?.addEventListener('click',closeDialog);
  dialog?.addEventListener('click',ev=>{if(ev.target===dialog)closeDialog();});
  dialog?.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('producto');history.replaceState(null,'',url);});
  document.addEventListener('click',async ev=>{
    const remove=ev.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);saveCart();return;}
    const view=ev.target.closest('[data-product]');if(view){openProduct(view.dataset.product);return;}
    const add=ev.target.closest('[data-add]');if(add){const p=await one(add.dataset.add);if(p)openProduct(p.id);return;}
    const confirm=ev.target.closest('[data-confirm-add]');if(confirm){const p=await one(confirm.dataset.confirmAdd);if(!p)return;const variant=dialog.querySelector('#detail-variant').value;const qty=Math.min(99,Math.max(1,Number(dialog.querySelector('#detail-qty').value)||1));closeDialog();addCart(p,variant,qty);}
  });
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape')closeCart();});

  function initAdmin(){
    const state={cursor:null,hasMore:true,matches:[],shown:0,busy:false,generation:0,q:'',cat:'',offers:false};
    const list=document.querySelector('[data-admin-list]'),more=document.querySelector('[data-admin-more]'),form=document.querySelector('[data-admin-search]');
    const render=async target=>{
      more.hidden=true;
      try{await fill(state,target,'admin');state.shown=Math.min(target,state.matches.length);
        list.innerHTML=state.matches.slice(0,state.shown).map(p=>`<div class="admin-row"><img src="${photo(p)}" alt="" width="60" height="60"><div><strong>${safe(p.name)}</strong><small>${safe(nameOf(p.category))} · ${p.visible?'Visible':'Oculto'} · ${safe(p.id)}</small></div><strong>${money(p.price)}</strong></div>`).join('')||'<p>No encontramos productos con esa búsqueda.</p>';
        document.querySelector('[data-admin-count]').textContent=`${state.shown} producto${state.shown===1?'':'s'} en pantalla`;
        more.hidden=!(state.hasMore||state.shown<state.matches.length);
      }catch{list.innerHTML='<p>No se pudo cargar la página. Intentá nuevamente.</p>';more.hidden=false;}
    };
    form.addEventListener('submit',ev=>{ev.preventDefault();state.q=form.querySelector('input').value.trim().slice(0,80);state.cursor=null;state.hasMore=true;state.matches=[];state.shown=0;state.generation++;render(10);});
    more.addEventListener('click',()=>render(state.shown+10));
    render(10);
  }
  if(page==='home')initHome();
  if(page==='catalog')initCatalog();
  if(page==='admin')initAdmin();
  if(page!=='admin'){renderCart();const requested=new URLSearchParams(location.search).get('producto');if(requested)openProduct(requested);}
})();
