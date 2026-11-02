const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493426492005';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const CATEGORIAS = [{"id": "velas", "nombre": "Velas", "bajada": "Para encender una intención", "ico": "flame", "tono": "rosa"}, {"id": "aromas", "nombre": "Sahumerios y aromas", "bajada": "Humo, lavanda y melts", "ico": "wind", "tono": "lavanda"}, {"id": "cristales", "nombre": "Cristales", "bajada": "Cuarzo rosa y selenita", "ico": "gem", "tono": "durazno"}, {"id": "altar", "nombre": "Tarot y altar", "bajada": "Mazo y bandeja de piedras", "ico": "moon", "tono": "salvia"}];
const INTENCIONES = [{"id": "amor", "nombre": "Amor y amor propio", "corto": "Amor", "color": "Rosa", "hex": "#F7C3D0", "vela": "rosa", "texto": "Para el amor propio, los vínculos y abrir el corazón."}, {"id": "limpieza", "nombre": "Limpieza y protección", "corto": "Limpieza", "color": "Blanca", "hex": "#F3ECE2", "vela": "blanca", "texto": "Para limpiar la energía de la casa, cerrar ciclos y protegerte."}, {"id": "calma", "nombre": "Calma y descanso", "corto": "Calma", "color": "Celeste", "hex": "#CFE3F3", "vela": "celeste", "texto": "Para bajar la ansiedad, dormir mejor y hablar con tranquilidad."}, {"id": "abundancia", "nombre": "Abundancia y trabajo", "corto": "Abundancia", "color": "Verde", "hex": "#CFE3D4", "vela": "verde", "texto": "Para el trabajo, los proyectos nuevos y que la plata circule."}, {"id": "claridad", "nombre": "Claridad y decisiones", "corto": "Claridad", "color": "Amarilla", "hex": "#FAE8B0", "vela": "amarilla", "texto": "Para decidir, estudiar y ver las cosas como son."}, {"id": "intuicion", "nombre": "Intuición y cambios", "corto": "Intuición", "color": "Lila", "hex": "#DCCDF3", "vela": "lila", "texto": "Para escuchar la intuición, meditar y atravesar un cambio."}];
const PRECIOS = [{"id": "hasta6", "nombre": "Hasta $6.000", "min": null, "max": 6000}, {"id": "6a10", "nombre": "$6.000 a $10.000", "min": 6001, "max": 10000}, {"id": "mas10", "nombre": "Más de $10.000", "min": 10001, "max": null}];
const PRODUCTOS = [{"id": "vela-pilar", "nombre": "Vela pilar con flores secas", "cat": "velas", "rango": 1, "int": ["amor", "limpieza", "calma", "abundancia", "claridad", "intuicion"], "img": "images/velas-pilar.webp", "ancho": 800, "alto": 1000, "alt": "Tres velas pilar rosa, lila y marfil con pétalos secos en la cera, una encendida", "galeria": [{"src": "images/hero-velas.webp", "ancho": 900, "alto": 1600, "alt": "Velas pilar con lavanda, cuarzo rosa, amatista y un atado de salvia"}], "varLabel": "Color", "vars": [{"id": "rosa", "nombre": "Rosa", "precio": 8900, "hex": "#F7C3D0"}, {"id": "blanca", "nombre": "Blanca", "precio": 8900, "hex": "#F3ECE2"}, {"id": "celeste", "nombre": "Celeste", "precio": 8900, "hex": "#CFE3F3"}, {"id": "verde", "nombre": "Verde", "precio": 8900, "hex": "#CFE3D4"}, {"id": "amarilla", "nombre": "Amarilla", "precio": 8900, "hex": "#FAE8B0"}, {"id": "lila", "nombre": "Lila", "precio": 8900, "hex": "#DCCDF3"}], "desc": "Vela pilar con pétalos y flores secas en la cera. Elegí el color según la intención que querés encender.", "detalle": ["Aprox. 7 × 15 cm", "Pétalos y flores secas en la cera", "Seis colores, uno por intención"], "tags": "vela velon pilar flores petalos rosa lila blanca celeste verde amarilla ritual velomancia"}, {"id": "mazo-triple-luna", "nombre": "Mazo de tarot Triple Luna", "cat": "altar", "rango": 2, "int": ["claridad", "intuicion"], "img": "images/mazo-triple-luna.webp", "ancho": 600, "alto": 750, "alt": "Mazo de tarot con el reverso de la triple luna y flores de loto sobre lino rosa", "galeria": [{"src": "images/tarot-mesa.webp", "ancho": 1600, "alto": 900, "alt": "Mazo y tres cartas de tarot sobre lino rosa, con cuarzos, lavanda y una vela"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Unidad", "precio": 24000}], "desc": "Mazo de 78 cartas con el reverso de la triple luna, en su caja. Para empezar a tirar las cartas o sumar un mazo a tu mesa.", "detalle": ["78 cartas: arcanos mayores y menores", "Reverso con la triple luna", "Viene en caja"], "tags": "tarot cartas mazo baraja arcanos triple luna lectura"}, {"id": "cuarzo-rosa-bruto", "nombre": "Cuarzo rosa en bruto", "cat": "cristales", "rango": 3, "int": ["amor"], "img": "images/cuarzo-rosa-bruto.webp", "ancho": 720, "alto": 900, "alt": "Drusa de cuarzo rosa en bruto sobre fondo rosa con lavanda y salvia", "galeria": [{"src": "images/cuarzo-rosa-full.webp", "ancho": 1200, "alto": 1200, "alt": "Cuarzo rosa en bruto y piedras rodadas sobre fondo rosa"}], "varLabel": "Tamaño", "vars": [{"id": "chico", "nombre": "Chico, aprox. 5 cm", "precio": 3500}, {"id": "mediano", "nombre": "Mediano, aprox. 9 cm", "precio": 6900}], "desc": "La piedra del amor propio y los vínculos. Es una pieza natural: cada una tiene su forma y su tono.", "detalle": ["Pieza natural, sin pulir", "Dos tamaños", "Para el altar, la mesa de luz o una grilla"], "tags": "cuarzo rosa piedra cristal bruto drusa amor"}, {"id": "vela-vaso", "nombre": "Vela aromática en vaso", "cat": "velas", "rango": 4, "int": ["calma", "amor"], "img": "images/vela-vaso.webp", "ancho": 800, "alto": 1000, "alt": "Vela blanca en vaso de vidrio con salvia, lavanda y cuarzo rosa sobre fondo rosa", "galeria": [{"src": "images/vela-vaso-full.webp", "ancho": 1200, "alto": 1200, "alt": "Vela en vaso de vidrio rodeada de lavanda, salvia y cuarzo rosa"}], "varLabel": "Aroma", "vars": [{"id": "lavanda", "nombre": "Lavanda", "precio": 7500}, {"id": "rosas", "nombre": "Rosas", "precio": 7500}, {"id": "salvia", "nombre": "Salvia blanca", "precio": 7500}], "desc": "Vela en vaso de vidrio para encender en casa y dejar el aroma en el ambiente.", "detalle": ["Vaso de vidrio, aprox. 200 g", "Tres aromas", "El vaso se reutiliza"], "tags": "vela vaso aromatica aroma lavanda rosas salvia perfume ambiente"}, {"id": "bandeja-luna", "nombre": "Bandeja luna con 5 piedras", "cat": "altar", "rango": 5, "int": ["intuicion", "abundancia"], "img": "images/bandeja-luna.webp", "ancho": 800, "alto": 1000, "alt": "Bandeja de cerámica rosa en forma de luna con amatista, cuarzo rosa, cuarzo cristal, ágata y aventurina", "galeria": [{"src": "images/bandeja-luna-full.webp", "ancho": 1200, "alto": 1200, "alt": "Bandeja luna con cinco piedras pulidas sobre lino, con lavanda y salvia"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Unidad", "precio": 12500}], "desc": "Bandeja de cerámica en forma de luna con cinco piedras pulidas: amatista, cuarzo rosa, cuarzo cristal, ágata lila y aventurina.", "detalle": ["Cerámica rosa esmaltada", "Incluye las 5 piedras", "Para el altar o la mesa de lectura"], "tags": "bandeja luna ceramica altar piedras amatista cuarzo agata aventurina"}, {"id": "sahumerios-loto", "nombre": "Sahumerios con porta loto", "cat": "aromas", "rango": 6, "int": ["limpieza", "intuicion"], "img": "images/sahumerios-loto.webp", "ancho": 800, "alto": 1000, "alt": "Sahumerio encendido sobre un porta de cerámica con una flor de loto grabada", "galeria": [{"src": "images/sahumerios-loto-full.webp", "ancho": 1200, "alto": 1200, "alt": "Porta sahumerios de cerámica con varitas, cuarzo rosa y una vela"}], "varLabel": "Aroma", "vars": [{"id": "lavanda", "nombre": "Lavanda", "precio": 6800}, {"id": "palo-santo", "nombre": "Palo santo", "precio": 6800}, {"id": "rosas", "nombre": "Rosas", "precio": 6800}], "desc": "Caja de 20 varitas y un porta sahumerios de cerámica con una flor de loto grabada.", "detalle": ["20 varitas", "Porta de cerámica incluido", "Tres aromas"], "tags": "sahumerio sahumerios incienso varitas humo limpieza loto palo santo lavanda"}, {"id": "melts-lunas", "nombre": "Melts aromáticos lunas y estrellas", "cat": "aromas", "rango": 7, "descuento": 10, "int": ["calma", "amor"], "img": "images/melts-lunas.webp", "ancho": 800, "alto": 1000, "alt": "Caja de cartón con melts rosas en forma de luna y estrella con pétalos secos", "galeria": [{"src": "images/melts-lunas-full.webp", "ancho": 1200, "alto": 1200, "alt": "Melts rosas de lunas y estrellas en su caja, con lavanda y salvia"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Caja x 12", "precio": 5900}], "desc": "Pastillas de cera aromática con forma de luna y estrella, con pétalos. Se derriten en el hornito y perfuman sin llama.", "detalle": ["Caja x 12", "Para hornito de melts", "Con pétalos secos"], "tags": "melts cera aromatica hornito lunas estrellas perfume"}, {"id": "torre-selenita", "nombre": "Torre de selenita con plato", "cat": "cristales", "rango": 8, "int": ["limpieza", "claridad"], "img": "images/torre-selenita.webp", "ancho": 800, "alto": 1000, "alt": "Torre de selenita blanca sobre un plato de cerámica verde salvia", "galeria": [{"src": "images/torre-selenita-full.webp", "ancho": 1200, "alto": 1200, "alt": "Torre de selenita con salvia, lavanda y cuarzo rosa"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Unidad", "precio": 9800}], "desc": "Torre de selenita sobre plato de cerámica. Se usa para limpiar la energía del espacio y de otras piedras.", "detalle": ["Aprox. 10 cm de alto", "Plato de cerámica incluido", "No se moja: se limpia en seco"], "tags": "selenita torre cristal limpieza blanca plato"}, {"id": "saquito-lavanda", "nombre": "Saquito de lavanda con cuarzo", "cat": "aromas", "rango": 9, "int": ["calma", "limpieza"], "img": "images/saquito-lavanda.webp", "ancho": 800, "alto": 1000, "alt": "Saquito de lino lila con lavanda seca y un cuarzo cristal", "galeria": [{"src": "images/saquito-lavanda-full.webp", "ancho": 1200, "alto": 1200, "alt": "Saquito de lavanda sobre lino, con flores sueltas y salvia"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Unidad", "precio": 4200}], "desc": "Saquito de lino con lavanda seca y un cuarzo cristal. Para el cajón, la almohada o la cartera.", "detalle": ["Lino lila con cordón", "Lavanda seca", "Incluye un cuarzo cristal"], "tags": "saquito bolsita lavanda lino cuarzo cristal almohada aroma"}, {"id": "cuarzos-rodados", "nombre": "Cuarzos rosa rodados x 5", "cat": "cristales", "rango": 10, "int": ["amor", "calma"], "img": "images/cuarzos-rodados.webp", "ancho": 720, "alto": 900, "alt": "Cinco cuarzos rosa pulidos sobre fondo rosa", "galeria": [{"src": "images/cuarzo-rosa-full.webp", "ancho": 1200, "alto": 1200, "alt": "Cuarzos rosa rodados junto a una drusa en bruto"}], "varLabel": "", "vars": [{"id": "u", "nombre": "Bolsita x 5", "precio": 4800}], "desc": "Cinco piedras pulidas para llevar encima, armar una grilla o dejar en el altar.", "detalle": ["5 piedras de 2 a 3 cm", "Pulidas a mano", "Vienen en bolsita"], "tags": "cuarzo rosa rodados rolados pulidos piedras amor bolsita"}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conDesc = (p, n) => (p && p.descuento > 0 ? Math.round(n * (1 - p.descuento / 100)) : n);
const varDe = (p, v) => (p?.vars || []).find(x => x.id === v) || p?.vars?.[0] || null;
const precioDe = (p, v) => conDesc(p, varDe(p, v)?.precio || 0);
const precioBase = p => conDesc(p, Math.min(...p.vars.map(v => v.precio)));
const hayRango = p => new Set(p.vars.map(v => v.precio)).size > 1;
const enRango = (n, r) => !r || ((r.min == null || n >= r.min) && (r.max == null || n <= r.max));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p && p.visible !== false && Array.isArray(p.vars) && p.vars.length);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, (p.detalle || []).join(' '), p.tags || '', nombreDe(CATEGORIAS, p.cat),
    ...(p.int || []).map(i => nombreDe(INTENCIONES, i)), ...p.vars.map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), int = lista(f.int), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (int.length && !int.some(i => (p.int || []).includes(i))) return false;
    if (precio.length && !precio.some(id => enRango(precioBase(p), PRECIOS.find(x => x.id === id)))) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioBase(a) - precioBase(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioBase(b) - precioBase(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const candidatos = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = candidatos.findIndex(p => p.id === cursor);
      i = k < 0 ? candidatos.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q || !String(q).trim()) {
      items.push(...candidatos.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < candidatos.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < candidatos.length && items.length < lim) {
      const tanda = candidatos.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < candidatos.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearCarrito(store, KEY) {
  const avisar = () => { if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated')); };
  const leer = () => {
    try { const v = JSON.parse(store.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (err) { return []; }
  };
  const limpio = items => items
    .filter(i => { const p = i && Tienda.obtener(i.id); return p && p.vars.some(x => x.id === i.v) && Number(i.qty) >= 1; })
    .map(i => ({ id: i.id, v: i.v, qty: Math.min(Math.floor(Number(i.qty)), 99) }));
  const api = {
    KEY,
    get() { return limpio(leer()); },
    save(items) { try { store.setItem(KEY, JSON.stringify(items)); } catch (err) { } avisar(); },
    add(id, v, qty = 1) {
      const p = Tienda.obtener(id);
      if (!p) return false;
      const vid = varDe(p, v).id;
      const n = Math.max(1, Math.floor(Number(qty) || 1));
      const items = api.get();
      const ex = items.find(i => i.id === id && i.v === vid);
      if (ex) ex.qty = Math.min(ex.qty + n, 99); else items.push({ id, v: vid, qty: Math.min(n, 99) });
      api.save(items);
      return true;
    },
    setQty(id, v, qty) {
      const items = api.get();
      const it = items.find(i => i.id === id && i.v === v);
      if (!it) return;
      it.qty = Math.max(1, Math.min(Math.floor(Number(qty) || 1), 99));
      api.save(items);
    },
    remove(id, v) { api.save(api.get().filter(i => !(i.id === id && i.v === v))); },
    clear() { api.save([]); },
    count() { return api.get().reduce((s, i) => s + i.qty, 0); },
    lineas() {
      return api.get().map(i => {
        const p = Tienda.obtener(i.id);
        const vv = varDe(p, i.v);
        return { p, v: vv, qty: i.qty, subtotal: precioDe(p, vv.id) * i.qty };
      });
    },
    total() { return api.lineas().reduce((s, l) => s + l.subtotal, 0); },
  };
  return api;
}

const memoria = { datos: {}, getItem(k) { return k in this.datos ? this.datos[k] : null; }, setItem(k, v) { this.datos[k] = String(v); } };
let almacen = memoria;
try { localStorage.setItem('magadeluz_prueba', '1'); localStorage.removeItem('magadeluz_prueba'); almacen = localStorage; } catch (err) { almacen = memoria; }
const Cart = crearCarrito(almacen, 'magadeluz_cart');

function mensajePedido(lineas) {
  if (!lineas.length) return 'Hola Maga, quiero hacer un pedido de la tienda.';
  const total = lineas.reduce((s, l) => s + l.subtotal, 0);
  return [
    'Hola Maga, quiero hacer este pedido de la tienda:',
    ...lineas.map(l => `• ${l.qty} × ${l.p.nombre}${l.p.vars.length > 1 ? ` (${l.v.nombre})` : ''}: ${formatearPrecio(l.subtotal)}`),
    `Total: ${formatearPrecio(total)}`,
  ].join('\n');
}
const waUrl = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const TRILUNA = '<span class="triluna" aria-hidden="true"><i></i><i></i><i></i></span>';
const ICO_X = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const A_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const romano = n => { let r = ''; for (const [v, s] of [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]) while (n >= v) { r += s; n -= v; } return r; };

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

const abiertos = new Set();
function bloquear(id, on) {
  if (on) abiertos.add(id); else abiertos.delete(id);
  document.body.classList.toggle('no-scroll', abiertos.size > 0);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab' || !cont) return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(x => x.getClientRects().length);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === primero || !cont.contains(document.activeElement))) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function precioCard(p) {
  const base = precioBase(p);
  const desde = hayRango(p) ? '<span class="desde">Desde</span> ' : '';
  const orig = p.descuento > 0 ? `<s>${formatearPrecio(Math.min(...p.vars.map(v => v.precio)))}</s>` : '';
  return `${desde}<strong>${formatearPrecio(base)}</strong>${orig}`;
}
function precioVar(p, v) {
  const vv = varDe(p, v);
  return `<strong>${formatearPrecio(precioDe(p, vv.id))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(vv.precio)}</s>` : ''}`;
}
const stepperHTML = () => '<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>';
function coloresHTML(p) {
  if (!p.vars.some(v => v.hex)) return '';
  return `<p class="pc__colores" aria-label="${p.vars.length} colores">${p.vars.map(v => `<i style="background:${v.hex}"></i>`).join('')}<span>${p.vars.length} colores</span></p>`;
}

function cardHTML(p, anim = true) {
  const v0 = p.vars[0].id;
  const anima = anim ? A_SUBIR : '';
  const badge = p.descuento > 0 ? `<span class="badge-desc">-${p.descuento}%</span>` : '';
  const foto = `<button type="button" class="pc__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}">${badge}</button>`;
  const info = `<h3 class="pc__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pc__precio">${precioCard(p)}</p>
      ${coloresHTML(p)}
      <div class="prod-actions">${stepperHTML()}<button type="button" class="btn btn-cta prod-add" data-add aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button></div>
      <button type="button" class="pc__ahora" data-comprar>Comprar ahora</button>`;
  if (MODELO === '2') {
    return `<article class="pc tcard" ${anima} data-id="${p.id}" data-v="${v0}"><span class="tcard__num" aria-hidden="true">${romano(p.rango)}</span>${foto}<div class="pc__info">${info}</div></article>`;
  }
  return `<article class="pc pcard" ${anima} data-id="${p.id}" data-v="${v0}">${foto}<div class="pc__info"><span class="pcard__luna">${TRILUNA}</span>${info}</div></article>`;
}

function initDestacados() {
  document.querySelectorAll('[data-destacados]').forEach(cont => {
    const n = parseInt(cont.dataset.destacados, 10) || 6;
    const { items } = Tienda.consultar({ limite: n });
    cont.innerHTML = items.map(p => cardHTML(p)).join('');
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function lineaHTML(l) {
  const variante = l.p.vars.length > 1 ? `<p class="linea__var">${esc(l.p.varLabel)}: ${esc(l.v.nombre)}</p>` : '';
  return `<li class="linea" data-lid="${l.p.id}" data-lv="${l.v.id}">
    <img src="${l.p.img}" width="${l.p.ancho}" height="${l.p.alto}" alt="">
    <div><p class="linea__nombre">${esc(l.p.nombre)}</p>${variante}
      <div class="linea__fila"><div class="stepper stepper--sm"><button type="button" data-lq="-1" aria-label="Restar uno">−</button><span>${l.qty}</span><button type="button" data-lq="1" aria-label="Sumar uno">+</button></div><strong>${formatearPrecio(l.subtotal)}</strong></div>
    </div>
    <button type="button" class="linea__x" data-lrm aria-label="Quitar ${esc(l.p.nombre)}">${ICO_X}</button>
  </li>`;
}
function pieHTML(lineas) {
  const total = lineas.reduce((s, l) => s + l.subtotal, 0);
  return `<p class="carrito-total"><span>Total</span><strong>${formatearPrecio(total)}</strong></p>
    <button type="button" class="btn btn-cta btn-block" data-finalizar>Finalizar compra</button>
    <a class="btn btn-ghost btn-block" href="${waUrl(mensajePedido(lineas))}" target="_blank" rel="noopener">Consultar el pedido por WhatsApp</a>`;
}
const vacioHTML = () => `<div class="carrito-vacio">${TRILUNA}<strong>Tu carrito está vacío</strong><p>Sumá una vela, un cristal o un aroma y aparece acá.</p><a class="btn btn-ghost btn-sm" href="${CATALOGO_URL}">Volver a la tienda</a></div>`;

function renderCarritos() {
  const lineas = Cart.lineas();
  const dl = document.getElementById('drawerLineas');
  const dp = document.getElementById('drawerPie');
  if (dl) dl.innerHTML = lineas.length ? `<ul>${lineas.map(lineaHTML).join('')}</ul>` : vacioHTML();
  if (dp) { dp.innerHTML = lineas.length ? pieHTML(lineas) : ''; dp.hidden = !lineas.length; }
  document.querySelectorAll('[data-panel-lineas]').forEach(el => {
    el.innerHTML = lineas.length ? `<ul>${lineas.map(lineaHTML).join('')}</ul>` : `<div class="carrito-vacio"><strong>Todavía no sumaste nada</strong><p>Tocá «Agregar» en una vela, un cristal o un aroma.</p></div>`;
  });
  document.querySelectorAll('[data-panel-pie]').forEach(el => { el.innerHTML = lineas.length ? pieHTML(lineas) : ''; el.hidden = !lineas.length; });
}

function cantidadDe(cont) {
  const inp = cont?.querySelector('.stepper input');
  return Math.max(1, Math.min(99, parseInt(inp?.value, 10) || 1));
}
function agregar(id, v, qty, origen) {
  if (!Cart.add(id, v, qty)) return false;
  const p = Tienda.obtener(id);
  const vv = varDe(p, v);
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${p.vars.length > 1 ? ' · ' + vv.nombre : ''}`);
  if (origen) { origen.classList.remove('ok'); void origen.offsetWidth; origen.classList.add('ok'); }
  return true;
}

let focoDrawer = null;
function abrirDrawer(origen) {
  const d = document.getElementById('drawer');
  if (!d) return;
  cerrarQV(false);
  focoDrawer = origen || document.activeElement;
  renderCarritos();
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('open');
  bloquear('drawer', true);
  d.querySelector('.drawer__panel')?.focus();
}
function cerrarDrawer(devolver = true) {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  bloquear('drawer', false);
  setTimeout(() => { if (!d.classList.contains('open')) d.hidden = true; }, 380);
  if (devolver) focoDrawer?.focus?.();
}

let focoQV = null;
function qvHTML(p) {
  const fotos = [{ src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])];
  const v0 = p.vars[0];
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, limite: 3 }).items;
  const relFinal = rel.length ? rel : Tienda.consultar({ filtros: { excluir: p.id }, limite: 2 }).items;
  const catN = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const thumbs = fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-foto="${i}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1}"><img src="${f.src}" width="${f.ancho}" height="${f.alto}" alt=""></button>`).join('')}</div>` : '';
  const vars = p.vars.length > 1 ? `<div class="qv__vars"><p class="qv__label">${esc(p.varLabel)}</p><div class="var-chips" role="group" aria-label="${esc(p.varLabel)}">${p.vars.map((v, i) => `<button type="button" class="var-chip" data-swatch="${v.id}" aria-pressed="${i === 0}"${v.hex ? ` style="--c:${v.hex}"` : ''}>${v.hex ? '<span class="var-chip__dot" aria-hidden="true"></span>' : ''}${esc(v.nombre)}</button>`).join('')}</div></div>` : '';
  const ints = (p.int || []).map(i => INTENCIONES.find(x => x.id === i)).filter(Boolean);
  return `<div class="qv__grid" data-id="${p.id}" data-v="${v0.id}" data-fotos='${esc(JSON.stringify(fotos))}'>
    <div class="qv__galeria">
      <div class="qv__main"><img id="qvMain" src="${fotos[0].src}" width="${fotos[0].ancho}" height="${fotos[0].alto}" alt="${esc(fotos[0].alt)}"></div>
      ${thumbs}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(catN)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio" data-precio>${precioVar(p, v0.id)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${vars}
      <div class="qv__acc">${stepperHTML()}<button type="button" class="btn btn-cta" data-add>Agregar al carrito</button></div>
      <button type="button" class="btn btn-ghost btn-block" data-comprar>Comprar ahora</button>
      <ul class="qv__detalle">${(p.detalle || []).map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      ${ints.length ? `<p class="qv__ints">Para: ${ints.map(i => `<a href="${CATALOGO_URL}?int=${i.id}">${esc(i.corto)}</a>`).join(' · ')}</p>` : ''}
      ${relFinal.length ? `<div class="qv__rel"><p class="qv__label">También te puede interesar</p><ul>${relFinal.map(r => `<li><button type="button" class="mini-prod" data-quick="${r.id}"><img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioBase(r))}</strong></button></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>`;
}
function inyectarLD(p) {
  document.getElementById('ldProducto')?.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ldProducto';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: CATEGORIAS.find(c => c.id === p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioBase(p), availability: 'https://schema.org/InStock' },
  });
  document.head.appendChild(s);
}
function abrirQV(id, origen) {
  const p = Tienda.obtener(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  const yaAbierto = !qv.hidden;
  if (!yaAbierto) focoQV = origen || document.activeElement;
  document.getElementById('qvCuerpo').innerHTML = qvHTML(p);
  inyectarLD(p);
  if (!yaAbierto) {
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('open');
    bloquear('qv', true);
  }
  const panel = qv.querySelector('.qv__panel');
  panel.scrollTop = 0;
  panel.focus();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    history.replaceState(null, '', u.pathname + u.search);
  }
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  bloquear('qv', false);
  setTimeout(() => { if (!qv.classList.contains('open')) qv.hidden = true; }, 380);
  document.getElementById('ldProducto')?.remove();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    history.replaceState(null, '', u.pathname + u.search);
  }
  if (devolver) focoQV?.focus?.();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const q = t.closest('[data-quick]');
    if (q) { abrirQV(q.dataset.quick, q); return; }
    const foto = t.closest('[data-foto]');
    if (foto) {
      const grid = foto.closest('.qv__grid');
      const fotos = JSON.parse(grid?.dataset.fotos || '[]');
      const f = fotos[+foto.dataset.foto];
      const main = document.getElementById('qvMain');
      if (f && main) { main.src = f.src; main.width = f.ancho; main.height = f.alto; main.alt = f.alt || ''; }
      grid.querySelectorAll('[data-foto]').forEach(b => b.setAttribute('aria-pressed', b === foto ? 'true' : 'false'));
      return;
    }
    const sw = t.closest('[data-swatch]');
    if (sw) {
      const cont = sw.closest('[data-id]');
      cont.dataset.v = sw.dataset.swatch;
      cont.querySelectorAll('[data-swatch]').forEach(b => b.setAttribute('aria-pressed', b === sw ? 'true' : 'false'));
      const pr = cont.querySelector('[data-precio]');
      if (pr) pr.innerHTML = precioVar(Tienda.obtener(cont.dataset.id), sw.dataset.swatch);
      return;
    }
    const st = t.closest('[data-step]');
    if (st) {
      const inp = st.parentElement.querySelector('input');
      inp.value = Math.max(1, Math.min(99, (parseInt(inp.value, 10) || 1) + Number(st.dataset.step)));
      return;
    }
    const add = t.closest('[data-add]');
    if (add) {
      const cont = add.closest('[data-id]');
      agregar(cont.dataset.id, cont.dataset.v, cantidadDe(cont), add);
      return;
    }
    const cmp = t.closest('[data-comprar]');
    if (cmp) {
      const cont = cmp.closest('[data-id]');
      if (Cart.add(cont.dataset.id, cont.dataset.v, cantidadDe(cont))) abrirDrawer(cmp);
      return;
    }
    const oc = t.closest('[data-open-cart]');
    if (oc) { abrirDrawer(oc); return; }
    const lq = t.closest('[data-lq]');
    if (lq) {
      const li = lq.closest('[data-lid]');
      const it = Cart.get().find(i => i.id === li.dataset.lid && i.v === li.dataset.lv);
      if (!it) return;
      const n = it.qty + Number(lq.dataset.lq);
      if (n < 1) Cart.remove(it.id, it.v); else Cart.setQty(it.id, it.v, n);
      return;
    }
    const rm = t.closest('[data-lrm]');
    if (rm) { const li = rm.closest('[data-lid]'); Cart.remove(li.dataset.lid, li.dataset.lv); return; }
    if (t.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (t.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (t.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest?.('.stepper input');
    if (inp) inp.value = Math.max(1, Math.min(99, parseInt(inp.value, 10) || 1));
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    const qvAbierto = qv && !qv.hidden && qv.classList.contains('open');
    const dAbierto = d && !d.hidden && d.classList.contains('open');
    if (e.key === 'Escape') {
      if (qvAbierto) { cerrarQV(); return; }
      if (dAbierto) { cerrarDrawer(); return; }
    }
    if (qvAbierto) atraparFoco(qv.querySelector('.qv__panel'), e);
    else if (dAbierto) atraparFoco(d.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { renderCarritos(); updateCartBadge(); });
}

function initGuia() {
  const res = document.getElementById('guiaRes');
  if (!res) return;
  const tiles = [...document.querySelectorAll('.guia-tile')];
  const vela = Tienda.obtener('vela-pilar');
  const pintar = id => {
    const it = INTENCIONES.find(i => i.id === id) || INTENCIONES[0];
    const v = varDe(vela, it.vela);
    const color = it.color.toLowerCase();
    const otros = Tienda.consultar({ filtros: { int: it.id, excluir: 'vela-pilar' }, limite: 2 }).items;
    const msg = `Hola Maga, quiero consultar por un ritual con vela ${color} para ${it.nombre.toLowerCase()}.`;
    res.style.setProperty('--c', it.hex);
    res.innerHTML = `<div class="guia-res__top"><span class="guia-res__vela" aria-hidden="true"></span><div><p class="guia-res__color">Vela ${esc(color)}</p><p class="guia-res__tit">${esc(it.nombre)}</p></div></div>
      <p class="guia-res__txt">${esc(it.texto)}</p>
      <div class="guia-res__acc" data-id="vela-pilar" data-v="${v.id}">
        <button type="button" class="btn btn-cta" data-add>Sumar vela ${esc(color)} · ${formatearPrecio(precioDe(vela, v.id))}</button>
        <a class="btn btn-ghost" href="${waUrl(msg)}" target="_blank" rel="noopener">Consultar un ritual</a>
      </div>
      ${otros.length ? `<div class="guia-res__mas"><p>Para acompañarla</p><ul>${otros.map(o => `<li><button type="button" class="mini-prod" data-quick="${o.id}"><img src="${o.img}" width="${o.ancho}" height="${o.alto}" alt=""><span>${esc(o.nombre)}</span><strong>${formatearPrecio(precioBase(o))}</strong></button></li>`).join('')}</ul><a class="link-flecha" href="${CATALOGO_URL}?int=${it.id}">Ver todo para ${esc(it.corto.toLowerCase())}</a></div>` : ''}
      <p class="guia-res__nota">Guía orientativa: el ritual lo armamos en la consulta.</p>`;
  };
  tiles.forEach(t => t.addEventListener('click', () => {
    tiles.forEach(x => x.setAttribute('aria-pressed', x === t ? 'true' : 'false'));
    pintar(t.dataset.int);
  }));
  pintar((tiles.find(t => t.getAttribute('aria-pressed') === 'true') || tiles[0])?.dataset.int);
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const qInput = document.getElementById('catQ');
  const ordenSel = document.getElementById('catOrden');
  const contador = document.getElementById('catContador');
  const mostrando = document.getElementById('catMostrando');
  const verMas = document.getElementById('catVerMas');
  const vacio = document.getElementById('catVacio');
  const activos = document.getElementById('catActivos');
  const filtros = document.getElementById('filtros');
  const btnFiltros = document.getElementById('btnFiltros');
  const form = document.getElementById('catBuscar');
  const migaCat = document.querySelector('[data-miga-cat]');
  const GRUPOS = { cat: CATEGORIAS, int: INTENCIONES, precio: PRECIOS, oferta: [{ id: '1', nombre: 'Con descuento' }] };
  const params = new URLSearchParams(location.search);
  const estado = { q: '', orden: 'destacados' };
  for (const g of Object.keys(GRUPOS)) {
    const ids = GRUPOS[g].map(x => x.id);
    estado[g] = [...new Set((params.get(g) || '').split(','))].filter(x => ids.includes(x));
  }
  estado.q = (params.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.some(o => o.id === params.get('orden')) ? params.get('orden') : 'destacados';

  const sincronizarUI = () => {
    filtros?.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    if (qInput) qInput.value = estado.q;
    if (ordenSel) ordenSel.value = estado.orden;
  };
  const filtrosBase = () => ({ cat: estado.cat, int: estado.int, precio: estado.precio, oferta: estado.oferta.length > 0 });
  let cursor = null, mostrados = 0;

  const escribirURL = () => {
    const u = new URLSearchParams();
    for (const g of Object.keys(GRUPOS)) if (estado[g].length) u.set(g, estado[g].join(','));
    if (estado.q) u.set('q', estado.q);
    if (estado.orden !== 'destacados') u.set('orden', estado.orden);
    const s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  };
  const contarFacetas = () => {
    const base = filtrosBase();
    document.querySelectorAll('[data-cuenta]').forEach(el => {
      const [g, id] = el.dataset.cuenta.split(':');
      el.textContent = Tienda.contar({ ...base, [g]: g === 'oferta' ? true : [id] });
    });
  };
  const pintarActivos = () => {
    const chips = [];
    for (const g of Object.keys(GRUPOS)) estado[g].forEach(id => {
      const n = GRUPOS[g].find(x => x.id === id)?.nombre;
      if (n) chips.push(`<button type="button" class="activo" data-quitar="${g}:${id}" aria-label="Quitar filtro ${esc(n)}">${esc(n)}${ICO_X}</button>`);
    });
    if (estado.q) chips.push(`<button type="button" class="activo" data-quitar="q:" aria-label="Quitar la búsqueda">«${esc(estado.q)}»${ICO_X}</button>`);
    activos.innerHTML = chips.join('');
  };
  const marcarNav = () => {
    document.querySelectorAll('[data-cat-link]').forEach(a => {
      if (estado.cat.length === 1 && a.dataset.catLink === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (migaCat) {
      const c = estado.cat.length === 1 ? CATEGORIAS.find(x => x.id === estado.cat[0]) : null;
      migaCat.hidden = !c;
      migaCat.textContent = c ? '/ ' + c.nombre : '';
    }
  };
  const render = reiniciar => {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: { ...filtrosBase(), q: estado.q }, orden: estado.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosBase());
    if (estado.q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'producto' : 'productos'} <small>para «${esc(estado.q)}»</small>`;
    else contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (estado.q ? `Mostrando ${mostrados}${cursor ? ' · hay más' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { escribirURL(); contarFacetas(); pintarActivos(); marcarNav(); render(true); };

  filtros?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    estado[g] = [...filtros.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  form?.addEventListener('submit', e => { e.preventDefault(); estado.q = qInput.value.trim().slice(0, 60); aplicar(); });
  let tq = 0;
  qInput?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = qInput.value.trim().slice(0, 60); aplicar(); }, 260); });
  ordenSel?.addEventListener('change', () => { estado.orden = ordenSel.value; aplicar(); });
  verMas?.addEventListener('click', () => render(false));
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    for (const g of Object.keys(GRUPOS)) estado[g] = [];
    estado.q = '';
    sincronizarUI();
    aplicar();
  }));
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [g, id] = b.dataset.quitar.split(':');
    if (g === 'q') estado.q = ''; else estado[g] = estado[g].filter(x => x !== id);
    sincronizarUI();
    aplicar();
  });
  btnFiltros?.addEventListener('click', () => {
    const ab = !filtros.classList.contains('abierto');
    filtros.classList.toggle('abierto', ab);
    btnFiltros.setAttribute('aria-expanded', String(ab));
    if (ab) filtros.classList.add('in');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  sincronizarUI();
  escribirURL();
  contarFacetas();
  pintarActivos();
  marcarNav();
  render(true);
  if (params.has('q')) setTimeout(() => qInput?.focus({ preventScroll: true }), 200);
}

const PRODUCTO_URL = new URLSearchParams(location.search).get('producto');
function abrirProductoURL() {
  if (PAGINA !== 'catalogo') return;
  if (PRODUCTO_URL && Tienda.obtener(PRODUCTO_URL)) abrirQV(PRODUCTO_URL);
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
    toggle.setAttribute('aria-expanded', 'false'); bloquear('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquear('nav', true);
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

function initNavCats() {
  const btn = document.getElementById('navCatsBtn');
  const panel = document.getElementById('navCatsPanel');
  if (!btn || !panel) return;
  const wrap = btn.parentElement;
  const desk = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('abierto'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('abierto'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (desk.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (desk.matches) t = setTimeout(cerrar, 140); });
  wrap.addEventListener('focusout', e => { if (desk.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desk.matches && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && desk.matches) { cerrar(); btn.focus(); } });
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
  cart?.addEventListener('click', () => abrirDrawer(cart));
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, stagger: 0.1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  const cartas = hero.querySelectorAll('.carta');
  if (cartas.length) {
    tl.from(cartas, { y: 110, opacity: 0, rotation: i => [10, 0, -10][i] || 0, duration: 1.3, stagger: 0.12, clearProps: 'transform,opacity' }, 0.35);
  }
}

initDestacados();
initCatalogo();
initGuia();
initAcciones();
renderCarritos();
updateCartBadge();
initReveals();
initNav();
initNavCats();
initFloats();
initModelBarScroll();
initHeroMotion();
abrirProductoURL();
