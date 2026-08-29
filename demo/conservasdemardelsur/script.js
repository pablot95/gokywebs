document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492291458018';
const SITIO = 'https://gokywebs.com/demo/conservasdemardelsur/';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const wspLink = texto => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);

const CATEGORIAS = [
  { id: 'conservas', nombre: 'Conservas y escabeches', bajada: 'Berenjenas, tomates y verduras en aceite', img: 'etiqueta-berenjenas.webp', w: 704, h: 704 },
  { id: 'mermeladas', nombre: 'Mermeladas y dulces', bajada: 'Higo, mandarina, frutilla y ciruela', img: 'etiqueta-higo.webp', w: 698, h: 698 },
  { id: 'miel', nombre: 'Miel y colmena', bajada: 'Multifloral, panal y propóleo', img: 'colmenas.webp', w: 900, h: 900 },
  { id: 'cajas', nombre: 'Cajas y combos', bajada: 'Para regalar o probar de todo', img: 'caja-regalo.webp', w: 900, h: 900 }
];

const PRODUCTOS = [
  {
    id: 'berenjenas-aceite', nombre: 'Berenjenas en aceite', cat: 'conservas', sabores: ['salado'],
    precio: 6500, descuento: 0, medida: 'Frasco 380 g', destacado: true, relleno: '#7B3F6E',
    img: 'etiqueta-berenjenas.webp', w: 704, h: 704,
    alt: 'Etiqueta de las berenjenas en aceite de Conservas de Mar del Sur',
    desc: 'Berenjenas cortadas finas, blanqueadas en vinagre y cubiertas de aceite con ajo y orégano. Abrís el frasco y ya están listas para la picada, la tostada o el sándwich.',
    ingredientes: 'Berenjena, aceite, vinagre de alcohol, ajo, orégano, ají molido y sal.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera y siempre cubierto de aceite.'
  },
  {
    id: 'escabeche-verduras', nombre: 'Escabeche de verduras', cat: 'conservas', sabores: ['salado'],
    precio: 5900, descuento: 0, medida: 'Frasco 500 g', destacado: true, relleno: '#B8871F',
    img: 'escabeche-verduras.webp', w: 900, h: 900,
    alt: 'Frascos de escabeche de verduras caseras',
    desc: 'Zanahoria, coliflor, morrón y cebolla en escabeche suave. Quedan crocantes: se cortan gruesas y se cocinan lo justo para que no se ablanden.',
    ingredientes: 'Zanahoria, coliflor, morrón, cebolla, aceite, vinagre, laurel, pimienta en grano y sal.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera hasta 3 semanas.'
  },
  {
    id: 'tomates-secos', nombre: 'Tomates secos en aceite de oliva', cat: 'conservas', sabores: ['salado'],
    precio: 7200, descuento: 0, medida: 'Frasco 250 g', destacado: true, relleno: '#8E2C1C',
    img: 'tomates-secos.webp', w: 900, h: 900,
    alt: 'Frasco de tomates secos en aceite de oliva con romero',
    desc: 'Tomates secados al sol, hidratados y guardados en aceite de oliva con romero y ajo. El aceite que queda al final también se usa: va bárbaro sobre pastas.',
    ingredientes: 'Tomate perita deshidratado, aceite de oliva, ajo, romero y sal marina.',
    conservacion: 'En lugar fresco y oscuro. Una vez abierto, en la heladera.'
  },
  {
    id: 'mermelada-higo', nombre: 'Mermelada artesanal de higo', cat: 'mermeladas', sabores: ['dulce'],
    precio: 5400, descuento: 0, medida: 'Frasco 380 g', destacado: true, relleno: '#6B2036',
    img: 'etiqueta-higo.webp', w: 698, h: 698,
    alt: 'Etiqueta de la mermelada artesanal de higo de Conservas de Mar del Sur',
    desc: 'Higos seleccionados de los huertos de acá, cocidos enteros a fuego bajo. Queda espesa y con trozos de fruta, sin nada que la espese de más.',
    ingredientes: 'Higo, azúcar y jugo de limón.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera hasta 4 semanas.'
  },
  {
    id: 'mermelada-mandarina', nombre: 'Mermelada de mandarina y manzana', cat: 'mermeladas', sabores: ['dulce'],
    precio: 5200, descuento: 10, medida: 'Frasco 380 g', destacado: true, relleno: '#C46A15',
    img: 'etiqueta-mandarina.webp', w: 692, h: 692,
    alt: 'Etiqueta de la mermelada de mandarina y manzana de Conservas de Mar del Sur',
    desc: 'La mandarina va con su cáscara y la manzana le da el punto sin agregar nada. Ácida y dulce al mismo tiempo, va bárbara con tostadas y con queso.',
    ingredientes: 'Mandarina, manzana, azúcar y jugo de limón.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera hasta 4 semanas.'
  },
  {
    id: 'mermelada-frutilla', nombre: 'Mermelada de frutilla', cat: 'mermeladas', sabores: ['dulce'],
    precio: 5600, descuento: 0, medida: 'Frasco 380 g', destacado: true, relleno: '#A3213A',
    img: 'mermelada-frutilla.webp', w: 900, h: 900,
    alt: 'Frasco de mermelada de frutilla casera con frutillas frescas',
    desc: 'Frutilla de temporada, azúcar y limón, nada más. Las tandas son cortas y salen cuando hay fruta buena: cuando se termina, hay que esperar la próxima.',
    ingredientes: 'Frutilla, azúcar y jugo de limón.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera hasta 4 semanas.'
  },
  {
    id: 'dulce-ciruela', nombre: 'Dulce de ciruela con nuez', cat: 'mermeladas', sabores: ['dulce'],
    precio: 6100, descuento: 0, medida: 'Frasco 380 g', destacado: false, relleno: '#4E1327',
    img: 'dulce-ciruela.webp', w: 900, h: 900,
    alt: 'Frasco de dulce de ciruela oscuro con nueces sobre una tabla',
    desc: 'Ciruela oscura reducida despacio, con nueces enteras adentro. Es el más denso de todos y el que mejor va con quesos.',
    ingredientes: 'Ciruela, azúcar, nuez y jugo de limón.',
    conservacion: 'En lugar fresco. Una vez abierto, en la heladera hasta 4 semanas.'
  },
  {
    id: 'miel-multifloral', nombre: 'Miel multifloral de El Sudeste', cat: 'miel', sabores: ['dulce'],
    precio: 8900, descuento: 0, medida: 'Frasco 500 g', destacado: true, relleno: '#C98A16',
    img: 'etiqueta-miel.webp', w: 1024, h: 1024,
    alt: 'Etiqueta de la miel multifloral de Conservas de Mar del Sur',
    desc: 'Miel pura de las colmenas de El Sudeste, sin pasteurizar ni filtrar. Con el frío se pone sólida: eso es señal de que está entera, se vuelve líquida a baño maría.',
    ingredientes: 'Miel pura multifloral. Nada más.',
    conservacion: 'A temperatura ambiente, lejos del sol. No va a la heladera.'
  },
  {
    id: 'tintura-propoleo', nombre: 'Tintura de propóleo', cat: 'miel', sabores: ['dulce'],
    precio: 7400, descuento: 0, medida: 'Gotero 30 ml', destacado: false, relleno: '#6B3A0E',
    img: 'etiqueta-propoleo.webp', w: 704, h: 704,
    alt: 'Etiqueta de la tintura de propóleo de Conservas de Mar del Sur',
    desc: 'Propóleo de las mismas colmenas, macerado y filtrado, en frasco gotero color caramelo para que no le entre la luz.',
    ingredientes: 'Propóleo y alcohol de cereal.',
    conservacion: 'En lugar fresco y oscuro. No apto para menores de 2 años.'
  },
  {
    id: 'miel-panal', nombre: 'Miel en panal', cat: 'miel', sabores: ['dulce'],
    precio: 12500, descuento: 0, medida: 'Frasco 400 g', destacado: false, relleno: '#D89A1E',
    img: 'miel-panal.webp', w: 900, h: 900,
    alt: 'Panal de abejas con miel cayendo de una cuchara',
    desc: 'Un trozo de panal entero adentro del frasco, con su miel alrededor. Se come tal cual, cera incluida, arriba de una tostada.',
    ingredientes: 'Panal y miel pura multifloral.',
    conservacion: 'A temperatura ambiente, lejos del sol.'
  },
  {
    id: 'caja-mardelsur', nombre: 'Caja Mar del Sur — 6 frascos', cat: 'cajas', sabores: ['dulce', 'salado'],
    precio: 32000, descuento: 12, medida: 'Caja de 6 frascos', destacado: true, relleno: '#8A6D1F',
    img: 'caja-regalo.webp', w: 900, h: 900,
    alt: 'Frascos envueltos en papel e hilo, listos para regalar',
    desc: 'Dos mermeladas, dos conservas, la miel multifloral y la tintura de propóleo. Van envueltos en papel, atados con hilo y con una tarjeta escrita a mano si me decís qué poner.',
    ingredientes: 'Higo · Mandarina y manzana · Berenjenas en aceite · Tomates secos · Miel multifloral · Tintura de propóleo.',
    conservacion: 'Cada frasco con su indicación. La caja se arma el mismo día que sale.'
  },
  {
    id: 'combo-desayuno', nombre: 'Combo desayuno de la costa', cat: 'cajas', sabores: ['dulce'],
    precio: 18500, descuento: 0, medida: 'Combo de 3 frascos', destacado: false, relleno: '#C46A15',
    img: 'desayuno-costa.webp', w: 900, h: 900,
    alt: 'Pan con miel y mermeladas servidos en una mesa de desayuno',
    desc: 'La miel multifloral, la mermelada de higo y la de mandarina y manzana. Es el combo para arrancar el día: dulce, miel y pan.',
    ingredientes: 'Miel multifloral 500 g · Mermelada de higo 380 g · Mermelada de mandarina y manzana 380 g.',
    conservacion: 'La miel a temperatura ambiente; las mermeladas, en la heladera una vez abiertas.'
  }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);

const Cart = {
  KEY: 'cmds_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function precioHTML(p) {
  const fin = precioFinal(p);
  if (p.descuento > 0) {
    return '<span class="con-desc">' + formatearPrecio(fin) + '</span><s>' + formatearPrecio(p.precio) + '</s>';
  }
  return '<span>' + formatearPrecio(fin) + '</span>';
}

function cardHTML(p, ctx) {
  const cat = getCategoria(p.cat);
  const badge = p.descuento > 0
    ? '<span class="prod-badge">-' + p.descuento + '%</span>'
    : (p.destacado && ctx === 'catalogo' ? '<span class="prod-badge">Más elegido</span>' : '');
  return '<article class="prod" data-id="' + esc(p.id) + '" data-animate style="transform:translateY(30px) scale(.96);opacity:0">' +
    '<div class="prod-media">' +
      '<img src="images/' + esc(p.img) + '" alt="' + esc(p.alt) + '" width="' + p.w + '" height="' + p.h + '">' +
      badge +
      '<svg class="prod-marco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="98" height="98" rx="3"/></svg>' +
      '<button type="button" class="prod-ver" data-ver="' + esc(p.id) + '">Ver más</button>' +
    '</div>' +
    '<div class="prod-info">' +
      '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
      '<h3 class="prod-nombre">' + esc(p.nombre) + '</h3>' +
      '<p class="prod-precio">' + precioHTML(p) + '<span class="prod-medida">' + esc(p.medida.replace(/^(Frasco|Gotero|Caja de|Combo de)\s*/, '')) + '</span></p>' +
      '<div class="prod-actions">' +
        '<div class="stepper" data-stepper="' + esc(p.id) + '">' +
          '<button type="button" data-paso="-1" aria-label="Quitar una unidad de ' + esc(p.nombre) + '">−</button>' +
          '<span data-qty>1</span>' +
          '<button type="button" data-paso="1" aria-label="Sumar una unidad de ' + esc(p.nombre) + '">+</button>' +
        '</div>' +
        '<button type="button" class="prod-add" data-add="' + esc(p.id) + '">Agregar</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.07, 0.5) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c =>
    '<a class="cat-card" href="#tienda" data-cat="' + esc(c.id) + '" data-animate style="transform:translateY(28px);opacity:0">' +
      '<div class="cat-media">' +
        '<img src="images/' + esc(c.img) + '" alt="' + esc(c.nombre) + '" width="' + c.w + '" height="' + c.h + '">' +
        '<span class="cat-velo"></span>' +
      '</div>' +
      '<div class="cat-placa"><h3>' + esc(c.nombre) + '</h3><span>' + esc(c.bajada) + '</span></div>' +
    '</a>'
  ).join('');

  cont.addEventListener('click', e => {
    const link = e.target.closest('[data-cat]');
    if (!link) return;
    aplicarCategoria(link.dataset.cat);
  });
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, 'rail')).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');

  const paso = () => {
    const card = track.querySelector('.prod');
    return card ? card.getBoundingClientRect().width + 14 : 260;
  };
  const sincronizarFlechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sincronizarFlechas, { passive: true });
  window.addEventListener('resize', sincronizarFlechas, { passive: true });
  sincronizarFlechas();

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    down = true; moved = false;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
    pointerId = e.pointerId;
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
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      setTimeout(() => { moved = false; }, 0);
    }
    pointerId = null;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

const estado = { cat: 'todas', sabor: 'todos', q: '', orden: 'destacados', visibles: 16 };
const PASO_CATALOGO = 16;

function productosFiltrados() {
  const q = normalizar(estado.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (estado.sabor !== 'todos' && !p.sabores.includes(estado.sabor)) return false;
    if (!q) return true;
    const cat = getCategoria(p.cat);
    const heno = normalizar([p.nombre, cat?.nombre, p.desc, p.ingredientes, p.medida, p.sabores.join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  const orden = estado.orden;
  lista = lista.slice().sort((a, b) => {
    if (orden === 'precio-asc') return precioFinal(a) - precioFinal(b);
    if (orden === 'precio-desc') return precioFinal(b) - precioFinal(a);
    if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
    return (b.destacado === true) - (a.destacado === true);
  });
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('catalogoVacio');
  const contador = document.getElementById('contadorResultados');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiarFiltros');
  if (!grid) return;

  const lista = productosFiltrados();
  const mostrar = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrar.map(p => cardHTML(p, 'catalogo')).join('');

  if (vacio) vacio.hidden = lista.length !== 0;
  grid.hidden = lista.length === 0;
  if (contador) contador.textContent = lista.length === 1 ? '1 frasco' : lista.length + ' frascos';
  if (verMas) verMas.hidden = lista.length <= mostrar.length;
  if (limpiar) limpiar.hidden = estado.cat === 'todas' && estado.sabor === 'todos' && !estado.q;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCategoria(id) {
  estado.cat = id;
  estado.visibles = PASO_CATALOGO;
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('activo', c.dataset.valor === id));
  renderCatalogo();
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCat');
  const chipsSabor = document.getElementById('chipsSabor');
  const buscar = document.getElementById('buscar');
  const buscarClear = document.getElementById('buscarClear');
  const orden = document.getElementById('orden');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiarFiltros');
  const vacioReset = document.getElementById('vacioReset');

  if (chipsCat) {
    chipsCat.innerHTML = '<button type="button" class="chip activo" data-valor="todas">Todo</button>' +
      CATEGORIAS.map(c => '<button type="button" class="chip" data-valor="' + esc(c.id) + '">' + esc(c.nombre) + '</button>').join('');
    chipsCat.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      aplicarCategoria(chip.dataset.valor);
    });
  }

  if (chipsSabor) {
    const sabores = [['todos', 'Dulce y salado'], ['dulce', 'Dulces'], ['salado', 'Salados']];
    chipsSabor.innerHTML = sabores.map(([v, t], i) =>
      '<button type="button" class="chip' + (i === 0 ? ' activo' : '') + '" data-valor="' + v + '">' + t + '</button>').join('');
    chipsSabor.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      estado.sabor = chip.dataset.valor;
      estado.visibles = PASO_CATALOGO;
      chipsSabor.querySelectorAll('.chip').forEach(c => c.classList.toggle('activo', c === chip));
      renderCatalogo();
    });
  }

  let t = null;
  buscar?.addEventListener('input', () => {
    if (buscarClear) buscarClear.hidden = !buscar.value;
    clearTimeout(t);
    t = setTimeout(() => {
      estado.q = buscar.value;
      estado.visibles = PASO_CATALOGO;
      renderCatalogo();
    }, 180);
  });
  buscarClear?.addEventListener('click', () => {
    buscar.value = '';
    buscarClear.hidden = true;
    estado.q = '';
    estado.visibles = PASO_CATALOGO;
    renderCatalogo();
    buscar.focus();
  });

  orden?.addEventListener('change', () => {
    estado.orden = orden.value;
    estado.visibles = PASO_CATALOGO;
    renderCatalogo();
  });

  verMas?.addEventListener('click', () => {
    estado.visibles += PASO_CATALOGO;
    renderCatalogo();
  });

  const reset = () => {
    estado.cat = 'todas';
    estado.sabor = 'todos';
    estado.q = '';
    estado.visibles = PASO_CATALOGO;
    if (buscar) buscar.value = '';
    if (buscarClear) buscarClear.hidden = true;
    document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('activo', c.dataset.valor === 'todas'));
    document.querySelectorAll('#chipsSabor .chip').forEach(c => c.classList.toggle('activo', c.dataset.valor === 'todos'));
    renderCatalogo();
  };
  limpiar?.addEventListener('click', reset);
  vacioReset?.addEventListener('click', reset);
}

function leerQty(id, scope) {
  const st = (scope || document).querySelector('[data-stepper="' + window.CSS.escape(id) + '"] [data-qty]');
  return st ? Math.max(1, parseInt(st.textContent, 10) || 1) : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const pasoBtn = e.target.closest('.stepper button');
    if (pasoBtn) {
      const span = pasoBtn.parentElement.querySelector('[data-qty]');
      const stepper = pasoBtn.closest('.stepper');
      if (span) {
        const actual = Math.max(1, parseInt(span.textContent, 10) || 1);
        const nuevo = Math.max(1, Math.min(99, actual + Number(pasoBtn.dataset.paso)));
        span.textContent = nuevo;
        const idCarrito = stepper?.dataset.cart;
        if (idCarrito) Cart.setQty(idCarrito, nuevo);
      }
      return;
    }

    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const p = getProducto(addBtn.dataset.add);
      if (!p) return;
      const scope = addBtn.closest('.prod, .modal-info');
      Cart.add(p, leerQty(p.id, scope));
      showToast('¡Listo! ' + p.nombre + ' está en tu caja');
      return;
    }

    const comprarBtn = e.target.closest('[data-comprar]');
    if (comprarBtn) {
      const p = getProducto(comprarBtn.dataset.comprar);
      if (!p) return;
      Cart.add(p, leerQty(p.id, comprarBtn.closest('.modal-info')));
      cerrarModal();
      abrirDrawer();
      return;
    }

    const verBtn = e.target.closest('[data-ver]');
    if (verBtn) { abrirModal(verBtn.dataset.ver); return; }

    const card = e.target.closest('.prod');
    if (card && !e.target.closest('button')) { abrirModal(card.dataset.id); }
  });
}

/* ---------- drawer del carrito ---------- */
let drawerAbierto = false;
let focoPrevioDrawer = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;

  const items = Cart.get().map(i => ({ item: i, p: getProducto(i.id) })).filter(x => x.p);

  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio">' +
      '<figure class="frasco" style="--relleno:#C4D6DA;--nivel:.18"><span class="frasco-tapa"></span><span class="frasco-cuello"></span>' +
      '<span class="frasco-cuerpo"><span class="frasco-contenido"></span><span class="frasco-brillo"></span></span></figure>' +
      '<h3>Tu caja está vacía</h3>' +
      '<p>Todavía no elegiste ningún frasco. Empezá por los más elegidos y armá la tuya.</p>' +
      '<a class="btn btn-primario" href="#destacados" data-cerrar-drawer>Ver los más elegidos</a>' +
      '</div>';
    if (pie) pie.hidden = true;
    return;
  }

  body.innerHTML = items.map(({ item, p }) =>
    '<div class="drawer-item">' +
      '<div class="drawer-item-media"><img src="images/' + esc(p.img) + '" alt="" width="' + p.w + '" height="' + p.h + '"></div>' +
      '<div>' +
        '<h3>' + esc(p.nombre) + '</h3>' +
        '<p class="precio">' + formatearPrecio(precioFinal(p) * item.qty) + '</p>' +
        '<div class="stepper" data-stepper="carrito-' + esc(p.id) + '" data-cart="' + esc(p.id) + '">' +
          '<button type="button" data-paso="-1" aria-label="Quitar una unidad de ' + esc(p.nombre) + '">−</button>' +
          '<span data-qty>' + item.qty + '</span>' +
          '<button type="button" data-paso="1" aria-label="Sumar una unidad de ' + esc(p.nombre) + '">+</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="drawer-quitar" data-quitar="' + esc(p.id) + '" aria-label="Sacar ' + esc(p.nombre) + ' de la caja">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
    '</div>'
  ).join('');

  if (pie) pie.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const detalle = items.map(({ item, p }) => '· ' + p.nombre + ' x' + item.qty).join('\n');
    wsp.href = wspLink('Hola Romina, quiero pedir:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total()) + '\n¿Cómo seguimos?');
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawerAbierto) return;
  focoPrevioDrawer = document.activeElement;
  drawerAbierto = true;
  drawer.hidden = false;
  if (bd) bd.hidden = false;
  document.body.classList.add('drawer-open', 'no-scroll');
  requestAnimationFrame(() => {
    drawer.classList.add('open');
    bd?.classList.add('open');
    document.getElementById('drawerClose')?.focus();
  });
}

function cerrarDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawerAbierto) return;
  drawerAbierto = false;
  drawer.classList.remove('open');
  bd?.classList.remove('open');
  document.body.classList.remove('drawer-open', 'no-scroll');
  setTimeout(() => { drawer.hidden = true; if (bd) bd.hidden = true; }, 380);
  focoPrevioDrawer?.focus?.();
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);

  drawer?.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
  });

  document.getElementById('finalizarCompra')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (!drawerAbierto || !drawer) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key !== 'Tab') return;
    const focos = drawer.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
    const lista = [...focos].filter(el => el.offsetParent !== null);
    if (!lista.length) return;
    const primero = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

/* ---------- vista rápida ---------- */
let modalAbierto = false;
let focoPrevioModal = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modalProducto');
  const bd = document.getElementById('modalBackdrop');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!p || !modal || !cuerpo) return;

  const cat = getCategoria(p.cat);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  cuerpo.innerHTML = '<div class="modal-grid">' +
    '<div class="modal-media"><img src="images/' + esc(p.img) + '" alt="' + esc(p.alt) + '" width="' + p.w + '" height="' + p.h + '"></div>' +
    '<div class="modal-info">' +
      '<p class="eyebrow">' + esc(cat?.nombre || '') + '</p>' +
      '<h2 id="modalNombre">' + esc(p.nombre) + '</h2>' +
      '<p class="modal-precio">' + precioHTML(p) + '</p>' +
      '<p class="modal-desc">' + esc(p.desc) + '</p>' +
      '<dl class="modal-ficha">' +
        '<div><dt>Presentación</dt><dd>' + esc(p.medida) + '</dd></div>' +
        '<div><dt>Lleva</dt><dd>' + esc(p.ingredientes) + '</dd></div>' +
        '<div><dt>Se guarda</dt><dd>' + esc(p.conservacion) + '</dd></div>' +
      '</dl>' +
      '<div class="modal-acciones">' +
        '<div class="stepper" data-stepper="' + esc(p.id) + '">' +
          '<button type="button" data-paso="-1" aria-label="Quitar una unidad">−</button>' +
          '<span data-qty>1</span>' +
          '<button type="button" data-paso="1" aria-label="Sumar una unidad">+</button>' +
        '</div>' +
        '<button type="button" class="btn btn-primario" data-add="' + esc(p.id) + '">Agregar al carrito</button>' +
        '<button type="button" class="btn btn-fantasma" data-comprar="' + esc(p.id) + '">Comprar ahora</button>' +
      '</div>' +
      '<a class="modal-wsp" href="' + esc(wspLink('Hola Romina, quería preguntarte por: ' + p.nombre + ' (' + p.medida + ').')) + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>' +
        'Preguntarle a Romina por este frasco</a>' +
      (relacionados.length ? '<div class="modal-relacionados"><h3>También te puede interesar</h3><div class="rel-lista">' +
        relacionados.map(r => '<button type="button" class="rel-item" data-ver="' + esc(r.id) + '">' +
          '<span class="rel-media"><img src="images/' + esc(r.img) + '" alt="" width="' + r.w + '" height="' + r.h + '"></span>' +
          '<p>' + esc(r.nombre) + '</p><p class="rel-precio">' + formatearPrecio(precioFinal(r)) + '</p></button>').join('') +
        '</div></div>' : '') +
    '</div></div>';

  modal.setAttribute('aria-labelledby', 'modalNombre');
  if (!modalAbierto) focoPrevioModal = document.activeElement;
  modalAbierto = true;
  modal.hidden = false;
  if (bd) bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => {
    modal.classList.add('open');
    bd?.classList.add('open');
    document.getElementById('modalClose')?.focus();
  });
}

function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || !modalAbierto) return;
  modalAbierto = false;
  modal.classList.remove('open');
  bd?.classList.remove('open');
  if (!drawerAbierto) document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; if (bd) bd.hidden = true; }, 320);
  focoPrevioModal?.focus?.();
}

function initModal() {
  const modal = document.getElementById('modalProducto');
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (!modalAbierto || !modal) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key !== 'Tab') return;
    const lista = [...modal.querySelectorAll('a[href], button:not([disabled]), input, select')].filter(el => el.offsetParent !== null);
    if (!lista.length) return;
    const primero = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- badges y flotantes ---------- */
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

/* ---------- nav ---------- */
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open');
    bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    bd.classList.add('open');
    nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

/* ---------- reveals ---------- */
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's';
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

/* ---------- movimiento ---------- */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-mar img', { scale: 1.1, duration: 1.5, ease: 'power2.out' }, 0)
    .from('.hero-logo', { y: 22, opacity: 0, duration: .9 }, .1)
    .from('.eyebrow-hero', { y: 14, opacity: 0, duration: .7 }, .28)
    .from('.hero-h1', { clipPath: 'inset(0 0 100% 0)', y: 18, duration: 1.05, ease: 'expo.out' }, .34)
    .from('.hero-sub', { y: 16, opacity: 0, duration: .8 }, .62)
    .from('.hero-cta .btn', { y: 14, opacity: 0, duration: .7, stagger: .09 }, .72)
    .from('.hero-vitrina .frasco', { y: 54, opacity: 0, rotation: 5, duration: 1, stagger: .12, ease: 'back.out(1.2)' }, .5);
}

function initOlas() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.ola, .cuna-ola').forEach(cont => {
    const seccion = cont.closest('section') || cont.parentElement;
    const a = cont.querySelector('.ola-a');
    const b = cont.querySelector('.ola-b');
    const st = { trigger: seccion, start: 'top bottom', end: 'bottom top', scrub: .9 };
    if (a) gsap.to(a, { x: -1440, ease: 'none', scrollTrigger: st });
    if (b) gsap.to(b, { x: -720, ease: 'none', scrollTrigger: st });
  });
}

function initProceso() {
  const stage = document.getElementById('procesoStage');
  const pasos = [...document.querySelectorAll('#procesoPasos .paso')];
  const nivel = document.getElementById('frascoNivel');
  const etiqueta = document.getElementById('frascoEtiqueta');
  const tapa = document.getElementById('frascoTapa');
  const perol = document.getElementById('perol');
  const jugo = document.querySelector('.perol-jugo');
  const frutas = [...document.querySelectorAll('.fruta')];
  const vapores = [...document.querySelectorAll('.vapor')];
  if (!stage || !pasos.length) return;

  const marcarPaso = prog => {
    const i = Math.max(0, Math.min(pasos.length - 1, Math.floor(prog * pasos.length)));
    pasos.forEach((el, n) => el.classList.toggle('is-on', n === i));
  };

  const estadoFinal = () => {
    if (typeof gsap === 'undefined') {
      if (nivel) nivel.style.transform = 'scaleY(.66)';
      if (etiqueta) etiqueta.style.opacity = '1';
      return;
    }
    gsap.set(nivel, { scaleY: .66, transformOrigin: 'bottom' });
    gsap.set(etiqueta, { opacity: 1, scale: 1, rotation: 0 });
    gsap.set(perol, { opacity: .22, scale: .86, y: 26, transformOrigin: 'center bottom' });
    gsap.set(frutas, { opacity: 0 });
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { estadoFinal(); marcarPaso(1); return; }

  const construir = () => {
    gsap.set(nivel, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.set(etiqueta, { opacity: 0, scale: .86, rotation: -7 });
    gsap.set(perol, { opacity: 1, scale: 1, y: 0, transformOrigin: 'center bottom' });
    gsap.set(frutas, { opacity: 1, y: 0 });
    gsap.set(vapores, { opacity: 0, y: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.from(frutas, { yPercent: -520, opacity: 0, stagger: .035, duration: .18, ease: 'power1.in' }, 0)
      .from(jugo, { scaleY: .12, transformOrigin: 'bottom', duration: .2, ease: 'power1.out' }, .18)
      .to(vapores, { opacity: .75, y: -14, stagger: .04, duration: .14 }, .3)
      .to(frutas, { opacity: 0, y: 46, stagger: .03, duration: .12 }, .34)
      .to(perol, { rotation: -17, x: '9%', y: -12, transformOrigin: 'right bottom', duration: .16, ease: 'power2.inOut' }, .46)
      .to(nivel, { scaleY: .66, duration: .24 }, .48)
      .to(vapores, { opacity: 0, duration: .12 }, .5)
      .to(perol, { rotation: 0, x: 0, y: 26, opacity: .2, scale: .86, duration: .16, ease: 'power2.out' }, .66)
      .from(tapa, { y: -34, opacity: 0, duration: .1, ease: 'power2.out' }, .74)
      .to(etiqueta, { opacity: 1, scale: 1, rotation: 0, duration: .16, ease: 'back.out(1.4)' }, .82);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    estadoFinal();
    marcarPaso(0.95);
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = construir();
    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=240%',
      pin: true,
      scrub: .7,
      invalidateOnRefresh: true,
      animation: tl,
      onUpdate: self => marcarPaso(self.progress)
    });
    return () => trigger.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = construir();
    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: .7,
      invalidateOnRefresh: true,
      animation: tl,
      onUpdate: self => marcarPaso(self.progress)
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { trigger.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

function initSeccionesAnimadas() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const media = document.querySelector('.editorial-media img');
  if (media) {
    gsap.to(media, {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: { trigger: '.editorial', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
  const fondoCierre = document.querySelector('.cierre-fondo img');
  if (fondoCierre) {
    gsap.fromTo(fondoCierre, { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }
}

/* ---------- datos estructurados ---------- */
function initJsonLd() {
  const grafo = [{
    '@type': 'Store',
    '@id': SITIO + '#negocio',
    name: 'Conservas de Mar del Sur',
    description: 'Conservas, escabeches, mermeladas y miel artesanales hechos en Mar del Sur, Miramar.',
    url: SITIO,
    image: SITIO + 'images/etiqueta-higo.webp',
    telephone: '+54 9 2291 45-8018',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mar del Sur',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR'
    },
    areaServed: 'Argentina'
  }];

  PRODUCTOS.forEach(p => {
    grafo.push({
      '@type': 'Product',
      '@id': SITIO + '#' + p.id,
      name: p.nombre,
      description: p.desc,
      image: SITIO + 'images/' + p.img,
      category: getCategoria(p.cat)?.nombre || '',
      brand: { '@type': 'Brand', name: 'Conservas de Mar del Sur' },
      offers: {
        '@type': 'Offer',
        price: precioFinal(p),
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        url: SITIO
      }
    });
  });

  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
  document.head.appendChild(s);
}

/* ---------- arranque ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
    el.style.clipPath = 'none';
  });
}

document.getElementById('anio').textContent = new Date().getFullYear();

initCategorias();
initRail();
initFiltros();
renderCatalogo();
initReveals();
initNav();
initAcciones();
initDrawer();
initModal();
initFloats();
initHero();
initOlas();
initProceso();
initSeccionesAnimadas();
initJsonLd();
updateCartBadge();

document.addEventListener('cart:updated', updateCartBadge);

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
