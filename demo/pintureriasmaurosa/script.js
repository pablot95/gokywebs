const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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

function initGallery(){const dialog=document.getElementById('gallery-dialog');if(!dialog)return;let origin=null;document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{origin=button;document.getElementById('gallery-image').src=button.dataset.gallery;document.getElementById('gallery-image').alt=button.dataset.caption+' · Imagen ilustrativa';document.getElementById('gallery-description').textContent=button.dataset.caption+' · Imagen ilustrativa';dialog.showModal();document.body.classList.add('no-scroll');}));const close=()=>{dialog.close();document.body.classList.remove('no-scroll');origin?.focus();};dialog.querySelector('button').addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close();});}
function initForm(){const form=document.getElementById('contact-form');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const phone=form.elements.telefono;const digits=phone.value.replace(/\D/g,'');phone.setCustomValidity(digits.length>=8&&digits.length<=15?'':'Ingresá un teléfono con código de área.');if(!form.reportValidity())return;const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Enviando…';setTimeout(()=>{showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');form.reset();btn.disabled=false;btn.textContent='Consultar por mi proyecto ↗';},800);});form.elements.telefono.addEventListener('input',e=>e.target.setCustomValidity(''));}
function initMap(){const el=document.getElementById('area-map');if(!el)return;if(typeof L==='undefined'){el.innerHTML='<a href="https://www.openstreetmap.org/#map=12/-34.6037/-58.43" target="_blank" rel="noopener">Ver CABA en el mapa ↗</a>';return;}const map=L.map(el,{scrollWheelZoom:false,dragging:!L.Browser.mobile}).setView([-34.6037,-58.43],11);L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OpenStreetMap &copy; CARTO',maxZoom:19}).addTo(map);L.control.scale({imperial:false}).addTo(map);map.on('click',()=>map.scrollWheelZoom.enable());}
function initWspFloat(){const btn=document.getElementById('wsp-float');if(!btn)return;window.addEventListener('scroll',()=>{if(scrollY>600)btn.classList.add('visible');},{passive:true});}
function initNavTrap(){const nav=document.getElementById('mainNav');if(!nav)return;nav.addEventListener('keydown',e=>{if(e.key!=='Tab'||!nav.classList.contains('open'))return;const items=[...nav.querySelectorAll('a,button')].filter(x=>x.offsetParent);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});}
document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(typeof ScrollTrigger!=='undefined')ScrollTrigger.refresh();}));
if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);
if(typeof gsap==='undefined')document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('in'));
if(typeof ScrollTrigger!=='undefined')window.addEventListener('load',()=>ScrollTrigger.refresh());
initNav();initNavTrap();initGallery();initForm();initMap();initReveals();initModelBarScroll();initWspFloat();
