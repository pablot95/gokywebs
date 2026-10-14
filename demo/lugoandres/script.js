const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WSP = '5493794221546';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const waURL = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;

const CATEGORIAS = [
  { id: 'parrillas', nombre: 'Parrillas y chulengos', corto: 'Parrillas', img: 'p-parrilla-movil', desc: 'Parrillas de pie, de pared y móviles, chulengos y campanas, al tamaño de tu quincho.' },
  { id: 'asadores', nombre: 'Kits asadores e iniciadores', corto: 'Kits asadores', img: 'k-kit', desc: 'Herramientas de hierro retorcido para el asado y cilindros para prender el fuego.' },
  { id: 'muebles', nombre: 'Estantes y muebles industriales', corto: 'Estantes y muebles', img: 'e-estanteria', desc: 'Estanterías, mesas de trabajo y sillas que combinan hierro y madera.' },
  { id: 'mesas', nombre: 'Mesas a medida', corto: 'Mesas', img: 'm-mesa-comedor', desc: 'Mesas de comedor y de quincho con patas de hierro y tapa de madera.' },
];

const AMBIENTES = [
  { id: 'quincho', nombre: 'Quincho y patio' },
  { id: 'interior', nombre: 'Interior' },
  { id: 'taller', nombre: 'Taller' },
];

const PRODUCTOS = [
  { id: 'parrilla-campana', cod: 'LA-01', nombre: 'Parrilla con campana y leñero', cat: 'parrillas', amb: 'quincho', img: 'p-parrilla-campana', destacado: true,
    desc: 'Parrilla de pie con campana de chapa, grilla con elevación a volante y leñero abajo. Se arma al ancho de tu quincho.',
    opciones: ['Ancho y alto a medida', 'Grilla en V o de hierro redondo', 'Con o sin chimenea', 'Leñero inferior'], tags: ['campana', 'chimenea', 'volante', 'leña', 'asador'] },
  { id: 'parrilla-movil', cod: 'LA-02', nombre: 'Parrilla móvil con elevación a volante', cat: 'parrillas', amb: 'quincho', img: 'p-parrilla-movil', destacado: true,
    desc: 'Parrilla sobre ruedas con brasero lateral, grilla que sube y baja con volante y estante de metal desplegado.',
    opciones: ['Medida de grilla a elección', 'Con ruedas', 'Brasero lateral', 'Estante inferior'], tags: ['ruedas', 'brasero', 'móvil', 'volante'] },
  { id: 'parrilla-obra', cod: 'LA-03', nombre: 'Parrilla de pared con campana', cat: 'parrillas', amb: 'quincho', img: 'p-parrilla-obra',
    desc: 'Frente de hierro para el quincho: campana, grilla con elevación y puertas de guardado abajo.',
    opciones: ['A la medida del hueco', 'Puertas de guardado', 'Grilla con elevación'], tags: ['empotrar', 'quincho', 'campana', 'pared'] },
  { id: 'chulengo', cod: 'LA-04', nombre: 'Chulengo ahumador con carro', cat: 'parrillas', amb: 'quincho', img: 'p-chulengo', destacado: true,
    desc: 'Chulengo de chapa con tapa, termómetro, chimenea y caja de fuego lateral, sobre carro con ruedas y portaleña.',
    opciones: ['Tamaño a elección', 'Caja de fuego lateral', 'Carro con ruedas y portaleña'], tags: ['chulengo', 'ahumador', 'tapa', 'ruedas'] },
  { id: 'campana', cod: 'LA-05', nombre: 'Campana con chimenea para parrilla', cat: 'parrillas', amb: 'quincho', img: 'p-campana',
    desc: 'Campana de chapa con chimenea, para una parrilla nueva o para sumarle a la que ya tenés.',
    opciones: ['Medida según la parrilla', 'Alto de chimenea a elección'], tags: ['campana', 'chimenea', 'humo'] },
  { id: 'volante', cod: 'LA-06', nombre: 'Sistema de elevación a volante', cat: 'parrillas', amb: 'quincho', img: 'p-volante',
    desc: 'Volante, eje y cadenas para subir y bajar la grilla. Se adapta a parrillas que ya tenés.',
    opciones: ['Para parrilla nueva o existente', 'Volante a la izquierda o a la derecha'], tags: ['volante', 'elevación', 'cadena', 'repuesto'] },
  { id: 'kit-asador', cod: 'LA-07', nombre: 'Kit asador de hierro retorcido', cat: 'asadores', amb: 'quincho', img: 'k-kit', destacado: true,
    desc: 'Pala, atizador, pinza, espátula, tenedor y pinchos de hierro retorcido con mango de madera.',
    opciones: ['Piezas a elección', 'Mangos de madera', 'Largo a medida'], tags: ['kit', 'pala', 'pinza', 'espátula', 'tenedor', 'pinchos', 'regalo'] },
  { id: 'pala-pinza-atizador', cod: 'LA-08', nombre: 'Set de pala, pinza y atizador', cat: 'asadores', amb: 'quincho', img: 'k-pala-atizador',
    desc: 'Las tres herramientas para mover las brasas, en hierro retorcido con mango de madera.',
    opciones: ['Largo a elección', 'Mangos de madera'], tags: ['pala', 'pinza', 'atizador', 'brasas'] },
  { id: 'espatula-tenedor', cod: 'LA-09', nombre: 'Espátula y tenedor parrillero', cat: 'asadores', amb: 'quincho', img: 'k-espatula-tenedor',
    desc: 'Espátula calada y tenedor de dos puntas, de hierro retorcido con mango de madera.',
    opciones: ['Largo a elección', 'Mangos de madera'], tags: ['espátula', 'tenedor', 'servir'] },
  { id: 'pinchos', cod: 'LA-10', nombre: 'Juego de pinchos de hierro', cat: 'asadores', amb: 'quincho', img: 'k-pinchos',
    desc: 'Pinchos largos de hierro retorcido para brochettes y achuras.',
    opciones: ['Cantidad a elección', 'Largo a medida'], tags: ['pinchos', 'brochette', 'brochettes', 'achuras'] },
  { id: 'iniciador', cod: 'LA-11', nombre: 'Iniciador de fuego calado', cat: 'asadores', amb: 'quincho', img: 'k-iniciador', destacado: true,
    desc: 'Cilindro de chapa con llamas caladas y patas, para prender carbón o leña de forma pareja.',
    opciones: ['Diámetro a elección', 'Diseño del calado a elección'], tags: ['iniciador', 'fuego', 'carbón', 'encendedor'] },
  { id: 'estanteria', cod: 'LA-12', nombre: 'Estantería industrial de hierro y madera', cat: 'muebles', amb: 'interior', img: 'e-estanteria', destacado: true,
    desc: 'Estructura de caño con cruces y estantes de madera. Se hace al alto y al ancho de tu pared.',
    opciones: ['Alto y ancho a medida', 'Cantidad de estantes a elección', 'Estantes de madera'], tags: ['estante', 'estantería', 'biblioteca', 'living', 'madera'] },
  { id: 'estanteria-taller', cod: 'LA-13', nombre: 'Estantería para taller o depósito', cat: 'muebles', amb: 'taller', img: 'e-estanteria-taller',
    desc: 'Estantes reforzados para herramientas, cajas y equipos, con la profundidad que necesites.',
    opciones: ['Medidas a elección', 'Estantes de madera o de chapa'], tags: ['taller', 'depósito', 'estante', 'garage'] },
  { id: 'mesa-trabajo', cod: 'LA-14', nombre: 'Mesa de trabajo con estante desplegado', cat: 'muebles', amb: 'taller', img: 'e-mesa-trabajo',
    desc: 'Mesa firme de hierro con estante inferior de metal desplegado, para el taller o la cocina del quincho.',
    opciones: ['Largo y alto a medida', 'Estante inferior', 'Tapa de chapa o de madera'], tags: ['mesa', 'trabajo', 'banco', 'taller', 'metal desplegado'] },
  { id: 'silla', cod: 'LA-15', nombre: 'Silla industrial de chapa', cat: 'muebles', amb: 'interior', img: 'e-silla',
    desc: 'Silla de chapa y caño, para acompañar una mesa industrial en la casa o en el quincho.',
    opciones: ['Cantidad a elección', 'Con o sin apoyabrazos'], tags: ['silla', 'sillas', 'comedor', 'quincho'] },
  { id: 'mesa-comedor', cod: 'LA-16', nombre: 'Mesa de comedor con patas en U', cat: 'mesas', amb: 'interior', img: 'm-mesa-comedor', destacado: true,
    desc: 'Tapa de madera maciza sobre patas de caño en U. Largo, ancho y alto a la medida de tu ambiente.',
    opciones: ['Medidas a elección', 'Patas en U o en X', 'Tapa de madera'], tags: ['mesa', 'comedor', 'madera', 'patas'] },
  { id: 'mesa-quincho', cod: 'LA-17', nombre: 'Mesa de quincho de hierro y madera', cat: 'mesas', amb: 'quincho', img: 'm-mesa-quincho', destacado: true,
    desc: 'Estructura de hierro y tapa de madera, pensada para comer al lado de la parrilla.',
    opciones: ['Cantidad de lugares a elección', 'Tapa de madera'], tags: ['mesa', 'quincho', 'asado', 'madera'] },
  { id: 'patas-u', cod: 'LA-18', nombre: 'Patas de hierro en U para mesa', cat: 'mesas', amb: 'interior', img: 'm-patas',
    desc: 'El par de patas de caño en U, para que le pongas tu propia tapa.',
    opciones: ['Alto y ancho a medida'], tags: ['patas', 'base', 'mesa'] },
];

const LISTAS = {
  vitrina: ['parrilla-campana', 'chulengo', 'parrilla-movil', 'estanteria', 'mesa-comedor', 'mesa-quincho', 'parrilla-obra', 'mesa-trabajo'],
  accesorios: ['kit-asador', 'iniciador', 'pala-pinza-atizador', 'espatula-tenedor', 'pinchos', 'campana', 'volante'],
};

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getAmbiente = id => AMBIENTES.find(a => a.id === id);

const LIMITE_SERVIDOR = 100;

function coincide(p, f) {
  if (p.visible === false) return false;
  if (f.ids && !f.ids.includes(p.id)) return false;
  if (f.destacado && !p.destacado) return false;
  if (f.cat?.length && !f.cat.includes(p.cat)) return false;
  if (f.amb?.length && !f.amb.includes(p.amb)) return false;
  if (f.q) {
    const texto = normalizar([p.nombre, p.cod, getCategoria(p.cat)?.nombre, getAmbiente(p.amb)?.nombre, p.desc, ...(p.opciones || []), ...(p.tags || [])].join(' '));
    if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
  }
  return true;
}

const ORDEN_VITRINA = ['parrilla-campana', 'parrilla-movil', 'chulengo', 'kit-asador', 'iniciador', 'estanteria', 'mesa-comedor', 'mesa-quincho',
  'parrilla-obra', 'pala-pinza-atizador', 'estanteria-taller', 'campana', 'espatula-tenedor', 'mesa-trabajo', 'volante', 'silla', 'pinchos', 'patas-u'];
const rango = p => { const i = ORDEN_VITRINA.indexOf(p.id); return i < 0 ? ORDEN_VITRINA.length : i; };

const ORDENES = {
  destacados: (a, b) => (b.p.destacado ? 1 : 0) - (a.p.destacado ? 1 : 0) || rango(a.p) - rango(b.p) || a.i - b.i,
  nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i,
  categoria: (a, b) => CATEGORIAS.findIndex(c => c.id === a.p.cat) - CATEGORIAS.findIndex(c => c.id === b.p.cat) || a.p.nombre.localeCompare(b.p.nombre, 'es'),
};

function consultarProductos({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
  const tope = Math.min(Math.max(1, Math.floor(limite) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
  let lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(x => coincide(x.p, filtros));
  if (orden === 'ids' && filtros.ids) lista.sort((a, b) => filtros.ids.indexOf(a.p.id) - filtros.ids.indexOf(b.p.id));
  else lista.sort(ORDENES[orden] || ORDENES.destacados);
  lista = lista.map(x => x.p);
  const desde = cursor ? lista.findIndex(p => p.id === cursor) + 1 : 0;
  const items = desde > 0 || !cursor ? lista.slice(desde, desde + tope) : [];
  const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
  return Promise.resolve({ items, siguiente, total: lista.length });
}

function obtenerProducto(id) {
  const p = getProducto(id);
  return Promise.resolve(p && p.visible !== false ? p : null);
}

function contarPor(campo) {
  const n = {};
  PRODUCTOS.forEach(p => { if (p.visible !== false) n[p[campo]] = (n[p[campo]] || 0) + 1; });
  return n;
}

const Presu = {
  KEY: 'lugoandres_presupuesto',
  KEY_NOTA: 'lugoandres_presupuesto_nota',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getProducto(i.id)) : [];
    } catch { return []; }
  },
  save(items, avisar = true) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento la lista vive en la página */ }
    if (avisar) document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(id, qty = 1, nota = '') {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (it) {
      it.qty = Math.min(it.qty + qty, 99);
      if (nota) it.nota = nota;
    } else items.push({ id, qty: Math.min(Math.max(1, qty), 99), nota });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(99, qty));
    this.save(items);
  },
  setNota(id, nota) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.nota = nota.slice(0, 120);
    this.save(items, false);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  comentario() { try { return localStorage.getItem(this.KEY_NOTA) || ''; } catch { return ''; } },
  setComentario(v) { try { localStorage.setItem(this.KEY_NOTA, v.slice(0, 300)); } catch { /* opcional */ } },
};

function mensajePresupuesto() {
  const lineas = Presu.get().map(i => {
    const p = getProducto(i.id);
    return `• ${i.qty} × ${p.nombre} (${p.cod})${i.nota ? ` — ${i.nota}` : ''}`;
  });
  const com = Presu.comentario().trim();
  return ['Hola! Quiero pedir presupuesto por:', ...lineas, com ? `Comentarios: ${com}` : ''].filter(Boolean).join('\n');
}

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
};

const ICON_MAS = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MENOS = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_X = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_FLECHA = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ICON_BASURA = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
const ICON_CHECK = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_WA = '<svg class="ico-wa" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

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

function cardHTML(p, { animar = true } = {}) {
  const cat = getCategoria(p.cat);
  const anim = animar ? ANIM.subir : '';
  const foto = `<button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="800" height="800"></button>`;
  const add = `<button type="button" class="card__add" data-add="${p.id}" aria-label="Sumar ${esc(p.nombre)} al presupuesto">${ICON_MAS}<span>Sumar</span></button>`;
  if (MODELO === '2') {
    return `<article class="card card--chapa" data-id="${p.id}" ${anim}>${foto}
      <div class="card__chapa chapa"><span class="chapa__cod">${p.cod}</span><h3 class="card__nombre">${esc(p.nombre)}</h3></div>
      <div class="card__pie"><span class="card__cat">${esc(cat?.corto)}</span>${add}</div></article>`;
  }
  return `<article class="card card--foto" data-id="${p.id}" ${anim}>${foto}
    <div class="card__info"><p class="card__cat">${esc(cat?.corto)}</p><h3 class="card__nombre">${esc(p.nombre)}</h3><p class="card__cod">A medida · ${p.cod}</p></div>${add}</article>`;
}

function renderMenus() {
  const n = contarPor('cat');
  const total = PRODUCTOS.filter(p => p.visible !== false).length;
  document.querySelectorAll('[data-cat-menu]').forEach(panel => {
    panel.innerHTML = CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}"><img src="images/${c.img}.webp" alt="" width="800" height="800"><span><strong>${esc(c.nombre)}</strong><small>${n[c.id] || 0} trabajos</small></span></a>`).join('')
      + `<a class="dd__todo" href="${CATALOGO}">Ver todo el catálogo (${total}) ${ICON_FLECHA}</a>`;
  });
  document.querySelectorAll('[data-cat-links]').forEach(cont => {
    cont.innerHTML = CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a>`).join('');
  });
  document.querySelectorAll('[data-cat-chips]').forEach(cont => {
    cont.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.corto)} <span>${n[c.id] || 0}</span></a></li>`).join('');
  });
  const grid = document.getElementById('catGrid');
  if (grid) {
    grid.innerHTML = CATEGORIAS.map(c => `<li ${ANIM.subir}><a class="cat-card" href="${CATALOGO}?cat=${c.id}">
      <span class="cat-card__foto"><img src="images/${c.img}.webp" alt="${esc(c.nombre)}" width="800" height="800"></span>
      <span class="cat-card__body"><span class="cat-card__nombre">${esc(c.nombre)}</span><span class="cat-card__desc">${esc(c.desc)}</span>
      <span class="cat-card__n">${n[c.id] || 0} trabajos ${ICON_FLECHA}</span></span></a></li>`).join('');
  }
}

async function renderListas() {
  const pedidos = [...document.querySelectorAll('[data-lista]')].map(async cont => {
    const lista = cont.dataset.lista;
    const consulta = lista === 'destacados'
      ? { filtros: { destacado: true }, limite: 8 }
      : { filtros: { ids: LISTAS[lista] || [] }, orden: 'ids', limite: 8 };
    const r = await consultarProductos(consulta);
    if (cont.classList.contains('rail')) {
      cont.innerHTML = `<div class="rail__track">${r.items.map(p => `<div class="rail__item" ${ANIM.der}>${cardHTML(p, { animar: false })}</div>`).join('')}</div>`;
    } else {
      cont.innerHTML = r.items.map(p => cardHTML(p)).join('');
    }
  });
  await Promise.all(pedidos);
}

const Catalogo = {
  estado: { cat: [], amb: [], q: '', orden: 'destacados' },
  buffer: [], siguiente: null, total: 0, mostrar: 16, PASO: 16, pintados: 0, pedido: 0,
};

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const lista = (k, validos) => (p.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  const e = Catalogo.estado;
  e.cat = lista('cat', CATEGORIAS.map(c => c.id));
  e.amb = lista('amb', AMBIENTES.map(a => a.id));
  e.q = (p.get('q') || '').trim().slice(0, 60);
  e.orden = Object.keys(ORDENES).includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  if (e.cat.length) p.set('cat', e.cat.join(','));
  if (e.amb.length) p.set('amb', e.amb.join(','));
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function filtrosActivos() {
  const e = Catalogo.estado;
  return e.cat.length + e.amb.length;
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => { inp.checked = (e[inp.dataset.f] || []).includes(inp.value); });
  document.querySelectorAll('[data-amb-pill]').forEach(b => b.setAttribute('aria-pressed', String(e.amb.includes(b.dataset.ambPill))));
  document.querySelectorAll('#catPills a').forEach(a => {
    const id = a.dataset.pill;
    const activo = id ? (e.cat.length === 1 && e.cat[0] === id) : !e.cat.length;
    if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  const badge = document.getElementById('filtrosN');
  if (badge) badge.textContent = n ? `(${n})` : '';

  const unaCat = e.cat.length === 1 ? getCategoria(e.cat[0]) : null;
  const titulo = unaCat ? unaCat.nombre : 'Catálogo de trabajos';
  const h1 = document.getElementById('catTitulo');
  if (h1) h1.textContent = titulo;
  const miga = document.getElementById('migaCat');
  const sep = document.getElementById('migaCatSep');
  if (miga) { miga.hidden = !unaCat; miga.textContent = unaCat ? unaCat.nombre : ''; }
  if (sep) sep.hidden = !unaCat;
  document.title = `${unaCat ? unaCat.nombre : 'Catálogo de trabajos'} — Lugo Andrés, herrería a medida`;
  document.querySelectorAll('[data-cat-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.corto })),
      ...e.amb.map(id => ({ f: 'amb', v: id, t: getAmbiente(id)?.nombre })),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('')
      + (items.length ? '<button type="button" class="chip chip--limpiar" data-limpiar>Limpiar todo</button>' : '');
  }
}

async function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, amb: e.amb, q: e.q };
  const pedido = ++Catalogo.pedido;
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    const r = await consultarProductos({ filtros, orden: e.orden, limite: LIMITE_SERVIDOR });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer = r.items; Catalogo.siguiente = r.siguiente; Catalogo.total = r.total; Catalogo.pintados = 0;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = await consultarProductos({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_SERVIDOR });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer.push(...r.items); Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'trabajo' : 'trabajos'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    const quedan = Math.max(0, Catalogo.total - Catalogo.pintados);
    mas.hidden = quedan === 0;
    mas.textContent = `Ver más trabajos (${quedan})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

async function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const porCat = contarPor('cat');
  const porAmb = contarPor('amb');
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="f-n">${porCat[c.id] || 0}</span></label>`).join('');
  const fAmb = document.getElementById('fAmb');
  if (fAmb) fAmb.innerHTML = AMBIENTES.map(a => `<label class="f-check"><input type="checkbox" data-f="amb" value="${a.id}"><span>${esc(a.nombre)}</span><span class="f-n">${porAmb[a.id] || 0}</span></label>`).join('');
  const pills = document.getElementById('catPills');
  if (pills) pills.innerHTML = `<a href="${CATALOGO}" data-pill="">Todo</a>` + CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}" data-pill="${c.id}">${esc(c.corto)}</a>`).join('');
  const ambPills = document.getElementById('ambPills');
  if (ambPills) ambPills.innerHTML = AMBIENTES.map(a => `<button type="button" class="pill" data-amb-pill="${a.id}" aria-pressed="false">${esc(a.nombre)}</button>`).join('');

  leerURLCatalogo();
  sincronizarControles();
  await cargarCatalogo(true);

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const e = Catalogo.estado;
    const f = inp.dataset.f;
    e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
    aplicarCambioCatalogo();
  });
  const form = document.getElementById('buscadorForm');
  const buscar = document.getElementById('buscar');
  let t = 0;
  form?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); });
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 260);
  });
  document.getElementById('orden')?.addEventListener('change', ev => { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); });
  document.addEventListener('click', ev => {
    const quitar = ev.target.closest('[data-quitar]');
    if (quitar) {
      const e = Catalogo.estado;
      const f = quitar.dataset.quitar;
      if (f === 'q') e.q = ''; else e[f] = e[f].filter(x => x !== quitar.dataset.valor);
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      Object.assign(Catalogo.estado, { cat: [], amb: [], q: '' });
      aplicarCambioCatalogo();
      return;
    }
    const amb = ev.target.closest('[data-amb-pill]');
    if (amb) {
      const e = Catalogo.estado;
      const id = amb.dataset.ambPill;
      e.amb = e.amb.includes(id) ? e.amb.filter(x => x !== id) : [...e.amb, id];
      aplicarCambioCatalogo();
      return;
    }
    const pill = ev.target.closest('#catPills a');
    if (pill) {
      ev.preventDefault();
      Catalogo.estado.cat = pill.dataset.pill ? [pill.dataset.pill] : [];
      aplicarCambioCatalogo();
    }
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    Catalogo.mostrar += Catalogo.PASO;
    cargarCatalogo(false);
  });
  if (location.hash === '#buscar') window.requestAnimationFrame(() => buscar?.focus());
  initFiltrosDrawer();
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); } else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const abrir = document.getElementById('abrirFiltros');
  const bd = document.getElementById('filtrosBd');
  if (!panel || !abrir) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  const sync = () => {
    if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', '');
    else panel.removeAttribute('inert');
  };
  const cerrar = () => {
    panel.classList.remove('open');
    if (bd) bd.hidden = true;
    abrir.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    sync();
    abrir.focus();
  };
  const open = () => {
    panel.removeAttribute('inert');
    panel.classList.add('open');
    if (bd) bd.hidden = false;
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('input, button')?.focus();
  };
  abrir.addEventListener('click', open);
  document.getElementById('cerrarFiltros')?.addEventListener('click', cerrar);
  document.getElementById('verResultados')?.addEventListener('click', cerrar);
  bd?.addEventListener('click', cerrar);
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar(); else atraparFoco(panel, e);
  });
  mq.addEventListener('change', () => { if (!mq.matches && panel.classList.contains('open')) cerrar(); sync(); });
  sync();
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const fondo = document.querySelector('.plano__fondo img');
  if (fondo) {
    gsap.fromTo(fondo, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.plano', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  }
  const heroImg = document.querySelector('.hero--banner .hero__media img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero--banner', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
  }
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initDropdowns() {
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('[data-dd]').forEach(dd => {
    const btn = dd.querySelector('.dd__btn');
    const panel = dd.querySelector('.dd__panel');
    if (!btn || !panel) return;
    let t = 0;
    const abrir = () => { clearTimeout(t); dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (dd.classList.contains('open') ? cerrar() : abrir()));
    dd.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    dd.addEventListener('mouseleave', () => { if (hoverMq.matches) t = setTimeout(cerrar, 120); });
    dd.addEventListener('keydown', e => { if (e.key === 'Escape' && dd.classList.contains('open')) { e.stopPropagation(); cerrar(); btn.focus(); } });
    dd.addEventListener('focusout', e => { if (hoverMq.matches && !dd.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !dd.contains(e.target)) cerrar(); });
  });
}

function updateCartBadge() {
  const n = Presu.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Presu.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
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

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    let pointerId = null;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    let bloquear = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || vp.scrollWidth <= vp.clientWidth + 2) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin captura igual arrastra */ }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const fin = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      if (moved) { bloquear = true; setTimeout(() => { bloquear = false; }, 0); }
      pointerId = null;
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('click', e => { if (bloquear) { e.preventDefault(); e.stopPropagation(); } }, true);

    const prev = document.querySelector(`[data-rail-prev="${vp.id}"]`);
    const next = document.querySelector(`[data-rail-next="${vp.id}"]`);
    if (!prev || !next) return;
    const track = vp.querySelector('.rail__track');
    const paso = () => (vp.querySelector('.rail__item')?.getBoundingClientRect().width || 300) + 16;
    const estado = () => {
      const inicio = track ? parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0 : 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado, { passive: true });
    estado();
  });
}

let presuOpener = null;

function abrirPresu(opener) {
  const d = document.getElementById('presuDrawer');
  const bd = document.getElementById('presuBd');
  if (!d) return;
  presuOpener = opener || document.activeElement;
  renderPresu();
  d.hidden = false; if (bd) bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { d.classList.add('open'); bd?.classList.add('open'); }));
  d.querySelector('[data-close-presu]')?.focus();
}

function cerrarPresu() {
  const d = document.getElementById('presuDrawer');
  const bd = document.getElementById('presuBd');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!d.classList.contains('open')) { d.hidden = true; if (bd) bd.hidden = true; } }, reduceMotion ? 0 : 380);
  presuOpener?.focus?.();
  presuOpener = null;
}

function actualizarEnvio() {
  const a = document.getElementById('presuEnviar');
  if (a) a.setAttribute('href', waURL(mensajePresupuesto()));
}

function renderPresu() {
  const lista = document.getElementById('presuLista');
  const foot = document.getElementById('presuFoot');
  if (!lista) return;
  const items = Presu.get();
  if (!items.length) {
    lista.innerHTML = `<div class="presu-vacio"><p class="presu-vacio__titulo">Tu lista está vacía</p><p>Sumá los trabajos que te interesan y pedí el presupuesto de todo junto.</p><a class="btn btn--cta" href="${CATALOGO}">Ver el catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  lista.innerHTML = `<ul class="presu-items">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="presu-item" data-id="${p.id}">
      <img src="images/${p.img}.webp" alt="" width="800" height="800">
      <div class="presu-item__info">
        <p class="presu-item__nombre">${esc(p.nombre)}</p>
        <p class="presu-item__cod">${p.cod} · ${esc(getCategoria(p.cat)?.corto)}</p>
        <label class="sr-only" for="nota-${p.id}">Medidas o detalles de ${esc(p.nombre)}</label>
        <input class="presu-item__nota" id="nota-${p.id}" data-nota="${p.id}" value="${esc(i.nota || '')}" maxlength="120" placeholder="Medidas o detalles (opcional)">
        <div class="presu-item__fila">
          <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
            <button type="button" data-menos="${p.id}" aria-label="Restar uno">${ICON_MENOS}</button>
            <span>${i.qty}</span>
            <button type="button" data-mas="${p.id}" aria-label="Sumar uno">${ICON_MAS}</button>
          </div>
          <button type="button" class="link-quitar" data-quitar-item="${p.id}">${ICON_BASURA}Quitar</button>
        </div>
      </div></li>`;
  }).join('')}</ul>`;
  const com = document.getElementById('presuComentario');
  if (com && document.activeElement !== com) com.value = Presu.comentario();
  actualizarEnvio();
}

function initPresu() {
  const d = document.getElementById('presuDrawer');
  if (!d) return;
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open-presu]');
    if (open) { abrirPresu(open); return; }
    if (e.target.closest('[data-close-presu]') || e.target.id === 'presuBd') { cerrarPresu(); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Presu.add(p.id, 1);
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      showToast(`Sumaste «${p.nombre}» a tu presupuesto`);
      return;
    }
    const mas = e.target.closest('[data-mas]');
    if (mas) { const it = Presu.get().find(i => i.id === mas.dataset.mas); if (it) Presu.setQty(it.id, it.qty + 1); return; }
    const menos = e.target.closest('[data-menos]');
    if (menos) { const it = Presu.get().find(i => i.id === menos.dataset.menos); if (it) Presu.setQty(it.id, it.qty - 1); return; }
    const quitar = e.target.closest('[data-quitar-item]');
    if (quitar) { Presu.remove(quitar.dataset.quitarItem); d.querySelector('[data-close-presu]')?.focus(); return; }
    if (e.target.closest('[data-vaciar]')) { Presu.clear(); d.querySelector('[data-close-presu]')?.focus(); }
  });
  d.addEventListener('input', e => {
    const nota = e.target.closest('[data-nota]');
    if (nota) { Presu.setNota(nota.dataset.nota, nota.value); actualizarEnvio(); return; }
    if (e.target.id === 'presuComentario') { Presu.setComentario(e.target.value); actualizarEnvio(); }
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarPresu(); else atraparFoco(d, e);
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (!d.hidden) renderPresu();
  });
  window.addEventListener('storage', e => { if (e.key === Presu.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });
  updateCartBadge();
}

const QV = { id: null, opener: null };

function mensajeProducto(p, nota) {
  return `Hola! Quiero consultar por: ${p.nombre} (${p.cod}).${nota ? ` Medidas o detalles: ${nota}` : ''}`;
}

async function abrirQV(id, opener) {
  const dlg = document.getElementById('qv');
  const caja = document.getElementById('qvCaja');
  if (!dlg || !caja || typeof dlg.showModal !== 'function') return;
  const p = await obtenerProducto(id);
  if (!p) return;
  const cat = getCategoria(p.cat);
  const rel = (await consultarProductos({ filtros: { cat: [p.cat] }, limite: 4 })).items.filter(x => x.id !== p.id).slice(0, 3);
  QV.id = p.id;
  if (opener) QV.opener = opener;
  caja.innerHTML = `
    <button type="button" class="icon-btn qv__cerrar" data-qv-cerrar aria-label="Cerrar">${ICON_X}</button>
    <div class="qv__grid">
      <figure class="qv__foto"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="800" height="800"></figure>
      <div class="qv__info">
        <p class="qv__cat"><span class="chapa chapa--mini">${p.cod}</span>${esc(cat?.nombre)}</p>
        <h2 class="qv__nombre">${esc(p.nombre)}</h2>
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__sub">Lo podés pedir con</p>
        <ul class="qv__ops">${p.opciones.map(o => `<li>${ICON_CHECK}${esc(o)}</li>`).join('')}</ul>
        <label class="campo" for="qvNota"><span>Medidas o detalles (opcional)</span>
          <input id="qvNota" maxlength="120" placeholder="Ej.: 1,50 m de ancho, con ruedas"></label>
        <div class="qv__acciones">
          <div class="stepper" role="group" aria-label="Cantidad">
            <button type="button" data-qv-menos aria-label="Restar uno">${ICON_MENOS}</button>
            <input type="number" id="qvCant" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad">
            <button type="button" data-qv-mas aria-label="Sumar uno">${ICON_MAS}</button>
          </div>
          <button type="button" class="btn btn--cta" data-qv-add>${ICON_MAS}Sumar al presupuesto</button>
        </div>
        <a class="btn btn--wa-linea" id="qvWa" href="${esc(waURL(mensajeProducto(p, '')))}" target="_blank" rel="noopener">${ICON_WA}Consultar este trabajo por WhatsApp</a>
      </div>
    </div>
    ${rel.length ? `<div class="qv__rel"><p class="qv__sub">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="mini" data-quick="${r.id}"><img src="images/${r.img}.webp" alt="" width="800" height="800"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}`;
  if (!dlg.open) {
    dlg.showModal();
    document.body.classList.add('no-scroll');
  }
  caja.scrollTop = 0;
  dlg.scrollTop = 0;
  caja.querySelector('[data-qv-cerrar]')?.focus();
}

function cerrarQV() {
  const dlg = document.getElementById('qv');
  if (dlg?.open) dlg.close();
  limpiarQV();
}

function limpiarQV() {
  document.body.classList.remove('no-scroll');
  QV.opener?.focus?.();
  QV.opener = null;
  QV.id = null;
  if (new URLSearchParams(location.search).has('producto')) {
    const p = new URLSearchParams(location.search);
    p.delete('producto');
    const qs = p.toString();
    window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
}

function initQV() {
  const dlg = document.getElementById('qv');
  if (!dlg) return;
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-quick]');
    if (q) { abrirQV(q.dataset.quick, dlg.open ? null : q); return; }
  });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-qv-cerrar]')) { cerrarQV(); return; }
    const cant = document.getElementById('qvCant');
    if (e.target.closest('[data-qv-menos]') && cant) { cant.value = Math.max(1, (parseInt(cant.value, 10) || 1) - 1); return; }
    if (e.target.closest('[data-qv-mas]') && cant) { cant.value = Math.min(99, (parseInt(cant.value, 10) || 1) + 1); return; }
    if (e.target.closest('[data-qv-add]')) {
      const p = getProducto(QV.id);
      if (!p) return;
      const qty = Math.max(1, Math.min(99, parseInt(cant?.value, 10) || 1));
      const nota = (document.getElementById('qvNota')?.value || '').trim();
      Presu.add(p.id, qty, nota);
      showToast(`Sumaste «${p.nombre}» a tu presupuesto`);
      cerrarQV();
    }
  });
  dlg.addEventListener('input', e => {
    if (e.target.id !== 'qvNota') return;
    const p = getProducto(QV.id);
    const a = document.getElementById('qvWa');
    if (p && a) a.setAttribute('href', waURL(mensajeProducto(p, e.target.value.trim())));
  });
  dlg.addEventListener('close', limpiarQV);
}

function abrirProductoDesdeURL() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirQV(slug, null);
}

async function init() {
  renderMenus();
  await renderListas();
  await initCatalogo();
  initReveals();
  initNav();
  initDropdowns();
  initPresu();
  initQV();
  initFloats();
  initModelBarScroll();
  initRails();
  initHeroMotion();
  initParallax();
  initLeeScroll();
  abrirProductoDesdeURL();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

init();
