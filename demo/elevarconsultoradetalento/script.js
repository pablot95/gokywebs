const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const formatearPrecio = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
const PRODUCTOS = [
  {
    id: 'ebook-cv',
    slug: 'cv-con-proposito',
    type: 'ebook',
    titulo: 'Un CV que cuenta tu recorrido',
    categoria: 'Empleabilidad',
    audiencia: 'Personas',
    nivel: 'Inicial',
    modalidad: 'E-book PDF',
    precio: 12500,
    minutos: 60,
    portada: '04_imagen',
    descripcion:
      'Una guía práctica para ordenar tu experiencia, reconocer tus habilidades y presentarlas en un currículum claro.',
    resultados: [
      'Reconocer qué información aporta a tu postulación.',
      'Organizar logros y tareas con ejemplos concretos.',
      'Revisar la claridad y la lectura de tu CV.',
    ],
    contenidos: [
      'Tu perfil y tu objetivo de búsqueda',
      'Experiencia, formación y habilidades',
      'Lista de revisión antes de postularte',
    ],
    incluye: 'Guía en PDF y una lista de revisión de tu CV.',
    requisitos: 'Tener a mano tu experiencia laboral y formativa.',
  },
  {
    id: 'ebook-cambio',
    slug: 'repensar-tu-camino',
    type: 'ebook',
    titulo: 'Repensar tu camino profesional',
    categoria: 'Desarrollo profesional',
    audiencia: 'Personas',
    nivel: 'Inicial',
    modalidad: 'E-book PDF',
    precio: 15900,
    minutos: 90,
    portada: '08_imagen',
    destacado: true,
    descripcion:
      'Preguntas y ejercicios para revisar tu recorrido, explorar intereses y pensar un próximo paso posible.',
    resultados: [
      'Reconocer intereses y habilidades transferibles.',
      'Explorar alternativas con criterios propios.',
      'Definir una primera acción para investigar tu cambio.',
    ],
    contenidos: [
      'Mirar tu recorrido con perspectiva',
      'Explorar intereses y posibilidades',
      'Pasar de las ideas a un plan inicial',
    ],
    incluye: 'Guía en PDF con ejercicios de reflexión.',
    requisitos: 'Un espacio para escribir y revisar tu experiencia.',
  },
  {
    id: 'ebook-onboarding',
    slug: 'bienvenida-al-equipo',
    type: 'ebook',
    titulo: 'Una bienvenida que integra',
    categoria: 'Gestión del talento',
    audiencia: 'Empresas',
    nivel: 'Intermedio',
    modalidad: 'E-book PDF',
    precio: 18900,
    minutos: 120,
    portada: '07_imagen',
    descripcion:
      'Un recurso para revisar el onboarding y organizar una experiencia de ingreso con información, vínculos y seguimiento.',
    resultados: [
      'Identificar momentos importantes del ingreso.',
      'Organizar responsabilidades y conversaciones.',
      'Diseñar una lista de seguimiento para nuevas incorporaciones.',
    ],
    contenidos: [
      'Antes del primer día',
      'Información y vínculos de bienvenida',
      'Seguimiento y conversaciones de integración',
    ],
    incluye: 'Guía en PDF y checklist de bienvenida.',
    requisitos: 'Participar en la incorporación o coordinación de personas.',
  },
  {
    id: 'ebook-bienestar',
    slug: 'bienestar-cotidiano',
    type: 'ebook',
    titulo: 'Bienestar en la jornada laboral',
    categoria: 'Bienestar laboral',
    audiencia: 'Personas',
    nivel: 'Inicial',
    modalidad: 'E-book PDF',
    precio: 14900,
    minutos: 60,
    portada: '06_imagen',
    descripcion:
      'Una propuesta de reflexión sobre hábitos, límites y organización cotidiana en el trabajo.',
    resultados: [
      'Observar hábitos de la jornada.',
      'Identificar acuerdos y límites para conversar.',
      'Preparar una propuesta de organización personal.',
    ],
    contenidos: [
      'Observar tu jornada',
      'Tiempo, pausas y acuerdos',
      'Diseñar pequeños cambios sostenibles',
    ],
    incluye: 'Guía en PDF y registro de hábitos laborales.',
    requisitos: 'Interés en revisar tu organización cotidiana.',
  },
  {
    id: 'course-equipos',
    slug: 'conversaciones-de-equipo',
    type: 'course',
    titulo: 'Conversaciones que construyen equipo',
    categoria: 'Gestión del talento',
    audiencia: 'Empresas',
    nivel: 'Intermedio',
    modalidad: 'Virtual',
    precio: 42000,
    minutos: 180,
    portada: '05_imagen',
    destacado: true,
    descripcion:
      'Una propuesta para practicar escucha, feedback y acuerdos de trabajo en situaciones cotidianas de un equipo.',
    resultados: [
      'Preparar conversaciones con un objetivo claro.',
      'Distinguir observaciones e interpretaciones.',
      'Construir acuerdos y darles seguimiento.',
    ],
    programa: [
      [
        'Escucha y contexto',
        [
          'Escuchar antes de responder',
          'Preguntas que abren la conversación',
          'Reconocer perspectivas diferentes',
        ],
      ],
      [
        'Feedback en la práctica',
        [
          'Describir situaciones concretas',
          'Preparar una conversación de feedback',
          'Recibir observaciones y pedir claridad',
        ],
      ],
      [
        'Acuerdos de equipo',
        [
          'Definir compromisos compartidos',
          'Acompañar el seguimiento',
          'Aplicación a un caso de trabajo',
        ],
      ],
    ],
    incluye: 'Propuesta de nueve clases y ejercicios de aplicación.',
    requisitos: 'Coordinar personas o participar en un equipo de trabajo.',
  },
  {
    id: 'course-seleccion',
    slug: 'entrevistas-de-seleccion',
    type: 'course',
    titulo: 'Entrevistas de selección con criterio',
    categoria: 'Gestión del talento',
    audiencia: 'Empresas',
    nivel: 'Intermedio',
    modalidad: 'Virtual',
    precio: 48000,
    minutos: 270,
    portada: '03_imagen',
    descripcion:
      'Una formación para preparar entrevistas, relevar evidencia y organizar criterios de evaluación de candidatos.',
    resultados: [
      'Traducir una necesidad en criterios de entrevista.',
      'Diseñar preguntas vinculadas al puesto.',
      'Registrar y comparar la información relevada.',
    ],
    programa: [
      [
        'Preparación de la búsqueda',
        [
          'Comprender la necesidad del equipo',
          'Definir criterios del perfil',
          'Preparar la guía de entrevista',
        ],
      ],
      [
        'La conversación',
        [
          'Preguntas sobre experiencias',
          'Escucha y repreguntas',
          'Registro de evidencia relevante',
        ],
      ],
      [
        'Evaluación y cierre',
        [
          'Organizar la información',
          'Revisar sesgos de evaluación',
          'Comunicar los siguientes pasos',
        ],
      ],
    ],
    incluye: 'Propuesta de nueve clases y guía de entrevista.',
    requisitos: 'Participar en búsquedas o decisiones de incorporación.',
  },
  {
    id: 'course-busqueda',
    slug: 'organizar-busqueda-laboral',
    type: 'course',
    titulo: 'Organizá tu búsqueda laboral',
    categoria: 'Empleabilidad',
    audiencia: 'Personas',
    nivel: 'Inicial',
    modalidad: 'Virtual',
    precio: 28000,
    minutos: 180,
    portada: '09_imagen',
    destacado: true,
    descripcion:
      'Una propuesta para definir tu objetivo de búsqueda, preparar tu presentación y llevar un registro de postulaciones.',
    resultados: [
      'Definir un objetivo laboral inicial.',
      'Preparar tu presentación para entrevistas.',
      'Organizar el seguimiento de oportunidades.',
    ],
    programa: [
      [
        'Tu punto de partida',
        [
          'Reconocer experiencias y habilidades',
          'Definir el objetivo de búsqueda',
          'Identificar oportunidades relevantes',
        ],
      ],
      [
        'Tu presentación',
        [
          'Revisar el currículum',
          'Preparar ejemplos para entrevistas',
          'Comunicar tu recorrido profesional',
        ],
      ],
      [
        'La búsqueda en acción',
        [
          'Organizar las postulaciones',
          'Registrar contactos y avances',
          'Revisar y ajustar el plan',
        ],
      ],
    ],
    incluye: 'Propuesta de nueve clases y planilla de seguimiento.',
    requisitos: 'Estar iniciando o revisando una búsqueda laboral.',
  },
  {
    id: 'course-clima',
    slug: 'escuchar-clima-laboral',
    type: 'course',
    titulo: 'Escuchar el clima de tu organización',
    categoria: 'Bienestar laboral',
    audiencia: 'Empresas',
    nivel: 'Intermedio',
    modalidad: 'Virtual',
    precio: 45000,
    minutos: 270,
    portada: '06_imagen',
    descripcion:
      'Un recorrido por preguntas, herramientas y criterios para pensar un diagnóstico de clima y sus posibles acciones.',
    resultados: [
      'Delimitar el propósito del diagnóstico.',
      'Reconocer herramientas de escucha.',
      'Organizar hallazgos y prioridades de trabajo.',
    ],
    programa: [
      [
        'El propósito del diagnóstico',
        [
          'Qué queremos comprender',
          'Dimensiones del clima laboral',
          'Definir el alcance de la escucha',
        ],
      ],
      [
        'Herramientas y lectura',
        [
          'Encuestas y conversaciones',
          'Organizar la información',
          'Interpretar hallazgos con contexto',
        ],
      ],
      [
        'Devolución y acciones',
        ['Compartir lo aprendido', 'Priorizar oportunidades', 'Diseñar un seguimiento'],
      ],
    ],
    incluye: 'Propuesta de nueve clases y matriz de acciones.',
    requisitos: 'Participar en gestión de personas o coordinación de equipos.',
  },
];

const getProducto = (id) => PRODUCTOS.find((producto) => producto.id === id);
const precioFinal = (producto) => producto.precio;
const durationLabel = (producto) => `${producto.minutos / 60} h`;
const typeLabel = (producto) =>
  producto.type === 'ebook' ? 'E-book · PDF' : 'Capacitación · Virtual';

function filterProducts(products, filters) {
  const words = normalize(filters.search).split(/\s+/).filter(Boolean);
  return products.filter((producto) => {
    const searchable = normalize(
      [
        producto.titulo,
        producto.categoria,
        producto.nivel,
        producto.modalidad,
        producto.audiencia,
        producto.descripcion,
        'Elevar',
      ].join(' '),
    );
    return (
      words.every((word) => searchable.includes(word)) &&
      (!filters.type || producto.type === filters.type) &&
      (!filters.audience || producto.audiencia === filters.audience) &&
      (!filters.category || producto.categoria === filters.category) &&
      (!filters.level || producto.nivel === filters.level) &&
      (!filters.duration ||
        (filters.duration === 'short' ? producto.minutos <= 120 : producto.minutos > 120)) &&
      (!filters.price ||
        (filters.price === 'low' ? producto.precio <= 20000 : producto.precio > 20000))
    );
  });
}

function normalizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  const ids = new Set();
  return raw
    .filter((item) => {
      if (!item || typeof item.id !== 'string' || !getProducto(item.id) || ids.has(item.id))
        return false;
      ids.add(item.id);
      return true;
    })
    .map((item) => ({ id: item.id, qty: 1 }));
}

let memoryCart = [];
let memoryOnly = false;
const Cart = {
  KEY: 'elevarconsultoradetalento_cart',
  get() {
    if (memoryOnly) return memoryCart;
    let raw;
    try {
      raw = localStorage.getItem(this.KEY);
    } catch {
      return memoryCart;
    }
    try {
      return normalizeCart(JSON.parse(raw) || []);
    } catch {
      return [];
    }
  },
  save(items) {
    memoryCart = normalizeCart(items);
    try {
      localStorage.setItem(this.KEY, JSON.stringify(memoryCart));
    } catch {
      memoryOnly = true;
    }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto) {
    if (!producto) return;
    const items = this.get();
    if (items.some((item) => item.id === producto.id)) return;
    this.save([...items, { id: producto.id, qty: 1 }]);
  },
  remove(id) {
    this.save(this.get().filter((item) => item.id !== id));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().length;
  },
  total() {
    return this.get().reduce((sum, item) => sum + (getProducto(item.id)?.precio ?? 0), 0);
  },
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function cardHTML(producto, featured = false) {
  const image = `<img src="images/${producto.portada}.webp" alt="${esc(producto.titulo)}, imagen ilustrativa" width="1024" height="1024">`;
  const meta = `${producto.nivel} · ${durationLabel(producto)}${producto.type === 'course' ? ' · 9 clases' : ' de lectura estimada'}`;
  if (featured) {
    return `<article class="feature-card" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <div class="card-photo">${image}</div><div class="feature-body"><span class="type-label">${typeLabel(producto)}</span>
      <h3>${esc(producto.titulo)}</h3><p class="feature-meta">${meta}</p>
      <div class="feature-bottom"><strong>${formatearPrecio(producto.precio)}</strong><button type="button" data-detail="${producto.id}" aria-label="Ver ${esc(producto.titulo)}">↗</button></div></div></article>`;
  }
  return `<article class="product-card" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="card-photo">${image}<span class="type-label">${producto.type === 'ebook' ? 'E-book PDF' : 'Virtual'}</span></div>
    <div class="product-body"><h3>${esc(producto.titulo)}</h3><p class="card-meta">${meta}</p>
    <div class="product-actions"><strong class="card-price">${formatearPrecio(producto.precio)}</strong><button type="button" class="text-link" data-detail="${producto.id}">Ver ${producto.type === 'ebook' ? 'e-book' : 'curso'}</button><button class="add-button" type="button" data-add="${producto.id}" aria-label="Agregar ${esc(producto.titulo)} al carrito">+</button></div></div></article>`;
}

function renderCatalog() {
  const form = document.getElementById('catalog-filters');
  const grid = document.getElementById('catalog-grid');
  if (!form || !grid) return;
  const filters = Object.fromEntries(new window.FormData(form));
  const products = filterProducts(PRODUCTOS, filters);
  grid.innerHTML = products.map((producto) => cardHTML(producto)).join('');
  document.getElementById('result-count').textContent =
    `${products.length} ${products.length === 1 ? 'propuesta' : 'propuestas'}`;
  document.getElementById('catalog-empty').hidden = products.length !== 0;
  revelarNuevos(grid);
}

function initCatalog() {
  const form = document.getElementById('catalog-filters');
  if (!form) return;
  document.getElementById('featured-grid').innerHTML = PRODUCTOS.filter(
    (producto) => producto.destacado,
  )
    .map((producto) => cardHTML(producto, true))
    .join('');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderCatalog();
  });
  form.addEventListener('input', renderCatalog);
  form.addEventListener('reset', () => {
    setTimeout(renderCatalog, 0);
  });
  document.querySelector('[data-reset-filters]')?.addEventListener('click', () => form.reset());
  document.getElementById('filter-toggle')?.addEventListener('click', (event) => {
    const open = document.getElementById('filter-fields').classList.toggle('open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-catalog-type]').forEach((link) =>
    link.addEventListener('click', () => {
      form.reset();
      form.elements.type.value = link.dataset.catalogType;
      renderCatalog();
    }),
  );
  renderCatalog();
}

let dialogTrigger = null;

function openDialog(dialog) {
  if (!dialog) return;
  const previous = document.querySelector('dialog[open]');
  if (previous) previous.close();
  else dialogTrigger = document.activeElement;
  document.body.classList.add('no-scroll');
  dialog.showModal();
  dialog.scrollTop = 0;
  dialog.querySelector('[data-close-dialog]')?.focus();
}

function closeDialog(dialog) {
  dialog.close();
  if (dialogTrigger?.isConnected) dialogTrigger.focus({ preventScroll: true });
}

function openDetail(id) {
  const producto = getProducto(id);
  if (!producto) return;
  const dialog = document.getElementById('detail-dialog');
  const program =
    producto.type === 'course'
      ? producto.programa
          .map(
            ([title, lessons], index) =>
              `<details><summary>${esc(title)}<span aria-hidden="true">+</span></summary><ul class="lesson-list">${lessons.map((lesson, number) => `<li><span>${esc(lesson)}</span><small>${producto.minutos / 9} min · ${index === 2 && number === 2 ? 'Lectura' : 'Video'}</small></li>`).join('')}</ul></details>`,
          )
          .join('')
      : `<ul>${producto.contenidos.map((title) => `<li>${esc(title)}</li>`).join('')}</ul>`;
  document.getElementById('detail-content').innerHTML =
    `<div class="detail-top"><div class="detail-photo"><img src="images/${producto.portada}.webp" width="1024" height="1024" alt="${esc(producto.titulo)}, imagen ilustrativa"></div><div class="detail-copy"><span class="type-label">${typeLabel(producto)} · ${producto.audiencia}</span><h2>${esc(producto.titulo)}</h2><p>${esc(producto.descripcion)}</p><p class="card-meta">${producto.nivel} · ${durationLabel(producto)}${producto.type === 'course' ? ' · 9 clases propuestas' : ' de lectura estimada'}</p><div class="detail-buy"><strong>${formatearPrecio(producto.precio)}</strong><button type="button" class="btn btn-primary" data-buy="${producto.id}">Comprar ahora <span aria-hidden="true">↗</span></button></div><p class="demo-note">Propuesta ilustrativa. El precio, el contenido y la modalidad están pendientes de confirmación. El pago y ${producto.type === 'ebook' ? 'la descarga' : 'el acceso a las clases'} se activan en producción.</p></div></div><div class="detail-body"><h3>Qué vas a trabajar</h3><ul>${producto.resultados.map((result) => `<li>${esc(result)}</li>`).join('')}</ul><h3>${producto.type === 'ebook' ? 'Dentro de esta guía' : 'Programa propuesto'}</h3>${program}<h3>Qué incluye</h3><p>${esc(producto.incluye)}</p><h3>Para empezar</h3><p>${esc(producto.requisitos)}</p><h3>Sobre la propuesta</h3><p>Contenido de muestra para Elevar Consultora de Talento. ${producto.type === 'course' ? 'Docentes, fechas y condiciones de acceso pendientes de confirmación.' : 'El archivo final del e-book está pendiente de carga.'}</p></div>`;
  dialog.setAttribute('aria-label', producto.titulo);
  let schema = document.getElementById('proposal-schema');
  if (!schema) {
    schema = document.createElement('script');
    schema.id = 'proposal-schema';
    schema.type = 'application/ld+json';
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': producto.type === 'course' ? 'Course' : 'Product',
    name: producto.titulo,
    description: `Propuesta de demostración. ${producto.descripcion} Contenido y precio pendientes de confirmación.`,
    image: `https://gokywebs.com/demo/elevarconsultoradetalento/images/${producto.portada}.webp`,
    provider: { '@type': 'Organization', name: 'Elevar Consultora de Talento' },
    offers: {
      '@type': 'Offer',
      price: producto.precio,
      priceCurrency: 'ARS',
      description: 'Precio ilustrativo de demostración. La compra se activa en producción.',
    },
  });
  openDialog(dialog);
}

function renderCart() {
  const content = document.getElementById('cart-content');
  if (!content) return;
  const items = Cart.get();
  content.innerHTML = items.length
    ? items
        .map((item) => {
          const producto = getProducto(item.id);
          return `<article class="cart-line"><img src="images/${producto.portada}.webp" width="72" height="72" alt=""><div><h3>${esc(producto.titulo)}</h3><p>${typeLabel(producto)}</p><strong>${formatearPrecio(precioFinal(producto))}</strong></div><button type="button" class="icon-btn" data-remove="${producto.id}" aria-label="Quitar ${esc(producto.titulo)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/></svg></button></article>`;
        })
        .join('')
    : '<div class="cart-empty"><h3>Tu próximo aprendizaje empieza acá.</h3><p>Sumá un e-book o una capacitación para ver tu selección.</p><button type="button" class="btn btn-outline" data-browse>Explorá la biblioteca</button></div>';
  document.getElementById('cart-summary').hidden = items.length === 0;
  document.getElementById('cart-total').textContent = formatearPrecio(Cart.total());
  updateCartBadge();
}

function openCartDrawer() {
  renderCart();
  openDialog(document.getElementById('cart-dialog'));
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function initDialogs() {
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('no-scroll');
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        closeDialog(dialog);
    });
  });
  document.addEventListener('click', (event) => {
    const detail = event.target.closest('[data-detail]');
    if (detail) openDetail(detail.dataset.detail);
    const add = event.target.closest('[data-add]');
    if (add) {
      const producto = getProducto(add.dataset.add);
      if (!producto) return;
      const exists = Cart.get().some((item) => item.id === producto.id);
      Cart.add(producto);
      showToast(
        exists
          ? 'Esta propuesta ya está en tu selección.'
          : 'Agregado a tu selección. Podés seguir explorando.',
      );
    }
    const buy = event.target.closest('[data-buy]');
    if (buy) {
      Cart.add(getProducto(buy.dataset.buy));
      openCartDrawer();
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) {
      Cart.remove(remove.dataset.remove);
      document.querySelector('#cart-dialog [data-close-dialog]')?.focus();
    }
    const close = event.target.closest('[data-close-dialog]');
    if (close) closeDialog(close.closest('dialog'));
    if (event.target.closest('[data-browse]')) {
      closeDialog(document.getElementById('cart-dialog'));
      document.getElementById('catalogo').scrollIntoView();
      document.getElementById('search').focus({ preventScroll: true });
    }
  });
  document
    .querySelectorAll('[data-open-cart]')
    .forEach((button) => button.addEventListener('click', openCartDrawer));
  document.getElementById('checkout')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    closeDialog(document.getElementById('cart-dialog'));
    showToast(
      'El pago y el acceso a tus cursos y e-books se activan al llevar la plataforma a producción.',
    );
  });
  document.addEventListener('cart:updated', renderCart);
  window.addEventListener('storage', (event) => {
    if (event.key === Cart.KEY || event.key === null)
      document.dispatchEvent(new CustomEvent('cart:updated'));
  });
  renderCart();
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open');
    bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    nav.removeAttribute('role');
    nav.removeAttribute('aria-modal');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    bd.classList.add('open');
    nav.removeAttribute('inert');
    nav.setAttribute('role', 'dialog');
    nav.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => {
    close();
    toggle.focus();
  });
  bd.addEventListener('click', () => {
    close();
    toggle.focus();
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('open')) return;
    if (event.key === 'Escape') {
      close();
      toggle.focus();
    }
    if (event.key !== 'Tab') return;
    const controls = [...nav.querySelectorAll('button,a')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) {
      close();
      nav.removeAttribute('inert');
    } else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

let revealsListos = false;
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(
      () => {
        el.style.transitionDelay = '';
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -7% 0px' },
  );
  items.forEach((el) => io.observe(el));
  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) {
    nuevos.forEach((el) => el.classList.add('in'));
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      nuevos.forEach((el, i) => {
        const d = Math.min(i * 0.06, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add('in');
        setTimeout(
          () => {
            el.style.transitionDelay = '';
          },
          (d + 1.2) * 1000,
        );
      }),
    ),
  );
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  let seen = window.scrollY > 600;
  const sync = () => {
    seen = seen || window.scrollY > 600;
    wsp?.classList.toggle('visible', seen);
    cart?.classList.toggle('visible', seen || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
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
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

if (typeof document !== 'undefined') {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (
      k === 'f12' ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
      (e.ctrlKey && k === 'u')
    )
      e.preventDefault();
  });
  initCatalog();
  initReveals();
  initNav();
  initDialogs();
  initFloats();
  initModelBarScroll();
  const slug = new URLSearchParams(location.search).get('curso');
  const product = PRODUCTOS.find((item) => item.slug === slug);
  if (product) openDetail(product.id);
}
