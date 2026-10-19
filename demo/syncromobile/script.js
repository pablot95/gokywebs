const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492616044527';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const TIENDA_KEY = 'syncromobile_tienda';

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

const T_ANILLO = { tipo: 'Talle', ops: ['14', '15', '16', '17', '18', '19', '20'] };
const T_FUNDA = { tipo: 'Medida', ops: ['6,1″', '6,5″', '6,7″'] };

const DATOS = {
  celulares: [
    { id: 'cel-titanio', nombre: 'Celular 5G 6,6″ 512 GB Grafito', cat: 'celulares', sub: 'gama-alta', color: 'gris', memoria: '512', precio: 1499999, descuento: 0, stock: 4, alta: 28, rango: 1,
      img: 'images/p-cel-titanio.webp', galeria: ['images/gama-alta.webp'], alt: 'Celular gris grafito con triple cámara vertical, visto de atrás y de frente, sobre una mesa clara',
      specs: { Pantalla: '6,6″ AMOLED 120 Hz', Memoria: '512 GB', RAM: '12 GB', Cámara: 'Triple 50 MP', Batería: '5.000 mAh', Red: '5G' },
      desc: 'Terminación mate en grafito, triple cámara de 50 MP y la memoria más grande de la tienda, para guardar fotos y videos sin pensar en el espacio.' },
    { id: 'cel-azul-glaciar', nombre: 'Celular 5G 6,7″ 256 GB Azul Glaciar', cat: 'celulares', sub: 'gama-alta', color: 'azul', memoria: '256', precio: 1149999, descuento: 0, stock: 6, alta: 30, rango: 2, tag: 'Nuevo',
      img: 'images/p-cel-azul-glaciar.webp', galeria: ['images/hero-celular.webp'], alt: 'Celular azul glaciar de frente, con la pantalla encendida, sobre un fondo celeste',
      specs: { Pantalla: '6,7″ AMOLED 120 Hz', Memoria: '256 GB', RAM: '8 GB', Cámara: '50 MP + 12 MP', Batería: '5.000 mAh', Red: '5G' },
      desc: 'Pantalla grande de bordes finos y marco en azul glaciar. Va bien para mirar series, jugar y sacar fotos de noche.' },
    { id: 'cel-azul-noche', nombre: 'Celular 5G 6,4″ 256 GB Azul Noche', cat: 'celulares', sub: 'gama-alta', color: 'azul', memoria: '256', precio: 1049999, descuento: 10, stock: 5, alta: 26, rango: 3,
      img: 'images/p-cel-azul-noche.webp', galeria: ['images/escena-celulares-chica.webp'], alt: 'Celular azul noche parado, visto de atrás, con tres cámaras en columna',
      specs: { Pantalla: '6,4″ AMOLED 120 Hz', Memoria: '256 GB', RAM: '8 GB', Cámara: 'Triple 50 MP', Batería: '4.700 mAh', Red: '5G' },
      desc: 'Compacto, liviano y con triple cámara. Ideal si querés un gama alta que entre cómodo en el bolsillo.' },
    { id: 'cel-negro', nombre: 'Celular 5G 6,6″ 256 GB Negro Mate', cat: 'celulares', sub: 'gama-media', color: 'negro', memoria: '256', precio: 649999, descuento: 0, stock: 9, alta: 24, rango: 4,
      img: 'images/p-cel-negro.webp', alt: 'Celular negro mate visto de atrás con módulo de cámara cuadrado, junto a la vista de frente con la pantalla encendida',
      specs: { Pantalla: '6,6″ AMOLED 120 Hz', Memoria: '256 GB', RAM: '8 GB', Cámara: '50 MP + 8 MP + 2 MP', Batería: '5.000 mAh', Red: '5G' },
      desc: 'Pantalla AMOLED fluida, batería para todo el día y 256 GB. El equilibrio justo entre precio y prestaciones.' },
    { id: 'cel-celeste', nombre: 'Celular 5G 6,5″ 256 GB Celeste', cat: 'celulares', sub: 'gama-media', color: 'celeste', memoria: '256', precio: 599999, descuento: 15, stock: 7, alta: 27, rango: 5,
      img: 'images/p-cel-celeste.webp', alt: 'Celular celeste apoyado sobre una base de granito, visto de atrás con doble cámara',
      specs: { Pantalla: '6,5″ LCD 90 Hz', Memoria: '256 GB', RAM: '8 GB', Cámara: '50 MP + 2 MP', Batería: '5.000 mAh', Red: '5G' },
      desc: 'Color celeste suave, doble cámara y batería de 5.000 mAh. Un 5G para todos los días que no se queda corto de memoria.' },
    { id: 'cel-violeta', nombre: 'Celular 5G 6,5″ 128 GB Violeta', cat: 'celulares', sub: 'gama-media', color: 'violeta', memoria: '128', precio: 529999, descuento: 0, stock: 8, alta: 29, rango: 6, tag: 'Nuevo',
      img: 'images/p-cel-violeta.webp', alt: 'Celular violeta acostado sobre una mesa blanca, con doble cámara',
      specs: { Pantalla: '6,5″ LCD 90 Hz', Memoria: '128 GB', RAM: '6 GB', Cámara: '50 MP + 2 MP', Batería: '5.000 mAh', Red: '5G' },
      desc: 'El 5G más accesible de la tienda, en un violeta que se nota. Ideal como primer celular o para regalar.' },
    { id: 'kit-carga', nombre: 'Kit Funda + Cargador 25 W + Cable USB-C', cat: 'carga', sub: 'kits', color: 'arena', precio: 49999, descuento: 20, stock: 10, alta: 22, rango: 7, var: T_FUNDA,
      img: 'images/p-kit-carga.webp', alt: 'Funda de silicona color arena, cargador USB-C y cable trenzado sobre una mesa blanca',
      specs: { Incluye: 'Funda, cargador y cable', Carga: '25 W USB-C', Cable: '1,5 m trenzado', Color: 'Arena' },
      desc: 'Todo lo que tu celular nuevo necesita el primer día: funda de silicona, cargador rápido y cable trenzado, en el mismo tono arena.' },
    { id: 'funda-arena', nombre: 'Funda de Silicona Arena', cat: 'carga', sub: 'fundas', color: 'arena', precio: 14999, descuento: 0, stock: 20, alta: 21, rango: 8, var: T_FUNDA,
      img: 'images/p-funda-arena.webp', alt: 'Funda de silicona color arena puesta en un celular, vista de atrás',
      specs: { Material: 'Silicona', Interior: 'Microfibra', Bordes: 'Protegen la cámara', Color: 'Arena' },
      desc: 'Silicona suave al tacto, interior de microfibra y borde elevado alrededor de la cámara. Elegí la medida de tu pantalla.' },
    { id: 'cargador-25w', nombre: 'Cargador Rápido USB-C 25 W', cat: 'carga', sub: 'cargadores', color: 'arena', precio: 24999, descuento: 0, stock: 15, alta: 20, rango: 9,
      img: 'images/p-cargador.webp', alt: 'Cargador de pared compacto color arena con salida USB-C',
      specs: { Potencia: '25 W', Salida: 'USB-C', Tamaño: 'Compacto', Color: 'Arena' },
      desc: 'Compacto y con carga rápida de 25 W por USB-C. Va con el cable trenzado de la tienda.' },
    { id: 'cable-usbc', nombre: 'Cable USB-C Trenzado 1,5 m', cat: 'carga', sub: 'cables', color: 'arena', precio: 12999, descuento: 0, stock: 25, alta: 23, rango: 10,
      img: 'images/p-cable.webp', alt: 'Cable USB-C trenzado color arena enrollado sobre una mesa blanca',
      specs: { Largo: '1,5 m', Conectores: 'USB-C a USB-C', Funda: 'Trenzada', Color: 'Arena' },
      desc: 'Funda trenzada que no se enreda ni se quiebra en la punta. Un metro y medio para cargar en la cama o en el auto.' },
    { id: 'cel-proximo', nombre: 'Celular 5G próximo ingreso', cat: 'celulares', sub: 'gama-alta', color: 'negro', memoria: '256', precio: 1299999, descuento: 0, stock: 0, alta: 31, visible: false,
      img: 'images/p-cel-negro.webp', alt: 'Próximo ingreso', specs: {}, desc: 'Próximo ingreso.' },
  ],
  accesorios: [
    { id: 'anillo-estuche', nombre: 'Anillo Solitario con Estuche', cat: 'anillos', tono: 'plateado', detalle: 'cristales', precio: 24999, descuento: 0, stock: 6, alta: 27, rango: 1, var: T_ANILLO,
      img: 'images/p-anillo-estuche.webp', galeria: ['images/estuche.webp'], alt: 'Anillo plateado con una piedra central y banda entrelazada con cristales, dentro de un estuche de pana beige',
      desc: 'Piedra central redonda y banda entrelazada con cristales. Viene en su estuche de pana, listo para regalar.' },
    { id: 'anillo-ancho', nombre: 'Anillo Ancho Ondulado', cat: 'anillos', tono: 'dorado', detalle: 'liso', precio: 19999, descuento: 0, stock: 7, alta: 30, rango: 2, tag: 'Nuevo', var: T_ANILLO,
      img: 'images/p-anillo-ancho.webp', alt: 'Anillo dorado ancho con forma ondulada sobre una piedra clara',
      desc: 'Banda ancha con una onda suave que refleja la luz. Un anillo con presencia para usar solo.' },
    { id: 'anillo-racimo', nombre: 'Anillo Racimo de Cristales', cat: 'anillos', tono: 'dorado', detalle: 'cristales', precio: 15999, descuento: 0, stock: 8, alta: 25, rango: 3, var: T_ANILLO,
      img: 'images/p-anillo-racimo.webp', alt: 'Anillo dorado fino con un racimo de cristales pequeños en el centro',
      desc: 'Un racimo de cristales chiquitos sobre una banda fina. Queda lindo solo o combinado con una media alianza.' },
    { id: 'anillo-halo', nombre: 'Anillo Halo Oval', cat: 'anillos', tono: 'dorado', detalle: 'cristales', precio: 18999, descuento: 10, stock: 5, alta: 24, rango: 4, var: T_ANILLO,
      img: 'images/p-anillo-halo.webp', alt: 'Anillo dorado con una piedra oval rodeada por un halo de cristales',
      desc: 'Piedra oval rodeada por un halo de cristales. Clásico y luminoso, para una ocasión especial o para todos los días.' },
    { id: 'argollas', nombre: 'Argollas Clásicas Doradas', cat: 'aros', tono: 'dorado', detalle: 'liso', precio: 16999, descuento: 0, stock: 12, alta: 29, rango: 5, tag: 'Nuevo', var: { tipo: 'Tamaño', ops: ['3 cm', '4 cm', '5 cm'] },
      img: 'images/p-argollas.webp', galeria: ['images/hero-accesorios.webp'], alt: 'Par de argollas doradas colgadas de un exhibidor de pana beige',
      desc: 'Argollas lisas de cierre a presión, livianas para usar todo el día. Elegí el tamaño que más te guste.' },
    { id: 'set-pulseras', nombre: 'Set de 5 Pulseras Piedras y Dorado', cat: 'pulseras', tono: 'mixto', detalle: 'piedras', precio: 49999, descuento: 15, stock: 4, alta: 26, rango: 6,
      img: 'images/p-set-pulseras.webp', galeria: ['images/pulseras.webp'], alt: 'Cinco pulseras apiladas: cristales con cuarzo rosa, piedras blancas, esclava dorada, piedras durazno y trenzada de satén',
      desc: 'Las cinco pulseras de la foto: cristales con cuarzo rosa, piedras blancas veteadas, esclava dorada con medalla, piedras durazno y trenzada de satén.' },
    { id: 'anillo-nudo', nombre: 'Anillo Nudo con Strass', cat: 'anillos', tono: 'plateado', detalle: 'cristales', precio: 17999, descuento: 0, stock: 6, alta: 23, rango: 7, var: T_ANILLO,
      img: 'images/p-anillo-nudo.webp', alt: 'Anillo plateado con un nudo central cubierto de strass',
      desc: 'Un nudo central cubierto de strass sobre una banda plateada. Delicado y con mucho brillo.' },
    { id: 'pulsera-cuarzo', nombre: 'Pulsera Cristales y Cuarzo Rosa', cat: 'pulseras', tono: 'dorado', detalle: 'piedras', precio: 12999, descuento: 0, stock: 9, alta: 22, rango: 8,
      img: 'images/p-pulsera-cuarzo.webp', alt: 'Pulsera de cristales facetados con un cuarzo rosa redondo engarzado en dorado',
      desc: 'Cristales facetados color champagne y un cuarzo rosa engarzado en dorado. Elástica, se ajusta sola.' },
    { id: 'anillo-solitario-oval', nombre: 'Anillo Solitario Oval', cat: 'anillos', tono: 'plateado', detalle: 'cristales', precio: 16999, descuento: 0, stock: 7, alta: 21, rango: 9, var: T_ANILLO,
      img: 'images/p-anillo-solitario-oval.webp', alt: 'Anillo plateado con una piedra oval grande sostenida por garras',
      desc: 'Una piedra oval grande sostenida por garras finas, sobre una banda plateada lisa.' },
    { id: 'anillo-trenzado', nombre: 'Anillo Trenzado', cat: 'anillos', tono: 'dorado', detalle: 'liso', precio: 16999, descuento: 0, stock: 8, alta: 20, rango: 10, var: T_ANILLO,
      img: 'images/p-anillo-trenzado.webp', alt: 'Anillo dorado grueso con forma de trenza',
      desc: 'Dorado y con forma de trenza, para sumar volumen a la mano. Combina con las argollas.' },
    { id: 'media-alianza', nombre: 'Media Alianza con Cristales', cat: 'anillos', tono: 'dorado', detalle: 'cristales', precio: 14999, descuento: 0, stock: 10, alta: 19, rango: 11, var: T_ANILLO,
      img: 'images/p-media-alianza.webp', alt: 'Anillo dorado fino con una hilera de cristales en el frente',
      desc: 'Una hilera de cristales en el frente de una banda fina. Ideal para combinar con otros anillos.' },
    { id: 'esclava-medalla', nombre: 'Esclava Dorada con Medalla', cat: 'pulseras', tono: 'dorado', detalle: 'liso', precio: 13999, descuento: 10, stock: 8, alta: 18, rango: 12,
      img: 'images/p-esclava-medalla.webp', alt: 'Pulsera esclava dorada con una medalla martillada colgando',
      desc: 'Barra dorada curva con una medalla martillada que se mueve con vos. Va bien con las de piedras.' },
    { id: 'pulsera-durazno', nombre: 'Pulsera de Piedras Durazno', cat: 'pulseras', tono: 'dorado', detalle: 'piedras', precio: 11999, descuento: 0, stock: 9, alta: 17, rango: 13,
      img: 'images/p-pulsera-durazno.webp', alt: 'Pulsera de piedras facetadas color durazno con separadores dorados',
      desc: 'Piedras facetadas color durazno con separadores dorados. Elástica y cómoda.' },
    { id: 'pulsera-saten', nombre: 'Pulsera Trenzada de Satén', cat: 'pulseras', tono: 'dorado', detalle: 'tejida', precio: 9999, descuento: 0, stock: 14, alta: 16, rango: 14,
      img: 'images/p-pulsera-saten.webp', alt: 'Pulsera trenzada de satén color crema con hilo dorado',
      desc: 'Trenza de satén color crema con un hilo dorado. Liviana, para sumar textura a las demás.' },
    { id: 'perfume-proximo', nombre: 'Perfume próximo ingreso', cat: 'pulseras', tono: 'dorado', detalle: 'liso', precio: 29999, descuento: 0, stock: 0, alta: 31, visible: false,
      img: 'images/p-set-pulseras.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
  ],
};

const TIENDAS = {
  celulares: {
    id: 'celulares', nombre: 'Syncro Mobile', sync: { color: '#F8FAFC', luz: '#6E9BF0' },
    categorias: [
      { id: 'celulares', nombre: 'Celulares 5G', bajada: 'Gama media y alta', img: 'images/p-cel-titanio.webp',
        subs: [{ id: 'gama-alta', nombre: 'Gama alta' }, { id: 'gama-media', nombre: 'Gama media' }] },
      { id: 'carga', nombre: 'Fundas y cargadores', bajada: 'Para cuidar y cargar tu equipo', img: 'images/p-funda-arena.webp',
        subs: [{ id: 'fundas', nombre: 'Fundas' }, { id: 'cargadores', nombre: 'Cargadores' }, { id: 'cables', nombre: 'Cables' }, { id: 'kits', nombre: 'Kits' }] },
    ],
    tiles: [
      { tit: 'Gama alta', sub: 'Pantallas de 120 Hz y triple cámara', img: 'images/p-cel-titanio.webp', alt: 'Celular gris grafito con triple cámara', link: { cat: 'celulares', sub: 'gama-alta' } },
      { tit: 'Gama media', sub: '5G y batería para todo el día', img: 'images/p-cel-celeste.webp', alt: 'Celular celeste sobre una base de granito', link: { cat: 'celulares', sub: 'gama-media' } },
      { tit: 'Fundas y cargadores', sub: 'Carga rápida USB-C', img: 'images/carga.webp', alt: 'Funda arena, cargador y cable trenzado sobre una mesa blanca', link: { cat: 'carga' } },
      { tit: 'Promociones', sub: 'Precios rebajados', img: 'images/p-cel-azul-noche.webp', alt: 'Celular azul noche parado sobre una mesa blanca', link: { promo: 1 } },
    ],
    filtros: [
      { clave: 'cat', tit: 'Categoría' },
      { clave: 'sub', tit: 'Tipo' },
      { clave: 'memoria', tit: 'Memoria', ops: [{ id: '128', nombre: '128 GB' }, { id: '256', nombre: '256 GB' }, { id: '512', nombre: '512 GB' }] },
      { clave: 'color', tit: 'Color', ops: [{ id: 'azul', nombre: 'Azul' }, { id: 'celeste', nombre: 'Celeste' }, { id: 'violeta', nombre: 'Violeta' }, { id: 'negro', nombre: 'Negro' }, { id: 'gris', nombre: 'Gris grafito' }, { id: 'arena', nombre: 'Arena' }] },
      { clave: 'precio', tit: 'Precio' },
    ],
    precios: [
      { id: 'hasta100', nombre: 'Hasta $100.000', max: 100000 },
      { id: '100a700', nombre: '$100.001 a $700.000', min: 100001, max: 700000 },
      { id: 'mas700', nombre: 'Más de $700.000', min: 700001 },
    ],
    etiquetas: {
      celulares: 'celular celulares telefono smartphone movil equipo 5g', 'gama-alta': 'gama alta premium', 'gama-media': 'gama media',
      carga: 'carga cargar accesorio accesorios', fundas: 'funda fundas case protector', cargadores: 'cargador cargadores carga rapida enchufe', cables: 'cable cables usb tipo c', kits: 'kit combo',
      azul: 'azul', celeste: 'celeste', violeta: 'violeta lila', negro: 'negro', gris: 'gris grafito', arena: 'arena beige crema',
    },
    t: {
      title: 'Syncro Mobile — Celulares 5G y accesorios para mujer',
      eyebrow: 'Celulares 5G · Fundas · Cargadores',
      h1: 'Tu próximo celular 5G está acá',
      lead: 'Equipos de gama media y alta, con la funda y el cargador que van con cada uno. Si dudás entre dos, te ayudamos a elegir por WhatsApp.',
      cta: 'Ver celulares', navCats: 'Celulares', tilesTit: 'Nuestros celulares', gridTit: 'Fundas, cargadores y más',
      promoTit: m => `Hasta ${m}% off en celulares y combos de carga`,
      promoTxt: 'Equipos y combos de carga con el precio rebajado. Estos son los de hoy:',
      otraTit: '¿Buscás un regalo? Conocé la tienda de accesorios',
      otraTxt: 'Anillos, aros y pulseras dorados y plateados, en su propia tienda y con su propio carrito. Muy pronto, también cremas y perfumes.',
      otraBtn: 'Pasar a la tienda de accesorios', verTodo: 'Ver todo el catálogo',
      footerTxt: 'Celulares 5G de gama media y alta, fundas y cargadores. Comprás desde la web y coordinamos la entrega por WhatsApp.',
      footerCatsTit: 'Celulares', footerOtra: 'Ir a la tienda de accesorios', copy: '© 2026 Syncro Mobile', carritoTienda: 'en Syncro Mobile',
      catH1: 'Celulares 5G, fundas y cargadores', catLead: 'Todos los equipos y accesorios de carga de Syncro Mobile. Filtrá por gama, memoria o color.',
      buscar: 'Buscar celulares, fundas…', vacio: 'Todavía no sumaste celulares ni accesorios de carga.',
    },
    img: {
      hero: { src: 'images/hero-celular.webp', w: 900, h: 1599, alt: 'Celular 5G azul de pie sobre una mesa celeste, con la pantalla encendida' },
      escena: { src: 'images/escena-celulares.webp', w: 1672, h: 941, alt: 'Cinco celulares de distintos colores sobre una mesa blanca, junto a una planta y una esfera de vidrio' },
      promo: { src: 'images/escena-celulares-chica.webp', w: 960, h: 540, alt: 'Cinco celulares de distintos colores sobre una mesa blanca' },
      otra: { src: 'images/escena-accesorios-chica.webp', w: 900, h: 900, alt: 'Siete anillos dorados y plateados sobre una piedra clara' },
    },
    wsp: {
      general: 'Hola Syncro Mobile, quiero hacer una consulta.',
      hero: 'Hola Syncro Mobile, estoy buscando un celular 5G y quiero que me asesoren.',
      horarios: 'Hola Syncro Mobile, tengo una pregunta antes de comprar.',
      cierre: 'Hola Syncro Mobile, quiero coordinar un pedido.',
      saludo: 'Hola Syncro Mobile',
    },
    ticker: 'Te asesoramos por WhatsApp antes de comprar tu celular',
  },
  accesorios: {
    id: 'accesorios', nombre: 'Accesorios', sync: { color: '#FBF8F4', luz: '#D9B36A' },
    categorias: [
      { id: 'anillos', nombre: 'Anillos', bajada: 'Con cristales, lisos y con estuche', img: 'images/p-anillo-halo.webp', subs: [] },
      { id: 'aros', nombre: 'Aros', bajada: 'Argollas doradas', img: 'images/p-argollas.webp', subs: [] },
      { id: 'pulseras', nombre: 'Pulseras', bajada: 'De piedras, satén y esclavas', img: 'images/p-pulsera-cuarzo.webp', subs: [] },
    ],
    tiles: [
      { tit: 'Anillos', sub: 'Con cristales, lisos y con estuche', img: 'images/estuche.webp', alt: 'Anillo solitario plateado dentro de un estuche de pana beige', link: { cat: 'anillos' } },
      { tit: 'Aros', sub: 'Argollas doradas en tres tamaños', img: 'images/p-argollas.webp', alt: 'Argollas doradas colgadas de un exhibidor beige', link: { cat: 'aros' } },
      { tit: 'Pulseras', sub: 'Piedras, satén y esclavas', img: 'images/p-pulsera-cuarzo.webp', alt: 'Pulsera de cristales con un cuarzo rosa', link: { cat: 'pulseras' } },
      { tit: 'Cremas y perfumes', sub: 'Muy pronto en la tienda', pronto: true },
    ],
    filtros: [
      { clave: 'cat', tit: 'Categoría' },
      { clave: 'tono', tit: 'Tono', ops: [{ id: 'dorado', nombre: 'Dorado' }, { id: 'plateado', nombre: 'Plateado' }, { id: 'mixto', nombre: 'Combinado' }] },
      { clave: 'detalle', tit: 'Detalle', ops: [{ id: 'cristales', nombre: 'Con cristales' }, { id: 'piedras', nombre: 'Con piedras' }, { id: 'liso', nombre: 'Liso' }, { id: 'tejida', nombre: 'Tejido' }] },
      { clave: 'precio', tit: 'Precio' },
    ],
    precios: [
      { id: 'hasta15', nombre: 'Hasta $15.000', max: 15000 },
      { id: '15a25', nombre: '$15.001 a $25.000', min: 15001, max: 25000 },
      { id: 'mas25', nombre: 'Más de $25.000', min: 25001 },
    ],
    etiquetas: {
      anillos: 'anillo anillos sortija', aros: 'aro aros argolla argollas', pulseras: 'pulsera pulseras brazalete esclava',
      dorado: 'dorado dorada oro', plateado: 'plateado plateada plata', mixto: 'combinado mixto',
      cristales: 'cristal cristales strass brillo', piedras: 'piedra piedras cuarzo', liso: 'liso lisa', tejida: 'tejida trenzada saten',
    },
    t: {
      title: 'Accesorios — Anillos, aros y pulseras · Syncro Mobile',
      eyebrow: 'Anillos · Aros · Pulseras',
      h1: 'Anillos, aros y pulseras para usar todos los días',
      lead: 'Dorados y plateados, con cristales, piedras o lisos, para regalar o regalarte. Muy pronto también vas a encontrar cremas y perfumes.',
      cta: 'Ver accesorios', navCats: 'Accesorios', tilesTit: 'Nuestros accesorios', gridTit: 'Más para combinar',
      promoTit: m => `Hasta ${m}% off en pulseras y anillos`,
      promoTxt: 'Piezas y sets con el precio rebajado. Estos son los de hoy:',
      otraTit: '¿Necesitás un celular nuevo? Conocé Syncro Mobile',
      otraTxt: 'Celulares 5G de gama media y alta, con fundas y cargadores, en su propia tienda y con su propio carrito.',
      otraBtn: 'Pasar a Syncro Mobile', verTodo: 'Ver todo el catálogo',
      footerTxt: 'Anillos, aros y pulseras dorados y plateados para mujer. Comprás desde la web y coordinamos la entrega por WhatsApp.',
      footerCatsTit: 'Accesorios', footerOtra: 'Ir a Syncro Mobile (celulares)', copy: '© 2026 Syncro Mobile · Accesorios', carritoTienda: 'en la tienda de accesorios',
      catH1: 'Anillos, aros y pulseras', catLead: 'Todas las piezas de la tienda de accesorios. Filtrá por tipo, tono o detalle.',
      buscar: 'Buscar anillos, aros…', vacio: 'Todavía no sumaste anillos, aros ni pulseras.',
    },
    img: {
      hero: { src: 'images/hero-accesorios.webp', w: 1100, h: 1100, alt: 'Argollas doradas colgadas de un exhibidor de pana beige, sobre mármol' },
      escena: { src: 'images/escena-accesorios.webp', w: 1254, h: 1254, alt: 'Siete anillos dorados y plateados sobre una piedra clara y una tela de lino' },
      promo: { src: 'images/pulseras.webp', w: 900, h: 900, alt: 'Cinco pulseras de piedras, cristales y dorado apiladas sobre una piedra clara' },
      otra: { src: 'images/escena-celulares-chica.webp', w: 960, h: 540, alt: 'Cinco celulares de distintos colores sobre una mesa blanca' },
    },
    wsp: {
      general: 'Hola, quiero hacer una consulta por los accesorios.',
      hero: 'Hola, estoy buscando anillos, aros o pulseras y quiero que me asesoren.',
      horarios: 'Hola, tengo una pregunta sobre los accesorios antes de comprar.',
      cierre: 'Hola, quiero coordinar un pedido de accesorios.',
      saludo: 'Hola',
    },
    ticker: 'Muy pronto: cremas y perfumes en la tienda',
  },
};

const HORARIOS = { 0: [], 1: [[540, 780], [1020, 1260]], 2: [[540, 780], [1020, 1260]], 3: [[540, 780], [1020, 1260]], 4: [[540, 780], [1020, 1260]], 5: [[540, 780], [1020, 1260]], 6: [[600, 840]] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function crearTienda(coleccion, { tope = 100, precios = [], etiquetas = {} } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v != null && v !== '' ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const ATRIBUTOS = ['color', 'memoria', 'tono', 'detalle'];
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, ...ATRIBUTOS.map(k => p[k]), p.cat, p.sub,
    etiquetas[p.cat] || '', etiquetas[p.sub] || '', ...ATRIBUTOS.map(k => etiquetas[p[k]] || ''),
  ].join(' '))]));
  const enRango = (v, r) => (r.min == null || v >= r.min) && (r.max == null || v <= r.max);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    for (const [k, vals] of Object.entries(f.attrs || {})) {
      const v = lista(vals);
      if (v.length && !lista(p[k]).some(x => v.includes(x))) return false;
    }
    if (precio.length && !precios.filter(r => precio.includes(r.id)).some(r => enRango(final(p), r))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.promo && !(p.descuento > 0)) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'descuento': return (a, b) => (b.descuento || 0) - (a.descuento || 0) || (a.rango || 999) - (b.rango || 999) || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
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
  function sinClave(filtros, k) {
    const f = { ...filtros, attrs: { ...(filtros.attrs || {}) } };
    if (k in f.attrs) delete f.attrs[k];
    else delete f[k];
    return f;
  }
  function facetas(filtros = {}, claves = []) {
    const res = {};
    claves.forEach(k => {
      const base = sinClave(filtros, k);
      const cuenta = {};
      visibles.forEach(p => {
        if (!coincide(p, base)) return;
        if (k === 'precio') precios.forEach(r => { if (enRango(final(p), r)) cuenta[r.id] = (cuenta[r.id] || 0) + 1; });
        else if (k === 'promo') { if (p.descuento > 0) cuenta.si = (cuenta.si || 0) + 1; }
        else lista(p[k]).forEach(v => { cuenta[v] = (cuenta[v] || 0) + 1; });
      });
      res[k] = cuenta;
    });
    return res;
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  function maxDescuento() {
    return visibles.reduce((m, p) => Math.max(m, p.descuento || 0), 0);
  }
  return { TOPE: tope, consultar, contar, facetas, obtener, maxDescuento };
}

const SERVIDOR = {
  celulares: crearTienda(DATOS.celulares, { tope: 100, precios: TIENDAS.celulares.precios, etiquetas: TIENDAS.celulares.etiquetas }),
  accesorios: crearTienda(DATOS.accesorios, { tope: 100, precios: TIENDAS.accesorios.precios, etiquetas: TIENDAS.accesorios.etiquetas }),
};

let TIENDA = leerTiendaInicial();
const tienda = () => TIENDAS[TIENDA];
const Tienda = () => SERVIDOR[TIENDA];

function leerTiendaInicial() {
  const p = new URLSearchParams(location.search).get('tienda');
  if (p && TIENDAS[p]) return p;
  try {
    const s = window.sessionStorage.getItem(TIENDA_KEY);
    if (s && TIENDAS[s]) return s;
  } catch (e) { void e; }
  return 'celulares';
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => SERVIDOR[TIENDA].obtener(id) || SERVIDOR.celulares.obtener(id) || SERVIDOR.accesorios.obtener(id);
const tiendaDe = id => (SERVIDOR.celulares.obtener(id) ? 'celulares' : SERVIDOR.accesorios.obtener(id) ? 'accesorios' : null);
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const urlCat = (params = {}) => {
  const q = new URLSearchParams({ tienda: TIENDA });
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') q.set(k, v); });
  return `${CATALOGO_URL}?${q.toString()}`;
};
const urlProducto = p => urlCat({ producto: p.id });
const catDe = p => TIENDAS[tiendaDe(p.id) || TIENDA].categorias.find(c => c.id === p.cat);
const subDe = p => catDe(p)?.subs?.find(s => s.id === p.sub);
const nombreOp = (clave, id) => {
  const g = tienda().filtros.find(f => f.clave === clave);
  return g?.ops?.find(o => o.id === id)?.nombre || id;
};

function metaDe(p) {
  if (p.cat === 'celulares') return `5G · ${p.memoria} GB · ${p.specs?.RAM || ''} RAM`;
  if (tiendaDe(p.id) === 'celulares') return subDe(p)?.nombre || catDe(p)?.nombre || '';
  const tonos = { dorado: 'Dorado', plateado: 'Plateado', mixto: 'Combinado' };
  return `${catDe(p)?.nombre || ''} · ${tonos[p.tono] || ''}`;
}

const Cart = {
  get KEY() { return `syncromobile_cart_${TIENDA}`; },
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  derecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  quitar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l1 13H5Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta etiqueta--nuevo">${esc(p.tag)}</span>`);
  else if (p.stock <= 3) b.push('<span class="etiqueta">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p, { compacta = false, grande = false, animar = true } = {}) {
  const nombre = esc(p.nombre);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const media = `<div class="prod__media"><div class="prod__foto" data-qv="${p.id}"><img src="${p.img}" alt="${esc(p.alt)}" width="720" height="900" decoding="async"></div>${badgesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    const accion = conVar(p)
      ? `<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir ${esc(p.var.tipo.toLowerCase())} y agregar: ${nombre}">${ICON.carritoMas}</button>`
      : `<button type="button" class="prod-mini" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}"${anim}>${media}<div class="prod__body"><p class="prod__meta">${esc(metaDe(p))}</p>${titulo}<div class="prod__fila">${precioHTML(p)}${accion}</div></div></article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">${esc(p.var.tipo)} de ${nombre}</span><select data-op><option value="">${esc(p.var.tipo)}</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod"${anim}>${media}<div class="prod__body"><p class="prod__meta">${esc(metaDe(p))}</p>${titulo}${precioHTML(p)}<div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div><button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button></div></article>`;
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

function observarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { nuevos.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const d = Math.min(n++ * 0.08, 0.6);
      el.style.transitionDelay = `${d}s`;
      el.classList.add('in');
      setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
      io.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    let n = 0;
    nuevos.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top - 64 < window.innerHeight) {
        const d = Math.min(n++ * 0.08, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add('in');
        setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
      } else io.observe(el);
    });
  }));
}

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

function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), select, input, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null || el === document.activeElement);
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.cats-menu__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
  window.cerrarNav = close;
}

function pintarCatsMenu() {
  const panel = document.querySelector('[data-cats-panel]');
  if (!panel) return;
  const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  const items = tienda().categorias.map(c => {
    const n = Tienda().contar({ cat: c.id });
    return `<a class="cats-menu__item" href="${urlCat({ cat: c.id })}"${actual === c.id ? ' aria-current="true"' : ''}><span class="cats-menu__mini"><img src="${c.img}" alt="" width="80" height="100" loading="lazy" decoding="async"></span><span class="cats-menu__txt"><strong>${esc(c.nombre)}</strong><span>${n} ${n === 1 ? 'producto' : 'productos'} · ${esc(c.bajada)}</span></span></a>`;
  });
  const promos = Tienda().contar({ promo: true });
  items.push(`<a class="cats-menu__item" href="${urlCat({ promo: 1 })}"><span class="cats-menu__mini"><img src="${tienda().img.promo.src}" alt="" width="80" height="80" loading="lazy" decoding="async"></span><span class="cats-menu__txt"><strong>Promociones</strong><span>${promos} con precio rebajado</span></span></a>`);
  panel.innerHTML = items.join('') + `<a class="cats-menu__todo" href="${urlCat()}">Ver todo el catálogo${ICON.flecha}</a>`;
}

function initCatsMenu() {
  const wrap = document.querySelector('[data-cats-menu]');
  if (!wrap) return;
  const btn = wrap.querySelector('.cats-menu__btn');
  const panel = wrap.querySelector('[data-cats-panel]');
  const desktop = window.matchMedia('(min-width: 769px)');
  let timer = 0;
  const abrir = () => {
    clearTimeout(timer);
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('abierto'));
    btn.setAttribute('aria-expanded', 'true');
  };
  const cerrar = () => {
    clearTimeout(timer);
    panel.classList.remove('abierto');
    btn.setAttribute('aria-expanded', 'false');
    if (desktop.matches) timer = setTimeout(() => { panel.hidden = true; }, 220);
    else panel.hidden = true;
  };
  btn.addEventListener('click', () => {
    if (desktop.matches && window.matchMedia('(hover: hover)').matches) { abrir(); return; }
    if (btn.getAttribute('aria-expanded') === 'true') cerrar(); else abrir();
  });
  wrap.addEventListener('mouseenter', () => { if (desktop.matches && window.matchMedia('(hover: hover)').matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (desktop.matches && window.matchMedia('(hover: hover)').matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (desktop.matches && !wrap.contains(e.target) && btn.getAttribute('aria-expanded') === 'true') cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { cerrar(); btn.focus(); } });
  panel.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || PAGINA !== 'catalogo') return;
    const url = new URL(a.href, location.href);
    if (!url.pathname.endsWith(CATALOGO_URL)) return;
    e.preventDefault();
    cerrar();
    window.cerrarNav?.();
    Catalogo.desdeURL(url);
  });
  window.cerrarCatsMenu = cerrar;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'scale' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter,transform,opacity' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__pruebas li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello, .ticker'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity,scale' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero');
  const media = hero?.querySelector('.hero__media, .hero__foto img');
  if (!media) return;
  gsap.to(media, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function ahoraMendoza() {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Mendoza', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
  const partes = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[partes.weekday] ?? new Date().getDay(), min: (parseInt(partes.hour, 10) % 24) * 60 + parseInt(partes.minute, 10) };
}
const hora = m => { const h = Math.floor(m / 60), mm = m % 60; return `${h}${mm ? ':' + String(mm).padStart(2, '0') : ''} h`; };

function estadoAtencion() {
  const { dia, min } = ahoraMendoza();
  const hoy = HORARIOS[dia] || [];
  const tramo = hoy.find(([a, b]) => min >= a && min < b);
  if (tramo) {
    return { abierto: true, si: 'Abierto ahora', mas: ` · hasta las ${hora(tramo[1])}`, grande: 'Abierto ahora', sub: `Te respondemos por WhatsApp hasta las ${hora(tramo[1])}.` };
  }
  const luego = hoy.find(([a]) => a > min);
  if (luego) {
    return { abierto: false, si: 'Cerrado', mas: ` · abrimos a las ${hora(luego[0])}`, grande: 'Cerrado ahora', sub: `Volvemos a atender hoy a las ${hora(luego[0])}. Dejanos tu mensaje y te respondemos apenas abrimos.` };
  }
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if ((HORARIOS[d] || []).length) {
      const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
      const a = HORARIOS[d][0][0];
      return { abierto: false, si: 'Cerrado', mas: ` · abrimos ${cuando} a las ${hora(a)}`, grande: 'Cerrado ahora', sub: `Volvemos a atender ${cuando} a las ${hora(a)}. Dejanos tu mensaje y te respondemos apenas abrimos.` };
    }
  }
  return { abierto: false, si: 'Horarios de atención', mas: '', grande: 'Horarios de atención', sub: '' };
}

function pintarEstado() {
  const e = estadoAtencion();
  const { dia } = ahoraMendoza();
  document.querySelectorAll('[data-estado]').forEach(el => {
    el.innerHTML = `<span>${esc(e.si)}<span class="estado__mas">${esc(e.mas)}</span></span>`;
    el.classList.toggle('is-abierto', e.abierto);
    el.classList.toggle('is-cerrado', !e.abierto);
  });
  document.querySelectorAll('[data-estado-grande]').forEach(el => { el.textContent = e.grande; });
  document.querySelectorAll('[data-estado-sub]').forEach(el => { if (e.sub) el.textContent = e.sub; });
  document.querySelectorAll('[data-horarios] tr[data-dias]').forEach(tr => {
    tr.classList.toggle('es-hoy', tr.dataset.dias.split(',').map(Number).includes(dia));
  });
}
function initEstado() {
  pintarEstado();
  window.setInterval(pintarEstado, 60000);
}

function aplicarTextos() {
  const t = tienda();
  const max = Tienda().maxDescuento();
  document.querySelectorAll('[data-t]').forEach(el => {
    const v = t.t[el.dataset.t];
    if (v == null) return;
    el.textContent = typeof v === 'function' ? v(max) : v;
  });
  document.querySelectorAll('[data-img]').forEach(img => {
    const d = t.img[img.dataset.img];
    if (!d) return;
    if (img.getAttribute('src') !== d.src) {
      img.src = d.src;
      img.width = d.w;
      img.height = d.h;
    }
    img.alt = d.alt;
  });
  document.querySelectorAll('[data-wsp]').forEach(a => { a.href = wspHref(t.wsp[a.dataset.wsp] || t.wsp.general); });
  document.querySelectorAll('[data-link="catalogo"]').forEach(a => { a.href = urlCat(); });
  document.querySelectorAll('[data-link="promos"]').forEach(a => { a.href = urlCat({ promo: 1 }); });
  document.querySelectorAll('[data-ph="buscar"]').forEach(i => { i.placeholder = t.t.buscar; });
  document.querySelectorAll('[data-tienda-input]').forEach(i => { i.value = TIENDA; });
  document.querySelectorAll('[data-tienda-btn]').forEach(b => {
    if (b.dataset.tiendaBtn === TIENDA) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.gw-modelos__btn').forEach(a => {
    const base = PAGINA === 'catalogo' ? (a.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html') : (a.dataset.modelo === '2' ? 'modelo-2.html' : './');
    a.setAttribute('href', TIENDA === 'celulares' ? base : `${base}?tienda=${TIENDA}`);
  });
  document.querySelectorAll('[data-footer-cats]').forEach(ul => {
    ul.innerHTML = t.categorias.map(c => `<li><a href="${urlCat({ cat: c.id })}">${esc(c.nombre)}</a></li>`).join('')
      + `<li><a href="${urlCat({ promo: 1 })}">Promociones</a></li>`;
  });
  if (PAGINA === 'home') document.title = t.t.title;
  else document.title = `Catálogo de ${TIENDA === 'celulares' ? 'Syncro Mobile' : 'accesorios'} — Syncro Mobile`;
  pintarCatsMenu();
}

function linkTile(link) {
  return urlCat(link.promo ? { promo: 1 } : { cat: link.cat, sub: link.sub });
}
function contarTile(link) {
  return Tienda().contar(link.promo ? { promo: true } : { cat: link.cat, sub: link.sub });
}

function renderTiles() {
  const cont = document.querySelector('[data-tiles]');
  if (!cont) return;
  cont.innerHTML = tienda().tiles.map(x => {
    if (x.pronto) {
      return `<div class="tile tile--pronto" data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="tile__foto"><span>${esc(x.tit)}</span></div><div class="tile__pie"><span>${esc(x.sub)}</span></div></div>`;
    }
    const n = contarTile(x.link);
    return `<a class="tile" href="${linkTile(x.link)}" data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="tile__foto"><img src="${x.img}" alt="${esc(x.alt)}" width="720" height="450" decoding="async"></div><div class="tile__pie"><span>${esc(x.tit)}<small>${n} ${n === 1 ? 'producto' : 'productos'}<span class="bajada-larga"> · ${esc(x.sub)}</span></small></span>${ICON.derecha}</div></a>`;
  }).join('');
}

function renderColecciones() {
  const cont = document.querySelector('[data-colecciones]');
  if (!cont) return;
  cont.innerHTML = tienda().tiles.map(x => {
    if (x.pronto) {
      return `<div class="coleccion coleccion--pronto" data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="coleccion__txt"><span><strong>${esc(x.tit)}</strong><small>${esc(x.sub)}</small></span></div></div>`;
    }
    const n = contarTile(x.link);
    return `<a class="coleccion" href="${linkTile(x.link)}" data-animate="subir" style="opacity:0;transform:translateY(48px)"><span class="coleccion__foto"><img src="${x.img}" alt="${esc(x.alt)}" width="720" height="900" decoding="async"></span><span class="coleccion__txt"><span><strong>${esc(x.tit)}</strong><small>${n} ${n === 1 ? 'producto' : 'productos'}<span class="bajada-larga"> · ${esc(x.sub)}</span></small></span><span class="coleccion__flecha">${ICON.flecha}</span></span></a>`;
  }).join('');
}

let railIds = [];
function renderRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const items = Tienda().consultar({ orden: 'destacados', limite: 6 }).items;
  railIds = items.map(p => p.id);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { compacta: true, animar: false })}</div>`).join('');
  const vp = document.querySelector('[data-rail-vp]');
  if (vp) vp.scrollLeft = 0;
  document.dispatchEvent(new CustomEvent('rail:pintado'));
}

function renderGridHome() {
  const cont = document.querySelector('[data-grid-home]');
  if (!cont) return;
  const items = Tienda().consultar({ orden: 'nuevos', filtros: { excluir: railIds }, limite: 8 }).items;
  cont.innerHTML = items.map(p => cardHTML(p, { compacta: true })).join('');
}

function renderMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const items = Tienda().consultar({ orden: 'destacados', limite: 7 }).items;
  const total = Tienda().contar({});
  cont.innerHTML = items.map((p, i) => (i === 0
    ? `<div class="mos-grande">${cardHTML(p, { compacta: true, grande: true })}</div>`
    : cardHTML(p, { compacta: true }))).join('')
    + `<a class="mos-cta" href="${urlCat()}" data-animate="subir" style="opacity:0;transform:translateY(48px)"><strong>${total}</strong><span>${TIENDA === 'celulares' ? 'celulares y accesorios de carga en el catálogo' : 'anillos, aros y pulseras en el catálogo'}</span><span class="link-mas">Ver todo el catálogo${ICON.flecha}</span></a>`;
}

function renderPromo() {
  document.querySelectorAll('[data-promo-lista]').forEach(ul => {
    const items = Tienda().consultar({ filtros: { promo: true }, orden: 'descuento', limite: 3 }).items;
    ul.innerHTML = items.map(p => `<li><a href="${urlProducto(p)}" data-qv="${p.id}"><strong>${esc(p.nombre)}</strong><span><s>${formatearPrecio(p.precio)}</s>${formatearPrecio(precioFinal(p))}</span></a></li>`).join('');
  });
}

let tickerTimer = 0;
function renderTicker() {
  const vp = document.querySelector('[data-ticker-vp]');
  const dots = document.querySelector('[data-ticker-dots]');
  if (!vp || !dots) return;
  window.clearInterval(tickerTimer);
  const promos = Tienda().consultar({ filtros: { promo: true }, orden: 'descuento', limite: 2 }).items;
  const msgs = promos.map(p => ({ txt: `${p.nombre}: ${p.descuento}% off, ahora ${formatearPrecio(precioFinal(p))}`, href: urlProducto(p), qv: p.id }));
  msgs.push({ txt: tienda().ticker, href: TIENDA === 'celulares' ? wspHref(tienda().wsp.hero) : urlCat(), externo: TIENDA === 'celulares' });
  vp.innerHTML = msgs.map((m, i) => `<p class="ticker__msg${i === 0 ? ' activo' : ''}" aria-hidden="${i === 0 ? 'false' : 'true'}"><a href="${m.href}"${m.qv ? ` data-qv="${m.qv}"` : ''}${m.externo ? ' target="_blank" rel="noopener"' : ''}${i === 0 ? '' : ' tabindex="-1"'}>${esc(m.txt)}</a></p>`).join('');
  dots.innerHTML = msgs.map((m, i) => `<button type="button" aria-label="Ver promoción ${i + 1} de ${msgs.length}"${i === 0 ? ' aria-current="true"' : ''} data-ticker-ir="${i}"></button>`).join('');
  let actual = 0;
  const ir = n => {
    const lista = vp.querySelectorAll('.ticker__msg');
    const botones = dots.querySelectorAll('button');
    if (!lista.length) return;
    const prev = lista[actual];
    actual = (n + lista.length) % lista.length;
    lista.forEach((el, i) => {
      el.classList.toggle('activo', i === actual);
      el.classList.toggle('sale', el === prev && i !== actual);
      el.setAttribute('aria-hidden', i === actual ? 'false' : 'true');
      el.querySelector('a')?.setAttribute('tabindex', i === actual ? '0' : '-1');
    });
    setTimeout(() => prev?.classList.remove('sale'), 700);
    botones.forEach((b, i) => { if (i === actual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  dots.onclick = e => {
    const b = e.target.closest('[data-ticker-ir]');
    if (!b) return;
    ir(Number(b.dataset.tickerIr));
    window.clearInterval(tickerTimer);
    if (!reduceMotion) tickerTimer = window.setInterval(() => ir(actual + 1), 4500);
  };
  if (!reduceMotion) tickerTimer = window.setInterval(() => ir(actual + 1), 4500);
}

function initRail() {
  const vp = document.querySelector('[data-rail-vp]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const actualizar = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => {
    const item = track.querySelector('.rail-item');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return item ? (item.getBoundingClientRect().width + gap) * Math.max(1, Math.floor(vp.clientWidth / (item.getBoundingClientRect().width + gap)) - 1) : vp.clientWidth * 0.8;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  document.addEventListener('rail:pintado', () => requestAnimationFrame(actualizar));

  let pointerId = null, startX = 0, startLeft = 0, moved = false, activo = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!activo || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { e.preventDefault(); vp.scrollLeft = startLeft - dx; }
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (moved) {
      vp.classList.remove('dragging');
      const kill = ev => { ev.preventDefault(); ev.stopPropagation(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
      const item = track.querySelector('.rail-item');
      if (item) {
        const w = item.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16);
        const destino = Math.round(vp.scrollLeft / w) * w;
        vp.scrollTo({ left: Math.min(destino, vp.scrollWidth - vp.clientWidth), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', () => { if (activo) end(); });
  actualizar();
}

let qvOpener = null;
let qvEstado = { id: null, op: '', qty: 1, foto: 0 };
function renderQV() {
  const p = getProducto(qvEstado.id);
  const cuerpo = document.querySelector('[data-qv-cuerpo]');
  if (!p || !cuerpo) return;
  const fotos = [p.img, ...(p.galeria || [])];
  const specs = Object.entries(p.specs || {});
  const rel = Tienda().consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const varHTML = conVar(p)
    ? `<div><p class="qv__op-tit" data-op-tit>${esc(p.var.tipo)}: <span>${qvEstado.op ? esc(qvEstado.op) : 'elegí una opción'}</span></p><div class="qv__ops" role="group" aria-label="${esc(p.var.tipo)}">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${qvEstado.op === o}">${esc(o)}</button>`).join('')}</div></div>`
    : '';
  const msg = `${tienda().wsp.saludo}, quiero consultar por: ${p.nombre}${qvEstado.op ? ` (${p.var.tipo.toLowerCase()} ${qvEstado.op})` : ''}.`;
  cuerpo.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria"><div class="qv__foto"><img src="${fotos[qvEstado.foto] || p.img}" alt="${esc(p.alt)}" width="720" height="900"></div>${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, i) => `<button type="button" class="qv__mini" data-qv-foto="${i}" aria-pressed="${i === qvEstado.foto}" aria-label="Ver foto ${i + 1}"><img src="${f}" alt="" width="112" height="112"></button>`).join('')}</div>` : ''}</div>
    <div class="qv__info">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h2>${esc(p.nombre)}</h2>
      ${badgesHTML(p).replace('prod__badges', 'prod__badges prod__badges--qv')}
      ${precioHTML(p)}
      <p class="qv__desc">${esc(p.desc)}</p>
      ${specs.length ? `<dl class="qv__specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${varHTML}
      <div class="qv__acciones">${stepperHTML(p.stock, qvEstado.qty)}<button type="button" class="prod-add" data-qv-add><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="btn btn--ghost qv__comprar" data-qv-comprar>Comprar ahora</button>
      <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
    </div>
  </div>
  ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><div class="qv__rel-lista">${rel.map(r => `<button type="button" class="rel" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="112" height="140"><span><strong>${esc(r.nombre)}</strong><span>${formatearPrecio(precioFinal(r))}</span></span></button>`).join('')}</div></div>` : ''}`;
}

function abrirQV(id, opener) {
  const p = getProducto(id);
  if (!p) return;
  const dueña = tiendaDe(id);
  if (dueña && dueña !== TIENDA) aplicarTienda(dueña);
  const modal = document.getElementById('qv');
  if (!modal) return;
  qvOpener = opener || document.activeElement;
  qvEstado = { id, op: '', qty: 1, foto: 0 };
  renderQV();
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => modal.classList.add('abierto'));
  modal.querySelector('.qv__panel')?.focus();
  if (PAGINA === 'catalogo') {
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    window.history.replaceState(null, '', url);
  }
}
function cerrarQV() {
  const modal = document.getElementById('qv');
  if (!modal || modal.hidden) return;
  modal.classList.remove('abierto');
  setTimeout(() => {
    modal.hidden = true;
    if (!document.getElementById('carrito')?.classList.contains('abierto') && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  }, 300);
  if (PAGINA === 'catalogo') {
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
  }
  qvOpener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('qv');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-close]')) { cerrarQV(); return; }
    const op = e.target.closest('[data-qv-op]');
    if (op) { qvEstado.op = op.dataset.qvOp; renderQV(); modal.querySelector(`[data-qv-op="${window.CSS.escape(qvEstado.op)}"]`)?.focus(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { qvEstado.foto = Number(foto.dataset.qvFoto); renderQV(); modal.querySelector(`[data-qv-foto="${qvEstado.foto}"]`)?.focus(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { qvEstado = { id: rel.dataset.qvRel, op: '', qty: 1, foto: 0 }; renderQV(); modal.querySelector('.qv__panel')?.scrollTo({ top: 0 }); modal.querySelector('.qv__panel')?.focus(); return; }
    const st = e.target.closest('[data-stepper] button');
    if (st) {
      const p = getProducto(qvEstado.id);
      qvEstado.qty = Math.max(1, Math.min(p?.stock ?? 99, qvEstado.qty + (st.hasAttribute('data-mas') ? 1 : -1)));
      const s = st.closest('[data-stepper]');
      s.querySelector('output').textContent = qvEstado.qty;
      s.querySelector('[data-menos]').disabled = qvEstado.qty <= 1;
      s.querySelector('[data-mas]').disabled = qvEstado.qty >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add) {
      const p = getProducto(qvEstado.id);
      if (!p) return;
      if (conVar(p) && !qvEstado.op) {
        modal.querySelector('[data-op-tit]')?.classList.add('error');
        showToast(`Elegí ${p.var.tipo.toLowerCase()} antes de sumarlo`);
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      Cart.add(p, qvEstado.qty, qvEstado.op);
      if (add.hasAttribute('data-qv-comprar')) { cerrarQV(); setTimeout(abrirCarrito, 320); }
      else showToast(`Sumaste ${p.nombre} al carrito`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal.querySelector('.qv__panel'), e);
  });
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op ? `<p class="linea__op">${esc(p.var?.tipo || 'Opción')}: ${esc(i.op)}</p>` : '';
  return `<div class="linea" style="animation-delay:${Math.min(k * 0.05, 0.3)}s">
    <div class="linea__foto"><img src="${p.img}" alt="" width="144" height="180"></div>
    <div><p class="linea__nombre">${esc(p.nombre)}</p>${op}<p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      <div class="stepper" data-linea="${esc(i.id)}" data-op="${esc(i.op || '')}"><button type="button" data-l-menos aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${i.qty}</output><button type="button" data-l-mas aria-label="Sumar uno"${i.qty >= (p.stock ?? 99) ? ' disabled' : ''}>${ICON.mas}</button></div></div>
    <button type="button" class="linea__quitar" data-quitar="${esc(i.id)}" data-op="${esc(i.op || '')}" aria-label="Quitar ${esc(p.nombre)}">${ICON.quitar}</button>
  </div>`;
}
function renderCarrito() {
  const cuerpo = document.querySelector('[data-cart-lineas]');
  const pie = document.querySelector('[data-cart-pie]');
  if (!cuerpo || !pie) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cuerpo.innerHTML = `<div class="carrito-vacio">${ICON.bolsa}<h3>Tu carrito está vacío</h3><p>${esc(tienda().t.vacio)}</p><a class="btn btn--cta btn--sm" href="${urlCat()}">Volver al catálogo</a></div>`;
    pie.hidden = true;
    return;
  }
  cuerpo.innerHTML = items.map(lineaHTML).join('');
  pie.hidden = false;
  pie.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const lineas = items.map(i => { const p = getProducto(i.id); return `• ${i.qty} × ${p.nombre}${i.op ? ` (${p.var?.tipo.toLowerCase()} ${i.op})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`; });
  const msg = `${tienda().wsp.saludo}, quiero consultar por este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
  const a = pie.querySelector('[data-wsp-pedido]');
  if (a) a.href = wspHref(msg);
}
let carritoOpener = null;
function abrirCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  window.cerrarNav?.();
  carritoOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => d.classList.add('abierto'));
  d.querySelector('.drawer__panel')?.focus();
}
function cerrarCarrito() {
  const d = document.getElementById('carrito');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  setTimeout(() => { d.hidden = true; if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll'); }, 400);
  carritoOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', abrirCarrito));
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cart-close]')) { cerrarCarrito(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar, q.dataset.op || ''); return; }
    const b = e.target.closest('[data-l-menos], [data-l-mas]');
    if (b) {
      const s = b.closest('[data-linea]');
      const it = Cart.get().find(i => i.id === s.dataset.linea && (i.op || '') === (s.dataset.op || ''));
      if (it) Cart.setQty(it.id, it.op || '', it.qty + (b.hasAttribute('data-l-mas') ? 1 : -1));
      return;
    }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarCarrito();
    atraparFoco(d.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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
  window.syncFloats = sync;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv], [data-qv-abrir]');
    if (qv && !e.target.closest('#qv')) {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      abrirQV(qv.dataset.qv || qv.dataset.qvAbrir, qv);
      return;
    }
    const st = e.target.closest('.prod [data-stepper] button');
    if (st) {
      const s = st.closest('[data-stepper]');
      const max = Number(s.dataset.max) || 99;
      const out = s.querySelector('output');
      const v = Math.max(1, Math.min(max, Number(out.textContent) + (st.hasAttribute('data-mas') ? 1 : -1)));
      out.textContent = v;
      s.querySelector('[data-menos]').disabled = v <= 1;
      s.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('.prod [data-add], .prod [data-comprar]');
    if (add) {
      const id = add.dataset.add || add.dataset.comprar;
      const p = getProducto(id);
      if (!p) return;
      const card = add.closest('.prod');
      let op = '';
      if (conVar(p)) {
        const sel = card.querySelector('[data-op]');
        op = sel?.value || '';
        if (!op) {
          if (!sel || !sel.offsetParent) { abrirQV(id, add); return; }
          sel.closest('.var-sel')?.classList.add('error');
          sel.focus();
          showToast(`Elegí ${p.var.tipo.toLowerCase()} antes de sumarlo`);
          return;
        }
      }
      const qty = Number(card.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      if (add.hasAttribute('data-comprar')) abrirCarrito();
      else showToast(`Sumaste ${p.nombre} al carrito`);
      return;
    }
    const ir = e.target.closest('[data-ir-tienda]');
    if (ir) { cambiarTienda(TIENDA === 'celulares' ? 'accesorios' : 'celulares'); return; }
    const tb = e.target.closest('[data-tienda-btn]');
    if (tb) {
      e.preventDefault();
      cambiarTienda(tb.dataset.tiendaBtn);
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('.var-sel select');
    if (sel) sel.closest('.var-sel').classList.remove('error');
  });
}

function aplicarTienda(id) {
  TIENDA = id;
  document.body.dataset.tienda = id;
  try { window.sessionStorage.setItem(TIENDA_KEY, id); } catch (e) { void e; }
  const url = new URL(location.href);
  if (PAGINA === 'catalogo') {
    ['cat', 'sub', 'q', 'promo', 'precio', 'producto', 'memoria', 'color', 'tono', 'detalle'].forEach(k => url.searchParams.delete(k));
  }
  url.searchParams.set('tienda', id);
  window.history.replaceState(null, '', url);
  aplicarTextos();
  if (PAGINA === 'home') renderHome(true);
  else Catalogo.reiniciar();
  updateCartBadge();
  window.syncFloats?.();
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

let cambiando = false;
async function cambiarTienda(id) {
  if (!TIENDAS[id] || id === TIENDA || cambiando) return;
  cambiando = true;
  window.cerrarNav?.();
  window.cerrarCatsMenu?.();
  const sync = document.querySelector('.sync');
  const panel = sync?.querySelector('.sync__panel');
  const linea = sync?.querySelector('.sync__linea');
  if (reduceMotion || !panel || !panel.animate) {
    aplicarTienda(id);
    window.scrollTo(0, 0);
    cambiando = false;
    return;
  }
  const t = TIENDAS[id];
  sync.style.setProperty('--sync-color', t.sync.color);
  sync.style.setProperty('--sync-luz', t.sync.luz);
  const marca = sync.querySelector('.sync__marca');
  const original = document.querySelector(`.brand .wordmark--${id === 'celulares' ? 'cel' : 'acc'}`);
  if (marca && original) {
    const copia = original.cloneNode(true);
    copia.removeAttribute('data-solo');
    marca.replaceChildren(copia);
    marca.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
  }
  sync.classList.add('activo');
  const W = window.innerWidth + 20;
  const curva = 'cubic-bezier(0.65, 0, 0.35, 1)';
  try {
    const a = panel.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 560, easing: curva, fill: 'forwards' });
    linea.animate([{ transform: 'translateX(-10px)' }, { transform: `translateX(${W}px)` }], { duration: 560, easing: curva, fill: 'forwards' });
    await a.finished;
    aplicarTienda(id);
    window.scrollTo(0, 0);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const b = panel.animate([{ clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 640, easing: curva, fill: 'forwards' });
    linea.animate([{ transform: 'translateX(-10px)' }, { transform: `translateX(${W}px)` }], { duration: 640, easing: curva, fill: 'forwards' });
    if (PAGINA === 'home') setTimeout(initHeroMotion, 120);
    await b.finished;
  } catch {
    if (TIENDA !== id) aplicarTienda(id);
  }
  panel.getAnimations().forEach(x => x.cancel());
  linea.getAnimations().forEach(x => x.cancel());
  sync.querySelector('.sync__marca')?.getAnimations().forEach(x => x.cancel());
  sync.classList.remove('activo');
  cambiando = false;
}

function renderHome(cambio = false) {
  renderTiles();
  renderColecciones();
  renderRail();
  renderGridHome();
  renderMosaico();
  renderPromo();
  renderTicker();
  if (cambio) {
    ['[data-tiles]', '[data-colecciones]', '[data-rail-track]', '[data-grid-home]', '[data-mosaico]'].forEach(s => observarNuevos(document.querySelector(s)));
  }
}

const Catalogo = (() => {
  const $ = s => document.querySelector(s);
  let estado = null;
  let cursor = null;
  let mostrados = 0;
  const ATTRS = () => tienda().filtros.map(f => f.clave).filter(k => !['cat', 'sub', 'precio'].includes(k));

  function vacio() {
    return { cat: [], sub: [], precio: [], attrs: {}, promo: false, q: '', orden: 'destacados' };
  }
  function validar(e) {
    const t = tienda();
    const cats = t.categorias.map(c => c.id);
    const subs = t.categorias.flatMap(c => c.subs.map(s => s.id));
    e.cat = e.cat.filter(v => cats.includes(v));
    e.sub = e.sub.filter(v => subs.includes(v));
    e.precio = e.precio.filter(v => t.precios.some(r => r.id === v));
    Object.keys(e.attrs).forEach(k => {
      const g = t.filtros.find(f => f.clave === k);
      if (!g) { delete e.attrs[k]; return; }
      e.attrs[k] = e.attrs[k].filter(v => g.ops.some(o => o.id === v));
    });
    if (!['destacados', 'nuevos', 'precio-asc', 'precio-desc', 'nombre'].includes(e.orden)) e.orden = 'destacados';
    return e;
  }
  function desdeParams(params) {
    const e = vacio();
    const lista = k => (params.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
    e.cat = lista('cat'); e.sub = lista('sub'); e.precio = lista('precio');
    ATTRS().forEach(k => { const v = lista(k); if (v.length) e.attrs[k] = v; });
    e.promo = params.get('promo') === '1';
    e.q = (params.get('q') || '').slice(0, 60);
    e.orden = params.get('orden') || 'destacados';
    return validar(e);
  }
  function filtros() {
    return { cat: estado.cat, sub: estado.sub, precio: estado.precio, attrs: estado.attrs, promo: estado.promo, q: estado.q };
  }
  function syncURL() {
    const url = new URL(location.href);
    const prod = url.searchParams.get('producto');
    const q = new URLSearchParams({ tienda: TIENDA });
    if (estado.cat.length) q.set('cat', estado.cat.join(','));
    if (estado.sub.length) q.set('sub', estado.sub.join(','));
    Object.entries(estado.attrs).forEach(([k, v]) => { if (v.length) q.set(k, v.join(',')); });
    if (estado.precio.length) q.set('precio', estado.precio.join(','));
    if (estado.promo) q.set('promo', '1');
    if (estado.q) q.set('q', estado.q);
    if (estado.orden !== 'destacados') q.set('orden', estado.orden);
    if (prod) q.set('producto', prod);
    window.history.replaceState(null, '', `${url.pathname}?${q.toString()}`);
  }
  function opsDe(g) {
    const t = tienda();
    if (g.clave === 'cat') return t.categorias.map(c => ({ id: c.id, nombre: c.nombre }));
    if (g.clave === 'sub') {
      const cats = estado.cat.length ? t.categorias.filter(c => estado.cat.includes(c.id)) : t.categorias;
      return cats.flatMap(c => c.subs.map(s => ({ id: s.id, nombre: s.nombre })));
    }
    if (g.clave === 'precio') return t.precios.map(r => ({ id: r.id, nombre: r.nombre }));
    return g.ops;
  }
  function marcado(clave, id) {
    if (['cat', 'sub', 'precio'].includes(clave)) return estado[clave].includes(id);
    return (estado.attrs[clave] || []).includes(id);
  }
  function pintarFiltros() {
    const form = $('[data-filtros-form]');
    if (!form) return;
    const grupos = tienda().filtros;
    const fac = Tienda().facetas(filtros(), [...grupos.map(g => g.clave), 'promo']);
    const html = grupos.map(g => {
      const ops = opsDe(g);
      if (!ops.length) return '';
      return `<div class="f-grupo"><fieldset><legend>${esc(g.tit)}</legend>${ops.map(o => {
        const n = fac[g.clave]?.[o.id] || 0;
        const on = marcado(g.clave, o.id);
        return `<label class="f-op${!n && !on ? ' vacio' : ''}"><input type="checkbox" data-f="${g.clave}" value="${esc(o.id)}"${on ? ' checked' : ''}><span>${esc(o.nombre)}</span><small>${n}</small></label>`;
      }).join('')}</fieldset></div>`;
    }).join('');
    const np = fac.promo?.si || 0;
    form.innerHTML = html + `<div class="f-grupo"><fieldset><legend>Promociones</legend><label class="f-op${!np && !estado.promo ? ' vacio' : ''}"><input type="checkbox" data-f="promo" value="1"${estado.promo ? ' checked' : ''}><span>Solo con descuento</span><small>${np}</small></label></fieldset></div>`;
  }
  function chips() {
    const t = tienda();
    const out = [];
    estado.cat.forEach(v => out.push({ k: 'cat', v, txt: t.categorias.find(c => c.id === v)?.nombre || v }));
    estado.sub.forEach(v => out.push({ k: 'sub', v, txt: t.categorias.flatMap(c => c.subs).find(s => s.id === v)?.nombre || v }));
    Object.entries(estado.attrs).forEach(([k, vals]) => vals.forEach(v => out.push({ k, v, txt: nombreOp(k, v) })));
    estado.precio.forEach(v => out.push({ k: 'precio', v, txt: t.precios.find(r => r.id === v)?.nombre || v }));
    if (estado.promo) out.push({ k: 'promo', v: '1', txt: 'Con descuento' });
    if (estado.q) out.push({ k: 'q', v: estado.q, txt: `“${estado.q}”` });
    return out;
  }
  function pintarCabecera(total) {
    const t = tienda();
    const h1 = $('[data-cat-h1]');
    const lead = $('[data-cat-lead]');
    const miga = $('[data-miga-cat]');
    let titulo = t.t.catH1;
    let txtMiga = '';
    if (estado.cat.length === 1 && !estado.sub.length) { titulo = t.categorias.find(c => c.id === estado.cat[0])?.nombre || titulo; txtMiga = titulo; }
    if (estado.sub.length === 1) { titulo = t.categorias.flatMap(c => c.subs).find(s => s.id === estado.sub[0])?.nombre || titulo; txtMiga = titulo; }
    if (estado.promo && !estado.cat.length && !estado.sub.length) { titulo = 'Promociones'; txtMiga = 'Promociones'; }
    if (h1) h1.textContent = titulo;
    if (lead) lead.textContent = t.t.catLead;
    if (miga) { miga.hidden = !txtMiga; miga.querySelector('[data-miga-cat-txt]').textContent = txtMiga; }
    const c = $('[data-contador]');
    if (c) c.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}`;
    const activos = chips();
    const cont = $('[data-activos]');
    if (cont) cont.innerHTML = activos.map(a => `<button type="button" class="activo" data-quitar-f="${a.k}" data-v="${esc(a.v)}" aria-label="Quitar filtro ${esc(a.txt)}">${esc(a.txt)}${ICON.cerrar}</button>`).join('');
    document.querySelectorAll('[data-limpiar]').forEach(b => { if (b.classList.contains('f-limpiar')) b.hidden = !activos.length; });
    const n = $('[data-filtros-n]');
    if (n) { n.textContent = activos.length; n.hidden = !activos.length; }
    const q = $('[data-cat-q]');
    if (q && document.activeElement !== q) q.value = estado.q;
    const orden = $('[data-orden]');
    if (orden) orden.value = estado.orden;
  }
  function pintar(reiniciar) {
    const grid = $('[data-cat-grid]');
    if (!grid) return;
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda().consultar({ filtros: filtros(), orden: estado.orden, cursor, limite: POR_PAGINA });
    const total = Tienda().contar(filtros());
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    $('[data-vacio]').hidden = total > 0;
    grid.hidden = total === 0;
    const mas = $('[data-cat-mas]');
    if (mas) {
      mas.hidden = !cursor;
      const txt = mas.querySelector('[data-cat-mas-txt]');
      if (txt) txt.textContent = `Viendo ${mostrados} de ${total}`;
    }
    pintarCabecera(total);
    if (revealsListos) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  function aplicar() {
    validar(estado);
    syncURL();
    pintarFiltros();
    pintar(true);
    pintarCatsMenu();
  }
  function desdeURL(url) {
    const params = url.searchParams;
    const t = params.get('tienda');
    if (t && TIENDAS[t] && t !== TIENDA) {
      TIENDA = t;
      document.body.dataset.tienda = t;
      try { window.sessionStorage.setItem(TIENDA_KEY, t); } catch (e) { void e; }
      aplicarTextos();
      updateCartBadge();
    }
    estado = desdeParams(params);
    aplicar();
    window.scrollTo({ top: 0 });
  }
  function reiniciar() {
    estado = vacio();
    aplicar();
  }
  function init() {
    if (PAGINA !== 'catalogo') return;
    estado = desdeParams(new URLSearchParams(location.search));
    pintarFiltros();
    pintar(true);
    syncURL();
    const form = $('[data-filtros-form]');
    form?.addEventListener('change', e => {
      const i = e.target.closest('input[data-f]');
      if (!i) return;
      const k = i.dataset.f;
      if (k === 'promo') estado.promo = i.checked;
      else if (['cat', 'sub', 'precio'].includes(k)) {
        estado[k] = i.checked ? [...new Set([...estado[k], i.value])] : estado[k].filter(v => v !== i.value);
        if (k === 'cat') {
          const subsValidas = tienda().categorias.filter(c => !estado.cat.length || estado.cat.includes(c.id)).flatMap(c => c.subs.map(s => s.id));
          estado.sub = estado.sub.filter(s => subsValidas.includes(s));
        }
      } else {
        const actual = estado.attrs[k] || [];
        estado.attrs[k] = i.checked ? [...new Set([...actual, i.value])] : actual.filter(v => v !== i.value);
        if (!estado.attrs[k].length) delete estado.attrs[k];
      }
      aplicar();
    });
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quitar-f]');
      if (q) {
        const k = q.dataset.quitarF, v = q.dataset.v;
        if (k === 'promo') estado.promo = false;
        else if (k === 'q') estado.q = '';
        else if (['cat', 'sub', 'precio'].includes(k)) estado[k] = estado[k].filter(x => x !== v);
        else { estado.attrs[k] = (estado.attrs[k] || []).filter(x => x !== v); if (!estado.attrs[k].length) delete estado.attrs[k]; }
        aplicar();
        return;
      }
      if (e.target.closest('[data-limpiar]')) { estado = vacio(); aplicar(); return; }
      if (e.target.closest('[data-ver-mas]')) pintar(false);
    });
    const q = $('[data-cat-q]');
    let tq = 0;
    q?.addEventListener('input', () => {
      clearTimeout(tq);
      tq = setTimeout(() => { estado.q = q.value.trim().slice(0, 60); aplicar(); }, 220);
    });
    q?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(tq); estado.q = q.value.trim().slice(0, 60); aplicar(); } });
    $('[data-orden]')?.addEventListener('change', e => { estado.orden = e.target.value; aplicar(); });
    document.querySelector('.buscador')?.addEventListener('submit', e => {
      e.preventDefault();
      const v = e.target.querySelector('input[name="q"]')?.value.trim() || '';
      estado.q = v.slice(0, 60);
      aplicar();
      e.target.querySelector('input[name="q"]').value = '';
      $('[data-cat-q]')?.focus();
    });
    initFiltrosDrawer();
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 300);
    const qInicial = new URLSearchParams(location.search).get('q');
    if (qInicial) $('[data-cat-q]')?.focus({ preventScroll: true });
  }
  function initFiltrosDrawer() {
    const panel = $('[data-filtros]');
    const abrir = $('[data-filtros-abrir]');
    const fondo = $('.filtros-fondo');
    if (!panel || !abrir) return;
    const cerrar = () => {
      panel.classList.remove('abierto'); fondo?.classList.remove('abierto');
      abrir.setAttribute('aria-expanded', 'false');
      if (MODELO === '1') document.body.classList.remove('no-scroll');
    };
    abrir.addEventListener('click', () => {
      if (MODELO === '2') {
        const on = !panel.classList.contains('abierto');
        panel.classList.toggle('abierto', on);
        abrir.setAttribute('aria-expanded', String(on));
        if (on) panel.querySelector('input')?.focus({ preventScroll: true });
        return;
      }
      panel.classList.add('abierto'); fondo?.classList.add('abierto');
      abrir.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      panel.querySelector('input, button')?.focus();
    });
    document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', () => { cerrar(); abrir.focus(); }));
    panel.addEventListener('keydown', e => {
      if (!panel.classList.contains('abierto') || MODELO === '2') return;
      if (e.key === 'Escape') { cerrar(); abrir.focus(); }
      atraparFoco(panel, e);
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', m => { if (m.matches) cerrar(); });
  }
  return { init, reiniciar, desdeURL };
})();

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

document.body.dataset.tienda = TIENDA;
try { window.sessionStorage.setItem(TIENDA_KEY, TIENDA); } catch (e) { void e; }
aplicarTextos();
if (PAGINA === 'home') renderHome();
Catalogo.init();
initReveals();
initNav();
initCatsMenu();
initRail();
initQV();
initCarrito();
initFloats();
initAcciones();
initEstado();
initHeroMotion();
initParallax();
initModelBarScroll();
updateCartBadge();
