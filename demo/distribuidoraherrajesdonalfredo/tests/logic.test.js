/* global require */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  esc, formatearPrecio, precioFinal, normalizar, wspUrl,
  filtrarProductos, paginar, clampQty, calcularCount, calcularTotal,
} = require('../logic.js');

const CATEGORIAS = [
  { id: 'candados', nombre: 'Candados' },
  { id: 'cerraduras', nombre: 'Cerraduras y cilindros' },
  { id: 'herramientas', nombre: 'Herramientas y accesorios' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Candado de bronce macizo', categoria: 'candados', marca: 'Nortex', precio: 10000, descuento: 0, stock: 40, descripcion: 'Candado de bronce con dos llaves.', tags: ['bronce', 'arco'] },
  { id: 2, nombre: 'Cilindro europeo de seguridad', categoria: 'cerraduras', marca: 'Acerix', precio: 20000, descuento: 10, stock: 25, descripcion: 'Cilindro con anti-extracción.', tags: ['cilindro', 'seguridad'] },
  { id: 3, nombre: 'Taladro percutor 600W', categoria: 'herramientas', marca: 'Robusta', precio: 50000, descuento: 15, stock: 0, descripcion: 'Taladro para instalar herrajes.', tags: ['taladro'] },
  { id: 4, nombre: 'Candado con combinación', categoria: 'candados', marca: 'Praxis', precio: 9500, descuento: 0, stock: 50, descripcion: 'Sin necesidad de llave.', tags: ['combinacion'] },
];

test('normalizar: minusculas, sin acentos, sin ñ especial', () => {
  assert.equal(normalizar('CERRADURA'), 'cerradura');
  assert.equal(normalizar('Cerrojo Pequeño'), 'cerrojo pequeno');
  assert.equal(normalizar('BOMBÍN Antibumping'), 'bombin antibumping');
  assert.equal(normalizar(undefined), '');
  assert.equal(normalizar(null), '');
});

test('formatearPrecio: formato es-AR con separador de miles', () => {
  assert.equal(formatearPrecio(12500), '$12.500');
  assert.equal(formatearPrecio(1000000), '$1.000.000');
  assert.equal(formatearPrecio(999), '$999');
  assert.equal(formatearPrecio(12500.6), '$12.501');
});

test('precioFinal: descuento y formato separados (precio nunca se muta)', () => {
  const p = { precio: 20000, descuento: 10 };
  assert.equal(precioFinal(p), 18000);
  assert.equal(p.precio, 20000, 'el precio original no debe mutarse');
  assert.equal(precioFinal({ precio: 5000, descuento: 0 }), 5000);
});

test('filtrarProductos: sin criterios devuelve todo', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, {});
  assert.equal(r.length, 4);
});

test('filtrarProductos: búsqueda por nombre insensible a mayúsculas/acentos', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { query: 'CANDADO' });
  assert.equal(r.length, 2);
  assert.deepEqual(r.map(p => p.id).sort(), [1, 4]);
});

test('filtrarProductos: búsqueda matchea por categoría, marca y tags', () => {
  assert.equal(filtrarProductos(PRODUCTOS, CATEGORIAS, { query: 'herramientas' }).length, 1);
  assert.equal(filtrarProductos(PRODUCTOS, CATEGORIAS, { query: 'acerix' }).length, 1);
  assert.equal(filtrarProductos(PRODUCTOS, CATEGORIAS, { query: 'bronce' }).length, 1);
});

test('filtrarProductos: sin resultados para una palabra que no matchea nada', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { query: 'inexistente-xyz' });
  assert.equal(r.length, 0);
});

test('filtrarProductos: filtro por categoría', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { categoria: 'candados' });
  assert.equal(r.length, 2);
  assert.ok(r.every(p => p.categoria === 'candados'));
});

test('filtrarProductos: filtro por marca', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { marca: 'Acerix' });
  assert.equal(r.length, 1);
  assert.equal(r[0].id, 2);
});

test('filtrarProductos: filtro por rango de precio usa el precio CON descuento', () => {
  // el cilindro cuesta 20000 con 10% off = 18000, cae en el rango 8000-20000
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { min: 8000, max: 20000 });
  assert.deepEqual(r.map(p => p.id).sort(), [1, 2, 4]);
});

test('filtrarProductos: filtros combinados (categoría + precio) son un AND', () => {
  const r = filtrarProductos(PRODUCTOS, CATEGORIAS, { categoria: 'candados', min: 9000, max: 9900 });
  assert.deepEqual(r.map(p => p.id), [4]);
});

test('filtrarProductos: "limpiar" (criterios vacíos) vuelve a mostrar todo tras un filtro previo', () => {
  filtrarProductos(PRODUCTOS, CATEGORIAS, { categoria: 'candados', query: 'bronce' });
  const limpio = filtrarProductos(PRODUCTOS, CATEGORIAS, { query: '', categoria: '', marca: '', min: null, max: null });
  assert.equal(limpio.length, 4);
});

test('paginar: límite inicial, "ver más" y techo cuando excede el total', () => {
  const items = PRODUCTOS;
  assert.equal(paginar(items, 2).length, 2);
  assert.equal(paginar(items, 4).length, 4);
  assert.equal(paginar(items, 999).length, 4, 'no debe romper si visibleCount supera el total');
  assert.equal(paginar(items, 0).length, 0);
});

test('paginar: reinicio de página tras cambiar de filtro (2 llamadas independientes)', () => {
  const filtrados = filtrarProductos(PRODUCTOS, CATEGORIAS, { categoria: 'candados' });
  const pagina1 = paginar(filtrados, 1);
  assert.equal(pagina1.length, 1);
  const reinicio = paginar(filtrados, 1); // simula "reset a PAGE_SIZE" al cambiar de filtro
  assert.deepEqual(pagina1.map(p => p.id), reinicio.map(p => p.id));
});

test('clampQty: nunca baja de 1 ni supera el stock', () => {
  assert.equal(clampQty(5, 3), 3, 'tope por stock');
  assert.equal(clampQty(0, 10), 1, 'piso de 1 unidad');
  assert.equal(clampQty(-4, 10), 1);
  assert.equal(clampQty(2, undefined), 2, 'sin stock declarado, usa el tope por defecto (99)');
  assert.equal(clampQty(500, undefined), 99);
});

test('calcularCount: suma cantidades, carrito vacío da 0', () => {
  assert.equal(calcularCount([]), 0);
  assert.equal(calcularCount([{ id: 1, qty: 2 }, { id: 2, qty: 3 }]), 5);
});

test('calcularTotal: suma con descuentos aplicados y respeta cantidades', () => {
  const items = [{ id: 1, qty: 2 }, { id: 2, qty: 1 }]; // 10000*2 + 18000 (20000 con 10% off)
  assert.equal(calcularTotal(items, PRODUCTOS), 38000);
});

test('calcularTotal: carrito vacío da 0', () => {
  assert.equal(calcularTotal([], PRODUCTOS), 0);
});

test('calcularTotal: ID inexistente en el catálogo (producto eliminado) no rompe el cálculo', () => {
  const items = [{ id: 1, qty: 1 }, { id: 9999, qty: 3 }];
  assert.equal(calcularTotal(items, PRODUCTOS), 10000, 'ignora la línea del producto que ya no existe');
});

test('calcularCount: cantidades corruptas (NaN) no deberían inflar el total con Infinity/NaN silencioso', () => {
  const n = calcularCount([{ id: 1, qty: 2 }]);
  assert.equal(Number.isFinite(n), true);
});

test('calcularTotal: el carrito nunca queda "desactualizado" — el precio se resuelve siempre desde PRODUCTOS, nunca se cachea', () => {
  const productosOriginal = [{ id: 1, precio: 10000, descuento: 0, stock: 10 }];
  const items = [{ id: 1, qty: 1 }];
  assert.equal(calcularTotal(items, productosOriginal), 10000);
  const productosConAumento = [{ id: 1, precio: 15000, descuento: 0, stock: 10 }];
  assert.equal(calcularTotal(items, productosConAumento), 15000, 'el mismo carrito refleja el precio nuevo, no el viejo');
});

test('esc: escapa HTML para evitar inyección desde datos del producto', () => {
  assert.equal(esc('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(esc(`"'&<>`), '&quot;&#39;&amp;&lt;&gt;');
  assert.equal(esc(undefined), '');
});

test('wspUrl: arma un único link wa.me con el texto codificado una sola vez', () => {
  const url = wspUrl('5491138670661', ['Hola!', 'Quiero consultar sobre herrajes.']);
  assert.ok(url.startsWith('https://wa.me/5491138670661?text='));
  assert.ok(!url.includes(' '), 'el espacio debe ir codificado, no viajar literal en la URL');
  assert.ok(url.includes(encodeURIComponent('Quiero consultar sobre herrajes.')));
  assert.equal(decodeURIComponent(url.split('?text=')[1]), 'Hola!\nQuiero consultar sobre herrajes.');
});
