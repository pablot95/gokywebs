const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491123630188';
const FAV_KEY = 'rmdesarrollos_favoritos';
const POR_TANDA = 12;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const waLink = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
const num = n => Number(n).toLocaleString('es-AR');
const icono = id => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const clamp01 = v => Math.max(0, Math.min(1, v));

const TIPOS = { casa: 'Casa', lote: 'Lote', uf: 'Unidad funcional' };
const OPERACIONES = { venta: 'Venta', alquiler: 'Alquiler' };
const OPERACIONES_BUSCAR = { venta: 'Comprar', alquiler: 'Alquilar' };
const PRECIOS = {
  venta: [[50000, 'Hasta USD 50.000'], [100000, 'Hasta USD 100.000'], [150000, 'Hasta USD 150.000'], [200000, 'Hasta USD 200.000']],
  alquiler: [[600000, 'Hasta $ 600.000 por mes'], [700000, 'Hasta $ 700.000 por mes'], [800000, 'Hasta $ 800.000 por mes'], [1000000, 'Hasta $ 1.000.000 por mes']],
};

const DESARROLLOS = [
  { id: 'd01', folio: 'D-01', titulo: 'Barrio en General Rodríguez', tipo: 'Urbanización', zona: 'General Rodríguez', estado: 'Lotes y casas a la venta', obra: false, descripcion: 'Lotes desde 450 m², casas y dúplex para estrenar en un barrio abierto de calles arboladas.', foto: 'images/lote-arbolado.webp', w: 1254, h: 1254, alt: 'Lote con césped sobre una calle arbolada del barrio' },
  { id: 'd02', folio: 'D-02', titulo: 'Edificio en Ituzaingó', tipo: 'Unidades funcionales', zona: 'Ituzaingó', estado: 'Unidades en venta y alquiler', obra: false, descripcion: 'Departamentos de 2 y 3 ambientes con balcón, para vivir o para alquilar.', foto: 'images/edificio-ituzaingo.webp', w: 1254, h: 1254, alt: 'Edificio de ladrillo y hormigón con balcones y plantas' },
  { id: 'd03', folio: 'D-03', titulo: 'Casas en Luján', tipo: 'Casas en construcción', zona: 'Luján', estado: 'En obra', obra: true, descripcion: 'Casas de 3 ambientes en construcción. Consultá por los planos y las unidades.', foto: 'images/obra-en-construccion.webp', w: 1254, h: 1254, alt: 'Casa en construcción con estructura de hormigón y ladrillos' },
];

const PROPIEDADES = [
  {
    id: 'p01', slug: 'casa-4-ambientes-general-rodriguez', tipo: 'casa', operacion: 'venta', precio: 168000, moneda: 'USD', expensas: 0,
    zona: 'General Rodríguez', desarrollo: 'd01', titulo: '4 ambientes con jardín',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 1, superficieTotal: 450, superficieCubierta: 160, nueva: false, destacada: true,
    descripcion: ['Casa en dos plantas dentro del barrio que desarrollamos en General Rodríguez, con frente de ladrillo y jardín adelante y atrás.', 'Abajo, living, comedor y cocina integrados con salida al jardín; arriba, tres dormitorios y dos baños.'],
    caracteristicas: ['Jardín al frente y al fondo', 'Cocina integrada', 'Doble altura en el acceso', 'Cochera descubierta', 'Calle arbolada'],
    etiquetas: ['dos plantas', 'jardin'],
    galeria: [{ src: 'images/casa-dos-plantas.webp', w: 900, h: 1600, alt: 'Frente de la casa de dos plantas con ladrillo y jardín' }],
  },
  {
    id: 'p07', slug: 'uf-3-ambientes-ituzaingo', tipo: 'uf', operacion: 'venta', precio: 118000, moneda: 'USD', expensas: 85000,
    zona: 'Ituzaingó', desarrollo: 'd02', titulo: '3 ambientes con balcón',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 1, superficieTotal: 78, superficieCubierta: 72, nueva: false, destacada: true,
    descripcion: ['Departamento de 3 ambientes en el edificio que construimos en Ituzaingó, con living comedor luminoso y balcón.', 'Dos dormitorios, cocina integrada y cochera en planta baja.'],
    caracteristicas: ['Balcón', 'Living comedor con ventanal', 'Cocina integrada', 'Cochera'],
    etiquetas: ['departamento', 'balcon'],
    galeria: [
      { src: 'images/depto-living.webp', w: 1254, h: 1254, alt: 'Living comedor con mesa de madera y ventanal al balcón' },
      { src: 'images/edificio-ituzaingo.webp', w: 1254, h: 1254, alt: 'Frente del edificio con balcones' },
    ],
  },
  {
    id: 'p05', slug: 'lote-450-m2-general-rodriguez', tipo: 'lote', operacion: 'venta', precio: 32000, moneda: 'USD', expensas: 0,
    zona: 'General Rodríguez', desarrollo: 'd01', titulo: '450 m² en calle arbolada',
    ambientes: 0, dormitorios: 0, banos: 0, cocheras: 0, superficieTotal: 450, superficieCubierta: 0, frente: 15, fondo: 30, nueva: false, destacada: true,
    descripcion: ['Lote de 15 × 30 m en el barrio que desarrollamos en General Rodríguez, sobre una calle con árboles y casas ya construidas.', 'Terreno plano y con césped, para empezar tu proyecto.'],
    caracteristicas: ['15 × 30 m', 'Terreno plano', 'Calle arbolada', 'Barrio con casas habitadas'],
    etiquetas: ['terreno'],
    galeria: [{ src: 'images/lote-arbolado.webp', w: 1254, h: 1254, alt: 'Lote con césped sobre una calle arbolada' }],
  },
  {
    id: 'p02', slug: 'casa-con-pileta-pilar', tipo: 'casa', operacion: 'venta', precio: 245000, moneda: 'USD', expensas: 0,
    zona: 'Pilar', desarrollo: '', titulo: '5 ambientes con pileta y galería',
    ambientes: 5, dormitorios: 4, banos: 3, cocheras: 2, superficieTotal: 900, superficieCubierta: 220, nueva: false, destacada: true,
    descripcion: ['Casa amplia en Pilar con galería cubierta, parrilla y pileta en un jardín de 900 m².', 'El living se abre por completo a la galería, para usar la casa todo el año.'],
    caracteristicas: ['Pileta', 'Galería con parrilla', 'Living integrado a la galería', 'Jardín parquizado', 'Cochera para dos autos'],
    etiquetas: ['parrilla', 'quincho', 'jardin'],
    galeria: [
      { src: 'images/casa-pileta.webp', w: 1254, h: 1254, alt: 'Contrafrente de la casa con galería, jardín y pileta' },
      { src: 'images/casa-pileta-galeria.webp', w: 834, h: 625, alt: 'Galería con mesa de comedor y parrilla' },
      { src: 'images/casa-pileta-living.webp', w: 800, h: 600, alt: 'Living abierto a la galería con sillones' },
    ],
  },
  {
    id: 'p08', slug: 'uf-2-ambientes-ituzaingo-alquiler', tipo: 'uf', operacion: 'alquiler', precio: 620000, moneda: 'ARS', expensas: 70000,
    zona: 'Ituzaingó', desarrollo: 'd02', titulo: '2 ambientes con balcón al frente',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, superficieTotal: 52, superficieCubierta: 48, nueva: false, destacada: false,
    descripcion: ['Unidad de 2 ambientes en el edificio de Ituzaingó, con balcón al frente y buena entrada de luz.', 'Dormitorio con placard y cocina separada del living.'],
    caracteristicas: ['Balcón al frente', 'Placard', 'Luminoso'],
    etiquetas: ['departamento', 'balcon'],
    galeria: [{ src: 'images/edificio-ituzaingo.webp', w: 1254, h: 1254, alt: 'Edificio con balcones en Ituzaingó' }],
  },
  {
    id: 'p04', slug: 'duplex-a-estrenar-general-rodriguez', tipo: 'casa', operacion: 'venta', precio: 139000, moneda: 'USD', expensas: 0,
    zona: 'General Rodríguez', desarrollo: 'd01', titulo: 'Dúplex a estrenar con cochera',
    ambientes: 4, dormitorios: 3, banos: 2, cocheras: 1, superficieTotal: 250, superficieCubierta: 130, nueva: true, destacada: false,
    descripcion: ['Dúplex nuevo en el barrio de General Rodríguez, con cochera propia y terreno para armar el jardín a tu gusto.', 'Planta baja con living comedor y cocina; arriba, tres dormitorios con buena luz.'],
    caracteristicas: ['A estrenar', 'Cochera con portón', 'Ventanas de piso a techo', 'Terreno propio'],
    etiquetas: ['duplex', 'nuevo'],
    galeria: [{ src: 'images/duplex-a-estrenar.webp', w: 1400, h: 1050, alt: 'Dos dúplex blancos a estrenar con portones de cochera' }],
  },
  {
    id: 'p09', slug: 'uf-2-ambientes-a-estrenar-ituzaingo', tipo: 'uf', operacion: 'venta', precio: 84000, moneda: 'USD', expensas: 70000,
    zona: 'Ituzaingó', desarrollo: 'd02', titulo: '2 ambientes a estrenar',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, superficieTotal: 55, superficieCubierta: 50, nueva: true, destacada: false,
    descripcion: ['Unidad nueva, sin uso, con piso de madera clara y salida a un balcón con vista abierta.', 'Para vivir o como inversión para alquilar.'],
    caracteristicas: ['A estrenar', 'Piso de madera', 'Balcón con vista abierta'],
    etiquetas: ['departamento', 'inversion', 'nuevo'],
    galeria: [{ src: 'images/uf-a-estrenar.webp', w: 1600, h: 1068, alt: 'Ambiente vacío con piso de madera y puerta balcón' }],
  },
  {
    id: 'p03', slug: 'casa-3-ambientes-moreno-alquiler', tipo: 'casa', operacion: 'alquiler', precio: 950000, moneda: 'ARS', expensas: 0,
    zona: 'Moreno', desarrollo: '', titulo: '3 ambientes en una planta',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 1, superficieTotal: 300, superficieCubierta: 95, nueva: false, destacada: false,
    descripcion: ['Casa de ladrillo en una sola planta, con cochera cubierta y jardín al frente.', 'Living con ventanal, cocina comedor y dos dormitorios: práctica y fácil de mantener.'],
    caracteristicas: ['Una planta', 'Cochera cubierta', 'Jardín al frente', 'Ventanal al living'],
    etiquetas: ['ladrillo'],
    galeria: [{ src: 'images/casa-ladrillo.webp', w: 1254, h: 1254, alt: 'Casa de ladrillo en una planta con cochera cubierta' }],
  },
  {
    id: 'p06', slug: 'fraccion-1-hectarea-lujan', tipo: 'lote', operacion: 'venta', precio: 48000, moneda: 'USD', expensas: 0,
    zona: 'Luján', desarrollo: '', titulo: 'Fracción de 1 hectárea',
    ambientes: 0, dormitorios: 0, banos: 0, cocheras: 0, superficieTotal: 10000, superficieCubierta: 0, frente: 100, fondo: 100, nueva: false, destacada: false,
    descripcion: ['Fracción de campo de una hectárea en las afueras de Luján, para una casa de fin de semana o un proyecto propio.', 'Terreno abierto, con buena luz y vista despejada.'],
    caracteristicas: ['1 hectárea', 'Terreno abierto', 'Vista despejada'],
    etiquetas: ['campo', 'quinta', 'terreno'],
    galeria: [{ src: 'images/fraccion-campo.webp', w: 1600, h: 1067, alt: 'Campo verde abierto con cielo despejado' }],
  },
  {
    id: 'p10', slug: 'uf-3-ambientes-ultimo-piso-moreno', tipo: 'uf', operacion: 'alquiler', precio: 700000, moneda: 'ARS', expensas: 0,
    zona: 'Moreno', desarrollo: '', titulo: '3 ambientes en último piso',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 0, superficieTotal: 85, superficieCubierta: 80, nueva: false, destacada: false,
    descripcion: ['Unidad en último piso con techos inclinados, ventanas en el techo y una pared de ladrillo a la vista.', 'Ambientes amplios y luminosos, con baño completo.'],
    caracteristicas: ['Último piso', 'Ventanas en el techo', 'Pared de ladrillo visto', 'Ambientes amplios'],
    etiquetas: ['departamento', 'loft'],
    galeria: [{ src: 'images/loft-ladrillo.webp', w: 1600, h: 1068, alt: 'Ambiente amplio con techo inclinado y columna de ladrillo' }],
  },
  {
    id: 'p11', slug: 'uf-2-ambientes-moreno-alquiler', tipo: 'uf', operacion: 'alquiler', precio: 560000, moneda: 'ARS', expensas: 45000,
    zona: 'Moreno', desarrollo: '', titulo: '2 ambientes con cocina integrada',
    ambientes: 2, dormitorios: 1, banos: 1, cocheras: 0, superficieTotal: 48, superficieCubierta: 45, nueva: false, destacada: false,
    descripcion: ['Departamento de 2 ambientes con cocina integrada al comedor, horno y anafe empotrados.', 'Dormitorio separado y buena luz durante el día.'],
    caracteristicas: ['Cocina integrada', 'Horno empotrado', 'Aire acondicionado'],
    etiquetas: ['departamento'],
    galeria: [{ src: 'images/depto-cocina.webp', w: 1600, h: 1068, alt: 'Cocina integrada al comedor con barra y banquetas' }],
  },
  {
    id: 'p12', slug: 'uf-3-ambientes-lujan-alquiler', tipo: 'uf', operacion: 'alquiler', precio: 780000, moneda: 'ARS', expensas: 50000,
    zona: 'Luján', desarrollo: '', titulo: '3 ambientes con hogar',
    ambientes: 3, dormitorios: 2, banos: 1, cocheras: 0, superficieTotal: 70, superficieCubierta: 66, nueva: false, destacada: false,
    descripcion: ['Departamento de 3 ambientes en Luján, con un hogar colgante en el living.', 'Dos dormitorios y living amplio con buena luz.'],
    caracteristicas: ['Hogar colgante', 'Living amplio', 'Placard en dormitorios'],
    etiquetas: ['departamento', 'estufa'],
    galeria: [{ src: 'images/depto-living-azul.webp', w: 1600, h: 1068, alt: 'Living con sillón azul, hogar colgante y piso de madera' }],
  },
];

const desarrolloDe = p => DESARROLLOS.find(d => d.id === p.desarrollo) || null;
const nombre = p => `${TIPOS[p.tipo]} · ${p.titulo}`;
const zonaTxt = p => { const d = desarrolloDe(p); return d ? `${p.zona} · ${d.folio}` : p.zona; };
const precioHTML = p => p.moneda === 'USD' ? `USD ${num(p.precio)}` : `$ ${num(p.precio)}${p.operacion === 'alquiler' ? ' <small>/ mes</small>' : ''}`;
const precioTxt = p => p.moneda === 'USD' ? `USD ${num(p.precio)}` : `$ ${num(p.precio)}${p.operacion === 'alquiler' ? ' por mes' : ''}`;

PROPIEDADES.forEach(p => {
  const d = desarrolloDe(p);
  p._texto = norm([nombre(p), OPERACIONES[p.operacion], OPERACIONES_BUSCAR[p.operacion], p.zona, d ? `${d.titulo} ${d.folio}` : '', p.descripcion.join(' '), p.caracteristicas.join(' '), p.etiquetas.join(' '), p.nueva ? 'a estrenar nuevo' : ''].join(' '));
});

const datosHTML = p => {
  const d = [];
  if (p.tipo === 'lote') {
    d.push(['area', `${num(p.superficieTotal)} m²`]);
    if (p.frente) d.push(['plot', `${num(p.frente)} × ${num(p.fondo)} m`]);
  } else {
    d.push(['bed', `${p.dormitorios} dorm.`]);
    d.push(['bath', `${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}`]);
    d.push(['area', `${num(p.superficieCubierta)} m² cub.`]);
    if (p.cocheras) d.push(['car', `${p.cocheras} coch.`]);
  }
  return d.map(([i, t]) => `<li>${icono(i)}${t}</li>`).join('');
};

const badgesHTML = p => `<span class="badge badge--${p.operacion}">${OPERACIONES[p.operacion]}</span>${p.nueva ? '<span class="badge badge--nueva">A estrenar</span>' : ''}`;

const getFavs = () => {
  try {
    const v = JSON.parse(localStorage.getItem(FAV_KEY));
    return Array.isArray(v) ? v.filter(id => PROPIEDADES.some(p => p.id === id)) : [];
  } catch { return []; }
};
const esFav = id => getFavs().includes(id);
function setFavs(ids) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch (e) { void e; }
  actualizarFavsHeader();
}

const cardHTML = p => {
  const fav = esFav(p.id);
  const f = p.galeria[0];
  return `<article class="prop-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button type="button" class="prop-card__fav" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(nombre(p))}">${icono('heart')}</button>
    <a class="prop-card__link" href="?propiedad=${p.slug}" data-abrir="${p.slug}">
      <div class="prop-card__foto"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" decoding="async"><div class="badges">${badgesHTML(p)}</div></div>
      <div class="prop-card__body">
        <p class="prop-card__precio">${precioHTML(p)}</p>
        ${p.expensas ? `<p class="prop-card__exp">Expensas $ ${num(p.expensas)}</p>` : ''}
        <h3 class="prop-card__titulo">${esc(nombre(p))}</h3>
        <p class="prop-card__zona">${icono('pin')}${esc(zonaTxt(p))}</p>
        <ul class="datos">${datosHTML(p)}</ul>
      </div>
    </a>
  </article>`;
};

const estado = { q: '', operacion: '', tipo: '', zona: '', dorm: '', precio: '', desarrollo: '', favs: false, visibles: POR_TANDA };
const VACIO = { q: '', operacion: '', tipo: '', zona: '', dorm: '', precio: '', desarrollo: '', favs: false };

function filtrar() {
  const terminos = norm(estado.q).split(/\s+/).filter(Boolean);
  const favs = getFavs();
  return PROPIEDADES.filter(p => {
    if (estado.favs && !favs.includes(p.id)) return false;
    if (estado.operacion && p.operacion !== estado.operacion) return false;
    if (estado.tipo && p.tipo !== estado.tipo) return false;
    if (estado.zona && p.zona !== estado.zona) return false;
    if (estado.dorm && (p.dormitorios || 0) < Number(estado.dorm)) return false;
    if (estado.precio && estado.operacion && p.precio > Number(estado.precio)) return false;
    if (estado.desarrollo && p.desarrollo !== estado.desarrollo) return false;
    if (terminos.length && !terminos.every(t => p._texto.includes(t))) return false;
    return true;
  });
}

function precioOpciones(sel, op, val) {
  if (!sel) return;
  if (!op || !PRECIOS[op]) {
    sel.innerHTML = '<option value="">Elegí la operación</option>';
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  sel.innerHTML = '<option value="">Sin tope</option>' + PRECIOS[op].map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  sel.value = PRECIOS[op].some(([v]) => String(v) === String(val)) ? String(val) : '';
}

function llenarSelects() {
  const ops = [...new Set(PROPIEDADES.map(p => p.operacion))];
  const tipos = Object.keys(TIPOS).filter(t => PROPIEDADES.some(p => p.tipo === t));
  const zonas = [...new Set(PROPIEDADES.map(p => p.zona))].sort((a, b) => a.localeCompare(b, 'es'));
  const opciones = (lista, etiqueta) => lista.map(v => `<option value="${esc(v)}">${esc(etiqueta(v))}</option>`).join('');
  document.querySelectorAll('select[name="operacion"]').forEach(s => s.insertAdjacentHTML('beforeend', opciones(ops, v => OPERACIONES_BUSCAR[v])));
  document.querySelectorAll('select[name="tipo"]').forEach(s => s.insertAdjacentHTML('beforeend', opciones(tipos, v => TIPOS[v])));
  document.querySelectorAll('select[name="zona"]').forEach(s => s.insertAdjacentHTML('beforeend', opciones(zonas, v => v)));
}

function sincronizarForm() {
  const f = document.getElementById('filtrosForm');
  if (!f) return;
  f.q.value = estado.q;
  f.operacion.value = estado.operacion;
  f.tipo.value = estado.tipo;
  f.zona.value = estado.zona;
  f.dorm.value = estado.dorm;
  precioOpciones(f.precio, estado.operacion, estado.precio);
}

function chipsHTML() {
  const chips = [];
  if (estado.desarrollo) {
    const d = DESARROLLOS.find(x => x.id === estado.desarrollo);
    if (d) chips.push(['desarrollo', `${d.folio} · ${d.titulo}`]);
  }
  if (estado.favs) chips.push(['favs', 'Solo favoritas']);
  return chips.map(([k, t]) => `<span class="chip">${esc(t)}<button type="button" data-quitar="${k}" aria-label="Quitar filtro: ${esc(t)}">${icono('x')}</button></span>`).join('');
}

function render() {
  const grid = document.getElementById('propGrid');
  if (!grid) return;
  estado.visibles = POR_TANDA;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, estado.visibles).map(cardHTML).join('');
  const n = lista.length;
  const conteo = document.getElementById('conteo');
  if (conteo) conteo.textContent = `${n} ${n === 1 ? 'propiedad' : 'propiedades'}`;
  const vacio = document.getElementById('vacio');
  if (vacio) {
    vacio.hidden = n > 0;
    const soloFavs = estado.favs && !getFavs().length;
    document.getElementById('vacioTitulo').textContent = soloFavs ? 'Todavía no guardaste propiedades.' : 'No encontramos propiedades con esos filtros.';
    document.getElementById('vacioTxt').textContent = soloFavs ? 'Tocá el corazón de las que te interesen y las vas a encontrar acá.' : 'Probá quitar alguno, o escribinos y te avisamos cuando aparezca una.';
    document.getElementById('vacioBtn').textContent = soloFavs ? 'Ver todas las propiedades' : 'Limpiar filtros';
  }
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = n <= estado.visibles;
  const chips = document.getElementById('chips');
  if (chips) chips.innerHTML = chipsHTML();
  const activos = ['q', 'operacion', 'tipo', 'zona', 'dorm', 'precio', 'desarrollo'].filter(k => estado[k]).length + (estado.favs ? 1 : 0);
  const filtrosN = document.getElementById('filtrosN');
  if (filtrosN) { filtrosN.hidden = !activos; filtrosN.textContent = activos; }
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = !activos;
  const verRes = document.getElementById('verResultados');
  if (verRes) verRes.textContent = n ? `Ver ${n} ${n === 1 ? 'propiedad' : 'propiedades'}` : 'Sin resultados';
  revelarNuevos(grid);
}

function verMasPropiedades() {
  const grid = document.getElementById('propGrid');
  const lista = filtrar();
  const desde = estado.visibles;
  estado.visibles += POR_TANDA;
  grid.insertAdjacentHTML('beforeend', lista.slice(desde, estado.visibles).map(cardHTML).join(''));
  document.getElementById('verMas').hidden = lista.length <= estado.visibles;
  revelarNuevos(grid);
}

function irACatalogo(cambios = {}) {
  Object.assign(estado, VACIO, cambios);
  sincronizarForm();
  render();
  document.getElementById('propiedades')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function actualizarFavsHeader() {
  const n = getFavs().length;
  const btn = document.getElementById('favsBtn');
  const cont = document.getElementById('favsN');
  if (cont) cont.textContent = n;
  if (btn) {
    btn.classList.toggle('tiene', n > 0);
    btn.setAttribute('aria-label', `Ver propiedades favoritas (${n})`);
  }
}

function toggleFav(id) {
  const p = PROPIEDADES.find(x => x.id === id);
  if (!p) return;
  const favs = getFavs();
  const ahora = !favs.includes(id);
  setFavs(ahora ? [...favs, id] : favs.filter(x => x !== id));
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
    b.setAttribute('aria-pressed', String(ahora));
    b.setAttribute('aria-label', `${ahora ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${nombre(p)}`);
    b.classList.remove('pop');
    void b.offsetWidth;
    if (!reduceMotion) b.classList.add('pop');
  });
  showToast(ahora ? 'Guardada en favoritas.' : 'La sacamos de favoritas.');
  if (estado.favs) render();
}

function initFiltros() {
  const form = document.getElementById('filtrosForm');
  const aside = document.getElementById('filtros');
  const abrir = document.getElementById('abrirFiltros');
  if (!form || !aside) return;
  let t = 0;
  const leer = () => {
    estado.q = form.q.value;
    estado.tipo = form.tipo.value;
    estado.zona = form.zona.value;
    estado.dorm = form.dorm.value;
    estado.precio = form.precio.value;
    render();
  };
  form.addEventListener('submit', e => e.preventDefault());
  form.q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(leer, 200); });
  form.operacion.addEventListener('change', () => {
    estado.operacion = form.operacion.value;
    precioOpciones(form.precio, estado.operacion, '');
    leer();
  });
  ['tipo', 'zona', 'dorm', 'precio'].forEach(n => form[n].addEventListener('change', leer));
  const limpiar = () => { Object.assign(estado, VACIO); sincronizarForm(); render(); };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.getElementById('vacioBtn')?.addEventListener('click', limpiar);
  document.getElementById('verMas')?.addEventListener('click', verMasPropiedades);

  let fondo = document.querySelector('.filtros-fondo');
  if (!fondo) { fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; document.body.appendChild(fondo); }
  const cerrar = (devolver = true) => {
    if (!aside.classList.contains('open')) return;
    aside.classList.remove('open');
    fondo.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrir?.setAttribute('aria-expanded', 'false');
    if (devolver) abrir?.focus({ preventScroll: true });
  };
  abrir?.addEventListener('click', () => {
    aside.classList.add('open');
    fondo.classList.add('open');
    document.body.classList.add('no-scroll');
    abrir.setAttribute('aria-expanded', 'true');
    setTimeout(() => form.q.focus({ preventScroll: true }), 60);
  });
  document.getElementById('cerrarFiltros')?.addEventListener('click', () => cerrar());
  fondo.addEventListener('click', () => cerrar());
  document.getElementById('verResultados')?.addEventListener('click', () => {
    cerrar(false);
    document.getElementById('propGrid')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && aside.classList.contains('open')) cerrar(); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) cerrar(false); });
}

function initBuscador() {
  const form = document.getElementById('buscador');
  if (!form) return;
  form.operacion.addEventListener('change', () => precioOpciones(form.precio, form.operacion.value, ''));
  form.addEventListener('submit', e => {
    e.preventDefault();
    irACatalogo({ operacion: form.operacion.value, tipo: form.tipo.value, zona: form.zona.value, precio: form.precio.disabled ? '' : form.precio.value });
  });
}

function initClicks() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { e.preventDefault(); abrirFicha(abrir.dataset.abrir, abrir); return; }
    const tipo = e.target.closest('[data-filtro-tipo]');
    if (tipo) { e.preventDefault(); irACatalogo({ tipo: tipo.dataset.filtroTipo }); return; }
    const des = e.target.closest('[data-desarrollo]');
    if (des) { e.preventDefault(); irACatalogo({ desarrollo: des.dataset.desarrollo }); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      if (quitar.dataset.quitar === 'desarrollo') estado.desarrollo = '';
      if (quitar.dataset.quitar === 'favs') estado.favs = false;
      render();
      return;
    }
    const motivo = e.target.closest('[data-motivo]');
    if (motivo) { e.preventDefault(); irAConsulta(motivo.dataset.motivo); return; }
    const cap = e.target.closest('[data-ir-cap]');
    if (cap && irACapitulo) { e.preventDefault(); irACapitulo(Number(cap.dataset.irCap)); }
  });
  document.getElementById('favsBtn')?.addEventListener('click', () => irACatalogo({ favs: true }));
}

function irAConsulta(motivo) {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  if (motivo && form.motivo.querySelector(`option[value="${motivo}"]`)) form.motivo.value = motivo;
  document.getElementById('contacto')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => form.nombre.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
}

let ultimoFoco = null;
let fichaActual = null;
let fotoIdx = 0;
let cierreTimer = 0;

const fichaTecnica = p => {
  const filas = [['Operación', OPERACIONES[p.operacion]], ['Tipo', TIPOS[p.tipo]]];
  if (p.tipo === 'lote') {
    filas.push(['Superficie', `${num(p.superficieTotal)} m²`]);
    if (p.frente) filas.push(['Medidas', `${num(p.frente)} × ${num(p.fondo)} m`]);
  } else {
    filas.push(['Ambientes', p.ambientes], ['Dormitorios', p.dormitorios], ['Baños', p.banos], ['Cocheras', p.cocheras || 'Sin cochera'], ['Sup. cubierta', `${num(p.superficieCubierta)} m²`], ['Sup. total', `${num(p.superficieTotal)} m²`]);
  }
  if (p.expensas) filas.push(['Expensas', `$ ${num(p.expensas)}`]);
  if (p.nueva) filas.push(['Estado', 'A estrenar']);
  const d = desarrolloDe(p);
  if (d) filas.push(['Desarrollo', d.folio]);
  return filas.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
};

const similaresDe = p => {
  const otros = PROPIEDADES.filter(x => x.id !== p.id);
  const puntos = x => (x.tipo === p.tipo ? 2 : 0) + (x.zona === p.zona ? 1 : 0) + (x.operacion === p.operacion ? 1 : 0);
  return otros.map(x => [x, puntos(x)]).filter(([, s]) => s >= 2).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([x]) => x);
};

function fichaHTML(p) {
  const fotos = p.galeria;
  const d = desarrolloDe(p);
  const fav = esFav(p.id);
  const msg = `Hola RM Desarrollos, me interesa: ${nombre(p)} (${OPERACIONES[p.operacion].toLowerCase()} en ${p.zona}, ${precioTxt(p)}). ¿Me pasan más información?`;
  const varias = fotos.length > 1;
  const similares = similaresDe(p);
  return `<article class="ficha">
    <div class="ficha__media">
      <div class="galeria__principal">
        <img id="galImg" src="${fotos[0].src}" width="${fotos[0].w}" height="${fotos[0].h}" alt="${esc(fotos[0].alt)}">
        ${varias ? `<button type="button" class="galeria__nav galeria__nav--prev" data-gal="-1" aria-label="Foto anterior">${icono('prev')}</button>
        <button type="button" class="galeria__nav galeria__nav--next" data-gal="1" aria-label="Foto siguiente">${icono('next')}</button>
        <span class="galeria__cuenta" id="galCuenta">1 / ${fotos.length}</span>` : ''}
      </div>
      ${varias ? `<div class="galeria__thumbs">${fotos.map((f, k) => `<button type="button" class="galeria__thumb" data-gal-ir="${k}" aria-label="Ver foto ${k + 1} de ${fotos.length}" aria-current="${k === 0}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="ficha__info">
      <div class="badges">${badgesHTML(p)}</div>
      <h2 class="ficha__titulo">${esc(nombre(p))}</h2>
      <p class="ficha__zona">${icono('pin')}${esc(p.zona)}${d ? ` · ${esc(d.titulo)}` : ''}</p>
      <p class="ficha__precio">${precioHTML(p)}</p>
      ${p.expensas ? `<p class="prop-card__exp">Expensas $ ${num(p.expensas)} por mes</p>` : ''}
      <ul class="datos">${datosHTML(p)}</ul>
      <div class="ficha__acciones">
        <a class="btn btn--cta" href="${waLink(msg)}" target="_blank" rel="noopener">${icono('wa')}Consultar por esta propiedad</a>
        <button type="button" class="ficha__fav" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritas' : 'Guardar en favoritas'}: ${esc(nombre(p))}">${icono('heart')}</button>
      </div>
      <div class="ficha__asesor"><span class="ficha__asesor-rm" aria-hidden="true">RM</span><p><b>Atención comercial de RM</b>Te respondemos por WhatsApp y coordinamos la visita.</p></div>
    </div>
    <div class="ficha__detalle">
      <div class="ficha__bloque ficha__desc">
        <h3>Descripción</h3>
        ${p.descripcion.map(t => `<p>${esc(t)}</p>`).join('')}
        <h3 class="ficha__sub">Características</h3>
        <ul class="ficha__carac">${p.caracteristicas.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      <div class="ficha__bloque">
        <h3>Ficha técnica</h3>
        <dl class="ficha__tecnica">${fichaTecnica(p)}</dl>
        <h3 class="ficha__sub">Ubicación aproximada</h3>
        <p class="ficha__ubic">${esc(p.zona)}, Gran Buenos Aires. La dirección exacta te la pasamos al coordinar la visita.</p>
      </div>
    </div>
    ${similares.length ? `<div class="ficha__similares ficha__bloque"><h3>También te puede interesar</h3><div class="similares">${similares.map(s => `<button type="button" class="similar" data-abrir="${s.slug}"><span class="similar__foto"><img src="${s.galeria[0].src}" width="${s.galeria[0].w}" height="${s.galeria[0].h}" alt=""></span><span><b>${precioTxt(s)}</b><span>${esc(nombre(s))}</span><span>${esc(s.zona)}</span></span></button>`).join('')}</div></div>` : ''}
  </article>`;
}

function cambiarFoto(i) {
  if (!fichaActual) return;
  const fotos = fichaActual.galeria;
  fotoIdx = (i + fotos.length) % fotos.length;
  const f = fotos[fotoIdx];
  const img = document.getElementById('galImg');
  if (img) { img.src = f.src; img.width = f.w; img.height = f.h; img.alt = f.alt; }
  const cuenta = document.getElementById('galCuenta');
  if (cuenta) cuenta.textContent = `${fotoIdx + 1} / ${fotos.length}`;
  document.querySelectorAll('.galeria__thumb').forEach((b, k) => b.setAttribute('aria-current', String(k === fotoIdx)));
}

function abrirFicha(slug, origen) {
  const p = PROPIEDADES.find(x => x.slug === slug);
  const modal = document.getElementById('modal');
  if (!p || !modal) return;
  clearTimeout(cierreTimer);
  if (modal.hidden || !modal.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  fichaActual = p;
  fotoIdx = 0;
  document.getElementById('modalCuerpo').innerHTML = fichaHTML(p);
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
  const panel = document.getElementById('modalPanel');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  try { window.history.replaceState(null, '', `${location.pathname}?propiedad=${p.slug}`); } catch (e) { void e; }
}

function cerrarFicha() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  cierreTimer = setTimeout(() => { modal.hidden = true; document.getElementById('modalCuerpo').innerHTML = ''; fichaActual = null; }, 320);
  try { window.history.replaceState(null, '', location.pathname); } catch (e) { void e; }
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrarFicha(); return; }
    const gal = e.target.closest('[data-gal]');
    if (gal) { cambiarFoto(fotoIdx + Number(gal.dataset.gal)); return; }
    const ir = e.target.closest('[data-gal-ir]');
    if (ir) cambiarFoto(Number(ir.dataset.galIr));
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { cerrarFicha(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && fichaActual?.galeria.length > 1) {
      cambiarFoto(fotoIdx + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (e.key === 'Tab') {
      const foco = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && (document.activeElement === primero || document.activeElement === document.getElementById('modalPanel'))) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

function abrirDesdeURL() {
  const slug = new URLSearchParams(location.search).get('propiedad');
  if (slug && PROPIEDADES.some(p => p.slug === slug)) abrirFicha(slug, null);
}

function initDesarrollos() {
  const lista = document.getElementById('desLista');
  const cards = document.getElementById('desCards');
  if (!lista && !cards) return;
  const datos = DESARROLLOS.map(d => ({ ...d, n: PROPIEDADES.filter(p => p.desarrollo === d.id).length }));
  const unidades = n => n ? `${n} ${n === 1 ? 'unidad publicada' : 'unidades publicadas'}` : 'Unidades a publicar';
  const estadoHTML = d => `<p class="estado${d.obra ? ' estado--obra' : ''}">${esc(d.estado)}</p>`;
  const accion = d => d.n
    ? `<button type="button" class="btn btn--linea btn--chico" data-desarrollo="${d.id}">Ver unidades ${icono('arrow')}</button>`
    : `<a class="btn btn--linea btn--chico" href="${waLink(`Hola RM Desarrollos, quiero consultar por ${d.titulo} (${d.estado.toLowerCase()}).`)}" target="_blank" rel="noopener">Consultar por la obra</a>`;
  if (lista) {
    lista.innerHTML = datos.map(d => `<li class="des-fila" data-animate="subir" style="opacity:0;transform:translateY(36px)">
      <span class="des-fila__folio">${d.folio}</span>
      <div class="des-fila__info"><h3>${esc(d.titulo)}</h3><p class="des-fila__zona">${esc(d.tipo)} · ${esc(d.zona)}</p><p class="des-fila__desc">${esc(d.descripcion)}</p></div>
      <div class="des-fila__lado">${estadoHTML(d)}<p class="des-unidades">${unidades(d.n)}</p>${accion(d)}</div>
    </li>`).join('');
  }
  if (cards) {
    cards.innerHTML = datos.map(d => `<article class="des-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
      <figure class="des-card__foto"><img src="${d.foto}" width="${d.w}" height="${d.h}" alt="${esc(d.alt)}"><span class="des-card__folio">${d.folio}</span><span class="tag-ilustrativa">Imagen ilustrativa</span></figure>
      <div class="des-card__body">${estadoHTML(d)}<h3>${esc(d.titulo)}</h3><p class="des-fila__zona">${esc(d.tipo)} · ${esc(d.zona)}</p><p class="des-fila__desc">${esc(d.descripcion)}</p>
        <div class="des-card__pie"><p class="des-unidades">${unidades(d.n)}</p>${accion(d)}</div>
      </div>
    </article>`).join('');
  }
}

function initContadores() {
  document.querySelectorAll('[data-cuenta-tipo]').forEach(el => {
    const n = PROPIEDADES.filter(p => p.tipo === el.dataset.cuentaTipo).length;
    el.textContent = `${n} ${n === 1 ? 'publicada' : 'publicadas'}`;
  });
  const nLotes = PROPIEDADES.filter(p => p.tipo === 'lote' && p.operacion === 'venta').length;
  const nVenta = PROPIEDADES.filter(p => p.operacion === 'venta').length;
  const nAlq = PROPIEDADES.filter(p => p.operacion === 'alquiler').length;
  const obra = DESARROLLOS.find(d => d.obra);
  const datos = {
    lotes: `${nLotes} ${nLotes === 1 ? 'lote' : 'lotes'} a la venta`,
    obra: obra ? `${obra.folio} · ${obra.titulo}: ${obra.estado.toLowerCase()}` : 'Casas en obra',
    operaciones: `${nVenta} en venta · ${nAlq} en alquiler`,
  };
  document.querySelectorAll('[data-dato]').forEach(el => { if (datos[el.dataset.dato]) el.textContent = datos[el.dataset.dato]; });
}

let irACapitulo = null;

function initRecorrido() {
  const pista = document.getElementById('recPista');
  if (!pista) return;
  const fotos = [...pista.querySelectorAll('.rec-foto')];
  const caps = [...pista.querySelectorAll('.rec-cap')];
  const marcas = [...pista.querySelectorAll('[data-ir]')];
  const capsBox = document.getElementById('recCaps');
  const numEl = document.getElementById('recNum');
  const N = Math.min(caps.length, 4);
  const header = document.querySelector('.site-header');
  const headerH = () => header ? header.offsetHeight : 0;
  let actual = -1;
  let frame = 0;

  const medir = () => {
    const alto = Math.max(...caps.map(c => c.offsetHeight));
    if (capsBox && alto > 0) capsBox.style.setProperty('--caps-h', `${Math.ceil(alto)}px`);
  };
  const activar = i => {
    if (i === actual) return;
    actual = i;
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    caps.forEach((c, k) => {
      c.classList.toggle('is-on', k === i);
      c.inert = k !== i;
      c.setAttribute('aria-hidden', String(k !== i));
    });
    marcas.forEach((m, k) => { if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current'); });
    if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
  };
  const total = () => Math.max(1, pista.offsetHeight - (window.innerHeight - headerH()));
  const update = () => {
    frame = 0;
    const p = clamp01((headerH() - pista.getBoundingClientRect().top) / total());
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    marcas.forEach((m, k) => m.querySelector('.rec-marcas__barra')?.style.setProperty('--fill', k < i ? '1' : k === i ? local.toFixed(3) : '0'));
    if (!reduceMotion) {
      const img = fotos[i]?.querySelector('img');
      if (img) img.style.transform = `scale(${(1.08 - local * 0.08).toFixed(4)})`;
    }
  };
  irACapitulo = i => {
    const top = pista.getBoundingClientRect().top + window.scrollY - headerH();
    window.scrollTo({ top: top + total() * ((i + 0.5) / N), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  marcas.forEach(m => m.addEventListener('click', () => irACapitulo(Number(m.dataset.ir))));
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { medir(); update(); }, { passive: true });
  window.addEventListener('load', () => { medir(); update(); });
  if (document.fonts?.ready) document.fonts.ready.then(medir);
  medir();
  update();
}

function initFormConsulta() {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  const marcar = (campo, mal) => {
    campo.setAttribute('aria-invalid', String(mal));
    const err = document.getElementById(`err-${campo.name}`);
    if (err) err.hidden = !mal;
  };
  form.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') marcar(i, false); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombreOk = form.nombre.value.trim().length >= 2;
    const telOk = form.telefono.value.replace(/\D/g, '').length >= 8;
    const mail = form.email.value.trim();
    const mailOk = !mail || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail);
    marcar(form.nombre, !nombreOk);
    marcar(form.telefono, !telOk);
    marcar(form.email, !mailOk);
    const primero = [[form.nombre, nombreOk], [form.telefono, telOk], [form.email, mailOk]].find(([, ok]) => !ok);
    if (primero) { primero[0].focus(); return; }
    const motivo = form.motivo.selectedOptions[0]?.textContent || '';
    const txt = [
      `Hola RM Desarrollos, soy ${form.nombre.value.trim()}.`,
      `Motivo: ${motivo}.`,
      form.mensaje.value.trim(),
      `Mi teléfono: ${form.telefono.value.trim()}${mail ? ` · Email: ${mail}` : ''}`,
    ].filter(Boolean).join('\n');
    window.open(waLink(txt), '_blank', 'noopener');
    const btn = form.querySelector('[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Abriendo WhatsApp…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = label;
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(i => marcar(i, false));
    }, 800);
    showToast('Te abrimos WhatsApp con tu consulta lista para enviar.');
  });
}

function initSchema() {
  const base = location.origin + location.pathname;
  const tipoSchema = { casa: 'SingleFamilyResidence', uf: 'Apartment', lote: 'Place' };
  const graph = PROPIEDADES.map(p => ({
    '@type': 'Offer',
    name: nombre(p),
    url: `${base}?propiedad=${p.slug}`,
    price: p.precio,
    priceCurrency: p.moneda,
    businessFunction: p.operacion === 'venta' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut',
    seller: { '@type': 'RealEstateAgent', name: 'RM Desarrollos Inmobiliarios S.A' },
    itemOffered: {
      '@type': tipoSchema[p.tipo],
      name: nombre(p),
      description: p.descripcion[0],
      address: { '@type': 'PostalAddress', addressLocality: p.zona, addressRegion: 'Buenos Aires', addressCountry: 'AR' },
      ...(p.tipo !== 'lote' ? { numberOfRooms: p.ambientes, floorSize: { '@type': 'QuantitativeValue', value: p.superficieCubierta, unitCode: 'MTK' } } : {}),
    },
  }));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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
    .from(hero.querySelectorAll('.cartel, .buscador'), { y: 20, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

llenarSelects();
setFavs(getFavs());
initDesarrollos();
initContadores();
render();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initReveals();
initNav();
initModelBarScroll();
initWspFloat();
initHeroMotion();
initRecorrido();
initFiltros();
initBuscador();
initClicks();
initModal();
initFormConsulta();
initSchema();
abrirDesdeURL();
