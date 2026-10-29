const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491139046200';
const MARCA = 'JS muebles y productos';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const TIPOS = [
  { id: 'muebles', nombre: 'Muebles', plural: 'muebles', bajada: 'Melamina de fabricación propia, en la medida y la placa que elijas.' },
  { id: 'electro', nombre: 'Electrodomésticos', plural: 'electrodomésticos', bajada: 'Heladera, lavarropas, cocina y microondas para equipar la casa.' },
];
const CATEGORIAS = [
  { id: 'placares', tipo: 'muebles', nombre: 'Placares', bajada: 'Dos puertas, del ancho que entre', img: 'images/p-placard-roble.webp' },
  { id: 'racks', tipo: 'muebles', nombre: 'Racks de TV', bajada: 'Con puertas y hueco central', img: 'images/p-rack-roble.webp' },
  { id: 'escritorios', tipo: 'muebles', nombre: 'Escritorios', bajada: 'Con cajonera incorporada', img: 'images/p-escritorio-roble.webp' },
  { id: 'cajoneras', tipo: 'muebles', nombre: 'Cajoneras', bajada: 'Cuatro cajones amplios', img: 'images/p-cajonera-roble.webp' },
  { id: 'cocina', tipo: 'muebles', nombre: 'Muebles de cocina', bajada: 'Bajo mesadas a medida', img: 'images/p-bajomesada-roble.webp' },
  { id: 'heladeras', tipo: 'electro', nombre: 'Heladeras', bajada: 'No Frost con freezer', img: 'images/p-heladera.webp' },
  { id: 'lavarropas', tipo: 'electro', nombre: 'Lavarropas', bajada: 'Automáticos de carga frontal', img: 'images/p-lavarropas.webp' },
  { id: 'cocinas', tipo: 'electro', nombre: 'Cocinas', bajada: 'Eléctricas con horno', img: 'images/p-cocina.webp' },
  { id: 'microondas', tipo: 'electro', nombre: 'Microondas', bajada: 'Digitales, de mesada', img: 'images/p-microondas.webp' },
];
const AMBIENTES = [
  { id: 'cocina', nombre: 'Cocina y lavadero', corto: 'la cocina', texto: 'El bajo mesada en la placa que elijas y los electros que completan la cocina y el lavadero.' },
  { id: 'dormitorio', nombre: 'Dormitorio', corto: 'el dormitorio', texto: 'Placares y cajoneras hechos al ancho de tu pared, en cuatro colores de placa.' },
  { id: 'living', nombre: 'Living y estudio', corto: 'el living', texto: 'Un rack para la tele y un escritorio con cajonera para trabajar o estudiar en casa.' },
];
const PLACAS = [
  { id: 'roble', nombre: 'Roble', hex: '#C9A57A' },
  { id: 'nogal', nombre: 'Nogal', hex: '#6E4C34' },
  { id: 'grafito', nombre: 'Grafito', hex: '#4B5057' },
  { id: 'blanco', nombre: 'Blanco', hex: '#ECEAE5' },
];
const PRECIOS = [
  { id: 'hasta250', nombre: 'Hasta $250.000', min: null, max: 250000 },
  { id: '250a600', nombre: '$250.000 a $600.000', min: 250001, max: 600000 },
  { id: 'mas600', nombre: 'Más de $600.000', min: 600001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];

const Tienda = crearTienda([
  { id: 'placard-dos-puertas-franja', nombre: 'Placard de Dos Puertas con Franja', corto: 'Placard', tipo: 'muebles', cat: 'placares', amb: 'dormitorio', rango: 1,
    placas: ['roble', 'nogal', 'grafito', 'blanco'], foto: 'placard',
    medidas: [{ id: '80', a: 80, h: 180, p: 50, precio: 389000 }, { id: '100', a: 100, h: 200, p: 55, precio: 459000 }, { id: '120', a: 120, h: 200, p: 55, precio: 529000 }],
    alt: 'Placard blanco de dos puertas con una franja vertical de melamina {placa} y tiradores negros',
    desc: 'Cuerpo blanco y una franja central en la placa que elijas. Por dentro lleva barral y estantes; la distribución la definimos con vos.',
    tags: 'placard ropero armario guardarropa ropa dormitorio puertas' },
  { id: 'rack-tv-patas-de-hierro', nombre: 'Rack de TV con Patas de Hierro', corto: 'Rack de TV', tipo: 'muebles', cat: 'racks', amb: 'living', rango: 2,
    placas: ['roble', 'nogal', 'grafito', 'blanco'], foto: 'rack',
    medidas: [{ id: '140', a: 140, h: 45, p: 40, precio: 189000 }, { id: '160', a: 160, h: 45, p: 40, precio: 209000 }, { id: '180', a: 180, h: 45, p: 40, precio: 229000 }],
    alt: 'Rack de TV bajo de melamina {placa} con dos puertas, hueco central con estante y base de hierro negro',
    desc: 'Dos puertas a los costados, un hueco central con estante para el deco o la consola y base de hierro negro.',
    tags: 'rack tv television televisor tele mueble bajo living' },
  { id: 'escritorio-con-cajonera', nombre: 'Escritorio con Cajonera de Tres Cajones', corto: 'Escritorio', tipo: 'muebles', cat: 'escritorios', amb: 'living', rango: 3,
    placas: ['roble', 'nogal', 'blanco'], foto: 'escritorio',
    medidas: [{ id: '100', a: 100, h: 75, p: 50, precio: 169000 }, { id: '120', a: 120, h: 75, p: 55, precio: 189000 }, { id: '140', a: 140, h: 75, p: 60, precio: 209000 }],
    alt: 'Escritorio blanco con tapa de melamina {placa} y cajonera de tres cajones a la derecha',
    desc: 'Cuerpo blanco, tapa en la placa que elijas y cajonera de tres cajones. El de 100 cm entra en un rincón del dormitorio.',
    tags: 'escritorio home office computadora mesa estudio trabajo' },
  { id: 'cajonera-cuatro-cajones', nombre: 'Cajonera de Cuatro Cajones', corto: 'Cajonera', tipo: 'muebles', cat: 'cajoneras', amb: 'dormitorio', rango: 4,
    placas: ['roble', 'nogal', 'grafito', 'blanco'], foto: 'cajonera',
    medidas: [{ id: '60', a: 60, h: 80, p: 45, precio: 159000 }, { id: '80', a: 80, h: 90, p: 45, precio: 189000 }],
    alt: 'Cajonera de melamina {placa} con cuatro cajones y tiradores negros',
    desc: 'Cuatro cajones amplios con tirador negro, entera en la placa que elijas. Para el dormitorio, el vestidor o el pasillo.',
    tags: 'cajonera comoda cajones chifonier dormitorio ropa' },
  { id: 'bajo-mesada-tres-puertas', nombre: 'Bajo Mesada de Tres Puertas con Cajón', corto: 'Bajo mesada', tipo: 'muebles', cat: 'cocina', amb: 'cocina', rango: 5,
    placas: ['roble', 'grafito', 'blanco'], foto: 'bajomesada',
    medidas: [{ id: '100', a: 100, h: 85, p: 60, precio: 199000 }, { id: '120', a: 120, h: 85, p: 60, precio: 229000 }, { id: '140', a: 140, h: 85, p: 60, precio: 259000 }],
    alt: 'Bajo mesada blanco de tres puertas y un cajón con tapa de melamina {placa}',
    desc: 'Tres puertas, un cajón para los cubiertos y tapa en la placa que elijas. Se arma a la medida del hueco de tu cocina.',
    tags: 'bajo mesada cocina alacena mueble de cocina mesada' },
  { id: 'heladera-no-frost-320', nombre: 'Heladera No Frost con Freezer Superior 320 L', corto: 'Heladera', tipo: 'electro', cat: 'heladeras', amb: 'cocina', rango: 6,
    specs: ['No Frost', '320 litros', 'Freezer arriba'], img: 'images/p-heladera.webp',
    medidas: [{ id: 'u', a: 60, h: 175, p: 65, precio: 1049000 }],
    alt: 'Heladera blanca de dos puertas con freezer arriba',
    desc: 'Dos puertas, freezer arriba y frío seco que no forma escarcha. Mide 60 cm de ancho: entra en el hueco estándar de la cocina.',
    tags: 'heladera refrigerador freezer frio no frost' },
  { id: 'lavarropas-carga-frontal-8kg', nombre: 'Lavarropas Automático de Carga Frontal 8 kg', corto: 'Lavarropas', tipo: 'electro', cat: 'lavarropas', amb: 'cocina', rango: 7,
    specs: ['8 kg', 'Carga frontal', 'Panel digital'], img: 'images/p-lavarropas.webp',
    medidas: [{ id: 'u', a: 60, h: 85, p: 55, precio: 899000 }],
    alt: 'Lavarropas automático blanco de carga frontal con panel digital',
    desc: 'Carga frontal para 8 kg de ropa, perilla de programas y panel digital con el tiempo que falta. Va en el lavadero o bajo la mesada.',
    tags: 'lavarropas lavarropa lavadora ropa lavadero automatico' },
  { id: 'cocina-vitroceramica-4-zonas', nombre: 'Cocina Eléctrica Vitrocerámica de 4 Zonas', corto: 'Cocina eléctrica', tipo: 'electro', cat: 'cocinas', amb: 'cocina', rango: 8,
    specs: ['Vitrocerámica', '4 zonas', 'Horno eléctrico'], img: 'images/p-cocina.webp',
    medidas: [{ id: 'u', a: 60, h: 85, p: 60, precio: 879000 }],
    alt: 'Cocina eléctrica blanca con anafe vitrocerámico de cuatro zonas y horno',
    desc: 'Anafe vitrocerámico de cuatro zonas, cuatro perillas y horno eléctrico con dos estantes. Se limpia con un paño.',
    tags: 'cocina horno anafe vitroceramica electrica hornallas' },
  { id: 'microondas-digital-28', nombre: 'Microondas Digital de 28 L en Acero', corto: 'Microondas', tipo: 'electro', cat: 'microondas', amb: 'cocina', rango: 9, descuento: 10,
    specs: ['28 litros', 'Panel digital', 'Acero'], img: 'images/p-microondas.webp',
    medidas: [{ id: 'u', a: 52, h: 31, p: 42, precio: 259000 }],
    alt: 'Microondas de acero inoxidable con puerta espejada y panel digital',
    desc: 'Frente de acero, panel digital con perilla y 28 litros de capacidad. Entra sobre la mesada o en un hueco de la alacena.',
    tags: 'microondas micro horno calentar mesada' },

  { id: 'alacena-borrador', nombre: 'Alacena de Dos Puertas', corto: 'Alacena', tipo: 'muebles', cat: 'cocina', amb: 'cocina', rango: 99, visible: false,
    placas: ['blanco'], foto: 'bajomesada', medidas: [{ id: '80', a: 80, h: 60, p: 30, precio: 0 }], alt: 'Próximamente', desc: 'Próximamente.', tags: '' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const textoTipo = { muebles: 'mueble muebles melamina a medida', electro: 'electrodomestico electrodomesticos electro electros' };
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.corto, textoTipo[p.tipo], CATEGORIAS.find(c => c.id === p.cat)?.nombre, (p.specs || []).join(' '), (p.placas || []).join(' '), p.desc, p.tags,
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => Math.min(...p.medidas.map(m => m.precio));
  const final = p => (p.descuento > 0 ? Math.round(desde(p) * (1 - p.descuento / 100)) : desde(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function indexable(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.amb && p.amb !== f.amb) return false;
    if (f.placa && !(p.placas || []).includes(f.placa)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function leerPagina(ordenados, cursor, n) {
    let i = 0;
    if (cursor != null) {
      const k = ordenados.findIndex(p => p.id === cursor);
      i = k < 0 ? ordenados.length : k + 1;
    }
    const items = ordenados.slice(i, i + limitar(n));
    const hayMas = i + items.length < ordenados.length;
    return { items, cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const base = visibles.filter(p => indexable(p, filtros)).sort(comparador(orden));
    if (!filtros.q) {
      const pag = leerPagina(base, cursor, lim);
      return { items: pag.items.map(copia), cursor: pag.cursor, paginas: 1 };
    }
    const encontrados = [];
    let c = cursor, ultimo = cursor, paginas = 0, fin = false;
    while (encontrados.length < lim) {
      const pag = leerPagina(base, c, tope);
      paginas++;
      for (const p of pag.items) {
        ultimo = p.id;
        if (coincideTexto(p, filtros.q)) {
          encontrados.push(p);
          if (encontrados.length === lim) break;
        }
      }
      if (encontrados.length === lim) break;
      if (!pag.cursor) { fin = true; break; }
      c = pag.cursor;
    }
    const resto = !fin && ultimo != null && base.findIndex(p => p.id === ultimo) < base.length - 1;
    return { items: encontrados.map(copia), cursor: resto ? ultimo : null, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (indexable(p, filtros) && (!filtros.q || coincideTexto(p, filtros.q)) ? 1 : 0), 0);
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
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const esMueble = p => p.tipo === 'muebles';
const medidaDe = (p, id) => p.medidas.find(m => m.id === id) || p.medidas[0];
const precioBase = (p, id) => medidaDe(p, id).precio;
const precioMedida = (p, id) => (p.descuento > 0 ? Math.round(precioBase(p, id) * (1 - p.descuento / 100)) : precioBase(p, id));
const precioDesde = p => Math.min(...p.medidas.map(m => precioMedida(p, m.id)));
const txtMedida = m => `${m.a} × ${m.h} × ${m.p} cm`;
const placaOk = (p, pl) => ((p.placas || []).includes(pl) ? pl : (p.placas?.[0] || ''));
const nombrePlaca = id => nombreDe(PLACAS, id).toLowerCase();
const imgDe = (p, pl) => (p.foto ? `images/p-${p.foto}-${placaOk(p, pl)}.webp` : p.img);
const altDe = (p, pl) => (p.foto ? p.alt.replace('{placa}', nombrePlaca(placaOk(p, pl))) : p.alt);
const leerOp = op => { const [med = '', placa = ''] = String(op || '').split('|'); return { med, placa }; };
const opDe = (p, med, placa) => (esMueble(p) ? `${medidaDe(p, med).id}|${placaOk(p, placa)}` : '');
const txtOp = (p, op) => {
  if (!esMueble(p)) return txtMedida(p.medidas[0]);
  const { med, placa } = leerOp(op);
  return `${txtMedida(medidaDe(p, med))}, placa ${nombrePlaca(placaOk(p, placa))}`;
};
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;

const Cart = {
  KEY: 'jsmuebles_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, 10);
    else items.push({ id: producto.id, op, qty: Math.min(qty, 10) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 10)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioMedida(p, leerOp(i.op).med) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  sillon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2M20 18v2M12 4v9"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function precioHTML(p, med, clase = 'precio__final') {
  return `<span class="${clase}" data-precio-card>${formatearPrecio(precioMedida(p, med))}</span>${p.descuento > 0 ? `<s class="precio__antes" data-precio-antes>${formatearPrecio(precioBase(p, med))}</s>` : ''}`;
}

function placasCardHTML(p, pl) {
  return `<div class="prod__placas" role="group" aria-label="Color de placa">${p.placas.map(x => `<button type="button" class="placa-dot" data-placa-card="${x}" aria-pressed="${x === pl}" aria-label="Placa ${esc(nombrePlaca(x))}"><i style="background-image:url(images/sw-${x}.webp)"></i></button>`).join('')}</div>`;
}

function cardHTML(p, placaSel = '') {
  const nombre = esc(p.nombre);
  const mueble = esMueble(p);
  const pl = mueble ? placaOk(p, placaSel) : '';
  const m0 = p.medidas[0];
  return `<article class="prod${mueble ? '' : ' prod--electro'}" data-prod="${p.id}" data-placa="${pl}">
    <div class="prod__media">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${imgDe(p, pl)}" alt="${esc(altDe(p, pl))}" width="800" height="800" decoding="async" data-prod-img></a>
      <span class="prod__chip${mueble ? '' : ' prod__chip--spec'}">${mueble ? 'Fabricación propia' : esc(p.specs[0])}</span>
      ${p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : ''}
    </div>
    <div class="prod__body">
      <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}${mueble ? ` · ${p.medidas.length} medidas` : ''}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${mueble ? placasCardHTML(p, pl) : `<ul class="prod__specs">${p.specs.slice(1).map(s => `<li>${esc(s)}</li>`).join('')}</ul>`}
      <p class="precio">${precioHTML(p, m0.id)}</p>
      <div class="prod__acciones">
        ${mueble ? `<label class="var-sel"><span class="sr-only">Ancho de ${nombre}</span><select data-op>${p.medidas.map(m => `<option value="${m.id}">${m.a} cm</option>`).join('')}</select></label>` : stepperHTML(5)}
        <button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button>
      </div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function miniHTML(p, pl) {
  return `<button type="button" class="mini" data-qv-abrir="${p.id}" data-qv-placa="${pl}">
    <span class="mini__foto"><img src="${imgDe(p, pl)}" alt="${esc(altDe(p, pl))}" width="600" height="600" decoding="async" data-mini-img></span>
    <span class="mini__nombre">${esc(p.corto)}</span>
    <span class="mini__precio">desde ${formatearPrecio(precioDesde(p))}</span>
  </button>`;
}

function filaHTML(p, i) {
  const mueble = esMueble(p);
  const anchos = p.medidas.map(m => m.a);
  const meta = mueble ? `${nombreDe(CATEGORIAS, p.cat)} · de ${Math.min(...anchos)} a ${Math.max(...anchos)} cm · ${p.placas.length} placas` : p.specs.join(' · ');
  return `<li data-animate="der" style="opacity:0;transform:translateX(48px)"><div class="fila" data-fila="${p.id}">
    <span class="fila__n">${String(i + 1).padStart(2, '0')}</span>
    <a class="fila__mini" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${imgDe(p)}" alt="" width="120" height="120" decoding="async"></a>
    <span class="fila__txt"><a class="fila__nombre" href="${urlProducto(p)}" data-qv="${p.id}">${esc(p.nombre)}</a><span class="fila__meta">${esc(meta)}</span></span>
    <span class="fila__precio">${mueble ? '<small>desde</small>' : ''}${formatearPrecio(precioDesde(p))}</span>
    <button type="button" class="fila__add" data-add-rapido="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICON.carritoMas}</button>
  </div></li>`;
}

let revealsListos = false;
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  const cajas = [...document.querySelectorAll('[data-nav-cats]')];
  cajas.forEach(box => {
    const tipo = box.dataset.navCats;
    const t = TIPOS.find(x => x.id === tipo);
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel || !t) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.filter(c => c.tipo === tipo).map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-pie">${tipo === 'muebles' ? `<a class="cats-medida" href="${HOME_URL}#a-medida">¿Otra medida? Pedilo a medida</a>` : `<p class="cats-pie__txt">${esc(t.bajada)}</p>`}<a class="cats-todo" href="${CATALOGO_URL}?tipo=${tipo}">Ver ${t.plural} ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => {
      clearTimeout(timer);
      cajas.forEach(o => { if (o !== box) { o.classList.remove('open'); o.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); } });
      box.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('.cats-medida') && PAGINA === 'home') cerrar(); });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 44, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-indice li'), { x: -28, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.hero-ficha'), { y: 30, opacity: 0, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, 0.85);
}

function pintarConteos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioDesde(p));
  });
  document.querySelectorAll('[data-amb-n]').forEach(el => {
    const n = Tienda.contar({ amb: el.dataset.ambN });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-amb-num]').forEach(el => { el.textContent = Tienda.contar({ amb: el.dataset.ambNum }); });
}

function initToggle() {
  const box = document.getElementById('prodToggle');
  const grid = document.getElementById('prodGrid');
  if (!box || !grid) return;
  const link = document.getElementById('prodLink');
  const tabs = [...box.querySelectorAll('[data-ver]')];
  const pintar = (tipo, foco) => {
    tabs.forEach(t => { const on = t.dataset.ver === tipo; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    box.classList.toggle('is-electro', tipo === 'electro');
    const activa = tabs.find(t => t.dataset.ver === tipo);
    document.getElementById('prodPanel')?.setAttribute('aria-labelledby', activa.id);
    grid.innerHTML = Tienda.consultar({ filtros: { tipo }, limite: 4 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
    if (link) {
      link.href = `${CATALOGO_URL}?tipo=${tipo}`;
      const lbl = link.querySelector('[data-link-lbl]');
      if (lbl) lbl.textContent = tipo === 'electro' ? 'Ver todos los electrodomésticos' : 'Ver todos los muebles';
    }
    revelarNuevos(grid);
    refrescarTriggers();
    if (foco) activa.focus();
  };
  tabs.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-selected') !== 'true') pintar(t.dataset.ver); }));
  box.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const actual = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const sig = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (actual + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    pintar(tabs[sig].dataset.ver, true);
  });
  pintar('muebles');
}

function initAmbientes() {
  const tabsBox = document.getElementById('ambTabs');
  const lista = document.getElementById('ambLista');
  if (!tabsBox || !lista) return;
  const foto = document.getElementById('ambFoto');
  const cap = document.getElementById('ambCap');
  const texto = document.getElementById('ambTexto');
  const link = document.getElementById('ambLink');
  const tabs = [...tabsBox.querySelectorAll('[data-amb]')];
  let fotoActual = '';
  const mostrarFoto = id => {
    const p = getProducto(id);
    if (!p || !foto || id === fotoActual) return;
    fotoActual = id;
    lista.querySelectorAll('[data-fila]').forEach(f => f.classList.toggle('is-activa', f.dataset.fila === id));
    foto.classList.add('cambia');
    setTimeout(() => {
      foto.src = imgDe(p);
      foto.alt = altDe(p);
      if (cap) cap.innerHTML = `<strong>${esc(p.corto)}</strong><span>${esMueble(p) ? 'desde ' : ''}${formatearPrecio(precioDesde(p))}</span>`;
      foto.classList.remove('cambia');
    }, reduceMotion ? 0 : 160);
  };
  const pintar = (amb, foco) => {
    const a = AMBIENTES.find(x => x.id === amb) || AMBIENTES[0];
    tabs.forEach(t => { const on = t.dataset.amb === a.id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    const activa = tabs.find(t => t.dataset.amb === a.id);
    document.getElementById('ambPanel')?.setAttribute('aria-labelledby', activa.id);
    if (texto) texto.textContent = a.texto;
    const items = Tienda.consultar({ filtros: { amb: a.id }, limite: 8 }).items;
    lista.innerHTML = items.map(filaHTML).join('');
    if (link) {
      link.href = `${CATALOGO_URL}?amb=${a.id}`;
      const lbl = link.querySelector('[data-link-lbl]');
      if (lbl) lbl.textContent = `Ver todo para ${a.corto}`;
    }
    fotoActual = '';
    if (items[0]) mostrarFoto(items[0].id);
    revelarNuevos(lista);
    refrescarTriggers();
    if (foco) activa.focus();
  };
  tabs.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-selected') !== 'true') pintar(t.dataset.amb); }));
  tabsBox.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const actual = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const sig = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (actual + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    pintar(tabs[sig].dataset.amb, true);
  });
  lista.addEventListener('pointerover', e => { const f = e.target.closest('[data-fila]'); if (f) mostrarFoto(f.dataset.fila); });
  lista.addEventListener('focusin', e => { const f = e.target.closest('[data-fila]'); if (f) mostrarFoto(f.dataset.fila); });
  document.querySelectorAll('[data-ir-amb]').forEach(a => a.addEventListener('click', () => pintar(a.dataset.irAmb)));
  pintar('cocina');
}

function initMuestrario() {
  const box = document.getElementById('muestrario');
  const lista = document.getElementById('muestrarioLista');
  if (!box || !lista) return;
  const foto = document.getElementById('muestrarioFoto');
  const cta = document.getElementById('muestrarioCta');
  const n = Number(lista.dataset.n) || 3;
  const botones = [...box.querySelectorAll('[data-muestra]')];
  let ids = '';
  let precargado = false;
  const precargar = () => {
    if (precargado) return;
    precargado = true;
    PLACAS.forEach(pl => { const im = new Image(); im.src = `images/placard-alto-${pl.id}.webp`; });
  };
  const cambiar = (img, src, alt) => {
    if (img.getAttribute('src') === src) return;
    img.classList.add('cambia');
    setTimeout(() => { img.src = src; img.alt = alt; img.classList.remove('cambia'); }, reduceMotion ? 0 : 170);
  };
  const pintar = pl => {
    const placa = PLACAS.find(x => x.id === pl) || PLACAS[0];
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.muestra === placa.id)));
    box.style.setProperty('--placa', placa.hex);
    box.querySelectorAll('[data-placa-nombre]').forEach(el => { el.textContent = placa.nombre.toLowerCase(); });
    if (foto) cambiar(foto, `images/placard-alto-${placa.id}.webp`, `Placard blanco de dos puertas con franja de melamina ${placa.nombre.toLowerCase()}`);
    const items = Tienda.consultar({ filtros: { tipo: 'muebles', placa: placa.id, excluir: foto ? ['placard-dos-puertas-franja'] : [] }, limite: n }).items;
    const nuevos = items.map(p => p.id).join(',');
    if (nuevos !== ids) {
      ids = nuevos;
      lista.innerHTML = items.map(p => `<li data-animate="escala" style="opacity:0;transform:scale(.92)">${miniHTML(p, placa.id)}</li>`).join('');
      revelarNuevos(lista);
    } else {
      lista.querySelectorAll('.mini').forEach(b => {
        const p = getProducto(b.dataset.qvAbrir);
        if (!p) return;
        b.dataset.qvPlaca = placa.id;
        const img = b.querySelector('[data-mini-img]');
        if (img) cambiar(img, imgDe(p, placa.id), altDe(p, placa.id));
      });
    }
    if (cta) {
      cta.href = `${CATALOGO_URL}?tipo=muebles&placa=${placa.id}`;
      const lbl = cta.querySelector('[data-link-lbl]');
      if (lbl) lbl.textContent = `Ver los muebles en ${placa.nombre.toLowerCase()}`;
    }
  };
  botones.forEach(b => {
    b.addEventListener('click', () => { precargar(); pintar(b.dataset.muestra); });
    b.addEventListener('pointerenter', precargar, { once: true });
  });
  pintar('roble');
}

const MEDIDA_TIPOS = {
  placard: { nombre: 'Placard', dims: [120, 200, 55] },
  rack: { nombre: 'Rack de TV', dims: [160, 45, 40] },
  escritorio: { nombre: 'Escritorio', dims: [120, 75, 55] },
  cajonera: { nombre: 'Cajonera', dims: [80, 90, 45] },
  cocina: { nombre: 'Mueble de cocina', dims: [120, 85, 60] },
  otro: { nombre: 'Otro mueble', dims: [100, 100, 50] },
};
const LIMITES = { ancho: [20, 400], alto: [20, 260], prof: [20, 120] };

function initMedida() {
  const form = document.getElementById('medidaForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const ancho = $('mAncho'), alto = $('mAlto'), prof = $('mProf');
  const pieza = $('mPieza'), aviso = $('mAviso'), wsp = $('mWsp');
  let tipoPrevio = '';
  const leer = () => ({
    tipo: form.querySelector('[name="m-tipo"]:checked')?.value || 'placard',
    placa: form.querySelector('[name="m-placa"]:checked')?.value || 'roble',
    ancho: Math.round(Number(ancho.value)), alto: Math.round(Number(alto.value)), prof: Math.round(Number(prof.value)),
    loc: $('mLocalidad').value.trim(), nota: $('mNota').value.trim(),
  });
  const fuera = (v, [min, max]) => !(v >= min && v <= max);
  const pintar = () => {
    const o = leer();
    const t = MEDIDA_TIPOS[o.tipo] || MEDIDA_TIPOS.placard;
    if (o.tipo !== tipoPrevio) {
      if (tipoPrevio) { [ancho.value, alto.value, prof.value] = t.dims; Object.assign(o, { ancho: t.dims[0], alto: t.dims[1], prof: t.dims[2] }); }
      tipoPrevio = o.tipo;
    }
    const errores = [];
    [[ancho, 'ancho', o.ancho], [alto, 'alto', o.alto], [prof, 'prof', o.prof]].forEach(([inp, k, v]) => {
      const mal = fuera(v, LIMITES[k]);
      inp.setAttribute('aria-invalid', String(mal));
      if (mal) errores.push(`${k === 'prof' ? 'la profundidad' : `el ${k}`}: entre ${LIMITES[k][0]} y ${LIMITES[k][1]} cm`);
    });
    aviso.textContent = errores.length ? `Revisá ${errores.join(' y ')}.` : '';
    wsp.setAttribute('aria-disabled', String(!!errores.length));
    const placa = PLACAS.find(x => x.id === o.placa) || PLACAS[0];
    if (!errores.length && pieza) {
      const k = Math.min(100 / o.ancho, 100 / o.alto);
      pieza.style.setProperty('--w', `${(o.ancho * k).toFixed(2)}%`);
      pieza.style.setProperty('--h', `${(o.alto * k).toFixed(2)}%`);
      pieza.style.setProperty('--sw', `url(images/sw-${placa.id}.webp)`);
      $('mCotaA').textContent = `${o.ancho} cm`;
      $('mCotaH').textContent = `${o.alto} cm`;
    }
    $('mMueble').textContent = t.nombre;
    $('mMedidas').textContent = `${o.ancho || '—'} × ${o.alto || '—'} × ${o.prof || '—'} cm`;
    $('mPlaca').textContent = placa.nombre;
    $('mEntrega').textContent = o.loc || 'A coordinar';
    const msg = [`Hola ${MARCA}! Quiero pedir un mueble a medida:`,
      `- Mueble: ${t.nombre}`,
      `- Medidas: ${o.ancho} cm de ancho × ${o.alto} cm de alto × ${o.prof} cm de profundidad`,
      `- Placa: ${placa.nombre}`,
      `- Entrega en: ${o.loc || 'a coordinar'}`,
      ...(o.nota ? [`- Detalle: ${o.nota}`] : []),
      '¿Me pasan el presupuesto?'].join('\n');
    wsp.href = wspHref(msg);
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => { e.preventDefault(); pintar(); if (wsp.getAttribute('aria-disabled') !== 'true') window.open(wsp.href, '_blank', 'noopener'); });
  wsp.addEventListener('click', e => {
    if (wsp.getAttribute('aria-disabled') === 'true') { e.preventDefault(); showToast('Revisá las medidas antes de mandar el pedido.'); }
  });
  pintar();
}

const QV = { p: null, med: '', placa: '', opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const mueble = esMueble(p);
  const m = medidaDe(p, QV.med);
  const cat = nombreDe(CATEGORIAS, p.cat);
  let rel = Tienda.consultar({ filtros: { tipo: p.tipo, excluir: p.id }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const op = opDe(p, m.id, QV.placa);
  const msg = mueble
    ? `Hola ${MARCA}! Quiero consultar por ${p.nombre} (${txtOp(p, op)}). ¿Se puede hacer en otra medida?`
    : `Hola ${MARCA}! Quiero consultar por ${p.nombre}. ¿Cómo coordinamos la entrega?`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${imgDe(p, QV.placa)}" alt="${esc(altDe(p, QV.placa))}" width="800" height="800"></div>
        ${mueble ? `<p class="qv__placa-txt">Placa <strong>${esc(nombrePlaca(placaOk(p, QV.placa)))}</strong></p>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat)} · ${mueble ? 'Fabricación propia' : 'Electrodoméstico'}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="precio">${precioHTML(p, m.id)}${mueble ? `<span class="precio__nota">en ${esc(txtMedida(m))}</span>` : ''}</p>
        <p class="qv__desc">${esc(p.desc)}</p>
        ${mueble ? `<div>
          <p class="f-grupo__titulo">Medida <small>ancho × alto × profundidad</small></p>
          <div class="qv__meds" role="group" aria-label="Elegí la medida">${p.medidas.map(x => `<button type="button" class="qv__med" data-qv-med="${x.id}" aria-pressed="${x.id === m.id}"><strong>${esc(txtMedida(x))}</strong><span>${formatearPrecio(precioMedida(p, x.id))}</span></button>`).join('')}</div>
        </div>
        <div>
          <p class="f-grupo__titulo">Color de placa</p>
          <div class="qv__placas" role="group" aria-label="Elegí el color de placa">${p.placas.map(x => `<button type="button" class="qv__placa" data-qv-placa-sel="${x}" aria-pressed="${x === placaOk(p, QV.placa)}"><i style="background-image:url(images/sw-${x}.webp)" aria-hidden="true"></i>${esc(nombreDe(PLACAS, x))}</button>`).join('')}</div>
        </div>` : `<dl class="qv__ficha">${p.specs.map(s => `<div><dt class="sr-only">Característica</dt><dd>${esc(s)}</dd></div>`).join('')}<div><dt>Medidas</dt><dd>${esc(txtMedida(m))}</dd></div></dl>`}
        <div class="qv__compra">
          ${stepperHTML(mueble ? 10 : 5)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}${mueble ? 'Consultar otra medida por WhatsApp' : 'Consultar por WhatsApp'}</a>
          ${mueble ? `<a class="qv__medida" href="${HOME_URL}#a-medida">Pedirlo a medida</a>` : ''}
        </div>
        <p class="qv__nota">${mueble ? 'Se fabrica a pedido: el plazo y la entrega se confirman por WhatsApp.' : 'La entrega se coordina por WhatsApp.'}</p>
        ${rel.length ? `<div class="qv__rel"><h3>${mueble ? 'Más muebles' : 'Más electrodomésticos'}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${imgDe(r)}" alt="" width="400" height="400"></span><span>${esc(r.corto)}</span><span class="precio__final">${esMueble(r) ? 'desde ' : ''}${formatearPrecio(precioDesde(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(imgDe(p, QV.placa), location.href).href, category: cat, brand: { '@type': 'Brand', name: MARCA },
    offers: mueble
      ? { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.medidas.map(x => precioMedida(p, x.id))), offerCount: p.medidas.length, availability: 'https://schema.org/MadeToOrder' }
      : { '@type': 'Offer', priceCurrency: 'ARS', price: precioMedida(p, m.id), availability: 'https://schema.org/InStock' },
  });
}
function abrirQV(id, opener, med = '', placa = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.med = medidaDe(p, med).id; QV.placa = esMueble(p) ? placaOk(p, placa) : '';
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (e.target.closest('.qv__medida') && PAGINA === 'home') { cerrarQV(); return; }
    const med = e.target.closest('[data-qv-med]');
    if (med) { QV.med = med.dataset.qvMed; renderQV(); modal.querySelector(`[data-qv-med="${QV.med}"]`)?.focus(); return; }
    const placa = e.target.closest('[data-qv-placa-sel]');
    if (placa) { QV.placa = placa.dataset.qvPlacaSel; renderQV(); modal.querySelector(`[data-qv-placa-sel="${QV.placa}"]`)?.focus(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const op = opDe(p, QV.med, QV.placa);
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.corto} (${txtOp(p, op)}) al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  const precio = precioMedida(p, leerOp(op).med);
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${imgDe(p, leerOp(op).placa)}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(txtOp(p, op))}</p>
      ${stepperHTML(10, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precio * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.sillon}<p>Tu carrito está vacío. Elegí un mueble con su medida y su placa, o un electrodoméstico, y aparece acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${txtOp(p, i.op)}): ${formatearPrecio(precioMedida(p, leerOp(i.op).med) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, 'Entrega en: '].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('.prod [data-op]');
    if (!sel) return;
    const card = sel.closest('.prod');
    const p = getProducto(card?.dataset.prod);
    if (!p) return;
    const precio = card.querySelector('[data-precio-card]');
    const antes = card.querySelector('[data-precio-antes]');
    if (precio) precio.textContent = formatearPrecio(precioMedida(p, sel.value));
    if (antes) antes.textContent = formatearPrecio(precioBase(p, sel.value));
  });
  document.addEventListener('click', e => {
    const dot = e.target.closest('[data-placa-card]');
    if (dot) {
      const card = dot.closest('.prod');
      const p = getProducto(card?.dataset.prod);
      if (!p) return;
      const pl = placaOk(p, dot.dataset.placaCard);
      card.dataset.placa = pl;
      card.querySelectorAll('[data-placa-card]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.placaCard === pl)));
      const img = card.querySelector('[data-prod-img]');
      if (img) {
        img.classList.add('cambia');
        setTimeout(() => { img.src = imgDe(p, pl); img.alt = altDe(p, pl); img.classList.remove('cambia'); }, reduceMotion ? 0 : 150);
      }
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) {
      e.preventDefault();
      const card = qv.closest('.prod');
      const med = card?.querySelector('[data-op]')?.value || '';
      abrirQV(qv.dataset.qv, qv, med, card?.dataset.placa || '');
      return;
    }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, '', abrir.dataset.qvPlaca || ''); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 10;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const rapido = e.target.closest('[data-add-rapido]');
    if (rapido) {
      const p = getProducto(rapido.dataset.addRapido);
      if (!p) return;
      const op = opDe(p, '', '');
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.corto} (${txtOp(p, op)}) al carrito.`);
      rapido.classList.add('is-ok');
      setTimeout(() => rapido.classList.remove('is-ok'), 700);
      return;
    }
    const add = e.target.closest('[data-add]');
    const comprar = e.target.closest('[data-comprar]');
    if (add || comprar) {
      const btn = add || comprar;
      const card = btn.closest('.prod');
      const p = getProducto(add ? add.dataset.add : comprar.dataset.comprar);
      if (!p || !card) return;
      const op = opDe(p, card.querySelector('[data-op]')?.value || '', card.dataset.placa || '');
      const qty = Number(card.querySelector('.stepper output')?.textContent) || 1;
      Cart.add(p, qty, op);
      if (comprar) { abrirCarrito(); return; }
      showToast(`Sumaste ${p.corto} (${txtOp(p, op)}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const multi = (v, arr) => String(v || '').split(',').filter(x => arr.some(c => c.id === x));
  const e = {
    tipo: valido(params.get('tipo'), TIPOS), cat: multi(params.get('cat'), CATEGORIAS), amb: valido(params.get('amb'), AMBIENTES),
    placa: valido(params.get('placa'), PLACAS), precio: valido(params.get('precio'), PRECIOS),
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const ajustar = () => {
    if (e.tipo) e.cat = e.cat.filter(c => CATEGORIAS.find(x => x.id === c)?.tipo === e.tipo);
    if (e.tipo === 'electro') e.placa = '';
  };
  ajustar();
  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsTipo');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.tipo) f.tipo = e.tipo;
    if (e.cat.length) f.cat = e.cat;
    if (e.amb) f.amb = e.amb;
    if (e.placa) f.placa = e.placa;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo, extra = '') => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}>${extra}<span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.tipo ? { tipo: e.tipo } : {};
    const cats = CATEGORIAS.filter(c => !e.tipo || c.tipo === e.tipo);
    cuerpo.innerHTML = [
      `<fieldset class="f-grupo"><legend>Qué buscás</legend>
        ${opcion('radio', 'tipo', '', 'Todo', !e.tipo, Tienda.contar({}), 'tipo')}
        ${TIPOS.map(t => opcion('radio', 'tipo', t.id, esc(t.nombre), e.tipo === t.id, Tienda.contar({ tipo: t.id }), 'tipo')).join('')}</fieldset>`,
      `<fieldset class="f-grupo"><legend>Categoría</legend>
        ${cats.map(c => opcion('checkbox', `cat-${c.id}`, c.id, esc(c.nombre), e.cat.includes(c.id), Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`,
      e.tipo === 'electro' ? '' : `<fieldset class="f-grupo"><legend>Color de placa</legend>
        ${opcion('radio', 'placa', '', 'Cualquier color', !e.placa, null, 'placa')}
        ${PLACAS.map(pl => opcion('radio', 'placa', pl.id, esc(pl.nombre), e.placa === pl.id, Tienda.contar({ ...base, placa: pl.id }), 'placa', `<i class="f-sw" style="background-image:url(images/sw-${pl.id}.webp)" aria-hidden="true"></i>`)).join('')}</fieldset>`,
      `<fieldset class="f-grupo"><legend>Ambiente</legend>
        ${opcion('radio', 'amb', '', 'Toda la casa', !e.amb, null, 'amb')}
        ${AMBIENTES.map(a => opcion('radio', 'amb', a.id, esc(a.nombre), e.amb === a.id, Tienda.contar({ ...base, amb: a.id }), 'amb')).join('')}</fieldset>`,
      `<fieldset class="f-grupo"><legend>Precio</legend>
        ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
        ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, Tienda.contar({ ...base, precioMin: r.min, precioMax: r.max }), 'precio')).join('')}</fieldset>`,
      `<div class="f-medida"><p>¿No está la medida que buscás?</p><a href="${HOME_URL}#a-medida">Pedilo a medida ${ICON.flecha}</a></div>`,
    ].join('');
  }
  function pintarCabecera() {
    const tipo = TIPOS.find(t => t.id === e.tipo);
    const cat = e.cat.length === 1 ? CATEGORIAS.find(c => c.id === e.cat[0]) : null;
    const amb = AMBIENTES.find(a => a.id === e.amb);
    const titulo = cat ? cat.nombre : amb ? amb.nombre : tipo ? tipo.nombre : 'Muebles y electrodomésticos';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = amb ? amb.texto : tipo ? tipo.bajada : 'Elegí el mueble, su medida y su placa, o el electrodoméstico que te falta. Si la medida no está, te lo fabricamos.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : amb ? amb.nombre : tipo ? tipo.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : amb ? `${CATALOGO_URL}?amb=${amb.id}` : tipo ? `${CATALOGO_URL}?tipo=${tipo.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (cat && id === cat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-tipo=""${!e.tipo ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...TIPOS.map(t => `<a class="chip" href="${CATALOGO_URL}?tipo=${t.id}" data-chip-tipo="${t.id}"${e.tipo === t.id ? ' aria-current="page"' : ''}>${esc(t.nombre)} <small>${Tienda.contar({ tipo: t.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.cat.forEach(v => quitar.push(['cat', v, nombreDe(CATEGORIAS, v)]));
    if (e.placa) quitar.push(['placa', e.placa, `Placa ${nombrePlaca(e.placa)}`]);
    if (e.amb) quitar.push(['amb', e.amb, nombreDe(AMBIENTES, e.amb)]);
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    const n = quitar.length + (e.tipo ? 1 : 0);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (n > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['tipo', 'cat', 'amb', 'placa', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.tipo) u.searchParams.set('tipo', e.tipo);
    if (e.cat.length) u.searchParams.set('cat', e.cat.join(','));
    if (e.amb) u.searchParams.set('amb', e.amb);
    if (e.placa) u.searchParams.set('placa', e.placa);
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, e.placa)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor || mostrados >= total;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    ajustar();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') {
      const set = new Set(e.cat);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e.cat = [...set];
    } else e[grupo] = inp.value;
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { Object.assign(e, { tipo: '', cat: [], amb: '', placa: '', precio: '', q: '' }); buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'cat') e.cat = e.cat.filter(x => x !== v);
    else { e[k] = ''; if (k === 'q') buscar.value = ''; }
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-tipo]');
    if (!a) return;
    ev.preventDefault();
    e.tipo = a.dataset.chipTipo;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-todo, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL) || u.hash) return;
    ev.preventDefault();
    Object.assign(e, {
      tipo: valido(u.searchParams.get('tipo'), TIPOS), cat: multi(u.searchParams.get('cat'), CATEGORIAS), amb: valido(u.searchParams.get('amb'), AMBIENTES),
      placa: valido(u.searchParams.get('placa'), PLACAS), precio: '', q: '',
    });
    buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod, null, '', e.placa), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);

[initCatsMenu, pintarConteos, initToggle, initAmbientes, initMuestrario, initMedida, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
