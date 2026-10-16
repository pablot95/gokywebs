document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5491136279056';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const MARCA = 'FM23AUTOMOTORES';

const CATEGORIAS = [
  { id: 'detailing', nombre: 'Cosmética y detailing', bajada: 'Shampoo, desengrasante, selladores, pads y todo lo que lleva el lavado y el pulido.', img: 'images/g-spray.webp' },
  { id: 'microfibras', nombre: 'Microfibras', bajada: 'Paños de 40 × 40 y 40 × 80, toallas de secado y plush para el repaso final.', img: 'images/g-microfibras.webp' },
  { id: 'perfumes', nombre: 'Perfumes para auto', bajada: 'En spray, concentrados y colgantes para el espejo, en varios aromas.', img: 'images/g-perfume.webp' },
  { id: 'termos', nombre: 'Termos y vasos', bajada: 'Botella térmica con manija estilo Stanley, en cuatro colores.', img: 'images/g-termo.webp', etiqueta: 'En 4 colores' },
  { id: 'herramientas', nombre: 'Herramientas', bajada: 'Pulidoras y accesorios que están por ingresar. Escribinos y te avisamos cuando lleguen.', img: 'images/p-pulidora.webp', pronto: true },
];
const USOS = {
  lavado: { nombre: 'Lavado', paso: '01', texto: 'Shampoo de pH neutro y microfibras que secan sin frotar: sacan la mugre sin llevarse la cera.' },
  llantas: { nombre: 'Llantas', paso: '02', texto: 'La llanta junta la grasa del freno que el shampoo no saca: producto propio y un pincel que se meta entre los rayos.' },
  pulido: { nombre: 'Pulido', paso: '03', texto: 'Pads por etapa —corte, pulido y terminación— para sacar marcas finas y devolverle el brillo a la pintura.' },
  proteccion: { nombre: 'Protección', paso: '04', texto: 'Sellador y quick detailer para que el agua resbale y el brillo aguante entre un lavado y otro.' },
  interior: { nombre: 'Interior y aroma', paso: '05', texto: 'Plásticos que no quedan grasosos, microfibra suave y un perfume que se siente apenas abrís la puerta.' },
};
const RANGOS = {
  'hasta-8000': { label: 'Hasta $8.000', max: 8000 },
  '8000-15000': { label: 'De $8.000 a $15.000', min: 8000, max: 15000 },
  'mas-15000': { label: 'Más de $15.000', min: 15000 },
};
const EXTRAS = { oferta: 'Con descuento', stock: 'Disponibles para comprar' };
const ORDENES = { destacados: 'Destacados', novedades: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const Servidor = crearServidor([
  { id: 'shampoo-ph-neutro', nombre: 'Shampoo pH neutro con cera', cat: 'detailing', uso: ['lavado'], img: 'p-shampoo', px: 480, alt: 'Botellas de shampoo para auto en el estante',
    desc: 'Shampoo concentrado de pH neutro con cera. Limpia sin sacar las protecciones que ya tiene la pintura y deja un brillo parejo.',
    puntos: ['Se diluye en el balde con agua', 'No ataca ceras ni selladores', 'Para lavado a mano o con hidrolavadora'],
    var: { nombre: 'Tamaño', ops: [{ id: '500', label: '500 ml', precio: 7900 }, { id: '1000', label: '1 L', precio: 12900 }] }, precio: 7900, stock: 24, rango: 1, alta: 18 },
  { id: 'microfibra-laffitte', nombre: 'Microfibra Laffitté 40 × 80 cm', cat: 'microfibras', marca: 'Laffitté', uso: ['lavado', 'proteccion'], img: 'p-laffitte', px: 580, alt: 'Microfibras azules y grises dobladas sobre la mesa del taller',
    desc: 'Paño de microfibra Laffitté de 40 × 80 cm: absorbe bien y no deja pelusa. Sirve para secar y para el repaso después del lavado.',
    puntos: ['40 × 80 cm', 'Para secado y repaso', 'Se lava y se vuelve a usar'], precio: 8500, stock: 30, rango: 2, alta: 15 },
  { id: 'botella-termica', nombre: 'Botella térmica con manija estilo Stanley', cat: 'termos', uso: [], img: 'p-termo', px: 800, alt: 'Botella térmica azul marino con manija sobre una mesa de acero',
    desc: 'Botella térmica de acero inoxidable con manija y tapa con sorbete, estilo Stanley. Para el mate, el café o el agua fría del día.',
    puntos: ['Acero inoxidable de doble pared', 'Manija y tapa con sorbete', 'Cuatro colores para elegir'],
    var: { nombre: 'Color', ops: [{ id: 'azul', label: 'Azul marino', hex: '#1F3563' }, { id: 'negro', label: 'Negro', hex: '#1B1C20' }, { id: 'blanco', label: 'Blanco', hex: '#EDEDEA' }, { id: 'verde', label: 'Verde agua', hex: '#8CC9BE' }] },
    precio: 24900, stock: 12, rango: 3, alta: 22, nuevo: true },
  { id: 'perfume-toxic', nombre: 'Perfume Toxic en spray 120 ml', cat: 'perfumes', marca: 'Toxic', uso: ['interior'], img: 'p-toxic', px: 380, alt: 'Frascos de perfume y productos de limpieza en el estante',
    desc: 'Perfume en spray Toxic de 120 ml para el interior: un par de disparos en alfombras y tapizados y el auto queda con aroma.',
    puntos: ['120 ml en spray', 'Para alfombras, tapizados y baúl', 'Elegí el aroma'],
    var: { nombre: 'Aroma', ops: [{ id: 'new-car', label: 'New Car' }, { id: 'bubble-gum', label: 'Bubble Gum' }, { id: 'cherry', label: 'Cherry' }, { id: 'fresh', label: 'Fresh' }, { id: 'mango-go', label: 'Mango Go' }] },
    precio: 6500, stock: 40, rango: 4, alta: 12 },
  { id: 'quick-detailer', nombre: 'Quick detailer en spray 500 ml', cat: 'detailing', uso: ['proteccion'], img: 'p-quickdetailer', px: 740, alt: 'Atomizador azul de quick detailer sobre el capot con gotas de agua',
    desc: 'Para el repaso rápido entre lavados: saca polvo, marcas de dedos y de agua, y levanta el brillo sin lavar todo el auto.',
    puntos: ['500 ml en spray', 'Se usa con microfibra limpia', 'Sobre pintura fría y a la sombra'], precio: 10500, stock: 15, rango: 5, alta: 10 },
  { id: 'limpia-llantas', nombre: 'Limpia llantas y neumáticos 500 ml', cat: 'detailing', uso: ['llantas'], img: 'p-llantas', px: 780, alt: 'Llanta de aleación cubierta de espuma durante el lavado',
    desc: 'Limpiador para llantas y neumáticos que afloja la grasa del freno y el barro. Se aplica, se trabaja con pincel y se enjuaga.',
    puntos: ['500 ml en spray', 'Para llantas de aleación y de chapa', 'Siempre con la llanta fría'], precio: 9800, stock: 14, rango: 6, alta: 9 },
  { id: 'pads-pulido', nombre: 'Pads de pulido 5″ por etapa', cat: 'detailing', uso: ['pulido'], img: 'p-pads', px: 500, alt: 'Pads de pulido naranja, negro, amarillo y azul apilados',
    desc: 'Pads de espuma de 5″ para pulidora roto-orbital: uno para corte, otro para pulido y otro para terminación. Cada color, una etapa.',
    puntos: ['Diámetro 5″', 'Abrojo en la base', 'Se lavan y se reutilizan'],
    var: { nombre: 'Presentación', ops: [{ id: 'x3', label: 'Pack x3', precio: 21900 }, { id: 'x5', label: 'Pack x5', precio: 32900 }] }, precio: 21900, stock: 8, rango: 7, alta: 8 },
  { id: 'sellador-ceramico', nombre: 'Sellador cerámico en spray 500 ml', cat: 'detailing', uso: ['proteccion'], img: 'p-ceramico', px: 560, alt: 'Gotas de agua sobre pintura azul protegida',
    desc: 'Sellador cerámico en spray: deja una capa que hace que el agua forme gotas y se vaya, y le da a la pintura un brillo profundo.',
    puntos: ['500 ml', 'Sobre pintura limpia y seca', 'Se pasa y se retira con microfibra'], precio: 19000, descuento: 10, stock: 6, rango: 8, alta: 16 },
  { id: 'desengrasante-apc', nombre: 'Desengrasante multiuso APC 1 L', cat: 'detailing', uso: ['lavado', 'interior'], img: 'p-apc', px: 380, alt: 'Atomizador y botellas negras de desengrasante junto a microfibras',
    desc: 'Desengrasante multiuso concentrado para motor, pasaruedas, zócalos y plásticos. Se diluye según cuánta mugre haya.',
    puntos: ['1 L concentrado', 'Interior y exterior', 'Diluible en agua'], precio: 8900, stock: 20, alta: 7 },
  { id: 'acondicionador-plasticos', nombre: 'Acondicionador de plásticos y gomas 250 ml', cat: 'detailing', uso: ['interior'], img: 'p-plasticos', px: 420, alt: 'Botellas de acondicionador amarillo, crema y azul en el estante',
    desc: 'Acondicionador para plásticos y gomas del interior y del exterior: devuelve el color sin dejar la superficie grasosa.',
    puntos: ['250 ml', 'Tablero, paneles y burletes', 'Terminación satinada'], precio: 8500, stock: 3, alta: 6 },
  { id: 'pincel-detailing', nombre: 'Pincel de detailing para llantas y rejillas', cat: 'detailing', uso: ['llantas', 'interior'], img: 'p-pincel', px: 640, alt: 'Pincel de detailing limpiando una llanta con espuma',
    desc: 'Pincel de cerdas suaves para llantas, rejillas, costuras y rincones donde la microfibra no entra.',
    puntos: ['Cerdas suaves', 'Mango antideslizante', 'Para llantas e interior'], precio: 6900, stock: 18, alta: 5 },
  { id: 'revividor-neumaticos', nombre: 'Revividor de neumáticos en gel 500 ml', cat: 'detailing', uso: ['llantas'], img: 'p-revividor', px: 420, alt: 'Rueda de un auto negro con el neumático brillante',
    desc: 'Gel para neumáticos que les devuelve el negro y deja una terminación pareja, sin salpicar la carrocería.',
    puntos: ['500 ml', 'Terminación satinada', 'Se aplica con aplicador de espuma'], precio: 8900, stock: 11, alta: 11 },
  { id: 'pad-corte', nombre: 'Pad de corte naranja 5″', cat: 'detailing', uso: ['pulido'], img: 'p-padcorte', px: 500, alt: 'Pad de pulido naranja con superficie hexagonal',
    desc: 'Pad naranja de 5″ con superficie hexagonal para la etapa de corte: saca marcas y rayas finas con el compuesto adecuado.',
    puntos: ['Diámetro 5″', 'Etapa de corte', 'Abrojo en la base'], precio: 8900, stock: 9, alta: 4 },
  { id: 'aplicador-espuma', nombre: 'Aplicador de espuma para ceras y selladores', cat: 'detailing', uso: ['proteccion', 'llantas'], img: 'p-aplicador', px: 400, alt: 'Aplicador de espuma blanco sobre la mesa de trabajo',
    desc: 'Aplicador de espuma para ceras, selladores y revividores: reparte el producto parejo y sin desperdicio.',
    puntos: ['Espuma de celda fina', 'Para ceras, selladores y neumáticos', 'Lavable'], precio: 3900, stock: 25, alta: 3 },
  { id: 'microfibra-40x40', nombre: 'Microfibra 40 × 40 cm', cat: 'microfibras', uso: ['interior'], img: 'p-mf4040', px: 580, alt: 'Microfibra gris doblada sobre el capot mojado',
    desc: 'Microfibra de 40 × 40 cm para interior, vidrios y repasos chicos. Conviene tener varias, una para cada tarea.',
    puntos: ['40 × 40 cm', 'Para interior y repasos', 'Elegí el color'],
    var: { nombre: 'Color', ops: [{ id: 'gris', label: 'Gris', hex: '#6B6F78' }, { id: 'azul', label: 'Azul', hex: '#2F5BC4' }] }, precio: 3900, stock: 50, alta: 14 },
  { id: 'microfibra-40x80', nombre: 'Microfibra 40 × 80 cm', cat: 'microfibras', uso: ['lavado'], img: 'p-mf4080', px: 800, alt: 'Pila de microfibras azules y grises de 40 × 80',
    desc: 'Microfibra de 40 × 80 cm, el tamaño justo para secar paneles grandes y para el repaso final. Por unidad o en pack de 4.',
    puntos: ['40 × 80 cm', 'Secado y repaso', 'Unidad o pack x4'],
    var: { nombre: 'Presentación', ops: [{ id: 'unidad', label: 'Unidad', precio: 6900 }, { id: 'x4', label: 'Pack x4', precio: 23900 }] }, precio: 6900, stock: 26, alta: 13 },
  { id: 'toalla-secado', nombre: 'Toalla de secado 60 × 90 cm', cat: 'microfibras', uso: ['lavado'], img: 'p-secado', px: 420, alt: 'Toalla de secado azul sobre el carro de productos',
    desc: 'Toalla de microfibra de 60 × 90 cm y trama gruesa: seca paneles enteros sin frotar y sin dejar marcas de agua.',
    puntos: ['60 × 90 cm', 'Trama gruesa para secado', 'Se lava sin suavizante'], precio: 14900, stock: 10, alta: 21, nuevo: true },
  { id: 'microfibra-plush', nombre: 'Microfibra plush para repaso final', cat: 'microfibras', uso: ['proteccion'], img: 'p-plush', px: 520, alt: 'Mano con guante pasando una microfibra gris sobre el capot azul',
    desc: 'Microfibra plush de pelo largo para el repaso final con quick detailer: no raya y levanta el brillo.',
    puntos: ['Pelo largo', 'Para el repaso final', 'Se lava sin suavizante'], precio: 6000, descuento: 15, stock: 16, alta: 2 },
  { id: 'perfume-saphirus', nombre: 'Perfume concentrado Saphirus 60 ml', cat: 'perfumes', marca: 'Saphirus', uso: ['interior'], img: 'p-saphirus', px: 350, alt: 'Frasco de perfume con tapa de madera sobre el tablero',
    desc: 'Perfume concentrado Saphirus de 60 ml: unas gotas en el difusor o sobre la alfombra alcanzan para perfumar el auto.',
    puntos: ['60 ml concentrado', 'Rinde de a gotas', 'Para difusor o alfombra'], precio: 11900, stock: 9, alta: 19 },
  { id: 'perfume-colgante', nombre: 'Perfume colgante con tapa de madera', cat: 'perfumes', uso: ['interior'], img: 'p-colgante', px: 500, alt: 'Perfume colgante de vidrio con tapa de madera en el espejo retrovisor',
    desc: 'Frasco de vidrio con tapa de madera para colgar del espejo: la tapa absorbe el perfume y lo libera de a poco.',
    puntos: ['Para colgar del espejo', 'Tapa de madera difusora', 'Elegí el aroma'],
    var: { nombre: 'Aroma', ops: [{ id: 'vainilla', label: 'Vainilla' }, { id: 'lavanda', label: 'Lavanda' }, { id: 'auto-nuevo', label: 'Auto nuevo' }] }, precio: 5500, stock: 22, alta: 17 },
  { id: 'pulidora-roto-orbital', nombre: 'Pulidora roto-orbital', cat: 'herramientas', uso: ['pulido'], img: 'p-pulidora', px: 780, alt: 'Pulidora roto-orbital con pads de pulido sobre la mesa',
    desc: 'Pulidora roto-orbital para pulir la pintura en casa. Está por ingresar: escribinos y te avisamos cuando llegue.',
    puntos: ['Roto-orbital', 'Para pads de 5″', 'Próximo ingreso'], precio: 0, stock: 0, alta: 23, proximamente: true },
], { tope: 100 });

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const nombreDeCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const finalDe = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100)) : precio);
  const desde = p => (p.proximamente ? Infinity : Math.min(...(p.var ? p.var.ops.map(o => finalDe(p, o.precio ?? p.precio)) : [finalDe(p, p.precio)])));
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, p.marca, nombreDeCat(p.cat), p.desc, ...(p.puntos || []), ...(p.uso || []).map(u => USOS[u]?.nombre || u),
    ...(p.var ? p.var.ops.map(o => o.label) : []), p.proximamente ? 'proximo ingreso herramienta' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), extra = lista(f.extra), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (uso.length && !uso.some(u => (p.uso || []).includes(u))) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (extra.includes('oferta') && !(p.descuento > 0)) return false;
    if (extra.includes('stock') && (p.proximamente || !(p.stock > 0))) return false;
    if (f.rango && RANGOS[f.rango]) {
      const r = RANGOS[f.rango], precio = desde(p);
      if (!Number.isFinite(precio)) return false;
      if (r.min != null && precio < r.min) return false;
      if (r.max != null && precio > r.max) return false;
    }
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const valor = p => (Number.isFinite(desde(p)) ? desde(p) : Number.MAX_SAFE_INTEGER);
    switch (orden) {
      case 'precio-asc': return (a, b) => valor(a) - valor(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => (Number.isFinite(desde(b)) ? desde(b) : -1) - (Number.isFinite(desde(a)) ? desde(a) : -1) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'novedades': return (a, b) => (b.alta || 0) - (a.alta || 0) || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || (b.alta || 0) - (a.alta || 0) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => ({ id: c.id, cantidad: contar({ cat: c.id }) }));
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const GALERIA = [
  { img: 'h-vertical', w: 900, h: 1600, forma: 'v', tipo: 'Trabajo', titulo: 'Repaso final sobre el capot', alt: 'Mano con guante pasando una microfibra sobre el capot azul recién lavado',
    texto: 'Después del lavado, una pasada con microfibra plush y quick detailer saca las marcas de agua y levanta el brillo.', productos: ['microfibra-plush', 'quick-detailer', 'microfibra-laffitte'] },
  { img: 'h-portada', w: 1600, h: 900, forma: 'h', tipo: 'Trabajo', titulo: 'Negro brillante, listo para salir', alt: 'Auto negro recién lavado junto al carro de productos y microfibras',
    texto: 'El negro muestra todo: por eso el secado con toalla de microfibra y el sellador al final.', productos: ['toalla-secado', 'sellador-ceramico', 'shampoo-ph-neutro'] },
  { img: 'g-llanta', w: 1200, h: 1200, forma: 'c', tipo: 'Trabajo', titulo: 'Llantas con espuma y pincel', alt: 'Llanta con espuma limpiada con un pincel de detailing',
    texto: 'Producto específico para llantas y un pincel de cerdas suaves que entra entre los rayos.', productos: ['limpia-llantas', 'pincel-detailing', 'revividor-neumaticos'] },
  { img: 'g-pulido', w: 1200, h: 1200, forma: 'c', tipo: 'Trabajo', titulo: 'Pulido por etapas', alt: 'Pulidora roto-orbital y pads de colores sobre la mesa de trabajo',
    texto: 'Un pad para cada paso: corte para las marcas, pulido para el brillo y terminación para el acabado.', productos: ['pads-pulido', 'pad-corte', 'aplicador-espuma'] },
  { img: 'g-spray', w: 1200, h: 1200, forma: 'c', tipo: 'Producto', titulo: 'Cuando el agua resbala', alt: 'Atomizador azul y microfibra sobre el capot con gotas de agua',
    texto: 'Con la pintura protegida, el agua forma gotas y se va sola. Así se ve un sellador recién aplicado.', productos: ['sellador-ceramico', 'quick-detailer', 'microfibra-40x40'] },
  { img: 'g-estante', w: 1200, h: 1200, forma: 'c', tipo: 'Producto', titulo: 'El estante del detail', alt: 'Estante con shampoo, acondicionadores y aplicadores de colores',
    texto: 'Shampoo, desengrasante, acondicionador de plásticos y aplicadores: lo que se usa todas las semanas.', productos: ['shampoo-ph-neutro', 'desengrasante-apc', 'acondicionador-plasticos'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Servidor.obtener(id);
const opcion = (p, v) => (p?.var ? (p.var.ops.find(o => o.id === v) || p.var.ops[0]) : null);
const varDefault = p => (p.var ? p.var.ops[0].id : '');
const precioLista = (p, v) => (p.var ? (opcion(p, v).precio ?? p.precio) : p.precio);
const precioDe = (p, v) => (p.descuento > 0 ? Math.round(precioLista(p, v) * (1 - p.descuento / 100)) : precioLista(p, v));
const variaPrecio = p => !!p.var && p.var.ops.some(o => (o.precio ?? p.precio) !== (p.var.ops[0].precio ?? p.precio));
const precioDesde = p => (p.var ? Math.min(...p.var.ops.map(o => precioDe(p, o.id))) : precioDe(p, ''));
const imgDe = p => `images/${p.img}.webp`;
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const metaDe = p => [p.marca, ...(p.uso || []).slice(0, 1).map(u => USOS[u]?.nombre)].filter(Boolean).join(' · ') || nombreCat(p.cat);
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const esM2 = () => document.body.classList.contains('m2');
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const disponible = p => !p.proximamente && p.stock > 0;

const Cart = {
  KEY: 'fm23automotores_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  capas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
  campana: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer.open, .modal:not([hidden]), .visor:not([hidden]), .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  subirCh: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  mascara: ' data-animate="mascara" style="clip-path:inset(100% 0 0 0)"',
};

function stepperHTML(nombre) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.proximamente) b.push('<span class="badge badge--pronto">Próximo ingreso</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (!p.proximamente && p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}
function precioHTML(p, clase = 'precio') {
  if (p.proximamente) return `<p class="${clase} ${clase}--pronto">Próximo ingreso</p>`;
  const desde = variaPrecio(p) ? '<small>Desde</small>' : '';
  if (p.descuento > 0) return `<p class="${clase} ${clase}--off">${desde}<span class="precio__final">${formatearPrecio(precioDesde(p))}</span><s>${formatearPrecio(precioLista(p, varDefault(p)))}</s></p>`;
  return `<p class="${clase}">${desde}<span class="precio__final">${formatearPrecio(precioDesde(p))}</span></p>`;
}
function waProducto(p) {
  return p.proximamente
    ? waLink(`¡Hola, ${MARCA}! Avisame cuando ingrese: ${p.nombre}.`)
    : waLink(`¡Hola, ${MARCA}! Quiero consultar por: ${p.nombre}.`);
}
function cardHTML(p, { rail = false, anim = true } = {}) {
  const n = esc(p.nombre);
  if (esM2()) return fcardHTML(p, anim);
  const a = anim ? (rail ? ANIM.der : ANIM.subir) : '';
  const foto = `<button type="button" class="pcard__foto" data-quick="${p.id}" aria-label="Ver ${n}"><span class="pcard__img"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span>${badgesHTML(p)}</button>`;
  if (rail) {
    const add = disponible(p)
      ? `<button type="button" class="btn btn-cta prod-add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}</button>`
      : '';
    return `<article class="pcard pcard--rail"${a}>${foto}<div class="pcard__info"><p class="pcard__meta">${esc(metaDe(p))}</p><h3 class="pcard__nombre">${n}</h3><div class="pcard__fila">${precioHTML(p)}${add}</div></div></article>`;
  }
  const acciones = disponible(p)
    ? `<div class="prod-actions">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta prod-add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carrito}<span>Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<div class="prod-actions"><a class="btn btn-ghost prod-wa" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.campana}<span>Avisame</span></a></div>`;
  return `<article class="pcard"${a}>${foto}<div class="pcard__info"><p class="pcard__meta">${esc(metaDe(p))}</p><h3 class="pcard__nombre">${n}</h3>${precioHTML(p)}${acciones}</div></article>`;
}
function fcardHTML(p, anim = true) {
  const n = esc(p.nombre);
  const a = anim ? ANIM.subir : '';
  const accion = disponible(p)
    ? `<button type="button" class="fcard__add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}<span>Agregar</span></button>`
    : `<a class="fcard__add" href="${waProducto(p)}" target="_blank" rel="noopener" aria-label="Avisame cuando ingrese ${n}">${ICON.campana}<span>Avisame</span></a>`;
  return `<article class="fcard"${a}><button type="button" class="fcard__foto" data-quick="${p.id}" aria-label="Ver ${n}"><span class="fcard__img"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span></button>${badgesHTML(p)}<div class="fcard__info"><p class="fcard__meta">${esc(metaDe(p))}</p><h3 class="fcard__nombre">${n}</h3>${precioHTML(p, 'fcard__precio')}${accion}</div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
document.addEventListener('cart:updated', updateCartBadge);

function waPedido() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) return waLink(`¡Hola, ${MARCA}! Quiero hacer un pedido.`);
  const txt = lineas.map(({ p, v, qty }) => {
    const o = opcion(p, v);
    return `• ${qty} × ${p.nombre}${o ? ' (' + o.label + ')' : ''}: ${formatearPrecio(precioDe(p, v) * qty)}`;
  }).join('\n');
  return waLink(`¡Hola, ${MARCA}! Quiero hacer este pedido:\n${txt}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos la entrega?`);
}

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p || !disponible(p)) return false;
  const vv = p.var ? opcion(p, v).id : '';
  Cart.add(p, qty, vv);
  const extra = p.var ? ` (${opcion(p, vv).label})` : '';
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${extra} al carrito`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.pcard, .qv, .prod-actions, .qv__acciones')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 20)) : 1;
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, 20));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, cantidadDe(add), add.dataset.v || '');
      add.classList.remove('agregado'); void add.offsetWidth; add.classList.add('agregado');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '')) { cerrarQuickView(false); cerrarVisor(false); abrirCarrito(); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, quick); return; }
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, 20));
  });
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
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); syncNoScroll();
    nav.querySelector('.nav-acc summary, a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); } else atraparFoco(nav, e);
  });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function menuCatsHTML() {
  const resumen = Servidor.resumen();
  const href = catalogoHref();
  const activa = document.body.dataset.pagina === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  return CATEGORIAS.map(c => {
    const cant = resumen.find(x => x.id === c.id)?.cantidad || 0;
    const tag = c.pronto ? '<span class="nav-cats__pronto">Muy pronto</span>' : `<span class="nav-cats__cant">${cant}</span>`;
    return `<a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span>${tag}</a>`;
  }).join('') + `<a class="nav-cats__todo" href="${href}">Ver todo el catálogo ${ICON.flecha}</a>`;
}
function initCatMenu() {
  const html = menuCatsHTML();
  document.querySelectorAll('.nav-cats__panel, .nav-cats__lista').forEach(el => { el.innerHTML = html; });
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) cerrar(); });
  wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) cerrar(); });
}

function initCuentas() {
  const resumen = Servidor.resumen();
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const c = CATEGORIAS.find(x => x.id === el.dataset.cuenta);
    const n = resumen.find(x => x.id === el.dataset.cuenta)?.cantidad || 0;
    el.textContent = c?.etiqueta || `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero__panel', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
  paso('.hero__franja', { scaleY: 0, transformOrigin: '50% 0%', duration: 1, clearProps: 'transform' }, 0.25);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.3);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.38);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.55);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.68);
  paso('.buscar', { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.78);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const fondo = document.querySelector('.hero-full__foto img');
    if (fondo) gsap.fromTo(fondo, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero-full', start: 'top top', end: 'bottom top', scrub: true } });
    const frame = document.querySelector('.hero__frame img');
    if (frame) gsap.fromTo(frame, { yPercent: 0 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero--split', start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, .stepper, [data-add]')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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
function initRail(sec) {
  const vp = sec?.querySelector('.rail-vp');
  const track = sec?.querySelector('.rail-track');
  if (!vp || !track) return;
  initRailDrag(vp);
  const prev = sec.querySelector('[data-rail-prev]');
  const next = sec.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) * 1.5;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function renderDestacados() {
  const track = document.getElementById('railDestacados');
  if (!track) return;
  const { items } = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 6 });
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  initRail(track.closest('section'));
}

function initPasos() {
  const sec = document.getElementById('paso-a-paso');
  if (!sec) return;
  const tabs = sec.querySelector('[data-pasos-tabs]');
  const panel = sec.querySelector('[data-pasos-panel]');
  const ids = Object.keys(USOS);
  tabs.innerHTML = ids.map((id, i) => `<button type="button" class="pasos-tab" role="tab" id="tab-${id}" aria-controls="panel-pasos" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-uso="${id}"><span>${USOS[id].paso}</span>${esc(USOS[id].nombre)}</button>`).join('');
  const pintar = (id, primera) => {
    const u = USOS[id];
    const { items } = Servidor.consultar({ filtros: { uso: id }, orden: 'destacados', limite: 4 });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = `<div class="pasos-intro"${ANIM.subir}><p class="pasos-num">${u.paso}</p><p class="pasos-nombre">${esc(u.nombre)}</p><p class="pasos-txt">${esc(u.texto)}</p><a class="link-ver" href="${catalogoHref()}?uso=${id}">Ver todo de ${esc(u.nombre.toLowerCase())} ${ICON.flecha}</a></div><div class="pasos-grid">${items.map(p => cardHTML(p)).join('')}</div>`;
    if (!primera) { revelarNuevos(panel); refrescarScroll(); }
  };
  const activar = (btn, foco) => {
    tabs.querySelectorAll('[role="tab"]').forEach(t => { const on = t === btn; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    if (foco) btn.focus();
    pintar(btn.dataset.uso, false);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[role="tab"]'); if (b && b.getAttribute('aria-selected') !== 'true') activar(b, false); });
  tabs.addEventListener('keydown', e => {
    const lista = [...tabs.querySelectorAll('[role="tab"]')];
    const i = lista.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % lista.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + lista.length) % lista.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = lista.length - 1;
    if (j === null) return;
    e.preventDefault();
    activar(lista[j], true);
  });
  pintar(ids[0], true);
}

function galeriaItemHTML(g, i, rail) {
  const n = g.productos.length;
  const a = rail ? ANIM.der : ANIM.mascara;
  return `<li${a}${rail ? ` data-forma="${g.forma}"` : ''}><button type="button" class="gal-item" data-gal="${i}" aria-label="Ver ${esc(g.titulo)} y sus productos"><span class="gal-item__img"><img src="images/${g.img}.webp" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}"></span><span class="gal-item__txt"><span class="gal-item__tipo">${g.tipo}</span><span class="gal-item__titulo">${esc(g.titulo)}</span><span class="gal-item__prod">${ICON.capas}${n} productos en la foto</span></span></button></li>`;
}
function renderGaleria() {
  document.querySelectorAll('[data-galeria]').forEach(cont => {
    const rail = cont.dataset.galeria === 'rail';
    cont.innerHTML = GALERIA.map((g, i) => galeriaItemHTML(g, i, rail)).join('');
    if (rail) initRail(cont.closest('section'));
  });
}

let visorIndice = 0;
let visorUltimoFoco = null;
function montarOverlays() {
  if (document.getElementById('quickView')) return;
  const html = `
<div class="modal" id="quickView" role="dialog" aria-modal="true" aria-label="Detalle del producto" hidden>
  <div class="modal__caja"><button type="button" class="modal__cerrar" data-close-modal aria-label="Cerrar">${ICON.cerrar}</button><div class="qv" id="qvContenido"></div></div>
</div>
<div class="drawer-backdrop" id="drawerBackdrop"></div>
<aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Tu carrito" inert>
  <div class="drawer__head"><h2>Tu carrito</h2><button type="button" class="drawer__cerrar" data-close-cart aria-label="Cerrar el carrito">${ICON.cerrar}</button></div>
  <div class="drawer__body" id="cartBody"></div>
  <div class="drawer__foot" id="cartFoot" hidden>
    <div class="drawer__total"><span>Total</span><strong id="cartTotal">$0</strong></div>
    <button type="button" class="btn btn-cta" id="checkout">Finalizar compra</button>
    <a class="btn btn-ghost" id="cartWa" href="${waLink(`¡Hola, ${MARCA}! Quiero hacer un pedido.`)}" target="_blank" rel="noopener">${ICON.wa}<span>Enviar pedido por WhatsApp</span></a>
    <p class="drawer__nota">Envío o retiro: lo coordinamos por WhatsApp después de la compra.</p>
  </div>
</aside>
<div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Galería de trabajos y productos de detail" hidden>
  <div class="visor__escena" data-visor-escena>
    <img class="visor__img" data-visor-img src="images/${GALERIA[0].img}.webp" alt="" width="${GALERIA[0].w}" height="${GALERIA[0].h}">
    <button type="button" class="visor__nav visor__nav--prev" data-visor-prev aria-label="Foto anterior">${ICON.flecha}</button>
    <button type="button" class="visor__nav visor__nav--next" data-visor-next aria-label="Foto siguiente">${ICON.flecha}</button>
    <button type="button" class="visor__cerrar" data-visor-cerrar aria-label="Cerrar la galería">${ICON.cerrar}</button>
  </div>
  <div class="visor__panel" data-visor-panel></div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function pintarVisor(animar) {
  const v = document.getElementById('visor');
  const g = GALERIA[visorIndice];
  if (!v || !g) return;
  const img = v.querySelector('[data-visor-img]');
  const poner = () => {
    img.src = `images/${g.img}.webp`; img.alt = g.alt; img.width = g.w; img.height = g.h;
    img.classList.remove('saliendo');
  };
  if (animar && !reduceMotion) { img.classList.add('saliendo'); setTimeout(poner, 180); } else poner();
  const prods = g.productos.map(getProducto).filter(Boolean);
  v.querySelector('[data-visor-panel]').innerHTML = `
    <p class="visor__cont">${visorIndice + 1} / ${GALERIA.length} · ${g.tipo}</p>
    <h2 class="visor__titulo">${esc(g.titulo)}</h2>
    <p class="visor__texto">${esc(g.texto)}</p>
    <p class="visor__sub">En esta foto</p>
    <div class="visor__prods">${prods.map(p => `<div class="vprod"><img src="${imgDe(p)}" alt="" width="58" height="58"><div><button type="button" class="vprod__nombre" data-quick="${p.id}">${esc(p.nombre)}</button><span class="vprod__precio">${p.proximamente ? 'Próximo ingreso' : (variaPrecio(p) ? 'Desde ' : '') + formatearPrecio(precioDesde(p))}</span></div>${disponible(p) ? `<button type="button" class="btn prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carritoMas}</button>` : ''}</div>`).join('')}</div>
    <a class="btn btn-ghost" href="${waLink(`¡Hola, ${MARCA}! Vi la foto «${g.titulo}» en la galería y quiero consultar por los productos que se usaron.`)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar por esta foto</span></a>`;
}
function abrirVisor(i, trigger) {
  const v = document.getElementById('visor');
  if (!v) return;
  visorIndice = (i + GALERIA.length) % GALERIA.length;
  if (v.hidden) visorUltimoFoco = trigger || document.activeElement;
  pintarVisor(false);
  v.hidden = false;
  syncNoScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => v.classList.add('open')));
  v.querySelector('[data-visor-cerrar]')?.focus();
}
function cerrarVisor(devolverFoco = true) {
  const v = document.getElementById('visor');
  if (!v || v.hidden) return;
  v.classList.remove('open');
  v.hidden = true;
  syncNoScroll();
  if (devolverFoco && visorUltimoFoco?.isConnected) visorUltimoFoco.focus();
}
function moverVisor(d) { visorIndice = (visorIndice + d + GALERIA.length) % GALERIA.length; pintarVisor(true); }
function initVisor() {
  const v = document.getElementById('visor');
  if (!v) return;
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-gal]');
    if (item) abrirVisor(Number(item.dataset.gal), item);
  });
  v.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) cerrarVisor();
    else if (e.target.closest('[data-visor-prev]')) moverVisor(-1);
    else if (e.target.closest('[data-visor-next]')) moverVisor(1);
    else if (e.target.matches('[data-visor-escena]')) cerrarVisor();
  });
  document.addEventListener('keydown', e => {
    if (v.hidden || !document.getElementById('quickView')?.hidden) return;
    if (e.key === 'Escape') cerrarVisor();
    else if (e.key === 'ArrowRight') moverVisor(1);
    else if (e.key === 'ArrowLeft') moverVisor(-1);
    else atraparFoco(v, e);
  });
  const escena = v.querySelector('[data-visor-escena]');
  let x0 = null;
  escena.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  escena.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) moverVisor(dx < 0 ? 1 : -1);
  });
}

let qvUltimoFoco = null;
function abrirQuickView(id, trigger) {
  const modal = document.getElementById('quickView');
  const cont = document.getElementById('qvContenido');
  const p = getProducto(id);
  if (!modal || !cont || !p) return;
  if (modal.hidden) qvUltimoFoco = trigger || document.activeElement;
  const n = esc(p.nombre);
  const vIni = varDefault(p);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const variantes = p.var && !p.proximamente ? `<fieldset class="qv__var"><legend>${esc(p.var.nombre)}</legend><div class="qv__ops">${p.var.ops.map((o, i) => `<button type="button" class="qv__op" data-op="${o.id}" aria-pressed="${i === 0}">${o.hex ? `<span class="qv__swatch" style="background:${o.hex}"></span>` : ''}${esc(o.label)}${variaPrecio(p) ? `<small>${formatearPrecio(precioDe(p, o.id))}</small>` : ''}</button>`).join('')}</div></fieldset>` : '';
  const puntos = p.puntos?.length ? `<ul class="qv__puntos">${p.puntos.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : '';
  const precio = p.proximamente
    ? '<p class="precio precio--pronto">Próximo ingreso · precio a confirmar</p>'
    : `<p class="precio${p.descuento > 0 ? ' precio--off' : ''}"><span class="precio__final" data-qv-precio>${formatearPrecio(precioDe(p, vIni))}</span>${p.descuento > 0 ? `<s data-qv-lista>${formatearPrecio(precioLista(p, vIni))}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>`;
  const acciones = disponible(p)
    ? `<div class="qv__acciones">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta" data-add="${p.id}" data-v="${vIni}">${ICON.carrito}<span>Agregar al carrito</span></button><button type="button" class="btn btn-ghost" data-buy="${p.id}" data-v="${vIni}">Comprar ahora</button></div>`
    : `<div class="qv__acciones"><a class="btn btn-cta" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.wa}<span>Avisame cuando ingrese</span></a></div>`;
  cont.innerHTML = `
    <div class="qv__foto">${badgesHTML(p)}<img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreCat(p.cat))}${p.uso?.length ? ' · ' + esc(p.uso.map(u => USOS[u]?.nombre).join(', ')) : ''}</p>
      <h2 class="qv__nombre">${n}</h2>
      ${p.marca ? `<p class="qv__marca">Marca: ${esc(p.marca)}</p>` : ''}
      ${precio}
      <p class="qv__desc">${esc(p.desc)}</p>
      ${puntos}${variantes}${acciones}
      <p class="qv__nota">¿Dudas con el producto? <a href="${waProducto(p)}" target="_blank" rel="noopener">Preguntanos por WhatsApp</a></p>
    </div>
    ${rel.length ? `<div class="qv__rel"><h3>También te puede servir</h3><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="56" height="56"><span>${esc(r.nombre)}<small>${r.proximamente ? 'Próximo ingreso' : formatearPrecio(precioDesde(r))}</small></span></button>`).join('')}</div></div>` : ''}`;
  cont.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    cont.querySelectorAll('[data-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('[data-add], [data-buy]').forEach(x => { x.dataset.v = b.dataset.op; });
    const el = cont.querySelector('[data-qv-precio]');
    if (el) el.textContent = formatearPrecio(precioDe(p, b.dataset.op));
    const li = cont.querySelector('[data-qv-lista]');
    if (li) li.textContent = formatearPrecio(precioLista(p, b.dataset.op));
  }));
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(imgDe(p), location.href).href,
    brand: { '@type': 'Brand', name: p.marca || MARCA }, category: nombreCat(p.cat),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.proximamente ? undefined : precioDesde(p), availability: disponible(p) ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' },
  });
  const yaAbierto = !modal.hidden;
  modal.hidden = false;
  cont.parentElement.scrollTop = 0;
  syncNoScroll();
  if (!yaAbierto) requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  modal.querySelector('.modal__cerrar')?.focus();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQuickView(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  syncNoScroll();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  if (devolverFoco && qvUltimoFoco?.isConnected) qvUltimoFoco.focus();
}
function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close-modal]')) cerrarQuickView(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); cerrarQuickView(); }
    else atraparFoco(modal, e);
  }, true);
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, null);
}

let carritoUltimoFoco = null;
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.carrito}<h3>Tu carrito está vacío</h3><p>Arrancá por lo básico: un buen shampoo y dos microfibras ya cambian el lavado.</p><a class="btn btn-cta" href="${catalogoHref()}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = lineas.map(({ p, v, qty }, k) => {
    const o = opcion(p, v);
    return `<div class="linea" data-id="${p.id}" data-v="${v || ''}"${animar ? ` style="animation-delay:${Math.min(k * 0.05, 0.3)}s"` : ' style="animation:none"'}>
      <img src="${imgDe(p)}" alt="" width="72" height="72">
      <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p>${o ? `<p class="linea__var">${esc(p.var.nombre)}: ${esc(o.label)}</p>` : ''}
        <div class="linea__fila"><div class="stepper" data-stepper><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="30" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
        <span class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</span>
        <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.basura}</button></div>
      </div></div>`;
  }).join('');
  if (total) total.textContent = formatearPrecio(Cart.total());
}
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  carritoUltimoFoco = document.activeElement;
  renderCarrito(true);
  drawer.removeAttribute('inert');
  drawer.classList.add('open'); bd?.classList.add('open');
  syncNoScroll();
  drawer.querySelector('[data-close-cart]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open'); bd?.classList.remove('open');
  drawer.setAttribute('inert', '');
  syncNoScroll();
  if (carritoUltimoFoco?.isConnected) carritoUltimoFoco.focus();
}
function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('.linea');
    if (!linea) return;
    const { id, v } = linea.dataset;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v)?.qty || 1;
      Cart.setQty(id, v, actual + Number(step.dataset.lineaStep));
    }
    if (e.target.closest('[data-quitar]')) Cart.remove(id, v);
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.linea input');
    if (!input) return;
    const { id, v } = input.closest('.linea').dataset;
    Cart.setQty(id, v, parseInt(input.value, 10) || 1);
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(false); });
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarCarrito();
    else atraparFoco(drawer, e);
  });
  document.querySelectorAll('[data-open-cart-btn]').forEach(b => b.addEventListener('click', abrirCarrito));
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

const POR_PAGINA = 16;
function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid || document.body.dataset.pagina !== 'catalogo') return;
  const params = new URLSearchParams(location.search);
  const valida = (v, mapa) => (v && Object.prototype.hasOwnProperty.call(mapa, v) ? v : '');
  const catsValidas = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const st = {
    cat: valida(params.get('cat'), catsValidas),
    uso: (params.get('uso') || '').split(',').filter(s => USOS[s]),
    extra: (params.get('extra') || '').split(',').filter(s => EXTRAS[s]),
    precio: valida(params.get('precio'), RANGOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valida(params.get('orden'), ORDENES) || 'destacados',
  };
  const el = {
    titulo: document.getElementById('catTitulo'), bajada: document.getElementById('catBajada'), miga: document.getElementById('migaCat'),
    q: document.getElementById('q'), orden: document.getElementById('orden'), resumen: document.getElementById('resumen'),
    mas: document.getElementById('masWrap'), verMas: document.getElementById('verMas'), mostrando: document.getElementById('mostrando'),
    cats: document.getElementById('filtroCats'), usos: document.getElementById('filtroUsos'), extras: document.getElementById('filtroExtras'),
    precios: document.getElementById('filtroPrecios'), filtros: document.getElementById('filtros'), abrir: document.getElementById('abrirFiltros'),
  };
  const bajadaBase = el.bajada?.textContent || '';
  const tituloBase = el.titulo?.textContent || 'Catálogo';
  let cursor = null, mostrados = 0, total = 0;

  el.cats.innerHTML = [{ id: '', nombre: 'Todo el catálogo' }, ...CATEGORIAS].map(c => `<button type="button" class="filtro__cat" data-cat="${c.id}" aria-pressed="${st.cat === c.id}">${esc(c.nombre)}<span>${Servidor.contar(c.id ? { cat: c.id } : {})}</span></button>`).join('');
  el.usos.innerHTML = Object.entries(USOS).map(([id, u]) => `<label class="check"><input type="checkbox" data-f="uso" value="${id}"${st.uso.includes(id) ? ' checked' : ''}>${esc(u.nombre)}<small>${Servidor.contar({ uso: id })}</small></label>`).join('');
  el.precios.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([id, r]) => [id, r.label])].map(([id, l]) => `<label class="check"><input type="radio" name="precio" value="${id}"${st.precio === id ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.extras.innerHTML = Object.entries(EXTRAS).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="extra" value="${id}"${st.extra.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.orden.innerHTML = Object.entries(ORDENES).map(([id, l]) => `<option value="${id}"${st.orden === id ? ' selected' : ''}>${esc(l)}</option>`).join('');
  el.q.value = st.q;

  const filtrosServidor = () => ({ cat: st.cat || undefined, uso: st.uso, extra: st.extra, rango: st.precio || undefined, q: st.q || undefined });
  const activos = () => (st.cat ? 1 : 0) + st.uso.length + st.extra.length + (st.precio ? 1 : 0) + (st.q ? 1 : 0);

  function escribirURL() {
    const u = new URL(location.href);
    ['cat', 'uso', 'extra', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.cat) u.searchParams.set('cat', st.cat);
    if (st.uso.length) u.searchParams.set('uso', st.uso.join(','));
    if (st.extra.length) u.searchParams.set('extra', st.extra.join(','));
    if (st.precio) u.searchParams.set('precio', st.precio);
    if (st.q) u.searchParams.set('q', st.q);
    if (st.orden !== 'destacados') u.searchParams.set('orden', st.orden);
    window.history.replaceState(null, '', u);
  }
  function pintarCabecera() {
    const c = catsValidas[st.cat];
    if (el.titulo) el.titulo.textContent = c ? c.nombre : tituloBase;
    if (el.bajada) el.bajada.textContent = c ? c.bajada : bajadaBase;
    if (el.miga) { el.miga.hidden = !c; const s = el.miga.querySelector('[data-miga-nombre]'); if (s) s.textContent = c ? c.nombre : ''; }
    document.title = `${c ? c.nombre : 'Catálogo'} — ${MARCA}, cosmética automotriz`;
    el.cats.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === st.cat)));
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (st.cat && new URL(a.href).searchParams.get('cat') === st.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarResumen() {
    const chips = [];
    if (st.cat) chips.push(['cat', st.cat, catsValidas[st.cat].nombre]);
    st.uso.forEach(t => chips.push(['uso', t, USOS[t].nombre]));
    st.extra.forEach(t => chips.push(['extra', t, EXTRAS[t]]));
    if (st.precio) chips.push(['precio', st.precio, RANGOS[st.precio].label]);
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    el.resumen.innerHTML = `<span><strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}</span>` +
      chips.map(([k, v, l]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') +
      (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    document.querySelectorAll('[data-total]').forEach(s => { s.textContent = total; });
    const nf = document.querySelector('[data-nfiltros]');
    if (nf) nf.textContent = activos() ? `(${activos()})` : '';
  }
  function vacioHTML() {
    return `<div class="vacio"${ANIM.subirCh}><h2>Eso no está en el estante (todavía)</h2><p>Probá con otra palabra o sacá algún filtro. Si buscás algo puntual para tu auto, escribinos y te decimos si lo conseguimos.</p><div class="vacio__ctas"><button type="button" class="btn btn-cta" data-limpiar>Limpiar filtros</button><a class="btn btn-ghost" href="${waLink(`¡Hola, ${MARCA}! Busco un producto que no encontré en la tienda: `)}" target="_blank" rel="noopener">${ICON.wa}<span>Preguntar por WhatsApp</span></a></div></div>`;
  }
  function cargar(reset) {
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
    if (reset) { grid.innerHTML = ''; mostrados = 0; }
    total = res.total; cursor = res.cursor;
    if (!total) grid.innerHTML = vacioHTML();
    else grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    el.mas.hidden = !cursor;
    if (el.mostrando) el.mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    pintarResumen();
    revelarNuevos(grid);
    refrescarScroll();
  }
  function aplicar() { pintarCabecera(); escribirURL(); cargar(true); }

  el.cats.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; st.cat = b.dataset.cat; aplicar(); });
  el.filtros.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) {
      st[t.dataset.f] = [...el.filtros.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
      aplicar();
    } else if (t.matches('input[name="precio"]')) { st.precio = valida(t.value, RANGOS); aplicar(); }
  });
  el.orden.addEventListener('change', () => { st.orden = valida(el.orden.value, ORDENES) || 'destacados'; aplicar(); });
  let deb = 0;
  el.q.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { st.q = el.q.value.trim().slice(0, 60); aplicar(); }, 250); });
  document.getElementById('buscador')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); st.q = el.q.value.trim().slice(0, 60); aplicar(); });
  el.verMas.addEventListener('click', () => cargar(false));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(st, { cat: '', uso: [], extra: [], precio: '', q: '' });
      el.q.value = '';
      el.filtros.querySelectorAll('input[type="checkbox"]').forEach(i => { i.checked = false; });
      const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true;
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-quitar-filtro]');
    if (!chip) return;
    const k = chip.dataset.quitarFiltro, v = chip.dataset.valor;
    if (k === 'cat') st.cat = '';
    else if (k === 'precio') { st.precio = ''; const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true; }
    else if (k === 'q') { st.q = ''; el.q.value = ''; }
    else { st[k] = st[k].filter(x => x !== v); const i = el.filtros.querySelector(`input[data-f="${k}"][value="${v}"]`); if (i) i.checked = false; }
    aplicar();
  });

  const mobileMq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  let filtrosFoco = null;
  const cerrarFiltros = () => {
    if (!el.filtros.classList.contains('open')) return;
    el.filtros.classList.remove('open'); bd.classList.remove('open');
    el.abrir?.setAttribute('aria-expanded', 'false');
    if (mobileMq.matches) el.filtros.setAttribute('inert', '');
    syncNoScroll();
    filtrosFoco?.focus();
  };
  const abrirFiltros = () => {
    filtrosFoco = document.activeElement;
    el.filtros.removeAttribute('inert');
    el.filtros.classList.add('open'); bd.classList.add('open');
    el.abrir?.setAttribute('aria-expanded', 'true');
    syncNoScroll();
    el.filtros.querySelector('[data-cerrar-filtros]')?.focus();
  };
  el.abrir?.addEventListener('click', abrirFiltros);
  bd.addEventListener('click', cerrarFiltros);
  el.filtros.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarFiltros(); });
  document.addEventListener('keydown', e => {
    if (!el.filtros.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros(); else atraparFoco(el.filtros, e);
  });
  const syncFiltros = () => {
    if (mobileMq.matches) {
      if (!el.filtros.classList.contains('open')) el.filtros.setAttribute('inert', '');
      el.filtros.querySelectorAll('[data-animate]').forEach(x => x.classList.add('in'));
    } else { el.filtros.removeAttribute('inert'); cerrarFiltros(); }
  };
  mobileMq.addEventListener('change', syncFiltros);
  syncFiltros();

  pintarCabecera();
  cargar(true);
  if (params.has('q') && !st.q) setTimeout(() => el.q.focus({ preventScroll: true }), 300);
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

montarOverlays();
initModelBarScroll();
initNav();
initCatMenu();
initCuentas();
renderDestacados();
initPasos();
renderGaleria();
initAcciones();
initQuickView();
initVisor();
initCarrito();
initFloats();
initCatalogo();
updateCartBadge();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initReveals();
initHeroMotion();
initParallax();
