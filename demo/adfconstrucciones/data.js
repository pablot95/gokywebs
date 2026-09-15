/* Catálogo demostrativo de ADF Construcciones.
   Precios de referencia a confirmar con la lista real del corralón. */
/* eslint-disable no-unused-vars -- consumidos por script.js vía scope global */

const RUBROS = [
  { id: 'cemento', label: 'Cemento y áridos', img: 'images/sacos-de-cemento-en-pallet_1x1.webp', bajada: 'Cemento, cal y áridos por bolsa o por metro cúbico.' },
  { id: 'ladrillos', label: 'Ladrillos y bloques', img: 'images/ladrillos-huecos-de-terracota_1x1.webp', bajada: 'Huecos, comunes y bloques de hormigón.' },
  { id: 'hierro', label: 'Hierro y acero', img: 'images/barras-de-acero-y-hierro_1x1.webp', bajada: 'Barras aletadas, mallas y estribos.' },
  { id: 'ceramicos', label: 'Cerámicos y pisos', img: 'images/ceramicas-y-porcelanatos_1x1.webp', bajada: 'Porcelanatos, cerámicos, adhesivos y pastinas.' },
  { id: 'sanitarios', label: 'PVC y sanitarios', img: 'images/tuberias-y-conexiones-pvc_1x1.webp', bajada: 'Caños, conexiones y accesorios de desagüe.' },
  { id: 'bloques', label: 'Premoldeados', img: 'images/bloques-de-hormigon_1x1.webp', bajada: 'Bloques, viguetas y elementos de hormigón.' }
];

const PRODUCTOS = [
  { id: 'cem-alb-50', rubro: 'cemento', nombre: 'Cemento de albañilería x 50 kg', unidad: 'bolsa', precio: 9800, descuento: 0, stock: 480, destacado: true, img: 'images/sacos-de-cemento-en-pallet_1x1.webp',
    desc: 'Cemento de albañilería para mortero de asiento y revoques. Rinde y trabaja bien en mezclas con cal.',
    specs: ['Bolsa de 50 kg', 'Para mampostería y revoque', 'Pallet de 40 bolsas'] },
  { id: 'cem-port-50', rubro: 'cemento', nombre: 'Cemento Portland normal x 50 kg', unidad: 'bolsa', precio: 11400, descuento: 0, stock: 320, destacado: true, img: 'images/sacos-de-cemento-en-pallet_1x1.webp',
    desc: 'Portland de uso general para hormigones estructurales, contrapisos y carpetas.',
    specs: ['Bolsa de 50 kg', 'Uso estructural', 'Pallet de 40 bolsas'] },
  { id: 'cal-25', rubro: 'cemento', nombre: 'Cal hidratada x 25 kg', unidad: 'bolsa', precio: 6200, descuento: 0, stock: 260, destacado: false, img: 'images/sacos-de-cemento-en-pallet_1x1.webp',
    desc: 'Cal hidratada para mejorar la plasticidad del mortero. Se usa junto al cemento de albañilería.',
    specs: ['Bolsa de 25 kg', 'Para mortero y revoque'] },
  { id: 'arena-m3', rubro: 'cemento', nombre: 'Arena fina — por m³', unidad: 'm³', precio: 38000, descuento: 0, stock: 40, destacado: false, img: 'images/corralon-de-materiales-con-autoelevador_2.8x1.webp',
    desc: 'Arena fina lavada para mortero y revoque fino. Se despacha a granel o en big bag.',
    specs: ['Por metro cúbico', 'A granel o big bag', 'Entrega con volquete'] },

  { id: 'lad-h12', rubro: 'ladrillos', nombre: 'Ladrillo hueco 12×18×33', unidad: 'unidad', precio: 890, descuento: 10, stock: 6400, destacado: true, img: 'images/ladrillos-huecos-de-terracota_1x1.webp',
    desc: 'El hueco más usado en muros interiores y exteriores no portantes. Liviano y de colocación rápida.',
    specs: ['12 × 18 × 33 cm', '≈ 16 por m² de pared', 'Pallet de 144 unidades'] },
  { id: 'lad-h8', rubro: 'ladrillos', nombre: 'Ladrillo hueco 8×18×33', unidad: 'unidad', precio: 720, descuento: 0, stock: 5200, destacado: false, img: 'images/ladrillos-huecos-de-terracota_1x1.webp',
    desc: 'Hueco de 8 cm para tabiques y divisiones internas donde no se necesita espesor.',
    specs: ['8 × 18 × 33 cm', '≈ 16 por m² de pared', 'Pallet de 192 unidades'] },
  { id: 'lad-comun', rubro: 'ladrillos', nombre: 'Ladrillo común de campo', unidad: 'unidad', precio: 380, descuento: 0, stock: 9000, destacado: false, img: 'images/ladrillos-huecos-de-terracota_1x1.webp',
    desc: 'Ladrillo macizo para cimientos, muros portantes y trabajos a la vista.',
    specs: ['≈ 5 × 12 × 25 cm', '≈ 65 por m² de pared', 'Venta por unidad o millar'] },
  { id: 'blq-19', rubro: 'bloques', nombre: 'Bloque de hormigón 19×19×39', unidad: 'unidad', precio: 1450, descuento: 0, stock: 2800, destacado: true, img: 'images/bloques-de-hormigon_1x1.webp',
    desc: 'Bloque portante de hormigón vibrado. Levanta rápido y admite armadura en los huecos.',
    specs: ['19 × 19 × 39 cm', '≈ 12,5 por m² de pared', 'Pallet de 72 unidades'] },
  { id: 'blq-13', rubro: 'bloques', nombre: 'Bloque de hormigón 13×19×39', unidad: 'unidad', precio: 1180, descuento: 0, stock: 2100, destacado: false, img: 'images/bloques-de-hormigon_1x1.webp',
    desc: 'Bloque de 13 cm para muros divisorios y cerramientos livianos.',
    specs: ['13 × 19 × 39 cm', '≈ 12,5 por m² de pared', 'Pallet de 96 unidades'] },
  { id: 'vigueta', rubro: 'bloques', nombre: 'Vigueta pretensada — por metro', unidad: 'metro', precio: 8900, descuento: 0, stock: 320, destacado: false, img: 'images/bloques-de-hormigon_1x1.webp',
    desc: 'Vigueta pretensada para losa con ladrillo de techo. Se corta a la medida del vano.',
    specs: ['Se vende por metro lineal', 'Para losas de vivienda', 'Consultar luz máxima'] },

  { id: 'hierro-6', rubro: 'hierro', nombre: 'Hierro aletado Ø6 mm × 12 m', unidad: 'barra', precio: 7400, descuento: 0, stock: 420, destacado: false, img: 'images/barras-de-acero-y-hierro_1x1.webp',
    desc: 'Barra aletada de 6 mm para estribos y armaduras de repartición.',
    specs: ['Ø 6 mm · 12 m', '≈ 2,7 kg por barra', 'ADN 420'] },
  { id: 'hierro-8', rubro: 'hierro', nombre: 'Hierro aletado Ø8 mm × 12 m', unidad: 'barra', precio: 12900, descuento: 8, stock: 380, destacado: true, img: 'images/barras-de-acero-y-hierro_1x1.webp',
    desc: 'La barra más pedida para vigas de encadenado y columnas de vivienda.',
    specs: ['Ø 8 mm · 12 m', '≈ 4,7 kg por barra', 'ADN 420'] },
  { id: 'hierro-10', rubro: 'hierro', nombre: 'Hierro aletado Ø10 mm × 12 m', unidad: 'barra', precio: 19800, descuento: 0, stock: 240, destacado: false, img: 'images/barras-de-acero-y-hierro_1x1.webp',
    desc: 'Barra de 10 mm para columnas, vigas principales y bases.',
    specs: ['Ø 10 mm · 12 m', '≈ 7,4 kg por barra', 'ADN 420'] },
  { id: 'malla-sima', rubro: 'hierro', nombre: 'Malla Sima 15×15 Ø4,2 — panel 2×5 m', unidad: 'panel', precio: 42000, descuento: 0, stock: 90, destacado: false, img: 'images/barras-de-acero-y-hierro_1x1.webp',
    desc: 'Panel de malla electrosoldada para contrapisos, carpetas y platea.',
    specs: ['Cuadrícula 15 × 15 cm', 'Panel de 2 × 5 m (10 m²)', 'Alambre Ø 4,2 mm'] },

  { id: 'porc-60', rubro: 'ceramicos', nombre: 'Porcelanato 60×60 símil cemento', unidad: 'caja', precio: 46500, descuento: 15, stock: 180, destacado: true, img: 'images/ceramicas-y-porcelanatos_1x1.webp',
    desc: 'Porcelanato rectificado de acabado mate, ideal para ambientes de mucho tránsito.',
    specs: ['60 × 60 cm', 'Caja de 1,44 m² (4 piezas)', 'Rectificado, mate'] },
  { id: 'cer-45', rubro: 'ceramicos', nombre: 'Cerámico 45×45 interior', unidad: 'caja', precio: 24800, descuento: 0, stock: 240, destacado: false, img: 'images/ceramicas-y-porcelanatos_1x1.webp',
    desc: 'Cerámico esmaltado para pisos interiores. Buena relación precio-rendimiento.',
    specs: ['45 × 45 cm', 'Caja de 2,02 m² (10 piezas)', 'Uso interior'] },
  { id: 'adh-30', rubro: 'ceramicos', nombre: 'Adhesivo para porcelanato x 30 kg', unidad: 'bolsa', precio: 15600, descuento: 0, stock: 300, destacado: false, img: 'images/ceramicas-y-porcelanatos_1x1.webp',
    desc: 'Adhesivo de alta adherencia para porcelanato y piezas grandes, interior y exterior.',
    specs: ['Bolsa de 30 kg', 'Rinde ≈ 6 m² por bolsa', 'Interior y exterior'] },
  { id: 'pastina-2', rubro: 'ceramicos', nombre: 'Pastina x 2 kg', unidad: 'pack', precio: 4900, descuento: 0, stock: 420, destacado: false, img: 'images/ceramicas-y-porcelanatos_1x1.webp',
    desc: 'Pastina para tomar juntas. Consultar colores disponibles antes de pedir.',
    specs: ['Pack de 2 kg', 'Rinde ≈ 4 m²', 'Varios colores'] },

  { id: 'pvc-110', rubro: 'sanitarios', nombre: 'Caño PVC 110 mm × 4 m', unidad: 'unidad', precio: 28900, descuento: 0, stock: 160, destacado: true, img: 'images/tuberias-y-conexiones-pvc_1x1.webp',
    desc: 'Caño de desagüe cloacal primario de 110 mm, con junta o pegado según accesorio.',
    specs: ['Ø 110 mm · 4 m', 'Desagüe cloacal', 'Norma IRAM'] },
  { id: 'pvc-63', rubro: 'sanitarios', nombre: 'Caño PVC 63 mm × 4 m', unidad: 'unidad', precio: 16400, descuento: 0, stock: 190, destacado: false, img: 'images/tuberias-y-conexiones-pvc_1x1.webp',
    desc: 'Caño de 63 mm para desagües secundarios de piletas, lavatorios y duchas.',
    specs: ['Ø 63 mm · 4 m', 'Desagüe secundario', 'Norma IRAM'] },
  { id: 'codo-110', rubro: 'sanitarios', nombre: 'Codo PVC 110 mm 90°', unidad: 'unidad', precio: 5200, descuento: 0, stock: 340, destacado: false, img: 'images/tuberias-y-conexiones-pvc_1x1.webp',
    desc: 'Codo a 90° para cambios de dirección en cañería de 110 mm.',
    specs: ['Ø 110 mm', 'Ángulo 90°', 'Con junta elástica'] },
  { id: 'ramal-110', rubro: 'sanitarios', nombre: 'Ramal T PVC 110 mm', unidad: 'unidad', precio: 7300, descuento: 0, stock: 210, destacado: false, img: 'images/tuberias-y-conexiones-pvc_1x1.webp',
    desc: 'Ramal en T para derivaciones de la cañería principal de desagüe.',
    specs: ['Ø 110 mm', 'Derivación en T', 'Con junta elástica'] }
];

/* Coeficientes de referencia de uso corriente en obra. Incluyen 10% de desperdicio
   en el resultado final (ver calcularMateriales en script.js). */
const CALCULOS = {
  pared: {
    hint: 'Pared de ladrillo hueco 12×18×33 con mortero de asiento.',
    espesor: false,
    items: [
      { id: 'lad-h12', porM2: 16, redondeo: 1 },
      { id: 'cem-alb-50', porM2: 0.125, redondeo: 1 },
      { id: 'cal-25', porM2: 0.125, redondeo: 1 }
    ]
  },
  piso: {
    hint: 'Piso de porcelanato 60×60 con adhesivo y pastina.',
    espesor: false,
    items: [
      { id: 'porc-60', porM2: 1 / 1.44, redondeo: 1 },
      { id: 'adh-30', porM2: 1 / 6, redondeo: 1 },
      { id: 'pastina-2', porM2: 1 / 4, redondeo: 1 }
    ]
  },
  contrapiso: {
    hint: 'Contrapiso de hormigón sobre terreno, con malla de repartición.',
    espesor: true,
    items: [
      { id: 'cem-port-50', porM3: 7, redondeo: 1 },
      { id: 'arena-m3', porM3: 0.6, redondeo: 0.5 },
      { id: 'malla-sima', porM2: 1 / 10, redondeo: 1 }
    ]
  }
};

const ENVIO_GRATIS_DESDE = 400000;
