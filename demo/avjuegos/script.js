document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5492996031456';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO = document.body.dataset.catalogo || 'catalogo.html';
const esM2 = document.body.classList.contains('m2');
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'familiares', nombre: 'Familiares', bajada: 'Para jugar entre grandes y chicos: se explican rápido y cada partida sale distinta.', img: 'images/c-familiares.webp' },
  { id: 'previas', nombre: 'Previas', bajada: 'Juegos rápidos, de risas y de reflejos para arrancar la noche con amigos.', img: 'images/c-previas.webp' },
  { id: 'infantiles', nombre: 'Infantiles', bajada: 'Los primeros juegos de mesa: tableros, memoria y encastres para chicos desde 3 años.', img: 'images/c-infantiles.webp' },
  { id: 'didacticos', nombre: 'Didácticos', bajada: 'Números, formas y colores: para aprender jugando, en madera y en cartas.', img: 'images/c-didacticos.webp' },
  { id: 'estrategia', nombre: 'Estrategia', bajada: 'Para pensar cada jugada: clásicos de madera y juegos de mapas, comercio y construcción.', img: 'images/c-estrategia.webp' },
  { id: 'cooperativos', nombre: 'Cooperativos', bajada: 'Todos del mismo lado: se gana o se pierde en equipo contra el tablero.', img: 'images/c-cooperativos.webp' },
];
const JUGADORES = { '2': { label: '2 jugadores', corto: '2' }, '3-4': { label: '3 o 4 jugadores', corto: '3 o 4' }, '5+': { label: '5 jugadores o más', corto: '5 o más' } };
const EDADES = {
  '3': { label: '3 años', max: 3 }, '5': { label: '5 años', max: 5 }, '8': { label: '8 años', max: 8 },
  '10': { label: '10 años', max: 10 }, '12': { label: '12 años', max: 12 }, '14': { label: 'Solo grandes', max: 99 },
};
const DURACIONES = { corto: { label: 'Hasta 20 min', max: 20 }, medio: { label: 'De 25 a 45 min', min: 21, max: 45 }, largo: { label: 'Más de 45 min', min: 46 } };
const RANGOS = { 'hasta-20000': { label: 'Hasta $20.000', max: 20000 }, '20000-35000': { label: 'De $20.000 a $35.000', min: 20000, max: 35000 }, 'mas-35000': { label: 'Más de $35.000', min: 35000 } };
const EXTRAS = { oferta: 'Con descuento', stock: 'Con stock' };
const ORDENES = { destacados: 'Destacados', novedades: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const Servidor = crearServidor([
  { id: 'valle-de-pinos', nombre: 'Valle de Pinos', cat: 'familiares', tipo: 'Colocación de trabajadores', img: 'p-valle-de-pinos', alt: 'Meeples de madera rojo, azul, verde y amarillo con cubos y cartas de paisaje sobre la mesa',
    desc: 'Mandás a tus fichas a juntar madera, piedra y agua en el valle y con eso armás tu aldea. Hay que planear un poco, pero ningún turno se hace largo.',
    trae: ['Tablero del valle', '16 meeples de madera', '60 cubos de recursos', '48 cartas de paisaje'], jug: [2, 4], edad: 10, min: 45, precio: 38900, descuento: 10, stock: 5, rango: 1, alta: 18 },
  { id: 'castillo-del-lago', nombre: 'Castillo del Lago', cat: 'familiares', tipo: 'Juego de losetas', img: 'p-castillo-del-lago', alt: 'Caja de juego con un castillo junto a un lago entre montañas',
    desc: 'Cada turno sacás una loseta y la sumás al mapa: caminos, bosques y el lago alrededor del castillo. Se aprende en una partida y cada mapa sale distinto.',
    trae: ['72 losetas de paisaje', '40 fichas de madera en 4 colores', 'Tablero de puntos', 'Reglamento en castellano'], jug: [2, 4], edad: 8, min: 40, precio: 34900, stock: 7, rango: 2, alta: 14 },
  { id: 'reinos-de-la-montana', nombre: 'Reinos de la Montaña', cat: 'familiares', tipo: 'Juego de cartas y mapas', img: 'p-reinos-de-montana', alt: 'Cajas de juegos apiladas con ilustraciones de castillos, bosques y costas',
    desc: 'Explorás montañas, bosques y costas jugando cartas de camino. Gana quien conecte más reinos antes de que se termine el mazo.',
    trae: ['110 cartas de camino', '5 tableros de reino', 'Fichas de puntos'], jug: [2, 5], edad: 8, min: 35, precio: 31500, stock: 9, alta: 20, nuevo: true, regalo: true },
  { id: 'pueblo-del-rio', nombre: 'Pueblo del Río', cat: 'familiares', tipo: 'Dados y construcción', img: 'p-pueblo-del-rio', alt: 'Caja de juego con un pueblo y un río entre colinas verdes',
    desc: 'Tirás los dados y elegís qué construir a orillas del río: casas, molinos y puentes. Partidas cortas, ideales para la sobremesa.',
    trae: ['6 dados de colores', '4 tableros de pueblo', '60 piezas de construcción'], jug: [2, 4], edad: 7, min: 30, precio: 26900, stock: 12, alta: 8 },

  { id: 'formas-al-vuelo', nombre: 'Formas al Vuelo', cat: 'previas', tipo: 'Juego de reflejos', img: 'p-formas-al-vuelo', alt: 'Mazos de cartas con un triángulo y círculos de colores sobre una mesa de madera',
    desc: 'Se dan vuelta dos cartas y el primero que encuentra la forma repetida se las lleva. Rápido, ruidoso y para jugar varias rondas seguidas.',
    trae: ['80 cartas de formas', 'Reglamento con 4 modos de juego'], jug: [3, 8], edad: 8, min: 15, precio: 16900, stock: 20, rango: 3, alta: 16 },
  { id: 'lunas', nombre: 'Lunas', cat: 'previas', tipo: 'Cartas de combinar', img: 'p-lunas', alt: 'Mazo de cartas azul oscuro con círculos turquesa y amarillo junto a fichas de colores',
    desc: 'Combiná colores y círculos para cerrar tu luna antes que el resto. Se explica en un minuto y engancha.',
    trae: ['72 cartas', '24 fichas de colores'], jug: [2, 6], edad: 8, min: 20, precio: 18500, stock: 14, alta: 12 },
  { id: 'rojo-pleno', nombre: 'Rojo Pleno', cat: 'previas', tipo: 'Preguntas y apuestas', img: 'p-rojo-pleno', alt: 'Mazo de cartas rojo con un círculo claro y fichas de colores',
    desc: 'Cada ronda alguien lee una pregunta y el resto apuesta fichas a quién se anima a responder. Para la previa con amigos.',
    trae: ['200 cartas de preguntas', '40 fichas de apuesta'], jug: [4, 10], edad: 14, min: 30, precio: 19900, descuento: 15, stock: 3, rango: 5, alta: 10 },
  { id: 'abanico', nombre: 'Abanico', cat: 'previas', tipo: 'Juego de bluff', img: 'p-abanico', alt: 'Abanico de cartas de colores con círculos superpuestos sobre la mesa',
    desc: 'Abrís tu abanico de cartas, bajás una boca abajo y decís qué es. ¿Te creen o te descubren? El que se queda sin cartas gana.',
    trae: ['96 cartas', 'Reglamento en castellano'], jug: [3, 8], edad: 12, min: 25, precio: 21500, stock: 10, alta: 22, nuevo: true },

  { id: 'carrera-de-fichas', nombre: 'Carrera de Fichas', cat: 'infantiles', tipo: 'Juego de recorrido', img: 'p-carrera-de-fichas', alt: 'Tablero de recorrido con fichas de colores y cartas mientras una mano mueve una ficha',
    desc: 'Tirás el dado, avanzás tu ficha y seguís las casillas del camino. El primer juego de tablero de muchos chicos, para jugar con los grandes.',
    trae: ['Tablero plegable', '4 fichas de colores', '1 dado', '30 cartas de sorpresa'], jug: [2, 4], edad: 4, min: 20, precio: 17900, stock: 15, rango: 4, alta: 9 },
  { id: 'bosque-encantado', nombre: 'Bosque Encantado', cat: 'infantiles', tipo: 'Memoria y cartas', img: 'p-bosque-encantado', alt: 'Caja de juego con un ciervo en un bosque verde azulado',
    desc: 'Los animales del bosque se esconden debajo de las cartas: hay que recordar dónde quedó cada uno para llevarlos a casa.',
    trae: ['36 cartas de animales', 'Tablero del bosque', '4 casitas de cartón'], jug: [2, 4], edad: 5, min: 20, precio: 19500, stock: 6, alta: 15, regalo: true },
  { id: 'encastre-de-formas', nombre: 'Encastre de formas de madera', cat: 'infantiles', tipo: 'Juego de madera', img: 'p-encastre-formas', alt: 'Encastre de madera con cuatro columnas de piezas rojas, amarillas, azules y verdes',
    desc: 'Cuatro columnas para encastrar círculos, rectángulos, triángulos y cuadrados por forma y color. Madera pintada y piezas grandes, fáciles de agarrar.',
    trae: ['Base de madera con 4 columnas', '16 piezas en 4 formas y 4 colores'], jug: [1, 2], edad: 3, min: 15, precio: 22900, stock: 8, rango: 6, alta: 11, regalo: true },

  { id: 'abaco-contador', nombre: 'Ábaco contador del 1 al 10', cat: 'didacticos', tipo: 'Didáctico de madera', img: 'p-abaco-contador', alt: 'Ábaco de madera con números del 1 al 10 y aros de colores apilados',
    desc: 'Diez columnas con sus números para apilar aros de colores: contar del 1 al 10, sumar y comparar cantidades jugando.',
    trae: ['Base de madera con 10 columnas', 'Números del 1 al 10 encastrables', '55 aros de colores'], jug: [1, 2], edad: 3, min: 15, precio: 24900, stock: 6, alta: 17, regalo: true },
  { id: 'memotest-de-paisajes', nombre: 'Memotest de Paisajes', cat: 'didacticos', tipo: 'Juego de memoria', img: 'p-memotest-paisajes', alt: 'Cartas con paisajes de lagos, montañas y bosques sobre la mesa',
    desc: 'Treinta pares de cartas con lagos, montañas y bosques. Para ejercitar la memoria y la atención, de a dos o en familia.',
    trae: ['60 cartas (30 pares)', 'Caja de guardado'], jug: [2, 6], edad: 4, min: 15, precio: 13900, stock: 11, alta: 7 },
  { id: 'figuras-rapidas', nombre: 'Figuras Rápidas', cat: 'didacticos', tipo: 'Cartas de formas y colores', img: 'p-cartas-de-figuras', alt: 'Mazo de cartas amarillas con un hexágono claro junto a un mazo turquesa',
    desc: 'Cartas con hexágonos, triángulos y círculos para nombrar formas y colores jugando. Trae tres maneras de jugar según la edad.',
    trae: ['60 cartas de figuras', 'Reglamento con 3 niveles'], jug: [2, 5], edad: 4, min: 15, precio: 12900, stock: 18, alta: 19, nuevo: true },

  { id: 'molino-de-madera', nombre: 'Molino de madera', cat: 'estrategia', tipo: 'Clásico de estrategia', img: 'p-molino-madera', alt: 'Tablero de molino de madera de nogal con fichas claras y oscuras',
    desc: 'El juego del molino de toda la vida, en tablero de madera con fichas claras y oscuras. Formá líneas de tres y sacale fichas al rival.',
    trae: ['Tablero de madera', '18 fichas de madera', 'Reglamento'], jug: [2, 2], edad: 8, min: 20, precio: 32900, stock: 4, rango: 7, alta: 13, regalo: true },
  { id: 'islas-y-caminos', nombre: 'Islas y Caminos', cat: 'estrategia', tipo: 'Mapa y rutas', img: 'p-islas-y-caminos', alt: 'Tablero de mapa con islas, cubos de colores y meeples de madera',
    desc: 'Un mapa de islas para unir con caminos y puertos. Negociás recursos con el resto y cada partida se decide en las últimas jugadas.',
    trae: ['Tablero modular de islas', '80 cubos de caminos', '12 meeples', '90 cartas de recursos'], jug: [3, 4], edad: 10, min: 60, precio: 42900, stock: 5, rango: 8, alta: 21, nuevo: true },
  { id: 'ciudadela', nombre: 'Ciudadela', cat: 'estrategia', tipo: 'Construcción', img: 'p-ciudadela', alt: 'Caja de juego con una ciudadela de piedra bajo un cielo naranja',
    desc: 'Levantás tu ciudadela piedra por piedra mientras defendés las murallas. Para quienes ya juegan y buscan una partida larga.',
    trae: ['Tablero de la ciudadela', '120 piezas de construcción', '4 mazos de personaje'], jug: [2, 4], edad: 12, min: 90, precio: 45900, stock: 0, alta: 6 },
  { id: 'rutas-del-puerto', nombre: 'Rutas del Puerto', cat: 'estrategia', tipo: 'Juego de comercio', img: 'p-rutas-del-puerto', alt: 'Caja de juego con un barco de velas al atardecer',
    desc: 'Cargás mercadería en tus barcos y elegís a qué puerto llevarla. Cada viaje cambia los precios del mercado.',
    trae: ['Tablero del puerto', '8 barcos de madera', '100 fichas de mercadería'], jug: [2, 4], edad: 12, min: 60, precio: 39900, descuento: 10, stock: 7, alta: 5 },

  { id: 'expedicion-en-la-niebla', nombre: 'Expedición en la Niebla', cat: 'cooperativos', tipo: 'Cooperativo de aventura', img: 'p-expedicion-niebla', alt: 'Caja de juego con un puente de piedra en un bosque con niebla',
    desc: 'Todos juegan juntos contra el tablero: cruzan el puente y el bosque antes de que la niebla los alcance. Se gana o se pierde en equipo.',
    trae: ['Tablero del bosque', '4 personajes', '60 cartas de niebla', '1 dado especial'], jug: [1, 4], edad: 10, min: 45, precio: 36900, stock: 6, alta: 4 },
  { id: 'orbita', nombre: 'Órbita', cat: 'cooperativos', tipo: 'Cooperativo espacial', img: 'p-orbita', alt: 'Caja de juego con planetas y una nebulosa, entre otras cajas ilustradas',
    desc: 'La tripulación tiene que llevar la nave de planeta en planeta sin hablar de más: cada uno ve solo sus cartas.',
    trae: ['50 cartas de misión', '5 fichas de tripulante', 'Libro de misiones'], jug: [2, 5], edad: 10, min: 40, precio: 34500, stock: 8, alta: 23, nuevo: true, regalo: true },
  { id: 'isla-compartida', nombre: 'Isla Compartida', cat: 'cooperativos', tipo: 'Cooperativo de mapa', img: 'p-isla-compartida', alt: 'Manos moviendo fichas de colores sobre un tablero con mapa de islas',
    desc: 'Repartidos por la isla, cada jugador tiene una habilidad distinta y entre todos hay que juntar los tesoros antes de que suba el agua.',
    trae: ['24 losetas de isla', '6 peones de madera', '58 cartas'], jug: [2, 4], edad: 8, min: 40, precio: 33900, stock: 9, alta: 3 },

  { id: 'fichas-de-repuesto', nombre: 'Fichas de madera de repuesto', cat: 'estrategia', tipo: 'Accesorio', img: 'p-fichas-madera', alt: 'Cuenco de madera con fichas claras y oscuras',
    desc: 'Fichas sueltas de madera para reponer las que se pierden.', trae: ['18 fichas'], jug: [2, 2], edad: 8, min: 20, precio: 6500, stock: 20, alta: 1, visible: false },
], { tope: 100 });

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const nombreDeCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, p.tipo, nombreDeCat(p.cat), p.desc, ...(p.trae || []), `${p.jug[0]} a ${p.jug[1]} jugadores`, p.regalo ? 'regalo regalar' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? String(v).split(',').filter(Boolean) : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), extra = lista(f.extra), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.regalo === true && !p.regalo) return false;
    if (f.jug === '2' && !(p.jug[0] <= 2 && p.jug[1] >= 2)) return false;
    if (f.jug === '3-4' && !(p.jug[0] <= 4 && p.jug[1] >= 3)) return false;
    if (f.jug === '5+' && !(p.jug[1] >= 5)) return false;
    if (f.edad && EDADES[f.edad] && p.edad > EDADES[f.edad].max) return false;
    if (f.dur && DURACIONES[f.dur]) {
      const d = DURACIONES[f.dur];
      if (d.min != null && p.min < d.min) return false;
      if (d.max != null && p.min > d.max) return false;
    }
    if (f.precio && RANGOS[f.precio]) {
      const r = RANGOS[f.precio], v = final(p);
      if (r.min != null && v < r.min) return false;
      if (r.max != null && v >= r.max) return false;
    }
    if (extra.includes('oferta') && !(p.descuento > 0)) return false;
    if (extra.includes('stock') && !(p.stock > 0)) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const sinStock = (a, b) => (b.stock > 0) - (a.stock > 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'novedades': return (a, b) => (b.alta || 0) - (a.alta || 0) || desempate(a, b);
      default: return (a, b) => sinStock(a, b) || (a.rango || 999) - (b.rango || 999) || (b.alta || 0) - (a.alta || 0) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => ({ id: c.id, cantidad: contar({ cat: c.id }) }));
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => Servidor.obtener(id);
const catDe = id => CATEGORIAS.find(c => c.id === id) || { id, nombre: '', bajada: '' };
const disponible = p => p.stock > 0;
const jugTxt = p => (p.jug[0] === p.jug[1] ? `${p.jug[0]}` : `${p.jug[0]}-${p.jug[1]}`);
const jugLargo = p => (p.jug[0] === p.jug[1] ? `${p.jug[0]}` : `${p.jug[0]} a ${p.jug[1]}`);
const juegos = n => `${n} ${n === 1 ? 'juego' : 'juegos'}`;
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };

const Cart = {
  KEY: 'avjuegos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const SV = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const ICON = {
  carrito: `<svg ${SV}><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  carritoMas: `<svg ${SV}><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><path d="M13.6 9.6v4M11.6 11.6h4"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  mas: `<svg ${SV}><path d="M12 5v14M5 12h14"/></svg>`,
  menos: `<svg ${SV}><path d="M5 12h14"/></svg>`,
  cerrar: `<svg ${SV}><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  basura: `<svg ${SV}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`,
  flecha: `<svg ${SV}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  chevron: `<svg ${SV}><path d="m6 9 6 6 6-6"/></svg>`,
  users: `<svg ${SV}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  reloj: `<svg ${SV}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  edad: `<svg ${SV}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/></svg>`,
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer:not([hidden]), .quick:not([hidden]), .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const fichaHTML = p => `<p class="ficha"><span class="f-jug">${ICON.users}${jugTxt(p)} jug.</span><span class="f-min">${ICON.reloj}${p.min} min</span><span class="f-edad">${ICON.edad}${p.edad}+</span></p>`;
const precioHTML = p => (p.descuento > 0
  ? `<p class="precio precio--oferta"><span class="precio-final">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></p>`
  : `<p class="precio"><span class="precio-final">${formatearPrecio(p.precio)}</span></p>`);
function badgeHTML(p) {
  if (!disponible(p)) return '<span class="badge badge--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="badge badge--oferta">-${p.descuento}%</span>`;
  if (p.nuevo) return '<span class="badge">Nuevo</span>';
  if (p.stock <= 3) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  return '';
}
const stepperHTML = (max, valor = 1) => `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${valor}" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
const avisarHTML = p => `<a class="prod-avisar" href="${esc(waLink(`Hola, ¿me avisan cuando vuelva a entrar ${p.nombre}?`))}" target="_blank" rel="noopener">${ICON.wa}<span class="txt-add">Avisame</span></a>`;

function cardHTML(p, { animar = true } = {}) {
  const cat = catDe(p.cat);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  let pie;
  if (!disponible(p)) pie = avisarHTML(p);
  else if (esM2) pie = `<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="txt-add">Agregar</span><span class="ico-add">${ICON.carritoMas}</span></button>`;
  else pie = `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="txt-add">Agregar al carrito</span><span class="ico-add">${ICON.carritoMas}</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
  return `<article class="card" data-id="${p.id}" data-color="${p.cat}"${anim}>
  <button type="button" class="card-foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="600" height="600" decoding="async"><span class="card-cat"><span class="dot"></span>${esc(cat.nombre)}</span>${badgeHTML(p)}</button>
  <div class="card-body">
    <h3 class="card-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
    ${fichaHTML(p)}
    ${precioHTML(p)}
    <div class="card-pie">${pie}</div>
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
  const paso = (sel, vars, pos) => { const t = [...hero.querySelectorAll(sel)]; if (t.length) tl.from(t, vars, pos); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, stagger: 0.08 }, 0);
  paso('.mesa-txt', { y: 30, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.15);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-mesas a, .carta-hoy-wrap', { y: 16, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    const amp = parseFloat(img.dataset.parallax) || 3;
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-amp + 2 * amp * s.progress).toFixed(2)}%`; },
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
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

function initMenuCat() {
  const btn = document.querySelector('.nav-cat-btn');
  const menu = document.getElementById('menuCat');
  if (!btn || !menu) return;
  const lista = menu.querySelector('[data-menu-cat]');
  const cantidades = Object.fromEntries(Servidor.resumen().map(r => [r.id, r.cantidad]));
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  if (lista) {
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44" loading="lazy"><span class="menu-cat-nombre" data-color="${c.id}"><span class="dot"></span>${esc(c.nombre)}</span><span class="menu-cat-cant">${cantidades[c.id] || 0}</span></a></li>`).join('');
  }
  const li = btn.closest('.nav-cat');
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 901px)');
  const desktopMq = window.matchMedia('(min-width: 901px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (menu.hidden ? abrir() : cerrar()));
  li.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  li.addEventListener('mouseleave', () => { if (hoverMq.matches) t = setTimeout(cerrar, 120); });
  li.addEventListener('focusout', e => { if (desktopMq.matches && !li.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktopMq.matches && !menu.hidden && !li.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrar(); btn.focus(); } });
}

function initBuscadorHeader() {
  document.querySelectorAll('.buscador').forEach(form => {
    form.addEventListener('submit', e => {
      const input = form.querySelector('input');
      const q = (input?.value || '').trim();
      const catBuscar = document.getElementById('catBuscar');
      if (PAGINA === 'catalogo' && catBuscar) {
        e.preventDefault();
        catBuscar.value = q;
        catBuscar.dispatchEvent(new window.Event('input', { bubbles: true }));
        catBuscar.focus();
        input.value = '';
        input.blur();
      } else if (!q && window.innerWidth > 1100) {
        e.preventDefault();
        input.focus();
      }
    });
  });
}

function initConteos() {
  const total = Servidor.contar({});
  document.querySelectorAll('[data-total-juegos]').forEach(el => { el.textContent = juegos(total); });
  const cant = Object.fromEntries(Servidor.resumen().map(r => [r.id, r.cantidad]));
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const ids = el.dataset.catCount.split(',');
    el.textContent = juegos(ids.reduce((s, id) => s + (cant[id] || 0), 0));
  });
}

let idsRail = [];
function initRail() {
  const track = document.querySelector('[data-rail]');
  if (!track) return;
  const res = Servidor.consultar({ filtros: { destacado: true, extra: ['stock'] }, orden: 'destacados', limite: 8 });
  idsRail = res.items.map(p => p.id);
  track.innerHTML = res.items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { animar: false })}</div>`).join('');
  const sec = track.closest('section');
  initRailDrag(track.parentElement, sec?.querySelector('[data-rail-prev]'), sec?.querySelector('[data-rail-next]'));
}

function initRailDrag(vp, prev, next) {
  if (!vp) return;
  const track = vp.firstElementChild;
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, matarClick = false;
  const paso = () => {
    const item = track.querySelector('.rail-item');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    const w = item ? item.getBoundingClientRect().width + gap : 300;
    return Math.max(w, Math.floor(vp.clientWidth / w) * w);
  };
  const puntos = () => {
    const ini = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    return [...track.querySelectorAll('.rail-item')].map(it => it.offsetLeft - ini);
  };
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 4) + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = null; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { if (pointerId != null) vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (!moved) return;
    matarClick = true;
    setTimeout(() => { matarClick = false; }, 80);
    const dir = Math.sign(startLeft - vp.scrollLeft) * -1;
    const max = vp.scrollWidth - vp.clientWidth;
    const ps = puntos();
    let destino = ps.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a), ps[0] || 0);
    if (dir > 0) destino = ps.find(x => x >= vp.scrollLeft - 4) ?? destino;
    if (dir < 0) destino = [...ps].reverse().find(x => x <= vp.scrollLeft + 4) ?? destino;
    vp.scrollTo({ left: Math.max(0, Math.min(destino, max)), behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => vp.classList.remove('dragging'), 420);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (matarClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

function initPreview() {
  const grid = document.querySelector('[data-preview]');
  if (!grid) return;
  const res = Servidor.consultar({ filtros: { excluir: idsRail }, orden: 'novedades', limite: 8 });
  grid.innerHTML = res.items.map(p => cardHTML(p)).join('');
}

function initGuia() {
  const root = document.querySelector('[data-guia]');
  if (!root) return;
  const st = { jug: '3-4', edad: '8' };
  const res = root.querySelector('[data-guia-res]');
  const pintar = () => {
    root.querySelectorAll('[data-g-jug]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.gJug === st.jug)));
    root.querySelectorAll('[data-g-edad]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.gEdad === st.edad)));
    const r = Servidor.consultar({ filtros: { jug: st.jug, edad: st.edad, extra: ['stock'] }, orden: 'destacados', limite: 2 });
    const edadTxt = st.edad === '14' ? 'todos grandes' : `el más chico de ${EDADES[st.edad].label}`;
    const msg = `Hola A V Juegos, buscamos un juego para ${JUGADORES[st.jug].label}, ${edadTxt}. ¿Qué nos recomiendan?`;
    const items = r.items.map(p => `<div class="guia-item" data-color="${p.cat}">
      <img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="76" height="76">
      <div><button type="button" class="guia-item-nombre" data-quick="${p.id}">${esc(p.nombre)}</button>${fichaHTML(p)}${precioHTML(p)}</div>
    </div>`).join('');
    const href = `${CATALOGO}?jug=${encodeURIComponent(st.jug)}&edad=${encodeURIComponent(st.edad)}`;
    res.innerHTML = `<div class="guia-res-head"><p>Para ${esc(JUGADORES[st.jug].label)}, ${esc(edadTxt)}</p><span>${r.total ? `${juegos(r.total)} en stock` : 'Sin stock por ahora'}</span></div>
      ${r.total ? `<div class="guia-lista">${items}</div>` : '<p class="guia-vacio">Ahora no tenemos uno así en stock, pero contanos y te buscamos una opción.</p>'}
      <div class="guia-acciones">${r.total ? `<a class="btn btn--primary" href="${href}">Ver ${r.total === 1 ? 'el juego' : `los ${r.total} juegos`}</a>` : ''}<a class="btn btn--ghost btn--wa" href="${esc(waLink(msg))}" target="_blank" rel="noopener">${ICON.wa}Pedir una recomendación</a></div>`;
  };
  root.addEventListener('click', e => {
    const j = e.target.closest('[data-g-jug]'), a = e.target.closest('[data-g-edad]');
    if (j) st.jug = j.dataset.gJug;
    if (a) st.edad = a.dataset.gEdad;
    if (j || a) { pintar(); refrescarScroll(); }
  });
  pintar();
}

let ultimoFocoQuick = null;
function abrirQuick(id) {
  const q = document.getElementById('quick');
  const body = document.getElementById('quickBody');
  const p = getProducto(id);
  if (!q || !body || !p) return;
  const cat = catDe(p.cat);
  const dispo = disponible(p);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  const stockTxt = !dispo ? 'Sin stock por ahora: te avisamos por WhatsApp cuando vuelva.' : p.stock <= 3 ? `Últimas ${p.stock} unidades.` : `${p.stock} en stock.`;
  const msg = `Hola A V Juegos, quiero consultar por ${p.nombre} (${formatearPrecio(precioFinal(p))}).`;
  body.innerHTML = `<div class="quick-grid">
    <div class="quick-foto"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="800" height="800">${badgeHTML(p)}</div>
    <div class="quick-info" data-color="${p.cat}">
      <p class="eyebrow"><span class="dot"></span>${esc(cat.nombre)} · ${esc(p.tipo)}</p>
      <h2>${esc(p.nombre)}</h2>
      ${precioHTML(p)}
      <div class="quick-ficha">
        <div>${ICON.users}<strong>${jugLargo(p)}</strong><small>jugadores</small></div>
        <div>${ICON.reloj}<strong>${p.min} min</strong><small>por partida</small></div>
        <div>${ICON.edad}<strong>${p.edad}+</strong><small>años</small></div>
      </div>
      <p class="quick-que">¿Qué es ${esc(p.nombre)}?</p>
      <p class="quick-desc">${esc(p.desc)}</p>
      <ul class="quick-trae" aria-label="Qué trae la caja">${(p.trae || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="quick-stock">${stockTxt}</p>
      <div class="quick-acciones">
        ${dispo ? `<div class="fila">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}"><span class="txt-add">Agregar al carrito</span><span class="ico-add">${ICON.carritoMas}</span></button></div>
        <button type="button" class="btn btn--ghost" data-buy="${p.id}">Comprar ahora</button>` : avisarHTML(p)}
        <a class="quick-wa" href="${esc(waLink(msg))}" target="_blank" rel="noopener">${ICON.wa}Consultar por WhatsApp</a>
      </div>
    </div>
  </div>
  ${rel.length ? `<div class="quick-rel"><p>También te puede interesar</p><div class="quick-rel-lista">${rel.map(r => `<button type="button" class="quick-rel-item" data-quick="${r.id}"><img src="images/${r.img}.webp" alt="" width="56" height="56"><span><strong>${esc(r.nombre)}</strong><span>${formatearPrecio(precioFinal(r))}</span></span></button>`).join('')}</div></div>` : ''}`;
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: cat.nombre,
    brand: { '@type': 'Brand', name: 'A V Juegos' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: dispo ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
  if (q.hidden) {
    ultimoFocoQuick = document.activeElement;
    q.hidden = false;
    void q.offsetWidth;
    q.classList.add('open');
    syncNoScroll();
  }
  q.querySelector('.quick-panel').scrollTop = 0;
  q.querySelector('.quick-close')?.focus();
}
function cerrarQuick() {
  const q = document.getElementById('quick');
  if (!q || q.hidden) return;
  q.classList.remove('open');
  q.hidden = true;
  syncNoScroll();
  if (ultimoFocoQuick?.isConnected) ultimoFocoQuick.focus();
}
function initQuick() {
  const q = document.getElementById('quick');
  if (!q) return;
  q.addEventListener('click', e => { if (e.target.closest('[data-close-quick]')) cerrarQuick(); });
  q.addEventListener('keydown', e => atraparFoco(q, e));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !q.hidden) cerrarQuick(); });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirQuick(slug);
}

let ultimoFocoCart = null;
function openCartDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  if (!document.getElementById('quick')?.hidden) cerrarQuick();
  renderCart();
  ultimoFocoCart = document.activeElement;
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('open');
  syncNoScroll();
  d.querySelector('.drawer-close')?.focus();
}
function closeCartDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { if (!d.classList.contains('open')) { d.hidden = true; syncNoScroll(); } }, 380);
  document.body.classList.remove('no-scroll');
  if (ultimoFocoCart?.isConnected) ultimoFocoCart.focus();
}
function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body || !foot) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio"><span class="fichas" aria-hidden="true"><i></i><i></i><i></i><i></i></span><p>Tu mesa está vacía</p><p>Sumá un juego y lo vas a ver acá, listo para pedir.</p><a class="btn btn--primary" href="${CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(({ p, qty }) => `<div class="linea" data-color="${p.cat}">
    <img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="72" height="72">
    <div><p class="linea-nombre">${esc(p.nombre)}</p>${fichaHTML(p)}<div class="stepper" data-linea="${p.id}"><button type="button" data-cart-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-cart-step="1" aria-label="Sumar uno">${ICON.mas}</button></div></div>
    <div class="linea-der"><span class="linea-precio">${formatearPrecio(precioFinal(p) * qty)}</span><button type="button" class="linea-quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></div>
  </div>`).join('');
  const lineas = items.map(({ p, qty }) => `• ${qty} × ${p.nombre} (${formatearPrecio(precioFinal(p) * qty)})`);
  const msg = `Hola A V Juegos, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
  foot.innerHTML = `<div class="drawer-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer-nota">La entrega la coordinamos por WhatsApp después de la compra.</p>
    <button type="button" class="btn btn--primary" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost btn--wa" href="${esc(waLink(msg))}" target="_blank" rel="noopener">${ICON.wa}Enviar el pedido por WhatsApp</a>`;
}
function initCartDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  Cart.syncStock();
  d.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCartDrawer(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
    const st = e.target.closest('[data-cart-step]');
    if (st) {
      const id = st.closest('[data-linea]').dataset.linea;
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + Number(st.dataset.cartStep));
      return;
    }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  d.addEventListener('change', e => {
    const input = e.target.closest('[data-linea] input');
    if (input) Cart.setQty(input.closest('[data-linea]').dataset.linea, parseInt(input.value, 10) || 1);
  });
  d.addEventListener('keydown', e => atraparFoco(d, e));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !d.hidden) closeCartDrawer(); });
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCart(); });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function volarFicha(origen) {
  if (reduceMotion || !origen || typeof origen.animate !== 'function') return;
  const enPantalla = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight; };
  const destino = [document.querySelector('.site-header [data-open-cart]'), document.getElementById('cart-float')].find(el => el && enPantalla(el));
  if (!destino) return;
  const a = origen.getBoundingClientRect(), b = destino.getBoundingClientRect();
  const color = window.getComputedStyle(origen.closest('[data-color]') || document.body).getPropertyValue('--c').trim();
  const f = document.createElement('span');
  f.className = 'ficha-vuela';
  if (color) f.style.setProperty('--c', color);
  document.body.appendChild(f);
  const x0 = a.left + a.width / 2 - 9, y0 = a.top + a.height / 2 - 9, x1 = b.left + b.width / 2 - 9, y1 = b.top + b.height / 2 - 9;
  const anim = f.animate([
    { transform: `translate(${x0}px, ${y0}px) scale(.5)`, opacity: 0 },
    { transform: `translate(${x0}px, ${y0 - 26}px) scale(1.15)`, opacity: 1, offset: 0.22 },
    { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 70}px) scale(1)`, opacity: 1, offset: 0.6 },
    { transform: `translate(${x1}px, ${y1}px) scale(.45)`, opacity: 0.3 },
  ], { duration: 760, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' });
  anim.onfinish = () => f.remove();
  anim.oncancel = () => f.remove();
}

function cantidadDe(btn) {
  const input = btn.closest('.prod-actions, .quick-acciones')?.querySelector('.stepper input');
  const n = parseInt(input?.value, 10);
  return { input, qty: Number.isFinite(n) && n > 0 ? n : 1 };
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const max = parseInt(input.max, 10) || 99;
      input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p || !disponible(p)) return;
      const { input, qty } = cantidadDe(add);
      const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
      if (enCarrito >= p.stock) { showToast(`Ya tenés todo el stock de ${p.nombre} en el carrito`); return; }
      Cart.add(p, qty);
      volarFicha(add);
      showToast(`${p.nombre} ya está en tu carrito`);
      if (input) input.value = 1;
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p || !disponible(p)) return;
      const { qty } = cantidadDe(buy.closest('.card')?.querySelector('[data-add]') || buy);
      const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
      if (enCarrito < p.stock) Cart.add(p, qty);
      openCartDrawer();
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { e.preventDefault(); abrirQuick(quick.dataset.quick); }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('.stepper:not([data-linea]) input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid) return;
  const $ = s => document.querySelector(s);
  const el = {
    filtros: $('.filtros'), grupos: $('[data-filtros-grupos]'), chips: $('[data-chips-cat]'), buscar: $('#catBuscar'),
    ordenes: [...document.querySelectorAll('[data-orden]')], contador: $('[data-contador]'), mas: $('[data-ver-mas]'), masInfo: $('[data-ver-mas-info]'),
    vacio: $('[data-sin-res]'), activos: $('[data-activos]'), h1: $('[data-cat-h1]'), lead: $('[data-cat-lead]'), miga: $('[data-miga-actual]'),
    abrir: $('[data-abrir-filtros]'), badgeFiltros: $('[data-filtros-cant]'), ver: $('[data-ver-resultados]'),
  };
  const st = { cat: [], jug: '', edad: '', dur: '', precio: '', extra: [], q: '', orden: 'destacados' };
  let cursor = null, total = 0;
  const cant = Object.fromEntries(Servidor.resumen().map(r => [r.id, r.cantidad]));
  const radio = (grupo, valores) => Object.entries(valores).map(([v, d]) => `<label class="opcion"><input type="radio" name="f-${grupo}" data-f="${grupo}" value="${v}">${esc(typeof d === 'string' ? d : d.label)}</label>`).join('');
  const grupos = [
    { id: 'jug', titulo: 'Jugadores', html: `<label class="opcion"><input type="radio" name="f-jug" data-f="jug" value="" checked>Cualquier cantidad</label>${radio('jug', JUGADORES)}` },
    { id: 'edad', titulo: 'Edad del más chico', html: `<label class="opcion"><input type="radio" name="f-edad" data-f="edad" value="" checked>Cualquier edad</label>${radio('edad', EDADES)}` },
    { id: 'dur', titulo: 'Duración', html: `<label class="opcion"><input type="radio" name="f-dur" data-f="dur" value="" checked>Cualquier duración</label>${radio('dur', DURACIONES)}` },
    { id: 'precio', titulo: 'Precio', html: `<label class="opcion"><input type="radio" name="f-precio" data-f="precio" value="" checked>Cualquier precio</label>${radio('precio', RANGOS)}` },
    { id: 'extra', titulo: 'Más filtros', html: Object.entries(EXTRAS).map(([v, l]) => `<label class="opcion"><input type="checkbox" data-f="extra" value="${v}">${esc(l)}</label>`).join('') },
  ];
  const catChecks = CATEGORIAS.map(c => `<label class="opcion"><input type="checkbox" data-f="cat" value="${c.id}"><span class="dot" data-color="${c.id}"></span>${esc(c.nombre)}<span class="cant">${cant[c.id] || 0}</span></label>`).join('');
  if (esM2) {
    if (el.chips) el.chips.innerHTML = CATEGORIAS.map(c => `<label class="chip-cat"><input type="checkbox" data-f="cat" value="${c.id}"><span class="dot" data-color="${c.id}"></span>${esc(c.nombre)}<span class="cant">${cant[c.id] || 0}</span></label>`).join('');
    el.grupos.insertAdjacentHTML('afterbegin', grupos.map(g => `<details class="filtro-pop" data-pop="${g.id}"><summary>${esc(g.titulo)}<b data-pop-cant hidden></b>${ICON.chevron}</summary><fieldset class="filtro"><legend>${esc(g.titulo)}</legend>${g.html}</fieldset></details>`).join(''));
  } else {
    el.grupos.innerHTML = `<fieldset class="filtro"><legend>Categoría</legend>${catChecks}</fieldset>` + grupos.map(g => `<fieldset class="filtro"><legend>${esc(g.titulo)}</legend>${g.html}</fieldset>`).join('');
  }
  const inputs = () => [...document.querySelectorAll('input[data-f]')];

  const leerURL = () => {
    const u = new URLSearchParams(location.search);
    const ids = new Set(CATEGORIAS.map(c => c.id));
    st.cat = (u.get('cat') || '').split(',').filter(id => ids.has(id));
    st.jug = JUGADORES[u.get('jug')] ? u.get('jug') : '';
    st.edad = EDADES[u.get('edad')] ? u.get('edad') : '';
    st.dur = DURACIONES[u.get('dur')] ? u.get('dur') : '';
    st.precio = RANGOS[u.get('precio')] ? u.get('precio') : '';
    st.extra = (u.get('extra') || '').split(',').filter(x => EXTRAS[x]);
    st.q = (u.get('q') || '').trim().slice(0, 60);
    st.orden = ORDENES[u.get('orden')] ? u.get('orden') : 'destacados';
  };
  const aInputs = () => {
    inputs().forEach(i => {
      const g = i.dataset.f;
      if (Array.isArray(st[g])) i.checked = st[g].includes(i.value);
      else i.checked = (st[g] || '') === i.value;
    });
    if (el.buscar) el.buscar.value = st.q;
    el.ordenes.forEach(s => { s.value = st.orden; });
  };
  const deInputs = () => {
    ['cat', 'extra'].forEach(g => { st[g] = [...new Set(inputs().filter(i => i.dataset.f === g && i.checked).map(i => i.value))]; });
    ['jug', 'edad', 'dur', 'precio'].forEach(g => { st[g] = inputs().find(i => i.dataset.f === g && i.checked)?.value || ''; });
  };
  const escribirURL = () => {
    const u = new URLSearchParams();
    if (st.cat.length) u.set('cat', st.cat.join(','));
    ['jug', 'edad', 'dur', 'precio'].forEach(g => { if (st[g]) u.set(g, st[g]); });
    if (st.extra.length) u.set('extra', st.extra.join(','));
    if (st.q) u.set('q', st.q);
    if (st.orden !== 'destacados') u.set('orden', st.orden);
    const s = u.toString();
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
    document.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => { a.href = a.dataset.base + (s ? `?${s}` : ''); });
  };
  const filtrosServidor = () => ({ cat: st.cat, jug: st.jug, edad: st.edad, dur: st.dur, precio: st.precio, extra: st.extra, q: st.q });
  const etiquetasActivas = () => [
    ...st.cat.map(id => ({ k: `cat:${id}`, t: catDe(id).nombre })),
    st.jug && { k: 'jug', t: JUGADORES[st.jug].label },
    st.edad && { k: 'edad', t: st.edad === '14' ? 'Solo grandes' : `El más chico: ${EDADES[st.edad].label}` },
    st.dur && { k: 'dur', t: DURACIONES[st.dur].label },
    st.precio && { k: 'precio', t: RANGOS[st.precio].label },
    ...st.extra.map(x => ({ k: `extra:${x}`, t: EXTRAS[x] })),
    st.q && { k: 'q', t: `«${st.q}»` },
  ].filter(Boolean);
  const cabecera = () => {
    const una = st.cat.length === 1 ? catDe(st.cat[0]) : null;
    if (el.h1) el.h1.innerHTML = una ? `<span class="dot" data-color="${una.id}"></span>${esc(una.nombre)}` : 'Todos los juegos';
    if (el.lead) el.lead.textContent = st.q ? `Resultados para «${st.q}» entre juegos de mesa y didácticos.` : una ? una.bajada : 'Juegos de mesa y didácticos de 3 a 99 años: filtrá por categoría, por cuántos juegan y por la edad del más chico.';
    if (el.miga) el.miga.textContent = una ? una.nombre : 'Catálogo';
    const migaCat = document.querySelector('[data-miga-cat]');
    if (migaCat) migaCat.hidden = !una;
    document.title = una ? `${una.nombre} — A V Juegos` : 'Catálogo de juegos de mesa — A V Juegos';
    const act = etiquetasActivas();
    if (el.activos) {
      el.activos.hidden = !act.length;
      el.activos.innerHTML = act.map(a => `<button type="button" class="activo" data-quitar-filtro="${esc(a.k)}" aria-label="Quitar filtro ${esc(a.t)}">${esc(a.t)}${ICON.cerrar}</button>`).join('') + (act.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    }
    const n = act.filter(a => a.k !== 'q').length;
    if (el.badgeFiltros) { el.badgeFiltros.textContent = n; el.badgeFiltros.hidden = !n; }
    document.querySelectorAll('[data-pop]').forEach(d => {
      const g = d.dataset.pop, b = d.querySelector('[data-pop-cant]');
      const k = Array.isArray(st[g]) ? st[g].length : st[g] ? 1 : 0;
      if (b) { b.textContent = k; b.hidden = !k; }
    });
  };
  const render = reset => {
    if (reset) { cursor = null; grid.innerHTML = ''; }
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor, limite: POR_PAGINA });
    total = res.total; cursor = res.cursor;
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    const vistos = grid.children.length;
    grid.hidden = total === 0;
    if (el.vacio) el.vacio.hidden = total > 0;
    if (el.mas) el.mas.hidden = !cursor;
    if (el.masInfo) el.masInfo.textContent = total ? `Viendo ${vistos} de ${juegos(total)}` : '';
    if (el.contador) el.contador.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'juego' : 'juegos'}`;
    if (el.ver) el.ver.textContent = total ? `Ver ${juegos(total)}` : 'Sin resultados';
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { escribirURL(); cabecera(); render(true); };

  document.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (i) { deInputs(); aplicar(); return; }
    const o = e.target.closest('[data-orden]');
    if (o) { st.orden = ORDENES[o.value] ? o.value : 'destacados'; el.ordenes.forEach(s => { s.value = st.orden; }); aplicar(); }
  });
  let tBuscar = 0;
  el.buscar?.addEventListener('input', () => {
    clearTimeout(tBuscar);
    tBuscar = setTimeout(() => { st.q = el.buscar.value.trim().slice(0, 60); aplicar(); }, 220);
  });
  el.buscar?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); st.q = el.buscar.value.trim().slice(0, 60); aplicar(); });
  el.mas?.addEventListener('click', () => render(false));
  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const [g, v] = quitar.dataset.quitarFiltro.split(':');
      if (Array.isArray(st[g])) st[g] = st[g].filter(x => x !== v); else st[g] = '';
      aInputs(); aplicar(); return;
    }
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(st, { cat: [], jug: '', edad: '', dur: '', precio: '', extra: [], q: '' });
      aInputs(); aplicar(); return;
    }
    const pop = e.target.closest('.filtro-pop');
    document.querySelectorAll('.filtro-pop[open]').forEach(d => { if (d !== pop && window.innerWidth > 1024) d.open = false; });
  });
  document.querySelectorAll('.filtro-pop').forEach(d => d.addEventListener('toggle', () => {
    if (d.open && window.innerWidth > 1024) document.querySelectorAll('.filtro-pop[open]').forEach(o => { if (o !== d) o.open = false; });
  }));

  const bd = document.createElement('div');
  bd.className = 'filtros-backdrop';
  bd.hidden = true;
  document.body.appendChild(bd);
  const abrirFiltros = () => { el.filtros.classList.add('open'); bd.hidden = false; syncNoScroll(); el.filtros.querySelector('input, button')?.focus(); };
  const cerrarFiltros = () => { if (!el.filtros.classList.contains('open')) return; el.filtros.classList.remove('open'); bd.hidden = true; syncNoScroll(); el.abrir?.focus(); };
  el.abrir?.addEventListener('click', abrirFiltros);
  bd.addEventListener('click', cerrarFiltros);
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  el.filtros?.addEventListener('keydown', e => { if (el.filtros.classList.contains('open')) atraparFoco(el.filtros, e); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    cerrarFiltros();
    document.querySelectorAll('.filtro-pop[open]').forEach(d => { d.open = false; });
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', m => { if (m.matches) cerrarFiltros(); });

  document.querySelectorAll('.gw-modelos__btn').forEach(a => { a.dataset.base = a.getAttribute('href').split('?')[0]; });
  leerURL();
  aInputs();
  escribirURL();
  cabecera();
  render(true);
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

const buscoQ = new URLSearchParams(location.search).has('q');
initConteos();
initRail();
initPreview();
initGuia();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initNav();
initMenuCat();
initBuscadorHeader();
initAcciones();
initCartDrawer();
initQuick();
initFloats();
initModelBarScroll();
updateCartBadge();
if (PAGINA === 'catalogo' && buscoQ) document.getElementById('catBuscar')?.focus({ preventScroll: true });
