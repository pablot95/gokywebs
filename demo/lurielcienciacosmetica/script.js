const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491151768484';
const MARCA = 'Luriel';
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
  { id: 'serums', nombre: 'Sérums y tónicos', bajada: 'Tratan e hidratan', img: 'images/p-serum.webp',
    texto: 'Sérums y brumas que tratan e hidratan la piel, con la forma de uso en cada ficha.',
    subs: [{ id: 'serums-faciales', nombre: 'Sérums faciales' }, { id: 'tonicos', nombre: 'Tónicos y brumas' }] },
  { id: 'limpieza', nombre: 'Limpieza facial', bajada: 'El primer paso', img: 'images/p-espuma.webp',
    texto: 'Espumas y aceites para limpiar y desmaquillar sin resecar, a la mañana y a la noche.',
    subs: [{ id: 'limpiadores', nombre: 'Limpiadores' }, { id: 'desmaquillantes', nombre: 'Desmaquillantes' }] },
  { id: 'hidratacion', nombre: 'Hidratación facial', bajada: 'Cremas y labios', img: 'images/p-crema.webp',
    texto: 'Cremas y bálsamos que hidratan y cierran la rutina.',
    subs: [{ id: 'cremas', nombre: 'Cremas' }, { id: 'labios', nombre: 'Labios' }] },
  { id: 'accesorios', nombre: 'Accesorios y bienestar', bajada: 'Brochas, jade y más', img: 'images/p-rodillo.webp',
    texto: 'Brochas, rodillo de jade, gua sha y accesorios para tu rutina de belleza y bienestar.',
    subs: [{ id: 'maquillaje-acc', nombre: 'Maquillaje' }, { id: 'masaje', nombre: 'Masaje facial' }, { id: 'limpieza-acc', nombre: 'Limpieza' }] },
];
const NECESIDADES = [
  { id: 'hidratacion', nombre: 'Hidratación', frase: 'Piel tirante o seca', consejo: 'Sérum y crema, mañana y noche: la constancia hace la diferencia.' },
  { id: 'limpieza', nombre: 'Limpieza profunda', frase: 'Brillo, poros o restos de maquillaje', consejo: 'De noche, doble limpieza: primero el aceite y después la espuma.' },
  { id: 'luminosidad', nombre: 'Luminosidad', frase: 'Piel opaca o cansada', consejo: 'Hidratación diaria y protector solar: la luminosidad llega con la constancia.' },
  { id: 'sensible', nombre: 'Piel sensible', frase: 'Se irrita con facilidad', consejo: 'Probá cada producto nuevo en el antebrazo 24 horas antes de llevarlo a la cara.' },
  { id: 'masaje', nombre: 'Masaje y relax', frase: 'Rostro hinchado o tenso', consejo: 'Rodillo y gua sha sobre el sérum, de adentro hacia afuera, tres veces por semana.' },
  { id: 'maquillaje', nombre: 'Maquillaje', frase: 'Aplicarlo y retirarlo bien', consejo: 'Lavá las brochas cada semana y desmaquillate siempre antes de dormir.' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: null, max: 15000 },
  { id: '15a22', nombre: '$15.000 a $22.000', min: 15001, max: 22000 },
  { id: 'mas22', nombre: 'Más de $22.000', min: 22001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  serums: 'serum serums suero tratamiento', limpieza: 'limpieza limpiar lavar desmaquillar', hidratacion: 'hidratacion hidratante humectante',
  accesorios: 'accesorios bienestar', 'serums-faciales': 'serum facial gotero', tonicos: 'tonico bruma spray agua de rosas',
  limpiadores: 'espuma limpiador jabon gel', desmaquillantes: 'desmaquillante aceite doble limpieza', cremas: 'crema hidratante pote',
  labios: 'labios labial balsamo', 'maquillaje-acc': 'brochas pinceles maquillaje', masaje: 'jade rodillo gua sha masaje facial piedra',
  'limpieza-acc': 'discos algodon vincha reutilizables', luminosidad: 'luminosidad brillo glow', sensible: 'sensible irritada suave',
  maquillaje: 'maquillaje makeup make up', masaje_nec: 'relax descongestionar',
};

const Tienda = crearTienda([
  { id: 'serum-hialuronico', nombre: 'Sérum Facial Ácido Hialurónico 30 ml', cat: 'serums', sub: 'serums-faciales', nec: ['hidratacion', 'luminosidad'], precio: 27900, descuento: 0, stock: 12, alta: 30, rango: 1, tag: 'Más elegido',
    img: 'images/p-serum.webp', escena: 'images/serum-alto.webp',
    alt: 'Frasco gotero de vidrio rosado con sérum facial, sobre una piedra y una tela rosa', desc: 'Sérum liviano que hidrata en profundidad y deja la piel tersa. Se absorbe rápido y va debajo de la crema, de día y de noche.',
    prospecto: { sirve: 'Hidrata la piel en profundidad, suaviza la textura y la prepara para la crema. Apto para todo tipo de piel.',
      pasos: ['Limpiá la piel y secala con suaves toques.', 'Colocá 3 o 4 gotas en la yema de los dedos.', 'Aplicá con palmaditas en rostro, cuello y escote, sin frotar.', 'Esperá un minuto a que se absorba y seguí con la crema.'],
      momento: ['manana', 'noche'], frecuencia: 'Todos los días, mañana y noche', cantidad: '3 a 4 gotas',
      precauciones: ['Uso externo. Evitá el contacto con los ojos.', 'Si aparece enrojecimiento o picazón, suspendé el uso.', 'De día, completá la rutina con protector solar.'],
      activos: 'Ácido hialurónico, glicerina y pantenol.', conservacion: 'Cerrado y lejos del sol. Usalo dentro de los 6 meses de abierto.' } },
  { id: 'crema-hidratante', nombre: 'Crema Facial Hidratante 50 g', cat: 'hidratacion', sub: 'cremas', nec: ['hidratacion', 'sensible'], precio: 24900, descuento: 0, stock: 10, alta: 29, rango: 2,
    img: 'images/p-crema.webp', escena: 'images/hero-crema.webp',
    alt: 'Pote de crema facial blanco con tapa rosa sobre mármol', desc: 'Crema de textura sedosa que hidrata durante el día y cierra la rutina de la noche, sin dejar la piel grasa.',
    prospecto: { sirve: 'Hidrata, suaviza y protege la barrera natural de la piel. Cierra la rutina y sella el sérum.',
      pasos: ['Tomá una cantidad del tamaño de una arveja.', 'Distribuila en cinco puntos: frente, mejillas, nariz y mentón.', 'Extendé con movimientos hacia arriba hasta que se absorba.'],
      momento: ['manana', 'noche'], frecuencia: 'Mañana y noche', cantidad: 'Del tamaño de una arveja',
      precauciones: ['Uso externo.', 'De día, aplicá protector solar encima.'],
      activos: 'Ceramidas, manteca de karité y ácido hialurónico.', conservacion: 'Cerrada y en un lugar fresco. Usala dentro de los 6 meses de abierta.' } },
  { id: 'espuma-limpieza', nombre: 'Espuma de Limpieza Facial 150 ml', cat: 'limpieza', sub: 'limpiadores', nec: ['limpieza', 'sensible'], precio: 16500, descuento: 0, stock: 14, alta: 26, rango: 3,
    img: 'images/p-espuma.webp', escena: null,
    alt: 'Frasco blanco con válvula espumadora junto a un poco de espuma y flores rosas', desc: 'Espuma suave que limpia sin resecar y deja la piel lista para el resto de la rutina.',
    prospecto: { sirve: 'Retira el exceso de grasa, el sudor y los restos de maquillaje sin resecar. Es el primer paso de la rutina.',
      pasos: ['Mojá el rostro con agua tibia.', 'Colocá 1 o 2 bombeos de espuma en las manos.', 'Masajeá con movimientos circulares durante 30 segundos.', 'Enjuagá con abundante agua y secá con suaves toques.'],
      momento: ['manana', 'noche'], frecuencia: 'Mañana y noche', cantidad: '1 a 2 bombeos',
      precauciones: ['Evitá el contacto con los ojos; si pasa, enjuagá con agua.', 'Si usás maquillaje, desmaquillate antes.'],
      activos: 'Limpiadores suaves, extracto de manzanilla y glicerina.', conservacion: 'Cerrada y lejos del calor.' } },
  { id: 'set-brochas', nombre: 'Set de 7 Brochas de Maquillaje', cat: 'accesorios', sub: 'maquillaje-acc', nec: ['maquillaje'], precio: 22900, descuento: 10, stock: 6, alta: 23, rango: 4,
    img: 'images/p-brochas.webp', escena: null,
    alt: 'Siete brochas de maquillaje con mango rosa y virola dorada', desc: 'Siete brochas de fibra sintética suave para base, polvo, rubor y sombras.',
    prospecto: { sirve: 'Para aplicar base, polvo, rubor, contorno y sombras con un acabado parejo.',
      pasos: ['Usá las brochas grandes para polvo y rubor, y las chicas para los ojos.', 'Retirá el exceso de producto antes de aplicar.', 'Difuminá con movimientos circulares y suaves.'],
      momento: [], frecuencia: 'Lavalas una vez por semana', cantidad: 'Una brocha por producto',
      precauciones: ['Lavalas con jabón neutro y agua tibia.', 'Secalas acostadas, nunca con las cerdas hacia arriba.'],
      activos: 'Fibra sintética, virola de aluminio y mango de madera.', conservacion: 'Secas y guardadas en su estuche.' } },
  { id: 'bruma-tonica', nombre: 'Bruma Facial Tónica 60 ml', cat: 'serums', sub: 'tonicos', nec: ['hidratacion', 'sensible'], precio: 15900, descuento: 0, stock: 15, alta: 27, rango: 5,
    img: 'images/p-bruma.webp', escena: null,
    alt: 'Frasco transparente con atomizador rosa, sobre una piedra con gotas de agua y flores', desc: 'Bruma refrescante que tonifica y equilibra la piel después de la limpieza. También sirve para fijar el maquillaje.',
    prospecto: { sirve: 'Equilibra la piel después de la limpieza, la refresca y ayuda a que el sérum se absorba mejor. También fija el maquillaje.',
      pasos: ['Agitá antes de usar.', 'Con los ojos cerrados, rociá a unos 20 cm del rostro.', 'Dejá que se absorba sola o ayudala con suaves toques.'],
      momento: ['manana', 'noche'], frecuencia: 'Después de cada limpieza', cantidad: '2 o 3 rocíos',
      precauciones: ['No la rocíes directo en los ojos.', 'Mantenela fuera del alcance de los niños.'],
      activos: 'Agua de rosas, aloe vera y niacinamida.', conservacion: 'En un lugar fresco. Usala dentro de los 12 meses de abierta.' } },
  { id: 'aceite-desmaquillante', nombre: 'Aceite Desmaquillante 200 ml', cat: 'limpieza', sub: 'desmaquillantes', nec: ['limpieza', 'maquillaje'], precio: 18900, descuento: 0, stock: 9, alta: 25, rango: 6,
    img: 'images/p-aceite.webp', escena: null,
    alt: 'Frasco de vidrio ámbar con dosificador negro, sobre una piedra con flores rosas', desc: 'Aceite que disuelve el maquillaje, incluso el de larga duración, y se enjuaga sin dejar sensación grasa.',
    prospecto: { sirve: 'Disuelve el maquillaje, el protector solar y la suciedad del día. Es el primer paso de la doble limpieza de la noche.',
      pasos: ['Con el rostro y las manos secos, colocá 2 bombeos en las palmas.', 'Masajeá sobre el rostro y los ojos cerrados durante un minuto.', 'Mojá las manos y seguí masajeando: el aceite se vuelve lechoso.', 'Enjuagá y continuá con la espuma de limpieza.'],
      momento: ['noche'], frecuencia: 'Todas las noches, o cuando te maquilles', cantidad: '2 bombeos',
      precauciones: ['Usalo con el rostro y las manos secos.', 'Si te entra en los ojos, enjuagá con agua tibia.'],
      activos: 'Aceites de jojoba y de almendras, vitamina E.', conservacion: 'Lejos del sol. Usalo dentro de los 12 meses de abierto.' } },
  { id: 'balsamo-labial', nombre: 'Bálsamo Labial Hidratante', cat: 'hidratacion', sub: 'labios', nec: ['hidratacion', 'maquillaje'], precio: 8900, descuento: 0, stock: 20, alta: 24, rango: 7,
    var: { tipo: 'Tono', ops: ['Rosa suave', 'Sin color'] }, img: 'images/p-balsamo.webp', escena: null,
    alt: 'Bálsamo labial rosa abierto junto a su tapa', desc: 'Bálsamo que nutre y protege los labios, sin color o con un rosa suave.',
    prospecto: { sirve: 'Nutre y protege los labios del frío y la sequedad. El tono rosa suave suma un toque de color.',
      pasos: ['Aplicalo directo sobre los labios limpios.', 'Repetí durante el día cuando lo necesites.'],
      momento: ['manana', 'noche'], frecuencia: 'Las veces que haga falta', cantidad: 'Una pasada',
      precauciones: ['Si notás irritación, suspendé el uso.'],
      activos: 'Manteca de karité, cera de abejas y vitamina E.', conservacion: 'Lejos del calor directo.' } },
  { id: 'rodillo-jade', nombre: 'Rodillo de Jade y Gua Sha', cat: 'accesorios', sub: 'masaje', nec: ['masaje', 'sensible'], precio: 19900, descuento: 0, stock: 8, alta: 31, rango: 8, tag: 'Nuevo',
    img: 'images/p-rodillo.webp', escena: null,
    alt: 'Rodillo facial y piedra gua sha de jade verde sobre un paño de lino', desc: 'Rodillo y piedra gua sha de jade para masajes faciales que descongestionan y relajan.',
    prospecto: { sirve: 'Masajes faciales que descongestionan, relajan la tensión y ayudan a que el sérum se absorba.',
      pasos: ['Aplicá antes tu sérum o unas gotas de aceite.', 'Deslizá el rodillo desde el centro del rostro hacia afuera y hacia arriba.', 'Con la gua sha, recorré mandíbula y pómulos en un ángulo bajo, cinco veces por zona.'],
      momento: ['noche'], frecuencia: '3 a 5 minutos, tres veces por semana', cantidad: 'Cinco pasadas por zona',
      precauciones: ['No lo uses sobre piel irritada, heridas o acné activo.', 'Presión suave: no tiene que doler.'],
      activos: 'Piedra de jade y montura de metal dorado.', conservacion: 'Lavalo con agua y jabón después de cada uso. En la heladera suma un efecto descongestivo.' } },
  { id: 'kit-discos', nombre: 'Kit Discos Desmaquillantes Reutilizables + Vincha', cat: 'accesorios', sub: 'limpieza-acc', nec: ['limpieza', 'maquillaje'], precio: 12900, descuento: 0, stock: 16, alta: 28, rango: 9,
    img: 'images/p-discos.webp', escena: null,
    alt: 'Pila de discos desmaquillantes blancos junto a una vincha rosa de toalla', desc: 'Diez discos de algodón reutilizables y una vincha de toalla para despejar el rostro durante la rutina.',
    prospecto: { sirve: 'Para retirar el maquillaje y aplicar la bruma sin descartables. La vincha despeja el rostro durante la rutina.',
      pasos: ['Humedecé un disco con agua o con la bruma.', 'Pasalo suave, de adentro hacia afuera.', 'Después de usarlos, lavalos dentro de una bolsita de red.'],
      momento: ['manana', 'noche'], frecuencia: 'En cada rutina', cantidad: '1 o 2 discos',
      precauciones: ['Lavá los discos antes del primer uso.', 'Secalos al aire, sin secarropas.'],
      activos: '10 discos de algodón y bambú, y una vincha de toalla.', conservacion: 'Secos y en un lugar ventilado.' } },

  { id: 'protector-proximo', nombre: 'Protector Solar Facial FPS 50', cat: 'hidratacion', sub: 'cremas', nec: ['hidratacion'], precio: 23900, descuento: 0, stock: 0, alta: 32, visible: false,
    img: 'images/p-crema.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, p.prospecto?.activos || '', ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ...(p.nec || []).map(n => `${n} ${ETIQUETAS[n] || ''} ${ETIQUETAS[`${n}_nec`] || ''}`), ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), nec = lista(f.nec), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (nec.length && !(p.nec || []).some(n => nec.includes(n))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function facetas(filtros = {}) {
    const nec = {}, subs = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.nec || []).forEach(x => { nec[x] = (nec[x] || 0) + 1; });
      subs[p.sub] = (subs[p.sub] || 0) + 1;
    });
    return { nec, subs };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const tipoVar = p => p.var?.tipo || 'Tono';
const varTxt = (p, op) => `${tipoVar(p).toLowerCase()} ${op}`;

const Cart = {
  KEY: 'prettycosmetica_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
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
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'prettycosmetica_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return subDe(p)?.nombre || nombreDe(CATEGORIAS, p.cat);
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 5) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tonosHTML(p) {
  if (!conVar(p)) return '';
  return `<span class="prod__tonos">${p.var.ops.length} ${p.var.tipo === 'Color' ? 'colores' : 'tonos'}</span>`;
}

function cardHTML(p, { mini = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver detalle</span></div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (mini) {
    return `<article class="prod prod--mini">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" width="400" height="400" decoding="async"></a>
      <div class="prod__body">${titulo}${precioHTML(p)}</div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">${esc(tipoVar(p))} de ${nombre}</span><select data-op><option value="">${esc(tipoVar(p))}</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      <div class="prod__precio-fila">${precioHTML(p)}${tonosHTML(p)}</div>
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-nec"><p class="cats-nec__tit">Por objetivo</p>${NECESIDADES.map(n => `<a href="${CATALOGO_URL}?nec=${n.id}">${esc(n.nombre)}</a>`).join('')}</div>`
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
  if (PAGINA === 'catalogo' && catActual) {
    document.querySelectorAll('.main-nav > a').forEach(a => {
      if (new URL(a.href, location.href).searchParams.get('cat') === catActual) a.setAttribute('aria-current', 'page');
    });
  }
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
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

function initBuscadorVivo() {
  document.querySelectorAll('[data-buscador-vivo]').forEach(form => {
    const input = form.querySelector('input');
    const lista = form.querySelector('.sugerencias');
    if (!input || !lista) return;
    let t = 0, cursor = null, q = '';
    const cerrar = () => { lista.hidden = true; input.setAttribute('aria-expanded', 'false'); };
    const fila = p => `<li><button type="button" class="sug" data-qv-abrir="${p.id}"><img src="${p.img}" alt="" width="56" height="56"><span><span class="sug__nombre">${esc(p.nombre)}</span><span class="sug__meta">${esc(metaDe(p))}</span></span><span class="sug__precio">${formatearPrecio(precioFinal(p))}</span></button></li>`;
    const pintar = (agregar) => {
      const res = Tienda.consultar({ filtros: { q }, cursor: agregar ? cursor : null, limite: 5 });
      cursor = res.cursor;
      const items = res.items.map(fila).join('');
      if (!agregar) {
        lista.innerHTML = items
          ? `<ul class="sug-lista">${items}</ul>`
          : `<p class="sug-vacio">No encontramos «${esc(q)}» en la tienda. <a href="${wspHref(`Hola ${MARCA}! ¿Tienen ${q}?`)}" target="_blank" rel="noopener">Preguntanos por WhatsApp</a></p>`;
      } else {
        lista.querySelector('.sug-lista')?.insertAdjacentHTML('beforeend', items);
      }
      lista.querySelector('.sug-pie')?.remove();
      if (res.items.length || agregar) {
        lista.insertAdjacentHTML('beforeend', `<div class="sug-pie">${cursor ? '<button type="button" class="sug-mas" data-sug-mas>Más resultados</button>' : ''}<a href="${CATALOGO_URL}?q=${encodeURIComponent(q)}">Ver todo en el catálogo ${ICON.flecha}</a></div>`);
      }
      lista.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        q = input.value.trim().slice(0, 60);
        if (q.length < 2) { cerrar(); return; }
        pintar(false);
      }, 200);
    });
    lista.addEventListener('click', e => {
      if (e.target.closest('[data-sug-mas]')) { pintar(true); return; }
      if (e.target.closest('[data-qv-abrir]')) cerrar();
    });
    form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); input.focus(); } });
    document.addEventListener('click', e => { if (!form.contains(e.target)) cerrar(); });
    form.querySelectorAll('[data-sugerido]').forEach(b => b.addEventListener('click', () => {
      input.value = b.dataset.sugerido;
      input.dispatchEvent(new Event('input'));
      input.focus();
    }));
  });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const q = sel => [...hero.querySelectorAll(sel)];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  if (q('.portada__rotulo').length) tl.from(q('.portada__rotulo'), { y: 20, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.3);
  tl.from(q('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(q('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(q('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(q('.hero-ctas > *, .hero-buscador'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  if (q('.sello').length) tl.from(q('.sello'), { scale: 0.92, opacity: 0, rotate: -20, duration: 1.2, clearProps: 'transform,opacity' }, 0.7);
  if (q('.indice li').length) tl.from(q('.portada__indice-tit, .indice li'), { x: 32, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

function initHome() {
  if (PAGINA !== 'home') return;
  const lista = document.getElementById('destacadosLista');
  if (lista) {
    const rail = lista.classList.contains('rail-track');
    const estado = rail ? 'data-animate="der" style="opacity:0;transform:translateX(56px)"' : 'data-animate="subir" style="opacity:0;transform:translateY(48px)"';
    lista.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
      .map(p => `<li ${estado}>${cardHTML(p)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catN });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 18;
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('button, select, input')) return;
    pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) { matar = true; setTimeout(() => { matar = false; }, 0); }
    vp.classList.remove('dragging');
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
}

const ICON_GUIA = {
  sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  luna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>',
  imprimir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
};
const MOMENTOS = { manana: { nombre: 'Mañana', ico: 'sol' }, noche: { nombre: 'Noche', ico: 'luna' } };
const pad2 = n => String(n).padStart(2, '0');

function fichaHTML(p, n) {
  const pr = p.prospecto;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const momentos = (pr.momento || []).map(m => `<span class="momento">${ICON_GUIA[MOMENTOS[m].ico]}${MOMENTOS[m].nombre}</span>`).join('');
  return `
    <header class="ficha__head">
      <p class="ficha__folio"><span>Prospecto N.º ${pad2(n)}</span><span>${esc(cat?.nombre || '')}</span></p>
      <h3 class="ficha__nombre">${esc(p.nombre)}</h3>
      ${momentos ? `<div class="ficha__momentos" aria-label="Cuándo se usa">${momentos}</div>` : ''}
    </header>
    <div class="ficha__cuerpo">
      <div class="ficha__col">
        <section class="ficha__sec"><h4><span>01</span>Para qué sirve</h4><p>${esc(pr.sirve)}</p></section>
        <section class="ficha__sec"><h4><span>02</span>Modo de uso</h4><ol class="pasos">${pr.pasos.map(x => `<li>${esc(x)}</li>`).join('')}</ol></section>
      </div>
      <div class="ficha__col">
        <section class="ficha__sec"><h4><span>03</span>Cuándo y cuánto</h4><dl class="ficha__datos"><div><dt>Frecuencia</dt><dd>${esc(pr.frecuencia)}</dd></div><div><dt>Cantidad</dt><dd>${esc(pr.cantidad)}</dd></div></dl></section>
        <section class="ficha__sec"><h4><span>04</span>Precauciones</h4><ul class="ficha__avisos">${pr.precauciones.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
        <section class="ficha__sec"><h4><span>05</span>Composición y conservación</h4><p>${esc(pr.activos)} ${esc(pr.conservacion)}</p></section>
      </div>
    </div>
    <footer class="ficha__pie">
      <div class="ficha__producto"><img src="${p.img}" alt="" width="64" height="64">${precioHTML(p)}</div>
      <div class="ficha__acciones">
        <button type="button" class="btn btn--cta btn--chico" data-add="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn btn--line btn--chico" data-qv-abrir="${p.id}">Ver producto</button>
        <button type="button" class="ficha__imprimir" data-imprimir-ficha>${ICON_GUIA.imprimir}Imprimir prospecto</button>
      </div>
    </footer>
    <p class="ficha__nota">Prospecto de ejemplo: Luriel lo completa con la información de cada producto.</p>`;
}

function initProspecto() {
  const items = document.getElementById('prospectoItems');
  const ficha = document.getElementById('prospectoFicha');
  if (!items || !ficha) return;
  const lista = Tienda.consultar({ orden: 'destacados', limite: 24 }).items.filter(p => p.prospecto);
  if (!lista.length) return;
  const pedido = new URLSearchParams(location.search).get('prospecto');
  let actual = lista.some(p => p.id === pedido) ? pedido : lista[0].id;
  items.innerHTML = lista.map((p, i) => `<li><button type="button" class="pitem" data-prospecto-id="${p.id}" aria-pressed="${p.id === actual}"><span class="pitem__n">${pad2(i + 1)}</span><span class="pitem__nombre">${esc(p.nombre)}</span></button></li>`).join('');
  const pintar = (id, animar) => {
    actual = id;
    const i = lista.findIndex(p => p.id === id);
    ficha.innerHTML = fichaHTML(lista[i], i + 1);
    items.querySelectorAll('[data-prospecto-id]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.prospectoId === id)));
    if (animar && !reduceMotion) { ficha.classList.remove('cambia'); void ficha.offsetWidth; ficha.classList.add('cambia'); }
    refrescarTriggers();
  };
  items.addEventListener('click', e => {
    const b = e.target.closest('[data-prospecto-id]');
    if (b && b.dataset.prospectoId !== actual) pintar(b.dataset.prospectoId, true);
  });
  pintar(actual, false);
}

function initImprimir() {
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-imprimir-ficha]')) return;
    const ficha = e.target.closest('.ficha');
    if (!ficha) return;
    const area = document.createElement('div');
    area.id = 'printArea';
    area.innerHTML = `<p class="print__marca">Luriel · ciencia cosmética</p>${ficha.innerHTML}`;
    area.querySelector('.ficha__acciones')?.remove();
    document.body.appendChild(area);
    document.body.classList.add('imprimiendo');
    const limpiar = () => { area.remove(); document.body.classList.remove('imprimiendo'); window.removeEventListener('afterprint', limpiar); };
    window.addEventListener('afterprint', limpiar);
    window.print();
    setTimeout(() => { if (document.body.contains(area)) limpiar(); }, 1500);
  });
}

const RUTINAS = {
  manana: { nota: 'De día, terminá siempre con protector solar, aunque esté nublado.', pasos: [
    { verbo: 'Limpiar', id: 'espuma-limpieza', tip: 'Uno o dos bombeos y 30 segundos de masaje con agua tibia.' },
    { verbo: 'Tonificar', id: 'bruma-tonica', tip: 'Dos o tres rocíos a 20 cm, con los ojos cerrados.' },
    { verbo: 'Tratar', id: 'serum-hialuronico', tip: 'Tres gotas con palmaditas, sin frotar.' },
    { verbo: 'Hidratar', id: 'crema-hidratante', tip: 'Del tamaño de una arveja, con movimientos hacia arriba.' },
    { verbo: 'Labios', id: 'balsamo-labial', tip: 'Una pasada antes de salir.' },
  ] },
  noche: { nota: 'Una vez por semana, lavá las brochas y los discos: también cuidan tu piel.', pasos: [
    { verbo: 'Desmaquillar', id: 'aceite-desmaquillante', tip: 'Con la cara seca, un minuto de masaje y enjuague.' },
    { verbo: 'Limpiar', id: 'espuma-limpieza', tip: 'La segunda limpieza deja la piel lista para tratar.' },
    { verbo: 'Tratar', id: 'serum-hialuronico', tip: 'De noche podés sumar una gota más.' },
    { verbo: 'Masajear', id: 'rodillo-jade', tip: 'Rodillo sobre el sérum, de adentro hacia afuera.' },
    { verbo: 'Hidratar', id: 'crema-hidratante', tip: 'Cerrá la rutina y sellá todo lo anterior.' },
  ] },
};

function initRutina() {
  const box = document.querySelector('[data-rutina]');
  if (!box) return;
  const lista = document.getElementById('rutinaPasos');
  const nota = document.getElementById('rutinaNota');
  const sumar = document.getElementById('rutinaSumar');
  const tabs = [...box.querySelectorAll('[data-momento]')];
  let momento = 'manana';
  const pintar = () => {
    const r = RUTINAS[momento];
    lista.innerHTML = r.pasos.map((s, i) => {
      const p = getProducto(s.id);
      if (!p) return '';
      return `<li class="paso" data-animate="subir" style="opacity:0;transform:translateY(32px)">
        <p class="paso__n">${pad2(i + 1)}<span>${esc(s.verbo)}</span></p>
        <div class="paso__prod"><span class="paso__foto"><img src="${p.img}" alt="" width="160" height="160"></span><span class="paso__nombre">${esc(p.nombre)}</span></div>
        <p class="paso__tip">${esc(s.tip)}</p>
      </li>`;
    }).join('');
    nota.textContent = r.nota;
    sumar.querySelector('span').textContent = `Sumar la rutina de la ${MOMENTOS[momento].nombre.toLowerCase()} al carrito`;
    tabs.forEach(t => { const on = t.dataset.momento === momento; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    revelarNuevos(lista);
    refrescarTriggers();
  };
  tabs.forEach(t => t.addEventListener('click', () => { momento = t.dataset.momento; pintar(); }));
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    momento = momento === 'manana' ? 'noche' : 'manana';
    pintar();
    box.querySelector(`[data-momento="${momento}"]`)?.focus();
  });
  sumar.addEventListener('click', () => {
    const ids = [...new Set(RUTINAS[momento].pasos.map(s => s.id))];
    const conTono = [];
    let n = 0;
    ids.forEach(id => {
      const p = getProducto(id);
      if (!p) return;
      if (conVar(p)) { conTono.push(p.nombre); return; }
      Cart.add(p, 1, '');
      n++;
    });
    showToast(`Sumaste ${n} productos de la rutina de la ${MOMENTOS[momento].nombre.toLowerCase()}.${conTono.length ? ` El ${conTono[0].split(' ')[0].toLowerCase()} elegilo con su tono.` : ''}`);
  });
  pintar();
}

const PIELES = [
  { id: 'seca', nombre: 'Seca' }, { id: 'grasa', nombre: 'Grasa' }, { id: 'mixta', nombre: 'Mixta' },
  { id: 'sensible', nombre: 'Sensible' }, { id: 'nose', nombre: 'No sé' },
];
const OBJETIVOS = [
  { id: 'hidratacion', nombre: 'Hidratar' }, { id: 'limpieza', nombre: 'Limpiar en profundidad' }, { id: 'luminosidad', nombre: 'Más luminosidad' },
  { id: 'masaje', nombre: 'Masajes y relax' }, { id: 'maquillaje', nombre: 'Maquillarme' },
];
function initConsulta() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const res = document.getElementById('consultaRes');
  const wsp = document.getElementById('consultaWsp');
  const chips = (grupo, arr, marcado) => arr.map(o => `<label class="opc"><input type="radio" name="${grupo}" value="${o.id}"${o.id === marcado ? ' checked' : ''}><span>${esc(o.nombre)}</span></label>`).join('');
  form.querySelector('[data-opc="piel"]').innerHTML = chips('piel', PIELES, 'seca');
  form.querySelector('[data-opc="obj"]').innerHTML = chips('obj', OBJETIVOS, 'hidratacion');
  const pintar = () => {
    const piel = form.querySelector('input[name="piel"]:checked')?.value || 'nose';
    const obj = form.querySelector('input[name="obj"]:checked')?.value || 'hidratacion';
    let items = Tienda.consultar({ filtros: { nec: obj }, orden: 'destacados', limite: 6 }).items;
    if (piel === 'sensible') items.sort((a, b) => Number((b.nec || []).includes('sensible')) - Number((a.nec || []).includes('sensible')));
    items = items.slice(0, 2);
    const nPiel = nombreDe(PIELES, piel).toLowerCase();
    const nObj = nombreDe(OBJETIVOS, obj).toLowerCase();
    res.innerHTML = `<p class="consulta__para">Para empezar${piel === 'nose' ? '' : `, con piel ${nPiel}`}:</p><ul>${items.map(p => `<li>${cardHTML(p, { mini: true })}</li>`).join('')}</ul>${piel === 'sensible' ? '<p class="consulta__aviso">Antes de usarlos, hacé la prueba de tolerancia (R-01).</p>' : ''}`;
    const texto = `Hola ${MARCA}! Tengo piel ${piel === 'nose' ? '(no sé de qué tipo)' : nPiel} y quiero ${nObj}. ¿Qué rutina me recomendás?${items.length ? ` Vi ${items.map(p => p.nombre).join(' y ')}.` : ''}`;
    wsp.href = wspHref(texto);
  };
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  pintar();
}

function initGuiaTabs() {
  const box = document.getElementById('guia');
  if (!box) return;
  const tabs = [...box.querySelectorAll('.guia-tabs [role="tab"]')];
  const ids = tabs.map(t => t.getAttribute('aria-controls'));
  const elegir = (id, foco) => {
    tabs.forEach(t => {
      const on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && foco) t.focus();
    });
    revelarNuevos(document.getElementById(id));
    refrescarTriggers();
  };
  tabs.forEach(t => t.addEventListener('click', () => elegir(t.getAttribute('aria-controls'))));
  box.querySelector('.guia-tabs')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (j === null) return;
    e.preventDefault();
    elegir(ids[j], true);
  });
  const porHash = () => {
    const id = location.hash.slice(1);
    if (!ids.includes(id)) return;
    elegir(id);
    requestAnimationFrame(() => box.scrollIntoView({ block: 'start' }));
  };
  window.addEventListener('hashchange', porHash);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    const id = u.hash.slice(1);
    if (!ids.includes(id) || u.pathname !== location.pathname) return;
    e.preventDefault();
    window.history.replaceState(null, '', `#${id}`);
    elegir(id);
    box.scrollIntoView({ block: 'start' });
  });
  porHash();
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const tipo = tipoVar(p);
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto].src;
  const forma = actual.includes('alto') ? ' qv__principal--alta' : actual.includes('hero') ? ' qv__principal--ancha' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || '')}${sub ? ' · ' : ''}${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__dato"><span>Ideal para</span>${(p.nec || []).map(n => esc(nombreDe(NECESIDADES, n).toLowerCase())).join(' · ')}</p>
        ${p.prospecto ? `<details class="qv__prospecto"><summary>Prospecto y forma de uso</summary><div class="qv__prospecto-cuerpo"><p>${esc(p.prospecto.sirve)}</p><ol class="pasos">${p.prospecto.pasos.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="qv__prospecto-dato">${esc(p.prospecto.frecuencia)} · ${esc(p.prospecto.cantidad)}</p><ul class="ficha__avisos">${p.prospecto.precauciones.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></details>` : ''}
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">${esc(tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí el ${esc(tipo.toLowerCase())}">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : ''; QV.foto = 0;
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
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (${varTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí el ${tipoVar(p).toLowerCase()} para sumarlo al carrito.`;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''} al carrito.`);
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
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.bolsa}<p>Tu carrito está vacío. Hay sérums, cremas y accesorios esperándote, cada uno con su forma de uso.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
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
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
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

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
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
      const acciones = add.closest('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (${varTxt(p, op)})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
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
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], nec: multi('nec', NECESIDADES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const vacioWsp = document.getElementById('vacioWsp');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.nec.length) f.nec = e.nec;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
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
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    const necs = NECESIDADES.filter(n => fac.nec[n.id]);
    if (necs.length) grupos.push(`<fieldset class="f-grupo"><legend>Objetivo</legend><div class="f-necs">
      ${necs.map(n => `<label class="f-nec"><input type="checkbox" name="nec-${n.id}" value="${n.id}" data-f="nec"${e.nec.includes(n.id) ? ' checked' : ''}><span>${esc(n.nombre)}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const nec = !cat && e.nec.length === 1 ? NECESIDADES.find(n => n.id === e.nec[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : nec ? `Para ${nec.nombre.toLowerCase()}` : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.q ? `Resultados para «${e.q}»` : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : nec ? `${nec.frase}. ${nec.consejo}` : e.oferta ? 'Productos con descuento, mientras haya stock.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Sérums, limpieza, hidratación y accesorios de belleza y bienestar. Cada producto trae su prospecto y su forma de uso.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : nec ? nec.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : nec ? `${CATALOGO_URL}?nec=${nec.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta && !e.nec.length ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.nec.forEach(v => quitar.push(['nec', v, nombreDe(NECESIDADES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'nec', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.nec.length) u.searchParams.set('nec', e.nec.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = e.q ? 0 : Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const hay = mostrados > 0;
    contador.textContent = e.q
      ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'}`
      : `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te decimos si lo conseguimos.` : 'No encontramos productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! ¿Tienen ${e.q}?` : `Hola ${MARCA}! Estoy buscando un producto y no lo encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados} ${cursor ? '· hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
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
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
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
    if (f.id === 'busquedaHeader' && document.querySelector('[data-abrir-busqueda]')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.nec = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.sub = []; e.nec = []; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.nec = []; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-nec a, .cats-todo, .cats-oferta, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.nec = (u.searchParams.get('nec') || '').split(',').filter(v => NECESIDADES.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });
  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
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
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initProspecto, initRutina, initConsulta, initCatalogo, initReveals, initGuiaTabs, initNav, initBuscadorHeader, initBuscadorVivo, initHeroMotion,
  initRail, initImprimir, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
