const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'jeans',     nombre: 'Jeans',     num: 'Nº 01', img: 'p-jean-clasico' },
  { id: 'sweaters',  nombre: 'Sweaters',  num: 'Nº 02', img: 'p-sweater-terracota' },
  { id: 'remeras',   nombre: 'Remeras',   num: 'Nº 03', img: 'p-remera-blanca' },
  { id: 'chaquetas', nombre: 'Chaquetas', num: 'Nº 04', img: 'p-blazer-salvia' },
  { id: 'formal',    nombre: 'Sastrería', num: 'Nº 05', img: 'estudio-sastreria' }
];

const TALLES_STD = ['36', '38', '40', '42', '44', '46'];

const PRODUCTOS = [
  { id: 'jean-recto', nombre: 'Jean recto Bruma', cat: 'jeans', precio: 72900, descuento: 0, img: 'p-jean-recto',
    talles: TALLES_STD, colores: ['Azul medio', 'Negro'], stock: 12, destacado: true, nuevo: true,
    tela: 'Denim rígido de algodón con 2% de elastano',
    desc: 'Jean de tiro alto y pierna recta que acompaña sin marcar. La tela cede lo justo en la primera puesta y vuelve a su lugar después del lavado.',
    secreto: 'El tiro alto acomoda la cintura sin apretar: pedí un talle menos del que usás en calza.' },

  { id: 'jean-mom', nombre: 'Jean mom Serena', cat: 'jeans', precio: 68500, descuento: 15, img: 'p-jean-mom',
    talles: TALLES_STD, colores: ['Índigo', 'Azul claro'], stock: 9, destacado: false, nuevo: false,
    tela: 'Denim 100% algodón, lavado medio',
    desc: 'Cintura alta, cadera holgada y ruedo al tobillo. El clásico que resuelve el día entero sin pensarlo.',
    secreto: 'Con el mom, la remera va adentro: marca la cintura y alarga toda la pierna.' },

  { id: 'jean-wide', nombre: 'Jean wide leg Alameda', cat: 'jeans', precio: 84900, descuento: 0, img: 'p-jean-wide',
    talles: TALLES_STD, colores: ['Azul profundo'], stock: 7, destacado: false, nuevo: true,
    tela: 'Denim pesado de 12 oz, caída firme',
    desc: 'Pierna ancha desde la cadera y ruedo sin puntada visible. Cae solo, sin necesidad de planchado.',
    secreto: 'Con wide leg el zapato manda: una base con plataforma evita que el ruedo te coma altura.' },

  { id: 'jean-clasico', nombre: 'Jean clásico Costura', cat: 'jeans', precio: 65900, descuento: 0, img: 'p-jean-clasico',
    talles: TALLES_STD, colores: ['Azul medio'], stock: 14, destacado: true, nuevo: false,
    tela: 'Denim de algodón con costura contrastada',
    desc: 'Cinco bolsillos, tiro medio y pespunte reforzado. El que se usa hasta que se gasta y queda todavía mejor.',
    secreto: 'Lavalo del revés y con agua fría: el azul se mantiene parejo por muchas más temporadas.' },

  { id: 'jean-indigo', nombre: 'Jean recto Índigo profundo', cat: 'jeans', precio: 76500, descuento: 0, img: 'p-jean-cargo',
    talles: TALLES_STD, colores: ['Índigo profundo'], stock: 6, destacado: false, nuevo: false,
    tela: 'Denim sin lavado previo, tono uniforme',
    desc: 'El azul más oscuro de la línea, sin desgastes. Es el jean que también entra en una salida de noche.',
    secreto: 'El índigo sin lavar destiñe en la primera puesta: estrenalo con algo oscuro arriba.' },

  { id: 'sweater-terracota', nombre: 'Sweater calado Terracota', cat: 'sweaters', precio: 58900, descuento: 0, img: 'p-sweater-terracota',
    talles: ['Único'], colores: ['Terracota', 'Crudo'], stock: 8, destacado: true, nuevo: true,
    tela: 'Hilo de algodón y viscosa, punto calado',
    desc: 'Punto abierto de manga amplia, liviano para media estación. Se usa suelto o con la remera asomando abajo.',
    secreto: 'El punto calado pide una musculosa del mismo tono debajo: se ve prolijo y abriga el doble.' },

  { id: 'sweater-punto', nombre: 'Sweater polera Rosa niebla', cat: 'sweaters', precio: 62400, descuento: 0, img: 'p-sweater-punto',
    talles: ['Único'], colores: ['Rosa niebla', 'Negro'], stock: 10, destacado: true, nuevo: false,
    tela: 'Mezcla de lana merino y acrílico',
    desc: 'Polera de cuello corto y punto compacto. Abriga sin volumen, así que entra debajo de cualquier abrigo.',
    secreto: 'Es el único de la línea que no pica en el cuello: la merino va del lado de la piel.' },

  { id: 'sweater-crudo', nombre: 'Sweater tejido Crudo', cat: 'sweaters', precio: 54900, descuento: 20, img: 'p-sweater-crudo',
    talles: ['Único'], colores: ['Crudo'], stock: 5, destacado: false, nuevo: false,
    tela: 'Punto grueso de algodón peinado',
    desc: 'Tejido de trama gruesa y hombro caído. Es el de andar por casa que también sale a la calle.',
    secreto: 'Guardalo doblado, nunca colgado: el punto grueso se estira del hombro si vive en la percha.' },

  { id: 'remera-blanca', nombre: 'Remera algodón peinado Blanco', cat: 'remeras', precio: 24900, descuento: 0, img: 'p-remera-blanca',
    talles: TALLES_STD, colores: ['Blanco', 'Negro'], stock: 20, destacado: true, nuevo: false,
    tela: 'Algodón peinado 24/1, cuello reforzado',
    desc: 'La remera base: cuello que no se deforma, largo justo para usar adentro o afuera del pantalón.',
    secreto: 'El algodón peinado no transparenta, pero pedí un talle más si la vas a usar suelta.' },

  { id: 'remera-oversize', nombre: 'Remera oversize Blanco roto', cat: 'remeras', precio: 27500, descuento: 0, img: 'p-remera-detalle',
    talles: ['S', 'M', 'L'], colores: ['Blanco roto'], stock: 11, destacado: false, nuevo: true,
    tela: 'Jersey de algodón, gramaje medio',
    desc: 'Corte amplio de hombro caído y manga corta ancha. Pensada para llevarse suelta sobre pantalón recto.',
    secreto: 'Oversize no es un talle más grande: si te queda por debajo de la cadera, ya es camisón.' },

  { id: 'top-blanco', nombre: 'Musculosa canalé Blanco', cat: 'remeras', precio: 19900, descuento: 0, img: 'p-top-blanco',
    talles: ['S', 'M', 'L'], colores: ['Blanco', 'Negro'], stock: 16, destacado: false, nuevo: false,
    tela: 'Canalé de algodón con elastano',
    desc: 'Musculosa al cuerpo de tira ancha. La base que va debajo del blazer y del sweater calado.',
    secreto: 'La tira ancha tapa el corpiño: es la que se usa cuando el blazer va abierto.' },

  { id: 'blazer-rosa', nombre: 'Blazer oversize Rosa té', cat: 'chaquetas', precio: 118900, descuento: 0, img: 'p-blazer-rosa',
    talles: TALLES_STD, colores: ['Rosa té'], stock: 5, destacado: true, nuevo: true,
    tela: 'Gabardina de poliéster con caída',
    desc: 'Blazer de hombro marcado y solapa ancha, con forro entero. Cierra con un botón y cae recto.',
    secreto: 'El rosa té no es un color de temporada: combina igual con jean azul, negro y beige.' },

  { id: 'blazer-salvia', nombre: 'Blazer cruzado Salvia', cat: 'chaquetas', precio: 124500, descuento: 0, img: 'p-blazer-salvia',
    talles: TALLES_STD, colores: ['Salvia'], stock: 4, destacado: true, nuevo: false,
    tela: 'Paño liviano, forro de viscosa',
    desc: 'Cruzado de doble botonadura y largo por debajo de la cadera. El abrigo que hace de saco y de tapado.',
    secreto: 'El cruzado se usa abierto: cerrado agrega volumen justo donde no querés.' },

  { id: 'blazer-salmon', nombre: 'Blazer largo Terracota suave', cat: 'chaquetas', precio: 112900, descuento: 10, img: 'p-blazer-salmon',
    talles: TALLES_STD, colores: ['Terracota suave'], stock: 6, destacado: false, nuevo: false,
    tela: 'Lino y viscosa, textura visible',
    desc: 'Blazer largo de caída suelta, sin hombreras. Liviano para usar todo el año sobre una remera.',
    secreto: 'El lino se arruga y está bien: colgalo con vapor la noche anterior y listo.' },

  { id: 'blazer-frambuesa', nombre: 'Traje blazer Frambuesa', cat: 'chaquetas', precio: 132900, descuento: 0, img: 'p-blazer-frambuesa',
    talles: TALLES_STD, colores: ['Frambuesa'], stock: 3, destacado: false, nuevo: true,
    tela: 'Sarga de poliéster con leve stretch',
    desc: 'Blazer y pantalón al tono, se venden por separado. El color entero levanta cualquier salida.',
    secreto: 'Si el conjunto entero te intimida, usá sólo el blazer con jean: es el mismo look, más fácil.' },

  { id: 'traje-sentado', nombre: 'Traje sastrero Negro', cat: 'formal', precio: 158900, descuento: 0, img: 'p-traje-sentado',
    talles: TALLES_STD, colores: ['Negro'], stock: 4, destacado: true, nuevo: false,
    tela: 'Sarga de lana fría',
    desc: 'Saco de solapa fina y pantalón de pierna ancha, ambos con forro. El conjunto que resuelve una reunión o un casamiento.',
    secreto: 'La lana fría no da calor: es el negro que se puede usar en octubre sin arrepentirse.' },

  { id: 'traje-raya', nombre: 'Traje a rayas Grafito', cat: 'formal', precio: 164500, descuento: 0, img: 'p-traje-raya',
    talles: TALLES_STD, colores: ['Grafito'], stock: 3, destacado: false, nuevo: true,
    tela: 'Sarga con raya diplomática tejida',
    desc: 'Raya fina tejida, no estampada, que no se borra con el uso. Saco largo y pantalón de tiro alto.',
    secreto: 'La raya vertical estira: elegí el pantalón al tobillo para no cortar la línea.' },

  { id: 'traje-negro', nombre: 'Blazer y pantalón Negro noche', cat: 'formal', precio: 152900, descuento: 12, img: 'p-traje-negro',
    talles: TALLES_STD, colores: ['Negro'], stock: 5, destacado: false, nuevo: false,
    tela: 'Crepé de poliéster mate',
    desc: 'Blazer entallado y pantalón recto en negro mate, sin brillo. Se lleva con remera blanca de día y con top de noche.',
    secreto: 'El crepé mate no marca las pelusas: es el negro que sobrevive a un auto y a un abrazo.' },

  { id: 'pantalon-terracota', nombre: 'Pantalón sastrero Terracota', cat: 'formal', precio: 86900, descuento: 0, img: 'p-pantalon-terracota',
    talles: TALLES_STD, colores: ['Terracota'], stock: 8, destacado: true, nuevo: false,
    tela: 'Paño liviano con pinzas',
    desc: 'Tiro alto, pinzas al frente y pierna ancha con caída. Sale de la oficina y sigue de largo.',
    secreto: 'Las pinzas piden algo ajustado arriba: con remera suelta se pierde toda la cintura.' },

  { id: 'pantalon-ladrillo', nombre: 'Pantalón recto Ladrillo', cat: 'formal', precio: 79500, descuento: 0, img: 'p-pantalon-detalle',
    talles: TALLES_STD, colores: ['Ladrillo'], stock: 7, destacado: false, nuevo: false,
    tela: 'Bengalina con elastano',
    desc: 'Recto de pierna angosta y largo al empeine. La bengalina acompaña el movimiento sin marcar.',
    secreto: 'El largo al empeine funciona con zapato bajo: con taco, subilo dos dedos.' }
];

const PROBADOR = {
  arriba: [
    { id: 'remera-blanca', t: 'basico', et: 'Remera blanca' },
    { id: 'top-blanco', t: 'ajustado', et: 'Musculosa canalé' },
    { id: 'sweater-terracota', t: 'tejido', et: 'Sweater calado' },
    { id: 'sweater-punto', t: 'tejido', et: 'Polera de punto' }
  ],
  abajo: [
    { id: 'jean-recto', t: 'jean', et: 'Jean recto' },
    { id: 'jean-wide', t: 'amplio', et: 'Jean wide leg' },
    { id: 'pantalon-terracota', t: 'amplio', et: 'Pantalón con pinzas' },
    { id: 'jean-mom', t: 'jean', et: 'Jean mom' }
  ],
  abrigo: [
    { id: 'blazer-salvia', t: 'largo', et: 'Blazer cruzado' },
    { id: 'blazer-rosa', t: 'oversize', et: 'Blazer oversize' },
    { id: 'blazer-frambuesa', t: 'color', et: 'Blazer frambuesa' },
    { id: null, t: 'ninguno', et: 'Sin abrigo' }
  ]
};

const DESTACADOS = ['jean-recto', 'sweater-terracota', 'blazer-salvia', 'remera-blanca', 'traje-sentado', 'jean-clasico', 'blazer-rosa', 'pantalon-terracota'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const talleDefault = p => p.talles.includes('40') ? '40' : p.talles[Math.min(1, p.talles.length - 1)];
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
  KEY: 'secretoscompartidos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = null, color = null) {
    const items = this.get();
    const t = talle || talleDefault(producto);
    const c = color || producto.colores[0];
    const existing = items.find(i => i.id === producto.id && i.talle === t && i.color === c);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle: t, color: c, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(linea, qty) {
    const items = this.get();
    const it = items.find(i => lineaKey(i) === linea); if (!it) return;
    const p = getProducto(it.id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(linea) { this.save(this.get().filter(i => lineaKey(i) !== linea)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};
const lineaKey = i => `${i.id}|${i.talle}|${i.color}`;

const WSP = '5492494691266';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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

function cardHTML(p, { rail = false } = {}) {
  const fin = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="prod-badge">-${p.descuento}%</span>`
    : (p.nuevo ? '<span class="prod-badge is-nuevo">Nuevo</span>' : '');
  const precio = p.descuento > 0
    ? `<span>${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span>${formatearPrecio(fin)}</span>`;
  return `
  <article class="prod${rail ? ' rail-card' : ''}" data-id="${p.id}" data-animate style="transform:translateY(30px);opacity:0">
    <button type="button" class="prod-media" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="images/${p.img}-sm.webp" srcset="images/${p.img}-sm.webp 640w, images/${p.img}.webp 1200w" sizes="(max-width: 640px) 46vw, (max-width: 1080px) 30vw, 300px" alt="${esc(p.nombre)}" width="640" height="800" decoding="async">
      ${badge}
      <span class="prod-secreto"><b>El secreto</b>${esc(p.secreto)}</span>
    </button>
    <div class="prod-info">
      <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
      <h3 class="prod-name">${esc(p.nombre)}</h3>
      <p class="prod-price">${precio}</p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Quitar una unidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        <button type="button" class="prod-buy" data-buy="${p.id}">Comprar</button>
      </div>
    </div>
  </article>`;
}

let revealsListos = false;

function initReveals() {
  revealsListos = true;
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

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <a class="cat-card" href="#tienda" data-cat="${c.id}" data-animate style="transform:translateY(26px) scale(.96);opacity:0">
      <span class="cat-media"><img src="images/${c.img}${c.img.startsWith('p-') ? '-sm' : ''}.webp" alt="${esc(c.nombre)}" width="640" height="800" decoding="async"></span>
      <span class="cat-foot">
        <span class="cat-name">${esc(c.nombre)}</span>
        <span class="cat-num">${c.num}</span>
      </span>
    </a>`).join('');
  grid.querySelectorAll('[data-cat]').forEach(a => {
    a.addEventListener('click', () => { aplicarCategoria(a.dataset.cat); });
  });
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = DESTACADOS.map(getProducto).filter(Boolean).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, { rail: true })).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * 0.72;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if ((e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

const estado = { q: '', cat: 'todas', talle: '', orden: 'destacado', visibles: 16 };

function filtrados() {
  const q = normalizar(estado.q).trim();
  let out = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (estado.talle && !p.talles.includes(estado.talle)) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, nombreCat(p.cat), p.tela, p.desc, p.colores.join(' ')].join(' '));
    return q.split(/\s+/).every(w => heno.includes(w));
  });
  if (estado.orden === 'menor') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'mayor') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else out = out.slice().sort((a, b) => (b.destacado - a.destacado) || (b.nuevo - a.nuevo));
  return out;
}

function pintarCatalogo({ conFlip = false } = {}) {
  const grid = document.getElementById('grid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!grid) return;

  const lista = filtrados();
  const flipState = (conFlip && !reduceMotion && typeof window.Flip !== 'undefined')
    ? window.Flip.getState(grid.querySelectorAll('.prod')) : null;

  grid.innerHTML = lista.slice(0, estado.visibles).map(p => cardHTML(p)).join('');
  vacio.hidden = lista.length !== 0;
  grid.hidden = lista.length === 0;
  verMas.hidden = lista.length <= estado.visibles;
  res.textContent = lista.length === 1 ? '1 prenda' : `${lista.length} prendas`;

  if (flipState) window.Flip.from(flipState, { duration: 0.5, ease: 'power2.out', stagger: 0.02, absolute: true });
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCategoria(cat) {
  estado.cat = cat;
  estado.visibles = 16;
  document.querySelectorAll('#chipsCat .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chip === cat)));
  pintarCatalogo({ conFlip: true });
}

function initCatalogo() {
  const chips = document.getElementById('chipsCat');
  chips.innerHTML = [{ id: 'todas', nombre: 'Todas' }, ...CATEGORIAS]
    .map(c => `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="${c.id === 'todas'}">${esc(c.nombre)}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (b) aplicarCategoria(b.dataset.chip);
  });

  const q = document.getElementById('q');
  let t = null;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value; estado.visibles = 16; pintarCatalogo({ conFlip: true }); }, 180);
  });

  document.getElementById('fTalle').addEventListener('change', e => { estado.talle = e.target.value; estado.visibles = 16; pintarCatalogo({ conFlip: true }); });
  document.getElementById('fOrden').addEventListener('change', e => { estado.orden = e.target.value; estado.visibles = 16; pintarCatalogo({ conFlip: true }); });

  const limpiar = () => {
    estado.q = ''; estado.cat = 'todas'; estado.talle = ''; estado.orden = 'destacado'; estado.visibles = 16;
    q.value = ''; document.getElementById('fTalle').value = ''; document.getElementById('fOrden').value = 'destacado';
    document.querySelectorAll('#chipsCat .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chip === 'todas')));
    pintarCatalogo({ conFlip: true });
  };
  document.getElementById('limpiar').addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar').addEventListener('click', limpiar);
  document.getElementById('verMas').addEventListener('click', () => { estado.visibles += 16; pintarCatalogo(); });

  pintarCatalogo();
}

function qtyDe(scope, id) {
  const st = scope.querySelector(`[data-stepper="${id}"] [data-qty]`);
  return st ? parseInt(st.textContent, 10) || 1 : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = step.parentElement.querySelector('[data-qty]');
      const p = getProducto(step.parentElement.dataset.stepper);
      const n = Math.max(1, Math.min((parseInt(span.textContent, 10) || 1) + Number(step.dataset.step), p?.stock ?? 99));
      span.textContent = n;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(add.closest('.prod') || document, p.id));
      showToast('¡Agregada! Te espera en el carrito');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, qtyDe(buy.closest('.prod') || document, p.id));
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });
}

let drawerVuelta = null;

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  drawerVuelta = document.activeElement;
  pintarDrawer();
  bd.hidden = false; dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose').focus();
}

function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  dr.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; bd.hidden = true; }, 380);
  drawerVuelta?.focus();
}

function pintarDrawer() {
  const body = document.getElementById('drawerBody');
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="dr-vacio"><strong>Todavía no elegiste nada</strong><p>Empezá por las prendas más pedidas — o escribinos y te ayudamos a elegir.</p><a class="btn btn-ink" href="#elegidos" data-cerrar-drawer>Ver los más elegidos</a></div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `<div class="dr-item" data-linea="${esc(lineaKey(i))}">
        <img src="images/${p.img}-sm.webp" alt="${esc(p.nombre)}" width="74" height="92" decoding="async">
        <div>
          <p class="dr-name">${esc(p.nombre)}</p>
          <p class="dr-meta">Talle ${esc(i.talle)} · ${esc(i.color)}</p>
          <div class="dr-row">
            <div class="stepper">
              <button type="button" data-dr="-1" aria-label="Quitar una unidad">−</button>
              <span>${i.qty}</span>
              <button type="button" data-dr="1" aria-label="Sumar una unidad">+</button>
            </div>
            <span class="dr-price">${formatearPrecio(precioFinal(p) * i.qty)}</span>
          </div>
          <button type="button" class="dr-del" data-del>Quitar</button>
        </div>
      </div>`;
    }).join('');
  }
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
  const detalle = items.map(i => { const p = getProducto(i.id); return p ? `${i.qty} x ${p.nombre} (talle ${i.talle})` : ''; }).filter(Boolean).join(', ');
  document.getElementById('drawerWsp').href = wspLink(
    items.length ? `Hola Secretos Compartidos, quiero consultar por este pedido: ${detalle}. Total ${formatearPrecio(Cart.total())}.`
                 : 'Hola Secretos Compartidos, quiero una mano para elegir una prenda.'
  );
}

function initDrawer() {
  document.getElementById('cartBtn').addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose').addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBody').addEventListener('click', e => {
    const cont = e.target.closest('[data-linea]');
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (!cont) return;
    const linea = cont.dataset.linea;
    if (e.target.closest('[data-del]')) { Cart.remove(linea); return; }
    const st = e.target.closest('[data-dr]');
    if (st) {
      const actual = Cart.get().find(i => lineaKey(i) === linea);
      if (actual) Cart.setQty(linea, actual.qty + Number(st.dataset.dr));
    }
  });
  document.getElementById('checkout').addEventListener('click', () => {
    if (!Cart.count()) { showToast('Tu carrito todavía está vacío'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (!document.getElementById('drawer').hidden) pintarDrawer(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('drawer').hidden) cerrarDrawer();
  });
}

let modalVuelta = null;
let modalSel = { talle: null, color: null, qty: 1 };

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const bd = document.getElementById('modalBackdrop');
  const cont = document.getElementById('modalIn');
  modalVuelta = document.activeElement;
  modalSel = { talle: talleDefault(p), color: p.colores[0], qty: 1 };

  const fin = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `
    <div class="mo-media">
      <img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="1200" height="1500" decoding="async">
    </div>
    <div class="mo-body">
      <p class="mo-cat">${esc(nombreCat(p.cat))}</p>
      <h2 class="mo-name">${esc(p.nombre)}</h2>
      <p class="mo-price">${p.descuento > 0 ? `<span>${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s>` : `<span>${formatearPrecio(fin)}</span>`}</p>
      <p class="mo-desc">${esc(p.desc)}</p>
      <p class="mo-desc"><b>Tela:</b> ${esc(p.tela)}</p>
      <div class="mo-secreto"><b>El secreto</b><i>${esc(p.secreto)}</i></div>
      <div class="mo-group">
        <p>Talle</p>
        <div class="mo-opts" id="moTalles" role="group" aria-label="Elegí el talle">
          ${p.talles.map(t => `<button type="button" class="mo-opt" data-talle="${esc(t)}" aria-pressed="${t === modalSel.talle}">${esc(t)}</button>`).join('')}
        </div>
      </div>
      <div class="mo-group">
        <p>Color</p>
        <div class="mo-opts" id="moColores" role="group" aria-label="Elegí el color">
          ${p.colores.map(c => `<button type="button" class="mo-opt" data-color="${esc(c)}" aria-pressed="${c === modalSel.color}">${esc(c)}</button>`).join('')}
        </div>
      </div>
      <div class="mo-group">
        <p>Cantidad</p>
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Quitar una unidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">+</button>
        </div>
      </div>
      <div class="mo-actions">
        <button type="button" class="btn btn-ink" id="moAdd"><span>Agregar al carrito</span></button>
        <button type="button" class="btn btn-line" id="moBuy"><span>Comprar ahora</span></button>
      </div>
      ${rel.length ? `<div class="mo-rel"><p>También te puede interesar</p><div class="mo-rel-grid">
        ${rel.map(r => `<button type="button" class="mo-rel-card" data-ver="${r.id}"><img src="images/${r.img}-sm.webp" alt="${esc(r.nombre)}" width="640" height="800" decoding="async"><p>${esc(r.nombre)}</p></button>`).join('')}
      </div></div>` : ''}
    </div>`;

  cont.querySelector('#moTalles')?.addEventListener('click', e => {
    const b = e.target.closest('[data-talle]'); if (!b) return;
    modalSel.talle = b.dataset.talle;
    cont.querySelectorAll('#moTalles .mo-opt').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  });
  cont.querySelector('#moColores')?.addEventListener('click', e => {
    const b = e.target.closest('[data-color]'); if (!b) return;
    modalSel.color = b.dataset.color;
    cont.querySelectorAll('#moColores .mo-opt').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  });
  const agregar = () => Cart.add(p, qtyDe(cont, p.id), modalSel.talle, modalSel.color);
  cont.querySelector('#moAdd').addEventListener('click', () => { agregar(); showToast('¡Agregada! Te espera en el carrito'); });
  cont.querySelector('#moBuy').addEventListener('click', () => { agregar(); cerrarModal(); abrirDrawer(); });

  document.getElementById('modalBox')?.setAttribute('aria-label', p.nombre);
  inyectarLdProducto(p, fin);
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function cerrarModal() {
  document.getElementById('modalBackdrop').hidden = true;
  document.body.classList.remove('no-scroll');
  modalVuelta?.focus();
}

function inyectarLdProducto(p, fin) {
  let s = document.getElementById('ldProducto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.nombre, description: p.desc,
    image: `https://gokywebs.com/demo/secretoscompartidos/images/${p.img}.webp`,
    category: nombreCat(p.cat), brand: { '@type': 'Brand', name: 'Secretos Compartidos' },
    offers: { '@type': 'Offer', price: fin, priceCurrency: 'ARS', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modalBackdrop').hidden) cerrarModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const bd = document.getElementById('modalBackdrop');
    const dr = document.getElementById('drawer');
    const box = !bd.hidden ? bd.querySelector('.modal') : (!dr.hidden ? dr : null);
    if (!box) return;
    const f = [...box.querySelectorAll('button, a[href], input, select, textarea')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

const pbSel = { arriba: 'sweater-terracota', abajo: 'jean-recto', abrigo: 'blazer-salvia' };

function pbOpcion(slot, id) { return PROBADOR[slot].find(o => o.id === id) || PROBADOR[slot][0]; }

function secretoDelLook() {
  const a = pbOpcion('arriba', pbSel.arriba);
  const b = pbOpcion('abajo', pbSel.abajo);
  const c = pbOpcion('abrigo', pbSel.abrigo);
  if (c.t === 'ninguno' && a.t === 'tejido') return 'Sin abrigo, el tejido es el protagonista: dejalo suelto y llevá el pantalón al tobillo para que se vea el calzado.';
  if (c.t === 'ninguno') return 'Sin abrigo el juego es de proporciones: si arriba va suelto, abajo va recto; si arriba va al cuerpo, dale volumen abajo.';
  if (b.t === 'amplio' && a.t === 'tejido') return 'Tejido con pantalón amplio: metelo apenas adelante para que se vea la cintura y el conjunto no se apague.';
  if (b.t === 'amplio') return 'Pantalón amplio con blazer: remera adentro y una base con plataforma, para que el ruedo no te coma altura.';
  if (a.t === 'tejido') return 'Sweater debajo del blazer: pedí el blazer un talle más grande, así el tejido no te tira de los hombros.';
  if (a.t === 'ajustado' && c.t === 'oversize') return 'Musculosa al cuerpo y blazer oversize: el contraste de volúmenes es lo que hace que el look se vea armado.';
  if (c.t === 'color') return 'Cuando el abrigo trae el color, arriba y abajo van neutros: el blazer hace todo el trabajo solo.';
  return 'Base blanca, jean y blazer abierto: el uniforme que nunca falla, y sobre el que después probás todo lo demás.';
}

function pintarProbador() {
  const strip = document.getElementById('pbStrip');
  const orden = ['abrigo', 'arriba', 'abajo'];
  strip.innerHTML = orden.map(slot => {
    const op = pbOpcion(slot, pbSel[slot]);
    const p = op.id ? getProducto(op.id) : null;
    if (!p) return `<div class="pb-slot pb-slot-empty">Sin abrigo</div>`;
    return `<figure class="pb-slot"><img src="images/${p.img}-sm.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"><figcaption>${esc(p.nombre)}</figcaption></figure>`;
  }).join('');

  const total = orden.reduce((s, slot) => {
    const op = pbOpcion(slot, pbSel[slot]);
    const p = op.id ? getProducto(op.id) : null;
    return p ? s + precioFinal(p) : s;
  }, 0);
  document.getElementById('pbTotal').textContent = formatearPrecio(total);
  document.getElementById('pbSecreto').textContent = secretoDelLook();
}

function initProbador() {
  document.querySelectorAll('.pb-row').forEach(row => {
    const slot = row.dataset.slot;
    const cont = row.querySelector('.pb-chips');
    cont.innerHTML = PROBADOR[slot].map(o => {
      const p = o.id ? getProducto(o.id) : null;
      return `<button type="button" class="pb-chip${p ? '' : ' pb-chip-none'}" data-slot="${slot}" data-op="${o.id || ''}" aria-pressed="${(o.id || null) === pbSel[slot]}">
        ${p ? `<img src="images/${p.img}-sm.webp" alt="" width="640" height="800" decoding="async">` : ''}
        <span>${esc(o.et)}</span>
      </button>`;
    }).join('');
    cont.addEventListener('click', e => {
      const b = e.target.closest('[data-op]');
      if (!b) return;
      pbSel[slot] = b.dataset.op || null;
      cont.querySelectorAll('.pb-chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarProbador();
    });
  });

  document.getElementById('pbAdd').addEventListener('click', () => {
    let n = 0;
    ['arriba', 'abajo', 'abrigo'].forEach(slot => {
      const op = pbOpcion(slot, pbSel[slot]);
      const p = op.id ? getProducto(op.id) : null;
      if (p) { Cart.add(p, 1); n++; }
    });
    showToast(`${n} prendas agregadas — el look completo está en tu carrito`);
  });

  document.getElementById('pbVer').addEventListener('click', () => {
    const op = pbOpcion('arriba', pbSel.arriba);
    const p = op.id ? getProducto(op.id) : null;
    aplicarCategoria(p ? p.cat : 'todas');
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  pintarProbador();
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
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

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;

  const heroImg = document.querySelector('.hero-main img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out', delay: .1 });

  gsap.utils.toArray('.nos-media img, .cierre-bg').forEach(el => {
    gsap.fromTo(el, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: .5 }
    });
  });

  const over = document.querySelector('.elegidos > .oversized');
  if (over) {
    gsap.to(over, {
      xPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.elegidos', start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initLectura() {
  const el = document.getElementById('lectura');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span>${esc(p)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('span')];
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    spans.forEach(s => s.classList.add('on'));
    return;
  }
  ScrollTrigger.create({
    trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: .4,
    onUpdate: self => {
      const corte = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < corte));
    }
  });
}

const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

initMovimiento();
initCategorias();
initRail();
initCatalogo();
initProbador();
initReveals();
initNav();
initAcciones();
initDrawer();
initModal();
initFloats();
initLectura();
initFeedbackFloat();

document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
