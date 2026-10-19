const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168362952';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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
  { id: 'platos', nombre: 'Platos y bases', corto: 'Platos y bases', bajada: 'Dorados, plateados y gruesos', img: 'images/p-bases-gruesas.webp',
    texto: 'Platos de cartón laminado en dorado y plateado, con borde liso o festoneado, y bases gruesas para tortas de pisos.',
    subs: [{ id: 'redondos', nombre: 'Platos redondos' }, { id: 'gruesas', nombre: 'Bases gruesas' }] },
  { id: 'bandejas', nombre: 'Bandejas', corto: 'Bandejas', bajada: 'Rectangulares, doradas y plateadas', img: 'images/p-bandeja-plateada.webp',
    texto: 'Bandejas rectangulares de cartón laminado con borde festoneado, en dorado y en plateado.',
    subs: [{ id: 'doradas', nombre: 'Bandejas doradas' }, { id: 'plateadas', nombre: 'Bandejas plateadas' }] },
  { id: 'cajas', nombre: 'Cajas para tortas', corto: 'Cajas', bajada: 'Con visor, lisas, cupcakes y macarons', img: 'images/p-caja-visor.webp',
    texto: 'Cajas blancas para tortas y tartas, con y sin visor, y cajas para cupcakes y macarons.',
    subs: [{ id: 'tortas', nombre: 'Tortas y tartas' }, { id: 'porciones', nombre: 'Cupcakes y macarons' }] },
  { id: 'fuentes', nombre: 'Fuentes con tapa', corto: 'Fuentes', bajada: 'Aluminio con tapa de cartón o plástico', img: 'images/p-fuente-rectangular.webp',
    texto: 'Fuentes descartables de aluminio con tapa de cartón laminado o con tapa de plástico transparente.',
    subs: [{ id: 'carton', nombre: 'Con tapa de cartón' }, { id: 'plastico', nombre: 'Con tapa de plástico' }] },
];
const TERMINACIONES = [{ id: 'dorado', nombre: 'Dorado' }, { id: 'plateado', nombre: 'Plateado' }, { id: 'blanco', nombre: 'Blanco' }, { id: 'aluminio', nombre: 'Aluminio' }];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: null, max: 10000 },
  { id: '10a15', nombre: '$10.000 a $15.000', min: 10001, max: 15000 },
  { id: 'mas15', nombre: 'Más de $15.000', min: 15001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' }, { id: 'nuevos', nombre: 'Recién ingresados' },
];
const SINONIMOS = {
  platos: 'plato platos base bases torta tortas carton disco', bandejas: 'bandeja bandejas rectangular masas tarta carton',
  cajas: 'caja cajas packaging envase torta tarta', fuentes: 'fuente fuentes aluminio descartable envase bandeja tapa horno',
  redondos: 'redondo redonda', gruesas: 'gruesa grueso pisos drum firme', doradas: 'dorada dorado oro', plateadas: 'plateada plateado plata',
  tortas: 'torta tortas tarta tartas visor ventana', porciones: 'cupcake cupcakes macaron macarons porcion alfajores bombones muffin',
  carton: 'tapa carton laminado', plastico: 'tapa plastico transparente domo cupula pet',
  dorado: 'dorado dorada oro', plateado: 'plateado plateada plata', blanco: 'blanco blanca', aluminio: 'aluminio descartable',
};
const ESC_SURTIDO = { src: 'images/hero-surtido.webp', forma: 'ancha', alt: 'El producto junto al resto del surtido: cajas, bandejas doradas y plateadas, platos festoneados y fuentes con tapa sobre una mesada de mármol' };
const ESC_CAJAS = { src: 'images/cajas-surtido.webp', forma: '', alt: 'Cajas blancas lisas y con visor, una caja con cupcakes y otra con macarons, sobre mármol' };
const ESC_FUENTES = { src: 'images/fuentes-surtido.webp', forma: '', alt: 'Fuentes de aluminio rectangulares y redondas con tapa de cartón laminado, apiladas sobre mármol' };

const Tienda = crearTienda([
  { id: 'plato-dorado-redondo', nombre: 'Plato dorado redondo para torta', cat: 'platos', sub: 'redondos', term: 'dorado', pack: 10, medidaTipo: 'Diámetro',
    ops: [{ id: '20', txt: '20 cm', precio: 6900 }, { id: '24', txt: '24 cm', precio: 8400 }, { id: '28', txt: '28 cm', precio: 10300 }, { id: '32', txt: '32 cm', precio: 12600 }, { id: '36', txt: '36 cm', precio: 15400 }],
    descuento: 0, stock: 40, rango: 1, alta: 10, img: 'images/p-plato-dorado.webp', escena: null,
    alt: 'Plato redondo de cartón laminado dorado, visto en perspectiva sobre fondo claro', desc: 'Cartón laminado dorado con el borde prolijo. La base clásica para presentar la torta y trasladarla sin que se doble.' },
  { id: 'bandeja-dorada-festoneada', nombre: 'Bandeja dorada rectangular festoneada', cat: 'bandejas', sub: 'doradas', term: 'dorado', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: 'n2', txt: 'N.º 2 · 20 × 28 cm', precio: 7900 }, { id: 'n3', txt: 'N.º 3 · 24 × 32 cm', precio: 9700 }, { id: 'n4', txt: 'N.º 4 · 28 × 38 cm', precio: 12200 }],
    descuento: 0, stock: 35, rango: 2, alta: 10, img: 'images/p-bandeja-dorada.webp', escena: ESC_SURTIDO,
    alt: 'Bandejas rectangulares doradas con borde festoneado, una pila y una suelta sobre mármol', desc: 'Cartón laminado dorado con el borde festoneado. Para masas finas, tartas rectangulares y la mesa dulce.' },
  { id: 'caja-torta-visor', nombre: 'Caja para torta con visor', cat: 'cajas', sub: 'tortas', term: 'blanco', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: '20x20x10', txt: '20 × 20 × 10 cm', precio: 8500 }, { id: '25x25x12', txt: '25 × 25 × 12 cm', precio: 10900 }, { id: '30x30x12', txt: '30 × 30 × 12 cm', precio: 13400 }],
    descuento: 0, stock: 30, rango: 3, alta: 9, img: 'images/p-caja-visor.webp', escena: null,
    alt: 'Caja blanca cuadrada con ventana en la tapa que deja ver una torta decorada con frutillas y arándanos', desc: 'Cartulina blanca con ventana transparente en la tapa, para mostrar la torta sin abrir la caja.' },
  { id: 'fuente-aluminio-rectangular', nombre: 'Fuente rectangular de aluminio con tapa', cat: 'fuentes', sub: 'carton', term: 'aluminio', pack: 25, medidaTipo: 'Capacidad',
    ops: [{ id: '750', txt: '750 cc', precio: 11300 }, { id: '1000', txt: '1.000 cc', precio: 13600 }, { id: '1700', txt: '1.700 cc', precio: 17900 }],
    descuento: 0, stock: 22, rango: 4, alta: 7, img: 'images/p-fuente-rectangular.webp', escena: ESC_FUENTES,
    alt: 'Fuentes rectangulares de aluminio con tapa de cartón laminado, apiladas sobre mármol', desc: 'Aluminio descartable con tapa de cartón laminado, que se cierra doblando el borde de la fuente.' },
  { id: 'bandeja-plateada-festoneada', nombre: 'Bandeja plateada rectangular festoneada', cat: 'bandejas', sub: 'plateadas', term: 'plateado', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: 'n2', txt: 'N.º 2 · 20 × 28 cm', precio: 7200 }, { id: 'n3', txt: 'N.º 3 · 24 × 32 cm', precio: 8900 }, { id: 'n4', txt: 'N.º 4 · 28 × 38 cm', precio: 11200 }],
    descuento: 10, stock: 28, rango: 5, alta: 6, img: 'images/p-bandeja-plateada.webp', escena: ESC_SURTIDO,
    alt: 'Bandejas rectangulares plateadas con borde festoneado, una pila y una suelta sobre fondo claro', desc: 'La misma bandeja festoneada, en plateado. Combina con tortas de crema y decoraciones en tonos fríos.' },
  { id: 'base-dorada-gruesa', nombre: 'Base dorada gruesa para tortas de pisos', cat: 'platos', sub: 'gruesas', term: 'dorado', pack: 5, medidaTipo: 'Diámetro',
    ops: [{ id: '25', txt: '25 cm', precio: 9800 }, { id: '30', txt: '30 cm', precio: 12900 }, { id: '35', txt: '35 cm', precio: 16200 }, { id: '40', txt: '40 cm', precio: 19900 }],
    descuento: 0, stock: 4, rango: 6, alta: 8, img: 'images/p-bases-gruesas.webp',
    escena: { src: 'images/vertical-bases.webp', forma: 'alta', alt: 'Bases doradas apiladas de mayor a menor sobre una mesada de mármol' },
    alt: 'Bases redondas doradas y gruesas, apiladas de mayor a menor sobre mármol', desc: 'Más gruesa y firme que el plato común, con el canto forrado en dorado. Va debajo de tortas de pisos y tortas altas.' },
  { id: 'caja-cupcakes', nombre: 'Caja para cupcakes con manija', cat: 'cajas', sub: 'porciones', term: 'blanco', pack: 25, medidaTipo: 'Tamaño',
    ops: [{ id: '4', txt: 'Para 4 cupcakes', precio: 14500 }, { id: '6', txt: 'Para 6 cupcakes', precio: 17800 }],
    descuento: 0, stock: 18, rango: 7, alta: 9, img: 'images/p-caja-cupcakes.webp', escena: ESC_CAJAS,
    alt: 'Caja blanca abierta con manija y separador, con cuatro cupcakes decorados adentro', desc: 'Con separador interno y manija para llevarla en la mano: los cupcakes viajan parados y sin tocarse.' },
  { id: 'fuente-tapa-plastico', nombre: 'Fuente de aluminio con tapa de plástico', cat: 'fuentes', sub: 'plastico', term: 'aluminio', pack: 25, medidaTipo: 'Capacidad',
    ops: [{ id: '1000', txt: '1.000 cc', precio: 15600 }, { id: '1500', txt: '1.500 cc', precio: 18700 }, { id: '2000', txt: '2.000 cc', precio: 22400 }],
    descuento: 0, stock: 20, rango: 8, alta: 10, img: 'images/p-fuente-tapa-plastico.webp', escena: ESC_SURTIDO,
    alt: 'Fuente rectangular de aluminio con tapa alta de plástico transparente, sobre fondo blanco', desc: 'Tapa de plástico transparente con domo, para que se vea lo que va adentro sin abrirla. Para brownies, budines y masas.' },
  { id: 'plato-dorado-festoneado', nombre: 'Plato dorado con borde festoneado', cat: 'platos', sub: 'redondos', term: 'dorado', pack: 10, medidaTipo: 'Diámetro',
    ops: [{ id: '24', txt: '24 cm', precio: 9600 }, { id: '28', txt: '28 cm', precio: 11800 }, { id: '32', txt: '32 cm', precio: 14300 }],
    descuento: 0, stock: 25, alta: 9, img: 'images/p-plato-festoneado.webp', escena: ESC_SURTIDO,
    alt: 'Platos dorados con borde festoneado apilados sobre una mesada de mármol', desc: 'El borde ondulado le da terminación de confitería sin agregar blonda. Cartón laminado dorado.' },
  { id: 'caja-macarons', nombre: 'Caja alargada para macarons', cat: 'cajas', sub: 'porciones', term: 'blanco', pack: 25, medidaTipo: 'Tamaño',
    ops: [{ id: '6', txt: 'Para 6 unidades', precio: 10800 }, { id: '12', txt: 'Para 12 unidades', precio: 13900 }],
    descuento: 0, stock: 16, alta: 8, img: 'images/p-caja-macarons.webp', escena: ESC_CAJAS,
    alt: 'Caja blanca alargada y abierta con macarons de colores en fila', desc: 'Caja alargada con tapa, para macarons, bombones o alfajores en fila.' },
  { id: 'plato-plateado-redondo', nombre: 'Plato plateado redondo para torta', cat: 'platos', sub: 'redondos', term: 'plateado', pack: 10, medidaTipo: 'Diámetro',
    ops: [{ id: '20', txt: '20 cm', precio: 6300 }, { id: '24', txt: '24 cm', precio: 7700 }, { id: '28', txt: '28 cm', precio: 9400 }],
    descuento: 0, stock: 30, alta: 7, img: 'images/p-plato-plateado.webp', escena: ESC_SURTIDO,
    alt: 'Pila de platos redondos plateados sobre una mesada de mármol', desc: 'La misma base que el plato dorado, en plateado. Para tortas de crema y decoraciones en tonos fríos.' },
  { id: 'fuente-aluminio-individual', nombre: 'Fuente individual de aluminio con tapa', cat: 'fuentes', sub: 'carton', term: 'aluminio', pack: 50, medidaTipo: 'Capacidad',
    ops: [{ id: '300', txt: '300 cc', precio: 12400 }, { id: '450', txt: '450 cc', precio: 14900 }],
    descuento: 0, stock: 14, alta: 6, img: 'images/p-fuente-individual.webp', escena: ESC_FUENTES,
    alt: 'Fuente chica rectangular de aluminio con tapa de cartón laminado', desc: 'Tamaño porción, para postres, flanes y budines individuales.' },
  { id: 'caja-tarta-visor', nombre: 'Caja baja para tarta con visor', cat: 'cajas', sub: 'tortas', term: 'blanco', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: '26x26x6', txt: '26 × 26 × 6 cm', precio: 9200 }, { id: '30x30x6', txt: '30 × 30 × 6 cm', precio: 11100 }],
    descuento: 0, stock: 20, alta: 5, img: 'images/p-caja-tarta.webp', escena: ESC_CAJAS,
    alt: 'Caja blanca baja con una ventana amplia que deja ver una tarta con merengue', desc: 'Más baja que la de torta, pensada para tartas, lemon pie y pastafrolas. Ventana amplia en la tapa.' },
  { id: 'fuente-aluminio-redonda', nombre: 'Fuente redonda de aluminio con tapa', cat: 'fuentes', sub: 'carton', term: 'aluminio', pack: 25, medidaTipo: 'Diámetro',
    ops: [{ id: '15', txt: 'Ø 15 cm', precio: 9900 }, { id: '18', txt: 'Ø 18 cm', precio: 12300 }],
    descuento: 0, stock: 18, alta: 5, img: 'images/p-fuente-redonda.webp', escena: ESC_FUENTES,
    alt: 'Fuente redonda de aluminio con tapa de cartón laminado, sobre mármol', desc: 'Redonda, con tapa de cartón laminado. Para tartas, pasteles y postres que salen del horno listos para entregar.' },
  { id: 'caja-lisa-torta', nombre: 'Caja blanca lisa para torta', cat: 'cajas', sub: 'tortas', term: 'blanco', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: '20x20x10', txt: '20 × 20 × 10 cm', precio: 6400 }, { id: '25x25x10', txt: '25 × 25 × 10 cm', precio: 7900 }, { id: '30x30x10', txt: '30 × 30 × 10 cm', precio: 9600 }],
    descuento: 15, stock: 24, alta: 4, img: 'images/p-caja-lisa.webp', escena: ESC_CAJAS,
    alt: 'Dos cajas blancas lisas apiladas sobre mármol', desc: 'Cartulina blanca sin ventana, para trasladar tortas y postres o personalizarla con tu etiqueta.' },
  { id: 'fuente-redonda-domo', nombre: 'Fuente redonda con tapa domo de plástico', cat: 'fuentes', sub: 'plastico', term: 'aluminio', pack: 25, medidaTipo: 'Diámetro',
    ops: [{ id: '18', txt: 'Ø 18 cm', precio: 16900 }, { id: '22', txt: 'Ø 22 cm', precio: 20800 }],
    descuento: 0, stock: 12, alta: 4, img: 'images/p-fuente-domo.webp', escena: ESC_SURTIDO,
    alt: 'Fuentes redondas de aluminio con tapa domo de plástico transparente, apiladas', desc: 'Tapa alta transparente que no aplasta la decoración. Para tartas, pies y postres con merengue o crema.' },
  { id: 'caja-rebatible-grande', nombre: 'Caja grande para torta con tapa rebatible', cat: 'cajas', sub: 'tortas', term: 'blanco', pack: 10, medidaTipo: 'Medida',
    ops: [{ id: '35x35x12', txt: '35 × 35 × 12 cm', precio: 14800 }, { id: '40x40x12', txt: '40 × 40 × 12 cm', precio: 17900 }],
    descuento: 0, stock: 3, alta: 3, img: 'images/p-caja-rebatible.webp', escena: ESC_SURTIDO,
    alt: 'Caja blanca grande abierta, con la tapa levantada y una torta con frutos rojos adentro', desc: 'La tapa se abre de un lado, para apoyar la torta desde arriba sin golpearla. Para tortas grandes y de cumpleaños.' },

  { id: 'blondas-doradas', nombre: 'Blondas caladas doradas', cat: 'platos', sub: 'redondos', term: 'dorado', pack: 100, medidaTipo: 'Diámetro',
    ops: [{ id: '20', txt: '20 cm', precio: 5200 }], descuento: 0, stock: 0, alta: 11, visible: false,
    img: 'images/p-plato-dorado.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], {
  tope: 100,
  texto: p => [
    CATEGORIAS.find(c => c.id === p.cat)?.nombre, CATEGORIAS.find(c => c.id === p.cat)?.subs.find(s => s.id === p.sub)?.nombre,
    SINONIMOS[p.cat], SINONIMOS[p.sub], SINONIMOS[p.term], `pack ${p.pack}`,
  ].join(' '),
});

function crearTienda(coleccion, { tope = 100, texto = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([p.nombre, p.desc, ...(p.ops || []).map(o => `${o.txt} ${o.id}`), texto(p)].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const finalDe = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100)) : precio);
  const desde = p => Math.min(...(p.ops || []).map(o => finalDe(p, o.precio)));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), term = lista(f.term), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (term.length && !term.includes(p.term)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const t = indice.get(p.id);
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
  function facetas(filtros = {}) {
    const terminaciones = {}, subs = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      terminaciones[p.term] = (terminaciones[p.term] || 0) + 1;
      subs[p.sub] = (subs[p.sub] || 0) + 1;
    });
    return { terminaciones, subs };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!id) return null;
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opDe = (p, op) => p?.ops?.find(o => o.id === op) || null;
const multi = p => (p?.ops || []).length > 1;
const opUnica = p => (multi(p) ? '' : p?.ops?.[0]?.id || '');
const precioFinal = (p, op) => {
  const o = opDe(p, op) || p.ops[0];
  return p.descuento > 0 ? Math.round(o.precio * (1 - p.descuento / 100)) : o.precio;
};
const precioDesde = p => Math.min(...p.ops.map(o => precioFinal(p, o.id)));
const opTxt = (p, op) => opDe(p, op)?.txt || '';
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = p => CATEGORIAS.find(c => c.id === p.cat);
const subDe = p => catDe(p)?.subs?.find(s => s.id === p.sub);
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const lineaTxt = (p, op) => `${p.nombre}${op ? ` (${opTxt(p, op)}, pack x${p.pack})` : ` (pack x${p.pack})`}`;

const Cart = {
  KEY: 'dorado_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  lineas() { return this.get().filter(i => { const p = getProducto(i.id); return p && opDe(p, i.op || opUnica(p)); }); },
  count() { return this.lineas().reduce((s, i) => s + i.qty, 0); },
  total() { return this.lineas().reduce((s, i) => s + precioFinal(getProducto(i.id), i.op || opUnica(getProducto(i.id))) * i.qty, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  caja: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p, op = '') {
  const o = opDe(p, op) || (multi(p) ? null : p.ops[0]);
  const final = o ? precioFinal(p, o.id) : precioDesde(p);
  const original = o ? o.precio : Math.min(...p.ops.map(x => x.precio));
  return `<p class="precio" data-precio>${o ? '' : '<span class="precio__desde">desde</span>'}<span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(final)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(original)}</s>` : ''}<span class="precio__unidad">pack x${p.pack} · ${formatearPrecio(final / p.pack)} c/u</span></p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.stock <= 5) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  else if (p.rango && p.rango <= 3) b.push('<span class="etiqueta">Más pedido</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar un pack"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar un pack"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function selHTML(p, valor = '') {
  if (!multi(p)) return '';
  return `<label class="var-sel"><span class="sr-only">${esc(p.medidaTipo)} de ${esc(p.nombre)}</span><select data-op><option value="">${esc(p.medidaTipo)}</option>${p.ops.map(o => `<option value="${esc(o.id)}"${o.id === valor ? ' selected' : ''}>${esc(o.txt)}</option>`).join('')}</select></label>`;
}
const metaDe = p => `${subDe(p)?.nombre || ''} · ${nombreDe(TERMINACIONES, p.term)}`;

function cardHTML(p, { compacta = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    const accion = multi(p)
      ? `<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir ${esc(p.medidaTipo.toLowerCase())} y agregar: ${nombre}">${ICON.carritoMas}</button>`
      : `<button type="button" class="prod-mini" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--compacta">
      ${media}
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}${accion}</div>
      </div>
    </article>`;
  }
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      ${precioHTML(p)}
      <div class="prod__elegir">${selHTML(p)}${stepperHTML(p.stock)}</div>
      <div class="prod-actions"><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}<span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button><button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button></div>
    </div>
  </article>`;
}
function filaHTML(p, animar = true) {
  const nombre = esc(p.nombre);
  const avisos = [p.descuento > 0 ? `<span class="fila__tag">-${p.descuento}%</span>` : '', p.stock <= 5 ? '<span class="fila__tag fila__tag--clara">Últimas unidades</span>' : ''].join('');
  return `<li class="fila"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : ''}>
    <a class="fila__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" width="200" height="200" decoding="async"></a>
    <div class="fila__info">
      <h3 class="fila__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p class="fila__meta">${esc(metaDe(p))}${avisos}</p>
      ${precioHTML(p)}
    </div>
    ${selHTML(p) || `<span class="var-unica">${esc(p.ops[0].txt)}</span>`}
    <div class="fila__acciones prod-actions">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al pedido: ${nombre}">${ICON.carritoMas}<span>Agregar</span></button></div>
  </li>`;
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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
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
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="52" height="52" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search--plegable');
  if (!btn || !form) return;
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8 }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello-wrap'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  hero.querySelectorAll('.hero__brillo').forEach(b => {
    tl.fromTo(b, { xPercent: -110, opacity: 1 }, { xPercent: 110, duration: 1.7, ease: 'power2.inOut', onComplete: () => gsap.set(b, { opacity: 0 }) }, 0.55);
  });
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
  document.querySelectorAll('[data-girar]').forEach(el => {
    gsap.to(el, { rotation: 140, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(box => {
    const vp = box.querySelector('.rail-vp');
    const track = box.querySelector('.rail-track');
    const sec = box.closest('section') || box;
    const prev = sec.querySelector('[data-rail-prev]');
    const next = sec.querySelector('[data-rail-next]');
    if (!vp || !track) return;
    const flechas = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    const paso = () => {
      const card = track.children[0];
      return card ? card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16) : vp.clientWidth * 0.8;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();

    let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
      }
      if (moved) vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      let destino = null;
      if (moved) {
        matar = true;
        setTimeout(() => { matar = false; }, 60);
        const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
        const posiciones = [...track.children].map(c => c.offsetLeft - inicio);
        if (posiciones.length) {
          const max = vp.scrollWidth - vp.clientWidth;
          destino = posiciones.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a));
          destino = Math.max(0, Math.min(destino, max));
        }
      }
      vp.classList.remove('dragging');
      if (destino !== null) vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
      pointerId = null; moved = false;
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
    vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const rail = document.getElementById('railPedidos');
  let enRail = [];
  if (rail) {
    const items = Tienda.consultar({ orden: 'destacados', limite: 8 }).items;
    enRail = items.map(p => p.id);
    rail.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  const grilla = document.getElementById('grillaPreview');
  if (grilla) {
    const items = Tienda.consultar({ orden: 'nuevos', filtros: { excluir: enRail }, limite: 8 }).items;
    grilla.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initListaHome() {
  const lista = document.getElementById('listaHome');
  const tabs = document.getElementById('tabsLista');
  if (!lista || !tabs) return;
  const grupos = [{ id: '', nombre: 'Más pedidos' }, ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.corto }))];
  let actual = '';
  tabs.innerHTML = grupos.map(g => `<button type="button" class="tab" data-tab="${g.id}" aria-pressed="${g.id === actual}">${esc(g.nombre)}${g.id ? ` <small>${Tienda.contar({ cat: g.id })}</small>` : ''}</button>`).join('');
  const verTodo = document.getElementById('listaVerTodo');
  const pintar = () => {
    const filtros = actual ? { cat: actual } : {};
    lista.innerHTML = Tienda.consultar({ filtros, orden: 'destacados', limite: 8 }).items.map(p => filaHTML(p)).join('');
    if (verTodo) {
      const cat = CATEGORIAS.find(c => c.id === actual);
      verTodo.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL;
      const t = verTodo.querySelector('span');
      if (t) t.textContent = cat ? `Ver los ${Tienda.contar(filtros)} productos de ${cat.nombre.toLowerCase()}` : `Ver la lista completa (${Tienda.contar({})} productos)`;
    }
    revelarNuevos(lista);
    refrescarTriggers();
  };
  pintar();
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b || b.dataset.tab === actual) return;
    actual = b.dataset.tab;
    tabs.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar();
  });
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = catDe(p);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt, forma: '' }];
  if (p.escena) fotos.push(p.escena);
  const f = fotos[QV.foto] || fotos[0];
  const msg = `Hola Dorado! Quiero consultar por ${p.nombre}${QV.op ? ` (${opTxt(p, QV.op)})` : ''}.`;
  const tipo = p.medidaTipo.toLowerCase();
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${f.forma ? ` qv__principal--${f.forma}` : ''}"><img src="${f.src}" alt="${esc(f.alt)}" width="1000" height="1000"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((x, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto en contexto' : 'Ver la foto del producto'}"><img src="${x.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}${sub ? ` · ${esc(sub.nombre)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        <div data-qv-precio>${precioHTML(p, QV.op)}</div>
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__datos"><dt>Presentación</dt><dd>Pack de ${p.pack} unidades</dd><dt>Terminación</dt><dd>${esc(nombreDe(TERMINACIONES, p.term))}</dd><dt>${esc(p.medidaTipo)}</dt><dd>${p.ops.map(o => esc(o.txt)).join(' · ')}</dd></dl>
        ${multi(p) ? `<div>
          <p class="qv__label" id="qvOpsTit">Elegí ${esc(tipo)}</p>
          <div class="qv__ops" role="group" aria-labelledby="qvOpsTit">${p.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o.id)}" aria-pressed="${QV.op === o.id}">${esc(o.txt)}<small>${formatearPrecio(precioFinal(p, o.id))}</small></button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}¿Necesitás otra medida o más cantidad? Consultanos</a>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">desde ${formatearPrecio(precioDesde(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: 'Dorado' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(o => precioFinal(p, o.id))), offerCount: p.ops.length, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = opDe(p, op) ? op : opUnica(p); QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const pr = modal.querySelector('[data-qv-precio]'); if (pr) pr.innerHTML = precioHTML(QV.p, QV.op);
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Dorado! Quiero consultar por ${QV.p.nombre} (${opTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (!QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí ${p.medidaTipo.toLowerCase()} para sumarlo al carrito.`;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${qty} ${qty === 1 ? 'pack' : 'packs'} de ${lineaTxt(p, QV.op)}.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || opUnica(p);
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="56" height="56">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(opTxt(p, op))} · pack x${p.pack} · ${formatearPrecio(precioFinal(p, op))}</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p, op) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function textoPedido(lineas) {
  return ['Hola Dorado! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    const op = i.op || opUnica(p);
    return `- ${i.qty} × ${lineaTxt(p, op)}: ${formatearPrecio(precioFinal(p, op) * i.qty)}`;
  }), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.lineas();
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.caja}<p>Tu carrito está vacío. ¿Arrancamos por los platos?</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas));
}
function renderPedido() {
  const panel = document.getElementById('pedidoPanel');
  if (!panel) return;
  const cuerpo = panel.querySelector('[data-pedido-lineas]');
  const foot = panel.querySelector('[data-pedido-foot]');
  const n = panel.querySelector('[data-pedido-n]');
  const lineas = Cart.lineas();
  const packs = lineas.reduce((s, i) => s + i.qty, 0);
  if (n) n.textContent = packs ? `${packs} ${packs === 1 ? 'pack' : 'packs'}` : 'Vacío';
  if (!lineas.length) {
    cuerpo.innerHTML = `<div class="pedido__vacio">${ICON.caja}<p>Todavía no sumaste productos. Elegí la medida y la cantidad en la lista y tocá «Agregar».</p></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  cuerpo.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  if (foot) foot.hidden = false;
  const total = panel.querySelector('[data-pedido-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = panel.querySelector('[data-pedido-wsp]');
  if (wsp) wsp.href = wspHref(textoPedido(lineas));
}
function manejarLinea(e) {
  const linea = e.target.closest('[data-linea]');
  if (!linea) return;
  const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
  const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
  if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
  if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
  if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  document.querySelectorAll('[data-checkout]').forEach(b => b.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.')));
  const panel = document.getElementById('pedidoPanel');
  if (panel) {
    panel.addEventListener('click', manejarLinea);
    renderPedido();
    document.addEventListener('cart:updated', renderPedido);
  }
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    manejarLinea(e);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const cont = add.closest('.prod, .fila');
      const sel = cont?.querySelector('[data-op]');
      const op = multi(p) ? (sel && sel.getClientRects().length ? sel.value : '') : opUnica(p);
      if (!op) {
        if (cont?.classList.contains('fila') && sel) {
          sel.focus();
          sel.classList.remove('falta'); void sel.offsetWidth; sel.classList.add('falta');
          showToast(`Elegí ${p.medidaTipo.toLowerCase()} de ${p.nombre.toLowerCase()} para sumarlo.`);
        } else abrirQV(p.id, add);
        return;
      }
      const stepper = cont?.querySelector('[data-stepper]');
      const qty = stepper && stepper.getClientRects().length ? Number(stepper.querySelector('output')?.textContent) || 1 : 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${qty} ${qty === 1 ? 'pack' : 'packs'} de ${lineaTxt(p, op)}.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const cont = comprar.closest('.prod');
      const op = multi(p) ? (cont?.querySelector('[data-op]')?.value || '') : opUnica(p);
      if (!op) { abrirQV(p.id, comprar); return; }
      const qty = Number(cont?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-op]');
    if (!sel) return;
    const cont = sel.closest('.prod, .fila');
    const p = getProducto(cont?.querySelector('[data-add]')?.dataset.add);
    if (!p) return;
    sel.classList.remove('falta');
    const pr = cont.querySelector('[data-precio]');
    if (pr) pr.outerHTML = precioHTML(p, sel.value);
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const multiples = (v, arr) => (v || '').split(',').filter(x => arr.some(y => y.id === x));
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], term: multiples(params.get('term'), TERMINACIONES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multiples(params.get('sub'), subsDe(e.cat)) : [];

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.term.length) f.term = e.term;
    if (e.oferta) f.oferta = true;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Familia</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    const terms = TERMINACIONES.filter(t => fac.terminaciones[t.id]);
    if (terms.length > 1) grupos.push(`<fieldset class="f-grupo"><legend>Terminación</legend><div class="f-terms">
      ${terms.map(t => `<label class="f-term"><input type="checkbox" name="term-${t.id}" value="${t.id}" data-f="term"${e.term.includes(t.id) ? ' checked' : ''}><i class="swatch swatch--${t.id}" aria-hidden="true"></i><span>${t.nombre}</span><small>${fac.terminaciones[t.id]}</small></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio del pack</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const titulo = sub ? sub.nombre : cat ? cat.nombre : e.oferta ? 'Ofertas' : 'Todo el catálogo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.oferta ? 'Productos con descuento, hasta agotar el stock de cada medida.' : 'Platos, bandejas, cajas y fuentes con tapa para tu pastelería. Elegí la medida y sumá los packs que necesitás.';
    document.title = `${titulo} — Dorado`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.term.forEach(v => quitar.push(['term', v, nombreDe(TERMINACIONES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'term', 'precio', 'oferta', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.term.length) u.searchParams.set('term', e.term.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  const tpl = MODELO === '2'
    ? p => filaHTML(p)
    : p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`;
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(tpl).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    if (!e.cat) e.sub = [];
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  document.querySelectorAll('.header-search input[name="q"]').forEach(i => { i.value = e.q; });
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta') e.oferta = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('header-search--plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.term = []; e.precio = ''; e.oferta = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta') e.oferta = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.sub = []; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = multiples(u.searchParams.get('sub'), subsDe(e.cat));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.term = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { cerrar(); form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); }
  };
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
}

function initGuia() {
  const box = document.getElementById('guia');
  if (!box) return;
  const chips = box.querySelector('[data-guia-chips]');
  const res = document.getElementById('guiaResultado');
  const diag = box.querySelector('.guia__diagrama');
  const leyenda = box.querySelector('[data-guia-leyenda]');
  const plato = getProducto('plato-dorado-redondo');
  const cajas = ['caja-torta-visor', 'caja-rebatible-grande'].map(getProducto).filter(Boolean);
  if (!chips || !res || !plato || !cajas.length) return;
  const num = s => parseFloat(String(s));
  const platos = plato.ops.map(o => ({ op: o.id, cm: num(o.id) })).sort((a, b) => a.cm - b.cm);
  const opcionesCaja = cajas.flatMap(c => c.ops.map(o => ({ p: c, op: o.id, lado: num(o.id) }))).sort((a, b) => a.lado - b.lado);
  const TORTAS = [16, 18, 20, 22, 24, 26, 28, 30];
  let actual = 24;
  chips.innerHTML = TORTAS.map(cm => `<button type="button" class="guia__chip" data-torta="${cm}" aria-pressed="${cm === actual}">${cm} cm</button>`).join('');
  const item = (p, op, rol) => `<li class="guia__item"><img src="${p.img}" alt="" width="56" height="56"><div><p class="guia__item-rol">${rol}</p><p class="guia__item-nom">${esc(p.nombre)}</p><p class="guia__item-med">${esc(opTxt(p, op))} · pack x${p.pack}</p></div><span class="guia__item-precio">${formatearPrecio(precioFinal(p, op))}</span></li>`;
  const elegir = cm => {
    const pl = platos.find(x => x.cm >= cm + 4) || platos[platos.length - 1];
    const cj = opcionesCaja.find(x => x.lado >= pl.cm) || opcionesCaja[opcionesCaja.length - 1];
    if (diag) {
      diag.style.setProperty('--kp', (pl.cm / cj.lado).toFixed(3));
      diag.style.setProperty('--kt', (cm / cj.lado).toFixed(3));
    }
    if (leyenda) leyenda.innerHTML = `<li><i class="guia__sw guia__sw--torta"></i>Torta de ${cm} cm</li><li><i class="guia__sw guia__sw--plato"></i>Plato de ${esc(opTxt(plato, pl.op))}</li><li><i class="guia__sw guia__sw--caja"></i>Caja de ${esc(opTxt(cj.p, cj.op))}</li>`;
    res.innerHTML = `
      <p class="guia__res-tit">Para tu torta de ${cm} cm</p>
      <ul class="guia__items">${item(plato, pl.op, 'Plato')}${item(cj.p, cj.op, 'Caja')}</ul>
      <div class="guia__acciones"><button type="button" class="btn btn--cta" data-guia-agregar>Agregar los dos al carrito</button><a class="btn btn--line" href="${CATALOGO_URL}?cat=cajas">Ver todas las cajas</a></div>`;
    res.querySelector('[data-guia-agregar]')?.addEventListener('click', () => {
      Cart.add(plato, 1, pl.op);
      Cart.add(cj.p, 1, cj.op);
      showToast(`Sumaste el plato de ${opTxt(plato, pl.op)} y la caja de ${opTxt(cj.p, cj.op)}.`);
    });
  };
  elegir(actual);
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-torta]');
    if (!b) return;
    actual = Number(b.dataset.torta);
    chips.querySelectorAll('[data-torta]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    elegir(actual);
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

document.addEventListener('cart:updated', updateCartBadge);

[initCatsMenu, initHome, initListaHome, initCatalogo, initGuia, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax, initRail,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
