import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* El demo es vanilla sin build: no hay módulos que importar.
   Estos tests levantan el código REAL de data.js y script.js en un scope
   aislado, con stubs mínimos de localStorage y document, para probar la
   lógica pura (carrito, filtros, calculadora) sin navegador. */
const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const datos = readFileSync(join(raiz, 'data.js'), 'utf8');
const fuente = readFileSync(join(raiz, 'script.js'), 'utf8');

function bloque(marcador) {
  const inicio = fuente.indexOf(marcador);
  assert.notEqual(inicio, -1, `no se encontró "${marcador}" en script.js`);
  let prof = 0, abierto = false;
  for (let j = fuente.indexOf('{', inicio); j < fuente.length; j++) {
    if (fuente[j] === '{') { prof++; abierto = true; }
    else if (fuente[j] === '}') { prof--; if (abierto && prof === 0) return fuente.slice(inicio, j + 1) + ';'; }
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
    removeItem: k => almacen.delete(k)
  };
  const document = { dispatchEvent: e => eventos.push(e.type) };
  class CustomEvent { constructor(type) { this.type = type; } }

  const api = new Function('localStorage', 'document', 'CustomEvent', `
    ${datos}
    ${linea(/^const norm = .+$/m)}
    ${linea(/^const precioFinal = .+$/m)}
    ${linea(/^const getProducto = .+$/m)}
    ${linea(/^const getRubro = .+$/m)}
    ${bloque('const Cart = {')}
    ${linea(/^const PASO = .+$/m)}
    ${linea(/^const estado = .+$/m)}
    ${bloque('function filtrar(')}
    ${bloque('function calcularMateriales(')}
    return { PRODUCTOS, RUBROS, CALCULOS, ENVIO_GRATIS_DESDE,
             norm, precioFinal, getProducto, Cart, estado, filtrar, calcularMateriales };
  `)(localStorage, document, CustomEvent);

  return { ...api, almacen, eventos };
}

const ctx = crearContexto();
const { PRODUCTOS, RUBROS, CALCULOS, ENVIO_GRATIS_DESDE, norm, precioFinal, getProducto, calcularMateriales } = ctx;

/* ─────────── Catálogo (datos) ─────────── */

test('cada producto tiene id único y un rubro que existe', () => {
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'hay ids duplicados');
  const rubros = new Set(RUBROS.map(r => r.id));
  for (const p of PRODUCTOS) {
    assert.ok(rubros.has(p.rubro), `${p.id} apunta al rubro inexistente "${p.rubro}"`);
  }
});

test('todo producto tiene precio, unidad de venta y stock coherentes', () => {
  for (const p of PRODUCTOS) {
    assert.ok(p.precio > 0, `${p.id} sin precio`);
    assert.ok(typeof p.unidad === 'string' && p.unidad.length, `${p.id} sin unidad de venta`);
    assert.ok(Number.isInteger(p.stock) && p.stock >= 0, `${p.id} con stock inválido`);
    assert.ok(p.descuento >= 0 && p.descuento < 100, `${p.id} con descuento fuera de rango`);
  }
});

test('cada rubro del rail tiene al menos un producto', () => {
  for (const r of RUBROS) {
    assert.ok(PRODUCTOS.some(p => p.rubro === r.id), `el rubro "${r.id}" abriría el catálogo vacío`);
  }
});

test('hay entre 1 y 8 destacados, como pide la grilla del hero', () => {
  const destacados = PRODUCTOS.filter(p => p.destacado);
  assert.ok(destacados.length >= 1 && destacados.length <= 8, `hay ${destacados.length} destacados`);
});

test('precioFinal aplica el descuento y devuelve enteros', () => {
  const conDescuento = PRODUCTOS.filter(p => p.descuento > 0);
  assert.ok(conDescuento.length > 0, 'el demo debería mostrar al menos un descuento');
  for (const p of conDescuento) {
    assert.ok(precioFinal(p) < p.precio, `${p.id} con descuento pero precio final igual`);
    assert.ok(Number.isInteger(precioFinal(p)), `${p.id} devolvió un precio con centavos`);
  }
  const sinDescuento = PRODUCTOS.find(p => p.descuento === 0);
  assert.equal(precioFinal(sinDescuento), sinDescuento.precio);
});

/* ─────────── Filtros del catálogo ─────────── */

function buscar(texto, rubro = 'todos') {
  ctx.estado.busqueda = texto;
  ctx.estado.rubro = rubro;
  return ctx.filtrar();
}

test('sin filtros, el catálogo muestra todo', () => {
  assert.equal(buscar('', 'todos').length, PRODUCTOS.length);
});

test('la búsqueda ignora acentos, mayúsculas y espacios de sobra', () => {
  const esperado = buscar('cerámico').map(p => p.id);
  assert.ok(esperado.length > 0, 'la búsqueda base no devolvió nada');
  assert.deepEqual(buscar('CERAMICO').map(p => p.id), esperado);
  assert.deepEqual(buscar('  ceramico  ').map(p => p.id), esperado);
  assert.equal(norm('Cerámico'), norm('ceramico'));
});

test('varias palabras suman condiciones en vez de restarlas', () => {
  const dos = buscar('hierro 8');
  assert.ok(dos.length > 0 && dos.every(p => p.id.startsWith('hierro')), 'la búsqueda de dos palabras falló');
  assert.ok(dos.length < buscar('hierro').length, 'la segunda palabra no acotó el resultado');
});

test('la búsqueda también mira medidas de las especificaciones', () => {
  const r = buscar('12×18×33');
  assert.ok(r.some(p => p.id === 'lad-h12'), 'no encontró el ladrillo por su medida');
});

test('el chip de rubro y la búsqueda se combinan', () => {
  const soloHierro = buscar('', 'hierro');
  assert.ok(soloHierro.length > 0 && soloHierro.every(p => p.rubro === 'hierro'));
  assert.equal(buscar('porcelanato', 'hierro').length, 0, 'el chip debería acotar aunque el texto coincida en otro rubro');
});

test('una búsqueda sin resultados devuelve lista vacía, no todo el catálogo', () => {
  assert.equal(buscar('membrana asfáltica').length, 0);
});

/* ─────────── Carrito ─────────── */

test('agregar acumula unidades del mismo producto', () => {
  const c = crearContexto();
  const lad = c.getProducto('lad-h12');
  c.Cart.add(lad, 100);
  c.Cart.add(lad, 50);
  assert.equal(c.Cart.get().length, 1, 'debería quedar una sola línea');
  assert.equal(c.Cart.count(), 150);
});

test('el carrito nunca supera el stock disponible', () => {
  const c = crearContexto();
  const p = c.getProducto('malla-sima'); // stock 90
  c.Cart.add(p, 500);
  assert.equal(c.Cart.get()[0].qty, p.stock);
  c.Cart.setQty(p.id, 9999);
  assert.equal(c.Cart.get()[0].qty, p.stock);
});

test('bajar la cantidad nunca deja el ítem en cero', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('cal-25'), 1);
  c.Cart.setQty('cal-25', 0);
  assert.equal(c.Cart.get()[0].qty, 1, 'el mínimo es 1; para sacarlo está el botón de quitar');
  c.Cart.setQty('cal-25', -20);
  assert.equal(c.Cart.get()[0].qty, 1);
});

test('setQty sobre un id que no está en el carrito no lo agrega', () => {
  const c = crearContexto();
  c.Cart.setQty('pvc-110', 5);
  assert.deepEqual(c.Cart.get(), []);
});

test('el total usa el precio con descuento', () => {
  const c = crearContexto();
  const conDescuento = c.PRODUCTOS.find(p => p.descuento > 0);
  c.Cart.add(conDescuento, 3);
  assert.equal(c.Cart.total(), c.precioFinal(conDescuento) * 3);
  assert.ok(c.Cart.total() < conDescuento.precio * 3, 'no se aplicó el descuento en el total');
});

test('quitar y vaciar dejan el carrito consistente', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('lad-h12'), 10);
  c.Cart.add(c.getProducto('cem-alb-50'), 2);
  c.Cart.remove('lad-h12');
  assert.equal(c.Cart.get().length, 1);
  c.Cart.clear();
  assert.equal(c.Cart.count(), 0);
  assert.equal(c.Cart.total(), 0);
});

test('un localStorage corrupto no rompe el carrito', () => {
  const c = crearContexto();
  c.almacen.set('adf_cart', '{esto no es JSON');
  assert.deepEqual(c.Cart.get(), [], 'debería arrancar vacío en vez de tirar excepción');
  c.Cart.add(c.getProducto('lad-h12'), 5);
  assert.equal(c.Cart.count(), 5, 'debería poder seguir usándose después de la corrupción');
});

test('un producto borrado del catálogo se ignora en el total', () => {
  const c = crearContexto();
  c.almacen.set('adf_cart', JSON.stringify([{ id: 'producto-fantasma', qty: 2 }, { id: 'lad-h12', qty: 1 }]));
  assert.equal(c.Cart.total(), c.precioFinal(c.getProducto('lad-h12')));
});

test('cada cambio del carrito avisa para refrescar el badge', () => {
  const c = crearContexto();
  c.Cart.add(c.getProducto('lad-h12'), 1);
  c.Cart.setQty('lad-h12', 4);
  c.Cart.remove('lad-h12');
  assert.deepEqual(c.eventos, ['cart:updated', 'cart:updated', 'cart:updated']);
});

/* ─────────── Calculadora de materiales ─────────── */

test('cada receta apunta a productos que existen', () => {
  for (const [tipo, receta] of Object.entries(CALCULOS)) {
    assert.ok(receta.hint, `la receta "${tipo}" no tiene texto de ayuda`);
    for (const item of receta.items) {
      assert.ok(getProducto(item.id), `la receta "${tipo}" usa el producto inexistente "${item.id}"`);
    }
  }
});

test('una pared de 20 m² da la cuenta esperada', () => {
  const r = calcularMateriales('pared', 20, 0);
  assert.equal(r.length, 3);
  // 20 m² × 16 ladrillos = 320, +10% de desperdicio = 352
  assert.equal(r.find(x => x.producto.id === 'lad-h12').cantidad, 352);
  for (const fila of r) {
    assert.ok(Number.isInteger(fila.cantidad), `${fila.producto.id} debería quedar en unidades enteras`);
    assert.ok(fila.cantidad > 0, `${fila.producto.id} dio cantidad cero`);
  }
});

test('el resultado siempre incluye el 10% de desperdicio', () => {
  const [ladrillos] = calcularMateriales('pared', 100, 0);
  assert.ok(ladrillos.cantidad >= 100 * 16 * 1.1, 'no se está sumando el desperdicio');
});

test('nunca devuelve cero: una superficie mínima pide al menos una unidad', () => {
  for (const tipo of Object.keys(CALCULOS)) {
    for (const fila of calcularMateriales(tipo, 1, 10)) {
      const paso = CALCULOS[tipo].items.find(i => i.id === fila.producto.id).redondeo || 1;
      assert.ok(fila.cantidad >= paso, `${tipo}/${fila.producto.id} devolvió ${fila.cantidad}`);
    }
  }
});

test('el contrapiso depende del espesor y el piso no', () => {
  const cemento = esp => calcularMateriales('contrapiso', 50, esp).find(x => x.producto.id === 'cem-port-50').cantidad;
  assert.ok(cemento(16) > cemento(8), 'más espesor debería pedir más cemento');

  assert.deepEqual(
    calcularMateriales('piso', 30, 8).map(x => x.cantidad),
    calcularMateriales('piso', 30, 20).map(x => x.cantidad),
    'el piso no debería cambiar con el espesor'
  );
});

test('la arena del contrapiso se redondea de a medio metro cúbico', () => {
  for (const m2 of [10, 25, 40, 63, 120]) {
    const arena = calcularMateriales('contrapiso', m2, 10).find(x => x.producto.id === 'arena-m3').cantidad;
    assert.equal(arena * 2 % 1, 0, `${m2} m² dio ${arena} m³, que no es múltiplo de 0,5`);
  }
});

test('las cajas de piso cubren la superficie pedida', () => {
  const cajas = calcularMateriales('piso', 30, 0).find(x => x.producto.id === 'porc-60').cantidad;
  assert.ok(cajas * 1.44 >= 30, `${cajas} cajas no alcanzan para 30 m²`);
});

test('el resultado crece siempre que crece la superficie', () => {
  let previo = 0;
  for (const m2 of [5, 20, 50, 100, 300]) {
    const total = calcularMateriales('pared', m2, 0).reduce((s, r) => s + r.cantidad, 0);
    assert.ok(total > previo, `${m2} m² no pidió más material que la medida anterior`);
    previo = total;
  }
});

test('un tipo de cálculo desconocido devuelve lista vacía en vez de romper', () => {
  assert.deepEqual(calcularMateriales('techo', 20, 10), []);
});

test('lo que calcula la calculadora se puede cargar al carrito', () => {
  const c = crearContexto();
  for (const fila of c.calcularMateriales('pared', 30, 0)) c.Cart.add(fila.producto, fila.cantidad);
  assert.equal(c.Cart.get().length, 3);
  assert.ok(c.Cart.total() > 0);
  for (const it of c.Cart.get()) {
    assert.ok(it.qty <= c.getProducto(it.id).stock, `${it.id} entró al carrito por encima del stock`);
  }
});

test('los números de la sección "la cota" son los que da la calculadora', () => {
  /* La coreografía muestra una pared de 4,00 × 2,60 m = 10,4 m² y una lista fija.
     Si alguien toca los coeficientes, la sección quedaría mintiendo. */
  const html = readFileSync(join(raiz, 'index.html'), 'utf8');
  const enPantalla = [...html.matchAll(/data-cota-num="(\d+)"/g)].map(m => Number(m[1]));
  assert.equal(enPantalla.length, 3, 'la lista de la cota debería tener tres materiales');

  const real = calcularMateriales('pared', 4 * 2.6, 0).map(r => r.cantidad);
  assert.deepEqual(enPantalla, real, `la sección dice ${enPantalla} y la calculadora da ${real}`);
  assert.ok(html.includes('10,4 m²'), 'el área dibujada no coincide con 4,00 × 2,60 m');
});

test('el umbral de entrega bonificada es alcanzable con un pedido real', () => {
  const total = calcularMateriales('pared', 40, 0).reduce((s, r) => s + precioFinal(r.producto) * r.cantidad, 0);
  assert.ok(ENVIO_GRATIS_DESDE > 0 && total > 0);
  assert.ok(ENVIO_GRATIS_DESDE < total * 4,
    `el umbral (${ENVIO_GRATIS_DESDE}) es muy alto frente a un pedido típico (${Math.round(total)})`);
});
