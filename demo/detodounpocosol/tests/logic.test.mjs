import test from "node:test";
import assert from "node:assert/strict";
import { loadScript } from "./helpers/load-script.mjs";

test("precioFinal aplica el descuento correctamente", () => {
  const { context } = loadScript();
  assert.equal(context.precioFinal({ precio: 24000, descuento: 15 }), 20400);
  assert.equal(context.precioFinal({ precio: 11000, descuento: 20 }), 8800);
  assert.equal(context.precioFinal({ precio: 32000, descuento: 0 }), 32000);
});

test("formatearPrecio da formato es-AR sin decimales", () => {
  const { context } = loadScript();
  const out = context.formatearPrecio(32000);
  assert.match(out, /32\.000/);
  assert.doesNotMatch(out, /,00$/);
});

test("normalizar ignora mayúsculas y tildes", () => {
  const { context } = loadScript();
  assert.equal(context.normalizar("Sahumerios"), context.normalizar("sahumerios"));
  assert.equal(context.normalizar("PORCELANA FRÍA"), context.normalizar("porcelana fria"));
});

test("PRODUCTOS: cada categoría usada existe en CATEGORIAS", () => {
  const { context } = loadScript();
  const categoriasUsadas = new Set(context.PRODUCTOS.map((p) => p.categoria));
  for (const cat of categoriasUsadas) {
    assert.ok(context.CATEGORIAS[cat], `Categoria sin nombre: ${cat}`);
  }
  assert.equal(context.PRODUCTOS.length, 24);
});

test("productosFiltrados: filtro por categoria", () => {
  const { context } = loadScript();
  context.categoriaActiva = "natura";
  const res = context.productosFiltrados();
  assert.equal(res.length, 4);
  assert.ok(res.every((p) => p.categoria === "natura"));
});

test("productosFiltrados: busqueda por nombre normalizada", () => {
  const { context, elements } = loadScript();
  context.categoriaActiva = "todos";
  elements.buscador.value = "TUPPERWARE";
  const res = context.productosFiltrados();
  assert.equal(res.length, 3);
  assert.ok(res.every((p) => p.categoria === "tupperware"));
});

test("productosFiltrados: busqueda matchea nombre de categoria (Hogar y Aromas)", () => {
  const { context, elements } = loadScript();
  context.categoriaActiva = "todos";
  elements.buscador.value = "aromas";
  const res = context.productosFiltrados();
  assert.equal(res.length, 5);
});

test("productosFiltrados: sin resultados con termino inexistente", () => {
  const { context, elements } = loadScript();
  context.categoriaActiva = "todos";
  elements.buscador.value = "zzz-no-existe-zzz";
  const res = context.productosFiltrados();
  assert.equal(res.length, 0);
});

test("carrito: agregar, totales y persistencia en localStorage", () => {
  const { context } = loadScript();
  context.agregarAlCarrito("billetera-cuero", 1);
  context.agregarAlCarrito("pulsera-cuarzo", 2);
  assert.equal(context.cantidadCarrito(), 3);
  assert.equal(context.totalCarrito(), 32000 + 9000 * 2);
});

test("carrito: agregar el mismo id acumula cantidad, no duplica linea", () => {
  const { context } = loadScript();
  context.agregarAlCarrito("billetera-cuero", 1);
  context.agregarAlCarrito("billetera-cuero", 2);
  const items = context.leerCarrito();
  assert.equal(items.length, 1);
  assert.equal(items[0].qty, 3);
});

test("carrito: quitar y cambiar cantidad", () => {
  const { context } = loadScript();
  context.agregarAlCarrito("billetera-cuero", 1);
  context.agregarAlCarrito("pulsera-cuarzo", 1);
  context.cambiarCantidadCarrito("billetera-cuero", 5);
  assert.equal(context.leerCarrito().find((l) => l.id === "billetera-cuero").qty, 5);
  context.quitarDelCarrito("pulsera-cuarzo");
  assert.equal(context.leerCarrito().length, 1);
});

test("carrito: localStorage corrupto no rompe leerCarrito", () => {
  const { context, localStorage } = loadScript();
  localStorage.setItem(context.CART_KEY, "{esto no es json valido");
  assert.doesNotThrow(() => context.leerCarrito());
  assert.equal(context.leerCarrito().length, 0);
});

test("calcularSeleccion: devuelve 3 productos y prioriza diversidad de categoria", () => {
  const { context } = loadScript();
  const top = context.calcularSeleccion({ para: "regalo", tipo: "artesanal" });
  assert.equal(top.length, 3);
  const categorias = new Set(top.map((p) => p.categoria));
  assert.ok(categorias.size >= 2, "deberia cubrir al menos 2 categorias distintas");
  top.forEach((p) => {
    assert.ok(p.perfil.includes("regalo") || p.perfil.includes("artesanal"));
  });
});

test("calcularSeleccion: perfil 'accesorio' devuelve productos de esa categoria", () => {
  const { context } = loadScript();
  const top = context.calcularSeleccion({ para: "uso-personal", tipo: "accesorio" });
  assert.equal(top.length, 3);
  assert.ok(top.some((p) => p.categoria === "accesorios"));
});

test("calcularSeleccion: nunca devuelve menos de 3 aunque no haya matches", () => {
  const { context } = loadScript();
  const top = context.calcularSeleccion({ para: "no-existe", tipo: "no-existe" });
  assert.equal(top.length, 3);
});
