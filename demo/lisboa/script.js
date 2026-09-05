'use strict';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const WHATSAPP_NUMBER = '5492214185095';
const MARCA = 'Lisboa';

const IMG = {
  zebra: 'images/roller-zebra-dia-noche-1200x1500.webp',
  screen: 'images/roller-sunscreen-tostado-1200x1500.webp',
  blackout: 'images/blackout-gris-plomo-1200x1500.webp',
  lino: 'images/cortina-lino-arena-1200x1500.webp',
  voile: 'images/hero-living-cortinas-1920x1080.webp',
  motor: 'images/roller-motorizada-dormitorio-1200x1500.webp',
  brazo: 'images/toldo-brazo-rayado-1200x1500.webp',
  capota: 'images/toldo-capota-azul-1200x1500.webp',
  coloca: 'images/instalacion-colocador-1200x1600.webp',
  muestras: 'images/muestrario-telas-1600x1300.webp',
};

const CATEGORIAS = [
  { id: 'blackout', nombre: 'Blackout', luz: '0 % de luz', nivel: 0, img: IMG.blackout, desc: 'Oscuridad total para dormir de día o ver una peli a las cinco de la tarde.' },
  { id: 'sunscreen', nombre: 'Sunscreen', luz: '3 a 10 % de luz', nivel: 8, img: IMG.screen, desc: 'Ves hacia afuera, filtrás el sol y nadie ve hacia adentro de día.' },
  { id: 'roller', nombre: 'Roller zebra', luz: 'Luz regulable', nivel: 50, img: IMG.zebra, desc: 'Día y noche en un solo paño: franjas que se alinean para abrir o cerrar.' },
  { id: 'tela', nombre: 'Cortinas de tela', luz: 'Luz difusa', nivel: 75, img: IMG.lino, desc: 'Lino, voile y gasa con riel o barral. Caen al piso y suavizan el ambiente.' },
  { id: 'motorizadas', nombre: 'Motorizadas', luz: 'A control', nivel: 35, img: IMG.motor, desc: 'Roller y rieles con motor, control remoto o app. Sin cadenas a la vista.' },
  { id: 'toldos', nombre: 'Toldos', luz: 'Sombra exterior', nivel: 20, img: IMG.brazo, desc: 'Brazos invisibles, capotas y verticales para balcón, patio y vidriera.' },
  { id: 'colocacion', nombre: 'Colocación', luz: 'Servicio', nivel: null, img: IMG.coloca, desc: 'Nuestro equipo mide, coloca y regula. También para cortinas que ya tenés.' },
];

const LUZ = { nada: 'Sin luz', poca: 'Luz filtrada', difusa: 'Luz difusa', exterior: 'Sombra exterior', servicio: 'Servicio' };
const COLORES = { blanco: 'Blanco', gris: 'Gris', arena: 'Arena', azul: 'Azul', negro: 'Negro', tostado: 'Tostado' };
const AMBIENTES = { dormitorio: 'Dormitorio', living: 'Living', cocina: 'Cocina o baño', exterior: 'Balcón o exterior' };

const M_ROLLER = [{ k: '100 × 160 cm', f: 1 }, { k: '140 × 180 cm', f: 1.4 }, { k: '180 × 200 cm', f: 1.9 }, { k: '220 × 220 cm', f: 2.4 }];
const M_TELA = [{ k: '2 paños · 140 × 230 cm', f: 1 }, { k: '2 paños · 200 × 230 cm', f: 1.4 }, { k: '3 paños · 300 × 250 cm', f: 2.1 }];
const M_TOLDO = [{ k: '250 × 200 cm', f: 1 }, { k: '300 × 250 cm', f: 1.3 }, { k: '400 × 300 cm', f: 1.8 }];
const M_SERV = [{ k: '1 paño', f: 1 }, { k: '2 a 3 paños', f: 1.7 }, { k: '4 o más paños', f: 2.6 }];

const PRODUCTOS = [
  { id: 'lis-01', slug: 'roller-zebra-blanco-nube', nombre: 'Roller zebra día/noche Blanco Nube', cat: 'roller', sub: 'Zebra', precio: 118000, descuento: 0, stock: 12, img: IMG.zebra, color: 'blanco', luz: 'poca', motor: false, tela: 'Poliéster zebra 280 g', medidas: M_ROLLER, destacado: true, perfil: { amb: ['living', 'dormitorio', 'cocina'] }, tags: ['dia noche', 'franjas', 'regulable'], desc: 'Dos capas de franjas que se alinean para abrir o cerrar la vista. Cadena metálica, tubo de 38 mm y soportes de acero. Blanco cálido que no amarillea.' },
  { id: 'lis-02', slug: 'roller-zebra-gris-piedra', nombre: 'Roller zebra día/noche Gris Piedra', cat: 'roller', sub: 'Zebra', precio: 122000, descuento: 10, stock: 8, img: IMG.zebra, color: 'gris', luz: 'poca', motor: false, tela: 'Poliéster zebra 280 g', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'dormitorio'] }, tags: ['dia noche', 'franjas', 'regulable'], desc: 'La misma mecánica día/noche en un gris que acompaña paredes blancas y muebles de madera. Se limpia con paño húmedo.' },
  { id: 'lis-03', slug: 'roller-zebra-lino-natural', nombre: 'Roller zebra Lino Natural', cat: 'roller', sub: 'Zebra', precio: 126000, descuento: 0, stock: 6, img: IMG.zebra, color: 'arena', luz: 'poca', motor: false, tela: 'Zebra texturado símil lino', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['dia noche', 'textura', 'lino'], desc: 'Franjas con textura de lino para ambientes cálidos. Franja traslúcida más ancha que la estándar: más luz cuando está abierta.' },
  { id: 'lis-04', slug: 'roller-blackout-plomo', nombre: 'Roller blackout Plomo', cat: 'roller', sub: 'Blackout', precio: 98000, descuento: 0, stock: 15, img: IMG.blackout, color: 'gris', luz: 'nada', motor: false, tela: 'Blackout 100 % · 3 capas', medidas: M_ROLLER, destacado: true, perfil: { amb: ['dormitorio'] }, tags: ['oscuridad', 'dormir', 'termico'], desc: 'Bloquea el 100 % de la luz. Tres capas con alma de PVC que además aíslan del calor. Ideal en dormitorios y para trabajar de noche.' },
  { id: 'lis-05', slug: 'roller-blackout-blanco', nombre: 'Roller blackout Blanco', cat: 'roller', sub: 'Blackout', precio: 95000, descuento: 0, stock: 20, img: IMG.blackout, color: 'blanco', luz: 'nada', motor: false, tela: 'Blackout 100 % · 3 capas', medidas: M_ROLLER, destacado: false, perfil: { amb: ['dormitorio', 'cocina'] }, tags: ['oscuridad', 'dormir'], desc: 'Blackout total en blanco: de afuera se ve neutro, de adentro oscurece por completo. Recomendado con cenefa para tapar la rendija superior.' },
  { id: 'lis-06', slug: 'roller-blackout-azul-noche', nombre: 'Roller blackout Azul Noche', cat: 'roller', sub: 'Blackout', precio: 101000, descuento: 15, stock: 5, img: IMG.blackout, color: 'azul', luz: 'nada', motor: false, tela: 'Blackout 100 % · 3 capas', medidas: M_ROLLER, destacado: false, perfil: { amb: ['dormitorio'] }, tags: ['oscuridad', 'color', 'infantil'], desc: 'Azul profundo para dormitorios infantiles o estudios. Mismo sistema blackout de tres capas, con cadena a la derecha o izquierda a elección.' },
  { id: 'lis-07', slug: 'roller-screen-5-tostado', nombre: 'Roller screen 5 % Tostado', cat: 'sunscreen', sub: 'Screen 5 %', precio: 109000, descuento: 0, stock: 14, img: IMG.screen, color: 'tostado', luz: 'poca', motor: false, tela: 'Sunscreen fibra de vidrio 5 %', medidas: M_ROLLER, destacado: true, perfil: { amb: ['living', 'cocina'] }, tags: ['sol', 'vista', 'privacidad', 'oficina'], desc: 'Filtra el sol y deja ver hacia afuera. De día, quien pasa por la vereda no ve el interior. Tostado que calienta la luz de la tarde.' },
  { id: 'lis-08', slug: 'roller-screen-5-gris-perla', nombre: 'Roller screen 5 % Gris Perla', cat: 'sunscreen', sub: 'Screen 5 %', precio: 109000, descuento: 0, stock: 11, img: IMG.screen, color: 'gris', luz: 'poca', motor: false, tela: 'Sunscreen fibra de vidrio 5 %', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['sol', 'vista', 'oficina'], desc: 'La opción más pedida para oficinas y livings con mucho vidrio: baja el reflejo en pantallas sin dejar el ambiente a oscuras.' },
  { id: 'lis-09', slug: 'roller-screen-3-negro', nombre: 'Roller screen 3 % Negro', cat: 'sunscreen', sub: 'Screen 3 %', precio: 114000, descuento: 0, stock: 7, img: IMG.screen, color: 'negro', luz: 'poca', motor: false, tela: 'Sunscreen fibra de vidrio 3 %', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['sol', 'vista', 'nitida'], desc: 'El negro es el screen que mejor deja ver hacia afuera: la trama oscura no refleja y la vista queda nítida. Apertura 3 % para ventanas al sol de la tarde.' },
  { id: 'lis-10', slug: 'roller-screen-10-arena', nombre: 'Roller screen 10 % Arena', cat: 'sunscreen', sub: 'Screen 10 %', precio: 104000, descuento: 0, stock: 9, img: IMG.screen, color: 'arena', luz: 'poca', motor: false, tela: 'Sunscreen fibra de vidrio 10 %', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['sol', 'luminoso'], desc: 'Apertura 10 % para ventanas que dan al norte o a un patio interno: entra más luz, sigue frenando el calor directo.' },
  { id: 'lis-11', slug: 'cortina-blackout-plomo-presillas', nombre: 'Cortina blackout Plomo con presillas', cat: 'blackout', sub: 'Tela blackout', precio: 168000, descuento: 0, stock: 10, img: IMG.blackout, color: 'gris', luz: 'nada', motor: false, tela: 'Blackout textil 3 capas · 320 g', medidas: M_TELA, destacado: true, perfil: { amb: ['dormitorio', 'living'] }, tags: ['oscuridad', 'presillas', 'barral', 'dormir'], desc: 'Paños blackout con presillas para barral, dobladillo de 10 cm y caída al piso. Oscurece y aísla del ruido de la calle. Gris plomo neutro.' },
  { id: 'lis-12', slug: 'cortina-blackout-blanco-tiza-riel', nombre: 'Cortina blackout Blanco Tiza con riel', cat: 'blackout', sub: 'Tela blackout', precio: 172000, descuento: 0, stock: 8, img: IMG.blackout, color: 'blanco', luz: 'nada', motor: false, tela: 'Blackout textil 3 capas · 320 g', medidas: M_TELA, destacado: false, perfil: { amb: ['dormitorio'] }, tags: ['oscuridad', 'riel', 'dormir'], desc: 'Incluye riel de aluminio blanco con corredores silenciosos. Pliegue de tabla para que caiga prolija abierta o cerrada.' },
  { id: 'lis-13', slug: 'cortina-blackout-termica-arena', nombre: 'Cortina blackout térmica Arena', cat: 'blackout', sub: 'Tela blackout', precio: 189000, descuento: 10, stock: 4, img: IMG.blackout, color: 'arena', luz: 'nada', motor: false, tela: 'Blackout térmico con respaldo aluminizado', medidas: M_TELA, destacado: false, perfil: { amb: ['dormitorio', 'living'] }, tags: ['oscuridad', 'termica', 'frio', 'calor'], desc: 'Respaldo aluminizado que refleja el calor en verano y retiene el ambiente en invierno. Para ventanales grandes que dan al oeste.' },
  { id: 'lis-14', slug: 'cortina-lino-arena-2-panos', nombre: 'Cortina de lino Arena, 2 paños', cat: 'tela', sub: 'Lino', precio: 154000, descuento: 0, stock: 9, img: IMG.lino, color: 'arena', luz: 'difusa', motor: false, tela: 'Lino mezcla 55 % · 240 g', medidas: M_TELA, destacado: true, perfil: { amb: ['living', 'dormitorio'] }, tags: ['lino', 'natural', 'calida', 'barral'], desc: 'Lino mezcla con caída pesada y textura visible. Suaviza la luz sin apagarla. Con presillas ocultas para barral o ganchos para riel.' },
  { id: 'lis-15', slug: 'cortina-lino-blanco-crudo', nombre: 'Cortina de lino Blanco Crudo', cat: 'tela', sub: 'Lino', precio: 149000, descuento: 0, stock: 12, img: IMG.lino, color: 'blanco', luz: 'difusa', motor: false, tela: 'Lino mezcla 55 % · 240 g', medidas: M_TELA, destacado: false, perfil: { amb: ['living', 'dormitorio'] }, tags: ['lino', 'natural', 'luminoso'], desc: 'Blanco crudo, sin blanqueador: el color natural del lino. Deja pasar mucha luz y funciona como capa única en livings que dan al patio.' },
  { id: 'lis-16', slug: 'cortina-voile-blanco-2-panos', nombre: 'Cortina voile Blanco, 2 paños', cat: 'tela', sub: 'Voile', precio: 92000, descuento: 0, stock: 18, img: IMG.voile, color: 'blanco', luz: 'difusa', motor: false, tela: 'Voile de poliéster · 90 g', medidas: M_TELA, destacado: true, perfil: { amb: ['living', 'dormitorio', 'cocina'] }, tags: ['voile', 'transparente', 'liviana', 'riel'], desc: 'La cortina liviana clásica: tamiza la luz, ondula con el aire y se lava en el lavarropas. Con cinta fruncidora para riel.' },
  { id: 'lis-17', slug: 'cortina-voile-blackout-doble-riel', nombre: 'Cortina voile + blackout con doble riel', cat: 'tela', sub: 'Doble cortina', precio: 238000, descuento: 0, stock: 5, img: IMG.lino, color: 'arena', luz: 'nada', motor: false, tela: 'Voile 90 g + blackout 320 g', medidas: M_TELA, destacado: false, perfil: { amb: ['dormitorio', 'living'] }, tags: ['doble', 'voile', 'blackout', 'riel', 'dormir'], desc: 'Dos cortinas en un solo riel doble: voile para el día, blackout para dormir. La combinación que resuelve un dormitorio completo.' },
  { id: 'lis-18', slug: 'cortina-gasa-gris-humo', nombre: 'Cortina gasa Gris Humo', cat: 'tela', sub: 'Gasa', precio: 96000, descuento: 0, stock: 10, img: IMG.voile, color: 'gris', luz: 'difusa', motor: false, tela: 'Gasa de poliéster · 110 g', medidas: M_TELA, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['gasa', 'transparente', 'gris'], desc: 'Gasa gris que tamiza sin blanquear el ambiente. Va bien sobre paredes oscuras y con muebles de hierro. Cinta fruncidora incluida.' },
  { id: 'lis-19', slug: 'roller-blackout-motorizada', nombre: 'Roller blackout motorizada', cat: 'motorizadas', sub: 'Roller con motor', precio: 265000, descuento: 0, stock: 6, img: IMG.motor, color: 'gris', luz: 'nada', motor: true, tela: 'Blackout 100 % · motor tubular 230 V', medidas: M_ROLLER, destacado: true, perfil: { amb: ['dormitorio', 'living'] }, tags: ['motor', 'control remoto', 'oscuridad', 'dormir'], desc: 'Motor tubular dentro del tubo, sin cadena. Control remoto de 5 canales y posiciones de memoria. Baja sola a la hora que programes.' },
  { id: 'lis-20', slug: 'roller-screen-motorizada-control', nombre: 'Roller screen motorizada con control', cat: 'motorizadas', sub: 'Roller con motor', precio: 278000, descuento: 0, stock: 6, img: IMG.motor, color: 'arena', luz: 'poca', motor: true, tela: 'Sunscreen 5 % · motor tubular 230 V', medidas: M_ROLLER, destacado: false, perfil: { amb: ['living', 'cocina'] }, tags: ['motor', 'control remoto', 'sol', 'ventanal'], desc: 'Para ventanales altos donde la cadena no llega. Screen 5 % con motor silencioso y control remoto; opcional puente wifi para manejarla desde el celular.' },
  { id: 'lis-21', slug: 'riel-motorizado-cortina-tela', nombre: 'Riel motorizado para cortina de tela', cat: 'motorizadas', sub: 'Riel con motor', precio: 312000, descuento: 0, stock: 4, img: IMG.motor, color: 'blanco', luz: 'difusa', motor: true, tela: 'Riel de aluminio · motor 230 V · cortina no incluida', medidas: [{ k: 'Hasta 300 cm de ancho', f: 1 }, { k: '300 a 450 cm', f: 1.4 }, { k: '450 a 600 cm', f: 1.9 }], destacado: false, perfil: { amb: ['living', 'dormitorio'] }, tags: ['motor', 'riel', 'cortina', 'app'], desc: 'Riel de aluminio con motor que abre y cierra tus cortinas de tela por control remoto. Arranque suave, tope automático y opción de apertura central o lateral.' },
  { id: 'lis-22', slug: 'motor-bateria-roller-recambio', nombre: 'Motor a batería para roller (recambio)', cat: 'motorizadas', sub: 'Motor', precio: 146000, descuento: 0, stock: 9, img: IMG.motor, color: 'negro', luz: 'poca', motor: true, tela: 'Motor a batería recargable por USB-C', medidas: [{ k: 'Motor 1,1 Nm · hasta 200 cm de ancho', f: 1 }, { k: 'Motor 2 Nm · hasta 300 cm', f: 1.35 }], destacado: false, perfil: { amb: ['dormitorio', 'living', 'cocina'] }, tags: ['motor', 'bateria', 'sin cable', 'recambio'], desc: 'Motorizá el roller que ya tenés sin hacer instalación eléctrica. Batería recargable por USB-C que dura meses, control remoto incluido.' },
  { id: 'lis-23', slug: 'toldo-brazos-invisibles-rayado-arena', nombre: 'Toldo de brazos invisibles Rayado Arena', cat: 'toldos', sub: 'Brazos invisibles', precio: 720000, descuento: 0, stock: 3, img: IMG.brazo, color: 'arena', luz: 'exterior', motor: false, tela: 'Lona acrílica teñida en masa · estructura de aluminio', medidas: M_TOLDO, destacado: true, perfil: { amb: ['exterior'] }, tags: ['toldo', 'brazo', 'balcon', 'patio', 'sombra', 'lluvia'], desc: 'Se abre a manivela y desaparece contra la pared cuando lo cerrás. Lona acrílica que no destiñe ni se mancha con el agua. Para balcones, patios y ventanales.' },
  { id: 'lis-24', slug: 'toldo-brazos-invisibles-gris-plomo', nombre: 'Toldo de brazos invisibles Gris Plomo', cat: 'toldos', sub: 'Brazos invisibles', precio: 735000, descuento: 0, stock: 3, img: IMG.brazo, color: 'gris', luz: 'exterior', motor: false, tela: 'Lona acrílica teñida en masa · estructura de aluminio', medidas: M_TOLDO, destacado: false, perfil: { amb: ['exterior'] }, tags: ['toldo', 'brazo', 'balcon', 'sombra'], desc: 'Lona lisa gris plomo con estructura blanca o negra. Con opción de motor y sensor de viento que lo recoge solo si se levanta tormenta.' },
  { id: 'lis-25', slug: 'toldo-capota-azul-petroleo', nombre: 'Toldo capota Azul Petróleo', cat: 'toldos', sub: 'Capota', precio: 410000, descuento: 10, stock: 4, img: IMG.capota, color: 'azul', luz: 'exterior', motor: false, tela: 'Lona acrílica · arcos de aluminio', medidas: [{ k: '120 × 80 cm', f: 1 }, { k: '180 × 90 cm', f: 1.35 }, { k: '250 × 100 cm', f: 1.8 }], destacado: false, perfil: { amb: ['exterior'] }, tags: ['toldo', 'capota', 'vidriera', 'ventana', 'local'], desc: 'La capota clásica de vidrieras y ventanas, con arcos de aluminio y lona acrílica. Frena el sol directo y protege el marco de la lluvia.' },
  { id: 'lis-26', slug: 'toldo-vertical-enrollable-balcon', nombre: 'Toldo vertical enrollable para balcón', cat: 'toldos', sub: 'Vertical', precio: 390000, descuento: 0, stock: 5, img: IMG.brazo, color: 'arena', luz: 'exterior', motor: false, tela: 'Screen exterior 5 % · guías laterales', medidas: [{ k: '200 × 250 cm', f: 1 }, { k: '250 × 250 cm', f: 1.25 }, { k: '300 × 280 cm', f: 1.6 }], destacado: false, perfil: { amb: ['exterior'] }, tags: ['toldo', 'vertical', 'balcon', 'viento', 'privacidad'], desc: 'Baja como un roller, pero afuera: cierra el balcón del sol y las miradas sin taparte la vista. Guías laterales para que no golpee con viento.' },
  { id: 'lis-27', slug: 'colocacion-cortina-roller', nombre: 'Colocación de cortina roller', cat: 'colocacion', sub: 'Servicio', precio: 28000, descuento: 0, stock: 99, img: IMG.coloca, color: null, luz: 'servicio', motor: false, tela: 'Incluye soportes, nivelado y regulación del tope', medidas: M_SERV, destacado: false, perfil: { amb: ['dormitorio', 'living', 'cocina'] }, tags: ['colocacion', 'instalacion', 'roller', 'servicio'], desc: 'Colocación de rollers comprados acá o en otro lado: fijamos a pared o techo, nivelamos y regulamos el tope de la cadena. En La Plata y alrededores.' },
  { id: 'lis-28', slug: 'colocacion-cortina-tela-riel-barral', nombre: 'Colocación de cortina de tela con riel o barral', cat: 'colocacion', sub: 'Servicio', precio: 34000, descuento: 0, stock: 99, img: IMG.coloca, color: null, luz: 'servicio', motor: false, tela: 'Incluye fijación del riel o barral y colgado de los paños', medidas: M_SERV, destacado: false, perfil: { amb: ['dormitorio', 'living'] }, tags: ['colocacion', 'instalacion', 'riel', 'barral', 'servicio'], desc: 'Fijamos el riel o barral, colgamos los paños y los peinamos para que caigan parejos. Si el riel es viejo, lo revisamos antes de decidir si va.' },
  { id: 'lis-29', slug: 'colocacion-toldo', nombre: 'Colocación de toldo', cat: 'colocacion', sub: 'Servicio', precio: 85000, descuento: 0, stock: 99, img: IMG.coloca, color: null, luz: 'servicio', motor: false, tela: 'Incluye anclajes químicos y prueba de apertura', medidas: [{ k: 'Hasta 300 cm', f: 1 }, { k: '300 a 400 cm', f: 1.4 }, { k: 'Más de 400 cm', f: 1.9 }], destacado: false, perfil: { amb: ['exterior'] }, tags: ['colocacion', 'toldo', 'instalacion', 'servicio'], desc: 'Anclamos el toldo a la mampostería con fijaciones químicas, lo nivelamos y probamos la apertura completa. Con dos personas, siempre.' },
  { id: 'lis-30', slug: 'medicion-a-domicilio', nombre: 'Medición a domicilio en La Plata', cat: 'colocacion', sub: 'Servicio', precio: 15000, descuento: 0, stock: 99, img: IMG.muestras, color: null, luz: 'servicio', motor: false, tela: 'Vamos con el muestrario de telas', medidas: [{ k: 'Hasta 4 ventanas', f: 1 }, { k: '5 a 8 ventanas', f: 1.6 }], destacado: false, perfil: { amb: ['dormitorio', 'living', 'cocina', 'exterior'] }, tags: ['medicion', 'domicilio', 'muestrario', 'asesoramiento', 'servicio'], desc: 'Un colocador va a tu casa con el muestrario, toma las medidas exactas de cada ventana y te recomienda qué sistema conviene en cada una.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioBase = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioMedida = (p, medida) => {
  const m = p.medidas.find(x => x.k === medida) || p.medidas[0];
  return Math.round(precioBase(p) * (m?.f ?? 1) / 500) * 500;
};
const precioFinal = p => precioMedida(p, p.medidas[0].k);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const catNombre = c => CATEGORIAS.find(x => x.id === c)?.nombre || '';
const colorNombre = c => COLORES[c] || '';
const luzNombre = l => LUZ[l] || '';
const esServicio = p => p.cat === 'colocacion';

const mediaHTML = (p, opts = {}) => `<img src="${p.img}" alt="${esc(p.nombre)}" width="${opts.w || 1200}" height="${opts.h || 1500}"${opts.lazy ? ' loading="lazy"' : ''} decoding="async">`;

const Cart = {
  KEY: 'lisboa_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, medida) {
    const m = producto.medidas.some(x => x.k === medida) ? medida : producto.medidas[0].k;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.medida === m);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, medida: m, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, medida, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.medida === medida); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, medida) { this.save(this.get().filter(i => !(i.id === id && i.medida === medida))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioMedida(p, i.medida) * i.qty : s; }, 0); },
};

const Vistos = {
  KEY: 'lisboa_vistos',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  push(id) {
    const l = [id, ...this.get().filter(x => x !== id)].slice(0, 8);
    try { localStorage.setItem(this.KEY, JSON.stringify(l)); } catch { /* sin storage */ }
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function cardHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="tag tag--luz">-${p.descuento}%</span>`);
  if (p.motor) badges.push(`<span class="tag">Con motor</span>`);
  if (esServicio(p)) badges.push(`<span class="tag">Servicio</span>`);
  const meta = esServicio(p) ? 'La Plata y alrededores' : `${luzNombre(p.luz)}${p.color ? ' · ' + colorNombre(p.color) : ''}`;
  return `
  <article class="prod" data-id="${p.id}" data-flip-id="${p.id}" data-animate="up" style="opacity:0;transform:translateY(40px)">
    <button type="button" class="prod-media" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${mediaHTML(p, { lazy: false })}
      <span class="prod-lama" aria-hidden="true"><span>Vista rápida</span></span>
      ${badges.length ? `<span class="prod-badges">${badges.join('')}</span>` : ''}
    </button>
    <div class="prod-body">
      <p class="prod-cat">${esc(catNombre(p.cat))} <span class="dot" aria-hidden="true"></span> ${esc(meta)}</p>
      <h3 class="prod-nom"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-medida"><span class="cota-mini" aria-hidden="true"></span>${esc(p.medidas[0].k)}</p>
      <p class="prod-precio">
        <strong>${formatearPrecio(fin)}</strong>
        ${p.descuento > 0 ? `<s>${formatearPrecio(Math.round(p.precio / 500) * 500)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        ${opts.buy === false ? '' : `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar</button>`}
      </div>
    </div>
  </article>`;
}

function leerQty(card) {
  const n = parseInt(card?.querySelector('[data-qty]')?.textContent || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function bindCards(cont) {
  cont.querySelectorAll('[data-stepper]').forEach(st => {
    if (st.dataset.bound) return;
    st.dataset.bound = '1';
    st.addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const out = st.querySelector('[data-qty]');
      const p = getProducto(st.closest('[data-id]')?.dataset.id);
      const max = p?.stock ?? 99;
      const v = Math.max(1, Math.min(max, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
      out.textContent = v;
    });
  });
  cont.querySelectorAll('[data-add]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => {
      const p = getProducto(b.dataset.add);
      if (!p) return;
      Cart.add(p, leerQty(b.closest('[data-id]')), b.closest('[data-id]')?.dataset.medida);
      showToast(esServicio(p) ? 'Servicio agregado. Coordinamos el día por WhatsApp.' : 'Agregado. La medida final se confirma antes de fabricar.');
    });
  });
  cont.querySelectorAll('[data-buy]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => {
      const p = getProducto(b.dataset.buy);
      if (!p) return;
      Cart.add(p, leerQty(b.closest('[data-id]')), b.closest('[data-id]')?.dataset.medida);
      abrirDrawer();
    });
  });
  cont.querySelectorAll('[data-quick]').forEach(b => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', () => abrirModal(b.dataset.quick, b));
  });
}

function initCategorias() {
  const grid = document.getElementById('cat-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map((c, i) => `
    <a class="cat" href="#tienda" data-goto-filtro="cat:${c.id}" data-animate="left" style="opacity:0;transform:translateX(-36px)">
      <span class="cat-n">0${i + 1}</span>
      <span class="cat-media"><img src="${c.img}" alt="" width="1200" height="1500" decoding="async"></span>
      <span class="cat-body">
        <span class="cat-nom">${esc(c.nombre)}</span>
        <span class="cat-desc">${esc(c.desc)}</span>
        <span class="cat-luz">
          <span class="cat-luz-lbl">${esc(c.luz)}</span>
          ${c.nivel === null ? '' : `<span class="cat-bar" aria-hidden="true"><i style="--nivel:${c.nivel}%"></i></span>`}
        </span>
      </span>
      <span class="cat-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </a>`).join('');
}

function initRail() {
  const track = document.getElementById('rail-track');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, { buy: false })).join('');
  bindCards(track);
}

function initRailControles() {
  const vp = document.getElementById('rail-vp');
  const track = document.getElementById('rail-track');
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  if (!vp || !track) return;

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  initRailDrag(vp);

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 18;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

const PASO = 16;
const filtros = { q: '', cat: '', luz: '', color: '', motor: '', precio: '' };
let visibles = PASO;

function enRango(p, rango) {
  const v = precioFinal(p);
  if (rango === 'bajo') return v < 120000;
  if (rango === 'medio') return v >= 120000 && v <= 250000;
  if (rango === 'alto') return v > 250000;
  return true;
}

function filtrar() {
  const q = normalizar(filtros.q).trim();
  const terminos = q ? q.split(/\s+/) : [];
  return PRODUCTOS.filter(p => {
    if (filtros.cat && p.cat !== filtros.cat) return false;
    if (filtros.luz && p.luz !== filtros.luz) return false;
    if (filtros.color && p.color !== filtros.color) return false;
    if (filtros.motor === 'si' && !p.motor) return false;
    if (filtros.motor === 'no' && p.motor) return false;
    if (filtros.precio && !enRango(p, filtros.precio)) return false;
    if (!terminos.length) return true;
    const heno = normalizar([p.nombre, p.sub, catNombre(p.cat), colorNombre(p.color), luzNombre(p.luz), p.tela, p.desc, ...(p.tags || [])].join(' '));
    return terminos.every(t => heno.includes(t));
  });
}

const hayFiltroActivo = () => Object.values(filtros).some(Boolean);

function renderCatalogo({ append = false, flip = false } = {}) {
  const grid = document.getElementById('catalogo-grid');
  const vacio = document.getElementById('catalogo-vacio');
  const masWrap = document.querySelector('.catalogo-mas');
  const res = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = filtrar();
  const hayFiltro = hayFiltroActivo();

  if (append) {
    const desde = grid.querySelectorAll('.prod').length;
    const nuevos = lista.slice(desde, visibles);
    if (nuevos.length) {
      grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
      bindCards(grid);
      revelarNuevos(grid);
    }
  } else {
    const estado = (flip && typeof Flip !== 'undefined' && !reduceMotion && grid.querySelectorAll('.prod').length)
      ? Flip.getState(grid.querySelectorAll('.prod')) : null;
    grid.innerHTML = lista.slice(0, visibles).map(p => cardHTML(p)).join('');
    bindCards(grid);
    if (estado) {
      grid.querySelectorAll('.prod').forEach(el => el.classList.add('in'));
      Flip.from(estado, {
        duration: .5, ease: 'power2.out', stagger: .015, absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .45, stagger: .04 }),
      });
    } else {
      revelarNuevos(grid);
    }
  }

  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  masWrap.hidden = lista.length <= visibles;
  if (limpiar) limpiar.hidden = !hayFiltro;
  if (res) {
    res.textContent = lista.length === 0
      ? 'Sin resultados'
      : `${lista.length} ${lista.length === 1 ? 'modelo' : 'modelos'}${hayFiltro ? ' con estos filtros' : ' en el catálogo'}`;
  }

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarFiltro(clave, valor) {
  filtros[clave] = valor;
  visibles = PASO;
  sincronizarControles();
  renderCatalogo({ flip: true });
}

function sincronizarControles() {
  document.querySelectorAll('#chips-cat .chip').forEach(c => c.setAttribute('aria-pressed', String((c.dataset.cat || '') === filtros.cat)));
  const l = document.getElementById('f-luz'); if (l) l.value = filtros.luz;
  const c = document.getElementById('f-color'); if (c) c.value = filtros.color;
  const m = document.getElementById('f-motor'); if (m) m.value = filtros.motor;
  const pr = document.getElementById('f-precio'); if (pr) pr.value = filtros.precio;
  const q = document.getElementById('q'); if (q && q.value !== filtros.q) q.value = filtros.q;
}

function resetFiltros() {
  Object.keys(filtros).forEach(k => { filtros[k] = ''; });
  visibles = PASO;
  sincronizarControles();
  renderCatalogo({ flip: true });
}

function initCatalogo() {
  const chipsCat = document.getElementById('chips-cat');
  if (chipsCat) {
    chipsCat.innerHTML = `<button type="button" class="chip" data-cat="" aria-pressed="true">Todo</button>` +
      CATEGORIAS.map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`).join('');
    chipsCat.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      aplicarFiltro('cat', b.dataset.cat || '');
    });
  }

  const selLuz = document.getElementById('f-luz');
  if (selLuz) {
    selLuz.insertAdjacentHTML('beforeend', Object.entries(LUZ).filter(([k]) => k !== 'servicio').map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join(''));
    selLuz.addEventListener('change', () => aplicarFiltro('luz', selLuz.value));
  }
  const selColor = document.getElementById('f-color');
  if (selColor) {
    const usados = [...new Set(PRODUCTOS.map(p => p.color).filter(Boolean))];
    selColor.insertAdjacentHTML('beforeend', usados.map(c => `<option value="${c}">${esc(colorNombre(c))}</option>`).join(''));
    selColor.addEventListener('change', () => aplicarFiltro('color', selColor.value));
  }
  const selMotor = document.getElementById('f-motor');
  selMotor?.addEventListener('change', () => aplicarFiltro('motor', selMotor.value));
  const selPrecio = document.getElementById('f-precio');
  selPrecio?.addEventListener('change', () => aplicarFiltro('precio', selPrecio.value));

  const q = document.getElementById('q');
  let tid;
  q?.addEventListener('input', () => {
    clearTimeout(tid);
    tid = setTimeout(() => aplicarFiltro('q', q.value), 180);
  });

  document.getElementById('limpiar')?.addEventListener('click', resetFiltros);
  document.getElementById('vacio-limpiar')?.addEventListener('click', resetFiltros);

  document.getElementById('ver-mas')?.addEventListener('click', () => {
    visibles += PASO;
    renderCatalogo({ append: true });
  });

  renderCatalogo();
}

function irAlCatalogo(filtroStr) {
  Object.keys(filtros).forEach(k => { filtros[k] = ''; });
  String(filtroStr || '').split(',').forEach(par => {
    const [clave, valor] = par.split(':');
    if (clave && valor && clave in filtros) filtros[clave] = valor;
  });
  visibles = PASO;
  const drawer = document.getElementById('filtros-drawer');
  if (drawer && hayFiltroActivo()) drawer.open = true;
  sincronizarControles();
  renderCatalogo({ flip: true });
  const dest = document.getElementById('tienda');
  if (dest) window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initFiltroLinks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-goto-filtro]');
    if (!a) return;
    e.preventDefault();
    irAlCatalogo(a.dataset.gotoFiltro);
  });
}

let modalPrev = null;
let modalMedida = '';

function abrirModal(id, origen) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  const inner = document.getElementById('modal-inner');
  if (!p || !modal || !inner) return;

  modalPrev = origen || document.activeElement;
  modalMedida = p.medidas[0].k;
  const vistos = Vistos.get().filter(x => x !== p.id).map(getProducto).filter(Boolean).slice(0, 3);
  const relacionados = vistos.length >= 3 ? vistos
    : vistos.concat(PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat && !vistos.includes(x)).slice(0, 3 - vistos.length));
  const servicio = esServicio(p);

  inner.innerHTML = `
    <div class="modal-grid" data-id="${p.id}" data-medida="${esc(modalMedida)}">
      <div class="modal-media">
        ${mediaHTML(p)}
        <span class="modal-cota" aria-hidden="true"><span id="modal-cota-txt">${esc(modalMedida)}</span></span>
      </div>
      <div class="modal-body">
        <p class="eyebrow">${esc(catNombre(p.cat))} · ${esc(p.sub)}</p>
        <h3 id="modal-tit">${esc(p.nombre)}</h3>
        <p class="modal-desc">${esc(p.desc)}</p>
        <dl class="modal-ficha">
          <div><dt>${servicio ? 'Incluye' : 'Tela / sistema'}</dt><dd>${esc(p.tela)}</dd></div>
          ${servicio ? '' : `<div><dt>Paso de luz</dt><dd>${esc(luzNombre(p.luz))}</dd></div>`}
          ${p.color ? `<div><dt>Color</dt><dd>${esc(colorNombre(p.color))}</dd></div>` : ''}
          <div><dt>${servicio ? 'Zona' : 'Motorización'}</dt><dd>${servicio ? 'La Plata y alrededores' : (p.motor ? 'Con motor y control' : 'A cadena o manual')}</dd></div>
        </dl>
        <div class="modal-medidas">
          <p class="lbl">${servicio ? 'Cantidad de paños' : 'Medida orientativa (ancho × alto)'}</p>
          <div class="chips chips--medida" id="modal-medidas" role="group" aria-label="Elegí la medida">
            ${p.medidas.map(m => `<button type="button" class="chip" data-medida="${esc(m.k)}" aria-pressed="${m.k === modalMedida}">${esc(m.k)}</button>`).join('')}
          </div>
          ${servicio ? '' : '<p class="modal-nota">Fabricamos a la medida exacta de tu ventana: el precio final se ajusta al centímetro antes de confirmar.</p>'}
        </div>
        <p class="modal-precio">
          <strong id="modal-precio">${formatearPrecio(precioMedida(p, modalMedida))}</strong>
          ${p.descuento > 0 ? `<span class="tag tag--luz">-${p.descuento}%</span>` : ''}
        </p>
        <div class="modal-acciones">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Agregar uno">+</button>
          </div>
          <button type="button" class="btn btn--primary" id="modal-add">Agregar al carrito</button>
          <button type="button" class="btn btn--ghost" id="modal-buy">Comprar ahora</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `
    <div class="modal-rel">
      <p class="eyebrow">También te puede servir</p>
      <div class="modal-rel-row">
        ${relacionados.map(r => `
          <button type="button" class="mini" data-quick="${r.id}">
            <span class="mini-media">${mediaHTML(r, { lazy: true })}</span>
            <span class="mini-nom">${esc(r.nombre)}</span>
            <span class="mini-precio">${formatearPrecio(precioFinal(r))}</span>
          </button>`).join('')}
      </div>
    </div>` : ''}`;

  const grupo = inner.querySelector('#modal-medidas');
  const wrap = inner.querySelector('.modal-grid');
  grupo?.addEventListener('click', e => {
    const b = e.target.closest('[data-medida]');
    if (!b) return;
    modalMedida = b.dataset.medida;
    wrap.dataset.medida = modalMedida;
    grupo.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.medida === modalMedida)));
    const precioEl = inner.querySelector('#modal-precio');
    if (precioEl) {
      precioEl.textContent = formatearPrecio(precioMedida(p, modalMedida));
      precioEl.classList.remove('tick'); void precioEl.offsetWidth; precioEl.classList.add('tick');
    }
    const cota = inner.querySelector('#modal-cota-txt');
    if (cota) cota.textContent = modalMedida;
  });
  bindCards(inner.querySelector('.modal-acciones'));
  inner.querySelector('#modal-add')?.addEventListener('click', () => {
    Cart.add(p, leerQty(wrap), modalMedida);
    showToast(servicio ? 'Servicio agregado. Coordinamos el día por WhatsApp.' : `${p.nombre} · ${modalMedida}, al carrito.`);
  });
  inner.querySelector('#modal-buy')?.addEventListener('click', () => {
    Cart.add(p, leerQty(wrap), modalMedida);
    cerrarModal();
    abrirDrawer();
  });
  inner.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => abrirModal(b.dataset.quick, modalPrev)));

  Vistos.push(p.id);
  backdrop.hidden = false;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { backdrop.classList.add('open'); modal.classList.add('open'); });
  modal.querySelector('#modal-add')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; backdrop.hidden = true; }, 280);
  modalPrev?.focus?.();
}

function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', cerrarModal);
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug) {
    const p = PRODUCTOS.find(x => x.slug === slug);
    if (p) window.addEventListener('load', () => abrirModal(p.id));
  }
}

let drawerPrev = null;

function mensajePedido(items) {
  const lineas = [`Hola ${MARCA}, quiero confirmar este pedido:`];
  items.forEach(i => {
    const p = getProducto(i.id);
    if (p) lineas.push(`${i.qty}x ${p.nombre} | ${i.medida} | ${formatearPrecio(precioMedida(p, i.medida) * i.qty)}`);
  });
  lineas.push(`Total: ${formatearPrecio(Cart.total())}`);
  lineas.push('¿Coordinamos la medición o la colocación?');
  return lineas.join('\n');
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const totalEl = document.getElementById('drawer-total');
  const wsp = document.getElementById('drawer-wsp');
  if (!body) return;
  const items = Cart.get();

  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-vacio">
        <span class="cota-mini cota-mini--lg" aria-hidden="true"></span>
        <h3>Todavía no elegiste nada</h3>
        <p>Empezá por los más pedidos o armá tu cortina en tres toques y te decimos cuál conviene.</p>
        <a class="btn btn--primary btn--wide" href="#elegidos" data-cerrar-drawer>Ver los más pedidos</a>
        <a class="drawer-link" href="#armala" data-cerrar-drawer>Armala en tres toques</a>
      </div>`;
    foot.hidden = true;
    body.querySelectorAll('[data-cerrar-drawer]').forEach(a => a.addEventListener('click', cerrarDrawer));
    return;
  }

  foot.hidden = false;
  body.innerHTML = items.map((i, idx) => {
    const p = getProducto(i.id);
    if (!p) return '';
    const key = `${p.id}|${i.medida}`;
    return `
      <div class="drawer-item enter" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <div class="drawer-media">${mediaHTML(p)}</div>
        <div>
          <p class="drawer-nom">${esc(p.nombre)}</p>
          <p class="drawer-var">${esc(i.medida)}</p>
          <div class="drawer-row">
            <div class="stepper">
              <button type="button" data-menos="${esc(key)}" aria-label="Quitar uno">−</button>
              <span>${i.qty}</span>
              <button type="button" data-mas="${esc(key)}" aria-label="Agregar uno">+</button>
            </div>
            <strong>${formatearPrecio(precioMedida(p, i.medida) * i.qty)}</strong>
          </div>
          <button type="button" class="drawer-del" data-del="${esc(key)}">Quitar</button>
        </div>
      </div>`;
  }).join('');

  totalEl.textContent = formatearPrecio(Cart.total());
  if (wsp) wsp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajePedido(items))}`;

  const split = s => { const i = s.indexOf('|'); return [s.slice(0, i), s.slice(i + 1)]; };
  body.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => {
    const [id, medida] = split(b.dataset.menos);
    const it = Cart.get().find(x => x.id === id && x.medida === medida);
    if (it && it.qty <= 1) Cart.remove(id, medida); else Cart.setQty(id, medida, (it?.qty || 1) - 1);
  }));
  body.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => {
    const [id, medida] = split(b.dataset.mas);
    const it = Cart.get().find(x => x.id === id && x.medida === medida);
    Cart.setQty(id, medida, (it?.qty || 1) + 1);
  }));
  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const [id, medida] = split(b.dataset.del);
    Cart.remove(id, medida);
  }));
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d) return;
  drawerPrev = document.activeElement;
  renderDrawer();
  bd.hidden = false; d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { bd.classList.add('open'); d.classList.add('open'); });
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 380);
  drawerPrev?.focus?.();
}

function initDrawer() {
  document.getElementById('cart-btn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('checkout')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => {
    if (!document.getElementById('drawer')?.hidden) renderDrawer();
  });
}

const biSel = { amb: '', luz: '', motor: '' };
const BI_LUZ = { nada: 'Nada de luz', poca: 'Un poco, filtrada', difusa: 'Toda, con privacidad' };
const BI_MOTOR = { si: 'Con motor', no: 'Sin motor' };

function biPuntaje(p) {
  let n = 0;
  if (biSel.amb) {
    if (biSel.amb === 'exterior') n += p.cat === 'toldos' ? 4 : (p.perfil.amb.includes('exterior') ? 1 : -3);
    else n += p.perfil.amb.includes(biSel.amb) ? 2 : -1;
    if (biSel.amb !== 'exterior' && p.cat === 'toldos') n -= 3;
  }
  if (biSel.luz) n += p.luz === biSel.luz ? 3 : (p.luz === 'exterior' || p.luz === 'servicio' ? 0 : -1);
  if (biSel.motor === 'si') n += p.motor ? 3 : -2;
  if (biSel.motor === 'no') n += p.motor ? -3 : 1;
  if (esServicio(p)) n -= 2;
  if (p.destacado) n += .5;
  return n;
}

function biRender() {
  const out = document.getElementById('bi-out');
  const mas = document.getElementById('bi-mas');
  const resumen = document.getElementById('bi-resumen');
  if (!out) return;
  const elegidos = [...PRODUCTOS]
    .map(p => ({ p, n: biPuntaje(p) }))
    .sort((a, b) => b.n - a.n || precioFinal(a.p) - precioFinal(b.p))
    .slice(0, 3);
  const razones = [biSel.amb && AMBIENTES[biSel.amb], biSel.luz && BI_LUZ[biSel.luz], biSel.motor && BI_MOTOR[biSel.motor]].filter(Boolean);
  const previos = new Map([...out.querySelectorAll('[data-bi-id]')].map(el => [el.dataset.biId, el.getBoundingClientRect()]));

  out.innerHTML = elegidos.map(({ p }, i) => `
    <article class="bi-card" data-bi-id="${p.id}" data-id="${p.id}">
      <span class="bi-rank">0${i + 1}</span>
      <button type="button" class="bi-media" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${mediaHTML(p)}</button>
      <div class="bi-body">
        <p class="prod-cat">${esc(catNombre(p.cat))}</p>
        <h3 class="bi-nom"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
        <p class="bi-por">${razones.length ? `Elegido por: ${esc(razones.join(' · '))}` : 'Lo más pedido en La Plata'}</p>
        <div class="bi-row">
          <strong>${formatearPrecio(precioFinal(p))}</strong>
          <button type="button" class="btn btn--dark btn--sm" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>`).join('');
  bindCards(out);

  if (resumen) resumen.textContent = razones.length ? razones.join(' · ') : 'Tocá una opción y la selección cambia al instante';
  if (mas) {
    const top = elegidos[0]?.p;
    const partes = [];
    if (top) partes.push(`cat:${top.cat}`);
    if (biSel.luz && top && top.luz === biSel.luz) partes.push(`luz:${biSel.luz}`);
    if (biSel.motor === 'si' && top && top.motor) partes.push('motor:si');
    mas.dataset.gotoFiltro = partes.join(',');
  }

  const ventana = document.getElementById('bi-ventana');
  if (ventana) {
    ventana.dataset.luz = biSel.luz || 'inicio';
    ventana.dataset.amb = biSel.amb || 'living';
    ventana.dataset.motor = biSel.motor || '';
    const lbl = ventana.querySelector('[data-ventana-lbl]');
    if (lbl) lbl.textContent = biSel.luz ? BI_LUZ[biSel.luz] : 'Elegí cuánta luz querés';
  }

  if (reduceMotion) return;
  out.querySelectorAll('[data-bi-id]').forEach(el => {
    const antes = previos.get(el.dataset.biId);
    if (!antes) { el.animate([{ opacity: 0, transform: 'translateY(14px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(0.23,1,0.32,1)' }); return; }
    const ahora = el.getBoundingClientRect();
    const dx = antes.left - ahora.left, dy = antes.top - ahora.top;
    if (!dx && !dy) return;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(0.23,1,0.32,1)' });
  });
}

function initBloqueInteractivo() {
  const cont = document.getElementById('armala');
  if (!cont) return;
  cont.querySelectorAll('.bi-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.bi-q'), key = q.dataset.key;
    const ya = biSel[key] === chip.dataset.val;
    q.querySelectorAll('.bi-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (ya) biSel[key] = ''; else { biSel[key] = chip.dataset.val; chip.setAttribute('aria-pressed', 'true'); }
    biRender();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
  biRender();
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (reduceMotion || !('IntersectionObserver' in window)) { nuevos.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  nuevos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 8) * 0.07, 0.5)}s`;
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) requestAnimationFrame(() => el.classList.add('in'));
    else io.observe(el);
  });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const pano = hero.querySelector('.hero-pano');
  const capas = [...hero.querySelectorAll('[data-hero]')];
  const listo = () => hero.classList.add('is-ready');

  if (reduceMotion || typeof gsap === 'undefined') {
    listo();
    capas.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    if (pano) pano.style.clipPath = 'none';
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: .1, onComplete: listo });
  tl.fromTo(hero.querySelector('.hero-tube'), { scaleX: 0 }, { scaleX: 1, duration: .7, transformOrigin: 'left center' }, 0);
  if (pano) tl.fromTo(pano, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'power3.inOut' }, .35);
  tl.fromTo(hero.querySelector('.hero-beam'), { opacity: 0 }, { opacity: 1, duration: 1.2 }, .8);
  tl.fromTo(hero.querySelectorAll('.hero-spine, .hero-kicker'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, stagger: .08 }, .25);
  tl.fromTo(hero.querySelectorAll('.hero-h1 .l'), { clipPath: 'inset(0 0 100% 0)', y: 18 }, { clipPath: 'inset(0 0 -10% 0)', y: 0, duration: .9, stagger: .1 }, .45);
  tl.fromTo(hero.querySelector('.hero-sub'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8 }, .85);
  tl.fromTo(hero.querySelectorAll('.hero-ctas > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7, stagger: .1 }, 1);
  tl.fromTo(hero.querySelectorAll('.cota'), { opacity: 0 }, { opacity: 1, duration: .6, stagger: .1 }, 1.2);
  tl.fromTo(hero.querySelectorAll('.swatch'), { opacity: 0, y: 20, rotate: -6 }, { opacity: 1, y: 0, rotate: 0, duration: .7, stagger: .09, ease: 'back.out(1.6)' }, 1.25);

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const beam = hero.querySelector('.hero-beam');
  if (fine && beam) {
    const qx = gsap.quickTo(beam, 'xPercent', { duration: .9, ease: 'power2.out' });
    const qy = gsap.quickTo(beam, 'yPercent', { duration: .9, ease: 'power2.out' });
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      qx(nx * 6); qy(ny * 6);
    });
  }

  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('.hero-pano img');
    if (foto) gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amt = parseFloat(el.dataset.parallax) || 6;
    gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initGlobales() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal')?.hidden) { cerrarModal(); return; }
    if (!document.getElementById('drawer')?.hidden) { cerrarDrawer(); }
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-goto-filtro')) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const dest = document.getElementById(id);
    if (!dest) return;
    e.preventDefault();
    window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 12, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const modal = document.getElementById('modal');
  const drawer = document.getElementById('drawer');
  const trap = cont => e => {
    if (e.key !== 'Tab' || cont.hidden) return;
    const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  if (modal) document.addEventListener('keydown', trap(modal));
  if (drawer) document.addEventListener('keydown', trap(drawer));

  document.querySelectorAll('details.medir-item').forEach(d => {
    d.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
  });
}

initCategorias();
initRail();
initCatalogo();
initBloqueInteractivo();
initReveals();
initHero();
initParallax();
initNav();
initRailControles();
initModal();
initDrawer();
initFloats();
initFiltroLinks();
initWspLinks();
initLeeScroll();
initGlobales();
updateCartBadge();
