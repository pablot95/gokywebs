const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROMAN = ['I','II','III','IV'];

function initReveal(){
  const els = document.querySelectorAll('[data-animate]');
  if(!('IntersectionObserver' in window) || reduce){ els.forEach(el=>el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')];
        const idx = sibs.indexOf(el);
        el.style.transitionDelay = (idx>0 ? Math.min(idx,5)*0.08 : 0) + 's';
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
}

function initNav(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mobileNav');
  if(!toggle || !nav) return;
  let backdrop = document.querySelector('.nav-backdrop');
  if(!backdrop){ backdrop = document.createElement('div'); backdrop.className='nav-backdrop'; document.body.appendChild(backdrop); }
  const close = ()=>{ nav.classList.remove('open'); backdrop.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); nav.setAttribute('aria-hidden','true'); toggle.focus(); };
  const open = ()=>{ nav.classList.add('open'); backdrop.classList.add('open'); toggle.setAttribute('aria-expanded','true'); nav.setAttribute('aria-hidden','false'); };
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

function initStickyChapters(){
  const steps = [...document.querySelectorAll('.dist-step')];
  const imgs = [...document.querySelectorAll('.dist-imgs img')];
  const roman = document.getElementById('distRoman');
  if(!steps.length || !imgs.length) return;
  let current = -1;
  const setActive = (p)=>{
    if(p === current) return;
    current = p;
    steps.forEach(s=>s.classList.toggle('active', +s.dataset.p === p));
    imgs.forEach(im=>im.classList.toggle('active', +im.dataset.p === p));
    if(roman) roman.textContent = ROMAN[p] || 'I';
  };
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) setActive(+e.target.dataset.p); });
  },{rootMargin:'-45% 0px -45% 0px',threshold:0});
  steps.forEach(s=>io.observe(s));
  setActive(0);
}

function initFirmaParallax(){
  const word = document.getElementById('firmaWord');
  if(!word || reduce) return;
  let ticking = false;
  const move = ()=>{
    const rect = word.getBoundingClientRect();
    const prog = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    word.querySelector('span').style.transform = `translateX(${((prog-0.5)*-140).toFixed(1)}px)`;
    ticking = false;
  };
  window.addEventListener('scroll',()=>{ if(!ticking){ requestAnimationFrame(move); ticking = true; } },{passive:true});
  move();
}

document.addEventListener('DOMContentLoaded',()=>{
  initReveal();
  initNav();
  initWspFloat();
  initStickyChapters();
  initFirmaParallax();
});
