const test = require('node:test');
const assert = require('node:assert/strict');
const { loadLogic } = require('./load-logic');

test('normalize: ignora mayusculas y acentos', () => {
  const { hooks } = loadLogic();
  assert.equal(hooks.normalize('SALMÓN'), hooks.normalize('salmon'));
  assert.equal(hooks.normalize('Langostinos Panko'), hooks.normalize('LANGOSTINOS PANKO'));
  assert.equal(hooks.normalize(''), '');
  assert.equal(hooks.normalize(null), '');
  assert.equal(hooks.normalize(undefined), '');
});

test('PRODUCTOS: dataset minimo (32 productos, 5 categorias, sin nombres repetidos)', () => {
  const { hooks } = loadLogic();
  assert.equal(hooks.PRODUCTOS.length, 32);
  assert.equal(hooks.CATEGORIAS.length, 5);
  const nombres = hooks.PRODUCTOS.map(p => p.nombre);
  assert.equal(new Set(nombres).size, nombres.length, 'no debe haber nombres de producto duplicados');
  const ids = hooks.PRODUCTOS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'no debe haber ids duplicados');
});

test('precioFinal y formatearPrecio: el descuento se calcula aparte del formato', () => {
  const { hooks } = loadLogic();
  const conDescuento = hooks.PRODUCTOS.find(p => p.descuento > 0);
  const sinDescuento = hooks.PRODUCTOS.find(p => p.descuento === 0);
  assert.ok(conDescuento && sinDescuento, 'el fixture necesita al menos un producto con y sin descuento');

  const esperado = Math.round(conDescuento.precio * (1 - conDescuento.descuento / 100));
  assert.equal(hooks.precioFinal(conDescuento), esperado);
  assert.equal(hooks.precioFinal(sinDescuento), sinDescuento.precio);

  assert.equal(hooks.formatearPrecio(12500), '$12.500');
  assert.equal(hooks.formatearPrecio(1000000), '$1.000.000');
  assert.equal(hooks.formatearPrecio(999.6), '$1.000');
});

test('getFiltered: categoria, proteina, vegetariano, picante, precio y busqueda combinados', () => {
  const { hooks } = loadLogic();
  const f = hooks.filtros;

  f.categoria = 'vegetarianos';
  let resultado = hooks.getFiltered();
  assert.ok(resultado.length > 0);
  assert.ok(resultado.every(p => p.categoria === 'vegetarianos'));

  f.picante = true;
  resultado = hooks.getFiltered();
  assert.ok(resultado.length > 0);
  assert.ok(resultado.every(p => p.categoria === 'vegetarianos' && p.picante === true));

  f.categoria = 'todas';
  f.picante = false;
  f.vegetariano = true;
  resultado = hooks.getFiltered();
  assert.ok(resultado.every(p => p.vegetariano === true));
  assert.ok(resultado.length >= 8, 'el fixture declara al menos 8 productos vegetarianos');

  f.vegetariano = false;
  f.proteina = 'langostinos';
  resultado = hooks.getFiltered();
  assert.ok(resultado.every(p => p.proteina === 'langostinos'));

  f.proteina = 'todas';
  f.precio = '0-10000';
  resultado = hooks.getFiltered();
  assert.ok(resultado.every(p => hooks.precioFinal(p) <= 10000));

  f.precio = 'todos';
  f.q = 'salmón';
  resultado = hooks.getFiltered();
  assert.ok(resultado.length > 0);
  f.q = 'SALMON';
  const resultadoSinAcento = hooks.getFiltered();
  assert.equal(resultado.length, resultadoSinAcento.length, 'la busqueda debe ignorar acentos y mayusculas');

  f.categoria = 'todas';
  f.proteina = 'todas';
  f.vegetariano = false;
  f.picante = false;
  f.precio = 'todos';
  f.q = 'zzz-no-existe-zzz';
  assert.equal(hooks.getFiltered().length, 0, 'una busqueda sin coincidencias debe devolver vacio');

  f.q = '';
  assert.equal(hooks.getFiltered().length, hooks.PRODUCTOS.length, 'limpiar filtros debe devolver el catalogo completo');
});

test('paginacion: PAGE_SIZE fijo en 16 y el slice avanza de a una pagina', () => {
  const { hooks } = loadLogic();
  assert.equal(hooks.PAGE_SIZE, 16);

  const todos = hooks.getFiltered();
  assert.ok(todos.length > 16, 'el catalogo debe tener mas de una pagina para que "Ver mas" tenga sentido');

  const pagina1 = todos.slice(0, hooks.PAGE_SIZE);
  const pagina2 = todos.slice(0, hooks.PAGE_SIZE * 2);
  assert.equal(pagina1.length, 16);
  assert.equal(pagina2.length, Math.min(32, todos.length));

  hooks.filtros.categoria = 'entradas';
  const filtrados = hooks.getFiltered();
  assert.ok(filtrados.length < hooks.PAGE_SIZE, 'entradas tiene menos de 16 productos: no debe mostrar "Ver mas"');
  hooks.filtros.categoria = 'todas';
});

test('Cart: agregar suma cantidades y no duplica la linea', () => {
  const { hooks } = loadLogic();
  const p = hooks.PRODUCTOS[0];
  hooks.Cart.add(p, 2);
  hooks.Cart.add(p, 3);
  const items = hooks.Cart.get();
  assert.equal(items.length, 1);
  assert.equal(items[0].qty, 5);
  assert.equal(hooks.Cart.count(), 5);
});

test('Cart: la cantidad nunca supera el stock del producto', () => {
  const { hooks } = loadLogic();
  const limitado = hooks.PRODUCTOS.find(p => p.stock > 0 && p.stock < 10);
  assert.ok(limitado, 'el fixture necesita un producto con stock bajo para probar el tope');
  hooks.Cart.add(limitado, 999);
  assert.equal(hooks.Cart.get()[0].qty, limitado.stock);
  hooks.Cart.setQty(limitado.id, 999);
  assert.equal(hooks.Cart.get()[0].qty, limitado.stock);
});

test('Cart: setQty nunca baja de 1, remove saca la linea, clear vacia todo', () => {
  const { hooks } = loadLogic();
  const p = hooks.PRODUCTOS[1];
  hooks.Cart.add(p, 3);
  hooks.Cart.setQty(p.id, -5);
  assert.equal(hooks.Cart.get()[0].qty, 1);

  hooks.Cart.remove(p.id);
  assert.equal(hooks.Cart.get().length, 0);

  hooks.Cart.add(p, 2);
  hooks.Cart.add(hooks.PRODUCTOS[2], 1);
  hooks.Cart.clear();
  assert.equal(hooks.Cart.get().length, 0);
  assert.equal(hooks.Cart.count(), 0);
  assert.equal(hooks.Cart.total(), 0);
});

test('Cart: eliminar un id que no esta en el carrito no rompe nada', () => {
  const { hooks } = loadLogic();
  const p = hooks.PRODUCTOS[0];
  hooks.Cart.add(p, 1);
  hooks.Cart.remove('id-que-no-existe');
  assert.equal(hooks.Cart.get().length, 1);
  hooks.Cart.setQty('id-que-no-existe', 5);
  assert.equal(hooks.Cart.get().length, 1);
});

test('Cart: total() sale siempre del precio ACTUAL de PRODUCTOS, no de una copia vieja', () => {
  const { hooks } = loadLogic();
  const p = hooks.PRODUCTOS.find(p => p.descuento === 0);
  hooks.Cart.add(p, 2);
  assert.equal(hooks.Cart.total(), p.precio * 2);

  const precioViejo = p.precio;
  p.precio = precioViejo + 5000;
  assert.equal(hooks.Cart.total(), p.precio * 2, 'el total debe reflejar el precio vigente, no el de cuando se agrego');
  p.precio = precioViejo;
});

test('Cart: localStorage corrupto no rompe get(), se recupera como carrito vacio', () => {
  const { hooks, localStorage } = loadLogic();
  localStorage.setItem(hooks.Cart.KEY, '{esto no es json valido');
  assert.equal(hooks.Cart.get().length, 0);
  assert.equal(hooks.Cart.count(), 0);
  assert.equal(hooks.Cart.total(), 0);

  localStorage.setItem(hooks.Cart.KEY, 'null');
  assert.equal(hooks.Cart.get().length, 0);
});

test('cardHTML: escapa HTML del nombre y marca el badge de agotado', () => {
  const { hooks } = loadLogic();
  const agotado = hooks.PRODUCTOS.find(p => p.stock === 0);
  assert.ok(agotado, 'el fixture necesita un producto agotado');
  const html = hooks.cardHTML(agotado);
  assert.ok(html.includes('Agotado'));
  assert.ok(html.includes('disabled'));

  const inyeccion = { ...hooks.PRODUCTOS[0], nombre: '<script>alert(1)</script>' };
  const htmlSeguro = hooks.esc(inyeccion.nombre);
  assert.ok(!htmlSeguro.includes('<script>'));
  assert.ok(htmlSeguro.includes('&lt;script&gt;'));
});
