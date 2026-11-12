const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 999;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5493757301593';
const MARCA = 'Mega Bazar Distribuciones';
const CATEGORIAS = [
  { id: 'bazar', nombre: 'Bazar', titulo: 'Bazar', bajada: 'Cestos, comederos y bebederos', img: 'images/p-cesto.webp' },
  { id: 'libreria', nombre: 'Librería', titulo: 'Librería', bajada: 'Calculadoras, cuadernos y bolígrafos', img: 'images/p-calculadora.webp' },
  { id: 'limpieza', nombre: 'Limpieza', titulo: 'Limpieza', bajada: 'Sopapas y esponjas', img: 'images/p-esponja-cocina.webp' },
  { id: 'descartables', nombre: 'Descartables', titulo: 'Descartables', bajada: 'Vasos, platos, servilletas y cubiertos', img: 'images/p-vasos.webp' },
  { id: 'varios', nombre: 'Artículos varios', titulo: 'Artículos varios', bajada: 'Guantes y aparatos para mosquitos', img: 'images/p-guante-moteado.webp' },
];
const PRESENTACIONES = [
  { id: 'unidad', nombre: 'Por unidad' },
  { id: 'par', nombre: 'Por par' },
  { id: 'pack', nombre: 'Pack o paquete' },
];
const PRECIOS = [
  { id: 'hasta2500', nombre: 'Hasta $2.500', min: 0, max: 2500 },
  { id: '2500a5000', nombre: '$2.500 a $5.000', min: 2500, max: 5000 },
  { id: 'mas5000', nombre: 'Más de $5.000', min: 5000, max: null },
];
const PRODUCTOS = [
  { id: 'calculadora', codigo: 'MB-201', rango: 1, cat: 'libreria', nombre: 'Calculadora de bolsillo 8 dígitos', pres: 'unidad', presTexto: 'Unidad', precio: 4900, descuento: 0, etiqueta: 'Más pedido', img: 'images/p-calculadora.webp', fotos: ['images/e-calculadoras.webp'], alt: 'Calculadora de bolsillo azul de 8 dígitos con teclas grandes', desc: 'Calculadora de bolsillo de 8 dígitos. Lleva pila AAA. Teclas grandes y fáciles de usar. Ideal para escuela, hogar y negocio. Hay en varios colores.', ficha: ['8 dígitos', 'Funciona con pila AAA', 'Colores: azul, rosa y naranja'], claves: ['calculadora', 'libreria', 'escolar', 'pila', 'azul', 'rosa', 'naranja', 'colores'] },
  { id: 'sopapa', codigo: 'MB-301', rango: 2, cat: 'limpieza', nombre: 'Sopapa negra reforzada', pres: 'unidad', presTexto: 'Unidad', precio: 3900, descuento: 0, img: 'images/p-sopapa.webp', fotos: ['images/b-sopapas.webp', 'images/e-sopapa.webp'], alt: 'Dos sopapas de goma negra con mango de madera sobre un piso gris', desc: 'Goma negra reforzada, más fuerte y duradera. Destapa baño, pileta y cocina. Mayor fuerza de succión y buen sellado. Ideal para el hogar.', ficha: ['Goma negra reforzada', 'Para baño, pileta y cocina', 'Mango de madera'], claves: ['sopapa', 'destapador', 'baño', 'cocina', 'pileta', 'goma', 'limpieza'] },
  { id: 'mosquitos', codigo: 'MB-501', rango: 3, cat: 'varios', nombre: 'Aparato eléctrico para mosquitos x 5', pres: 'pack', presTexto: 'Pack x 5', precio: 9900, descuento: 10, etiqueta: 'Oferta', img: 'images/p-mosquitos.webp', fotos: ['images/e-mosquitos.webp'], alt: 'Cinco aparatos eléctricos para mosquitos, tres azules y dos naranjas', desc: 'Aparatos eléctricos para mosquitos, aptos para todas las tabletas de plaza. 220 V – 5 W. Se enchufan y listo: para dormitorio, living y oficina. Vienen en pack de 5 unidades.', ficha: ['220 V – 5 W', 'Apto para todas las tabletas', 'Pack de 5 unidades'], claves: ['mosquitos', 'insectos', 'tabletas', 'enchufe', 'electrico', 'verano', 'repelente'] },
  { id: 'cesto', codigo: 'MB-101', rango: 4, cat: 'bazar', nombre: 'Cesto para basura 12 L con tapa', pres: 'unidad', presTexto: 'Unidad', precio: 6900, descuento: 0, img: 'images/p-cesto.webp', fotos: ['images/e-cesto.webp'], alt: 'Cesto de basura gris con tapa sobre una mesada de cocina', desc: 'Capacidad 12 litros. Con tapa para mantener todo higiénico. Plástico resistente y fácil de limpiar. Ideal para cocina, baño y oficina. Hay en varios colores.', ficha: ['12 litros', 'Con tapa', 'Plástico resistente'], claves: ['cesto', 'tacho', 'basura', 'residuos', 'tapa', 'cocina', 'baño', 'oficina', 'gris'] },
  { id: 'guante-moteado', codigo: 'MB-502', rango: 5, cat: 'varios', nombre: 'Guante moteado para jardinería', pres: 'par', presTexto: 'Par', precio: 1900, descuento: 0, img: 'images/p-guante-moteado.webp', fotos: ['images/e-guante-moteado.webp'], alt: 'Par de guantes blancos tejidos con puntitos azules antideslizantes', desc: 'Con puntos antideslizantes para mejor agarre. Protege las manos en tareas del jardín. Cómodo, resistente y transpirable. Ideal para jardinería, huerta y tareas generales.', ficha: ['Puntos antideslizantes', 'Tejido transpirable', 'Se vende por par'], claves: ['guante', 'guantes', 'jardin', 'jardineria', 'huerta', 'moteado', 'trabajo'] },
  { id: 'esponja-exfoliante', codigo: 'MB-302', rango: 6, cat: 'limpieza', nombre: 'Esponja exfoliante para baño', pres: 'unidad', presTexto: 'Unidad', precio: 1300, descuento: 0, img: 'images/p-esponja-exfoliante.webp', fotos: ['images/e-esponja.webp'], alt: 'Tres esponjas exfoliantes redondas, naranja, lila y crema, con cordón', desc: 'Exfolia suavemente y deja la piel suave. Hace mucha espuma con poco jabón. Con cordón para colgar y secar. Ideal para el baño diario. Hay en varios colores.', ficha: ['Con cordón para colgar', 'Mucha espuma', 'Colores surtidos'], claves: ['esponja', 'exfoliante', 'baño', 'ducha', 'cuerpo', 'higiene', 'naranja', 'lila'] },
  { id: 'guante-cuero', codigo: 'MB-503', rango: 7, cat: 'varios', nombre: 'Guante de cuero para albañilería', pres: 'par', presTexto: 'Par', precio: 5900, descuento: 0, img: 'images/p-guante-cuero.webp', fotos: ['images/e-guante-cuero.webp'], alt: 'Par de guantes de cuero gris con refuerzo marrón en la palma', desc: 'Cuero resistente para trabajos pesados. Protege manos y muñecas. Con refuerzo en la palma. Ideal para albañilería, construcción y tareas generales.', ficha: ['Cuero resistente', 'Refuerzo en la palma', 'Se vende por par'], claves: ['guante', 'guantes', 'cuero', 'albañil', 'albañileria', 'obra', 'construccion', 'trabajo'] },
  { id: 'comedero', codigo: 'MB-102', rango: 8, cat: 'bazar', nombre: 'Comedero plástico para mascotas', pres: 'unidad', presTexto: 'Unidad', precio: 2400, descuento: 0, img: 'images/p-comedero.webp', fotos: ['images/e-mascotas.webp'], alt: 'Comedero de plástico rosa para mascotas sobre fondo blanco', desc: 'Plástico resistente y fácil de limpiar. Sirve para comida y agua. Base estable que no se vuelca. Ideal para perros y gatos. Hay en varios colores.', ficha: ['Base que no se vuelca', 'Para comida o agua', 'Colores surtidos'], claves: ['comedero', 'mascotas', 'perro', 'gato', 'plato', 'rosa', 'celeste'] },
  { id: 'bebedero', codigo: 'MB-103', rango: 9, cat: 'bazar', nombre: 'Bebedero con depósito para mascotas', pres: 'unidad', presTexto: 'Unidad', precio: 8900, descuento: 0, img: 'images/p-bebedero.webp', fotos: ['images/e-mascotas.webp'], alt: 'Bebedero celeste para mascotas con depósito de agua transparente', desc: 'Bebedero de plástico con depósito de agua a la vista: el plato se va llenando a medida que la mascota toma. Para perros y gatos.', ficha: ['Depósito transparente', 'Plato celeste', 'Para perros y gatos'], claves: ['bebedero', 'agua', 'mascotas', 'perro', 'gato', 'deposito', 'celeste'] },
  { id: 'vasos', codigo: 'MB-401', rango: 10, cat: 'descartables', nombre: 'Vasos plásticos transparentes x 50', pres: 'pack', presTexto: 'Paquete x 50', precio: 2900, descuento: 0, img: 'images/p-vasos.webp', fotos: [], alt: 'Vasos descartables de plástico transparente sobre una mesa', desc: 'Vasos descartables de plástico transparente, para bebidas frías en cumpleaños, eventos y comercios. Paquete de 50 unidades.', ficha: ['Plástico transparente', 'Para bebidas frías', 'Paquete de 50'], claves: ['vasos', 'vaso', 'descartable', 'plastico', 'fiesta', 'cumpleaños', 'eventos'] },
  { id: 'platos', codigo: 'MB-402', rango: 11, cat: 'descartables', nombre: 'Platos descartables blancos x 25', pres: 'pack', presTexto: 'Paquete x 25', precio: 3400, descuento: 0, img: 'images/p-platos.webp', fotos: [], alt: 'Platos descartables blancos sobre un mantel claro', desc: 'Platos descartables blancos, livianos y firmes, para cumpleaños, eventos y comercios de comida. Paquete de 25 unidades.', ficha: ['Blancos', 'Livianos y firmes', 'Paquete de 25'], claves: ['platos', 'plato', 'descartable', 'blanco', 'fiesta', 'cumpleaños', 'eventos'] },
  { id: 'servilletas', codigo: 'MB-403', rango: 12, cat: 'descartables', nombre: 'Servilletas de papel rojas x 50', pres: 'pack', presTexto: 'Paquete x 50', precio: 1600, descuento: 0, img: 'images/p-servilletas.webp', fotos: [], alt: 'Pila de servilletas de papel rojas sobre una mesa blanca', desc: 'Servilletas de papel color rojo, dobladas en cuadrado. Para mesas de fiesta, kioscos y comercios de comida. Paquete de 50 unidades.', ficha: ['Papel color rojo', 'Dobladas en cuadrado', 'Paquete de 50'], claves: ['servilletas', 'servilleta', 'papel', 'rojo', 'descartable', 'fiesta'] },
  { id: 'cubiertos', codigo: 'MB-404', rango: 13, cat: 'descartables', nombre: 'Tenedores y cuchillos descartables x 50', pres: 'pack', presTexto: 'Paquete x 50', precio: 2500, descuento: 0, img: 'images/p-cubiertos.webp', fotos: [], alt: 'Montón de tenedores y cuchillos de plástico color terracota', desc: 'Tenedores y cuchillos de plástico para eventos, viandas y comercios de comida. Paquete de 50 unidades surtidas.', ficha: ['Plástico rígido', 'Tenedores y cuchillos', 'Paquete de 50'], claves: ['cubiertos', 'tenedores', 'cuchillos', 'descartable', 'plastico', 'viandas'] },
  { id: 'cuadernos', codigo: 'MB-202', rango: 14, cat: 'libreria', nombre: 'Cuaderno con espiral', pres: 'unidad', presTexto: 'Unidad', precio: 3200, descuento: 0, img: 'images/p-cuadernos.webp', fotos: [], alt: 'Pila de cuadernos con espiral de tapas de colores', desc: 'Cuaderno con espiral, hojas rayadas y tapas de colores surtidos. Para escuela y oficina.', ficha: ['Espiral', 'Hojas rayadas', 'Tapas surtidas'], claves: ['cuaderno', 'cuadernos', 'espiral', 'escolar', 'libreria', 'hojas', 'rayado'] },
  { id: 'lapiceras', codigo: 'MB-203', rango: 15, cat: 'libreria', nombre: 'Bolígrafos de colores x 3', pres: 'pack', presTexto: 'Pack x 3', precio: 1800, descuento: 0, img: 'images/p-lapiceras.webp', fotos: [], alt: 'Tres bolígrafos de colores amarillo, rosa y verde sobre papel blanco', desc: 'Bolígrafos de trazo fino en colores surtidos. Vienen de a tres.', ficha: ['Trazo fino', 'Colores surtidos', 'Pack de 3'], claves: ['boligrafos', 'lapiceras', 'birome', 'lapicera', 'escolar', 'libreria', 'colores'] },
  { id: 'esponja-cocina', codigo: 'MB-303', rango: 16, cat: 'limpieza', nombre: 'Esponja doble faz para cocina x 2', pres: 'pack', presTexto: 'Pack x 2', precio: 1100, descuento: 0, img: 'images/p-esponja-cocina.webp', fotos: [], alt: 'Dos esponjas de cocina rojas y amarillas sobre mármol blanco', desc: 'Esponja de cocina con una cara suave y otra abrasiva, para vajilla y ollas. Vienen de a dos.', ficha: ['Doble faz', 'Para vajilla y ollas', 'Pack de 2'], claves: ['esponja', 'cocina', 'vajilla', 'platos', 'limpieza', 'abrasiva'] },
  { id: 'prueba-oculto', codigo: 'MB-999', rango: 99, cat: 'bazar', nombre: 'Producto de prueba', pres: 'unidad', presTexto: 'Unidad', precio: 1000, descuento: 0, visible: false, img: 'images/p-cesto.webp', fotos: [], alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.codigo, p.desc, p.presTexto, catDe(p.cat).nombre, catDe(p.cat).bajada, nombreDe(PRESENTACIONES, p.pres), ...(p.ficha || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), pres = lista(f.pres), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (pres.length && !pres.includes(p.pres)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && texto.includes(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const compartirHref = msg => `https://wa.me/?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n.toLocaleString('es-AR')} ${n === 1 ? uno : varios}`;
const citar = n => (String(n).includes('«') ? n : `«${n}»`);
const cantidad = v => Math.max(1, Math.min(parseInt(v, 10) || 1, TOPE_LINEA));

const Cart = {
  KEY: 'megabazar_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = cantidad(qty);
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = cantidad(qty);
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const qty = cantidad(i.qty);
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

const Datos = {
  KEY: 'megabazar_datos',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return v && typeof v === 'object' ? v : {}; } catch { return {}; } },
  save(d) { try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('datos:updated')); },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  compartir: SVG('<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  rayos: '<svg class="rayos" viewBox="0 0 32 32" aria-hidden="true"><path d="M10 26L3 30"/><path d="M11 18L2 17"/><path d="M16 11L12 3"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['pres', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span><b>${esc(c.nombre)}</b><small>${esc(`${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')} · ${c.bajada}`)}</small></span></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}


const stepperHTML = (nombre, n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${TOPE_LINEA}" value="${n}" data-qty aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;
const presCorta = p => (p.pres === 'unidad' ? 'c/u' : p.pres === 'par' ? 'el par' : p.presTexto.toLowerCase());

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  subir24: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(48px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(16px) scale(.92)"',
  no: '',
};
const badgeHTML = p => (p.etiqueta ? `<span class="prod__badge${p.descuento > 0 ? ' prod__badge--oferta' : ''}">${esc(p.etiqueta)}${p.descuento > 0 ? ` -${p.descuento}%` : ''}</span>` : '');
const agregarBtn = (p, texto = 'Agregar') => `<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al pedido">${ICO.carrito}<span>${texto}</span></button>`;

function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></button>${badgeHTML(p)}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(`${catDe(p.cat).nombre} · ${p.presTexto}`)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions">${stepperHTML(p.nombre)}${agregarBtn(p)}</div>
    <button type="button" class="prod__ya" data-pedir="${esc(p.id)}">Pedir ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function fichaHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="ficha" data-id="${esc(p.id)}"${a}>
  <div class="ficha__media"><button type="button" class="ficha__img" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></button>${badgeHTML(p)}</div>
  <div class="ficha__info">
    <p class="ficha__cod">${esc(`${p.codigo} · ${p.presTexto}`)}</p>
    <h3 class="ficha__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions">${stepperHTML(p.nombre)}${agregarBtn(p)}</div>
  </div>
</article>`;
}

function filaHTML(p, { anim = 'subir24' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir24;
  return `<article class="fila" data-id="${esc(p.id)}"${a}>
  <button type="button" class="fila__img" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></button>
  <div class="fila__info">
    <h3 class="fila__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button>${p.descuento > 0 ? `<span class="fila__oferta">-${p.descuento}%</span>` : ''}</h3>
    <p class="fila__det"><span>${esc(p.codigo)}</span> · ${esc(p.presTexto)}</p>
  </div>
  <p class="fila__precio"><span class="fila__punteado" aria-hidden="true"></span><b>${formatearPrecio(precioFinal(p))}</b><small>${esc(presCorta(p))}</small></p>
  <div class="prod-actions fila__acc">${stepperHTML(p.nombre)}${agregarBtn(p, 'Sumar')}</div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  const t = Cart.total();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n > 999 ? '999+' : n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = n ? formatearPrecio(t) : 'vacío'; });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir mi pedido: ${plural(n, 'artículo', 'artículos')}, ${formatearPrecio(t)}` : 'Abrir mi pedido'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido(d = Datos.get()) {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `• ${i.qty} × ${p.nombre} (${p.presTexto.toLowerCase()}) — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const partes = [`Hola! Quiero hacer este pedido a ${MARCA}:`, ...lineas, `Total: ${formatearPrecio(Cart.total())} (${plural(Cart.count(), 'artículo', 'artículos')})`];
  if (d.nombre) partes.push(`Nombre o comercio: ${d.nombre}`);
  if (d.entrega === 'retiro') partes.push('Entrega: lo retiro por Av. Neuquén');
  else partes.push(`Entrega: delivery${d.direccion ? ` a ${d.direccion}` : ''}`);
  if (d.comentario) partes.push(`Comentario: ${d.comentario}`);
  return partes.join('\n');
}

function lineaHTML(i, suf) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea">
  <img src="${esc(p.img)}" alt="" width="800" height="800">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(`${p.presTexto} · ${formatearPrecio(precioFinal(p))} ${presCorta(p)}`)}</p>
    <div class="linea__fila">
      <div class="stepper stepper--chico"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${TOPE_LINEA}" value="${i.qty}" data-linea-qty="${id}" id="q-${suf}-${id}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${id}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
}

const fechaHoy = () => new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

function initNotas() {
  const notas = [...document.querySelectorAll('[data-nota]')];
  if (!notas.length) return;
  const leer = form => {
    const fd = new FormData(form);
    return { nombre: String(fd.get('nombre') || '').trim().slice(0, 80), entrega: fd.get('entrega') === 'retiro' ? 'retiro' : 'delivery', direccion: String(fd.get('direccion') || '').trim().slice(0, 120), comentario: String(fd.get('comentario') || '').trim().slice(0, 240) };
  };
  const llenar = (form, d) => {
    ['nombre', 'direccion', 'comentario'].forEach(k => { const el = form.elements[k]; if (el && el !== document.activeElement) el.value = d[k] || ''; });
    const ent = d.entrega === 'retiro' ? 'retiro' : 'delivery';
    form.querySelectorAll('input[name="entrega"]').forEach(r => { r.checked = r.value === ent; });
    const dir = form.querySelector('[data-campo-dir]');
    if (dir) dir.hidden = ent === 'retiro';
  };
  const pintar = nota => {
    const suf = nota.dataset.nota;
    const items = Cart.get();
    const n = Cart.count();
    const lista = nota.querySelector('[data-nota-lineas]');
    const activo = document.activeElement;
    const enfocado = activo && lista.contains(activo) ? (activo.dataset.lineaQty ? `[data-linea-qty="${activo.dataset.lineaQty}"]` : activo.dataset.lineaPaso ? `[data-linea-paso="${activo.dataset.lineaPaso}"][data-k="${activo.dataset.k}"]` : '') : '';
    lista.innerHTML = items.map(i => lineaHTML(i, suf)).join('');
    lista.hidden = !items.length;
    nota.querySelector('[data-nota-vacio]').hidden = items.length > 0;
    nota.querySelectorAll('[data-nota-lleno]').forEach(el => { el.hidden = !items.length; });
    nota.querySelector('[data-nota-total]').textContent = formatearPrecio(Cart.total());
    nota.querySelector('[data-nota-n]').textContent = n ? plural(n, 'artículo', 'artículos') : 'sin productos';
    const enviar = nota.querySelector('[data-nota-enviar]');
    if (enviar) enviar.href = wspHref(textoPedido());
    if (enfocado) { const el = lista.querySelector(enfocado); if (el && !el.disabled) el.focus(); else nota.querySelector('[data-nota-titulo]')?.focus(); }
  };
  notas.forEach(nota => {
    const form = nota.querySelector('[data-nota-form]');
    const fecha = nota.querySelector('[data-nota-fecha]');
    if (fecha) fecha.textContent = fechaHoy();
    llenar(form, Datos.get());
    form.addEventListener('input', () => {
      const d = leer(form);
      const dir = form.querySelector('[data-campo-dir]');
      if (dir) dir.hidden = d.entrega === 'retiro';
      nota.querySelector('[data-nota-error]').hidden = true;
      form.elements.direccion?.removeAttribute('aria-invalid');
      Datos.save(d);
    });
    form.addEventListener('submit', e => { e.preventDefault(); nota.querySelector('[data-nota-enviar]')?.click(); });
    nota.addEventListener('click', e => {
      const paso = e.target.closest('[data-linea-paso]');
      if (paso) {
        const it = Cart.get().find(x => x.id === paso.dataset.k);
        if (it) Cart.setQty(it.id, it.qty + Number(paso.dataset.lineaPaso));
        return;
      }
      const q = e.target.closest('[data-quitar]');
      if (q) {
        const p = getProducto(q.dataset.quitar);
        Cart.remove(q.dataset.quitar);
        if (p) showToast(`Sacaste ${citar(p.nombre)} del pedido`);
        nota.querySelector('[data-nota-titulo]')?.focus();
        return;
      }
      const enviar = e.target.closest('[data-nota-enviar]');
      if (!enviar) return;
      const d = leer(form);
      if (!Cart.count()) { e.preventDefault(); showToast('Sumá al menos un producto para mandar el pedido'); return; }
      if (d.entrega === 'delivery' && !d.direccion) {
        e.preventDefault();
        const err = nota.querySelector('[data-nota-error]');
        err.hidden = false;
        form.elements.direccion.setAttribute('aria-invalid', 'true');
        form.elements.direccion.focus();
        return;
      }
      enviar.href = wspHref(textoPedido(d));
      showToast('Abrimos WhatsApp con tu pedido: revisalo y tocá enviar');
    });
    nota.addEventListener('change', e => {
      const inp = e.target.closest('[data-linea-qty]');
      if (inp) Cart.setQty(inp.dataset.lineaQty, inp.value);
    });
    pintar(nota);
  });
  document.addEventListener('cart:updated', () => notas.forEach(pintar));
  document.addEventListener('datos:updated', () => notas.forEach(nota => {
    llenar(nota.querySelector('[data-nota-form]'), Datos.get());
    const enviar = nota.querySelector('[data-nota-enviar]');
    if (enviar) enviar.href = wspHref(textoPedido());
  }));
}

function initResumen() {
  const box = document.querySelector('[data-resumen]');
  if (!box) return;
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    box.querySelector('[data-resumen-n]').textContent = n ? plural(n, 'artículo', 'artículos') : '';
    box.querySelector('[data-resumen-vacio]').hidden = items.length > 0;
    const ul = box.querySelector('[data-resumen-lineas]');
    ul.hidden = !items.length;
    const vis = items.slice(-4).reverse();
    ul.innerHTML = vis.map(i => { const p = getProducto(i.id); return p ? `<li><span>${i.qty} ×</span><b>${esc(p.nombre)}</b><output>${formatearPrecio(precioFinal(p) * i.qty)}</output></li>` : ''; }).join('') + (items.length > vis.length ? `<li class="resumen__mas">y ${plural(items.length - vis.length, 'producto más', 'productos más')}</li>` : '');
    const tot = box.querySelector('[data-resumen-total]');
    tot.hidden = !items.length;
    tot.querySelector('output').textContent = formatearPrecio(Cart.total());
  };
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  window.abrirCarrito = previo => { abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
}

function avisoSumado(p, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${citar(p.nombre)} al pedido`);
  else showToast(`Ya tenés ${TOPE_LINEA} de ${citar(p.nombre)} en el pedido`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const qtyDe = cont => cantidad(cont?.querySelector('[data-qty]')?.value);
const resetQty = cont => { const i = cont?.querySelector('[data-qty]'); if (i) i.value = '1'; };

function initCompras() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const inp = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (inp) inp.value = cantidad((parseInt(inp.value, 10) || 1) + Number(paso.dataset.paso));
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      const cont = ag.closest('[data-id], .qv__grid');
      avisoSumado(p, Cart.add(p, qtyDe(cont)));
      resetQty(cont);
      bump(ag);
      return;
    }
    const pd = e.target.closest('[data-pedir]');
    if (pd) {
      const p = getProducto(pd.dataset.pedir);
      if (!p) return;
      const cont = pd.closest('[data-id], .qv__grid');
      Cart.add(p, qtyDe(cont));
      resetQty(cont);
      if (pd.closest('#quickView')) { const capa = cerrarCapa(document.getElementById('quickView'), { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); } else window.abrirCarrito?.(pd);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-qty]');
    if (inp) inp.value = cantidad(inp.value);
  });
  document.addEventListener('keydown', e => {
    const inp = e.target.closest?.('[data-qty]');
    if (inp && e.key === 'Enter') { e.preventDefault(); inp.closest('[data-id], .qv__grid')?.querySelector('[data-agregar]')?.click(); }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
const urlProducto = p => `${location.origin}${location.pathname.replace(/[^/]*$/, '')}${CATALOGO_URL}?producto=${p.id}`;
function qvHTML(p) {
  const rel = relacionados(p);
  const fotos = [p.img, ...(p.fotos || [])];
  const thumbs = fotos.length > 1 ? `<div class="qv__thumbs" role="group" aria-label="Fotos de ${esc(p.nombre)}">${fotos.map((f, k) => `<button type="button" class="qv__thumb" data-qv-foto="${esc(f)}" aria-pressed="${k === 0}" aria-label="Ver la foto ${k + 1}"><img src="${esc(f)}" alt="" width="120" height="120"></button>`).join('')}</div>` : '';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></figure>
    ${thumbs}
    <p class="qv__nota-foto">${fotos.some(f => f.includes('/e-')) ? 'Incluye la placa que usamos en los estados de WhatsApp.' : 'Foto ilustrativa del producto.'}</p>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(`${catDe(p.cat).nombre} · Código ${p.codigo}`)}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__pres">Presentación: <b>${esc(p.presTexto)}</b></p>
    <div class="qv__acciones">${stepperHTML(p.nombre)}${agregarBtn(p, 'Agregar al pedido')}</div>
    <button type="button" class="btn btn--ghost btn--block" data-pedir="${esc(p.id)}">Agregar y ver mi pedido ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <div class="qv__links">
      <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre ${citar(p.nombre)} (${p.codigo}).`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
      <a class="qv__compartir" href="${esc(compartirHref(`${p.nombre} en ${MARCA}: ${urlProducto(p)}`))}" target="_blank" rel="noopener">${ICO.compartir}<span>Compartir este producto</span></a>
    </div>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede servir</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="800" height="800"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      const img = modal.querySelector('[data-qv-img]');
      img.src = foto.dataset.qvFoto;
      modal.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.codigo,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

function initFichas() {
  const cont = document.querySelector('[data-fichas]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 6 }).items.map(p => fichaHTML(p)).join('');
}
function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const primera = Tienda.consultar({ limite: 6 });
  const res = Tienda.consultar({ cursor: primera.items[primera.items.length - 1]?.id, limite: 7 });
  const n = Tienda.contar({});
  cont.innerHTML = res.items.map(p => cardHTML(p)).join('')
    + `<a class="previa__todo" href="${CATALOGO_URL}"${ANIMS.subir}>${ICO.rayos}<span class="previa__n">${n}</span><b>productos en el catálogo</b><small>Buscá por nombre, código o rubro.</small><em>Ver todo el catálogo ${ICO.flecha}</em></a>`;
}

const desdeDe = filtros => {
  const r = Tienda.consultar({ filtros, orden: 'precio-asc', limite: 1 }).items[0];
  return r ? formatearPrecio(precioFinal(r)) : '';
};
function initCategorias() {
  const circ = document.querySelector('[data-cats-circ]');
  if (!circ) return;
  circ.innerHTML = CATEGORIAS.map(c => `<li class="circ"${ANIMS.escala}><a href="${CATALOGO_URL}?cat=${c.id}"><span class="circ__foto"><img src="${esc(c.img)}" alt="" width="800" height="800"></span><b>${esc(c.nombre)}</b><small>${esc(plural(Tienda.contar({ cat: c.id }), 'producto', 'productos'))}</small></a></li>`).join('');
}

function initLista() {
  const tabs = document.querySelector('[data-tabs]');
  const lista = document.querySelector('[data-lista]');
  if (!tabs || !lista) return;
  const link = document.querySelector('[data-lista-link]');
  let actual = '';
  tabs.innerHTML = `<button type="button" class="tab" data-tab="" aria-pressed="true">Todo<small>${Tienda.contar({})}</small></button>`
    + CATEGORIAS.map(c => `<button type="button" class="tab" data-tab="${c.id}" aria-pressed="false">${esc(c.nombre)}<small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  const pintar = (primera = false) => {
    const f = actual ? { cat: actual } : {};
    lista.innerHTML = Tienda.consultar({ filtros: f, limite: 8 }).items.map(p => filaHTML(p)).join('');
    const n = Tienda.contar(f);
    if (link) {
      link.href = actual ? `${CATALOGO_URL}?cat=${actual}` : CATALOGO_URL;
      link.querySelector('span').textContent = actual ? `Ver ${n === 1 ? 'el producto' : `los ${n} productos`} de ${catDe(actual).nombre} en la lista completa` : `Ver la lista completa: ${n} productos`;
    }
    tabs.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab === actual)));
    if (!primera) { revelarNuevos(lista); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b || b.dataset.tab === actual) return;
    actual = b.dataset.tab;
    pintar();
  });
  pintar(true);
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const tabs = document.querySelector('[data-cat-tabs]');
  const enLista = MODELO === '2';
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, pres: PRESENTACIONES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    pres: valida(params.get('pres'), PRESENTACIONES),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (tabs && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    if (tabs) {
      const sinCat = filtros('cat');
      tabs.innerHTML = `<button type="button" class="tab" data-cat-tab="" aria-pressed="${!e.cat.length}">Todo<small>${Tienda.contar(sinCat)}</small></button>`
        + CATEGORIAS.map(c => `<button type="button" class="tab" data-cat-tab="${c.id}" aria-pressed="${e.cat[0] === c.id}">${esc(c.nombre)}<small>${Tienda.contar({ ...sinCat, cat: c.id })}</small></button>`).join('');
    }
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('pres')) return PRESENTACIONES.find(x => x.id === e.pres[0])?.nombre || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (tabs && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    const base = enLista ? 'Lista de precios' : 'Todo el catálogo';
    if (titulo) titulo.textContent = t || base;
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || (enLista ? 'Lista de precios' : 'Catálogo')} — ${MARCA}`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => (enLista ? filaHTML(p) : cardHTML(p))).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  tabs?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-cat-tab]');
    if (!b) return;
    e.cat = b.dataset.catTab ? [b.dataset.catTab] : [];
    aplicar();
    tabs.querySelector(`[data-cat-tab="${b.dataset.catTab}"]`)?.focus();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
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
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}
function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
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


function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desdeA('.banner__franjas', { xPercent: 30, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0);
  desdeA('.banner__media figure', { y: 40, opacity: 0, duration: 1.2, stagger: 0.14, clearProps: 'transform,opacity' }, 0.05);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.12);
  desdeA('h1', { y: 38, opacity: 0, filter: 'blur(8px)', duration: 1.15, clearProps: 'filter' }, 0.2);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  desdeA('.hero__dato', { y: 14, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.72);
  desdeA('.hero__sello', { y: 14, scale: 0.92, rotate: -10, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.7);
  desdeA('.hero .rayos path', { scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.08, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.banner__alta img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initFichas, initPrevia, initCategorias, initLista, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initNotas, initResumen, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
