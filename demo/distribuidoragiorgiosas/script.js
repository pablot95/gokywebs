const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491150221948';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const INICIO_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'alimentos', nombre: 'Alimentos', zh: '食品', img: 'images/escena-fideos.webp',
    alt: 'Bolsas de fideos penne y de legumbres apiladas sobre pallets en el depósito',
    bajada: 'Arroz, legumbres, fideos, aceite, salsa de soja y conservas.',
    subs: [
      { id: 'arroz-legumbres', nombre: 'Arroz y legumbres', zh: '大米豆类' },
      { id: 'fideos', nombre: 'Fideos', zh: '面条' },
      { id: 'aceites-salsas', nombre: 'Aceites y salsas', zh: '食用油酱料' },
      { id: 'conservas', nombre: 'Conservas y azúcar', zh: '罐头白糖' },
    ] },
  { id: 'bebidas', nombre: 'Bebidas', zh: '饮料', img: 'images/escena-bebidas.webp',
    alt: 'Packs de gaseosas cola, naranja, pomelo y lima envueltos en film sobre pallets',
    bajada: 'Gaseosas de 1,5 y 2,25 L y agua mineral, en packs de 6.',
    subs: [
      { id: 'gaseosas', nombre: 'Gaseosas', zh: '汽水' },
      { id: 'aguas', nombre: 'Aguas', zh: '矿泉水' },
    ] },
  { id: 'higiene', nombre: 'Higiene y limpieza', corto: 'Higiene', zh: '日化清洁', img: 'images/escena-higiene.webp',
    alt: 'Jabones en pan, jabón líquido, shampoo y toallitas húmedas sobre cajas de cartón',
    bajada: 'Jabones, shampoo, gel de ducha, toallitas y suavizante.',
    subs: [
      { id: 'personal', nombre: 'Cuidado personal', zh: '个人护理' },
      { id: 'ropa', nombre: 'Lavado de ropa', zh: '洗衣用品' },
    ] },
  { id: 'vino', nombre: 'Vino frutado Bodega Bermejo', corto: 'Vino frutado', zh: '果味葡萄酒', img: 'images/escena-vino.webp',
    alt: 'Cajas abiertas con botellas de vino frutado de cápsula dorada',
    bajada: 'Distribución exclusiva: cajas por sabor y caja surtida.',
    subs: [
      { id: 'por-sabor', nombre: 'Cajas por sabor', zh: '单一口味' },
      { id: 'surtida', nombre: 'Caja surtida', zh: '混合装' },
    ] },
];
const TIPOS = [
  { id: 'fardo', nombre: 'Fardo' }, { id: 'pack', nombre: 'Pack' },
  { id: 'caja', nombre: 'Caja' }, { id: 'bolsa', nombre: 'Bolsa' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: null, max: 15000 },
  { id: '15a25', nombre: '$15.000 a $25.000', min: 15001, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' }, { id: 'unidad-asc', nombre: 'Menor precio por unidad' },
  { id: 'precio-asc', nombre: 'Menor precio por bulto' }, { id: 'precio-desc', nombre: 'Mayor precio por bulto' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];

const COLECCION = [
  { id: 'arroz-largo-fino', sku: 'GS-101', nombre: 'Arroz largo fino 1 kg', zh: '长粒米 1公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 17900, descuento: 0, stock: 120, rango: 1,
    img: 'images/p-arroz.webp', alt: 'Paquete transparente de arroz largo fino',
    desc: 'Arroz blanco largo fino en paquetes de 1 kg. El fardo trae 10 paquetes listos para la góndola.' },
  { id: 'lentejas', sku: 'GS-102', nombre: 'Lentejas 1 kg', zh: '小扁豆 1公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 27500, descuento: 0, stock: 46, semana: 1,
    img: 'images/p-lentejas.webp', alt: 'Bolsa transparente de lentejas secas',
    desc: 'Lentejas secas en bolsa transparente de 1 kg, para guisos y ensaladas. Fardo de 10 bolsas.' },
  { id: 'garbanzos', sku: 'GS-103', nombre: 'Garbanzos 1 kg', zh: '鹰嘴豆 1公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 29900, descuento: 0, stock: 38,
    img: 'images/p-garbanzos.webp', alt: 'Bolsa transparente de garbanzos secos',
    desc: 'Garbanzos secos de grano parejo en bolsas de 1 kg. Fardo de 10 bolsas.' },
  { id: 'porotos-negros', sku: 'GS-104', nombre: 'Porotos negros 1 kg', zh: '黑豆 1公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 26900, descuento: 0, stock: 30,
    img: 'images/p-porotos-negros.webp', alt: 'Bolsa de porotos negros junto a una de arroz',
    desc: 'Porotos negros secos en bolsas de 1 kg. Fardo de 10 bolsas.' },
  { id: 'porotos-colorados', sku: 'GS-105', nombre: 'Porotos colorados 1 kg', zh: '红芸豆 1公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 28400, descuento: 0, stock: 26,
    img: 'images/p-porotos-rojos.webp', alt: 'Bolsa transparente de porotos colorados',
    desc: 'Porotos colorados secos en bolsas de 1 kg. Fardo de 10 bolsas.' },
  { id: 'porotos-alubia', sku: 'GS-106', nombre: 'Porotos alubia 5 kg', zh: '白芸豆 5公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'bolsa', pres: 'Bolsa de 5 kg', unidades: 5, unidad: 'kg', precio: 19500, descuento: 0, stock: 18,
    img: 'images/p-alubia.webp', alt: 'Bolsas de porotos alubia apiladas en un pallet',
    desc: 'Porotos alubia en bolsa de 5 kg para fraccionar o vender suelto.' },
  { id: 'arvejas-partidas', sku: 'GS-107', nombre: 'Arvejas partidas 5 kg', zh: '干豌豆瓣 5公斤', cat: 'alimentos', sub: 'arroz-legumbres',
    tipo: 'bolsa', pres: 'Bolsa de 5 kg', unidades: 5, unidad: 'kg', precio: 12900, descuento: 0, stock: 7,
    img: 'images/p-arvejas.webp', alt: 'Bolsas de arvejas partidas verdes apiladas',
    desc: 'Arvejas partidas secas en bolsa de 5 kg, para sopas y guisos.' },
  { id: 'fideos-penne-5kg', sku: 'GS-111', nombre: 'Fideos penne rigate 5 kg', zh: '笔管面 5公斤', cat: 'alimentos', sub: 'fideos',
    tipo: 'bolsa', pres: 'Bolsa de 5 kg', unidades: 5, unidad: 'kg', precio: 13500, descuento: 0, stock: 64, rango: 8,
    img: 'images/p-penne.webp', alt: 'Bolsas grandes de fideos penne apiladas sobre un pallet',
    desc: 'Fideos secos tipo penne rigate en bolsa de 5 kg, para fraccionar o para la rotisería del súper.' },
  { id: 'fideos-500', sku: 'GS-112', nombre: 'Fideos secos 500 g', zh: '意大利面 500克', cat: 'alimentos', sub: 'fideos',
    tipo: 'fardo', pres: 'Fardo x 20', unidades: 20, unidad: 'u', precio: 18900, descuento: 0, stock: 52,
    img: 'images/p-fideos-paquete.webp', alt: 'Paquetes de fideos secos apilados en una estantería',
    desc: 'Fideos secos en paquetes de 500 g. Fardo de 20 paquetes.' },
  { id: 'fideos-huevo', sku: 'GS-113', nombre: 'Fideos al huevo 500 g', zh: '鸡蛋面 500克', cat: 'alimentos', sub: 'fideos',
    tipo: 'fardo', pres: 'Fardo x 20', unidades: 20, unidad: 'u', precio: 21900, descuento: 0, stock: 34, semana: 3,
    img: 'images/p-fideos-huevo.webp', alt: 'Paquetes de fideos al huevo en nidos',
    desc: 'Fideos al huevo en nidos, en paquetes de 500 g. Fardo de 20 paquetes.' },
  { id: 'aceite-girasol', sku: 'GS-121', nombre: 'Aceite de girasol 1,5 L', zh: '葵花籽油 1.5升', cat: 'alimentos', sub: 'aceites-salsas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 21600, descuento: 0, stock: 58, rango: 3,
    img: 'images/p-aceite.webp', alt: 'Botellas de aceite de girasol de 1,5 litros',
    desc: 'Aceite de girasol en botella de 1,5 L. Pack de 6 botellas.' },
  { id: 'salsa-soja', sku: 'GS-122', nombre: 'Salsa de soja 500 ml', zh: '酱油 500毫升', cat: 'alimentos', sub: 'aceites-salsas',
    tipo: 'caja', pres: 'Caja x 12', unidades: 12, unidad: 'u', precio: 22800, descuento: 0, stock: 40, rango: 4,
    img: 'images/p-soja.webp', alt: 'Botellas de salsa de soja con tapa roja',
    desc: 'Salsa de soja en botella de 500 ml con tapa a rosca. Caja de 12 botellas.' },
  { id: 'arvejas-lata', sku: 'GS-131', nombre: 'Arvejas en lata 300 g', zh: '豌豆罐头 300克', cat: 'alimentos', sub: 'conservas',
    tipo: 'caja', pres: 'Caja x 24', unidades: 24, unidad: 'u', precio: 21600, descuento: 0, stock: 44, semana: 8,
    img: 'images/p-latas.webp', alt: 'Latas de conserva alineadas sobre una mesa del depósito',
    desc: 'Arvejas en lata de 300 g. Caja de 24 latas.' },
  { id: 'azucar', sku: 'GS-132', nombre: 'Azúcar común 1 kg', zh: '白砂糖 1公斤', cat: 'alimentos', sub: 'conservas',
    tipo: 'fardo', pres: 'Fardo x 10', unidades: 10, unidad: 'u', precio: 14900, descuento: 0, stock: 70,
    img: 'images/p-azucar.webp', alt: 'Paquetes de azúcar de 1 kg envueltos en film',
    desc: 'Azúcar común en paquetes de 1 kg. Fardo de 10 paquetes.' },

  { id: 'gaseosa-cola-225', sku: 'GS-201', nombre: 'Gaseosa cola 2,25 L', zh: '可乐 2.25升', cat: 'bebidas', sub: 'gaseosas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 13800, descuento: 0, stock: 96, rango: 2,
    img: 'images/p-cola.webp', alt: 'Packs de gaseosa cola de 2,25 litros sobre un pallet',
    desc: 'Gaseosa sabor cola en botella de 2,25 L. Pack de 6 botellas envuelto en film.' },
  { id: 'gaseosa-cola-15', sku: 'GS-202', nombre: 'Gaseosa cola 1,5 L', zh: '可乐 1.5升', cat: 'bebidas', sub: 'gaseosas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 10200, descuento: 0, stock: 80,
    img: 'images/p-cola-15.webp', alt: 'Pack de gaseosas cola de 1,5 litros sobre un pallet',
    desc: 'Gaseosa sabor cola en botella de 1,5 L. Pack de 6 botellas.' },
  { id: 'gaseosa-naranja', sku: 'GS-203', nombre: 'Gaseosa naranja 2,25 L', zh: '橙味汽水 2.25升', cat: 'bebidas', sub: 'gaseosas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 12600, descuento: 0, stock: 72, semana: 2,
    img: 'images/p-naranja.webp', alt: 'Packs de gaseosa de naranja de 2,25 litros',
    desc: 'Gaseosa sabor naranja en botella de 2,25 L. Pack de 6 botellas.' },
  { id: 'gaseosa-pomelo', sku: 'GS-204', nombre: 'Gaseosa pomelo 2,25 L', zh: '西柚味汽水 2.25升', cat: 'bebidas', sub: 'gaseosas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 12600, descuento: 0, stock: 48,
    img: 'images/p-pomelo.webp', alt: 'Pack de gaseosas de pomelo con tapa amarilla',
    desc: 'Gaseosa sabor pomelo en botella de 2,25 L. Pack de 6 botellas.' },
  { id: 'agua-mineral', sku: 'GS-211', nombre: 'Agua mineral sin gas 2 L', zh: '矿泉水 2升', cat: 'bebidas', sub: 'aguas',
    tipo: 'pack', pres: 'Pack x 6', unidades: 6, unidad: 'u', precio: 7200, descuento: 0, stock: 110, semana: 4,
    img: 'images/p-agua.webp', alt: 'Packs de agua mineral de 2 litros apilados en un pallet',
    desc: 'Agua mineral sin gas en botella de 2 L. Pack de 6 botellas.' },

  { id: 'jabon-tocador', sku: 'GS-301', nombre: 'Jabón de tocador 125 g', zh: '香皂 125克', cat: 'higiene', sub: 'personal',
    tipo: 'caja', pres: 'Caja x 48', unidades: 48, unidad: 'u', precio: 31200, descuento: 0, stock: 22, rango: 7,
    img: 'images/p-jabon-barra.webp', alt: 'Jabones de tocador verdes, rosas y blancos envueltos',
    desc: 'Jabones de tocador de 125 g en tres colores. Caja de 48 unidades.' },
  { id: 'jabon-liquido', sku: 'GS-302', nombre: 'Jabón líquido para manos 500 ml', zh: '洗手液 500毫升', cat: 'higiene', sub: 'personal',
    tipo: 'caja', pres: 'Caja x 12', unidades: 12, unidad: 'u', precio: 25200, descuento: 0, stock: 28, semana: 5,
    img: 'images/p-jabon-liquido.webp', alt: 'Botellas verdes de jabón líquido con válvula',
    desc: 'Jabón líquido para manos en botella de 500 ml con válvula. Caja de 12 botellas.' },
  { id: 'shampoo', sku: 'GS-303', nombre: 'Shampoo 750 ml', zh: '洗发水 750毫升', cat: 'higiene', sub: 'personal',
    tipo: 'caja', pres: 'Caja x 12', unidades: 12, unidad: 'u', precio: 34800, descuento: 0, stock: 20,
    img: 'images/p-shampoo.webp', alt: 'Botellas blancas de shampoo con válvula dosificadora',
    desc: 'Shampoo de uso diario en botella de 750 ml con válvula. Caja de 12 botellas.' },
  { id: 'gel-ducha', sku: 'GS-304', nombre: 'Gel de ducha 500 ml', zh: '沐浴露 500毫升', cat: 'higiene', sub: 'personal',
    tipo: 'caja', pres: 'Caja x 12', unidades: 12, unidad: 'u', precio: 27600, descuento: 0, stock: 6,
    img: 'images/p-gel-ducha.webp', alt: 'Botellas rosas de gel de ducha con válvula',
    desc: 'Gel de ducha en botella de 500 ml con válvula. Caja de 12 botellas.' },
  { id: 'toallitas', sku: 'GS-305', nombre: 'Toallitas húmedas x 50', zh: '湿巾 50片', cat: 'higiene', sub: 'personal',
    tipo: 'caja', pres: 'Caja x 24', unidades: 24, unidad: 'u', precio: 28800, descuento: 0, stock: 32, semana: 6,
    img: 'images/p-toallitas.webp', alt: 'Paquetes de toallitas húmedas azules y blancos',
    desc: 'Toallitas húmedas en paquete de 50 con cierre. Caja de 24 paquetes.' },
  { id: 'jabon-blanco', sku: 'GS-311', nombre: 'Jabón blanco para lavar 200 g', zh: '洗衣皂 200克', cat: 'higiene', sub: 'ropa',
    tipo: 'caja', pres: 'Caja x 50', unidades: 50, unidad: 'u', precio: 27500, descuento: 0, stock: 15,
    img: 'images/p-jabon-blanco.webp', alt: 'Panes de jabón blanco para lavar apilados',
    desc: 'Jabón blanco en pan de 200 g para lavar la ropa a mano. Caja de 50 panes.' },
  { id: 'suavizante', sku: 'GS-312', nombre: 'Suavizante para ropa 3 L', zh: '衣物柔顺剂 3升', cat: 'higiene', sub: 'ropa',
    tipo: 'caja', pres: 'Caja x 4', unidades: 4, unidad: 'u', precio: 23600, descuento: 0, stock: 36, rango: 5,
    img: 'images/p-suavizante.webp', alt: 'Bidones celestes de suavizante para ropa en un estante',
    desc: 'Suavizante para ropa en bidón de 3 L con manija y tapa dosificadora. Caja de 4 bidones.' },

  { id: 'vino-frutilla', sku: 'GS-401', nombre: 'Vino frutado sabor frutilla 750 ml', zh: '草莓味葡萄酒 750毫升', cat: 'vino', sub: 'por-sabor',
    tipo: 'caja', pres: 'Caja x 6', unidades: 6, unidad: 'u', precio: 28200, descuento: 0, stock: 40, rango: 6,
    img: 'images/p-vino-frutilla.webp', alt: 'Caja abierta con botellas de vino frutado rosado',
    desc: 'Vino frutado de Bodega Bermejo, Mendoza, sabor frutilla. Se sirve bien frío. Caja cerrada de 6 botellas de 750 ml.' },
  { id: 'vino-durazno', sku: 'GS-402', nombre: 'Vino frutado sabor durazno 750 ml', zh: '蜜桃味葡萄酒 750毫升', cat: 'vino', sub: 'por-sabor',
    tipo: 'caja', pres: 'Caja x 6', unidades: 6, unidad: 'u', precio: 28200, descuento: 0, stock: 34,
    img: 'images/p-vino-durazno.webp', alt: 'Caja abierta con botellas de vino frutado blanco',
    desc: 'Vino frutado de Bodega Bermejo, Mendoza, sabor durazno. Se sirve bien frío. Caja cerrada de 6 botellas de 750 ml.' },
  { id: 'vino-frutos-rojos', sku: 'GS-403', nombre: 'Vino frutado sabor frutos rojos 750 ml', zh: '莓果味葡萄酒 750毫升', cat: 'vino', sub: 'por-sabor',
    tipo: 'caja', pres: 'Caja x 6', unidades: 6, unidad: 'u', precio: 28200, descuento: 0, stock: 24,
    img: 'images/p-vino-frutos.webp', alt: 'Caja abierta con botellas de vino frutado tinto',
    desc: 'Vino frutado de Bodega Bermejo, Mendoza, sabor frutos rojos. Se sirve bien frío. Caja cerrada de 6 botellas de 750 ml.' },
  { id: 'vino-surtido', sku: 'GS-404', nombre: 'Vino frutado caja surtida 750 ml', zh: '果味葡萄酒混合装 750毫升', cat: 'vino', sub: 'surtida',
    tipo: 'caja', pres: 'Caja x 12 (4 de cada sabor)', unidades: 12, unidad: 'u', precio: 55200, descuento: 0, stock: 16, semana: 7,
    img: 'images/p-vino-surtido.webp', alt: 'Cajas de vino frutado rosado, blanco y tinto sobre pallets',
    desc: 'Caja de 12 botellas de vino frutado de Bodega Bermejo: 4 de frutilla, 4 de durazno y 4 de frutos rojos. Para probar los tres sabores en la góndola.' },

  { id: 'vino-anana', sku: 'GS-405', nombre: 'Vino frutado sabor ananá 750 ml', zh: '菠萝味葡萄酒 750毫升', cat: 'vino', sub: 'por-sabor',
    tipo: 'caja', pres: 'Caja x 6', unidades: 6, unidad: 'u', precio: 28200, descuento: 0, stock: 0, visible: false,
    img: 'images/p-vino-durazno.webp', alt: 'Botellas de vino frutado', desc: 'Próximo ingreso.' },
];

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const catDe = id => CATEGORIAS.find(c => c.id === id);
  const indice = new Map(visibles.map(p => {
    const c = catDe(p.cat);
    const s = c?.subs.find(x => x.id === p.sub);
    return [p.id, norm([p.nombre, p.zh, p.sku, p.pres, p.desc, c?.nombre, c?.zh, s?.nombre, s?.zh].join(' '))];
  }));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const porUnidad = p => final(p) / (p.unidades || 1);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), tipo = lista(f.tipo), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.semana === true && !p.semana) return false;
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
      case 'semana': return (a, b) => (a.semana || 999) - (b.semana || 999) || desempate(a, b);
      case 'unidad-asc': return (a, b) => porUnidad(a) - porUnidad(b) || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.stock - a.stock || desempate(a, b);
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

const Tienda = crearTienda(COLECCION, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioUnidad = p => `${formatearPrecio(precioFinal(p) / (p.unidades || 1))} ${p.unidad === 'kg' ? 'el kg' : 'c/u'}`;
const getProducto = id => Tienda.obtener(id);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const bultos = n => `${n} ${n === 1 ? 'bulto' : 'bultos'}`;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'giorgio_cart',
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
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
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

const ICONO_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONO_TACHO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

function badgeHTML(p) {
  if (p.cat === 'vino') return '<span class="badge badge--excl">Exclusivo</span>';
  if (p.stock <= 8) return '<span class="badge badge--poco">Últimos bultos</span>';
  return '';
}
function stepperHTML(p, extra = '') {
  return `<div class="stepper${extra}" data-stepper><button type="button" class="stepper__btn" data-paso="-1" aria-label="Un bulto menos de ${esc(p.nombre)}">−</button><input class="stepper__n" type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Bultos de ${esc(p.nombre)}"><button type="button" class="stepper__btn" data-paso="1" aria-label="Un bulto más de ${esc(p.nombre)}">+</button></div>`;
}
function cardHTML(p, { animar = true } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  return `<article class="card" data-id="${p.id}"${anim}>
  <div class="card__foto"><span class="recorte"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="640" decoding="async"></span>${badgeHTML(p)}</div>
  <p class="rotulo"><span class="rotulo__sku">${p.sku} · ${esc(p.pres)}</span><strong class="rotulo__precio">${formatearPrecio(precioFinal(p))}</strong><span class="rotulo__u">${precioUnidad(p)}</span></p>
  <div class="card__info">
    <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
    <p class="card__zh" lang="zh-Hans">${esc(p.zh)}</p>
    <p class="card__stock${p.stock <= 8 ? ' stock-bajo' : ''}">${bultos(p.stock)} en stock</p>
    <div class="prod-actions">${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}">${ICONO_CARRITO}<span>Agregar</span></button></div>
    <button type="button" class="card__ya" data-ya="${p.id}">Comprar ahora</button>
  </div>
</article>`;
}
function filaHTML(p, { animar = true } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : '';
  return `<li class="fila" data-id="${p.id}"${anim}>
  <div class="fila__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="640" decoding="async"></div>
  <div class="fila__txt">
    <p class="fila__sku">${p.sku} · ${esc(p.pres)}${p.cat === 'vino' ? ' · <span class="fila__excl">Exclusivo</span>' : ''}</p>
    <h3 class="fila__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
    <p class="fila__zh" lang="zh-Hans">${esc(p.zh)}</p>
  </div>
  <p class="fila__precio"><strong>${formatearPrecio(precioFinal(p))}</strong><span>${precioUnidad(p)}</span></p>
  <p class="fila__stock${p.stock <= 8 ? ' stock-bajo' : ''}">${bultos(p.stock)}</p>
  <div class="fila__acc">${stepperHTML(p)}<button type="button" class="fila__sumar" data-add="${p.id}">${ICONO_CARRITO}<span>Sumar</span></button></div>
</li>`;
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
function refrescarTriggers() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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

function initCatMenu() {
  const urlCat = new URLSearchParams(location.search).get('cat');
  document.querySelectorAll('[data-cat-menu]').forEach(menu => {
    const total = Tienda.contar({});
    menu.innerHTML = CATEGORIAS.map(c => `<li><a class="catmenu__item" href="${CATALOGO_URL}?cat=${c.id}"${PAGINA === 'catalogo' && urlCat === c.id ? ' aria-current="page"' : ''}>
      <span class="catmenu__img"><img src="${c.img}" alt="" width="96" height="96" decoding="async"></span>
      <span class="catmenu__txt"><span class="catmenu__nombre">${esc(c.nombre)}</span><span class="catmenu__zh" lang="zh-Hans">${c.zh}</span><span class="catmenu__subs">${c.subs.map(s => esc(s.nombre)).join(' · ')}</span></span>
      <span class="catmenu__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('')
      + `<li class="catmenu__todo"><a href="${CATALOGO_URL}">Ver todo el catálogo · ${total} productos ${ICONO_FLECHA}</a></li>`;
  });
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const hoverMq = window.matchMedia('(hover: hover)');
  document.querySelectorAll('[data-cat-drop]').forEach(drop => {
    const btn = drop.querySelector('.catdrop__btn');
    const panel = drop.querySelector('.catdrop__panel');
    if (!btn || !panel) return;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); btn.setAttribute('aria-expanded', 'true'); drop.classList.add('is-open'); };
    const cerrar = () => { clearTimeout(timer); btn.setAttribute('aria-expanded', 'false'); drop.classList.remove('is-open'); };
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? cerrar() : abrir()));
    drop.addEventListener('mouseenter', () => { if (desktopMq.matches && hoverMq.matches) abrir(); });
    drop.addEventListener('mouseleave', () => { if (desktopMq.matches && hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
    drop.addEventListener('focusout', e => { if (desktopMq.matches && !drop.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (desktopMq.matches && !drop.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('is-open')) { cerrar(); btn.focus(); } });
    desktopMq.addEventListener('change', cerrar);
  });
}

function initBuscadores() {
  document.querySelectorAll('[data-buscador]').forEach(form => {
    form.setAttribute('action', CATALOGO_URL);
    form.addEventListener('submit', e => {
      const q = form.querySelector('input')?.value.trim() || '';
      if (PAGINA === 'catalogo' && typeof window.__catalogoBuscar === 'function') {
        e.preventDefault();
        window.__catalogoBuscar(q);
        return;
      }
      if (!q) { e.preventDefault(); location.href = CATALOGO_URL; }
    });
  });
}

function animarPrecio(el, valor) {
  if (!el) return;
  const desde = Number(el.dataset.valor || 0);
  el.dataset.valor = String(valor);
  if (reduceMotion || desde === valor) { el.textContent = formatearPrecio(valor); return; }
  const t0 = window.performance.now();
  const dur = 420;
  const paso = t => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = formatearPrecio(desde + (valor - desde) * e);
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function mensajePedido() {
  const lineas = Cart.get().map(i => { const p = getProducto(i.id); return p ? `• ${i.qty} × ${p.nombre} (${p.pres}) — ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean);
  return `Hola, quiero hacer este pedido para mi supermercado:\n${lineas.join('\n')}\nTotal estimado: ${formatearPrecio(Cart.total())}`;
}

const lineasVistas = new WeakMap();
function lineasHTML(items, compacta, vistas = new Set()) {
  return items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<li class="linea${compacta ? ' linea--compacta' : ''}${vistas.has(p.id) ? '' : ' linea--nueva'}" data-linea="${p.id}">
      <img class="linea__img" src="${p.img}" alt="" width="640" height="640" decoding="async">
      <div class="linea__txt"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__meta">${esc(p.pres)} · ${formatearPrecio(precioFinal(p))} el bulto</p></div>
      <div class="linea__qty"><button type="button" data-linea-paso="-1" aria-label="Un bulto menos de ${esc(p.nombre)}">−</button><span aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Un bulto más de ${esc(p.nombre)}"${i.qty >= p.stock ? ' disabled' : ''}>+</button></div>
      <p class="linea__sub">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)} del pedido">${ICONO_TACHO}</button>
    </li>`;
  }).join('');
}

function renderPedidos() {
  const items = Cart.get();
  const n = Cart.count();
  const total = Cart.total();
  document.querySelectorAll('[data-pedido]').forEach(box => {
    const compacta = box.dataset.pedido === 'panel';
    const lista = box.querySelector('[data-pedido-lineas]');
    const vacio = box.querySelector('[data-pedido-vacio]');
    const pie = box.querySelector('[data-pedido-pie]');
    if (lista) {
      lista.innerHTML = lineasHTML(items, compacta, lineasVistas.get(lista));
      lineasVistas.set(lista, new Set(items.map(i => i.id)));
    }
    if (vacio) vacio.hidden = items.length > 0;
    if (pie) pie.hidden = items.length === 0;
    box.querySelectorAll('[data-pedido-bultos]').forEach(el => { el.textContent = bultos(n); });
    box.querySelectorAll('[data-pedido-total]').forEach(el => animarPrecio(el, total));
    box.querySelectorAll('[data-pedido-wsp]').forEach(a => { a.href = wspHref(mensajePedido()); });
  });
  document.querySelectorAll('[data-hdr-total]').forEach(el => animarPrecio(el, total));
  document.querySelectorAll('[data-hdr-bultos]').forEach(el => { el.textContent = bultos(n); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function trampaFoco(caja, e) {
  if (e.key !== 'Tab') return;
  const f = [...caja.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const Capa = (() => {
  let abierta = null;
  let volver = null;
  function abrir(raiz, foco) {
    if (abierta && abierta !== raiz) cerrar(true);
    volver = document.activeElement;
    raiz.hidden = false;
    abierta = raiz;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add('open')));
    setTimeout(() => (foco || raiz.querySelector('[tabindex="-1"]'))?.focus({ preventScroll: true }), 60);
  }
  function cerrar(sinFoco) {
    const raiz = abierta;
    if (!raiz) return;
    abierta = null;
    raiz.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!raiz.classList.contains('open')) raiz.hidden = true; }, reduceMotion ? 0 : 340);
    if (raiz.id === 'qv' && PAGINA === 'catalogo') {
      const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    }
    if (!sinFoco && volver && document.contains(volver)) volver.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', e => {
    if (!abierta) return;
    if (e.key === 'Escape') { cerrar(); return; }
    trampaFoco(abierta, e);
  });
  return { abrir, cerrar, get abierta() { return abierta; } };
})();

function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  renderPedidos();
  Capa.abrir(d);
}

function abrirVista(id) {
  const qv = document.getElementById('qv');
  const cuerpo = document.getElementById('qvCuerpo');
  const p = getProducto(id);
  if (!qv || !cuerpo || !p) return;
  const c = catDe(p.cat);
  const sub = c?.subs.find(s => s.id === p.sub);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  cuerpo.innerHTML = `<div class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="640">${badgeHTML(p)}</div>
    <div class="qv__info" data-id="${p.id}">
      <p class="qv__ruta"><a href="${CATALOGO_URL}?cat=${p.cat}">${esc(c?.corto || c?.nombre || '')}</a>${sub ? ` · <a href="${CATALOGO_URL}?cat=${p.cat}&amp;sub=${sub.id}">${esc(sub.nombre)}</a>` : ''}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__zh" lang="zh-Hans">${esc(p.zh)}</p>
      <div class="rotulo rotulo--grande"><span class="rotulo__sku">${p.sku} · ${esc(p.pres)}</span><strong class="rotulo__precio">${formatearPrecio(precioFinal(p))}</strong><span class="rotulo__u">${precioUnidad(p)}</span></div>
      <p class="qv__stock${p.stock <= 8 ? ' stock-bajo' : ''}">${bultos(p.stock)} en stock</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <div class="qv__acc">${stepperHTML(p, ' stepper--grande')}<button type="button" class="btn btn--cta" data-add="${p.id}">${ICONO_CARRITO}<span>Agregar al pedido</span></button></div>
      <button type="button" class="btn btn--linea qv__ya" data-ya="${p.id}">Comprar ahora</button>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También se pide con esto</p><ul>${rel.map(r => `<li><button type="button" data-quick="${r.id}"><img src="${r.img}" alt="" width="640" height="640"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioFinal(r))}</strong></button></li>`).join('')}</ul></div>` : ''}
    </div>`;
  let ld = document.getElementById('ldProducto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ldProducto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.sku, image: new URL(p.img, location.href).href, description: p.desc,
    brand: p.cat === 'vino' ? { '@type': 'Brand', name: 'Bodega Bermejo' } : undefined,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u); }
  if (Capa.abierta === qv) { qv.querySelector('.qv__caja')?.scrollTo(0, 0); qv.querySelector('[tabindex="-1"]')?.focus({ preventScroll: true }); return; }
  Capa.abrir(qv);
}

function leerCantidad(origen) {
  const caja = origen.closest('.card, .fila, .qv__info');
  const input = caja?.querySelector('.stepper__n');
  const n = parseInt(input?.value, 10);
  return { input, n: Number.isFinite(n) && n > 0 ? n : 1 };
}

function initAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { e.preventDefault(); abrirVista(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const input = paso.closest('[data-stepper]')?.querySelector('.stepper__n');
      if (!input) return;
      const max = parseInt(input.max, 10) || 99;
      input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(paso.dataset.paso)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const { input, n } = leerCantidad(add);
      const yaHay = Cart.get().find(i => i.id === p.id)?.qty || 0;
      if (yaHay >= p.stock) { showToast(`Ya tenés en el pedido todo el stock de ${p.nombre}.`); return; }
      Cart.add(p, n);
      const sumados = Math.min(n, p.stock - yaHay);
      showToast(`Sumaste ${bultos(sumados)} de ${p.nombre}.`);
      if (input) input.value = 1;
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 900);
      return;
    }
    const ya = e.target.closest('[data-ya]');
    if (ya) {
      const p = getProducto(ya.dataset.ya);
      if (!p) return;
      const { n } = leerCantidad(ya);
      Cart.add(p, n);
      abrirCarrito();
      return;
    }
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-capa-cerrar]')) { Capa.cerrar(); return; }
    const lp = e.target.closest('[data-linea-paso]');
    if (lp) {
      const id = lp.closest('[data-linea]')?.dataset.linea;
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + Number(lp.dataset.lineaPaso));
      return;
    }
    const lq = e.target.closest('[data-linea-quitar]');
    if (lq) {
      const id = lq.closest('[data-linea]')?.dataset.linea;
      const p = getProducto(id);
      Cart.remove(id);
      if (p) showToast(`Sacaste ${p.nombre} del pedido.`);
      return;
    }
    if (e.target.closest('[data-finalizar]')) {
      if (!Cart.count()) { showToast('Sumá al menos un bulto para cerrar el pedido.'); return; }
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
      return;
    }
    if (e.target.closest('[data-vaciar]')) { Cart.clear(); showToast('Vaciaste el pedido.'); }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('.stepper__n');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
  document.addEventListener('cart:updated', () => { renderPedidos(); updateCartBadge(); });
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

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  track.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { animar: false })}</li>`).join('');
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, ultimoDx = 0, soltar = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('input, .stepper')) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId; ultimoDx = 0;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      clearTimeout(soltar);
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; ultimoDx = dx; e.preventDefault(); }
  });
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + (parseFloat(window.getComputedStyle(track).columnGap) || 16);
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (!moved) return;
    const w = paso();
    let idx = vp.scrollLeft / w;
    idx = Math.abs(ultimoDx) > 60 ? (ultimoDx < 0 ? Math.ceil(idx) : Math.floor(idx)) : Math.round(idx);
    const destino = Math.max(0, Math.min(vp.scrollWidth - vp.clientWidth, idx * w));
    vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    soltar = setTimeout(() => vp.classList.remove('dragging'), 520);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function initHome() {
  if (PAGINA !== 'home') return;
  const grilla = document.getElementById('grillaSemana');
  if (grilla) {
    const items = Tienda.consultar({ filtros: { semana: true }, orden: 'semana', limite: 8 }).items;
    grilla.innerHTML = items.map(p => cardHTML(p)).join('');
  }
  const lista = document.getElementById('listaHome');
  if (lista) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    lista.innerHTML = items.map(p => filaHTML(p)).join('');
  }
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-pestanas-home]').forEach(nav => {
    nav.innerHTML = CATEGORIAS.map(c => `<a class="pestana" href="${CATALOGO_URL}?cat=${c.id}"><span class="pestana__img"><img src="${c.img}" alt="" width="96" height="96" decoding="async"></span><span class="pestana__txt"><span class="pestana__nombre">${esc(c.corto || c.nombre)}</span><span class="pestana__zh" lang="zh-Hans">${c.zh}</span></span><span class="pestana__n">${Tienda.contar({ cat: c.id })}</span></a>`).join('');
  });
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const esLista = grid.tagName === 'UL';
  const verMas = document.getElementById('catVerMas');
  const contador = document.getElementById('catContador');
  const vacio = document.getElementById('catVacio');
  const buscar = document.getElementById('catBuscar');
  const orden = document.getElementById('catOrden');
  const h1 = document.getElementById('catH1');
  const bajada = document.getElementById('catBajada');
  const miga = document.getElementById('catMiga');
  const opsCat = document.querySelector('[data-ops="cat"]');
  const opsSub = document.querySelector('[data-ops="sub"]');
  const opsTipo = document.querySelector('[data-ops="tipo"]');
  const opsPrecio = document.querySelector('[data-ops="precio"]');
  const subsWrap = document.querySelector('[data-subs-wrap]');

  const qs = new URLSearchParams(location.search);
  const valida = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const e = {
    cat: valida(qs.get('cat'), CATEGORIAS),
    sub: [],
    tipo: (qs.get('tipo') || '').split(',').filter(t => TIPOS.some(x => x.id === t)),
    precio: valida(qs.get('precio'), PRECIOS),
    q: (qs.get('q') || '').slice(0, 60),
    orden: valida(qs.get('orden'), ORDENES) || 'destacados',
  };
  const subsDe = cat => catDe(cat)?.subs || CATEGORIAS.flatMap(c => c.subs);
  e.sub = (qs.get('sub') || '').split(',').filter(s => subsDe(e.cat).some(x => x.id === s));

  ORDENES.forEach(o => { const op = document.createElement('option'); op.value = o.id; op.textContent = o.nombre; orden?.appendChild(op); });
  if (orden) orden.value = e.orden;
  if (buscar) buscar.value = e.q;

  const filtros = () => {
    const pr = PRECIOS.find(x => x.id === e.precio);
    return { cat: e.cat || null, sub: e.sub, tipo: e.tipo, q: e.q, precioMin: pr?.min ?? null, precioMax: pr?.max ?? null };
  };
  const sincronizarURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'tipo', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.tipo.length) u.searchParams.set('tipo', e.tipo.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.q) u.searchParams.set('q', e.q);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    window.history.replaceState(null, '', u);
    const s = new URLSearchParams(u.search); s.delete('producto');
    document.querySelectorAll('.gw-modelos__btn').forEach(a => { a.setAttribute('href', a.getAttribute('href').split('?')[0] + (s.toString() ? `?${s}` : '')); });
  };
  const boton = (grupo, id, txt, activo, extra = '') => `<button type="button" class="op op--${grupo}" data-op="${grupo}" data-val="${id}" aria-pressed="${activo}">${txt}${extra}</button>`;
  const pintarOps = () => {
    const base = { q: e.q };
    if (opsCat) {
      opsCat.innerHTML = boton('cat', '', `<span class="op__nombre">Todo</span>`, !e.cat, `<span class="op__n">${Tienda.contar(base)}</span>`)
        + CATEGORIAS.map(c => boton('cat', c.id, `<span class="op__nombre">${esc(c.corto || c.nombre)}</span><span class="op__zh" lang="zh-Hans">${c.zh}</span>`, e.cat === c.id, `<span class="op__n">${Tienda.contar({ ...base, cat: c.id })}</span>`)).join('');
    }
    if (opsSub) {
      const subs = e.cat ? subsDe(e.cat) : [];
      if (subsWrap) subsWrap.hidden = !subs.length;
      opsSub.innerHTML = subs.map(s => boton('sub', s.id, `${esc(s.nombre)} <span class="op__zh" lang="zh-Hans">${s.zh}</span>`, e.sub.includes(s.id), `<span class="op__n">${Tienda.contar({ ...base, cat: e.cat, sub: s.id })}</span>`)).join('');
    }
    if (opsTipo) opsTipo.innerHTML = TIPOS.map(t => boton('tipo', t.id, esc(t.nombre), e.tipo.includes(t.id))).join('');
    if (opsPrecio) opsPrecio.innerHTML = PRECIOS.map(pr => boton('precio', pr.id, esc(pr.nombre), e.precio === pr.id)).join('');
  };
  const pintarCabecera = () => {
    const c = catDe(e.cat);
    const s = c?.subs.find(x => x.id === e.sub[0]);
    if (h1) h1.innerHTML = c ? `${esc(c.nombre)} <span class="cat-h1__zh" lang="zh-Hans">${c.zh}</span>` : 'Catálogo mayorista <span class="cat-h1__zh" lang="zh-Hans">批发目录</span>';
    if (bajada) bajada.textContent = c ? c.bajada : 'Precios por bulto, con el precio por unidad a la vista. Buscá en castellano o en chino.';
    if (miga) miga.innerHTML = `<li><a href="${INICIO_URL}">Inicio</a></li><li>${c ? `<a href="${CATALOGO_URL}">Catálogo</a>` : '<span aria-current="page">Catálogo</span>'}</li>${c ? `<li><span aria-current="page">${esc(c.corto || c.nombre)}${s && e.sub.length === 1 ? ` · ${esc(s.nombre)}` : ''}</span></li>` : ''}`;
    document.title = `${c ? c.nombre : 'Catálogo mayorista'} — Distribuidora Giorgio S.A.S`;
    document.querySelectorAll('[data-cat-menu] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };

  let cursor = null, mostrados = 0, total = 0;
  const pintar = (reiniciar) => {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => (esLista ? filaHTML(p) : cardHTML(p))).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    if (contador) contador.textContent = total === 1 ? '1 producto' : `${total} productos`;
    if (vacio) vacio.hidden = total > 0;
    if (verMas) {
      verMas.hidden = !cursor;
      const resto = total - mostrados;
      verMas.querySelector('span').textContent = `Ver más productos (${resto})`;
    }
    revelarNuevos(grid);
    refrescarTriggers();
  };
  const aplicar = () => { pintarOps(); pintarCabecera(); sincronizarURL(); pintar(true); };

  document.addEventListener('click', ev => {
    const op = ev.target.closest('[data-op]');
    if (op) {
      const g = op.dataset.op, v = op.dataset.val;
      if (g === 'cat') { e.cat = v; e.sub = []; }
      else if (g === 'sub') e.sub = e.sub.includes(v) ? e.sub.filter(x => x !== v) : [...e.sub, v];
      else if (g === 'tipo') e.tipo = e.tipo.includes(v) ? e.tipo.filter(x => x !== v) : [...e.tipo, v];
      else if (g === 'precio') e.precio = e.precio === v ? '' : v;
      aplicar();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      e.cat = ''; e.sub = []; e.tipo = []; e.precio = ''; e.q = ''; e.orden = 'destacados';
      if (buscar) buscar.value = '';
      if (orden) orden.value = 'destacados';
      document.querySelectorAll('[data-buscador] input').forEach(i => { i.value = ''; });
      aplicar();
    }
  });
  let t = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); document.querySelectorAll('[data-buscador] input').forEach(i => { i.value = e.q; }); aplicar(); }, 220);
  });
  buscar?.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden?.addEventListener('change', () => { e.orden = orden.value; sincronizarURL(); pintar(true); });
  verMas?.addEventListener('click', () => pintar(false));
  window.__catalogoBuscar = q => {
    e.q = q.slice(0, 60);
    e.cat = ''; e.sub = []; e.tipo = []; e.precio = '';
    if (buscar) buscar.value = e.q;
    aplicar();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  document.querySelectorAll('[data-buscador] input').forEach(i => { i.value = e.q; });

  const det = document.querySelector('.filtros__det');
  if (det) {
    const mq = window.matchMedia('(min-width: 1025px)');
    const syncDet = () => { if (mq.matches) det.open = true; };
    if (mq.matches) det.open = true; else det.open = false;
    mq.addEventListener('change', syncDet);
  }

  pintarOps(); pintarCabecera(); sincronizarURL(); pintar(true);
  if (e.q && buscar && qs.get('q')) buscar.focus({ preventScroll: true });
  const prod = qs.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVista(prod), 300);
}

function initAlta() {
  document.querySelectorAll('[data-alta]').forEach(form => {
    const campos = [...form.querySelectorAll('input[required]')];
    const validar = input => {
      const v = input.value.trim();
      let msg = '';
      if (!v) msg = 'Completá este dato.';
      else if (input.name === 'cuit' && v.replace(/\D/g, '').length !== 11) msg = 'El CUIT tiene 11 números.';
      else if (input.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) msg = 'Dejá el número con código de área.';
      const err = form.querySelector(`#${input.getAttribute('aria-describedby')}`);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    campos.forEach(c => c.addEventListener('blur', () => { if (c.value) validar(c); }));
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const ok = campos.map(validar).every(Boolean);
      if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
      const d = Object.fromEntries(new window.FormData(form));
      const btn = form.querySelector('button[type="submit"]');
      const txt = btn.querySelector('span');
      const antes = txt.textContent;
      btn.disabled = true; txt.textContent = 'Abriendo WhatsApp…';
      const msg = `Hola, quiero dar de alta mi supermercado para comprar por mayor.\nSupermercado: ${d.super}\nResponsable: ${d.nombre}\nCUIT: ${d.cuit}\nDirección: ${d.direccion}\nWhatsApp: ${d.whatsapp}`;
      setTimeout(() => {
        window.open(wspHref(msg), '_blank', 'noopener');
        btn.disabled = false; txt.textContent = antes;
        showToast('Te abrimos WhatsApp con tus datos: solo falta enviar el mensaje.');
        form.reset();
        campos.forEach(c => c.removeAttribute('aria-invalid'));
      }, 700);
    });
  });
}

function initLectura() {
  const el = document.querySelector('[data-lectura]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="lectura__p">${esc(w)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.lectura__p')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const inicio = vh * 0.88, fin = vh * 0.38;
    const k = Math.max(0, Math.min(1, (inicio - r.top) / (inicio - fin + r.height * 0.5)));
    const n = Math.round(k * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-dato, .hero-chip, .hero-zh'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amp = parseFloat(el.dataset.parallax) || 4;
    ScrollTrigger.create({
      trigger: el.closest('section') || el, start: 'top top', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(amp * s.progress).toFixed(2)}%`; },
    });
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

[
  () => Cart.syncStock(),
  initCatMenu,
  initHome,
  initRail,
  initCatalogo,
  initReveals,
  initNav,
  initBuscadores,
  initAcciones,
  initFloats,
  renderPedidos,
  updateCartBadge,
  initAlta,
  initLectura,
  initHeroMotion,
  initParallax,
  initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
