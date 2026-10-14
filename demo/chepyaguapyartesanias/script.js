const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493772578766';
const PAGINA = document.body.dataset.pagina || 'home';
const MODELO = document.body.classList.contains('m2') ? 2 : 1;
const CATALOGO_URL = MODELO === 2 ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const intentar = fn => { try { return fn(); } catch { return null; } };

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ICON = {
  arrow: '<svg class="ico-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c-3.5 0-6 1.6-6 3.5S8.5 10 12 10s6-1.6 6-3.5S15.5 3 12 3Z"/><path d="M6 6.5V15c0 3 2.7 6 6 6s6-3 6-6V6.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
};

const CATEGORIAS = [
  { id: 'tazas', nombre: 'Tazas', sub: 'Para el café de todos los días', img: 'images/cat-tazas.webp' },
  { id: 'cuencos', nombre: 'Cuencos y vajilla', sub: 'Mesa con alma artesanal', img: 'images/cat-cuencos.webp' },
  { id: 'floreros', nombre: 'Floreros', sub: 'Para flores frescas o secas', img: 'images/cat-floreros.webp' },
  { id: 'centros', nombre: 'Centros de mesa', sub: 'La pieza que arma la mesa', img: 'images/cat-centros.webp' },
  { id: 'macetas', nombre: 'Macetas', sub: 'Naturaleza en cerámica', img: 'images/cat-macetas.webp' },
  { id: 'adornos', nombre: 'Adornos', sub: 'Detalles para regalar', img: 'images/cat-adornos.webp' },
];

const AMBIENTES = [
  { id: 'mesa', nombre: 'La mesa', bajada: 'Tazas, cuencos y vajilla para usar todos los días.', cats: ['tazas', 'cuencos'], img: 'images/amb-mesa.webp' },
  { id: 'flores', nombre: 'Las flores', bajada: 'Floreros, centros de mesa y adornos para cada rincón.', cats: ['floreros', 'centros', 'adornos'], img: 'images/amb-flores.webp' },
  { id: 'plantas', nombre: 'Las plantas', bajada: 'Macetas esmaltadas para tus plantas de interior.', cats: ['macetas'], img: 'images/amb-plantas.webp' },
];

const ESMALTES = [
  { id: 'crudo', nombre: 'Crudo moteado' },
  { id: 'salvia', nombre: 'Salvia' },
  { id: 'celadon', nombre: 'Celadón' },
  { id: 'terracota', nombre: 'Terracota' },
  { id: 'tostado', nombre: 'Tostado' },
];

const PRECIOS = [
  { id: 'todos', nombre: 'Todos los precios' },
  { id: 'h15', nombre: 'Hasta $15.000', max: 15000 },
  { id: '15a30', nombre: '$15.000 a $30.000', min: 15000, max: 30000 },
  { id: 'm30', nombre: 'Más de $30.000', min: 30000 },
];

const ORDENES = [
  { id: 'relevancia', nombre: 'Destacadas primero' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const nombreEsmalte = id => ESMALTES.find(e => e.id === id)?.nombre || '';

function crearTienda(coleccion) {
  const TOPE = 100;
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'o', 'con', 'para', 'en', 'por', 'a', 'al']);
  const datos = coleccion.map((p, i) => Object.freeze({ ...p, orden: i }));
  const textos = new Map(datos.map(p => [p.id, norm(['ceramica hecha a mano', p.nombre, p.cat, nombreCat(p.cat), p.esmalteTxt, nombreEsmalte(p.esmalte), p.descripcion, ...(p.etiquetas || [])].join(' '))]));
  const peso = p => (p.destacado ? Number(p.destacado) || 1 : 99);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const coincide = (p, f) => {
    if (f.cats && f.cats.length && !f.cats.includes(p.cat)) return false;
    if (f.esmaltes && f.esmaltes.length && !f.esmaltes.includes(p.esmalte)) return false;
    if (f.unica && !p.unica) return false;
    if (f.destacado && !p.destacado) return false;
    if (f.excluir && f.excluir.includes(p.id)) return false;
    if (f.precio) {
      const r = PRECIOS.find(x => x.id === f.precio);
      if (r) {
        const v = final(p);
        if (r.min != null && v <= r.min) return false;
        if (r.max != null && v > r.max) return false;
      }
    }
    if (f.q) {
      const palabras = norm(f.q).split(/[\s,.;:]+/).filter(w => w && !VACIAS.has(w));
      const t = textos.get(p.id);
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  };
  const comparar = {
    relevancia: (a, b) => (peso(a) - peso(b)) || (a.orden - b.orden),
    'precio-asc': (a, b) => (final(a) - final(b)) || (a.orden - b.orden),
    'precio-desc': (a, b) => (final(b) - final(a)) || (a.orden - b.orden),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || (a.orden - b.orden),
  };
  const copia = p => ({ ...p, etiquetas: [...(p.etiquetas || [])] });
  return {
    TOPE,
    consultar({ filtros = {}, orden = 'relevancia', cursor = null, limite = POR_PAGINA } = {}) {
      const lim = Math.min(TOPE, Math.max(1, Math.floor(Number(limite)) || 1));
      const lista = datos.filter(p => coincide(p, filtros)).sort(comparar[orden] || comparar.relevancia);
      let desde = 0;
      if (cursor != null) {
        const k = lista.findIndex(p => p.id === cursor);
        if (k < 0) return { items: [], cursor: null, hayMas: false, total: lista.length };
        desde = k + 1;
      }
      const pagina = lista.slice(desde, desde + lim);
      const hayMas = desde + pagina.length < lista.length;
      return { items: pagina.map(copia), cursor: hayMas ? pagina[pagina.length - 1].id : null, hayMas, total: lista.length };
    },
    obtener(id) {
      const p = datos.find(x => x.id === id);
      return p ? copia(p) : null;
    },
    contar(filtros = {}) {
      return datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
    },
    contarPor(campo, filtros = {}) {
      const r = {};
      datos.forEach(p => { if (coincide(p, filtros)) r[p[campo]] = (r[p[campo]] || 0) + 1; });
      return r;
    },
  };
}

const Tienda = crearTienda([
  { id: 'taza-rayas-de-tierra', nombre: 'Taza Rayas de Tierra', cat: 'tazas', esmalte: 'crudo', esmalteTxt: 'Crudo con trazos óxido', precio: 14500, descuento: 0, stock: 6, destacado: 1, img: 'images/p-taza-rayas.webp', medidas: 'Alto 10 cm · 350 ml aprox.', descripcion: 'Taza panzona con trazos verticales hechos a mano sobre el esmalte crudo. El asa es ancha, para agarrarla con toda la mano.', etiquetas: ['cafe', 'mate cocido', 'regalo'] },
  { id: 'taza-noche', nombre: 'Taza Noche', cat: 'tazas', esmalte: 'tostado', esmalteTxt: 'Tostado oscuro con surcos', precio: 15900, descuento: 0, stock: 4, img: 'images/p-taza-noche.webp', medidas: 'Alto 11 cm · 380 ml aprox.', descripcion: 'Esmalte tostado casi negro que deja ver los surcos del torno. Boca ancha y base firme.', etiquetas: ['cafe', 'oscura'] },
  { id: 'taza-con-plato-granito', nombre: 'Taza con plato Granito', cat: 'tazas', esmalte: 'crudo', esmalteTxt: 'Crudo moteado', precio: 17800, descuento: 0, stock: 5, img: 'images/p-taza-plato.webp', medidas: 'Taza 9 cm de alto · plato 15 cm', descripcion: 'Taza amplia con su plato, en esmalte crudo con motas tostadas. Para el desayuno largo de los domingos.', etiquetas: ['desayuno', 'te', 'plato'] },
  { id: 'taza-banda-celadon', nombre: 'Taza Banda Celadón', cat: 'tazas', esmalte: 'celadon', esmalteTxt: 'Crudo con banda celadón', precio: 13900, descuento: 0, stock: 8, img: 'images/p-taza-celadon.webp', medidas: 'Alto 8 cm · 280 ml aprox.', descripcion: 'Taza baja con una banda de esmalte celadón en el borde y el resto en crudo moteado.', etiquetas: ['cafe', 'te'] },
  { id: 'jarro-borde-laguna', nombre: 'Jarro Borde Laguna', cat: 'tazas', esmalte: 'celadon', esmalteTxt: 'Crudo con borde verde agua', precio: 13500, descuento: 0, stock: 7, img: 'images/p-jarro-azul.webp', medidas: 'Alto 10 cm · 320 ml aprox.', descripcion: 'Jarro recto con el borde bañado en un esmalte verde agua profundo.', etiquetas: ['jarro', 'cafe'] },
  { id: 'set-4-tazas-arena', nombre: 'Set de 4 tazas Arena', cat: 'tazas', esmalte: 'crudo', esmalteTxt: 'Crudo moteado', precio: 52000, descuento: 0, stock: 3, img: 'images/p-set-tazas.webp', medidas: 'Cada taza 10 cm · 330 ml aprox.', descripcion: 'Cuatro tazas de la misma horneada, parecidas entre sí pero no idénticas. Para la mesa familiar o para regalar.', etiquetas: ['set', 'regalo', 'juego'] },
  { id: 'ensaladera-musgo', nombre: 'Ensaladera Musgo', cat: 'cuencos', esmalte: 'salvia', esmalteTxt: 'Salvia con borde tostado', precio: 29500, descuento: 0, stock: 3, img: 'images/p-ensaladera.webp', medidas: 'Diámetro 28 cm · alto 11 cm', descripcion: 'Ensaladera grande con esmalte que corre del verde salvia al tostado. Para compartir en el centro de la mesa.', etiquetas: ['ensalada', 'fuente', 'compartir'] },
  { id: 'set-3-cuencos-apilables', nombre: 'Set de 3 cuencos apilables', cat: 'cuencos', esmalte: 'crudo', esmalteTxt: 'Crudo moteado, borde óxido', precio: 39000, descuento: 0, stock: 4, destacado: 8, img: 'images/p-cuencos-apilables.webp', medidas: 'Diámetro 16 cm · alto 7 cm cada uno', descripcion: 'Tres cuencos que se guardan uno dentro del otro. Sirven para sopa, cereales o una ensalada individual.', etiquetas: ['bowl', 'sopa', 'set'] },
  { id: 'vajilla-bruma-3-piezas', nombre: 'Vajilla Bruma · 3 piezas', cat: 'cuencos', esmalte: 'celadon', esmalteTxt: 'Celadón y crudo moteado', precio: 32000, descuento: 0, stock: 5, destacado: 5, img: 'images/p-vajilla-bruma.webp', medidas: 'Playo 27 cm · hondo 22 cm · cuenco 16 cm', descripcion: 'Plato playo, plato hondo y cuenco con el mismo esmalte celadón que se mezcla con el crudo. Un cubierto completo.', etiquetas: ['plato', 'plato hondo', 'set', 'vajilla'] },
  { id: 'fuente-rectangular-romero', nombre: 'Fuente rectangular Romero', cat: 'cuencos', esmalte: 'celadon', esmalteTxt: 'Celadón con borde óxido', precio: 24500, descuento: 0, stock: 4, img: 'images/p-fuente-romero.webp', medidas: '32 × 16 cm', descripcion: 'Fuente plana para servir pan, quesos o una picada. El esmalte celadón se junta en el centro.', etiquetas: ['picada', 'bandeja', 'servir'] },
  { id: 'cuenquito-aceitunero', nombre: 'Cuenquito Aceitunero', cat: 'cuencos', esmalte: 'salvia', esmalteTxt: 'Salvia jaspeado', precio: 8900, descuento: 0, stock: 10, img: 'images/p-aceitunero.webp', medidas: 'Diámetro 11 cm · alto 6 cm', descripcion: 'Cuenco chico para aceitunas, salsas o frutos secos. Cabe en la mano.', etiquetas: ['picada', 'salsa', 'chico'] },
  { id: 'jarra-moteada', nombre: 'Jarra Moteada', cat: 'cuencos', esmalte: 'crudo', esmalteTxt: 'Crudo con motas tostadas', precio: 28500, descuento: 0, stock: 2, img: 'images/p-jarra.webp', medidas: 'Alto 22 cm · 1 litro aprox.', descripcion: 'Jarra con pico y asa amplia, para agua, limonada o un ramo de flores.', etiquetas: ['agua', 'jarra'] },
  { id: 'fuente-honda-tostada', nombre: 'Fuente honda Tostada', cat: 'cuencos', esmalte: 'tostado', esmalteTxt: 'Crudo con borde tostado', precio: 27000, descuento: 15, stock: 1, unica: true, img: 'images/p-fuente-tostada.webp', medidas: 'Diámetro 26 cm · alto 9 cm', descripcion: 'Segunda selección: tiene un detalle mínimo en el esmalte del borde que no cambia su uso. Por eso tiene precio especial.', etiquetas: ['fuente', 'segunda seleccion', 'oferta'] },
  { id: 'cuenco-mediano-crudo', nombre: 'Cuenco mediano Crudo', cat: 'cuencos', esmalte: 'crudo', esmalteTxt: 'Crudo moteado', precio: 18900, descuento: 0, stock: 7, destacado: 2, img: 'images/p-cuenco-crudo.webp', medidas: 'Diámetro 20 cm · alto 9 cm', descripcion: 'El cuenco de todos los días: hondo, liviano y con el moteado característico del esmalte crudo.', etiquetas: ['bowl', 'ensalada', 'pasta'] },
  { id: 'frasco-con-tapa-ramas', nombre: 'Frasco con tapa Ramas', cat: 'cuencos', esmalte: 'crudo', esmalteTxt: 'Crudo con ramas en relieve', precio: 21000, descuento: 0, stock: 3, img: 'images/p-frasco.webp', medidas: 'Alto 14 cm · diámetro 12 cm', descripcion: 'Frasco con tapa y ramas en relieve, para azúcar, yerba o lo que quieras tener a mano en la cocina.', etiquetas: ['azucarera', 'yerbera', 'cocina'] },
  { id: 'florero-hojas-pintadas', nombre: 'Florero Hojas pintadas', cat: 'floreros', esmalte: 'crudo', esmalteTxt: 'Crudo con hojas en salvia y óxido', precio: 34000, descuento: 0, stock: 1, unica: true, destacado: 6, img: 'images/p-florero-hojas.webp', medidas: 'Alto 24 cm · boca 10 cm', descripcion: 'Pieza única con hojas modeladas y pintadas una por una. Para un ramo generoso.', etiquetas: ['flores', 'regalo', 'pieza unica'] },
  { id: 'florero-rustico-arena', nombre: 'Florero rústico Arena', cat: 'floreros', esmalte: 'crudo', esmalteTxt: 'Crudo moteado, pie tostado', precio: 22000, descuento: 0, stock: 3, destacado: 3, img: 'images/p-florero-arena.webp', medidas: 'Alto 26 cm', descripcion: 'Florero alto con el pie sin esmaltar, que deja ver el barro tostado. Queda bien con ramas y flores secas.', etiquetas: ['flores secas', 'ramas'] },
  { id: 'florero-panzon-salvia', nombre: 'Florero panzón Salvia', cat: 'floreros', esmalte: 'salvia', esmalteTxt: 'Salvia brillante', precio: 25500, descuento: 0, stock: 2, img: 'images/p-florero-salvia.webp', medidas: 'Alto 22 cm · diámetro 16 cm', descripcion: 'Florero redondo de boca angosta, en un esmalte salvia brillante que cambia con la luz.', etiquetas: ['flores', 'verde'] },
  { id: 'jarron-granito', nombre: 'Jarrón Granito', cat: 'floreros', esmalte: 'crudo', esmalteTxt: 'Crudo con moteado grueso', precio: 26000, descuento: 0, stock: 2, img: 'images/p-jarron-granito.webp', medidas: 'Alto 28 cm', descripcion: 'Jarrón de cuello largo con un moteado marcado, parecido al granito.', etiquetas: ['plantas colgantes', 'ramas'] },
  { id: 'jarron-terracota', nombre: 'Jarrón Terracota', cat: 'floreros', esmalte: 'terracota', esmalteTxt: 'Terracota satinado', precio: 24000, descuento: 0, stock: 2, img: 'images/p-jarron-terracota.webp', medidas: 'Alto 25 cm', descripcion: 'Jarrón de hombros anchos en un terracota satinado, cálido y parejo.', etiquetas: ['flores secas', 'terracota'] },
  { id: 'florero-nube', nombre: 'Florero Nube', cat: 'floreros', esmalte: 'crudo', esmalteTxt: 'Crudo jaspeado', precio: 19800, descuento: 0, stock: 4, img: 'images/p-florero-nube.webp', medidas: 'Alto 18 cm', descripcion: 'Florero de boca ancha, ideal para un ramo de gypsophila o flores silvestres.', etiquetas: ['flores', 'gypsophila'] },
  { id: 'florerito-espiga', nombre: 'Florerito Espiga', cat: 'floreros', esmalte: 'crudo', esmalteTxt: 'Crudo liso', precio: 12900, descuento: 0, stock: 6, img: 'images/p-florerito-espiga.webp', medidas: 'Alto 13 cm', descripcion: 'Florero chico para una ramita o flores secas sobre la mesa de luz o el escritorio.', etiquetas: ['chico', 'flores secas'] },
  { id: 'centro-de-mesa-ondas', nombre: 'Centro de mesa Ondas', cat: 'centros', esmalte: 'salvia', esmalteTxt: 'Salvia y óxido, borde ondulado', precio: 36000, descuento: 0, stock: 1, unica: true, destacado: 7, img: 'images/p-centro-ondas.webp', medidas: '34 × 22 cm · alto 9 cm', descripcion: 'Fuente baja de borde ondulado para el centro de la mesa: con frutas, piñas o velas.', etiquetas: ['decoracion', 'fuente', 'pieza unica'] },
  { id: 'fuente-volados', nombre: 'Fuente Volados', cat: 'centros', esmalte: 'terracota', esmalteTxt: 'Terracota brillante', precio: 31000, descuento: 0, stock: 2, img: 'images/p-fuente-volados.webp', medidas: 'Diámetro 30 cm · alto 8 cm', descripcion: 'Fuente redonda con el borde en volados, hecha pellizcando el barro a mano.', etiquetas: ['frutera', 'decoracion'] },
  { id: 'bandeja-redonda-laguna', nombre: 'Bandeja redonda Laguna', cat: 'centros', esmalte: 'celadon', esmalteTxt: 'Celadón con borde terracota', precio: 27500, descuento: 0, stock: 3, img: 'images/p-bandeja-laguna.webp', medidas: 'Diámetro 34 cm', descripcion: 'Bandeja ancha y baja: el celadón se junta en el centro como agua quieta.', etiquetas: ['bandeja', 'servir'] },
  { id: 'maceta-mediana-bicolor', nombre: 'Maceta mediana Bicolor', cat: 'macetas', esmalte: 'salvia', esmalteTxt: 'Salvia sobre crudo, con drenaje', precio: 19500, descuento: 0, stock: 5, destacado: 4, img: 'images/p-maceta-bicolor.webp', medidas: 'Diámetro 18 cm · alto 16 cm', descripcion: 'Maceta con agujero de drenaje y dos esmaltes que se cruzan a la mitad. Para potus, helechos o lo que tengas.', etiquetas: ['plantas', 'interior', 'drenaje'] },
  { id: 'maceta-acanalada', nombre: 'Maceta Acanalada', cat: 'macetas', esmalte: 'crudo', esmalteTxt: 'Crudo moteado', precio: 29000, descuento: 0, stock: 3, img: 'images/p-maceta-acanalada.webp', medidas: 'Diámetro 24 cm · alto 20 cm', descripcion: 'Maceta grande con canaletas verticales marcadas a mano, en esmalte crudo.', etiquetas: ['plantas', 'grande'] },
  { id: 'macetita-chorreada', nombre: 'Macetita Chorreada', cat: 'macetas', esmalte: 'salvia', esmalteTxt: 'Esmalte chorreado sobre arena', precio: 9800, descuento: 0, stock: 9, img: 'images/p-macetita.webp', medidas: 'Diámetro 10 cm · alto 9 cm', descripcion: 'Maceta chica con el esmalte chorreado desde el borde. Ideal para suculentas.', etiquetas: ['suculentas', 'chica'] },
  { id: 'maceta-baja-nube', nombre: 'Maceta baja Nube', cat: 'macetas', esmalte: 'crudo', esmalteTxt: 'Crudo moteado', precio: 16500, descuento: 0, stock: 4, img: 'images/p-maceta-nube.webp', medidas: 'Diámetro 22 cm · alto 10 cm', descripcion: 'Maceta baja y redonda para plantas rastreras o un pequeño jardín de cactus.', etiquetas: ['cactus', 'rastreras'] },
  { id: 'maceta-corteza', nombre: 'Maceta Corteza', cat: 'macetas', esmalte: 'crudo', esmalteTxt: 'Crudo con textura de corteza', precio: 14000, descuento: 0, stock: 3, img: 'images/p-maceta-corteza.webp', medidas: 'Diámetro 14 cm · alto 14 cm', descripcion: 'Maceta con textura en relieve que recuerda a la corteza de un árbol.', etiquetas: ['plantas', 'textura'] },
  { id: 'pajaritos-par', nombre: 'Pajaritos · par', cat: 'adornos', esmalte: 'salvia', esmalteTxt: 'Salvia y crudo', precio: 12500, descuento: 0, stock: 6, img: 'images/p-pajaritos.webp', medidas: 'Largo 12 y 10 cm', descripcion: 'Dos pajaritos modelados a mano, para la biblioteca, la mesa o la ventana.', etiquetas: ['regalo', 'aves', 'decoracion'] },
  { id: 'plato-hoja', nombre: 'Plato Hoja', cat: 'adornos', esmalte: 'salvia', esmalteTxt: 'Salvia con nervaduras', precio: 8900, descuento: 0, stock: 8, img: 'images/p-plato-hoja.webp', medidas: '16 × 11 cm', descripcion: 'Platito con forma de hoja: para anillos, llaves o un sahumerio.', etiquetas: ['regalo', 'porta sahumerio', 'joyero'] },
  { id: 'casita-farol', nombre: 'Casita farol', cat: 'adornos', esmalte: 'crudo', esmalteTxt: 'Crudo con ventanas caladas', precio: 16500, descuento: 0, stock: 3, img: 'images/p-casita.webp', medidas: 'Alto 13 cm', descripcion: 'Casita calada para poner una vela adentro y que la luz salga por las ventanas.', etiquetas: ['vela', 'luz', 'regalo'] },
]);

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => Tienda.obtener(id);

const Cart = {
  KEY: 'chepyaguapy_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items))); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  qtyDe(id) { return this.get().find(i => i.id === id)?.qty || 0; },
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

const waLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

let capasAbiertas = 0;
function abrirCapa() { capasAbiertas++; document.body.classList.add('no-scroll'); }
function cerrarCapa() { capasAbiertas = Math.max(0, capasAbiertas - 1); if (!capasAbiertas) document.body.classList.remove('no-scroll'); }
const FOCO = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll(FOCO)].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.unica) b.push('<span class="badge badge--unica">Pieza única</span>');
  else if (p.stock <= 2) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<div class="badges">${b.join('')}</div>` : '';
}
function precioHTML(p) {
  if (p.descuento > 0) return `<p class="price price--sale">${formatearPrecio(precioFinal(p))} <s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="price">${formatearPrecio(p.precio)}</p>`;
}
const dotEsm = p => `<span class="dot-esm esm-${p.esmalte}" aria-hidden="true"></span>`;
const stepperHTML = (p, etiqueta) => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar una">${ICON.minus}</button><input type="number" min="1" max="${p.stock}" value="1" inputmode="numeric" aria-label="Cantidad de ${esc(etiqueta)}"><button type="button" data-step="1" aria-label="Sumar una">${ICON.plus}</button></div>`;

function cardH(p) {
  return `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <article class="card-h">
      <div class="ph" data-quick="${p.id}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${p.img}" alt="${esc(p.nombre)}, ${esc(p.esmalteTxt.toLowerCase())}" width="600" height="600"></div>
      <div class="card-h__body">
        <button type="button" class="card-h__name" data-quick="${p.id}">${esc(p.nombre)}</button>
        <p class="card-h__esm">${dotEsm(p)}${esc(p.esmalteTxt)}</p>
        <div class="card-h__price">${precioHTML(p)}</div>
        <button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.cart}<span>Agregar</span></button>
      </div>
    </article>
  </li>`;
}

function cardV(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  return `<li${anim}>
    <article class="card-v">
      <div class="ph" data-quick="${p.id}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${p.img}" alt="${esc(p.nombre)}, ${esc(p.esmalteTxt.toLowerCase())}" width="600" height="600"></div>
      <div class="card-v__body">
        <button type="button" class="card-v__name" data-quick="${p.id}">${esc(p.nombre)}</button>
        <div class="card-v__price">${precioHTML(p)}</div>
        <p class="card-v__esm">${dotEsm(p)}${esc(p.esmalteTxt)}</p>
      </div>
      <div class="prod-actions">${stepperHTML(p, p.nombre)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.cart}<span>Agregar</span></button></div>
      <button type="button" class="card-v__now" data-buy="${p.id}">Comprar ahora</button>
    </article>
  </li>`;
}

function cardF(p, variante = 'subir', animar = true) {
  const estado = variante === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(40px)';
  const anim = animar ? ` data-animate="${variante}" style="${estado}"` : '';
  return `<li${anim}>
    <article class="card-f">
      <div class="ph" data-quick="${p.id}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.nombre)}, ${esc(p.esmalteTxt.toLowerCase())}" width="600" height="600"></div>
      ${badgesHTML(p)}
      <div class="card-f__info">
        <p class="card-f__esm">${dotEsm(p)}${esc(p.esmalteTxt)}</p>
        <h3 class="card-f__name">${esc(p.nombre)}</h3>
        <div class="card-f__price">${precioHTML(p)}</div>
        <button type="button" class="card-f__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.cart}<span>Agregar</span></button>
      </div>
    </article>
  </li>`;
}

function agregar(id, qty = 1, boton = null) {
  const p = getProducto(id);
  if (!p) return false;
  const ya = Cart.qtyDe(id);
  if (ya >= p.stock) {
    showToast(p.stock === 1 ? `${p.nombre} es pieza única y ya está en tu carrito` : `Ya tenés todas las unidades de ${p.nombre}`);
    return false;
  }
  const suma = Math.min(qty, p.stock - ya);
  Cart.add(p, suma);
  if (boton) {
    boton.classList.add('is-added');
    const span = boton.querySelector('span');
    const antes = span?.textContent;
    if (span) span.textContent = 'Agregada';
    setTimeout(() => { boton.classList.remove('is-added'); if (span) span.textContent = antes; }, 1300);
  }
  return suma;
}

function cantidadJunto(el) {
  const input = el.closest('article, .qv__acc')?.querySelector('.stepper input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const qty = cantidadJunto(add);
      const n = agregar(add.dataset.add, qty, add);
      if (n) showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${getProducto(add.dataset.add)?.nombre} al carrito`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const n = agregar(buy.dataset.buy, cantidadJunto(buy));
      if (n !== false) openCart(buy);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.closest('[data-stepper]')?.querySelector('input');
      if (!input) return;
      const max = parseInt(input.max, 10) || 99;
      const v = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      input.value = v;
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('[data-add]')) {
      openQuick(quick.dataset.quick, quick);
    }
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('[data-quick][role="button"]')) {
      e.preventDefault();
      openQuick(e.target.dataset.quick, e.target);
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

let cartOpener = null;
function renderCart() {
  const body = document.querySelector('[data-cart-lines]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!body) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty"><span class="cart-empty__ico">${ICON.bag}</span><h3>Todavía no elegiste ninguna pieza</h3><p>Las tazas, los cuencos y los floreros te esperan en la tienda.</p><a class="btn btn--ink" href="${CATALOGO_URL}">Volver a la tienda ${ICON.arrow}</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = items.map(({ p, qty }) => `
    <div class="cart-line" data-line="${p.id}">
      <div class="cart-line__img"><img src="${p.img}" alt="" width="76" height="76"></div>
      <div>
        <p class="cart-line__name">${esc(p.nombre)}</p>
        <p class="cart-line__esm">${esc(p.esmalteTxt)} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="stepper" data-cart-stepper><button type="button" data-cstep="-1" aria-label="Restar una">${ICON.minus}</button><input type="number" min="1" max="${p.stock}" value="${qty}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-cstep="1" aria-label="Sumar una">${ICON.plus}</button></div>
      </div>
      <div class="cart-line__right">
        <span class="cart-line__price">${formatearPrecio(precioFinal(p) * qty)}</span>
        <button type="button" class="cart-line__del" data-del="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.trash}</button>
      </div>
    </div>`).join('');
  const total = document.querySelector('[data-cart-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function openCart(opener) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!drawer || !drawer.hidden) return;
  cartOpener = opener || document.activeElement;
  renderCart();
  drawer.hidden = false; if (bd) bd.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open'); bd?.classList.add('open');
  abrirCapa();
  window.lenis?.stop();
  setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60);
}
function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-bd]');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd?.classList.remove('open');
  cerrarCapa();
  window.lenis?.start();
  setTimeout(() => { drawer.hidden = true; if (bd) bd.hidden = true; }, reduceMotion ? 0 : 400);
  cartOpener?.focus?.();
}

function initCart() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { openCart(e.target.closest('[data-open-cart]')); return; }
    if (e.target.closest('[data-close-cart]') || e.target.closest('[data-drawer-bd]')) { closeCart(); return; }
    const cs = e.target.closest('[data-cstep]');
    if (cs) {
      const id = cs.closest('[data-line]')?.dataset.line;
      const nuevo = Cart.qtyDe(id) + Number(cs.dataset.cstep);
      if (nuevo < 1) return;
      const p = getProducto(id);
      if (p && nuevo > p.stock) { showToast(p.stock === 1 ? 'Es pieza única: hay una sola' : `Hay ${p.stock} unidades de ${p.nombre}`); return; }
      Cart.setQty(id, nuevo);
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) { const p = getProducto(del.dataset.del); Cart.remove(del.dataset.del); if (p) showToast(`Quitaste ${p.nombre}`); return; }
    if (e.target.closest('[data-checkout]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('[data-cart-stepper] input');
    if (!input) return;
    Cart.setQty(input.closest('[data-line]').dataset.line, parseInt(input.value, 10) || 1);
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
    atraparFoco(drawer, e);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) { const f = document.activeElement; const sel = f?.closest('[data-line]') ? `[data-line="${f.closest('[data-line]').dataset.line}"] [data-cstep="${f.dataset.cstep}"]` : null; renderCart(); if (sel) drawer.querySelector(sel)?.focus(); } });
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

let qvOpener = null;
function openQuick(id, opener) {
  const qv = document.getElementById('quickView');
  const cont = qv?.querySelector('[data-qv-content]');
  const p = getProducto(id);
  if (!qv || !cont || !p) return;
  const rel = Tienda.consultar({ filtros: { cats: [p.cat], excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__foto">${badgesHTML(p)}<img src="${p.img}" alt="${esc(p.nombre)}, ${esc(p.esmalteTxt.toLowerCase())}" width="600" height="600"></div>
      <div class="qv__info">
        <a class="qv__cat" href="${CATALOGO_URL}?cat=${p.cat}">${esc(nombreCat(p.cat))}</a>
        <h2 class="qv__name">${esc(p.nombre)}</h2>
        <p class="qv__esm">${dotEsm(p)}Esmalte: ${esc(p.esmalteTxt)}</p>
        <div class="qv__price">${precioHTML(p)}</div>
        <p class="qv__desc">${esc(p.descripcion)}</p>
        <ul class="qv__datos"><li><strong>Medidas</strong><span>${esc(p.medidas)}</span></li><li><strong>Disponible</strong><span>${p.stock === 1 ? 'Pieza única' : p.stock + ' unidades'}</span></li></ul>
        <p class="qv__nota"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg><span>Hecha a mano: el esmalte y la medida pueden variar un poco respecto de la foto. Eso la hace única.</span></p>
        <div class="qv__acc">${stepperHTML(p, p.nombre)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.cart}<span>Agregar al carrito</span></button><button type="button" class="btn btn--ink" data-buy="${p.id}">Comprar ahora</button></div>
      </div>
    </div>
    ${rel.length ? `<div class="qv__rel"><h3 class="qv__rel-t">También te puede interesar</h3><div class="qv__rel-list">${rel.map(r => `<button type="button" class="mini" data-quick="${r.id}"><span class="mini__ph"><img src="${r.img}" alt="" width="300" height="300"></span><span class="mini__name">${esc(r.nombre)}</span><span class="mini__price">${formatearPrecio(precioFinal(r))}</span></button>`).join('')}</div></div>` : ''}`;
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.descripcion, brand: { '@type': 'Brand', name: 'chepyaguapy artesanías' }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  const yaAbierto = !qv.hidden;
  if (!yaAbierto) {
    qvOpener = opener || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('open');
    abrirCapa();
    window.lenis?.stop();
  } else {
    qv.querySelector('.qv__panel').scrollTop = 0;
  }
  intentar(() => { const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u); });
  setTimeout(() => qv.querySelector('.qv__close')?.focus(), 60);
}
function closeQuick() {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  cerrarCapa();
  window.lenis?.start();
  setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 380);
  intentar(() => { const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u); });
  qvOpener?.focus?.();
}
function initQuick() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) closeQuick();
    if (e.target.closest('[data-buy]')) setTimeout(closeQuick, 0);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuick();
    atraparFoco(qv, e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) openQuick(id, null);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  const header = document.querySelector('.site-header');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
  const close = () => {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); cerrarCapa();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); abrirCapa();
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatMenu() {
  const conteo = Tienda.contarPor('cat');
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? (params.get('cat') || '') : '';
  document.querySelectorAll('[data-catmenu]').forEach(menu => {
    const btn = menu.querySelector('.nav-cat__btn');
    const panel = menu.querySelector('.nav-cat__panel');
    const list = menu.querySelector('[data-cat-list]');
    if (!btn || !panel || !list) return;
    list.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-cat__link" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="48" height="48" loading="lazy"><span class="nav-cat__name">${esc(c.nombre)}</span><span class="nav-cat__count">${conteo[c.id] || 0}</span></a></li>`).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1081px)');
    let timer = 0;
    const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    menu.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    menu.addEventListener('mouseleave', () => { if (hoverMq.matches) timer = setTimeout(cerrar, 120); });
    menu.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); cerrar(); btn.focus(); } });
    menu.addEventListener('focusout', e => { if (hoverMq.matches && !menu.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!menu.contains(e.target) && !panel.hidden && hoverMq.matches) cerrar(); });
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

function initBanner() {
  const banner = document.querySelector('[data-slider]');
  if (!banner) return;
  const slides = [...banner.querySelectorAll('.banner__slide')];
  const dots = [...banner.querySelectorAll('.banner__dot')];
  const cap = banner.querySelector('[data-caption]');
  const CAPS = [
    { txt: 'Toda la mesa del taller', href: CATALOGO_URL, esm: 'crudo' },
    { txt: 'Cuencos y vajilla esmaltada', href: `${CATALOGO_URL}?cat=cuencos`, esm: 'salvia' },
    { txt: 'Floreros, centros y adornos', href: `${CATALOGO_URL}?cat=floreros`, esm: 'celadon' },
  ];
  let i = 0, timer = 0, pausa = false;
  const ir = n => {
    if (n === i || !slides[n]) return;
    const prev = slides[i];
    const next = slides[n];
    next.hidden = false;
    void next.offsetWidth;
    next.classList.add('is-active');
    prev.classList.remove('is-active');
    setTimeout(() => { if (!prev.classList.contains('is-active')) prev.hidden = true; }, reduceMotion ? 0 : 1150);
    dots.forEach((d, k) => d.setAttribute('aria-current', k === n ? 'true' : 'false'));
    if (cap) {
      cap.href = CAPS[n].href;
      cap.querySelector('[data-caption-txt]').textContent = CAPS[n].txt;
      cap.querySelector('.dot-esm').className = `dot-esm esm-${CAPS[n].esm}`;
    }
    i = n;
  };
  const programar = () => {
    clearTimeout(timer);
    if (reduceMotion) return;
    timer = setTimeout(() => { if (!pausa && !document.hidden) ir((i + 1) % slides.length); programar(); }, 6500);
  };
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); programar(); }));
  banner.addEventListener('mouseenter', () => { pausa = true; });
  banner.addEventListener('mouseleave', () => { pausa = false; });
  banner.addEventListener('focusin', () => { pausa = true; });
  banner.addEventListener('focusout', () => { pausa = false; });
  programar();
}

function initCategoriasTiles() {
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <a class="cat-tile" href="${CATALOGO_URL}?cat=${c.id}">
      <span class="ph"><img src="${c.img}" alt="${esc(c.nombre)} de cerámica hechas a mano" width="800" height="600"></span>
      <span class="cat-tile__body"><span class="cat-tile__name">${esc(c.nombre)}</span><span class="cat-tile__sub">${esc(c.sub)}</span><span class="cat-tile__go" aria-hidden="true">${ICON.arrow}</span></span>
    </a>
  </li>`).join('');
}

function initAmbientes() {
  const cont = document.querySelector('[data-ambientes]');
  if (!cont) return;
  cont.innerHTML = AMBIENTES.map(a => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">
    <a class="amb-card" href="${CATALOGO_URL}?amb=${a.id}">
      <span class="amb-card__img ph"><img src="${a.img}" alt="${esc(a.bajada)}" width="800" height="1000"></span>
      <span class="amb-card__k">${a.cats.map(c => esc(nombreCat(c))).join(' · ')}</span>
      <h3 class="amb-card__t">${esc(a.nombre)}</h3>
      <span class="amb-card__b">${esc(a.bajada)}</span>
      <span class="amb-card__all">Ver ${esc(a.nombre.toLowerCase())} ${ICON.arrow}</span>
    </a>
  </li>`).join('');
}

function initDestacados() {
  const lista = document.querySelector('[data-destacados]');
  const rail = document.querySelector('[data-rail]');
  const { items } = Tienda.consultar({ filtros: { destacado: true }, limite: 8 });
  if (lista) lista.innerHTML = items.map(p => cardH(p)).join('');
  if (rail) rail.innerHTML = items.map(p => cardF(p, 'der')).join('');
}

function initRailDrag(vp, itemSel) {
  if (!vp) return;
  let startX = 0, startLeft = 0, pointerId = null, moved = false, down = false;
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
      intentar(() => vp.setPointerCapture?.(pointerId));
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    intentar(() => vp.releasePointerCapture?.(pointerId));
    if (moved) {
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', () => { if (down) end(); });
  if (itemSel) vp.querySelectorAll(itemSel).forEach(img => img.setAttribute('draggable', 'false'));
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  initRailDrag(vp, 'img');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const sync = () => {
    const inicio = 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 1.5, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 1.5, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

let visorOpener = null;
function initGaleria() {
  const items = [...document.querySelectorAll('[data-gal]')];
  const visor = document.getElementById('visor');
  if (!items.length || !visor) return;
  if (MODELO === 2) initRailDrag(document.querySelector('.gal__grid'), 'img');
  const img = visor.querySelector('[data-visor-img]');
  const cap = visor.querySelector('[data-visor-cap]');
  const count = visor.querySelector('[data-visor-count]');
  let i = 0;
  const mostrar = n => {
    i = (n + items.length) % items.length;
    const src = items[i].querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = items[i].querySelector('.gal__cap')?.textContent || '';
    count.textContent = `${i + 1} de ${items.length}`;
  };
  const abrir = (n, opener) => {
    visorOpener = opener;
    mostrar(n);
    visor.hidden = false;
    void visor.offsetWidth;
    visor.classList.add('open');
    abrirCapa();
    window.lenis?.stop();
    setTimeout(() => visor.querySelector('.visor__close')?.focus(), 60);
  };
  const cerrar = () => {
    if (visor.hidden) return;
    visor.classList.remove('open');
    cerrarCapa();
    window.lenis?.start();
    setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 380);
    visorOpener?.focus?.();
  };
  items.forEach((it, k) => it.addEventListener('click', () => abrir(k, it)));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-close-visor]')) cerrar();
    else if (e.target.closest('[data-visor-prev]')) mostrar(i - 1);
    else if (e.target.closest('[data-visor-next]')) mostrar(i + 1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(i - 1);
    else if (e.key === 'ArrowRight') mostrar(i + 1);
    atraparFoco(visor, e);
  });
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  if (!form) return;
  const resumen = form.querySelector('[data-ped-resumen]');
  const enviar = form.querySelector('[data-ped-enviar]');
  const err = form.querySelector('#err-pieza');
  const val = name => form.querySelector(`[name="${name}"]:checked`)?.value || '';
  const txt = name => (form.querySelector(`[name="${name}"]`)?.value || '').trim();
  const componer = () => {
    const pieza = val('pieza');
    const esmalte = val('esmalte');
    const cant = Math.max(1, Math.min(300, parseInt(txt('cantidad'), 10) || 1));
    const lineas = ['¡Hola! Quiero hacer un pedido personalizado de cerámica.'];
    lineas.push(`• Pieza: ${pieza || 'a definir'}`);
    if (txt('uso')) lineas.push(`• Es ${txt('uso').toLowerCase()}`);
    lineas.push(`• Cantidad: ${cant}`);
    lineas.push(`• Esmalte: ${esmalte || 'que elija el taller'}`);
    if (txt('detalle')) lineas.push(`• Detalle: ${txt('detalle')}`);
    if (txt('fecha')) lineas.push(`• Para cuándo: ${txt('fecha')}`);
    if (txt('nombre')) lineas.push(`Soy ${txt('nombre')}.`);
    return { texto: lineas.join('\n'), pieza };
  };
  const actualizar = () => {
    const { texto, pieza } = componer();
    resumen.textContent = texto;
    enviar.href = waLink(texto);
    if (pieza && !err.hidden) { err.hidden = true; form.querySelector('[data-piezas]')?.removeAttribute('aria-invalid'); }
  };
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  enviar.addEventListener('click', e => {
    const { pieza } = componer();
    if (!pieza) {
      e.preventDefault();
      err.hidden = false;
      form.querySelector('[data-piezas]')?.setAttribute('aria-invalid', 'true');
      form.querySelector('[name="pieza"]')?.focus();
      showToast('Elegí qué pieza querés y lo mandamos');
    }
  });
  actualizar();
}

function leerFiltrosURL() {
  const q = new URLSearchParams(location.search);
  const ids = new Set(CATEGORIAS.map(c => c.id));
  const amb = AMBIENTES.find(a => a.id === q.get('amb')) || null;
  let cats = (q.get('cat') || '').split(',').map(s => s.trim()).filter(c => ids.has(c));
  if (!cats.length && amb) cats = [...amb.cats];
  const esmaltes = (q.get('esmalte') || '').split(',').filter(e => ESMALTES.some(x => x.id === e));
  const precio = PRECIOS.some(p => p.id === q.get('precio')) ? q.get('precio') : 'todos';
  const orden = ORDENES.some(o => o.id === q.get('orden')) ? q.get('orden') : 'relevancia';
  return { cats: [...new Set(cats)], esmaltes: [...new Set(esmaltes)], precio, unica: q.get('unica') === '1', q: (q.get('q') || '').slice(0, 60), orden, amb: amb && !q.get('cat') ? amb.id : null, buscar: q.get('buscar') === '1' };
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const estado = leerFiltrosURL();
  const el = {
    titulo: document.querySelector('[data-cat-title]'),
    lead: document.querySelector('[data-cat-lead]'),
    miga: document.querySelector('[data-miga-cat]'),
    cats: document.querySelector('[data-f-cats]'),
    esms: document.querySelector('[data-f-esmaltes]'),
    precios: document.querySelector('[data-f-precios]'),
    unica: document.querySelector('[data-f="unica"]'),
    q: document.querySelector('[data-f-q]'),
    orden: document.querySelector('[data-f-orden]'),
    count: document.querySelector('[data-count]'),
    chips: document.querySelector('[data-chips]'),
    empty: document.querySelector('[data-empty]'),
    more: document.querySelector('[data-more]'),
    moreInfo: document.querySelector('[data-more-info]'),
    filtros: document.getElementById('filtros'),
    btnFiltrar: document.querySelector('[data-filtrar]'),
    ver: document.querySelector('[data-ver-res]'),
    tabs: [...document.querySelectorAll('[data-amb-tab]')],
    hdrQ: document.querySelector('.hdr-search input'),
  };
  const conteoCat = Tienda.contarPor('cat');
  const conteoEsm = Tienda.contarPor('esmalte');
  el.cats.innerHTML = CATEGORIAS.map(c => `<label class="fchk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="fchk__n">${conteoCat[c.id] || 0}</span></label>`).join('');
  el.esms.innerHTML = ESMALTES.map(e => `<label class="fchk fchk--esm"><input type="checkbox" data-f="esmalte" value="${e.id}"><span class="dot-esm esm-${e.id}" aria-hidden="true"></span><span>${esc(e.nombre)}</span><span class="fchk__n">${conteoEsm[e.id] || 0}</span></label>`).join('');
  el.precios.innerHTML = PRECIOS.map(p => `<label class="fchk"><input type="radio" name="precio" data-f="precio" value="${p.id}"><span>${esc(p.nombre)}</span><span class="fchk__n"></span></label>`).join('');
  el.orden.innerHTML = ORDENES.map(o => `<option value="${o.id}">${esc(o.nombre)}</option>`).join('');
  const nUnica = el.unica?.closest('label')?.querySelector('.fchk__n');
  if (nUnica) nUnica.textContent = Tienda.contar({ unica: true });
  const otroModelo = document.querySelector('.gw-modelos__btn:not([aria-current])');
  const otroBase = otroModelo?.getAttribute('href') || '';
  let cursor = null;
  let mostrados = 0;

  const filtros = () => ({ cats: estado.cats, esmaltes: estado.esmaltes, precio: estado.precio, unica: estado.unica, q: estado.q });
  const pintarControles = () => {
    el.cats.querySelectorAll('input').forEach(i => { i.checked = estado.cats.includes(i.value); });
    el.esms.querySelectorAll('input').forEach(i => { i.checked = estado.esmaltes.includes(i.value); });
    el.precios.querySelectorAll('input').forEach(i => { i.checked = estado.precio === i.value; });
    if (el.unica) el.unica.checked = estado.unica;
    if (el.q && document.activeElement !== el.q) el.q.value = estado.q;
    if (el.hdrQ) el.hdrQ.value = estado.q;
    el.orden.value = estado.orden;
    const ambActivo = AMBIENTES.find(a => a.cats.length === estado.cats.length && a.cats.every(c => estado.cats.includes(c)));
    el.tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.ambTab === 'todo' ? !estado.cats.length : ambActivo?.id === t.dataset.ambTab)));
    const unaCat = estado.cats.length === 1 ? CATEGORIAS.find(c => c.id === estado.cats[0]) : null;
    let titulo = 'Toda la tienda';
    let lead = 'Tazas, cuencos, floreros, centros de mesa, macetas y adornos de cerámica, hechos a mano.';
    if (unaCat) { titulo = unaCat.nombre; lead = `${unaCat.sub}. Cada pieza es hecha a mano y puede variar un poco de la foto.`; }
    else if (ambActivo) { titulo = ambActivo.nombre; lead = ambActivo.bajada; }
    else if (estado.cats.length > 1) { titulo = estado.cats.map(nombreCat).join(', '); }
    if (estado.q) { titulo = `Resultados para «${estado.q}»`; }
    el.titulo.textContent = titulo;
    el.lead.textContent = lead;
    if (el.miga) { el.miga.hidden = !(unaCat || ambActivo || estado.q); el.miga.textContent = estado.q ? 'Búsqueda' : titulo; }
    document.title = `${titulo === 'Toda la tienda' ? 'Tienda' : titulo} — chepyaguapy artesanías`;
    document.querySelectorAll('.nav-cat__link').forEach(a => {
      const c = new URL(a.href, location.href).searchParams.get('cat');
      if (unaCat && c === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const activos = [];
    estado.cats.forEach(c => activos.push({ t: nombreCat(c), k: 'cat', v: c }));
    estado.esmaltes.forEach(e => activos.push({ t: `Esmalte ${nombreEsmalte(e).toLowerCase()}`, k: 'esmalte', v: e }));
    if (estado.precio !== 'todos') activos.push({ t: PRECIOS.find(p => p.id === estado.precio).nombre, k: 'precio', v: '' });
    if (estado.unica) activos.push({ t: 'Piezas únicas', k: 'unica', v: '' });
    if (estado.q) activos.push({ t: `«${estado.q}»`, k: 'q', v: '' });
    el.chips.innerHTML = activos.map(a => `<button type="button" class="chip-activo" data-quitar="${a.k}" data-valor="${esc(a.v)}" aria-label="Quitar filtro ${esc(a.t)}">${esc(a.t)}${ICON.close}</button>`).join('');
    if (el.btnFiltrar) el.btnFiltrar.querySelector('[data-n]').textContent = activos.length ? `(${activos.length})` : '';
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'amb', 'esmalte', 'precio', 'unica', 'q', 'orden', 'buscar'].forEach(k => u.searchParams.delete(k));
    const amb = AMBIENTES.find(a => a.cats.length === estado.cats.length && a.cats.every(c => estado.cats.includes(c)) && a.cats.length > 1);
    if (amb) u.searchParams.set('amb', amb.id);
    else if (estado.cats.length) u.searchParams.set('cat', estado.cats.join(','));
    if (estado.esmaltes.length) u.searchParams.set('esmalte', estado.esmaltes.join(','));
    if (estado.precio !== 'todos') u.searchParams.set('precio', estado.precio);
    if (estado.unica) u.searchParams.set('unica', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'relevancia') u.searchParams.set('orden', estado.orden);
    intentar(() => window.history.replaceState(null, '', u));
    if (otroModelo) {
      const s = new URLSearchParams(u.search);
      s.delete('producto');
      const qs = s.toString();
      otroModelo.setAttribute('href', otroBase + (qs ? `?${qs}` : ''));
    }
  };
  const pintar = (res, agregarAlFinal) => {
    const html = res.items.map(p => (MODELO === 2 ? cardF(p, 'subir') : cardV(p))).join('');
    if (agregarAlFinal) grid.insertAdjacentHTML('beforeend', html);
    else grid.innerHTML = html;
    mostrados = agregarAlFinal ? mostrados + res.items.length : res.items.length;
    cursor = res.cursor;
    el.count.textContent = res.total === 1 ? '1 pieza' : `${res.total} piezas`;
    el.empty.hidden = res.total > 0;
    grid.hidden = res.total === 0;
    el.more.hidden = !res.hayMas;
    el.moreInfo.textContent = res.total ? `Viendo ${mostrados} de ${res.total}` : '';
    if (el.ver) el.ver.querySelector('[data-n]').textContent = res.total;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const cargar = () => {
    pintarControles();
    escribirURL();
    pintar(Tienda.consultar({ filtros: filtros(), orden: estado.orden, limite: POR_PAGINA }), false);
  };
  el.more.addEventListener('click', () => {
    if (!cursor) return;
    pintar(Tienda.consultar({ filtros: filtros(), orden: estado.orden, cursor, limite: POR_PAGINA }), true);
  });
  el.filtros.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (f === 'cat') estado.cats = [...el.cats.querySelectorAll('input:checked')].map(i => i.value);
    else if (f === 'esmalte') estado.esmaltes = [...el.esms.querySelectorAll('input:checked')].map(i => i.value);
    else if (f === 'precio') estado.precio = e.target.value;
    else if (f === 'unica') estado.unica = e.target.checked;
    else return;
    cargar();
  });
  let deb = 0;
  el.q?.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { estado.q = el.q.value.trim().slice(0, 60); cargar(); }, 250);
  });
  el.q?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); estado.q = el.q.value.trim().slice(0, 60); cargar(); });
  document.querySelector('.hdr-search')?.addEventListener('submit', e => {
    e.preventDefault();
    estado.q = (el.hdrQ?.value || '').trim().slice(0, 60);
    cargar();
    grid.closest('section')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  el.orden.addEventListener('change', () => { estado.orden = el.orden.value; cargar(); });
  el.chips.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const k = b.dataset.quitar, v = b.dataset.valor;
    if (k === 'cat') estado.cats = estado.cats.filter(c => c !== v);
    if (k === 'esmalte') estado.esmaltes = estado.esmaltes.filter(x => x !== v);
    if (k === 'precio') estado.precio = 'todos';
    if (k === 'unica') estado.unica = false;
    if (k === 'q') estado.q = '';
    cargar();
  });
  const limpiar = () => { estado.cats = []; estado.esmaltes = []; estado.precio = 'todos'; estado.unica = false; estado.q = ''; cargar(); };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiar));
  el.tabs.forEach(t => t.addEventListener('click', () => {
    const a = AMBIENTES.find(x => x.id === t.dataset.ambTab);
    estado.cats = a ? [...a.cats] : [];
    cargar();
  }));
  el.btnFiltrar?.addEventListener('click', () => {
    const abierto = el.filtros.classList.toggle('open');
    el.filtros.classList.add('in');
    el.btnFiltrar.setAttribute('aria-expanded', String(abierto));
    if (abierto) el.filtros.querySelector('input')?.focus();
  });
  el.ver?.addEventListener('click', () => {
    el.filtros.classList.remove('open');
    el.btnFiltrar?.setAttribute('aria-expanded', 'false');
    el.btnFiltrar?.focus();
    grid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  cargar();
  if (estado.buscar && el.q) setTimeout(() => el.q.focus(), 300);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .hero-chip, .banner__foot > *'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.taller-card'), { y: 30, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.35);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    const sec = img.closest('section');
    gsap.to(img, { yPercent: -Number(img.dataset.parallax || 6), ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

document.addEventListener('cart:updated', updateCartBadge);

initCatMenu();
initCategoriasTiles();
initAmbientes();
initDestacados();
initCatalogo();
initAcciones();
initCart();
initQuick();
initFloats();
initNav();
initBanner();
initRail();
initGaleria();
initPedido();
initModelBarScroll();
updateCartBadge();
document.querySelectorAll('[data-cart-count]').forEach(b => b.classList.remove('bump'));
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initReveals();
initHeroMotion();
initParallax();
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
