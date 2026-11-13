const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
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

const WSP = '5493537666429';
const MARCA = 'Georgi Beauty Center';
const CATEGORIAS = [
  { id: 'faciales', nombre: 'Faciales', titulo: 'Insumos faciales', bajada: 'Sérums, lociones y cremas para el rostro', img: 'images/z-gotero.webp' },
  { id: 'corporales', nombre: 'Corporales', titulo: 'Insumos corporales', bajada: 'Hidratación, masajes y aparatología', img: 'images/z-pote.webp' },
  { id: 'capilares', nombre: 'Capilares', titulo: 'Insumos capilares', bajada: 'Shampoo, máscara y protector térmico', img: 'images/z-botella.webp' },
];
const ACTIVOS = [
  { id: 'vitamina-c', nombre: 'Vitamina C', aporta: 'Revitaliza y aporta luminosidad. Estimula la síntesis del colágeno.', fuente: 'Sérum Arvensis' },
  { id: 'niacinamida', nombre: 'Niacinamida', aporta: 'Unifica el tono, reduce imperfecciones y mejora la textura de la piel.', fuente: 'Crema Esencial ICONO' },
  { id: 'hialuronico', nombre: 'Ácido hialurónico', aporta: 'Hidrata la piel y mejora las líneas de expresión.', fuente: 'Sérum Arvensis' },
  { id: 'urea', nombre: 'Urea', aporta: 'Hidrata en profundidad, repara y mantiene la piel flexible.', fuente: 'Crema Esencial ICONO' },
  { id: 'acido-lactico', nombre: 'Ácido láctico', aporta: 'Renueva la piel, mejora la luminosidad y suaviza la superficie.', fuente: 'Crema Esencial ICONO' },
  { id: 'aloe-vera', nombre: 'Aloe vera', aporta: 'Calma, regenera y aporta frescura.', fuente: 'Crema Hidratante Plus ICONO' },
  { id: 'ceramidas', nombre: 'Ceramidas', aporta: 'Reparan y fortalecen la barrera cutánea, previniendo la pérdida de hidratación.', fuente: 'Crema Esencial ICONO' },
  { id: 'uva', nombre: 'Polifenoles de uva', aporta: 'Vinoterapia: aportan antioxidantes que combaten los radicales libres y previenen el envejecimiento prematuro.', fuente: 'Vinoter 4 ICONO' },
  { id: 'aminoacidos', nombre: 'Aminoácidos', aporta: 'Piel más elástica, brillante y suave.', fuente: 'Sérum Arvensis' },
  { id: 'q10', nombre: 'Coenzima Q10', aporta: 'Antiage y antioxidante, con extracto de rosa damascena.', fuente: 'Sérum Arvensis' },
];
const MARCAS = [
  { id: 'arvensis', nombre: 'Arvensis' },
  { id: 'icono', nombre: 'ICONO' },
];
const PRECIOS = [
  { id: 'hasta12', nombre: 'Hasta $12.000', min: 0, max: 12000 },
  { id: '12a20', nombre: '$12.000 a $20.000', min: 12000, max: 20000 },
  { id: 'mas20', nombre: 'Más de $20.000', min: 20000, max: null },
];
const PRODUCTOS = [
  { id: 'arvensis-vitamina-c', rango: 1, cat: 'faciales', marca: 'arvensis', nombre: 'Sérum facial Vitamina C', pres: '15 ml · Fórmula natural', activos: ['vitamina-c'], precio: 18900, pro: 15900, descuento: 0, img: 'images/p-arvensis-vitc.webp', propia: true, alt: 'Caja naranja del sérum facial Vitamina C de Arvensis, en la mano, frente a la estantería del local', gancho: 'Revitalización y luminosidad', desc: 'Sérum facial de Arvensis con vitamina C, de fórmula natural. Su caja lo presenta como revitalizante y estimulante de la síntesis del colágeno.', aporta: ['Revitalización y luminosidad', 'Estimula la síntesis del colágeno', 'Fórmula natural'], claves: ['serum', 'suero', 'vitamina c', 'luminosidad', 'colageno', 'arvensis', 'rostro'] },
  { id: 'icono-hidratante-plus', rango: 2, cat: 'corporales', marca: 'icono', nombre: 'Crema Hidratante Plus', pres: '250 g · Rostro, cuerpo, manos y pies', activos: ['aloe-vera', 'urea', 'acido-lactico'], precio: 24900, pro: 20900, descuento: 0, img: 'images/p-icono-plus.webp', propia: true, alt: 'Pote blanco de Crema Hidratante Plus de ICONO con etiqueta turquesa, junto a hojas de aloe', gancho: 'Hidratación profunda y confort diario', desc: 'Crema de ICONO con aloe vera, urea y ácido láctico para rostro, cuerpo, manos y pies. Apta para todo tipo de piel.', aporta: ['Hidratación profunda: evita la resequedad', 'Fortalece la barrera cutánea', 'Aloe vera: calma y aporta frescura', 'Urea: suaviza y mejora la textura', 'Ácido láctico: favorece la renovación celular'], claves: ['crema', 'hidratante', 'plus', 'aloe', 'urea', 'acido lactico', 'pies', 'manos', 'cuerpo', 'corporal', 'icono'] },
  { id: 'arvensis-niacinamida', rango: 3, cat: 'faciales', marca: 'arvensis', nombre: 'Sérum facial Niacinamida', pres: '15 ml · Con ácido hialurónico y vitamina C', activos: ['niacinamida', 'hialuronico', 'vitamina-c'], precio: 19900, pro: 16900, descuento: 0, img: 'images/p-arvensis-niaci.webp', propia: true, alt: 'Caja violeta del sérum facial Niacinamida de Arvensis, en la mano', gancho: 'Hidratante y renovador celular', desc: 'Sérum facial de Arvensis con niacinamida, ácido hialurónico y vitamina C, de fórmula natural. Según su caja, reduce poros, arrugas y aclara manchas.', aporta: ['Hidratante y renovador celular', 'Reduce poros y arrugas', 'Aclara manchas'], claves: ['serum', 'suero', 'niacinamida', 'manchas', 'poros', 'hialuronico', 'vitamina c', 'arvensis'] },
  { id: 'icono-vinoter-4', rango: 4, cat: 'faciales', marca: 'icono', nombre: 'Vinoter 4 Crema antiedad', pres: '250 g · Vinoterapia', activos: ['uva'], precio: 27900, pro: 23500, descuento: 0, img: 'images/p-icono-vinoter.webp', propia: true, alt: 'Pote de Vinoter 4 Crema antiedad de ICONO con etiqueta bordó, junto a uvas', gancho: 'Nutre, regenera y revitaliza', desc: 'Crema antiedad de vinoterapia de ICONO, con activos naturales de la uva, colágeno, elastina y extractos vegetales. Pensada para piel madura y uso diario.', aporta: ['Antioxidantes de la uva', 'Colágeno y elastina: firmeza y elasticidad', 'Extractos vegetales que nutren', 'Ayuda a reducir arrugas y líneas de expresión'], claves: ['crema', 'antiedad', 'vinoter', 'vinoterapia', 'uva', 'colageno', 'elastina', 'arrugas', 'icono'] },
  { id: 'arvensis-hialuronico', rango: 5, cat: 'faciales', marca: 'arvensis', nombre: 'Sérum facial Hialurónico', pres: '15 ml · Fórmula natural', activos: ['hialuronico'], precio: 18900, pro: 15900, descuento: 0, img: 'images/p-arvensis-hialu.webp', propia: true, alt: 'Caja verde del sérum facial Hialurónico de Arvensis, en la mano', gancho: 'Hidrata y mejora las líneas de expresión', desc: 'Sérum facial de Arvensis con ácido hialurónico, de fórmula natural. Hidrata la piel y mejora las líneas de expresión.', aporta: ['Hidrata la piel', 'Mejora las líneas de expresión', 'Fórmula natural'], claves: ['serum', 'suero', 'hialuronico', 'acido hialuronico', 'hidratacion', 'arvensis'] },
  { id: 'icono-esencial', rango: 6, cat: 'faciales', marca: 'icono', nombre: 'Crema Esencial Equilibrante', pres: '250 g · Pieles sensibles y mixtas', activos: ['niacinamida', 'ceramidas', 'acido-lactico', 'urea'], precio: 26900, pro: 22700, descuento: 0, img: 'images/p-icono-esencial.webp', propia: true, alt: 'Pote blanco de Crema Esencial Equilibrante de ICONO con un poco de crema al costado', gancho: 'Piel equilibrada, sana y luminosa', desc: 'Crema de ICONO con niacinamida, ceramidas, ácido láctico y urea, ideal para pieles sensibles y mixtas.', aporta: ['Hidrata profundamente', 'Fortalece la barrera natural', 'Regula el brillo en pieles mixtas', 'Mejora la textura'], claves: ['crema', 'esencial', 'equilibrante', 'niacinamida', 'ceramidas', 'piel mixta', 'sensible', 'brillo', 'icono'] },
  { id: 'icono-splash-antioxidante', rango: 7, cat: 'faciales', marca: 'icono', nombre: 'Splash antioxidante', pres: 'Loción de vinoterapia · 200 ml', activos: ['uva', 'urea', 'acido-lactico'], precio: 15900, pro: 13500, descuento: 0, img: 'images/p-icono-splash.webp', propia: true, alt: 'Frasco spray violeta de la loción Splash antioxidante de ICONO', gancho: 'Protege del envejecimiento prematuro', desc: 'Loción facial de vinoterapia de ICONO, con polifenoles, urea, alantoína y ácido láctico. Hidrata, suaviza y mejora la textura de la piel.', aporta: ['Protege del envejecimiento prematuro', 'Hidrata y suaviza', 'Mejora la textura de la piel'], claves: ['locion', 'splash', 'antioxidante', 'vinoterapia', 'polifenoles', 'alantoina', 'tonico', 'icono'] },
  { id: 'shampoo-nutritivo', rango: 8, cat: 'capilares', marca: '', nombre: 'Shampoo nutritivo', pres: '500 ml · Uso profesional', activos: [], precio: 11900, pro: 9900, descuento: 0, img: 'images/p-shampoo.webp', alt: 'Botella blanca de shampoo con tapa azul', gancho: 'Para lavar antes de nutrición y alisados', desc: 'Shampoo nutritivo en presentación de 500 ml, para el lavado previo a tratamientos de nutrición y alisado. Marca y fórmula, por WhatsApp.', aporta: ['Limpieza suave', 'Presentación de 500 ml'], claves: ['shampoo', 'champu', 'pelo', 'cabello', 'capilar', 'nutritivo'] },
  { id: 'arvensis-q10', rango: 9, cat: 'faciales', marca: 'arvensis', nombre: 'Sérum Q10 Facial Plus', pres: '15 ml · Con rosa damascena', activos: ['q10'], precio: 19900, pro: 16900, descuento: 0, img: 'images/p-arvensis-q10.webp', propia: true, alt: 'Caja dorada del sérum Q10 Facial Plus de Arvensis, en la mano', gancho: 'Antiage antioxidante', desc: 'Sérum de Arvensis con coenzima Q10 y extracto de rosa damascena, de fórmula natural y acción antiage antioxidante.', aporta: ['Antiage antioxidante', 'Extracto de rosa damascena', 'Fórmula natural'], claves: ['serum', 'suero', 'q10', 'coenzima', 'antiage', 'antioxidante', 'rosa', 'arvensis'] },
  { id: 'icono-bruma-tonificante', rango: 10, cat: 'faciales', marca: 'icono', nombre: 'Bruma tonificante', pres: 'Loción facial · 200 ml', activos: [], precio: 14900, pro: 12600, descuento: 0, img: 'images/p-icono-bruma.webp', propia: true, alt: 'Frasco spray ámbar de la loción Bruma tonificante de ICONO', gancho: 'Tonifica y refresca la piel', desc: 'Loción facial de ICONO con árnica, chía, grosella y hamamelis. Tonifica y refresca, calma y aporta luminosidad.', aporta: ['Tonifica y refresca la piel', 'Calma y revitaliza', 'Aporta luminosidad y vitalidad'], claves: ['locion', 'bruma', 'tonificante', 'tonico', 'arnica', 'chia', 'hamamelis', 'icono'] },
  { id: 'arvensis-aminoacidos', rango: 11, cat: 'faciales', marca: 'arvensis', nombre: 'Sérum facial Aminoácidos', pres: '15 ml · Fórmula natural', activos: ['aminoacidos'], precio: 17900, pro: 15200, descuento: 0, img: 'images/p-arvensis-amino.webp', propia: true, alt: 'Caja coral del sérum facial Aminoácidos de Arvensis, en la mano', gancho: 'Piel más elástica, brillante y suave', desc: 'Sérum facial de Arvensis con aminoácidos, de fórmula natural, para una piel más elástica, brillante y suave.', aporta: ['Piel más elástica', 'Brillo y suavidad', 'Fórmula natural'], claves: ['serum', 'suero', 'aminoacidos', 'elasticidad', 'arvensis'] },
  { id: 'icono-natural-fresh', rango: 12, cat: 'faciales', marca: 'icono', nombre: 'Natural Fresh', pres: 'Loción facial · 200 ml', activos: ['aloe-vera'], precio: 14900, pro: 12600, descuento: 0, img: 'images/p-icono-fresh.webp', propia: true, alt: 'Frasco spray verde de la loción Natural Fresh de ICONO', gancho: 'Frescura inmediata', desc: 'Loción facial de ICONO con tilo, té verde, manzanilla y aloe vera. Brinda frescura inmediata, equilibra y suaviza.', aporta: ['Brinda frescura inmediata', 'Equilibra y suaviza', 'Mantiene la piel fresca'], claves: ['locion', 'natural fresh', 'tilo', 'te verde', 'manzanilla', 'aloe', 'tonico', 'icono'] },
  { id: 'mascara-capilar', rango: 13, cat: 'capilares', marca: '', nombre: 'Máscara capilar nutritiva', pres: '500 g · Baño de crema', activos: [], precio: 13900, pro: 11700, descuento: 0, img: 'images/p-mascara-capilar.webp', alt: 'Pote blanco con tapa celeste de máscara capilar', gancho: 'Para nutrición en el salón o en casa', desc: 'Máscara capilar nutritiva en pote de 500 g, para baños de crema y tratamientos de nutrición. Marca y fórmula, por WhatsApp.', aporta: ['Nutrición del cabello', 'Pote de 500 g'], claves: ['mascara', 'baño de crema', 'nutricion', 'pelo', 'cabello', 'capilar'] },
  { id: 'aceite-masajes', rango: 14, cat: 'corporales', marca: '', nombre: 'Aceite neutro para masajes', pres: '500 ml · Con válvula', activos: [], precio: 12900, pro: 10900, descuento: 0, img: 'images/p-aceite-masajes.webp', alt: 'Frasco blanco con válvula turquesa de aceite para masajes', gancho: 'Deslizamiento largo para masajes', desc: 'Aceite neutro para masajes descontracturantes y relajantes, en frasco de 500 ml con válvula. Marca, por WhatsApp.', aporta: ['Deslizamiento largo', 'Frasco con válvula'], claves: ['aceite', 'masajes', 'masaje', 'neutro', 'corporal', 'cuerpo'] },
  { id: 'spray-termoprotector', rango: 15, cat: 'capilares', marca: '', nombre: 'Spray termoprotector', pres: '250 ml · Antes de planchita', activos: [], precio: 12900, pro: 10900, descuento: 0, img: 'images/p-termoprotector.webp', alt: 'Botella blanca con gatillo pulverizador de protector térmico', gancho: 'Protege el pelo del calor', desc: 'Protector térmico en spray para usar antes del secador, la planchita y los alisados. Marca, por WhatsApp.', aporta: ['Protege del calor', 'Para secador, planchita y alisados'], claves: ['spray', 'termoprotector', 'protector termico', 'planchita', 'alisado', 'pelo', 'cabello', 'capilar'] },
  { id: 'crema-masajes', rango: 16, cat: 'corporales', marca: '', nombre: 'Crema neutra para masajes', pres: '500 g · Uso en gabinete', activos: [], precio: 15900, pro: 13400, descuento: 0, img: 'images/p-crema-masajes.webp', alt: 'Pote blanco con tapa turquesa de crema para masajes', gancho: 'Base neutra para masajes corporales', desc: 'Crema neutra para masajes corporales, en pote de 500 g para usar en gabinete. Marca, por WhatsApp.', aporta: ['Base neutra', 'Pote de 500 g para gabinete'], claves: ['crema', 'masajes', 'masaje', 'neutra', 'corporal', 'cuerpo', 'gabinete'] },
  { id: 'gel-limpieza-facial', rango: 17, cat: 'faciales', marca: '', nombre: 'Gel de limpieza facial', pres: '250 ml · Con dosificador', activos: [], precio: 11900, pro: 9900, descuento: 0, img: 'images/p-gel-limpieza.webp', alt: 'Envase blanco cuadrado con dosificador de gel de limpieza facial', gancho: 'Primer paso de la limpieza facial', desc: 'Gel de limpieza facial con dosificador, para el primer paso de la limpieza en gabinete o en casa. Marca, por WhatsApp.', aporta: ['Limpieza diaria', 'Envase con dosificador'], claves: ['gel', 'limpieza', 'limpiador', 'rostro', 'facial', 'limpieza facial'] },
  { id: 'gel-conductor', rango: 18, cat: 'corporales', marca: '', nombre: 'Gel neutro conductor', pres: '250 ml · Para aparatología', activos: [], precio: 8900, pro: 7500, descuento: 0, img: 'images/p-gel-conductor.webp', alt: 'Pomo blanco con tapa celeste de gel conductor', gancho: 'Para equipos de aparatología', desc: 'Gel neutro conductor para tratamientos con aparatología, en pomo de 250 ml. Marca, por WhatsApp.', aporta: ['Base neutra', 'Para equipos de aparatología'], claves: ['gel', 'conductor', 'neutro', 'aparatologia', 'ultrasonido', 'radiofrecuencia', 'corporal'] },
  { id: 'prueba-oculto', rango: 99, cat: 'faciales', marca: '', nombre: 'Producto de prueba', pres: '-', activos: [], precio: 1000, pro: 900, descuento: 0, visible: false, img: 'images/p-crema-facial.webp', alt: 'Producto oculto', gancho: 'Oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', aporta: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const PRO_KEY = 'georgi_pro';
const Pro = {
  get() { try { const v = JSON.parse(localStorage.getItem(PRO_KEY)); return v && v.nombre ? v : null; } catch { return null; } },
  activa() { return !!this.get(); },
  set(datos) { try { localStorage.setItem(PRO_KEY, JSON.stringify(datos)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('pro:cambio')); },
  salir() { try { localStorage.removeItem(PRO_KEY); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('pro:cambio')); },
};

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const marcaDe = p => nombreDe(MARCAS, p.marca);
const precioPublico = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const precioFinal = p => (Pro.activa() && p.pro ? Math.min(p.pro, precioPublico(p)) : precioPublico(p));
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.pres, p.gancho, p.desc, marcaDe(p), catDe(p.cat).nombre, catDe(p.cat).titulo, ...(p.activos || []).map(x => nombreDe(ACTIVOS, x)), ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), activo = lista(f.activo), marca = lista(f.marca), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (activo.length && !(p.activos || []).some(x => activo.includes(x))) return false;
    if (marca.length && !marca.includes(p.marca)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
    const voces = indice.get(p.id) || [];
    const empieza = w => voces.some(v => v.startsWith(w));
    return palabras.every(w => empieza(w) || (w.length > 4 && w.endsWith('s') && empieza(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && empieza(w.slice(0, -2))));
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
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    return [...visibles].sort(comparador(o));
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

const Cart = {
  KEY: 'georgi_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || Object.keys(i).length !== 2) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

function textoPedido(items = Cart.get()) {
  let total = 0;
  const pro = Pro.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    return `• ${i.qty} × ${p.nombre}${p.marca ? ` (${marcaDe(p)})` : ''} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  const cuenta = pro ? `\nCuenta profesional: ${pro.nombre} (${pro.actividad})` : '';
  return `¡Hola Georgi! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}${cuenta}\n¿Cómo seguimos?`;
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  gota: SVG('<path d="M12 3.5c3 3.8 5.5 7 5.5 10.2a5.5 5.5 0 1 1 -11 0c0 -3.2 2.5 -6.4 5.5 -10.2z"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
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
  const otros = ['activo', 'marca', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="900" height="900"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')}</small></span></a></li>`;
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

const stepperHTML = (n = 1, cls = '') => `<div class="stepper${cls}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = p => {
  const pub = precioPublico(p);
  const fin = precioFinal(p);
  if (Pro.activa() && fin < pub) return `<p class="precio precio--pro"><span class="precio__v">${formatearPrecio(fin)}</span><s>${formatearPrecio(pub)}</s><span class="precio__etq">Profesional</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(pub)}</span></p>`;
};
const minus = s => (s.length > 1 && s[1] === s[1].toLowerCase() ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const etiquetaDe = p => (p.activos?.length ? nombreDe(ACTIVOS, p.activos[0]) : catDe(p.cat).nombre);

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(28px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(18px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver qué aporta</span></button><span class="prod__activo">${ICO.gota}${esc(etiquetaDe(p))}</span></div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(marcaDe(p) || catDe(p.cat).nombre)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
    <div class="prod-actions">${stepperHTML(1, ' stepper--card')}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('pro:cambio', updateCartBadge);

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="800" height="1000"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${p.marca ? `<b>${esc(marcaDe(p))}</b> · ` : ''}${esc(p.pres)}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${id}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
  const proNota = drawer.querySelector('[data-drawer-pro]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
    if (proNota) {
      const pro = Pro.get();
      proNota.innerHTML = pro ? `${ICO.check}<span>Precios profesionales de ${esc(pro.nombre)}</span>` : `<span>¿Trabajás en estética? <a href="${HOME_URL}#profesionales" data-drawer-cerrar>Creá tu cuenta profesional</a> y comprá con tus precios.</span>`;
    }
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => x.id === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.addEventListener('click', e => { if (e.target.closest('[data-drawer-cerrar]')) cerrarCapa(drawer, { devolverFoco: !e.target.closest('a') }); });
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('pro:cambio', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = el => {
  const out = el.closest('[data-cant]')?.querySelector('[data-qty]');
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, TOPE_LINEA));
  if (out) out.textContent = '1';
  return n;
};

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-cant] [data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, Cart.add(p, cantDe(ag)));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantDe(cm));
      window.abrirCarrito?.(cm);
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
  let rel = Tienda.consultar({ filtros: { activo: p.activos, excluir: [p.id] }, limite: 3 }).items;
  if (!p.activos?.length) rel = [];
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const activos = (p.activos || []).map(x => nombreDe(ACTIVOS, x)).join(' · ');
  const ficha = [['Marca', marcaDe(p) || 'A confirmar'], ['Presentación', p.pres], ['Categoría', c.titulo], ['Activos', activos || '—']];
  const pro = Pro.get();
  const proTxt = pro
    ? `<p class="qv__pro is-activa">${ICO.check}<span>Precio profesional de ${esc(pro.nombre)}</span></p>`
    : `<p class="qv__pro">¿Trabajás en estética? <a href="${HOME_URL}#profesionales">Con tu cuenta profesional</a> ves tu precio.</p>`;
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000"></figure>
    <p class="qv__nota-foto">${p.propia ? 'Foto del producto en Georgi Beauty Center.' : 'Imagen ilustrativa: el envase real puede variar.'} Precio de muestra.</p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}${p.marca ? `<span>${esc(marcaDe(p))}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    ${proTxt}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${p.aporta?.length ? `<div class="qv__aporta"><p class="qv__k">${ICO.gota}Qué aporta</p><ul>${p.aporta.map(a => `<li>${ICO.check}<span>${esc(a)}</span></li>`).join('')}</ul></div>` : ''}
    <dl class="qv__ficha">${ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Georgi! Quería consultar por ${p.nombre}${p.marca ? ` de ${marcaDe(p)}` : ''}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por este producto</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>${p.activos?.length ? 'Con activos parecidos' : 'También te puede interesar'}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto"><img src="${esc(r.img)}" alt="" width="800" height="1000"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    if (e.target.closest('.qv__pro a')) { cerrarCapa(modal, { devolverFoco: false }); return; }
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
      const n = Cart.add(p, cantDe(cont.querySelector('[data-cant]')));
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    ...(p.marca ? { brand: { '@type': 'Brand', name: marcaDe(p) } } : {}),
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioPublico(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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
  const pintar = (nuevo = false) => {
    cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: nuevo ? 'no' : 'der' })).join('');
  };
  pintar();
  document.addEventListener('pro:cambio', () => pintar(true));
}
function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const pintar = (nuevo = false) => {
    cont.innerHTML = Tienda.consultar({ limite: 8 }).items.map(p => cardHTML(p, { anim: nuevo ? 'no' : 'subir' })).join('');
  };
  pintar();
  document.addEventListener('pro:cambio', () => pintar(true));
}
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'producto', 'productos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
  document.querySelectorAll('[data-activo-n]').forEach(el => { el.textContent = String(Tienda.contar({ activo: el.dataset.activoN })); });
}

function miniHTML(p) {
  return `<li class="mini"${ANIMS.fila}>
    <button type="button" class="mini__foto" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="800" height="1000"></button>
    <div class="mini__txt"><h4>${esc(p.nombre)}</h4><p>${esc(marcaDe(p) ? `${marcaDe(p)} · ` : '')}${esc(p.pres)}</p>${precioHTML(p)}</div>
    <button type="button" class="btn btn--cta btn--sm mini__add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
  </li>`;
}
function initActivos() {
  const box = document.querySelector('[data-activos]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-activo]')];
  const panel = box.querySelector('[data-activos-panel]');
  let actual = tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.activo || tabs[0]?.dataset.activo;
  const pintar = (animar = true) => {
    const a = ACTIVOS.find(x => x.id === actual);
    if (!a) return;
    tabs.forEach(t => { const on = t.dataset.activo === actual; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    const res = Tienda.consultar({ filtros: { activo: a.id }, limite: 3 });
    const total = Tienda.contar({ activo: a.id });
    panel.setAttribute('aria-labelledby', `tab-${a.id}`);
    panel.innerHTML = `<div class="activo-ficha"${animar ? ANIMS.fila : ''}>
      <p class="activo-ficha__k">${ICO.gota}Qué aporta</p>
      <h3>${esc(a.nombre)}</h3>
      <p class="activo-ficha__t">${esc(a.aporta)}</p>
      <p class="activo-ficha__fuente">Así lo describe ${esc(a.fuente)}.</p>
    </div>
    <ul class="activo-prods">${res.items.map(miniHTML).join('')}</ul>
    <a class="link-flecha activo-mas" href="${CATALOGO_URL}?activo=${esc(a.id)}">Ver ${total === 1 ? 'el producto' : `los ${total} productos`} con ${esc(minus(a.nombre))} ${ICO.flecha}</a>`;
    if (!animar) panel.querySelectorAll('[data-animate]').forEach(el => { el.classList.add('in'); });
    revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[data-activo]');
    if (!t || t.dataset.activo === actual) return;
    actual = t.dataset.activo;
    pintar();
  });
  box.addEventListener('keydown', e => {
    const t = e.target.closest('[data-activo]');
    if (!t) return;
    const k = tabs.indexOf(t);
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (k + 1) % tabs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    actual = tabs[n].dataset.activo;
    pintar();
    tabs[n].focus();
  });
  document.addEventListener('pro:cambio', () => pintar(false));
  pintar();
}

function initPro() {
  const btns = document.querySelectorAll('[data-pro-btn]');
  const aviso = document.querySelector('[data-pro-aviso]');
  const form = document.querySelector('[data-pro-form]');
  const ok = document.querySelector('[data-pro-ok]');
  const sync = () => {
    const pro = Pro.get();
    document.body.classList.toggle('es-pro', !!pro);
    btns.forEach(b => {
      b.classList.toggle('is-pro', !!pro);
      const t = b.querySelector('[data-pro-label]');
      if (t) t.textContent = pro ? 'Cuenta pro' : 'Profesionales';
      b.setAttribute('aria-label', pro ? `Cuenta profesional de ${pro.nombre}` : 'Cuenta profesional: registrate');
    });
    if (aviso) {
      aviso.hidden = !pro;
      const n = aviso.querySelector('[data-pro-nombre]');
      if (n && pro) n.textContent = pro.nombre;
    }
    if (form && ok) {
      form.hidden = !!pro;
      ok.hidden = !pro;
      if (pro) {
        ok.querySelector('[data-pro-ok-nombre]').textContent = pro.nombre;
        ok.querySelector('[data-pro-ok-act]').textContent = pro.actividad;
      }
    }
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-pro-salir]')) return;
    Pro.salir();
    showToast('Saliste de la cuenta profesional: ves los precios de la tienda.');
  });
  document.addEventListener('pro:cambio', sync);
  sync();
  if (!form) return;
  const campos = {
    nombre: v => (v.trim().length >= 3 ? '' : 'Escribí tu nombre y apellido.'),
    actividad: v => (v ? '' : 'Elegí a qué te dedicás.'),
    whatsapp: v => (v.replace(/\D/g, '').length >= 10 ? '' : 'Escribí tu WhatsApp con característica, sin 0 ni 15.'),
    localidad: v => (v.trim().length >= 3 ? '' : 'Contanos en qué localidad trabajás.'),
  };
  const validar = (nombre, mostrar = true) => {
    const el = form.elements[nombre];
    const msg = campos[nombre](el.value);
    const err = form.querySelector(`[data-error="${nombre}"]`);
    if (mostrar) {
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; err.hidden = !msg; }
    }
    return !msg;
  };
  Object.keys(campos).forEach(n => {
    const el = form.elements[n];
    el.addEventListener('blur', () => { if (el.value) validar(n); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(n); });
    el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validar(n); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = Object.keys(campos).filter(n => !validar(n));
    if (malos.length) { form.elements[malos[0]].focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.querySelector('span');
    const antes = txt.textContent;
    btn.disabled = true;
    txt.textContent = 'Creando tu cuenta…';
    setTimeout(() => {
      const nombre = form.elements.nombre.value.trim().split(/\s+/)[0];
      const actividad = form.elements.actividad.value;
      Pro.set({ nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), actividad });
      form.reset();
      Object.keys(campos).forEach(n => form.elements[n].removeAttribute('aria-invalid'));
      btn.disabled = false;
      txt.textContent = antes;
      showToast('¡Cuenta creada! En esta demo ya ves los precios profesionales; en la web real, Georgi aprueba cada cuenta.');
      ok.querySelector('a, button')?.focus({ preventScroll: true });
    }, 800);
  });
}

function initPrecios() {
  const pintar = () => document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
  pintar();
  document.addEventListener('pro:cambio', pintar);
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('filtrosActivos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, activo: ACTIVOS, marca: MARCAS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    activo: valida(params.get('activo'), ACTIVOS),
    marca: valida(params.get('marca'), MARCAS),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => (grupo === 'cat' && MODELO === '2'
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`
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
    if (solo('activo')) return `Con ${minus(ACTIVOS.find(x => x.id === e.activo[0])?.nombre || '')}`;
    if (solo('marca')) return MARCAS.find(x => x.id === e.marca[0])?.nombre || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los insumos';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, insumos de estética`;
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
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  document.addEventListener('pro:cambio', () => { pintarFiltros(); render(true); });
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
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => hero.classList.add('is-listo') });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('.hero1__lavado', { opacity: 0, scale: 0.94, transformOrigin: '70% 60%', duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__foto', { y: 30, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.05);
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.hero1__marco', { opacity: 0, scale: 0.97, duration: 1.3, clearProps: 'transform,opacity' }, 0.35);
  const onda = hero.querySelector('.hero__onda-linea');
  if (onda) {
    const L = onda.getTotalLength ? onda.getTotalLength() : 1200;
    gsap.set(onda, { strokeDasharray: L, strokeDashoffset: L });
    tl.to(onda, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', onComplete: () => gsap.set(onda, { clearProps: 'strokeDasharray,strokeDashoffset' }) }, 0.3);
  }
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 26, opacity: 0, filter: 'blur(6px)', duration: 1.1, clearProps: 'filter' }, 0.22);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.4);
  desdeA('.hero-buscar', { y: 18, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.5);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desdeA('.hero-chips li', { y: 12, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.68);
  desdeA('.hero__datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.hero2__banda', { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.3);
  desdeA('.hero__ficha', { y: 26, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

[initPrecios, initRail, initDestacados, initCategoriasCuenta, initMenuCategorias, initCatalogo, initActivos, initPro, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
