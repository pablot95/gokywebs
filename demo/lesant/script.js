const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491134684100';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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

const CATEGORIAS = [
  { id: 'velas', nombre: 'Velas aromáticas', img: 'images/t-velas.webp' },
  { id: 'aromas', nombre: 'Aromas y bienestar', img: 'images/t-aromas.webp' },
  { id: 'deco', nombre: 'Deco zen', img: 'images/t-deco.webp' },
];
const TIPOS = [
  { id: 'vidrio', cat: 'velas', nombre: 'Velas en vidrio', img: 'images/t-vidrio.webp' },
  { id: 'cuenco', cat: 'velas', nombre: 'Velas en cuenco', img: 'images/t-cuenco.webp' },
  { id: 'sprays', cat: 'aromas', nombre: 'Sprays áuricos', img: 'images/t-sprays.webp' },
  { id: 'rollons', cat: 'aromas', nombre: 'Roll-ons', img: 'images/t-rollons.webp' },
  { id: 'difusores', cat: 'aromas', nombre: 'Difusores', img: 'images/t-difusores.webp' },
  { id: 'fogoneros', cat: 'deco', nombre: 'Fogoneros', img: 'images/t-fogoneros.webp' },
  { id: 'cuencos', cat: 'deco', nombre: 'Cuencos', img: 'images/t-cuencos.webp' },
  { id: 'lamparas', cat: 'deco', nombre: 'Lámparas de sal', img: 'images/t-lamparas.webp' },
];
const INTENCIONES = [
  { id: 'calma', nombre: 'Calma', aceites: 'lavanda, romero y manzanilla', frase: 'Para acompañarte en momentos de ansiedad y estrés.', uso: 'Rociá la almohada antes de dormir o pasá el roll-on por las muñecas y el cuello.' },
  { id: 'proteccion', nombre: 'Protección', aceites: 'lavanda, menta y romero', frase: 'Pensado para quienes estudian y trabajan donde circula mucha gente.', uso: 'Rociá tu ropa y tu espacio antes de salir a estudiar o a trabajar.' },
  { id: 'energia', nombre: 'Energía', aceites: 'limón, naranja y verbena', frase: 'Si sentís pesadez y te cuesta arrancar, su presencia cítrica te da frescura.', uso: 'A la mañana, en la ropa o en las muñecas, para arrancar el día.' },
  { id: 'enfoque', nombre: 'Enfoque', aceites: 'menta, romero y limón', frase: 'Un blend fresco para estudiar, leer o trabajar con la cabeza despejada.', uso: 'En las muñecas y el cuello, antes de sentarte a estudiar o a trabajar.' },
  { id: 'confianza', nombre: 'Confianza', aceites: 'rosa, nardo y fresias', frase: 'Creado para acompañar y equilibrar las emociones.', uso: 'En las muñecas y el cuello, cuando necesites un momento para vos.' },
  { id: 'armonia', nombre: 'Armonía', aceites: 'nardo y fresias', frase: 'Un aroma floral y suave para un ambiente sereno.', uso: 'Encendé la vela en el living o en tu rincón de meditación.' },
  { id: 'alegria', nombre: 'Alegría', aceites: 'coco y lima', frase: 'Fresco, dulce y luminoso, para los días largos.', uso: 'Una vela para la mesa del comedor o para tu escritorio.' },
  { id: 'prosperidad', nombre: 'Prosperidad', aceites: 'vainilla y canela', frase: 'Un aroma cálido y especiado para la casa.', uso: 'Encendé la vela en la entrada de tu casa o en tu espacio de trabajo.' },
];
const AROMAS = [
  { id: 'lavanda-silvestre', nombre: 'Lavanda silvestre' }, { id: 'jazmin', nombre: 'Jazmín' }, { id: 'nardo', nombre: 'Nardo' },
  { id: 'verbena', nombre: 'Verbena' }, { id: 'coco-vainilla', nombre: 'Coco vainilla' }, { id: 'vainilla-tilo', nombre: 'Vainilla tilo' },
  { id: 'maderas-oriente', nombre: 'Maderas de Oriente' }, { id: 'eucalipto', nombre: 'Eucalipto, menta y alcanfor' }, { id: 'maderas-nobles', nombre: 'Maderas nobles' },
];
const MATERIALES = [
  { id: 'cera', nombre: 'Cera vegetal' },
  { id: 'aceites', nombre: 'Aceites esenciales' },
  { id: 'vidrio', nombre: 'Vidrio' },
  { id: 'algarrobo', nombre: 'Madera de algarrobo' },
  { id: 'recuperada', nombre: 'Madera recuperada' },
  { id: 'sal', nombre: 'Sal natural' },
];
const PRECIOS = [
  { id: 'hasta20', nombre: 'Hasta $20.000', min: null, max: 20000 },
  { id: '20a35', nombre: '$20.000 a $35.000', min: 20001, max: 35000 },
  { id: 'mas35', nombre: 'Más de $35.000', min: 35001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  velas: 'vela velas cirio aromatica aromaticas soja', aromas: 'aroma aromas aromaterapia bienestar', deco: 'deco decoracion zen hogar',
  vidrio: 'frasco caramelera tapa vidrio', cuenco: 'cuenco madera algarrobo', sprays: 'spray bruma aurico auricos aura textil',
  rollons: 'roll on rollon roll-on aceite cartera', difusores: 'difusor difusores varillas ratan ambiente', fogoneros: 'fogonero fuego bioetanol llama mesa',
  cuencos: 'cuenco bowl centro de mesa madera', lamparas: 'lampara lamparas sal himalaya luz',
};
const VELAS_INT = ['calma', 'armonia', 'alegria', 'confianza', 'prosperidad'];
const ETQ_SPRAY = { l: 38.3, t: 46.3, w: 23.1, h: 27.9, tipo: 'spray' };
const ETQ_ROLL = { l: 41.6, t: 38.6, w: 15.4, h: 33.8, tipo: 'roll' };

const Tienda = crearTienda([
  { id: 'vela-caramelera-petit', nombre: 'Vela Caramelera Petit', cat: 'velas', tipo: 'vidrio', mat: ['cera', 'aceites', 'vidrio'], precio: 25000, descuento: 0, stock: 9, alta: 8, rango: 1,
    vars: VELAS_INT.map(v => ({ id: v })), varTipo: 'int',
    img: 'images/vela-caramelera-petit.webp', alt: 'Vela de cera vegetal en un frasco de vidrio acanalado con la tapa apoyada al costado',
    galeria: [{ src: 'images/vela-caramelera-petit-alta.webp', alt: 'La Vela Caramelera Petit sobre un mantel de lino con lavanda seca', w: 900, h: 1600 }],
    desc: 'La versión chica de la caramelera: vela de cera vegetal con aceites esenciales, en un frasco de vidrio acanalado con tapa.',
    datos: [['Cera', 'Vegetal, con aceites esenciales'], ['Recipiente', 'Vidrio acanalado con tapa'], ['Blends', '5 a elección'], ['Hecha', 'A mano']] },
  { id: 'vela-cuenco-algarrobo', nombre: 'Vela en cuenco de algarrobo', cat: 'velas', tipo: 'cuenco', mat: ['cera', 'aceites', 'algarrobo'], precio: 18000, descuento: 0, stock: 12, alta: 10, rango: 2,
    vars: VELAS_INT.map(v => ({ id: v })), varTipo: 'int',
    img: 'images/vela-cuenco-algarrobo.webp', alt: 'Vela de cera de soja dentro de un cuenco de madera de algarrobo sobre piedra clara',
    galeria: [{ src: 'images/vela-cuenco-algarrobo-ancha.webp', alt: 'Vela en cuenco de algarrobo con lavanda seca y flores de gypsophila', w: 1600, h: 900 }, { src: 'images/m-cera.webp', alt: 'La cera de soja y la mecha de la vela, de cerca', w: 600, h: 600 }],
    desc: 'Vela aromática de cera de soja perfumada con aceites esenciales, en un cuenco de madera de algarrobo impermeabilizado con aceite de lino.',
    datos: [['Cera', 'Soja vegetal'], ['Recipiente', 'Cuenco de algarrobo'], ['Acabado', 'Aceite de lino'], ['Blends', '5 a elección']] },
  { id: 'difusor-ecologico', nombre: 'Difusor ambiental ecológico', cat: 'aromas', tipo: 'difusores', mat: ['aceites', 'vidrio'], precio: 19000, descuento: 0, stock: 14, alta: 6, rango: 3,
    vars: AROMAS.map(a => ({ id: a.id })), varTipo: 'aroma',
    img: 'images/difusor-ecologico.webp', alt: 'Difusor de vidrio ámbar con varillas de ratán y etiqueta en blanco sobre una base de piedra',
    galeria: [{ src: 'images/m-aceites.webp', alt: 'El vidrio ámbar del difusor y las varillas de ratán, de cerca', w: 600, h: 600 }],
    desc: 'Difusor aromático de creación artesanal, vegano y cruelty free, con combinaciones propias. Trae 100 ml y un juego de 5 varillas de ratán.',
    datos: [['Contenido', '100 ml'], ['Varillas', '5 de ratán'], ['Fórmula', 'Vegana y cruelty free'], ['Aromas', '9 a elección']] },
  { id: 'fogonero-de-mesa', nombre: 'Fogonero ecológico de mesa', cat: 'deco', tipo: 'fogoneros', mat: ['recuperada'], precio: 65000, descuento: 0, stock: 3, alta: 9, rango: 4,
    vars: [], varTipo: '',
    img: 'images/fogonero-de-mesa.webp', alt: 'Fogonero de mesa redondo con el quemador metálico, sobre una mesada clara',
    desc: 'Fuego a bioetanol, sin humo, sin hollín y sin olor, apto para interior y exterior. Cada pieza se interviene a mano y cada carga dura unos 40 minutos.',
    datos: [['Combustible', 'Bioetanol (alcohol de cereal)'], ['Duración', 'Unos 40 minutos por carga'], ['Incluye', 'Quemador metálico y piedras'], ['Uso', 'Interior y exterior']] },
  { id: 'spray-aurico', nombre: 'Spray áurico', cat: 'aromas', tipo: 'sprays', mat: ['aceites'], precio: 24000, descuento: 0, stock: 15, alta: 7, rango: 5,
    vars: [{ id: 'calma' }, { id: 'proteccion' }, { id: 'energia', aceites: 'limón, naranja, verbena y jengibre' }], varTipo: 'int', etq: ETQ_SPRAY,
    img: 'images/spray-aurico.webp', alt: 'Spray de vidrio ámbar con etiqueta clara, lavanda y un lino lila de fondo',
    desc: 'Bruma de aceites esenciales para vos, tu ropa y tu espacio. Es hipoalergénica, no mancha la ropa y es para toda la familia.',
    datos: [['Base', 'Aceites esenciales'], ['Uso', 'Ambiente, ropa y almohada'], ['Piel', 'Hipoalergénico'], ['Blends', 'Calma, Protección y Energía']] },
  { id: 'lampara-sal-sustentable', nombre: 'Lámpara de sal sustentable', cat: 'deco', tipo: 'lamparas', mat: ['sal', 'recuperada'], precio: 39000, descuento: 0, stock: 6, alta: 5, rango: 6,
    vars: [], varTipo: '',
    img: 'images/lampara-sal-sustentable.webp', alt: 'Lámpara de sal encendida con luz cálida sobre una base de madera',
    galeria: [{ src: 'images/m-sal.webp', alt: 'Los cristales de sal iluminados desde adentro, de cerca', w: 600, h: 600 }],
    desc: 'Cristales de sal natural sobre una base de madera recuperada, elaborada a mano. Una luz cálida que transforma cualquier rincón.',
    datos: [['Piedra', 'Sal natural'], ['Base', 'Madera recuperada'], ['Luz', 'Cálida'], ['Hecha', 'A mano']] },
  { id: 'roll-on-blends', nombre: 'Roll-on Blends Sensoriales', cat: 'aromas', tipo: 'rollons', mat: ['aceites', 'vidrio'], precio: 20000, descuento: 0, stock: 18, alta: 4, rango: 7,
    vars: [{ id: 'calma' }, { id: 'enfoque' }, { id: 'energia', aceites: 'limón, naranja y cedrón' }, { id: 'confianza' }], varTipo: 'int', etq: ETQ_ROLL,
    img: 'images/roll-on-blends.webp', alt: 'Roll-on de vidrio ámbar con etiqueta clara y la tapa negra al lado',
    desc: 'Blends de aceites esenciales con enfoque holístico, en un roll-on de 10 ml para llevar en la cartera y usar cuando lo necesites.',
    datos: [['Contenido', '10 ml'], ['Base', 'Aceites esenciales'], ['Uso', 'Muñecas y cuello'], ['Blends', 'Calma, Enfoque, Energía y Confianza']] },
  { id: 'vela-caramelera-glass-xl', nombre: 'Vela Caramelera Glass XL', cat: 'velas', tipo: 'vidrio', mat: ['cera', 'aceites', 'vidrio'], precio: 33000, descuento: 0, stock: 7, alta: 3, rango: 8,
    vars: VELAS_INT.map(v => ({ id: v })), varTipo: 'int',
    img: 'images/vela-caramelera-glass-xl.webp', alt: 'Vela en una caramelera de vidrio labrado con la tapa apoyada al lado',
    desc: 'Vela aromática ecológica realizada con aceites esenciales, en una caramelera de vidrio labrado con tapa.',
    datos: [['Cera', 'Vegetal, con aceites esenciales'], ['Recipiente', 'Vidrio labrado con tapa'], ['Tamaño', 'XL'], ['Blends', '5 a elección']] },
  { id: 'cuenco-algarrobo', nombre: 'Cuenco de algarrobo', cat: 'deco', tipo: 'cuencos', mat: ['algarrobo'], precio: 15000, descuento: 0, stock: 8, alta: 2, rango: 9,
    vars: [], varTipo: '',
    img: 'images/cuenco-algarrobo.webp', alt: 'Cuenco de madera de algarrobo vacío sobre un lino claro, con lavanda',
    galeria: [{ src: 'images/m-madera.webp', alt: 'La veta de la madera de algarrobo, de cerca', w: 600, h: 600 }],
    desc: 'Cuenco de madera de algarrobo curado con aceite de lino. Para el centro de la mesa, las llaves o tus cristales.',
    datos: [['Madera', 'Algarrobo'], ['Acabado', 'Aceite de lino'], ['Pieza', 'Única: cada veta es distinta'], ['Uso', 'Decorativo']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreEn = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const textoVars = p => (p.vars || []).map(v => {
    if (p.varTipo === 'aroma') return nombreEn(AROMAS, v.id);
    const it = INTENCIONES.find(x => x.id === v.id) || {};
    return `${it.nombre || ''} ${v.aceites || it.aceites || ''}`;
  }).join(' ');
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, nombreEn(CATEGORIAS, p.cat), ETIQUETAS[p.cat] || '', nombreEn(TIPOS, p.tipo), ETIQUETAS[p.tipo] || '',
    (p.mat || []).map(m => nombreEn(MATERIALES, m)).join(' '), textoVars(p),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), int = lista(f.int), mat = lista(f.mat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (int.length && !(p.varTipo === 'int' && p.vars.some(v => int.includes(v.id)))) return false;
    if (mat.length && !(p.mat || []).some(m => mat.includes(m))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || (b.alta || 0) - (a.alta || 0) || desempate(a, b);
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const tipoDe = id => TIPOS.find(t => t.id === id) || { nombre: '' };
const intDe = id => INTENCIONES.find(i => i.id === id) || null;
const piezas = n => `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };

function varInfo(p, vid) {
  if (!p || !vid) return null;
  const v = (p.vars || []).find(x => x.id === vid);
  if (!v) return null;
  if (p.varTipo === 'aroma') {
    const a = AROMAS.find(x => x.id === vid);
    return a ? { id: vid, nombre: a.nombre, etiqueta: `Aroma ${a.nombre}`, aceites: '' } : null;
  }
  const it = intDe(vid);
  return it ? { id: vid, nombre: it.nombre, etiqueta: `Blend ${it.nombre}`, aceites: v.aceites || it.aceites } : null;
}
const varLabel = p => (p.varTipo === 'aroma' ? 'Aroma' : 'Blend');
function metaDe(p) {
  const n = (p.vars || []).length;
  if (!n) return `${tipoDe(p.tipo).nombre}`;
  return `${tipoDe(p.tipo).nombre} · ${n} ${p.varTipo === 'aroma' ? 'aromas' : 'blends'}`;
}
const stockLibre = (p, excepto = -1) => {
  const usado = Cart.get().reduce((s, it, k) => (k !== excepto && it.id === p.id ? s + it.qty : s), 0);
  return Math.max(0, (p.stock || 0) - usado);
};

const ICO = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Cart = {
  KEY: 'lesant_cart',
  get() {
    const a = leer(this.KEY, []);
    if (!Array.isArray(a)) return [];
    const usado = new Map();
    return a.filter(i => i && getProducto(i.id) && i.qty > 0).map(i => {
      const p = getProducto(i.id);
      const v = p.vars && p.vars.length ? (p.vars.some(x => x.id === i.v) ? i.v : p.vars[0].id) : '';
      const libre = (p.stock || 0) - (usado.get(p.id) || 0);
      const qty = Math.min(Math.max(1, parseInt(i.qty, 10) || 1), Math.max(0, libre));
      usado.set(p.id, (usado.get(p.id) || 0) + qty);
      return { id: i.id, v, qty };
    }).filter(i => i.qty > 0);
  },
  save(items) {
    guardar(this.KEY, items.map(({ id, v, qty }) => ({ id, v, qty })));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, v = '', qty = 1) {
    const items = this.get();
    const libre = stockLibre(producto);
    if (libre <= 0) return false;
    const suma = Math.min(qty, libre);
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return true;
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    const p = getProducto(it.id);
    it.qty = Math.max(1, Math.min(qty, it.qty + stockLibre(p)));
    this.save(items);
  },
  maxDe(idx) { const it = this.get()[idx]; return it ? it.qty + stockLibre(getProducto(it.id)) : 1; },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--desc">-${p.descuento}%</span>`;
  if ((p.stock || 0) <= 3) return '<span class="badge">Últimas unidades</span>';
  return '';
}
function varOptions(p, sel = '') {
  return (p.vars || []).map(v => {
    const i = varInfo(p, v.id);
    return `<option value="${v.id}"${v.id === sel ? ' selected' : ''}>${esc(i ? i.nombre : v.id)}</option>`;
  }).join('');
}
function etiquetaHTML(p, vid) {
  if (!p.etq) return '';
  const i = varInfo(p, vid);
  if (!i) return '';
  const e = p.etq;
  return `<span class="etq etq--${e.tipo}" style="left:${e.l}%;top:${e.t}%;width:${e.w}%;height:${e.h}%" aria-hidden="true"><span class="etq__in"><span class="etq__marca">Le Sant</span><span class="etq__nom">${esc(i.nombre)}</span><span class="etq__ac">${esc(i.aceites)}</span></span></span>`;
}
const ANIM_CARD = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
function cardHTML(p, animar = true) {
  const tieneVars = (p.vars || []).length > 0;
  return `<article class="card" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${p.img}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async"></button>
    <div class="card__info">
      <p class="card__meta">${esc(metaDe(p))}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      <div class="prod-actions">${tieneVars ? `<select class="var-sel" data-var-sel="${p.id}" aria-label="${varLabel(p)} de ${esc(p.nombre)}">${varOptions(p, p.vars[0].id)}</select>` : ''}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span class="prod-add__txt">Agregar<span class="prod-add__mas"> al carrito</span></span></button></div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function vcardHTML(p, tipo = '', animar = true) {
  const ancha = tipo === 'ancha' && p.galeria && p.galeria[0] && p.galeria[0].w > p.galeria[0].h;
  const src = ancha ? p.galeria[0].src : p.img;
  const dims = ancha ? 'width="1600" height="900"' : 'width="1200" height="1200"';
  const tieneVars = (p.vars || []).length > 0;
  return `<article class="vcard${ancha ? ' vcard--ancha' : ''}" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${src}" ${dims} alt="${esc(p.alt)}" decoding="async"></button>
    <div class="vcard__info">
      <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
      <p class="vcard__meta">${esc(metaDe(p))}</p>
      <p class="vcard__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <button type="button" class="vcard__add" ${tieneVars ? `data-quick="${p.id}" aria-label="Elegir ${varLabel(p).toLowerCase()} de ${esc(p.nombre)}"` : `data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"`}>${ICO.carrito}</button>
    </div>
  </article>`;
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.08, clearProps: 'scale' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.hero__nota'), { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
}
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
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
    nav.querySelector('.nav-drop__btn, a')?.focus();
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
  const params = PAGINA === 'catalogo' ? new URLSearchParams(location.search) : null;
  const lista = document.querySelector('[data-menu-categorias]');
  if (lista) {
    const actual = params ? params.get('cat') : null;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" width="44" height="44" alt=""><span class="nav-drop__nom">${esc(c.nombre)}<small>${TIPOS.filter(t => t.cat === c.id).map(t => esc(t.nombre)).join(' · ')}</small></span><span class="nav-drop__cant">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
  }
  const ints = document.querySelector('[data-menu-intenciones]');
  if (ints) {
    const actual = params ? params.get('int') : null;
    ints.innerHTML = INTENCIONES.map(i => `<li><a href="${CATALOGO_URL}?int=${i.id}"${actual === i.id ? ' aria-current="page"' : ''}>${esc(i.nombre)}</a></li>`).join('');
  }
  const drop = document.querySelector('[data-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (hover.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (hover.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!drop.contains(e.target) && window.matchMedia('(min-width: 1025px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(el, bd) {
  el.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); bd.classList.add('open'); }));
}
function cerrarCapa(el, bd, despues) {
  el.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => {
    el.hidden = true; bd.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open')) document.body.classList.remove('no-scroll');
    despues?.();
  }, 320);
}

function lineaDetalle(p, v) {
  const i = varInfo(p, v);
  return i ? i.etiqueta : tipoDe(p.tipo).nombre;
}
const Drawer = {
  el: null, bd: null, origen: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const paso = e.target.closest('[data-linea-step]');
      if (paso) {
        const idx = Number(paso.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaStep));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const idx = Number(quitar.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        Cart.remove(idx);
        if (it) showToast(`Sacaste ${getProducto(it.id).nombre} del carrito.`);
        this.el.querySelector('.drawer__cab button')?.focus();
        return;
      }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-catalogo]')) this.close();
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-cart]');
      if (b) { e.preventDefault(); this.open(b); }
    });
    this.render();
  },
  render() {
    if (!this.el) return;
    const body = this.el.querySelector('[data-lineas]');
    const foot = this.el.querySelector('[data-foot]');
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="carrito-vacio">${ICO.carrito}<h3>Tu carrito está vacío</h3><p>Elegí una vela, un blend o una pieza para tu rincón: queda guardada acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}" data-ir-catalogo>Volver al catálogo</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map((it, idx) => {
      const p = getProducto(it.id);
      const max = Cart.maxDe(idx);
      return `<div class="linea" data-idx="${idx}" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <img src="${p.img}" width="72" height="72" alt="">
        <div><p class="linea__nom">${esc(p.nombre)}</p><p class="linea__op">${esc(lineaDetalle(p, it.v))}</p>
          <div class="linea__fila"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno"${it.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${it.qty}</output><button type="button" data-linea-step="1" aria-label="Sumar uno"${it.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="linea__quitar" data-quitar>Quitar</button></div></div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open(origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.render();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__cab button')?.focus(), 60);
  },
  close() {
    if (!this.el || !this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};

const Modal = {
  el: null, bd: null, origen: null, p: null, v: '', qty: 1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const mini = e.target.closest('[data-mini]');
      if (mini) { this.verFoto(Number(mini.dataset.mini)); return; }
      const v = e.target.closest('[data-var]');
      if (v) { this.elegir(v.dataset.var); return; }
      const paso = e.target.closest('[data-vstep]');
      if (paso) { this.qty += Number(paso.dataset.vstep); this.syncQty(); return; }
      if (e.target.closest('[data-vadd]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vahora]')) { this.agregar(true); return; }
      if (e.target.closest('[data-ir-guia]')) { this.close(false); return; }
      const rel = e.target.closest('[data-rel]');
      if (rel) this.mostrar(rel.dataset.rel);
    });
  },
  fotos(p) { return [{ src: p.img, alt: p.alt, w: 1200, h: 1200 }, ...(p.galeria || [])]; },
  verFoto(k) {
    const f = this.fotos(this.p)[k];
    if (!f) return;
    const marco = this.el.querySelector('.vista__principal');
    const img = marco.querySelector('img');
    img.src = f.src; img.alt = f.alt; img.width = f.w; img.height = f.h;
    marco.classList.toggle('vista__principal--base', k === 0);
    this.el.querySelectorAll('[data-mini]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.mini) === k)));
  },
  elegir(vid) {
    const p = this.p;
    if (!p || !(p.vars || []).some(x => x.id === vid)) return;
    this.v = vid;
    this.el.querySelectorAll('[data-var]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.var === vid)));
    const i = varInfo(p, vid);
    const det = this.el.querySelector('[data-var-detalle]');
    if (det && i) det.innerHTML = i.aceites ? `<b>${esc(i.etiqueta)}:</b> ${esc(i.aceites)}. ${esc((intDe(vid) || {}).frase || '')}` : `<b>${esc(i.etiqueta)}</b>`;
    const etq = this.el.querySelector('.vista__principal .etq');
    if (etq) etq.outerHTML = etiquetaHTML(p, vid);
    const wsp = this.el.querySelector('[data-vwsp]');
    if (wsp) wsp.href = waLink(`Hola Le Sant! Quiero consultar por ${p.nombre}${i ? ` (${i.etiqueta})` : ''} que vi en la web.`);
  },
  maximo() { return this.p ? Math.max(1, stockLibre(this.p)) : 1; },
  syncQty() {
    const max = this.maximo();
    this.qty = Math.max(1, Math.min(this.qty, max));
    const out = this.el.querySelector('[data-vqty]');
    if (out) out.textContent = this.qty;
    const menos = this.el.querySelector('[data-vstep="-1"]'), mas = this.el.querySelector('[data-vstep="1"]');
    if (menos) menos.disabled = this.qty <= 1;
    if (mas) mas.disabled = this.qty >= max;
  },
  agregar(ahora) {
    const p = this.p;
    if (!p) return;
    const sumo = Cart.add(p, this.v, this.qty);
    const i = varInfo(p, this.v);
    if (ahora) {
      this.close(false);
      setTimeout(() => Drawer.open(this.origen), 340);
    } else {
      showToast(sumo ? `Sumaste ${p.nombre}${i ? ` · ${i.nombre}` : ''} al carrito.` : `Ya tenés en el carrito todas las unidades de ${p.nombre}.`);
      this.syncQty();
    }
  },
  html(p) {
    const fotos = this.fotos(p);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const vars = p.vars || [];
    const varsHTML = vars.length ? `<fieldset class="vars"><legend>Elegí ${p.varTipo === 'aroma' ? 'el aroma' : 'el blend'}</legend><div class="vars__lista${p.varTipo === 'aroma' ? ' vars__lista--aromas' : ''}">${vars.map(v => { const i = varInfo(p, v.id); return `<button type="button" data-var="${v.id}" aria-pressed="false">${esc(i ? i.nombre : v.id)}</button>`; }).join('')}</div><p class="vars__detalle" data-var-detalle aria-live="polite"></p>${p.varTipo === 'int' ? `<a class="vars__guia" href="#guia" data-ir-guia>¿No sabés cuál elegir? Mirá la guía de intenciones</a>` : ''}</fieldset>` : '';
    return `<div class="vista">
      <div class="vista__galeria">
        <div class="vista__principal vista__principal--base"><img src="${fotos[0].src}" alt="${esc(fotos[0].alt)}" width="1200" height="1200">${p.etq ? '<span class="etq"></span>' : ''}</div>
        ${fotos.length > 1 ? `<div class="vista__miniaturas">${fotos.map((f, k) => `<button type="button" data-mini="${k}" aria-pressed="${k === 0}" aria-label="Ver foto ${k + 1}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
      </div>
      <div class="vista__info">
        <p class="vista__cat">${esc(catDe(p.cat).nombre)} · ${esc(tipoDe(p.tipo).nombre)}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        ${varsHTML}
        <div class="vista__compra">
          <div class="stepper"><button type="button" data-vstep="-1" aria-label="Restar uno">${ICO.menos}</button><output data-vqty aria-live="polite">1</output><button type="button" data-vstep="1" aria-label="Sumar uno">${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vadd>Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-vahora>Comprar ahora</button>
        </div>
        <dl class="vista__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <a class="link-wsp vista__wsp" data-vwsp href="${waLink(`Hola Le Sant! Quiero consultar por ${p.nombre} que vi en la web.`)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por esta pieza</a>
        ${rel.length ? `<div class="relacionados"><h3>También te puede interesar</h3><div class="relacionados__lista">${rel.map(r => `<button type="button" data-rel="${r.id}"><img src="${r.img}" alt="" width="200" height="200">${esc(r.nombre)}</button>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  },
  mostrar(id, vid) {
    const p = getProducto(id);
    if (!p) return;
    this.p = p; this.v = ''; this.qty = 1;
    this.el.querySelector('[data-modal-cuerpo]').innerHTML = this.html(p);
    this.el.setAttribute('aria-label', `Detalle: ${p.nombre}`);
    this.el.scrollTop = 0;
    if ((p.vars || []).length) this.elegir((p.vars.some(x => x.id === vid) ? vid : p.vars[0].id));
    this.syncQty();
    const guia = this.el.querySelector('[data-ir-guia]');
    if (guia) guia.href = document.getElementById('guia') ? '#guia' : `${HOME_URL}#guia`;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', id); window.history.replaceState(null, '', u); }
  },
  open(id, origen, vid) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.mostrar(id, vid);
    if (!this.el.classList.contains('open')) abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
  },
  close(devolver = true) {
    if (!this.el || !this.el.classList.contains('open')) return;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u); }
    cerrarCapa(this.el, this.bd, () => { if (devolver) this.origen?.focus?.(); });
  },
};

const varDeCard = el => el.closest('.card, .vcard')?.querySelector('[data-var-sel]')?.value || '';
function initCardAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { Modal.open(quick.dataset.quick, quick, varDeCard(quick)); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const v = (p.vars || []).length ? (varDeCard(add) || p.vars[0].id) : '';
      const i = varInfo(p, v);
      const sumo = Cart.add(p, v, 1);
      showToast(sumo ? `Sumaste ${p.nombre}${i ? ` · ${i.nombre}` : ''} al carrito.` : `Ya tenés en el carrito todas las unidades de ${p.nombre}.`);
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      return;
    }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) {
      const p = getProducto(ahora.dataset.ahora);
      if (!p) return;
      const v = (p.vars || []).length ? (varDeCard(ahora) || p.vars[0].id) : '';
      Cart.add(p, v, 1);
      Drawer.open(ahora);
    }
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

function initConteos() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = piezas(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-tipo]').forEach(el => { el.textContent = piezas(Tienda.contar({ tipo: el.dataset.cuentaTipo })); });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}
function porIds(lista) {
  const ids = lista.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  const items = Tienda.consultar({ filtros: { ids }, limite: ids.length }).items;
  return ids.map(id => items.find(p => p.id === id)).filter(Boolean);
}
function initPreview() {
  const grilla = document.querySelector('[data-elegidos]');
  if (grilla) grilla.innerHTML = porIds(grilla.dataset.elegidos).map(p => cardHTML(p)).join('');
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) mosaico.innerHTML = porIds(mosaico.dataset.mosaico).map((p, k) => vcardHTML(p, k === 0 ? 'ancha' : '')).join('');
}

const FOTO_GUIA = { calma: 'spray-aurico', proteccion: 'spray-aurico', energia: 'spray-aurico', enfoque: 'roll-on-blends', confianza: 'roll-on-blends', armonia: 'vela-cuenco-algarrobo', alegria: 'vela-caramelera-glass-xl', prosperidad: 'vela-caramelera-petit' };
const KEY_INT = 'lesant_intencion';
function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const res = g.querySelector('[data-guia-res]');
  const opciones = [...g.querySelectorAll('[data-int]')];
  const catUrl = CATALOGO_URL;
  const pintar = (id, guardarPref) => {
    const it = intDe(id) || INTENCIONES[0];
    opciones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.int === it.id)));
    const foto = getProducto(FOTO_GUIA[it.id]);
    const total = Tienda.contar({ int: [it.id] });
    const items = Tienda.consultar({ filtros: { int: [it.id] }, limite: 3 }).items;
    res.innerHTML = `<div class="guia__res-in">
      <figure class="guia__frasco"><div class="guia__marco"><img src="${foto.img}" width="1200" height="1200" alt="${esc(foto.alt)}">${etiquetaHTML(foto, it.id)}</div>
        <figcaption class="guia__tag"><span class="guia__tag-k">Blend</span><b>${esc(it.nombre)}</b><span>${esc(it.aceites)}</span></figcaption></figure>
      <div class="guia__detalle">
        <h3 class="guia__nombre">${esc(it.nombre)}</h3>
        <p class="guia__frase">${esc(it.frase)}</p>
        <p class="guia__uso"><b>Cómo se usa:</b> ${esc(it.uso)}</p>
        <p class="guia__sub">${total === 1 ? 'La pieza que lo trae' : total > 3 ? `3 de las ${total} piezas que lo traen` : `Las ${total} piezas que lo traen`}</p>
        <ul class="guia__piezas">${items.map(p => { const i = varInfo(p, it.id); return `<li><div><p class="guia__pnom">${esc(p.nombre)}</p><p class="guia__pdet">${esc(i.aceites !== it.aceites ? i.aceites : tipoDe(p.tipo).nombre)} · ${formatearPrecio(precioFinal(p))}</p></div><button type="button" class="guia__sumar" data-guia-sumar="${p.id}" data-v="${it.id}" aria-label="Sumar ${esc(p.nombre)} ${esc(it.nombre)} al carrito">${ICO.carrito}<span>Sumar</span></button></li>`; }).join('')}</ul>
        <div class="guia__acciones"><a class="link-flecha" href="${catUrl}?int=${it.id}">Ver todo en ${esc(it.nombre)} ${ICO.flecha}</a><a class="link-wsp" href="${waLink(`Hola Le Sant! Me interesa el blend ${it.nombre} (${it.aceites}). ¿Qué me recomendás?`)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por este blend</a></div>
      </div>
    </div>`;
    if (!reduceMotion) { res.classList.remove('cambio'); void res.offsetWidth; res.classList.add('cambio'); }
    if (guardarPref) guardar(KEY_INT, it.id);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  g.addEventListener('click', e => {
    const b = e.target.closest('[data-int]');
    if (b) { pintar(b.dataset.int, true); return; }
    const s = e.target.closest('[data-guia-sumar]');
    if (s) {
      const p = getProducto(s.dataset.guiaSumar);
      const it = intDe(s.dataset.v);
      const sumo = Cart.add(p, s.dataset.v, 1);
      showToast(sumo ? `Sumaste ${p.nombre} · ${it.nombre} al carrito.` : `Ya tenés en el carrito todas las unidades de ${p.nombre}.`);
    }
  });
  g.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key) || !e.target.closest('[data-int]')) return;
    e.preventDefault();
    const k = opciones.indexOf(e.target.closest('[data-int]'));
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const sig = opciones[(k + d + opciones.length) % opciones.length];
    sig.focus(); pintar(sig.dataset.int, true);
  });
  const pref = String(leer(KEY_INT, '') || '');
  pintar(intDe(pref) ? pref : 'calma', false);
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const buscador = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const contador = document.querySelector('[data-contador]');
  const verMas = document.querySelector('[data-ver-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const multiples = (clave, lista) => (params.get(clave) || '').split(',').filter(v => valida(lista, v));
  const estado = {
    cat: multiples('cat', CATEGORIAS),
    tipo: multiples('tipo', TIPOS),
    int: multiples('int', INTENCIONES),
    mat: multiples('mat', MATERIALES),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
    q: (params.get('q') || '').slice(0, 60),
  };
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS, int: INTENCIONES, mat: MATERIALES };
  Object.entries(GRUPOS).forEach(([g, lista]) => {
    const cont = form.querySelector(`[data-ops="${g}"]`);
    if (!cont) return;
    cont.innerHTML = lista.map(x => `<label class="opcion"><input type="checkbox" data-f="${g}" value="${x.id}"${estado[g].includes(x.id) ? ' checked' : ''}> ${esc(x.nombre)} <small>${Tienda.contar({ [g]: x.id })}</small></label>`).join('');
  });
  const precioCont = form.querySelector('[data-ops="precio"]');
  if (precioCont) {
    precioCont.innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(x => `<label class="opcion"><input type="radio" name="precio" value="${x.id}"${estado.precio === x.id ? ' checked' : ''}> ${esc(x.nombre)}</label>`).join('');
  }
  if (ordenSel) ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === estado.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  if (buscador) buscador.value = estado.q;

  const filtros = () => {
    const f = { cat: estado.cat, tipo: estado.tipo, int: estado.int, mat: estado.mat };
    const pr = PRECIOS.find(x => x.id === estado.precio);
    if (pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    if (estado.q.trim()) f.q = estado.q.trim();
    return f;
  };
  const syncUrl = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'int', 'mat', 'precio', 'orden', 'q', 'buscar'].forEach(k => u.searchParams.delete(k));
    ['cat', 'tipo', 'int', 'mat'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    if (estado.q.trim()) u.searchParams.set('q', estado.q.trim());
    window.history.replaceState(null, '', u);
  };
  let cursor = null, mostrados = 0;
  const pintarCard = p => (MODELO === '2' ? vcardHTML(p) : cardHTML(p));
  function render(reiniciar) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const r = Tienda.consultar({ filtros: f, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = r.cursor;
    mostrados += r.items.length;
    if (reiniciar && !r.items.length) {
      grid.innerHTML = `<div class="vacio"><h2>No hay piezas con esos filtros</h2><p>Probá con otra palabra o sacá algún filtro: el catálogo tiene ${piezas(Tienda.contar({}))}.</p><button type="button" class="btn btn--cta" data-limpiar>Ver todas las piezas</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', r.items.map(pintarCard).join(''));
    }
    const total = f.q ? null : Tienda.contar(f);
    if (contador) contador.textContent = total != null ? `${piezas(total)}${total !== Tienda.contar({}) ? ' con estos filtros' : ''}` : `${piezas(mostrados)}${cursor ? ' o más' : ''} para «${f.q}»`;
    if (verMas) verMas.hidden = !cursor;
    if (miga) {
      const una = estado.int.length === 1 && !estado.cat.length ? `Blend ${intDe(estado.int[0]).nombre}` : estado.cat.length === 1 ? catDe(estado.cat[0]).nombre : '';
      miga.hidden = !una; miga.textContent = una;
    }
    document.querySelectorAll('[data-menu-categorias] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-menu-intenciones] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('int');
      if (estado.int.length === 1 && id === estado.int[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const sincronizarControles = () => {
    form.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador) buscador.value = estado.q;
    const hb = document.getElementById('buscar-header');
    if (hb) hb.value = estado.q;
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) estado[t.dataset.f] = [...form.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
    if (t.name === 'precio') estado.precio = t.value;
    syncUrl(); render(true);
  });
  form.addEventListener('submit', e => e.preventDefault());
  const limpiar = () => {
    estado.cat = []; estado.tipo = []; estado.int = []; estado.mat = []; estado.precio = ''; estado.q = '';
    sincronizarControles(); syncUrl(); render(true);
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-limpiar]')) limpiar(); });
  if (ordenSel) ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; syncUrl(); render(true); });
  let t = 0;
  const buscar = valor => { estado.q = String(valor || '').slice(0, 60); sincronizarControles(); syncUrl(); render(true); };
  if (buscador) {
    buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => buscar(buscador.value), 250); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); buscar(buscador.value); });
  }
  const hform = document.querySelector('[data-buscador-header]');
  if (hform) hform.addEventListener('submit', e => {
    e.preventDefault();
    buscar(hform.querySelector('input')?.value);
    grid.closest('section')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  if (verMas) verMas.querySelector('button')?.addEventListener('click', () => render(false));
  sincronizarControles();
  render(true);
  if (params.has('buscar') && buscador) setTimeout(() => buscador.focus(), 300);

  const panel = document.querySelector('.filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(min-width: 901px)');
  let bd = null;
  const cerrarPanel = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  if (abrirBtn && panel) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd);
    abrirBtn.addEventListener('click', () => {
      panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll');
      abrirBtn.setAttribute('aria-expanded', 'true');
      panel.querySelector('button, input')?.focus();
    });
    bd.addEventListener('click', cerrarPanel);
    panel.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarPanel(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPanel(); else if (panel.classList.contains('open')) atrapar(panel, e); });
  }
  const detalles = [...document.querySelectorAll('.filtro')];
  const ajustarDetalles = () => {
    const comoBarra = MODELO === '2' && mq.matches;
    detalles.forEach(d => { d.open = !comoBarra; });
    if (mq.matches) cerrarPanel();
  };
  ajustarDetalles();
  mq.addEventListener('change', ajustarDetalles);
  if (MODELO === '2') {
    detalles.forEach(d => d.addEventListener('toggle', () => { if (d.open && mq.matches) detalles.forEach(o => { if (o !== d) o.open = false; }); }));
    document.addEventListener('click', e => { if (mq.matches && !e.target.closest('.filtro')) detalles.forEach(d => { d.open = false; }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mq.matches) detalles.forEach(d => { d.open = false; }); });
  }
}

function initBuscar() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    const input = document.getElementById('buscar');
    if (!input) return;
    e.preventDefault();
    input.scrollIntoView({ block: 'center' });
    input.focus();
  }));
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) Modal.open(id);
}

initMenuCategorias();
initConteos();
initPreview();
initCatalogo();
initGuia();
initReveals();
initNav();
initModelBarScroll();
initHeroMotion();
initLeeScroll();
initCardAcciones();
Drawer.init();
Modal.init();
initFloats();
updateCartBadge();
initBuscar();
abrirProductoDeUrl();
