const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493518658382';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const CATEGORIAS = [
  { id: 'programa', nombre: 'Programa completo', bajada: 'Franquicia IA, de punta a punta', img: 'images/p-franquicia.webp',
    texto: 'El programa online de inteligencia artificial aplicada al marketing digital, con todos sus módulos.' },
  { id: 'talleres', nombre: 'Talleres grabados', bajada: 'Clases en video sobre un tema', img: 'images/p-anuncios.webp',
    texto: 'Talleres en video sobre un tema puntual: ChatGPT, contenido, embudos, anuncios y automatización.' },
  { id: 'guias', nombre: 'Guías y e-books', bajada: 'PDF para leer y aplicar', img: 'images/p-primeros.webp',
    texto: 'Guías en PDF para leer a tu ritmo y aplicar en tu proyecto, con ejercicios y ejemplos.' },
  { id: 'plantillas', nombre: 'Plantillas y prompts', bajada: 'Listas para copiar y usar', img: 'images/p-canva.webp',
    texto: 'Prompts, plantillas de Canva y Notion, guiones y mensajes listos para adaptar a tu negocio.' },
  { id: 'combos', nombre: 'Combos', bajada: 'Varios productos, mejor precio', img: 'images/p-combo-arranque.webp',
    texto: 'Productos que se complementan, juntos y con descuento.' },
];
const FORMATOS = {
  programa: { nombre: 'Programa online', icono: 'gorro' },
  video: { nombre: 'Taller grabado', icono: 'play' },
  pdf: { nombre: 'E-book PDF', icono: 'doc' },
  plantilla: { nombre: 'Plantilla', icono: 'plantilla' },
  combo: { nombre: 'Combo', icono: 'capas' },
};
const TEMAS = [
  { id: 'ia', nombre: 'Primeros pasos con IA' },
  { id: 'redes', nombre: 'Contenido y redes' },
  { id: 'ventas', nombre: 'Ventas' },
  { id: 'automatizacion', nombre: 'Automatización' },
];
const NIVELES = [{ id: 'cero', nombre: 'Desde cero' }, { id: 'base', nombre: 'Con algo de base' }];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: null, max: 15000 },
  { id: '15a40', nombre: '$15.000 a $40.000', min: 15001, max: 40000 },
  { id: 'mas40', nombre: 'Más de $40.000', min: 40001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Recomendados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  programa: 'programa franquicia curso completo academia', talleres: 'taller talleres video clases curso grabado', guias: 'guia guias ebook e-book libro pdf',
  plantillas: 'plantilla plantillas template prompts canva notion', combos: 'combo pack promo descuento',
  ia: 'ia inteligencia artificial chatgpt herramientas', redes: 'redes instagram reels contenido posteos tiktok facebook',
  ventas: 'ventas vender clientes embudo', automatizacion: 'automatizar automatizacion automatico whatsapp bot',
  cero: 'principiante inicial cero', base: 'intermedio avanzado',
};

const Tienda = crearTienda([
  { id: 'franquicia-ia', nombre: 'Franquicia IA', cat: 'programa', formato: 'programa', nivel: 'cero', temas: ['ia', 'redes', 'ventas', 'automatizacion'],
    precio: 249000, descuento: 0, stock: 1, alta: 22, rango: 1, dato: '5 módulos · clases grabadas',
    img: 'images/p-franquicia.webp', alt: 'Mujer tomando apuntes en un cuaderno mientras mira una clase en video en su tablet',
    desc: 'Programa online de inteligencia artificial aplicada al marketing digital: herramientas de IA, contenido para redes, embudos de venta, anuncios y automatización. Arrancás de cero y avanzás a tu ritmo.',
    incluye: ['Academia online con clases grabadas', 'Licencia de marca Franquicia IA', 'Consultas con Vivi por WhatsApp'] },
  { id: 'chatgpt-emprendimiento', nombre: 'ChatGPT para tu emprendimiento', cat: 'talleres', formato: 'video', nivel: 'cero', temas: ['ia', 'ventas'],
    precio: 29900, descuento: 0, stock: 1, alta: 20, rango: 2, dato: '2 h 10 min · 8 clases',
    img: 'images/p-chatgpt.webp', alt: 'Manos escribiendo en una notebook con una plataforma de inteligencia artificial en la pantalla',
    desc: 'Cómo pedirle a ChatGPT lo que necesitás: textos de venta, respuestas a clientes, ideas de productos y la planificación de tu semana.',
    incluye: ['8 clases grabadas', 'Plantilla de pedidos para copiar y pegar', 'Ejercicios con tu propio negocio'] },
  { id: 'pack-200-prompts', nombre: 'Pack de 200 prompts para tu negocio', cat: 'plantillas', formato: 'plantilla', nivel: 'cero', temas: ['ia', 'ventas'],
    precio: 12900, descuento: 0, stock: 1, alta: 18, rango: 3, dato: 'PDF + Notion · 200 prompts',
    img: 'images/p-prompts.webp', alt: 'Mujer sonriendo mientras escribe en un cuaderno junto a su notebook',
    desc: 'Pedidos probados para ventas, redes, atención al cliente y organización: copiás, completás lo que va entre corchetes y listo.',
    incluye: ['200 prompts ordenados por tema', 'Versión en Notion y en PDF', 'Ejemplos de respuesta'] },
  { id: 'contenido-redes-ia', nombre: 'Contenido para redes con IA', cat: 'talleres', formato: 'video', nivel: 'cero', temas: ['redes'],
    precio: 32900, descuento: 0, stock: 1, alta: 19, rango: 4, dato: '2 h 40 min · 10 clases',
    img: 'images/p-contenido.webp', alt: 'Manos sosteniendo un celular con una lista de clases en video, frente a una notebook',
    desc: 'Un mes de publicaciones en una tarde: ideas, textos, carruseles y guiones de Reels hechos con IA y ajustados a tu forma de hablar.',
    incluye: ['10 clases grabadas', 'Banco de ideas por rubro', 'Guía para mantener tu estilo'] },
  { id: 'combo-arranque', nombre: 'Combo Arranque', cat: 'combos', formato: 'combo', nivel: 'cero', temas: ['ia'],
    precio: 34700, descuento: 25, stock: 1, alta: 16, rango: 5, dato: '2 e-books + 200 prompts',
    img: 'images/p-combo-arranque.webp', alt: 'Hombre pensativo con la mano en el mentón frente a su notebook',
    desc: 'Los tres productos para dar los primeros pasos: la guía para arrancar, las 30 herramientas y el pack de prompts.',
    incluye: ['Primeros pasos con IA', '30 herramientas de IA para emprender', 'Pack de 200 prompts para tu negocio'] },
  { id: 'herramientas-ia', nombre: '30 herramientas de IA para emprender', cat: 'guias', formato: 'pdf', nivel: 'cero', temas: ['ia'],
    precio: 11900, descuento: 0, stock: 1, alta: 12, rango: 6, dato: 'E-book PDF · 38 páginas',
    img: 'images/p-herramientas.webp', alt: 'Escritorio con una planta, una taza y una notebook abierta en una plataforma de IA',
    desc: 'Herramientas para escribir, diseñar, editar video, atender clientes y organizarte, con para qué sirve cada una y cuáles son gratis.',
    incluye: ['PDF de 38 páginas', 'Una ficha por herramienta', 'Links directos a cada una'] },
  { id: 'primer-embudo', nombre: 'Tu primer embudo de ventas', cat: 'talleres', formato: 'video', nivel: 'base', temas: ['ventas', 'automatizacion'],
    precio: 36900, descuento: 0, stock: 1, alta: 14, rango: 7, dato: '3 h · 12 clases',
    img: 'images/p-embudo.webp', alt: 'Dos personas trabajando sobre un cuaderno con notas adhesivas y planos',
    desc: 'Armá el camino completo: contenido que atrae, una página que explica y un mensaje que cierra la venta.',
    incluye: ['12 clases grabadas', 'Mapa del embudo para completar', 'Textos guía para cada etapa'] },
  { id: 'plantillas-canva', nombre: '60 plantillas de Canva para Reels y posts', cat: 'plantillas', formato: 'plantilla', nivel: 'cero', temas: ['redes'],
    precio: 15900, descuento: 0, stock: 1, alta: 15, rango: 8, dato: 'Canva · 60 diseños',
    img: 'images/p-canva.webp', alt: 'Notebook con una clase en video y una columna de miniaturas en la pantalla',
    desc: 'Portadas de Reels, carruseles e historias editables en Canva, en tonos que se adaptan a tu marca.',
    incluye: ['60 diseños editables', 'Funcionan con Canva gratis', 'Guía de uso en video'] },
  { id: 'automatizar-respuestas', nombre: 'Automatizá respuestas en WhatsApp e Instagram', cat: 'talleres', formato: 'video', nivel: 'base', temas: ['automatizacion', 'ventas'],
    precio: 34900, descuento: 0, stock: 1, alta: 17, rango: 9, dato: '1 h 50 min · 7 clases',
    img: 'images/p-automatizar.webp', alt: 'Mujer de camisa celeste mirando su celular con una sonrisa',
    desc: 'Mensajes de bienvenida, respuestas a preguntas frecuentes y seguimiento de consultas que salen solos, sin perder el trato cercano.',
    incluye: ['7 clases grabadas', 'Mensajes modelo para adaptar', 'Checklist para configurar tus cuentas'] },
  { id: 'videos-cortos-ia', nombre: 'Videos cortos con IA para Reels', cat: 'talleres', formato: 'video', nivel: 'cero', temas: ['redes'],
    precio: 29900, descuento: 0, stock: 1, alta: 24, rango: 10, tag: 'Nuevo', dato: '1 h 40 min · 6 clases',
    img: 'images/p-videos.webp', alt: 'Cámara sobre un trípode grabando a una persona que habla frente a su notebook',
    desc: 'Guiones, subtítulos, voz y edición con herramientas de IA para grabar Reels con el celular y publicarlos más rápido.',
    incluye: ['6 clases grabadas', '20 guiones de ejemplo', 'Lista de herramientas gratuitas'] },
  { id: 'anuncios-meta-ia', nombre: 'Anuncios en Meta con ayuda de IA', cat: 'talleres', formato: 'video', nivel: 'base', temas: ['ventas', 'redes'],
    precio: 38900, descuento: 15, stock: 1, alta: 13, rango: 11, dato: '2 h 30 min · 9 clases',
    img: 'images/p-anuncios.webp', alt: 'Docente con anteojos explicando frente a su notebook en un estudio de grabación',
    desc: 'Del público al texto del anuncio: cómo usar IA para crear campañas en Instagram y Facebook y leer sus resultados.',
    incluye: ['9 clases grabadas', 'Plantilla para planificar campañas', 'Guía para leer las métricas'] },
  { id: 'primeros-pasos-ia', nombre: 'Primeros pasos con IA', cat: 'guias', formato: 'pdf', nivel: 'cero', temas: ['ia'],
    precio: 9900, descuento: 0, stock: 1, alta: 10, rango: 12, dato: 'E-book PDF · 46 páginas',
    img: 'images/p-primeros.webp', alt: 'Tablet sobre una mesa de madera con una clase en video y dibujos de un cerebro',
    desc: 'La guía para arrancar sin miedo: qué es la IA, qué puede hacer por tu proyecto y diez primeros pedidos para probar hoy.',
    incluye: ['PDF de 46 páginas', '10 ejercicios guiados', 'Glosario sin tecnicismos'] },
  { id: 'vender-productos-digitales', nombre: 'Cómo vender productos digitales', cat: 'guias', formato: 'pdf', nivel: 'base', temas: ['ventas'],
    precio: 14900, descuento: 0, stock: 1, alta: 11, rango: 13, dato: 'E-book PDF · 52 páginas',
    img: 'images/p-vender.webp', alt: 'Notebook abierta sobre un escritorio de madera junto a un celular y una planta',
    desc: 'De la idea al primer cobro: cómo elegir qué vender, ponerle precio, presentarlo y entregarlo de forma automática.',
    incluye: ['PDF de 52 páginas', 'Calculadora de precios', 'Plantilla de página de venta'] },
  { id: 'marca-personal', nombre: 'Marca personal en redes, paso a paso', cat: 'guias', formato: 'pdf', nivel: 'cero', temas: ['redes'],
    precio: 12900, descuento: 0, stock: 1, alta: 9, rango: 14, dato: 'E-book PDF · 40 páginas',
    img: 'images/p-marca.webp', alt: 'Mujer con auriculares sonriendo frente a la pantalla, con un perchero de ropa detrás',
    desc: 'Cómo contar lo que hacés, a quién le hablás y qué publicar para que te elijan, con ejemplos para adaptar.',
    incluye: ['PDF de 40 páginas', 'Ejercicios para encontrar tu voz', 'Ideas de publicaciones'] },
  { id: 'calendario-30-dias', nombre: 'Calendario de contenidos de 30 días', cat: 'plantillas', formato: 'plantilla', nivel: 'cero', temas: ['redes'],
    precio: 8900, descuento: 0, stock: 1, alta: 8, rango: 15, dato: 'PDF imprimible · 30 días',
    img: 'images/p-calendario.webp', alt: 'Cuaderno espiralado y una lapicera sobre una mesa, junto a una notebook',
    desc: 'Un tema por día durante un mes, con el formato sugerido y el pedido de IA para escribir cada publicación.',
    incluye: ['30 días planificados', 'Pedidos de IA listos para usar', 'Versión imprimible y digital'] },
  { id: 'guiones-venta', nombre: 'Guiones para videos de venta', cat: 'plantillas', formato: 'plantilla', nivel: 'base', temas: ['redes', 'ventas'],
    precio: 10900, descuento: 0, stock: 1, alta: 7, rango: 16, dato: 'PDF · 25 guiones',
    img: 'images/p-guiones.webp', alt: 'Hombre de camisa verde explicando algo mientras mira la pantalla de su notebook',
    desc: 'Estructuras de 30 a 60 segundos para presentar un producto, responder dudas y cerrar con una invitación clara.',
    incluye: ['25 guiones para adaptar', 'Ganchos para los primeros segundos', 'Pedidos de IA para reescribirlos'] },
  { id: 'planner-lanzamiento', nombre: 'Planner de lanzamiento digital', cat: 'plantillas', formato: 'plantilla', nivel: 'base', temas: ['ventas'],
    precio: 13900, descuento: 0, stock: 1, alta: 6, rango: 17, dato: 'Notion + PDF · 4 semanas',
    img: 'images/p-planner.webp', alt: 'Mano escribiendo en un cuaderno junto a una taza de cerámica',
    desc: 'Las cuatro semanas antes de lanzar un producto, día por día: qué preparar, qué publicar y qué mensajes enviar.',
    incluye: ['Plan de 4 semanas', 'Tablero en Notion', 'Checklist de lanzamiento'] },
  { id: 'mensajes-whatsapp', nombre: 'Mensajes de venta para WhatsApp', cat: 'plantillas', formato: 'plantilla', nivel: 'cero', temas: ['ventas', 'automatizacion'],
    precio: 9900, descuento: 0, stock: 1, alta: 5, rango: 18, dato: 'PDF · 80 mensajes',
    img: 'images/p-mensajes.webp', alt: 'Notebook sobre un escritorio claro junto a una planta, con una mano en el teclado',
    desc: 'Respuestas para consultas de precio, seguimientos, pagos y postventa, escritas para sonar cercanas y no robóticas.',
    incluye: ['80 mensajes listos', 'Ordenados por momento de la venta', 'Versión para copiar desde el celular'] },
  { id: 'combo-contenido', nombre: 'Combo Contenido', cat: 'combos', formato: 'combo', nivel: 'cero', temas: ['redes'],
    precio: 57700, descuento: 20, stock: 1, alta: 21, rango: 19, dato: 'Taller + plantillas + calendario',
    img: 'images/p-combo-contenido.webp', alt: 'Hombre con anteojos trabajando en su notebook junto a una planta',
    desc: 'Todo para publicar con constancia: el taller de contenido con IA, las 60 plantillas de Canva y el calendario de 30 días.',
    incluye: ['Contenido para redes con IA', '60 plantillas de Canva para Reels y posts', 'Calendario de contenidos de 30 días'] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.formato, p.desc, p.dato, ...(p.incluye || []), ETIQUETAS[p.cat] || '', ETIQUETAS[p.nivel] || '', ...(p.temas || []).map(t => ETIQUETAS[t] || t),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tema = lista(f.tema), nivel = lista(f.nivel), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tema.length && !(p.temas || []).some(t => tema.includes(t))) return false;
    if (nivel.length && !nivel.includes(p.nivel)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const temas = {}, niveles = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.temas || []).forEach(t => { temas[t] = (temas[t] || 0) + 1; });
      niveles[p.nivel] = (niveles[p.nivel] || 0) + 1;
    });
    return { temas, niveles };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'ofreceprogramaeducativo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  gorro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
  plantilla: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>',
  capas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const formatoDe = p => FORMATOS[p.formato] || FORMATOS.pdf;
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function precioHTML(p, extra = '') {
  return `<p class="precio${extra}"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="prod__badge">-${p.descuento}%</span>`;
  if (p.tag) return `<span class="prod__badge prod__badge--nuevo">${esc(p.tag)}</span>`;
  return '';
}
function cardHTML(p, { portada = false } = {}) {
  const nombre = esc(p.nombre);
  const f = formatoDe(p);
  const en = Cart.has(p.id);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a><span class="prod__formato">${ICON[f.icono]}${esc(f.nombre)}</span>${badgeHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  const meta = `<p class="prod__meta">${esc(nombreDe(NIVELES, p.nivel))} · ${esc(p.dato)}</p>`;
  if (portada) {
    return `<article class="prod prod--portada">${media}<div class="prod__info">${meta}${titulo}${precioHTML(p)}<button type="button" class="prod-mini${en ? ' is-in' : ''}" data-add="${p.id}" data-nombre="${nombre}" aria-label="${en ? `Ver el carrito: ${nombre} ya está adentro` : `Agregar al carrito: ${nombre}`}">${en ? ICON.check : ICON.carritoMas}</button></div></article>`;
  }
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      ${meta}
      ${titulo}
      ${precioHTML(p)}
      <div class="prod__acciones"><button type="button" class="btn btn--cta prod-add${en ? ' is-in' : ''}" data-add="${p.id}" data-nombre="${nombre}" aria-label="${en ? `Ver el carrito: ${nombre} ya está adentro` : `Agregar al carrito: ${nombre}`}"><span class="lbl-long">${en ? 'En tu carrito' : 'Agregar al carrito'}</span><span class="lbl-short">${en ? 'En carrito' : 'Agregar'}</span></button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function etiquetarBoton(b, on) {
  const nombre = b.dataset.nombre || getProducto(b.dataset.add)?.nombre || '';
  b.classList.toggle('is-in', on);
  if (b.classList.contains('prod-mini')) {
    b.innerHTML = on ? ICON.check : ICON.carritoMas;
    b.setAttribute('aria-label', on ? `Ver el carrito: ${nombre} ya está adentro` : `Agregar al carrito: ${nombre}`);
    return;
  }
  const largo = b.querySelector('.lbl-long'), corto = b.querySelector('.lbl-short'), lbl = b.querySelector('.lbl');
  if (largo) largo.textContent = on ? 'En tu carrito' : 'Agregar al carrito';
  if (corto) corto.textContent = on ? 'En carrito' : 'Agregar';
  if (lbl) lbl.textContent = on ? 'En tu carrito · ver' : (b.dataset.lblOff || 'Agregar al carrito');
  if (b.hasAttribute('aria-label')) b.setAttribute('aria-label', on ? `Ver el carrito: ${nombre} ya está adentro` : `Agregar al carrito: ${nombre}`);
}
function syncBotones() {
  const ids = new Set(Cart.get().map(i => i.id));
  document.querySelectorAll('[data-add]').forEach(b => etiquetarBoton(b, ids.has(b.dataset.add)));
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
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="48" height="48" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-pie"><p>Acceso online apenas se aprueba el pago.</p><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
  if (!btn || !form) return;
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
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8 }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72)
    .from(hero.querySelectorAll('.prompt'), { y: 24, scale: 0.94, opacity: 0, duration: 1, clearProps: 'transform,opacity,scale' }, 0.62);
}

function initPrompt() {
  const box = document.querySelector('[data-prompt]');
  if (!box || reduceMotion) return;
  const texto = box.querySelector('.prompt__texto');
  const items = [...box.querySelectorAll('.prompt__resp li')];
  if (!texto) return;
  const full = texto.textContent.trim();
  items.forEach(li => li.classList.remove('on'));
  box.classList.add('is-esperando');
  texto.innerHTML = '<span></span><i class="cursor"></i>';
  const destino = texto.firstChild;
  let i = 0;
  const escribir = () => {
    destino.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(escribir, 32 + Math.random() * 30);
    else items.forEach((li, k) => setTimeout(() => {
      li.classList.add('on');
      if (k === items.length - 1) setTimeout(() => texto.querySelector('.cursor')?.remove(), 600);
    }, 420 + k * 380));
  };
  setTimeout(escribir, 1100);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(box => {
    const vp = box.querySelector('.rail-vp');
    const track = box.querySelector('.rail-track');
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    if (!vp || !track) return;
    const flechas = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    const paso = () => {
      const card = track.children[0];
      return card ? card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16) : vp.clientWidth * 0.8;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();

    let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
      }
      if (moved) vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      let destino = null;
      if (moved) {
        matar = true;
        setTimeout(() => { matar = false; }, 60);
        const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
        const posiciones = [...track.children].map(c => c.offsetLeft - inicio);
        if (posiciones.length) {
          const max = vp.scrollWidth - vp.clientWidth;
          destino = posiciones.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a));
          destino = Math.max(0, Math.min(destino, max));
        }
      }
      vp.classList.remove('dragging');
      if (destino !== null) vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
      pointerId = null; moved = false;
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
    vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function pintarChipsCategorias(cont, actual = null) {
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="30" height="30" decoding="async">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`).join('');
}

function initHome() {
  if (PAGINA !== 'home') return;
  const destacados = Tienda.consultar({ filtros: { excluir: ['franquicia-ia'] }, orden: 'destacados', limite: 8 }).items;
  const grilla = document.getElementById('grillaDestacados');
  if (grilla) grilla.innerHTML = destacados.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p)}</li>`).join('');
  const rail = document.getElementById('railProductos');
  if (rail) rail.innerHTML = destacados.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { portada: true })}</li>`).join('');
  document.querySelectorAll('[data-cats-fila]').forEach(c => {
    pintarChipsCategorias(c);
    c.querySelectorAll('.chip').forEach(ch => { ch.setAttribute('data-animate', 'escala'); ch.style.cssText = 'opacity:0;transform:translateY(20px) scale(.92)'; });
  });
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = `Ver los ${total} productos`; });
}

function pintarPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (!p) return;
    const fin = el.querySelector('.precio__final');
    if (fin) fin.textContent = formatearPrecio(precioFinal(p));
  });
}

const QV = { p: null, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const f = formatoDe(p);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, orden: 'destacados', limite: 3 - rel.length }).items);
  const en = Cart.has(p.id);
  const msg = `Hola Vivi! Vi ${p.nombre} en la web y tengo una consulta.`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="1000"><span class="prod__formato">${ICON[f.icono]}${esc(f.nombre)}</span>${badgeHTML(p)}</div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p, ' precio--xl')}
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__datos">
          <div><dt>Formato</dt><dd>${esc(f.nombre)}</dd></div>
          <div><dt>Contenido</dt><dd>${esc(p.dato)}</dd></div>
          <div><dt>Nivel</dt><dd>${esc(nombreDe(NIVELES, p.nivel))}</dd></div>
          <div><dt>Acceso</dt><dd>Online, al aprobarse el pago</dd></div>
        </dl>
        <ul class="qv__incluye">${(p.incluye || []).map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>
        <div class="qv__compra">
          <button type="button" class="btn btn--cta${en ? ' is-in' : ''}" data-add="${p.id}" data-nombre="${esc(p.nombre)}"><span class="lbl">${en ? 'En tu carrito · ver' : 'Agregar al carrito'}</span></button>
          <button type="button" class="btn btn--line" data-comprar="${p.id}">Comprar ahora</button>
        </div>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}¿Dudas con este producto? Preguntale a Vivi</a>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede servir</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="500"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p;
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
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" data-linea="${p.id}">
    <img src="${p.img}" alt="" width="64" height="80">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(formatoDe(p).nombre)} · ${esc(p.dato)}</p>
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.carrito}<p>Tu carrito está vacío. ¿Arrancamos por una guía o por el programa completo?</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = ['Hola Vivi! Quiero comprar esto:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${p.nombre}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
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
    if (linea && e.target.closest('[data-quitar]')) Cart.remove(linea.dataset.linea);
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
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      if (Cart.has(p.id)) {
        if (add.closest('.qv')) cerrarQV();
        setTimeout(abrirCarrito, add.closest('.qv') && !reduceMotion ? 200 : 0);
        return;
      }
      Cart.add(p, 1);
      showToast(`Sumaste ${p.nombre} al carrito.`);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      if (!Cart.has(p.id)) Cart.add(p, 1);
      if (comprar.closest('.qv')) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initAcordeones() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), tema: multi('tema', TEMAS), nivel: multi('nivel', NIVELES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const portada = MODELO === '2';
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
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.tema.length) f.tema = e.tema;
    if (e.nivel.length) f.nivel = e.nivel;
    if (e.oferta) f.oferta = true;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const temas = TEMAS.filter(t => fac.temas[t.id]);
    if (temas.length) grupos.push(`<fieldset class="f-grupo"><legend>Tema</legend>
      ${temas.map(t => opcion('checkbox', `tema-${t.id}`, t.id, esc(t.nombre), e.tema.includes(t.id), fac.temas[t.id], 'tema')).join('')}</fieldset>`);
    const niveles = NIVELES.filter(n => fac.niveles[n.id]);
    if (niveles.length) grupos.push(`<fieldset class="f-grupo"><legend>Nivel</legend>
      ${niveles.map(n => opcion('checkbox', `nivel-${n.id}`, n.id, esc(n.nombre), e.nivel.includes(n.id), fac.niveles[n.id], 'nivel')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo con descuento', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const tema = !cat && e.tema.length === 1 ? TEMAS.find(t => t.id === e.tema[0]) : null;
    const titulo = cat ? cat.nombre : tema ? tema.nombre : e.oferta ? 'Con descuento' : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : tema ? `Productos digitales sobre ${tema.nombre.toLowerCase()}, para aplicar en tu proyecto.` : e.oferta ? 'Productos y combos con descuento.' : 'El programa Franquicia IA, talleres grabados, guías en PDF, plantillas y combos. Acceso online apenas se aprueba el pago.';
    document.title = `${titulo} — Franquicia IA con Vivi`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : tema ? tema.nombre : e.oferta ? 'Con descuento' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : tema ? `${CATALOGO_URL}?tema=${tema.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip chip--solo" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="30" height="30" decoding="async">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--solo" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Con descuento <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.tema.forEach(v => quitar.push(['tema', v, nombreDe(TEMAS, v)]));
    e.nivel.forEach(v => quitar.push(['nivel', v, nombreDe(NIVELES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo con descuento']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'tema', 'nivel', 'precio', 'oferta', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.tema.length) u.searchParams.set('tema', e.tema.join(','));
    if (e.nivel.length) u.searchParams.set('nivel', e.nivel.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p, { portada })}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta') e.oferta = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('[data-header-search]').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.id === 'busquedaHeader') {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.tema = []; e.nivel = []; e.precio = ''; e.oferta = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta') e.oferta = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.tema = []; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.tema = []; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-todo, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.tema = (u.searchParams.get('tema') || '').split(',').filter(v => TEMAS.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.nivel = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
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
document.addEventListener('cart:updated', syncBotones);

[initCatsMenu, initHome, initCatalogo, pintarPrecios, syncBotones, initReveals, initNav, initBuscadorHeader, initHeroMotion, initPrompt, initParallax, initRail,
  initQV, initCarrito, initAcciones, initFloats, initAcordeones, initModelBarScroll, syncModelosLink, updateCartBadge]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
