const WSP = '5491159190629';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ICON_WA = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_IZQ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
const ICON_DER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

const LINEAS = {
  instalaciones: 'Instalaciones',
  tableros: 'Tableros',
  automatizacion: 'Automatización',
  mantenimiento: 'Mantenimiento',
  tramites: 'Trámites y DCI',
};
const ORDEN_LINEAS = Object.keys(LINEAS);
const AREAS = { industria: 'Industria', comercio: 'Comercio', obra: 'Obra' };
const TENSION = { mono: 'Monofásica · 220 V', tri: 'Trifásica · 380 V' };
const ENTREGA = { planos: 'Planos y esquema unifilar', protocolo: 'Protocolo o informe técnico', firma: 'Firma de matriculado' };

const P = 'pathLength="1"';
const SIMBOLOS = {
  tablero: `<rect x="12" y="8" width="40" height="48" rx="1.5" ${P}/><path d="M12 17h40" ${P}/><path d="M22 22v7M22 41v7M22 41l-6-11" ${P}/><path d="M32 22v7M32 41v7M32 41l-6-11" ${P}/><path d="M42 22v7M42 41v7M42 41l-6-11" ${P}/>`,
  interruptor: `<path d="M32 6v16" ${P}/><path d="M28 18l8 8M36 18l-8 8" ${P}/><path d="M32 46 21 27" ${P}/><circle cx="32" cy="46" r="2" ${P}/><path d="M32 48v10" ${P}/>`,
  motor: `<path d="M32 4v11" ${P}/><circle cx="32" cy="34" r="19" ${P}/><text x="32" y="39" text-anchor="middle" font-size="17">M</text><text x="32" y="50" text-anchor="middle" font-size="8">3~</text>`,
  toma: `<path d="M32 6v26" ${P}/><path d="M26 13l12-5M26 19l12-5M26 25l12-5" ${P}/><path d="M16 48a16 16 0 0 1 32 0z" ${P}/>`,
  lampara: `<path d="M32 4v13" ${P}/><circle cx="32" cy="34" r="17" ${P}/><path d="M20 22l24 24M44 22 20 46" ${P}/>`,
  medidor: `<path d="M32 4v8" ${P}/><rect x="14" y="12" width="36" height="38" rx="1.5" ${P}/><path d="M14 24h36" ${P}/><text x="32" y="42" text-anchor="middle" font-size="12">kWh</text><path d="M32 50v10" ${P}/>`,
  capacitor: `<path d="M32 4v22" ${P}/><path d="M18 26h28M18 36h28" ${P}/><path d="M32 36v22" ${P}/><path d="M16 50 46 12" ${P}/><path d="M46 12l-7 1.5M46 12l-1.5 7" ${P}/>`,
  transferencia: `<path d="M18 6v14M46 6v14" ${P}/><circle cx="18" cy="22" r="2" ${P}/><circle cx="46" cy="22" r="2" ${P}/><path d="M32 46 45 25" ${P}/><circle cx="32" cy="46" r="2" ${P}/><path d="M32 48v10" ${P}/>`,
  plc: `<rect x="16" y="12" width="32" height="40" rx="1.5" ${P}/><path d="M8 22h8M8 32h8M8 42h8M48 22h8M48 32h8M48 42h8" ${P}/><text x="32" y="36" text-anchor="middle" font-size="12">PLC</text>`,
  contactor: `<rect x="10" y="26" width="16" height="12" rx="1" ${P}/><path d="M18 8v18M18 38v18" ${P}/><path d="M26 32h12" ${P}/><path d="M42 8v14M42 42v14M42 42l-7-17" ${P}/>`,
  ciclo: `<path d="M48.9 30.9A17 17 0 1 1 42.9 20" ${P}/><path d="M42.9 20l-1.8-6.8M42.9 20l-7-.6" ${P}/><path d="M32 24v9l6 4" ${P}/>`,
  falla: `<path d="M24 6l12 22-9 3 13 27" ${P}/><path d="M40 58l.5-7M40 58l-5.8-3.9" ${P}/>`,
  termometro: `<path d="M28 10a4 4 0 0 1 8 0v25a9 9 0 1 1-8 0z" ${P}/><path d="M32 20v19" ${P}/><circle cx="32" cy="45" r="3.5" ${P}/><path d="M42 14h7M42 20h5M42 26h7" ${P}/>`,
  tierra: `<path d="M32 6v26" ${P}/><path d="M14 32h36M20 40h24M26 48h12" ${P}/>`,
  documento: `<path d="M16 6h22l10 10v42H16z" ${P}/><path d="M38 6v10h10" ${P}/><path d="M22 26h20M22 33h20M22 40h12" ${P}/><path class="sym-ok" d="M33 50l4 4 9-10" ${P}/>`,
  unifilar: `<path d="M8 12h48" ${P}/><path d="M20 12v10M20 36v8M20 36l-6-11" ${P}/><path d="M44 12v10M44 36v8M44 36l-6-11" ${P}/><circle cx="20" cy="50" r="6" ${P}/><circle cx="44" cy="50" r="6" ${P}/>`,
  canal: `<rect x="8" y="8" width="14" height="14" rx="1.5" ${P}/><rect x="42" y="42" width="14" height="14" rx="1.5" ${P}/><path d="M22 15h10a8 8 0 0 1 8 8v11a8 8 0 0 0 8 8" ${P}/><circle cx="49" cy="49" r="2.5" ${P}/>`,
  pilar: `<path d="M32 4v8" ${P}/><path d="M22 58V12h20v46" ${P}/><rect x="26" y="18" width="12" height="12" rx="1" ${P}/><path d="M26 38h12" ${P}/><path d="M14 58h36" ${P}/>`,
};

const SERVICIOS = [
  { id: 'tablero-seccional', cod: 'S-01', linea: 'tableros', nombre: 'Tablero principal y seccionales', desc: 'Diseño, armado en taller y montaje en obra, con cada circuito identificado.', areas: ['industria', 'comercio', 'obra'], tension: ['mono', 'tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61439 · Reglamentación AEA 90364', simbolo: 'tablero', incluye: ['Esquema unifilar y cálculo de protecciones', 'Armado y cableado en taller', 'Rotulado de circuitos y borneras', 'Montaje, conexión y ensayo en obra'], tags: 'tablero general seccional termica termomagnetica disyuntor diferencial gabinete' },
  { id: 'obra-nueva', cod: 'S-02', linea: 'instalaciones', nombre: 'Instalación eléctrica de obra nueva', desc: 'De la cañería vacía al tablero energizado: canalizaciones, cableado, bocas, tableros y puesta a tierra.', areas: ['obra', 'comercio', 'industria'], tension: ['mono', 'tri'], entrega: ['planos', 'protocolo', 'firma'], norma: 'Reglamentación AEA 90364', simbolo: 'canal', incluye: ['Proyecto y cálculo de la instalación', 'Canalizaciones, cableado y bocas', 'Tablero principal y seccionales', 'Puesta a tierra y ensayos antes de energizar'], tags: 'obra nueva construccion edificio cañeria cableado bocas instalacion completa' },
  { id: 'dci', cod: 'S-03', linea: 'tramites', nombre: 'DCI · Declaración de Conformidad de Instalación', desc: 'Revisamos la instalación, la adecuamos si hace falta y firmamos la DCI que piden Edenor y Edesur.', areas: ['obra', 'comercio', 'industria'], tension: ['mono', 'tri'], entrega: ['firma'], norma: 'Res. ENRE 225/2011 y 269/2012', simbolo: 'documento', incluye: ['Revisión de tablero, protecciones y puesta a tierra', 'Adecuaciones necesarias antes de firmar', 'Firma de la DCI por matriculado', 'Presentación ante la distribuidora'], tags: 'dci declaracion conformidad edenor edesur medidor conexion certificado firma matriculado' },
  { id: 'preventivo', cod: 'S-04', linea: 'mantenimiento', nombre: 'Mantenimiento preventivo programado', desc: 'Visitas con fecha y un informe por visita: qué se revisó, qué se cambió y qué conviene hacer después.', areas: ['industria', 'comercio'], tension: ['mono', 'tri'], entrega: ['protocolo'], norma: '', simbolo: 'ciclo', incluye: ['Inspección y limpieza de tableros', 'Reajuste de bornes y conexiones', 'Prueba de disyuntores diferenciales', 'Informe de cada visita'], tags: 'preventivo abono visitas periodico revision limpieza ajuste plan' },
  { id: 'plc', cod: 'S-05', linea: 'automatizacion', nombre: 'Tablero de automatización con PLC', desc: 'Lógica programada para máquinas y procesos, con pantalla para operar y variadores donde hacen falta.', areas: ['industria'], tension: ['tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61131-3 · IEC 61439', simbolo: 'plc', incluye: ['Relevamiento del proceso y listado de señales', 'Armado del tablero de control', 'Programación del PLC y de la pantalla', 'Puesta en marcha junto al operador'], tags: 'plc hmi pantalla automatizacion variador velocidad control proceso maquina' },
  { id: 'comando-motores', cod: 'S-06', linea: 'tableros', nombre: 'Tablero de comando de motores', desc: 'Arranques directos, estrella-triángulo o suaves, con sus protecciones y su señalización.', areas: ['industria'], tension: ['tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61439', simbolo: 'motor', incluye: ['Selección de contactores, relés y guardamotores', 'Pulsadores, selectoras y señalización', 'Enclavamientos y parada de emergencia', 'Prueba en vacío y con carga'], tags: 'motor arranque estrella triangulo arrancador suave contactor guardamotor bomba' },
  { id: 'remodelacion', cod: 'S-07', linea: 'instalaciones', nombre: 'Remodelación y adecuación de instalaciones', desc: 'Reordenamos circuitos, cambiamos cableado viejo y sumamos protecciones con un plan de trabajo por etapas.', areas: ['comercio', 'industria'], tension: ['mono', 'tri'], entrega: ['planos', 'protocolo'], norma: 'Reglamentación AEA 90364', simbolo: 'interruptor', incluye: ['Relevamiento del estado actual', 'Recableado y nuevos circuitos', 'Protecciones termomagnéticas y diferenciales', 'Plan de trabajo por etapas'], tags: 'remodelacion reforma adecuacion recableado local oficina cableado viejo' },
  { id: 'puesta-tierra', cod: 'S-08', linea: 'mantenimiento', nombre: 'Medición de puesta a tierra y continuidad', desc: 'La medición anual que exige la Res. SRT 900/15 en ambientes de trabajo, con su protocolo firmado.', areas: ['industria', 'comercio'], tension: ['mono', 'tri'], entrega: ['protocolo', 'firma'], norma: 'Res. SRT 900/2015', simbolo: 'tierra', incluye: ['Medición del valor de puesta a tierra', 'Verificación de continuidad de las masas', 'Control de los diferenciales', 'Protocolo firmado por matriculado'], tags: 'puesta a tierra jabalina pat srt 900 medicion continuidad masas protocolo art' },
  { id: 'suministro', cod: 'S-09', linea: 'tramites', nombre: 'Nuevo suministro y aumento de potencia', desc: 'Te acompañamos en el pedido a la distribuidora: potencia, documentación e instalación lista para conectar.', areas: ['obra', 'comercio', 'industria'], tension: ['mono', 'tri'], entrega: ['planos', 'firma'], norma: 'Res. ENRE 225/2011 y 269/2012', simbolo: 'medidor', incluye: ['Cálculo de la potencia a pedir', 'Documentación técnica del pedido', 'Pilar y tablero en condiciones', 'Seguimiento hasta la conexión'], tags: 'suministro medidor potencia aumento conexion trifasica edenor edesur tarifa' },
  { id: 'factor-potencia', cod: 'S-10', linea: 'tableros', nombre: 'Corrección del factor de potencia', desc: 'Banco de capacitores automático para evitar el recargo por bajo factor de potencia en la factura.', areas: ['industria', 'comercio'], tension: ['tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61439', simbolo: 'capacitor', incluye: ['Medición y análisis de la carga', 'Cálculo del banco de capacitores', 'Tablero con regulador automático', 'Control del coseno fi después de instalar'], tags: 'factor de potencia capacitores coseno fi reactiva recargo factura' },
  { id: 'fuerza-motriz', cod: 'S-11', linea: 'instalaciones', nombre: 'Fuerza motriz para máquinas', desc: 'Alimentaciones trifásicas para máquinas y equipos nuevos, con su protección y su comando.', areas: ['industria'], tension: ['tri'], entrega: ['planos', 'protocolo'], norma: 'Reglamentación AEA 90364', simbolo: 'toma', incluye: ['Cálculo de sección y caída de tensión', 'Bandejas y canalizaciones a la vista', 'Tomas industriales y conexionado', 'Verificación de giro y consumos'], tags: 'fuerza motriz maquina trifasica bandeja portacables toma industrial alimentacion' },
  { id: 'correctivo', cod: 'S-12', linea: 'mantenimiento', nombre: 'Mantenimiento correctivo y atención de fallas', desc: 'Diagnóstico con instrumental, reparación y la causa por escrito para que la falla no se repita.', areas: ['industria', 'comercio', 'obra'], tension: ['mono', 'tri'], entrega: ['protocolo'], norma: '', simbolo: 'falla', incluye: ['Diagnóstico con instrumental', 'Reparación o reemplazo de componentes', 'Pruebas antes de devolver el servicio', 'Informe con la causa encontrada'], tags: 'falla corte salta la termica cortocircuito urgencia reparacion correctivo' },
  { id: 'transferencia', cod: 'S-13', linea: 'tableros', nombre: 'Transferencia para grupo electrógeno', desc: 'Cuando se corta la red, el grupo toma las cargas elegidas, con enclavamiento para que nunca se crucen.', areas: ['industria', 'comercio'], tension: ['mono', 'tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61439', simbolo: 'transferencia', incluye: ['Transferencia manual o automática', 'Enclavamiento mecánico y eléctrico', 'Selección de cargas prioritarias', 'Prueba de corte y retorno de red'], tags: 'grupo electrogeno generador transferencia automatica corte de luz respaldo' },
  { id: 'iluminacion', cod: 'S-14', linea: 'instalaciones', nombre: 'Iluminación LED de naves y locales', desc: 'Recambio a LED y circuitos de iluminación por sector, con luces de emergencia donde corresponden.', areas: ['industria', 'comercio'], tension: ['mono', 'tri'], entrega: ['protocolo'], norma: 'Reglamentación AEA 90364', simbolo: 'lampara', incluye: ['Relevamiento y distribución de luminarias', 'Circuitos y comandos por sector', 'Iluminación de emergencia', 'Medición de niveles de iluminación'], tags: 'iluminacion led luminarias nave deposito local emergencia' },
  { id: 'planos', cod: 'S-15', linea: 'tramites', nombre: 'Planos eléctricos y esquema unifilar', desc: 'Relevamos lo que hay y lo dibujamos: plano de planta, unifilar de cada tablero y conforme a obra.', areas: ['industria', 'comercio', 'obra'], tension: ['mono', 'tri'], entrega: ['planos'], norma: 'Reglamentación AEA 90364', simbolo: 'unifilar', incluye: ['Relevamiento en el lugar', 'Plano de planta con circuitos', 'Esquema unifilar de cada tablero', 'Planos conforme a obra'], tags: 'planos unifilar trifilar conforme a obra relevamiento cad documentacion habilitacion' },
  { id: 'retrofit', cod: 'S-16', linea: 'automatizacion', nombre: 'Modernización de tableros existentes', desc: 'Reemplazamos componentes discontinuados y ordenamos el cableado sin rehacer toda la máquina.', areas: ['industria'], tension: ['tri'], entrega: ['planos', 'protocolo'], norma: 'IEC 61439', simbolo: 'contactor', incluye: ['Relevamiento del tablero y de la máquina', 'Nuevo esquema eléctrico', 'Reemplazo de componentes y cableado', 'Pruebas con la máquina en marcha'], tags: 'retrofit modernizacion tablero viejo repuestos discontinuados maquina' },
  { id: 'pilar-obra', cod: 'S-17', linea: 'instalaciones', nombre: 'Pilar y tablero de obra', desc: 'La conexión provisoria para arrancar la obra: pilar, medidor y tablero con sus protecciones.', areas: ['obra'], tension: ['mono', 'tri'], entrega: ['protocolo', 'firma'], norma: 'Res. ENRE 225/2011 y 269/2012', simbolo: 'pilar', incluye: ['Pilar para la conexión de la distribuidora', 'Tablero de obra con disyuntor y tomas', 'Puesta a tierra del tablero', 'Gestión del suministro de obra'], tags: 'pilar obra provisorio medidor de obra tablero de obra obrador' },
  { id: 'termografia', cod: 'S-18', linea: 'mantenimiento', nombre: 'Termografía de tableros', desc: 'Buscamos puntos calientes con el tablero en carga, antes de que se conviertan en una parada.', areas: ['industria', 'comercio'], tension: ['mono', 'tri'], entrega: ['protocolo'], norma: '', simbolo: 'termometro', incluye: ['Relevamiento con cámara termográfica', 'Imagen de cada punto caliente', 'Prioridad de cada hallazgo', 'Informe con las correcciones sugeridas'], tags: 'termografia camara termica punto caliente infrarrojo' },
];

const getServicio = id => SERVICIOS.find(s => s.id === id);
const valores = (s, g) => (g === 'area' ? s.areas : g === 'linea' ? [s.linea] : g === 'tension' ? s.tension : s.entrega);
const listaAreas = s => {
  const n = s.areas.map(a => AREAS[a].toLowerCase());
  const t = n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n[0];
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const msgServicio = s => `Hola IMEM, quiero consultar por el servicio «${s.nombre}» (${s.cod}).`;

function cardHTML(s) {
  return `<article class="svc" data-animate style="opacity:0;transform:translateY(40px)">
    <div class="svc__plano">
      <span class="svc__cod">${s.cod}</span>
      <span class="svc__linea">${esc(LINEAS[s.linea])}</span>
      <svg class="sym" viewBox="0 0 64 64" aria-hidden="true">${SIMBOLOS[s.simbolo] || ''}</svg>
    </div>
    <div class="svc__body">
      <h3>${esc(s.nombre)}</h3>
      <p class="svc__desc">${esc(s.desc)}</p>
      <div class="svc__areas">${s.areas.map(a => `<span>${AREAS[a]}</span>`).join('')}</div>
      <ul class="svc__entrega">${s.entrega.map(e => `<li>${ICON_CHECK}${ENTREGA[e]}</li>`).join('')}</ul>
      <div class="svc__foot">
        <button type="button" class="svc__ver" data-ficha="${s.id}">Ver ficha</button>
        <a class="svc__wsp" href="${waLink(msgServicio(s))}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp: ${esc(s.nombre)}">${ICON_WA}</a>
      </div>
    </div>
  </article>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  nuevos.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  });
}

function irA(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

const Cat = { q: '', sel: { area: new Set(), linea: new Set(), tension: new Set(), entrega: new Set() }, orden: 'rec', pagina: 1, porPagina: 9 };

function coincide(s, excluir) {
  for (const g of Object.keys(Cat.sel)) {
    if (g === excluir) continue;
    const set = Cat.sel[g];
    if (set.size && !valores(s, g).some(v => set.has(v))) return false;
  }
  if (Cat.q) {
    const texto = norm([s.nombre, s.desc, s.tags, s.cod, LINEAS[s.linea], s.incluye.join(' '), s.areas.map(a => AREAS[a]).join(' ')].join(' '));
    if (!Cat.q.split(/\s+/).every(t => texto.includes(t))) return false;
  }
  return true;
}

function ordenar(a, b) {
  if (Cat.orden === 'az') return a.nombre.localeCompare(b.nombre, 'es');
  if (Cat.orden === 'linea') return ORDEN_LINEAS.indexOf(a.linea) - ORDEN_LINEAS.indexOf(b.linea) || a.cod.localeCompare(b.cod);
  return a.cod.localeCompare(b.cod);
}

function renderCatalogo() {
  const grid = document.getElementById('svcGrid');
  if (!grid) return;
  const lista = SERVICIOS.filter(s => coincide(s)).sort(ordenar);
  const paginas = Math.max(1, Math.ceil(lista.length / Cat.porPagina));
  if (Cat.pagina > paginas) Cat.pagina = paginas;
  const vista = lista.slice((Cat.pagina - 1) * Cat.porPagina, Cat.pagina * Cat.porPagina);
  grid.innerHTML = vista.map(cardHTML).join('');
  grid.hidden = lista.length === 0;
  const vacio = document.getElementById('svcVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const vacioWsp = document.getElementById('vacioWsp');
  if (vacioWsp) {
    const buscado = document.getElementById('q')?.value.trim();
    vacioWsp.href = waLink(`Hola IMEM, busco un servicio que no encontré en la web: ${buscado || ''}`.trim());
  }

  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = lista.length; });
  document.querySelectorAll('[data-total-txt]').forEach(el => { el.textContent = lista.length === 1 ? 'servicio' : 'servicios'; });

  document.querySelectorAll('.filtros input[type="checkbox"]').forEach(inp => {
    const g = inp.dataset.g;
    const v = inp.value;
    inp.checked = Cat.sel[g].has(v);
    const n = SERVICIOS.filter(s => coincide(s, g) && valores(s, g).includes(v)).length;
    const lbl = document.querySelector(`[data-n="${g}:${v}"]`);
    if (lbl) lbl.textContent = n;
    inp.closest('.check')?.classList.toggle('is-cero', n === 0 && !inp.checked);
  });

  const activos = Object.values(Cat.sel).reduce((t, set) => t + set.size, 0) + (Cat.q ? 1 : 0);
  document.querySelectorAll('[data-limpiar]').forEach(b => {
    if (b.classList.contains('filtros__limpiar')) b.hidden = activos === 0;
  });
  const badge = document.querySelector('[data-activos]');
  if (badge) { badge.textContent = activos; badge.hidden = activos === 0; }

  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const nombres = { area: AREAS, linea: LINEAS, tension: TENSION, entrega: ENTREGA };
    const items = [];
    if (Cat.q) items.push(`<button type="button" class="chip-x" data-quitar="q">«${esc(document.getElementById('q')?.value.trim())}» ${ICON_X}<span class="sr-only">Quitar búsqueda</span></button>`);
    Object.entries(Cat.sel).forEach(([g, set]) => set.forEach(v => items.push(`<button type="button" class="chip-x" data-quitar="${g}:${v}">${esc(nombres[g][v])} ${ICON_X}<span class="sr-only">Quitar filtro</span></button>`)));
    chips.innerHTML = items.join('');
    chips.hidden = items.length === 0;
  }

  const unica = Cat.sel.linea.size === 1 ? [...Cat.sel.linea][0] : (Cat.sel.linea.size === 0 ? '' : null);
  document.querySelectorAll('.cat-bar__btn').forEach(b => {
    const on = unica !== null && b.dataset.cat === unica && !Cat.q && Cat.sel.area.size + Cat.sel.tension.size + Cat.sel.entrega.size === 0;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  const nav = document.getElementById('paginas');
  if (nav) {
    if (paginas <= 1) { nav.innerHTML = ''; nav.hidden = true; } else {
      nav.hidden = false;
      let h = `<button type="button" data-pag="${Cat.pagina - 1}" aria-label="Página anterior" ${Cat.pagina === 1 ? 'disabled' : ''}>${ICON_IZQ}</button>`;
      for (let i = 1; i <= paginas; i++) h += `<button type="button" data-pag="${i}" ${i === Cat.pagina ? 'aria-current="page"' : ''} aria-label="Página ${i}">${i}</button>`;
      h += `<button type="button" data-pag="${Cat.pagina + 1}" aria-label="Página siguiente" ${Cat.pagina === paginas ? 'disabled' : ''}>${ICON_DER}</button>`;
      nav.innerHTML = h;
    }
  }

  revelarNuevos(grid);
  refrescarST();
}

function limpiarCatalogo() {
  Object.values(Cat.sel).forEach(set => set.clear());
  Cat.q = '';
  const q = document.getElementById('q');
  if (q) q.value = '';
  Cat.pagina = 1;
}

function initCatalogo() {
  const grid = document.getElementById('svcGrid');
  if (!grid) return;
  const sec = document.getElementById('catalogo');
  document.querySelectorAll('.filtros input[type="checkbox"]').forEach(inp => {
    inp.addEventListener('change', () => {
      const set = Cat.sel[inp.dataset.g];
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      Cat.pagina = 1;
      renderCatalogo();
    });
  });
  document.getElementById('orden')?.addEventListener('change', e => { Cat.orden = e.target.value; Cat.pagina = 1; renderCatalogo(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => { limpiarCatalogo(); renderCatalogo(); }));
  document.getElementById('chipsActivos')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [g, v] = b.dataset.quitar.split(':');
    if (g === 'q') { Cat.q = ''; const q = document.getElementById('q'); if (q) q.value = ''; } else Cat.sel[g].delete(v);
    Cat.pagina = 1;
    renderCatalogo();
  });
  document.getElementById('paginas')?.addEventListener('click', e => {
    const b = e.target.closest('[data-pag]');
    if (!b || b.disabled) return;
    Cat.pagina = parseInt(b.dataset.pag, 10);
    renderCatalogo();
    irA(sec);
  });
  renderCatalogo();
}

function initBuscador() {
  const form = document.getElementById('buscador');
  const q = document.getElementById('q');
  if (!form || !q) return;
  const aplicar = () => { Cat.q = norm(q.value.trim()); Cat.pagina = 1; renderCatalogo(); };
  q.addEventListener('input', debounce(aplicar, 140));
  form.addEventListener('submit', e => { e.preventDefault(); aplicar(); q.blur(); irA(document.getElementById('catalogo')); });
}

const Rail = { linea: '', area: '' };

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const lista = SERVICIOS.filter(s => (!Rail.linea || s.linea === Rail.linea) && (!Rail.area || s.areas.includes(Rail.area)));
  track.innerHTML = lista.length ? lista.map(cardHTML).join('') : '<p class="rail-vacio">Por ahora no hay servicios con esa combinación. Escribinos y lo vemos.</p>';
  document.querySelectorAll('.rail-chips .chip-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.linea === Rail.linea ? 'true' : 'false'));
  const cuenta = document.getElementById('railCuenta');
  if (cuenta) cuenta.innerHTML = `<span class="cota" aria-hidden="true"></span><strong>${lista.length}</strong> ${lista.length === 1 ? 'servicio' : 'servicios'}`;
  const filtroArea = document.getElementById('railArea');
  if (filtroArea) {
    filtroArea.hidden = !Rail.area;
    filtroArea.innerHTML = Rail.area ? `Para ${esc(AREAS[Rail.area].toLowerCase())} ${ICON_X}<span class="sr-only">Quitar el filtro de área</span>` : '';
  }
  const vp = document.getElementById('railVp');
  if (vp) vp.scrollLeft = 0;
  actualizarFlechas();
  revelarNuevos(track);
  refrescarST();
}

function actualizarFlechas() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track || !prev || !next) return;
  const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
  prev.disabled = vp.scrollLeft <= inicio + 2;
  next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
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
  const track = document.getElementById('railTrack');
  if (!track) return;
  const vp = document.getElementById('railVp');
  document.querySelectorAll('.rail-chips .chip-btn').forEach(b => b.addEventListener('click', () => { Rail.linea = b.dataset.linea; renderRail(); }));
  document.getElementById('railArea')?.addEventListener('click', () => { Rail.area = ''; renderRail(); });
  const paso = dir => {
    const card = track.querySelector('.svc');
    const ancho = card ? card.getBoundingClientRect().width + 16 : 300;
    vp.scrollBy({ left: dir * ancho, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  document.getElementById('railPrev')?.addEventListener('click', () => paso(-1));
  document.getElementById('railNext')?.addEventListener('click', () => paso(1));
  vp?.addEventListener('scroll', () => requestAnimationFrame(actualizarFlechas), { passive: true });
  window.addEventListener('resize', debounce(actualizarFlechas, 120));
  initRailDrag(vp);
  renderRail();
}

function mostrarServicios({ linea = '', area = '' } = {}) {
  const grid = document.getElementById('svcGrid');
  if (grid) {
    limpiarCatalogo();
    if (linea) Cat.sel.linea.add(linea);
    if (area) Cat.sel.area.add(area);
    renderCatalogo();
    irA(document.getElementById('catalogo'));
    return;
  }
  if (document.getElementById('railTrack')) {
    Rail.linea = linea;
    Rail.area = area;
    renderRail();
    irA(document.getElementById('servicios'));
  }
}

function initAtajos() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-ir-linea], [data-ir-area]');
    if (!a) return;
    e.preventDefault();
    mostrarServicios({ linea: a.dataset.irLinea || '', area: a.dataset.irArea || '' });
  });
  document.querySelectorAll('.cat-bar__btn').forEach(b => b.addEventListener('click', () => mostrarServicios({ linea: b.dataset.cat || '' })));
  document.querySelectorAll('[data-cuenta]').forEach(el => { el.textContent = SERVICIOS.filter(s => s.linea === el.dataset.cuenta).length; });
  document.querySelectorAll('[data-cuenta-area]').forEach(el => { el.textContent = SERVICIOS.filter(s => s.areas.includes(el.dataset.cuentaArea)).length; });
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
let ultimoDisparador = null;
let dialogoAbierto = null;

function trampa(e) {
  if (e.key !== 'Tab') return;
  const els = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0], last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

function abrirDialogo(el, disparador, onClose) {
  ultimoDisparador = disparador || document.activeElement;
  dialogoAbierto = { el, onClose };
  el.hidden = false;
  el.removeAttribute('inert');
  requestAnimationFrame(() => el.classList.add('open'));
  document.body.classList.add('no-scroll');
  (el.querySelector('[data-foco]') || el.querySelector(FOCUSABLE) || el).focus();
  el.addEventListener('keydown', trampa);
}

function cerrarDialogo(conHidden = true) {
  if (!dialogoAbierto) return;
  const { el, onClose } = dialogoAbierto;
  dialogoAbierto = null;
  el.classList.remove('open');
  el.removeEventListener('keydown', trampa);
  document.body.classList.remove('no-scroll');
  if (conHidden) setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, 380);
  onClose?.();
  ultimoDisparador?.focus();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape' && dialogoAbierto) cerrarDialogo(dialogoAbierto.el.id !== 'filtros'); });

function fichaHTML(s) {
  const tension = s.tension.length === 2 ? 'Monofásica y trifásica' : TENSION[s.tension[0]];
  return `<div class="ficha__plano"><span class="svc__cod">${s.cod}</span><svg class="sym" viewBox="0 0 64 64" aria-hidden="true">${SIMBOLOS[s.simbolo] || ''}</svg></div>
    <div class="ficha__cuerpo">
      <p class="ficha__linea">${esc(LINEAS[s.linea])}</p>
      <h2 id="fichaTitulo">${esc(s.nombre)}</h2>
      <p class="ficha__desc">${esc(s.desc)}</p>
      <dl class="ficha__datos"><div><dt>Áreas</dt><dd>${esc(listaAreas(s))}</dd></div><div><dt>Tensión</dt><dd>${esc(tension)}</dd></div></dl>
      <p class="ficha__sub">Qué incluye</p>
      <ul class="ficha__lista">${s.incluye.map(i => `<li>${ICON_CHECK}<span>${esc(i)}</span></li>`).join('')}</ul>
      <p class="ficha__sub">Qué te entregamos</p>
      <ul class="ficha__lista">${s.entrega.map(e => `<li>${ICON_CHECK}<span>${ENTREGA[e]}</span></li>`).join('')}</ul>
      ${s.norma ? `<p class="ficha__norma">Norma de referencia: <strong>${esc(s.norma)}</strong></p>` : ''}
      <div class="ctas"><a class="btn btn--primary" href="${waLink(msgServicio(s))}" target="_blank" rel="noopener">${ICON_WA} Consultar por este servicio</a></div>
    </div>`;
}

function initFicha() {
  const modal = document.getElementById('fichaModal');
  const cont = document.getElementById('fichaContenido');
  if (!modal || !cont) return;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ficha]');
    if (!b) return;
    const s = getServicio(b.dataset.ficha);
    if (!s) return;
    cont.innerHTML = fichaHTML(s);
    modal.removeAttribute('aria-label');
    modal.setAttribute('aria-labelledby', 'fichaTitulo');
    abrirDialogo(modal, b);
  });
  document.getElementById('fichaCerrar')?.addEventListener('click', () => cerrarDialogo());
  modal.addEventListener('click', e => { if (e.target === modal) cerrarDialogo(); });
}

function initFiltrosDrawer() {
  const aside = document.getElementById('filtros');
  const abrir = document.getElementById('filtrosAbrir');
  const bd = document.getElementById('filtrosBackdrop');
  if (!aside || !abrir || !bd) return;
  const movil = window.matchMedia('(max-width: 1024px)');
  const sync = () => {
    if (movil.matches && !aside.classList.contains('open')) aside.setAttribute('inert', '');
    else aside.removeAttribute('inert');
  };
  const cerrar = () => {
    bd.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    if (dialogoAbierto?.el === aside) cerrarDialogo(false);
    aside.classList.remove('open');
    sync();
  };
  abrir.addEventListener('click', () => {
    aside.removeAttribute('inert');
    aside.setAttribute('role', 'dialog');
    aside.setAttribute('aria-modal', 'true');
    bd.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    abrirDialogo(aside, abrir, () => {
      bd.classList.remove('open');
      abrir.setAttribute('aria-expanded', 'false');
      aside.removeAttribute('role');
      aside.removeAttribute('aria-modal');
      setTimeout(sync, 400);
    });
  });
  bd.addEventListener('click', cerrar);
  document.getElementById('filtrosCerrar')?.addEventListener('click', cerrar);
  document.getElementById('filtrosVer')?.addEventListener('click', () => { cerrar(); irA(document.getElementById('catalogo')); });
  movil.addEventListener('change', () => { if (!movil.matches && aside.classList.contains('open')) cerrar(); sync(); });
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function initMundos() {
  const sec = document.getElementById('puesta-en-servicio');
  const escena = document.getElementById('mundosEscena');
  if (!sec || !escena) return;
  const copyA = document.getElementById('mundoCopyA');
  const copyB = document.getElementById('mundoCopyB');
  const fotoA = document.getElementById('mundoFotoA');
  const fotoB = document.getElementById('mundoFotoB');
  const volt = document.getElementById('protoVolt');
  const okEl = document.getElementById('protoOk');
  const barra = document.getElementById('protoBarra');
  const estado = document.getElementById('protoEstado');
  const filas = [...document.querySelectorAll('#protoLista li')];
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const tramo = (p, a, b) => clamp01((p - a) / (b - a));
  const suave = t => t * t * (3 - 2 * t);
  const mezcla = (a, b, t) => a + (b - a) * t;
  const UMBRALES = [0.14, 0.26, 0.38, 0.5, 0.62];
  let ultimoOk = -1;
  let ultimoEstado = '';

  const pintar = p => {
    escena.style.setProperty('--w', mezcla(108, -8, suave(tramo(p, 0.04, 0.72))).toFixed(2));
    const saleA = suave(tramo(p, 0.06, 0.26));
    copyA.style.transform = `translateX(${mezcla(0, -60, saleA).toFixed(1)}px)`;
    copyA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.visibility = saleA > 0.98 ? 'hidden' : 'visible';
    copyA.style.pointerEvents = saleA > 0.5 ? 'none' : 'auto';
    if (fotoA) fotoA.style.transform = `scale(${mezcla(1, 1.06, p).toFixed(4)})`;
    const entraB = suave(tramo(p, 0.36, 0.6));
    copyB.style.transform = `translateY(${mezcla(36, 0, entraB).toFixed(1)}px)`;
    copyB.style.opacity = entraB.toFixed(3);
    copyB.style.visibility = entraB < 0.02 ? 'hidden' : 'visible';
    copyB.style.pointerEvents = entraB < 0.5 ? 'none' : 'auto';
    if (fotoB) fotoB.style.transform = `scale(${mezcla(1.08, 1, suave(tramo(p, 0.15, 0.9))).toFixed(4)})`;
    const ok = UMBRALES.filter(u => p >= u).length;
    if (ok !== ultimoOk) {
      filas.forEach((li, i) => {
        const on = i < ok;
        li.classList.toggle('is-ok', on);
        const txt = li.querySelector('em span');
        if (txt) txt.textContent = on ? 'Conforme' : 'Pendiente';
      });
      okEl.textContent = ok;
      ultimoOk = ok;
    }
    barra.style.transform = `scaleX(${tramo(p, 0.04, 0.62).toFixed(3)})`;
    const v = Math.round(380 * suave(tramo(p, 0.64, 0.8)));
    volt.textContent = v;
    const e = v >= 380 ? 'on' : (ok >= 5 && v > 0 ? 'sube' : 'off');
    if (e !== ultimoEstado) {
      estado.classList.toggle('is-on', e === 'on');
      estado.lastElementChild.textContent = e === 'on' ? 'En servicio' : e === 'sube' ? 'Energizando' : 'Sin tensión';
      ultimoEstado = e;
    }
  };

  if (reduceMotion) { pintar(1); return; }
  const off = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const o = off();
    const total = r.height - (window.innerHeight - o);
    return total > 0 ? clamp01((o - r.top) / total) : 0;
  };
  let pedido = false;
  const tick = () => { pedido = false; pintar(progreso()); };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar(progreso());
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const TIPOS_PLAN = { industria: 'Planta industrial', comercio: 'Local comercial', oficinas: 'Oficinas' };
const USOS = ['1 turno', '2 turnos', '24 horas'];
const BASE_VISITA = { industria: [3, 2, 1], comercio: [6, 4, 3], oficinas: [6, 6, 4] };
const TAREAS = [
  { id: 'insp', nombre: 'Inspección y limpieza de tableros', cada: () => 0, horas: (n, t) => n * (t === 'industria' ? 0.45 : 0.35) },
  { id: 'dif', nombre: 'Prueba de disyuntores diferenciales', cada: () => 0, horas: n => n * 0.1 },
  { id: 'bornes', nombre: 'Reajuste de bornes y conexiones', cada: (t, u, amb) => (amb ? [3, 3, 3] : { industria: [6, 6, 3], comercio: [12, 12, 6], oficinas: [12, 12, 12] }[t])[u], turno: 1, horas: n => n * 0.3 },
  { id: 'termo', nombre: 'Termografía de tableros en carga', cada: t => ({ industria: [12, 6, 6], comercio: [12, 12, 6], oficinas: [12, 12, 12] }[t]), turno: 1, horas: n => 0.5 + n * 0.2, si: (t, n) => t === 'industria' || n >= 3 },
  { id: 'emerg', nombre: 'Prueba de iluminación de emergencia', cada: () => 6, turno: 0, horas: n => 0.5 + n * 0.05 },
  { id: 'pat', nombre: 'Medición de puesta a tierra · Res. SRT 900/15', cada: () => 12, turno: 2, horas: n => 1.5 + n * 0.2, ley: true },
  { id: 'cap', nombre: 'Banco de capacitores y factor de potencia', cada: () => 6, turno: 1, horas: () => 1, si: t => t === 'industria' },
  { id: 'mot', nombre: 'Motores: consumo y aislación', cada: (t, u) => [12, 6, 6][u], turno: 2, horas: () => 1.5, si: t => t === 'industria' },
];

function calcularPlan({ tipo, tableros, uso, ambiente }) {
  let base = BASE_VISITA[tipo][uso];
  if (ambiente) base = Math.max(1, Math.ceil(base / 2));
  const visitas = 12 / base;
  const meses = Array.from({ length: visitas }, (_, i) => i * base);
  const filas = [];
  let horasTotal = 0;
  TAREAS.forEach(t => {
    if (t.si && !t.si(tipo, tableros)) return;
    let cada = t.cada(tipo, uso, ambiente);
    if (Array.isArray(cada)) cada = cada[uso];
    if (!cada) cada = base;
    cada = Math.max(base, Math.ceil(cada / base) * base);
    const offset = Math.min((t.turno || 0) * base, cada - base);
    const enMeses = [];
    for (let m = offset; m < 12; m += cada) enMeses.push(m);
    let h = t.horas(tableros, tipo);
    if (ambiente && t.id === 'insp') h *= 1.2;
    horasTotal += h * enMeses.length;
    filas.push({ ...t, meses: new Set(enMeses) });
  });
  const horas = Math.max(1.5, Math.round((horasTotal / visitas) * 2) / 2);
  return { base, visitas, meses: new Set(meses), filas, horas };
}

function initPlan() {
  const form = document.getElementById('planForm');
  if (!form) return;
  const inp = document.getElementById('planTableros');
  const filasEl = document.getElementById('planFilas');
  const mesesEl = document.getElementById('planMeses');
  const hoy = new Date();
  const mesInicio = hoy.getMonth();
  const orden = Array.from({ length: 12 }, (_, i) => (mesInicio + i) % 12);
  const leer = () => ({
    tipo: form.querySelector('input[name="tipo"]:checked')?.value || 'industria',
    tableros: Math.min(40, Math.max(1, parseInt(inp.value, 10) || 1)),
    uso: parseInt(form.querySelector('input[name="uso"]:checked')?.value || '0', 10),
    ambiente: !!form.querySelector('#planAmbiente')?.checked,
  });
  const formatoH = h => `≈ ${String(h).replace('.', ',')} h`;
  const render = animar => {
    const datos = leer();
    const r = calcularPlan(datos);
    mesesEl.innerHTML = `<th scope="col"><span class="sr-only">Tarea</span></th>` + orden.map((m, i) => `<th scope="col"${r.meses.has(i) ? ' class="is-visita"' : ''}>${MESES[m]}</th>`).join('');
    filasEl.innerHTML = r.filas.map(f => `<tr><th scope="row">${esc(f.nombre)}</th>${orden.map((m, i) => f.meses.has(i) ? `<td><span class="crono__dot${f.ley ? ' crono__dot--ley' : ''}" role="img" aria-label="${MESES_LARGO[m]}: sí"></span></td>` : `<td><span class="crono__nada" aria-hidden="true"></span></td>`).join('')}</tr>`).join('');
    document.getElementById('planVisitas').textContent = r.visitas;
    document.getElementById('planHoras').textContent = formatoH(r.horas);
    const inicio = MESES_LARGO[mesInicio];
    document.getElementById('planInicio').textContent = inicio.charAt(0).toUpperCase() + inicio.slice(1);
    const wsp = document.getElementById('planWsp');
    if (wsp) {
      const lineas = [
        'Hola IMEM, quiero cotizar un plan de mantenimiento:',
        `• Tipo: ${TIPOS_PLAN[datos.tipo]}`,
        `• Tableros: ${datos.tableros}`,
        `• Uso: ${USOS[datos.uso]}`,
        `• Ambiente con polvo, humedad o vibración: ${datos.ambiente ? 'sí' : 'no'}`,
        `Cronograma sugerido en la web: ${r.visitas} visitas al año (${formatoH(r.horas)} cada una), desde ${inicio}.`,
      ];
      wsp.href = waLink(lineas.join('\n'));
    }
    if (animar && !reduceMotion && typeof gsap !== 'undefined') {
      gsap.from(filasEl.querySelectorAll('.crono__dot'), { scale: 0.4, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.012 });
    }
    refrescarST();
  };
  form.addEventListener('change', () => render(true));
  inp.addEventListener('input', debounce(() => render(true), 160));
  inp.addEventListener('blur', () => { inp.value = leer().tableros; });
  form.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    inp.value = Math.min(40, Math.max(1, (parseInt(inp.value, 10) || 1) + parseInt(b.dataset.paso, 10)));
    render(true);
  }));
  render(false);
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const tel = document.getElementById('fTel');
  let mask = null;
  if (typeof IMask !== 'undefined' && tel) {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const campos = [
    { el: document.getElementById('fNombre'), ok: v => v.trim().length >= 2 },
    { el: tel, ok: v => v.replace(/\D/g, '').length >= 10 },
    { el: document.getElementById('fMsg'), ok: v => v.trim().length >= 8 },
  ];
  const marcar = (c, valido) => {
    c.el.setAttribute('aria-invalid', valido ? 'false' : 'true');
    const err = document.getElementById(`${c.el.id}-error`);
    if (err) err.hidden = valido;
  };
  campos.forEach(c => c.el?.addEventListener('blur', () => { if (c.el.value) marcar(c, c.ok(c.el.value)); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    campos.forEach(c => {
      const valido = c.ok(c.el.value);
      marcar(c, valido);
      if (!valido && !primero) primero = c.el;
    });
    if (primero) { primero.focus(); primero.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      mask?.updateValue();
      campos.forEach(c => c.el.setAttribute('aria-invalid', 'false'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const heroPic = document.querySelector('.hero-foto__pic');
  if (heroPic) {
    gsap.to(heroPic, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero-foto', start: 'top top', end: 'bottom top', scrub: true } });
  }
  const hist = document.querySelector('.historia__foto img');
  if (hist) {
    gsap.fromTo(hist, { yPercent: -5 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.historia__foto', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => refrescarST()));
}

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

initCatalogo();
initRail();
initReveals();
initNav();
initWspFloat();
initBuscador();
initAtajos();
initFiltrosDrawer();
initFicha();
initMundos();
initPlan();
initForm();
initParallax();
initFaq();
document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
