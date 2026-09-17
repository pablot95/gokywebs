document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5492923645056';
const HSP = 4.8;
const PR = 0.78;
const W_PANEL = 0.55;
const M2_PANEL = 2.6;
const KWH_PANEL = W_PANEL * HSP * 30 * PR;

const RE_TILDES = new RegExp('[\u0300-\u036f]', 'g');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(RE_TILDES, '');
const nfm = (n, d = 0) => Number(n).toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const kWp = paneles => paneles * W_PANEL;
const genera = paneles => Math.round(paneles * KWH_PANEL);
const techoM2 = paneles => Math.round(paneles * M2_PANEL);
const wa = txt => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(txt);

const SISTEMAS = [
  {
    id: 'casa-3', nombre: 'Solar Casa 3 kWp', seg: 'casa', paneles: 6, tipo: 'On-grid',
    foto: 'kit-residencial.webp', alt: 'Paneles solares montados sobre el techo de una vivienda',
    ideal: 'Casa de dos o tres ambientes, con consumo de hasta 400 kWh por mes.',
    incluye: [
      '6 paneles de 550 W con estructura para chapa o teja',
      'Inversor on-grid monofásico',
      'Tablero de protecciones y puesta a tierra',
      'Puesta en marcha y app de monitoreo'
    ]
  },
  {
    id: 'casa-6', nombre: 'Solar Casa 6 kWp con respaldo', seg: 'casa', paneles: 11, tipo: 'Híbrido con batería',
    foto: 'kit-bateria.webp', alt: 'Técnico instalando el equipo de baterías de un sistema solar domiciliario',
    ideal: 'Casa grande o con bomba, donde además querés seguir con luz durante un corte.',
    incluye: [
      '11 paneles de 550 W',
      'Inversor híbrido y banco de baterías de litio',
      'Circuito de respaldo separado en el tablero',
      'Configuración de qué consumos siguen en un corte'
    ]
  },
  {
    id: 'casa-8', nombre: 'Solar Casa 8 kWp', seg: 'casa', paneles: 15, tipo: 'On-grid',
    foto: 'obra-aerea.webp', alt: 'Vista aérea de techos residenciales con paneles solares instalados',
    ideal: 'Vivienda con aire acondicionado, termotanque eléctrico y pileta.',
    incluye: [
      '15 paneles de 550 W en dos aguas si hace falta',
      'Inversor on-grid con optimización por string',
      'Medición de inyección para el trámite de la distribuidora',
      'Puesta en marcha y app de monitoreo'
    ]
  },
  {
    id: 'campo-5', nombre: 'Campo Off-grid 5 kWp', seg: 'campo', paneles: 9, tipo: 'Off-grid',
    foto: 'kit-campo.webp', alt: 'Estructuras con paneles solares montadas a suelo en un campo',
    ideal: 'Casco de campo o puesto sin red, que hoy funciona a grupo electrógeno.',
    incluye: [
      '9 paneles de 550 W con estructura a suelo',
      'Inversor cargador y banco de baterías',
      'Tablero de continua y protecciones contra sobretensión',
      'Dimensionado según los consumos que nos pases'
    ]
  },
  {
    id: 'campo-20', nombre: 'Bombeo y riego 20 kWp', seg: 'campo', paneles: 36, tipo: 'Bombeo directo',
    foto: 'obra-parque.webp', alt: 'Filas de paneles solares en un campo abierto',
    ideal: 'Riego o bombeo de pozo: arranca con el sol y para cuando baja, sin baterías.',
    incluye: [
      '36 paneles de 550 W en estructura fija',
      'Variador de frecuencia solar para la bomba',
      'Arranque y parada automáticos por irradiación',
      'Protección de marcha en seco'
    ]
  },
  {
    id: 'comercio-10', nombre: 'Comercio 10 kWp', seg: 'comercio', paneles: 18, tipo: 'On-grid trifásico',
    foto: 'kit-comercial.webp', alt: 'Paneles solares cubriendo el techo de un galpón comercial',
    ideal: 'Local, taller o galpón que consume de día, justo cuando el panel entrega.',
    incluye: [
      '18 paneles de 550 W',
      'Inversor on-grid trifásico',
      'Medición por fase y registro de generación',
      'Coordinación del montaje sin cortar la actividad'
    ]
  }
];

const SEG_LABEL = { todos: 'todos los destinos', casa: 'casa', campo: 'campo', comercio: 'comercio' };

let segActivo = 'todos';
let busqueda = '';
let calcEstado = null;
let idsPrev = SISTEMAS.map(s => s.id);
let flipActual = null;
let reasiento = 0;

/* ---------- toast ---------- */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- componente funcional: traductor de factura ---------- */
function calcular(consumo, techo) {
  const entran = Math.max(1, Math.floor(techo / M2_PANEL));
  const necesarios = Math.max(1, Math.ceil(consumo / KWH_PANEL));
  const paneles = Math.min(entran, necesarios);
  const gen = genera(paneles);
  return {
    paneles, entran, necesarios,
    potencia: kWp(paneles),
    genera: gen,
    ocupa: techoM2(paneles),
    cubre: Math.min(100, Math.round(gen / consumo * 100)),
    limitado: entran < necesarios
  };
}

function sistemaMasCercano(seg, paneles) {
  const pool = SISTEMAS.filter(s => s.seg === seg);
  const lista = pool.length ? pool : SISTEMAS;
  return lista.slice().sort((a, b) => Math.abs(a.paneles - paneles) - Math.abs(b.paneles - paneles))[0];
}

function initCalc() {
  const rango = document.getElementById('calcConsumo');
  const salida = document.getElementById('calcConsumoOut');
  const techoSel = document.getElementById('calcTecho');
  const segs = [...document.querySelectorAll('.seg')];
  const elCubre = document.getElementById('calcCubre');
  const elPaneles = document.getElementById('calcPaneles');
  const elPotencia = document.getElementById('calcPotencia');
  const elGenera = document.getElementById('calcGenera');
  const elOcupa = document.getElementById('calcOcupa');
  const btnVer = document.getElementById('calcVerSistemas');
  const linkWsp = document.getElementById('calcWsp');
  if (!rango || !techoSel) return;

  let destino = 'casa';

  const pintar = () => {
    const consumo = parseInt(rango.value, 10);
    const techo = parseInt(techoSel.value, 10);
    const r = calcular(consumo, techo);
    const cerca = sistemaMasCercano(destino, r.paneles);

    salida.innerHTML = '<strong>' + nfm(consumo) + '</strong> kWh';
    elCubre.textContent = r.cubre;
    const elCubreTxt = document.getElementById('calcCubreTxt');
    if (elCubreTxt) elCubreTxt.textContent = r.limitado
      ? 'de tu consumo — el techo llegó al límite'
      : 'de tu consumo cubierto';
    elPaneles.textContent = r.paneles;
    elPotencia.textContent = nfm(r.potencia, 1) + ' kWp';
    elGenera.textContent = nfm(r.genera) + ' kWh/mes';
    elOcupa.textContent = r.ocupa + ' m²';

    calcEstado = { consumo, techo, destino, r, cerca };

    const msg = 'Hola SOLuciones F, hice el cálculo en la web: consumo de ' + nfm(consumo) + ' kWh por mes en ' +
      (destino === 'casa' ? 'una casa' : destino === 'campo' ? 'un campo' : 'un comercio') +
      ', con ' + techo + ' m² de techo libre. Me da ' + r.paneles + ' paneles, ' + nfm(r.potencia, 1) + ' kWp y ' +
      r.cubre + '% de mi consumo cubierto. El que más se me acerca es el ' + cerca.nombre + '. ¿Lo vemos?';
    linkWsp.setAttribute('href', wa(msg));

    const visita = document.getElementById('visitaConsumo');
    if (visita) { visita.value = consumo; visita.dispatchEvent(new Event('input', { bubbles: true })); }

    pintarBanda();
  };

  rango.addEventListener('input', pintar);
  techoSel.addEventListener('change', pintar);
  segs.forEach(b => b.addEventListener('click', () => {
    destino = b.dataset.destino;
    segs.forEach(x => x.classList.toggle('is-on', x === b));
    pintar();
  }));

  btnVer?.addEventListener('click', () => {
    const chip = document.querySelector('.chip[data-seg="' + destino + '"]');
    if (chip) chip.click();
    document.getElementById('sistemas')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    showToast('Filtramos por ' + SEG_LABEL[destino] + '. El más cercano a tu cálculo es el ' + calcEstado.cerca.nombre + '.');
  });

  pintar();
}

/* ---------- catálogo filtrable + momento propio (reorden con Flip) ---------- */
function visibles() {
  const q = norm(busqueda.trim());
  return SISTEMAS.filter(s => {
    if (segActivo !== 'todos' && s.seg !== segActivo) return false;
    if (!q) return true;
    const texto = norm(s.nombre + ' ' + s.tipo + ' ' + s.ideal + ' ' + s.incluye.join(' ') + ' ' +
      SEG_LABEL[s.seg] + ' ' + nfm(kWp(s.paneles), 1) + ' kwp ' + kWp(s.paneles) + ' kwp ' + s.paneles + ' paneles');
    return texto.includes(q);
  });
}

function revelarCards(cards, grid) {
  const soltar = () => cards.forEach(c => { c.classList.remove('pre'); c.classList.add('libre'); });
  if (reduceMotion) { soltar(); return; }
  if (grid.getBoundingClientRect().top < window.innerHeight * 0.92) { soltar(); return; }
  cards.forEach(c => c.classList.add('pre'));
  let hecho = false, pedido = false;
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) disparar(); }, { threshold: 0, rootMargin: '0px 0px -8% 0px' })
    : null;
  function disparar() {
    if (hecho) return;
    hecho = true;
    cards.forEach((c, i) => setTimeout(() => c.classList.remove('pre'), Math.min(i * 110, 660)));
    setTimeout(() => {
      cards.forEach(c => c.classList.add('libre'));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 1500);
    io?.disconnect();
    window.removeEventListener('scroll', pedir);
    window.removeEventListener('resize', pedir);
  }
  const mirar = () => {
    const r = grid.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight * 0.92) disparar();
  };
  function pedir() { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; mirar(); }); }
  io?.observe(grid);
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pedir);
  setTimeout(disparar, 4000);
}

function asentar(cards, ids) {
  cards.forEach(c => {
    const on = ids.includes(c.dataset.id);
    if (typeof gsap !== 'undefined') gsap.killTweensOf(c);
    ['opacity', 'transform', 'position', 'left', 'top', 'width', 'height', 'margin'].forEach(prop => c.style.removeProperty(prop));
    c.style.display = on ? '' : 'none';
    c.classList.remove('pre');
    if (on) c.classList.add('libre');
  });
}

function actualizarChips() {
  document.querySelectorAll('.chip').forEach(ch => {
    const seg = ch.dataset.seg;
    const n = seg === 'todos' ? SISTEMAS.length : SISTEMAS.filter(x => x.seg === seg).length;
    const span = ch.querySelector('.chip-n');
    if (span) span.textContent = n;
  });
}

function pintarBanda() {
  const banda = document.getElementById('bandaDatos');
  const ctaTxt = document.getElementById('bandaCtaTxt');
  const ctaWsp = document.getElementById('bandaCtaWsp');
  if (!banda) return;
  const lista = visibles();
  const potencia = lista.reduce((s, x) => s + kWp(x.paneles), 0);
  const paneles = lista.reduce((s, x) => s + x.paneles, 0);

  let txt = '<b>' + lista.length + (lista.length === 1 ? ' sistema' : ' sistemas') + '</b> · ' +
    nfm(potencia, 1) + ' kWp sumados · ' + paneles + ' paneles';
  if (calcEstado) {
    txt += ' — para tus ' + nfm(calcEstado.consumo) + ' kWh, el más cercano es <i>' + esc(calcEstado.cerca.nombre) + '</i>';
  }
  banda.innerHTML = txt;

  if (ctaTxt && ctaWsp) {
    if (segActivo === 'todos') {
      ctaTxt.textContent = '¿Ninguno encaja justo con tu techo? Los armamos a medida.';
      ctaWsp.textContent = 'Cotizar a medida';
      ctaWsp.setAttribute('href', wa('Hola SOLuciones F, quiero cotizar un sistema a medida.'));
    } else {
      ctaTxt.textContent = 'Estás mirando ' + lista.length + ' ' + (lista.length === 1 ? 'sistema' : 'sistemas') + ' de ' + SEG_LABEL[segActivo] + ', ' + nfm(potencia, 1) + ' kWp en total.';
      ctaWsp.textContent = 'Cotizar los de ' + SEG_LABEL[segActivo];
      ctaWsp.setAttribute('href', wa('Hola SOLuciones F, me interesan los sistemas para ' + SEG_LABEL[segActivo] + ' (' + nfm(potencia, 1) + ' kWp entre ' + lista.length + ' armados). ¿Los vemos?'));
    }
  }
}

function tarjeta(s) {
  return '<article class="sistema" data-id="' + s.id + '" data-seg="' + s.seg + '">' +
    '<div class="sistema-foto"><img src="images/' + s.foto + '" width="1200" height="900" alt="' + esc(s.alt) + '">' +
    '<span class="sistema-badge">' + esc(s.tipo) + '</span></div>' +
    '<div class="sistema-body">' +
    '<p class="sistema-kwp">' + nfm(kWp(s.paneles), 1) + '<span>kWp</span></p>' +
    '<h3 class="sistema-nombre">' + esc(s.nombre) + '</h3>' +
    '<ul class="sistema-specs"><li>' + s.paneles + ' paneles</li><li>' + nfm(genera(s.paneles)) + ' kWh/mes</li><li>' + techoM2(s.paneles) + ' m²</li></ul>' +
    '<p class="sistema-ideal">' + esc(s.ideal) + '</p>' +
    '<button type="button" class="sistema-ver">Ver el detalle</button>' +
    '</div></article>';
}

function render() {
  const grid = document.getElementById('gridSistemas');
  const vacio = document.getElementById('sistemasVacio');
  if (!grid) return;
  const lista = visibles();
  const ids = lista.map(s => s.id);
  const primera = !grid.children.length;
  if (primera) grid.innerHTML = SISTEMAS.map(tarjeta).join('');
  const cards = [...grid.children];

  if (vacio) vacio.hidden = lista.length > 0;
  actualizarChips();

  if (primera) {
    cards.forEach(c => { c.style.display = ids.includes(c.dataset.id) ? '' : 'none'; });
    revelarCards(cards, grid);
    idsPrev = ids;
    pintarBanda();
    return;
  }

  const usarFlip = typeof Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion;
  if (!usarFlip) {
    asentar(cards, ids);
    idsPrev = ids;
    pintarBanda();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    return;
  }

  if (flipActual) flipActual.kill();
  clearTimeout(reasiento);
  asentar(cards, idsPrev);
  const estado = Flip.getState(cards);
  asentar(cards, ids);
  idsPrev = ids;
  const cerrar = () => {
    asentar(cards, ids);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  flipActual = Flip.from(estado, { duration: .55, ease: 'power2.inOut', stagger: .02, onComplete: cerrar });
  clearTimeout(reasiento);
  reasiento = setTimeout(() => { cerrar(); setTimeout(cerrar, 1300); }, 900);
  pintarBanda();
}

function initCatalogo() {
  const grid = document.getElementById('gridSistemas');
  if (!grid) return;
  render();

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      segActivo = chip.dataset.seg;
      document.querySelectorAll('.chip').forEach(c => {
        const on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  const buscar = document.getElementById('buscarSistema');
  buscar?.addEventListener('input', () => { busqueda = buscar.value; render(); });

  grid.addEventListener('click', e => {
    const card = e.target.closest('.sistema');
    if (!card) return;
    const s = SISTEMAS.find(x => x.id === card.dataset.id);
    if (s) abrirModal(s);
  });
}

/* ---------- modal de sistema ---------- */
let ultimoFoco = null;

function abrirModal(s) {
  const back = document.getElementById('sistemaModal');
  if (!back) return;
  const msg = 'Hola SOLuciones F, me interesa el ' + s.nombre + ' (' + nfm(kWp(s.paneles), 1) + ' kWp, ' + s.paneles + ' paneles). ¿Pasamos a medir el techo?';
  document.getElementById('modalFoto').innerHTML =
    '<img src="images/' + s.foto + '" width="1200" height="675" alt="' + esc(s.alt) + '">';
  document.getElementById('modalTipo').textContent = s.tipo + ' · ' + SEG_LABEL[s.seg];
  document.getElementById('modalTitulo').textContent = s.nombre;
  document.getElementById('modalKpis').innerHTML =
    '<div><dt>Potencia</dt><dd>' + nfm(kWp(s.paneles), 1) + ' kWp</dd></div>' +
    '<div><dt>Paneles</dt><dd>' + s.paneles + '</dd></div>' +
    '<div><dt>Genera</dt><dd>' + nfm(genera(s.paneles)) + ' kWh</dd></div>' +
    '<div><dt>Ocupa</dt><dd>' + techoM2(s.paneles) + ' m²</dd></div>';
  document.getElementById('modalIdeal').textContent = s.ideal;
  document.getElementById('modalIncluye').innerHTML = s.incluye.map(i => '<li>' + esc(i) + '</li>').join('');
  document.getElementById('modalWsp').setAttribute('href', wa(msg));
  ultimoFoco = document.activeElement;
  back.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('sistemaModal');
  if (!back || back.hidden) return;
  back.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initModal() {
  const back = document.getElementById('sistemaModal');
  if (!back) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  back.addEventListener('click', e => { if (e.target === back) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (back.hidden) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key !== 'Tab') return;
    const foco = back.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- charlemos y acordamos ---------- */
function initVisita() {
  const form = document.getElementById('formVisita');
  if (!form) return;
  const fecha = document.getElementById('visitaFecha');
  const localidad = document.getElementById('visitaLocalidad');
  const tipo = document.getElementById('visitaTipo');
  const consumo = document.getElementById('visitaConsumo');
  const tel = document.getElementById('visitaTel');
  const resumen = document.getElementById('reservaResumen');
  const linkWsp = document.getElementById('visitaWsp');
  const submit = document.getElementById('visitaSubmit');

  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);
  fecha.min = hoy.toISOString().slice(0, 10);

  const fechaTxt = v => {
    if (!v) return '';
    const [a, m, d] = v.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const sincronizar = () => {
    const tipoTxt = tipo.options[tipo.selectedIndex].text.toLowerCase();
    const kwh = parseInt(consumo.value, 10);
    const partes = [];
    if (fecha.value) partes.push('el <b>' + esc(fechaTxt(fecha.value)) + '</b>');
    if (localidad.value.trim()) partes.push('en <b>' + esc(localidad.value.trim()) + '</b>');
    resumen.innerHTML = partes.length
      ? 'Visita para medir ' + tipoTxt + ' ' + partes.join(', ') + (kwh ? ', con un consumo de <b>' + nfm(kwh) + ' kWh</b> por mes.' : '.')
      : 'Elegí un día y contanos de dónde sos: armamos el mensaje solo.';

    let msg = 'Hola SOLuciones F, quiero coordinar una visita técnica para medir ' + tipoTxt;
    if (localidad.value.trim()) msg += ' en ' + localidad.value.trim();
    if (fecha.value) msg += '. Me queda cómodo el ' + fechaTxt(fecha.value);
    if (kwh) msg += '. Mi consumo es de ' + nfm(kwh) + ' kWh por mes';
    if (calcEstado) msg += ' y el cálculo de la web me dio ' + calcEstado.r.paneles + ' paneles (' + nfm(calcEstado.r.potencia, 1) + ' kWp)';
    msg += '.';
    linkWsp.setAttribute('href', wa(msg));
  };

  [fecha, localidad, tipo, consumo].forEach(el => {
    el.addEventListener('input', sincronizar);
    el.addEventListener('change', sincronizar);
  });

  const marcar = (el, errId, ok) => {
    const err = document.getElementById(errId);
    if (err) err.hidden = ok;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ok = marcar(fecha, 'errFecha', !!fecha.value) && ok;
    ok = marcar(localidad, 'errLocalidad', localidad.value.trim().length > 1) && ok;
    ok = marcar(tel, 'errTel', tel.value.replace(/\D/g, '').length >= 8) && ok;
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const txt = submit.textContent;
    submit.textContent = 'Enviando…';
    submit.disabled = true;
    setTimeout(() => {
      submit.textContent = txt;
      submit.disabled = false;
      form.reset();
      sincronizar();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });

  sincronizar();
}

/* ---------- reveals ---------- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's';
    });
  });
  document.querySelectorAll('[data-animate][data-delay]').forEach(el => {
    el.style.transitionDelay = parseFloat(el.dataset.delay) + 's';
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
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });

  let intentos = 0;
  const reloj = setInterval(() => { sweep(); if (++intentos > 12) clearInterval(reloj); }, 500);
}

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
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
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible');
  }, { passive: true });
}

/* ---------- microinteracciones ---------- */
function initMagnetic() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .18, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1, .55)' }));
  });
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero-foto img');
  if (img) gsap.fromTo(img, { scale: 1.09 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
  const obra = document.querySelector('.obras-foto img');
  if (obra) {
    gsap.fromTo(obra, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.obras-foto', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
}

function initContadores() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  els.forEach(el => {
    const fin = parseFloat(el.dataset.counter);
    const dec = (el.dataset.counter.split('.')[1] || '').length;
    const cerrar = () => { el.textContent = nfm(fin, dec); };
    const obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 1.6, ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: () => setTimeout(cerrar, 2600) },
      onUpdate: () => { el.textContent = nfm(obj.v, dec); },
      onComplete: cerrar
    });
  });
}

function initTextoQueSeLee() {
  const el = document.getElementById('cierreLee');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => '<span>' + esc(p) + '</span>').join(' ');
  const spans = [...el.querySelectorAll('span')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('leido')); return; }
  const pintar = () => {
    const r = el.getBoundingClientRect();
    const total = r.height + window.innerHeight * .55;
    const p = Math.min(1, Math.max(0, (window.innerHeight * .82 - r.top) / total));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('leido', i < n));
  };
  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; pintar(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pintar);
  pintar();
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initCatalogo();
initCalc();
initModal();
initVisita();
initTextoQueSeLee();
initReveals();
initNav();
initWspFloat();
initMagnetic();
initHero();
initContadores();
initAnio();
