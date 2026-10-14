const WHATSAPP = '5493471514844';
const wa = lineas => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent([].concat(lineas).join('\n'))}`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LIMITE_CONSULTA = 100;
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const CATEGORIAS = [
  { id: 'plantas', nombre: 'Plantas', frase: 'De interior, suculentas y de exterior, con la ficha de cuidados de cada una.' },
  { id: 'macetas', nombre: 'Macetas', frase: 'Terracota tallada, cerámica esmaltada, plásticas y de turba para almácigos.' },
  { id: 'artesanales', nombre: 'Artesanales y regalería', frase: 'Madera tallada, cerámica, vidrio y flores secas para regalar o regalarte.' },
  { id: 'insumos', nombre: 'Insumos y tierra fértil', frase: 'Tierra, corteza, césped y herramientas para el jardín y las macetas.' },
  { id: 'iluminacion', nombre: 'Luces solares', frase: 'Estacas que se cargan con el sol durante el día y prenden solas al anochecer.' },
];
const SUBS = [
  { id: 'interior', cat: 'plantas', nombre: 'De interior', titulo: 'Plantas de interior' },
  { id: 'suculentas', cat: 'plantas', nombre: 'Suculentas', titulo: 'Suculentas' },
  { id: 'exterior', cat: 'plantas', nombre: 'De exterior', titulo: 'Plantas de exterior' },
];
const LUCES = [
  { id: 'sol', nombre: 'Sol directo' },
  { id: 'indirecta', nombre: 'Luz indirecta' },
  { id: 'poca', nombre: 'Poca luz' },
];
const ESPACIOS = [
  { id: 'interior-luz', nombre: 'Interior luminoso', frase: 'Plantas y macetas para cerca de una ventana.' },
  { id: 'poca-luz', nombre: 'Rincones con poca luz', frase: 'Plantas que aguantan pasillos y livings internos.' },
  { id: 'balcon', nombre: 'Balcón y patio', frase: 'Plantas de sol, macetas, tierra y herramientas.' },
  { id: 'jardin-noche', nombre: 'Jardín de noche', frase: 'Luces solares y faroles para el jardín.' },
  { id: 'regalo', nombre: 'Para regalar', frase: 'Artesanías, terrarios y plantas que sorprenden.' },
];
const PRECIOS = [
  { id: 'h15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15-30', nombre: '$15.000 a $30.000', min: 15000, max: 30000 },
  { id: 'm30', nombre: 'Más de $30.000', min: 30000, max: Infinity },
];
const CUIDADO = { facil: 'Fácil de cuidar', medio: 'Pide un poco de atención' };
const ESCENAS = {
  'interior-vertical': { src: 'interior-vertical-m', alt: 'el rincón de plantas de interior del vivero' },
  'vivero-portada': { src: 'vivero-portada-m', alt: 'la mesa del vivero' },
  'plantas-macetas': { src: 'plantas-macetas-m', alt: 'las macetas del vivero' },
  artesanales: { src: 'artesanales-m', alt: 'la mesa de regalería' },
  insumos: { src: 'insumos-m', alt: 'la mesa de insumos' },
  'luces-solares': { src: 'luces-solares-m', alt: 'el jardín de noche' },
};

const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;

function crearServidor(coleccion) {
  const datos = coleccion.map((p, i) => Object.freeze({ ...p, espacios: Object.freeze([...(p.espacios || [])]), tags: Object.freeze([...(p.tags || [])]), orden: i }));
  const porId = new Map(datos.map(p => [p.id, p]));
  const textos = new Map(datos.map(p => {
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    const sub = SUBS.find(s => s.id === p.sub);
    const luz = LUCES.find(l => l.id === p.luz);
    return [p.id, normalizar([p.nombre, p.botanico, cat?.nombre, sub?.titulo, luz?.nombre, p.desc, p.medida, ...p.tags].join(' '))];
  }));
  const ORDENES = {
    destacados: (a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a.orden - b.orden,
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.orden - b.orden,
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b) || a.orden - b.orden,
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a) || a.orden - b.orden,
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden - b.orden,
  };
  const indices = Object.fromEntries(Object.entries(ORDENES).map(([k, cmp]) => [k, Object.freeze([...datos].sort(cmp))]));

  const coincide = (p, f, saltear) => {
    if (p.visible === false) return false;
    if (f.ids && !f.ids.includes(p.id)) return false;
    if (f.excluir?.length && f.excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.destacado) return false;
    if (f.destacado === false && p.destacado) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (saltear !== 'cat' && f.cat?.length && !f.cat.includes(p.cat)) return false;
    if (saltear !== 'sub' && f.sub?.length && !f.sub.includes(p.sub)) return false;
    if (saltear !== 'luz' && f.luz?.length && !f.luz.includes(p.luz)) return false;
    if (saltear !== 'espacio' && f.espacio?.length && !f.espacio.some(e => p.espacios.includes(e))) return false;
    if (saltear !== 'precio' && f.precio?.length) {
      const v = precioFinal(p);
      if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
    }
    if (f.q) {
      const palabras = normalizar(f.q).split(/\s+/).filter(Boolean);
      const t = textos.get(p.id);
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  };
  const tope = n => Math.min(Math.max(1, Math.floor(Number(n)) || LIMITE_CONSULTA), LIMITE_CONSULTA);

  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_CONSULTA } = {}) {
    const clave = indices[orden] ? orden : 'destacados';
    const idx = indices[clave];
    let desde = 0;
    if (cursor) {
      const [o, id] = String(cursor).split('|');
      const pos = o === clave ? idx.findIndex(p => p.id === id) : -1;
      if (pos < 0) return Promise.resolve({ items: [], siguiente: null });
      desde = pos + 1;
    }
    const n = tope(limite);
    const items = [];
    let i = desde;
    for (; i < idx.length && items.length < n; i++) if (coincide(idx[i], filtros)) items.push(idx[i]);
    let siguiente = null;
    if (items.length === n) {
      for (let j = i; j < idx.length; j++) {
        if (coincide(idx[j], filtros)) { siguiente = `${clave}|${items[items.length - 1].id}`; break; }
      }
    }
    return Promise.resolve({ items, siguiente });
  }

  function contar(filtros = {}) {
    let n = 0;
    for (const p of datos) if (coincide(p, filtros)) n++;
    return Promise.resolve(n);
  }

  function facetas(campo, filtros = {}) {
    const n = {};
    for (const p of datos) {
      if (!coincide(p, filtros, campo)) continue;
      let valores = [];
      if (campo === 'espacio') valores = p.espacios;
      else if (campo === 'precio') { const v = precioFinal(p); valores = PRECIOS.filter(r => v >= r.min && v < r.max).map(r => r.id); }
      else if (p[campo]) valores = [p[campo]];
      valores.forEach(v => { n[v] = (n[v] || 0) + 1; });
    }
    return Promise.resolve(n);
  }

  function obtener(id) {
    const p = porId.get(id);
    return Promise.resolve(p && p.visible !== false ? p : null);
  }

  function obtenerVarios(ids) {
    const lista = [...new Set(ids)].slice(0, LIMITE_CONSULTA).map(id => porId.get(id)).filter(p => p && p.visible !== false);
    return Promise.resolve(lista);
  }

  return Object.freeze({ consultar, contar, facetas, obtener, obtenerVarios, ORDENES: Object.keys(ORDENES) });
}

const Servidor = crearServidor([
  { id: 'monstera', nombre: 'Monstera deliciosa', botanico: 'Monstera deliciosa', cat: 'plantas', sub: 'interior', precio: 32900, descuento: 0, stock: 8, destacado: true, img: 'p-monstera', escena: 'interior-vertical', luz: 'indirecta', riego: 'Una vez por semana', cuidado: 'facil', mascotas: false, medida: 'Maceta N°20 · 70 a 80 cm de alto', espacios: ['interior-luz'], desc: 'La planta de las hojas grandes y caladas. Crece rápido cerca de una ventana con luz filtrada y se riega cuando los primeros centímetros de tierra están secos.', tags: ['costilla de adan', 'hojas grandes', 'interior'] },
  { id: 'sansevieria', nombre: 'Sansevieria · lengua de suegra', botanico: 'Dracaena trifasciata', cat: 'plantas', sub: 'interior', precio: 24500, descuento: 0, stock: 10, destacado: true, img: 'p-sansevieria', escena: 'interior-vertical', luz: 'poca', riego: 'Cada 15 a 20 días', cuidado: 'facil', mascotas: false, medida: 'Maceta de terrazo N°16 con soporte de madera · 50 a 60 cm', espacios: ['poca-luz', 'interior-luz'], desc: 'Aguanta poca luz y olvidos de riego: ideal para empezar. Con el soporte de madera queda lista para el piso del living o un rincón del dormitorio.', tags: ['espada', 'resistente', 'interior', 'soporte'] },
  { id: 'echeveria', nombre: 'Suculenta Echeveria', botanico: 'Echeveria', cat: 'plantas', sub: 'suculentas', precio: 18900, descuento: 0, stock: 12, destacado: true, img: 'p-echeveria', escena: 'plantas-macetas', luz: 'sol', riego: 'Cada 10 a 15 días', cuidado: 'facil', mascotas: true, medida: 'Maceta esmaltada N°12', espacios: ['balcon', 'regalo'], desc: 'Una roseta de hojas carnosas en una maceta de cerámica esmaltada en verde y tierra. Necesita mucha luz y poca agua.', tags: ['suculenta', 'roseta', 'maceta esmaltada', 'regalo'] },
  { id: 'maceta-tallada', nombre: 'Maceta de terracota tallada N°20', cat: 'macetas', precio: 16900, descuento: 0, stock: 10, destacado: true, img: 'p-maceta-tallada', escena: 'plantas-macetas', medida: '20 cm de diámetro · con agujero de drenaje', espacios: ['interior-luz', 'balcon', 'regalo'], desc: 'Terracota con un dibujo en zigzag tallado a mano: cada una sale un poco distinta. El barro respira y ayuda a que la tierra no quede encharcada.', tags: ['maceta', 'barro', 'terracota', 'artesanal', 'tallada', 'ceramica'] },
  { id: 'herramientas', nombre: 'Kit de herramientas de jardín', cat: 'insumos', precio: 22900, descuento: 0, stock: 10, destacado: true, img: 'p-herramientas', escena: 'insumos', medida: 'Pala de trasplante, rastrillo y escarificador con mango de madera', espacios: ['balcon', 'regalo'], desc: 'Tres herramientas de mano con mango de madera para trasplantar, aflojar la tierra y limpiar canteros.', tags: ['herramientas', 'pala', 'rastrillo', 'jardin', 'kit'] },
  { id: 'estaca-solar', nombre: 'Estaca solar de vidrio tallado', cat: 'iluminacion', precio: 12900, descuento: 0, stock: 20, destacado: true, img: 'p-estaca-solar', escena: 'luces-solares', medida: '45 cm de alto · luz cálida', espacios: ['jardin-noche'], desc: 'Se clava en la tierra, se carga con el sol durante el día y prende sola al anochecer. El vidrio tallado reparte la luz en destellos.', tags: ['luz solar', 'estaca', 'farol', 'jardin', 'iluminacion', 'lampara'] },
  { id: 'gatos', nombre: 'Pareja de gatos tallados en madera', cat: 'artesanales', precio: 34900, descuento: 0, stock: 4, destacado: true, img: 'p-gatos', escena: 'artesanales', medida: 'Alto: 38 y 24 cm', espacios: ['regalo'], desc: 'Dos gatos de madera tallada a mano con flores pirograbadas. Para una repisa, una mesa de luz o un rincón con plantas.', tags: ['gatos', 'madera', 'tallado', 'artesanal', 'decoracion', 'regalo'] },
  { id: 'set-estacas', nombre: 'Set de 4 estacas solares', cat: 'iluminacion', precio: 44900, descuento: 10, stock: 8, destacado: true, img: 'p-set-estacas', escena: 'luces-solares', medida: '4 estacas de 45 cm · luz cálida', espacios: ['jardin-noche'], desc: 'Cuatro estacas para marcar un camino o el borde de un cantero. Sin cables ni enchufes: cada una tiene su panel solar.', tags: ['luz solar', 'estacas', 'camino', 'jardin', 'iluminacion', 'set'] },
  { id: 'potus-satinado', nombre: 'Potus satinado en maceta tallada', botanico: 'Scindapsus pictus', cat: 'plantas', sub: 'interior', precio: 27900, descuento: 0, stock: 6, nuevo: true, img: 'p-potus-satinado', escena: 'plantas-macetas', luz: 'indirecta', riego: 'Cada 7 a 10 días', cuidado: 'facil', mascotas: false, medida: 'Maceta de terracota tallada N°20', espacios: ['interior-luz', 'regalo'], desc: 'Hojas verde oscuro con manchas plateadas, en una maceta de terracota con dibujo tallado. Va bien en un escritorio o una mesa cerca de la ventana.', tags: ['potus plateado', 'satin', 'maceta tallada', 'terracota'] },
  { id: 'terrario', nombre: 'Terrario colgante con fitonia', botanico: 'Fittonia albivenis', cat: 'artesanales', precio: 23900, descuento: 0, stock: 6, nuevo: true, img: 'p-terrario', escena: 'artesanales', luz: 'indirecta', riego: 'Un rocío por semana', cuidado: 'facil', mascotas: true, medida: 'Esfera de vidrio de 15 cm con gancho', espacios: ['regalo', 'interior-luz'], desc: 'Una fitonia de hojas rosadas en una esfera de vidrio con piedras y sustrato. Se cuelga o se apoya sobre un tronco; con un rocío por semana alcanza.', tags: ['terrario', 'vidrio', 'fitonia', 'colgante', 'regalo', 'planta'] },
  { id: 'vinca', nombre: 'Vinca en maceta grabada', botanico: 'Catharanthus roseus', cat: 'plantas', sub: 'exterior', precio: 19900, descuento: 0, stock: 10, nuevo: true, img: 'p-vinca', escena: 'vivero-portada', luz: 'sol', riego: 'Cada 3 o 4 días en verano', cuidado: 'facil', mascotas: false, medida: 'Maceta de cemento grabada N°20', espacios: ['balcon', 'regalo'], desc: 'Flores rosas durante toda la temporada cálida, en una maceta de cemento con relieve. Para balcones y patios con varias horas de sol.', tags: ['flores', 'rosa', 'exterior', 'maceta de cemento'] },
  { id: 'estaca-acero', nombre: 'Estaca solar de acero inoxidable', cat: 'iluminacion', precio: 9900, descuento: 0, stock: 16, nuevo: true, img: 'p-estaca-acero', escena: 'vivero-portada', medida: '38 cm de alto · luz blanca', espacios: ['jardin-noche'], desc: 'Terminación acero con difusor transparente. Liviana y fácil de mover cuando cambiás el cantero de lugar.', tags: ['luz solar', 'estaca', 'acero', 'jardin', 'iluminacion', 'lampara'] },
  { id: 'potus', nombre: 'Potus colgante', botanico: 'Epipremnum aureum', cat: 'plantas', sub: 'interior', precio: 14900, descuento: 0, stock: 15, img: 'p-potus', escena: 'interior-vertical', luz: 'poca', riego: 'Una vez por semana', cuidado: 'facil', mascotas: false, medida: 'Maceta N°14 · guías de 60 cm', espacios: ['poca-luz', 'interior-luz'], desc: 'Sus guías caen desde un estante o una repisa y siguen creciendo con poca luz. Se riega cuando la tierra está seca al tacto.', tags: ['pothos', 'colgante', 'enredadera', 'interior'] },
  { id: 'aglaonema', nombre: 'Aglaonema en canasto de yute', botanico: 'Aglaonema', cat: 'plantas', sub: 'interior', precio: 26900, descuento: 0, stock: 5, img: 'p-aglaonema', escena: 'artesanales', luz: 'poca', riego: 'Una vez por semana', cuidado: 'facil', mascotas: false, medida: 'Maceta N°16 dentro de un canasto de yute', espacios: ['poca-luz', 'regalo'], desc: 'Hojas largas y veteadas que se mantienen lindas lejos de la ventana. Viene dentro de un canasto de yute, lista para regalar.', tags: ['canasto', 'yute', 'interior', 'sombra'] },
  { id: 'haworthia', nombre: 'Haworthia cebra', botanico: 'Haworthiopsis attenuata', cat: 'plantas', sub: 'suculentas', precio: 9900, descuento: 0, stock: 14, img: 'p-haworthia', escena: 'plantas-macetas', luz: 'indirecta', riego: 'Cada 15 días', cuidado: 'facil', mascotas: true, medida: 'Maceta de barro N°14 con piedras blancas', espacios: ['interior-luz', 'balcon'], desc: 'Hojas rayadas en blanco y verde, en maceta de barro con piedras. Le gusta la claridad sin el sol fuerte del mediodía.', tags: ['suculenta', 'cebra', 'barro'] },
  { id: 'rosario', nombre: 'Rosario colgante', botanico: 'Curio rowleyanus', cat: 'plantas', sub: 'suculentas', precio: 15900, descuento: 0, stock: 7, img: 'p-rosario', escena: 'plantas-macetas', luz: 'indirecta', riego: 'Cada 10 a 15 días', cuidado: 'medio', mascotas: false, medida: 'Maceta de cerámica N°16 · cae unos 40 cm', espacios: ['interior-luz'], desc: 'Las cuentitas verdes caen por el borde de la maceta. Necesita luz abundante y que la tierra se seque entre riegos.', tags: ['collar de perlas', 'suculenta colgante', 'senecio'] },
  { id: 'jade', nombre: 'Árbol de jade', botanico: 'Crassula ovata', cat: 'plantas', sub: 'suculentas', precio: 17900, descuento: 0, stock: 9, img: 'p-jade', escena: 'plantas-macetas', luz: 'sol', riego: 'Cada 15 días', cuidado: 'facil', mascotas: false, medida: 'Maceta N°16 · 30 cm de alto', espacios: ['balcon', 'interior-luz'], desc: 'Suculenta de tronco grueso y hojas redondas que con los años toma forma de arbolito. Al sol o en la ventana más luminosa.', tags: ['crassula', 'suculenta', 'arbol de la abundancia'] },
  { id: 'olivo', nombre: 'Olivo en maceta', botanico: 'Olea europaea', cat: 'plantas', sub: 'exterior', precio: 89900, descuento: 0, stock: 2, img: 'p-olivo', escena: 'luces-solares', luz: 'sol', riego: 'Una vez por semana; en verano, dos', cuidado: 'medio', mascotas: true, medida: 'Maceta de cemento N°40 · 1,20 m de alto', espacios: ['balcon'], desc: 'Un olivo joven para el patio o una terraza con sol pleno. Resiste el viento y el calor; en maceta grande crece despacio.', tags: ['arbol', 'exterior', 'patio', 'terraza'] },
  { id: 'maceta-esmaltada', nombre: 'Maceta esmaltada verde N°20', cat: 'macetas', precio: 21900, descuento: 0, stock: 6, img: 'p-maceta-esmaltada', escena: 'plantas-macetas', medida: '20 cm de diámetro · esmalte por dentro y por fuera', espacios: ['interior-luz', 'regalo'], desc: 'Cerámica esmaltada en verde profundo con brillo moteado. Para las plantas de interior que querés lucir en el living.', tags: ['maceta', 'ceramica', 'esmaltada', 'verde'] },
  { id: 'maceta-moteada', nombre: 'Maceta de cerámica moteada N°14', cat: 'macetas', precio: 12900, descuento: 0, stock: 12, img: 'p-maceta-moteada', escena: 'plantas-macetas', medida: '14 cm de diámetro', espacios: ['interior-luz', 'regalo'], desc: 'Cerámica blanca con pintitas marrones y la base de barro a la vista. Ideal para suculentas y plantas chicas.', tags: ['maceta', 'ceramica', 'blanca', 'moteada', 'suculentas'] },
  { id: 'macetas-plasticas', nombre: 'Macetas plásticas símil terracota N°30 · pack x3', cat: 'macetas', precio: 13900, descuento: 10, stock: 20, img: 'p-macetas-plasticas', escena: 'insumos', medida: '30 cm de diámetro · 3 unidades', espacios: ['balcon'], desc: 'Livianas y resistentes al sol, con el color del barro. Para trasplantar plantas de patio sin cargar peso.', tags: ['maceta', 'plastica', 'terracota', 'pack', 'exterior'] },
  { id: 'almacigo', nombre: 'Kit de almácigo: 12 macetas de turba', cat: 'macetas', precio: 7900, descuento: 0, stock: 25, img: 'p-almacigo', escena: 'insumos', medida: '12 macetas biodegradables y bandeja', espacios: ['balcon'], desc: 'Macetitas de turba para hacer plantines de semilla. Se plantan enteras en la tierra y se degradan solas, sin trasplantar.', tags: ['almacigo', 'turba', 'biodegradable', 'semillas', 'plantines', 'huerta'] },
  { id: 'loto', nombre: 'Portavela flor de loto de nácar', cat: 'artesanales', precio: 15900, descuento: 15, stock: 8, img: 'p-loto', escena: 'artesanales', medida: '14 cm de diámetro · para vela tipo té', espacios: ['regalo'], desc: 'Pétalos de nácar con borde dorado que se iluminan con la vela adentro. Se vende de a uno; quedan lindos de a dos o tres.', tags: ['portavela', 'loto', 'nacar', 'vela', 'deco', 'regalo'] },
  { id: 'flores-secas', nombre: 'Vasija de cerámica con flores secas', cat: 'artesanales', precio: 38900, descuento: 0, stock: 3, img: 'p-flores-secas', escena: 'artesanales', medida: 'Vasija de 30 cm · ramo de 60 cm', espacios: ['regalo', 'interior-luz'], desc: 'Vasija de cerámica con guardas grabadas y un ramo de flores secas en tonos lila, crema y amarillo. No necesita agua ni cuidados.', tags: ['flores secas', 'vasija', 'ceramica', 'ramo', 'deco', 'regalo'] },
  { id: 'cajitas', nombre: 'Cajitas de madera torneada · set x2', cat: 'artesanales', precio: 19900, descuento: 0, stock: 7, img: 'p-cajitas', escena: 'artesanales', medida: '12 y 9 cm de diámetro, con tapa', espacios: ['regalo'], desc: 'Dos cajas redondas de madera con tapa grabada. Para guardar anillos, semillas o lo que quieras tener a mano.', tags: ['caja', 'madera', 'alhajero', 'torneado', 'regalo'] },
  { id: 'portavela-calado', nombre: 'Farol de cerámica calada', cat: 'artesanales', precio: 24900, descuento: 0, stock: 5, img: 'p-portavela-calado', escena: 'vivero-portada', medida: '30 cm de alto · para vela o luz LED', espacios: ['regalo', 'jardin-noche'], desc: 'Cerámica calada a mano que proyecta dibujos en la pared cuando se enciende. Para la mesa del patio o el living.', tags: ['farol', 'portavela', 'ceramica', 'calado', 'deco', 'luz'] },
  { id: 'tierra', nombre: 'Tierra fértil · bolsa 50 dm³', cat: 'insumos', precio: 8900, descuento: 0, stock: 40, img: 'p-tierra', escena: 'insumos', medida: 'Bolsa de 50 dm³', espacios: ['balcon'], desc: 'Tierra negra con materia orgánica para trasplantes, canteros y macetas. Rinde para varias macetas medianas.', tags: ['tierra', 'sustrato', 'tierra negra', 'abono', 'trasplante'] },
  { id: 'corteza', nombre: 'Corteza de pino · bolsa 50 dm³', cat: 'insumos', precio: 11900, descuento: 0, stock: 18, img: 'p-corteza', escena: 'insumos', medida: 'Bolsa de 50 dm³', espacios: ['balcon'], desc: 'Para cubrir canteros y macetas: mantiene la humedad, frena los yuyos y queda prolija. También sirve para sustratos de orquídeas.', tags: ['corteza', 'pino', 'mulch', 'cobertura', 'orquideas'] },
  { id: 'cesped', nombre: 'Césped en bandeja para trasplante', cat: 'insumos', precio: 9900, descuento: 0, stock: 15, img: 'p-cesped', escena: 'insumos', medida: 'Bandeja de 30 × 50 cm', espacios: ['balcon'], desc: 'Césped ya crecido en bandeja para cubrir un sector chico o reparar calvas del jardín. Se planta sobre tierra húmeda y se riega todos los días la primera semana.', tags: ['cesped', 'pasto', 'panes', 'jardin', 'bandeja'] },
  { id: 'regadera', nombre: 'Regadera de metal 5 L', cat: 'insumos', precio: 27900, descuento: 0, stock: 4, img: 'p-regadera', escena: 'vivero-portada', medida: 'Capacidad: 5 litros', espacios: ['balcon', 'regalo'], desc: 'Regadera de metal con pico largo y flor de lluvia fina, para regar sin aplastar los plantines.', tags: ['regadera', 'riego', 'metal', 'jardin'] },
]);

const cacheProductos = new Map();
const guardarEnCache = lista => { lista.forEach(p => cacheProductos.set(p.id, p)); return lista; };
const Tienda = {
  async consultar(op) { const r = await Servidor.consultar(op); guardarEnCache(r.items); return r; },
  contar: f => Servidor.contar(f),
  facetas: (campo, f) => Servidor.facetas(campo, f),
  async obtener(id) {
    if (cacheProductos.has(id)) return cacheProductos.get(id);
    const p = await Servidor.obtener(id);
    if (p) cacheProductos.set(id, p);
    return p;
  },
  async obtenerVarios(ids) {
    const faltan = ids.filter(id => !cacheProductos.has(id));
    if (faltan.length) guardarEnCache(await Servidor.obtenerVarios(faltan));
    return ids.map(id => cacheProductos.get(id)).filter(Boolean);
  },
};

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => cacheProductos.get(id) || null;
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getSub = id => SUBS.find(s => s.id === id);
const getLuz = id => LUCES.find(l => l.id === id);

const Cart = {
  KEY: 'sharif_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'sharif_favoritos',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const lista = this.get();
    const i = lista.indexOf(id);
    if (i >= 0) lista.splice(i, 1); else lista.push(id);
    try { localStorage.setItem(this.KEY, JSON.stringify(lista)); } catch { /* sin almacenamiento */ }
    document.dispatchEvent(new CustomEvent('favs:updated', { detail: { id, activo: i < 0 } }));
    return i < 0;
  },
};

const ICO = {
  sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  indirecta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>',
  poca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  riego: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  hoja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',
  pata: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>',
  medida: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  tacho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  cruz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
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

let revealsListos = false;
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

const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const linkProducto = id => {
  const u = new URL(location.href);
  if (PAGINA !== 'catalogo') u.pathname = u.pathname.replace(/[^/]*$/, CATALOGO_URL);
  u.search = '';
  u.searchParams.set('producto', id);
  return u.pathname.split('/').pop() + u.search;
};

const etiquetaProducto = p => {
  if (p.luz) return `<span class="chip-luz chip-luz--${p.luz}">${ICO[p.luz]}${esc(getLuz(p.luz)?.nombre)}</span>`;
  return `<span class="chip-cat">${esc(getCategoria(p.cat)?.nombre)}</span>`;
};

const badgesHTML = p => {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--oferta">-${p.descuento}%</span>`);
  else if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
};

const precioHTML = (p, clase = 'precio') => p.descuento > 0
  ? `<p class="${clase}"><span class="${clase}__final ${clase}__final--oferta">${formatearPrecio(precioFinal(p))}</span> <s>${formatearPrecio(p.precio)}</s></p>`
  : `<p class="${clase}"><span class="${clase}__final">${formatearPrecio(p.precio)}</span></p>`;

const ANIM = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const ANIM_DER = 'data-animate="der" style="opacity:0;transform:translateX(64px)"';

function pcardHTML(p, { rail = false, animar = true } = {}) {
  const fav = Favs.has(p.id);
  const anim = animar ? (rail ? ANIM_DER : ANIM) : '';
  const tag = rail ? 'li' : 'article';
  return `<${tag} class="pcard${rail ? ' pcard--rail' : ''}" data-id="${esc(p.id)}" ${anim}>
    <div class="pcard__foto recorte">
      <a class="pcard__ver" href="${esc(linkProducto(p.id))}" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${BASE}images/${esc(p.img)}.webp" width="480" height="600" alt="${esc(p.nombre)}"></a>
      ${badgesHTML(p)}
      <button type="button" class="fav" data-fav="${esc(p.id)}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${esc(p.nombre)}">${ICO.corazon}</button>
    </div>
    <div class="pcard__info">
      ${etiquetaProducto(p)}
      <h3 class="pcard__nombre"><a href="${esc(linkProducto(p.id))}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      ${precioHTML(p)}
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button>
          <span class="stepper__n" data-cant aria-live="polite">1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar al carrito</span></button>
      </div>
      <button type="button" class="pcard__comprar" data-comprar="${esc(p.id)}">Comprar ahora</button>
    </div>
  </${tag}>`;
}

function fcardHTML(p, { rail = false, grande = false, animar = true } = {}) {
  const anim = animar ? (rail ? ANIM_DER : ANIM) : '';
  const tag = rail ? 'li' : 'article';
  return `<${tag} class="fcard${grande ? ' fcard--grande' : ''}${rail ? ' fcard--rail' : ''}" data-id="${esc(p.id)}" ${anim}>
    <a class="fcard__foto recorte" href="${esc(linkProducto(p.id))}" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${BASE}images/${esc(p.img)}.webp" width="480" height="600" alt="${esc(p.nombre)}"></a>
    ${badgesHTML(p)}
    <div class="fcard__info">
      <p class="fcard__meta">${p.luz ? ICO[p.luz] + esc(getLuz(p.luz)?.nombre) : esc(getCategoria(p.cat)?.nombre)}</p>
      <h3 class="fcard__nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p, 'fprecio')}
    </div>
    <button type="button" class="fcard__add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
  </${tag}>`;
}

const cardHTML = (p, op = {}) => (MODELO === '2' ? fcardHTML(p, op) : pcardHTML(p, op));

function bumpBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', bumpBadge);

async function agregar(id, qty = 1, { abrir = false } = {}) {
  const p = await Tienda.obtener(id);
  if (!p) return;
  if (p.stock <= 0) { showToast('Ese producto está sin stock por ahora. Preguntanos por WhatsApp.'); return; }
  Cart.add(p, qty);
  if (abrir) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre} al carrito`);
}

function initAccionesTarjetas() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const out = st.querySelector('[data-cant]');
      const id = st.closest('[data-id]')?.dataset.id || st.dataset.id;
      const max = getProducto(id)?.stock ?? 99;
      out.textContent = Math.max(1, Math.min(max, (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const card = add.closest('[data-id]');
      const qty = parseInt(card?.querySelector('[data-cant]')?.textContent, 10) || 1;
      agregar(add.dataset.add, qty);
      add.classList.remove('ok'); void add.offsetWidth; add.classList.add('ok');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const card = comprar.closest('[data-id]');
      const qty = parseInt(card?.querySelector('[data-cant]')?.textContent, 10) || 1;
      cerrarVista(false);
      agregar(comprar.dataset.comprar, qty, { abrir: true });
      return;
    }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const activo = Favs.toggle(fav.dataset.fav);
      const nombre = getProducto(fav.dataset.fav)?.nombre || 'Producto';
      showToast(activo ? `${nombre} quedó en tus favoritos` : `Sacaste ${nombre} de favoritos`);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirVista(quick.dataset.quick, quick);
    }
  });
  document.addEventListener('favs:updated', ev => {
    document.querySelectorAll(`[data-fav="${window.CSS.escape(ev.detail.id)}"]`).forEach(b => {
      b.setAttribute('aria-pressed', String(ev.detail.activo));
      const nombre = getProducto(ev.detail.id)?.nombre || '';
      const txt = b.querySelector('span');
      if (b.classList.contains('fav')) b.setAttribute('aria-label', `${ev.detail.activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${nombre}`);
      else if (txt) txt.textContent = ev.detail.activo ? 'En tus favoritos' : 'Guardar en favoritos';
    });
  });
}

const abiertos = () => document.querySelector('.main-nav.open, .drawer.open, .qv-backdrop.open, .filtros.open');
const syncScroll = () => { if (!abiertos()) document.body.classList.remove('no-scroll'); };
const focoAtrapado = (cont, e) => {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
};

let vistaFocoPrevio = null;
async function abrirVista(id, origen) {
  const p = await Tienda.obtener(id);
  const bd = document.querySelector('[data-qv]');
  const body = document.querySelector('[data-qv-body]');
  if (!p || !bd || !body) return;
  if (bd.hidden) vistaFocoPrevio = origen || document.activeElement;
  const escena = ESCENAS[p.escena];
  const cat = getCategoria(p.cat);
  const sub = getSub(p.sub);
  const fav = Favs.has(p.id);
  const cuidados = [];
  if (p.luz) cuidados.push(`<li>${ICO[p.luz]}<span><strong>Luz</strong>${esc(getLuz(p.luz).nombre)}</span></li>`);
  if (p.riego) cuidados.push(`<li>${ICO.riego}<span><strong>Riego</strong>${esc(p.riego)}</span></li>`);
  if (p.cuidado) cuidados.push(`<li>${ICO.hoja}<span><strong>Cuidado</strong>${esc(CUIDADO[p.cuidado])}</span></li>`);
  if (typeof p.mascotas === 'boolean') cuidados.push(`<li>${ICO.pata}<span><strong>Con mascotas</strong>${p.mascotas ? 'No es tóxica para perros y gatos' : 'Mejor fuera de su alcance'}</span></li>`);
  if (p.medida) cuidados.push(`<li>${ICO.medida}<span><strong>Medida</strong>${esc(p.medida)}</span></li>`);
  const consulta = wa(`Hola Sharif Artevivero! Quiero consultar por: ${p.nombre} (${formatearPrecio(precioFinal(p))}).`);
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
    <div class="qv__galeria">
      <div class="qv__principal recorte"><img data-qv-img src="${BASE}images/${esc(p.img)}.webp" width="480" height="600" alt="${esc(p.nombre)}"></div>
      ${escena ? `<div class="qv__thumbs">
        <button type="button" class="qv__thumb" data-qv-thumb="${BASE}images/${esc(p.img)}.webp" data-alt="${esc(p.nombre)}" aria-pressed="true" aria-label="Ver la foto del producto"><img src="${BASE}images/${esc(p.img)}.webp" width="480" height="600" alt=""></button>
        <button type="button" class="qv__thumb" data-qv-thumb="${BASE}images/${esc(escena.src)}.webp" data-alt="${esc(p.nombre)} en ${esc(escena.alt)}" aria-pressed="false" aria-label="Verlo en ${esc(escena.alt)}"><img src="${BASE}images/${esc(escena.src)}.webp" width="480" height="600" alt=""></button>
      </div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre)}${sub ? ' · ' + esc(sub.nombre) : ''}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${p.botanico && p.botanico !== p.nombre ? `<p class="qv__botanico">${esc(p.botanico)}</p>` : ''}
      ${precioHTML(p, 'qv-precio')}
      ${p.stock > 0 && p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} unidades</p>` : ''}
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__cuidados">${cuidados.join('')}</ul>
      <div class="qv__acciones">
        <div class="stepper stepper--grande" data-stepper data-id="${esc(p.id)}">
          <button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button>
          <span class="stepper__n" data-cant aria-live="polite">1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-add="${esc(p.id)}">${ICO.carrito}<span>Agregar al carrito</span></button>
        <button type="button" class="btn btn--linea" data-comprar="${esc(p.id)}">Comprar ahora</button>
      </div>
      <div class="qv__extra">
        <button type="button" class="qv__fav" data-fav="${esc(p.id)}" aria-pressed="${fav}">${ICO.corazon}<span>${fav ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        <a class="qv__wsp" href="${esc(consulta)}" target="_blank" rel="noopener noreferrer">${ICO.wsp}Consultar por WhatsApp</a>
      </div>
      <p class="qv__nota">Envío o retiro: lo coordinamos por WhatsApp después de la compra.</p>
      <div class="qv__rel" data-qv-rel hidden><p class="qv__rel-titulo">También te puede interesar</p><ul class="qv__rel-lista" data-qv-rel-lista></ul></div>
    </div>
  </div>`;
  body.querySelectorAll('[data-qv-thumb]').forEach(t => t.addEventListener('click', () => {
    const img = body.querySelector('[data-qv-img]');
    img.src = t.dataset.qvThumb;
    img.alt = t.dataset.alt;
    body.querySelectorAll('[data-qv-thumb]').forEach(o => o.setAttribute('aria-pressed', String(o === t)));
  }));
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: cat?.nombre, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  bd.hidden = false;
  void bd.offsetWidth;
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  bd.querySelector('.qv').focus();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    window.history.replaceState(null, '', u);
  }
  const { items } = await Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, limite: 3 });
  const rel = body.querySelector('[data-qv-rel]');
  if (items.length && rel && body.querySelector(`.qv__grid[data-id="${window.CSS.escape(p.id)}"]`)) {
    body.querySelector('[data-qv-rel-lista]').innerHTML = items.map(r => `<li><a href="${esc(linkProducto(r.id))}" data-quick="${esc(r.id)}"><span class="recorte"><img src="${BASE}images/${esc(r.img)}.webp" width="480" height="600" alt=""></span><span class="qv__rel-nombre">${esc(r.nombre)}</span><span class="qv__rel-precio">${formatearPrecio(precioFinal(r))}</span></a></li>`).join('');
    rel.hidden = false;
  }
}

function cerrarVista(devolverFoco = true) {
  const bd = document.querySelector('[data-qv]');
  if (!bd || bd.hidden) return;
  bd.classList.remove('open');
  bd.hidden = true;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = '{}';
  syncScroll();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    window.history.replaceState(null, '', u);
  }
  if (devolverFoco && vistaFocoPrevio?.isConnected) vistaFocoPrevio.focus();
}

function initVista() {
  const bd = document.querySelector('[data-qv]');
  if (!bd) return;
  bd.addEventListener('click', e => { if (e.target === bd || e.target.closest('[data-qv-cerrar]')) cerrarVista(); });
  bd.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarVista(); }
    else focoAtrapado(bd.querySelector('.qv'), e);
  });
}

let carritoFocoPrevio = null;
function abrirCarrito() {
  const drawer = document.getElementById('carrito');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!drawer || !bd) return;
  if (drawer.classList.contains('open')) return;
  carritoFocoPrevio = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  bd.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.focus();
}

function cerrarCarrito() {
  const drawer = document.getElementById('carrito');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  bd.classList.remove('open');
  setTimeout(() => {
    if (!drawer.classList.contains('open')) { drawer.hidden = true; bd.hidden = true; }
  }, 380);
  syncScroll();
  if (carritoFocoPrevio?.isConnected) carritoFocoPrevio.focus();
}

async function renderCarrito() {
  const lista = document.querySelector('[data-cart-items]');
  const pie = document.querySelector('[data-cart-pie]');
  const resumen = document.querySelector('[data-cart-resumen]');
  if (!lista || !pie) return;
  const items = Cart.get();
  await Tienda.obtenerVarios(items.map(i => i.id));
  const n = Cart.count();
  if (resumen) resumen.textContent = n ? `(${n})` : '';
  if (!items.length) {
    lista.innerHTML = `<div class="carrito-vacio">
      <span class="carrito-vacio__ico">${ICO.hoja}</span>
      <p class="carrito-vacio__titulo">Tu carrito está esperando su primera planta</p>
      <p>Sumá lo que te guste desde el catálogo y acá lo vas a ver.</p>
      <a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo</a>
    </div>`;
    pie.innerHTML = '';
    pie.hidden = true;
    return;
  }
  lista.innerHTML = `<ul class="carrito-lista">${items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<li class="carrito-item" data-id="${esc(p.id)}">
      <span class="carrito-item__foto recorte"><img src="${BASE}images/${esc(p.img)}.webp" width="480" height="600" alt=""></span>
      <div class="carrito-item__info">
        <p class="carrito-item__nombre">${esc(p.nombre)}</p>
        <p class="carrito-item__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s>` : ''}</p>
        <div class="stepper stepper--chico">
          <button type="button" data-cart-paso="-1" aria-label="Restar uno de ${esc(p.nombre)}">${ICO.menos}</button>
          <span class="stepper__n">${i.qty}</span>
          <button type="button" data-cart-paso="1" aria-label="Sumar uno de ${esc(p.nombre)}">${ICO.mas}</button>
        </div>
      </div>
      <div class="carrito-item__lado">
        <p class="carrito-item__sub">${formatearPrecio(precioFinal(p) * i.qty)}</p>
        <button type="button" class="carrito-item__quitar" data-cart-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.tacho}</button>
      </div>
    </li>`;
  }).join('')}</ul>`;
  const total = Cart.total();
  const pedido = wa(['Hola Sharif Artevivero! Quiero hacer este pedido:', ...items.map(i => { const p = getProducto(i.id); return p ? `• ${i.qty} × ${p.nombre} — ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean), `Total: ${formatearPrecio(total)}`, '¿Cómo coordinamos el envío o el retiro?']);
  pie.hidden = false;
  pie.innerHTML = `<div class="carrito-total"><span>Total</span><strong>${formatearPrecio(total)}</strong></div>
    <p class="carrito-nota">El envío o el retiro se coordina por WhatsApp después de la compra.</p>
    <button type="button" class="btn btn--cta btn--ancho" data-finalizar>Finalizar compra</button>
    <a class="btn btn--linea btn--ancho" href="${esc(pedido)}" target="_blank" rel="noopener noreferrer">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}

function initCarrito() {
  const drawer = document.getElementById('carrito');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!drawer || !bd) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  bd.addEventListener('click', cerrarCarrito);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const item = e.target.closest('.carrito-item');
    const paso = e.target.closest('[data-cart-paso]');
    if (paso && item) {
      const actual = Cart.get().find(i => i.id === item.dataset.id);
      if (actual) Cart.setQty(item.dataset.id, actual.qty + Number(paso.dataset.cartPaso));
      return;
    }
    if (e.target.closest('[data-cart-quitar]') && item) { Cart.remove(item.dataset.id); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarCarrito();
    else focoAtrapado(drawer, e);
  });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(); });
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); syncScroll();
  };
  const open = () => {
    if (!reduceMotion) window.scrollTo(0, 0);
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('[data-cat-menu] a, [data-esp-menu] a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', () => { syncInert(); if (desktopMq.matches && nav.classList.contains('open')) close(); });
  syncInert();
}

function initDesplegables() {
  const desktop = window.matchMedia('(min-width: 981px) and (hover: hover)');
  const drops = [...document.querySelectorAll('[data-drop]')];
  drops.forEach(drop => {
    const btn = drop.querySelector('.nav-drop__btn');
    const panel = drop.querySelector('.nav-drop__panel');
    if (!btn || !panel) return;
    let timer = 0;
    const abrir = () => {
      clearTimeout(timer);
      drops.forEach(o => { if (o !== drop) cerrarDrop(o); });
      drop.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    };
    const cerrar = () => cerrarDrop(drop);
    btn.addEventListener('click', () => (drop.classList.contains('open') ? cerrar() : abrir()));
    drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
    drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
    drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
    drop.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('open')) { e.stopPropagation(); cerrar(); btn.focus(); } });
  });
  function cerrarDrop(d) { d.classList.remove('open'); d.querySelector('.nav-drop__btn')?.setAttribute('aria-expanded', 'false'); }
  document.addEventListener('click', e => { drops.forEach(d => { if (!d.contains(e.target) && desktop.matches) cerrarDrop(d); }); });
}

async function initMenus() {
  const catMenus = document.querySelectorAll('[data-cat-menu]');
  const espMenus = document.querySelectorAll('[data-esp-menu]');
  if (!catMenus.length && !espMenus.length) return;
  const params = new URLSearchParams(location.search);
  const [porCat, porSub, porEsp] = await Promise.all([Tienda.facetas('cat'), Tienda.facetas('sub', { cat: ['plantas'] }), Tienda.facetas('espacio')]);
  const actualCat = PAGINA === 'catalogo' ? params.get('cat') : null;
  const actualEsp = PAGINA === 'catalogo' ? params.get('espacio') : null;
  const htmlCat = CATEGORIAS.map(c => {
    const subs = SUBS.filter(s => s.cat === c.id && porSub[s.id]);
    return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actualCat === c.id ? ' aria-current="page"' : ''}><span>${esc(c.nombre)}</span><small>${porCat[c.id] || 0}</small></a>${subs.length ? `<ul class="cat-menu__subs">${subs.map(s => `<li><a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)} <small>${porSub[s.id]}</small></a></li>`).join('')}</ul>` : ''}</li>`;
  }).join('');
  catMenus.forEach(m => { m.innerHTML = htmlCat; });
  const htmlEsp = ESPACIOS.map(e => `<li><a href="${CATALOGO_URL}?espacio=${e.id}"${actualEsp === e.id ? ' aria-current="page"' : ''}><span>${esc(e.nombre)}</span><small>${porEsp[e.id] || 0}</small></a></li>`).join('');
  espMenus.forEach(m => { m.innerHTML = htmlEsp; });
}

function initBuscarBarra() {
  const btn = document.querySelector('[data-buscar-toggle]');
  const barra = document.getElementById('buscarBarra');
  if (!btn || !barra) return;
  btn.addEventListener('click', () => {
    const abrir = barra.hidden;
    barra.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) barra.querySelector('input')?.focus();
  });
  barra.addEventListener('keydown', e => { if (e.key === 'Escape') { barra.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
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

function sincronizarBarraModelos() {
  if (PAGINA !== 'catalogo') return;
  const q = new URLSearchParams(location.search);
  q.delete('producto');
  const s = q.toString();
  document.querySelectorAll('.gw-modelos__btn').forEach(a => {
    const base = a.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html';
    a.setAttribute('href', s ? `${base}?${s}` : base);
  });
}

function initBanner() {
  const banner = document.querySelector('[data-banner]');
  if (!banner) return;
  const slides = [...banner.querySelectorAll('[data-slide]')];
  const dots = [...banner.querySelectorAll('[data-dot]')];
  if (slides.length < 2) return;
  let actual = 0;
  let timer = 0;
  const ir = n => {
    actual = (n + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === actual;
      s.classList.toggle('is-on', on);
      s.setAttribute('aria-hidden', String(!on));
      if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
    dots.forEach((d, i) => { if (i === actual) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  };
  const arrancar = () => { if (reduceMotion) return; window.clearInterval(timer); timer = window.setInterval(() => ir(actual + 1), 6500); };
  const parar = () => window.clearInterval(timer);
  dots.forEach(d => d.addEventListener('click', () => { ir(Number(d.dataset.dot)); arrancar(); }));
  banner.addEventListener('mouseenter', parar);
  banner.addEventListener('mouseleave', arrancar);
  banner.addEventListener('focusin', parar);
  banner.addEventListener('focusout', e => { if (!banner.contains(e.relatedTarget)) arrancar(); });
  let x0 = null;
  banner.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  banner.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); arrancar(); }
    x0 = null;
  });
  ir(0);
  arrancar();
}

function initRailDrag(vp) {
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    vp.classList.remove('dragging');
    if (moved) {
      const kill = ev => { ev.preventDefault(); ev.stopPropagation(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

async function initRail() {
  const vp = document.querySelector('[data-rail]');
  const track = document.querySelector('[data-rail-track]');
  if (!vp || !track) return;
  const { items } = await Tienda.consultar({ filtros: { destacado: true }, limite: 8 });
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card ? (card.getBoundingClientRect().width + gap) * Math.max(1, Math.floor(vp.clientWidth / (card.getBoundingClientRect().width + gap)) - 1) : 280;
  };
  const actualizar = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
}

async function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const { items } = await Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: MODELO === '2' ? 7 : 8 });
  if (MODELO === '2') cont.innerHTML = items.map((p, i) => fcardHTML(p, { grande: i === 0 })).join('');
  else cont.innerHTML = items.map(p => pcardHTML(p)).join('');
}

async function initContadoresHome() {
  const total = await Tienda.contar({});
  document.querySelectorAll('[data-total-catalogo]').forEach(el => { el.textContent = `(${total})`; });
  const luces = await Tienda.facetas('luz', { cat: ['plantas'] });
  document.querySelectorAll('[data-luz-n]').forEach(el => { const n = luces[el.dataset.luzN]; el.textContent = n ? `(${n})` : ''; });
  const esp = document.querySelectorAll('[data-esp-n]');
  if (esp.length) {
    const porEsp = await Tienda.facetas('espacio');
    esp.forEach(el => { const n = porEsp[el.dataset.espN] || 0; el.textContent = `${el.textContent.split(' · ')[0]} · ${n} ${n === 1 ? 'producto' : 'productos'}`; });
  }
  const hs = document.querySelectorAll('[data-hs]');
  if (hs.length) {
    const lista = await Tienda.obtenerVarios([...hs].map(h => h.dataset.hs));
    hs.forEach(h => { const p = lista.find(x => x.id === h.dataset.hs); if (p) h.textContent = `${p.nombre.split(' · ')[0]} · ${formatearPrecio(precioFinal(p))}`; });
  }
}

const Catalogo = {
  estado: null,
  siguiente: null,
  pedido: 0,
};

const FILTROS_LISTA = ['cat', 'sub', 'luz', 'espacio', 'precio'];
const VALIDOS = {
  cat: CATEGORIAS.map(c => c.id),
  sub: SUBS.map(s => s.id),
  luz: LUCES.map(l => l.id),
  espacio: ESPACIOS.map(e => e.id),
  precio: PRECIOS.map(p => p.id),
};

function leerEstadoURL() {
  const q = new URLSearchParams(location.search);
  const est = { q: (q.get('q') || '').trim().slice(0, 60), orden: Servidor.ORDENES.includes(q.get('orden')) ? q.get('orden') : 'destacados', oferta: q.get('oferta') === '1', fav: q.get('fav') === '1' };
  FILTROS_LISTA.forEach(k => { est[k] = (q.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)); });
  if (est.sub.length && !est.cat.includes('plantas')) est.cat = [...new Set([...est.cat, 'plantas'])];
  return est;
}

function escribirEstadoURL(est) {
  const u = new URL(location.href);
  const prod = u.searchParams.get('producto');
  u.search = '';
  FILTROS_LISTA.forEach(k => { if (est[k].length) u.searchParams.set(k, est[k].join(',')); });
  if (est.oferta) u.searchParams.set('oferta', '1');
  if (est.fav) u.searchParams.set('fav', '1');
  if (est.q) u.searchParams.set('q', est.q);
  if (est.orden !== 'destacados') u.searchParams.set('orden', est.orden);
  if (prod) u.searchParams.set('producto', prod);
  window.history.replaceState(null, '', u);
  sincronizarBarraModelos();
}

const filtrosServidor = est => {
  const f = {};
  FILTROS_LISTA.forEach(k => { if (est[k].length) f[k] = est[k]; });
  if (est.q) f.q = est.q;
  if (est.oferta) f.oferta = true;
  if (est.fav) f.ids = Favs.get();
  return f;
};

function tituloCatalogo(est) {
  if (est.q) return { titulo: `Resultados para «${est.q}»`, bajada: 'Buscamos en nombres, descripciones y cuidados de cada producto.', miga: 'Búsqueda' };
  if (est.fav) return { titulo: 'Tus favoritos', bajada: 'Lo que guardaste con el corazón, en este navegador.', miga: 'Favoritos' };
  if (est.oferta && !est.cat.length) return { titulo: 'Ofertas', bajada: 'Productos con descuento por tiempo limitado.', miga: 'Ofertas' };
  if (est.sub.length === 1 && est.cat.length <= 1) { const s = getSub(est.sub[0]); return { titulo: s.titulo, bajada: getCategoria('plantas').frase, miga: s.titulo }; }
  if (est.cat.length === 1) { const c = getCategoria(est.cat[0]); return { titulo: c.nombre, bajada: c.frase, miga: c.nombre }; }
  if (est.espacio.length === 1 && !est.cat.length) { const e = ESPACIOS.find(x => x.id === est.espacio[0]); return { titulo: e.nombre, bajada: e.frase, miga: e.nombre }; }
  return { titulo: 'Catálogo', bajada: 'Plantas, macetas, artesanías, insumos y luces solares.', miga: null };
}

async function pintarOpciones(est) {
  const base = filtrosServidor(est);
  const [porCat, porSub, porLuz, porEsp, porPrecio, nOferta] = await Promise.all([
    Tienda.facetas('cat', base), Tienda.facetas('sub', base), Tienda.facetas('luz', base), Tienda.facetas('espacio', base), Tienda.facetas('precio', base),
    Tienda.contar({ ...base, oferta: true }),
  ]);
  const op = (grupo, id, nombre, n, marcado) => `<label class="op${n ? '' : ' op--vacia'}"><input type="checkbox" data-f="${grupo}" value="${esc(id)}"${marcado ? ' checked' : ''}${!n && !marcado ? ' disabled' : ''}><span class="op__caja" aria-hidden="true"></span><span class="op__txt">${esc(nombre)}</span><small>${n || 0}</small></label>`;
  const set = (grupo, html) => { const el = document.querySelector(`[data-opciones="${grupo}"]`); if (el) el.innerHTML = html; };
  set('cat', CATEGORIAS.map(c => op('cat', c.id, c.nombre, porCat[c.id], est.cat.includes(c.id))).join(''));
  set('sub', SUBS.map(s => op('sub', s.id, s.nombre, porSub[s.id], est.sub.includes(s.id))).join(''));
  set('luz', LUCES.map(l => op('luz', l.id, l.nombre, porLuz[l.id], est.luz.includes(l.id))).join(''));
  set('espacio', ESPACIOS.map(e => op('espacio', e.id, e.nombre, porEsp[e.id], est.espacio.includes(e.id))).join(''));
  set('precio', PRECIOS.map(p => op('precio', p.id, p.nombre, porPrecio[p.id], est.precio.includes(p.id))).join(''));
  set('extra', op('oferta', '1', 'Solo ofertas', nOferta, est.oferta) + op('fav', '1', 'Mis favoritos', Favs.get().length, est.fav));
  const grupoSub = document.querySelector('[data-grupo-sub]');
  if (grupoSub) grupoSub.hidden = !est.cat.includes('plantas');
  const tabs = document.querySelector('[data-esp-tabs]');
  if (tabs) {
    const sinEsp = { ...base }; delete sinEsp.espacio;
    const total = await Tienda.contar(sinEsp);
    tabs.innerHTML = `<button type="button" class="esp-tab" data-esp-tab="" aria-pressed="${!est.espacio.length}">Todos <small>${total}</small></button>` + ESPACIOS.map(e => `<button type="button" class="esp-tab" data-esp-tab="${e.id}" aria-pressed="${est.espacio.length === 1 && est.espacio[0] === e.id}"${porEsp[e.id] ? '' : ' disabled'}>${esc(e.nombre)} <small>${porEsp[e.id] || 0}</small></button>`).join('');
  }
}

function pintarChips(est) {
  const cont = document.querySelector('[data-chips]');
  if (!cont) return;
  const chips = [];
  est.cat.forEach(id => chips.push(['cat', id, getCategoria(id).nombre]));
  est.sub.forEach(id => chips.push(['sub', id, getSub(id).titulo]));
  est.luz.forEach(id => chips.push(['luz', id, getLuz(id).nombre]));
  est.espacio.forEach(id => chips.push(['espacio', id, ESPACIOS.find(e => e.id === id).nombre]));
  est.precio.forEach(id => chips.push(['precio', id, PRECIOS.find(p => p.id === id).nombre]));
  if (est.oferta) chips.push(['oferta', '1', 'Solo ofertas']);
  if (est.fav) chips.push(['fav', '1', 'Mis favoritos']);
  if (est.q) chips.push(['q', est.q, `«${est.q}»`]);
  cont.innerHTML = chips.map(([g, v, t]) => `<button type="button" class="chip-activo" data-quitar="${g}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICO.cruz}</button>`).join('');
  const n = chips.length;
  document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n; el.hidden = !n; });
}

async function cargarCatalogo({ mas = false } = {}) {
  const grid = document.querySelector('[data-grid]');
  const est = Catalogo.estado;
  const pedido = ++Catalogo.pedido;
  const filtros = filtrosServidor(est);
  const btn = document.querySelector('[data-ver-mas]');
  if (btn) btn.disabled = true;
  const [{ items, siguiente }, total] = await Promise.all([
    Tienda.consultar({ filtros, orden: est.orden, cursor: mas ? Catalogo.siguiente : null, limite: POR_PAGINA }),
    mas ? Promise.resolve(null) : Tienda.contar(filtros),
  ]);
  if (pedido !== Catalogo.pedido) return;
  Catalogo.siguiente = siguiente;
  const html = items.map(p => cardHTML(p)).join('');
  if (mas) grid.insertAdjacentHTML('beforeend', html);
  else grid.innerHTML = html;
  grid.setAttribute('aria-busy', 'false');
  if (total !== null) {
    Catalogo.total = total;
    const txt = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    document.querySelectorAll('[data-contador]').forEach(el => { el.textContent = txt; });
    document.querySelectorAll('[data-contador-corto]').forEach(el => { el.textContent = txt; });
    const vacio = document.querySelector('[data-vacio]');
    if (vacio) vacio.hidden = total > 0;
  }
  if (btn) { btn.hidden = !siguiente; btn.disabled = false; }
  revelarNuevos(grid);
  refrescarTriggers();
}

async function aplicarEstado({ scroll = false } = {}) {
  const est = Catalogo.estado;
  if (!est.cat.includes('plantas')) est.sub = [];
  escribirEstadoURL(est);
  const t = tituloCatalogo(est);
  const h1 = document.querySelector('[data-cat-titulo]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-miga-actual]');
  if (h1) h1.textContent = t.titulo;
  if (bajada) bajada.textContent = t.bajada;
  if (miga) { miga.hidden = !t.miga; miga.textContent = t.miga || ''; if (t.miga) miga.setAttribute('aria-current', 'page'); else miga.removeAttribute('aria-current'); }
  document.title = t.titulo === 'Catálogo' ? 'Catálogo — Sharif Artevivero' : `${t.titulo} — Catálogo de Sharif Artevivero`;
  const qInput = document.querySelector('[data-q]');
  if (qInput && document.activeElement !== qInput) qInput.value = est.q;
  const orden = document.querySelector('[data-orden]');
  if (orden) orden.value = est.orden;
  pintarChips(est);
  await Promise.all([pintarOpciones(est), cargarCatalogo()]);
  if (scroll) {
    const top = document.getElementById('tienda')?.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}

function abrirFiltros() {
  const panel = document.querySelector('[data-filtros-panel]');
  const bd = document.querySelector('[data-filtros-bd]');
  if (!panel) return;
  bd.hidden = false;
  void panel.offsetWidth;
  panel.classList.add('open');
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.setAttribute('aria-expanded', 'true'));
  panel.querySelector('.filtros__cerrar')?.focus();
}

function cerrarFiltros() {
  const panel = document.querySelector('[data-filtros-panel]');
  const bd = document.querySelector('[data-filtros-bd]');
  if (!panel || !panel.classList.contains('open')) return;
  panel.classList.remove('open');
  bd.classList.remove('open');
  bd.hidden = true;
  syncScroll();
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => { b.setAttribute('aria-expanded', 'false'); });
  document.querySelector('[data-abrir-filtros]')?.focus();
}

async function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  Catalogo.estado = leerEstadoURL();
  const form = document.querySelector('[data-filtros]');
  form?.addEventListener('submit', e => e.preventDefault());
  form?.addEventListener('change', e => {
    const input = e.target.closest('input[data-f]');
    if (!input) return;
    const est = Catalogo.estado;
    const g = input.dataset.f;
    if (g === 'oferta' || g === 'fav') est[g] = input.checked;
    else {
      const set = new Set(est[g]);
      if (input.checked) set.add(input.value); else set.delete(input.value);
      est[g] = [...set];
    }
    aplicarEstado();
  });
  const qInput = document.querySelector('[data-q]');
  let tq = 0;
  qInput?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { Catalogo.estado.q = qInput.value.trim().slice(0, 60); aplicarEstado(); }, 250);
  });
  document.querySelectorAll('[data-buscar-header]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const v = f.querySelector('input')?.value.trim().slice(0, 60) || '';
    Catalogo.estado = { q: v, orden: Catalogo.estado.orden, oferta: false, fav: false, cat: [], sub: [], luz: [], espacio: [], precio: [] };
    aplicarEstado({ scroll: true });
    const barra = document.getElementById('buscarBarra');
    if (barra && f.closest('#buscarBarra')) { barra.hidden = true; document.querySelector('[data-buscar-toggle]')?.setAttribute('aria-expanded', 'false'); }
  }));
  document.querySelector('[data-orden]')?.addEventListener('change', e => { Catalogo.estado.orden = e.target.value; aplicarEstado(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Catalogo.estado = { q: '', orden: Catalogo.estado.orden, oferta: false, fav: false, cat: [], sub: [], luz: [], espacio: [], precio: [] };
    const hb = document.querySelector('[data-buscar-header] input');
    if (hb) hb.value = '';
    aplicarEstado({ scroll: true });
  }));
  document.querySelector('[data-chips]')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-quitar]');
    if (!chip) return;
    const est = Catalogo.estado;
    const g = chip.dataset.quitar;
    if (g === 'q') est.q = '';
    else if (g === 'oferta' || g === 'fav') est[g] = false;
    else est[g] = est[g].filter(v => v !== chip.dataset.valor);
    aplicarEstado();
  });
  document.querySelector('[data-esp-tabs]')?.addEventListener('click', e => {
    const tab = e.target.closest('[data-esp-tab]');
    if (!tab || tab.disabled) return;
    Catalogo.estado.espacio = tab.dataset.espTab ? [tab.dataset.espTab] : [];
    aplicarEstado();
  });
  document.querySelector('[data-ver-mas]')?.addEventListener('click', () => cargarCatalogo({ mas: true }));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  document.querySelector('[data-filtros-bd]')?.addEventListener('click', cerrarFiltros);
  document.querySelector('[data-filtros-panel]')?.addEventListener('keydown', e => {
    const panel = e.currentTarget;
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else focoAtrapado(panel, e);
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', ev => { if (ev.matches && MODELO === '1') cerrarFiltros(); });
  document.addEventListener('favs:updated', () => { if (Catalogo.estado.fav) aplicarEstado(); else pintarOpciones(Catalogo.estado); });
  const hb = document.querySelector('[data-buscar-header] input');
  if (hb) hb.value = Catalogo.estado.q;
  await aplicarEstado();
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod && /^[a-z0-9-]{1,60}$/.test(prod)) {
    const p = await Tienda.obtener(prod);
    if (p) abrirVista(p.id);
  }
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const raiz = hero.querySelector('.slide.is-on') || hero;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(raiz.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(raiz.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(raiz.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(raiz.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-side, .sello, .hs, .hero-pista, .banner__dots'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.historia__foto img');
  if (foto) gsap.fromTo(foto, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.historia', start: 'top bottom', end: 'bottom top', scrub: true } });
}

async function iniciar() {
  initModelBarScroll();
  sincronizarBarraModelos();
  initNav();
  initDesplegables();
  initBuscarBarra();
  initAccionesTarjetas();
  initVista();
  initCarrito();
  await Tienda.obtenerVarios(Cart.get().map(i => i.id));
  bumpBadge();
  initFloats();
  initBanner();
  initHeroMotion();
  await Promise.all([initMenus(), initRail(), initPrevia(), initContadoresHome(), initCatalogo()]);
  initReveals();
  initParallax();
  refrescarTriggers();
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.filtros.open')) cerrarFiltros();
  });
}

iniciar();
