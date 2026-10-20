'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ES_M2 = document.body.classList.contains('m2');
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = ES_M2 ? 'catalogo-2.html' : 'catalogo.html';
const WSP = '5493417203663';
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'perfumes', nombre: 'Perfumes importados', corto: 'Perfumes', img: 'images/p-ambar-nocturno.webp', bajada: 'Eau de parfum, eau de toilette, body splash y packs, ordenados por familia olfativa.' },
  { id: 'lenceria', nombre: 'Lencería', corto: 'Lencería', img: 'images/p-conjunto-encaje-nude.webp', bajada: 'Conjuntos, corpiños, bodies y camisones. Elegí tu talle en cada producto.' },
  { id: 'capilar', nombre: 'Cuidado capilar', corto: 'Capilares', img: 'images/p-serum-puntas.webp', bajada: 'Shampoo, acondicionador, máscaras y finalizadores para cada tipo de pelo.' },
  { id: 'aromas', nombre: 'Aromas para el hogar', corto: 'Aromatizantes', img: 'images/p-difusor-saphirus.webp', bajada: 'Textiles, difusores, home spray y sahumerios de Saphirus.' },
  { id: 'accesorios', nombre: 'Accesorios', corto: 'Accesorios', img: 'images/p-cepillo-bambu.webp', bajada: 'Cepillos, broches y lo necesario para llevar tus productos de viaje.' },
];

const TIPOS = {
  edp: 'Eau de parfum', edt: 'Eau de toilette', splash: 'Body splash', pack: 'Packs y preventas',
  conjuntos: 'Conjuntos', corpinos: 'Corpiños y bralettes', bodies: 'Bodies', bombachas: 'Bombachas', dormir: 'Camisones',
  limpieza: 'Shampoo y acondicionador', tratamiento: 'Tratamientos', finalizador: 'Finalizadores',
  textil: 'Aromatizantes textiles', difusor: 'Difusores', spray: 'Home spray', sahumerio: 'Sahumerios',
  cabello: 'Para el pelo', viaje: 'Para viajar',
};
const TIPOS_POR_CAT = { perfumes: ['edp', 'edt', 'splash', 'pack'], lenceria: ['conjuntos', 'corpinos', 'bodies', 'bombachas', 'dormir'], capilar: ['limpieza', 'tratamiento', 'finalizador'], aromas: ['textil', 'difusor', 'spray', 'sahumerio'], accesorios: ['cabello', 'viaje'] };
const PARA = { ella: 'Para ella', el: 'Para él', unisex: 'Unisex' };

const FAMILIAS = [
  { id: 'ambar', nombre: 'Ámbar y especias', corto: 'ámbar y especias', color: '#B98235', desc: 'Cálidos y envolventes: vainilla, ámbar, cuero y especias que se quedan en la piel.', ideal: 'noche, invierno y salidas', notas: 'ámbar, vainilla, cardamomo, oud' },
  { id: 'floral', nombre: 'Florales', corto: 'florales', color: '#C98E93', desc: 'De lo fresco a lo empolvado: rosa, jazmín, peonía y almizcle blanco.', ideal: 'todo el día y la primavera', notas: 'rosa, jazmín, peonía, almizcle' },
  { id: 'fresco', nombre: 'Frescos y acuáticos', corto: 'frescos', color: '#6F94B8', desc: 'Limpios y livianos, con notas marinas, verdes y un fondo suave.', ideal: 'el día, el verano y después de entrenar', notas: 'notas marinas, pomelo, té verde, higo' },
  { id: 'citrico', nombre: 'Cítricos', corto: 'cítricos', color: '#C9A43B', desc: 'Luminosos y alegres: mandarina, neroli y bergamota para arrancar el día.', ideal: 'mañanas, oficina y días de calor', notas: 'mandarina, neroli, bergamota' },
  { id: 'amaderado', nombre: 'Amaderados', corto: 'amaderados', color: '#7D6A55', desc: 'Secos y elegantes, con cedro, vetiver y un toque aromático.', ideal: 'oficina, noche y media estación', notas: 'cedro, vetiver, lavanda, pimienta' },
];

const AROMAS_TEXTIL = ['Naranja pimienta', 'Flores blancas', 'Coco vainilla', 'Lavanda', 'Bamboo'];
const AROMAS_DIFUSOR = ['Lavanda y romero', 'Flores blancas', 'Vainilla', 'Cítrico'];
const AROMAS_SAHUMERIO = ['Sándalo', 'Palo santo', 'Lavanda', 'Vainilla'];
const TALLES_CORPINO = ['85', '90', '95', '100'];
const TALLES_LETRA = ['S', 'M', 'L', 'XL'];

const PRODUCTOS = [
  { id: 'pack-preventa', nombre: 'Pack x3 preventa: Bleu de Chanel, Sauvage y Club de Nuit Iconic', cat: 'perfumes', tipo: 'pack', para: 'el', pres: '3 perfumes', precio: 179700, descuento: 0, transferencia: 10, preventa: true, stock: 10, alta: 0,
    incluye: [
      { nombre: 'Bleu de Chanel', ml: '100 ml', notas: 'Aromático, amaderado, elegante' },
      { nombre: 'Sauvage Dior', ml: '100 ml', notas: 'Fresco, especiado, intenso' },
      { nombre: 'Club de Nuit Iconic Blue', ml: '105 ml', notas: 'Cítrico, amaderado, moderno' },
    ],
    img: 'images/p-pack-preventa.webp', alt: 'Tres frascos de perfume sobre fondo oscuro: Bleu de Chanel, Sauvage de Dior y Club de Nuit Iconic Blue',
    desc: 'Pack de tres perfumes de lujo en preventa, edición limitada. Pagando por transferencia bancaria ahorrás 10 %. Envío en 7 a 10 días y garantía de 30 días.', tags: ['pack', 'preventa', 'chanel', 'bleu', 'dior', 'sauvage', 'club de nuit', 'iconic', 'armaf', 'masculino', 'regalo'] },
  { id: 'ambar-nocturno', nombre: 'Ámbar Nocturno', cat: 'perfumes', tipo: 'edp', para: 'unisex', familia: 'ambar', pres: '100 ml', precio: 79900, descuento: 0, stock: 8, rango: 1, alta: 12,
    notas: ['Cardamomo', 'Ámbar', 'Vainilla'], img: 'images/p-ambar-nocturno.webp', alt: 'Frasco rectangular de perfume color ámbar con tapa negra sobre un estante de piedra al sol',
    desc: 'Abre con cardamomo y se asienta en un ámbar con vainilla cálido y redondo. Dura toda la noche.', tags: ['ambar', 'vainilla', 'noche', 'invierno', 'dulce'] },
  { id: 'oud-tostado', nombre: 'Oud Tostado', cat: 'perfumes', tipo: 'edp', para: 'el', familia: 'ambar', pres: '100 ml', precio: 89900, descuento: 0, stock: 5, rango: 10, alta: 9,
    notas: ['Café', 'Oud', 'Haba tonka'], img: 'images/p-oud-tostado.webp', alt: 'Frasco alto de perfume ámbar con tapa esférica de vidrio marrón, sobre mármol',
    desc: 'Café tostado sobre una base de oud y haba tonka. Intenso, para quien busca un perfume que se note.', tags: ['oud', 'cafe', 'arabe', 'intenso', 'noche'] },
  { id: 'cuero-vainilla', nombre: 'Cuero & Vainilla', cat: 'perfumes', tipo: 'edp', para: 'unisex', familia: 'ambar', pres: '100 ml', precio: 92900, descuento: 0, stock: 0, alta: 14,
    notas: ['Azafrán', 'Cuero', 'Vainilla'], img: 'images/p-cuero-vainilla.webp', alt: 'Frasco esmerilado de perfume con tapa plateada y su tapa blanca al lado, sobre fondo marrón',
    desc: 'Azafrán y cuero suave, con un fondo de vainilla que lo vuelve cálido y cercano.', tags: ['cuero', 'vainilla', 'azafran', 'calido'] },
  { id: 'almizcle-blanco', nombre: 'Almizcle Blanco', cat: 'perfumes', tipo: 'edp', para: 'ella', familia: 'floral', pres: '100 ml', precio: 72900, descuento: 0, stock: 6, alta: 24,
    notas: ['Pera', 'Jazmín', 'Almizcle blanco'], img: 'images/p-almizcle-blanco.webp', alt: 'Frasco de perfume de vidrio acanalado con tapa facetada, sobre mármol claro',
    desc: 'Pera jugosa y jazmín sobre un almizcle blanco limpio, como ropa recién lavada.', tags: ['almizcle', 'limpio', 'jazmin', 'pera', 'dia'] },
  { id: 'rosa-empolvada', nombre: 'Rosa Empolvada', cat: 'perfumes', tipo: 'edp', para: 'ella', familia: 'floral', pres: '100 ml', precio: 84900, descuento: 10, stock: 7, rango: 2, alta: 11,
    notas: ['Lichi', 'Rosa', 'Iris'], img: 'images/p-rosa-empolvada.webp', alt: 'Frasco redondo de perfume rosado con tapa de cristal facetado y aro dorado',
    desc: 'Una rosa suave con lichi y un fondo de iris empolvado. Femenino y elegante sin ser pesado.', tags: ['rosa', 'empolvado', 'iris', 'femenino', 'regalo'] },
  { id: 'peonia-lichi', nombre: 'Peonía & Lichi', cat: 'perfumes', tipo: 'edt', para: 'ella', familia: 'floral', pres: '50 ml', precio: 46900, descuento: 0, stock: 2, alta: 20,
    notas: ['Lichi', 'Peonía', 'Almizcle'], img: 'images/p-peonia-lichi.webp', alt: 'Frasco chico de perfume rosado con forma de gota sobre una base redonda plateada',
    desc: 'Floral frutal y luminoso. Liviano para el día, con una estela dulce que no cansa.', tags: ['peonia', 'lichi', 'frutal', 'liviano', 'dia'] },
  { id: 'durazno-jazmin', nombre: 'Durazno & Jazmín', cat: 'perfumes', tipo: 'edp', para: 'ella', familia: 'floral', pres: '100 ml', precio: 68900, descuento: 0, stock: 9, alta: 30,
    notas: ['Durazno', 'Jazmín', 'Sándalo'], img: 'images/p-durazno-jazmin.webp', alt: 'Frasco cuadrado de perfume rosa pálido con tapa rosada sobre papel claro',
    desc: 'Durazno maduro y jazmín sobre sándalo cremoso. Dulce, suave y muy fácil de usar.', tags: ['durazno', 'jazmin', 'sandalo', 'dulce'] },
  { id: 'brisa-marina', nombre: 'Brisa Marina', cat: 'perfumes', tipo: 'edt', para: 'unisex', familia: 'fresco', pres: '100 ml', precio: 64900, descuento: 0, stock: 10, alta: 27,
    notas: ['Pomelo', 'Notas marinas', 'Almizcle'], img: 'images/p-brisa-marina.webp', alt: 'Frasco redondo de perfume celeste con tapa de vidrio ovalada, sobre mármol',
    desc: 'Pomelo y notas marinas con un almizcle limpio. Fresco, para usar todos los días.', tags: ['marino', 'acuatico', 'pomelo', 'verano', 'fresco'] },
  { id: 'te-verde-higo', nombre: 'Té Verde & Higo', cat: 'perfumes', tipo: 'edt', para: 'unisex', familia: 'fresco', pres: '100 ml', precio: 61900, descuento: 0, stock: 6, alta: 29,
    notas: ['Té verde', 'Hoja de higo', 'Cedro'], img: 'images/p-te-verde-higo.webp', alt: 'Frasco de perfume verde agua apoyado sobre arena con sombras de sol',
    desc: 'Verde y jugoso: té verde, hoja de higo y un fondo de cedro claro.', tags: ['te verde', 'higo', 'verde', 'fresco', 'verano'] },
  { id: 'neroli-dorado', nombre: 'Neroli Dorado', cat: 'perfumes', tipo: 'edp', para: 'unisex', familia: 'citrico', pres: '50 ml', precio: 58900, descuento: 0, stock: 7, rango: 9, alta: 10,
    notas: ['Mandarina', 'Neroli', 'Almizcle'], img: 'images/p-neroli-dorado.webp', alt: 'Frasco alto y fino de perfume dorado con tapa plateada a la luz del sol',
    desc: 'Mandarina y flor de azahar sobre almizcle. Luminoso, ideal para la oficina.', tags: ['neroli', 'mandarina', 'azahar', 'citrico', 'oficina'] },
  { id: 'body-splash-mandarina', nombre: 'Body splash Mandarina & Eucalipto', cat: 'perfumes', tipo: 'splash', para: 'unisex', familia: 'citrico', pres: '250 ml', precio: 18900, descuento: 15, stock: 12, alta: 23,
    notas: ['Mandarina', 'Eucalipto', 'Algodón'], img: 'images/p-body-splash-algodon.webp', alt: 'Frasco esmerilado de body splash con atomizador junto a una rama de eucalipto',
    desc: 'Bruma corporal liviana para después de la ducha. Se puede aplicar varias veces al día.', tags: ['body splash', 'bruma', 'mandarina', 'eucalipto', 'corporal'] },
  { id: 'azul-profundo', nombre: 'Azul Profundo', cat: 'perfumes', tipo: 'edt', para: 'el', familia: 'amaderado', pres: '100 ml', precio: 76900, descuento: 0, stock: 9, rango: 8, alta: 8,
    notas: ['Bergamota', 'Lavanda', 'Cedro'], img: 'images/p-azul-profundo.webp', alt: 'Frasco rectangular de perfume azul marino con tapa negra sobre un escalón de piedra',
    desc: 'Bergamota y lavanda sobre cedro. Aromático y prolijo, para todos los días.', tags: ['lavanda', 'cedro', 'aromatico', 'masculino', 'oficina'] },
  { id: 'vetiver-dorado', nombre: 'Vetiver Dorado', cat: 'perfumes', tipo: 'edp', para: 'el', familia: 'amaderado', pres: '100 ml', precio: 86900, descuento: 0, stock: 4, alta: 28,
    notas: ['Pimienta rosa', 'Vetiver', 'Pachulí'], img: 'images/p-vetiver-dorado.webp', alt: 'Frasco de perfume con tapa dorada en forma de piña sobre una sábana blanca',
    desc: 'Pimienta rosa, vetiver y pachulí. Seco y con carácter, para la noche.', tags: ['vetiver', 'pachuli', 'pimienta', 'noche', 'masculino'] },
  { id: 'cedro-piedra', nombre: 'Cedro & Piedra', cat: 'perfumes', tipo: 'edt', para: 'el', familia: 'amaderado', pres: '100 ml', precio: 71900, descuento: 0, stock: 5, alta: 13,
    notas: ['Limón', 'Cedro', 'Ámbar gris'], img: 'images/p-cedro-piedra.webp', alt: 'Frasco de perfume de vidrio esmerilado apoyado sobre piedras apiladas y mármol gris',
    desc: 'Limón y cedro con un fondo mineral de ámbar gris. Limpio y masculino.', tags: ['cedro', 'mineral', 'limon', 'masculino'] },

  { id: 'conjunto-encaje-nude', nombre: 'Conjunto de encaje nude', cat: 'lenceria', tipo: 'conjuntos', pres: 'Corpiño y bombacha', precio: 32900, descuento: 0, stock: 8, rango: 5, alta: 21, talles: TALLES_CORPINO,
    img: 'images/p-conjunto-encaje-nude.webp', alt: 'Conjunto de corpiño y bombacha de encaje color nude apoyado sobre una mesa de madera',
    desc: 'Corpiño con aro y bombacha de encaje floral en tono nude. Breteles regulables y cierre de tres posiciones.', tags: ['conjunto', 'encaje', 'nude', 'corpino', 'bombacha', 'con aro', 'regalo'] },
  { id: 'corpino-encaje-azul', nombre: 'Corpiño de encaje azul', cat: 'lenceria', tipo: 'corpinos', pres: 'Con aro', precio: 21900, descuento: 0, stock: 6, alta: 18, talles: TALLES_CORPINO,
    img: 'images/p-corpino-encaje-azul.webp', alt: 'Corpiño de encaje azul colgado junto a un tulipán rosado',
    desc: 'Encaje azul francia con aro y copa sin relleno. Breteles regulables.', tags: ['corpino', 'encaje', 'azul', 'con aro'] },
  { id: 'push-up-bordo', nombre: 'Corpiño push-up de encaje bordó', cat: 'lenceria', tipo: 'corpinos', pres: 'Push-up', precio: 24900, descuento: 0, stock: 3, alta: 12, talles: ['85', '90', '95'],
    img: 'images/p-push-up-bordo.webp', alt: 'Corpiño push-up de encaje bordó apoyado sobre una sábana blanca',
    desc: 'Push-up con relleno suave y encaje bordó en las copas. Ideal para escotes.', tags: ['corpino', 'push up', 'encaje', 'bordo', 'rojo'] },
  { id: 'bralette-durazno', nombre: 'Bralette de tul durazno', cat: 'lenceria', tipo: 'corpinos', pres: 'Sin aro', precio: 17900, descuento: 0, stock: 9, alta: 24, talles: ['S', 'M', 'L'],
    img: 'images/p-bralette-durazno.webp', alt: 'Bralette de tul color durazno con volados colgado de una percha negra',
    desc: 'Bralette sin aro de tul liviano con volados. Cómodo para todo el día.', tags: ['bralette', 'tul', 'durazno', 'sin aro', 'comodo'] },
  { id: 'body-encaje-negro', nombre: 'Body de encaje negro', cat: 'lenceria', tipo: 'bodies', pres: 'Manga corta', precio: 29900, descuento: 0, stock: 4, alta: 20, talles: ['S', 'M', 'L'],
    img: 'images/p-body-encaje-negro.webp', alt: 'Body de encaje negro de manga corta colgado frente a una tela blanca',
    desc: 'Body de encaje negro con hombros caídos y broche abajo. Va como lencería o con un jean.', tags: ['body', 'encaje', 'negro', 'manga corta'] },
  { id: 'camison-saten', nombre: 'Camisón de satén con encaje', cat: 'lenceria', tipo: 'dormir', pres: 'Satén', precio: 34900, descuento: 0, stock: 6, alta: 33, talles: TALLES_LETRA,
    img: 'images/p-camison-saten.webp', alt: 'Camisón de satén negro con escote de encaje color champagne sobre una sábana gris',
    desc: 'Camisón de satén negro con encaje champagne en el escote y breteles finos.', tags: ['camison', 'saten', 'encaje', 'negro', 'dormir', 'regalo'] },
  { id: 'bombacha-lunares', nombre: 'Bombacha de algodón con lunares', cat: 'lenceria', tipo: 'bombachas', pres: 'Algodón', precio: 6900, descuento: 0, stock: 15, alta: 14, talles: TALLES_LETRA,
    img: 'images/p-bombacha-lunares.webp', alt: 'Bombacha blanca de algodón con lunares rojos sobre fondo rosa',
    desc: 'Algodón con lycra, blanca con lunares rojos y borde festoneado.', tags: ['bombacha', 'algodon', 'lunares', 'blanca'] },

  { id: 'mascara-keratina', nombre: 'Máscara nutritiva con keratina', cat: 'capilar', tipo: 'tratamiento', pres: '300 g', precio: 21900, descuento: 0, stock: 11, rango: 4, alta: 7,
    img: 'images/p-mascara-keratina.webp', alt: 'Pote de vidrio con máscara capilar blanca y un plato con crema sobre piedra clara',
    desc: 'Nutre y suaviza el pelo seco o con color. Dejala actuar 5 a 10 minutos y enjuagá.', tags: ['mascara', 'keratina', 'nutricion', 'pelo seco', 'tratamiento'] },
  { id: 'serum-puntas', nombre: 'Sérum reparador de puntas', cat: 'capilar', tipo: 'finalizador', pres: '30 ml', precio: 19900, descuento: 0, stock: 8, alta: 26,
    img: 'images/p-serum-puntas.webp', alt: 'Frasco gotero de vidrio ámbar con sérum capilar sobre una piedra',
    desc: 'Sella las puntas abiertas y da brillo sin engrasar. Unas gotas sobre el pelo húmedo o seco.', tags: ['serum', 'puntas', 'brillo', 'frizz', 'finalizador'] },
  { id: 'shampoo-sin-sulfatos', nombre: 'Shampoo sin sulfatos', cat: 'capilar', tipo: 'limpieza', pres: '500 ml', precio: 16900, descuento: 0, stock: 14, alta: 6,
    img: 'images/p-shampoo-sin-sulfatos.webp', alt: 'Frasco de shampoo oscuro con válvula dosificadora sobre fondo beige con ramas secas',
    desc: 'Limpia suave sin resecar. Apto para pelo con color, alisados y uso diario.', tags: ['shampoo', 'sin sulfatos', 'color', 'limpieza'] },
  { id: 'acondicionador-hidratante', nombre: 'Acondicionador hidratante', cat: 'capilar', tipo: 'limpieza', pres: '500 ml', precio: 16900, descuento: 0, stock: 13, alta: 5,
    img: 'images/p-acondicionador-hidratante.webp', alt: 'Frasco blanco de acondicionador con válvula sobre fondo color miel y su sombra',
    desc: 'Desenreda y deja el pelo suave. Se usa después del shampoo, de medios a puntas.', tags: ['acondicionador', 'hidratacion', 'desenredar', 'limpieza'] },
  { id: 'aceite-argan', nombre: 'Aceite de argán', cat: 'capilar', tipo: 'finalizador', pres: '50 ml', precio: 17900, descuento: 0, stock: 3, alta: 15,
    img: 'images/p-aceite-argan.webp', alt: 'Frasco chico de aceite capilar de vidrio ámbar entre flores secas sobre fondo durazno',
    desc: 'Controla el frizz y protege del calor de la planchita y el secador.', tags: ['aceite', 'argan', 'frizz', 'protector termico', 'brillo'] },

  { id: 'textil-saphirus', nombre: 'Aromatizante textil Saphirus', cat: 'aromas', tipo: 'textil', marca: 'Saphirus', pres: '250 ml', precio: 9900, descuento: 0, stock: 30, rango: 3, alta: 16, aromas: AROMAS_TEXTIL,
    img: 'images/p-textil-saphirus.webp', alt: 'Frasco transparente de aromatizante textil con atomizador blanco y etiqueta celeste',
    desc: 'Para sábanas, cortinas, almohadones y ropa. Rociá a 30 cm de la tela y dejá secar.', tags: ['saphirus', 'textil', 'sabanas', 'ropa', 'aromatizante'] },
  { id: 'difusor-saphirus', nombre: 'Difusor de varillas Saphirus', cat: 'aromas', tipo: 'difusor', marca: 'Saphirus', pres: '125 ml', precio: 14900, descuento: 0, stock: 18, rango: 6, alta: 17, aromas: AROMAS_DIFUSOR,
    img: 'images/p-difusor-saphirus.webp', alt: 'Difusor de vidrio con varillas de madera junto a un cuenco y un florero claro',
    desc: 'Perfuma un ambiente sin prender nada. Girá las varillas cada tanto para renovar el aroma.', tags: ['saphirus', 'difusor', 'varillas', 'ambiente', 'hogar'] },
  { id: 'home-spray-saphirus', nombre: 'Home spray Saphirus', cat: 'aromas', tipo: 'spray', marca: 'Saphirus', pres: '250 ml', precio: 9400, descuento: 0, stock: 15, alta: 22, aromas: AROMAS_DIFUSOR,
    img: 'images/p-home-spray-saphirus.webp', alt: 'Frasco de vidrio ámbar con atomizador sobre una bandeja de madera con plantas secas',
    desc: 'Un toque rápido de aroma en el living, el auto o antes de recibir visitas.', tags: ['saphirus', 'home spray', 'ambiente', 'auto', 'hogar'] },
  { id: 'sahumerios-saphirus', nombre: 'Sahumerios Saphirus', cat: 'aromas', tipo: 'sahumerio', marca: 'Saphirus', pres: 'Caja', precio: 3900, descuento: 0, stock: 40, alta: 4, aromas: AROMAS_SAHUMERIO,
    img: 'images/p-sahumerios-saphirus.webp', alt: 'Varillas de sahumerio encendidas con humo sobre fondo azul',
    desc: 'Varillas de combustión lenta para un momento de calma. Cada caja trae un solo aroma.', tags: ['saphirus', 'sahumerios', 'incienso', 'relax'] },

  { id: 'cepillo-bambu', nombre: 'Cepillo desenredante de bambú', cat: 'accesorios', tipo: 'cabello', pres: 'Unidad', precio: 12900, descuento: 0, stock: 9, alta: 25,
    img: 'images/p-cepillo-bambu.webp', alt: 'Cepillo de pelo de madera con cerdas de bambú y una flor blanca al lado',
    desc: 'Cerdas de bambú con punta redondeada que desenredan sin tironear. Apto pelo húmedo.', tags: ['cepillo', 'bambu', 'desenredar', 'madera'] },
  { id: 'broches-carey', nombre: 'Broches pinza carey x 2', cat: 'accesorios', tipo: 'cabello', pres: 'Pack x 2', precio: 8900, descuento: 0, stock: 10, alta: 21,
    img: 'images/p-broches-carey.webp', alt: 'Dos broches pinza para el pelo, uno color carey y otro estampado, sobre una manta blanca',
    desc: 'Dos pinzas de acetato para recoger el pelo en segundos: una grande y una chica.', tags: ['broche', 'pinza', 'carey', 'pelo', 'accesorio'] },
  { id: 'neceser-corderito', nombre: 'Neceser de corderito', cat: 'accesorios', tipo: 'viaje', pres: 'Unidad', precio: 15900, descuento: 0, stock: 6, alta: 19,
    img: 'images/p-neceser-corderito.webp', alt: 'Neceser de corderito color camel con cierre, apoyado sobre una cama con dos broches',
    desc: 'Neceser suave con cierre para llevar perfumes, cremas y accesorios en la cartera o de viaje.', tags: ['neceser', 'corderito', 'viaje', 'cartera'] },
  { id: 'frascos-viaje', nombre: 'Frascos de viaje x 2', cat: 'accesorios', tipo: 'viaje', pres: '100 ml c/u', precio: 6900, descuento: 0, stock: 20, alta: 18,
    img: 'images/p-frascos-viaje.webp', alt: 'Dos frascos plásticos blancos para viaje con tapa, sobre una tela de lino',
    desc: 'Para llevar tu shampoo y acondicionador en la valija o el bolso del gimnasio.', tags: ['frascos', 'viaje', 'valija', 'gimnasio'] },

  { id: 'borrador-perfume', nombre: 'Perfume en carga (borrador)', cat: 'perfumes', tipo: 'edp', para: 'unisex', familia: 'ambar', pres: '100 ml', precio: 1, descuento: 0, stock: 0, alta: 0, visible: false,
    notas: [], img: 'images/p-ambar-nocturno.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const famDe = id => FAMILIAS.find(f => f.id === id);
const precioTransferencia = p => Math.round(precioFinal(p) * (1 - (p.transferencia || 0) / 100));
const varDe = p => {
  if ((p.aromas || []).length) return { valores: p.aromas, titulo: 'Elegí el aroma', boton: 'Elegir aroma' };
  if ((p.talles || []).length) return { valores: p.talles, titulo: 'Elegí el talle', boton: 'Elegir talle', talle: true };
  return null;
};
const pideEleccion = p => (varDe(p)?.valores.length || 0) > 1;
const varTexto = (p, v) => (v && p.talles ? `Talle ${v}` : v || '');

const RANGOS_PRECIO = [
  { id: '0-15000', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15000-50000', nombre: '$15.000 a $50.000', min: 15000, max: 50000 },
  { id: '50000-80000', nombre: '$50.000 a $80.000', min: 50000, max: 80000 },
  { id: '80000-', nombre: 'Más de $80.000', min: 80000, max: null },
];

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.marca, catDe(p.cat)?.nombre, catDe(p.cat)?.corto, TIPOS[p.tipo], PARA[p.para], famDe(p.familia)?.nombre, p.pres,
      p.desc, ...(p.notas || []), ...(p.aromas || []), ...(p.talles || []).map(t => `talle ${t}`), ...(p.incluye || []).map(x => x.nombre), ...(p.tags || []), p.descuento > 0 ? 'oferta descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const palabrasDe = q => norm(q).split(/\s+/).filter(w => w.length > 1);
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), para = lista(f.para), familia = lista(f.familia), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (para.length && !(para.includes(p.para) || (p.para === 'unisex' && para.some(x => x !== 'unisex')))) return false;
    if (familia.length && !familia.includes(p.familia)) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    if (f.q && !coincideBusqueda(p, palabrasDe(f.q))) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (b.preventa ? 1 : 0) - (a.preventa ? 1 : 0) || (a.rango || 999) - (b.rango || 999) || (b.stock > 0) - (a.stock > 0) || b.alta - a.alta || desempate(a, b);
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

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = palabrasDe(q);
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
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  if (!agotado && items.length === limite && ultimo != null) {
    const resto = tienda.consultar({ filtros: { ...filtros, q }, orden, cursor: ultimo, limite: 1 });
    if (!resto.items.length) agotado = true;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'liamaura_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const max = producto.stock ?? 99;
    if (max <= 0) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtrados = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtrados);
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  filtros: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
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

function refrescarTriggers() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function metaDe(p) {
  if (p.preventa) return `Preventa · ${p.pres}`;
  if (p.cat === 'perfumes') return `${famDe(p.familia)?.nombre || TIPOS[p.tipo]} · ${p.pres}`;
  if (p.marca) return `${p.marca} · ${p.pres}`;
  return `${TIPOS[p.tipo]} · ${p.pres}`;
}

function badgeDe(p) {
  if (p.preventa) return '<span class="badge badge--oro">Edición limitada</span>';
  if (p.stock <= 0) return '<span class="badge badge--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="badge badge--off">-${p.descuento}%</span>`;
  if (p.stock <= 3) return '<span class="badge">Últimas unidades</span>';
  if (p.alta >= 25) return '<span class="badge badge--nuevo">Nuevo</span>';
  return '';
}

function precioHTML(p) {
  const fin = precioFinal(p);
  const base = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><strong class="off">${formatearPrecio(fin)}</strong>` : `<strong>${formatearPrecio(fin)}</strong>`;
  return p.transferencia ? `${base}<span class="prod-transf">${formatearPrecio(precioTransferencia(p))} por transferencia</span>` : base;
}

function cardHTML(p) {
  const sin = p.stock <= 0;
  const eleccion = pideEleccion(p);
  let acciones;
  if (sin) acciones = `<button class="btn btn--cta prod-add" type="button" disabled>Sin stock</button>`;
  else if (eleccion) acciones = `<button class="btn btn--cta prod-add" type="button" data-quick="${p.id}">${varDe(p).boton}</button>`;
  else acciones = `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div><button class="btn btn--cta prod-add prod-add--ico" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="txt">Agregar<span class="largo"> al carrito</span></span><svg class="ico-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></button>`;
  return `<article class="prod" data-id="${p.id}">
    <button class="prod-foto" type="button" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1250" decoding="async">${badgeDe(p)}</button>
    <div class="prod-info">
      <p class="prod-meta">${esc(metaDe(p))}</p>
      <h3 class="prod-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-precio">${precioHTML(p)}</p>
      <div class="prod-actions">${acciones}</div>
      ${!sin && !eleccion ? `<button class="prod-buy" type="button" data-buy="${p.id}">Comprar ahora</button>` : ''}
    </div>
  </article>`;
}

function liHTML(p, anim = 'subir') {
  const estilos = { subir: 'opacity:0;transform:translateY(40px)', der: 'opacity:0;transform:translateX(64px)' };
  return `<li data-animate="${anim}" style="${estilos[anim]}">${cardHTML(p)}</li>`;
}

function cantidadDe(btn) {
  const input = btn.closest('.prod, .qv-info')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function agregar(id, qty = 1, v = '', { abrir = false } = {}) {
  const p = getProducto(id);
  if (!p) return;
  if (pideEleccion(p) && !v) { abrirQuickView(id); return; }
  const sumados = Cart.add(p, qty, v);
  if (abrir) { closeQuickView(false); openCartDrawer(); return; }
  if (sumados > 0) showToast(`${p.nombre}${v ? ` (${varTexto(p, v)})` : ''} se sumó al carrito.`);
  else showToast(`Ya tenés en el carrito todo el stock de ${p.nombre}.`);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.closest('[data-stepper]')?.querySelector('input');
      if (input) {
        const max = parseInt(input.max, 10) || 99;
        input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, cantidadDe(add), add.dataset.v || ''); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) { agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '', { abrir: true }); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      if (quick.closest('.rail-vp')?.dataset.arrastrado === '1') return;
      abrirQuickView(quick.dataset.quick, quick);
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input || input.closest('.linea')) return;
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

let ultimoFoco = null;
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function renderCarrito() {
  const body = document.querySelector('[data-cart-items]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!body || !foot) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.bolsa}<h3>Tu carrito está vacío</h3><p>Todavía no elegiste tu fragancia. Arrancá por la tienda o la guía por familia.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(({ p, v, qty }) => `<div class="linea">
      <img src="${p.img}" alt="" width="76" height="95">
      <div>
        <div class="linea-top"><div><p class="linea-nombre">${esc(p.nombre)}</p><p class="linea-var">${esc([p.pres, varTexto(p, v), p.transferencia ? `${formatearPrecio(precioTransferencia(p))} c/u por transferencia` : ''].filter(Boolean).join(' · '))}</p></div>
          <button class="linea-quitar" type="button" data-quitar="${p.id}" data-v="${esc(v || '')}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></div>
        <div class="linea-bot">
          <div class="stepper" data-stepper><button type="button" data-linea-step="-1" data-id="${p.id}" data-v="${esc(v || '')}" aria-label="Restar uno">−</button><input type="number" value="${qty}" min="1" max="${p.stock}" aria-label="Cantidad" data-linea-input data-id="${p.id}" data-v="${esc(v || '')}"><button type="button" data-linea-step="1" data-id="${p.id}" data-v="${esc(v || '')}" aria-label="Sumar uno">+</button></div>
          <span class="linea-precio">${formatearPrecio(precioFinal(p) * qty)}</span>
        </div>
      </div>
    </div>`).join('');
  const resumen = items.map(({ p, v, qty }) => `• ${qty} × ${p.nombre}${v ? ` (${varTexto(p, v)})` : ''}`).join('\n');
  foot.innerHTML = `<div class="drawer-total"><span>Subtotal</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer-nota">El envío se calcula al finalizar la compra. ¿Dudas con algún producto? <a href="${wa(`Hola Liam Aura, quiero consultar por este pedido:\n${resumen}`)}" target="_blank" rel="noopener">Consultalo por WhatsApp</a>.</p>
    <button class="btn btn--cta" type="button" data-finalizar>Finalizar compra</button>
    <button class="btn btn--outline" type="button" data-close-cart>Seguir comprando</button>`;
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-backdrop]');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  renderCarrito();
  drawer.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
  drawer.querySelector('[data-close-cart]')?.focus();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.querySelector('[data-drawer-backdrop]');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) { drawer.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function initCarrito() {
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelector('[data-drawer-backdrop]')?.addEventListener('click', closeCartDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCartDrawer(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar, q.dataset.v || ''); return; }
    const s = e.target.closest('[data-linea-step]');
    if (s) {
      const it = Cart.get().find(i => i.id === s.dataset.id && (i.v || '') === (s.dataset.v || ''));
      if (it) Cart.setQty(s.dataset.id, s.dataset.v || '', it.qty + Number(s.dataset.lineaStep));
      return;
    }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('change', e => {
    const i = e.target.closest('[data-linea-input]');
    if (i) Cart.setQty(i.dataset.id, i.dataset.v || '', parseInt(i.value, 10) || 1);
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
    atraparFoco(drawer, e);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(); });
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

function relacionadosDe(p) {
  return Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, orden: 'destacados', limite: 3 }).items.map(cachear);
}

function qvHTML(p) {
  const sin = p.stock <= 0;
  const vari = varDe(p);
  const valores = vari?.valores || [];
  const v0 = valores.length === 1 ? valores[0] : vari && !vari.talle ? valores[0] : '';
  const stockTxt = sin ? 'Sin stock por ahora' : p.preventa ? 'Preventa · stock limitado' : p.stock <= 3 ? `Quedan ${p.stock} unidades` : 'En stock';
  const notas = (p.notas || []).length === 3 ? `<dl class="qv-notas"><div><dt>Salida</dt><dd>${esc(p.notas[0])}</dd></div><div><dt>Corazón</dt><dd>${esc(p.notas[1])}</dd></div><div><dt>Fondo</dt><dd>${esc(p.notas[2])}</dd></div></dl>` : '';
  const incluye = (p.incluye || []).length ? `<ul class="qv-incluye">${p.incluye.map(x => `<li><strong>${esc(x.nombre)}</strong><span>${esc(x.ml)} · ${esc(x.notas)}</span></li>`).join('')}</ul>` : '';
  const condiciones = p.preventa ? '<ul class="qv-condiciones"><li>Compra segura</li><li>Envío en 7 a 10 días</li><li>Garantía de 30 días</li></ul>' : '';
  const selVar = valores.length > 1 ? `<fieldset class="qv-aromas"><legend>${vari.titulo}</legend><div class="guia-opciones" role="radiogroup" aria-label="${vari.talle ? 'Talle' : 'Aroma'}">${valores.map(a => `<button type="button" class="chip${vari.talle ? ' chip--talle' : ''}" role="radio" aria-checked="${a === v0}" data-var="${esc(a)}">${esc(a)}</button>`).join('')}</div></fieldset>` : '';
  const rel = relacionadosDe(p);
  return `<div class="qv-grid">
      <div class="qv-foto"><img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1250">${badgeDe(p)}</div>
      <div class="qv-info">
        <p class="prod-meta">${esc(catDe(p.cat)?.nombre)} · ${esc(metaDe(p))}</p>
        <h2 id="qv-titulo">${esc(p.nombre)}</h2>
        <p class="prod-precio qv-precio">${precioHTML(p)}</p>
        <p class="qv-desc">${esc(p.desc)}</p>
        ${notas}
        ${incluye}
        ${p.para ? `<p class="qv-para">${esc(PARA[p.para])}${p.familia ? ` · familia ${esc(famDe(p.familia)?.corto)}` : ''}</p>` : ''}
        ${selVar}
        ${condiciones}
        <p class="qv-stock ${sin ? 'sin' : p.stock <= 3 ? 'poco' : ''}">${stockTxt}</p>
        <div class="qv-acciones-wrap">
          ${sin ? '' : `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>`}
        </div>
        <div class="qv-acciones">
          <button class="btn btn--cta" type="button" data-qv-add="${p.id}" data-v="${esc(v0)}" ${sin ? 'disabled' : ''}>${sin ? 'Sin stock' : 'Agregar al carrito'}</button>
          ${sin ? '' : `<button class="btn btn--outline" type="button" data-qv-buy="${p.id}" data-v="${esc(v0)}">Comprar ahora</button>`}
        </div>
        <a class="qv-wsp" href="${wa(`Hola Liam Aura, quiero consultar por ${p.nombre}${p.pres ? ` (${p.pres})` : ''}.`)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
      </div>
    </div>
    ${rel.length ? `<div class="qv-rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button class="mini" type="button" data-qv-ir="${r.id}"><img src="${r.img}" alt="${esc(r.alt)}" width="1000" height="1250"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}

function jsonLdProducto(p) {
  const prev = document.getElementById('ld-producto');
  prev?.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ld-producto';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: p.marca || 'Liam Aura' }, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${location.origin}${location.pathname}?producto=${p.id}` },
  });
  document.head.appendChild(s);
}

function abrirQuickView(id, origen) {
  const qv = document.getElementById('quickView');
  const p = getProducto(id);
  if (!qv || !p) return;
  if (qv.hidden) ultimoFoco = origen || document.activeElement;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  qv.querySelector('.qv-panel').scrollTop = 0;
  jsonLdProducto(p);
  if (qv.hidden) {
    qv.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  qv.querySelector('.qv-cerrar')?.focus();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', id);
    history.replaceState(null, '', u);
  }
}

function closeQuickView(devolverFoco = true) {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!qv.classList.contains('open')) qv.hidden = true; }, 320);
  document.getElementById('ld-producto')?.remove();
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    history.replaceState(null, '', u);
  }
  if (devolverFoco) ultimoFoco?.focus?.();
}

function initQuickView() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { closeQuickView(); return; }
    const opcion = e.target.closest('[data-var]');
    if (opcion) {
      opcion.parentElement.querySelectorAll('[data-var]').forEach(b => b.setAttribute('aria-checked', String(b === opcion)));
      qv.querySelectorAll('[data-qv-add], [data-qv-buy]').forEach(b => { b.dataset.v = opcion.dataset.var; });
      return;
    }
    const accion = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (accion) {
      const id = accion.dataset.qvAdd || accion.dataset.qvBuy;
      const p = getProducto(id);
      if (p && pideEleccion(p) && !accion.dataset.v) {
        showToast(`${varDe(p).titulo} antes de agregarlo.`);
        qv.querySelector('[data-var]')?.focus();
        return;
      }
      agregar(id, cantidadDe(accion), accion.dataset.v || '', { abrir: 'qvBuy' in accion.dataset });
      return;
    }
    const ir = e.target.closest('[data-qv-ir]');
    if (ir) abrirQuickView(ir.dataset.qvIr);
  }, true);
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuickView();
    atraparFoco(qv, e);
    const radio = e.target.closest('[data-var]');
    if (radio && ['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      const todos = [...radio.parentElement.querySelectorAll('[data-var]')];
      const sig = todos[(todos.indexOf(radio) + (e.key === 'ArrowRight' ? 1 : -1) + todos.length) % todos.length];
      sig.focus(); sig.click();
    }
  });
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
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats__btn');
  const panel = cont.querySelector('.nav-cats__panel');
  const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = CATEGORIAS.map(c => `<a class="nav-cats__item" href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="52" height="52"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} productos</small></span></a>`).join('')
    + `<a class="nav-cats__todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
  const desktop = window.matchMedia('(min-width: 1025px) and (hover: hover)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (desktop.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (window.matchMedia('(min-width: 1025px)').matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!cont.contains(e.target) && window.matchMedia('(min-width: 1025px)').matches) cerrar(); });
  cont.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); cerrar(); btn.focus(); } });
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-rule'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const zona = el.closest('section') || el;
    ScrollTrigger.create({
      trigger: zona, start: 'top top', end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${(self.progress * 6).toFixed(2)}%`; },
    });
  });
}

function initRailDrag(vp) {
  let pointerId = null, startX = 0, startLeft = 0, moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { void 0; }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { void 0; }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 0);
      const destino = vp.scrollLeft;
      vp.classList.remove('dragging');
      vp.scrollLeft = destino;
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  const track = document.querySelector('[data-rail-track]');
  if (!vp || !track) return [];
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p)}</li>`).join('');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 20;
  const sync = () => {
    const inicio = 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * (reduceMotion ? 1 : 1), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  return items.map(p => p.id);
}

function initPreview(excluir) {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const mosaico = cont.classList.contains('mosaico');
  const { items } = Tienda.consultar({ filtros: { excluir: [...excluir, 'pack-preventa'], stock: true }, orden: 'nuevos', limite: mosaico ? 4 : 8 });
  items.forEach(cachear);
  let html = items.map(p => liHTML(p)).join('');
  if (mosaico) {
    const total = Tienda.contar({});
    html += `<li class="mosaico-li-cta" data-animate="subir" style="opacity:0;transform:translateY(40px)"><div class="mosaico-cta"><strong>Hay ${total} productos en la tienda</strong><p>Perfumes, lencería, capilares, aromas Saphirus y accesorios, con buscador y filtros.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div></li>`;
  }
  cont.innerHTML = html;
}

function initGuia() {
  const sec = document.querySelector('[data-guia]');
  if (!sec) return;
  const famBox = sec.querySelector('[data-guia-familias]');
  const paraBox = sec.querySelector('[data-guia-para]');
  const res = sec.querySelector('[data-guia-res]');
  const estado = { familia: 'ambar', para: '' };
  famBox.innerHTML = FAMILIAS.map(f => `<button type="button" class="chip" style="--fam:${f.color}" aria-pressed="${f.id === estado.familia}" data-familia="${f.id}"><span class="punto" aria-hidden="true"></span>${esc(f.nombre)}</button>`).join('');
  const pintar = () => {
    const f = famDe(estado.familia);
    const filtros = { cat: 'perfumes', familia: f.id, ...(estado.para ? { para: estado.para } : {}) };
    const total = Tienda.contar(filtros);
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: 3 });
    items.forEach(cachear);
    const url = `${CATALOGO_URL}?cat=perfumes&familia=${f.id}${estado.para ? `&para=${estado.para}` : ''}`;
    const paraTxt = estado.para ? ` ${PARA[estado.para].toLowerCase()}` : '';
    res.innerHTML = `<div class="guia-fam">
        <h3>${esc(f.nombre)}</h3>
        <p>${esc(f.desc)}</p>
        <dl><div><dt>Notas típicas:</dt><dd>${esc(f.notas)}</dd></div><div><dt>Ideal para:</dt><dd>${esc(f.ideal)}</dd></div></dl>
      </div>
      ${items.length ? `<ul class="guia-cards">${items.map(p => liHTML(p)).join('')}</ul>
      <div class="guia-pie"><p>${total} ${total === 1 ? 'perfume' : 'perfumes'} ${esc(f.corto)}${esc(paraTxt)} en la tienda.</p><a class="link-arrow" href="${url}">Ver ${total === 1 ? 'el perfume' : `los ${total}`} en el catálogo ${ICON.flecha}</a></div>`
      : `<div class="guia-vacio"><p>Por ahora no tenemos perfumes ${esc(f.corto)}${esc(paraTxt)}. Mirá los de esta familia para todos o escribinos y te recomendamos uno parecido.</p><button class="btn btn--outline" type="button" data-guia-todos>Ver los ${esc(f.corto)} para todos</button></div>`}`;
    revelarNuevos(res);
    refrescarTriggers();
  };
  famBox.addEventListener('click', e => {
    const b = e.target.closest('[data-familia]');
    if (!b) return;
    estado.familia = b.dataset.familia;
    famBox.querySelectorAll('[data-familia]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar();
  });
  paraBox.addEventListener('click', e => {
    const b = e.target.closest('[data-para]');
    if (!b) return;
    estado.para = b.dataset.para;
    paraBox.querySelectorAll('[data-para]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar();
  });
  res.addEventListener('click', e => {
    if (!e.target.closest('[data-guia-todos]')) return;
    estado.para = '';
    paraBox.querySelectorAll('[data-para]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.para === '')));
    pintar();
  });
  pintar();
}

const POR_PAGINA = 16;
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros-form]');
  const panel = document.querySelector('[data-filtros]');
  const inputQ = document.getElementById('q');
  const selOrden = document.querySelector('[data-orden]');
  const verMas = document.querySelector('[data-ver-mas]');
  const masInfo = document.querySelector('[data-mas-info]');
  const vacio = document.querySelector('[data-empty]');
  const countEl = document.querySelector('[data-count]');
  const chips = document.querySelector('[data-chips]');
  const tabs = document.querySelector('[data-cat-tabs]');
  const h1 = document.querySelector('[data-cat-h1]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-miga]');

  const sp = new URLSearchParams(location.search);
  const validos = (clave, permitidos) => (sp.get(clave) || '').split(',').map(s => s.trim()).filter(v => permitidos.includes(v));
  const estado = {
    cat: validos('cat', CATEGORIAS.map(c => c.id)),
    tipo: validos('tipo', Object.keys(TIPOS)),
    para: validos('para', Object.keys(PARA)),
    familia: validos('familia', FAMILIAS.map(f => f.id)),
    precio: validos('precio', RANGOS_PRECIO.map(r => r.id))[0] || '',
    stock: sp.get('stock') === '1',
    ofertas: sp.get('ofertas') === '1',
    q: (sp.get('q') || '').slice(0, 60),
    orden: Object.keys(ORDENES).includes(sp.get('orden')) ? sp.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = (sinGrupo) => {
    const f = {};
    if (sinGrupo !== 'cat' && estado.cat.length) f.cat = estado.cat;
    if (sinGrupo !== 'tipo' && estado.tipo.length) f.tipo = estado.tipo;
    if (sinGrupo !== 'para' && estado.para.length) f.para = estado.para;
    if (sinGrupo !== 'familia' && estado.familia.length) f.familia = estado.familia;
    if (sinGrupo !== 'precio' && estado.precio) {
      const r = RANGOS_PRECIO.find(x => x.id === estado.precio);
      if (r) { f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    }
    if (sinGrupo !== 'stock' && estado.stock) f.stock = true;
    if (sinGrupo !== 'ofertas' && estado.ofertas) f.ofertas = true;
    return f;
  };
  const conTexto = f => (estado.q ? { ...f, q: estado.q } : f);

  const grupoHTML = (clave, titulo, opciones, tipo = 'checkbox') => {
    const base = filtrosDe(clave);
    const ops = opciones.map(o => {
      const extra = clave === 'precio' ? { precioMin: o.min, ...(o.max != null ? { precioMax: o.max } : {}) } : { [clave]: o.id };
      const n = Tienda.contar(conTexto({ ...base, ...extra }));
      const marcado = clave === 'precio' ? estado.precio === o.id : estado[clave].includes(o.id);
      return `<label class="f-op${n === 0 && !marcado ? ' vacio' : ''}"><input type="${tipo}" data-f="${clave}" value="${o.id}"${marcado ? ' checked' : ''}><span>${esc(o.nombre)}</span><small>${n}</small></label>`;
    }).join('');
    return `<fieldset class="f-grupo"><legend>${titulo}</legend>${ops}</fieldset>`;
  };

  const tiposVisibles = () => {
    const cats = estado.cat.length ? estado.cat : CATEGORIAS.map(c => c.id);
    return cats.flatMap(c => TIPOS_POR_CAT[c]).map(id => ({ id, nombre: TIPOS[id] }));
  };

  const pintarFiltros = () => {
    if (!form) return;
    const soloPerfumes = !estado.cat.length || estado.cat.includes('perfumes');
    form.innerHTML = [
      grupoHTML('cat', 'Categoría', CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre }))),
      grupoHTML('tipo', 'Tipo de producto', tiposVisibles()),
      soloPerfumes ? grupoHTML('familia', 'Familia olfativa', FAMILIAS.map(f => ({ id: f.id, nombre: f.nombre }))) : '',
      soloPerfumes ? grupoHTML('para', 'Para quién', Object.entries(PARA).map(([id, nombre]) => ({ id, nombre }))) : '',
      grupoHTML('precio', 'Precio', RANGOS_PRECIO, 'radio'),
      `<fieldset class="f-grupo"><legend>Disponibilidad</legend>
        <label class="f-op"><input type="checkbox" data-f="stock" value="1"${estado.stock ? ' checked' : ''}><span>Solo con stock</span><small>${Tienda.contar(conTexto({ ...filtrosDe('stock'), stock: true }))}</small></label>
        <label class="f-op"><input type="checkbox" data-f="ofertas" value="1"${estado.ofertas ? ' checked' : ''}><span>Con descuento</span><small>${Tienda.contar(conTexto({ ...filtrosDe('ofertas'), ofertas: true }))}</small></label></fieldset>`,
    ].join('');
  };

  const etiquetas = () => {
    const out = [];
    estado.cat.forEach(id => out.push(['cat', id, catDe(id)?.corto]));
    estado.tipo.forEach(id => out.push(['tipo', id, TIPOS[id]]));
    estado.familia.forEach(id => out.push(['familia', id, famDe(id)?.nombre]));
    estado.para.forEach(id => out.push(['para', id, PARA[id]]));
    if (estado.precio) out.push(['precio', estado.precio, RANGOS_PRECIO.find(r => r.id === estado.precio)?.nombre]);
    if (estado.stock) out.push(['stock', '1', 'Con stock']);
    if (estado.ofertas) out.push(['ofertas', '1', 'Con descuento']);
    if (estado.q) out.push(['q', estado.q, `“${estado.q}”`]);
    return out;
  };

  const syncURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'para', 'familia', 'precio', 'stock', 'ofertas', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.tipo.length) u.searchParams.set('tipo', estado.tipo.join(','));
    if (estado.para.length) u.searchParams.set('para', estado.para.join(','));
    if (estado.familia.length) u.searchParams.set('familia', estado.familia.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    history.replaceState(null, '', u);
    const params = new URLSearchParams(u.search);
    params.delete('producto');
    const qs = params.toString();
    document.querySelectorAll('.gw-modelos__btn').forEach(a => { a.href = a.getAttribute('href').split('?')[0] + (qs ? `?${qs}` : ''); });
  };

  const pintarCabecera = () => {
    const cat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const fam = cat?.id === 'perfumes' && estado.familia.length === 1 ? famDe(estado.familia[0]) : null;
    if (h1) h1.textContent = fam ? `Perfumes ${fam.corto}` : cat ? cat.nombre : 'Catálogo';
    if (bajada) bajada.textContent = fam ? fam.desc : cat ? cat.bajada : 'Perfumes importados, lencería, cuidado capilar, aromas Saphirus y accesorios. Filtrá por categoría, familia olfativa o precio.';
    if (miga) {
      miga.innerHTML = cat ? `<a href="${CATALOGO_URL}">Catálogo</a>` : 'Catálogo';
      const ultimo = document.querySelector('[data-miga-cat]');
      if (ultimo) { ultimo.hidden = !cat; ultimo.textContent = cat ? (fam ? `${cat.corto} ${fam.corto}` : cat.nombre) : ''; }
      if (cat) miga.removeAttribute('aria-current'); else miga.setAttribute('aria-current', 'page');
    }
    document.title = `${cat ? cat.nombre : 'Catálogo'} — Liam Aura`;
    if (tabs) tabs.querySelectorAll('[data-tab]').forEach(t => {
      const activo = t.dataset.tab === '' ? !estado.cat.length : estado.cat.length === 1 && estado.cat[0] === t.dataset.tab;
      t.setAttribute('aria-pressed', String(activo));
    });
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (new URL(a.href).searchParams.get('cat') === (cat?.id || '__')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };

  const pintarChips = total => {
    if (countEl) countEl.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}`;
    const et = etiquetas();
    if (chips) chips.innerHTML = et.map(([k, v, t]) => `<button type="button" class="chip-x" data-quitar-f="${k}" data-v="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('') + (et.length ? '<button type="button" class="chip-x chip-x--limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = et.filter(([k]) => k !== 'q').length;
    document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n; el.hidden = !n; });
    document.querySelectorAll('[data-count-btn]').forEach(el => { el.textContent = total; });
  };

  const traer = () => buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor, limite: POR_PAGINA });

  const render = ({ reset = true } = {}) => {
    if (reset) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = traer();
    res.items.forEach(cachear);
    grid.insertAdjacentHTML('beforeend', res.items.map(p => liHTML(p)).join(''));
    cursor = res.cursor;
    mostrados += res.items.length;
    const total = Tienda.contar(conTexto(filtrosDe()));
    if (verMas) verMas.hidden = !cursor;
    if (masInfo) { masInfo.hidden = !cursor; masInfo.textContent = `Viendo ${mostrados} de ${total}`; }
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (reset) { pintarFiltros(); pintarChips(total); pintarCabecera(); syncURL(); }
    revelarNuevos(grid);
    refrescarTriggers();
  };

  if (selOrden) {
    selOrden.innerHTML = Object.entries(ORDENES).map(([v, t]) => `<option value="${v}"${v === estado.orden ? ' selected' : ''}>${t}</option>`).join('');
    selOrden.addEventListener('change', () => { estado.orden = selOrden.value; render(); });
  }
  if (inputQ) {
    inputQ.value = estado.q;
    let t = 0;
    inputQ.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = inputQ.value.trim().slice(0, 60); render(); }, 220); });
    inputQ.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = inputQ.value.trim().slice(0, 60); render(); inputQ.blur(); });
    if (location.hash === '#buscar') setTimeout(() => inputQ.focus(), 60);
    document.querySelectorAll('[data-ir-buscar]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      inputQ.closest('form')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      inputQ.focus({ preventScroll: true });
    }));
  }
  form?.addEventListener('change', e => {
    const input = e.target.closest('[data-f]');
    if (!input) return;
    const k = input.dataset.f;
    if (k === 'stock' || k === 'ofertas') estado[k] = input.checked;
    else if (k === 'precio') estado.precio = input.checked ? input.value : '';
    else {
      estado[k] = input.checked ? [...new Set([...estado[k], input.value])] : estado[k].filter(v => v !== input.value);
      if (k === 'cat') {
        const permitidos = tiposVisibles().map(x => x.id);
        estado.tipo = estado.tipo.filter(v => permitidos.includes(v));
        if (estado.cat.length && !estado.cat.includes('perfumes')) { estado.familia = []; estado.para = []; }
      }
    }
    render();
  });
  const limpiar = () => {
    Object.assign(estado, { cat: [], tipo: [], para: [], familia: [], precio: '', stock: false, ofertas: false, q: '' });
    if (inputQ) inputQ.value = '';
    render();
  };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const x = e.target.closest('[data-quitar-f]');
    if (x) {
      const k = x.dataset.quitarF, v = x.dataset.v;
      if (k === 'q') { estado.q = ''; if (inputQ) inputQ.value = ''; }
      else if (k === 'precio') estado.precio = '';
      else if (k === 'stock' || k === 'ofertas') estado[k] = false;
      else estado[k] = estado[k].filter(y => y !== v);
      render();
      return;
    }
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      estado.cat = tab.dataset.tab ? [tab.dataset.tab] : [];
      estado.tipo = [];
      if (tab.dataset.tab && tab.dataset.tab !== 'perfumes') { estado.familia = []; estado.para = []; }
      render();
    }
  });
  verMas?.addEventListener('click', () => {
    const antes = grid.children.length;
    render({ reset: false });
    grid.children[antes]?.querySelector('.prod-foto')?.focus({ preventScroll: true });
  });

  if (tabs) tabs.innerHTML = `<button type="button" class="chip" data-tab="">Todo</button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-tab="${c.id}">${esc(c.corto)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');

  if (panel) initPanelFiltros(panel);
  render();
  const prod = sp.get('producto');
  if (prod && Tienda.obtener(prod)) abrirQuickView(prod);
}

function initPanelFiltros(panel) {
  const abrirBtns = document.querySelectorAll('[data-filtros-open]');
  const cajon = () => ES_M2 || window.matchMedia('(max-width: 1099px)').matches;
  let bd = null;
  const marcar = () => {
    if (cajon()) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { cerrar(); panel.removeAttribute('inert'); }
  };
  const abrir = () => {
    if (!cajon()) return;
    ultimoFoco = document.activeElement;
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    bd.hidden = false;
    panel.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { panel.classList.add('open'); bd.classList.add('open'); });
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    panel.querySelector('.filtros-close')?.focus();
  };
  function cerrar() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd?.classList.remove('open');
    setTimeout(() => { if (bd && !bd.classList.contains('open')) bd.hidden = true; }, 300);
    if (cajon()) panel.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    ultimoFoco?.focus?.();
  }
  abrirBtns.forEach(b => b.addEventListener('click', abrir));
  panel.addEventListener('click', e => { if (e.target.closest('[data-filtros-close]')) cerrar(); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); if (panel.classList.contains('open')) atraparFoco(panel, e); });
  window.matchMedia('(max-width: 1099px)').addEventListener('change', marcar);
  marcar();
}

document.addEventListener('cart:updated', updateCartBadge);

Cart.syncStock();
initModelBarScroll();
initMenuCategorias();
const enRail = initRail();
initPreview(enRail);
initGuia();
initCatalogo();
initReveals();
initNav();
initAcciones();
initCarrito();
initQuickView();
initFloats();
initHeroMotion();
initParallax();
updateCartBadge();
