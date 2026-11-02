const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493547634775';
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
  { id: 'oficina', nombre: 'Oficina', bajada: 'Sillas, escritorios, reuniones y guardado' },
  { id: 'gastronomia', nombre: 'Gastronomía', bajada: 'Mesas, sillas y banquetas para salón y barra' },
  { id: 'escolar', nombre: 'Escolar', bajada: 'Pupitres y sillas por talle' },
];
const TIPOS = [
  { id: 'sillas', nombre: 'Sillas' }, { id: 'escritorios', nombre: 'Escritorios' }, { id: 'mesas', nombre: 'Mesas' },
  { id: 'guardado', nombre: 'Guardado' }, { id: 'banquetas', nombre: 'Banquetas' }, { id: 'pupitres', nombre: 'Pupitres' },
];
const MATERIALES = [
  { id: 'madera', nombre: 'Madera maciza' }, { id: 'multilaminado', nombre: 'Multilaminado' },
  { id: 'melamina', nombre: 'Melamina' }, { id: 'malla', nombre: 'Malla y tela' },
];
const PRECIOS = [
  { id: 'hasta150', nombre: 'Hasta $150.000', min: null, max: 150000 },
  { id: '150a400', nombre: '$150.000 a $400.000', min: 150001, max: 400000 },
  { id: 'mas400', nombre: 'Más de $400.000', min: 400001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  oficina: 'oficina oficinas empresa estudio coworking consultorio',
  gastronomia: 'gastronomia gastronomico restaurante resto bar cafe cafeteria confiteria salon comedor',
  escolar: 'escolar escuela colegio aula alumnos alumno instituto',
  sillas: 'silla sillas asiento', escritorios: 'escritorio escritorios puesto de trabajo', mesas: 'mesa mesas',
  guardado: 'guardado armario mueble cajonera archivo', banquetas: 'banqueta banquetas taburete banco barra', pupitres: 'pupitre pupitres banco',
  madera: 'madera maciza roble', multilaminado: 'multilaminado terciado curvado', melamina: 'melamina', malla: 'malla tela tapizado',
};

const SILLA_ESCOLAR_COLORES = [
  { id: 'azul', nombre: 'Azul', hex: '#2747A8', img: 'images/p-silla-escolar-azul.webp' },
  { id: 'rojo', nombre: 'Rojo', hex: '#A12A2A', img: 'images/p-silla-escolar-roja.webp' },
  { id: 'verde', nombre: 'Verde', hex: '#2E7044', img: 'images/p-silla-escolar-verde.webp' },
  { id: 'gris', nombre: 'Gris grafito', hex: '#5A5C5E', img: 'images/p-silla-escolar-gris.webp' },
];

const Tienda = crearTienda([
  { id: 'silla-operativa-malla', cod: 'OF-110', nombre: 'Silla operativa de malla', cat: 'oficina', sub: 'sillas', mat: 'malla', rango: 1, stock: 40,
    tags: 'ergonomica giratoria ruedas apoyabrazos lumbar computadora',
    variantes: [{ id: 'basculante', nombre: 'Mecanismo basculante', precio: 189000 }, { id: 'sincro', nombre: 'Mecanismo sincro', precio: 239000 }], etiqueta: 'Mecanismo',
    img: 'images/p-silla-operativa.webp', ancho: 1200, alto: 1200, alt: 'Silla operativa negra con respaldo de malla, apoyabrazos regulables y base de cinco ruedas',
    galeria: [
      { src: 'images/silla-operativa-vertical.webp', ancho: 900, alto: 1600, alt: 'La silla operativa entera, en vista de tres cuartos' },
      { src: 'images/g-silla-operativa.webp', ancho: 720, alto: 900, alt: 'Detalle del respaldo de malla con apoyo lumbar y los apoyabrazos' },
    ],
    desc: 'Respaldo de malla que deja pasar el aire, apoyo lumbar, asiento tapizado y apoyabrazos regulables en altura. El pistón a gas sube y baja el asiento para que cada persona lo ajuste a su escritorio.',
    datos: [['Alto del asiento', '45 a 55 cm, regulable'], ['Alto total', '98 a 108 cm'], ['Ancho', '62 cm'], ['Base', 'Nylon, 5 ruedas'], ['Respaldo', 'Malla con apoyo lumbar']],
    cota: 'Asiento 45–55 cm' },
  { id: 'escritorio-cajonera', cod: 'OF-210', nombre: 'Escritorio con cajonera fija', cat: 'oficina', sub: 'escritorios', mat: 'melamina', rango: 2, stock: 25,
    tags: 'puesto de trabajo cajones blanco roble pata marco',
    variantes: [{ id: '120', nombre: '120 × 60 cm', precio: 289000 }, { id: '140', nombre: '140 × 70 cm', precio: 339000 }, { id: '160', nombre: '160 × 70 cm', precio: 379000 }], etiqueta: 'Medida de la tapa',
    img: 'images/p-escritorio.webp', ancho: 1200, alto: 1200, alt: 'Escritorio con tapa blanca, patas de marco negras y cajonera de tres cajones en roble',
    galeria: [{ src: 'images/g-escritorio.webp', ancho: 720, alto: 900, alt: 'Detalle de la cajonera en roble debajo de la tapa blanca' }],
    desc: 'Tapa blanca de melamina de 25 mm sobre patas de marco negras y una cajonera fija en roble: dos cajones y uno para carpetas colgantes.',
    datos: [['Alto', '75 cm'], ['Tapa', 'Melamina blanca de 25 mm'], ['Estructura', 'Caño 40 × 40 mm, epoxi negro'], ['Cajonera', '3 cajones, terminación roble']],
    cota: 'Alto 75 cm', badge: '3 medidas' },
  { id: 'mesa-reunion', cod: 'OF-310', nombre: 'Mesa de reunión con patas de marco', cat: 'oficina', sub: 'mesas', mat: 'madera', rango: 7, stock: 8,
    tags: 'reunion reuniones directorio sala conferencia roble comedor',
    variantes: [{ id: '180', nombre: '180 × 90 cm · 6 personas', precio: 589000 }, { id: '240', nombre: '240 × 110 cm · 8 a 10 personas', precio: 789000 }, { id: '300', nombre: '300 × 120 cm · 12 personas', precio: 989000 }], etiqueta: 'Medida',
    img: 'images/p-mesa-reunion.webp', ancho: 900, alto: 900, alt: 'Mesa de reunión con tapa de roble y pata de marco negra sobre piso de cemento',
    galeria: [{ src: 'images/mesa-reunion-ancha.webp', ancho: 1600, alto: 900, alt: 'La mesa de reunión entera en una sala con ventanal' }],
    desc: 'Tapa de roble con canto recto sobre dos patas de marco de caño rectangular. Una mesa sobria para directorio, sala de reuniones o comedor de oficina.',
    datos: [['Alto', '75 cm'], ['Tapa', 'Roble macizo de 40 mm'], ['Estructura', 'Patas de marco, epoxi negro'], ['Regatones', 'Niveladores']],
    cota: 'Alto 75 cm', badge: '3 medidas' },
  { id: 'cajonera', cod: 'OF-220', nombre: 'Cajonera de 3 cajones', cat: 'oficina', sub: 'guardado', mat: 'melamina', rango: 10, stock: 30,
    tags: 'cajones archivo carpetas colgantes roble',
    variantes: [{ id: 'fija', nombre: 'Con patas niveladoras', precio: 159000 }, { id: 'ruedas', nombre: 'Con ruedas y cerradura', precio: 179000 }], etiqueta: 'Versión',
    img: 'images/p-cajonera.webp', ancho: 900, alto: 900, alt: 'Cajonera de tres cajones con terminación roble',
    galeria: [{ src: 'images/g-escritorio.webp', ancho: 720, alto: 900, alt: 'La cajonera debajo de la tapa del escritorio OF-210' }],
    desc: 'La misma cajonera del escritorio OF-210, para sumar guardado a otro puesto: dos cajones y uno para carpetas colgantes.',
    datos: [['Medidas', '40 × 50 × 60 cm'], ['Cajones', '2 + 1 para carpetas colgantes'], ['Terminación', 'Melamina roble']],
    cota: 'Alto 60 cm' },
  { id: 'armario-bajo', cod: 'OF-410', nombre: 'Armario bajo de 2 puertas', cat: 'oficina', sub: 'guardado', mat: 'melamina', rango: 9, stock: 15,
    tags: 'armario mueble puertas estante credenza biblioteca blanco roble',
    variantes: [{ id: '90', nombre: '90 × 45 × 75 cm', precio: 249000 }, { id: '120', nombre: '120 × 45 × 75 cm', precio: 299000 }], etiqueta: 'Medida',
    img: 'images/p-armario-bajo.webp', ancho: 1200, alto: 1200, alt: 'Armario bajo blanco de dos puertas con tapa de roble y manijas de aluminio',
    galeria: [{ src: 'images/g-armario-bajo.webp', ancho: 720, alto: 900, alt: 'Detalle de las manijas de aluminio y la tapa de roble' }],
    desc: 'Cuerpo blanco con tapa en roble, dos puertas con manijas de aluminio y un estante interno regulable. Va contra la pared o al costado del escritorio.',
    datos: [['Alto', '75 cm'], ['Interior', '1 estante regulable'], ['Terminación', 'Blanco con tapa roble'], ['Patas', 'Regatones negros']],
    cota: 'Alto 75 cm' },
  { id: 'mesa-bar', cod: 'GA-110', nombre: 'Mesa gastronómica con pie de hierro', cat: 'gastronomia', sub: 'mesas', mat: 'madera', rango: 3, stock: 30,
    tags: 'bar restaurante cafe pie central hierro fundido cuadrada salon',
    variantes: [{ id: '60', nombre: 'Tapa 60 × 60 cm', precio: 139000 }, { id: '70', nombre: 'Tapa 70 × 70 cm', precio: 159000 }, { id: '80', nombre: 'Tapa 80 × 80 cm', precio: 179000 }], etiqueta: 'Medida de la tapa',
    img: 'images/p-mesa-bar.webp', ancho: 1200, alto: 1200, alt: 'Mesa cuadrada de madera maciza con pie central de hierro fundido negro',
    galeria: [{ src: 'images/g-mesa-bar.webp', ancho: 720, alto: 900, alt: 'Detalle del pie de hierro fundido con base en cruz' }],
    desc: 'Tapa de madera maciza lustrada sobre un pie central de hierro fundido con base en cruz y regatones niveladores, para que no baile en el piso del salón.',
    datos: [['Alto', '75 cm'], ['Tapa', 'Madera maciza lustrada, 4 cm'], ['Pie', 'Hierro fundido, base en cruz'], ['Lugares', '2 a 4 según la medida']],
    cota: 'Alto 75 cm', badge: '3 medidas' },
  { id: 'silla-gastro', cod: 'GA-210', nombre: 'Silla apilable de caño y multilaminado', cat: 'gastronomia', sub: 'sillas', mat: 'multilaminado', rango: 4, stock: 120,
    tags: 'restaurante bar cafe apilable comedor nogal',
    variantes: [{ id: 'grafito', nombre: 'Estructura grafito', precio: 89000 }], etiqueta: 'Terminación',
    img: 'images/p-silla-gastro.webp', ancho: 1200, alto: 1200, alt: 'Silla de caño grafito con asiento y respaldo de multilaminado nogal',
    galeria: [{ src: 'images/g-silla-gastro.webp', ancho: 720, alto: 900, alt: 'Detalle del asiento y el respaldo de multilaminado curvado' }],
    desc: 'Estructura de caño grafito con asiento y respaldo de multilaminado curvado en nogal. Se apila para limpiar el salón y liberar espacio.',
    datos: [['Alto del asiento', '45 cm'], ['Alto total', '82 cm'], ['Asiento y respaldo', 'Multilaminado nogal'], ['Apilable', 'Sí']],
    cota: 'Asiento 45 cm' },
  { id: 'banqueta-alta', cod: 'GA-310', nombre: 'Banqueta alta con aro apoyapié', cat: 'gastronomia', sub: 'banquetas', mat: 'madera', rango: 8, stock: 60,
    tags: 'taburete banco barra alta desayunador',
    variantes: [{ id: '65', nombre: 'Alto 65 cm · barra de 90 cm', precio: 82000 }, { id: '75', nombre: 'Alto 75 cm · barra de 105 cm', precio: 86000 }], etiqueta: 'Alto',
    img: 'images/p-banqueta.webp', ancho: 1200, alto: 1200, alt: 'Banqueta alta de caño negro con asiento redondo de madera y aro apoyapié',
    galeria: [{ src: 'images/g-banqueta.webp', ancho: 720, alto: 900, alt: 'Detalle del asiento redondo de madera maciza' }],
    desc: 'Asiento redondo de madera maciza sobre cuatro patas de caño cuadrado negro, con aro apoyapié. Para barras, desayunadores y mesas altas.',
    datos: [['Asiento', 'Madera maciza, Ø 35 cm'], ['Estructura', 'Caño cuadrado, epoxi negro'], ['Apoyapié', 'Aro de caño redondo']],
    cota: 'Asiento 65 o 75 cm', badge: '2 alturas' },
  { id: 'pupitre', cod: 'ES-110', nombre: 'Pupitre individual con parrilla', cat: 'escolar', sub: 'pupitres', mat: 'melamina', rango: 5, stock: 200,
    tags: 'banco escolar mesa escuela colegio aula alumno parrilla',
    variantes: [{ id: 't3', nombre: 'Talle 3 · mesa 59 cm', precio: 104000 }, { id: 't4', nombre: 'Talle 4 · mesa 64 cm', precio: 108000 }, { id: 't5', nombre: 'Talle 5 · mesa 71 cm', precio: 114000 }, { id: 't6', nombre: 'Talle 6 · mesa 76 cm', precio: 119000 }], etiqueta: 'Talle',
    img: 'images/p-pupitre.webp', ancho: 1200, alto: 1200, alt: 'Pupitre con tapa de melamina, estructura de caño gris y parrilla portaútiles',
    galeria: [{ src: 'images/g-pupitre.webp', ancho: 720, alto: 900, alt: 'Detalle de la parrilla portaútiles debajo de la tapa' }],
    desc: 'Tapa de melamina con canto redondeado, estructura de caño redondo con pintura epoxi gris y parrilla portaútiles. Se pide por talle según la estatura de los alumnos.',
    datos: [['Tapa', '60 × 45 cm, melamina'], ['Estructura', 'Caño redondo, epoxi gris'], ['Parrilla', 'Portaútiles de alambre'], ['Regatones', 'Goma antideslizante']],
    cota: 'Mesa 59 a 76 cm', badge: '4 talles' },
  { id: 'silla-escolar', cod: 'ES-210', nombre: 'Silla escolar de caño y multilaminado', cat: 'escolar', sub: 'sillas', mat: 'multilaminado', rango: 6, stock: 300,
    tags: 'escuela colegio aula alumno azul rojo verde gris',
    variantes: [{ id: 't3', nombre: 'Talle 3 · asiento 35 cm', precio: 58000 }, { id: 't4', nombre: 'Talle 4 · asiento 38 cm', precio: 61000 }, { id: 't5', nombre: 'Talle 5 · asiento 43 cm', precio: 64000 }, { id: 't6', nombre: 'Talle 6 · asiento 46 cm', precio: 67000 }], etiqueta: 'Talle',
    colores: SILLA_ESCOLAR_COLORES,
    img: 'images/p-silla-escolar-azul.webp', ancho: 1200, alto: 1200, alt: 'Silla escolar de caño azul con asiento y respaldo de multilaminado',
    galeria: [{ src: 'images/g-silla-escolar.webp', ancho: 720, alto: 900, alt: 'Detalle del asiento y el respaldo de multilaminado remachados' }],
    desc: 'Asiento y respaldo de multilaminado curvado, remachados a una estructura de caño redondo con regatones de goma. La estructura viene en cuatro colores.',
    datos: [['Asiento y respaldo', 'Multilaminado curvado'], ['Estructura', 'Caño redondo, epoxi de color'], ['Regatones', 'Goma antideslizante']],
    cota: 'Asiento 35 a 46 cm', badge: '4 colores' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cod, p.desc, p.tags || '', p.cota || '',
    ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ETIQUETAS[p.mat] || '',
    nombreDe(CATEGORIAS, p.cat), nombreDe(TIPOS, p.sub), nombreDe(MATERIALES, p.mat),
    ...(p.variantes || []).map(v => v.nombre), ...(p.colores || []).map(c => c.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const base = p => (p.variantes?.length ? Math.min(...p.variantes.map(v => v.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(base(p) * (1 - p.descuento / 100)) : base(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), mat = lista(f.mat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (mat.length && !mat.includes(p.mat)) return false;
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
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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
const varianteDe = (p, v) => (p?.variantes || []).find(x => x.id === v) || p?.variantes?.[0] || null;
const colorDe = (p, c) => (p?.colores || []).find(x => x.id === c) || p?.colores?.[0] || null;
const precioBase = (p, v) => varianteDe(p, v)?.precio ?? p.precio;
const precioFinal = (p, v) => { const b = precioBase(p, v); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const precioDesde = p => Math.min(...(p.variantes || [{ id: null }]).map(v => precioFinal(p, v.id)));
const imgDe = (p, c) => colorDe(p, c)?.img || p.img;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const tipoDe = id => TIPOS.find(c => c.id === id) || { nombre: '' };
const claveLinea = (id, v, c) => `${id}|${v || ''}|${c || ''}`;
const detalleLinea = (p, v, c) => [varianteDe(p, v)?.nombre, colorDe(p, c)?.nombre].filter(Boolean).join(' · ');

const Cart = {
  KEY: 'olmosrolando_cart',
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(a) ? a.filter(i => i && getProducto(i.id) && i.qty > 0).map(i => ({ ...i, k: claveLinea(i.id, i.v, i.c) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items.map(({ id, v, c, qty }) => ({ id, v, c, qty })))); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enOtras(items, id, k) { return items.filter(i => i.id === id && i.k !== k).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = null, c = null) {
    const items = this.get();
    const vv = varianteDe(producto, v)?.id || '';
    const cc = colorDe(producto, c)?.id || '';
    const k = claveLinea(producto.id, vv, cc);
    const max = Math.max(1, (producto.stock ?? 99) - this.enOtras(items, producto.id, k));
    const ex = items.find(i => i.k === k);
    if (ex) ex.qty = Math.min(ex.qty + qty, max);
    else items.push({ k, id: producto.id, v: vv, c: cc, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    const p = getProducto(it.id);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - this.enOtras(items, it.id, it.k)));
    this.save(items);
  },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
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

const svgIco = p => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  flecha: svgIco('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  carrito: '<svg class="ico prod-add__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><path d="M13.5 9.5v4M11.5 11.5h4"/></svg>',
};
const WSP_GLYPH = '<svg class="glifo-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p, v = null) {
  const desde = v == null && (p.variantes || []).length > 1;
  const fin = v == null ? precioDesde(p) : precioFinal(p, v);
  return `<span class="precio">${desde ? '<small>Desde</small>' : ''}<b>${formatearPrecio(fin)}</b></span>`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  return `<article class="card"${anim} data-card="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}">
      <span class="card__cod">${esc(p.cod)}</span>${p.badge ? `<span class="card__badge">${esc(p.badge)}</span>` : ''}
    </button>
    <div class="card__info">
      ${MODELO === '2' ? `<p class="card__cota">${esc(p.cota)}</p>` : ''}
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${MODELO === '1' ? `<p class="card__cota">${esc(p.cota)}</p>` : ''}
      ${precioHTML(p)}
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="prod-add__txt">Agregar</span>${ICO.carrito}</button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.08, duration: 1.8, stagger: 0.08, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.15)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero__espacios li, .panel__txt'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.cota--v .cota__linea'), { scaleY: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform' }, 0.8)
    .from(hero.querySelectorAll('.cota__txt'), { opacity: 0, duration: 0.6, clearProps: 'opacity' }, 1.05)
    .from(hero.querySelectorAll('.hero__ficha, .regla'), { y: 22, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.85);
}

function initScrollDetalles() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const sello = document.querySelector('.sello svg');
  if (sello) gsap.fromTo(sello, { rotate: -40 }, { rotate: 40, ease: 'none', scrollTrigger: { trigger: '.sec--pasos', start: 'top bottom', end: 'bottom top', scrub: true } });
  const vMat = document.querySelector('.materiales__foto .cota--v .cota__linea');
  if (vMat) gsap.from(vMat, { scaleY: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.materiales__foto', start: 'top 80%', once: true } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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
  const wrap = document.querySelector('[data-nav-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const cont = wrap.querySelector('[data-menu-cats]');
  const params = new URLSearchParams(location.search);
  const activa = PAGINA === 'catalogo' ? params.get('cat') : null;
  cont.innerHTML = CATEGORIAS.map(c => {
    const tipos = TIPOS.filter(t => Tienda.contar({ cat: c.id, sub: t.id }) > 0);
    return `<div class="nav-cats__col"><a href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>
      <ul>${tipos.map(t => `<li><a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${t.id}">${esc(t.nombre)} <small>${Tienda.contar({ cat: c.id, sub: t.id })}</small></a></li>`).join('')}</ul></div>`;
  }).join('');
  const mq = window.matchMedia('(min-width: 1024px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (mq.matches && hover.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (mq.matches && hover.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (mq.matches && !panel.hidden && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && mq.matches) { cerrar(); btn.focus(); } });
  wrap.addEventListener('focusout', e => { if (mq.matches && e.relatedTarget && !wrap.contains(e.relatedTarget)) cerrar(); });
  mq.addEventListener('change', cerrar);
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuenta });
    el.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const capas = new Set();
function abrirCapa(el, bd) {
  if (!el) return;
  el.hidden = false; if (bd) bd.hidden = false;
  void el.offsetWidth;
  el.classList.add('open'); bd?.classList.add('open');
  capas.add(el);
  document.body.classList.add('no-scroll');
}
function cerrarCapa(el, bd) {
  if (!el || !capas.has(el)) return;
  el.classList.remove('open'); bd?.classList.remove('open');
  capas.delete(el);
  if (!capas.size) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!el.classList.contains('open')) { el.hidden = true; if (bd) bd.hidden = true; } }, 400);
}
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function mensajeLista(items) {
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} ${p.cod} (${detalleLinea(p, i.v, i.c)})`; });
  return `Hola! Quiero pedir presupuesto por esta lista:\n${lineas.join('\n')}\nTotal de lista: ${formatearPrecio(Cart.total())}`;
}

const Drawer = {
  el: null, bd: null, volver: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el) return;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); this.open(); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const linea = e.target.closest('[data-idx]');
      const idx = linea ? Number(linea.dataset.idx) : -1;
      const paso = e.target.closest('[data-linea-paso]');
      if (paso && idx >= 0) { const it = Cart.get()[idx]; if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaPaso)); return; }
      if (e.target.closest('[data-quitar]') && idx >= 0) { Cart.remove(idx); showToast('Lo sacamos de tu pedido'); return; }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-tienda]')) { this.close(); }
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render(false));
    this.render(false);
  },
  render(animar) {
    if (!this.el) return;
    const cont = this.el.querySelector('[data-cart-lineas]');
    const foot = this.el.querySelector('[data-cart-foot]');
    const items = Cart.get();
    if (!items.length) {
      cont.innerHTML = `<div class="drawer__vacio"><span class="cota cota--h vacio-cota" aria-hidden="true"><span class="cota__linea"></span></span><h3>Tu pedido está vacío</h3><p>Sumá sillas, mesas o pupitres con la medida o el talle que necesitás.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ver el catálogo</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    cont.innerHTML = items.map((i, n) => {
      const p = getProducto(i.id);
      const max = (p.stock ?? 99) - Cart.enOtras(items, i.id, i.k);
      return `<div class="linea${animar ? ' entra' : ''}" data-idx="${n}" style="--i:${n}">
        <div class="linea__foto"><img src="${imgDe(p, i.c)}" width="${p.ancho}" height="${p.alto}" alt=""></div>
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          <p class="linea__meta">${esc(p.cod)} · ${esc(detalleLinea(p, i.v, i.c))} · ${formatearPrecio(precioFinal(p, i.v))} c/u</p>
          <div class="linea__abajo">
            <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
            <b>${formatearPrecio(precioFinal(p, i.v) * i.qty)}</b>
            <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
    const wsp = this.el.querySelector('[data-cart-wsp]');
    if (wsp) wsp.href = waLink(mensajeLista(items));
  },
  open() {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render(!reduceMotion);
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__head .icon-btn')?.focus(), 60);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-modal-cuerpo]');
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quick]');
      if (q) { e.preventDefault(); this.open(q.dataset.quick, q.dataset.v, q.dataset.c); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const th = e.target.closest('[data-vr-thumb]');
      if (th) { this.foto(this.galeria()[Number(th.dataset.vrThumb)]); this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th))); return; }
      const paso = e.target.closest('[data-vr-paso]');
      if (paso) {
        const span = this.el.querySelector('[data-vr-cant]');
        const n = Math.max(1, Math.min((this.actual.stock ?? 99), Number(span.textContent) + Number(paso.dataset.vrPaso)));
        span.textContent = n;
        this.el.querySelector('[data-vr-paso="-1"]').disabled = n <= 1;
        this.el.querySelector('[data-vr-paso="1"]').disabled = n >= (this.actual.stock ?? 99);
        this.sync();
        return;
      }
      if (e.target.closest('[data-vr-add]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vr-buy]')) { this.agregar(true); }
    });
    this.el.addEventListener('change', e => {
      if (e.target.name === 'vr-color') {
        const c = colorDe(this.actual, e.target.value);
        if (c) { this.foto({ src: c.img, ancho: this.actual.ancho, alto: this.actual.alto, alt: `${this.actual.nombre}, estructura ${c.nombre.toLowerCase()}` }); this.el.querySelectorAll('[data-vr-thumb]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0))); }
      }
      if (e.target.name === 'vr-var' || e.target.name === 'vr-color') this.sync();
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
  },
  foto(g) {
    const img = this.el.querySelector('[data-vr-img]');
    if (g && img) { img.src = g.src; img.alt = g.alt; img.width = g.ancho; img.height = g.alto; }
  },
  galeria() { const p = this.actual; return p ? [{ src: imgDe(p, this.datos().c), ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])] : []; },
  datos() {
    return {
      v: this.el.querySelector('[name="vr-var"]:checked')?.value || null,
      c: this.el.querySelector('[name="vr-color"]:checked')?.value || null,
      n: Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1,
    };
  },
  sync() {
    const p = this.actual; if (!p) return;
    const { v, c, n } = this.datos();
    this.el.querySelector('[data-vr-precio]').innerHTML = precioHTML(p, v);
    this.el.querySelector('[data-vr-wsp]').href = waLink(`Hola! Quiero presupuesto por ${n} × ${p.nombre} ${p.cod} (${detalleLinea(p, v, c)}).`);
  },
  html(p, vIni, cIni) {
    const vSel = varianteDe(p, vIni)?.id || p.variantes[0].id;
    const cSel = colorDe(p, cIni)?.id || null;
    const gal = [{ src: imgDe(p, cSel), ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])];
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { sub: p.sub, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto"><img data-vr-img src="${gal[0].src}" width="${gal[0].ancho}" height="${gal[0].alto}" alt="${esc(gal[0].alt)}"></div>
        ${gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}"><img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(p.cod)} · ${esc(catDe(p.cat).nombre)} · ${esc(tipoDe(p.sub).nombre)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio" data-vr-precio>${precioHTML(p, vSel)}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        <fieldset class="vr__grupo"><legend>${esc(p.etiqueta || 'Medida')}</legend><div class="vr__variantes">${p.variantes.map(v => `<label class="opcion opcion--var"><input type="radio" name="vr-var" value="${v.id}"${v.id === vSel ? ' checked' : ''}><span>${esc(v.nombre)}</span><small>${formatearPrecio(precioFinal(p, v.id))}</small></label>`).join('')}</div></fieldset>
        ${p.colores ? `<fieldset class="vr__grupo"><legend>Color de la estructura</legend><div class="colores">${p.colores.map(c => `<label class="color"><input type="radio" name="vr-color" value="${c.id}"${c.id === cSel ? ' checked' : ''}><i style="--c:${c.hex}"></i>${esc(c.nombre)}</label>`).join('')}</div></fieldset>` : ''}
        <div class="vr__acciones">
          <div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vr-add>Agregar al carrito</button>
          <button type="button" class="btn btn--ink" data-vr-buy>Comprar ahora</button>
        </div>
        <a class="vr__wsp" data-vr-wsp href="${waLink(`Hola! Quiero presupuesto por ${p.nombre} ${p.cod}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Pedir presupuesto por cantidad</a>
        <dl class="vr__datos"><div><dt>Código</dt><dd>${esc(p.cod)}</dd></div>${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span><b>${esc(r.nombre)}</b><small>Desde ${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  open(id, v, c) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.cuerpo.innerHTML = this.html(p, v, c);
    this.el.setAttribute('aria-label', p.nombre);
    this.sync();
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(comprar) {
    const p = this.actual; if (!p) return;
    const { v, c, n } = this.datos();
    Cart.add(p, n, v, c);
    if (comprar) { this.close(true); Drawer.open(); return; }
    showToast(`Sumaste ${n} × ${p.nombre} (${detalleLinea(p, v, c)})`);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
    if (PAGINA === 'catalogo') { const u = new URL(location.href); if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); history.replaceState(null, '', u); } }
  },
};

function initCardAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-card]');
      const p = getProducto(card?.dataset.card);
      const span = st.querySelector('[data-cant]');
      const n = Math.max(1, Math.min(p?.stock ?? 99, Number(span.textContent) + Number(paso.dataset.paso)));
      span.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.buy;
    const p = getProducto(id); if (!p) return;
    const card = add.closest('[data-card]');
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    Cart.add(p, n, p.variantes[0].id, p.colores?.[0]?.id || null);
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const btn = card?.querySelector('[data-add]');
    const txt = btn?.querySelector('.prod-add__txt');
    if (btn && txt) { btn.classList.add('ok'); txt.textContent = '¡Sumado!'; setTimeout(() => { btn.classList.remove('ok'); txt.textContent = 'Agregar'; }, 1400); }
    showToast(`Sumaste ${n} × ${p.nombre} (${detalleLinea(p, p.variantes[0].id, p.colores?.[0]?.id)}). La medida la cambiás en la ficha.`);
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const link = document.querySelector('[data-preview-link]');
  const pintar = (cat, animar) => {
    const res = Tienda.consultar({ filtros: cat ? { cat: [cat] } : {}, orden: 'destacados', limite: 8 });
    cont.innerHTML = res.items.map(p => cardHTML(p, true)).join('');
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.tab === cat)));
    if (link) {
      link.href = cat ? `${CATALOGO_URL}?cat=${cat}` : CATALOGO_URL;
      link.firstChild.textContent = cat ? `Ver todo ${catDe(cat).nombre} ` : 'Ver todo el catálogo ';
    }
    if (animar) revelarNuevos(cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => pintar(t.dataset.tab, true)));
  pintar('', false);
}

function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const res = Tienda.consultar({ orden: 'destacados', limite: 8 });
  cont.innerHTML = res.items.map(p => `<li class="rail__item" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, false)}</li>`).join('');
}

const TALLES = {
  3: { mesa: 59, asiento: 35, est: '1,19 a 1,42 m', nivel: '1.° a 3.° grado' },
  4: { mesa: 64, asiento: 38, est: '1,33 a 1,59 m', nivel: '4.° a 7.° grado' },
  5: { mesa: 71, asiento: 43, est: '1,46 a 1,76 m', nivel: 'secundaria' },
  6: { mesa: 76, asiento: 46, est: '1,59 a 1,88 m', nivel: 'terciario y adultos' },
};
function calcularGuia(modo, valor) {
  if (modo === 'mesa' && valor === 'oficina') {
    return { mesa: 75, asiento: 50, respaldo: 46, banqueta: false, frente: false,
      titulo: 'Silla con asiento regulable de 45 a 55 cm', etiquetaAsiento: '45–55 cm',
      detalle: 'Con el escritorio a 75 cm, cada persona sube o baja el asiento hasta apoyar los antebrazos a la altura de la tapa.',
      prods: [['silla-operativa-malla', 'basculante'], ['escritorio-cajonera', '140']], cat: 'oficina', sub: '' };
  }
  if (modo === 'mesa') {
    return { mesa: 75, asiento: 45, respaldo: 38, banqueta: false, frente: false,
      titulo: 'Silla de 45 cm de asiento', detalle: 'Con la mesa a 75 cm quedan 30 cm de luz entre el asiento y la tapa: lo justo para las piernas.',
      prods: [['silla-gastro', 'grafito'], ['mesa-bar', '70']], cat: 'gastronomia', sub: '' };
  }
  if (modo === 'barra') {
    const alto = Math.round(Math.min(115, Math.max(85, Number(valor) || 105)));
    const asiento = alto <= 97 ? 65 : 75;
    const luz = alto - asiento;
    const nota = luz < 25 ? ': queda un poco justo, conviene bajar la barra' : luz > 35 ? ': queda holgado, conviene una barra más baja' : ', la medida cómoda';
    return { mesa: alto, asiento, respaldo: 0, banqueta: true, frente: true,
      titulo: `Banqueta de ${asiento} cm`, detalle: `Con la barra a ${alto} cm quedan ${luz} cm de luz entre el asiento y la tapa${nota}.`,
      prods: [['banqueta-alta', String(asiento)]], cat: 'gastronomia', sub: 'banquetas', salida: `${alto} cm` };
  }
  const est = Math.round(Math.min(190, Math.max(115, Number(valor) || 145)));
  const talle = est < 133 ? 3 : est < 146 ? 4 : est < 159 ? 5 : 6;
  const t = TALLES[talle];
  return { mesa: t.mesa, asiento: t.asiento, respaldo: 30, banqueta: false, frente: false,
    titulo: `Talle ${talle}: mesa de ${t.mesa} cm y asiento de ${t.asiento} cm`,
    detalle: `Para alumnos de ${t.est} de estatura (${t.nivel}, como referencia).`,
    prods: [['pupitre', `t${talle}`], ['silla-escolar', `t${talle}`]], cat: 'escolar', sub: '', salida: `${String(est / 100).replace('.', ',')} m` };
}

function initGuia() {
  const card = document.querySelector('[data-guia]');
  if (!card) return;
  const svg = card.querySelector('[data-plano]');
  const piso = 270, esc2 = 2;
  const $ = s => svg.querySelector(s);
  const pone = (el, ty, sy = null, op = null) => {
    if (!el) return;
    el.style.transform = sy == null ? `translate(0px, ${ty}px)` : `translate(0px, ${ty}px) scale(1, ${Math.max(sy, 0.001)})`;
    if (op != null) el.style.opacity = op;
  };
  const titulo = card.querySelector('[data-g-titulo]');
  const detalle = card.querySelector('[data-g-detalle]');
  const prods = card.querySelector('[data-g-prods]');
  const link = card.querySelector('[data-g-link]');
  let modo = 'mesa';
  const valorDe = m => (m === 'mesa' ? card.querySelector('[name="g-mesa"]:checked')?.value : card.querySelector(`[data-g-rango="${m}"]`)?.value);
  function dibujar(r) {
    const yM = piso - r.mesa * esc2;
    const yS = piso - r.asiento * esc2;
    pone($('.pl-tapa'), yM);
    pone($('.pl-pata--a'), yM + 7, piso - yM - 7, r.frente ? 0 : 1);
    pone($('.pl-pata--b'), yM + 7, piso - yM - 7, r.frente ? 0 : 1);
    pone($('.pl-frente'), yM + 7, piso - yM - 7, r.frente ? 1 : 0);
    pone($('.pl-asiento'), yS);
    pone($('.pl-spata--a'), yS + 7, piso - yS - 7);
    pone($('.pl-spata--b'), yS + 7, piso - yS - 7);
    pone($('.pl-respaldo'), yS - r.respaldo * esc2, r.respaldo * esc2, r.banqueta ? 0 : 1);
    pone($('.pl-aro'), piso - Math.round((piso - yS) * 0.36), null, r.banqueta ? 1 : 0);
    const cota = (sel, y, txt) => {
      const g = $(sel);
      pone(g.querySelector('.pl-cota__linea'), y, piso - y);
      pone(g.querySelector('.pl-cota__tope:not(.pl-cota__tope--piso)'), y);
      pone(g.querySelector('.pl-cota__label'), (y + piso) / 2);
      g.querySelector('text').textContent = txt;
    };
    cota('.pl-cota--asiento', yS, r.etiquetaAsiento || `${r.asiento} cm`);
    cota('.pl-cota--mesa', yM, `${r.mesa} cm`);
    const luz = $('.pl-luz');
    pone(luz.querySelector('.pl-luz__linea'), yM, Math.max(yS - yM, 1));
    pone(luz.querySelector('.pl-luz__tope'), yM);
    pone(luz.querySelector('.pl-luz__label'), (yM + yS) / 2);
    luz.querySelector('text').textContent = `${r.mesa - r.asiento} cm de luz`;
  }
  function pintar() {
    const r = calcularGuia(modo, valorDe(modo));
    dibujar(r);
    if (r.salida) { const out = card.querySelector(`[data-g-out="${modo}"]`); if (out) out.textContent = r.salida; }
    titulo.textContent = r.titulo;
    detalle.textContent = r.detalle;
    prods.innerHTML = r.prods.map(([id, v]) => {
      const p = getProducto(id); if (!p) return '';
      const vn = varianteDe(p, v);
      return `<li class="gprod"><button type="button" class="gprod__foto" data-quick="${p.id}" data-v="${vn.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt=""></button>
        <div class="gprod__info"><button type="button" class="gprod__nombre" data-quick="${p.id}" data-v="${vn.id}">${esc(p.nombre)}</button><span class="gprod__var">${esc(p.cod)} · ${esc(vn.nombre)}</span><b>${formatearPrecio(precioFinal(p, vn.id))}</b></div>
        <button type="button" class="btn btn--cta btn--chico" data-g-add="${p.id}" data-v="${vn.id}">Agregar</button></li>`;
    }).join('');
    const nombre = r.sub ? tipoDe(r.sub).nombre : catDe(r.cat).nombre;
    link.href = `${CATALOGO_URL}?cat=${r.cat}${r.sub ? `&sub=${r.sub}` : ''}`;
    link.firstChild.textContent = `Ver ${nombre} en el catálogo `;
  }
  card.querySelectorAll('[data-modo]').forEach(b => b.addEventListener('click', () => {
    modo = b.dataset.modo;
    card.querySelectorAll('[data-modo]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    card.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== modo; });
    pintar();
  }));
  card.addEventListener('input', e => { if (e.target.matches('[data-g-rango]')) pintar(); });
  card.addEventListener('change', e => { if (e.target.name === 'g-mesa') pintar(); });
  card.addEventListener('click', e => {
    const b = e.target.closest('[data-g-add]');
    if (!b) return;
    const p = getProducto(b.dataset.gAdd); if (!p) return;
    Cart.add(p, 1, b.dataset.v, p.colores?.[0]?.id || null);
    b.textContent = '¡Sumado!';
    setTimeout(() => { b.textContent = 'Agregar'; }, 1400);
    showToast(`Sumaste ${p.nombre} (${detalleLinea(p, b.dataset.v, p.colores?.[0]?.id)})`);
  });
  pintar();
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false, moved = false, startX = 0, startL = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startL = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) { vp.scrollLeft = startL - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) setTimeout(() => vp.classList.remove('dragging'), 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('.rail__item')?.offsetWidth || 300) + 18;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 4) + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const contador = document.querySelector('[data-contador]');
  const mostrando = document.querySelector('[data-mostrando]');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-vacio]');
  const qIn = document.getElementById('q');
  const ordenSel = document.querySelector('[data-orden]');
  const filtros = document.getElementById('filtros');
  const filtrosBd = document.querySelector('[data-filtros-bd]');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const nFiltros = document.querySelector('[data-filtros-n]');
  const limpiarTop = document.querySelector('[data-limpiar-top]');
  const miga = document.querySelector('[data-miga-cat]');
  const chips = [...document.querySelectorAll('[data-cat-chip]')];
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const lista = (k, ref) => (params.get(k) || '').split(',').filter(v => valida(ref, v));
  const e = {
    cat: lista('cat', CATEGORIAS).slice(0, 1),
    sub: lista('sub', TIPOS),
    mat: lista('mat', MATERIALES),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'sub' && e.sub.length) f.sub = e.sub;
    if (sin !== 'mat' && e.mat.length) f.mat = e.mat;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('sub', e.sub.join(','));
    set('mat', e.mat.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const pintarControles = () => {
    document.querySelectorAll('input[data-f="sub"]').forEach(i => { i.checked = e.sub.includes(i.value); });
    document.querySelectorAll('input[data-f="mat"]').forEach(i => { i.checked = e.mat.includes(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => {
      const [g, v] = s.dataset.n.split(':');
      s.textContent = Tienda.contar({ ...filtrosDe(g), [g]: [v] });
    });
    const todos = document.querySelector('[data-n-todos]');
    if (todos) todos.textContent = Tienda.contar(filtrosDe('cat'));
    const enPanel = e.sub.length + e.mat.length + (e.precio ? 1 : 0);
    const activos = enPanel + e.cat.length + (e.q.trim() ? 1 : 0);
    if (nFiltros) { nFiltros.textContent = enPanel; nFiltros.hidden = !enPanel; }
    if (limpiarTop) limpiarTop.hidden = !activos;
    if (miga) {
      const c = e.cat.length === 1 ? catDe(e.cat[0]) : null;
      miga.hidden = !c;
      miga.innerHTML = c ? `<span aria-current="page">${esc(c.nombre)}</span>` : '';
    }
    document.querySelectorAll('.nav-cats__col > a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (e.cat.length === 1 && id === e.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  function render(reiniciar) {
    const f = { ...filtrosDe(), q: e.q.trim() };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosDe());
    const q = e.q.trim();
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${total} ${total === 1 ? 'modelo' : 'modelos'}${e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : ''}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const aplicar = () => { urlSync(); pintarControles(); render(true); };
  document.addEventListener('change', ev => {
    const i = ev.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    if (g === 'precio') e.precio = i.checked ? i.value : '';
    else e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  chips.forEach(c => c.addEventListener('click', () => { e.cat = c.dataset.catChip ? [c.dataset.catChip] : []; aplicar(); }));
  ordenSel?.addEventListener('change', () => { e.orden = valida(ORDENES, ordenSel.value) ? ordenSel.value : 'destacados'; aplicar(); });
  let tq = 0;
  qIn?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = qIn.value.slice(0, 60); aplicar(); }, 220); });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = qIn.value.slice(0, 60); aplicar(); qIn.blur(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    e.cat = []; e.sub = []; e.mat = []; e.precio = ''; e.q = '';
    aplicar();
  }));
  verMas.addEventListener('click', () => render(false));
  const drawerMq = window.matchMedia(MODELO === '2' ? 'all' : '(max-width: 1024px)');
  const abrirFiltros = () => {
    if (!drawerMq.matches) return;
    abrirCapa(filtros, filtrosBd);
    abrirBtn?.setAttribute('aria-expanded', 'true');
    revelarNuevos(filtros);
    setTimeout(() => filtros.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); filtrosBd?.classList.remove('open');
    capas.delete(filtros);
    if (!capas.size) document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!filtros.classList.contains('open') && filtrosBd) filtrosBd.hidden = true; }, 400);
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  abrirBtn?.addEventListener('click', abrirFiltros);
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  filtrosBd?.addEventListener('click', cerrarFiltros);
  filtros.addEventListener('keydown', ev => { if (!filtros.classList.contains('open')) return; if (ev.key === 'Escape') cerrarFiltros(); else atrapar(filtros, ev); });
  drawerMq.addEventListener?.('change', () => { if (!drawerMq.matches) cerrarFiltros(); });
  pintarControles();
  render(true);
  urlSync();
  if (params.get('buscar') && qIn) setTimeout(() => qIn.focus(), 300);
}

function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => Vista.open(id), 350);
}

initMenuCategorias();
initCuentas();
initPreview();
initDestacados();
initCatalogo();
initGuia();
initReveals();
initHeroMotion();
initScrollDetalles();
initNav();
initModelBarScroll();
Drawer.init();
Vista.init();
initCardAcciones();
initFloats();
updateCartBadge();
initRail();
abrirProductoDeUrl();
