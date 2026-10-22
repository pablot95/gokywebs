const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491173665358';
const FAV_KEY = 'ezequiel_favoritos';
const POR_PAGINA = 12;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const fmtUSD = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
const fmtARS = n => '$' + Math.round(n).toLocaleString('es-AR');
const usdCorto = n => 'USD ' + Math.round(n / 1000).toLocaleString('es-AR') + ' mil';
const waLink = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
const ico = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;

const PROPIEDADES = [
  {
    id: 'casa-jardin-florida', titulo: 'Casa con jardín y quincho', tipo: 'Casa', estado: 'Usado',
    precio: 340000, expensas: 0, zona: 'GBA Norte', ciudad: 'Vicente López', barrio: 'Florida Oeste',
    ambientes: 5, dormitorios: 3, banos: 2, cocheras: 1, superficieTotal: 300, superficieCubierta: 180,
    antiguedad: '8 años', orientacion: 'Norte', coords: [-34.5355, -58.5040], destacada: true,
    fotos: ['casa-jardin-1', 'casa-jardin-2', 'casa-jardin-3'], foco: '50% 42%',
    alts: ['Fachada de casa de dos plantas con piedra, cochera y jardín al frente', 'Jardín con césped y quincho bajo pérgola de madera', 'Baño con ducha de vidrio, vanitory de madera y ventana al jardín'],
    descripcion: ['Casa de dos plantas sobre lote propio, con fachada de piedra y revoque, cochera cubierta y jardín al frente con senderos de laja.', 'En el fondo, el quincho con parrilla bajo pérgola de madera da a un parque con césped. Adentro, living comedor con salida a la galería, cocina independiente y tres dormitorios en planta alta, el principal en suite.'],
    caracteristicas: ['Jardín al frente y parque al fondo', 'Quincho con parrilla bajo pérgola', 'Cochera cubierta', 'Dormitorio principal en suite', 'Galería semicubierta', 'Fachada de piedra y revoque']
  },
  {
    id: 'depto-belgrano-balcon', titulo: 'Departamento luminoso con balcón', tipo: 'Departamento', estado: 'Usado',
    precio: 245000, expensas: 230000, zona: 'CABA', ciudad: 'CABA', barrio: 'Belgrano',
    ambientes: 3, dormitorios: 2, banos: 2, cocheras: 1, superficieTotal: 82, superficieCubierta: 74,
    antiguedad: '5 años', orientacion: 'Noreste', coords: [-34.5627, -58.4565], destacada: true,
    fotos: ['depto-belgrano-1', 'depto-belgrano-2', 'depto-belgrano-3', 'depto-belgrano-4', 'depto-belgrano-5'], foco: '50% 50%',
    alts: ['Living con ventanales de piso a techo y vista a la ciudad', 'Comedor con mesa de madera junto al ventanal', 'Cocina blanca con mesada clara y ventana a la ciudad', 'Dormitorio con placard y ventana con cortinas de lino', 'Balcón corrido con sillas y vista a una calle arbolada'],
    descripcion: ['Tres ambientes en un séptimo piso, con living comedor de ventanales de piso a techo y balcón corrido con vista a la copa de los árboles y a los edificios de Belgrano.', 'Cocina con ventana y mesada de piedra, dos dormitorios con placard, el principal con baño en suite. Cochera fija en el subsuelo.'],
    caracteristicas: ['Balcón corrido con vista abierta', 'Ventanales de piso a techo', 'Cocina con ventana', 'Dormitorio principal en suite', 'Placares en los dos dormitorios', 'Cochera fija']
  },
  {
    id: 'depto-colegiales-2amb', titulo: 'Dos ambientes en edificio con balcones', tipo: 'Departamento', estado: 'Reciclado',
    precio: 132000, expensas: 120000, zona: 'CABA', ciudad: 'CABA', barrio: 'Colegiales',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, superficieTotal: 48, superficieCubierta: 44,
    antiguedad: 'Reciclado', orientacion: 'Frente', coords: [-34.5745, -58.4490], destacada: false,
    fotos: ['depto-colegiales-1', 'depto-colegiales-2', 'depto-colegiales-3'], foco: '50% 40%',
    alts: ['Edificio de balcones con plantas sobre una calle arbolada de Colegiales', 'Cocina integrada con barra, muebles negros y living al fondo', 'Barra de la cocina con banquetas y living con ventanal'],
    descripcion: ['Dos ambientes al frente en un edificio de balcones con plantas, sobre una calle arbolada de Colegiales.', 'Reciclado completo: cocina integrada al living con barra para comer, aire acondicionado y pisos de madera. Dormitorio con placard y baño completo.'],
    caracteristicas: ['Cocina integrada con barra', 'Balcón a la calle', 'Calle arbolada', 'Pisos de madera', 'Aire acondicionado']
  },
  {
    id: 'casa-pileta-san-isidro', titulo: 'Casa moderna con pileta y parque', tipo: 'Casa', estado: 'Usado',
    precio: 690000, expensas: 0, zona: 'GBA Norte', ciudad: 'San Isidro', barrio: 'San Isidro',
    ambientes: 6, dormitorios: 4, banos: 3, cocheras: 2, superficieTotal: 620, superficieCubierta: 320,
    antiguedad: '3 años', orientacion: 'Noroeste', coords: [-34.4740, -58.5280], destacada: true,
    fotos: ['casa-sanisidro-1', 'casa-sanisidro-2', 'casa-sanisidro-3'], foco: '50% 55%',
    alts: ['Casa moderna de dos plantas con pileta, deck y parque con senderos', 'Pileta con deck de madera frente a la casa', 'Galería con pérgola de madera junto a la pileta'],
    descripcion: ['Casa contemporánea en dos plantas, con revestimiento de madera y piedra clara, pileta con deck y un parque amplio con senderos de losetas.', 'Planta baja integrada con ventanales hacia la pileta y galería con pérgola. Cuatro dormitorios, el principal con salida a la terraza de planta alta. Cochera para dos autos.'],
    caracteristicas: ['Pileta con deck de madera', 'Parque con senderos', 'Galería con pérgola', 'Terraza en planta alta', 'Ventanales de piso a techo', 'Cochera para dos autos']
  },
  {
    id: 'casa-a-estrenar-olivos', titulo: 'Casa a estrenar con parque', tipo: 'Casa', estado: 'A estrenar',
    precio: 455000, expensas: 0, zona: 'GBA Norte', ciudad: 'Vicente López', barrio: 'Olivos',
    ambientes: 5, dormitorios: 3, banos: 3, cocheras: 2, superficieTotal: 420, superficieCubierta: 230,
    antiguedad: 'A estrenar', orientacion: 'Norte', coords: [-34.5100, -58.4930], destacada: false,
    fotos: ['casa-olivos-1', 'casa-olivos-2', 'casa-olivos-3', 'casa-olivos-4'], foco: '50% 50%',
    alts: ['Casa nueva con fachada de madera y piedra, ventanales y parque', 'Sendero de adoquín entre el parque y la casa', 'Living de doble altura con ventanales y pisos de porcelanato', 'Dormitorio amplio con piso de madera y ventanas'],
    descripcion: ['Casa a estrenar en Olivos, terminada en madera, piedra y carpinterías negras, con parque y sendero de adoquín.', 'Living de doble altura con ventanales, pisos de porcelanato y ambientes amplios listos para equipar. Tres dormitorios y tres baños; cochera para dos autos.'],
    caracteristicas: ['A estrenar', 'Living de doble altura', 'Ventanales al parque', 'Pisos de porcelanato y madera', 'Fachada de madera y piedra', 'Cochera para dos autos']
  },
  {
    id: 'monoambiente-caballito', titulo: 'Monoambiente con ventanal a la ciudad', tipo: 'Departamento', estado: 'Usado',
    precio: 78000, expensas: 85000, zona: 'CABA', ciudad: 'CABA', barrio: 'Caballito',
    ambientes: 1, dormitorios: 0, banos: 1, cocheras: 0, superficieTotal: 34, superficieCubierta: 32,
    antiguedad: '15 años', orientacion: 'Este', coords: [-34.6189, -58.4421], destacada: false,
    fotos: ['mono-caballito-1', 'mono-caballito-2', 'mono-caballito-3'], foco: '50% 50%',
    alts: ['Monoambiente con escritorio, cómoda y ventanal a la ciudad', 'Cocina integrada con barra de madera y placares blancos', 'Sector dormitorio con cama, cómoda de madera y ventanal'],
    descripcion: ['Monoambiente luminoso en un noveno piso, con ventanal a la ciudad y un ambiente amplio que se ordena entre living y sector dormitorio.', 'Cocina integrada con barra de madera, placares de pared a pared y pisos de madera clara. Una buena primera vivienda en Caballito.'],
    caracteristicas: ['Ventanal con vista abierta', 'Cocina integrada con barra', 'Placares de pared a pared', 'Pisos de madera clara', 'Noveno piso']
  },
  {
    id: 'ph-reciclado-villa-crespo', titulo: 'PH reciclado con entrepiso', tipo: 'PH', estado: 'Reciclado',
    precio: 195000, expensas: 0, zona: 'CABA', ciudad: 'CABA', barrio: 'Villa Crespo',
    ambientes: 4, dormitorios: 2, banos: 2, cocheras: 0, superficieTotal: 110, superficieCubierta: 92,
    antiguedad: 'Reciclado', orientacion: 'Norte', coords: [-34.5990, -58.4380], destacada: true,
    fotos: ['ph-villacrespo-1', 'ph-villacrespo-2', 'ph-villacrespo-3'], foco: '50% 50%',
    alts: ['Living de PH con escalera de hierro, hamaca y ventanal', 'Cocina abierta y comedor junto a la escalera al entrepiso', 'Pared de ladrillo a la vista con biblioteca y escalera de hierro'],
    descripcion: ['PH reciclado con entrepiso, pared de ladrillo a la vista y escalera de hierro que sube a un altillo con biblioteca.', 'Living de doble altura con ventanal, cocina abierta con comedor y salamandra para el invierno. Dos dormitorios, dos baños y sin expensas.'],
    caracteristicas: ['Entrepiso con escalera de hierro', 'Ladrillo a la vista', 'Living de doble altura', 'Biblioteca empotrada', 'Salamandra', 'Sin expensas']
  },
  {
    id: 'depto-a-estrenar-villa-urquiza', titulo: 'Tres ambientes a estrenar', tipo: 'Departamento', estado: 'A estrenar',
    precio: 232000, expensas: 160000, zona: 'CABA', ciudad: 'CABA', barrio: 'Villa Urquiza',
    ambientes: 3, dormitorios: 2, banos: 2, cocheras: 1, superficieTotal: 78, superficieCubierta: 72,
    antiguedad: 'A estrenar', orientacion: 'Frente', coords: [-34.5733, -58.4867], destacada: false,
    fotos: ['depto-urquiza-1', 'depto-urquiza-2', 'depto-urquiza-3', 'depto-urquiza-4'], foco: '50% 55%',
    alts: ['Living vacío con ventanal al frente y placares blancos', 'Cocina separada blanca y pasillo a los dormitorios', 'Ambiente amplio con pisos de madera y luz natural', 'Dormitorio con placard espejado y pisos de madera'],
    descripcion: ['Tres ambientes a estrenar, al frente, con living comedor de ventanales, placares de pared a pared y pisos de madera.', 'Cocina separada con lugar para lavarropas, dos dormitorios y dos baños. Calefacción por radiadores y cochera en el edificio.'],
    caracteristicas: ['A estrenar', 'Al frente', 'Placares de pared a pared', 'Cocina separada', 'Calefacción por radiadores', 'Cochera']
  },
  {
    id: 'depto-palermo-2amb', titulo: 'Dos ambientes reciclado y silencioso', tipo: 'Departamento', estado: 'Reciclado',
    precio: 158000, expensas: 140000, zona: 'CABA', ciudad: 'CABA', barrio: 'Palermo',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, superficieTotal: 52, superficieCubierta: 50,
    antiguedad: 'Reciclado', orientacion: 'Contrafrente', coords: [-34.5888, -58.4300], destacada: false,
    fotos: ['depto-palermo-1', 'depto-palermo-2', 'depto-palermo-3'], foco: '50% 50%',
    alts: ['Comedor diario con mesa alta de madera y cocina al fondo', 'Cocina con estantes de madera, azulejos blancos y horno', 'Dormitorio y living con sillón y plantas'],
    descripcion: ['Dos ambientes reciclado en un edificio de estilo, contrafrente y silencioso, en Palermo.', 'Pisos de parquet, cocina con estantes abiertos y comedor diario junto a la ventana. Dormitorio con placard y baño completo.'],
    caracteristicas: ['Contrafrente silencioso', 'Pisos de parquet', 'Cocina con estantes abiertos', 'Comedor diario', 'Edificio de estilo']
  },
  {
    id: 'ph-terraza-saavedra', titulo: 'PH con terraza propia y parrilla', tipo: 'PH', estado: 'Usado',
    precio: 218000, expensas: 0, zona: 'CABA', ciudad: 'CABA', barrio: 'Saavedra',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 0, superficieTotal: 128, superficieCubierta: 86,
    antiguedad: '30 años', orientacion: 'Norte', coords: [-34.5530, -58.4860], destacada: false,
    fotos: ['ph-saavedra-1', 'ph-saavedra-2', 'ph-saavedra-3'], foco: '50% 60%',
    alts: ['Terraza propia de ladrillo con mesa, sombrilla y parrilla', 'Terraza con vista a los techos del barrio', 'Dormitorio luminoso con ventana y cama de dos plazas'],
    descripcion: ['PH en planta alta con terraza propia de ladrillo, espacio para parrilla y vista a los techos del barrio.', 'Tres dormitorios luminosos, dos baños y living comedor. Entrada independiente y sin expensas.'],
    caracteristicas: ['Terraza propia', 'Espacio para parrilla', 'Entrada independiente', 'Ladrillo a la vista', 'Sin expensas']
  },
  {
    id: 'casa-galeria-bella-vista', titulo: 'Casa con galería vidriada', tipo: 'Casa', estado: 'Usado',
    precio: 385000, expensas: 0, zona: 'GBA Norte', ciudad: 'San Miguel', barrio: 'Bella Vista',
    ambientes: 5, dormitorios: 3, banos: 2, cocheras: 2, superficieTotal: 900, superficieCubierta: 240,
    antiguedad: '12 años', orientacion: 'Noreste', coords: [-34.5600, -58.6900], destacada: false,
    fotos: ['casa-bellavista-1', 'casa-bellavista-2', 'casa-bellavista-3'], foco: '50% 55%',
    alts: ['Casa con techo a dos aguas, galería vidriada y parque arbolado', 'Parque con coníferas frente a la casa', 'Comedor con mesa de madera y ventanales al jardín'],
    descripcion: ['Casa en dos plantas con techo a dos aguas, galería vidriada y un parque arbolado con coníferas y canteros.', 'Comedor con ventanales al jardín, pisos de porcelanato y tres dormitorios en planta alta, uno con balcón. Cochera para dos autos.'],
    caracteristicas: ['Galería vidriada', 'Parque arbolado', 'Comedor con ventanales', 'Balcón en planta alta', 'Pisos de porcelanato', 'Cochera para dos autos']
  },
  {
    id: 'casa-barrio-cerrado-pilar', titulo: 'Casa en barrio cerrado', tipo: 'Casa', estado: 'Usado',
    precio: 470000, expensas: 280000, zona: 'GBA Norte', ciudad: 'Pilar', barrio: 'Pilar',
    ambientes: 6, dormitorios: 4, banos: 3, cocheras: 2, superficieTotal: 1100, superficieCubierta: 280,
    antiguedad: '18 años', orientacion: 'Norte', coords: [-34.4580, -58.9140], destacada: false,
    fotos: ['casa-pilar-1', 'casa-pilar-2', 'casa-pilar-3'], foco: '50% 60%',
    alts: ['Casa blanca con techos a dos aguas y parque de césped', 'Vista lateral de la casa con galería y parque', 'Living con sillones, cocina integrada y salida al jardín'],
    descripcion: ['Casa en barrio cerrado de Pilar, sobre un lote de 1.100 m² con parque y galería.', 'Living con salida al jardín, cocina integrada y cuatro dormitorios. Las expensas son las del barrio: seguridad y mantenimiento de los espacios comunes.'],
    caracteristicas: ['Lote de 1.100 m²', 'Barrio cerrado', 'Living con salida al jardín', 'Cocina integrada', 'Galería', 'Cochera para dos autos']
  }
];

const ZONAS = [
  { id: 'CABA', grupo: 'Ciudad de Buenos Aires', todas: 'Toda CABA' },
  { id: 'GBA Norte', grupo: 'Zona norte (GBA)', todas: 'Toda la zona norte' }
];
const RANGOS = [
  { v: 'hasta-100', t: 'Hasta USD 100.000', min: 0, max: 100000 },
  { v: '100-200', t: 'USD 100.000 a 200.000', min: 100000, max: 200000 },
  { v: '200-350', t: 'USD 200.000 a 350.000', min: 200000, max: 350000 },
  { v: 'mas-350', t: 'Más de USD 350.000', min: 350000, max: Infinity }
];
const DORMS = [
  { v: '0', t: 'Monoambiente' }, { v: '1', t: '1 dormitorio' }, { v: '2', t: '2 dormitorios' }, { v: '3', t: '3 o más' }
];
const TIPO_PLURAL = { Casa: 'Casas', Departamento: 'Departamentos', PH: 'PH' };

const estado = { zona: '', tipo: '', precio: '', dorm: '', q: '', soloFav: false, orden: 'destacadas' };
let pagina = 1;
const getProp = id => PROPIEDADES.find(p => p.id === id);
const ubicacion = p => `${p.barrio}, ${p.ciudad === p.barrio ? 'GBA Norte' : p.ciudad}`;
const msgProp = p => `Hola Ezequiel, quiero consultar por "${p.titulo}" en ${p.barrio} (${fmtUSD(p.precio)}). Ref: ${p.id}`;
const msgVisita = p => `Hola Ezequiel, quiero agendar una visita a "${p.titulo}" en ${p.barrio} (ref: ${p.id}). ¿Qué días tenés disponibles?`;

function leerFavs() {
  try {
    const a = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    return Array.isArray(a) ? a.filter(id => getProp(id)) : [];
  } catch { return []; }
}
const favs = new Set(leerFavs());
function guardarFavs() { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch { /* sin almacenamiento */ } }

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
    .from(hero.querySelectorAll('.buscador, .hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.nota-demo'), { opacity: 0, duration: 0.8, clearProps: 'opacity' }, 0.75);
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function irA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function poblarSelects() {
  const barriosDe = z => [...new Set(PROPIEDADES.filter(p => p.zona === z).map(p => p.barrio))].sort((a, b) => a.localeCompare(b, 'es'));
  const zonaOpts = ZONAS.filter(z => barriosDe(z.id).length).map(z =>
    `<optgroup label="${esc(z.grupo)}"><option value="g:${esc(z.id)}">${esc(z.todas)}</option>${barriosDe(z.id).map(b => `<option value="b:${esc(b)}">${esc(b)}</option>`).join('')}</optgroup>`).join('');
  const tipos = [...new Set(PROPIEDADES.map(p => p.tipo))];
  const tipoOpts = tipos.map(t => `<option value="${esc(t)}">${esc(TIPO_PLURAL[t] || t)}</option>`).join('');
  const precioOpts = RANGOS.filter(r => PROPIEDADES.some(p => p.precio >= r.min && p.precio < r.max)).map(r => `<option value="${r.v}">${esc(r.t)}</option>`).join('');
  const dormOpts = DORMS.filter(d => PROPIEDADES.some(p => (d.v === '3' ? p.dormitorios >= 3 : p.dormitorios === +d.v))).map(d => `<option value="${d.v}">${esc(d.t)}</option>`).join('');
  const html = { zona: zonaOpts, tipo: tipoOpts, precio: precioOpts, dorm: dormOpts };
  document.querySelectorAll('select[data-f]').forEach(sel => {
    const f = sel.dataset.f;
    if (html[f]) sel.insertAdjacentHTML('beforeend', html[f]);
  });
  document.querySelectorAll('[data-select-propiedades]').forEach(sel => {
    sel.insertAdjacentHTML('beforeend', PROPIEDADES.map(p => `<option value="${p.id}">${esc(p.titulo)} · ${esc(p.barrio)}</option>`).join(''));
  });
}

function coincide(p) {
  if (estado.zona) {
    const [k, v] = estado.zona.split(':');
    if (k === 'g' && p.zona !== v) return false;
    if (k === 'b' && p.barrio !== v) return false;
  }
  if (estado.tipo && p.tipo !== estado.tipo) return false;
  if (estado.precio) {
    const r = RANGOS.find(x => x.v === estado.precio);
    if (r && (p.precio < r.min || p.precio >= r.max)) return false;
  }
  if (estado.dorm !== '') {
    const d = +estado.dorm;
    if (d === 3 ? p.dormitorios < 3 : p.dormitorios !== d) return false;
  }
  if (estado.soloFav && !favs.has(p.id)) return false;
  if (estado.q) {
    const texto = norm([p.titulo, p.tipo, 'venta', p.estado, p.barrio, p.ciudad, p.zona, ...p.descripcion, ...p.caracteristicas].join(' '));
    if (!norm(estado.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
  }
  return true;
}

function filtrar() {
  const lista = PROPIEDADES.filter(coincide);
  const orden = {
    'precio-asc': (a, b) => a.precio - b.precio,
    'precio-desc': (a, b) => b.precio - a.precio,
    'm2-desc': (a, b) => b.superficieCubierta - a.superficieCubierta,
    destacadas: (a, b) => (b.destacada - a.destacada) || (PROPIEDADES.indexOf(a) - PROPIEDADES.indexOf(b))
  }[estado.orden] || (() => 0);
  return lista.sort(orden);
}

function datosCard(p) {
  const d = [
    ['i-ruler', `${p.superficieCubierta} m²`],
    ['i-bed', p.dormitorios === 0 ? 'Monoamb.' : `${p.dormitorios} dorm.`],
    ['i-bath', `${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}`]
  ];
  if (p.cocheras) d.push(['i-car', `${p.cocheras} coch.`]);
  return d.map(([i, t]) => `<li>${ico(i)}${t}</li>`).join('');
}

function expensasTxt(p, largo = false) {
  if (p.expensas) return `+ ${fmtARS(p.expensas)} de expensas${largo ? ' por mes' : ''}`;
  if (p.tipo === 'PH') return 'Sin expensas';
  return '';
}

function favBtn(p, cls = 'fav') {
  const on = favs.has(p.id);
  return `<button type="button" class="${cls}" data-fav="${p.id}" aria-pressed="${on}" aria-label="${on ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(p.titulo)}">${ico('i-heart')}</button>`;
}

function cardHTML(p) {
  const exp = expensasTxt(p);
  return `<article class="prop" data-id="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
  <div class="prop__media">
    <img src="images/${p.fotos[0]}-800.webp" srcset="images/${p.fotos[0]}-800.webp 800w, images/${p.fotos[0]}.webp 1600w" sizes="(min-width: 1081px) 400px, (min-width: 641px) 50vw, 100vw" width="800" height="600" alt="${esc(p.alts[0])}" style="object-position:${p.foco}">
    <div class="prop__badges"><span class="badge">Venta</span>${p.estado === 'A estrenar' ? '<span class="badge badge--nuevo">A estrenar</span>' : ''}</div>
    <span class="prop__fotos">${ico('i-camera')}${p.fotos.length}<span class="sr-only"> fotos</span></span>
    ${favBtn(p)}
  </div>
  <div class="prop__body">
    <p class="prop__precio">${fmtUSD(p.precio)}${exp ? `<span class="prop__expensas">${exp}</span>` : ''}</p>
    <p class="prop__tipo">${esc(p.tipo)} · ${p.ambientes === 1 ? 'Monoambiente' : `${p.ambientes} ambientes`}</p>
    <h3 class="prop__titulo"><a class="prop__abrir" href="?propiedad=${p.id}" data-abrir="${p.id}">${esc(p.titulo)}</a></h3>
    <p class="prop__ubic">${ico('i-pin')}${esc(ubicacion(p))}</p>
    <ul class="prop__datos">${datosCard(p)}</ul>
    <div class="prop__acciones">
      <a class="btn" href="${waLink(msgProp(p))}" target="_blank" rel="noopener">${ico('i-wsp', 'ico-wsp')}Consultar</a>
      <a class="btn btn--claro" href="?propiedad=${p.id}" data-abrir="${p.id}">Ver ficha</a>
    </div>
  </div>
</article>`;
}

function hayFiltros() { return !!(estado.zona || estado.tipo || estado.precio || estado.dorm !== '' || estado.q || estado.soloFav); }

function render() {
  const cont = document.getElementById('listado');
  if (!cont) return;
  const lista = filtrar();
  const visibles = lista.slice(0, pagina * POR_PAGINA);
  cont.innerHTML = visibles.map(cardHTML).join('');
  const n = lista.length;
  const conteo = document.querySelector('[data-conteo]');
  if (conteo) conteo.innerHTML = `${n} ${n === 1 ? 'propiedad' : 'propiedades'} <span>${estado.soloFav ? 'guardadas' : 'en venta'}</span>`;
  const vacio = document.getElementById('vacio');
  if (vacio) {
    vacio.hidden = n > 0;
    const sinFavs = estado.soloFav && favs.size === 0;
    vacio.querySelector('[data-vacio-titulo]').textContent = sinFavs ? 'Todavía no guardaste propiedades' : 'No hay propiedades con esos filtros';
    vacio.querySelector('[data-vacio-texto]').textContent = sinFavs ? 'Tocá el corazón de las que te gusten y las vas a encontrar acá.' : 'Probá con otra zona o un rango de precio más amplio.';
  }
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = visibles.length >= n;
  document.querySelectorAll('.limpiar[data-limpiar]').forEach(b => { b.hidden = !hayFiltros(); });
  const activos = ['zona', 'tipo', 'precio'].filter(k => estado[k]).length + (estado.dorm !== '' ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = activos; b.hidden = !activos; });
  document.querySelectorAll('[data-fav-toggle]').forEach(b => b.setAttribute('aria-pressed', String(estado.soloFav)));
  revelarNuevos(cont);
  actualizarMapa(lista);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function sincronizarControles() {
  document.querySelectorAll('[data-f]').forEach(c => { c.value = estado[c.dataset.f]; });
  document.querySelectorAll('[data-orden]').forEach(c => { c.value = estado.orden; });
}

function setFiltro(f, v) {
  estado[f] = v;
  pagina = 1;
  sincronizarControles();
  render();
}

function limpiarFiltros() {
  Object.assign(estado, { zona: '', tipo: '', precio: '', dorm: '', q: '', soloFav: false });
  pagina = 1;
  sincronizarControles();
  render();
}

function initCatalogo() {
  if (!document.getElementById('listado')) return;
  let t = 0;
  document.querySelectorAll('[data-f]').forEach(c => {
    const ev = c.tagName === 'INPUT' ? 'input' : 'change';
    c.addEventListener(ev, () => {
      if (c.closest('#buscador')) { estado[c.dataset.f] = c.value; return; }
      if (ev === 'input') { clearTimeout(t); t = setTimeout(() => setFiltro(c.dataset.f, c.value.trim()), 220); }
      else setFiltro(c.dataset.f, c.value);
    });
  });
  document.querySelectorAll('[data-orden]').forEach(c => c.addEventListener('change', () => { estado.orden = c.value; pagina = 1; render(); }));
  document.getElementById('buscador')?.addEventListener('submit', e => {
    e.preventDefault();
    pagina = 1;
    sincronizarControles();
    render();
    irA('propiedades');
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarFiltros));
  document.querySelectorAll('[data-fav-toggle]').forEach(b => b.addEventListener('click', () => { estado.soloFav = !estado.soloFav; pagina = 1; render(); }));
  document.querySelectorAll('[data-ver-favs]').forEach(b => b.addEventListener('click', () => {
    estado.soloFav = true; pagina = 1; render(); irA('propiedades');
  }));
  document.getElementById('verMas')?.addEventListener('click', () => { pagina++; render(); });
  render();
}

function actualizarFavUI(id) {
  const on = favs.has(id);
  const p = getProp(id);
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
    b.setAttribute('aria-pressed', String(on));
    if (b.classList.contains('fav')) b.setAttribute('aria-label', `${on ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${p?.titulo || ''}`);
    const txt = b.querySelector('[data-fav-txt]');
    if (txt) txt.textContent = on ? 'Guardada en favoritas' : 'Guardar en favoritas';
    b.classList.remove('pop'); void b.offsetWidth; if (on) b.classList.add('pop');
  });
  document.querySelectorAll('[data-fav-count]').forEach(c => { c.textContent = favs.size; });
  const head = document.querySelector('.fav-header');
  if (head && on) { head.classList.remove('latido'); void head.offsetWidth; head.classList.add('latido'); }
}

function toggleFav(id) {
  if (!getProp(id)) return;
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  guardarFavs();
  actualizarFavUI(id);
  showToast(favs.has(id) ? 'Guardada en tus favoritas.' : 'La sacaste de tus favoritas.');
  if (estado.soloFav) render();
}

function initZonas() {
  const cont = document.getElementById('zonasListas');
  if (!cont) return;
  cont.innerHTML = ZONAS.map(z => {
    const barrios = [...new Set(PROPIEDADES.filter(p => p.zona === z.id).map(p => p.barrio))].sort((a, b) => a.localeCompare(b, 'es'));
    if (!barrios.length) return '';
    const filas = barrios.map(b => {
      const ps = PROPIEDADES.filter(p => p.barrio === b);
      const dato = ps.length === 1 ? `${ps[0].tipo} · ${usdCorto(ps[0].precio)}` : `${ps.length} propiedades · desde ${usdCorto(Math.min(...ps.map(p => p.precio)))}`;
      return `<li data-animate="der" style="opacity:0;transform:translateX(40px)"><button type="button" class="zona-fila" data-zona="b:${esc(b)}"><span class="zona-fila__nombre">${esc(b)}</span><span class="zona-fila__dato">${esc(dato)}</span>${ico('i-arrow')}</button></li>`;
    }).join('');
    return `<div class="zonas__grupo"><h3 data-animate="subir" style="opacity:0;transform:translateY(20px)">${esc(z.grupo)}</h3><ul>${filas}</ul></div>`;
  }).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-zona]');
    if (!b) return;
    estado.soloFav = false;
    setFiltro('zona', b.dataset.zona);
    irA('propiedades');
  });
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const abrir = document.querySelector('[data-abrir-filtros]');
  const fondo = document.querySelector('.filtros-fondo');
  if (!panel || !abrir) return;
  const mq = window.matchMedia('(max-width: 860px)');
  const abierto = () => panel.classList.contains('open');
  const open = () => {
    const anc = panel.closest('[data-animate]');
    if (anc) { anc.classList.add('in'); anc.style.transition = 'none'; void anc.offsetWidth; anc.style.transition = ''; }
    panel.classList.add('open'); fondo?.classList.add('open');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.removeAttribute('inert');
    abrir.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    panel.querySelector('select')?.focus();
  };
  const close = () => {
    panel.classList.remove('open'); fondo?.classList.remove('open');
    panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    if (mq.matches) panel.setAttribute('inert', '');
    abrir.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  abrir.addEventListener('click', open);
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { if (abierto()) { close(); abrir.focus(); } }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && abierto()) { close(); abrir.focus(); } });
  const sync = () => {
    if (!mq.matches) { if (abierto()) close(); panel.removeAttribute('inert'); }
    else if (!abierto()) panel.setAttribute('inert', '');
  };
  mq.addEventListener('change', sync);
  sync();
}

let mapaLista = null;
let capaPins = null;
const pinsPorId = new Map();

function capaTiles(mapa) {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
}

function initMapaListado() {
  const el = document.getElementById('mapaListado');
  if (!el || typeof L === 'undefined') return;
  try {
    mapaLista = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([-34.55, -58.6], 10);
    capaTiles(mapaLista);
    capaPins = L.layerGroup().addTo(mapaLista);
    const lejos = () => el.classList.toggle('mapa--lejos', mapaLista.getZoom() < 12);
    mapaLista.on('zoomend', lejos);
    lejos();
  } catch (err) {
    mapaLista = null;
  }
  const lista = document.getElementById('listado');
  lista?.addEventListener('mouseover', e => marcarPin(e.target.closest('.prop')?.dataset.id));
  lista?.addEventListener('mouseleave', () => marcarPin(null));
  lista?.addEventListener('focusin', e => marcarPin(e.target.closest('.prop')?.dataset.id));
}

function marcarPin(id) {
  pinsPorId.forEach((m, k) => m.getElement()?.classList.toggle('activo', k === id));
}

function marcarCard(id) {
  document.querySelectorAll('#listado .prop').forEach(c => c.classList.toggle('activa', c.dataset.id === id));
}

function encuadrar(lista) {
  if (!mapaLista || !lista.length) return;
  try {
    if (lista.length === 1) mapaLista.setView(lista[0].coords, 14);
    else mapaLista.fitBounds(L.latLngBounds(lista.map(p => p.coords)), { padding: [56, 56], maxZoom: 14 });
  } catch (err) { /* el mapa todavía no tiene tamaño */ }
}

let ultimaLista = [];
function actualizarMapa(lista) {
  ultimaLista = lista;
  if (!mapaLista || !capaPins) return;
  capaPins.clearLayers();
  pinsPorId.clear();
  lista.forEach(p => {
    const icon = L.divIcon({ className: 'pin-precio', html: `<span>${usdCorto(p.precio)}</span>`, iconSize: [0, 0] });
    const m = L.marker(p.coords, { icon, title: p.titulo, alt: `${p.titulo}, ${fmtUSD(p.precio)}`, riseOnHover: true }).addTo(capaPins);
    m.on('click', () => abrirFicha(p.id));
    m.on('mouseover', () => { marcarCard(p.id); marcarPin(p.id); });
    m.on('mouseout', () => { marcarCard(null); marcarPin(null); });
    pinsPorId.set(p.id, m);
  });
  encuadrar(lista);
}

function initVistaToggle() {
  const btns = document.querySelectorAll('[data-vista]');
  if (!btns.length) return;
  btns.forEach(b => b.addEventListener('click', () => {
    const mapa = b.dataset.vista === 'mapa';
    document.body.classList.toggle('ver-mapa', mapa);
    btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (mapa && mapaLista) setTimeout(() => { mapaLista.invalidateSize(); encuadrar(ultimaLista); }, 60);
    irA('propiedades');
  }));
}

const modal = document.getElementById('ficha');
const fichaContenido = document.getElementById('fichaContenido');
let fichaActual = null;
let fotoIdx = 0;
let ultimoFoco = null;
let mapaFicha = null;

function tipoSchema(p) { return p.tipo === 'Casa' ? 'House' : p.tipo === 'PH' ? 'Residence' : 'Apartment'; }

function inyectarSchema(p) {
  document.getElementById('ld-propiedad')?.remove();
  if (!p) return;
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ld-propiedad';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': tipoSchema(p), name: p.titulo, description: p.descripcion.join(' '),
    numberOfRooms: p.ambientes, floorSize: { '@type': 'QuantitativeValue', value: p.superficieCubierta, unitCode: 'MTK' },
    address: { '@type': 'PostalAddress', addressLocality: p.barrio, addressRegion: p.zona === 'CABA' ? 'Ciudad Autónoma de Buenos Aires' : 'Buenos Aires', addressCountry: 'AR' },
    image: p.fotos.map(f => `https://gokywebs.com/demo/ezequiel/images/${f}.webp`),
    offers: { '@type': 'Offer', price: p.precio, priceCurrency: 'USD', businessFunction: 'http://purl.org/goodrelations/v1#Sell' }
  });
  document.head.appendChild(s);
}

function similares(p) {
  return PROPIEDADES.filter(x => x.id !== p.id && (x.tipo === p.tipo || x.zona === p.zona))
    .sort((a, b) => Math.abs(a.precio - p.precio) - Math.abs(b.precio - p.precio)).slice(0, 3);
}

function fichaHTML(p) {
  const tecnica = [
    ['Tipo', p.tipo], ['Ambientes', p.ambientes === 1 ? 'Monoambiente' : p.ambientes],
    ['Dormitorios', p.dormitorios || '—'], ['Baños', p.banos], ['Cocheras', p.cocheras || 'Sin cochera'],
    ['Sup. total', `${p.superficieTotal.toLocaleString('es-AR')} m²`], ['Sup. cubierta', `${p.superficieCubierta} m²`], ['Antigüedad', p.antiguedad],
    ['Orientación', p.orientacion]
  ];
  const fav = favs.has(p.id);
  const exp = expensasTxt(p, true);
  return `<div class="galeria">
  <div class="galeria__principal">
    <img id="fotoPrincipal" src="images/${p.fotos[0]}.webp" width="1600" height="1067" alt="${esc(p.alts[0])}">
    ${p.fotos.length > 1 ? `<button type="button" class="galeria__nav galeria__nav--prev" data-foto-mov="-1" aria-label="Foto anterior">${ico('i-chev-l')}</button><button type="button" class="galeria__nav galeria__nav--next" data-foto-mov="1" aria-label="Foto siguiente">${ico('i-chev-r')}</button>` : ''}
    <span class="galeria__cont" data-foto-cont>1 / ${p.fotos.length}</span>
  </div>
  <div class="galeria__thumbs">${p.fotos.map((f, i) => `<button type="button" data-foto-i="${i}" aria-label="Ver foto ${i + 1} de ${p.fotos.length}" aria-current="${i === 0}"><img src="images/${f}-800.webp" width="92" height="69" alt=""></button>`).join('')}</div>
</div>
<div class="ficha">
  <div class="ficha__main">
    <div class="ficha__cabeza">
      <div class="ficha__badges"><span class="badge">Venta</span>${p.estado === 'A estrenar' ? '<span class="badge badge--nuevo">A estrenar</span>' : ''}<span class="badge">${esc(p.tipo)}</span></div>
      <h2>${esc(p.titulo)}</h2>
      <p class="ficha__ubic">${ico('i-pin')}${esc(ubicacion(p))}</p>
    </div>
    <h3>Ficha técnica</h3>
    <dl class="tecnica">${tecnica.map(([t, v]) => `<div><dt>${t}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <h3>Descripción</h3>
    <div class="ficha__desc">${p.descripcion.map(d => `<p>${esc(d)}</p>`).join('')}</div>
    <h3>Características</h3>
    <ul class="caracteristicas">${p.caracteristicas.map(c => `<li>${ico('i-check')}${esc(c)}</li>`).join('')}</ul>
    <h3>Ubicación aproximada</h3>
    <div class="mapa-ficha" id="mapaFicha"></div>
    <p class="mapa-nota">El círculo marca la zona, no la dirección: la dirección exacta se comparte al coordinar la visita.</p>
  </div>
  <aside class="ficha__aside" aria-label="Consultar por esta propiedad">
    <div class="ficha__caja">
      <div><p class="ficha__precio">${fmtUSD(p.precio)}</p>${exp ? `<p class="ficha__expensas">${exp}</p>` : ''}</div>
      <a class="btn" href="${waLink(msgProp(p))}" target="_blank" rel="noopener">${ico('i-wsp', 'ico-wsp')}Consultar por esta propiedad</a>
      <a class="btn btn--claro" href="${waLink(msgVisita(p))}" target="_blank" rel="noopener">${ico('i-calendar')}Agendar una visita</a>
      <button type="button" class="ficha__fav" data-fav="${p.id}" aria-pressed="${fav}">${ico('i-heart')}<span data-fav-txt>${fav ? 'Guardada en favoritas' : 'Guardar en favoritas'}</span></button>
      <div class="asesor"><span class="asesor__mono" aria-hidden="true">E</span><div><strong>Ezequiel</strong><span>Venta de inmuebles · CABA y zona norte</span></div></div>
      <p class="ficha__aviso">Superficies y expensas a confirmar con la documentación de la propiedad. Propiedad y valores con fines demostrativos.</p>
    </div>
  </aside>
</div>
<div class="similares">
  <h3>También te puede interesar</h3>
  <div class="similares__lista">${similares(p).map(s => `<button type="button" class="mini" data-abrir="${s.id}"><span class="mini__foto"><img src="images/${s.fotos[0]}-800.webp" width="96" height="72" alt="" style="object-position:${s.foco}"></span><span><strong>${fmtUSD(s.precio)}</strong><span>${esc(s.titulo)} · ${esc(s.barrio)}</span></span></button>`).join('')}</div>
</div>`;
}

function setFoto(i) {
  if (!fichaActual) return;
  const total = fichaActual.fotos.length;
  fotoIdx = (i + total) % total;
  const img = document.getElementById('fotoPrincipal');
  if (!img) return;
  const f = fichaActual.fotos[fotoIdx];
  img.classList.add('cambiando');
  const nueva = new Image();
  nueva.onload = nueva.onerror = () => {
    img.src = `images/${f}.webp`;
    img.alt = fichaActual.alts[fotoIdx] || '';
    img.classList.remove('cambiando');
  };
  nueva.src = `images/${f}.webp`;
  const cont = modal.querySelector('[data-foto-cont]');
  if (cont) cont.textContent = `${fotoIdx + 1} / ${total}`;
  modal.querySelectorAll('[data-foto-i]').forEach(b => b.setAttribute('aria-current', String(+b.dataset.fotoI === fotoIdx)));
  modal.querySelector(`[data-foto-i="${fotoIdx}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function initMapaFicha(p) {
  mapaFicha?.remove();
  mapaFicha = null;
  const el = document.getElementById('mapaFicha');
  if (!el) return;
  if (typeof L === 'undefined') { el.innerHTML = `<p class="mapa-nota" style="padding:16px">${esc(ubicacion(p))}</p>`; return; }
  try {
    mapaFicha = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(p.coords, 14);
    capaTiles(mapaFicha);
    L.circle(p.coords, { radius: 450, color: '#2457A7', weight: 1, fillColor: '#2457A7', fillOpacity: 0.14 }).addTo(mapaFicha);
    setTimeout(() => { mapaFicha?.invalidateSize(); mapaFicha?.setView(p.coords, 14); }, 380);
  } catch (err) {
    mapaFicha = null;
  }
}

function abrirFicha(id) {
  const p = getProp(id);
  if (!p || !modal || !fichaContenido) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  fichaActual = p;
  fotoIdx = 0;
  fichaContenido.innerHTML = fichaHTML(p);
  const panel = modal.querySelector('.modal__panel');
  panel.setAttribute('aria-label', `Ficha: ${p.titulo}`);
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  try { history.replaceState(null, '', `?propiedad=${p.id}`); } catch { /* file:// */ }
  inyectarSchema(p);
  initMapaFicha(p);
}

function cerrarFicha() {
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  try { history.replaceState(null, '', location.pathname); } catch { /* file:// */ }
  inyectarSchema(null);
  setTimeout(() => {
    modal.hidden = true;
    mapaFicha?.remove();
    mapaFicha = null;
    fichaContenido.innerHTML = '';
    fichaActual = null;
  }, reduceMotion ? 0 : 320);
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initFicha() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { e.preventDefault(); abrirFicha(abrir.dataset.abrir); return; }
    if (e.target.closest('[data-cerrar-ficha]')) { cerrarFicha(); return; }
    const mov = e.target.closest('[data-foto-mov]');
    if (mov) { setFoto(fotoIdx + +mov.dataset.fotoMov); return; }
    const th = e.target.closest('[data-foto-i]');
    if (th) setFoto(+th.dataset.fotoI);
  });
  document.addEventListener('keydown', e => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { cerrarFicha(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) {
      e.preventDefault();
      setFoto(fotoIdx + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (e.key === 'Tab') {
      const panel = modal.querySelector('.modal__panel');
      const foc = [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
      if (!foc.length) return;
      const first = foc[0];
      const last = foc[foc.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const id = new URLSearchParams(location.search).get('propiedad');
  if (id && getProp(id)) abrirFicha(id);
}

function validar(form) {
  let ok = true;
  form.querySelectorAll('input, select, textarea').forEach(c => {
    const err = c.closest('.campo')?.querySelector('[data-error]');
    let msg = '';
    const v = c.value.trim();
    if (c.required && !v) msg = c.tagName === 'SELECT' ? 'Elegí una opción.' : 'Completá este dato.';
    else if (c.type === 'tel' && v && v.replace(/\D/g, '').length < 8) msg = 'Revisá el número: faltan dígitos.';
    else if (c.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Ese email no parece completo.';
    if (msg) { ok = false; c.setAttribute('aria-invalid', 'true'); } else c.removeAttribute('aria-invalid');
    if (err) err.textContent = msg;
  });
  if (!ok) form.querySelector('[aria-invalid="true"]')?.focus();
  return ok;
}

function enviarPorWhatsApp(form, texto) {
  const btn = form.querySelector('[type="submit"]');
  window.open(waLink(texto), '_blank', 'noopener');
  showToast('Te abrimos WhatsApp con la consulta lista para enviar.');
  if (btn) { btn.disabled = true; setTimeout(() => { btn.disabled = false; }, 800); }
  form.reset();
}

function initForms() {
  document.querySelectorAll('.form').forEach(f => f.addEventListener('input', e => {
    if (e.target.getAttribute('aria-invalid') === 'true') {
      e.target.removeAttribute('aria-invalid');
      const err = e.target.closest('.campo')?.querySelector('[data-error]');
      if (err) err.textContent = '';
    }
  }));
  const tas = document.getElementById('formTasacion');
  tas?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar(tas)) return;
    const d = new FormData(tas);
    enviarPorWhatsApp(tas, `Hola Ezequiel, quiero tasar mi propiedad.\nTipo: ${d.get('tipo')}\nZona: ${d.get('zona')}\nMi WhatsApp: ${d.get('telefono')}`);
  });
  const con = document.getElementById('formConsulta');
  con?.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar(con)) return;
    const d = new FormData(con);
    const p = getProp(d.get('propiedad'));
    const email = String(d.get('email') || '').trim();
    enviarPorWhatsApp(con, `Hola Ezequiel, soy ${d.get('nombre')}.${p ? ` Me interesa "${p.titulo}" en ${p.barrio} (ref: ${p.id}).` : ''}\n${d.get('mensaje')}\nTeléfono: ${d.get('telefono')}${email ? `\nEmail: ${email}` : ''}`);
  });
}

initModelBarScroll();
initWspFloat();
initNav();
poblarSelects();
initMapaListado();
initCatalogo();
initZonas();
initReveals();
initHeroMotion();
initFiltrosDrawer();
initVistaToggle();
initForms();
initFicha();
document.querySelectorAll('[data-fav-count]').forEach(c => { c.textContent = favs.size; });
guardarFavs();
