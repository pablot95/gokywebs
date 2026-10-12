const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5492216179696';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

const CATEGORIAS = [
  { id: 'organizacion', nombre: 'Organizadores', titulo: 'Cada cosa en su lugar', frase: 'Cajas, canastos y joyeros para ordenar la casa.', escena: 'decoracion-hogar', mini: 'p-caja-lino' },
  { id: 'bazar', nombre: 'Bazar y cocina', titulo: 'Bazar para todos los días', frase: 'Frascos, tazas, bandejas y utensilios.', escena: 'bazar-cocina', mini: 'p-tazas-ceramica' },
  { id: 'deco', nombre: 'Deco', titulo: 'Detalles que cambian un ambiente', frase: 'Floreros, velas, mantas y lámparas en blanco, negro y natural.', escena: 'banner-organizacion', mini: 'p-florero-ceramica' },
  { id: 'viaje', nombre: 'Mochilas y viaje', titulo: 'Viajá liviano', frase: 'Mochilas, cubos organizadores, neceseres y todo lo que va en la valija.', escena: 'portada-viajes', mini: 'p-mochila-urbana' },
  { id: 'vs', nombre: "Victoria's Secret", titulo: 'Fragancias y accesorios', frase: "Body mist, cremas, perfumes y accesorios de la línea Victoria's Secret.", escena: 'belleza', mini: 'p-body-mist' },
];

const TONOS = [
  { id: 'negro', nombre: 'Negro' },
  { id: 'blanco', nombre: 'Blanco y crudo' },
  { id: 'natural', nombre: 'Natural y madera' },
  { id: 'rosa', nombre: 'Rosa' },
];

const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: 0, max: 10000 },
  { id: '10a25', nombre: '$10.000 a $25.000', min: 10000, max: 25000 },
  { id: '25a50', nombre: '$25.000 a $50.000', min: 25000, max: 50000 },
  { id: 'mas50', nombre: 'Más de $50.000', min: 50000, max: Infinity },
];

const PRODUCTOS = [
  { id: 'caja-lino', nombre: 'Caja organizadora de lino con tapa', cat: 'organizacion', precio: 18900, descuento: 0, stock: 12, tono: 'natural', escena: 'decoracion-hogar', destacado: true, desc: 'Caja rígida forrada en tela símil lino, con tapa y portaetiqueta metálico. Sirve para el placard, los estantes o debajo de la cama.', tags: ['caja', 'placard', 'guardado', 'orden'] },
  { id: 'cajas-forradas', nombre: 'Set de 2 cajas forradas negra y lino', cat: 'organizacion', precio: 24500, descuento: 0, stock: 8, tono: 'negro', escena: 'banner-organizacion', nuevo: true, desc: 'Dos cajas apilables con tapa, una negra y una en tono lino, para ordenar papeles, cables o accesorios a la vista.', tags: ['caja', 'apilable', 'escritorio', 'orden'] },
  { id: 'canastos-rect', nombre: 'Canasto organizador de fibra rectangular', cat: 'organizacion', precio: 21900, descuento: 0, stock: 10, tono: 'natural', escena: 'banner-organizacion', desc: 'Canasto tejido en fibra natural con agarraderas caladas. Entra justo en estantes y bibliotecas.', tags: ['canasto', 'estante', 'fibra', 'mimbre'] },
  { id: 'canasto-bicolor', nombre: 'Canasto de fibra bicolor con asas', cat: 'organizacion', precio: 32900, descuento: 10, stock: 6, tono: 'natural', escena: 'decoracion-hogar', destacado: true, desc: 'Canasto alto de fibra trenzada con base negra y asas. Para mantas, juguetes o la ropa para lavar.', tags: ['canasto', 'cesto', 'fibra', 'mimbre', 'ropa'] },
  { id: 'joyero', nombre: 'Joyero de viaje de terciopelo', cat: 'organizacion', precio: 15900, descuento: 0, stock: 3, tono: 'negro', escena: 'belleza', desc: 'Estuche rígido de terciopelo negro con cierre dorado. Guarda anillos, aros y cadenitas sin que se enreden.', tags: ['joyas', 'joyero', 'estuche', 'viaje'] },

  { id: 'frascos-bambu', nombre: 'Frasco hermético de vidrio con tapa de bambú', cat: 'bazar', precio: 9900, descuento: 0, stock: 24, tono: 'natural', escena: 'bazar-cocina', nuevo: true, desc: 'Frasco de vidrio con tapa de bambú y burlete. Para café, avena, legumbres o frutos secos.', tags: ['frasco', 'vidrio', 'alacena', 'cocina'] },
  { id: 'tazas-ceramica', nombre: 'Set de 2 tazas de cerámica pintadas', cat: 'bazar', precio: 16900, descuento: 10, stock: 9, tono: 'blanco', escena: 'bazar-cocina', destacado: true, desc: 'Una taza a rayas y otra a lunares, en cerámica blanca con borde negro.', tags: ['taza', 'mug', 'desayuno', 'cerámica'] },
  { id: 'bandeja-madera', nombre: 'Bandeja de madera con asas de hierro', cat: 'bazar', precio: 27900, descuento: 0, stock: 7, tono: 'natural', escena: 'bazar-cocina', nuevo: true, desc: 'Bandeja rectangular de madera con marco y asas de hierro negro. Para desayunos, la mesa ratona o el baño.', tags: ['bandeja', 'desayuno', 'madera'] },
  { id: 'utensilios-silicona', nombre: 'Set de utensilios de silicona y madera', cat: 'bazar', precio: 19900, descuento: 0, stock: 14, tono: 'negro', escena: 'bazar-cocina', desc: 'Cuchara, espátula calada y cuchara para pastas en silicona negra con mango de madera, con su porta utensilios de cerámica.', tags: ['utensilios', 'cocina', 'espátula', 'silicona'] },
  { id: 'bowl-negro', nombre: 'Bowl de cerámica negro mate', cat: 'bazar', precio: 7900, descuento: 0, stock: 20, tono: 'negro', escena: 'bazar-cocina', desc: 'Bowl chico de cerámica con terminación mate. Para snacks, salsas o frutos secos.', tags: ['bowl', 'compotera', 'cerámica', 'cocina'] },
  { id: 'pote-ceramica', nombre: 'Pote de cerámica con tapa de bambú', cat: 'bazar', precio: 11900, descuento: 0, stock: 2, tono: 'blanco', escena: 'bazar-cocina', desc: 'Pote blanco con tapa de bambú para azúcar, yerba o sal.', tags: ['pote', 'azucarera', 'yerbera', 'cocina'] },

  { id: 'florero-ceramica', nombre: 'Florero de cerámica arena', cat: 'deco', precio: 17900, descuento: 0, stock: 11, tono: 'blanco', escena: 'decoracion-hogar', destacado: true, desc: 'Florero de cerámica con terminación arenada, ideal para ramas secas o eucalipto.', tags: ['florero', 'jarrón', 'cerámica', 'living'] },
  { id: 'florero-acanalado', nombre: 'Florero acanalado negro', cat: 'deco', precio: 15900, descuento: 0, stock: 8, tono: 'negro', escena: 'banner-organizacion', desc: 'Florero alto con textura acanalada en negro mate.', tags: ['florero', 'jarrón', 'living'] },
  { id: 'vela-vaso', nombre: 'Vela aromática en vaso de vidrio', cat: 'deco', precio: 8900, descuento: 0, stock: 30, tono: 'blanco', escena: 'decoracion-hogar', desc: 'Vela de cera en vaso de vidrio transparente, de aroma suave, para el living o el dormitorio.', tags: ['vela', 'aroma', 'regalo'] },
  { id: 'bandeja-redonda', nombre: 'Bandeja redonda de metal negro', cat: 'deco', precio: 19900, descuento: 0, stock: 9, tono: 'negro', escena: 'decoracion-hogar', desc: 'Bandeja de metal con borde alto y asas caladas. Ordena velas, llaves o perfumes sobre una mesa o una cómoda.', tags: ['bandeja', 'metal', 'mesa'] },
  { id: 'manta-rayada', nombre: 'Manta tejida a rayas', cat: 'deco', precio: 29900, descuento: 20, stock: 5, tono: 'blanco', escena: 'decoracion-hogar', nuevo: true, desc: 'Manta de algodón tejido, cruda con rayas negras, para el sillón o los pies de la cama.', tags: ['manta', 'pie de cama', 'sillón', 'textil'] },
  { id: 'lampara-mesa', nombre: 'Lámpara de mesa hongo negra', cat: 'deco', precio: 45900, descuento: 0, stock: 4, tono: 'negro', escena: 'banner-organizacion', nuevo: true, desc: 'Lámpara de mesa con pantalla tipo hongo en metal negro. Luz cálida para la mesa de luz o el escritorio.', tags: ['lámpara', 'velador', 'luz', 'escritorio'] },
  { id: 'vela-labrada', nombre: 'Vela en vaso labrado rosa', cat: 'deco', precio: 12900, descuento: 0, stock: 0, tono: 'rosa', escena: 'belleza', desc: 'Vela en vaso de vidrio rosa con relieve de rombos.', tags: ['vela', 'aroma', 'regalo'] },

  { id: 'mochila-urbana', nombre: 'Mochila urbana con compartimento para notebook', cat: 'viaje', precio: 64900, descuento: 0, stock: 8, tono: 'negro', escena: 'portada-viajes', destacado: true, portada: true, desc: 'Mochila negra con bolsillo frontal con cierre, laterales con hebillas y compartimento acolchado para la notebook. Para la facu, el trabajo o un viaje corto.', tags: ['mochila', 'notebook', 'facultad', 'urbana'] },
  { id: 'bolso-duffel', nombre: 'Bolso de viaje duffel negro', cat: 'viaje', precio: 54900, descuento: 0, stock: 6, tono: 'negro', escena: 'accesorios-viaje', destacado: true, desc: 'Bolso amplio con manijas, correa regulable y bolsillo frontal con cierre. Para escapadas de fin de semana o el gimnasio.', tags: ['bolso', 'duffel', 'gimnasio', 'escapada'] },
  { id: 'set-cubos', nombre: 'Set de 3 cubos organizadores de valija', cat: 'viaje', precio: 28900, descuento: 15, stock: 15, tono: 'negro', escena: 'accesorios-viaje', destacado: true, desc: 'Tres cubos de distintos tamaños con frente de red y doble cierre. Separan la ropa y aprovechan cada rincón de la valija.', tags: ['cubos', 'organizador', 'valija', 'packing'] },
  { id: 'organizadores-valija', nombre: 'Organizadores de valija con frente de red x2', cat: 'viaje', precio: 21900, descuento: 0, stock: 10, tono: 'negro', escena: 'portada-viajes', desc: 'Dos organizadores con frente de red para ver qué hay adentro sin abrirlos.', tags: ['organizador', 'valija', 'packing', 'red'] },
  { id: 'neceser-organizador', nombre: 'Organizador de cosméticos con frascos de viaje', cat: 'viaje', precio: 18900, descuento: 0, stock: 7, tono: 'negro', escena: 'accesorios-viaje', desc: 'Estuche con tapa de red y elásticos internos, con frascos rellenables para shampoo, crema y perfume.', tags: ['neceser', 'frascos', 'cosméticos', 'viaje'] },
  { id: 'neceser-negro', nombre: 'Neceser de viaje negro', cat: 'viaje', precio: 13900, descuento: 0, stock: 12, tono: 'negro', escena: 'accesorios-viaje', desc: 'Neceser de tela con cierre y manija lateral para el cepillo, el desodorante y lo de todos los días.', tags: ['neceser', 'baño', 'viaje'] },
  { id: 'almohada-viaje', nombre: 'Almohada de viaje viscoelástica', cat: 'viaje', precio: 16900, descuento: 0, stock: 9, tono: 'negro', escena: 'portada-viajes', nuevo: true, desc: 'Almohada cervical de espuma viscoelástica con funda suave y broche. Para el micro, el avión o el auto.', tags: ['almohada', 'cervical', 'avión', 'micro'] },
  { id: 'antifaz-negro', nombre: 'Antifaz para dormir', cat: 'viaje', precio: 5900, descuento: 0, stock: 25, tono: 'negro', escena: 'accesorios-viaje', desc: 'Antifaz negro con elástico regulable para dormir en viajes largos.', tags: ['antifaz', 'dormir', 'avión'] },
  { id: 'etiquetas-valija', nombre: 'Etiquetas para valija x2', cat: 'viaje', precio: 7900, descuento: 0, stock: 18, tono: 'negro', escena: 'accesorios-viaje', desc: 'Dos etiquetas de cuero sintético con correa y hebilla, para reconocer tu valija en la cinta.', tags: ['etiqueta', 'valija', 'equipaje'] },
  { id: 'porta-pasaporte', nombre: 'Porta pasaporte de cuero sintético', cat: 'viaje', precio: 12900, descuento: 0, stock: 0, tono: 'negro', escena: 'portada-viajes', desc: 'Funda negra para el pasaporte y la tarjeta de embarque.', tags: ['pasaporte', 'documentos', 'viaje'] },
  { id: 'botella-termica', nombre: 'Botella térmica de acero 750 ml', cat: 'viaje', precio: 22900, descuento: 0, stock: 13, tono: 'negro', escena: 'portada-viajes', desc: 'Botella de acero inoxidable negro mate con tapa a rosca.', tags: ['botella', 'térmica', 'agua', 'acero'] },

  { id: 'neceser-rosa', nombre: "Neceser acolchado rosa Victoria's Secret", cat: 'vs', marca: "Victoria's Secret", precio: 39900, descuento: 0, stock: 5, tono: 'rosa', escena: 'belleza', nuevo: true, desc: 'Neceser grande acolchado en rosa con detalles negros y cierre dorado.', tags: ['neceser', 'cosmetiquero', 'regalo'] },
  { id: 'body-mist', nombre: "Body mist Victoria's Secret 250 ml", cat: 'vs', marca: "Victoria's Secret", precio: 36900, descuento: 0, stock: 10, tono: 'rosa', escena: 'belleza', destacado: true, desc: 'Bruma corporal perfumada para usar durante el día. Consultanos por WhatsApp las fragancias disponibles.', tags: ['body mist', 'bruma', 'fragancia', 'perfume'] },
  { id: 'locion-corporal', nombre: "Loción corporal Victoria's Secret 236 ml", cat: 'vs', marca: "Victoria's Secret", precio: 34900, descuento: 0, stock: 8, tono: 'rosa', escena: 'belleza', desc: 'Loción hidratante perfumada para el cuerpo.', tags: ['crema', 'loción', 'hidratante'] },
  { id: 'eau-parfum', nombre: "Eau de parfum Victoria's Secret 50 ml", cat: 'vs', marca: "Victoria's Secret", precio: 89900, descuento: 0, stock: 3, tono: 'rosa', escena: 'belleza', nuevo: true, desc: 'Perfume en frasco de vidrio facetado. Consultanos por WhatsApp las fragancias disponibles.', tags: ['perfume', 'fragancia', 'regalo'] },
  { id: 'crema-pomo', nombre: "Crema corporal en pomo Victoria's Secret", cat: 'vs', marca: "Victoria's Secret", precio: 24900, descuento: 0, stock: 9, tono: 'rosa', escena: 'belleza', desc: 'Crema corporal en pomo, práctica para llevar en la cartera.', tags: ['crema', 'manos', 'cuerpo'] },
  { id: 'scrunchie', nombre: 'Scrunchie de satén rosa', cat: 'vs', precio: 6900, descuento: 0, stock: 20, tono: 'rosa', escena: 'belleza', desc: 'Colita de satén que no marca el pelo.', tags: ['scrunchie', 'colita', 'pelo', 'accesorio'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const imgProducto = p => `images/p-${p.id}.webp`;

const Cart = {
  KEY: 'conondaurbana_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const LIMITE_SERVIDOR = 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function coincide(p, f) {
  if (p.visible === false) return false;
  if (f.destacado && !p.destacado) return false;
  if (f.nuevo && !p.nuevo) return false;
  if (f.cat?.length && !f.cat.includes(p.cat)) return false;
  if (f.tono?.length && !f.tono.includes(p.tono)) return false;
  if (f.stock && p.stock <= 0) return false;
  if (f.precio?.length) {
    const v = precioFinal(p);
    if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
  }
  if (f.q) {
    const cat = getCategoria(p.cat);
    const texto = normalizar([p.nombre, p.marca, cat?.nombre, p.desc, ...(p.tags || [])].join(' '));
    if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
  }
  return true;
}

const ORDENES = {
  destacados: (a, b) => (b.p.destacado ? 1 : 0) - (a.p.destacado ? 1 : 0) || (b.p.nuevo ? 1 : 0) - (a.p.nuevo ? 1 : 0) || a.i - b.i,
  'precio-asc': (a, b) => precioFinal(a.p) - precioFinal(b.p) || a.i - b.i,
  'precio-desc': (a, b) => precioFinal(b.p) - precioFinal(a.p) || a.i - b.i,
  nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i,
};

function consultarProductos({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
  const tope = Math.min(Math.max(1, Math.floor(limite) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
  const lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(x => coincide(x.p, filtros)).sort(ORDENES[orden] || ORDENES.destacados).map(x => x.p);
  const desde = cursor ? lista.findIndex(p => p.id === cursor) + 1 : 0;
  const items = desde > 0 || !cursor ? lista.slice(desde, desde + tope) : [];
  const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
  return Promise.resolve({ items, siguiente, total: lista.length });
}

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

function badgesHTML(p) {
  const b = [];
  if (p.stock <= 0) b.push('<span class="badge badge--agotado">Sin stock</span>');
  else if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  else if (p.nuevo) b.push('<span class="badge">Nuevo</span>');
  else if (p.stock <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<span class="precio precio--final">${formatearPrecio(precioFinal(p))}</span><s class="precio--antes">${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function cardHTML(p, animar = true, compacta = false) {
  const cat = getCategoria(p.cat);
  const agotado = p.stock <= 0;
  const agregar = `Agregar<span class="add-extra"> al carrito</span>`;
  return `<article class="prod${agotado ? ' prod--agotado' : ''}" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
    <button class="prod__media" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <span class="recorte"><img src="${imgProducto(p)}" alt="${esc(p.nombre)}" width="800" height="800"></span>
      ${badgesHTML(p)}
    </button>
    <div class="prod__info">
      <p class="prod__cat">${esc(cat?.nombre)}</p>
      <h3 class="prod__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="prod__precio">${precioHTML(p)}</p>
      ${agotado
        ? `<a class="btn btn--line prod-aviso" href="https://wa.me/${WSP}?text=${encodeURIComponent('Hola! ¿Cuándo vuelve a entrar: ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`
        : compacta
        ? `<div class="prod-actions"><button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}">Agregar al carrito</button></div>`
        : `<div class="prod-actions">
        <div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}">${agregar}</button>
      </div>
      <button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function miniHTML(p, anim = 'der') {
  const agotado = p.stock <= 0;
  return `<article class="mini" data-id="${esc(p.id)}" ${ANIM[anim] || ''}>
    <button class="mini__media" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <span class="recorte"><img src="${imgProducto(p)}" alt="${esc(p.nombre)}" width="800" height="800"></span>
      ${badgesHTML(p)}
    </button>
    <div class="mini__info">
      <p class="mini__cat">${esc(getCategoria(p.cat)?.nombre)}</p>
      <h3 class="mini__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="mini__precio">${precioHTML(p)}</p>
    </div>
    ${agotado ? '' : `<button class="mini__add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON_MAS}</button>`}
  </article>`;
}

function cantidadPorCategoria(id) {
  return PRODUCTOS.filter(p => p.cat === id && p.visible !== false).length;
}

function renderMenus() {
  const params = new URLSearchParams(location.search);
  const actual = PAGINA === 'catalogo' ? (params.get('cat') || '') : '';
  document.querySelectorAll('[data-cat-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}>
      <span class="cat-link__img"><img src="images/${c.mini}.webp" alt="" width="80" height="80"></span>
      <span class="cat-link__nombre">${esc(c.nombre)}</span>
      <span class="cat-link__n">${cantidadPorCategoria(c.id)}</span></a></li>`).join('')
      + `<li class="cat-link--todo"><a href="${CATALOGO}">Ver todo el catálogo ${ICON_FLECHA}</a></li>`;
  });
  document.querySelectorAll('[data-cat-links]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
  });
  document.querySelectorAll('[data-cat-rubros]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li ${ANIM.subir.replace('48px', '24px')}><a href="${CATALOGO}?cat=${c.id}"><span>${esc(c.nombre)}</span><span class="rubro__n">${String(cantidadPorCategoria(c.id)).padStart(2, '0')}</span></a></li>`).join('');
  });
}

function renderCategoriasHome() {
  const circ = document.getElementById('catCirculos');
  if (circ) {
    circ.innerHTML = CATEGORIAS.map(c => `<li class="circulo" ${ANIM.escala}><a href="${CATALOGO}?cat=${c.id}">
      <span class="circulo__img"><img src="images/${c.mini}.webp" alt="" width="800" height="800"></span>
      <span class="circulo__nombre">${esc(c.nombre)}</span>
      <span class="circulo__n">${cantidadPorCategoria(c.id)} productos</span></a></li>`).join('');
  }
  const tarj = document.getElementById('catTarjetas');
  if (tarj) {
    const orden = ['viaje', 'organizacion', 'bazar', 'deco', 'vs'];
    tarj.innerHTML = orden.map(getCategoria).filter(Boolean).map(c => `<li class="col-card col-card--${c.id}" ${ANIM.subir}><a href="${CATALOGO}?cat=${c.id}">
      <span class="col-card__img"><img src="images/${c.escena}.webp" alt="${esc(c.frase)}"></span>
      <span class="col-card__copy">
        <span class="etiqueta etiqueta--clara">${esc(c.nombre)}</span>
        <span class="col-card__titulo">${esc(c.titulo)}</span>
        <span class="col-card__frase">${esc(c.frase)}</span>
        <span class="col-card__cta">Ver la colección ${ICON_FLECHA}</span>
      </span></a></li>`).join('');
  }
}

async function renderHomeProductos() {
  const rail = document.querySelector('[data-rail-productos]');
  if (rail) {
    const tipo = rail.dataset.railProductos;
    const { items } = await consultarProductos({ filtros: { [tipo]: true }, limite: 8 });
    rail.innerHTML = items.map(p => miniHTML(p, 'der')).join('');
  }
  const grid = document.getElementById('gridNovedades');
  if (grid) {
    const { items } = await consultarProductos({ filtros: { nuevo: true }, limite: 8 });
    grid.innerHTML = items.map(p => cardHTML(p, true, true)).join('');
  }
  const mos = document.getElementById('mosaico');
  if (mos) {
    const { items } = await consultarProductos({ filtros: { destacado: true }, limite: 6 });
    items.sort((a, b) => (b.portada ? 1 : 0) - (a.portada ? 1 : 0));
    mos.innerHTML = items.map(p => miniHTML(p, 'subir')).join('');
  }
}

const Catalogo = {
  estado: { cat: [], tono: [], precio: [], stock: false, q: '', orden: 'destacados' },
  buffer: [], siguiente: null, total: 0, mostrar: 16, PASO: 16, pintados: 0,
};

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const lista = (k, validos) => (p.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  const e = Catalogo.estado;
  e.cat = lista('cat', CATEGORIAS.map(c => c.id));
  e.tono = lista('tono', TONOS.map(t => t.id));
  e.precio = lista('precio', PRECIOS.map(x => x.id));
  e.stock = p.get('stock') === '1';
  e.q = (p.get('q') || '').slice(0, 60);
  e.orden = Object.keys(ORDENES).includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  if (e.cat.length) p.set('cat', e.cat.join(','));
  if (e.tono.length) p.set('tono', e.tono.join(','));
  if (e.precio.length) p.set('precio', e.precio.join(','));
  if (e.stock) p.set('stock', '1');
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function filtrosActivos() {
  const e = Catalogo.estado;
  return e.cat.length + e.tono.length + e.precio.length + (e.stock ? 1 : 0);
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const f = inp.dataset.f;
    inp.checked = f === 'stock' ? e.stock : (e[f] || []).includes(inp.value);
  });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  const badge = document.getElementById('filtrosN');
  if (badge) { badge.textContent = n ? `(${n})` : ''; }

  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const unaCat = e.cat.length === 1 ? getCategoria(e.cat[0]) : null;
  if (titulo) titulo.textContent = unaCat ? unaCat.nombre : 'Catálogo completo';
  if (miga) {
    miga.hidden = !unaCat;
    miga.textContent = unaCat ? unaCat.nombre : '';
  }
  document.title = `${unaCat ? unaCat.nombre : 'Catálogo'} — Con onda urbana`;
  document.querySelectorAll('[data-cat-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.nombre })),
      ...e.tono.map(id => ({ f: 'tono', v: id, t: TONOS.find(x => x.id === id)?.nombre })),
      ...e.precio.map(id => ({ f: 'precio', v: id, t: PRECIOS.find(x => x.id === id)?.nombre })),
      ...(e.stock ? [{ f: 'stock', v: '1', t: 'Con stock' }] : []),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('');
  }
}

async function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, tono: e.tono, precio: e.precio, stock: e.stock, q: e.q };
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    Catalogo.pintados = 0;
    const r = await consultarProductos({ filtros, orden: e.orden, limite: LIMITE_SERVIDOR });
    Catalogo.buffer = r.items; Catalogo.siguiente = r.siguiente; Catalogo.total = r.total;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = await consultarProductos({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_SERVIDOR });
    Catalogo.buffer.push(...r.items); Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'producto' : 'productos'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    mas.hidden = Catalogo.pintados >= Catalogo.total;
    mas.textContent = `Ver más productos (${Math.max(0, Catalogo.total - Catalogo.pintados)})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

async function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="f-n">${cantidadPorCategoria(c.id)}</span></label>`).join('');
  const fTono = document.getElementById('fTono');
  if (fTono) fTono.innerHTML = TONOS.map(t => `<label class="f-check"><input type="checkbox" data-f="tono" value="${t.id}"><span class="tono tono--${t.id}" aria-hidden="true"></span><span>${esc(t.nombre)}</span></label>`).join('');
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = PRECIOS.map(x => `<label class="f-check"><input type="checkbox" data-f="precio" value="${x.id}"><span>${esc(x.nombre)}</span></label>`).join('');

  leerURLCatalogo();
  sincronizarControles();
  await cargarCatalogo(true);

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const e = Catalogo.estado; const f = inp.dataset.f;
    if (f === 'stock') e.stock = inp.checked;
    else e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
    aplicarCambioCatalogo();
  });

  const orden = document.getElementById('orden');
  orden?.addEventListener('change', () => { Catalogo.estado.orden = orden.value; aplicarCambioCatalogo(); });

  const form = document.getElementById('buscadorForm');
  const buscar = document.getElementById('buscar');
  let t = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 220);
  });
  form?.addEventListener('submit', ev => {
    ev.preventDefault(); clearTimeout(t);
    Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo();
  });

  const limpiar = () => {
    Object.assign(Catalogo.estado, { cat: [], tono: [], precio: [], stock: false, q: '' });
    aplicarCambioCatalogo();
  };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiar));

  document.getElementById('chipsActivos')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-quitar]');
    if (!b) return;
    const e = Catalogo.estado; const f = b.dataset.quitar; const v = b.dataset.valor;
    if (f === 'stock') e.stock = false;
    else if (f === 'q') e.q = '';
    else e[f] = e[f].filter(x => x !== v);
    aplicarCambioCatalogo();
  });

  document.getElementById('verMas')?.addEventListener('click', () => {
    Catalogo.mostrar += Catalogo.PASO;
    cargarCatalogo(false);
  });

  const enfocarBuscador = () => { buscar?.scrollIntoView({ block: 'center' }); buscar?.focus({ preventScroll: true }); };
  document.querySelectorAll('a[href="#buscar"]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); enfocarBuscador(); }));
  if (location.hash === '#buscar') setTimeout(enfocarBuscador, 60);
  initFiltrosMobile();
}

function initFiltrosMobile() {
  const panel = document.getElementById('filtros');
  const abrir = document.getElementById('filtrosOpen');
  if (!panel || !abrir) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const cerrar = () => {
    panel.classList.remove('open'); bd.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const open = () => {
    panel.removeAttribute('inert'); panel.classList.add('open'); bd.classList.add('open');
    panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    abrir.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    panel.querySelector('input, button')?.focus();
  };
  abrir.addEventListener('click', open);
  bd.addEventListener('click', cerrar);
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrar(); abrir.focus(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) { cerrar(); abrir.focus(); } });
  const sync = () => { if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); } else { panel.removeAttribute('inert'); cerrar(); } };
  mq.addEventListener('change', sync);
  sync();
}

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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

let ultimoFoco = null;
function trapFocus(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function renderCart() {
  const list = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!list) return;
  Cart.syncStock(PRODUCTOS.filter(p => p.visible !== false));
  const items = Cart.get();
  if (!items.length) {
    list.innerHTML = `<div class="cart-vacio"><span class="etiqueta">Carrito vacío</span><p>Todavía no sumaste nada. Arrancá por la categoría que más necesitás.</p><a class="btn btn--cta" href="${CATALOGO}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  list.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    return `<div class="cart-item" data-id="${esc(p.id)}">
      <img src="${imgProducto(p)}" alt="" width="800" height="800">
      <div class="cart-item__info">
        <p class="cart-item__nombre">${esc(p.nombre)}</p>
        <p class="cart-item__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
        <div class="stepper stepper--sm"><button type="button" data-cart-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><span aria-live="polite">${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>
      </div>
      <button type="button" class="cart-item__quitar" data-cart-remove aria-label="Quitar ${esc(p.nombre)}">${ICON_X}</button>
    </div>`;
  }).join('');
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function openCartDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d) return;
  if (!document.getElementById('quickView')?.hidden) cerrarQuickView(false);
  ultimoFoco = document.activeElement;
  renderCart();
  d.hidden = false; if (bd) bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { d.classList.add('open'); bd?.classList.add('open'); }));
  setTimeout(() => d.querySelector('[data-close-drawer]')?.focus(), 60);
}

function closeCartDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; if (bd) bd.hidden = true; }, reduceMotion ? 0 : 360);
  ultimoFoco?.focus?.();
}

function initCartDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  d.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); trapFocus(d, e); });
  d.addEventListener('click', e => {
    if (e.target.closest('[data-close-drawer]')) { closeCartDrawer(); return; }
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const id = row.dataset.id;
    const step = e.target.closest('[data-cart-step]');
    if (step) { const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty + Number(step.dataset.cartStep)); }
    if (e.target.closest('[data-cart-remove]')) Cart.remove(id);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCart(); });
}

function cantidadDe(btn) {
  const cont = btn.closest('.prod, .qv__compra');
  const inp = cont?.querySelector('.stepper input');
  const n = parseInt(inp?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function abrirQuickView(id, desdeURL = false) {
  const p = getProducto(id);
  const qv = document.getElementById('quickView');
  const cont = document.getElementById('qvContent');
  if (!p || !qv || !cont || p.visible === false) return;
  const cat = getCategoria(p.cat);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id && x.stock > 0).slice(0, 3);
  const agotado = p.stock <= 0;
  cont.innerHTML = `<div class="qv__galeria">
      <div class="qv__foto"><img id="qvFoto" src="${imgProducto(p)}" alt="${esc(p.nombre)}" width="800" height="800"></div>
      <div class="qv__thumbs" role="group" aria-label="Fotos del producto">
        <button type="button" class="is-active" data-qv-foto="${imgProducto(p)}" aria-label="Ver el producto"><img src="${imgProducto(p)}" alt="" width="800" height="800"></button>
        <button type="button" data-qv-foto="images/${p.escena}.webp" aria-label="Ver en ambiente"><img src="images/${p.escena}.webp" alt=""></button>
      </div>
    </div>
    <div class="qv__datos">
      <p class="etiqueta etiqueta--mini">${esc(cat?.nombre)}</p>
      <p class="qv__titulo">${esc(p.nombre)}</p>
      ${p.marca ? `<p class="qv__marca">${esc(p.marca)}</p>` : ''}
      <p class="qv__precio">${precioHTML(p)}${p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <p class="qv__stock">${agotado ? 'Sin stock por ahora' : p.stock <= 3 ? `Quedan ${p.stock} unidades` : 'En stock'}</p>
      <div class="qv__compra">
        ${agotado ? `<a class="btn btn--cta btn--block" href="https://wa.me/${WSP}?text=${encodeURIComponent('Hola! ¿Cuándo vuelve a entrar: ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame por WhatsApp cuando vuelva</a>` : `
        <div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>
        <button class="btn btn--cta" type="button" data-add="${esc(p.id)}">Agregar al carrito</button>
        <button class="btn btn--line" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
      </div>
      <p class="qv__dni"><span class="etiqueta etiqueta--mini">Cuenta DNI</span> Pagá con Cuenta DNI y recibí el reintegro de Banco Provincia.</p>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-titulo">También te puede interesar</p><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${imgProducto(r)}" alt="" width="800" height="800"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioFinal(r))}</strong></button>`).join('')}</div></div>` : ''}
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(imgProducto(p), location.href).href, description: p.desc, brand: p.marca ? { '@type': 'Brand', name: p.marca } : undefined, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } });
  if (qv.hidden) {
    ultimoFoco = desdeURL ? null : document.activeElement;
    qv.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  qv.querySelector('.qv__panel')?.scrollTo?.(0, 0);
  setTimeout(() => qv.querySelector('.qv__close')?.focus(), 60);
  const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
}

function cerrarQuickView(devolverFoco = true) {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 300);
  const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  if (devolverFoco) ultimoFoco?.focus?.();
}

function initQuickView() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { cerrarQuickView(); return; }
    const t = e.target.closest('[data-qv-foto]');
    if (t) {
      const foto = document.getElementById('qvFoto');
      if (foto) foto.src = t.dataset.qvFoto;
      qv.querySelectorAll('[data-qv-foto]').forEach(b => b.classList.toggle('is-active', b === t));
    }
  });
  qv.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarQuickView(); trapFocus(qv, e); });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, true);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const inp = step.parentElement.querySelector('input');
      if (inp) { const max = parseInt(inp.max, 10) || 99; inp.value = Math.max(1, Math.min(max, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step))); }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add); if (!p || p.stock <= 0) return;
      Cart.add(p, cantidadDe(add));
      add.classList.remove('is-ok'); void add.offsetWidth; add.classList.add('is-ok');
      showToast(`Sumaste ${p.nombre} al carrito`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy); if (!p || p.stock <= 0) return;
      Cart.add(p, cantidadDe(buy));
      openCartDrawer();
      return;
    }
    if (e.target.closest('[data-open-cart]')) openCartDrawer();
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('.stepper input');
    if (!inp) return;
    const max = parseInt(inp.max, 10) || 99;
    inp.value = Math.max(1, Math.min(max, parseInt(inp.value, 10) || 1));
  });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cat__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatDropdown() {
  const wrap = document.querySelector('.nav-cat');
  const btn = wrap?.querySelector('.nav-cat__btn');
  if (!wrap || !btn) return;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) timer = setTimeout(cerrar, 120); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (wrap.classList.contains('open') && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
}

function initRailDrag() {
  document.querySelectorAll('.rail').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    if (!vp || !track) return;
    const prev = rail.parentElement.querySelector('[data-rail-prev]');
    const next = rail.parentElement.querySelector('[data-rail-next]');
    let pointerId = null; let startX = 0; let startLeft = 0; let moved = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      pointerId = null;
      if (moved) {
        const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
        vp.addEventListener('click', kill, { capture: true, once: true });
        setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
      }
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', () => vp.classList.remove('dragging'));
    const paso = () => (track.querySelector('.mini')?.getBoundingClientRect().width || 260) + 20;
    const syncArrows = () => {
      const inicio = 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows, { passive: true });
    syncArrows();
  });
}

function initHeroSlider() {
  const hb = document.querySelector('.hb');
  if (!hb) return;
  const slides = [...hb.querySelectorAll('.hb-slide')];
  const dots = [...hb.querySelectorAll('[data-hb-dot]')];
  if (slides.length < 2) return;
  let i = 0; let timer = 0; let pausado = false;
  const ir = n => {
    const nuevo = (n + slides.length) % slides.length;
    if (nuevo === i) return;
    const viejo = slides[i];
    viejo.classList.add('is-leaving'); viejo.classList.remove('is-active'); viejo.setAttribute('inert', ''); viejo.setAttribute('aria-hidden', 'true');
    const s = slides[nuevo];
    s.classList.add('is-active'); s.removeAttribute('inert'); s.removeAttribute('aria-hidden');
    setTimeout(() => viejo.classList.remove('is-leaving'), reduceMotion ? 0 : 1100);
    dots.forEach((d, k) => d.setAttribute('aria-current', k === nuevo ? 'true' : 'false'));
    i = nuevo;
  };
  const programar = () => { clearTimeout(timer); if (!reduceMotion && !pausado) timer = setTimeout(() => { ir(i + 1); programar(); }, 6500); };
  hb.querySelector('[data-hb-prev]')?.addEventListener('click', () => { ir(i - 1); programar(); });
  hb.querySelector('[data-hb-next]')?.addEventListener('click', () => { ir(i + 1); programar(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); programar(); }));
  hb.addEventListener('mouseenter', () => { pausado = true; clearTimeout(timer); });
  hb.addEventListener('mouseleave', () => { pausado = false; programar(); });
  hb.addEventListener('focusin', () => { pausado = true; clearTimeout(timer); });
  hb.addEventListener('focusout', e => { if (!hb.contains(e.relatedTarget)) { pausado = false; programar(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else programar(); });
  programar();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hb-slide.is-active') || document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(document.querySelectorAll('.hero .sello, .hero .hb-controls'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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

async function iniciar() {
  renderMenus();
  renderCategoriasHome();
  await renderHomeProductos();
  await initCatalogo();
  initReveals();
  initNav();
  initCatDropdown();
  initRailDrag();
  initHeroSlider();
  initHeroMotion();
  initAcciones();
  initCartDrawer();
  initQuickView();
  initFloats();
  initModelBarScroll();
  updateCartBadge();
}

iniciar();
