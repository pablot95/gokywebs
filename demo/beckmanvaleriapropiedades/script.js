const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5491136092739';
const FAV_KEY = 'beckman_favoritos';
const POR_PAGINA = 12;

const LOCALIDADES = {
  'Belén de Escobar': [-34.3478, -58.7955],
  'Ingeniero Maschwitz': [-34.3818, -58.7425],
  'Garín': [-34.4225, -58.7395],
  'Matheu': [-34.3835, -58.8275],
  'Maquinista Savio': [-34.4115, -58.7905]
};
const ORDEN_LOC = Object.keys(LOCALIDADES);
const ORDEN_TIPOS = ['Casa', 'Departamento', 'Dúplex', 'Local', 'Lote'];
const PRECIOS = { venta: [100000, 200000, 300000], alquiler: [800000, 1000000, 1500000] };

const PROPIEDADES = [
  {
    id: 'p01', slug: 'casa-galeria-parque-el-cazador', titulo: 'Casa con galería y parque', operacion: 'venta', tipo: 'Casa', estado: 'Muy bueno',
    precio: 245000, moneda: 'USD', expensas: 0, localidad: 'Belén de Escobar', barrio: 'El Cazador',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 1, supTotal: 600, supCubierta: 180, coords: [-34.3335, -58.7745],
    descripcion: ['Casa de una planta en un lote amplio de El Cazador, con living comedor que se abre al jardín por un ventanal corrido.', 'La galería techada tiene lugar para una mesa larga y mira al parque y a la pileta. Tres dormitorios, dos baños y cochera cubierta.'],
    caracteristicas: ['Galería techada', 'Pileta', 'Parque con árboles', 'Living con ventanal', 'Cochera cubierta'],
    etiquetas: ['pileta', 'galería', 'parque', 'jardín'],
    portada: 'images/04_imagen.webp', galeria: ['images/04_imagen.webp', 'images/07_imagen.webp', 'images/02_imagen.webp'],
    alt: 'Casa con galería de columnas, puerta de madera y jardín al frente', destacada: true, nueva: false
  },
  {
    id: 'p02', slug: 'casa-3-ambientes-jardin-maschwitz', titulo: 'Casa de 3 ambientes con jardín', operacion: 'alquiler', tipo: 'Casa', estado: 'Bueno',
    precio: 950000, moneda: 'ARS', expensas: 0, localidad: 'Ingeniero Maschwitz', barrio: '',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 1, supTotal: 300, supCubierta: 95, coords: [-34.3790, -58.7470],
    descripcion: ['Casa de 3 ambientes en una calle tranquila de Maschwitz, con jardín al frente y entrada con escalones de piedra.', 'Living comedor, cocina separada, dos dormitorios y un baño completo. Cochera descubierta para un auto.'],
    caracteristicas: ['Jardín al frente', 'Cocina separada', 'Cochera descubierta', 'Puerta de madera maciza'],
    etiquetas: ['jardín'],
    portada: 'images/01_imagen.webp', galeria: ['images/01_imagen.webp'],
    alt: 'Entrada de casa con puerta de madera, escalones y plantas', destacada: false, nueva: false
  },
  {
    id: 'p03', slug: 'departamento-3-ambientes-balcon-centro', titulo: 'Departamento de 3 ambientes con balcón', operacion: 'alquiler', tipo: 'Departamento', estado: 'Muy bueno',
    precio: 720000, moneda: 'ARS', expensas: 85000, localidad: 'Belén de Escobar', barrio: 'Centro',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 0, supTotal: 78, supCubierta: 70, coords: [-34.3462, -58.7930],
    descripcion: ['Departamento luminoso en el centro de Escobar, con living comedor integrado y balcón corrido con vista abierta.', 'Cocina con isla y desayunador, dos dormitorios con placard y pisos de madera en todos los ambientes.'],
    caracteristicas: ['Balcón corrido', 'Cocina con isla', 'Pisos de madera', 'Vista abierta'],
    etiquetas: ['balcón', 'luminoso', 'céntrico'],
    portada: 'images/03_imagen.webp', galeria: ['images/03_imagen.webp', 'images/05_imagen.webp', 'images/06_imagen.webp'],
    alt: 'Living comedor de departamento con ventanal y vista a la ciudad', destacada: true, nueva: false
  },
  {
    id: 'p04', slug: 'local-vidriera-centro-escobar', titulo: 'Local a la calle con vidriera', operacion: 'alquiler', tipo: 'Local', estado: 'Muy bueno',
    precio: 1100000, moneda: 'ARS', expensas: 0, localidad: 'Belén de Escobar', barrio: 'Centro',
    ambientes: 1, dormitorios: 0, banos: 1, cocheras: 0, supTotal: 60, supCubierta: 60, coords: [-34.3490, -58.7978],
    descripcion: ['Local de planta libre con frente vidriado de piso a techo, sobre una calle con movimiento del centro de Escobar.', 'Un espacio de 60 m² con baño, fácil de adaptar a lo que necesites.'],
    caracteristicas: ['Frente vidriado', 'Planta libre', 'Baño', 'Piso cerámico'],
    etiquetas: ['comercio', 'vidriera', 'céntrico'],
    portada: 'images/08_imagen.webp', galeria: ['images/08_imagen.webp'],
    alt: 'Local vacío con frente vidriado de piso a techo', destacada: false, nueva: false
  },
  {
    id: 'p05', slug: 'casa-a-estrenar-parque-matheu', titulo: 'Casa a estrenar con parque', operacion: 'venta', tipo: 'Casa', estado: 'A estrenar',
    precio: 185000, moneda: 'USD', expensas: 0, localidad: 'Matheu', barrio: '',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 1, supTotal: 450, supCubierta: 140, coords: [-34.3850, -58.8250],
    descripcion: ['Casa a estrenar en Matheu, con revestimiento de madera en el frente y un camino de piedra que cruza el parque.', 'Ambientes amplios con pisos de madera, tres dormitorios y dos baños, uno con bañera.'],
    caracteristicas: ['A estrenar', 'Parque', 'Baño con bañera', 'Pisos de madera', 'Ventanales'],
    etiquetas: ['parque', 'nueva'],
    portada: 'images/casa-matheu-1.webp', galeria: ['images/casa-matheu-1.webp', 'images/casa-matheu-2.webp', 'images/casa-matheu-3.webp', 'images/casa-matheu-4.webp'],
    alt: 'Casa moderna con frente de madera y camino de piedra en el parque', destacada: false, nueva: true
  },
  {
    id: 'p06', slug: 'departamento-2-ambientes-a-estrenar-centro', titulo: 'Departamento de 2 ambientes a estrenar', operacion: 'venta', tipo: 'Departamento', estado: 'A estrenar',
    precio: 78000, moneda: 'USD', expensas: 60000, localidad: 'Belén de Escobar', barrio: 'Centro',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, supTotal: 48, supCubierta: 44, coords: [-34.3505, -58.7910],
    descripcion: ['Dos ambientes a estrenar en el centro de Escobar, con ventanales grandes y pisos de madera.', 'Una buena opción para primera vivienda: living comedor, dormitorio con placard y baño completo.'],
    caracteristicas: ['A estrenar', 'Muy luminoso', 'Placares', 'Pisos de madera'],
    etiquetas: ['luminoso', 'céntrico', 'nueva'],
    portada: 'images/depto-centro-1.webp', galeria: ['images/depto-centro-1.webp', 'images/depto-centro-2.webp', 'images/depto-centro-3.webp'],
    alt: 'Ambiente vacío a estrenar con paredes blancas y piso de madera', destacada: false, nueva: true
  },
  {
    id: 'p07', slug: 'duplex-3-ambientes-garin', titulo: 'Dúplex de 3 ambientes', operacion: 'alquiler', tipo: 'Dúplex', estado: 'A estrenar',
    precio: 880000, moneda: 'ARS', expensas: 0, localidad: 'Garín', barrio: '',
    ambientes: 3, dormitorios: 2, banos: 2, cocheras: 0, supTotal: 110, supCubierta: 95, coords: [-34.4200, -58.7430],
    descripcion: ['Dúplex en dos plantas en Garín: abajo living comedor y cocina, arriba dos dormitorios y baño.', 'Ventanales en todos los ambientes, toilette en planta baja y un patio chico.'],
    caracteristicas: ['Dos plantas', 'Toilette', 'Ventanales', 'Patio'],
    etiquetas: ['patio', 'nueva'],
    portada: 'images/duplex-garin-1.webp', galeria: ['images/duplex-garin-1.webp', 'images/duplex-garin-2.webp', 'images/duplex-garin-3.webp'],
    alt: 'Ambiente a estrenar con pared gris, ventanal y piso de madera clara', destacada: false, nueva: true
  },
  {
    id: 'p08', slug: 'casa-pileta-deck-maschwitz', titulo: 'Casa con pileta y deck', operacion: 'venta', tipo: 'Casa', estado: 'Excelente',
    precio: 320000, moneda: 'USD', expensas: 0, localidad: 'Ingeniero Maschwitz', barrio: '',
    ambientes: 5, dormitorios: 4, banos: 3, cocheras: 2, supTotal: 900, supCubierta: 240, coords: [-34.3860, -58.7380],
    descripcion: ['Casa contemporánea en un lote de 900 m² en Maschwitz, con pileta, deck de madera y parque parquizado.', 'Cuatro dormitorios, tres baños y un living con ventanales al parque. Cochera para dos autos.'],
    caracteristicas: ['Pileta', 'Deck de madera', 'Parque parquizado', 'Cochera doble', 'Ventanales al parque'],
    etiquetas: ['pileta', 'parque', 'deck'],
    portada: 'images/casa-pileta-1.webp', galeria: ['images/casa-pileta-1.webp', 'images/casa-pileta-2.webp'],
    alt: 'Casa contemporánea con pileta, deck de madera y césped', destacada: true, nueva: false
  },
  {
    id: 'p09', slug: 'chalet-galeria-cerrada-lambertuchi', titulo: 'Chalet con galería cerrada', operacion: 'alquiler', tipo: 'Casa', estado: 'Muy bueno',
    precio: 1350000, moneda: 'ARS', expensas: 0, localidad: 'Belén de Escobar', barrio: 'Lambertuchi',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 1, supTotal: 500, supCubierta: 165, coords: [-34.3600, -58.8050],
    descripcion: ['Chalet de dos plantas en Lambertuchi, con galería cerrada con vidrio que se usa todo el año.', 'Tres dormitorios, dos baños y balcón en la planta alta. Parque al fondo con plantas y árboles.'],
    caracteristicas: ['Galería cerrada', 'Balcón', 'Parque', 'Techo de tejas'],
    etiquetas: ['galería', 'parque', 'chalet'],
    portada: 'images/casa-galeria-1.webp', galeria: ['images/casa-galeria-1.webp', 'images/casa-galeria-2.webp'],
    alt: 'Chalet de dos plantas con galería vidriada y parque', destacada: false, nueva: false
  },
  {
    id: 'p10', slug: 'casa-porche-parque-maquinista-savio', titulo: 'Casa con porche y parque amplio', operacion: 'venta', tipo: 'Casa', estado: 'Muy bueno',
    precio: 210000, moneda: 'USD', expensas: 0, localidad: 'Maquinista Savio', barrio: '',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 2, supTotal: 800, supCubierta: 170, coords: [-34.4135, -58.7870],
    descripcion: ['Casa de una planta en Maquinista Savio, con porche corrido hacia el parque y chimenea en el living.', 'Tres dormitorios, dos baños y lugar para dos autos. El parque es amplio y llano.'],
    caracteristicas: ['Porche', 'Chimenea', 'Parque amplio', 'Cochera doble'],
    etiquetas: ['parque', 'chimenea', 'porche'],
    portada: 'images/casa-quincho-1.webp', galeria: ['images/casa-quincho-1.webp'],
    alt: 'Casa de una planta con porche, techo de tejas y parque de césped', destacada: false, nueva: false
  },
  {
    id: 'p11', slug: 'lote-600-m2-maschwitz', titulo: 'Lote de 600 m²', operacion: 'venta', tipo: 'Lote', estado: '',
    precio: 42000, moneda: 'USD', expensas: 0, localidad: 'Ingeniero Maschwitz', barrio: '', medidas: '15 × 40 m',
    ambientes: 0, dormitorios: 0, banos: 0, cocheras: 0, supTotal: 600, supCubierta: 0, coords: [-34.3755, -58.7360],
    descripcion: ['Lote llano de 15 × 40 m en una zona residencial de Maschwitz, con árboles en el fondo.', 'Una buena base para construir tu casa con parque. Consultanos por los servicios de la cuadra.'],
    caracteristicas: ['Terreno llano', '15 × 40 m', 'Arbolado'],
    etiquetas: ['terreno', 'construir'],
    portada: 'images/lote-maschwitz-1.webp', galeria: ['images/lote-maschwitz-1.webp'],
    alt: 'Terreno de césped con árboles al fondo y cielo despejado', destacada: false, nueva: false
  },
  {
    id: 'p12', slug: 'casa-moderna-jardin-garin', titulo: 'Casa moderna con jardín', operacion: 'venta', tipo: 'Casa', estado: 'Excelente',
    precio: 265000, moneda: 'USD', expensas: 0, localidad: 'Garín', barrio: '',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 2, supTotal: 650, supCubierta: 190, coords: [-34.4250, -58.7350],
    descripcion: ['Casa de líneas rectas en Garín, con ventanales de piso a techo hacia un jardín largo y cuidado.', 'Tres dormitorios, dos baños, pérgola y cochera para dos autos.'],
    caracteristicas: ['Diseño contemporáneo', 'Ventanales de piso a techo', 'Pérgola', 'Jardín'],
    etiquetas: ['jardín', 'moderna', 'pérgola'],
    portada: 'images/casa-moderna-1.webp', galeria: ['images/casa-moderna-1.webp'],
    alt: 'Casa moderna gris con ventanales, pérgola y jardín de césped', destacada: false, nueva: false
  }
];

const ICON = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 12.6 12 20l-7.5-7.4A4.9 4.9 0 0 1 12 6.1a4.9 4.9 0 0 1 7.5 6.5Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  cama: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>',
  bano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M2 12h20M7 19v2M17 19v2"/></svg>',
  sup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6H7.3a2 2 0 0 0-1.6.9L3 10.5 1.6 11c-.9.2-1.6 1-1.6 2v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>',
  fotos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 19"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const fmtNum = n => new Intl.NumberFormat('es-AR').format(n);
const fmtPrecio = p => (p.moneda === 'USD' ? 'USD ' : '$') + fmtNum(p.precio);
const precioTexto = p => fmtPrecio(p) + (p.operacion === 'alquiler' ? ' / mes' : '');
const precioCorto = p => p.moneda === 'USD' ? `USD ${fmtNum(Math.round(p.precio / 1000))} mil` : `$${fmtNum(Math.round(p.precio / 1000))} mil`;
const opLabel = op => op === 'venta' ? 'Venta' : 'Alquiler';
const ubicacion = p => p.barrio ? `${p.barrio}, ${p.localidad}` : p.localidad;
const waUrl = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const medidas = src => /\/0\d_imagen/.test(src) ? (src.includes('01_') ? [900, 1600] : src.includes('02_') ? [1600, 900] : [1254, 1254]) : [1600, 1068];
const getProp = slug => PROPIEDADES.find(p => p.slug === slug);

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

const Fav = {
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(FAV_KEY));
      return Array.isArray(a) ? a.filter(id => PROPIEDADES.some(p => p.id === id)) : [];
    } catch { return []; }
  },
  save(a) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch { }
    syncFav();
  },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const a = this.get();
    const i = a.indexOf(id);
    if (i >= 0) a.splice(i, 1); else a.push(id);
    this.save(a);
    return i < 0;
  }
};

function syncFav() {
  const favs = Fav.get();
  $$('.fav-count').forEach(el => { el.textContent = favs.length; });
  $$('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', on);
    const p = PROPIEDADES.find(x => x.id === b.dataset.fav);
    if (b.classList.contains('card-fav') && p) b.setAttribute('aria-label', `${on ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${p.titulo}`);
    const t = b.querySelector('.modal-fav-texto');
    if (t) t.textContent = on ? 'Guardada en favoritas' : 'Guardar en favoritas';
  });
}

function latir(btn) {
  if (reduceMotion || !btn) return;
  btn.classList.remove('latido'); void btn.offsetWidth; btn.classList.add('latido');
}

function toggleFav(id, btn) {
  const on = Fav.toggle(id);
  latir(btn);
  showToast(on ? 'Guardada en tus favoritas' : 'La sacamos de tus favoritas');
  if (estado.fav && !on) render();
}

const estado = { op: '', tipo: '', loc: '', dorm: 0, precio: 0, texto: '', fav: false, visibles: POR_PAGINA };

function hayFiltros() {
  return !!(estado.op || estado.tipo || estado.loc || estado.dorm || estado.precio || estado.texto || estado.fav);
}

function filtradas() {
  const favs = Fav.get();
  const q = norm(estado.texto).trim().split(/\s+/).filter(Boolean);
  return PROPIEDADES.filter(p => {
    if (estado.op && p.operacion !== estado.op) return false;
    if (estado.tipo && p.tipo !== estado.tipo) return false;
    if (estado.loc && p.localidad !== estado.loc) return false;
    if (estado.dorm && p.dormitorios < estado.dorm) return false;
    if (estado.precio && estado.op && p.precio > estado.precio) return false;
    if (estado.fav && !favs.includes(p.id)) return false;
    if (q.length) {
      const pajar = norm([p.titulo, p.tipo, p.operacion, p.operacion === 'venta' ? 'comprar compra' : 'alquilar alquilo', p.localidad, p.barrio, p.estado, p.descripcion.join(' '), p.caracteristicas.join(' '), p.etiquetas.join(' ')].join(' '));
      if (!q.every(w => pajar.includes(w))) return false;
    }
    return true;
  }).sort((a, b) => (b.destacada - a.destacada) || a.id.localeCompare(b.id));
}

function badges(p) {
  return `<span class="badge badge-${p.operacion}">${opLabel(p.operacion)}</span>${p.nueva ? '<span class="badge badge-nueva">A estrenar</span>' : ''}`;
}

function datosCard(p) {
  const d = [];
  if (p.dormitorios) d.push([ICON.cama, `${p.dormitorios} dorm.`]);
  if (p.banos) d.push([ICON.bano, `${p.banos} ${p.banos > 1 ? 'baños' : 'baño'}`]);
  if (p.supCubierta) d.push([ICON.sup, `${fmtNum(p.supCubierta)} m² cub.`]);
  else if (p.supTotal) d.push([ICON.sup, `${fmtNum(p.supTotal)} m²`]);
  if (p.medidas) d.push([ICON.sup, p.medidas]);
  if (p.cocheras) d.push([ICON.auto, `${p.cocheras} coch.`]);
  return d.slice(0, 4).map(([i, t]) => `<li>${i}<span>${t}</span></li>`).join('');
}

function precioHTML(p) {
  return `${precioTexto(p)}${p.expensas ? `<small>+ $${fmtNum(p.expensas)} de expensas</small>` : ''}`;
}

function cardHTML(p, animar) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  const on = Fav.has(p.id);
  const [w, h] = medidas(p.portada);
  return `<article class="card" data-id="${p.id}"${anim}>
    <button type="button" class="card-fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="${on ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(p.titulo)}">${ICON.heart}</button>
    <a class="card-link" href="?propiedad=${p.slug}" data-abrir="${p.slug}">
      <div class="card-foto">
        <img src="${p.portada}" alt="${esc(p.alt)}" width="${w}" height="${h}">
        <div class="card-badges">${badges(p)}</div>
        ${p.galeria.length > 1 ? `<span class="card-fotos-n">${ICON.fotos}${p.galeria.length} fotos</span>` : ''}
      </div>
      <div class="card-body">
        <p class="card-precio">${precioHTML(p)}</p>
        <p class="card-tipo">${p.tipo}</p>
        <h3 class="card-titulo">${esc(p.titulo)}</h3>
        <p class="card-ubi">${ICON.pin}<span>${esc(ubicacion(p))}</span></p>
        <ul class="card-datos">${datosCard(p)}</ul>
      </div>
    </a>
  </article>`;
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

function refreshST() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function opcionesPrecio(select, op) {
  if (!select) return;
  if (!op) {
    const esFiltro = select.id === 'f-precio';
    select.innerHTML = esFiltro ? '<option value="0">Precio: elegí operación</option>' : '<option value="0">Sin tope</option>';
    select.disabled = esFiltro;
    return;
  }
  select.disabled = false;
  const pre = op === 'venta' ? 'USD ' : '$';
  const suf = op === 'alquiler' ? ' / mes' : '';
  select.innerHTML = '<option value="0">Sin tope de precio</option>' + PRECIOS[op].map(v => `<option value="${v}">Hasta ${pre}${fmtNum(v)}${suf}</option>`).join('');
}

function llenarOpciones() {
  const tipos = ORDEN_TIPOS.filter(t => PROPIEDADES.some(p => p.tipo === t));
  const locs = ORDEN_LOC.filter(l => PROPIEDADES.some(p => p.localidad === l));
  $$('[data-opciones="tipo"]').forEach(s => { s.insertAdjacentHTML('beforeend', tipos.map(t => `<option value="${t}">${t}</option>`).join('')); });
  $$('[data-opciones="loc"]').forEach(s => { s.insertAdjacentHTML('beforeend', locs.map(l => `<option value="${l}">${l}</option>`).join('')); });
  $$('[data-opciones="loc-todas"]').forEach(s => { s.insertAdjacentHTML('beforeend', ORDEN_LOC.map(l => `<option>${l}</option>`).join('') + '<option>Otra localidad</option>'); });
  const bOp = $('#buscador input[name="b-op"]:checked');
  opcionesPrecio($('#buscador select[name="b-precio"]'), bOp ? bOp.value : 'venta');
  opcionesPrecio($('#f-precio'), estado.op);
  $$('[data-cuenta]').forEach(el => {
    const n = PROPIEDADES.filter(p => p.operacion === el.dataset.cuenta).length;
    el.textContent = `${n} ${n === 1 ? 'propiedad' : 'propiedades'}`;
  });
}

function sincronizarControles() {
  $$('[data-f-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fOp === estado.op)));
  const set = (id, v) => { const el = document.getElementById(id); if (el && el.value !== String(v)) el.value = String(v); };
  set('f-tipo', estado.tipo); set('f-loc', estado.loc); set('f-dorm', estado.dorm); set('f-precio', estado.precio);
  const t = $('#f-texto'); if (t && t.value !== estado.texto) t.value = estado.texto;
  const f = $('#f-fav'); if (f) f.setAttribute('aria-pressed', String(estado.fav));
}

function render(opts = {}) {
  const grid = $('#cat-grid');
  if (!grid) return;
  const lista = filtradas();
  const mostrar = lista.slice(0, estado.visibles);
  const ya = opts.yaVistos || 0;
  grid.innerHTML = mostrar.map((p, i) => cardHTML(p, i >= ya)).join('');
  const n = lista.length;
  $('#cat-cuenta').textContent = estado.fav
    ? `${n} ${n === 1 ? 'favorita' : 'favoritas'}`
    : `${n} ${n === 1 ? 'propiedad' : 'propiedades'}${hayFiltros() ? ' con esos filtros' : ''}`;
  const vacio = $('#cat-vacio');
  vacio.hidden = n > 0;
  if (!n) {
    const sinFavs = estado.fav && !Fav.get().length;
    $('#vacio-titulo').textContent = sinFavs ? 'Todavía no guardaste propiedades' : 'No encontramos propiedades con esos filtros';
    $('#vacio-texto').textContent = sinFavs
      ? 'Tocá el corazón de las que te gusten y van a quedar acá para compararlas cuando quieras.'
      : 'Probá con otra localidad o sacá algún filtro. Si buscás algo puntual, escribinos y te avisamos cuando entre.';
  }
  $('#cat-mas').hidden = n <= estado.visibles;
  $('#f-limpiar').hidden = !hayFiltros();
  sincronizarControles();
  revelarNuevos(grid);
  actualizarMapa(lista);
  refreshST();
}

function limpiarFiltros() {
  Object.assign(estado, { op: '', tipo: '', loc: '', dorm: 0, precio: 0, texto: '', fav: false, visibles: POR_PAGINA });
  opcionesPrecio($('#f-precio'), '');
}

function setOp(op) {
  estado.op = op;
  estado.precio = 0;
  estado.visibles = POR_PAGINA;
  opcionesPrecio($('#f-precio'), op);
}

function irAlCatalogo() {
  const sec = document.getElementById('propiedades');
  if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initFiltros() {
  if (!$('#cat-grid')) return;
  $$('[data-f-op]').forEach(b => b.addEventListener('click', () => { setOp(b.dataset.fOp); estado.fav = false; render(); }));
  const sel = (id, key, num) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => { estado[key] = num ? Number(el.value) : el.value; estado.visibles = POR_PAGINA; render(); });
  };
  sel('f-tipo', 'tipo'); sel('f-loc', 'loc'); sel('f-dorm', 'dorm', true); sel('f-precio', 'precio', true);
  let tm = 0;
  $('#f-texto')?.addEventListener('input', e => {
    clearTimeout(tm);
    tm = setTimeout(() => { estado.texto = e.target.value; estado.visibles = POR_PAGINA; render(); }, 180);
  });
  $('#f-fav')?.addEventListener('click', () => { estado.fav = !estado.fav; estado.visibles = POR_PAGINA; render(); });
  $('#f-limpiar')?.addEventListener('click', () => { limpiarFiltros(); render(); });
  $('#vacio-btn')?.addEventListener('click', () => { limpiarFiltros(); render(); });
  $('#cat-mas')?.addEventListener('click', () => {
    const ya = Math.min(estado.visibles, filtradas().length);
    estado.visibles += POR_PAGINA;
    render({ yaVistos: ya });
  });

  const det = $('#filtros-mas');
  if (det) {
    const mq = window.matchMedia('(min-width: 761px)');
    const sync = () => { if (mq.matches) det.open = true; };
    mq.addEventListener('change', sync);
    sync();
    det.addEventListener('toggle', () => { if (mq.matches && !det.open) det.open = true; refreshST(); });
  }

  const grid = $('#cat-grid');
  grid.addEventListener('click', e => {
    const fav = e.target.closest('.card-fav');
    if (fav) { toggleFav(fav.dataset.fav, fav); return; }
    const link = e.target.closest('[data-abrir]');
    if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      abrir(link.dataset.abrir, link);
    }
  });

  $$('[data-op]').forEach(a => a.addEventListener('click', () => {
    const det = $('#filtros-mas');
    limpiarFiltros();
    setOp(a.dataset.op);
    render();
    if (det && !det.open && window.matchMedia('(min-width: 761px)').matches) det.open = true;
  }));
  $$('[data-ver-fav]').forEach(a => a.addEventListener('click', () => {
    limpiarFiltros();
    estado.fav = true;
    render();
  }));
}

function initBuscador() {
  const form = $('#buscador');
  if (!form) return;
  form.querySelectorAll('input[name="b-op"]').forEach(r => r.addEventListener('change', () => opcionesPrecio(form.querySelector('select[name="b-precio"]'), r.value)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const op = form.querySelector('input[name="b-op"]:checked')?.value || '';
    limpiarFiltros();
    setOp(op);
    estado.loc = form.querySelector('select[name="b-loc"]').value;
    estado.tipo = form.querySelector('select[name="b-tipo"]').value;
    estado.precio = Number(form.querySelector('select[name="b-precio"]').value) || 0;
    render();
    irAlCatalogo();
  });
}

function pintarZonas() {
  const ul = $('#zonas-lista');
  if (!ul) return;
  ul.innerHTML = ORDEN_LOC.map((loc, i) => {
    const v = PROPIEDADES.filter(p => p.localidad === loc && p.operacion === 'venta').length;
    const a = PROPIEDADES.filter(p => p.localidad === loc && p.operacion === 'alquiler').length;
    if (!v && !a) return '';
    const partes = [v ? `${v} en venta` : '', a ? `${a} en alquiler` : ''].filter(Boolean).join(' · ');
    return `<li data-animate="subir" style="opacity:0;transform:translateY(24px)"><button type="button" class="zona-btn" data-loc="${loc}"><span class="zona-num">${String(i + 1).padStart(2, '0')}</span><span class="zona-nombre">${loc}</span><span class="zona-cuenta">${partes}</span>${ICON.flecha}</button></li>`;
  }).join('');
  ul.addEventListener('click', e => {
    const b = e.target.closest('[data-loc]');
    if (!b) return;
    limpiarFiltros();
    estado.loc = b.dataset.loc;
    render();
    irAlCatalogo();
  });
}

let mapaLista = null;
let capaPins = null;
const pins = new Map();

function capaOSM(mapa) {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
}

function initMapaLista() {
  const el = document.getElementById('mapa-lista');
  if (!el || typeof L === 'undefined') return;
  mapaLista = L.map(el, { scrollWheelZoom: false }).setView([-34.385, -58.78], 12);
  capaOSM(mapaLista);
  capaPins = L.layerGroup().addTo(mapaLista);
}

function encuadrar(lista) {
  if (!mapaLista) return;
  const pts = (lista && lista.length ? lista : PROPIEDADES).map(p => p.coords);
  mapaLista.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 14, animate: !reduceMotion });
}

function actualizarMapa(lista) {
  if (!mapaLista) return;
  capaPins.clearLayers();
  pins.clear();
  lista.forEach(p => {
    const icono = L.divIcon({ className: 'pin-wrap', html: `<span class="pin pin--${p.operacion}">${precioCorto(p)}</span>`, iconSize: [0, 0] });
    const m = L.marker(p.coords, { icon: icono, title: `${p.titulo}, ${precioTexto(p)}`, keyboard: true, riseOnHover: true });
    m.on('click', () => abrir(p.slug));
    m.addTo(capaPins);
    pins.set(p.id, m);
  });
  if (lista.length) encuadrar(lista);
}

function marcarPin(id, on) {
  const m = pins.get(id);
  if (!m) return;
  m.getElement()?.querySelector('.pin')?.classList.toggle('is-activa', on);
  m.setZIndexOffset(on ? 1000 : 0);
}

function initVistaMapa() {
  const grid = $('#cat-grid');
  const ml = $('.ml-grid');
  if (!ml || !grid) return;
  grid.addEventListener('mouseover', e => { const c = e.target.closest('.card'); if (c) marcarPin(c.dataset.id, true); });
  grid.addEventListener('mouseout', e => { const c = e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) marcarPin(c.dataset.id, false); });
  grid.addEventListener('focusin', e => { const c = e.target.closest('.card'); if (c) marcarPin(c.dataset.id, true); });
  grid.addEventListener('focusout', e => { const c = e.target.closest('.card'); if (c) marcarPin(c.dataset.id, false); });
  $$('[data-vista]').forEach(b => b.addEventListener('click', () => {
    const mapa = b.dataset.vista === 'mapa';
    ml.classList.toggle('is-mapa', mapa);
    $$('[data-vista]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (mapa && mapaLista) setTimeout(() => { mapaLista.invalidateSize(); encuadrar(filtradas()); }, 60);
    refreshST();
  }));
}

const modal = document.getElementById('modal');
let modalProp = null;
let ultimoFoco = null;
let galIdx = 0;
let miniMapa = null;

function fichaTecnica(p) {
  const f = [['Tipo', p.tipo], ['Operación', opLabel(p.operacion)]];
  if (p.ambientes && p.tipo !== 'Local') f.push(['Ambientes', p.ambientes]);
  if (p.dormitorios) f.push(['Dormitorios', p.dormitorios]);
  if (p.banos) f.push(['Baños', p.banos]);
  if (p.cocheras) f.push(['Cocheras', p.cocheras]);
  if (p.supTotal) f.push(['Sup. total', `${fmtNum(p.supTotal)} m²`]);
  if (p.supCubierta) f.push(['Sup. cubierta', `${fmtNum(p.supCubierta)} m²`]);
  if (p.medidas) f.push(['Medidas', p.medidas]);
  if (p.estado) f.push(['Estado', p.estado]);
  if (p.expensas) f.push(['Expensas', `$${fmtNum(p.expensas)}`]);
  return f.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function similares(p) {
  return PROPIEDADES.filter(x => x.id !== p.id && x.operacion === p.operacion)
    .map(x => ({ x, s: (x.localidad === p.localidad ? 2 : 0) + (x.tipo === p.tipo ? 1 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.x);
}

function mensajeConsulta(p) {
  return `Hola Valeria, quiero consultar por «${p.titulo}» (${opLabel(p.operacion)}, ${ubicacion(p)} · ${precioTexto(p)}). Ref. ${p.id.toUpperCase()}. ¿Sigue disponible?`;
}

function mensajeVisita(p) {
  return `Hola Valeria, me gustaría agendar una visita a «${p.titulo}» (${ubicacion(p)}). Ref. ${p.id.toUpperCase()}. ¿Qué días tenés disponibles?`;
}

function fichaHTML(p) {
  const n = p.galeria.length;
  const [w, h] = medidas(p.galeria[0]);
  const on = Fav.has(p.id);
  const sim = similares(p);
  return `
    <div class="galeria">
      <div class="galeria-main">
        <img id="gal-img" src="${p.galeria[0]}" alt="${esc(p.alt)}" width="${w}" height="${h}">
        ${n > 1 ? `<button type="button" class="galeria-nav galeria-nav--prev" data-gal="-1" aria-label="Foto anterior">${ICON.prev}</button><button type="button" class="galeria-nav galeria-nav--next" data-gal="1" aria-label="Foto siguiente">${ICON.next}</button>` : ''}
        <span class="galeria-cuenta" id="gal-cuenta">1 / ${n}</span>
      </div>
      ${n > 1 ? `<div class="galeria-thumbs">${p.galeria.map((src, i) => `<button type="button" data-gal-i="${i}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0}"><img src="${src}" alt="" width="160" height="120"></button>`).join('')}</div>` : ''}
    </div>
    <div class="ficha">
      <div class="ficha-head">
        <div class="ficha-badges">${badges(p)}</div>
        <h2 id="ficha-titulo">${esc(p.titulo)}</h2>
        <p class="ficha-ubi">${ICON.pin}<span>${esc(ubicacion(p))} · ubicación aproximada</span></p>
      </div>
      <div class="ficha-body">
        <dl class="ficha-tecnica">${fichaTecnica(p)}</dl>
        <div class="ficha-desc">${p.descripcion.map(t => `<p>${esc(t)}</p>`).join('')}</div>
        <h3>Características</h3>
        <ul class="ficha-carac">${p.caracteristicas.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
        <h3>Ubicación aproximada</h3>
        <div class="ficha-mapa" id="ficha-mapa" role="img" aria-label="Mapa de la zona de ${esc(ubicacion(p))}"></div>
        <p class="ficha-mapa-nota">Mostramos la zona, no la dirección exacta. Te la pasamos al coordinar la visita.</p>
      </div>
      <aside class="ficha-lateral">
        <div class="ficha-precio-card">
          <p class="ficha-precio">${precioHTML(p)}</p>
          <a class="btn btn-primary" href="${waUrl(mensajeConsulta(p))}" target="_blank" rel="noopener">${ICON.wsp}Consultar por esta propiedad</a>
          <a class="btn btn-outline" href="${waUrl(mensajeVisita(p))}" target="_blank" rel="noopener">Agendar una visita</a>
          <button type="button" class="modal-fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.heart}<span class="modal-fav-texto">${on ? 'Guardada en favoritas' : 'Guardar en favoritas'}</span></button>
          <div class="asesor">
            <span class="asesor-inicial" aria-hidden="true">V</span>
            <div><strong>Valeria Beckman</strong><span>Te responde por WhatsApp</span></div>
          </div>
          <p class="ficha-demo">Propiedad de ejemplo: datos y valores demostrativos.</p>
        </div>
      </aside>
    </div>
    ${sim.length ? `<div class="similares"><h3>También te puede interesar</h3><div class="similares-grid">${sim.map(s => `<button type="button" class="similar" data-similar="${s.slug}"><span class="similar-foto"><img src="${s.portada}" alt="" width="192" height="144"></span><span><strong>${esc(s.titulo)}</strong><span>${esc(s.localidad)} · ${precioTexto(s)}</span></span></button>`).join('')}</div></div>` : ''}`;
}

function verFoto(i) {
  if (!modalProp) return;
  const n = modalProp.galeria.length;
  galIdx = (i + n) % n;
  const img = $('#gal-img');
  if (img) img.src = modalProp.galeria[galIdx];
  const c = $('#gal-cuenta');
  if (c) c.textContent = `${galIdx + 1} / ${n}`;
  $$('[data-gal-i]', modal).forEach(b => b.setAttribute('aria-current', String(Number(b.dataset.galI) === galIdx)));
}

function ldPropiedad(p) {
  let s = document.getElementById('ld-prop');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-prop'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': p.tipo === 'Departamento' ? 'Apartment' : p.tipo === 'Casa' || p.tipo === 'Dúplex' ? 'House' : 'Place',
    name: p.titulo,
    address: { '@type': 'PostalAddress', addressLocality: p.localidad, addressRegion: 'Buenos Aires', addressCountry: 'AR' },
    floorSize: p.supCubierta ? { '@type': 'QuantitativeValue', value: p.supCubierta, unitCode: 'MTK' } : undefined,
    numberOfRooms: p.ambientes || undefined,
    offers: { '@type': 'Offer', price: p.precio, priceCurrency: p.moneda, businessFunction: p.operacion === 'venta' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut' }
  });
}

function abrir(slug, origen) {
  const p = getProp(slug);
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = origen || document.activeElement;
  modalProp = p;
  galIdx = 0;
  if (miniMapa) { miniMapa.remove(); miniMapa = null; }
  $('#modal-contenido').innerHTML = fichaHTML(p);
  modal.setAttribute('aria-label', `Ficha: ${p.titulo}`);
  const panel = $('.modal-panel', modal);
  panel.scrollTop = 0;
  if (modal.hidden) {
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('abierto')));
  }
  panel.focus({ preventScroll: true });
  try {
    const u = new URL(location.href);
    u.searchParams.set('propiedad', p.slug);
    history.replaceState(null, '', u);
  } catch { }
  ldPropiedad(p);
  setTimeout(() => {
    const el = document.getElementById('ficha-mapa');
    if (!el || typeof L === 'undefined' || modalProp !== p) return;
    miniMapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile }).setView(p.coords, 14);
    capaOSM(miniMapa);
    L.circle(p.coords, { radius: 450, color: '#2B4C72', weight: 1, fillColor: '#2B4C72', fillOpacity: .16 }).addTo(miniMapa);
    setTimeout(() => miniMapa && miniMapa.invalidateSize(), 400);
  }, 80);
}

function cerrar() {
  if (!modal || modal.hidden) return;
  modal.classList.remove('abierto');
  document.body.classList.remove('no-scroll');
  const fin = () => {
    modal.hidden = true;
    if (miniMapa) { miniMapa.remove(); miniMapa = null; }
    $('#modal-contenido').innerHTML = '';
  };
  if (reduceMotion) fin(); else setTimeout(fin, 320);
  modalProp = null;
  try {
    const u = new URL(location.href);
    u.searchParams.delete('propiedad');
    history.replaceState(null, '', u);
  } catch { }
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
  else $('#cat-grid')?.focus?.();
}

function initModal() {
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrar(); return; }
    const g = e.target.closest('[data-gal]');
    if (g) { verFoto(galIdx + Number(g.dataset.gal)); return; }
    const t = e.target.closest('[data-gal-i]');
    if (t) { verFoto(Number(t.dataset.galI)); return; }
    const f = e.target.closest('[data-fav]');
    if (f) { toggleFav(f.dataset.fav, f); return; }
    const s = e.target.closest('[data-similar]');
    if (s) abrir(s.dataset.similar);
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && modalProp && modalProp.galeria.length > 1 && !e.target.closest('.ficha-mapa')) {
      verFoto(galIdx + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (e.key !== 'Tab') return;
    const foco = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal).filter(el => el.offsetParent !== null);
    if (!foco.length) return;
    const primero = foco[0];
    const ultimo = foco[foco.length - 1];
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === $('.modal-panel', modal))) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  const slug = new URLSearchParams(location.search).get('propiedad');
  if (slug && getProp(slug)) abrir(slug);
}

function validar(form) {
  let primero = null;
  form.querySelectorAll('input, select, textarea').forEach(c => {
    const campo = c.closest('.form-campo');
    const err = campo?.querySelector('.form-error');
    let msg = '';
    const v = c.value.trim();
    if (c.required && !v) msg = c.tagName === 'SELECT' ? 'Elegí una opción.' : c.name === 'mensaje' ? 'Contanos qué buscás.' : c.name === 'nombre' ? 'Decinos tu nombre.' : 'Dejanos un número para responderte.';
    else if (c.type === 'tel' && v && v.replace(/\D/g, '').length < 8) msg = 'Revisá el número: faltan dígitos.';
    else if (c.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Ese email no parece válido.';
    campo?.classList.toggle('invalido', !!msg);
    c.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    if (msg && !primero) primero = c;
  });
  if (primero) primero.focus();
  return !primero;
}

function enviarPorWhatsApp(form, texto, aviso) {
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  window.open(waUrl(texto), '_blank', 'noopener');
  btn.disabled = true;
  btn.textContent = 'Abriendo WhatsApp…';
  showToast(aviso);
  setTimeout(() => { btn.disabled = false; btn.textContent = label; form.reset(); }, 900);
}

function initForms() {
  $$('.form-campo input, .form-campo select, .form-campo textarea').forEach(c => c.addEventListener('input', () => {
    const campo = c.closest('.form-campo');
    if (campo?.classList.contains('invalido')) { campo.classList.remove('invalido'); c.setAttribute('aria-invalid', 'false'); const er = campo.querySelector('.form-error'); if (er) er.textContent = ''; }
  }));
  const tas = $('#form-tasacion');
  tas?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar(tas)) { showToast('Revisá los campos marcados'); return; }
    const d = new FormData(tas);
    enviarPorWhatsApp(tas, `Hola Valeria, quiero tasar mi propiedad. Tipo: ${d.get('tipo')}. Localidad: ${d.get('localidad')}. Mi WhatsApp: ${d.get('telefono')}.`, 'Te abrimos WhatsApp con tu pedido de tasación');
  });
  const con = $('#form-consulta');
  con?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar(con)) { showToast('Revisá los campos marcados'); return; }
    const d = new FormData(con);
    const email = String(d.get('email') || '').trim();
    enviarPorWhatsApp(con, `Hola Valeria, soy ${d.get('nombre')}. ${d.get('mensaje')} Mi teléfono: ${d.get('telefono')}.${email ? ` Email: ${email}.` : ''}`, 'Te abrimos WhatsApp con tu consulta');
  });
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
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

llenarOpciones();
pintarZonas();
Fav.save(Fav.get());
initMapaLista();
render();
initReveals();
initHeroMotion();
initNav();
initWspFloat();
initModelBarScroll();
initFiltros();
initBuscador();
initVistaMapa();
initForms();
initModal();
