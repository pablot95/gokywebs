const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492236201406';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const CURSOS = [
  { id: 1, type: 'course', slug: 'molderia-base', titulo: 'Moldería base: falda, pantalón y blusa', categoria: 'Moldería', nivel: 'Inicial', modalidad: 'Grabado', precio: 68000, descuento: 0, duracion: '9 h', clases: 24, trazo: 'a', destacado: true, flag: 'Más elegido',
    corta: 'El punto de partida: las tres bases que después se transforman en casi cualquier prenda.',
    completa: 'Arrancás midiendo el cuerpo y terminás con tres moldes base trazados a tu medida. Cada trazado se hace en papel, paso a paso, con la regla apoyada y la cámara cenital: se ve exactamente dónde va cada punto y por qué. Las bases quedan listas para transformarlas en los cursos siguientes.',
    incluye: ['Las tres bases en tu talle y en talles 1 al 6', 'Tabla de medidas y planilla para tomarlas', 'PDF de cada base para imprimir en A4', 'Acceso sin vencimiento'],
    modulos: [
      { titulo: 'Medidas y herramientas', dur: '1 h 40', clases: [{ t: 'Qué regla, qué escuadra y qué papel', d: '14:20', tipo: 'video', preview: true }, { t: 'Tomar medidas sobre el cuerpo', d: '22:10', tipo: 'video' }, { t: 'Planilla de medidas', d: 'PDF', tipo: 'pdf' }] },
      { titulo: 'Base de falda', dur: '2 h 10', clases: [{ t: 'Trazado del rectángulo base', d: '18:40', tipo: 'video' }, { t: 'Pinzas y curva de cadera', d: '26:05', tipo: 'video' }, { t: 'Prueba en tela de prueba', d: '19:30', tipo: 'video' }] },
      { titulo: 'Base de pantalón', dur: '2 h 40', clases: [{ t: 'Tiro delantero y trasero', d: '31:15', tipo: 'video' }, { t: 'Ajuste del tiro sobre el cuerpo', d: '24:50', tipo: 'video' }, { t: 'Molde final y márgenes', d: '17:05', tipo: 'video' }] },
      { titulo: 'Base de blusa', dur: '2 h 30', clases: [{ t: 'Delantero, espalda y escote', d: '28:30', tipo: 'video' }, { t: 'Pinza de busto y su rotación', d: '25:40', tipo: 'video' }, { t: 'Manga base', d: '21:10', tipo: 'video' }] }
    ] },
  { id: 2, type: 'course', slug: 'molde-vestido', titulo: 'Trazado del molde base de vestido', categoria: 'Moldería', nivel: 'Intermedio', modalidad: 'Grabado', precio: 54000, descuento: 0, duracion: '6 h', clases: 16, trazo: 'c', destacado: true, flag: '',
    corta: 'De la base de blusa al vestido entero, con todas las variantes de largo y escote.',
    completa: 'Partimos de la base de blusa y bajamos el molde hasta convertirlo en vestido: unión de pinzas, línea de cintura, evasé y las variantes de escote más pedidas. Cada transformación queda registrada en una hoja aparte para que puedas repetirla sin volver al video.',
    incluye: ['Molde base de vestido en talles 1 al 6', 'Cuatro variantes de escote', 'Guía de largos y proporciones', 'Acceso sin vencimiento'],
    modulos: [
      { titulo: 'De la blusa al vestido', dur: '2 h', clases: [{ t: 'Unir el molde en la cintura', d: '24:10', tipo: 'video', preview: true }, { t: 'Rotación y cierre de pinzas', d: '27:30', tipo: 'video' }, { t: 'Largos y proporción', d: '16:20', tipo: 'video' }] },
      { titulo: 'Escotes y espaldas', dur: '2 h 10', clases: [{ t: 'Escote en V, redondo y cuadrado', d: '29:40', tipo: 'video' }, { t: 'Vistas y entretela', d: '22:05', tipo: 'video' }, { t: 'Espalda cruzada', d: '18:50', tipo: 'video' }] },
      { titulo: 'Faldas del vestido', dur: '1 h 50', clases: [{ t: 'Evasé y medio círculo', d: '26:30', tipo: 'video' }, { t: 'Tablas y frunces', d: '23:15', tipo: 'video' }, { t: 'Molde final', d: 'PDF', tipo: 'pdf' }] }
    ] },
  { id: 3, type: 'course', slug: 'transformaciones', titulo: 'Transformaciones: de la base a 12 modelos', categoria: 'Moldería', nivel: 'Intermedio', modalidad: 'En vivo', precio: 84000, descuento: 15, duracion: '12 semanas', clases: 12, trazo: 'd', destacado: true, flag: 'En vivo',
    corta: 'Doce encuentros en vivo, doce prendas distintas trazadas sobre la misma base.',
    completa: 'Un encuentro por semana, en vivo, donde se traza una prenda nueva a partir de la base que ya tenés. Se ve el molde en pantalla, se resuelven las dudas en el momento y queda la grabación. Entre encuentro y encuentro cosés la prenda y la traés a revisar.',
    incluye: ['12 encuentros en vivo con grabación', 'Moldes de las 12 transformaciones', 'Revisión de tu prenda en el encuentro', 'Acceso sin vencimiento a las grabaciones'],
    modulos: [
      { titulo: 'Bloque 1 · Superiores', dur: '4 encuentros', clases: [{ t: 'Camisa clásica', d: '90 min', tipo: 'vivo', preview: true }, { t: 'Blusa con frunce', d: '90 min', tipo: 'vivo' }, { t: 'Top con breteles', d: '90 min', tipo: 'vivo' }, { t: 'Remera y variantes', d: '90 min', tipo: 'vivo' }] },
      { titulo: 'Bloque 2 · Inferiores', dur: '4 encuentros', clases: [{ t: 'Pantalón recto', d: '90 min', tipo: 'vivo' }, { t: 'Pantalón wide leg', d: '90 min', tipo: 'vivo' }, { t: 'Falda con tablas', d: '90 min', tipo: 'vivo' }, { t: 'Short con pinzas', d: '90 min', tipo: 'vivo' }] },
      { titulo: 'Bloque 3 · Abrigo y vestidos', dur: '4 encuentros', clases: [{ t: 'Blazer entallado', d: '90 min', tipo: 'vivo' }, { t: 'Campera bomber', d: '90 min', tipo: 'vivo' }, { t: 'Vestido cruzado', d: '90 min', tipo: 'vivo' }, { t: 'Vestido camisero', d: '90 min', tipo: 'vivo' }] }
    ] },
  { id: 4, type: 'course', slug: 'costura-desde-cero', titulo: 'Costura a máquina desde cero', categoria: 'Costura', nivel: 'Inicial', modalidad: 'Grabado', precio: 62000, descuento: 0, duracion: '7 h', clases: 20, trazo: 'b', destacado: true, flag: 'Para empezar',
    corta: 'Enhebrar, coser derecho y armar tu primera prenda con una máquina familiar.',
    completa: 'Pensado para quien nunca cosió: qué hace cada perilla, cómo regular la tensión, cómo cortar sin mover la tela y cómo unir dos piezas para que la costura quede pareja. Se cose con máquina familiar, sin overlock, y termina con una prenda simple armada de punta a punta.',
    incluye: ['20 clases en video', 'Molde de la prenda final', 'Guía de puntadas y tensiones', 'Acceso sin vencimiento'],
    modulos: [
      { titulo: 'La máquina', dur: '1 h 30', clases: [{ t: 'Partes, perillas y enhebrado', d: '19:40', tipo: 'video', preview: true }, { t: 'Tensión y largo de puntada', d: '17:20', tipo: 'video' }, { t: 'Canilla y bobina', d: '12:10', tipo: 'video' }] },
      { titulo: 'Coser parejo', dur: '2 h 20', clases: [{ t: 'Recta, curva y esquina', d: '24:30', tipo: 'video' }, { t: 'Costuras de unión', d: '21:50', tipo: 'video' }, { t: 'Rematar sin fruncir', d: '18:40', tipo: 'video' }] },
      { titulo: 'Corte y armado', dur: '3 h 10', clases: [{ t: 'Apoyar el molde y cortar', d: '26:20', tipo: 'video' }, { t: 'Hilvanado y prueba', d: '22:40', tipo: 'video' }, { t: 'Tu primera prenda, entera', d: '38:15', tipo: 'video' }] }
    ] },
  { id: 5, type: 'course', slug: 'terminaciones', titulo: 'Terminaciones: cierres, vistas y puños', categoria: 'Costura', nivel: 'Avanzado', modalidad: 'Grabado', precio: 47000, descuento: 10, duracion: '5 h', clases: 14, trazo: 'a', destacado: false, flag: '',
    corta: 'Lo que separa una prenda hecha en casa de una prenda bien terminada.',
    completa: 'Cierre invisible que no se ve, vistas que no se dan vuelta, puños con abertura y dobladillos que quedan planos. Cada terminación se hace en tiempo real, con la cámara sobre el prensatelas, y se repite en cámara lenta.',
    incluye: ['14 clases en video', 'Muestrario de terminaciones', 'Moldes de vistas y puños', 'Acceso sin vencimiento'],
    modulos: [
      { titulo: 'Cierres', dur: '1 h 50', clases: [{ t: 'Cierre invisible', d: '26:40', tipo: 'video', preview: true }, { t: 'Cierre común centrado', d: '19:20', tipo: 'video' }, { t: 'Cierre en costado', d: '17:30', tipo: 'video' }] },
      { titulo: 'Vistas y escotes', dur: '1 h 40', clases: [{ t: 'Vista de escote con entretela', d: '24:10', tipo: 'video' }, { t: 'Vista de sisa', d: '18:50', tipo: 'video' }, { t: 'Bies en escote', d: '20:00', tipo: 'video' }] },
      { titulo: 'Puños y dobladillos', dur: '1 h 30', clases: [{ t: 'Puño con abertura', d: '28:20', tipo: 'video' }, { t: 'Dobladillo invisible', d: '16:40', tipo: 'video' }, { t: 'Dobladillo en curva', d: '14:50', tipo: 'video' }] }
    ] },
  { id: 6, type: 'course', slug: 'ajuste-sobre-el-cuerpo', titulo: 'Taller en vivo: ajuste sobre el cuerpo', categoria: 'Costura', nivel: 'Avanzado', modalidad: 'En vivo', precio: 96000, descuento: 0, duracion: '8 semanas', clases: 8, trazo: 'c', destacado: false, flag: 'En vivo',
    corta: 'Traés tu prenda hilvanada y la corregimos juntas, encuentro por encuentro.',
    completa: 'El taller donde se resuelve lo que ningún molde estándar resuelve: espalda ancha, busto grande, hombro caído, tiro corto. Cada semana traés tu prenda hilvanada, se marca sobre el cuerpo y se traslada la corrección al molde para que la próxima ya salga bien.',
    incluye: ['8 encuentros en vivo con grabación', 'Corrección de tu molde personal', 'Guía de ajustes más frecuentes', 'Acceso sin vencimiento a las grabaciones'],
    modulos: [
      { titulo: 'Arriba', dur: '3 encuentros', clases: [{ t: 'Hombro, sisa y escote', d: '90 min', tipo: 'vivo', preview: true }, { t: 'Busto y pinza', d: '90 min', tipo: 'vivo' }, { t: 'Espalda y omóplato', d: '90 min', tipo: 'vivo' }] },
      { titulo: 'Abajo', dur: '3 encuentros', clases: [{ t: 'Tiro y entrepierna', d: '90 min', tipo: 'vivo' }, { t: 'Cadera y muslo', d: '90 min', tipo: 'vivo' }, { t: 'Largo y caída', d: '90 min', tipo: 'vivo' }] },
      { titulo: 'Cierre', dur: '2 encuentros', clases: [{ t: 'Pasar la corrección al molde', d: '90 min', tipo: 'vivo' }, { t: 'Prenda final revisada', d: '90 min', tipo: 'vivo' }] }
    ] }
];

const MOLDES = [
  { id: 1, type: 'mold', slug: 'molde-camisa-clasica', titulo: 'Molde: camisa clásica con canesú', categoria: 'Prendas superiores', precio: 14500, descuento: 0, hojas: 34, trazo: 'a', destacado: false, flag: '',
    corta: 'Canesú, puños con abertura y cuello con pie. Talles 1 al 6 en el mismo archivo.',
    completa: 'La camisa de siempre, con canesú partido, puño con abertura y cuello con pie separado. El PDF trae las hojas numeradas, el cuadro de control de escala y las marcas de unión; se imprime en A4 al 100%, sin ajustar a la página.',
    incluye: ['PDF A4 con talles 1 al 6 superpuestos', 'Cuadro de control de escala', 'Guía de armado con el orden de costura', 'Rendimiento de tela por talle'] },
  { id: 2, type: 'mold', slug: 'molde-pantalon-recto', titulo: 'Molde: pantalón recto de tiro alto', categoria: 'Prendas inferiores', precio: 12900, descuento: 0, hojas: 28, trazo: 'b', destacado: true, flag: '',
    corta: 'Tiro alto, pinzas al frente y bolsillo lateral. Talles 1 al 6.',
    completa: 'Pantalón recto de tiro alto con dos pinzas al frente, bolsillo lateral curvo y cierre en costado. Pensado para gabardina y lino de cuerpo medio. Incluye las tres opciones de largo más usadas.',
    incluye: ['PDF A4 con talles 1 al 6', 'Tres largos: tobillo, 7/8 y largo', 'Guía de armado paso a paso', 'Rendimiento de tela por talle'] },
  { id: 3, type: 'mold', slug: 'molde-vestido-cruzado', titulo: 'Molde: vestido cruzado con lazo', categoria: 'Vestidos', precio: 16900, descuento: 0, hojas: 41, trazo: 'c', destacado: true, flag: 'Nuevo',
    corta: 'Escote cruzado, manga corta y falda evasé. Talles 1 al 6.',
    completa: 'El vestido cruzado que queda bien en casi todos los cuerpos: escote en V por cruce, lazo al costado y falda evasé. Va en telas con caída, tipo viscosa o crepe. Incluye la variante sin mangas.',
    incluye: ['PDF A4 con talles 1 al 6', 'Variante sin manga', 'Vistas y bies ya trazados', 'Guía de armado paso a paso'] },
  { id: 4, type: 'mold', slug: 'molde-blazer', titulo: 'Molde: blazer entallado forrado', categoria: 'Abrigo', precio: 21500, descuento: 0, hojas: 52, trazo: 'd', destacado: false, flag: '',
    corta: 'Solapa muesca, dos botones y forro completo. Talles 1 al 6.',
    completa: 'Blazer entallado con solapa muesca, dos botones, bolsillo de vivo y forro completo. Es el molde más largo de la serie: incluye el trazado del forro y el paso a paso de la solapa, que es donde se juega el resultado.',
    incluye: ['PDF A4 con talles 1 al 6', 'Molde del forro completo', 'Guía de solapa y entretelado', 'Rendimiento de tela y forro'] },
  { id: 5, type: 'mold', slug: 'molde-falda-tablas', titulo: 'Molde: falda midi con tablas', categoria: 'Prendas inferiores', precio: 9900, descuento: 0, hojas: 18, trazo: 'b', destacado: false, flag: '',
    corta: 'Tablas encontradas, cintura con pretina y cierre invisible. Talles 1 al 6.',
    completa: 'Falda midi con tablas encontradas, pretina recta y cierre invisible al costado. El molde trae el cálculo de tablas resuelto por talle, que es la parte que más cuesta cuando se traza de cero.',
    incluye: ['PDF A4 con talles 1 al 6', 'Cálculo de tablas por talle', 'Guía de planchado de tablas', 'Rendimiento de tela por talle'] },
  { id: 6, type: 'mold', slug: 'molde-remera-basica', titulo: 'Molde: remera básica y tres variantes', categoria: 'Prendas superiores', precio: 8900, descuento: 0, hojas: 16, trazo: 'a', destacado: true, flag: 'Para empezar',
    corta: 'Base de punto con manga corta, larga y musculosa. Talles 1 al 6.',
    completa: 'La base de remera en tejido de punto, con tres variantes de manga y dos escotes. Es el molde más simple de la serie y el mejor para probar el sistema de impresión antes de encarar uno grande.',
    incluye: ['PDF A4 con talles 1 al 6', 'Tres variantes de manga', 'Dos escotes: redondo y en V', 'Guía de costura en punto sin overlock'] },
  { id: 7, type: 'mold', slug: 'molde-bomber', titulo: 'Molde: campera bomber con puño', categoria: 'Abrigo', precio: 18900, descuento: 0, hojas: 44, trazo: 'd', destacado: false, flag: '',
    corta: 'Puño y cintura elastizados, cierre metálico y bolsillos ocultos. Talles 1 al 6.',
    completa: 'Bomber clásica con puño, cuello y cintura de rib, cierre metálico y bolsillos ocultos en la costura del costado. Va en gabardina liviana, nylon o neoprene fino. Incluye el molde de forro.',
    incluye: ['PDF A4 con talles 1 al 6', 'Molde del forro', 'Guía de colocación de rib y cierre', 'Rendimiento de tela por talle'] },
  { id: 8, type: 'mold', slug: 'kit-basicos', titulo: 'Kit: cinco moldes básicos', categoria: 'Kits', precio: 49900, descuento: 20, hojas: 120, trazo: 'd', destacado: true, flag: 'Kit',
    corta: 'Remera, pantalón recto, falda midi, camisa y vestido cruzado, juntos.',
    completa: 'Los cinco moldes con los que se arma un placard completo, en un solo archivo y a precio de conjunto. Mismo formato que los individuales: A4, talles 1 al 6 superpuestos y guía de armado por prenda.',
    incluye: ['Los cinco moldes en PDF A4', 'Talles 1 al 6 en cada uno', 'Cinco guías de armado', 'Orden sugerido para coserlos'] }
];

const ITEMS = CURSOS.concat(MOLDES);

const TALLES = [
  { n: 1, l: 'XS', busto: [80, 86], cintura: [60, 67], cadera: [86, 92] },
  { n: 2, l: 'S', busto: [87, 91], cintura: [68, 72], cadera: [93, 97] },
  { n: 3, l: 'M', busto: [92, 96], cintura: [73, 77], cadera: [98, 102] },
  { n: 4, l: 'L', busto: [97, 102], cintura: [78, 83], cadera: [103, 108] },
  { n: 5, l: 'XL', busto: [103, 108], cintura: [84, 89], cadera: [109, 114] },
  { n: 6, l: 'XXL', busto: [109, 116], cintura: [90, 97], cadera: [115, 122] }
];

const TRAZOS = {
  a: 'M60 42C86 30 114 30 140 42L152 120C150 160 146 196 142 214C114 224 86 224 58 214C54 196 50 160 48 120Z',
  b: 'M62 34H138L146 108L132 216H104L100 122L96 216H68L54 108Z',
  c: 'M66 38C88 28 112 28 134 38L142 96L160 216C120 226 80 226 40 216L58 96Z',
  d: 'M40 46L86 32C100 44 100 44 114 32L160 46L168 120L154 216H46L32 120Z'
};
const TONOS = ['', 'port--ink', 'port--mag', ''];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const keyDe = it => it.type + ':' + it.id;
const getItem = key => ITEMS.find(i => keyDe(i) === key);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function portada(item, idx) {
  const tono = TONOS[(idx + (item.type === 'mold' ? 2 : 0)) % TONOS.length];
  const n = String(item.id).padStart(2, '0');
  return `<span class="port ${tono}">
    <svg viewBox="0 0 200 250" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path class="port__trazo" d="${TRAZOS[item.trazo] || TRAZOS.a}"/>
      <path class="port__guia" d="M100 32V218"/>
      <path class="port__trazo" d="M86 34v11M114 34v11"/>
      <circle class="port__trazo" cx="100" cy="72" r="3.4"/>
    </svg>
    <span class="port__n">${n}</span>
  </span>`;
}

const Cart = {
  KEY: 'molderiacostura_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(item) {
    const items = this.get();
    const key = keyDe(item);
    if (items.some(i => i.key === key)) return false;
    items.push({ key, type: item.type, id: item.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(key) { this.save(this.get().filter(i => i.key !== key)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  limpiar() {
    const items = this.get();
    const ok = items.filter(i => getItem(i.key));
    if (ok.length !== items.length) this.save(ok);
  },
  total() { return this.get().reduce((s, i) => { const p = getItem(i.key); return p ? s + precioFinal(p) : s; }, 0); }
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

function precioHTML(item) {
  const fin = precioFinal(item);
  if (item.descuento > 0) return `<p class="item-price"><span class="off">${formatearPrecio(fin)}</span><s>${formatearPrecio(item.precio)}</s></p>`;
  return `<p class="item-price">${formatearPrecio(fin)}</p>`;
}

function metaDe(item) {
  return item.type === 'course'
    ? `${item.categoria} · ${item.nivel} · ${item.modalidad}`
    : `${item.categoria} · PDF A4`;
}
function subDe(item) {
  return item.type === 'course'
    ? `${item.clases} clases · ${item.duracion}`
    : `${item.hojas} hojas A4 · talles 1 al 6`;
}

function cardHTML(item, idx) {
  const key = keyDe(item);
  const badge = item.type === 'course'
    ? `<span class="item-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m10 8 6 4-6 4z" fill="currentColor" stroke="none"/><rect x="3" y="4" width="18" height="16" rx="2"/></svg>Curso</span>`
    : `<span class="item-badge item-badge--mold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 3h12v6H6zM6 15h12v6H6z"/><path d="M4 9h16v6H4z"/></svg>Molde</span>`;
  const flag = item.flag ? `<span class="item-flag">${esc(item.flag)}</span>` : '';
  return `<article class="item" data-animate style="opacity:0;transform:translateY(22px)" data-key="${key}" data-tipo="${item.type}">
    <button type="button" class="item-cover" data-open="${key}" aria-label="Ver ${esc(item.titulo)}">${portada(item, idx)}${badge}${flag}</button>
    <div class="item-body">
      <p class="item-meta">${esc(metaDe(item))}</p>
      <h3 class="item-t"><button type="button" data-open="${key}">${esc(item.titulo)}</button></h3>
      <p class="item-sub">${esc(subDe(item))}</p>
      <div class="item-foot">
        ${precioHTML(item)}
        <div class="item-acts">
          <button type="button" class="item-ver" data-open="${key}">Ver</button>
          <button type="button" class="item-add" data-add="${key}">Agregar</button>
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------- Destacados ---------- */
function initDestacados() {
  const cont = document.querySelector('.dest-grid');
  if (!cont) return;
  const sel = CURSOS.filter(c => c.destacado).slice(0, 4);
  cont.innerHTML = sel.map((c, i) => cardHTML(c, i)).join('');
}

/* ---------- Programa de la formación principal (Modelo 2) ---------- */
function initTemario() {
  const prog = document.getElementById('temario-prog');
  const buy = document.getElementById('temario-buy');
  if (!prog) return;
  const c = CURSOS[0];
  prog.innerHTML = `<h3 class="temario-prog__t">Programa · ${c.clases} clases · ${c.duracion}</h3>` + c.modulos.map((m, i) => `
    <details${i === 0 ? ' open' : ''}>
      <summary>${esc(m.titulo)}<span>${esc(m.dur)}</span></summary>
      <ul>${m.clases.map(cl => `<li>${iconoTipo(cl.tipo)}<span>${esc(cl.t)}</span><span class="linea__m">${esc(cl.d)}</span>${cl.preview ? '<span class="modal-prev">Muestra</span>' : ''}</li>`).join('')}</ul>
    </details>`).join('');
  if (buy) {
    buy.innerHTML = `${precioHTML(c)}
      <div class="temario-buy__acts">
        <button type="button" class="btn btn--solid" data-add="${keyDe(c)}">Inscribirme</button>
        <button type="button" class="btn btn--line" data-open="${keyDe(c)}">Ver el detalle</button>
      </div>
      <p class="temario-buy__n">${c.incluye.map(esc).join(' · ')}</p>`;
  }
}

/* ---------- Catálogo ---------- */
const FILTROS = { tab: 'todo', q: '', categoria: [], nivel: [], modalidad: [], precio: [] };
const PASO = 12;
let visibles = PASO;

const RANGOS = [
  { id: 'r1', label: 'Hasta $15.000', test: p => p <= 15000 },
  { id: 'r2', label: '$15.000 a $50.000', test: p => p > 15000 && p <= 50000 },
  { id: 'r3', label: 'Más de $50.000', test: p => p > 50000 }
];

function chipsDe(id, valores, grupo) {
  const cont = document.getElementById(id);
  if (!cont) return;
  cont.innerHTML = valores.map(v => `<button type="button" class="f-chip" aria-pressed="false" data-grupo="${grupo}" data-val="${esc(v.val)}">${esc(v.label)}</button>`).join('');
}

function initFiltros() {
  const cats = [...new Set(ITEMS.map(i => i.categoria))];
  chipsDe('f-categoria', cats.map(c => ({ val: c, label: c })), 'categoria');
  chipsDe('f-nivel', [...new Set(CURSOS.map(c => c.nivel))].map(v => ({ val: v, label: v })), 'nivel');
  chipsDe('f-modalidad', [...new Set(CURSOS.map(c => c.modalidad))].map(v => ({ val: v, label: v })), 'modalidad');
  chipsDe('f-precio', RANGOS.map(r => ({ val: r.id, label: r.label })), 'precio');

  document.querySelectorAll('.f-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const g = chip.dataset.grupo, v = chip.dataset.val;
      const on = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (on) FILTROS[g] = FILTROS[g].filter(x => x !== v);
      else FILTROS[g].push(v);
      visibles = PASO;
      pintarCatalogo();
    });
  });

  document.getElementById('f-clear')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacio-reset')?.addEventListener('click', () => { limpiarFiltros(); const q = document.getElementById('q'); if (q) q.value = ''; FILTROS.q = ''; pintarCatalogo(); });
}

function limpiarFiltros() {
  ['categoria', 'nivel', 'modalidad', 'precio'].forEach(g => { FILTROS[g] = []; });
  document.querySelectorAll('.f-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  visibles = PASO;
  pintarCatalogo();
}

function sincronizarGrupos() {
  document.querySelectorAll('.f-group[data-only]').forEach(g => {
    const ok = FILTROS.tab === 'todo' || FILTROS.tab === g.dataset.only;
    g.hidden = !ok;
    if (!ok) {
      const grupo = g.dataset.group;
      if (FILTROS[grupo]?.length) {
        FILTROS[grupo] = [];
        g.querySelectorAll('.f-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      }
    }
  });
  const catsTab = FILTROS.tab === 'curso' ? CURSOS : FILTROS.tab === 'mold' ? MOLDES : ITEMS;
  const validas = new Set(catsTab.map(i => i.categoria));
  document.querySelectorAll('#f-categoria .f-chip').forEach(c => {
    const ok = validas.has(c.dataset.val);
    c.hidden = !ok;
    if (!ok && c.getAttribute('aria-pressed') === 'true') {
      c.setAttribute('aria-pressed', 'false');
      FILTROS.categoria = FILTROS.categoria.filter(x => x !== c.dataset.val);
    }
  });
}

function filtrar() {
  const q = normal(FILTROS.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  return ITEMS.filter(item => {
    if (FILTROS.tab === 'curso' && item.type !== 'course') return false;
    if (FILTROS.tab === 'mold' && item.type !== 'mold') return false;
    if (FILTROS.categoria.length && !FILTROS.categoria.includes(item.categoria)) return false;
    if (FILTROS.nivel.length && !(item.type === 'course' && FILTROS.nivel.includes(item.nivel))) return false;
    if (FILTROS.modalidad.length && !(item.type === 'course' && FILTROS.modalidad.includes(item.modalidad))) return false;
    if (FILTROS.precio.length) {
      const p = precioFinal(item);
      if (!FILTROS.precio.some(id => RANGOS.find(r => r.id === id)?.test(p))) return false;
    }
    if (palabras.length) {
      const blob = normal([item.titulo, item.categoria, item.nivel, item.modalidad, item.corta, item.type === 'mold' ? 'molde imprimible pdf' : 'curso clases video'].join(' '));
      if (!palabras.every(w => blob.includes(w))) return false;
    }
    return true;
  });
}

function pintarCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  sincronizarGrupos();
  const res = filtrar();
  const mostrar = res.slice(0, visibles);
  grid.innerHTML = mostrar.map((it, i) => cardHTML(it, i)).join('');
  const vacio = document.getElementById('cat-vacio');
  if (vacio) vacio.hidden = res.length > 0;
  grid.hidden = res.length === 0;
  const mas = document.getElementById('ver-mas');
  if (mas) mas.hidden = res.length <= visibles;
  const cnt = document.getElementById('cat-count');
  if (cnt) {
    const cursos = res.filter(r => r.type === 'course').length;
    const moldes = res.length - cursos;
    const partes = [];
    if (cursos) partes.push(`${cursos} curso${cursos === 1 ? '' : 's'}`);
    if (moldes) partes.push(`${moldes} molde${moldes === 1 ? '' : 's'}`);
    cnt.innerHTML = `<b>${res.length}</b> resultado${res.length === 1 ? '' : 's'}${partes.length ? ' · ' + partes.join(' y ') : ''}`;
  }
  revelarNuevos(grid);
}

function initCatalogo() {
  initFiltros();
  pintarCatalogo();
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      FILTROS.tab = tab.dataset.tab;
      document.getElementById('catalogo-grid')?.setAttribute('aria-labelledby', tab.id);
      visibles = PASO;
      pintarCatalogo();
    });
  });
  const q = document.getElementById('q');
  let t;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { FILTROS.q = q.value; visibles = PASO; pintarCatalogo(); }, 180);
  });
  document.getElementById('ver-mas')?.addEventListener('click', () => { visibles += PASO; pintarCatalogo(); });
}

function irATab(tab) {
  const btn = document.querySelector(`.tab[data-tab="${tab}"]`);
  if (btn) btn.click();
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initFiltrosMobile() {
  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtros');
  const close = document.getElementById('filtrosClose');
  if (!toggle || !panel) return;
  let bd = document.querySelector('.drawer-backdrop');
  const cerrar = () => {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (bd && !document.getElementById('drawer')?.classList.contains('open')) { bd.classList.remove('open'); bd.hidden = true; }
    toggle.focus();
  };
  toggle.addEventListener('click', () => {
    if (panel.classList.contains('open')) { cerrar(); return; }
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    if (bd) { bd.hidden = false; requestAnimationFrame(() => bd.classList.add('open')); }
  });
  close?.addEventListener('click', cerrar);
  bd?.addEventListener('click', () => { if (panel.classList.contains('open')) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });
}

/* ---------- Componente: encontrá tu talle ---------- */
function talleDe(valor, campo) {
  if (!valor) return null;
  for (const t of TALLES) if (valor <= t[campo][1]) return t;
  return TALLES[TALLES.length - 1];
}

let talleElegido = null;

function initTalle() {
  const form = document.getElementById('talle-form');
  if (!form) return;
  const res = document.getElementById('talle-res');
  const err = document.getElementById('talle-err');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const busto = parseInt(document.getElementById('t-busto').value, 10) || 0;
    const cintura = parseInt(document.getElementById('t-cintura').value, 10) || 0;
    const cadera = parseInt(document.getElementById('t-cadera').value, 10) || 0;
    const dados = [['busto', busto], ['cintura', cintura], ['cadera', cadera]].filter(d => d[1] > 0);
    if (dados.length < 2) { err.hidden = false; res.hidden = true; return; }
    err.hidden = true;

    const encontrados = dados.map(([campo, v]) => ({ campo, t: talleDe(v, campo) })).filter(x => x.t);
    const mayor = encontrados.reduce((a, b) => (b.t.n > a.t.n ? b : a));
    const menor = encontrados.reduce((a, b) => (b.t.n < a.t.n ? b : a));
    talleElegido = mayor.t;

    document.getElementById('talle-num').textContent = mayor.t.n;
    document.getElementById('talle-letra').textContent = mayor.t.l;
    const msg = mayor.t.n === menor.t.n
      ? `Tus medidas caen todas en el talle ${mayor.t.n}: trazá ese y no vas a necesitar ajustes de base.`
      : `Tu ${mayor.campo} pide talle ${mayor.t.n} y tu ${menor.campo} talle ${menor.t.n}. Trazá el ${mayor.t.n} y achicá en ${menor.campo === 'cintura' ? 'la cintura' : 'el ' + menor.campo} al cortar: siempre es más fácil sacar que agregar.`;
    document.getElementById('talle-msg').textContent = msg;
    document.getElementById('talle-tabla').textContent =
      `Talle ${mayor.t.n} (${mayor.t.l}) · busto ${mayor.t.busto[0]}-${mayor.t.busto[1]} · cintura ${mayor.t.cintura[0]}-${mayor.t.cintura[1]} · cadera ${mayor.t.cadera[0]}-${mayor.t.cadera[1]} cm. Tabla orientativa: medí sobre el cuerpo, sin ropa gruesa.`;
    res.hidden = false;
    if (!reduceMotion) res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('talle-ver')?.addEventListener('click', () => {
    irATab('mold');
    showToast(talleElegido ? `Moldería a la vista: todos incluyen tu talle ${talleElegido.n}.` : 'Moldería a la vista.');
  });
  document.getElementById('talle-wsp')?.addEventListener('click', () => {
    const t = talleElegido ? `talle ${talleElegido.n} (${talleElegido.l})` : 'mi talle';
    const txt = `Hola! Calculé mi talle en la web y me dio ${t}. Quiero consultar por la moldería.`;
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
  });
}

/* ---------- Próximo encuentro en vivo ---------- */
function initVivo() {
  const els = document.querySelectorAll('[data-proxima-clase]');
  if (!els.length) return;
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const ahora = new Date();
  const d = new Date(ahora);
  d.setHours(19, 0, 0, 0);
  let delta = (2 - d.getDay() + 7) % 7;
  if (delta === 0 && ahora.getHours() >= 20) delta = 7;
  d.setDate(d.getDate() + delta);
  const dif = Math.ceil((d - ahora) / 86400000);
  const cuando = dif <= 0 ? 'hoy' : dif === 1 ? 'mañana' : `en ${dif} días`;
  const txt = `${dias[d.getDay()]} ${d.getDate()} · 19 h — ${cuando}`;
  els.forEach(el => { el.textContent = txt.charAt(0).toUpperCase() + txt.slice(1); });
}

/* ---------- Drawer ---------- */
let ultimoFoco = null;

function lineaHTML(i, item, idx) {
  return `<div class="linea">
    <span class="linea__p">${portada(item, idx)}</span>
    <div>
      <p class="linea__t">${esc(item.titulo)}</p>
      <p class="linea__m">${esc(item.type === 'course' ? item.modalidad + ' · ' + item.clases + ' clases' : item.hojas + ' hojas A4')}</p>
      <button type="button" class="linea__x" data-quitar="${i.key}">Quitar</button>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(item))}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  Cart.limpiar();
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio"><p>Todavía no elegiste ningún curso ni molde.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver el catálogo</button></div>`;
    if (foot) foot.hidden = true;
    const tot = document.getElementById('drawer-total');
    if (tot) tot.textContent = formatearPrecio(0);
    return;
  }
  const cursos = items.filter(i => i.type === 'course');
  const moldes = items.filter(i => i.type === 'mold');
  let html = '';
  if (cursos.length) html += `<div class="drawer-grupo"><h3>Acceso a las clases</h3>${cursos.map((i, n) => lineaHTML(i, getItem(i.key), n)).join('')}</div>`;
  if (moldes.length) html += `<div class="drawer-grupo"><h3>Moldes para imprimir</h3>${moldes.map((i, n) => lineaHTML(i, getItem(i.key), n + 2)).join('')}</div>`;
  body.innerHTML = html;
  if (foot) {
    foot.hidden = false;
    document.getElementById('drawer-total').textContent = formatearPrecio(Cart.total());
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  ultimoFoco = document.activeElement;
  pintarDrawer();
  bd.hidden = false; dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}
function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  dr.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => { if (dr.classList.contains('open')) cerrarDrawer(); });
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); pintarDrawer(); showToast('Lo sacamos de tu inscripción.'); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); irATab('todo'); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dr.classList.contains('open')) cerrarDrawer();
    if (e.key === 'Tab' && dr.classList.contains('open')) trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (dr.classList.contains('open')) pintarDrawer(); });
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- Modal ---------- */
function modalHTML(item) {
  const key = keyDe(item);
  const datos = item.type === 'course'
    ? [item.nivel, item.modalidad, `${item.clases} clases`, item.duracion, 'Acceso sin vencimiento']
    : ['PDF A4', `${item.hojas} hojas`, 'Talles 1 al 6', 'Descarga inmediata'];
  const prog = item.type === 'course' ? `<div class="modal-prog"><h3>Programa</h3>${item.modulos.map((m, i) => `
    <details${i === 0 ? ' open' : ''}>
      <summary>${esc(m.titulo)}<span>${esc(m.dur)}</span></summary>
      <ul>${m.clases.map(c => `<li>${iconoTipo(c.tipo)}<span>${esc(c.t)}</span><span class="linea__m">${esc(c.d)}</span>${c.preview ? '<span class="modal-prev">Muestra</span>' : ''}</li>`).join('')}</ul>
    </details>`).join('')}</div>` : '';
  return `<div class="modal-media">${portada(item, item.type === 'mold' ? 2 : 0)}</div>
  <div class="modal-info">
    <p class="modal-meta">${esc(metaDe(item))}</p>
    <h2 class="modal-t">${esc(item.titulo)}</h2>
    <p class="modal-desc">${esc(item.completa)}</p>
    <div class="modal-datos">${datos.map(d => `<span>${esc(d)}</span>`).join('')}</div>
    <ul class="modal-inc">${item.incluye.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    ${prog}
    <div class="modal-buy">${precioHTML(item)}<button type="button" class="btn btn--solid" data-add="${key}">${item.type === 'course' ? 'Inscribirme' : 'Agregar el molde'}</button></div>
  </div>`;
}

function iconoTipo(tipo) {
  const p = tipo === 'pdf'
    ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
    : tipo === 'vivo'
      ? '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'
      : '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${p}</svg>`;
}

function abrirModal(key) {
  const item = getItem(key);
  const modal = document.getElementById('modal');
  if (!item || !modal) return;
  ultimoFoco = document.activeElement;
  document.getElementById('modal-content').innerHTML = modalHTML(item);
  modal.setAttribute('aria-label', item.titulo);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
}
function cerrarModal() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}
function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target.closest('[data-close-modal]')) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) trap(e, modal);
  });
}

/* ---------- Acciones globales ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { abrirModal(open.dataset.open); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const item = getItem(add.dataset.add);
      if (!item) return;
      const ok = Cart.add(item);
      showToast(ok
        ? (item.type === 'course' ? 'Curso agregado a tu inscripción.' : 'Molde agregado a tu inscripción.')
        : 'Ya lo tenías en la lista.');
      return;
    }
    const jump = e.target.closest('[data-tab-jump]');
    if (jump) { e.preventDefault(); irATab(jump.dataset.tabJump); }
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- Reveals ---------- */
let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.48)}s`;
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
  let intentos = 0;
  const reloj = setInterval(() => { sweep(); if (++intentos >= 12) clearInterval(reloj); }, 500);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
  });
  setTimeout(() => nuevos.forEach(el => el.classList.add('in')), 40);
}

/* ---------- Nav ---------- */
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

/* ---------- Floats ---------- */
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

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  Cart.limpiar();
  initDestacados();
  initTemario();
  initCatalogo();
  initReveals();
  initTalle();
  initVivo();
  initNav();
  initDrawer();
  initModal();
  initFiltrosMobile();
  initAcciones();
  initFloats();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
});
