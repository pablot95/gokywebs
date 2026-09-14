const WHATSAPP_NUMBER = '5493765343355';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'arteenpapel_cart',
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

const CATEGORIAS = [
  { id: 'cumple', nombre: 'Accesorios para cumpleaños', img: 'p-mesa-dulce', alt: 'Mesa dulce de cumpleaños con torta, cupcakes y globos' },
  { id: 'agendas', nombre: 'Agendas y planners', img: 'p-agenda-gatitos', alt: 'Dos hojas de agenda semanal impresas con espiral' },
  { id: 'calendarios', nombre: 'Calendarios', img: 'p-planner-mensual', alt: 'Planner mensual impreso con lápices de colores' },
  { id: 'stickers', nombre: 'Stickers', img: 'p-stickers-flores', alt: 'Hoja de stickers de flores de colores' },
  { id: 'anotadores', nombre: 'Anotadores', img: 'p-anotador-notas', alt: 'Anotador con renglones sobre fondo verde' },
  { id: 'cajitas', nombre: 'Cajitas', img: 'p-cajitas-par', alt: 'Dos cajitas impresas con forma de camioneta' },
  { id: 'encendedores', nombre: 'Envoltorios de encendedores', img: 'p-encendedor', alt: 'Encendedor naranja sobre fondo verde' },
];

const USOS = { organizar: 'Organizar', festejar: 'Festejar', regalar: 'Regalar' };
const PAPELES = { comun: 'Papel común', autoadhesivo: 'Papel autoadhesivo', cartulina: 'Cartulina de 180 a 250 g' };
const CONTEXTOS = {
  organizar: { img: 'mundo-organizar-960', alt: 'Planners y anotadores impresos sobre un escritorio' },
  festejar: { img: 'mundo-festejar-960', alt: 'Mesa de cumpleaños decorada con globos y cupcakes' },
  regalar: { img: 'recortar', alt: 'Hoja impresa recortada a mano con tijera' },
};

const PRODUCTOS = [
  { id: 'p01', slug: 'agenda-semanal-arcoiris', nombre: 'Agenda semanal Arcoíris', cat: 'agendas', precio: 6900, descuento: 0, img: 'p-agenda-arcoiris', alt: 'Hoja semanal de agenda impresa, de lunes a domingo, con un arcoíris en el borde', uso: 'organizar', papel: 'comun', hojas: 54, nuevo: true, destacado: true, desc: 'Semanas de lunes a domingo con un casillero para lo importante y arcoíris en los bordes. No tiene fechas: arrancás cuando quieras.', incluye: ['Portada para imprimir', '52 hojas semanales sin fecha', 'Hoja de notas y contactos'], tags: ['planner', 'semanal', 'arcoiris', 'sin fecha', 'organizacion'] },
  { id: 'p02', slug: 'stickers-de-festejo', nombre: 'Stickers de festejo', cat: 'stickers', precio: 2600, descuento: 0, img: 'p-stickers-festejo', alt: 'Hoja de stickers con globos, banderines, regalos y un cartel de feliz cumpleaños', uso: 'festejar', papel: 'autoadhesivo', hojas: 2, nuevo: false, destacado: true, desc: 'Globos, banderines, regalos y gorritos para decorar invitaciones, bolsitas y la agenda del mes del cumple.', incluye: ['2 hojas A4 de stickers', 'Versión para recortar a mano'], tags: ['cumple', 'globos', 'banderines', 'regalos', 'fiesta'] },
  { id: 'p03', slug: 'cajita-camper', nombre: 'Cajita camper', cat: 'cajitas', precio: 3400, descuento: 0, img: 'p-cajita-camper', alt: 'Cajita impresa con forma de camioneta turquesa y gorrito de cono', uso: 'festejar', papel: 'cartulina', hojas: 2, nuevo: true, destacado: true, desc: 'Una camioneta con ventanitas y gorrito de cono para los souvenirs del cumple. Se recorta, se pliega y se pega.', incluye: ['Molde de la cajita', 'Gorrito de cono', 'Instructivo de armado'], tags: ['souvenir', 'camioneta', 'auto', 'viaje', 'cumple infantil'] },
  { id: 'p04', slug: 'planner-mensual', nombre: 'Planner mensual para completar', cat: 'calendarios', precio: 3200, descuento: 0, img: 'p-planner-mensual', alt: 'Hoja de planner mensual impresa con una lapicera y lápices de colores', uso: 'organizar', papel: 'comun', hojas: 12, nuevo: false, destacado: true, desc: 'Una grilla por mes con lugar para escribir el nombre del mes y anotar turnos, pagos y cumpleaños.', incluye: ['12 hojas mensuales sin fecha', 'Grilla de lunes a domingo'], tags: ['calendario', 'mensual', 'mes', 'turnos', 'cumpleaños'] },
  { id: 'p05', slug: 'toppers-de-cactus', nombre: 'Toppers de cactus', cat: 'cumple', precio: 2900, descuento: 15, img: 'p-toppers-cactus', alt: 'Cupcakes con toppers impresos de cactus sobre fondo amarillo', uso: 'festejar', papel: 'cartulina', hojas: 1, nuevo: false, destacado: true, desc: 'Cactus con flores rosadas para pinchar en cupcakes o en la torta. Con cartulina y un palito de brochette quedan firmes.', incluye: ['12 toppers en 3 modelos', 'Guía de corte'], tags: ['topper', 'cupcakes', 'torta', 'mexicano', 'cactus'] },
  { id: 'p06', slug: 'anotador-de-notas', nombre: 'Anotador de notas', cat: 'anotadores', precio: 2200, descuento: 0, img: 'p-anotador-notas', alt: 'Anotador impreso con renglones naranjas y título Notes sobre fondo verde', uso: 'organizar', papel: 'comun', hojas: 1, nuevo: false, destacado: true, desc: 'Hoja angosta con renglones para la lista del súper, los pendientes o el costado del escritorio.', incluye: ['2 anotadores por hoja A4', 'Versión con y sin título'], tags: ['notas', 'lista', 'pendientes', 'renglones', 'notes'] },
  { id: 'p07', slug: 'stickers-de-flores', nombre: 'Stickers de flores', cat: 'stickers', precio: 2400, descuento: 0, img: 'p-stickers-flores', alt: 'Hoja de stickers de flores rosas, amarillas y violetas', uso: 'regalar', papel: 'autoadhesivo', hojas: 1, nuevo: false, destacado: false, desc: 'Margaritas y florcitas en colores de caramelo para agendas, sobres, frascos y tarjetas.', incluye: ['1 hoja A4 de stickers', 'Flores en 3 tamaños'], tags: ['flores', 'margaritas', 'primavera', 'regalo', 'decoracion'] },
  { id: 'p08', slug: 'kit-mesa-dulce', nombre: 'Kit mesa dulce', cat: 'cumple', precio: 8900, descuento: 10, img: 'p-mesa-dulce', alt: 'Mesa dulce de cumpleaños con torta decorada, cupcakes y globos de colores', uso: 'festejar', papel: 'cartulina', hojas: 14, nuevo: false, destacado: true, desc: 'Todo lo impreso para la mesa del cumple en una misma paleta: cartel, banderín, etiquetas para golosinas y toppers.', incluye: ['Cartel de bienvenida', 'Banderín con letras', 'Etiquetas para golosinas', 'Toppers para cupcakes'], tags: ['candy bar', 'mesa dulce', 'cumple', 'globos', 'centro de mesa'] },
  { id: 'p09', slug: 'agenda-semanal-gatitos', nombre: 'Agenda semanal Gatitos', cat: 'agendas', precio: 6900, descuento: 0, img: 'p-agenda-gatitos', alt: 'Dos hojas de agenda semanal impresas con espiral y confeti', uso: 'organizar', papel: 'comun', hojas: 54, nuevo: false, destacado: false, desc: 'Semanas sin fecha con gatitos asomando en los bordes y un espacio para lo importante de cada semana.', incluye: ['Portada para imprimir', '52 hojas semanales sin fecha', 'Hoja de cumpleaños del año'], tags: ['planner', 'gatos', 'semanal', 'sin fecha', 'organizacion'] },
  { id: 'p10', slug: 'envoltorios-para-encendedor', nombre: 'Envoltorios para encendedor', cat: 'encendedores', precio: 1900, descuento: 0, img: 'p-encendedor', alt: 'Encendedor naranja sobre fondo verde', uso: 'regalar', papel: 'autoadhesivo', hojas: 1, nuevo: false, destacado: true, desc: 'Diseños para forrar encendedores estándar: se imprimen en papel autoadhesivo, se recortan y se pegan en un minuto.', incluye: ['8 envoltorios por hoja A4', 'Guía de medidas para encendedor estándar'], tags: ['encendedor', 'forro', 'souvenir', 'regalo', 'sticker'] },
  { id: 'p11', slug: 'anotador-rayado-hojitas', nombre: 'Anotador rayado con hojitas', cat: 'anotadores', precio: 2400, descuento: 0, img: 'p-anotador-rayado', alt: 'Anotador rayado con espiral y stickers de hojitas de acuarela', uso: 'organizar', papel: 'comun', hojas: 2, nuevo: false, destacado: false, desc: 'Renglones finos y hojitas de acuarela en el borde, para anillar a un costado o guardar en carpeta.', incluye: ['Hoja rayada A4', 'Hoja rayada A5 para anillar'], tags: ['rayado', 'renglones', 'hojas', 'acuarela', 'cuaderno'] },
  { id: 'p12', slug: 'stickers-de-amor', nombre: 'Stickers de amor', cat: 'stickers', precio: 2600, descuento: 0, img: 'p-stickers-corazones', alt: 'Hoja de stickers con corazones, labios, galera y moño', uso: 'regalar', papel: 'autoadhesivo', hojas: 1, nuevo: false, destacado: false, desc: 'Corazones, labios, galera y moño para cartas, regalos y álbumes de a dos.', incluye: ['1 hoja A4 de stickers', 'Versión para recortar a mano'], tags: ['amor', 'corazones', 'san valentin', 'aniversario', 'regalo'] },
  { id: 'p13', slug: 'calendario-mensual-hojitas', nombre: 'Calendario mensual con hojitas', cat: 'calendarios', precio: 4600, descuento: 0, img: 'p-calendario-hojas', alt: 'Calendario mensual impreso con stickers de hojitas encima', uso: 'organizar', papel: 'comun', hojas: 13, nuevo: true, destacado: false, desc: 'Grilla mensual para completar que viene con una hoja de stickers de hojitas para marcar fechas especiales.', incluye: ['12 hojas mensuales', '1 hoja de stickers de hojitas'], tags: ['calendario', 'mensual', 'hojas', 'stickers', 'fechas'] },
  { id: 'p14', slug: 'topper-cactus-grande', nombre: 'Topper cactus grande', cat: 'cumple', precio: 2200, descuento: 0, img: 'p-topper-cactus', alt: 'Topper impreso de cactus con flores rosadas', uso: 'festejar', papel: 'cartulina', hojas: 1, nuevo: false, destacado: false, desc: 'Un cactus grande con flores rosadas para coronar la torta. Pensado para pinchar en el centro.', incluye: ['2 toppers grandes', 'Guía de corte'], tags: ['topper', 'torta', 'cactus', 'centro', 'cumple'] },
  { id: 'p15', slug: 'anotador-del-dia', nombre: 'Anotador del día', cat: 'anotadores', precio: 2000, descuento: 0, img: 'p-anotador-dia', alt: 'Hoja de anotador diario con columnas y título Today', uso: 'organizar', papel: 'comun', hojas: 1, nuevo: false, destacado: false, desc: 'Una hoja por día con columnas finas para ordenar las tareas de la mañana a la noche.', incluye: ['1 hoja A4', 'Versión con y sin título'], tags: ['diario', 'hoy', 'tareas', 'today', 'pendientes'] },
  { id: 'p16', slug: 'stickers-de-viaje', nombre: 'Stickers de viaje', cat: 'stickers', precio: 2400, descuento: 0, img: 'p-stickers-viajes', alt: 'Stickers de viaje con brújula, cámara, avión, anteojos y valija', uso: 'organizar', papel: 'autoadhesivo', hojas: 1, nuevo: false, destacado: false, desc: 'Brújula, cámara, avión y valija para bitácoras, álbumes de fotos y la agenda de las vacaciones.', incluye: ['1 hoja A4 de stickers', 'Versión para recortar a mano'], tags: ['viaje', 'vacaciones', 'bitacora', 'avion', 'camara'] },
  { id: 'p17', slug: 'kit-souvenirs-camper', nombre: 'Kit souvenirs camper', cat: 'cajitas', precio: 5200, descuento: 0, img: 'p-cajitas-par', alt: 'Dos cajitas impresas con forma de camioneta y gorritos de cono', uso: 'festejar', papel: 'cartulina', hojas: 4, nuevo: false, destacado: false, desc: 'La cajita camper con su gorrito de cono y una etiqueta para escribir el nombre de cada invitado.', incluye: ['Molde de la cajita camper', 'Gorrito de cono', 'Etiquetas para nombres', 'Instructivo de armado'], tags: ['souvenir', 'kit', 'camioneta', 'nombre', 'cumple infantil'] },
  { id: 'p18', slug: 'anotador-semanal', nombre: 'Anotador semanal', cat: 'anotadores', precio: 2200, descuento: 0, img: 'p-anotador-semana', alt: 'Anotador semanal impreso sobre fondo verde', uso: 'organizar', papel: 'comun', hojas: 1, nuevo: false, destacado: false, desc: 'Una columna para cada día de la semana, lista para pegar en la heladera o en el corcho.', incluye: ['1 hoja A4', 'Versión horizontal y vertical'], tags: ['semanal', 'heladera', 'semana', 'this week', 'organizacion'] },
];

const HORARIOS = { 0: [], 1: [[540, 780], [960, 1200]], 2: [[540, 780], [960, 1200]], 3: [[540, 780], [960, 1200]], 4: [[540, 780], [960, 1200]], 5: [[540, 780], [960, 1200]], 6: [[540, 780]] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#EAF0FB', '--color-text': '#101935', '--color-text-muted': '#4A5575', '--color-primary': '#2563EB', '--color-secondary': '#16A34A', '--color-cta': '#15803D', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Chicle', vars: { '--color-bg': '#FFF7FB', '--color-bg-alt': '#FBE6F1', '--color-text': '#2A1030', '--color-text-muted': '#6E4A68', '--color-primary': '#C0266D', '--color-secondary': '#0D9488', '--color-cta': '#0F766E', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Mandarina', vars: { '--color-bg': '#FFFAF4', '--color-bg-alt': '#FDEBD8', '--color-text': '#2B1A0E', '--color-text-muted': '#6E5440', '--color-primary': '#B93D0B', '--color-secondary': '#7C3AED', '--color-cta': '#6D28D9', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Lavanda', vars: { '--color-bg': '#F8F7FF', '--color-bg-alt': '#ECE9FE', '--color-text': '#1C1833', '--color-text-muted': '#575175', '--color-primary': '#6D28D9', '--color-secondary': '#5B930C', '--color-cta': '#4D7C0F', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Kraft', vars: { '--color-bg': '#FBF7F0', '--color-bg-alt': '#F1E7D6', '--color-text': '#2E2418', '--color-text-muted': '#695A47', '--color-primary': '#9A4A0B', '--color-secondary': '#0E7490', '--color-cta': '#155E75', '--color-cta-text': '#FFFFFF' } },
];

const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const nombreCategoria = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const cuentaCategoria = id => PRODUCTOS.filter(p => p.cat === id).length;
const estadoInicial = () => ({ q: '', cat: 'todos', usos: [], papeles: [], precio: 'todos', orden: 'destacados' });

function enRangoPrecio(p, rango) {
  const f = precioFinal(p);
  if (rango === 'hasta3') return f <= 3000;
  if (rango === 'de3a6') return f > 3000 && f <= 6000;
  if (rango === 'mas6') return f > 6000;
  return true;
}

function filtrarProductos(lista, e) {
  const terminos = normalizar(e.q).split(/\s+/).filter(Boolean);
  return lista.filter(p => {
    if (e.cat !== 'todos' && p.cat !== e.cat) return false;
    if (e.usos.length && !e.usos.includes(p.uso)) return false;
    if (e.papeles.length && !e.papeles.includes(p.papel)) return false;
    if (!enRangoPrecio(p, e.precio)) return false;
    if (!terminos.length) return true;
    const texto = normalizar([p.nombre, nombreCategoria(p.cat), p.desc, USOS[p.uso], PAPELES[p.papel], ...p.tags].join(' '));
    return terminos.every(t => texto.includes(t));
  });
}

function ordenarProductos(lista, orden) {
  const copia = [...lista];
  if (orden === 'menor') copia.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'mayor') copia.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (orden === 'nombre') copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia;
}

const contarFiltros = e => (e.cat !== 'todos' ? 1 : 0) + e.usos.length + e.papeles.length + (e.precio !== 'todos' ? 1 : 0) + (e.q.trim() ? 1 : 0);
const textoResultados = n => (n === 0 ? 'Ningún archivo con esos filtros' : n === 1 ? '1 archivo' : `${n} archivos`);

const linkWhatsApp = lineas => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;
const mensajeProducto = p => linkWhatsApp([`Hola Arteenpapel, quiero consultar por «${p.nombre}» (PDF, ${formatearPrecio(precioFinal(p))}).`, '¿Me contás en qué papel conviene imprimirlo?']);

function horaTexto(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}:${String(m).padStart(2, '0')} h` : `${h} h`;
}

function ahoraArgentina(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
  const valor = t => partes.find(x => x.type === t)?.value || '0';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
  return { dia, minutos: (parseInt(valor('hour'), 10) % 24) * 60 + parseInt(valor('minute'), 10) };
}

function estadoAtencion(dia, minutos) {
  const hoy = HORARIOS[dia] || [];
  const actual = hoy.find(([a, b]) => minutos >= a && minutos < b);
  if (actual) return { abierto: true, texto: `Abierto ahora · respondemos hasta las ${horaTexto(actual[1])}` };
  const luego = hoy.find(([a]) => a > minutos);
  if (luego) return { abierto: false, texto: `Cerrado ahora · volvemos hoy a las ${horaTexto(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const franjas = HORARIOS[d];
    if (franjas?.length) return { abierto: false, texto: `Cerrado ahora · volvemos ${k === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${horaTexto(franjas[0][0])}` };
  }
  return { abierto: false, texto: 'Consultas por WhatsApp' };
}

const PARADAS_SEMANA = [
  { dia: 'Lunes', hora: '08:30', nota: 'Planificar la semana' },
  { dia: 'Martes', hora: '19:00', nota: 'Anotar los pendientes' },
  { dia: 'Miércoles', hora: '10:30', nota: 'Elegir los diseños' },
  { dia: 'Jueves', hora: '21:00', nota: 'Imprimir en casa' },
  { dia: 'Viernes', hora: '18:30', nota: 'Recortar y armar' },
  { dia: 'Sábado', hora: '17:00', nota: 'Soplar las velitas' },
];
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const tramo = (p, a, b) => clamp01((p - a) / (b - a));
const suave = t => t * t * (3 - 2 * t);
const mezcla = (a, b, t) => a + (b - a) * t;
const paradaSemana = t => PARADAS_SEMANA[Math.min(PARADAS_SEMANA.length - 1, Math.floor(clamp01(t) * PARADAS_SEMANA.length * 0.9999))];

const ICONO_PDF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ICONO_BASURA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

function precioHTML(p) {
  const final = `<span class="precio-final">${formatearPrecio(precioFinal(p))}</span>`;
  return p.descuento > 0 ? `${final}<s>${formatearPrecio(p.precio)}</s>` : final;
}

function cardHTML(p, animar = true) {
  const badges = (p.nuevo ? '<span class="badge badge-nuevo">Nuevo</span>' : '') + (p.descuento > 0 ? `<span class="badge badge-desc">-${p.descuento}%</span>` : '');
  const reveal = animar ? ' data-animate="up" style="transform:translateY(48px);opacity:0"' : '';
  return `<article class="prod-card" data-id="${p.id}"${reveal}>
    <div class="prod-marco marcas">
      <div class="prod-media">
        <button type="button" class="prod-abrir" data-abrir="${p.slug}" aria-label="Vista rápida de ${esc(p.nombre)}">
          <img src="images/${p.img}-600.webp" srcset="images/${p.img}-600.webp 600w, images/${p.img}-1200.webp 1200w" sizes="(max-width: 640px) 60vw, (max-width: 1200px) 31vw, 290px" width="600" height="600" alt="${esc(p.alt)}" draggable="false">
          <span class="prod-vista">Vista rápida</span>
        </button>
        ${badges ? `<span class="prod-badges">${badges}</span>` : ''}
        <span class="prod-archivo">${ICONO_PDF}PDF<span class="fmt">&nbsp;· A4</span></span>
      </div>
    </div>
    <div class="prod-body">
      <p class="prod-cat">${esc(nombreCategoria(p.cat))}</p>
      <h3 class="prod-nombre"><button type="button" data-abrir="${p.slug}">${esc(p.nombre)}</button></h3>
      <p class="prod-precio${p.descuento > 0 ? ' con-desc' : ''}">${precioHTML(p)}</p>
      <div class="prod-actions">
        <button type="button" class="btn-cta prod-add" data-agregar="${p.id}">Agregar al carrito</button>
        <button type="button" class="prod-comprar" data-comprar="${p.id}">Comprar ahora</button>
      </div>
    </div>
  </article>`;
}

function categoriaHTML(c) {
  const n = cuentaCategoria(c.id);
  return `<a class="cat-ficha" href="#tienda" data-cat="${c.id}" data-animate="up" style="transform:translateY(48px);opacity:0">
    <span class="cat-pestana">${n} ${n === 1 ? 'archivo' : 'archivos'}</span>
    <span class="cat-marco marcas"><span class="cat-media"><span class="cat-zoom"><img src="images/${c.img}-600.webp" srcset="images/${c.img}-600.webp 600w, images/${c.img}-1200.webp 1200w" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 62vw, 620px" width="600" height="600" alt="${esc(c.alt)}" draggable="false"></span></span></span>
    <span class="cat-info"><span class="cat-nombre">${esc(c.nombre)}</span>${ICONO_FLECHA}</span>
  </a>`;
}

function itemCarritoHTML(p, i) {
  return `<li class="drawer-item entra" style="animation-delay:${Math.min(i * 0.06, 0.36).toFixed(2)}s">
    <span class="drawer-item-img"><img src="images/${p.img}-600.webp" width="600" height="600" alt=""></span>
    <div>
      <p class="drawer-item-nombre">${esc(p.nombre)}</p>
      <p class="drawer-item-meta">PDF · ${esc(PAPELES[p.papel])}</p>
      <p class="drawer-item-precio">${formatearPrecio(precioFinal(p))}</p>
    </div>
    <button type="button" class="drawer-quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICONO_BASURA}</button>
  </li>`;
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.07, 0.56)}s`; el.classList.add('in'); });
  }));
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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const capasEstado = new Map();

function abrirCapa(capa, trigger) {
  if (!capa) return;
  const previo = capasEstado.get(capa);
  if (previo?.timer) clearTimeout(previo.timer);
  capasEstado.set(capa, { trigger: trigger || document.activeElement, timer: null });
  capa.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => capa.classList.add('open')));
  const dialogo = capa.querySelector('[role="dialog"]');
  const primero = dialogo?.querySelector(FOCUSABLE);
  (primero || dialogo)?.focus({ preventScroll: true });
}

function cerrarCapa(capa, devolverFoco = true) {
  if (!capa || capa.hidden) return;
  const estado = capasEstado.get(capa) || {};
  capa.classList.remove('open');
  estado.timer = setTimeout(() => { capa.hidden = true; estado.timer = null; }, reduceMotion ? 0 : 420);
  capasEstado.set(capa, estado);
  const otraAbierta = [...document.querySelectorAll('.capa')].some(c => c !== capa && !c.hidden && c.classList.contains('open'));
  if (!otraAbierta) document.body.classList.remove('no-scroll');
  if (devolverFoco && estado.trigger?.isConnected) estado.trigger.focus({ preventScroll: true });
}

function initCapas() {
  document.querySelectorAll('.capa').forEach(capa => {
    capa.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarCapa(capa); });
    capa.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); cerrarCapa(capa); return; }
      if (e.key !== 'Tab') return;
      const dialogo = capa.querySelector('[role="dialog"]');
      const els = [...dialogo.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });
  });
}

function renderCarrito() {
  const lista = document.getElementById('cartItems');
  if (!lista) return;
  const productos = Cart.get().map(i => getProducto(i.id)).filter(Boolean);
  lista.innerHTML = productos.map(itemCarritoHTML).join('');
  lista.hidden = productos.length === 0;
  document.getElementById('cartVacio').hidden = productos.length > 0;
  document.getElementById('cartFoot').hidden = productos.length === 0;
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}

function updateCartBadge(animar = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n && animar) b.classList.add('bump');
  });
}

function abrirCarrito(trigger) {
  renderCarrito();
  abrirCapa(document.getElementById('cartCapa'), trigger);
}

function agregarAlCarrito(id, boton) {
  const p = getProducto(id);
  if (!p) return false;
  if (Cart.get().some(i => i.id === id)) {
    showToast(`«${p.nombre}» ya está en tu carrito: es un archivo, con uno alcanza.`);
    return false;
  }
  Cart.add(p, 1);
  showToast(`Sumaste «${p.nombre}» al carrito`);
  if (boton && !boton.dataset.texto) {
    boton.dataset.texto = boton.textContent;
    boton.classList.add('agregado');
    boton.textContent = '¡Agregado!';
    setTimeout(() => { boton.classList.remove('agregado'); boton.textContent = boton.dataset.texto; delete boton.dataset.texto; }, 1400);
  }
  return true;
}

function comprarAhora(id, trigger) {
  const p = getProducto(id);
  if (!p) return;
  if (!Cart.get().some(i => i.id === id)) Cart.add(p, 1);
  const qv = document.getElementById('qvCapa');
  if (qv && !qv.hidden) cerrarCapa(qv, false);
  abrirCarrito(trigger);
}

function lanzarConfeti() {
  if (typeof confetti !== 'function' || reduceMotion) return;
  const cs = window.getComputedStyle(document.documentElement);
  const colores = ['--color-primary', '--color-secondary', '--color-cta', '--color-bg-alt'].map(v => cs.getPropertyValue(v).trim()).filter(Boolean);
  confetti({ particleCount: 110, spread: 75, startVelocity: 38, origin: { x: 0.8, y: 0.85 }, colors: colores, zIndex: 400, disableForReducedMotion: true });
}

function initCarrito() {
  document.getElementById('cartBtn')?.addEventListener('click', e => abrirCarrito(e.currentTarget));
  document.getElementById('cartItems')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const p = getProducto(b.dataset.quitar);
    Cart.remove(b.dataset.quitar);
    renderCarrito();
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    (document.querySelector('#cartItems [data-quitar]') || document.querySelector('#cartCapa .drawer-close'))?.focus();
  });
  document.querySelector('[data-ir-tienda]')?.addEventListener('click', e => {
    e.preventDefault();
    cerrarCapa(document.getElementById('cartCapa'), false);
    irATienda(false);
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    lanzarConfeti();
  });
  document.addEventListener('cart:updated', () => updateCartBadge(true));
  updateCartBadge(false);
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
  cart?.addEventListener('click', e => abrirCarrito(e.currentTarget));
  sync();
}

const POR_PAGINA = 16;
const estadoCatalogo = { ...estadoInicial(), visibles: POR_PAGINA };

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (grid) grid.innerHTML = CATEGORIAS.map(categoriaHTML).join('');
}

function sincronizarControles() {
  document.querySelectorAll('#tienda [data-filtro]').forEach(chip => {
    const { filtro, valor } = chip.dataset;
    let activo = false;
    if (filtro === 'cat') activo = estadoCatalogo.cat === valor;
    else if (filtro === 'uso') activo = estadoCatalogo.usos.includes(valor);
    else if (filtro === 'papel') activo = estadoCatalogo.papeles.includes(valor);
    else if (filtro === 'precio') activo = estadoCatalogo.precio === valor;
    chip.setAttribute('aria-pressed', String(activo));
  });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== estadoCatalogo.q) buscar.value = estadoCatalogo.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = estadoCatalogo.orden;
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = contarFiltros(estadoCatalogo) === 0;
  const extra = estadoCatalogo.usos.length + estadoCatalogo.papeles.length + (estadoCatalogo.precio !== 'todos' ? 1 : 0);
  document.querySelectorAll('[data-filtros-cuenta]').forEach(b => { b.textContent = extra; b.hidden = extra === 0; });
}

function renderCatalogo(agregar = false) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const lista = ordenarProductos(filtrarProductos(PRODUCTOS, estadoCatalogo), estadoCatalogo.orden);
  const visibles = lista.slice(0, estadoCatalogo.visibles);
  if (agregar) grid.insertAdjacentHTML('beforeend', visibles.slice(grid.children.length).map(p => cardHTML(p)).join(''));
  else grid.innerHTML = visibles.map(p => cardHTML(p)).join('');
  document.getElementById('resultados').textContent = textoResultados(lista.length);
  document.getElementById('vacio').hidden = lista.length > 0;
  document.getElementById('verMas').hidden = lista.length <= estadoCatalogo.visibles;
  sincronizarControles();
  revelarNuevos(grid);
  refrescarTriggers();
}

function aplicarCambio(cambio) {
  Object.assign(estadoCatalogo, cambio, { visibles: POR_PAGINA });
  renderCatalogo();
}

function irATienda(enfocarBuscador = false) {
  const tienda = document.getElementById('tienda');
  if (!tienda) return;
  tienda.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (enfocarBuscador) setTimeout(() => document.getElementById('buscar')?.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
}

function filtrarDesdeAfuera(cambio) {
  aplicarCambio({ ...estadoInicial(), orden: estadoCatalogo.orden, ...cambio });
  irATienda(false);
}

function initCatalogo() {
  const tienda = document.getElementById('tienda');
  if (!tienda) return;
  tienda.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro]');
    if (chip) {
      const { filtro, valor } = chip.dataset;
      if (filtro === 'cat') aplicarCambio({ cat: valor });
      else if (filtro === 'precio') aplicarCambio({ precio: valor });
      else {
        const clave = filtro === 'uso' ? 'usos' : 'papeles';
        const actual = estadoCatalogo[clave];
        aplicarCambio({ [clave]: actual.includes(valor) ? actual.filter(v => v !== valor) : [...actual, valor] });
      }
      return;
    }
    if (e.target.closest('#limpiar, [data-limpiar]')) {
      aplicarCambio(estadoInicial());
      document.getElementById('buscar')?.focus({ preventScroll: true });
    }
  });
  let espera = null;
  document.getElementById('buscar')?.addEventListener('input', e => {
    clearTimeout(espera);
    const valor = e.target.value;
    espera = setTimeout(() => aplicarCambio({ q: valor }), 180);
  });
  document.getElementById('orden')?.addEventListener('change', e => aplicarCambio({ orden: e.target.value }));
  document.getElementById('verMas')?.addEventListener('click', () => {
    estadoCatalogo.visibles += POR_PAGINA;
    renderCatalogo(true);
  });
  const btnFiltros = document.getElementById('btnFiltros');
  const panel = document.getElementById('panelFiltros');
  btnFiltros?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('is-open');
    btnFiltros.setAttribute('aria-expanded', String(abierto));
    refrescarTriggers();
  });
  renderCatalogo();
}

function initRailDrag(vp) {
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
  const UMBRAL = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < UMBRAL) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p)).join('');
  track.setAttribute('data-animate-stagger', '');
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => {
    const card = track.querySelector('.prod-card');
    return (card ? card.getBoundingClientRect().width : 280) + (parseFloat(window.getComputedStyle(track).columnGap) || 24);
  };
  const actualizar = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
}

let productoAbierto = null;

function galeriaProducto(p) {
  const ctx = CONTEXTOS[p.uso] || CONTEXTOS.organizar;
  return [
    { src: `images/${p.img}-1200.webp`, thumb: `images/${p.img}-600.webp`, alt: p.alt },
    { src: `images/${ctx.img}.webp`, thumb: `images/${ctx.img}.webp`, alt: ctx.alt },
  ];
}

function abrirProducto(slug, trigger) {
  const p = PRODUCTOS.find(x => x.slug === slug);
  const capa = document.getElementById('qvCapa');
  if (!p || !capa) return;
  productoAbierto = p;
  const galeria = galeriaProducto(p);
  const img = document.getElementById('qvImg');
  img.src = galeria[0].src;
  img.alt = galeria[0].alt;
  document.getElementById('qvThumbs').innerHTML = galeria.map((g, i) => `<button type="button" class="qv-thumb" data-foto="${i}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1} de ${galeria.length}"><img src="${g.thumb}" width="120" height="120" alt=""></button>`).join('');
  document.getElementById('qvCat').textContent = nombreCategoria(p.cat);
  document.getElementById('qvTitulo').textContent = p.nombre;
  const precio = document.getElementById('qvPrecio');
  precio.innerHTML = precioHTML(p) + (p.descuento > 0 ? ` <span class="badge badge-desc">-${p.descuento}%</span>` : '');
  precio.classList.toggle('con-desc', p.descuento > 0);
  document.getElementById('qvDesc').textContent = p.desc;
  document.getElementById('qvFicha').innerHTML = [
    ['Formato', 'Archivo PDF · hoja A4'],
    ['Papel sugerido', PAPELES[p.papel]],
    ['Contenido', `${p.hojas} ${p.hojas === 1 ? 'hoja' : 'hojas'}`],
    ['Ideal para', USOS[p.uso]],
  ].map(([dt, dd]) => `<dt>${esc(dt)}</dt><dd>${esc(dd)}</dd>`).join('');
  document.getElementById('qvIncluye').innerHTML = p.incluye.map(i => `<li>${esc(i)}</li>`).join('');
  document.getElementById('qvWsp').href = mensajeProducto(p);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id)
    .concat(PRODUCTOS.filter(x => x.uso === p.uso && x.cat !== p.cat))
    .slice(0, 3);
  document.getElementById('qvRel').innerHTML = relacionados.map(r => `<button type="button" class="qv-rel-item" data-abrir="${r.slug}"><span class="qv-rel-img"><img src="images/${r.img}-600.webp" width="600" height="600" alt=""></span><span>${esc(r.nombre)}</span><span class="qv-rel-precio">${formatearPrecio(precioFinal(r))}</span></button>`).join('');
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
      image: new URL(`images/${p.img}-1200.webp`, location.href).href, category: nombreCategoria(p.cat),
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', url: `${location.origin}${location.pathname}?producto=${p.slug}` },
    });
  }
  if (capa.hidden) abrirCapa(capa, trigger);
  else {
    const modal = capa.querySelector('.modal');
    if (modal) modal.scrollTop = 0;
    capa.querySelector('.modal-close')?.focus({ preventScroll: true });
  }
}

function initModal() {
  const capa = document.getElementById('qvCapa');
  if (!capa) return;
  document.getElementById('qvThumbs')?.addEventListener('click', e => {
    const b = e.target.closest('[data-foto]');
    if (!b || !productoAbierto) return;
    const g = galeriaProducto(productoAbierto)[Number(b.dataset.foto)];
    if (!g) return;
    const img = document.getElementById('qvImg');
    img.src = g.src;
    img.alt = g.alt;
    document.querySelectorAll('#qvThumbs [data-foto]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  });
  document.getElementById('qvAgregar')?.addEventListener('click', e => { if (productoAbierto) agregarAlCarrito(productoAbierto.id, e.currentTarget); });
  document.getElementById('qvComprar')?.addEventListener('click', () => { if (productoAbierto) comprarAhora(productoAbierto.id, capasEstado.get(capa)?.trigger); });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && PRODUCTOS.some(p => p.slug === slug)) abrirProducto(slug);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const agregar = e.target.closest('[data-agregar]');
    if (agregar) { agregarAlCarrito(agregar.dataset.agregar, agregar); return; }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) { comprarAhora(comprar.dataset.comprar, comprar); return; }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { abrirProducto(abrir.dataset.abrir, abrir); return; }
    const cat = e.target.closest('a[data-cat]');
    if (cat) { e.preventDefault(); filtrarDesdeAfuera({ cat: cat.dataset.cat }); return; }
    const uso = e.target.closest('a[data-uso]');
    if (uso) { e.preventDefault(); filtrarDesdeAfuera({ usos: [uso.dataset.uso] }); return; }
    if (e.target.closest('[data-buscar]')) { e.preventDefault(); irATienda(true); }
  });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const html = document.documentElement;
  if (typeof gsap === 'undefined' || reduceMotion) { html.classList.add('hero-listo'); return; }
  const medios = hero.querySelectorAll('.pieza-media');
  const cabezales = hero.querySelectorAll('.cabezal');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => html.classList.add('hero-listo') });
  tl.fromTo('.pliego', { y: 30, scale: 0.985 }, { y: 0, scale: 1, duration: 1.1 }, 0)
    .fromTo('.hero-titulo', { opacity: 0, y: 26, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)', duration: 1.1 }, 0.15)
    .fromTo(hero.querySelectorAll('.hero-anim'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35)
    .fromTo(medios, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'power3.inOut', stagger: 0.16 }, 0.3)
    .fromTo(cabezales, { top: '0%', opacity: 1 }, { top: '100%', duration: 1.25, ease: 'power3.inOut', stagger: 0.16 }, 0.3)
    .to(cabezales, { opacity: 0, duration: 0.3, stagger: 0.16 }, 1.45)
    .fromTo('.pieza .archivo', { opacity: 0, y: 12, rotate: -9 }, { opacity: 1, y: 0, rotate: -3, duration: 0.8 }, 1.2)
    .fromTo('.pliego-marca', { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 1.3 }, 0.7)
    .fromTo('.hero .ficha-control .tira i', { opacity: 0, scaleY: 0.3 }, { opacity: 1, scaleY: 1, duration: 0.5, stagger: 0.035 }, 0.9);

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const piezas = [...hero.querySelectorAll('.pieza')];
    const profundidad = [10, 18, 26];
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      piezas.forEach((el, i) => gsap.to(el, { x: dx * profundidad[i % 3], y: dy * profundidad[i % 3], duration: 0.9, ease: 'power3.out', overwrite: 'auto' }));
    });
    hero.addEventListener('pointerleave', () => gsap.to(piezas, { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' }));
  }
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.utils.toArray('.cat-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.cat-media'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const editorial = document.querySelector('.editorial-img img');
  if (editorial) {
    gsap.fromTo(editorial, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.editorial-img', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initMundos() {
  const sec = document.getElementById('mundos');
  const escena = document.getElementById('mundosEscena');
  if (!sec || !escena) return;
  const copyA = escena.querySelector('.mundo-copy-a');
  const copyB = escena.querySelector('.mundo-copy-b');
  const textoA = copyA?.querySelector('.container');
  const textoB = copyB?.querySelector('.container');
  const fondoA = escena.querySelector('.mundo-a .mundo-fondo');
  const fondoB = escena.querySelector('.mundo-b .mundo-fondo');
  const dia = escena.querySelector('[data-reloj-dia]');
  const hora = escena.querySelector('[data-reloj-hora]');
  const nota = escena.querySelector('[data-reloj-nota]');
  if (!copyA || !copyB || !textoA || !textoB || !fondoA || !fondoB) return;
  let paradaActual = null;
  const pintarReloj = t => {
    const parada = paradaSemana(t);
    if (parada === paradaActual) return;
    paradaActual = parada;
    if (dia) dia.textContent = parada.dia;
    if (hora) hora.textContent = parada.hora;
    if (nota) nota.textContent = parada.nota;
  };
  if (reduceMotion) {
    sec.classList.add('is-estatico');
    pintarReloj(0);
    return;
  }
  const pintar = p => {
    escena.style.setProperty('--w', mezcla(108, -8, suave(tramo(p, 0.04, 0.7))).toFixed(2));
    const saleA = suave(tramo(p, 0.08, 0.28));
    textoA.style.transform = `translateX(${mezcla(0, -70, saleA).toFixed(1)}px)`;
    textoA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.pointerEvents = saleA > 0.85 ? 'none' : 'auto';
    fondoA.style.transform = `scale(${mezcla(1, 1.07, suave(tramo(p, 0, 1))).toFixed(4)})`;
    const entraB = suave(tramo(p, 0.34, 0.58));
    textoB.style.transform = `translateY(${mezcla(40, 0, entraB).toFixed(1)}px)`;
    textoB.style.opacity = entraB.toFixed(3);
    copyB.style.pointerEvents = entraB < 0.15 ? 'none' : 'auto';
    fondoB.style.transform = `scale(${mezcla(1.09, 1, suave(tramo(p, 0.18, 0.9))).toFixed(4)})`;
    pintarReloj(tramo(p, 0.02, 0.72));
  };
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; pintar(progreso()); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', () => pintar(progreso()));
  pintar(progreso());
}

function initHorarios() {
  const nodos = document.querySelectorAll('[data-estado]');
  const lista = document.getElementById('semanaLista');
  const pintar = () => {
    const { dia, minutos } = ahoraArgentina();
    if (dia < 0) return;
    const estado = estadoAtencion(dia, minutos);
    nodos.forEach(n => {
      n.classList.toggle('is-abierto', estado.abierto);
      const t = n.querySelector('.estado-texto');
      if (t) t.textContent = (n.closest('.hero') ? 'WhatsApp · ' : '') + estado.texto;
    });
    lista?.querySelectorAll('[data-dia]').forEach(li => li.classList.toggle('is-hoy', Number(li.dataset.dia) === dia));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'arteenpapel_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch (err) { void err; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
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
    window.__gkySendPaleta?.({ slug: window.gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initCategorias();
initRail();
initCatalogo();
initReveals();
initNav();
initCapas();
initCarrito();
initFloats();
initAcciones();
initModal();
initHero();
initParallax();
initLeeScroll();
initMundos();
initHorarios();
initColorSwitch();
