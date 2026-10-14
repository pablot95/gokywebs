const WSP = '5491170178503';
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const MEDIDAS = {
  mujer: {
    etiquetas: ['Busto', 'Cintura', 'Cadera'],
    XS: ['80-84', '62-66', '86-90'], S: ['84-88', '66-70', '90-94'], M: ['88-94', '70-76', '94-100'],
    L: ['94-100', '76-82', '100-106'], XL: ['100-106', '82-88', '106-112'], XXL: ['106-114', '88-96', '112-120'], '3XL': ['114-122', '96-104', '120-128'],
  },
  varon: {
    etiquetas: ['Pecho', 'Cintura', 'Cadera'],
    XS: ['84-88', '70-74', '86-90'], S: ['88-94', '74-80', '90-96'], M: ['94-100', '80-86', '96-102'],
    L: ['100-106', '86-92', '102-108'], XL: ['106-112', '92-98', '108-114'], XXL: ['112-120', '98-106', '114-122'], '3XL': ['120-128', '106-114', '122-130'],
  },
};

const TELAS = [
  { id: 'arciel', nombre: 'Arciel', linea: 'La de todos los días', comp: '100 % poliéster', desc: 'Trama firme y liviana: es fresca, se seca rápido y no pierde la forma con los lavados.', ideal: 'guardias largas y uso diario', medidores: [1, 1, 3], foto: 't-arciel', alt: 'Muestras de tela en petróleo, gris, negro y bordó' },
  { id: 'spandex', nombre: 'Spandex', linea: 'Elastizada', comp: '95 % poliéster · 5 % spandex', desc: 'Estira y vuelve: acompaña cada movimiento sin tirar en hombros ni rodillas.', ideal: 'quienes se agachan, levantan y caminan todo el turno', medidores: [3, 2, 2], foto: 't-spandex', alt: 'Muestras de tela elastizada en azul marino, petróleo, gris y negro' },
  { id: 'microfibra', nombre: 'Microfibra', linea: 'La premium', comp: '92 % poliéster · 8 % spandex', desc: 'Tacto suave y caída prolija: se arruga menos y queda impecable todo el día.', ideal: 'consultorio y atención al público', medidores: [3, 3, 2], foto: 't-microfibra', alt: 'Muestras de microfibra en azul marino y petróleo' },
];
const MEDIDORES = ['Elasticidad', 'Suavidad', 'Frescura'];

const COLORES = [
  { id: 'marino', nombre: 'Azul marino', hex: '#1F2C4C', foto: 'p-chaqueta-recta-marino' },
  { id: 'francia', nombre: 'Azul francia', hex: '#2A55A8' },
  { id: 'celeste', nombre: 'Celeste', hex: '#9CBCE2' },
  { id: 'petroleo', nombre: 'Petróleo', hex: '#0F5A60', foto: 'p-chaqueta-recta-petroleo' },
  { id: 'salvia', nombre: 'Verde salvia', hex: '#6F8371', foto: 'c-salvia' },
  { id: 'gris', nombre: 'Gris', hex: '#9EA2A6', foto: 'p-chaqueta-recta-gris' },
  { id: 'negro', nombre: 'Negro', hex: '#1D1D1F', foto: 'p-chaqueta-recta-negro' },
  { id: 'bordo', nombre: 'Bordó', hex: '#6A1E2D', foto: 'p-chaqueta-recta-bordo' },
  { id: 'blanco', nombre: 'Blanco', hex: '#F3F4F1' },
  { id: 'lila', nombre: 'Lila', hex: '#B8A7D4' },
  { id: 'rosa', nombre: 'Rosa', hex: '#E4B3C1' },
  { id: 'chocolate', nombre: 'Chocolate', hex: '#5B4034' },
];

const CATEGORIAS = [
  { id: 'mujer', nombre: 'Mujer', titulo: 'Uniformes mujer', foto: 'cat-mujer' },
  { id: 'varon', nombre: 'Varón', titulo: 'Uniformes varón', foto: 'cat-varon' },
  { id: 'unisex', nombre: 'Unisex', titulo: 'Línea unisex', foto: 'cat-conjuntos' },
];
const SUBS = [
  { id: 'ambo', nombre: 'Ambos', uno: 'Ambo' },
  { id: 'chaqueta', nombre: 'Chaquetas', uno: 'Chaqueta' },
  { id: 'pantalon', nombre: 'Pantalones', uno: 'Pantalón' },
];

const LISTA = {
  ambo: { arciel: 64900, spandex: 89900, microfibra: 112900 },
  amboPlus: { spandex: 94900, microfibra: 118900 },
  amboBase: { arciel: 59900, spandex: 84900 },
  chaqueta: { arciel: 36900, spandex: 49900, microfibra: 62900 },
  chaquetaPlus: { spandex: 52900, microfibra: 65900 },
  chaquetaBase: { arciel: 33900, spandex: 46900 },
  pantalon: { arciel: 32900, spandex: 45900, microfibra: 57900 },
  pantalonPlus: { spandex: 48900, microfibra: 60900 },
  pantalonBase: { arciel: 29900, spandex: 42900 },
};
const DE = (a, b) => TALLES.slice(TALLES.indexOf(a), TALLES.indexOf(b) + 1);
const FOTOS_RECTA = c => ({ marino: `p-${c}-marino`, petroleo: `p-${c}-petroleo`, negro: `p-${c}-negro`, gris: `p-${c}-gris`, bordo: `p-${c}-bordo` });

const COLECCION = [
  { id: 'ambo-lucia', nombre: 'Ambo Lucía', cat: 'mujer', sub: 'ambo', img: 'p-ambo-lucia', alt: 'Ambo Lucía de mujer en azul marino, chaqueta entallada y pantalón cargo', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'bordo', 'lila', 'rosa'], precios: LISTA.amboPlus, talles: DE('XS', 'XXL'), stock: 24, destacado: true, desc: 'Chaqueta entallada con escote en V, pinzas y bolsillos plaqué; pantalón cargo con elástico en la espalda y bolsillos laterales.', tags: ['entallado', 'cargo', 'escote v'] },
  { id: 'ambo-tomas', nombre: 'Ambo Tomás', cat: 'varon', sub: 'ambo', img: 'p-ambo-tomas', alt: 'Ambo Tomás de varón en azul marino con escote en V y bolsillo en el pecho', color: 'marino', colores: ['marino', 'francia', 'celeste', 'negro', 'bordo', 'gris', 'blanco'], precios: LISTA.ambo, talles: DE('S', '3XL'), stock: 30, destacado: true, desc: 'Corte recto clásico: chaqueta con escote en V y bolsillo en el pecho, pantalón recto con cintura elastizada y bolsillo lateral.', tags: ['recto', 'clasico'] },
  { id: 'ambo-sofia', nombre: 'Ambo jogger Sofía', cat: 'mujer', sub: 'ambo', img: 'p-ambo-sofia', alt: 'Ambo jogger Sofía de mujer en petróleo con cordón gris en la cintura', color: 'petroleo', colores: ['petroleo', 'marino', 'salvia', 'negro', 'lila', 'rosa'], precios: LISTA.amboPlus, talles: DE('XS', 'XL'), stock: 16, destacado: true, nuevo: true, desc: 'Chaqueta con escote en V y bolsillo al pecho; pantalón jogger con puño, cordón de color y bolsillos cargo.', tags: ['jogger', 'cordon', 'puño'] },
  { id: 'ambo-martin', nombre: 'Ambo cargo Martín', cat: 'varon', sub: 'ambo', img: 'p-ambo-martin', alt: 'Ambo cargo Martín de varón en verde salvia con bolsillo en el pecho', color: 'salvia', colores: ['salvia', 'marino', 'negro', 'gris', 'petroleo', 'chocolate'], precios: LISTA.amboPlus, talles: DE('S', '3XL'), stock: 18, destacado: true, nuevo: true, desc: 'Chaqueta con canesú, bolsillo al pecho y dos bolsillos bajos; pantalón cargo de bota recta con bolsillos laterales con tapa.', tags: ['cargo', 'canesu'] },
  { id: 'ambo-clara', nombre: 'Ambo Clara', cat: 'mujer', sub: 'ambo', img: 'p-ambo-clara', alt: 'Ambo Clara de mujer en azul marino, chaqueta con tres bolsillos y pantalón recto', color: 'marino', colores: ['marino', 'francia', 'celeste', 'blanco', 'bordo', 'negro', 'gris'], precios: LISTA.ambo, talles: DE('XS', '3XL'), stock: 28, destacado: true, desc: 'El clásico de consultorio: chaqueta con escote en V y tres bolsillos, pantalón recto con cintura elastizada.', tags: ['clasico', 'recto', 'tres bolsillos'] },
  { id: 'chaqueta-recta', nombre: 'Chaqueta Recta', cat: 'unisex', sub: 'chaqueta', img: 'p-chaqueta-recta-marino', alt: 'Chaqueta Recta unisex doblada, escote en V y bolsillo al pecho', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'gris', 'bordo', 'celeste', 'francia', 'blanco'], fotos: FOTOS_RECTA('chaqueta-recta'), precios: LISTA.chaqueta, talles: DE('XS', '3XL'), stock: 40, destacado: true, desc: 'Chaqueta unisex de corte recto con escote en V reforzado y bolsillo al pecho. Combina con cualquier pantalón de la línea.', tags: ['basica', 'escote v'] },
  { id: 'ambo-recto', nombre: 'Ambo Recto', cat: 'unisex', sub: 'ambo', img: 'p-ambo-recto', alt: 'Ambos Recto doblados en azul marino, petróleo, negro, gris y bordó', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'gris', 'bordo', 'celeste', 'francia', 'blanco'], precios: LISTA.ambo, talles: DE('XS', '3XL'), stock: 36, destacado: true, desc: 'Chaqueta recta con bolsillo al pecho y pantalón con cintura elástica y cordón. El ambo unisex que va con todo.', tags: ['unisex', 'cordon', 'basico'] },
  { id: 'pantalon-recto', nombre: 'Pantalón Recto con cordón', cat: 'unisex', sub: 'pantalon', img: 'p-pantalon-recto-marino', alt: 'Pantalón Recto con cordón doblado, cintura elástica y bolsillo', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'gris', 'bordo', 'celeste', 'francia', 'blanco'], fotos: FOTOS_RECTA('pantalon-recto'), precios: LISTA.pantalon, talles: DE('XS', '3XL'), stock: 38, destacado: true, desc: 'Cintura elástica con cordón, bolsillo lateral y bota recta. Se suma a cualquier chaqueta de la línea.', tags: ['cordon', 'basico'] },
  { id: 'chaqueta-lucia', nombre: 'Chaqueta Lucía', cat: 'mujer', sub: 'chaqueta', img: 'p-chaqueta-lucia', alt: 'Chaqueta Lucía entallada en azul marino con pinzas y bolsillos plaqué', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'bordo', 'lila', 'rosa'], precios: LISTA.chaquetaPlus, talles: DE('XS', 'XXL'), stock: 20, desc: 'Entallada, con escote en V, pinzas al frente, bolsillos plaqué y detalle de costura en los hombros.', tags: ['entallada', 'escote v'] },
  { id: 'pantalon-tomas', nombre: 'Pantalón Tomás', cat: 'varon', sub: 'pantalon', img: 'p-pantalon-tomas', alt: 'Pantalón Tomás de varón en azul marino con bolsillo cargo lateral', color: 'marino', colores: ['marino', 'francia', 'celeste', 'negro', 'bordo', 'gris', 'blanco'], precios: LISTA.pantalon, talles: DE('S', '3XL'), stock: 22, desc: 'Bota recta, cintura elastizada con pasacinto y bolsillo lateral con tapa.', tags: ['recto'] },
  { id: 'jogger-sofia', nombre: 'Pantalón jogger Sofía', cat: 'mujer', sub: 'pantalon', img: 'p-jogger-sofia', alt: 'Pantalón jogger Sofía en petróleo con cordón gris y bolsillo cargo', color: 'petroleo', colores: ['petroleo', 'marino', 'salvia', 'negro', 'lila', 'rosa'], precios: LISTA.pantalonPlus, talles: DE('XS', 'XL'), stock: 14, nuevo: true, desc: 'Jogger con puño en el tobillo, cintura con cordón de color y bolsillos cargo.', tags: ['jogger', 'cordon', 'puño'] },
  { id: 'chaqueta-martin', nombre: 'Chaqueta Martín', cat: 'varon', sub: 'chaqueta', img: 'p-chaqueta-martin', alt: 'Chaqueta Martín de varón en verde salvia con canesú y bolsillo al pecho', color: 'salvia', colores: ['salvia', 'marino', 'negro', 'gris', 'petroleo', 'chocolate'], precios: LISTA.chaquetaPlus, talles: DE('S', '3XL'), stock: 15, nuevo: true, desc: 'Canesú en la espalda, bolsillo al pecho con presilla y dos bolsillos bajos.', tags: ['canesu'] },
  { id: 'chaqueta-clara', nombre: 'Chaqueta Clara', cat: 'mujer', sub: 'chaqueta', img: 'p-chaqueta-clara', alt: 'Chaqueta Clara de mujer en azul marino con tres bolsillos', color: 'marino', colores: ['marino', 'francia', 'celeste', 'blanco', 'bordo', 'negro', 'gris'], precios: LISTA.chaqueta, talles: DE('XS', '3XL'), stock: 26, desc: 'Escote en V, bolsillo al pecho y dos bolsillos bajos. Corte suelto, cómoda para todo el día.', tags: ['clasica', 'tres bolsillos'] },
  { id: 'ambo-clasico', nombre: 'Ambo Clásico', cat: 'unisex', sub: 'ambo', img: 'p-ambo-clasico', alt: 'Chaquetas del Ambo Clásico colgadas en azul marino, petróleo, gris, negro, bordó y celeste', color: 'marino', colores: ['marino', 'petroleo', 'gris', 'negro', 'bordo', 'celeste'], precios: LISTA.amboBase, talles: DE('XS', '3XL'), stock: 32, desc: 'Chaqueta con tres bolsillos y pantalón recto. El básico para equipos y para tener de recambio.', tags: ['basico', 'equipos', 'tres bolsillos'] },
  { id: 'pantalon-lucia', nombre: 'Pantalón cargo Lucía', cat: 'mujer', sub: 'pantalon', img: 'p-pantalon-lucia', alt: 'Pantalón cargo Lucía en azul marino con bolsillos laterales', color: 'marino', colores: ['marino', 'petroleo', 'negro', 'bordo', 'lila', 'rosa'], precios: LISTA.pantalonPlus, talles: DE('XS', 'XXL'), stock: 19, desc: 'Cargo de bota recta con elástico en la espalda y bolsillos laterales con tapa.', tags: ['cargo'] },
  { id: 'chaqueta-tomas', nombre: 'Chaqueta Tomás', cat: 'varon', sub: 'chaqueta', img: 'p-chaqueta-tomas', alt: 'Chaqueta Tomás de varón en azul marino con escote en V', color: 'marino', colores: ['marino', 'francia', 'celeste', 'negro', 'bordo', 'gris', 'blanco'], precios: LISTA.chaqueta, talles: DE('S', '3XL'), stock: 25, desc: 'Recta, con escote en V, bolsillo al pecho para la lapicera y dos bolsillos bajos.', tags: ['recta', 'clasica'] },
  { id: 'pantalon-clasico', nombre: 'Pantalón Clásico', cat: 'unisex', sub: 'pantalon', img: 'p-pantalon-clasico', alt: 'Pantalones Clásico doblados y apilados en seis colores', color: 'marino', colores: ['marino', 'petroleo', 'gris', 'negro', 'bordo', 'celeste'], precios: LISTA.pantalonBase, talles: DE('XS', '3XL'), stock: 3, desc: 'Recto, con cintura elastizada y dos bolsillos. Se combina con la Chaqueta Clásica.', tags: ['basico', 'equipos'] },
  { id: 'pantalon-clara', nombre: 'Pantalón recto Clara', cat: 'mujer', sub: 'pantalon', img: 'p-pantalon-clara', alt: 'Pantalón recto Clara de mujer en azul marino', color: 'marino', colores: ['marino', 'francia', 'celeste', 'blanco', 'bordo', 'negro', 'gris'], precios: LISTA.pantalon, talles: DE('XS', '3XL'), stock: 24, desc: 'Bota recta, tiro medio y cintura elastizada, con bolsillo lateral.', tags: ['recto'] },
  { id: 'pantalon-martin', nombre: 'Pantalón cargo Martín', cat: 'varon', sub: 'pantalon', img: 'p-pantalon-martin', alt: 'Pantalón cargo Martín de varón en verde salvia', color: 'salvia', colores: ['salvia', 'marino', 'negro', 'gris', 'petroleo', 'chocolate'], precios: LISTA.pantalonPlus, talles: DE('S', '3XL'), stock: 17, desc: 'Cargo de bota recta con bolsillos laterales con tapa y cintura con pasacinto.', tags: ['cargo'] },
  { id: 'chaqueta-clasica', nombre: 'Chaqueta Clásica', cat: 'unisex', sub: 'chaqueta', img: 'p-chaqueta-clasica', alt: 'Chaqueta Clásica en azul marino colgada en una percha, con tres bolsillos', color: 'marino', colores: ['marino', 'petroleo', 'gris', 'negro', 'bordo', 'celeste'], precios: LISTA.chaquetaBase, talles: DE('XS', '3XL'), stock: 30, desc: 'Escote en V, bolsillo al pecho y dos bolsillos bajos. Corte recto que les queda bien a todos.', tags: ['basica', 'equipos', 'tres bolsillos'] },
];

const TOPE_CONSULTA = 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const preciosDe = p => Object.values(p.precios || {});
const precioDesde = p => Math.min(...preciosDe(p));

function crearTienda(coleccion, { lote = TOPE_CONSULTA } = {}) {
  const docs = coleccion.map((p, i) => Object.freeze({ ...p, _orden: i }));
  const porId = new Map(docs.map(p => [p.id, p]));
  const textos = new Map(docs.map(p => [p.id, normalizar([
    p.nombre, p.desc, CATEGORIAS.find(c => c.id === p.cat)?.nombre, SUBS.find(s => s.id === p.sub)?.nombre, SUBS.find(s => s.id === p.sub)?.uno,
    ...(p.colores || []).map(c => COLORES.find(x => x.id === c)?.nombre), ...Object.keys(p.precios || {}).map(t => TELAS.find(x => x.id === t)?.nombre),
    ...(p.tags || []), ...(p.talles || []).map(t => 'talle ' + t),
  ].join(' '))]));
  const ordenes = {
    destacados: (a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a._orden - b._orden,
    'precio-asc': (a, b) => precioDesde(a) - precioDesde(b) || a._orden - b._orden,
    'precio-desc': (a, b) => precioDesde(b) - precioDesde(a) || a._orden - b._orden,
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a._orden - b._orden,
  };
  const indices = {};
  const indice = orden => (indices[orden] ||= docs.filter(p => p.visible !== false).sort(ordenes[orden]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);
  let lotesLeidos = 0;

  function coincide(p, f = {}) {
    if (p.visible === false) return false;
    if (f.destacado && !p.destacado) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.excluir && p.id === f.excluir) return false;
    const cat = lista(f.cat); if (cat.length && !cat.includes(p.cat)) return false;
    const sub = lista(f.sub); if (sub.length && !sub.includes(p.sub)) return false;
    const tela = lista(f.tela); if (tela.length && !tela.some(t => p.precios?.[t])) return false;
    const talle = lista(f.talle); if (talle.length && !talle.some(t => p.talles?.includes(t))) return false;
    const color = lista(f.color); if (color.length && !color.some(c => p.colores?.includes(c))) return false;
    if (f.q) {
      const palabras = normalizar(f.q).split(/\s+/).filter(Boolean);
      const texto = textos.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  const copia = p => {
    const { _orden, ...resto } = p;
    return { ...resto, colores: [...(p.colores || [])], talles: [...(p.talles || [])], tags: [...(p.tags || [])], precios: { ...p.precios }, fotos: p.fotos ? { ...p.fotos } : undefined };
  };

  return {
    consultarProductos({ filtros = {}, orden = 'destacados', cursor = null, limite = TOPE_CONSULTA } = {}) {
      const tope = Math.min(Math.max(1, Math.floor(Number(limite)) || TOPE_CONSULTA), TOPE_CONSULTA);
      const base = indice(ordenes[orden] ? orden : 'destacados');
      let desde = 0;
      if (cursor != null) {
        const k = base.findIndex(p => p.id === cursor);
        if (k < 0) { lotesLeidos = 0; return { items: [], siguiente: null }; }
        desde = k + 1;
      }
      const items = [];
      let fin = desde;
      lotesLeidos = 0;
      while (fin < base.length && items.length < tope) {
        lotesLeidos++;
        const bloque = base.slice(fin, fin + lote);
        let k = 0;
        for (; k < bloque.length && items.length < tope; k++) if (coincide(bloque[k], filtros)) items.push(bloque[k]);
        fin += k;
      }
      const siguiente = items.length === tope && fin < base.length ? items[items.length - 1].id : null;
      return { items: items.map(copia), siguiente };
    },
    contar({ filtros = {} } = {}) {
      return indice('destacados').reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
    },
    obtenerProducto(id) {
      const p = porId.get(id);
      return p && p.visible !== false ? copia(p) : null;
    },
    ultimaLectura: () => lotesLeidos,
  };
}

const Tienda = crearTienda(COLECCION);
const consultarProductos = opciones => Tienda.consultarProductos(opciones);
const contar = filtros => Tienda.contar({ filtros });
const obtenerProducto = id => Tienda.obtenerProducto(id);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getSub = id => SUBS.find(s => s.id === id);
const getTela = id => TELAS.find(t => t.id === id);
const getColor = id => COLORES.find(c => c.id === id);
const telasDe = p => TELAS.filter(t => p.precios?.[t.id]);
const precioDe = (p, tela) => p?.precios?.[tela] ?? null;
const fotoDe = (p, color) => p.fotos?.[color] || p.img;
const intentar = fn => { try { fn(); return true; } catch { return false; } };

const Cart = {
  KEY: 'ambosjos_cart',
  valida(i) {
    const p = obtenerProducto(i.id);
    return !!p && Number.isFinite(i.qty) && i.qty > 0 && p.talles.includes(i.talle) && p.colores.includes(i.color) && !!p.precios[i.tela];
  },
  get() {
    try {
      const items = JSON.parse(localStorage.getItem(this.KEY)) || [];
      return Array.isArray(items) ? items.filter(i => this.valida(i)) : [];
    } catch { return []; }
  },
  save(items) {
    intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items)));
    if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  igual: (a, b) => a.id === b.id && a.talle === b.talle && a.color === b.color && a.tela === b.tela,
  add(producto, qty = 1, { talle, color, tela } = {}) {
    const linea = { id: producto.id, talle, color, tela, qty: Math.max(1, Math.floor(qty) || 1) };
    if (!this.valida(linea)) return false;
    const items = this.get();
    const tope = producto.stock ?? 99;
    const existing = items.find(i => this.igual(i, linea));
    if (existing) existing.qty = Math.min(existing.qty + linea.qty, tope);
    else items.push({ ...linea, qty: Math.min(linea.qty, tope) });
    this.save(items);
    return true;
  },
  setQty(clave, qty) {
    const items = this.get(); const it = items.find(i => this.igual(i, clave)); if (!it) return;
    const p = obtenerProducto(it.id); it.qty = Math.max(1, Math.min(Math.floor(qty) || 1, p?.stock ?? 99)); this.save(items);
  },
  remove(clave) { this.save(this.get().filter(i => !this.igual(i, clave))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + (precioDe(obtenerProducto(i.id), i.tela) || 0) * i.qty, 0); },
};

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const HOME_ANCLA = PAGINA === 'home' ? '' : MODELO === '2' ? 'modelo-2.html' : 'index.html';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  subirChico: 'data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(48px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICON_PERCHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2c0 1-1 1.4-2 2.2v1.3m0 0L3.3 15.4A1.2 1.2 0 0 0 4 17.6h16a1.2 1.2 0 0 0 .7-2.2L12 9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

function lineaTexto(p) {
  return `${getCategoria(p.cat)?.nombre || ''} · ${getSub(p.sub)?.uno || ''}`;
}

function badgesHTML(p) {
  let b = '';
  if (p.stock <= 0) b = '<span class="badge badge--agotado">Sin stock</span>';
  else if (p.nuevo) b = '<span class="badge badge--nuevo">Nuevo</span>';
  else if (p.stock <= 3) b = '<span class="badge badge--ultimas">Últimas unidades</span>';
  return b ? `<span class="badges">${b}</span>` : '';
}

function dotsHTML(p) {
  const max = 5;
  const vis = p.colores.slice(0, max);
  const resto = p.colores.length - vis.length;
  return `<p class="dots"><span class="sr-only">${p.colores.length} colores: ${p.colores.map(c => getColor(c)?.nombre).join(', ')}</span>${vis.map(c => `<i style="--c:${getColor(c)?.hex}" aria-hidden="true"></i>`).join('')}${resto > 0 ? `<b aria-hidden="true">+${resto}</b>` : ''}</p>`;
}

function precioCardHTML(p, tela) {
  const v = tela && precioDe(p, tela);
  if (v) return `<p class="prod__precio"><span class="precio">${formatearPrecio(v)}</span><span class="prod__tela">en ${esc(getTela(tela)?.nombre)}</span></p>`;
  return `<p class="prod__precio"><span class="prod__desde">Desde</span> <span class="precio">${formatearPrecio(precioDesde(p))}</span></p>`;
}

function stepperHTML(p, label, valor = 1) {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="${valor}" min="1" max="${p.stock}" inputmode="numeric" aria-label="${esc(label)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>`;
}

function cardHTML(p, { animar = true, tela = null } = {}) {
  const agotado = p.stock <= 0;
  return `<article class="prod" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
    <div class="prod__media">
      <button class="prod__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"></span></button>
      ${badgesHTML(p)}
      <span class="prod__telas" aria-hidden="true">${telasDe(p).length} ${telasDe(p).length === 1 ? 'tela' : 'telas'}</span>
    </div>
    <div class="prod__info">
      <p class="prod__linea">${esc(lineaTexto(p))}</p>
      <h3 class="prod__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      ${dotsHTML(p)}
      ${precioCardHTML(p, tela)}
      ${agotado
        ? `<a class="btn btn--line prod-aviso" href="${wa('Hola! ¿Cuándo vuelve a entrar el ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`
        : `<div class="prod-actions">
        ${stepperHTML(p, 'Cantidad de ' + p.nombre)}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON_CARRITO}<span class="prod-add__txt">Agregar<span class="add-extra"> al carrito</span></span></button>
      </div>
      <button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function contarCat(cat, sub) {
  const f = { cat: [cat] };
  if (sub) f.sub = [sub];
  return contar(f);
}

function renderMenus() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') || '' : '';
  const total = contar({});
  document.querySelectorAll('[data-cat-menu]').forEach(cont => {
    cont.innerHTML = `<div class="drop-cols">${CATEGORIAS.map(c => `<div class="drop-col">
        <a class="drop-col__cat" href="${CATALOGO}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><span class="drop-col__img"><img src="images/${c.foto}.webp" alt="" width="1000" height="1000"></span><span>${esc(c.nombre)} <small>${contarCat(c.id)}</small></span></a>
        <ul>${SUBS.map(s => { const n = contarCat(c.id, s.id); return n ? `<li><a href="${CATALOGO}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)} <small>${n}</small></a></li>` : ''; }).join('')}</ul>
      </div>`).join('')}
      <div class="drop-col drop-col--telas"><p class="drop-col__titulo">Por tela</p><ul>${TELAS.map(t => `<li><a href="${CATALOGO}?tela=${t.id}">${esc(t.nombre)} <small>${contar({ tela: [t.id] })}</small></a></li>`).join('')}</ul></div>
    </div>
    <a class="drop-todo" href="${CATALOGO}">Ver todo el catálogo (${total} prendas) ${ICON_FLECHA}</a>`;
  });
  document.querySelectorAll('[data-cat-links]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.titulo)}</a></li>`).join('') + `<li><a href="${CATALOGO}">Todo el catálogo</a></li>`;
  });
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = contarCat(el.dataset.cuentaCat); });
  document.querySelectorAll('[data-total-catalogo]').forEach(el => { el.textContent = total; });
}

function renderHome() {
  const grid = document.getElementById('gridDestacados');
  if (!grid) return;
  const { items } = consultarProductos({ filtros: { destacado: true }, limite: 8 });
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

const Catalogo = {
  estado: { cat: [], sub: [], tela: [], talle: [], color: [], q: '', orden: 'destacados' },
  PASO: 16, cursor: null, pintados: 0, total: 0, pedido: 0,
};
const FILTROS = ['cat', 'sub', 'tela', 'talle', 'color'];
const VALIDOS = {
  cat: () => CATEGORIAS.map(c => c.id), sub: () => SUBS.map(s => s.id), tela: () => TELAS.map(t => t.id),
  talle: () => TALLES, color: () => COLORES.map(c => c.id),
};
const ORDENES_UI = { destacados: 'Destacados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const e = Catalogo.estado;
  FILTROS.forEach(k => { e[k] = (p.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k]().includes(v)); });
  e.q = (p.get('q') || '').trim().slice(0, 60);
  e.orden = Object.keys(ORDENES_UI).includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  FILTROS.forEach(k => { if (e[k].length) p.set(k, e[k].join(',')); });
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  syncLinkModelo();
}

function syncLinkModelo() {
  if (PAGINA !== 'catalogo') return;
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro) return;
  const p = new URLSearchParams(location.search);
  p.delete('producto');
  const qs = p.toString();
  otro.setAttribute('href', otro.getAttribute('href').split('?')[0] + (qs ? '?' + qs : ''));
}

const filtrosActivos = () => FILTROS.reduce((n, k) => n + Catalogo.estado[k].length, 0);
const nombreFiltro = (k, v) => ({ cat: getCategoria(v)?.nombre, sub: getSub(v)?.nombre, tela: getTela(v)?.nombre, talle: `Talle ${v}`, color: getColor(v)?.nombre }[k]);

function tituloCatalogo() {
  const e = Catalogo.estado;
  const cat = e.cat.length === 1 ? getCategoria(e.cat[0]) : null;
  const sub = e.sub.length === 1 ? getSub(e.sub[0]) : null;
  if (cat && sub) return `${sub.nombre} de ${cat.nombre.toLowerCase() === 'unisex' ? 'la línea unisex' : cat.nombre.toLowerCase()}`;
  if (cat) return cat.titulo;
  if (sub) return sub.nombre;
  if (e.tela.length === 1) return `Prendas en ${getTela(e.tela[0]).nombre}`;
  if (e.color.length === 1) return `Prendas en ${getColor(e.color[0]).nombre.toLowerCase()}`;
  if (e.talle.length === 1) return `Prendas en talle ${e.talle[0]}`;
  return 'Catálogo completo';
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => { inp.checked = (e[inp.dataset.f] || []).includes(inp.value); });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  const badge = document.getElementById('filtrosN');
  if (badge) badge.textContent = n ? `(${n})` : '';
  const titulo = tituloCatalogo();
  const h1 = document.getElementById('catTitulo');
  if (h1) h1.textContent = titulo;
  const miga = document.getElementById('migaCat');
  if (miga) { const hay = titulo !== 'Catálogo completo'; miga.hidden = !hay; miga.textContent = hay ? titulo : ''; }
  document.title = `${titulo === 'Catálogo completo' ? 'Catálogo' : titulo} — Ambosjos`;
  document.querySelectorAll('#catPills a').forEach(a => {
    const id = a.dataset.pill;
    const activo = id ? e.cat.length === 1 && e.cat[0] === id : !e.cat.length;
    if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-cat-menu] .drop-col__cat').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (e.cat.length === 1 && id === e.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = FILTROS.flatMap(k => e[k].map(v => ({ f: k, v, t: nombreFiltro(k, v) })));
    if (e.q) items.push({ f: 'q', v: e.q, t: `«${e.q}»` });
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('')
      + (items.length ? '<button type="button" class="chip chip--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  }
}

function filtrosCatalogo() {
  const e = Catalogo.estado;
  return { cat: e.cat, sub: e.sub, tela: e.tela, talle: e.talle, color: e.color, q: e.q };
}

function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = filtrosCatalogo();
  if (reiniciar) {
    Catalogo.cursor = null; Catalogo.pintados = 0;
    Catalogo.total = contar(filtros);
    grid.innerHTML = '';
  }
  const pedirMas = reiniciar || Catalogo.cursor;
  if (pedirMas) {
    const { items, siguiente } = consultarProductos({ filtros, orden: e.orden, cursor: Catalogo.cursor, limite: Catalogo.PASO });
    const telaActiva = e.tela.length === 1 ? e.tela[0] : null;
    grid.insertAdjacentHTML('beforeend', items.map(p => cardHTML(p, { tela: telaActiva })).join(''));
    Catalogo.pintados += items.length;
    Catalogo.cursor = siguiente;
  }
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'prenda' : 'prendas'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    const faltan = Math.max(0, Catalogo.total - Catalogo.pintados);
    mas.hidden = !Catalogo.cursor || !faltan;
    mas.textContent = `Ver más prendas (${faltan})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const caja = (f, v, txt, n, extra = '') => `<label class="f-check"><input type="checkbox" data-f="${f}" value="${v}">${extra}<span>${esc(txt)}</span><span class="f-n">${n}</span></label>`;
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => caja('cat', c.id, c.nombre, contar({ cat: [c.id] }))).join('');
  const fSub = document.getElementById('fSub');
  if (fSub) fSub.innerHTML = SUBS.map(s => caja('sub', s.id, s.nombre, contar({ sub: [s.id] }))).join('');
  const fTela = document.getElementById('fTela');
  if (fTela) fTela.innerHTML = TELAS.map(t => caja('tela', t.id, t.nombre, contar({ tela: [t.id] }))).join('');
  const fTalle = document.getElementById('fTalle');
  if (fTalle) fTalle.innerHTML = TALLES.map(t => `<label class="f-talle"><input type="checkbox" data-f="talle" value="${t}" aria-label="Talle ${t}"><span aria-hidden="true">${t}</span></label>`).join('');
  const fColor = document.getElementById('fColor');
  if (fColor) fColor.innerHTML = COLORES.map(c => `<label class="f-color" title="${esc(c.nombre)}"><input type="checkbox" data-f="color" value="${c.id}" aria-label="${esc(c.nombre)}"><span class="f-color__sw" style="--c:${c.hex}" aria-hidden="true"></span><span class="f-color__n">${esc(c.nombre)}</span></label>`).join('');
  const pills = document.getElementById('catPills');
  if (pills) pills.innerHTML = `<a href="${CATALOGO}" data-pill="">Todo</a>` + CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}" data-pill="${c.id}">${esc(c.nombre)}</a>`).join('');

  leerURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
  syncLinkModelo();

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const e = Catalogo.estado; const f = inp.dataset.f;
    e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
    aplicarCambioCatalogo();
  });
  const form = document.getElementById('buscadorForm');
  const buscar = document.getElementById('buscar');
  let t = 0;
  form?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); });
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 260);
  });
  document.getElementById('orden')?.addEventListener('change', ev => { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); });
  document.addEventListener('click', ev => {
    const quitar = ev.target.closest('[data-quitar]');
    if (quitar) {
      const e = Catalogo.estado; const f = quitar.dataset.quitar; const v = quitar.dataset.valor;
      if (f === 'q') e.q = ''; else e[f] = e[f].filter(x => x !== v);
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      Object.assign(Catalogo.estado, { cat: [], sub: [], tela: [], talle: [], color: [], q: '' });
      aplicarCambioCatalogo();
      return;
    }
    const pill = ev.target.closest('#catPills a');
    if (pill) {
      ev.preventDefault();
      Catalogo.estado.cat = pill.dataset.pill ? [pill.dataset.pill] : [];
      aplicarCambioCatalogo();
    }
  });
  document.getElementById('verMas')?.addEventListener('click', () => cargarCatalogo(false));
  initFiltrosDrawer();
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const abrir = document.getElementById('filtrosOpen');
  if (!panel || !abrir) return;
  const esDrawer = () => MODELO === '2' || !window.matchMedia('(min-width: 1025px)').matches;
  let bd = null;
  const cerrar = (foco = true) => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd?.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (bd) bd.hidden = true; }, 300);
    if (foco) abrir.focus();
  };
  const open = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; bd.hidden = true; document.body.appendChild(bd); bd.addEventListener('click', () => cerrar()); }
    bd.hidden = false;
    requestAnimationFrame(() => bd.classList.add('open'));
    panel.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  abrir.addEventListener('click', open);
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
  panel.addEventListener('keydown', e => {
    if (!esDrawer() || !panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    atraparFoco(panel, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => { if (!esDrawer()) cerrar(false); });
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
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.08, duration: 1.8 }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.hero-marca'), { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.5)
    .from(hero.querySelectorAll('.etiqueta'), { y: -24, rotate: -14, opacity: 0, duration: 1.3, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-full__foto');
  if (!foto) return;
  gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--full', start: 'top top', end: 'bottom top', scrub: true } });
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
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initDropdowns() {
  const drops = [...document.querySelectorAll('[data-drop]')];
  if (!drops.length) return;
  const desk = window.matchMedia('(min-width: 1025px)');
  const cerrar = d => { d.classList.remove('open'); d.querySelector('.nav-drop__btn')?.setAttribute('aria-expanded', 'false'); };
  drops.forEach(d => {
    const btn = d.querySelector('.nav-drop__btn');
    let t = 0;
    const abrir = () => {
      clearTimeout(t);
      drops.forEach(o => { if (o !== d) cerrar(o); });
      d.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    };
    btn.addEventListener('click', () => (d.classList.contains('open') ? cerrar(d) : abrir()));
    d.addEventListener('mouseenter', () => { if (desk.matches) abrir(); });
    d.addEventListener('mouseleave', () => { if (desk.matches) t = setTimeout(() => cerrar(d), 120); });
    d.addEventListener('focusout', e => { if (desk.matches && !d.contains(e.relatedTarget)) cerrar(d); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) { e.stopPropagation(); cerrar(d); btn.focus(); } });
  });
  document.addEventListener('click', e => { if (desk.matches && !e.target.closest('[data-drop]')) drops.forEach(cerrar); });
}

function initSearch() {
  const btn = document.querySelector('[data-search-toggle]');
  const form = document.getElementById('headerSearch');
  if (!btn || !form) return;
  btn.addEventListener('click', () => {
    const enPagina = document.getElementById('buscar');
    if (enPagina) { enPagina.scrollIntoView({ block: 'center' }); enPagina.focus(); return; }
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) form.querySelector('input')?.focus();
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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
  cart?.addEventListener('click', e => abrirCarrito(e.currentTarget));
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
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function leerCantidad(cont) {
  const inp = cont?.querySelector('.stepper input');
  const v = parseInt(inp?.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 1;
}

function telaInicial(p) {
  const activa = PAGINA === 'catalogo' && Catalogo.estado.tela.length === 1 ? Catalogo.estado.tela[0] : null;
  return activa && p.precios[activa] ? activa : telasDe(p)[0]?.id;
}
function talleInicial(p) {
  const activo = PAGINA === 'catalogo' && Catalogo.estado.talle.length === 1 ? Catalogo.estado.talle[0] : null;
  return activo && p.talles.includes(activo) ? activo : null;
}
function colorInicial(p) {
  const activo = PAGINA === 'catalogo' && Catalogo.estado.color.length === 1 ? Catalogo.estado.color[0] : null;
  return activo && p.colores.includes(activo) ? activo : p.color;
}

function variantesHTML(p, sel, ctx) {
  const tela = getTela(sel.tela);
  const color = getColor(sel.color);
  return `<div class="var" data-var-root="${ctx}">
    <div class="var__grupo" role="group" aria-labelledby="${ctx}-tela-l">
      <p class="var__label" id="${ctx}-tela-l">Tela <strong data-var-label="tela">${esc(tela?.nombre)}</strong></p>
      <div class="var__telas">${TELAS.map(t => { const v = p.precios[t.id]; return `<button type="button" class="var__tela" data-var="tela" data-valor="${t.id}" aria-pressed="${t.id === sel.tela}"${v ? '' : ' disabled'}><span>${esc(t.nombre)}</span><small>${v ? formatearPrecio(v) : 'No disponible'}</small></button>`; }).join('')}</div>
    </div>
    <div class="var__grupo" role="group" aria-labelledby="${ctx}-color-l">
      <p class="var__label" id="${ctx}-color-l">Color <strong data-var-label="color">${esc(color?.nombre)}</strong></p>
      <div class="var__colores">${p.colores.map(c => { const k = getColor(c); return `<button type="button" class="var__color" data-var="color" data-valor="${c}" aria-pressed="${c === sel.color}" aria-label="${esc(k.nombre)}" title="${esc(k.nombre)}"><span style="--c:${k.hex}"></span></button>`; }).join('')}</div>
    </div>
    <div class="var__grupo var__grupo--talle" role="group" aria-labelledby="${ctx}-talle-l">
      <p class="var__label" id="${ctx}-talle-l">Talle <strong data-var-label="talle">${sel.talle ? esc(sel.talle) : 'Elegí uno'}</strong><a class="var__guia" href="${HOME_ANCLA}#talles">Guía de talles</a></p>
      <div class="var__talles">${TALLES.map(t => `<button type="button" class="var__talle" data-var="talle" data-valor="${t}" aria-pressed="${t === sel.talle}"${p.talles.includes(t) ? '' : ' disabled'} aria-label="Talle ${t}">${t}</button>`).join('')}</div>
    </div>
  </div>`;
}

function aplicarVariante(root, sel, p, tipo, valor) {
  sel[tipo] = valor;
  root.querySelectorAll(`[data-var="${tipo}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valor === valor)));
  const label = root.querySelector(`[data-var-label="${tipo}"]`);
  if (label) label.textContent = tipo === 'tela' ? getTela(valor)?.nombre : tipo === 'color' ? getColor(valor)?.nombre : valor;
  if (tipo === 'talle') root.querySelector('.var__grupo--talle')?.classList.remove('falta');
}

function marcarFaltaTalle(root) {
  const box = root.querySelector('.var__grupo--talle');
  if (!box) return;
  box.classList.remove('falta'); void box.offsetWidth; box.classList.add('falta');
  const label = box.querySelector('[data-var-label="talle"]');
  if (label) label.textContent = 'Elegí un talle para seguir';
  box.querySelector('button:not(:disabled)')?.focus();
}

function resumenVariante(sel) {
  return `talle ${sel.talle} · ${getColor(sel.color)?.nombre.toLowerCase()} · ${getTela(sel.tela)?.nombre}`;
}

const Pick = { id: null, sel: null, modo: 'add', opener: null };
function abrirPicker(btn, modo) {
  const card = btn.closest('.prod');
  const p = obtenerProducto(btn.dataset.add || btn.dataset.buy);
  const dlg = document.getElementById('picker');
  const cont = document.getElementById('pickContent');
  if (!p || !dlg || !cont || p.stock <= 0) return;
  Pick.id = p.id; Pick.modo = modo; Pick.opener = btn;
  Pick.sel = { tela: telaInicial(p), color: colorInicial(p), talle: talleInicial(p), qty: leerCantidad(card) };
  cont.innerHTML = `<div class="pick__head">
      <span class="pick__img"><img src="images/${fotoDe(p, Pick.sel.color)}.webp" alt="" width="800" height="1000" data-pick-img></span>
      <div><p class="prod__linea">${esc(lineaTexto(p))}</p><p class="pick__nombre">${esc(p.nombre)}</p><p class="pick__precio" data-pick-precio>${formatearPrecio(precioDe(p, Pick.sel.tela))}</p></div>
    </div>
    ${variantesHTML(p, Pick.sel, 'pk')}
    <div class="pick__acciones">
      ${stepperHTML(p, 'Cantidad', Pick.sel.qty)}
      <button type="button" class="btn btn--cta" data-pick-ok>${modo === 'buy' ? 'Comprar ahora' : `${ICON_CARRITO} Agregar al carrito`}</button>
    </div>`;
  dlg.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('open')));
  document.body.classList.add('no-scroll');
  (cont.querySelector('.var__talle[aria-pressed="false"]:not(:disabled)') || cont.querySelector('[data-pick-ok]'))?.focus();
}

function cerrarPicker(devolverFoco = true) {
  const dlg = document.getElementById('picker');
  if (!dlg || dlg.hidden) return;
  dlg.classList.remove('open');
  if (document.getElementById('quickView')?.hidden !== false && document.getElementById('cartDrawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dlg.hidden = true; }, 320);
  if (devolverFoco) Pick.opener?.focus?.();
}

function agregarAlCarrito(p, qty, sel, modo, opener) {
  if (!Cart.add(p, qty, sel)) return false;
  showToast(`Sumaste ${p.nombre} · ${resumenVariante(sel)}`);
  if (modo === 'buy') abrirCarrito(opener);
  return true;
}

function initPicker() {
  const dlg = document.getElementById('picker');
  if (!dlg) return;
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-pick-cerrar]')) { cerrarPicker(); return; }
    if (e.target.closest('.var__guia')) { cerrarPicker(false); return; }
    const p = obtenerProducto(Pick.id);
    if (!p) return;
    const op = e.target.closest('[data-var]');
    if (op) {
      aplicarVariante(dlg, Pick.sel, p, op.dataset.var, op.dataset.valor);
      if (op.dataset.var === 'tela') dlg.querySelector('[data-pick-precio]').textContent = formatearPrecio(precioDe(p, Pick.sel.tela));
      if (op.dataset.var === 'color') dlg.querySelector('[data-pick-img]').src = `images/${fotoDe(p, Pick.sel.color)}.webp`;
      return;
    }
    if (e.target.closest('[data-pick-ok]')) {
      if (!Pick.sel.talle) { marcarFaltaTalle(dlg); return; }
      const qty = leerCantidad(dlg.querySelector('.pick__acciones'));
      const modo = Pick.modo;
      const opener = Pick.opener;
      cerrarPicker(modo !== 'buy');
      agregarAlCarrito(p, qty, Pick.sel, modo, opener);
      const card = opener?.closest('.prod');
      const inp = card?.querySelector('.stepper input');
      if (inp) inp.value = 1;
    }
  });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarPicker(); return; }
    atraparFoco(dlg, e);
  });
}

function initCompra() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const inp = step.parentElement.querySelector('input');
      const max = parseInt(inp.max, 10) || 99;
      inp.value = Math.max(1, Math.min(max, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (add && add.closest('.prod')) { abrirPicker(add, add.dataset.buy ? 'buy' : 'add'); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQV(quick.dataset.quick, quick);
  });
  document.addEventListener('input', e => {
    const inp = e.target.closest('.stepper input');
    if (!inp || inp.closest('.linea')) return;
    const max = parseInt(inp.max, 10) || 99;
    const v = parseInt(inp.value, 10);
    if (Number.isFinite(v) && v > max) inp.value = max;
  });
}

const Drawer = { opener: null };
function abrirCarrito(opener) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  Drawer.opener = opener || document.activeElement;
  renderCarrito();
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
  document.body.classList.add('no-scroll');
  drawer.querySelector('[data-close-drawer]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  if (document.getElementById('quickView')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  Drawer.opener?.focus?.();
}

const claveDe = el => ({ id: el.dataset.linea, talle: el.dataset.talle, color: el.dataset.color, tela: el.dataset.tela });

function renderCarrito() {
  const cont = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!cont) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = `<div class="carrito-vacio">${ICON_PERCHA}<p class="carrito-vacio__t">Tu carrito está vacío</p><p>Elegí un ambo, su tela, color y talle, y lo vas a ver acá.</p><a class="btn btn--primary" href="${CATALOGO}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  cont.innerHTML = items.map(i => {
    const p = obtenerProducto(i.id);
    return `<div class="linea" data-linea="${esc(i.id)}" data-talle="${esc(i.talle)}" data-color="${esc(i.color)}" data-tela="${esc(i.tela)}">
      <div class="linea__img"><img src="images/${fotoDe(p, i.color)}.webp" alt="" width="800" height="1000"></div>
      <div>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__var"><i style="--c:${getColor(i.color)?.hex}" aria-hidden="true"></i>Talle ${esc(i.talle)} · ${esc(getColor(i.color)?.nombre)} · ${esc(getTela(i.tela)?.nombre)}</p>
        <div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="${i.qty}" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>
      </div>
      <div class="linea__der">
        <p class="linea__precio">${formatearPrecio(precioDe(p, i.tela) * i.qty)}</p>
        <button type="button" class="linea__quitar" data-linea-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const link = document.getElementById('cartWsp');
  if (link) {
    const lineas = items.map(i => { const p = obtenerProducto(i.id); return `- ${p.nombre} (talle ${i.talle}, ${getColor(i.color)?.nombre.toLowerCase()}, ${getTela(i.tela)?.nombre}) x${i.qty}: ${formatearPrecio(precioDe(p, i.tela) * i.qty)}`; });
    link.href = wa(`Hola! Quiero consultar este pedido de Ambosjos:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}

function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrirCarrito(b)));
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.querySelectorAll('[data-close-drawer]').forEach(b => b.addEventListener('click', cerrarCarrito));
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); atraparFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('a[href]') && !e.target.closest('#cartWsp')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const clave = claveDe(linea);
    const it = Cart.get().find(i => Cart.igual(i, clave));
    if (e.target.closest('[data-linea-quitar]')) { Cart.remove(clave); return; }
    const step = e.target.closest('[data-linea-step]');
    if (step && it) Cart.setQty(clave, it.qty + Number(step.dataset.lineaStep));
  });
  drawer.addEventListener('change', e => {
    const inp = e.target.closest('[data-linea-qty]');
    if (!inp) return;
    Cart.setQty(claveDe(inp.closest('[data-linea]')), parseInt(inp.value, 10) || 1);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(); });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
}

const QV = { opener: null, id: null, sel: null };
function abrirQV(id, opener) {
  const qv = document.getElementById('quickView');
  const cont = document.getElementById('qvContent');
  if (!qv || !cont) return;
  const p = obtenerProducto(id);
  if (!p) return;
  if (opener) QV.opener = opener; else if (!QV.opener) QV.opener = document.activeElement;
  QV.id = p.id;
  QV.sel = { tela: telaInicial(p), color: colorInicial(p), talle: talleInicial(p) };
  const { items } = consultarProductos({ filtros: { cat: [p.cat], excluir: p.id }, limite: 3 });
  const agotado = p.stock <= 0;
  const tela = getTela(QV.sel.tela);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__foto"><img src="images/${fotoDe(p, QV.sel.color)}.webp" alt="${esc(p.alt)}" width="800" height="1000" data-qv-img></div>
      <div class="qv__thumbs">
        <button type="button" class="qv__thumb" aria-pressed="true" data-qv-foto="prenda" aria-label="Ver la prenda"><img src="images/${fotoDe(p, QV.sel.color)}.webp" alt="" width="800" height="1000" data-qv-thumb-prenda></button>
        <button type="button" class="qv__thumb" aria-pressed="false" data-qv-foto="tela" aria-label="Ver la tela"><img src="images/${tela.foto}.webp" alt="" width="300" height="300" data-qv-thumb-tela></button>
      </div>
    </div>
    <div class="qv__info">
      <p class="prod__linea">${esc(lineaTexto(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioDe(p, QV.sel.tela))}</span> <small data-qv-precio-tela>en ${esc(tela.nombre)}</small></p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${variantesHTML(p, QV.sel, 'qv')}
      <p class="qv__tela" data-qv-tela><strong>${esc(tela.nombre)}:</strong> ${esc(tela.comp)}. ${esc(tela.desc)}</p>
      <p class="qv__stock">${agotado ? 'Sin stock por ahora: escribinos y te avisamos cuando vuelva.' : p.stock <= 3 ? `Quedan ${p.stock} unidades.` : `Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]} · hay stock.`}</p>
      ${agotado
        ? `<div class="qv__acciones"><a class="btn btn--line" href="${wa('Hola! ¿Cuándo vuelve a entrar el ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame cuando vuelva</a></div>`
        : `<div class="qv__acciones">${stepperHTML(p, 'Cantidad')}<button type="button" class="btn btn--cta" data-qv-add>${ICON_CARRITO} Agregar al carrito</button><button type="button" class="btn btn--primary" data-qv-buy>Comprar ahora</button></div>`}
      <a class="link-wsp" href="${wa(`Hola! Quiero consultar por el ${p.nombre} de Ambosjos.`)}" target="_blank" rel="noopener">¿Dudas con este modelo? Consultanos por WhatsApp</a>
      ${items.length ? `<div class="qv__mas"><p class="qv__mas-titulo">También te puede interesar</p><ul>${items.map(m => `<li><button type="button" data-qv-otro="${esc(m.id)}"><span class="linea__img"><img src="images/${m.img}.webp" alt="" width="800" height="1000"></span><span>${esc(m.nombre)}</span><strong>Desde ${formatearPrecio(precioDesde(m))}</strong></button></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) {
    const url = new URL(`${CATALOGO}?producto=${p.id}`, location.href).href;
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: lineaTexto(p), brand: { '@type': 'Brand', name: 'Ambosjos' }, offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...preciosDe(p)), offerCount: telasDe(p).length, availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', url } });
  }
  if (qv.hidden) {
    qv.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  document.body.classList.add('no-scroll');
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus();
  const params = new URLSearchParams(location.search);
  params.set('producto', p.id);
  window.history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
}

function cerrarQV() {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 350);
  const params = new URLSearchParams(location.search);
  params.delete('producto');
  const qs = params.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  QV.opener?.focus?.();
  QV.opener = null;
}

function initQV() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { cerrarQV(); return; }
    if (e.target.closest('.var__guia')) { cerrarQV(); return; }
    const p = obtenerProducto(QV.id);
    if (!p) return;
    const img = qv.querySelector('[data-qv-img]');
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      img.src = foto.dataset.qvFoto === 'tela' ? `images/${getTela(QV.sel.tela).foto}.webp` : `images/${fotoDe(p, QV.sel.color)}.webp`;
      img.closest('.qv__foto').classList.toggle('qv__foto--tela', foto.dataset.qvFoto === 'tela');
      return;
    }
    const op = e.target.closest('[data-var]');
    if (op) {
      aplicarVariante(qv, QV.sel, p, op.dataset.var, op.dataset.valor);
      const tela = getTela(QV.sel.tela);
      if (op.dataset.var === 'tela') {
        qv.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioDe(p, QV.sel.tela));
        qv.querySelector('[data-qv-precio-tela]').textContent = `en ${tela.nombre}`;
        qv.querySelector('[data-qv-tela]').innerHTML = `<strong>${esc(tela.nombre)}:</strong> ${esc(tela.comp)}. ${esc(tela.desc)}`;
        qv.querySelector('[data-qv-thumb-tela]').src = `images/${tela.foto}.webp`;
      }
      if (op.dataset.var === 'color') {
        const src = `images/${fotoDe(p, QV.sel.color)}.webp`;
        qv.querySelector('[data-qv-thumb-prenda]').src = src;
        qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvFoto === 'prenda')));
        img.closest('.qv__foto').classList.remove('qv__foto--tela');
        img.src = src;
      }
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (add) {
      if (!QV.sel.talle) { marcarFaltaTalle(qv); return; }
      const qty = leerCantidad(qv.querySelector('.qv__acciones'));
      const comprar = add.hasAttribute('data-qv-buy');
      if (comprar) { const opener = QV.opener; cerrarQV(); agregarAlCarrito(p, qty, QV.sel, 'buy', opener); }
      else agregarAlCarrito(p, qty, QV.sel, 'add');
      return;
    }
    const otro = e.target.closest('[data-qv-otro]');
    if (otro) abrirQV(otro.dataset.qvOtro, null);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv, e);
  });
}

function initTelas() {
  const root = document.querySelector('[data-telas]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-tela-tab]')];
  const dato = k => root.querySelector(`[data-tela="${k}"]`);
  const foto = root.querySelector('[data-tela-foto]');
  const elegir = (id, foco = false) => {
    const t = getTela(id); if (!t) return;
    tabs.forEach(b => { const on = b.dataset.telaTab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    root.querySelector('[role="tabpanel"]')?.setAttribute('aria-labelledby', `tab-${id}`);
    dato('linea').textContent = t.linea;
    dato('nombre').textContent = t.nombre;
    dato('desc').textContent = t.desc;
    dato('comp').textContent = t.comp;
    dato('ideal').textContent = t.ideal;
    const ambos = contar({ tela: [id], sub: ['ambo'] });
    const { items } = consultarProductos({ filtros: { tela: [id], sub: ['ambo'] }, orden: 'precio-asc', limite: 1 });
    dato('precio').textContent = items[0] ? formatearPrecio(precioDe(items[0], id)) : '—';
    dato('ambos').textContent = `${ambos} ${ambos === 1 ? 'ambo' : 'ambos'}`;
    root.querySelectorAll('[data-medidor]').forEach((m, i) => { m.dataset.n = t.medidores[i]; m.setAttribute('aria-label', `${MEDIDORES[i]}: ${['baja', 'media', 'alta'][t.medidores[i] - 1]}`); });
    const cta = dato('cta');
    cta.href = `${CATALOGO}?tela=${id}`;
    cta.firstChild.textContent = `Ver prendas en ${t.nombre} (${contar({ tela: [id] })}) `;
    if (foto) {
      foto.classList.remove('cambia'); void foto.offsetWidth; foto.classList.add('cambia');
      foto.querySelector('img').src = `images/${t.foto}.webp`;
      foto.querySelector('img').alt = t.alt;
    }
  };
  root.addEventListener('click', e => { const b = e.target.closest('[data-tela-tab]'); if (b) elegir(b.dataset.telaTab); });
  root.addEventListener('keydown', e => {
    const b = e.target.closest('[data-tela-tab]'); if (!b) return;
    const i = tabs.indexOf(b);
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); elegir(tabs[n].dataset.telaTab, true); }
  });
  elegir('spandex');
}

function initColores() {
  const root = document.querySelector('[data-colores]');
  if (!root) return;
  const grid = root.querySelector('[data-color-grid]');
  grid.innerHTML = COLORES.map(c => `<button type="button" class="sw" role="radio" aria-checked="false" tabindex="-1" data-color-op="${c.id}"><span class="sw__c" style="--c:${c.hex}" aria-hidden="true"></span><span class="sw__n">${esc(c.nombre)}</span></button>`).join('');
  const ops = [...grid.querySelectorAll('[data-color-op]')];
  const prev = root.querySelector('[data-color-preview]');
  const dato = k => root.querySelector(`[data-color="${k}"]`);
  const elegir = (id, foco = false) => {
    const c = getColor(id); if (!c) return;
    ops.forEach(b => { const on = b.dataset.colorOp === id; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    const n = contar({ color: [id] });
    dato('nombre').textContent = c.nombre;
    dato('n').textContent = `Está en ${n} ${n === 1 ? 'modelo' : 'modelos'} del catálogo`;
    const cta = dato('cta');
    cta.href = `${CATALOGO}?color=${id}`;
    cta.firstChild.textContent = `Ver prendas en ${c.nombre.toLowerCase()} `;
    if (prev) {
      const capa = document.createElement('span');
      capa.className = 'color-prev__capa' + (c.foto ? '' : ' color-prev__capa--liso');
      capa.style.setProperty('--c', c.hex);
      capa.innerHTML = c.foto ? `<img src="images/${c.foto}.webp" alt="Prenda en color ${esc(c.nombre.toLowerCase())}" width="330" height="412">` : `<span class="color-prev__muestra" role="img" aria-label="Muestra del color ${esc(c.nombre.toLowerCase())}"></span>`;
      prev.appendChild(capa);
      requestAnimationFrame(() => requestAnimationFrame(() => capa.classList.add('on')));
      const viejas = [...prev.querySelectorAll('.color-prev__capa')].slice(0, -1);
      setTimeout(() => viejas.forEach(v => v.remove()), reduceMotion ? 0 : 900);
    }
  };
  grid.addEventListener('click', e => { const b = e.target.closest('[data-color-op]'); if (b) elegir(b.dataset.colorOp); });
  grid.addEventListener('keydown', e => {
    const b = e.target.closest('[data-color-op]'); if (!b) return;
    const i = ops.indexOf(b);
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % ops.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + ops.length) % ops.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = ops.length - 1;
    if (n !== null) { e.preventDefault(); elegir(ops[n].dataset.colorOp, true); }
  });
  elegir('bordo');
}

function initTalles() {
  const root = document.querySelector('[data-talles]');
  if (!root) return;
  const tabla = root.querySelector('[data-talles-tabla]');
  const estado = { para: 'mujer', talle: 'M' };
  const dato = k => root.querySelector(`[data-talle-dato="${k}"]`);
  const pintar = () => {
    const m = MEDIDAS[estado.para];
    tabla.innerHTML = `<caption class="sr-only">Medidas orientativas del cuerpo en centímetros, ${estado.para === 'mujer' ? 'mujer' : 'varón'}</caption>
      <thead><tr><th scope="col">Talle</th>${m.etiquetas.map(t => `<th scope="col">${t}</th>`).join('')}</tr></thead>
      <tbody>${TALLES.map(t => `<tr${t === estado.talle ? ' class="on"' : ''}><th scope="row"><button type="button" data-talle-op="${t}" aria-pressed="${t === estado.talle}">${t}</button></th>${m[t].map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>`;
    const n = contar({ cat: [estado.para], talle: [estado.talle] });
    const cta = dato('cta');
    cta.href = `${CATALOGO}?cat=${estado.para}&talle=${encodeURIComponent(estado.talle)}`;
    cta.firstChild.textContent = `Ver ${n} prendas de ${estado.para === 'mujer' ? 'mujer' : 'varón'} en talle ${estado.talle} `;
    dato('wsp').href = wa(`Hola! Tengo ${m.etiquetas[0].toLowerCase()} ${m[estado.talle][0]} cm y cintura ${m[estado.talle][1]} cm. ¿Me conviene el talle ${estado.talle}?`);
    dato('resumen').textContent = `Talle ${estado.talle}: ${m.etiquetas.map((e, i) => `${e.toLowerCase()} ${m[estado.talle][i]} cm`).join(' · ')}`;
  };
  root.addEventListener('click', e => {
    const para = e.target.closest('[data-talles-para]');
    if (para) {
      estado.para = para.dataset.tallesPara;
      root.querySelectorAll('[data-talles-para]').forEach(b => b.setAttribute('aria-pressed', String(b === para)));
      pintar();
      return;
    }
    const t = e.target.closest('[data-talle-op]');
    if (t) { estado.talle = t.dataset.talleOp; pintar(); tabla.querySelector(`[data-talle-op="${estado.talle}"]`)?.focus(); }
  });
  pintar();
}

function abrirProductoDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && obtenerProducto(id)) abrirQV(id, null);
}

function init() {
  initNav();
  initDropdowns();
  initSearch();
  initModelBarScroll();
  renderMenus();
  renderHome();
  initCatalogo();
  initTelas();
  initColores();
  initTalles();
  initReveals();
  initFloats();
  initCompra();
  initPicker();
  initCarrito();
  initQV();
  updateCartBadge();
  initHeroMotion();
  initParallax();
  abrirProductoDesdeURL();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}
init();
