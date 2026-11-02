const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492657583124';
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

const svgCat = d => `<svg class="ico ico--cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CATEGORIAS = [
  { id: 'remeras', nombre: 'Remeras', ico: svgCat('<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>') },
  { id: 'camisas', nombre: 'Camisas', ico: svgCat('<path d="M9 3 4.5 5 3 10l3 1v10h12V11l3-1-1.5-5L15 3"/><path d="M9 3l-.6 3.2L12 9l3.6-2.8L15 3M9 3c1 .8 2 1.2 3 1.2S14 3.8 15 3M12 9v12"/>') },
  { id: 'pantalones', nombre: 'Pantalones', ico: svgCat('<path d="M6.5 3h11l1.5 18h-5L12 10l-2 11H5z"/><path d="M6.5 7h11"/>') },
  { id: 'abrigos', nombre: 'Abrigos', ico: svgCat('<path d="M9 3 4 6v15h5v-5M15 3l5 3v15h-5v-5"/><path d="M9 3c.6 1.8 1.6 2.8 3 2.8S14.4 4.8 15 3M12 5.8V21M4 12h3M17 12h3"/>') },
  { id: 'accesorios', nombre: 'Accesorios', ico: svgCat('<path d="M4 15a8 8 0 0 1 16 0z"/><path d="M15 15c3 0 6 .8 6 2.1S18 19 15 19H9.5M12 7V5.5"/>') },
];
const ESTILOS = [
  { id: 'urbano', nombre: 'Urbano' },
  { id: 'clasico', nombre: 'Clásico' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro', hex: '#17181B' },
  { id: 'gris', nombre: 'Gris', hex: '#8E9196' },
  { id: 'gris-oscuro', nombre: 'Gris oscuro', hex: '#3E4045' },
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
  { id: 'celeste', nombre: 'Celeste', hex: '#9DB8E2' },
  { id: 'azul-marino', nombre: 'Azul marino', hex: '#24304F' },
  { id: 'azul-oscuro', nombre: 'Azul oscuro', hex: '#26324D' },
  { id: 'beige', nombre: 'Beige', hex: '#CDB78F' },
  { id: 'verde-militar', nombre: 'Verde militar', hex: '#5A6A3A' },
  { id: 'suela', nombre: 'Suela', hex: '#8B4A26' },
];
const LETRAS = ['S', 'M', 'L', 'XL', 'XXL'];
const NUMEROS = ['38', '40', '42', '44', '46', '48'];
const TALLES = [...LETRAS, ...NUMEROS, 'Único'];
const PRECIOS = [
  { id: 'hasta30', nombre: 'Hasta $30.000', min: null, max: 30000 },
  { id: '30a60', nombre: '$30.000 a $60.000', min: 30001, max: 60000 },
  { id: 'mas60', nombre: 'Más de $60.000', min: 60001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  remeras: 'remera remeras camiseta basica algodon manga corta', camisas: 'camisa camisas oxford manga larga cuello',
  pantalones: 'pantalon pantalones', abrigos: 'abrigo abrigos buzo buzos canguro capucha campera camperas bomber sweater sueter pullover',
  accesorios: 'accesorio accesorios gorra gorras cinturon cinturones cinto cuero',
  urbano: 'urbano urbana calle', clasico: 'clasico clasica formal oficina',
  negro: 'negro negra', gris: 'gris melange', 'gris-oscuro': 'gris oscuro grafito', blanco: 'blanco blanca', celeste: 'celeste azul claro',
  'azul-marino': 'azul marino navy', 'azul-oscuro': 'azul oscuro indigo', beige: 'beige caqui arena', 'verde-militar': 'verde militar oliva', suela: 'suela marron',
};

const Tienda = crearTienda([
  { id: 'camisa-oxford', nombre: 'Camisa Oxford', cat: 'camisas', estilo: ['clasico'], tipo: 'arriba', precio: 55000, descuento: 0, alta: 24, rango: 1,
    colores: [
      { id: 'celeste', img: 'images/camisa-oxford-celeste.webp', alt: 'Camisa Oxford celeste doblada, con cuello abotonado', stock: { S: 2, M: 5, L: 4, XL: 3, XXL: 1 } },
      { id: 'blanco', img: 'images/camisa-oxford-blanca.webp', alt: 'Camisa Oxford blanca doblada, con cuello abotonado', stock: { S: 1, M: 4, L: 4, XL: 2, XXL: 0 } },
    ],
    desc: 'Camisa de tela Oxford con cuello abotonado y manga larga. Para la oficina o el fin de semana, sola o debajo de un sweater.',
    datos: [['Tela', 'Oxford de algodón'], ['Cuello', 'Abotonado'], ['Manga', 'Larga'], ['Calce', 'Regular']] },
  { id: 'jean-clasico', nombre: 'Jean clásico', cat: 'pantalones', estilo: ['urbano', 'clasico'], tipo: 'abajo', precio: 62000, descuento: 0, alta: 20, rango: 2,
    colores: [
      { id: 'azul-oscuro', img: 'images/jean-clasico-azul.webp', alt: 'Jean clásico azul oscuro doblado, con cinco bolsillos', stock: { 38: 2, 40: 4, 42: 5, 44: 4, 46: 2, 48: 1 } },
    ],
    desc: 'Jean de denim azul oscuro, corte recto y cinco bolsillos. El básico que combina con todo.',
    datos: [['Tela', 'Denim'], ['Corte', 'Recto'], ['Bolsillos', 'Cinco'], ['Tiro', 'Medio']] },
  { id: 'remera-basica', nombre: 'Remera básica', cat: 'remeras', estilo: ['urbano'], tipo: 'arriba', precio: 24000, descuento: 0, alta: 26, rango: 3,
    colores: [
      { id: 'blanco', img: 'images/remera-basica-blanca.webp', alt: 'Remera básica blanca de cuello redondo, doblada', stock: { S: 4, M: 8, L: 7, XL: 4, XXL: 2 } },
    ],
    desc: 'Remera de jersey de algodón, cuello redondo y manga corta. El básico de todos los días.',
    datos: [['Tela', 'Jersey de algodón'], ['Cuello', 'Redondo'], ['Manga', 'Corta'], ['Calce', 'Regular']] },
  { id: 'buzo-canguro', nombre: 'Buzo canguro', cat: 'abrigos', estilo: ['urbano'], tipo: 'arriba', precio: 58000, descuento: 0, alta: 30, rango: 4, tag: 'nuevo',
    colores: [
      { id: 'negro', img: 'images/buzo-canguro-negro.webp', alt: 'Buzo canguro negro con capucha colgado en una percha', stock: { S: 3, M: 5, L: 4, XL: 2, XXL: 1 } },
      { id: 'gris', img: 'images/buzo-canguro-gris.webp', alt: 'Buzo canguro gris con capucha colgado en una percha', stock: { S: 1, M: 3, L: 3, XL: 0, XXL: 1 } },
    ],
    desc: 'Buzo de frisa con capucha, bolsillo canguro y puños elastizados. El básico urbano para todo el invierno.',
    datos: [['Tela', 'Frisa de algodón'], ['Capucha', 'Con cordón'], ['Bolsillo', 'Canguro'], ['Calce', 'Regular']] },
  { id: 'campera-bomber', nombre: 'Campera bomber', cat: 'abrigos', estilo: ['urbano'], tipo: 'arriba', precio: 98000, descuento: 15, alta: 14, rango: 5,
    colores: [
      { id: 'azul-marino', img: 'images/campera-bomber-azul.webp', alt: 'Campera bomber azul marino con cierre, colgada en una percha', stock: { S: 1, M: 3, L: 3, XL: 2, XXL: 0 } },
      { id: 'negro', img: 'images/campera-bomber-negra.webp', alt: 'Campera bomber negra con cierre, colgada en una percha', stock: { S: 0, M: 2, L: 2, XL: 1, XXL: 1 } },
    ],
    desc: 'Campera bomber liviana con cierre, puños y cintura elastizados y bolsillo con cierre en la manga.',
    datos: [['Tela', 'Nylon liviano'], ['Cierre', 'Metálico'], ['Bolsillos', 'Dos y uno en la manga'], ['Calce', 'Regular']] },
  { id: 'pantalon-chino', nombre: 'Pantalón chino', cat: 'pantalones', estilo: ['clasico'], tipo: 'abajo', precio: 54000, descuento: 0, alta: 18, rango: 6,
    colores: [
      { id: 'beige', img: 'images/pantalon-chino-beige.webp', alt: 'Pantalón chino beige doblado', stock: { 38: 1, 40: 3, 42: 4, 44: 3, 46: 2, 48: 0 } },
      { id: 'verde-militar', img: 'images/pantalon-chino-verde.webp', alt: 'Pantalón chino verde militar doblado', stock: { 38: 0, 40: 2, 42: 3, 44: 2, 46: 1, 48: 1 } },
    ],
    desc: 'Pantalón de gabardina elastizada, corte recto y bolsillos al bies. Para la semana y para salir.',
    datos: [['Tela', 'Gabardina elastizada'], ['Corte', 'Recto'], ['Bolsillos', 'Al bies'], ['Tiro', 'Medio']] },
  { id: 'sweater-redondo', nombre: 'Sweater cuello redondo', cat: 'abrigos', estilo: ['clasico'], tipo: 'arriba', precio: 52000, descuento: 0, alta: 16, rango: 7,
    colores: [
      { id: 'gris-oscuro', img: 'images/sweater-gris.webp', alt: 'Sweater gris oscuro de cuello redondo, doblado', stock: { S: 2, M: 3, L: 3, XL: 2, XXL: 1 } },
      { id: 'azul-marino', img: 'images/sweater-azul.webp', alt: 'Sweater azul marino de cuello redondo, doblado', stock: { S: 1, M: 2, L: 2, XL: 1, XXL: 0 } },
    ],
    desc: 'Sweater de punto fino, cuello redondo y puños acanalados. Abriga sin abultar.',
    datos: [['Tejido', 'Punto fino'], ['Cuello', 'Redondo'], ['Puños', 'Acanalados'], ['Calce', 'Regular']] },
  { id: 'gorra-gabardina', nombre: 'Gorra de gabardina', cat: 'accesorios', estilo: ['urbano'], tipo: 'unico', precio: 18000, descuento: 0, alta: 22, rango: 8,
    colores: [
      { id: 'negro', img: 'images/gorra-negra.webp', alt: 'Gorra negra de gabardina con visera curva', stock: { 'Único': 6 } },
    ],
    desc: 'Gorra de gabardina de algodón con visera curva y ajuste trasero regulable.',
    datos: [['Tela', 'Gabardina de algodón'], ['Visera', 'Curva'], ['Ajuste', 'Regulable'], ['Talle', 'Único']] },
  { id: 'cinturon-cuero', nombre: 'Cinturón de cuero', cat: 'accesorios', estilo: ['clasico'], tipo: 'cinto', precio: 29000, descuento: 0, alta: 12, rango: 9,
    colores: [
      { id: 'suela', img: 'images/cinturon-cuero-suela.webp', alt: 'Cinturón de cuero suela con hebilla metálica y costura a la vista', stock: { S: 1, M: 3, L: 3, XL: 1 } },
      { id: 'negro', img: 'images/cinturon-cuero-negro.webp', alt: 'Cinturón de cuero negro con hebilla metálica y costura a la vista', stock: { S: 1, M: 2, L: 2, XL: 0 } },
    ],
    desc: 'Cinturón de cuero con hebilla metálica y costura a la vista, de 3,5 cm de ancho.',
    datos: [['Material', 'Cuero'], ['Hebilla', 'Metálica'], ['Ancho', '3,5 cm'], ['Talles', 'S 85 · M 95 · L 105 · XL 115 cm']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreEn = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const tallesDeP = p => TALLES.filter(t => p.colores.some(v => t in v.stock));
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, ETIQUETAS[p.cat] || '', nombreEn(CATEGORIAS, p.cat),
    ...p.estilo.map(e => `${ETIQUETAS[e] || ''} ${nombreEn(ESTILOS, e)}`),
    ...p.colores.map(v => `${ETIQUETAS[v.id] || ''} ${nombreEn(COLORES, v.id)}`),
    tallesDeP(p).join(' '),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const variantes = (p, colores) => (colores.length ? p.colores.filter(v => colores.includes(v.id)) : p.colores);
  const hayTalle = (p, talles, colores) => variantes(p, colores).some(v => talles.some(t => (Number(v.stock?.[t]) || 0) > 0));

  function coincide(p, f) {
    const cat = lista(f.cat), estilo = lista(f.estilo), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir), tipo = lista(f.tipo);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (estilo.length && !estilo.some(e => p.estilo.includes(e))) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (color.length && !p.colores.some(v => color.includes(v.id))) return false;
    if (talle.length && !hayTalle(p, talle, color)) return false;
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
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const colorDe = id => COLORES.find(c => c.id === id) || { nombre: '', hex: '#ccc' };
const estiloTxt = p => p.estilo.map(e => (ESTILOS.find(x => x.id === e) || {}).nombre).join(' y ');
const varDe = (p, c) => (p ? p.colores.find(v => v.id === c) || p.colores[0] : null);
const stockDe = (p, c, t) => { const v = p && p.colores.find(x => x.id === c); return v ? Number(v.stock[t]) || 0 : 0; };
const tallesDe = p => TALLES.filter(t => p.colores.some(v => t in v.stock));
const tallesColor = (p, c) => { const v = varDe(p, c); return TALLES.filter(t => v && t in v.stock); };
const stockTotal = p => p.colores.reduce((s, v) => s + Object.values(v.stock).reduce((a, b) => a + (Number(b) || 0), 0), 0);
const rangoTalles = p => { const t = tallesDe(p).filter(x => p.colores.some(v => (Number(v.stock[x]) || 0) > 0)); return t.length ? (t.length === 1 ? t[0] : `${t[0]} al ${t[t.length - 1]}`) : 'agotado'; };
const prendas = n => `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const KEY_TALLE = 'mdurbanwear_talle';
let tallePref = (() => { const v = leer(KEY_TALLE, null); return v && typeof v === 'object' ? v : {}; })();
const prefPara = p => (p.tipo === 'unico' ? 'Único' : tallePref[p.tipo] || '');
const colorCon = (p, t) => (t ? (p.colores.find(v => (Number(v.stock[t]) || 0) > 0) || p.colores[0]).id : p.colores[0].id);

const ICO = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Cart = {
  KEY: 'mdurbanwear_cart',
  get() {
    const a = leer(this.KEY, []);
    if (!Array.isArray(a)) return [];
    return a.filter(i => i && getProducto(i.id) && i.qty > 0 && stockDe(getProducto(i.id), i.c, String(i.t)) > 0)
      .map(i => ({ id: i.id, c: i.c, t: String(i.t), qty: Math.min(i.qty, stockDe(getProducto(i.id), i.c, String(i.t))) }));
  },
  save(items) {
    guardar(this.KEY, items.map(({ id, c, t, qty }) => ({ id, c, t, qty })));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, c, t, qty = 1) {
    const items = this.get();
    const max = stockDe(producto, c, t);
    if (!max) return false;
    const existing = items.find(i => i.id === producto.id && i.c === c && i.t === t);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, c, t, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) > antes;
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    it.qty = Math.max(1, Math.min(qty, stockDe(getProducto(it.id), it.c, it.t)));
    this.save(items);
  },
  maxDe(idx) { const it = this.get()[idx]; return it ? stockDe(getProducto(it.id), it.c, it.t) : 1; },
  enCarrito(id, c, t) { return this.get().filter(i => i.id === id && i.c === c && i.t === t).reduce((s, i) => s + i.qty, 0); },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
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
const avisoSumado = (p, c, t, sumo) => (sumo
  ? `Sumaste ${p.nombre} en ${colorDe(c).nombre.toLowerCase()}, talle ${t}.`
  : `Ya tenés en el carrito todas las unidades que quedan en talle ${t}.`);

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--desc">-${p.descuento}%</span>`;
  if (stockTotal(p) <= 10) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  if (p.tag === 'nuevo') return '<span class="badge">Nuevo</span>';
  return '';
}
const dotsHTML = p => `<span class="dots" aria-label="${esc(p.colores.map(v => colorDe(v.id).nombre).join(', '))}">${p.colores.map(v => `<span style="background:${colorDe(v.id).hex}"></span>`).join('')}</span>`;
function swsHTML(p, c, cls = '') {
  return `<div class="sws ${cls}" role="group" aria-label="Color de ${esc(p.nombre)}">${p.colores.map(v => {
    const k = colorDe(v.id);
    return `<button type="button" class="sw" data-sw="${v.id}" aria-pressed="${v.id === c}" aria-label="${esc(k.nombre)}" title="${esc(k.nombre)}"><span style="background:${k.hex}"></span></button>`;
  }).join('')}</div>`;
}
const ANIM_CARD = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';
function talleOptions(p, c) {
  const pref = prefPara(p);
  const elegido = pref && stockDe(p, c, pref) > 0 ? pref : '';
  return '<option value="">Talle</option>' + tallesColor(p, c).map(t => {
    const s = stockDe(p, c, t);
    return `<option value="${esc(t)}"${s ? '' : ' disabled'}${t === elegido ? ' selected' : ''}>${esc(t)}${s ? '' : ' · agotado'}</option>`;
  }).join('');
}
function cardHTML(p, tipo = '', animar = true) {
  const c = colorCon(p, prefPara(p));
  const v = varDe(p, c);
  return `<article class="card${tipo ? ` card--${tipo}` : ''}" ${animar ? ANIM_CARD : ''} data-id="${p.id}" data-color="${c}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${v.img}" width="1200" height="1200" alt="${esc(v.alt)}" decoding="async"></button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)} · ${esc(estiloTxt(p))}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      <div class="card__fila">${precioHTML(p)}${dotsHTML(p)}</div>
      <div class="card__fila card__sws">${swsHTML(p, c)}<span class="sw-nom" data-sw-nom>${esc(colorDe(c).nombre)}</span></div>
      <div class="prod-actions"><select class="talle-sel" data-talle-sel="${p.id}" aria-label="Talle de ${esc(p.nombre)}">${talleOptions(p, c)}</select><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span class="prod-add__txt">Agregar</span></button></div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function vcardHTML(p, animar = true) {
  const v = varDe(p, colorCon(p, prefPara(p)));
  return `<article class="vcard" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${v.img}" width="1200" height="1200" alt="${esc(v.alt)}" decoding="async"></button>
    <div class="vcard__info">
      <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
      <p class="vcard__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="vcard__meta">${dotsHTML(p)}<span>${p.tipo === 'unico' ? 'Talle único' : `Talles ${esc(rangoTalles(p))}`}</span></p>
      <button type="button" class="vcard__add" data-quick="${p.id}" aria-label="Elegir talle y color de ${esc(p.nombre)}">${ICO.carrito}</button>
    </div>
  </article>`;
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'scale' }, 0);
  const franjas = hero.querySelectorAll('.hero__franja');
  if (franjas.length) tl.from(franjas, { scaleX: 0, duration: 1.3, stagger: 0.12, ease: 'power3.out', clearProps: 'transform' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__nota li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  const colgante = hero.querySelector('.colgante');
  if (colgante) tl.from(colgante, { y: -26, rotation: 9, opacity: 0, duration: 1.3, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }, 0.7);
  const ficha = hero.querySelector('.ficha');
  if (ficha) tl.from(ficha, { y: 34, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
}
function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero [data-hero-img]');
  if (img) gsap.to(img, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('.nav-drop__btn, a')?.focus();
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
  const lista = document.querySelector('[data-menu-categorias]');
  if (lista) {
    const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><span class="nav-drop__ico">${c.ico}</span><span class="nav-drop__nom">${esc(c.nombre)}</span><span class="nav-drop__cant">${n}</span></a></li>`;
    }).join('');
  }
  const drop = document.querySelector('[data-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const hover = window.matchMedia('(hover: hover) and (min-width: 961px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (hover.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (hover.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!drop.contains(e.target) && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(el, bd) {
  el.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); bd.classList.add('open'); }));
}
function cerrarCapa(el, bd, despues) {
  el.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => {
    el.hidden = true; bd.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open')) document.body.classList.remove('no-scroll');
    despues?.();
  }, 320);
}

const Drawer = {
  el: null, bd: null, origen: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const paso = e.target.closest('[data-linea-step]');
      if (paso) {
        const idx = Number(paso.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaStep));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const idx = Number(quitar.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        Cart.remove(idx);
        if (it) showToast(`Sacaste ${getProducto(it.id).nombre} del carrito.`);
        this.el.querySelector('.drawer__cab button')?.focus();
        return;
      }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-catalogo]')) this.close();
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-cart]');
      if (b) { e.preventDefault(); this.open(b); }
    });
    this.render();
  },
  render() {
    if (!this.el) return;
    const body = this.el.querySelector('[data-lineas]');
    const foot = this.el.querySelector('[data-foot]');
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="carrito-vacio">${ICO.carrito}<h3>Tu carrito está vacío</h3><p>Elegí una prenda, marcá tu talle y tu color, y sumala: queda guardada acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}" data-ir-catalogo>Ver la tienda</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map((it, idx) => {
      const p = getProducto(it.id);
      const v = varDe(p, it.c);
      const max = Cart.maxDe(idx);
      return `<div class="linea" data-idx="${idx}" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <img src="${v.img}" width="72" height="72" alt="">
        <div><p class="linea__nom">${esc(p.nombre)}</p><p class="linea__op">Talle ${esc(it.t)} · ${esc(colorDe(it.c).nombre)}</p>
          <div class="linea__fila"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar una unidad"${it.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${it.qty}</output><button type="button" data-linea-step="1" aria-label="Sumar una unidad"${it.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="linea__quitar" data-quitar>Quitar</button></div></div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open(origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.render();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__cab button')?.focus(), 60);
  },
  close() {
    if (!this.el || !this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};

const Modal = {
  el: null, bd: null, origen: null, p: null, c: '', t: '', qty: 1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const sw = e.target.closest('[data-sw]');
      if (sw) { this.elegirColor(sw.dataset.sw); return; }
      const talle = e.target.closest('[data-talle]');
      if (talle) { this.elegirTalle(talle.dataset.talle); return; }
      const paso = e.target.closest('[data-vstep]');
      if (paso) { this.qty += Number(paso.dataset.vstep); this.syncQty(); return; }
      if (e.target.closest('[data-vadd]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vahora]')) { this.agregar(true); return; }
      if (e.target.closest('[data-ir-guia]')) { this.close(false); return; }
      const rel = e.target.closest('[data-rel]');
      if (rel) this.mostrar(rel.dataset.rel, '', this.t);
    });
  },
  pintarTalles() {
    const cont = this.el.querySelector('[data-talles-lista]');
    if (!cont) return;
    const p = this.p;
    cont.innerHTML = tallesColor(p, this.c).map(t => `<button type="button" data-talle="${esc(t)}" aria-pressed="${t === this.t}"${stockDe(p, this.c, t) ? '' : ` disabled aria-label="Talle ${esc(t)} agotado"`}>${esc(t)}</button>`).join('');
  },
  elegirColor(c) {
    const p = this.p;
    if (!p || !p.colores.some(v => v.id === c)) return;
    this.c = c;
    const v = varDe(p, c);
    const img = this.el.querySelector('.vista__principal img');
    if (img) { img.src = v.img; img.alt = v.alt; }
    this.el.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sw === c)));
    const nom = this.el.querySelector('[data-color-nom]');
    if (nom) nom.textContent = colorDe(c).nombre;
    const wsp = this.el.querySelector('[data-vwsp]');
    if (wsp) wsp.href = waLink(`Hola M&D! Quiero consultar por ${p.nombre} en ${colorDe(c).nombre.toLowerCase()} que vi en la web.`);
    if (this.t && !stockDe(p, c, this.t)) this.t = '';
    this.pintarTalles();
    this.infoTalle();
    this.syncQty();
  },
  infoTalle() {
    const info = this.el.querySelector('[data-talle-stock]');
    if (!info) return;
    if (!this.t) { info.textContent = ''; return; }
    const s = stockDe(this.p, this.c, this.t);
    info.textContent = s <= 2 ? `Quedan ${s === 1 ? '1 unidad' : `${s} unidades`} en talle ${this.t}.` : `Hay stock en talle ${this.t}.`;
  },
  elegirTalle(t) {
    if (!this.p || !stockDe(this.p, this.c, t)) return;
    this.t = t;
    this.el.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === t)));
    const aviso = this.el.querySelector('[data-talle-aviso]');
    if (aviso) aviso.hidden = true;
    this.infoTalle();
    this.syncQty();
  },
  maximo() {
    if (!this.p || !this.t) return 1;
    return Math.max(1, stockDe(this.p, this.c, this.t) - Cart.enCarrito(this.p.id, this.c, this.t));
  },
  syncQty() {
    const max = this.maximo();
    this.qty = Math.max(1, Math.min(this.qty, max));
    const out = this.el.querySelector('[data-vqty]');
    if (out) out.textContent = this.qty;
    const menos = this.el.querySelector('[data-vstep="-1"]'), mas = this.el.querySelector('[data-vstep="1"]');
    if (menos) menos.disabled = this.qty <= 1;
    if (mas) mas.disabled = this.qty >= max;
  },
  agregar(ahora) {
    const p = this.p;
    if (!p) return;
    if (!this.t) {
      const aviso = this.el.querySelector('[data-talle-aviso]');
      if (aviso) aviso.hidden = false;
      this.el.querySelector('[data-talle]:not([disabled])')?.focus();
      return;
    }
    const sumo = Cart.add(p, this.c, this.t, this.qty);
    if (ahora) {
      this.close(false);
      setTimeout(() => Drawer.open(this.origen), 340);
    } else {
      showToast(avisoSumado(p, this.c, this.t, sumo));
      this.syncQty();
    }
  },
  html(p, c) {
    const v = varDe(p, c);
    const rel = Tienda.consultar({ filtros: { estilo: p.estilo, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const unico = p.tipo === 'unico';
    return `<div class="vista">
      <div class="vista__galeria"><div class="vista__principal"><img src="${v.img}" alt="${esc(v.alt)}" width="1200" height="1200"></div></div>
      <div class="vista__info">
        <p class="vista__cat">${esc(catDe(p.cat).nombre)} · ${esc(estiloTxt(p))}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        <div class="colores"><span class="colores__etq">Color: <b data-color-nom>${esc(colorDe(c).nombre)}</b></span>${swsHTML(p, c)}</div>
        <fieldset class="talles"><legend>${unico ? 'Talle' : 'Elegí tu talle'}</legend><div class="talles__lista" data-talles-lista></div><p class="talles__aviso" data-talle-aviso hidden>Elegí tu talle para sumarlo al carrito.</p><p class="talles__stock" data-talle-stock></p>${unico ? '' : '<a class="talles__guia" href="#talles" data-ir-guia>¿No sabés tu talle? Medite en un minuto</a>'}</fieldset>
        <div class="vista__compra">
          <div class="stepper"><button type="button" data-vstep="-1" aria-label="Restar una unidad">${ICO.menos}</button><output data-vqty aria-live="polite">1</output><button type="button" data-vstep="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vadd>Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-vahora>Comprar ahora</button>
        </div>
        <dl class="vista__datos">${(p.datos || []).map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
        <a class="link-wsp vista__wsp" href="${waLink(`Hola M&D! Quiero consultar por ${p.nombre} en ${colorDe(c).nombre.toLowerCase()} que vi en la web.`)}" data-vwsp target="_blank" rel="noopener">${ICO.wsp} Consultar por esta prenda</a>
        ${rel.length ? `<div class="relacionados"><h3>También te puede interesar</h3><div class="relacionados__lista">${rel.map(r => `<button type="button" data-rel="${r.id}"><img src="${r.colores[0].img}" alt="" width="200" height="200">${esc(r.nombre)}</button>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  },
  mostrar(id, color, talle) {
    const p = getProducto(id);
    if (!p) return;
    const pref = [talle, prefPara(p)].find(t => t && p.colores.some(v => (Number(v.stock[t]) || 0) > 0)) || '';
    let c = p.colores.some(v => v.id === color) ? color : colorCon(p, pref);
    if (pref && !stockDe(p, c, pref)) c = colorCon(p, pref);
    this.p = p; this.c = c; this.t = ''; this.qty = 1;
    this.el.querySelector('[data-modal-cuerpo]').innerHTML = this.html(p, c);
    this.el.setAttribute('aria-label', `Detalle: ${p.nombre}`);
    this.el.scrollTop = 0;
    this.pintarTalles();
    if (p.tipo === 'unico') this.elegirTalle('Único');
    else if (pref) this.elegirTalle(pref);
    this.syncQty();
    const guia = this.el.querySelector('[data-ir-guia]');
    if (guia) guia.href = document.getElementById('talles') ? '#talles' : `${HOME_URL}#talles`;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', id); history.replaceState(null, '', u); }
  },
  open(id, origen, color, talle) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.mostrar(id, color, talle);
    if (!this.el.classList.contains('open')) abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
  },
  close(devolver = true) {
    if (!this.el || !this.el.classList.contains('open')) return;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); history.replaceState(null, '', u); }
    cerrarCapa(this.el, this.bd, () => { if (devolver) this.origen?.focus?.(); });
  },
};

const cardDe = el => el.closest('.card, .vcard');
function talleDeCard(el) {
  return cardDe(el)?.querySelector('[data-talle-sel]') || null;
}
function pedirTalle(sel) {
  if (!sel) return;
  sel.setAttribute('aria-invalid', 'true');
  sel.focus();
  showToast('Elegí tu talle para sumarlo al carrito.');
}
function cambiarColorCard(card, c) {
  const p = getProducto(card.dataset.id);
  if (!p || !p.colores.some(v => v.id === c)) return;
  card.dataset.color = c;
  const v = varDe(p, c);
  const img = card.querySelector('.card__foto img');
  if (img) { img.src = v.img; img.alt = v.alt; }
  card.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sw === c)));
  const nom = card.querySelector('[data-sw-nom]');
  if (nom) nom.textContent = colorDe(c).nombre;
  const sel = card.querySelector('[data-talle-sel]');
  if (sel) {
    const antes = sel.value;
    sel.innerHTML = talleOptions(p, c);
    if (antes && stockDe(p, c, antes)) sel.value = antes;
    sel.removeAttribute('aria-invalid');
  }
}
function initCardAcciones() {
  document.addEventListener('click', e => {
    if (e.target.closest('.modal, .drawer')) return;
    const sw = e.target.closest('.card [data-sw]');
    if (sw) { cambiarColorCard(cardDe(sw), sw.dataset.sw); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) { const card = cardDe(quick); Modal.open(quick.dataset.quick, quick, card?.dataset.color || '', talleDeCard(quick)?.value || ''); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = cardDe(add);
      const sel = talleDeCard(add);
      if (!sel) { Modal.open(p.id, add); return; }
      if (!sel.value) { pedirTalle(sel); return; }
      const c = card.dataset.color || p.colores[0].id;
      const sumo = Cart.add(p, c, sel.value, 1);
      showToast(avisoSumado(p, c, sel.value, sumo));
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      return;
    }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) {
      const p = getProducto(ahora.dataset.ahora);
      if (!p) return;
      const sel = talleDeCard(ahora);
      if (!sel || !sel.value) { pedirTalle(sel); return; }
      Cart.add(p, cardDe(ahora).dataset.color || p.colores[0].id, sel.value, 1);
      Drawer.open(ahora);
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle-sel]');
    if (sel) { sel.removeAttribute('aria-invalid'); delete sel.dataset.auto; }
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

function initConteos() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = prendas(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-precio-de]').forEach(el => { const p = getProducto(el.dataset.precioDe); if (p) el.textContent = formatearPrecio(precioFinal(p)); });
}
function porIds(lista) {
  const ids = lista.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  const items = Tienda.consultar({ filtros: { ids }, limite: ids.length }).items;
  return ids.map(id => items.find(p => p.id === id)).filter(Boolean);
}
function initPreview() {
  const fichas = document.querySelector('[data-fichas]');
  if (fichas) fichas.innerHTML = porIds(fichas.dataset.fichas).map(p => cardHTML(p, 'h')).join('');
}
function initVitrina() {
  const grid = document.querySelector('[data-vitrina]');
  if (!grid) return;
  const link = document.querySelector('[data-vitrina-link]');
  const pintar = estilo => {
    const filtros = estilo ? { estilo: [estilo] } : { excluir: ['cinturon-cuero'] };
    grid.innerHTML = Tienda.consultar({ filtros, limite: 8 }).items.map(p => vcardHTML(p)).join('');
    if (link) link.href = estilo ? `${CATALOGO_URL}?estilo=${estilo}` : CATALOGO_URL;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  document.querySelectorAll('[data-pestana]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-pestana]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(b.dataset.pestana);
  }));
  const filtros = { excluir: ['cinturon-cuero'] };
  grid.innerHTML = Tienda.consultar({ filtros, limite: 8 }).items.map(p => vcardHTML(p)).join('');
}
function initSwitch() {
  const sw = document.querySelector('.switch');
  const paneles = document.querySelectorAll('[data-panel]');
  if (!sw || !paneles.length) return;
  const activar = est => {
    sw.dataset.activo = est;
    sw.querySelectorAll('[data-switch]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.switch === est)));
    paneles.forEach(p => {
      const on = p.dataset.panel === est;
      p.classList.toggle('activo', on);
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on) p.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    });
  };
  sw.addEventListener('click', e => { const b = e.target.closest('[data-switch]'); if (b) activar(b.dataset.switch); });
  activar('urbano');
}
function initFicha() {
  const f = document.querySelector('[data-ficha]');
  if (!f) return;
  const p = getProducto(f.dataset.ficha);
  if (!p) return;
  const coloresEl = f.querySelector('[data-ficha-colores]');
  const tallesEl = f.querySelector('[data-ficha-talles]');
  const nomEl = f.querySelector('[data-ficha-color-nom]');
  let c = p.colores[0].id;
  let t = '';
  const pintar = () => {
    coloresEl.innerHTML = swsHTML(p, c);
    tallesEl.innerHTML = tallesColor(p, c).map(x => `<button type="button" data-ficha-talle="${esc(x)}" aria-pressed="${x === t}"${stockDe(p, c, x) ? '' : ` disabled aria-label="Talle ${esc(x)} agotado"`}>${esc(x)}</button>`).join('');
    nomEl.textContent = colorDe(c).nombre;
  };
  const pref = prefPara(p);
  if (pref && stockDe(p, c, pref)) t = pref;
  pintar();
  f.addEventListener('click', e => {
    const sw = e.target.closest('[data-sw]');
    if (sw) { c = sw.dataset.sw; if (t && !stockDe(p, c, t)) t = ''; pintar(); return; }
    const tb = e.target.closest('[data-ficha-talle]');
    if (tb) { t = tb.dataset.fichaTalle; pintar(); return; }
    if (e.target.closest('[data-ficha-sumar]')) {
      if (!t) { showToast('Elegí tu talle para sumarla al carrito.'); tallesEl.querySelector('button:not([disabled])')?.focus(); return; }
      showToast(avisoSumado(p, c, t, Cart.add(p, c, t, 1)));
    }
  });
}

const TABLA_ARRIBA = [['S', 86, 93], ['M', 94, 101], ['L', 102, 109], ['XL', 110, 117], ['XXL', 118, 126]];
const TABLA_ABAJO = [['38', 70, 77], ['40', 78, 82], ['42', 83, 87], ['44', 88, 92], ['46', 93, 97], ['48', 98, 105]];
const TABLA_CINTO = [['S', 70, 82], ['M', 83, 92], ['L', 93, 100], ['XL', 101, 105]];
function talleEn(tabla, cm) {
  const v = Math.round(cm);
  if (v < tabla[0][1]) return { t: tabla[0][0], fuera: 'menor' };
  if (v > tabla[tabla.length - 1][2]) return { t: tabla[tabla.length - 1][0], fuera: 'mayor' };
  const fila = tabla.find(([, a, b]) => v >= a && v <= b) || tabla[tabla.length - 1];
  return { t: fila[0], fuera: '' };
}
function talleGuia(pecho, cintura) {
  return { arriba: talleEn(TABLA_ARRIBA, pecho), abajo: talleEn(TABLA_ABAJO, cintura), cinto: talleEn(TABLA_CINTO, cintura) };
}
function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const rangos = { pecho: g.querySelector('[data-guia-rango="pecho"]'), cintura: g.querySelector('[data-guia-rango="cintura"]') };
  const vals = { pecho: g.querySelector('[data-guia-val="pecho"]'), cintura: g.querySelector('[data-guia-val="cintura"]') };
  const tag = g.querySelector('.tag-talle');
  const tagT = g.querySelector('[data-guia-tag]');
  const tagSub = g.querySelector('[data-guia-tag-sub]');
  const titulo = g.querySelector('[data-guia-titulo]');
  const detalle = g.querySelector('[data-guia-detalle]');
  const lista = g.querySelector('[data-guia-sugeridos]');
  const linkCat = g.querySelector('[data-guia-catalogo]');
  const wsp = g.querySelector('[data-guia-wsp]');
  const catUrl = g.dataset.catalogoUrl || CATALOGO_URL;
  let ultimo = '';
  const sugeridos = r => {
    const filas = [];
    [['arriba', r.arriba.t], ['abajo', r.abajo.t], ['cinto', r.cinto.t]].forEach(([tipo, t]) => {
      const p = Tienda.consultar({ filtros: { tipo: [tipo], talle: [t] }, limite: 1 }).items[0];
      if (p) filas.push({ p, t, c: colorCon(p, t) });
    });
    return filas;
  };
  const pintar = guardarPref => {
    const pecho = Number(rangos.pecho.value), cintura = Number(rangos.cintura.value);
    Object.entries(rangos).forEach(([k, el]) => {
      vals[k].textContent = `${el.value} cm`;
      el.style.setProperty('--p', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
    });
    const r = talleGuia(pecho, cintura);
    tagT.textContent = r.arriba.t;
    tagSub.textContent = `Pantalón ${r.abajo.t}`;
    const clave = `${r.arriba.t}-${r.abajo.t}`;
    if (clave !== ultimo && ultimo && !reduceMotion) { tag.classList.remove('cambio'); void tag.offsetWidth; tag.classList.add('cambio'); }
    ultimo = clave;
    titulo.textContent = `Arriba ${r.arriba.t} · Pantalón ${r.abajo.t}`;
    const fuera = r.arriba.fuera || r.abajo.fuera;
    detalle.textContent = fuera ? 'Tu medida queda en el borde de la tabla: escribinos y te asesoramos.' : `Cinturón ${r.cinto.t} · ${prendas(Tienda.contar({ talle: [r.arriba.t, r.abajo.t] }))} con stock en tus talles`;
    const filas = sugeridos(r);
    lista.innerHTML = filas.length
      ? filas.map(({ p, t, c }) => `<li><span class="guia__sug-nom">${esc(p.nombre)}<small>Talle ${esc(t)} · ${esc(colorDe(c).nombre)} · ${formatearPrecio(precioFinal(p))}</small></span><button type="button" class="btn btn--cta" data-guia-sumar="${p.id}" data-c="${c}" data-t="${esc(t)}" aria-label="Sumar ${esc(p.nombre)} talle ${esc(t)} al carrito">Sumar</button></li>`).join('')
      : '<li class="guia__vacio">No hay prendas con stock en esa medida. Escribinos y te avisamos cuando entren.</li>';
    linkCat.href = `${catUrl}?talle=${encodeURIComponent(`${r.arriba.t},${r.abajo.t}`)}`;
    linkCat.firstChild.textContent = `Ver todo en ${r.arriba.t} y ${r.abajo.t} `;
    wsp.href = waLink(`Hola M&D! Me medí: pecho ${pecho} cm y cintura ${cintura} cm (según la guía, arriba ${r.arriba.t} y pantalón ${r.abajo.t}). ¿Me ayudan a elegir?`);
    if (guardarPref) {
      tallePref = { arriba: r.arriba.t, abajo: r.abajo.t, cinto: r.cinto.t, pecho, cintura };
      guardar(KEY_TALLE, tallePref);
      document.querySelectorAll('.card[data-id]').forEach(card => {
        const sel = card.querySelector('[data-talle-sel]');
        const p = getProducto(card.dataset.id);
        if (!sel || (sel.value && !sel.dataset.auto) || !p) return;
        const t = prefPara(p);
        const op = t && sel.querySelector(`option[value="${t}"]:not([disabled])`);
        if (op) { sel.value = t; sel.dataset.auto = '1'; }
      });
    }
  };
  Object.values(rangos).forEach(el => el.addEventListener('input', () => pintar(true)));
  g.addEventListener('click', e => {
    const b = e.target.closest('[data-guia-paso]');
    if (b) {
      const el = rangos[b.dataset.guiaPaso];
      el.value = Math.min(Number(el.max), Math.max(Number(el.min), Number(el.value) + Number(b.dataset.d)));
      pintar(true);
      return;
    }
    const s = e.target.closest('[data-guia-sumar]');
    if (s) {
      const p = getProducto(s.dataset.guiaSumar);
      if (p) showToast(avisoSumado(p, s.dataset.c, s.dataset.t, Cart.add(p, s.dataset.c, s.dataset.t, 1)));
    }
  });
  if (tallePref.pecho) rangos.pecho.value = tallePref.pecho;
  if (tallePref.cintura) rangos.cintura.value = tallePref.cintura;
  pintar(false);
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const pos = [-33.686802, -65.4664949];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(pos, 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', iconSize: [26, 26] });
  L.marker(pos, { icon: icono, keyboard: false, alt: 'M&D Urban Wear, Pedernera 327' }).addTo(mapa).bindTooltip('M&D Urban Wear · Pedernera 327', { direction: 'top', offset: [0, -16] });
  setTimeout(() => mapa.invalidateSize(), 500);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const buscador = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const contador = document.querySelector('[data-contador]');
  const verMas = document.querySelector('[data-ver-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const params = new URLSearchParams(location.search);
  const TALLES_OP = TALLES.map(t => ({ id: t, nombre: t }));
  const valida = (lista, v) => lista.some(x => x.id === v);
  const multiples = (clave, lista) => (params.get(clave) || '').split(',').filter(v => valida(lista, v));
  const estado = {
    cat: multiples('cat', CATEGORIAS),
    estilo: multiples('estilo', ESTILOS),
    color: multiples('color', COLORES),
    talle: multiples('talle', TALLES_OP),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
    q: (params.get('q') || '').slice(0, 60),
  };
  const GRUPOS = { cat: CATEGORIAS, estilo: ESTILOS, color: COLORES };
  Object.entries(GRUPOS).forEach(([g, lista]) => {
    const cont = form.querySelector(`[data-ops="${g}"]`);
    if (!cont) return;
    cont.innerHTML = lista.filter(x => Tienda.contar({ [g]: x.id }) > 0).map(x => `<label class="opcion"><input type="checkbox" data-f="${g}" value="${x.id}"${estado[g].includes(x.id) ? ' checked' : ''}>${g === 'color' ? `<span class="opcion__dot" style="background:${x.hex}"></span>` : ''} ${esc(x.nombre)} <small>${Tienda.contar({ [g]: x.id })}</small></label>`).join('');
  });
  const tallesCont = form.querySelector('[data-ops="talle"]');
  if (tallesCont) {
    tallesCont.innerHTML = TALLES.map(t => `<label class="talle-chip${t === 'Único' ? ' talle-chip--ancho' : ''}" title="${prendas(Tienda.contar({ talle: [t] }))} en talle ${t}"><input type="checkbox" data-f="talle" value="${t}"${estado.talle.includes(t) ? ' checked' : ''} aria-label="Talle ${t}"><span aria-hidden="true">${t}</span></label>`).join('');
  }
  const precioCont = form.querySelector('[data-ops="precio"]');
  if (precioCont) {
    precioCont.innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(x => `<label class="opcion"><input type="radio" name="precio" value="${x.id}"${estado.precio === x.id ? ' checked' : ''}> ${esc(x.nombre)}</label>`).join('');
  }
  if (ordenSel) ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === estado.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  if (buscador) buscador.value = estado.q;
  const hb = document.getElementById('buscar-h');
  if (hb) hb.value = estado.q;

  const filtros = () => {
    const f = { cat: estado.cat, estilo: estado.estilo, color: estado.color, talle: estado.talle };
    const pr = PRECIOS.find(x => x.id === estado.precio);
    if (pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    if (estado.q.trim()) f.q = estado.q.trim();
    return f;
  };
  const syncUrl = () => {
    const u = new URL(location.href);
    ['cat', 'estilo', 'color', 'talle', 'precio', 'orden', 'q', 'buscar'].forEach(k => u.searchParams.delete(k));
    ['cat', 'estilo', 'color', 'talle'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    if (estado.q.trim()) u.searchParams.set('q', estado.q.trim());
    history.replaceState(null, '', u);
  };
  let cursor = null, mostrados = 0;
  const pintarCard = p => (MODELO === '2' ? vcardHTML(p) : cardHTML(p));
  function render(reiniciar) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const r = Tienda.consultar({ filtros: f, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = r.cursor;
    mostrados += r.items.length;
    if (reiniciar && !r.items.length) {
      grid.innerHTML = `<div class="vacio"><h2>No hay prendas con esos filtros</h2><p>Probá con otra palabra o sacá algún filtro: la tienda tiene ${prendas(Tienda.contar({}))}.</p><button type="button" class="btn btn--cta" data-limpiar>Ver todas las prendas</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', r.items.map(pintarCard).join(''));
    }
    const total = f.q ? null : Tienda.contar(f);
    if (contador) contador.textContent = total != null ? `${prendas(total)}${total !== Tienda.contar({}) ? ' con estos filtros' : ''}` : `${prendas(mostrados)}${cursor ? ' o más' : ''} para «${f.q}»`;
    if (verMas) verMas.hidden = !cursor;
    if (miga) {
      const una = estado.cat.length === 1 ? catDe(estado.cat[0]).nombre : '';
      miga.hidden = !una; miga.textContent = una;
    }
    document.querySelectorAll('[data-menu-categorias] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const sincronizarControles = () => {
    form.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador) buscador.value = estado.q;
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) estado[t.dataset.f] = [...form.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
    if (t.name === 'precio') estado.precio = t.value;
    syncUrl(); render(true);
  });
  form.addEventListener('submit', e => e.preventDefault());
  const limpiar = () => {
    estado.cat = []; estado.estilo = []; estado.color = []; estado.talle = []; estado.precio = ''; estado.q = '';
    sincronizarControles(); syncUrl(); render(true);
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-limpiar]')) limpiar(); });
  if (ordenSel) ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; syncUrl(); render(true); });
  let t = 0;
  if (buscador) {
    buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); }, 250); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); });
  }
  if (verMas) verMas.querySelector('button')?.addEventListener('click', () => render(false));
  render(true);
  if (params.has('buscar') && buscador) setTimeout(() => buscador.focus(), 300);

  const panel = document.querySelector('.filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(min-width: 901px)');
  let bd = null;
  const cerrarPanel = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  if (abrirBtn && panel) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd);
    abrirBtn.addEventListener('click', () => {
      panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll');
      abrirBtn.setAttribute('aria-expanded', 'true');
      panel.querySelector('button, input')?.focus();
    });
    bd.addEventListener('click', cerrarPanel);
    panel.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarPanel(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPanel(); else if (panel.classList.contains('open')) atrapar(panel, e); });
  }
  const detalles = [...document.querySelectorAll('.filtro')];
  const ajustarDetalles = () => {
    const comoBarra = MODELO === '2' && mq.matches;
    detalles.forEach(d => { d.open = !comoBarra; });
    if (mq.matches) cerrarPanel();
  };
  ajustarDetalles();
  mq.addEventListener('change', ajustarDetalles);
  if (MODELO === '2') {
    detalles.forEach(d => d.addEventListener('toggle', () => { if (d.open && mq.matches) detalles.forEach(o => { if (o !== d) o.open = false; }); }));
    document.addEventListener('click', e => { if (mq.matches && !e.target.closest('.filtro')) detalles.forEach(d => { d.open = false; }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mq.matches) detalles.forEach(d => { d.open = false; }); });
  }
}

function initBuscar() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    const input = document.getElementById('buscar');
    if (!input) return;
    e.preventDefault();
    input.scrollIntoView({ block: 'center' });
    input.focus();
  }));
  const hf = document.querySelector('.buscador-h');
  const cat = document.getElementById('buscar');
  if (hf && cat) hf.addEventListener('submit', e => {
    e.preventDefault();
    cat.value = hf.querySelector('input').value.slice(0, 60);
    cat.dispatchEvent(new Event('input', { bubbles: true }));
    cat.scrollIntoView({ block: 'center' });
  });
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) Modal.open(id);
}

initMenuCategorias();
initConteos();
initPreview();
initVitrina();
initCatalogo();
initSwitch();
initReveals();
initNav();
initModelBarScroll();
initHeroMotion();
initParallax();
initGuia();
initFicha();
initCardAcciones();
Drawer.init();
Modal.init();
initFloats();
updateCartBadge();
initBuscar();
abrirProductoDeUrl();
try { initMapa(); } catch (err) { }
