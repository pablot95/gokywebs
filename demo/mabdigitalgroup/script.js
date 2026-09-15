const WSP = '5491161219590';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = 16;

const SERVICIOS = [
  { id: 'auditoria', num: '01', nombre: 'Auditoría comercial', hemi: 'mercado', desc: 'Revisamos equipo comercial, administración, puntos de venta y marketing. Te devolvemos el diagnóstico en 24 horas.' },
  { id: 'talento', num: '02', nombre: 'Selección y desarrollo de talento', hemi: 'personas', desc: 'Diseñamos el puesto junto al responsable del área y buscamos el perfil que hace falta, no el que aparece.' },
  { id: 'organizacional', num: '03', nombre: 'Desarrollo organizacional', hemi: 'personas', desc: 'Estructura, roles y procesos internos para que crecer no signifique desordenarse.' },
  { id: 'perfil', num: '04', nombre: 'Perfil y búsqueda laboral', hemi: 'personas', desc: 'Armado de CV y perfil de LinkedIn para que te encuentren los que buscan lo que sabés hacer.' },
  { id: 'capacitaciones', num: '05', nombre: 'Capacitaciones a medida', hemi: 'personas', desc: 'Programas armados con los casos reales de tu empresa, no con teoría de manual.' },
  { id: 'identidad', num: '06', nombre: 'Identidad corporativa', hemi: 'mercado', desc: 'Qué encuentra el mercado cuando te busca: mensaje, piezas y coherencia entre canales.' },
  { id: 'marketing', num: '07', nombre: 'Marketing corporativo', hemi: 'mercado', desc: 'Plan y ejecución para sostener la demanda todo el año, no solo en temporada alta.' },
  { id: 'emprendedor', num: '08', nombre: 'Desarrollo emprendedor', hemi: 'mercado', desc: 'Acompañamiento para quien está armando su empresa y necesita orden desde el primer mes.' },
];

const CATEGORIAS = [
  { id: 'onboarding', nombre: 'Onboarding' },
  { id: 'ejecutivos', nombre: 'Ejecutivos' },
  { id: 'gourmet', nombre: 'Gourmet' },
  { id: 'sustentables', nombre: 'Sustentables' },
];

const VARIANTES = [{ n: 'Sin personalizar', d: 0 }, { n: 'Con logo grabado', d: 15 }];

const PRODUCTOS = [
  {
    id: 'bienvenida', nombre: 'Kit Bienvenida Corporativo', cat: 'onboarding', precio: 28900, minimo: 10, orden: 1, destacado: 1,
    img: 'images/kit-bienvenida-corporativo_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/set-escritorio-premium_1254x1254.webp', w2: 1254, h2: 1254, badge: 'Más pedido',
    tags: ['onboarding', 'bienvenida', 'taza', 'vaso', 'cuaderno', 'ingreso'],
    desc: 'Caja rígida con vaso térmico, taza de cerámica y cuaderno con elástico. El kit que reciben los que entran a tu empresa el primer día.',
    specs: ['Vaso térmico 450 ml + taza + cuaderno', 'Caja rígida con cinta de color', 'Personalización a 1 o 2 colores'],
  },
  {
    id: 'ejecutivo', nombre: 'Kit Ejecutivo', cat: 'ejecutivos', precio: 34500, minimo: 10, orden: 2, destacado: 2,
    img: 'images/kit-ejecutivo-corporativo_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/kit-bienvenida-corporativo_1254x1254.webp', w2: 1254, h2: 1254,
    tags: ['ejecutivo', 'botella', 'termo', 'taza', 'reconocimiento'],
    desc: 'Botella térmica de acero, vaso viajero y taza en caja negra con virutas. Sobrio, para clientes y mandos medios.',
    specs: ['Botella térmica 750 ml', 'Vaso viajero + taza', 'Caja negra premium con relleno'],
  },
  {
    id: 'tecnologico', nombre: 'Kit Tecnológico Ejecutivo', cat: 'ejecutivos', precio: 52900, minimo: 5, orden: 3, destacado: 3,
    img: 'images/kit-tecnologico-ejecutivo_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/set-escritorio-premium_1254x1254.webp', w2: 1254, h2: 1254, badge: 'Premium',
    tags: ['tecnologico', 'cargador', 'inalambrico', 'cuaderno', 'gerencia'],
    desc: 'Cargador inalámbrico, cuaderno de tapa dura y lapicera metálica. Para reconocimientos y regalos de dirección.',
    specs: ['Cargador inalámbrico 15 W', 'Cuaderno A5 tapa dura', 'Lapicera metálica con grabado láser'],
  },
  {
    id: 'gourmet', nombre: 'Canasta Gourmet Empresarial', cat: 'gourmet', precio: 46700, minimo: 5, orden: 4, destacado: 4,
    img: 'images/canasta-gourmet-empresarial_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/kit-regalo-ecologico_1254x1254.webp', w2: 1254, h2: 1254,
    tags: ['gourmet', 'fin de año', 'bombones', 'cafe', 'canasta'],
    desc: 'Bombones, café de especialidad, frutos secos y snacks en caja con moño. El clásico de fin de año que sí se come.',
    specs: ['Bombones + café + frutos secos', 'Caja con moño de raso', 'Tarjeta con tu mensaje incluida'],
  },
  {
    id: 'eco', nombre: 'Kit Ecológico', cat: 'sustentables', precio: 24300, minimo: 10, orden: 5, destacado: 5,
    img: 'images/kit-regalo-ecologico_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/canasta-gourmet-empresarial_1254x1254.webp', w2: 1254, h2: 1254,
    tags: ['eco', 'sustentable', 'bambu', 'reciclado', 'botella'],
    desc: 'Botella de acero, cuaderno de bambú y neceser de lona reciclada en caja kraft. Para empresas con política sustentable.',
    specs: ['Botella de acero 600 ml', 'Cuaderno de bambú con anillado', 'Neceser de lona reciclada'],
  },
  {
    id: 'escritorio', nombre: 'Set Escritorio Premium', cat: 'ejecutivos', precio: 31800, minimo: 10, orden: 6, destacado: 6,
    img: 'images/set-escritorio-premium_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/kit-tecnologico-ejecutivo_1254x1254.webp', w2: 1254, h2: 1254,
    tags: ['escritorio', 'cuaderno', 'organizador', 'lapicera', 'oficina'],
    desc: 'Cuaderno de tapa flexible, lapicera metálica, organizador de escritorio y cargador. Todo en caja con faja bicolor.',
    specs: ['Cuaderno + lapicera + organizador', 'Cargador inalámbrico incluido', 'Faja bicolor con tu marca'],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getServicio = id => SERVICIOS.find(s => s.id === id);
const recargoVariante = v => VARIANTES.find(x => x.n === v)?.d || 0;
const precioUnidad = (p, variante = '') => (p ? Math.round(p.precio * (1 + recargoVariante(variante) / 100)) : 0);
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const Cart = {
  KEY: 'mabdigital_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty, variante = VARIANTES[0].n) {
    const items = this.get();
    const min = producto.minimo || 1;
    const cantidad = Math.max(min, qty || min);
    const existing = items.find(i => i.id === producto.id && i.variante === variante);
    if (existing) existing.qty += cantidad;
    else items.push({ id: producto.id, variante, qty: cantidad });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.variante === (variante || ''));
    if (!it) return;
    const min = getProducto(id)?.minimo || 1;
    it.qty = Math.max(min, qty);
    this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && i.variante === (variante || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnidad(p, i.variante) * i.qty : s; }, 0); },
};

const estado = { cat: 'all', q: '', orden: 'destacados', visibles: PAGE, hemi: 'all' };
const varianteElegida = {};

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

/* ---------- Servicios ---------- */
function servCardHTML(s) {
  const hemiNombre = s.hemi === 'personas' ? 'Personas' : 'Mercado';
  return `
  <article class="serv-card${s.hemi === 'mercado' ? ' is-mercado' : ''}">
    <span class="serv-num">${s.num}</span>
    <span class="serv-hemi ${s.hemi === 'personas' ? 'hemi-p' : 'hemi-m'}">${hemiNombre}</span>
    <h3>${esc(s.nombre)}</h3>
    <p>${esc(s.desc)}</p>
    <a class="serv-link" href="${wspLink('Hola MAB, quiero información sobre ' + s.nombre + '.')}" target="_blank" rel="noopener">Consultar
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </article>`;
}

function renderRailServicios() {
  const track = document.getElementById('railTrack');
  if (track) track.innerHTML = SERVICIOS.map(servCardHTML).join('');
}

function renderServGrid(animar = true) {
  const grid = document.getElementById('servGrid');
  if (!grid) return;
  const lista = estado.hemi === 'all' ? SERVICIOS : SERVICIOS.filter(s => s.hemi === estado.hemi);
  grid.innerHTML = lista.map(servCardHTML).join('');
  if (animar && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(grid.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'expo.out', overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

/* ---------- Diagnóstico ---------- */
const PREGUNTAS = [
  {
    q: '¿Qué te está costando más hoy?',
    opciones: [
      { t: 'Conseguir el perfil que necesito', p: 3, m: 0 },
      { t: 'Sostener al equipo que ya tengo', p: 3, m: 0 },
      { t: 'Vender lo mismo que vendía el año pasado', p: 0, m: 3 },
    ],
  },
  {
    q: 'Si mirás el último trimestre, ¿dónde se cayó el número?',
    opciones: [
      { t: 'En la conversión del equipo comercial', p: 0, m: 3 },
      { t: 'En la rotación: entreno gente que se va', p: 3, m: 0 },
      { t: 'En las dos cosas a la vez', p: 2, m: 2 },
    ],
  },
  {
    q: 'Cuando un cliente o un candidato te busca, ¿qué encuentra?',
    opciones: [
      { t: 'La verdad, no sé qué encuentra', p: 1, m: 2 },
      { t: 'La marca, pero desactualizada', p: 0, m: 3 },
      { t: 'Buenas referencias de quienes trabajaron con nosotros', p: 2, m: 0 },
    ],
  },
  {
    q: '¿Qué necesitás resolver en los próximos 90 días?',
    opciones: [
      { t: 'Cubrir posiciones que están abiertas', p: 3, m: 0 },
      { t: 'Ordenar roles y responsabilidades', p: 2, m: 1 },
      { t: 'Recuperar clientes que se fueron', p: 0, m: 3 },
    ],
  },
];

function calcularDiagnostico(respuestas) {
  let p = 0, m = 0;
  respuestas.forEach((idx, i) => {
    if (idx === null || idx === undefined) return;
    const op = PREGUNTAS[i]?.opciones[idx];
    if (!op) return;
    p += op.p; m += op.m;
  });
  const total = p + m;
  const pctP = total ? Math.round((p / total) * 100) : 0;
  const pctM = total ? 100 - pctP : 0;
  const completo = respuestas.filter(r => r !== null && r !== undefined).length === PREGUNTAS.length;
  let foco = 'mixto';
  if (pctP >= 60) foco = 'personas';
  else if (pctM >= 60) foco = 'mercado';
  const servicios = foco === 'personas'
    ? ['talento', 'organizacional', 'capacitaciones']
    : foco === 'mercado'
      ? ['auditoria', 'identidad', 'marketing']
      : ['auditoria', 'organizacional', 'talento'];
  const titulo = foco === 'personas' ? 'Tu cuello de botella está en las personas'
    : foco === 'mercado' ? 'Tu cuello de botella está en el mercado'
      : 'Tenés las dos puntas para trabajar';
  const texto = foco === 'personas'
    ? 'El equipo no está acompañando el crecimiento: hay que revisar perfiles, roles y desarrollo antes de sumar más presión comercial.'
    : foco === 'mercado'
      ? 'El problema no está en quién trabaja con vos, sino en cómo llega y se sostiene la demanda. Ahí empieza la auditoría comercial.'
      : 'La estructura interna y la demanda se están frenando entre sí. Conviene arrancar por la auditoría y ordenar roles en paralelo.';
  return { p, m, pctP, pctM, completo, foco, servicios, titulo, texto };
}

function initDiagnostico() {
  const cont = document.getElementById('diagPreguntas');
  const arcoP = document.getElementById('arcoP');
  const arcoM = document.getElementById('arcoM');
  const pctPEl = document.getElementById('pctP');
  const pctMEl = document.getElementById('pctM');
  const pasoEl = document.getElementById('diagPaso');
  const resultado = document.getElementById('diagResultado');
  if (!cont || !arcoP || !arcoM) return;

  const C1 = 2 * Math.PI * 88, C2 = 2 * Math.PI * 66;
  arcoP.style.strokeDasharray = C1;
  arcoM.style.strokeDasharray = C2;
  const respuestas = new Array(PREGUNTAS.length).fill(null);

  cont.innerHTML = PREGUNTAS.map((pr, i) => `
    <li class="pregunta" data-q="${i}">
      <span class="pregunta-num">Pregunta ${i + 1} de ${PREGUNTAS.length}</span>
      <h3>${esc(pr.q)}</h3>
      <div class="opciones">
        ${pr.opciones.map((op, j) => `<button type="button" class="opcion" data-q="${i}" data-op="${j}">${esc(op.t)}</button>`).join('')}
      </div>
    </li>`).join('');

  const pintar = () => {
    const r = calcularDiagnostico(respuestas);
    const contestadas = respuestas.filter(x => x !== null).length;
    arcoP.style.strokeDashoffset = C1 * (1 - r.pctP / 100);
    arcoM.style.strokeDashoffset = C2 * (1 - r.pctM / 100);
    if (pctPEl) pctPEl.textContent = r.pctP + '%';
    if (pctMEl) pctMEl.textContent = r.pctM + '%';
    if (pasoEl) pasoEl.textContent = `${contestadas} / ${PREGUNTAS.length}`;
    if (!resultado) return;
    resultado.hidden = !r.completo;
    if (!r.completo) return;
    document.getElementById('resTitulo').textContent = r.titulo;
    document.getElementById('resTexto').textContent = r.texto;
    document.getElementById('resServicios').innerHTML = r.servicios
      .map(id => `<li>${esc(getServicio(id)?.nombre || '')}</li>`).join('');
    const detalle = respuestas.map((idx, i) => `${i + 1}. ${PREGUNTAS[i].opciones[idx].t}`).join('\n');
    document.getElementById('resWsp').href = wspLink(
      `Hola MAB, hice el diagnóstico exprés.\nResultado: ${r.titulo} (personas ${r.pctP}% / mercado ${r.pctM}%).\nMis respuestas:\n${detalle}\nQuiero avanzar con: ${r.servicios.map(id => getServicio(id)?.nombre).join(', ')}.`
    );
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  cont.addEventListener('click', e => {
    const btn = e.target.closest('.opcion');
    if (!btn) return;
    const q = parseInt(btn.dataset.q, 10);
    const op = parseInt(btn.dataset.op, 10);
    respuestas[q] = op;
    const li = btn.closest('.pregunta');
    li.querySelectorAll('.opcion').forEach(b => b.classList.toggle('is-on', b === btn));
    li.classList.add('is-done');
    pintar();
  });

  document.getElementById('diagReset')?.addEventListener('click', () => {
    respuestas.fill(null);
    cont.querySelectorAll('.opcion').forEach(b => b.classList.remove('is-on'));
    cont.querySelectorAll('.pregunta').forEach(li => li.classList.remove('is-done'));
    pintar();
    cont.querySelector('.pregunta')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  pintar();
}

/* ---------- Tienda ---------- */
function cardHTML(p) {
  const nombreCat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const badge = p.badge ? `<span class="card-tag">${esc(p.badge)}</span>` : '';
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" style="object-position:${p.pos || '50% 50%'}">
      ${badge}
      <button type="button" class="card-ver" data-qv="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"></button>
    </div>
    <div class="card-body">
      <span class="card-cat">${esc(nombreCat)}</span>
      <button type="button" class="card-name" data-qv="${p.id}">${esc(p.nombre)}</button>
      <span class="card-precio"><b>${formatearPrecio(p.precio)}</b><span>por unidad</span></span>
      <span class="card-min">Pedido mínimo: ${p.minimo} u.</span>
      <div class="card-acciones">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Restar unidades">−</button>
          <input type="number" value="${p.minimo}" min="${p.minimo}" step="1" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-step="1" aria-label="Sumar unidades">+</button>
        </div>
        <button type="button" class="card-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function productosFiltrados() {
  const q = normalizar(estado.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (!q) return true;
    const campos = normalizar([p.nombre, p.cat, CATEGORIAS.find(c => c.id === p.cat)?.nombre, p.desc, (p.tags || []).join(' ')].join(' '));
    return q.split(/\s+/).every(t => campos.includes(t));
  });
  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => a.precio - b.precio);
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => b.precio - a.precio);
  else if (estado.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = lista.slice().sort((a, b) => (a.orden || 99) - (b.orden || 99));
  return lista;
}

function renderCatalogo(animar = true) {
  const grid = document.getElementById('gridProductos');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const resultados = document.getElementById('resultados');
  if (!grid) return;
  const lista = productosFiltrados();
  const mostrados = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrados.map(cardHTML).join('');
  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  verMas.hidden = lista.length <= estado.visibles;
  resultados.textContent = lista.length === 0
    ? 'Sin resultados'
    : `${lista.length} ${lista.length === 1 ? 'kit' : 'kits'}${estado.cat !== 'all' ? ' · ' + (CATEGORIAS.find(c => c.id === estado.cat)?.nombre || '') : ''}`;
  document.getElementById('limpiar').hidden = estado.cat === 'all' && !estado.q && estado.orden === 'destacados';
  if (animar && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(grid.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .05, ease: 'expo.out', overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderChips() {
  const chips = document.getElementById('chips');
  if (!chips) return;
  const items = [{ id: 'all', nombre: 'Todos' }, ...CATEGORIAS];
  chips.innerHTML = items.map(c => `<button type="button" class="chip${estado.cat === c.id ? ' is-on' : ''}" data-chip="${c.id}">${esc(c.nombre)}</button>`).join('');
}

function setCategoria(cat) {
  estado.cat = cat;
  estado.visibles = PAGE;
  renderChips();
  renderCatalogo();
}

function irARegalos(cat) {
  if (cat) setCategoria(cat);
  document.getElementById('regalos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Carrito ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
      <h3>Todavía no armaste el pedido</h3>
      <p>Elegí los kits y las cantidades: te preparamos la cotización con la personalización incluida.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver los kits</button>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const uni = precioUnidad(p, i.variante);
    return `<div class="linea" data-id="${p.id}" data-variante="${esc(i.variante || '')}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="64" height="64" loading="lazy" style="object-position:${p.pos || '50% 50%'}">
      <div>
        <div class="linea-nombre">${esc(p.nombre)}</div>
        <div class="linea-var">${esc(i.variante)}</div>
        <div class="stepper">
          <button type="button" data-lstep="-1" aria-label="Restar unidades">−</button>
          <input type="number" value="${i.qty}" min="${p.minimo}" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-lstep="1" aria-label="Sumar unidades">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="linea-precio">${formatearPrecio(uni * i.qty)}</div>
        <div class="linea-var">${formatearPrecio(uni)} c/u</div>
        <button type="button" class="linea-quitar" data-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  foot.innerHTML = `
    <p class="drawer-aviso">Los kits se despachan personalizados: sumamos el arte de tu marca antes de producir.</p>
    <div class="drawer-total"><span>Total estimado</span><b>${formatearPrecio(Cart.total())}</b></div>
    <button type="button" class="btn btn-cta" id="finalizar">Finalizar pedido</button>
    <a class="btn btn-line" id="pedirWsp" href="#" target="_blank" rel="noopener">Pedir cotización por WhatsApp</a>`;
  const wsp = document.getElementById('pedirWsp');
  if (wsp) {
    const detalle = Cart.get().map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} x ${p.nombre} (${i.variante})` : '';
    }).filter(Boolean).join('\n');
    wsp.href = wspLink('Hola MAB, quiero cotizar estos regalos empresariales:\n' + detalle + '\nTotal estimado: ' + formatearPrecio(Cart.total()));
  }
}

/* ---------- Overlays ---------- */
function trapFocus(cont, e) {
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let lastFocus = null;

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  lastFocus = document.activeElement;
  renderDrawer();
  drawer.classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open', 'no-scroll');
  setTimeout(() => document.getElementById('drawerClose')?.focus(), 60);
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(drawer.querySelectorAll('.linea'), { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: .42, stagger: .06, ease: 'expo.out', delay: .12 });
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  drawer.setAttribute('inert', '');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open', 'no-scroll');
  lastFocus?.focus();
}

const qvEstado = { id: null, img: 0 };

function qvHTML(p) {
  const nombreCat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const imgs = [{ src: p.img, w: p.w, h: p.h, pos: p.pos }, p.img2 ? { src: p.img2, w: p.w2, h: p.h2, pos: '50% 50%' } : null].filter(Boolean);
  const activa = imgs[qvEstado.img] || imgs[0];
  const variante = varianteElegida[p.id] || VARIANTES[0].n;
  const uni = precioUnidad(p, variante);
  const relacionados = PRODUCTOS.filter(x => x.id !== p.id).slice(0, 3);
  return `
  <div class="qv-media">
    <div class="qv-main"><img src="${activa.src}" alt="${esc(p.nombre)}" width="${activa.w}" height="${activa.h}" style="object-position:${activa.pos || '50% 50%'}"></div>
    ${imgs.length > 1 ? `<div class="qv-thumbs">${imgs.map((im, i) => `<button type="button" class="${i === qvEstado.img ? 'is-on' : ''}" data-qvimg="${i}" aria-label="Ver imagen ${i + 1}"><img src="${im.src}" alt="" width="58" height="58"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv-body">
    <span class="qv-cat">${esc(nombreCat)}</span>
    <h3>${esc(p.nombre)}</h3>
    <span class="qv-precio"><b>${formatearPrecio(uni)}</b><span>por unidad · mínimo ${p.minimo} u.</span></span>
    <p class="qv-desc">${esc(p.desc)}</p>
    <ul class="qv-specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <p class="qv-label">Personalización</p>
    <div class="qv-variantes">${VARIANTES.map(v => `<button type="button" class="qv-var${variante === v.n ? ' is-on' : ''}" data-var="${esc(v.n)}" data-prod="${p.id}">${esc(v.n)}${v.d ? ' · +' + v.d + '%' : ''}</button>`).join('')}</div>
    <p class="qv-nota">El arte se ajusta sin costo antes de producir: nos mandás el logo y te enviamos la muestra digital.</p>
    <div class="qv-acciones">
      <div class="stepper">
        <button type="button" data-step="-1" aria-label="Restar unidades">−</button>
        <input type="number" id="qvQty" value="${p.minimo}" min="${p.minimo}" aria-label="Cantidad">
        <button type="button" data-step="1" aria-label="Sumar unidades">+</button>
      </div>
      <button type="button" class="btn btn-cta" data-qvadd>Agregar al pedido</button>
      <a class="btn btn-line" href="${wspLink('Hola MAB, quiero cotizar el ' + p.nombre + ' (' + variante + ').')}" target="_blank" rel="noopener">Consultar</a>
    </div>
    ${relacionados.length ? `<div class="qv-relacionados"><h4>También se llevan</h4><div class="qv-rel-grid">${relacionados.map(r => `<button type="button" class="qv-rel" data-qv="${r.id}"><img src="${r.img}" alt="${esc(r.nombre)}" width="${r.w}" height="${r.h}" loading="lazy" style="object-position:${r.pos || '50% 50%'}"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
  </div>`;
}

function openQuickView(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickView');
  if (!p || !modal) return;
  if (!modal.classList.contains('open')) lastFocus = document.activeElement;
  qvEstado.id = id;
  qvEstado.img = 0;
  document.getElementById('qvInner').innerHTML = qvHTML(p);
  modal.classList.add('open');
  document.getElementById('modalBackdrop').classList.add('open');
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open', 'no-scroll');
  modal.scrollTop = 0;
  setTimeout(() => document.getElementById('qvClose')?.focus(), 60);
}

function refreshQuickView() {
  const p = getProducto(qvEstado.id);
  if (p) document.getElementById('qvInner').innerHTML = qvHTML(p);
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.classList.remove('open');
  document.getElementById('modalBackdrop').classList.remove('open');
  modal.setAttribute('inert', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open', 'no-scroll');
  lastFocus?.focus();
}

/* ---------- Rail ---------- */
function initRail() {
  const vp = document.getElementById('rail');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());

  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

/* ---------- Reveals ---------- */
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
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ---------- Nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const bd = document.getElementById('navBackdrop');
  if (!toggle || !nav || !bd) return;
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  const mq = window.matchMedia('(min-width: 769px)');
  const syncInert = () => {
    if (mq.matches) { close(); nav.removeAttribute('inert'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  mq.addEventListener('change', syncInert);
  syncInert();
}

/* ---------- Flotantes ---------- */
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

/* ---------- Movimiento ---------- */
function initMovimiento() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-foto', { clipPath: 'inset(0 0 100% 0)', duration: 1.1 }, .1)
    .from('.hero-ficha', { y: 30, opacity: 0, duration: .9 }, .5)
    .from('.hero-arco', { scale: .6, opacity: 0, duration: 1, stagger: .12 }, .35);

  if (typeof ScrollTrigger === 'undefined') return;
  gsap.to('.hero-foto img', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
  const casos = document.querySelector('.casos-media img');
  if (casos) {
    gsap.fromTo(casos, { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.casos-media', start: 'top bottom', end: 'bottom center', scrub: .8 },
    });
  }
  gsap.to('.regalos-cut', {
    yPercent: -12, rotate: 3, ease: 'none',
    scrollTrigger: { trigger: '.regalos', start: 'top bottom', end: 'top center', scrub: .8 },
  });
}

/* ---------- Eventos ---------- */
function stepperDelta(input, delta) {
  const min = parseInt(input.min || '1', 10);
  const val = Math.max(min, (parseInt(input.value, 10) || min) + delta);
  input.value = val;
  return val;
}

function initEventos() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      if (input) stepperDelta(input, parseInt(step.dataset.step, 10));
      return;
    }
    const lstep = e.target.closest('[data-lstep]');
    if (lstep) {
      const linea = lstep.closest('.linea');
      const input = lstep.parentElement.querySelector('input');
      if (linea && input) Cart.setQty(linea.dataset.id, linea.dataset.variante, stepperDelta(input, parseInt(lstep.dataset.lstep, 10)));
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const linea = quitar.closest('.linea');
      if (linea) { Cart.remove(linea.dataset.id, linea.dataset.variante); showToast('Kit quitado del pedido'); }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const input = add.closest('.card-acciones')?.querySelector('input');
      if (p) {
        Cart.add(p, parseInt(input?.value, 10) || p.minimo, varianteElegida[p.id] || VARIANTES[0].n);
        showToast(`Sumaste ${p.nombre} al pedido`);
      }
      return;
    }
    const qvvar = e.target.closest('[data-var]');
    if (qvvar) {
      varianteElegida[qvvar.dataset.prod] = qvvar.dataset.var;
      refreshQuickView();
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { openQuickView(qv.dataset.qv); return; }
    const qvimg = e.target.closest('[data-qvimg]');
    if (qvimg) { qvEstado.img = parseInt(qvimg.dataset.qvimg, 10); refreshQuickView(); return; }
    const qvadd = e.target.closest('[data-qvadd]');
    if (qvadd) {
      const p = getProducto(qvEstado.id);
      const qty = parseInt(document.getElementById('qvQty')?.value, 10) || p?.minimo || 1;
      if (p) {
        Cart.add(p, qty, varianteElegida[p.id] || VARIANTES[0].n);
        closeQuickView();
        openCartDrawer();
      }
      return;
    }
    const chip = e.target.closest('[data-chip]');
    if (chip) { setCategoria(chip.dataset.chip); return; }
    const hemi = e.target.closest('[data-hemi]');
    if (hemi) {
      estado.hemi = hemi.dataset.hemi;
      document.querySelectorAll('[data-hemi]').forEach(b => b.classList.toggle('is-on', b.dataset.hemi === estado.hemi));
      renderServGrid();
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { closeCartDrawer(); irARegalos(); return; }
    if (e.target.closest('#finalizar')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
  });

  document.getElementById('buscar')?.addEventListener('input', e => {
    estado.q = e.target.value;
    estado.visibles = PAGE;
    renderCatalogo();
  });
  document.getElementById('orden')?.addEventListener('change', e => {
    estado.orden = e.target.value;
    estado.visibles = PAGE;
    renderCatalogo();
  });
  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vaciarFiltros')?.addEventListener('click', limpiarFiltros);
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PAGE; renderCatalogo(false); });

  document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  document.getElementById('qvClose')?.addEventListener('click', closeQuickView);
  document.getElementById('modalBackdrop')?.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cartDrawer');
    const modal = document.getElementById('quickView');
    if (!drawer || !modal) return;
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) { closeQuickView(); return; }
      if (drawer.classList.contains('open')) { closeCartDrawer(); return; }
    }
    if (e.key === 'Tab') {
      if (modal.classList.contains('open')) trapFocus(modal, e);
      else if (drawer.classList.contains('open')) trapFocus(drawer, e);
    }
  });

  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (document.getElementById('cartDrawer')?.classList.contains('open')) renderDrawer();
  });
}

function limpiarFiltros() {
  estado.cat = 'all';
  estado.q = '';
  estado.orden = 'destacados';
  estado.visibles = PAGE;
  const buscar = document.getElementById('buscar');
  if (buscar) buscar.value = '';
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  renderChips();
  renderCatalogo();
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  renderRailServicios();
  renderServGrid(false);
  renderChips();
  renderCatalogo(false);
  updateCartBadge();
  initEventos();
  initRail();
  initNav();
  initFloats();
  initReveals();
  initDiagnostico();
  initMovimiento();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
