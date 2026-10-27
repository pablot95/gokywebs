'use strict';

const WA = '5491152595812';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const TALLES = ['S', 'M', 'L', 'XL', 'XXL'];
const GUIA_TALLES = { S: [50, 69], M: [53, 71], L: [56, 73], XL: [59, 75], XXL: [62, 77] };

const COLORES = [
  { id: 'lavanda', nombre: 'Lavanda', hex: '#B9A6DA', img: 'images/t-lavanda.webp', tinta: 'oscura' },
  { id: 'salvia', nombre: 'Verde salvia', hex: '#8E9F86', img: 'images/t-salvia.webp', tinta: 'oscura' },
  { id: 'rosa', nombre: 'Rosa viejo', hex: '#B57374', img: 'images/t-rosa.webp', tinta: 'oscura' },
  { id: 'crudo', nombre: 'Crudo', hex: '#E3D9C9', img: 'images/t-crudo.webp', tinta: 'oscura' },
  { id: 'terracota', nombre: 'Terracota', hex: '#C25E3F', img: 'images/t-terracota.webp', tinta: 'clara' },
  { id: 'marino', nombre: 'Azul marino', hex: '#26304D', img: 'images/t-marino.webp', tinta: 'clara' },
  { id: 'grafito', nombre: 'Grafito', hex: '#404143', img: 'images/t-grafito.webp', tinta: 'clara' },
  { id: 'negro', nombre: 'Negro', hex: '#18181A', img: 'images/t-negro.webp', tinta: 'clara' },
];

const CAPSULAS = [
  { id: 'pausa', n: '01', nombre: 'Pausa', lema: 'Frases para bajar un cambio', portada: 'hoy-elijo-la-calma', color: 'lavanda' },
  { id: 'impulso', n: '02', nombre: 'Impulso', lema: 'Frases para arrancar', portada: 'lo-intento-igual', color: 'terracota' },
  { id: 'noche', n: '03', nombre: 'Noche', lema: 'Frases con un poco de ironía', portada: 'ni-ahi-con-el-lunes', color: 'grafito' },
];

const PROMOS = {
  combo: { min: 3, pct: 15 },
  cupones: { VYORA10: { pct: 10, texto: '10% en tu primera compra' } },
};

const ORDENES = {
  destacados: 'Más elegidas',
  nuevas: 'Nuevas primero',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Frase (A-Z)',
};

const st = (...n) => Object.fromEntries(TALLES.map((t, i) => [t, n[i] ?? 0]));

const PRODUCTOS = [
  { id: 'hoy-elijo-la-calma', frase: 'Hoy elijo la calma', cat: 'pausa', colores: ['lavanda', 'salvia', 'crudo'], lineas: ['HOY ELIJO', 'LA CALMA'], estilo: 'bloque', acento: 1, precio: 27900, descuento: 0, destacado: 1, stock: st(6, 9, 8, 4, 2), desc: 'Para los días que vienen cargados: una frase corta que se lee de lejos y te recuerda bajar un cambio.' },
  { id: 'lo-intento-igual', frase: 'Lo intento igual', cat: 'impulso', colores: ['terracota', 'crudo', 'grafito'], lineas: ['LO INTENTO', 'IGUAL'], estilo: 'bloque', acento: 1, precio: 27900, descuento: 0, destacado: 2, stock: st(5, 8, 8, 5, 3), desc: 'La remera de los que no esperan a tenerlo todo resuelto para empezar.' },
  { id: 'ni-ahi-con-el-lunes', frase: 'Ni ahí con el lunes', cat: 'noche', colores: ['grafito', 'negro', 'marino'], lineas: ['NI AHÍ', 'CON EL LUNES'], estilo: 'bloque', acento: 1, precio: 27900, descuento: 0, destacado: 3, stock: st(4, 9, 7, 5, 2), desc: 'Para arrancar la semana con humor, o para el domingo a la noche cuando ya se siente cerca.' },
  { id: 'despacito-tambien-llego', frase: 'Despacito también llego', cat: 'pausa', colores: ['salvia', 'crudo', 'rosa'], lineas: ['despacito', 'también llego'], estilo: 'suelto', acento: 1, precio: 27900, descuento: 20, destacado: 4, stock: st(3, 5, 4, 2, 0), desc: 'Para los que van a su ritmo y llegan igual. Letra en minúscula, suelta, como la frase.' },
  { id: 'hecho-no-perfecto', frase: 'Hecho, no perfecto', cat: 'impulso', colores: ['terracota', 'marino', 'crudo'], lineas: ['hecho,', 'no perfecto'], estilo: 'suelto', acento: 0, precio: 27900, descuento: 0, destacado: 5, stock: st(5, 7, 7, 4, 2), desc: 'Un recordatorio para soltar el «todavía falta un detalle» y terminar lo que empezaste.' },
  { id: 'modo-avion', frase: 'Modo avión', cat: 'noche', colores: ['negro', 'grafito', 'lavanda'], lineas: ['modo', 'avión'], estilo: 'suelto', acento: 1, precio: 27900, descuento: 0, destacado: 6, stock: st(6, 9, 9, 6, 3), desc: 'Dos palabras para avisar que hoy no atendés. Estampa grande, en minúscula.' },
  { id: 'respira-que-sale', frase: 'Respirá, que sale', cat: 'pausa', colores: ['crudo', 'lavanda', 'marino'], lineas: ['RESPIRÁ,', 'QUE SALE'], estilo: 'bloque', acento: 0, precio: 27900, descuento: 0, destacado: 7, stock: st(4, 7, 6, 3, 2), desc: 'La frase que te dirías antes de una entrevista, un examen o una reunión larga.' },
  { id: 'con-ganas-alcanza', frase: 'Con ganas alcanza', cat: 'impulso', colores: ['terracota', 'lavanda', 'rosa'], lineas: ['con ganas', 'alcanza'], estilo: 'suelto', acento: 1, precio: 27900, descuento: 0, destacado: 8, stock: st(4, 6, 6, 3, 1), desc: 'Para los proyectos que arrancan con poco y empujan igual.' },
  { id: 'modo-domingo', frase: 'Modo domingo', cat: 'pausa', colores: ['rosa', 'lavanda', 'crudo'], lineas: ['modo', 'domingo'], estilo: 'suelto', acento: 1, precio: 27900, descuento: 20, stock: st(2, 4, 3, 2, 0), desc: 'Mate, sillón y nada de alarmas. Una remera para estar en casa o salir sin apuro.' },
  { id: 'menos-ruido-mas-mate', frase: 'Menos ruido, más mate', cat: 'pausa', colores: ['salvia', 'crudo', 'marino'], lineas: ['MENOS RUIDO,', 'MÁS MATE'], estilo: 'bloque', acento: 1, precio: 29900, descuento: 0, stock: st(3, 6, 6, 3, 1), desc: 'Una frase bien de acá, para los que se arreglan con un termo y un rato de silencio.' },
  { id: 'un-dia-a-la-vez', frase: 'Un día a la vez', cat: 'pausa', colores: ['lavanda', 'rosa', 'salvia'], lineas: ['un día', 'a la vez'], estilo: 'comillas', acento: -1, precio: 27900, descuento: 0, stock: st(4, 6, 5, 3, 1), desc: 'Entre comillas, como una cita que te repetís. Estampa chica y centrada.' },
  { id: 'arranco-hoy', frase: 'Arranco hoy', cat: 'impulso', colores: ['marino', 'terracota', 'negro'], lineas: ['ARRANCO', 'HOY'], estilo: 'bloque', acento: 1, precio: 27900, descuento: 0, nuevo: true, stock: st(5, 8, 8, 5, 2), desc: 'Nada de «el lunes empiezo»: la frase para el primer día de lo que sea.' },
  { id: 'todavia-no-termine', frase: 'Todavía no terminé', cat: 'impulso', colores: ['terracota', 'crudo', 'salvia'], lineas: ['todavía', 'no terminé'], estilo: 'comillas', acento: -1, precio: 29900, descuento: 0, nuevo: true, stock: st(3, 6, 6, 4, 2), desc: 'Para los que siempre tienen una vuelta más. Entre comillas, como quien avisa.' },
  { id: 'paso-chico-paso-firme', frase: 'Paso chico, paso firme', cat: 'impulso', colores: ['marino', 'salvia', 'grafito'], lineas: ['PASO CHICO,', 'PASO FIRME'], estilo: 'bloque', acento: 1, precio: 27900, descuento: 15, stock: st(2, 5, 4, 2, 1), desc: 'De a poco y sin aflojar. Estampa en dos líneas parejas, bien de frente.' },
  { id: 'pensandolo-bien-no', frase: 'Pensándolo bien, no', cat: 'noche', colores: ['grafito', 'crudo', 'negro'], lineas: ['pensándolo bien,', 'no.'], estilo: 'suelto', acento: 1, precio: 29900, descuento: 0, nuevo: true, stock: st(4, 7, 7, 4, 2), desc: 'La respuesta para los planes de último momento. Con punto final, por las dudas.' },
  { id: 'llegue-tarde-con-estilo', frase: 'Llegué tarde con estilo', cat: 'noche', colores: ['negro', 'terracota', 'marino'], lineas: ['LLEGUÉ TARDE', 'CON ESTILO'], estilo: 'bloque', acento: 1, precio: 29900, descuento: 0, stock: st(3, 6, 5, 3, 1), desc: 'Si vas a llegar tarde, que por lo menos se note la remera.' },
  { id: 'cinco-minutitos-mas', frase: 'Cinco minutitos más', cat: 'noche', colores: ['grafito', 'lavanda', 'rosa'], lineas: ['cinco', 'minutitos más'], estilo: 'comillas', acento: -1, precio: 27900, descuento: 15, stock: st(3, 4, 4, 2, 0), desc: 'La frase de todas las alarmas. Para dormir con ella o para salir igual de dormido.' },
  { id: 'hoy-no-manana-tampoco', frase: 'Hoy no, mañana tampoco', cat: 'noche', colores: ['negro', 'grafito'], lineas: ['HOY NO,', 'MAÑANA', 'TAMPOCO'], estilo: 'bloque', acento: 2, precio: 27900, descuento: 0, stock: st(4, 6, 6, 4, 2), desc: 'Tres líneas, de arriba abajo, para decir que no con una sonrisa.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100) / 100) * 100 : p.precio);
const stockTotal = p => TALLES.reduce((s, t) => s + (p.stock[t] || 0), 0);
const capDe = id => CAPSULAS.find(c => c.id === id);
const colorDe = id => COLORES.find(c => c.id === id);
const nombreCap = c => (c ? `Cápsula ${c.n} · ${c.nombre}` : '');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function calcularPromo(subtotal, unidades, cupon = '') {
  const opciones = [];
  if (unidades >= PROMOS.combo.min) opciones.push({ id: 'combo', pct: PROMOS.combo.pct, texto: `Combo x${PROMOS.combo.min} · ${PROMOS.combo.pct}% off` });
  const codigo = String(cupon || '').trim().toUpperCase();
  const cup = PROMOS.cupones[codigo];
  if (cup) opciones.push({ id: 'cupon', pct: cup.pct, texto: `Cupón ${codigo} · ${cup.pct}% off` });
  const mejor = opciones.reduce((m, o) => (!m || o.pct > m.pct ? o : m), null);
  const descuento = mejor && subtotal > 0 ? Math.round(subtotal * mejor.pct / 100) : 0;
  return { mejor, opciones, descuento, total: subtotal - descuento, faltanCombo: Math.max(0, PROMOS.combo.min - unidades) };
}

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !p.colores.some(c => color.includes(c))) return false;
    if (talle.length && !talle.some(t => (p.stock[t] || 0) > 0)) return false;
    if (f.promo && !(p.descuento > 0)) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.destacado && !p.destacado) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.frase.localeCompare(b.frase, 'es') || desempate(a, b);
      case 'nuevas': return (a, b) => Number(!!b.nuevo) - Number(!!a.nuevo) || Number(b.descuento > 0) - Number(a.descuento > 0) || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || Number(!!b.nuevo) - Number(!!a.nuevo) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    const c = capDe(p.cat);
    textoBusqueda.set(p.id, norm([
      'remera', p.frase, c?.nombre, c?.lema, `capsula ${c?.n}`, p.desc,
      ...p.colores.map(id => colorDe(id)?.nombre),
      p.nuevo ? 'nueva novedad' : '', p.descuento > 0 ? 'promo oferta descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: TOPE_CONSULTA });

const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) {
    const p = Tienda.obtener(id);
    if (p) cacheProductos.set(id, p);
  }
  return cacheProductos.get(id) || null;
};

const Promos = {
  KEY: 'vyora_cupon',
  cupon() { try { return localStorage.getItem(this.KEY) || ''; } catch { return ''; } },
  guardar(c) {
    try { if (c) localStorage.setItem(this.KEY, c); else localStorage.removeItem(this.KEY); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
};

const Cart = {
  KEY: 'vyora_cart',
  clave: (id, color, talle) => `${id}|${color}|${talle}`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, { color, talle } = {}) {
    if (!TALLES.includes(talle)) return false;
    const tope = producto.stock[talle] || 0;
    if (tope <= 0) return false;
    const c = producto.colores.includes(color) ? color : producto.colores[0];
    const items = this.get();
    const k = this.clave(producto.id, c, talle);
    const existing = items.find(i => this.clave(i.id, i.color, i.talle) === k);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, color: c, talle, qty: Math.min(qty, tope) });
    this.save(items);
    return true;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i.id, i.color, i.talle) === k);
    if (!it) return;
    const p = getProducto(it.id);
    const tope = p ? p.stock[it.talle] || 1 : 99;
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i.id, i.color, i.talle) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      return { ...i, clave: this.clave(i.id, i.color, i.talle), producto: p, colorObj: colorDe(i.color), unitario: precioFinal(p) };
    }).filter(Boolean);
  },
  subtotal() { return this.lineas().reduce((s, l) => s + l.unitario * l.qty, 0); },
  resumen() { const sub = this.subtotal(); return { subtotal: sub, ...calcularPromo(sub, this.count(), Promos.cupon()) }; },
};

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const urlProducto = id => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  remera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6l5 3-2 4-2-1v11H8V9L6 10 4 6z"/><path d="M9 3a3 3 0 0 0 6 0"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function estampaHTML(p, colorId) {
  const c = colorDe(colorId) || colorDe(p.colores[0]);
  const largo = Math.max(...p.lineas.map(l => l.length)) + (p.estilo === 'comillas' ? 1.5 : 0);
  const ratio = { bloque: 0.6, suelto: 0.54, comillas: 0.48 }[p.estilo] || 0.55;
  const k = Math.min(p.estilo === 'bloque' ? 0.26 : 0.19, 1 / (largo * ratio));
  return `<span class="estampa estampa--${p.estilo} estampa--${c.tinta}" style="--k:${k.toFixed(3)}" aria-hidden="true">${p.lineas.map((l, i) => `<span class="estampa-l${i === p.acento ? ' estampa-ac' : ''}">${esc(l)}</span>`).join('')}</span>`;
}

function teeHTML(p, colorId, clase = '') {
  const c = colorDe(p.colores.includes(colorId) ? colorId : p.colores[0]);
  return `<span class="tee tee--${c.id}${clase ? ` ${clase}` : ''}" data-tee="${c.id}"><img src="${c.img}" alt="Remera ${esc(c.nombre.toLowerCase())} con la frase «${esc(p.frase)}»" width="1000" height="1000" decoding="async">${estampaHTML(p, c.id)}</span>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nueva</span>');
  if (stockTotal(p) > 0 && stockTotal(p) <= 14) b.push('<span class="badge badge--ultimas">Últimas</span>');
  return b.length ? `<div class="prod-badges">${b.join('')}</div>` : '';
}

function precioHTML(p) {
  return `<p class="prod-precio"><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}

function swatchesHTML(p, activo, completo) {
  if (!completo) return `<p class="prod-colores prod-colores--dots">${p.colores.map(id => `<span class="sw-dot" style="--sw:${colorDe(id).hex}"></span>`).join('')}<span class="sr-only">${p.colores.length} colores</span></p>`;
  return `<div class="prod-colores" role="group" aria-label="Colores de «${esc(p.frase)}»">${p.colores.map(id => { const c = colorDe(id); return `<button type="button" class="sw" data-card-color="${id}" style="--sw:${c.hex}" aria-label="Ver en ${esc(c.nombre.toLowerCase())}" aria-pressed="${id === activo}"></button>`; }).join('')}</div>`;
}

function cardHTML(p, { animar = true, completo = false } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const color = p.colores[0];
  return `<article class="prod" data-id="${esc(p.id)}" data-color="${color}"${anim}>
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver la remera «${esc(p.frase)}»">${teeHTML(p, color)}</a>
      ${badgesHTML(p)}
      ${completo ? `<div class="prod-rapido" role="group" aria-label="Agregar rápido por talle">${TALLES.map(t => `<button type="button" data-rapido="${t}"${(p.stock[t] || 0) > 0 ? '' : ' disabled'} aria-label="Agregar talle ${t}">${t}</button>`).join('')}</div>` : ''}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${esc(nombreCap(capDe(p.cat)))}</p>
      <h3 class="prod-nombre">«${esc(p.frase)}»</h3>
      ${precioHTML(p)}
      ${swatchesHTML(p, color, completo)}
      <div class="prod-actions">
        <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Elegir talle de «${esc(p.frase)}»">${ICONOS.remera}<span>Elegir talle</span></button>
      </div>
    </div>
  </article>`;
}

function tileHTML(p, i) {
  return `<li class="tile${i === 0 ? ' tile--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <a class="tile-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver la remera «${esc(p.frase)}»">${teeHTML(p, p.colores[0])}</a>
    ${badgesHTML(p)}
    <div class="tile-info">
      <h3 class="tile-nombre">«${esc(p.frase)}»</h3>
      ${precioHTML(p)}
    </div>
    <button type="button" class="tile-add" data-add="${esc(p.id)}" aria-label="Elegir talle de «${esc(p.frase)}»">${ICONOS.mas}</button>
  </li>`;
}

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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats-btn');
  const panel = cont.querySelector('.nav-cats-panel');
  const lista = cont.querySelector('[data-menu-cats]');
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CAPSULAS.map(c => {
    const p = getProducto(c.portada);
    return `<li><a href="${paginaCatalogo()}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}>${p ? teeHTML(p, c.color, 'tee--mini') : ''}<span><strong>Cápsula ${c.n} · ${esc(c.nombre)}</strong><small>${esc(c.lema)} · ${Tienda.contar({ cat: c.id })} frases</small></span></a></li>`;
  }).join('');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (hover.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (hover.matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (hover.matches && !cont.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  $$('[data-cuenta-cat]').forEach(el => { const n = Tienda.contar({ cat: el.dataset.cuentaCat }); el.textContent = `${n} ${n === 1 ? 'frase' : 'frases'}`; });
  $$('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar(); });
  $$('[data-cuenta-promo]').forEach(el => { el.textContent = Tienda.contar({ promo: true }); });
}

function updateCartBadge() {
  const n = Cart.count();
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
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

let abrirCarrito = () => {};
let abrirVista = () => {};

function bloquear(on) {
  document.body.classList.toggle('no-scroll', on);
}

function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
      <header class="drawer-head">
        <h2>Tu carrito <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <form class="cupon" data-cupon-form>
          <label class="sr-only" for="cupon-input">Cupón de descuento</label>
          <input id="cupon-input" type="text" placeholder="¿Tenés un cupón?" autocomplete="off" maxlength="20" aria-describedby="cupon-msg">
          <button type="submit" class="btn btn--line">Aplicar</button>
        </form>
        <p class="cupon-msg" id="cupon-msg" data-cupon-msg></p>
        <dl class="drawer-cuentas">
          <div><dt>Subtotal</dt><dd data-drawer-sub>$0</dd></div>
          <div class="drawer-promo" data-drawer-promo hidden><dt data-drawer-promo-t></dt><dd data-drawer-promo-v></dd></div>
          <div class="drawer-total"><dt>Total</dt><dd data-drawer-total>$0</dd></div>
        </dl>
        <p class="drawer-pista" data-drawer-pista></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--line btn--block" data-pedido-wsp href="${waLink('¡Hola Vyora! Quiero hacer un pedido.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
      </footer>
    </aside>`);
  const drawer = $('#drawer');
  const bd = $('#drawer-bd');
  const body = $('[data-drawer-body]', drawer);
  const foot = $('[data-drawer-foot]', drawer);
  const cuponForm = $('[data-cupon-form]', drawer);
  const cuponInput = $('#cupon-input', drawer);
  const cuponMsg = $('[data-cupon-msg]', drawer);
  let opener = null;
  let timer = 0;

  const pintar = () => {
    const lineas = Cart.lineas();
    $('[data-drawer-cuenta]', drawer).textContent = lineas.length ? `(${Cart.count()})` : '';
    foot.hidden = !lineas.length;
    if (!lineas.length) {
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.remera}<p><strong>Tu carrito está vacío.</strong> Todavía no elegiste frase: hay ${Tienda.contar()} esperándote en tres cápsulas.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver a la tienda</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        ${teeHTML(l.producto, l.color, 'tee--linea')}
        <div class="linea-info">
          <p class="linea-nombre">«${esc(l.producto.frase)}»</p>
          <p class="linea-var">${esc(l.colorObj?.nombre)} · Talle ${esc(l.talle)}</p>
          <div class="linea-acciones">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-paso="-1" aria-label="Restar uno"${l.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
              <output aria-label="Cantidad">${l.qty}</output>
              <button type="button" data-linea-paso="1" aria-label="Sumar uno"${l.qty >= (l.producto.stock[l.talle] || 1) ? ' disabled' : ''}>${ICONOS.mas}</button>
            </div>
            <button type="button" class="linea-quitar" data-linea-quitar aria-label="Quitar «${esc(l.producto.frase)}»">${ICONOS.basura}</button>
          </div>
        </div>
        <p class="linea-precio">${formatearPrecio(l.unitario * l.qty)}</p>
      </li>`).join('')}</ul>`;
    const r = Cart.resumen();
    $('[data-drawer-sub]', drawer).textContent = formatearPrecio(r.subtotal);
    const promo = $('[data-drawer-promo]', drawer);
    promo.hidden = !r.mejor;
    if (r.mejor) {
      $('[data-drawer-promo-t]', drawer).textContent = r.mejor.texto;
      $('[data-drawer-promo-v]', drawer).textContent = `−${formatearPrecio(r.descuento)}`;
    }
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(r.total);
    const cupon = Promos.cupon();
    if (document.activeElement !== cuponInput) cuponInput.value = cupon;
    const pista = $('[data-drawer-pista]', drawer);
    if (r.faltanCombo > 0) pista.textContent = `Sumá ${r.faltanCombo} ${r.faltanCombo === 1 ? 'remera más' : 'remeras más'} y se aplica el combo x${PROMOS.combo.min} (${PROMOS.combo.pct}% off).`;
    else if (r.opciones.length > 1) pista.textContent = 'Las promos no se suman: se aplica la que más te conviene.';
    else pista.textContent = '';
    const texto = ['¡Hola Vyora! Quiero hacer este pedido:', ...lineas.map(l => `• ${l.qty} x Remera «${l.producto.frase}» (${l.colorObj?.nombre}, talle ${l.talle}) ${formatearPrecio(l.unitario * l.qty)}`),
      r.mejor ? `Promo: ${r.mejor.texto} (−${formatearPrecio(r.descuento)})` : '', `Total: ${formatearPrecio(r.total)}`].filter(Boolean).join('\n');
    $('[data-pedido-wsp]', drawer).href = waLink(texto);
  };

  const abrir = () => {
    opener = document.activeElement;
    clearTimeout(timer);
    cuponMsg.textContent = '';
    pintar();
    drawer.hidden = false; bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
    drawer.querySelector('.drawer-close').focus();
  };
  const cerrar = () => {
    drawer.classList.remove('open'); bd.classList.remove('open');
    bloquear(false);
    timer = setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
    opener?.focus?.();
  };
  abrirCarrito = abrir;
  bd.addEventListener('click', cerrar);
  drawer.querySelector('.drawer-close').addEventListener('click', cerrar);
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    const li = e.target.closest('.linea');
    if (!li) return;
    const k = li.dataset.clave;
    const it = Cart.get().find(i => Cart.clave(i.id, i.color, i.talle) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  cuponForm.addEventListener('submit', e => {
    e.preventDefault();
    const codigo = cuponInput.value.trim().toUpperCase();
    if (!codigo) { Promos.guardar(''); cuponMsg.textContent = ''; cuponInput.removeAttribute('aria-invalid'); return; }
    if (!PROMOS.cupones[codigo]) {
      cuponInput.setAttribute('aria-invalid', 'true');
      cuponMsg.textContent = `No encontramos el cupón «${codigo}». El de bienvenida es VYORA10.`;
      cuponMsg.classList.add('cupon-msg--error');
      return;
    }
    cuponInput.removeAttribute('aria-invalid');
    cuponMsg.classList.remove('cupon-msg--error');
    Promos.guardar(codigo);
    cuponMsg.textContent = `Cupón ${codigo} guardado: ${PROMOS.cupones[codigo].texto}.`;
  });
  cuponInput.addEventListener('input', () => { cuponInput.removeAttribute('aria-invalid'); cuponMsg.classList.remove('cupon-msg--error'); });
  $('[data-finalizar]', drawer).addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle de la remera">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media" data-qv-media></div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const media = $('[data-qv-media]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const c = colorDe(estado.color);
    const cap = capDe(p.cat);
    const unit = precioFinal(p);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    const stockTalle = estado.talle ? p.stock[estado.talle] || 0 : 0;
    media.innerHTML = `${teeHTML(p, estado.color, 'tee--qv')}<p class="qv-color-sel"><span class="sw-dot" style="--sw:${c.hex}"></span>${esc(c.nombre)}</p>`;
    info.innerHTML = `
      <p class="qv-meta">${esc(nombreCap(cap))}</p>
      <h2 class="qv-nombre">Remera «${esc(p.frase)}»</h2>
      <p class="qv-precio"><strong>${formatearPrecio(unit)}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s> <span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
      <p class="qv-desc">${esc(p.desc)} Remera de cuello redondo con la frase estampada al frente.</p>
      <fieldset class="opciones"><legend>Color <span class="opciones-aviso">· ${esc(c.nombre)}</span></legend><div class="chips chips--color">${p.colores.map(id => { const x = colorDe(id); return `<label class="chip-color" title="${esc(x.nombre)}"><input type="radio" name="qv-color" value="${x.id}"${x.id === estado.color ? ' checked' : ''}><span class="sw-dot" style="--sw:${x.hex}"></span><span class="sr-only">${esc(x.nombre)}</span></label>`; }).join('')}</div></fieldset>
      <fieldset class="opciones" data-grupo="talle"><legend>Talle <span class="opciones-aviso">${estado.talle ? `· ${estado.talle}` : '· elegí uno'}</span></legend><div class="chips chips--talle">${TALLES.map(t => `<label class="chip"><input type="radio" name="qv-talle" value="${t}"${t === estado.talle ? ' checked' : ''}${(p.stock[t] || 0) > 0 ? '' : ' disabled'}><span>${t}</span></label>`).join('')}</div></fieldset>
      <details class="guia">
        <summary>${ICONOS.regla}<span>Guía de talles</span></summary>
        <table><caption class="sr-only">Medidas de la remera por talle, en centímetros</caption><thead><tr><th scope="col">Talle</th><th scope="col">Ancho</th><th scope="col">Largo</th></tr></thead><tbody>${TALLES.map(t => `<tr${t === estado.talle ? ' class="activa"' : ''}><th scope="row">${t}</th><td>${GUIA_TALLES[t][0]} cm</td><td>${GUIA_TALLES[t][1]} cm</td></tr>`).join('')}</tbody></table>
        <p>Ancho de axila a axila, con la remera apoyada. Medidas de muestra.</p>
      </details>
      <p class="qv-stock">${!estado.talle ? 'Elegí tu talle para sumarla al carrito.' : stockTalle <= 3 ? `Quedan ${stockTalle} en talle ${estado.talle}.` : `Hay stock en talle ${estado.talle}.`}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <p class="qv-promo"><strong>Combo x${PROMOS.combo.min}:</strong> llevando ${PROMOS.combo.min} remeras, ${PROMOS.combo.pct}% off en el total.</p>
      ${rel.length ? `<div class="qv-rel"><h3>Más de la cápsula ${esc(cap?.n)}</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}">${teeHTML(r, r.colores[0], 'tee--mini')}<span>«${esc(r.frase)}»</span><strong>${formatearPrecio(precioFinal(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: `Remera «${p.frase}»`, description: p.desc, category: nombreCap(cap), brand: { '@type': 'Brand', name: 'Vyora store' },
      image: new URL(c.img, location.href).href, color: c.nombre,
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: unit, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href },
    });
  };

  const agregar = () => {
    const p = estado.p;
    if (!estado.talle) {
      showToast('Elegí tu talle antes de sumarla.');
      info.querySelector('input[name="qv-talle"]:not(:disabled)')?.focus();
      info.querySelector('[data-grupo="talle"]')?.classList.add('opciones--falta');
      return false;
    }
    if (!Cart.add(p, estado.qty, { color: estado.color, talle: estado.talle })) { showToast('Ese talle se agotó.'); return false; }
    showToast(`«${p.frase}» · ${colorDe(estado.color)?.nombre} · ${estado.talle} al carrito`);
    return true;
  };

  const abrir = (id, { color = null, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    estado = { p, color: p.colores.includes(color) ? color : p.colores[0], talle: null, qty: 1 };
    if (bd.hidden) opener = document.activeElement;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    const objetivo = foco === 'talle' ? info.querySelector('input[name="qv-talle"]:not(:disabled)') : null;
    (objetivo || bd.querySelector('.qv-close')).focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    window.history.replaceState(null, '', url);
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
    opener?.focus?.();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name === 'qv-color') {
      estado.color = e.target.value;
      pintar();
      info.querySelector(`input[name="qv-color"][value="${estado.color}"]`)?.focus();
    }
    if (e.target.name === 'qv-talle') {
      estado.talle = e.target.value;
      estado.qty = Math.min(estado.qty, estado.p.stock[estado.talle] || 1);
      const abierta = info.querySelector('.guia')?.open;
      pintar();
      if (abierta) info.querySelector('.guia').open = true;
      info.querySelector(`input[name="qv-talle"][value="${estado.talle}"]`)?.focus();
    }
  });
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const tope = estado.talle ? estado.p.stock[estado.talle] || 1 : 10;
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), tope));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]')) { if (agregar()) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregar()) { cerrar(); abrirCarrito(); } }
  });
  const inicial = new URLSearchParams(location.search).get('producto');
  if (inicial && getProducto(inicial)) abrir(inicial);
}

function cambiarColorCard(card, colorId) {
  const p = getProducto(card.dataset.id);
  if (!p || !p.colores.includes(colorId)) return;
  card.dataset.color = colorId;
  const tee = card.querySelector('[data-tee]');
  if (tee) tee.outerHTML = teeHTML(p, colorId);
  card.querySelectorAll('[data-card-color]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cardColor === colorId)));
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      e.preventDefault();
      abrirVista(ver.dataset.ver, { color: ver.closest('[data-color]')?.dataset.color });
      return;
    }
    const sw = e.target.closest('[data-card-color]');
    if (sw) { cambiarColorCard(sw.closest('.prod'), sw.dataset.cardColor); return; }
    const rapido = e.target.closest('[data-rapido]');
    if (rapido) {
      const card = rapido.closest('.prod');
      const p = getProducto(card?.dataset.id);
      if (!p) return;
      if (Cart.add(p, 1, { color: card.dataset.color, talle: rapido.dataset.rapido })) {
        showToast(`«${p.frase}» · ${colorDe(card.dataset.color)?.nombre} · ${rapido.dataset.rapido} al carrito`);
        rapido.classList.remove('ok'); void rapido.offsetWidth; rapido.classList.add('ok');
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    abrirVista(add.dataset.add, { color: add.closest('[data-color]')?.dataset.color, foco: 'talle' });
  });
}

function initDestacados() {
  const rail = document.querySelector('[data-grilla="rail"]');
  let enRail = [];
  if (rail) {
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    enRail = items.map(p => p.id);
    rail.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(48px)">${cardHTML(p, { animar: false })}</li>`).join('');
  }
  const previa = document.querySelector('[data-grilla="previa"]');
  if (previa) {
    const { items } = Tienda.consultar({ filtros: { excluir: enRail.length ? enRail : Tienda.consultar({ filtros: { destacado: true }, limite: 8 }).items.map(p => p.id) }, orden: 'nuevas', limite: 8 });
    previa.innerHTML = items.map(p => cardHTML(p)).join('');
  }
}

function initCapsulas() {
  $$('[data-capsula-card]').forEach(card => {
    const c = capDe(card.dataset.capsulaCard);
    const p = c && getProducto(c.portada);
    const slot = card.querySelector('[data-capsula-tee]');
    if (p && slot) slot.innerHTML = teeHTML(p, c.color);
  });
}

function initCapsulasTabs() {
  const cont = document.querySelector('[data-cap-tabs]');
  if (!cont) return;
  const tabs = $$('[role="tab"]', cont);
  const panel = $('[role="tabpanel"]', cont);
  const lista = $('[data-cap-tiles]', cont);
  const titulo = $('[data-cap-titulo]', cont);
  const lema = $('[data-cap-lema]', cont);
  const ver = $('[data-cap-ver]', cont);
  const num = $('[data-cap-num]', cont);
  const elegir = (id, foco = false) => {
    const c = capDe(id);
    if (!c) return;
    tabs.forEach(t => {
      const on = t.dataset.cap === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', t.id); if (foco) t.focus(); }
    });
    num.textContent = c.n;
    titulo.textContent = c.nombre;
    lema.textContent = c.lema;
    const total = Tienda.contar({ cat: id });
    ver.href = `${paginaCatalogo()}?cat=${id}`;
    ver.querySelector('span').textContent = `Ver las ${total} frases de ${c.nombre}`;
    const { items } = Tienda.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 6 });
    lista.innerHTML = items.map(tileHTML).join('');
    revelarNuevos(lista);
    refrescarScroll();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t.dataset.cap));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      elegir(tabs[(i + d + tabs.length) % tabs.length].dataset.cap, true);
    });
  });
  elegir(tabs[0].dataset.cap);
}

function initEstampaViva() {
  $$('[data-viva]').forEach(cont => {
    const color = cont.dataset.color;
    const ids = cont.dataset.viva.split(',').filter(id => getProducto(id));
    const destino = $('[data-viva-estampa]', cont);
    const cap = $$(`[data-viva-cap="${cont.id}"]`);
    if (!destino || !ids.length) return;
    let i = 0;
    let visible = true;
    const poner = (entrar = false) => {
      const p = getProducto(ids[i]);
      destino.innerHTML = estampaHTML(p, color);
      if (entrar) {
        const nueva = destino.querySelector('.estampa');
        nueva.classList.add('cambiando');
        void nueva.offsetWidth;
        nueva.classList.remove('cambiando');
      }
      cap.forEach(el => {
        const t = el.querySelector('[data-viva-t]');
        const n = el.querySelector('[data-viva-n]');
        if (t) t.textContent = `«${p.frase}»`;
        if (n) n.textContent = nombreCap(capDe(p.cat));
        if (el.matches('a')) { el.href = urlProducto(p.id); el.dataset.ver = p.id; el.dataset.color = color; }
      });
    };
    poner();
    if (reduceMotion || ids.length < 2) return;
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(cont);
    window.setInterval(() => {
      if (!visible || document.hidden) return;
      destino.querySelector('.estampa')?.classList.add('cambiando');
      setTimeout(() => {
        i = (i + 1) % ids.length;
        poner(true);
      }, 420);
    }, 3800);
  });
}

function initPorColor() {
  const sec = document.querySelector('[data-por-color]');
  if (!sec) return;
  const swatches = $('[data-pc-swatches]', sec);
  const media = $('[data-pc-media]', sec);
  const nombre = $('[data-pc-nombre]', sec);
  const cuenta = $('[data-pc-cuenta]', sec);
  const cta = $('[data-pc-cta]', sec);
  const ver = $('[data-pc-ver]', sec);
  let timer = 0;
  let idx = 0;
  let actual = null;
  swatches.innerHTML = COLORES.map((c, i) => `<label class="pc-sw" data-animate="escala" style="opacity:0;transform:scale(.92)"><input type="radio" name="pc-color" value="${c.id}"${i === 0 ? ' checked' : ''}><span class="sw-dot" style="--sw:${c.hex}"></span><span class="pc-sw-t">${esc(c.nombre)}</span></label>`).join('');
  const frasesDe = id => Tienda.consultar({ filtros: { color: id }, orden: 'destacados', limite: TOPE_CONSULTA }).items;
  const mostrar = () => {
    const lista = frasesDe(actual);
    const p = lista[idx % lista.length];
    const c = colorDe(actual);
    media.innerHTML = teeHTML(p, actual, 'tee--pc');
    ver.href = urlProducto(p.id);
    ver.dataset.ver = p.id;
    ver.dataset.color = actual;
    ver.querySelector('[data-pc-frase]').textContent = `«${p.frase}» en ${c.nombre.toLowerCase()}`;
  };
  const elegir = id => {
    actual = id;
    idx = 0;
    const c = colorDe(id);
    const n = Tienda.contar({ color: id });
    nombre.textContent = c.nombre;
    cuenta.textContent = `${n} ${n === 1 ? 'frase' : 'frases'}`;
    cta.href = `${paginaCatalogo()}?color=${id}`;
    cta.querySelector('span').textContent = `Ver las ${n} en ${c.nombre.toLowerCase()}`;
    sec.style.setProperty('--pc-color', c.hex);
    mostrar();
    window.clearInterval(timer);
    if (!reduceMotion && frasesDe(id).length > 1) timer = window.setInterval(() => { if (document.hidden) return; idx++; mostrar(); }, 3200);
  };
  swatches.addEventListener('change', e => { if (e.target.name === 'pc-color') elegir(e.target.value); });
  elegir(COLORES[0].id);
}

function initPromos() {
  $$('[data-copiar-cupon]').forEach(b => b.addEventListener('click', async () => {
    const codigo = b.dataset.copiarCupon;
    try { await navigator.clipboard?.writeText(codigo); } catch { /* sin portapapeles */ }
    Promos.guardar(codigo);
    showToast(`Cupón ${codigo} guardado: se aplica solo en tu carrito.`);
  }));
}

function initRailDrag(vp, prev, next) {
  const track = vp.firstElementChild;
  const paso = () => (track?.firstElementChild?.getBoundingClientRect().width || 280) + 16;
  const flechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) {
      const matar = ev => { ev.preventDefault(); ev.stopPropagation(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 0);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  return flechas;
}

function initRails() {
  $$('[data-rail]').forEach(sec => {
    const vp = $('.rail-vp', sec);
    if (vp) initRailDrag(vp, $('[data-rail-prev]', sec), $('[data-rail-next]', sec));
  });
}

function initGaleria() {
  const sec = document.querySelector('[data-galeria]');
  if (!sec) return;
  const items = $$('.g-item', sec);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="visor-bd" id="visor" hidden>
      <div class="visor" role="dialog" aria-modal="true" aria-label="Galería de Vyora">
        <button type="button" class="icon-btn visor-close" aria-label="Cerrar la galería">${ICONOS.cerrar}</button>
        <figure class="visor-fig">
          <div class="visor-foto"><img src="images/g-cuello-lavanda.webp" alt="" width="800" height="800" data-visor-img></div>
          <figcaption>
            <span class="visor-n" data-visor-n></span>
            <strong data-visor-t></strong>
            <small data-visor-d></small>
            <a class="btn btn--line" data-visor-cta href="${paginaCatalogo()}">${ICONOS.remera}<span>Ver la tienda</span></a>
          </figcaption>
        </figure>
        <button type="button" class="visor-nav visor-prev" data-visor-paso="-1" aria-label="Foto anterior">${ICONOS.izq}</button>
        <button type="button" class="visor-nav visor-next" data-visor-paso="1" aria-label="Foto siguiente">${ICONOS.der}</button>
      </div>
    </div>`);
  const bd = $('#visor');
  const modal = $('.visor', bd);
  const img = $('[data-visor-img]', bd);
  let opener = null;
  let actual = 0;
  const mostrar = i => {
    actual = (i + items.length) % items.length;
    const it = items[actual];
    const foto = it.querySelector('img');
    img.src = foto.getAttribute('src');
    img.alt = foto.alt;
    img.width = foto.width;
    img.height = foto.height;
    $('[data-visor-n]', bd).textContent = `${actual + 1} / ${items.length}`;
    $('[data-visor-t]', bd).textContent = it.querySelector('.g-cap strong').textContent;
    $('[data-visor-d]', bd).textContent = it.querySelector('.g-cap small').textContent;
    const color = it.dataset.color;
    const cta = $('[data-visor-cta]', bd);
    cta.href = color ? `${paginaCatalogo()}?color=${color}` : paginaCatalogo();
    cta.querySelector('span').textContent = color ? `Ver frases en ${colorDe(color)?.nombre.toLowerCase()}` : 'Ver la tienda';
  };
  const abrir = i => {
    opener = document.activeElement;
    mostrar(i);
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    $('.visor-close', bd).focus();
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    opener?.focus?.();
  };
  sec.addEventListener('click', e => {
    const b = e.target.closest('.g-btn');
    if (b) { abrir(items.indexOf(b.closest('.g-item'))); return; }
    if (e.target.closest('[data-galeria-todas]')) abrir(0);
  });
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrar(); return; }
    const paso = e.target.closest('[data-visor-paso]');
    if (paso) mostrar(actual + Number(paso.dataset.visorPaso));
  });
  $('.visor-close', bd).addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    trampaFoco(modal, e);
  });
}

function initCatalogo() {
  const app = document.querySelector('[data-catalogo-app]');
  if (!app) return;
  const grid = $('[data-resultados]', app);
  const verMas = $('[data-ver-mas]', app);
  const contador = $('[data-contador]', app);
  const vacio = $('[data-vacio]', app);
  const chipsActivos = $('[data-activos]', app);
  const buscador = $('#cat-q', app);
  const orden = $('#cat-orden', app);
  const panel = $('[data-filtros]', app);
  const abrirFiltros = $('[data-abrir-filtros]', app);
  const cuentaRes = $('[data-cuenta-res]', app);
  const miga = document.querySelector('[data-miga]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const bajada = document.querySelector('[data-cat-bajada]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CAPSULAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>Cápsula ${c.n} · ${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="color"]', panel).innerHTML = COLORES.map(c => `<label class="chk chk--color"><input type="checkbox" data-f="color" value="${c.id}"><span class="sw-dot" style="--sw:${c.hex}" aria-hidden="true"></span><span>${esc(c.nombre)}</span><small>${Tienda.contar({ color: c.id })}</small></label>`).join('');
  $('[data-f-grupo="talle"]', panel).innerHTML = TALLES.map(t => `<label class="chip chip--f"><input type="checkbox" data-f="talle" value="${t}"><span>${t}</span></label>`).join('');
  $('[data-f-grupo="extra"]', panel).innerHTML = `<label class="chk"><input type="checkbox" data-f="promo" value="1"><span>En promo</span><small>${Tienda.contar({ promo: true })}</small></label><label class="chk"><input type="checkbox" data-f="nuevo" value="1"><span>Nuevas</span><small>${Tienda.contar({ nuevo: true })}</small></label>`;
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CAPSULAS.map(c => c.id)),
    color: validos(params.get('color'), COLORES.map(c => c.id)),
    talle: validos(params.get('talle'), TALLES),
    promo: params.get('promo') === '1',
    nuevo: params.get('nuevo') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, color: estado.color, talle: estado.talle, promo: estado.promo, nuevo: estado.nuevo });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    ['cat', 'color', 'talle'].forEach(k => $$(`input[data-f="${k}"]`, panel).forEach(i => { i.checked = estado[k].includes(i.value); }));
    $('input[data-f="promo"]', panel).checked = estado.promo;
    $('input[data-f="nuevo"]', panel).checked = estado.nuevo;
    const c = estado.cat.length === 1 ? capDe(estado.cat[0]) : null;
    const col = !c && estado.color.length === 1 ? colorDe(estado.color[0]) : null;
    if (miga) {
      const cat = paginaCatalogo();
      if (c) miga.innerHTML = `<a href="${cat}">Tienda</a><span aria-hidden="true">/</span><span aria-current="page">Cápsula ${c.n} · ${esc(c.nombre)}</span>`;
      else if (col) miga.innerHTML = `<a href="${cat}">Tienda</a><span aria-hidden="true">/</span><span aria-current="page">${esc(col.nombre)}</span>`;
      else if (estado.promo && !estado.cat.length) miga.innerHTML = `<a href="${cat}">Tienda</a><span aria-hidden="true">/</span><span aria-current="page">En promo</span>`;
      else miga.innerHTML = '<span aria-current="page">Tienda</span>';
    }
    if (titulo) titulo.textContent = c ? `Cápsula ${c.n} · ${c.nombre}` : col ? `Remeras en ${col.nombre.toLowerCase()}` : estado.promo ? 'Remeras en promo' : 'Todas las frases';
    if (bajada) bajada.textContent = c ? `${c.lema}. Elegí la frase, el color y tu talle.` : 'Remeras con frases en tres cápsulas. Filtrá por cápsula, color o talle y elegí la tuya.';
    $$('[data-menu-cats] a').forEach(a => {
      const ac = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && estado.cat[0] === ac) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'color', 'talle', 'promo', 'nuevo', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    ['cat', 'color', 'talle'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.promo) u.searchParams.set('promo', '1');
    if (estado.nuevo) u.searchParams.set('nuevo', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, `Cápsula ${capDe(c).n}`]),
      ...estado.color.map(c => ['color', c, colorDe(c).nombre]),
      ...estado.talle.map(t => ['talle', t, `Talle ${t}`]),
      ...(estado.promo ? [['promo', '', 'En promo']] : []),
      ...(estado.nuevo ? [['nuevo', '', 'Nuevas']] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { completo: true })).join(''));
    if (estado.color.length === 1) $$('.prod', grid).forEach(card => cambiarColorCard(card, estado.color[0]));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'frase' : 'frases'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay frases con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], color: [], talle: [], promo: false, nuevo: false }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'color' || f === 'talle') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'promo' || f === 'nuevo') estado[f] = e.target.checked;
    aplicar();
  });
  orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
  let t = 0;
  buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  $('[data-form-buscar]', app).addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas.addEventListener('click', () => pintar(true));
  app.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const k = quitar.dataset.quitar;
      if (k === 'q') estado.q = '';
      else if (k === 'promo' || k === 'nuevo') estado[k] = false;
      else estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  const cerrarPanel = () => { panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false'); bloquear(false); abrirFiltros.focus(); };
  abrirFiltros.addEventListener('click', () => {
    $$('[data-animate]', panel).forEach(el => el.classList.add('in'));
    panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true'); bloquear(true);
    panel.querySelector('input')?.focus();
  });
  $$('[data-cerrar-filtros]', panel).forEach(b => b.addEventListener('click', cerrarPanel));
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches && panel.classList.contains('open')) { panel.classList.remove('open'); bloquear(false); } });

  sincronizarUI();
  pintar();
  if (location.hash === '#buscar') buscador.focus();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.08 }, 0);
  tl.from(hero.querySelectorAll('.hero-blob'), { scale: 0.92, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, 0)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-arco path'), { strokeDashoffset: 1, duration: 1.6, ease: 'power2.inOut' }, 0.3)
    .from(hero.querySelectorAll('.hero-chispa'), { scale: 0.92, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.9)
    .from(hero.querySelectorAll('.hero-tag, .hero-vertical, .hero-card'), { y: 24, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto && window.matchMedia('(min-width: 861px)').matches) gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function iniciar() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  initAntiCopia();
  initModelBarScroll();
  initCuentas();
  initMenuCategorias();
  initNav();
  initCapsulas();
  initDestacados();
  initCapsulasTabs();
  initEstampaViva();
  initPorColor();
  initCatalogo();
  initRails();
  initGaleria();
  initPromos();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initFloats();
  initHeroMotion();
  initReveals();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
}
