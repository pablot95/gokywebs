const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491166510251';
const ENVIO_GRATIS_DESDE = 45000;
const DESC_BULTO = 12;
const POR_PAGINA = 12;

const CATEGORIAS = [
  { id: 'pisos', nombre: 'Pisos y multiuso', sub: 'Desodorantes, ceras y multiuso', tint: '#2563eb', still: ['bidon', 'botella', 'rociador'] },
  { id: 'cocina', nombre: 'Cocina', sub: 'Detergentes y desengrasantes', tint: '#16a34a', still: ['botella', 'rociador', 'esponja'] },
  { id: 'bano', nombre: 'Baño y desinfección', sub: 'Sanitarios, alcohol y jabón', tint: '#1b4bc4', still: ['rociador', 'botella', 'bidon'] },
  { id: 'ropa', nombre: 'Ropa y lavadero', sub: 'Jabón, suavizante y lavandina', tint: '#3b82f6', still: ['bidon', 'botella', 'pack'] },
  { id: 'vidrios', nombre: 'Vidrios y muebles', sub: 'Limpiavidrios y lustramuebles', tint: '#60a5fa', still: ['rociador', 'aerosol', 'pano'] },
  { id: 'papel', nombre: 'Papelería', sub: 'Higiénico, bobinas y servilletas', tint: '#475569', still: ['rollo', 'pack', 'rollo'] },
  { id: 'acc', nombre: 'Accesorios', sub: 'Paños, baldes, mopas y guantes', tint: '#22c55e', still: ['balde', 'mopa', 'guante'] },
  { id: 'pro', nombre: 'Línea profesional', sub: 'Bidones y alto tránsito', tint: '#0d1626', still: ['bidon', 'bidon', 'balde'] },
];

const GRUPOS = [
  { id: 'chico', nombre: 'Hasta 1 L' },
  { id: 'bidon', nombre: 'Bidón 3 L o más' },
  { id: 'seco', nombre: 'Packs y accesorios' },
];

const P = (id, cat, nombre, pres, precio, tipo, grupo, d, extra) =>
  Object.assign({ id, cat, nombre, pres, precio, tipo, grupo, d, descuento: 0, bulto: 0, badge: '', destacado: false, uso: '' }, extra || {});

const PRODUCTOS = [
  P('pi-01', 'pisos', 'Desodorante de piso Lavanda', '900 ml', 3290, 'botella', 'chico', 'Concentrado para pisos: una tapita en medio balde perfuma toda la casa.', { bulto: 12, destacado: true, badge: 'top', uso: '1 tapita cada 5 L de agua' }),
  P('pi-02', 'pisos', 'Desodorante de piso Bosque', '900 ml', 3290, 'botella', 'chico', 'La versión amaderada del clásico, para ambientes grandes y ventilados.', { bulto: 12, uso: '1 tapita cada 5 L de agua' }),
  P('pi-03', 'pisos', 'Desodorante de piso concentrado Marina', '5 L', 11900, 'bidon', 'bidon', 'El bidón que usan los edificios: rinde hasta 250 baldes y baja el costo por metro.', { bulto: 4, descuento: 10, badge: 'off', uso: '20 ml cada 5 L de agua' }),
  P('pi-04', 'pisos', 'Limpiador multiuso con amoníaco', '1 L', 2980, 'botella', 'chico', 'Para pisos, zócalos y superficies lavables sin dejar película.', { bulto: 12, uso: 'Diluir 1 en 20' }),
  P('pi-05', 'pisos', 'Cera líquida autobrillo incolora', '900 ml', 5600, 'botella', 'chico', 'Brillo sin lustradora sobre calcáreo, granito y cemento alisado.', { bulto: 6, uso: 'Aplicar con mopa sobre piso seco' }),
  P('pi-06', 'pisos', 'Limpiador para porcelanato', '5 L', 13400, 'bidon', 'bidon', 'Fórmula sin cera: no opaca el porcelanato ni deja huellas.', { bulto: 4, uso: '30 ml cada 5 L de agua' }),
  P('pi-07', 'pisos', 'Jabón líquido para pisos de madera', '1 L', 6200, 'botella', 'chico', 'Limpia y nutre parquet, flotante y machimbre sin saturar de agua.', { uso: '15 ml cada 5 L de agua' }),
  P('pi-08', 'pisos', 'Multiuso gatillo Lavanda', '500 ml', 2650, 'rociador', 'chico', 'El gatillo de todos los días para mesadas, puertas y muebles.', { bulto: 12, badge: 'new', uso: 'Listo para usar' }),

  P('co-01', 'cocina', 'Detergente concentrado limón', '750 ml', 2850, 'botella', 'chico', 'Corta la grasa con poca cantidad y enjuaga rápido: menos agua por vajilla.', { bulto: 12, destacado: true, badge: 'top', uso: '5 ml por pileta' }),
  P('co-02', 'cocina', 'Detergente concentrado limón', '5 L', 13900, 'bidon', 'bidon', 'El mismo detergente en bidón, para bares, cocinas y familias grandes.', { bulto: 4, descuento: 8, badge: 'off', uso: '5 ml por pileta' }),
  P('co-03', 'cocina', 'Desengrasante gatillo cocina', '500 ml', 4180, 'rociador', 'chico', 'Disuelve grasa quemada de anafes, azulejos y campanas sin frotar de más.', { bulto: 12, uso: 'Rociar, esperar 2 minutos y pasar el paño' }),
  P('co-04', 'cocina', 'Desengrasante recarga', '1 L', 5900, 'doypack', 'chico', 'Recarga en doypack: llenás el gatillo tres veces y tirás mucho menos plástico.', { bulto: 12, badge: 'new', uso: 'Rellenar el gatillo' }),
  P('co-05', 'cocina', 'Limpiador de hornos y parrillas', '500 ml', 5400, 'rociador', 'chico', 'Para grasa carbonizada: actúa en frío y no raya el esmalte.', { uso: 'Aplicar en frío, dejar 10 minutos' }),
  P('co-06', 'cocina', 'Antigrasa industrial para campanas', '5 L', 18600, 'bidon', 'bidon', 'Concentrado de cocina profesional: se diluye según cuánta grasa haya.', { uso: 'Diluir de 1 en 5 a 1 en 20' }),
  P('co-07', 'cocina', 'Limpiador en polvo con bicarbonato', '500 g', 2300, 'frasco', 'seco', 'Abrasivo suave para piletas, hornallas y juntas sin rayar el acero.', { bulto: 12, uso: 'Espolvorear sobre superficie húmeda' }),
  P('co-08', 'cocina', 'Esponja doble faz reforzada x3', 'pack x3', 1980, 'esponja', 'seco', 'Cara verde que no se deshace a la semana y espuma que rinde.', { bulto: 24, uso: 'Uso general de cocina' }),

  P('ba-01', 'bano', 'Limpiador de baño gatillo', '500 ml', 3480, 'rociador', 'chico', 'Saca sarro y jabón de azulejos, mampara y grifería en una pasada.', { bulto: 12, destacado: true, uso: 'Listo para usar' }),
  P('ba-02', 'bano', 'Limpiador cremoso para sanitarios', '750 ml', 3950, 'botella', 'chico', 'Crema espesa que se queda en la pared del inodoro y trabaja sola.', { uso: 'Aplicar y dejar actuar 5 minutos' }),
  P('ba-03', 'bano', 'Desincrustante para inodoros', '1 L', 4600, 'botella', 'chico', 'Ataca el sarro viejo del fondo del inodoro y de los mingitorios.', { bulto: 12, uso: 'Aplicar puro bajo el borde' }),
  P('ba-04', 'bano', 'Pastilla adhesiva para inodoro x3', 'pack x3', 2750, 'pack', 'seco', 'Tres pastillas que perfuman y dejan una película que evita el sarro.', { bulto: 12, uso: 'Una pastilla cada 3 semanas' }),
  P('ba-05', 'bano', 'Desinfectante de amplio espectro', '1 L', 4900, 'botella', 'chico', 'Para baños, cocinas y superficies de contacto frecuente.', { bulto: 12, uso: 'Diluir 1 en 10' }),
  P('ba-06', 'bano', 'Desinfectante de amplio espectro', '5 L', 17500, 'bidon', 'bidon', 'El bidón para consorcios: rinde 50 litros de solución lista.', { descuento: 10, badge: 'off', uso: 'Diluir 1 en 10' }),
  P('ba-07', 'bano', 'Jabón líquido para manos', '5 L', 9800, 'bidon', 'bidon', 'Para recargar dispensers de oficinas, colegios y baños de comercio.', { bulto: 4, uso: 'Recarga de dispenser' }),
  P('ba-08', 'bano', 'Alcohol en gel', '1 L', 4750, 'botella', 'chico', 'Gel al 70% con glicerina, para mostrador o recepción.', { bulto: 12, uso: 'Listo para usar' }),

  P('ro-01', 'ropa', 'Jabón líquido para ropa', '3 L', 9700, 'bidon', 'bidon', 'Rinde 60 lavados y se disuelve bien en agua fría.', { bulto: 4, destacado: true, uso: '50 ml por lavado' }),
  P('ro-02', 'ropa', 'Jabón líquido para ropa de color', '5 L', 14200, 'bidon', 'bidon', 'Sin blanqueadores ópticos: cuida el color lavado tras lavado.', { descuento: 12, badge: 'off', uso: '50 ml por lavado' }),
  P('ro-03', 'ropa', 'Suavizante concentrado Violetas', '900 ml', 3700, 'botella', 'chico', 'Concentrado: media tapita alcanza y la ropa sale suave igual.', { bulto: 12, uso: '15 ml por lavado' }),
  P('ro-04', 'ropa', 'Suavizante concentrado Violetas', '5 L', 13800, 'bidon', 'bidon', 'El bidón del suavizante que más sale, para lavaderos y familias.', { bulto: 4, uso: '15 ml por lavado' }),
  P('ro-05', 'ropa', 'Quitamanchas en polvo', '1 kg', 6400, 'pack', 'seco', 'Para prendas blancas y de color: saca vino, café y transpiración.', { uso: 'Remojar 30 minutos' }),
  P('ro-06', 'ropa', 'Lavandina en gel', '1 L', 2100, 'botella', 'chico', 'Gel que no chorrea: se queda donde lo aplicás y rinde más.', { bulto: 12, uso: 'Diluir 1 en 10' }),
  P('ro-07', 'ropa', 'Lavandina común', '5 L', 6300, 'bidon', 'bidon', 'El bidón de siempre, con concentración estable de principio a fin.', { bulto: 4, uso: 'Diluir 1 en 10' }),

  P('vi-01', 'vidrios', 'Limpiavidrios gatillo', '500 ml', 3150, 'rociador', 'chico', 'Se evapora parejo: no deja marcas ni arcoíris contra la luz.', { bulto: 12, destacado: true, uso: 'Rociar y secar con microfibra' }),
  P('vi-02', 'vidrios', 'Limpiavidrios recarga', '5 L', 12700, 'bidon', 'bidon', 'Para vidrieras y edificios con mucha superficie de cristal.', { uso: 'Listo para usar' }),
  P('vi-03', 'vidrios', 'Lustramuebles en aerosol', '360 ml', 4900, 'aerosol', 'seco', 'Limpia, protege y deja los muebles sin pegote ni polvo pegado.', { bulto: 12, uso: 'Rociar sobre el paño, no sobre la madera' }),
  P('vi-04', 'vidrios', 'Limpiador de acero inoxidable', '500 ml', 5300, 'rociador', 'chico', 'Saca huellas de heladeras, hornos y mesadas de acero.', { uso: 'Pasar siguiendo la veta' }),
  P('vi-05', 'vidrios', 'Paño de microfibra para vidrios x2', 'pack x2', 3400, 'pano', 'seco', 'Trama fina que levanta la humedad sin dejar pelusa.', { bulto: 12, badge: 'new', uso: 'Lavar sin suavizante' }),
  P('vi-06', 'vidrios', 'Secador de vidrios profesional 35 cm', '35 cm', 7900, 'mopa', 'seco', 'Goma de recambio y mango de aluminio: el de los limpiavidrios de oficio.', { uso: 'Pasadas superpuestas de arriba hacia abajo' }),

  P('pa-01', 'papel', 'Papel higiénico doble hoja x4', '30 m', 5400, 'pack', 'seco', 'Doble hoja blanca para casa, oficina chica y consultorio.', { bulto: 10, uso: 'Rollos de 30 m' }),
  P('pa-02', 'papel', 'Papel higiénico hoja simple x4', '80 m', 6900, 'pack', 'seco', 'El rendidor de los edificios: 80 metros por rollo.', { bulto: 10, uso: 'Rollos de 80 m' }),
  P('pa-03', 'papel', 'Rollo de cocina x3', '100 paños', 5800, 'rollo', 'seco', 'Paño grande y resistente en mojado, con corte parejo.', { bulto: 8, destacado: true, uso: '3 rollos de 100 paños' }),
  P('pa-04', 'papel', 'Bobina industrial blanca', '300 m', 19400, 'rollo', 'seco', 'Para talleres, cocinas y depósitos donde el rollo chico no alcanza.', { uso: 'Requiere portarrollo industrial' }),
  P('pa-05', 'papel', 'Toalla intercalada x2', '200 hojas', 8600, 'pack', 'seco', 'Hoja a hoja para dispenser: se usa menos papel por lavado de manos.', { bulto: 10, uso: 'Compatible con dispenser estándar' }),
  P('pa-06', 'papel', 'Servilletas blancas x500', 'pack x500', 3900, 'pack', 'seco', 'Tamaño bar, para rotisería, café y salón.', { bulto: 12, uso: '500 unidades' }),
  P('pa-07', 'papel', 'Papel higiénico institucional x8', '300 m', 28500, 'pack', 'seco', 'Ocho rollos de 300 metros para baños de mucho tránsito.', { descuento: 8, badge: 'off', uso: 'Requiere dispenser institucional' }),

  P('ac-01', 'acc', 'Guantes de látex reforzados talle M', 'talle M', 2450, 'guante', 'seco', 'Interior floculado y puño largo: aguantan lavandina sin ponerse rígidos.', { bulto: 12, uso: 'Enjuagar y secar después de usar' }),
  P('ac-02', 'acc', 'Guantes de látex reforzados talle L', 'talle L', 2450, 'guante', 'seco', 'El mismo guante en talle grande, para manos anchas.', { bulto: 12, uso: 'Enjuagar y secar después de usar' }),
  P('ac-03', 'acc', 'Trapo de piso de algodón grueso', 'unidad', 2900, 'pano', 'seco', 'Algodón de verdad: absorbe el balde entero y no se deshilacha.', { bulto: 12, uso: 'Lavar con agua caliente' }),
  P('ac-04', 'acc', 'Rejilla de algodón x3', 'pack x3', 2200, 'pano', 'seco', 'Las de la cocina, con borde reforzado para que duren el mes.', { bulto: 24, uso: 'Uso general' }),
  P('ac-05', 'acc', 'Paños multiuso de microfibra x5', 'pack x5', 4300, 'pano', 'seco', 'Cinco colores para no cruzar baño con cocina.', { bulto: 12, destacado: true, badge: 'new', uso: 'Lavar sin suavizante' }),
  P('ac-06', 'acc', 'Balde reforzado 12 L con pico', '12 L', 6800, 'balde', 'seco', 'Plástico grueso con pico vertedor y manija de metal.', { uso: 'Capacidad 12 litros' }),
  P('ac-07', 'acc', 'Mopa plana con mango telescópico', '40 cm', 12900, 'mopa', 'seco', 'Repuesto lavable de microfibra y mango que llega hasta 1,60 m.', { uso: 'Repuesto lavable incluido' }),
  P('ac-08', 'acc', 'Escoba de cerda suave con mango', 'unidad', 7400, 'mopa', 'seco', 'Cerda suave para pisos lisos: junta el polvo fino sin volarlo.', { uso: 'Mango de madera incluido' }),
  P('ac-09', 'acc', 'Secador de piso 45 cm', '45 cm', 8200, 'mopa', 'seco', 'Goma doble labio: deja el piso casi seco en una pasada.', { uso: 'Goma de recambio disponible' }),

  P('pr-01', 'pro', 'Detergente concentrado industrial', '20 L', 58900, 'bidon', 'bidon', 'Bidón de 20 litros para cocinas industriales y rotiserías.', { uso: 'Diluir de 1 en 10 a 1 en 40' }),
  P('pr-02', 'pro', 'Desodorante de piso concentrado', '20 L', 52400, 'bidon', 'bidon', 'El formato de mayor rendimiento por litro del catálogo.', { descuento: 10, badge: 'off', uso: '20 ml cada 5 L de agua' }),
  P('pr-03', 'pro', 'Desinfectante de amonio cuaternario', '5 L', 21900, 'bidon', 'bidon', 'Desinfección de superficies en gastronomía, salud y colegios.', { destacado: true, uso: 'Diluir según ficha técnica' }),
  P('pr-04', 'pro', 'Limpiador enzimático para cañerías', '1 L', 8900, 'botella', 'chico', 'Enzimas que comen la grasa de la cañería sin dañar el caño.', { uso: 'Aplicar de noche, una vez por semana' }),
  P('pr-05', 'pro', 'Cera acrílica de alto tránsito', '5 L', 27500, 'bidon', 'bidon', 'Película dura para halls y pasillos que se pisan todo el día.', { uso: '2 a 3 manos con mopa aplicadora' }),
  P('pr-06', 'pro', 'Removedor de cera', '5 L', 19800, 'bidon', 'bidon', 'Levanta capas viejas de cera antes de encerar de nuevo.', { uso: 'Diluir 1 en 5' }),
  P('pr-07', 'pro', 'Carro de limpieza doble balde 2x25 L', '2x25 L', 148000, 'balde', 'seco', 'Prensa mopa, dos baldes y ruedas: el carro de los edificios.', { uso: 'Incluye prensa y bolsa portaresiduos' }),
  P('pr-08', 'pro', 'Dispenser de jabón líquido 1 L', '1 L', 16400, 'pack', 'seco', 'ABS blanco con llave, para baños de comercio y oficina.', { uso: 'Compatible con recarga de 5 L' }),
];

const ENVASES = {
  botella: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="22" width="20" height="15" rx="4" fill="currentColor"/><rect x="53" y="35" width="14" height="13" fill="#dde5ee"/><path d="M53 46c-12 6-19 17-19 31v63a10 10 0 0 0 10 10h32a10 10 0 0 0 10-10V77c0-14-7-25-19-31z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="36" y="88" width="48" height="36" rx="3" fill="currentColor" opacity=".16"/><rect x="36" y="88" width="48" height="9" fill="currentColor"/><rect x="43" y="106" width="26" height="4" rx="2" fill="currentColor" opacity=".5"/><rect x="43" y="114" width="18" height="4" rx="2" fill="currentColor" opacity=".3"/></svg>`,
  rociador: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 20h22a8 8 0 0 1 8 8v12H56z" fill="currentColor"/><path d="M56 28H42L29 48h17l10-10z" fill="currentColor" opacity=".78"/><rect x="56" y="40" width="16" height="10" fill="#dde5ee"/><path d="M46 48h26a14 14 0 0 1 14 14v76a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10V62a14 14 0 0 1 12-14z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="36" y="86" width="48" height="36" rx="3" fill="currentColor" opacity=".16"/><rect x="36" y="86" width="48" height="9" fill="currentColor"/><rect x="43" y="104" width="26" height="4" rx="2" fill="currentColor" opacity=".5"/></svg>`,
  bidon: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="16" width="24" height="14" rx="4" fill="currentColor"/><rect x="34" y="28" width="16" height="12" fill="#dde5ee"/><path d="M34 38h48a14 14 0 0 1 14 14v86a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V52a14 14 0 0 1 12-14z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="64" y="52" width="26" height="34" rx="12" fill="none" stroke="rgba(13,22,38,.15)" stroke-width="7"/><rect x="26" y="96" width="66" height="38" rx="3" fill="currentColor" opacity=".16"/><rect x="26" y="96" width="66" height="10" fill="currentColor"/><rect x="34" y="115" width="30" height="5" rx="2.5" fill="currentColor" opacity=".5"/></svg>`,
  doypack: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 40h56l-5 100a10 10 0 0 1-10 9H47a10 10 0 0 1-10-9z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="28" y="28" width="64" height="13" rx="4" fill="currentColor"/><path d="M84 26l14-8 5 12-13 7z" fill="currentColor" opacity=".8"/><rect x="38" y="72" width="44" height="42" rx="3" fill="currentColor" opacity=".18"/><rect x="38" y="72" width="44" height="10" fill="currentColor"/><rect x="45" y="92" width="24" height="4" rx="2" fill="currentColor" opacity=".5"/></svg>`,
  aerosol: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 16h20v9H50z" fill="currentColor"/><rect x="44" y="24" width="32" height="18" rx="6" fill="currentColor" opacity=".82"/><path d="M42 42h36a8 8 0 0 1 8 8v88a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10V50a8 8 0 0 1 8-8z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="36" y="84" width="48" height="38" rx="3" fill="currentColor" opacity=".16"/><rect x="36" y="84" width="48" height="10" fill="currentColor"/><rect x="43" y="103" width="24" height="4" rx="2" fill="currentColor" opacity=".5"/></svg>`,
  frasco: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="44" width="64" height="18" rx="6" fill="currentColor"/><path d="M34 62h52a6 6 0 0 1 6 6v70a10 10 0 0 1-10 10H38a10 10 0 0 1-10-10V68a6 6 0 0 1 6-6z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="32" y="88" width="56" height="34" rx="3" fill="currentColor" opacity=".16"/><rect x="32" y="88" width="56" height="9" fill="currentColor"/><rect x="41" y="105" width="26" height="4" rx="2" fill="currentColor" opacity=".5"/></svg>`,
  pack: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 48h72a6 6 0 0 1 6 6v88a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V54a6 6 0 0 1 6-6z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><path d="M18 48l14-14h56l14 14z" fill="currentColor" opacity=".85"/><rect x="18" y="82" width="84" height="12" fill="currentColor"/><rect x="30" y="104" width="42" height="5" rx="2.5" fill="currentColor" opacity=".45"/><rect x="30" y="116" width="26" height="5" rx="2.5" fill="currentColor" opacity=".28"/></svg>`,
  rollo: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 50h68v78a34 13 0 0 1-68 0z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><ellipse cx="60" cy="50" rx="34" ry="13" fill="#fff" stroke="rgba(13,22,38,.14)" stroke-width="2"/><ellipse cx="60" cy="50" rx="12" ry="4.6" fill="currentColor" opacity=".35"/><rect x="26" y="86" width="68" height="14" fill="currentColor" opacity=".2"/><rect x="26" y="86" width="68" height="4" fill="currentColor"/></svg>`,
  esponja: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 64h80a8 8 0 0 1 8 8v22H12V72a8 8 0 0 1 8-8z" fill="currentColor"/><circle cx="32" cy="78" r="3.4" fill="#fff" opacity=".45"/><circle cx="52" cy="84" r="2.8" fill="#fff" opacity=".4"/><circle cx="72" cy="76" r="3.2" fill="#fff" opacity=".45"/><circle cx="90" cy="85" r="2.6" fill="#fff" opacity=".35"/><path d="M12 94h96v28a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/></svg>`,
  pano: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="112" width="88" height="26" rx="9" fill="currentColor" opacity=".85"/><rect x="20" y="88" width="82" height="26" rx="9" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="24" y="64" width="76" height="26" rx="9" fill="currentColor" opacity=".45"/><rect x="34" y="72" width="30" height="4" rx="2" fill="#fff" opacity=".5"/><rect x="32" y="96" width="34" height="4" rx="2" fill="currentColor" opacity=".3"/></svg>`,
  balde: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 26C34 6 86 6 90 26" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M26 62h68l-8 76a10 10 0 0 1-10 9H44a10 10 0 0 1-10-9z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><rect x="20" y="52" width="80" height="14" rx="7" fill="currentColor"/><rect x="31" y="92" width="58" height="12" fill="currentColor" opacity=".2"/></svg>`,
  mopa: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="55" y="14" width="10" height="98" rx="5" fill="currentColor" opacity=".8"/><rect x="50" y="16" width="20" height="9" rx="4.5" fill="currentColor"/><path d="M24 110h72a6 6 0 0 1 6 6v10H18v-10a6 6 0 0 1 6-6z" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/><path d="M18 126h84v14a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z" fill="currentColor" opacity=".6"/></svg>`,
  guante: `<svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="33" y="34" width="13" height="46" rx="6.5" fill="currentColor"/><rect x="49" y="24" width="13" height="56" rx="6.5" fill="currentColor"/><rect x="65" y="30" width="13" height="50" rx="6.5" fill="currentColor"/><rect x="81" y="46" width="13" height="34" rx="6.5" fill="currentColor" opacity=".85"/><path d="M31 72h64v42a26 26 0 0 1-26 26H57a26 26 0 0 1-26-26z" fill="currentColor"/><rect x="28" y="126" width="70" height="22" rx="7" fill="#f5f8fb" stroke="rgba(13,22,38,.14)" stroke-width="2"/></svg>`,
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioBulto = p => Math.round(precioFinal(p) * p.bulto * (1 - DESC_BULTO / 100));
const precioPres = (p, pres) => pres === 'b' && p.bulto ? precioBulto(p) : precioFinal(p);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(DIACRITICOS, '');
const envase = (tipo, tint) => `<span class="env" style="--tint:${tint}">${ENVASES[tipo] || ENVASES.botella}</span>`;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  tacho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>',
};

const BADGES = { off: p => `<span class="badge badge--off"><span>-${p.descuento}%</span></span>`, new: () => '<span class="badge badge--new"><span>Nuevo</span></span>', top: () => '<span class="badge badge--top"><span>Más pedido</span></span>' };

const Cart = {
  KEY: 'magical_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, pres = 'u') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.pres === pres);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, pres, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, pres, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.pres === pres); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(id, pres) { this.save(this.get().filter(i => !(i.id === id && i.pres === pres))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioPres(p, i.pres) * i.qty : s; }, 0); },
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

function precioHtml(p) {
  const fin = precioFinal(p);
  return p.descuento > 0
    ? `<strong class="off">${formatearPrecio(fin)}</strong><s>${formatearPrecio(p.precio)}</s>`
    : `<strong>${formatearPrecio(fin)}</strong>`;
}

function qtyHtml(id, val) {
  return `<div class="qty" data-qty="${id}">
    <button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button>
    <span data-val>${val}</span>
    <button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button>
  </div>`;
}

function cardHtml(p) {
  const cat = getCategoria(p.cat);
  return `<article class="pcard" data-flip-id="p-${p.id}" data-id="${p.id}">
    <button type="button" class="pcard-media tinted" style="--tint:${cat?.tint || '#2563eb'}" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${envase(p.tipo, cat?.tint || '#2563eb')}
      <span class="sheen"></span>
      <span class="pcard-badges">${p.badge && BADGES[p.badge] ? BADGES[p.badge](p) : ''}</span>
      ${p.bulto ? `<span class="pcard-bulto">Bulto x${p.bulto} · -${DESC_BULTO}%</span>` : ''}
    </button>
    <div class="pcard-body">
      <span class="pcard-cat">${esc(cat?.nombre || '')} · ${esc(p.pres)}</span>
      <h3 class="pcard-name"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="pcard-price">${precioHtml(p)}</div>
      <div class="pcard-actions">
        ${qtyHtml('c-' + p.id, 1)}
        <button type="button" class="btn-add" data-add="${p.id}">${ICO.carrito}<span>Agregar</span></button>
      </div>
    </div>
  </article>`;
}

function destacadoHtml(p, i) {
  const cat = getCategoria(p.cat);
  return `<article class="dcard" data-animate style="transform:translateY(28px);opacity:0" data-id="${p.id}">
    <button type="button" class="dcard-media tinted" style="--tint:${cat?.tint || '#2563eb'}" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${envase(p.tipo, cat?.tint || '#2563eb')}
      <span class="sheen"></span>
      <span class="dcard-rank">${String(i + 1).padStart(2, '0')}</span>
      <span class="pcard-badges">${p.badge && BADGES[p.badge] ? BADGES[p.badge](p) : ''}</span>
      <span class="dcard-quick">Ver la ficha</span>
    </button>
    <div class="dcard-body">
      <span class="pcard-cat">${esc(cat?.nombre || '')} · ${esc(p.pres)}</span>
      <h3 class="pcard-name"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="pcard-price">${precioHtml(p)}</div>
      <div class="pcard-actions">
        ${qtyHtml('d-' + p.id, 1)}
        <button type="button" class="btn-add" data-add="${p.id}">${ICO.carrito}<span>Agregar</span></button>
      </div>
    </div>
  </article>`;
}

function renderDestacados() {
  const cont = document.getElementById('destGrid');
  if (!cont) return;
  cont.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(destacadoHtml).join('');
}

function renderRail() {
  const rail = document.getElementById('catRail');
  if (!rail) return;
  rail.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<button type="button" class="rail-card" data-cat="${c.id}" style="--tint:${c.tint}">
      <span class="rail-media tinted">
        <span class="rail-still">${c.still.map(t => envase(t, c.tint)).join('')}</span>
        <span class="sheen"></span>
      </span>
      <span class="rail-body">
        <span class="rail-txt"><span class="rail-name">${esc(c.nombre)}</span><span class="rail-sub">${n} artículos · ${esc(c.sub)}</span></span>
        <span class="rail-go">${ICO.flecha}</span>
      </span>
    </button>`;
  }).join('');
}

const estado = { cat: 'all', grupo: 'all', oferta: false, bulto: false, q: '', orden: 'rel', visibles: POR_PAGINA };

function filtrados() {
  const q = norm(estado.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (estado.grupo !== 'all' && p.grupo !== estado.grupo) return false;
    if (estado.oferta && !p.descuento) return false;
    if (estado.bulto && !p.bulto) return false;
    if (!palabras.length) return true;
    const heno = norm([p.nombre, p.pres, p.d, p.uso, getCategoria(p.cat)?.nombre, p.tipo].join(' '));
    return palabras.every(w => heno.includes(w));
  });
  const orden = estado.orden;
  if (orden === 'asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (orden === 'az') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado - a.destacado) || (b.descuento - a.descuento));
  return lista;
}

let primerRender = true;

function renderCatalogo(animar) {
  const grid = document.getElementById('prodGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!grid) return;

  const lista = filtrados();
  const visibles = lista.slice(0, estado.visibles);
  const state = (animar && !primerRender && window.Flip && !reduceMotion) ? window.Flip.getState('.pcard') : null;

  grid.innerHTML = visibles.map(cardHtml).join('');
  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  verMas.parentElement.hidden = lista.length <= estado.visibles;
  res.textContent = lista.length === 0 ? 'Sin resultados' : `${lista.length} ${lista.length === 1 ? 'artículo' : 'artículos'}`;

  const filtrosActivos = (estado.cat !== 'all') + (estado.grupo !== 'all') + (estado.oferta ? 1 : 0) + (estado.bulto ? 1 : 0) + (estado.q.trim() ? 1 : 0);
  const limpiar = document.getElementById('limpiarFiltros');
  const count = document.getElementById('filtrosCount');
  limpiar.hidden = filtrosActivos === 0;
  count.hidden = filtrosActivos === 0;
  count.textContent = filtrosActivos;

  if (state) {
    window.Flip.from(state, {
      duration: .55, ease: 'power2.inOut', absolute: true, stagger: .015,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .45, stagger: .02, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .92, duration: .25 }),
    });
  } else if (primerRender && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo('#prodGrid .pcard', { y: 44, opacity: 0 }, {
      y: 0, opacity: 1, duration: .75, stagger: .05, ease: 'power3.out',
      scrollTrigger: typeof ScrollTrigger !== 'undefined' ? { trigger: '#prodGrid', start: 'top 88%' } : undefined,
    });
  }
  primerRender = false;
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function renderChips() {
  const cCat = document.getElementById('chipsCat');
  const cPres = document.getElementById('chipsPres');
  if (!cCat || !cPres) return;
  cCat.innerHTML = `<button type="button" class="chip ${estado.cat === 'all' ? 'on' : ''}" data-fcat="all">Todos</button>` +
    CATEGORIAS.map(c => `<button type="button" class="chip ${estado.cat === c.id ? 'on' : ''}" data-fcat="${c.id}">${esc(c.nombre)}</button>`).join('');
  cPres.innerHTML = `<button type="button" class="chip ${estado.grupo === 'all' ? 'on' : ''}" data-fgru="all">Todas</button>` +
    GRUPOS.map(g => `<button type="button" class="chip ${estado.grupo === g.id ? 'on' : ''}" data-fgru="${g.id}">${esc(g.nombre)}</button>`).join('') +
    `<button type="button" class="chip ${estado.oferta ? 'on' : ''}" data-fext="oferta">En oferta</button>` +
    `<button type="button" class="chip ${estado.bulto ? 'on' : ''}" data-fext="bulto">Con bulto</button>`;
}

function aplicarFiltros() { estado.visibles = POR_PAGINA; renderChips(); renderCatalogo(true); }

function scrollA(el, extra) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - (extra || 84);
  window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* ---------- carrito ---------- */
function renderCart() {
  const cont = document.getElementById('cartItems');
  const badge = document.getElementById('cartBadge');
  const total = document.getElementById('cartTotal');
  if (!cont) return;
  const items = Cart.get();
  const count = Cart.count();

  badge.textContent = count;
  badge.style.display = count ? 'grid' : 'none';
  total.textContent = formatearPrecio(Cart.total());

  if (!items.length) {
    cont.innerHTML = `<div class="cart-empty">
      <span aria-hidden="true">${ICO.carrito}</span>
      <h3>Todavía no cargaste nada</h3>
      <p>Agregá lo que necesitás y te pasamos el total por WhatsApp antes de salir.</p>
      <button type="button" class="btn btn-primary btn-sm" data-cerrar-carrito>Ver el catálogo</button>
    </div>`;
  } else {
    cont.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      const cat = getCategoria(p.cat);
      const unit = precioPres(p, i.pres);
      return `<div class="citem">
        ${envase(p.tipo, cat?.tint || '#2563eb')}
        <div>
          <p class="citem-name">${esc(p.nombre)}</p>
          <p class="citem-sub">${esc(p.pres)}${i.pres === 'b' ? ` · <b>Bulto x${p.bulto}</b>` : ''}</p>
          <div class="citem-bot">${qtyHtml(p.id + '|' + i.pres, i.qty)}</div>
        </div>
        <div>
          <p class="citem-price">${formatearPrecio(unit * i.qty)}</p>
          <button type="button" class="citem-del" data-del="${p.id}|${i.pres}" aria-label="Quitar ${esc(p.nombre)}">${ICO.tacho}</button>
        </div>
      </div>`;
    }).join('');
  }

  const falta = ENVIO_GRATIS_DESDE - Cart.total();
  const bar = document.getElementById('envioBar');
  const msg = document.getElementById('envioMsg');
  const fill = document.getElementById('envioFill');
  if (falta > 0) {
    bar.classList.remove('full');
    msg.textContent = `Te faltan ${formatearPrecio(falta)} para el envío sin cargo`;
    fill.style.width = Math.min(100, (Cart.total() / ENVIO_GRATIS_DESDE) * 100) + '%';
  } else {
    bar.classList.add('full');
    msg.textContent = '¡Tenés envío sin cargo en CABA y GBA! 🎉';
    fill.style.width = '100%';
  }
}

function mensajeWsp() {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const unidad = i.pres === 'b' ? ` (bulto x${p.bulto})` : '';
    return `• ${i.qty}x ${p.nombre} ${p.pres}${unidad} — ${formatearPrecio(precioPres(p, i.pres) * i.qty)}`;
  }).filter(Boolean);
  const total = Cart.total();
  const envio = total >= ENVIO_GRATIS_DESDE ? 'Envío sin cargo' : 'Consultar costo de envío';
  return `Hola Magical Argentina, quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${formatearPrecio(total)}\n${envio}\n\n¿Me confirman stock y entrega?`;
}

/* ---------- drawer y modal ---------- */
let ultimoFoco = null;

function trapFocus(cont, e) {
  const foco = cont.querySelectorAll('a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirCarrito() {
  const d = document.getElementById('cartDrawer'), b = document.getElementById('drawerBackdrop');
  ultimoFoco = document.activeElement;
  d.hidden = false; b.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); b.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose').focus();
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer'), b = document.getElementById('drawerBackdrop');
  d.classList.remove('open'); b.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; b.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const cat = getCategoria(p.cat);
  const modal = document.getElementById('modal');
  const card = document.getElementById('modalCard');
  if (modal.hidden) ultimoFoco = document.activeElement;

  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  card.innerHTML = `
    <button type="button" class="modal-close" id="modalClose" aria-label="Cerrar la ficha"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-grid">
      <div class="modal-media tinted" style="--tint:${cat?.tint || '#2563eb'}">${envase(p.tipo, cat?.tint || '#2563eb')}</div>
      <div class="modal-body">
        <span class="modal-cat">${esc(cat?.nombre || '')} · ${esc(p.pres)}</span>
        <h2 id="modalTitle">${esc(p.nombre)}</h2>
        <p class="modal-desc">${esc(p.d)}</p>
        <div class="modal-price" id="modalPrecio">${precioHtml(p)}</div>
        ${p.bulto ? `<div class="pres-switch">
          <span class="filtro-label">Cómo lo llevás</span>
          <div class="pres-opts" id="presOpts">
            <button type="button" class="pres-opt on" data-pres="u"><b>Por unidad</b><span>${formatearPrecio(precioFinal(p))} c/u</span></button>
            <button type="button" class="pres-opt" data-pres="b"><b>Bulto x${p.bulto}</b><span>${formatearPrecio(precioBulto(p))} el bulto</span><em>Ahorrás ${DESC_BULTO}%</em></button>
          </div>
        </div>` : ''}
        <div class="modal-actions">
          ${qtyHtml('modal-' + p.id, 1)}
          <button type="button" class="btn btn-primary" data-add-modal="${p.id}">${ICO.carrito} Agregar al carrito</button>
          <button type="button" class="btn btn-line" data-buy-modal="${p.id}">Comprar ahora</button>
        </div>
        <div class="modal-specs">
          <div><span>Presentación</span><b>${esc(p.pres)}</b></div>
          ${p.uso ? `<div><span>Modo de uso</span><b>${esc(p.uso)}</b></div>` : ''}
          <div><span>Entrega</span><b>24/48 h en CABA y GBA</b></div>
          ${p.bulto ? `<div><span>Bulto cerrado</span><b>${p.bulto} unidades · -${DESC_BULTO}%</b></div>` : ''}
        </div>
      </div>
    </div>
    ${relacionados.length ? `<div class="modal-rel">
      <h3>De la misma línea</h3>
      <div class="rel-grid">${relacionados.map(r => `<button type="button" class="rel-card" data-quick="${r.id}">
        ${envase(r.tipo, getCategoria(r.cat)?.tint || '#2563eb')}
        <b>${esc(r.nombre)}</b><span>${formatearPrecio(precioFinal(r))}</span>
      </button>`).join('')}</div>
    </div>` : ''}`;

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; modal.querySelector('#modalCard').innerHTML = ''; }, 320);
  ultimoFoco?.focus();
}

function presModalActual() {
  const on = document.querySelector('#presOpts .pres-opt.on');
  return on ? on.dataset.pres : 'u';
}
function qtyCercano(origen) {
  const caja = origen.closest('.pcard-body,.dcard-body,.modal-body,.paso-prod');
  const el = caja?.querySelector('[data-qty] [data-val]');
  return el ? parseInt(el.textContent, 10) || 1 : 1;
}

/* ---------- la pasada ---------- */
const PASOS = [
  { prod: 'pi-03', titulo: 'El hall que se pisa mil veces', txt: 'Un bidón concentrado rinde 250 baldes: el encargado diluye 20 ml y el mármol vuelve sin película ni olor a lavandina.' },
  { prod: 'vi-01', titulo: 'El ventanal sin una sola marca', txt: 'Rociás, pasás la microfibra en seco y el vidrio queda sin arcoíris ni pelusa, mire de donde mire el sol.' },
  { prod: 'co-03', titulo: 'La grasa de la mesada, en dos minutos', txt: 'El desengrasante trabaja solo mientras terminás de ordenar. Después, una pasada y listo.' },
];

function renderPasos() {
  const cont = document.getElementById('pasadaPasos');
  if (!cont) return;
  cont.innerHTML = PASOS.map((s, i) => {
    const p = getProducto(s.prod);
    const cat = getCategoria(p?.cat);
    return `<li class="paso ${i === 0 ? 'is-on' : ''}" data-paso="${i}">
      <span class="paso-n">0${i + 1} — Una pasada</span>
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.txt)}</p>
      ${p ? `<div class="paso-prod">
        ${envase(p.tipo, cat?.tint || '#2563eb')}
        <div class="paso-prod-txt"><strong>${esc(p.nombre)}</strong><span>${formatearPrecio(precioFinal(p))} · ${esc(p.pres)}</span></div>
        <button type="button" class="btn-add" data-add="${p.id}" data-qty-fixed="1">${ICO.carrito}<span>Agregar</span></button>
      </div>` : ''}
    </li>`;
  }).join('');
}

function initPasada() {
  const stage = document.getElementById('pasadaStage');
  const visual = document.getElementById('pasadaVisual');
  if (!stage || !visual) return;
  const surfs = [...visual.querySelectorAll('.surf')];
  const pasos = [...document.querySelectorAll('#pasadaPasos .paso')];
  const N = surfs.length;

  const setPasada = prog => {
    const raw = clamp(prog, 0, .9999) * N;
    const idx = Math.min(N - 1, Math.floor(raw));
    const local = clamp(raw - idx, 0, 1);
    const wipe = clamp((local - .08) / .62, 0, 1);
    surfs.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    pasos.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    visual.style.setProperty('--wipe', wipe.toFixed(3));
    visual.style.setProperty('--pano-o', (wipe > .004 && wipe < .996) ? '1' : '0');
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    visual.style.setProperty('--wipe', '1');
    visual.style.setProperty('--pano-o', '0');
    pasos.forEach(s => s.classList.add('is-on'));
    return;
  }

  setPasada(0);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=260%', pin: true, scrub: .6,
      invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: self => setPasada(self.progress),
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setPasada(self.progress),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
  });
}

/* ---------- rail arrastrable ---------- */
function initRail() {
  const rail = document.getElementById('catRail');
  if (!rail) return;
  let down = false, startX = 0, startScroll = 0, moved = false;

  rail.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft;
    rail.setPointerCapture(e.pointerId);
    rail.classList.add('dragging');
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    if (moved) rail.scrollLeft = startScroll - dx;
  });
  const soltar = e => {
    if (!down) return;
    down = false; rail.classList.remove('dragging');
    if (rail.hasPointerCapture?.(e.pointerId)) rail.releasePointerCapture(e.pointerId);
  };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const next = rail.scrollLeft + e.deltaY;
    if ((e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max - 1)) return;
    e.preventDefault();
    rail.scrollLeft = clamp(next, 0, max);
  }, { passive: false });
}

/* ---------- reveals ---------- */
function initReveals() {
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-media img', { scale: 1.09, duration: 1.4, ease: 'power2.out' }, 0)
    .from('.hero-copy .eyebrow', { y: 18, opacity: 0, duration: .7 }, .15)
    .from('.hero-copy h1', { y: 26, opacity: 0, duration: .9, clipPath: 'inset(100% -6% -6% -2%)' }, .25)
    .from('.hero-copy p', { y: 18, opacity: 0, duration: .8 }, .45)
    .from('.hero-cta .btn', { y: 16, opacity: 0, duration: .7, stagger: .09 }, .58)
    .from('.hero-mini li', { y: 12, opacity: 0, duration: .6, stagger: .07 }, .72)
    .from('.hero-cut', { y: 60, opacity: 0, rotate: 5, duration: 1.15, ease: 'power3.out' }, .3)
    .from('.spark', { scale: 0.3, opacity: 0, duration: .7, stagger: .12, ease: 'back.out(2)' }, .95)
    .from('.hero-seal', { y: 22, opacity: 0, duration: .7 }, 1);

  if (typeof ScrollTrigger !== 'undefined' && window.matchMedia('(min-width:900px)').matches) {
    gsap.to('.hero-cut', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.to('.hero-media img', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function agregar(id, qty, pres) {
  const p = getProducto(id);
  if (!p) return;
  Cart.add(p, qty, pres || 'u');
  const badge = document.getElementById('cartBadge');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
  showToast(qty > 1 ? `${qty}x ${p.nombre} en el carrito` : `${p.nombre} está en el carrito`);
}

function initEventos() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      const abierto = !document.getElementById('modal').hidden;
      if (abierto) { document.getElementById('modal').classList.remove('open'); setTimeout(() => abrirModal(quick.dataset.quick), 180); }
      else abrirModal(quick.dataset.quick);
      return;
    }

    const step = e.target.closest('[data-step]');
    if (step) {
      const wrap = step.closest('[data-qty]');
      const val = wrap.querySelector('[data-val]');
      const key = wrap.dataset.qty;
      const nuevo = Math.max(1, Math.min(99, (parseInt(val.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
      val.textContent = nuevo;
      if (key.includes('|')) { const [id, pres] = key.split('|'); Cart.setQty(id, pres, nuevo); }
      return;
    }

    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, add.dataset.qtyFixed ? 1 : qtyCercano(add), 'u');
      return;
    }

    const addModal = e.target.closest('[data-add-modal]');
    if (addModal) {
      agregar(addModal.dataset.addModal, qtyCercano(addModal), presModalActual());
      return;
    }

    const buyModal = e.target.closest('[data-buy-modal]');
    if (buyModal) {
      agregar(buyModal.dataset.buyModal, qtyCercano(buyModal), presModalActual());
      cerrarModal();
      setTimeout(abrirCarrito, 260);
      return;
    }

    const pres = e.target.closest('[data-pres]');
    if (pres) {
      document.querySelectorAll('#presOpts .pres-opt').forEach(b => b.classList.toggle('on', b === pres));
      const id = document.querySelector('[data-add-modal]')?.dataset.addModal;
      const p = getProducto(id);
      const box = document.getElementById('modalPrecio');
      if (p && box) {
        box.innerHTML = pres.dataset.pres === 'b'
          ? `<strong class="off">${formatearPrecio(precioBulto(p))}</strong><s>${formatearPrecio(precioFinal(p) * p.bulto)}</s>`
          : precioHtml(p);
      }
      return;
    }

    const del = e.target.closest('[data-del]');
    if (del) { const [id, pr] = del.dataset.del.split('|'); Cart.remove(id, pr); return; }

    const catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
      estado.cat = catBtn.dataset.cat; estado.q = ''; document.getElementById('q').value = '';
      aplicarFiltros();
      scrollA(document.getElementById('catalogo'));
      return;
    }

    const fcat = e.target.closest('[data-fcat]');
    if (fcat) { estado.cat = fcat.dataset.fcat; aplicarFiltros(); return; }

    const fgru = e.target.closest('[data-fgru]');
    if (fgru) { estado.grupo = fgru.dataset.fgru; aplicarFiltros(); return; }

    const fext = e.target.closest('[data-fext]');
    if (fext) { estado[fext.dataset.fext] = !estado[fext.dataset.fext]; aplicarFiltros(); return; }

    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); setTimeout(() => scrollA(document.getElementById('catalogo')), 260); return; }
    if (e.target.closest('#modalClose') || (e.target.id === 'modal')) { cerrarModal(); return; }

    const ancla = e.target.closest('a[href^="#"]');
    if (ancla) {
      const id = ancla.getAttribute('href').slice(1);
      const dest = id === 'top' ? document.body : document.getElementById(id);
      if (dest) { e.preventDefault(); id === 'top' ? window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }) : scrollA(dest); }
    }
  });

  document.getElementById('cartBtn').addEventListener('click', abrirCarrito);
  document.getElementById('cartClose').addEventListener('click', cerrarCarrito);
  document.getElementById('drawerBackdrop').addEventListener('click', cerrarCarrito);
  document.getElementById('cartClear').addEventListener('click', () => { Cart.clear(); showToast('Carrito vacío. Empezá de nuevo cuando quieras.'); });
  document.getElementById('checkout').addEventListener('click', () => {
    if (!Cart.count()) { showToast('Agregá algún artículo antes de cerrar el pedido'); return; }
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensajeWsp())}`, '_blank', 'noopener');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('modal').hidden) cerrarModal();
      else if (document.getElementById('cartDrawer').classList.contains('open')) cerrarCarrito();
    }
    if (e.key === 'Tab') {
      const modal = document.getElementById('modal');
      const drawer = document.getElementById('cartDrawer');
      if (!modal.hidden) trapFocus(modal, e);
      else if (drawer.classList.contains('open')) trapFocus(drawer, e);
    }
  });

  const q = document.getElementById('q');
  const qClear = document.getElementById('qClear');
  let tq;
  q.addEventListener('input', () => {
    estado.q = q.value;
    qClear.hidden = !q.value;
    clearTimeout(tq);
    tq = setTimeout(aplicarFiltros, 180);
  });
  qClear.addEventListener('click', () => { q.value = ''; estado.q = ''; qClear.hidden = true; aplicarFiltros(); q.focus(); });

  document.getElementById('orden').addEventListener('change', e => { estado.orden = e.target.value; aplicarFiltros(); });
  document.getElementById('verMas').addEventListener('click', () => { estado.visibles += POR_PAGINA; renderCatalogo(true); });
  document.getElementById('limpiarFiltros').addEventListener('click', limpiarTodo);
  document.getElementById('vacioReset').addEventListener('click', limpiarTodo);

  const ft = document.getElementById('filtrosToggle');
  const fp = document.getElementById('filtrosPanel');
  fp.dataset.open = 'false';
  const syncPanel = () => {
    const chico = window.matchMedia('(max-width:819px)').matches;
    fp.style.display = (!chico || fp.dataset.open === 'true') ? '' : 'none';
  };
  ft.addEventListener('click', () => {
    fp.dataset.open = fp.dataset.open === 'true' ? 'false' : 'true';
    ft.setAttribute('aria-expanded', fp.dataset.open);
    syncPanel();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  window.addEventListener('resize', syncPanel);
  syncPanel();

  document.addEventListener('cart:updated', renderCart);
}

function limpiarTodo() {
  estado.cat = 'all'; estado.grupo = 'all'; estado.oferta = false; estado.bulto = false; estado.q = ''; estado.orden = 'rel';
  document.getElementById('q').value = '';
  document.getElementById('qClear').hidden = true;
  document.getElementById('orden').value = 'rel';
  aplicarFiltros();
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap !== 'undefined' && window.Flip) gsap.registerPlugin(window.Flip);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('resultados').textContent = `${PRODUCTOS.length} artículos`;

  renderDestacados();
  renderRail();
  renderChips();
  renderCatalogo(false);
  renderPasos();
  renderCart();

  initNav();
  initEventos();
  initRail();
  initHero();
  initPasada();
  initReveals();
  initWspFloat();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTOS, CATEGORIAS, GRUPOS, ENVASES, DESC_BULTO, ENVIO_GRATIS_DESDE, POR_PAGINA, estado, Cart, norm, filtrados, precioFinal, precioBulto, precioPres, formatearPrecio, mensajeWsp, getProducto, getCategoria };
}
