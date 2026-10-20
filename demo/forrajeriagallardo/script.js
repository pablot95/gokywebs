const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5493425154551';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'mascotas', nombre: 'Alimento para mascotas', corto: 'Mascotas', bajada: 'Perros y gatos: suelto por kilo o en bolsa cerrada.', img: 'images/p-gato-adulto.webp' },
  { id: 'granja', nombre: 'Granja y aves', corto: 'Granja y aves', bajada: 'Maíz, mezclas, pellets y semillas para el gallinero, el campo y la jaula.', img: 'images/p-maiz-entero.webp' },
  { id: 'accesorios', nombre: 'Accesorios', corto: 'Accesorios', bajada: 'Collares, correas, comederos y juguetes.', img: 'images/p-collar.webp' },
  { id: 'limpieza', nombre: 'Limpieza suelta', corto: 'Limpieza suelta', bajada: 'Lavandina, detergente y limpiador de pisos por litro.', img: 'images/p-combo-limpieza.webp' },
];
const PARA = {
  perro: { nombre: 'Perros', corto: 'Perro' },
  gato: { nombre: 'Gatos', corto: 'Gato' },
  gallinas: { nombre: 'Gallinas y aves de corral', corto: 'Gallinas' },
  aves: { nombre: 'Aves de jaula', corto: 'Aves de jaula' },
  conejos: { nombre: 'Conejos', corto: 'Conejos' },
  caballos: { nombre: 'Caballos', corto: 'Caballos' },
  casa: { nombre: 'La casa', corto: 'Casa' },
};
const PRESENTACIONES = { bolsa: 'Bolsa cerrada', suelto: 'Suelto por kilo', litro: 'Por litro', unidad: 'Por unidad' };
const RANGOS = {
  hasta5: { nombre: 'Hasta $5.000', max: 5000 },
  '5a20': { nombre: '$5.000 a $20.000', min: 5001, max: 20000 },
  mas20: { nombre: 'Más de $20.000', min: 20001 },
};
const ORDENES = { destacados: 'Más pedidos', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { kilo: 'Elegí la presentación', litro: 'Elegí la cantidad', Talle: 'Elegí el talle', Medida: 'Elegí la medida' };

const fmtNum = n => String(n).replace('.', ',');
const S = (kg, precio) => ({ v: kg < 1 ? `Suelto · ${Math.round(kg * 1000)} g` : `Suelto · ${fmtNum(kg)} kg`, pres: 'suelto', cant: kg, u: 'kg', precio });
const B = (kg, precio) => ({ v: `Bolsa de ${fmtNum(kg)} kg`, pres: 'bolsa', cant: kg, u: 'kg', precio });
const LT = (lt, precio) => ({ v: lt === 1 ? '1 litro' : `${fmtNum(lt)} litros`, pres: 'litro', cant: lt, u: 'L', precio });
const U = (v, precio) => ({ v, pres: 'unidad', precio });

const PRODUCTOS = [
  { id: 'alimento-perro-adulto', nombre: 'Alimento para perro adulto, carne y cereales', cat: 'mascotas', para: ['perro'], tipo: 'kilo',
    ops: [S(1, 3400), S(5, 16200), B(15, 44900), B(22, 62900)], descuento: 0, stock: 30, rango: 1, alta: 10,
    img: 'images/p-perro-adulto.webp', alt: 'Bolsa de papel madera con alimento para perros y un cuenco con croquetas',
    desc: 'Balanceado completo para perros adultos de todos los tamaños, con carne y cereales. Lo llevás suelto, desde 1 kg, o en bolsa cerrada: la de 22 kg es la que menos cuesta por kilo.',
    tags: ['balanceado', 'croquetas', 'comida', 'adulto', 'perros'] },
  { id: 'mezcla-ponedoras', nombre: 'Alimento para gallinas ponedoras', cat: 'granja', para: ['gallinas'], tipo: 'kilo',
    ops: [S(1, 1100), S(5, 5100), B(25, 22900)], descuento: 0, stock: 25, rango: 2, alta: 11,
    img: 'images/p-mezcla-ponedoras.webp', alt: 'Cuenco con mezcla de maíz partido y granos para gallinas',
    desc: 'Mezcla balanceada para gallinas en postura, con maíz partido, soja y conchilla. Una gallina come entre 110 y 120 g por día.',
    tags: ['gallinas', 'ponedoras', 'postura', 'huevos', 'balanceado', 'granos'] },
  { id: 'maiz-entero', nombre: 'Maíz entero', cat: 'granja', para: ['gallinas', 'caballos'], tipo: 'kilo',
    ops: [S(1, 750), S(5, 3400), B(25, 14900)], descuento: 0, stock: 40, rango: 3, alta: 8,
    img: 'images/p-maiz-entero.webp', alt: 'Cuenco de madera lleno de granos de maíz entero',
    desc: 'Maíz entero, seco y limpio, para gallinas, patos y caballos. Suelto por kilo o en bolsa de 25 kg.',
    tags: ['maiz', 'grano', 'cereal', 'gallinas', 'caballos', 'patos'] },
  { id: 'mezcla-jaula', nombre: 'Mezcla para canarios y periquitos', cat: 'granja', para: ['aves'], tipo: 'kilo',
    ops: [S(0.5, 1900), S(1, 3500), S(5, 15900)], descuento: 0, stock: 22, rango: 4, alta: 7,
    img: 'images/p-mezcla-jaula.webp', alt: 'Pala de madera con mezcla de semillas para pájaros y una bolsa de arpillera',
    desc: 'Alpiste, mijo, girasol chico y avena pelada. Se fracciona en el momento: llevás de medio kilo en adelante.',
    tags: ['alpiste', 'mijo', 'semillas', 'pajaros', 'canario', 'periquito', 'aves'] },
  { id: 'set-collar-correa', nombre: 'Set collar + correa de nylon', cat: 'accesorios', para: ['perro'], tipo: 'Talle',
    ops: [U('Talle S', 14900), U('Talle M', 16900), U('Talle L', 18900)], descuento: 0, stock: 9, rango: 5, alta: 10,
    img: 'images/p-set-collar-correa.webp', alt: 'Collar y correa de nylon verde con hebilla negra y mosquetón',
    desc: 'Collar con hebilla de enganche rápido y correa de 1,5 m al tono, con mosquetón de metal. Nylon tejido, resistente y fácil de lavar.',
    tags: ['collar', 'correa', 'paseo', 'perros'] },
  { id: 'pellet-conejos', nombre: 'Alimento en pellets para conejos', cat: 'granja', para: ['conejos'], tipo: 'kilo',
    ops: [S(1, 1600), S(5, 7400), B(25, 31900)], descuento: 0, stock: 18, rango: 6, alta: 6,
    img: 'images/p-pellet-conejos.webp', alt: 'Bolsa de arpillera llena de pellets verdes',
    desc: 'Pellets de alfalfa y granos para conejos y cobayos. Un conejo adulto come entre 100 y 150 g por día, además de pasto y verdura.',
    tags: ['conejo', 'cobayo', 'pellet', 'alfalfa', 'roedores'] },
  { id: 'alimento-gato-adulto', nombre: 'Alimento para gato adulto, pescado', cat: 'mascotas', para: ['gato'], tipo: 'kilo',
    ops: [S(1, 4300), B(3, 12400), B(10, 38900)], descuento: 0, stock: 16, rango: 7, alta: 9,
    img: 'images/p-gato-adulto.webp', alt: 'Bolsas de alimento y un cuenco de madera con croquetas',
    desc: 'Balanceado para gatos adultos, sabor pescado, con croqueta chica. Suelto por kilo o en bolsa de 3 y de 10 kg.',
    tags: ['gatos', 'felino', 'balanceado', 'croquetas', 'comida'] },
  { id: 'lavandina', nombre: 'Lavandina suelta', cat: 'limpieza', para: ['casa'], tipo: 'litro',
    ops: [LT(1, 1100), LT(5, 4900)], descuento: 0, stock: 50, rango: 8, alta: 9,
    img: 'images/p-lavandina.webp', alt: 'Bidón transparente de lavandina',
    desc: 'Lavandina por litro para el baño, la cocina y la ropa blanca. Llevás la cantidad que usás; consultanos por el envase.',
    nota: 'Usala diluida y con el ambiente ventilado. No la mezcles con otros productos de limpieza.',
    tags: ['lavandina', 'cloro', 'limpieza', 'suelto', 'desinfectante'] },
  { id: 'alimento-perro-cachorro', nombre: 'Alimento para cachorro, croqueta chica', cat: 'mascotas', para: ['perro'], tipo: 'kilo',
    ops: [S(1, 3900), B(3, 11200), B(15, 52900)], descuento: 0, stock: 14, alta: 12,
    img: 'images/p-perro-cachorro.webp', alt: 'Bolsa de alimento junto a un comedero de acero con croquetas',
    desc: 'Para cachorros de 2 a 12 meses. Croqueta chica y fácil de masticar, pensada para la etapa de crecimiento.',
    tags: ['cachorro', 'puppy', 'balanceado', 'croquetas', 'perros'] },
  { id: 'alimento-perro-grande', nombre: 'Alimento para perro de raza grande', cat: 'mascotas', para: ['perro'], tipo: 'kilo',
    ops: [B(15, 47900), B(20, 61500)], descuento: 0, stock: 8, alta: 14,
    img: 'images/p-perro-grande.webp', alt: 'Bolsas grandes de alimento balanceado de papel madera',
    desc: 'Croqueta grande para perros de más de 25 kg. Viene en bolsa cerrada de 15 o de 20 kg.',
    tags: ['raza grande', 'balanceado', 'croquetas', 'perros', 'adulto'] },
  { id: 'mezcla-loros', nombre: 'Mezcla para loros y cotorras con girasol', cat: 'granja', para: ['aves'], tipo: 'kilo',
    ops: [S(1, 3900), S(5, 17900)], descuento: 0, stock: 12, alta: 13,
    img: 'images/p-mezcla-loros.webp', alt: 'Bolsa de arpillera abierta con mezcla de semillas y girasol',
    desc: 'Girasol, maíz, trigo y semillas surtidas para loros, cotorras y aves grandes. Suelta, por kilo.',
    tags: ['loro', 'cotorra', 'girasol', 'semillas', 'aves', 'pajaros'] },
  { id: 'pellet-caballos', nombre: 'Pellet de alfalfa para caballos', cat: 'granja', para: ['caballos'], tipo: 'kilo',
    ops: [B(25, 24900), B(40, 37900)], descuento: 0, stock: 10, alta: 15,
    img: 'images/p-pellet-caballos.webp', alt: 'Pellets de alfalfa vistos de cerca',
    desc: 'Pellet de alfalfa para complementar el pasto o el fardo. Viene en bolsa de 25 o de 40 kg.',
    nota: 'Complementa el pasto o el fardo, no lo reemplaza. Ante dudas con la ración, consultá con tu veterinario.',
    tags: ['caballo', 'equino', 'alfalfa', 'pellet', 'fardo'] },
  { id: 'mezcla-granos', nombre: 'Mezcla de granos para aves de corral', cat: 'granja', para: ['gallinas'], tipo: 'kilo',
    ops: [S(1, 900), S(5, 4200), B(25, 18900)], descuento: 10, stock: 20, alta: 16,
    img: 'images/p-mezcla-granos.webp', alt: 'Granos de maíz partido, trigo y sorgo saliendo de una bolsa de arpillera',
    desc: 'Maíz partido, trigo y sorgo para gallinas, patos y pavos. Para tirar en el patio o en el gallinero.',
    tags: ['granos', 'maiz partido', 'trigo', 'sorgo', 'gallinas', 'patos', 'pavos'] },
  { id: 'set-comederos', nombre: 'Set de comedero y bebedero de acero', cat: 'accesorios', para: ['perro', 'gato'], tipo: 'Medida',
    ops: [U('18 cm', 13900), U('22 cm', 16900)], descuento: 0, stock: 6, alta: 12,
    img: 'images/p-set-comederos.webp', alt: 'Dos comederos de acero inoxidable, uno con croquetas, y una soga de algodón',
    desc: 'Dos platos de acero inoxidable con base de goma: uno para el alimento y otro para el agua.',
    nota: 'La soga de la foto se vende aparte.',
    tags: ['comedero', 'bebedero', 'plato', 'acero', 'pack'] },
  { id: 'combo-limpieza', nombre: 'Combo limpieza: lavandina, detergente y limpiador de 5 L', cat: 'limpieza', para: ['casa'], tipo: 'litro',
    ops: [{ v: 'Combo de 3 × 5 litros', pres: 'litro', cant: 15, u: 'L', precio: 19900 }], descuento: 0, stock: 12, alta: 11,
    img: 'images/p-combo-limpieza.webp', alt: 'Tres bidones de limpieza: verde, azul y transparente',
    desc: 'Los tres de 5 litros juntos: lavandina, detergente concentrado y limpiador de pisos aroma lavanda.',
    tags: ['combo', 'limpieza', 'lavandina', 'detergente', 'limpiador', 'pack'] },
  { id: 'comedero', nombre: 'Comedero de acero inoxidable', cat: 'accesorios', para: ['perro', 'gato'], tipo: 'Medida',
    ops: [U('15 cm', 5900), U('18 cm', 7400), U('22 cm', 9200)], descuento: 0, stock: 20, alta: 8,
    img: 'images/p-comedero.webp', alt: 'Comedero de acero inoxidable con croquetas',
    desc: 'Acero inoxidable con base de goma antideslizante: no se corre ni se da vuelta mientras come. Se lava fácil.',
    tags: ['comedero', 'plato', 'bebedero', 'acero'] },
  { id: 'detergente', nombre: 'Detergente concentrado suelto', cat: 'limpieza', para: ['casa'], tipo: 'litro',
    ops: [LT(1, 2200), LT(5, 9900)], descuento: 0, stock: 40, alta: 7,
    img: 'images/p-detergente.webp', alt: 'Bidón con detergente verde',
    desc: 'Detergente concentrado para la vajilla, por litro. Rinde: con un chorrito alcanza.',
    tags: ['detergente', 'lavavajilla', 'limpieza', 'suelto', 'cocina'] },
  { id: 'soga', nombre: 'Juguete de soga con nudos', cat: 'accesorios', para: ['perro'], tipo: 'Medida',
    ops: [U('30 cm', 4900), U('45 cm', 6900)], descuento: 0, stock: 18, alta: 6,
    img: 'images/p-soga.webp', alt: 'Soga de algodón trenzado con dos nudos',
    desc: 'Soga de algodón trenzado con dos nudos, para tirar, morder y jugar de a dos.',
    tags: ['juguete', 'soga', 'mordillo', 'perros'] },
  { id: 'limpiador', nombre: 'Limpiador de pisos, aroma lavanda', cat: 'limpieza', para: ['casa'], tipo: 'litro',
    ops: [LT(1, 1600), LT(5, 6900)], descuento: 0, stock: 35, alta: 6,
    img: 'images/p-limpiador.webp', alt: 'Bidón con limpiador de pisos azul',
    desc: 'Limpiador desodorante para pisos, aroma lavanda, por litro. Se usa diluido en el balde.',
    tags: ['limpiador', 'pisos', 'desodorante', 'lavanda', 'limpieza', 'suelto'] },
  { id: 'collar', nombre: 'Collar de nylon con hebilla', cat: 'accesorios', para: ['perro'], tipo: 'Talle',
    ops: [U('Talle S', 6900), U('Talle M', 7900), U('Talle L', 8900)], descuento: 0, stock: 12, alta: 5,
    img: 'images/p-collar.webp', alt: 'Collar de nylon verde con hebilla negra',
    desc: 'Collar regulable de nylon tejido, con hebilla de enganche rápido y argolla de metal para la correa.',
    tags: ['collar', 'paseo', 'perros'] },
  { id: 'correa', nombre: 'Correa de nylon de 1,5 m', cat: 'accesorios', para: ['perro'], tipo: null,
    ops: [U('1,5 m', 9900)], descuento: 0, stock: 3, alta: 4,
    img: 'images/p-correa.webp', alt: 'Correa de nylon verde enrollada con mosquetón negro',
    desc: 'Correa de nylon tejido de 1,5 m, con manija acolchada y mosquetón de metal.',
    tags: ['correa', 'paseo', 'perros'] },
  { id: 'alimento-humedo-gato', nombre: 'Alimento húmedo para gato', cat: 'mascotas', para: ['gato'], tipo: null,
    ops: [U('Pouch de 85 g', 1500)], descuento: 0, stock: 0, alta: 17, visible: false,
    img: 'images/p-gato-adulto.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), para = lista(f.para), pres = lista(f.pres), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (para.length && !p.para.some(m => para.includes(m))) return false;
    if (pres.length && !p.ops.some(op => pres.includes(op.pres))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.noDestacado && p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, p.desc,
      ...p.para.map(m => `${m} ${PARA[m]?.nombre || ''}`),
      ...p.ops.map(op => `${op.v} ${PRESENTACIONES[op.pres] || ''}`), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (palabras.every(w => textoDe(p).includes(w))) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];

const Cart = {
  KEY: 'forrajeriagallardo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 7Z"/><path d="M6 7 7.5 3h9L18 7"/><path d="M9 11h6"/></svg>',
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  ubicacion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const unidadTxt = op => (op.u === 'L' ? 'litro' : 'kg');
const unitTxt = (p, op) => (op.cant ? `${formatearPrecio(precioOp(p, op) / op.cant)} el ${unidadTxt(op)}` : '');
function mejorUnit(p) {
  const con = p.ops.filter(op => op.cant);
  if (!con.length) return null;
  const m = con.reduce((a, b) => (precioOp(p, b) / b.cant < precioOp(p, a) / a.cant ? b : a));
  if (con.length === 1) return { base: unitTxt(p, m), det: '' };
  if (m.pres === 'bolsa') return { base: unitTxt(p, m), det: ` en la bolsa de ${fmtNum(m.cant)} kg` };
  return { base: unitTxt(p, m), det: ` llevando ${m.v.replace('Suelto · ', '')}` };
}
const listaY = arr => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}` : arr[0] || '');
function resumenVar(p) {
  if (p.ops.length === 1) return p.ops[0].v;
  const bolsas = p.ops.filter(op => op.pres === 'bolsa').map(op => fmtNum(op.cant));
  const sueltos = p.ops.filter(op => op.pres === 'suelto');
  if (sueltos.length && bolsas.length) return `Suelto o en bolsa de ${listaY(bolsas)} kg`;
  if (bolsas.length) return `Bolsa de ${listaY(bolsas)} kg`;
  if (sueltos.length) return `Suelto, de ${sueltos[0].v.replace('Suelto · ', '')} a ${sueltos[sueltos.length - 1].v.replace('Suelto · ', '')}`;
  if (p.tipo === 'litro') return `Por litro: ${listaY(p.ops.map(op => fmtNum(op.cant)))} litros`;
  if (p.tipo === 'Talle') return `Talles ${listaY(p.ops.map(op => op.v.replace('Talle ', '')))}`;
  if (p.tipo === 'Medida') return `${listaY(p.ops.map(op => op.v.replace(' cm', '')))} cm`;
  return `${p.ops.length} opciones`;
}
const metaDe = p => `${CATEGORIAS.find(c => c.id === p.cat)?.corto || ''} · ${p.para.map(m => PARA[m]?.corto).join(' y ')}`;
const stepperHTML = () => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function cardHTML(p, { anim = true } = {}) {
  const varias = p.ops.length > 1 && new Set(p.ops.map(op => op.precio)).size > 1;
  const base = Math.min(...p.ops.map(op => op.precio));
  const tags = [];
  if (p.descuento > 0) tags.push(`<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`);
  if (p.ops.some(op => op.pres === 'suelto')) tags.push('<span class="pcard__badge pcard__badge--suelto">Suelto por kilo</span>');
  else if (p.ops.some(op => op.pres === 'litro') && p.ops.length > 1) tags.push('<span class="pcard__badge pcard__badge--suelto">Por litro</span>');
  if (p.stock > 0 && p.stock <= 3) tags.push('<span class="pcard__badge">Últimas unidades</span>');
  else if (p.alta >= 15 && tags.length < 2) tags.push('<span class="pcard__badge">Nuevo</span>');
  const unit = mejorUnit(p);
  const sinStock = !(p.stock > 0);
  return `<article class="pcard" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div>
    ${tags.length ? `<div class="pcard__tags">${tags.slice(0, 2).join('')}</div>` : ''}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__var">${esc(resumenVar(p))}</p>
    <p class="pcard__precio">${varias ? '<span class="desde">desde</span>' : ''}<span>${formatearPrecio(precioDesde(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}${unit ? `<span class="pcard__unit">${esc(unit.base)}${unit.det ? `<span class="pcard__unit-det">${esc(unit.det)}</span>` : ''}</span>` : ''}</p>
    <div class="prod-actions">
      ${stepperHTML()}
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
</article>`;
}

const precioFilaHTML = (p, op) => `<b>${formatearPrecio(precioOp(p, op))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}${op.cant ? `<small>${esc(unitTxt(p, op))}</small>` : ''}`;
function filaHTML(p, { anim = true } = {}) {
  const sinStock = !(p.stock > 0);
  const op = p.ops[0];
  const pres = p.ops.length > 1
    ? `<label class="fila__pres"><span class="sr-only">Presentación de ${esc(p.nombre)}</span><select data-fila-op>${p.ops.map((o, i) => `<option value="${i}">${esc(o.v)} · ${formatearPrecio(precioOp(p, o))}</option>`).join('')}</select></label>`
    : `<span class="fila__una">${esc(op.v)}</span>`;
  return `<article class="fila" data-id="${esc(p.id)}"${anim ? ' data-animate="izq" style="opacity:0;transform:translateX(-40px)"' : ''}>
  <button type="button" class="fila__foto" data-quick="${esc(p.id)}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="160" height="160"></button>
  <div class="fila__info">
    <p class="fila__meta">${esc(metaDe(p))}</p>
    <h3 class="fila__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a>${p.descuento > 0 ? `<span class="fila__badge">-${p.descuento}%</span>` : ''}</h3>
    ${pres}
  </div>
  <div class="fila__precio" data-fila-precio>${precioFilaHTML(p, op)}</div>
  <div class="fila__acc">
    ${stepperHTML()}
    <button type="button" class="fila__add" data-fila-add aria-label="${sinStock ? 'Sin stock' : 'Sumar al pedido'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.mas}<span>${sinStock ? 'Sin stock' : 'Sumar'}</span></button>
  </div>
</article>`;
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu(catActual = '') {
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    const lista = box.querySelector('[data-cats-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    lista.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    function cerrar() { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-n-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.nCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-n-cat-num]').forEach(el => {
    const id = el.dataset.nCatNum;
    el.textContent = Tienda.contar(id ? { cat: id } : {});
  });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { noDestacado: true }, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initListaHome() {
  const cont = document.querySelector('[data-lista-home]');
  if (!cont) return;
  const tabs = [...document.querySelectorAll('[data-lista-tab]')];
  const todo = document.querySelector('[data-lista-todo]');
  const resto = document.querySelector('[data-lista-resto]');
  const pintar = cat => {
    const filtros = cat ? { cat } : {};
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: 8 });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => filaHTML(p)).join('');
    const n = Tienda.contar(filtros);
    const c = CATEGORIAS.find(x => x.id === cat);
    if (todo) {
      todo.href = `${URL_CATALOGO}${cat ? '?cat=' + cat : ''}`;
      const t = todo.querySelector('span');
      if (t) t.textContent = c ? `Ver toda la lista de ${c.corto.toLowerCase()}` : 'Ver la lista completa';
    }
    if (resto) resto.textContent = n > items.length ? `Mostrando ${items.length} de ${n} productos.` : `${n} ${n === 1 ? 'producto' : 'productos'} en ${c ? c.corto.toLowerCase() : 'la lista'}.`;
    revelarNuevos(cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.listaTab || '');
  }));
  pintar('');
}

function cerrarPickers() {
  document.querySelectorAll('.picker').forEach(pk => pk.remove());
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v)}${op.cant ? `<small>${esc(unitTxt(p, op))}</small>` : ''}</span><b>${formatearPrecio(precioOp(p, op))}</b></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

function sumarAlCarrito(p, qty, v, comprar) {
  Cart.add(p, qty, v);
  const op = opDe(p, v);
  const detalle = p.ops.length > 1 ? ` (${op.v})` : '';
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${detalle} al pedido`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const item = step.closest('.pcard, .fila');
      const p = item ? getProducto(item.dataset.id) : null;
      const max = p?.stock || 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const fadd = e.target.closest('[data-fila-add]');
    if (fadd) {
      const fila = fadd.closest('.fila');
      const p = getProducto(fila?.dataset.id);
      if (!p) return;
      const op = p.ops[Number(fila.querySelector('[data-fila-op]')?.value || 0)] || p.ops[0];
      const n = fila.querySelector('[data-qty]');
      sumarAlCarrito(p, parseInt(n?.textContent, 10) || 1, op.v, false);
      if (n) n.textContent = '1';
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-fila-op]');
    if (!sel) return;
    const fila = sel.closest('.fila');
    const p = getProducto(fila?.dataset.id);
    const box = fila?.querySelector('[data-fila-precio]');
    if (p && box) box.innerHTML = precioFilaHTML(p, p.ops[Number(sel.value)] || p.ops[0]);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = 0; qvEstado.qty = 1;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(op => precioOp(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const tit = TITULO_VAR[p.tipo] || '';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span>${formatearPrecio(precioOp(p, op))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}${op.cant ? `<small>${esc(unitTxt(p, op))}</small>` : ''}</p>
      ${p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">${esc(tit)}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(tit)}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b><span>${formatearPrecio(precioOp(p, o))}${o.cant ? ` · ${esc(unitTxt(p, o))}` : ''}</span></button>`).join('')}</div></div>` : `<p class="qv__meta">${esc(op.v)}</p>`}
      <p class="qv__stock">${ICO.check}${esc(stock)} · retiro en el local o entrega a coordinar</p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${p.stock > 0 ? '' : ' disabled'}>${ICO.carrito}Agregar al pedido</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.nota ? `<p class="qv__nota">${ICO.info}<span>${esc(p.nota)}</span></p>` : ''}
      <a class="qv__wsp" href="${wspLink(`Hola Forrajería Gallardo! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}¿Dudas? Preguntanos por WhatsApp</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (document.getElementById('cartDrawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const comprar = add.hasAttribute('data-qv-comprar');
      Cart.add(p, qvEstado.qty, p.ops[qvEstado.op].v);
      if (comprar) { cerrarQV(); abrirCarrito(); }
      else showToast(`Sumaste ${qvEstado.qty > 1 ? qvEstado.qty + ' × ' : ''}${p.nombre}${p.ops.length > 1 ? ` (${p.ops[qvEstado.op].v})` : ''} al pedido`);
    }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

function itemsCarrito() { return Cart.get().filter(i => getProducto(i.id)); }
function mensajePedido() {
  const lineas = itemsCarrito().map(i => {
    const p = getProducto(i.id); const op = opDe(p, i.v);
    return `- ${i.qty} × ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * i.qty)}`;
  }).join('\n');
  return `Hola Forrajería Gallardo! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o la entrega?`;
}
function lineasHTML(items) {
  return `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="56" height="56">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(op.v)} · ${formatearPrecio(precioOp(p, op))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
}
function pieHTML() {
  return `<p class="total-fila"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="nota-entrega">${ICO.ubicacion}Retiro en Ángel Gallardo o entrega a coordinar</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(mensajePedido())}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function manejarLineas(e, cont, alQuitar) {
  if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
  const linea = e.target.closest('[data-linea]');
  if (!linea) return;
  const id = linea.dataset.linea, v = linea.dataset.v;
  const step = e.target.closest('[data-linea-step]');
  if (step) {
    const it = Cart.get().find(i => i.id === id && i.v === v);
    if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
    [...cont.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest('[data-linea-quitar]')) {
    Cart.remove(id, v);
    alQuitar?.();
  }
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = itemsCarrito();
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.bolsa}<p class="cart-vacio__tit">Tu pedido está vacío</p><p>Sumá alimento, granos o lo que necesites para tus animales y tu casa.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = lineasHTML(items);
  foot.innerHTML = pieHTML();
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    manejarLineas(e, dr, () => dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true }));
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function initPedido() {
  const panel = document.querySelector('[data-pedido]');
  if (!panel) return;
  const lineas = panel.querySelector('[data-pedido-lineas]');
  const pie = panel.querySelector('[data-pedido-pie]');
  const n = panel.querySelector('[data-pedido-n]');
  const render = () => {
    const items = itemsCarrito();
    if (n) n.textContent = items.length ? `${Cart.count()} ${Cart.count() === 1 ? 'unidad' : 'unidades'}` : 'Vacío';
    if (!items.length) {
      lineas.innerHTML = '<div class="pedido__vacio"><b>Todavía no sumaste nada</b><span>Elegí la presentación, la cantidad y tocá «Sumar»: el pedido se arma acá.</span></div>';
      pie.hidden = true;
      return;
    }
    lineas.innerHTML = lineasHTML(items);
    pie.innerHTML = pieHTML();
    pie.hidden = false;
  };
  panel.addEventListener('click', e => manejarLineas(e, panel, () => panel.querySelector('.pedido__head')?.focus?.()));
  document.addEventListener('cart:updated', render);
  render();
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

const CALC = {
  perro: { id: 'alimento-perro-adulto', etiqueta: 'Peso de tu perro', min: 2, max: 60, paso: 1, def: 20, valor: v => `${fmtNum(v)} kg`, gramos: v => 1.6 * 70 * v ** 0.75 / 3.6, quien: v => `Un perro de ${fmtNum(v)} kg come`, que: 'de alimento balanceado' },
  gato: { id: 'alimento-gato-adulto', etiqueta: 'Peso de tu gato', min: 2, max: 9, paso: 0.5, def: 4, valor: v => `${fmtNum(v)} kg`, gramos: v => 1.2 * 70 * v ** 0.75 / 3.8, quien: v => `Un gato de ${fmtNum(v)} kg come`, que: 'de alimento balanceado' },
  gallinas: { id: 'mezcla-ponedoras', etiqueta: 'Cuántas gallinas tenés', min: 1, max: 60, paso: 1, def: 10, valor: v => `${v}`, gramos: v => v * 115, quien: v => (v === 1 ? 'Una gallina come' : `${v} gallinas comen`), que: 'de alimento para ponedoras' },
  conejos: { id: 'pellet-conejos', etiqueta: 'Cuántos conejos tenés', min: 1, max: 30, paso: 1, def: 2, valor: v => `${v}`, gramos: v => v * 120, quien: v => (v === 1 ? 'Un conejo come' : `${v} conejos comen`), que: 'de pellets' },
};
const gramosTxt = g => (g >= 1000 ? `${fmtNum(Math.round(g / 100) / 10)} kg` : `${Math.max(5, Math.round(g / 5) * 5)} g`);
const nombreOp = op => (op.pres === 'bolsa' ? `la bolsa de ${fmtNum(op.cant)} kg` : `${op.v.replace('Suelto · ', '')} sueltos`);
function initCalculadora() {
  const box = document.querySelector('[data-calc]');
  if (!box) return;
  const rango = box.querySelector('#calcValor');
  const salida = box.querySelector('[data-calc-valor]');
  const etiqueta = box.querySelector('[data-calc-label]');
  const sel = box.querySelector('#calcBolsa');
  const dias = box.querySelector('[data-calc-dias]');
  const diasTxt = box.querySelector('[data-calc-dias-txt]');
  const detalle = box.querySelector('[data-calc-detalle]');
  const sug = box.querySelector('[data-calc-sug]');
  const btn = box.querySelector('[data-calc-add]');
  if (!rango || !sel || !btn) return;
  let animal = box.querySelector('input[name="calc-animal"]:checked')?.value || 'perro';
  const conf = () => CALC[animal];
  const prod = () => getProducto(conf().id);
  const opsKg = () => (prod()?.ops || []).filter(op => op.u === 'kg');
  const gramos = () => conf().gramos(Number(rango.value));
  const sugerida = g => opsKg().find(op => (op.cant * 1000) / g >= 30) || opsKg()[opsKg().length - 1];
  const pintar = (resetSel = false) => {
    const c = conf(); const p = prod(); if (!p) return;
    const v = Number(rango.value);
    const g = gramos();
    const ops = opsKg();
    const s = sugerida(g);
    if (resetSel) {
      sel.innerHTML = ops.map(op => `<option value="${esc(op.v)}">${esc(op.v)} · ${formatearPrecio(precioOp(p, op))}</option>`).join('');
      sel.value = s.v;
    }
    const op = ops.find(o => o.v === sel.value) || s;
    const d = Math.floor((op.cant * 1000) / g);
    salida.textContent = c.valor(v);
    dias.textContent = d < 1 ? 'menos de 1' : String(d);
    if (diasTxt) diasTxt.textContent = d === 1 ? 'día' : 'días';
    detalle.textContent = `${c.quien(v)} unos ${gramosTxt(g)} ${c.que} por día.`;
    const sd = Math.floor((s.cant * 1000) / g);
    sug.textContent = sd >= 30 ? `Para un mes te alcanza con ${nombreOp(s)}.` : `Ni ${nombreOp(s)} llega al mes: te dura ${sd} ${sd === 1 ? 'día' : 'días'}.`;
    btn.textContent = `Agregar ${op.pres === 'bolsa' ? `la bolsa de ${fmtNum(op.cant)} kg` : op.v.toLowerCase()} · ${formatearPrecio(precioOp(p, op))}`;
    btn.dataset.v = op.v;
  };
  const setAnimal = a => {
    animal = CALC[a] ? a : 'perro';
    const c = conf();
    rango.min = c.min; rango.max = c.max; rango.step = c.paso; rango.value = c.def;
    etiqueta.textContent = c.etiqueta;
    pintar(true);
  };
  box.querySelectorAll('input[name="calc-animal"]').forEach(r => r.addEventListener('change', () => setAnimal(r.value)));
  rango.addEventListener('input', () => pintar(true));
  sel.addEventListener('change', () => pintar(false));
  btn.addEventListener('click', () => {
    const p = prod(); if (!p) return;
    const op = opDe(p, btn.dataset.v);
    Cart.add(p, 1, op.v);
    showToast(`Sumaste ${p.nombre} (${op.v}) al pedido`);
  });
  setAnimal(animal);
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-31.555, -60.676];
    const tactil = window.matchMedia('(pointer: coarse)').matches;
    const map = L.map(el, { center: centro, zoom: 13, scrollWheelZoom: false, dragging: !tactil, tap: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
    const icon = L.divIcon({ className: 'pin-rombo', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 13] });
    L.marker(centro, { icon, keyboard: false, title: 'Forrajería Gallardo' }).addTo(map);
    window.addEventListener('load', () => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 1600);
  } catch (e) { console.warn(e); }
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const vista = grid.dataset.vista === 'lista' ? 'lista' : 'grilla';
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(params.get('cat'), catIds),
    para: valido(params.get('para'), PARA),
    pres: valido(params.get('pres'), PRESENTACIONES),
    precio: valido(params.get('precio'), RANGOS),
    stock: params.get('stock') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const tituloEl = document.querySelector('[data-cat-titulo]');
  const tituloBase = tituloEl?.dataset.base || 'Todo el catálogo';

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todo', corto: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.corto)} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas')}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-para-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos'], ...Object.entries(PARA).map(([k, v]) => [k, v.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-para" value="${k}" data-filtro="para"><span>${esc(n)}</span><span class="opt__n" data-cuenta-para="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-pres-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todas'], ...Object.entries(PRESENTACIONES)].map(([k, n]) => `<label class="opt"><input type="radio" name="f-pres" value="${k}" data-filtro="pres"><span>${esc(n)}</span><span class="opt__n" data-cuenta-pres="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('select[data-filtro="para"]').forEach(s => { s.innerHTML = `<option value="">Para todos</option>${Object.entries(PARA).map(([k, v]) => `<option value="${k}">${esc(v.nombre)}</option>`).join('')}`; });
  document.querySelectorAll('select[data-filtro="pres"]').forEach(s => { s.innerHTML = `<option value="">Toda presentación</option>${Object.entries(PRESENTACIONES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}`; });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  document.querySelectorAll('select[data-filtro="precio"]').forEach(s => { s.innerHTML = `<option value="">Cualquier precio</option>${Object.entries(RANGOS).map(([k, r]) => `<option value="${k}">${esc(r.nombre)}</option>`).join('')}`; });

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.para && sin !== 'para') f.para = estado.para;
    if (estado.pres && sin !== 'pres') f.pres = estado.pres;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === estado[f];
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f]));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-cat]').forEach(el => { const id = el.dataset.cuentaCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-para]').forEach(el => { const id = el.dataset.cuentaPara; el.textContent = Tienda.contar({ ...filtrosDe('para'), ...(id ? { para: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-pres]').forEach(el => { const id = el.dataset.cuentaPres; el.textContent = Tienda.contar({ ...filtrosDe('pres'), ...(id ? { pres: id } : {}) }); });
    const activos = ['cat', 'para', 'pres', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const para = PARA[estado.para];
    const pres = PRESENTACIONES[estado.pres];
    const titulo = cat ? `${cat.nombre}${para ? ` · ${para.nombre}` : ''}` : para ? `Para ${para.nombre.toLowerCase()}` : pres ? `${pres}` : tituloBase;
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Alimento para mascotas, aves y animales de granja, accesorios y limpieza suelta. Por bolsa, por kilo o por litro.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !para && !pres; miga.textContent = titulo; }
    document.title = `${titulo} — Forrajería Gallardo`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'para', 'pres', 'precio', 'q', 'orden', 'stock', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.para) u.searchParams.set('para', estado.para);
    if (estado.pres) u.searchParams.set('pres', estado.pres);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
    const sp = new URLSearchParams(u.search); sp.delete('producto');
    document.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => { a.href = a.getAttribute('href').split('?')[0] + (sp.toString() ? `?${sp}` : ''); });
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (vista === 'lista' ? filaHTML(p) : cardHTML(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) { estado[b.dataset.filtro] = b.dataset.valor || ''; aplicar(); return; }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.para = ''; estado.pres = ''; estado.precio = ''; estado.stock = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (params.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn, .buscador-grande', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.sello, .hero__firma p, .buscador-sugeridos', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
  paso('.ficha', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  hero.querySelectorAll('.marco-rombo path').forEach((trazo, i) => {
    const largo = trazo.getTotalLength();
    gsap.fromTo(trazo, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.8 + i * 0.25, clearProps: 'strokeDasharray,strokeDashoffset' });
  });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-6 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initCuentas,
  initRail,
  initPreview,
  initListaHome,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initPedido,
  initFloats,
  initCalculadora,
  initMapa,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
