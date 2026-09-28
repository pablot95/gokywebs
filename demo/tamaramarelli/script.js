const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));
const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const WSP = '5491138786343';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'percheros-9x16.webp': [941, 1672],
  'local-16x9.webp': [1672, 941],
  'boutique-1x1.webp': [1254, 1254],
  'carteras-joyas-1x1.webp': [1254, 1254],
  'look-1x1.webp': [1254, 1254],
  'mesa-1x1.webp': [1254, 1254],
};

const TALLES = [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56];
const UNICO = 'U';
const GUIA = {
  36: [84, 66, 92], 38: [88, 70, 96], 40: [92, 74, 100], 42: [96, 78, 104], 44: [100, 82, 108], 46: [106, 88, 114],
  48: [112, 94, 120], 50: [118, 100, 126], 52: [124, 106, 132], 54: [130, 112, 138], 56: [136, 118, 144],
};

const SUBS = [
  { id: 'vestidos', label: 'Vestidos', cat: 'ropa' },
  { id: 'blusas', label: 'Blusas', cat: 'ropa' },
  { id: 'tejidos', label: 'Tejidos', cat: 'ropa' },
  { id: 'jeans', label: 'Jeans', cat: 'ropa' },
  { id: 'sacos', label: 'Sacos', cat: 'ropa' },
  { id: 'carteras', label: 'Carteras', cat: 'carteras' },
  { id: 'joyas', label: 'Joyas', cat: 'accesorios' },
  { id: 'accesorios', label: 'Accesorios', cat: 'accesorios' },
];
const CATS = {
  ropa: { label: 'Ropa', subs: ['vestidos', 'blusas', 'tejidos', 'jeans', 'sacos'] },
  carteras: { label: 'Carteras', subs: ['carteras'] },
  accesorios: { label: 'Joyas y accesorios', subs: ['joyas', 'accesorios'] },
};
const COLORES = {
  crudo: ['Crudo', '#EDE4D3'],
  beige: ['Beige', '#D5BE9C'],
  camel: ['Camel', '#B8844F'],
  negro: ['Negro', '#1F1B16'],
  celeste: ['Celeste', '#94B0CF'],
  azul: ['Azul oscuro', '#3F5170'],
  oliva: ['Verde oliva', '#6E7148'],
  estampado: ['Estampado', 'conic-gradient(#EDE4D3 0 25%, #8C6A45 0 50%, #EDE4D3 0 75%, #8C6A45 0)'],
  dorado: ['Dorado', '#C9A04A'],
  carey: ['Carey', '#6B4226'],
};

const PRODUCTOS = [
  { id: 1, slug: 'blusa-de-gasa', nombre: 'Blusa de gasa', sub: 'blusas', color: 'crudo', precio: 48900, orden: 1, nuevo: true, img: 'look-1x1.webp', foco: [0.4, 0.46, 1.25], sin: [], alt: 'Blusa de gasa cruda con botones y mangas con puño', desc: 'Gasa liviana con botones al tono y mangas abullonadas con puño. Suelta, fresca y fácil de combinar.' },
  { id: 2, slug: 'jean-recto', nombre: 'Jean recto', sub: 'jeans', color: 'celeste', precio: 62900, orden: 3, img: 'look-1x1.webp', foco: [0.68, 0.77, 1.9], sin: [36], alt: 'Jean recto celeste doblado', desc: 'Tiro alto y pierna recta en denim celeste, con cinco bolsillos y botón metálico.' },
  { id: 3, slug: 'sweater-trenzado', nombre: 'Sweater trenzado', sub: 'tejidos', color: 'crudo', precio: 69900, orden: 5, img: 'mesa-1x1.webp', foco: [0.36, 0.48, 3], sin: [54], alt: 'Sweaters tejidos crudos y camel doblados sobre una mesa', desc: 'Punto trenzado y cuello redondo. Abriga sin pesar y combina con todo.' },
  { id: 4, slug: 'jean-mom', nombre: 'Jean mom', sub: 'jeans', color: 'azul', precio: 64900, orden: 8, img: 'mesa-1x1.webp', foco: [0.655, 0.8, 3], sin: [40], alt: 'Jeans azul oscuro doblados en un estante', desc: 'Calce mom de tiro alto en denim azul oscuro, cómodo en la cintura y al cuerpo en la cadera.' },
  { id: 5, slug: 'sweater-de-hilo', nombre: 'Sweater de hilo', sub: 'tejidos', color: 'camel', precio: 58900, descuento: 20, orden: 6, img: 'mesa-1x1.webp', foco: [0.89, 0.84, 3.4], sin: [], alt: 'Sweaters de hilo camel y crudo apilados', desc: 'Hilo de punto fino, ideal para media estación. Se usa suelto o con un nudo adelante.' },
  { id: 6, slug: 'vestido-animal-print', nombre: 'Vestido animal print', sub: 'vestidos', color: 'estampado', precio: 79900, orden: 9, img: 'mesa-1x1.webp', foco: [0.185, 0.3, 3.2], sin: [38], alt: 'Vestido animal print colgado entre blusas crudas', desc: 'Largo midi con escote en V y cinto para marcar la cintura.' },
  { id: 7, slug: 'saco-largo', nombre: 'Saco largo', sub: 'sacos', color: 'camel', precio: 98900, orden: 10, img: 'mesa-1x1.webp', foco: [0.13, 0.3, 3.3], sin: [36, 56], alt: 'Saco largo camel colgado entre blusas crudas y un vestido animal print', desc: 'Largo a la rodilla, sin botones y con bolsillos. Se usa abierto, arriba de todo.' },
  { id: 8, slug: 'vestido-midi-oliva', nombre: 'Vestido midi', sub: 'vestidos', color: 'oliva', precio: 84900, orden: 2, nuevo: true, img: 'boutique-1x1.webp', foco: [0.73, 0.52, 3.4], sin: [], alt: 'Vestido midi verde oliva en el perchero', desc: 'Verde oliva, con mangas tres cuartos y volado en el ruedo.' },
  { id: 9, slug: 'vestido-floreado', nombre: 'Vestido floreado', sub: 'vestidos', color: 'estampado', precio: 76900, orden: 11, img: 'boutique-1x1.webp', foco: [0.275, 0.5, 3.4], sin: [48], alt: 'Vestido floreado sobre fondo crudo colgado en el perchero', desc: 'Flores sobre fondo crudo, mangas cortas y falda con vuelo.' },
  { id: 10, slug: 'cardigan-tejido', nombre: 'Cárdigan tejido', sub: 'tejidos', color: 'crudo', precio: 72900, orden: 7, nuevo: true, img: 'boutique-1x1.webp', foco: [0.335, 0.77, 3], sin: [], alt: 'Cárdigan tejido crudo sobre un banco', desc: 'Punto grueso, largo a la cadera y botones al tono.' },
  { id: 11, slug: 'vestido-escalonado', nombre: 'Vestido escalonado', sub: 'vestidos', color: 'crudo', precio: 82900, orden: 13, img: 'boutique-1x1.webp', foco: [0.915, 0.53, 3.6], sin: [44], alt: 'Vestido largo crudo con volados en el perchero', desc: 'Largo al tobillo con tres volados. Liviano y con mucho movimiento.' },
  { id: 12, slug: 'vestido-de-gasa-estampado', nombre: 'Vestido de gasa estampado', sub: 'vestidos', color: 'estampado', precio: 78900, orden: 4, nuevo: true, img: 'percheros-9x16.webp', foco: [0.515, 0.47, 3.2], sin: [52], alt: 'Vestido de gasa estampado colgado en el perchero', desc: 'Gasa estampada con escote cruzado y lazo en la cintura.' },
  { id: 13, slug: 'tote-de-cuero', nombre: 'Tote de cuero', sub: 'carteras', color: 'camel', precio: 124900, orden: 12, nuevo: true, img: 'carteras-joyas-1x1.webp', foco: [0.435, 0.455, 3], medidas: [36, 28, 13], alt: 'Tote de cuero camel con dos asas', desc: 'Amplia, con dos asas y bolsillo interior. Entra la notebook.' },
  { id: 14, slug: 'bolso-hobo', nombre: 'Bolso hobo', sub: 'carteras', color: 'crudo', precio: 96900, orden: 14, img: 'carteras-joyas-1x1.webp', foco: [0.2, 0.61, 3.1], medidas: [32, 24, 10], alt: 'Bolso hobo crudo de asa corta', desc: 'Forma de medialuna, asa corta al hombro y cierre imantado.' },
  { id: 15, slug: 'cartera-acolchada', nombre: 'Cartera acolchada', sub: 'carteras', color: 'crudo', precio: 89900, orden: 16, img: 'carteras-joyas-1x1.webp', foco: [0.825, 0.68, 3.3], medidas: [25, 16, 7], alt: 'Cartera acolchada cruda con cadena dorada', desc: 'Acolchado en rombos y cadena dorada para llevar al hombro o cruzada.' },
  { id: 16, slug: 'tote-clasico', nombre: 'Tote clásico', sub: 'carteras', color: 'negro', precio: 109900, orden: 18, img: 'carteras-joyas-1x1.webp', foco: [0.745, 0.55, 3.4], medidas: [34, 27, 12], alt: 'Tote negro con herrajes dorados', desc: 'Negro, de asas firmes y herrajes dorados. La de todos los días.' },
  { id: 17, slug: 'bandolera', nombre: 'Bandolera', sub: 'carteras', color: 'beige', precio: 79900, orden: 15, img: 'mesa-1x1.webp', foco: [0.67, 0.46, 3], medidas: [26, 24, 9], alt: 'Bandolera beige de correa ancha', desc: 'Correa ancha regulable y cierre con imán. Cómoda para andar todo el día.' },
  { id: 18, slug: 'mini-bolso', nombre: 'Mini bolso', sub: 'carteras', color: 'camel', precio: 74900, orden: 17, img: 'look-1x1.webp', foco: [0.815, 0.21, 2.6], medidas: [22, 16, 10], alt: 'Mini bolso camel con asas', desc: 'Chico pero con fuelle: celular, billetera y llaves sin apretar.' },
  { id: 19, slug: 'collar-doble-cadena', nombre: 'Collar doble cadena', sub: 'joyas', color: 'dorado', precio: 32900, orden: 19, nuevo: true, img: 'carteras-joyas-1x1.webp', foco: [0.59, 0.62, 3.3], alt: 'Collar dorado de dos cadenas con medalla en un busto', desc: 'Dos vueltas: una cadena gruesa y una fina con medalla.' },
  { id: 20, slug: 'pulseras-de-eslabones', nombre: 'Pulseras de eslabones', sub: 'joyas', color: 'dorado', precio: 27900, orden: 21, img: 'carteras-joyas-1x1.webp', foco: [0.41, 0.685, 4.4], alt: 'Pulseras doradas de eslabones en un exhibidor', desc: 'Set de tres pulseras de eslabones en distintos grosores.' },
  { id: 21, slug: 'set-de-anillos', nombre: 'Set de anillos', sub: 'joyas', color: 'dorado', precio: 24900, orden: 23, img: 'carteras-joyas-1x1.webp', foco: [0.35, 0.775, 4.2], alt: 'Anillos dorados en una bandeja', desc: 'Tres anillos lisos y facetados, para usar juntos o por separado.' },
  { id: 22, slug: 'argollas-gruesas', nombre: 'Argollas gruesas', sub: 'joyas', color: 'dorado', precio: 21900, orden: 20, img: 'look-1x1.webp', foco: [0.865, 0.445, 4.2], alt: 'Argollas doradas de forma orgánica', desc: 'Argollas medianas de forma orgánica y bien livianas.' },
  { id: 23, slug: 'collar-con-medalla', nombre: 'Collar con medalla', sub: 'joyas', color: 'dorado', precio: 26900, orden: 22, img: 'look-1x1.webp', foco: [0.245, 0.28, 3.6], alt: 'Collar de cadena fina con medalla dorada', desc: 'Cadena fina con medalla martillada. Queda con todo.' },
  { id: 24, slug: 'anteojos-de-sol', nombre: 'Anteojos de sol', sub: 'accesorios', color: 'carey', precio: 38900, orden: 24, img: 'look-1x1.webp', foco: [0.26, 0.83, 3.4], alt: 'Anteojos de sol de marco carey', desc: 'Marco de acetato carey con lentes marrones.' },
  { id: 25, slug: 'pashmina', nombre: 'Pashmina', sub: 'accesorios', color: 'crudo', precio: 29900, orden: 25, img: 'mesa-1x1.webp', foco: [0.19, 0.7, 2.6], alt: 'Pashmina cruda apoyada en una mesa', desc: 'Tejido liviano con flecos, para el cuello o los hombros.' },
];

const ITEMS = [
  { id: 'celular', label: 'Celular', art: 'el celular', dims: [16, 8, 1], def: true, icono: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>' },
  { id: 'billetera', label: 'Billetera', art: 'la billetera', dims: [19, 10, 2.5], def: true, icono: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>' },
  { id: 'llaves', label: 'Llaves', art: 'las llaves', dims: [9, 5, 2], def: true, plural: true, icono: '<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M16 7l2 2M14 9l2 2"/>' },
  { id: 'anteojos', label: 'Anteojos', art: 'el estuche de anteojos', dims: [16, 7, 4.5], icono: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M10 15h4M2.5 13 5 7M21.5 13 19 7"/>' },
  { id: 'agenda', label: 'Agenda A5', art: 'la agenda', dims: [21, 15, 1.5], icono: '<path d="M5 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5z"/><path d="M9 3v18M12 8h4"/>' },
  { id: 'botella', label: 'Botella', art: 'la botella', dims: [22, 7, 7], icono: '<path d="M10 2h4v3l2 3v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l2-3z"/><path d="M8 12h8"/>' },
  { id: 'neceser', label: 'Neceser', art: 'el neceser', dims: [20, 12, 7], icono: '<path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="m4 9 2-4h12l2 4M9 13h6"/>' },
  { id: 'paraguas', label: 'Paraguas', art: 'el paraguas', dims: [25, 6, 6], icono: '<path d="M22 12a10 10 0 0 0-20 0z"/><path d="M12 12v7a2 2 0 0 0 4 0M12 2v1"/>' },
  { id: 'tablet', label: 'Tablet', art: 'la tablet', dims: [25, 17, 0.8], icono: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>' },
  { id: 'notebook', label: 'Notebook 13"', art: 'la notebook', dims: [31, 22, 1.6], icono: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const subDe = id => SUBS.find(s => s.id === id) || { id, label: id, cat: 'ropa' };
const esRopa = p => CATS.ropa.subs.includes(p.sub);
const tallesDe = p => (esRopa(p) ? TALLES : [UNICO]);
const hayTalle = (p, t) => (esRopa(p) ? TALLES.includes(Number(t)) && !p.sin.includes(Number(t)) : t === UNICO);
const tallesConStock = p => tallesDe(p).filter(t => hayTalle(p, t));
const talleTxt = t => (t === UNICO ? 'talle único' : `talle ${t}`);
const colorDe = c => COLORES[c] || [c, '#ccc'];
const rangoTalles = p => {
  if (!esRopa(p)) return 'Talle único';
  const hay = tallesConStock(p);
  return `Talles ${hay[0]} al ${hay[hay.length - 1]}`;
};
const prendasEnTalle = t => PRODUCTOS.filter(p => esRopa(p) && hayTalle(p, t)).length;

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
const fotoHTML = (p, clase, ar, extra = '') => `<div class="${clase} recorte"${extra} style="${recorte(p.img, p.foco, ar)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="${IMG[p.img][0]}" height="${IMG[p.img][1]}"></div>`;

const MiTalle = {
  KEY: 'tm_talle',
  enMemoria: undefined,
  get() {
    let v = this.enMemoria;
    if (v === undefined) { try { v = Number(window.localStorage.getItem(this.KEY)); } catch { v = null; } }
    return TALLES.includes(Number(v)) ? Number(v) : null;
  },
  set(t) {
    const v = TALLES.includes(Number(t)) ? Number(t) : null;
    try {
      if (v) window.localStorage.setItem(this.KEY, String(v)); else window.localStorage.removeItem(this.KEY);
      this.enMemoria = undefined;
    } catch { this.enMemoria = v; }
    document.dispatchEvent(new CustomEvent('talle:cambio'));
  },
};

const Cart = {
  KEY: 'tm_carrito',
  enMemoria: null,
  leer() {
    if (this.enMemoria) return this.enMemoria.map(i => ({ ...i }));
    try { return JSON.parse(window.localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  get() {
    const crudo = this.leer();
    if (!Array.isArray(crudo)) return [];
    return crudo.reduce((lista, i) => {
      const p = getProducto(i?.id);
      const talle = i?.talle === UNICO ? UNICO : Number(i?.talle);
      const qty = Math.floor(Number(i?.qty));
      if (!p || !hayTalle(p, talle) || !(qty > 0)) return lista;
      const previo = lista.find(x => x.id === p.id && x.talle === talle);
      if (previo) previo.qty = Math.min(previo.qty + qty, 9);
      else lista.push({ id: p.id, talle, qty: Math.min(qty, 9) });
      return lista;
    }, []);
  },
  save(items) {
    try { window.localStorage.setItem(this.KEY, JSON.stringify(items)); this.enMemoria = null; } catch { this.enMemoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(p, talle, qty = 1) {
    if (!p || !hayTalle(p, talle)) return false;
    const items = this.get();
    const it = items.find(i => i.id === p.id && i.talle === talle);
    if (it) it.qty = Math.min(it.qty + qty, 9); else items.push({ id: p.id, talle, qty: Math.min(qty, 9) });
    this.save(items);
    return true;
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === Number(id) && String(i.talle) === String(talle));
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 9));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === Number(id) && String(i.talle) === String(talle)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function mensajeCarrito() {
  const lineas = Cart.get().map((i, k) => {
    const p = getProducto(i.id);
    return `${k + 1}) ${p.nombre} · ${talleTxt(i.talle)} × ${i.qty} → ${formatearPrecio(precioFinal(p) * i.qty)}`;
  });
  return `Hola! Quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${formatearPrecio(Cart.total())}`;
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
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

const Filtro = { subs: new Set(), talles: new Set(), colores: new Set(), precioMax: null, q: '', orden: 'destacados', ids: null, idsLabel: '' };
const PAGINA = 16;
let visibles = PAGINA;
const Catalogo = {};
const PRECIO_MAX = Math.max(...PRODUCTOS.map(precioFinal));
const PRECIO_MIN = Math.min(...PRODUCTOS.map(precioFinal));

function textoBusqueda(p) {
  const s = subDe(p.sub);
  return normalizar([p.nombre, s.label, CATS[s.cat].label, colorDe(p.color)[0], p.desc, esRopa(p) ? 'ropa prenda' : 'talle unico'].join(' '));
}
function filtrar() {
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (Filtro.ids && !Filtro.ids.has(p.id)) return false;
    if (Filtro.subs.size && !Filtro.subs.has(p.sub)) return false;
    if (Filtro.colores.size && !Filtro.colores.has(p.color)) return false;
    if (Filtro.talles.size && ![...Filtro.talles].some(t => hayTalle(p, t))) return false;
    if (Filtro.precioMax !== null && precioFinal(p) > Filtro.precioMax) return false;
    if (palabras.length) { const t = textoBusqueda(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  const orden = {
    destacados: (a, b) => a.orden - b.orden,
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.orden - b.orden,
    menor: (a, b) => precioFinal(a) - precioFinal(b),
    mayor: (a, b) => precioFinal(b) - precioFinal(a),
  }[Filtro.orden] || ((a, b) => a.orden - b.orden);
  return lista.sort(orden);
}

function precioHTML(p) {
  return p.descuento > 0 ? `<span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>` : `<span>${formatearPrecio(p.precio)}</span>`;
}
function badgesHTML(p) {
  return `${p.nuevo ? '<span class="badge">Nuevo</span>' : ''}${p.descuento > 0 ? `<span class="badge badge-off">-${p.descuento}%</span>` : ''}`;
}
function estadoTalle(p) {
  const t = MiTalle.get();
  if (!esRopa(p)) return { txt: 'Talle único', hay: false };
  if (t && hayTalle(p, t)) return { txt: `Hay en tu talle (${t})`, hay: true };
  if (t) return { txt: `Sin stock en ${t} · ${rangoTalles(p).replace('Talles ', '')}`, hay: false };
  return { txt: rangoTalles(p), hay: false };
}
function accionCard(p) {
  const t = MiTalle.get();
  if (!esRopa(p)) return { txt: 'Agregar al carrito', corto: 'Agregar', attr: `data-add="${p.id}"` };
  if (t && hayTalle(p, t)) return { txt: `Agregar talle ${t}`, corto: 'Agregar', attr: `data-add="${p.id}"` };
  return t ? { txt: 'Ver otros talles', corto: 'Otros talles', attr: `data-open-quickview="${p.id}"` } : { txt: 'Elegir talle', corto: 'Elegir talle', attr: `data-open-quickview="${p.id}"` };
}
function tarjetaHTML(p, clase = 'prod', animar = true) {
  const est = estadoTalle(p);
  const acc = accionCard(p);
  const anim = clase === 'prod' && animar ? ' data-animate style="opacity:0;transform:translateY(34px)"' : '';
  return `<article class="${clase}"${anim}>
    <div class="prod-media recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, 0.8)}">
      ${badgesHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="750">
    </div>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="precio">${precioHTML(p)}</p>
      <p class="prod-talle${est.hay ? ' hay' : ''}">${esc(est.txt)}</p>
      <div class="prod-actions"><button type="button" class="btn btn-line prod-add" ${acc.attr} aria-label="${esc(acc.txt)}: ${esc(p.nombre)}"><span class="lbl-largo">${esc(acc.txt)}</span><span class="lbl-corto">${esc(acc.corto)}</span></button></div>
    </div>
  </article>`;
}
function tileHTML(p, ancho, animar = true) {
  const acc = accionCard(p);
  const foco = ancho ? [p.foco[0], p.foco[1], Math.max(1, p.foco[2] * 0.55)] : p.foco;
  return `<article class="tile${ancho ? ' ancho' : ''}"${animar ? ' data-animate style="opacity:0;transform:translateY(34px)"' : ''}>
    <div class="tile-media recorte" data-open-quickview="${p.id}" style="${recorte(p.img, foco, ancho ? 2 : 1)}">
      ${badgesHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="750">
    </div>
    <div class="tile-rotulo">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="precio">${precioHTML(p)}</p>
      <button type="button" class="tile-add" ${acc.attr} aria-label="${esc(acc.txt)}: ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  </article>`;
}
function anchosPara(n, cols) {
  if (n < 5) return new Set();
  let k = Math.min(Math.floor(n / 4), 4);
  while (k > 0 && (n + k) % cols !== 0) k--;
  const pos = new Set();
  for (let i = 0; i < k; i++) pos.add(Math.round((i * n) / k));
  return pos;
}

function initCatalogo() {
  const cat = document.querySelector('[data-catalogo]');
  if (!cat) return;
  const grid = cat.querySelector('[data-grid]');
  const mosaico = cat.querySelector('[data-mosaico]');
  const cont = grid || mosaico;
  const cuenta = cat.querySelector('[data-resultados]');
  const activos = cat.querySelector('[data-activos]');
  const vermas = cat.querySelector('[data-vermas]');
  const vacio = cat.querySelector('[data-vacio]');
  const orden = cat.querySelector('[data-orden]');
  const busca = cat.querySelector('[data-busca]');
  const input = busca?.querySelector('input');
  const inicio = cat.querySelector('[data-catalogo-inicio]');
  const filtros = document.getElementById('filtros');
  const bdFiltros = document.querySelector('[data-filtros-backdrop]');
  const toggle = cat.querySelector('.filtros-toggle');
  const chips = cat.querySelector('[data-chips]');
  const cinta = document.querySelector('[data-cinta]');
  const nota = document.querySelector('[data-cinta-nota]');
  const precio = filtros?.querySelector('[data-precio-max]');
  const precioTxt = filtros?.querySelector('[data-precio-txt]');
  const colsMq = window.matchMedia('(max-width: 767px)');

  const cuentaSub = id => PRODUCTOS.filter(p => p.sub === id).length;
  filtros.querySelector('[data-grupo="sub"]').innerHTML = SUBS.map(s => `<label class="filtro-check"><input type="checkbox" data-f="sub" value="${s.id}"><span>${esc(s.label)}</span><small>${cuentaSub(s.id)}</small></label>`).join('');
  filtros.querySelector('[data-grupo="talle"]').innerHTML = TALLES.map(t => `<label class="filtro-talle"><input type="checkbox" data-f="talle" value="${t}"><span>${t}</span></label>`).join('') + `<label class="filtro-talle ancho"><input type="checkbox" data-f="talle" value="${UNICO}"><span>Talle único</span></label>`;
  const coloresUsados = [...new Set(PRODUCTOS.map(p => p.color))];
  filtros.querySelector('[data-grupo="color"]').innerHTML = coloresUsados.map(c => `<label class="filtro-color" title="${esc(colorDe(c)[0])}"><input type="checkbox" data-f="color" value="${c}" aria-label="${esc(colorDe(c)[0])}"><span class="swatch" style="--c:${colorDe(c)[1]}"></span></label>`).join('');
  if (precio) {
    precio.min = Math.floor(PRECIO_MIN / 1000) * 1000;
    precio.max = Math.ceil(PRECIO_MAX / 1000) * 1000;
    precio.step = 1000;
    precio.value = precio.max;
  }
  if (cinta) cinta.innerHTML = TALLES.map(t => `<button type="button" class="cinta-talle" data-cinta-talle="${t}" aria-pressed="false"><span>${t}</span></button>`).join('');
  if (chips) {
    const n = c => PRODUCTOS.filter(p => CATS[c].subs.includes(p.sub)).length;
    chips.innerHTML = `<button type="button" class="chip" data-chip="" aria-pressed="true">Todo<small>${PRODUCTOS.length}</small></button>` + Object.keys(CATS).map(c => `<button type="button" class="chip" data-chip="${c}" aria-pressed="false">${esc(CATS[c].label)}<small>${n(c)}</small></button>`).join('');
  }

  const esDrawer = () => document.body.classList.contains('m2') || window.matchMedia('(max-width: 1024px)').matches;
  const syncDrawer = () => {
    const d = esDrawer();
    filtros.classList.toggle('es-drawer', d);
    if (!d) { filtros.classList.remove('open'); bdFiltros?.classList.remove('open'); filtros.removeAttribute('inert'); document.body.classList.remove('no-scroll'); }
    else if (!filtros.classList.contains('open')) filtros.setAttribute('inert', '');
  };
  const abrirFiltros = () => {
    ultimoFoco = document.activeElement;
    filtros.classList.add('open'); bdFiltros?.classList.add('open'); filtros.removeAttribute('inert');
    document.body.classList.add('no-scroll'); toggle?.setAttribute('aria-expanded', 'true');
    trapFocus(filtros);
    filtros.querySelector('.filtros-cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); bdFiltros?.classList.remove('open');
    if (esDrawer()) filtros.setAttribute('inert', '');
    document.body.classList.remove('no-scroll'); toggle?.setAttribute('aria-expanded', 'false');
    ultimoFoco?.focus?.({ preventScroll: true });
  };
  toggle?.addEventListener('click', abrirFiltros);
  filtros.querySelector('.filtros-cerrar')?.addEventListener('click', cerrarFiltros);
  bdFiltros?.addEventListener('click', cerrarFiltros);
  filtros.querySelector('[data-ver-resultados]')?.addEventListener('click', () => { cerrarFiltros(); scrollSuave(inicio); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarFiltros(); });
  window.matchMedia('(max-width: 1024px)').addEventListener('change', syncDrawer);
  syncDrawer();

  const sincronizarControles = () => {
    filtros.querySelectorAll('input[data-f]').forEach(i => {
      const f = i.dataset.f;
      const v = f === 'talle' ? (i.value === UNICO ? UNICO : Number(i.value)) : i.value;
      i.checked = { sub: Filtro.subs, talle: Filtro.talles, color: Filtro.colores }[f].has(v);
    });
    if (precio) {
      precio.value = Filtro.precioMax ?? precio.max;
      const pct = ((precio.value - precio.min) / (precio.max - precio.min)) * 100;
      precio.style.setProperty('--pct', `${pct}%`);
      precioTxt.textContent = Filtro.precioMax === null ? 'Todos los precios' : `Hasta ${formatearPrecio(Filtro.precioMax)}`;
    }
    cinta?.querySelectorAll('[data-cinta-talle]').forEach(b => b.setAttribute('aria-pressed', String(Filtro.talles.has(Number(b.dataset.cintaTalle)))));
    if (nota) {
      const ts = [...Filtro.talles].filter(t => t !== UNICO);
      nota.innerHTML = ts.length === 1
        ? `Te mostramos lo que hay en talle ${ts[0]}. <button type="button" class="link" data-cinta-todos>Ver todos los talles</button>`
        : 'Tocá tu talle y te mostramos lo que hay en stock.';
    }
    chips?.querySelectorAll('[data-chip]').forEach(b => {
      const c = b.dataset.chip;
      const activo = c ? CATS[c].subs.length === Filtro.subs.size && CATS[c].subs.every(s => Filtro.subs.has(s)) : Filtro.subs.size === 0;
      b.setAttribute('aria-pressed', String(activo));
    });
    if (input && input.value !== Filtro.q) input.value = Filtro.q;
    if (orden) orden.value = Filtro.orden;
  };

  const chipsActivos = () => {
    const lista = [];
    if (Filtro.ids) lista.push(['ids', '', Filtro.idsLabel || 'Selección']);
    Filtro.subs.forEach(s => lista.push(['sub', s, subDe(s).label]));
    Filtro.talles.forEach(t => lista.push(['talle', t, t === UNICO ? 'Talle único' : `Talle ${t}`]));
    Filtro.colores.forEach(c => lista.push(['color', c, colorDe(c)[0]]));
    if (Filtro.precioMax !== null) lista.push(['precio', '', `Hasta ${formatearPrecio(Filtro.precioMax)}`]);
    if (Filtro.q) lista.push(['q', '', `“${Filtro.q}”`]);
    activos.innerHTML = lista.map(([k, v, l]) => `<button type="button" class="activo" data-quitar="${k}|${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`).join('');
  };

  const render = (reiniciar = false, animar = true) => {
    if (reiniciar) visibles = PAGINA;
    const lista = filtrar();
    const pagina = lista.slice(0, visibles);
    if (grid) {
      grid.innerHTML = pagina.map(p => tarjetaHTML(p, 'prod', animar)).join('');
    } else {
      const anchos = anchosPara(pagina.length, colsMq.matches ? 2 : 4);
      mosaico.innerHTML = pagina.map((p, i) => tileHTML(p, anchos.has(i), animar)).join('');
    }
    cuenta.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = lista.length > 0;
    vermas.hidden = lista.length <= visibles;
    vermas.textContent = `Ver más (${Math.min(PAGINA, lista.length - visibles)})`;
    sincronizarControles();
    chipsActivos();
    revelarNuevos(cont);
    refrescarTriggers();
  };
  Catalogo.render = render;
  Catalogo.irA = () => scrollSuave(document.getElementById('talle') || inicio);
  Catalogo.limpiar = () => {
    Filtro.subs.clear(); Filtro.talles.clear(); Filtro.colores.clear();
    Filtro.precioMax = null; Filtro.q = ''; Filtro.ids = null; Filtro.idsLabel = '';
  };
  Catalogo.aplicarCat = c => {
    Catalogo.limpiar();
    (CATS[c]?.subs || []).forEach(s => Filtro.subs.add(s));
    render(true);
    scrollSuave(inicio);
  };
  Catalogo.aplicarTalle = t => {
    const v = Number(t);
    Filtro.ids = null; Filtro.idsLabel = '';
    Filtro.talles = new Set([v]);
    MiTalle.set(v);
    render(true);
  };
  Catalogo.verNuevos = () => {
    Catalogo.limpiar();
    Filtro.orden = 'nuevos';
    render(true);
    scrollSuave(inicio);
  };
  Catalogo.aplicarIds = (ids, label) => {
    Catalogo.limpiar();
    Filtro.ids = new Set(ids);
    Filtro.idsLabel = label;
    render(true);
    scrollSuave(inicio);
  };

  filtros.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const f = i.dataset.f;
    const v = f === 'talle' ? (i.value === UNICO ? UNICO : Number(i.value)) : i.value;
    const set = { sub: Filtro.subs, talle: Filtro.talles, color: Filtro.colores }[f];
    if (i.checked) set.add(v); else set.delete(v);
    render(true);
  });
  precio?.addEventListener('input', () => {
    const v = Number(precio.value);
    Filtro.precioMax = v >= Number(precio.max) ? null : v;
    render(true);
  });
  cinta?.addEventListener('click', e => {
    const b = e.target.closest('[data-cinta-talle]');
    if (!b) return;
    const t = Number(b.dataset.cintaTalle);
    if (Filtro.talles.size === 1 && Filtro.talles.has(t)) { Filtro.talles.clear(); render(true); return; }
    Catalogo.aplicarTalle(t);
    showToast(`Listo: te mostramos lo que hay en talle ${t}`);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cinta-todos]')) { Filtro.talles.clear(); render(true); return; }
    const q = e.target.closest('[data-quitar]');
    if (q && activos.contains(q)) {
      const [k, v] = q.dataset.quitar.split('|');
      if (k === 'sub') Filtro.subs.delete(v);
      if (k === 'talle') Filtro.talles.delete(v === UNICO ? UNICO : Number(v));
      if (k === 'color') Filtro.colores.delete(v);
      if (k === 'precio') Filtro.precioMax = null;
      if (k === 'q') Filtro.q = '';
      if (k === 'ids') { Filtro.ids = null; Filtro.idsLabel = ''; }
      render(true);
      return;
    }
    if (e.target.closest('[data-limpiar]')) { Catalogo.limpiar(); render(true); }
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    const c = b.dataset.chip;
    Filtro.subs.clear(); Filtro.ids = null; Filtro.idsLabel = '';
    if (c) CATS[c].subs.forEach(s => Filtro.subs.add(s));
    render(true);
  });
  let tBusca = 0;
  input?.addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(() => { Filtro.q = input.value.trim(); render(true); }, 160); });
  busca?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = input.value.trim(); render(true); });
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(); });
  document.addEventListener('talle:cambio', () => render(false, false));
  colsMq.addEventListener('change', () => { if (mosaico) render(false, false); });
  render(true);
}

function initEntra() {
  const sec = document.querySelector('[data-entra]');
  if (!sec) return;
  const items = sec.querySelector('[data-entra-items]');
  const titular = sec.querySelector('[data-entra-titular]');
  const lista = sec.querySelector('[data-entra-lista]');
  const no = sec.querySelector('[data-entra-no]');
  const ver = sec.querySelector('[data-entra-ver]');
  const bolsos = PRODUCTOS.filter(p => p.medidas);
  items.insertAdjacentHTML('beforeend', ITEMS.map(it => `<label class="entra-item"><input type="checkbox" value="${it.id}"${it.def ? ' checked' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${it.icono}</svg><span>${esc(it.label)}</span><small>${Math.max(...it.dims)} cm</small></label>`).join(''));
  let entran = [];
  const evaluar = (p, elegidos) => {
    const B = [...p.medidas].sort((a, b) => b - a);
    const util = p.medidas.reduce((a, b) => a * b, 1) * 0.6;
    let vol = 0;
    let falla = null;
    elegidos.forEach(it => {
      const d = [...it.dims].sort((a, b) => b - a);
      vol += d[0] * d[1] * d[2];
      if (!falla && (d[0] > B[0] || d[1] > B[1] || d[2] > B[2])) falla = it;
    });
    const lleno = vol / util;
    return { p, falla, lleno, entra: !falla && lleno <= 1 };
  };
  const pintar = () => {
    const elegidos = [...items.querySelectorAll('input:checked')].map(i => ITEMS.find(it => it.id === i.value));
    if (!elegidos.length) {
      titular.innerHTML = 'Marcá lo que llevás para ver en qué cartera entra.';
      lista.innerHTML = ''; no.hidden = true; entran = [];
      ver.textContent = 'Ver todas las carteras';
      return;
    }
    const res = bolsos.map(p => evaluar(p, elegidos));
    entran = res.filter(r => r.entra).sort((a, b) => Math.abs(a.lleno - 0.62) - Math.abs(b.lleno - 0.62));
    const fuera = res.filter(r => !r.entra);
    titular.innerHTML = entran.length
      ? `Todo entra en <b>${entran.length}</b> de ${bolsos.length} carteras`
      : 'Con todo eso no alcanza ninguna: probá dejar algo afuera.';
    lista.innerHTML = entran.slice(0, 3).map(r => {
      const pct = Math.round(r.lleno * 100);
      const estado = r.lleno > 0.85 ? 'Entra justo' : r.lleno < 0.4 ? 'Te sobra lugar' : 'Entra cómodo';
      return `<li class="entra-fila${r.lleno > 0.85 ? ' justa' : ''}">
        <div class="entra-info">
          <p class="entra-nombre"><span class="swatch" style="--c:${colorDe(r.p.color)[1]}"></span>${esc(r.p.nombre)} · ${formatearPrecio(precioFinal(r.p))}</p>
          <p class="entra-medida">Interior ${r.p.medidas.join(' × ')} cm</p>
          <div class="entra-barra" aria-hidden="true"><i style="--lleno:${Math.min(pct, 100)}%"></i></div>
          <p class="entra-estado">${estado} · ocupa el ${pct}%</p>
        </div>
        <button type="button" class="btn btn-cta" data-add="${r.p.id}" aria-label="Agregar ${esc(r.p.nombre)} al carrito">Agregar</button>
      </li>`;
    }).join('');
    no.hidden = !fuera.length;
    no.innerHTML = fuera.length ? `No entra en: ${fuera.map(r => `<b>${esc(r.p.nombre)}</b> (${r.falla ? `${esc(r.falla.art)} ${r.falla.plural ? 'miden' : 'mide'} ${Math.max(...r.falla.dims)} cm` : 'no alcanza el espacio'})`).join(', ')}.` : '';
    ver.textContent = entran.length ? `Ver ${entran.length === 1 ? 'la cartera' : `las ${entran.length} carteras`} en la tienda` : 'Ver todas las carteras';
  };
  items.addEventListener('change', pintar);
  ver.addEventListener('click', () => {
    if (!Catalogo.aplicarIds) return;
    if (entran.length) Catalogo.aplicarIds(entran.map(r => r.p.id), 'Carteras donde te entra todo');
    else Catalogo.aplicarCat('carteras');
  });
  pintar();
}

function initCrece() {
  const sec = document.querySelector('[data-crece]');
  if (!sec) return;
  const foto = sec.querySelector('[data-crece-foto]');
  const talleEl = sec.querySelector('[data-crece-talle]');
  const nEl = sec.querySelector('[data-crece-n]');
  const marca = sec.querySelector('[data-crece-marca]');
  const cta = sec.querySelector('[data-crece-cta]');
  const conteo = TALLES.map(prendasEnTalle);
  let actual = -1;
  const marcar = i => {
    if (i === actual) return;
    actual = i;
    const t = TALLES[i];
    talleEl.textContent = t;
    nEl.textContent = cuantos(conteo[i], 'prenda', 'prendas');
    marca.style.setProperty('--p', (i / (TALLES.length - 1)).toFixed(3));
    cta.textContent = `Ver ${conteo[i] === 1 ? 'la prenda' : `las ${conteo[i]}`} en talle ${t}`;
    cta.dataset.talle = t;
  };
  cta.addEventListener('click', () => {
    const t = Number(cta.dataset.talle);
    if (!Catalogo.aplicarTalle) return;
    Catalogo.limpiar();
    Catalogo.aplicarTalle(t);
    Catalogo.irA();
    showToast(`Te mostramos lo que hay en talle ${t}`);
  });
  if (reduceMotion) {
    sec.classList.add('is-static');
    const t = MiTalle.get();
    marcar(t ? TALLES.indexOf(t) : 5);
    return;
  }
  const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const pintar = pr => {
    const avance = clamp01((pr - 0.06) / 0.8);
    const g = suave(avance);
    const movil = window.innerWidth <= 767;
    const ini = movil ? { t: 6, l: 24, r: 24, b: 46 } : { t: 12, l: 50, r: 26, b: 12 };
    foto.style.clipPath = `inset(${(ini.t * (1 - g)).toFixed(2)}% ${(ini.r * (1 - g)).toFixed(2)}% ${(ini.b * (1 - g)).toFixed(2)}% ${(ini.l * (1 - g)).toFixed(2)}% round ${(4 * (1 - g)).toFixed(1)}px)`;
    foto.style.setProperty('--cs', (1.14 - 0.14 * g).toFixed(3));
    marcar(Math.round(avance * (TALLES.length - 1)));
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = sec.querySelector('.crece-pista').getBoundingClientRect();
    const total = r.height - (window.innerHeight - OFF);
    pintar(total > 0 ? clamp01((OFF - r.top) / total) : 0);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', update);
  update();
}

function initColecciones() {
  document.querySelectorAll('[data-coleccion-n]').forEach(el => {
    const c = el.dataset.coleccionN;
    const n = PRODUCTOS.filter(p => CATS[c]?.subs.includes(p.sub)).length;
    el.textContent = cuantos(n, c === 'ropa' ? 'prenda' : 'pieza', c === 'ropa' ? 'prendas' : 'piezas');
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  track.innerHTML = PRODUCTOS.filter(p => p.nuevo).slice(0, 6).map(p => tarjetaHTML(p, 'prod rail-card')).join('');
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
  document.addEventListener('talle:cambio', () => { track.innerHTML = PRODUCTOS.filter(p => p.nuevo).slice(0, 6).map(p => tarjetaHTML(p, 'prod rail-card', false)).join(''); });
  flechas();
}

let qvEstado = null;
function vistasDe(p) {
  const [cx, cy, z] = p.foco;
  return [p.foco, [cx, cy, Math.max(1, z * 0.62)], [cx, cy, z * 1.35]];
}
function openQuickview(id, { talle: talleInicial } = {}) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  const s = subDe(p.sub);
  const media = modal.querySelector('[data-qv-media]');
  const thumbs = modal.querySelector('[data-qv-thumbs]');
  const vistas = vistasDe(p);
  const verVista = k => {
    media.setAttribute('style', recorte(p.img, vistas[k], 0.8));
    thumbs.querySelectorAll('[data-qv-vista]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.qvVista) === k)));
  };
  media.innerHTML = `<img src="images/${p.img}" alt="${esc(p.alt)}" width="${IMG[p.img][0]}" height="${IMG[p.img][1]}">`;
  thumbs.innerHTML = vistas.map((v, k) => `<button type="button" class="qv-thumb" data-qv-vista="${k}" aria-pressed="${k === 0}" aria-label="Ver foto ${k + 1}"><span class="recorte" style="${recorte(p.img, v, 1)}"><img src="images/${p.img}" alt="" width="200" height="200"></span></button>`).join('');
  thumbs.onclick = e => { const b = e.target.closest('[data-qv-vista]'); if (b) verVista(Number(b.dataset.qvVista)); };
  verVista(0);
  modal.querySelector('[data-qv-meta]').textContent = `${s.label} · ${colorDe(p.color)[0]}`;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-precio]').innerHTML = precioHTML(p);
  modal.querySelector('[data-qv-desc]').textContent = p.desc;
  const bloque = modal.querySelector('[data-qv-talles-bloque]');
  const tallesEl = modal.querySelector('[data-qv-talles]');
  const talleTxtEl = modal.querySelector('[data-qv-talle-txt]');
  const guia = modal.querySelector('[data-guia]');
  const wsp = modal.querySelector('[data-qv-wsp]');
  const cantEl = modal.querySelector('[data-qv-cant]');
  const mi = MiTalle.get();
  qvEstado = { p, talle: null, cant: 1 };
  if (esRopa(p)) {
    const pref = talleInicial ?? mi;
    qvEstado.talle = pref && hayTalle(p, pref) ? Number(pref) : null;
  } else {
    qvEstado.talle = UNICO;
  }
  const pintarTalles = () => {
    const t = qvEstado.talle;
    if (esRopa(p)) {
      tallesEl.innerHTML = TALLES.map(x => `<button type="button" class="qv-talle${x === mi ? ' tuyo' : ''}" data-qv-talle="${x}" aria-pressed="${x === t}"${hayTalle(p, x) ? '' : ' disabled'} aria-label="Talle ${x}${hayTalle(p, x) ? '' : ', sin stock'}${x === mi ? ', tu talle' : ''}">${x}</button>`).join('');
      talleTxtEl.textContent = t ? `Talle ${t} · hay stock` : 'Elegí tu talle';
      guia.innerHTML = `<table><thead><tr><th scope="col">Talle</th><th scope="col">Busto</th><th scope="col">Cintura</th><th scope="col">Cadera</th></tr></thead><tbody>${TALLES.map(x => `<tr${x === t ? ' class="tuyo"' : ''}><td>${x}</td><td>${GUIA[x][0]}</td><td>${GUIA[x][1]}</td><td>${GUIA[x][2]}</td></tr>`).join('')}</tbody></table><p>Medidas del cuerpo en centímetros.</p>`;
    }
    wsp.href = wspHref(`Hola! Quiero consultar por ${p.nombre}${esRopa(p) && t ? ` en talle ${t}` : ''}.`);
  };
  bloque.hidden = !esRopa(p);
  tallesEl.onclick = e => {
    const b = e.target.closest('[data-qv-talle]');
    if (!b || b.disabled) return;
    qvEstado.talle = Number(b.dataset.qvTalle);
    pintarTalles();
  };
  pintarTalles();
  cantEl.textContent = '1';
  modal.querySelector('[data-qv-menos]').onclick = () => { qvEstado.cant = Math.max(1, qvEstado.cant - 1); cantEl.textContent = qvEstado.cant; };
  modal.querySelector('[data-qv-mas]').onclick = () => { qvEstado.cant = Math.min(9, qvEstado.cant + 1); cantEl.textContent = qvEstado.cant; };
  const agregar = () => {
    if (!qvEstado.talle) {
      showToast('Elegí tu talle primero');
      tallesEl.querySelector('.qv-talle:not(:disabled)')?.focus();
      return false;
    }
    Cart.add(p, qvEstado.talle, qvEstado.cant);
    if (esRopa(p)) MiTalle.set(qvEstado.talle);
    showToast(`Agregaste ${p.nombre}${esRopa(p) ? ` en talle ${qvEstado.talle}` : ''}`);
    return true;
  };
  modal.querySelector('[data-qv-add]').onclick = () => { if (agregar()) closeQuickview(); };
  modal.querySelector('[data-qv-comprar]').onclick = () => { if (agregar()) { closeQuickview(false); openCartDrawer(); } };
  const rel = PRODUCTOS.filter(x => x.id !== p.id && subDe(x.sub).cat === s.cat).sort((a, b) => (a.sub === p.sub ? 0 : 1) - (b.sub === p.sub ? 0 : 1) || a.orden - b.orden).slice(0, 3);
  modal.querySelector('[data-qv-rel]').innerHTML = rel.map(x => `<button type="button" class="qv-rel-item" data-open-quickview="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 0.8)}"><img src="images/${x.img}" alt="" width="200" height="250"></span><span>${esc(x.nombre)}</span><span class="precio">${precioHTML(x)}</span></button>`).join('');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('.quickview-panel').scrollTop = 0;
  trapFocus(modal);
  modal.querySelector('.quickview-cerrar').focus();
}
function closeQuickview(devolverFoco = true) {
  const modal = document.getElementById('quickview');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  if (devolverFoco) ultimoFoco?.focus?.({ preventScroll: true });
}
function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar').addEventListener('click', () => closeQuickview());
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickview(); });
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

function renderCart() {
  const cont = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (!cont) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = `<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg><p>Tu carrito está vacío</p><p>Elegí tu talle y empezá por lo que te queda.</p><button type="button" class="btn btn-line" data-cerrar-e-ir>Ver la tienda</button></div>`;
    footer.hidden = true;
    return;
  }
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="cart-item">
      ${fotoHTML(p, 'cart-foto', 0.8)}
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="cart-item-meta">${i.talle === UNICO ? 'Talle único' : `Talle ${i.talle}`} · ${esc(colorDe(p.color)[0])}</span>
        <span class="precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <div class="cart-item-fila">
          <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
            <button type="button" data-cart-menos="${p.id}|${i.talle}" aria-label="Uno menos">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-mas="${p.id}|${i.talle}" aria-label="Uno más">+</button>
          </div>
          <button type="button" class="cart-quitar" data-cart-quitar="${p.id}|${i.talle}" aria-label="Quitar ${esc(p.nombre)}">Quitar</button>
        </div>
      </div>
    </div>`;
  }).join('');
  footer.hidden = false;
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) wsp.href = wspHref(mensajeCarrito());
}
function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
  renderCart();
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
    const menos = e.target.closest('[data-cart-menos]');
    const mas = e.target.closest('[data-cart-mas]');
    const quitar = e.target.closest('[data-cart-quitar]');
    const par = (menos || mas || quitar)?.dataset;
    if (par) {
      const [id, t] = (par.cartMenos || par.cartMas || par.cartQuitar).split('|');
      const talle = t === UNICO ? UNICO : Number(t);
      const it = Cart.get().find(i => i.id === Number(id) && i.talle === talle);
      if (quitar) { Cart.remove(id, talle); return; }
      if (it) Cart.setQty(id, talle, it.qty + (mas ? 1 : -1));
      return;
    }
    if (e.target.closest('[data-cerrar-e-ir]')) { closeCartDrawer(); Catalogo.irA?.(); return; }
    if (e.target.closest('[data-vaciar]')) { Cart.clear(); showToast('Vaciamos tu carrito'); return; }
    if (e.target.closest('[data-checkout]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
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

function addDesdeCard(id) {
  const p = getProducto(id);
  if (!p) return;
  const t = esRopa(p) ? MiTalle.get() : UNICO;
  if (!t || !hayTalle(p, t)) { openQuickview(p.id); return; }
  Cart.add(p, t, 1);
  showToast(`Agregaste ${p.nombre}${esRopa(p) ? ` en talle ${t}` : ''}`);
}

function initAtajos() {
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat-link]');
    if (cat && Catalogo.aplicarCat) { e.preventDefault(); Catalogo.aplicarCat(cat.dataset.catLink); return; }
    const cinta = e.target.closest('[data-ir-cinta]');
    if (cinta) {
      e.preventDefault();
      const destino = document.getElementById('talle');
      scrollSuave(destino);
      const mi = MiTalle.get();
      setTimeout(() => (destino?.querySelector(`[data-cinta-talle="${mi}"]`) || destino?.querySelector('[data-cinta-talle]'))?.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
      return;
    }
    const nuevos = e.target.closest('[data-ver-nuevos]');
    if (nuevos && Catalogo.verNuevos) { Catalogo.verNuevos(); return; }
    const add = e.target.closest('[data-add]');
    if (add) { addDesdeCard(Number(add.dataset.add)); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(Number(ver.dataset.openQuickview));
    const buscar = e.target.closest('[data-buscar]');
    if (buscar) {
      const input = document.getElementById('busca');
      scrollSuave(document.querySelector('[data-catalogo-inicio]'));
      setTimeout(() => input?.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    }
  });
}

function initSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tienda de Tamara Marelli',
    itemListElement: PRODUCTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        image: `https://gokywebs.com/demo/tamaramarelli/images/${p.img}`,
        description: p.desc,
        offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' },
      },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const t = Number(params.get('talle'));
  if (TALLES.includes(t) && Catalogo.aplicarTalle) Catalogo.aplicarTalle(t);
  const slug = params.get('producto');
  const p = slug && PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuickview(p.id);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(hero.querySelectorAll('[data-hero-in]'), { y: 26, opacity: 0, duration: 1.1, stagger: 0.09, clearProps: 'transform,opacity' });
  const foto = hero.querySelector('[data-hero-foto] .recorte, .hero-c-foto');
  if (foto) tl.from(foto, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.05);
  const etiqueta = hero.querySelector('.etiqueta');
  if (etiqueta) tl.from(etiqueta, { opacity: 0, y: -18, duration: 0.9, clearProps: 'transform,opacity' }, 0.7);
}

document.addEventListener('DOMContentLoaded', () => {
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCatalogo();
  initEntra();
  initColecciones();
  initRail();
  initCrece();
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
