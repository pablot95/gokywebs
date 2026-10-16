const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5492323662984';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;

const ES_M2 = document.body.classList.contains('m2');
const PAGINA = document.body.dataset.pagina || 'home';
const CAT_URL = ES_M2 ? 'catalogo-2.html' : 'catalogo.html';

const CATEGORIAS = [
  { id: 'auto', nombre: 'Autos', titulo: 'Neumáticos para autos' },
  { id: 'camioneta', nombre: 'Camionetas', titulo: 'Neumáticos para camionetas' },
  { id: 'moto', nombre: 'Motos', titulo: 'Cubiertas y cámaras para motos' },
  { id: 'bici', nombre: 'Bicicletas', titulo: 'Cubiertas y cámaras para bicis' }
];
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const USOS = { ciudad: 'Ciudad', touring: 'Touring', deportivo: 'Deportivo', ruta: 'Ruta H/T', mixto: 'Mixto A/T', barro: 'Barro M/T', calle: 'Calle', sport: 'Sport', mtb: 'Montaña', urbana: 'Urbana', infantil: 'Infantil', camara: 'Cámara' };
const TIPOS = { cubierta: 'Cubiertas', camara: 'Cámaras' };
const ORDENES = { relevancia: 'Recomendados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', medida: 'Medida' };

function crearServidor(coleccion, { tope = 100 } = {}) {
  const docs = coleccion.filter(p => p.visible !== false).map(p => Object.freeze({ ...p }));
  const ORDEN_CAT = { auto: 0, camioneta: 1, moto: 2, bici: 3 };
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const compacta = s => String(s ?? '').replace(/[^0-9.]/g, '');
  const num = s => parseFloat(String(s).replace(',', '.')) || 0;
  const textos = new Map(docs.map(p => [p.id, norm([p.nombre, p.medida, p.cat, catNombre(p.cat), USOS[p.uso], TIPOS[p.tipo], p.tipo, p.rodado, p.etiquetas].join(' '))]));
  const base = docs.map((_, i) => i);
  const indices = {
    relevancia: base,
    'precio-asc': [...base].sort((a, b) => precioFinal(docs[a]) - precioFinal(docs[b]) || a - b),
    'precio-desc': [...base].sort((a, b) => precioFinal(docs[b]) - precioFinal(docs[a]) || a - b),
    medida: [...base].sort((a, b) => ORDEN_CAT[docs[a].cat] - ORDEN_CAT[docs[b].cat] || num(docs[a].rodado) - num(docs[b].rodado) || num(docs[a].medida) - num(docs[b].medida) || a - b)
  };
  const posiciones = Object.fromEntries(Object.entries(indices).map(([k, idx]) => [k, new Map(idx.map((i, pos) => [docs[i].id, pos]))]));
  const porId = new Map(docs.map(p => [p.id, p]));
  const lim = n => Math.max(1, Math.min(Math.floor(Number(n)) || 1, tope));

  const pasa = (p, f = {}) => {
    if (f.destacado && !p.destacado) return false;
    if (f.excluir && p.id === f.excluir) return false;
    for (const k of ['cat', 'tipo', 'uso', 'rodado']) {
      const v = f[k];
      if (Array.isArray(v) && v.length && !v.includes(p[k])) return false;
    }
    if (f.medida && compacta(p.medida) !== compacta(f.medida)) return false;
    const q = norm(f.q).trim();
    if (q) {
      const tokens = q.split(/\s+/);
      const enTexto = tokens.every(t => textos.get(p.id).includes(t));
      const qc = compacta(f.q);
      const enMedida = qc.length >= 4 && compacta(p.medida).includes(qc);
      if (!enTexto && !enMedida) return false;
    }
    return true;
  };

  return {
    consultar({ filtros = {}, orden = 'relevancia', cursor = null, limite = 16 } = {}) {
      const tamano = lim(limite);
      const clave = indices[orden] ? orden : 'relevancia';
      const idx = indices[clave];
      let desde = 0;
      if (cursor != null) {
        const pos = posiciones[clave].get(cursor);
        if (pos === undefined) return Promise.resolve({ items: [], cursor: null, hayMas: false });
        desde = pos + 1;
      }
      const items = [];
      let hayMas = false;
      for (let k = desde; k < idx.length; k++) {
        const p = docs[idx[k]];
        if (!pasa(p, filtros)) continue;
        if (items.length === tamano) { hayMas = true; break; }
        items.push({ ...p });
      }
      return Promise.resolve({ items, cursor: hayMas ? items[items.length - 1].id : null, hayMas });
    },
    contar(filtros = {}) {
      let n = 0;
      docs.forEach(p => { if (pasa(p, filtros)) n++; });
      return Promise.resolve(n);
    },
    obtener(ids = []) {
      return Promise.resolve([...new Set(ids)].slice(0, tope).map(id => porId.get(id)).filter(Boolean).map(p => ({ ...p })));
    },
    resumen() {
      return Promise.resolve(Object.keys(ORDEN_CAT).map(cat => {
        const lista = docs.filter(p => p.cat === cat);
        return { cat, total: lista.length, desde: lista.length ? Math.min(...lista.map(precioFinal)) : 0 };
      }));
    },
    facetas(filtros = {}) {
      const out = { cat: {}, tipo: {}, uso: {}, rodado: {} };
      Object.keys(out).forEach(g => {
        const f = { ...filtros, [g]: [] };
        docs.forEach(p => { if (pasa(p, f)) out[g][p[g]] = (out[g][p[g]] || 0) + 1; });
      });
      return Promise.resolve(out);
    },
    medidas(cat) {
      const vistas = new Set();
      indices.medida.forEach(i => { const p = docs[i]; if (p.cat === cat) vistas.add(p.medida); });
      return Promise.resolve([...vistas].slice(0, tope));
    }
  };
}

const servidor = crearServidor([
  { id: 'neumatico-165-70-r13', nombre: 'Neumático ciudad', cat: 'auto', tipo: 'cubierta', medida: '165/70 R13', rodado: '13', uso: 'ciudad', carga: '79T', precio: 86900, descuento: 0, stock: 8, img: 'images/p-ciudad.webp', detalle: 'Para el uso diario en la ciudad: buen agarre en mojado, andar silencioso y desgaste parejo.' },
  { id: 'neumatico-175-65-r14', nombre: 'Neumático ciudad', cat: 'auto', tipo: 'cubierta', medida: '175/65 R14', rodado: '14', uso: 'ciudad', carga: '82T', precio: 98500, descuento: 0, stock: 12, img: 'images/p-ciudad.webp', destacado: true, detalle: 'Para el uso diario en la ciudad: buen agarre en mojado, andar silencioso y desgaste parejo.' },
  { id: 'neumatico-185-60-r15', nombre: 'Neumático ciudad', cat: 'auto', tipo: 'cubierta', medida: '185/60 R15', rodado: '15', uso: 'ciudad', carga: '84H', precio: 112900, descuento: 0, stock: 6, img: 'images/p-ciudad.webp', detalle: 'Para el uso diario en la ciudad: buen agarre en mojado, andar silencioso y desgaste parejo.' },
  { id: 'neumatico-185-65-r15', nombre: 'Neumático touring', cat: 'auto', tipo: 'cubierta', medida: '185/65 R15', rodado: '15', uso: 'touring', carga: '88H', precio: 118400, descuento: 0, stock: 8, img: 'images/p-touring.webp', detalle: 'Para el auto que alterna ciudad y ruta: estable a velocidad de ruta y cómodo en el asfalto roto.' },
  { id: 'neumatico-195-55-r16', nombre: 'Neumático touring', cat: 'auto', tipo: 'cubierta', medida: '195/55 R16', rodado: '16', uso: 'touring', carga: '87V', precio: 139900, descuento: 0, stock: 4, img: 'images/p-touring.webp', detalle: 'Para el auto que alterna ciudad y ruta: estable a velocidad de ruta y cómodo en el asfalto roto.' },
  { id: 'neumatico-205-55-r16', nombre: 'Neumático touring', cat: 'auto', tipo: 'cubierta', medida: '205/55 R16', rodado: '16', uso: 'touring', carga: '91V', precio: 164900, descuento: 0, stock: 10, img: 'images/p-touring.webp', destacado: true, detalle: 'Para el auto que alterna ciudad y ruta: estable a velocidad de ruta y cómodo en el asfalto roto.' },
  { id: 'neumatico-215-50-r17', nombre: 'Neumático deportivo', cat: 'auto', tipo: 'cubierta', medida: '215/50 R17', rodado: '17', uso: 'deportivo', carga: '95W', precio: 198000, descuento: 0, stock: 4, img: 'images/p-deportivo.webp', detalle: 'Banda ancha y hombro firme para autos con llanta 17: más precisión en curva y en el frenado.' },
  { id: 'neumatico-225-45-r17', nombre: 'Neumático deportivo', cat: 'auto', tipo: 'cubierta', medida: '225/45 R17', rodado: '17', uso: 'deportivo', carga: '94W', precio: 214500, descuento: 0, stock: 2, img: 'images/p-deportivo.webp', detalle: 'Banda ancha y hombro firme para autos con llanta 17: más precisión en curva y en el frenado.' },
  { id: 'neumatico-155-80-r13', nombre: 'Neumático ciudad', cat: 'auto', tipo: 'cubierta', medida: '155/80 R13', rodado: '13', uso: 'ciudad', carga: '79T', precio: 79900, descuento: 0, stock: 0, img: 'images/p-ciudad.webp', visible: false, detalle: 'Medida discontinuada.' },
  { id: 'neumatico-205-65-r16', nombre: 'Neumático de ruta', cat: 'camioneta', tipo: 'cubierta', medida: '205/65 R16', rodado: '16', uso: 'ruta', carga: '107T', precio: 176900, descuento: 0, stock: 6, img: 'images/p-ruta.webp', detalle: 'Para utilitarios y camionetas que andan casi todo el tiempo en asfalto: carga alta y desgaste lento.' },
  { id: 'neumatico-235-60-r16', nombre: 'Neumático de ruta', cat: 'camioneta', tipo: 'cubierta', medida: '235/60 R16', rodado: '16', uso: 'ruta', carga: '100H', precio: 219900, descuento: 0, stock: 4, img: 'images/p-ruta.webp', detalle: 'Para utilitarios y camionetas que andan casi todo el tiempo en asfalto: carga alta y desgaste lento.' },
  { id: 'neumatico-225-65-r17', nombre: 'Neumático de ruta', cat: 'camioneta', tipo: 'cubierta', medida: '225/65 R17', rodado: '17', uso: 'ruta', carga: '102H', precio: 232000, descuento: 0, stock: 4, img: 'images/p-ruta.webp', detalle: 'Para SUV y camionetas que andan casi todo el tiempo en asfalto: andar silencioso en la ruta.' },
  { id: 'neumatico-245-70-r16', nombre: 'Neumático mixto A/T', cat: 'camioneta', tipo: 'cubierta', medida: '245/70 R16', rodado: '16', uso: 'mixto', carga: '111T', precio: 289000, descuento: 0, stock: 8, img: 'images/p-mixto.webp', destacado: true, detalle: 'Uso mixto: taco abierto para ripio y tierra sin perder comodidad en el asfalto.' },
  { id: 'neumatico-265-65-r17', nombre: 'Neumático mixto A/T', cat: 'camioneta', tipo: 'cubierta', medida: '265/65 R17', rodado: '17', uso: 'mixto', carga: '112T', precio: 335000, descuento: 0, stock: 4, img: 'images/p-mixto.webp', detalle: 'Uso mixto: taco abierto para ripio y tierra sin perder comodidad en el asfalto.' },
  { id: 'neumatico-265-70-r16', nombre: 'Neumático para barro M/T', cat: 'camioneta', tipo: 'cubierta', medida: '265/70 R16', rodado: '16', uso: 'barro', carga: '117Q', precio: 352000, descuento: 0, stock: 4, img: 'images/p-barro.webp', destacado: true, detalle: 'Taco grande para barro y campo: más tracción fuera del asfalto, a cambio de algo más de ruido en la ruta.' },
  { id: 'cubierta-moto-275-18', nombre: 'Cubierta moto delantera', cat: 'moto', tipo: 'cubierta', medida: '2.75-18', rodado: '18', uso: 'calle', precio: 38500, descuento: 0, stock: 10, img: 'images/p-moto-calle.webp', detalle: 'Cubierta de calle para motos de baja cilindrada, de uso diario.' },
  { id: 'cubierta-moto-80-100-18', nombre: 'Cubierta moto delantera', cat: 'moto', tipo: 'cubierta', medida: '80/100-18', rodado: '18', uso: 'calle', precio: 42900, descuento: 0, stock: 6, img: 'images/p-moto-calle.webp', detalle: 'Cubierta de calle para motos de baja y media cilindrada, de uso diario.' },
  { id: 'cubierta-moto-90-90-18', nombre: 'Cubierta moto trasera', cat: 'moto', tipo: 'cubierta', medida: '90/90-18', rodado: '18', uso: 'calle', precio: 49900, descuento: 0, stock: 8, img: 'images/p-moto-calle.webp', destacado: true, detalle: 'Cubierta trasera de calle para motos de baja y media cilindrada, de uso diario.' },
  { id: 'cubierta-moto-110-70-17', nombre: 'Cubierta moto delantera', cat: 'moto', tipo: 'cubierta', medida: '110/70-17', rodado: '17', uso: 'sport', precio: 78900, descuento: 0, stock: 4, img: 'images/p-moto-sport.webp', detalle: 'Radial para motos de calle de mayor cilindrada: agarre en curva y en mojado.' },
  { id: 'cubierta-moto-140-70-17', nombre: 'Cubierta moto trasera', cat: 'moto', tipo: 'cubierta', medida: '140/70-17', rodado: '17', uso: 'sport', precio: 109900, descuento: 0, stock: 4, img: 'images/p-moto-sport.webp', detalle: 'Radial trasera para motos de calle de mayor cilindrada: agarre en curva y en mojado.' },
  { id: 'camara-moto-275-17', nombre: 'Cámara para moto', cat: 'moto', tipo: 'camara', medida: '2.75-17', rodado: '17', uso: 'camara', precio: 14500, descuento: 0, stock: 15, img: 'images/p-camara-moto.webp', detalle: 'Cámara de goma con válvula recta para cubiertas de moto con cámara.' },
  { id: 'camara-moto-300-18', nombre: 'Cámara para moto', cat: 'moto', tipo: 'camara', medida: '3.00-18', rodado: '18', uso: 'camara', precio: 16900, descuento: 0, stock: 15, img: 'images/p-camara-moto.webp', destacado: true, detalle: 'Cámara de goma con válvula recta para cubiertas de moto con cámara.' },
  { id: 'camara-moto-410-18', nombre: 'Cámara para moto', cat: 'moto', tipo: 'camara', medida: '4.10-18', rodado: '18', uso: 'camara', precio: 18900, descuento: 0, stock: 10, img: 'images/p-camara-moto.webp', detalle: 'Cámara de goma con válvula recta para cubiertas traseras de moto con cámara.' },
  { id: 'cubierta-bici-29-225', nombre: 'Cubierta de montaña', cat: 'bici', tipo: 'cubierta', medida: '29 x 2.25', rodado: '29', uso: 'mtb', precio: 36900, descuento: 0, stock: 8, img: 'images/p-bici-mtb.webp', destacado: true, detalle: 'Taco alto para tierra y ripio, para bicis de montaña rodado 29.' },
  { id: 'cubierta-bici-275-210', nombre: 'Cubierta de montaña', cat: 'bici', tipo: 'cubierta', medida: '27.5 x 2.10', rodado: '27.5', uso: 'mtb', precio: 33500, descuento: 0, stock: 6, img: 'images/p-bici-mtb.webp', detalle: 'Taco alto para tierra y ripio, para bicis de montaña rodado 27,5.' },
  { id: 'cubierta-bici-26-210', nombre: 'Cubierta de montaña', cat: 'bici', tipo: 'cubierta', medida: '26 x 2.10', rodado: '26', uso: 'mtb', precio: 29900, descuento: 0, stock: 10, img: 'images/p-bici-urbana.webp', detalle: 'Taco para tierra y calle, para las bicis rodado 26 de todos los días.' },
  { id: 'cubierta-bici-28-175', nombre: 'Cubierta urbana', cat: 'bici', tipo: 'cubierta', medida: '28 x 1.75', rodado: '28', uso: 'urbana', precio: 27500, descuento: 0, stock: 6, img: 'images/p-bici-urbana.webp', detalle: 'Taco bajo y parejo para andar en la ciudad y en calles de tierra.' },
  { id: 'cubierta-bici-20-195', nombre: 'Cubierta infantil', cat: 'bici', tipo: 'cubierta', medida: '20 x 1.95', rodado: '20', uso: 'infantil', precio: 18900, descuento: 0, stock: 8, img: 'images/p-bici-chica.webp', detalle: 'Para bicis de chicos y BMX rodado 20.' },
  { id: 'cubierta-bici-16-2125', nombre: 'Cubierta infantil', cat: 'bici', tipo: 'cubierta', medida: '16 x 2.125', rodado: '16', uso: 'infantil', precio: 15900, descuento: 0, stock: 6, img: 'images/p-bici-chica.webp', detalle: 'Para las primeras bicis, rodado 16.' },
  { id: 'camara-bici-29-210', nombre: 'Cámara para bici', cat: 'bici', tipo: 'camara', medida: '29 x 2.10', rodado: '29', uso: 'camara', precio: 9800, descuento: 0, stock: 20, img: 'images/p-camara-bici.webp', destacado: true, detalle: 'Cámara con válvula de auto (Schrader): se infla en cualquier estación de servicio.' },
  { id: 'camara-bici-26-195', nombre: 'Cámara para bici', cat: 'bici', tipo: 'camara', medida: '26 x 1.95', rodado: '26', uso: 'camara', precio: 8900, descuento: 0, stock: 20, img: 'images/p-camara-bici.webp', detalle: 'Cámara con válvula de auto (Schrader): se infla en cualquier estación de servicio.' },
  { id: 'camara-bici-20-195', nombre: 'Cámara para bici', cat: 'bici', tipo: 'camara', medida: '20 x 1.95', rodado: '20', uso: 'camara', precio: 7900, descuento: 0, stock: 12, img: 'images/p-camara-bici.webp', detalle: 'Cámara con válvula de auto (Schrader) para bicis rodado 20.' }
], { tope: 100 });

const cache = new Map();
const recordar = lista => { (lista || []).forEach(p => cache.set(p.id, p)); return lista; };
const getProducto = id => cache.get(id);

const Cart = {
  KEY: 'gomerialorenzo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  pin: '<svg viewBox="0 0 34 44" aria-hidden="true"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 43 17 43s16-14.4 16-26.2C33 8 25.8 1 17 1z" fill="#B8302A"/><circle cx="17" cy="16.5" r="6.5" fill="#FAFAF8"/><circle cx="17" cy="16.5" r="3" fill="#1B1B19"/></svg>'
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', () => { if (document.getElementById('cartDrawer')?.classList.contains('open')) renderCarrito(); });

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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.buscador', { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.55);
  desde('.hero-ctas .btn, .hero-hint', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.placa', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
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

function initMenuCategorias(resumen) {
  const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  document.querySelectorAll('[data-cats-menu]').forEach(w => {
    const btn = w.querySelector('.nav-cats-btn');
    const panel = w.querySelector('.nav-cats-panel');
    const list = w.querySelector('[data-cats-list]');
    if (!btn || !panel || !list) return;
    list.innerHTML = CATEGORIAS.map(c => {
      const r = resumen.find(x => x.cat === c.id);
      return `<li><a href="${CAT_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><span>${c.nombre}</span><small>${r ? r.total + ' productos' : ''}</small></a></li>`;
    }).join('');
    const desktop = window.matchMedia('(min-width: 961px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    w.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
    w.addEventListener('mouseleave', () => { if (desktop.matches) t = setTimeout(cerrar, 120); });
    w.addEventListener('focusout', e => { if (desktop.matches && !w.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (desktop.matches && !w.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && desktop.matches) { cerrar(); btn.focus(); } });
  });
}

function atrapar(cont) {
  const sel = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';
  const h = e => {
    if (e.key !== 'Tab') return;
    const f = [...cont.querySelectorAll(sel)].filter(el => el.getClientRects().length);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  };
  document.addEventListener('keydown', h);
  return () => document.removeEventListener('keydown', h);
}

const usoChip = p => `<span class="prod-uso">${esc(USOS[p.uso] || '')}</span>`;
const precioHTML = p => `${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}${formatearPrecio(precioFinal(p))}<small>c/u</small>`;
const maxQty = p => Math.max(1, Math.min(p.stock ?? 99, 99));
const stepperHTML = p => `<div class="stepper" data-stepper data-max="${maxQty(p)}"><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><span class="stepper-n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno"${maxQty(p) <= 1 ? ' disabled' : ''}>+</button></div>`;
const etiqueta = p => (p.stock > 0 && p.stock <= 4 ? `Últimas ${p.stock}` : '');
const altDe = p => `${p.nombre} ${p.medida}`;

function cardM1(p, { animar = true, rail = false, nivel = 3 } = {}) {
  const anim = !animar ? '' : rail ? ' data-animate="der" style="opacity:0;transform:translateX(64px)"' : ' data-animate="subir" style="opacity:0;transform:translateY(48px)"';
  const tag = etiqueta(p);
  const acciones = rail
    ? `<div class="prod-actions"><button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}">Agregar al carrito</button></div>`
    : `<div class="prod-actions">${stepperHTML(p)}<button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(altDe(p))} al carrito">${ICON.carrito}<span class="prod-add-txt">Agregar</span></button></div><button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`;
  return `<li class="${rail ? 'rail-item' : 'grid-item'}"${anim}><article class="prod" data-id="${esc(p.id)}">
<button class="prod-media" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle de ${esc(altDe(p))}"><img src="${esc(p.img)}" alt="${esc(altDe(p))}" width="800" height="800">${usoChip(p)}${tag ? `<span class="prod-badge">${tag}</span>` : ''}</button>
<div class="prod-body"><p class="prod-medida">${esc(p.medida)}</p><h${nivel} class="prod-nombre">${esc(p.nombre)}</h${nivel}><p class="prod-precio">${precioHTML(p)}</p>${acciones}</div></article></li>`;
}

function cardM2(p, { animar = true, nivel = 3 } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const tag = etiqueta(p);
  return `<li class="grid-item"${anim}><article class="prod prod--foto" data-id="${esc(p.id)}">
<button class="prod-media" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle de ${esc(altDe(p))}"><img src="${esc(p.img)}" alt="${esc(altDe(p))}" width="800" height="800"></button>${usoChip(p)}
<div class="prod-info">${tag ? `<p class="prod-tag">${tag}</p>` : ''}<p class="prod-medida">${esc(p.medida)}</p><h${nivel} class="prod-nombre">${esc(p.nombre)}</h${nivel}><p class="prod-precio">${precioHTML(p)}</p></div>
<button class="prod-add-ico" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(altDe(p))} al carrito">${ICON.carrito}<span>Agregar</span></button></article></li>`;
}

const cardHTML = (p, opts) => (ES_M2 ? cardM2(p, opts) : cardM1(p, opts));

function qtyDe(boton) {
  const cont = boton.closest('.prod, .qv-info');
  const n = parseInt(cont?.querySelector('[data-qty]')?.textContent || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function agregar(id, qty) {
  const p = getProducto(id);
  if (!p) return false;
  const enCarrito = Cart.get().find(i => i.id === id)?.qty || 0;
  if (enCarrito >= p.stock) { showToast(`No quedan más ${p.medida} en stock`); return false; }
  const suma = Math.min(qty, p.stock - enCarrito);
  Cart.add(p, suma);
  showToast(`Sumaste ${suma} × ${p.medida} al carrito`);
  return true;
}

document.addEventListener('click', e => {
  const step = e.target.closest('[data-step]');
  if (step) {
    const st = step.closest('[data-stepper]');
    const out = st.querySelector('[data-qty]');
    const max = parseInt(st.dataset.max, 10) || 99;
    const n = Math.max(1, Math.min(max, (parseInt(out.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
    out.textContent = n;
    st.querySelector('[data-step="-1"]').disabled = n <= 1;
    st.querySelector('[data-step="1"]').disabled = n >= max;
    return;
  }
  const quick = e.target.closest('[data-quick]');
  if (quick) { abrirVista(quick.dataset.quick, quick); return; }
  const add = e.target.closest('[data-add]');
  if (add) { agregar(add.dataset.add, qtyDe(add)); return; }
  const buy = e.target.closest('[data-buy]');
  if (buy) { const id = buy.dataset.buy; const enCarrito = Cart.get().some(i => i.id === id); if (agregar(id, qtyDe(buy)) || enCarrito) { cerrarVista(false); abrirCarrito(buy); } return; }
  const abrir = e.target.closest('[data-cart-open]');
  if (abrir) { abrirCarrito(abrir); return; }
  const linea = e.target.closest('[data-line]');
  if (linea) { const it = Cart.get().find(i => i.id === linea.dataset.line); if (it) Cart.setQty(it.id, it.qty + parseInt(linea.dataset.delta, 10)); return; }
  const quitar = e.target.closest('[data-quitar]');
  if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
  if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); }
});

let focoCarrito = null;
let soltarCarrito = null;
function renderCarrito() {
  const cont = document.querySelector('[data-cart-items]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!cont) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cont.innerHTML = `<div class="cart-vacio"><span class="code-mini">— / — R —</span><p>Todavía no sumaste ninguna cubierta. Elegí tu medida y aparece acá.</p><a class="btn btn--cta" href="${CAT_URL}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="cart-line"><img src="${esc(p.img)}" alt="${esc(altDe(p))}" width="72" height="72">
<div><p class="cart-line-medida">${esc(p.medida)}</p><p class="cart-line-nombre">${esc(p.nombre)}</p>
<div class="stepper"><button type="button" data-line="${esc(p.id)}" data-delta="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><span class="stepper-n">${i.qty}</span><button type="button" data-line="${esc(p.id)}" data-delta="1" aria-label="Sumar uno"${i.qty >= p.stock ? ' disabled' : ''}>+</button></div></div>
<div class="cart-line-der"><span class="cart-line-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span><button class="cart-quitar" type="button" data-quitar="${esc(p.id)}">Quitar</button></div></div>`;
  }).join('');
  const total = document.querySelector('[data-cart-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirCarrito(origen) {
  const d = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!d || !bd) return;
  focoCarrito = origen || document.activeElement;
  renderCarrito();
  d.hidden = false; bd.hidden = false;
  void d.offsetWidth;
  d.classList.add('open'); bd.classList.add('open');
  document.body.classList.add('no-scroll');
  soltarCarrito?.();
  soltarCarrito = atrapar(d);
  d.querySelector('[data-drawer-close]')?.focus();
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!d || !d.classList.contains('open')) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  soltarCarrito?.(); soltarCarrito = null;
  setTimeout(() => { if (!d.classList.contains('open')) { d.hidden = true; bd.hidden = true; } }, 400);
  focoCarrito?.focus?.();
}

let focoVista = null;
let soltarVista = null;
async function abrirVista(id, origen) {
  let p = getProducto(id);
  if (!p) { recordar(await servidor.obtener([id])); p = getProducto(id); }
  const modal = document.getElementById('quickView');
  if (!p || !modal) return;
  focoVista = origen || document.activeElement;
  const body = modal.querySelector('[data-modal-body]');
  const specs = [['Vehículo', catNombre(p.cat)], ['Medida', p.medida], ['Uso', USOS[p.uso]], p.carga ? ['Carga y velocidad', p.carga] : null, ['Stock', `${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}`]].filter(Boolean);
  body.innerHTML = `<div class="qv"><div class="qv-media"><img src="${esc(p.img)}" alt="${esc(altDe(p))}" width="800" height="800"></div>
<div class="qv-info"><span class="code-mini">${esc(USOS[p.uso])}</span><p class="qv-medida">${esc(p.medida)}</p><h2 class="qv-nombre">${esc(p.nombre)}</h2><p class="qv-desc">${esc(p.detalle)}</p>
<dl class="qv-specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
<p class="qv-precio">${precioHTML(p).replace('<small>c/u</small>', '<small>por unidad</small>')}</p>
<div class="qv-acciones">${stepperHTML(p)}<button class="btn btn--cta" type="button" data-add="${esc(p.id)}">Agregar al carrito</button><button class="btn btn--line" type="button" data-buy="${esc(p.id)}">Comprar ahora</button></div>
<a class="link-arrow qv-wsp" href="${waLink(`Hola Gomería Lorenzo, quería consultar por ${p.nombre.toLowerCase()} ${p.medida}.`)}" target="_blank" rel="noopener">Consultar esta medida por WhatsApp ${ICON.flecha}</a></div>
<div class="qv-rel" data-rel hidden><h3>También para ${esc(catNombre(p.cat).toLowerCase())}</h3><ul></ul></div></div>`;
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
  soltarVista?.();
  soltarVista = atrapar(modal);
  modal.querySelector('[data-modal-close]:not(.modal-backdrop)')?.focus();
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: altDe(p), sku: p.id, image: new URL(p.img, location.href).href, description: p.detalle, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  const rel = await servidor.consultar({ filtros: { cat: [p.cat], excluir: p.id, tipo: [p.tipo] }, limite: 3 });
  recordar(rel.items);
  const relBox = body.querySelector('[data-rel]');
  if (relBox && rel.items.length) {
    relBox.querySelector('ul').innerHTML = rel.items.map(r => `<li><button type="button" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="56" height="56"><span><strong>${esc(r.medida)}</strong><span>${esc(r.nombre)} · ${formatearPrecio(precioFinal(r))}</span></span></button></li>`).join('');
    relBox.hidden = false;
  }
}
function cerrarVista(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  soltarVista?.(); soltarVista = null;
  modal.hidden = true;
  if (devolverFoco) focoVista?.focus?.();
}

function initOverlays() {
  document.querySelectorAll('[data-drawer-close]').forEach(b => b.addEventListener('click', cerrarCarrito));
  document.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => cerrarVista()));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('quickView')?.classList.contains('open')) cerrarVista();
    else if (document.getElementById('cartDrawer')?.classList.contains('open')) cerrarCarrito();
  });
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(w => {
    const tabs = [...w.querySelectorAll('[role="tab"]')];
    const elegir = (t, foco) => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(x.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = !on;
        if (on && !reduceMotion) { panel.classList.remove('entra'); void panel.offsetWidth; panel.classList.add('entra'); }
      });
      if (foco) t.focus();
      refrescar();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => elegir(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); elegir(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });
}

const ANCHOS = [145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
const PERFILES = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const RODADOS = [13, 14, 15, 16, 17, 18, 19, 20];
const MEDIDA_INICIAL = { auto: { ancho: 205, perfil: 55, rodado: 16 }, camioneta: { ancho: 245, perfil: 70, rodado: 16 } };
const AYUDAS = {
  auto: 'Tocá cada número para cambiarlo. Es lo que dice el costado de la cubierta: ancho / perfil R rodado.',
  camioneta: 'Tocá cada número para cambiarlo. Mismo formato que en auto: 245/70 R16 en muchas camionetas medianas.',
  moto: 'En moto se lee 110/70-17 (ancho / perfil - rodado) o 2.75-18 en las más chicas.',
  bici: 'En bici va primero el rodado: 29 x 2.25 es rodado 29 con 2,25 pulgadas de ancho.'
};

async function initBuscadores() {
  const forms = document.querySelectorAll('[data-buscador]');
  if (!forms.length) return;
  const medidasCat = { moto: await servidor.medidas('moto'), bici: await servidor.medidas('bici') };
  forms.forEach(form => {
    const tabs = [...form.querySelectorAll('[data-veh]')];
    const tres = form.querySelector('[data-flanco="tres"]');
    const uno = form.querySelector('[data-flanco="uno"]');
    const sel = n => form.querySelector(`[data-sel="${n}"]`);
    const numEl = n => form.querySelector(`[data-num="${n}"]`);
    const ayuda = form.querySelector('[data-ayuda]');
    const res = form.querySelector('[data-res]');
    const opciones = (lista, fmt = v => v) => lista.map(v => `<option value="${esc(v)}">${esc(fmt(v))}</option>`).join('');
    sel('ancho').innerHTML = opciones(ANCHOS, v => `${v} mm`);
    sel('perfil').innerHTML = opciones(PERFILES, v => `${v} %`);
    sel('rodado').innerHTML = opciones(RODADOS, v => `R${v}`);
    let veh = 'auto';
    const medidaActual = () => (veh === 'auto' || veh === 'camioneta') ? `${sel('ancho').value}/${sel('perfil').value} R${sel('rodado').value}` : sel('medida').value;
    const pintar = () => {
      ['ancho', 'perfil', 'rodado', 'medida'].forEach(n => { const el = numEl(n); if (el && sel(n)) el.textContent = sel(n).value; });
    };
    const elegir = (v, foco) => {
      veh = v;
      tabs.forEach(t => { const on = t.dataset.veh === v; t.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on && foco) t.focus(); });
      const llantas = v === 'auto' || v === 'camioneta';
      tres.hidden = !llantas;
      uno.hidden = llantas;
      if (llantas) { const m = MEDIDA_INICIAL[v]; sel('ancho').value = m.ancho; sel('perfil').value = m.perfil; sel('rodado').value = m.rodado; }
      else sel('medida').innerHTML = opciones(medidasCat[v]);
      ayuda.textContent = AYUDAS[v];
      res.hidden = true;
      pintar();
      refrescar();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => elegir(t.dataset.veh));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); elegir(tabs[(i + d + tabs.length) % tabs.length].dataset.veh, true); }
      });
    });
    form.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { pintar(); res.hidden = true; refrescar(); }));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const medida = medidaActual();
      const filtros = { cat: [veh], medida };
      const [r, total] = await Promise.all([servidor.consultar({ filtros, limite: 3 }), servidor.contar(filtros)]);
      recordar(r.items);
      const nombreCat = catNombre(veh).toLowerCase();
      if (total) {
        res.innerHTML = `<p class="res-t">${total === 1 ? 'Tenemos 1 opción' : `Tenemos ${total} opciones`} en <em>${esc(medida)}</em></p>
<ul class="res-lista">${r.items.map(p => `<li class="res-item"><img src="${esc(p.img)}" alt="" width="56" height="56"><div><button class="res-nombre" type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button><small>${esc(USOS[p.uso])} · ${p.stock} en stock</small></div><div class="res-der"><span class="res-precio">${formatearPrecio(precioFinal(p))}</span> <button class="btn btn--cta" type="button" data-add="${esc(p.id)}">Agregar</button></div></li>`).join('')}</ul>
<div class="res-acciones"><a class="btn btn--line" href="${CAT_URL}?cat=${veh}&amp;medida=${encodeURIComponent(medida)}">Ver en el catálogo</a></div>`;
      } else {
        res.innerHTML = `<div class="res-vacio"><p class="res-t">No tenemos <em>${esc(medida)}</em> en la tienda online</p><p>Escribinos y te decimos si la podemos conseguir o qué medida equivalente le va a tu ${esc(veh === 'bici' ? 'bici' : veh)}.</p>
<div class="res-acciones"><a class="btn btn--cta" href="${waLink(`Hola Gomería Lorenzo, ¿consiguen la medida ${medida} para ${veh === 'auto' ? 'auto' : veh === 'bici' ? 'bici' : veh}?`)}" target="_blank" rel="noopener">${ICON.wsp} Pedirla por WhatsApp</a><a class="btn btn--line" href="${CAT_URL}?cat=${veh}">Ver todo para ${esc(nombreCat)}</a></div></div>`;
      }
      res.hidden = false;
      refrescar();
    });
    elegir('auto');
  });
}

function initCatMeta(resumen) {
  document.querySelectorAll('[data-cat-meta]').forEach(el => {
    const r = resumen.find(x => x.cat === el.dataset.catMeta);
    if (r && r.total) el.textContent = `${r.total} productos · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-veh-n]').forEach(el => {
    const r = resumen.find(x => x.cat === el.dataset.vehN);
    if (r) el.textContent = r.total;
  });
}

async function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  const r = await servidor.consultar({ filtros: { destacado: true }, limite: 8 });
  recordar(r.items);
  track.innerHTML = r.items.map(p => cardM1(p, { rail: true })).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const inicio = () => parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
  const paso = () => { const it = track.querySelector('.rail-item'); return it ? it.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16) : 300; };
  const flechas = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  let down = false, moved = false, x0 = 0, s0 = 0, pid = null, matarClick = false, soltarT = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pid = e.pointerId;
    clearTimeout(soltarT);
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pid); } catch { pid = null; }
    }
    if (moved) { vp.scrollLeft = s0 - dx; e.preventDefault(); }
  });
  const fin = e => {
    if (!down) return;
    down = false;
    try { if (pid !== null) vp.releasePointerCapture?.(pid); } catch { pid = null; }
    if (!moved) return;
    matarClick = true;
    setTimeout(() => { matarClick = false; }, 0);
    const dx = (e && typeof e.clientX === 'number' ? e.clientX : x0) - x0;
    const base = vp.getBoundingClientRect().left + inicio();
    const items = [...track.children];
    const puntos = items.map(it => vp.scrollLeft + it.getBoundingClientRect().left - base);
    let k = puntos.reduce((m, v, i) => Math.abs(v - vp.scrollLeft) < Math.abs(puntos[m] - vp.scrollLeft) ? i : m, 0);
    if (Math.abs(dx) > 60) {
      const actual = vp.scrollLeft;
      if (dx < 0) { const i = puntos.findIndex(v => v > actual + 4); if (i >= 0) k = i; }
      else { for (let i = puntos.length - 1; i >= 0; i--) if (puntos[i] < actual - 4) { k = i; break; } }
    }
    const destino = Math.max(0, Math.min(puntos[k] ?? vp.scrollLeft, vp.scrollWidth - vp.clientWidth));
    vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    soltarT = setTimeout(() => vp.classList.remove('dragging'), 520);
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('click', e => { if (matarClick) { e.preventDefault(); e.stopPropagation(); matarClick = false; } }, true);
}

async function initPopulares() {
  const grid = document.querySelector('[data-populares]');
  if (!grid) return;
  const chips = [...document.querySelectorAll('[data-veh-chip]')];
  const ver = document.querySelector('[data-populares-ver]');
  let pedido = 0;
  const cargar = async (cat, primera) => {
    const n = ++pedido;
    const filtros = cat ? { cat: [cat] } : { destacado: true };
    const r = await servidor.consultar({ filtros, limite: 8 });
    if (n !== pedido) return;
    recordar(r.items);
    grid.innerHTML = r.items.map(p => cardM2(p)).join('');
    if (ver) {
      ver.href = cat ? `${CAT_URL}?cat=${cat}` : CAT_URL;
      ver.textContent = cat ? `Ver todo para ${catNombre(cat).toLowerCase()}` : 'Ver todo el catálogo';
    }
    if (!primera) { revelarNuevos(grid); refrescar(); }
  };
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
    cargar(c.dataset.vehChip, false);
  }));
  await cargar('', true);
}

async function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const todas = await servidor.facetas({});
  const GRUPOS = ['cat', 'tipo', 'uso', 'rodado'];
  const lista = k => (params.get(k) || '').split(',').map(s => s.trim()).filter(v => v && todas[k][v]);
  const estado = { cat: lista('cat'), tipo: lista('tipo'), uso: lista('uso'), rodado: lista('rodado'), q: (params.get('q') || '').slice(0, 60), medida: '', orden: ORDENES[params.get('orden')] ? params.get('orden') : 'relevancia' };
  const medidaUrl = (params.get('medida') || '').slice(0, 30);
  if (medidaUrl && await servidor.contar({ medida: medidaUrl })) estado.medida = medidaUrl;

  const input = document.querySelector('[data-cat-search] input');
  const orden = document.querySelector('[data-orden]');
  const count = document.querySelector('[data-count]');
  const vacio = document.querySelector('[data-vacio]');
  const mas = document.querySelector('[data-mas]');
  const chipsBox = document.querySelector('[data-chips]');
  const h1 = document.querySelector('[data-cat-titulo]');
  const miga = document.querySelector('[data-miga-cat]');
  if (input) input.value = estado.q;
  if (orden) { orden.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${v}</option>`).join(''); orden.value = estado.orden; }

  const filtros = () => ({ cat: estado.cat, tipo: estado.tipo, uso: estado.uso, rodado: estado.rodado, q: estado.q, medida: estado.medida });
  const etiquetaDe = (g, v) => g === 'cat' ? catNombre(v) : g === 'tipo' ? TIPOS[v] : g === 'uso' ? USOS[v] : `Rodado ${v}`;
  const numero = v => parseFloat(v) || 0;

  const urlSync = () => {
    const u = new URLSearchParams();
    GRUPOS.forEach(g => { if (estado[g].length) u.set(g, estado[g].join(',')); });
    if (estado.q) u.set('q', estado.q);
    if (estado.medida) u.set('medida', estado.medida);
    if (estado.orden !== 'relevancia') u.set('orden', estado.orden);
    const qs = u.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  const titulos = () => {
    const unica = estado.cat.length === 1 ? CATEGORIAS.find(c => c.id === estado.cat[0]) : null;
    const t = unica ? unica.titulo : 'Neumáticos, cubiertas y cámaras';
    if (h1) h1.textContent = estado.medida ? `${t} ${estado.medida}` : t;
    if (miga) { miga.hidden = !unica; miga.textContent = unica ? unica.nombre : ''; }
    document.title = `${unica ? unica.titulo : 'Catálogo de neumáticos'} | Gomería Lorenzo`;
    document.querySelectorAll('[data-cats-list] a').forEach(a => {
      if (unica && a.getAttribute('href').endsWith(`cat=${unica.id}`)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };

  const pintarFacetas = async () => {
    const f = await servidor.facetas(filtros());
    GRUPOS.forEach(g => {
      const box = document.querySelector(`[data-facet="${g}"]`);
      if (!box) return;
      let valores = Object.keys(todas[g]);
      if (g === 'cat') valores = CATEGORIAS.map(c => c.id).filter(v => todas.cat[v]);
      if (g === 'rodado') valores.sort((a, b) => numero(a) - numero(b));
      if (g === 'uso') valores = valores.filter(v => v !== 'camara');
      box.innerHTML = valores.filter(v => f[g][v] || estado[g].includes(v)).map(v => {
        const n = f[g][v] || 0;
        const on = estado[g].includes(v);
        return `<label class="chk"><input type="checkbox" data-f="${g}" value="${esc(v)}"${on ? ' checked' : ''}> ${esc(etiquetaDe(g, v))} <span class="chk-n">${n}</span></label>`;
      }).join('');
    });
  };

  const pintarChips = () => {
    const chips = [];
    GRUPOS.forEach(g => estado[g].forEach(v => chips.push([g, v, etiquetaDe(g, v)])));
    if (estado.medida) chips.push(['medida', estado.medida, `Medida ${estado.medida}`]);
    if (estado.q) chips.push(['q', estado.q, `“${estado.q}”`]);
    chipsBox.innerHTML = chips.map(([g, v, t]) => `<button class="f-chip" type="button" data-quitar-f="${g}" data-v="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)} ${ICON.cerrar}</button>`).join('');
  };

  let cursor = null;
  let pedido = 0;
  const cargar = async reset => {
    const n = ++pedido;
    const r = await servidor.consultar({ filtros: filtros(), orden: estado.orden, cursor: reset ? null : cursor, limite: 16 });
    if (n !== pedido) return;
    recordar(r.items);
    const html = r.items.map(p => cardHTML(p, { nivel: 3 })).join('');
    if (reset) grid.innerHTML = html; else grid.insertAdjacentHTML('beforeend', html);
    cursor = r.cursor;
    mas.hidden = !r.hayMas;
    if (reset) {
      const total = await servidor.contar(filtros());
      if (n !== pedido) return;
      count.textContent = total === 1 ? '1 producto' : `${total} productos`;
      vacio.hidden = total > 0;
      if (!total) {
        const q = estado.medida || estado.q;
        const wsp = vacio.querySelector('[data-vacio-wsp]');
        if (wsp) wsp.href = waLink(`Hola Gomería Lorenzo, ¿tienen${q ? ` ${q}` : ' esta medida'}?`);
      }
    }
    revelarNuevos(grid);
    refrescar();
  };

  const aplicar = () => { urlSync(); titulos(); pintarChips(); pintarFacetas(); return cargar(true); };

  document.querySelector('.filtros')?.addEventListener('change', e => {
    const c = e.target.closest('[data-f]');
    if (!c) return;
    const g = c.dataset.f;
    estado[g] = c.checked ? [...new Set([...estado[g], c.value])] : estado[g].filter(v => v !== c.value);
    aplicar();
  });
  chipsBox?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-f]');
    if (!b) return;
    const g = b.dataset.quitarF;
    if (g === 'q') { estado.q = ''; if (input) input.value = ''; }
    else if (g === 'medida') estado.medida = '';
    else estado[g] = estado[g].filter(v => v !== b.dataset.v);
    aplicar();
  });
  let tq = 0;
  input?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-search]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  orden?.addEventListener('change', () => { estado.orden = ORDENES[orden.value] ? orden.value : 'relevancia'; aplicar(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    GRUPOS.forEach(g => { estado[g] = []; });
    estado.q = ''; estado.medida = '';
    if (input) input.value = '';
    aplicar();
  }));
  mas?.addEventListener('click', () => cargar(false));

  titulos(); pintarChips();
  await Promise.all([pintarFacetas(), cargar(true)]);
  if (params.has('q') && input) input.focus({ preventScroll: true });
}

function initFiltrosMobile() {
  const panel = document.getElementById('filtros');
  const abrir = document.querySelector('[data-filtros-open]');
  if (!panel || !abrir) return;
  let bd = null;
  let soltar = null;
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrir.setAttribute('aria-expanded', 'false');
    soltar?.(); soltar = null;
    abrir.focus();
  };
  abrir.addEventListener('click', () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); bd.style.zIndex = '100'; bd.addEventListener('click', cerrar); }
    panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    panel.classList.add('open'); bd.classList.add('open');
    document.body.classList.add('no-scroll');
    abrir.setAttribute('aria-expanded', 'true');
    soltar = atrapar(panel);
    panel.querySelector('[data-filtros-close]')?.focus();
  });
  panel.querySelectorAll('[data-filtros-close]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', cerrar);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  const crear = () => {
    if (el.dataset.listo || typeof L === 'undefined') return;
    el.dataset.listo = '1';
    const lat = parseFloat(el.dataset.lat), lng = parseFloat(el.dataset.lng);
    const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false }).setView([lat, lng], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icon = L.divIcon({ className: 'pin', html: ICON.pin, iconSize: [34, 44], iconAnchor: [17, 44], popupAnchor: [0, -40] });
    L.marker([lat, lng], { icon, title: 'Gomería Lorenzo' }).addTo(mapa).bindPopup('<strong>Gomería Lorenzo</strong><br>Luján · dirección a confirmar');
    setTimeout(() => mapa.invalidateSize(), 400);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { io.disconnect(); crear(); } }, { rootMargin: '400px 0px' });
    io.observe(el);
  }
  window.addEventListener('load', () => setTimeout(crear, 1500));
}

async function iniciar() {
  try { initHeroMotion(); } catch (e) { console.error(e); }
  [initModelBarScroll, initFloats, initTabs, initOverlays].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  let resumen = [];
  try { resumen = await servidor.resumen(); } catch (e) { console.error(e); }
  try {
    const ids = Cart.get().map(i => i.id);
    if (ids.length) { recordar(await servidor.obtener(ids)); Cart.syncStock([...cache.values()]); }
  } catch (e) { console.error(e); }
  for (const fn of [() => initMenuCategorias(resumen), () => initCatMeta(resumen), initRail, initPopulares, initBuscadores, initCatalogo]) {
    try { await fn(); } catch (e) { console.error(e); }
  }
  [initNav, initReveals, initParallax, initMapa, initFiltrosMobile, updateCartBadge].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) { try { recordar(await servidor.obtener([prod])); if (getProducto(prod)) abrirVista(prod); } catch (e) { console.error(e); } }
  refrescar();
}
iniciar();
