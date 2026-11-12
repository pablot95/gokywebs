const WHATSAPP_NUMBER = '5493716410741';
const IMAGE_PREFIX = 'images/NEP_y_FP_28_GJrnkv29PV9dIUYiYmLd_';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const COURSE_SEEDS = [
  {id:'lectura',titulo:'Lectura y escritura',categoria:'Aprendizajes',nivel:'Inicial',modalidad:'Virtual',minutos:30,img:'03',descripcion:'Leé textos breves y practicá cómo expresar tus ideas por escrito.',resultado:'Escribir un texto breve con una idea clara y revisar su lectura.',requisito:'Un cuaderno y ganas de leer y escribir.',temas:[['Palabras que cuentan','Reconocer palabras','Leer una escena cotidiana','Relacionar palabras e imágenes'],['Del texto a la idea','Encontrar la idea principal','Ordenar una secuencia','Conversar sobre lo leído'],['Escribir para compartir','Preparar un borrador','Revisar las frases','Compartir una producción']]},
  {id:'matematica',titulo:'Matemática cotidiana',categoria:'Aprendizajes',nivel:'Inicial',modalidad:'Combinada',minutos:45,img:'05',destacado:true,descripcion:'Explorá números, medidas y formas a partir de situaciones de todos los días.',resultado:'Resolver una situación cotidiana usando cantidades y medidas.',requisito:'Lápiz, papel y una regla para las actividades.',temas:[['Números a nuestro alrededor','Leer y comparar cantidades','Sumar en situaciones reales','Estimar antes de calcular'],['Medir y reconocer','Comparar longitudes','Explorar figuras','Registrar medidas'],['Resolver paso a paso','Comprender una consigna','Elegir una estrategia','Explicar el procedimiento']]},
  {id:'digital',titulo:'Primeros pasos digitales',categoria:'Tecnología',nivel:'Inicial',modalidad:'Virtual',minutos:30,img:'06',destacado:true,descripcion:'Conocé herramientas digitales para buscar información y organizar tus tareas.',resultado:'Organizar una carpeta digital y reconocer información útil.',requisito:'Acceso a un teléfono, una tablet o una computadora.',temas:[['Conocer el dispositivo','Explorar sus funciones','Usar el teclado','Organizar la pantalla'],['Buscar con criterio','Hacer una búsqueda','Reconocer una fuente','Cuidar los datos personales'],['Crear y guardar','Escribir una nota','Guardar un archivo','Ordenar una carpeta']]},
  {id:'arte',titulo:'Arte y color',categoria:'Talleres',nivel:'Inicial',modalidad:'Combinada',minutos:45,img:'04',descripcion:'Experimentá con colores y formas para crear una composición propia.',resultado:'Producir una composición y contar las decisiones que tomaste.',requisito:'Papel y los materiales de dibujo que tengas disponibles.',temas:[['Mirar con atención','Reconocer líneas','Explorar formas','Observar una composición'],['Jugar con el color','Combinar colores','Crear contrastes','Probar texturas'],['Crear una imagen','Elegir una idea','Desarrollar la composición','Compartir el proceso']]},
  {id:'relatos',titulo:'Escuchar, leer y contar',categoria:'Aprendizajes',nivel:'Intermedio',modalidad:'Virtual',minutos:30,img:'07',descripcion:'Explorá relatos y practicá formas de narrar una historia con tu propia voz.',resultado:'Preparar un relato breve para compartir con otras personas.',requisito:'Lectura de textos breves y un cuaderno.',temas:[['Escuchar una historia','Identificar personajes','Reconocer lugares','Recordar lo que pasó'],['Leer entre líneas','Relacionar las escenas','Conversar sobre un personaje','Elegir un fragmento'],['Contar con tu voz','Ordenar el relato','Ensayar la narración','Compartir una historia']]},
  {id:'estudio',titulo:'Herramientas para estudiar',categoria:'Tecnología',nivel:'Intermedio',modalidad:'Virtual',minutos:45,img:'01',descripcion:'Organizá tus materiales y construí una rutina de estudio que puedas sostener.',resultado:'Diseñar una guía de estudio con tareas y materiales ordenados.',requisito:'Un cuaderno y un dispositivo para la práctica digital.',temas:[['Preparar el espacio','Ordenar los materiales','Reconocer las tareas','Planificar un momento'],['Trabajar con textos','Elegir palabras clave','Armar un esquema','Organizar apuntes'],['Revisar lo aprendido','Preparar preguntas','Crear una guía digital','Ajustar la planificación']]},
  {id:'papel',titulo:'Crear con papel',categoria:'Talleres',nivel:'Inicial',modalidad:'Combinada',minutos:30,img:'09',descripcion:'Transformá papel y cartulina en producciones con formas, pliegues y texturas.',resultado:'Crear una pieza de papel a partir de una secuencia de pasos.',requisito:'Papel, cartulina y pegamento; tijeras con acompañamiento cuando corresponda.',temas:[['Explorar materiales','Reconocer papeles','Probar pliegues','Combinar texturas'],['Dar forma a una idea','Planificar una pieza','Recortar con cuidado','Unir las partes'],['Presentar la creación','Revisar la estructura','Agregar detalles','Contar cómo la hiciste']]},
  {id:'comunidad',titulo:'Proyectos en comunidad',categoria:'Talleres',nivel:'Intermedio',modalidad:'Combinada',minutos:60,img:'08',descripcion:'Organizá una propuesta colectiva desde una idea hasta su presentación.',resultado:'Preparar un proyecto sencillo con tareas y una presentación compartida.',requisito:'Disposición para trabajar con otras personas.',temas:[['Encontrar una idea','Observar el entorno','Escuchar otras miradas','Elegir un propósito'],['Organizar el trabajo','Definir las tareas','Distribuir responsabilidades','Registrar los acuerdos'],['Compartir el proyecto','Revisar lo preparado','Presentar la propuesta','Pensar el siguiente paso']]}
];
const COURSES = COURSE_SEEDS.map(c => ({...c,slug:c.id,precio:null,descuento:0,docente:'Equipo docente a confirmar',duracion:c.minutos*9/60,cantidadClases:9,portada:IMAGE_PREFIX+c.img+'.webp',modulos:c.temas.map((m,i)=>({id:c.id+'-m'+i,titulo:m[0],clases:m.slice(1).map((titulo,j)=>({id:c.id+'-m'+i+'-c'+j,titulo,duracion:c.minutos,tipo:j===1?'Actividad':'Lectura',preview:false}))}))}));
const normalize = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const durationLabel = c => c.duracion.toLocaleString('es-AR')+' h';
const getCourse = id => COURSES.find(c => c.id === id);
function filterCourses(courses, filters={}) {
  const terms=normalize(filters.q).split(/\s+/).filter(Boolean);
  return courses.filter(c => {
    const text=normalize([c.titulo,c.categoria,c.nivel,c.modalidad,c.docente,c.descripcion].join(' '));
    return terms.every(t=>text.includes(t)) && (!filters.category||c.categoria===filters.category) && (!filters.level||c.nivel===filters.level) && (!filters.mode||c.modalidad===filters.mode) && (!filters.duration || (filters.duration==='short'?c.duracion<=6:c.duracion>6));
  });
}
function sanitizeCart(value) {
  if(!Array.isArray(value))return [];
  return [...new Set(value.filter(x=>x && typeof x.id==='string' && getCourse(x.id)).map(x=>x.id))].map(id=>({id,qty:1}));
}
function selectionMessage(items) {
  const courses=sanitizeCart(items).map(i=>getCourse(i.id));
  return ['Hola NEP y FP n.º 28, quiero consultar por estos cursos de la propuesta virtual:','',...courses.map(c=>'• '+c.titulo+' ('+c.modalidad+')'),'','¿Me confirman cuáles están disponibles, sus requisitos y las condiciones para participar?'].join('\n');
}
const Cart={
  KEY:'nepyfpn28_cart',
  get(){try{return sanitizeCart(JSON.parse(localStorage.getItem(this.KEY)));}catch{return [];}},
  save(items){const safe=sanitizeCart(items);try{localStorage.setItem(this.KEY,JSON.stringify(safe));}catch{this.memory=safe;}if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('cart:updated'));},
  memory:null,
  add(course){if(!course)return;const items=this.current();if(!items.some(i=>i.id===course.id))items.push({id:course.id,qty:1});this.save(items);},
  current(){return this.memory||this.get();},
  remove(id){this.save(this.current().filter(i=>i.id!==id));},
  clear(){this.save([]);},
  count(){return this.current().length;}
};
const reduceMotion=typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let filters={q:'',category:'',level:'',mode:'',duration:''};
let visibleLimit=12;
let lastFocus=null;
function cardHTML(c) {
  return `<article class="course-card" data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="card-surface"><div class="course-image"><img src="${c.portada}" width="1024" height="1024" alt="${esc(c.titulo)}: imagen ilustrativa de materiales de estudio"><span class="category">${esc(c.categoria)}</span><button class="course-add" type="button" data-add="${c.id}" aria-label="Seleccionar ${esc(c.titulo)}" aria-pressed="false">+</button></div><div class="card-copy"><h3>${esc(c.titulo)}</h3><p class="card-meta">${durationLabel(c)} · ${c.nivel} · 9 clases</p><p class="card-teacher">Docente a confirmar</p><button type="button" class="text-link" data-course="${c.id}">Ver curso <span aria-hidden="true">↗</span></button></div></div></article>`;
}
function renderFeatured(){const grid=document.getElementById('featured-grid');if(!grid)return;grid.innerHTML=COURSES.filter(c=>c.destacado).map(c=>`<article data-animate="subir" style="opacity:0;transform:translateY(32px)"><div class="featured-card"><div class="featured-image"><img src="${c.portada}" width="1024" height="1024" alt="${esc(c.titulo)}: materiales ilustrativos"></div><div class="featured-copy"><span class="category">${c.categoria}</span><h3>${c.titulo}</h3><p>${durationLabel(c)} · ${c.nivel} · ${c.modalidad}</p><button class="text-link" type="button" data-course="${c.id}">Conocer el programa <span aria-hidden="true">↗</span></button></div></div></article>`).join('');}
function renderCatalog(){
  const grid=document.getElementById('catalog-grid');if(!grid)return;
  const matches=filterCourses(COURSES,filters);
  grid.innerHTML=matches.slice(0,visibleLimit).map(cardHTML).join('');
  document.getElementById('course-count').textContent=matches.length+' '+(matches.length===1?'curso':'cursos');
  document.getElementById('empty-courses').hidden=matches.length>0;
  document.getElementById('load-more').hidden=matches.length<=visibleLimit;
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===filters.category)));
  updateCourseButtons();revelarNuevos(grid);
}
function clearFilters(){filters={q:'',category:'',level:'',mode:'',duration:''};visibleLimit=12;document.getElementById('course-search').value='';document.getElementById('filter-form').reset();renderCatalog();}
function updateCourseButtons(){const ids=Cart.current().map(i=>i.id);document.querySelectorAll('[data-add]').forEach(b=>{const selected=ids.includes(b.dataset.add);b.setAttribute('aria-pressed',String(selected));b.textContent=b.classList.contains('course-add')?(selected?'✓':'+'):(selected?'Curso seleccionado':'Seleccionar este curso');});}
function renderCart(){
  const target=document.getElementById('cart-items');if(!target)return;
  const items=Cart.current();
  target.innerHTML=items.length?items.map(item=>{const c=getCourse(item.id);return `<article class="cart-item"><img src="${c.portada}" width="64" height="64" alt=""><div><h3>${esc(c.titulo)}</h3><p>${c.modalidad} · Condiciones a consultar</p></div><button type="button" data-remove="${c.id}" aria-label="Quitar ${esc(c.titulo)}">×</button></article>`;}).join(''):'<div class="cart-empty"><h3>Tu próximo aprendizaje empieza acá.</h3><p>Todavía no elegiste cursos. Usá el signo + para reunir los que te interesan.</p><button class="btn" type="button" data-browse>Explorar los cursos</button></div>';
  document.getElementById('cart-summary').hidden=!items.length;
  document.getElementById('cart-whatsapp').href='https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(selectionMessage(items));
  updateCartBadge();updateCourseButtons();
}
function openDialog(id){const el=document.getElementById(id);if(!el)return;lastFocus=document.activeElement;document.querySelectorAll('dialog[open]').forEach(d=>d.close());el.showModal();document.body.classList.add('no-scroll');el.scrollTop=0;el.querySelector('[data-close]')?.focus();}
function closeDialog(el){if(!el)return;el.close();document.body.classList.remove('no-scroll');document.getElementById('filter-toggle')?.setAttribute('aria-expanded','false');if(el.id==='course-dialog'){const url=new URL(location.href);url.searchParams.delete('curso');window.history.replaceState(null,'',url);}lastFocus?.focus();}
function openCartDrawer(){renderCart();openDialog('cart-dialog');}
function openCourse(id){
  const c=getCourse(id);if(!c)return;
  document.getElementById('course-detail').innerHTML=`<div class="detail-top"><div class="detail-photo"><img src="${c.portada}" width="1024" height="1024" alt="${esc(c.titulo)}: imagen ilustrativa"></div><div class="detail-intro"><span class="category">Programa ilustrativo · ${c.categoria}</span><h2>${c.titulo}</h2><p>${c.descripcion}</p><div class="detail-tags">${durationLabel(c)} · ${c.cantidadClases} clases · ${c.nivel} · ${c.modalidad}</div><button type="button" class="btn" data-add="${c.id}" aria-pressed="false">Seleccionar este curso</button><p class="demo-note">Disponibilidad y condiciones a consultar con la escuela.</p></div></div><div class="detail-body"><h3>Lo que podrías practicar</h3><p>${c.resultado}</p><h3>El recorrido, paso a paso</h3><p class="demo-note">Programa de ejemplo. Las clases no se reproducen en esta demostración.</p>${c.modulos.map((m,i)=>`<details class="module"${i===0?' open':''}><summary>${String(i+1).padStart(2,'0')} · ${m.titulo}</summary><ul>${m.clases.map(l=>`<li><span>${l.titulo}</span><span>${l.tipo} · ${l.duracion} min</span></li>`).join('')}</ul></details>`).join('')}<div class="detail-facts"><div><h3>Para empezar</h3><p>${c.requisito}</p></div><div><h3>Materiales propuestos</h3><p>Guías de lectura y consignas de práctica organizadas por módulo. Su disponibilidad se confirmará con la escuela.</p></div></div><h3>Acompañamiento docente</h3><p>Equipo docente a confirmar por NEP y FP n.º 28. Esta propuesta no presenta docentes ficticios ni certificaciones.</p><details class="module"><summary>¿Este curso ya está disponible?</summary><p>Es un ejemplo para mostrar la plataforma. Consultá con la escuela qué propuestas están disponibles y cómo participar.</p></details><details class="module"><summary>¿Necesito conocimientos previos?</summary><p>${c.nivel==='Inicial'?'La propuesta parte de una introducción al tema.':'La propuesta retoma conocimientos iniciales del tema.'} La escuela confirmará los requisitos del curso definitivo.</p></details></div>`;
  updateCourseButtons();openDialog('course-dialog');const url=new URL(location.href);url.searchParams.set('curso',id);window.history.replaceState(null,'',url);
}
function initInteractions(){
  document.getElementById('search-form')?.addEventListener('submit',e=>{e.preventDefault();filters.q=document.getElementById('course-search').value;visibleLimit=12;renderCatalog();});
  document.getElementById('course-search')?.addEventListener('input',e=>{filters.q=e.target.value;visibleLimit=12;renderCatalog();});
  document.getElementById('filter-form')?.addEventListener('submit',e=>{e.preventDefault();filters.level=document.getElementById('filter-level').value;filters.mode=document.getElementById('filter-mode').value;filters.duration=document.getElementById('filter-duration').value;visibleLimit=12;renderCatalog();closeDialog(document.getElementById('filter-dialog'));});
  document.getElementById('clear-filters')?.addEventListener('click',clearFilters);
  document.getElementById('load-more')?.addEventListener('click',()=>{visibleLimit+=12;renderCatalog();});
  document.getElementById('filter-toggle')?.addEventListener('click',e=>{e.currentTarget.setAttribute('aria-expanded','true');openDialog('filter-dialog');});
  document.querySelectorAll('[data-open-cart]').forEach(b=>b.addEventListener('click',openCartDrawer));
  document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);});});
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-category')){filters.category=b.dataset.category;visibleLimit=12;renderCatalog();}
    if(b.dataset.course)openCourse(b.dataset.course);
    if(b.dataset.add){const c=getCourse(b.dataset.add);if(!c)return;const exists=Cart.current().some(i=>i.id===c.id);Cart.add(c);showToast(exists?'Este curso ya está en tu selección.':'Curso sumado. Podés reunir otros antes de consultar.');}
    if(b.dataset.remove){Cart.remove(b.dataset.remove);document.querySelector('#cart-items [data-remove], #cart-items [data-browse], #cart-dialog [data-close]')?.focus();}
    if(b.hasAttribute('data-close'))closeDialog(b.closest('dialog'));
    if(b.hasAttribute('data-clear'))clearFilters();
    if(b.hasAttribute('data-browse')){closeDialog(b.closest('dialog'));document.getElementById('cursos').scrollIntoView();}
  });
  document.addEventListener('cart:updated',renderCart);
  window.addEventListener('storage',e=>{if(e.key===Cart.KEY){Cart.memory=null;renderCart();}});
  const nav=document.getElementById('mainNav');
  document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!nav.classList.contains('open'))return;const focusable=[...nav.querySelectorAll('button,a[href]')].filter(x=>x.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  const syncNavRole=()=>{if(window.innerWidth<=768){nav.setAttribute('role','dialog');nav.setAttribute('aria-modal','true');}else{nav.removeAttribute('role');nav.removeAttribute('aria-modal');nav.classList.remove('open');document.querySelector('.nav-backdrop')?.classList.remove('open');document.getElementById('menuToggle').setAttribute('aria-expanded','false');if(!document.querySelector('dialog[open]'))document.body.classList.remove('no-scroll');}};
  window.addEventListener('resize',syncNavRole);syncNavRole();
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
let revealsListos = false;
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
function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600 || wsp?.classList.contains('visible');
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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
if(typeof document!=='undefined'){
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});
renderFeatured();renderCatalog();renderCart();initReveals();initNav();initInteractions();initFloats();initModelBarScroll();
const requestedCourse=new URLSearchParams(location.search).get('curso');
if(requestedCourse && getCourse(requestedCourse))openCourse(requestedCourse);
}
