import test from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.LECXALY_API || 'http://127.0.0.1:8997/demo/lecxalyquality/api/productos.php';

async function pedir(params) {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) url.searchParams.set(k, String(v)); });
  const r = await fetch(url);
  assert.equal(r.status, 200, `HTTP ${r.status} en ${url}`);
  return r.json();
}

let disponible = true;
try { await fetch(BASE); } catch { disponible = false; }
const opts = { skip: !disponible && 'servidor PHP local apagado' };

test('ninguna respuesta supera los 100 productos aunque se pidan más', opts, async () => {
  const data = await pedir({ scope: 'admin', limit: 500 });
  assert.equal(data.limit, 100);
  assert.ok(data.items.length <= 100);
});

test('el catálogo público pagina de a 16 con cursor y sin repetir', opts, async () => {
  const p1 = await pedir({ scope: 'catalogo', limit: 16 });
  assert.equal(p1.items.length, 16);
  assert.ok(p1.nextCursor, 'tiene cursor para la segunda página');
  const p2 = await pedir({ scope: 'catalogo', limit: 16, cursor: p1.nextCursor });
  const ids = [...p1.items, ...p2.items].map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'sin ids repetidos entre páginas');
  assert.equal(ids.length, p1.total);
  assert.equal(p2.nextCursor, null, 'la última página no trae cursor');
});

test('los scopes públicos esconden ocultos y separan la tienda iPhone', opts, async () => {
  const cat = await pedir({ scope: 'catalogo', limit: 100 });
  const ip = await pedir({ scope: 'iphone', limit: 100 });
  const admin = await pedir({ scope: 'admin', limit: 100 });
  assert.ok(cat.items.every(p => p.visible && p.categoria !== 'iPhone'));
  assert.ok(ip.items.every(p => p.visible && p.categoria === 'iPhone'));
  assert.ok(admin.items.some(p => !p.visible), 'el admin ve los ocultos');
  assert.equal(admin.items.length, cat.items.length + ip.items.length + admin.items.filter(p => !p.visible).length);
});

test('los filtros reducen resultados y el orden por precio es monótono', opts, async () => {
  const todo = await pedir({ scope: 'catalogo', limit: 100 });
  const talle = await pedir({ scope: 'catalogo', limit: 100, categoria: 'Calzado', talle: '44' });
  assert.ok(talle.total > 0 && talle.total < todo.total);
  assert.ok(talle.items.every(p => p.variantes.opciones.includes('44')));
  const precio = await pedir({ scope: 'catalogo', limit: 100, precio_max: 40000 });
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  assert.ok(precio.items.every(p => final(p) <= 40000));
  const asc = await pedir({ scope: 'catalogo', limit: 100, orden: 'precio-asc' });
  const valores = asc.items.map(final);
  assert.deepEqual(valores, [...valores].sort((a, b) => a - b));
  const desc = await pedir({ scope: 'iphone', limit: 100, orden: 'precio-desc' });
  const v2 = desc.items.map(final);
  assert.deepEqual(v2, [...v2].sort((a, b) => b - a));
  const q = await pedir({ scope: 'iphone', limit: 100, q: 'seminuevo 13' });
  assert.ok(q.total >= 1 && q.items.every(p => p.condicion === 'Seminuevo' && p.subcategoria === 'iPhone 13'));
});

test('el cursor inválido devuelve 400 y los ids inexistentes no rompen', opts, async () => {
  const url = new URL(BASE);
  url.searchParams.set('cursor', '!!!');
  const r = await fetch(url);
  assert.equal(r.status, 400);
  const ids = await pedir({ scope: 'ids', ids: 'nada,tampoco', limit: 50 });
  assert.deepEqual(ids.items, []);
  const vacio = await pedir({ scope: 'ids', limit: 50 });
  assert.deepEqual(vacio.items, []);
});
