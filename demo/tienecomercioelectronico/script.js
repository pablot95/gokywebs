const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const normalizar = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const WHATSAPP = '5491132335786';
const waLink = texto => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

const GKY_SLUG_ACENTOS = { "á":"a","é":"e","í":"i","ó":"o","ú":"u","ñ":"n","ü":"u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#FFFFFF', '--color-text': '#10201A', '--color-text-muted': '#4D5C55', '--color-primary': '#166534', '--color-secondary': '#16A34A', '--color-cta': '#15803D', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Laboratorio', vars: { '--color-bg': '#F5F8FC', '--color-bg-alt': '#FFFFFF', '--color-text': '#0D1B2E', '--color-text-muted': '#4B5A6E', '--color-primary': '#1E4FB8', '--color-secondary': '#60A5FA', '--color-cta': '#1D4ED8', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Pileta', vars: { '--color-bg': '#F3FAFA', '--color-bg-alt': '#FFFFFF', '--color-text': '#0B2426', '--color-text-muted': '#47605F', '--color-primary': '#0F6B64', '--color-secondary': '#2DD4BF', '--color-cta': '#0F766E', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Industrial', vars: { '--color-bg': '#F6F5F2', '--color-bg-alt': '#FFFFFF', '--color-text': '#1C1A17', '--color-text-muted': '#5A5650', '--color-primary': '#9A3B0C', '--color-secondary': '#F59E0B', '--color-cta': '#1C1A17', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Suave', vars: { '--color-bg': '#F6F7F4', '--color-bg-alt': '#FFFFFF', '--color-text': '#242B26', '--color-text-muted': '#5B635D', '--color-primary': '#3E6650', '--color-secondary': '#9CC9AE', '--color-cta': '#3E6650', '--color-cta-text': '#FFFFFF' } },
];

const CATEGORIAS = [
  { id: 'limpieza', nombre: 'Limpieza y hogar', num: '01', simbolo: 'NaClO', img: 'images/cat-limpieza.webp', w: 1100, h: 733, alt: 'Manos con guantes amarillos, esponja y rociador de limpieza sobre una mesada' },
  { id: 'piletas', nombre: 'Piletas', num: '02', simbolo: 'NaDCC', img: 'images/cat-piletas.webp', w: 1100, h: 733, alt: 'Agua transparente de una pileta sobre venecitas celestes' },
  { id: 'jabones', nombre: 'Cosmética y jabonería', num: '03', simbolo: 'C₃H₈O₃', img: 'images/cat-jabones.webp', w: 1100, h: 1650, alt: 'Barras de jabón artesanal verdes y blancas sobre papel madera' },
  { id: 'jardin', nombre: 'Jardín y huerta', num: '04', simbolo: 'FeSO₄', img: 'images/cat-jardin.webp', w: 1100, h: 1467, alt: 'Manos con guantes sosteniendo fertilizante granulado sobre el pasto' },
  { id: 'industria', nombre: 'Industria', num: '05', simbolo: '20 L', img: 'images/cat-industria.webp', w: 1100, h: 619, alt: 'Tambores plásticos azules apilados vistos desde arriba' },
];
const FORMATOS = { liquido: 'Líquido', polvo: 'Polvo o granulado', pastillas: 'Pastillas', solido: 'Sólido' };
const USOS = { hogar: 'Hogar', profesional: 'Profesional' };
const PELIGROS = {
  corrosivo: { nombre: 'Corrosivo', cuidado: 'Usá guantes y protección para los ojos, y no lo mezcles con ácidos ni amoníaco.' },
  irritante: { nombre: 'Irritante', cuidado: 'Evitá el contacto con ojos y piel; si pasa, enjuagá con abundante agua.' },
  inflamable: { nombre: 'Inflamable', cuidado: 'Mantenelo lejos del fuego, de chispas y de fuentes de calor.' },
  comburente: { nombre: 'Comburente', cuidado: 'Guardalo seco y separado de combustibles y de otros productos de pileta.' },
};

const pres = (etiqueta, cant, unidad, precio) => ({ k: etiqueta.toLowerCase().replace(/\s+/g, ''), etiqueta, cant, unidad, precio });

const PRODUCTOS = [
  { id: 'lavandina', nombre: 'Lavandina concentrada', corto: 'Lavandina', formula: 'NaClO', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: 'corrosivo', descuento: 0, stock: 40, destacado: 2,
    presentaciones: [pres('1 L', 1, 'L', 2300), pres('5 L', 5, 'L', 9200), pres('20 L', 20, 'L', 31900)],
    descripcion: 'Hipoclorito de sodio concentrado para desinfectar pisos, baños y superficies lavables.',
    modoUso: 'Diluila en agua fría antes de usarla y enjuagá las superficies que tocan alimentos.', tags: ['hipoclorito', 'cloro', 'desinfectante', 'baño', 'pisos', 'ropa blanca'] },
  { id: 'desengrasante', nombre: 'Desengrasante concentrado', corto: 'Desengrasante', formula: 'Mix', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: 'irritante', descuento: 15, stock: 25, destacado: 1,
    presentaciones: [pres('1 L', 1, 'L', 6800), pres('5 L', 5, 'L', 27900)],
    descripcion: 'Limpiador alcalino para grasa de cocina, hornallas, campanas y parrillas.',
    modoUso: 'Diluí según la suciedad, dejá actuar unos minutos y retirá con un paño húmedo.', tags: ['cocina', 'grasa', 'horno', 'parrilla', 'campana'] },
  { id: 'detergente-neutro', nombre: 'Detergente neutro concentrado', corto: 'Detergente', formula: 'Mix', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: null, descuento: 0, stock: 60,
    presentaciones: [pres('1 L', 1, 'L', 3700), pres('5 L', 5, 'L', 15200)],
    descripcion: 'Detergente de pH neutro para vajilla, pisos y superficies delicadas.',
    modoUso: 'Usá una pequeña cantidad por litro de agua y enjuagá.', tags: ['vajilla', 'platos', 'pisos', 'neutro'] },
  { id: 'alcohol-etilico', nombre: 'Alcohol etílico 96°', corto: 'Alcohol 96°', formula: 'C₂H₅OH', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: 'inflamable', descuento: 0, stock: 30, destacado: 5,
    presentaciones: [pres('1 L', 1, 'L', 8600), pres('5 L', 5, 'L', 38500)],
    descripcion: 'Alcohol de alta graduación para limpiar superficies y preparar soluciones al 70 %.',
    modoUso: 'Para limpieza, mezclá 7 partes de alcohol con 3 de agua.', tags: ['etanol', 'desinfectante', 'alcohol', 'superficies'] },
  { id: 'limpiador-pisos', nombre: 'Limpiador de pisos lavanda', corto: 'Limpiapisos', formula: 'Mix', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: null, descuento: 0, stock: 50,
    presentaciones: [pres('1 L', 1, 'L', 2800), pres('5 L', 5, 'L', 11400)],
    descripcion: 'Limpiador perfumado para pisos cerámicos, porcelanato y vinílicos.',
    modoUso: 'Agregá un chorro al balde con agua y pasá el trapo bien escurrido.', tags: ['piso', 'perfumina', 'lavanda', 'aromatizante'] },
  { id: 'quitasarro', nombre: 'Quitasarro con ácido cítrico', corto: 'Quitasarro', formula: 'C₆H₈O₇', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: 'irritante', descuento: 0, stock: 22,
    presentaciones: [pres('1 L', 1, 'L', 5100)],
    descripcion: 'Remueve el sarro y las manchas de agua dura en griferías, mamparas y bachas.',
    modoUso: 'Aplicalo sobre la superficie, esperá unos minutos y enjuagá bien.', tags: ['sarro', 'grifería', 'mampara', 'cítrico', 'baño'] },
  { id: 'agua-oxigenada', nombre: 'Agua oxigenada 10 volúmenes', corto: 'Agua oxigenada', formula: 'H₂O₂', categoria: 'limpieza', formato: 'liquido', uso: 'hogar', peligro: 'irritante', descuento: 0, stock: 35,
    presentaciones: [pres('1 L', 1, 'L', 4200)],
    descripcion: 'Peróxido de hidrógeno de uso doméstico para quitar manchas y limpiar juntas.',
    modoUso: 'Usala pura sobre la mancha y probá antes en un lugar poco visible.', tags: ['peróxido', 'manchas', 'juntas', 'blanqueador'] },
  { id: 'cloro-granulado', nombre: 'Cloro granulado de disolución rápida', corto: 'Cloro granulado', formula: 'NaDCC', categoria: 'piletas', formato: 'polvo', uso: 'hogar', peligro: 'comburente', descuento: 10, stock: 28, destacado: 3, envaseKg: 'balde',
    presentaciones: [pres('1 kg', 1, 'kg', 14500), pres('5 kg', 5, 'kg', 62000)],
    descripcion: 'Dicloroisocianurato de sodio para el mantenimiento diario del agua de la pileta.',
    modoUso: 'Disolvelo en un balde con agua de la pileta y repartilo con el filtro funcionando.', tags: ['pileta', 'piscina', 'cloro', 'agua'] },
  { id: 'pastillas-cloro', nombre: 'Pastillas de cloro multifunción 200 g', corto: 'Pastillas multi', formula: 'TCCA', categoria: 'piletas', formato: 'pastillas', uso: 'hogar', peligro: 'comburente', descuento: 0, stock: 0, envaseKg: 'pote',
    presentaciones: [pres('1 kg', 1, 'kg', 19600)],
    descripcion: 'Pastillas de disolución lenta que cloran, clarifican y ayudan a prevenir algas.',
    modoUso: 'Colocalas en el skimmer o en un dosificador flotante, nunca directo sobre el revestimiento.', tags: ['pastillas', 'tricloro', 'skimmer', 'flotante'] },
  { id: 'alguicida', nombre: 'Alguicida concentrado', corto: 'Alguicida', formula: 'QAC', categoria: 'piletas', formato: 'liquido', uso: 'hogar', peligro: 'irritante', descuento: 0, stock: 18,
    presentaciones: [pres('1 L', 1, 'L', 7400), pres('5 L', 5, 'L', 30500)],
    descripcion: 'Previene y controla la aparición de algas en piletas de todo tipo.',
    modoUso: 'Aplicalo al atardecer con el filtro andando y mantené el pH en rango.', tags: ['algas', 'agua verde', 'pileta', 'piscina'] },
  { id: 'clarificador', nombre: 'Clarificador para piletas', corto: 'Clarificador', formula: 'Mix', categoria: 'piletas', formato: 'liquido', uso: 'hogar', peligro: null, descuento: 0, stock: 20,
    presentaciones: [pres('1 L', 1, 'L', 6300)],
    descripcion: 'Agrupa las partículas en suspensión para que el filtro las retenga y el agua se vea transparente.',
    modoUso: 'Dosificalo según los litros de la pileta y dejá el filtro funcionando varias horas.', tags: ['agua turbia', 'pileta', 'transparente'] },
  { id: 'reductor-ph', nombre: 'Reductor de pH granulado', corto: 'Reductor pH', formula: 'NaHSO₄', categoria: 'piletas', formato: 'polvo', uso: 'hogar', peligro: 'irritante', descuento: 0, stock: 24, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 5900), pres('5 kg', 5, 'kg', 24800)],
    descripcion: 'Bisulfato de sodio para bajar el pH del agua y que el cloro trabaje mejor.',
    modoUso: 'Medí el pH antes de aplicar y agregalo de a poco, disuelto en un balde.', tags: ['ph', 'pileta', 'bisulfato', 'acidificante'] },
  { id: 'glicerina', nombre: 'Glicerina USP', corto: 'Glicerina', formula: 'C₃H₈O₃', categoria: 'jabones', formato: 'liquido', uso: 'profesional', peligro: null, descuento: 12, stock: 30, destacado: 4,
    presentaciones: [pres('1 L', 1, 'L', 9800), pres('5 L', 5, 'L', 44000)],
    descripcion: 'Glicerina de grado farmacéutico para jabones, cremas, burbujeros y cosmética casera.',
    modoUso: 'Incorporala en la fase acuosa de tus preparaciones según la receta.', tags: ['jabón', 'cremas', 'cosmética', 'burbujas', 'glicerol'] },
  { id: 'vaselina-liquida', nombre: 'Vaselina líquida pura', corto: 'Vaselina líquida', formula: 'Parafina', categoria: 'jabones', formato: 'liquido', uso: 'profesional', peligro: null, descuento: 0, stock: 26, destacado: 7,
    presentaciones: [pres('1 L', 1, 'L', 12800), pres('5 L', 5, 'L', 58000)],
    descripcion: 'Aceite mineral incoloro para aceites corporales, bálsamos y lubricación de mecanismos.',
    modoUso: 'Usala pura o mezclada con aceites y esencias según la preparación.', tags: ['aceite mineral', 'parafina', 'bálsamo', 'lubricante'] },
  { id: 'aceite-coco', nombre: 'Aceite de coco refinado', corto: 'Aceite de coco', formula: 'Aceite', categoria: 'jabones', formato: 'liquido', uso: 'hogar', peligro: null, descuento: 0, stock: 15,
    presentaciones: [pres('1 L', 1, 'L', 15400)],
    descripcion: 'Aceite vegetal para jabones de saponificación en frío, velas y cosmética natural.',
    modoUso: 'Por debajo de los 24 °C se solidifica: entibialo a baño María para trabajarlo.', tags: ['coco', 'jabón', 'velas', 'saponificación'] },
  { id: 'acido-estearico', nombre: 'Ácido esteárico en escamas', corto: 'Ácido esteárico', formula: 'C₁₈H₃₆O₂', categoria: 'jabones', formato: 'solido', uso: 'profesional', peligro: null, descuento: 0, stock: 14, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 11200)],
    descripcion: 'Endurece jabones y velas y le da cuerpo a cremas y emulsiones.',
    modoUso: 'Fundilo junto con las grasas de la receta antes de mezclar.', tags: ['estearina', 'velas', 'cremas', 'emulsión'] },
  { id: 'base-glicerina', nombre: 'Base de glicerina para jabón', corto: 'Base glicerina', formula: 'Mix', categoria: 'jabones', formato: 'solido', uso: 'hogar', peligro: null, descuento: 0, stock: 20, destacado: 8, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 10900), pres('5 kg', 5, 'kg', 49500)],
    descripcion: 'Base transparente lista para fundir, colorear y moldear jabones artesanales.',
    modoUso: 'Cortala en cubos, fundila a baño María y volcala en los moldes.', tags: ['jabón', 'molde', 'transparente', 'manualidades'] },
  { id: 'sulfato-ferroso', nombre: 'Sulfato ferroso', corto: 'Sulfato ferroso', formula: 'FeSO₄', categoria: 'jardin', formato: 'polvo', uso: 'hogar', peligro: 'irritante', descuento: 0, stock: 32, destacado: 6, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 4600), pres('5 kg', 5, 'kg', 17900)],
    descripcion: 'Aporta hierro a plantas, frutales y césped con hojas amarillentas.',
    modoUso: 'Aplicalo sobre la tierra húmeda según la dosis de la etiqueta y regá después.', tags: ['hierro', 'césped', 'plantas', 'clorosis', 'huerta'] },
  { id: 'sulfato-magnesio', nombre: 'Sulfato de magnesio', corto: 'Sal de Epsom', formula: 'MgSO₄', categoria: 'jardin', formato: 'polvo', uso: 'hogar', peligro: null, descuento: 0, stock: 28, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 3900), pres('5 kg', 5, 'kg', 15500)],
    descripcion: 'Fuente de magnesio para tomates, rosales y plantas en maceta, también conocido como sal de Epsom.',
    modoUso: 'Disolvelo en el agua de riego o espolvorealo alrededor de la planta.', tags: ['epsom', 'magnesio', 'tomates', 'rosales', 'riego'] },
  { id: 'fertilizante-fosfatado', nombre: 'Fertilizante fosfatado 18-46-0', corto: 'Fosfato 18-46-0', formula: 'DAP', categoria: 'jardin', formato: 'polvo', uso: 'profesional', peligro: null, descuento: 0, stock: 16, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 5400), pres('5 kg', 5, 'kg', 21900)],
    descripcion: 'Fosfato diamónico granulado para implantar césped, huertas y frutales.',
    modoUso: 'Incorporalo a la tierra antes de sembrar o trasplantar.', tags: ['fósforo', 'dap', 'siembra', 'césped', 'huerta'] },
  { id: 'cal-dolomita', nombre: 'Cal dolomita agrícola', corto: 'Cal dolomita', formula: 'CaMg(CO₃)₂', categoria: 'jardin', formato: 'polvo', uso: 'profesional', peligro: null, descuento: 0, stock: 12, envaseKg: 'bolsa',
    presentaciones: [pres('5 kg', 5, 'kg', 8700), pres('25 kg', 25, 'kg', 31000)],
    descripcion: 'Corrige la acidez del suelo y aporta calcio y magnesio.',
    modoUso: 'Distribuila sobre la tierra y mezclala con los primeros centímetros antes de plantar.', tags: ['cal', 'acidez', 'suelo', 'calcio'] },
  { id: 'detergente-industrial', nombre: 'Detergente industrial alcalino', corto: 'Detergente alcalino', formula: 'Mix', categoria: 'industria', formato: 'liquido', uso: 'profesional', peligro: 'corrosivo', descuento: 0, stock: 10,
    presentaciones: [pres('5 L', 5, 'L', 21800), pres('20 L', 20, 'L', 74000)],
    descripcion: 'Limpieza pesada de pisos de talleres, cocinas industriales y equipos.',
    modoUso: 'Diluilo en agua según la suciedad y usalo con guantes y protección ocular.', tags: ['taller', 'industrial', 'pisos', 'grasa pesada'] },
  { id: 'amonio-cuaternario', nombre: 'Amonio cuaternario sanitizante', corto: 'Amonio cuaternario', formula: 'QAC', categoria: 'industria', formato: 'liquido', uso: 'profesional', peligro: 'irritante', descuento: 0, stock: 12,
    presentaciones: [pres('5 L', 5, 'L', 26400), pres('20 L', 20, 'L', 92000)],
    descripcion: 'Sanitizante de superficies para gastronomía, consultorios y espacios de uso común.',
    modoUso: 'Diluilo según la etiqueta, aplicalo sobre superficies limpias y dejá actuar.', tags: ['sanitizante', 'desinfectante', 'gastronomía', 'superficies'] },
  { id: 'bicarbonato', nombre: 'Bicarbonato de sodio', corto: 'Bicarbonato', formula: 'NaHCO₃', categoria: 'industria', formato: 'polvo', uso: 'profesional', peligro: null, descuento: 8, stock: 40, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 3600), pres('5 kg', 5, 'kg', 14900), pres('25 kg', 25, 'kg', 61000)],
    descripcion: 'Bicarbonato de uso múltiple para limpieza, piletas, panificación y procesos industriales.',
    modoUso: 'Disolvelo en agua tibia o usalo en polvo como abrasivo suave.', tags: ['bicarbonato', 'limpieza', 'ph', 'abrasivo'] },
  { id: 'acido-citrico', nombre: 'Ácido cítrico anhidro', corto: 'Ácido cítrico', formula: 'C₆H₈O₇', categoria: 'industria', formato: 'polvo', uso: 'profesional', peligro: 'irritante', descuento: 0, stock: 20, envaseKg: 'bolsa',
    presentaciones: [pres('1 kg', 1, 'kg', 7900), pres('25 kg', 25, 'kg', 168000)],
    descripcion: 'Acidulante y quitasarro en polvo para limpieza, cosmética e industria.',
    modoUso: 'Disolvelo en agua antes de usarlo; para sarro, aplicá la solución y enjuagá.', tags: ['cítrico', 'sarro', 'acidulante', 'cosmética'] },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getPres = (p, k) => p?.presentaciones.find(x => x.k === k) || p?.presentaciones[0];
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const precioFinal = (p, pr) => (p.descuento > 0 ? Math.round(pr.precio * (1 - p.descuento / 100)) : pr.precio);
const precioUnidad = (p, pr) => precioFinal(p, pr) / pr.cant;
const unidadTexto = pr => (pr.unidad === 'L' ? 'litro' : 'kilo');
const envaseTipo = (p, pr) => (pr.unidad === 'L' ? (pr.cant >= 5 ? 'bidon' : 'botella') : (p.envaseKg || 'bolsa'));
const textoBusqueda = p => normalizar([p.nombre, p.corto, p.formula, getCategoria(p.categoria)?.nombre, FORMATOS[p.formato], USOS[p.uso], p.descripcion, ...(p.tags || [])].join(' '));

function envaseHTML(p, pr) {
  return `<span class="envase envase--${envaseTipo(p, pr)}"><span class="env-asa"></span><span class="env-tapa"></span><span class="env-cuello"></span><span class="env-cuerpo"></span><span class="env-etiqueta"><span class="env-formula">${esc(p.formula)}</span><span class="env-nombre">${esc(p.corto)}</span><span class="env-pres">${esc(pr.etiqueta)}</span></span></span>`;
}
const envaseWrapHTML = (p, pr) => `<span class="envase-wrap" data-cat="${esc(p.categoria)}">${envaseHTML(p, pr)}</span>`;

function precioHTML(p, pr) {
  const oferta = p.descuento > 0;
  return `<span class="precio-final${oferta ? ' es-oferta' : ''}">${formatearPrecio(precioFinal(p, pr))}</span>${oferta ? `<s class="precio-original">${formatearPrecio(pr.precio)}</s>` : ''}<span class="precio-unidad"><span class="precio-pres">${esc(pr.etiqueta)} · </span>${formatearPrecio(precioUnidad(p, pr))} por ${unidadTexto(pr)}</span>`;
}

function badgesHTML(p) {
  return [
    p.descuento > 0 ? `<span class="badge badge--oferta">-${p.descuento}%</span>` : '',
    p.stock <= 0 ? '<span class="badge badge--agotado">Sin stock</span>' : '',
    p.peligro ? `<span class="badge badge--peligro">${esc(PELIGROS[p.peligro].nombre)}</span>` : '',
  ].join('');
}

function presChipsHTML(p, pr) {
  if (p.presentaciones.length === 1) return `<div class="pres-chips"><span class="pres-unica">${esc(pr.etiqueta)}</span></div>`;
  return `<div class="pres-chips" role="group" aria-label="Presentación de ${esc(p.nombre)}">${p.presentaciones.map(x => `<button type="button" class="pres-chip" data-pres-chip="${esc(x.k)}" aria-pressed="${x.k === pr.k}">${esc(x.etiqueta)}</button>`).join('')}</div>`;
}

const stepperHTML = (nombre, valor = 1) => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">−</button><input type="number" value="${valor}" min="1" max="99" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">+</button></div>`;

function accionesHTML(p, compacta) {
  if (p.stock <= 0) {
    return `<div class="prod-actions"><a class="btn btn-line prod-add" href="${waLink(`Hola, quiero saber cuándo vuelve a haber ${p.nombre}.`)}" target="_blank" rel="noopener noreferrer">Avisame cuando vuelva</a></div>`;
  }
  if (compacta) return `<div class="prod-actions"><button type="button" class="btn btn-cta prod-add" data-agregar="${esc(p.id)}">Agregar<span class="add-extra"> al carrito</span></button></div>`;
  return `<div class="prod-actions">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta prod-add" data-agregar="${esc(p.id)}">Agregar<span class="add-extra"> al carrito</span></button></div><button type="button" class="btn btn-line prod-comprar" data-comprar="${esc(p.id)}">Comprar ahora</button>`;
}

function cardHTML(p, opts = {}) {
  const pr = getPres(p, opts.pres);
  const tag = opts.tag || 'li';
  const anim = opts.animar ? ' data-animate="up" style="transform:translateY(34px);opacity:0"' : '';
  return `<${tag} class="prod-item"${anim}><article class="prod-card" data-id="${esc(p.id)}" data-pres="${esc(pr.k)}">
    <button type="button" class="prod-media" data-abrir="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">
      <span class="prod-badges">${badgesHTML(p)}</span>${envaseWrapHTML(p, pr)}<span class="prod-ver">Ver ficha</span>
    </button>
    <div class="prod-body">
      <p class="prod-cat">${esc(getCategoria(p.categoria)?.nombre || '')}</p>
      <h3 class="prod-nombre"><button type="button" data-abrir="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      ${presChipsHTML(p, pr)}
      <p class="prod-precio" data-precio>${precioHTML(p, pr)}</p>
      ${accionesHTML(p, opts.compacta)}
    </div>
  </article></${tag}>`;
}

const Cart = {
  KEY: 'tienecomercioelectronico_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, presK, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.pres === presK);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, pres: presK, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, presK, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.pres === presK); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(id, presK) { this.save(this.get().filter(i => !(i.id === id && i.pres === presK))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, getPres(p, i.pres)) * i.qty : s; }, 0); },
};

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initEnvasesSueltos() {
  document.querySelectorAll('[data-envase]').forEach(el => {
    const p = getProducto(el.dataset.envase);
    if (!p) return;
    el.dataset.cat = p.categoria;
    el.innerHTML = envaseHTML(p, getPres(p, el.dataset.pres));
  });
  const tag = document.querySelector('[data-precio-tag]');
  const p = tag ? getProducto(tag.dataset.precioTag) : null;
  if (!p) return;
  const pr = getPres(p, tag.dataset.pres);
  const original = tag.querySelector('[data-tag-original]');
  const final = tag.querySelector('[data-tag-final]');
  if (original) original.textContent = formatearPrecio(pr.precio);
  if (final) final.textContent = formatearPrecio(precioFinal(p, pr));
}

function initCategorias() {
  const grid = document.getElementById('catsGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.categoria === c.id).length;
    return `<li data-animate="up" style="transform:translateY(40px);opacity:0"><button type="button" class="cat-card" data-cat-ir="${c.id}">
      <span class="cat-media"><img src="${c.img}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}" decoding="async"><span class="cat-tile" aria-hidden="true"><span class="cat-tile-num">${c.num}</span><span class="cat-tile-sim">${esc(c.simbolo)}</span></span></span>
      <span class="cat-info"><span class="cat-nombre">${esc(c.nombre)}</span><span class="cat-count">${n} productos</span></span>
    </button></li>`;
  }).join('');
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
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).sort((a, b) => a.destacado - b.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, { compacta: true })).join('');
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 240) + 16;
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 8;
    if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 8;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

const PAGINA = 16;
const CATALOGO = { cat: 'todas', q: '', formatos: new Set(), usos: new Set(), ofertas: false, orden: 'relevancia', visibles: PAGINA };
const INDICE_BUSQUEDA = new Map(PRODUCTOS.map(p => [p.id, textoBusqueda(p)]));

function productosFiltrados() {
  const tokens = normalizar(CATALOGO.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => (CATALOGO.cat === 'todas' || p.categoria === CATALOGO.cat)
    && (!CATALOGO.formatos.size || CATALOGO.formatos.has(p.formato))
    && (!CATALOGO.usos.size || CATALOGO.usos.has(p.uso))
    && (!CATALOGO.ofertas || p.descuento > 0)
    && tokens.every(t => INDICE_BUSQUEDA.get(p.id).includes(t)));
  const base = p => precioFinal(p, p.presentaciones[0]);
  if (CATALOGO.orden === 'menor') return lista.sort((a, b) => base(a) - base(b));
  if (CATALOGO.orden === 'mayor') return lista.sort((a, b) => base(b) - base(a));
  if (CATALOGO.orden === 'az') return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista.sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0));
}

const hayFiltros = () => CATALOGO.cat !== 'todas' || CATALOGO.q.trim() !== '' || CATALOGO.formatos.size > 0 || CATALOGO.usos.size > 0 || CATALOGO.ofertas;

function renderCatalogo({ primera = false, desde = 0 } = {}) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const lista = productosFiltrados();
  const visibles = lista.slice(0, CATALOGO.visibles);
  grid.innerHTML = visibles.map(p => cardHTML(p, { animar: primera })).join('');
  if (!primera && !reduceMotion) {
    grid.querySelectorAll('.prod-item').forEach((li, i) => {
      if (i < desde) return;
      li.classList.add('cascada');
      li.style.animationDelay = `${Math.min(i - desde, 10) * 0.05}s`;
    });
  }
  const contador = document.getElementById('resultadosCount');
  if (contador) contador.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  const vacio = document.getElementById('catalogoVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = lista.length <= CATALOGO.visibles;
  const limpiar = document.getElementById('limpiarFiltros');
  if (limpiar) limpiar.hidden = !hayFiltros();
  const activos = document.querySelector('[data-filtros-activos]');
  if (activos) { const n = CATALOGO.formatos.size + CATALOGO.usos.size + (CATALOGO.ofertas ? 1 : 0); activos.textContent = n ? String(n) : ''; }
  document.querySelectorAll('[data-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.chip === CATALOGO.cat)));
  refrescarTriggers();
}

const irATienda = () => document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

function actualizarUrl(clave, valor) {
  const url = new URL(location.href);
  if (valor) url.searchParams.set(clave, valor); else url.searchParams.delete(clave);
  window.history.replaceState(null, '', url);
}

function setCategoria(id, { scroll = false } = {}) {
  CATALOGO.cat = CATEGORIAS.some(c => c.id === id) ? id : 'todas';
  CATALOGO.visibles = PAGINA;
  renderCatalogo();
  actualizarUrl('cat', CATALOGO.cat === 'todas' ? '' : CATALOGO.cat);
  if (scroll) irATienda();
}

function limpiarFiltros() {
  CATALOGO.cat = 'todas'; CATALOGO.q = ''; CATALOGO.formatos.clear(); CATALOGO.usos.clear(); CATALOGO.ofertas = false; CATALOGO.visibles = PAGINA;
  const q = document.getElementById('q'); if (q) q.value = '';
  document.querySelectorAll('#filtrosPanel input[type="checkbox"]').forEach(c => { c.checked = false; });
  actualizarUrl('cat', '');
  renderCatalogo();
}

function initFiltros() {
  const chips = document.getElementById('chipsCat');
  if (chips) {
    chips.innerHTML = [{ id: 'todas', nombre: 'Todo' }, ...CATEGORIAS].map(c => {
      const n = c.id === 'todas' ? PRODUCTOS.length : PRODUCTOS.filter(p => p.categoria === c.id).length;
      return `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="${c.id === CATALOGO.cat}">${esc(c.nombre)}<span class="chip-count">${n}</span></button>`;
    }).join('');
    chips.addEventListener('click', e => { const b = e.target.closest('[data-chip]'); if (b) setCategoria(b.dataset.chip); });
  }
  const armarGrupo = (id, mapa, campo, set) => {
    const fs = document.getElementById(id);
    if (!fs) return;
    Object.entries(mapa).filter(([k]) => PRODUCTOS.some(p => p[campo] === k)).forEach(([k, nombre]) => {
      const label = document.createElement('label');
      label.className = 'check';
      label.innerHTML = `<input type="checkbox" value="${k}"> <span>${esc(nombre)}</span>`;
      fs.appendChild(label);
    });
    fs.addEventListener('change', e => {
      if (!e.target.matches('input')) return;
      if (e.target.checked) set.add(e.target.value); else set.delete(e.target.value);
      CATALOGO.visibles = PAGINA;
      renderCatalogo();
    });
  };
  armarGrupo('fFormato', FORMATOS, 'formato', CATALOGO.formatos);
  armarGrupo('fUso', USOS, 'uso', CATALOGO.usos);
  document.getElementById('fOfertas')?.addEventListener('change', e => { CATALOGO.ofertas = e.target.checked; CATALOGO.visibles = PAGINA; renderCatalogo(); });
  document.getElementById('orden')?.addEventListener('change', e => { CATALOGO.orden = e.target.value; CATALOGO.visibles = PAGINA; renderCatalogo(); });
  let espera = 0;
  document.getElementById('q')?.addEventListener('input', e => {
    clearTimeout(espera);
    espera = setTimeout(() => { CATALOGO.q = e.target.value; CATALOGO.visibles = PAGINA; renderCatalogo(); }, 180);
  });
  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(abierto));
    refrescarTriggers();
  });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarFiltros);
  document.querySelector('[data-limpiar]')?.addEventListener('click', limpiarFiltros);
  document.getElementById('verMas')?.addEventListener('click', () => {
    const desde = CATALOGO.visibles;
    CATALOGO.visibles += PAGINA;
    renderCatalogo({ desde });
  });
  document.getElementById('buscadorHeader')?.addEventListener('submit', e => {
    e.preventDefault();
    const valor = document.getElementById('qHeader')?.value || '';
    CATALOGO.q = valor; CATALOGO.cat = 'todas'; CATALOGO.visibles = PAGINA;
    const q = document.getElementById('q'); if (q) q.value = valor;
    renderCatalogo();
    irATienda();
  });
  document.querySelectorAll('a[data-cat]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setCategoria(a.dataset.cat, { scroll: true }); }));
  document.querySelectorAll('a[data-ofertas]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    CATALOGO.ofertas = true; CATALOGO.visibles = PAGINA;
    const box = document.getElementById('fOfertas'); if (box) box.checked = true;
    renderCatalogo();
    irATienda();
  }));
  document.querySelector('[data-ver-todo]')?.addEventListener('click', e => { e.preventDefault(); limpiarFiltros(); irATienda(); });
}

function cambiarPres(contenedor, k) {
  const p = getProducto(contenedor.dataset.id || contenedor.dataset.ficha);
  if (!p) return;
  const pr = getPres(p, k);
  contenedor.dataset.pres = pr.k;
  contenedor.querySelectorAll('[data-pres-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.presChip === pr.k)));
  const wrap = contenedor.querySelector('.prod-media .envase-wrap, .ficha-media .envase-wrap');
  if (wrap) wrap.innerHTML = envaseHTML(p, pr);
  const precio = contenedor.querySelector('[data-precio]');
  if (precio) precio.innerHTML = precioHTML(p, pr);
  const unidad = contenedor.querySelector('[data-unidad]');
  if (unidad) unidad.textContent = formatearPrecio(precioUnidad(p, pr));
  const unidadLabel = contenedor.querySelector('[data-unidad-label]');
  if (unidadLabel) unidadLabel.textContent = `Precio por ${unidadTexto(pr)}`;
}

function agregarDesde(boton, abrir) {
  const contenedor = boton.closest('[data-pres]');
  const p = getProducto(boton.dataset.agregar || boton.dataset.comprar);
  if (!p || !contenedor || p.stock <= 0) return;
  const pr = getPres(p, contenedor.dataset.pres);
  const input = contenedor.querySelector('[data-stepper] input');
  const qty = Math.max(1, Math.min(99, parseInt(input?.value, 10) || 1));
  Cart.add(p, pr.k, qty);
  if (abrir) {
    cerrarProducto(false);
    abrirDrawer(boton);
    return;
  }
  showToast(`Listo: ${p.corto} ${pr.etiqueta} ya está en el carrito.`);
  if (!boton.dataset.htmlOriginal) boton.dataset.htmlOriginal = boton.innerHTML;
  boton.textContent = 'Agregado ✓';
  clearTimeout(Number(boton.dataset.timer));
  boton.dataset.timer = String(setTimeout(() => { boton.innerHTML = boton.dataset.htmlOriginal; }, 1400));
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
function atraparFoco(e, contenedor) {
  if (e.key !== 'Tab') return;
  const els = [...contenedor.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { ultimo.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { primero.focus(); e.preventDefault(); }
}

let modalTrigger = null, modalTimer = 0;
function jsonLdProducto(p) {
  let s = document.getElementById('ldProducto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.descripcion, category: getCategoria(p.categoria)?.nombre,
    offers: p.presentaciones.map(pr => ({ '@type': 'Offer', name: pr.etiqueta, priceCurrency: 'ARS', price: String(precioFinal(p, pr)), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })),
  });
}

function renderFicha(p, pr) {
  const cont = document.getElementById('modalContenido');
  if (!cont) return;
  const cuidados = [p.peligro ? PELIGROS[p.peligro].cuidado : '', 'Guardalo en su envase original, cerrado y fuera del alcance de chicos y mascotas.', 'No lo mezcles con otros productos químicos.'].filter(Boolean);
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const acciones = p.stock <= 0 ? accionesHTML(p) : `${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta prod-add" data-agregar="${esc(p.id)}">Agregar al carrito</button><button type="button" class="btn btn-line prod-comprar" data-comprar="${esc(p.id)}">Comprar ahora</button>`;
  cont.innerHTML = `<div class="ficha" data-ficha="${esc(p.id)}" data-pres="${esc(pr.k)}">
    <div class="ficha-media"><span class="prod-badges">${badgesHTML(p)}</span>${envaseWrapHTML(p, pr)}</div>
    <div class="ficha-info">
      <p class="prod-cat">${esc(getCategoria(p.categoria)?.nombre || '')}</p>
      <h2 id="modalTitulo">${esc(p.nombre)}</h2>
      <p class="ficha-formula">${p.formula === 'Mix' ? 'Formulación en mezcla' : `Fórmula: ${esc(p.formula)}`}</p>
      <p>${esc(p.descripcion)}</p>
      <p class="ficha-precio prod-precio" data-precio>${precioHTML(p, pr)}</p>
      <div><p class="ficha-label">Presentación</p>${presChipsHTML(p, pr)}</div>
      <div class="ficha-acciones">${acciones}</div>
      <dl class="ficha-datos">
        <div><dt>Formato</dt><dd>${esc(FORMATOS[p.formato])}</dd></div>
        <div><dt>Uso</dt><dd>${esc(USOS[p.uso])}</dd></div>
        <div><dt data-unidad-label>Precio por ${unidadTexto(pr)}</dt><dd data-unidad>${formatearPrecio(precioUnidad(p, pr))}</dd></div>
        <div><dt>Presentaciones</dt><dd>${esc(p.presentaciones.map(x => x.etiqueta).join(' · '))}</dd></div>
      </dl>
      <div><p class="ficha-label">Modo de uso</p><p>${esc(p.modoUso)}</p></div>
      <div class="ficha-cuidados"><p class="ficha-label">Precauciones</p><ul>${cuidados.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
    </div>
    ${relacionados.length ? `<div class="ficha-relacionados"><p class="ficha-label">También te puede interesar</p><div class="rel-lista">${relacionados.map(r => {
      const rp = r.presentaciones[0];
      return `<button type="button" class="rel-item" data-abrir="${esc(r.id)}"><span class="rel-media">${envaseWrapHTML(r, rp)}</span><span><span class="rel-nombre">${esc(r.nombre)}</span><span class="rel-precio">Desde ${formatearPrecio(precioFinal(r, rp))}</span></span></button>`;
    }).join('')}</div></div>` : ''}
  </div>`;
}

function abrirProducto(id, presK, trigger) {
  const p = getProducto(id);
  const back = document.getElementById('modalProducto');
  if (!p || !back) return;
  if (back.hidden) modalTrigger = trigger || document.activeElement;
  clearTimeout(modalTimer);
  renderFicha(p, getPres(p, presK));
  if (back.hidden || !back.classList.contains('open')) {
    back.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => back.classList.add('open'));
  }
  const modal = back.querySelector('.modal');
  if (modal) modal.scrollTop = 0;
  back.querySelector('.modal-close')?.focus();
  actualizarUrl('producto', p.id);
  jsonLdProducto(p);
}

function cerrarProducto(devolverFoco = true) {
  const back = document.getElementById('modalProducto');
  if (!back || back.hidden) return;
  back.classList.remove('open');
  document.body.classList.remove('no-scroll');
  clearTimeout(modalTimer);
  modalTimer = setTimeout(() => { back.hidden = true; }, reduceMotion ? 0 : 300);
  actualizarUrl('producto', '');
  if (devolverFoco) modalTrigger?.focus?.();
}

let drawerTrigger = null, drawerTimer = 0, cambioDesdeDrawer = false;
const carritoSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">${carritoSvg}<p class="drawer-vacio-titulo">Tu carrito está vacío</p><p>Sumá productos desde el catálogo y acá vas a ver el total de cada presentación.</p><button type="button" class="btn btn-cta" data-drawer-ir>Ver el catálogo</button></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const pr = getPres(p, i.pres);
    return `<div class="drawer-item" data-linea="${esc(p.id)}" data-pres="${esc(pr.k)}">
      <span class="drawer-item-media">${envaseWrapHTML(p, pr)}</span>
      <div><p class="drawer-item-nombre">${esc(p.nombre)}</p><p class="drawer-item-pres">${esc(pr.etiqueta)} · ${formatearPrecio(precioFinal(p, pr))} c/u</p>${stepperHTML(p.nombre, i.qty)}</div>
      <div class="drawer-item-lado"><span class="drawer-item-precio" data-subtotal>${formatearPrecio(precioFinal(p, pr) * i.qty)}</span><button type="button" class="drawer-quitar" data-quitar>Quitar</button></div>
    </div>`;
  }).join('');
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer(trigger) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  drawerTrigger = trigger || document.activeElement;
  clearTimeout(drawerTimer);
  renderDrawer();
  drawer.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); });
  drawer.querySelector('.drawer-close')?.focus();
}

function cerrarDrawer(devolverFoco = true) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  clearTimeout(drawerTimer);
  drawerTimer = setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolverFoco) drawerTrigger?.focus?.();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initTiendaEventos() {
  document.addEventListener('click', e => {
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { abrirProducto(abrir.dataset.abrir, abrir.closest('[data-pres]')?.dataset.pres, abrir); return; }
    const chip = e.target.closest('[data-pres-chip]');
    if (chip) { const cont = chip.closest('.prod-card, .ficha'); if (cont) cambiarPres(cont, chip.dataset.presChip); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      if (!input) return;
      input.value = Math.max(1, Math.min(99, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      input.dispatchEvent(new window.Event('change', { bubbles: true }));
      return;
    }
    const agregar = e.target.closest('[data-agregar]');
    if (agregar) { agregarDesde(agregar, false); return; }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) { agregarDesde(comprar, true); return; }
    const catIr = e.target.closest('[data-cat-ir]');
    if (catIr) { setCategoria(catIr.dataset.catIr, { scroll: true }); return; }
    if (e.target.closest('[data-cart-open]')) { abrirDrawer(e.target.closest('[data-cart-open]')); return; }
    if (e.target.closest('[data-drawer-close]')) { cerrarDrawer(); return; }
    if (e.target.closest('[data-drawer-ir]')) { cerrarDrawer(false); irATienda(); return; }
    if (e.target.closest('[data-modal-close]')) { cerrarProducto(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { const linea = quitar.closest('[data-linea]'); if (linea) { Cart.remove(linea.dataset.linea, linea.dataset.pres); } }
  });
  document.getElementById('modalProducto')?.addEventListener('click', e => { if (e.target.id === 'modalProducto') cerrarProducto(); });
  document.getElementById('drawerBackdrop')?.addEventListener('click', () => cerrarDrawer());
  document.getElementById('drawerBody')?.addEventListener('change', e => {
    const linea = e.target.closest('[data-linea]');
    if (!linea || !e.target.matches('input')) return;
    const qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1));
    e.target.value = qty;
    cambioDesdeDrawer = true;
    Cart.setQty(linea.dataset.linea, linea.dataset.pres, qty);
    const p = getProducto(linea.dataset.linea);
    const sub = linea.querySelector('[data-subtotal]');
    if (p && sub) sub.textContent = formatearPrecio(precioFinal(p, getPres(p, linea.dataset.pres)) * qty);
    const total = document.getElementById('drawerTotal');
    if (total) total.textContent = formatearPrecio(Cart.total());
  });
  document.getElementById('finalizarCompra')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('keydown', e => {
    const back = document.getElementById('modalProducto');
    const drawer = document.getElementById('cartDrawer');
    if (back && !back.hidden) {
      if (e.key === 'Escape') cerrarProducto(); else atraparFoco(e, back.querySelector('.modal'));
    } else if (drawer && !drawer.hidden) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(e, drawer);
    }
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    const drawer = document.getElementById('cartDrawer');
    if (drawer && !drawer.hidden && !cambioDesdeDrawer) renderDrawer();
    cambioDesdeDrawer = false;
  });
  updateCartBadge();
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

function initDia() {
  const sec = document.querySelector('.dia');
  if (!sec) return;
  sec.querySelectorAll('[data-dia-prod]').forEach(slot => {
    const p = getProducto(slot.dataset.diaProd);
    if (!p) return;
    const pr = getPres(p, slot.dataset.pres);
    slot.innerHTML = `<div class="dia-mini" data-id="${esc(p.id)}" data-pres="${esc(pr.k)}">
      <button type="button" class="dia-mini-media" data-abrir="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}">${envaseWrapHTML(p, pr)}</button>
      <div class="dia-mini-info"><p class="dia-mini-nombre">${esc(p.nombre)} · ${esc(pr.etiqueta)}</p>
        <div class="dia-mini-fila"><p class="prod-precio" data-precio>${precioHTML(p, pr)}</p><button type="button" class="btn btn-cta prod-add" data-agregar="${esc(p.id)}">Agregar</button></div>
      </div>
    </div>`;
  });
  const textos = [...sec.querySelectorAll('.dia-texto')];
  const shots = [...sec.querySelectorAll('.dia-shot')];
  const marcas = [...sec.querySelectorAll('.dia-marca')];
  const hora = sec.querySelector('[data-dia-hora]');
  const N = Math.min(textos.length, 4);
  if (!N) return;
  if (reduceMotion) { sec.classList.add('is-static'); return; }
  let actual = -1;
  const activar = i => {
    if (i === actual) return;
    actual = i;
    textos.forEach((t, n) => t.classList.toggle('is-on', n === i));
    shots.forEach((s, n) => s.classList.toggle('is-on', n === i));
    marcas.forEach((m, n) => { m.classList.toggle('is-on', n === i); m.classList.toggle('is-pasada', n < i); });
    if (hora) hora.textContent = textos[i].dataset.hora || '';
  };
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };
  const calcular = () => {
    const p = progreso();
    const caja = sec.getBoundingClientRect();
    document.body.classList.toggle('en-dia', caja.top <= 1 && caja.bottom >= window.innerHeight - 1);
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    const img = shots[i]?.querySelector('img');
    if (img) img.style.transform = `scale(${(1.07 - local * 0.07).toFixed(4)})`;
  };
  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; calcular(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  marcas.forEach((m, i) => m.addEventListener('click', () => {
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(top + (sec.offsetHeight - window.innerHeight) * ((i + 0.5) / N)));
  }));
  calcular();
}

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
      if (r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) { el.classList.add('in'); io.unobserve(el); }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

function initHero() {
  const els = [...document.querySelectorAll('[data-hero]')];
  if (!els.length) return;
  els.forEach(el => { el.style.animation = 'none'; });
  if (typeof gsap === 'undefined' || reduceMotion) {
    els.forEach(el => { el.style.opacity = '1'; });
    return;
  }
  const q = nombre => document.querySelector(`[data-hero="${nombre}"]`);
  const cta = q('cta');
  const envases = q('envases');
  gsap.set([cta, envases], { opacity: 1 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(q('foto'), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.3 }, 0)
    .fromTo(q('eyebrow'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8 }, .1)
    .fromTo(q('title'), { opacity: 0, y: 26, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, clearProps: 'filter' }, .18)
    .fromTo(q('lead'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9 }, .4)
    .fromTo(cta.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, stagger: .12 }, .55)
    .fromTo(envases.children, { opacity: 0, y: 60, rotate: -8 }, { opacity: 1, y: 0, rotate: 0, duration: 1.1, stagger: .14, ease: 'back.out(1.4)' }, .45)
    .fromTo(q('tag'), { opacity: 0, y: 30, rotate: -10 }, { opacity: 1, y: 0, rotate: -2.5, duration: 1, ease: 'back.out(1.6)' }, .9);
}

function initScrollFx() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.cat-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('.cat-card'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const fotoConf = document.querySelector('.conf-foto img');
  if (fotoConf) gsap.fromTo(fotoConf, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.conf-foto', start: 'top bottom', end: 'bottom 40%', scrub: true } });
  const cruce = document.querySelector('.tienda-cruce');
  if (cruce) gsap.fromTo(cruce, { y: 30, rotate: 14 }, { y: 0, rotate: 6, ease: 'none', scrollTrigger: { trigger: '.tienda', start: 'top bottom', end: 'top 35%', scrub: true } });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'tienecomercioelectronico_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch { return; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-secondary']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

const PARAMS = new URLSearchParams(location.search);
initEnvasesSueltos();
initCategorias();
initRail();
if (CATEGORIAS.some(c => c.id === PARAMS.get('cat'))) CATALOGO.cat = PARAMS.get('cat');
document.getElementById('catalogoGrid')?.setAttribute('data-animate-stagger', '');
renderCatalogo({ primera: true });
initFiltros();
initTiendaEventos();
initDia();
initHero();
initReveals();
initScrollFx();
initNav();
initFloats();
initColorSwitch();
if (getProducto(PARAMS.get('producto'))) abrirProducto(PARAMS.get('producto'));
