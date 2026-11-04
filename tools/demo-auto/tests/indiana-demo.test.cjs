const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const root = path.resolve("demo/indianaindumentariafemenina");
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");
const data = fs
  .readFileSync(path.join(root, "products.ndjson"), "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "indiana-api-test-"));
fs.copyFileSync(path.join(root, "api.php"), path.join(temp, "api.php"));
const synthetic = Array.from({ length: 237 }, (_, i) => ({
  ...data[i % data.length],
  id: "test-" + String(i).padStart(4, "0"),
  slug: "test-" + i,
  precio: 10000 + (i % 11) * 1000,
  nombre:
    i === 236
      ? "Cárdigan Único Aguará"
      : "Prenda " + String(i).padStart(4, "0"),
  tags: i === 236 ? ["ñandú", "última"] : data[i % data.length].tags,
}));
fs.writeFileSync(
  path.join(temp, "products.ndjson"),
  synthetic.map((p) => JSON.stringify(p)).join("\n"),
);
function request(query, actual = false) {
  const run = spawnSync(
    "php",
    [
      "-r",
      "parse_str($argv[1], $_GET); include $argv[2];",
      new URLSearchParams(query).toString(),
      path.join(actual ? root : temp, "api.php"),
    ],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(run.stdout);
}
function logic() {
  const store = new Map();
  const document = {
    body: { dataset: { modelo: "1", pagina: "home" } },
    addEventListener() {},
    dispatchEvent() {},
  };
  const context = vm.createContext({
    document,
    window: { matchMedia: () => ({ matches: false }) },
    localStorage: {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, v),
    },
    CustomEvent: class {},
    URLSearchParams,
    AbortController,
    setTimeout,
    clearTimeout,
    fetch: async () => ({ ok: true, json: async () => ({ items: [] }) }),
  });
  const cutoff = source.indexOf(
    "\nif (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')",
  );
  assert.ok(cutoff > 0);
  vm.runInContext(
    source.slice(0, cutoff) +
      "\nglobalThis.lib={Cart,remember,getProducto,normalize,precioFinal,formatearPrecio,api,getCache:()=>PRODUCTOS};",
    context,
  );
  return { ...context.lib, store, context };
}
test("server caps home, catalog and admin at 6 / 16 / 100 despite caller limits", () => {
  for (const [scope, cap] of [
    ["home", 6],
    ["catalog", 16],
    ["admin", 100],
  ]) {
    const page = request({ scope, limit: 50000 });
    assert.equal(page.items.length, cap);
    assert.equal(page.limit, cap);
    assert.ok(page.nextCursor);
  }
});
test("cursor visits 237 unique records in bounded admin pages", () => {
  let cursor = "",
    ids = [],
    lengths = [];
  do {
    const page = request({ scope: "admin", cursor });
    ids.push(...page.items.map((x) => x.id));
    lengths.push(page.items.length);
    cursor = page.nextCursor;
  } while (cursor);
  assert.deepEqual(lengths, [100, 100, 37]);
  assert.equal(new Set(ids).size, 237);
});
test("price cursors preserve tie order without duplicates or omissions", () => {
  for (const orden of ["precio-asc", "precio-desc"]) {
    const all = [];
    let cursor = "";
    do {
      const page = request({ scope: "admin", orden, cursor, limit: 77 });
      all.push(...page.items);
      cursor = page.nextCursor;
    } while (cursor);
    assert.equal(new Set(all.map((p) => p.id)).size, 237);
    const final = (p) => Math.round(p.precio * (1 - p.descuento / 100));
    for (let i = 1; i < all.length; i++)
      assert.ok(
        orden === "precio-asc"
          ? final(all[i]) >= final(all[i - 1])
          : final(all[i]) <= final(all[i - 1]),
      );
  }
});
test("search finds an accented match after the first 200 records without downloading earlier pages", () => {
  const result = request({ scope: "admin", q: "CARDIGAN AGUARA" });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].id, "test-0236");
  assert.equal(result.nextCursor, null);
  assert.equal(request({ scope: "admin", q: "NANDU ULTIMA" }).items.length, 1);
});
test("all filters combine on the server, no-result and reset paths work", () => {
  const result = request(
    {
      cat: "prendas",
      sub: "superiores",
      talle: "XL",
      color: "rosa",
      stock: "1",
      precio: 50000,
    },
    true,
  );
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].slug, "cardigan-rosa");
  assert.equal(request({ q: "ningunproductoexiste" }, true).items.length, 0);
  assert.equal(request({}, true).total, 9);
  assert.equal(request({ cat: "no-existe", talle: "XXXL" }, true).total, 9);
});
test("cursor cannot be reused for a different filter and malformed cursors fail", () => {
  const first = request({ scope: "admin" });
  assert.match(
    request({ scope: "admin", q: "otra", cursor: first.nextCursor }).error,
    /Cursor/,
  );
  assert.match(request({ scope: "admin", cursor: "no-json" }).error, /Cursor/);
  assert.match(request({ scope: "invalid" }).error, /Vista/);
});
test("lookup has a hard cap and unknown slugs or empty lookups return nothing", () => {
  assert.equal(
    request({
      scope: "lookup",
      ids: synthetic.map((p) => p.id).join(","),
      limit: 999,
    }).items.length,
    100,
  );
  assert.equal(request({ scope: "lookup" }).items.length, 0);
  assert.equal(request({ scope: "lookup", slug: "absent" }).items.length, 0);
});
test("empty and one-record datasets produce valid cursors and totals", () => {
  const file = path.join(temp, "products.ndjson"),
    original = fs.readFileSync(file);
  try {
    fs.writeFileSync(file, "");
    assert.equal(request({}).total, 0);
    assert.equal(request({}).nextCursor, null);
    fs.writeFileSync(file, JSON.stringify(synthetic[0]));
    assert.equal(request({}).items.length, 1);
    assert.equal(request({}).nextCursor, null);
  } finally {
    fs.writeFileSync(file, original);
  }
});
test("normalization, discount and ARS formatting are consistent", () => {
  const l = logic();
  assert.equal(l.normalize("  CÁRDIGAN ÑANDÚ  "), "cardigan nandu");
  assert.equal(l.precioFinal(data[4]), 47610);
  assert.equal(l.formatearPrecio(47610), "$47.610");
});
test("cart recovers from corrupt storage and rejects malformed quantities", () => {
  const l = logic();
  for (const raw of [
    "{oops",
    "{}",
    "null",
    '[null,{}, {"id":"in-01","talle":"S","qty":-3}]',
  ]) {
    l.store.set(l.Cart.KEY, raw);
    assert.equal(l.Cart.get().length, 0);
  }
});
test("variants are distinct, aggregate stock is enforced, totals use current prices", () => {
  const l = logic(),
    p = { ...data[0], stock: 4 };
  l.remember([p]);
  assert.equal(l.Cart.add(p, 2, "S"), true);
  assert.equal(l.Cart.add(p, 3, "M"), true);
  assert.equal(l.Cart.get().length, 2);
  assert.equal(l.Cart.count(), 4);
  assert.equal(l.Cart.add(p, 1, "L"), false);
  assert.equal(l.Cart.add(p, 1, "INVALID"), false);
  l.remember([{ ...p, precio: 100 }]);
  assert.equal(l.Cart.total(), 400);
  l.Cart.setQty(p.id, 99, "S");
  assert.equal(l.Cart.count(), 4);
  l.Cart.remove(p.id, "M");
  assert.equal(l.Cart.count(), 2);
  l.Cart.clear();
  assert.equal(l.Cart.total(), 0);
});
test("stock synchronization prunes removed ids, removed variants and sold-out products", () => {
  const l = logic();
  l.remember(data);
  l.Cart.save([
    { id: "deleted", talle: "M", qty: 2 },
    { id: data[0].id, talle: "XL", qty: 1 },
    { id: data[0].id, talle: "S", qty: 25 },
    { id: data[8].id, talle: "S", qty: 1 },
  ]);
  l.Cart.syncStock(data);
  assert.equal(l.Cart.get().length, 1);
  assert.equal(l.Cart.count(), 12);
});
test("browser cache never retains more than 100 products", () => {
  const l = logic();
  for (let i = 0; i < synthetic.length; i += 16)
    l.remember(synthetic.slice(i, i + 16));
  assert.equal(l.getCache().length, 100);
  assert.equal(l.getProducto("test-0000"), undefined);
});
test("browser rejects oversized server responses", async () => {
  const l = logic();
  l.context.fetch = async () => ({
    ok: true,
    json: async () => ({ items: synthetic }),
  });
  await assert.rejects(l.api({ scope: "catalog" }), /no es válida/);
});
test("HTML contract: identical home copy, correct model routes, canonical components", () => {
  const a = fs.readFileSync(path.join(root, "index.html"), "utf8"),
    b = fs.readFileSync(path.join(root, "modelo-2.html"), "utf8");
  const texts = (html) =>
    [...html.matchAll(/<(h[1-3]|p)\b[^>]*>(.*?)<\/\1>/gs)]
      .map((m) => m[2].replace(/<[^>]+>/g, ""))
      .sort();
  assert.deepEqual(texts(a), texts(b));
  for (const file of [
    "index.html",
    "modelo-2.html",
    "catalogo.html",
    "catalogo-2.html",
  ]) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal((html.match(/class="gw-modelos__btn"/g) || []).length, 2);
    assert.ok(html.includes('id="wsp-float"'));
    assert.ok(html.includes('src="/demo/track.js" defer'));
    assert.ok(!html.includes("checkout.html"));
    if (file.includes("-2")) assert.ok(!html.includes('href="./#'));
  }
});
