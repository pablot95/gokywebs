document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493625261952';
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const DOCENTE = {
  nombre: 'Hernan Gonzalez',
  rol: 'Cursos y marketing digital',
  bio: 'Enseña a vender productos digitales con un sistema paso a paso y acompaña a sus alumnos en la comunidad. También trabaja con marcas que necesitan estrategia, redes y publicidad.',
};

const NIVELES = { cero: 'Desde cero', intermedio: 'Intermedio', avanzado: 'Avanzado' };

const m = (titulo, clases) => ({ titulo, clases: clases.map(([t, d, tipo = 'video', preview = false]) => ({ titulo: t, duracion: d, tipo, preview })) });

const CURSOS = [
  {
    id: 'crea-tu-producto', titulo: 'Creá tu primer producto digital', nivel: 'cero', precio: 39000, portada: 'c-producto',
    corta: 'De la idea al producto listo para vender: nicho, formato, contenido y precio.',
    descripcion: 'Elegís qué vender a partir de lo que ya sabés, armás tu producto (ebook, curso o plantilla) y lo dejás publicado en una plataforma para cobrarlo.',
    resultados: ['Un nicho y una idea de producto validada', 'Tu producto armado con una estructura clara', 'Un precio calculado y la página para venderlo'],
    requisitos: ['Una compu o un celular con conexión', 'Ganas de dedicarle unas horas por semana'],
    incluye: ['9 clases en video', 'Checklist descargable', 'Acceso desde cualquier dispositivo'],
    modulos: [
      m('Elegí qué vender', [['Cómo encontrar tu nicho', 18, 'video', true], ['Ideas de producto según lo que sabés', 22], ['Validá antes de crear', 15]]),
      m('Armá tu producto', [['Ebook, curso o plantilla: qué conviene', 24], ['Estructura y contenidos', 28], ['Checklist de producción', 26, 'pdf']]),
      m('Poné el precio y publicalo', [['Cómo calcular tu precio', 20], ['Plataformas para vender y cobrar', 25], ['Tu primera página de producto', 42]]),
    ],
  },
  {
    id: 'vende-en-redes', titulo: 'Vendé por Instagram y WhatsApp', nivel: 'intermedio', precio: 49000, portada: 'c-redes',
    corta: 'Un perfil que vende, contenido que atrae consultas y un cierre por chat sin vueltas.',
    descripcion: 'Ordenás tu perfil, armás un calendario de contenido que genera consultas y aprendés a llevar cada conversación de WhatsApp hasta la venta.',
    resultados: ['Un perfil con una oferta clara', 'Un calendario de contenido para cuatro semanas', 'Un guion de mensajes para cerrar ventas por chat'],
    requisitos: ['Tener definido qué vas a vender (o hacer antes «Creá tu primer producto digital»)'],
    incluye: ['9 clases en video', 'Plantilla de calendario de contenido', 'Acceso desde cualquier dispositivo'],
    modulos: [
      m('Perfil que vende', [['Bio, destacadas y oferta clara', 20], ['Qué publicar cada semana', 26], ['Historias que generan consultas', 24]]),
      m('Contenido que atrae', [['Reels sin complicarte', 28], ['Ganchos y llamados a la acción', 22], ['Calendario de contenido', 18, 'pdf']]),
      m('Cerrar por chat', [['Del mensaje a la venta', 25, 'video', true], ['Respuestas rápidas y etiquetas', 17], ['Seguimiento sin ser invasivo', 20]]),
    ],
  },
  {
    id: 'embudos', titulo: 'Embudos de venta que trabajan por vos', nivel: 'intermedio', precio: 54000, portada: 'c-embudos',
    corta: 'Página de venta, regalo de entrada y automatizaciones para vender todos los días.',
    descripcion: 'Armás el recorrido completo de tu cliente: un regalo gratuito para captar contactos, una página de venta clara y mensajes automáticos que acompañan hasta la compra.',
    resultados: ['Un embudo dibujado de punta a punta', 'Tu página de venta escrita y publicada', 'Una secuencia de mensajes automáticos funcionando'],
    requisitos: ['Un producto digital listo o casi listo'],
    incluye: ['9 clases en video', 'Plantilla de página de venta', 'Acceso desde cualquier dispositivo'],
    modulos: [
      m('El mapa del embudo', [['Qué es un embudo y por qué lo necesitás', 16, 'video', true], ['Tu regalo gratuito para captar contactos', 24], ['De seguidor a comprador', 21]]),
      m('Página de venta', [['Estructura que convence', 30], ['Textos que venden sin exagerar', 27], ['Plantilla de página de venta', 12, 'pdf']]),
      m('Automatizaciones', [['Email de bienvenida y secuencias', 26], ['WhatsApp automatizado', 22], ['Medir y mejorar', 19]]),
    ],
  },
  {
    id: 'meta-ads', titulo: 'Publicidad en Meta Ads para productos digitales', nivel: 'avanzado', precio: 54000, portada: 'c-meta',
    corta: 'Campañas en Instagram y Facebook con un presupuesto que podés controlar.',
    descripcion: 'Configurás tu cuenta publicitaria, lanzás tu primera campaña con públicos y creativos pensados para tu producto, y aprendés a leer las métricas para decidir qué cambiar.',
    resultados: ['Tu cuenta publicitaria y el píxel configurados', 'Una campaña lanzada con su presupuesto', 'Un tablero simple para seguir las métricas'],
    requisitos: ['Un producto ya publicado y una página para enviar el tráfico'],
    incluye: ['9 clases en video', 'Guía de métricas descargable', 'Acceso desde cualquier dispositivo'],
    modulos: [
      m('Antes de invertir', [['Cuenta publicitaria y píxel', 24], ['Objetivos de campaña', 18, 'video', true], ['Presupuesto inicial', 16]]),
      m('Tu primera campaña', [['Públicos que tienen sentido', 26], ['Creativos que frenan el scroll', 28], ['Textos y llamados a la acción', 20]]),
      m('Optimizar', [['Leer las métricas que importan', 25], ['Qué cambiar y cuándo', 22], ['Guía de métricas', 21, 'pdf']]),
    ],
  },
];

const minutos = c => c.modulos.reduce((s, mo) => s + mo.clases.reduce((t, cl) => t + cl.duracion, 0), 0);
const clases = c => c.modulos.reduce((s, mo) => s + mo.clases.length, 0);

const PROGRAMA = {
  id: 'programa-completo', titulo: 'Sistema Productos Digitales: el programa completo', nivel: 'cero', precio: 149000, portada: 'c-programa', programa: true,
  corta: 'Los cuatro cursos en orden, la comunidad de alumnos y acompañamiento en cada paso.',
  descripcion: 'Recorrés el camino completo: creás tu producto, lo mostrás en redes, armás tu embudo y salís a vender con publicidad. Con la comunidad y el acompañamiento para resolver tus dudas mientras avanzás.',
  resultados: ['Tu producto digital creado y publicado', 'Un sistema de contenido, embudo y publicidad para venderlo', 'Una comunidad y acompañamiento para no frenarte'],
  requisitos: ['No hace falta experiencia previa', 'Una compu o un celular con conexión'],
  incluye: ['Los 4 cursos completos', 'Recursos y plantillas descargables', 'Comunidad de alumnos', 'Acompañamiento para tus dudas', 'Acceso inmediato al inscribirte'],
  cursos: CURSOS.map(c => c.id),
  modulos: CURSOS.map(c => ({ titulo: c.titulo, cursoId: c.id, clases: c.modulos.map(mo => ({ titulo: mo.titulo, duracion: mo.clases.reduce((t, cl) => t + cl.duracion, 0), tipo: 'modulo', preview: mo.clases.some(cl => cl.preview) })) })),
};
PROGRAMA.minutos = CURSOS.reduce((s, c) => s + minutos(c), 0);
PROGRAMA.clases = CURSOS.reduce((s, c) => s + clases(c), 0);
PROGRAMA.precioSuelto = CURSOS.reduce((s, c) => s + c.precio, 0);

const TODOS = [PROGRAMA, ...CURSOS];
const getCurso = id => TODOS.find(c => c.id === id);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const duracionTxt = min => { const h = Math.floor(min / 60); const r = min % 60; return h ? `${h} h${r ? ` ${r} min` : ''}` : `${r} min`; };
const minDe = c => c.programa ? c.minutos : minutos(c);
const clasesDe = c => c.programa ? c.clases : clases(c);

const Cart = {
  KEY: 'hernangonzalez_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { void 0; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return 'ya';
    if (!curso.programa && items.some(i => i.id === PROGRAMA.id)) return 'incluido';
    let quitados = 0;
    let lista = items;
    if (curso.programa) { lista = items.filter(i => !PROGRAMA.cursos.includes(i.id)); quitados = items.length - lista.length; }
    lista.push({ id: curso.id, qty: 1 });
    this.save(lista);
    return quitados ? 'reemplazo' : 'ok';
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => s + (getCurso(i.id)?.precio || 0), 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  modulo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
};

const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';

function precioHTML(c) {
  const antes = c.programa ? c.precioSuelto : 0;
  return `<p class="precio">${formatearPrecio(c.precio)}${antes ? `<s>${formatearPrecio(antes)} por separado</s>` : ''}</p>`;
}

function metaHTML(c) {
  return `<p class="curso__meta"><span>${ICON.play}${clasesDe(c)} clases</span><span>${ICON.reloj}${duracionTxt(minDe(c))}</span></p>`;
}

function addBtn(c, clase = 'btn btn--line') {
  return `<button type="button" class="${clase}" data-add="${esc(c.id)}"><span class="add-ico">${ICON.carrito}</span><span class="add-txt">Agregar</span></button>`;
}

function tarjetaHTML(c, animar = true) {
  const anim = animar ? ANIM_SUBIR : '';
  if (c.programa) {
    return `<article class="curso curso--programa" ${anim}>
      <button type="button" class="curso__media" data-ver="${esc(c.id)}" aria-label="Ver el programa: ${esc(c.titulo)}"><span class="recorte"><img src="images/${c.portada}.webp" alt="Notebook con un tablero de ventas y un embudo en pantalla sobre un escritorio" width="960" height="720"></span><span class="curso__badge">Programa completo</span></button>
      <div class="curso__info">
        <p class="curso__nivel">${esc(NIVELES[c.nivel])} · Cursos + comunidad</p>
        <h3 class="curso__titulo"><button type="button" data-ver="${esc(c.id)}">${esc(c.titulo)}</button></h3>
        ${metaHTML(c)}
        <ul class="curso__incluye">${c.incluye.slice(0, 4).map(t => `<li>${ICON.check}${esc(t)}</li>`).join('')}</ul>
        <p class="ahorro">Ahorrás ${formatearPrecio(c.precioSuelto - c.precio)} frente a los cursos por separado</p>
        <div class="curso__pie">${precioHTML(c)}<div class="curso__acciones"><button type="button" class="btn btn--line" data-ver="${esc(c.id)}">Ver el programa</button><button type="button" class="btn btn--cta" data-inscribir="${esc(c.id)}">Inscribirme</button></div></div>
      </div>
    </article>`;
  }
  return `<article class="curso" ${anim}>
    <button type="button" class="curso__media" data-ver="${esc(c.id)}" aria-label="Ver el curso: ${esc(c.titulo)}"><span class="recorte"><img src="images/${c.portada}.webp" alt="${esc(c.titulo)}" width="960" height="720"></span></button>
    <div class="curso__info">
      <p class="curso__nivel">${esc(NIVELES[c.nivel])}</p>
      <h3 class="curso__titulo"><button type="button" data-ver="${esc(c.id)}">${esc(c.titulo)}</button></h3>
      ${metaHTML(c)}
      <p class="curso__docente">Con ${esc(DOCENTE.nombre)}</p>
      <div class="curso__pie">${precioHTML(c)}<div class="curso__acciones"><button type="button" class="btn btn--line" data-ver="${esc(c.id)}">Ver el curso</button>${addBtn(c, 'btn btn--negro')}</div></div>
    </div>
  </article>`;
}

function filaHTML(c, animar = true) {
  return `<article class="fila-curso" ${animar ? ANIM_SUBIR : ''}>
    <button type="button" class="curso__media" data-ver="${esc(c.id)}" aria-label="Ver el curso: ${esc(c.titulo)}"><span class="recorte"><img src="images/${c.portada}.webp" alt="${esc(c.titulo)}" width="960" height="720"></span></button>
    <div class="curso__info">
      <p class="curso__nivel">${esc(NIVELES[c.nivel])}</p>
      <h3 class="curso__titulo"><button type="button" data-ver="${esc(c.id)}">${esc(c.titulo)}</button></h3>
      <p class="curso__docente">${esc(c.corta)}</p>
      ${metaHTML(c)}
    </div>
    <div class="fila-curso__compra">${precioHTML(c)}<div class="curso__acciones"><button type="button" class="btn btn--line" data-ver="${esc(c.id)}">Ver el curso</button>${addBtn(c, 'btn btn--negro')}</div></div>
  </article>`;
}

let nivelActivo = '';
function renderCursos(animar = true) {
  const grid = document.querySelector('[data-cursos]');
  if (!grid) return;
  const lista = (grid.dataset.cursos === 'filas' ? CURSOS : TODOS).filter(c => !nivelActivo || c.nivel === nivelActivo);
  grid.innerHTML = lista.map(c => grid.dataset.cursos === 'filas' ? filaHTML(c, animar) : tarjetaHTML(c, animar)).join('')
    || '<p class="cursos__vacio">No hay cursos de ese nivel por ahora. Probá con otro o escribime y te recomiendo por dónde empezar.</p>';
  const cont = document.querySelector('[data-cursos-contador]');
  if (cont) cont.textContent = `${lista.length} ${lista.length === 1 ? 'opción' : 'opciones'}${nivelActivo ? ` · ${NIVELES[nivelActivo]}` : ''}`;
  syncBotones();
  revelarNuevos(grid);
}

function initFiltro() {
  const chips = document.querySelector('[data-filtro-nivel]');
  if (!chips) return;
  chips.addEventListener('click', ev => {
    const b = ev.target.closest('[data-nivel]');
    if (!b) return;
    nivelActivo = b.dataset.nivel;
    chips.querySelectorAll('[data-nivel]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderCursos(true);
  });
}

function temarioHTML(c, abrirPrimero = true) {
  return c.modulos.map((mo, i) => `<details${abrirPrimero && i === 0 ? ' open' : ''}>
    <summary><span class="temario__n">${String(i + 1).padStart(2, '0')}</span><span class="temario__titulo">${esc(mo.titulo)}</span><span class="temario__dur">${mo.clases.length} ${c.programa ? 'módulos' : 'clases'} · ${duracionTxt(mo.clases.reduce((t, cl) => t + cl.duracion, 0))}</span></summary>
    <ol>${mo.clases.map(cl => `<li>${cl.tipo === 'pdf' ? ICON.pdf : cl.tipo === 'modulo' ? ICON.modulo : ICON.play}<span>${esc(cl.titulo)}${cl.preview ? '<span class="preview">Clase de muestra</span>' : ''}</span><small>${cl.tipo === 'pdf' ? 'PDF' : duracionTxt(cl.duracion)}</small></li>`).join('')}</ol>
  </details>`).join('');
}

function renderTemarios() {
  document.querySelectorAll('[data-temario]').forEach(el => {
    const c = getCurso(el.dataset.temario);
    if (c) el.innerHTML = temarioHTML(c);
  });
}

function renderDatos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => { const c = getCurso(el.dataset.precioDe); if (c) el.textContent = formatearPrecio(c.precio); });
  document.querySelectorAll('[data-dato]').forEach(el => {
    const v = { 'programa-suelto': formatearPrecio(PROGRAMA.precioSuelto), 'programa-ahorro': formatearPrecio(PROGRAMA.precioSuelto - PROGRAMA.precio), 'programa-clases': String(PROGRAMA.clases), 'programa-horas': duracionTxt(PROGRAMA.minutos) }[el.dataset.dato];
    if (v) el.textContent = v;
  });
}

function syncBotones() {
  const ids = new Set(Cart.get().map(i => i.id));
  const conPrograma = ids.has(PROGRAMA.id);
  document.querySelectorAll('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const dentro = ids.has(c.id) || (!c.programa && conPrograma);
    const txt = b.querySelector('.add-txt');
    if (!b.dataset.txt) b.dataset.txt = txt ? txt.textContent : b.textContent.trim();
    const nuevo = dentro ? (ids.has(c.id) ? 'En el carrito' : 'En el programa') : b.dataset.txt;
    if (txt) txt.textContent = nuevo; else b.textContent = nuevo;
    const ico = b.querySelector('.add-ico');
    if (ico) ico.innerHTML = dentro ? ICON.check : ICON.carrito;
    b.classList.toggle('en-carrito', dentro);
    b.setAttribute('aria-label', `${nuevo}: ${c.titulo}`);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

function agregar(c) {
  const r = Cart.add(c);
  if (r === 'incluido') { showToast(`«${c.titulo}» ya está incluido en el programa completo de tu carrito`); return false; }
  if (r === 'ya') return false;
  if (r === 'reemplazo') showToast('Sumé el programa completo y saqué los cursos sueltos: ya están incluidos');
  else showToast(`«${c.titulo}» se sumó al carrito`);
  return true;
}

const overlays = new Set();
function bloquearScroll(nombre, si) {
  if (si) overlays.add(nombre); else overlays.delete(nombre);
  document.body.classList.toggle('no-scroll', overlays.size > 0);
}

function atraparFoco(cont, ev) {
  if (ev.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[hidden]'));
  if (!f.length) return;
  const primero = f[0]; const ultimo = f[f.length - 1];
  if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
  else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
}

let focoCarrito = null;
function renderCarrito() {
  const lista = document.getElementById('carritoLista');
  if (!lista) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  lista.innerHTML = items.map(c => `<li class="linea">
    <span class="linea__img"><img src="images/${c.portada}.webp" alt="" width="160" height="120"></span>
    <div><p class="linea__nombre">${esc(c.titulo)}</p><p class="linea__meta">${c.programa ? 'Programa completo · 4 cursos + comunidad' : `Curso online · ${clasesDe(c)} clases`}</p><p class="linea__precio">${formatearPrecio(c.precio)}</p></div>
    <button type="button" class="linea__quitar" data-quitar-item="${esc(c.id)}" aria-label="Quitar ${esc(c.titulo)} del carrito">${ICON.x}</button>
  </li>`).join('');
  lista.hidden = !items.length;
  const vacio = document.getElementById('carritoVacio');
  if (vacio) vacio.hidden = items.length > 0;
  const pie = document.getElementById('carritoPie');
  if (pie) pie.hidden = !items.length;
  const total = document.getElementById('carritoTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const ahorro = document.getElementById('carritoAhorro');
  if (ahorro) {
    const tienePrograma = items.some(c => c.programa);
    ahorro.hidden = !tienePrograma;
    ahorro.textContent = tienePrograma ? `Con el programa completo ahorrás ${formatearPrecio(PROGRAMA.precioSuelto - PROGRAMA.precio)}` : '';
  }
}

function abrirCarrito(trigger) {
  const d = document.getElementById('carrito');
  if (!d) return;
  const desdeModal = !!trigger?.closest?.('#vista');
  focoCarrito = desdeModal ? focoVista : (trigger || document.activeElement);
  if (!document.getElementById('vista')?.hidden) cerrarVista(false);
  renderCarrito();
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto');
  bloquearScroll('carrito', true);
  d.querySelector('.cerrar-x')?.focus();
}

function cerrarCarrito() {
  const d = document.getElementById('carrito');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  bloquearScroll('carrito', false);
  const fin = () => { if (!d.classList.contains('abierto')) d.hidden = true; };
  d.querySelector('.drawer__panel')?.addEventListener('transitionend', fin, { once: true });
  setTimeout(fin, 450);
  focoCarrito?.focus?.();
}

function initCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  d.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrarCarrito));
  d.addEventListener('keydown', ev => atraparFoco(d, ev));
  document.getElementById('carritoLista')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-quitar-item]');
    if (!b) return;
    const c = getCurso(b.dataset.quitarItem);
    Cart.remove(b.dataset.quitarItem);
    renderCarrito();
    if (c) showToast(`Saqué «${c.titulo}» del carrito`);
    (d.querySelector('.linea__quitar') || d.querySelector('.cerrar-x'))?.focus();
  });
  document.getElementById('finalizar')?.addEventListener('click', ev => {
    const b = ev.currentTarget;
    b.disabled = true;
    const txt = b.textContent;
    b.textContent = 'Preparando tu inscripción…';
    setTimeout(() => { b.disabled = false; b.textContent = txt; showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.'); }, 700);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

let focoVista = null;
function vistaHTML(c) {
  const lista = arr => `<ul class="vr__lista">${arr.map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>`;
  const consulta = wa(`¡Hola, Hernan! Quiero consultar por «${c.titulo}».`);
  return `<div class="vr__media">
      <div class="vr__portada"><img src="images/${c.portada}.webp" alt="${esc(c.titulo)}" width="960" height="720"></div>
      <ul class="vr__datos">
        <li>Clases<strong>${clasesDe(c)}${c.programa ? ' en 4 cursos' : ' en video'}</strong></li>
        <li>Duración<strong>${duracionTxt(minDe(c))}</strong></li>
        <li>Nivel<strong>${esc(NIVELES[c.nivel])}</strong></li>
        <li>Acceso<strong>A tu ritmo</strong></li>
      </ul>
      <div class="vr__compra">
        ${precioHTML(c)}
        ${c.programa ? `<p class="ahorro">Ahorrás ${formatearPrecio(c.precioSuelto - c.precio)} frente a los cursos por separado</p>` : ''}
        <div class="vr__botones">
          ${addBtn(c, 'btn btn--line').replace('>Agregar<', '>Agregar al carrito<')}
          <button type="button" class="btn btn--cta" data-inscribir="${esc(c.id)}">Inscribirme ahora</button>
        </div>
        <a class="btn-link" href="${consulta}" target="_blank" rel="noopener"><svg class="wsp-ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>Consultar por WhatsApp</a>
      </div>
    </div>
    <div class="vr__info">
      <p class="curso__nivel">${c.programa ? 'Programa completo' : 'Curso online'} · ${esc(NIVELES[c.nivel])}</p>
      <h2>${esc(c.titulo)}</h2>
      <p class="vr__promesa">${esc(c.corta)}</p>
      <p class="vr__desc">${esc(c.descripcion)}</p>
      <div class="vr__bloque"><h3>Al terminar vas a tener</h3>${lista(c.resultados)}</div>
      <div class="vr__bloque"><h3>${c.programa ? 'Los cursos del programa' : 'El programa del curso'}</h3><div class="temario temario--claro">${temarioHTML(c, false)}</div></div>
      <div class="vr__bloque"><h3>Qué incluye</h3>${lista(c.incluye)}</div>
      <div class="vr__bloque"><h3>Qué necesitás</h3>${lista(c.requisitos)}</div>
      <div class="vr__docente"><span class="quien__ini" aria-hidden="true">HG</span><div><strong>${esc(DOCENTE.nombre)}</strong><span>${esc(DOCENTE.rol)}</span></div><p>${esc(DOCENTE.bio)}</p></div>
    </div>`;
}

function abrirVista(id, trigger) {
  const c = getCurso(id);
  const mo = document.getElementById('vista');
  const body = document.getElementById('vistaBody');
  if (!c || !mo || !body) return;
  if (mo.hidden) focoVista = trigger || document.activeElement;
  body.innerHTML = vistaHTML(c);
  mo.hidden = false;
  bloquearScroll('vista', true);
  const caja = mo.querySelector('.modal__caja');
  if (caja) caja.scrollTop = 0;
  syncBotones();
  mo.querySelector('.modal__cerrar')?.focus();
  const u = new URL(location.href);
  u.searchParams.set('curso', c.id);
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

function cerrarVista(devolverFoco = true) {
  const mo = document.getElementById('vista');
  if (!mo || mo.hidden) return;
  mo.hidden = true;
  bloquearScroll('vista', false);
  const u = new URL(location.href);
  u.searchParams.delete('curso');
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  if (devolverFoco) focoVista?.focus?.();
}

function initVista() {
  const mo = document.getElementById('vista');
  if (!mo) return;
  mo.querySelectorAll('[data-cerrar-vista]').forEach(b => b.addEventListener('click', () => cerrarVista()));
  mo.addEventListener('keydown', ev => atraparFoco(mo, ev));
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirVista(id, null);
}

function initDelegacion() {
  document.addEventListener('click', ev => {
    const add = ev.target.closest('[data-add]');
    if (add) {
      const c = getCurso(add.dataset.add);
      if (!c) return;
      if (Cart.has(c.id) || (!c.programa && Cart.has(PROGRAMA.id))) { abrirCarrito(add); return; }
      agregar(c);
      return;
    }
    const ins = ev.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      if (!Cart.has(c.id) && !(!c.programa && Cart.has(PROGRAMA.id))) agregar(c);
      abrirCarrito(ins);
      return;
    }
    const ver = ev.target.closest('[data-ver]');
    if (ver) { abrirVista(ver.dataset.ver, ver); return; }
    const open = ev.target.closest('[data-open-cart]');
    if (open) abrirCarrito(open);
  });
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!document.getElementById('vista')?.hidden) { cerrarVista(); return; }
    if (!document.getElementById('carrito')?.hidden) cerrarCarrito();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotones(); });
  window.addEventListener('storage', ev => { if (ev.key === Cart.KEY) { updateCartBadge(); syncBotones(); renderCarrito(); } });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => abrirCarrito(cart));
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll('nav', true);
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

(function iniciar() {
  initModelBarScroll();
  renderDatos();
  renderTemarios();
  renderCursos(true);
  initFiltro();
  initNav();
  initDelegacion();
  initCarrito();
  initFloats();
  updateCartBadge();
  syncBotones();
  initReveals();
  initVista();
})();
