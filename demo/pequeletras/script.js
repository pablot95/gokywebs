const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493816733638';
const MARCA = 'Pequeletras';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const NIVELES = [
  { id: 'primaria', nombre: 'Primaria', bajada: '1° a 6° grado', img: 'images/n-primaria.webp', w: 900, h: 675 },
  { id: 'secundaria', nombre: 'Secundaria', bajada: '1° a 6° año', img: 'images/n-secundaria.webp', w: 1000, h: 750 },
];
const CICLOS = [
  { id: 'g13', nombre: '1° a 3° grado', nivel: 'primaria' },
  { id: 'g46', nombre: '4° a 6° grado', nivel: 'primaria' },
  { id: 'a13', nombre: '1° a 3° año', nivel: 'secundaria' },
  { id: 'a46', nombre: '4° a 6° año', nivel: 'secundaria' },
];
const AREAS = [
  { id: 'lengua', nombre: 'Prácticas del lenguaje', corto: 'Lengua' },
  { id: 'matematica', nombre: 'Matemática', corto: 'Matemática' },
  { id: 'naturales', nombre: 'Ciencias Naturales', corto: 'Ciencias' },
  { id: 'varias', nombre: 'Packs de varias áreas', corto: 'Pack' },
];
const PRECIOS = [
  { id: 'hasta-3500', nombre: 'Hasta $3.500', min: null, max: 3500 },
  { id: '3500-5000', nombre: '$3.501 a $5.000', min: 3501, max: 5000 },
  { id: 'mas-5000', nombre: 'Más de $5.000', min: 5001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const pag = (src, lado, alt, t) => ({ src, lado, alt, t });
const PRODUCTOS = [
  {
    id: 'pack-primer-ciclo', rango: 1, nombre: 'Pack primeras fichas: formas, trazos, conteo y dibujo',
    area: 'varias', ciclos: ['g13'], grados: '1° grado', paginas: 40, formato: 'Para imprimir', precio: 9900, etiqueta: 'Pack 4 en 1',
    img: { src: 'images/p-pack-primer.webp', lado: 900, alt: 'Fichas impresas para unir formas, contar frutas y colorear una casa' },
    desc: 'Cuatro cuadernillos en un solo PDF para arrancar 1° grado con hojas variadas: unir cada forma con su contorno, repasar trazos, contar frutas y colorear.',
    incluye: ['Unir formas y colores', 'Trazos punteados de cuatro tipos', 'Contar frutas y escribir el número', 'Dibujos para colorear'],
    muestras: [
      pag('images/m-primer-frutas.webp', 540, 'contar manzanas, bananas, naranjas y frutillas y escribir el número', 'Contar frutas'),
      pag('images/m-primer-formas.webp', 400, 'unir cada forma de color con su contorno', 'Unir formas'),
      pag('images/m-primer-casa.webp', 480, 'casa con árbol, sol y nube para colorear', 'Para colorear'),
    ],
    claves: ['pack', 'primer grado', 'formas', 'conteo', 'colorear', 'numeros', 'trazos'],
  },
  {
    id: 'trazos-bucles', rango: 2, nombre: 'Grafomotricidad: trazos, ondas y bucles',
    area: 'lengua', ciclos: ['g13'], grados: '1° grado', paginas: 20, formato: 'Para imprimir', precio: 3500,
    img: { src: 'images/p-trazos.webp', lado: 1200, alt: 'Hoja con trazos punteados de ondas, curvas y bucles entre dos casilleros, con lápices de colores' },
    desc: 'Recorridos punteados de casillero a casillero: ondas, puentes, curvas y bucles, del más simple al más difícil, para soltar la mano antes de escribir.',
    incluye: ['Ondas, puentes, curvas y bucles', 'Casillero de salida y de llegada', 'Del trazo más simple al más difícil'],
    muestras: [
      pag('images/m-trazos-bucles.webp', 700, 'detalle de las curvas y los bucles punteados', 'Bucles'),
      pag('images/p-trazos.webp', 1200, 'página completa con cuatro filas de trazos', 'Página completa'),
    ],
    claves: ['grafomotricidad', 'preescritura', 'lineas', 'motricidad fina', 'escritura'],
  },
  {
    id: 'comprension-lectora', rango: 3, nombre: 'Comprensión lectora: fichas para cualquier cuento',
    area: 'lengua', ciclos: ['g46', 'a13'], grados: '4° a 6° grado y 1° año', paginas: 24, formato: 'Para imprimir', precio: 4200,
    img: { src: 'images/p-comprension.webp', lado: 1200, alt: 'Cuaderno anillado con una ficha de lectura: renglones, casilleros para marcar y el dibujo de un libro' },
    desc: 'Fichas para antes, durante y después de leer: anticipar de qué trata, marcar personajes y lugares y escribir lo que pasó. Sirven con el libro que estén leyendo.',
    incluye: ['Antes, durante y después de leer', 'Preguntas para marcar y para escribir', 'Sirve con cualquier cuento o novela'],
    muestras: [
      pag('images/m-comprension-preguntas.webp', 746, 'preguntas con casilleros para marcar y renglones para responder', 'Preguntas'),
      pag('images/p-comprension.webp', 1200, 'ficha completa en el cuaderno', 'Ficha completa'),
    ],
    claves: ['lectura', 'cuento', 'novela', 'escritura', 'preguntas', 'texto'],
  },
  {
    id: 'contar-agrupar', rango: 4, nombre: 'Contamos y agrupamos: tableros para usar con fichas',
    area: 'matematica', ciclos: ['g13'], grados: '1° y 2° grado', paginas: 16, formato: 'Para imprimir', precio: 3200,
    img: { src: 'images/p-contar.webp', lado: 1200, alt: 'Fichas de madera rojas, amarillas, verdes y azules agrupadas por color sobre una hoja blanca' },
    desc: 'Tableros para apoyar fichas, tapitas o botones: agrupar por color, contar cuántos hay en cada grupo y comparar las colecciones.',
    incluye: ['Tableros para agrupar por color', 'Conteo hasta 10', 'Comparar: ¿dónde hay más?'],
    muestras: [
      pag('images/m-contar-azules.webp', 538, 'seis fichas azules para contar', 'Contar'),
      pag('images/p-contar.webp', 1200, 'tablero con las fichas agrupadas por color', 'Tablero'),
    ],
    claves: ['numeros', 'conteo', 'agrupar', 'colecciones', 'sumar', 'colores'],
  },
  {
    id: 'funciones-plano', rango: 5, nombre: 'Funciones en el plano: lineal, cuadrática y circunferencia',
    area: 'matematica', ciclos: ['a13', 'a46'], grados: '3° y 4° año', paginas: 28, formato: 'Para imprimir', precio: 5200,
    img: { src: 'images/p-funciones.webp', lado: 1200, alt: 'Hoja con cuatro ejes cartesianos cuadriculados: una recta, una parábola, una circunferencia y un eje vacío' },
    desc: 'Ejes con cuadrícula para graficar rectas, parábolas y circunferencias, con renglones para la tabla de valores y para justificar.',
    incluye: ['Función lineal y cuadrática', 'Circunferencia en el plano', 'Ejes vacíos para practicar'],
    muestras: [
      pag('images/m-funciones-parabola.webp', 538, 'parábola graficada en un eje cuadriculado', 'Parábola'),
      pag('images/p-funciones.webp', 1200, 'página completa con cuatro gráficos', 'Página completa'),
    ],
    claves: ['algebra', 'grafico', 'parabola', 'recta', 'ejes cartesianos', 'secundario', 'geometria analitica'],
  },
  {
    id: 'plantas-flor', rango: 6, nombre: 'Plantas con flor y sin flor: observo y nombro',
    area: 'naturales', ciclos: ['g46', 'a13'], grados: '4° a 6° grado y 1° año', paginas: 12, formato: 'Para imprimir o usar en la tablet', precio: 3600, etiqueta: 'También en tablet',
    img: { src: 'images/p-plantas.webp', lado: 1200, alt: 'Tablet con seis fotos de plantas: girasol, hibisco, helecho, nenúfar, rosa y orquídea, con casilleros para escribir el nombre' },
    desc: 'Seis fotos para nombrar y una pregunta: ¿cuál no tiene flor? Se imprime o se completa en la tablet.',
    incluye: ['Seis fotos para observar y nombrar', 'Plantas con flor y sin flor', 'Para imprimir o completar en la tablet'],
    muestras: [
      pag('images/m-plantas-fotos.webp', 716, 'girasol, hibisco, helecho y nenúfar con renglones para escribir', 'Observar y nombrar'),
      pag('images/p-plantas.webp', 1200, 'página completa en la tablet', 'En la tablet'),
    ],
    claves: ['biologia', 'flores', 'helecho', 'botanica', 'tablet', 'plantas'],
  },
  {
    id: 'figuras-geometricas', rango: 7, nombre: 'Copiamos figuras: cuadrados, diagonales y rombos',
    area: 'matematica', ciclos: ['g46', 'a13'], grados: '4° a 6° grado y 1° año', paginas: 18, formato: 'Para imprimir', precio: 3800,
    img: { src: 'images/p-figuras.webp', lado: 1200, alt: 'Hoja con cuadrados, diagonales y un rombo para copiar con regla, junto a un lápiz y una regla' },
    desc: 'Modelos para copiar con regla: cuadrados, diagonales, divisiones y rombos, con un casillero libre para inventar la figura propia.',
    incluye: ['Seis modelos por página', 'Renglón para describir la figura', 'Casillero libre para crear'],
    muestras: [
      pag('images/m-figuras-rombo.webp', 627, 'rombo dentro de un cuadrado para copiar', 'Rombo'),
      pag('images/p-figuras.webp', 1200, 'página completa con seis modelos', 'Página completa'),
    ],
    claves: ['geometria', 'regla', 'cuadrado', 'rombo', 'diagonal', 'figuras'],
  },
  {
    id: 'hojas-formas', rango: 8, nombre: 'Hojas y formas: observar, unir y clasificar',
    area: 'naturales', ciclos: ['g13'], grados: '1° y 2° grado', paginas: 14, formato: 'Para imprimir', precio: 3400,
    img: { src: 'images/p-hojas.webp', lado: 1200, alt: 'Dos fichas con hojas de árboles para unir con su contorno y una grilla para clasificar formas, junto a una lupa' },
    desc: 'Unir cada hoja con su contorno y clasificar por forma. Para salir al patio a buscar hojas y volver a completar la ficha.',
    incluye: ['Unir la hoja con su contorno', 'Grilla para clasificar formas', 'Propuesta para salir al patio'],
    muestras: [
      pag('images/m-hojas-grilla.webp', 672, 'grilla con girasol, trébol y helecho junto a formas para clasificar', 'Clasificar'),
      pag('images/p-hojas.webp', 1200, 'las dos fichas completas', 'Fichas completas'),
    ],
    claves: ['naturaleza', 'plantas', 'hojas', 'arboles', 'clasificar', 'formas'],
  },
  {
    id: 'pack-segundo-grado', rango: 9, nombre: 'Pack 2° grado: secuencias, sumas y ciclo de vida',
    area: 'varias', ciclos: ['g13'], grados: '2° grado', paginas: 36, formato: 'Para imprimir o proyectar', precio: 10900, etiqueta: 'Pack 3 en 1',
    img: { src: 'images/p-pack-segundo.webp', lado: 900, alt: 'Tablet con sumas de colecciones de bolitas y una ficha impresa del ciclo de vida de la mariposa' },
    desc: 'Secuencias de figuras, sumas con colecciones y el ciclo de vida de la mariposa en un solo PDF, para imprimir o proyectar en clase.',
    incluye: ['Secuencias de figuras y colores', 'Sumas con colecciones', 'Ciclo de vida de la mariposa'],
    muestras: [
      pag('images/m-segundo-sumas.webp', 490, 'sumas con colecciones de bolitas de colores', 'Sumas'),
      pag('images/m-segundo-mariposa.webp', 450, 'mariposa monarca, hoja, oruga y crisálida para ordenar', 'Ciclo de vida'),
      pag('images/p-pack-segundo.webp', 900, 'la tablet y la ficha impresa del pack', 'Vista del pack'),
    ],
    claves: ['mariposa', 'oruga', 'patrones', 'sumas', 'secuencias', 'ciencias', 'matematica', 'segundo grado'],
  },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const areaDe = id => AREAS.find(a => a.id === id) || AREAS[0];
const nivelesDe = p => [...new Set((p.ciclos || []).map(c => CICLOS.find(x => x.id === c)?.nivel).filter(Boolean))];

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, p.grados, p.formato, nombreDe(AREAS, p.area), areaDe(p.area).corto,
    ...nivelesDe(p).map(n => nombreDe(NIVELES, n)), ...(p.ciclos || []).map(c => nombreDe(CICLOS, c)),
    ...(p.incluye || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), ciclo = lista(f.ciclo), area = lista(f.area), excluir = lista(f.excluir);
    if (cat.length && !cat.some(c => nivelesDe(p).includes(c))) return false;
    if (ciclo.length && !ciclo.some(c => (p.ciclos || []).includes(c))) return false;
    if (area.length && !area.includes(p.area)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.precio < f.precioMin) return false;
    if (f.precioMax != null && p.precio > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
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
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, p.precio); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'pequeletras_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(producto) {
    if (!producto) return 0;
    const items = this.get();
    if (items.some(i => i.id === producto.id)) return 0;
    items.push({ id: producto.id, qty: 1 });
    this.save(items);
    return 1;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio : s; }, 0); },
  sync() {
    const items = this.get();
    const vistos = new Set();
    const limpias = [];
    let changed = !Array.isArray(items);
    (Array.isArray(items) ? items : []).forEach(i => {
      if (!i || !getProducto(i.id) || vistos.has(i.id)) { changed = true; return; }
      vistos.add(i.id);
      if (i.qty !== 1) changed = true;
      limpias.push({ id: i.id, qty: 1 });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg class="i-mas" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg class="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8M8 17h5"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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
function abrirCapa(el, { alCerrar, alTeclado, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else if (alTeclado?.(e)) return;
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

const areaChip = p => `<span class="area-chip area--${esc(p.area)}"><i aria-hidden="true"></i>${esc(areaDe(p.area).corto)}</span>`;
const badgeHTML = p => (p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '');
function botonSumar(p, extra = '') {
  const en = Cart.has(p.id);
  return `<button type="button" class="btn btn--cta btn--sm prod-add${en ? ' is-en' : ''}${extra}" data-sumar="${esc(p.id)}" data-nombre="${esc(p.nombre)}" aria-label="${en ? `Ver ${esc(p.nombre)} en el carrito` : `Agregar ${esc(p.nombre)} al carrito`}">${ICO.mas}${ICO.check}<span>${en ? 'En el carrito' : 'Agregar'}</span></button>`;
}
const botonMuestra = (p, clase = 'prod__muestra') => `<button type="button" class="${clase}" data-muestra="${esc(p.id)}" aria-label="Ver la muestra de ${esc(p.nombre)}">${ICO.ojo}<span>Ver muestra</span></button>`;

function cardHTML(p, estilo = 'hoja', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const imgTag = `<img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async">`;
  const formato = `<p class="prod__formato">${ICO.pdf}PDF · ${p.paginas} págs</p>`;
  if (estilo === 'fila') {
    return `<article class="prod prod--fila area--${esc(p.area)}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">${imgTag}</button>${badgeHTML(p)}</div>
  <div class="prod__info">
    <p class="prod__meta">${areaChip(p)}<span>${esc(p.grados)}</span></p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__formato">${ICO.pdf}PDF · ${p.paginas} págs · ${esc(p.formato)}</p>
  </div>
  <div class="prod__compra">
    <p class="prod__precio precio">${formatearPrecio(p.precio)}</p>
    <div class="prod-actions">${botonSumar(p)}${botonMuestra(p, 'btn btn--ghost btn--sm prod-muestra')}</div>
  </div>
</article>`;
  }
  if (estilo === 'mat') {
    return `<article class="prod prod--mat area--${esc(p.area)}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">${imgTag}</button>${badgeHTML(p)}${botonMuestra(p)}</div>
  <div class="prod__info">
    <p class="prod__meta">${areaChip(p)}<span>${esc(p.grados)}</span></p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    ${formato}
    <div class="prod__fila"><p class="prod__precio precio">${formatearPrecio(p.precio)}</p><div class="prod-actions">${botonSumar(p)}</div></div>
  </div>
</article>`;
  }
  return `<article class="prod prod--hoja area--${esc(p.area)}" data-id="${esc(p.id)}"${anim}>
  <span class="prod__tab"><i aria-hidden="true"></i>${esc(areaDe(p.area).corto)}</span>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">${imgTag}</button>${badgeHTML(p)}${botonMuestra(p)}</div>
  <div class="prod__info">
    <p class="prod__meta">${esc(p.grados)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    ${formato}
    <div class="prod__fila"><p class="prod__precio precio">${formatearPrecio(p.precio)}</p><div class="prod-actions">${botonSumar(p)}</div></div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'material', 'materiales')}` : 'Abrir el carrito'); });
}
function pintarBotonesCompra() {
  document.querySelectorAll('[data-sumar]').forEach(b => {
    const en = Cart.has(b.dataset.sumar);
    b.classList.toggle('is-en', en);
    const span = b.querySelector('span');
    if (span) span.textContent = en ? 'En el carrito' : 'Agregar';
    const n = b.dataset.nombre || '';
    b.setAttribute('aria-label', en ? `Ver ${n} en el carrito` : `Agregar ${n} al carrito`);
  });
}
document.addEventListener('cart:updated', () => { updateCartBadge(); pintarBotonesCompra(); });

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${p.nombre} (PDF, ${p.grados}) — ${formatearPrecio(p.precio)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero comprar estos PDF de ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">PDF · ${p.paginas} págs · ${esc(p.grados)}</p>
    <p class="linea__precio">${formatearPrecio(p.precio)}</p>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${esc(p.id)}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'material', 'materiales') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function sumar(id, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  if (!Cart.add(p)) return 0;
  showToast(`Sumaste «${p.nombre}» al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return 1;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) {
      e.preventDefault();
      if (Cart.has(s.dataset.sumar)) { window.abrirCarrito?.(s); return; }
      sumar(s.dataset.sumar, s);
      return;
    }
    const mu = e.target.closest('[data-muestra]');
    if (mu) {
      e.preventDefault();
      abrirMuestra(mu.dataset.muestra, Number(mu.dataset.pag) || 0, mu);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv);
    }
  });
}

function crearHojeador(root) {
  if (!root) return null;
  const img = root.querySelector('[data-hoj-img]');
  const cap = root.querySelector('[data-hoj-cap]');
  const thumbs = root.querySelector('[data-hoj-thumbs]');
  const meta = root.querySelector('[data-hoj-meta]');
  const nombre = root.querySelector('[data-hoj-nombre]');
  const n = root.querySelector('[data-hoj-n]');
  const precio = root.querySelector('[data-hoj-precio]');
  const sumarBtn = root.querySelector('[data-hoj-sumar]');
  const prev = root.querySelector('[data-hoj-paso="-1"]');
  const next = root.querySelector('[data-hoj-paso="1"]');
  const fig = root.querySelector('.hoj__pagina');
  let prod = null, i = 0;
  const estadoCompra = () => {
    if (!prod || !sumarBtn) return;
    const en = Cart.has(prod.id);
    sumarBtn.classList.toggle('is-en', en);
    sumarBtn.querySelector('span').textContent = en ? 'Ver el carrito' : 'Agregar al carrito';
  };
  const pintarPagina = () => {
    const pags = prod.muestras;
    const m = pags[i];
    if (fig && !reduceMotion) { fig.classList.remove('cambia'); void fig.offsetWidth; fig.classList.add('cambia'); }
    img.src = m.src; img.width = m.lado; img.height = m.lado;
    img.alt = `Muestra de ${prod.nombre}: ${m.alt}`;
    cap.textContent = m.t;
    n.textContent = `Página ${i + 1} de ${pags.length}`;
    thumbs.querySelectorAll('[data-hoj-ir]').forEach(b => b.setAttribute('aria-current', String(Number(b.dataset.hojIr) === i)));
    prev.disabled = pags.length < 2;
    next.disabled = pags.length < 2;
  };
  const mostrar = (id, k = 0) => {
    const p = getProducto(id);
    if (!p) return false;
    prod = p;
    i = Math.max(0, Math.min(p.muestras.length - 1, k));
    thumbs.innerHTML = p.muestras.map((m, j) => `<li><button type="button" data-hoj-ir="${j}" aria-label="Ver la página ${j + 1}: ${esc(m.t)}" aria-current="false"><img src="${esc(m.src)}" alt="" width="${m.lado}" height="${m.lado}" decoding="async"></button></li>`).join('');
    meta.innerHTML = `${areaChip(p)}<span>${esc(p.grados)} · PDF de ${p.paginas} págs</span>`;
    nombre.textContent = p.nombre;
    precio.textContent = formatearPrecio(p.precio);
    root.dataset.area = p.area;
    pintarPagina();
    estadoCompra();
    return true;
  };
  const mover = d => { if (!prod) return; const t = prod.muestras.length; i = (i + d + t) % t; pintarPagina(); };
  root.addEventListener('click', e => {
    const paso = e.target.closest('[data-hoj-paso]');
    if (paso) { mover(Number(paso.dataset.hojPaso)); return; }
    const ir = e.target.closest('[data-hoj-ir]');
    if (ir) { i = Number(ir.dataset.hojIr) || 0; pintarPagina(); return; }
    if (!prod) return;
    if (e.target.closest('[data-hoj-sumar]')) {
      if (Cart.has(prod.id)) {
        const visor = root.closest('#visor');
        const capa = visor ? cerrarCapa(visor, { devolverFoco: false }) : null;
        window.abrirCarrito?.(capa?.previo || sumarBtn);
      } else sumar(prod.id, sumarBtn);
      return;
    }
    if (e.target.closest('[data-hoj-ficha]')) {
      const visor = root.closest('#visor');
      if (visor) cerrarCapa(visor, { devolverFoco: false });
      abrirVistaRapida(prod.id);
    }
  });
  document.addEventListener('cart:updated', estadoCompra);
  return { mostrar, mover, get id() { return prod?.id; } };
}

let hojModal = null;
function abrirMuestra(id, k = 0, previo = document.activeElement) {
  const visor = document.getElementById('visor');
  if (!visor || !hojModal || !hojModal.mostrar(id, k)) return;
  if (!capas.some(c => c.el === visor)) {
    abrirCapa(visor, {
      previo,
      alTeclado: e => {
        if (e.target.closest?.('input, select, textarea')) return false;
        if (e.key === 'ArrowRight') { hojModal.mover(1); return true; }
        if (e.key === 'ArrowLeft') { hojModal.mover(-1); return true; }
        return false;
      },
    });
    setTimeout(() => visor.querySelector('.visor__close')?.focus(), 60);
  }
}

function initHojeadores() {
  hojModal = crearHojeador(document.querySelector('#visor [data-hoj]'));
  document.getElementById('visor')?.addEventListener('click', e => { if (e.target.closest('[data-visor-cerrar]')) cerrarCapa(document.getElementById('visor')); });
  const inline = document.querySelector('[data-hoj-inline]');
  const lista = document.querySelector('[data-hoj-lista]');
  if (!inline || !lista) return;
  const hoj = crearHojeador(inline);
  const ids = lista.dataset.hojLista.split(',').map(s => s.trim()).filter(Boolean);
  const prods = productosPorIds(ids);
  lista.innerHTML = prods.map((p, k) => `<li><button type="button" class="hoj__item area--${esc(p.area)}" data-hoj-prod="${esc(p.id)}" aria-pressed="${k === 0}"><i class="hoj__item-tab" aria-hidden="true"></i><span><b>${esc(p.nombre)}</b><small>${esc(areaDe(p.area).corto)} · ${esc(p.grados)} · ${plural(p.muestras.length, 'página', 'páginas')}</small></span></button></li>`).join('');
  if (prods[0]) hoj.mostrar(prods[0].id);
  lista.addEventListener('click', e => {
    const b = e.target.closest('[data-hoj-prod]');
    if (!b) return;
    lista.querySelectorAll('[data-hoj-prod]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    hoj.mostrar(b.dataset.hojProd);
    if (window.matchMedia('(max-width: 900px)').matches) {
      const r = inline.getBoundingClientRect();
      if (r.top < 0 || r.top > innerHeight * 0.5) inline.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
}

function initMuestrasBento() {
  const cont = document.querySelector('[data-muestras]');
  if (!cont) return;
  const ids = cont.dataset.muestras.split(',').map(s => s.trim()).filter(Boolean);
  cont.innerHTML = productosPorIds(ids).map((p, k) => {
    const m = p.muestras[0];
    return `<li class="mu${k === 0 ? ' mu--grande' : ''} area--${esc(p.area)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
  <button type="button" class="mu__btn" data-muestra="${esc(p.id)}" data-pag="0" aria-label="Hojear la muestra de ${esc(p.nombre)}">
    <span class="mu__foto"><img src="${esc(m.src)}" alt="${esc(`Muestra de ${p.nombre}: ${m.alt}`)}" width="${m.lado}" height="${m.lado}" decoding="async"></span>
    <span class="marca-agua" aria-hidden="true"></span>
    <span class="mu__cap"><span class="mu__meta">${areaChip(p)}<small>${esc(p.grados)}</small></span><b>${esc(p.nombre)}</b><small class="mu__pags">${plural(p.muestras.length, 'página', 'páginas')} de muestra</small></span>
    <span class="mu__hojear">${ICO.ojo}Hojear</span>
  </button>
</li>`;
  }).join('');
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, pag: 0 };
  let rel = Tienda.consultar({ filtros: { area: p.area, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { ciclo: p.ciclos, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const niveles = nivelesDe(p).map(n => nombreDe(NIVELES, n)).join(' y ');
  body.innerHTML = `<div class="qv__grid area--${esc(p.area)}">
  <div class="qv__galeria">
    <figure class="qv__principal"><img data-qv-img src="${esc(p.muestras[0].src)}" alt="${esc(`Muestra de ${p.nombre}: ${p.muestras[0].alt}`)}" width="${p.muestras[0].lado}" height="${p.muestras[0].lado}"><span class="marca-agua" aria-hidden="true"></span><figcaption data-qv-cap>${esc(p.muestras[0].t)}</figcaption></figure>
    <ol class="qv__thumbs" aria-label="Páginas de muestra">${p.muestras.map((m, k) => `<li><button type="button" data-qv-pag="${k}" aria-label="Ver la página ${k + 1}: ${esc(m.t)}" aria-current="${k === 0}"><img src="${esc(m.src)}" alt="" width="${m.lado}" height="${m.lado}"></button></li>`).join('')}</ol>
    <button type="button" class="qv__hojear" data-qv-hojear>${ICO.ojo}Hojear la muestra en grande</button>
  </div>
  <div class="qv__info">
    <p class="qv__meta">${areaChip(p)}<span>${esc(niveles)} · ${esc(p.grados)}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv">${formatearPrecio(p.precio)}</p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${p.incluye.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <p class="qv__formato">${ICO.pdf}<span>PDF de ${p.paginas} páginas · ${esc(p.formato)}</span></p>
    <div class="qv__acciones" data-qv-acciones></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por el PDF «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede servir</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQvAcciones();
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQvAcciones() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  const box = modal?.querySelector('[data-qv-acciones]');
  if (!box || !p) return;
  box.innerHTML = Cart.has(p.id)
    ? `<p class="qv__en">${ICO.check}Ya está en tu carrito</p><button type="button" class="btn btn--cta" data-qv-carrito>Ver el carrito</button>`
    : `<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al carrito</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>`;
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  document.addEventListener('cart:updated', () => { if (!modal.hidden) pintarQvAcciones(); });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const pg = e.target.closest('[data-qv-pag]');
    if (pg) {
      const k = Number(pg.dataset.qvPag) || 0;
      const m = p.muestras[k];
      qvEstado.pag = k;
      const img = modal.querySelector('[data-qv-img]');
      img.src = m.src; img.width = m.lado; img.height = m.lado; img.alt = `Muestra de ${p.nombre}: ${m.alt}`;
      modal.querySelector('[data-qv-cap]').textContent = m.t;
      modal.querySelectorAll('[data-qv-pag]').forEach(b => b.setAttribute('aria-current', String(b === pg)));
      return;
    }
    if (e.target.closest('[data-qv-hojear]')) { abrirMuestra(p.id, qvEstado.pag, e.target.closest('[data-qv-hojear]')); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    if (e.target.closest('[data-qv-carrito]')) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      Cart.add(p);
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { showToast(`Sumaste «${p.nombre}» al carrito`); modal.querySelector('[data-qv-carrito]')?.focus(); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { }
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => NIVELES.some(c => c.id === id));
  const ciclo = (params.get('ciclo') || '').split(',').filter(id => CICLOS.some(c => c.id === id));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = NIVELES.map(nv => {
      const r = Tienda.resumen({ cat: nv.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === nv.id && !ciclo.length;
      const subs = CICLOS.filter(c => c.nivel === nv.id).map(c => {
        const n = Tienda.contar({ ciclo: c.id });
        const curS = PAGINA === 'catalogo' && ciclo.length === 1 && ciclo[0] === c.id;
        return `<li><a href="${CATALOGO_URL}?ciclo=${c.id}"${curS ? ' aria-current="page"' : ''}><span>${esc(c.nombre)}</span><em>${n}</em></a></li>`;
      }).join('');
      return `<li class="cats-menu__nivel"><a class="cats-menu__top" href="${CATALOGO_URL}?cat=${nv.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(nv.img)}" alt="" width="${nv.w}" height="${nv.h}"><span><b>${esc(nv.nombre)}</b><small>${esc(nv.bajada)}</small></span><em>${r.n}</em></a><ul class="cats-menu__sub">${subs}</ul></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  document.querySelectorAll('[data-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.resumen });
    if (!r.n) return;
    el.textContent = `${plural(r.n, 'material', 'materiales')} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-n-ciclo]').forEach(el => {
    const n = Tienda.contar({ ciclo: el.dataset.nCiclo });
    el.textContent = plural(n, 'material', 'materiales');
  });
}

function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'hoja';
    const limite = Number(cont.dataset.limite) || 8;
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = Tienda.consultar({ filtros: { [k]: v }, limite }).items;
      } else prods = productosPorIds(ids).slice(0, limite);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo)).join('');
      if (verTodo) {
        const [k, v] = tab ? tab.split(':') : [];
        verTodo.href = tab ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
      }
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
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
  const estilo = MODELO === '2' ? 'mat' : 'hoja';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: NIVELES, ciclo: CICLOS, area: AREAS };
  const e = {
    cat: valida(params.get('cat'), NIVELES),
    ciclo: valida(params.get('ciclo'), CICLOS),
    area: valida(params.get('area'), AREAS),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(NIVELES, e.cat[0]);
    if (e.ciclo.length === 1) return nombreDe(CICLOS, e.ciclo[0]);
    if (e.area.length === 1) return nombreDe(AREAS, e.area[0]);
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = !t ? 'Fichas y cuadernillos en PDF' : e.area.length ? `${t} en PDF` : `PDF para ${t}`;
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'material' : 'materiales'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const hq = document.getElementById('hq');
  if (hq) hq.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  hq?.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); e.q = hq.value.trim().slice(0, 60); inputQ.value = e.q; pintarActivos(); sincronizarUrl(); render(true); hq.blur(); grid.closest('section')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.precio = ''; e.q = ''; inputQ.value = ''; if (hq) hq.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; if (hq) hq.value = ''; }
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
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => (hq || inputQ).focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
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
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.18);
  const trazo = hero.querySelector('.trazo--hero');
  if (trazo) tl.fromTo(trazo, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.45);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero__sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

initPreviews();
initMuestrasBento();
initResumenes();
initMenuCategorias();
initHojeadores();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
pintarBotonesCompra();
