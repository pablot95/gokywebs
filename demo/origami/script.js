const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491165839849';
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
  { id: 'empanadas', nombre: 'Empanadas chinas', corto: 'Empanadas', bajada: 'Cerdo, pollo, carne y verdura', img: 'images/cat-empanadas.webp',
    texto: 'Al vapor o a la plancha, en cajas de 50 y de 100 unidades.' },
  { id: 'arrolladitos', nombre: 'Arrolladitos primavera', corto: 'Arrolladitos', bajada: 'Carne, pollo y verdura', img: 'images/cat-arrolladitos.webp',
    texto: 'Clásicos en bandejas de 30 y mini de copetín para fiestas, para freír u hornear.' },
  { id: 'jumbos', nombre: 'Jumbos', bajada: 'XL y normales', img: 'images/cat-jumbos.webp',
    texto: 'Arrollados grandes en cajas de 12 y de 20, para vender por unidad en el mostrador.' },
  { id: 'tequenos', nombre: 'Tequeños', bajada: 'Para fiestas y clásicos', img: 'images/cat-tequenos.webp',
    texto: 'De queso y de jamón y queso, en cajas de 24, 50 y 100 unidades.' },
  { id: 'masa-filo', nombre: 'Masa filo', bajada: 'Paquetes y cajas', img: 'images/cat-masa-filo.webp',
    texto: 'Hojas finas en paquetes de 500 g y de 1 kg, o en caja de 10 paquetes.' },
  { id: 'combos', nombre: 'Combos surtidos', corto: 'Combos', bajada: 'Varias líneas en una caja', img: 'images/cat-combos.webp',
    texto: 'Empanadas, arrolladitos, jumbos y tequeños combinados en un mismo pedido.' },
];
const RELLENOS = [
  { id: 'carne', nombre: 'Carne' }, { id: 'pollo', nombre: 'Pollo' }, { id: 'cerdo', nombre: 'Cerdo y verdeo' },
  { id: 'verdura', nombre: 'Verdura' }, { id: 'queso', nombre: 'Queso' }, { id: 'jamon-queso', nombre: 'Jamón y queso' },
  { id: 'surtido', nombre: 'Surtido' },
];
const TAMANOS = [
  { id: 'copetin', nombre: 'Copetín' }, { id: 'clasico', nombre: 'Clásico' },
  { id: 'jumbo', nombre: 'Jumbo' }, { id: 'jumbo-xl', nombre: 'Jumbo XL' },
];
const PRECIOS = [
  { id: 'hasta30', nombre: 'Hasta $30.000', min: null, max: 30000 },
  { id: '30a60', nombre: '$30.000 a $60.000', min: 30001, max: 60000 },
  { id: 'mas60', nombre: 'Más de $60.000', min: 60001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'unidad-asc', nombre: 'Menor precio por unidad' },
  { id: 'precio-asc', nombre: 'Menor precio por caja' }, { id: 'precio-desc', nombre: 'Mayor precio por caja' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS_CAT = {
  empanadas: 'empanada empanadas china chinas gyoza gyozas dumpling dumplings vapor plancha',
  arrolladitos: 'arrolladito arrolladitos arrollado arrollados rollito rollitos primavera spring roll',
  jumbos: 'jumbo jumbos arrollado arrollados grande grandes xl',
  tequenos: 'tequeno tequenos tequeño tequeños dedito deditos queso fiesta',
  'masa-filo': 'masa masas filo phyllo hojas hoja',
  combos: 'combo combos surtido surtidos caja mixta',
};

const COLECCION = [
  { id: 'emp-cerdo', sku: 'OR-101', nombre: 'Empanadas chinas de cerdo y verdeo', cat: 'empanadas', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 34500, descuento: 0, stock: 40, alta: 10, rango: 1, relleno: 'cerdo', tam: 'clasico', coccion: 'Al vapor o a la plancha',
    img: 'images/p-emp-cerdo.webp', escena: 'images/cat-empanadas.webp', alt: 'Empanadas chinas al vapor con verdeo en una vaporera de bambú',
    desc: 'Masa fina con repulgue y relleno de cerdo con verdeo. Se hacen al vapor o vuelta y vuelta en la plancha.' },
  { id: 'emp-pollo', sku: 'OR-102', nombre: 'Empanadas chinas de pollo', cat: 'empanadas', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 32900, descuento: 0, stock: 36, alta: 9, rango: 3, relleno: 'pollo', tam: 'clasico', coccion: 'A la plancha o al vapor',
    img: 'images/p-emp-pollo.webp', escena: 'images/cat-empanadas.webp', alt: 'Empanadas chinas doradas a la plancha con verdeo y sésamo',
    desc: 'Relleno de pollo con verdeo. Doradas de un lado en la plancha quedan crocantes abajo y tiernas arriba.' },
  { id: 'emp-carne', sku: 'OR-103', nombre: 'Empanadas chinas de carne', cat: 'empanadas', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 33900, descuento: 0, stock: 30, alta: 14, relleno: 'carne', tam: 'clasico', coccion: 'A la plancha o al vapor',
    img: 'images/p-emp-carne.webp', escena: 'images/cat-empanadas.webp', alt: 'Plato de empanadas chinas de carne doradas con verdeo',
    desc: 'Relleno de carne vacuna con verdeo. Sirven como entrada o como plato, con salsa de soja aparte.' },
  { id: 'emp-verdura', sku: 'OR-104', nombre: 'Empanadas chinas de verdura', cat: 'empanadas', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 29900, descuento: 0, stock: 24, alta: 20, relleno: 'verdura', tam: 'clasico', coccion: 'Al vapor o a la plancha',
    img: 'images/p-emp-verdura.webp', escena: 'images/hero-banner.webp', alt: 'Vaporera de bambú con empanadas chinas de verdura junto a un plato de arrolladitos',
    desc: 'Relleno de repollo, zanahoria y verdeo. La opción sin carne para sumar a la carta.' },
  { id: 'emp-cerdo-100', sku: 'OR-105', nombre: 'Empanadas chinas de cerdo, caja grande', cat: 'empanadas', pres: 'Caja x 100', unidades: 100, unidad: 'u.',
    precio: 66000, descuento: 0, stock: 12, alta: 3, relleno: 'cerdo', tam: 'clasico', coccion: 'Al vapor o a la plancha',
    img: 'images/p-emp-cerdo-100.webp', escena: 'images/promo-vertical.webp', alt: 'Vaporera llena de empanadas chinas de cerdo junto a empanadas a la plancha',
    desc: 'Las mismas empanadas de cerdo y verdeo, en caja de 100 para cocinas con mucha salida.' },

  { id: 'arr-carne', sku: 'OR-201', nombre: 'Arrolladitos primavera de carne', cat: 'arrolladitos', pres: 'Bandeja x 30', unidades: 30, unidad: 'u.',
    precio: 27900, descuento: 0, stock: 50, alta: 12, rango: 2, relleno: 'carne', tam: 'clasico', coccion: 'Fritura u horno',
    img: 'images/p-arr-carne.webp', escena: 'images/cat-arrolladitos.webp', alt: 'Arrolladito primavera de carne cortado al medio con el relleno a la vista',
    desc: 'Masa crocante con relleno de carne, zanahoria y arvejas. Se fríen o se hornean sin descongelar del todo.' },
  { id: 'arr-pollo', sku: 'OR-202', nombre: 'Arrolladitos primavera de pollo', cat: 'arrolladitos', pres: 'Bandeja x 30', unidades: 30, unidad: 'u.',
    precio: 27900, descuento: 0, stock: 44, alta: 8, rango: 6, relleno: 'pollo', tam: 'clasico', coccion: 'Fritura u horno',
    img: 'images/p-arr-pollo.webp', escena: 'images/cat-arrolladitos.webp', alt: 'Arrolladito primavera de pollo cortado con pollo desmenuzado y verduras',
    desc: 'Pollo desmenuzado con zanahoria y arvejas. Van bien con salsa agridulce.' },
  { id: 'arr-verdura', sku: 'OR-203', nombre: 'Arrolladitos primavera de verdura', cat: 'arrolladitos', pres: 'Bandeja x 30', unidades: 30, unidad: 'u.',
    precio: 24900, descuento: 0, stock: 38, alta: 16, relleno: 'verdura', tam: 'clasico', coccion: 'Fritura u horno',
    img: 'images/p-arr-verdura.webp', escena: 'images/cat-arrolladitos.webp', alt: 'Arrolladito primavera de verdura con repollo, zanahoria y arvejas',
    desc: 'Repollo, zanahoria, arvejas y hongos. El arrolladito sin carne de la carta.' },
  { id: 'arr-copetin', sku: 'OR-204', nombre: 'Mini arrolladitos de copetín surtidos', cat: 'arrolladitos', pres: 'Caja x 100', unidades: 100, unidad: 'u.',
    precio: 52000, descuento: 0, stock: 20, alta: 15, rango: 5, relleno: 'surtido', tam: 'copetin', coccion: 'Fritura u horno',
    img: 'images/p-arr-copetin.webp', escena: 'images/promo-fiestas.webp', alt: 'Plato de mini arrolladitos primavera para copetín con salsa de soja',
    desc: 'Arrolladitos de un bocado de carne, pollo y verdura, mezclados en la caja. Para fiestas, catering y eventos.' },
  { id: 'arr-surtido', sku: 'OR-205', nombre: 'Arrolladitos primavera surtidos', cat: 'arrolladitos', pres: 'Caja x 60', unidades: 60, unidad: 'u.',
    precio: 53000, descuento: 0, stock: 18, alta: 4, relleno: 'surtido', tam: 'clasico', coccion: 'Fritura u horno',
    img: 'images/p-arr-surtido.webp', escena: 'images/cat-arrolladitos.webp', alt: 'Arrolladitos primavera surtidos cortados junto a un bol de salsa',
    desc: 'Veinte de carne, veinte de pollo y veinte de verdura en la misma caja.' },

  { id: 'jumbo-xl-carne', sku: 'OR-301', nombre: 'Jumbo XL de carne', cat: 'jumbos', pres: 'Caja x 12', unidades: 12, unidad: 'u.',
    precio: 26400, descuento: 0, stock: 26, alta: 11, rango: 4, relleno: 'carne', tam: 'jumbo-xl', coccion: 'Fritura u horno',
    img: 'images/p-jumbo-xl-carne.webp', escena: 'images/cat-jumbos.webp', alt: 'Arrollados jumbo XL dorados en un plato con zanahoria rallada',
    desc: 'El arrollado más grande de la casa, con relleno de carne y verduras. Uno solo ya es una porción.' },
  { id: 'jumbo-xl-pollo', sku: 'OR-302', nombre: 'Jumbo XL de pollo', cat: 'jumbos', pres: 'Caja x 12', unidades: 12, unidad: 'u.',
    precio: 26400, descuento: 0, stock: 22, alta: 19, relleno: 'pollo', tam: 'jumbo-xl', coccion: 'Fritura u horno',
    img: 'images/p-jumbo-xl-pollo.webp', escena: 'images/cat-jumbos.webp', alt: 'Arrollados jumbo XL de pollo con uno cortado y salsa picante',
    desc: 'Tamaño XL con relleno de pollo y verduras. Para vender por unidad en rotiserías y bares.' },
  { id: 'jumbo-carne', sku: 'OR-303', nombre: 'Jumbo de carne', cat: 'jumbos', pres: 'Caja x 20', unidades: 20, unidad: 'u.',
    precio: 31000, descuento: 0, stock: 16, alta: 2, relleno: 'carne', tam: 'jumbo', coccion: 'Fritura u horno',
    img: 'images/p-jumbo-carne.webp', escena: 'images/hero-banner.webp', alt: 'Arrollados jumbo de carne cortados con salsa al costado',
    desc: 'Jumbo de tamaño normal, entre el arrolladito clásico y el XL. Relleno de carne y verduras.' },
  { id: 'jumbo-verdura', sku: 'OR-304', nombre: 'Jumbo de verdura', cat: 'jumbos', pres: 'Caja x 20', unidades: 20, unidad: 'u.',
    precio: 27500, descuento: 0, stock: 3, alta: 1, relleno: 'verdura', tam: 'jumbo', coccion: 'Fritura u horno',
    img: 'images/p-jumbo-verdura.webp', escena: 'images/promo-vertical.webp', alt: 'Arrollados jumbo de verdura en un plato con salsa de soja',
    desc: 'Jumbo normal con relleno de repollo, zanahoria y verdeo.' },

  { id: 'teq-fiesta', sku: 'OR-401', nombre: 'Tequeños de queso para fiestas', cat: 'tequenos', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 29500, descuento: 0, stock: 34, alta: 13, rango: 7, relleno: 'queso', tam: 'copetin', coccion: 'Fritura u horno',
    img: 'images/p-teq-fiesta.webp', escena: 'images/cat-tequenos.webp', alt: 'Tequeños de queso dorados con el queso estirándose al cortarlos',
    desc: 'Bastones de masa con queso que se estira. Tamaño copetín, pensados para fiestas y catering.' },
  { id: 'teq-clasico', sku: 'OR-402', nombre: 'Tequeños de queso clásicos', cat: 'tequenos', pres: 'Bandeja x 24', unidades: 24, unidad: 'u.',
    precio: 21600, descuento: 0, stock: 28, alta: 13, relleno: 'queso', tam: 'clasico', coccion: 'Fritura u horno',
    img: 'images/p-teq-clasico.webp', escena: 'images/cat-tequenos.webp', alt: 'Plato de tequeños clásicos con salsa de tomate',
    desc: 'El tequeño de tamaño clásico, para servir de a tres o cuatro por porción.' },
  { id: 'teq-jyq', sku: 'OR-403', nombre: 'Tequeños de jamón y queso', cat: 'tequenos', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 31500, descuento: 0, stock: 20, alta: 18, relleno: 'jamon-queso', tam: 'copetin', coccion: 'Fritura u horno',
    img: 'images/p-teq-jyq.webp', escena: 'images/cat-tequenos.webp', alt: 'Tequeños de jamón y queso apilados en un plato',
    desc: 'Relleno de jamón cocido y queso. Tamaño copetín.' },
  { id: 'teq-cien', sku: 'OR-404', nombre: 'Tequeños de queso, caja grande', cat: 'tequenos', pres: 'Caja x 100', unidades: 100, unidad: 'u.',
    precio: 56000, descuento: 0, stock: 14, alta: 3, relleno: 'queso', tam: 'copetin', coccion: 'Fritura u horno',
    img: 'images/p-teq-cien.webp', escena: 'images/promo-vertical.webp', alt: 'Tequeños de queso con uno abierto y el queso estirado',
    desc: 'Tequeños de queso de copetín en caja de 100, para eventos grandes.' },

  { id: 'filo-500', sku: 'OR-501', nombre: 'Masa filo 500 g', cat: 'masa-filo', pres: 'Paquete de 500 g', unidades: 1, unidad: 'paquete',
    precio: 6900, descuento: 0, stock: 60, alta: 17, coccion: 'Horno',
    img: 'images/p-filo-500.webp', escena: 'images/cat-masa-filo.webp', alt: 'Pila de hojas de masa filo sobre un repasador de lino',
    desc: 'Hojas finas para strudel, baklava, empanaditas y tartas. Se pincelan con manteca o aceite antes del horno.' },
  { id: 'filo-1kg', sku: 'OR-502', nombre: 'Masa filo 1 kg', cat: 'masa-filo', pres: 'Paquete de 1 kg', unidades: 1, unidad: 'paquete',
    precio: 12900, descuento: 0, stock: 40, alta: 5, rango: 8, coccion: 'Horno',
    img: 'images/p-filo-1kg.webp', escena: 'images/cat-masa-filo.webp', alt: 'Hojas de masa filo apiladas sobre una tabla de madera',
    desc: 'El paquete de 1 kg para cocinas que trabajan masa filo todos los días.' },
  { id: 'filo-caja', sku: 'OR-503', nombre: 'Masa filo en caja', cat: 'masa-filo', pres: 'Caja x 10 paquetes de 500 g', unidades: 10, unidad: 'paquete',
    precio: 64000, descuento: 0, stock: 15, alta: 2, coccion: 'Horno',
    img: 'images/p-filo-caja.webp', escena: 'images/promo-filo.webp', alt: 'Hojas de masa filo apiladas junto a platos de arrolladitos',
    desc: 'Diez paquetes de 500 g en una caja, para panaderías, rotiserías y casas de comida.' },

  { id: 'combo-copetin', sku: 'OR-601', nombre: 'Combo copetín', cat: 'combos', pres: 'Caja x 150', unidades: 150, unidad: 'u.',
    precio: 86000, descuento: 0, stock: 10, alta: 15, relleno: 'surtido', tam: 'copetin', coccion: 'Vapor, plancha, fritura u horno',
    img: 'images/p-combo-copetin.webp', escena: 'images/hero-banner.webp', alt: 'Mesa con vaporera de empanadas chinas, arrolladitos y tequeños',
    desc: 'Cincuenta empanadas chinas de cerdo, cincuenta mini arrolladitos y cincuenta tequeños de queso para fiestas.' },
  { id: 'combo-rotiseria', sku: 'OR-602', nombre: 'Combo rotisería', cat: 'combos', pres: 'Caja x 42', unidades: 42, unidad: 'u.',
    precio: 52000, descuento: 0, stock: 12, alta: 9, relleno: 'surtido', coccion: 'Fritura u horno',
    img: 'images/p-combo-rotiseria.webp', escena: 'images/hero-banner.webp', alt: 'Arrolladitos, tequeños y masa filo sobre una mesada clara',
    desc: 'Doce jumbos XL de carne y treinta arrolladitos primavera de pollo: lo que más se vende por unidad en una rotisería.' },
  { id: 'combo-fiesta', sku: 'OR-603', nombre: 'Combo fiesta', cat: 'combos', pres: 'Caja x 200', unidades: 200, unidad: 'u.',
    precio: 98000, descuento: 0, stock: 2, alta: 12, relleno: 'surtido', tam: 'copetin', coccion: 'Fritura u horno',
    img: 'images/p-combo-fiesta.webp', escena: 'images/promo-vertical.webp', alt: 'Platos de empanadas chinas, arrolladitos y tequeños con salsas',
    desc: 'Cien tequeños de queso y cien mini arrolladitos surtidos, para un evento de punta a punta.' },

  { id: 'emp-langostino', sku: 'OR-106', nombre: 'Empanadas chinas de langostino', cat: 'empanadas', pres: 'Caja x 50', unidades: 50, unidad: 'u.',
    precio: 41000, descuento: 0, stock: 0, alta: 17, relleno: 'surtido', tam: 'clasico', coccion: 'Al vapor', visible: false,
    img: 'images/p-emp-cerdo.webp', escena: 'images/cat-empanadas.webp', alt: 'Empanadas chinas al vapor', desc: 'Próximo ingreso.' },
];

function crearTienda(coleccion, { tope = 100, extra = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.sku, p.cat, p.pres, p.relleno, p.tam, p.coccion, p.desc, extra(p),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const porUnidad = p => final(p) / (p.unidades || 1);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), relleno = lista(f.relleno), tam = lista(f.tam), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (relleno.length && !relleno.includes(p.relleno)) return false;
    if (tam.length && !tam.includes(p.tam)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'unidad-asc': return (a, b) => porUnidad(a) - porUnidad(b) || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
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
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const Tienda = crearTienda(COLECCION, { tope: 100, extra: p => ETIQUETAS_CAT[p.cat] || '' });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioUnidad = p => `${formatearPrecio(precioFinal(p) / (p.unidades || 1))} ${p.unidad === 'paquete' ? 'por paquete' : 'c/u'}`;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'origami_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  unidades() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && p.unidad === 'u.' ? s + p.unidades * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  caja: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  const r = nombreDe(RELLENOS, p.relleno);
  const t = nombreDe(TAMANOS, p.tam);
  return [r, t].filter(Boolean).join(' · ') || nombreDe(CATEGORIAS, p.cat);
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span class="precio__unidad">${precioUnidad(p)}</span></p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 3) b.push('<span class="badge">Últimas cajas</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar una caja"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar una caja"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p, { compacta = false } = {}) {
  const nombre = esc(p.nombre);
  return `<article class="prod${compacta ? ' prod--compacta' : ''}">
    <a class="prod__foto pliegue" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">${badgesHTML(p)}<span class="prod__pres">${esc(p.pres)}</span></a>
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod__acciones">${compacta ? '' : stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      ${compacta ? '' : `<button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function enPedido(id) { return Cart.get().find(i => i.id === id)?.qty || 0; }
function filaHTML(p) {
  const nombre = esc(p.nombre);
  const n = enPedido(p.id);
  return `<article class="fila">
    <a class="fila__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>
    <div class="fila__info">
      <p class="fila__sku">${esc(p.sku)} · ${esc(p.pres)}</p>
      <h3 class="fila__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p class="fila__meta">${esc(metaDe(p))}${p.stock <= 3 ? ' · <strong>Últimas cajas</strong>' : ''}</p>
      <p class="fila__en" data-en-pedido="${p.id}"${n ? '' : ' hidden'}>En el pedido: <strong>${n}</strong> ${n === 1 ? 'caja' : 'cajas'}</p>
    </div>
    <div class="fila__precio"><span class="fila__caja">${formatearPrecio(precioFinal(p))}</span><span class="fila__unidad">${precioUnidad(p)}</span></div>
    <div class="fila__accion prod__acciones">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Sumar al pedido: ${nombre}"><span class="lbl-long">Sumar al pedido</span><span class="lbl-short">Sumar</span>${ICON.caja}</button></div>
  </article>`;
}
function syncEnPedido() {
  document.querySelectorAll('[data-en-pedido]').forEach(el => {
    const n = enPedido(el.dataset.enPedido);
    el.hidden = !n;
    el.innerHTML = `En el pedido: <strong>${n}</strong> ${n === 1 ? 'caja' : 'cajas'}`;
  });
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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1101px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = CATEGORIAS.map(c => `
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="48" height="48" decoding="async">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
      </a>`).join('')
      + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initHeroSlider() {
  const banner = document.querySelector('[data-slider]');
  if (!banner) return;
  const slides = [...banner.querySelectorAll('[data-slide]')];
  const dots = [...banner.querySelectorAll('.hero1__dot')];
  const dotsWrap = banner.querySelector('.hero1__dots');
  if (slides.length < 2) return;
  let i = 0;
  const ir = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-activa', on);
      if (on) { s.removeAttribute('aria-hidden'); s.removeAttribute('inert'); }
      else { s.setAttribute('aria-hidden', 'true'); s.setAttribute('inert', ''); }
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  };
  dots.forEach((d, k) => {
    d.addEventListener('click', () => ir(k));
    d.querySelector('span')?.addEventListener('animationend', () => { if (k === i) ir(i + 1); });
  });
  const pausar = v => dotsWrap?.classList.toggle('is-pausado', v);
  banner.addEventListener('mouseenter', () => pausar(true));
  banner.addEventListener('mouseleave', () => pausar(false));
  banner.addEventListener('focusin', () => pausar(true));
  banner.addEventListener('focusout', e => { if (!banner.contains(e.relatedTarget)) pausar(false); });
  document.addEventListener('visibilitychange', () => pausar(document.hidden));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const activa = hero.querySelector('.hero1__slide.is-activa') || hero;
  tl.from(activa.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(activa.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(activa.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(activa.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero1__side, .hero1__dots, .hero2__dato, .hero-badge'), { y: 20, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (moved) requestAnimationFrame(() => vp.classList.remove('dragging'));
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  vp.addEventListener('transitionend', sync);
  sync();
}

function initHome() {
  if (PAGINA !== 'home') return;
  const rail = document.getElementById('railDestacados');
  if (rail) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  const grilla = document.getElementById('grillaPedido');
  if (grilla) {
    const items = Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
    grilla.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  initListaHome();
}

function initListaHome() {
  const tabs = document.getElementById('listaTabs');
  const lista = document.getElementById('listaFilas');
  const pie = document.getElementById('listaPie');
  if (!tabs || !lista) return;
  const opciones = [{ id: '', nombre: 'Elegidos', img: 'images/hero-banner.webp', n: Tienda.contar({ destacado: true }) },
    ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.corto || c.nombre, img: c.img, n: Tienda.contar({ cat: c.id }) }))];
  tabs.innerHTML = opciones.map((o, k) => `<button type="button" class="tab" role="tab" id="tab-${o.id || 'elegidos'}" aria-controls="listaPanel" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}" data-tab="${o.id}"><img src="${o.img}" alt="" width="40" height="40"><span>${esc(o.nombre)}</span><small>${o.n}</small></button>`).join('');
  const pintar = (cat, animar) => {
    const filtros = cat ? { cat } : { destacado: true };
    const res = Tienda.consultar({ filtros, orden: 'destacados', limite: 8 });
    const total = Tienda.contar(filtros);
    document.getElementById('listaPanel')?.setAttribute('aria-labelledby', `tab-${cat || 'elegidos'}`);
    lista.innerHTML = res.items.map(p => `<li${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : ' data-animate="subir" style="opacity:0;transform:translateY(40px)"'}>${filaHTML(p)}</li>`).join('');
    if (pie) {
      const c = CATEGORIAS.find(x => x.id === cat);
      pie.innerHTML = c
        ? `<a class="link-flecha" href="${CATALOGO_URL}?cat=${c.id}">Ver ${total === 1 ? 'el producto' : `los ${total} productos`} de ${esc(c.nombre.toLowerCase())} ${ICON.flecha}</a>`
        : `<a class="link-flecha" href="${CATALOGO_URL}">Ver la lista completa: ${Tienda.contar({})} productos ${ICON.flecha}</a>`;
    }
    if (animar) revelarNuevos(lista);
    refrescarTriggers();
  };
  pintar('', false);
  const botones = () => [...tabs.querySelectorAll('[data-tab]')];
  const elegir = b => {
    botones().forEach(x => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    pintar(b.dataset.tab, true);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) elegir(b); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const bs = botones(); const i = bs.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault();
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
    bs[j].focus(); elegir(bs[j]);
  });
}

function renderPedido() {
  document.querySelectorAll('[data-pedido]').forEach(panel => {
    const cuerpo = panel.querySelector('[data-pedido-lineas]');
    const pie = panel.querySelector('[data-pedido-pie]');
    if (!cuerpo || !pie) return;
    const lineas = Cart.get().filter(i => getProducto(i.id));
    if (!lineas.length) {
      cuerpo.innerHTML = '<p class="pedido-vacio">Todavía no sumaste productos. Elegí cuántas cajas querés en la lista y aparecen acá.</p>';
      pie.hidden = true;
      return;
    }
    cuerpo.innerHTML = `<ul>${lineas.map(i => {
      const p = getProducto(i.id);
      return `<li class="pl" data-linea="${p.id}">
        <div><p class="pl__nombre">${esc(p.nombre)}</p><p class="pl__meta">${esc(p.pres)} · ${formatearPrecio(precioFinal(p))}</p></div>
        ${stepperHTML(p.stock, i.qty)}
        <span class="pl__sub">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <button type="button" class="pl__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del pedido">${ICON.cerrar}</button>
      </li>`;
    }).join('')}</ul>`;
    pie.hidden = false;
    const cajas = Cart.count();
    const u = Cart.unidades();
    pie.querySelector('[data-pedido-cajas]').textContent = `${cajas} ${cajas === 1 ? 'caja' : 'cajas'}${u ? ` · ${u.toLocaleString('es-AR')} unidades` : ''}`;
    pie.querySelector('[data-pedido-total]').textContent = formatearPrecio(Cart.total());
    const wsp = pie.querySelector('[data-pedido-wsp]');
    if (wsp) wsp.href = wspHref(textoPedido(lineas));
  });
}
function textoPedido(lineas) {
  return ['Hola Origami! Quiero hacer este pedido mayorista:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${p.pres}): ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
}
function initPedido() {
  const paneles = document.querySelectorAll('[data-pedido]');
  if (!paneles.length) return;
  paneles.forEach(panel => {
    panel.addEventListener('click', e => {
      if (e.target.closest('[data-pedido-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
      const linea = e.target.closest('[data-linea]');
      if (!linea) return;
      const id = linea.dataset.linea;
      const it = Cart.get().find(i => i.id === id);
      if (e.target.closest('[data-quitar]')) { Cart.remove(id); return; }
      if (it && e.target.closest('[data-mas]')) Cart.setQty(id, it.qty + 1);
      if (it && e.target.closest('[data-menos]')) Cart.setQty(id, it.qty - 1);
    });
  });
  renderPedido();
}

const QV = { p: null, foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `Mesa con ${cat?.nombre.toLowerCase() || 'productos'} de Origami` }];
  const msg = `Hola Origami! Quiero consultar por ${p.nombre} (${p.pres}).`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto de la mesa' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')} · ${esc(p.sku)}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="ficha">
          <div><dt>Presentación</dt><dd>${esc(p.pres)}</dd></div>
          ${p.relleno ? `<div><dt>Relleno</dt><dd>${esc(nombreDe(RELLENOS, p.relleno))}</dd></div>` : ''}
          ${p.tam ? `<div><dt>Tamaño</dt><dd>${esc(nombreDe(TAMANOS, p.tam))}</dd></div>` : ''}
          <div><dt>Cocción</dt><dd>${esc(p.coccion)}</dd></div>
          <div><dt>Disponibles</dt><dd>${p.stock} ${p.stock === 1 ? 'caja' : 'cajas'}</dd></div>
        </dl>
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="800" height="800"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.sku, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.foto = 0;
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
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${qty} ${qty === 1 ? 'caja' : 'cajas'} de ${p.nombre}.`);
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
  return `<li class="linea" data-linea="${p.id}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(p.pres)} · ${formatearPrecio(precioFinal(p))} la caja</p>
      ${stepperHTML(p.stock, i.qty)}
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
    items.innerHTML = `<div class="drawer__vacio"><img src="images/cat-empanadas.webp" alt="" width="900" height="900"><p>Tu carrito está vacío. Arrancá por las empanadas chinas o los arrolladitos.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const u = Cart.unidades();
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const resumen = document.getElementById('cartResumen');
  if (resumen) resumen.textContent = `${Cart.count()} ${Cart.count() === 1 ? 'caja' : 'cajas'}${u ? ` · ${u.toLocaleString('es-AR')} unidades` : ''}`;
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas));
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
    const id = linea.dataset.linea;
    const it = Cart.get().find(i => i.id === id);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, it.qty - 1);
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
  document.querySelectorAll('[data-cart-total]').forEach(t => { t.textContent = formatearPrecio(Cart.total()); });
}
function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const panel = document.querySelector('[data-pedido]');
  const mqPanel = window.matchMedia('(min-width: 1025px)');
  let panelVisible = false;
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', (scrolled || Cart.count() > 0) && !(panelVisible && mqPanel.matches));
  };
  if (panel && 'IntersectionObserver' in window) new IntersectionObserver(es => { panelVisible = es[0].isIntersecting; sync(); }).observe(panel);
  mqPanel.addEventListener('change', sync);
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const acciones = add.closest('.prod__acciones');
      const stepper = acciones?.querySelector('[data-stepper]');
      const qty = Number(stepper?.querySelector('output')?.textContent) || 1;
      Cart.add(p, qty);
      showToast(`Sumaste ${qty} ${qty === 1 ? 'caja' : 'cajas'} de ${p.nombre}.`);
      if (stepper) { stepper.querySelector('output').textContent = 1; stepper.querySelector('[data-menos]').disabled = true; stepper.querySelector('[data-mas]').disabled = p.stock <= 1; }
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty);
      abrirCarrito();
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
  const comoLista = grid.dataset.vista === 'lista';
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => x.id === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS),
    relleno: multi('relleno', RELLENOS), tam: multi('tam', TAMANOS),
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  const compatibles = () => { if (e.cat === 'masa-filo') { e.relleno = []; e.tam = []; } };
  compatibles();

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
    if (e.relleno.length) f.relleno = e.relleno;
    if (e.tam.length) f.tam = e.tam;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${nombre.replace(/-.*$/, '')}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}))}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }))).join('')}</fieldset>`);
    if (e.cat !== 'masa-filo') {
      const rell = RELLENOS.map(r => [r, Tienda.contar({ ...base, relleno: r.id })]).filter(([r, n]) => n || e.relleno.includes(r.id));
      grupos.push(`<fieldset class="f-grupo"><legend>Relleno</legend>
        ${rell.map(([r, n]) => opcion('checkbox', `relleno-${r.id}`, r.id, r.nombre, e.relleno.includes(r.id), n)).join('')}</fieldset>`);
      const tams = TAMANOS.map(t => [t, Tienda.contar({ ...base, tam: t.id })]).filter(([t, n]) => n || e.tam.includes(t.id));
      grupos.push(`<fieldset class="f-grupo"><legend>Tamaño</legend><div class="f-tams">
        ${tams.map(([t, n]) => `<label class="f-tam"><input type="checkbox" name="tam-${t.id}" value="${t.id}" data-f="tam"${e.tam.includes(t.id) ? ' checked' : ''}><span>${t.nombre} <small>${n}</small></span></label>`).join('')}</div></fieldset>`);
    }
    grupos.push(`<fieldset class="f-grupo"><legend>Precio por caja</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio)}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const titulo = cat ? cat.nombre : 'Catálogo mayorista';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Empanadas chinas, arrolladitos primavera, jumbos, tequeños y masa filo, con el precio por caja y por unidad.';
    document.title = `${titulo} — Origami`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="28" height="28">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.relleno.forEach(v => quitar.push(['relleno', v, `Relleno: ${nombreDe(RELLENOS, v)}`]));
    e.tam.forEach(v => quitar.push(['tam', v, nombreDe(TAMANOS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'relleno', 'tam', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.relleno.length) u.searchParams.set('relleno', e.relleno.join(','));
    if (e.tam.length) u.searchParams.set('tam', e.tam.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  const pieza = p => (comoLista ? filaHTML(p) : cardHTML(p));
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${pieza(p)}</li>`).join(''));
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
    compatibles();
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
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.relleno = []; e.tam = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.querySelectorAll('.cats-item, .cats-todo').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.relleno = []; e.tam = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));

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
document.addEventListener('cart:updated', renderPedido);
document.addEventListener('cart:updated', syncEnPedido);

initCatsMenu();
initHome();
initCatalogo();
initReveals();
initNav();
initHeroSlider();
initHeroMotion();
initLeeScroll();
initRail();
initQV();
initCarrito();
initPedido();
initAcciones();
initFloats();
initModelBarScroll();
syncModelosLink();
updateCartBadge();
