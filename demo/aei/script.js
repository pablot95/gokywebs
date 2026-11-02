const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const esM2 = document.body.classList.contains('m2');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ICO = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  signal: '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  lectura: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>'
};
const ico = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ''}</svg>`;

const CATEGORIAS = [
  { id: 'calidad', nombre: 'Calidad y BPM', cod: 'CAL', color: '#2E7563' },
  { id: 'carta', nombre: 'Carta y costos', cod: 'CAR', color: '#24496B' },
  { id: 'equipo', nombre: 'Equipo y salón', cod: 'EQP', color: '#7A5B1E' },
  { id: 'equipamiento', nombre: 'Equipamiento', cod: 'EQM', color: '#4A5560' },
  { id: 'material', nombre: 'Material descargable', cod: 'MAT', color: '#6B4E71' }
];
const MODALIDADES = [
  { id: 'grabada', nombre: 'Online grabada', ico: 'play' },
  { id: 'vivo', nombre: 'En vivo', ico: 'video' },
  { id: 'descarga', nombre: 'Descargable', ico: 'download' }
];
const NIVELES = ['Inicial', 'Intermedio', 'Avanzado'];
const PORTADAS = {
  'si-estanteria-ordenada': 'Estantería de acero con recipientes cerrados de legumbres, pastas y harinas, separados del piso',
  'elaboracion-carta': 'Chef emplatando mientras la dueña del restaurante prueba los platos de la carta',
  'asesoria-equipamiento': 'Asesor con una tablet señala los hornos de la cocina mientras la dueña escucha',
  'seleccion-personal': 'Entrevista a una cocinera en la mesa de un restaurante, con planillas sobre la mesa'
};

const CURSOS = [
  {
    id: 'bpm-cocina', titulo: 'Buenas prácticas de manufactura en la cocina', categoria: 'calidad', nivel: 'Inicial', modalidad: 'grabada', precio: 38000,
    destacado: 1, portada: 'si-estanteria-ordenada', badge: 'Para empezar',
    corta: 'Higiene, temperaturas, limpieza y registros: lo que todo el equipo tiene que hacer igual, todos los días.',
    completa: 'Las buenas prácticas de manufactura aplicadas a una cocina real: higiene personal, recepción y almacenamiento, cadena de frío, limpieza y los registros que lo demuestran. Para que cocina, bacha y depósito trabajen con las mismas reglas.',
    resultados: ['Aplicar las reglas de higiene personal en cada turno', 'Controlar temperaturas de recepción, frío y cocción', 'Ordenar la limpieza y llevar los registros sin vueltas'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['12 clases en video y lectura', 'Planilla de temperaturas para imprimir', 'Acceso desde el celular o la compu'],
    modulos: [
      ['Higiene y manipulación', [['Higiene personal y uniforme', 'video', 14, 1], ['Lavado de manos: cuándo y cómo', 'video', 9], ['Salud del manipulador', 'lectura', 6]]],
      ['Del proveedor a la heladera', [['Recepción de mercadería', 'video', 15], ['Cadena de frío y temperaturas', 'video', 17], ['Almacenamiento y rotación', 'video', 12]]],
      ['Limpieza y desinfección', [['Limpiar no es desinfectar', 'video', 11], ['Plan de limpieza de la cocina', 'pdf', 8], ['Control de plagas', 'video', 10]]],
      ['Registros', [['Qué registrar y por qué', 'video', 9], ['Planilla de temperaturas', 'pdf', 5], ['Repaso con casos de cocina', 'video', 16]]]
    ]
  },
  {
    id: 'contaminacion-cruzada', titulo: 'Contaminación cruzada y alérgenos', categoria: 'calidad', nivel: 'Inicial', modalidad: 'grabada', precio: 22000,
    corta: 'Tablas, utensilios y superficies: cómo evitar que lo crudo y los alérgenos lleguen al plato que no corresponde.',
    completa: 'El error de la tabla compartida, explicado desde la mesada: cómo pasa la contaminación de un alimento a otro, cómo ordenar tablas, cuchillos y heladera, y cómo preparar un plato para alguien con alergia sin arriesgarlo.',
    resultados: ['Separar crudo y cocido en la mesada y en la heladera', 'Organizar tablas y utensilios por uso', 'Preparar y comunicar un plato apto para alérgicos'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['9 clases en video y lectura', 'Cartel de tablas por color para imprimir'],
    modulos: [
      ['Cómo se contamina un plato', [['Contaminación cruzada: qué es', 'video', 8, 1], ['Crudo y listo para comer', 'video', 10], ['Manos, trapos y superficies', 'video', 9]]],
      ['Tablas, utensilios y orden', [['Tablas y cuchillos por color', 'video', 8], ['Orden en la heladera', 'video', 9], ['Lavado entre tareas', 'lectura', 5]]],
      ['Alérgenos', [['Los alérgenos más comunes', 'lectura', 7], ['Preparar un plato sin trazas', 'video', 12], ['Cómo informar al cliente', 'video', 8]]]
    ]
  },
  {
    id: 'recepcion-almacenamiento', titulo: 'Recepción, almacenamiento y rotulado', categoria: 'calidad', nivel: 'Inicial', modalidad: 'grabada', precio: 22000,
    corta: 'Qué controlar cuando llega el proveedor, cómo guardar en cámara y depósito, y cómo rotular para usar primero lo que entró primero.',
    completa: 'Lo que pasa entre la puerta de servicio y la mesada: control de la mercadería al recibirla, temperaturas, orden de la cámara y del depósito seco, y un sistema de rótulos para que siempre se use primero lo que entró primero.',
    resultados: ['Controlar la mercadería al recibirla', 'Ordenar cámara, heladeras y depósito', 'Rotular y rotar para no tirar comida'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['9 clases en video y lectura', 'Modelo de rótulo para imprimir'],
    modulos: [
      ['Recepción', [['Qué revisar cuando llega el proveedor', 'video', 11, 1], ['Temperaturas de recepción', 'video', 8], ['Cuándo rechazar mercadería', 'lectura', 6]]],
      ['Almacenamiento', [['Cámara, heladera y freezer', 'video', 12], ['Depósito seco: estantes y recipientes', 'video', 9], ['Nada en el piso', 'video', 6]]],
      ['Rotulado y rotación', [['Cómo rotular lo que se elabora', 'video', 8], ['Primero en entrar, primero en salir', 'video', 7], ['Modelo de rótulo', 'pdf', 3]]]
    ]
  },
  {
    id: 'auditoria-bpm', titulo: 'Auditoría interna de BPM para encargados', categoria: 'calidad', nivel: 'Avanzado', modalidad: 'vivo', precio: 54000,
    badge: 'En vivo', encuentros: '3 encuentros de 2 h',
    corta: 'Recorré tu cocina con una lista de control, detectá desvíos y armá un plan de corrección con responsables.',
    completa: 'Para encargados, jefes de cocina y dueños: en tres encuentros en vivo armás tu propia lista de control, aprendés a recorrer la cocina con ojo de auditor y salís con un plan de corrección listo para poner en marcha.',
    resultados: ['Armar la lista de control de tu cocina', 'Recorrer la cocina y registrar desvíos', 'Asignar correcciones con plazo y responsable'],
    requisitos: ['Haber hecho «Buenas prácticas de manufactura en la cocina» o tener experiencia equivalente', 'Estar a cargo de una cocina o de un turno'],
    incluye: ['3 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Lista de control editable'],
    modulos: [
      ['Encuentro 1 · La lista de control', [['Qué se audita en una cocina', 'vivo', 40], ['Armado de la lista de control', 'vivo', 50], ['Preguntas del grupo', 'vivo', 30]]],
      ['Encuentro 2 · La recorrida', [['Recorrer la cocina sin frenar el servicio', 'vivo', 45], ['Detectar desvíos con fotos y registros', 'vivo', 45], ['Ejercicio con casos', 'vivo', 30]]],
      ['Encuentro 3 · Plan de corrección', [['Prioridades y responsables', 'vivo', 40], ['Seguimiento de lo corregido', 'vivo', 40], ['Cierre y consultas', 'vivo', 40]]]
    ]
  },
  {
    id: 'costeo-carta', titulo: 'Costeo de platos e ingeniería de carta', categoria: 'carta', nivel: 'Intermedio', modalidad: 'vivo', precio: 48000,
    destacado: 2, portada: 'elaboracion-carta', badge: 'En vivo', encuentros: '3 encuentros de 2 h',
    corta: 'Calculá el costo real de cada plato, fijá precios con margen y decidí qué platos empujar, cambiar o sacar.',
    completa: 'Tres encuentros en vivo para dejar de poner precios a ojo: costo real de cada plato con rendimiento y merma, margen por plato y por carta, y una mirada de ingeniería de carta para decidir qué se queda y qué se va.',
    resultados: ['Calcular el costo por porción con la merma incluida', 'Fijar precios con el margen que necesitás', 'Ordenar la carta según lo que se vende y lo que deja'],
    requisitos: ['Tener a mano las recetas y los precios de tus proveedores'],
    incluye: ['3 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Plantilla de costeo editable'],
    modulos: [
      ['Encuentro 1 · El costo de cada plato', [['Receta, rendimiento y merma', 'vivo', 45], ['Costo por porción', 'vivo', 45], ['Ejercicio con un plato de tu carta', 'vivo', 30]]],
      ['Encuentro 2 · Precio y margen', [['Del costo al precio de venta', 'vivo', 40], ['Margen por plato y por carta', 'vivo', 40], ['Cuando aumenta un proveedor', 'vivo', 40]]],
      ['Encuentro 3 · Ingeniería de carta', [['Qué platos empujar, cambiar o sacar', 'vivo', 45], ['Cómo se lee una carta', 'vivo', 35], ['Tu carta, revisada en grupo', 'vivo', 40]]]
    ]
  },
  {
    id: 'recetas-estandar', titulo: 'Recetas estándar y fichas técnicas', categoria: 'carta', nivel: 'Inicial', modalidad: 'grabada', precio: 26000,
    corta: 'Que el plato salga igual con cualquier cocinero: gramajes, procedimiento y foto de emplatado en una ficha.',
    completa: 'Cómo pasar las recetas de la cabeza del cocinero a una ficha que cualquiera pueda seguir: gramajes, rendimiento, procedimiento y foto de emplatado, y cómo usarlas en el pase y para capacitar.',
    resultados: ['Escribir recetas con gramajes y rendimiento', 'Armar la ficha técnica de cada plato', 'Usar las fichas para capacitar al equipo'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['9 clases en video y lectura', 'Modelo de ficha técnica editable'],
    modulos: [
      ['La receta estándar', [['Por qué estandarizar', 'video', 7, 1], ['Gramajes y rendimientos', 'video', 12], ['Procedimiento paso a paso', 'video', 10]]],
      ['La ficha técnica', [['Qué lleva una ficha', 'lectura', 6], ['Foto de emplatado', 'video', 8], ['Modelo de ficha técnica', 'pdf', 3]]],
      ['En el servicio', [['La ficha en el pase', 'video', 9], ['Capacitar con la ficha', 'video', 8], ['Actualizar cuando cambia un insumo', 'video', 6]]]
    ]
  },
  {
    id: 'equipo-nuevo', titulo: 'Selección e incorporación del equipo', categoria: 'equipo', nivel: 'Intermedio', modalidad: 'vivo', precio: 36000,
    destacado: 4, portada: 'seleccion-personal', badge: 'En vivo', encuentros: '3 encuentros de 2 h',
    corta: 'Definí el puesto, entrevistá con preguntas que sirven y armá los primeros días del que entra a cocina o salón.',
    completa: 'Para dueños y encargados que necesitan sumar gente: cómo definir el puesto, buscar, entrevistar y probar, y cómo organizar los primeros días para que la persona que entra aprenda rápido y se quede.',
    resultados: ['Escribir el perfil de cada puesto', 'Entrevistar con preguntas concretas', 'Planificar los primeros días del equipo nuevo'],
    requisitos: ['Estar a cargo de un equipo o por incorporar gente'],
    incluye: ['3 encuentros en vivo por videollamada', 'Grabación de cada encuentro', 'Guía de entrevista editable'],
    modulos: [
      ['Encuentro 1 · El puesto y la búsqueda', [['Definir el puesto y el perfil', 'vivo', 40], ['Dónde y cómo publicar', 'vivo', 35], ['Preguntas que sirven en la entrevista', 'vivo', 45]]],
      ['Encuentro 2 · La prueba y los primeros días', [['Prueba en cocina o salón', 'vivo', 35], ['Plan de los primeros quince días', 'vivo', 45], ['Consultas del grupo', 'vivo', 40]]],
      ['Encuentro 3 · Que se quede', [['Devoluciones y seguimiento', 'vivo', 40], ['Turnos y francos claros', 'vivo', 40], ['Casos del grupo', 'vivo', 40]]]
    ]
  },
  {
    id: 'servicio-salon', titulo: 'Atención en salón y servicio de mesa', categoria: 'equipo', nivel: 'Inicial', modalidad: 'grabada', precio: 26000,
    corta: 'Recibir, tomar el pedido, servir y cobrar: los pasos del servicio para que el salón trabaje coordinado con la cocina.',
    completa: 'El servicio de salón de punta a punta: la bienvenida, la carta y el pedido, el pase con la cocina, cómo servir y retirar, cómo atender un reclamo y cómo cerrar la mesa.',
    resultados: ['Recibir y ubicar a los clientes', 'Coordinar el pase con la cocina', 'Resolver un reclamo sin frenar el servicio'],
    requisitos: ['No hace falta experiencia previa'],
    incluye: ['9 clases en video y lectura', 'Guía de pasos del servicio para imprimir'],
    modulos: [
      ['Recibir y ubicar', [['La bienvenida y la mesa', 'video', 8, 1], ['Presentar la carta', 'video', 9], ['Tomar el pedido', 'video', 10]]],
      ['Servicio de mesa', [['El pase entre cocina y salón', 'video', 11], ['Servir y retirar', 'video', 9], ['Atender un reclamo', 'video', 10]]],
      ['Cierre de la mesa', [['La cuenta y el cobro', 'video', 7], ['La despedida', 'lectura', 4], ['Orden del salón al cierre', 'video', 8]]]
    ]
  },
  {
    id: 'puesta-en-marcha', titulo: 'Equipamiento y puesta en marcha de una cocina', categoria: 'equipamiento', nivel: 'Intermedio', modalidad: 'grabada', precio: 42000,
    destacado: 3, portada: 'asesoria-equipamiento', badge: 'Nuevo',
    corta: 'Qué equipos necesitás según tu carta, cómo ubicarlos para que el trabajo fluya y qué revisar antes de abrir.',
    completa: 'Para quien arma o reforma una cocina: cómo pasar de la carta a la lista de equipos, cómo ubicarlos para que lo sucio no cruce lo limpio y qué revisar de instalación y mantenimiento antes de abrir.',
    resultados: ['Armar la lista de equipos según tu carta', 'Ubicar cada zona para que el trabajo fluya', 'Revisar instalación y mantenimiento antes de abrir'],
    requisitos: ['Tener definida la carta o el tipo de cocina'],
    incluye: ['9 clases en video y lectura', 'Lista de control de apertura para imprimir'],
    modulos: [
      ['Qué equipos necesitás', [['De la carta a la lista de equipos', 'video', 12, 1], ['Cocción, frío y lavado', 'video', 14], ['Comprar nuevo o usado', 'lectura', 7]]],
      ['Dónde va cada cosa', [['De lo sucio a lo limpio', 'video', 13], ['Las zonas de la cocina', 'video', 11], ['Plano de ejemplo', 'pdf', 4]]],
      ['Antes de abrir', [['Instalación y pruebas', 'video', 10], ['Mantenimiento de los equipos', 'video', 9], ['Lista de control de apertura', 'pdf', 4]]]
    ]
  },
  {
    id: 'kit-planillas', titulo: 'Planillas de control BPM', categoria: 'material', modalidad: 'descarga', precio: 15000,
    contenido: '4 planillas', uso: 'Imprimible y editable',
    corta: 'Temperaturas, limpieza, recepción de mercadería y control de plagas, listas para imprimir y completar.',
    completa: 'Las planillas que piden las buenas prácticas, armadas para usar en la cocina: columnas claras, espacio para firmar y una versión editable para sumar el nombre de tu local.',
    archivos: ['Temperaturas de heladeras y cámaras', 'Limpieza y desinfección por sector', 'Recepción de mercadería', 'Control de plagas'],
    incluye: ['4 planillas en PDF', 'Versión editable de cada una']
  },
  {
    id: 'carteleria', titulo: 'Cartelería para la cocina', categoria: 'material', modalidad: 'descarga', precio: 12000,
    contenido: '5 carteles A4', uso: 'Para imprimir',
    corta: 'Carteles para pegar en la cocina: lavado de manos, tablas por color, rotación de mercadería y cadena de frío.',
    completa: 'Cinco carteles claros y sin vueltas para pegar donde se necesitan: en la bacha, sobre la mesada, en la cámara y en el depósito. En hoja A4, listos para imprimir y plastificar.',
    archivos: ['Lavado de manos', 'Tablas y cuchillos por color', 'Primero en entrar, primero en salir', 'Cadena de frío y temperaturas', 'Uniforme y cabello recogido'],
    incluye: ['5 carteles en PDF A4']
  },
  {
    id: 'plantilla-costeo', titulo: 'Plantilla de costeo de carta', categoria: 'material', modalidad: 'descarga', precio: 14000,
    contenido: 'Planilla de 3 hojas', uso: 'Editable',
    corta: 'Planilla editable para cargar insumos, calcular el costo por plato y ver el margen de cada uno.',
    completa: 'Cargás una vez los insumos con su precio y armás cada receta: la planilla calcula el costo por porción con la merma, el margen y un precio sugerido. Cuando aumenta un proveedor, se actualiza toda la carta.',
    archivos: ['Insumos y precios', 'Recetas con rendimiento y merma', 'Costo y margen por plato'],
    incluye: ['Planilla de 3 hojas', 'Instructivo de uso en PDF']
  }
].map((c, i, todos) => {
  const cat = CATEGORIAS.find(x => x.id === c.categoria);
  const n = todos.slice(0, i + 1).filter(x => x.categoria === c.categoria).length;
  const modulos = (c.modulos || []).map(([titulo, clases]) => ({ titulo, clases: clases.map(([t, tipo, min, prev]) => ({ titulo: t, tipo, min, preview: !!prev })) }));
  return { stock: 1, descuento: 0, ...c, cat, codigo: `${cat.cod} · ${String(n).padStart(2, '0')}`, modulos };
});
const PRODUCTOS = CURSOS;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const minutos = c => c.modulos.reduce((s, m) => s + m.clases.reduce((a, k) => a + k.min, 0), 0);
const cantClases = c => c.modulos.reduce((s, m) => s + m.clases.length, 0);
const durTxt = min => { const h = Math.floor(min / 60); const m = min % 60; return h ? `${h} h${m ? ' ' + m + ' min' : ''}` : `${m} min`; };
const contenidoTxt = c => c.modalidad === 'descarga' ? c.contenido : c.modalidad === 'vivo' ? c.encuentros : `${cantClases(c)} clases · ${durTxt(minutos(c))}`;
const modalidad = c => MODALIDADES.find(m => m.id === c.modalidad);
const metaItems = c => [
  [modalidad(c)?.ico || 'play', modalidad(c)?.nombre || ''],
  [c.modalidad === 'descarga' ? 'file' : 'clock', contenidoTxt(c)],
  ['signal', c.nivel || c.uso]
];

const Cart = {
  KEY: 'aei_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  has(id) { return this.get().some(i => i.id === id); }
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

const addLabel = c => Cart.has(c.id) ? 'En el carrito' : 'Agregar';
const addBtn = (c, cls = '') => `<button type="button" class="btn btn--sm${cls ? ' ' + cls : ''}${Cart.has(c.id) ? ' is-dentro' : ''}" data-add="${c.id}">${addLabel(c)}</button>`;
const fichaHTML = c => `<ul class="ficha">${metaItems(c).map(([i, t]) => `<li>${ico(i)}<span>${esc(t)}</span></li>`).join('')}</ul>`;
const kickerHTML = c => `<p class="kicker"><span class="kicker__cat" style="--cat:${c.cat.color}">${esc(c.cat.nombre)}</span>${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</p>`;
const portadaHTML = c => `<img src="images/${c.portada}.webp" width="1200" height="1200" alt="${esc(PORTADAS[c.portada] || c.titulo)}">`;

function dcardHTML(c, variante) {
  const extra = variante === 'grande'
    ? `<p class="dcard__desc">${esc(c.corta)}</p><ul class="check-list">${c.resultados.map(r => `<li>${ico('check')}<span>${esc(r)}</span></li>`).join('')}</ul>`
    : '';
  return `<article class="dcard dcard--${variante}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
  <div class="dcard__foto" data-ver="${c.id}">${portadaHTML(c)}</div>
  <div class="dcard__cuerpo">
    ${kickerHTML(c)}
    <h3 class="dcard__titulo">${esc(c.titulo)}</h3>
    ${extra}
    ${fichaHTML(c)}
    <div class="dcard__pie"><strong class="precio">${formatearPrecio(precioFinal(c))}</strong><div class="acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.id}">Ver programa</button>${addBtn(c)}</div></div>
  </div>
</article>`;
}

function renderDestacados() {
  const cont = document.getElementById('destacadas');
  if (!cont) return;
  const lista = CURSOS.filter(c => c.destacado).sort((a, b) => a.destacado - b.destacado).slice(0, 4);
  if (esM2) {
    const [primero, ...resto] = lista;
    cont.innerHTML = dcardHTML(primero, 'grande') + `<div class="destacadas__resto">${resto.map(c => dcardHTML(c, 'fila')).join('')}</div>`;
  } else {
    cont.innerHTML = lista.map(c => dcardHTML(c, 'base')).join('');
  }
}

function filaHTML(c) {
  return `<article class="fila" data-animate="subir" style="opacity:0;transform:translateY(24px)">
  <p class="codigo" style="--cat:${c.cat.color}"><span>${esc(c.cat.cod)}</span><span>${esc(c.codigo.split(' · ')[1])}</span></p>
  <div class="fila__info">
    ${kickerHTML(c)}
    <h3 class="fila__titulo"><button type="button" data-ver="${c.id}">${esc(c.titulo)}</button></h3>
    <p class="fila__desc">${esc(c.corta)}</p>
  </div>
  ${fichaHTML(c)}
  <div class="fila__pie"><strong class="precio">${formatearPrecio(precioFinal(c))}</strong><div class="acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.id}">Ver</button>${addBtn(c)}</div></div>
</article>`;
}

function rcardHTML(c) {
  const dur = c.modalidad === 'descarga' ? c.contenido : c.modalidad === 'vivo' ? c.encuentros : durTxt(minutos(c));
  const campos = [['Formato', modalidad(c)?.nombre], [c.modalidad === 'descarga' ? 'Contenido' : 'Duración', dur], [c.nivel ? 'Nivel' : 'Uso', c.nivel || c.uso]];
  return `<article class="rcard" data-animate="subir" style="opacity:0;transform:translateY(36px)">
  <p class="rcard__top" style="--cat:${c.cat.color}"><span>${esc(c.codigo)}</span><span>${esc(c.cat.nombre)}</span></p>
  <div class="rcard__cuerpo">
    ${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}
    <h3 class="rcard__titulo"><button type="button" data-ver="${c.id}">${esc(c.titulo)}</button></h3>
    <dl class="rcard__campos">${campos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <div class="rcard__pie"><strong class="precio">${formatearPrecio(precioFinal(c))}</strong><div class="acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.id}">Ver programa</button>${addBtn(c)}</div></div>
</article>`;
}

const POR_PAGINA = 12;
const filtro = { q: '', cat: 'todas', mod: 'todas', nivel: 'todos' };
let visibles = POR_PAGINA;
const normalizar = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const textoBusqueda = c => normalizar([c.titulo, c.cat.nombre, c.nivel, c.uso, modalidad(c)?.nombre, c.corta, ...(c.archivos || []), ...c.modulos.flatMap(m => [m.titulo, ...m.clases.map(k => k.titulo)])].join(' '));
const INDICE = new Map(CURSOS.map(c => [c.id, textoBusqueda(c)]));

function filtrados() {
  const palabras = normalizar(filtro.q).split(/\s+/).filter(Boolean);
  return CURSOS.filter(c =>
    (filtro.cat === 'todas' || c.categoria === filtro.cat) &&
    (filtro.mod === 'todas' || c.modalidad === filtro.mod) &&
    (filtro.nivel === 'todos' || c.nivel === filtro.nivel) &&
    palabras.every(p => INDICE.get(c.id).includes(p))
  );
}

function renderCatalogo() {
  const cont = document.getElementById('catalogo');
  if (!cont) return;
  const lista = filtrados();
  cont.innerHTML = lista.slice(0, visibles).map(c => esM2 ? rcardHTML(c) : filaHTML(c)).join('');
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = lista.length === 1 ? '1 resultado' : `${lista.length} resultados`;
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const mas = document.getElementById('ver-mas');
  if (mas) mas.hidden = lista.length <= visibles;
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = filtro.q === '' && filtro.cat === 'todas' && filtro.mod === 'todas' && filtro.nivel === 'todos';
  document.querySelectorAll('.chips[data-f]').forEach(g => g.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === filtro[g.dataset.f]))));
  revelarNuevos(cont);
}

function initFiltros() {
  const grupos = {
    cat: [['todas', 'Todas'], ...CATEGORIAS.map(c => [c.id, c.nombre])],
    mod: [['todas', 'Todos'], ...MODALIDADES.map(m => [m.id, m.nombre])],
    nivel: [['todos', 'Todos'], ...NIVELES.map(n => [n, n])]
  };
  document.querySelectorAll('.chips[data-f]').forEach(g => {
    const f = g.dataset.f;
    g.innerHTML = (grupos[f] || []).map(([v, t]) => `<button type="button" class="chip" data-v="${esc(v)}" aria-pressed="false">${esc(t)}</button>`).join('');
    g.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      filtro[f] = b.dataset.v;
      visibles = POR_PAGINA;
      renderCatalogo();
    });
  });
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filtro.q = q.value; visibles = POR_PAGINA; renderCatalogo(); }, 160); });
  const limpiarTodo = () => { filtro.q = ''; filtro.cat = 'todas'; filtro.mod = 'todas'; filtro.nivel = 'todos'; if (q) q.value = ''; visibles = POR_PAGINA; renderCatalogo(); };
  document.getElementById('limpiar')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacio-limpiar')?.addEventListener('click', limpiarTodo);
  document.getElementById('ver-mas')?.addEventListener('click', () => { visibles += POR_PAGINA; renderCatalogo(); });
  document.querySelectorAll('[data-ir-cat]').forEach(a => a.addEventListener('click', () => {
    filtro.cat = a.dataset.irCat; filtro.mod = 'todas'; filtro.nivel = 'todos'; filtro.q = ''; if (q) q.value = '';
    visibles = POR_PAGINA; renderCatalogo();
  }));
  const det = document.querySelector('.filtros-det');
  if (det) {
    const mq = window.matchMedia('(min-width: 900px)');
    const sync = () => { if (mq.matches) det.open = true; };
    det.open = mq.matches;
    mq.addEventListener('change', sync);
    det.querySelector('summary')?.addEventListener('click', e => { if (mq.matches) e.preventDefault(); });
  }
  renderCatalogo();
}

let focoPrevio = null;
const capaAbierta = () => document.querySelector('.capa.abierta');
function abrirCapa(capa) {
  if (!capa) return;
  if (!capaAbierta()) focoPrevio = document.activeElement;
  capa.hidden = false;
  void capa.offsetWidth;
  capa.classList.add('abierta');
  document.body.classList.add('no-scroll');
  setTimeout(() => capa.querySelector('[data-cerrar-btn]')?.focus(), 60);
}
function cerrarCapa(capa, devolverFoco = true) {
  if (!capa || capa.hidden) return;
  capa.classList.remove('abierta');
  setTimeout(() => { if (!capa.classList.contains('abierta')) capa.hidden = true; }, 340);
  if (!document.querySelector('.capa.abierta')) document.body.classList.remove('no-scroll');
  if (devolverFoco && focoPrevio && document.contains(focoPrevio)) focoPrevio.focus();
}
function trapFocus(capa, e) {
  if (e.key !== 'Tab') return;
  const f = [...capa.querySelectorAll('a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const TIPO_CLASE = { video: ['play', 'Video'], lectura: ['lectura', 'Lectura'], pdf: ['file', 'PDF'], vivo: ['video', 'En vivo'] };
function modalHTML(c) {
  const portada = c.portada
    ? `<div class="modal__portada">${portadaHTML(c)}</div>`
    : `<div class="modal__portada modal__portada--rotulo" style="--cat:${c.cat.color}"><p class="rotulo-grande"><span>${esc(c.codigo)}</span><strong>${esc(c.titulo)}</strong><span>${esc(c.cat.nombre)}</span></p></div>`;
  const programa = c.modulos.length
    ? `<h3>Programa</h3><div class="programa">${c.modulos.map((m, i) => `<details class="modulo"${i === 0 ? ' open' : ''}><summary><span class="modulo__n">${String(i + 1).padStart(2, '0')}</span><span class="modulo__t">${esc(m.titulo)}</span><span class="modulo__d">${m.clases.length} clases · ${durTxt(m.clases.reduce((a, k) => a + k.min, 0))}</span>${ico('chevron', 'modulo__chev')}</summary><ul>${m.clases.map(k => `<li>${ico(TIPO_CLASE[k.tipo][0])}<span class="clase__t">${esc(k.titulo)}${k.preview ? '<span class="badge badge--muestra">Clase de muestra</span>' : ''}</span><span class="clase__d">${TIPO_CLASE[k.tipo][1]} · ${k.min} min</span></li>`).join('')}</ul></details>`).join('')}</div>`
    : `<h3>Qué trae</h3><ul class="archivos">${c.archivos.map(a => `<li>${ico('file')}<span>${esc(a)}</span></li>`).join('')}</ul>`;
  const listas = [
    c.resultados ? `<div><h3>Qué vas a poder hacer</h3><ul class="check-list">${c.resultados.map(r => `<li>${ico('check')}<span>${esc(r)}</span></li>`).join('')}</ul></div>` : '',
    `<div><h3>Incluye</h3><ul class="check-list">${c.incluye.map(r => `<li>${ico('check')}<span>${esc(r)}</span></li>`).join('')}</ul></div>`,
    c.requisitos ? `<div><h3>Requisitos</h3><ul class="check-list check-list--suave">${c.requisitos.map(r => `<li>${ico('arrow')}<span>${esc(r)}</span></li>`).join('')}</ul></div>` : ''
  ].join('');
  return `${portada}
  <div class="modal__cuerpo">
    ${kickerHTML(c)}
    <h2 class="modal__titulo">${esc(c.titulo)}</h2>
    <p class="modal__lead">${esc(c.corta)}</p>
    ${fichaHTML(c)}
    <div class="modal__compra"><strong class="precio precio--grande">${formatearPrecio(precioFinal(c))}</strong><div class="acciones">${addBtn(c, 'btn--linea')}<button type="button" class="btn btn--sm" data-comprar="${c.id}">Comprar ahora</button></div></div>
    <p class="modal__texto">${esc(c.completa)}</p>
    ${programa}
    <div class="modal__listas">${listas}</div>
    <p class="modal__dicta">${c.modalidad === 'descarga' ? 'Material preparado por el equipo de AEI.' : 'Dicta: el equipo de AEI.'}</p>
  </div>`;
}

function abrirCurso(id) {
  const c = getProducto(id);
  const modal = document.getElementById('modal');
  if (!c || !modal) return;
  modal.querySelector('.modal__scroll').innerHTML = modalHTML(c);
  modal.querySelector('.modal__scroll').scrollTop = 0;
  sincronizarBotones();
  abrirCapa(modal);
}

function sincronizarBotones() {
  document.querySelectorAll('[data-add]').forEach(b => {
    const dentro = Cart.has(b.dataset.add);
    b.classList.toggle('is-dentro', dentro);
    const txt = b.closest('.modal') ? (dentro ? 'En el carrito' : 'Agregar al carrito') : (dentro ? 'En el carrito' : 'Agregar');
    if (b.textContent !== txt) b.textContent = txt;
  });
}

function renderDrawer() {
  const cont = document.getElementById('drawer-items');
  if (!cont) return;
  const items = Cart.get().map(i => getProducto(i.id)).filter(Boolean);
  const pie = document.querySelector('.drawer__pie');
  if (!items.length) {
    cont.innerHTML = `<div class="drawer__vacio"><p class="rotulo-grande rotulo-grande--chico"><span>Carrito</span><strong>Todavía no elegiste nada</strong><span>Capacitaciones y material</span></p><p>Mirá las capacitaciones y el material descargable de la tienda.</p><a class="btn btn--sm" href="#tienda" data-cerrar-capa>Ir a la tienda</a></div>`;
    if (pie) pie.hidden = true;
    return;
  }
  if (pie) pie.hidden = false;
  cont.innerHTML = `<ul class="drawer__lista">${items.map(c => `<li class="ditem"><p class="codigo codigo--chico" style="--cat:${c.cat.color}"><span>${esc(c.cat.cod)}</span><span>${esc(c.codigo.split(' · ')[1])}</span></p><div class="ditem__info"><p class="ditem__titulo">${esc(c.titulo)}</p><p class="ditem__meta">${esc(modalidad(c)?.nombre)} · ${esc(contenidoTxt(c))}</p></div><div class="ditem__der"><strong class="precio">${formatearPrecio(precioFinal(c))}</strong><button type="button" class="ditem__quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)} del carrito">${ico('trash')}</button></div></li>`).join('')}</ul>`;
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initTienda() {
  const modal = document.getElementById('modal');
  const drawer = document.getElementById('drawer');
  const abrirCarrito = () => { if (modal && !modal.hidden) cerrarCapa(modal, false); renderDrawer(); abrirCapa(drawer); };
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirCurso(ver.dataset.ver); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const c = getProducto(add.dataset.add);
      if (!c) return;
      if (Cart.has(c.id)) { abrirCarrito(); return; }
      Cart.add(c);
      showToast(`«${c.titulo}» se sumó al carrito`);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const c = getProducto(comprar.dataset.comprar);
      if (c && !Cart.has(c.id)) Cart.add(c);
      abrirCarrito();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); renderDrawer(); return; }
    if (e.target.closest('[data-abrir-carrito]')) { abrirCarrito(); return; }
    const cerrar = e.target.closest('[data-cerrar-capa]');
    if (cerrar) { const capa = cerrar.closest('.capa'); cerrarCapa(capa, !cerrar.matches('a')); }
  });
  [modal, drawer].forEach(capa => capa?.addEventListener('keydown', e => trapFocus(capa, e)));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drawer && !drawer.hidden) cerrarCapa(drawer);
    else if (modal && !modal.hidden) cerrarCapa(modal);
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    const btn = document.getElementById('finalizar');
    btn.disabled = true; btn.textContent = 'Procesando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Finalizar compra';
      showToast('¡Listo! El pago y el acceso a las capacitaciones se activan al pasar la web a producción.');
    }, 800);
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); sincronizarBotones(); if (drawer && !drawer.hidden) renderDrawer(); });
  updateCartBadge();
  const slug = new URLSearchParams(location.search).get('curso');
  if (slug && getProducto(slug)) abrirCurso(slug);
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
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

function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(lista => {
    const tabs = [...lista.querySelectorAll('[role="tab"]')];
    const elegir = (tab, foco = false) => {
      tabs.forEach(t => {
        const sel = t === tab;
        t.setAttribute('aria-selected', String(sel));
        t.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !sel;
      });
      if (foco) tab.focus();
      revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    };
    lista.elegir = elegir;
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => elegir(t));
      t.addEventListener('keydown', e => {
        const k = e.key;
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(k)) return;
        e.preventDefault();
        const j = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        elegir(tabs[j], true);
      });
    });
  });
}

function activarServicio(id) {
  const tab = document.querySelector(`[role="tab"][data-servicio="${id}"]`);
  if (tab) { tab.closest('[role="tablist"]')?.elegir?.(tab); return; }
  document.querySelectorAll('.servicio[data-servicio]').forEach(s => {
    const act = s.dataset.servicio === id;
    s.classList.toggle('activa', act);
    s.querySelector('.servicio__btn')?.setAttribute('aria-expanded', String(act));
  });
  document.querySelectorAll('.servicios__foto img[data-servicio]').forEach(i => i.classList.toggle('activa', i.dataset.servicio === id));
}

function initServicios() {
  const hover = window.matchMedia('(hover: hover) and (min-width: 900px)');
  document.querySelectorAll('.servicio[data-servicio]').forEach(s => {
    const activar = () => activarServicio(s.dataset.servicio);
    s.addEventListener('mouseenter', () => { if (hover.matches) activar(); });
    s.addEventListener('focusin', activar);
    s.querySelector('.servicio__btn')?.addEventListener('click', activar);
  });
  document.querySelectorAll('[data-ir-servicio]').forEach(a => a.addEventListener('click', () => activarServicio(a.dataset.irServicio)));
}

function initPares() {
  document.querySelectorAll('[data-par]').forEach(par => {
    const botones = [...par.querySelectorAll('[data-lado]')];
    botones.forEach(b => b.addEventListener('click', () => {
      botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      par.querySelectorAll('[data-figura]').forEach(f => f.classList.toggle('activa', f.dataset.figura === b.dataset.lado));
      par.dataset.estado = b.dataset.lado;
    }));
  });
}

renderDestacados();
initFiltros();
initTabs();
initReveals();
initNav();
initTienda();
initFloats();
initModelBarScroll();
initServicios();
initPares();
