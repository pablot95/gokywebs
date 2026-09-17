document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'panales', nom: 'Pañales', img: 'images/cat-panales.webp', pie: 'De recién nacido a XG', texto: 'El corazón de la pañalera: todos los talles con su rango de peso a la vista, en packs que rinden el mes.' },
  { id: 'higiene', nom: 'Higiene y cuidado', img: 'images/cat-higiene.webp', pie: 'Para el cambiador y el baño', texto: 'Lo que se usa todos los días y lo que más se regala: cepillo de cerda suave y la canastilla armada.' },
  { id: 'perfumeria', nom: 'Perfumería', img: 'images/cat-perfumeria.webp', pie: 'Para el bebé y para vos', texto: 'Colonia suave para el bebé y fragancias para mamá, en el mismo pedido.' },
  { id: 'ropa', nom: 'Ropa y accesorios', img: 'images/cat-accesorios.webp', pie: 'Algodón y tejido', texto: 'Bodies, batitas, conjuntos y ajuares de algodón y tejido, por rango de meses.' }
];

const TALLES = [
  { id: 'RN', nom: 'Recién nacido', peso: 'hasta 4,5 kg', txt: 'Para las primeras semanas, cuando el cambio es cada tres horas.' },
  { id: 'P', nom: 'Talle P', peso: '5 a 8 kg', txt: 'El que más se repite entre el mes y los cuatro meses.' },
  { id: 'M', nom: 'Talle M', peso: '7 a 10 kg', txt: 'Etapa de gateo: tiene que ajustar sin marcar la piel.' },
  { id: 'G', nom: 'Talle G y XG', peso: '9 a 15 kg', txt: 'Primeros pasos y noche: más absorción, menos cambios.' }
];

const PRODUCTOS = [
  {
    id: 'pap-1001', nombre: 'Pañales recién nacido x 36', cat: 'panales', talle: 'RN', medida: 'hasta 4,5 kg',
    precio: 18900, descuento: 0, stock: 14, img: 'images/p-panal-rn.webp',
    alt: 'Pañales de recién nacido apilados en la canasta de la tienda',
    desc: 'Pañal chico y muy suave para las primeras semanas, con elástico bajo para no tocar el ombligo.',
    datos: [['Talle', 'Recién nacido'], ['Peso', 'Hasta 4,5 kg'], ['Unidades', '36 por pack']],
    etiquetas: ['panal', 'recien nacido', 'rn', 'primeras semanas'], destacado: true, nuevo: false
  },
  {
    id: 'pap-1002', nombre: 'Pañales talle P x 50', cat: 'panales', talle: 'P', medida: '5 a 8 kg',
    precio: 24500, descuento: 0, stock: 12, img: 'images/p-panal-p.webp',
    alt: 'Pañales talle P doblados en la canasta',
    desc: 'El talle que más se repone entre el mes y los cuatro meses. Pack de 50 para que rinda.',
    datos: [['Talle', 'P'], ['Peso', '5 a 8 kg'], ['Unidades', '50 por pack']],
    etiquetas: ['panal', 'talle p', 'pequeno'], destacado: true, nuevo: false
  },
  {
    id: 'pap-1003', nombre: 'Pañales talle M x 56', cat: 'panales', talle: 'M', medida: '7 a 10 kg',
    precio: 27900, descuento: 10, stock: 9, img: 'images/p-panal-m.webp',
    alt: 'Pañales talle M en la canasta de la tienda',
    desc: 'Para la etapa de gateo: elástico lateral que ajusta sin marcar y mayor absorción nocturna.',
    datos: [['Talle', 'M'], ['Peso', '7 a 10 kg'], ['Unidades', '56 por pack']],
    etiquetas: ['panal', 'talle m', 'mediano', 'gateo'], destacado: true, nuevo: false
  },
  {
    id: 'pap-1004', nombre: 'Pañales talle G x 52', cat: 'panales', talle: 'G', medida: '9 a 12,5 kg',
    precio: 29900, descuento: 0, stock: 8, img: 'images/p-panal-g.webp',
    alt: 'Pañales talle G doblados en la canasta',
    desc: 'Primeros pasos: más absorción para aguantar la noche completa y cintura elastizada.',
    datos: [['Talle', 'G'], ['Peso', '9 a 12,5 kg'], ['Unidades', '52 por pack']],
    etiquetas: ['panal', 'talle g', 'grande', 'noche'], destacado: true, nuevo: false
  },
  {
    id: 'pap-1005', nombre: 'Pañales talle XG x 48', cat: 'panales', talle: 'XG', medida: '12 a 15 kg',
    precio: 31900, descuento: 0, stock: 6, img: 'images/p-panal-xg.webp',
    alt: 'Pañales talle XG apilados en la canasta',
    desc: 'El talle más grande, para cuando ya camina y se cambia de pie.',
    datos: [['Talle', 'XG'], ['Peso', '12 a 15 kg'], ['Unidades', '48 por pack']],
    etiquetas: ['panal', 'talle xg', 'extra grande'], destacado: false, nuevo: false
  },
  {
    id: 'pap-1006', nombre: 'Pañales de tela x 3 con absorbente', cat: 'panales', talle: 'multi', medida: '3 a 14 kg',
    precio: 22400, descuento: 0, stock: 7, img: 'images/p-panal-tela.webp',
    alt: 'Pañales de tela doblados en una canasta de mimbre',
    desc: 'Tres pañales de tela con broches regulables que acompañan de los 3 a los 14 kg, más absorbente lavable.',
    datos: [['Talle', 'Regulable'], ['Peso', '3 a 14 kg'], ['Incluye', '3 pañales + absorbentes']],
    etiquetas: ['panal', 'tela', 'lavable', 'reutilizable'], destacado: false, nuevo: true
  },
  {
    id: 'pap-2001', nombre: 'Cepillo de cerda suave', cat: 'higiene', talle: null, medida: 'madera y cerda natural',
    precio: 8900, descuento: 0, stock: 15, img: 'images/p-cepillo.webp',
    alt: 'Cepillo de cerda suave con cabo de madera apoyado en el estante',
    desc: 'Cabo de madera y cerda natural muy suave, para el pelo del bebé desde el primer mes.',
    datos: [['Material', 'Madera y cerda natural'], ['Uso', 'Desde el primer mes'], ['Largo', '14 cm']],
    etiquetas: ['cepillo', 'higiene', 'bano', 'madera'], destacado: false, nuevo: false
  },
  {
    id: 'pap-2002', nombre: 'Canastilla de higiene y regalo', cat: 'higiene', talle: null, medida: '6 piezas',
    precio: 34900, descuento: 0, stock: 5, img: 'images/p-canastilla.webp',
    alt: 'Canastilla de mimbre con pañales y ropa doblada lista para regalar',
    desc: 'La que más se regala: canasta de mimbre con pañales, batita, cepillo y colonia, envuelta para entregar.',
    datos: [['Incluye', '6 piezas'], ['Canasta', 'Mimbre natural'], ['Armado', 'Listo para regalar']],
    etiquetas: ['canastilla', 'regalo', 'nacimiento', 'baby shower'], destacado: true, nuevo: false
  },
  {
    id: 'pap-3001', nombre: 'Colonia para bebé 200 ml', cat: 'perfumeria', talle: null, medida: '200 ml',
    precio: 12900, descuento: 15, stock: 18, img: 'images/p-colonia-bebe.webp',
    alt: 'Frasco de colonia para bebé con detalle del vidrio',
    desc: 'Colonia sin alcohol, de aroma suave y duradero, pensada para la piel del bebé.',
    datos: [['Contenido', '200 ml'], ['Sin alcohol', 'Sí'], ['Uso', 'Desde los 3 meses']],
    etiquetas: ['colonia', 'perfume', 'bebe', 'sin alcohol'], destacado: true, nuevo: false
  },
  {
    id: 'pap-3002', nombre: 'Eau de parfum 100 ml', cat: 'perfumeria', talle: null, medida: '100 ml',
    precio: 46900, descuento: 0, stock: 6, img: 'images/p-perfume-ambar.webp',
    alt: 'Frasco de eau de parfum ámbar sobre la mesa de madera',
    desc: 'Fragancia floral amaderada de larga duración, para mamá. La que más se lleva junto con la canastilla.',
    datos: [['Contenido', '100 ml'], ['Familia', 'Floral amaderada'], ['Duración', 'Larga']],
    etiquetas: ['perfume', 'eau de parfum', 'mujer', 'fragancia'], destacado: false, nuevo: false
  },
  {
    id: 'pap-3003', nombre: 'Set de 3 colonias', cat: 'perfumeria', talle: null, medida: '3 x 100 ml',
    precio: 58900, descuento: 10, stock: 4, img: 'images/p-set-perfume.webp',
    alt: 'Tres frascos de colonia alineados en la mesa',
    desc: 'Tres fragancias distintas en frascos de 100 ml, para probar o para regalar completo.',
    datos: [['Contenido', '3 x 100 ml'], ['Fragancias', 'Fresca, floral y amaderada'], ['Presentación', 'Caja de regalo']],
    etiquetas: ['set', 'colonias', 'regalo', 'perfume'], destacado: false, nuevo: true
  },
  {
    id: 'pap-4001', nombre: 'Body de algodón a rayas', cat: 'ropa', talle: null, medida: '0 a 3 meses',
    precio: 9800, descuento: 0, stock: 20, img: 'images/p-body-rayas.webp',
    alt: 'Bodies de algodón a rayas azules doblados en el estante',
    desc: 'Body de algodón peinado con broches en el hombro, para que entre y salga sin tironear.',
    datos: [['Talle', '0 a 3 meses'], ['Material', 'Algodón peinado'], ['Cierre', 'Broches al hombro']],
    etiquetas: ['body', 'algodon', 'rayas', 'ropa'], destacado: true, nuevo: false
  },
  {
    id: 'pap-4002', nombre: 'Pack de bodies x 3', cat: 'ropa', talle: null, medida: '0 a 6 meses',
    precio: 26500, descuento: 10, stock: 11, img: 'images/p-pack-bodies.webp',
    alt: 'Pack de bodies blancos y estampados apilados',
    desc: 'Tres bodies de algodón lisos y estampados, en los talles que más se usan los primeros meses.',
    datos: [['Talle', '0 a 6 meses'], ['Piezas', '3 bodies'], ['Material', 'Algodón']],
    etiquetas: ['bodies', 'pack', 'algodon', 'ropa'], destacado: false, nuevo: false
  },
  {
    id: 'pap-4003', nombre: 'Conjunto de algodón 2 piezas', cat: 'ropa', talle: null, medida: '3 a 6 meses',
    precio: 21900, descuento: 0, stock: 9, img: 'images/p-conjunto.webp',
    alt: 'Conjunto de algodón doblado sobre el estante de la tienda',
    desc: 'Remera y pantalón de algodón, livianos y con puño elastizado. Para todos los días.',
    datos: [['Talle', '3 a 6 meses'], ['Piezas', 'Remera y pantalón'], ['Material', 'Algodón']],
    etiquetas: ['conjunto', 'ropa', 'algodon'], destacado: false, nuevo: false
  },
  {
    id: 'pap-4004', nombre: 'Pack de batitas x 2', cat: 'ropa', talle: null, medida: '0 a 3 meses',
    precio: 18400, descuento: 0, stock: 12, img: 'images/p-ropa-apilada.webp',
    alt: 'Batitas blancas estampadas dobladas en el estante',
    desc: 'Dos batitas de algodón con puño y pie, las que se usan en la primera salida del sanatorio.',
    datos: [['Talle', '0 a 3 meses'], ['Piezas', '2 batitas'], ['Material', 'Algodón']],
    etiquetas: ['batita', 'pack', 'primera ropa'], destacado: false, nuevo: false
  },
  {
    id: 'pap-4005', nombre: 'Sweater tejido', cat: 'ropa', talle: null, medida: '6 a 12 meses',
    precio: 32900, descuento: 0, stock: 5, img: 'images/p-sweater.webp',
    alt: 'Sweater tejido con rayas colgado en el exhibidor',
    desc: 'Tejido liviano con rayas, abriga sin dar calor y se lava a máquina en frío.',
    datos: [['Talle', '6 a 12 meses'], ['Material', 'Hilo de algodón'], ['Lavado', 'Máquina en frío']],
    etiquetas: ['sweater', 'tejido', 'abrigo', 'ropa'], destacado: false, nuevo: false
  },
  {
    id: 'pap-4006', nombre: 'Pantalón tejido', cat: 'ropa', talle: null, medida: '6 a 12 meses',
    precio: 24900, descuento: 0, stock: 7, img: 'images/p-pantalon.webp',
    alt: 'Pantalón tejido con estampa de animales colgado en el exhibidor',
    desc: 'Pantalón de hilo con cintura elastizada, combina con el sweater del mismo tejido.',
    datos: [['Talle', '6 a 12 meses'], ['Material', 'Hilo de algodón'], ['Cintura', 'Elastizada']],
    etiquetas: ['pantalon', 'tejido', 'ropa'], destacado: false, nuevo: false
  },
  {
    id: 'pap-4007', nombre: 'Ajuar de 3 piezas', cat: 'ropa', talle: null, medida: '0 a 3 meses',
    precio: 47900, descuento: 10, stock: 4, img: 'images/p-ajuar.webp',
    alt: 'Ajuar tejido de tres piezas colgado en el exhibidor',
    desc: 'Sweater, pantalón y gorrito del mismo tejido: el regalo clásico de nacimiento.',
    datos: [['Talle', '0 a 3 meses'], ['Piezas', 'Sweater, pantalón y gorro'], ['Material', 'Hilo de algodón']],
    etiquetas: ['ajuar', 'regalo', 'tejido', 'nacimiento'], destacado: true, nuevo: false
  },
  {
    id: 'pap-4008', nombre: 'Camisón de algodón', cat: 'ropa', talle: null, medida: '0 a 6 meses',
    precio: 19900, descuento: 0, stock: 6, img: 'images/p-camison.webp',
    alt: 'Camisón de algodón blanco con cuello bordado en su percha',
    desc: 'Camisón blanco con cuello bordado, de algodón finito. Para dormir o para la foto.',
    datos: [['Talle', '0 a 6 meses'], ['Material', 'Algodón'], ['Detalle', 'Cuello bordado']],
    etiquetas: ['camison', 'algodon', 'dormir', 'bautismo'], destacado: false, nuevo: false
  }
];

const WSP = '5493517059380';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nom ?? '';
// los talles son de una letra (P, M, G): un termino corto tiene que coincidir con la palabra
// entera, si no "m" matchea "mes", "meses" y media tienda
const coincide = (heno, t) => {
  if (t.length > 2) return heno.includes(t);
  const limite = c => !(c >= 'a' && c <= 'z') && !(c >= '0' && c <= '9');
  let i = heno.indexOf(t);
  while (i !== -1) {
    const antes = i === 0 ? ' ' : heno[i - 1];
    const despues = i + t.length >= heno.length ? ' ' : heno[i + t.length];
    if (limite(antes) && limite(despues)) return true;
    i = heno.indexOf(t, i + 1);
  }
  return false;
};

const Cart = {
  KEY: 'panalesaccesoriosperfumeria_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- estado del catálogo ---------- */
const estado = { q: '', cat: 'todas', talle: 'todos', precio: 'todos', stock: false, orden: 'relevancia', pagina: 1 };
const PAGE = 16;
let revealsListos = false;

function stepperHTML(id, contexto) {
  const ref = (contexto || 'cat') + '-' + id;
  return '<div class="stepper" data-stepper="' + ref + '">' +
    '<button type="button" data-paso="-1" aria-label="Quitar uno">−</button>' +
    '<input type="number" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad" id="qty-' + ref + '">' +
    '<button type="button" data-paso="1" aria-label="Sumar uno">+</button>' +
  '</div>';
}

function cardHTML(p, contexto) {
  const final = precioFinal(p);
  const sinStock = p.stock <= 0;
  const flags = [];
  if (p.descuento > 0) flags.push('<span class="flag flag--off">-' + p.descuento + '%</span>');
  if (p.nuevo) flags.push('<span class="flag flag--nuevo">Nuevo</span>');
  if (!sinStock && p.stock <= 5) flags.push('<span class="flag flag--ultimas">Quedan ' + p.stock + '</span>');
  return '<article class="prod-card' + (sinStock ? ' prod-card--sinstock' : '') + '" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
    '<div class="prod-media">' +
      '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      (flags.length ? '<div class="prod-flags">' + flags.join('') + '</div>' : '') +
      '<button type="button" class="prod-vista" data-vista="' + p.id + '">Ver la ficha</button>' +
    '</div>' +
    '<div class="prod-body">' +
      '<p class="prod-rubro">' + esc(nombreCat(p.cat)) + '</p>' +
      '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
      '<p class="prod-talle">' + (p.talle ? 'Talle <strong>' + esc(p.talle === 'multi' ? 'regulable' : p.talle) + '</strong> · ' : '') + esc(p.medida) + '</p>' +
      '<div class="prod-precios">' +
        '<span class="prod-precio' + (p.descuento > 0 ? ' prod-precio--off' : '') + '">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s>' : '') +
      '</div>' +
      '<div class="prod-actions">' +
        stepperHTML(p.id, contexto) +
        '<button type="button" class="prod-add" data-add="' + p.id + '"' + (sinStock ? ' disabled' : '') + '>' +
          (sinStock ? 'Sin stock' : '<span class="add-largo">Sumar al pedido</span><span class="add-corto">Sumar</span>') +
        '</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function qtyDe(el) {
  const st = el.closest('.prod-card, .mv, .cap-prod')?.querySelector('.stepper input');
  const n = parseInt(st?.value ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function initRubros() {
  const cont = document.getElementById('rubroGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return '<button type="button" class="rubro-card" data-cat="' + c.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
      '<span class="rubro-media"><img src="' + c.img + '" width="900" height="900" alt="' + esc(c.nom) + '" decoding="async"></span>' +
      '<span class="rubro-body">' +
        '<span><span class="rubro-nom">' + esc(c.nom) + '</span><span class="rubro-n">' + n + ' artículos · ' + esc(c.pie) + '</span></span>' +
        '<span class="rubro-flecha" aria-hidden="true">→</span>' +
      '</span>' +
    '</button>';
  }).join('');
  cont.querySelectorAll('.rubro-card').forEach(b => b.addEventListener('click', () => irAlCatalogo({ cat: b.dataset.cat })));

  const pie = document.getElementById('pieCats');
  if (pie) {
    pie.innerHTML = CATEGORIAS.map(c => '<li><a href="#tienda" data-cat-link="' + c.id + '">' + esc(c.nom) + '</a></li>').join('');
    pie.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
      estado.cat = a.dataset.catLink; estado.pagina = 1; sincronizarChips(); render();
    }));
  }
}

function initGuia() {
  const cont = document.getElementById('guiaGrid');
  if (!cont) return;
  cont.innerHTML = TALLES.map(t => {
    const n = PRODUCTOS.filter(p => p.cat === 'panales' && (t.id === 'G' ? (p.talle === 'G' || p.talle === 'XG') : p.talle === t.id)).length;
    return '<button type="button" class="guia-card" data-talle="' + t.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
      '<span class="guia-talle">' + esc(t.nom) + '</span>' +
      '<span class="guia-peso">' + esc(t.peso) + '</span>' +
      '<span class="guia-txt">' + esc(t.txt) + '</span>' +
      '<span class="guia-link">Ver ' + n + (n === 1 ? ' pañal' : ' pañales') + '</span>' +
    '</button>';
  }).join('');
  cont.querySelectorAll('.guia-card').forEach(b => b.addEventListener('click', () => irAlCatalogo({ cat: 'panales', talle: b.dataset.talle })));
}

function irAlCatalogo(opciones) {
  estado.cat = opciones.cat ?? 'todas';
  estado.talle = opciones.talle ?? 'todos';
  estado.q = ''; estado.pagina = 1;
  const input = document.getElementById('q'); if (input) input.value = '';
  sincronizarChips(); render();
  document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
}

function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p, 'rail')).join('');
  initRailDrag();
}

function initRailDrag() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

  const sincronizarFlechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };

  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = e => { e.stopPropagation(); e.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    moved = false;
    sincronizarFlechas();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('scroll', sincronizarFlechas, { passive: true });

  const paso = () => Math.max(220, Math.round(vp.clientWidth * 0.8));
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  sincronizarFlechas();
  window.addEventListener('resize', sincronizarFlechas, { passive: true });
}

function filtrados() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (estado.talle !== 'todos') {
      const talles = estado.talle === 'G' ? ['G', 'XG', 'multi'] : [estado.talle, 'multi'];
      if (!p.talle || !talles.includes(p.talle)) return false;
    }
    if (estado.stock && p.stock <= 0) return false;
    if (estado.precio !== 'todos') {
      const [min, max] = estado.precio.split('-').map(Number);
      const f = precioFinal(p);
      if (f < min || f > max) return false;
    }
    if (q.length) {
      const heno = normalizar([p.nombre, nombreCat(p.cat), p.talle, p.medida, p.desc, (p.etiquetas || []).join(' ')].join(' '));
      if (!q.every(t => coincide(heno, t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function render() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const lista = filtrados();
  const visibles = lista.slice(0, PAGE * estado.pagina);

  grid.innerHTML = visibles.map(p => cardHTML(p, 'cat')).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (res) res.textContent = lista.length === 1 ? '1 artículo' : lista.length + ' artículos';
  if (verMas) {
    verMas.hidden = visibles.length >= lista.length;
    verMas.parentElement.hidden = visibles.length >= lista.length;
  }

  const n = [estado.cat !== 'todas', estado.talle !== 'todos', estado.precio !== 'todos', estado.stock].filter(Boolean).length;
  const chipN = document.getElementById('filtrosN');
  if (chipN) { chipN.textContent = n; chipN.hidden = n === 0; }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function sincronizarChips() {
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.catChip === estado.cat));
  document.querySelectorAll('#chipsTalle .chip').forEach(c => c.classList.toggle('is-on', c.dataset.talleChip === estado.talle));
  document.querySelectorAll('#chipsPrecio .chip').forEach(c => c.classList.toggle('is-on', c.dataset.precio === estado.precio));
  const s = document.getElementById('soloStock'); if (s) s.checked = estado.stock;
  const o = document.getElementById('orden'); if (o) o.value = estado.orden;
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCat');
  if (chipsCat) {
    chipsCat.innerHTML = '<button type="button" class="chip is-on" data-cat-chip="todas">Todos</button>' +
      CATEGORIAS.map(c => '<button type="button" class="chip" data-cat-chip="' + c.id + '">' + esc(c.nom) + '</button>').join('');
  }
  const chipsTalle = document.getElementById('chipsTalle');
  if (chipsTalle) {
    chipsTalle.innerHTML = '<button type="button" class="chip is-on" data-talle-chip="todos">Todos</button>' +
      ['RN', 'P', 'M', 'G', 'XG'].map(t => '<button type="button" class="chip" data-talle-chip="' + t + '">' + t + '</button>').join('');
  }
  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.dataset.catChip) estado.cat = chip.dataset.catChip;
    else if (chip.dataset.talleChip) estado.talle = chip.dataset.talleChip;
    else if (chip.dataset.precio) estado.precio = chip.dataset.precio;
    else return;
    estado.pagina = 1; sincronizarChips(); render();
  });

  document.getElementById('soloStock')?.addEventListener('change', e => { estado.stock = e.target.checked; estado.pagina = 1; render(); });
  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; estado.pagina = 1; render(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.pagina++; render(); });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', talle: 'todos', precio: 'todos', stock: false, orden: 'relevancia', pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
    showToast('Listo, catálogo completo otra vez');
  });
  document.getElementById('vaciarBusqueda')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', talle: 'todos', precio: 'todos', stock: false, pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
  });

  document.getElementById('formBuscador')?.addEventListener('submit', e => e.preventDefault());
  document.getElementById('q')?.addEventListener('input', e => { estado.q = e.target.value.trim(); estado.pagina = 1; render(); });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

/* ---------- pestañas por rubro ---------- */
function initPestanas() {
  const tabs = document.getElementById('pestanasTabs');
  const cuerpo = document.getElementById('pestanasCuerpo');
  if (!tabs || !cuerpo) return;
  tabs.innerHTML = CATEGORIAS.map((c, i) =>
    '<button type="button" class="pestana" role="tab" id="tab-' + c.id + '" aria-controls="panel-' + c.id + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' + esc(c.nom) + '</button>'
  ).join('');
  cuerpo.innerHTML = CATEGORIAS.map((c, i) => {
    const items = PRODUCTOS.filter(p => p.cat === c.id);
    const desde = Math.min(...items.map(precioFinal));
    return '<div class="panel" role="tabpanel" id="panel-' + c.id + '" aria-labelledby="tab-' + c.id + '"' + (i === 0 ? '' : ' hidden') + '>' +
      '<ul class="panel-lista">' + items.slice(0, 6).map(p =>
        '<li><span>' + esc(p.nombre) + '</span><strong>' + formatearPrecio(precioFinal(p)) + '</strong></li>'
      ).join('') + '</ul>' +
      '<div class="panel-txt">' +
        '<p>' + esc(c.texto) + '</p>' +
        '<p><strong>' + items.length + ' artículos cargados</strong>, desde ' + formatearPrecio(desde) + '.</p>' +
        '<button type="button" class="btn btn--linea" data-cat-panel="' + c.id + '">Ver ' + esc(c.nom.toLowerCase()) + ' en el catálogo</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const botones = [...tabs.querySelectorAll('.pestana')];
  botones.forEach(b => b.addEventListener('click', () => {
    botones.forEach(o => o.setAttribute('aria-selected', String(o === b)));
    CATEGORIAS.forEach(c => {
      const panel = document.getElementById('panel-' + c.id);
      if (panel) panel.hidden = ('tab-' + c.id) !== b.id;
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
  cuerpo.querySelectorAll('[data-cat-panel]').forEach(b => b.addEventListener('click', () => irAlCatalogo({ cat: b.dataset.catPanel })));
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="carrito-vacio">' +
      '<p>Tu pedido está vacío. Empezá por la guía de talles o por el catálogo.</p>' +
      '<button type="button" class="btn btn--cta" data-cerrar-drawer>Ver el catálogo</button></div>';
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return '<div class="ci" data-linea="' + p.id + '">' +
        '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
        '<div><p class="ci-nom">' + esc(p.nombre) + '</p>' +
        '<p class="ci-rubro">' + esc(nombreCat(p.cat)) + (p.talle ? ' · talle ' + esc(p.talle === 'multi' ? 'regulable' : p.talle) : '') + '</p>' +
        '<div class="ci-bajo"><span class="stepper">' +
          '<button type="button" data-linea-paso="-1" aria-label="Quitar uno">−</button>' +
          '<input type="number" value="' + i.qty + '" min="1" max="99" inputmode="numeric" aria-label="Cantidad">' +
          '<button type="button" data-linea-paso="1" aria-label="Sumar uno">+</button>' +
        '</span><span class="ci-precio">' + formatearPrecio(precioFinal(p) * i.qty) + '</span></div></div>' +
        '<button type="button" class="ci-quitar" data-quitar aria-label="Quitar ' + esc(p.nombre) + ' del pedido">' +
          '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');
  }
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? '- ' + p.nombre + ' x ' + i.qty + ' (' + formatearPrecio(precioFinal(p) * i.qty) + ')' : '';
    }).filter(Boolean).join('\n');
    const texto = items.length
      ? 'Hola, quiero confirmar este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total())
      : 'Hola, quiero confirmar un pedido';
    wsp.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartHead')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);

  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('tienda')?.scrollIntoView({ block: 'start' }); return; }
    const linea = e.target.closest('.ci');
    if (!linea) return;
    const id = linea.dataset.linea;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const actual = Cart.get().find(i => i.id === id)?.qty ?? 1;
      const nueva = actual + parseInt(paso.dataset.lineaPaso, 10);
      if (nueva < 1) Cart.remove(id); else Cart.setQty(id, nueva);
      return;
    }
    if (e.target.closest('[data-quitar]')) { Cart.remove(id); showToast('Artículo quitado del pedido'); }
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.ci input');
    if (!input) return;
    Cart.setQty(input.closest('.ci').dataset.linea, parseInt(input.value, 10) || 1);
  });

  document.getElementById('finalizar')?.addEventListener('click', () => {
    if (!Cart.count()) { showToast('Sumá algún artículo antes de finalizar'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
  drawer.addEventListener('keydown', e => trapFoco(e, drawer));
}

/* ---------- ficha rápida ---------- */
function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalIn');
  if (!p || !modal || !bd || !inner) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const rel = PRODUCTOS.filter(o => o.cat === p.cat && o.id !== p.id).slice(0, 3);
  inner.innerHTML = '<div class="mv">' +
    '<div class="mv-media">' +
      '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<button type="button" class="mv-cerrar" data-cerrar-modal aria-label="Cerrar la ficha">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="mv-body">' +
      '<p class="mv-rubro">' + esc(nombreCat(p.cat)) + '</p>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="mv-desc">' + esc(p.desc) + '</p>' +
      '<ul class="mv-datos">' + (p.datos || []).map(d => '<li><span>' + esc(d[0]) + '</span><strong>' + esc(d[1]) + '</strong></li>').join('') +
        '<li><span>Disponibilidad</span><strong>' + (p.stock > 0 ? p.stock + ' en stock' : 'Sin stock por ahora') + '</strong></li>' +
      '</ul>' +
      '<div class="mv-precios">' +
        '<span class="mv-precio">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s><span class="flag flag--off">-' + p.descuento + '%</span>' : '') +
      '</div>' +
      '<div class="prod-actions mv-acc">' +
        stepperHTML(p.id, 'mv') +
        '<button type="button" class="btn btn--cta" data-add="' + p.id + '"' + (p.stock <= 0 ? ' disabled' : '') + '>' + (p.stock > 0 ? 'Sumar al pedido' : 'Sin stock') + '</button>' +
      '</div>' +
      '<a class="mv-consulta" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola, quiero consultar por ' + p.nombre) + '" target="_blank" rel="noopener">Consultar este artículo por WhatsApp</a>' +
    '</div>' +
    (rel.length ? '<div class="mv-rel"><p class="mv-rel-t">Del mismo rubro</p><div class="mv-rel-grid">' +
      rel.map(o => '<button type="button" class="mv-rel-card" data-vista="' + o.id + '">' +
        '<img src="' + o.img + '" width="900" height="900" alt="' + esc(o.alt) + '" decoding="async">' +
        '<span><span class="mv-rel-nom">' + esc(o.nombre) + '</span><br><span class="mv-rel-pre">' + formatearPrecio(precioFinal(o)) + '</span></span>' +
      '</button>').join('') + '</div></div>' : '') +
  '</div>';
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;
  modal.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  inner.querySelector('[data-cerrar-modal]')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrarModal();
    if (e.target.closest('[data-cerrar-modal]')) cerrarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });
  modal.addEventListener('keydown', e => trapFoco(e, modal));
}

function trapFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- acciones de producto ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('.stepper [data-paso]');
    if (paso) {
      const input = paso.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + parseInt(paso.dataset.paso, 10);
      input.value = Math.max(1, Math.min(99, n));
      return;
    }
    const vista = e.target.closest('[data-vista]');
    if (vista) { abrirModal(vista.dataset.vista); return; }
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(add));
      showToast('Sumado al pedido: ' + p.nombre);
    }
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
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
  sync();
}

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.cabecera').appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

/* ---------- reveals ---------- */
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ---------- sección firma: etapa por etapa con la escala de peso ---------- */
function initFirma() {
  const sec = document.getElementById('firma');
  const escena = document.getElementById('firmaEscena');
  const visual = document.getElementById('firmaVisual');
  const copy = document.getElementById('firmaCopy');
  const indice = document.getElementById('firmaIndice');
  const avance = document.getElementById('escalaAvance');
  const marca = document.getElementById('escalaMarca');
  if (!sec || !escena || !visual || !copy || !indice) return;

  copy.querySelectorAll('.cap-prod').forEach(slot => {
    const p = getProducto(slot.dataset.prod);
    if (!p) return;
    slot.innerHTML = '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<span class="cap-prod-txt">' +
        '<span class="cap-prod-nom">' + esc(p.nombre) + '</span>' +
        '<span class="cap-prod-precio">' + formatearPrecio(precioFinal(p)) + '</span>' +
      '</span>' +
      '<button type="button" class="prod-add" data-add="' + p.id + '">' +
        '<span class="add-largo">Sumar al pedido</span><span class="add-corto">Sumar</span>' +
      '</button>';
  });

  const fotos = [...visual.querySelectorAll('.cap-foto')];
  const caps = [...copy.querySelectorAll('.cap')];
  const items = [...indice.children];
  const total = caps.length;
  if (!total) return;

  if (reduceMotion) {
    items.forEach(li => li.classList.add('is-on'));
    return;
  }

  let raf = false, ultimo = -1;
  const pintar = () => {
    raf = false;
    const r = sec.getBoundingClientRect();
    const recorrido = sec.offsetHeight - window.innerHeight;
    const p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    const pct = (8 + p * 84).toFixed(1) + '%';
    if (avance) avance.style.width = pct;
    if (marca) marca.style.left = pct;
    const idx = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    if (idx === ultimo) return;
    ultimo = idx;
    fotos.forEach((f, i) => f.classList.toggle('is-on', i === idx));
    caps.forEach((c, i) => c.classList.toggle('is-on', i === idx));
    items.forEach((li, i) => li.classList.toggle('is-on', i === idx));
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- texto que se lee con el scroll ---------- */
function initLee() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => '<span data-w>' + esc(w) + '</span>').join(' ');
  if (reduceMotion) { el.querySelectorAll('[data-w]').forEach(s => s.classList.add('on')); return; }
  const spans = [...el.querySelectorAll('[data-w]')];
  let raf = false;
  const pintar = () => {
    raf = false;
    const r = el.getBoundingClientRect();
    const alto = window.innerHeight;
    const p = Math.min(1, Math.max(0, (alto * 0.82 - r.top) / (alto * 0.45)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- formularios ---------- */
function initFormularios() {
  const consulta = document.getElementById('formConsulta');
  if (consulta) {
    const nombre = document.getElementById('cNombre');
    const tel = document.getElementById('cTel');
    const err = document.getElementById('consultaErr');
    const btn = document.getElementById('consultaBtn');
    consulta.addEventListener('submit', e => {
      e.preventDefault();
      const okNombre = nombre.value.trim().length > 1;
      const okTel = tel.value.replace(/\D/g, '').length >= 8;
      nombre.setAttribute('aria-invalid', okNombre ? 'false' : 'true');
      tel.setAttribute('aria-invalid', okTel ? 'false' : 'true');
      if (err) err.hidden = okNombre && okTel;
      if (!okNombre || !okTel) { (okNombre ? tel : nombre).focus(); return; }
      const texto = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false; btn.textContent = texto;
        consulta.reset();
        nombre.setAttribute('aria-invalid', 'false'); tel.setAttribute('aria-invalid', 'false');
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      }, 800);
    });
  }

  const news = document.getElementById('formNews');
  if (news) {
    const input = document.getElementById('mail');
    const err = document.getElementById('mailErr');
    const btn = document.getElementById('newsBtn');
    news.addEventListener('submit', e => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (err) err.hidden = ok;
      if (!ok) { input.focus(); return; }
      const texto = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false; btn.textContent = texto;
        news.reset(); input.setAttribute('aria-invalid', 'false');
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      }, 800);
    });
  }
}

/* ---------- movimiento ---------- */
function initGsap() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const pill = document.querySelector('.talle-pill');
  if (pill) gsap.fromTo(pill, { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: .8, delay: .6, ease: 'power3.out' });

  if (typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  document.querySelectorAll('.rubro-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: img.closest('.rubro-card'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- arranque ---------- */
const elAnio = document.getElementById('anio');
if (elAnio) elAnio.textContent = new Date().getFullYear();

initRubros();
initGuia();
initRail();
initFiltros();
render();
initPestanas();
initReveals();
initNav();
initDrawer();
initModal();
initAcciones();
initFloats();
initFirma();
initLee();
initFormularios();
initGsap();

document.addEventListener('cart:updated', () => { updateCartBadge(); renderDrawer(); });
updateCartBadge();
renderDrawer();
