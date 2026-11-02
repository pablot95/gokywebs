const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492612598723';
const POR_PAGINA = 16;
const UMBRAL = 10000;
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
  { id: 'ebooks', nombre: 'Ebooks y recetarios', bajada: 'Recetas e ideas para cocinar y vender' },
  { id: 'guias', nombre: 'Guías y recursos', bajada: 'Planillas, plantillas y paso a paso' },
  { id: 'cursos', nombre: 'Cursos', bajada: 'Un recorrido completo, a tu ritmo' },
  { id: 'fisicos', nombre: 'Físicos a domicilio', bajada: 'Comidas y materiales que llegan a tu casa' },
  { id: 'combos', nombre: 'Combos físico + ebook', bajada: 'El producto a tu casa y el ebook al mail' },
];
const RUBROS = [
  { id: 'comidas', nombre: 'Comidas' },
  { id: 'dulces', nombre: 'Dulces y helados' },
  { id: 'huerta', nombre: 'Huerta' },
  { id: 'manualidades', nombre: 'Costura y manualidades' },
  { id: 'negocio', nombre: 'Gestión y ventas' },
];
const PRECIOS = [
  { id: 'menos10', nombre: 'Menos de $10.000', min: null, max: UMBRAL - 1 },
  { id: 'mas10', nombre: 'Más de $10.000', min: UMBRAL, max: null },
];
const SOLO = [
  { id: 'oferta', nombre: 'Ofertas' },
  { id: 'viral', nombre: 'Virales y prácticos' },
  { id: 'nuevo', nombre: 'Novedades' },
  { id: 'video', nombre: 'Con video' },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const TIPOS = {
  digital: { nombre: 'Digital', largo: 'Producto digital', entrega: [['mail', 'Entrega digital automática: te llega al mail cuando se acredita el pago.']] },
  fisico: { nombre: 'A domicilio', largo: 'Producto físico', entrega: [['fisico', 'Envío a domicilio: coordinamos el día y el horario por WhatsApp.']] },
  combo: { nombre: 'Físico + ebook', largo: 'Combo físico + digital', entrega: [['fisico', 'Lo físico te lo llevamos a domicilio: coordinamos por WhatsApp.'], ['mail', 'El ebook te llega al mail cuando se acredita el pago.']] },
};
const ENTRE_CAPAS = 'Entre Capas · Big Bite Food';

const Tienda = crearTienda([
  { id: 'combo-helado-conos-ebook', nombre: 'Combo helado 1 kg + 4 conos + ebook', cat: 'combos', rubro: 'dulces', tipo: 'combo', precio: 18900, rango: 1, alta: 25, viral: true,
    img: 'images/p-combo-helado.webp', ancho: 1080, alto: 1080, tags: 'helado pote conos combo ebook emprendedores casa sabores',
    alt: 'Flyer del combo: pote de helado de 1 kg en 4 sabores, 4 conos dobles y el ebook para emprendedores desde casa',
    corto: 'El helado a tu casa y el ebook al mail',
    desc: 'Un pote de helado de 1 kg en 4 sabores y 4 conos dobles a domicilio, más el ebook «Para emprendedores desde casa», que te llega al mail.',
    beneficios: ['1 pote de helado de 1 kg en 4 sabores', '4 conos dobles para servir', 'El ebook para emprendedores desde casa, al mail'],
    datos: [['Físico', '1 pote de 1 kg (4 sabores) + 4 conos dobles'], ['Digital', 'Ebook para emprendedores desde casa'], ['Entrega', 'Helado a domicilio · ebook al mail']] },
  { id: 'ebook-100-ideas-panchos', nombre: '100 ideas de panchos', cat: 'ebooks', rubro: 'comidas', tipo: 'digital', precio: 6900, rango: 2, alta: 30, viral: true, nuevo: true, tapa: true,
    img: 'images/t-panchos.webp', ancho: 1080, alto: 1581, tags: 'panchos hot dog salsas menu costos recetas comida rapida bonos',
    video: 'images/video-panchos.mp4', poster: 'images/video-panchos-poster.webp',
    alt: 'Tapa del ebook 100 ideas de panchos: dos panchos con salsas y cebolla crispy sobre fondo negro y amarillo',
    corto: 'Recetas fáciles para armar tu menú',
    desc: 'Todo lo que necesitás para pasar de una idea a un emprendimiento organizado: 100 ideas de panchos fáciles, originales y deliciosas, más los bonos para calcular costos y mostrar tu menú.',
    beneficios: ['100 ideas de panchos fáciles, originales y para vender', 'Bonos: 50 recetas de salsas, planilla de costos y menú editable', 'Calendario de contenido y ficha para tus redes'],
    datos: [['Formato', 'Ebook en PDF'], ['Bonos', '50 recetas de salsas, planilla de costos, menú editable, calendario de contenido y ficha para redes'], ['Ideal para', 'Arrancar una venta de panchos desde casa']] },
  { id: 'curso-200-recetas-dulces-gourmet', nombre: '+200 recetas de dulces gourmet', cat: 'cursos', rubro: 'dulces', tipo: 'digital', precio: 14900, rango: 3, alta: 26, viral: true, tapa: true,
    img: 'images/t-dulces.webp', ancho: 940, alto: 1672, tags: 'curso dulces gourmet recetas fabrica tortas trufas postres bombones',
    video: 'images/video-dulces.mp4', poster: 'images/video-dulces-poster.webp',
    alt: 'Flyer del curso +200 recetas de dulces gourmet: una pastelera sonriendo sobre una mesa de postres, trufas y tortas',
    corto: 'Tu fábrica de dulces gourmet desde casa',
    desc: 'Y todo comenzó en una cocina: ahora puede comenzar en la tuya. Más de 200 recetas de dulces gourmet para empezar tu fábrica desde casa, paso a paso.',
    beneficios: ['Más de 200 recetas de dulces gourmet', 'Paso a paso y desde casa', 'Acceso inmediato al acreditarse el pago'],
    datos: [['Formato', 'Curso digital con recetario'], ['Modalidad', 'A tu ritmo, desde casa'], ['Ideal para', 'Empezar tu fábrica de dulces gourmet']] },
  { id: 'ebooks-conos-trufados-bolis', nombre: 'Conos trufados + Bolis y marcianitos: 2 ebooks en uno', cat: 'ebooks', rubro: 'dulces', tipo: 'digital', precio: 8900, descuento: 20, rango: 4, alta: 22, viral: true, tapa: true,
    img: 'images/t-conos-bolis.webp', ancho: 1080, alto: 1620, tags: 'conos trufados bolis marcianitos helados recetas sabores combo',
    alt: 'Tapa del combo de ebooks Conos trufados y Bolis o marcianitos, con conos bañados en chocolate y bolis de colores',
    corto: 'Dos recetarios dulces para vender',
    desc: 'Dos recetarios en uno: conos trufados y bolis o marcianitos, con recetas detalladas, ideas creativas y presentaciones para vender. Convertí tus ideas dulces en grandes proyectos.',
    beneficios: ['Recetas detalladas, paso a paso', 'Ideas creativas, sabores y variaciones para sorprender', 'Presentaciones pensadas para tu emprendimiento'],
    datos: [['Formato', '2 ebooks en PDF'], ['Conos trufados', 'Recetas, ideas y presentaciones'], ['Bolis y marcianitos', 'Recetas, sabores y variaciones']] },
  { id: 'guia-emprender-desde-cero', nombre: 'Emprender desde cero: guía paso a paso', cat: 'guias', rubro: 'negocio', tipo: 'digital', precio: 6500, rango: 5, alta: 24,
    img: 'images/p-emprender.webp', ancho: 900, alto: 900, tags: 'emprender negocio costos precio ventas primeros pasos guia',
    alt: 'Tablet con un escritorio de emprendedor: cajas kraft, calculadora, anotador y cinta amarilla',
    corto: 'De la idea a tu primera venta',
    desc: 'Una guía para ordenar tu idea y salir a vender: qué ofrecer, a quién, cuánto cobrar y qué hacer la primera semana.',
    beneficios: ['Cómo elegir qué vender y a quién', 'Cálculo de costos y precio de venta', 'Checklist para tu primera semana de ventas'],
    datos: [['Formato', 'Guía en PDF'], ['Incluye', 'Planilla de costos y checklist imprimible'], ['Ideal para', 'Quien recién empieza']] },
  { id: 'big-bite-pollo', nombre: 'Big Bite Pollo', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5500, rango: 6, alta: 21, marca: ENTRE_CAPAS,
    img: 'images/bb-pollo.webp', ancho: 1080, alto: 1080, tags: 'sandwich sanguche pollo huevo tomate lechuga pan blanco big bite entre capas',
    alt: 'Big Bite Pollo: sándwich de pan blanco con pollo, huevo, tomate y lechuga en su caja',
    corto: 'Pollo, huevo, tomate y lechuga',
    desc: 'Sándwich alto de pan blanco con pollo, huevo, tomate y lechuga, de Entre Capas.',
    beneficios: ['Pollo, huevo, tomate y lechuga en pan blanco', 'Bien relleno, para almorzar o merendar', 'Te lo llevamos a domicilio'],
    datos: [['Lleva', 'Pan blanco, pollo, huevo, tomate y lechuga'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
  { id: 'planner-del-emprendedor', nombre: 'Planner del emprendedor imprimible', cat: 'guias', rubro: 'negocio', tipo: 'digital', precio: 3900, rango: 7, alta: 20, viral: true,
    img: 'images/p-planner.webp', ancho: 1200, alto: 1200, tags: 'planner agenda planillas pedidos gastos ventas organizacion imprimible',
    alt: 'Tablet con un planner del emprendedor en amarillo y blanco sobre un escritorio',
    corto: 'Ordená pedidos, gastos y ventas',
    desc: 'Planillas imprimibles para anotar pedidos, gastos y ventas, con la semana y el mes a la vista.',
    beneficios: ['Planillas de pedidos, gastos y ventas', 'Semana y mes a la vista', 'Imprimilo las veces que quieras'],
    datos: [['Formato', 'PDF imprimible A4'], ['Incluye', 'Planillas semanales y mensuales'], ['Ideal para', 'Ordenar tu emprendimiento']] },
  { id: 'kit-packaging-emprendedor', nombre: 'Kit de packaging para emprendedores', cat: 'fisicos', rubro: 'negocio', tipo: 'fisico', precio: 24900, descuento: 10, rango: 8, alta: 19, viral: true,
    img: 'images/p-packaging.webp', ancho: 1200, alto: 1200, tags: 'packaging cajas bolsas kraft etiquetas cinta envios presentacion',
    alt: 'Kit de packaging: cajas y bolsas kraft, etiquetas redondas, cinta amarilla y papel de seda',
    corto: 'Cajas, bolsas y etiquetas para tus envíos',
    desc: 'Todo para presentar tus productos: cajas y bolsas kraft en distintos tamaños, etiquetas, cinta y papel de seda.',
    beneficios: ['Cajas y bolsas kraft en distintos tamaños', 'Etiquetas, cinta y papel de seda para presentar', 'Te llega a domicilio, listo para usar'],
    datos: [['Incluye', 'Cajas, bolsas kraft, etiquetas, cinta y papel de seda'], ['Entrega', 'A domicilio']] },
  { id: 'ebook-reposteria-para-vender', nombre: 'Repostería para vender: cookies y budines', cat: 'ebooks', rubro: 'dulces', tipo: 'digital', precio: 5900, descuento: 15, rango: 9, alta: 18,
    img: 'images/p-reposteria.webp', ancho: 1200, alto: 1200, tags: 'reposteria cookies galletitas budines recetas pasteleria vender',
    alt: 'Tablet con una receta de cookies, una bandeja de cookies con chips de chocolate y un plato',
    corto: 'Probá recetas pensadas para emprender',
    desc: 'Recetas de cookies y budines pensadas para vender: medidas exactas, cómo calcular el costo de cada tanda e ideas para presentarlas.',
    beneficios: ['Recetas de cookies y budines con medidas exactas', 'Cómo calcular el costo de cada tanda', 'Ideas de presentación para vender por docena'],
    datos: [['Formato', 'Ebook en PDF'], ['Recetas', 'Cookies y budines'], ['Extra', 'Planilla de costos por tanda']] },
  { id: 'guia-huerta-en-macetas', nombre: 'Guía de huerta en macetas', cat: 'ebooks', rubro: 'huerta', tipo: 'digital', precio: 4900, rango: 10, alta: 29, nuevo: true,
    img: 'images/p-huerta.webp', ancho: 1200, alto: 1200, tags: 'huerta macetas aromaticas plantas cultivo siembra balcon',
    alt: 'Tablet con una huerta de aromáticas en macetas de barro, junto a plantas de albahaca y romero',
    corto: 'Cultivá tus primeras aromáticas',
    desc: 'Una guía para armar tu huerta en macetas: qué plantar según el espacio, cuándo sembrar y cómo cosechar en casa.',
    beneficios: ['Qué plantar en balcón, patio o ventana', 'Calendario de siembra mes a mes', 'Aromáticas y hojas verdes para cosechar en casa'],
    datos: [['Formato', 'Ebook en PDF'], ['Incluye', 'Calendario de siembra imprimible'], ['Ideal para', 'Empezar con pocas macetas']] },
  { id: 'costura-practica', nombre: 'Costura práctica: arreglos y primeros proyectos', cat: 'ebooks', rubro: 'manualidades', tipo: 'digital', precio: 5500, rango: 11, alta: 15,
    img: 'images/p-costura.webp', ancho: 1200, alto: 1200, tags: 'costura coser arreglos ruedos cierres moldes bolsas repasadores',
    alt: 'Tablet con hilos, tijera y telas de costura, rodeada de carreteles negros y amarillos',
    corto: 'Desarrollá una nueva habilidad',
    desc: 'Aprendé los arreglos que más se piden y tus primeros proyectos para vender, con moldes para imprimir.',
    beneficios: ['Ruedos, cierres y arreglos que se piden todos los días', 'Primeros proyectos para vender: bolsas y repasadores', 'Moldes imprimibles incluidos'],
    datos: [['Formato', 'Ebook en PDF'], ['Incluye', 'Moldes imprimibles'], ['Ideal para', 'Quien arranca con la máquina']] },
  { id: 'vende-por-redes', nombre: 'Vendé por redes: guía + plantillas', cat: 'guias', rubro: 'negocio', tipo: 'digital', precio: 5900, rango: 12, alta: 28, nuevo: true,
    img: 'images/p-redes.webp', ancho: 1200, alto: 1200, tags: 'redes instagram ventas plantillas publicaciones historias marketing',
    alt: 'Tablet con un escritorio ordenado: notebook, taza negra, planta y anotador amarillo',
    corto: 'Publicá con un plan y sin trabarte',
    desc: 'Un plan de publicaciones para 30 días con plantillas editables y respuestas listas para las consultas que llegan por mensaje.',
    beneficios: ['Plan de publicaciones para 30 días', 'Plantillas editables para historias y posteos', 'Respuestas listas para consultas por mensaje'],
    datos: [['Formato', 'Guía en PDF + plantillas editables'], ['Incluye', 'Plan de 30 días'], ['Ideal para', 'Vender por Instagram y WhatsApp']] },
  { id: 'combo-heladitos-de-leche', nombre: 'Heladitos de leche a domicilio + ebook de recetas', cat: 'combos', rubro: 'dulces', tipo: 'combo', precio: 14900, rango: 13, alta: 27, nuevo: true,
    img: 'images/p-heladitos.webp', ancho: 900, alto: 900, tags: 'heladitos leche helados bolis frutilla chocolate recetas combo verano',
    galeria: [{ src: 'images/helados-ancho.webp', ancho: 1600, alto: 900, alt: 'Caja de heladitos de leche, bolso térmico y una tablet con la receta' }],
    video: 'images/video-helados.mp4', poster: 'images/video-helados-poster.webp',
    alt: 'Caja kraft con heladitos de leche de frutilla y chocolate, frutillas y chocolate al costado',
    corto: 'Probalos y aprendé a hacerlos',
    desc: 'Una caja de heladitos de leche de frutilla y chocolate a domicilio, más el ebook con las recetas para hacerlos y venderlos.',
    beneficios: ['Heladitos de leche de frutilla y chocolate', 'Ebook con las recetas para hacerlos y venderlos', 'Ideal para arrancar tu venta de verano'],
    datos: [['Físico', 'Caja de heladitos de leche (frutilla y chocolate)'], ['Digital', 'Ebook de recetas de heladitos'], ['Entrega', 'Heladitos a domicilio · ebook al mail']] },
  { id: 'kit-velas-de-soja-ebook', nombre: 'Kit de velas de soja + ebook paso a paso', cat: 'combos', rubro: 'manualidades', tipo: 'combo', precio: 29900, rango: 14, alta: 23,
    img: 'images/p-velas.webp', ancho: 1200, alto: 1200, tags: 'velas soja cera frascos pabilos aromas kit manualidades',
    alt: 'Kit de velas: cera de soja en escamas, frascos de vidrio, pabilos, jarra para fundir y una tablet con velas encendidas',
    corto: 'Hacé tus primeras velas para vender',
    desc: 'Los materiales para tus primeras velas de soja a domicilio, más el ebook con el paso a paso, aromas y terminaciones.',
    beneficios: ['Cera de soja, frascos, pabilos y jarra para fundir', 'Ebook paso a paso con aromas y terminaciones', 'Materiales a domicilio y ebook al mail'],
    datos: [['Físico', 'Cera de soja, frascos, pabilos y jarra'], ['Digital', 'Ebook paso a paso'], ['Entrega', 'Kit a domicilio · ebook al mail']] },
  { id: 'big-bite-fresh', nombre: 'Big Bite Fresh', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5500, rango: 15, alta: 14, marca: ENTRE_CAPAS,
    img: 'images/bb-fresh.webp', ancho: 1080, alto: 1080, tags: 'ensalada fresh pollo choclo huevo lentejas zanahoria big bite entre capas',
    alt: 'Big Bite Fresh: ensalada con choclo, pollo desmenuzado, huevo, lentejas, tomate, zanahoria y lechuga',
    corto: 'Ensalada con pollo, huevo y lentejas',
    desc: 'Ensalada con choclo, pollo desmenuzado, huevo, lentejas, tomate, zanahoria y lechuga, de Entre Capas.',
    beneficios: ['Choclo, pollo desmenuzado, huevo y lentejas', 'Tomate, zanahoria y lechuga', 'Te la llevamos a domicilio'],
    datos: [['Lleva', 'Choclo, pollo desmenuzado, huevo, lentejas, tomate, zanahoria y lechuga'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
  { id: 'big-bite-jamon-crudo', nombre: 'Big Bite Jamón crudo', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5500, rango: 16, alta: 13, marca: ENTRE_CAPAS,
    img: 'images/bb-crudo.webp', ancho: 1080, alto: 1080, tags: 'sandwich sanguche jamon crudo queso tomate lechuga big bite entre capas',
    alt: 'Big Bite Jamón crudo: sándwich de pan blanco con jamón crudo, queso, tomate y lechuga',
    corto: 'Jamón crudo, queso, tomate y lechuga',
    desc: 'Sándwich alto de pan blanco con jamón crudo, queso, tomate y lechuga, de Entre Capas.',
    beneficios: ['Jamón crudo, queso, tomate y lechuga en pan blanco', 'Bien relleno, para almorzar o merendar', 'Te lo llevamos a domicilio'],
    datos: [['Lleva', 'Pan blanco, jamón crudo, queso, tomate y lechuga'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
  { id: 'big-bite-clasico', nombre: 'Big Bite clásico', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5000, rango: 17, alta: 12, marca: ENTRE_CAPAS,
    img: 'images/bb-clasico.webp', ancho: 1080, alto: 1080, tags: 'sandwich sanguche huevo frito jamon queso tomate lechuga big bite entre capas',
    alt: 'Big Bite clásico: sándwich de pan blanco con huevo frito, jamón, queso, tomate y lechuga',
    corto: 'Huevo frito, jamón, queso y tomate',
    desc: 'Sándwich alto de pan blanco con huevo frito, jamón, queso, tomate y lechuga, de Entre Capas.',
    beneficios: ['Huevo frito, jamón, queso, tomate y lechuga', 'Bien relleno, para almorzar o merendar', 'Te lo llevamos a domicilio'],
    datos: [['Lleva', 'Pan blanco, huevo frito, jamón, queso, tomate y lechuga'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
  { id: 'big-bite-huevo', nombre: 'Big Bite Huevo', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5000, rango: 18, alta: 11, marca: ENTRE_CAPAS,
    img: 'images/bb-huevo.webp', ancho: 1080, alto: 1080, tags: 'sandwich sanguche huevo jamon queso tomate lechuga big bite entre capas',
    alt: 'Big Bite Huevo: sándwich de pan blanco con huevo, jamón, queso, tomate y lechuga',
    corto: 'Huevo, jamón, queso y lechuga',
    desc: 'Sándwich alto de pan blanco con huevo, jamón, queso, tomate y lechuga, de Entre Capas.',
    beneficios: ['Huevo, jamón, queso, tomate y lechuga', 'Bien relleno, para almorzar o merendar', 'Te lo llevamos a domicilio'],
    datos: [['Lleva', 'Pan blanco, huevo, jamón, queso, tomate y lechuga'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
  { id: 'big-bite-capresse', nombre: 'Big Bite Capresse', cat: 'fisicos', rubro: 'comidas', tipo: 'fisico', precio: 5000, rango: 19, alta: 10, marca: ENTRE_CAPAS,
    img: 'images/bb-capresse.webp', ancho: 1080, alto: 1080, tags: 'sandwich sanguche capresse caprese queso tomate albahaca vegetariano big bite entre capas',
    alt: 'Big Bite Capresse: sándwich de pan blanco con queso, tomate y albahaca',
    corto: 'Queso, tomate y albahaca',
    desc: 'Sándwich alto de pan blanco con queso, tomate y albahaca, de Entre Capas.',
    beneficios: ['Queso, tomate y albahaca en pan blanco', 'Opción sin carne', 'Te lo llevamos a domicilio'],
    datos: [['Lleva', 'Pan blanco, queso, tomate y albahaca'], ['Marca', ENTRE_CAPAS], ['Entrega', 'A domicilio']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.corto, p.tags || '', p.marca || '', nombreDe(CATEGORIAS, p.cat), nombreDe(RUBROS, p.rubro),
    (TIPOS[p.tipo] || {}).nombre || '', ...(p.beneficios || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const marcas = { oferta: p => p.descuento > 0, viral: p => !!p.viral, nuevo: p => !!p.nuevo, video: p => !!p.video };

  function coincide(p, f) {
    const cat = lista(f.cat), rubro = lista(f.rubro), solo = lista(f.solo), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (rubro.length && !rubro.includes(p.rubro)) return false;
    if (solo.some(s => !(marcas[s] ? marcas[s](p) : true))) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    const candidatos = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = candidatos.findIndex(p => p.id === cursor);
      i = k < 0 ? candidatos.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q || !String(q).trim()) {
      items.push(...candidatos.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < candidatos.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < candidatos.length && items.length < lim) {
      const tanda = candidatos.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < candidatos.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const rubroDe = id => RUBROS.find(r => r.id === id) || { nombre: '' };
const tipoDe = id => TIPOS[id] || TIPOS.digital;

const Cart = {
  KEY: 'mercadofacil_cart',
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(a) ? a.filter(i => i && getProducto(i.id) && i.qty > 0) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
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

const svgIco = p => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  ebooks: svgIco('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  guias: svgIco('<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>'),
  cursos: svgIco('<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
  fisicos: svgIco('<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
  combos: svgIco('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'),
  digital: svgIco('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
  fisico: svgIco('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
  combo: svgIco('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  check: svgIco('<path d="M20 6 9 17l-5-5"/>'),
  play: svgIco('<path d="M7 4.5v15l12-7.5z"/>'),
  link: svgIco('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  mail: svgIco('<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/>'),
  flecha: svgIco('<path d="M5 12h14M13 6l6 6-6 6"/>'),
};
const CARRITO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p, tag = false) {
  const desc = p.descuento > 0;
  const fin = formatearPrecio(precioFinal(p));
  if (tag) return `<span class="precio-tag${desc ? ' precio-tag--desc' : ''}"><b>${fin}</b>${desc ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>`;
  return `<span class="precio${desc ? ' precio--desc' : ''}"><b>${fin}</b>${desc ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>`;
}

const tapaHTML = (p, alt = '') => `<span class="tapa" style="aspect-ratio:${p.ancho} / ${p.alto}"><img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${alt}"></span>`;
function fotoHTML(p) {
  return p.tapa ? tapaHTML(p, esc(p.alt)) : `<img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}">`;
}

function badgesHTML(p) {
  const t = tipoDe(p.tipo);
  const b = [`<span class="badge badge--tipo badge--${p.tipo}">${ICO[p.tipo] || ''}${esc(t.nombre)}</span>`];
  const der = [];
  if (p.video) der.push(`<span class="badge badge--video">${ICO.play}Video</span>`);
  if (p.descuento > 0) der.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  else if (p.nuevo) der.push('<span class="badge badge--nuevo">Nuevo</span>');
  return `<span class="badges">${b.join('')}</span>${der.length ? `<span class="badges badges--der">${der.join('')}</span>` : ''}`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  return `<article class="card"${anim} data-card="${p.id}">
    <button type="button" class="card__foto${p.tapa ? ' foto--tapa' : ''}" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${fotoHTML(p)}
      ${badgesHTML(p)}
      <span class="card__ver" aria-hidden="true">Ver detalle</span>
    </button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)}</p>
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p, true)}
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${CARRITO_SVG}<span>Agregar</span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora ${ICO.flecha}</button>
    </div>
  </article>`;
}

function fichaHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  return `<article class="ficha"${anim} data-card="${p.id}">
    <button type="button" class="ficha__foto${p.tapa ? ' foto--tapa' : ''}" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}${badgesHTML(p)}</button>
    <div class="ficha__info">
      <p class="ficha__cat">${esc(catDe(p.cat).nombre)}</p>
      <h3 class="ficha__titulo"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="ficha__corto">${esc(p.corto)}</p>
      <div class="ficha__pie">
        ${precioHTML(p, true)}
        <div class="ficha__acc">
          <button type="button" class="btn btn--cta btn--sm" data-buy="${p.id}">Comprar</button>
          <button type="button" class="icon-btn icon-btn--add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${CARRITO_SVG}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function vcardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const t = tipoDe(p.tipo);
  return `<article class="vcard"${anim} data-card="${p.id}">
    <button type="button" class="vcard__foto${p.tapa ? ' foto--tapa' : ''}" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}${badgesHTML(p)}</button>
    <div class="vcard__info">
      <p class="vcard__cat">${ICO[p.tipo] || ''}${esc(t.nombre)} · ${esc(rubroDe(p.rubro).nombre)}</p>
      <h3 class="vcard__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="vcard__pie">
        ${precioHTML(p)}
        <button type="button" class="vcard__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>
      </div>
      <button type="button" class="vcard__buy" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
const tarjetaHTML = (p, animar = true) => (MODELO === '2' ? vcardHTML(p, animar) : cardHTML(p, animar));

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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const tapas = hero.querySelectorAll('.abanico__tapa');
  if (tapas.length) tl.from(tapas, { y: 70, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, 0.15);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker span'), { y: 20, opacity: 0, duration: 0.9 }, 0.38)
    .from(hero.querySelectorAll('.hero-kicker .trazo path'), { strokeDashoffset: 320, duration: 1.1, ease: 'power3.out', clearProps: 'strokeDashoffset' }, 0.55)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.buscador-xl, .sugerencias'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62)
    .from(hero.querySelectorAll('.sello-tag'), { rotate: -24, y: -20, opacity: 0, duration: 1.2, ease: 'back.out(2)', clearProps: 'transform,opacity,rotate' }, 0.7)
    .from(hero.querySelectorAll('.hero__mini'), { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
  const chips = hero.querySelectorAll('.chip-cat');
  if (chips.length) tl.from(chips, { y: 22, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (!window.matchMedia('(min-width: 769px)').matches) return;
  const heroImg = document.querySelector('.hero--m1 [data-hero-img]');
  if (heroImg) gsap.to(heroImg, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero--m1', start: 'top top', end: 'bottom top', scrub: true } });
  document.querySelectorAll('.abanico__item').forEach((el, i) => {
    gsap.to(el, { y: [24, 44, 12][i] || 20, ease: 'none', scrollTrigger: { trigger: '.hero--m2', start: 'top top', end: 'bottom top', scrub: true } });
  });
  const lift = document.querySelector('.combo-band__lift');
  if (lift) gsap.fromTo(lift, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: lift, start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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
  const wrap = document.querySelector('[data-nav-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const ul = wrap.querySelector('[data-menu-cats]');
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><span class="nav-cats__ico">${ICO[c.id]}</span><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
  const mq = window.matchMedia('(min-width: 1024px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (mq.matches && hover.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (mq.matches && hover.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (mq.matches && !panel.hidden && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && mq.matches) { cerrar(); btn.focus(); } });
  wrap.addEventListener('focusout', e => { if (mq.matches && e.relatedTarget && !wrap.contains(e.relatedTarget)) cerrar(); });
  mq.addEventListener('change', cerrar);
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const capas = new Set();
function abrirCapa(el, bd) {
  if (!el) return;
  el.hidden = false; if (bd) bd.hidden = false;
  void el.offsetWidth;
  el.classList.add('open'); bd?.classList.add('open');
  capas.add(el);
  document.body.classList.add('no-scroll');
}
function cerrarCapa(el, bd) {
  if (!el || !capas.has(el)) return;
  el.classList.remove('open'); bd?.classList.remove('open');
  capas.delete(el);
  if (!capas.size) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!el.classList.contains('open')) { el.hidden = true; if (bd) bd.hidden = true; } }, 400);
}
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function mensajePedido() {
  const items = Cart.get();
  if (!items.length) return 'Hola! Vi la web de Mercado Fácil y quiero hacer una consulta.';
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} x ${p.nombre} (${formatearPrecio(precioFinal(p))} c/u)`; });
  const fisico = items.some(i => getProducto(i.id).tipo !== 'digital');
  return `Hola! Quiero hacer este pedido en Mercado Fácil:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${fisico ? '\nPara coordinar el envío, mi zona es: ' : ''}`;
}

const Drawer = {
  el: null, bd: null, volver: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el) return;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); this.open(); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const linea = e.target.closest('[data-linea]');
      const id = linea?.dataset.linea;
      const paso = e.target.closest('[data-linea-paso]');
      if (paso && id) { const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty + Number(paso.dataset.lineaPaso)); return; }
      if (e.target.closest('[data-quitar]') && id) { Cart.remove(id); showToast('Lo sacamos del carrito'); return; }
      if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
      if (e.target.closest('[data-ir-tienda]')) this.close();
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render(false));
    this.render(false);
  },
  render(animar) {
    if (!this.el) return;
    const cont = this.el.querySelector('[data-cart-lineas]');
    const foot = this.el.querySelector('[data-cart-foot]');
    const items = Cart.get();
    if (!items.length) {
      cont.innerHTML = `<div class="drawer__vacio"><img src="images/logo-icono.webp" width="420" height="335" alt=""><p class="drawer__vacio-titulo">Tu carrito está vacío</p><p>Sumá un ebook, una guía o un combo y empezá hoy.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ir al catálogo</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    cont.innerHTML = items.map((i, n) => {
      const p = getProducto(i.id); const t = tipoDe(p.tipo);
      const max = p.stock ?? 99;
      return `<div class="linea${animar ? ' entra' : ''}" data-linea="${p.id}" style="--i:${n}">
        <div class="linea__foto${p.tapa ? ' foto--tapa' : ''}">${p.tapa ? tapaHTML(p) : `<img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="">`}</div>
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          <p class="linea__meta"><span class="linea__tipo">${ICO[p.tipo] || ''}${esc(t.nombre)}</span> ${formatearPrecio(precioFinal(p))} c/u</p>
          <div class="linea__abajo">
            <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
            <b>${formatearPrecio(precioFinal(p) * i.qty)}</b>
            <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
    const tipos = new Set(items.map(i => getProducto(i.id).tipo));
    const notas = [];
    if (tipos.has('digital') || tipos.has('combo')) notas.push('Lo digital te llega al mail apenas se acredita el pago.');
    if (tipos.has('fisico') || tipos.has('combo')) notas.push('Lo físico te lo llevamos a domicilio: coordinamos por WhatsApp.');
    this.el.querySelector('[data-cart-nota]').textContent = notas.join(' ');
    const wsp = this.el.querySelector('[data-cart-wsp]');
    if (wsp) wsp.href = waLink(mensajePedido());
  },
  open() {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render(!reduceMotion);
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__head .icon-btn')?.focus(), 60);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-modal-cuerpo]');
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quick]');
      if (q) { e.preventDefault(); this.open(q.dataset.quick); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const th = e.target.closest('[data-vr-thumb]');
      if (th) { this.mostrar(Number(th.dataset.vrThumb)); return; }
      const paso = e.target.closest('[data-vr-paso]');
      if (paso) {
        const span = this.el.querySelector('[data-vr-cant]');
        const max = this.actual.stock ?? 99;
        const n = Math.max(1, Math.min(max, Number(span.textContent) + Number(paso.dataset.vrPaso)));
        span.textContent = n;
        this.el.querySelector('[data-vr-paso="-1"]').disabled = n <= 1;
        this.el.querySelector('[data-vr-paso="1"]').disabled = n >= max;
        return;
      }
      if (e.target.closest('[data-vr-add]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vr-buy]')) { this.agregar(true); return; }
      if (e.target.closest('[data-vr-link]')) this.compartir();
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
  },
  galeria() {
    const p = this.actual; if (!p) return [];
    const g = [{ tipo: 'img', src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt, tapa: !!p.tapa }];
    (p.galeria || []).forEach(x => g.push({ tipo: 'img', ...x }));
    if (p.video) g.push({ tipo: 'video', src: p.video, poster: p.poster, alt: `Video de ${p.nombre}` });
    return g;
  },
  mediaHTML(m) {
    if (m.tipo === 'video') return `<video src="${m.src}" poster="${m.poster}" controls muted loop playsinline autoplay preload="metadata"></video>`;
    return `<img src="${m.src}" width="${m.ancho}" height="${m.alto}" alt="${esc(m.alt)}">`;
  },
  mostrar(i) {
    const g = this.galeria()[i];
    const marco = this.el.querySelector('[data-vr-marco]');
    if (!g || !marco) return;
    marco.innerHTML = this.mediaHTML(g);
    marco.classList.toggle('vr__foto--video', g.tipo === 'video');
    this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.vrThumb) === i)));
  },
  html(p) {
    const gal = this.galeria();
    const t = tipoDe(p.tipo);
    let rel = Tienda.consultar({ filtros: { rubro: p.rubro, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    const thumbs = gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb${g.tipo === 'video' ? ' vr__thumb--video' : ''}" data-vr-thumb="${i}" aria-label="${g.tipo === 'video' ? 'Ver el video' : `Ver la imagen ${i + 1}`}" aria-pressed="${i === 0}"><img src="${g.tipo === 'video' ? g.poster : g.src}" width="${g.ancho || 720}" height="${g.alto || 900}" alt="">${g.tipo === 'video' ? `<span class="vr__thumb-play">${ICO.play}</span>` : ''}</button>`).join('')}</div>` : '';
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto" data-vr-marco>${this.mediaHTML(gal[0])}</div>
        ${thumbs}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)} · ${esc(rubroDe(p.rubro).nombre)}${p.marca ? ` · ${esc(p.marca)}` : ''}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio">${precioHTML(p, true)}<span class="badge badge--tipo badge--${p.tipo}">${ICO[p.tipo] || ''}${esc(t.largo)}</span></div>
        <p class="vr__desc">${esc(p.desc)}</p>
        <p class="vr__sub">Beneficios</p>
        <ul class="vr__beneficios">${(p.beneficios || []).map(b => `<li>${ICO.check}<span>${esc(b)}</span></li>`).join('')}</ul>
        <div class="vr__entrega">${t.entrega.map(([ic, txt]) => `<p>${ICO[ic]}<span>${esc(txt)}</span></p>`).join('')}</div>
        <div class="vr__acciones">
          <div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="btn btn--ghost" data-vr-add>Agregar al carrito</button>
          <button type="button" class="btn btn--cta" data-vr-buy>Comprar ahora</button>
        </div>
        <div class="vr__links">
          <a class="vr__wsp" href="${waLink(`Hola! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
          <button type="button" class="link-btn vr__copiar" data-vr-link>${ICO.link} Copiar el link de este producto</button>
        </div>
        <dl class="vr__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><p class="vr__sub">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><span class="mini__foto${r.tapa ? ' foto--tapa' : ''}">${r.tapa ? tapaHTML(r) : `<img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt="">`}</span><span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  open(id) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.cuerpo.innerHTML = this.html(p);
    this.el.setAttribute('aria-label', p.nombre);
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(comprar) {
    const p = this.actual; if (!p) return;
    const n = Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1;
    Cart.add(p, n);
    if (comprar) { this.close(true); Drawer.open(); return; }
    showToast(`Sumaste ${p.nombre} al carrito`);
  },
  compartir() {
    const p = this.actual; if (!p) return;
    const url = new URL(`${CATALOGO_URL}?producto=${p.id}`, location.href).href;
    const listo = () => showToast('Link copiado: cada producto tiene su propia página para compartir');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(listo, () => showToast(url));
    else showToast(url);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    this.el.querySelectorAll('video').forEach(v => v.pause());
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
    if (PAGINA === 'catalogo') { const u = new URL(location.href); if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); history.replaceState(null, '', u); } }
  },
};

function initCardAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-card]');
      const p = getProducto(card?.dataset.card);
      const span = st.querySelector('[data-cant]');
      const n = Math.max(1, Math.min(p?.stock ?? 99, Number(span.textContent) + Number(paso.dataset.paso)));
      span.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.buy;
    const p = getProducto(id); if (!p) return;
    const card = add.closest('[data-card]');
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    Cart.add(p, n);
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const etiqueta = add.querySelector('span');
    add.classList.add('ok');
    if (etiqueta) etiqueta.textContent = '¡Sumado!';
    setTimeout(() => { add.classList.remove('ok'); if (etiqueta) etiqueta.textContent = 'Agregar'; }, 1400);
    showToast(`Sumaste ${p.nombre} al carrito`);
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

const VITRINAS = {
  destacados: { orden: 'destacados', filtros: {} },
  nuevos: { orden: 'nuevos', filtros: { solo: ['nuevo'] } },
  menos10: { orden: 'destacados', filtros: { precioMax: UMBRAL - 1 } },
  mas10: { orden: 'destacados', filtros: { precioMin: UMBRAL } },
};
function initVitrinas() {
  document.querySelectorAll('[data-vitrina]').forEach(cont => {
    const grupo = cont.dataset.vitrina;
    const limite = Number(cont.dataset.limite) || 8;
    const tabs = [...document.querySelectorAll(`[data-tabs="${grupo}"] [data-tab]`)];
    const pintar = (clave, animar) => {
      const v = VITRINAS[clave] || VITRINAS.destacados;
      let items = Tienda.consultar({ filtros: v.filtros, orden: v.orden, limite }).items;
      if (clave === 'nuevos' && items.length < limite) items = items.concat(Tienda.consultar({ orden: 'nuevos', filtros: { excluir: items.map(i => i.id) }, limite: limite - items.length }).items);
      const tpl = MODELO === '2' ? vcardHTML : fichaHTML;
      cont.innerHTML = items.map(p => tpl(p, true)).join('');
      if (animar) revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined' && animar) ScrollTrigger.refresh();
    };
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
      pintar(t.dataset.tab, true);
    }));
    pintar(tabs[0]?.dataset.tab || 'destacados', false);
  });
}

function initPromos() {
  document.querySelectorAll('[data-promo]').forEach(ul => {
    const solo = ul.dataset.promo;
    const items = Tienda.consultar({ filtros: { solo: [solo] }, limite: 3 }).items;
    ul.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(22px)"><button type="button" class="promo__item" data-quick="${p.id}"><span class="promo__nombre">${esc(p.nombre)}</span><span class="promo__precio">${p.descuento > 0 ? `<em>-${p.descuento}%</em>` : ''}<b>${formatearPrecio(precioFinal(p))}</b></span></button></li>`).join('');
  });
}

function initPreciosFijos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.outerHTML = precioHTML(p, true);
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [g, v] = el.dataset.cuenta.split(':');
    const n = Tienda.contar({ [g]: [v] });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function initVideos() {
  document.querySelectorAll('[data-auto-video]').forEach(v => {
    const fig = v.closest('.video-fig');
    const btn = fig?.querySelector('[data-video-toggle]');
    let pausadoPorUsuario = reduceMotion;
    const marcar = () => {
      fig?.classList.toggle('pausado', v.paused);
      btn?.setAttribute('aria-label', v.paused ? 'Reproducir el video' : 'Pausar el video');
    };
    v.addEventListener('play', marcar);
    v.addEventListener('pause', marcar);
    btn?.addEventListener('click', () => {
      if (v.paused) { pausadoPorUsuario = false; v.play().catch(() => {}); }
      else { pausadoPorUsuario = true; v.pause(); }
    });
    marcar();
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting && !pausadoPorUsuario) v.play().catch(() => {});
      else if (!en.isIntersecting && !v.paused) v.pause();
    }), { threshold: 0.35 }).observe(v);
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const contador = document.querySelector('[data-contador]');
  const mostrando = document.querySelector('[data-mostrando]');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-vacio]');
  const qIn = document.getElementById('q');
  const ordenSel = document.querySelector('[data-orden]');
  const filtros = document.getElementById('filtros');
  const filtrosBd = document.querySelector('[data-filtros-bd]');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const nFiltros = document.querySelector('[data-filtros-n]');
  const limpiarTop = document.querySelector('[data-limpiar-top]');
  const miga = document.querySelector('[data-miga-cat]');
  const chips = [...document.querySelectorAll('[data-cat-chip]')];
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const e = {
    cat: (params.get('cat') || '').split(',').filter(v => valida(CATEGORIAS, v)),
    rubro: (params.get('rubro') || '').split(',').filter(v => valida(RUBROS, v)),
    solo: (params.get('solo') || '').split(',').filter(v => valida(SOLO, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'rubro' && e.rubro.length) f.rubro = e.rubro;
    if (sin !== 'solo' && e.solo.length) f.solo = e.solo;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('rubro', e.rubro.join(','));
    set('solo', e.solo.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const cuentaDe = (g, v) => {
    const base = filtrosDe(g);
    if (g === 'precio') { const pr = PRECIOS.find(x => x.id === v); return Tienda.contar({ ...base, precioMin: pr.min, precioMax: pr.max }); }
    if (g === 'solo') return Tienda.contar({ ...base, solo: [...new Set([...(base.solo || []), v])] });
    return Tienda.contar({ ...base, [g]: [v] });
  };
  const pintarControles = () => {
    ['cat', 'rubro', 'solo'].forEach(g => document.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = e[g].includes(i.value); }));
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => { const [g, v] = s.dataset.n.split(':'); s.textContent = cuentaDe(g, v); });
    const activos = e.cat.length + e.rubro.length + e.solo.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.rubro.length + e.solo.length + (e.precio ? 1 : 0);
    if (nFiltros) { nFiltros.textContent = enPanel; nFiltros.hidden = !enPanel; }
    if (limpiarTop) limpiarTop.hidden = !activos;
    if (miga) {
      const c = e.cat.length === 1 ? catDe(e.cat[0]) : null;
      miga.hidden = !c;
      miga.innerHTML = c ? `<span aria-current="page">${esc(c.nombre)}</span>` : '';
    }
    document.querySelectorAll('.nav-cats__list a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (e.cat.length === 1 && id === e.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  function render(reiniciar) {
    const f = { ...filtrosDe(), q: e.q.trim() };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => tarjetaHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosDe());
    const q = e.q.trim();
    const donde = e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : '';
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${total} ${total === 1 ? 'producto' : 'productos'}${donde}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const aplicar = () => { urlSync(); pintarControles(); render(true); };
  document.addEventListener('change', ev => {
    const i = ev.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    if (g === 'precio') e.precio = i.checked ? i.value : '';
    else e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  chips.forEach(c => c.addEventListener('click', () => { e.cat = c.dataset.catChip ? [c.dataset.catChip] : []; aplicar(); }));
  ordenSel?.addEventListener('change', () => { e.orden = valida(ORDENES, ordenSel.value) ? ordenSel.value : 'destacados'; aplicar(); });
  let tq = 0;
  qIn?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = qIn.value.slice(0, 60); aplicar(); }, 220); });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = qIn.value.slice(0, 60); aplicar(); qIn.blur(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    e.cat = []; e.rubro = []; e.solo = []; e.precio = ''; e.q = '';
    aplicar();
  }));
  verMas.addEventListener('click', () => render(false));
  const drawerMq = window.matchMedia(MODELO === '2' ? 'all' : '(max-width: 1024px)');
  const abrirFiltros = () => {
    if (!drawerMq.matches) return;
    abrirCapa(filtros, filtrosBd);
    abrirBtn?.setAttribute('aria-expanded', 'true');
    revelarNuevos(filtros);
    setTimeout(() => filtros.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); filtrosBd?.classList.remove('open');
    capas.delete(filtros);
    if (!capas.size) document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!filtros.classList.contains('open') && filtrosBd) filtrosBd.hidden = true; }, 400);
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  abrirBtn?.addEventListener('click', abrirFiltros);
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  filtrosBd?.addEventListener('click', cerrarFiltros);
  filtros.addEventListener('keydown', ev => { if (!filtros.classList.contains('open')) return; if (ev.key === 'Escape') cerrarFiltros(); else atrapar(filtros, ev); });
  drawerMq.addEventListener?.('change', () => { if (!drawerMq.matches) cerrarFiltros(); });
  pintarControles();
  render(true);
  urlSync();
  if (params.get('buscar') && qIn) setTimeout(() => qIn.focus(), 300);
}

function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => Vista.open(id), 350);
}

initMenuCategorias();
initVitrinas();
initPromos();
initPreciosFijos();
initCuentas();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initNav();
initModelBarScroll();
Drawer.init();
Vista.init();
initCardAcciones();
initFloats();
updateCartBadge();
initVideos();
abrirProductoDeUrl();
