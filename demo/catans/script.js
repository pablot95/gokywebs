const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
document.documentElement.classList.add('js');

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

const WSP = '5491125819671';
const MARCA = 'Catan’s';
const CATEGORIAS = [
  { id: 'bodys', nombre: 'Bodys', titulo: 'Bodys', bajada: 'Con personaje y estampados', img: 'images/p-mike.webp' },
  { id: 'conjuntos', nombre: 'Conjuntos', titulo: 'Conjuntos', bajada: 'Corazones, volados y dos piezas', img: 'images/p-conjunto-fucsia.webp' },
  { id: 'enteritos', nombre: 'Enteritos y saquitos', titulo: 'Enteritos y saquitos', bajada: 'Para pasear y abrigar', img: 'images/p-saquito.webp' },
  { id: 'remeras', nombre: 'Remeras y pantalones', titulo: 'Remeras y pantalones', bajada: 'Para los que ya caminan', img: 'images/p-remera-nube.webp' },
];
const EDADES = [
  { id: 'bebe', nombre: 'Bebés', titulo: 'Ropa de bebé', bajada: 'Recién nacido a 18 meses' },
  { id: 'nino', nombre: 'Niños', titulo: 'Ropa de niños', bajada: '2 a 4 años' },
];
const TALLES = [
  { id: 'rn', nombre: 'Recién nacido', corto: 'RN', edad: 'bebe', peso: 'Hasta 3,5 kg', altura: 'Hasta 50 cm' },
  { id: '0-3', nombre: '0 a 3 meses', corto: '0-3 m', edad: 'bebe', peso: '3,5 a 6 kg', altura: '50 a 60 cm' },
  { id: '3-6', nombre: '3 a 6 meses', corto: '3-6 m', edad: 'bebe', peso: '6 a 7,5 kg', altura: '60 a 67 cm' },
  { id: '6-9', nombre: '6 a 9 meses', corto: '6-9 m', edad: 'bebe', peso: '7,5 a 9 kg', altura: '67 a 72 cm' },
  { id: '9-12', nombre: '9 a 12 meses', corto: '9-12 m', edad: 'bebe', peso: '9 a 10 kg', altura: '72 a 78 cm' },
  { id: '12-18', nombre: '12 a 18 meses', corto: '12-18 m', edad: 'bebe', peso: '10 a 11,5 kg', altura: '78 a 86 cm' },
  { id: '2', nombre: '2 años', corto: '2 años', edad: 'nino', peso: '11,5 a 13 kg', altura: '86 a 92 cm' },
  { id: '3', nombre: '3 años', corto: '3 años', edad: 'nino', peso: '13 a 15 kg', altura: '92 a 98 cm' },
  { id: '4', nombre: '4 años', corto: '4 años', edad: 'nino', peso: '15 a 17 kg', altura: '98 a 104 cm' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15a25', nombre: '$15.000 a $25.000', min: 15000, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25000, max: null },
];
const BEBE = ['0-3', '3-6', '6-9', '9-12'];
const PRODUCTOS = [
  { id: 'body-mike', rango: 1, cat: 'bodys', nombre: 'Body Mike Wazowski «Happy mini me»', precio: 16900, descuento: 0, etiqueta: 'Personaje', real: true, talles: BEBE, img: 'images/p-mike.webp', alt: 'Body blanco de bebé con Mike Wazowski estampado y la frase Happy mini me', desc: 'Body blanco de manga corta con Mike Wazowski estampado y la frase «Happy mini me». Se prende abajo con broches para cambiarlo fácil.', ficha: ['Body de manga corta', 'Estampa de Mike Wazowski', 'Broches en la entrepierna'], claves: ['personaje', 'monsters', 'monster', 'mike', 'wazowski', 'happy', 'verde', 'blanco'] },
  { id: 'body-tigger', rango: 2, cat: 'bodys', nombre: 'Body Tigger', precio: 16900, descuento: 0, etiqueta: 'Personaje', real: true, talles: BEBE, img: 'images/p-tigger.webp', alt: 'Body blanco de bebé con la cara de Tigger y su nombre en naranja', desc: 'Body blanco de manga corta con la cara de Tigger y su nombre estampados en naranja. Se prende abajo con broches.', ficha: ['Body de manga corta', 'Estampa de Tigger', 'Broches en la entrepierna'], claves: ['personaje', 'pooh', 'winnie', 'tigger', 'tigre', 'naranja', 'blanco'] },
  { id: 'body-mickey', rango: 3, cat: 'bodys', nombre: 'Body Mickey «Happy mini me»', precio: 16900, descuento: 0, etiqueta: 'Personaje', real: true, talles: BEBE, img: 'images/p-mickey.webp', alt: 'Body blanco de bebé con Mickey dibujado en línea y la palabra Happy en rojo', desc: 'Body blanco de manga corta con Mickey dibujado en línea negra y «Happy mini me» en rojo. Se prende abajo con broches.', ficha: ['Body de manga corta', 'Estampa de Mickey', 'Broches en la entrepierna'], claves: ['personaje', 'disney', 'mickey', 'mouse', 'happy', 'rojo', 'blanco'] },
  { id: 'body-minnie', rango: 4, cat: 'bodys', nombre: 'Body Minnie «Happy mini me»', precio: 16900, descuento: 0, etiqueta: 'Personaje', real: true, talles: BEBE, img: 'images/p-minnie.webp', alt: 'Body blanco de bebé con Minnie de moño rosa y la palabra Happy en negro', desc: 'Body blanco de manga corta con Minnie de moño rosa y «Happy mini me» en letras negras. Se prende abajo con broches.', ficha: ['Body de manga corta', 'Estampa de Minnie', 'Broches en la entrepierna'], claves: ['personaje', 'disney', 'minnie', 'mouse', 'happy', 'rosa', 'moño', 'blanco'] },
  { id: 'enterito-conejita', rango: 5, cat: 'enteritos', nombre: 'Enterito corto de corazones', precio: 22900, descuento: 0, talles: BEBE, img: 'images/p-enterito.webp', alt: 'Enterito corto blanco con corazones rosas, ribetes rosa y una conejita en el pecho', desc: 'Enterito de manga corta con corazones rosas, ribetes al tono y una conejita estampada en el pecho. Abre adelante con botones.', ficha: ['Manga y pierna cortas', 'Abre adelante con botones', 'Conejita estampada'], claves: ['enterito', 'mameluco', 'pijama', 'corazones', 'conejita', 'conejo', 'rosa'] },
  { id: 'conjunto-fucsia', rango: 6, cat: 'conjuntos', nombre: 'Conjunto corazones fucsia', precio: 27900, descuento: 0, real: true, talles: ['3-6', '6-9', '9-12', '12-18'], img: 'images/p-conjunto-fucsia.webp', alt: 'Body blanco con corazones fucsia y volados, con mangas largas fucsia con volado', desc: 'Body blanco con corazones fucsia y volados en los hombros, con mangas largas fucsia terminadas en volado.', ficha: ['Body con volados', 'Mangas largas fucsia', 'Corazones estampados'], claves: ['conjunto', 'corazones', 'fucsia', 'rosa', 'volados', 'nena', 'manga larga'] },
  { id: 'saquito-conejo', rango: 7, cat: 'enteritos', nombre: 'Saquito tejido con conejito', precio: 31900, descuento: 0, talles: ['3-6', '6-9', '9-12', '12-18', '2'], img: 'images/p-saquito.webp', alt: 'Saquito tejido color crudo con botones de madera y un conejito bordado', desc: 'Saquito de punto color crudo, con botones de madera y un conejito con una mariposa bordados al frente.', ficha: ['Tejido de punto', 'Botones de madera', 'Conejito bordado'], claves: ['saquito', 'saco', 'cardigan', 'tejido', 'abrigo', 'conejo', 'crudo', 'invierno'] },
  { id: 'body-arcoiris', rango: 8, cat: 'bodys', nombre: 'Body arcoíris', precio: 14900, descuento: 0, talles: ['rn', '0-3', '3-6', '6-9'], img: 'images/p-arcoiris.webp', alt: 'Body blanco de bebé con un arcoíris en tonos pastel', desc: 'Body blanco de manga corta con un arcoíris en tonos pastel estampado al frente.', ficha: ['Body de manga corta', 'Arcoíris pastel', 'Broches en la entrepierna'], claves: ['arcoiris', 'pastel', 'unisex', 'blanco'] },
  { id: 'conjunto-gris', rango: 9, cat: 'conjuntos', nombre: 'Conjunto corazones con short', precio: 27900, descuento: 0, real: true, talles: ['3-6', '6-9', '9-12', '12-18'], img: 'images/p-conjunto-gris.webp', alt: 'Body blanco con corazones grises y volados, con short gris con volado', desc: 'Body blanco con corazones grises y volados en los hombros, con short gris terminado en volado.', ficha: ['Body con volados', 'Short con volado', 'Corazones estampados'], claves: ['conjunto', 'corazones', 'gris', 'short', 'volados', 'nena', 'verano'] },
  { id: 'conjunto-conejita', rango: 10, cat: 'conjuntos', nombre: 'Conjunto conejita dos piezas', precio: 29900, descuento: 0, talles: ['0-3', '3-6', '6-9', '9-12', '12-18'], img: 'images/p-conejita.webp', alt: 'Remera de manga larga con una conejita y pantalón al tono, con corazones rosas', desc: 'Remera de manga larga con una conejita estampada y pantalón al tono, los dos con corazones rosas.', ficha: ['Remera de manga larga', 'Pantalón al tono', 'Conejita estampada'], claves: ['conjunto', 'conejita', 'conejo', 'corazones', 'rosa', 'pantalon', 'manga larga', 'dos piezas'] },
  { id: 'body-lunares', rango: 11, cat: 'bodys', nombre: 'Body lunares celestes', precio: 13900, descuento: 0, talles: ['rn', '0-3', '3-6', '6-9', '9-12'], img: 'images/p-lunares.webp', alt: 'Body blanco de bebé con lunarcitos celestes', desc: 'Body blanco de manga corta con lunarcitos celestes en toda la prenda.', ficha: ['Body de manga corta', 'Lunares celestes', 'Broches en la entrepierna'], claves: ['lunares', 'celeste', 'puntitos', 'nene', 'basico', 'blanco'] },
  { id: 'body-solcito', rango: 12, cat: 'bodys', nombre: 'Body solcito bordado', precio: 14900, descuento: 0, talles: ['rn', '0-3', '3-6', '6-9'], img: 'images/p-solcito.webp', alt: 'Body blanco liso con un solcito amarillo bordado en el pecho', desc: 'Body blanco liso de manga corta con un solcito amarillo bordado en el pecho.', ficha: ['Body de manga corta', 'Solcito bordado', 'Broches en la entrepierna'], claves: ['sol', 'solcito', 'bordado', 'liso', 'amarillo', 'basico', 'unisex', 'blanco'] },
  { id: 'body-flores', rango: 13, cat: 'bodys', nombre: 'Body flores rosas', precio: 14900, descuento: 10, talles: BEBE, img: 'images/p-flores.webp', alt: 'Body blanco de bebé con florcitas rosas y hojitas verdes', desc: 'Body blanco de manga corta con florcitas rosas y hojitas verdes estampadas.', ficha: ['Body de manga corta', 'Florcitas estampadas', 'Broches en la entrepierna'], claves: ['flores', 'florcitas', 'rosa', 'nena', 'blanco'] },
  { id: 'remera-nube', rango: 14, cat: 'remeras', nombre: 'Remera nube celeste', precio: 15900, descuento: 0, talles: ['12-18', '2', '3', '4'], img: 'images/p-remera-nube.webp', alt: 'Remera celeste de manga corta con una nubecita bordada', desc: 'Remera celeste de manga corta con una nubecita sonriente en el pecho.', ficha: ['Remera de manga corta', 'Nubecita en el pecho', 'Cuello redondo'], claves: ['remera', 'nube', 'celeste', 'nene', 'nino', 'verano'] },
  { id: 'pantalon-corazones', rango: 15, cat: 'remeras', nombre: 'Pantalón de corazones', precio: 13900, descuento: 0, talles: ['6-9', '9-12', '12-18', '2', '3'], img: 'images/p-pantalon.webp', alt: 'Pantalón largo blanco con corazones rosas y cintura elastizada', desc: 'Pantalón largo blanco con corazones rosas y cintura elastizada, para combinar con bodys y remeras.', ficha: ['Pantalón largo', 'Cintura elastizada', 'Corazones rosas'], claves: ['pantalon', 'calza', 'corazones', 'rosa', 'nena'] },
  { id: 'prueba-oculto', rango: 99, cat: 'bodys', nombre: 'Producto de prueba', precio: 1000, descuento: 0, visible: false, talles: ['0-3'], img: 'images/p-solcito.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const talleDe = id => TALLES.find(t => t.id === id);
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const edadesDe = p => EDADES.filter(e => (p.talles || []).some(t => talleDe(t)?.edad === e.id)).map(e => e.id);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};
const rangoTalles = p => {
  const ts = (p.talles || []).map(talleDe).filter(Boolean);
  if (!ts.length) return '';
  if (ts.length === 1) return ts[0].corto;
  const meses = t => t.id.includes('-');
  const ini = t => (t.id === 'rn' ? 'RN' : meses(t) ? t.id.split('-')[0] : t.corto);
  const fin = t => (t.id === 'rn' ? 'RN' : meses(t) ? `${t.id.split('-')[1]} m` : t.corto);
  const a = ts[0], b = ts[ts.length - 1];
  return `${ini(a)}${meses(a) && !meses(b) ? ' m' : ''} a ${fin(b)}`;
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, catDe(p.cat).bajada, ...edadesDe(p).map(e => `${nombreDe(EDADES, e)} ${EDADES.find(x => x.id === e).titulo}`),
    ...(p.talles || []).map(t => `${talleDe(t)?.nombre || ''} ${talleDe(t)?.corto || ''}`), ...(p.ficha || []), ...(p.claves || []), p.real ? 'foto real' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), edad = lista(f.edad), talle = lista(f.talle), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (edad.length && !edadesDe(p).some(e => edad.includes(e))) return false;
    if (talle.length && !(p.talles || []).some(t => talle.includes(t))) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && texto.includes(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
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
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const citar = n => (String(n).includes('«') ? n : `«${n}»`);
const talleValido = (p, t) => ((p?.talles || []).includes(t) ? t : '');
const claveDe = i => `${i.id}|${i.talle || ''}`;
const talleTexto = i => (i.talle ? `Talle ${talleDe(i.talle)?.corto || i.talle}` : '');

const Cart = {
  KEY: 'catans_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const t = talleValido(producto, talle);
    if (!producto || !t) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const linea = { id: producto.id, talle: t };
    const k = claveDe(linea);
    const existing = items.find(i => claveDe(i) === k);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ ...linea, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => claveDe(i) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveDe(i) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      const talle = p ? talleValido(p, i.talle) : '';
      if (!p || !talle) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const linea = { id: p.id, talle, qty };
      const previa = limpias.find(x => claveDe(x) === claveDe(linea));
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty) changed = true;
      limpias.push(linea);
    });
    if (changed) this.save(limpias);
  },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  regla: SVG('<path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"/><path d="M4 8l2 0"/><path d="M4 12l3 0"/><path d="M4 16l2 0"/><path d="M8 4l0 2"/><path d="M12 4l0 3"/><path d="M16 4l0 2"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  estrella: '<svg class="estrella" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5C11.3 16.9 7.1 12.7 1.5 12 7.1 11.3 11.3 7.1 12 1.5z"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['edad', 'talle', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="800" height="1000"><span><b>${esc(c.nombre)}</b><small>${esc(`${plural(Tienda.contar({ cat: c.id }), 'prenda', 'prendas')} · ${c.bajada}`)}</small></span></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}


const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(48px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(16px) scale(.94)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', talle = '' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const t = talleValido(p, talle);
  const badge = p.etiqueta ? `<span class="prod__badge">${ICO.estrella}${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  const real = p.real ? '<span class="prod__real">Foto real</span>' : '';
  const label = t ? `Agregar ${p.nombre} talle ${talleDe(t).corto} al carrito` : `Elegir talle de ${p.nombre}`;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"></button>${badge}${off}${real}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(`${catDe(p.cat).nombre} · ${rangoTalles(p)}`)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions"><button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}"${t ? ` data-talle="${esc(t)}"` : ''} aria-label="${esc(label)}">${ICO.carrito}<span>Agregar${t ? `<span class="prod-add__t"> ${esc(talleDe(t).corto)}</span>` : ''}</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}"${t ? ` data-talle="${esc(t)}"` : ''}>Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'prenda', 'prendas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `• ${i.qty} × ${p.nombre} (${talleTexto(i).toLowerCase()}) — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = esc(claveDe(i));
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="800" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(talleTexto(i))}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
    cuenta.textContent = n ? plural(n, 'prenda', 'prendas') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => claveDe(x) === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar.split('|')[0]);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste ${citar(p.nombre)} del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, talle, n) {
  const t = talleDe(talle)?.corto || talle;
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${citar(p.nombre)} talle ${t} al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de ${citar(p.nombre)} en talle ${t}`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}

const tallesHTML = (p, nombre, sel = '') => `<fieldset class="opciones talles"><legend>Talle: <b data-talle-nombre>${sel ? esc(talleDe(sel).nombre) : 'elegí uno'}</b></legend><div class="opciones__fila">${(p.talles || []).map(id => {
  const t = talleDe(id);
  return `<label class="op-chip op-chip--talle"><input type="radio" name="${nombre}" value="${esc(t.id)}"${t.id === sel ? ' checked' : ''}><span>${esc(t.corto)}</span></label>`;
}).join('')}</div></fieldset>`;
const guiaHTML = p => `<details class="guia"><summary>${ICO.regla}<span>Guía de talles</span></summary><table><caption>Medidas de referencia del bebé o del nene</caption><thead><tr><th scope="col">Talle</th><th scope="col">Peso</th><th scope="col">Altura</th></tr></thead><tbody>${(p.talles || []).map(id => { const t = talleDe(id); return `<tr><th scope="row">${esc(t.corto)}</th><td>${esc(t.peso)}</td><td>${esc(t.altura)}</td></tr>`; }).join('')}</tbody></table><p>Si está entre dos talles, elegí el más grande.</p></details>`;

let sheetEstado = null;
function abrirSheet(id, { comprar = false, previo = document.activeElement } = {}) {
  const sheet = document.getElementById('talleSheet');
  const p = getProducto(id);
  if (!sheet || !p) return;
  sheetEstado = { id: p.id, comprar };
  sheet.querySelector('[data-sheet-body]').innerHTML = `<div class="sheet__prod"><img src="${esc(p.img)}" alt="" width="800" height="1000"><div><p class="sheet__nombre">${esc(p.nombre)}</p>${precioHTML(p)}</div></div>
  ${tallesHTML(p, 'sheet-talle')}
  <p class="opciones__error" data-sheet-error role="alert" hidden>Elegí un talle para sumarlo al carrito.</p>
  <div class="sheet__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-sheet-ok>${ICO.carrito}<span>${comprar ? 'Comprar ahora' : 'Agregar al carrito'}</span></button></div>
  ${guiaHTML(p)}`;
  sheet.setAttribute('aria-label', `Elegí el talle de ${p.nombre}`);
  abrirCapa(sheet, { previo });
  setTimeout(() => sheet.querySelector('input[name="sheet-talle"]')?.focus(), 80);
}
function initSheet() {
  const sheet = document.getElementById('talleSheet');
  if (!sheet) return;
  sheet.addEventListener('change', e => {
    if (!e.target.matches('input[name="sheet-talle"]')) return;
    sheet.querySelector('[data-talle-nombre]').textContent = talleDe(e.target.value)?.nombre || '';
    sheet.querySelector('[data-sheet-error]').hidden = true;
  });
  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-sheet-cerrar]')) { cerrarCapa(sheet); return; }
    const p = sheetEstado && getProducto(sheetEstado.id);
    if (!p) return;
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = sheet.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    if (!e.target.closest('[data-sheet-ok]')) return;
    const talle = sheet.querySelector('input[name="sheet-talle"]:checked')?.value;
    if (!talle) {
      sheet.querySelector('[data-sheet-error]').hidden = false;
      sheet.querySelector('input[name="sheet-talle"]')?.focus();
      return;
    }
    const n = Cart.add(p, talle, parseInt(sheet.querySelector('[data-qty]').textContent, 10) || 1);
    const capa = cerrarCapa(sheet, { devolverFoco: !sheetEstado.comprar });
    if (sheetEstado.comprar) window.abrirCarrito?.(capa?.previo);
    else { avisoSumado(p, talle, n); bump(capa?.previo); }
  });
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView, #talleSheet')) return;
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      const t = talleValido(p, ag.dataset.talle);
      if (t) { avisoSumado(p, t, Cart.add(p, t, 1)); bump(ag); }
      else abrirSheet(p.id, { previo: ag });
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      const t = talleValido(p, cm.dataset.talle);
      if (t) { Cart.add(p, t, 1); window.abrirCarrito?.(cm); }
      else abrirSheet(p.id, { comprar: true, previo: cm });
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p, talle = '') {
  const rel = relacionados(p);
  const nota = p.real ? 'Foto real de la prenda de Catan’s.' : 'Foto ilustrativa: la prenda puede variar en el tono.';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000"></figure>
    <p class="qv__nota-foto">${esc(nota)}</p>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(`${catDe(p.cat).nombre} · ${edadesDe(p).map(e => nombreDe(EDADES, e)).join(' y ')}`)}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    ${tallesHTML(p, 'qv-talle', talleValido(p, talle))}
    <p class="opciones__error" data-qv-error role="alert" hidden>Elegí un talle para sumarlo al carrito.</p>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    ${guiaHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre ${citar(p.nombre)} de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con el talle? Preguntanos</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="800" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, talle = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, talle || talleActivo());
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}
let talleActivo = () => '';

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('change', e => {
    if (!e.target.matches('input[name="qv-talle"]')) return;
    modal.querySelector('[data-talle-nombre]').textContent = talleDe(e.target.value)?.nombre || '';
    modal.querySelector('[data-qv-error]').hidden = true;
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const talle = cont.querySelector('input[name="qv-talle"]:checked')?.value;
      if (!talle) {
        cont.querySelector('[data-qv-error]').hidden = false;
        cont.querySelector('input[name="qv-talle"]')?.focus();
        return;
      }
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, talle, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, talle, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, size: (p.talles || []).map(t => talleDe(t)?.nombre), brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const primera = Tienda.consultar({ limite: 8 });
  const res = Tienda.consultar({ cursor: primera.items[primera.items.length - 1]?.id, limite: 7 });
  const n = Tienda.contar({});
  cont.innerHTML = res.items.map(p => cardHTML(p)).join('')
    + `<a class="previa__todo" href="${CATALOGO_URL}"${ANIMS.subir}>${ICO.estrella}<span class="previa__n">${n}</span><b>prendas en el catálogo</b><small>Buscá por talle, edad o estampa.</small><em>Ver todo el catálogo ${ICO.flecha}</em></a>`;
}

const desdeDe = filtros => {
  const r = Tienda.consultar({ filtros, orden: 'precio-asc', limite: 1 }).items[0];
  return r ? formatearPrecio(precioFinal(r)) : '';
};
function initCategorias() {
  const tiles = document.querySelector('[data-cats-tiles]');
  if (tiles) {
    tiles.innerHTML = CATEGORIAS.map(c => `<li class="cat-tile"${ANIMS.subir}><a href="${CATALOGO_URL}?cat=${c.id}"><span class="cat-tile__foto"><img src="${esc(c.img)}" alt="" width="800" height="1000"></span><span class="cat-tile__txt"><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small><em>${esc(`${plural(Tienda.contar({ cat: c.id }), 'prenda', 'prendas')} · desde ${desdeDe({ cat: c.id })}`)}</em></span></a></li>`).join('');
  }
  const indice = document.querySelector('[data-cats-indice]');
  if (indice) {
    indice.innerHTML = CATEGORIAS.map((c, k) => `<li class="indice__fila"${ANIMS.subir}><a href="${CATALOGO_URL}?cat=${c.id}"><span class="indice__n">0${k + 1}</span><span class="indice__foto"><img src="${esc(c.img)}" alt="" width="800" height="1000"></span><span class="indice__txt"><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><span class="indice__dato">${esc(`${plural(Tienda.contar({ cat: c.id }), 'prenda', 'prendas')} · desde ${desdeDe({ cat: c.id })}`)}</span>${ICO.flecha}</a></li>`).join('');
  }
  document.querySelectorAll('[data-edad-n]').forEach(el => { el.textContent = plural(Tienda.contar({ edad: el.dataset.edadN }), 'prenda', 'prendas'); });
}

function initPorTalle() {
  const chips = document.querySelector('[data-talle-chips]');
  const grid = document.querySelector('[data-talle-grid]');
  if (!chips || !grid) return;
  const link = document.querySelector('[data-talle-link]');
  let actual = '';
  chips.innerHTML = `<button type="button" class="talle-chip" data-talle-chip="" aria-pressed="true"><b>Todos</b><small>${Tienda.contar({})}</small></button>`
    + TALLES.map(t => `<button type="button" class="talle-chip" data-talle-chip="${esc(t.id)}" aria-pressed="false"><b>${esc(t.corto)}</b><small>${Tienda.contar({ talle: t.id })}</small></button>`).join('');
  const pintar = (primera = false) => {
    const f = actual ? { talle: actual } : {};
    const res = Tienda.consultar({ filtros: f, limite: 8 });
    grid.innerHTML = res.items.map(p => cardHTML(p, { talle: actual })).join('');
    const n = Tienda.contar(f);
    if (link) {
      link.href = actual ? `${CATALOGO_URL}?talle=${encodeURIComponent(actual)}` : CATALOGO_URL;
      link.querySelector('span').textContent = actual ? `Ver ${n === 1 ? 'la prenda' : `las ${n} prendas`} en talle ${talleDe(actual).corto}` : `Ver las ${n} prendas del catálogo`;
    }
    chips.querySelectorAll('[data-talle-chip]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talleChip === actual)));
    if (!primera) { revelarNuevos(grid); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
  };
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-talle-chip]');
    if (!b || b.dataset.talleChip === actual) return;
    actual = b.dataset.talleChip;
    pintar();
  });
  talleActivo = () => actual;
  pintar(true);
}

function initHorario() {
  const els = document.querySelectorAll('[data-horario]');
  if (!els.length) return;
  const pintar = () => {
    const d = new Date();
    const h = d.getHours() + d.getMinutes() / 60;
    const abierto = h >= 9 && h < 20;
    els.forEach(el => {
      el.classList.toggle('is-abierto', abierto);
      const t = el.querySelector('[data-horario-texto]');
      if (t) t.textContent = abierto ? 'Ahora estamos atendiendo, hasta las 20:00' : 'Fuera de horario: te respondemos desde las 09:00';
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
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
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, edad: EDADES, talle: TALLES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    edad: valida(params.get('edad'), EDADES),
    talle: valida(params.get('talle'), TALLES),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  talleActivo = () => (e.talle.length === 1 ? e.talle[0] : '');
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => (grupo === 'talle'
    ? `<label class="op-talle${n ? '' : ' is-cero'}"><input type="checkbox" data-f="talle" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.corto)}</span><small>${n}</small></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('edad')) return EDADES.find(x => x.id === e.edad[0])?.titulo || '';
    if (solo('talle')) return `Talle ${TALLES.find(x => x.id === e.talle[0])?.nombre || ''}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: k === 'talle' ? `Talle ${talleDe(id)?.corto}` : nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'talle' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir', talle: talleActivo() })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'prenda' : 'prendas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
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
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
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

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}
function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
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
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desdeA('.hero1__marco', { y: 36, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.12);
  desdeA('h1', { y: 34, opacity: 0, filter: 'blur(8px)', duration: 1.15, clearProps: 'filter' }, 0.2);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  desdeA('.hero__sello', { y: 14, scale: 0.92, rotate: -8, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  desdeA('.hero__horario', { y: 18, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
  desdeA('.chispa', { scale: 0.4, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero1__foto img, .hero2__banner img').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initRail, initPrevia, initCategorias, initPorTalle, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initSheet, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl, initHorario].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
