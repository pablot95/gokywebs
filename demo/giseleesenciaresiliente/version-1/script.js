const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal(){
  const els = document.querySelectorAll('[data-animate]');
  if(!('IntersectionObserver' in window) || reduce){
    els.forEach(el=>el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')];
        const idx = sibs.indexOf(el);
        el.style.transitionDelay = (idx>0 ? Math.min(idx,5)*0.09 : 0) + 's';
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  },{threshold:0.16,rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
}

function initNav(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mobileNav');
  if(!toggle || !nav) return;
  let backdrop = document.querySelector('.nav-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }
  const close = ()=>{
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    nav.setAttribute('aria-hidden','true');
    toggle.focus();
  };
  const open = ()=>{
    nav.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    nav.setAttribute('aria-hidden','false');
  };
  toggle.addEventListener('click',()=> nav.classList.contains('open') ? close() : open());
  backdrop.addEventListener('click',close);
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && nav.classList.contains('open')) close(); });
}

function initWspFloat(){
  const btn = document.getElementById('wsp-float');
  if(!btn) return;
  window.addEventListener('scroll',()=>{
    if(window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  },{passive:true});
}

function initFirmaParallax(){
  const word = document.getElementById('firmaWord');
  if(!word || reduce) return;
  let ticking = false;
  const move = ()=>{
    const rect = word.getBoundingClientRect();
    const prog = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const x = (prog - 0.5) * 120;
    word.querySelector('span').style.transform = `translateX(${x.toFixed(1)}px)`;
    ticking = false;
  };
  window.addEventListener('scroll',()=>{
    if(!ticking){ requestAnimationFrame(move); ticking = true; }
  },{passive:true});
  move();
}

function showToast(msg){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; wrap.setAttribute('aria-live','polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className='toast';
  toast.setAttribute('role','status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(()=>{ toast.classList.add('hiding'); setTimeout(()=>toast.remove(),220); },3200);
}

document.addEventListener('DOMContentLoaded',()=>{
  initReveal();
  initNav();
  initWspFloat();
  initFirmaParallax();
});
