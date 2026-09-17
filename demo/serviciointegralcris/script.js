document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491156998124';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wa = msg => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);
const num = n => Number(n).toLocaleString('es-AR');

const ESPECIALIDADES = [
  {
    id: 'aire', n: '01', nom: 'Aire acondicionado',
    desc: 'Instalación de split, multisplit y reemplazo de equipos, con cañería, soportes y desagüe nuevos.',
    foto: 'esp-aire.webp', alt: 'Unidad interior de aire acondicionado instalada en una pared clara',
    dato: ['Equipos', '2250 a 6000 frigorías'],
    vivo: '2250 a 6000 frigorías',
    ficha: [['Equipos', 'Split, multisplit y piso-techo'], ['Cañería', 'Hasta 3 m incluidos'], ['Cierre', 'Vacío, carga y prueba']],
    piezas: [
      ['t-aa-1.webp', 'Equipo split instalado sobre la pared de un ambiente'],
      ['t-aa-3.webp', 'Equipos de aire montados en altura sobre estructura metálica'],
      ['t-aa-4.webp', 'Cable del equipo conectado a la toma de pared'],
      ['esp-aire.webp', 'Unidad interior de aire acondicionado sobre pared clara']
    ],
    msg: 'Hola Cris, quiero un presupuesto de instalación de aire acondicionado.'
  },
  {
    id: 'electricidad', n: '02', nom: 'Electricidad',
    desc: 'Tableros, disyuntor y puesta a tierra, tomas, luminarias y la línea propia que pide cada equipo.',
    foto: 'esp-electricidad.webp', alt: 'Tablero eléctrico abierto con térmicas y cableado ordenado',
    dato: ['Cableado', '2,5 a 6 mm² según consumo'],
    vivo: 'Tablero, disyuntor y puesta a tierra',
    ficha: [['Tablero', 'Térmicas y disyuntor diferencial'], ['Cables', '2,5 a 6 mm² según consumo'], ['Cierre', 'Medición y planilla de circuitos']],
    piezas: [
      ['t-el-1.webp', 'Tablero eléctrico abierto con sus térmicas y el cableado a la vista'],
      ['t-el-2.webp', 'Detalle de las térmicas del tablero con los cables identificados'],
      ['t-el-3.webp', 'Multímetro con las puntas de prueba sobre la mesa de trabajo'],
      ['t-el-4.webp', 'Herramientas de electricista colgadas en el riel del taller']
    ],
    msg: 'Hola Cris, quiero un presupuesto de un trabajo de electricidad.'
  },
  {
    id: 'gas', n: '03', nom: 'Cargas de gas',
    desc: 'Detección de fugas, vacío y carga de refrigerante por kilo, con las presiones medidas antes y después.',
    foto: 'esp-gas.webp', alt: 'Manómetros de refrigeración conectados a un equipo durante la carga de gas',
    dato: ['Refrigerantes', 'R-32 y R-410A'],
    vivo: 'Vacío, carga por kg y prueba',
    ficha: [['Gases', 'R-32, R-410A y R-22'], ['Antes', 'Prueba de estanqueidad'], ['Cierre', 'Presiones y consumo medidos']],
    piezas: [
      ['t-gas-1.webp', 'Manómetros de refrigeración en uso durante una carga de gas'],
      ['t-gas-2.webp', 'Manifold digital midiendo presiones en el equipo'],
      ['t-gas-3.webp', 'Técnico trabajando sobre la unidad exterior con los manómetros conectados'],
      ['t-gas-4.webp', 'Carga de refrigerante en una unidad exterior instalada en la pared']
    ],
    msg: 'Hola Cris, mi equipo no enfría y creo que necesita carga de gas.'
  },
  {
    id: 'mantenimiento', n: '04', nom: 'Mantenimiento',
    desc: 'Limpieza de filtros y serpentinas, control de presiones y consumo, y revisión del tablero en la misma visita.',
    foto: 'esp-mantenimiento.webp', alt: 'Técnico controlando un equipo de climatización con instrumental',
    dato: ['Frecuencia', '2 visitas al año'],
    vivo: '2 visitas al año por equipo',
    ficha: [['Incluye', 'Filtros, serpentina y desagüe'], ['Se mide', 'Presiones, amperaje y consumo'], ['Cierre', 'Informe de cada equipo']],
    piezas: [
      ['t-aa-2.webp', 'Técnico revisando el instrumental frente a un equipo de climatización'],
      ['t-gas-2.webp', 'Manifold digital midiendo presiones durante el mantenimiento'],
      ['esp-mantenimiento.webp', 'Control de un equipo de climatización con instrumental'],
      ['taller-herramientas.webp', 'Herramientas ordenadas en el riel del taller']
    ],
    msg: 'Hola Cris, quiero el mantenimiento de mis equipos.'
  },
  {
    id: 'solar', n: '05', nom: 'Paneles solares',
    desc: 'Sistemas on-grid, híbridos y off-grid: estructura, inversor, protecciones y puesta en marcha.',
    foto: 'esp-solar.webp', alt: 'Paneles solares instalados sobre un techo con cielo despejado',
    dato: ['Potencia', '1,5 a 5 kWp'],
    vivo: '1,5 a 5 kWp · paneles de 550 W',
    ficha: [['Sistemas', 'On-grid, híbrido y off-grid'], ['Paneles', '550 W cada uno'], ['Cierre', 'Puesta en marcha y medición']],
    piezas: [
      ['t-sol-1.webp', 'Paneles solares montados sobre el techo, vistos desde abajo'],
      ['t-sol-2.webp', 'Instalador sobre el techo con el cinturón de herramientas junto a los paneles'],
      ['t-sol-3.webp', 'Hilera de paneles solares sobre la estructura de montaje'],
      ['esp-solar.webp', 'Paneles solares instalados sobre un techo con cielo despejado']
    ],
    msg: 'Hola Cris, quiero un presupuesto de paneles solares.'
  }
];

const SERVICIOS = [
  {
    nom: 'Instalación de split',
    incluye: ['Soportes a nivel', 'Cañería hasta 3 m', 'Desagüe', 'Vacío y carga', 'Prueba con el cliente'],
    dato: ['Tiempo', 'Una jornada']
  },
  {
    nom: 'Carga de gas refrigerante',
    incluye: ['Detección de fuga', 'Vacío', 'Carga por kilo', 'Presiones medidas'],
    dato: ['Gases', 'R-32 · R-410A · R-22']
  },
  {
    nom: 'Tablero y puesta a tierra',
    incluye: ['Térmicas por circuito', 'Disyuntor diferencial', 'Jabalina', 'Medición final'],
    dato: ['Referencia', 'Reglamentación AEA 90364']
  },
  {
    nom: 'Tomas, luces y cañerías',
    incluye: ['Canalización', 'Cableado nuevo', 'Llaves y tomas', 'Artefactos colocados'],
    dato: ['Secciones', '2,5 a 6 mm²']
  },
  {
    nom: 'Mantenimiento preventivo',
    incluye: ['Filtros y serpentina', 'Limpieza de desagüe', 'Amperaje y presiones', 'Informe por equipo'],
    dato: ['Frecuencia', 'Antes del verano y del invierno']
  },
  {
    nom: 'Paneles solares on-grid',
    incluye: ['Estructura', 'Inversor', 'Protecciones', 'Puesta en marcha'],
    dato: ['Potencia', '1,5 a 5 kWp']
  }
];

const FAQ = [
  ['¿Cuánto tarda la instalación de un split?', 'Una jornada cuando la cañería no pasa de tres metros y la pared es de material. Si hay que canalizar de nuevo o el equipo va en altura, lo decimos en el presupuesto y coordinamos dos días.'],
  ['Mi equipo no enfría, ¿es falta de gas?', 'No siempre. Un equipo bien instalado no pierde gas: si falta, hay una fuga y primero la buscamos. Medimos presiones y consumo antes de cargar, así no pagás una carga que se va a ir de nuevo.'],
  ['¿Qué frigorías necesito para mi ambiente?', 'Depende de los metros, del sol que entra y de si tenés techo propio arriba. Podés estimarlo con el dimensionador de esta página y lo confirmamos midiendo el ambiente en la visita.'],
  ['¿Se puede aprovechar el tablero que ya tengo?', 'Muchas veces sí: se agrega la térmica y el disyuntor que falten y queda en condiciones. Cuando el tablero no tiene lugar o el cableado no soporta el equipo nuevo, te mostramos por qué y qué cuesta cambiarlo.'],
  ['Si se corta la luz, ¿los paneles siguen dando energía?', 'Un sistema on-grid se apaga con el corte, porque trabaja junto a la red. Si necesitás respaldo, va un sistema híbrido con baterías: es más caro y lo dimensionamos según qué querés mantener andando.'],
  ['¿Trabajan en comercios y consorcios?', 'Sí. Relevamos todos los equipos, ordenamos el tablero y dejamos un plan con la fecha de cada mantenimiento. Se factura por visita, sin abono atado a un plazo.']
];

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  window.setTimeout(() => { toast.classList.add('hiding'); window.setTimeout(() => toast.remove(), 220); }, 3200);
}

function initEspecialidades() {
  const cont = $('espGrid');
  if (!cont) return;
  cont.innerHTML = ESPECIALIDADES.map(e => `
    <li class="esp-card" data-animate style="opacity:0;transform:translateY(16px)">
      <span class="esp-media">
        <img src="images/${e.foto}" width="1200" height="1499" alt="${esc(e.alt)}">
        <span class="esp-n">${e.n}</span>
      </span>
      <span class="esp-body">
        <span class="esp-nom">${esc(e.nom)}</span>
        <span class="esp-desc">${esc(e.desc)}</span>
        <span class="esp-dato">
          <span class="placa-k">${esc(e.dato[0])}</span>
          <span class="placa-v">${esc(e.dato[1])}</span>
        </span>
        <a class="esp-link" href="#galeria" data-esp="${e.id}">Ver trabajos
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </span>
    </li>`).join('');
}

function initServicios() {
  const cont = $('servLista');
  if (!cont) return;
  cont.innerHTML = SERVICIOS.map((s, i) => `
    <li class="serv-item" data-animate style="opacity:0;transform:translateY(14px)">
      <span class="serv-n">${String(i + 1).padStart(2, '0')}</span>
      <span>
        <span class="serv-nom">${esc(s.nom)}</span>
        <ul class="serv-incluye">${s.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <span class="serv-dato">
          <span class="placa-k">${esc(s.dato[0])}</span>
          <span class="placa-v">${esc(s.dato[1])}</span>
        </span>
      </span>
    </li>`).join('');
}

function initFaq() {
  const cont = $('faqLista');
  if (!cont) return;
  cont.innerHTML = FAQ.map(([q, a]) => `
    <details class="faq-item" data-animate style="opacity:0;transform:translateY(12px)">
      <summary>${esc(q)}<span class="faq-mas" aria-hidden="true"></span></summary>
      <p>${esc(a)}</p>
    </details>`).join('');
  const schema = $('faqSchema');
  if (schema) {
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    });
  }
  cont.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initEscena() {
  const pista = $('galPista');
  const escena = $('escena');
  const mosaico = $('mosaico');
  const chips = $('escenaChips');
  const datos = $('escenaDatos');
  const nom = $('escenaNom');
  const dato = $('escenaDato');
  const ficha = $('escenaFicha');
  const cta = $('escenaCta');
  const avance = $('escenaAvance');
  if (!pista || !escena || !mosaico || !chips) return;

  chips.innerHTML = ESPECIALIDADES.map((e, i) => `
    <li><button type="button" class="escena-chip${i === 0 ? ' is-on' : ''}" data-i="${i}">
      <span>${e.n}</span>${esc(e.nom)}
    </button></li>`).join('');

  const figs = [...mosaico.querySelectorAll('.pieza')];
  const botones = [...chips.querySelectorAll('.escena-chip')];
  let activo = -1;
  let tanda = 0;

  const pintar = (esp, animar) => {
    const mia = ++tanda;
    esp.piezas.forEach((pz, i) => {
      const fig = figs[i];
      if (!fig) return;
      const img = fig.querySelector('.pieza-img:not(.pieza-buf)');
      const buf = fig.querySelector('.pieza-buf');
      const ruta = 'images/' + pz[0];
      if (!img || !buf) return;
      if (!animar || reduceMotion) {
        img.src = ruta; img.alt = pz[1]; buf.src = ruta;
        return;
      }
      window.setTimeout(() => {
        if (mia !== tanda) return;
        buf.src = ruta;
        fig.classList.add('is-swapping');
        window.setTimeout(() => {
          if (mia !== tanda) { fig.classList.remove('is-swapping'); return; }
          img.src = ruta; img.alt = pz[1];
          fig.classList.remove('is-swapping');
        }, 520);
      }, i * 80);
    });
  };

  const setEsp = (i, animar) => {
    if (i === activo) return;
    const esp = ESPECIALIDADES[i];
    if (!esp) return;
    activo = i;
    mosaico.dataset.esp = esp.id;
    nom.textContent = esp.nom;
    dato.textContent = esp.vivo;
    ficha.innerHTML = esp.ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    cta.href = wa(esp.msg);
    cta.textContent = 'Pedir presupuesto de ' + esp.nom.toLowerCase();
    botones.forEach((b, j) => b.classList.toggle('is-on', j === i));
    if (animar && !reduceMotion) {
      datos.classList.remove('swap');
      void datos.offsetWidth;
      datos.classList.add('swap');
    }
    pintar(esp, animar);
  };

  const irA = i => {
    const total = pista.offsetHeight - escena.offsetHeight;
    const top = pista.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / ESPECIALIDADES.length) * Math.max(total, 0);
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  botones.forEach(b => b.addEventListener('click', () => irA(Number(b.dataset.i))));
  document.querySelectorAll('.esp-link[data-esp]').forEach(a => {
    a.addEventListener('click', ev => {
      const i = ESPECIALIDADES.findIndex(e => e.id === a.dataset.esp);
      if (i < 0) return;
      ev.preventDefault();
      irA(i);
    });
  });

  let raf = 0;
  const medir = () => {
    raf = 0;
    const total = pista.offsetHeight - escena.offsetHeight;
    const rel = -pista.getBoundingClientRect().top;
    const p = total > 0 ? Math.min(Math.max(rel / total, 0), 1) : 0;
    if (avance) avance.style.width = (8 + p * 92).toFixed(1) + '%';
    const i = Math.min(ESPECIALIDADES.length - 1, Math.max(0, Math.floor(p * ESPECIALIDADES.length)));
    setEsp(i, true);
  };
  const encolar = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(medir);
  };

  setEsp(0, false);
  window.addEventListener('scroll', encolar, { passive: true });
  window.addEventListener('resize', encolar, { passive: true });
  window.addEventListener('load', () => {
    encolar();
    ESPECIALIDADES.forEach(e => e.piezas.forEach(pz => { const im = new window.Image(); im.src = 'images/' + pz[0]; }));
  });
}

function initDimensionador() {
  const tabFrio = $('tabFrio'), tabSolar = $('tabSolar');
  const panelFrio = $('panelFrio'), panelSolar = $('panelSolar');
  if (tabFrio && tabSolar && panelFrio && panelSolar) {
    const ver = frio => {
      tabFrio.classList.toggle('is-on', frio);
      tabSolar.classList.toggle('is-on', !frio);
      tabFrio.setAttribute('aria-selected', String(frio));
      tabSolar.setAttribute('aria-selected', String(!frio));
      panelFrio.hidden = !frio;
      panelSolar.hidden = frio;
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    tabFrio.addEventListener('click', () => ver(true));
    tabSolar.addEventListener('click', () => ver(false));
  }

  const m2 = $('dimM2'), sol = $('dimSol'), piso = $('dimPiso'), pers = $('dimPers');
  const outM2 = $('outM2'), outPers = $('outPers'), frigNum = $('frigNum'), frigRec = $('frigRec'), frigCta = $('frigCta');
  const EQUIPOS = [[2400, 2250], [3200, 3000], [4700, 4500], [6300, 6000]];

  const calcFrio = () => {
    if (!m2 || !sol || !piso || !pers) return;
    const a = Number(m2.value), q = Number(pers.value);
    let fg = a * Number(sol.value) * Number(piso.value);
    if (q > 2) fg += (q - 2) * 100;
    fg = Math.round(fg / 50) * 50;
    const eq = EQUIPOS.find(e => fg <= e[0]);
    const rec = eq
      ? 'Equipo estándar de ' + num(eq[1]) + ' frigorías'
      : 'Dos equipos, o uno de 9.000 frigorías';
    if (outM2) outM2.textContent = a + ' m²';
    if (outPers) outPers.textContent = String(q);
    if (frigNum) frigNum.textContent = num(fg);
    if (frigRec) frigRec.textContent = rec;
    if (frigCta) frigCta.href = wa('Hola Cris, en un ambiente de ' + a + ' m² me da ' + num(fg) + ' frigorías (' + rec.toLowerCase() + '). ¿Me pasás el presupuesto instalado?');
  };

  const kwh = $('dimKwh'), techo = $('dimTecho');
  const outKwh = $('outKwh'), kwpNum = $('kwpNum'), panelRec = $('panelRec'), panelNota = $('panelNota'), solarCta = $('solarCta');
  const TECHOS = {
    chapa: 'Sobre chapa la estructura se ancla a la correa, sin perforar la cubierta.',
    losa: 'Sobre losa plana la estructura va con lastre, sin perforar.',
    teja: 'Sobre teja van ganchos que levantan la teja, sin romperla.'
  };

  const calcSolar = () => {
    if (!kwh || !techo) return;
    const bim = Number(kwh.value);
    const diario = bim / 60;
    const kwp = diario / (4.2 * 0.78);
    const paneles = Math.max(2, Math.ceil(kwp * 1000 / 550));
    const sup = Math.round(paneles * 2.6);
    const txt = kwp.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (outKwh) outKwh.textContent = num(bim) + ' kWh';
    if (kwpNum) kwpNum.textContent = txt;
    if (panelRec) panelRec.textContent = paneles + ' paneles · ' + sup + ' m² de techo';
    if (panelNota) panelNota.textContent = TECHOS[techo.value] || TECHOS.losa;
    if (solarCta) solarCta.href = wa('Hola Cris, consumo ' + num(bim) + ' kWh por bimestre y me da ' + txt + ' kWp (' + paneles + ' paneles) en techo de ' + techo.value + '. ¿Me pasás el presupuesto?');
  };

  [m2, sol, piso, pers].forEach(el => el && el.addEventListener('input', calcFrio));
  [kwh, techo].forEach(el => el && el.addEventListener('input', calcSolar));
  calcFrio();
  calcSolar();
}

function initLectura() {
  const p = $('lectura');
  if (!p) return;
  const palabras = [...p.querySelectorAll('span')];
  if (!palabras.length) return;
  if (reduceMotion) { palabras.forEach(s => s.classList.add('leido')); return; }
  let raf = 0;
  const medir = () => {
    raf = 0;
    const r = p.getBoundingClientRect();
    const alto = window.innerHeight;
    const avance = (alto * 0.82 - r.top) / Math.max(r.height + alto * 0.22, 1);
    const hasta = Math.round(Math.min(Math.max(avance, 0), 1) * palabras.length);
    palabras.forEach((s, i) => s.classList.toggle('leido', i < hasta));
  };
  const encolar = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(medir);
  };
  window.addEventListener('scroll', encolar, { passive: true });
  window.addEventListener('resize', encolar, { passive: true });
  window.addEventListener('load', encolar);
}

function initMapa() {
  const el = $('mapa');
  if (!el || typeof L === 'undefined') return;
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([-34.6037, -58.4436], 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);
  L.circle([-34.6037, -58.4436], {
    radius: 26000,
    color: '#2563eb',
    weight: 2,
    fillColor: '#2563eb',
    fillOpacity: 0.08
  }).addTo(mapa);
  L.circleMarker([-34.6534, -58.6198], {
    radius: 7,
    color: '#ffffff',
    weight: 2,
    fillColor: '#ff0000',
    fillOpacity: 1
  }).addTo(mapa).bindPopup('Servicio Integral Cris · base en zona oeste');
}

function initForm() {
  const form = $('formConsulta');
  if (!form) return;
  const nombre = $('fNombre'), tel = $('fTel'), trabajo = $('fTrabajo');
  const eNombre = $('eNombre'), eTel = $('eTel'), submit = $('formSubmit');

  const marcar = (campo, error, mal) => {
    if (campo) campo.classList.toggle('err', mal);
    if (error) error.hidden = !mal;
  };

  [nombre, tel].forEach(el => el && el.addEventListener('input', () => {
    if (el === nombre) marcar(nombre, eNombre, false);
    if (el === tel) marcar(tel, eTel, false);
  }));

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const malNombre = !nombre || nombre.value.trim().length < 2;
    const malTel = !tel || tel.value.replace(/\D/g, '').length < 8;
    marcar(nombre, eNombre, malNombre);
    marcar(tel, eTel, malTel);
    if (malNombre || malTel) {
      (malNombre ? nombre : tel).focus();
      return;
    }
    const original = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    window.setTimeout(() => {
      submit.disabled = false;
      submit.textContent = original;
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      const elegido = trabajo ? trabajo.value : '';
      form.reset();
      if (trabajo && elegido) trabajo.value = elegido;
    }, 800);
  });
}

function initNav() {
  const toggle = $('menuToggle');
  const nav = $('mainNav');
  const closeBtn = $('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initWspFloat() {
  const btn = $('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; window.requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initHero() {
  if (typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const img = document.querySelector('.hero-media img');
  if (img && !reduceMotion) tl.from(img, { scale: 1.08, duration: 1.2, clearProps: 'scale' }, 0);
  const placa = document.querySelector('.hero-placa');
  if (placa && !reduceMotion) tl.from(placa, { opacity: 0, x: -18, duration: 0.7 }, 0.5);
}

function initAnio() {
  const el = $('anio');
  if (el) el.textContent = String(new Date().getFullYear());
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

initEspecialidades();
initServicios();
initFaq();
initEscena();
initDimensionador();
initLectura();
initMapa();
initForm();
initReveals();
initNav();
initWspFloat();
initHero();
initAnio();
