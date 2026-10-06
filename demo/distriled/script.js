const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493765231897';
const ES_M2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FOTOS = {
  mesa: { src: 'images/mesa-repuestos-16x9.webp', w: 1672, h: 941 },
  aux: { src: 'images/iluminacion-auxiliar-9x16.webp', w: 941, h: 1672 },
  led: { src: 'images/lamparas-led.webp', w: 1254, h: 1254 },
  enc: { src: 'images/encendido-bobinas-bujias.webp', w: 1254, h: 1254 },
  iny: { src: 'images/inyeccion-electricos.webp', w: 1254, h: 1254 },
  arr: { src: 'images/arranque-alternador.webp', w: 1254, h: 1254 }
};

const SIS = {
  iluminacion: { n: 'Iluminación', corto: 'Iluminación', estrella: 'led-h4-a5' },
  encendido: { n: 'Encendido', corto: 'Encendido', estrella: 'bobina-etios' },
  inyeccion: { n: 'Inyección y eléctricos', corto: 'Inyección', estrella: 'mini-rele-70' },
  arranque: { n: 'Arranque y alternador', corto: 'Arranque', estrella: 'regulador-voltaje' }
};

const ENCASTRES = {
  H4: { n: 'H4', d: 'Doble filamento: baja y alta en una sola lámpara', corto: 'baja y alta' },
  H7: { n: 'H7', d: 'Baja o alta en faros de lupa o parábola', corto: 'baja o alta' },
  H11: { n: 'H11', d: 'Antiniebla y baja en autos nuevos', corto: 'antiniebla / baja' },
  HB3: { n: 'HB3', alias: '9005', d: '9005: luz alta', corto: 'luz alta' },
  HB4: { n: 'HB4', alias: '9006', d: '9006: baja o antiniebla', corto: 'baja / antiniebla' },
  H1: { n: 'H1', d: 'Una patita: alta y faros auxiliares', corto: 'alta / auxiliar' },
  H3: { n: 'H3', d: 'Con cable: antiniebla y auxiliares', corto: 'antiniebla' },
  H8: { n: 'H8', d: 'Antiniebla en autos nuevos', corto: 'antiniebla' },
  H16: { n: 'H16', d: 'Antiniebla de baja potencia', corto: 'antiniebla' },
  H27: { n: 'H27', alias: '880 / 881', d: '880 / 881: antiniebla', corto: 'antiniebla' },
  W5W: { n: 'T10', alias: 'W5W', d: 'W5W: posición, patente y salón', corto: 'posición' },
  C5W: { n: 'Festón 36', alias: 'C5W', d: 'C5W: salón y patente', corto: 'salón' },
  W16W: { n: 'T15', alias: 'W16W', d: 'W16W: marcha atrás', corto: 'marcha atrás' }
};
const ENC_RAPIDOS = ['H4', 'H7', 'H11', 'HB3', 'W5W'];
const TECS = { led: 'LED', halogena: 'Halógena' };
const PRECIOS = {
  p1: { t: 'Hasta $20.000', r: [0, 20000] },
  p2: { t: '$20.000 a $60.000', r: [20001, 60000] },
  p3: { t: '$60.000 a $150.000', r: [60001, 150000] },
  p4: { t: 'Más de $150.000', r: [150001, Infinity] }
};
const POSICIONES = [
  ['baja', 'Luz baja', 'faro principal'],
  ['alta', 'Luz alta', 'faro principal'],
  ['niebla', 'Antiniebla', 'en el paragolpes'],
  ['posicion', 'Posición', 'faro, luz chica']
];

const VEHICULOS = [
  { id: 'gol-08', marca: 'Volkswagen', modelo: 'Gol Trend', anios: '2008 a 2013', version: 'Óptica simple, la más común', nota: 'Orientativo: con óptica doble lleva H7 en la baja y H1 en la alta. Si tenés la lámpara vieja, el código está impreso en la base.', luces: { baja: 'H4', alta: 'H4', niebla: 'HB4', posicion: 'W5W' } },
  { id: 'gol-13', marca: 'Volkswagen', modelo: 'Gol Trend', anios: '2013 a 2022', version: 'Óptica simple, la más común', nota: 'Orientativo: con óptica doble lleva H7 en la baja y H1 en la alta, y hay antinieblas de reposición con otra lámpara. Si tenés la vieja, el código está en la base.', luces: { baja: 'H4', alta: 'H4', niebla: 'H8', posicion: 'W5W' } },
  { id: 'amarok-10', marca: 'Volkswagen', modelo: 'Amarok', anios: '2010 a 2016', version: 'Faros halógenos, sin luz diurna', luces: { baja: 'H7', alta: 'H1', niebla: 'HB4', posicion: 'W5W' } },
  { id: 'hilux-16', marca: 'Toyota', modelo: 'Hilux', anios: '2016 a 2020', version: 'DX, SR y SRV con faros halógenos', nota: 'Orientativo: la SRX y las versiones 2021 en adelante traen LED de fábrica en la baja; el antiniebla viene en SRV y SRX.', luces: { baja: 'H4', alta: 'H4', niebla: 'H16', posicion: 'W5W' } },
  { id: 'hilux-05', marca: 'Toyota', modelo: 'Hilux', anios: '2005 a 2015', version: 'Todas las versiones', luces: { baja: 'H4', alta: 'H4', niebla: 'HB4', posicion: 'W5W' } },
  { id: 'etios', marca: 'Toyota', modelo: 'Etios', anios: '2013 a 2022', version: 'Hatch, sedán y Cross', nota: 'Orientativo: hay antinieblas de reposición que usan otra lámpara. Si tenés la vieja, el código está impreso en la base.', luces: { baja: 'H4', alta: 'H4', niebla: 'H16', posicion: 'W5W' } },
  { id: 'ranger-12', marca: 'Ford', modelo: 'Ranger', anios: '2012 a 2016', version: 'Primera serie, todas las versiones', luces: { baja: 'H4', alta: 'H4', niebla: 'H11', posicion: 'W5W' } },
  { id: 'ecosport-13', marca: 'Ford', modelo: 'EcoSport', anios: '2013 a 2017', version: 'Antes del restyling', luces: { baja: 'H4', alta: 'H4', niebla: 'H11', posicion: 'W5W' } },
  { id: 'fiesta-kd', marca: 'Ford', modelo: 'Fiesta Kinetic', anios: '2011 a 2019', version: 'Hatch y sedán', nota: 'Orientativo: algunas de las primeras unidades importadas de México llevan otra lámpara en la baja. Confirmalo con la vieja o por WhatsApp.', luces: { baja: 'H7', alta: 'H1', niebla: 'H11', posicion: 'W5W' } },
  { id: 'onix-13', marca: 'Chevrolet', modelo: 'Onix', anios: '2013 a 2019', version: 'Primera generación, también Prisma y Joy', luces: { baja: 'H4', alta: 'H4', niebla: 'H27', posicion: 'W5W' } },
  { id: 'classic', marca: 'Chevrolet', modelo: 'Classic', anios: '2010 a 2016', version: 'Corsa Classic y Classic', luces: { baja: 'H4', alta: 'H4', niebla: 'H3', posicion: 'W5W' } },
  { id: 'cronos', marca: 'Fiat', modelo: 'Cronos', anios: '2018 a 2025', version: 'Antes del restyling', nota: 'Orientativo: en la versión Precision la luz de posición es LED fija. Si tenés la lámpara vieja, el código está impreso en la base.', luces: { baja: 'H7', alta: 'H7', niebla: 'H8', posicion: 'W5W' } },
  { id: 'p208', marca: 'Peugeot', modelo: '208', anios: '2013 a 2020', version: 'Primera generación, faros halógenos', nota: 'Orientativo: en algunas unidades la alta es H1. Confirmalo con la lámpara vieja o por WhatsApp.', luces: { baja: 'H7', alta: 'H7', niebla: 'H11', posicion: 'W5W' } },
  { id: 'sandero-14', marca: 'Renault', modelo: 'Sandero y Logan', anios: '2014 a 2019', version: 'Antes del restyling, también Stepway', luces: { baja: 'H7', alta: 'H1', niebla: 'H16', posicion: 'W5W' } },
  { id: 'sandero-20', marca: 'Renault', modelo: 'Sandero y Logan', anios: '2020 en adelante', version: 'Restyling, también Stepway', nota: 'Orientativo: la luz de posición es LED de fábrica. Si tenés la lámpara vieja, el código está impreso en la base.', luces: { baja: 'H7', alta: 'H7', niebla: 'H16' } }
];

const PRODUCTOS = [
  { id: 'led-h4-a5', sis: 'iluminacion', canbus: true, tipo: 'Kit LED', nombre: 'Kit LED H4 Luxled A5 CSP Canbus 45 W', marca: 'Luxled', cod: 'DL-1104', enc: 'H4', tec: 'led', unidad: 'par', precio: 51500, descuento: 0, stock: 18, rank: 1, top: true,
    meta: '45 W · 6000 K · Canbus incorporado', foto: 'led', foco: [0.27, 0.4, 1.7], alt: 'Lámpara LED H4 con chip CSP y disipador de aletas',
    desc: 'Dos lámparas LED H4 con chip CSP y Canbus incorporado, para que el tablero no marque falla. Reemplazan a la halógena H4 sin cortar cables: se enchufan en la misma ficha.',
    datos: [['Encastre', 'H4 (baja y alta)'], ['Potencia', '45 W por lámpara'], ['Color', '6000 K, blanco frío'], ['Canbus', 'Incorporado'], ['Tensión', '12 V'], ['Viene', '2 lámparas']], tags: ['cree', 'faro', 'luz baja', 'luz alta'] },
  { id: 'bobina-etios', sis: 'encendido', tipo: 'Bobina', nombre: 'Bobina de encendido tipo lápiz Toyota Etios 1.5', marca: 'Hellux', cod: 'DL-2011', unidad: 'cu', precio: 38900, descuento: 0, stock: 9, rank: 2, top: true,
    compat: ['etios'], compatTxt: 'motor 1.5 16v', foto: 'enc', foco: [0.15, 0.37, 1.55], alt: 'Bobina de encendido tipo lápiz negra',
    desc: 'Bobina individual tipo lápiz: va una por cilindro, encima de cada bujía. Si el motor tironea o falla en un cilindro, suele ser la primera sospechosa.',
    datos: [['Tipo', 'Lápiz, una por cilindro'], ['Motor', '1.5 16v'], ['Ficha', '3 pines'], ['Se vende', 'Por unidad']], tags: ['bobina lapiz', 'encendido'] },
  { id: 'mini-rele-70', sis: 'inyeccion', tipo: 'Relé', nombre: 'Mini relé 12 V 70 A de 5 patas', marca: 'Ralux', cod: 'DL-3021', unidad: 'cu', precio: 7900, descuento: 0, stock: 40, rank: 3, top: true,
    meta: 'Para electro, bomba, faros y auxiliares', foto: 'iny', foco: [0.44, 0.79, 3.2], alt: 'Mini relé negro de cinco patas',
    desc: 'Mini relé de 5 patas, 12 V y 70 A, para comandar electroventilador, bomba de nafta, faros o auxiliares sin quemar la tecla. Entra en la ficha de mini relé estándar.',
    datos: [['Tensión', '12 V'], ['Corriente', '70 A'], ['Patas', '5 (inversor)'], ['Formato', 'Mini relé']], tags: ['rele', 'relay', 'relevador'] },
  { id: 'led-h7-a5', sis: 'iluminacion', canbus: true, tipo: 'Kit LED', nombre: 'Kit LED H7 Luxled A5 CSP Canbus 45 W', marca: 'Luxled', cod: 'DL-1107', enc: 'H7', tec: 'led', unidad: 'par', precio: 51500, descuento: 0, stock: 12, rank: 4,
    meta: '45 W · 6000 K · Canbus incorporado', foto: 'led', foco: [0.5, 0.47, 1.7], alt: 'Lámpara LED con chip CSP y disipador de aletas',
    desc: 'Dos lámparas LED H7 con chip CSP y Canbus incorporado. Para faros de baja o alta con encastre H7; algunos autos necesitan un adaptador de base, consultanos el modelo.',
    datos: [['Encastre', 'H7'], ['Potencia', '45 W por lámpara'], ['Color', '6000 K, blanco frío'], ['Canbus', 'Incorporado'], ['Tensión', '12 V'], ['Viene', '2 lámparas']], tags: ['cree', 'faro', 'luz baja'] },
  { id: 'regulador-voltaje', sis: 'arranque', tipo: 'Regulador', nombre: 'Regulador de voltaje de alternador con porta carbones', marca: 'Indiel', cod: 'DL-4031', unidad: 'cu', precio: 32500, descuento: 0, stock: 11, rank: 5, top: true,
    meta: 'Para alternadores Bosch de 12 V', compatTxt: 'alternadores Bosch de 12 V de autos y utilitarios', foto: 'arr', foco: [0.64, 0.79, 3.0], alt: 'Regulador de voltaje negro con porta carbones',
    desc: 'Regulador de voltaje con porta carbones incluido. Si la luz de batería se prende con el motor en marcha o la carga pasa de 14,5 V, revisalo antes de cambiar el alternador.',
    datos: [['Tensión', '12 V'], ['Incluye', 'Porta carbones'], ['Para', 'Alternador Bosch'], ['Se vende', 'Por unidad']], tags: ['regulador', 'alternador', 'carga'] },
  { id: 'barra-led-72', sis: 'iluminacion', tipo: 'Barra LED', nombre: 'Barra de 24 LED 72 W con soportes', marca: 'Luxled', cod: 'DL-1201', unidad: 'cu', precio: 44000, descuento: 10, stock: 6, rank: 6, top: true,
    meta: '72 W · 12/24 V · 30,2 cm de largo', foto: 'aux', foco: [0.33, 0.355, 1.35], alt: 'Barra de LED larga con carcasa de aluminio negra',
    desc: 'Barra de 24 LED de 72 W para camioneta, 4x4 o máquina, con carcasa de aluminio y soportes laterales. Funciona en 12 y 24 V; conviene instalarla con relé y fusible.',
    datos: [['Potencia', '72 W'], ['LED', '24'], ['Tensión', '12 / 24 V'], ['Largo', '30,2 cm']], tags: ['barra', 'auxiliar', '4x4', 'camioneta', 'faro auxiliar'] },
  { id: 'bujias-iridio-x4', sis: 'encendido', tipo: 'Bujías', nombre: 'Juego de 4 bujías de iridio', marca: 'NGK', cod: 'DL-2021', unidad: 'juego', precio: 64900, descuento: 0, stock: 8, rank: 7,
    meta: 'Iridio · medida según el motor', compatTxt: 'consultá la medida exacta por motor', foto: 'enc', foco: [0.56, 0.74, 1.6], alt: 'Cuatro bujías con aislante blanco y rosca metálica',
    desc: 'Juego de 4 bujías de iridio, de mayor duración que las de cobre. La medida cambia según el motor: pasanos el modelo y la cilindrada y te confirmamos el código.',
    datos: [['Electrodo', 'Iridio'], ['Viene', '4 bujías'], ['Medida', 'Según motor'], ['Duración', 'Mayor que cobre']], tags: ['bujia', 'buji', 'iridium'] },
  { id: 'inyector-gol', sis: 'inyeccion', tipo: 'Inyector', nombre: 'Inyector Bosch VW Gol Trend / Fox / Suran 1.6', marca: 'Bosch', cod: 'DL-3001', unidad: 'cu', precio: 45900, descuento: 0, stock: 10, rank: 8,
    compat: ['gol-08', 'gol-13'], compatTxt: 'motor 1.6 8v · código Bosch 0280156399', foto: 'iny', foco: [0.15, 0.27, 2.6], alt: 'Inyector de nafta con cuerpo metálico y ficha negra',
    desc: 'Inyector de nafta multipunto Bosch 0280156399 para Gol Trend, Fox y Suran 1.6. Si el motor tironea en frío o un cilindro no quema parejo, puede estar trabado.',
    datos: [['Código', 'Bosch 0280156399'], ['Tipo', 'Multipunto'], ['Motor', '1.6 8v'], ['Se vende', 'Por unidad']], tags: ['inyector', 'inyeccion', 'pico', 'fox', 'suran'] },
  { id: 'burro-gol', sis: 'arranque', tipo: 'Burro', nombre: 'Burro de arranque VW Gol Trend / Voyage 1.6', marca: 'Partson', cod: 'DL-4001', unidad: 'cu', precio: 174900, descuento: 0, stock: 3, rank: 9,
    compat: ['gol-08', 'gol-13'], compatTxt: 'motor 1.6 8v', foto: 'arr', foco: [0.26, 0.39, 1.9], alt: 'Burro de arranque plateado y negro con automático',
    desc: 'Motor de arranque nuevo con automático incorporado. Si al girar la llave se escucha un clic y no gira, o gira lento con la batería cargada, puede ser el burro.',
    datos: [['Tensión', '12 V'], ['Incluye', 'Automático'], ['Motor', '1.6 8v'], ['Estado', 'Nuevo']], tags: ['burro', 'motor de arranque', 'arranque', 'voyage'] },
  { id: 'hal-h4-philips', sis: 'iluminacion', tipo: 'Halógena', nombre: 'Lámpara halógena H4 Philips 60/55 W', marca: 'Philips', cod: 'DL-1004', enc: 'H4', tec: 'halogena', unidad: 'cu', precio: 6500, descuento: 0, stock: 30, rank: 10, watts: '60/55 W',
    meta: '12 V · 60/55 W · reemplazo original', foto: null, alt: 'Lámpara halógena H4 Philips',
    desc: 'Lámpara halógena H4 de reemplazo original: baja y alta en una sola lámpara. Si la de un lado se quemó, conviene cambiar las dos para que alumbren igual.',
    datos: [['Encastre', 'H4 (P43t)'], ['Potencia', '60/55 W'], ['Flujo', '1650 / 1000 lm'], ['Tensión', '12 V']], tags: ['halogena', 'lampara comun', 'faro'] },
  { id: 'led-h11-a5', sis: 'iluminacion', canbus: true, tipo: 'Kit LED', nombre: 'Kit LED H11 Luxled A5 CSP Canbus 45 W', marca: 'Luxled', cod: 'DL-1111', enc: 'H11', tec: 'led', unidad: 'par', precio: 51500, descuento: 0, stock: 14, rank: 11,
    meta: '45 W · 6000 K · antiniebla o baja', foto: 'mesa', foco: [0.17, 0.66, 3.0], alt: 'Par de lámparas LED con disipador y ficha',
    desc: 'Dos lámparas LED H11 con chip CSP y Canbus incorporado, para antiniebla o luz baja. Encastre H11 con traba de giro: entran en la misma ficha que la halógena.',
    datos: [['Encastre', 'H11'], ['Potencia', '45 W por lámpara'], ['Color', '6000 K, blanco frío'], ['Canbus', 'Incorporado'], ['Viene', '2 lámparas']], tags: ['cree', 'antiniebla', 'rompeniebla'] },
  { id: 'caudalimetro', sis: 'inyeccion', tipo: 'Caudalímetro', nombre: 'Caudalímetro (sensor MAF) con cuerpo', marca: 'Bosch', cod: 'DL-3011', unidad: 'cu', precio: 98500, descuento: 0, stock: 4, rank: 12,
    meta: 'Sensor de masa de aire · ficha 5 pines', compatTxt: 'consultá por marca, modelo y motor', foto: 'iny', foco: [0.82, 0.22, 2.2], alt: 'Caudalímetro negro con malla y ficha de cinco pines',
    desc: 'Sensor de masa de aire con cuerpo. Un caudalímetro sucio o roto hace que el auto tironee, consuma de más o entre en modo de emergencia.',
    datos: [['Tipo', 'Hilo caliente (MAF)'], ['Ficha', '5 pines'], ['Incluye', 'Cuerpo'], ['Se vende', 'Por unidad']], tags: ['maf', 'caudalimetro', 'sensor de aire'] },
  { id: 'alternador-gol', sis: 'arranque', tipo: 'Alternador', nombre: 'Alternador 90 A VW Gol Trend / Voyage 1.6', marca: 'Partson', cod: 'DL-4011', unidad: 'cu', precio: 329900, descuento: 0, stock: 2, rank: 13,
    compat: ['gol-08', 'gol-13'], compatTxt: 'motor 1.6 8v', foto: 'arr', foco: [0.73, 0.36, 1.85], alt: 'Alternador con polea de correa poly-V',
    desc: 'Alternador nuevo de 90 A con regulador y polea. Si la batería se descarga andando o la luz de carga queda prendida, medí la carga antes: tiene que dar entre 13,8 y 14,5 V.',
    datos: [['Corriente', '90 A'], ['Tensión', '12 V'], ['Polea', 'Poly-V 6 canales'], ['Motor', '1.6 8v']], tags: ['alternador', 'dinamo', 'carga', 'voyage'] },
  { id: 'led-hb3-c6', sis: 'iluminacion', tipo: 'Kit LED', nombre: 'Kit LED HB3 (9005) Luxled C6', marca: 'Luxled', cod: 'DL-1105', enc: 'HB3', tec: 'led', unidad: 'par', precio: 16900, descuento: 0, stock: 10, rank: 14,
    meta: '18 W · 6000 K · luz alta', foto: 'aux', foco: [0.53, 0.565, 1.9], alt: 'Par de lámparas LED con disipador de aletas plateado',
    desc: 'Par de lámparas LED HB3 (9005) compactas para luz alta. Algunos autos necesitan decodificador Canbus para que no aparezca la falla en el tablero.',
    datos: [['Encastre', 'HB3 (9005)'], ['Potencia', '18 W por lámpara'], ['Color', '6000 K'], ['Canbus', 'Según auto (decodificador aparte)'], ['Viene', '2 lámparas']], tags: ['9005', 'hb3', 'luz alta', 'cree'] },
  { id: 'faro-aux-cuadrado', sis: 'iluminacion', tipo: 'Faro auxiliar', nombre: 'Faro auxiliar cuadrado de 4 LED 40 W', marca: 'Kobo', cod: 'DL-1211', unidad: 'cu', precio: 17500, descuento: 0, stock: 14, rank: 15,
    meta: '40 W · 12/24 V · haz concentrado', foto: 'aux', foco: [0.16, 0.505, 2.4], alt: 'Faro auxiliar cuadrado negro con cuatro LED',
    desc: 'Faro auxiliar de 4 LED con lupa, carcasa de aluminio y soporte de acero. Haz concentrado para alumbrar lejos en ruta o campo.',
    datos: [['Potencia', '40 W'], ['LED', '4 con lupa'], ['Tensión', '12 / 24 V'], ['Se vende', 'Por unidad']], tags: ['auxiliar', 'faro', 'camioneta', '4x4'] },
  { id: 'sensor-temp', sis: 'inyeccion', tipo: 'Sensor', nombre: 'Sensor de temperatura de agua (bulbo) 2 pines', marca: 'Fispa', cod: 'DL-3031', unidad: 'cu', precio: 12900, descuento: 0, stock: 15, rank: 16,
    meta: 'Bulbo de bronce · ficha 2 pines', compatTxt: 'consultá por motor', foto: 'iny', foco: [0.87, 0.55, 3.0], alt: 'Sensor de temperatura con rosca de bronce y ficha gris',
    desc: 'Sensor de temperatura del refrigerante. Si el electro no arranca, la aguja no sube o el motor consume de más en frío, puede ser el bulbo.',
    datos: [['Rosca', 'Bronce'], ['Ficha', '2 pines'], ['Mide', 'Temperatura del agua'], ['Se vende', 'Por unidad']], tags: ['bulbo', 'temperatura', 'sensor'] },
  { id: 'puente-diodos', sis: 'arranque', tipo: 'Puente de diodos', nombre: 'Puente de diodos para alternador', marca: 'Nosso', cod: 'DL-4021', unidad: 'cu', precio: 38900, descuento: 0, stock: 8, rank: 17,
    meta: 'Rectificador · alternadores Bosch', compatTxt: 'alternadores Bosch de 70 a 90 A', foto: 'arr', foco: [0.21, 0.7, 3.0], alt: 'Puente de diodos rectificador de alternador',
    desc: 'Rectificador de alternador. Un diodo abierto deja al alternador cargando a medias: la batería se descarga de a poco aunque el auto ande todos los días.',
    datos: [['Tipo', 'Rectificador'], ['Para', 'Alternador Bosch'], ['Diodos', '6 + 3 auxiliares'], ['Se vende', 'Por unidad']], tags: ['diodos', 'rectificador', 'alternador'] },
  { id: 'led-t10', sis: 'iluminacion', canbus: true, tipo: 'LED señalización', nombre: 'LED T10 (W5W) Canbus blanco', marca: 'Kobo', cod: 'DL-1301', enc: 'W5W', tec: 'led', unidad: 'par', precio: 3900, descuento: 0, stock: 60, rank: 18, top: true,
    meta: 'Posición, patente y salón · Canbus', foto: 'led', foco: [0.66, 0.79, 2.4], alt: 'Par de lámparas LED chicas con chips SMD',
    desc: 'Par de LED T10 (W5W) con Canbus para luz de posición, patente o salón. Blanco frío, consumo mínimo y encastre directo.',
    datos: [['Encastre', 'T10 (W5W)'], ['Color', 'Blanco 6000 K'], ['Canbus', 'Sí'], ['Viene', '2 lámparas']], tags: ['t10', 'w5w', 'pellizco', 'posicion', 'patente'] },
  { id: 'kit-cableado-aux', sis: 'iluminacion', tipo: 'Cableado', nombre: 'Kit de cableado con relé, fusible y tecla para auxiliares', marca: 'Kobo', cod: 'DL-1221', unidad: 'kit', precio: 16900, descuento: 0, stock: 12, rank: 19,
    meta: 'Para 1 barra o 2 faros auxiliares', foto: 'aux', foco: [0.87, 0.6, 2.8], alt: 'Arnés de cables con fichas, relé y tecla',
    desc: 'Arnés listo para instalar una barra LED o dos faros auxiliares: relé de 40 A, fusible aéreo, tecla con luz y fichas. Sin empalmes ni cinta.',
    datos: [['Relé', '40 A'], ['Fusible', 'Aéreo incluido'], ['Tecla', 'Con luz testigo'], ['Para', '1 barra o 2 faros']], tags: ['arnes', 'cableado', 'instalacion', 'tecla'] },
  { id: 'bobina-lapiz-x4', sis: 'encendido', tipo: 'Bobinas', nombre: 'Juego de 4 bobinas tipo lápiz Toyota Etios 1.5', marca: 'Hellux', cod: 'DL-2012', unidad: 'juego', precio: 148000, descuento: 10, stock: 3, rank: 20,
    compat: ['etios'], compatTxt: 'motor 1.5 16v', foto: 'enc', foco: [0.5, 0.33, 1.3], alt: 'Cuatro bobinas de encendido tipo lápiz',
    desc: 'Las cuatro bobinas juntas para cambiar el juego completo. Conviene cuando ya fallaron una o dos y el auto tiene muchos kilómetros.',
    datos: [['Tipo', 'Lápiz'], ['Viene', '4 bobinas'], ['Motor', '1.5 16v'], ['Ficha', '3 pines']], tags: ['bobina lapiz', 'juego de bobinas'] },
  { id: 'rele-4-patas', sis: 'inyeccion', tipo: 'Relé', nombre: 'Relé 12 V 40 A de 4 patas con soporte', marca: 'DNI', cod: 'DL-3022', unidad: 'cu', precio: 5900, descuento: 0, stock: 50, rank: 21,
    meta: 'Normal abierto · con soporte', foto: 'iny', foco: [0.11, 0.72, 3.0], alt: 'Relé negro de cuatro patas',
    desc: 'Relé de 4 patas, normal abierto, 12 V y 40 A, con soporte para atornillar. El más usado para faros, auxiliares, bocinas y bomba.',
    datos: [['Tensión', '12 V'], ['Corriente', '40 A'], ['Patas', '4 (normal abierto)'], ['Soporte', 'Sí']], tags: ['rele', 'relay', 'relevador'] },
  { id: 'automatico-arranque', sis: 'arranque', tipo: 'Automático', nombre: 'Automático de arranque 12 V', marca: 'ZM', cod: 'DL-4041', unidad: 'cu', precio: 58900, descuento: 0, stock: 6, rank: 22,
    meta: 'Solenoide · burros Bosch', compatTxt: 'burros Bosch de autos nafteros', foto: 'arr', foco: [0.39, 0.79, 3.4], alt: 'Automático de arranque con bornes de cobre',
    desc: 'Solenoide del burro de arranque. El clásico «hace clic y no arranca» con la batería bien suele estar acá, y sale mucho menos que el burro entero.',
    datos: [['Tensión', '12 V'], ['Para', 'Burro Bosch'], ['Bornes', 'Cobre'], ['Se vende', 'Por unidad']], tags: ['automatico', 'solenoide', 'burro'] },
  { id: 'hal-h7-philips', sis: 'iluminacion', tipo: 'Halógena', nombre: 'Lámpara halógena H7 Philips 55 W', marca: 'Philips', cod: 'DL-1007', enc: 'H7', tec: 'halogena', unidad: 'cu', precio: 10900, descuento: 0, stock: 24, rank: 23, watts: '55 W',
    meta: '12 V · 55 W · reemplazo original', foto: null, alt: 'Lámpara halógena H7 Philips',
    desc: 'Lámpara halógena H7 de reemplazo original para baja o alta. Tocala con guantes o un trapo: la grasa de los dedos la acorta.',
    datos: [['Encastre', 'H7 (PX26d)'], ['Potencia', '55 W'], ['Flujo', '1500 lm'], ['Tensión', '12 V']], tags: ['halogena', 'lampara comun', 'faro'] },
  { id: 'modulo-encendido', sis: 'encendido', tipo: 'Módulo', nombre: 'Módulo de encendido electrónico', marca: 'Magneti Marelli', cod: 'DL-2041', unidad: 'cu', precio: 54900, descuento: 0, stock: 5, rank: 24, nuevo: true,
    meta: 'Según código del original', compatTxt: 'según modelo: pasanos el código del original', foto: 'mesa', foco: [0.86, 0.66, 2.4], alt: 'Módulo electrónico negro con fichas de conexión',
    desc: 'Módulo de encendido electrónico. Si el auto se apaga en caliente y no vuelve a arrancar hasta enfriarse, es un sospechoso clásico. Pasanos el código del original.',
    datos: [['Tipo', 'Electrónico'], ['Falla típica', 'Se apaga en caliente'], ['Compatibilidad', 'Por código'], ['Se vende', 'Por unidad']], tags: ['modulo', 'encendido'] },
  { id: 'faro-aux-redondo', sis: 'iluminacion', tipo: 'Faro auxiliar', nombre: 'Faro auxiliar redondo de 9 LED 27 W', marca: 'Luxled', cod: 'DL-1212', unidad: 'cu', precio: 17900, descuento: 0, stock: 9, rank: 25,
    meta: '27 W · 12/24 V · haz abierto', foto: 'aux', foco: [0.8, 0.44, 2.6], alt: 'Faro auxiliar redondo negro con nueve LED',
    desc: 'Faro auxiliar redondo de 9 LED con haz abierto, para iluminar a los costados del camino o trabajar de noche con la camioneta.',
    datos: [['Potencia', '27 W'], ['LED', '9'], ['Tensión', '12 / 24 V'], ['Haz', 'Abierto']], tags: ['auxiliar', 'faro', 'redondo'] },
  { id: 'ficha-6-vias', sis: 'inyeccion', tipo: 'Ficha', nombre: 'Ficha de 6 vías con cables (macho y hembra)', marca: 'Taxim', cod: 'DL-3041', unidad: 'par', precio: 8900, descuento: 0, stock: 22, rank: 26,
    meta: 'Con sellos · cables de 20 cm', foto: 'iny', foco: [0.77, 0.84, 2.4], alt: 'Fichas de seis vías con cables de colores',
    desc: 'Ficha sellada de 6 vías con cables de 20 cm, macho y hembra. Para reparar mazos sin empalmar a mano: un mal contacto es la falla más difícil de encontrar.',
    datos: [['Vías', '6'], ['Sellos', 'Sí'], ['Cables', '20 cm'], ['Viene', 'Macho y hembra']], tags: ['ficha', 'conector', 'mazo'] },
  { id: 'polea-alternador', sis: 'arranque', tipo: 'Polea', nombre: 'Polea de alternador de rueda libre', marca: 'INA', cod: 'DL-4051', unidad: 'cu', precio: 44900, descuento: 0, stock: 5, rank: 27,
    meta: 'Poly-V 6 canales', compatTxt: 'consultá por modelo de alternador', foto: 'arr', foco: [0.51, 0.62, 2.8], alt: 'Polea de alternador de rueda libre con canales',
    desc: 'Polea de rueda libre para alternador. Si la correa vibra o hace ruido en ralentí, la polea suele estar trabada.',
    datos: [['Tipo', 'Rueda libre'], ['Canales', '6'], ['Para', 'Alternador'], ['Se vende', 'Por unidad']], tags: ['polea', 'rueda libre'] },
  { id: 'hal-h11-osram', sis: 'iluminacion', tipo: 'Halógena', nombre: 'Lámpara halógena H11 Osram Original 55 W', marca: 'Osram', cod: 'DL-1011', enc: 'H11', tec: 'halogena', unidad: 'cu', precio: 36900, descuento: 0, stock: 6, rank: 28, watts: '55 W',
    meta: '12 V · 55 W · antiniebla o baja', foto: null, alt: 'Lámpara halógena H11 Osram',
    desc: 'Lámpara halógena H11 de reemplazo original, para antiniebla o luz baja según el auto.',
    datos: [['Encastre', 'H11 (PGJ19-2)'], ['Potencia', '55 W'], ['Flujo', '1350 lm'], ['Tensión', '12 V']], tags: ['halogena', 'antiniebla', 'rompeniebla'] },
  { id: 'led-hb4-smd', sis: 'iluminacion', tipo: 'Kit LED', nombre: 'LED HB4 (9006) SMD para antiniebla', marca: 'Iron Led', cod: 'DL-1106', enc: 'HB4', tec: 'led', unidad: 'par', precio: 17300, descuento: 0, stock: 8, rank: 29,
    meta: 'SMD · blanco · antiniebla', foto: 'led', foco: [0.77, 0.5, 1.8], alt: 'Par de lámparas LED con chips SMD y tapa transparente',
    desc: 'Par de LED HB4 (9006) de chips SMD para antiniebla. Para luz baja conviene un kit CSP.',
    datos: [['Encastre', 'HB4 (9006)'], ['Tipo', 'SMD'], ['Uso', 'Antiniebla'], ['Viene', '2 lámparas']], tags: ['9006', 'hb4', 'antiniebla'] },
  { id: 'bujia-cobre', sis: 'encendido', tipo: 'Bujía', nombre: 'Bujía de cobre (unidad)', marca: 'Bosch', cod: 'DL-2022', unidad: 'cu', precio: 6500, descuento: 0, stock: 80, rank: 30,
    meta: 'Cobre-níquel · según motor', compatTxt: 'consultá la medida por motor', foto: 'enc', foco: [0.35, 0.78, 2.2], alt: 'Bujía con aislante blanco y rosca metálica',
    desc: 'Bujía de cobre-níquel por unidad. Pasanos el motor y te decimos la medida; en autos con GNC conviene una de grado térmico más frío.',
    datos: [['Electrodo', 'Cobre-níquel'], ['Medida', 'Según motor'], ['Se vende', 'Por unidad']], tags: ['bujia', 'gnc'] },
  { id: 'sensor-ciguenal', sis: 'inyeccion', tipo: 'Sensor', nombre: 'Sensor de posición de cigüeñal (CKP)', marca: 'Hellux', cod: 'DL-3032', unidad: 'cu', precio: 24900, descuento: 0, stock: 7, rank: 31,
    meta: 'Inductivo · ficha 2 pines', compatTxt: 'consultá por marca y motor', foto: 'iny', foco: [0.63, 0.54, 2.8], alt: 'Sensor de cigüeñal negro con ficha y buje metálico',
    desc: 'Sensor de posición de cigüeñal. Sin su señal la computadora no sabe cuándo inyectar ni encender: el auto da arranque pero no arranca.',
    datos: [['Tipo', 'Inductivo'], ['Ficha', '2 pines'], ['Falla típica', 'Da arranque y no arranca'], ['Se vende', 'Por unidad']], tags: ['ckp', 'sensor', 'ciguenal'] },
  { id: 'carbones-alternador', sis: 'arranque', tipo: 'Carbones', nombre: 'Carbones de alternador (par)', marca: 'Indiel', cod: 'DL-4061', unidad: 'par', precio: 6900, descuento: 0, stock: 35, rank: 32,
    meta: 'Con cable trenzado y resorte', compatTxt: 'alternadores Bosch y Valeo de 12 V', foto: 'arr', foco: [0.87, 0.75, 3.4], alt: 'Carbones de alternador con cable de cobre trenzado',
    desc: 'Par de carbones con cable trenzado. Cuando se gastan, el alternador deja de cargar de a ratos: es el arreglo más barato de la carga.',
    datos: [['Viene', '2 carbones'], ['Cable', 'Cobre trenzado'], ['Para', 'Alternador 12 V'], ['Incluye', 'Resorte']], tags: ['carbones', 'escobillas'] },
  { id: 'led-h1-c6', sis: 'iluminacion', tipo: 'Kit LED', nombre: 'Kit LED H1 Luxled C6', marca: 'Luxled', cod: 'DL-1101', enc: 'H1', tec: 'led', unidad: 'par', precio: 17900, descuento: 0, stock: 0, rank: 33,
    meta: '18 W · 6000 K · alta o auxiliar', foto: 'mesa', foco: [0.17, 0.66, 3.0], alt: 'Par de lámparas LED con disipador',
    desc: 'Par de lámparas LED H1 compactas para luz alta o faros auxiliares con encastre H1.',
    datos: [['Encastre', 'H1'], ['Potencia', '18 W por lámpara'], ['Color', '6000 K'], ['Viene', '2 lámparas']], tags: ['h1', 'auxiliar', 'cree'] },
  { id: 'feston-36', sis: 'iluminacion', tipo: 'LED señalización', nombre: 'LED festón 36 mm (C5W) blanco', marca: 'Kobo', cod: 'DL-1302', enc: 'C5W', tec: 'led', unidad: 'par', precio: 3900, descuento: 0, stock: 45, rank: 34,
    meta: 'Salón y patente · 8 chips', foto: 'led', foco: [0.21, 0.73, 2.2], alt: 'Par de lámparas LED tipo festón con chips',
    desc: 'Par de LED tipo festón de 36 mm para luz de salón o patente. Más luz que la de filamento y casi sin consumo.',
    datos: [['Encastre', 'Festón 36 mm (C5W)'], ['Chips', '8'], ['Color', 'Blanco'], ['Viene', '2 lámparas']], tags: ['feston', 'c5w', 'salon', 'patente'] },
  { id: 'sensor-presion-aceite', sis: 'inyeccion', tipo: 'Sensor', nombre: 'Sensor de presión de aceite', marca: 'Fispa', cod: 'DL-3033', unidad: 'cu', precio: 15900, descuento: 0, stock: 9, rank: 35,
    meta: 'Rosca M14 · ficha 3 pines', compatTxt: 'consultá por motor', foto: 'iny', foco: [0.16, 0.49, 2.8], alt: 'Sensor de presión con cuerpo hexagonal y ficha negra',
    desc: 'Sensor de presión de aceite. Si la luz de aceite titila en ralentí con el nivel bien, revisá primero el sensor.',
    datos: [['Rosca', 'M14'], ['Ficha', '3 pines'], ['Se vende', 'Por unidad']], tags: ['sensor', 'aceite', 'presion'] },
  { id: 'led-h8-h16', sis: 'iluminacion', canbus: true, tipo: 'Kit LED', nombre: 'Kit LED antiniebla H8 / H16 CSP Canbus', marca: 'Luxled', cod: 'DL-1116', enc: 'H8', encs: ['H8', 'H16'], tec: 'led', unidad: 'par', precio: 39900, descuento: 0, stock: 7, rank: 36, nuevo: true,
    meta: 'Para antiniebla · 6000 K · Canbus', foto: 'led', foco: [0.27, 0.4, 2.2], alt: 'Lámpara LED con chip CSP para antiniebla',
    desc: 'Par de lámparas LED para antiniebla con encastre H8 o H16, con chip CSP y Canbus. Antes de pedir, confirmá el código impreso en la lámpara vieja.',
    datos: [['Encastre', 'H8 o H16'], ['Uso', 'Antiniebla'], ['Color', '6000 K'], ['Canbus', 'Incorporado'], ['Viene', '2 lámparas']], tags: ['h8', 'h16', 'antiniebla', 'rompeniebla'] },
  { id: 'polea-tensora', sis: 'arranque', tipo: 'Polea', nombre: 'Polea tensora de correa de accesorios', marca: 'INA', cod: 'DL-4052', unidad: 'cu', precio: 26900, descuento: 0, stock: 4, rank: 37,
    meta: 'Con rulemán sellado', compatTxt: 'consultá por motor', foto: 'arr', foco: [0.77, 0.66, 3.2], alt: 'Polea tensora negra con rulemán',
    desc: 'Polea tensora con rulemán sellado para la correa de accesorios. Si chilla en frío, cambiala junto con la correa.',
    datos: [['Rulemán', 'Sellado'], ['Para', 'Correa poly-V'], ['Se vende', 'Por unidad']], tags: ['tensor', 'polea', 'correa'] },
  { id: 'rele-5-patas', sis: 'inyeccion', tipo: 'Relé', nombre: 'Relé inversor 12 V 30/40 A de 5 patas', marca: 'DNI', cod: 'DL-3023', unidad: 'cu', precio: 5500, descuento: 0, stock: 30, rank: 38,
    meta: 'Inversor · con soporte', foto: 'iny', foco: [0.27, 0.77, 3.0], alt: 'Relé gris de cinco patas',
    desc: 'Relé inversor de 5 patas, 12 V, 30/40 A, con soporte. Para alarmas, cierre centralizado y circuitos que tienen que cambiar de un lado a otro.',
    datos: [['Tensión', '12 V'], ['Corriente', '30/40 A'], ['Patas', '5 (inversor)']], tags: ['rele', 'relay', 'relevador'] },
  { id: 'led-t15', sis: 'iluminacion', canbus: true, tipo: 'LED señalización', nombre: 'LED T15 (W16W) Canbus marcha atrás', marca: 'Kobo', cod: 'DL-1303', enc: 'W16W', tec: 'led', unidad: 'par', precio: 5900, descuento: 0, stock: 20, rank: 39,
    meta: 'Marcha atrás · Canbus · 15 chips', foto: 'led', foco: [0.73, 0.82, 2.6], alt: 'Par de lámparas LED con chips SMD para marcha atrás',
    desc: 'Par de LED T15 (W16W) con Canbus para luz de marcha atrás: blanco intenso para ver al estacionar de noche.',
    datos: [['Encastre', 'T15 (W16W)'], ['Chips', '15'], ['Canbus', 'Sí'], ['Viene', '2 lámparas']], tags: ['t15', 'w16w', 'marcha atras', 'reversa'] },
  { id: 'sensor-arbol-levas', sis: 'inyeccion', tipo: 'Sensor', nombre: 'Sensor de árbol de levas (CMP)', marca: 'Delphi', cod: 'DL-3034', unidad: 'cu', precio: 22900, descuento: 0, stock: 6, rank: 40,
    meta: 'Efecto Hall · ficha 3 pines', compatTxt: 'consultá por marca y motor', foto: 'iny', foco: [0.38, 0.53, 3.0], alt: 'Sensor de árbol de levas con o-ring verde',
    desc: 'Sensor de posición del árbol de levas. Con él roto, el auto arranca largo y puede prender la luz de check.',
    datos: [['Tipo', 'Efecto Hall'], ['Ficha', '3 pines'], ['Se vende', 'Por unidad']], tags: ['cmp', 'sensor', 'levas'] },
  { id: 'faro-aux-rect', sis: 'iluminacion', tipo: 'Faro auxiliar', nombre: 'Faro auxiliar rectangular de 12 LED 36 W', marca: 'IAEL', cod: 'DL-1213', unidad: 'cu', precio: 22900, descuento: 0, stock: 0, rank: 41,
    meta: '36 W · 12/24 V · haz combinado', foto: 'mesa', foco: [0.235, 0.53, 2.8], alt: 'Faro auxiliar rectangular con doce LED',
    desc: 'Faro auxiliar rectangular de 12 LED con haz combinado: alumbra lejos y a los costados.',
    datos: [['Potencia', '36 W'], ['LED', '12'], ['Tensión', '12 / 24 V'], ['Haz', 'Combinado']], tags: ['auxiliar', 'faro'] },
  { id: 'portafusible', sis: 'inyeccion', tipo: 'Fusible', nombre: 'Portafusible aéreo con fusible tipo uña', marca: 'DNI', cod: 'DL-3051', unidad: 'cu', precio: 2900, descuento: 0, stock: 70, rank: 42,
    meta: 'Para fusible mini o estándar', foto: 'aux', foco: [0.25, 0.715, 3.2], alt: 'Portafusible aéreo transparente con fusible',
    desc: 'Portafusible aéreo con tapa, para proteger cualquier accesorio que se agrega: auxiliares, cámara, cargadores.',
    datos: [['Tipo', 'Aéreo con tapa'], ['Fusible', 'Uña mini o estándar'], ['Se vende', 'Por unidad']], tags: ['fusible', 'portafusible'] },
  { id: 'alternador-hilux', sis: 'arranque', tipo: 'Alternador', nombre: 'Alternador 80 A Toyota Hilux 2.5 / 3.0 D-4D', marca: 'Partson', cod: 'DL-4012', unidad: 'cu', precio: 429900, descuento: 0, stock: 1, rank: 43,
    compat: ['hilux-05'], compatTxt: 'motores 2.5 y 3.0 D-4D', foto: 'mesa', foco: [0.675, 0.37, 2.3], alt: 'Alternador plateado con polea',
    desc: 'Alternador de 80 A para Hilux diésel de la generación 2005 a 2015. Pasanos el número del original para confirmar la polea y la ficha.',
    datos: [['Corriente', '80 A'], ['Tensión', '12 V'], ['Motor', '2.5 y 3.0 D-4D'], ['Estado', 'Nuevo']], tags: ['alternador', 'hilux', 'diesel'] },
  { id: 'burro-hilux', sis: 'arranque', tipo: 'Burro', nombre: 'Burro de arranque Toyota Hilux 2.5 / 3.0 D-4D', marca: 'Partson', cod: 'DL-4002', unidad: 'cu', precio: 239900, descuento: 0, stock: 2, rank: 44,
    compat: ['hilux-05'], compatTxt: 'motores 2.5 y 3.0 D-4D', foto: 'mesa', foco: [0.875, 0.43, 2.3], alt: 'Burro de arranque con reductora',
    desc: 'Burro de arranque con reductora para Hilux diésel 2005 a 2015.',
    datos: [['Tensión', '12 V'], ['Tipo', 'Con reductora'], ['Motor', '2.5 y 3.0 D-4D'], ['Estado', 'Nuevo']], tags: ['burro', 'motor de arranque', 'hilux'] },
  { id: 'inyectores-x4', sis: 'inyeccion', tipo: 'Inyectores', nombre: 'Juego de 4 inyectores Bosch VW Gol Trend 1.6', marca: 'Bosch', cod: 'DL-3002', unidad: 'juego', precio: 169900, descuento: 8, stock: 3, rank: 45,
    compat: ['gol-08', 'gol-13'], compatTxt: 'motor 1.6 8v · código Bosch 0280156399', foto: 'iny', foco: [0.33, 0.27, 1.75], alt: 'Cuatro inyectores de nafta con o-rings',
    desc: 'Juego de 4 inyectores Bosch 0280156399 para cambiar el juego completo, con o-rings nuevos.',
    datos: [['Código', 'Bosch 0280156399'], ['Viene', '4 inyectores'], ['Motor', '1.6 8v']], tags: ['inyectores', 'picos'] },
  { id: 'terminales-surtidos', sis: 'inyeccion', tipo: 'Terminales', nombre: 'Terminales aislados surtidos (caja × 100)', marca: 'DNI', cod: 'DL-3052', unidad: 'kit', precio: 9900, descuento: 0, stock: 25, rank: 46,
    meta: 'Ojal, horquilla y empalme', foto: 'aux', foco: [0.29, 0.79, 3.0], alt: 'Terminales eléctricos aislados azules y verdes',
    desc: 'Caja de 100 terminales aislados: ojal, horquilla, pala y empalme, en tres medidas de cable.',
    datos: [['Viene', '100 terminales'], ['Tipos', 'Ojal, horquilla, pala, empalme'], ['Medidas', '3 secciones de cable']], tags: ['terminales', 'electricidad'] }
];

const RAIL = ['led-h4-a5', 'mini-rele-70', 'bobina-etios', 'barra-led-72', 'regulador-voltaje', 'led-t10', 'inyector-gol', 'faro-aux-cuadrado'];
const MAPA_COORDS = [-27.3830829, -55.9268439];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getVehiculo = id => VEHICULOS.find(v => v.id === id);
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const nombreAuto = v => (v ? `${v.marca} ${v.modelo}` : '');
const encLabel = k => ENCASTRES[k]?.n || k;
const sisDe = p => SIS[p.sis] || { n: '', corto: '' };
const encastresDe = v => [...new Set(POSICIONES.map(([k]) => v?.luces?.[k]).filter(Boolean))];
const calza = (p, enc) => p.enc === enc || (p.encs || []).includes(enc);
const encsDe = p => (p.encs?.length ? p.encs : p.enc ? [p.enc] : []);

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId] || { w: 1, h: 1 };
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / f.w, 1 / f.h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = f.w > vw + 0.5 ? clamp01((cx * f.w - vw / 2) / (f.w - vw)) : 0.5;
  const py = f.h > vh + 0.5 ? clamp01((cy * f.h - vh / 2) / (f.h - vh)) : 0.5;
  const x0 = (f.w - vw) * px;
  const y0 = (f.h - vh) * py;
  const fx = z > 1 ? clamp01((cx * f.w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * f.h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fichaHTML(p, clase = '', extra = '') {
  return `<div class="recorte ficha-enc ${clase}"${extra} role="img" aria-label="${esc(p.alt)}"><span class="ficha-enc__cod">${esc(p.enc)}</span><span class="ficha-enc__tec">Halógena</span><span class="ficha-enc__w">${esc(p.watts || '')}</span></div>`;
}

function fotoHTML(p, clase = '', extra = '', alt = null) {
  if (!p.foto) return fichaHTML(p, clase, extra);
  const f = FOTOS[p.foto];
  if (!f) return '';
  return `<div class="recorte ${clase}"${extra} style="${recorte(p.foto, p.foco, 1)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(alt === null ? p.alt : alt)}"></div>`;
}

/* ---------- consulta paginada (simula el endpoint del servidor) ---------- */
const API_MAX = 100;
const PASO = 16;

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    const autos = VEHICULOS.filter(v => (p.compat || []).includes(v.id) || encastresDe(v).some(e => calza(p, e))).map(v => `${v.marca} ${v.modelo}`);
    const partes = [p.nombre, p.marca, p.cod, sisDe(p).n, p.tipo, ...encsDe(p), ...encsDe(p).map(e => ENCASTRES[e]?.alias), p.tec === 'led' ? 'led cree' : p.tec === 'halogena' ? 'halogena' : '', p.desc, ...(p.tags || []), ...autos];
    const texto = normal(partes.join(' '));
    textoBusqueda.set(p.id, { texto, palabras: texto.split(/[^a-z0-9/]+/).filter(Boolean) });
  }
  return textoBusqueda.get(p.id);
}

function coincide(t, termino) {
  if (termino.length <= 2) return t.palabras.includes(termino);
  return t.texto.includes(termino);
}

function leVa(p, vehId) {
  const v = getVehiculo(vehId);
  if (!v) return false;
  if ((p.compat || []).includes(v.id)) return true;
  return encastresDe(v).some(e => calza(p, e));
}

const Servidor = {
  consultar(f = {}) {
    const terminos = normal(f.q || '').split(/\s+/).filter(Boolean);
    let lista = PRODUCTOS.filter(p => {
      if (f.sis?.length && !f.sis.includes(p.sis)) return false;
      if (f.enc?.length && !f.enc.some(e => calza(p, e))) return false;
      if (f.tec?.length && !f.tec.includes(p.tec)) return false;
      if (f.marcas?.length && !f.marcas.includes(p.marca)) return false;
      if (f.precios?.length && !f.precios.some(k => { const r = PRECIOS[k]?.r; const v = precioFinal(p); return r && v >= r[0] && v <= r[1]; })) return false;
      if (f.oferta && !(p.descuento > 0)) return false;
      if (f.stock && !(p.stock > 0)) return false;
      if (f.veh && !leVa(p, f.veh)) return false;
      if (terminos.length) { const t = textoDe(p); if (!terminos.every(w => coincide(t, w))) return false; }
      return true;
    });
    const orden = f.orden || 'pedidos';
    if (orden === 'menor') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (orden === 'mayor') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (orden === 'ofertas') lista = lista.slice().sort((a, b) => (b.descuento || 0) - (a.descuento || 0) || a.rank - b.rank);
    else if (orden === 'nuevos') lista = lista.slice().sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    else if (terminos.length) {
      const enNombre = p => terminos.every(w => normal(p.nombre).includes(w)) ? 0 : 1;
      lista = lista.slice().sort((a, b) => enNombre(a) - enNombre(b) || a.rank - b.rank);
    } else lista = lista.slice().sort((a, b) => a.rank - b.rank);
    return lista;
  },
  productos(params = {}) {
    const limite = Math.max(1, Math.min(API_MAX, Math.floor(Number(params.limite)) || PASO));
    const desde = Math.max(0, parseInt(params.cursor, 10) || 0);
    const lista = this.consultar(params);
    const items = lista.slice(desde, desde + limite);
    const fin = desde + items.length;
    return { items, total: lista.length, siguiente: fin < lista.length ? String(fin) : null };
  },
  destacados(ids, limite = 8) {
    return ids.slice(0, Math.min(limite, API_MAX)).map(getProducto).filter(Boolean);
  },
  conteo(f) {
    return this.consultar(f).length;
  },
  desde(f) {
    const lista = this.consultar(f);
    return lista.length ? Math.min(...lista.map(precioFinal)) : 0;
  }
};

/* ---------- carrito ---------- */
const Cart = {
  KEY: 'distriled_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1) {
    const items = this.get();
    const libre = (producto.stock ?? 0) - this.enCarrito(producto.id);
    const suma = Math.max(0, Math.min(qty, libre));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function sanearCarrito() {
  const limpios = [];
  Cart.get().forEach(i => {
    const p = i && getProducto(i.id);
    if (!p || !(p.stock > 0)) return;
    const qty = Math.min(Math.max(1, Math.floor(Number(i.qty)) || 1), p.stock);
    const ya = limpios.find(x => x.id === p.id);
    if (ya) ya.qty = Math.min(p.stock, ya.qty + qty);
    else limpios.push({ id: p.id, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { limpios.length = 0; }
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

function sumarAlCarrito(p, qty = 1) {
  const ok = Cart.add(p, qty);
  if (!ok) { showToast(p.stock > 0 ? 'Ya tenés en el carrito todo el stock de este producto.' : 'Sin stock por ahora: consultanos por WhatsApp.'); return 0; }
  showToast(`Sumaste ${ok === 1 ? '' : `${ok} × `}${p.nombre} al carrito.`);
  return ok;
}

/* ---------- tarjetas ---------- */
const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"'
};
const ICONO_CARRITO = '<svg aria-hidden="true"><use href="#i-carrito"/></svg>';
const UNIDAD = { par: 'el par', cu: 'c/u', juego: 'el juego', kit: 'el kit' };

function precioHTML(p) {
  return `<p class="precio"><span class="precio__f">${formatearPrecio(precioFinal(p))}</span><span class="precio__u">${esc(UNIDAD[p.unidad] || '')}</span>${p.descuento > 0 ? `<s class="precio__o">${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}

function codHTML(p) {
  const chip = p.enc ? `<span class="cod">${esc(encsDe(p).map(encLabel).join(' / '))}</span>` : `<span class="cod cod--suave">${esc(p.tipo)}</span>`;
  const tec = p.tec === 'led' ? 'LED · ' : p.tec === 'halogena' ? 'Halógena · ' : '';
  return `<p class="card__cod">${chip}<span>${tec}Cód. ${esc(p.cod)}</span></p>`;
}

function metaDe(p) {
  if (p.meta) return p.meta;
  const autos = (p.compat || []).map(getVehiculo).filter(Boolean).map(v => v.modelo);
  return autos.length ? `Para ${autos.slice(0, 3).join(', ')}` : '';
}

function stepperHTML(id) {
  return `<div class="stepper" data-stepper="${id}" role="group" aria-label="Cantidad"><button type="button" data-paso="-1" aria-label="Restar uno" disabled>−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="btn btn--line btn--sm prod-add" href="${wspLink(`Hola distriLed! ¿Cuándo vuelve a entrar ${p.nombre} (Cód. ${p.cod})?`)}" target="_blank" rel="noopener"><span class="lbl">Avisame cuando entre</span></a>`;
  const libre = p.stock - Cart.enCarrito(p.id);
  return `${stepperHTML(p.id)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO}<span class="lbl">Agregar</span></button>`;
}

function cardHTML(p, anim = 'subir') {
  const badges = [
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : '',
    p.top ? '<span class="badge badge--top">Más pedido</span>' : '',
    p.nuevo ? '<span class="badge">Nuevo ingreso</span>' : '',
    p.stock > 0 && p.stock <= 3 ? `<span class="badge badge--poco">Quedan ${p.stock}</span>` : '',
    !(p.stock > 0) ? '<span class="badge badge--sin">Sin stock</span>' : ''
  ].filter(Boolean).slice(0, 2).join('');
  const meta = metaDe(p);
  return `<div class="card-wrap"${anim ? ` ${ANIM[anim]}` : ''}><article class="card" data-id="${p.id}">
    <div class="card__media">
      ${fotoHTML(p, 'card__img', ` data-quick="${p.id}"`)}
      <span class="card__led" aria-hidden="true"></span>
      <div class="card__badges">${badges}</div>
    </div>
    <div class="card__body">
      ${codHTML(p)}
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${meta ? `<p class="card__meta">${esc(meta)}</p>` : ''}
      ${precioHTML(p)}
      <div class="prod-actions">${accionesHTML(p)}</div>
      ${p.stock > 0 ? `<button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>` : ''}
    </div>
  </article></div>`;
}

function syncStepper(st, p) {
  if (!st || !p) return;
  const out = st.querySelector('output');
  const n = Number(out?.textContent) || 1;
  const libre = (p.stock ?? 0) - Cart.enCarrito(p.id);
  const menos = st.querySelector('[data-paso="-1"]');
  const mas = st.querySelector('[data-paso="1"]');
  if (menos) menos.disabled = n <= 1;
  if (mas) mas.disabled = n >= Math.max(1, libre);
}

function refrescarCards() {
  document.querySelectorAll('.card[data-id]').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p || !(p.stock > 0)) return;
    const libre = p.stock - Cart.enCarrito(p.id);
    const add = card.querySelector('[data-add]');
    if (add) add.disabled = libre <= 0;
    const st = card.querySelector('[data-stepper]');
    const out = st?.querySelector('output');
    if (out && Number(out.textContent) > Math.max(1, libre)) out.textContent = String(Math.max(1, libre));
    syncStepper(st, p);
  });
}

/* ---------- catálogo ---------- */
const FILTRO = { q: '', sis: new Set(), enc: new Set(), tec: new Set(), marcas: new Set(), precios: new Set(), oferta: false, stock: false, veh: '', orden: 'pedidos' };
const ESTADO = { siguiente: null, total: 0, mostrados: 0 };

function paramsDeFiltro() {
  return { q: FILTRO.q, sis: [...FILTRO.sis], enc: [...FILTRO.enc], tec: [...FILTRO.tec], marcas: [...FILTRO.marcas], precios: [...FILTRO.precios], oferta: FILTRO.oferta, stock: FILTRO.stock, veh: FILTRO.veh, orden: FILTRO.orden };
}

function tituloTienda() {
  const otros = FILTRO.enc.size || FILTRO.tec.size || FILTRO.marcas.size || FILTRO.precios.size;
  const v = getVehiculo(FILTRO.veh);
  if (v) return `Para tu ${v.modelo}`;
  if (FILTRO.sis.size === 1 && !otros && !FILTRO.q) return SIS[[...FILTRO.sis][0]].n;
  if (FILTRO.enc.size === 1 && !FILTRO.sis.size && !FILTRO.q) return `Encastre ${encLabel([...FILTRO.enc][0])}`;
  if (FILTRO.oferta && !FILTRO.sis.size && !otros && !FILTRO.q) return 'Ofertas del mostrador';
  if (FILTRO.q) return `Resultados para «${FILTRO.q}»`;
  return 'Todo el mostrador';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.veh) pills.push(['veh', '', `Le va a ${nombreAuto(getVehiculo(FILTRO.veh))}`]);
  if (FILTRO.q) pills.push(['q', '', `«${FILTRO.q}»`]);
  if (FILTRO.sis.size > 1 || (FILTRO.sis.size === 1 && (FILTRO.q || FILTRO.enc.size || FILTRO.veh))) FILTRO.sis.forEach(s => pills.push(['sis', s, SIS[s].corto]));
  FILTRO.enc.forEach(e => pills.push(['enc', e, encLabel(e)]));
  FILTRO.tec.forEach(t => pills.push(['tec', t, TECS[t]]));
  FILTRO.marcas.forEach(m => pills.push(['marca', m, m]));
  FILTRO.precios.forEach(r => pills.push(['precio', r, PRECIOS[r].t]));
  if (FILTRO.oferta) pills.push(['oferta', '', 'Ofertas']);
  if (FILTRO.stock) pills.push(['stock', '', 'Con stock']);
  cont.innerHTML = pills.map(([k, v, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('');
  cont.hidden = !pills.length;
}

function sincronizarControles() {
  const marcar = (sel, set) => document.querySelectorAll(sel).forEach(c => { c.checked = set.has(c.value); });
  marcar('input[data-f="sis"]', FILTRO.sis);
  marcar('input[data-f="tec"]', FILTRO.tec);
  marcar('input[data-f="marca"]', FILTRO.marcas);
  marcar('input[data-f="precio"]', FILTRO.precios);
  document.querySelectorAll('.f-chip[data-enc]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.enc.has(b.dataset.enc))));
  const oferta = document.getElementById('f-oferta');
  if (oferta) oferta.checked = FILTRO.oferta;
  const stock = document.getElementById('f-stock');
  if (stock) stock.checked = FILTRO.stock;
  const una = FILTRO.sis.size === 1 ? [...FILTRO.sis][0] : '';
  const limpio = !FILTRO.sis.size && !FILTRO.oferta && !FILTRO.veh && !FILTRO.enc.size;
  document.querySelectorAll('.chip-sis').forEach(b => {
    const c = b.dataset.chip;
    const on = c === 'todo' ? limpio : c === 'oferta' ? (FILTRO.oferta && !FILTRO.sis.size) : c === una;
    b.setAttribute('aria-pressed', String(on));
  });
  ['q', 'q2'].forEach(id => {
    const q = document.getElementById(id);
    if (q && document.activeElement !== q && q.value !== FILTRO.q) q.value = FILTRO.q;
  });
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
}

function pintarPie() {
  const count = document.getElementById('cat-count');
  if (count) count.textContent = ESTADO.total ? `${plural(ESTADO.total, 'producto', 'productos')}${ESTADO.total > ESTADO.mostrados ? ` · mostrando ${ESTADO.mostrados}` : ''}` : 'Sin resultados';
  const mas = document.getElementById('ver-mas');
  const masN = document.getElementById('mas-n');
  if (mas) mas.hidden = !ESTADO.siguiente;
  if (masN) masN.textContent = ESTADO.total > PASO ? `Viste ${ESTADO.mostrados} de ${ESTADO.total}` : '';
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = ESTADO.total > 0;
  const vw = document.getElementById('vacio-wsp');
  if (vw) vw.href = wspLink(FILTRO.q ? `Hola distriLed! Busco «${FILTRO.q}» y no lo encontré en la web. ¿Lo tienen?` : 'Hola distriLed! Estoy buscando un repuesto que no encontré en la web.');
}

function pintarCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const pagina = Servidor.productos({ ...paramsDeFiltro(), cursor: '0', limite: PASO });
  grid.innerHTML = pagina.items.map(p => cardHTML(p)).join('');
  ESTADO.siguiente = pagina.siguiente;
  ESTADO.total = pagina.total;
  ESTADO.mostrados = pagina.items.length;
  const tit = document.getElementById('t-tienda');
  if (tit) tit.textContent = tituloTienda();
  pintarPie();
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function verMas() {
  const grid = document.getElementById('grid');
  if (!grid || !ESTADO.siguiente) return;
  const pagina = Servidor.productos({ ...paramsDeFiltro(), cursor: ESTADO.siguiente, limite: PASO });
  grid.insertAdjacentHTML('beforeend', pagina.items.map(p => cardHTML(p)).join(''));
  ESTADO.siguiente = pagina.siguiente;
  ESTADO.total = pagina.total;
  ESTADO.mostrados += pagina.items.length;
  pintarPie();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() {
  FILTRO.q = ''; FILTRO.sis = new Set(); FILTRO.enc = new Set(); FILTRO.tec = new Set(); FILTRO.marcas = new Set(); FILTRO.precios = new Set();
  FILTRO.oferta = false; FILTRO.stock = false; FILTRO.veh = '';
}

function filtrarPor(tipo, valor, ir = true) {
  resetFiltros();
  if (tipo === 'sis' && SIS[valor]) FILTRO.sis = new Set([valor]);
  if (tipo === 'enc' && ENCASTRES[valor]) FILTRO.enc = new Set([valor]);
  if (tipo === 'veh' && getVehiculo(valor)) FILTRO.veh = valor;
  if (tipo === 'oferta') FILTRO.oferta = true;
  if (tipo === 'q') FILTRO.q = String(valor || '').slice(0, 60);
  pintarCatalogo();
  if (ir) irATienda();
}

function toggleSet(set, v) { if (set.has(v)) set.delete(v); else set.add(v); }

function construirFiltros() {
  const sis = document.getElementById('f-sis');
  if (sis) sis.innerHTML = Object.keys(SIS).map(s => `<label class="f-check"><input type="checkbox" data-f="sis" value="${s}">${esc(SIS[s].n)}<span class="f-n">${Servidor.conteo({ sis: [s] })}</span></label>`).join('');
  const encs = document.getElementById('f-encastres');
  if (encs) encs.innerHTML = Object.keys(ENCASTRES).filter(e => Servidor.conteo({ enc: [e] }) > 0).map(e => `<button type="button" class="f-chip" data-enc="${e}" aria-pressed="false" title="${esc(ENCASTRES[e].d)}">${esc(encLabel(e))}</button>`).join('');
  const tec = document.getElementById('f-tec');
  if (tec) tec.innerHTML = Object.keys(TECS).map(t => `<label class="f-check"><input type="checkbox" data-f="tec" value="${t}">${esc(TECS[t])}<span class="f-n">${Servidor.conteo({ tec: [t] })}</span></label>`).join('');
  const marcas = document.getElementById('f-marcas');
  if (marcas) {
    const lista = [...new Set(PRODUCTOS.map(p => p.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    marcas.innerHTML = lista.map(m => `<label class="f-check"><input type="checkbox" data-f="marca" value="${esc(m)}">${esc(m)}<span class="f-n">${Servidor.conteo({ marcas: [m] })}</span></label>`).join('');
  }
  const precios = document.getElementById('f-precios');
  if (precios) precios.innerHTML = Object.keys(PRECIOS).map(r => `<label class="f-check"><input type="checkbox" data-f="precio" value="${r}">${esc(PRECIOS[r].t)}</label>`).join('');
  const chips = document.getElementById('chips-cat');
  if (chips) chips.innerHTML = `<button type="button" class="chip-sis" data-chip="todo" aria-pressed="true"><span class="chip-sis__led" aria-hidden="true"></span>Todo</button>` + Object.keys(SIS).map(s => `<button type="button" class="chip-sis" data-chip="${s}" aria-pressed="false"><span class="chip-sis__led" aria-hidden="true"></span>${esc(SIS[s].n)}<small>${Servidor.conteo({ sis: [s] })}</small></button>`).join('') + `<button type="button" class="chip-sis" data-chip="oferta" aria-pressed="false"><span class="chip-sis__led" aria-hidden="true"></span>Ofertas</button>`;
  const total = document.getElementById('cat-total');
  if (total) total.textContent = `${PRODUCTOS.filter(p => p.stock > 0).length} productos en stock`;
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  construirFiltros();
  ['q', 'q2'].forEach(id => {
    const q = document.getElementById(id);
    let t = 0;
    q?.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { FILTRO.q = q.value.trim().slice(0, 60); FILTRO.veh = ''; pintarCatalogo(); }, 220);
    });
  });
  document.querySelectorAll('[data-busca]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input');
    FILTRO.q = q ? q.value.trim().slice(0, 60) : '';
    FILTRO.veh = '';
    pintarCatalogo();
    irATienda();
  }));
  const filtros = document.getElementById('filtros');
  filtros?.addEventListener('change', e => {
    const c = e.target;
    if (c.matches('input[data-f="sis"]')) { if (c.checked) FILTRO.sis.add(c.value); else FILTRO.sis.delete(c.value); }
    else if (c.matches('input[data-f="tec"]')) { if (c.checked) FILTRO.tec.add(c.value); else FILTRO.tec.delete(c.value); }
    else if (c.matches('input[data-f="marca"]')) { if (c.checked) FILTRO.marcas.add(c.value); else FILTRO.marcas.delete(c.value); }
    else if (c.matches('input[data-f="precio"]')) { if (c.checked) FILTRO.precios.add(c.value); else FILTRO.precios.delete(c.value); }
    else if (c.id === 'f-oferta') FILTRO.oferta = c.checked;
    else if (c.id === 'f-stock') FILTRO.stock = c.checked;
    else return;
    pintarCatalogo();
  });
  filtros?.addEventListener('click', e => {
    const b = e.target.closest('.f-chip[data-enc]');
    if (!b) return;
    toggleSet(FILTRO.enc, b.dataset.enc);
    pintarCatalogo();
  });
  document.getElementById('chips-cat')?.addEventListener('click', e => {
    const b = e.target.closest('.chip-sis');
    if (!b) return;
    const c = b.dataset.chip;
    if (c === 'todo') filtrarPor('', '', false);
    else if (c === 'oferta') filtrarPor('oferta', '', false);
    else filtrarPor('sis', c, false);
  });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('f-clear')?.addEventListener('click', () => { resetFiltros(); pintarCatalogo(); });
  document.getElementById('vacio-reset')?.addEventListener('click', () => { resetFiltros(); pintarCatalogo(); });
  document.getElementById('ver-mas')?.addEventListener('click', verMas);
  document.getElementById('pills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro;
    const v = b.dataset.valor || '';
    if (k === 'veh') FILTRO.veh = '';
    if (k === 'q') FILTRO.q = '';
    if (k === 'sis') FILTRO.sis.delete(v);
    if (k === 'enc') FILTRO.enc.delete(v);
    if (k === 'tec') FILTRO.tec.delete(v);
    if (k === 'marca') FILTRO.marcas.delete(v);
    if (k === 'precio') FILTRO.precios.delete(v);
    if (k === 'oferta') FILTRO.oferta = false;
    if (k === 'stock') FILTRO.stock = false;
    pintarCatalogo();
  });
  const params = new URLSearchParams(location.search);
  let desdeURL = false;
  const sis = params.get('cat');
  if (sis && SIS[sis]) { FILTRO.sis = new Set([sis]); desdeURL = true; }
  const enc = params.get('encastre');
  if (enc && ENCASTRES[enc]) { FILTRO.enc = new Set([enc]); desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(irATienda, 60));
}

function initFiltrosPanel() {
  const panel = document.getElementById('filtros');
  const toggle = document.getElementById('filtrosToggle');
  if (!panel || !toggle) return;
  const mq = window.matchMedia(ES_M2 ? '(min-width: 0px)' : '(max-width: 1024px)');
  let bd = null;
  const cerrar = () => {
    panel.classList.remove('open');
    bd?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const abrir = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    panel.removeAttribute('inert');
    panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    panel.classList.add('open');
    bd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  toggle.addEventListener('click', () => (panel.classList.contains('open') ? cerrar() : abrir()));
  document.getElementById('filtrosClose')?.addEventListener('click', () => { cerrar(); toggle.focus(); });
  document.getElementById('filtrosVer')?.addEventListener('click', () => { cerrar(); irATienda(); });
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); toggle.focus(); }
    if (e.key === 'Tab') trap(e, panel);
  });
  const sync = () => {
    if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrar(); }
  };
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- rail (modelo 2) ---------- */
function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail');
  if (!track || !vp) return;
  track.innerHTML = Servidor.destacados(RAIL, 8).map(p => cardHTML(p, 'der')).join('');
  initRailDrag(vp);
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => (track.querySelector('.card-wrap')?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { moved = true; }
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

/* ---------- ¿qué lámpara lleva tu auto? ---------- */
const LAMPARA = { marca: '', veh: '' };

function mejorDe(enc, tec) {
  return PRODUCTOS.filter(p => calza(p, enc) && p.tec === tec).sort((a, b) => (b.stock > 0) - (a.stock > 0) || a.rank - b.rank)[0] || null;
}

function opcionHTML(p, tipo) {
  if (!p) return '';
  const sin = !(p.stock > 0);
  return `<button type="button" class="lp-opc${tipo === 'led' ? ' lp-opc--led' : ''}" data-lp-add="${p.id}"${sin ? ' disabled' : ''} aria-label="Agregar ${esc(p.nombre)} al carrito">${tipo === 'led' ? (p.canbus ? 'LED Canbus' : 'LED') : 'Halógena'} <span>${formatearPrecio(precioFinal(p))} ${esc(UNIDAD[p.unidad] || '')}</span>${ICONO_CARRITO}</button>`;
}

function luzHTML(v, [k, nombre, nota]) {
  const enc = v.luces?.[k];
  if (!enc) return '';
  const led = mejorDe(enc, 'led');
  const hal = mejorDe(enc, 'halogena');
  const opcs = led || hal ? `${opcionHTML(led, 'led')}${opcionHTML(hal, 'hal')}` : `<a class="lp-opc" href="${wspLink(`Hola distriLed! Necesito lámparas ${encLabel(enc)} para la ${nombre.toLowerCase()} de mi ${nombreAuto(v)}. ¿Tienen?`)}" target="_blank" rel="noopener">Consultar <span>por WhatsApp</span></a>`;
  return `<li class="lp-luz">
    <span class="lp-luz__pos">${esc(nombre)}<small>${esc(nota)}</small></span>
    <span class="lp-cod">${esc(encLabel(enc))}${ENCASTRES[enc]?.alias ? `<small>${esc(ENCASTRES[enc].alias)}</small>` : ''}</span>
    <span class="lp-opcs">${opcs}</span>
  </li>`;
}

function pintarLampara() {
  const marcas = document.getElementById('lp-marcas');
  const modelos = document.getElementById('lp-modelos');
  const res = document.getElementById('lp-res');
  if (!marcas || !modelos || !res) return;
  marcas.querySelectorAll('.lp-marca').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.marca === LAMPARA.marca)));
  const lista = VEHICULOS.filter(v => v.marca === LAMPARA.marca);
  modelos.innerHTML = lista.map(v => `<button type="button" class="lp-modelo" data-veh="${v.id}" aria-pressed="${v.id === LAMPARA.veh}"><b>${esc(v.modelo)}</b><small>${esc(v.anios)}</small></button>`).join('');
  const v = getVehiculo(LAMPARA.veh);
  if (!v) {
    res.innerHTML = `<p class="lp-vacio"><svg aria-hidden="true"><use href="#i-auto"/></svg>${LAMPARA.marca ? `Elegí el modelo de tu ${esc(LAMPARA.marca)}.` : 'Arrancá por la marca: te mostramos qué lámpara va en cada luz.'}</p>`;
    return;
  }
  const n = Servidor.conteo({ veh: v.id });
  res.innerHTML = `<div class="lp-auto"><p class="lp-auto__t">${esc(nombreAuto(v))} <span class="lp-auto__n">${esc(v.anios)}</span></p><p class="lp-auto__n">${esc(v.version)}</p></div>
    <ul class="lp-luces">${POSICIONES.map(pos => luzHTML(v, pos)).join('')}</ul>
    <div class="lp-acc">
      <button type="button" class="btn btn--cta" data-lp-ver="${v.id}">Ver ${plural(n, 'producto', 'productos')} para tu ${esc(v.modelo)} <span class="chev" aria-hidden="true"><i></i><i></i><i></i></span></button>
      <a class="btn btn--line" href="${wspLink(`Hola distriLed! Tengo un ${nombreAuto(v)} (${v.anios}). ¿Me confirman qué lámparas lleva y qué tienen en stock?`)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wsp"/></svg>Confirmar por WhatsApp</a>
    </div>
    <p class="lp-nota">${esc(v.nota || 'Orientativo: según la versión y el año puede cambiar. Si tenés la lámpara vieja, el código está impreso en la base.')}</p>`;
}

function initLampara() {
  const app = document.getElementById('lampara-app');
  if (!app) return;
  const marcas = document.getElementById('lp-marcas');
  const lista = [...new Set(VEHICULOS.map(v => v.marca))];
  if (marcas) marcas.innerHTML = lista.map(m => `<button type="button" class="lp-marca" data-marca="${esc(m)}" aria-pressed="false">${esc(m)}</button>`).join('');
  const encs = document.getElementById('lp-encastres');
  if (encs) encs.innerHTML = ENC_RAPIDOS.filter(e => Servidor.conteo({ enc: [e] }) > 0).map(e => `<button type="button" class="lp-enc" data-lp-enc="${e}">${esc(encLabel(e))}<small>${esc(ENCASTRES[e].corto)}</small></button>`).join('');
  app.addEventListener('click', e => {
    const m = e.target.closest('[data-marca]');
    if (m) { LAMPARA.marca = m.dataset.marca; LAMPARA.veh = ''; pintarLampara(); return; }
    const v = e.target.closest('[data-veh]');
    if (v) { LAMPARA.veh = v.dataset.veh; pintarLampara(); return; }
    const add = e.target.closest('[data-lp-add]');
    if (add) { const p = getProducto(add.dataset.lpAdd); if (p) sumarAlCarrito(p, 1); return; }
    const ver = e.target.closest('[data-lp-ver]');
    if (ver) { filtrarPor('veh', ver.dataset.lpVer); return; }
    const enc = e.target.closest('[data-lp-enc]');
    if (enc) filtrarPor('enc', enc.dataset.lpEnc);
  });
  pintarLampara();
}

/* ---------- los cuatro sistemas, en secuencia (momento) ---------- */
const ORDEN_SIS = ['iluminacion', 'encendido', 'inyeccion', 'arranque'];

function miniHTML(p) {
  const libre = (p.stock ?? 0) - Cart.enCarrito(p.id);
  return `<div class="mini">
    ${fotoHTML(p, '', '', '')}
    <div><p class="mini__t">${esc(p.nombre)}</p><p class="mini__p">${formatearPrecio(precioFinal(p))} ${esc(UNIDAD[p.unidad] || '')}</p></div>
    <button type="button" class="btn btn--luz btn--sm" data-add-mini="${p.id}"${libre <= 0 ? ' disabled' : ''} aria-label="Agregar ${esc(p.nombre)} al carrito">${ICONO_CARRITO}<span class="lbl">Agregar</span></button>
  </div>`;
}

function initSecuencia() {
  const sec = document.getElementById('sistemas');
  const pista = document.getElementById('sec-pista');
  const escena = document.getElementById('sec-escena');
  if (!sec || !pista || !escena) return;
  const tiras = ORDEN_SIS.map(s => sec.querySelector(`.tira[data-sis="${s}"]`));
  const infos = ORDEN_SIS.map(s => sec.querySelector(`.sec-info[data-sis="${s}"]`));
  const chev = [...sec.querySelectorAll('#sec-chev i')];
  const nEl = document.getElementById('sec-n');
  const pintarMinis = () => ORDEN_SIS.forEach(s => {
    const el = sec.querySelector(`[data-sec-prod="${s}"]`);
    const p = getProducto(SIS[s].estrella);
    if (el && p) el.innerHTML = miniHTML(p);
  });
  ORDEN_SIS.forEach(s => {
    const n = Servidor.conteo({ sis: [s] });
    const vivo = sec.querySelector(`[data-sec-vivo="${s}"]`);
    if (vivo) vivo.innerHTML = `<b>${n}</b> productos · desde <b>${formatearPrecio(Servidor.desde({ sis: [s] }))}</b>`;
    const ver = sec.querySelector(`[data-sec-ver="${s}"]`);
    if (ver) {
      ver.firstChild.textContent = `Ver ${plural(n, 'producto', 'productos')} de ${SIS[s].corto.toLowerCase()} `;
      ver.addEventListener('click', e => { e.preventDefault(); filtrarPor('sis', s); });
    }
  });
  pintarMinis();
  document.addEventListener('cart:updated', pintarMinis);
  sec.addEventListener('click', e => {
    const b = e.target.closest('[data-add-mini]');
    if (!b) return;
    const p = getProducto(b.dataset.addMini);
    if (p) sumarAlCarrito(p, 1);
  });
  let actual = -1;
  const pintar = (p, forzar = false) => {
    const idx = Math.min(ORDEN_SIS.length - 1, Math.floor(clamp01(p) * ORDEN_SIS.length));
    const todo = p >= 0.985;
    tiras.forEach((t, i) => { if (t) t.classList.toggle('is-encendida', i < idx || todo); });
    if (idx === actual && !forzar) return;
    actual = idx;
    tiras.forEach((t, i) => { if (t) t.classList.toggle('is-activa', i === idx); });
    infos.forEach((el, i) => { if (el) { el.classList.toggle('is-activa', i === idx); if (i === idx) el.removeAttribute('inert'); else el.setAttribute('inert', ''); } });
    chev.forEach((c, i) => c.classList.toggle('is-on', i <= idx));
    if (nEl) nEl.textContent = String(idx + 1).padStart(2, '0');
  };
  window.__pintarSecuencia = pintar;
  if (reduceMotion) {
    sec.classList.add('secuencia--estatico');
    infos.forEach(el => { if (el) { el.classList.add('is-activa'); el.removeAttribute('inert'); } });
    tiras.forEach(t => t?.classList.add('is-activa'));
    return;
  }
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let frame = 0;
  const medir = () => {
    frame = 0;
    const off = OFF();
    const total = pista.offsetHeight - escena.offsetHeight;
    const p = total > 0 ? clamp01((off - pista.getBoundingClientRect().top) / total) : 0;
    pintar(p);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar(0, true);
  medir();
}

/* ---------- mapa ---------- */
let mapaLeaflet = null;
function crearMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined' || mapaLeaflet) return;
  mapaLeaflet = L.map(el, { zoomControl: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false, dragging: !window.matchMedia('(hover: none)').matches }).setView(MAPA_COORDS, 15);
  mapaLeaflet.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapaLeaflet);
  const icono = L.divIcon({ className: '', html: '<div class="pin-dl"></div>', iconSize: [46, 46], iconAnchor: [23, 23] });
  L.marker(MAPA_COORDS, { icon: icono, keyboard: false, interactive: false }).addTo(mapaLeaflet);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  if (!('IntersectionObserver' in window)) { crearMapa(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(en => en.isIntersecting)) {
      io.disconnect();
      crearMapa();
      setTimeout(() => mapaLeaflet?.invalidateSize(), 1300);
    }
  }, { rootMargin: '300px 0px' });
  io.observe(el);
}

/* ---------- carrito (cajón) ---------- */
let ultimoFoco = null;

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const libre = (p.stock ?? 0) - Cart.enCarrito(p.id);
  return `<div class="linea">
    ${fotoHTML(p, '', '', '')}
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">Cód. ${esc(p.cod)} · ${esc(UNIDAD[p.unidad] || '')}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea" role="group" aria-label="Cantidad"><button type="button" data-linea="-1" data-id="${p.id}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p) * i.qty)}</p>
  </div>`;
}

function pedidoTexto() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (Cód. ${p.cod}) — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return ['Hola distriLed! Quiero hacer este pedido:', ...lineas, `Total: ${formatearPrecio(Cart.total())}`, '¿Cómo coordinamos la entrega o el retiro?'].join('\n');
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Arrancá por el encastre de tu lámpara o por el repuesto que te falta.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver el catálogo</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (!foot) return;
  foot.hidden = false;
  const total = document.getElementById('dr-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('drawer-wsp');
  if (wsp) wsp.href = wspLink(pedidoTexto());
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  cerrarModal(false);
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : document.getElementById('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer(devolverFoco = true) {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  if (devolverFoco) ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', () => cerrarDrawer());
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => cerrarDrawer());
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar);
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const it = Cart.get().find(x => x.id === paso.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(false); irATienda(); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let modalProd = null;
let modalQty = 1;
let modalFoco = null;

function modalStock(p) {
  const libre = (p.stock ?? 0) - Cart.enCarrito(p.id);
  if (!(p.stock > 0)) return '<p class="m-stock m-stock--sin">Sin stock por ahora. Escribinos y te avisamos cuando entra.</p>';
  if (libre <= 0) return '<p class="m-stock m-stock--sin">Ya tenés en el carrito todo el stock de este producto.</p>';
  if (p.stock <= 3) return `<p class="m-stock m-stock--poco">Quedan ${p.stock}</p>`;
  return '<p class="m-stock">En stock en Posadas</p>';
}

function compatHTML(p) {
  const autos = VEHICULOS.filter(v => (p.compat || []).includes(v.id) || encastresDe(v).some(e => calza(p, e)));
  const nombres = [...new Set(autos.map(nombreAuto))];
  if (p.enc && nombres.length) return `<p class="m-compat"><b>Encastre ${esc(encsDe(p).map(encLabel).join(' / '))}:</b> lo usan, entre otros, ${esc(nombres.slice(0, 5).join(', '))}. Confirmá con la lámpara vieja o por WhatsApp.</p>`;
  if (nombres.length) return `<p class="m-compat"><b>Le va a:</b> ${esc(nombres.join(', '))}${p.compatTxt ? ` · ${esc(p.compatTxt)}` : ''}.</p>`;
  if (p.compatTxt) return `<p class="m-compat"><b>Aplicación:</b> ${esc(p.compatTxt)}.</p>`;
  return '';
}

function modalHTML(p) {
  const datos = (p.datos || []).map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('');
  const rel = PRODUCTOS.filter(x => x.sis === p.sis && x.id !== p.id && x.stock > 0).sort((a, b) => a.rank - b.rank).slice(0, 3);
  const relHTML = rel.length ? `<p class="m-rel-t">También te puede interesar</p><ul class="m-rels">${rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x, '', '', '')}<span>${esc(x.nombre)}</span><b>${formatearPrecio(precioFinal(x))}</b></button></li>`).join('')}</ul>` : '';
  const libre = (p.stock ?? 0) - Cart.enCarrito(p.id);
  const vistas = p.foto ? `<div class="m-vistas" role="group" aria-label="Fotos del producto">
        <button type="button" class="m-vista" data-m-vista="0" aria-pressed="true">El producto</button>
        <button type="button" class="m-vista" data-m-vista="1" aria-pressed="false">Foto completa</button>
      </div>` : '';
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p, 'm-foto', ' id="m-foto"')}
      ${vistas}
    </div>
    <div class="m-info">
      ${codHTML(p).replace('card__cod', 'm-cod')}
      <h2 class="m-t">${esc(p.nombre)}</h2>
      <div class="m-precio">${precioHTML(p)}</div>
      <div id="m-stock">${modalStock(p)}</div>
      <div class="m-compra">
        <div class="stepper" id="m-stepper" role="group" aria-label="Cantidad"><button type="button" data-mpaso="-1" aria-label="Restar uno"${modalQty <= 1 ? ' disabled' : ''}>−</button><output id="m-q">${modalQty}</output><button type="button" data-mpaso="1" aria-label="Sumar uno"${modalQty >= Math.max(1, libre) ? ' disabled' : ''}>+</button></div>
        <button type="button" class="btn btn--cta" id="m-add"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO}Agregar · ${formatearPrecio(precioFinal(p) * modalQty)}</button>
        <button type="button" class="btn btn--line" id="m-comprar"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <p class="m-desc">${esc(p.desc)}</p>
      <dl class="m-datos">${datos}</dl>
      ${compatHTML(p)}
      <a class="m-wsp" href="${wspLink(`Hola distriLed! Quiero confirmar si ${p.nombre} (Cód. ${p.cod}) le va a mi auto: `)}" target="_blank" rel="noopener">¿Le va a tu auto? Preguntanos por WhatsApp</a>
      ${relHTML}
    </div>
  </div>`;
}

function pintarModal() {
  const cont = document.getElementById('modal-content');
  if (!cont || !modalProd) return;
  cont.innerHTML = modalHTML(modalProd);
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  if (!p || !modal) return;
  const yaAbierto = !modal.hidden;
  if (!yaAbierto) {
    const activo = document.activeElement;
    modalFoco = activo && activo.offsetParent !== null ? activo : null;
  }
  modalProd = p;
  modalQty = 1;
  pintarModal();
  const box = modal.querySelector('.modal-box');
  if (box) box.scrollTop = 0;
  if (!yaAbierto) {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.classList.add('no-scroll');
  }
  document.getElementById('modal-close')?.focus();
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  modalProd = null;
  if (devolverFoco) modalFoco?.focus?.();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const p = modalProd;
    if (!p) return;
    const paso = e.target.closest('[data-mpaso]');
    if (paso) {
      const libre = Math.max(1, (p.stock ?? 0) - Cart.enCarrito(p.id));
      modalQty = Math.max(1, Math.min(libre, modalQty + Number(paso.dataset.mpaso)));
      pintarModal();
      return;
    }
    const vista = e.target.closest('[data-m-vista]');
    if (vista) {
      const foto = document.getElementById('m-foto');
      const completa = vista.dataset.mVista === '1';
      if (foto) {
        foto.setAttribute('style', completa ? '--op:50% 50%;--to:50% 50%;--z:1' : recorte(p.foto, p.foco, 1));
        const img = foto.querySelector('img');
        if (img) img.style.objectFit = completa ? 'contain' : '';
      }
      modal.querySelectorAll('[data-m-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    if (e.target.closest('#m-add') || e.target.closest('#m-comprar')) {
      const comprar = !!e.target.closest('#m-comprar');
      const ok = sumarAlCarrito(p, modalQty);
      if (!ok) return;
      modalQty = 1;
      if (comprar) { cerrarModal(false); abrirDrawer(); }
      else pintarModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod && getProducto(prod)) window.addEventListener('load', () => abrirModal(prod));
}

/* ---------- clicks compartidos ---------- */
function initClicks() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { e.preventDefault(); abrirModal(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const p = getProducto(st.dataset.stepper);
      if (!p) return;
      const out = st.querySelector('output');
      const libre = Math.max(1, (p.stock ?? 0) - Cart.enCarrito(p.id));
      out.textContent = String(Math.max(1, Math.min(libre, (Number(out.textContent) || 1) + Number(paso.dataset.paso))));
      syncStepper(st, p);
      return;
    }
    const add = e.target.closest('[data-add]');
    const comprar = e.target.closest('[data-comprar]');
    if (add || comprar) {
      const id = (add || comprar).dataset.add || (add || comprar).dataset.comprar;
      const p = getProducto(id);
      if (!p) return;
      const card = (add || comprar).closest('.card');
      const out = card?.querySelector('[data-stepper] output');
      const qty = Number(out?.textContent) || 1;
      if (comprar) {
        const ok = Cart.add(p, qty);
        if (!ok && !Cart.enCarrito(p.id)) { showToast('Sin stock por ahora: consultanos por WhatsApp.'); return; }
        if (out) out.textContent = '1';
        abrirDrawer();
        return;
      }
      if (sumarAlCarrito(p, qty) && out) out.textContent = '1';
      return;
    }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#filtros')) { e.preventDefault(); filtrarPor('sis', cat.dataset.cat); return; }
    const atajo = e.target.closest('[data-encastre]');
    if (atajo) { e.preventDefault(); filtrarPor('enc', atajo.dataset.encastre); return; }
    const verTodo = e.target.closest('[data-ver-todo]');
    if (verTodo) { e.preventDefault(); filtrarPor(''); return; }
    const buscar = e.target.closest('[data-ir-buscar]');
    if (buscar) {
      const q = document.getElementById(ES_M2 ? 'q2' : 'q') || document.getElementById('q2');
      if (!q) return;
      q.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => q.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
    }
  });
}

/* ---------- flotantes, badge, nav ---------- */
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

function updateCartBadge(bump = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n && bump && !reduceMotion) b.classList.add('bump');
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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

/* ---------- entradas ---------- */
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
  tl.from(hero.querySelectorAll('.hero2__logo, .hero__logo'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.22)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.busca--hero, .hero-botones .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-atajos__t, .atajo'), { y: 14, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.74)
    .from(hero.querySelectorAll('.hero-auto, .hero2__sello'), { y: 16, scale: 0.94, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
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

/* ---------- arranque ---------- */
sanearCarrito();
initModelBarScroll();
initRail();
initCatalogo();
initFiltrosPanel();
initLampara();
initSecuencia();
initReveals();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initHeroMotion();
initNav();
initDrawer();
initModal();
initClicks();
initFloats();
initMapa();
updateCartBadge(false);
document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarCards(); });
document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
