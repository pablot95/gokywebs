/* ============ KOKETA — núcleo compartido ============ */
const BASE = location.pathname.includes('/producto/') ? '../' : '';
const WA = '5493743480022';

const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento/100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);

/* "Mi pedido": lista de intención de compra, sin pago online — el CTA final abre WhatsApp */
const Pedido = {
  KEY:'koketa_pedido',
  get(){ try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items){ localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('pedido:updated')); },
  add(producto, qty=1){
    const items = this.get();
    const ex = items.find(i => i.id === producto.id);
    if (ex) ex.qty = Math.min(ex.qty + qty, 20);
    else items.push({ id:producto.id, qty:Math.min(qty,20) });
    this.save(items);
  },
  setQty(id, qty){ const items=this.get(); const it=items.find(i=>i.id===id); if(!it) return;
    it.qty = Math.max(1, Math.min(qty,20)); this.save(items); },
  remove(id){ this.save(this.get().filter(i => i.id !== id)); },
  clear(){ this.save([]); },
  count(){ return this.get().reduce((s,i)=>s+i.qty,0); },
  total(){ return this.get().reduce((s,i)=>{ const p=getProducto(i.id); return p?s+precioFinal(p)*i.qty:s; },0); }
};

function mensajeWA(items){
  const l=items.map(i=>{const p=getProducto(i.id);return p?`• ${i.qty}x ${p.nombre} (${formatearPrecio(precioFinal(p))})`:'';}).filter(Boolean);
  const total=items.reduce((s,i)=>{const p=getProducto(i.id);return p?s+precioFinal(p)*i.qty:s;},0);
  return `Hola KOKETA! Quiero consultar por:\n${l.join('\n')}\n\nTotal aprox: ${formatearPrecio(total)}`;
}

/* ---------- Toast ---------- */
function showToast(msg){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){ wrap=document.createElement('div'); wrap.className='toast-wrap'; wrap.setAttribute('aria-live','polite'); document.body.appendChild(wrap); }
  const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status');
  t.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.classList.add('hiding'); setTimeout(()=>t.remove(),220); },3000);
}

/* ---------- Card de producto (HTML compartido) ---------- */
function cardHTML(p){
  const fin = precioFinal(p), off = p.descuento > 0;
  const cat = getCategoria(p.cat)?.nombre || '';
  return `<article class="card" data-id="${p.id}">
    <a class="card-media" href="${BASE}producto/index.html?id=${p.id}" aria-label="${esc(p.nombre)}">
      <div class="card-badges">
        ${p.destacado?'<span class="badge">Elegida</span>':''}
        ${off?`<span class="badge badge--off">-${p.descuento}%</span>`:''}
      </div>
      <img src="${BASE}images/${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
    </a>
    <div class="card-body">
      <span class="card-cat">${esc(cat)}</span>
      <a class="card-name" href="${BASE}producto/index.html?id=${p.id}">${esc(p.nombre)}</a>
      <div class="card-price">
        <strong>${formatearPrecio(fin)}</strong>
        ${off?`<s>${formatearPrecio(p.precio)}</s>`:''}
      </div>
    </div>
    <div class="card-actions">
      <div class="card-row">
        <button class="btn btn-dark" data-add="${p.id}">Agregar</button>
        <button class="btn btn-lima" data-pedir="${p.id}">Pedir por WhatsApp</button>
      </div>
    </div>
  </article>`;
}

/* Delegación global: agregar a mi pedido / pedir directo por WhatsApp */
document.addEventListener('click', e=>{
  const add = e.target.closest('[data-add]');
  const pedir = e.target.closest('[data-pedir]');
  if(add){ const p=getProducto(+add.dataset.add); if(p){ Pedido.add(p,1); showToast('Agregado a tu pedido'); } }
  if(pedir){
    const p=getProducto(+pedir.dataset.pedir);
    if(p){
      Pedido.add(p,1);
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(mensajeWA([{id:p.id,qty:1}]))}`,'_blank','noopener');
    }
  }
});

/* ---------- Drawer "Mi pedido" ---------- */
const overlay = document.getElementById('drawer-overlay');
const drawer  = document.getElementById('pedido-drawer');
let drawerLastFocus = null;

function openDrawer(){
  if(!drawer) return;
  drawerLastFocus = document.activeElement;
  overlay.hidden=false; drawer.hidden=false;
  requestAnimationFrame(()=>{ overlay.classList.add('open'); drawer.classList.add('open'); });
  window.lenis?.stop();
  document.getElementById('pedido-close')?.focus();
  document.addEventListener('keydown', drawerKeys);
}
function closeDrawer(){
  if(!drawer) return;
  overlay.classList.remove('open'); drawer.classList.remove('open');
  window.lenis?.start();
  document.removeEventListener('keydown', drawerKeys);
  setTimeout(()=>{ overlay.hidden=true; drawer.hidden=true; }, 380);
  drawerLastFocus?.focus();
}
function drawerKeys(e){
  if(e.key==='Escape'){ closeDrawer(); return; }
  if(e.key==='Tab'){
    const f = drawer.querySelectorAll('button,a[href],input,[tabindex]:not([tabindex="-1"])');
    if(!f.length) return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  }
}

function renderDrawer(){
  const body=document.getElementById('drawer-body');
  const foot=document.getElementById('drawer-foot');
  if(!body) return;
  const items=Pedido.get();
  if(!items.length){
    body.innerHTML=`<div class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <p>Todavía no armaste tu pedido.<br>Mirá el catálogo y elegí lo que te guste.</p>
      <a class="btn btn-cta" href="${BASE}catalogo.html">Ver catálogo</a></div>`;
    foot.innerHTML='';
    return;
  }
  body.innerHTML=items.map(i=>{
    const p=getProducto(i.id); if(!p) return '';
    return `<div class="ci">
      <img src="${BASE}images/${p.img}" alt="${esc(p.nombre)}" width="64" height="64">
      <div class="ci-info">
        <span class="ci-name">${esc(p.nombre)}</span>
        <span class="ci-price">${formatearPrecio(precioFinal(p))}</span>
        <div class="qty" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
          <button data-dec="${p.id}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button data-inc="${p.id}" aria-label="Sumar">+</button>
        </div>
      </div>
      <button class="ci-del" data-del="${p.id}">Quitar</button>
    </div>`;
  }).join('');

  const total=Pedido.total();
  foot.innerHTML=`<div class="drawer-total"><span>Total aprox.</span><strong>${formatearPrecio(total)}</strong></div>
    <a class="btn btn-cta" href="https://wa.me/${WA}?text=${encodeURIComponent(mensajeWA(items))}" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>`;
}

document.addEventListener('click', e=>{
  if(e.target.closest('#pedido-open')) openDrawer();
  if(e.target.closest('#pedido-close')) closeDrawer();
  if(e.target===overlay) closeDrawer();
  const inc=e.target.closest('[data-inc]'), dec=e.target.closest('[data-dec]'), del=e.target.closest('[data-del]');
  if(inc){ const p=getProducto(+inc.dataset.inc); Pedido.setQty(p.id,(Pedido.get().find(i=>i.id===p.id)?.qty||1)+1); }
  if(dec){ const p=getProducto(+dec.dataset.dec); const q=(Pedido.get().find(i=>i.id===p.id)?.qty||1)-1; q<1?Pedido.remove(p.id):Pedido.setQty(p.id,q); }
  if(del){ Pedido.remove(+del.dataset.del); }
});

function syncPedidoUI(){
  const badge=document.getElementById('pedido-badge');
  if(badge){ const c=Pedido.count(); badge.textContent=c; badge.classList.remove('bump'); if(c) void badge.offsetWidth, badge.classList.add('bump'); }
  renderDrawer();
}
document.addEventListener('pedido:updated', syncPedidoUI);

/* ---------- Menú mobile ---------- */
(function(){
  const t=document.getElementById('menu-toggle'), nav=document.getElementById('nav');
  if(!t||!nav) return;
  t.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    t.setAttribute('aria-expanded',open);
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open'); t.setAttribute('aria-expanded','false');
  }));
})();

/* ---------- WhatsApp flotante ---------- */
function initWspFloat(){
  const btn=document.getElementById('wsp-float'); if(!btn) return;
  window.addEventListener('scroll',()=>{
    if(window.scrollY>600) btn.classList.add('visible'); else btn.classList.remove('visible');
  },{passive:true});
}

/* ---------- Contadores ---------- */
function initCounters(){
  const els=document.querySelectorAll('[data-count]'); if(!els.length) return;
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target, end=+el.dataset.count; let t0=null;
      const step=ts=>{ t0=t0||ts; const p=Math.min((ts-t0)/1300,1);
        el.textContent=Math.round(end*(0.5-Math.cos(Math.PI*p)/2)).toLocaleString('es-AR');
        if(p<1) requestAnimationFrame(step); };
      requestAnimationFrame(step); io.unobserve(el);
    });
  },{threshold:.5});
  els.forEach(el=>io.observe(el));
}

/* ---------- Home: tira + destacados + marquee ---------- */
function initHome(){
  const rail=document.getElementById('tira-rail');
  if(rail){
    rail.innerHTML=CATEGORIAS.map((c,i)=>`
      <a class="tira-card" href="catalogo.html?cat=${c.id}" aria-label="${esc(c.nombre)}">
        <img src="images/${c.img}" alt="${esc(c.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
        <span class="tira-num">${String(i+1).padStart(2,'0')}</span>
        <div class="tira-body"><h3>${esc(c.nombre)}</h3><span>${esc(c.desc)}</span></div>
      </a>`).join('');
  }
  const grid=document.getElementById('grid-destacados');
  if(grid){ grid.innerHTML=PRODUCTOS.filter(p=>p.destacado).slice(0,8).map(cardHTML).join(''); }

  const mk=document.getElementById('marquee-track');
  if(mk){
    const items=['Showroom físico en San Martín 1350','Pedís por WhatsApp, sin vueltas','Probate antes de decidir','+1400 seguidoras en Instagram','Stock nuevo cada semana'];
    const row=items.map(t=>`<span>${t}</span>`).join('');
    mk.innerHTML=row+row;
  }
}

/* ---------- Animaciones (GSAP + Lenis + túnel) ---------- */
function initMotion(){
  if(typeof gsap!=='undefined' && typeof ScrollTrigger!=='undefined'){ gsap.registerPlugin(ScrollTrigger); }
  if(typeof gsap==='undefined'){
    document.querySelectorAll('[data-animate]').forEach(el=>{el.style.opacity=1;el.style.transform='none';});
    return;
  }
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(typeof Lenis!=='undefined' && !reduce){
    const lenis=new Lenis(); window.lenis=lenis;
    gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);
    if(typeof ScrollTrigger!=='undefined') lenis.on('scroll',ScrollTrigger.update);
  }
  window.addEventListener('load',()=>{ if(typeof ScrollTrigger!=='undefined') ScrollTrigger.refresh(); });

  gsap.utils.toArray('[data-animate]').forEach(el=>{
    gsap.set(el,{filter:'blur(6px)'});
    gsap.to(el,{opacity:1,y:0,filter:'blur(0px)',duration:1,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 86%'}});
  });

  ScrollTrigger.batch('.destacados .card',{start:'top 88%',onEnter:b=>
    gsap.from(b,{opacity:0,y:52,rotate:-2,duration:.8,stagger:.12,ease:'power3.out',overwrite:true})});
  ScrollTrigger.batch('.tira-card',{start:'top 92%',onEnter:b=>
    gsap.from(b,{opacity:0,y:40,scale:.94,duration:.8,stagger:.1,ease:'power3.out',overwrite:true})});
}

/* ---------- Túnel del hero animado ---------- */
function initHeroTunnel(){
  if(document.body.dataset.hero!=='animado') return;
  const hero=document.getElementById('hero');
  const iframe=document.getElementById('hero-bg');
  const beats=[...document.querySelectorAll('[data-beat]')];
  if(!hero||!beats.length) return;

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';

  if(iframe && iframe.dataset.src) iframe.src=iframe.dataset.src;

  function pushProgress(){
    const rect=hero.getBoundingClientRect();
    const max=hero.offsetHeight-window.innerHeight;
    const p=max>0?Math.min(Math.max(-rect.top/max,0),1):0;
    iframe?.contentWindow?.postMessage({type:'scroll',progress:p},'*');
  }
  window.addEventListener('scroll',pushProgress,{passive:true});
  window.addEventListener('load',pushProgress);
  pushProgress();

  if(!hasGSAP||reduce){
    beats.forEach(b=>b.querySelectorAll('.beat-inner>*,.float-card').forEach(el=>{el.style.opacity=1;el.style.transform='none';}));
    return;
  }

  document.getElementById('hero').classList.add('hero--tunnel');
  const step=1/beats.length;
  const tl=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom bottom',scrub:.6}});

  beats.forEach((beat,i)=>{
    const c=beat.querySelector('.beat-inner');
    const floats=beat.querySelectorAll('.float-card');
    const t0=i*step, last=i===beats.length-1;
    if(i===0){
      tl.to(c,{scale:1.5,duration:step*0.6,ease:'power1.in'},t0+step*0.3)
        .to(c,{autoAlpha:0,duration:step*0.3,ease:'power2.in'},t0+step*0.75);
    } else {
      gsap.set(c,{scale:0.46,autoAlpha:0,transformOrigin:'50% 50%'});
      tl.to(c,{autoAlpha:1,duration:step*0.2},t0)
        .to(c,{scale:1,duration:step*0.4,ease:'power1.in'},t0);
      if(!last) tl.to(c,{scale:1.55,duration:step*0.45,ease:'power1.in'},t0+step)
                  .to(c,{autoAlpha:0,duration:step*0.32},t0+step*1.05);
    }
    floats.forEach((f)=>{
      const near=f.classList.contains('float-near');
      gsap.set(f,{scale:near?0.3:0.5,autoAlpha:0});
      tl.to(f,{autoAlpha:1,duration:step*0.2},t0+0.02)
        .to(f,{scale:near?1.12:1,duration:step*0.5,ease:'power1.in'},t0);
      if(!last) tl.to(f,{scale:near?1.9:1.5,duration:step*0.4,ease:'power1.in'},t0+step)
                  .to(f,{autoAlpha:0,duration:step*0.3},t0+step*1.02);
    });
  });

  ScrollTrigger.create({trigger:hero,start:'bottom bottom',
    onLeave:()=>{ if(iframe) iframe.style.visibility='hidden'; },
    onEnterBack:()=>{ if(iframe) iframe.style.visibility='visible'; }});
}

/* ---------- Flag de las 2 versiones ---------- */
(function(){
  const p=new URLSearchParams(location.search);
  const clasico=p.get('estilo')==='clasico'||location.hash==='#clasica';
  document.body.dataset.hero=clasico?'clasico':'animado';
})();

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year') && (document.getElementById('year').textContent=new Date().getFullYear());
  initHome();
  syncPedidoUI();
  initWspFloat();
  initCounters();
  initMotion();
  initHeroTunnel();
});
