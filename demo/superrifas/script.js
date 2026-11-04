const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493846492197';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const KEY = 'superrifas_v1';
const TOPE = 100;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const RIFA_DEFAULT = {
  premio: 'Samsung Galaxy A06',
  detalle: 'Nuevo, en su caja',
  titulo: 'Elegí tu número y llevate un Samsung Galaxy A06',
  bajada: 'Reservás online, pagás con Mercado Pago y mandás el comprobante por WhatsApp. Cuando confirmamos el pago, el número es tuyo.',
  boton: 'Elegí tu número',
  valor: 5000,
  cantidad: 100,
  fecha: '',
  modalidad: '',
};
const CANTIDADES = [50, 100, 200, 500, 1000];

const MEDIOS = [
  { id: 'caja', tipo: 'foto', src: 'images/premio-caja.webp', w: 774, h: 1032, alt: 'Samsung Galaxy A06 en su caja, sostenido en la mano', cap: 'En su caja', fondo: '#E9EAEE', ajuste: 'cover' },
  { id: 'frente', tipo: 'foto', src: 'images/premio-frente.webp', w: 762, h: 1000, alt: 'Frente y dorso del Samsung Galaxy A06 en verde agua', cap: 'Frente y dorso', fondo: '#FFFFFF', ajuste: 'contain' },
  { id: 'dorso', tipo: 'foto', src: 'images/premio-dorso.webp', w: 640, h: 612, alt: 'Dorso del Samsung Galaxy A06 con la doble cámara', cap: 'La doble cámara', fondo: '#F7F7F7', ajuste: 'contain' },
  { id: 'colores', tipo: 'foto', src: 'images/premio-colores.webp', w: 640, h: 606, alt: 'Los cuatro colores del Samsung Galaxy A06 vistos de perfil', cap: 'De perfil', fondo: '#F7F7F7', ajuste: 'contain' },
  { id: 'variantes', tipo: 'foto', src: 'images/premio-variantes.webp', w: 894, h: 894, alt: 'Samsung Galaxy A06 en celeste, negro y verde agua', cap: 'Colores del modelo', fondo: '#FFFFFF', ajuste: 'contain', oculta: true },
  { id: 'video', tipo: 'video', src: 'images/premio-video.mp4', poster: 'images/premio-video.webp', w: 720, h: 960, alt: 'Video del premio', cap: 'Video del premio', fondo: '#EEEEEE', ajuste: 'contain' },
];

const SEMILLA = [
  ['Lorena Quiroga', '214', [11, 12], 'aprobado', 3020],
  ['Marcos Díaz', '587', [0], 'aprobado', 2890],
  ['Sofía Herrera', '133', [27, 72], 'aprobado', 2610],
  ['Ramiro Olmos', '905', [5, 15, 25, 35], 'aprobado', 2400],
  ['Carla Villagra', '361', [44], 'aprobado', 2210],
  ['Javier Ponce', '742', [13], 'aprobado', 1980],
  ['Daniela Reartes', '018', [61, 62, 63], 'aprobado', 1720],
  ['Nahuel Carrizo', '476', [90, 99], 'aprobado', 1500],
  ['Agustina Leiva', '659', [18], 'aprobado', 1310],
  ['Gustavo Medina', '220', [33, 66], 'aprobado', 1120],
  ['Paula Figueroa', '834', [8, 80], 'aprobado', 960],
  ['Ezequiel Tapia', '391', [50], 'aprobado', 780],
  ['Romina Suárez', '507', [47, 74], 'aprobado', 610],
  ['Matías Ávila', '162', [21, 31, 41], 'aprobado', 455],
  ['Valeria Bustos', '748', [58], 'aprobado', 320],
  ['Franco Gómez', '693', [86, 87], 'aprobado', 210],
  ['Micaela Núñez', '482', [7, 77], 'espera', 95],
  ['Cristian Zárate', '315', [19, 39, 93], 'espera', 48],
  ['Julieta Paz', '270', [55], 'espera', 17],
];

const limpiar = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function crearRifa(estado, { tope = 100 } = {}) {
  const VALIDAS = [50, 100, 200, 500, 1000];
  const lim = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const total = () => estado.config.cantidad;
  const digitos = () => Math.max(2, String(total() - 1).length);
  const fmt = n => String(n).padStart(digitos(), '0');
  const estadoDe = n => estado.estados[n] || 'libre';
  const copia = p => ({ ...p, numeros: [...p.numeros] });

  function coincideNum(n, filtro, q) {
    if (filtro !== 'todos' && estadoDe(n) !== filtro) return false;
    return !q || fmt(n).includes(q);
  }
  function consultar({ filtro = 'todos', buscar = '', cursor = null, limite = tope } = {}) {
    const max = lim(limite);
    const f = ['todos', 'libre', 'reservado', 'vendido'].includes(filtro) ? filtro : 'todos';
    const q = String(buscar ?? '').replace(/\D/g, '').slice(0, digitos());
    const N = total();
    let i = 0;
    if (cursor !== null && cursor !== undefined && cursor !== '') {
      const c = Number(cursor);
      i = Number.isInteger(c) && c >= -1 ? c + 1 : N;
    }
    const items = [];
    let leidas = 0;
    let paginas = 0;
    while (i < N && items.length < max) {
      const fin = Math.min(N, i + tope);
      paginas++;
      while (i < fin && items.length < max) {
        leidas++;
        if (coincideNum(i, f, q)) items.push({ n: i, txt: fmt(i), estado: estadoDe(i) });
        i++;
      }
    }
    let hayMas = false;
    if (items.length === max) {
      for (let k = i; k < N; k++) if (coincideNum(k, f, q)) { hayMas = true; break; }
    }
    return { items, cursor: hayMas ? items[items.length - 1].n : null, leidas, paginas };
  }
  function resumen() {
    const N = total();
    let vendidos = 0;
    let reservados = 0;
    Object.keys(estado.estados).forEach(k => {
      if (Number(k) >= N) return;
      if (estado.estados[k] === 'vendido') vendidos++;
      else if (estado.estados[k] === 'reservado') reservados++;
    });
    return { total: N, vendidos, reservados, libres: N - vendidos - reservados, ocupados: vendidos + reservados };
  }
  function alAzar(excluir = [], rnd = Math.random) {
    const fuera = new Set(excluir);
    const libres = [];
    for (let n = 0; n < total(); n++) if (estadoDe(n) === 'libre' && !fuera.has(n)) libres.push(n);
    return libres.length ? libres[Math.floor(rnd() * libres.length)] : null;
  }
  function reservar(nums, datos = {}, ahora = Date.now()) {
    const lista = [...new Set((nums || []).map(Number))].filter(Number.isInteger).sort((a, b) => a - b);
    if (!lista.length) return { ok: false, error: 'vacio' };
    const malos = lista.filter(n => n < 0 || n >= total() || estadoDe(n) !== 'libre');
    if (malos.length) return { ok: false, error: 'ocupados', numeros: malos };
    estado.seq += 1;
    const valor = estado.config.valor;
    const pedido = {
      id: 'P-' + String(estado.seq).padStart(4, '0'),
      nombre: limpiar(datos.nombre, 60) || 'Sin nombre',
      tel: limpiar(datos.tel, 30),
      email: limpiar(datos.email, 80),
      numeros: lista,
      valor,
      total: lista.length * valor,
      estado: 'espera',
      ts: ahora,
      origen: 'web',
    };
    lista.forEach(n => { estado.estados[n] = 'reservado'; });
    estado.pedidos.push(pedido);
    return { ok: true, pedido: copia(pedido) };
  }
  function cambiarPedido(id, nuevo) {
    const p = estado.pedidos.find(x => x.id === id);
    if (!p || p.estado !== 'espera') return null;
    p.estado = nuevo;
    p.numeros.forEach(n => {
      if (n >= total()) return;
      if (nuevo === 'aprobado') estado.estados[n] = 'vendido';
      else delete estado.estados[n];
    });
    return copia(p);
  }
  function ciclar(n) {
    if (!Number.isInteger(n) || n < 0 || n >= total()) return null;
    const sig = { libre: 'reservado', reservado: 'vendido', vendido: 'libre' }[estadoDe(n)];
    if (sig === 'libre') delete estado.estados[n];
    else estado.estados[n] = sig;
    return sig;
  }
  function setCantidad(c) {
    const nueva = Number(c);
    if (!VALIDAS.includes(nueva)) return { ok: false, error: 'invalida' };
    const altos = Object.keys(estado.estados).map(Number).filter(n => n >= nueva);
    if (altos.length) return { ok: false, error: 'ocupados', n: Math.max(...altos) };
    estado.config.cantidad = nueva;
    return { ok: true };
  }
  function setConfig(p = {}) {
    const c = estado.config;
    let valor = c.valor;
    if ('valor' in p) {
      valor = Math.round(Number(p.valor));
      if (!Number.isFinite(valor) || valor < 100 || valor > 10000000) return { ok: false, error: 'valor' };
    }
    const req = (k, max) => { if (k in p) { const s = limpiar(p[k], max); if (s) c[k] = s; } };
    req('premio', 60);
    req('titulo', 90);
    req('boton', 28);
    if ('detalle' in p) c.detalle = limpiar(p.detalle, 60);
    if ('bajada' in p) c.bajada = limpiar(p.bajada, 220);
    if ('fecha' in p) c.fecha = /^\d{4}-\d{2}-\d{2}$/.test(String(p.fecha)) ? String(p.fecha) : '';
    if ('modalidad' in p) c.modalidad = limpiar(p.modalidad, 90);
    c.valor = valor;
    return { ok: true };
  }
  function filtroPedido(filtro, buscar) {
    const q = norm(buscar).trim();
    const soloDig = /^\d+$/.test(q);
    return p => {
      if (filtro !== 'todos' && p.estado !== filtro) return false;
      if (!q) return true;
      if (soloDig) return p.numeros.some(n => fmt(n).includes(q)) || p.id.includes(q);
      return norm(p.nombre).includes(q) || norm(p.id).includes(q);
    };
  }
  function consultarPedidos({ filtro = 'todos', buscar = '', cursor = null, limite = tope } = {}) {
    const max = lim(limite);
    const f = ['todos', 'espera', 'aprobado', 'liberado'].includes(filtro) ? filtro : 'todos';
    const ok = filtroPedido(f, buscar);
    const orden = [...estado.pedidos].sort((a, b) => b.ts - a.ts || b.id.localeCompare(a.id));
    let i = 0;
    if (cursor) {
      const k = orden.findIndex(p => p.id === cursor);
      i = k < 0 ? orden.length : k + 1;
    }
    const items = [];
    let leidas = 0;
    let paginas = 0;
    while (i < orden.length && items.length < max) {
      const fin = Math.min(orden.length, i + tope);
      paginas++;
      while (i < fin && items.length < max) {
        leidas++;
        if (ok(orden[i])) items.push(copia(orden[i]));
        i++;
      }
    }
    let hayMas = false;
    if (items.length === max) {
      for (let k = i; k < orden.length; k++) if (ok(orden[k])) { hayMas = true; break; }
    }
    return { items, cursor: hayMas ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contarPedidos(filtro = 'todos') {
    return estado.pedidos.reduce((n, p) => n + (filtro === 'todos' || p.estado === filtro ? 1 : 0), 0);
  }
  return {
    TOPE: tope, fmt, digitos, total, estadoDe, consultar, resumen, alAzar, reservar,
    aprobar: id => cambiarPedido(id, 'aprobado'), liberar: id => cambiarPedido(id, 'liberado'),
    ciclar, setCantidad, setConfig, consultarPedidos, contarPedidos,
  };
}

function estadoInicial(ahora = Date.now()) {
  const est = { v: 1, config: { ...RIFA_DEFAULT }, estados: {}, pedidos: [], seq: 0, medios: MEDIOS.map(m => ({ id: m.id, visible: !m.oculta })) };
  SEMILLA.forEach(([nombre, fin, nums, e, hace], k) => {
    est.seq = k + 1;
    est.pedidos.push({
      id: 'P-' + String(k + 1).padStart(4, '0'), nombre, tel: '+54 9 3846 ···· ' + fin, email: '',
      numeros: [...nums], valor: RIFA_DEFAULT.valor, total: nums.length * RIFA_DEFAULT.valor,
      estado: e, ts: ahora - hace * 60000, origen: 'ejemplo',
    });
    nums.forEach(n => { est.estados[n] = e === 'aprobado' ? 'vendido' : 'reservado'; });
  });
  return est;
}

function sanear(raw, ahora = Date.now()) {
  const base = estadoInicial(ahora);
  if (!raw || typeof raw !== 'object' || raw.v !== 1) return base;
  try {
    const c = raw.config && typeof raw.config === 'object' ? raw.config : {};
    const config = { ...base.config };
    [['premio', 60, true], ['titulo', 90, true], ['boton', 28, true], ['detalle', 60, false], ['bajada', 220, false], ['modalidad', 90, false]].forEach(([k, max, req]) => {
      if (typeof c[k] !== 'string') return;
      const s = limpiar(c[k], max);
      if (s || !req) config[k] = s;
    });
    if (Number.isInteger(c.valor) && c.valor >= 100 && c.valor <= 10000000) config.valor = c.valor;
    if (CANTIDADES.includes(c.cantidad)) config.cantidad = c.cantidad;
    config.fecha = typeof c.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.fecha) ? c.fecha : '';
    const estados = {};
    if (raw.estados && typeof raw.estados === 'object') {
      Object.entries(raw.estados).forEach(([k, v]) => {
        const n = Number(k);
        if (Number.isInteger(n) && n >= 0 && n < config.cantidad && (v === 'vendido' || v === 'reservado')) estados[n] = v;
      });
    }
    const pedidos = Array.isArray(raw.pedidos)
      ? raw.pedidos
        .filter(p => p && typeof p.id === 'string' && /^P-\d{4,}$/.test(p.id) && Array.isArray(p.numeros) && ['espera', 'aprobado', 'liberado'].includes(p.estado))
        .slice(-5000)
        .map(p => ({
          id: p.id,
          nombre: limpiar(p.nombre, 60) || 'Sin nombre',
          tel: limpiar(p.tel, 30),
          email: limpiar(p.email, 80),
          numeros: p.numeros.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < 1000).slice(0, 100),
          valor: Number.isFinite(p.valor) ? p.valor : config.valor,
          total: Number.isFinite(p.total) ? p.total : 0,
          estado: p.estado,
          ts: Number.isFinite(p.ts) ? p.ts : ahora,
          origen: p.origen === 'web' ? 'web' : 'ejemplo',
        }))
      : base.pedidos;
    const seq = Math.max(Number.isInteger(raw.seq) ? raw.seq : 0, 0, ...pedidos.map(p => parseInt(p.id.slice(2), 10)));
    const ids = MEDIOS.map(m => m.id);
    const medios = [];
    if (Array.isArray(raw.medios)) {
      raw.medios.forEach(m => {
        if (m && ids.includes(m.id) && !medios.some(x => x.id === m.id)) medios.push({ id: m.id, visible: m.visible !== false });
      });
    }
    MEDIOS.forEach(m => { if (!medios.some(x => x.id === m.id)) medios.push({ id: m.id, visible: !m.oculta }); });
    if (!medios.some(m => m.visible)) medios[0].visible = true;
    return { v: 1, config, estados, pedidos, seq, medios };
  } catch (e) {
    return base;
  }
}

function cargarEstado() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
  return sanear(raw);
}
const ESTADO = cargarEstado();
const Rifa = crearRifa(ESTADO, { tope: TOPE });
function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(ESTADO)); } catch (e) { return false; }
  return true;
}
function reemplazarEstado(nuevo) {
  Object.keys(ESTADO).forEach(k => delete ESTADO[k]);
  Object.assign(ESTADO, nuevo);
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const precio = n => '$' + Math.round(n).toLocaleString('es-AR');
const plural = (n, uno, varios) => `${n.toLocaleString('es-AR')} ${n === 1 ? uno : varios}`;
const wspHref = (msg, tel = WSP) => `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function fechaLarga(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const f = new Date(y, m - 1, d);
  return `${DIAS[f.getDay()]} ${d} de ${MESES[m - 1]}`;
}
function fechaCorta(ts) {
  const f = new Date(ts);
  return `${f.getDate()} ${MESES[f.getMonth()].slice(0, 3)}, ${String(f.getHours()).padStart(2, '0')}:${String(f.getMinutes()).padStart(2, '0')}`;
}
function listaNums(nums) {
  const t = nums.map(n => Rifa.fmt(n));
  return t.length < 2 ? (t[0] || '') : `${t.slice(0, -1).join(', ')} y ${t[t.length - 1]}`;
}
function telParaWa(tel) {
  const d = String(tel || '').replace(/\D/g, '').replace(/^0+/, '');
  if (d.length < 10) return '';
  return d.startsWith('54') ? d : '549' + d;
}

const ICO = {
  check: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  play: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a.6.6 0 0 0 .92.5l10.6-6.8a.6.6 0 0 0 0-1L8.92 4.7A.6.6 0 0 0 8 5.2Z"/></svg>',
  arriba: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
  abajo: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  ojo: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/></svg>',
  ojoNo: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>',
  wsp: '<svg class="ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0];
  const ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 380);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
}

function setTexto(sel, v) {
  document.querySelectorAll(sel).forEach(el => { if (el.textContent !== v) el.textContent = v; });
}
function aplicarConfig() {
  const c = ESTADO.config;
  setTexto('[data-rifa="titulo"]', c.titulo);
  setTexto('[data-rifa="bajada"]', c.bajada);
  setTexto('[data-rifa="boton"]', c.boton);
  setTexto('[data-rifa="premio"]', c.premio);
  setTexto('[data-rifa="detalle"]', c.detalle || 'A confirmar');
  setTexto('[data-rifa="detalle-min"]', c.detalle ? c.detalle.charAt(0).toLowerCase() + c.detalle.slice(1) : 'estado a confirmar');
  setTexto('[data-rifa="valor"]', precio(c.valor));
  setTexto('[data-rifa="fecha"]', c.fecha ? fechaLarga(c.fecha) : 'a confirmar');
  document.querySelectorAll('[data-rifa="modalidad"]').forEach(el => {
    el.textContent = c.modalidad || 'a completar';
    el.classList.toggle('falta', !c.modalidad);
  });
  document.querySelectorAll('[data-rifa="bajada"]').forEach(el => { el.hidden = !c.bajada; });
  setTexto('[data-rango-desde]', Rifa.fmt(0));
  setTexto('[data-rango-hasta]', Rifa.fmt(Rifa.total() - 1));
  pintarCuentas();
}
function pintarCuentas() {
  const r = Rifa.resumen();
  ['total', 'libres', 'reservados', 'vendidos', 'ocupados'].forEach(k => setTexto(`[data-cuenta="${k}"]`, r[k].toLocaleString('es-AR')));
  document.querySelectorAll('[data-avance-v]').forEach(el => { el.style.width = `${(r.vendidos / r.total) * 100}%`; });
  document.querySelectorAll('[data-avance-r]').forEach(el => { el.style.width = `${(r.reservados / r.total) * 100}%`; });
  const espera = Rifa.contarPedidos('espera');
  document.querySelectorAll('[data-badge-espera]').forEach(el => { el.textContent = espera; el.hidden = !espera; });
}

const T = { filtro: 'todos', buscar: '', pila: [null], sel: new Set(), girando: false };
const tab = {};
function initTablero() {
  const root = document.querySelector('[data-tablero]');
  if (!root) return;
  Object.assign(tab, {
    root,
    grid: root.querySelector('[data-tablero-grid]'),
    vacio: root.querySelector('[data-tablero-vacio]'),
    pager: root.querySelector('[data-tablero-pager]'),
    info: root.querySelector('[data-pag-info]'),
    prev: root.querySelector('[data-pag="prev"]'),
    next: root.querySelector('[data-pag="next"]'),
    input: root.querySelector('[data-tablero-buscar]'),
  });
  root.querySelectorAll('[data-filtro]').forEach(b => b.addEventListener('click', () => {
    T.filtro = b.dataset.filtro;
    T.pila = [null];
    marcarFiltros();
    pintarTablero(true);
  }));
  let espera = 0;
  tab.input.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      T.buscar = tab.input.value.replace(/\D/g, '');
      T.pila = [null];
      pintarTablero(true);
    }, 180);
  });
  tab.grid.addEventListener('click', e => {
    const b = e.target.closest('.num');
    if (!b || b.disabled || T.girando) return;
    alternar(Number(b.dataset.n), b);
  });
  tab.prev.addEventListener('click', () => {
    if (T.pila.length > 1) { T.pila.pop(); pintarTablero(true); }
  });
  tab.next.addEventListener('click', () => {
    if (T.ultimo?.cursor != null) { T.pila.push(T.ultimo.cursor); pintarTablero(true); }
  });
  root.querySelector('[data-tablero-limpiar]')?.addEventListener('click', () => {
    T.filtro = 'todos';
    T.buscar = '';
    tab.input.value = '';
    T.pila = [null];
    marcarFiltros();
    pintarTablero(true);
  });
  root.querySelector('[data-azar]')?.addEventListener('click', alAzarConRuleta);
  document.querySelectorAll('[data-ver-libres]').forEach(a => a.addEventListener('click', () => {
    T.filtro = 'libre';
    T.buscar = '';
    tab.input.value = '';
    T.pila = [null];
    marcarFiltros();
    pintarTablero(true);
  }));
  document.querySelectorAll('[data-ir-compra]').forEach(a => a.addEventListener('click', e => {
    const compra = document.getElementById('compra');
    if (!compra) return;
    e.preventDefault();
    compra.scrollIntoView({ block: 'start' });
    document.getElementById('c-nombre')?.focus({ preventScroll: true });
  }));
  pintarTablero(true);
}
function marcarFiltros() {
  tab.root?.querySelectorAll('[data-filtro]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === T.filtro)));
}
function numHTML(it, k) {
  const sel = T.sel.has(it.n);
  const d = Math.floor(k / 10) + (k % 10);
  const lab = sel ? 'elegido por vos' : it.estado;
  return `<button type="button" class="num num--${it.estado}${sel ? ' is-sel' : ''}" data-n="${it.n}" style="--d:${d}"${it.estado !== 'libre' ? ' disabled' : ''} aria-pressed="${sel}" aria-label="Número ${it.txt}, ${lab}">${it.txt}</button>`;
}
function pintarTablero(animar = false) {
  if (!tab.grid) return;
  [...T.sel].forEach(n => { if (n >= Rifa.total() || Rifa.estadoDe(n) !== 'libre') T.sel.delete(n); });
  const res = Rifa.consultar({ filtro: T.filtro, buscar: T.buscar, cursor: T.pila[T.pila.length - 1], limite: TOPE });
  T.ultimo = res;
  tab.grid.classList.toggle('anima', animar && !reduceMotion);
  tab.grid.classList.toggle('tablero__grid--3', Rifa.digitos() > 2);
  tab.grid.innerHTML = res.items.map(numHTML).join('');
  tab.vacio.hidden = res.items.length > 0;
  const hayPrev = T.pila.length > 1;
  const hayNext = res.cursor != null;
  tab.pager.hidden = !hayPrev && !hayNext;
  tab.prev.disabled = !hayPrev;
  tab.next.disabled = !hayNext;
  tab.info.textContent = res.items.length ? `Del ${res.items[0].txt} al ${res.items[res.items.length - 1].txt}` : '';
  pintarTalon();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}
function alternar(n, btn) {
  const agregar = !T.sel.has(n);
  if (agregar) T.sel.add(n);
  else T.sel.delete(n);
  if (btn) {
    btn.classList.toggle('is-sel', agregar);
    btn.setAttribute('aria-pressed', String(agregar));
    btn.setAttribute('aria-label', `Número ${Rifa.fmt(n)}, ${agregar ? 'elegido por vos' : 'libre'}`);
    if (agregar && !reduceMotion) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
  }
  pintarTalon(agregar ? n : null);
}
function paginasHasta(n) {
  const pila = [null];
  for (let s = TOPE; s <= n; s += TOPE) pila.push(s - 1);
  return pila;
}
function alAzarConRuleta() {
  if (T.girando || !tab.grid) return;
  const n = Rifa.alAzar([...T.sel]);
  if (n == null) { showToast('No quedan números libres para elegir.'); return; }
  let destino = tab.grid.querySelector(`.num[data-n="${n}"]`);
  if (!destino) {
    T.filtro = 'todos';
    T.buscar = '';
    tab.input.value = '';
    T.pila = paginasHasta(n);
    marcarFiltros();
    pintarTablero(false);
    destino = tab.grid.querySelector(`.num[data-n="${n}"]`);
  }
  if (!destino) return;
  const r = destino.getBoundingClientRect();
  if (r.top < 80 || r.bottom > window.innerHeight - 80) destino.scrollIntoView({ block: 'center' });
  const candidatos = [...tab.grid.querySelectorAll('.num--libre:not(.is-sel)')];
  if (reduceMotion || candidatos.length < 3) { alternar(n, destino); return; }
  T.girando = true;
  tab.root.classList.add('girando');
  const pasos = 14;
  let t = 0;
  let previo = null;
  for (let k = 0; k < pasos; k++) {
    t += 30 + k * k;
    const el = k === pasos - 1 ? destino : candidatos[Math.floor(Math.random() * candidatos.length)];
    setTimeout(() => {
      previo?.classList.remove('ruleta');
      el.classList.add('ruleta');
      previo = el;
      if (k === pasos - 1) {
        setTimeout(() => {
          el.classList.remove('ruleta');
          T.girando = false;
          tab.root.classList.remove('girando');
          if (!T.sel.has(n)) alternar(n, el);
          showToast(`Te tocó el ${Rifa.fmt(n)}. Quedó elegido en tu boleto.`);
        }, 180);
      }
    }, t);
  }
}
function pintarTalon(nuevo = null) {
  const nums = [...T.sel].sort((a, b) => a - b);
  const valor = ESTADO.config.valor;
  document.querySelectorAll('[data-talon-nums]').forEach(el => {
    el.innerHTML = nums.length
      ? nums.map(n => `<span class="chip-num${n === nuevo && !reduceMotion ? ' sellado' : ''}">${Rifa.fmt(n)}</span>`).join('')
      : '<span class="ticket__vacio">Elegilos en el tablero</span>';
  });
  setTexto('[data-talon-cant]', nums.length ? plural(nums.length, 'número', 'números') : 'Ningún número');
  setTexto('[data-talon-total]', precio(nums.length * valor));
  document.querySelectorAll('[data-eleccion]').forEach(el => { el.hidden = !nums.length; });
  const corta = nums.length > 5 ? `${nums.slice(0, 5).map(n => Rifa.fmt(n)).join(' · ')} +${nums.length - 5}` : nums.map(n => Rifa.fmt(n)).join(' · ');
  setTexto('[data-eleccion-nums]', corta);
  setTexto('[data-eleccion-total]', precio(nums.length * valor));
  if (nums.length) document.querySelectorAll('[data-err-sel]').forEach(el => { el.hidden = true; });
}

function initCompra() {
  const form = document.querySelector('[data-form-compra]');
  if (!form) return;
  const ok = document.querySelector('[data-compra-ok]');
  const enviar = form.querySelector('[data-compra-enviar]');
  const etiqueta = enviar.querySelector('span');
  const textoBoton = etiqueta.textContent;
  const campos = {
    nombre: form.querySelector('#c-nombre'),
    wsp: form.querySelector('#c-wsp'),
    mail: form.querySelector('#c-mail'),
    acepto: form.querySelector('#c-acepto'),
  };
  const marcar = (input, mal) => {
    input.setAttribute('aria-invalid', String(mal));
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    if (err) err.hidden = !mal;
  };
  Object.values(campos).forEach(input => input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
    if (input.getAttribute('aria-invalid') === 'true') marcar(input, false);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = limpiar(campos.nombre.value, 60);
    const digitos = campos.wsp.value.replace(/\D/g, '');
    const mail = campos.mail.value.trim();
    const malos = [];
    const chequear = (input, mal) => { marcar(input, mal); if (mal) malos.push(input); };
    chequear(campos.nombre, nombre.length < 3 || !/\p{L}/u.test(nombre));
    chequear(campos.wsp, digitos.length < 10 || digitos.length > 13);
    chequear(campos.mail, !!mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail));
    chequear(campos.acepto, !campos.acepto.checked);
    const errSel = form.querySelector('[data-err-sel]');
    errSel.hidden = T.sel.size > 0;
    if (!T.sel.size) {
      showToast('Elegí al menos un número en el tablero.');
      tab.root?.scrollIntoView({ block: 'start' });
      return;
    }
    if (malos.length) { malos[0].focus(); return; }
    enviar.disabled = true;
    etiqueta.textContent = 'Reservando…';
    setTimeout(() => {
      enviar.disabled = false;
      etiqueta.textContent = textoBoton;
      const r = Rifa.reservar([...T.sel], { nombre, tel: campos.wsp.value, email: mail });
      if (!r.ok) {
        const n = r.numeros?.[0];
        showToast(n != null ? `El ${Rifa.fmt(n)} ya no está libre. Elegí otro.` : 'Elegí al menos un número en el tablero.');
        refrescarTodo();
        return;
      }
      guardar();
      T.sel.clear();
      mostrarOk(r.pedido);
      form.reset();
      refrescarTodo();
      showToast('¡Reservados! En la web real el pedido le llega a Super Rifas al instante.');
    }, 800);
  });
  ok?.querySelector('[data-compra-otra]')?.addEventListener('click', () => {
    ok.hidden = true;
    form.hidden = false;
    tab.root?.scrollIntoView({ block: 'start' });
  });
  ok?.querySelector('[data-pagar-mp]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  function mostrarOk(p) {
    if (!ok) return;
    const primero = p.nombre.split(' ')[0];
    ok.querySelector('[data-ok-nombre]').textContent = primero;
    ok.querySelector('[data-ok-cuales]').textContent = p.numeros.length === 1 ? `el número ${Rifa.fmt(p.numeros[0])}` : `estos ${p.numeros.length} números`;
    ok.querySelector('[data-ok-nums]').innerHTML = p.numeros.map(n => `<span class="chip-num">${Rifa.fmt(n)}</span>`).join('');
    ok.querySelector('[data-ok-total]').textContent = precio(p.total);
    const msg = `Hola Super Rifas! Soy ${p.nombre}. Reservé ${p.numeros.length === 1 ? 'el número' : 'los números'} ${listaNums(p.numeros)} de la rifa del ${ESTADO.config.premio} (pedido ${p.id}, total ${precio(p.total)}). Te mando el comprobante de Mercado Pago.`;
    ok.querySelector('[data-ok-wsp]').href = wspHref(msg);
    form.hidden = true;
    ok.hidden = false;
    ok.focus({ preventScroll: true });
    ok.closest('.compra')?.scrollIntoView({ block: 'nearest' });
  }
}

const mediosSesion = [];
function mediosTodos() {
  return [...MEDIOS, ...mediosSesion];
}
function mediosVisibles() {
  const mapa = new Map(mediosTodos().map(m => [m.id, m]));
  return ESTADO.medios.filter(x => x.visible && mapa.has(x.id)).map(x => mapa.get(x.id));
}
function mostrarMedio(visor, m, reproducir = false) {
  if (!m) return;
  const fig = visor.querySelector('.visor__main');
  const img = visor.querySelector('[data-visor-img]');
  const vid = visor.querySelector('[data-visor-video]');
  fig.style.setProperty('--fondo', m.fondo);
  if (m.tipo === 'video') {
    img.hidden = true;
    vid.hidden = false;
    if (reproducir) vid.play().catch(() => {});
  } else {
    if (!vid.paused) vid.pause();
    vid.hidden = true;
    img.hidden = false;
    if (img.getAttribute('src') !== m.src) {
      img.src = m.src;
      img.alt = m.alt;
      img.width = m.w;
      img.height = m.h;
      if (!reduceMotion) { img.classList.remove('cambia'); void img.offsetWidth; img.classList.add('cambia'); }
    }
    img.style.objectFit = m.ajuste;
  }
  visor.querySelector('[data-visor-cap]').textContent = m.cap;
  visor.querySelectorAll('[data-medio]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.medio === m.id)));
}
function pintarVisores() {
  const lista = mediosVisibles();
  document.querySelectorAll('[data-visor]').forEach(visor => {
    const tira = visor.querySelector('[data-visor-tira]');
    tira.innerHTML = lista.map((m, k) => {
      const esVideo = m.tipo === 'video';
      const etiqueta = esVideo ? 'Ver el video del premio' : `Ver foto: ${m.cap}`;
      return `<button type="button" class="visor__thumb${esVideo ? ' visor__thumb--video' : ''}" data-medio="${esc(m.id)}" aria-pressed="${k === 0}" aria-label="${esc(etiqueta)}" data-animate="der" style="opacity:0;transform:translateX(36px)"><img src="${esc(esVideo ? m.poster : m.src)}" alt="" width="${m.w}" height="${m.h}" style="background:${esc(m.fondo)}">${esVideo ? `<span class="visor__play">${ICO.play}</span>` : ''}</button>`;
    }).join('');
    mostrarMedio(visor, lista[0]);
    revelarNuevos(tira);
  });
}
function initVisores() {
  document.querySelectorAll('[data-visor]').forEach(visor => {
    visor.querySelector('[data-visor-tira]').addEventListener('click', e => {
      const b = e.target.closest('[data-medio]');
      if (!b) return;
      const m = mediosTodos().find(x => x.id === b.dataset.medio);
      mostrarMedio(visor, m, true);
    });
  });
  pintarVisores();
}

const P = { tab: 'pedidos', ped: { filtro: 'espera', buscar: '', cursor: null }, num: { filtro: 'todos', buscar: '', cursor: null } };
let cerrarMenu = () => {};
function initPanel() {
  const panel = document.getElementById('panel');
  if (!panel) return;
  const tabs = [...panel.querySelectorAll('[data-ptab]')];
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-abrir-panel]');
    if (!b) return;
    e.preventDefault();
    cerrarMenu();
    abrirPanel(b.dataset.abrirPanel || 'pedidos', b);
  });
  panel.querySelectorAll('[data-cerrar-panel]').forEach(b => b.addEventListener('click', () => cerrarCapa(panel)));
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => elegirTab(t.dataset.ptab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(k + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      elegirTab(sig.dataset.ptab);
      sig.focus();
    });
  });

  const lista = panel.querySelector('[data-pp-lista]');
  let esperaPed = 0;
  panel.querySelector('[data-pp-buscar]').addEventListener('input', e => {
    clearTimeout(esperaPed);
    esperaPed = setTimeout(() => { P.ped.buscar = e.target.value; pintarPedidos(true); }, 180);
  });
  panel.querySelectorAll('[data-pp-filtro]').forEach(b => b.addEventListener('click', () => {
    P.ped.filtro = b.dataset.ppFiltro;
    panel.querySelectorAll('[data-pp-filtro]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarPedidos(true);
  }));
  panel.querySelector('[data-pp-mas]').addEventListener('click', () => pintarPedidos(false));
  lista.addEventListener('click', e => {
    const a = e.target.closest('[data-aprobar]');
    const l = e.target.closest('[data-liberar]');
    if (!a && !l) return;
    const p = a ? Rifa.aprobar(a.dataset.aprobar) : Rifa.liberar(l.dataset.liberar);
    if (!p) return;
    guardar();
    const uno = p.numeros.length === 1;
    showToast(a
      ? `Venta confirmada: ${listaNums(p.numeros)} ${uno ? 'figura' : 'figuran'} como ${uno ? 'vendido' : 'vendidos'}.`
      : `Liberado: ${listaNums(p.numeros)} ${uno ? 'vuelve' : 'vuelven'} a estar ${uno ? 'libre' : 'libres'}.`);
    refrescarTodo();
    panel.querySelector('#pp-pedidos').focus({ preventScroll: true });
  });

  const grid = panel.querySelector('[data-ppn-grid]');
  let esperaNum = 0;
  panel.querySelector('[data-ppn-buscar]').addEventListener('input', e => {
    clearTimeout(esperaNum);
    esperaNum = setTimeout(() => { P.num.buscar = e.target.value.replace(/\D/g, ''); pintarPanelNumeros(true); }, 180);
  });
  panel.querySelectorAll('[data-ppn-filtro]').forEach(b => b.addEventListener('click', () => {
    P.num.filtro = b.dataset.ppnFiltro;
    panel.querySelectorAll('[data-ppn-filtro]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarPanelNumeros(true);
  }));
  panel.querySelector('[data-ppn-mas]').addEventListener('click', () => pintarPanelNumeros(false));
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    const n = Number(b.dataset.n);
    const sig = Rifa.ciclar(n);
    if (!sig) return;
    guardar();
    b.className = `pnum pnum--${sig}`;
    b.setAttribute('aria-label', `Número ${Rifa.fmt(n)}: ${sig}. Tocá para cambiar`);
    T.sel.delete(n);
    pintarCuentas();
    pintarTablero(false);
  });

  const form = panel.querySelector('[data-pp-rifa]');
  const err = panel.querySelector('[data-pp-rifa-err]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    err.hidden = true;
    const d = Object.fromEntries(new FormData(form));
    const fallar = msg => { err.textContent = msg; err.hidden = false; };
    if (!limpiar(d.premio, 60) || !limpiar(d.titulo, 90) || !limpiar(d.boton, 28)) return fallar('Completá el premio, el título y el texto del botón.');
    const valor = Math.round(Number(d.valor));
    if (!Number.isFinite(valor) || valor < 100 || valor > 10000000) return fallar('El valor del número va de $100 a $10.000.000.');
    if (Number(d.cantidad) !== Rifa.total()) {
      const r = Rifa.setCantidad(d.cantidad);
      if (!r.ok) return fallar(r.error === 'ocupados' ? `No podés bajar a ${d.cantidad} números: el ${Rifa.fmt(r.n)} ya está reservado o vendido. Liberalo primero.` : 'Elegí una cantidad de la lista.');
      T.pila = [null];
    }
    Rifa.setConfig({ premio: d.premio, detalle: d.detalle, titulo: d.titulo, bajada: d.bajada, boton: d.boton, valor, fecha: d.fecha, modalidad: d.modalidad });
    guardar();
    refrescarTodo();
    cargarFormRifa();
    showToast('Cambios guardados: ya se ven en la página.');
  });
  const reset = panel.querySelector('[data-pp-reset]');
  let armado = 0;
  reset.addEventListener('click', () => {
    const etq = reset.querySelector('span');
    if (!armado) {
      etq.textContent = '¿Seguro? Tocá de nuevo';
      armado = setTimeout(() => { armado = 0; etq.textContent = 'Volver al ejemplo'; }, 3500);
      return;
    }
    clearTimeout(armado);
    armado = 0;
    etq.textContent = 'Volver al ejemplo';
    reemplazarEstado(estadoInicial());
    mediosSesion.length = 0;
    guardar();
    T.sel.clear();
    T.pila = [null];
    refrescarTodo();
    pintarVisores();
    cargarFormRifa();
    showToast('Listo: la rifa volvió a los datos de ejemplo.');
  });

  const listaImg = panel.querySelector('[data-ppi-lista]');
  listaImg.addEventListener('click', e => {
    const b = e.target.closest('[data-ppi]');
    if (!b) return;
    const id = b.dataset.id;
    const k = ESTADO.medios.findIndex(m => m.id === id);
    if (k < 0) return;
    const accion = b.dataset.ppi;
    if (accion === 'arriba' && k > 0) [ESTADO.medios[k - 1], ESTADO.medios[k]] = [ESTADO.medios[k], ESTADO.medios[k - 1]];
    else if (accion === 'abajo' && k < ESTADO.medios.length - 1) [ESTADO.medios[k + 1], ESTADO.medios[k]] = [ESTADO.medios[k], ESTADO.medios[k + 1]];
    else if (accion === 'ver') {
      const visibles = ESTADO.medios.filter(m => m.visible).length;
      if (ESTADO.medios[k].visible && visibles === 1) { showToast('Dejá al menos una foto visible.'); return; }
      ESTADO.medios[k].visible = !ESTADO.medios[k].visible;
    } else return;
    guardar();
    pintarVisores();
    pintarPanelImagenes();
    listaImg.querySelector(`[data-ppi="${accion}"][data-id="${CSS.escape(id)}"]`)?.focus();
  });
  panel.querySelector('[data-ppi-subir]').addEventListener('change', e => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    const prueba = new Image();
    prueba.onload = () => {
      const id = `subida-${Date.now()}`;
      mediosSesion.push({ id, tipo: 'foto', src: url, w: prueba.naturalWidth, h: prueba.naturalHeight, alt: `Foto del premio: ${limpiar(f.name, 40)}`, cap: 'Foto nueva', fondo: '#FFFFFF', ajuste: 'contain' });
      ESTADO.medios.unshift({ id, visible: true });
      pintarVisores();
      pintarPanelImagenes();
      showToast('Foto agregada como portada del premio.');
    };
    prueba.onerror = () => showToast('No pudimos leer esa imagen. Probá con otra.');
    prueba.src = url;
  });
}
function abrirPanel(cual = 'pedidos', previo = document.activeElement) {
  const panel = document.getElementById('panel');
  if (!panel || capas.some(c => c.el === panel)) return;
  abrirCapa(panel, { previo });
  elegirTab(['pedidos', 'numeros', 'rifa', 'imagenes'].includes(cual) ? cual : 'pedidos');
  setTimeout(() => panel.querySelector(`#ptab-${P.tab}`)?.focus({ preventScroll: true }), 60);
}
function elegirTab(cual) {
  const panel = document.getElementById('panel');
  P.tab = cual;
  panel.querySelectorAll('[data-ptab]').forEach(t => {
    const activo = t.dataset.ptab === cual;
    t.setAttribute('aria-selected', String(activo));
    t.tabIndex = activo ? 0 : -1;
  });
  panel.querySelectorAll('.ppanel').forEach(s => { s.hidden = s.id !== `pp-${cual}`; });
  pintarTabPanel();
}
function pintarTabPanel() {
  const panel = document.getElementById('panel');
  if (!panel || panel.hidden) return;
  if (P.tab === 'pedidos') pintarPedidos(true);
  else if (P.tab === 'numeros') pintarPanelNumeros(true);
  else if (P.tab === 'rifa') cargarFormRifa();
  else pintarPanelImagenes();
}
function pedidoHTML(p) {
  const estados = { espera: 'Esperando comprobante', aprobado: 'Venta confirmada', liberado: 'Liberado' };
  const nums = p.numeros.map(n => `<span class="chip-num chip-num--mini">${Rifa.fmt(n)}</span>`).join('');
  const tel = telParaWa(p.tel);
  const chat = p.origen === 'web' && tel
    ? `<a class="btn btn--ghost btn--xs" href="${esc(wspHref(`Hola ${p.nombre.split(' ')[0]}! Te escribimos de Super Rifas por tu reserva ${p.id}.`, tel))}" target="_blank" rel="noopener">${ICO.wsp}<span>Escribirle</span></a>`
    : '';
  const acciones = p.estado === 'espera'
    ? `<button type="button" class="btn btn--cta btn--xs" data-aprobar="${esc(p.id)}">${ICO.check}<span>Aprobar venta</span></button><button type="button" class="btn btn--ghost btn--xs" data-liberar="${esc(p.id)}"><span>Liberar</span></button>`
    : '';
  return `<li class="ped ped--${p.estado}">
    <div class="ped__quien"><p class="ped__nombre">${esc(p.nombre)}</p><p class="ped__meta">${esc(p.id)} · ${esc(fechaCorta(p.ts))} · ${esc(p.tel || 'sin teléfono')}</p></div>
    <div class="ped__nums">${nums}</div>
    <p class="ped__total">${precio(p.total)}</p>
    <p class="ped__estado"><i class="dot dot--${p.estado === 'espera' ? 'reservado' : p.estado === 'aprobado' ? 'vendido' : 'libre'}" aria-hidden="true"></i>${estados[p.estado]}</p>
    <div class="ped__acciones">${acciones}${chat}</div>
  </li>`;
}
function pintarPedidos(reset = true) {
  const panel = document.getElementById('panel');
  const lista = panel.querySelector('[data-pp-lista]');
  if (reset) { P.ped.cursor = null; lista.innerHTML = ''; }
  const res = Rifa.consultarPedidos({ filtro: P.ped.filtro, buscar: P.ped.buscar, cursor: P.ped.cursor, limite: TOPE });
  lista.insertAdjacentHTML('beforeend', res.items.map(pedidoHTML).join(''));
  P.ped.cursor = res.cursor;
  panel.querySelector('[data-pp-mas]').hidden = res.cursor == null;
  const n = lista.children.length;
  panel.querySelector('[data-pp-info]').textContent = n ? `Mostrando ${plural(n, 'pedido', 'pedidos')}${res.cursor != null ? ' · hay más' : ''}` : 'No hay pedidos con ese filtro.';
}
function pintarPanelNumeros(reset = true) {
  const panel = document.getElementById('panel');
  const grid = panel.querySelector('[data-ppn-grid]');
  if (reset) { P.num.cursor = null; grid.innerHTML = ''; }
  const res = Rifa.consultar({ filtro: P.num.filtro, buscar: P.num.buscar, cursor: P.num.cursor, limite: TOPE });
  grid.classList.toggle('pp-grid--3', Rifa.digitos() > 2);
  grid.insertAdjacentHTML('beforeend', res.items.map(it => `<button type="button" class="pnum pnum--${it.estado}" data-n="${it.n}" aria-label="Número ${it.txt}: ${it.estado}. Tocá para cambiar">${it.txt}</button>`).join(''));
  P.num.cursor = res.cursor;
  panel.querySelector('[data-ppn-mas]').hidden = res.cursor == null;
  const n = grid.children.length;
  panel.querySelector('[data-ppn-info]').textContent = n ? `Mostrando ${plural(n, 'número', 'números')} de ${Rifa.total().toLocaleString('es-AR')}${res.cursor != null ? ' · hay más' : ''}` : 'Ningún número coincide.';
}
function cargarFormRifa() {
  const form = document.querySelector('[data-pp-rifa]');
  if (!form) return;
  const c = ESTADO.config;
  ['premio', 'detalle', 'titulo', 'bajada', 'boton', 'valor', 'fecha', 'modalidad'].forEach(k => { form.elements[k].value = c[k]; });
  form.elements.cantidad.value = String(c.cantidad);
}
function pintarPanelImagenes() {
  const lista = document.querySelector('[data-ppi-lista]');
  if (!lista) return;
  const mapa = new Map(mediosTodos().map(m => [m.id, m]));
  const filas = ESTADO.medios.filter(x => mapa.has(x.id));
  const portada = filas.find(x => x.visible)?.id;
  lista.innerHTML = filas.map((x, k) => {
    const m = mapa.get(x.id);
    const rol = x.id === portada ? 'Portada' : m.tipo === 'video' ? 'Video' : 'Foto';
    return `<li class="ppi${x.visible ? '' : ' ppi--oculta'}">
      <span class="ppi__img" style="background:${esc(m.fondo)}"><img src="${esc(m.tipo === 'video' ? m.poster : m.src)}" alt="" width="${m.w}" height="${m.h}"></span>
      <span class="ppi__txt"><span class="ppi__cap">${esc(m.cap)}</span><span class="ppi__rol">${x.visible ? rol : 'Oculta'}</span></span>
      <span class="ppi__acc">
        <button type="button" class="icon-btn" data-ppi="arriba" data-id="${esc(x.id)}" aria-label="Subir ${esc(m.cap)}"${k === 0 ? ' disabled' : ''}>${ICO.arriba}</button>
        <button type="button" class="icon-btn" data-ppi="abajo" data-id="${esc(x.id)}" aria-label="Bajar ${esc(m.cap)}"${k === filas.length - 1 ? ' disabled' : ''}>${ICO.abajo}</button>
        <button type="button" class="icon-btn" data-ppi="ver" data-id="${esc(x.id)}" aria-pressed="${x.visible}" aria-label="${x.visible ? 'Ocultar' : 'Mostrar'} ${esc(m.cap)}">${x.visible ? ICO.ojo : ICO.ojoNo}</button>
      </span>
    </li>`;
  }).join('');
}

function refrescarTodo() {
  aplicarConfig();
  pintarTablero(false);
  pintarTabPanel();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1201px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  cerrarMenu = () => { if (nav.classList.contains('open')) close(); };
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const mostrar = () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
      window.removeEventListener('scroll', mostrar);
    }
  };
  window.addEventListener('scroll', mostrar, { passive: true });
  mostrar();
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.18);
  const sw = hero.querySelector('.swoosh');
  if (sw) tl.fromTo(sw, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.5);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.boleto', { y: 40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.62);
  desde('.boleto .ticket__talon > *', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.85);
  desde('.avance__barra span', { scaleX: 0, transformOrigin: '0 50%', duration: 1.3, clearProps: 'transform' }, 1);
}

window.addEventListener('storage', e => {
  if (e.key !== KEY) return;
  reemplazarEstado(cargarEstado());
  refrescarTodo();
  pintarVisores();
});

aplicarConfig();
initVisores();
initTablero();
initCompra();
initReveals();
initHeroMotion();
initNav();
initPanel();
initWspFloat();
initModelBarScroll();
