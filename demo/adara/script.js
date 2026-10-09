document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP = '5492914611735';
const PAGE = 16;
const MAX_PRODUCTOS = 100;
const RAIL_MAX = 8;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const descuentoPct = p => p.antes ? Math.round((1 - p.precio / p.antes) * 100) : 0;
const wspUrl = texto => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
const intentar = fn => { try { fn(); } catch (err) { return err; } return null; };

const CATEGORIAS = [
  { id: 'facial', nombre: 'Facial' },
  { id: 'corporal', nombre: 'Corporal' },
  { id: 'capilar', nombre: 'Capilar' },
  { id: 'combos', nombre: 'Combos' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const NECESIDADES = [
  { id: 'hidratacion', nombre: 'Hidratación' },
  { id: 'antiage', nombre: 'Antiage' },
  { id: 'grasa', nombre: 'Piel grasa y poros' },
  { id: 'sensible', nombre: 'Piel sensible' },
  { id: 'exfoliacion', nombre: 'Exfoliación' },
  { id: 'solar', nombre: 'Protección solar' },
  { id: 'cabello', nombre: 'Cabello' },
];

const PIELES = [
  { id: 'todas', nombre: 'Todo tipo de piel' },
  { id: 'seca', nombre: 'Seca' },
  { id: 'mixta', nombre: 'Mixta y grasa' },
  { id: 'sensible', nombre: 'Sensible' },
];

const PRODUCTOS = [
  { id: 'serum-antiage', nombre: 'Sérum multiuso anti-age', cat: 'facial', nec: ['antiage', 'hidratacion'], piel: ['todas', 'seca'], precio: 15500, antes: 22000, tamano: '30 ml', desc: 'Efecto glow, nutritivo y reparador. Se aplica a la noche sobre la piel limpia, con un masaje suave hasta que absorbe.', uso: '3 o 4 gotas de noche, antes de la crema.', img: 'prod-gotero', destacado: true, tags: 'serum suero glow reparador nutritivo arrugas' },
  { id: 'tonico-facial', nombre: 'Tónico facial', cat: 'facial', nec: ['grasa'], piel: ['mixta'], precio: 9000, tamano: '125 ml', desc: 'Astringente y antimicrobiano, equilibra el pH. Hamamelis y té verde para afinar los poros y controlar el brillo durante el día.', uso: 'Después de la limpieza, con un algodón o en spray.', img: 'prod-spray', destacado: true, tags: 'tonico hamamelis te verde poros brillo' },
  { id: 'rose-mist', nombre: 'Rose Mist', cat: 'facial', nec: ['hidratacion', 'sensible'], piel: ['todas', 'sensible'], precio: 9000, tamano: '125 ml', desc: 'Bruma de rosas que hidrata, alivia y refresca. Para después de la limpieza, para fijar el maquillaje o en el bolso para el verano.', uso: 'A 20 cm del rostro, las veces que quieras.', img: 'prod-bandeja-2', destacado: true, tags: 'bruma rosas spray refrescante agua de rosas' },
  { id: 'exfoliante-nuez', nombre: 'Crema exfoliante con cáscara de nuez', cat: 'facial', nec: ['exfoliacion', 'grasa'], piel: ['mixta', 'todas'], precio: 9000, antes: 11500, tamano: '125 g', desc: 'Exfoliación mecánica suave con cáscara de nuez micronizada. Una vez por semana, con la piel húmeda, movimientos circulares y enjuague.', uso: 'Una vez por semana, sobre piel húmeda.', img: 'prod-frasco', destacado: true, tags: 'exfoliante scrub nuez puntos negros' },
  { id: 'mascarilla-arcilla-rosa', nombre: 'Mascarilla de arcilla de rosa', cat: 'facial', nec: ['grasa', 'sensible'], piel: ['mixta', 'sensible'], precio: 9500, antes: 11000, tamano: '80 g', desc: 'Arcilla rosa que purifica sin resecar. Capa fina, diez minutos y a enjuagar con agua tibia.', uso: 'Una o dos veces por semana.', img: 'prod-mini', destacado: true, tags: 'mascara mascarilla arcilla purificante' },
  { id: 'manteca-corporal', nombre: 'Manteca corporal ultrahidratante', cat: 'corporal', nec: ['hidratacion'], piel: ['seca', 'todas'], precio: 17500, antes: 20000, tamano: '100 g', desc: 'Manteca densa para piel seca o después de la depilación. Se funde con el calor de las manos y deja la piel suave, sin sensación grasa.', uso: 'Después del baño, sobre la piel apenas húmeda.', img: 'prod-locion', destacado: true, tags: 'body butter manteca corporal piernas depilacion' },
  { id: 'protector-solar-40', nombre: 'Protector solar FPS 40', cat: 'facial', nec: ['solar', 'sensible'], piel: ['todas'], precio: 11500, antes: 12500, tamano: '60 g', desc: 'Filtro UVA y UVB con fórmula natural, apto para usar debajo del maquillaje. El paso que cierra cualquier rutina, también en invierno.', uso: 'Todas las mañanas, como último paso.', img: 'prod-pump', destacado: true, tags: 'protector solar fps 40 uva uvb sol' },
  { id: 'jabon-avena', nombre: 'Jabón de avena', cat: 'facial', nec: ['sensible', 'hidratacion'], piel: ['sensible', 'seca'], precio: 4000, antes: 4500, tamano: '60 g', desc: 'Jabón artesanal de avena para piel sensible o con rosácea. Limpia sin tirantez y sirve para cara y cuerpo.', uso: 'Mañana y noche, con agua tibia.', img: 'prod-flor', tags: 'jabon avena artesanal rosacea' },
  { id: 'gel-limpieza', nombre: 'Gel de limpieza facial', cat: 'facial', nec: ['grasa', 'hidratacion'], piel: ['mixta', 'todas'], precio: 8500, tamano: '150 ml', desc: 'Gel suave con extracto de pepino que retira impurezas y maquillaje liviano sin resecar. El primer paso de la rutina, mañana y noche.', uso: 'Mañana y noche, antes del tónico.', img: 'prod-gel', nuevo: true, tags: 'gel limpiador limpieza pepino espuma' },
  { id: 'ampollas-capilares', nombre: 'Ampollas capilares x 3', cat: 'capilar', nec: ['cabello'], piel: ['todas'], precio: 9500, tamano: '3 ampollas de 10 ml', desc: 'Semillas de lino, keratina, caviar y argán. Tratamiento semanal en casa: una ampolla sobre el cabello húmedo después del shampoo.', uso: 'Una ampolla por semana, sin enjuague.', img: 'prod-dropper', destacado: false, tags: 'ampollas pelo cabello keratina argan lino caviar' },
  { id: 'mascarilla-stick', nombre: 'Mascarilla facial en stick', cat: 'facial', nec: ['grasa', 'exfoliacion'], piel: ['mixta'], precio: 5000, antes: 6000, tamano: '40 g', desc: 'Limpieza profunda para piel mixta, en formato stick: se aplica directo, sin pincel ni ensuciarse las manos.', uso: 'Una vez por semana, sobre la zona T.', img: 'prod-bandeja-3', tags: 'mascara stick limpieza profunda zona t' },
  { id: 'combo-corporal', nombre: 'Combo exfoliante corporal + body butter', cat: 'combos', nec: ['exfoliacion', 'hidratacion'], piel: ['todas', 'seca'], precio: 25000, tamano: '2 productos', desc: 'Exfoliante corporal 100 % natural y manteca para sellar la hidratación. El dúo para piernas lisas antes y después del láser.', uso: 'Exfoliante dos veces por semana; manteca todos los días.', img: 'prod-set-der', tags: 'combo kit corporal exfoliante manteca' },
  { id: 'combo-serum-guasha', nombre: 'Combo sérum + gua sha + jabón natural', cat: 'combos', nec: ['antiage', 'hidratacion'], piel: ['todas'], precio: 25000, tamano: '3 productos', desc: 'Tres pasos para una rutina de noche: jabón natural, sérum multiuso y gua sha de piedra para drenar y relajar el rostro.', uso: 'Jabón, sérum y cinco minutos de gua sha.', img: 'prod-set-izq', destacado: true, tags: 'combo kit guasha gua sha serum jabon regalo' },
  { id: 'kit-ampollas', nombre: 'Kit x 5 ampollas', cat: 'capilar', nec: ['cabello'], piel: ['todas'], precio: 5000, tamano: '5 ampollas de 2 ml', desc: 'Cinco ampollas de 2 ml para un mes de tratamiento intensivo. Ideal para probar la línea capilar antes de la caja grande.', uso: 'Una ampolla por semana.', img: 'prod-bandeja', tags: 'ampollas kit pelo cabello' },
  { id: 'crema-hidratante', nombre: 'Crema hidratante facial', cat: 'facial', nec: ['hidratacion', 'sensible'], piel: ['seca', 'sensible'], precio: 12000, tamano: '50 g', desc: 'Textura liviana con aloe y aceite de jojoba. Hidrata todo el día sin brillo y va bien debajo del protector solar.', uso: 'Mañana y noche, después del sérum.', img: 'prod-frasco', nuevo: true, tags: 'crema hidratante aloe jojoba' },
  { id: 'aceite-corporal', nombre: 'Aceite corporal de almendras', cat: 'corporal', nec: ['hidratacion'], piel: ['seca', 'todas'], precio: 10500, tamano: '200 ml', desc: 'Aceite de almendras dulces prensado en frío. Para masajes, estrías y piel muy seca después del baño.', uso: 'Sobre la piel húmeda, con masaje.', img: 'prod-gel', tags: 'aceite almendras masaje estrias' },
  { id: 'cepillo-silicona', nombre: 'Envase con cepillo facial de silicona', cat: 'accesorios', nec: ['grasa', 'exfoliacion'], piel: ['todas'], precio: 8000, antes: 9000, tamano: '1 unidad', desc: 'Envase con cepillo de silicona en la tapa: hace espuma con el gel y limpia los poros con un masaje suave.', uso: 'Con el gel de limpieza, mañana y noche.', img: 'prod-pump', tags: 'cepillo silicona espuma accesorio' },
  { id: 'vincha-toalla', nombre: 'Vincha skin care de toalla', cat: 'accesorios', nec: [], piel: ['todas'], precio: 4000, tamano: '1 unidad', desc: 'Vincha de toalla ajustable para que el pelo no moleste en la rutina de limpieza o mientras actúa la máscara.', uso: 'Se lava a mano.', img: 'prod-flor', tags: 'vincha toalla skincare accesorio' },
  { id: 'limpiador-brochas', nombre: 'Limpiador de brochas', cat: 'accesorios', nec: [], piel: ['todas'], precio: 4200, antes: 5000, tamano: '100 ml', desc: 'Limpiador 100 % natural para brochas y esponjas de maquillaje. Una vez por semana, enjuague y a secar al aire.', uso: 'Una vez por semana.', img: 'prod-spray', tags: 'limpiador brochas esponjas maquillaje' },
  { id: 'exfoliante-corporal-azucar', nombre: 'Exfoliante corporal de azúcar', cat: 'corporal', nec: ['exfoliacion'], piel: ['todas'], precio: 9800, tamano: '200 g', desc: 'Azúcar orgánica y aceite de coco. Dos veces por semana antes de la depilación: menos pelos encarnados y la piel lista para la manteca.', uso: 'Dos veces por semana, en la ducha.', img: 'prod-mini', tags: 'exfoliante corporal azucar coco scrub' },
  { id: 'contorno-ojos', nombre: 'Contorno de ojos', cat: 'facial', nec: ['antiage', 'hidratacion'], piel: ['todas'], precio: 13500, tamano: '15 ml', desc: 'Gel-crema con cafeína y ácido hialurónico para bolsas y líneas finas. Un toque con el anular, mañana y noche.', uso: 'Mañana y noche, con golpecitos suaves.', img: 'prod-gotero', nuevo: true, tags: 'contorno ojos ojeras bolsas cafeina' },
  { id: 'agua-micelar', nombre: 'Agua micelar', cat: 'facial', nec: ['sensible', 'hidratacion'], piel: ['todas', 'sensible'], precio: 7800, tamano: '200 ml', desc: 'Desmaquilla y limpia en un solo paso, sin frotar ni enjuagar. Apta para ojos sensibles.', uso: 'Con un algodón, de noche.', img: 'prod-locion', tags: 'agua micelar desmaquillante' },
];

const LASER_PARA = 'Vello oscuro sobre piel clara o media responde mejor; evaluamos tu caso en la primera sesión.';
const LASER_INCLUYE = ['Evaluación de la zona y prueba de disparo', 'Sesión con equipo láser y gel frío', 'Indicaciones para los días posteriores'];
const LASER_NOTA = 'Una sesión cada 30 a 45 días. En general se trabaja en ciclos de 8 a 10 sesiones.';

const TRATAMIENTOS = [
  { id: 'limpieza-profunda', cat: 'facial', nombre: 'Limpieza facial profunda', dur: 60, para: 'Todo tipo de piel, cada 30 a 45 días', incluye: ['Higiene y exfoliación', 'Vapor y extracción de comedones', 'Máscara según tu piel y protector solar'], nota: 'La base de cualquier rutina: con la piel limpia, los activos entran.' },
  { id: 'hidratacion-hialuronico', cat: 'facial', nombre: 'Hidratación con ácido hialurónico', dur: 50, para: 'Piel seca, deshidratada o apagada', incluye: ['Limpieza suave', 'Sérum de ácido hialurónico con aparatología', 'Máscara hidratante'], nota: 'Ideal antes de un evento o después del verano.' },
  { id: 'peeling', cat: 'facial', nombre: 'Peeling químico', dur: 40, para: 'Manchas, marcas de acné y textura irregular', incluye: ['Evaluación de la piel', 'Aplicación del ácido según tu caso', 'Neutralización y protección solar'], nota: 'Se indica en otoño e invierno, siempre con protector solar después.' },
  { id: 'radiofrecuencia-facial', cat: 'facial', nombre: 'Radiofrecuencia facial', dur: 45, para: 'Flacidez, óvalo facial y líneas finas', incluye: ['Limpieza', 'Radiofrecuencia por zonas', 'Máscara calmante'], nota: 'Se trabaja en sesiones semanales; el efecto es progresivo.' },
  { id: 'dermaplaning', cat: 'facial', nombre: 'Dermaplaning', dur: 40, para: 'Vello fino, piel opaca, antes del maquillaje', incluye: ['Limpieza', 'Exfoliación con bisturí estéril', 'Hidratación y protector solar'], nota: 'Sin dolor y sin tiempo de recuperación.' },
  { id: 'hifu-facial', cat: 'facial', nombre: 'HIFU facial', dur: 60, para: 'Firmeza y definición del óvalo, sin cirugía', incluye: ['Evaluación y marcación', 'Ultrasonido focalizado por zonas', 'Indicaciones para casa'], nota: 'Indoloro y sin tiempo de recuperación. Una sesión y control a los tres meses.' },
  { id: 'ultracavitacion', cat: 'corporal', nombre: 'Ultracavitación', dur: 45, para: 'Adiposidad localizada en abdomen, piernas o brazos', incluye: ['Medición de la zona', 'Ultracavitación con gel conductor', 'Drenaje de cierre'], nota: 'Se trabaja en series, dos veces por semana.' },
  { id: 'radiofrecuencia-corporal', cat: 'corporal', nombre: 'Radiofrecuencia corporal', dur: 45, para: 'Flacidez de abdomen, brazos y glúteos', incluye: ['Preparación de la zona', 'Radiofrecuencia con cabezal corporal', 'Crema reafirmante'], nota: 'Suele combinarse con ultracavitación en la misma serie.' },
  { id: 'hifu-corporal', cat: 'corporal', nombre: 'HIFU corporal', dur: 60, para: 'Firmeza en abdomen, brazos y cara interna de muslos', incluye: ['Evaluación y marcación', 'Ultrasonido focalizado', 'Indicaciones para casa'], nota: 'Indoloro, seguro y eficaz. Una sesión y control a los tres meses.' },
  { id: 'drenaje-linfatico', cat: 'corporal', nombre: 'Drenaje linfático manual', dur: 50, para: 'Retención de líquidos y piernas pesadas', incluye: ['Maniobras manuales suaves', 'Trabajo de piernas, abdomen y brazos', 'Hidratación final'], nota: 'También después de una cirugía, con indicación médica.' },
  { id: 'masaje-modelador', cat: 'corporal', nombre: 'Masaje reductor modelador', dur: 50, para: 'Contorno corporal y celulitis', incluye: ['Exfoliación previa', 'Masaje con maniobras reductoras', 'Crema modeladora'], nota: 'Mejor en serie y combinado con exfoliante en casa.' },
  { id: 'presoterapia', cat: 'corporal', nombre: 'Presoterapia', dur: 40, para: 'Circulación y piernas cansadas', incluye: ['Botas de presoterapia', 'Programa según tu caso', 'Hidratación final'], nota: 'Relajante: muchas personas lo combinan con otro corporal.' },
  { id: 'laser-axilas', cat: 'laser', nombre: 'Axilas', dur: 15, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-cavado', cat: 'laser', nombre: 'Cavado completo', dur: 20, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-media-pierna', cat: 'laser', nombre: 'Media pierna', dur: 25, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-piernas', cat: 'laser', nombre: 'Piernas completas', dur: 45, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-rostro', cat: 'laser', nombre: 'Rostro: bozo y mentón', dur: 15, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-brazos', cat: 'laser', nombre: 'Brazos completos', dur: 25, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-espalda', cat: 'laser', nombre: 'Espalda', dur: 30, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
  { id: 'laser-cuerpo', cat: 'laser', nombre: 'Cuerpo completo', dur: 90, para: LASER_PARA, incluye: LASER_INCLUYE, nota: LASER_NOTA },
];

const TRAT_CAT = {
  facial: { nombre: 'Facial', img: 'serum', alt: 'Aplicación de sérum durante un tratamiento facial' },
  corporal: { nombre: 'Corporal', img: 'corporal', alt: 'Sesión de ultracavitación corporal' },
  laser: { nombre: 'Depilación láser', img: 'laser', alt: 'Sesión de depilación láser en piernas' },
};

const catLabel = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const necLabel = id => NECESIDADES.find(n => n.id === id)?.nombre || '';
const pielLabel = id => PIELES.find(n => n.id === id)?.nombre || '';
const getTratamiento = id => TRATAMIENTOS.find(t => t.id === id);

const Cart = {
  KEY: 'adara_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

const ESTADO_INICIAL = {
  subir: 'opacity:0;transform:translateY(48px)',
  der: 'opacity:0;transform:translateX(64px)',
  escala: 'opacity:0;transform:translateY(20px) scale(.92)',
};

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

function refrescarScroll() {
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function irA(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function trapFocus(container) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const handler = e => {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(sel)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

function crearOverlay({ backdrop, panel, closeBtn, togglePanel = true, onClose }) {
  let release = null;
  let opener = null;
  let timer = 0;
  const open = origen => {
    opener = origen || document.activeElement;
    clearTimeout(timer);
    backdrop.hidden = false;
    if (togglePanel) panel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      backdrop.classList.add('open');
      panel.classList.add('open');
    }));
    document.body.classList.add('no-scroll');
    release = trapFocus(panel);
    setTimeout(() => (closeBtn || panel).focus(), 80);
  };
  const close = () => {
    if (backdrop.hidden) return;
    backdrop.classList.remove('open');
    panel.classList.remove('open');
    release?.();
    release = null;
    document.body.classList.remove('no-scroll');
    timer = setTimeout(() => { backdrop.hidden = true; if (togglePanel) panel.hidden = true; }, 320);
    onClose?.();
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    opener = null;
  };
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });
  return { open, close, abierto: () => !backdrop.hidden };
}

function stepperHTML(valor = 1) {
  return `<div class="stepper" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Restar uno">${ICON.minus}</button><output aria-live="polite">${valor}</output><button type="button" data-step="1" aria-label="Sumar uno">${ICON.plus}</button></div>`;
}

function precioHTML(p, extra = '') {
  const off = descuentoPct(p);
  return `<div class="card__price ${off ? 'has-off' : ''} ${extra}"><span class="price">${formatearPrecio(precioFinal(p))}</span>${off ? `<s>${formatearPrecio(p.antes)}</s>` : ''}</div>`;
}

function cardHTML(p, extra = '', animar = true, variante = 'subir', liviana = false) {
  const off = descuentoPct(p);
  const anim = animar ? ` data-animate="${variante}" style="${ESTADO_INICIAL[variante] || ESTADO_INICIAL.subir}"` : '';
  const sub = p.nec[0] ? ` · ${esc(necLabel(p.nec[0]))}` : '';
  const agregar = `<button type="button" class="btn btn-cta prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar<span class="lbl-largo"> al carrito</span></button>`;
  const fila = liviana
    ? precioHTML(p)
    : `<div class="card__row">${precioHTML(p)}<button type="button" class="card__buy" data-buy="${esc(p.id)}">Comprar ahora</button></div>`;
  const acciones = liviana
    ? `<div class="prod-actions">${agregar}</div>`
    : `<div class="prod-actions">${stepperHTML()}${agregar}</div>`;
  return `<article class="card ${extra}" data-id="${esc(p.id)}"${anim}>
    <div class="card__media" data-quick="${esc(p.id)}">
      <img src="images/${esc(p.img)}.webp" alt="${esc(p.nombre)}" width="900" height="900">
      <div class="card__badges">${off ? `<span class="badge badge--off">-${off}%</span>` : ''}${p.nuevo ? '<span class="badge badge--nuevo">Nuevo</span>' : ''}</div>
      <span class="card__quick" aria-hidden="true">${ICON.eye}</span>
    </div>
    <div class="card__body">
      <span class="card__cat">${esc(catLabel(p.cat))}${sub}</span>
      <h3 class="card__name"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      ${fila}
      ${acciones}
    </div>
  </article>`;
}

function qtyDe(btn) {
  const out = btn.closest('.prod-actions, .modal-actions')?.querySelector('output');
  return Math.max(1, parseInt(out?.textContent || '1', 10) || 1);
}

const estado = { q: '', cat: new Set(), nec: new Set(), piel: new Set(), precio: '', oferta: false, orden: 'relevancia', pagina: 1 };
let listaActual = [];
let renderizados = 0;

const normalizar = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function textoBusqueda(p) {
  return normalizar([p.nombre, catLabel(p.cat), ...p.nec.map(necLabel), ...p.piel.map(pielLabel), p.desc, p.tags || ''].join(' '));
}

function filtrarProductos() {
  const terminos = normalizar(estado.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.slice(0, MAX_PRODUCTOS).filter(p => {
    if (terminos.length) {
      const txt = textoBusqueda(p);
      if (!terminos.every(t => txt.includes(t))) return false;
    }
    if (estado.cat.size && !estado.cat.has(p.cat)) return false;
    if (estado.nec.size && !p.nec.some(n => estado.nec.has(n))) return false;
    if (estado.piel.size && !p.piel.some(n => estado.piel.has(n))) return false;
    if (estado.oferta && !descuentoPct(p)) return false;
    if (estado.precio) {
      const [min, max] = estado.precio.split('-').map(v => (v === '' ? null : Number(v)));
      const pf = precioFinal(p);
      if (min !== null && pf < min) return false;
      if (max !== null && pf > max) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista = lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista = lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function filtrosActivos() {
  return estado.cat.size + estado.nec.size + estado.piel.size + (estado.precio ? 1 : 0) + (estado.oferta ? 1 : 0);
}

function renderCatalogo({ reset = false } = {}) {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  if (reset) { estado.pagina = 1; renderizados = 0; grid.innerHTML = ''; }
  listaActual = filtrarProductos();
  const visibles = listaActual.slice(0, estado.pagina * PAGE);
  const nuevos = visibles.slice(renderizados);
  if (nuevos.length) grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  renderizados = visibles.length;
  const count = document.getElementById('catalogo-count');
  if (count) {
    const n = listaActual.length;
    count.innerHTML = n ? `<b>${n}</b> ${n === 1 ? 'producto' : 'productos'}${estado.q ? ` para «${esc(estado.q)}»` : ''}` : 'Sin resultados';
  }
  const vacio = document.getElementById('catalogo-vacio');
  if (vacio) vacio.hidden = listaActual.length > 0;
  const verMas = document.getElementById('ver-mas');
  if (verMas) verMas.hidden = visibles.length >= listaActual.length;
  const progreso = document.getElementById('catalogo-progreso');
  if (progreso) progreso.textContent = listaActual.length ? `Mostrando ${visibles.length} de ${listaActual.length}` : '';
  const activos = document.getElementById('filtros-activos');
  if (activos) { const n = filtrosActivos(); activos.textContent = n ? `(${n})` : ''; }
  revelarNuevos(grid);
  refrescarScroll();
}

function sincronizarFiltrosUI() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cat.has(i.value); });
  document.querySelectorAll('input[data-f="nec"]').forEach(i => { i.checked = estado.nec.has(i.value); });
  document.querySelectorAll('input[data-f="piel"]').forEach(i => { i.checked = estado.piel.has(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  const of = document.querySelector('input[data-f="oferta"]'); if (of) of.checked = estado.oferta;
  document.querySelectorAll('#buscar-input, #hero-buscar').forEach(i => { i.value = estado.q; });
}

function limpiarFiltros() {
  estado.q = ''; estado.cat.clear(); estado.nec.clear(); estado.piel.clear(); estado.precio = ''; estado.oferta = false;
  sincronizarFiltrosUI();
  renderCatalogo({ reset: true });
}

function filtrarPorCategoria(cat) {
  estado.cat = new Set([cat]);
  estado.nec.clear(); estado.piel.clear(); estado.precio = ''; estado.oferta = false; estado.q = '';
  sincronizarFiltrosUI();
  renderCatalogo({ reset: true });
  irA('#tienda');
}

function buscar(q) {
  estado.q = q.trim();
  sincronizarFiltrosUI();
  renderCatalogo({ reset: true });
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const pintarGrupo = (clave, items, conteo) => {
    const grupo = document.querySelector(`.filtro-grupo[data-filtro="${clave}"]`);
    if (!grupo) return;
    grupo.insertAdjacentHTML('beforeend', items.map(it => {
      const n = conteo(it.id);
      return `<label class="filtro-opt"><input type="checkbox" data-f="${clave}" value="${esc(it.id)}"><span>${esc(it.nombre)}</span><small>${n}</small></label>`;
    }).join(''));
  };
  pintarGrupo('cat', CATEGORIAS, id => PRODUCTOS.filter(p => p.cat === id).length);
  pintarGrupo('nec', NECESIDADES, id => PRODUCTOS.filter(p => p.nec.includes(id)).length);
  pintarGrupo('piel', PIELES, id => PRODUCTOS.filter(p => p.piel.includes(id)).length);

  document.querySelectorAll('.filtros input[data-f]').forEach(input => {
    input.addEventListener('change', () => {
      const f = input.dataset.f;
      if (f === 'precio') estado.precio = input.value;
      else if (f === 'oferta') estado.oferta = input.checked;
      else if (input.checked) estado[f].add(input.value);
      else estado[f].delete(input.value);
      renderCatalogo({ reset: true });
    });
  });

  const form = document.getElementById('buscador');
  const input = document.getElementById('buscar-input');
  let deb = 0;
  form?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); buscar(input.value); });
  input?.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => buscar(input.value), 260); });

  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo({ reset: true }); });
  document.getElementById('filtros-limpiar')?.addEventListener('click', limpiarFiltros);
  document.querySelector('#catalogo-vacio [data-limpiar]')?.addEventListener('click', limpiarFiltros);
  document.getElementById('ver-mas')?.addEventListener('click', () => { estado.pagina += 1; renderCatalogo(); });

  const aside = document.getElementById('filtros');
  const toggle = document.getElementById('filtros-toggle');
  const cerrar = document.getElementById('filtros-close');
  if (aside && toggle) {
    let bd = document.querySelector('.filtros-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; aside.parentNode.insertBefore(bd, aside); }
    const mq = window.matchMedia('(min-width: 1025px)');
    const open = () => { aside.classList.add('open'); bd.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll'); cerrar?.focus(); };
    const close = () => { aside.classList.remove('open'); bd.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll'); };
    toggle.addEventListener('click', () => (aside.classList.contains('open') ? close() : open()));
    cerrar?.addEventListener('click', () => { close(); toggle.focus(); });
    bd.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && aside.classList.contains('open')) { close(); toggle.focus(); } });
    mq.addEventListener('change', () => { if (mq.matches) close(); });
  }

  document.querySelectorAll('[data-cat-link]').forEach(b => b.addEventListener('click', () => filtrarPorCategoria(b.dataset.catLink)));

  renderCatalogo({ reset: true });
}

function initHeroSearch() {
  const form = document.getElementById('hero-buscador');
  const input = document.getElementById('hero-buscar');
  if (form && input) {
    form.addEventListener('submit', e => { e.preventDefault(); buscar(input.value); irA('#tienda'); });
  }
  document.querySelectorAll('[data-hero-cat]').forEach(b => b.addEventListener('click', () => filtrarPorCategoria(b.dataset.heroCat)));
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
      intentar(() => vp.setPointerCapture?.(pointerId));
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      intentar(() => vp.releasePointerCapture?.(pointerId));
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

function initRail() {
  const vp = document.getElementById('rail-vp');
  const track = document.getElementById('rail-track');
  if (!vp || !track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, RAIL_MAX);
  track.innerHTML = destacados.map(p => cardHTML(p, 'rail-card', true, 'subir', true)).join('');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 290) + 18;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

let quickView = null;
let tratModal = null;
let cartDrawer = null;

function relacionadosHTML(p) {
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  if (!rel.length) return '';
  return `<div class="relacionados"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-quick="${esc(r.id)}"><span class="rel-img"><img src="images/${esc(r.img)}.webp" alt="" width="900" height="900"></span><span class="rel-name">${esc(r.nombre)}</span><span class="rel-price">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>`;
}

function openQuickView(id, origen) {
  const p = getProducto(id);
  const cont = document.getElementById('quick-content');
  if (!p || !cont || !quickView) return;
  const off = descuentoPct(p);
  cont.innerHTML = `
    <figure class="modal-media"><img src="images/${esc(p.img)}.webp" alt="${esc(p.nombre)}" width="900" height="900">${off ? `<div class="card__badges"><span class="badge badge--off">-${off}%</span></div>` : ''}</figure>
    <div class="modal-info">
      <span class="card__cat">${esc(catLabel(p.cat))}${p.nec[0] ? ` · ${esc(necLabel(p.nec[0]))}` : ''}</span>
      <h2>${esc(p.nombre)}</h2>
      ${precioHTML(p)}
      <p class="modal-desc">${esc(p.desc)}</p>
      <p class="modal-dato"><b>Presentación:</b><span>${esc(p.tamano)}</span></p>
      <p class="modal-dato"><b>Para:</b><span>${esc(p.piel.map(pielLabel).join(', '))}</span></p>
      <p class="modal-dato"><b>Cómo se usa:</b><span>${esc(p.uso)}</span></p>
      <div class="modal-actions">${stepperHTML()}<button type="button" class="btn btn-cta" data-add="${esc(p.id)}">Agregar al carrito</button><button type="button" class="btn btn-outline" data-buy="${esc(p.id)}">Comprar ahora</button></div>
      ${relacionadosHTML(p)}
    </div>`;
  if (quickView.abierto()) {
    document.getElementById('quick-modal')?.scrollTo({ top: 0 });
    return;
  }
  quickView.open(origen);
}

function initQuickView() {
  const backdrop = document.getElementById('quick-backdrop');
  const panel = document.getElementById('quick-modal');
  const closeBtn = document.getElementById('quick-close');
  if (!backdrop || !panel) return;
  quickView = crearOverlay({ backdrop, panel, closeBtn, togglePanel: false });
}

function openTratModal(id, origen) {
  const t = getTratamiento(id);
  const cont = document.getElementById('trat-content');
  if (!t || !cont || !tratModal) return;
  const cat = TRAT_CAT[t.cat];
  const nombreCompleto = t.cat === 'laser' ? `Depilación láser: ${t.nombre}` : t.nombre;
  cont.innerHTML = `
    <figure class="modal-media"><img src="images/${cat.img}.webp" alt="${esc(cat.alt)}" width="1254" height="1254"></figure>
    <div class="modal-info">
      <span><span class="chip">${esc(cat.nombre)}</span></span>
      <h2>${esc(nombreCompleto)}</h2>
      <p class="modal-dato"><b>Duración:</b><span>${t.dur} min${t.cat === 'laser' ? ' por sesión' : ''}</span></p>
      <p class="modal-dato"><b>Para:</b><span>${esc(t.para)}</span></p>
      <ul class="modal-lista">${t.incluye.map(i => `<li>${ICON.check}<span>${esc(i)}</span></li>`).join('')}</ul>
      <p class="modal-desc">${esc(t.nota)} El valor se confirma al reservar.</p>
      <div class="modal-actions"><button type="button" class="btn btn-cta" data-reservar="${esc(t.id)}">Reservar turno</button><a class="btn btn-outline" href="${wspUrl(`Hola Adara, quiero reservar un turno para ${nombreCompleto}.`)}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
    </div>`;
  tratModal.open(origen);
}

function initTratModal() {
  const backdrop = document.getElementById('trat-backdrop');
  const panel = document.getElementById('trat-modal');
  const closeBtn = document.getElementById('trat-close');
  if (!backdrop || !panel) return;
  tratModal = crearOverlay({ backdrop, panel, closeBtn, togglePanel: false });
}

function tratRowHTML(t, n) {
  const meta = t.cat === 'laser' ? `<b>${t.dur} min</b> · por sesión` : `<b>${t.dur} min</b> · ${esc(t.para)}`;
  return `<li data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="trat-row">
    <button type="button" class="trat-open" data-trat="${esc(t.id)}"><span class="trat-num">${n}</span><span><span class="trat-name">${esc(t.nombre)}</span><span class="trat-meta">${meta}</span></span></button>
    <button type="button" class="btn btn-outline btn-sm trat-reservar" data-reservar="${esc(t.id)}">Reservar</button>
  </div></li>`;
}

function activarTab(cat, { focus = false } = {}) {
  const tabs = [...document.querySelectorAll('.tab[data-tab]')];
  if (!tabs.length) return;
  tabs.forEach(tab => {
    const activo = tab.dataset.tab === cat;
    tab.setAttribute('aria-selected', activo ? 'true' : 'false');
    tab.tabIndex = activo ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !activo;
    if (activo && focus) tab.focus();
  });
  const panel = document.getElementById(`panel-${cat}`);
  if (panel) revelarNuevos(panel);
  refrescarScroll();
}

function initTratamientos() {
  document.querySelectorAll('[data-trat-list]').forEach(ol => {
    const cat = ol.dataset.tratList;
    ol.innerHTML = TRATAMIENTOS.filter(t => t.cat === cat).map((t, i) => tratRowHTML(t, i + 1)).join('');
  });
  const tabs = [...document.querySelectorAll('.tab[data-tab]')];
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activarTab(tab.dataset.tab));
    tab.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let j = i;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      activarTab(tabs[j].dataset.tab, { focus: true });
    });
  });
  document.querySelectorAll('[data-tab-link]').forEach(a => a.addEventListener('click', () => activarTab(a.dataset.tabLink)));
}

function reservar(id) {
  const select = document.getElementById('turno-trat');
  tratModal?.close();
  quickView?.close();
  cartDrawer?.close();
  if (select && getTratamiento(id)) {
    select.value = id;
    select.closest('.field')?.classList.remove('has-error');
    select.removeAttribute('aria-invalid');
  }
  irA('#turnos');
  setTimeout(() => document.getElementById('turno-dia')?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
}

function initTurnos() {
  const form = document.getElementById('form-turno');
  if (!form) return;
  const select = document.getElementById('turno-trat');
  const grupos = [['facial', 'Faciales'], ['corporal', 'Corporales'], ['laser', 'Depilación láser']];
  select.insertAdjacentHTML('beforeend', grupos.map(([cat, label]) => `<optgroup label="${label}">${TRATAMIENTOS.filter(t => t.cat === cat).map(t => `<option value="${esc(t.id)}">${esc(t.nombre)}${cat === 'laser' ? ' (láser)' : ''}</option>`).join('')}</optgroup>`).join(''));

  const dia = document.getElementById('turno-dia');
  const hoy = new Date();
  const iso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  dia.min = iso;

  const wsp = document.getElementById('turno-wsp');
  let mascara = null;
  if (typeof IMask !== 'undefined') mascara = IMask(wsp, { mask: '+{54} 9 000 000-0000' });

  const nombre = document.getElementById('turno-nombre');
  const enviar = document.getElementById('turno-enviar');

  const marcar = (campo, errorId, invalido) => {
    const field = campo.closest('.field');
    field?.classList.toggle('has-error', invalido);
    if (campo.tagName === 'FIELDSET') return;
    if (invalido) { campo.setAttribute('aria-invalid', 'true'); campo.setAttribute('aria-describedby', errorId); }
    else { campo.removeAttribute('aria-invalid'); campo.removeAttribute('aria-describedby'); }
  };

  const validar = () => {
    const errores = [];
    const franja = form.querySelector('input[name="franja"]:checked');
    const digitos = (mascara ? mascara.unmaskedValue : wsp.value.replace(/\D/g, ''));
    const diaOk = dia.value && dia.value >= iso;
    marcar(select, 'err-trat', !select.value); if (!select.value) errores.push(select);
    marcar(dia, 'err-dia', !diaOk); if (!diaOk) errores.push(dia);
    marcar(form.querySelector('fieldset'), 'err-franja', !franja); if (!franja) errores.push(form.querySelector('input[name="franja"]'));
    marcar(nombre, 'err-nombre', nombre.value.trim().length < 2); if (nombre.value.trim().length < 2) errores.push(nombre);
    marcar(wsp, 'err-wsp', digitos.length < 12); if (digitos.length < 12) errores.push(wsp);
    return errores;
  };

  [select, dia, nombre, wsp].forEach(c => c.addEventListener('input', () => { if (c.closest('.field')?.classList.contains('has-error')) validar(); }));
  form.querySelectorAll('input[name="franja"]').forEach(r => r.addEventListener('change', () => marcar(form.querySelector('fieldset'), 'err-franja', false)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const errores = validar();
    if (errores.length) { errores[0].focus(); return; }
    const texto = enviar.textContent;
    enviar.disabled = true;
    enviar.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (mascara) mascara.value = '';
      enviar.disabled = false;
      enviar.textContent = texto;
    }, 800);
  });
}

function cartLineHTML(item, p) {
  return `<div class="cart-line" data-line="${esc(p.id)}">
    <div class="cart-line__img"><img src="images/${esc(p.img)}.webp" alt="" width="900" height="900"></div>
    <div>
      <p class="cart-line__name">${esc(p.nombre)}</p>
      <p class="cart-line__price">${formatearPrecio(precioFinal(p))} c/u</p>
      <div class="cart-line__ctrl">
        <div class="stepper" aria-label="Cantidad"><button type="button" data-cart-step="-1" data-id="${esc(p.id)}" aria-label="Restar uno">${ICON.minus}</button><output aria-live="polite">${item.qty}</output><button type="button" data-cart-step="1" data-id="${esc(p.id)}" aria-label="Sumar uno">${ICON.plus}</button></div>
        <button type="button" class="cart-remove" data-cart-remove="${esc(p.id)}" aria-label="Quitar ${esc(p.nombre)}">${ICON.trash}</button>
      </div>
    </div>
    <span class="cart-line__total">${formatearPrecio(precioFinal(p) * item.qty)}</span>
  </div>`;
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  const total = document.getElementById('cart-total');
  if (!body) return;
  const items = Cart.get().map(i => ({ item: i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">${ICON.cart}<h3>Tu carrito está vacío</h3><p>La línea Adara te espera: cosmética natural para seguir el cuidado en casa.</p><button type="button" class="btn btn-primary" data-cart-ir-tienda>Ver la tienda</button></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(({ item, p }) => cartLineHTML(item, p)).join('');
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function openCartDrawer(origen) {
  if (!cartDrawer) return;
  quickView?.close();
  tratModal?.close();
  renderCart();
  cartDrawer.open(origen);
}

function initCartDrawer() {
  const backdrop = document.getElementById('cart-backdrop');
  const panel = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('cart-close');
  if (!backdrop || !panel) return;
  cartDrawer = crearOverlay({ backdrop, panel, closeBtn });
  document.getElementById('cart-open')?.addEventListener('click', e => openCartDrawer(e.currentTarget));
  document.getElementById('cart-seguir')?.addEventListener('click', () => cartDrawer.close());
  document.getElementById('cart-checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); if (cartDrawer.abierto()) renderCart(); });
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
  cart?.addEventListener('click', e => openCartDrawer(e.currentTarget));
  sync();
}

function initAccionesGlobales() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.parentElement.querySelector('output');
      const actual = parseInt(out.textContent, 10) || 1;
      out.textContent = Math.max(1, Math.min(99, actual + Number(step.dataset.step)));
      return;
    }
    const cartStep = e.target.closest('[data-cart-step]');
    if (cartStep) {
      const it = Cart.get().find(i => i.id === cartStep.dataset.id);
      if (it) Cart.setQty(cartStep.dataset.id, it.qty + Number(cartStep.dataset.cartStep));
      return;
    }
    const remove = e.target.closest('[data-cart-remove]');
    if (remove) { Cart.remove(remove.dataset.cartRemove); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(add));
      showToast(`Agregado al carrito: ${p.nombre}`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, qtyDe(buy));
      openCartDrawer(buy);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { openQuickView(quick.dataset.quick, quick); return; }
    const trat = e.target.closest('[data-trat]');
    if (trat) { openTratModal(trat.dataset.trat, trat); return; }
    const res = e.target.closest('[data-reservar]');
    if (res) { reservar(res.dataset.reservar); return; }
    const irTienda = e.target.closest('[data-cart-ir-tienda]');
    if (irTienda) { cartDrawer?.close(); irA('#tienda'); }
  });
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.closest('.gw-modelos')) return;
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      irA(target);
    });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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
  const desde = (sel, vars, pos) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, pos);
  };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-search, .hero-cats', { y: 22, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.55);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-sellos li, .hero-tag', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  desde('.sello-turnos', { scale: 0.85, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--foto');
  const img = hero?.querySelector('[data-hero-img]');
  if (!hero || !img) return;
  gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function initLectura() {
  const el = document.querySelector('[data-lectura]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.w')];
  const prender = n => spans.forEach((s, i) => s.classList.toggle('on', i < n));
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { prender(spans.length); return; }
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    end: 'bottom 45%',
    scrub: true,
    onUpdate: self => prender(Math.round(self.progress * spans.length)),
  });
}

function initJsonLd() {
  const lista = PRODUCTOS.slice(0, PAGE).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: p.nombre,
      image: `https://gokywebs.com/demo/adara/images/${p.img}.webp`,
      description: p.desc,
      brand: { '@type': 'Brand', name: 'Adara' },
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' },
    },
  }));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Línea Adara', itemListElement: lista });
  document.head.appendChild(s);
}

function initDesdeUrl() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('producto');
  if (slug && getProducto(slug)) setTimeout(() => openQuickView(slug), 400);
  const cat = params.get('cat');
  if (cat && CATEGORIAS.some(c => c.id === cat)) filtrarPorCategoria(cat);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

initModelBarScroll();
initTratamientos();
initRail();
initCatalogo();
initTurnos();
initCartDrawer();
initQuickView();
initTratModal();
initReveals();
initNav();
initFloats();
initAccionesGlobales();
initHeroSearch();
initHeroMotion();
initParallax();
initLectura();
initAnchors();
initJsonLd();
initDesdeUrl();
