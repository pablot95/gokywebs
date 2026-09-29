const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491128180898';
const MARCA = 'Cortinas Metálicas Roma';
const ES_M2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FOTOS = {
  '01': { src: 'images/01_cortina_metalica_vertical_9x16.webp', w: 1080, h: 1920 },
  '02': { src: 'images/02_cortinas_metalicas_horizontal_16x9.webp', w: 1600, h: 900 },
  '03': { src: 'images/03_cortina_metalica_detalle_1x1.webp', w: 1200, h: 1200 },
  '04': { src: 'images/04_cortina_metalica_comercio_1x1.webp', w: 1200, h: 1200 },
  '05': { src: 'images/05_cortina_metalica_automatizada_1x1.webp', w: 1200, h: 1200 },
  '06': { src: 'images/06_cortinas_metalicas_industriales_1x1.webp', w: 1200, h: 1200 }
};

const CATS = { cortinas: 'Cortinas a medida', motores: 'Motores y controles', repuestos: 'Repuestos', seguridad: 'Seguridad' };
const USOS = { comercio: 'Local comercial', casa: 'Garage o casa', industria: 'Galpón o depósito' };
const MUEVE = { mano: 'A mano', motor: 'Con motor' };
const NEC = { automatizar: 'Automatizarla', reparar: 'Repararla', seguridad: 'Más seguridad', nueva: 'Una cortina nueva' };
const TABLILLAS = { ciega: 'ciega galvanizada', grafito: 'ciega color grafito', micro: 'microperforada' };
const EXTRAS = { escape: 'puerta de escape', barral: 'barral de seguridad' };
const FALLAS = { sube: 'no sube o no baja', traba: 'se trabó', resorte: 'resorte cortado', motor: 'motor o control', tablilla: 'tablilla golpeada' };
const KG_M2 = { ciega: 10.5, grafito: 10.5, micro: 9 };
const MOTORES = [{ k: '300', m2: 12 }, { k: '600', m2: 18 }, { k: '800', m2: 32 }, { k: '1000', m2: 40 }];
const TODOS_USOS = ['comercio', 'casa', 'industria'];
const AMBOS = ['mano', 'motor'];

const PRODUCTOS = [
  { id: 'cortina-ciega', cat: 'cortinas', medida: true, nombre: 'Cortina de tablilla ciega galvanizada', foto: '04', foco: [0.5, 0.5, 1],
    usos: ['comercio', 'casa'], mueve: AMBOS, nec: ['nueva'], prio: 1, dato: 'Espesores 0,60 · 0,70 · 0,90 mm',
    desc: 'La cortina clásica de frente de local: tablilla ciega de chapa galvanizada, fabricada con el ancho y el alto de tu vano.',
    ficha: [['Tablilla', 'Ciega, de chapa galvanizada'], ['Espesores', '0,60 · 0,70 · 0,90 mm'], ['Accionamiento', 'A mano con resortes o con motor'], ['Incluye', 'Eje, guías y zócalo']],
    cotizar: { modo: 'nueva', tablilla: 'ciega' }, alt: 'Cortina metálica galvanizada cerrada en el frente de un local' },
  { id: 'cortina-grafito', cat: 'cortinas', medida: true, nombre: 'Cortina pintada color grafito', foto: '01', foco: [0.5, 0.46, 1],
    usos: ['casa', 'comercio'], mueve: AMBOS, nec: ['nueva'], prio: 2, dato: 'Tablilla ciega · terminación grafito',
    desc: 'Tablilla ciega pintada en grafito, para frentes donde la cortina tiene que acompañar la fachada.',
    ficha: [['Tablilla', 'Ciega, pintada color grafito'], ['Para', 'Garage, casa o local'], ['Accionamiento', 'A mano o con motor y control remoto'], ['Incluye', 'Eje, guías y zócalo']],
    cotizar: { modo: 'nueva', tablilla: 'grafito' }, alt: 'Cortina metálica color grafito cerrada en un frente moderno' },
  { id: 'motor-paralelo', cat: 'motores', nombre: 'Motor paralelo para cortina metálica', foto: '05', foco: [0.62, 0.45, 1.9],
    variantes: [
      { k: '300', nombre: '300 kg', dato: 'hasta 12 m²', precio: 249900, stock: 6 },
      { k: '600', nombre: '600 kg', dato: 'hasta 18 m²', precio: 309900, stock: 5 },
      { k: '800', nombre: '800 kg', dato: 'hasta 32 m²', precio: 565900, stock: 3 },
      { k: '1000', nombre: '1000 kg', dato: 'hasta 40 m²', precio: 661900, stock: 2 }
    ],
    varTit: 'Capacidad', elegir: 'Elegir capacidad', vUso: { comercio: '300', casa: '300', industria: '800' },
    usos: TODOS_USOS, mueve: AMBOS, nec: ['automatizar', 'reparar-motor'], prio: 1, dato: 'Con receptor y 2 controles',
    desc: 'Motor que va al costado del eje. Viene con receptor y dos controles remotos, y se elige por los metros cuadrados de la cortina.',
    ficha: [['Incluye', 'Motor, receptor y 2 controles'], ['Montaje', 'Paralelo al eje'], ['Alimentación', '220 V'], ['Se elige', 'Por los m² de la cortina']],
    alt: 'Motor de cortina metálica montado al costado del eje' },
  { id: 'tablilla', cat: 'repuestos', nombre: 'Tablilla ciega galvanizada', precio: 10900, descuento: 0, unidad: 'm', stock: 40, foto: '03', foco: [0.46, 0.5, 1.25],
    usos: TODOS_USOS, mueve: AMBOS, nec: ['reparar'], prio: 2, dato: '0,70 mm · por metro lineal',
    desc: 'Tablilla de repuesto para cambiar las que se golpearon o se doblaron, sin cambiar toda la cortina.',
    ficha: [['Espesor', '0,70 mm'], ['Material', 'Chapa galvanizada'], ['Se vende', 'Por metro lineal'], ['Para', 'Reemplazar tablillas golpeadas']],
    alt: 'Perfil de tablillas metálicas galvanizadas en primer plano' },
  { id: 'cortina-industrial', cat: 'cortinas', medida: true, nombre: 'Cortina industrial para nave', foto: '06', foco: [0.42, 0.55, 1.15],
    usos: ['industria'], mueve: ['motor', 'mano'], nec: ['nueva'], prio: 1, dato: 'Tablilla reforzada · guías de 70 × 50 mm',
    desc: 'Para naves y depósitos con bocas anchas: tablilla reforzada, guías de 70 × 50 mm y el motor según los metros de la cortina.',
    ficha: [['Tablilla', 'Ciega galvanizada reforzada, 0,90 mm'], ['Guías', '70 × 50 mm'], ['Accionamiento', 'Con motor según los m²'], ['Incluye', 'Eje octogonal, guías y zócalo']],
    cotizar: { modo: 'nueva', tablilla: 'ciega', mueve: 'motor', ancho: 600, alto: 500 }, alt: 'Nave industrial con cortinas metálicas galvanizadas cerradas' },
  { id: 'resortes', cat: 'repuestos', nombre: 'Resortes para cortina manual', precio: 38900, descuento: 0, unidad: 'par', stock: 2, foto: null, slot: 'resortes.webp',
    usos: ['comercio', 'casa'], mueve: ['mano'], nec: ['reparar-mano'], prio: 1, dato: 'El par · según ancho y peso',
    desc: 'Los resortes hacen que la cortina suba liviana. Cuando se cortan o se cansan, pesa o no se queda arriba.',
    ficha: [['Se vende', 'El par'], ['Para', 'Cortinas a mano'], ['Se eligen', 'Según el ancho y el peso'], ['Síntoma', 'La cortina pesa o se cae sola']],
    alt: 'Par de resortes para cortina metálica' },
  { id: 'barral', cat: 'seguridad', nombre: 'Barral de seguridad para cortina', foto: null, slot: 'barral-de-seguridad.webp',
    variantes: [
      { k: '2', nombre: '2,00 m', precio: 49900, stock: 6 },
      { k: '3', nombre: '3,00 m', precio: 64900, stock: 4 },
      { k: '4', nombre: '4,00 m', precio: 79900, stock: 3 }
    ],
    varTit: 'Largo', elegir: 'Elegir largo', vUso: { comercio: '3', casa: '3', industria: '4' },
    usos: TODOS_USOS, mueve: AMBOS, nec: ['seguridad'], prio: 1, dato: 'Traba la cortina desde afuera',
    desc: 'Una barra de acero que cruza la cortina de guía a guía y se traba con candados: una segunda cerradura a la vista.',
    ficha: [['Colocación', 'De guía a guía, por fuera'], ['Traba', 'Con candado en cada punta'], ['Largos', '2,00 · 3,00 · 4,00 m'], ['Para', 'Locales que quedan cerrados de noche']],
    alt: 'Barral de seguridad cruzando una cortina metálica' },
  { id: 'cortinas-deposito', cat: 'cortinas', medida: true, nombre: 'Cortinas para depósito de varias bocas', foto: '02', foco: [0.3, 0.55, 1.05],
    usos: ['industria', 'comercio'], mueve: ['motor', 'mano'], nec: ['nueva'], prio: 2, dato: 'La misma tablilla en todas las bocas',
    desc: 'Varias cortinas iguales en el mismo galpón: se fabrican juntas, con la misma tablilla y la misma terminación.',
    ficha: [['Tablilla', 'Ciega galvanizada'], ['Bocas', 'Las que tenga el depósito'], ['Accionamiento', 'A mano o con motor en cada boca'], ['Incluye', 'Eje, guías y zócalo por boca']],
    cotizar: { modo: 'nueva', tablilla: 'ciega', mueve: 'motor', ancho: 450, alto: 400 }, alt: 'Galpón con varias cortinas metálicas galvanizadas en fila' },
  { id: 'control-remoto', cat: 'motores', nombre: 'Control remoto extra', precio: 9900, descuento: 0, stock: 3, foto: null, slot: 'control-remoto.webp',
    usos: TODOS_USOS, mueve: AMBOS, nec: ['automatizar', 'reparar-motor'], prio: 2, dato: '433 MHz · 2 botones',
    desc: 'Un control más para tu motor: uno para cada persona que abre el local o el garage.',
    ficha: [['Frecuencia', '433 MHz'], ['Botones', '2'], ['Pila', 'Incluida'], ['Se programa', 'Con el receptor del motor']],
    alt: 'Control remoto para cortina metálica' },
  { id: 'guias', cat: 'repuestos', nombre: 'Guías laterales 60 × 40 mm', precio: 18900, descuento: 0, unidad: 'm', stock: 24, foto: '02', foco: [0.6, 0.5, 2.4],
    usos: TODOS_USOS, mueve: AMBOS, nec: ['reparar'], prio: 3, dato: 'El par · por metro de alto',
    desc: 'Las guías por donde corre la cortina. Se cambian cuando están torcidas o la cortina se sale del riel.',
    ficha: [['Medida', '60 × 40 mm'], ['Material', 'Chapa galvanizada'], ['Se vende', 'El par, por metro de alto'], ['Para', 'Cortinas de local y garage']],
    alt: 'Columna con las guías laterales entre dos cortinas metálicas' },
  { id: 'puerta-escape', cat: 'seguridad', medida: true, nombre: 'Puerta de escape para cortina', foto: null, slot: 'puerta-de-escape.webp',
    usos: ['comercio', 'industria'], mueve: AMBOS, nec: ['seguridad', 'nueva'], prio: 2, dato: 'Con cerradura antipánico',
    desc: 'Una puerta peatonal dentro de la cortina, para entrar y salir sin levantarla. Desde adentro se abre con cerradura antipánico.',
    ficha: [['Tipo', 'Puerta peatonal en la cortina'], ['Cerradura', 'Antipánico'], ['Se fabrica', 'Junto con la cortina'], ['Medida', 'Según el vano']],
    cotizar: { modo: 'nueva', extras: ['escape'] }, alt: 'Puerta de escape en una cortina metálica' },
  { id: 'zocalo', cat: 'repuestos', nombre: 'Zócalo para cortina', precio: 14900, descuento: 10, unidad: 'm', stock: 18, foto: '06', foco: [0.4, 0.88, 2.6],
    usos: TODOS_USOS, mueve: AMBOS, nec: ['reparar'], prio: 3, dato: 'Por metro de ancho',
    desc: 'El pie de la cortina, la parte que apoya contra el piso. Si está golpeado, la cortina no cierra pareja.',
    ficha: [['Ubicación', 'Última tablilla, contra el piso'], ['Material', 'Chapa galvanizada'], ['Se vende', 'Por metro de ancho'], ['Para', 'Cierres que no asientan parejo']],
    alt: 'Parte baja de una cortina metálica galvanizada apoyada en el piso' }
];

const FRENTES = [
  { uso: 'comercio', foto: '04', foco: [0.5, 0.5], etq: 'Local comercial', t1: 'Tu local,', t2: 'cerrado de verdad', txt: 'Tablilla ciega galvanizada, guías y zócalo. A mano con resortes o con motor.', ancho: 400, alto: 300, tablilla: 'ciega', mueve: 'mano' },
  { uso: 'casa', foto: '01', foco: [0.5, 0.42], etq: 'Garage o casa', t1: 'Entrás con el auto', t2: 'sin bajarte', txt: 'Pintada en grafito y con motor: sube y baja con el control remoto.', ancho: 280, alto: 240, tablilla: 'grafito', mueve: 'motor' },
  { uso: 'industria', foto: '06', foco: [0.44, 0.6], etq: 'Nave industrial', t1: 'Bocas grandes,', t2: 'motor a la medida', txt: 'Tablilla reforzada, guías de 70 × 50 mm y el motor según los metros de la cortina.', ancho: 600, alto: 500, tablilla: 'ciega', mueve: 'motor' },
  { uso: 'industria', foto: '02', foco: [0.34, 0.55], etq: 'Depósito con varias bocas', t1: 'Todas las bocas,', t2: 'iguales', txt: 'Se fabrican juntas, con la misma tablilla y la misma terminación en cada boca.', ancho: 450, alto: 400, tablilla: 'ciega', mueve: 'motor' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fmtDec = (n, d) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtM = cm => `${fmtDec(cm / 100, 2)} m`;
const fmtM2 = m2 => `${fmtDec(m2, 2)} m²`;
const fmtKg = kg => `${Math.round(kg).toLocaleString('es-AR')} kg`;
const esMedida = p => !!p.medida;
const tieneVars = p => Array.isArray(p.variantes) && p.variantes.length > 0;
const varDe = (p, k) => (tieneVars(p) ? p.variantes.find(v => v.k === k) || null : null);
const varDefault = p => (tieneVars(p) ? p.variantes[0].k : '');
const precioBase = (p, k) => { const v = varDe(p, k); return v ? v.precio : (p.precio || 0); };
const precioFinal = (p, k) => { const b = precioBase(p, k); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const stockDe = (p, k) => { if (esMedida(p)) return 0; const v = varDe(p, k); return v ? v.stock : (p.stock ?? 0); };
const desde = p => (tieneVars(p) ? Math.min(...p.variantes.map(v => precioFinal(p, v.k))) : precioFinal(p, ''));
const nombreCon = (p, k) => { const v = varDe(p, k); return v ? `${p.nombre} ${v.nombre}` : p.nombre; };
const unidadTxt = p => (p.unidad === 'm' ? 'el metro' : p.unidad === 'par' ? 'el par' : '');
const cantTxt = (p, q) => (p.unidad === 'm' ? `${q} m` : p.unidad === 'par' ? `${q} ${q === 1 ? 'par' : 'pares'}` : `${q}`);
const motorPara = m2 => { const m = MOTORES.find(x => m2 <= x.m2); return m ? m.k : null; };
const motorM2 = k => MOTORES.find(x => x.k === k)?.m2 ?? 0;
const AR_CARD = window.matchMedia('(max-width: 640px)').matches ? 0.75 : (ES_M2 && window.matchMedia('(min-width: 861px)').matches ? 1.6 : 1);

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId] || { w: 1, h: 1 };
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / f.w, 1 / f.h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = f.w > vw + 0.5 ? clamp01((cx * f.w - vw / 2) / (f.w - vw)) : 0.5;
  const py = f.h > vh + 0.5 ? clamp01((cy * f.h - vh / 2) / (f.h - vh)) : 0.5;
  const x0 = (f.w - vw) * px;
  const y0 = (f.h - vh) * py;
  const fx = z > 1 ? clamp01((cx * f.w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * f.h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fotoHTML(p, ar, clase = '', extra = '') {
  if (!p.foto) {
    return `<div class="recorte recorte--pendiente ${clase}"${extra} role="img" aria-label="${esc(p.alt)}" data-foto-esperada="images/${esc(p.slot)}" style="--ar:${ar};--pend:url('images/${esc(p.slot)}')"></div>`;
  }
  const f = FOTOS[p.foto];
  return `<div class="recorte ${clase}"${extra} style="--ar:${ar};${recorte(p.foto, p.foco, ar)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(p.alt)}"></div>`;
}

const Cart = {
  KEY: 'cortinasroma_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id, v = '') { return this.get().filter(i => i.id === id && (i.v || '') === v).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const libre = stockDe(producto, v) - this.enCarrito(producto.id, v);
    const suma = Math.max(0, Math.min(qty, libre));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && !esMedida(p) ? s + precioFinal(p, i.v || '') * i.qty : s; }, 0); }
};

function sanearCarrito() {
  let items;
  try { items = JSON.parse(localStorage.getItem(Cart.KEY)) || []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  const limpios = [];
  items.forEach(i => {
    const p = i && getProducto(i.id);
    if (!p || esMedida(p)) return;
    const v = tieneVars(p) ? (varDe(p, i.v) ? i.v : '') : '';
    if (tieneVars(p) && !v) return;
    const ya = limpios.filter(x => x.id === p.id && x.v === v).reduce((s, x) => s + x.qty, 0);
    const qty = Math.min(Math.max(1, Math.floor(Number(i.qty)) || 1), stockDe(p, v) - ya);
    if (qty > 0) limpios.push({ id: p.id, v, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { limpios.length = 0; }
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

const ICONO_CARRITO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function precioHTML(p, k = '') {
  if (esMedida(p)) return '<p class="precio precio--medida"><span class="precio__f">A medida</span><span class="precio__u">cotizá con tus medidas</span></p>';
  const conDesde = tieneVars(p) && !k;
  const f = conDesde ? desde(p) : precioFinal(p, k);
  const o = p.descuento > 0 ? precioBase(p, k) : 0;
  return `<p class="precio">${conDesde ? '<span class="precio__u">Desde</span>' : ''}<span class="precio__f">${formatearPrecio(f)}</span>${o ? `<s class="precio__o">${formatearPrecio(o)}</s>` : ''}${unidadTxt(p) ? `<span class="precio__u">${unidadTxt(p)}</span>` : ''}</p>`;
}

function stepperHTML(id, clase = '') {
  return `<div class="stepper${clase}" data-stepper="${id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

/* ---------- tarjeta ---------- */
function cardHTML(p, animar = true) {
  const libre = stockDe(p, '') - Cart.enCarrito(p.id, '');
  const badges = [
    esMedida(p) ? '<span class="badge badge--medida">A medida</span>' : '',
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : '',
    !esMedida(p) && !tieneVars(p) && p.stock > 0 && p.stock <= 3 ? '<span class="badge badge--poco">Últimas unidades</span>' : ''
  ].join('');
  let acciones;
  if (esMedida(p)) acciones = `<button type="button" class="btn btn--solid btn--sm prod-add" data-cotizar="${p.id}">Cotizar</button>`;
  else if (tieneVars(p)) acciones = `<button type="button" class="btn btn--solid btn--sm prod-add" data-quick="${p.id}">${esc(p.elegir)}</button>`;
  else acciones = `${stepperHTML(p.id)}<button type="button" class="btn btn--solid btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO_MAS}<span class="lbl-long">Agregar</span></button>`;
  const comprar = !esMedida(p) && !tieneVars(p) && p.stock > 0 ? `<button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>` : '';
  return `<article class="card" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
    <div class="card__media">
      ${fotoHTML(p, AR_CARD, 'card__img', ` data-quick="${p.id}"`)}
      <div class="card__badges">${badges}</div>
      <button type="button" class="card__quick" data-quick="${p.id}" tabindex="-1" aria-hidden="true">Vista rápida</button>
    </div>
    <div class="card__body">
      <p class="card__cat">${esc(CATS[p.cat])}</p>
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__spec">${esc(p.dato)}</p>
      ${precioHTML(p)}
      <div class="prod-actions">${acciones}</div>
      ${comprar}
    </div>
  </article>`;
}

/* ---------- catálogo ---------- */
const PASO = 16;
let visibles = PASO;
const FILTRO = { q: '', cat: '', uso: '', mueve: '', nec: '', orden: 'recomendados' };

function compatible(p, uso, mueve, nec) {
  if (uso && !p.usos.includes(uso)) return false;
  if (mueve && !p.mueve.includes(mueve)) return false;
  if (nec) {
    const ok = n => n === nec || (nec === 'reparar' && n.startsWith('reparar') && (!mueve || n === 'reparar' || n === `reparar-${mueve}`));
    if (!p.nec.some(ok)) return false;
  }
  return true;
}

function textoDe(p) {
  return normal([p.nombre, CATS[p.cat], p.dato, p.desc, ...p.usos.map(u => USOS[u]), ...p.ficha.map(f => f.join(' ')), ...(p.variantes || []).map(v => v.nombre)].join(' '));
}

function filtrar() {
  const palabras = normal(FILTRO.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (FILTRO.cat && p.cat !== FILTRO.cat) return false;
    if (!compatible(p, FILTRO.uso, FILTRO.mueve, FILTRO.nec)) return false;
    if (palabras.length) { const t = textoDe(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  if (FILTRO.orden === 'menor') lista = lista.slice().sort((a, b) => (esMedida(a) ? Infinity : desde(a)) - (esMedida(b) ? Infinity : desde(b)));
  else if (FILTRO.orden === 'mayor') lista = lista.slice().sort((a, b) => (esMedida(b) ? -1 : desde(b)) - (esMedida(a) ? -1 : desde(a)));
  else if (palabras.length) {
    const enNombre = p => (palabras.every(w => normal(p.nombre).includes(w)) ? 0 : 1);
    lista = lista.slice().sort((a, b) => enNombre(a) - enNombre(b));
  }
  return lista;
}

function hayFiltros() { return !!(FILTRO.q || FILTRO.cat || FILTRO.uso || FILTRO.mueve || FILTRO.nec); }

function pintarTitulo() {
  const tit = document.getElementById('t-tienda');
  if (!tit) return;
  if (FILTRO.cat && !FILTRO.q && !FILTRO.uso && !FILTRO.mueve && !FILTRO.nec) tit.textContent = CATS[FILTRO.cat];
  else if (FILTRO.uso && !FILTRO.cat && !FILTRO.q) tit.innerHTML = `Para <em>${esc(USOS[FILTRO.uso].toLowerCase())}</em>`;
  else tit.innerHTML = 'Motores, repuestos y <em>cortinas a medida</em>';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.q) pills.push(['q', `«${FILTRO.q}»`]);
  if (ES_M2 && FILTRO.cat) pills.push(['cat', CATS[FILTRO.cat]]);
  if (!ES_M2 && (FILTRO.uso || FILTRO.mueve || FILTRO.nec)) pills.push(['compat', 'Compatible con: ' + [USOS[FILTRO.uso], MUEVE[FILTRO.mueve], NEC[FILTRO.nec]].filter(Boolean).join(' · ')]);
  const hay = hayFiltros();
  cont.innerHTML = pills.map(([k, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('') +
    (hay ? '<button type="button" class="pills__limpiar" data-limpiar>Limpiar filtros</button>' : '');
  cont.hidden = !hay;
}

function sincronizarControles() {
  document.querySelectorAll('.chips [data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === FILTRO.cat && !FILTRO.q && !FILTRO.uso && !FILTRO.mueve && !FILTRO.nec)));
  document.querySelectorAll('#filtros-m2 select[data-f]').forEach(s => { s.value = FILTRO[s.dataset.f] || ''; });
  const q = document.getElementById('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
}

function pintarCatalogo(reiniciar = true, yaVistos = 0) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  if (reiniciar) visibles = PASO;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, visibles).map((p, k) => cardHTML(p, k >= yaVistos)).join('');
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const count = document.getElementById('cat-count');
  if (count) count.textContent = lista.length ? plural(lista.length, 'producto', 'productos') : 'Sin resultados';
  const mas = document.getElementById('ver-mas');
  const masN = document.getElementById('mas-n');
  const quedan = lista.length - visibles;
  if (mas) mas.hidden = quedan <= 0;
  if (masN) masN.textContent = quedan > 0 ? `Mostrando ${visibles} de ${lista.length}` : '';
  pintarTitulo();
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irA(id) {
  const t = document.getElementById(id);
  if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() { FILTRO.q = ''; FILTRO.cat = ''; FILTRO.uso = ''; FILTRO.mueve = ''; FILTRO.nec = ''; }

function filtrarPor(cambios, ir = true) {
  resetFiltros();
  Object.assign(FILTRO, cambios);
  pintarCatalogo();
  if (ir) irA('tienda');
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim().slice(0, 60); pintarCatalogo(); }, 180); });
  document.getElementById('busca-form')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value.trim().slice(0, 60) : '';
    pintarCatalogo();
    irA('tienda');
  });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('ver-mas')?.addEventListener('click', () => { const antes = visibles; visibles += PASO; pintarCatalogo(false, antes); });
  const params = new URLSearchParams(location.search);
  let desdeURL = false;
  if (params.get('cat') && CATS[params.get('cat')]) { FILTRO.cat = params.get('cat'); desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(() => irA('tienda'), 60));
}

function initFiltrosM2() {
  const form = document.getElementById('filtros-m2');
  if (!form) return;
  form.querySelectorAll('select[data-f]').forEach(s => s.addEventListener('change', () => { FILTRO[s.dataset.f] = s.value; pintarCatalogo(); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('q');
    FILTRO.q = q ? q.value.trim().slice(0, 60) : '';
    pintarCatalogo();
  });
}

function pintarConteos() {
  document.querySelectorAll('[data-n]').forEach(el => {
    const [tipo, v] = el.dataset.n.split(':');
    el.textContent = String(tipo === 'todo' ? PRODUCTOS.length : PRODUCTOS.filter(p => p.cat === v).length);
  });
}

/* ---------- ¿qué le hace falta a tu cortina? ---------- */
const COMPAT = { uso: 'comercio', mueve: 'mano', nec: 'automatizar' };
const MEDIDAS_TXT = { automatizar: '¿No sabés qué motor le va?', reparar: '¿No sabés qué repuesto le va?', seguridad: '¿Le sumamos puerta de escape?', nueva: '¿Otra medida o varias bocas?' };

function compatLista() {
  return PRODUCTOS.filter(p => compatible(p, COMPAT.uso, COMPAT.mueve, COMPAT.nec))
    .sort((a, b) => (a.prio - b.prio) || (PRODUCTOS.indexOf(a) - PRODUCTOS.indexOf(b)));
}

function compatCardHTML(p) {
  const k = tieneVars(p) ? (p.vUso?.[COMPAT.uso] || varDefault(p)) : '';
  const v = varDe(p, k);
  const detalle = v ? `${p.varTit} ${v.nombre}${v.dato ? ` · ${v.dato}` : ''}` : p.dato;
  let precio;
  let cta;
  if (esMedida(p)) {
    precio = '<p class="compat-card__p">A medida</p>';
    cta = `<button type="button" class="btn btn--solid btn--sm" data-cotizar="${p.id}">Cotizar con mis medidas</button>`;
  } else {
    const libre = stockDe(p, k) - Cart.enCarrito(p.id, k);
    precio = `<p class="compat-card__p">${formatearPrecio(precioFinal(p, k))}${unidadTxt(p) ? `<small>${unidadTxt(p)}</small>` : ''}</p>`;
    cta = `<button type="button" class="btn btn--solid btn--sm" data-add="${p.id}" data-v="${esc(k)}"${libre <= 0 ? ' disabled' : ''}>${v ? `Agregar ${esc(v.nombre)}` : 'Agregar al carrito'}</button>`;
  }
  return `<article class="compat-card" data-animate="subir" style="opacity:0;transform:translateY(44px)">
    <div class="compat-card__media">${fotoHTML(p, 1.6, '', ` data-quick="${p.id}"`)}</div>
    <div class="compat-card__body">
      <span class="badge badge--ok"><i class="led"></i>Compatible</span>
      <h3 class="compat-card__t">${esc(p.nombre)}</h3>
      <p class="compat-card__d">${esc(detalle)}</p>
      ${precio}
      <div class="compat-card__acts">${cta}<button type="button" class="link" data-quick="${p.id}">Ver ficha</button></div>
    </div>
  </article>`;
}

function medidasCardHTML() {
  return `<a class="compat-card compat-card--medidas" href="#medidas" data-ir-medidas="${COMPAT.nec}" data-animate="subir" style="opacity:0;transform:translateY(44px)">
    <p>${esc(MEDIDAS_TXT[COMPAT.nec])}</p>
    <span>Pasanos las medidas ${ICONO_FLECHA}</span>
  </a>`;
}

function pintarCompat() {
  const res = document.getElementById('compat-res');
  if (!res) return;
  const lista = compatLista();
  const cards = lista.slice(0, 3).map(compatCardHTML);
  if (cards.length < 3) cards.push(medidasCardHTML());
  res.innerHTML = cards.join('');
  revelarNuevos(res);
  const t = document.getElementById('compat-ver-t');
  if (t) t.textContent = lista.length === 1 ? 'Ver el compatible en la tienda' : `Ver los ${lista.length} compatibles en la tienda`;
  const nota = document.getElementById('compat-nota');
  if (nota) nota.hidden = COMPAT.nec !== 'reparar';
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCompat() {
  const form = document.getElementById('selector');
  if (!form) return;
  form.querySelectorAll('select[data-sel]').forEach(s => {
    s.value = COMPAT[s.dataset.sel];
    s.addEventListener('change', () => { COMPAT[s.dataset.sel] = s.value; pintarCompat(); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    pintarCompat();
    document.querySelector('#compat-res button, #compat-res a')?.focus();
  });
  pintarCompat();
}

/* ---------- pasanos las medidas ---------- */
const LIM = { ancho: [80, 1000], alto: [100, 800] };
const MED = { modo: 'nueva', ancho: 320, alto: 240, tablilla: 'ciega', mueve: 'motor', extras: new Set(), falla: new Set(), destino: 'sur', localidad: '', nombre: '' };
const CTA_MODO = { nueva: 'Enviar medidas por WhatsApp', reparar: 'Pedir la reparación por WhatsApp', automatizar: 'Pedir la automatización por WhatsApp' };
const PIDE_MODO = { nueva: 'quiero presupuesto para una cortina nueva', reparar: 'quiero presupuesto para reparar mi cortina', automatizar: 'quiero automatizar mi cortina' };

function medCalc() {
  const m2 = (MED.ancho / 100) * (MED.alto / 100);
  return { m2, kg: m2 * (KG_M2[MED.tablilla] || 10.5), motor: motorPara(m2) };
}

function medMensaje(r) {
  const nombre = MED.nombre.trim();
  const pide = PIDE_MODO[MED.modo];
  const lineas = [`Hola ${MARCA}! ${nombre ? `Soy ${nombre} y ${pide}` : pide.charAt(0).toUpperCase() + pide.slice(1)}.`];
  lineas.push(`• Medida del vano: ${fmtM(MED.ancho)} de ancho × ${fmtM(MED.alto)} de alto (${fmtM2(r.m2)})`);
  if (MED.modo === 'nueva') {
    lineas.push(`• Tablilla ${TABLILLAS[MED.tablilla]}`);
    lineas.push(MED.mueve === 'motor' ? `• Con motor${r.motor ? ` (sugerido: ${r.motor} kg)` : ''}` : '• A mano, con resortes');
    if (MED.extras.size) lineas.push(`• Con ${[...MED.extras].map(e => EXTRAS[e]).join(' y ')}`);
  } else if (MED.modo === 'reparar') {
    lineas.push(`• Se mueve ${MED.mueve === 'motor' ? 'con motor' : 'a mano, con resortes'}`);
    if (MED.falla.size) lineas.push(`• Qué le pasa: ${[...MED.falla].map(f => FALLAS[f]).join(', ')}`);
  } else {
    lineas.push(`• Tablilla ${TABLILLAS[MED.tablilla]}`);
    lineas.push(`• Motor sugerido: ${r.motor ? `${r.motor} kg` : 'a definir, más de 40 m²'}`);
  }
  const lugar = MED.localidad.trim();
  if (MED.modo === 'reparar') lineas.push(`• Dónde está: ${lugar || 'zona sur'}`);
  else if (MED.destino === 'interior') lineas.push(`• Envío al interior${lugar ? `: ${lugar}` : ''}`);
  else lineas.push(`• Instalación en zona sur${lugar ? `: ${lugar}` : ''}`);
  return lineas.join('\n');
}

function pintarVano() {
  const stage = document.getElementById('vano-stage');
  const vano = document.getElementById('vano');
  if (!stage || !vano) return;
  const cs = window.getComputedStyle(stage);
  const W = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const H = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  if (W <= 0 || H <= 0) return;
  const s = Math.min(W / Math.max(MED.ancho, 420), H / Math.max(MED.alto, 320));
  vano.style.width = `${Math.max(36, Math.round(MED.ancho * s))}px`;
  vano.style.height = `${Math.max(36, Math.round(MED.alto * s))}px`;
}

function pintarBotonMotor(r = medCalc()) {
  const btn = document.getElementById('m-motor');
  if (!btn) return;
  const mostrar = !!r.motor && (MED.modo === 'automatizar' || (MED.modo === 'nueva' && MED.mueve === 'motor'));
  btn.hidden = !mostrar;
  if (!mostrar) return;
  const p = getProducto('motor-paralelo');
  btn.dataset.v = r.motor;
  btn.textContent = `Agregar el motor de ${r.motor} kg al carrito`;
  btn.disabled = !p || stockDe(p, r.motor) - Cart.enCarrito(p.id, r.motor) <= 0;
}

function pintarMedidas() {
  const app = document.getElementById('medidas-app');
  if (!app) return;
  const r = medCalc();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('m-ancho-v', fmtM(MED.ancho));
  set('m-alto-v', fmtM(MED.alto));
  set('cota-ancho', fmtM(MED.ancho));
  set('cota-alto', fmtM(MED.alto));
  ['ancho', 'alto'].forEach(dim => {
    const el = document.getElementById(`m-${dim}`);
    const [a, b] = LIM[dim];
    if (el) el.style.setProperty('--p', `${(((MED[dim] - a) / (b - a)) * 100).toFixed(1)}%`);
  });
  set('dato-m2', fmtM2(r.m2));
  set('dato-kg', fmtKg(r.kg));
  const dm = document.getElementById('dato-motor');
  if (dm) dm.innerHTML = r.motor ? `${r.motor} kg<small>hasta ${motorM2(r.motor)} m²</small>` : 'A medida<small>más de 40 m²</small>';
  const vis = { tablilla: MED.modo !== 'reparar', mueve: MED.modo !== 'automatizar', extras: MED.modo === 'nueva', falla: MED.modo === 'reparar', destino: MED.modo !== 'reparar' };
  app.querySelectorAll('[data-grupo]').forEach(g => { g.hidden = !vis[g.dataset.grupo]; });
  const loc = document.getElementById('m-localidad');
  if (loc) loc.placeholder = MED.modo !== 'reparar' && MED.destino === 'interior' ? 'Ej.: Villa María, Córdoba' : 'Ej.: Lanús';
  const msg = medMensaje(r);
  set('m-burbuja', msg);
  const a = document.getElementById('m-wsp');
  if (a) a.href = wspLink(msg);
  set('m-wsp-t', CTA_MODO[MED.modo]);
  pintarBotonMotor(r);
  pintarVano();
}

function sincronizarMedidas() {
  const app = document.getElementById('medidas-app');
  if (!app) return;
  const marcar = (name, v) => app.querySelectorAll(`input[name="${name}"]`).forEach(i => { i.checked = i.value === v; });
  marcar('m-modo', MED.modo);
  marcar('m-tablilla', MED.tablilla);
  marcar('m-mueve', MED.mueve);
  marcar('m-destino', MED.destino);
  app.querySelectorAll('input[data-m="extra"]').forEach(i => { i.checked = MED.extras.has(i.value); });
  app.querySelectorAll('input[data-m="falla"]').forEach(i => { i.checked = MED.falla.has(i.value); });
  ['ancho', 'alto'].forEach(dim => {
    const r = document.getElementById(`m-${dim}`);
    const n = document.getElementById(`m-${dim}-n`);
    const err = document.getElementById(`m-${dim}-err`);
    if (r) r.value = String(MED[dim]);
    if (n) { n.value = String(MED[dim]); n.removeAttribute('aria-invalid'); }
    if (err) err.hidden = true;
  });
}

function cotizar(pre = {}) {
  ['modo', 'ancho', 'alto', 'tablilla', 'mueve', 'destino'].forEach(k => { if (pre[k] !== undefined) MED[k] = pre[k]; });
  if (pre.extras) MED.extras = new Set(pre.extras);
  if (pre.modo && pre.modo !== 'reparar') MED.falla = new Set();
  sincronizarMedidas();
  pintarMedidas();
  irA('medidas');
}

function initMedidas() {
  const app = document.getElementById('medidas-app');
  if (!app) return;
  const cinta = dim => {
    const r = document.getElementById(`m-${dim}`);
    const n = document.getElementById(`m-${dim}-n`);
    const err = document.getElementById(`m-${dim}-err`);
    const [min, max] = LIM[dim];
    if (!r || !n) return;
    r.addEventListener('input', () => {
      MED[dim] = Number(r.value);
      n.value = String(MED[dim]);
      n.removeAttribute('aria-invalid');
      if (err) err.hidden = true;
      pintarMedidas();
    });
    n.addEventListener('input', () => {
      const v = Number(n.value);
      const ok = n.value !== '' && Number.isFinite(v) && v >= min && v <= max;
      n.setAttribute('aria-invalid', String(!ok));
      if (err) err.hidden = ok;
      if (!ok) return;
      MED[dim] = Math.round(v);
      r.value = String(MED[dim]);
      pintarMedidas();
    });
    n.addEventListener('change', () => {
      const v = Math.round(Number(n.value));
      MED[dim] = Number.isFinite(v) && v > 0 ? Math.min(max, Math.max(min, v)) : MED[dim];
      n.value = String(MED[dim]);
      r.value = String(MED[dim]);
      n.removeAttribute('aria-invalid');
      if (err) err.hidden = true;
      pintarMedidas();
    });
  };
  cinta('ancho');
  cinta('alto');
  app.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'm-modo') MED.modo = t.value;
    else if (t.name === 'm-tablilla') MED.tablilla = t.value;
    else if (t.name === 'm-mueve') MED.mueve = t.value;
    else if (t.name === 'm-destino') MED.destino = t.value;
    else if (t.dataset.m === 'extra') { if (t.checked) MED.extras.add(t.value); else MED.extras.delete(t.value); }
    else if (t.dataset.m === 'falla') { if (t.checked) MED.falla.add(t.value); else MED.falla.delete(t.value); }
    else return;
    pintarMedidas();
  });
  document.getElementById('m-localidad')?.addEventListener('input', e => { MED.localidad = e.target.value.slice(0, 60); pintarMedidas(); });
  document.getElementById('m-nombre')?.addEventListener('input', e => { MED.nombre = e.target.value.slice(0, 40); pintarMedidas(); });
  document.getElementById('m-motor')?.addEventListener('click', e => {
    const p = getProducto('motor-paralelo');
    const k = e.currentTarget.dataset.v || '';
    if (!p || !varDe(p, k)) return;
    const ok = Cart.add(p, 1, k);
    showToast(ok ? `Agregaste el motor de ${k} kg al carrito.` : 'Ya tenés en el carrito todo el stock de ese motor.');
  });
  let r = 0;
  window.addEventListener('resize', () => { clearTimeout(r); r = setTimeout(pintarVano, 120); }, { passive: true });
  pintarMedidas();
}

/* ---------- una cortina para cada frente (momento) ---------- */
function initFrentes() {
  const cont = document.getElementById('frentes-cont');
  const vis = document.getElementById('frentes-visual');
  const cap = document.getElementById('frentes-cap');
  if (!cont || !vis || !cap) return;
  const N = 12;
  const C = FRENTES.length;
  vis.innerHTML = Array.from({ length: N }, (_, k) => `<span class="lama" style="--k:${k}"><i class="lama__cara lama__cara--a"></i><i class="lama__cara lama__cara--b"></i></span>`).join('');
  const lamas = [...vis.children];
  const escena = cont.querySelector('.frentes__escena');
  const pasos = [...document.querySelectorAll('.frentes__pasos li')];
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let par = -1;
  let activo = -1;

  const cara = (pref, fr) => {
    const f = FOTOS[fr.foto];
    const W = vis.clientWidth;
    const H = vis.clientHeight;
    if (!f || !W || !H) return;
    const s = Math.max(W / f.w, H / f.h);
    const bw = f.w * s;
    const bh = f.h * s;
    vis.style.setProperty(`--${pref}`, `url("${f.src}")`);
    vis.style.setProperty(`--${pref}-s`, `${bw.toFixed(1)}px ${bh.toFixed(1)}px`);
    vis.style.setProperty(`--${pref}-x`, `${((W - bw) * fr.foco[0]).toFixed(1)}px`);
    vis.style.setProperty(`--${pref}-y`, `${((H - bh) * fr.foco[1]).toFixed(1)}px`);
  };
  const medirCaras = () => {
    vis.style.setProperty('--lh', `${(vis.clientHeight / N).toFixed(3)}px`);
    if (par >= 0) { cara('fa', FRENTES[par]); cara('fb', FRENTES[par + 1]); }
  };
  const ponerPar = i => {
    if (i === par) return;
    par = i;
    cara('fa', FRENTES[i]);
    cara('fb', FRENTES[i + 1]);
  };
  const pintarCap = (k, animar) => {
    activo = k;
    const fr = FRENTES[k];
    const n = PRODUCTOS.filter(p => compatible(p, fr.uso, '', '')).length;
    cap.innerHTML = `<p class="frentes__etq">${esc(fr.etq)}</p>
      <p class="frentes__t">${esc(fr.t1)} <em>${esc(fr.t2)}</em></p>
      <p class="frentes__p">${esc(fr.txt)}</p>
      <dl class="frentes__datos">
        <div><dt>Medida de ejemplo</dt><dd id="fr-medida"></dd></div>
        <div><dt>Superficie</dt><dd id="fr-m2"></dd></div>
        <div><dt>Motor sugerido</dt><dd id="fr-motor"></dd></div>
      </dl>
      <div class="frentes__ctas">
        <button type="button" class="btn btn--solid btn--sm" data-cotizar-frente="${k}">Cotizar esta medida</button>
        <button type="button" class="btn btn--claro btn--sm" data-ver-uso="${fr.uso}">Ver lo compatible (${n})</button>
      </div>`;
    pasos.forEach((li, i) => { if (i === k) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current'); });
    if (animar && !reduceMotion) { cap.classList.remove('is-cambio'); void cap.offsetWidth; cap.classList.add('is-cambio'); }
  };
  const datos = (i, t) => {
    const a = FRENTES[i];
    const b = FRENTES[Math.min(i + 1, C - 1)];
    const ancho = Math.round(lerp(a.ancho, b.ancho, t) / 5) * 5;
    const alto = Math.round(lerp(a.alto, b.alto, t) / 5) * 5;
    const m2 = (ancho / 100) * (alto / 100);
    const motor = motorPara(m2);
    const set = (id, v) => { const el = document.getElementById(id); if (el && el.textContent !== v) el.textContent = v; };
    set('fr-medida', `${fmtDec(ancho / 100, 2)} × ${fmtDec(alto / 100, 2)}`);
    set('fr-m2', fmtM2(m2));
    set('fr-motor', motor ? `${motor} kg` : 'A medida');
  };
  const recorrido = () => cont.offsetHeight - (escena ? escena.offsetHeight : window.innerHeight - OFF());
  let frame = 0;
  const medir = () => {
    frame = 0;
    const total = recorrido();
    const p = total > 0 ? clamp01((OFF() - cont.getBoundingClientRect().top) / total) : 0;
    const u = p * (C - 1);
    const i = Math.min(C - 2, Math.floor(u));
    const t = clamp01((u - i - 0.18) / 0.64);
    ponerPar(i);
    lamas.forEach((l, k) => {
      let x = reduceMotion ? (t >= 0.5 ? 1 : 0) : clamp01((t - (k / (N - 1)) * 0.42) / 0.58);
      x = x * x * (3 - 2 * x);
      l.style.setProperty('--r', `${(x * 180).toFixed(1)}deg`);
      l.style.setProperty('--s', (Math.sin(x * Math.PI) * 0.55).toFixed(3));
    });
    const k = t >= 0.5 ? i + 1 : i;
    if (k !== activo) pintarCap(k, true);
    datos(i, t);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  let rz = 0;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { medirCaras(); medir(); }, 120); }, { passive: true });
  pintarCap(0, false);
  medirCaras();
  medir();
  window.addEventListener('load', () => { medirCaras(); medir(); });
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function pedidoTexto() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${cantTxt(p, i.qty)} × ${nombreCon(p, i.v || '')} — ${formatearPrecio(precioFinal(p, i.v || '') * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const v = i.v || '';
  const libre = stockDe(p, v) - Cart.enCarrito(p.id, v);
  const vo = varDe(p, v);
  const meta = [CATS[p.cat], vo ? vo.nombre : '', unidadTxt(p) ? `${formatearPrecio(precioFinal(p, v))} ${unidadTxt(p)}` : ''].filter(Boolean).join(' · ');
  return `<div class="linea">
    ${fotoHTML(p, 1, 'linea__img')}
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">${esc(meta)}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea"><button type="button" data-linea="-1" data-id="${p.id}" data-v="${esc(v)}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${esc(cantTxt(p, i.qty))}</output><button type="button" data-linea="1" data-id="${p.id}" data-v="${esc(v)}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-v="${esc(v)}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p, v) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Mirá los motores y repuestos, o pasanos las medidas de tu cortina.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver la tienda</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (foot) {
    foot.hidden = false;
    const tot = document.getElementById('drawer-total');
    if (tot) tot.textContent = formatearPrecio(Cart.total());
    const n = document.getElementById('drawer-n');
    if (n) n.textContent = plural(items.length, 'producto', 'productos');
    const wsp = document.getElementById('drawer-wsp');
    if (wsp) wsp.href = wspLink(pedidoTexto());
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : document.getElementById('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar, q.dataset.v || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const v = paso.dataset.v || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && (x.v || '') === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); irA('tienda'); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let varModal = '';
let idModal = '';
const AR_MODAL = 1;

function consultaTxt(p, k) { return `Hola ${MARCA}! Quiero consultar por ${nombreCon(p, k)}.`; }

function modalHTML(p) {
  const k = varModal;
  const libre = stockDe(p, k) - Cart.enCarrito(p.id, k);
  const vars = tieneVars(p)
    ? `<fieldset class="m-vars"><legend>${esc(p.varTit)}</legend><div class="chips-op">${p.variantes.map(v => `<label class="chip-op"><input type="radio" name="m-var" value="${esc(v.k)}"${v.k === k ? ' checked' : ''}><span>${esc(v.nombre)}${v.dato ? ` · ${esc(v.dato)}` : ''}</span></label>`).join('')}</div></fieldset>`
    : '';
  let stock = '';
  if (!esMedida(p)) {
    const st = stockDe(p, k);
    if (st <= 0) stock = '<p class="m-stock m-stock--poco">Sin stock por ahora. Consultanos cuándo vuelve.</p>';
    else if (libre <= 0) stock = '<p class="m-stock m-stock--poco">Ya tenés en el carrito todo el stock.</p>';
    else if (st <= 3) stock = `<p class="m-stock m-stock--poco">Quedan ${st}</p>`;
    else stock = '<p class="m-stock">En stock</p>';
  }
  const compra = esMedida(p)
    ? `<button type="button" class="btn btn--solid btn--block" data-cotizar="${p.id}">Cotizar con mis medidas</button>`
    : `<div class="m-compra">${stepperHTML(p.id, ' stepper--modal')}<button type="button" class="btn btn--solid" data-add-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button></div>
       <button type="button" class="btn btn--line btn--block" data-comprar-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>`;
  const vistas = p.foto
    ? '<div class="m-vistas" role="group" aria-label="Fotos del producto"><button type="button" class="m-vista" data-m-vista="0" aria-pressed="true">De cerca</button><button type="button" class="m-vista" data-m-vista="1" aria-pressed="false">La foto entera</button></div>'
    : '';
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const relHTML = rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x, 1)}<span>${esc(x.nombre)}</span><b>${esMedida(x) ? 'A medida' : (tieneVars(x) ? `Desde ${formatearPrecio(desde(x))}` : formatearPrecio(precioFinal(x, '')))}</b></button></li>`).join('');
  const ficha = `<dl class="ficha">${p.ficha.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>`;
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p, AR_MODAL, 'm-foto', ' id="m-foto"')}
      ${vistas}
    </div>
    <div class="m-info">
      <p class="m-cat">${esc(CATS[p.cat])}</p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      <div class="m-precio">${precioHTML(p, k)}</div>
      <p class="m-desc">${esc(p.desc)}</p>
      ${vars}
      ${stock}
      ${compra}
      <a class="link m-wsp" id="m-wsp" href="${wspLink(consultaTxt(p, k))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      ${ficha}
      ${relHTML ? `<div class="m-rels"><p class="m-rels__t">También en ${esc(CATS[p.cat])}</p><ul>${relHTML}</ul></div>` : ''}
    </div>
  </div>`;
}

function inyectarLD(p) {
  document.getElementById('ld-producto')?.remove();
  if (esMedida(p)) return;
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ld-producto';
  const img = p.foto ? new URL(FOTOS[p.foto].src, location.href).href : undefined;
  const offers = tieneVars(p)
    ? { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: String(desde(p)), highPrice: String(Math.max(...p.variantes.map(v => precioFinal(p, v.k)))), offerCount: String(p.variantes.length) }
    : { '@type': 'Offer', priceCurrency: 'ARS', price: String(precioFinal(p, '')), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' };
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: img, description: p.desc, category: CATS[p.cat], brand: { '@type': 'Brand', name: MARCA }, offers });
  document.head.appendChild(ld);
}

function abrirModal(id, k = '') {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modal-content');
  if (!p || !modal || !cont) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  idModal = p.id;
  varModal = tieneVars(p) ? (varDe(p, k) ? k : varDefault(p)) : '';
  cont.innerHTML = modalHTML(p);
  modal.querySelector('.modal-box').scrollTop = 0;
  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
  inyectarLD(p);
  try { window.history.replaceState(null, '', `${location.pathname}?producto=${p.id}`); } catch { return; }
}

function cerrarModal(sinFoco) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  document.getElementById('ld-producto')?.remove();
  if (!sinFoco) ultimoFoco?.focus?.();
  try { window.history.replaceState(null, '', location.pathname); } catch { return; }
}

function cantidadDe(cont) {
  const out = cont?.querySelector('output');
  return out ? Math.max(1, parseInt(out.textContent, 10) || 1) : 1;
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const cont = document.getElementById('modal-content');
  const actual = () => getProducto(idModal);
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('change', e => {
    if (e.target.name !== 'm-var') return;
    const p = actual();
    if (!p) return;
    varModal = e.target.value;
    cont.innerHTML = modalHTML(p);
    [...modal.querySelectorAll('input[name="m-var"]')].find(i => i.value === varModal)?.focus();
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const vista = e.target.closest('[data-m-vista]');
    if (vista) {
      const p = actual();
      const foto = document.getElementById('m-foto');
      if (!p || !foto || !p.foto) return;
      const k = Number(vista.dataset.mVista);
      foto.setAttribute('style', `--ar:${AR_MODAL};${recorte(p.foto, k ? [p.foco[0], p.foco[1], 1] : p.foco, AR_MODAL)}`);
      modal.querySelectorAll('[data-m-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (add) {
      const p = getProducto(add.dataset.addModal || add.dataset.comprarModal);
      if (!p) return;
      const ok = Cart.add(p, cantidadDe(modal.querySelector('.stepper--modal')), varModal);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de este producto.'); return; }
      if (add.dataset.comprarModal) { cerrarModal(true); abrirDrawer(); return; }
      showToast(`Agregaste ${nombreCon(p, varModal)} al carrito.`);
      cont.innerHTML = modalHTML(p);
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirModal(id);
}

/* ---------- acciones ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const cot = e.target.closest('[data-cotizar]');
    if (cot) {
      const p = getProducto(cot.dataset.cotizar);
      if (!p) return;
      cerrarModal(true);
      cotizar(p.cotizar || { modo: 'nueva' });
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('.stepper');
      const out = st?.querySelector('output');
      const p = getProducto(st?.dataset.stepper);
      if (!out || !p) return;
      const v = st.classList.contains('stepper--modal') ? varModal : '';
      const libre = Math.max(1, stockDe(p, v) - Cart.enCarrito(p.id, v));
      out.textContent = String(Math.max(1, Math.min(libre, (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso))));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const v = add.dataset.v || '';
      if (tieneVars(p) && !varDe(p, v)) { abrirModal(p.id); return; }
      const ok = Cart.add(p, v ? 1 : cantidadDe(add.closest('.card')?.querySelector('.stepper')), v);
      showToast(ok ? `Agregaste ${cantTxt(p, ok)} de ${nombreCon(p, v)}.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantidadDe(comprar.closest('.card')?.querySelector('.stepper')), '');
      abrirDrawer();
      return;
    }
    const frente = e.target.closest('[data-cotizar-frente]');
    if (frente) {
      const fr = FRENTES[Number(frente.dataset.cotizarFrente)];
      if (fr) cotizar({ modo: 'nueva', ancho: fr.ancho, alto: fr.alto, tablilla: fr.tablilla, mueve: fr.mueve });
      return;
    }
    const uso = e.target.closest('[data-ver-uso]');
    if (uso) { filtrarPor({ uso: uso.dataset.verUso }); return; }
    const destino = e.target.closest('[data-cotizar-destino]');
    if (destino) { cotizar({ modo: 'nueva', destino: destino.dataset.cotizarDestino }); return; }
    const irMed = e.target.closest('[data-ir-medidas]');
    if (irMed) {
      e.preventDefault();
      const nec = irMed.dataset.irMedidas;
      const modo = nec === 'automatizar' ? 'automatizar' : nec === 'reparar' ? 'reparar' : 'nueva';
      cotizar({ modo, mueve: COMPAT.mueve, extras: nec === 'seguridad' ? ['escape'] : undefined });
      return;
    }
    if (e.target.closest('[data-compat-ver]')) {
      e.preventDefault();
      filtrarPor({ uso: COMPAT.uso, mueve: COMPAT.mueve, nec: COMPAT.nec });
      return;
    }
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const k = quitar.dataset.quitarFiltro;
      if (k === 'q') FILTRO.q = '';
      if (k === 'cat') FILTRO.cat = '';
      if (k === 'compat') { FILTRO.uso = ''; FILTRO.mueve = ''; FILTRO.nec = ''; }
      pintarCatalogo();
      return;
    }
    if (e.target.closest('[data-limpiar]')) { resetFiltros(); pintarCatalogo(); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#modal')) {
      e.preventDefault();
      filtrarPor({ cat: cat.dataset.cat }, !cat.closest('#tienda'));
    }
  });
}

function refrescarVistas() {
  document.querySelectorAll('[data-add]').forEach(b => {
    const p = getProducto(b.dataset.add);
    if (!p) return;
    const v = b.dataset.v || '';
    b.disabled = stockDe(p, v) - Cart.enCarrito(p.id, v) <= 0;
  });
  pintarBotonMotor();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', refrescarVistas);

/* ---------- entradas ---------- */
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

/* ---------- hero ---------- */
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  const d = img ? 0.5 : 0;
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const card = hero.querySelector('.hero-inm__card');
  if (card && window.matchMedia('(min-width: 641px)').matches) tl.from(card, { y: 36, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, d);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, d + 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, d + 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, d + 0.36)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, d + 0.48)
    .from(hero.querySelectorAll('.sello, .chapa__cartel, .hero-urg'), { scale: 0.92, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, d + 0.6);
}

/* ---------- menú ---------- */
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
  const desktopMq = window.matchMedia('(min-width: 1241px)');
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

/* ---------- flotantes ---------- */
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
  sync();
}

/* ---------- barra de modelos ---------- */
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

/* ---------- arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  sanearCarrito();
  pintarConteos();
  initModelBarScroll();
  initCatalogo();
  initFiltrosM2();
  initCompat();
  initMedidas();
  initFrentes();
  initReveals();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  initHeroMotion();
  initNav();
  initDrawer();
  initModal();
  initAcciones();
  initFloats();
  updateCartBadge();
  abrirDesdeURL();
});
