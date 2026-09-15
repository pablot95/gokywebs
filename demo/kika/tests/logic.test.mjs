import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const L = require('../script.js');
const {
  PRODUCTOS, CATEGORIAS, LINEAS, ENVIO_GRATIS_DESDE, PASO_VER_MAS,
  norm, formatearPrecio, precioFinal, getProducto,
  filtrarProductos, calcularTotal, faltaParaEnvioGratis,
} = L;

/* ---------- Datos ---------- */

test('el catálogo tiene 14 SKUs con id único y campos completos', () => {
  assert.equal(PRODUCTOS.length, 14);
  const ids = PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'hay ids repetidos');
  PRODUCTOS.forEach(p => {
    assert.ok(p.nombre && p.medida && p.img && p.alt && p.desc, `${p.id} incompleto`);
    assert.ok(p.precio > 0, `${p.id} sin precio`);
    assert.ok(p.stock > 0, `${p.id} sin stock`);
    assert.ok(p.activo && p.concentracion && p.ph, `${p.id} sin ficha técnica`);
  });
});

test('cada categoría y línea usada existe en su tabla', () => {
  const catsValidas = CATEGORIAS.map(c => c.id);
  PRODUCTOS.forEach(p => {
    assert.ok(catsValidas.includes(p.categoria), `${p.id}: categoría "${p.categoria}" inexistente`);
    assert.ok(LINEAS[p.linea], `${p.id}: línea "${p.linea}" inexistente`);
  });
});

test('hay exactamente 8 destacados para la vidriera', () => {
  assert.equal(PRODUCTOS.filter(p => p.destacado).length, 8);
});

/* ---------- Precios ---------- */

test('precioFinal aplica el descuento y respeta el precio sin descuento', () => {
  const conDesc = { precio: 27500, descuento: 15 };
  assert.equal(precioFinal(conDesc), 23375);
  assert.equal(precioFinal({ precio: 18900, descuento: 0 }), 18900);
});

test('precioFinal redondea a entero (nunca centavos en el precio mostrado)', () => {
  const p = { precio: 19700, descuento: 10 };
  assert.equal(precioFinal(p), 17730);
  assert.equal(Number.isInteger(precioFinal(p)), true);
});

test('formatearPrecio usa el formato es-AR sin decimales', () => {
  assert.equal(formatearPrecio(18900), '$18.900');
  assert.equal(formatearPrecio(23375), '$23.375');
  assert.equal(formatearPrecio(0), '$0');
});

/* ---------- Carrito ---------- */

test('calcularTotal suma cantidades y aplica descuentos', () => {
  const items = [{ id: 'serum-ha', qty: 2 }, { id: 'ampollas-vitc', qty: 1 }];
  // 18900*2 + 23375 (27500 con -15%)
  assert.equal(calcularTotal(items), 61175);
});

test('calcularTotal ignora un id que ya no existe en el catálogo, sin romper', () => {
  const items = [{ id: 'serum-ha', qty: 1 }, { id: 'producto-fantasma', qty: 5 }];
  assert.equal(calcularTotal(items), 18900);
});

test('calcularTotal de un carrito vacío es 0', () => {
  assert.equal(calcularTotal([]), 0);
});

/* ---------- Envío gratis ---------- */

test('faltaParaEnvioGratis calcula el resto y nunca da negativo', () => {
  assert.equal(faltaParaEnvioGratis(0), ENVIO_GRATIS_DESDE);
  assert.equal(faltaParaEnvioGratis(20000), ENVIO_GRATIS_DESDE - 20000);
  assert.equal(faltaParaEnvioGratis(ENVIO_GRATIS_DESDE), 0);
  assert.equal(faltaParaEnvioGratis(ENVIO_GRATIS_DESDE + 9999), 0);
});

/* ---------- Búsqueda ---------- */

test('la búsqueda encuentra con y sin acentos', () => {
  const conAcento = filtrarProductos(PRODUCTOS, { q: 'ácido' });
  const sinAcento = filtrarProductos(PRODUCTOS, { q: 'acido' });
  assert.ok(conAcento.length > 0);
  assert.deepEqual(conAcento.map(p => p.id), sinAcento.map(p => p.id));
});

test('la búsqueda ignora mayúsculas y busca también por activo', () => {
  const porActivo = filtrarProductos(PRODUCTOS, { q: 'NIACINAMIDA' });
  assert.ok(porActivo.some(p => p.id === 'tonico-niacinamida'));
});

test('la búsqueda exige TODOS los términos, no cualquiera', () => {
  assert.equal(filtrarProductos(PRODUCTOS, { q: 'hialurónico ampollas' }).length, 0);
  assert.ok(filtrarProductos(PRODUCTOS, { q: 'vitamina c' }).some(p => p.id === 'ampollas-vitc'));
});

test('una búsqueda sin resultados devuelve lista vacía, no todo el catálogo', () => {
  assert.equal(filtrarProductos(PRODUCTOS, { q: 'zzzz' }).length, 0);
});

test('sin filtros devuelve el catálogo completo', () => {
  assert.equal(filtrarProductos(PRODUCTOS, {}).length, PRODUCTOS.length);
  assert.equal(filtrarProductos(PRODUCTOS).length, PRODUCTOS.length);
});

/* ---------- Filtros combinados ---------- */

test('filtros combinados: categoría + línea se aplican juntos', () => {
  const r = filtrarProductos(PRODUCTOS, { cat: 'facial', linea: 'clinica' });
  assert.ok(r.length > 0);
  r.forEach(p => {
    assert.equal(p.categoria, 'facial');
    assert.equal(p.linea, 'clinica');
  });
  // el gel de limpieza es facial pero de línea salón: no debe estar
  assert.ok(!r.some(p => p.id === 'gel-limpieza-500'));
});

test('filtro + búsqueda se combinan (no se pisan)', () => {
  const r = filtrarProductos(PRODUCTOS, { cat: 'corporal', q: 'karité' });
  assert.deepEqual(r.map(p => p.id), ['balsamo-karite']);
  assert.equal(filtrarProductos(PRODUCTOS, { cat: 'ampollas', q: 'karité' }).length, 0);
});

test('una combinación sin coincidencias devuelve vacío sin romper', () => {
  assert.equal(filtrarProductos(PRODUCTOS, { cat: 'accesorios', linea: 'botanica' }).length, 0);
});

/* ---------- Orden ---------- */

test('orden por precio ascendente y descendente usan el precio CON descuento', () => {
  const asc = filtrarProductos(PRODUCTOS, { orden: 'precio-asc' });
  const desc = filtrarProductos(PRODUCTOS, { orden: 'precio-desc' });
  const preciosAsc = asc.map(precioFinal);
  assert.deepEqual(preciosAsc, [...preciosAsc].sort((a, b) => a - b));
  assert.deepEqual(desc.map(p => p.id), [...asc].reverse().map(p => p.id));
});

test('el orden "sugerido" conserva el orden del array — el catálogo no repite la vidriera', () => {
  const sugerido = filtrarProductos(PRODUCTOS, { orden: 'sugerido' });
  assert.deepEqual(sugerido.map(p => p.id), PRODUCTOS.map(p => p.id));
  // los 8 primeros del catálogo no pueden ser exactamente los 8 destacados en ese orden
  const primeros8 = sugerido.slice(0, PASO_VER_MAS).map(p => p.id);
  const destacados8 = PRODUCTOS.filter(p => p.destacado).map(p => p.id);
  assert.notDeepEqual(primeros8, destacados8.slice(0, PASO_VER_MAS).sort(() => 0));
});

test('ordenar no muta el array original de PRODUCTOS', () => {
  const antes = PRODUCTOS.map(p => p.id);
  filtrarProductos(PRODUCTOS, { orden: 'precio-desc' });
  assert.deepEqual(PRODUCTOS.map(p => p.id), antes);
});

/* ---------- Paginación ---------- */

test('la paginación muestra de a 8 y el botón desaparece al agotar', () => {
  const lista = filtrarProductos(PRODUCTOS, {});
  assert.equal(PASO_VER_MAS, 8);
  assert.equal(lista.slice(0, PASO_VER_MAS).length, 8);
  assert.ok(PASO_VER_MAS < lista.length, 'con 14 SKUs el botón Ver más tiene que aparecer');
  assert.equal(lista.slice(0, PASO_VER_MAS * 2).length, lista.length);
});

test('un filtro que deja menos de 8 resultados no necesita paginar', () => {
  const r = filtrarProductos(PRODUCTOS, { cat: 'ampollas' });
  assert.ok(r.length <= PASO_VER_MAS);
  assert.equal(r.slice(0, PASO_VER_MAS).length, r.length);
});

/* ---------- Utilidades ---------- */

test('getProducto devuelve undefined sin romper para un id inexistente', () => {
  assert.equal(getProducto('no-existe'), undefined);
  assert.equal(getProducto('serum-ha').nombre, 'Sérum Ácido Hialurónico 2%');
});

test('norm normaliza acentos y mayúsculas, y tolera null', () => {
  assert.equal(norm('Ácido HIALURÓNICO'), 'acido hialuronico');
  assert.equal(norm(null), '');
  assert.equal(norm(undefined), '');
});
