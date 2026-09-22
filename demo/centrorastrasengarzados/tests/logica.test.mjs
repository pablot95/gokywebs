import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* El demo es vanilla sin build: index.html y modelo-2.html comparten el
   MISMO script.js (no hay lógica duplicada que comparar entre páginas).
   Estos tests levantan el código REAL del archivo en un scope aislado,
   con stubs mínimos de localStorage/document, para probar la lógica pura
   (catálogo, filtros, carrito, armador) sin navegador. */
const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const fuente = readFileSync(join(raiz, 'script.js'), 'utf8');

function bloque(marcador, abre = '{', cierra = '}') {
  const inicio = fuente.indexOf(marcador);
  assert.notEqual(inicio, -1, `no se encontró "${marcador}" en script.js`);
  let j0, prof;
  if (marcador.endsWith(abre)) { j0 = inicio + marcador.length; prof = 1; }
  else { j0 = fuente.indexOf(abre, inicio) + 1; prof = 1; }
  for (let j = j0; j < fuente.length; j++) {
    if (fuente[j] === abre) prof++;
    else if (fuente[j] === cierra) { prof--; if (prof === 0) return fuente.slice(inicio, j + 1) + ';'; }
  }
  throw new Error(`no se pudo cerrar el bloque "${marcador}"`);
}
const linea = re => {
  const m = fuente.match(re);
  assert.ok(m, `no se encontró la línea ${re} en script.js`);
  return m[0];
};

function crearContexto() {
  const almacen = new Map();
  const eventos = [];
  const localStorage = {
    getItem: k => (almacen.has(k) ? almacen.get(k) : null),
    setItem: (k, v) => almacen.set(k, String(v)),
    removeItem: k => almacen.delete(k),
  };
  const document = { dispatchEvent: e => eventos.push(e.type) };
  class CustomEvent { constructor(type) { this.type = type; } }

  const api = new Function('localStorage', 'document', 'CustomEvent', `
    ${bloque('const PRODUCTOS = [', '[', ']')}
    ${linea(/^const getProducto = .+$/m)}
    ${linea(/^const precioFinal = .+$/m)}
    ${bloque('function normalizar(')}
    ${bloque('function coincideTexto(')}
    ${bloque('const Cart = {')}
    ${bloque('function calcularArmado({ hebillaId, cadenaId, dijeIds }) {')}
    ${bloque('const catalogo = {')}
    return { PRODUCTOS, getProducto, precioFinal, normalizar, coincideTexto, Cart, calcularArmado, catalogo };
  `)(localStorage, document, CustomEvent);

  return { ...api, almacen, eventos };
}

const ctx = crearContexto();
const { PRODUCTOS, getProducto, precioFinal, normalizar, coincideTexto } = ctx;

/* ─────────── Catálogo (fixtures) ─────────── */

const CATEGORIAS_VALIDAS = new Set(['rastras', 'hebillas', 'cadenas', 'dijes', 'pasapanuelos']);
const GENEROS_VALIDOS = new Set(['dama', 'caballero', 'unisex']);

test('cada producto tiene id único, categoría y género válidos, y precio positivo', () => {
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'hay ids duplicados');
  for (const p of PRODUCTOS) {
    assert.ok(CATEGORIAS_VALIDAS.has(p.categoria), `${p.id} tiene categoría inválida ("${p.categoria}")`);
    assert.ok(GENEROS_VALIDOS.has(p.genero), `${p.id} tiene género inválido ("${p.genero}")`);
    assert.ok(p.precio > 0, `${p.id} sin precio`);
    assert.ok(p.descuento >= 0 && p.descuento < 90, `${p.id} con descuento fuera de rango`);
    assert.ok(Number.isInteger(p.stock) && p.stock >= 0, `${p.id} con stock inválido`);
  }
});

test('hay al menos 3 categorías, con al menos un producto cada una', () => {
  const cats = new Set(PRODUCTOS.map(p => p.categoria));
  assert.ok(cats.size >= 3);
  for (const c of cats) assert.ok(PRODUCTOS.some(p => p.categoria === c));
});

test('hay al menos 6 productos destacados para el rail (mínimo del rubro)', () => {
  const destacados = PRODUCTOS.filter(p => p.destacado);
  assert.ok(destacados.length >= 6, `hay ${destacados.length} destacados, el rail pide 6 o más`);
});

test('precioFinal aplica el descuento y devuelve enteros', () => {
  const conDescuento = PRODUCTOS.filter(p => p.descuento > 0);
  assert.ok(conDescuento.length > 0, 'debería haber al menos un producto con descuento');
  for (const p of conDescuento) {
    assert.ok(precioFinal(p) < p.precio, `${p.id} con descuento pero precio final igual`);
    assert.ok(Number.isInteger(precioFinal(p)));
  }
  const sinDescuento = PRODUCTOS.find(p => p.descuento === 0);
  assert.equal(precioFinal(sinDescuento), sinDescuento.precio);
});

/* ─────────── Búsqueda y filtros del catálogo ─────────── */

test('normalizar ignora acentos y mayúsculas', () => {
  assert.equal(normalizar('Pasapañuelo'), normalizar('pasapanuelo'));
  assert.equal(normalizar('HEBILLA'), normalizar('hebilla'));
});

test('coincideTexto encuentra por nombre, categoría, género y tags', () => {
  const p = getProducto('rastra-monedas');
  assert.ok(coincideTexto(p, 'monedas'));
  assert.ok(coincideTexto(p, 'MONEDAS'));
  assert.ok(coincideTexto(p, 'rastras'));
  assert.ok(coincideTexto(p, 'gauchesca'));
  assert.ok(!coincideTexto(p, 'pasapanuelo'));
});

test('sin filtros, el catálogo muestra todo el set', () => {
  ctx.catalogo.q = ''; ctx.catalogo.categorias.clear(); ctx.catalogo.generos.clear(); ctx.catalogo.orden = 'relevancia';
  assert.equal(ctx.catalogo.filtrar().length, PRODUCTOS.length);
});

test('el filtro de categoría y de género se combinan (AND)', () => {
  ctx.catalogo.q = ''; ctx.catalogo.orden = 'relevancia';
  ctx.catalogo.categorias = new Set(['hebillas']);
  ctx.catalogo.generos = new Set(['dama']);
  const r = ctx.catalogo.filtrar();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.categoria === 'hebillas' && p.genero === 'dama'));
});

test('ordenar por precio ascendente y descendente da el mismo set, orden distinto', () => {
  ctx.catalogo.categorias.clear(); ctx.catalogo.generos.clear(); ctx.catalogo.q = '';
  ctx.catalogo.orden = 'menor';
  const asc = ctx.catalogo.filtrar();
  ctx.catalogo.orden = 'mayor';
  const desc = ctx.catalogo.filtrar();
  assert.equal(asc.length, desc.length);
  assert.deepEqual([...asc].reverse().map(p => p.id).sort(), desc.map(p => p.id).sort());
  for (let i = 1; i < asc.length; i++) assert.ok(precioFinal(asc[i]) >= precioFinal(asc[i - 1]));
  for (let i = 1; i < desc.length; i++) assert.ok(precioFinal(desc[i]) <= precioFinal(desc[i - 1]));
});

test('una búsqueda sin coincidencias devuelve lista vacía', () => {
  ctx.catalogo.categorias.clear(); ctx.catalogo.generos.clear(); ctx.catalogo.orden = 'relevancia';
  ctx.catalogo.q = 'bicicleta';
  assert.deepEqual(ctx.catalogo.filtrar(), []);
});

/* ─────────── Carrito ─────────── */

test('agregar acumula unidades del mismo producto', () => {
  const c = crearContexto();
  const p = c.getProducto('hebilla-clasica-oval');
  c.Cart.add(p, 1);
  c.Cart.add(p, 2);
  assert.equal(c.Cart.get().length, 1);
  assert.equal(c.Cart.count(), 3);
});

test('el carrito nunca supera el stock disponible', () => {
  const c = crearContexto();
  const p = c.getProducto('rastra-monedas'); // stock 4
  c.Cart.add(p, 50);
  assert.equal(c.Cart.get()[0].qty, p.stock);
  c.Cart.setQty(p.id, 999);
  assert.equal(c.Cart.get()[0].qty, p.stock);
});

test('bajar la cantidad nunca deja el ítem en cero', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('dije-luna'), 1);
  c.Cart.setQty('dije-luna', 0);
  assert.equal(c.Cart.get()[0].qty, 1);
  c.Cart.setQty('dije-luna', -5);
  assert.equal(c.Cart.get()[0].qty, 1);
});

test('setQty sobre un id que no está en el carrito no lo agrega', () => {
  const c = crearContexto();
  c.Cart.setQty('hebilla-clasica-oval', 5);
  assert.deepEqual(c.Cart.get(), []);
});

test('el total usa el precio con descuento', () => {
  const c = crearContexto();
  const conDescuento = c.PRODUCTOS.find(p => p.descuento > 0);
  c.Cart.add(conDescuento, 3);
  assert.equal(c.Cart.total(), c.precioFinal(conDescuento) * 3);
  assert.ok(c.Cart.total() < conDescuento.precio * 3);
});

test('un localStorage corrupto no rompe el carrito', () => {
  const c = crearContexto();
  c.almacen.set('centrorastras_cart', '{esto no es JSON');
  assert.deepEqual(c.Cart.get(), []);
  c.Cart.add(c.getProducto('dije-luna'), 1);
  assert.equal(c.Cart.count(), 1);
});

test('un producto borrado del catálogo se ignora en el total', () => {
  const c = crearContexto();
  c.almacen.set('centrorastras_cart', JSON.stringify([{ id: 'producto-fantasma', qty: 2 }, { id: 'dije-luna', qty: 1 }]));
  assert.equal(c.Cart.total(), c.precioFinal(c.getProducto('dije-luna')));
});

test('cada cambio del carrito dispara cart:updated', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('dije-luna'), 1);
  c.Cart.setQty('dije-luna', 2);
  c.Cart.remove('dije-luna');
  assert.deepEqual(c.eventos, ['cart:updated', 'cart:updated', 'cart:updated']);
});

/* ─────────── Componente funcional: Armá tu rastra ─────────── */

test('el armado suma el precio de cada pieza elegida', () => {
  const { piezas, total } = ctx.calcularArmado({ hebillaId: 'hebilla-floral-grande', cadenaId: 'cadena-costilla-larga', dijeIds: ['dije-luna', 'aplique-moneda-sol'] });
  assert.equal(piezas.length, 4);
  const esperado = precioFinal(getProducto('hebilla-floral-grande')) + precioFinal(getProducto('cadena-costilla-larga')) + precioFinal(getProducto('dije-luna')) + precioFinal(getProducto('aplique-moneda-sol'));
  assert.equal(total, esperado);
});

test('sin cadena y sin dijes, el armado es solo la hebilla', () => {
  const { piezas, total } = ctx.calcularArmado({ hebillaId: 'hebilla-clasica-oval', cadenaId: '', dijeIds: [] });
  assert.equal(piezas.length, 1);
  assert.equal(total, precioFinal(getProducto('hebilla-clasica-oval')));
});

test('sin ninguna pieza elegida, el armado da total cero sin romper', () => {
  const { piezas, total } = ctx.calcularArmado({ hebillaId: '', cadenaId: '', dijeIds: [] });
  assert.deepEqual(piezas, []);
  assert.equal(total, 0);
});

test('un id inexistente en los dijes se ignora en vez de romper', () => {
  const { piezas } = ctx.calcularArmado({ hebillaId: '', cadenaId: '', dijeIds: ['dije-luna', 'dije-fantasma'] });
  assert.equal(piezas.length, 1);
  assert.equal(piezas[0].id, 'dije-luna');
});

test('el resultado cambia si cambia la entrada (no es un combo fijo)', () => {
  const a = ctx.calcularArmado({ hebillaId: 'hebilla-floral-grande', cadenaId: '', dijeIds: [] }).total;
  const b = ctx.calcularArmado({ hebillaId: 'hebilla-dama-trenzada', cadenaId: 'cadena-clasica', dijeIds: ['dije-arbol-vida'] }).total;
  assert.notEqual(a, b);
});
