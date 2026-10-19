const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5492995035263';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const MIN_MAYORISTA = 6;
const PARAMS = new URLSearchParams(location.search);
const CANAL = PAGINA === 'catalogo' && PARAMS.get('canal') === 'mayorista' ? 'mayorista' : 'minorista';

const CATEGORIAS = [
  { id: 'dama', nombre: 'Dama', bajada: 'Camisas, blusas, pantalones, jeans, tejidos y vestidos.', img: 'images/p-camisa-lino.webp', subs: { camisas: 'Camisas y blusas', pantalones: 'Pantalones y jeans', abrigos: 'Tejidos', vestidos: 'Vestidos' } },
  { id: 'caballero', nombre: 'Caballero', bajada: 'Camisas, chinos y jeans para todos los días.', img: 'images/p-camisa-celeste.webp', subs: { camisas: 'Camisas', pantalones: 'Pantalones y jeans' } },
  { id: 'ninos', nombre: 'Niños', bajada: 'Conjuntos, shorts y enteritos de algodón.', img: 'images/p-conjunto.webp', subs: { conjuntos: 'Conjuntos y shorts', bebes: 'Bebés' } },
  { id: 'calzado', nombre: 'Calzado', bajada: 'Zapatillas, chatitas y sandalias.', img: 'images/p-zapatillas.webp', subs: { zapatillas: 'Zapatillas', chatitas: 'Chatitas y sandalias' } },
  { id: 'blanqueria', nombre: 'Blanquería', bajada: 'Sábanas, toallones, almohadas, mantas y acolchados.', img: 'images/blanqueria.webp', subs: { cama: 'Cama', bano: 'Baño' } },
];
const RANGOS = {
  hasta20: { nombre: 'Menos de $20.000', max: 19999 },
  '20a35': { nombre: '$20.000 a $35.000', min: 20000, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién ingresados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { Talle: 'Elegí el talle', Medida: 'Elegí la medida', Color: 'Elegí el color', Edad: 'Elegí la edad' };

const T_LETRAS = ['S', 'M', 'L', 'XL'];
const T_DAMA = ['36', '38', '40', '42', '44', '46'];
const T_HOMBRE = ['38', '40', '42', '44', '46', '48'];
const T_NINOS = ['2', '4', '6', '8', '10'];
const T_CALZADO = ['35', '36', '37', '38', '39', '40'];
const ops = (lista, menor, mayor) => lista.map(v => ({ v, menor, mayor }));

const PRODUCTOS = [
  { id: 'camisa-lino', nombre: 'Camisa de lino rosa viejo', cat: 'dama', sub: 'camisas', tipo: 'Talle', ops: ops(T_LETRAS, 36900, 27500), descuento: 0, stock: 30, rango: 1, alta: 21,
    img: 'images/p-camisa-lino.webp', alt: 'Camisa de lino rosa viejo con las mangas arremangadas, sobre un maniquí',
    desc: 'Lino liviano con botones nacarados y puños que se arremangan con presilla. Calce recto: va suelta, anudada o por dentro del pantalón.', tags: ['lino', 'rosa', 'manga 3/4'] },
  { id: 'camisa-oxford', nombre: 'Camisa Oxford celeste', cat: 'caballero', sub: 'camisas', tipo: 'Talle', ops: ops(['S', 'M', 'L', 'XL', 'XXL'], 34900, 25900), descuento: 0, stock: 36, rango: 2, alta: 20,
    img: 'images/p-camisa-celeste.webp', alt: 'Camisa Oxford celeste de manga larga colgada en una percha',
    desc: 'Tela Oxford de algodón con bolsillo en el pecho y botones al tono. Sirve para la oficina y para el fin de semana.', tags: ['celeste', 'oxford', 'algodon', 'manga larga'] },
  { id: 'jean-hombre', nombre: 'Jean clásico de hombre', cat: 'caballero', sub: 'pantalones', tipo: 'Talle', ops: ops(T_HOMBRE, 41900, 31500), descuento: 10, stock: 50, rango: 3, alta: 19,
    img: 'images/p-jeans-hombre.webp', alt: 'Jeans de hombre en distintos lavados colgados en un perchero',
    desc: 'Corte recto de cinco bolsillos en lavado claro, medio y oscuro. Por mayor podés combinar lavados y talles.', tags: ['jean', 'denim', 'azul', 'recto'] },
  { id: 'jean-dama', nombre: 'Jean recto tiro alto', cat: 'dama', sub: 'pantalones', tipo: 'Talle', ops: ops(T_DAMA, 39900, 29500), descuento: 0, stock: 40, rango: 4, alta: 18,
    img: 'images/p-jean-dama.webp', alt: 'Jean recto de tiro alto en lavado celeste, extendido',
    desc: 'Denim con leve elastizado, tiro alto y botamanga recta. Lavado celeste que combina con todo.', tags: ['jean', 'denim', 'celeste', 'tiro alto'] },
  { id: 'conjunto-rayado', nombre: 'Conjunto remera rayada y short', cat: 'ninos', sub: 'conjuntos', tipo: 'Talle', ops: ops(T_NINOS, 24900, 17900), descuento: 0, stock: 32, rango: 5, alta: 17,
    img: 'images/p-conjunto.webp', alt: 'Conjunto infantil de remera a rayas rosa y crudo con short de rústico rosa',
    desc: 'Remera de algodón a rayas con bolsillo y short de rústico con cordón. Talles del 2 al 10.', tags: ['nene', 'nena', 'remera', 'short', 'rayas', 'algodon'] },
  { id: 'zapatillas-urbanas', nombre: 'Zapatillas urbanas blancas', cat: 'calzado', sub: 'zapatillas', tipo: 'Talle', ops: ops(['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], 49900, 38500), descuento: 0, stock: 24, rango: 6, alta: 16,
    img: 'images/p-zapatillas.webp', alt: 'Par de zapatillas urbanas blancas con cordones',
    desc: 'Capellada símil cuero con suela de goma cosida. Del 35 al 44, para dama y caballero.', tags: ['zapatillas', 'blancas', 'urbanas', 'unisex'] },
  { id: 'sabanas-algodon', nombre: 'Juego de sábanas de algodón', cat: 'blanqueria', sub: 'cama', tipo: 'Medida',
    ops: [{ v: '1½ plaza', menor: 28900, mayor: 21500 }, { v: '2 plazas', menor: 34900, mayor: 25900 }, { v: 'Queen', menor: 39900, mayor: 29900 }], descuento: 0, stock: 26, rango: 7, alta: 15,
    img: 'images/p-sabanas.webp', alt: 'Juegos de sábanas lisas en rosa viejo y crudo, doblados y apilados',
    desc: 'Sábana ajustable, sábana plana y fundas, en rosa viejo o crudo. Elegí la medida de tu colchón.', tags: ['sabanas', 'cama', 'rosa', 'crudo', 'algodon'] },
  { id: 'camisa-hombre', nombre: 'Camisa de hombre lisa o a cuadros', cat: 'caballero', sub: 'camisas', tipo: 'Talle', ops: ops(['M', 'L', 'XL', 'XXL'], 32900, 24500), descuento: 0, stock: 60, rango: 8, alta: 14,
    img: 'images/p-camisas-hombre.webp', alt: 'Camisas de hombre lisas y a cuadros colgadas en un perchero',
    desc: 'Manga larga en beige, celeste, blanco, verde y cuadros. Por menor elegís el color al confirmar; por mayor van surtidas.', tags: ['cuadros', 'lisa', 'manga larga', 'verde', 'beige'] },
  { id: 'blusa-volados', nombre: 'Blusa de fibrana con volados', cat: 'dama', sub: 'camisas', tipo: 'Talle', ops: ops(T_LETRAS, 29900, 21900), descuento: 20, stock: 48, alta: 13,
    img: 'images/p-blusas.webp', alt: 'Blusas de fibrana con volados en estampa floral, rosa viejo y crudo colgadas en un perchero',
    desc: 'Fibrana fresca con volados en mangas y escote. Viene en estampa floral, rosa viejo y crudo; por mayor van surtidas.', tags: ['floral', 'estampada', 'rosa', 'crudo', 'volados'] },
  { id: 'cardigan-trenzado', nombre: 'Cárdigan trenzado con botones', cat: 'dama', sub: 'abrigos', tipo: 'Talle', ops: ops(['S/M', 'L/XL'], 44900, 33500), descuento: 15, stock: 14, alta: 12,
    img: 'images/p-cardigan.webp', alt: 'Cárdigan tejido color crudo con trenzas y botones, doblado',
    desc: 'Tejido con trenzas, escote en V y botones de madera. Abriga sin pesar.', tags: ['tejido', 'sweater', 'abrigo', 'crudo', 'saco'] },
  { id: 'short-rustico', nombre: 'Short de rústico con cordón', cat: 'ninos', sub: 'conjuntos', tipo: 'Talle', ops: ops(T_NINOS, 13900, 9900), descuento: 25, stock: 40, alta: 11,
    img: 'images/p-short.webp', alt: 'Short infantil de rústico rosa con cordón crudo',
    desc: 'Rústico de algodón con cintura elástica y cordón. Talles del 2 al 10.', tags: ['short', 'nene', 'nena', 'rustico', 'rosa'] },
  { id: 'chatitas-mono', nombre: 'Chatitas con moño', cat: 'calzado', sub: 'chatitas', tipo: 'Talle', ops: ops(T_CALZADO, 32900, 24900), descuento: 20, stock: 12, alta: 10,
    img: 'images/p-chatitas.webp', alt: 'Chatitas rosas de punta con moño al frente',
    desc: 'Punta fina, moño al frente y plantilla acolchada. Del 35 al 40.', tags: ['chatitas', 'balerinas', 'rosa', 'moño'] },
  { id: 'almohada-fibra', nombre: 'Almohada de fibra siliconada', cat: 'blanqueria', sub: 'cama', tipo: 'Medida', ops: [{ v: '70 × 40 cm', menor: 14900, mayor: 10500 }], descuento: 15, stock: 60, alta: 9,
    img: 'images/p-almohadas.webp', alt: 'Almohadas con funda rosa viejo y crudo apiladas',
    desc: 'Relleno de fibra siliconada con funda de percal. Mide 70 × 40 cm.', tags: ['almohada', 'cama', 'fibra'] },
  { id: 'manta-chenille', nombre: 'Manta tejida de chenille', cat: 'blanqueria', sub: 'cama', tipo: 'Medida',
    ops: [{ v: '1½ plaza', menor: 34900, mayor: 25500 }, { v: '2 plazas', menor: 42900, mayor: 31500 }], descuento: 20, stock: 10, alta: 8,
    img: 'images/p-manta.webp', alt: 'Manta tejida de chenille rosa sobre una cama',
    desc: 'Tejido grueso de chenille, suave al tacto. Sirve de pie de cama o para el sillón.', tags: ['manta', 'pie de cama', 'rosa', 'chenille'] },
  { id: 'pantalon-sastrero', nombre: 'Pantalón sastrero de lino crudo', cat: 'dama', sub: 'pantalones', tipo: 'Talle', ops: ops(T_DAMA, 42900, 31900), descuento: 0, stock: 22, alta: 7,
    img: 'images/p-pantalon-sastrero.webp', alt: 'Pantalón sastrero de lino crudo con pinzas, sobre un maniquí',
    desc: 'Tiro alto, pinzas al frente y pierna recta. Combina con la camisa de lino rosa viejo.', tags: ['lino', 'crudo', 'sastrero', 'pinzas'] },
  { id: 'vestido-gasa', nombre: 'Vestido de gasa con volado', cat: 'dama', sub: 'vestidos', tipo: 'Talle', ops: ops(['S', 'M', 'L'], 38900, 28900), descuento: 0, stock: 3, alta: 6,
    img: 'images/p-vestido.webp', alt: 'Vestido de gasa rosa con volado y musculosa amarilla sobre una percha',
    desc: 'Gasa de algodón con botones al frente y volado en el ruedo. Fresco para la primavera.', tags: ['vestido', 'gasa', 'rosa', 'primavera'] },
  { id: 'chino-gabardina', nombre: 'Pantalón chino de gabardina', cat: 'caballero', sub: 'pantalones', tipo: 'Talle', ops: ops(T_HOMBRE, 39900, 29900), descuento: 0, stock: 28, alta: 5,
    img: 'images/p-chino.webp', alt: 'Pantalón chino de gabardina gris oscuro, doblado',
    desc: 'Gabardina con leve elastizado, bolsillos al sesgo y botón de pasta. Color gris topo.', tags: ['chino', 'gabardina', 'gris'] },
  { id: 'enterito-osito', nombre: 'Enterito de algodón con osito', cat: 'ninos', sub: 'bebes', tipo: 'Edad', ops: ops(['0-3 m', '3-6 m', '6-9 m', '9-12 m'], 19900, 14500), descuento: 0, stock: 18, alta: 4,
    img: 'images/p-enterito.webp', alt: 'Enterito de bebé crudo con un osito de corderito rosa en el pecho, colgado de una rama',
    desc: 'Algodón suave con pie cerrado, broches y aplique de corderito. De 0 a 12 meses.', tags: ['bebe', 'enterito', 'osito', 'algodon'] },
  { id: 'toallones', nombre: 'Juego de toalla y toallón', cat: 'blanqueria', sub: 'bano', tipo: 'Color', ops: ops(['Rosa viejo', 'Crudo'], 21900, 15900), descuento: 0, stock: 44, alta: 3,
    img: 'images/p-toallones.webp', alt: 'Toallas y toallones de felpa en rosa viejo y crudo apilados',
    desc: 'Felpa de algodón con guarda tejida. Viene en rosa viejo o crudo.', tags: ['toalla', 'toallon', 'baño', 'felpa'] },
  { id: 'acolchado-infantil', nombre: 'Acolchado infantil estampado', cat: 'blanqueria', sub: 'cama', tipo: 'Medida', ops: [{ v: '1 plaza', menor: 36900, mayor: 27500 }], descuento: 0, stock: 8, alta: 2,
    img: 'images/p-acolchado.webp', alt: 'Acolchado infantil rosa con estampa de animalitos sobre una cama',
    desc: 'Acolchado de microfibra con estampa de animalitos y reverso rosa. Para cama de 1 plaza.', tags: ['infantil', 'nene', 'nena', 'rosa', 'acolchado'] },
  { id: 'sandalias-taco', nombre: 'Sandalias de cuero con taco bajo', cat: 'calzado', sub: 'chatitas', tipo: 'Talle', ops: ops(T_CALZADO, 45900, 34900), descuento: 0, stock: 0, alta: 1,
    img: 'images/p-sandalias.webp', alt: 'Sandalias de cuero color suela con taco bajo y tira al tobillo',
    desc: 'Cuero color suela, punta cerrada, tira con hebilla y taco bajo.', tags: ['sandalias', 'cuero', 'taco', 'suela'] },
  { id: 'proximo-ingreso', nombre: 'Próximo ingreso', cat: 'dama', sub: 'camisas', tipo: 'Talle', ops: ops(T_LETRAS, 1, 1), descuento: 0, stock: 0, alta: 0, visible: false,
    img: 'images/p-blusas.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const conDescuento = (p, n) => (p.descuento > 0 ? redondear(n * (1 - p.descuento / 100)) : n);
const precioMenor = (p, op = p.ops[0]) => conDescuento(p, op.menor);
const precioMayor = (p, op = p.ops[0]) => conDescuento(p, op.mayor);
const desdeMenor = p => Math.min(...p.ops.map(op => precioMenor(p, op)));
const desdeMayor = p => Math.min(...p.ops.map(op => precioMayor(p, op)));
const variosPrecios = p => new Set(p.ops.map(op => op.menor)).size > 1;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = p => catDe(p.cat)?.subs?.[p.sub] || '';

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.sub && p.sub !== f.sub) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desdeMenor(p) < f.precioMin) return false;
    if (f.precioMax != null && desdeMenor(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desdeMenor(a) - desdeMenor(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desdeMenor(b) - desdeMenor(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'descuento': return (a, b) => b.descuento - a.descuento || b.alta - a.alta || desempate(a, b);
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
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, subDe(p), p.desc, p.tipo, ...p.ops.map(op => op.v), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9½]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];
const unidades = n => `${n} ${n === 1 ? 'unidad' : 'unidades'}`;

function crearCarrito(KEY, precio) {
  return {
    KEY,
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
    add(producto, qty = 1, v = null) {
      const items = this.get();
      const variante = v ?? producto.ops[0].v;
      const max = producto.stock ?? 99;
      const existing = items.find(i => i.id === producto.id && i.v === variante);
      if (existing) existing.qty = Math.min(existing.qty + qty, max);
      else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
      this.save(items);
    },
    set(id, v, qty) {
      const p = getProducto(id);
      if (!p) return;
      const items = this.get();
      const n = Math.max(0, Math.min(parseInt(qty, 10) || 0, p.stock ?? 99));
      const i = items.findIndex(x => x.id === id && x.v === v);
      if (i >= 0 && n === 0) items.splice(i, 1);
      else if (i >= 0) items[i].qty = n;
      else if (n > 0) items.push({ id, v, qty: n });
      this.save(items);
    },
    setQty(id, v, qty) {
      const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
      const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
    },
    qtyDe(id, v) { return this.get().find(i => i.id === id && i.v === v)?.qty || 0; },
    remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precio(p, opDe(p, i.v)) * i.qty : s; }, 0); },
  };
}
const Cart = crearCarrito('uchilla_cart', precioMenor);
const Pedido = crearCarrito('uchilla_pedido_mayorista', precioMayor);

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  caja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>',
  etiqueta: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function resumenVar(p) {
  if (p.ops.length === 1) return p.ops[0].v;
  const primero = p.ops[0].v, ultimo = p.ops[p.ops.length - 1].v;
  if (p.tipo === 'Color') return `${p.ops.length} colores`;
  if (p.tipo === 'Medida') return p.ops.map(op => op.v).join(' · ');
  if (p.tipo === 'Edad') return `De ${primero.replace(' m', '')} a ${ultimo}`;
  return `Talles ${primero} al ${ultimo}`;
}
const metaDe = p => [catDe(p.cat)?.nombre, subDe(p)].filter(Boolean).join(' · ');

function etiquetaHTML(p, clase = '') {
  const desde = variosPrecios(p) ? '<i>desde</i>' : '';
  return `<div class="ptag ${clase}">
    <p class="ptag__min"><span>Por menor</span><b>${desde}${formatearPrecio(desdeMenor(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(Math.min(...p.ops.map(op => op.menor)))}</s>` : ''}</p>
    <p class="ptag__may"><span>Por mayor</span><b>${desde}${formatearPrecio(desdeMayor(p))}</b></p>
  </div>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (p.stock > 0 && p.stock <= 3) badge = '<span class="pcard__badge">Últimas unidades</span>';
  const sinStock = !(p.stock > 0);
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div>
    ${badge}
    <span class="pcard__var">${esc(sinStock ? 'Sin stock por ahora' : resumenVar(p))}</span>
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${etiquetaHTML(p)}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu(catActual = '') {
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    const lista = box.querySelector('[data-cats-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li class="nav-cats__col">
      <a class="nav-cats__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a>
      <ul class="nav-cats__subs">${Object.entries(c.subs).map(([k, v]) => `<li><a href="${URL_CATALOGO}?cat=${c.id}&amp;sub=${k}">${esc(v)}</a></li>`).join('')}</ul>
    </li>`).join('');
    lista.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    function cerrar() { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initOfertasHome() {
  const cont = document.querySelector('[data-ofertas-home]');
  if (!cont) return;
  const enRail = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items.map(p => p.id);
  const limite = parseInt(cont.dataset.ofertasHome, 10) || 6;
  const { items } = Tienda.consultar({ filtros: { ofertas: true, excluir: enRail }, orden: 'descuento', limite });
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: cont.hasAttribute('data-mosaico') && i === 0 ? 'pcard--grande' : '' })).join('');
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    if (el.closest('[data-cat-opciones]')) return;
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.hasAttribute('data-cuenta-corta') ? String(n) : `${n} ${n === 1 ? 'artículo' : 'artículos'}`;
  });
  document.querySelectorAll('[data-cuenta-ofertas]').forEach(el => {
    const n = Tienda.contar({ ofertas: true });
    el.textContent = el.hasAttribute('data-cuenta-corta') ? String(n) : `${n} ${n === 1 ? 'oferta' : 'ofertas'}`;
  });
  document.querySelectorAll('[data-min-mayorista]').forEach(el => { el.textContent = String(MIN_MAYORISTA); });
}

function initEtiquetaMayorista() {
  document.querySelectorAll('[data-etq-producto]').forEach(box => {
    const p = getProducto(box.dataset.etqProducto);
    if (!p) return;
    const set = (sel, txt) => box.querySelectorAll(sel).forEach(el => { el.textContent = txt; });
    set('[data-etq-nombre]', p.nombre);
    set('[data-etq-menor]', formatearPrecio(desdeMenor(p)));
    set('[data-etq-mayor]', formatearPrecio(desdeMayor(p)));
    const ahorro = Math.round((1 - desdeMayor(p) / desdeMenor(p)) * 100);
    set('[data-etq-ahorro]', `${ahorro}% menos por unidad`);
  });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v)}</span>${variosPrecios(p) ? `<b>${formatearPrecio(precioMenor(p, op))}</b>` : ''}</button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

let ultimoCanal = 'minorista';
function sumarAlCarrito(p, qty, v, comprar) {
  Cart.add(p, qty, v);
  ultimoCanal = 'minorista';
  const detalle = p.ops.length > 1 ? ` (${opDe(p, v).v})` : '';
  if (comprar) abrirCarrito('minorista');
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${detalle} al carrito`);
}
function sumarAlPedido(p, qty, v) {
  Pedido.add(p, qty, v);
  ultimoCanal = 'mayorista';
  const u = Pedido.count();
  const faltan = Math.max(0, MIN_MAYORISTA - u);
  showToast(faltan ? `Sumado al pedido mayorista: llevás ${u}, te faltan ${faltan} para el mínimo` : `Sumado al pedido mayorista: ${unidades(u)} en total`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p?.stock || 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab') return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = 0; qvEstado.qty = 1;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Uchilla' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desdeMayor(p), highPrice: Math.max(...p.ops.map(op => precioMenor(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const tit = TITULO_VAR[p.tipo] || '';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(p.stock > 0);
  const stock = p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  const ahorro = Math.round((1 - precioMayor(p, op) / precioMenor(p, op)) * 100);
  const selector = p.ops.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">${esc(tit)}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(tit)}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b></button>`).join('')}</div></div>`
    : `<p class="qv__meta">${esc(op.v)}</p>`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="etq etq--qv">
        <span class="etq__ojal" aria-hidden="true"></span>
        <p class="etq__lado"><span>Por menor</span><b data-qv-menor>${formatearPrecio(precioMenor(p, op))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(op.menor)}</s>` : '<small>por unidad</small>'}</p>
        <p class="etq__lado etq__lado--may"><span>Por mayor</span><b data-qv-mayor>${formatearPrecio(precioMayor(p, op))}</b><small>${ahorro}% menos · desde ${MIN_MAYORISTA} u.</small></p>
      </div>
      ${selector}
      <p class="qv__stock">${sinStock ? ICO.info : ICO.check}${esc(stock)}</p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <button type="button" class="qv__may" data-qv-may${sinStock ? ' disabled' : ''}>${ICO.caja}<span>Sumar al pedido mayorista<small>Precio por mayor desde ${MIN_MAYORISTA} unidades surtidas</small></span></button>
      <p class="qv__desc">${esc(p.desc)}</p>
      <a class="qv__wsp" href="${wspLink(`Hola Uchilla! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : '¿Dudas con el talle o el color? Preguntanos'}</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(desdeMenor(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const p = qvEstado.p;
    if (!p) return;
    const v = p.ops[qvEstado.op].v;
    if (e.target.closest('[data-qv-comprar]')) { Cart.add(p, qvEstado.qty, v); ultimoCanal = 'minorista'; cerrarQV(); abrirCarrito('minorista'); return; }
    if (e.target.closest('[data-qv-add]')) { sumarAlCarrito(p, qvEstado.qty, v, false); return; }
    if (e.target.closest('[data-qv-may]')) { sumarAlPedido(p, qvEstado.qty, v); }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

function agruparPedido() {
  const grupos = new Map();
  Pedido.get().forEach(i => {
    const p = getProducto(i.id);
    if (!p) return;
    if (!grupos.has(p.id)) grupos.set(p.id, { p, lineas: [], u: 0, total: 0, ref: 0 });
    const g = grupos.get(p.id);
    const op = opDe(p, i.v);
    g.lineas.push({ v: i.v, qty: i.qty });
    g.u += i.qty;
    g.total += precioMayor(p, op) * i.qty;
    g.ref += precioMenor(p, op) * i.qty;
  });
  return [...grupos.values()];
}
function mensajePedido(grupos, u, total) {
  const lineas = grupos.map(g => `- ${g.p.nombre} (${g.lineas.map(l => `${l.v} × ${l.qty}`).join(', ')}): ${g.u} u. = ${formatearPrecio(g.total)}`).join('\n');
  return `Hola Uchilla! Quiero hacer este pedido mayorista:\n${lineas}\nTotal: ${unidades(u)} · ${formatearPrecio(total)}\nMi nombre es: \nMi negocio o localidad: `;
}
function pedidoHTML({ panel = false } = {}) {
  const grupos = agruparPedido();
  const u = grupos.reduce((s, g) => s + g.u, 0);
  const total = grupos.reduce((s, g) => s + g.total, 0);
  const ref = grupos.reduce((s, g) => s + g.ref, 0);
  const faltan = Math.max(0, MIN_MAYORISTA - u);
  const pct = Math.min(100, Math.round((u / MIN_MAYORISTA) * 100));
  const minimo = `<div class="minimo${faltan ? '' : ' minimo--ok'}"><div class="minimo__barra" aria-hidden="true"><span style="width:${pct}%"></span></div><p>${faltan ? `Te ${faltan === 1 ? 'falta 1 unidad' : `faltan ${faltan} unidades`} para el mínimo de ${MIN_MAYORISTA} surtidas.` : 'Llegaste al mínimo: precio por mayor en todo el pedido.'}</p></div>`;
  if (!grupos.length) {
    return `${minimo}<div class="pedido__vacio">${ICO.caja}<p class="pedido__vacio-tit">Tu pedido mayorista está vacío</p><p>${panel ? 'Cargá cantidades por talle en la lista y se suman acá.' : 'Entrá a la lista mayorista y cargá cantidades por talle.'}</p>${panel ? '' : `<a class="btn btn--cta" href="${URL_CATALOGO}?canal=mayorista">Abrir la lista mayorista</a>`}</div>`;
  }
  const lineas = `<ul class="pedido__lineas">${grupos.map(g => `<li class="pl" data-pl="${esc(g.p.id)}">
      <img src="${esc(g.p.img)}" alt="" width="56" height="56">
      <div><p class="pl__nombre">${esc(g.p.nombre)}</p><p class="pl__talles">${g.lineas.map(l => `${esc(l.v)} × ${l.qty}`).join(' · ')}</p></div>
      <p class="pl__tot"><b>${formatearPrecio(g.total)}</b><span>${g.u} u.</span></p>
      <button type="button" class="pl__quitar" data-pl-quitar="${esc(g.p.id)}" aria-label="Quitar ${esc(g.p.nombre)} del pedido">${ICO.basura}</button>
    </li>`).join('')}</ul>`;
  const msg = mensajePedido(grupos, u, total);
  const acciones = faltan
    ? `<button type="button" class="btn btn--cta" disabled>Finalizar compra</button><p class="pedido__aviso">Sumá ${unidades(faltan)} más para finalizar.</p>`
    : `<button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button><a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
  return `${minimo}${lineas}
    <dl class="pedido__tot"><div><dt>Unidades</dt><dd>${u}</dd></div><div><dt>Total por mayor</dt><dd><b>${formatearPrecio(total)}</b></dd></div>${ref > total ? `<div class="pedido__ahorro"><dt>Por menor te saldría</dt><dd><s>${formatearPrecio(ref)}</s> · ahorrás ${formatearPrecio(ref - total)}</dd></div>` : ''}</dl>
    <div class="pedido__acc">${acciones}</div>
    <p class="pedido__nota">${ICO.info}Confirmamos stock, colores, pago y entrega por WhatsApp.</p>
    <button type="button" class="pedido__vaciar" data-pedido-vaciar>Vaciar el pedido</button>`;
}

let focoCarrito = null;
let tabCarrito = 'minorista';
function abrirCarrito(tab) {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  tabCarrito = tab || (CANAL === 'mayorista' ? 'mayorista' : ultimoCanal);
  if (!tab && tabCarrito === 'minorista' && !Cart.count() && Pedido.count()) tabCarrito = 'mayorista';
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const dr = document.getElementById('cartDrawer');
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  if (!dr || !body || !foot) return;
  dr.querySelectorAll('[data-cart-tab]').forEach(t => {
    const activo = t.dataset.cartTab === tabCarrito;
    t.setAttribute('aria-selected', String(activo));
    t.tabIndex = activo ? 0 : -1;
  });
  dr.querySelectorAll('[data-n-min]').forEach(el => { el.textContent = Cart.count() ? `(${Cart.count()})` : ''; });
  dr.querySelectorAll('[data-n-may]').forEach(el => { el.textContent = Pedido.count() ? `(${Pedido.count()})` : ''; });
  if (tabCarrito === 'mayorista') {
    body.innerHTML = `<div class="pedido pedido--drawer">${pedidoHTML()}</div>`;
    foot.hidden = true;
    foot.innerHTML = '';
    return;
  }
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Sumá prendas por unidad desde la tienda.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="74" height="74">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(p.ops.length > 1 ? op.v : resumenVar(p))} · ${formatearPrecio(precioMenor(p, op))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioMenor(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const n = Cart.count();
  const porMayor = items.reduce((s, i) => { const p = getProducto(i.id); return s + precioMayor(p, opDe(p, i.v)) * i.qty; }, 0);
  const pasar = n >= MIN_MAYORISTA
    ? `<div class="pasar">${ICO.caja}<div><p class="pasar__tit">Llevás ${n} unidades: te conviene por mayor</p><p>El mismo pedido por mayor sale ${formatearPrecio(porMayor)} (ahorrás ${formatearPrecio(Cart.total() - porMayor)}).</p><button type="button" class="btn btn--ghost" data-pasar-mayorista>Pasarlo al pedido mayorista</button></div></div>`
    : '';
  const lineas = items.map(i => { const p = getProducto(i.id); const op = opDe(p, i.v); return `- ${i.qty} × ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioMenor(p, op) * i.qty)}`; }).join('\n');
  const msg = `Hola Uchilla! Quiero hacer esta compra por menor:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `${pasar}<p class="drawer__total"><span>Total por menor</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function pasarAMayorista() {
  const items = Cart.get();
  if (!items.length) return;
  const pedido = Pedido.get();
  items.forEach(i => {
    const p = getProducto(i.id);
    if (!p) return;
    const ex = pedido.find(x => x.id === i.id && x.v === i.v);
    if (ex) ex.qty = Math.min(ex.qty + i.qty, p.stock ?? 99);
    else pedido.push({ id: i.id, v: i.v, qty: i.qty });
  });
  try { localStorage.setItem(Pedido.KEY, JSON.stringify(pedido)); } catch (e) { console.warn(e); }
  Cart.clear();
  ultimoCanal = 'mayorista';
  tabCarrito = 'mayorista';
  renderCarrito();
  showToast('Listo: tu compra pasó al pedido mayorista.');
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const quitar = e.target.closest('[data-pl-quitar]');
    if (quitar) { Pedido.remove(quitar.dataset.plQuitar); return; }
    if (e.target.closest('[data-pedido-vaciar]')) { Pedido.clear(); showToast('Vaciaste el pedido mayorista.'); }
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const tab = e.target.closest('[data-cart-tab]');
    if (tab) { tabCarrito = tab.dataset.cartTab; renderCarrito(); dr.querySelector(`[data-cart-tab="${tabCarrito}"]`)?.focus(); return; }
    if (e.target.closest('[data-pasar-mayorista]')) { pasarAMayorista(); dr.querySelector('[data-cart-tab="mayorista"]')?.focus(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-cart-tab]')) {
      tabCarrito = tabCarrito === 'minorista' ? 'mayorista' : 'minorista';
      renderCarrito();
      dr.querySelector(`[data-cart-tab="${tabCarrito}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count() + Pedido.count();
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
    cart?.classList.toggle('visible', scrolled || Cart.count() + Pedido.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initCanal() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-canal-link]').forEach(a => {
    if (a.dataset.canalLink === CANAL) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-vista]').forEach(v => { v.hidden = v.dataset.vista !== CANAL; });
  document.body.classList.toggle('canal-mayorista', CANAL === 'mayorista');
}
function actualizarLinksCanal(estado) {
  document.querySelectorAll('[data-canal-link]').forEach(a => {
    const u = new URL(a.getAttribute('href'), location.href);
    ['cat', 'sub', 'q', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    a.setAttribute('href', `${u.pathname.split('/').pop()}${u.search}`);
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid || CANAL !== 'minorista') return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    sub: '',
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  if (estado.cat) estado.sub = valido(PARAMS.get('sub'), catIds[estado.cat].subs);
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const subsBox = document.querySelector('[data-subs]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas')}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.sub && sin !== 'cat' && sin !== 'sub') f.sub = estado.sub;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const pintarSubs = () => {
    if (!subsBox) return;
    const cat = catIds[estado.cat];
    subsBox.hidden = !cat;
    if (!cat) { subsBox.innerHTML = ''; return; }
    subsBox.innerHTML = [['', `Todo ${cat.nombre}`], ...Object.entries(cat.subs)].map(([k, v]) => `<button type="button" class="chip chip--sub" data-filtro="sub" data-valor="${k}" aria-pressed="${estado.sub === k}">${esc(v)}</button>`).join('');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else if (el.hasAttribute('data-toggle')) el.setAttribute('aria-pressed', String(!!estado[f]));
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    pintarSubs();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cat-opciones] [data-cuenta-cat]').forEach(el => {
      const id = el.dataset.cuentaCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-filtro-ofertas]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('ofertas'), ofertas: true }); });
    const activos = ['cat', 'precio'].filter(k => estado[k]).length + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0);
    if (filtrosN) { const enPanel = (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (estado.ofertas ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0); filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    let titulo = cat ? cat.nombre : estado.ofertas ? 'Ofertas varias' : 'Tienda por menor';
    if (cat && estado.sub) titulo = `${cat.nombre} · ${cat.subs[estado.sub]}`;
    else if (cat && estado.ofertas) titulo = `Ofertas en ${cat.nombre}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = estado.ofertas && !cat ? 'Artículos seleccionados con precio especial. Cada uno con su precio por menor y por mayor.' : cat ? cat.bajada : 'Cada artículo con su precio por menor y por mayor. Comprá por unidad acá o pasá a la lista mayorista.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !estado.ofertas; miga.textContent = titulo; }
    document.title = `${titulo} — Uchilla`;
    document.querySelectorAll('.nav-cats__cat').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    actualizarLinksCanal(estado);
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'precio', 'q', 'orden', 'stock', 'ofertas', 'buscar', 'canal'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.sub) u.searchParams.set('sub', estado.sub);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'artículo' : 'artículos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    if (f === 'cat') estado.sub = '';
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      const f = b.dataset.filtro;
      if (b.hasAttribute('data-toggle')) estado[f] = !estado[f];
      else estado[f] = b.dataset.valor || '';
      if (f === 'cat') estado.sub = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.sub = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function filaMayHTML(p, anim = true) {
  const sinStock = !(p.stock > 0);
  const varias = p.ops.length > 1;
  const desde = variosPrecios(p) ? 'desde ' : '';
  let badge = '';
  if (p.descuento > 0) badge = `<span class="mrow__badge">Oferta -${p.descuento}%</span>`;
  else if (sinStock) badge = '<span class="mrow__badge mrow__badge--sin">Sin stock por ahora</span>';
  else if (p.stock <= 3) badge = `<span class="mrow__badge mrow__badge--pocas">Quedan ${p.stock}</span>`;
  const etiquetaVar = p.tipo === 'Talle' ? 'talle' : p.tipo === 'Edad' ? 'edad' : p.tipo === 'Color' ? 'color' : 'medida';
  return `<article class="mrow${sinStock ? ' mrow--sin' : ''}" data-mrow="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : ''}>
    <button type="button" class="mrow__foto" data-quick="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="160" height="160"></button>
    <div class="mrow__info">
      <p class="mrow__meta">${esc(metaDe(p))}</p>
      <h3 class="mrow__nombre"><a href="?canal=mayorista&amp;producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      <p class="mrow__precio"><b>${desde}${formatearPrecio(desdeMayor(p))}</b><span>por mayor</span></p>
      <p class="mrow__ref">Por menor ${desde}${formatearPrecio(desdeMenor(p))}</p>
      ${badge}
    </div>
    <div class="mrow__talles" role="group" aria-label="Unidades por ${etiquetaVar} de ${esc(p.nombre)}">
      ${p.ops.map(op => `<label class="mt"><span class="mt__v">${esc(op.v)}</span><input type="number" inputmode="numeric" min="0" max="${p.stock}" step="1" placeholder="0" value="${Pedido.qtyDe(p.id, op.v) || ''}" data-may-cant="${esc(p.id)}" data-v="${esc(op.v)}" aria-label="Unidades de ${esc(p.nombre)}, ${etiquetaVar} ${esc(op.v)}"${sinStock ? ' disabled' : ''}>${variosPrecios(p) ? `<small>${formatearPrecio(precioMayor(p, op))}</small>` : ''}</label>`).join('')}
    </div>
    <div class="mrow__acc">
      ${varias ? `<button type="button" class="mrow__curva" data-curva="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${ICO.mas}<span>${p.tipo === 'Talle' ? 'Curva' : 'Uno de cada'}</span></button>` : ''}
      <p class="mrow__sub" data-may-sub="${esc(p.id)}" aria-live="polite"></p>
    </div>
  </article>`;
}

function syncFilasMay() {
  const items = Pedido.get();
  document.querySelectorAll('[data-mrow]').forEach(row => {
    const p = getProducto(row.dataset.mrow);
    if (!p) return;
    let u = 0, total = 0;
    row.querySelectorAll('[data-may-cant]').forEach(inp => {
      const q = items.find(i => i.id === p.id && i.v === inp.dataset.v)?.qty || 0;
      u += q;
      total += q * precioMayor(p, opDe(p, inp.dataset.v));
      if (document.activeElement !== inp) inp.value = q ? String(q) : '';
      inp.closest('.mt')?.classList.toggle('mt--on', q > 0);
    });
    row.classList.toggle('mrow--on', u > 0);
    const sub = row.querySelector('[data-may-sub]');
    if (sub) sub.innerHTML = u ? `<b>${u} u.</b> ${formatearPrecio(total)}` : '<span>Sin cargar</span>';
  });
  document.querySelectorAll('[data-pedido-panel]').forEach(panel => { panel.innerHTML = pedidoHTML({ panel: true }); });
  document.querySelectorAll('[data-pedido-resumen]').forEach(el => {
    const u = Pedido.count();
    el.textContent = u ? `${unidades(u)} · ${formatearPrecio(Pedido.total())}` : 'Vacío';
  });
}

function initMayorista() {
  const lista = document.querySelector('[data-may-lista]');
  if (!lista || CANAL !== 'mayorista') return '';
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: Object.prototype.hasOwnProperty.call(catIds, PARAMS.get('cat') || '') ? PARAMS.get('cat') : '',
    ofertas: PARAMS.get('ofertas') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
  };
  let cursor = null;
  const buscar = document.getElementById('mayBuscar');
  const verMas = document.querySelector('[data-may-ver-mas]');
  const vacio = document.querySelector('[data-may-vacio]');
  const cuenta = document.querySelector('[data-may-cuenta]');
  const tabs = document.querySelector('[data-may-tabs]');
  if (tabs) {
    tabs.innerHTML = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS].map(c => `<button type="button" class="mtab" data-may-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}<small>${Tienda.contar(c.id ? { cat: c.id } : {})}</small></button>`).join('')
      + `<button type="button" class="mtab mtab--ofertas" data-may-ofertas aria-pressed="false">${ICO.etiqueta}Ofertas<small>${Tienda.contar({ ofertas: true })}</small></button>`;
  }
  const filtros = () => ({ ...(estado.cat ? { cat: estado.cat } : {}), ...(estado.ofertas ? { ofertas: true } : {}) });
  const sincronizar = () => {
    tabs?.querySelectorAll('[data-may-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mayCat === estado.cat)));
    tabs?.querySelector('[data-may-ofertas]')?.setAttribute('aria-pressed', String(estado.ofertas));
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    const cat = catIds[estado.cat];
    const titulo = cat ? `Lista mayorista · ${cat.nombre}` : 'Lista mayorista';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = `Precio por mayor desde ${MIN_MAYORISTA} unidades surtidas: combiná artículos, talles y colores. Cargá las cantidades por talle y el pedido se arma solo.`;
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = false; miga.textContent = cat ? `Mayorista · ${cat.nombre}` : 'Mayorista'; }
    document.title = `${titulo} — Uchilla`;
    const u = new URL(location.href);
    ['cat', 'sub', 'q', 'ofertas', 'precio', 'orden', 'stock'].forEach(k => u.searchParams.delete(k));
    u.searchParams.set('canal', 'mayorista');
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    window.history.replaceState(null, '', u);
    actualizarLinksCanal(estado);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtros(), orden: 'destacados', cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => filaMayHTML(p)).join('');
    if (agregar) lista.insertAdjacentHTML('beforeend', html); else lista.innerHTML = html;
    const mostrados = lista.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    lista.hidden = mostrados === 0;
    if (cuenta) {
      const total = estado.q ? mostrados : Tienda.contar(filtros());
      cuenta.innerHTML = mostrados ? (estado.q ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'artículo' : 'artículos'} para «${esc(estado.q)}»` : `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'artículo' : 'artículos'}`) : '';
    }
    syncFilasMay();
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizar(); pintar(); };
  tabs?.addEventListener('click', e => {
    const b = e.target.closest('[data-may-cat]');
    if (b) { estado.cat = b.dataset.mayCat; aplicar(); return; }
    if (e.target.closest('[data-may-ofertas]')) { estado.ofertas = !estado.ofertas; aplicar(); }
  });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-may-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));
  document.querySelectorAll('[data-may-limpiar]').forEach(b => b.addEventListener('click', () => { estado.cat = ''; estado.ofertas = false; estado.q = ''; if (buscar) buscar.value = ''; aplicar(); }));
  lista.addEventListener('input', e => {
    const inp = e.target.closest('[data-may-cant]');
    if (!inp) return;
    const p = getProducto(inp.dataset.mayCant);
    if (!p) return;
    const n = Math.max(0, Math.min(parseInt(inp.value, 10) || 0, p.stock));
    ultimoCanal = 'mayorista';
    Pedido.set(p.id, inp.dataset.v, n);
  });
  lista.addEventListener('change', e => {
    const inp = e.target.closest('[data-may-cant]');
    if (!inp) return;
    const q = Pedido.qtyDe(inp.dataset.mayCant, inp.dataset.v);
    inp.value = q ? String(q) : '';
  });
  lista.addEventListener('click', e => {
    const b = e.target.closest('[data-curva]');
    if (!b) return;
    const p = getProducto(b.dataset.curva);
    if (!p) return;
    const items = Pedido.get();
    p.ops.forEach(op => {
      const ex = items.find(i => i.id === p.id && i.v === op.v);
      if (ex) ex.qty = Math.min(ex.qty + 1, p.stock);
      else items.push({ id: p.id, v: op.v, qty: 1 });
    });
    ultimoCanal = 'mayorista';
    Pedido.save(items);
    showToast(`Sumaste una ${p.tipo === 'Talle' ? 'curva' : 'unidad de cada opción'} de ${p.nombre} (${p.ops.length} u.)`);
  });
  document.addEventListener('cart:updated', syncFilasMay);
  sincronizar();
  pintar();
  if (PARAMS.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.puerta__rotulo', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero-sello', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initCanal,
  initRail,
  initOfertasHome,
  initCuentas,
  initEtiquetaMayorista,
  () => { const cat = PAGINA === 'catalogo' ? (CANAL === 'mayorista' ? initMayorista() : initCatalogo()) : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
