const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));

const WSP = '5493764838258';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'mesa-9x16.webp': [941, 1672],
  'local-16x9.webp': [1672, 941],
  'colores-1x1.webp': [1254, 1254],
  'basquet-voley-hockey-1x1.webp': [1254, 1254],
  'campera-pantalon-1x1.webp': [1254, 1254],
  'entrenamiento-1x1.webp': [1254, 1254],
};

const DEPORTES = [
  { id: 'futbol', label: 'Fútbol' },
  { id: 'basquet', label: 'Básquet' },
  { id: 'voley', label: 'Vóley' },
  { id: 'hockey', label: 'Hockey' },
  { id: 'entrenamiento', label: 'Entrenamiento' },
];

const PRENDAS = [
  { id: 'camiseta', label: 'Camisetas', uno: 'camiseta' },
  { id: 'short', label: 'Shorts', uno: 'short' },
  { id: 'conjunto', label: 'Conjuntos', uno: 'conjunto' },
  { id: 'musculosa', label: 'Musculosas', uno: 'musculosa' },
  { id: 'remera', label: 'Remeras', uno: 'remera' },
  { id: 'campera', label: 'Camperas', uno: 'campera' },
  { id: 'pantalon', label: 'Pantalones', uno: 'pantalón' },
];

const BASE = {
  'Blanco': '#FFFFFF', 'Negro': '#111827', 'Rojo': '#DC2626', 'Azul': '#2563EB', 'Amarillo': '#FACC15', 'Verde': '#16A34A',
  'Naranja': '#F97316', 'Gris': '#9CA3AF', 'Violeta': '#7C3AED', 'Fucsia': '#DB2777', 'Azul marino': '#1E3A8A',
  'Verde oliva': '#4D5B36', 'Amarillo flúor': '#D9F21B',
};
const MEZCLAS = {
  'Blanco y azul': ['Blanco', 'Azul'], 'Rojo y negro': ['Rojo', 'Negro'], 'Negro y blanco': ['Negro', 'Blanco'], 'Negro y rojo': ['Negro', 'Rojo'],
  'Negro y verde': ['Negro', 'Verde'], 'Fucsia y negro': ['Fucsia', 'Negro'], 'Blanco y violeta': ['Blanco', 'Violeta'], 'Verde y blanco': ['Verde', 'Blanco'],
  'Azul marino y fucsia': ['Azul marino', 'Fucsia'], 'Gris y flúor': ['Gris', 'Amarillo flúor'],
};
const basesDe = c => MEZCLAS[c] || [c];
const swatchHTML = c => {
  const [a, b] = basesDe(c).map(x => BASE[x] || '#ccc');
  return b ? `<span class="swatch partido" style="--c:${a};--c2:${b}"></span>` : `<span class="swatch" style="--c:${a}"></span>`;
};

const TALLES = { ninos: ['6', '8', '10', '12', '14', '16'], adultos: ['S', 'M', 'L', 'XL', 'XXL'] };
const GRUPO_LABEL = { ninos: 'Niños', adultos: 'Adultos' };
const LISOS = ['Blanco', 'Rojo', 'Azul', 'Amarillo', 'Negro', 'Verde'];
const AMBOS = ['ninos', 'adultos'];
const ADULTOS = ['adultos'];

const PRODUCTOS = [
  {
    id: 1, num: '01', slug: 'camiseta-lisa', nombre: 'Camiseta lisa', deporte: 'futbol', prenda: 'camiseta', colores: LISOS, grupos: AMBOS, orden: 1,
    desc: 'Camiseta de fútbol de cuello redondo con paneles negros en los hombros. El mismo modelo en seis colores, para que cada equipo tenga el suyo.',
    img: 'colores-1x1.webp', foco: [0.47, 0.27, 1.45], alt: 'Camisetas lisas colgadas en blanco, rojo, azul, amarillo, negro y verde',
    porColor: { Blanco: [0.22, 0.28, 2.3], Rojo: [0.44, 0.3, 2.6], Azul: [0.565, 0.31, 2.6], Amarillo: [0.67, 0.32, 2.7], Negro: [0.77, 0.33, 2.8], Verde: [0.87, 0.34, 2.8] },
  },
  {
    id: 2, num: '02', slug: 'short-liso', nombre: 'Short liso', deporte: 'futbol', prenda: 'short', colores: LISOS, grupos: AMBOS, orden: 2,
    desc: 'Short de fútbol con cintura elástica y vivo lateral. Combina con la camiseta lisa del mismo color.',
    img: 'colores-1x1.webp', foco: [0.5, 0.82, 1.6], alt: 'Shorts lisos colgados en seis colores',
    porColor: { Blanco: [0.16, 0.86, 2.6], Rojo: [0.35, 0.86, 2.6], Azul: [0.51, 0.85, 2.6], Amarillo: [0.66, 0.82, 2.6], Negro: [0.8, 0.8, 2.7], Verde: [0.91, 0.78, 2.7] },
  },
  {
    id: 3, num: '03', slug: 'camiseta-tormenta', nombre: 'Camiseta Tormenta', deporte: 'futbol', prenda: 'camiseta', colores: ['Blanco y azul'], grupos: AMBOS, orden: 4,
    desc: 'Camiseta sublimada blanca con trazos azules y cuello en V.',
    img: 'mesa-9x16.webp', foco: [0.17, 0.3, 2.1], alt: 'Camiseta sublimada blanca con trazos azules en un maniquí',
  },
  {
    id: 4, num: '04', slug: 'camiseta-noche', nombre: 'Camiseta Noche', deporte: 'futbol', prenda: 'camiseta', colores: ['Negro'], grupos: AMBOS, orden: 7,
    desc: 'Camiseta sublimada negra con textura en tono sobre tono.',
    img: 'mesa-9x16.webp', foco: [0.52, 0.3, 2.1], alt: 'Camiseta sublimada negra en un maniquí',
  },
  {
    id: 5, num: '05', slug: 'camiseta-fuego', nombre: 'Camiseta Fuego', deporte: 'futbol', prenda: 'camiseta', colores: ['Rojo'], grupos: AMBOS, orden: 9,
    desc: 'Camiseta sublimada roja con puños y cuello negros.',
    img: 'mesa-9x16.webp', foco: [0.84, 0.36, 2.1], alt: 'Camiseta sublimada roja en un maniquí',
  },
  {
    id: 6, num: '06', slug: 'camiseta-camuflada', nombre: 'Camiseta Camuflada', deporte: 'futbol', prenda: 'camiseta', colores: ['Rojo y negro', 'Azul'], grupos: ADULTOS, orden: 13,
    desc: 'Camiseta con estampa camuflada, en rojo y negro o en azul.',
    img: 'mesa-9x16.webp', foco: [0.14, 0.52, 2.4], alt: 'Camisetas dobladas con estampa camuflada roja y negra',
    porColor: { 'Rojo y negro': [0.14, 0.52, 2.4], Azul: [0.25, 0.575, 2.4] },
  },
  {
    id: 7, num: '07', slug: 'short-con-vivo', nombre: 'Short con vivo', deporte: 'futbol', prenda: 'short', colores: ['Negro y blanco', 'Negro y rojo'], grupos: AMBOS, orden: 10,
    desc: 'Short negro con vivo lateral en blanco o en rojo.',
    img: 'mesa-9x16.webp', foco: [0.55, 0.66, 2], alt: 'Shorts negros doblados con vivo lateral',
    porColor: { 'Negro y blanco': [0.55, 0.66, 2], 'Negro y rojo': [0.41, 0.67, 2.4] },
  },
  {
    id: 8, num: '08', slug: 'conjunto-nocturno', nombre: 'Conjunto Nocturno', deporte: 'futbol', prenda: 'conjunto', colores: ['Negro y verde'], grupos: AMBOS, orden: 3,
    desc: 'Camiseta y short negros con vivos verdes. El conjunto completo para salir a la cancha.',
    img: 'local-16x9.webp', foco: [0.525, 0.44, 1.9], alt: 'Conjunto de fútbol negro con vivos verdes en un maniquí',
  },
  {
    id: 9, num: '09', slug: 'camiseta-clasica', nombre: 'Camiseta Clásica', deporte: 'futbol', prenda: 'camiseta', colores: ['Azul', 'Verde', 'Blanco', 'Naranja'], grupos: ADULTOS, orden: 16,
    desc: 'Camiseta de cuello en V con vivos en contraste, en cuatro colores.',
    img: 'mesa-9x16.webp', foco: [0.66, 0.12, 2.3], alt: 'Camisetas de cuello en V azul, verde y blanca colgadas',
  },
  {
    id: 10, num: '10', slug: 'conjunto-relampago', nombre: 'Conjunto Relámpago', deporte: 'basquet', prenda: 'conjunto', colores: ['Azul'], grupos: AMBOS, orden: 5,
    desc: 'Musculosa y short de básquet sublimados en azul, con ribetes blancos.',
    img: 'local-16x9.webp', foco: [0.72, 0.42, 1.8], alt: 'Conjunto de básquet sublimado azul en un maniquí',
  },
  {
    id: 11, num: '11', slug: 'conjunto-brasa', nombre: 'Conjunto Brasa', deporte: 'basquet', prenda: 'conjunto', colores: ['Negro y rojo'], grupos: ADULTOS, orden: 11,
    desc: 'Musculosa y short de básquet negros con detalles rojos.',
    img: 'basquet-voley-hockey-1x1.webp', foco: [0.16, 0.38, 2.4], alt: 'Conjunto de básquet negro con detalles rojos en un maniquí',
  },
  {
    id: 12, num: '12', slug: 'musculosa-basquet', nombre: 'Musculosa de básquet', deporte: 'basquet', prenda: 'musculosa', colores: ['Azul', 'Fucsia y negro', 'Blanco'], grupos: ADULTOS, orden: 17,
    desc: 'Musculosa de básquet con escote en V, en tres combinaciones.',
    img: 'basquet-voley-hockey-1x1.webp', foco: [0.63, 0.14, 2.8], alt: 'Musculosas de básquet colgadas en la pared',
  },
  {
    id: 13, num: '13', slug: 'conjunto-violeta', nombre: 'Conjunto Violeta', deporte: 'voley', prenda: 'conjunto', colores: ['Blanco y violeta'], grupos: AMBOS, orden: 6,
    desc: 'Remera y short de vóley blancos con detalles violetas.',
    img: 'basquet-voley-hockey-1x1.webp', foco: [0.41, 0.36, 1.9], alt: 'Conjunto de vóley blanco con detalles violetas en un maniquí',
  },
  {
    id: 14, num: '14', slug: 'conjunto-ola', nombre: 'Conjunto Ola', deporte: 'voley', prenda: 'conjunto', colores: ['Verde y blanco'], grupos: ADULTOS, orden: 14,
    desc: 'Remera entallada y short para vóley, con estampa verde.',
    img: 'local-16x9.webp', foco: [0.91, 0.4, 2.1], alt: 'Conjunto de vóley blanco con estampa verde en un maniquí',
  },
  {
    id: 15, num: '15', slug: 'conjunto-bruma', nombre: 'Conjunto Bruma', deporte: 'hockey', prenda: 'conjunto', colores: ['Azul marino y fucsia'], grupos: AMBOS, orden: 8,
    desc: 'Remera y pollera de hockey azul marino con detalles fucsia.',
    img: 'basquet-voley-hockey-1x1.webp', foco: [0.63, 0.42, 2.2], alt: 'Conjunto de hockey azul marino con detalles fucsia en un maniquí',
  },
  {
    id: 16, num: '16', slug: 'campera-rompeviento', nombre: 'Campera rompeviento', deporte: 'entrenamiento', prenda: 'campera', colores: ['Negro y blanco'], grupos: ADULTOS, orden: 12,
    desc: 'Campera liviana con capucha, cierre y bolsillos. Para el banco de suplentes y los viajes.',
    img: 'campera-pantalon-1x1.webp', foco: [0.4, 0.44, 1.55], alt: 'Campera rompeviento blanca, gris y negra colgada en un perchero',
  },
  {
    id: 17, num: '17', slug: 'pantalon-con-franja', nombre: 'Pantalón con franja', deporte: 'entrenamiento', prenda: 'pantalon', colores: ['Negro y blanco'], grupos: ADULTOS, orden: 15,
    desc: 'Pantalón de entrenamiento con franja lateral, puño elástico y bolsillos con cierre.',
    img: 'campera-pantalon-1x1.webp', foco: [0.78, 0.52, 1.6], alt: 'Pantalón negro de entrenamiento con franja blanca',
  },
  {
    id: 18, num: '18', slug: 'remera-entrenamiento', nombre: 'Remera de entrenamiento', deporte: 'entrenamiento', prenda: 'remera', colores: ['Amarillo flúor', 'Negro', 'Gris', 'Azul'], grupos: ADULTOS, orden: 18,
    desc: 'Remera liviana para entrenar, en colores que ayudan a separar grupos en la práctica.',
    img: 'entrenamiento-1x1.webp', foco: [0.5, 0.19, 2.3], alt: 'Remera de entrenamiento amarillo flúor colgada',
  },
  {
    id: 19, num: '19', slug: 'short-entrenamiento', nombre: 'Short de entrenamiento', deporte: 'entrenamiento', prenda: 'short', colores: ['Negro', 'Verde oliva', 'Azul marino', 'Naranja'], grupos: ADULTOS, orden: 19,
    desc: 'Short de entrenamiento con bolsillo con cierre, en cuatro colores.',
    img: 'entrenamiento-1x1.webp', foco: [0.55, 0.64, 1.6], alt: 'Shorts de entrenamiento negro, verde oliva, azul marino y naranja',
  },
  {
    id: 20, num: '20', slug: 'campera-capucha', nombre: 'Campera con capucha', deporte: 'entrenamiento', prenda: 'campera', colores: ['Negro'], grupos: ADULTOS, orden: 20,
    desc: 'Campera negra con capucha y cierre completo.',
    img: 'entrenamiento-1x1.webp', foco: [0.9, 0.2, 2.8], alt: 'Campera negra con capucha colgada',
  },
  {
    id: 21, num: '21', slug: 'remera-con-vivo', nombre: 'Remera con vivo', deporte: 'entrenamiento', prenda: 'remera', colores: ['Azul marino', 'Gris y flúor', 'Negro y rojo'], grupos: ADULTOS, orden: 21,
    desc: 'Remera de entrenamiento con vivo en los hombros.',
    img: 'mesa-9x16.webp', foco: [0.5, 0.86, 2.2], alt: 'Remeras de entrenamiento dobladas con vivos en los hombros',
  },
];

const RAIL = [16, 17, 18, 19, 20, 21];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const deporteDe = id => DEPORTES.find(d => d.id === id) || { id, label: id };
const prendaDe = id => PRENDAS.find(x => x.id === id) || { id, label: id, uno: id };
const tallesDe = p => p.grupos.flatMap(g => TALLES[g]);
const tallesTxt = p => p.grupos.map(g => (g === 'ninos' ? '6 a 16' : 'S a XXL')).join(' · ');
const fotoDe = (p, color) => {
  const f = p.porColor && color && p.porColor[color];
  return f ? [p.img, f] : [p.img, p.foco];
};
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const prendas = n => cuantos(n, 'prenda', 'prendas');

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const Cart = {
  KEY: 'ng_pedido',
  enMemoria: null,
  leer() {
    if (this.enMemoria) return this.enMemoria.map(i => ({ ...i }));
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  get() {
    const crudo = this.leer();
    if (!Array.isArray(crudo)) return [];
    return crudo.reduce((lista, i) => {
      const p = getProducto(i?.id);
      const qty = Math.floor(Number(i?.qty));
      if (!p || !p.colores.includes(i.color) || !tallesDe(p).includes(String(i.talle)) || !(qty > 0)) return lista;
      lista.push({ id: p.id, color: i.color, talle: String(i.talle), qty: Math.min(qty, 999) });
      return lista;
    }, []);
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); this.enMemoria = null; } catch { this.enMemoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  ponerGrupo(p, color, cantidades) {
    const todos = this.get();
    const esGrupo = i => i.id === p.id && i.color === color;
    const lugar = todos.findIndex(esGrupo);
    const items = todos.filter(i => !esGrupo(i));
    const nuevos = Object.entries(cantidades).reduce((lista, [talle, qty]) => {
      const q = Math.floor(Number(qty));
      if (q > 0 && tallesDe(p).includes(talle)) lista.push({ id: p.id, color, talle, qty: Math.min(q, 999) });
      return lista;
    }, []);
    items.splice(lugar < 0 ? items.length : lugar, 0, ...nuevos);
    this.save(items);
  },
  sumarGrupo(p, color, cantidades) {
    const items = this.get();
    let n = 0;
    Object.entries(cantidades).forEach(([talle, qty]) => {
      const q = Math.floor(Number(qty));
      if (!(q > 0) || !tallesDe(p).includes(talle)) return;
      const it = items.find(i => i.id === p.id && i.color === color && i.talle === talle);
      if (it) it.qty = Math.min(it.qty + q, 999); else items.push({ id: p.id, color, talle, qty: Math.min(q, 999) });
      n += q;
    });
    if (n) this.save(items);
    return n;
  },
  quitarGrupo(id, color) { this.save(this.get().filter(i => !(i.id === Number(id) && i.color === color))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  grupos() {
    const mapa = new Map();
    this.get().forEach(i => {
      const k = `${i.id}|${i.color}`;
      if (!mapa.has(k)) mapa.set(k, { p: getProducto(i.id), color: i.color, talles: {} });
      mapa.get(k).talles[i.talle] = (mapa.get(k).talles[i.talle] || 0) + i.qty;
    });
    return [...mapa.values()].map(g => ({ ...g, total: Object.values(g.talles).reduce((s, n) => s + n, 0) }));
  },
};

const ordenTalles = (p, talles) => tallesDe(p).filter(t => talles[t]).map(t => [t, talles[t]]);

function mensajePedido() {
  const grupos = Cart.grupos();
  if (!grupos.length) return 'Hola! Quiero hacer un pedido.';
  const lineas = grupos.map((g, k) => `${k + 1}) ${g.p.nombre} · ${g.color} (Nº ${g.p.num})\n   ${ordenTalles(g.p, g.talles).map(([t, n]) => `${t}: ${n}`).join(', ')} → ${prendas(g.total)}`);
  return `Hola! Quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${prendas(Cart.count())}.`;
}

const DIST = {
  adultos: { S: 0.12, M: 0.3, L: 0.3, XL: 0.18, XXL: 0.1 },
  ninos: { 6: 0.08, 8: 0.15, 10: 0.22, 12: 0.25, 14: 0.2, 16: 0.1 },
};

function repartir(cat, n) {
  const d = DIST[cat];
  const talles = TALLES[cat];
  const base = talles.map(t => ({ t, v: d[t] * n }));
  const res = Object.fromEntries(base.map(x => [x.t, Math.floor(x.v)]));
  let resto = n - Object.values(res).reduce((s, v) => s + v, 0);
  [...base].sort((a, b) => (b.v - Math.floor(b.v)) - (a.v - Math.floor(a.v)) || d[b.t] - d[a.t]).forEach(x => {
    if (resto > 0) { res[x.t] += 1; resto -= 1; }
  });
  return res;
}

const Curva = {
  KEY: 'ng_curva',
  estado: null,
  leer() {
    if (this.estado) return this.estado;
    try {
      const e = JSON.parse(window.sessionStorage.getItem(this.KEY));
      if (e && TALLES[e.cat] && e.n >= 5 && e.n <= 30) this.estado = { cat: e.cat, n: e.n, usada: !!e.usada };
    } catch { this.estado = null; }
    return this.estado || { cat: 'adultos', n: 15, usada: false };
  },
  guardar(e) {
    this.estado = e;
    try { window.sessionStorage.setItem(this.KEY, JSON.stringify(e)); } catch { this.estado = e; }
    document.dispatchEvent(new CustomEvent('curva:cambio'));
  },
  reparto() { const e = this.leer(); return repartir(e.cat, e.n); },
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1000px)');
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

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  revealsListos = true;
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
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => el.classList.add('in'), 500);
  });
}

let ultimoFoco = null;
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

const scrollSuave = el => el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initRecortesEstaticos() {
  const els = [...document.querySelectorAll('[data-recorte]')];
  if (!els.length) return;
  const encuadrar = () => els.forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    const r = el.getBoundingClientRect();
    const ar = r.width && r.height ? r.width / r.height : 1;
    const resto = (el.getAttribute('style') || '').replace(/--(op|to|z):[^;]*;?/g, '').replace(/^[\s;]+|[\s;]+$/g, '');
    el.setAttribute('style', `${resto ? resto + ';' : ''}${recorte(img, [Number(cx), Number(cy), Number(z)], ar)}`);
  });
  encuadrar();
  let frame = 0;
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; encuadrar(); }); }, { passive: true });
}

function initCuentas() {
  document.querySelectorAll('[data-total-modelos]').forEach(el => { el.textContent = PRODUCTOS.length; });
}

function tarjetaHTML(p, clase = 'prod', ar = 1) {
  const media = clase === 'prod' ? 'prod-media' : 'rail-media';
  return `<article class="${clase}"${clase === 'prod' ? ' data-animate style="opacity:0;transform:translateY(40px)"' : ''}>
    <div class="${media} recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, ar)}">
      <span class="dorsal-tag"><small>Nº</small>${esc(p.num)}</span>
      <span class="deporte-tag">${esc(deporteDe(p.deporte).label)}</span>
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="${Math.round(600 / ar)}">
    </div>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${esc(prendaDe(p.prenda).uno)} · ${esc(cuantos(p.colores.length, 'color', 'colores'))}</p>
      <div class="prod-fila">
        <span class="swatches" aria-label="Colores: ${esc(p.colores.join(', '))}">${p.colores.map(swatchHTML).join('')}</span>
        <span class="prod-talles">${esc(tallesTxt(p))}</span>
      </div>
      <div class="prod-actions">
        <button type="button" class="btn btn-ghost prod-add" data-open-quickview="${p.id}" aria-label="Elegir colores y talles de ${esc(p.nombre)}"><span class="lbl-largo">Elegir talles</span><span class="lbl-corto">Talles</span></button>
      </div>
    </div>
  </article>`;
}

function filaHTML(p) {
  return `<article class="fila" data-animate style="opacity:0;transform:translateX(-24px)">
    <div class="fila-foto recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, 1)}">
      <span class="dorsal-tag"><small>Nº</small>${esc(p.num)}</span>
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="176" height="176">
    </div>
    <div class="fila-info">
      <h3 class="fila-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${esc(deporteDe(p.deporte).label)} · ${esc(prendaDe(p.prenda).uno)}</p>
      <div class="fila-datos">
        <span class="swatches" aria-label="Colores: ${esc(p.colores.join(', '))}">${p.colores.map(swatchHTML).join('')}</span>
        <span class="prod-talles">Talles ${esc(tallesTxt(p))}</span>
      </div>
    </div>
    <button type="button" class="btn btn-ghost prod-add" data-open-quickview="${p.id}" aria-label="Elegir colores y talles de ${esc(p.nombre)}">Elegir talles</button>
  </article>`;
}

const Filtro = { deportes: new Set(), prendas: new Set(), colores: new Set(), talles: new Set(), q: '', orden: 'destacados' };
const PAGINA = 16;
let visibles = PAGINA;
const Catalogo = {};

function textoCorto(p) { return normalizar([p.nombre, `n ${p.num}`, deporteDe(p.deporte).label, prendaDe(p.prenda).label, prendaDe(p.prenda).uno].join(' ')); }
function textoBusqueda(p) { return normalizar([textoCorto(p), p.desc, p.colores.join(' '), p.colores.flatMap(basesDe).join(' '), p.grupos.map(g => GRUPO_LABEL[g]).join(' ')].join(' ')); }
function coincide(p, w) {
  if (w.length > 2) return textoBusqueda(p).includes(w);
  return textoCorto(p).split(/[^a-z0-9]+/).includes(w);
}

function filtrar() {
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (Filtro.deportes.size && !Filtro.deportes.has(p.deporte)) return false;
    if (Filtro.prendas.size && !Filtro.prendas.has(p.prenda)) return false;
    if (Filtro.colores.size && !p.colores.some(c => basesDe(c).some(b => Filtro.colores.has(b)))) return false;
    if (Filtro.talles.size && !p.grupos.some(g => Filtro.talles.has(g))) return false;
    if (palabras.length && !palabras.every(w => coincide(p, w))) return false;
    return true;
  });
  if (Filtro.orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else if (Filtro.orden === 'deporte') lista = [...lista].sort((a, b) => DEPORTES.findIndex(d => d.id === a.deporte) - DEPORTES.findIndex(d => d.id === b.deporte) || a.orden - b.orden);
  else lista = [...lista].sort((a, b) => a.orden - b.orden);
  return lista;
}

function sincronizarDeportes() {
  const uno = Filtro.deportes.size === 1 ? [...Filtro.deportes][0] : '';
  document.querySelectorAll('[data-deporte-chip]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.deporteChip === (Filtro.deportes.size ? uno : '')));
  });
}

function initDeportesBar() {
  const bar = document.querySelector('[data-deportes]');
  if (!bar) return;
  bar.innerHTML = [{ id: '', label: 'Todo' }, ...DEPORTES].map(d => `<button type="button" class="chip-deporte" data-deporte-chip="${d.id}" aria-pressed="${d.id === ''}">${esc(d.label)}</button>`).join('');
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-deporte-chip]');
    if (b && Catalogo.aplicar) Catalogo.aplicar({ deportes: b.dataset.deporteChip ? [b.dataset.deporteChip] : [] });
  });
}

function initCatalogoGrilla() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const filtros = root.querySelector('.filtros');
  const resultados = root.querySelector('[data-resultados]');
  const activos = root.querySelector('[data-activos]');
  const orden = root.querySelector('[data-orden]');
  const vermas = root.querySelector('[data-vermas]');
  const inicio = root.querySelector('[data-catalogo-inicio]');
  const verResultados = root.querySelector('[data-ver-resultados]');
  const busca = document.querySelector('[data-header-busca] input');

  const opcion = (grupo, id, label, n) => `<label class="filtro-opcion"><input type="checkbox" data-f="${grupo}" value="${esc(id)}"> ${esc(label)}<em>${n}</em></label>`;
  root.querySelector('[data-grupo="deporte"]').innerHTML = DEPORTES.map(d => opcion('deporte', d.id, d.label, PRODUCTOS.filter(p => p.deporte === d.id).length)).join('');
  root.querySelector('[data-grupo="prenda"]').innerHTML = PRENDAS.map(x => opcion('prenda', x.id, x.label, PRODUCTOS.filter(p => p.prenda === x.id).length)).join('');
  root.querySelector('[data-grupo="talle"]').innerHTML = ['ninos', 'adultos'].map(g => opcion('talle', g, `${GRUPO_LABEL[g]} (${g === 'ninos' ? '6 a 16' : 'S a XXL'})`, PRODUCTOS.filter(p => p.grupos.includes(g)).length)).join('');
  const basesUsadas = Object.keys(BASE).filter(b => PRODUCTOS.some(p => p.colores.some(c => basesDe(c).includes(b))));
  root.querySelector('[data-grupo="color"]').innerHTML = basesUsadas.map(b => `<label class="filtro-color" title="${esc(b)}"><input type="checkbox" data-f="color" value="${esc(b)}" aria-label="${esc(b)}"><span class="swatch" style="--c:${BASE[b]}"></span></label>`).join('');

  const conjuntos = { deporte: 'deportes', prenda: 'prendas', color: 'colores', talle: 'talles' };
  const leer = () => { Object.entries(conjuntos).forEach(([g, k]) => { Filtro[k] = new Set([...root.querySelectorAll(`input[data-f="${g}"]:checked`)].map(i => i.value)); }); };
  const escribir = () => {
    Object.entries(conjuntos).forEach(([g, k]) => { root.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = Filtro[k].has(i.value); }); });
    if (orden) orden.value = Filtro.orden;
    if (busca && busca.value !== Filtro.q) busca.value = Filtro.q;
  };
  const etiquetas = () => {
    const chips = [];
    Filtro.deportes.forEach(v => chips.push(['deportes', v, deporteDe(v).label]));
    Filtro.prendas.forEach(v => chips.push(['prendas', v, prendaDe(v).label]));
    Filtro.colores.forEach(v => chips.push(['colores', v, v]));
    Filtro.talles.forEach(v => chips.push(['talles', v, GRUPO_LABEL[v]]));
    if (Filtro.q) chips.push(['q', '', `“${Filtro.q}”`]);
    activos.innerHTML = chips.map(([k, v, l]) => `<button type="button" class="activo" data-quitar="${k}|${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`).join('');
  };

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    const lista = filtrar();
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'modelo' : 'modelos'}`;
    if (verResultados) verResultados.textContent = `Ver ${cuantos(lista.length, 'modelo', 'modelos')}`;
    etiquetas();
    sincronizarDeportes();
    if (!lista.length) {
      grid.innerHTML = '<div class="catalogo-vacio"><b>No encontramos ese modelo</b><span>Probá con otra palabra o limpiá los filtros.</span><button type="button" class="btn btn-cta" data-limpiar-todo>Ver todo el catálogo</button></div>';
      vermas.hidden = true;
      refrescarTriggers();
      return;
    }
    grid.innerHTML = lista.slice(0, visibles).map(p => tarjetaHTML(p)).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más modelos (${lista.length - Math.min(visibles, lista.length)})`;
    revelarNuevos(grid);
    refrescarTriggers();
  };

  const limpiar = () => {
    Filtro.deportes.clear(); Filtro.prendas.clear(); Filtro.colores.clear(); Filtro.talles.clear(); Filtro.q = ''; Filtro.orden = 'destacados';
    escribir(); render(true);
  };

  root.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leer(); render(true); } });
  root.querySelector('.filtros-limpiar')?.addEventListener('click', limpiar);
  grid.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) limpiar(); });
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [k, v] = b.dataset.quitar.split('|');
    if (k === 'q') Filtro.q = ''; else Filtro[k].delete(v);
    escribir(); render(true);
  });
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });
  busca?.addEventListener('input', () => { Filtro.q = busca.value; render(true); });
  busca?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = busca.value; render(true); scrollSuave(inicio); });

  const toggle = root.querySelector('.filtros-toggle');
  const cerrar = root.querySelector('.filtros-cerrar');
  let fondo = null;
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); fondo?.remove(); fondo = null; document.body.classList.remove('no-scroll');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  const abrirFiltros = () => {
    filtros.classList.add('open'); document.body.classList.add('no-scroll'); toggle?.setAttribute('aria-expanded', 'true');
    fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; fondo.addEventListener('click', cerrarFiltros); document.body.appendChild(fondo);
    trapFocus(filtros); cerrar?.focus();
  };
  toggle?.addEventListener('click', abrirFiltros);
  cerrar?.addEventListener('click', () => { cerrarFiltros(); toggle?.focus(); });
  verResultados?.addEventListener('click', () => { cerrarFiltros(); scrollSuave(inicio); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) { cerrarFiltros(); toggle?.focus(); } });

  Catalogo.aplicar = ({ deportes = [], colores = [] } = {}) => {
    Filtro.deportes = new Set(deportes); Filtro.prendas.clear(); Filtro.colores = new Set(colores); Filtro.talles.clear(); Filtro.q = '';
    escribir(); render(true); scrollSuave(inicio);
  };
  Catalogo.irA = () => scrollSuave(inicio);
  render(true);
}

function initCatalogoLista() {
  const root = document.querySelector('[data-lista]');
  if (!root) return;
  const lista = root.querySelector('[data-lista-items]');
  const tabs = root.querySelector('[data-tabs]');
  const busca = root.querySelector('[data-lista-busca] input');
  const vermas = root.querySelector('[data-vermas]');
  const resultados = root.querySelector('[data-resultados]');
  const inicio = root.querySelector('[data-lista-inicio]');
  let tab = '';

  tabs.innerHTML = [{ id: '', label: 'Todo' }, ...DEPORTES].map(d => `<button type="button" class="chip-deporte" data-tab="${d.id}" aria-pressed="${d.id === ''}">${esc(d.label)} <span class="kicker">${d.id ? PRODUCTOS.filter(p => p.deporte === d.id).length : PRODUCTOS.length}</span></button>`).join('');

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    Filtro.deportes = new Set(tab ? [tab] : []);
    const items = filtrar();
    tabs.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab === tab)));
    resultados.innerHTML = `<b>${items.length}</b> ${items.length === 1 ? 'modelo' : 'modelos'}`;
    if (!items.length) {
      lista.innerHTML = '<div class="catalogo-vacio"><b>No encontramos ese modelo</b><span>Probá con otra palabra o mirá todos los deportes.</span><button type="button" class="btn btn-cta" data-limpiar-todo>Ver todo</button></div>';
      vermas.hidden = true;
      refrescarTriggers();
      return;
    }
    lista.innerHTML = items.slice(0, visibles).map(filaHTML).join('');
    vermas.hidden = visibles >= items.length;
    vermas.textContent = `Ver más modelos (${items.length - Math.min(visibles, items.length)})`;
    revelarNuevos(lista);
    refrescarTriggers();
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; render(true); } });
  busca?.addEventListener('input', () => { Filtro.q = busca.value; render(true); });
  busca?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = busca.value; render(true); });
  lista.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) { tab = ''; Filtro.q = ''; if (busca) busca.value = ''; render(true); } });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });
  Catalogo.aplicar = ({ deportes = [] } = {}) => { tab = deportes[0] || ''; Filtro.q = ''; if (busca) busca.value = ''; render(true); scrollSuave(inicio); };
  Catalogo.irA = () => scrollSuave(inicio);
  render(true);
}

function initCurva() {
  const c = document.querySelector('[data-curva]');
  if (!c) return;
  const rango = c.querySelector('[data-curva-rango]');
  const salida = c.querySelector('[data-curva-n]');
  const barras = c.querySelector('[data-curva-barras]');
  const total = c.querySelector('[data-curva-total]');
  const wsp = c.querySelector('[data-curva-wsp]');
  const inicial = Curva.leer();
  rango.value = inicial.n;
  const radio = c.querySelector(`input[name="curva-cat"][value="${inicial.cat}"]`);
  if (radio) radio.checked = true;
  const leerEstado = () => ({ cat: c.querySelector('input[name="curva-cat"]:checked')?.value || 'adultos', n: Number(rango.value) });
  const pintar = () => {
    const { cat, n } = leerEstado();
    const rep = repartir(cat, n);
    const max = Math.max(...Object.values(rep), 1);
    rango.style.setProperty('--pct', `${((n - 5) / 25) * 100}%`);
    salida.textContent = n;
    barras.style.setProperty('--n', TALLES[cat].length);
    const previas = barras.dataset.cat === cat;
    if (!previas) {
      barras.dataset.cat = cat;
      barras.innerHTML = TALLES[cat].map(t => `<div class="barra" data-talle="${t}"><span class="barra-n">0</span><span class="barra-col" style="--h:0"></span><span class="barra-talle">${t}</span></div>`).join('');
      void barras.offsetWidth;
    }
    TALLES[cat].forEach(t => {
      const b = barras.querySelector(`[data-talle="${t}"]`);
      b.querySelector('.barra-n').textContent = rep[t];
      b.querySelector('.barra-col').style.setProperty('--h', ((rep[t] / max) * 100).toFixed(1));
    });
    total.innerHTML = `<b>${n}</b> ${n === 1 ? 'prenda' : 'prendas'} por modelo`;
    const detalle = TALLES[cat].filter(t => rep[t]).map(t => `${t}: ${rep[t]}`).join(', ');
    wsp.href = wspHref(`Hola! Somos ${n} en el equipo (${GRUPO_LABEL[cat].toLowerCase()}). ¿Nos ayudan con los talles? La curva que calculamos: ${detalle}.`);
  };
  rango.addEventListener('input', pintar);
  c.addEventListener('change', e => { if (e.target.name === 'curva-cat') pintar(); });
  c.querySelector('[data-curva-usar]').addEventListener('click', () => {
    const e = leerEstado();
    Curva.guardar({ ...e, usada: true });
    showToast(`Listo: la curva de ${e.n} (${GRUPO_LABEL[e.cat].toLowerCase()}) queda lista para cargar en cada modelo`);
    Catalogo.irA?.();
  });
  pintar();
}

const COLOR_STOPS = [
  { color: 'Blanco', huecos: [[4, 3, 40, 54], [4, 57, 26, 67], [5, 72, 27, 99]] },
  { color: 'Rojo', huecos: [[34, 6, 54, 53], [21, 56, 43, 66], [25, 72, 45, 99]] },
  { color: 'Azul', huecos: [[47, 9, 66, 53], [40, 56, 58, 65], [42, 70, 61, 99]] },
  { color: 'Amarillo', huecos: [[58, 11, 76, 53], [52, 55, 72, 64], [58, 68, 74, 96]] },
  { color: 'Negro', huecos: [[69, 13, 85, 53], [69, 55, 84, 63], [72, 67, 87, 93]] },
  { color: 'Verde', huecos: [[79, 15, 94, 53], [82, 55, 95, 62], [85, 66, 97, 89]] },
];
const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function initColores() {
  const sec = document.querySelector('[data-colores]');
  if (!sec) return;
  const huecos = [...sec.querySelectorAll('[data-hueco]')];
  const bordes = [...sec.querySelectorAll('[data-borde]')];
  const nEl = sec.querySelector('[data-color-n]');
  const nombreEl = sec.querySelector('[data-color-nombre]');
  const cta = sec.querySelector('[data-color-cta]');
  let actual = -1;
  const poner = (rects, color) => {
    rects.forEach((r, k) => {
      const [x0, y0, x1, y1] = r;
      [huecos[k], bordes[k]].forEach(el => {
        el.setAttribute('x', x0.toFixed(2)); el.setAttribute('y', y0.toFixed(2));
        el.setAttribute('width', (x1 - x0).toFixed(2)); el.setAttribute('height', (y1 - y0).toFixed(2));
      });
    });
    sec.style.setProperty('--foco', BASE[color]);
  };
  const marcar = i => {
    if (i === actual) return;
    actual = i;
    const color = COLOR_STOPS[i].color;
    nEl.textContent = String(i + 1).padStart(2, '0');
    nombreEl.textContent = color;
    cta.textContent = `Elegir talles en ${color.toLowerCase()}`;
    cta.dataset.color = color;
  };
  const pintar = pr => {
    const s = clamp01((pr - 0.08) / 0.84) * (COLOR_STOPS.length - 1);
    const i = Math.min(Math.floor(s), COLOR_STOPS.length - 2);
    const t = suave(clamp01((s - i - 0.25) / 0.5));
    const a = COLOR_STOPS[i].huecos;
    const b = COLOR_STOPS[i + 1].huecos;
    poner(a.map((r, k) => r.map((v, j) => v + (b[k][j] - v) * t)), COLOR_STOPS[t < 0.5 ? i : i + 1].color);
    marcar(Math.round(s));
  };
  cta.addEventListener('click', () => openQuickview(1, { color: cta.dataset.color || 'Blanco' }));
  if (reduceMotion) {
    sec.classList.add('is-static');
    poner(COLOR_STOPS[2].huecos, 'Azul');
    marcar(2);
    return;
  }
  const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = sec.getBoundingClientRect();
    const total = r.height - (window.innerHeight - OFF);
    pintar(total > 0 ? clamp01((OFF - r.top) / total) : 0);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', update);
  update();
}

function initCancha() {
  const c = document.querySelector('.cancha');
  if (!c) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { c.classList.add('in'); return; }
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { c.classList.add('in'); io.disconnect(); } }); }, { threshold: 0.2 });
  io.observe(c);
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  track.innerHTML = RAIL.map(getProducto).filter(Boolean).map(p => tarjetaHTML(p, 'rail-card', 0.8)).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = null; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { if (pointerId !== null) vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (moved) {
      requestAnimationFrame(() => vp.classList.remove('dragging'));
      setTimeout(() => { moved = false; }, 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => {
    const card = track.querySelector('.rail-card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return card ? card.getBoundingClientRect().width + gap : 280;
  };
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 4;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 4;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

function openQuickview(id, { color: colorInicial, cantidades: previas, editar = false } = {}) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  let color = p.colores.includes(colorInicial) ? colorInicial : p.colores[0];
  const cant = Object.fromEntries(tallesDe(p).map(t => [t, Number(previas?.[t]) || 0]));
  const media = modal.querySelector('[data-qv-media]');
  const pintarFoto = () => {
    const [img, foco] = fotoDe(p, color);
    media.setAttribute('style', recorte(img, foco, 1));
    media.innerHTML = `<img src="images/${img}" alt="${esc(p.alt)}${p.colores.length > 1 ? ` · ${esc(color)}` : ''}" width="700" height="700">`;
  };
  modal.querySelector('[data-qv-meta]').textContent = `Nº ${p.num} · ${deporteDe(p.deporte).label} · ${prendaDe(p.prenda).uno}`;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-desc]').textContent = p.desc;
  const coloresEl = modal.querySelector('[data-qv-colores]');
  coloresEl.innerHTML = p.colores.map(c => `<button type="button" class="qv-color" data-qv-color="${esc(c)}" aria-pressed="${c === color}">${swatchHTML(c)}${esc(c)}</button>`).join('');
  coloresEl.onclick = e => {
    const b = e.target.closest('[data-qv-color]');
    if (!b) return;
    color = b.dataset.qvColor;
    coloresEl.querySelectorAll('[data-qv-color]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarFoto();
    resumen();
  };
  ['ninos', 'adultos'].forEach(g => {
    const bloque = modal.querySelector(`[data-qv-grupo="${g}"]`);
    bloque.hidden = !p.grupos.includes(g);
    bloque.querySelector(`[data-qv-talles="${g}"]`).innerHTML = p.grupos.includes(g) ? TALLES[g].map(t => `<div class="qv-talle" data-qv-talle="${t}"><b>${t}</b><div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar talle ${t}">−</button><span data-qv-cant>0</span><button type="button" data-qv-step="1" aria-label="Sumar talle ${t}">+</button></div></div>`).join('') : '';
  });
  const unidades = modal.querySelector('[data-qv-unidades]');
  const add = modal.querySelector('[data-qv-add]');
  const curvaEl = modal.querySelector('[data-qv-curva]');
  const resumen = () => {
    modal.querySelectorAll('[data-qv-talle]').forEach(fila => {
      const n = cant[fila.dataset.qvTalle] || 0;
      fila.querySelector('[data-qv-cant]').textContent = n;
      fila.classList.toggle('con-cantidad', n > 0);
    });
    const u = Object.values(cant).reduce((s, n) => s + n, 0);
    unidades.textContent = prendas(u);
    add.disabled = u === 0 && !editar;
    add.textContent = editar ? 'Actualizar el pedido' : (u ? `Sumar ${prendas(u)} al pedido` : 'Sumar al pedido');
    modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por ${p.nombre} (Nº ${p.num}) en ${color.toLowerCase()}.`);
  };
  modal.querySelector('.qv-info').onclick = e => {
    const b = e.target.closest('[data-qv-step]');
    if (!b) return;
    const t = b.closest('[data-qv-talle]').dataset.qvTalle;
    cant[t] = Math.max(0, Math.min(999, (cant[t] || 0) + Number(b.dataset.qvStep)));
    resumen();
  };
  const e = Curva.leer();
  if (e.usada && p.grupos.includes(e.cat)) {
    const rep = Curva.reparto();
    curvaEl.hidden = false;
    curvaEl.innerHTML = `<span>Tu curva de <b>${e.n}</b> (${GRUPO_LABEL[e.cat].toLowerCase()}): ${TALLES[e.cat].filter(t => rep[t]).map(t => `${t} ${rep[t]}`).join(' · ')}</span><button type="button" class="link" data-qv-cargar>Cargarla</button>`;
    curvaEl.querySelector('[data-qv-cargar]').onclick = () => {
      TALLES[e.cat].forEach(t => { cant[t] = rep[t] || 0; });
      resumen();
      showToast(`Cargamos la curva de ${e.n} en ${p.nombre}`);
    };
  } else {
    curvaEl.hidden = true;
    curvaEl.innerHTML = '';
  }
  add.onclick = () => {
    if (editar) {
      Cart.ponerGrupo(p, color, cant);
      showToast(`Actualizamos ${p.nombre} en tu pedido`);
    } else {
      const n = Cart.sumarGrupo(p, color, cant);
      if (!n) return;
      showToast(`Sumaste ${prendas(n)} de ${p.nombre} ${color.toLowerCase()}`);
    }
    closeQuickview();
  };
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.deporte === p.deporte).concat(PRODUCTOS.filter(x => x.id !== p.id && x.deporte !== p.deporte && x.prenda === p.prenda)).filter((x, k, arr) => arr.indexOf(x) === k).slice(0, 3);
  modal.querySelector('[data-qv-rel]').innerHTML = rel.map(x => `<button type="button" class="qv-rel-item" data-open-quickview="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="200" height="200"></span><span>${esc(x.nombre)}</span></button>`).join('');
  modal.querySelector('.qv-rel').hidden = !rel.length;
  pintarFoto();
  resumen();
  if (modal.hidden) {
    modal.hidden = false;
    trapFocus(modal);
    document.body.classList.add('no-scroll');
    modal.querySelector('.quickview-cerrar')?.focus();
  } else {
    modal.querySelector('.quickview-panel').scrollTop = 0;
  }
}

function closeQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n > 99 ? '99+' : n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function grupoHTML(g, compacto = false) {
  const [img, foco] = fotoDe(g.p, g.color);
  const talles = ordenTalles(g.p, g.talles);
  if (compacto) {
    return `<div class="linea"><b>${esc(g.p.nombre)}</b><button type="button" class="linea-quitar" data-quitar-grupo="${g.p.id}|${esc(g.color)}" aria-label="Quitar ${esc(g.p.nombre)} ${esc(g.color)}">Quitar</button><span class="linea-talles">${esc(g.color)} · ${talles.map(([t, n]) => `${t} ${n}`).join(' · ')} · ${prendas(g.total)}</span></div>`;
  }
  return `<div class="cart-item">
    <div class="recorte" style="${recorte(img, foco, 1)}"><img src="images/${img}" alt="${esc(g.p.alt)}" width="144" height="144"></div>
    <div class="cart-item-info">
      <strong>${esc(g.p.nombre)}</strong>
      <span class="meta">${esc(g.color)} · Nº ${esc(g.p.num)} · ${prendas(g.total)}</span>
      <div class="cart-item-talles">${talles.map(([t, n]) => `<span class="cart-talle">${t} × ${n}</span>`).join('')}</div>
      <div class="cart-item-fila">
        <button type="button" class="cart-quitar" data-editar-grupo="${g.p.id}|${esc(g.color)}">Editar talles</button>
        <button type="button" class="cart-quitar" data-quitar-grupo="${g.p.id}|${esc(g.color)}">Quitar</button>
      </div>
    </div>
  </div>`;
}

function renderPedido() {
  const grupos = Cart.grupos();
  const total = Cart.count();
  const msg = wspHref(mensajePedido());
  const itemsEl = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (itemsEl) {
    if (!grupos.length) {
      itemsEl.innerHTML = '<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu pedido está vacío.<br>Elegí un modelo, su color y los talles.</p><button type="button" class="btn btn-cta" data-cerrar-e-ir>Ver el catálogo</button></div>';
      footer.hidden = true;
    } else {
      footer.hidden = false;
      itemsEl.innerHTML = grupos.map(g => grupoHTML(g)).join('');
      document.querySelector('[data-cart-total]').textContent = prendas(total);
      const wsp = document.querySelector('[data-pedido-wsp]');
      if (wsp) wsp.href = msg;
    }
  }
  const panel = document.querySelector('[data-panel]');
  if (panel) {
    panel.querySelector('[data-panel-lineas]').innerHTML = grupos.length ? grupos.map(g => grupoHTML(g, true)).join('') : '<p class="panel-vacio">Todavía no sumaste nada. Tocá «Elegir talles» en un modelo para empezar.</p>';
    panel.querySelector('[data-panel-total]').textContent = prendas(total);
    panel.querySelector('[data-panel-cuenta]').textContent = cuantos(grupos.length, 'modelo', 'modelos');
    const btn = panel.querySelector('[data-panel-wsp]');
    btn.href = msg;
    btn.classList.toggle('is-vacio', !grupos.length);
    btn.setAttribute('aria-disabled', String(!grupos.length));
  }
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
  renderPedido();
  drawer.classList.add('open');
  document.querySelector('.cart-backdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  trapFocus(drawer);
  drawer.querySelector('.cart-cerrar')?.focus();
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-cerrar')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar-grupo]');
    if (quitar) { const [id, color] = quitar.dataset.quitarGrupo.split('|'); Cart.quitarGrupo(id, color); return; }
    const editar = e.target.closest('[data-editar-grupo]');
    if (editar) {
      const [id, color] = editar.dataset.editarGrupo.split('|');
      const g = Cart.grupos().find(x => x.p.id === Number(id) && x.color === color);
      closeCartDrawer();
      if (g) openQuickview(g.p.id, { color, cantidades: g.talles, editar: true });
      return;
    }
    if (e.target.closest('[data-cerrar-e-ir]')) { closeCartDrawer(); Catalogo.irA?.(); return; }
    if (e.target.closest('[data-vaciar]')) { Cart.clear(); showToast('Vaciamos tu pedido'); }
    const wspVacio = e.target.closest('[data-panel-wsp].is-vacio');
    if (wspVacio) { e.preventDefault(); showToast('Sumá al menos un modelo para enviar el pedido'); }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderPedido(); });
  renderPedido();
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initAtajos() {
  document.addEventListener('click', e => {
    const dep = e.target.closest('[data-deporte-link]');
    if (dep && Catalogo.aplicar) { e.preventDefault(); Catalogo.aplicar({ deportes: dep.dataset.deporteLink.split(',').filter(Boolean) }); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(Number(ver.dataset.openQuickview));
  });
}

function initSchema() {
  const base = new URL('./', location.href).href;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo NG indumentaria deportiva',
    itemListElement: PRODUCTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Product', name: p.nombre, description: p.desc, image: base + 'images/' + p.img, color: p.colores.join(', '), category: `${deporteDe(p.deporte).label} · ${prendaDe(p.prenda).label}` },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initDeepLink() {
  const slug = new URLSearchParams(location.search).get('producto');
  const p = slug && PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuickview(p.id);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'back.out(1.6)' } });
  tl.from(hero.querySelectorAll('.migas, .hero-h1, .hero-bajada, .hero-datos li, .hero-ctas > *, .panel-m-texto > *'), { y: 34, opacity: 0, duration: 0.8, stagger: 0.07, clearProps: 'transform,opacity' });
  const foto = hero.querySelector('.hero-foto-marco');
  if (foto) tl.from(foto, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.1);
  const dorsal = hero.querySelector('.dorsal-gigante');
  if (dorsal) tl.from(dorsal, { scale: 0.92, opacity: 0, rotate: -6, duration: 1, clearProps: 'transform,opacity' }, 0.15);
  const escudo = hero.querySelector('.escudo > span');
  if (escudo) tl.from(escudo, { scale: 0.92, opacity: 0, rotate: 24, duration: 0.9, clearProps: 'transform,opacity' }, 0.5);
}

document.addEventListener('DOMContentLoaded', () => {
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCuentas();
  initDeportesBar();
  initCatalogoGrilla();
  initCatalogoLista();
  initCurva();
  initRail();
  initColores();
  initCancha();
  initQuickview();
  initCartUI();
  initFloats();
  initAtajos();
  initSchema();
  updateCartBadge();
  initReveals();
  initHeroMotion();
  initDeepLink();
});
