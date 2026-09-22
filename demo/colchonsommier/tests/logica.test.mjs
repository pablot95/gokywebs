import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* El demo es vanilla sin build: index.html y modelo-2.html comparten el
   MISMO script.js (no hay lógica duplicada que comparar entre páginas).
   Estos tests levantan el código REAL del archivo en un scope aislado,
   con stubs mínimos de localStorage/document, para probar la lógica pura
   (catálogo, filtros, carrito, recomendador) sin navegador. */
const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const fuente = readFileSync(join(raiz, 'script.js'), 'utf8');

function bloque(marcador, abre = '{', cierra = '}') {
  const inicio = fuente.indexOf(marcador);
  assert.notEqual(inicio, -1, `no se encontró "${marcador}" en script.js`);
  /* Si el marcador ya termina en el caracter de apertura, arrancamos el
     balanceo justo después: así una desestructuración en la firma de la
     función (ej. "function recomendar({ postura, ... }) {") no se confunde
     con la llave del cuerpo. Si no, buscamos la primera apertura tal cual. */
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
    ${bloque('const TALLES = [', '[', ']')}
    ${linea(/^const talleInfo = .+$/m)}
    ${linea(/^const RANK_FIRMEZA = .+$/m)}
    ${bloque('const PRODUCTOS = [', '[', ']')}
    ${linea(/^const getProducto = .+$/m)}
    ${linea(/^const talleDefault = .+$/m)}
    ${linea(/^const talleDisponible = .+$/m)}
    ${bloque('function precioTalle(')}
    ${bloque('function precioFinal(')}
    ${bloque('function normalizar(')}
    ${bloque('function coincideTexto(')}
    ${bloque('const Cart = {')}
    ${bloque('function recomendar({ postura, firmeza, tamano }) {')}
    ${bloque('const catalogo = {')}
    return { TALLES, talleInfo, RANK_FIRMEZA, PRODUCTOS, getProducto, talleDefault, talleDisponible,
             precioTalle, precioFinal, normalizar, coincideTexto, Cart, recomendar, catalogo };
  `)(localStorage, document, CustomEvent);

  return { ...api, almacen, eventos };
}

const ctx = crearContexto();
const { TALLES, talleInfo, PRODUCTOS, getProducto, talleDefault, talleDisponible, precioTalle, precioFinal, normalizar, coincideTexto } = ctx;

/* ─────────── Catálogo (fixtures) ─────────── */
/* No hay un array CATEGORIAS aparte en script.js: las categorías del filtro
   son las que aparecen en PRODUCTOS, así no hay dos listas que puedan divergir. */
const categoriasEnUso = [...new Set(PRODUCTOS.map(p => p.categoria))];

test('cada producto tiene id único y al menos un tamaño válido', () => {
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'hay ids duplicados');
  for (const p of PRODUCTOS) {
    assert.ok(Array.isArray(p.tamanos) && p.tamanos.length > 0, `${p.id} no ofrece ningún tamaño`);
    assert.ok(p.tamanos.every(t => TALLES.some(x => x.id === t)), `${p.id} tiene un tamaño que no existe en TALLES`);
  }
});

test('hay al menos 3 categorías y variedad real de precios', () => {
  assert.ok(categoriasEnUso.length >= 3);
  const precios = PRODUCTOS.map(p => p.precioBase);
  assert.ok(Math.max(...precios) - Math.min(...precios) > 100000, 'los precios base no tienen rango suficiente para dos franjas de precio');
});

test('cada categoría tiene al menos un producto (por construcción, pero lo dejamos explícito)', () => {
  for (const c of categoriasEnUso) assert.ok(PRODUCTOS.some(p => p.categoria === c), `"${c}" dejaría el catálogo vacío al filtrar`);
});

test('los colchones (no sommiers) tienen firmeza; los sommiers no', () => {
  for (const p of PRODUCTOS) {
    if (p.categoria === 'sommiers') assert.equal(p.firmeza, null, `${p.id} es sommier y no debería tener firmeza`);
    else assert.ok(['suave', 'media', 'firme'].includes(p.firmeza), `${p.id} tiene firmeza inválida`);
  }
});

test('hay al menos un producto con descuento y sin descuento', () => {
  assert.ok(PRODUCTOS.some(p => p.descuento > 0));
  assert.ok(PRODUCTOS.some(p => p.descuento === 0));
});

/* ─────────── Precios por talle ─────────── */

test('el precio sube con el tamaño (2 plazas < queen < king)', () => {
  for (const p of PRODUCTOS) {
    if (p.tamanos.includes('2-plazas') && p.tamanos.includes('king')) {
      assert.ok(precioTalle(p, 'king') > precioTalle(p, '2-plazas'), `${p.id}: king no es más caro que 2 plazas`);
    }
  }
});

test('precioFinal aplica el descuento y precioTalle no', () => {
  const conDescuento = PRODUCTOS.find(p => p.descuento > 0);
  const talle = talleDefault(conDescuento);
  assert.ok(precioFinal(conDescuento, talle) < precioTalle(conDescuento, talle));
  const sinDescuento = PRODUCTOS.find(p => p.descuento === 0);
  const t2 = talleDefault(sinDescuento);
  assert.equal(precioFinal(sinDescuento, t2), precioTalle(sinDescuento, t2));
});

test('los precios son siempre números enteros', () => {
  for (const p of PRODUCTOS) for (const t of p.tamanos) {
    assert.ok(Number.isInteger(precioTalle(p, t)), `${p.id}/${t} dio un precio con decimales`);
    assert.ok(Number.isInteger(precioFinal(p, t)));
  }
});

test('un tamaño que el producto no ofrece da null', () => {
  const p = PRODUCTOS.find(x => !x.tamanos.includes('king'));
  assert.ok(p, 'debería haber al menos un producto sin king para este test');
  assert.equal(precioTalle(p, 'king'), precioFinal(p, 'king'));
  assert.equal(precioFinal(p, 'king'), null);
});

test('talleDisponible respeta sinStock', () => {
  const p = PRODUCTOS.find(x => x.sinStock.length > 0);
  assert.ok(p, 'debería haber al menos un producto con un talle agotado, para probar el caso');
  assert.equal(talleDisponible(p, p.sinStock[0]), false);
  const otro = p.tamanos.find(t => !p.sinStock.includes(t));
  assert.equal(talleDisponible(p, otro), true);
});

test('talleDefault prioriza 2 plazas cuando está disponible, y si no cae al primer tamaño', () => {
  const p = PRODUCTOS.find(x => x.tamanos.includes('2-plazas'));
  assert.equal(talleDefault(p), '2-plazas');
  assert.equal(talleDefault({ tamanos: ['1-plaza', 'queen'] }), '1-plaza');
});

/* ─────────── Búsqueda y filtros del catálogo ─────────── */

test('normalizar ignora acentos y mayúsculas', () => {
  assert.equal(normalizar('Colchón'), normalizar('colchon'));
  assert.equal(normalizar('SOMMIER'), normalizar('sommier'));
});

test('coincideTexto encuentra por nombre, categoría y tags sin acentos', () => {
  const p = getProducto('resortes-dual');
  assert.ok(coincideTexto(p, 'dual'));
  assert.ok(coincideTexto(p, 'DUAL'));
  assert.ok(coincideTexto(p, 'resortes'));
  assert.ok(coincideTexto(p, 'pocket'));
  assert.ok(!coincideTexto(p, 'viscoelastica'));
});

test('sin filtros, el catálogo muestra todo el set', () => {
  ctx.catalogo.q = ''; ctx.catalogo.categorias.clear(); ctx.catalogo.firmezas.clear(); ctx.catalogo.tamanos.clear();
  assert.equal(ctx.catalogo.filtrar().length, PRODUCTOS.length);
});

test('el filtro de categoría acota el resultado', () => {
  ctx.catalogo.q = ''; ctx.catalogo.firmezas.clear(); ctx.catalogo.tamanos.clear();
  ctx.catalogo.categorias = new Set(['sommiers']);
  const r = ctx.catalogo.filtrar();
  assert.ok(r.length > 0 && r.every(p => p.categoria === 'sommiers'));
});

test('filtrar por firmeza excluye los sommiers (no tienen firmeza)', () => {
  ctx.catalogo.q = ''; ctx.catalogo.categorias.clear(); ctx.catalogo.tamanos.clear();
  ctx.catalogo.firmezas = new Set(['media']);
  const r = ctx.catalogo.filtrar();
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.categoria !== 'sommiers'));
});

test('el filtro de tamaño y la categoría se combinan (AND entre grupos)', () => {
  ctx.catalogo.q = ''; ctx.catalogo.firmezas.clear();
  ctx.catalogo.categorias = new Set(['espuma']);
  ctx.catalogo.tamanos = new Set(['king']);
  const r = ctx.catalogo.filtrar();
  assert.ok(r.every(p => p.categoria === 'espuma' && p.tamanos.includes('king')));
});

test('una búsqueda sin coincidencias devuelve lista vacía', () => {
  ctx.catalogo.categorias.clear(); ctx.catalogo.firmezas.clear(); ctx.catalogo.tamanos.clear();
  ctx.catalogo.q = 'heladera';
  assert.deepEqual(ctx.catalogo.filtrar(), []);
});

/* ─────────── Carrito ─────────── */

test('agregar el mismo producto y talle acumula cantidad', () => {
  const c = crearContexto();
  const p = c.getProducto('resortes-esencial');
  c.Cart.add(p, '2-plazas', 1);
  c.Cart.add(p, '2-plazas', 2);
  assert.equal(c.Cart.get().length, 1);
  assert.equal(c.Cart.count(), 3);
});

test('el mismo producto en dos talles distintos son dos líneas', () => {
  const c = crearContexto();
  const p = c.getProducto('resortes-esencial');
  c.Cart.add(p, '2-plazas', 1);
  c.Cart.add(p, 'queen', 1);
  assert.equal(c.Cart.get().length, 2);
});

test('la cantidad nunca supera el tope de 15', () => {
  const c = crearContexto();
  const p = c.getProducto('sommier-box-clasico');
  c.Cart.add(p, '2-plazas', 50);
  assert.equal(c.Cart.get()[0].qty, 15);
  c.Cart.setQty(p.id, '2-plazas', 999);
  assert.equal(c.Cart.get()[0].qty, 15);
});

test('setQty nunca deja la línea en cero o negativo', () => {
  const c = crearContexto();
  const p = c.getProducto('sommier-box-clasico');
  c.Cart.add(p, '2-plazas', 1);
  c.Cart.setQty(p.id, '2-plazas', 0);
  assert.equal(c.Cart.get()[0].qty, 1);
  c.Cart.setQty(p.id, '2-plazas', -5);
  assert.equal(c.Cart.get()[0].qty, 1);
});

test('setQty sobre una línea inexistente no agrega nada', () => {
  const c = crearContexto();
  c.Cart.setQty('resortes-esencial', '2-plazas', 3);
  assert.deepEqual(c.Cart.get(), []);
});

test('el total usa el precio final del talle de cada línea', () => {
  const c = crearContexto();
  const p = c.getProducto('espuma-viscoelastica-premium');
  c.Cart.add(p, 'queen', 2);
  assert.equal(c.Cart.total(), c.precioFinal(p, 'queen') * 2);
});

test('quitar y vaciar dejan el carrito consistente', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('resortes-esencial'), '2-plazas', 1);
  c.Cart.add(c.getProducto('sommier-baulera'), 'queen', 1);
  c.Cart.remove('resortes-esencial', '2-plazas');
  assert.equal(c.Cart.get().length, 1);
  c.Cart.clear();
  assert.equal(c.Cart.count(), 0);
  assert.equal(c.Cart.total(), 0);
});

test('un localStorage corrupto no rompe el carrito', () => {
  const c = crearContexto();
  c.almacen.set('colchonsommier_cart', '{esto no es JSON');
  assert.deepEqual(c.Cart.get(), []);
  c.Cart.add(c.getProducto('resortes-esencial'), '2-plazas', 1);
  assert.equal(c.Cart.count(), 1);
});

test('un producto borrado del catálogo se ignora en el total, sin romper', () => {
  const c = crearContexto();
  c.almacen.set('colchonsommier_cart', JSON.stringify([{ id: 'producto-fantasma', talle: '2-plazas', qty: 2 }, { id: 'resortes-esencial', talle: '2-plazas', qty: 1 }]));
  assert.equal(c.Cart.total(), c.precioFinal(c.getProducto('resortes-esencial'), '2-plazas'));
});

test('cada cambio del carrito dispara cart:updated', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('resortes-esencial'), '2-plazas', 1);
  c.Cart.setQty('resortes-esencial', '2-plazas', 2);
  c.Cart.remove('resortes-esencial', '2-plazas');
  assert.deepEqual(c.eventos, ['cart:updated', 'cart:updated', 'cart:updated']);
});

/* ─────────── Recomendador ("Encontrá tu colchón ideal") ─────────── */

test('el recomendador nunca sugiere un sommier', () => {
  const r = ctx.recomendar({ postura: 'de-costado', firmeza: '', tamano: '2-plazas' });
  assert.ok(r.every(p => p.categoria !== 'sommiers'));
});

test('devuelve como máximo 2 productos, respetando el tamaño pedido', () => {
  const r = ctx.recomendar({ postura: 'boca-arriba', firmeza: '', tamano: 'queen' });
  assert.ok(r.length <= 2);
  assert.ok(r.every(p => talleDisponible(p, 'queen')));
});

test('un tamaño que nadie ofrece da lista vacía en vez de romper', () => {
  assert.deepEqual(ctx.recomendar({ postura: 'boca-arriba', firmeza: '', tamano: 'inexistente' }), []);
});

test('con firmeza explícita, el primer resultado es de esa firmeza si hay stock', () => {
  const r = ctx.recomendar({ postura: 'de-costado', firmeza: 'firme', tamano: '2-plazas' });
  assert.ok(r.length > 0);
  assert.equal(r[0].firmeza, 'firme');
});

test('sin firmeza explícita, la postura infiere la firmeza objetivo', () => {
  const bocaAbajo = ctx.recomendar({ postura: 'boca-abajo', firmeza: '', tamano: '2-plazas' });
  const costado = ctx.recomendar({ postura: 'de-costado', firmeza: '', tamano: '2-plazas' });
  assert.equal(bocaAbajo[0].firmeza, 'firme');
  assert.equal(costado[0].firmeza, 'suave');
});

test('el resultado cambia si cambia la entrada (no es una recomendación fija)', () => {
  const a = ctx.recomendar({ postura: 'boca-abajo', firmeza: '', tamano: '2-plazas' }).map(p => p.id);
  const b = ctx.recomendar({ postura: 'de-costado', firmeza: '', tamano: '2-plazas' }).map(p => p.id);
  assert.notDeepEqual(a, b, 'dos posturas opuestas deberían recomendar cosas distintas');
});
