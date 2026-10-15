document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492944511723';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const ICON_WA = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const FAMILIAS = [
  { id: 'transferencias', nombre: 'Transferencias', desc: 'Transferencias, altas y bajas, sucesiones y juicios de transferencia.', foto: 'images/transferencias.webp', alt: 'Llave de auto, carpeta y formularios de transferencia sobre un escritorio', consulta: 'una transferencia, un alta o baja o una sucesión' },
  { id: 'patentes', nombre: 'Patentes y denuncias', desc: 'Trámites municipales de patentes y denuncias de compra y venta.', foto: 'images/patentes.webp', alt: 'Entrega de la llave de un auto sobre un escritorio con papeles', consulta: 'patentes o una denuncia de compra o venta' },
  { id: 'empresas', nombre: 'Trámites para empresas', desc: 'Gestión para empresas y asociaciones civiles.', foto: 'images/empresas.webp', alt: 'Escritorio de gestoría con carpetas, formularios y una calculadora', consulta: 'un trámite para una empresa o una asociación civil' },
  { id: 'certificados', nombre: 'Certificados y turnos', desc: 'MAVI para maquinaria agraria y vial, certificados de seguridad vehicular y turnos.', foto: 'images/certificados.webp', alt: 'Gestora completando papeles junto a una camioneta, con maquinaria vial atrás', consulta: 'el MAVI, un certificado o un turno' }
];

const TRAMITES = [
  { id: 'transferencia', fam: 'transferencias', titulo: 'Transferencia', texto: 'Pasamos el vehículo a nombre de quien compra, con toda la documentación en regla.', consulta: 'una transferencia', claves: 'transferir transferencia vender vendi venta comprar compre compra cambio titular dueño formulario 08' },
  { id: 'altas-bajas', fam: 'transferencias', titulo: 'Altas y bajas', texto: 'Para aseguradoras y particulares: altas del vehículo y bajas por siniestro, robo o desarme.', consulta: 'un alta o una baja', claves: 'alta baja seguro aseguradora siniestro robo desarme destruccion inscripcion 0km cero kilometro' },
  { id: 'sucesiones', fam: 'transferencias', titulo: 'Sucesiones', texto: 'Vehículos heredados: los inscribimos a nombre de quien corresponda con la orden del juzgado.', consulta: 'una sucesión', claves: 'sucesion herencia heredero herede heredado fallecido declaratoria juzgado' },
  { id: 'juicio', fam: 'transferencias', titulo: 'Juicio de transferencia', texto: 'Cuando quien compró nunca hizo la transferencia: acompañamos el trámite para regularizar la titularidad.', consulta: 'un juicio de transferencia', claves: 'juicio transfirio comprador titularidad regularizar' },
  { id: 'patentes', fam: 'patentes', titulo: 'Patentes municipales', texto: 'Altas, bajas y cambios de radicación de la patente en el municipio, y libre deuda.', consulta: 'la patente municipal', claves: 'patente patentes municipalidad municipio impuesto radicacion libre deuda' },
  { id: 'denuncia-venta', fam: 'patentes', titulo: 'Denuncia de venta', texto: 'Vendiste y el vehículo sigue a tu nombre: la denuncia te desliga de lo que pase con él desde ese día.', consulta: 'una denuncia de venta', claves: 'denuncia venta vendi vender multas responsabilidad' },
  { id: 'denuncia-compra', fam: 'patentes', titulo: 'Denuncia de compra', texto: 'Compraste y quien vendió no aparece para firmar: dejamos constancia de que el vehículo está en tus manos.', consulta: 'una denuncia de compra', claves: 'denuncia compra compre comprar posesion tenencia' },
  { id: 'empresas', fam: 'empresas', titulo: 'Empresas', texto: 'Vehículos a nombre de la empresa: altas, transferencias y la documentación de la sociedad.', consulta: 'un trámite para mi empresa', claves: 'empresa empresas sociedad flota srl comercio' },
  { id: 'asociaciones', fam: 'empresas', titulo: 'Asociaciones civiles', texto: 'Clubes, cooperadoras y entidades: inscribimos y transferimos sus vehículos con la documentación de la asociación.', consulta: 'un trámite para una asociación civil', claves: 'asociacion civil club cooperadora cooperativa entidad fundacion' },
  { id: 'mavi', fam: 'certificados', titulo: 'MAVI', texto: 'Inscripción de maquinaria agrícola, vial e industrial: tractores, cosechadoras, retroexcavadoras y otras máquinas.', consulta: 'el MAVI de una máquina', claves: 'mavi maquinaria maquina tractor cosechadora agricola agraria vial industrial campo retroexcavadora' },
  { id: 'csv', fam: 'certificados', titulo: 'Certificado de seguridad vehicular', texto: 'Lo tramitamos cuando el registro lo pide para inscribir o modificar un vehículo.', consulta: 'un certificado de seguridad vehicular', claves: 'certificado seguridad vehicular csv' },
  { id: 'turnos', fam: 'certificados', titulo: 'Turnos', texto: 'Sacamos y coordinamos los turnos del registro y de la verificación, para que no tengas que hacerlo vos.', consulta: 'un turno', claves: 'turno turnos registro verificacion policial' }
].map((t, i) => ({ ...t, n: i + 1 }));

const STOP = new Set(['auto', 'autos', 'vehiculo', 'vehiculos', 'quiero', 'hacer', 'tramite', 'tramites', 'para', 'como', 'necesito', 'una', 'uno', 'los', 'las', 'del', 'con', 'que', 'por', 'mis', 'tengo', 'camioneta', 'moto']);

const filaHTML = (t, animar) => `<li class="fila" data-id="${t.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : ''}>
  <span class="fila__num">${String(t.n).padStart(2, '0')}</span>
  <div class="fila__txt"><h4 class="fila__titulo">${esc(t.titulo)}</h4><p>${esc(t.texto)}</p></div>
  <a class="fila__cta" href="${waLink(`Hola, quiero consultar por ${t.consulta}.`)}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp: ${esc(t.titulo)}">Consultar ${ICON_WA}</a>
</li>`;

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

function initIndice() {
  const cont = document.getElementById('indice');
  if (!cont) return;
  cont.innerHTML = FAMILIAS.map(f => `<article class="grupo" data-grupo="${f.id}">
    <div class="grupo__lado">
      <figure class="grupo__foto" data-animate="mascara" style="clip-path:inset(100% 0 0 0)"><img src="${f.foto}" alt="${esc(f.alt)}" width="900" height="900"></figure>
      <h3 data-animate="subir" style="opacity:0;transform:translateY(18px)">${esc(f.nombre)}</h3>
      <p data-animate="subir" style="opacity:0;transform:translateY(18px)">${esc(f.desc)}</p>
    </div>
    <ol class="filas">${TRAMITES.filter(t => t.fam === f.id).map(t => filaHTML(t, true)).join('')}</ol>
  </article>`).join('') + `<div class="indice__vacio" id="indiceVacio" hidden>
    <h3>No encontramos «<span id="indiceVacioQ"></span>» en la lista</h3>
    <p>Puede que lo hagamos igual con otro nombre. Escribinos y te decimos.</p>
    <a class="btn btn--negro" id="indiceVacioWa" href="https://wa.me/${WSP}" target="_blank" rel="noopener">${ICON_WA}Preguntar por WhatsApp</a>
  </div>`;
}

function initBuscador() {
  const form = document.getElementById('buscador');
  const input = document.getElementById('buscarTramite');
  const cont = document.getElementById('indice');
  const seccion = document.getElementById('tramites');
  if (!form || !input || !cont) return;
  const estado = document.getElementById('indiceEstado');
  const estadoTxt = document.getElementById('indiceEstadoTxt');
  const limpiar = document.getElementById('indiceLimpiar');
  const vacio = document.getElementById('indiceVacio');
  const vacioQ = document.getElementById('indiceVacioQ');
  const vacioWa = document.getElementById('indiceVacioWa');
  const filas = [...cont.querySelectorAll('.fila')];
  const textos = new Map(filas.map(li => {
    const t = TRAMITES.find(x => x.id === li.dataset.id);
    return [li, norm(`${t?.titulo} ${t?.texto} ${t?.claves}`)];
  }));

  const filtrar = () => {
    const crudo = input.value.trim();
    const palabras = norm(crudo).split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w));
    let total = 0;
    filas.forEach(li => {
      const ok = !palabras.length || palabras.some(w => textos.get(li).includes(w));
      li.hidden = !ok;
      if (ok) total++;
    });
    cont.querySelectorAll('.grupo').forEach(g => { g.hidden = !g.querySelector('.fila:not([hidden])'); });
    const filtrando = palabras.length > 0;
    if (estado) {
      estado.hidden = !filtrando || !total;
      if (estadoTxt) estadoTxt.textContent = `${total} ${total === 1 ? 'trámite coincide' : 'trámites coinciden'} con «${crudo}»`;
    }
    if (vacio) {
      vacio.hidden = total > 0;
      if (vacioQ) vacioQ.textContent = crudo;
      if (vacioWa) vacioWa.href = waLink(`Hola, quiero consultar si hacen este trámite: ${crudo}.`);
    }
    revelarNuevos(cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const irALista = () => seccion?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  input.addEventListener('input', filtrar);
  form.addEventListener('submit', e => { e.preventDefault(); filtrar(); irALista(); });
  form.querySelectorAll('[data-buscar]').forEach(chip => chip.addEventListener('click', () => {
    input.value = chip.dataset.buscar;
    filtrar();
    irALista();
  }));
  limpiar?.addEventListener('click', () => { input.value = ''; filtrar(); });
}

function initFamilias() {
  const dlg = document.getElementById('famDialog');
  const botones = document.querySelectorAll('[data-fam]');
  if (!dlg || !botones.length || typeof dlg.showModal !== 'function') return;
  const foto = document.getElementById('visorFoto');
  const titulo = document.getElementById('visorTitulo');
  const desc = document.getElementById('visorDesc');
  const lista = document.getElementById('visorFilas');
  const wa = document.getElementById('visorWa');
  let origen = null;
  const abrir = id => {
    const f = FAMILIAS.find(x => x.id === id);
    if (!f) return;
    if (foto) { foto.src = f.foto; foto.alt = f.alt; }
    if (titulo) titulo.textContent = f.nombre;
    if (desc) desc.textContent = f.desc;
    if (lista) lista.innerHTML = TRAMITES.filter(t => t.fam === f.id).map(t => filaHTML(t, false)).join('');
    if (wa) wa.href = waLink(`Hola, quiero consultar por ${f.consulta}.`);
    document.body.classList.add('no-scroll');
    dlg.showModal();
    dlg.querySelector('.visor__body')?.scrollTo(0, 0);
  };
  const limpiar = () => {
    if (!document.body.classList.contains('no-scroll')) return;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const cerrar = () => { if (dlg.open) dlg.close(); limpiar(); };
  botones.forEach(b => b.addEventListener('click', () => { origen = b; abrir(b.dataset.fam); }));
  dlg.querySelector('.visor__cerrar')?.addEventListener('click', cerrar);
  dlg.addEventListener('click', e => { if (e.target === dlg) cerrar(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } });
  dlg.addEventListener('close', limpiar);
}

function initForm() {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  const marcar = (campo, msg) => {
    const err = document.getElementById(`${campo.id}Error`);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
    return !msg;
  };
  const { nombre, telefono } = form.elements;
  const validarNombre = () => marcar(nombre, nombre.value.trim().length < 2 ? 'Escribí tu nombre así sabemos a quién responder.' : '');
  const validarTel = () => marcar(telefono, telefono.value.replace(/\D/g, '').length < 10 ? 'Dejanos tu número con código de área, sin el 0 ni el 15.' : '');
  nombre.addEventListener('blur', () => { if (nombre.value) validarNombre(); });
  telefono.addEventListener('blur', () => { if (telefono.value) validarTel(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [validarNombre(), validarTel()].every(Boolean);
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const html = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = html;
      form.reset();
      [nombre, telefono].forEach(c => c.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.buscador, .hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.58)
    .from(hero.querySelectorAll('.hero-nota'), { y: 14, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.78)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.parallax').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initDetalles() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initIndice();
initBuscador();
initFamilias();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initDetalles();
