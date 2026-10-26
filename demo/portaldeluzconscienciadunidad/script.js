const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493464581196';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waLink = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
const PAGO_MSG = 'El link de pago y el envío de la sala de Meet se activan al pasar la web a producción.';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const svg = (inner, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
const ICON = {
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'ico ico-arrow'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  meet: svg('<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  link: svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
  charla: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
  meditacion: svg('<circle cx="12" cy="5.5" r="2.5"/><path d="M12 9v5M5 19c2-1.2 4.4-2 7-2s5 .8 7 2M7.5 12.5 12 14l4.5-1.5"/>'),
  respiracion: svg('<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7"/>'),
  practica: svg('<path d="M12 3l2.4 5.6L20 9.3l-4.3 3.9 1.3 5.8L12 16l-5 3 1.3-5.8L4 9.3l5.6-.7z"/>'),
  material: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'
};
const TIPOS = { charla: 'Charla', meditacion: 'Meditación', respiracion: 'Respiración', practica: 'Práctica', material: 'Material' };
const GUIA = { nombre: 'Flavia', rol: 'Terapeuta holística · 22 años de trayectoria' };
const SALA = 'Google Meet · el enlace te llega por WhatsApp al confirmar el pago';

const mod = (titulo, items) => ({ titulo, items: items.map(([t, d, tipo]) => ({ titulo: t, duracion: d, tipo })) });

const TALLERES = [
  {
    id: 'cristales-lemurianos', titulo: 'Cristales etéreos lemurianos', tipo: 'Taller online · 3 encuentros',
    portada: 'cuarzos-lemurianos', alt: 'Puntas de cuarzo lemuriano transparentes sobre un lino claro',
    ficha: { img: 'bandeja-cristales', alt: 'Bandeja de madera con cuarzos, amatista, fluorita, citrino y bolsitas de lino preparada para un taller' },
    resumen: 'Conocé los cristales lemurianos, aprendé a cuidar el tuyo y a trabajar con su energía en meditaciones guiadas, en tres encuentros en vivo.',
    duracion: '3 encuentros de 2 h', horario: 'Martes de 19 a 21 h (hora de Argentina)', nivel: 'Sin experiencia previa',
    trabajas: ['Reconocer un cristal lemuriano y cuidar el tuyo', 'Meditar con los cristales etéreos en prácticas guiadas', 'Armar tu propia práctica con cristales para el día a día'],
    requisitos: 'No hace falta experiencia previa. Conviene tener a mano un cuarzo y un cuaderno.',
    incluye: ['3 encuentros en vivo por Google Meet', 'Guía de prácticas para descargar', 'El enlace de la sala por WhatsApp'],
    opciones: [
      {
        id: 'taller', nombre: 'Taller completo', detalle: '3 encuentros', precio: 48000,
        ediciones: [
          { id: 'cl-nov', fecha: '2026-11-03', texto: 'Martes 3, 10 y 17 de noviembre' },
          { id: 'cl-dic', fecha: '2026-12-01', texto: 'Martes 1, 8 y 15 de diciembre' }
        ]
      }
    ],
    programa: [
      mod('Encuentro 1 · Los cristales lemurianos', [['Qué los distingue: las estrías de sus caras', '30 min', 'charla'], ['Cómo elegir, limpiar y cuidar tu cristal', '30 min', 'charla'], ['Primera meditación con tu cuarzo', '45 min', 'meditacion']]),
      mod('Encuentro 2 · Los cristales etéreos', [['Qué son y cómo se trabaja con ellos', '30 min', 'charla'], ['Meditación guiada con cristales etéreos', '50 min', 'meditacion'], ['Registro en tu cuaderno', '20 min', 'material']]),
      mod('Encuentro 3 · Integración', [['Tu práctica diaria con cristales', '35 min', 'practica'], ['Meditación grupal de cierre', '45 min', 'meditacion'], ['Preguntas y cierre', '20 min', 'charla']])
    ]
  },
  {
    id: 'respiracion-consciente', titulo: 'Respiración consciente', tipo: 'Encuentros por Google Meet',
    portada: 'almohadon-respiracion', alt: 'Almohadón de meditación y manta junto a un ventanal con vista a los árboles',
    ficha: { img: 'cuaderno-te', alt: 'Cuaderno abierto, lápiz y té de hierbas sobre una mesa de madera' },
    resumen: 'Una práctica guiada de respiración para bajar el ritmo, soltar tensiones y volver al cuerpo. Podés venir a un encuentro o hacer el ciclo de cuatro.',
    duracion: 'Encuentros de 75 min', horario: 'Jueves de 19:30 a 20:45 h (hora de Argentina)', nivel: 'Sin experiencia previa',
    trabajas: ['Respirar de forma consciente, guiada paso a paso', 'Reconocer dónde se acumula la tensión en tu cuerpo', 'Llevarte una práctica corta para repetir en tu día'],
    requisitos: 'Ropa cómoda, auriculares y un lugar tranquilo. Si estás embarazada o tenés una condición respiratoria o cardíaca, consultanos antes de inscribirte.',
    incluye: ['Encuentro en vivo por Google Meet', 'Una práctica corta para repetir en casa', 'El enlace de la sala por WhatsApp'],
    opciones: [
      {
        id: 'encuentro', nombre: 'Un encuentro', detalle: '75 min', precio: 12000,
        ediciones: ['2026-10-29', '2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26', '2026-12-03', '2026-12-10'].map(f => ({ id: `re-${f}`, fecha: f }))
      },
      {
        id: 'ciclo', nombre: 'Ciclo de 4 encuentros', detalle: 'un jueves por semana', precio: 40000,
        ediciones: [
          { id: 'ci-nov', fecha: '2026-11-05', texto: 'Jueves 5, 12, 19 y 26 de noviembre' },
          { id: 'ci-ene', fecha: '2027-01-07', texto: 'Jueves 7, 14, 21 y 28 de enero' }
        ]
      }
    ],
    programa: [
      mod('Cómo es cada encuentro', [['Llegada y centramiento', '10 min', 'charla'], ['Respiración consciente guiada', '45 min', 'respiracion'], ['Relajación e integración', '15 min', 'meditacion'], ['Ronda para compartir', '5 min', 'charla']]),
      mod('El ciclo de 4 encuentros', [['Respirar y llegar al cuerpo', '75 min', 'respiracion'], ['Respiración y emociones', '75 min', 'respiracion'], ['Respirar para descansar', '75 min', 'respiracion'], ['Tu práctica propia', '75 min', 'practica']])
    ]
  }
];

const getTaller = id => TALLERES.find(t => t.id === id);
const opDe = (t, opId) => t?.opciones.find(o => o.id === opId) || t?.opciones[0];
const HOY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const fechaDe = s => new Date(`${s}T12:00:00`);
const vigentes = op => (op?.ediciones || []).filter(e => fechaDe(e.fecha) >= HOY);
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
const fechaLarga = s => { const d = fechaDe(s); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const fechaCorta = s => { const d = fechaDe(s); return `${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
const textoEd = e => (e ? (e.texto || mayus(fechaLarga(e.fecha))) : 'Fecha a confirmar');
const proximaDe = t => t.opciones.flatMap(op => vigentes(op).map(ed => ({ op, ed }))).sort((a, b) => a.ed.fecha.localeCompare(b.ed.fecha))[0] || null;
const precioHTML = t => {
  const precios = t.opciones.map(o => o.precio);
  return precios.length > 1 ? `<small>desde</small> ${formatearPrecio(Math.min(...precios))}` : formatearPrecio(precios[0]);
};

const Cart = {
  KEY: 'portaldeluz_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { return; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(t, opId, edId) {
    const items = this.get();
    const op = opDe(t, opId);
    const ed = edId || vigentes(op)[0]?.id || '';
    const existing = items.find(i => i.id === t.id);
    if (existing) { existing.op = op.id; existing.ed = ed; }
    else items.push({ id: t.id, op: op.id, ed, qty: 1 });
    this.save(items);
  },
  set(id, campos) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    Object.assign(it, campos);
    if (campos.op) it.ed = vigentes(opDe(getTaller(id), campos.op))[0]?.id || '';
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getTaller(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const t = getTaller(i.id); return t ? s + opDe(t, i.op).precio : s; }, 0); }
};

function initReveals() {
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

const inscribirLabel = id => (Cart.has(id) ? `${ICON.check}En tu inscripción` : 'Inscribirme');
const proximaTexto = t => { const p = proximaDe(t); return p ? mayus(fechaCorta(p.ed.fecha)) : 'Fechas a confirmar'; };

function cardHTML(t) {
  return `<article class="tal-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button class="tal-media" type="button" data-ver="${t.id}" aria-label="Ver el taller ${esc(t.titulo)}"><img src="images/${t.portada}-600.webp" srcset="images/${t.portada}-600.webp 600w, images/${t.portada}.webp 1000w" sizes="(max-width: 700px) 92vw, 20vw" width="600" height="600" alt="${esc(t.alt)}"></button>
    <div class="tal-body">
      <p class="tal-tipo">${esc(t.tipo)}</p>
      <h3 class="tal-t">${esc(t.titulo)}</h3>
      <ul class="meta"><li>${ICON.meet}Online · Google Meet</li><li>${ICON.reloj}${esc(t.duracion)}</li><li>${ICON.cal}Próxima fecha: ${esc(proximaTexto(t))}</li></ul>
      <div class="tal-foot"><p class="precio">${precioHTML(t)}</p><div class="tal-actions"><button class="btn btn-primary btn-sm${Cart.has(t.id) ? ' is-en' : ''}" type="button" data-inscribir="${t.id}">${inscribirLabel(t.id)}</button><button class="btn-link" type="button" data-ver="${t.id}">Ver el taller</button></div></div>
    </div>
  </article>`;
}

function zigHTML(t, i) {
  const inv = i % 2 === 1;
  return `<article class="zig${inv ? ' zig--inv' : ''}">
    <div class="zig-media" data-animate="mascara" style="clip-path:inset(100% 0 0 0)"><button class="zig-foto arco" type="button" data-ver="${t.id}" aria-label="Ver el programa de ${esc(t.titulo)}"><img src="images/${t.portada}.webp" srcset="images/${t.portada}-600.webp 600w, images/${t.portada}.webp 1000w" sizes="(max-width: 860px) 92vw, 40vw" width="1000" height="1000" alt="${esc(t.alt)}"></button></div>
    <div class="zig-body" data-animate="${inv ? 'izq' : 'der'}" style="opacity:0;transform:translateX(${inv ? -40 : 40}px)">
      <p class="tal-tipo">${esc(t.tipo)}</p>
      <h3 class="zig-t">${esc(t.titulo)}</h3>
      <p class="zig-res">${esc(t.resumen)}</p>
      <ul class="meta"><li>${ICON.meet}Online · Google Meet</li><li>${ICON.reloj}${esc(t.duracion)}</li><li>${ICON.cal}Próxima fecha: ${esc(proximaTexto(t))}</li></ul>
      <ul class="zig-trab">${t.trabajas.map(x => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul>
      <div class="tal-foot"><p class="precio">${precioHTML(t)}</p><div class="tal-actions"><button class="btn btn-primary btn-sm${Cart.has(t.id) ? ' is-en' : ''}" type="button" data-inscribir="${t.id}">${inscribirLabel(t.id)}</button><button class="btn-link" type="button" data-ver="${t.id}">Ver el programa</button></div></div>
    </div>
  </article>`;
}

function renderTalleres() {
  const grid = document.getElementById('tal-grid');
  if (grid) grid.innerHTML = TALLERES.map(cardHTML).join('');
  const zig = document.getElementById('tal-zigzag');
  if (zig) zig.innerHTML = TALLERES.map(zigHTML).join('');
}

function refrescarBotonesInscribir() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const en = Cart.has(b.dataset.inscribir);
    b.classList.toggle('is-en', en);
    b.innerHTML = inscribirLabel(b.dataset.inscribir);
  });
}

const fichaEstado = {};

function fichaHTML(t) {
  const st = fichaEstado[t.id];
  const op = opDe(t, st.op);
  const eds = vigentes(op);
  const ops = t.opciones.length > 1
    ? `<div class="ficha-ops" role="radiogroup" aria-label="Formato">${t.opciones.map(o => `<label class="ficha-op"><input type="radio" name="fop-${t.id}" value="${o.id}"${o.id === op.id ? ' checked' : ''}><span><strong>${esc(o.nombre)}</strong><small>${esc(o.detalle)} · ${formatearPrecio(o.precio)}</small></span></label>`).join('')}</div>`
    : '';
  const cuando = eds.length > 1
    ? `<label class="sr-only" for="fed-${t.id}">Fecha</label><select class="ficha-sel" id="fed-${t.id}">${eds.map(e => `<option value="${e.id}"${e.id === st.ed ? ' selected' : ''}>${esc(textoEd(e))}</option>`).join('')}</select>`
    : esc(textoEd(eds[0]));
  return `<h3 class="ficha-t">${esc(t.titulo)}</h3>
    ${ops}
    <dl class="ficha-datos">
      <div><dt>Cuándo</dt><dd>${cuando}</dd></div>
      <div><dt>Horario</dt><dd>${esc(t.horario)}</dd></div>
      <div><dt>Dirección de la sala</dt><dd>${esc(SALA)}</dd></div>
      <div><dt>Valor</dt><dd class="ficha-precio">${formatearPrecio(op.precio)}</dd></div>
    </dl>
    <div class="ficha-ctas"><button class="btn btn-primary" type="button" data-pagar="${t.id}">${ICON.link}Pagar con el link de pago</button><button class="btn btn-ghost" type="button" data-ver="${t.id}">Ver el programa</button></div>
    <p class="ficha-nota">¿Preferís consultar antes? <a href="${waLink(`Hola, quiero consultar por «${t.titulo}». ¿Me pasás fechas y valores?`)}" target="_blank" rel="noopener">Escribinos por WhatsApp</a></p>`;
}

function pintarFicha(cont) {
  const t = getTaller(cont.dataset.ficha);
  if (!t) return;
  cont.innerHTML = fichaHTML(t);
}

function initFichas() {
  const fichas = [...document.querySelectorAll('[data-ficha]')];
  if (!fichas.length) return;
  fichas.forEach(cont => {
    const t = getTaller(cont.dataset.ficha);
    if (!t) return;
    const op = t.opciones[0];
    fichaEstado[t.id] = { op: op.id, ed: vigentes(op)[0]?.id || '' };
    pintarFicha(cont);
    cont.addEventListener('change', e => {
      const st = fichaEstado[t.id];
      if (e.target.name === `fop-${t.id}`) {
        st.op = e.target.value;
        st.ed = vigentes(opDe(t, st.op))[0]?.id || '';
        pintarFicha(cont);
        cont.querySelector(`input[value="${st.op}"]`)?.focus();
      } else if (e.target.id === `fed-${t.id}`) {
        st.ed = e.target.value;
      }
    });
  });
  const tabs = [...document.querySelectorAll('.proximo [role="tab"]')];
  const img = document.getElementById('proximo-img');
  const activar = (tab, foco) => {
    tabs.forEach(x => {
      const on = x === tab;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && panel && img) {
        const t = getTaller(panel.dataset.ficha);
        if (t) { img.src = `images/${t.ficha.img}.webp`; img.alt = t.ficha.alt; }
      }
    });
    if (foco) tab.focus();
  };
  tabs.forEach((x, i) => {
    x.addEventListener('click', () => activar(x));
    x.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
}

const Capa = {
  ultimoFoco: null,
  abrir(el, alAbrir) {
    this.ultimoFoco = document.activeElement;
    el.dataset.abierta = '1';
    el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (el.dataset.abierta !== '1') return;
      el.classList.add('open');
    }));
    alAbrir?.();
  },
  cerrar(el, devolverFoco = true) {
    if (el.hidden) return;
    el.dataset.abierta = '0';
    el.classList.remove('open');
    const fin = () => { if (el.dataset.abierta === '0') el.hidden = true; };
    if (reduceMotion) fin(); else setTimeout(fin, 380);
    if (!document.querySelector('.modal[data-abierta="1"], .drawer[data-abierta="1"], .visor[data-abierta="1"]')) document.body.classList.remove('no-scroll');
    if (devolverFoco && this.ultimoFoco && document.contains(this.ultimoFoco)) this.ultimoFoco.focus({ preventScroll: true });
  }
};

function atraparFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let modalTaller = null;
let modalOp = null;

function modalEdsHTML(t, op) {
  const eds = vigentes(op);
  if (!eds.length) return '<p class="md-ed-det">Fechas a confirmar: escribinos y te avisamos cuando se abra la próxima.</p>';
  return `<fieldset class="md-ed"><legend>Elegí la fecha</legend><div class="md-ed-ops">${eds.slice(0, 4).map((e, i) => `<label class="md-ed-op"><input type="radio" name="md-ed" value="${e.id}"${i === 0 ? ' checked' : ''}><span>${esc(textoEd(e))}</span></label>`).join('')}</div></fieldset>`;
}

function modalHTML(t) {
  const op = modalOp;
  const ops = t.opciones.length > 1
    ? `<fieldset class="md-ed"><legend>Elegí el formato</legend><div class="md-ed-ops">${t.opciones.map(o => `<label class="md-ed-op"><input type="radio" name="md-op" value="${o.id}"${o.id === op.id ? ' checked' : ''}><span>${esc(o.nombre)} · ${formatearPrecio(o.precio)}</span></label>`).join('')}</div></fieldset>`
    : '';
  const prog = t.programa.map((m, i) => `<details class="md-mod"${i === 0 ? ' open' : ''}><summary><span class="md-mod-n">${String(i + 1).padStart(2, '0')}</span><span class="md-mod-t">${esc(m.titulo)}</span><span class="md-mod-d">${m.items.length} momentos</span>${ICON.plus}</summary><ul class="md-clases">${m.items.map(c => `<li>${ICON[c.tipo] || ICON.charla}<span>${esc(c.titulo)} <span class="md-tipo">${TIPOS[c.tipo] || ''}</span></span><span class="md-dur">${esc(c.duracion)}</span></li>`).join('')}</ul></details>`).join('');
  const consulta = `Hola, quiero consultar por «${t.titulo}». ¿Me pasás fechas y valores?`;
  return `<div class="md-grid">
      <figure class="md-media arco"><img src="images/${t.portada}.webp" width="1000" height="1000" alt="${esc(t.alt)}"></figure>
      <div class="md-main">
        <p class="md-cat">${esc(t.tipo)}</p>
        <h2 class="md-title">${esc(t.titulo)}</h2>
        <p class="md-lead">${esc(t.resumen)}</p>
        <dl class="md-datos"><div><dt>Modalidad</dt><dd>Online · Google Meet</dd></div><div><dt>Duración</dt><dd>${esc(t.duracion)}</dd></div><div><dt>Horario</dt><dd>${esc(t.horario)}</dd></div><div><dt>Nivel</dt><dd>${esc(t.nivel)}</dd></div></dl>
        ${ops}
        <div id="md-eds">${modalEdsHTML(t, op)}</div>
        <div class="md-buy"><span class="md-precio" id="md-precio">${formatearPrecio(op.precio)}</span><button class="btn btn-primary${Cart.has(t.id) ? ' is-en' : ''}" type="button" data-md-inscribir="${t.id}">${Cart.has(t.id) ? `${ICON.check}Ver mi inscripción` : 'Inscribirme'}</button><a class="btn btn-ghost" href="${waLink(consulta)}" target="_blank" rel="noopener">${ICON.wsp}Consultar</a></div>
      </div>
    </div>
    <div class="md-secs">
      <div class="md-sec"><h3>Qué vas a trabajar</h3><ul class="md-check">${t.trabajas.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      <div class="md-sec"><h3>Programa</h3><div class="md-mods">${prog}</div></div>
      <div class="md-sec md-two"><div><h3>Qué necesitás</h3><p>${esc(t.requisitos)}</p></div><div><h3>Incluye</h3><ul>${t.incluye.map(x => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul></div></div>
      <div class="md-guia"><span class="md-guia-arco" aria-hidden="true"></span><div><p class="md-guia-n">Guía: ${esc(GUIA.nombre)}</p><p>${esc(GUIA.rol)}</p></div></div>
      <p class="md-nota">Programa, fechas y valores de ejemplo: se confirman con cada edición.</p>
    </div>`;
}

function abrirModal(id) {
  const t = getTaller(id);
  const modal = document.getElementById('modal');
  if (!t || !modal) return;
  modalTaller = t;
  modalOp = opDe(t, fichaEstado[t.id]?.op);
  document.getElementById('modal-body').innerHTML = modalHTML(t);
  const panel = modal.querySelector('.modal-panel');
  panel.scrollTop = 0;
  Capa.abrir(modal, () => panel.focus({ preventScroll: true }));
}
function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (modal) Capa.cerrar(modal, devolverFoco);
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarModal(); }
    atraparFoco(e, modal.querySelector('.modal-panel'));
  });
  modal.addEventListener('change', e => {
    if (e.target.name !== 'md-op' || !modalTaller) return;
    modalOp = opDe(modalTaller, e.target.value);
    document.getElementById('md-eds').innerHTML = modalEdsHTML(modalTaller, modalOp);
    document.getElementById('md-precio').textContent = formatearPrecio(modalOp.precio);
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-modal-close]')) { cerrarModal(); return; }
    const ins = e.target.closest('[data-md-inscribir]');
    if (ins && modalTaller) {
      const ed = modal.querySelector('input[name="md-ed"]:checked')?.value;
      const nuevo = !Cart.has(modalTaller.id);
      Cart.add(modalTaller, modalOp?.id, ed);
      cerrarModal(false);
      setTimeout(() => abrirDrawer(), reduceMotion ? 0 : 200);
      if (nuevo) showToast(`Sumaste «${modalTaller.titulo}» a tu inscripción.`);
    }
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('taller');
  if (id && getTaller(id)) abrirModal(id);
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get().filter(i => getTaller(i.id));
  if (!items.length) {
    body.innerHTML = '<div class="dr-empty"><span class="dr-arco" aria-hidden="true"></span><p>Todavía no elegiste ningún taller.</p><a class="btn btn-ghost" href="#talleres" data-drawer-close>Ver los talleres</a></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = `<ul>${items.map(i => {
    const t = getTaller(i.id);
    const op = opDe(t, i.op);
    const eds = vigentes(op);
    const ed = eds.find(e => e.id === i.ed) || eds[0];
    const formato = t.opciones.length > 1
      ? `<label class="dr-sel"><span>Formato</span><select data-op-sel="${t.id}">${t.opciones.map(o => `<option value="${o.id}"${o.id === op.id ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('')}</select></label>`
      : `<p class="dr-meta">${esc(op.nombre)} · ${esc(op.detalle)}</p>`;
    const fecha = eds.length > 1
      ? `<label class="dr-sel"><span>Fecha</span><select data-ed-sel="${t.id}">${eds.map(e => `<option value="${e.id}"${ed && e.id === ed.id ? ' selected' : ''}>${esc(textoEd(e))}</option>`).join('')}</select></label>`
      : `<p class="dr-meta">${esc(textoEd(ed))}</p>`;
    return `<li class="dr-item"><img src="images/${t.portada}-600.webp" width="600" height="600" alt=""><div class="dr-info"><p class="dr-tit">${esc(t.titulo)}</p>${formato}${fecha}<button class="btn-link dr-quitar" type="button" data-quitar="${t.id}">Quitar</button></div><span class="dr-precio">${formatearPrecio(op.precio)}</span></li>`;
  }).join('')}</ul>`;
  if (foot) foot.hidden = false;
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer) return;
  renderDrawer();
  bd.hidden = false;
  Capa.abrir(drawer, () => drawer.querySelector('[data-drawer-close]')?.focus({ preventScroll: true }));
  requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
}
function cerrarDrawer(devolverFoco = true) {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer || drawer.hidden) return;
  bd.classList.remove('open');
  setTimeout(() => { if (drawer.dataset.abierta === '0') bd.hidden = true; }, reduceMotion ? 0 : 380);
  Capa.cerrar(drawer, devolverFoco);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('drawer-bd')?.addEventListener('click', () => cerrarDrawer());
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarDrawer(); }
    atraparFoco(e, drawer);
  });
  drawer.addEventListener('change', e => {
    const op = e.target.closest('[data-op-sel]');
    if (op) { Cart.set(op.dataset.opSel, { op: op.value }); return; }
    const sel = e.target.closest('[data-ed-sel]');
    if (sel) Cart.set(sel.dataset.edSel, { ed: sel.value });
  });
  drawer.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); renderDrawer(); drawer.querySelector('[data-drawer-close]')?.focus(); return; }
    if (e.target.closest('[data-drawer-close]')) {
      const link = e.target.closest('a[href^="#"]');
      cerrarDrawer(!link);
    }
  });
  document.getElementById('drawer-pagar')?.addEventListener('click', () => showToast(PAGO_MSG));
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initGaleria() {
  const grid = document.getElementById('gal-grid');
  const visor = document.getElementById('visor');
  if (!grid) return;
  const chips = [...document.querySelectorAll('[data-gal-cat]')];
  const items = [...grid.querySelectorAll('.gal-item')];
  chips.forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.galCat;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    items.forEach(li => { li.hidden = Boolean(cat) && li.dataset.cat !== cat; });
    grid.classList.toggle('is-filtrada', Boolean(cat));
  }));
  if (!visor) return;
  const vImg = document.getElementById('visor-img');
  const vCap = document.getElementById('visor-cap');
  const vN = document.getElementById('visor-n');
  let lista = [];
  let pos = 0;
  const mostrar = () => {
    const li = lista[pos];
    const img = li.querySelector('img');
    vImg.src = img.getAttribute('src').replace(/-(600|540|960)\.webp$/, '.webp');
    vImg.alt = img.alt;
    const w = Number(img.getAttribute('width'));
    const h = Number(img.getAttribute('height'));
    vImg.width = w > h ? 1600 : (w < h ? 900 : 1000);
    vImg.height = w > h ? 900 : (w < h ? 1600 : 1000);
    vCap.textContent = li.querySelector('.gal-cap')?.textContent || '';
    vN.textContent = `${pos + 1} / ${lista.length}`;
  };
  const paso = d => { pos = (pos + d + lista.length) % lista.length; mostrar(); };
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-gal]');
    if (!b) return;
    lista = items.filter(li => !li.hidden);
    pos = Math.max(0, lista.indexOf(b.closest('.gal-item')));
    mostrar();
    Capa.abrir(visor, () => visor.querySelector('[data-visor-close].icon-btn')?.focus({ preventScroll: true }));
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-close]')) { Capa.cerrar(visor); return; }
    const p = e.target.closest('[data-visor-paso]');
    if (p) paso(Number(p.dataset.visorPaso));
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); Capa.cerrar(visor); return; }
    if (e.key === 'ArrowRight') paso(1);
    if (e.key === 'ArrowLeft') paso(-1);
    atraparFoco(e, visor);
  });
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver && !ver.closest('.modal')) { abrirModal(ver.dataset.ver); return; }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) {
      const t = getTaller(ins.dataset.inscribir);
      if (!t) return;
      const nuevo = !Cart.has(t.id);
      if (nuevo) Cart.add(t);
      abrirDrawer();
      if (nuevo) showToast(`Sumaste «${t.titulo}» a tu inscripción.`);
      return;
    }
    if (e.target.closest('[data-pagar]')) { showToast(PAGO_MSG); return; }
    if (e.target.closest('[data-cart-open]')) abrirDrawer();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarBotonesInscribir(); if (!document.getElementById('drawer')?.hidden) renderDrawer(); });
}

function initDatosEstructurados() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': TALLERES.map(t => ({
      '@type': 'Course',
      name: t.titulo,
      description: t.resumen,
      provider: { '@type': 'EducationalOrganization', name: 'PORTAL de Luz · Consciencia de Unidad' },
      offers: t.opciones.map(o => ({ '@type': 'Offer', name: o.nombre, price: o.precio, priceCurrency: 'ARS', category: 'Paid' })),
      hasCourseInstance: t.opciones.flatMap(o => vigentes(o).slice(0, 2).map(e => ({ '@type': 'CourseInstance', courseMode: 'online', startDate: e.fecha, location: 'Google Meet', instructor: { '@type': 'Person', name: GUIA.nombre } })))
    }))
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

renderTalleres();
initFichas();
initGaleria();
initReveals();
initNav();
initModal();
initDrawer();
initAcciones();
initFloats();
updateCartBadge();
initModelBarScroll();
initDatosEstructurados();
abrirDesdeURL();
